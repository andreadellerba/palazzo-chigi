// ============================================================
//  FINE PARTITA: giudizio degli storici, ritiro con erede o senza
//  (e i cinque anni dopo simulati), nuovi traguardi, scenari
// ============================================================

// ---------- giudizio degli storici ----------
function historiansVerdict() {
  const s = G.stats, p = G.player, h = G.hist.econ, a = h[0] || {}, z = h[h.length - 1] || {};
  let sc = Math.min(30, s.weeksPremier / 52 * 8) + Math.min(20, s.laws * 1.2) + Math.min(10, (s.govs || 0) * 2) + p.fama / 6;
  const facts = [];
  if (s.weeksPremier >= 52) facts.push(`${fmt1(s.weeksPremier / 52)} anni a Palazzo Chigi`);
  if (s.laws) facts.push(`${s.laws} leggi approvate`);
  if (h.length > 10 && s.weeksPremier > 20) {
    const dd = (a.debito || 0) - (z.debito || 0), dp = (z.pil || 0) - (a.pil || 0), ds = (a.spread || 0) - (z.spread || 0);
    sc += clamp(dd, -10, 10) + clamp(dp * 5, -8, 8) + clamp(ds / 20, -6, 6);
    facts.push(`debito ${dd >= 0 ? 'sceso' : 'salito'} di ${fmt1(Math.abs(dd))} punti`, `spread da ${fmt0(a.spread || 0)} a ${fmt0(z.spread || 0)}`);
  }
  const grades = [[70, 'Uno statista', 'I manuali di storia gli dedicheranno un capitolo intero: ha cambiato il Paese e lo ha lasciato più solido di come l’aveva trovato.'],
    [45, 'Un leader che ha lasciato il segno', 'Luci e ombre, ma una stagione riconoscibile della politica italiana porta il suo nome.'],
    [25, 'Una carriera onesta', 'Non ha cambiato la storia, ma ci ha provato con serietà. Ricordato con rispetto.'],
    [0, 'Una meteora', 'Molto rumore, poche tracce: tra qualche anno in pochi si ricorderanno il suo nome.']];
  const g = grades.find(x => sc >= x[0]);
  return { score: Math.round(sc), title: g[1], text: g[2], facts };
}
function verdictHTML() {
  const v = historiansVerdict();
  return `<div class="card hero mt" style="--pc:#d6b25e"><div class="tiny gold" style="font-weight:800;letter-spacing:.1em">IL GIUDIZIO DEGLI STORICI</div><h3 class="mt">${esc(v.title)}</h3><p class="small muted mt">${esc(v.text)}</p>${v.facts.length ? `<div class="row wrap mt" style="gap:5px">${v.facts.map(f => `<span class="tag">${esc(f)}</span>`).join('')}</div>` : ''}<div class="tiny dim mt">Punteggio storico: ${v.score}</div></div>`;
}
const _endGameEp = endGame;
endGame = function (why) {
  _endGameEp(why);
  const sh = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null;
  if (sh) sh.insertAdjacentHTML('beforeend', verdictHTML());
};

