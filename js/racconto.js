// ============================================================
//  RACCONTO: staff, giornalisti, memoria dei leader, telefonate,
//  Consiglio dei ministri, vertici internazionali, tour elettorale, social
// ============================================================
ICON_PATHS.bus = '<rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 11h16M7 20v-3M17 20v-3M8 14h.01M16 14h.01"/>';
ICON_PATHS.chat = '<path d="M4 5h16v11H9l-5 4Z"/><path d="M8 9h8M8 12h5"/>';
ICON_PATHS.heart = '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/>';
ICON_PATHS.repost = '<path d="M4 9V7a2 2 0 0 1 2-2h12l-3-3M20 15v2a2 2 0 0 1-2 2H6l3 3"/>';
ACT_ICON.tour = 'bus';

function ensureStory() {
  if (!G) return;
  G.memory = G.memory || []; G.debt = G.debt || {}; G.forced = G.forced || {}; G.feed = G.feed || []; G.staff = G.staff || {}; G.chains = G.chains || []; G.tour = G.tour || [];
  if (!G.journalists) {
    const my = myParty() ? (myParty().ax.eco + myParty().ax.soc + myParty().ax.imm) / 30 : 0;
    G.journalists = JOURNALISTS_DEF.map(([n, t, k, lean, f]) => ({ n, t, k, lean, f, rel: Math.round(clamp(20 - Math.abs(lean - my) * 45 + rnd(-8, 8), -60, 60)) }));
  }
}

// ---------- GIORNALISTI (nomi inventati, testate vere) ----------
const JOURNALISTS_DEF = [
  ['Marta Ferrante', 'Corriere della Sera', 'carta', 0, 1], ['Luca Benedetti', 'la Repubblica', 'carta', -0.6, 0], ['Giorgio Santangelo', 'Il Giornale', 'carta', 0.7, 0],
  ['Chiara Rinaldi', 'Tg1', 'tv', 0.1, 1], ['Paolo Mancuso', 'Tg La7', 'tv', -0.4, 0], ['Silvia Orlando', 'Sky TG24', 'tv', 0, 1], ['Davide Ferri', 'Il Fatto Quotidiano', 'carta', -0.5, 0],
  ['Elena Gatti', 'Tg4', 'tv', 0.6, 1], ['Roberto Colombo', 'Il Sole 24 Ore', 'carta', 0.2, 0], ['Valeria Neri', 'Il Post', 'web', -0.2, 1],
];
const jPortrait = (j, size) => portrait(j.n, size, { female: !!j.f, ring: j.rel > 20 ? '#34d399' : j.rel < -20 ? '#ff6b6b' : 'rgba(255,255,255,.25)' });
const jLabel = j => j.rel > 30 ? 'amico' : j.rel > 10 ? 'ben disposto' : j.rel > -10 ? 'neutrale' : j.rel > -30 ? 'critico' : 'ostile';
function anchor() { ensureStory(); const tv = G.journalists.filter(j => j.k === 'tv'); return tv[(G.week + tv.length) % tv.length]; }
function journalistFor(lean) { ensureStory(); return G.journalists.slice().sort((a, b) => Math.abs(a.lean - lean) - Math.abs(b.lean - lean))[0]; }
function openJournalists() {
  ensureStory();
  openSheet(`${head('Giornalisti', 'Ti conoscono, ti ricordano e ti fanno domande')}<div class="card tight"><div class="list">${G.journalists.slice().sort((a, b) => b.rel - a.rel).map(j => `<div class="li">${jPortrait(j, 46)}<div class="grow"><div class="row between"><b class="small">${esc(j.n)}</b><span class="tiny" style="color:${relColorHex(j.rel)};font-weight:800">${relNum(j.rel)} · ${jLabel(j)}</span></div><div class="tiny muted">${esc(j.t)} · ${j.lean < -0.3 ? 'progressista' : j.lean > 0.3 ? 'conservatore' : 'indipendente'}</div><div class="meter"><i style="left:${(j.rel + 100) / 2}%"></i></div></div></div>`).join('')}</div></div><div class="tiny muted center">Il rapporto sale con interviste riuscite ed esclusive concesse, scende con smentite, querele e risposte evasive.</div>`);
}

// ---------- MEMORIA DEI LEADER: favori e sgarbi ----------
// d > 0: ti devono un favore · d < 0: lo devi tu · sgarbi: d = 0 ma restano nella memoria
function remember(pid, t, d, kind) {
  ensureStory(); if (!G.parties[pid] || pid === myPid()) return;
  G.memory.push({ pid, w: G.week, t, d: d || 0, kind: kind || (d > 0 ? 'favore' : d < 0 ? 'debito' : 'sgarbo') });
  G.debt[pid] = (G.debt[pid] || 0) + (d || 0);
  if (G.memory.length > 250) G.memory.shift();
}
const memoriesOf = pid => (G.memory || []).filter(m => m.pid === pid).slice(-5).reverse();
function memoryHTML(pid) {
  ensureStory();
  const d = G.debt[pid] || 0, ms = memoriesOf(pid);
  const head = d > 0 ? `<b class="good">Ti ${d > 1 ? `devono ${d} favori` : 'deve un favore'}</b>` : d < 0 ? `<b class="warn">Gli ${-d > 1 ? `devi ${-d} favori` : 'devi un favore'}</b>` : '<b>Nessun conto in sospeso</b>';
  return `<div class="card tight"><div class="small">${head}</div>${ms.length ? `<div class="list mt">${ms.map(m => `<div class="li small"><span class="${m.kind === 'sgarbo' ? 'bad' : m.kind === 'favore' ? 'good' : 'warn'}">${icon(m.kind === 'sgarbo' ? 'x' : m.kind === 'favore' ? 'check' : 'hands', 16)}</span><span class="grow">${esc(m.t)}</span><span class="tiny dim">${fmtDate(m.w, true)}</span></div>`).join('')}</div>` : '<div class="tiny muted mt">Ancora nessun ricordo: voti comuni, favori e promesse resteranno qui.</div>'}</div>`;
}
function memoryAfterVotes(votes) {
  (votes || []).forEach(({ bill, v }) => {
    if (!v || !v.by) return;
    const name = billName(bill), mine = v.by[myPid()];
    // tu hai votato la loro proposta
    if (G.parties[bill.proposer] && bill.proposer !== myPid() && mine && isLeader()) {
      if (mine.vote === 'yes') remember(bill.proposer, `Avete votato la loro proposta «${name}»`, 1);
      else if (mine.vote === 'no' && v.yes - v.no < mine.no + 5 && v.yes - v.no > -mine.no - 5) remember(bill.proposer, `Avete affossato «${name}»`, 0, 'sgarbo');
    }
    // loro hanno votato la tua legge
    if (bill.proposer === 'PLAYER' || (bill.proposer === 'GOV' && isPremier())) {
      Object.keys(v.by).forEach(pid => { if (G.parties[pid] && pid !== myPid() && v.by[pid].vote === 'yes' && !(G.gov && isPremier() && inGov(pid))) remember(pid, `Ha votato la tua legge «${name}»`, -1); });
    }
  });
}

