const AT = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const ATN = { str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };
const ATS = { str: 'Str', dex: 'Dex', con: 'Con', int: 'Int', wis: 'Wis', cha: 'Cha' };
const RANK = ['Untrained', 'Trained', 'Expert', 'Master', 'Legendary'];
const RL = ['U', 'T', 'E', 'M', 'L'];
const RAR = ['Common', 'Uncommon', 'Rare', 'Unique'];
const LEVEL = 1;
const BUDGET = 1500;
const AON = 'https://2e.aonprd.com/';
const SKILLS = { Acrobatics: 'dex', Arcana: 'int', Athletics: 'str', Crafting: 'int', Deception: 'cha', Diplomacy: 'cha', Intimidation: 'cha', Medicine: 'wis', Nature: 'wis', Occultism: 'int', Performance: 'cha', Religion: 'wis', Society: 'int', Stealth: 'dex', Survival: 'wis', Thievery: 'dex' };
const COMMON_LANGS = ['common', 'draconic', 'dwarven', 'elven', 'fey', 'gnomish', 'goblin', 'halfling', 'jotun', 'orcish', 'sakvroth', 'kelish', 'mwangi', 'skald', 'tien', 'varisian', 'vudrani'];
const SIZE = { tiny: 'Tiny', sm: 'Small', med: 'Medium', lg: 'Large' };
const VISION = { darkvision: 'Darkvision', 'low-light-vision': 'Low-light vision', normal: '' };

const ANC = {}, CLS = {}, ITEM = {}, BGI = {}, HERS = {}, FEATI = {}, SPELLI = {};
DATA.anc.forEach(a => ANC[a.id] = a);
DATA.cls.forEach(c => CLS[c.id] = c);
DATA.items.forEach(i => ITEM[i.id] = i);
DATA.bg.forEach(b => BGI[b.id] = b);
DATA.her.forEach(h => HERS[h.id] = h);
DATA.feats.forEach(f => FEATI[f.n] = f);
DATA.spells.forEach(s => SPELLI[s.n] = s);
const VERS = DATA.her.filter(h => !h.a);

const CONDITIONS = [
  { id: 'blinded', n: 'Blinded', d: 'You can’t see.' },
  { id: 'clumsy', n: 'Clumsy', v: 1, d: 'Penalty to Dexterity-based checks and DCs, including AC and Reflex.' },
  { id: 'concealed', n: 'Concealed', d: 'Attackers must pass a DC 5 flat check.' },
  { id: 'confused', n: 'Confused', d: 'You act erratically and may attack the nearest creature.' },
  { id: 'dazzled', n: 'Dazzled', d: 'Things you can only see are concealed from you.' },
  { id: 'deafened', n: 'Deafened', d: 'You can’t hear.' },
  { id: 'doomed', n: 'Doomed', v: 1, d: 'You die at a lower dying value.' },
  { id: 'drained', n: 'Drained', v: 1, d: 'Penalty to Constitution-based checks and lower maximum HP.' },
  { id: 'dying', n: 'Dying', v: 1, d: 'Unconscious and close to death.' },
  { id: 'enfeebled', n: 'Enfeebled', v: 1, d: 'Penalty to Strength-based rolls, DCs and damage.' },
  { id: 'fascinated', n: 'Fascinated', d: '−2 to Perception and skill checks.' },
  { id: 'fatigued', n: 'Fatigued', d: '−1 to AC and saves.' },
  { id: 'frightened', n: 'Frightened', v: 1, d: 'Penalty to all checks and DCs. Drops by 1 each turn.' },
  { id: 'grabbed', n: 'Grabbed', d: 'Off-guard and immobilized.' },
  { id: 'hidden', n: 'Hidden', d: 'Others know where you are but can’t see you.' },
  { id: 'immobilized', n: 'Immobilized', d: 'You can’t move.' },
  { id: 'off-guard', n: 'Off-guard', d: '−2 to AC.' },
  { id: 'paralyzed', n: 'Paralyzed', d: 'Off-guard and can’t act.' },
  { id: 'prone', n: 'Prone', d: 'Off-guard and −2 to attack rolls.' },
  { id: 'quickened', n: 'Quickened', d: 'One extra action each turn.' },
  { id: 'restrained', n: 'Restrained', d: 'Off-guard and immobilized, can’t attack.' },
  { id: 'sickened', n: 'Sickened', v: 1, d: 'Penalty to all checks and DCs.' },
  { id: 'slowed', n: 'Slowed', v: 1, d: 'You lose that many actions each turn.' },
  { id: 'stunned', n: 'Stunned', v: 1, d: 'You lose that many actions, then it ends.' },
  { id: 'stupefied', n: 'Stupefied', v: 1, d: 'Penalty to Int, Wis and Cha checks and DCs, including Will and spells.' },
  { id: 'unconscious', n: 'Unconscious', d: '−4 to AC, Perception and Reflex.' },
  { id: 'wounded', n: 'Wounded', v: 1, d: 'Your dying value starts higher next time.' }
];
const SWASH_STYLE = {
  battledancer: ['Performance', 'Perform'], braggart: ['Intimidation', 'Demoralize'],
  fencer: ['Deception', 'Feint or Create a Diversion'], gymnast: ['Athletics', 'Grapple, Shove or Trip'],
  rascal: ['Thievery', 'Dirty Trick'], wit: ['Diplomacy', 'Bon Mot']
};

const GUEST_KEY = 'waymark-pf2-v2';
let storeKey = GUEST_KEY;

function newId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function blankChar() {
  return {
    name: '', anc: null, her: null, alt: false, bg: null, cls: null, key: null, subs: {}, grp: null,
    bo: { anc: { f: [], c: [] }, bg: { f: [], c: [] }, lvl: [] },
    skills: [], langs: [], feats: { anc: null, cls: null, skill: null, gen: null },
    spells: { c: [], r1: [] }, inv: [], worn: null, sh: null, notes: '', portrait: '', comps: [],
    play: { hp: null, temp: 0, hero: 1, conds: {}, raised: false, panache: false }
  };
}

function isStr(v) { return typeof v === 'string'; }
function strList(v) { return Array.isArray(v) ? v.filter(isStr).slice(0, 200) : []; }
function clamp(v, lo, hi, def) { return Number.isFinite(v) ? Math.min(hi, Math.max(lo, Math.round(v))) : def; }
function goodImage(s, max) { return isStr(s) && s.length <= max && /^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(s); }
function isItem(id) { return isStr(id) && Object.prototype.hasOwnProperty.call(ITEM, id); }

function cleanChar(d) {
  const c = blankChar();
  if (!d || typeof d !== 'object') return c;
  if (isStr(d.name)) c.name = d.name.slice(0, 120);
  if (isStr(d.notes)) c.notes = d.notes.slice(0, 20000);
  for (const k of ['anc', 'her', 'bg', 'cls', 'key', 'grp', 'worn', 'sh']) c[k] = isStr(d[k]) ? d[k] : null;
  c.alt = d.alt === true;
  if (d.subs && typeof d.subs === 'object') {
    for (const t of Object.keys(d.subs)) if (t !== '__proto__') c.subs[t] = strList(d.subs[t]);
  }
  const bo = d.bo || {};
  const slots = v => Array.isArray(v) ? v.slice(0, 6).map(x => isStr(x) ? x : null) : [];
  c.bo.anc = { f: strList(bo.anc && bo.anc.f), c: slots(bo.anc && bo.anc.c) };
  c.bo.bg = { f: strList(bo.bg && bo.bg.f), c: slots(bo.bg && bo.bg.c) };
  c.bo.lvl = strList(bo.lvl);
  c.skills = strList(d.skills);
  c.langs = strList(d.langs);
  const ft = d.feats || {};
  for (const k in c.feats) c.feats[k] = isStr(ft[k]) ? ft[k] : null;
  const sp = d.spells || {};
  c.spells = { c: strList(sp.c), r1: strList(sp.r1) };
  if (isStr(sp._trad)) c.spells._trad = sp._trad;
  if (Array.isArray(d.inv)) {
    c.inv = d.inv.filter(x => x && isItem(x.id) && Number.isFinite(x.q) && x.q > 0).slice(0, 500)
      .map(x => ({ id: x.id, q: Math.min(9999, Math.floor(x.q)) }));
  }
  if (goodImage(d.portrait, 160000)) c.portrait = d.portrait;
  if (Array.isArray(d.comps)) c.comps = d.comps.slice(0, 4).map(cleanComp).filter(Boolean);
  const p = d.play || {};
  c.play.hp = Number.isFinite(p.hp) ? clamp(p.hp, 0, 9999) : null;
  c.play.temp = clamp(p.temp, 0, 999, 0);
  c.play.hero = clamp(p.hero, 0, 3, 1);
  c.play.raised = p.raised === true;
  c.play.panache = p.panache === true;
  if (p.conds && typeof p.conds === 'object') {
    for (const cd of CONDITIONS) {
      const v = p.conds[cd.id];
      if (cd.v && Number.isFinite(v) && v >= 1) c.play.conds[cd.id] = Math.min(9, Math.round(v));
      if (!cd.v && v === true) c.play.conds[cd.id] = true;
    }
  }
  if (Number.isFinite(d.updatedAt)) c.updatedAt = d.updatedAt;
  return c;
}

const C_SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge'];
const DICE_RE = /^\d{1,2}d(4|6|8|10|12|20)$/;

function cleanComp(x) {
  if (!x || !['animal', 'familiar', 'custom'].includes(x.kind)) return null;
  const o = { id: isStr(x.id) ? x.id.slice(0, 64) : newId(), kind: x.kind, name: isStr(x.name) ? x.name.slice(0, 60) : '', portrait: goodImage(x.portrait, 90000) ? x.portrait : '' };
  const txt = (v, n) => isStr(v) ? v.slice(0, n) : '';
  if (x.kind === 'animal') {
    if (!ANIMAL_COMPANIONS.some(t => t.id === x.type)) return null;
    o.type = x.type;
  } else if (x.kind === 'familiar') {
    o.abil = Array.isArray(x.abil) ? x.abil.filter(id => FAMILIAR_ABILITIES.some(f => f.id === id)).slice(0, 8) : [];
    o.per = clamp(x.per, 1, 6, 2);
    o.swim = x.swim === true;
  } else {
    o.label = txt(x.label, 40);
    o.size = C_SIZES.includes(x.size) ? x.size : 'Small';
    o.hp = clamp(x.hp, 0, 9999, 10);
    o.ac = clamp(x.ac, 0, 99, 15);
    for (const k of ['perc', 'fort', 'ref', 'will']) o[k] = clamp(x[k], -20, 99, 0);
    o.speed = txt(x.speed, 80);
    o.senses = txt(x.senses, 120);
    o.notes = txt(x.notes, 2000);
    const rows = Array.isArray(x.skills) ? x.skills : [];
    o.skills = rows.filter(s => s).slice(0, 12).map(s => ({ n: txt(s.n, 30), v: clamp(s.v, -20, 99, 0) }));
    const atks = Array.isArray(x.atk) ? x.atk : [];
    o.atk = atks.filter(t => t).slice(0, 6).map(t => ({ n: txt(t.n, 30), b: clamp(t.b, -20, 99, 0), d: DICE_RE.test(t.d) ? t.d : '1d6', m: clamp(t.m, -20, 99, 0), t: txt(t.t, 20), tr: txt(t.tr, 80) }));
  }
  return o;
}

function fixCurrent(st) {
  if (st.chars[st.current]) return;
  const ids = Object.keys(st.chars);
  if (ids.length) st.current = ids[0];
  else { st.current = newId(); st.chars[st.current] = blankChar(); }
}

function load(key) {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(key || storeKey)); } catch (e) {}
  const st = { current: null, chars: {}, step: 'ancestry', deleted: {} };
  if (s && s.chars && typeof s.chars === 'object') {
    for (const id of Object.keys(s.chars)) if (id.length <= 64 && id !== '__proto__') st.chars[id] = cleanChar(s.chars[id]);
    for (const id of Object.keys(s.deleted || {})) if (Number.isFinite(s.deleted[id])) st.deleted[id] = s.deleted[id];
    if (isStr(s.current)) st.current = s.current;
    if (isStr(s.step)) st.step = s.step;
  }
  fixCurrent(st);
  return st;
}

let store = load();
function C() { return store.chars[store.current]; }

const SNAP = {};
function sig(ch) { const o = Object.assign({}, ch); delete o.updatedAt; return JSON.stringify(o); }
function isPristine(ch) { return sig(ch) === sig(blankChar()); }
function resetSnap() {
  for (const k in SNAP) delete SNAP[k];
  for (const id in store.chars) SNAP[id] = sig(store.chars[id]);
}
function saveStore() { try { localStorage.setItem(storeKey, JSON.stringify(store)); } catch (e) {} }
function persist() {
  let changed = false;
  for (const id in store.chars) {
    const s = sig(store.chars[id]);
    if (SNAP[id] !== undefined && SNAP[id] !== s) { store.chars[id].updatedAt = Date.now(); changed = true; }
    SNAP[id] = s;
  }
  saveStore();
  if (changed && window.WaymarkSync) WaymarkSync.schedule();
}

const UI = { open: new Set(), lists: {}, lastStep: null, railStep: null, prev: {}, pop: null, popCell: null, showList: {}, confirmDelete: false, invTab: 'weapon', imgMsg: '', confirmComp: null, editComp: null, sheetTab: 'skills', condOpen: false, restMsg: '' };
function L(id) {
  if (!UI.lists[id]) UI.lists[id] = { q: '', rar: ['anc', 'vh', 'cls'].includes(id) ? 'all' : 'common', lim: ['anc', 'cls'].includes(id) ? 60 : 40 };
  return UI.lists[id];
}

