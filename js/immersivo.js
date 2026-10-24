// ============================================================
//  PIÙ DECISIONI, MENO LETTURA: scorrimento, notte elettorale,
//  traguardi, pianificazione della settimana, la tua storia
// ============================================================

// ---------- 1. carte da far scorrere ----------
// el: la carta; opts: { right:{label,cb}, left:{label,cb}, up:{label,cb} }
function makeSwipe(el, opts) {
  if (!el) return;
  let sx = 0, sy = 0, dx = 0, dy = 0, drag = false;
  const lab = document.createElement('div'); lab.className = 'swipe-lab'; el.appendChild(lab);
  el.addEventListener('pointerdown', e => {
    if (e.target.closest('button') && e.pointerType === 'mouse') return;
    sx = e.clientX; sy = e.clientY; dx = dy = 0; drag = true; el.style.transition = 'none';
  });
  el.addEventListener('pointermove', e => {
    if (!drag) return; dx = e.clientX - sx; dy = e.clientY - sy;
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    if (!el.hasPointerCapture(e.pointerId)) { try { el.setPointerCapture(e.pointerId); } catch (er) { } }
    el.style.transform = `translate(${dx}px, ${Math.min(0, dy) * 0.6}px) rotate(${dx / 18}deg)`;
    const side = dy < -70 && Math.abs(dx) < 60 && opts.up ? 'up' : dx > 40 ? 'right' : dx < -40 ? 'left' : null;
    lab.className = 'swipe-lab ' + (side || '');
    lab.textContent = side && opts[side] ? opts[side].label : '';
    lab.style.opacity = side ? Math.min(1, (Math.max(Math.abs(dx), -dy) - 40) / 60) : 0;
  });
  const end = () => {
    if (!drag) return; drag = false; el.style.transition = 'transform .3s ease, opacity .3s';
    const side = dy < -90 && Math.abs(dx) < 70 && opts.up ? 'up' : dx > 100 ? 'right' : dx < -100 ? 'left' : null;
    if (side && opts[side]) {
      el.style.transform = side === 'up' ? 'translateY(-130%)' : `translateX(${side === 'right' ? 140 : -140}%) rotate(${side === 'right' ? 25 : -25}deg)`;
      el.style.opacity = 0; vib(25);
      setTimeout(() => opts[side].cb(), 260);
    } else { el.style.transform = ''; lab.style.opacity = 0; }
  };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
}

// votazioni a scorrimento: una carta per provvedimento
function renderSwipeVotes() {
  const pending = VOTI.bills.filter(id => !VOTI.done || !VOTI.done[id]);
  VOTI.done = VOTI.done || {};
  if (!pending.length) return confirmVotes();
  const id = pending[0], b = G.bills.find(x => x.id === id), s = b.stages[b.stage], st = VOTI.sel[id];
  const pr = predictVote(b);
  const groupHere = isLeader() && seatsOf(myPid(), s.h) > 0;
  const effs = b.lawId ? effChipsHTML(effectsOf(getLaw(b.lawId), b.from, b.opt), lawGain(myPid(), getLaw(b.lawId), b.from, b.opt)) : '';
  replaceSheet(`<div class="row between"><span class="tag o">🗳 Voto ${VOTI.bills.length - pending.length + 1} di ${VOTI.bills.length}</span><button class="btn sm" onclick="VOTI.list=true;renderVotes()">Vista elenco</button></div>
    <div class="swipe-hint">⬅️ No · ⬆️ Astensione · Sì ➡️</div>
    <div class="swipe-card" id="swc" style="--vc:${b.proposer === 'GOV' ? '#ffd60a' : G.parties[b.proposer] ? P(b.proposer).color : '#a78bfa'}">
      <div class="row between"><span class="tag">${billTypeName(b)} · ${s.h === 'C' ? 'Camera' : 'Senato'}</span>${proposerLabel(b)}</div>
      <h2 style="margin-top:10px">${esc(billName(b))}</h2>
      <div class="qcard small mt">${billChangeText(b)}</div>${effs}
      <div class="row between small mt"><span>Linea del partito: <b>${VLAB[st.line]}</b></span><span>Previsione: <b class="${pr.passed ? 'good' : 'bad'}">${pr.passed ? 'passa' : 'bocciata'}</b></span></div>
      ${groupHere ? `<div class="tiny muted mt">Voti tu e il tuo gruppo (${seatsOf(myPid(), s.h)} seggi).</div>` : '<div class="tiny muted mt">È il tuo voto personale: contro la linea è dissenso.</div>'}
      <button class="btn sm mt" onclick="openBill(${id})">⚖️ Pro e contro</button>
    </div>
    <div class="row mt2" style="justify-content:center;gap:18px"><button class="swbtn no" onclick="swipeVote('no')">✗</button><button class="swbtn ab" onclick="swipeVote('abst')">–</button><button class="swbtn si" onclick="swipeVote('yes')">✓</button></div>`);
  makeSwipe(document.getElementById('swc'), { right: { label: 'SÌ', cb: () => swipeVote('yes') }, left: { label: 'NO', cb: () => swipeVote('no') }, up: { label: 'ASTENSIONE', cb: () => swipeVote('abst') } });
}
function swipeVote(v) {
  const pending = VOTI.bills.filter(id => !VOTI.done[id]); const id = pending[0]; if (id === undefined) return;
  const st = VOTI.sel[id]; st.group = v; st.me = v; VOTI.done[id] = true; vib(15);
  renderSwipeVotes();
}

