'use strict';
/* FluentPath — engine: state, adaptive test maths, spaced repetition, speech, exercise runner */

const FP = {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const pad = n => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const dayNum = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5);
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

FP.KEY = 'fluentpath.v1';
FP.LV = ['A1', 'A2', 'B1', 'B2', 'C1'];
FP.LVN = ['Beginner', 'Elementary', 'Intermediate', 'Upper-intermediate', 'Advanced'];
FP.LVC = ['#2ee6a6', '#5ad1ff', '#7c5cff', '#ff8ad8', '#ffc857'];
FP.SKILLS = { grammar: 'Grammar', vocab: 'Vocabulary', build: 'Sentence building', reading: 'Reading' };

/* ---------- state ---------- */
FP.defaults = () => ({
  v: 1, name: '', onboard: false, self: 1,
  goal: { type: 'general', label: 'B2 · Upper-intermediate', theta: 3 },
  theta0: null, skills: null, placement: null,
  plan: { mode: 'minutes', minutes: 30, weeks: 12, dpw: 6, startKey: null },
  log: {}, xp: 0, units: {}, srs: {}, mistakes: [], tasks: {},
  theme: 'dark', sinhala: true, sound: true, voice: 'en-GB', rate: 0.95
});
FP.S = (() => {
  try {
    const s = JSON.parse(localStorage.getItem(FP.KEY));
    if (s && s.v === 1) { const d = FP.defaults(); return { ...d, ...s, goal: { ...d.goal, ...s.goal }, plan: { ...d.plan, ...s.plan } }; }
  } catch (e) { }
  return FP.defaults();
})();
const S = FP.S;
FP.save = () => { try { localStorage.setItem(FP.KEY, JSON.stringify(S)); } catch (e) { } };

