// ============================================================
//  AGENDA, SETTIMANA, MANOVRA, CONSULTAZIONI, QUIRINALE
// ============================================================
const inCampaign = () => G.cal.election - G.week <= 8 && G.cal.election > G.week;
const ACTIONS = [
  // --- premier ---
  { id: 'vertice', n: 'Vertice di maggioranza', ico: 'hands', cost: 2, show: () => isPremier() && G.gov.parties.length > 1, fx: { sat: 7 }, d: 'Riunisci i leader della coalizione a Palazzo Chigi per ricucire.', run: () => { applyFx({ sat: 7, stress: 2 }); addNews('Vertice di maggioranza a Palazzo Chigi: «Coalizione compatta».', 'gov'); return 'I leader escono sorridenti. Almeno per ora.'; } },
  { id: 'conferenza', n: 'Conferenza stampa', ico: 'mic', cost: 2, show: () => isPremier(), fx: { appr: 1.5, fama: 2 }, risk: 'Con poco carisma può trasformarsi in un boomerang', d: 'Rivendica i risultati del governo davanti ai giornalisti.', run: () => { const ok = G.player.car + rnd(-3, 3) > 5.5; applyFx(ok ? { appr: 1.5, fama: 2 } : { appr: -1, fama: 1 }); return ok ? 'Messaggio chiaro: i TG riprendono le tue parole.' : 'Una domanda scomoda ti mette in difficoltà: è quella la clip che gira.'; } },
  { id: 'parti', n: 'Tavolo con le parti sociali', ico: 'factory', cost: 2, show: () => isPremier(), fx: { grp: { sind: 6, conf: 6 } }, d: 'Sindacati e Confindustria a Palazzo Chigi.', run: () => { applyFx({ grp: { sind: 6, conf: 6 } }); addNews(`Tavolo a Palazzo Chigi con ${INSTITUTIONS.cgil}, ${INSTITUTIONS.cisl}, ${INSTITUTIONS.uil} e ${INSTITUTIONS.confindustria}.`, 'gov'); return 'Clima costruttivo, impegni reciproci.'; } },
  { id: 'bruxelles', n: 'Missione a Bruxelles', ico: 'eu', cost: 3, show: () => isPremier(), fx: { grp: { ue: 8 } }, d: 'Incontri con la Commissione. Da settembre a novembre puoi chiedere flessibilità sui conti (+0,3% di deficit per difesa e +0,3% per energia).', run: () => {
      applyFx({ grp: { ue: 8 }, stress: 3 });
      const m = monthOf(G.week);
      if (m >= 8 && m <= 10 && (G.econ.flex || 0) < 0.6 && G.groups.ue > -20) { G.econ.flex = (G.econ.flex || 0) + 0.3; addNews(`${INSTITUTIONS.commissione} concede all’Italia flessibilità per ${G.econ.flex >= 0.6 ? 'difesa ed energia' : 'la difesa'}.`, 'good'); return `Ottenuta flessibilità: il limite di deficit per la prossima manovra sale al ${fmt1(3 + G.econ.flex)}%.`; }
      return 'Rapporti migliori con la Commissione europea.'; } },
  { id: 'rimpasto', n: 'Rimpasto', ico: 'refresh', cost: 4, show: () => isPremier(), d: 'Cambia i ministri. Chi perde il posto se lo ricorda.', custom: () => openCabinet('rimpasto') },
  { id: 'anticipate', n: 'Elezioni anticipate', ico: 'vote', cost: 5, show: () => isPremier() && G.cal.election - G.week > 20 && G.week - G.gov.start > 52, d: 'Chiedi al Quirinale di sciogliere le Camere. Serve un buon consenso e l’accordo degli alleati.', fx: {}, risk: 'Se gli alleati non ci stanno, si apre una crisi', run: () => {
      const avg = G.gov.parties.filter(p => p !== myPid()).reduce((s, p, i, a) => s + G.gov.sat[p] / a.length, 0) || 60;
      if (G.gov.approval >= 46 && avg >= 45) { G.cal.election = G.week + 9; addNews(`Il Presidente ${INSTITUTIONS.pdr} scioglie le Camere: elezioni anticipate il ${fmtDate(G.cal.election)}.`, 'parl'); return 'Si vota tra due mesi.'; }
      G.gov.parties.forEach(p => { if (p !== myPid()) G.gov.sat[p] -= 10; }); return 'Gli alleati non ci stanno e il Colle frena: «Prima verificare se esiste una maggioranza». Scontro nella coalizione.'; } },
  { id: 'dimissioni', n: 'Dimissioni', ico: 'door', cost: 0, show: () => isPremier(), d: 'Sali al Quirinale e rassegni le dimissioni. Si aprono le consultazioni: potresti anche ricevere un nuovo incarico.', risk: 'Puoi perdere Palazzo Chigi', custom: () => confirmSheet('Rassegnare le dimissioni?', '<p class="muted">Il governo cade e si aprono le consultazioni.</p>', 'Dimettiti', () => { openCrisis('dimissioni'); renderGame(); openFormation(); }, 'red') },
  // --- leader ---
  { id: 'tv', n: 'Intervista TV', ico: 'tv', cost: 1, show: () => true, d: 'Scegli un talk show e rispondi alle domande sui temi caldi. Ogni risposta ha pro e contro.', custom: () => openTV() },
  { id: 'social', n: 'Campagna social', ico: 'phone', cost: 1, funds: 10, show: () => true, fx: { fama: 2, my: 0.6 }, risk: '15% di rischio gaffe', d: 'Video, dirette e meme per farti conoscere.', run: () => { if (chance(0.15 - staffLiv('portavoce') * 0.025)) { applyFx({ fama: 2, my: -0.5 }); return 'Un post sbagliato scatena una shitstorm. Comunque se ne parla…'; } applyFx({ fama: 2, my: 0.6 }); return 'Buona risposta online, soprattutto tra i giovani.'; } },
  { id: 'comizio', n: 'Comizio in regione', ico: 'mega', cost: 1, funds: 20, show: () => true, d: 'Scegli una regione: cresce il radicamento locale e la notorietà.', custom: () => pickRegion(r => doComizio(r)) },
  { id: 'visita', n: 'Visita in regione', ico: 'map', cost: 2, show: () => isPremier(), d: 'Visita istituzionale con annunci per il territorio.', custom: () => pickRegion(r => doVisita(r)) },
  { id: 'incontro', n: 'Incontro con un leader', ico: 'cup', cost: 1, show: () => isLeader(), d: 'Migliora i rapporti con un altro partito.', custom: () => pickParty(id => doIncontro(id)) },
  { id: 'sedi', n: 'Apri sedi sul territorio', ico: 'building', cost: 2, funds: 100, show: () => isLeader() && myPid() === 'MIO', fx: { org: 6 }, d: 'Più organizzazione = più voti e campagne più efficaci.', run: () => { applyFx({ org: 6 }); REGIONS_DEF.forEach(r => G.myReg[r.id] += 0.02); return 'Inaugurate nuove sedi in tutta Italia.'; } },
  { id: 'fondi', n: 'Raccolta fondi', ico: 'coin', cost: 2, show: () => isLeader(), d: 'Cena con i donatori e appello ai sostenitori.', risk: 'Con bassa integrità può nascere un caso', run: () => { const k = Math.round(40 + G.player.fama * 3 + myParty().poll * 6); G.funds += k; if (G.player.integ <= 5 && chance(0.2)) { applyFx({ cred: -5, my: -0.8 }); addNews(`Polemica sui donatori di ${myParty().short}: tra gli ospiti un imprenditore indagato.`, 'bad'); return `Raccolti ${euro(k)}, ma un donatore imbarazzante finisce sui giornali.`; } return `Raccolti ${euro(k)}.`; } },
  { id: 'manif', n: 'Manifestazione nazionale', ico: 'flag', cost: 3, funds: 150, show: () => isLeader() && !isPremier(), fx: { my: 2.5, fama: 4 }, risk: 'Con poca organizzazione rischi una piazza vuota', d: 'Una grande piazza a Roma.', run: () => { const ok = G.org + rnd(0, 50) > 35; applyFx(ok ? { my: 2.5, fama: 4, stress: 5 } : { my: -0.5, fama: 2, stress: 5 }); addNews(ok ? `${myParty().short} riempie piazza del Popolo: «Siamo pronti a governare».` : `Piazza semivuota per ${myParty().short}: le foto fanno il giro dei social.`, ok ? 'mio' : 'bad'); return ok ? 'Piazza piena, immagini spettacolari.' : 'Piazza mezza vuota. Gli avversari ironizzano.'; } },
  { id: 'sfiducia', n: 'Mozione di sfiducia', ico: 'gavel', cost: 3, show: () => isLeader() && !inGov(myPid()) && myParty().seatsC > 0 && !!G.gov, fx: { fama: 3, my: 0.4 }, d: 'Chiedi al Parlamento di sfiduciare il governo. Quasi sempre viene respinta, ma fa notizia.', run: () => {
      const fake = { type: 'ddl', proposer: myPid(), lawId: null, stages: [{ k: 'aula', h: 'C' }], stage: 0 };
      let yes = 0, no = 0; PIDS().forEach(p => { const n = seatsOf(p, 'C'); if (inGov(p)) { if (G.gov.sat[p] < 12) yes += n; else no += n; } else if (compat(p, myPid()) > 20 || rel(p, myPid()) > -10) yes += n; });
      applyFx({ fama: 3, my: 0.4 });
      if (yes >= majority('C')) { addNews(`La Camera approva la mozione di sfiducia di ${myParty().short}: ${yes} sì. Il governo cade!`, 'mio'); openCrisis('sfiducia'); return 'CLAMOROSO: il governo è sfiduciato!'; }
      addNews(`Respinta la mozione di sfiducia di ${myParty().short}: ${yes} sì, ${no} no.`, 'parl'); return `Respinta (${yes} sì, ${no} no), ma l’opposizione ha guadagnato la scena.`; } },
  { id: 'crisi', n: 'Apri la crisi', ico: 'fire', cost: 4, show: () => role() === 'alleato', d: 'Ritiri i tuoi ministri e lasci la maggioranza.', risk: 'Gli elettori potrebbero non capire', custom: () => confirmSheet('Aprire la crisi di governo?', `<p class="muted">${esc(myParty().short)} esce dal ${esc(G.gov.name)}. Se senza di te non c’è maggioranza, si va alle consultazioni: potresti anche diventare premier.</p>`, 'Apri la crisi', () => {
      if (!spendPC(4)) return toast('Capitale politico insufficiente', 'bad');
      const rest = G.gov.parties.filter(p => p !== myPid()); G.player.minister = null;
      if (hasMajority(rest)) { G.gov.parties = rest; Object.keys(G.gov.ministers).forEach(k => { const pp = person(G.gov.ministers[k]); if (pp && pp.party === myPid()) delete G.gov.ministers[k]; }); addNews(`${myParty().short} esce dalla maggioranza, ma il governo ha ancora i numeri.`, 'parl'); renderGame(); }
      else { openCrisis('uscita', myPid()); renderGame(); openFormation(); } }, 'red') },
  // --- campagna elettorale ---
  { id: 'spot', n: 'Spot elettorali', ico: 'radio', cost: 1, funds: 300, show: () => isLeader() && inCampaign(), fx: { my: 2 }, d: 'Spot in TV e sui social nelle ultime settimane.', run: () => { applyFx({ my: 2 * (0.6 + G.org / 120) }); G.flags.hotCampaign = true; return 'Gli spot sono ovunque.'; } },
  { id: 'dibattito', n: 'Confronto TV tra leader', ico: 'podium', cost: 2, show: () => isLeader() && inCampaign(), d: 'Il grande dibattito prima del voto: domande difficili, milioni di spettatori.', custom: () => openTV(TALKSHOWS[0], true) },
  { id: 'primarie', n: 'Campagna per le primarie', ico: 'vote', cost: 2, show: () => G.primarie && G.primarie.player && !G.primarie.done, fx: { fama: 2 }, d: 'Gazebo, incontri e confronti con gli altri candidati.', run: () => { G.primarie.boost = (G.primarie.boost || 0) + 2 + G.player.car * 0.3; applyFx({ fama: 2 }); return 'I sondaggi delle primarie si muovono.'; } },
  // --- carriera ---
  { id: 'territorio', n: 'Lavoro sul territorio', ico: 'home', cost: 1, show: () => !isLeader(), fx: { seguito: 2, fama: 1, rap: 1 }, d: 'Assemblee, circoli, feste di partito.', run: () => { applyFx({ seguito: 2, fama: 1, rap: 1 }); G.myReg[G.player.region] = (G.myReg[G.player.region] || 1) + 0.03; return 'La base ti conosce e ti stima.'; } },
  { id: 'lealta', n: 'Sostieni il leader', ico: 'salute', cost: 1, show: () => !isLeader(), fx: { rap: 6, fama: 0.5 }, d: 'Difendi la linea del partito in pubblico.', run: () => { applyFx({ rap: 6, fama: 0.5 }); return `${myParty().leader} apprezza la tua lealtà.`; } },
  { id: 'corrente', n: 'Organizza la tua corrente', ico: 'puzzle', cost: 2, show: () => !isLeader() && G.player.rank >= 1, fx: { seguito: 5, rap: -3 }, d: 'Cene, chat, accordi con altri dirigenti.', run: () => { applyFx({ seguito: 5, rap: -3 }); return 'La tua area cresce dentro il partito.'; } },
  { id: 'promo', n: 'Chiedi un incarico', ico: 'trend', cost: 2, show: () => !isLeader() && G.player.rank < 6, d: 'Chiedi al leader più responsabilità. Serve un buon rapporto.', risk: 'Se il rapporto è freddo, peggiora', run: () => { const p = G.player; const need = [5, 12, 22, 28, 38, 50, 60][p.rank]; if (p.fama >= need * 0.8 && p.rap >= 25 && chance(0.5)) { return promote(p.rank + 1); } applyFx({ rap: -4 }); return `${myParty().leader}: «Non è ancora il momento».`; } },
  { id: 'congresso', n: 'Sfida il leader', ico: 'sword', cost: 6, show: () => !isLeader() && G.player.rank >= 3, d: 'Candidati alla guida del partito al congresso.', risk: 'Se perdi, il rapporto col leader crolla', custom: () => {
      const p = G.player; if (p.seguito < 30 || p.fama < 35) { openSheet(`${head('Non ancora')}<p class="muted">Per sfidare ${esc(myParty().leader)} servono almeno il 30% di seguito interno (hai ${fmt0(p.seguito)}%) e 35 di fama (hai ${fmt0(p.fama)}).</p>`); return; }
      confirmSheet('Sfidare il leader al congresso?', `<p class="muted">Probabilità stimata di vittoria: <b>${Math.round(clamp(0.5 + (p.seguito * 1.1 + p.fama * 0.4 + p.car * 2 - leaderStrength(myPid())) / 60, 0.05, 0.92) * 100)}%</b>.</p>`, 'Al congresso!', () => { if (!spendPC(6)) return toast('Capitale politico insufficiente', 'bad'); markUsed('congresso'); const r = challengeLeader(); if (r.ok) confetti(); resultSheet(r.ok ? 'trophy' : 'frown', r.ok ? 'Hai vinto il congresso!' : 'Congresso perso', r.ok ? `Ora guidi ${esc(myParty().name)}. Decidi tu linea, alleanze e candidature.` : 'Il leader resta in sella. Ricostruisci, oppure valuta una scissione.'); renderGame(); }, 'gold'); } },
  { id: 'scissione', n: 'Fonda il tuo partito', ico: 'split', cost: 6, show: () => !isLeader() && G.player.rank >= 2, d: 'Lasci il partito e ne fondi uno tuo, portando con te chi ti segue. Come Vannacci con Futuro Nazionale.', risk: 'Rottura definitiva con il vecchio partito', custom: () => openScissione() },
  { id: 'riposo', n: 'Weekend di riposo', ico: 'sun', cost: 0, show: () => true, fx: { stress: -15 }, d: 'Spegni il telefono. Perdi il capitale politico rimasto.', run: () => { applyFx({ stress: -15, salute: 3 }); G.pc = 0; return 'Torni con le idee più chiare.'; } },
];
function actionCost(a) { return a.id === 'tv' && isPremier() ? 2 : a.cost; }
const ACT_COLORS = ['#38bdf8', '#a78bfa', '#fb923c', '#22c55e', '#f472b6', '#facc15', '#2dd4bf', '#f87171', '#818cf8', '#4ade80'];
// ogni azione una volta a settimana
const usedThisWeek = id => G.usedActs && G.usedActs[id] === G.week;
function markUsed(id) { G.usedActs = G.usedActs || {}; G.usedActs[id] = G.week; }
function availableActions() {
  return ACTIONS.filter(a => { try { return a.show(); } catch (e) { return false; } }).map((a, i) => ({ id: a.id, n: a.n, ico: a.ico, cost: actionCost(a), ac: a.ac || ACT_COLORS[i % ACT_COLORS.length], done: usedThisWeek(a.id), ok: !usedThisWeek(a.id) && G.pc >= actionCost(a) && G.funds >= (a.funds || 0) && G.phase === 'normale' }));
}
function openAction(id) {
  const a = ACTIONS.find(x => x.id === id);
  if (!a) return;
  if (G.phase !== 'normale') return toast('Prima completa le consultazioni', 'bad');
  if (usedThisWeek(id)) return toast('Già fatto questa settimana: riprova la prossima', 'bad');
  const cost = actionCost(a);
  const pc = fxProCon(a.fx || {});
  if (cost) pc.contro.push({ k: 'pol', t: `Costa ${cost} capitale politico` });
  if (a.funds) pc.contro.push({ k: 'per', t: `Costa ${euro(a.funds)}` });
  if (a.risk) pc.contro.push({ k: 'pol', t: a.risk });
  const enough = G.pc >= cost && G.funds >= (a.funds || 0);
  openSheet(`<div class="sheet-head"><div class="row grow">${medal(a.ico, 56)}<div class="grow"><h2 style="font-size:22px">${esc(a.n)}</h2>${cost || a.funds ? `<div class="tiny gold" style="font-weight:800;letter-spacing:.08em">COSTA ${cost ? '⚡' + cost : ''}${cost && a.funds ? ' · ' : ''}${a.funds ? euro(a.funds) : ''}</div>` : ''}</div></div><button class="xbtn" onclick="closeSheet()">${icon('x', 18)}</button></div><p class="muted">${esc(a.d)}</p><div class="effs">${pc.pro.map(x => `<span class="eff g">▲ ${esc(x.t)}</span>`).join("")}${pc.contro.map(x => `<span class="eff b">▼ ${esc(x.t)}</span>`).join("")}</div>
    ${routineToggleHTML(a)}<button class="btn pri block mt2" ${enough ? '' : 'disabled'} onclick="runAction('${a.id}')">${enough ? 'Procedi' : (G.pc < cost ? 'Capitale politico insufficiente' : 'Fondi insufficienti')}</button>`);
}
function runAction(id) {
  const a = ACTIONS.find(x => x.id === id);
  closeSheet();
  if (a.custom) { a.custom(); return; }
  if (!spendPC(actionCost(a))) return toast('Capitale politico insufficiente', 'bad');
  markUsed(id);
  const before = snap();
  if (a.funds) G.funds -= a.funds;
  const r = a.run();
  vib();
  renderGame();
  if (G.phase === 'formazione') { openFormation(); return; }
  flyResult(a.ico, a.n, diffChips(before, snap()), r);
}
function resultSheet(ico, title, text) {
  openSheet(`<div class="center">${medal(ico, 84)}<h2 class="mt">${esc(title)}</h2><p class="muted">${text}</p></div><button class="btn pri block mt" onclick="closeSheet()">OK</button>`);
}
function pickRegion(cb) {
  window._pickCb = cb;
  openSheet(`${head('Scegli la regione')}<div class="list">${REGIONS_DEF.map(r => `<div class="li click" onclick="closeSheet();window._pickCb('${r.id}')"><div class="grow"><b class="small">${r.n}</b><div class="tiny muted">${fmt1(r.el)} mln elettori · ${esc(myParty().short)} al ${fmt1(regionShares(r.id)[myPid()])}%</div></div>${icon('chevron', 16)}</div>`).join('')}</div>`);
}
function pickParty(cb) {
  window._pickCb = cb;
  openSheet(`${head('Con chi?')}<div class="list">${PIDS().filter(id => id !== myPid()).map(id => `<div class="li click" onclick="closeSheet();window._pickCb('${id}')">${partyChip(id)}<div class="grow small">${esc(P(id).leader)}</div><span class="small" style="color:${relColor(rel(id, myPid()))}">${rel(id, myPid()) > 0 ? '+' : ''}${fmt0(rel(id, myPid()))}</span></div>`).join('')}</div>`);
}
function doComizio(rid) {
  if (usedThisWeek('comizio')) return toast('Hai già fatto un comizio questa settimana', 'bad');
  if (G.funds < 20) return toast('Fondi insufficienti', 'bad');
  if (!spendPC(1)) return toast('Capitale politico insufficiente', 'bad');
  G.funds -= 20; markUsed('comizio');
  const r = REGIONS_DEF.find(x => x.id === rid);
  const k = (inCampaign() ? 2 : 1) * (0.6 + G.player.car / 15);
  G.myReg[rid] = (G.myReg[rid] || 1) + 0.12 * k;
  myParty().spinta += 0.15 * k * Math.sqrt(r.el) * (isLeader() ? 1 : 0.3);
  G.player.fama = clamp(G.player.fama + 1, 0, 100);
  if (!isLeader()) G.player.seguito = clamp(G.player.seguito + 1, 0, 100);
  addNews(`${G.player.name} in ${r.n}: ${pick(['piazza piena', 'sala gremita', 'incontro con i lavoratori', 'tour nei mercati rionali', 'confronto con gli studenti'])}.`, 'mio');
  if (typeof addPin === 'function') addPin(rid, 'mega', 'Comizio');
  renderGame(); flyResult('mega', `Comizio in ${r.n}`, [{ t: 'Radicamento locale ▲', g: true }, { t: 'Fama +1', g: true }, { t: 'Fondi −20k€', g: false }]);
}
function doVisita(rid) {
  if (usedThisWeek('visita')) return toast('Hai già fatto una visita questa settimana', 'bad');
  if (!spendPC(2)) return toast('Capitale politico insufficiente', 'bad');
  markUsed('visita');
  const r = REGIONS_DEF.find(x => x.id === rid);
  G.myReg[rid] = (G.myReg[rid] || 1) + 0.1; G.gov.popBank += 0.4 + r.el * 0.08;
  addNews(`Il premier ${G.player.name} in visita in ${r.n} con il presidente ${G.regions[rid].gov}.`, 'gov');
  renderGame(); toast(`Visita in ${r.n}`, 'good');
}
function doIncontro(id) {
  if (usedThisWeek('incontro')) return toast('Hai già fatto un incontro questa settimana', 'bad');
  if (!spendPC(1)) return toast('Capitale politico insufficiente', 'bad');
  markUsed('incontro');
  const g = Math.round(4 + G.player.car * 0.8 + rnd(-2, 3));
  addRel(id, myPid(), g);
  if (G.gov && G.gov.sat[id] !== undefined && isPremier()) G.gov.sat[id] = clamp(G.gov.sat[id] + 4, 0, 100);
  renderGame(); flyResult('cup', `Incontro con ${P(id).leader}`, [{ t: `Rapporto con ${P(id).short} +${g}`, g: true }]);
}
function doPropose(id, opt, type) {
  const cost = isPremier() ? { ddl: 3, dl: 5, cost: 6 }[type] : 2;
  const l = getLaw(id);
  if (isPremier() && type === 'dl' && G.gov.decreti.filter(x => G.week - x < 12).length >= 5 && G.groups.quir < 0) {
    closeSheet(); resultSheet('building', 'Il Quirinale non firma', `${INSTITUTIONS.pdr} rifiuta di emanare un altro decreto: «mancano i requisiti di necessità e urgenza». Presentalo come disegno di legge.`); G.groups.quir -= 3; return;
  }
  if (!spendPC(cost)) return toast('Capitale politico insufficiente', 'bad');
  const proposer = isPremier() ? 'GOV' : 'PLAYER';
  proposeBill(id, opt, type, proposer, 'C');
  if (!isPremier()) { G.player.fama = clamp(G.player.fama + 1.5, 0, 100); myParty().spinta += 0.3 * l.sal; }
  if (isPremier() && type === 'dl') G.groups.quir -= 2;
  closeSheet(); renderGame();
  toast(type === 'dl' ? 'Decreto in vigore: convertilo entro 60 giorni' : 'Proposta depositata in Parlamento', 'good');
}
function doUltimatum(id, opt) {
  if (!spendPC(3)) return toast('Capitale politico insufficiente', 'bad');
  const l = getLaw(id); const pp = G.gov.premierParty;
  const g = lawGain(pp, l, G.laws[id], opt);
  closeSheet();
  if (g > -0.35 || myParty().seatsC > 40 && chance(0.4)) { proposeBill(id, opt, 'ddl', 'GOV', 'C'); G.gov.sat[myPid()] = clamp((G.gov.sat[myPid()] || 50) + 10, 0, 100); resultSheet('fist', 'Ultimatum accolto', `${esc(G.gov.premier)} accetta: il governo presenta «${esc(l.opts[opt].t)}».`); }
  else { addRel(pp, myPid(), -8); resultSheet('hand', 'Ultimatum respinto', `${esc(G.gov.premier)}: «Non è nel programma». Tensione nella maggioranza.`); }
  renderGame();
}
function doMinisterPropose(id, opt) {
  if (!spendPC(2)) return toast('Capitale politico insufficiente', 'bad');
  const l = getLaw(id); const g = lawGain(G.gov.premierParty, l, G.laws[id], opt);
  closeSheet();
  if (g > -0.2) { proposeBill(id, opt, 'ddl', 'GOV', 'C'); G.player.fama += 2; resultSheet('building', 'Via libera del Consiglio dei ministri', `Il tuo disegno di legge «${esc(l.opts[opt].t)}» va in Parlamento.`); }
  else resultSheet('hand', 'Il premier frena', 'Palazzo Chigi rinvia la tua proposta: «Non è una priorità».');
  renderGame();
}
function doReferendum(id, opt) {
  if (G.funds < 200) return toast('Servono 200k€ per la raccolta firme', 'bad');
  if (!spendPC(4)) return toast('Capitale politico insufficiente', 'bad');
  G.funds -= 200;
  const ok = chance(clamp(0.3 + G.org / 120 + G.player.fama / 200, 0.2, 0.95));
  closeSheet();
  if (ok) {
    const y = yearOf(G.week) + (monthOf(G.week) >= 2 ? 1 : 0);
    const w = weekOf(`${y}-05-24`);
    G.referendums.push({ kind: 'abr', lawId: id, opt, w, by: 'PLAYER' });
    applyFx({ fama: 4, my: 0.8 });
    addNews(`${myParty().short} deposita in Cassazione oltre 500.000 firme per un referendum su «${getLaw(id).nome}». Si vota il ${fmtDate(w)}.`, 'mio');
    resultSheet('pen', 'Firme raccolte!', `Il referendum si terrà il ${fmtDate(w)}. Ricorda: serve il quorum del 50% + 1.`);
  } else resultSheet('chartdown', 'Firme insufficienti', 'La raccolta non raggiunge le 500.000 firme valide. Serve più organizzazione sul territorio.');
  renderGame();
}
function doObstr(id) {
  if (!spendPC(2)) return toast('Capitale politico insufficiente', 'bad');
  const b = G.bills.find(x => x.id === id);
  b.obstr = (b.obstr || 0) + 2;
  applyFx({ fama: 2, my: 0.3 });
  G.gov.parties.forEach(p => addRel(p, myPid(), -3));
  addNews(`Ostruzionismo di ${myParty().short} su «${billName(b)}»: migliaia di emendamenti.`, 'mio');
  renderGame(); toast('Iter rallentato di 2 settimane', 'good');
}
function togglePromise(id, opt) {
  const i = G.promises.findIndex(pr => pr.lawId === id && pr.opt === opt);
  if (i >= 0) { if (G.promises[i].pact) return toast('È un impegno preso con gli alleati', 'bad'); G.promises.splice(i, 1); if (G.program) G.cred = clamp(G.cred - 3, 0, 100); toast('Tolta dal programma'); }
  else { G.promises = G.promises.filter(pr => !(pr.lawId === id && !pr.kept && !pr.pact)); G.promises.push({ lawId: id, opt, w: G.week }); if (G.program) myParty().spinta += 0.3; toast('Aggiunta al programma', 'good'); }
  openLaw(id, opt);
}

