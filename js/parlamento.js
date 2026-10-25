// ============================================================
//  PARLAMENTO ED ELEZIONI: franchi tiratori con nome, emendamenti
//  sulle leggi importanti, confronto TV a turni, regioni in bilico,
//  più istituti di sondaggio e sondaggi per età e per zona
// ============================================================

// ---------- franchi tiratori con nome ----------
function makeRebels(r) {
  const out = [];
  Object.entries(r.by || {}).forEach(([pid, x]) => {
    if (pid === 'ALT' || !G.parties[pid]) return;
    const n = x.vote === 'yes' ? x.no : x.vote === 'no' ? x.yes : 0;
    if (!n) return;
    const pool = allPeople().filter(q => q.party === pid && !q.isPlayer && q.name !== G.player.name).map(q => q.name);
    const names = [];
    for (let i = 0; i < Math.min(n, 3); i++) { const left = pool.filter(q => !names.includes(q)); names.push(left.length ? pick(left) : randomName()); }
    out.push({ pid, n, names, dir: x.vote === 'yes' ? 'no' : 'sì' });
  });
  return out;
}
const _computeVoteReb = computeVote;
computeVote = function (b, h, opts) { const r = _computeVoteReb(b, h, opts); if (!opts || !opts.det) r.rebels = makeRebels(r); return r; };
function rebelNews(b, v) {
  const gov = (v.rebels || []).filter(x => inGov(x.pid) && isGovBill(b) && x.dir === 'no');
  const tot = gov.reduce((s, x) => s + x.n, 0);
  if (tot >= 3) addNews(`Franchi tiratori su «${billName(b)}»: ${tot} della maggioranza votano contro, tra cui ${gov.flatMap(x => x.names.slice(0, 2).map(n => `${n} (${P(x.pid).short})`)).slice(0, 3).join(', ')}.`, 'parl');
}
function rebelsHTML(v) {
  if (!v.rebels || !v.rebels.length) return '';
  return sec('Chi non ha seguito il partito') + `<div class="card tight"><div class="list">${v.rebels.map(x => `<div class="li">${partyChip(x.pid)}<div class="grow small">${x.names.map(esc).join(', ')}${x.n > x.names.length ? ` e altri ${x.n - x.names.length}` : ''}</div><span class="tag ${x.dir === 'no' ? 'b' : 'g'}">${x.n} ${x.dir}</span></div>`).join('')}</div></div>`;
}
const _openVoteReplayReb = openVoteReplay;
openVoteReplay = function (id) {
  _openVoteReplayReb(id);
  const b = G.bills.find(x => x.id === id), v = b && b.votes[b.votes.length - 1];
  const sh = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null;
  if (v && sh) sh.insertAdjacentHTML('beforeend', rebelsHTML(v));
};

// ---------- emendamenti sulle leggi importanti ----------
const _nextStageAm = nextStage;
nextStage = function (b) { _nextStageAm(b); try { maybeAmend(b); } catch (e) { console.error(e); } };
function maybeAmend(b) {
  const s = b.stages[b.stage];
  if (!s || s.k !== 'aula' || !b.lawId || b.amended) return;
  const l = getLaw(b.lawId); if (!l || (l.sal || 0) < 2 || l.cost) return;
  if (!((b.proposer === 'GOV' && isPremier()) || b.proposer === 'PLAYER')) return;
  if (!chance(0.65)) return;
  // un partito che oggi è tiepido o contrario ma potrebbe votare una versione più morbida
  const cands = PIDS().filter(p => p !== myPid() && seatsOf(p, s.h) >= 5 && lawGain(p, l, b.from, b.opt) < 0.1).map(p => {
    const alts = l.opts.map((o, i) => i).filter(i => i !== b.from && i !== b.opt && lawGain(myPid(), l, b.from, i) > 0 && lawGain(p, l, b.from, i) > lawGain(p, l, b.from, b.opt) + 0.15);
    alts.sort((x, y) => lawGain(p, l, b.from, y) - lawGain(p, l, b.from, x));
    return alts.length ? { p, alt: alts[0], w: (inGov(p) ? 2 : 1) * seatsOf(p, s.h) } : null;
  }).filter(Boolean).sort((a, c) => c.w - a.w);
  if (!cands.length) return;
  const c = cands[0]; b.amended = true;
  G.queue.push({ id: 'emendamento', ctx: { bid: b.id, p: c.p, alt: c.alt } });
}
EVENTS.push({ id: 'emendamento', for: 'all', w: 0, chain: true, img: 'pen', look: 'chat',
  title: c => `${G.parties[c.p] ? P(c.p).short : 'Un partito'} presenta un emendamento`,
  text: c => { const b = G.bills.find(x => x.id === c.bid); if (!b || !G.parties[c.p]) return 'Un partito chiede di modificare la tua legge prima del voto in aula.'; const l = getLaw(b.lawId); return `Prima del voto in aula su «${billName(b)}», ${P(c.p).leader} propone di cambiare il testo: invece di «${l.opts[b.opt].t}», «${l.opts[c.alt].t}». In cambio ${P(c.p).short} voterebbe sì.`; },
  choices: c => [
    { t: 'Accetto l’emendamento', fx: {}, r: 'Il testo cambia, ma passa con più voti.', run: () => { const b = G.bills.find(x => x.id === c.bid); if (!b || b.dead) return; b.opt = c.alt; addRel(c.p, myPid(), 6); if (G.gov && G.gov.sat[c.p] !== undefined) G.gov.sat[c.p] = clamp(G.gov.sat[c.p] + 6, 0, 100); G.forced = G.forced || {}; G.forced[b.id] = (G.forced[b.id] || []).concat([c.p]); addNews(`Accolto l’emendamento di ${P(c.p).short} su «${billName(b)}».`, 'parl'); } },
    { t: 'Respingo: il testo resta com’è', fx: { cred: 1 }, r: 'Tieni il punto, ma quel partito voterà contro.', run: () => { if (G.parties[c.p]) { addRel(c.p, myPid(), -4); if (G.gov && G.gov.sat[c.p] !== undefined) G.gov.sat[c.p] = clamp(G.gov.sat[c.p] - 5, 0, 100); } } },
  ] });
