// ============================================================
//  NOTIFICHE, AZIONI CONSIGLIATE, PROPOSTE DEI MINISTRI, RISULTATI RAPIDI
// ============================================================

// ---------- proposte dei ministri (solo da premier) ----------
const METRIC_MIN = { pil: 'MIMIT', deficit: 'MEF', spread: 'MEF', lavoro: 'LAV', prezzi: 'MASE', consenso: 'SOTT' };
function ministerProposal() {
  if (!isPremier() || G.phase !== 'normale') return null;
  if (G.flags.lastMinProp && G.week - G.flags.lastMinProp < 3) return null;
  const red = redMetrics();
  if (!red.length && !chance(0.15)) return null;
  if (red.length && !chance(0.55)) return null;
  const metric = red.length ? pick(red).k : pick(Object.keys(METRICS));
  G.flags.rejected = G.flags.rejected || {};
  const cands = [];
  bestLawsFor(metric, 10).filter(x => !x.l.cost && !(G.flags.rejected[x.l.id + ':' + x.i] > G.week)).forEach(x => {
    // il ministro competente per materia, altrimenti quello indicato per l'indicatore
    let mid = MINISTRIES.find(m => m.cats.includes(x.l.cat) && G.gov.ministers[m.id] && G.gov.ministers[m.id] !== G.player.name);
    if (!mid) mid = MIN_BY_ID[METRIC_MIN[metric]];
    const name = G.gov.ministers[mid.id];
    if (!name || name === G.player.name) return;
    // un ministro non propone riforme contrarie alle idee del suo partito
    const pp = person(name), party = pp && G.parties[pp.party] ? pp.party : null;
    if (party && lawGain(party, x.l, G.laws[x.l.id], x.i) < 0.05) return;
    if (G.gov.parties.reduce((t, gp) => t + lawGain(gp, x.l, G.laws[x.l.id], x.i), 0) < 0) return;
    cands.push({ x, mid, name });
  });
  if (!cands.length) return null;
  const c = pick(cands.slice(0, 2));
  G.flags.lastMinProp = G.week;
  return { k: 'minprop', lawId: c.x.l.id, opt: c.x.i, metric, min: c.mid.id, name: c.name };
}
function openMinisterProposal(sp) {
  const l = getLaw(sp.lawId);
  if (!l || G.laws[sp.lawId] === sp.opt || G.bills.some(b => !b.dead && b.lawId === sp.lawId) || !isPremier()) { G.queue.shift(); return processQueue(); }
  const o = l.opts[sp.opt], cur = G.laws[sp.lawId], m = METRICS[sp.metric];
  const pp = person(sp.name), party = pp && G.parties[pp.party] ? pp.party : null;
  const effs = effectsOf(l, cur, sp.opt), imp = impactOf(l, cur, sp.opt);
  window._mp = sp;
  openSheet(`<div class="evcard"><div class="img">${portrait(sp.name, 76, { party: party || undefined })}</div><div class="tiny gold center" style="font-weight:800">PROPOSTA DAL MINISTERO · ${esc(MIN_BY_ID[sp.min].n.toUpperCase())}</div>
    <h2>${esc(o.t)}</h2>
    <div class="txt center small">${esc(sp.name)}${party ? ` (${esc(P(party).short)})` : ''}: «Presidente, per migliorare <b>${m.n.toLowerCase()}</b> propongo questa riforma.»</div>
    <div class="change mt"><div><span class="tiny muted">OGGI</span><b>${esc(l.opts[cur].t)}</b></div><span class="arrow">${icon('chevron')}</span><div><span class="tiny muted">DIVENTEREBBE</span><b>${esc(o.t)}</b></div></div>
    <div class="mt">${explainHTML(l, sp.opt)}</div>
    ${effChipsHTML(effs, imp.mine)}
    <div class="row wrap mt" style="gap:4px"><span class="tiny muted">Favorevoli</span>${imp.fav.slice(0, 6).map(partyChip).join('')}</div>
    <div class="row wrap mt" style="gap:4px"><span class="tiny muted">Contrari</span>${imp.contr.slice(0, 6).map(partyChip).join('')}</div>
    <button class="choice" onclick="answerMinProp('ddl')"><div class="t">${icon('doc', 16)} Approva come disegno di legge · ⚡3</div><div class="fx"><span class="p">▲ ${esc(sp.name.split(' ').slice(-1)[0])} soddisfatto</span><span class="n">• passa dal Parlamento in qualche settimana</span></div></button>
    <button class="choice" onclick="answerMinProp('dl')"><div class="t">${icon('bolt', 16)} Approva come decreto-legge · ⚡5</div><div class="fx"><span class="p">▲ Effetti subito</span><span class="c">▼ Il Quirinale non ama i troppi decreti</span></div></button>
    <button class="choice" onclick="answerMinProp('no')"><div class="t">${icon('hand', 16)} Respingi la proposta</div><div class="fx"><span class="c">▼ Il ministro${party ? ' e ' + esc(P(party).short) : ''} si irritano</span></div></button>
    <button class="btn sm block mt" onclick="openLaw('${l.id}',${sp.opt})">Vedi tutti i pro e contro</button></div>`, { locked: true });
}
function answerMinProp(kind) {
  const sp = window._mp; const pp = person(sp.name); const party = pp && G.parties[pp.party] ? pp.party : null;
  if (kind !== 'no') {
    const cost = kind === 'dl' ? 5 : 3;
    if (G.pc < cost) return toast('Capitale politico insufficiente', 'bad');
    spendPC(cost);
    if (kind === 'dl') G.groups.quir -= 2;
    proposeBill(sp.lawId, sp.opt, kind, 'GOV', 'C');
    if (party && G.gov.sat[party] !== undefined && party !== myPid()) G.gov.sat[party] = clamp(G.gov.sat[party] + 5, 0, 100);
    closeSheet(); flyResult('folder', kind === 'dl' ? 'Decreto approvato' : 'Disegno di legge in Parlamento', [{ t: party && party !== myPid() ? `${P(party).short} soddisfatta` : 'Ministro soddisfatto', g: true }]);
  } else {
    G.flags.rejected = G.flags.rejected || {}; G.flags.rejected[sp.lawId + ':' + sp.opt] = G.week + 26;
    if (party && G.gov.sat[party] !== undefined && party !== myPid()) G.gov.sat[party] = clamp(G.gov.sat[party] - 4, 0, 100);
    closeSheet(); flyResult('hand', 'Proposta respinta', [{ t: party && party !== myPid() ? `${P(party).short} irritata` : 'Ministro deluso', g: false }]);
  }
  doneQueue();
}