// ---------- 3. notte elettorale in diretta ----------
let EN = null;
function renderElectionNight() {
  const E = G.lastElection;
  if (!EN || EN.w !== E.w) EN = { w: E.w, ph: 0 };
  const phases = [
    { t: 'Ore 23:00 · Exit poll', cov: 0, noise: 2.2, range: true },
    { t: 'Prima proiezione', cov: 18, noise: 1.2 },
    { t: 'Seconda proiezione', cov: 46, noise: 0.6 },
    { t: 'Terza proiezione', cov: 79, noise: 0.25 },
  ];
  const ph = phases[EN.ph];
  if (!ph) { G.formation.liveDone = true; return renderResults(); }
  const r = seeded(E.w * 31 + EN.ph * 7);
  const ids = Object.keys(E.votes).sort((a, b) => E.votes[b] - E.votes[a]);
  const val = id => clamp(E.votes[id] + (r() - 0.5) * 2 * ph.noise, 0, 70);
  const max = Math.max(...ids.map(val));
  const mine = val(myPid());
  replaceSheet(`<div class="center"><div class="live"><i></i>DIRETTA · ELEZIONI POLITICHE</div><h2 class="mt">${ph.t}</h2><div class="small muted">${ph.range ? 'Forchette dei principali istituti' : `Sezioni scrutinate: ${ph.cov}%`}</div></div>
    <div class="card hero center mt" style="--pc:${myParty().color}">${leaderPortrait(myPid(), 64)}<div class="small muted mt">${esc(myParty().name)}</div><div class="bignum">${ph.range ? `${fmt1(Math.max(0, mine - 2))}–${fmt1(mine + 2)}` : fmt1(mine)}%</div></div>
    <div class="card">${ids.slice(0, 10).map(id => `<div class="res-row">${partyChip(id)}<div class="bar"><i style="width:${val(id) / max * 100}%;--c:${P(id).color}"></i></div><span class="pct small">${ph.range ? `${fmt0(Math.max(0, val(id) - 2))}–${fmt0(val(id) + 2)}` : fmt1(val(id))}%</span></div>`).join('')}</div>
    <div class="row mt"><button class="btn grow" onclick="EN.ph=99;renderElectionNight()">Salta ai risultati</button><button class="btn gold grow" onclick="EN.ph++;renderElectionNight()">Avanti ›</button></div>`);
  clearTimeout(EN.t);
  EN.t = setTimeout(() => { if (G.phase === 'formazione' && G.formation && G.formation.step === 'risultati' && !G.formation.liveDone && EN.ph < 99) { EN.ph++; renderElectionNight(); } }, 3200);
}

