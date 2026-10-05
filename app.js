'use strict';
/* FluentPath — views and routing */

const NAV = [['home', 'Home', 'home'], ['learn', 'Learn', 'book'], ['vocab', 'Vocabulary', 'cards'], ['practice', 'Practice', 'target'], ['exam', 'Exam Lab', 'trophy'], ['progress', 'Progress', 'chart'], ['plan', 'My Plan', 'cal'], ['settings', 'Settings', 'gear']];
const LEVEL_TEXT = [
  'You know basic words and very simple sentences. We will build solid foundations first.',
  'You can handle simple everyday conversations and short texts. Time to connect your ideas.',
  'You can talk about familiar topics and write simple connected text. Now we widen your range.',
  'You follow complex ideas and communicate fluently on most topics. Now we sharpen accuracy.',
  'You use English flexibly for study and work. Now we polish style, precision and exam technique.'
];
const LOGO = `<svg viewBox="0 0 32 32" class="logo"><defs><linearGradient id="lgg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c5cff"/><stop offset="1" stop-color="#19d3da"/></linearGradient></defs><rect width="32" height="32" rx="9" fill="url(#lgg)"/><path d="M11 23V9.5h10M11 15.5h7" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="22.5" cy="22" r="2.2" fill="#fff"/></svg>`;

const FOOTER = `<footer class="foot">© 2026 Ravishan Tennakoon. All rights reserved.</footer>`;
const LOGO_IMG = `<img src="assets/logo.png" alt="" onerror="this.outerHTML=LOGO">`;

/* ---------- routing ---------- */
FP.go = h => { if (location.hash === h) FP.route(); else location.hash = h; };
FP.route = () => {
  if (FP._cleanup) { FP._cleanup(); FP._cleanup = null; }
  FP.stopMedia();
  const C = FP.cloud;
  if (C.configured) { if (!C.ready || (C.user && !C.syncDone)) return splash(); if (!C.user) return viewLogin(); }
  else if (C.needsServer) return viewLogin();
  const [, page = 'home', arg, flag] = (location.hash || '#/home').split('/');
  if (!S.onboard && !['welcome', 'result'].includes(page)) return FP.go('#/welcome');
  const V = { welcome: viewWelcome, result: viewResult, home: viewHome, learn: viewLearn, lesson: () => viewLesson(arg, flag === 't'), vocab: viewVocab, practice: viewPractice, exam: viewExam, progress: viewProgress, plan: viewPlan, settings: viewSettings };
  (V[page] || viewHome)();
  window.scrollTo(0, 0);
};
window.addEventListener('hashchange', FP.route);

function splash() {
  $('#app').innerHTML = `<div class="welcome"><div class="wl in center"><div class="logo-big">${LOGO_IMG}</div><div class="eyebrow">FluentPath</div><p class="muted">Loading your progress…</p><div class="loader"><i></i></div></div></div>`;
}
function viewLogin() {
  const C = FP.cloud;
  $('#app').innerHTML = `<div class="welcome"><div class="wl in"><img class="welcome-hero" src="assets/hero.jpg" alt="" onerror="this.remove()"><div class="logo-big">${LOGO_IMG}</div><div class="eyebrow">FluentPath</div><h1>English that fits <em>your</em> life.</h1><p class="lead">Sign in to start. Your level, plan and progress are saved to your account, so you can continue on any device.</p><div id="acct">${C.needsServer ? FP.accountHTML() : FP.googleButton('Sign in with Google')}</div><p class="muted sm center mt">We only use your Google name, email and photo to identify your account.</p></div>${FOOTER}</div>`;
}

function shell(active, title, html, sub = '') {
  const tabs = NAV.filter(n => ['home', 'learn', 'vocab', 'practice', 'exam', 'progress'].includes(n[0]));
  $('#app').innerHTML = `<div class="shell"><aside class="side"><a class="brand" href="#/home">${LOGO_IMG}<span>Fluent<b>Path</b></span></a><nav>${NAV.map(([k, l, i]) => `<a href="#/${k}" class="${k === active ? 'on' : ''}">${FP.ic(i)}<span>${l}</span></a>`).join('')}</nav><div class="side-foot">${FP.meHTML()}<div class="mini"><span>${FP.ic('flame')} ${FP.streak()}-day streak</span><span>${FP.ic('bolt')} ${S.xp} XP</span></div></div></aside><main class="main"><header class="topbar"><div><h1 class="pt">${title}</h1>${sub ? `<p class="muted">${sub}</p>` : ''}</div><div class="tb-r"><a class="avatar-link" href="#/settings" title="${esc(FP.cloud.user?.email || '')}">${FP.avatarHTML()}</a><span class="chip hide-s">${FP.ic('flame')} ${FP.streak()}</span><a class="icon-btn" href="#/plan" title="My plan">${FP.ic('cal')}</a><button class="icon-btn" id="thm" title="Light / dark">${FP.ic(S.theme === 'dark' ? 'sun' : 'moon')}</button><a class="icon-btn" href="#/settings" title="Settings">${FP.ic('gear')}</a></div></header><div class="page in">${html}</div>${FOOTER}</main><nav class="bottom">${tabs.map(([k, l, i]) => `<a href="#/${k}" class="${k === active ? 'on' : ''}">${FP.ic(i)}<span>${l.replace('Vocabulary', 'Words').replace('Exam Lab', 'Exams')}</span></a>`).join('')}</nav></div>`;
  $('#thm').onclick = () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; applyTheme(); FP.save(); FP.route(); };
}
function applyTheme() { document.documentElement.dataset.theme = S.theme; }