function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
function sg(n) { return (n >= 0 ? '+' : '−') + Math.abs(n); }
function prof(r) { return r > 0 ? r * 2 + LEVEL : 0; }
function rk(r, long) { return `<span class="rk r${r}${long ? ' long' : ''}" title="${RANK[r]}">${long ? RANK[r] : RL[r]}</span>`; }
function titleCase(s) { return String(s || '').replace(/[-_]/g, ' ').replace(/\b\w/g, m => m.toUpperCase()); }
function listJoin(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
function money(cp) {
  const neg = cp < 0;
  cp = Math.abs(Math.round(cp));
  const parts = [];
  if (cp >= 100) parts.push(Math.floor(cp / 100) + ' gp');
  if (cp % 100 >= 10) parts.push(Math.floor(cp % 100 / 10) + ' sp');
  if (cp % 10 || !parts.length) parts.push(cp % 10 + ' cp');
  return (neg ? '−' : '') + parts.join(' ');
}
function bulkStr(b) { return b === 0 ? '—' : b < 1 ? 'L' : String(b); }
function dmgText(die, m, type) { return die + (m ? (m > 0 ? '+' : '−') + Math.abs(m) : '') + (type ? ' ' + type : ''); }
function aonA(q, label) { return `<a href="${AON}Search.aspx?q=${encodeURIComponent(q)}" target="_blank" rel="noopener">${esc(label || 'Full text on Archives of Nethys')}</a>`; }
function traitChips(tr, r, lg) {
  let h = '';
  if (r) h += `<button class="tr r${r}" data-act="trait" data-t="${RAR[r].toLowerCase()}">${RAR[r]}</button>`;
  for (const t of tr || []) h += `<button class="tr" data-act="trait" data-t="${esc(t)}">${esc(t.replace(/-/g, ' '))}</button>`;
  if (lg) h += '<span class="tr lg" title="Printed before the Remaster">Legacy</span>';
  return h ? `<div class="traits">${h}</div>` : '';
}
function rarBadge(r) { return r ? `<span class="tr r${r}">${RAR[r]}</span>` : ''; }
function actGlyph(a) {
  if (a === 'R') return 'Reaction';
  if (a === 'F') return 'Free action';
  if (!a) return '';
  return a + (a === '1' ? ' action' : ' actions');
}
function traitDef(t) {
  const base = t.replace(/-(d\d+|\d+|[bps])$/, '').replace(/-\d+$/, '');
  if (TRAIT[t] || TRAIT[base]) return TRAIT[t] || TRAIT[base];
  if (ANC[t]) return `Associated with the ${ANC[t].n.toLowerCase()} ancestry.`;
  if (CLS[t]) return `Associated with the ${CLS[t].n.toLowerCase()} class.`;
  return '';
}
function strNeed(v) { return v == null ? null : v > 5 ? Math.floor((v - 10) / 2) : v; }

function entry(key, o) {
  const open = UI.open.has(key);
  return `<div class="ent ${open ? 'open' : ''} ${o.sel ? 'sel' : ''}" data-key="${esc(key)}">
    <button class="ent-h" data-act="tog" data-k="${esc(key)}">
      <svg class="chev" viewBox="0 0 16 16"><path d="M6 3.5L10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span class="nm">${o.title}${o.badge || ''}</span><span class="mt num">${o.meta || ''}</span>
    </button>
    <div class="ent-b"><div><div class="ent-in">${o.body}</div></div></div>
  </div>`;
}
function filtered(id, arr, text) {
  const st = L(id), q = st.q.trim().toLowerCase();
  return arr.filter(x => {
    if (st.rar === 'common' && x.r > 0) return false;
    if (st.rar === 'uncommon' && x.r !== 1) return false;
    if (st.rar === 'rare' && x.r < 2) return false;
    return !q || text(x).toLowerCase().includes(q);
  });
}
function filterBar(id, placeholder) {
  const st = L(id);
  const btns = ['common', 'uncommon', 'rare', 'all'].map(r => `<button class="${st.rar === r ? 'sel' : ''}" data-act="rar" data-l="${id}" data-r="${r}">${titleCase(r)}</button>`).join('');
  return `<div class="filters"><input class="input" data-list="${id}" value="${esc(st.q)}" placeholder="${placeholder}" autocomplete="off"><div class="seg">${btns}</div></div>`;
}
function paged(id, items, one, emptyMsg) {
  const lim = L(id).lim;
  if (!items.length) return `<div class="list"><div class="empty">${emptyMsg}</div></div>`;
  let h = '<div class="list">' + items.slice(0, lim).map(one).join('');
  if (items.length > lim) h += `<div class="more"><button class="btn line sm" data-act="more" data-l="${id}">Show ${Math.min(40, items.length - lim)} more of ${items.length - lim}</button></div>`;
  return h + '</div>';
}

function condPenalty(conds, kind, attr) {
  const val = id => conds[id] === true ? 1 : (conds[id] || 0);
  const status = [], circ = [];
  const add = (list, n, why) => { if (n) list.push([n, why]); };
  if (kind === 'damage') {
    if (attr === 'str') add(status, val('enfeebled'), 'enfeebled ' + val('enfeebled'));
  } else {
    add(status, val('frightened'), 'frightened ' + val('frightened'));
    add(status, val('sickened'), 'sickened ' + val('sickened'));
    if (attr === 'dex') add(status, val('clumsy'), 'clumsy ' + val('clumsy'));
    if (attr === 'str') add(status, val('enfeebled'), 'enfeebled ' + val('enfeebled'));
    if (attr === 'con') add(status, val('drained'), 'drained ' + val('drained'));
    if (['int', 'wis', 'cha'].includes(attr)) add(status, val('stupefied'), 'stupefied ' + val('stupefied'));
    if (conds.fatigued && (kind === 'ac' || kind === 'save')) add(status, 1, 'fatigued');
    if (conds.unconscious && (kind === 'ac' || kind === 'perception' || (kind === 'save' && attr === 'dex'))) add(status, 4, 'unconscious');
    if (conds.fascinated && (kind === 'perception' || kind === 'skill')) add(status, 2, 'fascinated');
    const off = conds['off-guard'] || conds.grabbed || conds.restrained || conds.paralyzed || conds.prone || conds.unconscious;
    if (kind === 'ac' && off) add(circ, 2, 'off-guard');
    if (kind === 'attack' && conds.prone) add(circ, 2, 'prone');
  }
  status.sort((a, b) => b[0] - a[0]);
  circ.sort((a, b) => b[0] - a[0]);
  const worst = [status[0], circ[0]].filter(Boolean);
  return { n: worst.reduce((t, x) => t + x[0], 0), why: worst.map(x => x[1]) };
}

function rb(label, mod, text) {
  return `<button class="rollv num" data-roll="check" data-l="${esc(label)}" data-m="${mod}" title="Roll ${esc(label)}">${text ?? sg(mod)}</button>`;
}
function strikeRolls(name, s) {
  const ord = ['', ' (2nd attack)', ' (3rd attack)'];
  const atk = [0, s.map[0], s.map[1]].map((p, i) => rb(name + ord[i], s.atk + p)).join('');
  const d = `data-roll="dmg" data-l="${esc(name)}" data-d="${esc(s.die)}" data-m="${s.dm}" data-t="${esc(s.dt)}" data-tr="${esc((s.tr || []).join(','))}"`;
  return `<div class="rolls"><span class="rl-lab">Attack</span>${atk}</div>
    <div class="rolls"><span class="rl-lab">Damage</span><button class="rollv" ${d}>${esc(s.dmgStr)}</button><button class="rollv crit" ${d} data-crit="1">Critical</button></div>`;
}

function avatar(src, name, cls) {
  if (src) return `<img class="avatar ${cls || ''}" src="${src}" alt="${esc(name || 'Portrait')}">`;
  return `<span class="avatar ph ${cls || ''}">${esc((name || '?').trim().charAt(0).toUpperCase() || '?')}</span>`;
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('Choose an image file, like a JPG or PNG.'));
    if (file.size > 15 * 1024 * 1024) return reject(new Error('That image is over 15 MB. Try a smaller one.'));
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('That image couldn’t be read.'));
    fr.onload = () => {
      const im = new Image();
      im.onerror = () => reject(new Error('That image couldn’t be read. Try a JPG or PNG.'));
      im.onload = () => resolve(im);
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

const CROP_SIZE = 260;
let crop = null;

function cropBox() {
  let w = document.getElementById('cropwrap');
  if (!w) { w = document.createElement('div'); w.id = 'cropwrap'; document.body.appendChild(w); }
  return w;
}
function cropScale() { return Math.max(CROP_SIZE / crop.img.width, CROP_SIZE / crop.img.height) * crop.zoom; }
function cropDraw(canvas, size) {
  const s = cropScale(), w = crop.img.width * s, h = crop.img.height * s;
  const mx = Math.max(0, (w - CROP_SIZE) / 2), my = Math.max(0, (h - CROP_SIZE) / 2);
  crop.x = Math.min(mx, Math.max(-mx, crop.x));
  crop.y = Math.min(my, Math.max(-my, crop.y));
  const k = size / CROP_SIZE, g = canvas.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, size, size);
  g.drawImage(crop.img, (size - w * k) / 2 + crop.x * k, (size - h * k) / 2 + crop.y * k, w * k, h * k);
}
function openCropper(target, img) {
  crop = { target, img, zoom: 1, x: 0, y: 0 };
  cropBox().innerHTML = `<div class="crop-scrim"></div>
    <div class="crop">
      <h3>Position your ${target === 'char' ? 'portrait' : 'picture'}</h3>
      <p class="small muted">Drag the image to move it and use the slider to zoom. Only the part inside the circle is kept.</p>
      <div class="crop-stage" tabindex="0"><canvas width="${CROP_SIZE * 2}" height="${CROP_SIZE * 2}" style="width:${CROP_SIZE}px;height:${CROP_SIZE}px"></canvas><div class="crop-ring"></div></div>
      <label class="crop-zoom"><span>Zoom</span><input type="range" min="1" max="4" step="0.01" value="1"></label>
      <div class="crop-act"><button class="btn ghost" data-crop="cancel">Cancel</button><button class="btn primary" data-crop="save">Save</button></div>
    </div>`;
  const stage = cropBox().querySelector('.crop-stage');
  const cv = stage.querySelector('canvas');
  const zoom = cropBox().querySelector('input');
  const redraw = () => cropDraw(cv, CROP_SIZE * 2);
  const setZoom = z => { crop.zoom = Math.min(4, Math.max(1, z)); zoom.value = crop.zoom; redraw(); };
  redraw();
  let drag = null;
  stage.onpointerdown = e => { drag = { x: e.clientX, y: e.clientY, ox: crop.x, oy: crop.y }; stage.setPointerCapture(e.pointerId); };
  stage.onpointermove = e => { if (drag) { crop.x = drag.ox + e.clientX - drag.x; crop.y = drag.oy + e.clientY - drag.y; redraw(); } };
  stage.onpointerup = stage.onpointercancel = () => drag = null;
  stage.addEventListener('wheel', e => { e.preventDefault(); setZoom(crop.zoom - e.deltaY * 0.002); }, { passive: false });
  stage.onkeydown = e => {
    const step = e.shiftKey ? 20 : 6;
    if (e.key === 'ArrowLeft') crop.x += step;
    else if (e.key === 'ArrowRight') crop.x -= step;
    else if (e.key === 'ArrowUp') crop.y += step;
    else if (e.key === 'ArrowDown') crop.y -= step;
    else if (e.key === '+' || e.key === '=') return setZoom(crop.zoom + 0.1);
    else if (e.key === '-') return setZoom(crop.zoom - 0.1);
    else return;
    e.preventDefault();
    redraw();
  };
  zoom.oninput = () => setZoom(+zoom.value);
  stage.focus();
}
function closeCropper() { crop = null; cropBox().innerHTML = ''; }
function saveCrop() {
  const c = C(), forChar = crop.target === 'char', size = forChar ? 384 : 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  cropDraw(cv, size);
  let q = 0.86, img = cv.toDataURL('image/jpeg', q);
  while (img.length > (forChar ? 150000 : 85000) && q > 0.4) { q -= 0.08; img = cv.toDataURL('image/jpeg', q); }
  const old = forChar ? c.portrait : c.comps[+crop.target].portrait;
  if (forChar) c.portrait = img; else c.comps[+crop.target].portrait = img;
  if (JSON.stringify(c).length > 240000) {
    if (forChar) c.portrait = old; else c.comps[+crop.target].portrait = old;
    UI.imgMsg = 'This character has too many large pictures to save. Remove a companion picture first.';
  } else UI.imgMsg = '';
  closeCropper();
  render();
}

const COMP_TYPE = {};
ANIMAL_COMPANIONS.forEach(t => COMP_TYPE[t.id] = t);
const FAM_ABIL = {};
FAMILIAR_ABILITIES.forEach(f => FAM_ABIL[f.id] = f);
function traitList(s) { return String(s || '').split(',').map(t => t.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean).slice(0, 12); }

function compStats(cp) {
  if (cp.kind === 'custom') {
    const strikes = cp.atk.filter(t => t.n.trim()).map(t => {
      const tr = traitList(t.tr), ok = DICE_RE.test(t.d);
      return { n: t.n.trim(), atk: t.b, die: ok ? t.d : '', dm: t.m, dt: t.t.trim(), tr, ok,
        dmgStr: ok ? dmgText(t.d, t.m, t.t.trim()) : 'Check the damage dice', map: tr.includes('agile') ? [-4, -8] : [-5, -10] };
    });
    return { hp: cp.hp, ac: cp.ac, perc: cp.perc, saves: { fort: cp.fort, ref: cp.ref, will: cp.will },
      skills: cp.skills.filter(s => s.n.trim()).map(s => ({ n: s.n.trim(), v: s.v })), strikes,
      speed: cp.speed || '—', senses: cp.senses || '—', size: cp.size };
  }
  const P = prof(1);
  if (cp.kind === 'animal') {
    const T = COMP_TYPE[cp.type];
    if (!T) return null;
    const m = {};
    AT.forEach((k, i) => m[k] = T.m[i]);
    const skills = [['Acrobatics', 'dex'], ['Athletics', 'str']];
    if (SKILLS[T.skill] && T.skill !== 'Acrobatics' && T.skill !== 'Athletics') skills.push([T.skill, SKILLS[T.skill]]);
    return {
      T, m, hp: T.hp + (6 + m.con) * LEVEL, ac: 10 + m.dex + P, perc: m.wis + P,
      saves: { fort: m.con + P, ref: m.dex + P, will: m.wis + P },
      skills: skills.map(([n, k]) => ({ n, v: m[k] + P })),
      strikes: T.atk.map(([n, d, t, tr]) => {
        const useDex = tr.includes('finesse') && m.dex > m.str;
        return { n, atk: (useDex ? m.dex : m.str) + P, die: d, dm: m.str, dt: t, tr, dmgStr: dmgText(d, m.str, t), map: tr.includes('agile') ? [-4, -8] : [-5, -10] };
      }),
      speed: T.speed, senses: T.senses, size: T.size
    };
  }
  const has = id => cp.abil.includes(id);
  const att = D.spell && D.keyAttr ? D.keyAttr : 'cha';
  const sk = LEVEL + D.mods[att];
  const base = has('fast-movement') ? 40 : 25;
  const sp = [];
  if (cp.swim) { if (has('amphibious')) sp.push('25 ft'); sp.push(`swim ${base} ft`); }
  else { sp.push(base + ' ft'); if (has('amphibious')) sp.push('swim 25 ft'); }
  if (has('climber')) sp.push('climb 25 ft');
  if (has('flier')) sp.push('fly 25 ft');
  if (has('burrower')) sp.push('burrow 5 ft');
  const senses = ['Low-light vision'];
  if (has('darkvision')) senses.push('darkvision');
  if (has('scent')) senses.push('scent (imprecise, 30 ft)');
  return { hp: 5 * LEVEL + (has('tough') ? 2 * LEVEL : 0), ac: D.ac, perc: sk, saves: D.saves,
    skills: [{ n: 'Acrobatics', v: sk }, { n: 'Stealth', v: sk }], strikes: [], speed: sp.join(', '), senses: senses.join(', '), size: 'Tiny', att };
}

function groupOf(sets) {
  const g = { fixed: [], choices: [], free: 0 };
  for (const s of sets || []) {
    if (s === '*') g.free++;
    else if (s.length === 1) g.fixed.push(s[0]);
    else g.choices.push(s);
  }
  return g;
}
function subOpts(c, K) {
  const out = [];
  if (!K) return out;
  for (const ch of K.ch) {
    const picked = (c.subs[ch.tag] || []).filter(id => ch.o.some(o => o.id === id)).slice(0, ch.count);
    for (const id of picked) out.push(Object.assign({}, ch.o.find(o => o.id === id), SUB_OVR[id] || {}));
  }
  return out;
}