/* ---------- icons ---------- */
FP.ICONS = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
  cards: '<rect x="3" y="7" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  gear: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  vol: '<path d="M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  flame: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  redo: '<path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/>',
  pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/>',
  ear: '<path d="M6 9a6 6 0 1 1 12 0c0 4-4 4-4 8a3 3 0 0 1-6 0"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
  moon: '<path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  note: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'
};
FP.ic = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${FP.ICONS[n] || ''}</svg>`;

/* ---------- hours-to-level model ----------
   Cumulative study hours to *reach* a level (theta 0=A1 … 4=C1), interpolated.
   Based on the guided-learning-hour ranges Cambridge publishes per CEFR level. A rough guide, not a promise. */
FP.HP = [[-1, 0], [0, 90], [1, 200], [2, 375], [3, 550], [4, 750], [5, 1100]];
FP.H = t => {
  const P = FP.HP; t = clamp(t, -1, 5);
  for (let i = 1; i < P.length; i++) if (t <= P[i][0]) { const [x0, y0] = P[i - 1], [x1, y1] = P[i]; return y0 + (y1 - y0) * (t - x0) / (x1 - x0); }
  return P[P.length - 1][1];
};
FP.invH = h => {
  const P = FP.HP; h = clamp(h, 0, 1100);
  for (let i = 1; i < P.length; i++) if (h <= P[i][1]) { const [x0, y0] = P[i - 1], [x1, y1] = P[i]; return x0 + (x1 - x0) * (h - y0) / (y1 - y0); }
  return 5;
};
FP.TARGETS = {
  general: [['A2 · Elementary', 1], ['B1 · Intermediate', 2], ['B2 · Upper-intermediate', 3], ['C1 · Advanced', 4]],
  ielts: [['IELTS 5.0', 2.2], ['IELTS 5.5', 2.7], ['IELTS 6.0', 3.1], ['IELTS 6.5', 3.5], ['IELTS 7.0', 3.9], ['IELTS 7.5', 4.3], ['IELTS 8.0', 4.7]],
  pte: [['PTE 36', 2.3], ['PTE 43', 2.7], ['PTE 50', 3.1], ['PTE 58', 3.5], ['PTE 65', 3.9], ['PTE 73', 4.3], ['PTE 79', 4.7]]
};
FP.hoursNeeded = (t0, tt, type) => Math.max(8, Math.max(0, FP.H(tt) - FP.H(t0)) + (type === 'general' ? 0 : 25));
FP.lvl = t => clamp(Math.round(t), 0, 4);
FP.lvlLabel = t => {
  if (t == null) return '—';
  const l = FP.lvl(t), f = t - Math.round(t);
  return FP.LV[l] + (l === 4 && t > 4.4 ? '+' : f > 0.25 && l < 4 ? ' (upper)' : f < -0.25 && l > 0 ? ' (lower)' : '');
};
FP.curTheta = () => S.theta0 == null ? null : FP.thetaNow();
FP.minutesSincePlan = () => { const s = S.plan.startKey || '9999'; return Object.entries(S.log).filter(([k]) => k >= s).reduce((a, [, v]) => a + v, 0); };
FP.thetaNow = () => Math.min(5, FP.invH(FP.H(S.theta0) + FP.minutesSincePlan() / 60));
FP.hoursTotal = () => FP.hoursNeeded(S.theta0 ?? 1, S.goal.theta, S.goal.type);
FP.dailyMinutes = () => {
  const p = S.plan;
  if (p.mode === 'minutes') return p.minutes;
  return clamp(Math.ceil(FP.hoursTotal() * 60 / (p.weeks * p.dpw)), 10, 360);
};
FP.weeksFor = (hours, minutes, dpw) => hours * 60 / (minutes * dpw);
FP.addMinutes = m => { const k = dayKey(); S.log[k] = (S.log[k] || 0) + m; FP.save(); };
FP.streak = () => { let n = 0; const d = new Date(); if (!(S.log[dayKey(d)] >= 1)) d.setDate(d.getDate() - 1); while (S.log[dayKey(d)] >= 1) { n++; d.setDate(d.getDate() - 1); } return n; };
FP.todayMin = () => S.log[dayKey()] || 0;

/* ---------- adaptive placement maths (1-parameter IRT with guessing) ---------- */
FP.irt = (t, it, idk) => { const g = idk ? 0 : (it.type === 'mc' ? .25 : .03); return g + (1 - g) / (1 + Math.exp(-1.6 * (t - it.d))); };
FP.mle = (resp, prior, sd) => {
  let best = prior, bl = -1e18;
  for (let t = -1; t <= 5.001; t += .02) {
    let ll = -((t - prior) ** 2) / (2 * sd * sd);
    for (const r of resp) { const p = FP.irt(t, r.item, r.idk); ll += Math.log(r.ok ? p : Math.max(1 - p, 1e-6)); }
    if (ll > bl) { bl = ll; best = t; }
  }
  return best;
};
FP.pickNext = (pool, used, theta, recentSkills) => {
  const c = pool.filter(q => !used.has(q.id)).sort((a, b) => Math.abs(a.d - theta) - Math.abs(b.d - theta));
  const near = c.slice(0, 7);
  const varied = near.filter(q => !(recentSkills.length >= 2 && recentSkills.slice(-2).every(s => s === q.skill)));
  const list = (varied.length ? varied : near).slice(0, 4);
  return list[Math.floor(Math.random() * list.length)];
};

/* ---------- text helpers ---------- */
FP.parse = s => {
  const p = s.split('|');
  const id = FP.hash(s);
  if (p[0] === 'mc') return { id, type: 'mc', q: p[1], opts: p[2].split(';'), a: +p[3], why: p[4] || '' };
  if (p[0] === 'type') return { id, type: 'type', q: p[1], ans: p[2].split('/'), why: p[3] || '' };
  return { id, type: 'ord', s: p[1], alts: p[2] ? p[2].split('~') : [], why: '' };
};
FP.hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
FP.norm = s => String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/[.!?,;:"]+/g, ' ').replace(/\s+/g, ' ').trim();
FP.fmtQ = q => esc(q).replace(/___/g, '<span class="blank"></span>');
FP.fullSentence = it => {
  if (it.type === 'mc') return it.q.replace('___', it.opts[it.a]);
  if (it.type === 'type') return it.q.replace(/\s*\([^)]*\)/g, '').replace('___', it.ans[0]).replace(/\s+/g, ' ');
  if (it.type === 'ord') return it.s;
  return '';
};
FP.nw = t => t.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9']/g, '');
FP.align = (target, said) => {
  const tt = target.split(/\s+/).filter(Boolean), a = tt.map(FP.nw), b = said.split(/\s+/).map(FP.nw).filter(Boolean);
  const n = a.length, m = b.length, dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const hit = new Array(n).fill(false); let i = n, j = m;
  while (i > 0 && j > 0) { if (a[i - 1] === b[j - 1]) { hit[i - 1] = true; i--; j--; } else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--; }
  const got = dp[n][m];
  return { tokens: tt, hit, got, total: n, acc: n ? got / n : 0, extra: Math.max(0, m - got) };
};
FP.diffHTML = al => al.tokens.map((t, i) => `<span class="w ${al.hit[i] ? 'ok' : 'miss'}">${esc(t)}</span>`).join(' ');

/* ---------- audio: sound effects, speech out, speech in ---------- */
FP.sfx = ok => {
  if (!S.sound) return;
  try {
    const c = FP.ac || (FP.ac = new (window.AudioContext || window.webkitAudioContext)()), o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
    o.connect(g); g.connect(c.destination); o.type = 'sine';
    if (ok) { o.frequency.setValueAtTime(660, t); o.frequency.setValueAtTime(880, t + .09); } else { o.frequency.setValueAtTime(230, t); o.frequency.setValueAtTime(180, t + .1); }
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.1, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .28);
    o.start(t); o.stop(t + .3);
  } catch (e) { }
};
FP.voices = () => ('speechSynthesis' in window) ? speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang)) : [];
if ('speechSynthesis' in window) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }
FP.speak = (text, o = {}) => {
  if (!('speechSynthesis' in window)) return false;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text), lang = o.lang || S.voice;
  u.lang = lang; u.rate = o.rate || S.rate;
  const vs = FP.voices();
  const v = vs.find(v => v.lang.replace('_', '-') === lang) || vs[0];
  if (v) u.voice = v;
  if (o.end) u.onend = o.end;
  speechSynthesis.speak(u);
  return true;
};
FP.SR = window.SpeechRecognition || window.webkitSpeechRecognition;
FP.listen = on => {
  if (!FP.SR) return null;
  const r = new FP.SR(); r.lang = 'en-US'; r.continuous = true; r.interimResults = true;
  let fin = '', stopped = false;
  r.onresult = e => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) { const t = e.results[i][0].transcript; if (e.results[i].isFinal) fin += t + ' '; else interim += t; }
    on.result && on.result((fin + interim).trim());
  };
  r.onerror = e => { if (e.error === 'no-speech') return; stopped = true; on.error && on.error(e.error); };
  r.onend = () => { if (!stopped) { try { r.start(); return; } catch (e) { } } on.end && on.end(fin.trim()); };
  try { r.start(); } catch (e) { return null; }
  return { stop: () => { stopped = true; try { r.stop(); } catch (e) { } } };
};

/* ---------- effects ---------- */
FP.confetti = () => {
  const c = $('#confetti'); if (!c) return;
  const x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const cols = ['#7c5cff', '#19d3da', '#2ee6a6', '#ffc857', '#ff6b7a'];
  const ps = Array.from({ length: 150 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 240, y: innerHeight * .4, vx: (Math.random() - .5) * 15, vy: -Math.random() * 15 - 4, r: Math.random() * 5 + 3, c: cols[Math.floor(Math.random() * 5)], rot: Math.random() * 6, vr: (Math.random() - .5) * .4 }));
  let f = 0;
  (function a() {
    x.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => { p.vy += .36; p.x += p.vx; p.y += p.vy; p.rot += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.fillStyle = p.c; x.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); x.restore(); });
    if (++f < 150) requestAnimationFrame(a); else x.clearRect(0, 0, c.width, c.height);
  })();
};
FP.toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(FP._tt); FP._tt = setTimeout(() => t.classList.remove('show'), 2400); };
let _rid = 0;
FP.ring = (pct, size = 120, stroke = 10, big = '', small = '') => {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, id = 'rg' + (++_rid);
  return `<div class="ring" style="width:${size}px;height:${size}px"><svg viewBox="0 0 ${size} ${size}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--p1)"/><stop offset="1" stop-color="var(--p2)"/></linearGradient></defs><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--track)" stroke-width="${stroke}"/><circle class="rg" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="url(#${id})" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - clamp(pct, 0, 100) / 100)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg><div class="ring-in"><b>${big}</b><small>${small}</small></div></div>`;
};

