import json, glob, re, os, sys
from collections import Counter, defaultdict

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'js', 'data.js')
pf2e = sys.argv[1] if len(sys.argv) > 1 else '../pf2e'
os.chdir(os.path.join(pf2e, 'packs', 'pf2e'))


def load(pattern):
    files = [f for f in glob.glob(pattern, recursive=True) if not f.endswith('_folders.json')]
    return [json.load(open(f)) for f in files]


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def title(s):
    words = s.replace('-', ' ').split()
    return ' '.join(w if w in ('of', 'the', 'and') else w.capitalize() for w in words)


def src(s):
    t = s.get('publication', {}).get('title') or ''
    return t.replace('Pathfinder ', '').replace('Lost Omens ', 'LO: ')


def legacy(s):
    return 0 if s.get('publication', {}).get('remaster') else 1


def rar(s):
    r = s.get('traits', {}).get('rarity', 'common')
    return {'common': 0, 'uncommon': 1, 'rare': 2, 'unique': 3}.get(r, 0)


def dshort(t):
    t = t or 'bludgeoning'
    return {'bludgeoning': 'B', 'piercing': 'P', 'slashing': 'S'}.get(t, t)


def level_value(v):
    if isinstance(v, (int, float)):
        return v
    if isinstance(v, str) and 'level' in v:
        return 'L'
    try:
        return int(v)
    except Exception:
        return None


def item_name(uuid):
    if not isinstance(uuid, str) or '.Item.' not in uuid:
        return None
    name = uuid.split('.Item.')[-1]
    if re.fullmatch(r'[A-Za-z0-9]{16}', name):
        return None
    return name


def boost_sets(boosts):
    out = []
    for b in boosts.values():
        vals = b.get('value', [])
        if vals:
            out.append(vals if len(vals) < 6 else '*')
    return out


def parse_rules(rules):
    m = {}
    for r in rules:
        pred = r.get('predicate')
        if pred and not all(isinstance(x, dict) and set(x) == {'not'} for x in pred):
            continue
        k = r.get('key')
        if k == 'Sense':
            m.setdefault('senses', []).append([r.get('selector'), r.get('acuity'), r.get('range')])
        elif k == 'Resistance':
            t = r.get('type')
            if not isinstance(t, str):
                t = ', '.join(r.get('type', []))
            m.setdefault('resist', []).append([t, level_value(r.get('value'))])
        elif k == 'Weakness':
            m.setdefault('weak', []).append([r.get('type'), level_value(r.get('value'))])
        elif k == 'Immunity':
            m.setdefault('immune', []).append(r.get('type'))
        elif k == 'BaseSpeed':
            m.setdefault('speeds', []).append([r.get('selector', '').replace('-speed', ''), r.get('value')])
        elif k == 'Strike':
            if r.get('fist'):
                m.setdefault('strikes', []).append({'n': 'Fist', 'd': '1d4', 't': 'B', 'tr': ['agile', 'finesse', 'nonlethal', 'unarmed'], 'fist': 1})
                continue
            dmg = (r.get('damage') or {}).get('base') or {}
            name = (r.get('label') or r.get('slug') or r.get('baseType') or 'Unarmed attack').split('.')[-1]
            name = re.sub(r'(?<!^)(?=[A-Z])', ' ', name).strip()
            if dmg.get('die'):
                m.setdefault('strikes', []).append({'n': title(name), 'd': f"{dmg.get('dice', 1)}{dmg['die']}",
                                                    't': dshort(dmg.get('damageType')), 'tr': r.get('traits', []), 'g': r.get('group')})
        elif k == 'GrantItem':
            n = item_name(r.get('uuid'))
            if n:
                m.setdefault('grants', []).append(n)
        elif k == 'CreatureSize':
            if isinstance(r.get('value'), str):
                m['size'] = r['value']
        elif k == 'ActiveEffectLike':
            path = str(r.get('path', ''))
            v = r.get('value')
            x = re.fullmatch(r'system\.skills\.(\w+)\.rank', path)
            if x and isinstance(v, (int, float)):
                m.setdefault('skills', []).append(title(x.group(1)))
            x = re.fullmatch(r'system\.proficiencies\.defenses\.(\w+)\.rank', path)
            if x:
                m.setdefault('def', {})[x.group(1)] = v
            x = re.fullmatch(r'system\.proficiencies\.attacks\.(\w+)\.rank', path)
            if x:
                m.setdefault('atk', {})[x.group(1)] = v
            x = re.fullmatch(r'system\.saves\.(\w+)\.rank', path)
            if x:
                save = 'ref' if x.group(1) == 'reflex' else x.group(1)[:4]
                m.setdefault('saves', {})[save] = v
            if path == 'system.attributes.ancestryhp':
                m['hp'] = v
            if path == 'system.build.languages.max':
                m['langs'] = v
            if path == 'system.details.ancestry.countsAs':
                m.setdefault('countsAs', []).extend(v if isinstance(v, list) else [v])
            if path in ('system.proficiencies.aliases.witch', 'flags.system.eidolon.tradition'):
                m['trad'] = v
    return m