function derive(c) {
  const A = ANC[c.anc] || null;
  const H = c.her && HERS[c.her] ? Object.assign({}, HERS[c.her], HER_OVR[c.her] || {}) : null;
  const B = BGI[c.bg] || null;
  const K = CLS[c.cls] || null;
  const KX = K ? CLASS_EXTRA[K.id] || {} : {};
  const SUBS = subOpts(c, K);
  const keys = K ? (KX.key || K.key).slice() : [];
  for (const s of SUBS) for (const k of s.key || []) if (!keys.includes(k)) keys.push(k);
  const keyAttr = keys.length === 1 ? keys[0] : keys.includes(c.key) ? c.key : null;

  const rows = [], flaws = [];
  function groupRows(gid, label, sets, isAnc) {
    const g = isAnc && c.alt ? { fixed: [], choices: [], free: 2 } : groupOf(sets);
    const st = c.bo[gid];
    const chosenC = g.choices.map((opts, i) => opts.includes(st.c[i]) ? st.c[i] : null);
    const usedC = chosenC.filter(Boolean);
    const free = st.f.filter(a => !g.fixed.includes(a) && !usedC.includes(a)).slice(0, g.free);
    const fl = isAnc && !c.alt && A ? A.f : [];
    flaws.push(...fl);
    if (g.fixed.length || g.free || fl.length) {
      rows.push({ id: gid + 'f', gid, label, note: g.free ? (g.fixed.length ? 'Fixed boosts plus ' : '') + g.free + ' free' : 'Set by your choice',
        fixed: g.fixed, flaw: fl, chosen: free, max: g.free, allow: a => !g.fixed.includes(a) && !usedC.includes(a) });
    }
    g.choices.forEach((opts, i) => {
      const others = [...g.fixed, ...free, ...usedC.filter((x, j) => j !== i)];
      rows.push({ id: gid + 'c' + i, gid, label: label + ', one of', note: opts.map(a => ATN[a]).join(' or '), fixed: [], flaw: [],
        chosen: chosenC[i] ? [chosenC[i]] : [], max: 1, single: true, ci: i, allow: a => opts.includes(a) && !others.includes(a) });
    });
  }
  const offRow = (id, label, note) => ({ id, label, note, fixed: [], flaw: [], chosen: [], max: 0, allow: () => false, off: true });
  if (A) groupRows('anc', 'Ancestry', A.b, true); else rows.push(offRow('ancx', 'Ancestry', 'Choose an ancestry first'));
  if (B) groupRows('bg', 'Background', B.b, false); else rows.push(offRow('bgx', 'Background', 'Choose a background first'));
  rows.push({ id: 'cls', label: 'Class key attribute', note: K ? (keys.length > 1 ? keys.map(k => ATN[k]).join(' or ') : K.n) : 'Choose a class first',
    fixed: keys.length === 1 ? keys : [], flaw: [], chosen: keys.length > 1 && keyAttr ? [keyAttr] : [], max: keys.length > 1 ? 1 : 0,
    single: true, allow: a => keys.length > 1 && keys.includes(a), off: !K });
  rows.push({ id: 'lvl', label: 'Level 1', note: 'Four free boosts, each to a different attribute', fixed: [], flaw: [], chosen: c.bo.lvl.slice(0, 4), max: 4, allow: () => true });
  const mods = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  for (const r of rows) { r.fixed.forEach(a => mods[a]++); r.chosen.forEach(a => mods[a]++); }
  flaws.forEach(a => mods[a]--);
  let boostsLeft = 0, boostsTotal = 0;
  for (const r of rows) if (!r.off) { boostsLeft += Math.max(0, r.max - r.chosen.length); boostsTotal += r.max; }

  const ranks = K ? { perc: K.perc, fort: K.fort, ref: K.ref, will: K.will } : { perc: 0, fort: 0, ref: 0, will: 0 };
  const defR = K ? Object.assign({}, K.def) : { unarmored: 0, light: 0, medium: 0, heavy: 0 };
  const atkR = K ? Object.assign({}, K.atk) : { simple: 0, martial: 0, advanced: 0, unarmed: 0 };
  const num = v => typeof v === 'number' ? v : 1;
  for (const s of [...SUBS, H || {}]) {
    for (const k in s.def || {}) defR[k] = Math.max(defR[k] || 0, num(s.def[k]));
    for (const k in s.atk || {}) atkR[k] = Math.max(atkR[k] || 0, num(s.atk[k]));
    for (const k in s.saves || {}) {
      const kk = k === 'fort' || k === 'fortitude' ? 'fort' : k === 'will' ? 'will' : 'ref';
      ranks[kk] = Math.max(ranks[kk], num(s.saves[k]));
    }
  }

  const invIds = c.inv.map(x => x.id);
  const armor = c.worn && invIds.includes(c.worn) ? ITEM[c.worn] : null;
  const shield = c.sh && invIds.includes(c.sh) ? ITEM[c.sh] : null;
  const aCat = armor ? armor.cat : 'unarmored';
  const armorRank = defR[aCat] || 0;
  const sReq = armor ? strNeed(armor.str) : null;
  const strMet = sReq == null || mods.str >= sReq;
  const cap = armor && armor.cap != null ? armor.cap : null;
  const ac = 10 + (cap == null ? mods.dex : Math.min(mods.dex, cap)) + prof(armorRank) + (armor ? armor.ac : 0);
  const acShield = ac + (shield ? shield.ac : 0);
  let spdPen = armor ? armor.spn || 0 : 0;
  if (spdPen < 0 && strMet) spdPen = Math.min(0, spdPen + 5);
  if (shield && shield.spn) spdPen += shield.spn;
  const checkPen = armor && armor.cpn < 0 && !strMet ? armor.cpn : 0;
  const flex = armor && armor.tr.includes('flexible');

  let land = A ? A.sp : null;
  const otherSpeeds = [];
  for (const [t, v] of (H && H.speeds) || []) { if (t === 'land') land = v; else otherSpeeds.push(`${titleCase(t)} ${v} ft`); }
  const speed = land != null ? Math.max(5, land + spdPen) : null;
  const senses = [];
  if (A && VISION[A.v]) senses.push(VISION[A.v]);
  for (const [s, acu, rg] of (H && H.senses) || []) {
    let nm = s === 'darkvision' ? 'Darkvision' : s === 'low-light-vision' ? 'Low-light vision' : titleCase(s) + (acu ? ` (${acu}${rg ? ', ' + rg + ' ft' : ''})` : rg ? ` ${rg} ft` : '');
    if (s === 'darkvision' && senses.includes('Low-light vision')) senses.splice(senses.indexOf('Low-light vision'), 1);
    if (!senses.includes(nm)) senses.push(nm);
  }
  const resist = ((H && H.resist) || []).map(([t, v]) => `${titleCase(t)} ${v === 'L' ? 1 : v}`);
  const sizeName = H && H.size ? SIZE[H.size] || titleCase(H.size) : A ? SIZE[A.sz] || titleCase(A.sz) : '';

  const grants = [];
  if (B) B.sk.forEach(s => grants.push({ s, src: B.n }));
  if (K) {
    K.sk.forEach(s => grants.push({ s, src: K.n }));
    if (KX.grp && KX.grp.includes(c.grp)) grants.push({ s: c.grp, src: K.n });
  }
  for (const o of SUBS) for (const s of o.skills || []) grants.push({ s, src: o.n.replace(/^Bloodline: /, '') });
  if (H && H.skills) H.skills.forEach(s => grants.push({ s, src: H.n }));
  const auto = {};
  let realGrants = 0;
  for (const g of grants) if (SKILLS[g.s]) { realGrants++; (auto[g.s] = auto[g.s] || []).push(g.src); }
  const dupes = realGrants - Object.keys(auto).length;
  const picksNeeded = Math.max(0, (K ? K.add + mods.int + (KX.deity || 0) : 0) + dupes + ((H && H.freeSkill) || 0));
  const picked = c.skills.filter(s => SKILLS[s] && !auto[s]);
  const skills = Object.keys(SKILLS).map(name => {
    const attr = SKILLS[name];
    const rank = auto[name] || picked.includes(name) ? 1 : 0;
    let pen = 0;
    if (checkPen && (attr === 'str' || attr === 'dex') && !(flex && (name === 'Acrobatics' || name === 'Athletics'))) pen = checkPen;
    return { name, attr, rank, auto: auto[name] || null, picked: picked.includes(name), pen, mod: mods[attr] + prof(rank) + pen };
  });
  const lores = [];
  if (B) B.lo.forEach(l => lores.push({ name: l, src: B.n }));
  if (K && /lore/i.test(K.skc || '')) lores.push({ name: K.skc, src: K.n });
  lores.forEach(l => l.mod = mods.int + prof(1));

  const known = A ? A.l.map(titleCase) : ['Common'];
  const pool = [...new Set([...COMMON_LANGS, ...(A ? A.al : [])])].map(titleCase).filter(l => !known.includes(l));
  const langExtra = Math.max(0, mods.int) + (A ? A.ac : 0) + (H && typeof H.langs === 'number' ? H.langs : 0);
  const langPicked = c.langs.filter(l => pool.includes(l));

  const ancTraits = A ? [A.id] : [];
  if (H && !H.a) ancTraits.push(H.id, ...(H.countsAs || []), ...H.tr);
  const featSlots = [];
  if (A) featSlots.push({ k: 'anc', label: 'Ancestry feat', filter: f => f.c === 'a' && f.tr.some(t => ancTraits.includes(t)) });
  if (K && K.cf1) featSlots.push({ k: 'cls', label: K.n + ' feat', filter: f => f.c === 'c' && f.tr.includes(K.id) });
  if (K && K.sf1) featSlots.push({ k: 'skill', label: 'Skill feat', filter: f => f.c === 's' });
  if (H && H.genFeat) featSlots.push({ k: 'gen', label: 'General feat (Versatile Human)', filter: f => f.c === 'g' || f.c === 's' });
  const feats = [];
  if (B) B.ft.forEach(n => feats.push({ n, src: B.n + ' background', kind: 'Skill feat', auto: 1 }));
  if (H && H.grants) H.grants.filter(n => FEATI[n]).forEach(n => feats.push({ n, src: H.n, kind: 'Heritage', auto: 1 }));
  for (const o of SUBS) for (const n of o.grants || []) if (FEATI[n] || n === 'Shield Block') feats.push({ n, src: o.n, kind: 'Class', auto: 1 });
  if (K && K.l1.includes('Shield Block') && !feats.some(f => f.n === 'Shield Block')) feats.push({ n: 'Shield Block', src: K.n, kind: 'Class', auto: 1 });
  for (const s of featSlots) { const n = c.feats[s.k]; if (n && FEATI[n] && s.filter(FEATI[n])) feats.push({ n, src: 'Your choice', kind: s.label }); }

  const isThief = SUBS.some(s => s.thief);
  const other = K ? K.other || {} : {};
  function wRank(w) {
    if (!K) return 0;
    let r = atkR[w.cat] || 0;
    if (other.rank && /firearm/i.test(other.name) && w.g === 'firearm') r = Math.max(r, other.rank);
    if (other.rank && /bomb/i.test(other.name) && w.tr.includes('bomb')) r = Math.max(r, other.rank);
    return r;
  }
  function strikeOf(w, extra) {
    const r = w.cat === 'unarmed' ? atkR.unarmed || 0 : wRank(w);
    const finesse = w.tr.includes('finesse');
    const ranged = !!w.rg && !w.tr.some(t => /^thrown-\d+/.test(t));
    const atkAttr = ranged ? 'dex' : finesse && mods.dex > mods.str ? 'dex' : 'str';
    let dmAttr = null;
    if (!ranged) dmAttr = isThief && finesse && mods.dex > mods.str ? 'dex' : 'str';
    else if ((w.tr.includes('thrown') && !w.tr.includes('bomb')) || w.tr.includes('propulsive')) dmAttr = 'str';
    let dm = dmAttr ? mods[dmAttr] : 0;
    if (ranged && w.tr.includes('propulsive') && !w.tr.includes('thrown') && mods.str > 0) dm = Math.floor(mods.str / 2);
    const die = w.fist && K && K.id === 'monk' ? '1d6' : w.d;
    return Object.assign({ w, rank: r, atk: prof(r) + mods[atkAttr], atkAttr, dmAttr, ranged, die, dm, dt: w.dt, dmgStr: dmgText(die, dm, w.dt), map: w.tr.includes('agile') ? [-4, -8] : [-5, -10] }, extra || {});
  }
  const strikes = [strikeOf({ n: 'Fist', d: '1d4', dt: 'B', tr: ['agile', 'finesse', 'nonlethal', 'unarmed'], cat: 'unarmed', fist: 1 }, { fixed: 1 })];
  for (const s of (H && H.strikes) || []) if (!s.fist) strikes.push(strikeOf({ n: s.n, d: s.d, dt: s.t, tr: [...s.tr.filter(t => t !== 'unarmed'), 'unarmed'], cat: 'unarmed' }, { fixed: 1 }));
  for (const x of c.inv) { const w = ITEM[x.id]; if (w && w.k === 'weapon') strikes.push(strikeOf(w, { item: x.id })); }

  let spent = 0, bulk = 0, freeDagger = c.anc === 'dwarf';
  for (const x of c.inv) {
    const it = ITEM[x.id];
    if (!it) continue;
    let q = x.q;
    if (x.id === 'clan-dagger' && freeDagger) { q = Math.max(0, q - 1); freeDagger = false; }
    spent += it.per ? Math.ceil(q / it.per) * it.pc : q * it.pc;
    bulk += (it.bk || 0) * (it.per ? x.q / it.per : x.q);
  }
  const bulkVal = Math.floor(bulk + 1e-9) + Math.round((bulk - Math.floor(bulk + 1e-9)) * 10) / 10;
  const encAt = 5 + mods.str, maxB = 10 + mods.str;

  const ancHP = H && typeof H.hp === 'number' ? H.hp : A ? A.hp : 0;
  const hp = A && K ? ancHP + K.hp + mods.con : null;
  const perception = mods.wis + prof(ranks.perc);
  const saves = { fort: mods.con + prof(ranks.fort), ref: mods.dex + prof(ranks.ref), will: mods.wis + prof(ranks.will) };
  const classDC = K && keyAttr ? 10 + mods[keyAttr] + prof(1) : null;
  let trad = K ? TRAD[K.id] : null;
  for (const s of SUBS) if (s.trad) trad = s.trad;
  const caster = !!K && SLOT_CASTERS.includes(K.id);
  const spell = trad && keyAttr && (K.cast || caster) ? { trad, atk: mods[keyAttr] + prof(1), dc: 10 + mods[keyAttr] + prof(1) } : null;

  const steps = stepList(K);
  const todo = [];
  const need = (s, t) => todo.push({ step: s, text: t, kind: 'need' });
  const warn = (s, t) => todo.push({ step: s, text: t, kind: 'warn' });
  const tip = (s, t) => todo.push({ step: s, text: t, kind: 'tip' });
  const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
  if (!c.name.trim()) need('ancestry', 'Name your character');
  if (!A) need('ancestry', 'Choose an ancestry'); else if (!H) need('ancestry', 'Choose a heritage');
  if (!B) need('background', 'Choose a background');
  if (!K) need('class', 'Choose a class');
  else {
    for (const ch of K.ch) {
      const n = (c.subs[ch.tag] || []).filter(id => ch.o.some(o => o.id === id)).length;
      if (n < ch.count) need('class', `Choose your ${CHOICE_NAMES[ch.label] || ch.label.toLowerCase()}${ch.count > 1 ? ` (${ch.count - n} left)` : ''}`);
    }
    if (KX.grp && !c.grp) need('class', 'Choose ' + KX.grp.join(' or '));
  }
  for (const r of rows) {
    const left = r.max - r.chosen.length;
    if (!r.off && left > 0) need('attributes', r.id === 'cls' ? 'Pick your key attribute' : `Assign ${left} ${r.label.toLowerCase().replace(', one of', '')} boost${left > 1 ? 's' : ''}`);
  }
  if (K) {
    if (picked.length < picksNeeded) need('skills', 'Choose ' + plural(picksNeeded - picked.length, 'more skill'));
    if (picked.length > picksNeeded) warn('skills', 'Remove ' + plural(picked.length - picksNeeded, 'skill'));
  }
  if (langPicked.length < langExtra) need('skills', 'Choose ' + plural(langExtra - langPicked.length, 'language'));
  if (langPicked.length > langExtra) warn('skills', 'Remove ' + plural(langPicked.length - langExtra, 'language'));
  for (const s of featSlots) { const n = c.feats[s.k]; if (!n || !FEATI[n] || !s.filter(FEATI[n])) need('feats', 'Choose your ' + s.label.toLowerCase()); }
  for (const f of feats) { if (!f.auto && FEATI[f.n]) { const miss = prereqMissing(FEATI[f.n], skills); if (miss) warn('feats', `${f.n} needs ${miss}`); } }
  if (spell && caster) {
    const g = SPELL_GUIDE[K.id];
    if (g) {
      if (c.spells.c.length < g[0]) tip('spells', 'Pick ' + plural(g[0] - c.spells.c.length, 'more cantrip'));
      if (c.spells.r1.length < g[1]) tip('spells', 'Pick ' + plural(g[1] - c.spells.r1.length, 'more 1st-rank spell'));
    } else if (!c.spells.c.length) tip('spells', 'Pick your starting spells');
  }
  if (K && armor && armorRank === 0) warn('gear', `You aren’t trained in ${aCat} armor`);
  if (armor && !strMet && armor.cpn < 0) warn('gear', `Strength ${sg(mods.str)} is below ${armor.n}’s ${sg(sReq)} requirement`);
  for (const s of strikes) if (!s.fixed && K && s.rank === 0) warn('gear', `You aren’t trained with the ${s.w.n}`);
  if (spent > BUDGET) warn('gear', 'Over budget by ' + money(spent - BUDGET));
  if (bulkVal > maxB) warn('gear', `Carrying ${bulkVal} Bulk; your limit is ${maxB}`);
  else if (bulkVal > encAt) warn('gear', `Encumbered: over ${encAt} Bulk`);
  if (boostsLeft === 0 && keyAttr && mods[keyAttr] < 4) tip('attributes', `Most builds raise ${ATN[keyAttr]} to +4`);
  if (K && K.id !== 'monk' && K.id !== 'kineticist' && !caster && !strikes.some(s => !s.fixed)) tip('gear', 'Pick a weapon to fight with');
  if (armor && cap != null && mods.dex > cap) tip('gear', `Your Dexterity exceeds ${armor.n}’s cap of ${sg(cap)}`);
  const subIds = SUBS.map(s => s.id), featNames = Object.values(c.feats);
  const wantFam = (K && K.id === 'witch') || subIds.includes('leaf-order') || subIds.includes('improved-familiar-attunement') || featNames.includes('Familiar');
  const wantPet = subIds.includes('animal-order') || featNames.includes('Animal Companion');
  if (wantFam && !c.comps.some(x => x.kind === 'familiar')) tip('companions', 'Add your familiar');
  if (wantPet && !c.comps.some(x => x.kind === 'animal')) tip('companions', 'Add your animal companion');

  const started = { ancestry: !!A, background: !!B, class: !!K, attributes: boostsLeft < boostsTotal, skills: !!K,
    feats: featSlots.some(s => c.feats[s.k]), spells: c.spells.c.length + c.spells.r1.length > 0,
    gear: c.inv.some(x => x.id !== 'clan-dagger'), companions: c.comps.length > 0 };
  const stepState = {};
  for (const s of steps) {
    if (s.id === 'sheet') { stepState.sheet = todo.some(t => t.kind !== 'tip') ? '' : 'done'; continue; }
    const open = todo.some(t => t.step === s.id && t.kind !== 'tip');
    stepState[s.id] = !started[s.id] ? '' : open ? 'attn' : 'done';
  }

  return { A, H, B, K, KX, SUBS, keys, keyAttr, rows, mods, boostsLeft, ranks, defR, atkR, armor, shield, aCat, armorRank, strMet, sReq, cap, ac, acShield, speed, otherSpeeds, checkPen,
    senses, resist, sizeName, skills, lores, auto, picksNeeded, picked, dupes, known, pool, langExtra, langPicked, featSlots, feats, strikes, wRank, spent, bulkVal, encAt, maxB,
    hp, perception, saves, classDC, spell, trad, caster, todo, steps, stepState };
}

const CHOICE_NAMES = { 'Muses': 'muse', 'Divine Spark and Ikons': 'ikons', 'First Implement and Esoterica': 'first implement', "Rogue's Racket": 'racket', "Gunslinger's Way": 'way', "Swashbuckler's Style": 'style', 'Druidic Order': 'order' };

function prereqMissing(F, skills) {
  for (const p of F.p || []) {
    const m = /^(trained|expert|master|legendary) in (\w+)$/i.exec(p.trim());
    if (!m || !SKILLS[titleCase(m[2])]) continue;
    const needRank = ['', 'trained', 'expert', 'master', 'legendary'].indexOf(m[1].toLowerCase());
    const s = skills.find(x => x.name === titleCase(m[2]));
    if (s && s.rank < needRank) return p;
  }
  return null;
}
function stepList(K) {
  const s = [{ id: 'ancestry', t: 'Ancestry' }, { id: 'background', t: 'Background' }, { id: 'class', t: 'Class' }, { id: 'attributes', t: 'Attributes' }, { id: 'skills', t: 'Skills & languages' }, { id: 'feats', t: 'Feats' }];
  if (K && SLOT_CASTERS.includes(K.id)) s.push({ id: 'spells', t: 'Spells' });
  s.push({ id: 'companions', t: 'Companions' }, { id: 'gear', t: 'Equipment' }, { id: 'sheet', t: 'Character sheet' });
  return s;
}

const $ = s => document.querySelector(s);
let D = null;

function render() {
  const c = C();
  D = derive(c);
  if (!D.steps.some(s => s.id === store.step)) store.step = 'ancestry';
  renderRoster(); renderRail(c); renderMain(c); renderSide(c); persist();
}
function renderLight() {
  const c = C();
  D = derive(c);
  renderRoster(); renderRail(c); renderSide(c); persist();
}

function renderRoster() {
  let h = '';
  for (const id in store.chars) {
    const ch = store.chars[id];
    const name = ch.name.trim() || 'Unnamed ' + (CLS[ch.cls] ? CLS[ch.cls].n : 'hero').toLowerCase();
    h += `<option value="${id}" ${id === store.current ? 'selected' : ''}>${esc(name)}</option>`;
  }
  $('#roster').innerHTML = h;
}

function renderRail(c) {
  const sub = {
    ancestry: D.H ? D.H.n : D.A ? D.A.n : '',
    background: D.B ? D.B.n : '',
    class: D.K ? D.K.n + (D.SUBS[0] ? ', ' + D.SUBS[0].n.replace(/^Bloodline: /, '') : '') : '',
    attributes: D.boostsLeft ? `${D.boostsLeft} boost${D.boostsLeft > 1 ? 's' : ''} left` : D.K || D.A ? 'All boosts set' : '',
    skills: D.K ? `${D.picked.length} of ${D.picksNeeded} chosen` : '',
    feats: D.featSlots.length ? `${D.featSlots.filter(s => c.feats[s.k]).length} of ${D.featSlots.length} chosen` : '',
    spells: `${c.spells.c.length} cantrips, ${c.spells.r1.length} spells`,
    companions: c.comps.length ? `${c.comps.length} companion${c.comps.length > 1 ? 's' : ''}` : 'Optional',
    gear: c.inv.length ? money(BUDGET - D.spent) + ' left' : ''
  };
  const tick = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  $('#rail').innerHTML = D.steps.map((s, i) => {
    const on = s.id === store.step, st = D.stepState[s.id];
    return `<button class="step ${on ? 'on' : ''} ${st}" data-act="go" data-step="${s.id}"><span class="n">${st === 'done' && !on ? tick : i + 1}</span><span class="t">${s.t}</span><span class="s">${esc(sub[s.id] || '')}</span></button>`;
  }).join('');
  if (UI.railStep !== store.step) {
    UI.railStep = store.step;
    const on = $('#rail .step.on'), rail = $('#rail');
    if (on && window.innerWidth <= 820) rail.scrollTo({ left: on.offsetLeft - rail.clientWidth / 2 + on.clientWidth / 2, behavior: 'smooth' });
  }
}

function head(title, lead, ref) {
  return `<div class="pane-head"><h1>${title}</h1><p>${lead}</p>${ref ? `<a class="ref" href="${ref}" target="_blank" rel="noopener">Full rules on Archives of Nethys</a>` : ''}</div>`;
}
function foot() {
  const i = D.steps.findIndex(s => s.id === store.step);
  const prev = D.steps[i - 1], next = D.steps[i + 1];
  return `<div class="foot">${prev ? `<button class="btn line" data-act="go" data-step="${prev.id}">Back to ${prev.t.toLowerCase()}</button>` : '<span></span>'}${next ? `<button class="btn primary" data-act="go" data-step="${next.id}">Continue to ${next.t.toLowerCase()}</button>` : ''}</div>`;
}

const STEP_FN = {};
const LISTS = {};

function renderMain(c) {
  const enter = store.step !== UI.lastStep;
  $('#main').innerHTML = `<div class="pane ${enter ? 'enter' : ''}">${STEP_FN[store.step](c)}${foot()}</div>`;
  document.body.classList.toggle('sheet-mode', store.step === 'sheet');
  if (enter) window.scrollTo({ top: 0 });
  UI.lastStep = store.step;
}
function rerenderList(id) {
  const el = document.getElementById('L-' + id);
  if (el && LISTS[id]) el.innerHTML = LISTS[id](C());
}

function boostText(b, short, joiner) {
  const g = groupOf(b);
  const names = short ? ATS : ATN;
  return [...g.fixed.map(x => ATN[x]), ...g.choices.map(o => o.map(x => names[x]).join(' or ')), ...(g.free ? [g.free + ' free'] : [])].join(joiner);
}
function chooseBtn(chosen, mine, act, id, name) {
  return chosen ? `<span class="small muted">${mine}</span>` : `<button class="btn primary sm" data-act="${act}" data-id="${id}">Choose ${esc(name)}</button>`;
}

