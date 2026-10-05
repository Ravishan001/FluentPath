'use strict';
/* FluentPath — optional Google sign-in + cloud backup/sync through Supabase.
   Local storage stays the source of truth while you study; every save is pushed to the cloud a moment later.
   On sign-in the newer copy (cloud vs this device) wins, so progress follows you between devices. */

FP.cloud = { user: null, client: null, configured: false, ready: false, syncDone: false, status: 'off', error: '' };
(function () {
  const C = FP.cloud, cfg = window.FP_CONFIG || {};
  C.configured = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase && location.protocol.startsWith('http'));
  C.needsServer = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) && !location.protocol.startsWith('http');
  const refresh = () => { if (FP.refreshAccount) FP.refreshAccount(); };
  const route = () => { if (FP.route && !FP._cleanup) FP.route(); };
  if (!C.configured) return;

  C.client = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { flowType: 'pkce', persistSession: true, detectSessionInUrl: true } });
  const table = () => C.client.from('fluentpath_state');
  const rawSave = FP.save; let timer = null;

  FP.save = () => { S.updatedAt = Date.now(); rawSave(); if (C.user) { clearTimeout(timer); timer = setTimeout(push, 1500); } };

  async function push() {
    if (!C.user) return;
    C.status = 'saving'; refresh();
    const { error } = await table().upsert({ user_id: C.user.id, data: S, updated_at: new Date().toISOString() });
    C.status = error ? 'error' : 'synced'; C.error = error ? error.message : ''; refresh();
  }

  async function sync() {
    if (!C.user) return;
    C.status = 'saving'; refresh();
    try {
      const { data, error } = await table().select('data').eq('user_id', C.user.id).maybeSingle();
      if (error) { C.status = 'error'; C.error = error.message; }
      else {
        const remote = data && data.data;
        if (remote && remote.v === 1 && ((remote.updatedAt || 0) > (S.updatedAt || 0) || !S.onboard)) {
          const d = FP.defaults(); Object.keys(S).forEach(k => delete S[k]);
          Object.assign(S, { ...d, ...remote, goal: { ...d.goal, ...remote.goal }, plan: { ...d.plan, ...remote.plan } });
          rawSave(); C.status = 'synced'; C.error = '';
          if (typeof applyTheme === 'function') applyTheme();
        } else await push();
      }
    } catch (e) { C.status = 'error'; C.error = String(e.message || e); }
    C.syncDone = true; refresh(); route();
  }

  C.signIn = () => C.client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname } });
  C.signOut = async () => { await C.client.auth.signOut(); C.user = null; C.status = 'off'; refresh(); };
  C.syncNow = () => push();

  C.client.auth.onAuthStateChange((ev, session) => {
    const u = session ? session.user : null, was = C.user, first = !C.ready;
    C.user = u; C.ready = true;
    if (u && location.search.includes('code=')) history.replaceState(null, '', location.pathname + location.hash);
    if (u && (!was || was.id !== u.id)) { C.syncDone = false; setTimeout(sync, 0); }
    if (!u) { C.status = 'off'; C.syncDone = false; if (first || was) route(); }
    refresh();
  });
  setTimeout(() => { if (!C.ready) { C.ready = true; route(); } }, 7000);
})();

FP.GOOGLE_G = '<svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>';
FP.googleButton = (label = 'Continue with Google') => `<button class="gbtn" data-act="gsign">${FP.GOOGLE_G}<span>${label}</span></button>`;
FP.accountHTML = () => {
  const C = FP.cloud;
  if (C.needsServer) return `<p class="muted">Open the app from its web address (your deployed link, or <b>start.bat</b> on your computer) — Google sign-in does not work when the file is opened directly.</p>`;
  if (!C.configured) return `<p class="muted">Cloud backup is not switched on yet. Paste your Supabase URL and anon key into <b>config.js</b> (steps are in <b>SETUP.md</b>), then reload.</p>`;
  if (!C.user) return `<p class="muted">Sign in to back up your progress and continue on any device.</p>${FP.googleButton('Sign in with Google')}`;
  const m = C.user.user_metadata || {}, st = { off: '', saving: 'Saving…', synced: 'Backed up ✓', error: 'Sync problem: ' + C.error }[C.status];
  return `<div class="acct">${m.avatar_url ? `<img src="${esc(m.avatar_url)}" alt="" referrerpolicy="no-referrer">` : ''}<div class="grow"><b>${esc(m.full_name || C.user.email)}</b><div class="muted sm">${esc(C.user.email || '')} · ${st}</div></div><button class="btn ghost sm" data-act="gsync">Sync now</button><button class="btn ghost sm" data-act="gout">Sign out</button></div>`;
};
FP.refreshAccount = () => { const el = document.getElementById('acct'); if (el) el.innerHTML = FP.accountHTML(); };
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act, C = FP.cloud;
  if (a === 'gsign' && C.client) C.signIn();
  else if (a === 'gout' && C.client) C.signOut().then(() => FP.toast('Signed out — your progress stays on this device'));
  else if (a === 'gsync' && C.client) C.syncNow().then(() => FP.toast('Synced'));
});

FP.avatarHTML = (cls = '') => {
  const u = FP.cloud.user; if (!u) return '';
  const m = u.user_metadata || {}, name = m.full_name || m.name || u.email || '?', pic = m.avatar_url || m.picture;
  return `<span class="av ${cls}" title="${esc(name)}"><b>${esc(name[0].toUpperCase())}</b>${pic ? `<img src="${esc(pic)}" alt="" referrerpolicy="no-referrer" onerror="this.remove()">` : ''}</span>`;
};
FP.meHTML = () => {
  const u = FP.cloud.user; if (!u) return '';
  const m = u.user_metadata || {};
  return `<a class="me" href="#/settings">${FP.avatarHTML()}<div><b>${esc(m.full_name || m.name || 'Signed in')}</b><small>${esc(u.email || '')}</small></div></a>`;
};