// ---------- STAFF ----------
const STAFF_ROLES = {
  portavoce: { n: 'Portavoce', i: 'mic', d: 'Interviste e conferenze più efficaci, meno gaffe sui social.' },
  gabinetto: { n: 'Capo di gabinetto', i: 'briefcase', d: 'Più capitale politico ogni settimana.' },
  sondaggista: { n: 'Sondaggista', i: 'chart', d: 'Campagne più mirate: il partito cresce un po’ di più ogni settimana.' },
  spin: { n: 'Spin doctor', i: 'eye', d: 'Attutisce scandali e attacchi: meno consenso perso negli imprevisti.' },
};
const STAFF_NAMES = { portavoce: [['Giulia Martini', 1], ['Andrea Fabbri', 0], ['Sara Montanari', 1]], gabinetto: [['Federico Lodi', 0], ['Claudia Ferraris', 1], ['Marco Esposito', 0]], sondaggista: [['Irene Castelli', 1], ['Tommaso Greco', 0], ['Nicola Barbieri', 0]], spin: [['Lorenzo Vitale', 0], ['Beatrice Sala', 1], ['Matteo Cattaneo', 0]] };
const STAFF_TRAIT = ['Bravo ma costoso', 'Giovane e affamato', 'Veterano dei palazzi', 'Fedelissimo', 'Ha lavorato per gli avversari'];
function staffCandidates(role) {
  return STAFF_NAMES[role].map(([n, f], i) => { const liv = [5, 2, 3][i]; return { n, f, liv, costo: liv * 6, trait: STAFF_TRAIT[(hashStr(n) + i) % STAFF_TRAIT.length] }; });
}
const staffLiv = role => (G && G.staff && G.staff[role] ? G.staff[role].liv : 0);
function staffPC() { const l = staffLiv('gabinetto'); return l >= 4 ? 2 : l >= 2 ? 1 : 0; }
function softenFx(fx) {
  const l = staffLiv('spin'); if (!fx || !l) return fx;
  const k = 1 - l * 0.07, o = Object.assign({}, fx);
  if (o.appr < 0) o.appr *= k; if (o.my < 0) o.my *= k;
  return o;
}
function staffHTML() {
  ensureStory();
  return `<div class="staff">${Object.keys(STAFF_ROLES).map(r => { const s = G.staff[r]; return `<button class="stf" onclick="openStaff('${r}')">${s ? portrait(s.n, 52, { female: !!s.f, ring: '#d6b25e' }) : `<span class="stf-e">${icon('plus')}</span>`}<b>${STAFF_ROLES[r].n}</b><span>${s ? '★'.repeat(s.liv) : 'da scegliere'}</span></button>`; }).join('')}</div>`;
}
function openStaff(role) {
  ensureStory();
  const R = STAFF_ROLES[role], cur = G.staff[role];
  let h = `<div class="sheet-head"><div class="row grow">${medal(R.i, 52)}<div class="grow"><h2 style="font-size:22px">${R.n}</h2><div class="tiny muted">${R.d}</div></div></div><button class="xbtn" onclick="closeSheet()">${icon('x', 18)}</button></div>`;
  if (cur) h += `<div class="card hero center">${portrait(cur.n, 72, { female: !!cur.f, ring: '#d6b25e' })}<h3 class="mt">${esc(cur.n)}</h3><div class="small muted">${'★'.repeat(cur.liv)} · ${cur.costo}k€ a settimana · ${esc(cur.trait)}</div><button class="btn red sm mt" onclick="fireStaff('${role}')">Licenzia</button></div>`;
  h += sec(cur ? 'Altri candidati' : 'Candidati');
  staffCandidates(role).filter(c => !cur || c.n !== cur.n).forEach(c => {
    h += `<div class="card tight"><div class="row">${portrait(c.n, 52, { female: !!c.f })}<div class="grow"><b>${esc(c.n)}</b><div class="tiny muted">${'★'.repeat(c.liv)}${'☆'.repeat(5 - c.liv)} · ${c.costo}k€ a settimana</div><div class="tiny gold">${esc(c.trait)}</div></div><button class="btn sm gold" onclick="hireStaff('${role}','${esc(c.n)}')">Assumi</button></div></div>`;
  });
  h += `<div class="tiny muted center mt">Lo stipendio si paga ogni settimana dai fondi del partito. Se i fondi finiscono, lo staff se ne va.</div>`;
  openSheet(h);
}
function hireStaff(role, name) {
  ensureStory();
  const c = staffCandidates(role).find(x => x.n === name); if (!c) return;
  if (G.funds < c.costo * 2) return toast('Fondi insufficienti per assumere', 'bad');
  G.staff[role] = c; addNews(`${G.player.name} sceglie ${c.n} come ${STAFF_ROLES[role].n.toLowerCase()}.`, 'mio');
  closeSheet(); renderGame(); toast(`${c.n} entra nel tuo staff`, 'good');
}
function fireStaff(role) { const s = G.staff[role]; delete G.staff[role]; closeSheet(); renderGame(); toast(`${s ? s.n : 'Il collaboratore'} lascia lo staff`); }
function staffTick() {
  const roles = Object.keys(G.staff || {}); if (!roles.length) return;
  const cost = roles.reduce((s, r) => s + G.staff[r].costo, 0);
  if (G.funds < cost) { const r = roles.sort((a, b) => G.staff[b].costo - G.staff[a].costo)[0]; addNews(`${G.staff[r].n} lascia lo staff: «Stipendi non pagati».`, 'bad'); delete G.staff[r]; return; }
  G.funds -= cost;
  if (isLeader() && staffLiv('sondaggista')) myParty().spinta += 0.04 * staffLiv('sondaggista');
}

