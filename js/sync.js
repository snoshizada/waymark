(function () {
  const W = window.Waymark;
  const cfg = window.WAYMARK_CONFIG || {};
  const hasConfig = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(cfg.supabaseUrl || '') && (cfg.supabaseAnonKey || '').length > 20;
  const hasLib = !!(window.supabase && window.supabase.createClient);
  const enabled = !!(W && hasConfig && hasLib);
  const ACCT = 'waymark-pf2-acct-', DECLINED = 'waymark-pf2-declined-';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const $ = s => document.querySelector(s);

  let sb = null, user = null, open = false, busy = false;
  let view = 'email', email = '', msg = '', msgBad = false;
  let status = 'idle', lastSync = 0, lastErr = '', syncing = false, again = false, timer = null;
  let mergeCount = 0, askDelete = false, cloudCount = null, pruned = false;

  function niceError(err) {
    const m = String((err && (err.message || err.error_description)) || err || '');
    if (/rate|too many|security purposes/i.test(m)) return 'Too many attempts. Wait a minute, then try again.';
    if (/expired|invalid.*(otp|token)|token.*(invalid|expired)/i.test(m)) return 'That code is wrong or has expired. Request a new one.';
    if (/failed to fetch|network/i.test(m)) return 'Can’t reach the server. Check your connection.';
    if (/not allowed/i.test(m)) return 'New sign-ups are turned off for this site.';
    return m ? m.slice(0, 160) : 'Something went wrong. Please try again.';
  }

  function ago(t) {
    const s = Math.round((Date.now() - t) / 1000);
    if (s < 10) return 'just now';
    if (s < 60) return s + ' seconds ago';
    const m = Math.round(s / 60);
    if (m < 60) return m + (m > 1 ? ' minutes ago' : ' minute ago');
    const h = Math.round(m / 60);
    return h + (h > 1 ? ' hours ago' : ' hour ago');
  }

  function statusText() {
    if (status === 'ok') return 'Synced ' + ago(lastSync);
    if (status === 'syncing') return 'Syncing…';
    if (status === 'pending') return 'Changes waiting to sync';
    if (status === 'offline') return 'Offline. Changes will sync when you reconnect.';
    if (status === 'error') return 'Couldn’t sync. ' + lastErr;
    return 'Not synced yet';
  }

  function setStatus(s, err) { status = s; lastErr = err || ''; drawButton(); if (open) draw(); }
  function say(text, bad) { msg = text; msgBad = !!bad; draw(); }

  function row(id, ch) { return { user_id: user.id, id, data: ch, deleted: false, updated_at: new Date(ch.updatedAt).toISOString() }; }

  async function syncNow() {
    if (!enabled || !user) return;
    if (syncing) { again = true; return; }
    if (!navigator.onLine) { setStatus('offline'); return; }
    syncing = true;
    clearTimeout(timer);
    setStatus('syncing');
    const key = W.storeKey(), uid = user.id;
    try {
      const res = await sb.from('characters').select('id,data,deleted,updated_at');
      if (res.error) throw res.error;
      if (!user || user.id !== uid || W.storeKey() !== key) return;
      const st = W.store();
      st.deleted = st.deleted || {};
      const seen = {}, push = [];
      let changed = false;

      for (const r of res.data || []) {
        if (typeof r.id !== 'string') continue;
        seen[r.id] = r;
        const time = Date.parse(r.updated_at) || 0;
        const mine = st.chars[r.id], gone = st.deleted[r.id];
        if (r.deleted) {
          if (mine && (mine.updatedAt || 0) <= time) { delete st.chars[r.id]; changed = true; }
          else if (mine) push.push(row(r.id, mine));
          delete st.deleted[r.id];
        } else if (gone) {
          if (gone >= time) push.push({ user_id: user.id, id: r.id, data: {}, deleted: true, updated_at: new Date(gone).toISOString() });
          else { st.chars[r.id] = W.sanitize(r.data); st.chars[r.id].updatedAt = time; changed = true; }
          delete st.deleted[r.id];
        } else if (!mine || (mine.updatedAt || 0) < time) {
          st.chars[r.id] = W.sanitize(r.data);
          st.chars[r.id].updatedAt = time;
          changed = true;
        } else if (mine.updatedAt > time) {
          push.push(row(r.id, mine));
        }
      }
      for (const id in st.chars) if (!seen[id] && st.chars[id].updatedAt) push.push(row(id, st.chars[id]));
      for (const id in st.deleted) if (!seen[id]) delete st.deleted[id];

      if (push.length) {
        const up = await sb.from('characters').upsert(push, { onConflict: 'user_id,id' });
        if (up.error) throw up.error;
        push.forEach(p => { if (p.deleted) delete st.deleted[p.id]; });
      }
      cloudCount = Object.values(seen).filter(r => !r.deleted).length + push.filter(p => !p.deleted && !seen[p.id]).length;
      if (changed) W.afterRemoteChange(); else W.saveQuiet();
      lastSync = Date.now();
      setStatus('ok');
      if (!pruned) {
        pruned = true;
        const old = new Date(Date.now() - 30 * 864e5).toISOString();
        sb.from('characters').delete().eq('deleted', true).lt('updated_at', old).then(() => {}, () => {});
      }
    } catch (e) {
      setStatus(navigator.onLine ? 'error' : 'offline', niceError(e));
    } finally {
      syncing = false;
      if (again) { again = false; schedule(300); }
    }
  }

  function schedule(delay) {
    if (!enabled || !user) return;
    if (status !== 'syncing') setStatus('pending');
    clearTimeout(timer);
    timer = setTimeout(syncNow, delay ?? 1500);
  }

  function declinedIds() { try { return JSON.parse(localStorage.getItem(DECLINED + user.id)) || []; } catch (e) { return []; } }

  function guestChars() {
    const no = declinedIds();
    return Object.entries(W.readStore(W.guestKey).chars).filter(([id, ch]) => !W.isPristine(ch) && !no.includes(id));
  }

  function signedIn(u) {
    user = u; view = 'account'; msg = ''; askDelete = false;
    email = u.email || email;
    if (W.storeKey() !== ACCT + u.id) W.switchStore(ACCT + u.id);
    mergeCount = guestChars().length;
    if (mergeCount) open = true;
    drawButton(); draw();
    syncNow();
  }

  function leaveAccount(id) {
    user = null;
    W.removeStore(ACCT + id);
    W.switchStore(W.guestKey);
    view = 'email'; cloudCount = null; lastSync = 0; askDelete = false;
    setStatus('idle');
  }

  function mergeGuest() {
    const guest = W.readStore(W.guestKey), st = W.store();
    for (const [id, ch] of guestChars()) {
      const copy = W.sanitize(ch);
      copy.updatedAt = Date.now();
      st.chars[st.chars[id] ? W.newId() : id] = copy;
      delete guest.chars[id];
    }
    W.writeStore(W.guestKey, { current: null, chars: guest.chars, step: 'ancestry', deleted: {} });
    mergeCount = 0;
    msg = 'Characters moved into your account.'; msgBad = false;
    W.afterRemoteChange();
    syncNow();
  }

  function keepGuest() {
    const ids = guestChars().map(x => x[0]).concat(declinedIds()).slice(0, 500);
    try { localStorage.setItem(DECLINED + user.id, JSON.stringify(ids)); } catch (e) {}
    mergeCount = 0;
    draw();
  }

  async function signOut(everywhere) {
    if (!user) return;
    busy = true; draw();
    await syncNow();
    const unsynced = status !== 'ok';
    const id = user.id;
    user = null;
    try { await sb.auth.signOut({ scope: everywhere ? 'global' : 'local' }); } catch (e) {}
    leaveAccount(id);
    busy = false;
    if (unsynced) say('Signed out. Some recent changes may not have reached the cloud.', true);
    else say(everywhere ? 'Signed out on every device.' : 'Signed out. Your characters were removed from this device.');
  }

  async function deleteAccount() {
    const box = $('#acct-del');
    if (!box || box.value.trim() !== 'DELETE') { say('Type DELETE to confirm.', true); return; }
    busy = true; draw();
    const res = await sb.rpc('delete_my_account');
    busy = false;
    if (res.error) { say(niceError(res.error), true); return; }
    const id = user.id;
    try { localStorage.removeItem(DECLINED + id); } catch (e) {}
    user = null;
    try { await sb.auth.signOut({ scope: 'local' }); } catch (e) {}
    leaveAccount(id);
    say('Your account and all of its characters were permanently deleted.');
  }

  async function sendCode(addr) {
    addr = addr.trim().toLowerCase();
    if (addr.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) { say('Enter a valid email address.', true); return; }
    busy = true; msg = ''; draw();
    const res = await sb.auth.signInWithOtp({ email: addr, options: { shouldCreateUser: true } });
    busy = false;
    if (res.error) { say(niceError(res.error), true); return; }
    email = addr; view = 'code'; msg = '';
    draw();
    $('#acct-code')?.focus();
  }

  async function checkCode(code) {
    code = code.replace(/\s+/g, '');
    if (!/^\d{6,10}$/.test(code)) { say('Enter the code from the email.', true); return; }
    busy = true; msg = ''; draw();
    const res = await sb.auth.verifyOtp({ email, token: code, type: 'email' });
    busy = false;
    if (res.error) { say(niceError(res.error), true); return; }
    if (res.data && res.data.user) signedIn(res.data.user);
  }

  function drawButton() {
    const b = $('[data-acct-open]');
    if (!b) return;
    const dot = b.querySelector('.acct-dot');
    dot.hidden = !user;
    dot.className = 'acct-dot ' + status;
    b.title = user ? 'Signed in. ' + statusText() : 'Account and sync';
    b.setAttribute('aria-label', b.title);
  }

  function panel() {
    const dis = busy ? 'disabled' : '';
    const note = msg ? `<p class="msg ${msgBad ? 'bad' : ''}" role="status">${esc(msg)}</p>` : '';
    let h = '<div class="appear acct" role="dialog" aria-label="Account and sync"><h3>Account</h3>';
    if (!enabled) {
      h += hasConfig && !hasLib
        ? '<p>The sign-in library didn’t load, so accounts are unavailable right now.</p>'
        : '<p>Accounts aren’t set up on this copy of Waymark yet, so your characters are saved in this browser only.</p>';
    } else if (!user && view === 'email') {
      h += `<p>Sign in to back up your characters and open them on any device. You’ll get a one-time code by email, so there’s no password.</p>
        <form data-acct-form="email" novalidate><label for="acct-email" class="lab">Email</label>
        <input id="acct-email" class="input" type="email" autocomplete="email" maxlength="254" value="${esc(email)}">
        <button class="btn primary" ${dis}>${busy ? 'Sending…' : 'Email me a code'}</button></form>${note}`;
    } else if (!user) {
      h += `<p>Enter the code sent to <b>${esc(email)}</b>. It expires soon, so use it right away.</p>
        <form data-acct-form="code" novalidate><label for="acct-code" class="lab">Code</label>
        <input id="acct-code" class="input code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="10">
        <button class="btn primary" ${dis}>${busy ? 'Checking…' : 'Sign in'}</button></form>
        <div class="row"><button class="btn ghost sm" data-acct="resend" ${dis}>Send a new code</button><button class="btn ghost sm" data-acct="change">Use a different email</button></div>${note}`;
    } else {
      const s = mergeCount > 1 ? 's' : '';
      h += `<p>Signed in as <b>${esc(user.email || '')}</b></p>
        <div class="status ${status}"><span class="sdot"></span><span>${esc(statusText())}</span></div>`;
      if (mergeCount) h += `<div class="offer"><p>This device has ${mergeCount} character${s} saved before you signed in. Add ${s ? 'them' : 'it'} to your account?</p>
        <div class="row"><button class="btn primary sm" data-acct="merge">Add to my account</button><button class="btn ghost sm" data-acct="keep">Keep on this device only</button></div></div>`;
      if (cloudCount != null) h += `<p class="small">${cloudCount} character${cloudCount === 1 ? '' : 's'} in your account.</p>`;
      h += `<div class="row"><button class="btn line sm" data-acct="sync" ${status === 'syncing' ? 'disabled' : ''}>Sync now</button>
        <button class="btn line sm" data-acct="signout" ${dis}>Sign out</button>
        <button class="btn ghost sm" data-acct="signout-all" ${dis}>Sign out everywhere</button></div>${note}<div class="danger">`;
      h += askDelete
        ? `<p>This permanently deletes your account and every character in it, on all devices. It can’t be undone. Type <b>DELETE</b> to confirm.</p>
          <input id="acct-del" class="input" autocomplete="off" spellcheck="false" aria-label="Type DELETE to confirm">
          <div class="row"><button class="btn danger sm" data-acct="delete" ${dis}>Delete my account</button><button class="btn ghost sm" data-acct="cancel-del">Cancel</button></div>`
        : '<button class="btn ghost sm bad" data-acct="ask-del">Delete account and all characters</button>';
      h += '</div>';
    }
    return h + '<div class="row end"><button class="btn primary sm" data-acct="close">Done</button></div></div>';
  }

  function draw() {
    const w = $('#accountwrap');
    if (!w) return;
    const f = document.activeElement, id = f && f.id, val = f && f.value;
    w.innerHTML = open ? panel() : '';
    const el = id && document.getElementById(id);
    if (el) { if (val != null) el.value = val; el.focus(); }
  }

  document.addEventListener('click', e => {
    if (e.target.closest('[data-acct-open]')) {
      open = !open;
      if (open && user && status !== 'syncing') syncNow();
      draw();
      return;
    }
    if (open && !e.target.closest('.acct')) { open = false; draw(); return; }
    const b = e.target.closest('[data-acct]');
    if (!b || b.disabled) return;
    const a = b.dataset.acct;
    if (a === 'close') { open = false; msg = ''; draw(); }
    if (a === 'change') { view = 'email'; msg = ''; draw(); }
    if (a === 'resend') sendCode(email);
    if (a === 'sync') syncNow();
    if (a === 'merge') mergeGuest();
    if (a === 'keep') keepGuest();
    if (a === 'signout') signOut(false);
    if (a === 'signout-all') signOut(true);
    if (a === 'ask-del') { askDelete = true; msg = ''; draw(); $('#acct-del')?.focus(); }
    if (a === 'cancel-del') { askDelete = false; draw(); }
    if (a === 'delete') deleteAccount();
  });

  document.addEventListener('submit', e => {
    const f = e.target.closest('[data-acct-form]');
    if (!f) return;
    e.preventDefault();
    if (busy) return;
    if (f.dataset.acctForm === 'email') sendCode($('#acct-email').value);
    else checkCode($('#acct-code').value);
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) { open = false; draw(); } });

  window.WaymarkSync = { schedule };
  drawButton();
  if (!enabled) return;

  sb = window.supabase.createClient(cfg.supabaseUrl.replace(/\/$/, ''), cfg.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'waymark-auth' }
  });

  sb.auth.onAuthStateChange((event, session) => {
    const u = session && session.user;
    setTimeout(() => {
      if (u && (!user || user.id !== u.id)) signedIn(u);
      else if (!u && user) { leaveAccount(user.id); say('You were signed out. Sign in again to keep syncing.', true); }
    }, 0);
  });

  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') syncNow(); });
  window.addEventListener('online', syncNow);
  window.addEventListener('offline', () => { if (user) setStatus('offline'); });
  setInterval(() => {
    if (user && document.visibilityState === 'visible' && status !== 'syncing') syncNow();
    else if (open) draw();
  }, 60000);
})();