// ---------- notifiche ----------
function pendingVoteIds() { return upcomingVotes(); }
function notifications() {
  const out = [];
  const pv = pendingVoteIds();
  if (pv.length) out.push({ ico: 'vote', t: `Devi votare ${pv.length} ${pv.length > 1 ? 'provvedimenti' : 'provvedimento'}`, sub: 'Si vota in aula questa settimana', on: 'openVotesNow()', u: 2 });
  if (G.queue.length) out.push({ ico: 'alert', t: `${G.queue.length} ${G.queue.length > 1 ? 'decisioni' : 'decisione'} in attesa`, sub: 'Imprevisti e scelte da fare', on: 'processQueue()', u: 2 });
  if (G.phase === 'formazione') out.push({ ico: 'building', t: 'Consultazioni in corso', sub: 'Va formato il governo', on: 'openFormation()', u: 2 });
  if (G.flags.manovraDue && isPremier()) out.push({ ico: 'euro', t: `Presenta la manovra ${G.flags.manovraDue}`, sub: 'Entro metà ottobre', on: `openManovra(${G.flags.manovraDue})`, u: 2 });
  if (isPremier()) {
    G.bills.filter(b => !b.dead && b.proposer === 'GOV' && b.stages[b.stage] && b.stages[b.stage].k === 'aula').forEach(b => { if (!predictVote(b).passed) out.push({ ico: 'alert', t: `«${billName(b)}» rischia la bocciatura`, sub: 'Valuta la fiducia', on: "goTab('aula')", u: 1 }); });
    G.bills.filter(b => !b.dead && b.type === 'dl' && b.proposer === 'GOV' && b.deadline - G.week <= 3).forEach(b => out.push({ ico: 'clock', t: `Il decreto «${billName(b)}» scade presto`, sub: weeksLeft(b.deadline), on: "goTab('aula')", u: 1 }));
    G.gov.parties.forEach(p => { if (p !== myPid() && G.gov.sat[p] < 30) out.push({ ico: 'fire', t: `${P(p).leader} è scontento`, sub: `${P(p).short} può aprire la crisi`, on: "openAction('vertice')", u: 1 }); });
  }
  redMetrics().forEach(r => out.push({ ico: METRICS[r.k].ico, t: r.t, sub: 'Tocca per vedere le leggi che aiutano', on: `openAdvice('${r.k}')`, u: isPremier() ? 1 : 0 }));
  if (isLeader() && !G.program && G.cal.election - G.week < 30 && G.cal.election > G.week) out.push({ ico: 'clipboard', t: 'Manca il programma elettorale', sub: 'Mettilo insieme dalle leggi', on: 'openProgram()', u: 1 });
  if (isLeader() && !coalitionOf(myPid()) && G.cal.election - G.week < 24 && G.cal.election - G.week > 6) out.push({ ico: 'hands', t: 'Corri da solo', sub: 'Cerca alleati prima del deposito delle liste', on: "UI.partiti='alleanze';goTab('partiti')", u: 0 });
  if (!isLeader() && G.player.rank >= 3 && G.player.rank < 6 && G.player.fama >= 28 && G.player.rap >= 30 && !usedThisWeek('promo')) out.push({ ico: 'trend', t: 'Puoi chiedere un incarico', sub: 'Hai fama e fiducia del leader', on: "openAction('promo')", u: 0 });
  if (!isLeader() && G.player.rank >= 3 && G.player.seguito >= 30 && G.player.fama >= 35) out.push({ ico: 'sword', t: 'Puoi sfidare il leader', sub: 'Congresso del partito', on: "openAction('congresso')", u: 0 });
  if (G.pc >= pcMax() && G.phase === 'normale') out.push({ ico: 'bolt', t: 'Capitale politico al massimo', sub: 'Usalo prima di andare avanti', on: "goTab('home')", u: 0 });
  if (G.player.stress > 75) out.push({ ico: 'sun', t: 'Sei molto stressato', sub: 'Un weekend di riposo ti aiuta', on: "openAction('riposo')", u: 0 });
  return out.sort((a, b) => b.u - a.u);
}
function urgentCount() { return notifications().filter(n => n.u >= 1).length; }
function openNotifications() {
  const list = notifications();
  openSheet(`${head('Notifiche')}${list.length ? `<div class="list">${list.map(n => `<div class="li click" onclick="closeSheet();${n.on}"><span class="nico ${n.u >= 2 ? 'u2' : n.u ? 'u1' : ''}">${emoIcon(n.ico, 19)}</span><div class="grow"><b class="small">${esc(n.t)}</b><div class="tiny muted">${esc(n.sub)}</div></div>${icon('chevron', 16)}</div>`).join('')}</div>` : `<div class="center mt2">${medal('check', 64)}<div class="muted mt">Tutto tranquillo: nessuna urgenza.</div></div>`}`);
}
function openVotesNow() {
  const ids = pendingVoteIds();
  if (!ids.length) return toast('Nessun voto per te questa settimana');
  openVotes(ids, true);
}