// ============================================================
//  INTERVISTE
// ============================================================
let TVS = null;
function openTV(show, debate) {
  if (show) return startInterview(show, debate);
  const row = (s, i) => `<div class="li click" onclick="closeSheet();startInterview(TALKSHOWS[${i}])"><span class="nico">${icon(s.t === 'podcast' ? 'mic' : s.t === 'live' ? 'phone' : s.t === 'carta' ? 'news' : 'tv')}</span><div class="grow"><b>${esc(s.n)}</b><div class="tiny muted">${esc(s.ch)} · pubblico ${s.t === 'podcast' || s.t === 'live' ? 'giovane' : s.lean < -0.3 ? 'progressista' : s.lean > 0.3 ? 'conservatore' : 'generalista'} · ${'★'.repeat(s.reach)}</div></div>${icon('chevron', 16)}</div>`;
  const grp = (t, title) => sec(title) + `<div class="card tight"><div class="list">${TALKSHOWS.map((s, i) => (s.t || 'tv') === t ? row(s, i) : '').join('')}</div></div>`;
  openSheet(`${head('Dove vai a parlare?', 'TV, giornali, podcast o social')}${grp('tv', 'In TV')}${grp('carta', 'Giornali e siti')}${grp('podcast', 'Podcast')}${grp('live', 'Social')}`);
}
function startInterview(show, debate) {
  const cost = debate ? 2 : (isPremier() ? 2 : 1);
  const aid = debate ? 'dibattito' : 'tv';
  if (usedThisWeek(aid)) return toast('Hai già fatto un’intervista questa settimana', 'bad');
  if (!spendPC(cost)) return toast('Capitale politico insufficiente', 'bad');
  markUsed(aid);
  G.stats.tv = (G.stats.tv || 0) + 1;
  const topics = interviewTopics(3);
  // nel confronto TV c'è un avversario in studio: il leader del primo partito rivale
  const opp = debate ? PIDS().filter(p => p !== myPid() && !(coalitionOf(p) && coalitionOf(p) === coalitionOf(myPid()))).sort((a, b) => P(b).poll - P(a).poll)[0] : null;
  ensureStory(); const iv = interviewerOf(show), jj = iv.j || null;
  TVS = { show, debate, opp, j: debate ? null : jj, iv: debate ? null : iv, qs: topics.map(t => interviewQuestion(t, show)), i: 0, log: [], before: myParty().poll, app: clamp(50 + staffLiv('portavoce') * 3 + (debate || !jj ? 0 : jj.rel / 6), 30, 70), secs: debate ? 20 : 30, read: 4 };
  G.player.stress = clamp(G.player.stress + 3, 0, 100);
  openSheet('', { full: true, locked: true });
  renderInterview();
}
function gaugeHTML(v) { return `<div class="gauge"><div class="row between tiny"><span class="bad">${icon('frown', 16)}</span><b>Gradimento del pubblico ${Math.round(v)}%</b><span class="good">${icon('smile', 16)}</span></div><div class="bar"><i style="width:${v}%;--c:${v >= 55 ? '#2ecc71' : v >= 40 ? '#ffb547' : '#ff5c5c'}"></i></div></div>`; }
function renderInterview() {
  const s = TVS, qq = s.qs[s.i];
  clearTimeout(s.timer);
  if (!qq) return finishInterview();
  replaceSheet(`<div class="row between"><span class="tag o">${esc(s.show.n)} · ${esc(s.show.ch)}</span><span class="small muted">Domanda ${s.i + 1}/${s.qs.length}</span></div>
    ${gaugeHTML(s.app)}
    <div class="row mt" style="justify-content:center;gap:22px">${portrait(G.player.name, 62, { party: myPid() })}${s.opp ? `<b class="gold" style="align-self:center">VS</b>${leaderPortrait(s.opp, 62)}` : TVS.iv ? interviewerFace(TVS.iv) : medal('mic', 62)}</div>
    <div class="small muted center mt">${s.debate ? 'Il moderatore chiede:' : s.iv ? esc(s.iv.who) + (s.iv.plur ? ' chiedono:' : ' chiede:') : 'Il conduttore chiede:'}</div>
    <div class="big-q center mt">${esc(qq.q)}</div>
    <div class="timer mt"><i style="animation-duration:${s.secs}s;--delay:${s.read}s"></i></div><div class="tiny muted center">Hai ${s.secs} secondi per rispondere (il tempo parte tra ${s.read} secondi)</div>
    <div class="qcard mt">${qq.explain || ''}</div>
    <div class="mt">${qq.answers.map((a, i) => `<button class="choice" style="animation-delay:${i * 70}ms" onclick="pickAnswer(${i})"><div class="t">${esc(a.t)}</div><div class="fx">${a.pre.pro.map(x => `<span class="p">▲ ${esc(x.t)}</span>`).join('')}${a.pre.contro.map(x => `<span class="c">▼ ${esc(x.t)}</span>`).join('')}</div></button>`).join('')}</div>`);
  s.timer = setTimeout(() => { if (TVS === s && s.qs[s.i] === qq) pickAnswer(-1); }, (s.secs + s.read) * 1000);
}
function pickAnswer(i) {
  const s = TVS, qq = s.qs[s.i];
  clearTimeout(s.timer);
  const show = Object.assign({}, s.show, { reach: s.debate ? 4 : s.show.reach });
  let r, at;
  if (i < 0) { applyFx({ my: -0.5, fama: 1, cred: -1 }); r = { good: false, lines: ['Silenzio imbarazzante: il tempo è scaduto e il conduttore passa oltre.'] }; at = '(nessuna risposta)'; }
  else { const a = qq.answers[i]; r = a.apply(show); at = a.t; }
  s.app = clamp(s.app + (r.good ? rnd(8, 15) : -rnd(7, 13)), 5, 95);
  s.log.push({ q: qq.q, a: at, r });
  vib(20);
  const reply = s.opp ? `<div class="card tight mt"><div class="row">${leaderPortrait(s.opp, 40)}<div class="small grow"><b>${esc(P(s.opp).leader)}</b>: «${esc(pick(r.good ? ['Belle parole, ma i fatti dicono altro.', 'Facile parlare dall’opposizione.', 'Gli italiani non ci cascano.'] : ['Ecco, lo vedete? Nessuna risposta concreta.', 'Confusione totale, come sempre.', 'Il pubblico ha capito benissimo.']))}»</div></div></div>` : '';
  replaceSheet(`${gaugeHTML(s.app)}<div class="center mt2">${medal(r.good ? 'smile' : 'frown', 76, r.good ? '#7ee8b8' : '#ff9c9c')}<h3 class="mt">${r.good ? 'Risposta efficace' : 'Risposta che divide'}</h3></div>
    <div class="card mt">${r.lines.map(x => `<div class="small" style="padding:4px 0">• ${esc(x)}</div>`).join('') || '<div class="small muted">Il pubblico prende nota.</div>'}</div>${reply}
    <button class="btn pri block mt2" onclick="TVS.i++;renderInterview()">${s.i + 1 < s.qs.length ? 'Prossima domanda ›' : 'Fine intervista'}</button>`);
}
function finishInterview() {
  const s = TVS;
  const good = s.log.filter(x => x.r.good).length;
  const win = s.app >= 55;
  if (s.j) s.j.rel = clamp(s.j.rel + (win ? 5 : -3), -100, 100);
  if (s.debate) { myParty().spinta += (s.app - 50) / 10; G.player.fama = clamp(G.player.fama + 5, 0, 100); if (s.opp) P(s.opp).spinta -= (s.app - 50) / 20; }
  addNews(s.debate && s.opp ? `Confronto TV: ${G.player.name} contro ${P(s.opp).leader}. Gradimento ${Math.round(s.app)}% per ${G.player.name}.` : `${G.player.name} ospite di ${s.show.n} (${s.show.ch}): ${win ? 'prova convincente' : good === 1 ? 'luci e ombre' : 'serata difficile'}.`, win ? 'mio' : 'info');
  replaceSheet(`<div class="center mt2">${medal(win ? 'trophy' : s.app >= 40 ? 'smile' : 'frown', 84)}<h2 class="mt">${s.debate ? (win ? 'Hai vinto il confronto' : 'Confronto perso') : (win ? 'Promosso dal pubblico' : s.app >= 40 ? 'Così così' : 'Serata da dimenticare')}</h2></div>${gaugeHTML(s.app)}
    <div class="card tight mt">${s.log.map(x => `<div class="small" style="padding:6px 0;border-bottom:1px solid var(--line)"><div class="muted">${esc(x.q)}</div><b>${esc(x.a)}</b> ${x.r.good ? '<span class="good">✓</span>' : '<span class="bad">✗</span>'}</div>`).join('')}</div>
    <button class="btn pri block mt2" onclick="closeSheet();renderGame()">Chiudi</button>`);
  if (win) confetti();
  TVS = null;
}

