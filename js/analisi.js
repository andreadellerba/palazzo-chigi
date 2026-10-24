// ============================================================
//  PRO E CONTRO DI UNA LEGGE (economia e morale della popolazione)
//  PROPOSTE DEGLI ALTRI PARTITI · INTERVISTE
// ============================================================
const GROUP_TXT = {
  sind: ['i sindacati la sostengono', 'i sindacati sono contrari (rischio scioperi)'],
  conf: ['le imprese e Confindustria la apprezzano', 'le imprese protestano'],
  chiesa: ['la Chiesa e il mondo cattolico approvano', 'la Chiesa e il mondo cattolico sono contrari'],
  ue: ['Bruxelles la vede con favore', 'tensioni con la Commissione europea'],
  merc: ['i mercati la premiano (spread giù)', 'i mercati la temono (spread su)'],
  quir: ['il Quirinale non ha obiezioni', 'il Quirinale esprime perplessità'],
  mag: ['la magistratura la sostiene', 'la magistratura (ANM) protesta'],
  media: ['buona accoglienza dei media', 'campagna critica dei media'],
};
function impactOf(law, from, to) {
  const o0 = law.opts[from], o1 = law.opts[to];
  const pro = [], contro = [];
  const ec = k => (o1.e[k] || 0) - (o0.e[k] || 0);
  // economia
  const dc = (o1.costo || 0) - (o0.costo || 0);
  const dDef = dc / G.econ.pilNom * 100;
  if (dc > 0.05) contro.push({ k: 'eco', t: `Costa ${fmt1(dc)} miliardi l’anno: deficit +${fmt1(dDef)}% del PIL, servono coperture` });
  if (dc < -0.05) pro.push({ k: 'eco', t: `Fa risparmiare o incassare ${fmt1(-dc)} miliardi l’anno (deficit ${fmt1(dDef)}%)` });
  const dp = ec('pil');
  if (dp > 0.005) pro.push({ k: 'eco', t: `Spinge la crescita: +${fmt2(dp)} punti di PIL l’anno` });
  if (dp < -0.005) contro.push({ k: 'eco', t: `Frena la crescita: ${fmt2(dp)} punti di PIL l’anno` });
  const doc = ec('occ');
  if (doc < -0.005) pro.push({ k: 'eco', t: `Più occupazione: disoccupazione ${fmt1(doc)} punti` });
  if (doc > 0.005) contro.push({ k: 'eco', t: `Rischio per i posti di lavoro: disoccupazione +${fmt1(doc)} punti` });
  const di = ec('infl');
  if (di < -0.01) pro.push({ k: 'eco', t: `Abbassa i prezzi: inflazione ${fmt1(di)} punti` });
  if (di > 0.01) contro.push({ k: 'eco', t: `Alza i prezzi: inflazione +${fmt1(di)} punti` });
  const dSpread = -(ec('ue') * 0.5 + ec('merc') * 1.2);
  if (dSpread > 3) contro.push({ k: 'eco', t: `Spread stimato +${fmt0(dSpread)} punti` });
  if (dSpread < -3) pro.push({ k: 'eco', t: `Spread stimato ${fmt0(dSpread)} punti` });
  if (law.debt) { const dd = (law.debt[to] || 0) - (law.debt[from] || 0); if (dd < 0) pro.push({ k: 'eco', t: `Riduce il debito di ${fmt1(-dd)} punti di PIL` }); if (dd > 0) contro.push({ k: 'eco', t: `Aumenta il debito di ${fmt1(dd)} punti di PIL` }); }
  if (dc > 8) contro.push({ k: 'eco', t: 'Spesa molto alta: difficile da far quadrare con il Patto di stabilità' });
  if (Math.abs(dc) <= 0.05 && !pro.some(x => x.k === 'eco') && !contro.some(x => x.k === 'eco')) pro.push({ k: 'eco', t: 'Nessun costo per i conti pubblici' });
  // morale della popolazione
  const dpop = ec('pop');
  if (dpop >= 3) pro.push({ k: 'pop', t: 'Molto popolare: la maggioranza degli italiani è d’accordo' });
  else if (dpop >= 1) pro.push({ k: 'pop', t: 'Gradita all’opinione pubblica' });
  else if (dpop <= -4) contro.push({ k: 'pop', t: 'Molto impopolare: rischio piazze e crollo nei sondaggi' });
  else if (dpop <= -1) contro.push({ k: 'pop', t: 'Impopolare presso gran parte degli elettori' });
  const m = G.mood[law.ax];
  const closer = Math.abs(m - o1.pos) < Math.abs(m - o0.pos);
  const dist = Math.abs(m - o1.pos);
  if (closer && dist < 4) pro.push({ k: 'pop', t: `In sintonia con il clima del Paese (${AXES[law.ax].n.toLowerCase()})` });
  else if (dist > 7) contro.push({ k: 'pop', t: `Divisiva: lontana dal sentire comune (${AXES[law.ax].n.toLowerCase()})` });
  Object.keys(GROUP_TXT).forEach(g => { const d = ec(g); if (d >= 3) pro.push({ k: 'grp', t: GROUP_TXT[g][0] }); if (d <= -3) contro.push({ k: 'grp', t: GROUP_TXT[g][1] }); });
  if ((o1.e.corte || 0) >= 0.3) contro.push({ k: 'ist', t: `Rischio bocciatura della Corte costituzionale (${Math.round(o1.e.corte * 100)}%)` });
  if (law.cost) contro.push({ k: 'ist', t: 'Riforma costituzionale: doppia lettura e probabile referendum' });
  if (law.q23 && law.q23.includes(to)) contro.push({ k: 'ist', t: 'Serve la maggioranza dei due terzi del Parlamento' });
  // partiti
  const fav = [], contr = [];
  PIDS().forEach(p => { const g = lawGain(p, law, from, to); if (g > 0.25) fav.push(p); else if (g < -0.25) contr.push(p); });
  const mine = lawGain(myPid(), law, from, to);
  return { pro, contro, fav, contr, mine, dc, dDef, dpop };
}
function manovraImpact(measures) {
  const pro = [], contro = [];
  let c = 0, pil = 0, pop = 0;
  measures.forEach(id => { const m = BUDGET_BY_ID[id]; c += m.c; pil += m.e.pil || 0; pop += m.e.pop || 0; });
  if (c > 0) contro.push({ k: 'eco', t: `Aumenta il deficit di ${fmt1(c)} miliardi (${fmt1(c / G.econ.pilNom * 100)}% del PIL)` });
  else pro.push({ k: 'eco', t: `Migliora i conti di ${fmt1(-c)} miliardi` });
  if (pil > 0) pro.push({ k: 'eco', t: `Crescita +${fmt1(pil)} punti di PIL` });
  if (pop > 1) pro.push({ k: 'pop', t: 'Misure popolari per famiglie e lavoratori' });
  if (pop < -1) contro.push({ k: 'pop', t: 'Contiene misure impopolari' });
  return { pro, contro, fav: [], contr: [], dc: c };
}

