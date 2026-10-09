(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const sg = n => (n >= 0 ? '+' : '−') + Math.abs(n);
  const TYPES = { B: 'bludgeoning', P: 'piercing', S: 'slashing' };
  const DEGREES = ['Critical failure', 'Failure', 'Success', 'Critical success'];
  const log = [];
  const quick = { n: 1, die: 20, mod: 0 };
  let open = false, dc = '', toastTimer;

  function die(sides) {
    const max = Math.floor(0x100000000 / sides) * sides, buf = new Uint32Array(1);
    do crypto.getRandomValues(buf); while (buf[0] >= max);
    return buf[0] % sides + 1;
  }
  function rollMany(n, s) { const out = []; for (let i = 0; i < n; i++) out.push(die(s)); return out; }
  function sum(a) { return a.reduce((t, x) => t + x, 0); }

  function degree(total, nat) {
    if (dc === '') return null;
    const target = +dc;
    let d = total >= target + 10 ? 3 : total >= target ? 2 : total <= target - 10 ? 0 : 1;
    if (nat === 20) d = Math.min(3, d + 1);
    if (nat === 1) d = Math.max(0, d - 1);
    return d;
  }

  function check(label, mod) {
    const nat = die(20), total = nat + mod;
    add({ kind: 'check', label, total, nat, detail: `d20 (${nat}) ${sg(mod)}`, deg: degree(total, nat) });
  }

  function damage(label, dice, mod, type, traits, crit, extra) {
    const m = /^(\d+)d(\d+)$/.exec(dice || '');
    if (!m) return;
    let n = +m[1], s = +m[2];
    const find = re => { for (const t of traits) { const x = re.exec(t); if (x) return +x[1]; } return 0; };
    const fatal = crit ? find(/^fatal-d(\d+)$/) : 0;
    const deadly = crit ? find(/^deadly-d(\d+)$/) : 0;
    if (fatal) s = fatal;
    const rolls = rollMany(n, s);
    let total = sum(rolls) + mod;
    let detail = `${n}d${s} (${rolls.join(', ')})` + (mod ? ' ' + sg(mod) : '');
    const x = /^(\d+)d(\d+)$/.exec(extra || '');
    if (x) {
      const xr = rollMany(+x[1], +x[2]);
      total += sum(xr);
      detail += ` + ${x[1]}d${x[2]} (${xr.join(', ')}) precision`;
    }
    if (crit) {
      total *= 2;
      detail = `(${detail}) ×2`;
      if (fatal) { const r = die(fatal); total += r; detail += ` + d${fatal} (${r}) fatal`; }
      if (deadly) { const r = die(deadly); total += r; detail += ` + d${deadly} (${r}) deadly`; }
    }
    total = Math.max(crit ? 2 : 1, total);
    add({ kind: 'damage', label: label + (crit ? ' critical' : ''), total, detail, type: TYPES[type] || type || '' });
  }

  function freeRoll() {
    const rolls = rollMany(quick.n, quick.die), total = sum(rolls) + quick.mod;
    const nat = quick.n === 1 && quick.die === 20 ? rolls[0] : null;
    add({ kind: nat ? 'check' : 'free', label: `${quick.n}d${quick.die}` + (quick.mod ? ' ' + sg(quick.mod) : ''), total, nat,
      detail: rolls.join(', ') + (quick.mod ? ' ' + sg(quick.mod) : ''), deg: nat ? degree(total, nat) : null });
  }

  function add(r) {
    if (r.deg != null) r.target = +dc;
    log.unshift(r);
    if (log.length > 50) log.pop();
    if (open) drawTray(); else showToast(r);
  }

  function rollHTML(r, big) {
    let tags = '';
    if (r.nat === 20) tags += '<span class="nat hi">Natural 20</span>';
    if (r.nat === 1) tags += '<span class="nat lo">Natural 1</span>';
    if (r.deg != null) tags += `<span class="deg d${r.deg}">${DEGREES[r.deg]} vs DC ${r.target}</span>`;
    return `<div class="roll ${big ? 'big' : ''} ${r.kind}">
      <div class="rl"><b>${esc(r.label)}</b><span class="rd num">${esc(r.detail)}${r.type ? ' ' + esc(r.type) : ''}</span>${tags ? `<span class="rt">${tags}</span>` : ''}</div>
      <div class="rv num ${r.nat === 20 ? 'hi' : r.nat === 1 ? 'lo' : ''}">${r.total}</div></div>`;
  }

  function showToast(r) {
    const t = document.getElementById('dice-toast');
    t.innerHTML = rollHTML(r, true);
    t.classList.remove('show');
    void t.offsetWidth;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 4500);
  }

  function rollLabel() { return `Roll ${quick.n}d${quick.die}` + (quick.mod ? ' ' + sg(quick.mod) : ''); }

  function drawTray() {
    const tray = document.getElementById('dice-tray');
    tray.hidden = !open;
    if (!open) return;
    tray.innerHTML = `<div class="dt-head"><h3>Dice</h3><button class="icon-btn" data-dice="close" aria-label="Close dice">✕</button></div>
      <div class="dt-quick">
        <div class="dt-dies">${[4, 6, 8, 10, 12, 20, 100].map(d => `<button class="chip ${quick.die === d ? 'sel' : ''}" data-dice="die" data-v="${d}">d${d}</button>`).join('')}</div>
        <div class="dt-row">
          <label>Dice <input class="input" type="number" min="1" max="20" value="${quick.n}" data-dq="n"></label>
          <label>Bonus <input class="input" type="number" min="-50" max="50" value="${quick.mod}" data-dq="mod"></label>
          <label>Target DC <input class="input" type="number" min="0" max="60" value="${esc(dc)}" placeholder="Optional" data-dq="dc"></label>
        </div>
        <button class="btn primary" data-dice="roll">${rollLabel()}</button>
      </div>
      <p class="dt-hint">Tap any bonus on the sheet to roll it. With a target DC set, checks show their degree of success.</p>
      <div class="dt-log">${log.length ? log.map(r => rollHTML(r)).join('') : '<p class="dt-hint">No rolls yet.</p>'}</div>
      ${log.length ? '<button class="btn ghost sm" data-dice="clear">Clear history</button>' : ''}`;
  }

  document.addEventListener('click', e => {
    const r = e.target.closest('[data-roll]');
    if (r) {
      e.preventDefault();
      const label = r.dataset.l || 'Roll', mod = parseInt(r.dataset.m, 10) || 0;
      if (r.dataset.roll === 'check') check(label, mod);
      else damage(label, r.dataset.d, mod, r.dataset.t, (r.dataset.tr || '').split(',').filter(Boolean), r.dataset.crit === '1', r.dataset.x);
      return;
    }
    if (e.target.closest('#dice-toast')) { open = true; drawTray(); return; }
    const b = e.target.closest('[data-dice]');
    if (b) {
      const a = b.dataset.dice;
      if (a === 'open') open = !open;
      if (a === 'close') open = false;
      if (a === 'die') quick.die = +b.dataset.v;
      if (a === 'clear') log.length = 0;
      if (a === 'roll') freeRoll(); else drawTray();
      return;
    }
    if (open && !e.target.closest('#dice-tray')) { open = false; drawTray(); }
  });

  document.addEventListener('input', e => {
    const k = e.target.dataset.dq;
    if (!k) return;
    const v = parseInt(e.target.value, 10);
    if (k === 'dc') dc = e.target.value.replace(/\D/g, '').slice(0, 2);
    if (k === 'n') quick.n = Math.min(20, Math.max(1, v || 1));
    if (k === 'mod') quick.mod = Math.min(50, Math.max(-50, v || 0));
    const btn = document.querySelector('[data-dice="roll"]');
    if (btn) btn.textContent = rollLabel();
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) { open = false; drawTray(); } });

  document.getElementById('dicewrap').innerHTML = `<div id="dice-toast" class="dice-toast"></div>
    <div id="dice-tray" class="dice-tray" hidden></div>
    <button class="dice-fab" data-dice="open" aria-label="Dice" title="Dice">
      <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 2.5l8.5 5v9L12 21.5l-8.5-5v-9z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 2.5v6m0 0l8.5-1M12 8.5l-8.5-1M12 8.5l-5 8.5h10z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
    </button>`;
})();