EVENT_BY_ID.emendamento = EVENTS[EVENTS.length - 1];

// ---------- confronto TV a turni ----------
const DEB_TOPICS = [
  { k: 'eco', t: 'Tasse, stipendi e bollette' }, { k: 'imm', t: 'Immigrazione' }, { k: 'eu', t: 'L’Italia in Europa' },
  { k: 'soc', t: 'Diritti e famiglia' }, { k: 'amb', t: 'Clima ed energia' }, { k: 'giu', t: 'Giustizia e sicurezza' },
];
let DEB = null;
function openDebate() {
  const opps = PIDS().filter(p => p !== myPid() && P(p).poll >= 4).sort((a, b) => P(b).poll - P(a).poll).slice(0, 5);
  openSheet(`${head('Confronto TV tra leader', 'Tre domande, tre risposte: chi convince di più?')}
    <p class="small muted">Scegli contro chi. I sondaggi istantanei alla fine decidono il vincitore.</p>
    <div class="list">${opps.map(p => `<div class="li click" onclick="startDebate('${p}')">${leaderPortrait(p, 40)}<div class="grow"><b class="small">${esc(P(p).leader)}</b><div class="tiny muted">${esc(P(p).name)} · ${fmt1(P(p).poll)}%</div></div>${icon('chevron', 16)}</div>`).join('')}</div>`);
}
function startDebate(pid) {
  if (usedThisWeek('dibattito')) return toast('Hai già fatto un confronto questa settimana', 'bad');
  if (!spendPC(2)) return toast('Capitale politico insufficiente', 'bad');
  markUsed('dibattito');
  const tp = DEB_TOPICS.slice().sort((a, b) => (G.sal[b.k] || 0) + Math.random() - (G.sal[a.k] || 0) - Math.random()).slice(0, 3);
  DEB = { opp: pid, tp, i: 0, me: 0, them: 0, log: [] };
  closeSheet(); openSheet('', { full: true, locked: true }); renderDebate();
}
function renderDebate() {
  const d = DEB, o = P(d.opp), t = d.tp[d.i];
  const tot = d.me + d.them || 1, pct = Math.round(clamp(50 + (d.me - d.them) / tot * 40, 10, 90));
  let h = `<div class="center"><div class="live"><i></i>CONFRONTO IN DIRETTA</div><div class="row mt" style="justify-content:center;gap:18px">${portrait(G.player.name, 62, { party: myPid() })}<b class="gold" style="font-size:20px">VS</b>${leaderPortrait(d.opp, 62)}</div>
    <div class="card tight mt"><div class="row between small"><b>${esc(G.player.name)}</b><b>${esc(o.leader)}</b></div><div class="bmtr"><div class="tr"><b style="width:${pct}%"></b><u style="width:${100 - pct}%"></u><s style="left:50%"></s></div></div><div class="tiny muted mt">Gradimento in studio: ${pct}% contro ${100 - pct}%</div></div></div>`;
  h += d.log.map(x => `<div class="bub">${esc(x.q)}</div><div class="bub me">${esc(x.a)}</div><div class="tiny ${x.win ? 'good' : 'bad'}" style="margin:2px 0 8px">${x.win ? 'Il pubblico è con te' : `${esc(o.leader)} ha la meglio`}</div>`).join('');
  if (t) {
    const myAx = myParty().ax[t.k] || 0, oAx = o.ax[t.k] || 0;
    h += sec(`Domanda ${d.i + 1} di 3 · ${esc(t.t)}`) + `<div class="bub">${esc(o.leader)}: «Sul tema ${t.t.toLowerCase()} questo Paese ha bisogno di una direzione chiara, e io ce l’ho.»</div>
      ${[['att', `Attacco: «${o.leader} ${inGov(d.opp) ? 'governa e non ha risolto nulla' : 'fa solo propaganda'}»`, 'Rischioso ma può ribaltare il confronto'],
         ['pro', `Proposta: la mia ricetta su ${t.t.toLowerCase()}`, 'Rende di più sui temi che interessano agli italiani'],
         ['cal', 'Calma e numeri: rassicuro chi guarda', 'Sicuro, guadagni poco ma non sbagli']].map(([k, a, r]) => `<button class="choice" onclick="debateAnswer('${k}')"><div class="t">${esc(a)}</div><div class="small muted">${r}</div></button>`).join('')}`;
    void myAx; void oAx;
  } else {
    const win = d.me >= d.them;
    h += `<div class="card hero center mt"><span class="stamp ${win ? 'good' : 'bad'}">${win ? 'HAI VINTO' : 'HAI PERSO'}</span><p class="small muted mt">Sondaggio istantaneo: ${pct}% per te, ${100 - pct}% per ${esc(o.leader)}.</p></div>
      <button class="btn gold block mt" onclick="endDebate()">Continua</button>`;
  }
  replaceSheet(h);
}
function debateAnswer(k) {
  const d = DEB, o = P(d.opp), t = d.tp[d.i], p = G.player, sal = G.sal[t.k] || 0.5;
  const close = 1 - Math.abs((myParty().ax[t.k] || 0) - (G.mood[t.k] || 0)) / 20;
  let me = k === 'att' ? 1 + p.car / 2.5 + (inGov(d.opp) ? 1.5 : 0) + rnd(-3, 3) : k === 'pro' ? 1.5 + p.comp / 3 + sal * 1.5 + close * 2 + rnd(-1.5, 1.5) : 2 + G.cred / 40 + rnd(-0.5, 0.5);
  const them = 1.5 + o.lCar / 2.6 + rnd(-1.5, 2);
  d.me += Math.max(0, me); d.them += Math.max(0, them);
  const a = { att: `Attacco ${o.leader} sul tema ${t.t.toLowerCase()}`, pro: `Presento la mia proposta su ${t.t.toLowerCase()}`, cal: 'Rispondo con calma, dati alla mano' }[k];
  d.log.push({ q: `Moderatore: ${t.t}?`, a, win: me >= them });
  d.i++; vib(10); renderDebate();
}
function endDebate() {
  const d = DEB, win = d.me >= d.them, diff = clamp((d.me - d.them) / 4, -2, 2);
  myParty().spinta += 1 + diff; P(d.opp).spinta -= diff * 0.7;
  applyFx({ fama: win ? 4 : 2 });
  addNews(`Confronto TV ${G.player.name}–${P(d.opp).leader}: ${win ? `vince ${G.player.name}` : `meglio ${P(d.opp).leader}`} secondo i sondaggi istantanei.`, win ? 'mio' : 'bad');
  DEB = null; closeSheet(); renderGame();
}