// ---------- TELEFONATE (E3) ----------
function callTick() {
  if (G.phase !== 'normale' || !chance(0.38)) return;
  const me = myPid(), cands = [];
  const inAula = b => b.stages[b.stage] && b.stages[b.stage].k === 'aula';
  const myHouse = b => { const h = b.stages[b.stage].h; return (isLeader() && seatsOf(me, h) > 0) || isPremier(); };
  // chiedono il tuo voto
  G.bills.filter(b => !b.dead && G.parties[b.proposer] && b.proposer !== me && inAula(b) && myHouse(b) && !G.myVotes[b.id]).slice(0, 2).forEach(b => cands.push({ kind: 'voto', pid: b.proposer, bill: b.id }));
  // restituiscono un favore
  G.bills.filter(b => !b.dead && (b.proposer === 'PLAYER' || (b.proposer === 'GOV' && isPremier())) && inAula(b) && !predictVote(b).passed).forEach(b => {
    const pid = PIDS().find(p => p !== me && (G.debt[p] || 0) >= 1 && seatsOf(p, b.stages[b.stage].h) > 0 && !(G.forced[b.id] || []).includes(p));
    if (pid) cands.push({ kind: 'restituisco', pid, bill: b.id, w: 3 });
  });
  // alleato scontento
  if (isPremier()) G.gov.parties.forEach(p => { if (p !== me && G.gov.sat[p] < 35) cands.push({ kind: 'scontento', pid: p, w: 2 }); });
  // promesse dei patti non mantenute
  if (isPremier() && G.week - G.gov.start > 26) G.promises.filter(pr => pr.pact && !pr.kept && G.parties[pr.pact] && !G.bills.some(b => !b.dead && b.lawId === pr.lawId)).slice(0, 1).forEach(pr => cands.push({ kind: 'promessa', pid: pr.pact, lawId: pr.lawId, opt: pr.opt, w: 2 }));
  // il Quirinale
  if (isPremier() && (G.groups.quir < -10 || G.gov.decreti.filter(x => G.week - x < 12).length >= 4)) cands.push({ kind: 'quirinale', w: 1.5 });
  // ricordi di uno sgarbo
  const sg = (G.memory || []).filter(m => m.kind === 'sgarbo' && G.week - m.w < 20 && G.week - m.w > 2 && G.parties[m.pid]).pop();
  if (sg && chance(0.5)) cands.push({ kind: 'ricordo', pid: sg.pid, t: sg.t });
  // un giornalista
  if (G.player.fama > 15 && G.journalists) { const j = pick(G.journalists), sc = journalistScenario(j); if (sc) cands.push({ kind: 'giornalista', j: G.journalists.indexOf(j), sc: sc.id, d: sc.d, w: 1.6 }); }
  if (!cands.length) return;
  let tot = cands.reduce((s, c) => s + (c.w || 1), 0), x = Math.random() * tot, c = cands[0];
  for (const k of cands) { x -= (k.w || 1); if (x <= 0) { c = k; break; } }
  G._wk.specials.push({ k: 'call', c });
}
function callView(c) {
  const me = myPid(), b = c.bill !== undefined ? G.bills.find(x => x.id === c.bill) : null;
  const P_ = c.pid ? P(c.pid) : null, fn = P_ ? firstName(P_.leader) : '';
  const you = isPremier() ? 'Presidente' : firstName(G.player.name);
  if (c.kind === 'voto') return { face: leaderPortrait(c.pid, 96), who: P_.leader, sub: P_.name, line: `${you}, la settimana prossima si vota «${billName(b)}». Per noi è una bandiera: ci servono i vostri voti.`, ans: [
    { t: 'Contate su di noi', fx: { rel: { [c.pid]: 4 } }, run: () => { if (isLeader()) G.myVotes[b.id] = 'yes'; if (isPremier()) G.forced[b.id] = (G.forced[b.id] || []).concat(G.gov.parties); remember(c.pid, `Hai promesso il sì su «${billName(b)}»`, 1); }, r: `${fn} ringrazia: «Non lo dimenticheremo».` },
    { t: 'Ne parliamo dopo il voto', fx: {}, r: 'Silenzio imbarazzato dall’altra parte.' },
    { t: 'Non possiamo, mi dispiace', fx: { rel: { [c.pid]: -3 } }, run: () => remember(c.pid, `Hai negato i voti su «${billName(b)}»`, 0, 'sgarbo'), r: `${fn}: «Me lo segno».` }] };
  if (c.kind === 'restituisco') return { face: leaderPortrait(c.pid, 96), who: P_.leader, sub: P_.name, line: `${you}, ti dobbiamo un favore. Sulla tua «${billName(b)}» i nostri voteranno sì.`, ans: [
    { t: 'Grazie, me lo ricorderò', fx: { rel: { [c.pid]: 3 } }, run: () => { G.forced[b.id] = (G.forced[b.id] || []).concat([c.pid]); G.debt[c.pid] = (G.debt[c.pid] || 0) - 1; remember(c.pid, `Ha votato la tua «${billName(b)}» per restituire il favore`, 0, 'favore'); }, r: 'Il conto è saldato: i loro voti arrivano in aula.' },
    { t: 'Non serve, tienitelo per dopo', fx: { rel: { [c.pid]: 2 } }, r: 'Il favore resta da riscuotere.' }] };
  if (c.kind === 'scontento') return { face: leaderPortrait(c.pid, 96), who: P_.leader, sub: `${P_.name} · alleato`, line: `${you}, così non andiamo avanti. I nostri elettori non vedono risultati e i tuoi ci trattano da comparse.`, ans: [
    { t: 'Vertice domani a Palazzo Chigi', fx: { pc: -2, satP: { [c.pid]: 8 } }, r: 'Ci si vede domani: la tensione cala.' },
    { t: 'Vi do un sottosegretario in più', fx: { satP: { [c.pid]: 12 }, appr: -0.4 }, run: () => remember(c.pid, 'Hai concesso un sottosegretario in più', 1), r: `${fn}: «Questo è un segnale».` },
    { t: 'Chi non è d’accordo può uscire', fx: { satP: { [c.pid]: -10 }, rel: { [c.pid]: -6 }, fama: 1 }, run: () => remember(c.pid, 'Ci hai minacciato al telefono', 0, 'sgarbo'), r: 'Riattacca senza salutare.' }] };
  if (c.kind === 'promessa') { const l = getLaw(c.lawId); return { face: leaderPortrait(c.pid, 96), who: P_.leader, sub: `${P_.name} · patto di coalizione`, line: `${you}, avevamo un patto: «${l.opts[c.opt].t}». Quando la porti in Consiglio dei ministri?`, ans: [
    { t: 'La presento questa settimana (⚡3)', fx: { satP: { [c.pid]: 8 } }, run: () => { if (spendPC(3)) proposeBill(c.lawId, c.opt, 'ddl', 'GOV', 'C'); remember(c.pid, `Hai mantenuto la promessa su «${l.opts[c.opt].t}»`, 1); }, r: 'Il disegno di legge parte per il Parlamento.' },
    { t: 'Serve ancora un po’ di tempo', fx: { satP: { [c.pid]: -5 } }, r: '«Il tempo sta finendo.»' },
    { t: 'Non se ne fa più niente', fx: { satP: { [c.pid]: -15 }, rel: { [c.pid]: -10 } }, run: () => { G.promises = G.promises.filter(pr => !(pr.pact === c.pid && pr.lawId === c.lawId)); remember(c.pid, `Hai stracciato il patto su «${l.opts[c.opt].t}»`, 0, 'sgarbo'); }, r: 'Il patto salta. Lo ricorderanno.' }] }; }
  if (c.kind === 'quirinale') return { face: portrait(INSTITUTIONS.pdr, 96, { ring: '#d6b25e' }), who: INSTITUTIONS.pdr, sub: 'Presidente della Repubblica', line: 'Presidente, la ringrazio per la telefonata. Devo dirle con franchezza che vedo troppi decreti-legge e poca attenzione al Parlamento.', ans: [
    { t: 'Ha ragione, userò i disegni di legge', fx: { grp: { quir: 8 } }, r: 'Il Colle apprezza il garbo istituzionale.' },
    { t: 'Sono urgenze vere, Presidente', fx: { grp: { quir: -5 } }, r: 'Una pausa lunga. «Vedremo.»' }] };
  if (c.kind === 'ricordo') return { face: leaderPortrait(c.pid, 96), who: P_.leader, sub: P_.name, line: `Non ho dimenticato: ${c.t.charAt(0).toLowerCase() + c.t.slice(1)}. Volevo che lo sapessi.`, ans: [
    { t: 'Ti chiedo scusa, ho sbagliato', fx: { rel: { [c.pid]: 6 }, fama: -1 }, run: () => remember(c.pid, 'Ti ha chiesto scusa', 0, 'favore'), r: 'Il gelo si scioglie un po’.' },
    { t: 'Era politica, niente di personale', fx: { rel: { [c.pid]: 2 } }, r: '«Per te forse.»' },
    { t: 'Lo rifarei domani', fx: { rel: { [c.pid]: -5 }, my: 0.2 }, run: () => remember(c.pid, 'Ha detto che lo rifarebbe', 0, 'sgarbo'), r: 'Guerra aperta.' }] };
  const j = G.journalists[c.j];
  return journalistCallView(c.kind === 'giornalista' ? c : { sc: c.kind === 'retroscena' ? 'retroscena' : 'esclusiva', d: {} }, j);
}
function openCall(sp) {
  ensureStory();
  const v = callView(sp.c); window._call = { sp, v };
  openSheet(`<div class="call"><div class="ring">${v.face}</div><div class="cn">${esc(v.who)}</div><div class="cs">${esc(v.sub)} · chiamata in arrivo</div>
    <div class="cbtn"><button class="no" onclick="declineCall()">${icon('phone')}<span>Rifiuta</span></button><button class="si" onclick="answerCall()">${icon('phone')}<span>Rispondi</span></button></div></div>`, { locked: true });
  vib(40);
}
function declineCall() {
  const c = window._call.sp.c; if (c.pid) { addRel(c.pid, myPid(), -2); remember(c.pid, 'Non hai risposto al telefono', 0, 'sgarbo'); } else if (c.j !== undefined) G.journalists[c.j].rel -= 3;
  closeSheet(); doneQueue();
}
function answerCall() {
  const { v } = window._call;
  replaceSheet(`<div class="call talk"><div class="row">${v.face.replace(/width:96px;height:96px/, 'width:54px;height:54px')}<div class="grow"><b>${esc(v.who)}</b><div class="tiny muted">${esc(v.sub)} · in linea</div></div><span class="live"><i></i>00:${String(10 + irnd(0, 40)).padStart(2, '0')}</span></div>
    <div class="bub">${esc(v.line)}</div>
    ${v.ans.map((a, i) => `<button class="choice" onclick="pickCall(${i})"><div class="t">${esc(a.t)}</div>${fxChips(a.fx)}</button>`).join('')}</div>`);
}
function pickCall(i) {
  const C = window._call, v = C.v, a = v.ans[i];
  applyFx(a.fx); if (a.run) { try { a.run(); } catch (e) { console.error(e); } }
  if (a.run2) a.run2();
  vib(15);
  // la conversazione resta visibile, battuta dopo battuta
  C.log = (C.log || [{ t: v.line }]).concat([{ me: true, t: a.t }]);
  const talk = () => C.log.map(x => `<div class="bub ${x.me ? 'me' : ''}">${esc(x.t)}</div>`).join('');
  const headRow = `<div class="row">${v.face.replace(/width:96px;height:96px/, 'width:54px;height:54px')}<div class="grow"><b>${esc(v.who)}</b><div class="tiny muted">${esc(v.sub)} · in linea</div></div></div>`;
  if (a.next) {
    C.log.push({ t: a.next.line }); C.v = Object.assign({}, v, { line: a.next.line, ans: a.next.ans });
    replaceSheet(`<div class="call talk">${headRow}${talk()}${a.next.ans.map((x, k) => `<button class="choice" onclick="pickCall(${k})"><div class="t">${esc(x.t)}</div>${fxChips(x.fx)}</button>`).join('')}</div>`);
    return;
  }
  if (a.r) C.log.push({ t: a.r });
  replaceSheet(`<div class="call talk">${headRow}${talk()}${a.head ? `<div class="e-paper mt2"><div class="dt">DOMANI IN EDICOLA</div><div class="hl" style="font-size:19px">${esc(a.head)}</div></div>` : ''}<button class="btn pri block mt2" onclick="closeSheet();doneQueue()">Riattacca</button></div>`);
}