// ============================================================
//  SETTIMANA
// ============================================================
function nextWeek() {
  if (G.phase === 'formazione') return openFormation();
  if (G.queue.length) return processQueue();
  const auto = runRoutine();
  const before = { poll: myParty().poll, appr: G.gov ? G.gov.approval : null, spread: G.econ.spread };
  const s = advanceWeek();
  if (!s) return;
  // eventi speciali in testa alla coda
  const sp = s.specials.map(x => ({ sp: x }));
  G.queue = sp.concat(G.queue);
  saveGame('auto');
  renderGame();
  vib(12);
  showWeekSummary(s, before, auto);
  if (s.ach && s.ach.length) setTimeout(() => celebrate(s.ach), 600);
}
function showWeekSummary(s, before, auto) {
  const dPoll = myParty().poll - before.poll, dSp = G.econ.spread - before.spread;
  const dA = G.gov && before.appr !== null ? G.gov.approval - before.appr : null;
  // la notizia più importante va in prima pagina
  const prio = { mio: 5, bad: 4, good: 3, gov: 2, parl: 2, eco: 1, info: 0 };
  const sorted = s.news.slice().sort((a, b) => (prio[b.k] || 0) - (prio[a.k] || 0));
  const top = sorted[0], rest = sorted.slice(1);
  const kpi = (l, v, d, good, c) => `<div class="kpi center" style="--kc:${c}"><div class="l">${l}</div><div class="v">${v}</div>${d !== null ? `<div class="tiny ${good ? 'good' : 'bad'}">${d}</div>` : ''}</div>`;
  // M2: ogni voto chiuso con un timbro · M5: l'emiciclo del primo voto si accende seggio per seggio
  const votes = s.votes.map(({ bill, v }, i) => `<div class="vrow" style="animation-delay:${300 + i * 250}ms"><span class="stamp-s ${v.passed ? 'good' : 'bad'}" style="animation-delay:${400 + i * 250}ms">${v.passed ? 'APPROVATA' : 'RESPINTA'}</span><div class="grow"><b class="small">${esc(billName(bill))}</b><div class="tiny muted">${v.h === 'C' ? 'Camera' : 'Senato'} · sì ${v.yes} · no ${v.no}${G.myPersonal[bill.id] && G.player.parl === v.h ? ` · tu: ${VLAB[G.myPersonal[bill.id]]}` : ''}</div></div></div>`).join('');
  const v0 = s.votes.find(x => x.v && x.v.by);
  // V4: il riepilogo come telegiornale delle 20
  const j = typeof anchor === 'function' ? anchor() : null;
  openSheet(`<div class="tgw"><div class="live"><i></i>TG PALAZZO · ORE 20</div><div class="dt">${fmtDate(G.week).toUpperCase()} · SETTIMANA ${G.week}</div>${j ? `<div class="face">${jPortrait(j, 78)}</div><div class="who">${esc(j.n)}</div>` : ''}
    <div class="lt"><span class="a">${top && top.k === 'bad' ? 'ULTIM’ORA' : 'IN APERTURA'}</span><div class="b">${top ? esc(top.t) : 'Settimana tranquilla nei palazzi della politica'}</div></div>
    <div class="crawl"><span>${rest.length ? rest.slice(0, 6).map(n => esc(n.t)).join(' · ') + ' ·' : 'Nessun’altra notizia dai palazzi della politica ·'}</span></div></div>
    <div class="grid3 mt">${kpi(esc(myParty().short), fmt1(myParty().poll) + '%', (dPoll >= 0 ? '▲ ' : '▼ ') + fmt1(Math.abs(dPoll)), dPoll >= 0, myParty().color)}
    ${dA !== null ? kpi('Governo', fmt0(G.gov.approval) + '%', (dA >= 0 ? '▲ ' : '▼ ') + fmt1(Math.abs(dA)), dA >= 0, '#ffd60a') : kpi('Fama', fmt0(G.player.fama), null, true, '#a78bfa')}
    ${kpi('Spread', fmt0(G.econ.spread), (dSp >= 0 ? '▲ ' : '▼ ') + fmt0(Math.abs(dSp)), dSp <= 0, '#f472b6')}</div>
    ${auto && auto.length ? `${sec('Fatto in automatico')}<div class="effs mt">${auto.map(a => `<span class="eff g">${icon(a.ico, 13)} ${esc(a.n)}</span>`).join('')}</div>` : ''}
    ${votes ? `${sec('Votazioni in aula')}${v0 ? `<div class="card tight">${hemicycle(v0.v.h, { id: 'hemi-week', empty: true, slow: true })}<div class="tiny muted center">${esc(billName(v0.bill))}</div></div>` : ''}<div class="card tight">${votes}</div>` : ''}
    ${rest.length ? `${sec('In breve')}<div class="mt">${rest.slice(0, 4).map(n => `<div class="news-item"><span class="nk-${n.k}">${esc(n.t)}</span></div>`).join('')}</div>${rest.length > 4 ? `<details class="mt"><summary class="small gold">Altre ${rest.length - 4} notizie</summary>${rest.slice(4).map(n => `<div class="news-item"><span class="nk-${n.k}">${esc(n.t)}</span></div>`).join('')}</details>` : ''}` : ''}
    <button class="btn ${G.queue.length ? 'gold' : 'pri'} block mt2" onclick="closeSheet();${G.queue.length ? 'setTimeout(processQueue,280)' : ''}">${G.queue.length ? `Continua · ${G.queue.length} da decidere ›` : 'Continua'}</button>`);
  if (v0) setTimeout(() => animateVote(document.getElementById('hemi-week'), v0.v.by), 450);
}
function processQueue() {
  if (!G.queue.length) { renderGame(); return; }
  const item = G.queue[0];
  if (item.sp) return handleSpecial(item.sp);
  showEvent(item);
}
function doneQueue() { G.queue.shift(); saveGame('auto'); renderGame(); if (G.phase === 'formazione') { setTimeout(openFormation, 300); return; } if (G.queue.length) setTimeout(processQueue, 300); }
function showEvent(item) {
  let v;
  try { v = eventView(item); } catch (e) { console.error(e); G.queue.shift(); renderGame(); return; }
  window._ev = { item, v };
  const ev = EVENT_BY_ID[item.id] || {};
  clearTimeout(window._evTimer);
  const tm = ev.timer ? `<div class="timer mt"><i style="animation-duration:${ev.timer}s"></i></div><div class="tiny warn center" style="margin-top:4px;font-weight:800">Hai ${ev.timer} secondi, poi decide il tuo staff</div>` : '';
  if (ev.timer) window._evTimer = setTimeout(() => { if (window._ev && window._ev.item === item && !window._ev.done) { window._ev.staff = true; chooseEvent(staffPick(v.choices)); } }, ev.timer * 1000);
  openSheet(`<div class="evcard">${eventTopHTML(ev, item, v)}${tm}
    <div class="mt">${v.choices.map((ch, i) => `<button class="choice" style="animation-delay:${200 + i * 80}ms" onclick="chooseEvent(${i})"><div class="t">${esc(ch.t)}</div>${fxChips(ch.fx, ch.run && !ch.fx ? '<span class="n">• esito incerto</span>' : '')}</button>`).join('')}</div></div>`, { locked: true });
  setTimeout(() => { if (typeof animCounters === 'function') animCounters(); }, 250);
}
function chooseEvent(i) {
  const { item, v } = window._ev; const c = v.choices[i];
  if (window._ev.done) return; window._ev.done = true; clearTimeout(window._evTimer);
  if (typeof maybeHiddenPrice === 'function') maybeHiddenPrice(EVENT_BY_ID[item.id] || {}, item, c);
  applyFx(c.fx);
  if (c.run) { try { c.run(); } catch (e) { console.error(e); } }
  // conseguenze che tornano dopo qualche settimana
  if (c.later) { G.chains = G.chains || []; G.chains.push({ w: G.week + c.later.w, id: c.later.id, ctx: item.ctx || {} }); }
  if (item.ctx && item.ctx.r && item.ctx.r.id && typeof addPin === "function") addPin(item.ctx.r.id, v.img, v.title);
  vib(20);
  replaceSheet(`<div class="evcard"><div class="img">${medal(v.img, 70)}</div><h2>${esc(v.title)}</h2><div class="center mt"><span class="stamp gold">DECISO</span></div><div class="card mt">${window._ev.staff ? '<div class="tiny warn" style="font-weight:800">Tempo scaduto: ha deciso il tuo staff</div>' : ''}<b>${esc(c.t)}</b><div class="small muted mt">${esc(c.r || '')}</div>${c.later ? '<div class="tiny warn mt">Questa scelta potrebbe avere conseguenze nelle prossime settimane.</div>' : ''}</div><button class="btn pri block mt" onclick="closeSheet();doneQueue()">Continua</button></div>`);
}

// ============================================================
//  EVENTI SPECIALI DEL CALENDARIO
// ============================================================
function handleSpecial(sp) {
  const k = sp.k;
  if (k === 'manovra') { G.flags.manovraDue = sp.year; return openManovra(sp.year); }
  if (k === 'elezioni') { G.queue.shift(); runGeneralElection(); renderGame(); return openFormation(); }
  if (k === 'regionali') {
    const r = sp.r; const reg = REGIONS_DEF.find(x => x.id === r.rid);
    return specialCard('map', `Regionali in ${reg.n}`, `Vince <b>${esc(r.gov)}</b> (${esc(r.winner)}) con il ${fmt1(r.pct)}%.${r.changed ? ' <b class="gold">La regione cambia colore!</b>' : ''}`);
  }
  if (k === 'referendum') {
    const rf = sp.rf, l = getLaw(rf.lawId), res = rf.res;
    return specialCard('vote', `Referendum: ${l.nome}`, rf.kind === 'conf' ? `${res.won ? 'Vince il <b class="good">Sì</b>' : 'Vince il <b class="bad">No</b>'} con il ${fmt1(res.won ? res.yes : 100 - res.yes)}%. Affluenza ${fmt1(res.turnout)}%.` : `${res.valid ? 'Quorum raggiunto' : '<b class="bad">Quorum mancato</b>'}: affluenza ${fmt1(res.turnout)}%. ${res.won ? '<b class="good">La norma è abrogata.</b>' : 'La legge resta com’è.'}`,
      G.flags.refLost && isPremier() ? () => { G.flags.refLost = false; confirmSheet('Ti dimetti?', '<p class="muted">Avevi legato il governo all’esito del referendum. Dimettersi è coerente, restare ti costerà credibilità.</p>', 'Mi dimetto', () => { openCrisis('referendum'); renderGame(); openFormation(); }, 'red'); } : null);
  }
  if (k === 'voti') return openVotes(sp.ids);
  if (k === 'minprop') return openMinisterProposal(sp);
  if (k === 'call') return openCall(sp);
  if (k === 'cdm') return openCdM();
  if (k === 'vertice') return openSummit(sp);
  if (k === 'primarie') return openPrimarie();
  if (k === 'candidatura') return openCandidatura();
  if (k === 'promozione') { const t = promote(sp.rank); return specialCard('trend', 'Promozione!', t); }
  if (k === 'congresso') {
    return choiceCard('building', `Si dimette ${esc(myParty().leader)}`, `Dopo la sconfitta elettorale il leader di ${esc(myParty().name)} lascia. Si apre il congresso.`, [
      { t: 'Candidarmi alla segreteria', f: () => { G.flags['lostElection_' + myPid()] = true; const r = challengeLeader(); if (r.ok) confetti(); return r.ok ? 'Hai vinto! Ora guidi il partito.' : 'Vince un altro candidato. La tua area però esce rafforzata.'; } },
      { t: 'Sostenere un altro candidato', f: () => { applyFx({ rap: 15, seguito: 3 }); P(myPid()).leader = randomName(); return `Vince ${P(myPid()).leader}, che ti ringrazia per il sostegno.`; } },
    ]);
  }
  if (k === 'quirinale') return openQuirinale();
  if (k === 'tecnico') {
    return choiceCard('chartdown', 'Il Quirinale ti convoca', `Lo spread è sopra 450 da settimane. ${INSTITUTIONS.pdr} ti chiede un passo indietro per far nascere un governo tecnico di salvezza nazionale.`, [
      { t: 'Dimettersi per il bene del Paese', f: () => { G.cred += 5; G.flags.forceTech = true; openCrisis('spread'); return 'Lasci Palazzo Chigi con dignità.'; } },
      { t: 'Resistere: «Il governo ha la fiducia del Parlamento»', f: () => { applyFx({ spread: 60, appr: -5, grp: { quir: -25, merc: -15 } }); return 'Muro contro muro. I mercati vendono.'; } },
    ]);
  }
  if (k === 'malore') {
    applyFx({ stress: -50, fama: -3 }); G.pc = 0; G.player.salute = Math.max(G.player.salute, 40);
    return specialCard('ambulance', 'Malore', 'Un malore durante un evento pubblico: ricovero per accertamenti e una settimana di stop forzato. Il Paese ti manda messaggi di affetto.');
  }
  if (k === 'candReg') {
    const reg = regionName(sp.rid);
    return choiceCard('vote', `Regionali in ${reg}`, 'Tra due mesi si vota per il Consiglio regionale. Il partito ti chiede se vuoi candidarti.', [
      { t: 'Mi candido', f: () => { G.player.candReg = true; applyFx({ stress: 4 }); return 'Inizia la caccia alle preferenze.'; } },
      { t: 'Non questa volta', f: () => 'Resti in Consiglio comunale.' },
    ]);
  }
  if (k === 'comunali') {
    return choiceCard('home', 'Elezioni comunali', 'Nel tuo comune si vota. Ti candidi al Consiglio comunale?', [
      { t: 'Mi candido', f: () => { const ok = chance(clamp(0.35 + G.player.fama / 40 + G.player.seguito / 60, 0.2, 0.92)); if (ok) { G.player.rank = 1; G.careerLog.push({ w: G.week, t: 'Eletto consigliere comunale' }); return 'Eletto consigliere comunale! Prima tappa raggiunta.'; } G.player.fama += 2; return 'Mancata l’elezione per poche preferenze.'; } },
      { t: 'Non mi candido', f: () => 'Continui l’attività da militante.' },
    ]);
  }
  G.queue.shift(); processQueue();
}
function specialCard(ico, title, html, after) {
  window._after = after;
  openSheet(`<div class="evcard"><div class="img">${medal(ico, 84)}</div><h2>${esc(title)}</h2><div class="txt center">${html}</div><button class="btn pri block mt2" onclick="closeSheet();doneQueue();if(window._after){const f=window._after;window._after=null;setTimeout(f,350);}">Continua</button></div>`, { locked: true });
}
function choiceCard(ico, title, text, choices) {
  window._cc = choices;
  openSheet(`<div class="evcard"><div class="img">${medal(ico, 84)}</div><h2>${esc(title)}</h2><div class="txt">${text}</div><div class="mt">${choices.map((c, i) => `<button class="choice" onclick="pickChoiceCard(${i})"><div class="t">${esc(c.t)}</div>${c.fx ? fxChips(c.fx) : ''}</button>`).join('')}</div></div>`, { locked: true });
}
function pickChoiceCard(i) {
  const r = window._cc[i].f();
  replaceSheet(`<div class="evcard"><div class="center mt"><span class="stamp gold">FATTO</span></div><p class="center mt">${r || ''}</p><button class="btn pri block mt" onclick="closeSheet();doneQueue()">Continua</button></div>`);
}
function promote(rank) {
  const p = G.player, pid = myPid();
  p.rank = Math.max(p.rank, rank);
  let t = `${esc(P(pid).leader)} ti nomina ${RANKS[rank].n.toLowerCase()}.`;
  if (rank === 6 && inGov(pid) && G.gov.premier !== 'PLAYER') {
    const mine = Object.keys(G.gov.ministers).filter(k => { const pp = person(G.gov.ministers[k]); return pp && pp.party === pid; });
    if (mine.length) { const k = pick(mine); const old = G.gov.ministers[k]; G.gov.ministers[k] = p.name; p.minister = k; t = `Rimpasto: prendi il posto di ${esc(old)} come ministr${p.art === 'la' ? 'a' : 'o'} (${MIN_BY_ID[k].n}).`; }
  }
  if (rank === 5 && inGov(pid)) t = `Diventi sottosegretari${p.art === 'la' ? 'a' : 'o'} nel ${esc(G.gov.name)}.`;
  else if (rank === 5) t = `Diventi capogruppo di ${esc(P(pid).short)} ${p.parl === 'S' ? 'al Senato' : 'alla Camera'}.`;
  p.fama = clamp(p.fama + 6, 0, 100);
  G.careerLog.push({ w: G.week, t: `Promozione: ${RANKS[rank].n}` });
  addNews(`${p.name} promoss${p.art === 'la' ? 'a' : 'o'}: ${RANKS[rank].n.toLowerCase()} di ${P(pid).short}.`, 'mio');
  return t;
}
function openCandidatura() {
  const p = G.player;
  choiceCard('clipboard', 'Le liste per le politiche', `${esc(myParty().leader)} chiude le liste. Che posto chiedi in ${regionName(p.region)}?`, [
    { t: `Chiedere il posto da capolista (serve un ottimo rapporto: oggi ${fmt0(p.rap)})`, f: () => { if (p.rap >= 40 || (p.rap >= 25 && chance(0.4))) { p.candidate = 'capolista'; return 'Sei capolista: elezione quasi sicura.'; } p.candidate = 'pref'; applyFx({ rap: -5 }); return 'Il leader preferisce un fedelissimo: corri con le preferenze.'; } },
    { t: 'Correre con le preferenze', f: () => { p.candidate = 'pref'; return 'Servirà una grande campagna personale.'; } },
    { t: 'Non candidarmi', f: () => { p.candidate = null; applyFx({ rap: 3 }); return 'Resti fuori dalla corsa.'; } },
  ]);
}
function openPrimarie() {
  const c = G.coalitions.find(x => x.id === 'csx');
  if (!c || !c.members.includes(myPid()) || (!isLeader() && G.player.fama < 30)) { const res = runPrimarie(); if (!res) { G.queue.shift(); return processQueue(); } return specialCard('vote', 'Primarie del Campo largo', res.map(x => `${esc(x.player ? G.player.name : x.name)} <b>${fmt1(x.pct)}%</b>`).join(' · ')); }
  choiceCard('vote', 'Primarie del Campo largo', `Il centrosinistra sceglie il candidato premier con le primarie. In corsa ${esc(P('PD').leader)} e ${esc(P('M5S').leader)}.${G.primarie && G.primarie.player ? ' Sei già in corsa.' : ' Vuoi candidarti?'}`, [
    { t: G.primarie && G.primarie.player ? 'Si vota!' : 'Candidarmi e sfidarli', f: () => { G.primarie = Object.assign(G.primarie || {}, { player: true }); G.primarie.boost = (G.primarie.boost || 0) + G.player.car * 0.5; const res = runPrimarie(); const w = res[0]; if (w.player) confetti(); return res.map(x => `${esc(x.player ? 'Tu' : x.name)}: ${fmt1(x.pct)}%`).join('<br>') + (w.player ? '<br><b class="gold">Sei il candidato premier del Campo largo!</b>' : ''); } },
    { t: 'Sostenere un candidato', f: () => { if (G.primarie) G.primarie.player = false; const res = runPrimarie(); return res.map(x => `${esc(x.name)}: ${fmt1(x.pct)}%`).join('<br>'); } },
  ]);
}