// ---------- regioni in bilico ----------
function swingRegions() {
  const me = myPid(), c = coalitionOf(me), mine = c ? c.members : [me];
  return REGIONS_DEF.filter(r => r.el >= 0.3).map(r => {
    const s = regionShares(r.id); const blk = {};
    PIDS().forEach(p => { const k = mine.includes(p) ? 'me' : (coalitionOf(p) ? coalitionOf(p).id : p); blk[k] = (blk[k] || 0) + (s[p] || 0); });
    const my = blk.me || 0, riv = Math.max(0, ...Object.keys(blk).filter(k => k !== 'me').map(k => blk[k]));
    return { r, my, riv, m: my - riv };
  }).sort((a, b) => Math.abs(a.m) - Math.abs(b.m));
}
function openSwing() {
  const L = swingRegions().slice(0, 8);
  openSheet(`${head('Regioni in bilico', 'Dove un comizio può fare la differenza')}
    <p class="small muted">Le regioni dove la tua coalizione e la rivale sono più vicine. Un comizio lì sposta più voti che altrove.</p>
    <div class="list">${L.map(x => `<div class="li"><div class="grow"><b class="small">${esc(x.r.n)}</b><div class="tiny muted">${fmt1(x.r.el)} mln elettori · voi ${fmt1(x.my)}% · rivali ${fmt1(x.riv)}%</div></div><span class="tag ${Math.abs(x.m) < 2 ? 'w' : x.m > 0 ? 'g' : 'b'}">${x.m > 0 ? '+' : ''}${fmt1(x.m)}</span><button class="btn sm" onclick="closeSheet();doComizio('${x.r.id}')">Comizio</button></div>`).join('')}</div>`);
}