// ---------- azioni consigliate (un tocco) ----------
function recommendedActions() {
  const p = G.player, recs = [];
  const can = id => { const a = ACTIONS.find(x => x.id === id); try { return a && a.show() && !usedThisWeek(id) && G.pc >= actionCost(a) && G.funds >= (a.funds || 0); } catch (e) { return false; } };
  const add = (id, why, param) => { if (can(id) && !recs.some(r => r.id === id)) recs.push({ id, why, param }); };
  if (p.stress > 70) add('riposo', 'Sei stressato');
  if (isPremier()) { if (G.gov.parties.some(x => x !== myPid() && G.gov.sat[x] < 40)) add('vertice', 'Alleati inquieti'); if (G.gov.approval < 42) add('conferenza', 'Consenso in calo'); if (G.econ.spread > 150 || monthOf(G.week) === 8) add('bruxelles', 'Conti e Bruxelles'); }
  if (!isLeader() && p.rap < 25) add('lealta', 'Rapporto col leader');
  if (p.fama < 50 || (myPid() === 'MIO' && partyNoto('MIO') < 50)) add('tv', 'Fatti conoscere');
  // regione dove crescere: la tua o quella con più elettori dove sei debole
  const reg = REGIONS_DEF.slice().sort((a, b) => (b.el / (G.myReg[b.id] || 1)) - (a.el / (G.myReg[a.id] || 1)))[0];
  if (G.funds >= 20) add('comizio', `Cresci in ${reg.n}`, reg.id);
  if (isLeader() && G.funds < 60) add('fondi', 'Fondi bassi');
  if (myPid() === 'MIO' && G.org < 30 && G.funds >= 100) add('sedi', 'Più organizzazione');
  add('social', 'Visibilità online');
  if (!isLeader()) add('territorio', 'Seguito interno');
  return recs.slice(0, 3);
}
function quickAction(id, param) {
  if (id === 'comizio' && param) return doComizio(param);
  if (id === 'tv') return openTV();
  openAction(id);
}