// ---------- CONSIGLIO DEI MINISTRI (ogni 5 settimane) ----------
let CDM = null;
// ogni ministro propone una riforma del suo settore, coerente con le idee del suo partito
function cdmProposals(n) {
  G.flags.rejected = G.flags.rejected || {};
  const busy = new Set(G.bills.filter(b => !b.dead && b.lawId).map(b => b.lawId));
  const red = redMetrics().map(r => r.k), out = [];
  const mins = MINISTRIES.filter(m => m.cats.length && G.gov.ministers[m.id] && G.gov.ministers[m.id] !== G.player.name).sort(() => Math.random() - 0.5);
  for (const m of mins) {
    if (out.length >= n) break;
    const name = G.gov.ministers[m.id], pp = person(name), party = pp && G.parties[pp.party] ? pp.party : G.gov.premierParty;
    let best = null;
    allLaws().filter(l => !l.cost && !l.custom && m.cats.includes(l.cat) && !busy.has(l.id) && !out.some(o => o.lawId === l.id)).forEach(l => {
      const cur = G.laws[l.id];
      l.opts.forEach((o, i) => {
        if (i === cur || G.flags.rejected[l.id + ':' + i] > G.week) return;
        const g = lawGain(party, l, cur, i), maj = G.gov.parties.reduce((t, gp) => t + lawGain(gp, l, cur, i), 0);
        if (g < 0.05 || maj < 0) return;
        const effs = effectsOf(l, cur, i), helps = effs.filter(e => e.good && red.includes(e.k)).length;
        const score = g * l.sal + helps * 0.6 + rnd(0, 0.3);
        if (!best || score > best.score) best = { lawId: l.id, opt: i, score, metric: (effs.find(e => e.good && red.includes(e.k)) || effs.find(e => e.good) || {}).k };
      });
    });
    if (best) out.push(Object.assign(best, { min: m.id, name, party: pp && G.parties[pp.party] ? pp.party : null }));
  }
  return out;
}
function openCdM() {
  if (!isPremier()) { G.queue.shift(); return processQueue(); }
  CDM = { props: cdmProposals(4), res: {}, n: (G.flags.cdmN = (G.flags.cdmN || 0) + 1) };
  if (!CDM.props.length) { CDM = null; G.queue.shift(); addNews('Consiglio dei ministri: nessuna nuova riforma all’ordine del giorno.', 'gov'); return processQueue(); }
  openSheet('', { full: true, locked: true }); renderCdM();
}
function renderCdM() {
  const sh = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null, st = sh ? sh.scrollTop : 0;
  let h = `<div class="center">${medal('building', 64)}<div class="tiny gold mt" style="font-weight:800;letter-spacing:.1em">PALAZZO CHIGI · SALA DEL CONSIGLIO</div><h2 class="mt">Consiglio dei ministri n. ${CDM.n}</h2><div class="small muted">I ministri portano le loro proposte. Decidi tu.</div></div>`;
  CDM.props.forEach((p, i) => {
    const l = getLaw(p.lawId), o = l.opts[p.opt], cur = G.laws[p.lawId], r = CDM.res[i], S = SPIEGA[l.id];
    h += `<div class="card mt ${r ? 'decided' : ''}"><div class="row">${portrait(p.name, 50, { party: p.party || undefined })}<div class="grow"><b class="small">${esc(p.name)}</b><div class="tiny muted">${esc(MIN_BY_ID[p.min].n)}</div></div>${r ? `<span class="stamp-s ${r === 'no' ? 'bad' : r === 'rinvia' ? 'warn' : 'good'}">${{ ddl: 'APPROVATO', dl: 'DECRETO', rinvia: 'RINVIATO', no: 'RESPINTO' }[r]}</span>` : ''}</div>
      <h3 class="mt" style="font-size:17px">${esc(o.t)}</h3><div class="tiny muted">${esc(l.nome)}${p.metric ? ` · migliora ${METRICS[p.metric].n.toLowerCase()}` : ""}</div>
      ${S && S.o[p.opt] ? `<div class="expl mt"><span class="k">In pratica</span>${esc(S.o[p.opt][0])}</div>` : ''}${effChipsHTML(effectsOf(l, cur, p.opt), lawGain(myPid(), l, cur, p.opt))}
      ${r ? '' : `<div class="cdm-b mt"><button class="btn sm gold" onclick="cdmPick(${i},'ddl')">Approva · ⚡3</button><button class="btn sm" onclick="cdmPick(${i},'dl')">Decreto · ⚡5</button><button class="btn sm" onclick="cdmPick(${i},'rinvia')">Rinvia</button><button class="btn sm red" onclick="cdmPick(${i},'no')">Boccia</button></div>`}</div>`;
  });
  const done = CDM.props.every((p, i) => CDM.res[i]);
  h += `<button class="btn ${done ? 'gold' : ''} block mt2" onclick="closeCdM()">${done ? 'Chiudi la seduta' : 'Chiudi: il resto è rinviato'}</button>`;
  replaceSheet(h);
  const s2 = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null; if (s2) s2.scrollTop = st;
}
function cdmPick(i, k) {
  const p = CDM.props[i];
  if (k === 'ddl' || k === 'dl') { const cost = k === 'dl' ? 5 : 3; if (!spendPC(cost)) return toast('Capitale politico insufficiente', 'bad'); if (k === 'dl') G.groups.quir -= 2; proposeBill(p.lawId, p.opt, k, 'GOV', 'C'); if (p.party && G.gov.sat[p.party] !== undefined && p.party !== myPid()) G.gov.sat[p.party] = clamp(G.gov.sat[p.party] + 5, 0, 100); }
  if (k === 'no') { G.flags.rejected[p.lawId + ':' + p.opt] = G.week + 26; if (p.party && G.gov.sat[p.party] !== undefined && p.party !== myPid()) { G.gov.sat[p.party] = clamp(G.gov.sat[p.party] - 4, 0, 100); remember(p.party, `Hai bocciato in Consiglio la proposta di ${p.name}`, 0, 'sgarbo'); } }
  CDM.res[i] = k; vib(15); renderCdM();
}
function closeCdM() {
  const ok = Object.values(CDM.res).filter(r => r === 'ddl' || r === 'dl').length;
  addNews(`Consiglio dei ministri: ${ok ? `approvati ${ok} provvedimenti` : 'nessun provvedimento approvato'}.`, 'gov');
  CDM = null; closeSheet(); doneQueue();
}