// ============================================================
//  COALIZIONI
// ============================================================
function askJoin(cid) {
  const c = G.coalitions.find(x => x.id === cid);
  const js = joinScore(c, myPid());
  if (js.block) return toast(`${P(js.block).short} pone il veto`, 'bad');
  const dem = coalitionDemands(c, myPid());
  openSheet(`${head(`Entrare in ${esc(c.name)}`, `Probabilità di accordo: ${js.score}%`)}
    <p class="muted small">Gli alleati chiedono di inserire nel programma comune le loro bandiere:</p>
    ${dem.map(d => { const l = getLaw(d.lawId); const imp = impactOf(l, G.laws[d.lawId], d.opt); return `<div class="card tight"><div class="row between">${partyChip(d.party)}<span class="tag ${imp.mine > 0.2 ? 'g' : imp.mine < -0.2 ? 'b' : ''}">${imp.mine > 0.2 ? 'ti piace' : imp.mine < -0.2 ? 'contro le tue idee' : 'neutra'}</span></div><b class="small">${esc(l.opts[d.opt].t)}</b><div class="tiny muted">${esc(l.nome)}</div></div>`; }).join('')}
    <div class="card tight">${proConHTML({ pro: [{ k: 'pol', t: 'Puoi puntare al premio di maggioranza (42%)' }, { k: 'pol', t: 'Più collegi e visibilità nella coalizione' }], contro: [{ k: 'pol', t: 'Impegni sul programma da rispettare al governo' }, { k: 'pop', t: 'Parte dei tuoi elettori potrebbe non gradire' }] }, { noParties: true })}</div>
    <button class="btn pri block mt" onclick="closeSheet();confirmJoin('${cid}')">Tratta · ⚡2</button>`);
}
function confirmJoin(cid) {
  if (!spendPC(2)) return toast('Capitale politico insufficiente', 'bad');
  const c = G.coalitions.find(x => x.id === cid), js = joinScore(c, myPid());
  if (chance(js.score / 100)) {
    c.members.push(myPid());
    coalitionDemands(c, myPid()).forEach(d => { if (!G.promises.some(p => p.lawId === d.lawId && p.opt === d.opt)) G.promises.push({ lawId: d.lawId, opt: d.opt, w: G.week, pact: d.party }); });
    c.members.forEach(m => addRel(m, myPid(), 5));
    const away = AXIS_KEYS.reduce((s, k) => s + Math.abs(P(c.members[0]).ax[k] - myParty().ax[k]), 0) / 8;
    myParty().spinta -= Math.max(0, away - 4) * 0.4;
    addNews(`Accordo fatto: ${myParty().short} entra nella coalizione ${c.name}.`, 'mio');
    resultSheet('hands', 'Accordo raggiunto', `Sei nel ${esc(c.name)}. Gli impegni comuni sono nel tuo programma.`);
  } else { c.members.forEach(m => addRel(m, myPid(), -3)); resultSheet('door', 'Porta chiusa', 'Gli alleati non si fidano. Lavora sui rapporti e riprova.'); }
  renderGame();
}
function askPremiership(cid) {
  if (!spendPC(4)) return toast('Capitale politico insufficiente', 'bad');
  const c = G.coalitions.find(x => x.id === cid);
  const others = c.members.filter(m => m !== myPid());
  const big = others.sort((a, b) => P(b).poll - P(a).poll)[0];
  const need = { facile: 0.6, media: 0.85, realistica: 1.0 }[G.diff];
  const ratio = myParty().poll / P(big).poll;
  if (ratio >= need || (ratio >= need - 0.15 && G.player.fama > 70 && chance(0.4))) {
    c.cand = 'PLAYER'; c.candParty = myPid(); c.candLocked = true; confetti();
    addNews(`Svolta nella coalizione ${c.name}: sarà ${G.player.name} il candidato premier.`, 'mio');
    resultSheet('crown', 'Sei il candidato premier!', `Gli alleati accettano: guiderai ${esc(c.name)} alle elezioni.`);
  } else { addRel(big, myPid(), -6); resultSheet('hand', 'Richiesta respinta', `${esc(P(big).leader)}: «Il candidato lo esprime il partito più votato». Ti servirebbe almeno il ${fmt0(need * 100)}% dei voti di ${esc(P(big).short)}.`); }
  renderGame();
}
function joinPrimarie() { if (!spendPC(3)) return toast('Capitale politico insufficiente', 'bad'); G.primarie = { player: true, boost: 0 }; addNews(`${G.player.name} si candida alle primarie del Campo largo.`, 'mio'); renderGame(); toast('Sei in corsa per le primarie', 'good'); }
// probabilità che un partito accetti di entrare nella tua coalizione (o di fondarne una con te)
function inviteScore(id) {
  const c = coalitionOf(myPid());
  const members = c ? c.members.filter(m => m !== id) : [myPid()];
  const block = members.find(m => never(m, id));
  if (block) return { score: 0, block };
  let s = willing(id, myPid()) - D().accept;
  if (c) { const others = members.filter(m => m !== myPid()); if (others.length) s = Math.min(s, others.reduce((t, m) => t + willing(m, id), 0) / others.length - D().accept + 10); }
  const old = coalitionOf(id);
  if (old && old !== c) s -= 30;
  return { score: Math.round(clamp(s, 0, 95)), old };
}
function invitePartner(id) {
  if (G.flags.listsDeposited === G.cal.election) return toast('Liste già depositate: alleanze bloccate', 'bad');
  const sc = inviteScore(id);
  if (sc.block) return toast(`Veto: ${P(sc.block).short} non si allea mai con ${P(id).short}`, 'bad');
  if (!spendPC(1)) return toast('Capitale politico insufficiente', 'bad');
  if (chance(sc.score / 100)) {
    let c = coalitionOf(myPid());
    if (!c) { c = { id: 'mia', name: `Coalizione ${myParty().name}`, members: [myPid()], cand: 'PLAYER', candParty: myPid(), candLocked: true, color: myParty().color, mine: true }; G.coalitions.push(c); }
    if (sc.old) { sc.old.members = sc.old.members.filter(m => m !== id); sc.old.members.forEach(m => addRel(m, id, -10)); addNews(`${P(id).short} lascia ${sc.old.name}.`, 'parl'); if (sc.old.members.length < 2) G.coalitions = G.coalitions.filter(x => x !== sc.old); }
    c.members.push(id); addRel(id, myPid(), 6);
    addNews(`${P(id).short} entra in ${c.name}.`, 'mio');
    resultSheet('hands', 'Alleanza fatta', `${esc(P(id).leader)} accetta: ${esc(P(id).short)} entra in ${esc(c.name)}.`);
  } else { addRel(id, myPid(), -2); resultSheet('hand', `${P(id).short} declina`, `${esc(P(id).leader)}: «Non ci sono le condizioni». Migliora il rapporto con incontri e voti comuni, poi riprova.`); }
  renderGame();
}
function leaveCoalition() {
  confirmSheet('Uscire dalla coalizione?', '<p class="muted">Gli ex alleati se lo ricorderanno. Gli impegni comuni decadono.</p>', 'Esci', () => {
    const c = coalitionOf(myPid()); c.members = c.members.filter(m => m !== myPid()); c.members.forEach(m => addRel(m, myPid(), -10));
    G.promises = G.promises.filter(p => !p.pact);
    if (c.mine) G.coalitions = G.coalitions.filter(x => x !== c);
    if (c.cand === 'PLAYER') { c.cand = null; c.candLocked = false; }
    addNews(`${myParty().short} lascia la coalizione ${c.name}.`, 'mio'); renderGame();
  }, 'red');
}

// ============================================================
//  PROGRAMMA ELETTORALE
// ============================================================
function openProgram() {
  const items = G.promises.filter(p => !p.kept);
  const ap = programAppeal(items.map(p => [p.lawId, p.opt]));
  let h = head('Programma elettorale', G.program ? `Annunciato il ${fmtDate(G.program.w)}` : 'Da annunciare prima del voto');
  h += `<div class="grid3"><div class="kpi"><div class="l">Proposte</div><div class="v">${items.length}</div></div><div class="kpi"><div class="l">Costo</div><div class="v ${ap.cost > 25 ? 'bad' : ''}">${fmt0(ap.cost)}<span class="small"> mld</span></div></div><div class="kpi"><div class="l">Gradimento</div><div class="v" style="color:${ap.score > 0 ? 'var(--good)' : 'var(--bad)'}">${ap.score > 0 ? '+' : ''}${fmt1(ap.score)}</div></div></div>`;
  if (ap.cost > 25) h += `<div class="small bad mt">Promesse troppo costose: gli economisti parlano di «libro dei sogni» (credibilità −${fmt0(ap.credPenalty)}).</div>`;
  h += `<div class="mt">${items.length ? items.map(p => { const l = getLaw(p.lawId), o = l.opts[p.opt]; return `<div class="card tight click" onclick="closeSheet();openLaw('${p.lawId}',${p.opt})"><div class="row between"><span class="tiny muted">${icon(LAW_CATS[l.cat] || 'doc', 14)} ${esc(l.nome)}</span>${p.pact ? partyChip(p.pact) : ''}</div><b class="small">${esc(o.t)}</b>${o.costo ? `<span class="tag ${o.costo > 0 ? 'b' : 'g'}" style="margin-left:6px">${o.costo > 0 ? '+' : ''}${fmt1(o.costo)} mld</span>` : ''}</div>`; }).join('') : '<div class="muted small center">Nessuna proposta. Apri una legge e tocca «Metti nel programma».</div>'}</div>`;
  h += `<button class="btn block mt" onclick="closeSheet();goTab('leggi')">${icon('plus')} Aggiungi proposte dal catalogo leggi</button>`;
  if (!G.program) h += `<button class="btn gold block mt" ${items.length >= 3 ? '' : 'disabled'} onclick="announceProgram()">${icon('mega')} Annuncia il programma ${items.length < 3 ? '(almeno 3 proposte)' : ''}</button>`;
  const kept = G.promises.filter(p => p.kept);
  if (kept.length) h += `${sec('Promesse mantenute')}${kept.map(p => `<div class="small" style="padding:4px 0"><span class="good">${icon('check', 15)}</span> ${esc(getLaw(p.lawId).opts[p.opt].t)}</div>`).join('')}`;
  openSheet(h);
}
function announceProgram() {
  const items = G.promises.filter(p => !p.kept);
  const ap = programAppeal(items.map(p => [p.lawId, p.opt]));
  G.program = { w: G.week, n: items.length };
  myParty().spinta += clamp(1 + ap.score * 0.4, -1, 4);
  G.player.fama = clamp(G.player.fama + 3, 0, 100);
  G.cred = clamp(G.cred - ap.credPenalty, 0, 100);
  addNews(`${myParty().short} presenta il programma: ${items.length} proposte${ap.cost > 0 ? ` per ${fmt0(ap.cost)} miliardi` : ''}.`, 'mio');
  closeSheet(); confetti(); renderGame();
  resultSheet('mega', 'Programma annunciato', ap.score > 0 ? 'Accoglienza positiva: le proposte piacciono.' : 'Accoglienza fredda: alcune proposte dividono.');
}