/* ---------- helpers ---------- */
const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');
const fmtDate = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
function ladder(cur, target) {
  const x = t => clamp(t, 0, 5) / 5 * 100;
  return `<div class="ladder"><div class="lad-track"><i class="lad-fill" style="width:${x(cur ?? 0)}%"></i></div>${FP.LV.map((l, i) => `<span class="lad-n ${cur != null && cur >= i - .25 ? 'on' : ''}" style="left:${x(i)}%"><b>${l}</b></span>`).join('')}<span class="lad-n faint" style="left:100%"><b>C2</b></span>${cur != null ? `<span class="lad-pin" style="left:${x(cur)}%" title="You"></span>` : ''}<span class="lad-flag" style="left:${x(target)}%" title="Target">${FP.ic('target')}</span></div>`;
}
function radar(skills) {
  const keys = Object.keys(FP.SKILLS), cx = 120, cy = 112, R = 78;
  const pt = (i, v) => { const a = -Math.PI / 2 + i * 2 * Math.PI / keys.length; return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v]; };
  const poly = vs => vs.map((v, i) => pt(i, v).join(',')).join(' ');
  const vals = keys.map(k => clamp((skills?.[k] ?? 0) / 4.5, .04, 1));
  return `<svg viewBox="0 0 240 230" class="radar"><defs><linearGradient id="rdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--p1)" stop-opacity=".55"/><stop offset="1" stop-color="var(--p2)" stop-opacity=".45"/></linearGradient></defs>${[.25, .5, .75, 1].map(r => `<polygon points="${poly(keys.map(() => r))}" fill="none" stroke="var(--line)"/>`).join('')}${keys.map((k, i) => { const [x, y] = pt(i, 1); return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--line)"/>`; }).join('')}<polygon points="${poly(vals)}" fill="url(#rdg)" stroke="var(--p1)" stroke-width="2" stroke-linejoin="round"/>${vals.map((v, i) => { const [x, y] = pt(i, v); return `<circle cx="${x}" cy="${y}" r="3.5" fill="var(--p2)"/>`; }).join('')}${keys.map((k, i) => { const [x, y] = pt(i, 1.2); return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" class="rl">${FP.SKILLS[k].replace('Sentence building', 'Sentences')}</text>`; }).join('')}</svg>`;
}
function weekBars(days, goal) {
  const vals = [], now = new Date();
  for (let i = days - 1; i >= 0; i--) { const d = new Date(now); d.setDate(d.getDate() - i); vals.push([d, S.log[dayKey(d)] || 0]); }
  const max = Math.max(goal * 1.15, ...vals.map(v => v[1]), 10);
  return `<div class="bars" style="--g:${goal / max * 100}%">${vals.map(([d, v]) => `<div class="bar ${v >= goal ? 'hit' : ''}" title="${Math.round(v)} min"><i style="height:${Math.max(3, v / max * 100)}%"></i><small>${d.toLocaleDateString('en-GB', { weekday: 'narrow' })}</small></div>`).join('')}<span class="goal-line"><em>${goal} min goal</em></span></div>`;
}
function planInfo() {
  const hours = FP.hoursTotal(), mins = FP.dailyMinutes(), p = S.plan;
  const weeks = p.mode === 'weeks' ? p.weeks : FP.weeksFor(hours, p.minutes, p.dpw);
  const start = p.startKey ? new Date(p.startKey + 'T00:00:00') : new Date();
  const end = new Date(start); end.setDate(end.getDate() + Math.round(weeks * 7));
  const logged = FP.minutesSincePlan() / 60;
  const elapsedDays = Math.max(0, Math.floor((Date.now() - start.getTime()) / 864e5));
  const expected = elapsedDays * (mins * p.dpw / 7) / 60;
  return { hours, mins, weeks, end, logged, pct: clamp(logged / hours * 100, 0, 100), daysLeft: Math.ceil((end - new Date()) / 864e5), expected, delta: logged - expected, remaining: Math.max(0, hours - logged) };
}

/* ---------- tasks ---------- */
FP.nextUnit = () => {
  const L = FP.lvl(FP.curTheta() ?? 1), mastered = u => (S.units[u.id]?.best || 0) >= 80, tries = u => S.units[u.id]?.tries || 0;
  let c = UNITS.filter(u => u.lvl === L && !mastered(u));
  if (!c.length) c = UNITS.filter(u => u.lvl > L && !mastered(u));
  if (!c.length) c = UNITS.filter(u => !mastered(u));
  if (!c.length) c = UNITS.filter(u => u.lvl === L);
  return [...c].sort((a, b) => tries(a) - tries(b))[0];
};
const nItems = min => clamp(Math.round(min * 60 / 40), 4, 15);
FP.todayTasks = () => {
  const m = FP.dailyMinutes(), done = S.tasks[dayKey()] || {}, per = f => Math.max(3, Math.round(m * f)), unit = FP.nextUnit();
  const due = FP.dueWords().length, fresh = clamp(Math.round(m / 6), 3, 10);
  const ex = FP.examTasks().filter(t => !['sp2', 'wr'].includes(t.id) || m >= 40), pick = ex[new Date().getDay() % ex.length];
  const list = [
    { id: 'vocab', icon: 'cards', title: 'Vocabulary boost', sub: `${due ? due + ' to review · ' : ''}${fresh} new words`, min: per(.2), run: () => FP.vocabSession(fresh, 'vocab') },
    { id: 'grammar', icon: 'book', title: unit.title, sub: `Grammar lesson · ${FP.LV[unit.lvl]}`, min: per(.3), run: () => FP.go('#/lesson/' + unit.id + '/t') },
    { id: 'lab', icon: 'pen', title: 'Sentence lab', sub: 'Build correct sentences word by word', min: per(.15), run: () => FP.runLab(nItems(per(.15)), 'lab') }
  ];
  if (S.goal.type === 'general') list.push({ id: 'exam', icon: 'ear', title: 'Listening: dictation', sub: 'Type what you hear', min: per(.2), run: () => FP.runDict() });
  else list.push({ id: 'exam', icon: pick.icon, title: 'Exam drill: ' + pick.title, sub: S.goal.label + ' skill practice', min: Math.max(per(.25), pick.min), run: pick.run });
  if (S.mistakes.length) list.push({ id: 'fix', icon: 'redo', title: 'Mistake notebook', sub: plural(S.mistakes.length, 'item') + ' to fix', min: 5, run: () => FP.runFix(true) });
  return list.map(t => ({ ...t, done: !!done[t.id] }));
};
FP.runLab = (n = 8, taskId) => {
  const L = FP.lvl(FP.curTheta() ?? 1);
  let pool = UNITS.filter(u => u.lvl >= Math.max(0, L - 1) && u.lvl <= L + 1).flatMap(u => u.ex.filter(e => e.type === 'ord'));
  pool = pool.concat(PLACEMENT.filter(q => q.type === 'ord' && Math.abs(q.d - L) <= 1.2).map(({ d, skill, ...r }) => r));
  FP.study({ title: 'Sentence lab', items: shuffle(pool).slice(0, n), taskId, again: () => FP.runLab(n, taskId) });
};
FP.runQuick = (n = 10) => {
  const L = FP.lvl(FP.curTheta() ?? 1);
  const pool = UNITS.filter(u => u.lvl >= Math.max(0, L - 1) && u.lvl <= L + 1).flatMap(u => u.ex.filter(e => e.type !== 'ord'));
  FP.study({ title: 'Grammar quick-fire', items: shuffle(pool).slice(0, n), again: () => FP.runQuick(n) });
};
FP.runFix = (task) => {
  if (!S.mistakes.length) { FP.toast('Your notebook is empty — nice!'); return; }
  FP.study({ title: 'Mistake notebook', items: shuffle(S.mistakes).slice(0, 10), fixing: true, taskId: task ? 'fix' : null, autoSay: true, again: S.mistakes.length > 1 ? () => FP.runFix(task) : null });
};
FP.vocabSession = (newN = 5, taskId = 'vocab') => {
  const due = shuffle(FP.dueWords()).slice(0, 14), fresh = FP.newWords(newN);
  const mk = (w, mode, x = '') => ({ type: 'card', w, mode, id: 'c' + w.w + x, noLog: true });
  const queue = [...due.map(w => mk(w, S.srs[w.w].box >= 2 ? 'cloze' : 'flip')), ...fresh.map(w => mk(w, 'flip'))], rq = {};
  if (!queue.length) { FP.toast('Nothing due right now — come back tomorrow!'); return FP.go('#/vocab'); }
  FP.study({
    title: 'Vocabulary', total: () => queue.length, taskId, bonus: 5,
    getItem: (i, rs) => {
      const last = rs[rs.length - 1];
      if (last && last.requeue && i === rs.length && (rq[last.item.w.w] = (rq[last.item.w.w] || 0) + 1) <= 2) queue.push(mk(last.item.w, 'flip', 'r' + rq[last.item.w.w]));
      return queue[i];
    },
    again: () => FP.vocabSession(newN, taskId),
    secondary: null
  });
};

/* ---------- placement ---------- */
FP.startPlacement = () => {
  const start = [.3, 1.3, 2.3][S.self ?? 1], N = 22, used = new Set(), recent = [];
  FP.session({
    title: 'Level test', total: N, idk: true, feedback: false,
    getItem: (i, rs) => {
      if (i >= N) return null;
      const theta = i ? FP.mle(rs.map(r => ({ item: r.item, ok: r.ok, idk: r.idk })), start, 2.2) : start;
      const it = FP.pickNext(PLACEMENT, used, theta, recent); if (!it) return null;
      used.add(it.id); recent.push(it.skill); return it;
    },
    onExit: () => FP.go(S.onboard ? '#/home' : '#/welcome'),
    onFinish: rs => {
      const resp = rs.map(r => ({ item: r.item, ok: r.ok, idk: r.idk }));
      const theta = clamp(FP.mle(resp, start, 2.2), 0, 4.8), skills = {}, acc = {};
      for (const k of Object.keys(FP.SKILLS)) {
        const sub = resp.filter(r => r.item.skill === k);
        skills[k] = sub.length >= 2 ? clamp(FP.mle(sub, theta, .8), 0, 4.8) : theta;
        acc[k] = sub.length ? Math.round(sub.filter(r => r.ok).length / sub.length * 100) : null;
      }
      S.theta0 = theta; S.skills = skills;
      S.placement = { date: dayKey(), theta, correct: resp.filter(r => r.ok).length, n: resp.length, acc };
      S.placementHistory = [...(S.placementHistory || []), { date: dayKey(), theta }];
      S.plan.startKey = dayKey(); FP.save(); FP.go('#/result');
      setTimeout(FP.confetti, 400);
    }
  });
};

/* ---------- planner ---------- */
const INTENSITY = m => m <= 20 ? ['Light', 'info'] : m <= 45 ? ['Steady', 'ok'] : m <= 90 ? ['Focused', 'warn'] : m <= 150 ? ['Intense', 'bad'] : ['Very hard to sustain — consider a later deadline', 'bad'];
FP.planner = (host, o) => {
  const d = { type: S.goal.type, theta: S.goal.theta, label: S.goal.label, mode: S.plan.mode, minutes: S.plan.minutes, weeks: S.plan.weeks, dpw: S.plan.dpw };
  const t0 = () => S.theta0 ?? 1;
  const out = () => {
    const hours = FP.hoursNeeded(t0(), d.theta, d.type);
    let minutes = d.minutes, weeks = d.weeks;
    if (d.mode === 'minutes') weeks = FP.weeksFor(hours, d.minutes, d.dpw); else minutes = clamp(Math.ceil(hours * 60 / (d.weeks * d.dpw)), 5, 480);
    return { hours, minutes, weeks };
  };
  const draw = () => {
    const T = FP.TARGETS[d.type], r = out();
    host.innerHTML = `<div class="pl-tabs seg">${[['general', 'General English'], ['ielts', 'IELTS'], ['pte', 'PTE Academic']].map(([k, l]) => `<button data-t="${k}" class="${d.type === k ? 'sel' : ''}">${l}</button>`).join('')}</div>
    <div class="field"><span class="lbl">My target</span><div class="chips wrap">${T.map(([l, th]) => `<button class="pick ${th === d.theta ? 'sel' : ''}" data-th="${th}" data-l="${esc(l)}">${esc(l)}</button>`).join('')}</div></div>
    <div class="need"><div><b id="p-h">${Math.round(r.hours)}</b><small>study hours needed</small></div><div class="arrow">${FP.ic('arrow')}</div><div><b>${FP.lvlLabel(t0())}</b><small>from your level now</small></div></div>
    <div class="field"><div class="pl-tabs seg">${[['minutes', 'I choose my daily time'], ['weeks', 'I choose my deadline']].map(([k, l]) => `<button data-m="${k}" class="${d.mode === k ? 'sel' : ''}">${l}</button>`).join('')}</div>
      <div class="slide">${d.mode === 'minutes' ? `<label>Study time per day <b id="p-v">${d.minutes} min</b></label><input type="range" id="rg" min="10" max="240" step="5" value="${d.minutes}">` : `<label>I want to be ready in <b id="p-v">${d.weeks} weeks</b></label><input type="range" id="rg" min="2" max="104" step="1" value="${d.weeks}">`}</div></div>
    <div class="field"><span class="lbl">Study days per week</span><div class="chips">${[3, 4, 5, 6, 7].map(n => `<button class="pick ${n === d.dpw ? 'sel' : ''}" data-d="${n}">${n}</button>`).join('')}</div></div>
    <div class="outcome" id="p-o"></div>
    <button class="btn primary lg block" id="p-save">${esc(o.saveLabel || 'Save my plan')}</button>`;
    upd();
    $$('[data-t]', host).forEach(b => b.onclick = () => { d.type = b.dataset.t; const def = FP.TARGETS[d.type]; d.theta = (d.type === 'general' ? def[2] : def[3])[1]; d.label = (d.type === 'general' ? def[2] : def[3])[0]; draw(); });
    $$('[data-th]', host).forEach(b => b.onclick = () => { d.theta = +b.dataset.th; d.label = b.dataset.l; draw(); });
    $$('[data-m]', host).forEach(b => b.onclick = () => { if (b.dataset.m === d.mode) return; const r0 = out(); d.mode = b.dataset.m; if (d.mode === 'minutes') d.minutes = clamp(Math.round(r0.minutes / 5) * 5, 10, 240); else d.weeks = clamp(Math.round(r0.weeks), 2, 104); draw(); });
    $$('[data-d]', host).forEach(b => b.onclick = () => { d.dpw = +b.dataset.d; draw(); });
    $('#rg', host).oninput = e => { d[d.mode] = +e.target.value; upd(); };
    $('#p-save', host).onclick = () => {
      const r = out(); S.goal = { type: d.type, theta: d.theta, label: d.label };
      S.plan = { ...S.plan, mode: d.mode, minutes: d.mode === 'minutes' ? d.minutes : r.minutes, weeks: d.mode === 'weeks' ? d.weeks : Math.round(r.weeks * 10) / 10, dpw: d.dpw, startKey: S.plan.startKey || dayKey() };
      FP.save(); o.onSave();
    };
  };
  const upd = () => {
    const r = out(), [il, ic] = INTENSITY(r.minutes), end = new Date(); end.setDate(end.getDate() + Math.round(r.weeks * 7));
    const months = r.weeks / 4.345;
    const miles = [1, 2, 3, 4].filter(l => l > t0() + .2 && l <= d.theta + .01).map(l => { const h = FP.H(l) - FP.H(t0()), w = h * 60 / (r.minutes * d.dpw); return `<li><b>${FP.LV[l]}</b><span>in about ${w < 1.5 ? 'a week' : w < 9 ? Math.round(w) + ' weeks' : (w / 4.345).toFixed(1) + ' months'}</span></li>`; }).join('');
    $('#p-h', host).textContent = Math.round(r.hours);
    const v = $('#p-v', host); if (v) v.textContent = d.mode === 'minutes' ? d.minutes + ' min' : d.weeks + ' weeks';
    $('#p-o', host).innerHTML = `<div class="out-main"><div><b>${r.minutes}</b><small>min / day</small></div><div class="x">×</div><div><b>${d.dpw}</b><small>days / week</small></div><div class="x">=</div><div><b>${r.weeks < 10 ? r.weeks.toFixed(1) : Math.round(r.weeks)}</b><small>weeks (${months.toFixed(1)} months)</small></div></div><p>You would reach <b>${esc(d.label)}</b> around <b>${fmtDate(end)}</b>. <span class="badge ${ic}">${il}</span></p>${r.minutes > 120 ? `<p class="muted">More realistic: at <b>60 min a day</b> you would get there in about <b>${Math.round(r.hours * 60 / (60 * d.dpw))} weeks</b>.</p>` : ''}${miles ? `<ul class="miles">${miles}</ul>` : ''}<p class="muted sm">An estimate from the hours Cambridge suggests per CEFR level${d.type !== 'general' ? ', plus ~25 hours of exam technique' : ''}. Real progress depends on how focused your study is — the daily plan is built to make every minute count.</p>`;
  };
  draw();
};

/* ---------- views ---------- */
const DEADLINES = [[0, 'Not sure yet'], [4, '1 month'], [8, '2 months'], [13, '3 months'], [26, '6 months'], [52, '1 year']];
function viewWelcome() {
  const def = t => (t === 'general' ? FP.TARGETS.general[2] : FP.TARGETS[t][3]);
  const st = { goal: S.goal.type, theta: S.goal.theta, label: S.goal.label, self: S.self ?? 1, weeks: S.plan.mode === 'weeks' ? S.plan.weeks : 0 };
  $('#app').innerHTML = `<div class="welcome"><div class="wl in"><img class="welcome-hero" src="assets/hero.jpg" alt="" onerror="this.remove()"><div class="logo-big">${LOGO_IMG.replace('assets/logo.png', 'assets/logo.png')}</div><div class="eyebrow">FluentPath</div><h1>English that fits <em>your</em> life.</h1><p class="lead">Take a short adaptive test, get a plan built around your deadline, then learn with spaced repetition, sentence building, listening and speaking — all in one place.</p>
  <div class="field"><label class="lbl" for="nm">What should we call you?</label><input class="inp" id="nm" placeholder="Your name" value="${esc(S.name)}" maxlength="24"></div>
  <div class="field"><span class="lbl">What are you aiming for?</span><div class="cards3">${[['general', 'General English', 'Speak and write with confidence'], ['ielts', 'IELTS', 'Academic or General training'], ['pte', 'PTE Academic', 'Computer-based exam skills']].map(([k, t, s2]) => `<button class="gcard" data-g="${k}"><b>${t}</b><small>${s2}</small></button>`).join('')}</div></div>
  <div class="field"><span class="lbl">Your target</span><div class="chips wrap" id="tg"></div></div>
  <div class="field"><span class="lbl">When do you want to be ready?</span><div class="chips wrap">${DEADLINES.map(([w, l]) => `<button class="pick" data-w="${w}">${l}</button>`).join('')}</div><p class="muted sm">After the test we tell you how many minutes a day that needs, and whether it is realistic.</p></div>
  <div class="field"><span class="lbl">How is your English today?</span><div class="chips wrap">${['Just starting', 'I know the basics', 'Fairly confident'].map((t, i) => `<button class="pick" data-s="${i}">${t}</button>`).join('')}</div></div>
  <button class="btn primary lg block" id="go">Take the level test ${FP.ic('arrow')}</button><p class="muted sm center">22 questions · about 10 minutes · it adapts to your answers. “I don't know” is always fine — guessing blurs your result.</p></div>${FOOTER}</div>`;
  const mark = () => {
    $('#tg').innerHTML = FP.TARGETS[st.goal].map(([l, th]) => `<button class="pick ${th === st.theta ? 'sel' : ''}" data-th="${th}" data-l="${esc(l)}">${esc(l)}</button>`).join('');
    $$('[data-th]').forEach(b => b.onclick = () => { st.theta = +b.dataset.th; st.label = b.dataset.l; mark(); });
    $$('[data-g]').forEach(b => b.classList.toggle('sel', b.dataset.g === st.goal));
    $$('[data-s]').forEach(b => b.classList.toggle('sel', +b.dataset.s === st.self));
    $$('[data-w]').forEach(b => b.classList.toggle('sel', +b.dataset.w === st.weeks));
  };
  if (!FP.TARGETS[st.goal].some(t => t[1] === st.theta)) { const d = def(st.goal); st.theta = d[1]; st.label = d[0]; }
  $$('[data-g]').forEach(b => b.onclick = () => { if (st.goal !== b.dataset.g) { st.goal = b.dataset.g; const d = def(st.goal); st.theta = d[1]; st.label = d[0]; } mark(); });
  $$('[data-s]').forEach(b => b.onclick = () => { st.self = +b.dataset.s; mark(); });
  $$('[data-w]').forEach(b => b.onclick = () => { st.weeks = +b.dataset.w; mark(); });
  mark();
  $('#go').onclick = () => {
    S.name = $('#nm').value.trim() || 'friend'; S.self = st.self;
    S.goal = { type: st.goal, label: st.label, theta: st.theta };
    if (st.weeks) { S.plan.mode = 'weeks'; S.plan.weeks = st.weeks; } else S.plan.mode = 'minutes';
    FP.save(); FP.startPlacement();
  };
}

function viewResult() {
  if (S.theta0 == null) return FP.go('#/welcome');
  const th = S.theta0, L = FP.lvl(th), sk = S.skills, entries = Object.entries(sk).sort((a, b) => a[1] - b[1]), weak = entries[0], strong = entries[entries.length - 1];
  $('#app').innerHTML = `<div class="welcome"><div class="wl wide in"><div class="eyebrow">Your starting level</div>
  <div class="reveal"><img class="lv-badge" src="assets/level-${FP.LV[L].toLowerCase()}.png" alt="" onload="this.nextElementSibling.style.display='none'" onerror="this.remove()"><div class="big-lv" style="--c:${FFC(L)}">${FP.LV[L]}${th > 4.4 ? '<sup>+</sup>' : ''}</div><div><h1>${FP.LVN[L]}</h1><p class="muted">${FP.lvlLabel(th)} · ${S.placement.correct} of ${S.placement.n} correct</p></div></div>
  <p class="lead">${LEVEL_TEXT[L]}</p>${ladder(th, S.goal.theta)}
  <div class="skills">${Object.entries(sk).map(([k, v]) => `<div class="sk"><span>${FP.SKILLS[k]}</span><div class="sk-bar"><i style="width:${clamp(v / 4.6 * 100, 6, 100)}%"></i></div><b>${FP.LV[FP.lvl(v)]}</b></div>`).join('')}</div>
  <p class="muted">${strong[1] - weak[1] < .35 ? 'Your four skills are quite balanced, so your plan will train them evenly.' : `Strongest: <b>${FP.SKILLS[strong[0]]}</b>. Needs the most attention: <b>${FP.SKILLS[weak[0]]}</b> — your daily plan will lean on it.`}</p>
  <h2 class="mt">Now let's build your plan</h2><p class="muted">Choose how much time you can give, or when you want to be ready — the other side is calculated for you.</p><div class="card pad" id="pl"></div></div></div>`;
  FP.planner($('#pl'), { saveLabel: S.onboard ? 'Save and go home' : 'Save my plan and start', onSave: () => { S.onboard = true; FP.save(); FP.go('#/home'); } });
}
const FFC = l => FP.LVC ? FP.LVC[l] : ['#2ee6a6', '#5ad1ff', '#7c5cff', '#ff8ad8', '#ffc857'][l];

function viewHome() {
  const th = FP.curTheta(), pi = planInfo(), tasks = FP.todayTasks(), nd = tasks.filter(t => t.done).length;
  const hr = new Date().getHours(), greet = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
  const head = nd === tasks.length ? 'Today’s plan is done. Brilliant.' : FP.streak() > 0 ? 'Keep the streak alive.' : 'Let’s make today count.';
  const status = pi.delta >= 0 ? `<span class="badge ok">On track</span> ${pi.delta > .5 ? 'You are ahead of schedule.' : ''}` : `<span class="badge warn">${Math.abs(pi.delta).toFixed(1)} h behind</span> A slightly longer session today catches you up.`;
  shell('home', `${greet}, ${esc(S.name)}`, `
  <section class="hero card"><div class="hero-l"><div class="eyebrow">${head}</div><h2 class="h1">You’re at <span class="grad">${FP.lvlLabel(th)}</span>, heading to <span class="grad">${esc(S.goal.label)}</span></h2><p class="muted">About <b>${Math.round(pi.remaining)} study hours</b> to go · ${pi.daysLeft > 0 ? plural(pi.daysLeft, 'day') + ' until your target date (' + fmtDate(pi.end) + ')' : 'target date passed — extend it in My Plan'}</p><p class="status">${status}</p>${pi.mins > 120 ? `<p class="warnbox"><span class="badge bad">Heavy pace</span> ${pi.mins} min a day is very hard to keep up. <a class="grad" href="#/plan"><b>Adjust your plan</b></a></p>` : ''}<div class="chips"><span class="chip">${FP.ic('flame')} ${plural(FP.streak(), 'day')} streak</span><span class="chip">${FP.ic('bolt')} ${S.xp} XP</span><span class="chip">${FP.ic('clock')} ${Math.round(FP.todayMin())}/${pi.mins} min today</span></div>${ladder(th, S.goal.theta)}</div><div class="hero-r">${FP.ring(pi.pct, 170, 14, Math.round(pi.pct) + '%', 'of the way')}</div></section>
  <section class="cols"><div class="card pad"><div class="card-h"><h2>Today’s plan</h2><span class="muted">${nd}/${tasks.length} done · ~${pi.mins} min</span></div><div class="tasks">${tasks.map((t, i) => `<div class="task ${t.done ? 'done' : ''}"><div class="task-i">${FP.ic(t.done ? 'check' : t.icon)}</div><div class="task-b"><b>${esc(t.title)}</b><small>${esc(t.sub)}</small></div><span class="muted sm">~${t.min} min</span><button class="btn ${t.done ? 'ghost' : 'primary'} sm" data-task="${i}">${t.done ? 'Again' : 'Start'}</button></div>`).join('')}</div></div>
  <div class="card pad"><div class="card-h"><h2>Last 14 days</h2><span class="muted">${Math.round([...Array(7)].reduce((a, _, i) => { const d = new Date(); d.setDate(d.getDate() - i); return a + (S.log[dayKey(d)] || 0); }, 0))} min this week</span></div>${weekBars(14, pi.mins)}</div></section>
  <section class="cols3"><div class="card pad"><div class="card-h"><h2>Skill map</h2></div>${radar(S.skills)}</div>
  <div class="card pad"><div class="card-h"><h2>Vocabulary</h2></div><div class="bignum">${FP.dueWords().length}<small>words due for review</small></div><p class="muted">${Object.keys(S.srs).length} words started · ${Object.values(S.srs).filter(s => s.box >= 4).length} well known</p><a class="btn ghost" href="#/vocab">Open vocabulary</a></div>
  <div class="card pad"><div class="card-h"><h2>Mistake notebook</h2></div><div class="bignum">${S.mistakes.length}<small>things to fix</small></div><p class="muted">Every question you miss lands here, then comes back until you get it right.</p><button class="btn ghost" id="fixbtn">Fix them now</button></div></section>`,
    `${Math.round(FP.todayMin())} of ${pi.mins} minutes done today`);
  $$('[data-task]').forEach(b => b.onclick = () => tasks[+b.dataset.task].run());
  $('#fixbtn').onclick = () => FP.runFix(false);
}

function viewLearn() {
  const L = FP.lvl(FP.curTheta() ?? 1), rec = FP.nextUnit();
  const html = FP.LV.map((lv, l) => {
    const us = UNITS.filter(u => u.lvl === l), mastered = us.filter(u => (S.units[u.id]?.best || 0) >= 80).length;
    return `<details class="lvl" ${Math.abs(l - L) <= 1 ? 'open' : ''}><summary><span class="chip lv${l}">${lv}</span><b>${FP.LVN[l]}</b><span class="muted">${mastered}/${us.length} mastered</span></summary><div class="units">${us.map(u => { const s = S.units[u.id]; return `<a class="unit ${s?.best >= 80 ? 'mastered' : ''}" href="#/lesson/${u.id}"><div class="u-ic">${u.icon}</div><div class="u-b"><b>${esc(u.title)}</b><small>${s ? 'Best ' + s.best + '% · ' + plural(s.tries, 'try') : 'Not started'}</small></div>${u.id === rec.id ? '<span class="badge info">Recommended</span>' : s?.best >= 80 ? `<span class="star">${FP.ic('star')}</span>` : ''}</a>`; }).join('')}</div></details>`;
  }).join('');
  shell('learn', 'Learn', `<p class="muted lead-s">Grammar in short, focused units: a clear rule, real examples, then practice. Master a unit with 80% or more.</p>${html}`);
}

function viewLesson(id, asTask) {
  const u = UNITS.find(x => x.id === id); if (!u) return FP.go('#/learn');
  const s = S.units[u.id];
  shell('learn', `${u.icon} ${esc(u.title)}`, `<a class="back" href="#/learn">← All units</a><div class="card pad lesson"><span class="chip lv${u.lvl}">${FP.LV[u.lvl]} · ${FP.LVN[u.lvl]}</span><h3>The rule</h3><div class="rule">${u.rule}</div><h3>See it in use</h3><div class="exs">${u.examples.map((e, i) => `<div class="exr"><button class="icon-btn" data-say="${i}" title="Listen">${FP.ic('vol')}</button><span>${esc(e)}</span></div>`).join('')}</div><div class="tip"><b>Technique:</b> say each example aloud once. Speaking a pattern builds it into memory far faster than only reading it.</div><div class="row gap"><button class="btn primary lg" id="st">Start practice · ${u.ex.length} questions</button>${s ? `<span class="muted">Best ${s.best}% · ${plural(s.tries, 'try')}</span>` : ''}</div></div>`);
  $$('[data-say]').forEach(b => b.onclick = () => FP.speak(u.examples[+b.dataset.say].replace(/ · /g, '. ')));
  $('#st').onclick = () => practiceUnit(u, asTask);
}
function practiceUnit(u, asTask) {
  FP.study({
    title: u.title, items: shuffle(u.ex), taskId: asTask ? 'grammar' : null, autoSay: true,
    again: () => practiceUnit(u, asTask),
    after: rs => { const pct = Math.round(rs.reduce((a, r) => a + r.score, 0) / rs.length * 100), p = S.units[u.id] || { best: 0, tries: 0 }; S.units[u.id] = { best: Math.max(p.best, pct), tries: p.tries + 1, last: pct }; },
    extra: rs => { const pct = Math.round(rs.reduce((a, r) => a + r.score, 0) / rs.length * 100); return pct >= 80 ? `<div class="banner ok"><b>Unit mastered!</b> Come back in a few days to keep it fresh.</div>` : `<div class="banner bad"><b>Almost.</b> Re-read the rule, then try again for 80%+.</div>`; }
  });
}

function viewVocab() {
  const due = FP.dueWords().length, started = Object.keys(S.srs).length, known = Object.values(S.srs).filter(s => s.box >= 4).length;
  const lv = FP.LV.map((l, i) => { const ws = VOCAB.filter(w => w.l === i), n = ws.filter(w => S.srs[w.w]).length; return `<div class="card pad vlv"><div class="card-h"><span class="chip lv${i}">${l}</span><span class="muted">${n}/${ws.length} started</span></div><div class="wchips">${ws.map(w => { const s = S.srs[w.w]; return `<button class="wc b${s ? Math.min(s.box, 5) : 'x'}" data-w="${esc(w.w)}">${esc(w.w)}</button>`; }).join('')}</div></div>`; }).join('');
  shell('vocab', 'Vocabulary', `<section class="hero card slim"><div class="hero-l"><div class="eyebrow">Spaced repetition</div><h2 class="h1">${due ? `<span class="grad">${due}</span> word${due === 1 ? '' : 's'} ready to review` : 'You’re all caught up'}</h2><p class="muted">Words come back right before you would forget them. Newer words show a sentence with a gap — recalling beats re-reading.</p><div class="row gap"><button class="btn primary lg" id="rv">${due ? 'Review now' : 'Learn 8 new words'}</button><button class="btn ghost" id="nw">+ 8 new words</button></div></div><div class="hero-r stats3"><div><b>${started}</b><small>started</small></div><div><b>${known}</b><small>well known</small></div><div><b>${VOCAB.length}</b><small>in the course</small></div></div></section><div id="wd" class="card pad wdetail" hidden></div><div class="legend"><span><i class="wc bx"></i>new</span><span><i class="wc b0"></i>learning</span><span><i class="wc b2"></i>getting there</span><span><i class="wc b4"></i>strong</span></div>${lv}`);
  $('#rv').onclick = () => FP.vocabSession(due ? 4 : 8, 'vocab');
  $('#nw').onclick = () => FP.vocabSession(8, 'vocab');
  $$('[data-w]').forEach(b => b.onclick = () => { const w = VOCAB.find(x => x.w === b.dataset.w), el = $('#wd'); el.hidden = false; el.innerHTML = `<div class="row between"><div><h3>${esc(w.w)} <span class="muted sm">${esc(w.pos)}</span></h3><p>${esc(w.m)}${S.sinhala && w.si ? ` · <span class="si">${esc(w.si)}</span>` : ''}</p><p class="muted">“${esc(w.ex)}”</p></div><button class="icon-btn" id="ws">${FP.ic('vol')}</button></div>`; $('#ws').onclick = () => FP.speak(w.w + '. ' + w.ex); el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); });
}

function viewPractice() {
  const tiles = [
    ['pen', 'Sentence lab', 'Rebuild sentences word by word. Trains word order — the heart of fluent grammar.', () => FP.runLab(10)],
    ['bolt', 'Grammar quick-fire', 'Ten mixed questions from your level. Fast, low-pressure.', () => FP.runQuick(10)],
    ['redo', `Mistake notebook (${S.mistakes.length})`, 'Everything you got wrong, until you get it right.', () => FP.runFix(false)],
    ['ear', 'Dictation', 'Listen and type. Sharpens spelling and listening.', () => FP.runDict()],
    ['mic', 'Shadowing', 'Hear a sentence, say it back. Builds natural rhythm and pronunciation.', () => FP.runRepeat()],
    ['target', 'Retake level test', 'See how far you have come. Resets your progress baseline.', () => { if (confirm('Retake the level test? Your plan stays, but your starting level will be updated.')) FP.startPlacement(); }]
  ];
  shell('practice', 'Practice', `<div class="grid">${tiles.map(([i, t, d], k) => `<button class="tile" data-k="${k}"><span class="t-ic">${FP.ic(i)}</span><b>${t}</b><small>${d}</small></button>`).join('')}</div>`);
  $$('[data-k]').forEach(b => b.onclick = tiles[+b.dataset.k][3]);
}

function viewExam() {
  const tasks = FP.examTasks(), mine = S.goal.type === 'ielts' ? 'IELTS' : S.goal.type === 'pte' ? 'PTE' : null;
  shell('exam', 'Exam Lab', `<p class="muted lead-s">Real exam task types, practised the smart way — short, focused and with instant feedback. ${mine ? `Highlighted: your <b>${mine}</b> goal.` : 'Pick any — general English learners benefit from these too.'}</p><div class="grid">${tasks.map((t, k) => `<button class="tile ${mine && (t.exam === mine || t.exam === 'Both') ? 'hl' : ''}" data-k="${k}"><span class="t-ic">${FP.ic(t.icon)}</span><span class="tag">${t.exam === 'Both' ? 'IELTS · PTE' : t.exam}</span><b>${t.title}</b><small>${t.desc}</small><em>~${t.min} min</em></button>`).join('')}</div><div class="card pad note"><b>About speaking tasks:</b> speech recognition works best in Chrome or Edge with a microphone. Your voice stays in your browser — nothing is uploaded.</div>`);
  $$('[data-k]').forEach(b => b.onclick = tasks[+b.dataset.k].run);
}

function viewProgress() {
  const pi = planInfo(), th = FP.curTheta(), tot = Object.values(S.log).reduce((a, b) => a + b, 0);
  const um = UNITS.filter(u => (S.units[u.id]?.best || 0) >= 80).length;
  shell('progress', 'Progress', `<section class="stat4"><div class="card pad"><b>${(tot / 60).toFixed(1)}</b><small>hours studied</small></div><div class="card pad"><b>${FP.streak()}</b><small>day streak</small></div><div class="card pad"><b>${um}/${UNITS.length}</b><small>units mastered</small></div><div class="card pad"><b>${S.xp}</b><small>XP earned</small></div></section>
  <section class="cols"><div class="card pad"><div class="card-h"><h2>Estimated level</h2><span class="muted">${FP.lvlLabel(th)}</span></div>${ladder(th, S.goal.theta)}<p class="muted sm">Your level estimate moves forward with the hours you study. Retake the level test every ~40 hours to confirm it.</p>${(S.placementHistory || []).length ? `<div class="hist">${S.placementHistory.map(h => `<span class="chip">${h.date} · ${FP.lvlLabel(h.theta)}</span>`).join('')}</div>` : ''}</div><div class="card pad"><div class="card-h"><h2>Skill map</h2></div>${radar(S.skills)}</div></section>
  <section class="card pad"><div class="card-h"><h2>Study time · last 30 days</h2><span class="muted">goal ${pi.mins} min/day</span></div>${weekBars(30, pi.mins)}</section>
  <section class="card pad"><div class="card-h"><h2>Grammar units</h2></div><div class="umap">${UNITS.map(u => { const s = S.units[u.id]; return `<a href="#/lesson/${u.id}" class="um ${s ? (s.best >= 80 ? 'm' : 'p') : ''}" title="${esc(u.title)}"><span class="chip lv${u.lvl}">${FP.LV[u.lvl]}</span><b>${esc(u.title)}</b><small>${s ? s.best + '%' : '—'}</small></a>`; }).join('')}</div></section>`);
}

function viewPlan() {
  const pi = planInfo();
  shell('plan', 'My Plan', `<section class="cols"><div class="card pad"><div class="card-h"><h2>Your journey</h2></div>${ladder(FP.curTheta(), S.goal.theta)}<div class="need"><div><b>${Math.round(pi.hours)} h</b><small>total needed</small></div><div><b>${pi.logged.toFixed(1)} h</b><small>studied so far</small></div><div><b>${Math.round(pi.remaining)} h</b><small>to go</small></div></div><p class="muted">Target date: <b>${fmtDate(pi.end)}</b> ${pi.daysLeft > 0 ? '(' + plural(pi.daysLeft, 'day') + ' left)' : '(passed)'} · ${pi.delta >= 0 ? 'on track' : Math.abs(pi.delta).toFixed(1) + ' h behind'}</p></div><div class="card pad"><div class="card-h"><h2>Change my plan</h2></div><div id="pl"></div></div></section>`);
  FP.planner($('#pl'), { saveLabel: 'Update plan', onSave: () => { FP.toast('Plan updated'); FP.route(); } });
}

function viewSettings() {
  shell('settings', 'Settings', `<div class="card pad set"><h3>Account and cloud backup</h3><div id="acct">${FP.accountHTML()}</div></div><div class="card pad set"><div class="srow"><label for="nm">Your name</label><input class="inp" id="nm" value="${esc(S.name)}" maxlength="24"></div>
  <div class="srow"><label>Sinhala meanings in vocabulary</label><button class="tog ${S.sinhala ? 'on' : ''}" id="tsi"><i></i></button></div>
  <div class="srow"><label>Sound effects</label><button class="tog ${S.sound ? 'on' : ''}" id="tso"><i></i></button></div>
  <div class="srow"><label for="vc">Listening accent</label><select class="inp" id="vc">${[['en-GB', 'British'], ['en-US', 'American'], ['en-AU', 'Australian'], ['en-IN', 'Indian']].map(([k, l]) => `<option value="${k}" ${S.voice === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
  <div class="srow"><label for="rt">Speaking speed <b id="rtv">${S.rate}×</b></label><input type="range" id="rt" min="0.6" max="1.2" step="0.05" value="${S.rate}"></div>
  <div class="srow"><label>Hear it</label><button class="btn ghost sm" id="tst">${FP.ic('vol')} Test voice</button></div></div>
  <div class="card pad set"><h3>Your data</h3><p class="muted">Everything is saved in this browser only. Export a backup so you never lose your progress.</p><div class="row gap"><button class="btn ghost" id="ex">Export backup</button><label class="btn ghost">Import backup<input type="file" id="im" accept="application/json" hidden></label><button class="btn ghost danger" id="rs">Reset everything</button></div></div>`);
  $('#nm').onchange = e => { S.name = e.target.value.trim() || 'friend'; FP.save(); };
  $('#tsi').onclick = e => { S.sinhala = !S.sinhala; e.currentTarget.classList.toggle('on', S.sinhala); FP.save(); };
  $('#tso').onclick = e => { S.sound = !S.sound; e.currentTarget.classList.toggle('on', S.sound); FP.save(); FP.sfx(true); };
  $('#vc').onchange = e => { S.voice = e.target.value; FP.save(); };
  $('#rt').oninput = e => { S.rate = +e.target.value; $('#rtv').textContent = S.rate + '×'; FP.save(); };
  $('#tst').onclick = () => FP.speak('Hello! This is how your listening practice will sound.');
  $('#ex').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' })); a.download = 'fluentpath-backup-' + dayKey() + '.json'; a.click(); };
  $('#im').onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { try { const o = JSON.parse(t); if (o.v !== 1) throw 0; localStorage.setItem(FP.KEY, t); location.reload(); } catch (x) { FP.toast('That file is not a FluentPath backup'); } }); };
  $('#rs').onclick = () => { if (confirm('Erase all progress and start over?')) { localStorage.removeItem(FP.KEY); location.hash = ''; location.reload(); } };
}

/* ---------- boot ---------- */
applyTheme();
FP.route();
