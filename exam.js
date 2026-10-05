'use strict';
/* FluentPath — Exam Lab: PTE and IELTS style task types */

const EXAM = {
  repeat: [
    'The library closes at six o\'clock on weekdays.',
    'Students must submit their assignments before the deadline.',
    'The lecture on climate change has been moved to room twelve.',
    'Please remember to bring your identification to the examination.',
    'Recent research suggests that regular exercise improves concentration.',
    'The university offers a wide range of scholarships to international students.',
    'Many companies are now encouraging their employees to work from home.',
    'Although the experiment failed, the team learned valuable lessons about the process.'
  ],
  dict: [
    'Global warming is affecting weather patterns around the world.',
    'The professor asked the students to submit their essays by Friday.',
    'Public transport reduces traffic congestion in large cities.',
    'Scientists have developed a new method for detecting early signs of disease.',
    'The committee will review all applications before making a final decision.',
    'Economic growth often depends on investment in education and infrastructure.',
    'Students are advised to consult their supervisors regularly.',
    'Renewable energy sources are becoming increasingly affordable.'
  ],
  read: [
    'Urban planning plays a vital role in shaping how people live and work. Well-designed cities provide efficient public transport, green spaces and affordable housing, which together improve the quality of life for residents.',
    'Sleep is essential for good health. During sleep, the body repairs itself and the brain organises memories. Adults who regularly sleep less than six hours are more likely to experience stress, weight gain and difficulty concentrating.',
    'The invention of the printing press transformed the way information was shared. Books became cheaper and more widely available, which encouraged literacy and the spread of new ideas across Europe.'
  ],
  fib: [
    'Many people believe that technology has made life [[easier;easy;ease;easily|0]]. However, it has also created [[new;news;newly;newer|0]] problems. For example, young people now spend [[much;many;few;every|0]] time online, which can [[affect;effect;affects;effects|0]] their sleep and concentration.',
    'Climate change is one of the most [[serious;seriously;series;seriousness|0]] issues facing the world today. Governments must [[take;make;do;put|0]] action quickly, otherwise the [[consequences;consequence;consequent;consequently|0]] could be [[irreversible;irresponsible;irregular;irrelevant|0]].',
    'Studying abroad can be a [[rewarding;rewarded;reward;rewards|0]] experience. Students often [[gain;win;earn;catch|0]] independence and learn to [[adapt;adopt;adept;adapted|0]] to new cultures, although the first few months can be [[challenging;challenge;challenged;challenges|0]].'
  ],
  reorder: [
    ['Many cities are struggling with heavy traffic.', 'One solution is to improve public transport.', 'Buses and trains can carry far more people than private cars.', 'As a result, fewer cars would be on the road, and air quality would improve.'],
    ['The first mobile phones were large and expensive.', 'Over the years, they became smaller and cheaper.', 'Today, most people use smartphones for much more than calls.', 'They have become essential tools for work, study and entertainment.'],
    ['Learning a language requires regular practice.', 'Studying for ten minutes every day is better than studying for three hours once a week.', 'This is because the brain remembers information more effectively through repetition.', 'Therefore, a consistent routine is the key to success.']
  ],
  tfng: [
    { passage: 'The city of Venice was built on more than 100 small islands. Because of its canals, there are no cars in the historic centre. Every year, about 25 million tourists visit, which has made life difficult for residents. As a result, the population has fallen from 175,000 in 1951 to about 50,000 today. The authorities have recently introduced an entrance fee for day visitors.', st: [['Venice has no cars in its historic centre.', 0], ['Tourism has made life harder for local people.', 0], ['The population of Venice is now below 60,000.', 0], ['The entrance fee was introduced by the national government.', 2], ['Venice is built on a single large island.', 1]] },
    { passage: 'Honey bees communicate through a dance. A bee that finds food returns to the hive and performs a “waggle dance”. The angle of the dance shows the direction of the food relative to the sun, and the duration shows the distance. Scientists first decoded this system in the 1940s. Some researchers believe that other insects may also use simple forms of communication, but this has not been proven.', st: [['Bees use dance to share information about food.', 0], ['The length of the dance shows how far away the food is.', 0], ['The dance was first understood in the 1960s.', 1], ['Ants use a similar dance to bees.', 2]] }
  ],
  cues: [
    { t: 'Describe a teacher who influenced you.', p: ['who the teacher was', 'what subject they taught', 'what they did that was special', 'and explain why they influenced you'] },
    { t: 'Describe a place you would like to visit.', p: ['where it is', 'how you know about it', 'what you would do there', 'and explain why you want to go'] },
    { t: 'Describe a time when you helped someone.', p: ['who you helped', 'what the problem was', 'how you helped', 'and explain how you felt afterwards'] },
    { t: 'Describe a book or film you enjoyed recently.', p: ['what it was', 'what it was about', 'who you watched or read it with', 'and explain why you enjoyed it'] },
    { t: 'Describe an important decision you made.', p: ['what the decision was', 'when you made it', 'who helped you decide', 'and explain why it was important'] },
    { t: 'Describe a skill you would like to learn.', p: ['what the skill is', 'why you want to learn it', 'how you would learn it', 'and explain how it would help you'] }
  ],
  essays: [
    'Some people believe that university education should be free for everyone. Others think students should pay for it. Discuss both views and give your own opinion.',
    'Many people now work from home. What are the advantages and disadvantages of this trend?',
    'Children spend too much time on screens. What problems does this cause, and what can be done about it?',
    'Some think governments should spend money on public transport rather than building new roads. To what extent do you agree or disagree?',
    'In many countries, people are living longer. Is this a positive or a negative development?',
    'Technology is making people less sociable. Do you agree or disagree?'
  ]
};

