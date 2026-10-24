// ============================================================
//  MOTORE DI SIMULAZIONE
// ============================================================

// ---------- utilità ----------
const rnd = (a = 0, b = 1) => a + Math.random() * (b - a);
const irnd = (a, b) => Math.floor(rnd(a, b + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const chance = p => Math.random() < p;
function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const DAY = 86400000;
const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const MESI3 = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
function dateOf(w) { return new Date(START_DATE.getTime() + w * 7 * DAY); }
function weekOf(iso) { const d = new Date(iso + 'T12:00:00'); return Math.round((d - START_DATE) / (7 * DAY)); }
function fmtDate(w, short) { const d = dateOf(w); return short ? `${d.getDate()} ${MESI3[d.getMonth()]} ${d.getFullYear()}` : `${d.getDate()} ${MESI[d.getMonth()]} ${d.getFullYear()}`; }
function yearOf(w) { return dateOf(w).getFullYear(); }
function monthOf(w) { return dateOf(w).getMonth(); }
const key2 = (a, b) => a < b ? a + '-' + b : b + '-' + a;
const fmt1 = v => (Math.round(v * 10) / 10).toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmt0 = v => Math.round(v).toLocaleString('it-IT');
const fmt2 = v => (Math.round(v * 100) / 100).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sgn = v => (v > 0 ? '+' : '') + fmt1(v);
const euro = k => k >= 1000 ? fmt1(k / 1000) + ' mln€' : fmt0(k) + 'k€';

const DIFF = {
  facile:     { n: 'Facile',     partner: 0.7,  market: 0.6, events: 0.8, defect: 0.5, growth: 1.4, accept: -12, pc: 2 },
  media:      { n: 'Media',      partner: 1.0,  market: 1.0, events: 1.0, defect: 1.0, growth: 1.0, accept: 0,   pc: 0 },
  realistica: { n: 'Realistica', partner: 1.25, market: 1.3, events: 1.2, defect: 1.4, growth: 0.8, accept: 8,   pc: -1 },
};

let G = null;
const D = () => DIFF[G.diff];

// ---------- persone ----------
const PEOPLE = PEOPLE_RAW.map(r => ({ name: r[0], party: r[1], comp: r[2], scandal: r[3], pref: r[4] }));
function allPeople() { return PEOPLE.concat(G.myPeople || []); }
function person(name) { return allPeople().find(p => p.name === name) || (G.player && name === G.player.name ? playerAsPerson() : null); }
function playerAsPerson() { const p = G.player; return { name: p.name, party: p.party, comp: p.comp, scandal: Math.max(0, 10 - p.integ), pref: 'SOTT', isPlayer: true }; }
const COGNOMI = ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Martini', 'Leone', 'Longo', 'Gentile', 'Martinelli', 'Vitale', 'Serra', 'Coppola', 'De Santis', "D'Angelo", 'Marchetti', 'Parisi', 'Villa', 'Conte', 'Ferraro', 'Ferri', 'Fabbri', 'Bianco', 'Marini', 'Grasso', 'Valentini', 'Messina'];
const NOMI = ['Marco', 'Giulia', 'Luca', 'Francesca', 'Alessandro', 'Chiara', 'Andrea', 'Sara', 'Matteo', 'Valentina', 'Lorenzo', 'Elena', 'Davide', 'Martina', 'Simone', 'Federica', 'Paolo', 'Silvia', 'Stefano', 'Laura', 'Giovanni', 'Anna', 'Roberto', 'Elisa', 'Riccardo', 'Alessia', 'Fabio', 'Claudia', 'Gabriele', 'Ilaria'];
function randomName() { return pick(NOMI) + ' ' + pick(COGNOMI); }

// ---------- partiti e rapporti ----------
const PIDS = () => Object.keys(G.parties);
const P = id => G.parties[id];
const myPid = () => G.player.party;
const myParty = () => G.parties[G.player.party];
const isLeader = () => !!G.player.leader;
const isPremier = () => G.gov && G.gov.premier === 'PLAYER';
const inGov = pid => !!(G.gov && G.gov.parties.includes(pid));
const myInGov = () => inGov(myPid());
function role() {
  if (isPremier()) return 'premier';
  if (myInGov()) return isLeader() ? 'alleato' : 'maggioranza';
  return isLeader() ? 'opposizione' : 'militante';
}
function roleLabel() {
  const p = G.player, a = p.art === 'la';
  if (isPremier()) return (a ? 'La' : 'Il') + ' Presidente del Consiglio';
  if (p.minister) return (a ? 'Ministra: ' : 'Ministro: ') + MIN_BY_ID[p.minister].n;
  if (isLeader()) return (a ? 'Leader' : 'Leader') + ' di ' + myParty().short + (myInGov() ? ' (maggioranza)' : ' (opposizione)');
  return RANKS[p.rank].n + ' · ' + myParty().short;
}
const MIN_BY_ID = {}; MINISTRIES.forEach(m => { MIN_BY_ID[m.id] = m; });

function axisDist(a, b) {
  let s = 0; AXIS_KEYS.forEach(k => { const d = (a[k] || 0) - (b[k] || 0); s += d * d; });
  return Math.sqrt(s / AXIS_KEYS.length);
}
function compat(a, b) { return clamp(100 - axisDist(P(a).ax, P(b).ax) * 8, 0, 100); }
function never(a, b) { return NEVER.some(([x, y]) => (x === a && y === b) || (x === b && y === a)); }
function rel(a, b) { return G.rel[key2(a, b)] || 0; }
function addRel(a, b, v) { if (a === b || !G.parties[a] || !G.parties[b]) return; const k = key2(a, b); G.rel[k] = clamp((G.rel[k] || 0) + v, -100, 100); }
function willing(a, b) { return compat(a, b) * 0.6 + (rel(a, b) + 50) * 0.4; }
// percentuale di italiani che conosce un partito
function partyNoto(pid) {
  const p = P(pid); if (!p) return 0;
  const seats = p.seatsC + p.seatsS;
  if (pid === 'MIO') return clamp(2 + G.player.fama * 0.7 + G.org * 0.12 + p.poll * 1.3 + seats * 0.05, 1, 99);
  return clamp(38 + p.poll * 3 + seats * 0.08 + (p.lCar || 5) * 2, 30, 99);
}
function leaderName(pid) { return pid === myPid() && isLeader() ? G.player.name : P(pid).leader; }

// ---------- leggi ----------
function getLaw(id) { return LAW_BY_ID[id] || (G.customLaws || []).find(l => l.id === id); }
function allLaws() { return LAWS.concat(G.customLaws || []); }
function curOpt(id) { const l = getLaw(id); return l.opts[G.laws[id]]; }
function prefPos(pid, law) {
  if (law.pp && law.pp[pid] !== undefined && !(pid === myPid() && isLeader() && G.mode === 'fondatore')) return law.pp[pid];
  return P(pid).ax[law.ax] || 0;
}
// quanto un partito guadagna (>0) o perde (<0) passando da un'opzione a un'altra
function lawGain(pid, law, from, to) {
  const pr = prefPos(pid, law);
  return (Math.abs(pr - law.opts[from].pos) - Math.abs(pr - law.opts[to].pos)) / 10;
}
// opzione preferita da un partito
function bestOpt(pid, law) {
  let best = 0, bd = 99; law.opts.forEach((o, i) => { const d = Math.abs(prefPos(pid, law) - o.pos); if (d < bd) { bd = d; best = i; } });
  return best;
}

// ============================================================
//  NUOVA PARTITA
// ============================================================
function newGame(cfg) {
  G = {
    v: 1, week: 0, diff: cfg.diff, mode: cfg.mode, phase: 'normale',
    parties: {}, rel: {}, coalitions: [], laws: {}, customLaws: [], bills: [], billSeq: 1, enacted: [],
    econ: { pil: 0.6, pilT: 0.6, infl: 1.7, dis: 6.0, disBase: 6.0, deficit: 2.9, baseDef: 2.9, debito: 137.6, spread: 85,
      pilNom: 2250, rating: 'BBB+', pde: true, oneOff: 0, shockPil: 0, shockInfl: 0, shockSpread: 0, defHist: {}, flex: 0 },
    budget: { active: [], year: 2026, laws: [] },
    gov: null, player: null, regions: {}, myReg: {}, groups: {}, mood: {}, sal: {},
    news: [], hist: { polls: [], econ: [] }, flags: {}, promises: [], program: null,
    cal: { election: weekOf('2027-05-23'), quirinale: weekOf('2029-01-24'), europee: weekOf('2029-06-10'), legStart: weekOf('2022-10-13') },
    queue: [], evCool: {}, pc: 0, lastElection: null, legislature: 19, referendums: [], consulta: [],
    myPeople: [], primarie: null, pendingVotes: {}, myVotes: {}, myPersonal: {}, usedActs: {}, tipsSeen: {}, careerLog: [], stats: { laws: 0, decreti: 0, fiducie: 0, weeksPremier: 0, govs: 0 },
    org: 5, cred: 50, funds: 0, formation: null, lastSummary: null, seenEvents: {},
  };
  // partiti
  PARTIES_DEF.forEach(d => {
    G.parties[d.id] = { id: d.id, name: d.name, short: d.short, color: d.color, leader: d.leader, lCar: d.lCar, lComp: d.lComp,
      area: d.area, family: d.family, ax: Object.assign({}, d.ax), geo: d.geo, rx: d.rx, poll: d.poll, base: d.poll, base0: d.poll,
      spinta: 0, seatsC: d.seatsC, seatsS: d.seatsS, coal: d.coal, primarie: !!d.primarie, symbol: d.short };
  });
  G.otherSeats = { C: OTHER_SEATS.C, S: OTHER_SEATS.S };
  // giocatore
  const bg = BACKGROUNDS.find(b => b.id === cfg.player.bg);
  G.player = {
    name: cfg.player.name, art: cfg.player.art, age: cfg.player.age, region: cfg.player.region, bg: bg.id,
    car: bg.car, comp: bg.comp, integ: bg.integ, salute: 100, stress: 10, fama: bg.fama,
    rank: 7, leader: true, seguito: 100, rap: 0, parl: null, minister: null, ax: Object.assign({}, cfg.player.ax || {}),
  };
  if (cfg.mode === 'fondatore') {
    const pa = cfg.party;
    G.parties.MIO = { id: 'MIO', name: pa.name, short: pa.short, color: pa.color, symbol: pa.symbol, leader: cfg.player.name, lCar: bg.car, lComp: bg.comp,
      area: 'Il tuo partito', family: '—', ax: Object.assign({}, pa.ax), geo: { NO: 1, NE: 1, CEN: 1, SUD: 1, ISO: 1 }, rx: {},
      poll: 0.6 + bg.fama * 0.05, base: 0.6 + bg.fama * 0.05, base0: 0.8, spinta: 0, seatsC: 0, seatsS: 0, coal: null, mine: true };
    G.player.party = 'MIO';
    G.player.ax = Object.assign({}, pa.ax);
    G.funds = bg.fondi * 20;
    G.org = 5;
    REGIONS_DEF.forEach(r => { G.myReg[r.id] = r.id === cfg.player.region ? 1.8 : 1.0; });
    // dirigenti del tuo partito (nomi modificabili)
    (cfg.party.people || []).forEach(n => G.myPeople.push({ name: n, party: 'MIO', comp: irnd(4, 8), scandal: irnd(1, 5), pref: pick(MINISTRIES).id }));
  } else {
    const pid = cfg.join.party;
    G.player.party = pid;
    G.player.leader = false;
    G.player.rank = cfg.join.rank;
    G.player.seguito = [3, 6, 10, 14][cfg.join.rank] || 5;
    G.player.rap = 20;
    G.player.fama = bg.fama + cfg.join.rank * 6;
    G.player.ax = Object.assign({}, cfg.player.ax && Object.keys(cfg.player.ax).length ? cfg.player.ax : P(pid).ax);
    if (cfg.join.rank >= 3) {
      G.player.parl = chance(0.65) ? 'C' : 'S';
    }
    G.funds = bg.fondi * 5;
    G.org = 40;
    REGIONS_DEF.forEach(r => { G.myReg[r.id] = 1.0; });
    G.myPeople.push(playerAsPerson());
  }
  // rapporti tra partiti
  const ids = PIDS();
  ids.forEach(a => ids.forEach(b => {
    if (a >= b) return;
    let v = (compat(a, b) - 50) * (a === 'MIO' || b === 'MIO' ? 0.4 : 0.8);
    v += REL_TWEAK[a + '-' + b] || REL_TWEAK[b + '-' + a] || 0;
    if (never(a, b)) v -= 25;
    G.rel[key2(a, b)] = clamp(Math.round(v), -90, 90);
  }));
  // coalizioni attuali
  G.coalitions = [
    { id: 'cdx', name: 'Centrodestra', members: ['FDI', 'LEGA', 'FI', 'NM'], cand: 'Giorgia Meloni', candParty: 'FDI', color: '#1f4fa8' },
    { id: 'csx', name: 'Campo largo', members: ['PD', 'M5S', 'AVS', 'IV', 'PE'], cand: null, candParty: null, color: '#e2001a' },
  ];
  if (cfg.mode === 'carriera') { const c = G.coalitions.find(c => c.members.includes(myPid())); if (!c) { /* partito solo */ } }
  // leggi
  LAWS.forEach(l => { G.laws[l.id] = l.cur; });
  // regioni
  REGIONS_DEF.forEach(r => { G.regions[r.id] = { gov: r.gov, gp: r.gp, next: weekOf(r.next), terms: 1, appr: 50 }; });
  // gruppi sociali: rapporto con te
  const ax = G.player.ax;
  G.groups = {
    sind: clamp(-ax.eco * 4, -40, 40), conf: clamp(ax.eco * 3, -30, 30), chiesa: clamp(ax.soc * 3, -30, 30),
    ue: clamp(-ax.eu * 3, -30, 30), merc: clamp(ax.eco * 2 - Math.max(0, ax.eu - 4) * 3, -30, 20), quir: 20, mag: clamp(-ax.giu * 3, -30, 30), media: 0,
  };
  Object.entries(bg.bonus || {}).forEach(([k, v]) => { if (G.groups[k] !== undefined) G.groups[k] = clamp(G.groups[k] + v, -100, 100); });
  // opinione pubblica
  G.mood = { eco: 0, soc: 1.5, eu: 1, imm: 3, amb: 1, giu: 0, terr: -1, ist: 1 };
  G.mood0 = Object.assign({}, G.mood);
  G.sal = { eco: 1.5, soc: 0.6, eu: 0.6, imm: 1.2, amb: 0.6, giu: 0.4, terr: 0.5, ist: 0.3 };
  // governo in carica
  G.gov = {
    premier: 'Giorgia Meloni', premierParty: 'FDI', parties: ['FDI', 'LEGA', 'FI', 'NM'], ministers: Object.assign({}, CURRENT_CABINET),
    vice: CURRENT_VICE.slice(), start: weekOf('2022-10-22'), approval: 41, popBank: 0, sat: { FDI: 75, LEGA: 52, FI: 58, NM: 66 },
    tecnico: false, decreti: [], name: 'Governo Meloni', lowSat: {},
  };
  // manovra 2027 già in Parlamento (governo Meloni): ~23,5 mld lordi, deficit 2027 verso il 3,3-3,4%
  G.bills.push(makeBill({ type: 'manovra', proposer: 'GOV', measures: ['m_statali', 'm_sanita', 'm_difesa', 'm_bollette', 'm_famiglie', 'm_tredic', 'm_ind50', 'c_banche', 'c_spending', 'c_giochi'], year: 2027, startStage: 0, house: 'S', name: 'Legge di bilancio 2027' }));
  // DDL in discussione
  G.bills.push(makeBill({ type: 'ddl', proposer: 'GOV', lawId: 'fine_vita', opt: 2, house: 'S', wait: 10 }));
  G.bills.push(makeBill({ type: 'cost', proposer: 'GOV', lawId: 'premierato', opt: 1, house: 'C', wait: 30 }));
  // capitale politico
  G.pc = pcIncome();
  updateRegionalTotals();
  snapshot();
  addNews('Sei entrato in politica. Il governo Meloni è in carica da quattro anni; le elezioni politiche sono attese per la primavera 2027.', 'info');
  if (cfg.mode === 'fondatore') addNews(`Nasce ${P('MIO').name}: ${G.player.name} presenta simbolo e manifesto.`, 'mio');
  else addNews(`${G.player.name} è ${RANKS[G.player.rank].n.toLowerCase()} di ${P(myPid()).name}.`, 'mio');
  return G;
}

// ============================================================
//  NOTIZIE
// ============================================================
function addNews(t, kind) { G.news.unshift({ w: G.week, t, k: kind || 'info' }); if (G.news.length > 400) G.news.length = 400; if (G._wk) G._wk.news.push({ t, k: kind || 'info' }); }

// ============================================================
//  SEGGI
// ============================================================
function seatsOf(pid, h) { return h === 'C' ? (P(pid) ? P(pid).seatsC : 0) : (P(pid) ? P(pid).seatsS : 0); }
function totalSeats(h) { return PIDS().reduce((s, p) => s + seatsOf(p, h), 0) + G.otherSeats[h]; }
function majority(h) { return Math.floor(totalSeats(h) / 2) + 1; }
function seatsOfSet(set, h) { return set.reduce((s, p) => s + seatsOf(p, h), 0); }
function govSeats(h) { return G.gov ? seatsOfSet(G.gov.parties, h) : 0; }
function hasMajority(set) { return seatsOfSet(set, 'C') >= majority('C') && seatsOfSet(set, 'S') >= majority('S'); }

// ============================================================
//  CAPITALE POLITICO
// ============================================================
function pcIncome() {
  const p = G.player; let v = 3 + Math.floor(p.car / 2) + D().pc;
  if (p.leader) v += 2; if (isPremier()) v += 4; else if (p.minister) v += 2;
  if (p.stress > 80) v -= 2;
  return Math.max(2, v);
}
const pcMax = () => pcIncome() * 2;
function spendPC(n) { if (G.pc < n) return false; G.pc -= n; G.player.stress = clamp(G.player.stress + n * 0.6, 0, 100); return true; }

// ============================================================
//  ECONOMIA
// ============================================================
function lawSum(k) { let s = 0; allLaws().forEach(l => { const o = l.opts[G.laws[l.id]]; if (!o) return; s += k === 'costo' ? (o.costo || 0) : (o.e[k] || 0); }); return s; }
function budgetSum(k, list) { return (list || G.budget.active).reduce((s, id) => { const m = BUDGET_BY_ID[id]; return s + (m ? (k === 'c' ? m.c : (m.e[k] || 0)) : 0); }, 0); }
function computeDeficit() {
  const e = G.econ;
  const cyc = -0.5 * (e.pil - 0.8);
  const intAdj = (e.spread - 90) * 0.002;
  return e.baseDef + (lawSum('costo') + budgetSum('c') + e.oneOff) / e.pilNom * 100 + cyc + intAdj;
}
function econTick() {
  const e = G.econ, d = D();
  // crescita
  e.shockPil *= 0.97; e.shockInfl *= 0.95; e.shockSpread *= 0.9;
  const target = 0.75 + lawSum('pil') + budgetSum('pil') + e.shockPil - Math.max(0, e.spread - 150) * 0.004 + (G.groups.conf || 0) * 0.002;
  e.pil += (target - e.pil) * 0.06 + gauss() * 0.03;
  const inflT = 1.8 + lawSum('infl') + budgetSum('infl') + e.shockInfl;
  e.infl += (inflT - e.infl) * 0.08 + gauss() * 0.03;
  e.disBase += (-0.35 * (e.pil - 0.9)) / 52 + gauss() * 0.01;
  e.disBase = clamp(e.disBase, 3, 20);
  e.dis = e.disBase + lawSum('occ');
  e.deficit = computeDeficit();
  const gNom = e.pil + Math.max(0.5, e.infl);
  e.debito += (e.deficit - e.debito * gNom / 100) / 52 + 0.6 / 52; // 0,6 = aggiustamenti stock-flussi (crediti Superbonus)
  // spread
  let instab = 0;
  if (G.phase === 'formazione') instab += 35;
  if (G.gov && G.gov.parties.some(p => (G.gov.sat[p] || 50) < 20)) instab += 15;
  if (G.week > G.cal.election - 6 && G.week <= G.cal.election) instab += 8;
  const ratingAdj = { 'A-': -15, 'BBB+': 0, 'BBB': 15, 'BBB-': 40, 'BB+': 90 }[e.rating] || 0;
  const sT = 72 + Math.max(0, e.deficit - 3) * 45 + Math.max(0, e.debito - 135) * 1.2 + instab + e.shockSpread + ratingAdj - (G.groups.merc || 0) * (isPremier() ? 0.35 : 0.05) + (e.pde ? 6 : 0);
  e.spread += (sT - e.spread) * 0.15 * d.market + gauss() * 3 * d.market;
  e.spread = clamp(e.spread, 30, 900);
}
function yearRollover(y) {
  const e = G.econ;
  e.defHist[y] = Math.round(e.deficit * 10) / 10;
  e.pilNom *= 1 + (e.pil + e.infl) / 100;
  // le misure annuali scadono: il deficit tendenziale migliora di poco
  e.baseDef = e.baseDef - 0.15 + 0.05;
  e.oneOff = 0;
  G.budget.active = G.budget.next || [];
  G.budget.next = null;
  G.budget.year = y + 1;
  G.player.age += 1;
  addNews(`Capodanno ${y + 1}: il deficit ${y} chiude al ${fmt1(e.defHist[y])}% del PIL, debito al ${fmt1(e.debito)}%.`, 'eco');
}
function ratingReview() {
  const e = G.econ, scale = ['BB+', 'BBB-', 'BBB', 'BBB+', 'A-'];
  let i = scale.indexOf(e.rating); const agency = pick(['S&P', 'Moody’s', 'Fitch', 'DBRS']);
  const prevDebt = G.hist.econ.length > 26 ? G.hist.econ[G.hist.econ.length - 26].debito : e.debito;
  if ((e.deficit > 3.6 && e.debito > prevDebt) || e.spread > 260) { if (i > 0) { i--; e.rating = scale[i]; e.shockSpread += 20; addNews(`${agency} declassa l’Italia a ${e.rating}. Spread sotto pressione.`, 'bad'); if (isPremier()) G.gov.popBank -= 2; return; } }
  if (e.deficit < 3 && e.debito <= prevDebt + 0.2 && e.spread < 110 && i < scale.length - 1 && chance(0.5)) { i++; e.rating = scale[i]; e.shockSpread -= 10; addNews(`${agency} promuove l’Italia: rating a ${e.rating}.`, 'good'); if (isPremier()) { G.gov.popBank += 1.5; G.groups.merc = clamp(G.groups.merc + 8, -100, 100); } return; }
  addNews(`${agency} conferma il rating dell’Italia a ${e.rating}.`, 'eco');
}

// ============================================================
//  CONSENSO DEL GOVERNO
// ============================================================
function approvalTick() {
  const g = G.gov; if (!g) return;
  const e = G.econ;
  g.popBank *= 0.975;
  const hm = Math.max(0, 12 - (G.week - g.start) * 0.4);
  let pc = 6;
  if (g.premier === 'PLAYER') pc = G.player.car; else { const pp = P(g.premierParty); pc = pp ? pp.lCar : 6; }
  const target = 38 + hm + 3 * (e.pil - 0.7) - 1.5 * (e.dis - 6) - 1.2 * Math.max(0, e.infl - 2) - Math.max(0, e.spread - 200) / 25 + g.popBank + (pc - 6) * 1.2 + (g.tecnico ? 6 : 0);
  g.approval += (target - g.approval) * 0.1 + gauss() * 0.4;
  g.approval = clamp(g.approval, 8, 85);
}

// ============================================================
//  SONDAGGI
// ============================================================
function myPotential() {
  const p = G.player;
  if (G.mode === 'fondatore' || myPid() === 'MIO') {
    const v = 0.5 + p.fama * 0.18 * (p.car / 7) * (0.6 + G.org / 250) * (0.7 + G.cred / 330);
    return clamp(v * D().growth, 0.3, 42);
  }
  return null;
}
function moodFx(pid) {
  let s = 0; const ax = P(pid).ax;
  AXIS_KEYS.forEach(k => { s += G.sal[k] * (Math.abs(ax[k] - G.mood0[k]) - Math.abs(ax[k] - G.mood[k])) / 10; });
  return s * 0.5;
}
function pollTick() {
  const ids = PIDS(), g = G.gov;
  const targets = {};
  let sum = 0;
  ids.forEach(id => {
    const p = P(id);
    p.spinta *= 0.92;
    // basi strutturali
    if (id === myPid() && isLeader()) {
      if (id === 'MIO') { const pot = myPotential(); p.base += (pot - p.base) * 0.035; }
      else { const tgt = p.base0 * (0.8 + 0.45 * (G.player.fama / 100) * (G.player.car / 7)) * (0.85 + G.cred / 330); p.base += (tgt - p.base) * 0.02; }
    } else {
      p.base += (p.base0 - p.base) * 0.004 + gauss() * 0.02;
    }
    p.base = Math.max(0.2, p.base);
    let x = 0.55 * Math.tanh(p.spinta / 10) + moodFx(id);
    if (g && g.parties.includes(id)) x += (g.approval - 42) * 0.01 * (id === g.premierParty ? 1.3 : 0.8);
    else if (g) x += (42 - g.approval) * 0.003;
    targets[id] = p.base * Math.exp(clamp(x, -1.5, 1.5));
    sum += targets[id];
  });
  const room = 100 - OTHER_POLL;
  ids.forEach(id => {
    const p = P(id), t = targets[id] / sum * room;
    p.poll += (t - p.poll) * 0.12 + gauss() * Math.min(0.25, 0.04 + p.poll * 0.008);
    p.poll = clamp(p.poll, 0.1, 70);
  });
  // rinormalizza
  const s2 = ids.reduce((s, id) => s + P(id).poll, 0);
  ids.forEach(id => { P(id).poll = P(id).poll / s2 * room; });
}
function snapshot() {
  const polls = {}; PIDS().forEach(id => { polls[id] = Math.round(P(id).poll * 10) / 10; });
  G.hist.polls.push({ w: G.week, p: polls });
  const e = G.econ;
  G.hist.econ.push({ w: G.week, pil: +e.pil.toFixed(2), deficit: +e.deficit.toFixed(2), debito: +e.debito.toFixed(1), spread: Math.round(e.spread), dis: +e.dis.toFixed(1), infl: +e.infl.toFixed(1), appr: G.gov ? Math.round(G.gov.approval) : null });
  if (G.hist.polls.length > 600) { G.hist.polls.shift(); G.hist.econ.shift(); }
}

// ---------- voto regionale ----------
function regMult(pid, rid) {
  const r = REGIONS_DEF.find(x => x.id === rid), p = P(pid);
  if (pid === myPid() && pid === 'MIO') return G.myReg[rid] || 1;
  let m = (p.geo[r.area] || 1) * (p.rx[rid] || 1);
  if (pid === myPid()) m *= 0.85 + 0.15 * (G.myReg[rid] || 1);
  return m;
}
function regionShares(rid) {
  const out = {}; let s = 0;
  PIDS().forEach(id => { out[id] = P(id).poll * regMult(id, rid); s += out[id]; });
  const room = 100 - OTHER_POLL;
  Object.keys(out).forEach(id => { out[id] = out[id] / s * room; });
  return out;
}
function updateRegionalTotals() { /* calcolo al volo nella mappa */ }

// ============================================================
//  PARLAMENTO: DDL, DECRETI, RIFORME COSTITUZIONALI, MANOVRA
// ============================================================
function stagesFor(type, house) {
  const h1 = house || 'C', h2 = h1 === 'C' ? 'S' : 'C';
  if (type === 'ddl') return [{ k: 'comm', h: h1, w: irnd(3, 6) }, { k: 'aula', h: h1 }, { k: 'comm', h: h2, w: irnd(2, 5) }, { k: 'aula', h: h2 }, { k: 'firma', w: 1 }];
  if (type === 'dl') return [{ k: 'comm', h: h1, w: irnd(2, 3) }, { k: 'aula', h: h1 }, { k: 'comm', h: h2, w: irnd(1, 2) }, { k: 'aula', h: h2 }, { k: 'firma', w: 1 }];
  if (type === 'cost') return [{ k: 'comm', h: h1, w: irnd(4, 7) }, { k: 'aula', h: h1, r: 1 }, { k: 'comm', h: h2, w: irnd(4, 6) }, { k: 'aula', h: h2, r: 1 }, { k: 'pausa', w: 13 }, { k: 'aula', h: h1, r: 2 }, { k: 'aula', h: h2, r: 2 }, { k: 'firma', w: 1 }];
  if (type === 'manovra') return [{ k: 'comm', h: 'S', w: 4 }, { k: 'aula', h: 'S' }, { k: 'comm', h: 'C', w: 2 }, { k: 'aula', h: 'C' }, { k: 'firma', w: 0 }];
  return [];
}
function makeBill(o) {
  const b = Object.assign({ id: G.billSeq++, created: G.week, stage: 0, fiducia: false, votes: [], amended: 0, stalled: 0 }, o);
  if (b.type !== 'manovra') b.from = G.laws[b.lawId];
  b.stages = stagesFor(b.type, b.house);
  if (o.startStage) b.stage = o.startStage;
  b.wait = o.wait !== undefined ? o.wait : (b.stages[b.stage].w || 0);
  if (b.type === 'dl') b.deadline = G.week + 9;
  return b;
}
function billName(b) {
  if (b.type === 'manovra') return b.name || ('Legge di bilancio ' + b.year);
  const l = getLaw(b.lawId); return l.opts[b.opt].t;
}
function billTypeName(b) { return { ddl: 'Disegno di legge', dl: 'Decreto-legge', cost: 'Riforma costituzionale', manovra: 'Legge di bilancio' }[b.type]; }
function stageLabel(b) {
  const s = b.stages[b.stage]; if (!s) return 'Concluso';
  const H = { C: 'Camera', S: 'Senato' };
  if (s.k === 'comm') return `In commissione al ${H[s.h]}` + (b.stalled ? ' (ferma)' : '');
  if (s.k === 'aula') return `Voto in aula al ${H[s.h]}` + (s.r ? ` (${s.r}ª lettura)` : '');
  if (s.k === 'pausa') return 'Pausa di 3 mesi tra le due letture';
  if (s.k === 'firma') return 'Alla firma del Quirinale';
  return '';
}
function isGovBill(b) { return b.proposer === 'GOV'; }

// posizione di voto di un partito su un provvedimento: >0 favorevole
function stance(pid, b, h) {
  let gain = 0;
  if (b.type === 'manovra') {
    gain = 0;
    b.measures.forEach(id => { const m = BUDGET_BY_ID[id]; if (!m) return; gain += ((m.e.sind || 0) * -P(pid).ax.eco / 400) + ((m.e.conf || 0) * P(pid).ax.eco / 400); });
  } else {
    const l = getLaw(b.lawId);
    gain = lawGain(pid, l, b.from, b.opt);
  }
  const gov = inGov(pid);
  let s = gain;
  if (isGovBill(b)) {
    if (gov) s += 0.7 + ((G.gov.sat[pid] || 50) - 50) / 120; else s -= 0.45;
  } else {
    // iniziativa parlamentare (di un partito)
    const prop = b.proposer === 'PLAYER' ? myPid() : b.proposer;
    if (pid === prop) s += 1;
    else if (inGov(prop) === gov) s += 0.15; else s -= 0.35;
    if (gov && !inGov(prop)) s -= 0.15;
  }
  if (b.type === 'manovra') s += gov ? 0.4 : -0.6;
  return { s, gain };
}
function computeVote(b, h, opts) {
  opts = opts || {};
  const res = { yes: 0, no: 0, abst: 0, by: {}, total: totalSeats(h) };
  const fid = !!opts.fiducia;
  PIDS().forEach(pid => {
    const n = seatsOf(pid, h); if (!n) return;
    const { s, gain } = stance(pid, b, h);
    let vote;
    if (pid === myPid() && isLeader() && G.myVotes[b.id] && !(fid && inGov(pid))) vote = G.myVotes[b.id];
    else if (fid) vote = inGov(pid) ? ((G.gov.sat[pid] || 50) < 12 && gain < -0.4 ? 'no' : 'yes') : 'no';
    else vote = s > 0.15 ? 'yes' : s < -0.15 ? 'no' : 'abst';
    let y = 0, no = 0, a = 0;
    if (vote === 'yes') {
      const dr = opts.det ? 0 : clamp((0.01 + Math.max(0, -gain) * 0.09) * D().defect * (fid ? 0.3 : 1), 0, 0.4);
      const def = opts.det ? 0 : Math.round(n * dr * rnd(0.3, 1.4));
      y = n - def; no = def;
    } else if (vote === 'no') {
      const dr = opts.det ? 0 : (Math.max(0, gain) * 0.05);
      const def = opts.det ? 0 : Math.round(n * dr * rnd(0, 1.3));
      no = n - def; y = def;
    } else { a = n; }
    res.yes += y; res.no += no; res.abst += a; res.by[pid] = { yes: y, no, abst: a, vote, seats: n };
  });
  // il tuo voto personale (se siedi in questa Camera e voti diversamente dal gruppo)
  const mine = res.by[myPid()], pv = G.myPersonal && G.myPersonal[b.id];
  if (mine && pv && G.player.parl === h && mine.vote !== pv) {
    const take = mine.vote === 'yes' ? 'yes' : mine.vote === 'no' ? 'no' : 'abst';
    const key = { yes: 'yes', no: 'no', abst: 'abst' };
    if (mine[take] > 0) { mine[take]--; res[take]--; mine[key[pv]]++; res[pv]++; mine.me = pv; }
  }
  // altri (autonomie, senatori a vita, misto)
  const o = G.otherSeats[h];
  const oy = Math.round(o * (isGovBill(b) ? 0.45 : 0.2)), on = Math.round(o * 0.25);
  res.yes += oy; res.no += on; res.abst += o - oy - on; res.by.ALT = { yes: oy, no: on, abst: o - oy - on, vote: 'mix', seats: o };
  const stage = b.stages[b.stage] || {};
  if (stage.r === 2) res.passed = res.yes >= majority(h);
  else res.passed = res.yes > res.no;
  res.twoThirds = res.yes >= Math.ceil(res.total * 2 / 3);
  if (b.type !== 'manovra') { const l = getLaw(b.lawId); if (l.q23 && l.q23.includes(b.opt) && stage.k === 'aula') res.passed = res.passed && res.twoThirds; }
  res.fiducia = fid; res.h = h;
  return res;
}
// provvedimenti in aula su cui devi decidere (il voto avviene alla settimana successiva)
function upcomingVotes() {
  return G.bills.filter(b => {
    if (b.dead) return false;
    const s = b.stages[b.stage]; if (!s || s.k !== 'aula' || (b.obstr || 0) > 0) return false;
    if (b.askedAt === b.stage) return false;
    const mine = G.player.parl === s.h || (isLeader() && seatsOf(myPid(), s.h) > 0) || (isPremier() && b.proposer === 'GOV');
    return mine;
  }).map(b => b.id);
}
// linea del partito su un provvedimento: 'yes' | 'no' | 'abst'
function partyLine(b, h) { const s = stance(myPid(), b, h).s; return s > 0.15 ? 'yes' : s < -0.15 ? 'no' : 'abst'; }
function predictVote(b) { const s = b.stages[b.stage]; const h = s && s.h ? s.h : 'C'; return computeVote(b, h, { fiducia: b.fiducia, det: true }); }

function proposeBill(lawId, opt, type, proposer, house) {
  const b = makeBill({ type, proposer, lawId, opt, house: house || 'C' });
  G.bills.push(b);
  const l = getLaw(lawId);
  if (type === 'dl') {
    // il decreto entra subito in vigore
    b.dlFrom = G.laws[lawId];
    applyLawChange(lawId, opt, proposer === 'GOV' ? (isPremier() ? 'player' : 'aigov') : 'parl', true);
    if (G.gov) G.gov.decreti.push(G.week);
    G.stats.decreti += proposer === 'GOV' && isPremier() ? 1 : 0;
    addNews(`Il Consiglio dei ministri approva un decreto-legge: «${l.opts[opt].t}». In vigore da subito, va convertito entro 60 giorni.`, 'gov');
  } else if (type === 'cost') {
    addNews(`Presentata la riforma costituzionale: «${l.opts[opt].t}».`, 'gov');
  } else {
    addNews(`${proposer === 'GOV' ? 'Il governo presenta' : (proposer === 'PLAYER' ? myParty().short + ' presenta' : P(proposer).short + ' presenta')} un disegno di legge: «${l.opts[opt].t}».`, proposer === 'PLAYER' ? 'mio' : 'gov');
  }
  return b;
}

function billsTick() {
  const done = [];
  G.bills.forEach(b => {
    if (b.dead) return;
    const s = b.stages[b.stage];
    if (!s) { b.dead = true; return; }
    // decreto scaduto
    if (b.type === 'dl' && G.week > b.deadline) {
      b.dead = true; revertDecree(b, 'decaduto'); return;
    }
    if (s.k === 'comm') {
      // le proposte dell'opposizione si fermano se la maggioranza non le vuole
      if (!isGovBill(b) && b.type !== 'manovra') {
        const gs = G.gov ? G.gov.parties.reduce((t, p) => t + stance(p, b, s.h).s * seatsOf(p, 'C'), 0) / Math.max(1, govSeats('C')) : 0;
        // quota opposizione: alcune proposte arrivano comunque in aula
        if (gs < 0.05 && !b.quota) {
          if (b.stalled === 2) b.quota = chance(0.45);
          if (!b.quota) { b.stalled++; if (b.stalled > 14) { b.dead = true; addNews(`La proposta «${billName(b)}» resta ferma in commissione e decade.`, 'parl'); } return; }
          addNews(`La proposta «${billName(b)}» va in aula nella quota riservata alle opposizioni.`, 'parl');
        }
      }
      if (b.obstr && b.obstr > 0) { b.obstr--; return; }
      b.wait--; if (b.wait <= 0) nextStage(b);
    } else if (s.k === 'pausa') {
      b.wait--; if (b.wait <= 0) nextStage(b);
    } else if (s.k === 'aula') {
      if (b.obstr && b.obstr > 0) { b.obstr--; return; }
      const v = computeVote(b, s.h, { fiducia: b.fiducia });
      b.votes.push({ w: G.week, h: s.h, yes: v.yes, no: v.no, abst: v.abst, passed: v.passed, fiducia: v.fiducia, r: s.r, twoThirds: v.twoThirds, by: v.by });
      if (G._wk) G._wk.votes.push({ bill: b, v });
      if (v.fiducia) {
        G.stats.fiducie += isPremier() ? 1 : 0;
        if (G.gov) G.gov.parties.forEach(p => { G.gov.sat[p] = clamp((G.gov.sat[p] || 50) - 2 * D().partner, 0, 100); });
        G.groups.quir = clamp(G.groups.quir - (isPremier() ? 1 : 0), -100, 100);
      }
      if (v.passed) {
        if (b.type === 'cost' && s.r === 2 && !v.twoThirds) b.needRef = true;
        nextStage(b);
      } else {
        b.dead = true;
        addNews(`${s.h === 'C' ? 'La Camera' : 'Il Senato'} respinge «${billName(b)}»: ${v.yes} sì, ${v.no} no.`, 'bad');
        if (b.type === 'dl') revertDecree(b, 'respinto');
        if (isGovBill(b) && G.gov) { G.gov.popBank -= 2; if (v.fiducia) openCrisis('fiducia'); }
        if (b.type === 'manovra') G.flags.manovraFail = true;
      }
    } else if (s.k === 'firma') {
      b.wait--; if (b.wait > 0) return;
      // il Quirinale può rinviare alle Camere
      if (b.type !== 'manovra' && !b.rinviata) {
        const l = getLaw(b.lawId), o = l.opts[b.opt];
        const risk = (o.e.corte || 0) * 0.6 + (G.groups.quir < -30 && isGovBill(b) && isPremier() ? 0.15 : 0);
        if (b.type !== 'cost' && chance(risk * 0.5)) {
          b.rinviata = true; b.stage = 1; b.stages[1].h = b.stages[1].h; b.wait = 0;
          addNews(`Il Presidente ${INSTITUTIONS.pdr} rinvia alle Camere «${billName(b)}» con un messaggio motivato: dubbi di costituzionalità.`, 'bad');
          if (isPremier()) { G.gov.popBank -= 1.5; G.groups.quir -= 5; }
          return;
        }
      }
      b.dead = true; b.enacted = true;
      enactBill(b);
    }
  });
  G.bills = G.bills.filter(b => !b.dead || G.week - b.created < 40);
}
function nextStage(b) {
  b.stage++;
  const s = b.stages[b.stage];
  if (!s) return;
  b.wait = s.w || 0;
  if (s.k === 'aula' && b.wait === 0) { /* voto la settimana successiva */ }
  b.fiducia = b.fiduciaAll || false;
}
function enactBill(b) {
  if (b.type === 'manovra') {
    const by = b.proposer === 'GOV' ? (isPremier() ? 'player' : 'aigov') : 'parl';
    G.budget.next = b.measures.slice();
    G.budget.lawsIncluded = b.lawsIncluded || [];
    if (b.lawsIncluded) b.lawsIncluded.forEach(([id, opt]) => applyLawChange(id, opt, by));
    // effetti una tantum su consenso e gruppi
    let pop = 0; b.measures.forEach(id => { const m = BUDGET_BY_ID[id]; pop += m.e.pop || 0; if (by === 'player') Object.keys(GROUPS).forEach(k => { if (m.e[k]) G.groups[k] = clamp(G.groups[k] + m.e[k], -100, 100); }); });
    if (G.gov) G.gov.popBank += pop * 0.6;
    G.flags['manovra' + b.year] = true;
    addNews(`Approvata definitivamente la ${billName(b)}. Entra in vigore il 1° gennaio.`, by === 'player' ? 'good' : 'gov');
    if (by === 'player') { G.stats.laws++; }
    return;
  }
  const l = getLaw(b.lawId);
  if (b.type === 'dl') {
    addNews(`Convertito in legge il decreto «${billName(b)}».`, 'parl');
    if (b.proposer === 'GOV' && isPremier()) G.stats.laws++;
    checkPromise(b.lawId, b.opt);
    return;
  }
  if (b.type === 'cost' && b.needRef) {
    // referendum confermativo
    G.referendums.push({ kind: 'conf', lawId: b.lawId, opt: b.opt, from: b.from, w: G.week + irnd(14, 18), by: b.proposer });
    addNews(`La riforma «${billName(b)}» è approvata senza i 2/3: si va al referendum confermativo.`, 'parl');
    return;
  }
  const by = b.proposer === 'GOV' ? (isPremier() ? 'player' : 'aigov') : (b.proposer === 'PLAYER' ? 'playerparl' : 'parl');
  applyLawChange(b.lawId, b.opt, by);
  addNews(`È legge: «${l.opts[b.opt].t}» (${l.nome}).`, by === 'player' || by === 'playerparl' ? 'good' : 'parl');
  if (by === 'player' || by === 'playerparl') G.stats.laws++;
}
function revertDecree(b, why) {
  if (G.laws[b.lawId] === b.opt) applyLawChange(b.lawId, b.dlFrom, 'revert', true);
  addNews(`Il decreto «${billName(b)}» è ${why}: le norme perdono efficacia.`, 'bad');
  if (isPremier() && b.proposer === 'GOV') { G.gov.popBank -= 2; G.groups.quir -= 3; }
}

// cambia una legge e applica gli effetti
function applyLawChange(id, opt, by, silent) {
  const l = getLaw(id); const from = G.laws[id];
  if (from === opt) return;
  const o0 = l.opts[from], o1 = l.opts[opt];
  G.laws[id] = opt;
  const dPop = ((o1.e.pop || 0) - (o0.e.pop || 0)) * (0.6 + l.sal * 0.25);
  const playerGov = by === 'player';
  if (by !== 'revert' && G.gov && (by === 'player' || by === 'aigov')) G.gov.popBank += dPop;
  // gruppi sociali (si riferiscono al giocatore se è lui a governare o a proporre)
  if (playerGov || by === 'playerparl') {
    Object.keys(GROUPS).forEach(k => { const d = (o1.e[k] || 0) - (o0.e[k] || 0); if (d) G.groups[k] = clamp(G.groups[k] + d * (by === 'playerparl' ? 0.5 : 1), -100, 100); });
    if (o1.e.ue || o0.e.ue) G.econ.shockSpread += -((o1.e.ue || 0) - (o0.e.ue || 0)) * 0.5;
    if (o1.e.merc || o0.e.merc) G.econ.shockSpread += -((o1.e.merc || 0) - (o0.e.merc || 0)) * 1.2;
    myParty().spinta += dPop * 0.4 + (l.sal * 0.3);
  }
  if (by === 'aigov') {
    if (o1.e.merc || o0.e.merc) G.econ.shockSpread += -((o1.e.merc || 0) - (o0.e.merc || 0)) * 1.0;
  }
  // soddisfazione dei partner e dei partiti
  if (G.gov && (by === 'player' || by === 'aigov')) {
    G.gov.parties.forEach(p => { const g = lawGain(p, l, from, opt); G.gov.sat[p] = clamp((G.gov.sat[p] || 50) + g * 6 * l.sal / D().partner, 0, 100); });
  }
  if (by !== 'revert') {
    PIDS().forEach(p => { const g = lawGain(p, l, from, opt); if (Math.abs(g) > 0.3) { if (by === 'player' || by === 'playerparl') addRel(p, myPid(), g * 4); } });
  }
  // debito (privatizzazioni)
  if (l.debt) G.econ.debito += (l.debt[opt] || 0) - (l.debt[from] || 0);
  // Consulta
  if ((o1.e.corte || 0) > 0 && by !== 'revert') G.consulta.push({ lawId: id, opt, from, w: G.week + irnd(12, 45), p: o1.e.corte });
  // legge elettorale
  if (l.sys) G.sys = l.sys[opt];
  // umore dell'opinione pubblica: le leggi spostano poco
  if (by !== 'revert') G.mood[l.ax] += (o1.pos - G.mood[l.ax]) * 0.02;
  G.enacted.unshift({ w: G.week, id, from, to: opt, by });
  checkPromise(id, opt);
  if (!silent) { /* notizia già data dal chiamante */ }
}

// ============================================================
//  PROMESSE E PROGRAMMA
// ============================================================
function checkPromise(id, opt) {
  G.promises.forEach(pr => { if (pr.lawId === id && pr.opt === opt && !pr.kept) { pr.kept = true; pr.keptW = G.week; addNews(`Promessa mantenuta: «${getLaw(id).opts[opt].t}».`, 'good'); G.cred = clamp(G.cred + 4, 0, 100); } });
}
function programAppeal(items) {
  // gradimento del programma presso l'elettorato
  let pop = 0, cost = 0, align = 0;
  items.forEach(([id, opt]) => {
    const l = getLaw(id), o = l.opts[opt];
    pop += (o.e.pop || 0); cost += Math.max(0, o.costo || 0);
    align += (Math.abs(G.mood[l.ax] - l.opts[G.laws[id]].pos) - Math.abs(G.mood[l.ax] - o.pos)) / 10 * l.sal;
  });
  const credPenalty = cost > 25 ? (cost - 25) * 0.15 : 0;
  return { pop, cost, align, score: pop * 0.5 + align * 1.5 - credPenalty, credPenalty };
}

// ============================================================
//  AZIONI DEL GIOCATORE
// ============================================================
function regionName(id) { return REGIONS_DEF.find(r => r.id === id).n; }
function playerTV(show) {
  // esito di un'intervista televisiva
  const p = G.player, mp = myParty();
  const leanParty = (mp.ax.soc + mp.ax.eco + mp.ax.imm) / 30; // -1..1
  const hostile = Math.abs(show.lean - leanParty);
  const skill = p.car + p.comp * 0.4 + rnd(-3, 3) - hostile * 3;
  const good = skill > 6.5;
  const famaG = show.reach * (good ? 2.2 : 1.2) + (hostile > 0.9 && good ? 2 : 0);
  p.fama = clamp(p.fama + famaG, 0, 100);
  mp.spinta += good ? show.reach * 0.8 : -show.reach * 0.5;
  if (isPremier()) G.gov.popBank += good ? 0.8 : -0.8;
  return { good, famaG, text: good ? `Intervista riuscita a ${show.n} (${show.ch}): gli spettatori ti promuovono.` : `Serata difficile a ${show.n}: alcune risposte sono diventate meme sui social.` };
}

// ============================================================
//  CRISI DI GOVERNO E FORMAZIONE
// ============================================================
function openCrisis(reason, who) {
  if (G.phase === 'formazione') return;
  const g = G.gov;
  const txt = { fiducia: 'Il governo è battuto su un voto di fiducia.', uscita: `${who ? P(who).name : 'Un alleato'} esce dalla maggioranza.`, sfiducia: 'Approvata una mozione di sfiducia.', dimissioni: 'Il Presidente del Consiglio rassegna le dimissioni.', spread: 'Tempesta sui mercati: lo spread è fuori controllo.', scandalo: 'Lo scandalo travolge il Presidente del Consiglio.', referendum: 'Dopo la sconfitta al referendum il premier si dimette.' }[reason] || 'Crisi di governo.';
  addNews(`CRISI DI GOVERNO. ${txt} ${g ? g.name : ''} si dimette; il Quirinale avvia le consultazioni.`, 'bad');
  if (g && g.premier === 'PLAYER') G.careerLog.push({ w: G.week, t: `Fine del tuo governo (${txt})` });
  G.prevGov = g;
  if (who && g) g.parties = g.parties.filter(p => p !== who);
  G.phase = 'formazione';
  G.formation = { reason, after: 'crisi', step: 'consultazioni', tries: 0, exclude: who ? [who] : [] };
  G.econ.shockSpread += 15;
}
function endFormation() { G.phase = 'normale'; G.formation = null; }

// combinazioni possibili di maggioranza
function feasibleSets(opts) {
  opts = opts || {};
  const ids = PIDS().filter(id => seatsOf(id, 'C') + seatsOf(id, 'S') > 0 && !(opts.exclude || []).includes(id));
  const res = [];
  const n = ids.length;
  for (let mask = 1; mask < (1 << n); mask++) {
    const set = []; for (let i = 0; i < n; i++) if (mask & (1 << i)) set.push(ids[i]);
    if (set.length > 6) continue;
    if (!hasMajority(set)) continue;
    // minimalità: togliendo il più piccolo non resta maggioranza
    let ok = true, dist = 0;
    for (let i = 0; i < set.length && ok; i++) for (let j = i + 1; j < set.length; j++) {
      const a = set[i], b = set[j];
      if (!opts.tecnico && never(a, b)) { ok = false; break; }
      const c = compat(a, b);
      if (c < (opts.tecnico ? 12 : 30) || rel(a, b) < (opts.tecnico ? -80 : -45)) { ok = false; break; }
      dist += (100 - c) * (seatsOf(a, 'C') + seatsOf(b, 'C')) / 100;
    }
    if (!ok) continue;
    const surplus = set.some(p => hasMajority(set.filter(x => x !== p)) && seatsOf(p, 'C') < 30);
    if (surplus && !opts.tecnico) continue;
    res.push({ set, score: dist + set.length * 12 });
  }
  res.sort((a, b) => a.score - b.score);
  return res;
}
function largestIn(set) { return set.slice().sort((a, b) => seatsOf(b, 'C') - seatsOf(a, 'C'))[0]; }

// assegnazione automatica dei ministeri (governi guidati dall'IA)
function assignCabinet(set, premierParty, premierName, mineChoice) {
  const tot = seatsOfSet(set, 'C') || 1;
  const quota = {}; set.forEach(p => { quota[p] = seatsOf(p, 'C') / tot; });
  const got = {}; set.forEach(p => { got[p] = 0; });
  const totalW = MINISTRIES.reduce((s, m) => s + m.w, 0);
  const used = new Set([premierName]);
  const mins = {};
  const order = MINISTRIES.slice().sort((a, b) => b.w - a.w);
  order.forEach(m => {
    // partito più "in credito"
    let best = null, bv = -99;
    set.forEach(p => { const v = quota[p] - got[p] / totalW + (m.id === 'SOTT' && p === premierParty ? 1 : 0); if (v > bv) { bv = v; best = p; } });
    let cands = allPeople().filter(x => x.party === best && !used.has(x.name));
    if (best === myPid() && G.mode === 'carriera' && !isLeader()) cands = cands.filter(x => !x.isPlayer);
    if (!cands.length) cands = allPeople().filter(x => (x.party === 'TEC' || x.party === 'IND') && !used.has(x.name));
    cands.sort((a, b) => (b.comp + (b.pref === m.id ? 3 : 0) - b.scandal * 0.2) - (a.comp + (a.pref === m.id ? 3 : 0) - a.scandal * 0.2));
    const pick1 = cands[0];
    if (pick1) { mins[m.id] = pick1.name; used.add(pick1.name); got[best] += m.w; }
  });
  return mins;
}
function govName(premierName) { const parts = premierName.split(' '); return 'Governo ' + parts[parts.length - 1]; }
function formAIGovernment(set, premierName, premierParty, tecnico) {
  premierParty = premierParty || largestIn(set);
  const ministers = assignCabinet(set, premierParty, premierName);
  const vice = set.filter(p => p !== premierParty).sort((a, b) => seatsOf(b, 'C') - seatsOf(a, 'C')).slice(0, 2).map(p => P(p).leader).filter(n => n && n !== premierName && Object.values(ministers).includes(n));
  G.gov = { premier: premierName, premierParty, parties: set.slice(), ministers, vice, start: G.week, approval: 48 + (tecnico ? 6 : 0), popBank: 0, sat: {}, tecnico: !!tecnico, decreti: [], name: govName(premierName), lowSat: {} };
  set.forEach(p => { G.gov.sat[p] = 62 + rnd(-8, 8); });
  G.stats.govs++;
  G.player.minister = Object.keys(ministers).find(k => ministers[k] === G.player.name) || null;
  addNews(`Giura al Quirinale il ${G.gov.name}${tecnico ? ' (governo tecnico)' : ''}: maggioranza ${set.map(p => P(p).short).join(', ')}.`, 'gov');
  endFormation();
  G.cal.election = Math.max(G.cal.election, G.week + 10);
}
function startPlayerGovernment(set, ministers, vice) {
  G.gov = { premier: 'PLAYER', premierParty: myPid(), parties: set.slice(), ministers, vice: vice || [], start: G.week, approval: 50, popBank: 0, sat: {}, tecnico: false, decreti: [], name: govName(G.player.name), lowSat: {} };
  // soddisfazione iniziale dei partner in base ai ministeri ricevuti
  const totalW = MINISTRIES.reduce((s, m) => s + m.w, 0), tot = seatsOfSet(set, 'C') || 1;
  set.forEach(p => {
    if (p === myPid()) return;
    const quota = seatsOf(p, 'C') / tot;
    const w = MINISTRIES.reduce((s, m) => s + (person(ministers[m.id]) && person(ministers[m.id]).party === p ? m.w : 0), 0) / totalW;
    const viceB = (vice || []).some(n => person(n) && person(n).party === p) ? 8 : 0;
    G.gov.sat[p] = clamp(55 + (w - quota) * 120 + viceB + rel(p, myPid()) * 0.2, 5, 95);
  });
  G.gov.sat[myPid()] = 90;
  G.player.minister = null;
  G.player.rank = 7;
  G.stats.govs++;
  G.careerLog.push({ w: G.week, t: `Diventi Presidente del Consiglio (${G.gov.name})` });
  addNews(`${G.player.name} giura al Quirinale come ${G.player.art === 'la' ? 'Presidente' : 'Presidente'} del Consiglio dei ministri.`, 'mio');
  endFormation();
}
function premierAcceptance(set) {
  // i partner accettano che sia tu a guidare il governo?
  const mine = seatsOf(myPid(), 'C');
  const res = {};
  set.forEach(p => {
    if (p === myPid()) return;
    let s = willing(p, myPid()) - D().accept;
    const ratio = seatsOf(p, 'C') / Math.max(1, mine);
    if (ratio > 1) s -= (ratio - 1) * 22;
    s += G.player.fama * 0.12;
    res[p] = clamp(Math.round(s), 0, 100);
  });
  return res;
}

// ============================================================
//  ELEZIONI POLITICHE
// ============================================================
function hare(total, weights) {
  const ids = Object.keys(weights).filter(k => weights[k] > 0);
  const sum = ids.reduce((s, k) => s + weights[k], 0);
  const out = {}; if (!sum || total <= 0) { ids.forEach(k => out[k] = 0); return out; }
  let assigned = 0; const rem = [];
  ids.forEach(k => { const q = weights[k] / sum * total; out[k] = Math.floor(q); assigned += out[k]; rem.push([k, q - out[k]]); });
  rem.sort((a, b) => b[1] - a[1]);
  for (let i = 0; assigned < total; i++, assigned++) out[rem[i % rem.length][0]]++;
  return out;
}
function electionUnits(votes) {
  // coalizioni depositate + liste singole
  const units = [];
  const inCoal = new Set();
  G.coalitions.forEach(c => {
    const mem = c.members.filter(m => G.parties[m]);
    if (mem.length < 2) return;
    mem.forEach(m => inCoal.add(m));
    units.push({ id: c.id, name: c.name, members: mem, color: c.color, cand: c.cand, candParty: c.candParty, coal: true });
  });
  PIDS().forEach(id => { if (!inCoal.has(id)) units.push({ id, name: P(id).name, members: [id], color: P(id).color, cand: leaderName(id), candParty: id, coal: false }); });
  units.forEach(u => { u.share = u.members.reduce((s, m) => s + votes[m], 0); });
  return units;
}
function allocate(sys, votes, h) {
  const total = h === 'C' ? 400 - 4 : 200 - 2; // seggi a minoranze/estero minori
  const units = electionUnits(votes);
  const seats = {}; PIDS().forEach(id => seats[id] = 0);
  const thr = sys === 'proporzionale' ? 4 : 3;
  // liste ammesse
  const eligible = {};
  units.forEach(u => {
    if (u.coal) {
      const valid = u.share >= 10 && u.members.some(m => votes[m] >= thr);
      const over = u.members.filter(m => votes[m] >= thr);
      if (valid && sys === 'stabilicum') { const under = u.members.filter(m => votes[m] < thr && votes[m] >= 1).sort((a, b) => votes[b] - votes[a]); if (under[0]) over.push(under[0]); }
      u.elig = over;
    } else u.elig = votes[u.members[0]] >= thr ? [u.members[0]] : [];
    u.ev = u.elig.reduce((s, m) => s + votes[m], 0);
  });
  const valid = units.filter(u => u.ev > 0);
  const distribute = (u, n) => { const w = {}; u.elig.forEach(m => w[m] = votes[m]); const r = hare(n, w); Object.keys(r).forEach(m => seats[m] += r[m]); };
  let premio = null;
  if (sys === 'stabilicum') {
    const bonus = h === 'C' ? 70 : 35, cap = h === 'C' ? 220 : 113;
    const top = valid.slice().sort((a, b) => b.share - a.share)[0];
    if (top && top.share >= 42 && G._premioOK !== false) {
      const evTot = valid.reduce((s, u) => s + u.ev, 0);
      let ws = Math.min(cap, Math.round(top.ev / evTot * (total - bonus)) + bonus);
      distribute(top, ws);
      const rest = {}; valid.filter(u => u !== top).forEach(u => rest[u.id] = u.ev);
      const r = hare(total - ws, rest);
      valid.filter(u => u !== top).forEach(u => distribute(u, r[u.id]));
      premio = top.id;
    } else {
      const w = {}; valid.forEach(u => w[u.id] = u.ev); const r = hare(total, w); valid.forEach(u => distribute(u, r[u.id]));
    }
  } else if (sys === 'proporzionale') {
    const w = {}; valid.forEach(u => w[u.id] = u.ev); const r = hare(total, w); valid.forEach(u => distribute(u, r[u.id]));
  } else {
    // collegi uninominali regione per regione (regola del cubo)
    const uniTot = sys === 'rosatellum' ? Math.round(total * 0.37) : total;
    const elTot = REGIONS_DEF.reduce((s, r) => s + r.el, 0);
    const regSeats = hare(uniTot, Object.fromEntries(REGIONS_DEF.map(r => [r.id, r.el])));
    const uniByUnit = {};
    REGIONS_DEF.forEach(r => {
      const rs = regionShares(r.id);
      const w = {};
      units.forEach(u => { const s = u.members.reduce((t, m) => t + rs[m], 0); let x = Math.pow(s, 3); if (sys === 'doppioturno') x = Math.pow(s, 3.5); w[u.id] = x; });
      const r2 = hare(regSeats[r.id], w);
      Object.keys(r2).forEach(k => uniByUnit[k] = (uniByUnit[k] || 0) + r2[k]);
    });
    units.forEach(u => { const n = uniByUnit[u.id] || 0; if (!n) return; const w = {}; u.members.forEach(m => w[m] = votes[m]); const r = hare(n, w); Object.keys(r).forEach(m => seats[m] += r[m]); });
    if (sys === 'rosatellum') {
      const w = {}; valid.forEach(u => u.elig.forEach(m => w[m] = votes[m]));
      const r = hare(total - uniTot, w); Object.keys(r).forEach(m => seats[m] += r[m]);
    }
  }
  return { seats, premio, units };
}
function runGeneralElection() {
  // voti finali: sondaggi + errore
  const votes = {}; let s = 0;
  PIDS().forEach(id => { votes[id] = Math.max(0.1, P(id).poll + gauss() * (0.35 + P(id).poll * 0.035)); s += votes[id]; });
  const room = 100 - OTHER_POLL + gauss() * 0.4;
  PIDS().forEach(id => { votes[id] = votes[id] / s * room; });
  const votesS = {}; let s2 = 0;
  PIDS().forEach(id => { votesS[id] = Math.max(0.1, votes[id] + gauss() * 0.4); s2 += votesS[id]; });
  PIDS().forEach(id => { votesS[id] = votesS[id] / s2 * room; });
  const sys = G.sys || 'stabilicum';
  // il premio scatta solo se la stessa coalizione supera il 42% in entrambe le Camere
  let rc = allocate(sys, votes, 'C'), rs = allocate(sys, votesS, 'S');
  if (sys === 'stabilicum' && rc.premio !== rs.premio) { G._premioOK = false; rc = allocate(sys, votes, 'C'); rs = allocate(sys, votesS, 'S'); G._premioOK = true; }
  const prev = {}; PIDS().forEach(id => prev[id] = { C: P(id).seatsC, S: P(id).seatsS, poll: P(id).poll });
  PIDS().forEach(id => { P(id).seatsC = rc.seats[id] || 0; P(id).seatsS = rs.seats[id] || 0; P(id).lastVote = votes[id]; });
  G.otherSeats = { C: 4, S: 2 + 5 };
  const turnout = clamp(58 + gauss() * 2 + (G.flags.hotCampaign ? 2 : 0), 48, 70);
  const regional = {}; REGIONS_DEF.forEach(r => { regional[r.id] = regionShares(r.id); });
  G.lastElection = { w: G.week, votes, votesS, seatsC: rc.seats, seatsS: rs.seats, premio: rc.premio, units: rc.units.map(u => ({ id: u.id, name: u.name, members: u.members, share: u.share, color: u.color, cand: u.cand, candParty: u.candParty, coal: u.coal })), turnout, sys, prev, regional, legislature: G.legislature + 1 };
  G.legislature++;
  G.cal.legStart = G.week;
  G.cal.election = G.week + 260;
  // il giocatore: eletto?
  personalElection(votes);
  G.careerLog.push({ w: G.week, t: `Elezioni politiche: ${myParty().short} al ${fmt1(votes[myPid()] || 0)}%` });
  addNews(`Elezioni politiche: affluenza al ${fmt1(turnout)}%. ${myParty().short} prende il ${fmt1(votes[myPid()])}%.`, 'mio');
  G.phase = 'formazione';
  G.formation = { reason: 'elezioni', after: 'elezioni', step: 'risultati', tries: 0, exclude: [] };
  G.prevGov = G.gov;
  // promesse: la credibilità si misura alle urne
  return G.lastElection;
}
function personalElection(votes) {
  const p = G.player;
  if (p.leader) { if (seatsOf(myPid(), 'C') > 0) p.parl = 'C'; else if (seatsOf(myPid(), 'S') > 0) p.parl = 'S'; else p.parl = null; return; }
  if (!p.candidate) { if (p.rank === 3) { p.rank = 2; p.parl = null; addNews('Non sei stato ricandidato: torni all’attività sul territorio.', 'bad'); } return; }
  const seats = seatsOf(myPid(), 'C') + seatsOf(myPid(), 'S');
  const regS = regionShares(p.region)[myPid()];
  const prob = p.candidate === 'capolista' ? (seats > 4 ? 0.95 : 0.4) : clamp(0.05 + p.fama / 120 + regS / 60 + seats / 400 - 0.15, 0.03, 0.9);
  if (chance(prob)) {
    p.parl = chance(0.66) ? 'C' : 'S'; p.rank = Math.max(p.rank, 3);
    addNews(`${p.name} è ${p.art === 'la' ? 'eletta' : 'eletto'} ${p.parl === 'C' ? 'alla Camera' : 'al Senato'} con ${p.candidate === 'capolista' ? 'il posto da capolista' : fmt0(2000 + p.fama * 600 + rnd(0, 8000)) + ' preferenze'}!`, 'good');
    G.careerLog.push({ w: G.week, t: `Eletto in Parlamento (${p.parl === 'C' ? 'Camera' : 'Senato'})` });
  } else {
    if (p.rank === 3) p.rank = 2;
    p.parl = null;
    addNews(`${p.name} non ce la fa: le preferenze non bastano per entrare in Parlamento.`, 'bad');
  }
  p.candidate = null;
}

// ============================================================
//  ELEZIONI REGIONALI
// ============================================================
function regionalElection(rid) {
  const r = REGIONS_DEF.find(x => x.id === rid), st = G.regions[rid];
  const rs = regionShares(rid);
  const blocks = {};
  const coalOf = pid => { const c = G.coalitions.find(c => c.members.includes(pid)); return c ? c.id : pid; };
  PIDS().forEach(id => { const c = coalOf(id); blocks[c] = (blocks[c] || 0) + rs[id]; });
  // vantaggio dell'uscente
  const incC = GOV_PARTY_COAL[st.gp] || coalOf(st.gp);
  if (blocks[incC] !== undefined) blocks[incC] += 3;
  if (rid === 'VDA' || rid === 'TAA') { blocks.aut = (blocks.aut || 0) + 30; }
  Object.keys(blocks).forEach(k => blocks[k] += gauss() * 2.5);
  const winner = Object.keys(blocks).sort((a, b) => blocks[b] - blocks[a])[0];
  const total = Object.values(blocks).reduce((s, v) => s + Math.max(0, v), 0);
  const pct = blocks[winner] / total * 100;
  let gp, gov;
  if (winner === 'aut') { gp = 'AUT'; gov = st.gov; }
  else {
    const coal = G.coalitions.find(c => c.id === winner);
    const mem = coal ? coal.members : [winner];
    gp = mem.slice().sort((a, b) => rs[b] - rs[a])[0];
    if ((GOV_PARTY_COAL[st.gp] || coalOf(st.gp)) === winner && st.terms < 2) { gov = st.gov; st.terms++; gp = st.gp; }
    else {
      st.terms = 1;
      const pool = allPeople().filter(x => x.party === gp && !Object.values(G.gov ? G.gov.ministers : {}).includes(x.name) && x.name !== P(gp).leader && !Object.values(G.regions).some(q => q.gov === x.name));
      gov = gp === myPid() && G.flags['candReg_' + rid] ? G.flags['candReg_' + rid] : (pool.length ? pick(pool).name : randomName());
      if (gp === myPid() && G.player.region === rid && !isLeader() && G.player.rank <= 2 && G.flags['candReg_' + rid] === G.player.name) { G.player.rank = 6; }
    }
  }
  const changed = gp !== st.gp;
  st.gp = gp; st.gov = gov; st.next = G.week + 260;
  const wname = winner === 'aut' ? 'autonomisti' : (G.coalitions.find(c => c.id === winner) || { name: P(winner) ? P(winner).name : winner }).name;
  addNews(`Regionali in ${r.n}: vince ${gov} (${wname}) con il ${fmt1(pct)}%.${changed ? ' Cambio di colore!' : ''}`, changed ? 'mio' : 'parl');
  // effetto nazionale (spinta ai vincitori)
  PIDS().forEach(id => { if (coalOf(id) === winner) P(id).spinta += r.el * 0.3; });
  if (G.gov && G.gov.parties.some(p => coalOf(p) === winner)) G.gov.popBank += 0.5; else if (G.gov) G.gov.popBank -= 0.8;
  // carriera: consigliere regionale
  if (!isLeader() && G.player.region === rid && G.player.rank === 1 && G.player.candReg) {
    const ok = chance(clamp(0.25 + G.player.fama / 100 + (rs[myPid()] / 50), 0.1, 0.9));
    if (ok) { G.player.rank = 2; addNews(`${G.player.name} è ${G.player.art === 'la' ? 'eletta' : 'eletto'} in Consiglio regionale!`, 'good'); G.careerLog.push({ w: G.week, t: 'Eletto consigliere regionale' }); }
    else addNews(`${G.player.name} manca l’elezione in Consiglio regionale.`, 'bad');
    G.player.candReg = false;
  }
  return { rid, gov, gp, pct, changed, winner: wname };
}

// ============================================================
//  REFERENDUM
// ============================================================
function runReferendum(rf) {
  const l = getLaw(rf.lawId);
  if (rf.kind === 'conf') {
    // confermativo: niente quorum
    const premierOwn = rf.by === 'GOV' && isPremier();
    let yes = 50 + ((G.gov ? G.gov.approval : 45) - 45) * 0.6 + (l.opts[rf.opt].e.pop || 0) * 2.5 + gauss() * 5 - 2;
    yes = clamp(yes, 20, 80);
    const turnout = clamp(48 + gauss() * 6 + (premierOwn && G.flags.personalizza ? 6 : 0), 30, 75);
    const won = yes > 50;
    if (won) { applyLawChange(rf.lawId, rf.opt, rf.by === 'GOV' ? (isPremier() ? 'player' : 'aigov') : 'parl'); addNews(`Referendum costituzionale: vince il Sì con il ${fmt1(yes)}% (affluenza ${fmt1(turnout)}%). «${l.opts[rf.opt].t}» è legge.`, 'good'); }
    else addNews(`Referendum costituzionale: vince il No con il ${fmt1(100 - yes)}% (affluenza ${fmt1(turnout)}%). La riforma «${l.opts[rf.opt].t}» è bocciata.`, 'bad');
    if (premierOwn) { G.gov.popBank += won ? 4 : -6; if (!won && G.flags.personalizza) G.flags.refLost = true; }
    return { won, yes, turnout };
  }
  // abrogativo: serve il quorum
  const turnout = clamp(28 + l.sal * 6 + gauss() * 6 + (G.gov ? (45 - G.gov.approval) * 0.3 : 0), 15, 70);
  let yes = clamp(60 + (l.opts[rf.opt].e.pop || 0) * 3 + gauss() * 8, 25, 90);
  const valid = turnout > 50;
  if (valid && yes > 50) { applyLawChange(rf.lawId, rf.opt, 'parl'); addNews(`Referendum abrogativo: quorum raggiunto (${fmt1(turnout)}%), vince il Sì con il ${fmt1(yes)}%.`, 'good'); }
  else addNews(`Referendum abrogativo su «${l.nome}»: ${valid ? 'vince il No' : 'quorum mancato'} (affluenza ${fmt1(turnout)}%).`, 'parl');
  if (rf.by === 'PLAYER') { const ok = valid && yes > 50; myParty().spinta += ok ? 4 : -1; G.player.fama = clamp(G.player.fama + (ok ? 8 : 2), 0, 100); }
  return { won: valid && yes > 50, yes, turnout, valid };
}

// ============================================================
//  GOVERNO GUIDATO DALL'IA
// ============================================================
function aiGovTick() {
  const g = G.gov; if (!g || g.premier === 'PLAYER' || G.phase !== 'normale') return;
  // propone leggi del programma del partito del premier
  const active = G.bills.filter(b => !b.dead && b.proposer === 'GOV' && b.type !== 'manovra').length;
  if (active < 3 && chance(0.12)) {
    const pp = g.premierParty;
    const cands = allLaws().filter(l => !l.custom && !G.bills.some(b => !b.dead && b.lawId === l.id)).map(l => {
      const bo = bestOpt(pp, l); if (bo === G.laws[l.id]) return null;
      const partnerOk = g.parties.every(p => lawGain(p, l, G.laws[l.id], bo) > -0.4);
      const v = lawGain(pp, l, G.laws[l.id], bo) * l.sal;
      return partnerOk && v > 0.25 ? { l, bo, v } : null;
    }).filter(Boolean).sort((a, b) => b.v - a.v);
    if (cands.length) {
      const c = pick(cands.slice(0, 4));
      const type = c.l.cost ? 'cost' : (chance(0.3) ? 'dl' : 'ddl');
      const b = proposeBill(c.l.id, c.bo, type, 'GOV', chance(0.5) ? 'C' : 'S');
      if (type !== 'cost' && chance(0.5)) b.fiduciaAll = true;
    }
  }
  // dinamica interna della maggioranza
  g.parties.forEach(p => {
    if (p === myPid() && isLeader()) return;
    g.sat[p] = clamp((g.sat[p] || 55) + (58 - (g.sat[p] || 55)) * 0.03 + gauss() * 1.2, 0, 100);
  });
  // crisi di un governo IA (rara)
  const weak = g.parties.find(p => p !== g.premierParty && !(p === myPid() && isLeader()) && g.sat[p] < 12);
  if (weak && chance(0.15)) {
    const rest = g.parties.filter(p => p !== weak);
    if (!hasMajority(rest)) openCrisis('uscita', weak); else { g.parties = rest; addNews(`${P(weak).name} lascia la maggioranza, ma il governo resta in piedi.`, 'parl'); }
  }
}
function aiManovra(year) {
  // il governo IA scrive la manovra in base al suo orientamento
  const pp = P(G.gov.premierParty), eco = pp.ax.eco;
  const spese = BUDGET_MEASURES.filter(m => m.g === 'Spese');
  const cop = BUDGET_MEASURES.filter(m => m.g === 'Coperture');
  const chosen = [];
  let net = 0;
  // obiettivo: deficit intorno al 3% (più l'eventuale flessibilità concessa da Bruxelles)
  const tend = G.econ.baseDef - 0.1 + lawSum('costo') / G.econ.pilNom * 100;
  const targetNet = clamp((3.05 + (G.econ.flex || 0.3) - tend) * G.econ.pilNom / 100, -12, 14);
  spese.slice().sort(() => Math.random() - 0.5).forEach(m => { if (net + m.c <= targetNet + 8 && chance(0.6)) { chosen.push(m.id); net += m.c; } });
  cop.slice().sort(() => Math.random() - 0.5).forEach(m => { if (net > targetNet && m.id !== 'c_iva') { chosen.push(m.id); net += m.c; } });
  const b = makeBill({ type: 'manovra', proposer: 'GOV', measures: chosen, year, house: 'S', name: 'Legge di bilancio ' + year });
  G.bills.push(b);
  addNews(`Il Consiglio dei ministri approva la manovra ${year}: ${fmt1(chosen.reduce((s, id) => s + Math.max(0, BUDGET_BY_ID[id].c), 0))} miliardi di interventi.`, 'gov');
}

// ============================================================
//  CARRIERA (modalità "entra in un partito")
// ============================================================
const FAMA_FLOOR = [2, 5, 10, 22, 30, 40, 55, 65];
function careerTick() {
  const p = G.player;
  const floor = isPremier() ? 85 : FAMA_FLOOR[p.rank];
  // rendimenti decrescenti: più sei famoso, più è difficile crescere ancora
  const prev = p._fp === undefined ? p.fama : p._fp;
  const d = p.fama - prev;
  if (d > 0) p.fama = prev + d * Math.max(0.08, 1 - prev / 112);
  p.fama += (floor - p.fama) * 0.025;
  p.fama = clamp(p.fama, 0, 100);
  p._fp = p.fama;
  if (!p.leader) {
    p.seguito = clamp(p.seguito - 0.05, 0, 100);
    p.rap += (10 - p.rap) * 0.01;
  }
  // stress e salute
  p.stress = clamp(p.stress - 3, 0, 100);
  if (p.stress > 85) p.salute = clamp(p.salute - 1.5, 0, 100);
  else p.salute = clamp(p.salute + 0.3, 0, 100);
  if (p.age > 70) p.salute -= 0.05;
}
function promotionCheck() {
  const p = G.player; if (p.leader) return null;
  const r = p.rank;
  if (r === 3 && p.rap >= 30 && p.fama >= 28 && chance(0.25)) return 4;
  if (r === 4 && p.rap >= 40 && p.fama >= 38 && p.parl && chance(0.2)) return 5;
  if (r === 5 && p.rap >= 45 && p.fama >= 50 && chance(0.12)) return 6;
  if (r === 0 && p.fama >= 8 && chance(0.06)) return 1;
  if (r === 1 && p.fama >= 15 && p.seguito >= 8 && chance(0.04)) return 2;
  return null;
}
function leaderStrength(pid) {
  const pa = P(pid); const trend = pa.poll - pa.base0;
  return 45 + trend * 3 + pa.lCar * 2 - (G.flags['lostElection_' + pid] ? 20 : 0);
}
function challengeLeader() {
  const p = G.player, pid = myPid();
  const ls = leaderStrength(pid);
  const score = p.seguito * 1.1 + p.fama * 0.4 + p.car * 2 - ls;
  const prob = clamp(0.5 + score / 60, 0.05, 0.92);
  const ok = chance(prob);
  if (ok) {
    const old = P(pid).leader;
    P(pid).leader = p.name; P(pid).lCar = p.car; P(pid).lComp = p.comp;
    p.leader = true; p.rank = 7; p.seguito = 100;
    // la linea del partito si sposta verso le tue idee
    AXIS_KEYS.forEach(k => { P(pid).ax[k] = Math.round((P(pid).ax[k] * 0.6 + p.ax[k] * 0.4) * 10) / 10; });
    addNews(`Congresso di ${P(pid).name}: ${p.name} batte ${old} e diventa ${p.art === 'la' ? 'la nuova leader' : 'il nuovo leader'}!`, 'mio');
    G.careerLog.push({ w: G.week, t: `Vinci il congresso: leader di ${P(pid).short}` });
    if (inGov(pid) && G.gov.premierParty === pid && G.gov.premier !== 'PLAYER') {
      addNews(`Con il nuovo leader, ${G.gov.premier} lascia Palazzo Chigi: si apre la staffetta.`, 'parl');
      openCrisis('dimissioni');
    }
  } else {
    p.rap = clamp(p.rap - 45, -100, 100); p.seguito = clamp(p.seguito - 8, 0, 100); p.fama = clamp(p.fama + 6, 0, 100);
    addNews(`Congresso di ${P(pid).name}: ${P(pid).leader} si conferma. ${p.name} esce sconfitto ma più conosciuto.`, 'bad');
    G.careerLog.push({ w: G.week, t: 'Sconfitto al congresso del partito' });
  }
  return { ok, prob };
}
function doScissione(cfg) {
  const p = G.player, old = myPid(), op = P(old);
  const share = clamp(op.poll * (p.seguito / 100) * 0.45 + p.fama * 0.04, 0.5, op.poll * 0.6);
  const takeC = p.parl === 'C' ? Math.max(1, Math.round(op.seatsC * p.seguito / 100 * 0.5)) : Math.round(op.seatsC * p.seguito / 100 * 0.15);
  const takeS = p.parl === 'S' ? Math.max(1, Math.round(op.seatsS * p.seguito / 100 * 0.5)) : Math.round(op.seatsS * p.seguito / 100 * 0.15);
  G.parties.MIO = { id: 'MIO', name: cfg.name, short: cfg.short, color: cfg.color, symbol: cfg.symbol, leader: p.name, lCar: p.car, lComp: p.comp, area: 'Il tuo partito', family: '—',
    ax: Object.assign({}, p.ax), geo: Object.assign({}, op.geo), rx: Object.assign({}, op.rx), poll: share, base: share, base0: share, spinta: 3, seatsC: Math.min(takeC, op.seatsC), seatsS: Math.min(takeS, op.seatsS), coal: null, mine: true };
  op.seatsC -= G.parties.MIO.seatsC; op.seatsS -= G.parties.MIO.seatsS; op.poll -= share * 0.85; op.base = Math.max(0.5, op.base - share * 0.8); op.base0 = Math.max(0.5, op.base0 - share * 0.8);
  PIDS().forEach(id => { if (id !== 'MIO') G.rel[key2(id, 'MIO')] = clamp(Math.round((compat(id, 'MIO') - 50) * 0.5 + rel(id, old) * 0.3), -80, 80); });
  G.rel[key2(old, 'MIO')] = -60;
  G.player.party = 'MIO'; p.leader = true; p.rank = 7; p.seguito = 100;
  G.mode = 'fondatore';
  G.org = clamp(15 + p.fama * 0.3, 10, 50); G.cred = 50;
  REGIONS_DEF.forEach(r => { G.myReg[r.id] = regMult(old, r.id) * (r.id === p.region ? 1.5 : 1); });
  G.myPeople = G.myPeople.filter(x => !x.isPlayer);
  for (let i = 0; i < 4; i++) G.myPeople.push({ name: randomName(), party: 'MIO', comp: irnd(4, 7), scandal: irnd(1, 5), pref: pick(MINISTRIES).id });
  // via dalla coalizione e dal governo
  G.coalitions.forEach(c => { c.members = c.members.filter(m => m !== 'MIO'); });
  if (G.gov && G.gov.parties.includes(old)) {
    if (p.minister) { delete G.gov.ministers[p.minister]; p.minister = null; }
    if (chance(0.5) && G.gov.premier !== 'PLAYER') { G.gov.parties.push('MIO'); G.gov.sat.MIO = 40; addNews(`${cfg.name} resta in maggioranza con appoggio critico.`, 'parl'); }
  }
  addNews(`SCISSIONE in ${op.name}: ${p.name} fonda «${cfg.name}». Con te ${G.parties.MIO.seatsC} deputati e ${G.parties.MIO.seatsS} senatori.`, 'mio');
  G.careerLog.push({ w: G.week, t: `Scissione: fondi ${cfg.name}` });
}

// ============================================================
//  COALIZIONI E PRIMARIE
// ============================================================
function coalitionOf(pid) { return G.coalitions.find(c => c.members.includes(pid)); }
function joinScore(c, pid) {
  // quanto la coalizione accetta un partito
  const mem = c.members.filter(m => m !== pid);
  if (mem.some(m => never(m, pid))) return { score: 0, block: mem.find(m => never(m, pid)) };
  let w = 0, tot = 0;
  mem.forEach(m => { const s = P(m).poll; w += willing(m, pid) * s; tot += s; });
  let score = (tot ? w / tot : 50) + Math.min(12, P(pid).poll * 1.2) - D().accept;
  return { score: Math.round(clamp(score, 0, 100)) };
}
function coalitionDemands(c, pid) {
  // ogni alleato chiede una legge bandiera
  const out = [];
  c.members.filter(m => m !== pid).forEach(m => {
    const best = allLaws().filter(l => !l.custom).map(l => { const bo = bestOpt(m, l); if (bo === G.laws[l.id]) return null; return { l, bo, v: lawGain(m, l, G.laws[l.id], bo) * l.sal * (l.pp && l.pp[m] !== undefined ? 2 : 1) }; }).filter(Boolean).sort((a, b) => b.v - a.v)[0];
    if (best) out.push({ party: m, lawId: best.l.id, opt: best.bo });
  });
  return out;
}
function runPrimarie() {
  const c = G.coalitions.find(x => x.id === 'csx' || x.primarie);
  if (!c || G.primarie && G.primarie.done) return null;
  const cands = [];
  ['PD', 'M5S'].forEach(id => { if (c.members.includes(id) && !(id === myPid() && isLeader())) cands.push({ name: P(id).leader, party: id, score: Math.sqrt(P(id).poll) * P(id).lCar * (id === 'M5S' ? 1.1 : 1) }); });
  if (c.members.includes(myPid()) && (isLeader() || G.player.fama >= 30) && G.primarie && G.primarie.player) {
    cands.push({ name: G.player.name, party: myPid(), score: Math.sqrt(Math.max(0.5, myParty().poll)) * G.player.car * (0.7 + G.player.fama / 100) + (G.primarie.boost || 0), player: true });
  }
  let tot = 0; cands.forEach(x => { x.v = Math.max(1, x.score + gauss() * 3); tot += x.v; });
  cands.forEach(x => { x.pct = x.v / tot * 100; });
  cands.sort((a, b) => b.pct - a.pct);
  const w = cands[0];
  c.cand = w.player ? 'PLAYER' : w.name; c.candParty = w.party;
  G.primarie = Object.assign(G.primarie || {}, { done: true, res: cands });
  addNews(`Primarie del ${c.name}: vince ${w.player ? G.player.name : w.name} con il ${fmt1(w.pct)}%. Affluenza: ${fmt1(rnd(1.2, 2.4))} milioni di votanti.`, w.player ? 'mio' : 'parl');
  if (w.player) G.careerLog.push({ w: G.week, t: `Vinci le primarie del ${c.name}` });
  return cands;
}
function setCoalitionCandidates() {
  G.coalitions.forEach(c => {
    if (c.cand && (c.cand === 'PLAYER' || c.candLocked)) return;
    const big = c.members.slice().sort((a, b) => P(b).poll - P(a).poll)[0];
    if (!c.cand || !c.candLocked) { c.candParty = big; c.cand = big === myPid() && isLeader() ? 'PLAYER' : P(big).leader; }
  });
}
function aiCoalitionMoves() {
  // Futuro Nazionale nel centrodestra? Azione con chi?
  const cdx = G.coalitions.find(c => c.id === 'cdx');
  if (cdx && G.parties.FN && !coalitionOf('FN') && !G.flags.fnDecided && G.week >= G.cal.election - 14) {
    G.flags.fnDecided = true;
    if (cdx.members.includes('FDI') && rel('FDI', 'FN') > -25 && P('FN').poll > 4 && chance(0.55)) {
      cdx.members.push('FN'); addRel('FI', 'FN', -10);
      addNews('Accordo nel centrodestra: Futuro Nazionale di Vannacci entra nella coalizione. Malumori in Forza Italia.', 'parl');
    } else addNews('Niente accordo tra centrodestra e Vannacci: Futuro Nazionale correrà da solo.', 'parl');
  }
}

// ============================================================
//  RIEPILOGO SETTIMANALE
// ============================================================
function advanceWeek() {
  if (G.phase !== 'normale') return null;
  G._wk = { news: [], votes: [], events: [], specials: [] };
  G.week++;
  const w = G.week, d = dateOf(w), y = d.getFullYear(), prevY = dateOf(w - 1).getFullYear();
  if (y !== prevY) yearRollover(prevY);
  // capitale politico
  G.pc = Math.min(pcMax(), G.pc + pcIncome());
  // fondi
  if (isLeader()) G.funds += Math.round(myParty().poll * 4 + G.player.fama * 0.6 + (myParty().seatsC + myParty().seatsS) * 1.5);
  else G.funds += 2;
  econTick();
  approvalTick();
  pollTick();
  billsTick();
  aiGovTick();
  partiesProposeTick();
  careerTick();
  calendarTick();
  if (G.gov && isPremier()) { G.stats.weeksPremier++; partnerTick(); }
  // votazioni della prossima settimana in cui conti tu
  if (G.phase === 'normale') { const up = upcomingVotes(); if (up.length) G._wk.specials.push({ k: 'voti', ids: up }); const mp = ministerProposal(); if (mp) G._wk.specials.push(mp); }
  // eventi casuali
  if (G.phase === 'normale') rollEvents();
  // presenza territoriale del tuo partito: lieve decadimento
  REGIONS_DEF.forEach(r => { if (G.myReg[r.id] > 1) G.myReg[r.id] = 1 + (G.myReg[r.id] - 1) * 0.995; });
  // umore pubblico: torna lentamente
  AXIS_KEYS.forEach(k => { G.mood[k] += (G.mood0[k] - G.mood[k]) * 0.01; });
  snapshot();
  const s = G._wk; G._wk = null;
  G.lastSummary = s;
  return s;
}
function partnerTick() {
  const g = G.gov, d = D();
  g.parties.forEach(p => {
    if (p === myPid()) return;
    const base = 56 + rel(p, myPid()) * 0.2;
    g.sat[p] = clamp(g.sat[p] + (base - g.sat[p]) * 0.02 + gauss() * 0.8 - (g.approval < 35 ? 0.3 : 0), 0, 100);
    // pressione: sondaggi del partner che calano
    if (P(p).poll < P(p).base0 * 0.8) g.sat[p] -= 0.3 * d.partner;
    const thr = 14 / d.partner;
    if (g.sat[p] < thr) {
      g.lowSat[p] = (g.lowSat[p] || 0) + 1;
      if (g.lowSat[p] === 1) addNews(`${P(p).leader} (${P(p).short}) minaccia di aprire la crisi: «Così non si va avanti».`, 'bad');
      if (g.lowSat[p] >= 4 && G.week - g.start > 12 && chance(0.3)) {
        const rest = g.parties.filter(x => x !== p);
        if (hasMajority(rest)) { g.parties = rest; delete g.sat[p]; Object.keys(g.ministers).forEach(k => { const pp = person(g.ministers[k]); if (pp && pp.party === p) delete g.ministers[k]; }); addNews(`${P(p).name} esce dalla maggioranza e ritira i ministri. Il governo regge, ma è più debole.`, 'bad'); g.popBank -= 2; }
        else openCrisis('uscita', p);
      }
    } else g.lowSat[p] = 0;
  });
}
function calendarTick() {
  const w = G.week, d = dateOf(w), m = d.getMonth(), day = d.getDate(), y = d.getFullYear();
  // rating ogni 26 settimane
  if (w % 26 === 13) ratingReview();
  // manovra: a metà ottobre il governo la presenta
  if (m === 9 && day >= 8 && day <= 14 && G.gov && !G.flags['manovraPres' + (y + 1)] && G.phase === 'normale') {
    G.flags['manovraPres' + (y + 1)] = true;
    if (isPremier()) G._wk.specials.push({ k: 'manovra', year: y + 1 });
    else aiManovra(y + 1);
  }
  // manovra non approvata entro fine anno: esercizio provvisorio
  if (m === 11 && day >= 25 && !G.flags['manovra' + (y + 1)] && !G.flags['provv' + (y + 1)] && G.gov) {
    const b = G.bills.find(b => b.type === 'manovra' && !b.dead && b.year === y + 1);
    if (b || !G.flags['manovraPres' + (y + 1)] || G.flags.manovraFail) {
      G.flags['provv' + (y + 1)] = true;
      if (b) b.dead = true;
      G.econ.shockSpread += 25; if (G.gov) G.gov.popBank -= 5;
      addNews(`Manovra ${y + 1} non approvata in tempo: scatta l’esercizio provvisorio. I mercati reagiscono male.`, 'bad');
      G.budget.next = [];
    }
  }
  // parere della Commissione europea sul bilancio (fine novembre)
  if (m === 10 && day >= 20 && day <= 26 && G.gov && !G.flags['parereUE' + y]) {
    G.flags['parereUE' + y] = true;
    const b = G.bills.find(b => b.type === 'manovra' && b.year === y + 1);
    const def = b ? G.econ.baseDef - 0.1 + (lawSum('costo') + budgetSum('c', b.measures)) / G.econ.pilNom * 100 : G.econ.deficit;
    const lim = 3 + (G.econ.flex || 0);
    let txt, k;
    if (def <= 3) { txt = 'promuove la manovra: in linea con il Patto di stabilità'; k = 'good'; G.econ.shockSpread -= 5; }
    else if (def <= lim + 0.05) { txt = 'promuove la manovra grazie alla flessibilità concessa per difesa ed energia'; k = 'eco'; }
    else if (def <= lim + 0.5) { txt = 'segnala un rischio di non conformità al Patto di stabilità'; k = 'bad'; G.econ.shockSpread += 12; if (isPremier()) G.groups.ue -= 8; }
    else { txt = 'boccia la manovra: deviazione significativa, possibile nuova procedura'; k = 'bad'; G.econ.shockSpread += 40; G.econ.pde = true; if (isPremier()) { G.groups.ue -= 20; G.groups.merc -= 12; } }
    addNews(`Bruxelles ${txt} (deficit previsto ${fmt1(def)}%).`, k);
  }
  // uscita dalla procedura per deficit eccessivo (primavera, dati Eurostat)
  if (m === 4 && day <= 7 && G.econ.pde && G.econ.defHist[y - 1] !== undefined) {
    if (G.econ.defHist[y - 1] < 3) { G.econ.pde = false; G.econ.shockSpread -= 12; addNews(`L’Italia esce dalla procedura per deficit eccessivo: il deficit ${y - 1} è sotto il 3%.`, 'good'); if (isPremier()) { G.gov.popBank += 2; G.groups.ue += 10; } }
  }
  // decreti flussi, ecc: nessuna azione
  // elezioni politiche
  if (G.cal.election - w === 16) addNews(`Il Presidente ${INSTITUTIONS.pdr} scioglierà le Camere: elezioni politiche il ${fmtDate(G.cal.election)}.`, 'parl');
  if (G.cal.election - w === 12 && G.coalitions.some(c => c.id === 'csx' && !c.cand && !c.candLocked)) G._wk.specials.push({ k: 'primarie' });
  if (G.cal.election - w === 6) { aiCoalitionMoves(); setCoalitionCandidates(); G.flags.listsDeposited = G.cal.election; addNews('Depositati simboli, coalizioni e candidati premier al Viminale.', 'parl'); if (!isLeader() && !G.player.parl && G.player.rank >= 2) G._wk.specials.push({ k: 'candidatura' }); else if (!isLeader() && G.player.parl) G._wk.specials.push({ k: 'candidatura' }); }
  if (G.cal.election - w <= 14 && G.cal.election - w > 6) aiCoalitionMoves();
  if (w === G.cal.election) { G._wk.specials.push({ k: 'elezioni' }); }
  // regionali
  Object.keys(G.regions).forEach(rid => {
    const st = G.regions[rid];
    if (st.next - w === 8 && G.player.region === rid && !isLeader() && G.player.rank === 1) G._wk.specials.push({ k: 'candReg', rid });
    if (st.next === w) { const r = regionalElection(rid); G._wk.specials.push({ k: 'regionali', r }); }
  });
  // comunali (primavera): carriera
  if (m === 4 && day >= 22 && day <= 28 && !isLeader() && G.player.rank === 0) G._wk.specials.push({ k: 'comunali' });
  // referendum
  G.referendums.forEach(rf => { if (!rf.done && rf.w === w) { rf.done = true; rf.res = runReferendum(rf); G._wk.specials.push({ k: 'referendum', rf }); } });
  // Consulta
  G.consulta.forEach(c => {
    if (c.done || c.w !== w) return; c.done = true;
    if (G.laws[c.lawId] !== c.opt) return;
    if (chance(c.p)) {
      const l = getLaw(c.lawId);
      applyLawChange(c.lawId, c.from, 'revert');
      addNews(`La Corte costituzionale boccia «${l.opts[c.opt].t}»: la norma è illegittima.`, 'bad');
      if (G.enacted[0]) G.enacted[0].by = 'consulta';
      if (isPremier()) { G.gov.popBank -= 1.5; G.groups.mag += 4; }
    }
  });
  // Quirinale
  if (w === G.cal.quirinale) G._wk.specials.push({ k: 'quirinale' });
  // europee
  if (w === G.cal.europee) {
    const res = {}; PIDS().forEach(id => { res[id] = Math.max(0, P(id).poll + gauss() * 1.2); });
    G.flags.europee = res;
    addNews(`Elezioni europee: primo partito ${P(Object.keys(res).sort((a, b) => res[b] - res[a])[0]).short}. ${myParty().short} al ${fmt1(res[myPid()])}%.`, 'mio');
    PIDS().forEach(id => { P(id).spinta += (res[id] - P(id).poll) * 0.5; });
  }
  // promozioni (una volta al mese)
  if (day <= 7 && !isLeader()) {
    const nr = promotionCheck();
    if (nr !== null) G._wk.specials.push({ k: 'promozione', rank: nr });
    // il leader cade dopo una sconfitta
    if (G.flags['lostElection_' + myPid()] && !G.flags['congresso_' + myPid() + G.legislature] && chance(0.3)) { G.flags['congresso_' + myPid() + G.legislature] = true; G._wk.specials.push({ k: 'congresso' }); }
  }
  // spread fuori controllo
  if (isPremier() && G.econ.spread > 450) { G.flags.spreadWeeks = (G.flags.spreadWeeks || 0) + 1; if (G.flags.spreadWeeks >= 3) { G.flags.spreadWeeks = 0; G._wk.specials.push({ k: 'tecnico' }); } } else G.flags.spreadWeeks = 0;
  // stress estremo
  if (G.player.salute < 25 && !G.flags.malore) { G.flags.malore = true; G._wk.specials.push({ k: 'malore' }); }
}

// ============================================================
//  SALVATAGGI
// ============================================================
const SAVE_PREFIX = 'palazzochigi_';
function saveGame(slot) { try { localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(G)); return true; } catch (e) { return false; } }
function migrate() { if (G.gov && !G.gov.premierParty) G.gov.premierParty = largestIn(G.gov.parties); G.myPersonal = G.myPersonal || {}; G.usedActs = G.usedActs || {}; G.tipsSeen = G.tipsSeen || {}; }
function loadGame(slot) { try { const s = localStorage.getItem(SAVE_PREFIX + slot); if (!s) return false; G = JSON.parse(s); migrate(); return true; } catch (e) { return false; } }
function slotInfo(slot) {
  try { const s = localStorage.getItem(SAVE_PREFIX + slot); if (!s) return null; const g = JSON.parse(s); return { name: g.player.name, party: g.parties[g.player.party].short, date: fmtDate(g.week), premier: g.gov && g.gov.premier === 'PLAYER' }; } catch (e) { return null; }
}