// ---------- 5. traguardi ----------
const ACHIEVEMENTS = [
  { id: 'soglia', ico: '🎯', n: 'Sopra la soglia', d: 'Il tuo partito supera il 3% nei sondaggi', c: () => myParty().poll >= 3 },
  { id: 'dieci', ico: '📊', n: 'Doppia cifra', d: 'Il tuo partito supera il 10%', c: () => myParty().poll >= 10 },
  { id: 'venti', ico: '🚀', n: 'Partito di massa', d: 'Il tuo partito supera il 20%', c: () => myParty().poll >= 20 },
  { id: 'primo', ico: '🥇', n: 'Primo partito', d: 'Il tuo partito è il più votato nei sondaggi', c: () => PIDS().every(id => id === myPid() || P(id).poll < myParty().poll) },
  { id: 'notorieta', ico: '📣', n: 'Lo conoscono tutti', d: 'Notorietà del partito oltre il 75%', c: () => partyNoto(myPid()) >= 75 },
  { id: 'parlamento', ico: '🏛', n: 'In Parlamento', d: 'Entri in Parlamento', c: () => !!G.player.parl },
  { id: 'coalizione', ico: '🤝', n: 'Candidato premier', d: 'Sei il candidato premier di una coalizione', c: () => G.coalitions.some(c => c.cand === 'PLAYER') },
  { id: 'ministro', ico: '💼', n: 'Al governo', d: 'Diventi ministro', c: () => !!G.player.minister },
  { id: 'premier', ico: '👑', n: 'Palazzo Chigi', d: 'Diventi Presidente del Consiglio', c: () => isPremier() },
  { id: 'anno', ico: '🗓', n: 'Un anno a Palazzo Chigi', d: '52 settimane da premier', c: () => G.stats.weeksPremier >= 52 },
  { id: 'longevo', ico: '🏆', n: 'Governo longevo', d: 'Più di 3 anni da premier', c: () => G.stats.weeksPremier >= 156 },
  { id: 'leggi5', ico: '📜', n: 'Legislatore', d: '5 tue leggi approvate', c: () => G.stats.laws >= 5 },
  { id: 'leggi20', ico: '📚', n: 'Riformatore', d: '20 tue leggi approvate', c: () => G.stats.laws >= 20 },
  { id: 'manovra', ico: '💶', n: 'La prima manovra', d: 'Approvata una tua legge di bilancio', c: () => !!G.flags.playerManovra },
  { id: 'spread', ico: '📉', n: 'Mercati tranquilli', d: 'Da premier porti lo spread sotto 100', c: () => isPremier() && G.econ.spread < 100 && G.stats.weeksPremier > 10 },
  { id: 'conti', ico: '✅', n: 'Conti in ordine', d: 'Da premier porti il deficit sotto il 3%', c: () => isPremier() && G.econ.deficit < 3 && G.stats.weeksPremier > 20 },
  { id: 'crescita', ico: '📈', n: 'Boom economico', d: 'Da premier la crescita supera l’1,2%', c: () => isPremier() && G.econ.pil > 1.2 },
  { id: 'lavoro', ico: '👷', n: 'Piena occupazione', d: 'Da premier la disoccupazione scende sotto il 5,5%', c: () => isPremier() && G.econ.dis < 5.5 },
  { id: 'regione', ico: '🗺', n: 'Una regione tua', d: 'Un presidente di Regione del tuo partito', c: () => Object.values(G.regions).some(r => r.gp === myPid()) },
  { id: 'fama', ico: '🌟', n: 'Celebrità', d: 'Fama oltre 90', c: () => G.player.fama >= 90 },
  { id: 'tv', ico: '📺', n: 'Volto televisivo', d: '10 interviste in TV', c: () => (G.stats.tv || 0) >= 10 },
  { id: 'dissidente', ico: '✋', n: 'Spirito libero', d: 'Voti in dissenso dal tuo gruppo', c: () => G.careerLog.some(x => x.dissent) || G.news.some(n => /vota in dissenso/.test(n.t) && n.t.includes(G.player.name)) },
  { id: 'congresso', ico: '⚔️', n: 'Scalata riuscita', d: 'Vinci il congresso del tuo partito', c: () => G.careerLog.some(x => /Vinci il congresso/.test(x.t)) },
  { id: 'scissione', ico: '🪓', n: 'Strada tua', d: 'Fondi un partito con una scissione', c: () => G.careerLog.some(x => /Scissione/.test(x.t)) },
  { id: 'referendum', ico: '✍️', n: 'Democrazia diretta', d: 'Vinci un referendum che hai promosso', c: () => G.referendums.some(r => r.by === 'PLAYER' && r.res && r.res.won) },
  { id: 'quirinale', ico: '🇮🇹', n: 'Capo dello Stato', d: 'Vieni eletto Presidente della Repubblica', c: () => G.careerLog.some(x => /Presidente della Repubblica/.test(x.t)) },
];
function checkAchievements() {
  G.ach = G.ach || {};
  const fresh = [];
  ACHIEVEMENTS.forEach(a => { if (G.ach[a.id]) return; let ok = false; try { ok = a.c(); } catch (e) { } if (ok) { G.ach[a.id] = G.week; fresh.push(a); G.careerLog.push({ w: G.week, t: `Traguardo: ${a.n}`, ach: a.ico }); } });
  return fresh;
}
function openAchievements() {
  G.ach = G.ach || {};
  const n = Object.keys(G.ach).length;
  openSheet(`${head('🏅 Traguardi', `${n} su ${ACHIEVEMENTS.length} sbloccati`)}<div class="ach-grid">${ACHIEVEMENTS.map(a => `<div class="ach ${G.ach[a.id] ? 'on' : ''}"><div class="ai">${G.ach[a.id] ? a.ico : '🔒'}</div><b>${esc(a.n)}</b><div class="tiny muted">${esc(a.d)}</div>${G.ach[a.id] ? `<div class="tiny gold">${fmtDate(G.ach[a.id], true)}</div>` : ''}</div>`).join('')}</div>`);
}
function celebrate(list) {
  if (!list || !list.length) return;
  confetti(['#ffd60a', '#fb923c', '#a78bfa', '#22c55e']);
  list.forEach((a, i) => setTimeout(() => flyResult(a.ico, `Traguardo: ${a.n}`, [], a.d), i * 1600));
}