/* ---------- renderers ---------- */
FP.R.speak = (host, it, cb) => {
  const rep = it.mode === 'repeat';
  host.innerHTML = `<div class="eyebrow">${rep ? 'Repeat sentence' : 'Read aloud'}</div>${rep
    ? `<div class="row gap"><button class="btn primary" id="pl">${FP.ic('vol')} Listen</button><button class="btn ghost" id="pl2">Slower</button></div><p class="muted">Listen, then tap the microphone and say it exactly as you heard it.</p>`
    : `<div class="passage big">${esc(it.text)}</div><p class="muted">Read it aloud clearly. Tap the microphone, then tap again to stop.</p>`}
  <div class="micbox"><button class="mic" id="mic" aria-label="Record">${FP.ic('mic')}</button><div class="muted" id="mst">Tap to speak</div></div>
  <textarea class="inp" id="tx" rows="2" placeholder="${FP.SR ? 'Your words will appear here — you can correct them' : 'Speech recognition is not available in this browser (try Chrome or Edge). Type what you said instead.'}"></textarea><div id="out"></div>`;
  const tx = $('#tx', host), mic = $('#mic', host), mst = $('#mst', host);
  const play = r => FP.speak(it.text, { rate: r, lang: 'en-US' });
  if (rep) { $('#pl', host).onclick = () => play(.95); $('#pl2', host).onclick = () => play(.7); setTimeout(() => play(.95), 400); }
  let rec = null;
  const stop = () => { if (rec) { rec.stop(); rec = null; FP._rec = null; } mic.classList.remove('on'); mst.textContent = 'Tap to speak again'; };
  mic.onclick = () => {
    if (rec) return stop();
    if (!FP.SR) { tx.focus(); return; }
    FP.stopMedia(); tx.value = '';
    rec = FP.listen({ result: t => { tx.value = t; cb.ready(!!t.trim()); }, error: e => { mst.textContent = e === 'not-allowed' ? 'Microphone blocked — allow it in the address bar' : 'Mic error: ' + e; stop(); }, end: () => stop() });
    FP._rec = rec;
    if (rec) { mic.classList.add('on'); mst.textContent = 'Listening… tap to stop'; }
  };
  tx.oninput = () => cb.ready(!!tx.value.trim());
  return {
    check: () => {
      if (!tx.value.trim()) return null; stop();
      const al = FP.align(it.text, tx.value);
      return { ok: al.acc >= .8, score: al.acc, expected: it.text, why: `${al.got} of ${al.total} words matched${al.extra ? ` · ${al.extra} extra` : ''}.`, say: it.text, _al: al };
    },
    lock: r => { $('#out', host).innerHTML = `<div class="diff">${FP.diffHTML(r._al)}</div>`; tx.disabled = true; mic.disabled = true; }
  };
};