function ancBody(a, c) {
  return `${ANC_DESC[a.id] ? `<p class="desc">${ANC_DESC[a.id]}</p>` : ''}${traitChips(a.tr, a.r)}
    <dl class="sb">
      <div><dt>Hit Points</dt><dd>${a.hp}</dd></div><div><dt>Size</dt><dd>${SIZE[a.sz] || a.sz}</dd></div><div><dt>Speed</dt><dd>${a.sp} feet</dd></div>
      <div><dt>Attribute boosts</dt><dd>${boostText(a.b, true, ', ')}</dd></div><div><dt>Attribute flaw</dt><dd>${a.f.length ? a.f.map(x => ATN[x]).join(', ') : 'None'}</dd></div>
      <div><dt>Senses</dt><dd>${VISION[a.v] || 'Normal vision'}</dd></div>
      <div class="w"><dt>Languages</dt><dd>${a.l.map(titleCase).join(', ')}${a.ac ? `, plus ${a.ac} more of your choice` : ''}</dd></div>
      ${a.al.length ? `<div class="w"><dt>Extra languages available</dt><dd>${a.al.map(titleCase).join(', ')}</dd></div>` : ''}
      ${a.feat.length ? `<div class="w"><dt>Ancestry features</dt><dd>${a.feat.map(n => aonA(n, n)).join(', ')}</dd></div>` : ''}
      <div><dt>Source</dt><dd>${esc(a.s)}</dd></div>
    </dl>
    <div class="ent-act">${chooseBtn(c.anc === a.id, 'Your ancestry', 'anc', a.id, a.n)}${aonA(a.n)}</div>`;
}
function senseName(s, a, r) {
  return (s === 'darkvision' ? 'Darkvision' : s === 'low-light-vision' ? 'Low-light vision' : titleCase(s)) + (a ? ` (${a}${r ? `, ${r} ft` : ''})` : '');
}
function herBody(h, c) {
  const bits = [];
  if (VH_DESC[h.id]) bits.push(VH_DESC[h.id]);
  if (h.hp) bits.push(h.hp + ' Hit Points from ancestry');
  for (const [s, a, r] of h.senses || []) bits.push(senseName(s, a, r));
  for (const [t, v] of h.resist || []) bits.push(`${titleCase(t)} resistance ${v === 'L' ? 'equal to half your level (minimum 1)' : v}`);
  for (const t of h.immune || []) bits.push('Immune to ' + t);
  for (const [t, v] of h.speeds || []) bits.push(t === 'land' ? `Speed ${v} feet` : `${titleCase(t)} Speed ${v} feet`);
  for (const s of h.skills || []) bits.push('Trained in ' + s);
  for (const s of h.strikes || []) bits.push(s.fist ? 'Fist unarmed attack' : `${s.n} unarmed attack, ${s.d} ${s.t}`);
  for (const n of h.grants || []) bits.push('Gain ' + n);
  if (h.countsAs) bits.push('Counts as ' + h.countsAs.filter(x => x !== h.id).map(titleCase).join(', ') + ' for feats');
  const o = HER_OVR[h.id] || {};
  if (o.freeSkill) bits.push('Trained in one extra skill of your choice');
  if (o.langs) bits.push(o.langs + ' additional languages');
  if (o.genFeat) bits.push('A 1st-level general feat');
  const list = bits.length ? `<ul class="bul">${bits.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : '<p class="desc muted small">Its benefits are mostly narrative. Read the full entry for details.</p>';
  return `${traitChips(h.tr, h.r)}${list}<dl class="sb"><div><dt>Source</dt><dd>${esc(h.s)}</dd></div></dl>
    <div class="ent-act">${chooseBtn(c.her === h.id, 'Your heritage', 'her', h.id, h.n)}${aonA(h.n)}</div>`;
}

LISTS.anc = c => paged('anc', filtered('anc', DATA.anc, a => a.n + ' ' + a.tr.join(' ')),
  a => entry('anc:' + a.id, { sel: c.anc === a.id, title: esc(a.n), badge: rarBadge(a.r), meta: `<span>${a.hp} HP</span><span class="hide-m">${SIZE[a.sz]}</span><span class="hide-m">${a.sp} ft</span>`, body: ancBody(a, c) }),
  'No ancestries match. Try another name or rarity.');
LISTS.vh = c => paged('vh', filtered('vh', VERS, h => h.n),
  h => entry('her:' + h.id, { sel: c.her === h.id, title: esc(h.n), badge: rarBadge(h.r), body: herBody(h, c) }), 'No versatile heritages match.');

STEP_FN.ancestry = c => {
  let h = head('Who are you?', 'Name your hero and choose the people they come from. Open any entry to see its full statistics.', AON + 'Ancestries.aspx');
  h += `<div class="identity">
    <div class="portrait-pick">${avatar(c.portrait, c.name, 'xl')}
      <label class="btn line sm">${c.portrait ? 'Change' : 'Add portrait'}<input type="file" accept="image/*" data-portrait="char" hidden></label>
      ${c.portrait ? '<button class="btn ghost sm" data-act="rmPortrait">Remove</button>' : ''}</div>
    <div class="field" style="flex:1"><label for="f-name">Character name</label><input id="f-name" class="input name" data-in="name" value="${esc(c.name)}" placeholder="Unnamed hero" autocomplete="off">
    ${UI.imgMsg ? `<p class="small" style="color:var(--bad);margin:6px 0 0">${esc(UI.imgMsg)}</p>` : '<p class="small muted" style="margin:6px 0 0">Use any picture and position it inside the circle. Location data in photos is removed.</p>'}</div>
  </div>`;
  h += `<h2 class="sec">Ancestry <small>${DATA.anc.length} ancestries from every Pathfinder 2e book</small></h2>`;
  if (D.A && !UI.showList.anc) {
    h += `<div class="chosen-bar"><div><b>${esc(D.A.n)}</b><span>${D.A.hp} HP, ${SIZE[D.A.sz]}, ${D.A.sp} ft</span></div><button class="btn line sm" data-act="showList" data-l="anc">Change ancestry</button></div>`;
    h += `<div class="list">${entry('anc:' + D.A.id, { sel: true, title: esc(D.A.n), badge: rarBadge(D.A.r), meta: 'Details', body: ancBody(D.A, c) })}</div>`;
  } else {
    h += filterBar('anc', 'Search ancestries') + `<div id="L-anc">${LISTS.anc(c)}</div>`;
  }
  if (D.A) {
    const g = groupOf(D.A.b);
    if (g.fixed.length || g.choices.length || D.A.f.length) h += `<div style="margin-top:16px"><span class="switch ${c.alt ? 'on' : ''}" role="switch" tabindex="0" data-act="alt"><span class="track"></span>Use alternate boosts: two free boosts and no flaw</span></div>`;
    const hers = DATA.her.filter(x => x.a === D.A.id);
    h += `<h2 class="sec">Heritage <small>${hers.length} ${D.A.n.toLowerCase()} heritages, or a versatile heritage</small></h2>`;
    h += `<div class="list">${hers.map(x => entry('her:' + x.id, { sel: c.her === x.id, title: esc(x.n), badge: rarBadge(x.r), meta: c.her === x.id ? 'Chosen' : '', body: herBody(x, c) })).join('')}</div>`;
    h += `<h3 class="sub">Versatile heritages</h3><p class="small muted" style="margin:-4px 0 10px">These can belong to any ancestry, such as part-elf aiuvarins or planar nephilim.</p>`;
    h += filterBar('vh', 'Search versatile heritages') + `<div id="L-vh">${LISTS.vh(c)}</div>`;
  }
  return h;
};

function bgBody(b, c) {
  return `${traitChips([], b.r, b.lg)}<dl class="sb">
      <div class="w"><dt>Attribute boosts</dt><dd>${boostText(b.b, false, ', plus ') || '—'}</dd></div>
      <div><dt>Trained skills</dt><dd>${[...b.sk, ...b.lo].join(', ') || 'See full entry'}</dd></div>
      <div><dt>Skill feat</dt><dd>${b.ft.length ? b.ft.map(n => aonA(n, n)).join(', ') : '—'}</dd></div>
      <div><dt>Source</dt><dd>${esc(b.s)}</dd></div>
    </dl>${b.x ? '<div class="note info">This background includes an extra choice. Read the full entry and note it on your sheet.</div>' : ''}
    <div class="ent-act">${chooseBtn(c.bg === b.id, 'Your background', 'bg', b.id, b.n)}${aonA(b.n + ' background')}</div>`;
}
LISTS.bg = c => paged('bg', filtered('bg', DATA.bg, b => [b.n, ...b.sk, ...b.lo, ...b.ft, ...b.b.filter(s => s !== '*').flat().map(x => ATN[x])].join(' ')),
  b => entry('bg:' + b.id, { sel: c.bg === b.id, title: esc(b.n), badge: rarBadge(b.r), meta: `<span class="hide-m">${esc(b.sk.join(', '))}</span><span>${b.b.filter(s => s !== '*').map(s => s.map(x => ATS[x]).join('/')).join(', ')}</span>`, body: bgBody(b, c) }),
  'No backgrounds match. Try a skill such as Athletics or an attribute such as Wisdom.');

STEP_FN.background = c => {
  let h = head('Where did you come from?', 'Your background is what you did before adventuring. It gives attribute boosts, a skill, a Lore and a skill feat. Search by name, skill, feat or attribute.', AON + 'Backgrounds.aspx');
  if (D.B && !UI.showList.bg) {
    h += `<div class="chosen-bar"><div><b>${esc(D.B.n)}</b><span>${esc([...D.B.sk, ...D.B.lo].join(', '))}</span></div><button class="btn line sm" data-act="showList" data-l="bg">Change background</button></div>`;
    h += `<div class="list">${entry('bg:' + D.B.id, { sel: true, title: esc(D.B.n), badge: rarBadge(D.B.r), meta: 'Details', body: bgBody(D.B, c) })}</div><p class="small muted">Assign its boosts on the Attributes step.</p>`;
  } else {
    h += filterBar('bg', `Search ${DATA.bg.length} backgrounds`) + `<div id="L-bg">${LISTS.bg(c)}</div>`;
  }
  return h;
};

function classStats(k) {
  const KX = CLASS_EXTRA[k.id] || {};
  const keys = KX.key || k.key;
  const atk = ['simple', 'martial', 'advanced', 'unarmed'].filter(x => k.atk[x]).map(x => `${titleCase(x)} ${rk(k.atk[x])}`);
  if (k.other && k.other.rank) atk.push(`${esc(k.other.name)} ${rk(k.other.rank)}`);
  const def = ['unarmored', 'light', 'medium', 'heavy'].filter(x => k.def[x]).map(x => `${titleCase(x)} ${rk(k.def[x])}`);
  const skills = [...k.sk, ...(KX.grp ? [KX.grp.join(' or ')] : []), ...(k.skc ? [k.skc] : [])].join(', ');
  return `<dl class="sb">
    <div><dt>Hit Points</dt><dd>${k.hp} + Constitution per level</dd></div>
    <div><dt>Key attribute</dt><dd>${keys.length ? keys.map(x => ATN[x]).join(' or ') : 'Varies'}</dd></div>
    <div><dt>Perception</dt><dd>${rk(k.perc, 1)}</dd></div>
    <div><dt>Saves</dt><dd>Fort ${rk(k.fort)} Ref ${rk(k.ref)} Will ${rk(k.will)}</dd></div>
    <div class="w"><dt>Weapons</dt><dd>${atk.join('&ensp;')}</dd></div>
    <div class="w"><dt>Armor</dt><dd>${def.join('&ensp;') || 'None'}</dd></div>
    <div class="w"><dt>Skills</dt><dd>${skills}${k.sk.length || KX.grp ? ', plus ' : ''}${k.add + (KX.deity || 0)} + Intelligence${KX.deity ? ' (one is your deity’s skill)' : ''}</dd></div>
    ${SLOT_CASTERS.includes(k.id) || k.cast ? `<div><dt>Spellcasting</dt><dd>${TRAD[k.id] ? titleCase(TRAD[k.id]) : 'Set by your ' + (k.ch[0] ? k.ch[0].label.toLowerCase() : 'choice')} ${rk(1)}</dd></div>` : ''}
    <div><dt>Source</dt><dd>${esc(k.s)}</dd></div>
  </dl>`;
}
function clsBody(k, c) {
  return `${CLS_DESC[k.id] ? `<p class="desc">${CLS_DESC[k.id]}</p>` : ''}${traitChips([], k.r)}${classStats(k)}
    <h3 class="sub">1st-level features</h3><ul class="bul">${k.l1.map(n => `<li>${aonA(n, n)}${FEATURE_DESC[n] ? ` <span class="muted">${FEATURE_DESC[n]}</span>` : ''}</li>`).join('')}</ul>
    <div class="ent-act">${chooseBtn(c.cls === k.id, 'Your class', 'cls', k.id, k.n)}${aonA(k.n + ' class')}</div>`;
}
function subBody(o, ch, c, sel) {
  const ov = SUB_OVR[o.id] || {};
  const bits = [];
  if (o.trad) bits.push(titleCase(o.trad) + ' spellcasting tradition');
  for (const s of o.skills || []) bits.push('Trained in ' + s);
  for (const k in Object.assign({}, o.def, ov.def)) bits.push(`Trained in ${k} armor`);
  if (ov.saves) bits.push('Expert in Fortitude saves');
  for (const n of [...(o.grants || []), ...(ov.grants || [])]) bits.push('Gain ' + n);
  if (ov.key) bits.push(ov.key.map(k => ATN[k]).join(' or ') + ' can be your key attribute');
  for (const [t] of o.resist || []) bits.push(titleCase(t) + ' resistance');
  const full = ch.count > 1 && !sel && (c.subs[ch.tag] || []).length >= ch.count;
  return `${SUB_DESC[o.id] ? `<p class="desc">${SUB_DESC[o.id]}</p>` : ''}${traitChips([], o.r)}${bits.length ? `<ul class="bul">${bits.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : '<p class="desc muted small">Open the full entry for its details.</p>'}
    <dl class="sb"><div><dt>Source</dt><dd>${esc(o.s)}</dd></div></dl>
    <div class="ent-act">${sel ? `<button class="btn line sm" data-act="sub" data-tag="${ch.tag}" data-id="${o.id}">Remove</button>` : `<button class="btn primary sm" data-act="sub" data-tag="${ch.tag}" data-id="${o.id}" ${full ? 'disabled' : ''}>Choose ${esc(o.n.replace(/^Bloodline: /, ''))}</button>`}${aonA(o.n)}</div>`;
}
LISTS.cls = c => paged('cls', filtered('cls', DATA.cls, k => k.n),
  k => entry('cls:' + k.id, { sel: c.cls === k.id, title: esc(k.n), badge: rarBadge(k.r), meta: `<span>${k.hp} HP</span><span class="hide-m">${((CLASS_EXTRA[k.id] || {}).key || k.key).map(x => ATS[x]).join(' or ')}</span>`, body: clsBody(k, c) }),
  'No classes match.');

STEP_FN.class = c => {
  let h = head('What do you do?', 'Your class sets your key attribute, your training, and how you fight, cast or sneak. Open a class to compare its proficiencies.', AON + 'Classes.aspx');
  if (D.K && !UI.showList.cls) {
    h += `<div class="chosen-bar"><div><b>${esc(D.K.n)}</b><span>${D.K.hp} HP per level, ${D.keys.map(x => ATN[x]).join(' or ') || 'key varies'}</span></div><button class="btn line sm" data-act="showList" data-l="cls">Change class</button></div>`;
    h += `<div class="list">${entry('cls:' + D.K.id, { sel: true, title: esc(D.K.n), badge: rarBadge(D.K.r), meta: 'Details', body: clsBody(D.K, c) })}</div>`;
  } else {
    h += filterBar('cls', 'Search classes') + `<div id="L-cls">${LISTS.cls(c)}</div>`;
  }
  if (!D.K) return h;
  if (D.keys.length > 1) h += `<h2 class="sec">Key attribute</h2><div class="seg">${D.keys.map(a => `<button class="${D.keyAttr === a ? 'sel' : ''}" data-act="key" data-id="${a}">${ATN[a]}</button>`).join('')}</div>`;
  if (D.KX.grp) h += `<h2 class="sec">Starting skill</h2><div class="seg">${D.KX.grp.map(s => `<button class="${c.grp === s ? 'sel' : ''}" data-act="grp" data-id="${s}">${s}</button>`).join('')}</div>`;
  for (const ch of D.K.ch) {
    const sel = c.subs[ch.tag] || [];
    h += `<h2 class="sec">${esc(ch.label)} <small>${ch.count > 1 ? `Choose ${ch.count}, ${sel.length} chosen` : ch.o.length + ' options'}</small></h2><div class="list">`;
    h += ch.o.map(o => entry('sub:' + ch.tag + ':' + o.id, { sel: sel.includes(o.id), title: esc(o.n.replace(/^Bloodline: /, '')), badge: rarBadge(o.r),
      meta: (o.trad ? `<span>${titleCase(o.trad)}</span>` : '') + (sel.includes(o.id) ? '<span>Chosen</span>' : ''), body: subBody(o, ch, c, sel.includes(o.id)) })).join('');
    h += '</div>';
  }
  return h;
};

STEP_FN.attributes = c => {
  let h = head('Assign attribute boosts', 'Each boost adds +1 to an attribute modifier. Within one source, every boost must go to a different attribute. At 1st level, no attribute can go above +4.', AON + 'Search.aspx?q=attribute%20boosts');
  h += `<div class="matrix"><div class="mrow head"><div class="ml"></div><div class="cells">${AT.map(a => `<div class="ch">${ATS[a]}</div>`).join('')}</div></div>`;
  for (const r of D.rows) {
    const cnt = r.max && !r.off ? `<span class="cnt ${r.chosen.length >= r.max ? 'full' : ''}">${r.chosen.length} of ${r.max}</span>` : '';
    h += `<div class="mrow ${r.off ? 'off' : ''}"><div class="ml"><b>${r.label}</b><span>${esc(r.note)}${r.max && !r.off ? '. ' : ''}</span>${cnt}</div><div class="cells">`;
    for (const a of AT) {
      const fixed = r.fixed.includes(a), on = r.chosen.includes(a), flaw = r.flaw.includes(a);
      let cls = 'cell', can = false;
      if (fixed) cls += ' fixed';
      else if (on) { cls += ' on'; can = true; if (UI.popCell === r.id + a) cls += ' pop'; }
      else if (!r.off && r.max > 0 && r.allow(a) && (r.chosen.length < r.max || r.single)) { cls += ' can'; can = true; }
      else cls += ' no';
      if (flaw) cls += ' flaw';
      h += can ? `<button class="${cls}" data-act="boost" data-row="${r.id}" data-id="${a}" title="${ATN[a]}">${on ? '+' : ''}</button>` : `<div class="${cls}">${fixed ? '+' : ''}</div>`;
    }
    h += '</div></div>';
  }
  h += `<div class="mrow total"><div class="ml"><b>Modifiers</b><span>Your final attribute modifiers</span></div><div class="cells">${AT.map(a => {
    const v = D.mods[a], key = D.keyAttr === a;
    return `<div class="tot"><span class="v num ${key ? 'key' : ''} ${v < 0 ? 'neg' : ''}">${sg(v)}</span><span class="lab">${ATN[a]}${key ? '<br><i>Key</i>' : ''}</span></div>`;
  }).join('')}</div></div></div>`;
  h += `<div class="matrix-actions"><button class="btn primary" data-act="quickBoosts" ${D.boostsLeft ? '' : 'disabled'}>Fill remaining boosts for my class</button><button class="btn ghost" data-act="clearBoosts">Clear my choices</button></div>`;
  if (!D.K) h += '<div class="note info">Choose a class first and the auto-fill will put its key attribute first.</div>';
  const t = D.todo.find(x => x.kind === 'tip' && x.step === 'attributes');
  if (t) h += `<div class="note">${t.text}. Your key attribute drives your attacks or spells and your class DC.</div>`;
  return h;
};

STEP_FN.skills = c => {
  let h = head('Skills and languages', 'Skills from your background, class and other choices are filled in for you. Choose the rest; Intelligence adds extra picks.', AON + 'Skills.aspx');
  if (!D.K) h += '<div class="note info">Choose a class to see how many skills you can train.</div>';
  const left = D.picksNeeded - D.picked.length;
  h += `<div class="counter"><span class="big num ${left < 0 ? 'over' : left === 0 && D.K ? 'done' : ''}">${D.picked.length} of ${D.picksNeeded}</span><span class="muted small">skills chosen${D.dupes ? `, including ${D.dupes} extra because two sources gave the same skill` : ''}${D.KX.deity ? '. One should be your deity’s skill' : ''}</span>${left > 0 ? '<button class="btn line sm" data-act="suggestSkills" style="margin-left:auto">Suggest skills for me</button>' : ''}</div>`;
  if (D.checkPen) h += `<div class="note bad">Your armor’s check penalty (${D.checkPen}) applies to Strength and Dexterity skills because your Strength is below its requirement.</div>`;
  h += '<div class="sklist">';
  for (const s of D.skills) {
    const canPick = !s.auto && (s.picked || left > 0);
    const inner = `<span>${rk(s.rank)}</span><span class="sn">${s.name}<small>${ATS[s.attr]}</small>${s.pen ? `<span class="pen">${s.pen} armor</span>` : ''}</span><span class="src">${esc(s.auto ? s.auto.join(', ') : s.picked ? 'Your choice' : '')}</span><span class="sm num">${sg(s.mod)}</span>`;
    h += s.auto ? `<div class="sk">${inner}</div>` : `<button class="sk tg ${s.picked ? 'picked' : ''} ${canPick ? '' : 'dis'}" data-act="skill" data-id="${s.name}" ${canPick ? '' : 'aria-disabled="true"'}>${inner}</button>`;
  }
  for (const l of D.lores) h += `<div class="sk"><span>${rk(1)}</span><span class="sn">${esc(l.name)}<small>Int</small></span><span class="src">${esc(l.src)}</span><span class="sm num">${sg(l.mod)}</span></div>`;
  const ll = D.langExtra - D.langPicked.length;
  h += `</div><h2 class="sec">Languages</h2><p class="muted small" style="margin:-4px 0 12px">You know ${listJoin(D.known)}. ${D.langExtra ? `Choose ${D.langExtra} more (${Math.max(0, ll)} left). Intelligence, your ancestry and some heritages add more.` : 'Raise Intelligence above +0 to learn more.'}</p><div class="chips">`;
  for (const l of D.known) h += `<span class="chip fix">${esc(l)}</span>`;
  for (const l of D.pool) {
    const sel = D.langPicked.includes(l), dis = !sel && ll <= 0;
    h += `<button class="chip ${sel ? 'sel' : ''} ${dis ? 'dis' : ''}" data-act="lang" data-id="${esc(l)}" ${dis ? 'aria-disabled="true"' : ''}>${esc(l)}</button>`;
  }
  return h + '</div>';
};

function featBody(f, k, c) {
  const miss = prereqMissing(f, D.skills);
  return `${traitChips(f.tr, f.r, f.lg)}<dl class="sb">
    <div><dt>Level</dt><dd>1</dd></div>${f.a ? `<div><dt>Activation</dt><dd>${actGlyph(f.a)}</dd></div>` : ''}
    ${f.p.length ? `<div class="w"><dt>Prerequisites</dt><dd>${esc(f.p.join('; '))}</dd></div>` : ''}
    <div><dt>Source</dt><dd>${esc(f.s)}</dd></div></dl>
    ${miss ? `<div class="note">You don’t meet this yet: ${esc(miss)}.</div>` : ''}
    <div class="ent-act">${c.feats[k] === f.n ? `<button class="btn line sm" data-act="feat" data-k="${k}" data-id="">Remove</button>` : `<button class="btn primary sm" data-act="feat" data-k="${k}" data-id="${esc(f.n)}">Take ${esc(f.n)}</button>`}${aonA(f.n + ' feat', 'Read what it does on Archives of Nethys')}</div>`;
}
STEP_FN.feats = c => {
  let h = head('Feats', 'Feats are special abilities. Your background and heritage may already give you some; choose the rest here.', AON + 'Feats.aspx');
  const auto = D.feats.filter(f => f.auto);
  if (auto.length) h += `<h2 class="sec">Granted automatically</h2>` + auto.map(f => `<div class="slot filled"><div><b>${aonA(f.n, f.n)}</b><span class="k">${esc(f.kind)} from ${esc(f.src)}</span></div></div>`).join('');
  if (!D.featSlots.length) h += '<div class="note info">Choose an ancestry and class to unlock your feat choices.</div>';
  for (const s of D.featSlots) {
    const n = c.feats[s.k], F = n && FEATI[n] && s.filter(FEATI[n]) ? FEATI[n] : null;
    const all = DATA.feats.filter(s.filter), id = 'feat-' + s.k;
    h += `<h2 class="sec">${esc(s.label)} <small>${all.length} available</small></h2>`;
    h += `<div class="slot ${F ? 'filled' : ''}"><div><b>${F ? esc(F.n) : 'Not chosen yet'}</b><span class="k">${F ? (F.a ? actGlyph(F.a) + '. ' : '') + esc(F.s) : 'Pick one from the list below'}</span></div>${F ? `<button class="btn ghost sm" data-act="feat" data-k="${s.k}" data-id="">Clear</button>` : ''}</div>`;
    LISTS[id] = cc => paged(id, filtered(id, all, f => f.n + ' ' + f.tr.join(' ') + ' ' + f.p.join(' ')),
      f => entry('feat:' + s.k + ':' + f.n, { sel: cc.feats[s.k] === f.n, title: esc(f.n), badge: rarBadge(f.r), meta: (f.a ? `<span>${actGlyph(f.a)}</span>` : '') + (f.p.length ? '<span class="hide-m">Prerequisites</span>' : ''), body: featBody(f, s.k, cc) }),
      'No feats match.');
    h += filterBar(id, 'Search by name or trait') + `<div id="L-${id}">${LISTS[id](c)}</div>`;
  }
  return h;
};

function castTime(t) { return /^\d$/.test(t) ? actGlyph(t) : esc(t || '—'); }
function spellBody(s, kind, c) {
  const has = c.spells[kind].includes(s.n);
  const row = (k, v) => v ? `<div><dt>${k}</dt><dd>${v}</dd></div>` : '';
  return `${traitChips(s.tr, s.r, s.lg)}<dl class="sb">
    ${row('Rank', s.c ? 'Cantrip' : '1st')}${row('Cast', castTime(s.t))}${row('Range', esc(s.rg))}${row('Area', esc(s.ar))}${row('Targets', esc(s.tg))}${row('Defense', esc(titleCase(s.df)))}
    ${s.du || s.su ? row('Duration', (s.su ? 'Sustained ' : '') + esc(s.du)) : ''}${s.dm ? row('Damage or healing', esc(s.dm.join(', '))) : ''}
    ${row('Traditions', s.td.map(titleCase).join(', '))}${row('Source', esc(s.s))}</dl>
    <div class="ent-act"><button class="btn ${has ? 'line' : 'primary'} sm" data-act="spell" data-k="${kind}" data-id="${esc(s.n)}">${has ? 'Remove' : 'Add to my spells'}</button>${aonA(s.n + ' spell', 'Read the spell on Archives of Nethys')}</div>`;
}
STEP_FN.spells = c => {
  let h = head('Spells', 'Pick your starting cantrips and 1st-rank spells from your tradition. Open a spell to see its range, area, defense and damage.', AON + 'Spells.aspx');
  if (!D.spell) return h + `<div class="note info">Choose your ${D.K && D.K.ch[0] ? D.K.ch[0].label.toLowerCase() : 'class options'} and key attribute to set your spellcasting tradition.</div>`;
  const g = SPELL_GUIDE[D.K.id];
  h += `<div class="note info">${titleCase(D.spell.trad)} tradition. Spell attack ${sg(D.spell.atk)}, spell DC ${D.spell.dc}. ${g ? `A ${D.K.n.toLowerCase()} usually starts with ${g[0]} cantrips and ${g[1]} 1st-rank spells in their ${g[2]}.` : 'Check your class entry for how many spells you start with.'}</div>`;
  for (const kind of ['c', 'r1']) {
    const all = DATA.spells.filter(s => (kind === 'c' ? s.c : !s.c) && s.td.includes(D.spell.trad));
    const id = 'sp-' + kind;
    h += `<h2 class="sec">${kind === 'c' ? 'Cantrips' : '1st-rank spells'} <small>${c.spells[kind].length}${g ? ' of ' + g[kind === 'c' ? 0 : 1] : ''} chosen, ${all.length} available</small></h2>`;
    if (c.spells[kind].length) h += `<div class="chips" style="margin-bottom:10px">${c.spells[kind].map(n => `<button class="chip sel" data-act="spell" data-k="${kind}" data-id="${esc(n)}" title="Remove">${esc(n)} ✕</button>`).join('')}</div>`;
    LISTS[id] = cc => paged(id, filtered(id, all, s => s.n + ' ' + s.tr.join(' ')),
      s => entry('sp:' + kind + ':' + s.n, { sel: cc.spells[kind].includes(s.n), title: esc(s.n), badge: rarBadge(s.r), meta: `<span>${castTime(s.t)}</span><span class="hide-m">${esc(s.rg || s.ar || '')}</span>`, body: spellBody(s, kind, cc) }),
      'No spells match.');
    h += filterBar(id, 'Search spells or traits') + `<div id="L-${id}">${LISTS[id](c)}</div>`;
  }
  return h;
};

function compTitle(cp, S) {
  if (cp.name.trim()) return cp.name.trim();
  if (cp.kind === 'animal') return S.T.n;
  if (cp.kind === 'custom') return cp.label.trim() || 'Custom companion';
  return 'Familiar';
}
function compKind(cp, S) {
  if (cp.kind === 'animal') return S.T.n + ' companion';
  if (cp.kind === 'custom') return cp.label.trim() || 'Custom companion';
  return 'Familiar';
}
function bigStats(title, S) {
  return `<div class="bigstats">
      <div class="bs"><span class="v num">${S.hp}</span><span class="l">Hit Points</span></div>
      <div class="bs"><span class="v num">${S.ac}</span><span class="l">Armor Class</span></div>
      <div class="bs"><span class="v num">${rb(title + ' Perception', S.perc)}</span><span class="l">Perception</span></div>
      <div class="bs"><span class="v num">${rb(title + ' Fortitude', S.saves.fort)}</span><span class="l">Fortitude</span></div>
      <div class="bs"><span class="v num">${rb(title + ' Reflex', S.saves.ref)}</span><span class="l">Reflex</span></div>
      <div class="bs"><span class="v num">${rb(title + ' Will', S.saves.will)}</span><span class="l">Will</span></div>
    </div>`;
}
function compHead(cp, i, title, line, placeholder, buttons) {
  return `<div class="comp-head">
      <div class="portrait-pick sm">${avatar(cp.portrait, title, 'lg')}
        <label class="btn ghost sm">${cp.portrait ? 'Change' : 'Add picture'}<input type="file" accept="image/*" data-portrait="${i}" hidden></label></div>
      <div class="comp-id"><input class="input" data-cin="${i}" value="${esc(cp.name)}" placeholder="${placeholder}" maxlength="60">
        <p class="small muted">${esc(line)}</p></div>
      <div class="row-btns">${buttons}<button class="btn ghost sm" data-act="rmComp" data-i="${i}">${UI.confirmComp === i ? 'Click again to remove' : 'Remove'}</button></div>
    </div>`;
}

function customCard(cp, i) {
  const S = compStats(cp), title = compTitle(cp, S), editing = UI.editComp === i;
  let h = '<section class="comp">' + compHead(cp, i, title, (cp.label.trim() || 'Custom companion') + ', ' + cp.size, 'Name your companion',
    `<button class="btn ${editing ? 'primary' : 'line'} sm" data-act="editComp" data-i="${i}">${editing ? 'Done' : 'Edit stats'}</button>`);
  if (editing) {
    const f = (k, lab, type, extra) => `<label class="cf"><span>${lab}</span><input class="input" type="${type}" value="${esc(cp[k])}" data-cf="${i}|${k}" ${extra || ''}></label>`;
    h += `<p class="small muted" style="margin:0 0 10px">Enter the numbers from your GM, the rulebook or your own design. Bonuses are the full modifier you add to a d20.</p>
      <div class="cf-grid">
        ${f('label', 'Kind of creature', 'text', 'maxlength="40" placeholder="e.g. Eidolon, dire boar"')}
        <label class="cf"><span>Size</span><select class="select" data-cf="${i}|size">${C_SIZES.map(s => `<option ${cp.size === s ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
        ${f('hp', 'Hit Points', 'number')}${f('ac', 'Armor Class', 'number')}${f('perc', 'Perception', 'number')}
        ${f('fort', 'Fortitude', 'number')}${f('ref', 'Reflex', 'number')}${f('will', 'Will', 'number')}
        ${f('speed', 'Speed', 'text', 'maxlength="80" placeholder="e.g. 30 ft, fly 40 ft"')}${f('senses', 'Senses', 'text', 'maxlength="120" placeholder="e.g. darkvision"')}
      </div>
      <h3 class="sub">Skills</h3>`;
    cp.skills.forEach((s, j) => {
      h += `<div class="cf-row"><input class="input" value="${esc(s.n)}" data-cs="${i}|${j}|n" maxlength="30" placeholder="Skill">
        <input class="input num" type="number" value="${s.v}" data-cs="${i}|${j}|v">
        <button class="icon-btn" data-act="rmCRow" data-i="${i}" data-l="skills" data-j="${j}" aria-label="Remove skill">✕</button></div>`;
    });
    if (cp.skills.length < 12) h += `<button class="btn ghost sm" data-act="addCRow" data-i="${i}" data-l="skills">+ Add skill</button>`;
    h += '<h3 class="sub">Attacks</h3>';
    cp.atk.forEach((t, j) => {
      const a = (k, lab, type, extra) => `<label class="cf"><span>${lab}</span><input class="input" type="${type}" value="${esc(t[k])}" data-ca="${i}|${j}|${k}" ${extra || ''}></label>`;
      h += `<div class="cf-atk">${a('n', 'Name', 'text', 'maxlength="30" placeholder="e.g. Claw"')}${a('b', 'Attack bonus', 'number')}${a('d', 'Damage dice', 'text', 'maxlength="5" placeholder="1d8"')}
        ${a('m', 'Damage bonus', 'number')}${a('t', 'Damage type', 'text', 'maxlength="20" placeholder="e.g. slashing"')}${a('tr', 'Traits', 'text', 'maxlength="80" placeholder="e.g. agile, finesse"')}
        <button class="btn ghost sm" data-act="rmCRow" data-i="${i}" data-l="atk" data-j="${j}">Remove attack</button></div>`;
    });
    if (cp.atk.length < 6) h += `<button class="btn ghost sm" data-act="addCRow" data-i="${i}" data-l="atk">+ Add attack</button>`;
    h += `<h3 class="sub">Notes</h3><textarea class="input" rows="3" data-cf="${i}|notes" maxlength="2000" placeholder="Special abilities, support benefit, anything else">${esc(cp.notes)}</textarea>
      <p class="small muted" style="margin:8px 0 0">Traits like agile, deadly-d10 or fatal-d12 are used by the dice.</p></section>`;
    return h;
  }
  h += bigStats(title, S);
  h += `<dl class="sb"><div><dt>Speed</dt><dd>${esc(S.speed)}</dd></div><div class="w"><dt>Senses</dt><dd>${esc(S.senses)}</dd></div>
      ${S.skills.length ? `<div class="w"><dt>Skills</dt><dd>${S.skills.map(s => `${esc(s.n)} ${rb(title + ' ' + s.n, s.v)}`).join('&ensp;')}</dd></div>` : ''}
      ${cp.notes.trim() ? `<div class="w"><dt>Notes</dt><dd class="pre">${esc(cp.notes)}</dd></div>` : ''}</dl>`;
  if (!S.strikes.length) return h + '<p class="small muted">No attacks yet. Use <b>Edit stats</b> to add some.</p></section>';
  h += '<h3 class="sub">Strikes</h3><div class="strikes">';
  for (const s of S.strikes) {
    h += `<div class="strike"><div class="sh"><b>${esc(s.n)}</b></div>${traitChips(s.tr)}`;
    if (s.ok) h += strikeRolls(title + ' ' + s.n.toLowerCase(), s);
    else h += `<div class="rolls"><span class="rl-lab">Attack</span>${[0, s.map[0], s.map[1]].map(p => rb(title + ' ' + s.n.toLowerCase(), s.atk + p)).join('')}</div><p class="small" style="color:var(--warn);margin:6px 0 0">Damage dice should look like 1d8 or 2d6.</p>`;
    h += '</div>';
  }
  return h + '</div></section>';
}

function compCard(cp, i) {
  if (cp.kind === 'custom') return customCard(cp, i);
  const S = compStats(cp);
  if (!S) return '';
  const title = compTitle(cp, S);
  const line = cp.kind === 'animal' ? `Young ${S.T.n.toLowerCase()} animal companion, ${S.size}` : 'Familiar, Tiny';
  let h = '<section class="comp">' + compHead(cp, i, title, line, 'Name your ' + (cp.kind === 'animal' ? esc(S.T.n.toLowerCase()) : 'familiar'),
    `<button class="btn line sm" data-act="customize" data-i="${i}" title="Copy these stats into a custom companion you can edit">Customize</button>`);
  h += bigStats(title, S);
  h += `<dl class="sb"><div><dt>Speed</dt><dd>${esc(S.speed)}</dd></div><div class="w"><dt>Senses</dt><dd>${esc(S.senses)}</dd></div>
      <div class="w"><dt>Skills</dt><dd>${S.skills.map(s => `${esc(s.n)} ${rb(title + ' ' + s.n, s.v)}`).join('&ensp;')}</dd></div>`;
  if (cp.kind === 'animal') {
    const T = S.T;
    const special = [T.note, T.mount ? 'Can be ridden as a mount.' : ''].filter(Boolean).join(' ');
    h += `<div class="w"><dt>Attributes</dt><dd>${AT.map(k => `${ATS[k]} ${sg(S.m[k])}`).join('&ensp;')}</dd></div>
      <div class="w"><dt>Support benefit</dt><dd>${esc(T.support)}</dd></div>
      ${special ? `<div class="w"><dt>Special</dt><dd>${esc(special)}</dd></div>` : ''}
      <div class="w"><dt>Advanced maneuver</dt><dd>${aonA(T.man, T.man)} <span class="muted">(learned once the companion becomes nimble or savage)</span></dd></div>
    </dl><h3 class="sub">Strikes</h3><div class="strikes">${S.strikes.map(s => `<div class="strike"><div class="sh"><b>${esc(s.n)}</b>${rk(1)}</div>${traitChips(s.tr)}${strikeRolls(title + ' ' + s.n.toLowerCase(), s)}</div>`).join('')}</div>
    <p class="small muted">${aonA(T.n + ' animal companion', 'Full ' + T.n.toLowerCase() + ' entry on Archives of Nethys')}. Your companion acts when you spend an action to Command it.</p>`;
    return h + '</section>';
  }
  h += `<div><dt>Uses</dt><dd>Your AC and saves; ${ATN[S.att]} for skills</dd></div></dl>
    <div class="fam-speed"><span class="small muted">Movement</span><div class="seg"><button class="${!cp.swim ? 'sel' : ''}" data-act="famSwim" data-i="${i}" data-v="0">Land 25 ft</button><button class="${cp.swim ? 'sel' : ''}" data-act="famSwim" data-i="${i}" data-v="1">Swim 25 ft</button></div></div>
    <h3 class="sub">Abilities <span class="muted" style="font-weight:400">${cp.abil.length} of ${cp.per} chosen today</span>
      <span class="qty" style="margin-left:8px"><button data-act="famPer" data-i="${i}" data-d="-1">−</button><span class="num">${cp.per}</span><button data-act="famPer" data-i="${i}" data-d="1">+</button></span></h3>
    <p class="small muted" style="margin:-4px 0 10px">Most familiars get 2 each day; some classes and feats give more. You can change them during your daily preparations.</p><div class="abil">`;
  for (const k of ['f', 'm']) {
    h += `<p class="small" style="margin:8px 0 6px;font-weight:600">${k === 'f' ? 'Familiar abilities' : 'Master abilities'}</p>`;
    for (const f of FAMILIAR_ABILITIES.filter(x => x.kind === k)) {
      const on = cp.abil.includes(f.id), dis = !on && cp.abil.length >= cp.per;
      h += `<button class="ab ${on ? 'sel' : ''} ${dis ? 'dis' : ''}" data-act="famAbil" data-i="${i}" data-id="${f.id}" ${dis ? 'aria-disabled="true"' : ''}><b>${esc(f.n)}</b><span>${esc(f.d)}</span></button>`;
    }
  }
  return h + `</div><p class="small muted">${aonA('familiar abilities', 'All familiar abilities on Archives of Nethys')}</p></section>`;
}

STEP_FN.companions = c => {
  let h = head('Companions', 'Add an animal companion or a familiar if your class or feats give you one, or make a custom companion with your own stats. Every bonus can be rolled.', AON + 'Companions.aspx');
  const tips = D.todo.filter(t => t.step === 'companions');
  if (UI.imgMsg) h += `<div class="note bad">${esc(UI.imgMsg)}</div>`;
  for (const t of tips) h += `<div class="note info">${esc(t.text)}: your ${D.K ? esc(D.K.n.toLowerCase()) : 'character'}’s choices give you one.</div>`;
  if (D.K && D.K.id === 'summoner') {
    const e = D.SUBS[0];
    h += `<div class="note info">Your eidolon has its own statistics set by its type and the stat array you pick. You can add it as a custom companion. ${aonA(e ? e.n : 'eidolon', 'See its entry on Archives of Nethys')}.</div>`;
  }
  if (!c.comps.length && !tips.length) h += '<div class="note info">Companions are optional. Most characters get one from a class feature or feat, like a druid’s animal order, a witch’s patron, or the Animal Companion feat.</div>';
  c.comps.forEach((cp, i) => h += compCard(cp, i));
  if (c.comps.length < 4) {
    h += `<h2 class="sec">Add a companion</h2><div class="row-btns"><button class="btn line" data-act="addFam">Add a familiar</button><button class="btn line" data-act="addCustom">Create a custom companion</button><button class="btn line" data-act="showList" data-l="comp">Add an animal companion</button></div>`;
    if (UI.showList.comp) h += '<h3 class="sub">Animal companion types</h3>' + filterBar('comp', 'Search companion types') + `<div id="L-comp">${LISTS.comp(c)}</div>`;
  }
  return h;
};
LISTS.comp = c => paged('comp', filtered('comp', ANIMAL_COMPANIONS.map(t => Object.assign({ r: 0 }, t)), t => t.n + ' ' + t.skill + ' ' + t.speed), t => {
  const hp = t.hp + 6 + t.m[2];
  const body = `<dl class="sb"><div><dt>Size</dt><dd>${esc(t.size)}</dd></div><div><dt>Hit Points at 1st level</dt><dd>${hp}</dd></div><div><dt>Speed</dt><dd>${esc(t.speed)}</dd></div>
      <div class="w"><dt>Attributes</dt><dd>${AT.map((k, i) => `${ATS[k]} ${sg(t.m[i])}`).join('&ensp;')}</dd></div>
      <div class="w"><dt>Attacks</dt><dd>${t.atk.map(([n, d, ty, tr]) => `${n} ${d} ${ty}${tr.length ? ' (' + tr.join(', ') + ')' : ''}`).join('; ')}</dd></div>
      <div><dt>Skill</dt><dd>${esc(t.skill)}</dd></div><div class="w"><dt>Senses</dt><dd>${esc(t.senses)}</dd></div>
      <div class="w"><dt>Support benefit</dt><dd>${esc(t.support)}</dd></div>${t.note ? `<div class="w"><dt>Special</dt><dd>${esc(t.note)}</dd></div>` : ''}
      <div><dt>Source</dt><dd>${esc(t.s)}</dd></div></dl>
      <div class="ent-act"><button class="btn primary sm" data-act="addPet" data-id="${t.id}">Add ${esc(t.n.toLowerCase())}</button>${aonA(t.n + ' animal companion')}</div>`;
  return entry('ct:' + t.id, { title: esc(t.n), badge: rarBadge(t.r), meta: `<span>${hp} HP</span><span class="hide-m">${esc(t.speed)}</span>`, body });
}, 'No companion types match.');

const INV_TABS = [['weapon', 'Weapons'], ['armor', 'Armor'], ['shield', 'Shields'], ['gear', 'Gear'], ['consumable', 'Consumables'], ['ammo', 'Ammunition']];
function tabOf(i) { return ['equipment', 'backpack', 'kit'].includes(i.k) ? 'gear' : i.k; }
function price(i) { return i.pc ? money(i.pc) : 'Free'; }
function itemMeta(i) {
  if (i.k === 'weapon') return `<span>${i.d} ${i.dt}</span><span class="hide-m">${titleCase(i.cat)}</span><span>${price(i)}</span>`;
  if (i.k === 'armor') return `<span>+${i.ac} AC</span><span class="hide-m">${titleCase(i.cat)}</span><span>${price(i)}</span>`;
  if (i.k === 'shield') return `<span>+${i.ac} AC</span><span>${money(i.pc)}</span>`;
  return `<span class="hide-m">Level ${i.lv}</span><span>${price(i)}${i.per && i.pc ? ' per ' + i.per : ''}</span>`;
}
function itemBody(i, c) {
  const row = (k, v, w) => `<div${w ? ' class="w"' : ''}><dt>${k}</dt><dd>${v}</dd></div>`;
  let rows = row('Item level', i.lv) + row('Price', price(i) + (i.per ? ' for ' + i.per : '')) + row('Bulk', bulkStr(i.bk));
  if (i.k === 'weapon') {
    rows += row('Damage', `${i.d} ${{ B: 'bludgeoning', P: 'piercing', S: 'slashing' }[i.dt] || i.dt}`) + row('Category', `${titleCase(i.cat)} ${i.rg ? 'ranged' : 'melee'}`) + row('Group', titleCase(i.g || '—'));
    if (i.rg) rows += row('Range', i.rg + ' feet');
    if (i.rl && i.rl !== '-') rows += row('Reload', esc(i.rl));
    if (i.u) rows += row('Hands', /two/.test(i.u) ? '2' : /plus/.test(i.u) ? '1+' : '1');
    if (D.K) rows += row('Your training', rk(D.wRank(i), 1));
  }
  if (i.k === 'armor') {
    rows += row('AC bonus', '+' + i.ac) + row('Dex cap', i.cap == null ? '—' : sg(i.cap)) + row('Strength', i.str ? sg(strNeed(i.str)) : '—') + row('Check penalty', i.cpn || '—') + row('Speed penalty', i.spn ? i.spn + ' ft' : '—') + row('Category', titleCase(i.cat));
    if (D.K) rows += row('Your training', rk(D.defR[i.cat] || 0, 1));
  }
  if (i.k === 'shield') rows += row('AC when raised', '+' + i.ac) + row('Hardness', i.hd) + row('Hit Points', `${i.hpx} (BT ${Math.floor(i.hpx / 2)})`) + (i.spn ? row('Speed penalty', i.spn + ' ft') : '');
  if (i.dmg) rows += row('Effect dice', esc(i.dmg));
  if (i.cat && i.k === 'consumable') rows += row('Type', titleCase(i.cat));
  if (i.inc) rows += row('Contains', esc(i.inc.join(', ')), true);
  rows += row('Source', esc(i.s));
  const owned = c.inv.find(x => x.id === i.id);
  return `${traitChips(i.tr, i.r, i.lg)}<dl class="sb">${rows}</dl>
    <div class="ent-act"><button class="btn primary sm" data-act="addItem" data-id="${i.id}">${owned ? `Add another (${owned.q} owned)` : 'Add to inventory'}</button>${aonA(i.n)}</div>`;
}
LISTS.items = c => paged('items', filtered('items', DATA.items.filter(i => tabOf(i) === UI.invTab), i => i.n + ' ' + i.tr.join(' ') + ' ' + (i.g || '') + ' ' + (i.cat || '')),
  i => entry('item:' + i.id, { title: esc(i.n), badge: rarBadge(i.r), meta: itemMeta(i), body: itemBody(i, c) }), 'No items match. Try another search, tab or rarity.');

STEP_FN.gear = c => {
  let h = head('Gear up', 'You start with 15 gold pieces and can buy any common item of level 1 or lower. AC, Speed, Bulk and attacks update as you shop.', AON + 'Equipment.aspx');
  const over = D.spent > BUDGET;
  const bulkCls = D.bulkVal > D.maxB ? 'over' : D.bulkVal > D.encAt ? 'mid' : '';
  h += `<div class="meters"><div class="meter ${over ? 'over' : ''}"><div class="top-l"><span class="bl num">${over ? 'Over by ' + money(D.spent - BUDGET) : money(BUDGET - D.spent) + ' left'}</span><span class="small muted num">${money(D.spent)} of 15 gp</span></div><div class="bar"><span style="width:${Math.min(100, D.spent / BUDGET * 100)}%"></span></div></div>
    <div class="meter ${bulkCls}"><div class="top-l"><span class="bl num">${D.bulkVal} Bulk</span><span class="small muted num">Encumbered over ${D.encAt}, limit ${D.maxB}</span></div><div class="bar"><span style="width:${Math.min(100, D.bulkVal / Math.max(1, D.maxB) * 100)}%"></span></div></div></div>`;
  h += '<h2 class="sec">Inventory</h2>';
  if (!c.inv.length) h += '<div class="list"><div class="empty">Nothing yet. Add items from the catalog below; an Adventurer’s Pack is a good start.</div></div>';
  else {
    h += '<div class="inv">';
    c.inv.forEach((x, idx) => {
      const i = ITEM[x.id];
      if (!i) return;
      let ctl = '';
      if (i.k === 'armor') ctl = `<button class="btn ${c.worn === i.id ? 'on' : 'line'} sm" data-act="wear" data-id="${i.id}">${c.worn === i.id ? 'Worn' : 'Wear'}</button>`;
      if (i.k === 'shield') ctl = `<button class="btn ${c.sh === i.id ? 'on' : 'line'} sm" data-act="wield" data-id="${i.id}">${c.sh === i.id ? 'Carried' : 'Carry'}</button>`;
      const free = x.id === 'clan-dagger' && c.anc === 'dwarf' ? ' (one free for dwarves)' : '';
      const each = i.pc ? money(i.pc) + (i.per ? ' per ' + i.per : ' each') : 'free';
      h += `<div class="irow"><div class="in">${esc(i.n)}<small>${titleCase(i.k === 'equipment' ? 'gear' : i.k)}, ${each}${free}, Bulk ${bulkStr(i.bk)}</small></div><div>${ctl}</div>
        <div class="qty"><button data-act="qty" data-i="${idx}" data-d="-1">−</button><span class="num">${x.q}</span><button data-act="qty" data-i="${idx}" data-d="1">+</button></div></div>`;
    });
    h += '</div>';
  }
  h += '<h2 class="sec">Defenses</h2>';
  if (D.armor && !D.strMet && D.armor.cpn < 0) h += `<div class="note bad">Your Strength (${sg(D.mods.str)}) is below this armor’s requirement (${sg(D.sReq)}), so you take its check penalty and its full Speed penalty.</div>`;
  else if (D.armor && D.armor.spn < 0) h += '<div class="note info">Your Strength meets the requirement, so you ignore the check penalty and the Speed penalty drops by 5 feet.</div>';
  if (D.cap != null && D.mods.dex > D.cap) h += `<div class="note">Your Dexterity (${sg(D.mods.dex)}) is above the armor’s cap (${sg(D.cap)}), so ${D.mods.dex - D.cap} of it doesn’t count toward AC.</div>`;
  h += `<div class="strikes"><div class="strike"><div class="sh"><b>Armor Class</b>${rk(D.armorRank)}</div><div class="att num">${D.ac}</div><div class="map">${D.armor ? esc(D.armor.n) : 'Unarmored'}${D.shield ? `; ${D.acShield} with ${esc(D.shield.n.toLowerCase())} raised` : ''}</div></div>
    <div class="strike"><div class="sh"><b>Speed</b></div><div class="att num">${D.speed ?? '—'}${D.speed ? ' ft' : ''}</div><div class="map">${D.otherSpeeds.join(', ') || 'Land speed'}</div></div></div>`;
  h += '<h2 class="sec">Strikes</h2><div class="strikes">';
  for (const s of D.strikes) {
    h += `<div class="strike"><div class="sh"><b>${esc(s.w.n)}</b>${rk(s.rank)}</div><div class="att num">${sg(s.atk)}</div><div class="dmg num">${s.dmgStr}</div>
      <div class="map num">${s.w.rg && s.ranged ? s.w.rg + ' ft range. ' : ''}Second ${sg(s.atk + s.map[0])}, third ${sg(s.atk + s.map[1])}</div>${traitChips(s.w.tr)}${strikeRolls(s.w.n, Object.assign({ tr: s.w.tr }, s))}</div>`;
  }
  const counts = {};
  DATA.items.forEach(i => counts[tabOf(i)] = (counts[tabOf(i)] || 0) + 1);
  h += `</div><h2 class="sec">Catalog <small>${DATA.items.length} items of level 1 or lower</small></h2>`;
  h += `<div class="tabs">${INV_TABS.map(([k, n]) => `<button class="${UI.invTab === k ? 'sel' : ''}" data-act="invTab" data-id="${k}">${n}<span>${counts[k] || 0}</span></button>`).join('')}</div>`;
  h += filterBar('items', 'Search items, traits or groups') + `<div id="L-items">${LISTS.items(c)}</div>`;
  return h;
};

STEP_FN.sheet = c => {
  const P = c.play, conds = P.conds, title = c.name.trim() || 'Unnamed hero';
  const swash = !!(D.K && D.K.id === 'swashbuckler'), pan = swash && P.panache;
  const tipFor = p => p.n ? ` title="${esc('Includes −' + p.n + ' from ' + p.why.join(' and '))}"` : '';
  function roll(label, base, kind, attr, bonus) {
    const p = condPenalty(conds, kind, attr);
    const cls = p.n ? 'adj' : bonus ? 'buff' : '';
    return `<span class="${cls}"${tipFor(p)}>${rb(label, base - p.n + (bonus || 0))}</span>`;
  }
  function dc(base, kind, attr) {
    if (base == null) return '—';
    const p = condPenalty(conds, kind, attr);
    return `<span class="${p.n ? 'adj' : ''}"${tipFor(p)}>${base - p.n}</span>`;
  }
  const drained = conds.drained || 0;
  const maxHP = D.hp == null ? null : Math.max(1, D.hp - LEVEL * drained);
  const cur = maxHP == null ? null : Math.min(maxHP, P.hp == null ? maxHP : P.hp);
  const hpCls = cur == null ? '' : cur === 0 ? 'zero' : cur <= maxHP / 2 ? 'low' : '';
  const needs = D.todo.filter(t => t.kind !== 'tip');
  const featRow = (n, kind) => `<div class="kv"><span>${aonA(n, n)}</span><span class="v small muted">${esc(kind)}</span></div>`;

  let h = '';
  if (needs.length) h += `<div class="note">${needs.length} thing${needs.length > 1 ? 's' : ''} still to finish. <button class="btn ghost sm" data-act="go" data-step="${needs[0].step}" style="padding:0 6px">${esc(needs[0].text)}</button></div>`;
  if (UI.restMsg) h += `<div class="note info">${esc(UI.restMsg)}</div>`;

  let chips = '<span class="muted small">None active</span>';
  if (Object.keys(conds).length) {
    chips = Object.keys(conds).map(id => {
      const cd = CONDITIONS.find(x => x.id === id);
      const val = cd.v ? `<span class="qty mini"><button data-act="condStep" data-id="${id}" data-d="-1">−</button><span class="num">${conds[id]}</span><button data-act="condStep" data-id="${id}" data-d="1">+</button></span>` : '';
      return `<span class="cchip" title="${esc(cd.d)}">${esc(cd.n)}${val}<button class="x" data-act="condRm" data-id="${id}" aria-label="Remove ${esc(cd.n)}">✕</button></span>`;
    }).join('');
  }
  const menu = UI.condOpen ? `<div class="cond-menu">${CONDITIONS.filter(cd => !conds[cd.id]).map(cd => `<button data-act="condAdd" data-id="${cd.id}"><b>${esc(cd.n)}</b><span>${esc(cd.d)}</span></button>`).join('')}</div>` : '';
  const star = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  const bolt = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';

  h += `<div class="cs"><div class="cs-row">
    <section class="card cs-id">${avatar(c.portrait, c.name, 'xl')}
      <div class="cs-who"><h2>${esc(title)}</h2>
        <p><span class="lab">Ancestry</span>${esc(D.H ? D.H.n : D.A ? D.A.n : '—')}</p>
        <p><span class="lab">Background</span>${esc(D.B ? D.B.n : '—')}</p>
        <p><span class="lab">Class</span>${esc(D.K ? D.K.n + (D.SUBS[0] ? ', ' + D.SUBS[0].n.replace(/^Bloodline: /, '') : '') : '—')}</p></div>
      <div class="cs-side"><button class="btn line sm" data-act="go" data-step="ancestry">Edit</button><button class="btn line sm" data-act="rest" title="A full night’s rest">Rest</button><span class="lvl">Level ${LEVEL}</span></div>
    </section>
    <section class="card cs-hp">
      <div class="cs-hp-top">
        <div><span class="cap">Hit Points</span><div class="hpv num"><span class="cur ${hpCls}">${cur ?? '—'}</span><span class="sl">/</span><span>${maxHP ?? '—'}</span></div></div>
        <div class="tmp"><span class="cap">Temp HP</span><div class="qty"><button data-act="tempHP" data-d="-1">−</button><span class="num">${P.temp || '—'}</span><button data-act="tempHP" data-d="1">+</button></div></div>
      </div>
      <div class="hp-ctl"><input id="hp-amt" class="input num" type="number" min="1" max="999" placeholder="Amount">
        <button class="btn line sm dmg" data-act="hp" data-k="dmg">Damage</button><button class="btn line sm heal" data-act="hp" data-k="heal">Heal</button></div>
      <p class="cap center">${D.resist.length ? 'Resistances: ' + esc(D.resist.join(', ')) : 'No resistances or weaknesses'}${drained ? ` · Max HP −${LEVEL * drained} from drained` : ''}</p>
    </section>
    <section class="card cs-cond">
      <div class="cs-cond-main"><div class="cs-cond-head"><span class="cap">Conditions</span><button class="icon-btn sm" data-act="condMenu" aria-label="Add a condition">+</button></div>
        <div class="cond-chips">${chips}</div>${menu}</div>
      <div class="cs-hero"><span class="cap">Hero Points</span><div class="stars">${[1, 2, 3].map(i => `<button class="star ${P.hero >= i ? 'on' : ''}" data-act="hero" data-n="${i}" aria-label="${i} hero points">${star}</button>`).join('')}</div>
        ${swash ? `<button class="panache ${pan ? 'on' : ''}" data-act="panache" title="${pan ? 'You have panache. Tap to lose it.' : 'Tap when you gain panache'}">${bolt}Panache</button>` : ''}</div>
    </section>
  </div>`;

  const shieldAC = D.shield ? D.shield.ac : 0;
  const raised = D.shield && P.raised;
  h += `<div class="cs-row">
    <section class="card cs-attr">${AT.map(k => `<div class="pill ${D.keyAttr === k ? 'key' : ''}"><span>${ATN[k]}</span><b class="num">${sg(D.mods[k])}</b></div>`).join('')}</section>
    <section class="card cs-def">
      <div class="ac"><span class="v num">${dc(D.ac + (raised ? shieldAC : 0), 'ac', 'dex')}</span><span class="cap">AC${raised ? ', shield raised' : ''}</span></div>
      ${D.shield ? `<button class="shield ${P.raised ? 'on' : ''}" data-act="raise" title="Raise Shield: +${shieldAC} AC until your next turn"><span class="v num">+${shieldAC}</span><span class="cap">Hardness ${D.shield.hd}</span><span class="cap">${P.raised ? 'Raised' : 'Raise'}</span></button>` : ''}
      <div class="saves">${[['fort', 'Fortitude', 'con'], ['ref', 'Reflex', 'dex'], ['will', 'Will', 'wis']].map(([k, n, at]) => `<div class="pill"><span>${n}</span><b class="num">${roll(n + ' save', D.saves[k], 'save', at)}</b>${rk(D.ranks[k])}</div>`).join('')}</div>
    </section>
    <section class="card cs-per">
      <div><span class="cap">Perception</span><span class="v num">${roll('Perception', D.perception, 'perception', 'wis')}</span><span class="cap">${esc(D.senses.join(', ') || 'Normal vision')}</span></div>
      <div><span class="cap">Speed</span><span class="v num ${pan ? 'buff' : ''}">${D.speed == null ? '—' : D.speed + (pan ? 5 : 0)}<small>${D.speed ? ' ft' : ''}</small></span><span class="cap">${esc([pan ? '+5 ft panache' : '', ...D.otherSpeeds].filter(Boolean).join(', '))}</span></div>
      <div><span class="cap">Class DC</span><span class="v num box">${dc(D.classDC, 'dc', D.keyAttr)}</span>${D.spell ? `<span class="cap">Spell DC ${dc(D.spell.dc, 'dc', D.keyAttr)}</span>` : ''}</div>
    </section>
  </div>`;

  const tabs = [['skills', 'Skills & Actions'], ['inv', 'Inventory'], ['feats', 'Feats & Features']];
  if (D.spell && D.caster) tabs.push(['spells', 'Spells']);
  if (c.comps.length) tabs.push(['comps', 'Companions']);
  tabs.push(['details', 'Details'], ['notes', 'Notes']);
  const tab = tabs.some(t => t[0] === UI.sheetTab) ? UI.sheetTab : 'skills';
  h += `<section class="card cs-tabs"><div class="tabs">${tabs.map(([k, n]) => `<button class="${tab === k ? 'sel' : ''}" data-act="sheetTab" data-id="${k}">${n}</button>`).join('')}</div><div class="cs-body">`;

  if (tab === 'skills') {
    const skillRow = (name, mod, attr, rank) => `<div class="sk-row" data-sk="${esc(name.toLowerCase())}"><span>${esc(name)}</span><b class="num">${roll(name, mod, 'skill', attr)}</b>${rk(rank)}</div>`;
    let strikes = '';
    for (const s of D.strikes) {
      const pa = condPenalty(conds, 'attack', s.atkAttr), pd = condPenalty(conds, 'damage', s.dmAttr);
      const precise = swash && !s.ranged && (s.w.tr.includes('agile') || s.w.tr.includes('finesse'));
      const base = s.dm - pd.n, dm = base + (pan && precise ? 2 : 0);
      const adj = Object.assign({}, s, { tr: s.w.tr, atk: s.atk - pa.n, dm, dmgStr: dmgText(s.die, dm, s.dt) });
      let fin = '';
      if (pan && precise) {
        const d = `data-roll="dmg" data-act="finisher" data-l="${esc(s.w.n)} finisher" data-d="${esc(s.die)}" data-m="${base}" data-x="2d6" data-t="${esc(s.dt)}" data-tr="${esc(s.w.tr.join(','))}"`;
        fin = `<div class="rolls"><span class="rl-lab">Finisher</span><button class="rollv fin" ${d} title="Roll finisher damage and spend your panache">${esc(dmgText(s.die, base, s.dt))} + 2d6</button><button class="rollv fin crit" ${d} data-crit="1">Critical</button></div>`;
      }
      strikes += `<div class="act"><div class="act-h"><b>${esc(s.w.n)}</b><span class="muted num">${sg(adj.atk)} ${esc(adj.dmgStr)}${pan && precise ? ' <span class="buff">(+2 precise strike)</span>' : ''}</span>${traitChips(s.w.tr)}</div>${strikeRolls(s.w.n, adj)}${fin}</div>`;
    }
    let panGroup = '';
    if (swash) {
      const style = SWASH_STYLE[(D.SUBS[0] || {}).id];
      const skillBtn = (label, name) => { const s = D.skills.find(x => x.name === name); return s ? roll(label, s.mod, 'skill', s.attr, pan ? 1 : 0) : ''; };
      panGroup = `<details class="grp" open><summary>Panache <span class="count ${pan ? 'on' : ''}">${pan ? 'Active' : 'Off'}</span></summary>
        <div class="act"><div class="act-h"><button class="btn ${pan ? 'primary' : 'line'} sm" data-act="panache">${pan ? 'You have panache' : 'Gain panache'}</button>
          <span class="muted small">${pan ? 'Speed +5 ft, +2 precision damage with agile and finesse melee Strikes, and finishers are available.' : 'Earn it by succeeding at Tumble Through or ' + (style ? style[1] : 'your style’s actions') + '.'}</span></div>
          <div class="rolls"><span class="rl-lab">Tumble Through</span>${skillBtn('Tumble Through (Acrobatics)', 'Acrobatics')}
          ${style ? `<span class="rl-lab" style="margin-left:8px">${esc(style[1])}</span>${skillBtn(style[1] + ' (' + style[0] + ')', style[0])}` : ''}</div>
          ${pan ? '<p class="small muted" style="margin:6px 0 0">These checks include the +1 from panache. Using a finisher spends your panache.</p>' : ''}</div></details>`;
    }
    const actFeats = D.feats.filter(f => FEATI[f.n] && FEATI[f.n].a);
    h += `<div class="cs-split"><div class="cs-skills"><input class="input" data-sksearch placeholder="Search skills">
        ${D.skills.map(s => skillRow(s.name, s.mod, s.attr, s.rank)).join('')}${D.lores.map(l => skillRow(l.name, l.mod, 'int', 1)).join('')}</div>
      <div class="cs-acts">${panGroup}
        <details class="grp" open><summary>Weapon attacks <span class="count">${D.strikes.length}</span></summary>${strikes}</details>
        ${D.spell ? `<details class="grp" open><summary>Spellcasting <span class="count">1</span></summary><div class="act"><div class="act-h"><b>${titleCase(D.spell.trad)} spells</b><span class="muted">Spell DC ${dc(D.spell.dc, 'dc', D.keyAttr)}</span></div><div class="rolls"><span class="rl-lab">Spell attack</span>${roll('Spell attack', D.spell.atk, 'attack', D.keyAttr)}</div></div></details>` : ''}
        <details class="grp" ${actFeats.length ? 'open' : ''}><summary>Feats with actions <span class="count">${actFeats.length}</span></summary>${actFeats.length ? actFeats.map(f => `<div class="act"><div class="act-h"><b>${aonA(f.n, f.n)}</b><span class="muted">${actGlyph(FEATI[f.n].a)}</span>${traitChips(FEATI[f.n].tr)}</div></div>`).join('') : '<p class="muted small" style="margin:8px 0">None of your feats use actions yet.</p>'}</details>
        <p class="small muted">Tap any bonus to roll it. Penalties from conditions are applied automatically and shown in amber.</p>
      </div></div>`;
  } else if (tab === 'inv') {
    if (!c.inv.length) h += '<p class="muted">No items yet.</p>';
    else h += '<div class="inv">' + c.inv.map(x => {
      const i = ITEM[x.id];
      if (!i) return '';
      const tag = c.worn === i.id ? ', worn' : c.sh === i.id ? ', carried' : '';
      return `<div class="irow"><div class="in">${aonA(i.n, i.n)}${x.q > 1 ? ' ×' + x.q : ''}<small>${titleCase(i.k === 'equipment' ? 'gear' : i.k)}${tag}</small></div><div></div><span class="small muted">Bulk ${bulkStr(i.bk)}</span></div>`;
    }).join('') + '</div>';
    h += `<p class="small muted">${money(BUDGET - D.spent)} left. Carrying ${D.bulkVal} Bulk (encumbered over ${D.encAt}).</p><button class="btn line sm" data-act="go" data-step="gear">Edit equipment</button>`;
  } else if (tab === 'feats') {
    if (!D.feats.length && !D.K) h += '<p class="muted">Your feats and class features will appear here.</p>';
    else {
      h += '<div class="cs-cols">' + D.feats.map(f => featRow(f.n, f.kind)).join('') + D.SUBS.map(o => featRow(o.n, D.K.n)).join('');
      if (D.K) h += D.K.l1.filter(n => n !== 'Shield Block').map(n => featRow(n, D.K.n)).join('');
      if (D.H) h += `<div class="kv"><span>${esc(D.H.n)}</span><span class="v small muted">Heritage</span></div>`;
      h += '</div>';
    }
  } else if (tab === 'spells') {
    h += `<p class="small muted">${titleCase(D.spell.trad)} tradition. Spell DC ${dc(D.spell.dc, 'dc', D.keyAttr)}, spell attack ${roll('Spell attack', D.spell.atk, 'attack', D.keyAttr)}.</p><div class="cs-cols">`;
    for (const [k, lab] of [['c', 'Cantrip'], ['r1', '1st rank']]) {
      for (const n of c.spells[k]) {
        const sp = SPELLI[n], where = sp && (sp.rg || sp.ar);
        h += `<div class="kv"><span>${aonA(n, n)}</span><span class="v small muted">${lab}${where ? ', ' + esc(where) : ''}</span></div>`;
      }
    }
    h += `</div>${c.spells.c.length + c.spells.r1.length ? '' : '<p class="muted">No spells chosen yet.</p>'}<button class="btn line sm" data-act="go" data-step="spells">Edit spells</button>`;
  } else if (tab === 'comps') {
    h += '<div class="comp-mini">' + c.comps.map(cp => {
      const S = compStats(cp);
      if (!S) return '';
      const t = compTitle(cp, S), first = S.strikes[0];
      return `<div class="cm">${avatar(cp.portrait, t, 'md')}<div><b>${esc(t)}</b><span class="small muted">${esc(compKind(cp, S))}</span><span class="small">HP ${S.hp}, AC ${S.ac}, Perception ${rb(t + ' Perception', S.perc)}${first ? `, ${esc(first.n)} ${rb(t + ' ' + first.n.toLowerCase(), first.atk)}` : ''}</span></div></div>`;
    }).join('') + '</div><button class="btn line sm" data-act="go" data-step="companions" style="margin-top:10px">Open companions</button>';
  } else if (tab === 'details') {
    const kv = (k, v) => `<div class="kv"><span>${k}</span><span class="v">${esc(v || '—')}</span></div>`;
    h += `<div class="cs-cols">${kv('Ancestry', D.A && D.A.n)}${kv('Heritage', D.H && D.H.n)}${kv('Background', D.B && D.B.n)}${kv('Class', D.K && D.K.n)}
      ${D.SUBS.map(o => kv('Class option', o.n)).join('')}${kv('Size', D.sizeName)}${kv('Senses', D.senses.join(', ') || 'Normal vision')}
      ${kv('Languages', [...D.known, ...D.langPicked].join(', '))}${kv('Armor', D.armor ? D.armor.n : 'Unarmored')}${D.resist.length ? kv('Resistances', D.resist.join(', ')) : ''}</div>
      <div class="danger-row"><button class="btn ghost sm bad" data-act="delChar">${UI.confirmDelete ? 'Click again to delete this character' : 'Delete character'}</button></div>`;
  } else {
    h += `<textarea class="input" rows="10" data-in="notes" placeholder="Backstory, goals, allies, anything you want to remember">${esc(c.notes)}</textarea>`;
  }
  return h + '</div></section></div>';
};

function renderSide(c) {
  const line = [D.H ? D.H.n : D.A ? D.A.n : '', D.K ? D.K.n.toLowerCase() : ''].filter(Boolean).join(' ');
  const vals = { hp: D.hp ?? '—', ac: D.ac, spd: D.speed ?? '—', perc: sg(D.perception), fort: sg(D.saves.fort), ref: sg(D.saves.ref), will: sg(D.saves.will), dc: D.classDC ?? '—' };
  AT.forEach(a => vals[a] = sg(D.mods[a]));
  const tk = k => UI.prev[k] !== undefined && UI.prev[k] !== vals[k] ? ' tick' : '';
  const needs = D.todo.filter(t => t.kind !== 'tip'), tips = D.todo.filter(t => t.kind === 'tip');
  let h = `<button class="icon-btn side-close" data-act="closeSide" aria-label="Close summary">✕</button>
    <div class="who">${avatar(c.portrait, c.name, 'md')}<div><h2 class="${c.name.trim() ? '' : 'ph'}">${esc(c.name.trim() || 'Unnamed hero')}</h2><p>${line ? esc(line) + ', level 1' : 'Level 1'}</p></div></div>
    <div class="vitals"><div><span class="v num${tk('hp')}">${vals.hp}</span><span class="l">Hit Points</span></div>
      <div><span class="v num${tk('ac')}">${vals.ac}</span><span class="l">AC${D.shield ? ` (${D.acShield})` : ''}</span></div>
      <div><span class="v num${tk('spd')}">${vals.spd}</span><span class="l">Speed</span></div></div>
    <div class="statlist">
      <div><span>Perception</span><span class="v num${tk('perc')}">${rb('Perception', D.perception)}</span></div><div><span>Class DC</span><span class="v num${tk('dc')}">${vals.dc}</span></div>
      <div><span>Fortitude</span><span class="v num${tk('fort')}">${rb('Fortitude save', D.saves.fort)}</span></div><div><span>Reflex</span><span class="v num${tk('ref')}">${rb('Reflex save', D.saves.ref)}</span></div>
      <div><span>Will</span><span class="v num${tk('will')}">${rb('Will save', D.saves.will)}</span></div>
      ${D.spell ? `<div><span>Spell DC</span><span class="v num">${D.spell.dc}</span></div>` : `<div><span>Gold left</span><span class="v num" style="font-size:14px">${money(BUDGET - D.spent)}</span></div>`}
    </div>
    <div class="attrline">${AT.map(a => `<div><span>${ATS[a]}</span><b class="num${D.keyAttr === a ? ' key' : ''}${tk(a)}">${vals[a]}</b></div>`).join('')}</div><div class="todo">`;
  if (needs.length) {
    h += `<h3>Next up</h3><ul>${needs.slice(0, 7).map(t => `<li class="${t.kind}"><button data-act="go" data-step="${t.step}">${esc(t.text)}</button></li>`).join('')}`;
    if (needs.length > 7) h += `<li class="small muted" style="padding:4px 0">and ${needs.length - 7} more</li>`;
    h += '</ul>';
  } else {
    h += '<div class="ready"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M3.5 8.3l3 3 6-6.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Ready to play</div>';
  }
  if (tips.length) h += `<h3 style="margin-top:16px">Suggestions</h3><ul>${tips.map(t => `<li class="tip"><button data-act="go" data-step="${t.step}">${esc(t.text)}</button></li>`).join('')}</ul>`;
  h += '</div>';
  if (store.step !== 'sheet') h += '<button class="btn line" style="width:100%;margin-top:18px" data-act="go" data-step="sheet">Open character sheet</button>';
  $('#side').innerHTML = h;
  UI.prev = vals;
  $('#mbar').innerHTML = `<div class="ms"><span><b class="num">${vals.hp}</b>HP</span><span><b class="num">${vals.ac}</b>AC</span><span><b class="num">${vals.perc}</b>Perc.</span></div><button class="btn ${needs.length ? 'primary' : 'line'} sm" data-act="openSide">${needs.length ? needs.length + ' to do' : 'Summary'}</button>`;
}

function toggleIn(arr, v, max) {
  const i = arr.indexOf(v);
  if (i >= 0) arr.splice(i, 1);
  else if (arr.length < max) arr.push(v);
}
function classPrio(K) {
  const key = (CLASS_EXTRA[K.id] || {}).key || K.key;
  const martial = K.def.medium || K.def.heavy || K.hp >= 10;
  const base = martial ? ['str', 'con', 'dex', 'wis', 'int', 'cha'] : ['dex', 'con', 'wis', 'int', 'cha', 'str'];
  const lead = key.length === 1 ? key : [base.find(a => key.includes(a)) || key[0]].filter(Boolean);
  return [...lead, ...base.filter(a => !lead.includes(a))];
}
function priority() {
  const base = D.K ? classPrio(D.K) : ['con', 'dex', 'wis', 'str', 'int', 'cha'];
  const key = D.keyAttr || D.keys[0];
  return key ? [key, ...base.filter(a => a !== key)] : base;
}
function closeSide() { $('#side').classList.remove('open'); $('#scrim').classList.remove('open'); }
function closePop() { $('#popwrap').innerHTML = ''; UI.pop = null; }
function addItem(id) {
  const c = C(), it = ITEM[id], n = it.per || 1;
  const x = c.inv.find(y => y.id === id);
  if (x) x.q += n; else c.inv.push({ id, q: n });
  if (it.k === 'armor' && !c.worn) c.worn = id;
  if (it.k === 'shield' && !c.sh) c.sh = id;
}
function maxHP(c) { return Math.max(1, D.hp - LEVEL * (c.play.conds.drained || 0)); }
function confirmTwice(flag, value, then) {
  if (UI[flag] !== value) {
    UI[flag] = value;
    render();
    setTimeout(() => { if (UI[flag] === value) { UI[flag] = flag === 'confirmDelete' ? false : null; render(); } }, 3000);
    return;
  }
  UI[flag] = flag === 'confirmDelete' ? false : null;
  then();
}

const actions = {
  go(d) { UI.imgMsg = ''; UI.restMsg = ''; UI.condOpen = false; store.step = d.step; closeSide(); closePop(); render(); },
  tog(d) {
    if (UI.open.has(d.k)) UI.open.delete(d.k); else UI.open.add(d.k);
    for (const el of document.querySelectorAll('.ent')) if (el.dataset.key === d.k) el.classList.toggle('open', UI.open.has(d.k));
  },
  showList(d) { UI.showList[d.l] = true; render(); },
  rar(d) {
    const st = L(d.l);
    st.rar = d.r; st.lim = 40;
    document.querySelectorAll(`[data-act="rar"][data-l="${d.l}"]`).forEach(b => b.classList.toggle('sel', b.dataset.r === d.r));
    rerenderList(d.l);
  },
  more(d) { L(d.l).lim += 40; rerenderList(d.l); },
  anc(d) {
    const c = C();
    if (c.anc === d.id) return;
    Object.assign(c, { anc: d.id, her: null, alt: false, langs: [] });
    c.bo.anc = { f: [], c: [] };
    c.feats.anc = null;
    c.inv = c.inv.filter(x => x.id !== 'clan-dagger');
    if (d.id === 'dwarf') c.inv.unshift({ id: 'clan-dagger', q: 1 });
    UI.showList.anc = false; UI.open.delete('anc:' + d.id);
    render();
  },
  her(d) { const c = C(); c.her = d.id; c.feats.gen = null; render(); },
  alt() { const c = C(); c.alt = !c.alt; c.bo.anc = { f: [], c: [] }; render(); },
  bg(d) {
    const c = C();
    if (c.bg !== d.id) { c.bg = d.id; c.bo.bg = { f: [], c: [] }; }
    UI.showList.bg = false; UI.open.delete('bg:' + d.id);
    render();
  },
  cls(d) {
    const c = C();
    if (c.cls === d.id) return;
    const keys = (CLASS_EXTRA[d.id] || {}).key || CLS[d.id].key;
    Object.assign(c, { cls: d.id, subs: {}, grp: null, spells: { c: [], r1: [] }, key: keys.length === 1 ? keys[0] : null });
    c.feats.cls = null; c.feats.skill = null;
    UI.showList.cls = false; UI.open.delete('cls:' + d.id);
    render();
  },
  sub(d) {
    const c = C(), ch = CLS[c.cls].ch.find(x => x.tag === d.tag);
    let sel = (c.subs[d.tag] || []).slice();
    if (sel.includes(d.id)) sel = sel.filter(x => x !== d.id);
    else if (ch.count === 1) sel = [d.id];
    else if (sel.length < ch.count) sel.push(d.id);
    c.subs[d.tag] = sel;
    D = derive(c);
    if (D.keys.length === 1) c.key = D.keys[0];
    else if (!D.keys.includes(c.key)) c.key = null;
    if (D.trad && c.spells._trad && c.spells._trad !== D.trad) c.spells = { c: [], r1: [] };
    c.spells._trad = D.trad;
    render();
  },
  key(d) { C().key = d.id; render(); },
  grp(d) { C().grp = d.id; render(); },
  boost(d) {
    const c = C(), r = D.rows.find(x => x.id === d.row), a = d.id;
    if (!r || r.off || !r.allow(a)) return;
    UI.popCell = r.id + a;
    if (r.id === 'cls') c.key = c.key === a ? null : a;
    else if (r.id === 'lvl') toggleIn(c.bo.lvl, a, 4);
    else if (r.single) { const st = c.bo[r.gid]; st.c[r.ci] = st.c[r.ci] === a ? null : a; }
    else { const st = c.bo[r.gid]; st.f = st.f.filter(x => r.chosen.includes(x)); toggleIn(st.f, a, r.max); }
    render();
    UI.popCell = null;
  },
  quickBoosts() {
    const c = C();
    if (D.K && D.keys.length > 1 && !D.keyAttr) { c.key = classPrio(D.K).find(a => D.keys.includes(a)) || D.keys[0]; D = derive(c); }
    for (let n = 0; n < 12; n++) {
      const open = D.rows.filter(r => !r.off && r.id !== 'cls' && r.chosen.length < r.max);
      const r = open.find(x => x.single) || open[0];
      if (!r) break;
      const a = priority().find(x => r.allow(x) && !r.chosen.includes(x));
      if (!a) break;
      if (r.id === 'lvl') c.bo.lvl.push(a);
      else if (r.single) c.bo[r.gid].c[r.ci] = a;
      else c.bo[r.gid].f = [...r.chosen, a];
      D = derive(c);
    }
    render();
  },
  clearBoosts() { const c = C(); c.bo = { anc: { f: [], c: [] }, bg: { f: [], c: [] }, lvl: [] }; if (D.keys.length > 1) c.key = null; render(); },
  skill(d) {
    const c = C(), i = c.skills.indexOf(d.id);
    if (i >= 0) c.skills.splice(i, 1);
    else if (D.picked.length < D.picksNeeded) c.skills.push(d.id);
    render();
  },
  suggestSkills() {
    const c = C();
    if (!D.K) return;
    c.skills = D.picked.slice();
    const fav = { str: ['Athletics', 'Intimidation'], dex: ['Acrobatics', 'Stealth', 'Thievery'], int: ['Arcana', 'Society', 'Occultism', 'Crafting'], wis: ['Medicine', 'Survival', 'Nature', 'Religion'], cha: ['Diplomacy', 'Deception', 'Intimidation', 'Performance'], con: ['Athletics', 'Survival'] };
    const order = [...(fav[D.keyAttr] || []), 'Medicine', ...Object.keys(SKILLS).sort((x, y) => D.mods[SKILLS[y]] - D.mods[SKILLS[x]])];
    for (const s of order) {
      if (c.skills.length >= D.picksNeeded) break;
      if (!D.auto[s] && !c.skills.includes(s)) c.skills.push(s);
    }
    render();
  },
  lang(d) {
    const c = C(), i = c.langs.indexOf(d.id);
    if (i >= 0) c.langs.splice(i, 1);
    else if (D.langPicked.length < D.langExtra) c.langs.push(d.id);
    render();
  },
  feat(d) { C().feats[d.k] = d.id || null; if (d.id) UI.open.delete('feat:' + d.k + ':' + d.id); render(); },
  spell(d) {
    const c = C(), list = c.spells[d.k], i = list.indexOf(d.id);
    if (i >= 0) list.splice(i, 1); else list.push(d.id);
    c.spells._trad = D.trad;
    render();
  },
  invTab(d) { UI.invTab = d.id; L('items').lim = 40; L('items').q = ''; render(); },
  addItem(d) { addItem(d.id); render(); },
  qty(d) {
    const c = C(), x = c.inv[+d.i];
    if (!x) return;
    x.q += +d.d * (ITEM[x.id].per || 1);
    if (x.q <= 0) {
      c.inv.splice(+d.i, 1);
      if (c.worn === x.id) c.worn = null;
      if (c.sh === x.id) c.sh = null;
    }
    render();
  },
  wear(d) { const c = C(); c.worn = c.worn === d.id ? null : d.id; render(); },
  wield(d) { const c = C(); c.sh = c.sh === d.id ? null : d.id; render(); },
  trait(d, el) {
    const r = el.getBoundingClientRect(), def = traitDef(d.t), name = d.t.replace(/-/g, ' ');
    const left = Math.max(8, Math.min(scrollX + r.left, scrollX + document.documentElement.clientWidth - 316));
    $('#popwrap').innerHTML = `<div class="pop" style="left:${left}px;top:${scrollY + r.bottom + 6}px"><b>${esc(name)}</b>${def ? esc(def) : '<span class="muted">No summary here yet.</span>'}<br>${aonA(d.t.replace(/-(d\d+|\d+|[bps])$/, '') + ' trait', 'Trait on Archives of Nethys')}</div>`;
    UI.pop = d.t;
  },
  rmPortrait() { C().portrait = ''; UI.imgMsg = ''; render(); },
  addFam() { const c = C(); if (c.comps.length < 4) c.comps.push({ id: newId(), kind: 'familiar', name: '', portrait: '', abil: [], per: 2, swim: false }); render(); },
  addPet(d) {
    const c = C();
    if (c.comps.length >= 4 || !COMP_TYPE[d.id]) return;
    c.comps.push({ id: newId(), kind: 'animal', type: d.id, name: '', portrait: '' });
    UI.showList.comp = false; UI.open.delete('ct:' + d.id);
    render();
  },
  addCustom() {
    const c = C();
    if (c.comps.length >= 4) return;
    c.comps.push({ id: newId(), kind: 'custom', name: '', portrait: '', label: '', size: 'Small', hp: 10, ac: 15, perc: 0, fort: 0, ref: 0, will: 0, speed: '25 ft', senses: '', skills: [], atk: [{ n: '', b: 0, d: '1d6', m: 0, t: '', tr: '' }], notes: '' });
    UI.editComp = c.comps.length - 1;
    render();
  },
  rmComp(d) { confirmTwice('confirmComp', +d.i, () => { UI.editComp = null; C().comps.splice(+d.i, 1); render(); }); },
  customize(d) {
    const c = C(), i = +d.i, cp = c.comps[i], S = compStats(cp);
    if (!S) return;
    const types = { B: 'bludgeoning', P: 'piercing', S: 'slashing' };
    c.comps[i] = { id: cp.id, kind: 'custom', name: cp.name, portrait: cp.portrait,
      label: compKind(cp, S).replace(/ companion$/, ''), size: C_SIZES.includes(S.size) ? S.size : S.size === 'Medium or Large' ? 'Medium' : 'Small',
      hp: S.hp, ac: S.ac, perc: S.perc, fort: S.saves.fort, ref: S.saves.ref, will: S.saves.will, speed: S.speed, senses: S.senses,
      skills: S.skills.map(s => ({ n: s.n, v: s.v })),
      atk: S.strikes.map(s => ({ n: s.n, b: s.atk, d: s.die, m: s.dm, t: types[s.dt] || s.dt, tr: s.tr.join(', ') })),
      notes: cp.kind === 'animal' ? 'Support benefit: ' + S.T.support : 'Familiar abilities: ' + cp.abil.map(id => FAM_ABIL[id].n).join(', ') };
    UI.editComp = i;
    render();
  },
  editComp(d) { UI.editComp = UI.editComp === +d.i ? null : +d.i; render(); },
  addCRow(d) {
    const cp = C().comps[+d.i];
    if (d.l === 'skills' && cp.skills.length < 12) cp.skills.push({ n: '', v: 0 });
    if (d.l === 'atk' && cp.atk.length < 6) cp.atk.push({ n: '', b: 0, d: '1d6', m: 0, t: '', tr: '' });
    render();
  },
  rmCRow(d) { C().comps[+d.i][d.l].splice(+d.j, 1); render(); },
  famSwim(d) { C().comps[+d.i].swim = d.v === '1'; render(); },
  famPer(d) { const cp = C().comps[+d.i]; cp.per = Math.min(6, Math.max(1, cp.per + +d.d)); cp.abil = cp.abil.slice(0, cp.per); render(); },
  famAbil(d) { const cp = C().comps[+d.i]; toggleIn(cp.abil, d.id, cp.per); render(); },
  sheetTab(d) { UI.sheetTab = d.id; render(); },
  hp(d) {
    const c = C(), P = c.play, input = $('#hp-amt');
    const n = Math.min(999, Math.max(0, parseInt(input.value, 10) || 0));
    if (!n || D.hp == null) { input.focus(); return; }
    const max = maxHP(c);
    let cur = P.hp == null ? max : Math.min(max, P.hp);
    if (d.k === 'dmg') {
      const fromTemp = Math.min(P.temp, n);
      P.temp -= fromTemp;
      cur = Math.max(0, cur - (n - fromTemp));
    } else cur = Math.min(max, cur + n);
    P.hp = cur >= max ? null : cur;
    UI.restMsg = d.k === 'dmg' && cur === 0 ? 'You’re at 0 Hit Points. Add the dying condition if you were knocked out.' : '';
    render();
  },
  tempHP(d) { const P = C().play; P.temp = Math.max(0, Math.min(999, P.temp + +d.d)); render(); },
  hero(d) { const P = C().play; P.hero = P.hero === +d.n ? +d.n - 1 : +d.n; render(); },
  raise() { const P = C().play; P.raised = !P.raised; render(); },
  panache() { const P = C().play; P.panache = !P.panache; render(); },
  finisher() { const P = C().play; if (P.panache) { P.panache = false; render(); } },
  condMenu() { UI.condOpen = !UI.condOpen; render(); },
  condAdd(d) { const cd = CONDITIONS.find(x => x.id === d.id); C().play.conds[d.id] = cd.v ? 1 : true; UI.condOpen = false; render(); },
  condStep(d) {
    const conds = C().play.conds, v = (conds[d.id] || 0) + +d.d;
    if (v <= 0) delete conds[d.id]; else conds[d.id] = Math.min(9, v);
    render();
  },
  condRm(d) { delete C().play.conds[d.id]; render(); },
  rest() {
    const c = C(), P = c.play, conds = P.conds;
    if (D.hp == null) return;
    const before = P.hp == null ? maxHP(c) : Math.min(maxHP(c), P.hp);
    delete conds.fatigued;
    for (const k of ['drained', 'doomed']) if (conds[k] && --conds[k] <= 0) delete conds[k];
    const after = Math.min(maxHP(c), before + Math.max(1, D.mods.con) * LEVEL);
    P.hp = after >= maxHP(c) ? null : after;
    P.raised = false;
    UI.restMsg = `You rest for the night: regained ${Math.max(0, after - before)} HP, and fatigued, drained and doomed eased.`;
    render();
  },
  newChar() {
    const id = newId();
    store.chars[id] = blankChar();
    store.current = id; store.step = 'ancestry';
    UI.prev = {}; UI.showList = {}; UI.open.clear();
    render();
    setTimeout(() => { const f = $('#f-name'); if (f) f.focus(); }, 50);
  },
  delChar() {
    confirmTwice('confirmDelete', true, () => {
      if (C().updatedAt) store.deleted[store.current] = Date.now();
      delete store.chars[store.current];
      delete SNAP[store.current];
      if (window.WaymarkSync) WaymarkSync.schedule();
      fixCurrent(store);
      store.step = 'ancestry'; UI.prev = {};
      render();
    });
  },
  openSide() { $('#side').classList.add('open'); $('#scrim').classList.add('open'); },
  closeSide() { closeSide(); }
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (UI.pop && !e.target.closest('.pop') && !(el && el.dataset.act === 'trait')) closePop();
  if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
  if (actions[el.dataset.act]) actions[el.dataset.act](el.dataset, el);
});
document.addEventListener('click', e => {
  const b = e.target.closest('[data-crop]');
  if (b) { if (b.dataset.crop === 'save') saveCrop(); else closeCropper(); }
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="switch"]')) { e.preventDefault(); e.target.click(); }
  if (e.key === 'Escape') { closeSide(); closePop(); if (crop) closeCropper(); }
});

const NUM_FIELDS = ['hp', 'ac', 'perc', 'fort', 'ref', 'will', 'v', 'b', 'm'];
const MAX_LEN = { label: 40, speed: 80, senses: 120, notes: 2000, n: 30, d: 5, t: 20, tr: 80 };
document.addEventListener('input', e => {
  const t = e.target, ds = t.dataset;
  if (ds.list) { const st = L(ds.list); st.q = t.value; st.lim = 40; rerenderList(ds.list); return; }
  if (t.matches('[data-sksearch]')) {
    const q = t.value.trim().toLowerCase();
    document.querySelectorAll('.sk-row').forEach(r => r.hidden = q && !r.dataset.sk.includes(q));
    return;
  }
  if (ds.cf || ds.cs || ds.ca) {
    const parts = (ds.cf || ds.cs || ds.ca).split('|');
    const cp = C().comps[+parts[0]];
    const field = parts[parts.length - 1];
    let v = t.value;
    if (NUM_FIELDS.includes(field)) v = Math.max(-99, Math.min(9999, parseInt(v, 10) || 0));
    else if (MAX_LEN[field]) v = v.slice(0, MAX_LEN[field]);
    if (ds.cf) cp[field] = v;
    else (ds.cs ? cp.skills : cp.atk)[+parts[1]][field] = v;
    renderLight();
    return;
  }
  if (ds.cin != null) { C().comps[+ds.cin].name = t.value.slice(0, 60); renderLight(); return; }
  if (ds.in) { C()[ds.in] = t.value; renderLight(); }
});
document.addEventListener('change', async e => {
  const t = e.target.dataset.portrait;
  if (t == null) return;
  const file = e.target.files[0];
  e.target.value = '';
  try { openCropper(t, await loadImage(file)); UI.imgMsg = ''; }
  catch (err) { UI.imgMsg = err.message; render(); }
});
window.addEventListener('resize', closePop);
$('#roster').addEventListener('change', e => {
  store.current = e.target.value; store.step = 'ancestry';
  UI.prev = {}; UI.showList = {};
  render();
});

window.Waymark = {
  guestKey: GUEST_KEY,
  storeKey: () => storeKey,
  store: () => store,
  newId,
  sanitize: cleanChar,
  isPristine,
  readStore: key => load(key),
  writeStore(key, st) { try { localStorage.setItem(key, JSON.stringify(st)); } catch (e) {} },
  removeStore(key) { try { localStorage.removeItem(key); } catch (e) {} },
  switchStore(key) {
    storeKey = key;
    store = load(key);
    resetSnap();
    UI.prev = {}; UI.showList = {}; UI.open.clear(); UI.lastStep = null; UI.confirmDelete = false;
    render();
  },
  saveQuiet: saveStore,
  afterRemoteChange() {
    const ids = Object.keys(store.chars);
    if (ids.some(id => !isPristine(store.chars[id]))) ids.forEach(id => { if (isPristine(store.chars[id])) delete store.chars[id]; });
    fixCurrent(store);
    resetSnap();
    const a = document.activeElement;
    if (a && a.matches && a.matches('[data-in]')) renderLight(); else render();
  }
};

resetSnap();
render();