/* ---------- mistakes notebook ---------- */
FP.noteMistake = it => {
  if (!it || !['mc', 'type', 'ord'].includes(it.type)) return;
  if (S.mistakes.some(m => m.id === it.id)) return;
  const { d, skill, ...rest } = it;
  S.mistakes.unshift(rest); S.mistakes = S.mistakes.slice(0, 80); FP.save();
};
FP.clearMistake = id => { S.mistakes = S.mistakes.filter(m => m.id !== id); FP.save(); };

/* ---------- spaced repetition (Leitner boxes) ---------- */
FP.INTERVALS = [0, 1, 2, 4, 8, 16, 32, 60];
FP.srsRate = (w, r) => {
  const s = S.srs[w.w] || { box: 0, due: 0, n: 0 };
  s.n++;
  if (r === 1) s.box = 0; else if (r === 2) s.box = Math.max(1, s.box); else if (r === 3) s.box = Math.min(7, s.box + 1); else s.box = Math.min(7, s.box + 2);
  s.due = dayNum() + (r === 1 ? 0 : FP.INTERVALS[s.box]);
  S.srs[w.w] = s; FP.save();
};
FP.srsHint = (w, r) => {
  const s = S.srs[w.w] || { box: 0 };
  if (r === 1) return 'again';
  const b = r === 2 ? Math.max(1, s.box) : Math.min(7, s.box + (r === 3 ? 1 : 2));
  const d = FP.INTERVALS[b]; return d === 1 ? '1 day' : d + ' days';
};
FP.dueWords = () => VOCAB.filter(w => S.srs[w.w] && S.srs[w.w].due <= dayNum());
FP.newWords = n => {
  const L = S.theta0 == null ? 0 : FP.lvl(FP.curTheta());
  return VOCAB.filter(w => !S.srs[w.w] && w.l >= Math.max(0, L - 1)).sort((a, b) => a.l - b.l).slice(0, n);
};