// ============================================================
//  LEGGE LIBERA
// ============================================================
let CUSTOM = null;
function openCustomLaw() {
  CUSTOM = { nome: '', cat: 'Economia', ax: 'eco', pos: 0, costo: 0, d: '' };
  openSheet('', { full: true }); renderCustomLaw();
}
function customLawObj() {
  const c = CUSTOM; const now = c.pos > 0 ? Math.max(-10, c.pos - 7) : Math.min(10, c.pos + 7);
  const pop = clamp(2 - Math.abs(c.pos - G.mood[c.ax]) * 0.35 + (c.costo > 0 ? Math.min(2, c.costo / 3) : Math.max(-2, c.costo / 3)), -4, 4);
  return { id: 'cus_' + (G.customLaws.length + 1), cat: c.cat, nome: c.nome || 'Nuova legge', rif: 'Proposta originale', ax: c.ax, cur: 0, attuale: 'Nessuna norma specifica.', sal: 2, custom: true,
    opts: [{ t: 'Nessuna norma', d: 'Situazione attuale.', pos: now, costo: 0, e: {} }, { t: c.nome || 'Nuova legge', d: c.d || 'Proposta originale.', pos: c.pos, costo: c.costo, e: { pop: Math.round(pop * 10) / 10, pil: c.costo > 0 ? c.costo * 0.008 : 0, ue: c.costo > 5 ? -c.costo * 0.6 : 0, merc: c.costo > 5 ? -c.costo * 0.4 : 0 } }] };
}
function renderCustomLaw() {
  const c = CUSTOM, l = customLawObj();
  const saveLaws = G.customLaws; G.customLaws = saveLaws.concat([l]); G.laws[l.id] = 0;
  const imp = impactOf(l, 0, 1);
  G.customLaws = saveLaws; delete G.laws[l.id];
  replaceSheet(`${head('Scrivi una legge')}
    <label class="lbl">Titolo</label><input value="${esc(c.nome)}" placeholder="Es. Bonus trasporti per gli studenti" oninput="CUSTOM.nome=this.value">
    <label class="lbl">Cosa prevede</label><input value="${esc(c.d)}" placeholder="Breve descrizione" oninput="CUSTOM.d=this.value">
    <label class="lbl">Ambito</label><select onchange="CUSTOM.cat=this.value">${Object.keys(LAW_CATS).map(k => `<option ${k === c.cat ? 'selected' : ''}>${k}</option>`).join('')}</select>
    <label class="lbl">Su quale tema divide</label><select onchange="CUSTOM.ax=this.value;renderCustomLaw()">${AXIS_KEYS.map(k => `<option value="${k}" ${k === c.ax ? 'selected' : ''}>${AXES[k].n}: ${AXES[k].l} ↔ ${AXES[k].r}</option>`).join('')}</select>
    <label class="lbl">Orientamento: <b>${c.pos < -2 ? AXES[c.ax].l : c.pos > 2 ? AXES[c.ax].r : 'moderato'}</b></label><input type="range" min="-10" max="10" value="${c.pos}" onchange="CUSTOM.pos=+this.value;renderCustomLaw()"><div class="row between tiny muted"><span>${AXES[c.ax].l}</span><span>${AXES[c.ax].r}</span></div>
    <label class="lbl">Costo annuo: <b>${c.costo > 0 ? '+' : ''}${c.costo} mld</b> ${c.costo < 0 ? '(entrate/risparmi)' : ''}</label><input type="range" min="-10" max="20" step="0.5" value="${c.costo}" onchange="CUSTOM.costo=+this.value;renderCustomLaw()">
    ${sec('Pro e contro')}<div class="mt">${proConHTML(imp)}</div>
    <div class="row mt2"><button class="btn block" onclick="closeSheet()">Annulla</button><button class="btn gold block" onclick="saveCustomLaw()">Crea la legge</button></div>`);
}
function saveCustomLaw() {
  if (!CUSTOM.nome.trim()) return toast('Dai un titolo alla legge', 'bad');
  const l = customLawObj(); G.customLaws.push(l); G.laws[l.id] = 0;
  closeSheet(); renderGame(); setTimeout(() => openLaw(l.id, 1), 300);
}

// ============================================================
//  SCISSIONE
// ============================================================
function openScissione() {
  const p = G.player;
  if (p.fama < 20) { openSheet(`${head('Troppo presto')}<p class="muted">Con una fama di ${fmt0(p.fama)} nessuno ti seguirebbe. Servono almeno 20 punti.</p>`); return; }
  const est = clamp(myParty().poll * (p.seguito / 100) * 0.45 + p.fama * 0.04, 0.5, myParty().poll * 0.6);
  window._sc = { name: '', short: '', symbol: 'crown', color: PARTY_COLORS[3] };
  openSheet(`${head('Fonda il tuo partito', `Lasci ${esc(myParty().name)}`)}
    ${proConHTML({ pro: [{ k: 'pol', t: `Guidi tu: decidi linea e alleanze` }, { k: 'pop', t: `Partenza stimata: circa ${fmt1(est)}%` }, { k: 'pol', t: `Ti seguono parlamentari in base al tuo seguito (${fmt0(p.seguito)}%)` }], contro: [{ k: 'pol', t: `Rottura con ${myParty().short} (rapporto −60)` }, { k: 'per', t: 'Pochi fondi e organizzazione da costruire' }] }, { noParties: true })}
    <label class="lbl">Nome del nuovo partito</label><input oninput="_sc.name=this.value" placeholder="Es. Rinascita Nazionale">
    <label class="lbl">Sigla</label><input maxlength="6" oninput="_sc.short=this.value.toUpperCase()">
    <label class="lbl">Simbolo</label><div class="symgrid">${SYMBOLS.map(s => `<button onclick="_sc.symbol='${s}';this.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('on'));this.classList.add('on')">${icon(s)}</button>`).join('')}</div>
    <label class="lbl">Colore</label><div class="colgrid">${PARTY_COLORS.map(c => `<button style="background:${c}" onclick="_sc.color='${c}';this.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('on'));this.classList.add('on')"></button>`).join('')}</div>
    <button class="btn red block mt2" onclick="confirmScissione()">Rompi e fonda il partito · ⚡6</button>`);
}
function confirmScissione() {
  const s = window._sc; if (!s.name.trim() || !s.short.trim()) return toast('Nome e sigla obbligatori', 'bad');
  if (!spendPC(6)) return toast('Capitale politico insufficiente', 'bad');
  doScissione({ name: s.name.trim(), short: s.short.trim(), symbol: s.symbol, color: s.color });
  closeSheet(); confetti(); renderGame();
  resultSheet('rocket', `Nasce ${s.name}`, `Ora sei leader. Con te ${myParty().seatsC} deputati e ${myParty().seatsS} senatori. Primo sondaggio: ${fmt1(myParty().poll)}%.`);
}

// ============================================================
//  MANOVRA DI BILANCIO
// ============================================================
let MAN = null;
function openManovra(year) {
  if (!MAN || MAN.year !== year) {
    const menu = manovraMenu(year), inMenu = new Set(menu.map(m => m.id));
    const partners = G.gov.parties.filter(p => p !== myPid());
    const dem = {};
    partners.forEach(p => {
      const eco = P(p).ax.eco;
      const pool = menu.filter(m => m.g === 'Spese').map(m => ({ m, v: ((m.e.sind || 0) * -eco + (m.e.conf || 0) * eco + (m.e.pop || 0) * 3 + (m.e.chiesa || 0) * P(p).ax.soc * 0.3 + (m.id === 'm_difesa' ? P(p).ax.eu * -1 + 4 : 0) + (m.id === 'm_sud' ? -P(p).ax.terr : 0)) + rnd(0, 6) })).sort((a, b) => b.v - a.v);
      dem[p] = pool.slice(0, 2).map(x => x.m.id);
    });
    MAN = { year, menu, sel: new Set(G.budget.active.filter(id => inMenu.has(id) && BUDGET_BY_ID[id].g === 'Spese').slice(0, 3)), laws: {}, dem };
  }
  openSheet('', { full: true, locked: true });
  renderManovra();
}
function manovraCalc() {
  const e = G.econ;
  const tend = e.baseDef - 0.1 + lawSum('costo') / e.pilNom * 100 + (e.spread - 90) * 0.002;
  let c = 0, pil = 0, pop = 0; MAN.sel.forEach(id => { const m = BUDGET_BY_ID[id]; c += m.c; pil += m.e.pil || 0; pop += m.e.pop || 0; });
  let lc = 0; Object.entries(MAN.laws).forEach(([id, opt]) => { const l = getLaw(id); lc += (l.opts[opt].costo || 0) - (l.opts[G.laws[id]].costo || 0); pop += ((l.opts[opt].e.pop || 0) - (l.opts[G.laws[id]].e.pop || 0)); pil += (l.opts[opt].e.pil || 0) - (l.opts[G.laws[id]].e.pil || 0); });
  const def = tend + (c + lc) / e.pilNom * 100;
  const lim = 3 + (e.flex || 0);
  const ue = def <= 3 ? ['check', 'In regola con il Patto di stabilità', 'good'] : def <= lim + 0.05 ? ['check', 'In regola grazie alla flessibilità', 'good'] : def <= lim + 0.5 ? ['alert', 'Rischio di non conformità', 'warn'] : ['x', 'Bocciatura probabile e nuova procedura', 'bad'];
  const spreadEst = Math.max(0, def - 3) * 45;
  let sat = {}; Object.keys(MAN.dem).forEach(p => { sat[p] = MAN.dem[p].reduce((s, id) => s + (MAN.sel.has(id) ? 4 : -3), 0); });
  return { tend, c: c + lc, def, ue, spreadEst, pil, pop, sat, lim };
}
function renderManovra() {
  const r = manovraCalc();
  const mrow = m => { const on = MAN.sel.has(m.id); const who = Object.keys(MAN.dem).filter(p => MAN.dem[p].includes(m.id)); const pc = fxProCon(m.e); return `<button class="choice ${on ? 'sel' : ''}" onclick="toggleMeasure('${m.id}')"><div class="row between"><span class="t"><span class="ck ${on ? 'on' : ''}">${on ? icon('check', 14) : ''}</span>${esc(m.n)}${m.extra ? ' <span class="tag o" style="height:20px;padding:0 7px;font-size:10px">novità</span>' : ''}</span><b class="${m.c > 0 ? 'bad' : 'good'}">${m.c > 0 ? '+' : ''}${fmt1(m.c)}</b></div><div class="tiny muted" style="margin-top:3px">${esc(m.d)}</div><div class="fx">${who.map(p => `<span class="n">chiesta da ${esc(P(p).short)}</span>`).join('')}${pc.pro.map(x => `<span class="p">▲ ${esc(x.t)}</span>`).join('')}${pc.contro.map(x => `<span class="c">▼ ${esc(x.t)}</span>`).join('')}${m.risk ? '<span class="c">▼ Entrate incerte</span>' : ''}</div></button>`; };
  const fisLaws = allLaws().filter(l => l.fis);
  replaceSheet(`<div class="row between"><div><div class="tiny gold" style="font-weight:800">LEGGE DI BILANCIO</div><h2>Manovra ${MAN.year}</h2></div><button class="btn sm" onclick="closeSheet();renderGame()">Più tardi</button></div>
    <div class="card hero mt" style="position:sticky;top:-12px;z-index:3">
      <div class="row between"><div><div class="tiny muted">DEFICIT ${MAN.year}</div><div class="bignum" style="color:${r.def <= r.lim + 0.05 ? 'var(--good)' : r.def <= r.lim + 0.5 ? 'var(--warn)' : 'var(--bad)'}">${fmt1(r.def)}%</div></div>
      <div class="right small"><div>Tendenziale <b>${fmt1(r.tend)}%</b></div><div>Saldo misure <b class="${r.c > 0 ? 'bad' : 'good'}">${r.c > 0 ? '+' : ''}${fmt1(r.c)} mld</b></div><div>Limite UE <b>${fmt1(r.lim)}%</b></div></div></div>
      <div class="small mt"><span class="${r.ue[2]}">${icon(r.ue[0], 16)}</span> Bruxelles: <b class="${r.ue[2]}">${r.ue[1]}</b></div>
      <div class="row wrap small mt" style="gap:10px"><span>Spread ${r.spreadEst > 0 ? `<b class="bad">+${fmt0(r.spreadEst)}</b>` : '<b class="good">stabile</b>'}</span><span>PIL <b>${sgn(r.pil)}</b></span><span>Consenso <b class="${r.pop >= 0 ? 'good' : 'bad'}">${sgn(r.pop * 0.6)}</b></span></div>
      <div class="row wrap mt" style="gap:4px">${Object.keys(r.sat).map(p => `<span class="tag ${r.sat[p] > 0 ? 'g' : r.sat[p] < 0 ? 'b' : ''}">${esc(P(p).short)} ${icon(r.sat[p] > 0 ? 'smile' : r.sat[p] < 0 ? 'frown' : 'user', 14)}</span>`).join('')}</div></div>
    <p class="small muted">Scegli spese e coperture. Le misure valgono per un anno; le riforme strutturali restano. ${G.econ.flex ? '' : 'Puoi ottenere flessibilità con una «Missione a Bruxelles» tra settembre e novembre.'}</p>
    ${sec('Spese e tagli di tasse')}${(MAN.menu || BUDGET_MEASURES).filter(m => m.g === 'Spese').map(mrow).join('')}
    ${sec('Coperture')}${(MAN.menu || BUDGET_MEASURES).filter(m => m.g === 'Coperture').map(mrow).join('')}
    ${sec('Riforme fiscali (facoltative)')}
    ${fisLaws.map(l => { const cur = MAN.laws[l.id] !== undefined ? MAN.laws[l.id] : G.laws[l.id]; return `<div class="card tight"><b class="small">${icon(LAW_CATS[l.cat] || 'doc', 14)} ${esc(l.nome)}</b><select class="mt" onchange="setManLaw('${l.id}',+this.value)">${l.opts.map((o, i) => `<option value="${i}" ${i === cur ? 'selected' : ''}>${i === G.laws[l.id] ? '• ' : ''}${esc(o.t)}${(o.costo || 0) !== (l.opts[G.laws[l.id]].costo || 0) ? ` (${(o.costo - (l.opts[G.laws[l.id]].costo || 0)) > 0 ? '+' : ''}${fmt1(o.costo - (l.opts[G.laws[l.id]].costo || 0))} mld)` : ''}</option>`).join('')}</select></div>`; }).join('')}
    <button class="btn gold block mt2" onclick="submitManovra()">${icon('building')} Approva in Consiglio dei ministri</button>
    <div class="tiny dim center mt">Poi la manovra va al Senato e alla Camera: va approvata entro il 31 dicembre.</div>`);
}
function toggleMeasure(id) { if (MAN.sel.has(id)) MAN.sel.delete(id); else MAN.sel.add(id); vib(6); const sh = layers[layers.length - 1].el.querySelector('.sheet'); const st = sh.scrollTop; renderManovra(); sh.scrollTop = st; }
function setManLaw(id, opt) { if (opt === G.laws[id]) delete MAN.laws[id]; else MAN.laws[id] = opt; const sh = layers[layers.length - 1].el.querySelector('.sheet'); const st = sh.scrollTop; renderManovra(); sh.scrollTop = st; }
function submitManovra() {
  const r = manovraCalc();
  const measures = Array.from(MAN.sel);
  const b = makeBill({ type: 'manovra', proposer: 'GOV', measures, year: MAN.year, house: 'S', name: 'Legge di bilancio ' + MAN.year });
  b.lawsIncluded = Object.entries(MAN.laws).map(([id, opt]) => [id, opt]);
  b.fiduciaAll = true;
  G.bills.push(b);
  Object.keys(r.sat).forEach(p => { if (G.gov.sat[p] !== undefined) G.gov.sat[p] = clamp(G.gov.sat[p] + r.sat[p], 0, 100); });
  G.flags.manovraDue = null;
  addNews(`Il Consiglio dei ministri approva la manovra ${MAN.year}: deficit programmato al ${fmt1(r.def)}%. Il testo passa al Senato.`, 'gov');
  MAN = null;
  closeSheet();
  if (G.queue.length && G.queue[0].sp && G.queue[0].sp.k === 'manovra') G.queue.shift();
  confetti(['#1fa463', '#d6b25e', '#ffffff']);
  renderGame();
  resultSheet('euro', 'Manovra varata', 'Ora tocca al Parlamento. La fiducia è già prevista per tutte le votazioni. Bruxelles darà il suo parere a fine novembre.');
  if (G.queue.length) setTimeout(processQueue, 900);
}