// ---------- ritiro: con un erede o guardando da fuori ----------
function openRetire() {
  const mates = isLeader() ? allPeople().filter(x => x.party === myPid() && !x.isPlayer && x.name !== G.player.name).sort((a, b) => b.comp - a.comp).slice(0, 4) : [];
  openSheet(`${head('Ritirati dalla politica', 'La partita finisce qui')}
    <p class="small muted">Lasci la politica attiva. Il gioco simula i cinque anni successivi con le regole di sempre e ti racconta com’è andata, poi arriva il giudizio degli storici.</p>
    ${mates.length ? sec('Lascia tutto al tuo erede') + mates.map(x => `<button class="choice" onclick="startRetire('${x.name.replace(/'/g, '’')}')"><div class="row">${portrait(x.name, 44)}<div class="grow"><div class="t">${esc(x.name)}</div><div class="small muted">Competenza ${x.comp}/10 · guiderà ${esc(myParty().short)}${isPremier() ? ' e Palazzo Chigi' : ''}</div></div></div></button>`).join('') : ''}
    ${sec('Oppure')}<button class="choice" onclick="startRetire('')"><div class="t">Mi ritiro e guardo come va</div><div class="small muted">${isLeader() ? 'Il partito sceglie da solo il nuovo leader.' : 'Esci di scena senza designare nessuno.'}</div></button>
    <button class="btn block mt2" onclick="closeSheet()">Ci ho ripensato</button>`);
}
let RET = null;
function startRetire(heirName) {
  const p = G.player, pid = myPid(), wasLeader = isLeader(), wasPremier = isPremier();
  let heir = heirName ? (allPeople().find(x => x.name.replace(/'/g, '’') === heirName) || { name: heirName, comp: 6 }) : null;
  if (!heir && wasLeader) heir = allPeople().filter(x => x.party === pid && !x.isPlayer && x.name !== p.name).sort((a, b) => b.comp - a.comp)[0] || { name: randomName(), comp: 5 };
  RET = { from: G.week, heir: heir ? heir.name : null, heirComp: heir ? heir.comp : 0, pid, wasPremier, start: { poll: P(pid).poll, appr: G.gov ? G.gov.approval : null, debt: G.econ.debito }, log: [], govs: [], heirWeeksPrem: 0, done: 0 };
  G.careerLog.push({ w: G.week, t: heir && heirName ? `Ti ritiri e lasci il partito a ${heir.name}` : 'Ti ritiri dalla politica' });
  // il giocatore esce di scena
  if (heir) { const pp = P(pid); pp.leader = heir.name; pp.lCar = clamp(heir.comp - 1 + irnd(-1, 1), 3, 9); pp.lComp = heir.comp; }
  G.coalitions.forEach(c => { if (c.cand === 'PLAYER') { c.cand = heir ? heir.name : P(c.candParty || pid).leader; c.candLocked = false; } });
  if (G.gov && G.gov.premier === 'PLAYER') { G.gov.premier = heir ? heir.name : P(G.gov.premierParty).leader; G.gov.name = govName(G.gov.premier); }
  if (p.minister && G.gov) { replaceMinister(p.minister, pid); }
  Object.assign(p, { leader: false, minister: null, parl: null, candidate: null });
  G.flags.retired = true; G.queue = [];
  closeSheet(true); openSheet('', { full: true, locked: true }); retireStep();
}
function ghostFormation() {
  const f = G.formation; if (!f) return;
  const winner = f.after === 'elezioni' ? G.coalitions.find(c => c.members.length > 1 && hasMajority(c.members.filter(m => G.parties[m]))) : null;
  if (winner) { const mem = winner.members.filter(m => G.parties[m]), big = mem.slice().sort((a, b) => seatsOf(b, 'C') - seatsOf(a, 'C'))[0]; return formAIGovernment(mem, winner.cand && winner.cand !== 'PLAYER' ? winner.cand : P(big).leader, winner.candParty || big, false); }
  const sets = feasibleSets({ exclude: f.exclude || [] });
  if (sets.length) { const s = sets[0].set, big = largestIn(s); return formAIGovernment(s, P(big).leader, big, false); }
  const tech = feasibleSets({ tecnico: true, exclude: f.exclude || [] });
  if (tech.length) return formAIGovernment(tech[0].set, pick(['Daniele Franco', 'Marta Cartabia', 'Carlo Cottarelli']), null, true);
  G.cal.election = G.week + 9; G.gov = G.prevGov || G.gov; endFormation();
}
function retireStep() {
  const R = RET, total = 260;
  for (let k = 0; k < 6 && R.done < total; k++, R.done++) {
    const govBefore = G.gov ? G.gov.name : null;
    try {
      if (G.phase === 'formazione') ghostFormation();
      const s = advanceWeek();
      if (s) s.specials.forEach(x => { if (x.k === 'elezioni') { runGeneralElection(); ghostFormation(); const E = G.lastElection; const top = Object.keys(E.votes).sort((a, b) => E.votes[b] - E.votes[a])[0]; R.log.push({ w: G.week, t: `Elezioni: primo partito ${P(top).short} (${fmt1(E.votes[top])}%), ${P(R.pid) ? P(R.pid).short + ' al ' + fmt1(E.votes[R.pid] || 0) + '%' : ''}` }); } });
      G.queue = [];
      if (G.phase === 'formazione') ghostFormation();
    } catch (e) { console.error(e); G.queue = []; }
    if (G.gov && G.gov.name !== govBefore) R.log.push({ w: G.week, t: `Nasce il ${G.gov.name}${G.gov.tecnico ? ' (tecnico)' : ''}` });
    if (G.gov && R.heir && G.gov.premier === R.heir) R.heirWeeksPrem++;
  }
  const pct = Math.round(R.done / total * 100);
  replaceSheet(`<div class="center" style="margin-top:30vh">${medal('hourglass', 70)}<h2 class="mt">Cinque anni dopo…</h2><div class="small muted mt">${fmtDate(G.week)}</div><div class="bar mt" style="max-width:260px;margin:14px auto 0"><i style="width:${pct}%"></i></div></div>`);
  if (R.done < total) setTimeout(retireStep, 16); else setTimeout(showRetireSummary, 300);
}
function showRetireSummary() {
  const R = RET, pid = R.pid, pp = G.parties[pid];
  const end = { poll: pp ? pp.poll : 0, debt: G.econ.debito };
  let heirLine = '';
  if (R.heir) {
    const y = R.heirWeeksPrem / 52;
    heirLine = R.heirWeeksPrem >= 156 ? `${R.heir} ha fatto meglio di te: ${fmt1(y)} anni a Palazzo Chigi e il partito al ${fmt1(end.poll)}%.`
      : R.heirWeeksPrem >= 26 ? `${R.heir} è arrivato a Palazzo Chigi per ${fmt1(y)} anni, tra alti e bassi.`
      : end.poll > R.start.poll + 1 ? `${R.heir} non è diventato premier, ma ha fatto crescere il partito dal ${fmt1(R.start.poll)}% al ${fmt1(end.poll)}%.`
      : end.poll < R.start.poll * 0.6 ? `${R.heir} ha fallito presto: il partito è crollato dal ${fmt1(R.start.poll)}% al ${fmt1(end.poll)}%.`
      : `${R.heir} ha tenuto il partito più o meno dove l’avevi lasciato (${fmt1(end.poll)}%).`;
  }
  G.phase = 'fine'; saveGame('auto');
  replaceSheet(`<div class="center">${medal('hourglass', 76)}<div class="tiny gold mt" style="font-weight:800;letter-spacing:.1em">${fmtDate(R.from).toUpperCase()} – ${fmtDate(G.week).toUpperCase()}</div><h2 class="mt">Cinque anni dopo</h2></div>
    ${R.heir ? `<div class="card hero mt"><div class="row">${portrait(R.heir, 56)}<div class="grow"><div class="tiny gold" style="font-weight:800">IL TUO EREDE</div><b>${esc(R.heir)}</b><div class="small muted mt">${esc(heirLine)}</div></div></div></div>` : ''}
    <div class="card tight mt"><div class="list">
      <div class="li"><div class="grow small">${pp ? esc(pp.name) : 'Il tuo partito'}</div><b>${fmt1(R.start.poll)}% → ${fmt1(end.poll)}%</b></div>
      <div class="li"><div class="grow small">Debito pubblico</div><b>${fmt1(R.start.debt)}% → ${fmt1(end.debt)}%</b></div>
      <div class="li"><div class="grow small">Governo oggi</div><b class="small">${G.gov ? esc(G.gov.name) : '—'}</b></div></div></div>
    ${R.log.length ? sec('Cosa è successo') + `<div class="card tight"><div class="list">${R.log.slice(-10).map(x => `<div class="li"><span class="tiny muted" style="width:70px;flex:none">${fmtDate(x.w, true)}</span><div class="grow small">${esc(x.t)}</div></div>`).join('')}</div></div>` : ''}
    ${verdictHTML()}
    <button class="btn gold block mt2" onclick="RET=null;closeSheet(true);showSplash()">Torna al menu</button>`);
}

// ---------- nuovi traguardi ----------
const MORE_ACH = [
  { id: 'sfiduciato', ico: 'gavel', n: 'Spallata', d: 'Fai cadere un governo con la sfiducia', c: () => G.careerLog.some(x => /Fai cadere il governo/.test(x.t)) },
  { id: 'dibattito', ico: 'podium', n: 'Re del confronto', d: 'Vinci un confronto TV tra leader', c: () => !!G.flags.debWin },
  { id: 'campagna', ico: 'mega', n: 'Martello', d: 'Porta a termine una campagna a tema', c: () => !!G.flags.campDone },
  { id: 'flessibilita', ico: 'eu', n: 'Trattativa a Bruxelles', d: 'Ottieni flessibilità sui conti', c: () => (G.econ.flex || 0) > 0 },
  { id: 'fondiue', ico: 'eu', n: 'Rata piena', d: 'Sblocca per intero una rata dei fondi europei', c: () => !!G.flags.eufFull },
  { id: 'assolto', ico: 'scales', n: 'Il fatto non sussiste', d: 'Vieni assolto in tribunale', c: () => !!G.flags.assolto },
  { id: 'tuttiverdi', ico: 'check', n: 'Tutto in verde', d: 'Da premier tutti e cinque gli indicatori in positivo', c: () => isPremier() && G.econ.pil >= 1.2 && G.econ.deficit <= 3 && G.econ.spread <= 160 && G.econ.dis <= 6 && G.econ.infl <= 2.5 },
  { id: 'cinqueanni', ico: 'crown', n: 'Legislatura intera', d: 'Cinque anni da premier', c: () => G.stats.weeksPremier >= 260 },
  { id: 'debito130', ico: 'chartdown', n: 'Debito sotto controllo', d: 'Da premier porti il debito sotto il 130%', c: () => isPremier() && G.econ.debito < 130 },
  { id: 'trenta', ico: 'rocket', n: 'Trenta per cento', d: 'Il tuo partito supera il 30%', c: () => myParty().poll >= 30 },
  { id: 'cinqueregioni', ico: 'map', n: 'L’Italia è tua', d: 'Cinque presidenti di Regione del tuo partito', c: () => Object.values(G.regions).filter(r => r.gp === myPid()).length >= 5 },
  { id: 'vicepremier', ico: 'briefcase', n: 'Numero due', d: 'Diventi vicepremier', c: () => G.careerLog.some(x => /Vicepremier/.test(x.t)) },
  { id: 'casacca', ico: 'swap', n: 'Cambio di casacca', d: 'Passi a un altro partito', c: () => G.careerLog.some(x => /^Passi a/.test(x.t)) },
  { id: 'pacchetto', ico: 'gear', n: 'Pacchetto di riforme', d: 'Presenti un pacchetto con «Regola le leggi»', c: () => !!G.flags.pacchetto },
  { id: 'correnti', ico: 'puzzle', n: 'Partito unito', d: 'Tutte le correnti del tuo partito soddisfatte', c: () => !!(G.corr && G.corr.L.length && G.corr.L.every(x => x.sat >= 65)) },
  { id: 'scenario', ico: 'trophy', n: 'Missione compiuta', d: 'Completa uno scenario', c: () => !!(G.scen && G.scen.won) },
];
MORE_ACH.forEach(a => { if (!ACHIEVEMENTS.some(x => x.id === a.id)) ACHIEVEMENTS.push(a); });

// ---------- scenari con obiettivo ----------
const SCENARI = [
  { id: 'recessione', n: 'Il Paese in recessione', d: 'Sei premier mentre l’economia crolla: PIL negativo, disoccupazione alle stelle, spread oltre 240. Obiettivo: in tre anni riportare il PIL sopra l’1% e la disoccupazione sotto il 7,5%, restando a Palazzo Chigi.', weeks: 156, premier: true,
    setup: () => { Object.assign(G.econ, { pil: -0.9, dis: 9.6, spread: 245, deficit: 4.4 }); G.econ.shockSpread += 60; },
    win: () => isPremier() && G.econ.pil >= 1 && G.econ.dis <= 7.5, lose: () => !isPremier(), goal: () => `PIL ${sgn(G.econ.pil)}% (serve +1%) · disoccupazione ${fmt1(G.econ.dis)}% (serve 7,5%)` },
  { id: 'unvoto', n: 'Maggioranza di un voto', d: 'Sei premier, ma alla Camera hai un solo voto di margine. Ogni franco tiratore può farti cadere. Obiettivo: restare a Palazzo Chigi per due anni.', weeks: 104, premier: true, tight: true,
    win: () => isPremier() && G.week - G.scen.start >= 104, lose: () => !isPremier(), goal: () => `Margine alla Camera: ${govSeats('C') - majority('C') >= 0 ? '+' : ''}${govSeats('C') - majority('C')} · ${Math.max(0, 104 - (G.week - G.scen.start))} settimane alla meta` },
  { id: 'outsider', n: 'L’outsider', d: 'Il tuo partito nuovo parte dallo 0,6% e le elezioni sono tra sei mesi. Obiettivo: entrare in Parlamento.', weeks: 40, mode: 'fondatore',
    setup: () => { P('MIO').poll = 0.6; P('MIO').base = 0.6; G.cal.election = G.week + 26; },
    win: () => P(myPid()).seatsC + P(myPid()).seatsS > 0 && G.lastElection, lose: () => !!G.lastElection && P(myPid()).seatsC + P(myPid()).seatsS === 0, goal: () => `${fmt1(myParty().poll)}% (soglia 3%) · elezioni tra ${Math.max(0, G.cal.election - G.week)} settimane` },
  { id: 'scandalo', n: 'Il giorno dopo lo scandalo', d: 'Un’inchiesta ha travolto il tuo partito: sondaggi dimezzati e credibilità a terra. Obiettivo: in un anno tornare ai consensi di prima.', weeks: 52,
    setup: () => { G.scen.target = myParty().poll; myParty().poll *= 0.5; myParty().base *= 0.6; G.cred = 20; G.player.fama = clamp(G.player.fama + 20, 0, 100); },
    win: () => myParty().poll >= G.scen.target, lose: () => false, goal: () => `${fmt1(myParty().poll)}% su ${fmt1(G.scen.target || 0)}% da recuperare` },
];
function scenarioPickHTML() {
  return `<div class="opt ${SETUP.scenario ? 'on' : ''}" onclick="SETUP.showScen=!SETUP.showScen;renderSetup()"><div class="row">${medal('trophy', 52)}<div class="grow"><div class="t">Scenario con obiettivo</div><div class="small muted" style="margin-top:4px">${SETUP.scenario ? `Scelto: <b>${esc(SCENARI.find(s => s.id === SETUP.scenario).n)}</b>` : 'Partite brevi con una situazione di partenza e una missione da compiere.'}</div></div></div></div>
    ${SETUP.showScen ? SCENARI.map(s => `<div class="opt ${SETUP.scenario === s.id ? 'on' : ''}" style="margin-left:14px" onclick="SETUP.scenario=SETUP.scenario==='${s.id}'?null:'${s.id}';${s.mode ? `SETUP.mode='${s.mode}';` : ''}renderSetup()"><div class="t">${esc(s.n)}</div><div class="small muted mt">${esc(s.d)}</div></div>`).join('') : ''}`;
}
function makePremier() {
  const pid = myPid(), p = G.player;
  if (!isLeader()) { p.leader = true; P(pid).leader = p.name; p.rank = 7; }
  const me = P(pid); if (me.seatsC < 90) { const need = 90 - me.seatsC, needS = 45 - me.seatsS; const donors = PIDS().filter(x => x !== pid).sort((a, b) => compat(a, pid) - compat(b, pid)); let n = need, ns = Math.max(0, needS); donors.forEach(d => { const t = Math.min(n, Math.floor(P(d).seatsC * 0.5)), ts = Math.min(ns, Math.floor(P(d).seatsS * 0.5)); P(d).seatsC -= t; P(d).seatsS -= ts; n -= t; ns -= ts; }); me.seatsC = 90 - n; me.seatsS = 45 - ns; }
  const allies = PIDS().filter(x => x !== pid).sort((a, b) => compat(b, pid) - compat(a, pid)); const set = [pid];
  for (const a of allies) { if (hasMajority(set)) break; set.push(a); }
  startPlayerGovernment(set, assignCabinet(set, pid, p.name), []);
  G.cal.election = Math.max(G.cal.election, G.week + 200);
  return set;
}
function applyScenario(id) {
  const S = SCENARI.find(s => s.id === id); if (!S) return;
  G.scen = { id, start: G.week, until: G.week + S.weeks };
  if (S.premier) { const set = makePremier(); if (S.tight) { const opp = PIDS().filter(x => !set.includes(x)).sort((a, b) => seatsOf(b, 'C') - seatsOf(a, 'C'))[0]; let m = govSeats('C') - majority('C'); while (m > 1 && opp) { const gp = set.filter(x => P(x).seatsC > 1).sort((a, b) => P(b).seatsC - P(a).seatsC)[0]; P(gp).seatsC--; P(opp).seatsC++; m--; } } }
  if (S.setup) S.setup();
  addNews(`Scenario: ${S.n}.`, 'mio');
}
function scenarioTick() {
  const sc = G.scen; if (!sc || sc.won || sc.lost) return;
  const S = SCENARI.find(s => s.id === sc.id); if (!S) return;
  if (S.win()) { sc.won = G.week; G.queue.push({ id: 'scenario_fine', ctx: { ok: true } }); }
  else if (S.lose() || G.week >= sc.until) { sc.lost = G.week; G.queue.push({ id: 'scenario_fine', ctx: { ok: false } }); }
}
EVENTS.push({ id: 'scenario_fine', for: 'all', w: 0, chain: true, img: 'trophy', look: 'paper',
  title: c => c.ok ? 'Missione compiuta' : 'Missione fallita',
  text: c => { const S = G.scen && SCENARI.find(s => s.id === G.scen.id); return c.ok ? `Hai completato lo scenario «${S ? S.n : ''}». Puoi continuare a giocare liberamente.` : `Lo scenario «${S ? S.n : ''}» non è riuscito. Puoi comunque continuare la partita.`; },
  choices: c => [{ t: 'Continua', fx: c.ok ? { fama: 5 } : {}, r: c.ok ? 'Un risultato che resterà nella tua carriera.' : 'Ci sarà un’altra occasione.', run: () => { if (c.ok) confetti(); } }] });
EVENT_BY_ID.scenario_fine = EVENTS[EVENTS.length - 1];
function scenarioCardHTML() {
  const sc = G.scen; if (!sc || sc.won || sc.lost) return '';
  const S = SCENARI.find(s => s.id === sc.id); if (!S) return '';
  return `<div class="card hero" style="--pc:#fbbf24"><div class="row between"><b>${icon('trophy', 16)} ${esc(S.n)}</b><span class="tag w">${Math.max(0, sc.until - G.week)} sett.</span></div><div class="small muted mt">${esc(S.goal())}</div></div>`;
}
const _homeTabEp = homeTab;
homeTab = function () { return scenarioCardHTML() + _homeTabEp(); };
const _storyTickEp = storyTick;
storyTick = function () { _storyTickEp(); if (G.flags.retired) return; try { scenarioTick(); } catch (e) { console.error(e); } };

// ---------- azione ----------
ACTIONS.splice(ACTIONS.findIndex(x => x.id === 'riposo') + 1, 0, { id: 'ritiro', n: 'Ritirati dalla politica', ico: 'door', cost: 0, show: () => G.week >= 26, d: 'Chiudi la carriera: lasci tutto a un erede o esci di scena. Il gioco simula i cinque anni dopo e arriva il giudizio degli storici.', custom: () => openRetire() });
ROUTINE_NO.push('ritiro');

// ---------- scene illustrate per i momenti principali ----------
function sceneHTML(k) {
  const win = (x0, y, n, dx, w, h) => Array.from({ length: n }, (_, i) => `<rect x="${x0 + i * dx}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="#f6d98a" opacity="${0.55 + ((i * 37) % 10) / 25}"/>`).join('');
  const sky = '<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2a5c"/><stop offset="1" stop-color="#e59a5b"/></linearGradient></defs><rect width="320" height="130" fill="url(#sk)"/><circle cx="270" cy="34" r="14" fill="#ffe3a3" opacity=".8"/>';
  const flag = (x, y) => `<path d="M${x} ${y}v-26" stroke="#ddd" stroke-width="1.5"/><rect x="${x}" y="${y - 26}" width="6" height="11" fill="#009246"/><rect x="${x + 6}" y="${y - 26}" width="6" height="11" fill="#fff"/><rect x="${x + 12}" y="${y - 26}" width="6" height="11" fill="#ce2b37"/>`;
  const S = {
    quirinale: `${sky}<rect x="20" y="62" width="280" height="68" fill="#e8d3b0"/><rect x="20" y="58" width="280" height="6" fill="#cdb48c"/>${win(32, 72, 13, 21, 9, 14)}${win(32, 98, 13, 21, 9, 16)}<rect x="138" y="30" width="44" height="32" fill="#e8d3b0"/><rect x="136" y="26" width="48" height="6" fill="#cdb48c"/>${win(146, 38, 3, 11, 6, 14)}${flag(160, 26)}<rect x="146" y="106" width="28" height="24" rx="12" fill="#3b2a1a"/>`,
    chigi: `${sky}<rect x="40" y="50" width="240" height="80" fill="#efe1c4"/><rect x="36" y="44" width="248" height="8" fill="#d8c29a"/>${win(52, 60, 11, 20, 9, 16)}${win(52, 88, 11, 20, 9, 16)}<rect x="130" y="80" width="60" height="5" fill="#b89a6a"/><rect x="146" y="104" width="28" height="26" rx="2" fill="#3b2a1a"/>${flag(124, 44)}<path d="M184 44v-26" stroke="#ddd" stroke-width="1.5"/><rect x="184" y="18" width="18" height="11" fill="#003399"/><circle cx="193" cy="23.5" r="3" fill="none" stroke="#ffcc00" stroke-width="1" stroke-dasharray="1 1.2"/>`,
  };
  return `<div class="scene"><svg viewBox="0 0 320 130" preserveAspectRatio="xMidYMid slice">${S[k] || ''}</svg></div>`;
}