/* ---------- exercise renderers ----------
   Each returns a controller:
   { check():{ok,score?,expected?,why?,say?}|null, lock(r), pick?(i), auto?:true }
   cb.ready(bool) toggles the Check button; cb.done(result) finishes an auto item. */
FP.R = {};
FP.renderItem = (host, it, cb) => FP.R[it.type](host, it, cb);

FP.R.mc = (host, it, cb) => {
  const order = shuffle(it.opts.map((_, i) => i)); let sel = -1;
  host.innerHTML = `${it.passage ? `<div class="passage">${esc(it.passage)}</div>` : ''}<h2 class="q">${FP.fmtQ(it.q)}</h2><div class="opts">${order.map((oi, k) => `<button class="opt" data-i="${oi}"><kbd>${k + 1}</kbd><span>${esc(it.opts[oi])}</span></button>`).join('')}</div>`;
  const btns = $$('.opt', host);
  const pick = oi => { sel = oi; btns.forEach(b => b.classList.toggle('sel', +b.dataset.i === oi)); cb.ready(true); };
  btns.forEach(b => b.onclick = () => pick(+b.dataset.i));
  return {
    pick: k => { const b = btns[k]; if (b && !b.disabled) pick(+b.dataset.i); },
    check: () => sel < 0 ? null : { ok: sel === it.a, expected: FP.fullSentence(it) === it.q ? it.opts[it.a] : FP.fullSentence(it), why: it.why, say: FP.fullSentence(it) },
    lock: r => btns.forEach(b => { b.disabled = true; const i = +b.dataset.i; if (i === it.a) b.classList.add('right'); else if (i === sel) b.classList.add('wrong'); })
  };
};