// ---------- VERTICI INTERNAZIONALI ----------
const SUMMITS = [
  { k: 'ue', m: 2, d: [19, 27], n: 'Consiglio europeo', at: 'Bruxelles' }, { k: 'g7', m: 5, d: [9, 17], n: 'Vertice G7', at: 'Canada' },
  { k: 'ue', m: 5, d: [23, 30], n: 'Consiglio europeo', at: 'Bruxelles' }, { k: 'nato', m: 6, d: [6, 14], n: 'Vertice NATO', at: 'L’Aia' },
  { k: 'ue', m: 9, d: [19, 27], n: 'Consiglio europeo', at: 'Bruxelles' }, { k: 'ue', m: 11, d: [11, 19], n: 'Consiglio europeo', at: 'Bruxelles' },
];
const DOSSIERS = {
  ue: [
    { t: 'Migranti: chi accoglie?', s: [{ t: 'Pretendere ricollocamenti obbligatori', fx: { grp: { ue: -3 }, appr: 0.5 }, x: 1 }, { t: 'Accordi con i Paesi di partenza', fx: { grp: { ue: 2, chiesa: -3 }, satP: { LEGA: 2 } } }, { t: 'Accettare il compromesso', fx: { grp: { ue: 4 }, appr: -0.3 } }] },
    { t: 'Patto di stabilità', s: [{ t: 'Chiedere di scorporare gli investimenti', fx: { grp: { ue: -2, merc: -2 } }, x: 1, run: () => { if (chance(0.4)) G.econ.flex = (G.econ.flex || 0) + 0.2; } }, { t: 'Rispettare le regole', fx: { grp: { ue: 5, merc: 4 }, appr: -0.5 } }, { t: 'Fronte comune con Francia e Spagna', fx: { pc: -1, grp: { ue: 1 } }, run: () => { G.econ.flex = (G.econ.flex || 0) + 0.1; } }] },
    { t: 'Difesa comune europea', s: [{ t: 'Sì al debito comune per la difesa', fx: { grp: { ue: 4 }, rel: { M5S: -3, AVS: -3 } } }, { t: 'Solo spesa nazionale', fx: { grp: { ue: -1 }, satP: { FDI: 2 } } }, { t: 'Rinviare la decisione', fx: { grp: { ue: -1 } } }] },
    { t: 'Auto: stop ai motori termici nel 2035', s: [{ t: 'Chiedere il rinvio', fx: { grp: { conf: 5, ue: -2 }, mood: { amb: 0.3 } }, x: 1 }, { t: 'Confermare la scadenza', fx: { grp: { ue: 3, conf: -4 } } }, { t: 'Neutralità tecnologica e biocarburanti', fx: { grp: { conf: 3, ue: 1 }, pc: -1 } }] },
    { t: 'Ucraina: nuovo pacchetto di aiuti', s: [{ t: 'Sostegno pieno', fx: { grp: { ue: 3 }, rel: { FN: -4, M5S: -3 } } }, { t: 'Solo aiuti civili', fx: { grp: { ue: -1, chiesa: 3 } } }, { t: 'Spingere per il negoziato', fx: { grp: { chiesa: 4, ue: -2 }, fama: 1 }, x: 1 }] },
    { t: 'Energia: tetto al prezzo del gas', s: [{ t: 'Proporre il tetto', fx: { appr: 0.6, grp: { ue: 1, merc: -1 } } }, { t: 'Acquisti comuni europei', fx: { grp: { ue: 3 } } }, { t: 'Accordi bilaterali con i fornitori', fx: { grp: { conf: 2, ue: -2 } }, x: 1 }] },
  ],
  g7: [
    { t: 'Dazi e commercio con gli USA', s: [{ t: 'Mediare tra Washington e Bruxelles', fx: { fama: 2, grp: { ue: 1, conf: 2 } } }, { t: 'Allinearsi agli USA', fx: { grp: { ue: -3, conf: 1 } }, x: 1 }, { t: 'Difendere l’export italiano', fx: { grp: { conf: 4 }, appr: 0.3 } }] },
    { t: 'Intelligenza artificiale', s: [{ t: 'Regole severe e condivise', fx: { grp: { ue: 2, media: 2 } } }, { t: 'Lasciare correre l’innovazione', fx: { grp: { conf: 3, merc: 2 } } }, { t: 'Tutela del lavoro prima di tutto', fx: { grp: { sind: 4 } } }] },
    { t: 'Rapporti con la Cina', s: [{ t: 'Linea dura con gli alleati', fx: { grp: { merc: 2 }, pil: -0.01 } }, { t: 'Dialogo commerciale', fx: { pil: 0.02, grp: { ue: -2 } }, x: 1 }, { t: 'Posizione europea comune', fx: { grp: { ue: 3 } } }] },
    { t: 'Africa e Piano Mattei', s: [{ t: 'Rilanciare il Piano Mattei', fx: { fama: 3, oneOff: 0.3, grp: { conf: 2 } } }, { t: 'Fondi legati ai rimpatri', fx: { satP: { LEGA: 3 }, grp: { chiesa: -3 } } }, { t: 'Più cooperazione allo sviluppo', fx: { grp: { chiesa: 4 }, oneOff: 0.4 } }] },
  ],
  nato: [
    { t: 'Spesa militare al 3,5% del PIL', s: [{ t: 'Sì, impegno pieno', fx: { grp: { ue: 2 }, oneOff: 1.5, rel: { M5S: -4, AVS: -4 }, appr: -0.5 } }, { t: 'Gradualità fino al 2035', fx: { pc: -1, grp: { ue: 1 } } }, { t: 'No: prima sanità e salari', fx: { appr: 0.4, grp: { ue: -3, merc: -2 } }, x: 1 }] },
    { t: 'Il fianco sud e il Mediterraneo', s: [{ t: 'Chiedere una missione NATO nel Mediterraneo', fx: { fama: 2, grp: { ue: 1 } } }, { t: 'Più navi italiane', fx: { oneOff: 0.4, satP: { FDI: 2 } } }, { t: 'Priorità al fronte est', fx: { grp: { ue: 2 } } }] },
    { t: 'Ucraina nella NATO?', s: [{ t: 'Sostenere l’ingresso', fx: { grp: { ue: 2 }, rel: { FN: -4, LEGA: -2 } } }, { t: 'Prudenza: prima la pace', fx: { grp: { chiesa: 3 } } }, { t: 'Contrari', fx: { grp: { ue: -3 }, rel: { FN: 3 } }, x: 1 }] },
  ],
};
let SUM = null;
function summitTick() {
  const d = dateOf(G.week), y = d.getFullYear(), m = d.getMonth(), day = d.getDate();
  SUMMITS.forEach(s => {
    const key = `summit_${y}_${s.k}_${s.m}`;
    if (m !== s.m || day < s.d[0] || day > s.d[1] || G.flags[key]) return;
    G.flags[key] = true;
    if (isPremier()) G._wk.specials.push({ k: 'vertice', s });
    else addNews(`${s.n} a ${s.at}: per l’Italia c’è ${G.gov ? (G.gov.premier === 'PLAYER' ? G.player.name : G.gov.premier) : 'il governo'}.`, 'info');
  });
}
function openSummit(sp) {
  if (!isPremier()) { G.queue.shift(); return processQueue(); }
  const pool = DOSSIERS[sp.s.k].slice().sort(() => Math.random() - 0.5).slice(0, 3);
  SUM = { s: sp.s, ds: pool, ch: {} };
  openSheet('', { full: true, locked: true }); renderSummit();
}
function renderSummit() {
  const sh = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null, st = sh ? sh.scrollTop : 0;
  const flags = { ue: ['DE', 'FR', 'ES', 'PL', 'NL', 'IT'], g7: ['US', 'DE', 'FR', 'UK', 'JP', 'CA', 'IT'], nato: ['US', 'UK', 'DE', 'FR', 'PL', 'TR', 'IT'] }[SUM.s.k];
  let h = `<div class="center">${medal('globe', 64)}<div class="tiny gold mt" style="font-weight:800;letter-spacing:.1em">${esc(SUM.s.at.toUpperCase())}</div><h2 class="mt">${esc(SUM.s.n)}</h2><div class="sum-flags">${flags.map(f => `<span class="${f === 'IT' ? 'it' : ''}">${f}</span>`).join('')}</div><div class="small muted mt">Tre dossier sul tavolo: scegli la linea dell’Italia.</div></div>`;
  SUM.ds.forEach((d, i) => {
    h += sec(esc(d.t));
    d.s.forEach((s, j) => { h += `<button class="choice ${SUM.ch[i] === j ? 'sel' : ''}" onclick="SUM.ch[${i}]=${j};renderSummit()"><div class="t">${esc(s.t)}</div>${fxChips(s.fx, s.x ? '<span class="c">▼ Scontro con i partner</span>' : '')}</button>`; });
  });
  const done = SUM.ds.every((d, i) => SUM.ch[i] !== undefined);
  h += `<button class="btn gold block mt2" ${done ? '' : 'disabled'} onclick="closeSummit()">${icon('camera')} Foto di gruppo e conclusioni</button>`;
  replaceSheet(h);
  const s2 = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null; if (s2) s2.scrollTop = st;
}
function closeSummit() {
  let clash = 0;
  SUM.ds.forEach((d, i) => { const s = d.s[SUM.ch[i]]; applyFx(s.fx); if (s.run) s.run(); if (s.x) clash++; });
  applyFx({ fama: 2, stress: 3 });
  const ok = clash === 0;
  addNews(`${SUM.s.n}: ${ok ? `${G.player.name} porta a casa un accordo` : `scontro tra ${G.player.name} e i partner su ${clash} dossier`}.`, ok ? 'mio' : 'bad');
  replaceSheet(`<div class="center mt2">${medal('camera', 84)}<h2 class="mt">Foto di gruppo</h2><div class="sum-photo">${['DE', 'FR', 'IT', 'ES', 'US'].map((f, i) => `<span style="--h:${i === 2 ? 64 : 52}px" class="${f === 'IT' ? 'it' : ''}">${f === 'IT' ? portrait(G.player.name, 60, { party: myPid() }) : `<b>${f}</b>`}</span>`).join('')}</div><div class="mt"><span class="stamp ${ok ? 'good' : 'bad'}">${ok ? 'ACCORDO' : 'SCONTRO'}</span></div><p class="muted mt">${ok ? 'I partner apprezzano la linea italiana.' : 'L’Italia difende la sua linea, ma a Bruxelles qualcuno se lo segna.'}</p></div><button class="btn pri block mt2" onclick="SUM=null;closeSheet();doneQueue()">Continua</button>`);
}