// ============================================================
//  PROPOSTE DEGLI ALTRI PARTITI
// ============================================================
function partyWish(pid) {
  const busy = new Set(G.bills.filter(b => !b.dead && b.lawId).map(b => b.lawId));
  const c = allLaws().filter(l => !l.custom && !l.cost && !busy.has(l.id)).map(l => {
    const bo = bestOpt(pid, l); if (bo === G.laws[l.id]) return null;
    return { l, bo, v: lawGain(pid, l, G.laws[l.id], bo) * (l.sal + 1) * (l.pp && l.pp[pid] !== undefined ? 1.6 : 1) + rnd(0, 0.6) };
  }).filter(x => x && x.v > 0.4).sort((a, b) => b.v - a.v);
  return c.length ? pick(c.slice(0, 5)) : null;
}
function partiesProposeTick() {
  if (G.phase !== 'normale') return;
  const active = G.bills.filter(b => !b.dead && b.proposer !== 'GOV' && b.proposer !== 'PLAYER').length;
  if (active >= 8 || !chance(0.35)) return;
  const pool = PIDS().filter(id => !(id === myPid() && isLeader())).filter(id => seatsOf(id, 'C') + seatsOf(id, 'S') > 0);
  const opp = pool.filter(id => !inGov(id));
  const pid = (opp.length && chance(0.75)) ? pick(opp) : pick(pool);
  if (!pid) return;
  const w = partyWish(pid); if (!w) return;
  const b = makeBill({ type: 'ddl', proposer: pid, lawId: w.l.id, opt: w.bo, house: chance(0.5) ? 'C' : 'S' });
  G.bills.push(b);
  addNews(`${P(pid).short} deposita una proposta di legge: «${w.l.opts[w.bo].t}» (${w.l.nome}).`, 'parl');
}