FP.R.type = (host, it, cb) => {
  host.innerHTML = `<h2 class="q">${FP.fmtQ(it.q)}</h2><input class="inp" id="ti" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type the missing word(s)">`;
  const inp = $('#ti', host); setTimeout(() => inp.focus(), 60);
  inp.oninput = () => cb.ready(inp.value.trim() !== '');
  return {
    check: () => { const v = FP.norm(inp.value); if (!v) return null; return { ok: it.ans.some(a => FP.norm(a) === v), expected: FP.fullSentence(it), why: it.why, say: FP.fullSentence(it) }; },
    lock: r => { inp.disabled = true; inp.classList.add(r.ok ? 'right' : 'wrong'); }
  };
};

FP.R.ord = (host, it, cb) => {
  const raw = it.s.split(' ');
  const disp = raw.map((t, i) => (i === 0 && t !== 'I' && !/^I'/.test(t)) ? t[0].toLowerCase() + t.slice(1) : t);
  let ids = raw.map((_, i) => i), tries = 0;
  do { ids = shuffle(ids); tries++; } while (ids.every((v, i) => v === i) && tries < 6);
  const ans = [];
  host.innerHTML = `<h2 class="q">Put the words in the right order</h2><div class="slot" id="ans"></div><div class="bank" id="bank"></div><button class="btn ghost sm" id="rst">${FP.ic('redo')} Reset</button>`;
  const A = $('#ans', host), B = $('#bank', host);
  let locked = false;
  const draw = () => {
    A.innerHTML = ans.map(i => `<button class="chip-w" data-i="${i}">${esc(disp[i])}</button>`).join('') || '<span class="ph">Tap the words below</span>';
    B.innerHTML = ids.filter(i => !ans.includes(i)).map(i => `<button class="chip-w" data-i="${i}">${esc(disp[i])}</button>`).join('');
    cb.ready(ans.length === raw.length);
  };
  host.onclick = e => {
    if (locked) return;
    const b = e.target.closest('.chip-w'); if (b) { const i = +b.dataset.i; if (ans.includes(i)) ans.splice(ans.indexOf(i), 1); else ans.push(i); draw(); }
    if (e.target.closest('#rst')) { ans.length = 0; draw(); }
  };
  draw();
  return {
    check: () => {
      if (ans.length < raw.length) return null;
      const got = FP.norm(ans.map(i => raw[i]).join(' '));
      const ok = [it.s, ...it.alts].some(s => FP.norm(s) === got);
      return { ok, expected: it.s, why: it.why, say: it.s };
    },
    lock: r => { locked = true; A.classList.add(r.ok ? 'right' : 'wrong'); }
  };
};

FP.R.card = (host, it, cb) => {
  const w = it.w, say = () => FP.speak(w.w + '. ' + w.ex);
  const meaning = () => `<div class="mean"><b>${esc(w.m)}</b>${S.sinhala && w.si ? `<div class="si">${esc(w.si)}</div>` : ''}</div>`;
  const stem = w.w.length > 5 ? w.w.slice(0, -2) : w.w.length > 3 ? w.w.slice(0, -1) : w.w;
  const re = new RegExp('\\b' + escRe(stem) + '\\w*', 'i');
  if (it.mode === 'cloze' && re.test(w.ex)) {
    host.innerHTML = `<div class="eyebrow">Recall · fill the gap</div><h2 class="q big">${FP.fmtQ(w.ex.replace(re, '___'))}</h2><p class="muted">${esc(w.pos)} · starts with <b>${esc(w.w[0])}</b> · ${w.w.length} letters</p><input class="inp" id="ci" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type the word"><div id="cr"></div><div class="row end"><button class="btn primary lg" id="cb">Check</button></div>`;
    const inp = $('#ci', host), btn = $('#cb', host), res = $('#cr', host); setTimeout(() => inp.focus(), 60);
    let st = 0;
    const go = () => {
      if (st === 0) {
        const v = FP.norm(inp.value); if (!v) return;
        const ok = v === FP.norm(w.w) || re.test(v) && v.length >= stem.length && new RegExp('^' + escRe(stem) + '\\w*$').test(v);
        FP.sfx(ok); FP.srsRate(w, ok ? 3 : 1); st = ok ? 1 : 2; it._ok = ok;
        inp.disabled = true; inp.classList.add(ok ? 'right' : 'wrong');
        res.innerHTML = `<div class="banner ${ok ? 'ok' : 'bad'}"><b>${ok ? 'Correct' : 'The word was “' + esc(w.w) + '”'}</b>${meaning()}</div>`; btn.textContent = 'Continue';
      } else cb.done({ ok: it._ok, score: it._ok ? 1 : 0, requeue: !it._ok });
    };
    btn.onclick = go; inp.onkeydown = e => { if (e.key === 'Enter') { e.stopPropagation(); go(); } };
    return { auto: true };
  }
  host.innerHTML = `<div class="wcard"><div class="wtop"><span class="chip lv${w.l}">${FP.LV[w.l]}</span><button class="icon-btn" id="sp" title="Listen">${FP.ic('vol')}</button></div><h1 class="word">${esc(w.w)}</h1><div class="muted">${esc(w.pos)}</div><p class="ex">“${esc(w.ex).replace(re, m => `<mark>${m}</mark>`)}”</p><div id="bk" hidden>${meaning()}</div></div><div class="row end" id="ctl"><button class="btn primary lg" id="sh">Show meaning</button></div>`;
  $('#sp', host).onclick = say; setTimeout(say, 250);
  const reveal = () => {
    $('#bk', host).hidden = false;
    $('#ctl', host).innerHTML = [[1, 'Again', 'bad'], [2, 'Hard', 'warn'], [3, 'Good', 'ok'], [4, 'Easy', 'info']].map(([r, l, c]) => `<button class="btn rate ${c}" data-r="${r}"><b>${l}</b><small>${FP.srsHint(w, r)}</small></button>`).join('');
    $$('.rate', host).forEach(b => b.onclick = () => { const r = +b.dataset.r; FP.srsRate(w, r); cb.done({ ok: r >= 2, score: [0, 0, .5, 1, 1][r], requeue: r === 1 }); });
  };
  $('#sh', host).onclick = reveal;
  return { auto: true, pick: null, reveal };
};

/* ---------- session runner ---------- */
FP.session = o => {
  const results = []; let i = 0, st = 'ans', ctrl = null, item = null, finished = false, isReady = false; const t0 = Date.now();
  const app = $('#app');
  FP.stopMedia();
  app.innerHTML = `<div class="sess"><header class="sess-top"><button class="icon-btn" id="sx" title="Exit (Esc)">${FP.ic('x')}</button><div class="pbar"><i id="pb"></i></div><span class="pc" id="pc"></span></header><main class="sess-main"><div class="sess-card" id="sm"></div></main><footer class="sess-foot" id="sf"></footer></div>`;
  const sm = $('#sm'), sf = $('#sf');
  const total = () => typeof o.total === 'function' ? o.total() : o.total;
  const prog = () => { $('#pb').style.width = Math.min(100, i / Math.max(1, total()) * 100) + '%'; $('#pc').textContent = `${Math.min(i + 1, total())} / ${total()}`; };
  const record = (r, idk) => {
    const rec = { item, ok: !!r.ok, score: r.score ?? (r.ok ? 1 : 0), idk: !!idk, requeue: r.requeue };
    results.push(rec); if (o.onItem) o.onItem(rec);
  };
  const advance = () => { i++; next(); };
  function footAns() {
    if (ctrl.auto) { sf.className = 'sess-foot empty'; sf.innerHTML = ''; return; }
    sf.className = 'sess-foot';
    sf.innerHTML = `<div class="foot-in">${o.idk ? `<button class="btn ghost" id="idk">I don't know</button>` : '<span></span>'}<button class="btn primary lg" id="chk" disabled>${o.feedback === false ? 'Next' : 'Check'}</button></div>`;
    $('#chk').onclick = check; $('#chk').disabled = !isReady;
    if (o.idk) $('#idk').onclick = () => { record({ ok: false }, true); advance(); };
  }
  function next() {
    item = o.getItem(i, results);
    if (!item) return fin();
    prog(); st = 'ans'; isReady = false;
    sm.className = 'sess-card'; void sm.offsetWidth; sm.className = 'sess-card in';
    sm.innerHTML = ''; FP.stopMedia();
    ctrl = FP.renderItem(sm, item, {
      ready: v => { isReady = v; const b = $('#chk'); if (b) b.disabled = !v; },
      done: r => { record(r); advance(); }
    });
    footAns();
  }
  function check() {
    const r = ctrl.check(); if (!r) return;
    record(r); FP.sfx(r.ok); ctrl.lock && ctrl.lock(r);
    if (o.feedback === false) return advance();
    st = 'fb';
    sf.className = 'sess-foot ' + (r.ok ? 'good' : 'bad');
    sf.innerHTML = `<div class="foot-in"><div class="fb"><div class="fb-t">${FP.ic(r.ok ? 'check' : 'x')} ${r.ok ? ['Nice!', 'Correct!', 'Spot on!', 'Well done!'][i % 4] : 'Not quite'}</div>${!r.ok && r.expected ? `<div class="fb-a">Answer: <b>${esc(r.expected)}</b></div>` : ''}${r.why ? `<div class="fb-w">${esc(r.why)}</div>` : ''}${r.html || ''}</div><div class="fb-btns">${r.say ? `<button class="icon-btn" id="spk" title="Listen">${FP.ic('vol')}</button>` : ''}<button class="btn primary lg" id="cont">Continue</button></div></div>`;
    $('#cont').onclick = advance; if (r.say) $('#spk').onclick = () => FP.speak(r.say);
    if (o.autoSay && r.say) FP.speak(r.say);
  }
  const kd = e => {
    if (e.key === 'Escape') return exit();
    const tag = e.target.tagName || '';
    if (e.key === 'Enter') {
      if (tag === 'BUTTON') return;
      if (st === 'fb') { e.preventDefault(); advance(); }
      else if (st === 'ans' && ctrl && !ctrl.auto && tag !== 'TEXTAREA') { const b = $('#chk'); if (b && !b.disabled) { e.preventDefault(); check(); } }
    } else if (/^[1-9]$/.test(e.key) && st === 'ans' && tag !== 'INPUT' && tag !== 'TEXTAREA' && ctrl && ctrl.pick) ctrl.pick(+e.key - 1);
  };
  const cleanup = () => { document.removeEventListener('keydown', kd); FP.stopMedia(); };
  FP._cleanup = cleanup;
  function exit() {
    if (finished) return;
    if (results.length && !confirm('Leave this session? Your progress so far in it will be lost.')) return;
    finished = true; cleanup(); (o.onExit || (() => FP.route()))();
  }
  function fin() { finished = true; cleanup(); o.onFinish(results, Math.round((Date.now() - t0) / 1000)); }
  document.addEventListener('keydown', kd);
  $('#sx').onclick = exit;
  next();
};
FP.stopMedia = () => { try { 'speechSynthesis' in window && speechSynthesis.cancel(); } catch (e) { } if (FP._rec) { FP._rec.stop(); FP._rec = null; } clearInterval(FP._timer); };

FP.summary = o => {
  const rs = o.results, n = rs.length, sc = rs.reduce((a, r) => a + r.score, 0), pct = n ? Math.round(sc / n * 100) : 0;
  const miss = rs.filter(r => !r.ok && r.item.type !== 'card').slice(0, 8);
  const mins = Math.max(1, Math.round(o.secs / 60));
  $('#app').innerHTML = `<div class="sess"><main class="sess-main"><div class="sess-card in sum"><img class="mascot" src="assets/mascot.png" alt="" onerror="this.remove()"><div class="eyebrow">${esc(o.title)}</div><h1>${pct >= 90 ? 'Brilliant!' : pct >= 70 ? 'Great work!' : pct >= 50 ? 'Good effort' : 'Keep going — this is how it sticks'}</h1>${FP.ring(pct, 150, 12, pct + '%', 'accuracy')}<div class="stats3"><div><b>${rs.filter(r => r.ok).length}/${n}</b><small>correct</small></div><div><b>${mins}m</b><small>time</small></div><div><b>+${o.xp}</b><small>XP</small></div></div>${miss.length ? `<div class="miss"><h3>Worth another look</h3>${miss.map(r => `<div class="miss-i"><span>${esc(FP.fullSentence(r.item) || r.item.w?.w || '')}</span></div>`).join('')}<p class="muted sm">These were saved to your Mistake Notebook.</p></div>` : ''}${o.extra || ''}<div class="row center gap"><button class="btn ghost" id="sec">${esc(o.secondary?.label || 'Back to home')}</button><button class="btn primary lg" id="prim">${esc(o.primary?.label || 'Done')}</button></div></div></main></div>`;
  $('#prim').onclick = o.primary?.fn || (() => FP.go('#/home'));
  $('#sec').onclick = o.secondary?.fn || (() => FP.go('#/home'));
  if (pct >= 80 && n >= 3) setTimeout(FP.confetti, 200);
};

/* run a study session with common bookkeeping (time, XP, task tick, mistakes) */
FP.study = o => {
  FP.session({
    title: o.title, total: o.total ?? o.items.length, idk: o.idk, feedback: o.feedback, autoSay: o.autoSay,
    getItem: o.getItem || ((i, rs) => o.items[i]),
    onItem: r => { if (r.item.type === 'card' || r.item.noLog) return; if (!r.ok) FP.noteMistake(r.item); else if (o.fixing) FP.clearMistake(r.item.id); },
    onFinish: (rs, secs) => {
      const gained = rs.reduce((a, r) => a + Math.round(r.score * 10), 0) + (o.bonus || 0);
      S.xp += gained; FP.addMinutes(Math.min(secs / 60, 45));
      if (o.taskId) { const k = dayKey(); (S.tasks[k] = S.tasks[k] || {})[o.taskId] = true; }
      if (o.after) o.after(rs);
      FP.save();
      FP.summary({
        title: o.title, results: rs, secs, xp: gained, extra: o.extra ? o.extra(rs) : '',
        primary: o.again ? { label: 'Another round', fn: o.again } : { label: 'Back to home', fn: () => FP.go('#/home') },
        secondary: { label: 'Back to home', fn: () => FP.go('#/home') }
      });
    }
  });
};