// ---------- TOUR ELETTORALE ----------
ACTIONS.splice(ACTIONS.findIndex(a => a.id === 'spot'), 0, { id: 'tour', n: 'Tappa del tour', ico: 'bus', cost: 1, funds: 30, show: () => isLeader() && inCampaign(), d: 'Il pullman della campagna arriva in una regione: piazza, strette di mano e imprevisti dal vivo.', custom: () => pickRegion(r => tourStop(r)) });
const TOUR_EV = [
  { t: 'Piazza piena', x: 'Più gente del previsto: la piazza è stracolma e le telecamere ci sono tutte.', c: [{ t: 'Bagno di folla tra la gente', fx: { fama: 2, stress: 2, my: 0.3 } }, { t: 'Discorso breve e via', fx: { my: 0.1 } }] },
  { t: 'Contestazione', x: 'Un gruppo di contestatori fischia e lancia slogan sotto il palco.', c: [{ t: 'Invitarli a salire e parlare', fx: { fama: 2, my: 0.4, stress: 3 } }, { t: 'Far finta di niente', fx: { my: -0.1 } }, { t: 'Rispondere a tono', fx: { fama: 2, my: -0.2 } }] },
  { t: 'Microfono aperto', x: 'Una battuta detta a microfono acceso finisce sui social.', c: [{ t: 'Scusarsi subito', fx: { cred: 1, my: -0.1 } }, { t: 'Rilanciare con ironia', fx: { fama: 3, my: -0.2 } }] },
  { t: 'Il sindaco chiede aiuto', x: 'Il sindaco ti chiede di impegnarti per lo stabilimento che rischia di chiudere.', c: [{ t: 'Prometti un intervento', fx: { my: 0.3, cred: -1 } }, { t: 'Ascolti e prendi appunti', fx: { cred: 1 } }] },
  { t: 'Selfie virale', x: 'Un selfie con una nonna di 98 anni diventa il video più visto della giornata.', c: [{ t: 'Rilanciarlo sui social', fx: { fama: 3, my: 0.2 } }, { t: 'Lasciarlo girare da solo', fx: { fama: 1 } }] },
];
function tourStop(rid) {
  if (usedThisWeek('tour')) return toast('Il pullman riparte la settimana prossima', 'bad');
  if (G.funds < 30) return toast('Fondi insufficienti', 'bad');
  if (!spendPC(1)) return toast('Capitale politico insufficiente', 'bad');
  ensureStory(); G.funds -= 30; markUsed('tour'); G.tour.push(rid); addPin(rid, 'bus', 'Tappa del tour');
  const r = REGIONS_DEF.find(x => x.id === rid);
  G.myReg[rid] = (G.myReg[rid] || 1) + 0.2; myParty().spinta += 0.25 * Math.sqrt(r.el);
  const ev = pick(TOUR_EV); window._tour = { ev, r };
  addNews(`Il tour di ${myParty().short} arriva in ${r.n}.`, 'mio');
  openSheet(`<div class="evcard"><div class="img">${medal('bus', 76)}</div><div class="kicker">Tour elettorale · tappa ${G.tour.length} · ${esc(r.n)}</div><h2>${esc(ev.t)}</h2><div class="txt">${esc(ev.x)}</div><div class="mt">${ev.c.map((c, i) => `<button class="choice" onclick="tourPick(${i})"><div class="t">${esc(c.t)}</div>${fxChips(c.fx)}</button>`).join('')}</div></div>`, { locked: true });
}
function tourPick(i) { const { ev } = window._tour, c = ev.c[i]; applyFx(c.fx); vib(15); closeSheet(); renderGame(); flyResult('bus', `Tappa: ${window._tour.r.n}`, [{ t: 'Radicamento ▲', g: true }], c.t); }
function tourHTML() {
  ensureStory();
  if (!(isLeader() && inCampaign())) return '';
  const left = G.cal.election - G.week;
  return `<div class="card hero"><div class="row">${medal('bus', 48)}<div class="grow"><b>Tour elettorale</b><div class="tiny muted">${left} settimane al voto · ${G.tour.length} tappe</div></div><button class="btn sm gold" onclick="openAction('tour')">Nuova tappa</button></div>${G.tour.length ? `<div class="row wrap mt" style="gap:4px">${G.tour.map((r, i) => `<span class="tag">${i + 1}. ${esc(regionName(r))}</span>`).join('')}</div>` : ''}</div>`;
}

// ---------- SOCIAL (E5) ----------
const REACT_BAD = ['Solo propaganda, zero fatti.', 'Gli italiani hanno capito benissimo.', 'Ancora annunci. Basta.', 'Imbarazzante.', 'Chiederemo conto in aula.'];
const REACT_GOOD = ['Bene così, avanti insieme.', 'Una scelta giusta.', 'Finalmente qualcuno che ci mette la faccia.', 'Lavoriamo uniti.'];
function feedTick(news) {
  ensureStory();
  G.followers = Math.round(Math.pow(G.player.fama + 5, 1.7) * 140 + partyNoto(myPid()) * 900);
  const mine = (news || []).filter(n => n.k === 'mio').slice(0, 2);
  mine.forEach(n => {
    if (!chance(0.6)) return;
    const friend = chance(0.35), pool = PIDS().filter(p => p !== myPid() && (friend ? rel(p, myPid()) > 20 : rel(p, myPid()) < 10));
    if (!pool.length) return;
    const p = pick(pool);
    G.feed.unshift({ w: G.week, who: p, t: pick(friend ? REACT_GOOD : REACT_BAD), on: n.t, likes: irnd(800, 25000) * (P(p).poll > 10 ? 2 : 1) });
  });
  if (chance(0.5)) { const j = pick(G.journalists); const n = (news || [])[0]; if (n) G.feed.unshift({ w: G.week, who: 'J' + G.journalists.indexOf(j), t: n.t.length > 110 ? n.t.slice(0, 107) + '…' : n.t, likes: irnd(300, 6000) }); }
  G.feed = G.feed.slice(0, 40);
}
function postHTML(f) {
  let face, name, handle;
  if (String(f.who).startsWith('J')) { const j = G.journalists[+f.who.slice(1)]; face = jPortrait(j, 38); name = j.n; handle = j.t; }
  else if (G.parties[f.who]) { face = leaderPortrait(f.who, 38); name = leaderName(f.who); handle = P(f.who).short; }
  else return '';
  return `<div class="post">${face}<div class="grow"><div class="ph"><b>${esc(name)}</b><span>${esc(handle)} · ${G.week - f.w ? `${G.week - f.w} sett.` : 'ora'}</span></div><div class="pt">${f.on ? `«${esc(f.t)}» ` : esc(f.t)}${f.on ? `<span class="pq">${esc(f.on)}</span>` : ''}</div><div class="pr"><span>${icon('heart', 14)} ${fmt0(f.likes)}</span><span>${icon('repost', 14)} ${fmt0(f.likes / 7)}</span></div></div></div>`;
}
function feedHomeHTML() {
  ensureStory();
  const f = G.feed.slice(0, 2); if (!f.length) return '';
  return sec('Sui social', `<button class="btn sm" onclick="openFeed()">Tutti</button>`) + `<div class="card tight">${f.map(postHTML).join('')}</div>`;
}
function openFeed() { ensureStory(); openSheet(`${head('Sui social', `${fmt0(G.followers || 0)} follower · ${G.feed.length} post`)}<div class="card tight">${G.feed.map(postHTML).join('') || '<div class="muted small">Ancora nessun post.</div>'}</div>`); }

// ---------- CATENE DI CONSEGUENZE (X2) ----------
function chainTick() {
  const due = (G.chains || []).filter(c => c.w <= G.week);
  G.chains = (G.chains || []).filter(c => c.w > G.week);
  due.forEach(c => { if (EVENT_BY_ID[c.id] && eventFits(Object.assign({}, EVENT_BY_ID[c.id], { chain: false, cool: 0 }))) G.queue.push({ id: c.id, ctx: c.ctx || {} }); });
}

// ---------- GIRO SETTIMANALE ----------
function storyTick() {
  ensureStory();
  // i voti forzati valgono solo per la votazione in corso
  Object.keys(G.forced).forEach(id => { const b = G.bills.find(x => x.id === +id); if (!b || b.dead || !(b.stages[b.stage] && b.stages[b.stage].k === 'aula')) delete G.forced[id]; });
  fixCoalitions();
  memoryAfterVotes(G._wk.votes);
  staffTick();
  if (typeof sfideTick === "function") sfideTick();
  if (typeof shockTick === "function") shockTick();
  summitTick();
  chainTick();
  callTick();
  feedTick(G._wk.news);
  // Consiglio dei ministri ogni 5 settimane
  if (isPremier() && G.gov && G.phase === 'normale' && (G.week - G.gov.start) % 5 === 4) G._wk.specials.push({ k: 'cdm' });
}

// ---------- FORMATI DEGLI IMPREVISTI (E1-E5) ----------
// paper = prima pagina · tv = edizione straordinaria · call = telefonata · chat = chat del partito · social = post
const EVENT_LOOK = {};
[['paper', 'ilva stellantis dazi energia banca pnrr istat_natalita nomine rai_nomine ita_rotte ryanair_sud pirelli_cina extraprofitti eni_gas leonardo_ue fincantieri_operai pedaggi data_center elettrodomestici banca_ia web_tax auto_cinese scalata_bancaria poste_quota canone_rai ponte_corte superbonus_conto logistica_natale treni_tilt tende_studenti trattori taxi pronto_soccorso opp_inchiesta report_me'],
 ['tv', 'alluvione alluvione_opp flegrei siccita sbarchi sbarchi_opp spread_alto cyber mafia_arresto femminicidio morti_lavoro ucraina medio_oriente sciopero piazza_cgil finals_torino'],
 ['call', 'fuoco_amico cambio_casacca offerta_altro_partito quirinale_monito lealta intercettazione'],
 ['chat', 'corrente_rivale festa_partito proposta_lista tv_sostituto sondaggio_shock salute'],
 ['social', 'opp_tv opp_piazza opp_question_time gov_attacca gov_querela gov_esclusione vannacci_prov virale deepfake papa avviso scandalo_min gaffe']].forEach(([k, ids]) => ids.split(' ').forEach(id => { EVENT_LOOK[id] = k; }));