ANC = []
for d in load('ancestries/*.json'):
    s = d['system']
    ANC.append({
        'id': slug(d['name']), 'n': d['name'], 'hp': s['hp'], 'sz': s['size'], 'sp': s['speed'],
        'b': boost_sets(s['boosts']), 'f': [x for v in s['flaws'].values() for x in v.get('value', [])],
        'l': s['languages']['value'], 'al': s['additionalLanguages']['value'], 'ac': s['additionalLanguages'].get('count', 0),
        'v': s.get('vision', 'normal'), 'tr': s['traits']['value'], 'r': rar(s), 's': src(s),
        'feat': [i['name'] for i in s.get('items', {}).values()],
        'rm': 1 - legacy(s),
    })
ANC.sort(key=lambda a: (a['r'], a['n']))

HER = []
for d in load('heritages/**/*.json'):
    s = d['system']
    h = {'id': slug(d['name']), 'n': d['name'], 'a': (s.get('ancestry') or {}).get('slug'), 'r': rar(s), 's': src(s), 'tr': s['traits']['value']}
    h.update(parse_rules(s.get('rules', [])))
    HER.append(h)
HER.sort(key=lambda h: (h['r'], h['n']))

BG = []
for d in load('backgrounds/**/*.json'):
    s = d['system']
    BG.append({'id': slug(d['name']), 'n': d['name'], 'b': boost_sets(s['boosts']),
               'sk': [title(x) for x in s['trainedSkills'].get('value', [])], 'lo': s['trainedSkills'].get('lore', []),
               'ft': [i['name'] for i in s.get('items', {}).values()], 'r': rar(s), 's': src(s), 'lg': legacy(s),
               'x': 1 if any(r.get('key') == 'ChoiceSet' for r in s.get('rules', [])) else 0})
BG.sort(key=lambda b: (b['r'], b['n']))

FEATURES = {d['name']: d for d in load('class-features/**/*.json')}
BY_TAG = defaultdict(list)
for d in FEATURES.values():
    for t in d['system'].get('traits', {}).get('otherTags', []):
        BY_TAG[t].append(d)


def option(o, tag):
    s = o['system']
    rules = parse_rules(s.get('rules', []))
    trad = 'arcane' if o['name'] == 'Bloodline: Draconic' else rules.get('trad')
    if not trad and tag == 'sorcerer-bloodline':
        found = re.findall(r'tradition:(arcane|divine|occult|primal)', json.dumps(s.get('rules', [])))
        if found:
            trad = found[0]
    opt = {'id': slug(o['name']), 'n': o['name'], 'r': rar(s), 's': src(s)}
    for k in ('skills', 'def', 'atk', 'saves', 'grants', 'resist', 'senses'):
        if rules.get(k):
            opt[k] = rules[k]
    if trad:
        opt['trad'] = trad
    return opt


def class_choices(level1):
    choices = []
    for name in level1:
        f = FEATURES.get(name)
        if not f:
            continue
        for r in f['system']['rules']:
            if r.get('key') != 'ChoiceSet' or not isinstance(r.get('choices'), dict):
                continue
            for x in r['choices'].get('filter', []):
                if not (isinstance(x, str) and x.startswith('item:tag:')):
                    continue
                tag = x[9:]
                same = [c for c in choices if c['tag'] == tag]
                if same:
                    same[0]['count'] += 1
                    continue
                opts = [option(o, tag) for o in sorted(BY_TAG[tag], key=lambda o: o['name'])]
                if opts:
                    choices.append({'label': name, 'tag': tag, 'count': 1, 'o': opts})
    return choices


CLS = []
for d in load('classes/*.json'):
    s = d['system']
    level1 = sorted(i['name'] for i in s['items'].values() if i['level'] == 1)
    CLS.append({
        'id': slug(d['name']), 'n': d['name'], 'hp': s['hp'], 'key': s['keyAbility']['value'],
        'perc': s['perception'], 'fort': s['savingThrows']['fortitude'], 'ref': s['savingThrows']['reflex'], 'will': s['savingThrows']['will'],
        'atk': {k: s['attacks'][k] for k in ('simple', 'martial', 'advanced', 'unarmed')}, 'other': s['attacks']['other'],
        'def': s['defenses'], 'sk': [title(x) for x in s['trainedSkills']['value']], 'skc': s['trainedSkills'].get('custom', ''),
        'add': s['trainedSkills']['additional'], 'cast': s['spellcasting'],
        'cf1': 1 in s['classFeatLevels']['value'], 'sf1': 1 in s['skillFeatLevels']['value'],
        'l1': level1, 'ch': class_choices(level1), 'r': rar(s), 's': src(s),
        'prog': sorted([i['level'], i['name']] for i in s['items'].values()),
    })
CLS.sort(key=lambda c: c['n'])