// ============================================================
//  CONSULTAZIONI E FORMAZIONE DEL GOVERNO
// ============================================================
function openFormation() {
  if (!G.formation) { G.phase = 'normale'; renderGame(); return; }
  closeSheet(true);
  setTimeout(() => { openSheet('', { full: true, locked: true }); renderFormation(); }, 260);
}
function renderFormation() {
  const f = G.formation;
  if (f.step === 'risultati') return f.liveDone ? renderResults() : renderElectionNight();
  if (f.step === 'consultazioni') return renderConsultazioni();
  if (f.step === 'ministri') return renderCabinet();
  if (f.step === 'giuramento') return renderGiuramento();
  if (f.step === 'fiducia') return renderFiducia();
}
function renderResults() {
  const E = G.lastElection;
  const ids = Object.keys(E.votes).sort((a, b) => E.votes[b] - E.votes[a]);
  const max = E.votes[ids[0]];
  const units = E.units.slice().sort((a, b) => b.share - a.share);
  const mine = E.votes[myPid()];
  replaceSheet(`<div class="center"><div class="tiny gold" style="font-weight:800">ELEZIONI POLITICHE · ${fmtDate(E.w)}</div><h2 class="mt">I risultati</h2><div class="small muted">Affluenza ${fmt1(E.turnout)}% · legge elettorale: ${{ stabilicum: 'Stabilicum 2026', rosatellum: 'Rosatellum', proporzionale: 'proporzionale puro', doppioturno: 'doppio turno' }[E.sys]}</div></div>
    <div class="card hero mt center"><div class="small muted">${esc(myParty().name)}</div><div class="bignum" id="mypct">0</div><div class="small">${myParty().seatsC} deputati · ${myParty().seatsS} senatori</div></div>
    ${sec('Voti alle liste')}<div class="card">${ids.map((id, i) => `<div class="res-row" style="animation:fadeUp .4s ${i * 60}ms both">${partyChip(id)}<div class="bar"><i class="rb" data-w="${E.votes[id] / max * 100}" style="width:0;--c:${P(id).color}"></i></div><span class="pct small">${fmt1(E.votes[id])}%</span></div>`).join('')}</div>
    ${sec('Coalizioni')}<div class="card">${units.filter(u => u.share > 2).map(u => `<div class="row between small" style="padding:4px 0"><span><b>${esc(u.name)}</b>${u.coal ? ` <span class="dim">(${u.members.map(m => P(m).short).join(', ')})</span>` : ''}</span><b>${fmt1(u.share)}%</b></div>`).join('')}
      <div class="small mt">${E.premio ? `${icon('trophy', 16)} <b class="gold">Premio di maggioranza</b> a ${esc((units.find(u => u.id === E.premio) || {}).name || '')}` : 'Nessuno supera il 42% in entrambe le Camere: <b>niente premio di maggioranza</b>.'}</div></div>
    ${sec('La nuova Camera')}<div class="card">${hemicycle('C', { id: 'h-res-c', empty: true, slow: true })}${hemiLegend('C')}</div>
    ${sec('Il nuovo Senato')}<div class="card">${hemicycle('S', { id: 'h-res-s', empty: true, slow: true })}${hemiLegend('S')}</div>
    <button class="btn gold block mt2" onclick="G.formation.step='consultazioni';renderFormation()">${icon('building')} Al Quirinale per le consultazioni ›</button>`);
  setTimeout(() => { countUp($('#mypct'), mine, true, 1600); setTimeout(() => { const el = $('#mypct'); if (el) el.textContent = fmt1(mine) + '%'; }, 1700); document.querySelectorAll('.rb').forEach(b => b.style.width = b.dataset.w + '%'); fillHemi($('#h-res-c')); fillHemi($('#h-res-s')); }, 300);
  if (coalitionOf(myPid()) && E.premio === coalitionOf(myPid()).id) setTimeout(() => confetti(), 900);
}
function setLabel(set) { return set.map(p => P(p).short).join(' + '); }
function renderConsultazioni() {
  const f = G.formation;
  let h = `<div class="center">${medal('building', 76)}<h2 class="mt">Consultazioni al Quirinale</h2><div class="small muted">${esc(INSTITUTIONS.pdr)} riceve le delegazioni dei partiti</div></div>`;
  h += `<div class="card mt"><div class="row between small"><b>Maggioranza necessaria</b><span>Camera <b>${majority('C')}</b> · Senato <b>${majority('S')}</b></span></div><div class="list mt">${PIDS().filter(id => seatsOf(id, 'C') + seatsOf(id, 'S') > 0).sort((a, b) => seatsOf(b, 'C') - seatsOf(a, 'C')).map(id => `<div class="li">${partyChip(id)}<span class="grow small muted ellipsis">${esc(leaderName(id))}</span><span class="small">${seatsOf(id, 'C')} · ${seatsOf(id, 'S')}</span></div>`).join('')}</div></div>`;
  // vincitore con maggioranza propria
  const winner = f.after === 'elezioni' ? G.coalitions.find(c => c.members.length > 1 && hasMajority(c.members.filter(m => G.parties[m]))) : null;
  if (winner && !f.skipWinner) {
    const mem = winner.members.filter(m => G.parties[m]);
    const meIn = mem.includes(myPid());
    if (winner.cand === 'PLAYER' && isLeader()) {
      h += `<div class="card hero center">${medal('crown', 64)}<h3 class="mt">${esc(winner.name)} ha la maggioranza</h3><p class="muted small">${esc(INSTITUTIONS.pdr)} ti affida l’incarico di formare il governo.</p><button class="btn gold block" onclick="acceptIncarico(${JSON.stringify(mem).replace(/"/g, '&quot;')})">Accetto con riserva ›</button></div>`;
    } else {
      const big = mem.slice().sort((a, b) => seatsOf(b, 'C') - seatsOf(a, 'C'))[0];
      const premier = winner.cand && winner.cand !== 'PLAYER' ? winner.cand : P(big).leader;
      const pParty = winner.candParty || big;
      h += `<div class="card hero"><h3>${esc(winner.name)} ha la maggioranza</h3><p class="small muted">L’incarico va a <b>${esc(premier)}</b>.</p>${meIn ? (isLeader() ? `<button class="btn gold block" onclick="joinAIGov(${JSON.stringify(mem).replace(/"/g, '&quot;')},'${esc(premier)}','${pParty}')">Entra nel governo con ${esc(myParty().short)} ›</button><button class="btn block mt" onclick="externalSupport(${JSON.stringify(mem).replace(/"/g, '&quot;')},'${esc(premier)}','${pParty}')">Appoggio esterno (niente ministri)</button>` : `<button class="btn gold block" onclick="joinAIGov(${JSON.stringify(mem).replace(/"/g, '&quot;')},'${esc(premier)}','${pParty}')">Continua ›</button>`) : `<button class="btn block" onclick="joinAIGov(${JSON.stringify(mem).replace(/"/g, '&quot;')},'${esc(premier)}','${pParty}')">Vai all’opposizione ›</button>`}</div>`;
    }
    replaceSheet(h); return;
  }
  // nessuna maggioranza precostituita
  const sets = feasibleSets({ exclude: f.exclude }).slice(0, 6);
  h += `<div class="card"><h3>${f.after === 'crisi' ? 'Crisi di governo' : 'Nessuna maggioranza dal voto'}</h3><div class="small muted mt">${f.after === 'crisi' ? 'Il Presidente verifica se esiste una nuova maggioranza.' : 'Nessuna coalizione ha i numeri da sola: servono accordi in Parlamento.'}${f.tries ? ` Tentativi falliti: ${f.tries}.` : ''}</div></div>`;
  if (sets.length) {
    h += `${sec('Maggioranze possibili')}`;
    sets.forEach((s, i) => {
      const big = largestIn(s.set);
      const meIn = s.set.includes(myPid());
      const premierMe = meIn && big === myPid() && isLeader();
      h += `<div class="card"><div class="row wrap" style="gap:4px">${s.set.map(partyChip).join('')}</div><div class="small mt">Camera <b>${seatsOfSet(s.set, 'C')}</b> · Senato <b>${seatsOfSet(s.set, 'S')}</b> · premier: <b>${premierMe ? 'tu' : esc(P(big).leader)}</b></div>`;
      if (isLeader() && meIn) {
        if (premierMe) { const acc = premierAcceptance(s.set); h += `<div class="row wrap mt" style="gap:6px">${Object.entries(acc).map(([p, v]) => `<span class="tag ${v >= 55 ? 'g' : v >= 35 ? 'w' : 'b'}">${esc(P(p).short)} ${v}%</span>`).join('')}</div><button class="btn gold block mt" onclick="tryPlayerGov(${i})">Proponi: governo guidato da te</button>`; }
        else h += `<button class="btn pri block mt" onclick="joinAIGov(${JSON.stringify(s.set).replace(/"/g, '&quot;')},'${esc(P(big).leader)}','${big}')">Sostieni un governo ${esc(P(big).leader)}</button><button class="btn sm mt" onclick="tryPlayerGov(${i},true)">Chiedi tu la guida (difficile)</button>`;
      }
      h += `</div>`;
    });
  }
  if (isLeader() && seatsOf(myPid(), 'C') > 0) h += `<button class="btn block mt" onclick="openBuilder()">${icon('puzzle')} Costruisci tu una maggioranza</button>`;
  h += `<div class="col mt2">`;
  h += `<button class="btn block" onclick="mattarellaDecides()">${isLeader() ? 'Resta all’opposizione: decida il Quirinale' : 'Il leader decide: avanti'}</button>`;
  h += `</div>`;
  window._sets = sets;
  replaceSheet(h);
}
function acceptIncarico(set) { G.formation.set = set; G.formation.ministers = null; G.formation.step = 'ministri'; renderFormation(); }
function joinAIGov(set, premier, pParty) {
  formAIGovernment(set, premier, pParty, false);
  const meIn = set.includes(myPid());
  closeSheet(true); renderGame();
  if (meIn && isLeader()) setTimeout(() => offerMinistry(), 400);
  else if (meIn && !isLeader()) setTimeout(() => careerGovOffer(), 400);
  else setTimeout(() => resultSheet('building', `Nasce il ${G.gov.name}`, `${esc(myParty().short)} è all’opposizione. Fai sentire la tua voce in aula e nel Paese.`), 400);
}
function externalSupport(set, premier, pParty) {
  const rest = set.filter(p => p !== myPid());
  formAIGovernment(rest.length && hasMajority(rest) ? rest : set, premier, pParty, false);
  if (G.gov.parties.includes(myPid())) { Object.keys(G.gov.ministers).forEach(k => { const pp = person(G.gov.ministers[k]); if (pp && pp.party === myPid()) delete G.gov.ministers[k]; }); }
  closeSheet(true); renderGame();
  resultSheet('hands', 'Appoggio esterno', 'Voti la fiducia ma resti fuori dal governo: mani libere, ma meno potere.');
}
function offerMinistry() {
  const mine = Object.keys(G.gov.ministers).filter(k => { const pp = person(G.gov.ministers[k]); return pp && pp.party === myPid(); });
  if (!mine.length) { resultSheet('building', `Nasce il ${G.gov.name}`, 'Il tuo partito sostiene il governo.'); return; }
  openSheet(`${head(`Nasce il ${esc(G.gov.name)}`, `${esc(myParty().short)} ottiene ${mine.length} ministeri`)}
    <p class="small muted">Vuoi entrare personalmente nel governo? Diventerai anche vicepresidente del Consiglio.</p>
    ${mine.map(k => `<button class="choice" onclick="takeMinistry('${k}')"><div class="t">${esc(MIN_BY_ID[k].n)}</div><div class="tiny muted">al posto di ${esc(G.gov.ministers[k])}</div></button>`).join('')}
    <button class="btn block mt" onclick="closeSheet()">No, resto leader di partito fuori dal governo</button>`);
}
function takeMinistry(k) {
  G.gov.ministers[k] = G.player.name; G.player.minister = k; if (!G.gov.vice.includes(G.player.name)) G.gov.vice.push(G.player.name);
  G.player.fama = clamp(G.player.fama + 8, 0, 100);
  G.careerLog.push({ w: G.week, t: `Vicepremier e ministro (${MIN_BY_ID[k].n})` });
  addNews(`${G.player.name} giura come vicepresidente del Consiglio e ministr${G.player.art === 'la' ? 'a' : 'o'} (${MIN_BY_ID[k].n}).`, 'mio');
  closeSheet(); renderGame(); confetti();
}
function careerGovOffer() {
  const p = G.player;
  if (p.rank >= 5 && p.fama >= 45 && p.rap >= 35) {
    const mine = Object.keys(G.gov.ministers).filter(k => { const pp = person(G.gov.ministers[k]); return pp && pp.party === myPid(); });
    if (mine.length) { const k = pick(mine); G.gov.ministers[k] = p.name; p.minister = k; p.rank = 6; G.careerLog.push({ w: G.week, t: `Ministro (${MIN_BY_ID[k].n})` }); confetti(); resultSheet('building', `Sei ministr${p.art === 'la' ? 'a' : 'o'}!`, `${esc(myParty().leader)} ti indica per ${esc(MIN_BY_ID[k].n)}.`); renderGame(); return; }
  }
  if (p.rank >= 3 && p.fama >= 30 && p.rap >= 25 && inGov(myPid())) { p.rank = Math.max(p.rank, 5); resultSheet('trend', 'Sottosegretario', `Entri nel ${esc(G.gov.name)} come sottosegretari${p.art === 'la' ? 'a' : 'o'}.`); renderGame(); return; }
  resultSheet('building', `Nasce il ${G.gov.name}`, inGov(myPid()) ? 'Il tuo partito è al governo, ma per te non c’è ancora un incarico.' : 'Il tuo partito è all’opposizione.');
}
function tryPlayerGov(i, asSmaller) {
  const s = window._sets[i]; const set = s.set;
  const acc = premierAcceptance(set);
  const pen = asSmaller ? 20 : 0;
  const ok = Object.values(acc).every(v => chance(clamp((v - pen) / 100 + 0.15, 0, 0.98)));
  if (ok) { toast('Gli alleati accettano: hai l’incarico!', 'good'); acceptIncarico(set); }
  else {
    G.formation.tries++;
    const no = Object.entries(acc).sort((a, b) => a[1] - b[1])[0];
    toast(`${P(no[0]).short} dice no`, 'bad');
    if (G.formation.tries >= 3) { mattarellaDecides(); return; }
    renderFormation();
  }
}
let BUILD = null;
function openBuilder() { BUILD = new Set([myPid()]); renderBuilder(); }
function renderBuilder() {
  const set = Array.from(BUILD);
  const c = seatsOfSet(set, 'C'), s = seatsOfSet(set, 'S');
  const acc = premierAcceptance(set);
  const blocks = []; set.forEach(a => set.forEach(b => { if (a < b && never(a, b)) blocks.push(`${P(a).short}–${P(b).short}`); }));
  replaceSheet(`<div class="row between"><h2>Costruisci la maggioranza</h2><button class="btn sm" onclick="renderFormation()">‹ Indietro</button></div>
    <div class="card hero mt"><div class="row between"><span>Camera</span><b class="${c >= majority('C') ? 'good' : 'bad'}">${c}/${majority('C')}</b></div>${barH(c, majority('C'), c >= majority('C') ? 'var(--good)' : 'var(--warn)')}<div class="row between mt"><span>Senato</span><b class="${s >= majority('S') ? 'good' : 'bad'}">${s}/${majority('S')}</b></div>${barH(s, majority('S'), s >= majority('S') ? 'var(--good)' : 'var(--warn)')}${blocks.length ? `<div class="small bad mt">Veti incrociati: ${blocks.join(', ')}</div>` : ''}</div>
    ${PIDS().filter(id => id !== myPid() && seatsOf(id, 'C') + seatsOf(id, 'S') > 0).map(id => `<button class="choice ${BUILD.has(id) ? 'sel' : ''}" onclick="BUILD.has('${id}')?BUILD.delete('${id}'):BUILD.add('${id}');renderBuilder()"><div class="row between"><span class="row">${partyChip(id)} <span class="small">${seatsOf(id, 'C')} dep. · ${seatsOf(id, 'S')} sen.</span></span>${BUILD.has(id) ? `<span class="tag ${acc[id] >= 55 ? 'g' : acc[id] >= 35 ? 'w' : 'b'}">accetta ${acc[id]}%</span>` : `<span class="small muted">affinità ${fmt0(compat(id, myPid()))}%</span>`}</div></button>`).join('')}
    <button class="btn gold block mt2" ${c >= majority('C') && s >= majority('S') && !blocks.length ? '' : 'disabled'} onclick="window._sets=[{set:Array.from(BUILD)}];tryPlayerGov(0)">Proponi al Quirinale</button>`);
}
function mattarellaDecides() {
  const f = G.formation;
  let sets = feasibleSets({ exclude: f.exclude.concat(isLeader() ? [myPid()] : []) });
  if (!sets.length && !isLeader()) sets = feasibleSets({ exclude: f.exclude });
  if (sets.length && !G.flags.forceTech) {
    const s = sets[0].set; const big = largestIn(s);
    joinAIGov(s, P(big).leader, big); return;
  }
  const tech = feasibleSets({ tecnico: true, exclude: f.exclude });
  if (tech.length) {
    G.flags.forceTech = false;
    const s = tech.sort((a, b) => b.set.length - a.set.length)[0].set;
    const t = pick(['Mario Draghi', 'Daniele Franco', 'Marta Cartabia', 'Elisabetta Belloni', 'Carlo Cottarelli']);
    formAIGovernment(s, t, null, true);
    closeSheet(true); renderGame();
    resultSheet('cap', `Governo tecnico ${t}`, `${esc(INSTITUTIONS.pdr)} affida l’incarico a ${esc(t)}. ${G.gov.parties.includes(myPid()) ? 'Il tuo partito lo sostiene.' : 'Il tuo partito resta fuori.'}`);
    return;
  }
  // nuove elezioni
  G.cal.election = G.week + 9; G.gov = G.prevGov || G.gov; endFormation(); closeSheet(true); renderGame();
  addNews(`Nessuna maggioranza: ${INSTITUTIONS.pdr} scioglie le Camere. Si vota il ${fmtDate(G.cal.election)}.`, 'parl');
  resultSheet('vote', 'Si torna al voto', `Nuove elezioni il ${fmtDate(G.cal.election)}.`);
}

