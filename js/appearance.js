(function () {
  const KEY = 'waymark-pf2-appearance', IMGKEY = 'waymark-pf2-bgimg', DEFAULT_IMG = 'background.png';
  const root = document.documentElement;
  const A = { theme: 'auto', bg: 'repo', blur: 28, glass: 74 };
  let custom = null, hasDefault = null, open = false, hint = '', hintBad = false;

  try { Object.assign(A, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  try { custom = localStorage.getItem(IMGKEY); } catch (e) {}
  if (custom && !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(custom)) custom = null;
  if (A.bg !== 'custom' || !custom) A.bg = 'repo';

  const test = new Image();
  test.onload = () => { hasDefault = true; apply(); draw(); };
  test.onerror = () => { hasDefault = false; apply(); draw(); };
  test.src = DEFAULT_IMG;

  function isDark() { return A.theme === 'dark' || (A.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches); }

  function apply() {
    if (A.theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', A.theme);
    let url = null;
    if (A.bg === 'custom' && custom) url = custom;
    if (A.bg === 'repo' && hasDefault) url = DEFAULT_IMG;
    root.classList.toggle('has-img', !!url);
    const img = document.querySelector('.backdrop .bd-img');
    if (img) img.style.backgroundImage = url ? `url("${url}")` : 'none';
    root.style.setProperty('--bd-blur', A.blur + 'px');
    root.style.setProperty('--glass-col', A.glass + '%');
    root.style.setProperty('--glass-in', Math.round(A.glass * 0.62) + '%');
    root.style.setProperty('--bd-tint', isDark() ? '45%' : '30%');
  }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(A)); } catch (e) {} }

  function btn(k, v, label) { return `<button class="${A[k] === v ? 'sel' : ''}" data-ap="${k}" data-v="${v}">${label}</button>`; }

  function panel() {
    const upBtn = text => `<label class="sw up" tabindex="0"><input type="file" accept="image/*" data-ap-file hidden>${text}</label>`;
    let swatches = hasDefault === false
      ? '<div class="sw missing">No background.png found in the site folder</div>'
      : `<button class="sw ${A.bg === 'repo' ? 'sel' : ''}" data-ap="bg" data-v="repo" style="background-image:url('${DEFAULT_IMG}')">Default</button>`;
    swatches += custom
      ? `<button class="sw ${A.bg === 'custom' ? 'sel' : ''}" data-ap="bg" data-v="custom" style="background-image:url('${custom}')">Your image</button>`
      : upBtn('Upload image');
    return `<div class="appear" role="dialog" aria-label="Appearance">
      <h3>Appearance</h3>
      <div class="grp"><div class="lab">Theme</div><div class="seg">${btn('theme', 'auto', 'Match device')}${btn('theme', 'light', 'Light')}${btn('theme', 'dark', 'Dark')}</div></div>
      <div class="grp"><div class="lab">Background</div><div class="swatches">${swatches}</div>
        ${custom ? `<p class="hint"><label class="btn ghost sm linkish" tabindex="0"><input type="file" accept="image/*" data-ap-file hidden>Upload a different image</label><button class="btn ghost sm linkish" data-ap="clearimg">Remove it</button></p>` : ''}
        ${hint ? `<p class="hint ${hintBad ? 'bad' : ''}">${hint}</p>` : ''}</div>
      <div class="grp"><label>Background blur <span id="ap-blur-v">${A.blur}px</span></label><input type="range" min="0" max="60" value="${A.blur}" data-ap-range="blur"></div>
      <div class="grp"><label>Panel opacity <span id="ap-glass-v">${A.glass}%</span></label><input type="range" min="35" max="98" value="${A.glass}" data-ap-range="glass">
        <p class="hint">Lower values let more of the background show through.</p></div>
      <div class="ap-foot"><button class="btn primary sm" data-ap="close">Done</button></div>
    </div>`;
  }

  function draw() { const w = document.getElementById('appearwrap'); if (w) w.innerHTML = open ? panel() : ''; }

  function shrink(im, max, q) {
    const s = Math.min(1, max / Math.max(im.width, im.height));
    const c = document.createElement('canvas');
    c.width = Math.round(im.width * s);
    c.height = Math.round(im.height * s);
    c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', q);
  }

  function upload(file) {
    if (!file || !file.type.startsWith('image/')) { hint = 'Choose an image file, like a JPG or PNG.'; hintBad = true; draw(); return; }
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => {
      URL.revokeObjectURL(url);
      let saved = false;
      for (const [max, q] of [[1600, 0.82], [1200, 0.75], [900, 0.7]]) {
        custom = shrink(im, max, q);
        try { localStorage.setItem(IMGKEY, custom); saved = true; break; } catch (e) {}
      }
      A.bg = 'custom';
      hint = saved ? 'Saved in this browser.' : 'Too big to keep after reloading, so it only shows for this visit.';
      hintBad = !saved;
      save(); apply(); draw();
    };
    im.onerror = () => { URL.revokeObjectURL(url); hint = 'That image couldn’t be read. Try a JPG or PNG.'; hintBad = true; draw(); };
    im.src = url;
  }

  document.addEventListener('click', e => {
    if (e.target.closest('[data-ap-open]')) { open = !open; draw(); return; }
    if (open && !e.target.closest('.appear')) { open = false; draw(); return; }
    const b = e.target.closest('[data-ap]');
    if (!b) return;
    const k = b.dataset.ap;
    if (k === 'close') { open = false; draw(); return; }
    if (k === 'theme') A.theme = b.dataset.v;
    if (k === 'bg') { A.bg = b.dataset.v; hint = ''; }
    if (k === 'clearimg') {
      custom = null; A.bg = 'repo'; hint = '';
      try { localStorage.removeItem(IMGKEY); } catch (e) {}
    }
    save(); apply(); draw();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) { open = false; draw(); }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('label[tabindex]') && e.target.querySelector('[data-ap-file]')) {
      e.preventDefault();
      e.target.querySelector('input').click();
    }
  });

  document.addEventListener('change', e => { if (e.target.matches('[data-ap-file]')) upload(e.target.files[0]); });

  document.addEventListener('input', e => {
    const k = e.target.dataset.apRange;
    if (!k) return;
    A[k] = +e.target.value;
    apply(); save();
    document.getElementById('ap-' + k + '-v').textContent = A[k] + (k === 'blur' ? 'px' : '%');
  });

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', apply);
  apply();
})();