FP.R.dict = (host, it, cb) => {
  let plays = 0;
  host.innerHTML = `<div class="eyebrow">Write from dictation</div><div class="row gap"><button class="btn primary" id="pl">${FP.ic('vol')} Play</button><button class="btn ghost" id="pl2">Slower</button><span class="muted" id="pc2"></span></div><p class="muted">Type exactly what you hear. Spelling counts.</p><textarea class="inp" id="tx" rows="3" placeholder="Type the sentence here"></textarea><div id="out"></div>`;
  const tx = $('#tx', host), pc = $('#pc2', host);
  const play = r => { plays++; pc.textContent = plays + (plays === 1 ? ' play' : ' plays'); FP.speak(it.text, { rate: r, lang: 'en-US' }); };
  $('#pl', host).onclick = () => play(.9); $('#pl2', host).onclick = () => play(.65);
  setTimeout(() => play(.9), 400);
  tx.oninput = () => cb.ready(!!tx.value.trim());
  return {
    check: () => {
      if (!tx.value.trim()) return null;
      const al = FP.align(it.text, tx.value);
      return { ok: al.acc >= .85, score: al.acc, expected: it.text, why: `${al.got} of ${al.total} words correct.`, say: it.text, _al: al };
    },
    lock: r => { $('#out', host).innerHTML = `<div class="diff">${FP.diffHTML(r._al)}</div>`; tx.disabled = true; }
  };
};

FP.R.fib = (host, it, cb) => {
  let n = 0;
  const html = esc(it.text).replace(/\[\[(.+?)\|(\d+)\]\]/g, (m, opts, a) => {
    const o = opts.split(';'); n++;
    return `<select class="sel" data-a="${a}"><option value="">choose</option>${o.map((x, i) => `<option value="${i}">${esc(x)}</option>`).join('')}</select>`;
  });
  host.innerHTML = `<div class="eyebrow">Reading · fill in the blanks</div><p class="fib">${html}</p><div id="out"></div>`;
  const sels = $$('select', host);
  sels.forEach(s => s.onchange = () => cb.ready(sels.every(x => x.value !== '')));
  return {
    check: () => {
      if (sels.some(s => s.value === '')) return null;
      const good = sels.filter(s => s.value === s.dataset.a).length;
      return { ok: good === n, score: good / n, why: `${good} of ${n} blanks correct.` };
    },
    lock: () => sels.forEach(s => { s.disabled = true; const ok = s.value === s.dataset.a; s.classList.add(ok ? 'right' : 'wrong'); if (!ok) s.insertAdjacentHTML('afterend', `<span class="fix">${esc(s.options[+s.dataset.a + 1].text)}</span>`); })
  };
};

FP.R.reorder = (host, it, cb) => {
  let order = shuffle(it.parts.map((_, i) => i)), locked = false;
  const draw = () => {
    $('#lst', host).innerHTML = order.map((p, k) => `<div class="rowi" data-k="${k}"><span class="n">${k + 1}</span><span class="t">${esc(it.parts[p])}</span><span class="mv"><button class="icon-btn sm" data-d="-1" ${k === 0 ? 'disabled' : ''}>${FP.ic('up')}</button><button class="icon-btn sm" data-d="1" ${k === order.length - 1 ? 'disabled' : ''}>${FP.ic('down')}</button></span></div>`).join('');
  };
  host.innerHTML = `<div class="eyebrow">Re-order paragraphs</div><p class="muted">Use the arrows to put the sentences into a logical paragraph.</p><div id="lst" class="reorder"></div>`;
  draw(); cb.ready(true);
  host.onclick = e => {
    if (locked) return; const b = e.target.closest('[data-d]'); if (!b) return;
    const k = +b.closest('.rowi').dataset.k, d = +b.dataset.d; [order[k], order[k + d]] = [order[k + d], order[k]]; draw();
  };
  return {
    check: () => {
      let pairs = 0; for (let k = 0; k < order.length - 1; k++) if (order[k + 1] === order[k] + 1) pairs++;
      const sc = pairs / (order.length - 1);
      return { ok: sc === 1, score: sc, why: sc === 1 ? 'Perfect flow.' : `${pairs} of ${order.length - 1} links were right. Look for linking words like “however”, “this”, “as a result”.` };
    },
    lock: () => { locked = true; $('#lst', host).innerHTML = it.parts.map((t, k) => `<div class="rowi ok"><span class="n">${k + 1}</span><span class="t">${esc(t)}</span></div>`).join(''); host.insertAdjacentHTML('beforeend', '<p class="muted sm">Correct order shown above.</p>'); }
  };
};