// ============================================================
//  INTERVISTE
// ============================================================
function interviewTopics(n) {
  const topics = [];
  const live = G.bills.filter(b => !b.dead && b.lawId).map(b => ({ law: getLaw(b.lawId), to: b.opt, from: G.laws[b.lawId], by: b.proposer }));
  live.sort(() => Math.random() - 0.5).slice(0, 2).forEach(x => { if (x.to !== x.from) topics.push(x); });
  const hot = allLaws().filter(l => !l.custom && l.sal >= 2 && !topics.some(t => t.law.id === l.id));
  while (topics.length < n && hot.length) {
    const l = hot.splice(Math.floor(Math.random() * hot.length), 1)[0];
    const others = l.opts.map((o, i) => i).filter(i => i !== G.laws[l.id]);
    topics.push({ law: l, to: pick(others), from: G.laws[l.id], by: null });
  }
  return topics.slice(0, n);
}
function interviewQuestion(t) {
  const l = t.law, o = l.opts[t.to];
  const who = t.by === 'GOV' ? 'Il governo' : t.by && t.by !== 'PLAYER' && G.parties[t.by] ? `${P(t.by).leader} (${P(t.by).short})` : null;
  const q = who ? `${who} propone «${o.t}». Lei come voterebbe?` : pick([
    `Parliamo di ${l.nome.toLowerCase()}. Lei è favorevole a «${o.t}»?`,
    `Molti chiedono «${o.t}». Qual è la sua posizione?`,
    `Gli italiani si dividono su ${l.nome.toLowerCase()}: «${o.t}», sì o no?`,
  ]);
  return { q, law: l, to: t.to, from: t.from, answers: [
    { t: 'Sì, convintamente', pos: o.pos, a: 'yes' },
    { t: 'No, è sbagliato', pos: l.opts[t.from].pos, a: 'no' },
    { t: 'Serve una via di mezzo', pos: (o.pos + l.opts[t.from].pos) / 2, a: 'mid' },
    { t: 'Attacca gli avversari e cambia discorso', pos: null, a: 'attack' },
  ] };
}
function answerInterview(qq, ans, show) {
  const p = G.player, mp = myParty(), l = qq.law;
  const out = { lines: [] };
  if (ans.a === 'attack') {
    const ok = p.car + rnd(-3, 3) > 6.5;
    p.fama = clamp(p.fama + (ok ? 2 : 1), 0, 100);
    mp.spinta += ok ? 0.6 : -0.4;
    G.cred = clamp(G.cred - 1, 0, 100);
    out.lines.push(ok ? 'La battuta funziona: la clip diventa virale sui social.' : 'Il conduttore incalza: «Non ha risposto alla domanda». Brutta figura.');
    out.good = ok; return out;
  }
  const partyPos = prefPos(myPid(), l);
  const coh = 1 - Math.abs(partyPos - ans.pos) / 10;
  const moodGain = (Math.abs(G.mood[l.ax] - l.opts[qq.from].pos) - Math.abs(G.mood[l.ax] - ans.pos)) / 10;
  const popOpt = ans.a === 'yes' ? (l.opts[qq.to].e.pop || 0) : ans.a === 'no' ? -(l.opts[qq.to].e.pop || 0) * 0.5 : 0;
  const spinta = coh * 0.8 + moodGain * l.sal * 0.8 + popOpt * 0.3 + (p.car - 6) * 0.15 + (ans.a === 'mid' ? -0.2 : 0);
  mp.spinta += spinta;
  p.fama = clamp(p.fama + (show ? show.reach : 2) * 0.8, 0, 100);
  if (coh < 0.3) {
    G.cred = clamp(G.cred - 4, 0, 100); out.lines.push('I tuoi elettori non capiscono: è l’opposto della linea del partito.');
    if (!isLeader()) { p.rap -= 6; p.fama += 2; out.lines.push(`${P(myPid()).leader} non gradisce l’uscita fuori linea.`); }
  } else if (coh > 0.75) { G.cred = clamp(G.cred + 1, 0, 100); out.lines.push('Risposta coerente con la linea: la base apprezza.'); if (!isLeader()) p.rap += 2; }
  if (moodGain > 0.2) out.lines.push('Sondaggio istantaneo: la maggioranza del pubblico è d’accordo con te.');
  else if (moodGain < -0.2) out.lines.push('Gran parte del pubblico la pensa diversamente.');
  PIDS().forEach(pid => {
    if (pid === myPid()) return;
    const g = (Math.abs(prefPos(pid, l) - l.opts[qq.from].pos) - Math.abs(prefPos(pid, l) - ans.pos)) / 10;
    if (Math.abs(g) > 0.3) addRel(pid, myPid(), g * 3);
  });
  if (isPremier()) G.gov.popBank += spinta * 0.3;
  out.good = spinta > 0.3; out.spinta = spinta;
  return out;
}