FEATS = []
for d in load('feats/**/*.json'):
    s = d['system']
    if s['level']['value'] != 1 or s['category'] not in ('ancestry', 'class', 'general', 'skill'):
        continue
    kind = s.get('actionType', {}).get('value')
    n = s.get('actions', {}).get('value')
    actions = {'passive': '', 'reaction': 'R', 'free': 'F', 'action': str(n or 1)}.get(kind, '')
    FEATS.append({'n': d['name'], 'c': s['category'][0], 'tr': s['traits']['value'], 'a': actions,
                  'p': [p.get('value') for p in s.get('prerequisites', {}).get('value', []) if p.get('value')],
                  'r': rar(s), 's': src(s), 'lg': legacy(s)})
FEATS.sort(key=lambda f: (f['r'], f['n']))


def kit_contents(items):
    out = []
    for i in items.values():
        out.append(i['name'] + (f" ×{i['quantity']}" if i.get('quantity', 1) > 1 else ''))
        out += kit_contents(i.get('items') or {})
    return out


ITEMS = []
for d in load('equipment/**/*.json'):
    t, s = d['type'], d['system']
    lv = s.get('level', {}).get('value', 0)
    if lv > 1 or t == 'treasure':
        continue
    p = s.get('price', {}).get('value', {}) or {}
    cost = p.get('pp', 0) * 1000 + p.get('gp', 0) * 100 + p.get('sp', 0) * 10 + p.get('cp', 0)
    e = {'id': slug(d['name']) + ('-a' if t == 'ammo' else ''), 'n': d['name'], 'k': t, 'lv': lv, 'pc': cost,
         'bk': (s.get('bulk') or {}).get('value', 0), 'tr': s['traits']['value'], 'r': rar(s), 's': src(s), 'lg': legacy(s)}
    per = s.get('price', {}).get('per')
    if per and per > 1:
        e['per'] = per
    usage = (s.get('usage') or {}).get('value')
    if usage:
        e['u'] = usage
    if t == 'weapon':
        dm = s.get('damage') or {}
        e.update({'cat': s.get('category'), 'g': s.get('group'), 'd': f"{dm.get('dice', 1)}{dm.get('die', 'd4')}",
                  'dt': dshort(dm.get('damageType')), 'rg': s.get('range'), 'rl': (s.get('reload') or {}).get('value'),
                  'bi': s.get('baseItem')})
        if s.get('specific') and (s.get('runes') or {}).get('potency'):
            e['magic'] = 1
    elif t == 'armor':
        e.update({'cat': s.get('category'), 'g': s.get('group'), 'ac': s.get('acBonus', 0), 'cap': s.get('dexCap'),
                  'cpn': s.get('checkPenalty', 0), 'spn': s.get('speedPenalty', 0), 'str': s.get('strength')})
    elif t == 'shield':
        e.update({'ac': s.get('acBonus', 0), 'hd': s.get('hardness', 0), 'hpx': (s.get('hp') or {}).get('max', 0), 'spn': s.get('speedPenalty', 0)})
    elif t == 'consumable':
        e['cat'] = s.get('category')
        dm = s.get('damage')
        if dm and dm.get('formula'):
            e['dmg'] = f"{dm['formula']} {dm.get('type', '')}"
    elif t == 'kit':
        e['inc'] = kit_contents(s.get('items', {}))
    ITEMS.append(e)
ITEMS.sort(key=lambda i: (i['k'], i['r'], i['n']))

count = Counter()
for i in ITEMS:
    count[i['id']] += 1
    if count[i['id']] > 1:
        i['id'] += f"-{count[i['id']]}"

SPELLS = []
for d in load('spells/**/*.json'):
    s = d['system']
    tr = s['traits']['value']
    cantrip = 'cantrip' in tr
    trads = s['traits'].get('traditions', [])
    if 'focus' in tr or s.get('ritual') or not trads or (not cantrip and s['level']['value'] != 1):
        continue
    defense = s.get('defense') or {}
    sp = {'n': d['name'], 'c': 1 if cantrip else 0, 'td': trads, 'tr': [x for x in tr if x != 'cantrip'], 'r': rar(s), 's': src(s), 'lg': legacy(s),
          't': (s.get('time') or {}).get('value', ''), 'rg': (s.get('range') or {}).get('value', ''),
          'tg': (s.get('target') or {}).get('value', ''), 'du': (s.get('duration') or {}).get('value', ''),
          'df': (defense.get('save') or {}).get('statistic') or (defense.get('passive') or {}).get('statistic') or ''}
    area = s.get('area')
    if area:
        sp['ar'] = f"{area.get('value')}-foot {area.get('type')}"
    dmg = [f"{v.get('formula')} {v.get('type') or ''}".strip() for v in (s.get('damage') or {}).values() if v.get('formula')]
    if dmg:
        sp['dm'] = dmg
    if (s.get('duration') or {}).get('sustained'):
        sp['su'] = 1
    SPELLS.append(sp)
SPELLS.sort(key=lambda x: (x['r'], x['n']))

DATA = {'anc': ANC, 'her': HER, 'bg': BG, 'cls': CLS, 'feats': FEATS, 'items': ITEMS, 'spells': SPELLS}
text = json.dumps(DATA, separators=(',', ':'), ensure_ascii=False)
open(OUT, 'w').write('const DATA = ' + text + ';\n')
print({k: len(v) for k, v in DATA.items()}, round(len(text) / 1024), 'KB')