FP.R.tfng = (host, it, cb) => {
  const ans = it.st.map(() => -1), L = ['True', 'False', 'Not given'];
  host.innerHTML = `<div class="eyebrow">IELTS reading · True / False / Not given</div><div class="passage">${esc(it.passage)}</div>${it.st.map((s, i) => `<div class="tf" data-i="${i}"><p>${esc(s[0])}</p><div class="seg">${L.map((l, k) => `<button data-k="${k}">${l}</button>`).join('')}</div></div>`).join('')}<p class="muted sm">True = the passage agrees · False = it contradicts · Not given = it says nothing about this.</p>`;
  host.onclick = e => {
    const b = e.target.closest('.seg button'); if (!b || b.disabled) return;
    const i = +b.closest('.tf').dataset.i; ans[i] = +b.dataset.k;
    $$('button', b.parentNode).forEach(x => x.classList.toggle('sel', x === b)); cb.ready(ans.every(a => a >= 0));
  };
  return {
    check: () => {
      if (ans.some(a => a < 0)) return null;
      const good = ans.filter((a, i) => a === it.st[i][1]).length;
      return { ok: good === ans.length, score: good / ans.length, why: `${good} of ${ans.length} correct.` };
    },
    lock: () => $$('.tf', host).forEach((row, i) => $$('button', row).forEach((b, k) => { b.disabled = true; if (k === it.st[i][1]) b.classList.add('right'); else if (b.classList.contains('sel')) b.classList.add('wrong'); }))
  };
};