// ---------- scelta dei ministri ----------
function openCabinet(mode) {
  if (mode === 'rimpasto') {
    if (G.pc < 4) return toast('Capitale politico insufficiente', 'bad');
    G.formation = { step: 'ministri', rimpasto: true, set: G.gov.parties.slice(), ministers: Object.assign({}, G.gov.ministers), vice: (G.gov.vice || []).slice(), old: Object.assign({}, G.gov.ministers), after: 'rimpasto', exclude: [], tries: 0 };
    openSheet('', { full: true, locked: true }); renderCabinet();
  }
}
function quotaInfo(set, ministers) {
  const tot = seatsOfSet(set, 'C') || 1, totalW = MINISTRIES.reduce((s, m) => s + m.w, 0);
  const out = {};
  set.forEach(p => { const q = seatsOf(p, 'C') / tot; const w = MINISTRIES.reduce((s, m) => s + (ministers[m.id] && person(ministers[m.id]) && person(ministers[m.id]).party === p ? m.w : 0), 0) / totalW; out[p] = { q, w }; });
  return out;
}
function renderCabinet() {
  const f = G.formation;
  if (!f.ministers) { f.ministers = {}; f.vice = []; }
  const qi = quotaInfo(f.set, f.ministers);
  const filled = MINISTRIES.filter(m => f.ministers[m.id]).length;
  replaceSheet(`<div class="row between"><div><div class="tiny gold" style="font-weight:800">${f.rimpasto ? 'RIMPASTO' : 'LA SQUADRA DI GOVERNO'}</div><h2>I ministri</h2></div>${f.rimpasto ? '<button class="btn sm" onclick="G.formation=null;closeSheet()">Annulla</button>' : ''}</div>
    <div class="card hero mt"><div class="small muted">Quote attese dagli alleati (in base ai seggi)</div>${f.set.map(p => `<div class="row" style="margin:6px 0">${partyChip(p)}<div class="grow" style="position:relative">${barH(qi[p].w * 100, 100, P(p).color)}<i style="position:absolute;left:${qi[p].q * 100}%;top:-3px;bottom:-3px;width:2px;background:#fff"></i></div><span class="tiny" style="width:84px;text-align:right">${fmt0(qi[p].w * 100)}% / ${fmt0(qi[p].q * 100)}%</span></div>`).join('')}<div class="tiny dim">Barra: peso dei ministeri ottenuti · linea bianca: quota attesa</div>${pactsLine(f.set) ? `<div class="small mt"><b class="gold">${icon('hands', 15)} Promesse fatte in trattativa:</b> ${pactsLine(f.set)}</div>` : ''}</div>
    <div class="row between mt"><span class="small">${filled}/${MINISTRIES.length} ministeri assegnati</span><button class="btn sm" onclick="autoCabinet()">${icon('sparkle')} Completa in automatico</button></div>
    <div class="mt">${MINISTRIES.map(m => { const n = f.ministers[m.id]; const pp = n ? person(n) : null; const vice = n && f.vice.includes(n); return `<div class="card tight click" onclick="pickMinister('${m.id}')"><div class="row"><div class="grow"><div class="tiny muted">${m.key ? icon('key', 13) + ' ' : ''}${esc(m.n)}</div><b class="small">${n ? esc(n) : '<span class="dim">da nominare</span>'}${vice ? ' <span class="tag o">vicepremier</span>' : ''}</b></div>${pp ? (pp.party === 'TEC' ? '<span class="tag">tecnico</span>' : pp.party === 'IND' ? '<span class="tag">indip.</span>' : partyChip(pp.party)) : ''}${pp ? `<span class="tiny muted" style="width:30px;text-align:right">${pp.comp}/10</span>` : ''}</div></div>`; }).join('')}</div>
    <button class="btn gold block mt2" ${filled === MINISTRIES.length ? '' : 'disabled'} onclick="submitCabinet()">${f.rimpasto ? 'Conferma il rimpasto · ⚡4' : 'Presenta la lista al Quirinale ›'}</button>`);
}
function autoCabinet() {
  const f = G.formation;
  const auto = assignCabinet(f.set, myPid(), G.player.name);
  MINISTRIES.forEach(m => { if (!f.ministers[m.id]) { const used = new Set(Object.values(f.ministers)); if (!used.has(auto[m.id])) f.ministers[m.id] = auto[m.id]; else { const alt = allPeople().find(x => (f.set.includes(x.party) || x.party === 'TEC') && !used.has(x.name) && x.name !== G.player.name); if (alt) f.ministers[m.id] = alt.name; } } });
  if (!f.vice.length) f.vice = f.set.filter(p => p !== myPid()).sort((a, b) => seatsOf(b, 'C') - seatsOf(a, 'C')).slice(0, 2).map(p => P(p).leader).filter(n => Object.values(f.ministers).includes(n));
  renderCabinet();
}
function pickMinister(mid) {
  const f = G.formation, m = MIN_BY_ID[mid];
  // chi è già nella squadra resta in elenco, ma con l'avviso: toccandolo chiedo conferma prima di spostarlo
  const usedBy = {}; Object.entries(f.ministers).forEach(([k, v]) => { if (k !== mid && v) usedBy[v] = k; });
  const pool = allPeople().filter(x => (f.set.includes(x.party) || x.party === 'TEC' || x.party === 'IND') && !(x.isPlayer));
  pool.sort((a, b) => (b.pref === mid ? 5 : 0) + b.comp - (a.pref === mid ? 5 : 0) - a.comp);
  const groups = {}; pool.forEach(x => { (groups[x.party] = groups[x.party] || []).push(x); });
  const cur = f.ministers[mid], meAt = usedBy[G.player.name];
  let h = head(esc(m.n), m.key ? 'Ministero chiave: il Quirinale controlla competenza e reputazione' : '');
  if (cur) h += `<div class="qcard small">Scelto ora: <b>${esc(cur)}</b>. Se tocchi un altro nome, lo sostituisci.</div>`;
  h += `<button class="choice ${meAt ? 'taken' : ''}" onclick="${meAt ? `askMoveMinister('${mid}','__me')` : `setMinister('${mid}','__me')`}"><div class="row between"><span class="t">${icon('user', 16)} Interim: lo tieni tu</span>${meAt ? `<span class="tag w">${icon('alert')} hai già ${esc(minShort(meAt))}</span>` : ''}</div><div class="tiny muted">Più carico di lavoro e stress</div></button>`;
  Object.keys(groups).sort((a, b) => (f.set.includes(b) ? 1 : 0) - (f.set.includes(a) ? 1 : 0)).forEach(pid => {
    h += sec(G.parties[pid] ? esc(P(pid).name) : pid === 'TEC' ? 'Tecnici' : 'Indipendenti');
    const free = groups[pid].filter(x => !usedBy[x.name]).slice(0, 12), taken = groups[pid].filter(x => usedBy[x.name]);
    free.concat(taken).forEach(x => { const at = usedBy[x.name], nm = esc(x.name).replace(/'/g, "\\'"); h += `<button class="choice ${cur === x.name ? 'sel' : ''} ${at ? 'taken' : ''}" onclick="${at ? `askMoveMinister('${mid}','${nm}')` : `setMinister('${mid}','${nm}')`}"><div class="row between"><span class="t">${esc(x.name)}</span>${at ? `<span class="tag w">${icon('alert')} già a ${esc(minShort(at))}</span>` : `<span class="small">${'★'.repeat(Math.round(x.comp / 2))}</span>`}</div><div class="fx">${x.pref === mid ? '<span class="p">▲ Esperto del settore</span>' : ''}${x.comp >= 8 ? '<span class="p">▲ Molto competente</span>' : x.comp <= 4 ? '<span class="c">▼ Poco competente</span>' : ''}${x.scandal >= 6 ? '<span class="c">▼ Rischio scandali</span>' : ''}${pid === 'TEC' ? '<span class="p">▲ Mercati e Quirinale apprezzano</span><span class="c">▼ Gli alleati preferiscono politici</span>' : ''}${G.parties[pid] && x.name === P(pid).leader ? '<span class="p">▲ Leader di partito: alleato più soddisfatto</span>' : ''}</div></button>`; });
  });
  if (cur && f.set.length) h += `<button class="btn block mt" onclick="toggleVice('${mid}')">${f.vice.includes(cur) ? 'Togli vicepremier' : 'Nomina vicepremier (max 2)'}</button>`;
  openSheet(h);
}
function setMinister(mid, name) { const f = G.formation; f.ministers[mid] = name === '__me' ? G.player.name : name; closeSheet(); setTimeout(renderCabinet, 50); }
const minShort = id => MIN_BY_ID[id].n.split(/ e |, /)[0];
// la persona è già ministro altrove: avviso e conferma prima di spostarla
function askMoveMinister(mid, name) {
  const f = G.formation, me = name === '__me', who = me ? G.player.name : name;
  const from = Object.keys(f.ministers).find(k => k !== mid && f.ministers[k] === who);
  if (!from) return setMinister(mid, name);
  if (me) return confirmSheet('Un altro interim?', `<p class="muted">Tieni già <b>${esc(MIN_BY_ID[from].n)}</b>. Prendere anche <b>${esc(MIN_BY_ID[mid].n)}</b> raddoppia il lavoro e lo stress.</p>`, 'Tieni anche questo', () => setMinister(mid, '__me'), 'gold');
  confirmSheet(`${esc(who)} è già nella squadra`, `<p class="muted">L’hai già scelto per <b>${esc(MIN_BY_ID[from].n)}</b>. Se lo sposti a <b>${esc(MIN_BY_ID[mid].n)}</b>, quel ministero torna da nominare.</p>`, 'Sposta qui', () => { delete f.ministers[from]; setMinister(mid, name); }, 'gold');
}
function toggleVice(mid) { const f = G.formation, n = f.ministers[mid]; if (f.vice.includes(n)) f.vice = f.vice.filter(x => x !== n); else if (f.vice.length < 2) f.vice.push(n); closeSheet(); setTimeout(renderCabinet, 50); }
function submitCabinet() {
  const f = G.formation;
  // controllo del Quirinale sui ministeri chiave
  if (!f.quirOk) {
    const bad = MINISTRIES.filter(m => m.key).map(m => ({ m, p: person(f.ministers[m.id]) })).find(x => x.p && !x.p.isPlayer && (x.p.comp < 5 || x.p.scandal >= 7));
    if (bad) {
      window._bad = bad;
      openSheet(`<div class="evcard"><div class="img">${medal('building', 76)}</div><h2>Il Presidente ha dubbi</h2><div class="txt">${esc(INSTITUTIONS.pdr)} non firma la nomina di <b>${esc(bad.p.name)}</b> a ${esc(bad.m.n)}: ${bad.p.comp < 5 ? 'profilo ritenuto inadeguato per un ministero così delicato' : 'troppe ombre giudiziarie e mediatiche'}.</div>
        <button class="choice" onclick="closeSheet();pickMinister('${bad.m.id}')"><div class="t">Cambiare nome</div><div class="fx"><span class="p">▲ Rapporti distesi con il Colle</span></div></button>
        <button class="choice" onclick="insistMinister()"><div class="t">Insistere</div><div class="fx"><span class="c">▼ Quirinale −20</span><span class="c">▼ 50% di rifiuto definitivo</span><span class="p">▲ Il partito del ministro apprezza</span></div></button></div>`, { locked: true });
      return;
    }
  }
  if (f.rimpasto) {
    if (!spendPC(4)) return toast('Capitale politico insufficiente', 'bad');
    const qOld = quotaInfo(f.set, f.old), qNew = quotaInfo(f.set, f.ministers);
    f.set.forEach(p => { if (p !== myPid()) G.gov.sat[p] = clamp(G.gov.sat[p] + (qNew[p].w - qOld[p].w) * 150, 0, 100); });
    G.gov.ministers = f.ministers; G.gov.vice = f.vice; delete G.gov.interim;
    addNews(`Rimpasto: giurano al Quirinale i nuovi ministri del ${G.gov.name}.`, 'gov');
    G.formation = null; closeSheet(true); renderGame(); toast('Rimpasto completato', 'good'); return;
  }
  f.step = 'giuramento'; f.quirOk = false; renderFormation();
}
function insistMinister() {
  G.groups.quir = clamp(G.groups.quir - 20, -100, 100);
  closeSheet();
  if (chance(0.5)) { G.formation.quirOk = true; toast('Il Presidente firma, ma il gelo resta', 'bad'); submitCabinet(); }
  else { toast('Il Presidente non firma: cambia nome', 'bad'); pickMinister(window._bad.m.id); }
}
function renderGiuramento() {
  const f = G.formation;
  replaceSheet(`<div class="center mt2">${medal('building', 76)}<div class="tiny gold mt" style="font-weight:800">PALAZZO DEL QUIRINALE · SALONE DELLE FESTE</div><h2 class="mt">Il giuramento</h2><p class="muted small">«Giuro di essere fedele alla Repubblica, di osservarne lealmente la Costituzione e le leggi e di esercitare le mie funzioni nell’interesse esclusivo della Nazione.»</p></div>
    <div class="card"><div class="row">${portrait(G.player.name, 44, { party: myPid() })}<div class="grow"><div class="tiny muted">Presidente del Consiglio</div><b>${esc(G.player.name)}</b></div>${partyChip(myPid())}</div></div>
    <div class="card tight">${MINISTRIES.map((m, i) => { const pp = person(f.ministers[m.id]); return `<div class="li" style="animation:fadeUp .35s ${i * 90}ms both"><div class="grow"><div class="tiny muted">${esc(m.n)}</div><b class="small">${esc(f.ministers[m.id])}</b></div>${pp && G.parties[pp.party] ? partyChip(pp.party) : '<span class="tag">tecnico</span>'}</div>`; }).join('')}</div>
    <button class="btn gold block mt2" onclick="G.formation.step='fiducia';renderFormation()">Alle Camere per la fiducia ›</button>`);
}
function renderFiducia() {
  const f = G.formation;
  // prima del voto, il discorso alle Camere: convince (o no) gli alleati
  if (!f.speechDone && typeof openSpeech === 'function') { f.speechDone = true; return openSpeech('fiducia', res => { f.speechBonus = res.maj * 2 + res.opp; renderFiducia(); }); }
  const qi = quotaInfo(f.set, f.ministers);
  const sat = {}; f.set.forEach(p => { sat[p] = p === myPid() ? 90 : clamp(55 + (qi[p].w - qi[p].q) * 120 + (f.vice.some(n => person(n) && person(n).party === p) ? 8 : 0) + rel(p, myPid()) * 0.2 + (f.speechBonus || 0), 5, 95); });
  const vote = h => {
    const by = {}; let yes = 0, no = 0, ab = 0;
    PIDS().forEach(p => { const n = seatsOf(p, h); if (!n) return; let y = 0, nn = 0, a = 0; if (f.set.includes(p)) { if (sat[p] >= 20) { const d = Math.round(n * rnd(0, 0.02) * D().defect); y = n - d; a = d; } else { a = n; } } else { if (compat(p, myPid()) > 55 && rel(p, myPid()) > 20) a = n; else nn = n; } by[p] = { yes: y, no: nn, abst: a }; yes += y; no += nn; ab += a; });
    const o = G.otherSeats[h]; const oy = Math.round(o * 0.4); by.ALT = { yes: oy, no: o - oy, abst: 0 }; yes += oy; no += o - oy;
    return { by, yes, no, ab, passed: yes > no };
  };
  const vc = vote('C'), vs = vote('S');
  replaceSheet(`<div class="center"><div class="tiny gold" style="font-weight:800">VOTO DI FIDUCIA</div><h2 class="mt">Il Parlamento vota</h2></div>
    ${sec('Camera dei deputati')}<div class="card">${hemicycle('C', { id: 'fid-c', empty: true })}<div class="center mt" id="fid-c-r"></div></div>
    ${sec('Senato della Repubblica')}<div class="card">${hemicycle('S', { id: 'fid-s', empty: true })}<div class="center mt" id="fid-s-r"></div></div>
    <div id="fid-end"></div>`);
  setTimeout(() => { animateVote($('#fid-c'), vc.by); setTimeout(() => { $('#fid-c-r').innerHTML = `<span class="stamp ${vc.passed ? 'good' : 'bad'}">${vc.passed ? 'FIDUCIA' : 'SFIDUCIA'}</span><div class="small mt">Sì ${vc.yes} · No ${vc.no} · Astenuti ${vc.ab}</div>`; vib(30); }, 1500); }, 400);
  setTimeout(() => { animateVote($('#fid-s'), vs.by); setTimeout(() => {
    $('#fid-s-r').innerHTML = `<span class="stamp ${vs.passed ? 'good' : 'bad'}">${vs.passed ? 'FIDUCIA' : 'SFIDUCIA'}</span><div class="small mt">Sì ${vs.yes} · No ${vs.no} · Astenuti ${vs.ab}</div>`; vib(30);
    if (vc.passed && vs.passed) {
      $('#fid-end').innerHTML = `<div class="card hero center mt2">${medal('flag', 70)}<h2 class="mt">Il governo ha la fiducia</h2><p class="muted">Ora sei ${G.player.art === 'la' ? 'la' : 'il'} Presidente del Consiglio dei ministri.</p><button class="btn gold block" onclick="finishGovernment()">A Palazzo Chigi ›</button></div>`;
      confetti();
    } else {
      $('#fid-end').innerHTML = `<div class="card center mt2"><h3 class="bad">Fiducia negata</h3><p class="muted small">Gli alleati scontenti non ti hanno votato. Si torna alle consultazioni.</p><button class="btn block" onclick="G.formation.step='consultazioni';G.formation.tries++;renderFormation()">Consultazioni ›</button></div>`;
    }
    const el = $('#fid-end'); if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 1500); }, 3600);
}
function finishGovernment() {
  const f = G.formation;
  startPlayerGovernment(f.set, f.ministers, f.vice);
  checkPacts();
  if (Object.values(f.ministers).includes(G.player.name)) G.gov.interim = Object.keys(f.ministers).find(k => f.ministers[k] === G.player.name);
  closeSheet(true); renderGame(); saveGame('auto'); setTimeout(() => celebrate(checkAchievements()), 2500);
  setTimeout(() => openSheet(`<div class="center">${medal('building', 90)}<h2 class="mt">Benvenut${G.player.art === 'la' ? 'a' : 'o'} a Palazzo Chigi</h2><p class="muted">Il passaggio della campanella è fatto. Ora: leggi, decreti, la manovra d’autunno e una coalizione da tenere unita.</p></div><button class="btn gold block mt" onclick="closeSheet()">Al lavoro, ${esc(G.player.art === 'la' ? 'Presidente' : 'Presidente')}</button>`), 350);
}

// ============================================================
//  ELEZIONE DEL PRESIDENTE DELLA REPUBBLICA
// ============================================================
const QUIR_CANDS = [['Mario Draghi', 'TEC'], ['Marta Cartabia', 'TEC'], ['Giuliano Amato', 'PD'], ['Paolo Gentiloni', 'PD'], ['Maria Elisabetta Alberti Casellati', 'FI'], ['Antonio Tajani', 'FI'], ['Pier Ferdinando Casini', 'NM'], ['Elisabetta Belloni', 'TEC'], ['Sabino Cassese', 'TEC'], ['Dario Franceschini', 'PD'], ['Emma Bonino', 'PE'], ['Gianni Letta', 'FI'], ['Giorgia Meloni', 'FDI']];
let QV = null;
function openQuirinale() {
  const can = isLeader() && (isPremier() || (G.gov && G.gov.premierParty === myPid()) || myParty().seatsC > 60);
  QV = { round: 1, cand: null, log: [], can };
  const list = QUIR_CANDS.filter(([n, p]) => G.parties[p] || p === 'TEC').map(x => ({ name: x[0], p: x[1] }));
  if (G.player.age >= 50 && G.player.fama >= 60 && !isPremier()) list.unshift({ name: G.player.name, p: myPid(), me: true });
  QV.list = list;
  openSheet('', { full: true, locked: true }); renderQuirinale();
}
function quirSupport(c) {
  // seggi che votano un candidato
  let tot = 0;
  const proposer = G.gov ? G.gov.premierParty : myPid();
  PIDS().forEach(pid => {
    const n = seatsOf(pid, 'C') + seatsOf(pid, 'S'); if (!n) return;
    let s = c.p === 'TEC' ? 58 - (['FN', 'AVS'].includes(pid) ? 20 : 0) : compat(pid, c.p) * 0.8 + 10;
    s += rel(pid, proposer) * 0.15;
    if (c.me) s = compat(pid, myPid()) * 0.7 + rel(pid, myPid()) * 0.4 + G.player.fama * 0.15;
    if (s >= 45) tot += n;
  });
  tot += Math.round(58 * 0.55) + 3;
  return Math.round(tot * rnd(0.88, 0.97));
}
function renderQuirinale() {
  const electors = totalSeats('C') + totalSeats('S') + 58;
  const quorum = QV.round <= 3 ? Math.ceil(electors * 2 / 3) : Math.floor(electors / 2) + 1;
  let h = `<div class="center">${medal('building', 76)}<div class="tiny gold mt" style="font-weight:800">PARLAMENTO IN SEDUTA COMUNE</div><h2 class="mt">Elezione del Presidente della Repubblica</h2><div class="small muted">${electors} grandi elettori (deputati, senatori e 58 delegati regionali). Scrutinio ${QV.round}: quorum <b>${quorum}</b> ${QV.round <= 3 ? '(due terzi)' : '(maggioranza assoluta)'}</div></div>`;
  if (QV.log.length) h += `<div class="card tight mt">${QV.log.map(x => `<div class="small" style="padding:3px 0">${x.r}° scrutinio: <b>${esc(x.c)}</b> ${x.v} voti</div>`).join('')}</div>`;
  if (QV.can) h += `${sec('Chi proponi?')}${QV.list.map((c, i) => { const est = quirSupport(c); return `<button class="choice" onclick="quirVote(${i})"><div class="row between"><span class="t">${c.me ? icon('crown', 15) + ' ' : ''}${esc(c.name)}</span><span class="small">${c.p === 'TEC' ? 'tecnico' : esc(G.parties[c.p] ? P(c.p).short : '')}</span></div><div class="fx"><span class="${est >= quorum ? 'p' : 'c'}">stima ${est} voti</span></div></button>`; }).join('')}`;
  else h += `<p class="muted small center mt">I leader dei partiti maggiori trattano sul nome.</p><button class="btn gold block mt" onclick="quirVote(-1)">Segui lo scrutinio ›</button>`;
  replaceSheet(h);
}
function quirVote(i) {
  const electors = totalSeats('C') + totalSeats('S') + 58;
  const quorum = QV.round <= 3 ? Math.ceil(electors * 2 / 3) : Math.floor(electors / 2) + 1;
  let c = i >= 0 ? QV.list[i] : null;
  if (!c) c = QV.list.filter(x => !x.me).map(x => ({ x, v: quirSupport(x) })).sort((a, b) => b.v - a.v)[QV.round > 3 ? 0 : irnd(0, 2)].x;
  const v = quirSupport(c);
  QV.log.push({ r: QV.round, c: c.name, v });
  if (v >= quorum || QV.round >= 8) {
    const name = v >= quorum ? c.name : 'Sergio Mattarella';
    INSTITUTIONS.pdr = name; G.cal.quirinale = G.week + 365;
    const pp = c.p && G.parties[c.p] ? c.p : null;
    G.groups.quir = pp ? clamp(compat(pp, myPid()) - 40, -50, 60) : 25;
    addNews(`${name} è il nuovo Presidente della Repubblica, eletto al ${QV.round}° scrutinio con ${v} voti.`, 'parl');
    if (c.me && v >= quorum) { G.careerLog.push({ w: G.week, t: 'Eletto Presidente della Repubblica' }); confetti(); replaceSheet(`<div class="center mt2">${medal('flag', 96)}<h2 class="mt">${esc(G.player.name)}, Presidente della Repubblica</h2><p class="muted">Il punto più alto della carriera politica. Sette anni al Quirinale: la tua storia di partito finisce qui.</p></div><button class="btn gold block mt2" onclick="endGame('quirinale')">Il bilancio della carriera ›</button>`); return; }
    replaceSheet(`<div class="center mt2">${medal('building', 90)}<h2 class="mt">Habemus Presidente</h2><p class="muted">${esc(name)} è eletto${QV.round > 1 ? ` al ${QV.round}° scrutinio` : ' al primo scrutinio'}.</p></div><button class="btn gold block mt2" onclick="closeSheet();doneQueue()">Continua</button>`);
    return;
  }
  QV.round++;
  toast(`${c.name}: ${v} voti, quorum non raggiunto`, 'bad');
  renderQuirinale();
}
function endGame(why) {
  G.phase = 'fine'; saveGame('auto'); closeSheet(true);
  const p = G.player;
  openSheet(`<div class="center">${medal('building', 90)}<h2 class="mt">La carriera di ${esc(p.name)}</h2></div><div class="grid2 mt">${[['Leggi approvate', G.stats.laws], ['Governi', G.stats.govs], ['Settimane da premier', G.stats.weeksPremier], ['Fama finale', Math.round(p.fama)]].map(([a, b]) => `<div class="kpi"><div class="l">${a}</div><div class="v">${b}</div></div>`).join('')}</div><div class="card tight mt"><div class="list">${G.careerLog.map(x => `<div class="news-item"><span class="w">${fmtDate(x.w, true)}</span><span>${esc(x.t)}</span></div>`).join('')}</div></div><button class="btn gold block mt" onclick="openTimeline()">${icon('book')} La tua storia</button><button class="btn block mt" onclick="openAchievements()">${icon('medal')} Traguardi</button><button class="btn pri block mt" onclick="closeSheet(true);showSplash()">Menu iniziale</button>`, { locked: true });
}
function afterLoad() { if (G.phase === 'formazione') setTimeout(openFormation, 300); }

// avvio
window.addEventListener('load', () => { showSplash(); });

// ============================================================
//  VOTAZIONI DELLA SETTIMANA (voto personale e del gruppo)
// ============================================================
let VOTI = null;
const VLAB = { yes: 'Sì', no: 'No', abst: 'Astensione' };
function openVotes(ids, direct) {
  const bills = ids.map(id => G.bills.find(b => b.id === id)).filter(b => b && !b.dead && b.stages[b.stage] && b.stages[b.stage].k === 'aula' && b.askedAt !== b.stage);
  if (!bills.length) { if (direct) return toast('Hai già votato tutto'); G.queue.shift(); return processQueue(); }
  VOTI = { bills: bills.map(b => b.id), sel: {}, direct };
  bills.forEach(b => { const h = b.stages[b.stage].h; const line = isPremier() && b.proposer === 'GOV' ? 'yes' : (G.myVotes[b.id] || partyLine(b, h)); VOTI.sel[b.id] = { group: line, me: line, fid: !!b.fiducia, line }; });
  openSheet('', { full: true, locked: true });
  const govOwn = bills.some(b => isPremier() && b.proposer === 'GOV');
  if (govOwn) renderVotes(); else renderSwipeVotes();
}
function billChangeText(b) {
  if (b.type === 'manovra') { const c = budgetSum('c', b.measures); return `Manovra con ${b.measures.length} misure, saldo ${c > 0 ? '+' : ''}${fmt1(c)} miliardi di deficit.`; }
  const l = getLaw(b.lawId); return `<b>Oggi:</b> ${esc(l.opts[b.from].t)}<br><b>Diventerebbe:</b> ${esc(l.opts[b.opt].d)}`;
}
// intestazione chiara di un voto: Camera o Senato, chi lo propone, cosa cambia, effetti
function voteHeadHTML(b) {
  const s = b.stages[b.stage], cam = s.h === 'C';
  const mine = b.lawId ? lawGain(myPid(), getLaw(b.lawId), b.from, b.opt) : 0;
  const effs = b.lawId ? effectsOf(getLaw(b.lawId), b.from, b.opt) : [];
  const pr = predictVote(b);
  return `<div class="vh"><span class="house ${cam ? 'c' : 's'}">${icon('building')} ${cam ? 'CAMERA' : 'SENATO'}${s.r ? ` · ${s.r}ª LETTURA` : ''}</span>${proposerLabel(b)}</div>
    <h3 style="margin-top:10px">${esc(billName(b))}</h3>
    <div class="row wrap mt" style="gap:6px">${kindTag(b)}${b.lawId ? `<span class="tiny muted">${esc(getLaw(b.lawId).nome)}</span>` : ""}</div><div class="mt">${iterHTML(b)}</div>
    <div class="change mt"><div><span class="tiny muted">OGGI</span><b>${b.lawId ? esc(getLaw(b.lawId).opts[b.from].t) : 'Bilancio in vigore'}</b></div><span class="arrow">${icon('chevron')}</span><div><span class="tiny muted">DIVENTEREBBE</span><b>${b.lawId ? esc(getLaw(b.lawId).opts[b.opt].t) : esc(billName(b))}</b></div></div>
    <div class="mt">${b.lawId ? explainHTML(getLaw(b.lawId), b.opt) : `<div class="expl"><span class="k">In pratica</span>${billChangeText(b)}</div>`}</div>
    ${effs.length ? effChipsHTML(effs) : ''}
    <div class="verdict mt"><span class="${mine > 0.2 ? 'g' : mine < -0.2 ? 'b' : 'n'}">${mine > 0.2 ? icon('smile', 15) + ' In linea con le tue idee' : mine < -0.2 ? icon('frown', 15) + ' Contro le tue idee' : 'Neutra per le tue idee'}</span><span class="${pr.passed ? 'g' : 'b'}">${pr.passed ? '✓ Previsione: passa' : '✗ Previsione: bocciata'}</span></div>
    <button class="btn sm mt" onclick="openBill(${b.id})">${icon('scales')} Tutti i pro e contro</button>`;
}
function renderVotes() {
  const sh = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null, keep = sh ? sh.scrollTop : 0;
  const seg = (id, field, val) => `<div class="seg mt">${['yes', 'abst', 'no'].map(v => `<button class="${val === v ? 'on' : ''}" onclick="VOTI.sel[${id}].${field}='${v}';${field === 'group' ? `VOTI.sel[${id}].me='${v}';` : ''}renderVotes()">${v === 'yes' ? '✓ ' : v === 'no' ? '✗ ' : '– '}${VLAB[v]}</button>`).join('')}</div>`;
  let h = `<div class="center">${medal('vote', 70)}<h2 class="mt">Votazioni in arrivo</h2><div class="tiny gold" style="font-weight:800">SI VOTA NELLA SETTIMANA DEL ${fmtDate(G.week + 1, true).toUpperCase()}</div></div>`;
  if (!VOTI.bills.some(id => isPremier() && G.bills.find(x => x.id === id).proposer === 'GOV')) h += `<button class="btn block mt" onclick="VOTI.done={};renderSwipeVotes()">${icon('swap')} Vota a scorrimento</button>`;
  VOTI.bills.forEach(id => {
    const b = G.bills.find(x => x.id === id), s = b.stages[b.stage];
    const st = VOTI.sel[id];
    const govB = b.proposer === 'GOV', myGov = isPremier() && govB;
    const groupHere = isLeader() && seatsOf(myPid(), s.h) > 0;
    const meHere = G.player.parl === s.h;
    h += `<div class="card vote-card" style="--vc:${govB ? '#ffd60a' : G.parties[b.proposer] ? P(b.proposer).color : '#a78bfa'}">${voteHeadHTML(b)}<div class="decide">`;
    if (myGov) {
      h += `<div class="small"><b>È una legge del tuo governo:</b> la tua maggioranza vota Sì.</div>`;
      if (b.type !== 'cost') h += `<button class="btn block mt ${st.fid ? 'gold' : ''}" onclick="VOTI.sel[${id}].fid=!VOTI.sel[${id}].fid;renderVotes()">${st.fid ? icon('check') + ' Porrai la fiducia' : icon('lock') + ' Porre la fiducia'} · ⚡3</button>${fiduciaCompareHTML(b, st.fid)}`;
    } else {
      h += `<div class="small">Il tuo partito ${isLeader() ? 'per le sue idee' : `(${esc(myParty().leader)})`} vota: <b>${VLAB[st.line]}</b></div>`;
      if (groupHere) h += `<div class="tiny muted mt" style="font-weight:800">${meHere ? 'TU E IL TUO GRUPPO' : 'IL TUO GRUPPO'} · ${seatsOf(myPid(), s.h)} ${s.h === 'C' ? 'DEPUTATI' : 'SENATORI'}</div>${seg(id, 'group', st.group)}`;
      else if (meHere) {
        h += `<div class="tiny muted mt" style="font-weight:800">IL TUO VOTO</div>${seg(id, 'me', st.me)}`;
        if (st.me !== st.line) {
          const heavy = govB && inGov(myPid()) && (b.fiducia || b.type === 'manovra');
          h += `<div class="effs"><span class="eff b">▼ Rapporto col leader −${heavy ? 20 : 8}</span><span class="eff g">▲ Notorietà +${heavy ? 5 : 3}</span><span class="eff g">▲ Seguito +${heavy ? 4 : 2}%</span></div>`;
        }
      }
      if (isLeader() && govB && inGov(myPid()) && st.group !== 'yes') h += `<div class="effs"><span class="eff b">▼ Voti contro il tuo governo: alleati irritati</span></div>`;
    }
    h += `</div></div>`;
  });
  h += `<button class="btn gold block mt" onclick="confirmVotes()">Conferma i voti</button>`;
  replaceSheet(h);
  const sh2 = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null;
  if (sh2) sh2.scrollTop = keep;
}
function confirmVotes() {
  let fidCost = 0;
  VOTI.bills.forEach(id => { const b = G.bills.find(x => x.id === id), st = VOTI.sel[id]; if (isPremier() && b.proposer === 'GOV' && st.fid && !b.fiducia) fidCost += 3; });
  if (fidCost && G.pc < fidCost) return toast('Capitale politico insufficiente per tutte le fiducie', 'bad');
  VOTI.bills.forEach(id => {
    const b = G.bills.find(x => x.id === id), st = VOTI.sel[id], s = b.stages[b.stage];
    b.askedAt = b.stage;
    if (isPremier() && b.proposer === 'GOV') { if (st.fid && !b.fiducia) { spendPC(3); b.fiducia = true; } else if (!st.fid) b.fiducia = false; return; }
    if (isLeader() && seatsOf(myPid(), s.h) > 0) {
      G.myVotes[id] = st.group; G.myPersonal[id] = st.group;
      if (b.proposer === 'GOV' && inGov(myPid()) && st.group === 'no') { addRel(G.gov.premierParty, myPid(), -6); G.gov.parties.forEach(p => { if (p !== myPid()) addRel(p, myPid(), -2); }); addNews(`${myParty().short} vota contro «${billName(b)}» del proprio governo: tensione in maggioranza.`, 'mio'); }
      if (st.group !== st.line) G.cred = clamp(G.cred - 1, 0, 100);
      return;
    }
    if (G.player.parl === s.h) {
      G.myPersonal[id] = st.me;
      if (st.me !== st.line) {
        const heavy = b.proposer === 'GOV' && inGov(myPid()) && (b.fiducia || b.type === 'manovra');
        applyFx(heavy ? { rap: -20, fama: 5, seguito: 4 } : { rap: -8, fama: 3, seguito: 2 });
        addNews(`${G.player.name} vota in dissenso dal suo gruppo su «${billName(b)}».`, 'mio');
      } else applyFx({ rap: 1 });
    }
  });
  const direct = VOTI.direct;
  closeSheet();
  // rimuove dalla coda un'eventuale scheda di voto ormai compilata
  if (direct) { G.queue = G.queue.filter(q => !(q.sp && q.sp.k === 'voti' && q.sp.ids.every(id => { const b = G.bills.find(x => x.id === id); return !b || b.askedAt === b.stage; }))); renderGame(); flyResult('vote', 'Voti registrati', [], 'Il risultato arriva con la settimana successiva'); }
  else doneQueue();
}