// ---------- risultati rapidi (meno testo) ----------
function snap() { const p = G.player; return { fama: p.fama, rap: p.rap, seguito: p.seguito, stress: p.stress, funds: G.funds, cred: G.cred, org: G.org, appr: G.gov ? G.gov.popBank : 0, sp: myParty().spinta }; }
function diffChips(a, b) {
  const out = [], d = (k, label, good, f) => { const v = b[k] - a[k]; if (Math.abs(v) >= 0.5) out.push({ t: `${label} ${v > 0 ? '+' : ''}${f ? f(v) : Math.round(v)}`, g: (v > 0) === good }); };
  d('fama', 'Fama', true); d('rap', 'Leader', true); d('seguito', 'Seguito', true); d('stress', 'Stress', false); d('funds', 'Fondi', true, v => euro(Math.abs(v)).replace(/^/, v < 0 ? '-' : '')); d('cred', 'Credibilità', true); d('org', 'Organizzazione', true);
  if (b.appr - a.appr >= 0.3) out.push({ t: 'Consenso governo ▲', g: true }); else if (b.appr - a.appr <= -0.3) out.push({ t: 'Consenso governo ▼', g: false });
  if (b.sp - a.sp >= 0.3) out.push({ t: `${myParty().short} in crescita ▲`, g: true }); else if (b.sp - a.sp <= -0.3) out.push({ t: `${myParty().short} in calo ▼`, g: false });
  return out;
}
function flyResult(ico, title, chips, text) {
  const el = document.createElement('div');
  el.className = 'fly';
  el.innerHTML = `<div class="fly-in"><div class="row">${medal(ico, 46)}<div class="grow"><b>${esc(title)}</b>${text ? `<div class="tiny muted">${esc(text)}</div>` : ''}</div></div>${chips && chips.length ? `<div class="row wrap mt" style="gap:5px">${chips.map((c, i) => `<span class="eff ${c.g ? 'g' : 'b'}" style="animation-delay:${150 + i * 90}ms">${esc(c.t)}</span>`).join('')}</div>` : ''}</div>`;
  el.onclick = () => el.remove();
  document.body.appendChild(el);
  vib(15);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, 3200);
}