/* ---------- writing analysis (heuristic checklist, not an official score) ---------- */
FP.LINKERS = ['however', 'moreover', 'furthermore', 'in addition', 'therefore', 'consequently', 'as a result', 'for example', 'for instance', 'on the other hand', 'in contrast', 'nevertheless', 'although', 'whereas', 'while', 'despite', 'in conclusion', 'to conclude', 'firstly', 'secondly', 'finally', 'overall', 'to sum up', 'besides', 'similarly', 'in particular', 'due to', 'because of', 'in my opinion', 'on balance'];
FP.analyzeWriting = (text, target) => {
  const words = text.toLowerCase().match(/[a-z']+/g) || [], n = words.length;
  const sents = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const paras = text.split(/\n\s*\n|\n/).map(s => s.trim()).filter(Boolean).length;
  const lower = ' ' + text.toLowerCase().replace(/\s+/g, ' ') + ' ';
  const linkers = FP.LINKERS.filter(l => lower.includes(' ' + l + ' ') || lower.includes(' ' + l + ','));
  const complexRe = /\b(which|who|whose|although|whereas|while|if|unless|since|because|so that|not only|even though)\b/i;
  const complexN = sents.filter(s => complexRe.test(s)).length;
  const lens = sents.map(s => s.split(/\s+/).length), avg = lens.length ? lens.reduce((a, b) => a + b, 0) / lens.length : 0;
  const stop = new Set('this that with have from they their there which would about these those been were will your what when also than then them into more most such only other some very just like should could because being while where'.split(' '));
  const freq = {}; words.forEach(w => { if (w.length > 3 && !stop.has(w)) freq[w] = (freq[w] || 0) + 1; });
  const repeats = Object.entries(freq).filter(([, c]) => c >= 5).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const uniq = n ? new Set(words).size / n : 0;
  const contractions = (text.match(/\b\w+'(t|s|re|ve|ll|d|m)\b/gi) || []).filter(x => !/'s$/i.test(x)).length;
  const passive = /\b(is|are|was|were|been|be)\s+\w+(ed|en)\b/i.test(text);
  const checks = [
    { ok: n >= target, label: `Length: ${n} words (aim for ${target}+)`, tip: n < target ? `Add ${target - n} more words — develop each idea with a reason and an example.` : 'Good length.' },
    { ok: paras >= 4, label: `Paragraphs: ${paras} (aim for 4: introduction, 2 body, conclusion)`, tip: 'Leave a blank line between paragraphs so your structure is visible.' },
    { ok: linkers.length >= 5, label: `Linking words: ${linkers.length} different (${linkers.slice(0, 6).join(', ') || 'none'})`, tip: 'Use a range: however, moreover, as a result, for instance, in contrast, overall.' },
    { ok: sents.length > 3 && complexN / sents.length >= .3, label: `Complex sentences: ${complexN} of ${sents.length}`, tip: 'Join ideas with which / although / whereas / if to show a wider range of grammar.' },
    { ok: avg >= 13 && avg <= 26, label: `Average sentence length: ${avg.toFixed(1)} words`, tip: avg < 13 ? 'Your sentences are short — combine some.' : 'Very long sentences risk errors — split some.' },
    { ok: n < 120 || uniq >= .5, label: `Vocabulary variety: ${(uniq * 100).toFixed(0)}% unique words`, tip: 'Use synonyms and more precise words instead of repeating the same ones.' },
    { ok: !repeats.length, label: repeats.length ? 'Repeated words: ' + repeats.map(([w, c]) => `“${w}” ×${c}`).join(', ') : 'No overused words', tip: 'Replace some repeats with synonyms.' },
    { ok: /\b(in conclusion|to conclude|to sum up|overall|in summary)\b/i.test(text), label: 'Clear conclusion', tip: 'End with “In conclusion, …” and restate your opinion.' },
    { ok: contractions === 0, label: contractions ? `Contractions: ${contractions} (too informal)` : 'Formal register (no contractions)', tip: 'Write “do not” instead of “don’t” in academic writing.' },
    { ok: passive, label: passive ? 'Uses the passive voice' : 'No passive voice found', tip: 'A few passive sentences (“It is widely believed that…”) add academic tone.' }
  ];
  return { n, sents: sents.length, paras, checks, score: Math.round(checks.filter(c => c.ok).length / checks.length * 100) };
};

/* ---------- full-page tasks ---------- */
FP.fmtTime = s => Math.floor(s / 60) + ':' + pad(Math.floor(s % 60));
FP.finishFree = (title, secs, xp, taskId) => {
  S.xp += xp; FP.addMinutes(Math.min(secs / 60, 60));
  if (taskId) { const k = dayKey(); (S.tasks[k] = S.tasks[k] || {})[taskId] = true; }
  FP.save();
};

FP.writingPage = (idx, opts = {}) => {
  const modes = { ielts: { label: 'IELTS Task 2', min: 40, target: 250 }, pte: { label: 'PTE essay', min: 20, target: 200 }, quick: { label: 'Quick practice', min: 20, target: 150 } };
  const modeKey = opts.mode || (S.goal.type === 'pte' ? 'pte' : 'ielts'), M = modes[modeKey];
  const prompt = EXAM.essays[idx % EXAM.essays.length]; let left = M.min * 60; const t0 = Date.now();
  FP.stopMedia();
  $('#app').innerHTML = `<div class="sess wide"><header class="sess-top"><button class="icon-btn" id="wx">${FP.ic('x')}</button><div class="eyebrow grow">${M.label} · ${M.min} min · ${M.target}+ words</div><span class="timer" id="wt">${FP.fmtTime(left)}</span></header><main class="sess-main top"><div class="split"><section class="sess-card in"><div class="passage big">${esc(prompt)}</div><textarea class="inp essay" id="wtx" placeholder="Start writing here…"></textarea><div class="row between"><span class="muted" id="wc">0 words</span><button class="btn primary lg" id="wsub">Submit for feedback</button></div></section><aside class="sess-card in side-tips"><h3>Plan in 2 minutes</h3><ol class="plan-o"><li><b>Introduction</b> — paraphrase the question, state your opinion.</li><li><b>Body 1</b> — main idea → reason → example.</li><li><b>Body 2</b> — second idea or the opposite view → example.</li><li><b>Conclusion</b> — restate your opinion.</li></ol><h3>Useful phrases</h3><ul class="phr"><li>It is often argued that…</li><li>On the one hand… on the other hand…</li><li>A key advantage is that…</li><li>For instance, … / This is because…</li><li>Despite this, … / Nevertheless, …</li><li>In conclusion, I firmly believe that…</li></ul></aside></div></main></div>`;
  const tx = $('#wtx'), wc = $('#wc');
  tx.oninput = () => { const n = (tx.value.match(/[A-Za-z']+/g) || []).length; wc.textContent = n + ' words'; wc.className = 'muted' + (n >= M.target ? ' okc' : ''); };
  FP._timer = setInterval(() => { left--; $('#wt').textContent = FP.fmtTime(Math.max(0, left)); if (left <= 60) $('#wt').classList.add('warn'); if (left <= 0) { clearInterval(FP._timer); submit(); } }, 1000);
  $('#wx').onclick = () => { if (!tx.value.trim() || confirm('Leave without submitting? Your text will be lost.')) { clearInterval(FP._timer); FP.go('#/exam'); } };
  $('#wsub').onclick = submit;
  function submit() {
    clearInterval(FP._timer);
    const text = tx.value, a = FP.analyzeWriting(text, M.target), secs = Math.round((Date.now() - t0) / 1000);
    if (a.n < 20) { FP.toast('Write a little more first — at least a few sentences.'); FP._timer = setInterval(() => { left--; $('#wt').textContent = FP.fmtTime(Math.max(0, left)); }, 1000); return; }
    FP.finishFree('Writing', secs, 30 + Math.round(a.score / 5), 'exam');
    $('#app').innerHTML = `<div class="sess"><main class="sess-main top"><div class="sess-card in sum wide-c"><div class="eyebrow">${M.label} · feedback checklist</div><h1>${a.n < M.target * .7 ? 'Too short for the exam — develop your ideas' : a.score >= 80 ? 'Strong structure!' : a.score >= 50 ? 'Good start — a few things to lift' : 'Let’s build this up'}</h1>${FP.ring(a.score, 130, 11, a.score + '%', 'checklist')}<p class="muted">${a.n} words · ${a.sents} sentences · ${Math.floor(secs / 60)} min. This is an automatic <b>checklist of exam habits</b>, not an official band score — grammar accuracy and the quality of your ideas still need a teacher’s eye.</p><div class="checks">${a.checks.map(c => `<div class="chk ${c.ok ? 'ok' : 'no'}"><span class="ci">${FP.ic(c.ok ? 'check' : 'x')}</span><div><b>${esc(c.label)}</b>${c.ok ? '' : `<small>${esc(c.tip)}</small>`}</div></div>`).join('')}</div><div class="row center gap"><button class="btn ghost" id="wh">Back to Exam Lab</button><button class="btn primary lg" id="wa">Write another</button></div></div></main></div>`;
    $('#wh').onclick = () => FP.go('#/exam'); $('#wa').onclick = () => FP.writingPage(idx + 1, opts);
    if (a.score >= 70) FP.confetti();
  }
};

FP.speakingPage = (idx) => {
  const cue = EXAM.cues[idx % EXAM.cues.length]; let phase = 'intro', rec = null, media = null, chunks = [], audioURL = '', transcript = '', speakSecs = 0;
  FP.stopMedia();
  const shell = inner => { $('#app').innerHTML = `<div class="sess"><header class="sess-top"><button class="icon-btn" id="sx2">${FP.ic('x')}</button><div class="eyebrow grow">IELTS Speaking · Part 2</div><span class="timer" id="stm"></span></header><main class="sess-main"><div class="sess-card in sum wide-c">${inner}</div></main></div>`; $('#sx2').onclick = () => { stopAll(); FP.go('#/exam'); }; };
  const stopAll = () => { clearInterval(FP._timer); if (rec) { rec.stop(); rec = null; } if (media) { try { media.stop(); } catch (e) { } } };
  const card = `<div class="cue"><h2>${esc(cue.t)}</h2><p>You should say:</p><ul>${cue.p.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
  const countdown = (secs, el, done) => { let left = secs; el.textContent = FP.fmtTime(left); clearInterval(FP._timer); FP._timer = setInterval(() => { left--; el.textContent = FP.fmtTime(Math.max(0, left)); if (left <= 10) el.classList.add('warn'); if (left <= 0) { clearInterval(FP._timer); done(); } }, 1000); return () => left; };
  function intro() {
    shell(`${card}<p class="muted">In the real test you get <b>1 minute</b> to prepare and then speak for <b>1–2 minutes</b>. Make notes — keywords only, not sentences.</p><div class="row center gap"><button class="btn ghost" id="sk">Another topic</button><button class="btn primary lg" id="go">Start preparing</button></div>`);
    $('#go').onclick = prep; $('#sk').onclick = () => FP.speakingPage(idx + 1);
  }
  function prep() {
    shell(`${card}<textarea class="inp" rows="4" placeholder="Your notes (keywords only)…"></textarea><div class="row center gap"><button class="btn primary lg" id="go">I'm ready — start speaking</button></div>`);
    const st = $('#stm'); countdown(60, st, speak); $('#go').onclick = speak;
  }
  async function speak() {
    clearInterval(FP._timer); phase = 'speak'; chunks = [];
    shell(`${card}<div class="micbox"><button class="mic on" id="mic">${FP.ic('stop')}</button><div class="muted" id="mst">Speaking… tap to finish</div></div><div class="live" id="live">${FP.SR ? 'Your words will appear here as you speak.' : 'Speech-to-text is not available in this browser — your voice is being recorded so you can listen back.'}</div>`);
    const st = $('#stm'), left = countdown(120, st, finish); $('#mic').onclick = finish;
    FP._st0 = Date.now();
    try { const s = await navigator.mediaDevices.getUserMedia({ audio: true }); const mr = new MediaRecorder(s); mr.ondataavailable = e => chunks.push(e.data); mr.onstop = () => { audioURL = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' })); s.getTracks().forEach(t => t.stop()); }; mr.start(); media = mr; } catch (e) { media = null; }
    rec = FP.listen({ result: t => { transcript = t; const l = $('#live'); if (l) l.textContent = t; }, error: () => { }, end: () => { } });
  }
  function finish() {
    speakSecs = Math.max(1, Math.round((Date.now() - FP._st0) / 1000)); stopAll(); setTimeout(review, 400);
  }
  function review() {
    const words = (transcript.match(/[A-Za-z']+/g) || []).length;
    shell(`<h1>How did it go?</h1><p class="muted">You spoke for <b>${FP.fmtTime(speakSecs)}</b>.${audioURL ? ' Listen back to yourself:' : ''}</p>${audioURL ? `<audio controls src="${audioURL}" class="aud"></audio>` : ''}<label class="muted">${FP.SR ? 'What the computer heard (edit if wrong, or paste your own words):' : 'Optional — type or paste what you said to get an analysis:'}</label><textarea class="inp" id="trs" rows="4">${esc(transcript)}</textarea><div id="ana"></div><div class="selfcheck"><h3>Be your own examiner</h3>${['Fluency — did I keep going without long pauses?', 'Vocabulary — did I use some less common words?', 'Grammar — did I use a mix of tenses and complex sentences?', 'Pronunciation — would a stranger understand me easily?'].map(t => `<label class="cbx"><input type="checkbox"><span>${t}</span></label>`).join('')}</div><div class="row center gap"><button class="btn ghost" id="an">Analyse my words</button><button class="btn primary lg" id="dn">Finish</button></div>`);
    $('#an').onclick = () => {
      const t = $('#trs').value, w = (t.match(/[A-Za-z']+/g) || []), n = w.length; if (n < 5) return FP.toast('Add what you said first.');
      const fill = (t.toLowerCase().match(/\b(um+|uh+|er+|erm|you know|i mean|sort of|kind of|basically|actually)\b/g) || []).length;
      const lk = FP.LINKERS.filter(l => (' ' + t.toLowerCase() + ' ').includes(' ' + l + ' ')).length, wpm = Math.round(n / (speakSecs / 60));
      const rows = [[n >= 200, `${n} words (aim for ~200–280 in two minutes)`], [wpm >= 100 && wpm <= 170, `${wpm} words per minute (natural pace: 120–150)`], [fill <= 4, `${fill} filler words (um, uh, you know…)`], [lk >= 3, `${lk} linking phrases (because, however, for example…)`]];
      $('#ana').innerHTML = `<div class="checks">${rows.map(([ok, l]) => `<div class="chk ${ok ? 'ok' : 'no'}"><span class="ci">${FP.ic(ok ? 'check' : 'x')}</span><div><b>${esc(l)}</b></div></div>`).join('')}</div>`;
    };
    $('#dn').onclick = () => { FP.finishFree('Speaking', speakSecs + 60, 40, 'exam'); FP.toast('Saved +40 XP'); FP.go('#/exam'); };
  }
  intro();
};

/* ---------- catalogue for the Exam Lab ---------- */
FP.examSession = (title, items, taskId, again) => FP.study({ title, items, taskId, bonus: 10, again, autoSay: false });
FP.examTasks = () => [
  { id: 'rep', exam: 'PTE', icon: 'mic', title: 'Repeat sentence', desc: 'Listen once, repeat it back. Trains listening memory and pronunciation (shadowing).', min: 6, run: () => FP.runRepeat() },
  { id: 'dict', exam: 'PTE', icon: 'ear', title: 'Write from dictation', desc: 'Type the sentence you hear. Spelling and listening together.', min: 6, run: () => FP.runDict() },
  { id: 'read', exam: 'PTE', icon: 'vol', title: 'Read aloud', desc: 'Read a short academic text. Fluency and pronunciation.', min: 6, run: () => FP.runRead() },
  { id: 'fib', exam: 'Both', icon: 'pen', title: 'Reading: fill the blanks', desc: 'Choose the word that fits grammar and meaning.', min: 6, run: () => FP.runFib() },
  { id: 'reo', exam: 'PTE', icon: 'up', title: 'Re-order paragraphs', desc: 'Rebuild a paragraph — trains cohesion and logic.', min: 5, run: () => FP.runReorder() },
  { id: 'tfng', exam: 'IELTS', icon: 'book', title: 'True / False / Not given', desc: 'The classic IELTS reading question type.', min: 8, run: () => FP.runTfng() },
  { id: 'sp2', exam: 'IELTS', icon: 'mic', title: 'Speaking Part 2 cue card', desc: '1 minute to prepare, 2 minutes to speak. Record yourself.', min: 6, run: () => FP.speakingPage(Math.floor(Math.random() * 6)) },
  { id: 'wr', exam: 'Both', icon: 'note', title: 'Essay writing', desc: 'Timed essay with a live word count and a structure checklist.', min: 25, run: () => FP.writingPage(Math.floor(Math.random() * 6)) }
];
FP.runRepeat = () => { const items = shuffle(EXAM.repeat).slice(0, 5).map(t => ({ id: 'r' + FP.hash(t), type: 'speak', mode: 'repeat', text: t, noLog: true })); FP.examSession('Repeat sentence', items, 'exam', FP.runRepeat); };
FP.runRead = () => { const items = shuffle(EXAM.read).slice(0, 3).map(t => ({ id: 'rd' + FP.hash(t), type: 'speak', mode: 'read', text: t, noLog: true })); FP.examSession('Read aloud', items, 'exam', FP.runRead); };
FP.runDict = () => { const items = shuffle(EXAM.dict).slice(0, 5).map(t => ({ id: 'd' + FP.hash(t), type: 'dict', text: t, noLog: true })); FP.examSession('Write from dictation', items, 'exam', FP.runDict); };
FP.runFib = () => { const items = shuffle(EXAM.fib).map(t => ({ id: 'f' + FP.hash(t), type: 'fib', text: t, noLog: true })); FP.examSession('Fill in the blanks', items, 'exam', FP.runFib); };
FP.runReorder = () => { const items = shuffle(EXAM.reorder).map(p => ({ id: 'ro' + FP.hash(p[0]), type: 'reorder', parts: p, noLog: true })); FP.examSession('Re-order paragraphs', items, 'exam', FP.runReorder); };
FP.runTfng = () => { const items = shuffle(EXAM.tfng).map(p => ({ id: 'tf' + FP.hash(p.passage), type: 'tfng', ...p, noLog: true })); FP.examSession('True / False / Not given', items, 'exam', FP.runTfng); };