// ---------- più istituti, sondaggi per età e per zona ----------
const ISTITUTI = ['SWG', 'YouTrend', 'Ipsos', 'Tecnè'];
function instPoll(inst, pid) { const r = seeded(hashStr(inst + pid + G.week)); const bias = (seeded(hashStr(inst + pid))() - 0.5) * 1.6; return Math.max(0.3, P(pid).poll + bias + (r() - 0.5) * 1.2); }
function segPolls() {
  const ids = PIDS(), band = { giovani: {}, adulti: {}, anziani: {} }, zona = { Nord: {}, Centro: {}, Sud: {} };
  ids.forEach(p => { const a = P(p).ax; band.giovani[p] = P(p).poll * Math.max(0.2, 1 + (-(a.soc || 0) - (a.amb || 0)) / 30); band.adulti[p] = P(p).poll; band.anziani[p] = P(p).poll * Math.max(0.2, 1 + ((a.soc || 0) - (a.eu || 0) * 0.3) / 30); });
  const area = { Nord: ['NO', 'NE'], Centro: ['CEN'], Sud: ['SUD', 'ISO'] };
  Object.keys(area).forEach(z => { const rs = REGIONS_DEF.filter(r => area[z].includes(r.area)), tot = rs.reduce((s, r) => s + r.el, 0); ids.forEach(p => { zona[z][p] = rs.reduce((s, r) => s + (regionShares(r.id)[p] || 0) * r.el, 0) / tot; }); });
  [band, zona].forEach(g => Object.values(g).forEach(m => { const s = Object.values(m).reduce((a, b) => a + b, 0) || 1; Object.keys(m).forEach(p => m[p] = m[p] / s * (100 - OTHER_POLL)); }));
  return { band, zona };
}
function pollExtrasHTML() {
  const ids = PIDS().sort((a, b) => P(b).poll - P(a).poll), show = ids.slice(0, 6).concat(ids.slice(6).includes(myPid()) ? [myPid()] : []);
  const S = segPolls(), me = myPid();
  const tbl = (cols, val) => `<div class="ptab" style="--pc:${cols.length}"><div class="pr ph"><span></span>${cols.map(c => `<b>${c}</b>`).join('')}</div>${show.map(p => `<div class="pr ${p === me ? 'me' : ''}"><span>${partyChip(p)}</span>${cols.map(c => `<span>${fmt1(val(c, p))}</span>`).join('')}</div>`).join('')}</div>`;
  return sec('Gli istituti') + `<div class="card tight">${tbl(ISTITUTI, (c, p) => instPoll(c, p))}<div class="tiny muted mt">Ogni istituto ha il suo campione: i numeri differiscono di qualche decimale.</div></div>`
    + sec('Per età') + `<div class="card tight">${tbl(['18-34', '35-54', '55+'], (c, p) => S.band[{ '18-34': 'giovani', '35-54': 'adulti', '55+': 'anziani' }[c]][p])}</div>`
    + sec('Per zona') + `<div class="card tight">${tbl(['Nord', 'Centro', 'Sud'], (c, p) => S.zona[c][p])}</div>`;
}
const _partitiTabPoll = partitiTab;
partitiTab = function () { const h = _partitiTabPoll(); return UI.partiti === 'sondaggi' ? h + pollExtrasHTML() : h; };

// ---------- azioni ----------
(function () {
  const a = ACTIONS.find(x => x.id === 'dibattito');
  if (a) { a.custom = () => openDebate(); a.d = 'Tre domande, tre risposte contro un altro leader: attacchi, proponi o rassicuri. Il sondaggio istantaneo decide chi vince.'; }
  ACTIONS.splice(ACTIONS.findIndex(x => x.id === 'riposo'), 0, { id: 'bilico', n: 'Regioni in bilico', ico: 'map', cost: 0, show: () => isLeader() && inCampaign(), d: 'Le regioni dove la sfida è più aperta, con un comizio a portata di tocco.', custom: () => openSwing() });
  ROUTINE_NO.push('bilico');
})();