function eventTopHTML(ev, item, v) {
  ensureStory();
  const c = item.ctx || {}, look = ev.look || EVENT_LOOK[ev.id];
  const title = esc(v.title), text = esc(v.text);
  let face = '';
  if (c.p && G.parties[c.p]) face = leaderPortrait(c.p, 76);
  else if (c.n && person(c.n)) face = portrait(c.n, 76, { party: person(c.n).party });
  if (look === 'paper') return `<div class="e-paper"><div class="m">IL QUOTIDIANO DI ROMA</div><div class="dt">${fmtDate(G.week).toUpperCase()}</div><div class="hl">${title}</div><div class="cols">${text}</div></div>`;
  if (look === 'tv') { const j = anchor(); return `<div class="e-tv"><div class="live"><i></i>IN DIRETTA</div><div class="face">${jPortrait(j, 92)}</div><div class="lt"><span class="a">EDIZIONE STRAORDINARIA</span><div class="b">${title}</div></div></div><div class="tiny muted center mt">In studio ${esc(j.n)} · ${esc(j.t)}</div><div class="txt mt">${text}</div>`; }
  if (look === 'call') {
    const who = c.p && G.parties[c.p] ? leaderName(c.p) : ev.id === 'quirinale_monito' ? INSTITUTIONS.pdr : c.n || (myParty() ? myParty().leader : '');
    const f = face || (ev.id === 'quirinale_monito' ? portrait(INSTITUTIONS.pdr, 76, { ring: '#d6b25e' }) : leaderPortrait(myPid(), 76));
    return `<div class="call mini"><div class="ring">${f}</div><div class="cn">${esc(who)}</div><div class="cs">${icon('phone', 14)} al telefono</div></div><h2>${title}</h2><div class="bub">${text}</div>`;
  }
  if (look === 'chat') {
    const senders = Object.keys(G.staff || {}).map(r => [G.staff[r].n, STAFF_ROLES[r].n]).concat([['Capogruppo', myParty().short], ['Segreteria', myParty().short]]);
    const parts = v.text.split(/(?<=[.!?»])\s+/).filter(Boolean).slice(0, 4);
    return `<div class="e-chat"><div class="chh">${icon('chat', 16)} ${esc(myParty().short)} · direzione <span>${parts.length + 2} online</span></div><div class="msg sys">${title}</div>${parts.map((t, i) => `<div class="msg"><b>${esc(senders[i % senders.length][0])}</b>${esc(t)}</div>`).join('')}</div>`;
  }
  if (look === 'social') {
    const pid = c.p && G.parties[c.p] ? c.p : (oppLeader() ? PIDS().find(p => P(p) === oppLeader()) : null);
    const likes = irnd(2000, 40000);
    return `<div class="kicker">Sui social</div><h2>${title}</h2><div class="post big">${pid ? leaderPortrait(pid, 44) : medal(v.img, 44)}<div class="grow"><div class="ph"><b>${esc(pid ? leaderName(pid) : 'In tendenza')}</b><span>${pid ? esc(P(pid).short) : ''} · ora</span></div><div class="pt">${text}</div><div class="pr"><span>${icon('heart', 14)} <span class="cnt-up" data-to="${likes}">0</span></span><span>${icon('repost', 14)} ${fmt0(likes / 6)}</span></div></div></div>`;
  }
  return `<div class="img">${face || medal(v.img, 84)}</div><h2>${title}</h2><div class="txt">${text}</div>`;
}
function animCounters() { document.querySelectorAll('.cnt-up').forEach(el => { if (!el.dataset.done) { el.dataset.done = 1; countUp(el, +el.dataset.to, false, 1600); } }); }

// ---------- AZIONI RICORRENTI: le fa il gioco ogni settimana ----------
// solo le decisioni enormi non si ripetono da sole
const ROUTINE_NO = ['crisi', 'dimissioni', 'sfiducia', 'anticipate', 'congresso', 'scissione', 'rimpasto'];
const routineOK = a => !ROUTINE_NO.includes(a.id) && (a.run || a.id === 'comizio' || ROUTINE_AUTO[a.id]);
function routineToggleHTML(a) {
  if (!routineOK(a)) return `<div class="tiny muted center mt2">È una decisione importante: non si può ripetere in automatico, la prendi tu ogni volta.</div>`;
  const on = !!(G.routine && G.routine[a.id]);
  return `<div class="card tight mt2"><div class="li click" onclick="toggleRoutine('${a.id}')">${icon('refresh', 20)}<div class="grow"><b class="small">Ripeti ogni settimana</b><div class="tiny muted">Il gioco la fa da solo quando passi alla settimana successiva, se hai capitale e fondi</div></div><span class="tgl ${on ? 'on' : ''}"><i></i></span></div>${on ? routinePickerHTML(a.id) : ''}</div>`;
}
function toggleRoutine(id) {
  G.routine = G.routine || {};
  if (G.routine[id]) delete G.routine[id]; else G.routine[id] = 1;
  vib(8); closeSheet(); openAction(id); renderGame();
}
function runRoutine() {
  const done = [];
  if (!G.routine || G.phase !== 'normale') return done;
  Object.keys(G.routine).forEach(id => {
    const a = ACTIONS.find(x => x.id === id);
    if (!a || usedThisWeek(id)) return;
    let ok = false; try { ok = a.show(); } catch (e) { }
    if (!ok || G.pc < actionCost(a) || G.funds < (a.funds || 0)) return;
    if (ROUTINE_AUTO[id]) { if (!spendPC(actionCost(a))) return; markUsed(id); if (a.funds) G.funds -= a.funds; const t = ROUTINE_AUTO[id](); if (t) done.push({ n: t, ico: ACT_ICON[id] || a.ico }); return; }
    if (id === 'comizio') {
      const reg = REGIONS_DEF.find(x => x.id === routineTarget('comizio')) || REGIONS_DEF.slice().sort((x, y) => (y.el / (G.myReg[y.id] || 1)) - (x.el / (G.myReg[x.id] || 1)))[0];
      doComizioQuiet(reg.id); if (usedThisWeek('comizio')) done.push({ n: `Comizio in ${reg.n}`, ico: 'mega' }); return;
    }
    if (!spendPC(actionCost(a))) return;
    markUsed(id); if (a.funds) G.funds -= a.funds;
    try { a.run(); } catch (e) { console.error(e); }
    done.push({ n: a.n, ico: ACT_ICON[id] || a.ico });
  });
  return done;
}

// ---------- COALIZIONI COERENTI: un partito sta in una sola coalizione ----------
function fixCoalitions() {
  const seen = {}, fragile = m => (G.pacts || []).some(p => p.fragile && p.pid === m);
  // la coalizione del giocatore ha la precedenza
  G.coalitions.slice().sort((a, b) => (b.members.includes(myPid()) ? 1 : 0) - (a.members.includes(myPid()) ? 1 : 0)).forEach(c => {
    c.members = c.members.filter(m => { if (seen[m] || !G.parties[m]) return false; seen[m] = 1; return true; });
    const big = c.members.slice().sort((a, b) => P(b).poll - P(a).poll)[0];
    c.members = c.members.filter(m => m === big || !never(m, big) || fragile(m) || fragile(big));
  });
  G.coalitions = G.coalitions.filter(c => c.members.length > 1 || (c.mine && c.members.length));
}

// ---------- V1: stagioni e crisi nello sfondo ----------
function seasonOf() {
  if (!G) return 'inverno';
  if (G.shock || (isPremier() && G.gov && G.gov.approval < 30) || G.econ.spread > 260) return 'crisi';
  const m = monthOf(G.week);
  return m === 11 ? 'natale' : m <= 1 ? 'inverno' : m <= 4 ? 'primavera' : m <= 7 ? 'estate' : 'autunno';
}
// ---------- V3: icone degli eventi sulla mappa ----------
function addPin(rid, i, t) { if (!rid) return; G.pins = (G.pins || []).filter(p => G.week - p.w < 12).concat([{ rid, i, t, w: G.week }]).slice(-14); }
function mapPinsSVG() {
  const pins = (G.pins || []).filter(p => G.week - p.w < 12);
  Object.entries(G.regions || {}).forEach(([rid, st]) => { const d = st.next - G.week; if (d >= 0 && d <= 8) pins.push({ rid, i: 'vote', t: `Regionali tra ${d} settimane`, w: G.week }); });
  window._pins = pins;
  const used = {};
  return pins.map((p, k) => { const r = REGIONS_DEF.find(x => x.id === p.rid); if (!r) return ''; const n = used[p.rid] = (used[p.rid] || 0) + 1; const x = r.lab[0] + (n - 1) * 15, y = r.lab[1] - 13; return `<g transform="translate(${x} ${y})"><g class="pin" onclick="pinInfo(${k})" style="animation-delay:${k * 0.2}s"><circle r="7.5"/><g transform="translate(-5.2 -5.2) scale(.43)">${ICON_PATHS[p.i] || ICON_PATHS.alert}</g></g></g>`; }).join('');
}
function pinInfo(k) { const p = (window._pins || [])[k]; if (!p) return; toast(`${esc(regionName(p.rid))}: ${esc(p.t)}`); }