// ---------- 6. pianifica la settimana ----------
function autoPlan() {
  if (G.phase !== 'normale') return;
  const before = snap(); const done = [];
  for (let k = 0; k < 6; k++) {
    const recs = recommendedActions().filter(r => r.id !== 'tv' && r.id !== 'dibattito' && r.id !== 'riposo');
    const r = recs[0]; if (!r) break;
    const a = ACTIONS.find(x => x.id === r.id);
    if (r.id === 'comizio') { if (G.funds < 20 || G.pc < 1) break; doComizioQuiet(r.param); done.push('📣'); continue; }
    if (a.custom || !a.run) { markUsed(r.id); continue; }
    if (!spendPC(actionCost(a))) break;
    markUsed(r.id); if (a.funds) G.funds -= a.funds;
    try { a.run(); } catch (e) { }
    done.push(a.ico);
  }
  renderGame();
  if (!done.length) return toast('Niente da pianificare: capitale politico o fondi esauriti');
  flyResult('🗓', `Settimana pianificata: ${done.join(' ')}`, diffChips(before, snap()), `${done.length} azioni fatte in automatico`);
}
function doComizioQuiet(rid) {
  if (usedThisWeek('comizio') || G.funds < 20 || !spendPC(1)) return;
  G.funds -= 20; markUsed('comizio');
  const r = REGIONS_DEF.find(x => x.id === rid);
  const k = (inCampaign() ? 2 : 1) * (0.6 + G.player.car / 15);
  G.myReg[rid] = (G.myReg[rid] || 1) + 0.12 * k;
  myParty().spinta += 0.15 * k * Math.sqrt(r.el) * (isLeader() ? 1 : 0.3);
  G.player.fama = clamp(G.player.fama + 1, 0, 100);
  addNews(`${G.player.name} in ${r.n}: ${pick(['piazza piena', 'sala gremita', 'incontro con i lavoratori', 'tour nei mercati rionali'])}.`, 'mio');
}

// ---------- 7. la tua storia ----------
function timelineItems() {
  const items = [];
  G.careerLog.forEach(x => items.push({ w: x.w, ico: x.ach || (/premier|Presidente del Consiglio/i.test(x.t) ? '👑' : /Elezioni/.test(x.t) ? '🗳' : /Fine del tuo governo/.test(x.t) ? '💥' : /Scissione/.test(x.t) ? '🪓' : /ministr|Ministro/i.test(x.t) ? '💼' : /Elett/.test(x.t) ? '🏛' : '⭐'), t: x.t, k: x.ach ? 'ach' : 'car' }));
  G.enacted.filter(e => e.by === 'player' || e.by === 'playerparl').forEach(e => { const l = getLaw(e.id); if (l) items.push({ w: e.w, ico: '📜', t: `Legge: ${l.opts[e.to].t}`, k: 'law' }); });
  (G.electHist || []).forEach(e => items.push({ w: e.w, ico: '🗳', t: `Politiche: ${e.party} ${fmt1(e.vote)}% (${e.seatsC} deputati)`, k: 'vote' }));
  const seen = new Set();
  return items.filter(x => { const key = x.w + x.t; if (seen.has(key)) return false; seen.add(key); return true; }).sort((a, b) => a.w - b.w);
}
function openTimeline() {
  const items = timelineItems();
  let h = head('📖 La tua storia', `${esc(G.player.name)} · ${fmtDate(0, true)} → ${fmtDate(G.week, true)}`);
  if (!items.length) h += '<div class="muted center mt2">La tua storia è appena cominciata.</div>';
  let year = null;
  h += '<div class="tl">';
  items.forEach(x => {
    const y = yearOf(x.w);
    if (y !== year) { year = y; h += `<div class="tl-year">${y}</div>`; }
    h += `<div class="tl-item ${x.k}"><span class="tl-dot">${x.ico}</span><div><div class="tiny muted">${fmtDate(x.w, true)}</div><div class="small">${esc(x.t)}</div></div></div>`;
  });
  h += '</div>';
  openSheet(h);
}