// ---------- chi ti fa le domande: dipende da dove vai ----------
function interviewerOf(show) {
  ensureStory();
  if (show.t === 'carta') { const j = G.journalists.find(x => x.t === show.n); return j ? { j, who: `${j.n} (${show.n})` } : { n: `Redazione ${show.n}`, who: `Un giornalista di ${show.n}` }; }
  if (show.t === 'podcast') return { n: `Podcast ${show.n}`, who: `I conduttori di ${show.n}`, plur: true };
  if (show.t === 'live') return { chat: true, who: `La chat della diretta (${show.ch})` };
  return { n: `Studio ${show.n}`, who: `Il conduttore di ${show.n}` };
}
function interviewerFace(iv) {
  const face = iv.chat ? medal('chat', 62) : iv.j ? jPortrait(iv.j, 62) : portrait(iv.n, 62, { ring: 'rgba(255,255,255,.25)' });
  return `<span class="center">${face}<div class="tiny muted" style="margin-top:4px">${esc(iv.chat ? 'chat' : iv.j ? iv.j.n : iv.who.replace(/^(Il conduttore|I conduttori|Un giornalista) di /, ''))}</div></span>`;
}

// ---------- azioni che di solito chiedono una scelta: in automatico sceglie il gioco ----------
const myLean = () => (myParty().ax.eco + myParty().ax.soc + myParty().ax.imm) / 30;
function autoInterview(debate) {
  const pl = myLean();
  const show = debate ? TALKSHOWS[0] : TALKSHOWS.find(s => s.n === routineTarget('tv')) || TALKSHOWS.slice().sort((a, b) => (b.reach - Math.abs(b.lean - pl) * 1.5) - (a.reach - Math.abs(a.lean - pl) * 1.5))[0];
  G.stats.tv = (G.stats.tv || 0) + 1;
  let good = 0;
  interviewTopics(3).forEach(t => { const q = interviewQuestion(t, show); const a = q.answers.slice().sort((x, y) => (y.pre.pro.length - y.pre.contro.length) - (x.pre.pro.length - x.pre.contro.length))[0]; const r = a.apply(show); if (r && r.good) good++; });
  return `${debate ? 'Confronto TV' : 'Intervista'} a ${show.n}: ${good >= 2 ? 'bene' : good ? 'così così' : 'male'}`;
}
const ROUTINE_AUTO = {
  tv: () => autoInterview(false),
  dibattito: () => autoInterview(true),
  incontro: () => {
    const me = myPid(), c = coalitionOf(me);
    const pool = PIDS().filter(p => p !== me && !never(p, me));
    const ally = c ? pool.filter(p => c.members.includes(p)).sort((a, b) => rel(a, me) - rel(b, me))[0] : null;
    const tg = routineTarget('incontro'); const id = (tg && G.parties[tg] ? tg : null) || ally || pool.sort((a, b) => willing(b, me) - willing(a, me))[0]; if (!id) return null;
    const g = Math.round(4 + G.player.car * 0.8 + rnd(-2, 3)); addRel(id, me, g);
    if (isPremier() && G.gov.sat[id] !== undefined) G.gov.sat[id] = clamp(G.gov.sat[id] + 4, 0, 100);
    return `Incontro con ${P(id).leader}`;
  },
  poteri: () => { const gk = GROUPS[routineTarget('poteri')] ? routineTarget('poteri') : Object.keys(GROUPS).sort((a, b) => G.groups[a] - G.groups[b])[0]; G.groups[gk] = clamp(G.groups[gk] + Math.round(6 + G.player.car * 0.6), -100, 100); if (POWER_RIVAL[gk]) G.groups[POWER_RIVAL[gk]] -= 2; return `Incontro con ${GROUPS[gk].n}`; },
  visita: () => { const r = REGIONS_DEF.find(x => x.id === routineTarget('visita')) || REGIONS_DEF.slice().sort((a, b) => (b.el / (G.myReg[b.id] || 1)) - (a.el / (G.myReg[a.id] || 1)))[0]; G.myReg[r.id] = (G.myReg[r.id] || 1) + 0.1; G.gov.popBank += 0.4 + r.el * 0.08; addPin(r.id, 'map', 'Visita istituzionale'); return `Visita in ${r.n}`; },
  tour: () => { const r = REGIONS_DEF.find(x => x.id === routineTarget('tour')) || REGIONS_DEF.filter(x => !(G.tour || []).includes(x.id)).sort((a, b) => b.el - a.el)[0] || pick(REGIONS_DEF); ensureStory(); G.tour.push(r.id); G.myReg[r.id] = (G.myReg[r.id] || 1) + 0.2; myParty().spinta += 0.25 * Math.sqrt(r.el); addPin(r.id, 'bus', 'Tappa del tour'); return `Tappa del tour in ${r.n}`; },
  discorso: () => { const S = SPEECH.nazione; let maj = 0; S.rounds.forEach(rd => { const o = rd.o.slice().sort((a, b) => (b.maj + b.opp) - (a.maj + a.opp))[0]; applyFx(o.fx); maj += o.maj; }); applyFx({ fama: 2 }); return `Discorso alla nazione${maj >= 4 ? ': ovazione' : ''}`; },
};

// ---------- azioni ricorrenti: scegli tu il bersaglio, o lascia decidere il gioco ----------
const routineTarget = id => { const t = G.routine && G.routine[id]; return t && t !== 1 && t !== 'auto' ? t : null; };
const ROUTINE_PICK = {
  incontro: { q: 'Chi incontrare', auto: 'l’alleato con cui il rapporto è più freddo; senza alleati, il partito più vicino a te', opts: () => PIDS().filter(p => p !== myPid()).map(p => [p, `${P(p).short} · ${leaderName(p)}`]) },
  poteri: { q: 'Quale potere', auto: 'quello con cui il rapporto è peggiore', opts: () => Object.keys(GROUPS).map(k => [k, GROUPS[k].n]) },
  comizio: { q: 'In quale regione', auto: 'dove ci sono più elettori e sei meno radicato', opts: () => REGIONS_DEF.map(r => [r.id, r.n]) },
  visita: { q: 'In quale regione', auto: 'dove ci sono più elettori e sei meno radicato', opts: () => REGIONS_DEF.map(r => [r.id, r.n]) },
  tour: { q: 'In quale regione', auto: 'la regione più popolosa non ancora visitata', opts: () => REGIONS_DEF.map(r => [r.id, r.n]) },
  tv: { q: 'In quale programma', auto: 'il più seguito tra quelli vicini alle tue idee', opts: () => TALKSHOWS.map(s => [s.n, `${s.n} · ${s.ch}`]) },
};
function routinePickerHTML(id) {
  const R = ROUTINE_PICK[id]; if (!R) return '';
  const cur = routineTarget(id) || 'auto';
  return `<div class="mt" style="padding:0 2px 4px"><label class="lbl" style="margin-top:0">${R.q}</label><select onchange="setRoutineTarget('${id}', this.value)"><option value="auto" ${cur === 'auto' ? 'selected' : ''}>Scelta automatica</option>${R.opts().map(([v, n]) => `<option value="${esc(v)}" ${cur === v ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select><div class="tiny muted" style="margin-top:6px">${cur === 'auto' ? `In automatico sceglie ${R.auto}.` : 'Ogni settimana andrà sempre qui.'}</div></div>`;
}
function setRoutineTarget(id, v) { G.routine = G.routine || {}; G.routine[id] = v === 'auto' ? 1 : v; vib(6); closeSheet(); openAction(id); }

// ---------- rinominare la propria coalizione ----------
function renameCoalition(cid) {
  const c = G.coalitions.find(x => x.id === cid); if (!c) return;
  openSheet(`${head('Nome della coalizione')}<label class="lbl">Nuovo nome</label><input id="coalname" maxlength="40" value="${esc(c.name)}"><button class="btn gold block mt2" onclick="saveCoalitionName('${cid}')">${icon('check')} Salva</button>`);
}
function saveCoalitionName(cid) {
  const c = G.coalitions.find(x => x.id === cid), v = (document.getElementById('coalname').value || '').trim();
  if (!c || !v) return toast('Scrivi un nome', 'bad');
  addNews(`${c.name} cambia nome: ora si chiama «${v}».`, 'mio'); c.name = v;
  closeSheet(); renderGame(); toast('Nome della coalizione aggiornato', 'good');
}
