// ============================================================
//  GOVERNO: manovra con cursori e richieste dei ministri, trattativa
//  a Bruxelles, rate dei fondi europei, correnti del partito,
//  governatori e autonomia, parti sociali e scioperi, inchieste a fasi,
//  bandiere e leader stranieri, direttori di giornale e fake news
// ============================================================

// ---------- bandiere rotonde e leader stranieri ----------
const FOREIGN = {
  DE: ['Germania', 'Friedrich Merz'], FR: ['Francia', 'Emmanuel Macron'], ES: ['Spagna', 'Pedro Sánchez'], PL: ['Polonia', 'Donald Tusk'],
  NL: ['Paesi Bassi', 'Rob Jetten'], US: ['Stati Uniti', 'Donald Trump'], UK: ['Regno Unito', 'Keir Starmer'], JP: ['Giappone', 'Sanae Takaichi'],
  CA: ['Canada', 'Mark Carney'], TR: ['Turchia', 'Recep Tayyip Erdoğan'],
};
function flagSVG(c) {
  const v = (a, b, d) => `<rect width="10" height="30" fill="${a}"/><rect x="10" width="10" height="30" fill="${b}"/><rect x="20" width="10" height="30" fill="${d}"/>`;
  const o = (a, b, d) => `<rect width="30" height="10" fill="${a}"/><rect y="10" width="30" height="10" fill="${b}"/><rect y="20" width="30" height="10" fill="${d}"/>`;
  const F = {
    IT: v('#009246', '#fff', '#ce2b37'), FR: v('#0055a4', '#fff', '#ef4135'), DE: o('#000', '#dd0000', '#ffce00'), NL: o('#ae1c28', '#fff', '#21468b'),
    ES: '<rect width="30" height="30" fill="#aa151b"/><rect y="8" width="30" height="14" fill="#f1bf00"/>', PL: '<rect width="30" height="15" fill="#fff"/><rect y="15" width="30" height="15" fill="#dc143c"/>',
    US: '<rect width="30" height="30" fill="#fff"/>' + [0, 2, 4, 6, 8, 10].map(i => `<rect y="${i * 2.5}" width="30" height="2.5" fill="#b22234"/>`).join('') + '<rect width="14" height="15" fill="#3c3b6e"/><circle cx="4" cy="4" r="1" fill="#fff"/><circle cx="9" cy="4" r="1" fill="#fff"/><circle cx="6.5" cy="8" r="1" fill="#fff"/><circle cx="4" cy="12" r="1" fill="#fff"/><circle cx="9" cy="12" r="1" fill="#fff"/>',
    UK: '<rect width="30" height="30" fill="#012169"/><path d="M0 0 30 30M30 0 0 30" stroke="#fff" stroke-width="6"/><path d="M0 0 30 30M30 0 0 30" stroke="#c8102e" stroke-width="2"/><path d="M15 0v30M0 15h30" stroke="#fff" stroke-width="9"/><path d="M15 0v30M0 15h30" stroke="#c8102e" stroke-width="5"/>',
    JP: '<rect width="30" height="30" fill="#fff"/><circle cx="15" cy="15" r="7" fill="#bc002d"/>',
    CA: '<rect width="30" height="30" fill="#fff"/><rect width="8" height="30" fill="#d80621"/><rect x="22" width="8" height="30" fill="#d80621"/><path d="M15 8l2 4 3-1-1 5 2 1-6 4-6-4 2-1-1-5 3 1z" fill="#d80621"/>',
    TR: '<rect width="30" height="30" fill="#e30a17"/><circle cx="13" cy="15" r="7" fill="#fff"/><circle cx="15" cy="15" r="5.6" fill="#e30a17"/><path d="M20 15l4-1.3-2.5 3.4v-4.2l2.5 3.4z" fill="#fff"/>',
  };
  return F[c] || '<rect width="30" height="30" fill="#666"/>';
}
function flagHTML(c, size) { return `<span class="rflag" style="width:${size || 30}px;height:${size || 30}px"><svg viewBox="0 0 30 30" preserveAspectRatio="xMidYMid slice">${flagSVG(c)}</svg></span>`; }
function summitFlagsHTML(flags) {
  return `<div class="sum-flags">${flags.map(f => `<div class="sfl">${flagHTML(f, 40)}<b>${esc(f === 'IT' ? (G.player.name.split(' ').slice(-1)[0]) : FOREIGN[f][1].split(' ').slice(-1)[0])}</b><span>${esc(f === 'IT' ? 'Italia' : FOREIGN[f][0])}</span></div>`).join('')}</div>`;
}

// ---------- 22: manovra con cursori e richieste dei ministri ----------
function demWho(p) {
  const k = G.gov ? Object.keys(G.gov.ministers).find(k => { const x = person(G.gov.ministers[k]); return x && x.party === p && MIN_BY_ID[k] && MIN_BY_ID[k].w >= 2; }) : null;
  return k ? `${G.gov.ministers[k]} (${MIN_BY_ID[k].n})` : P(p).short;
}
function ministerRequestsHTML() {
  const ps = Object.keys(MAN.dem || {}); if (!ps.length) return '';
  return sec('Le richieste dei ministri') + `<div class="card tight"><div class="list">${ps.map(p => {
    const k = Object.keys(G.gov.ministers).find(k => { const x = person(G.gov.ministers[k]); return x && x.party === p && MIN_BY_ID[k] && MIN_BY_ID[k].w >= 2; });
    const who = k ? G.gov.ministers[k] : P(p).leader, ok = MAN.dem[p].filter(id => MAN.sel.has(id)).length;
    return `<div class="li" style="align-items:flex-start">${portrait(who, 38)}<div class="grow"><b class="small">${esc(who)}</b> <span class="tiny muted">${k ? esc(MIN_BY_ID[k].n) : ''} · ${esc(P(p).short)}</span><div class="tiny" style="margin-top:3px">Chiede: ${MAN.dem[p].map(id => `<span class="${MAN.sel.has(id) ? 'good' : 'muted'}">${MAN.sel.has(id) ? '✓' : '○'} ${esc(BUDGET_BY_ID[id].n)}</span>`).join(' · ')}</div></div><span class="tag ${ok === MAN.dem[p].length ? 'g' : ok ? 'w' : 'b'}">${ok}/${MAN.dem[p].length}</span></div>`;
  }).join('')}</div><div class="tiny muted mt">Se accontenti un ministro il suo partito è più soddisfatto; se lo ignori, se lo ricorda.</div></div>`;
}
function manLawRow(l) {
  const ord = tuneOrder(l), now = G.laws[l.id], cur = MAN.laws[l.id] !== undefined ? MAN.laws[l.id] : now;
  const pos = ord.findIndex(x => x.i === cur), np = ord.findIndex(x => x.i === now), dc = (l.opts[cur].costo || 0) - (l.opts[now].costo || 0);
  const go = d => ord[pos + d] ? ord[pos + d].i : cur;
  return `<div class="card tight ${cur !== now ? 'tuned' : ''}"><div class="row between"><b class="small">${icon(LAW_CATS[l.cat] || 'doc', 14)} ${esc(l.nome)}</b>${Math.abs(dc) > 0.05 ? `<span class="tag ${dc > 0 ? 'b' : 'g'}">${dc > 0 ? '+' : ''}${fmt1(dc)} mld</span>` : ''}</div>
    <div class="tune-val ${cur !== now ? 'gold' : ''}" id="mv-${l.id}">${esc(l.opts[cur].t)}</div>
    <div class="tune-rail"><button class="tune-arr" ${pos <= 0 ? 'disabled' : ''} onclick="setManLaw('${l.id}',${go(-1)})">‹</button><div class="tr-in"><input type="range" min="0" max="${ord.length - 1}" step="1" value="${pos}" oninput="manPreview('${l.id}',+this.value)" onchange="setManLaw('${l.id}',tuneOrder(getLaw('${l.id}'))[+this.value].i)"><i class="now" style="left:calc(${np / Math.max(1, ord.length - 1)} * (100% - 26px) + 13px)"></i></div><button class="tune-arr" ${pos >= ord.length - 1 ? 'disabled' : ''} onclick="setManLaw('${l.id}',${go(1)})">›</button></div>
    <div class="tiny dim">oggi: ${esc(l.opts[now].t)}</div></div>`;
}
function manPreview(id, pos) { const el = document.getElementById('mv-' + id), o = tuneOrder(getLaw(id))[pos]; if (el && o) el.textContent = o.o.t; }

// ---------- 23: trattativa a Bruxelles e fondi europei ----------
let BRX = null;
function openBrussels() {
  const m = monthOf(G.week);
  if (!(m >= 8 && m <= 10) || (G.econ.flex || 0) >= 0.6) {
    if (!spendPC(3)) return toast('Capitale politico insufficiente', 'bad');
    markUsed('bruxelles'); applyFx({ grp: { ue: 8 }, stress: 3 }); renderGame();
    return resultSheet('eu', 'Missione a Bruxelles', `Rapporti migliori con la Commissione europea. ${(G.econ.flex || 0) >= 0.6 ? 'Hai già ottenuto tutta la flessibilità possibile.' : 'Da settembre a novembre potrai trattare sulla flessibilità per la manovra.'}`);
  }
  if (!spendPC(3)) return toast('Capitale politico insufficiente', 'bad');
  markUsed('bruxelles');
  BRX = { i: 0, pat: clamp(55 + (G.groups.ue || 0) / 3, 20, 90), got: 0, log: [] };
  openSheet('', { full: true, locked: true }); renderBrussels();
}
const BRX_MOVES = [
  { k: 'chiedi', t: 'Chiedere più flessibilità', d: 'Più margine sul deficit, ma la pazienza cala', got: 0.2, pat: -14 },
  { k: 'riforme', t: 'Offrire riforme in cambio', d: 'Ti impegni su giustizia civile e concorrenza', got: 0.15, pat: 6, fx: { grp: { ue: 3 } } },
  { k: 'alleati', t: 'Cercare la sponda di Francia e Spagna', d: 'Funziona se hai buoni rapporti in Europa', got: 0.1, pat: 2 },
  { k: 'veto', t: 'Minacciare il veto sul bilancio UE', d: 'Può sbloccare tutto o far saltare il tavolo', got: 0.25, pat: -25, fx: { grp: { ue: -6 } } },
];
function renderBrussels() {
  const b = BRX;
  let h = `<div class="center">${medal('eu', 62)}<div class="tiny gold mt" style="font-weight:800;letter-spacing:.1em">BERLAYMONT · BRUXELLES</div><h2 class="mt">Trattativa sui conti</h2><div class="small muted">${esc(INSTITUTIONS.commissione)} e ${esc(INSTITUTIONS.commEco)}</div></div>
    <div class="card hero mt"><div class="row between small"><b>Flessibilità ottenuta</b><b class="good">+${fmt1(b.got)}%</b></div><div class="row between small mt"><span>Pazienza della Commissione</span><b>${Math.round(b.pat)}</b></div><div class="bar mt"><i style="width:${b.pat}%;--c:${b.pat > 50 ? 'var(--good)' : b.pat > 25 ? 'var(--warn)' : 'var(--bad)'}"></i></div></div>
    ${b.log.map(x => `<div class="bub me">${esc(x.t)}</div><div class="bub">${esc(x.r)}</div>`).join('')}`;
  if (b.i < 3 && b.pat > 0) h += sec(`Mossa ${b.i + 1} di 3`) + BRX_MOVES.map(m => `<button class="choice" onclick="brxMove('${m.k}')"><div class="t">${esc(m.t)}</div><div class="small muted">${esc(m.d)}</div></button>`).join('');
  else h += `<button class="btn gold block mt2" onclick="brxEnd()">Chiudi la trattativa</button>`;
  replaceSheet(h);
}
function brxMove(k) {
  const b = BRX, m = BRX_MOVES.find(x => x.k === k);
  const odds = clamp(b.pat / 100 + (k === 'alleati' ? (G.groups.ue || 0) / 150 : 0) + (k === 'veto' ? -0.15 : 0), 0.1, 0.92);
  let r;
  if (chance(odds)) { b.got += m.got; r = { chiedi: '«Possiamo venirvi incontro, ma è l’ultima volta.»', riforme: '«Le riforme sono la strada giusta: concesso.»', alleati: '«Parigi e Madrid sono con voi: ne terremo conto.»', veto: '«Va bene, va bene. Troviamo un accordo.»' }[k]; }
  else r = { chiedi: '«Le regole valgono per tutti.»', riforme: '«Promesse già sentite.»', alleati: '«Gli altri governi non vi seguono.»', veto: '«Non si tratta sotto ricatto.» Gelo nella sala.' }[k];
  b.pat = clamp(b.pat + m.pat, 0, 100); if (m.fx) applyFx(m.fx);
  b.log.push({ t: m.t, r }); b.i++; vib(10); renderBrussels();
}
function brxEnd() {
  const got = Math.min(BRX.got, 0.6 - (G.econ.flex || 0));
  if (got > 0) { G.econ.flex = (G.econ.flex || 0) + got; addNews(`${INSTITUTIONS.commissione} concede all’Italia flessibilità: il deficit della manovra potrà arrivare al ${fmt1(3 + G.econ.flex)}%.`, 'good'); }
  applyFx({ stress: 3 }); BRX = null; closeSheet(); renderGame();
  resultSheet('eu', got > 0 ? 'Flessibilità ottenuta' : 'Niente da fare', got > 0 ? `Il limite di deficit per la prossima manovra sale al ${fmt1(3 + G.econ.flex)}%.` : 'La Commissione non concede margini: la manovra dovrà restare al 3%.');
}
const EU_TARGETS = [
  { t: 'Una riforma della giustizia', cats: ['Giustizia'] }, { t: 'Una legge su ambiente o energia', cats: ['Ambiente', 'Energia'] },
  { t: 'Una riforma di scuola o università', cats: ['Scuola', 'Università'] }, { t: 'Una legge per le infrastrutture', cats: ['Infrastrutture', 'Territorio'] },
  { t: 'Una riforma del lavoro', cats: ['Lavoro', 'Welfare'] }, { t: 'Deficit sotto il 3% alla scadenza', def: true },
];
function euFundsTick() {
  if (!isPremier()) { G.euf = null; return; }
  if (!G.euf) { const t = EU_TARGETS.slice().sort(() => Math.random() - 0.5).slice(0, 3); G.euf = { n: (G.eufN || 0) + 1, start: G.week, due: G.week + 26, t: t.map(x => ({ t: x.t, cats: x.cats, def: x.def })) }; G.eufN = G.euf.n; return; }
  if (G.week < G.euf.due) return;
  const ok = euDone(G.euf), n = ok.filter(Boolean).length;
  const bn = n * 0.25; if (n === 3) G.flags.eufFull = true;
  G.econ.oneOff += bn; G.econ.shockPil += n * 0.04;
  addNews(n === 3 ? `Bruxelles sblocca per intero la ${G.euf.n}ª rata dei fondi europei: miliardi per investimenti.` : n ? `Bruxelles sblocca solo in parte la ${G.euf.n}ª rata dei fondi europei (${n} obiettivi su 3).` : `Bruxelles congela la ${G.euf.n}ª rata dei fondi europei: obiettivi mancati.`, n >= 2 ? 'good' : 'bad');
  if (n === 0) { G.gov.popBank -= 1.5; G.groups.ue = clamp(G.groups.ue - 6, -100, 100); }
  G.euf = null;
}
function euDone(f) { return f.t.map(x => x.def ? G.econ.deficit <= 3 : G.enacted.some(e => { const l = getLaw(e.id); return e.w >= f.start && l && x.cats.includes(l.cat); })); }
function euFundsHTML() {
  if (!G.euf || !isPremier()) return '';
  const d = euDone(G.euf);
  return sec('Fondi europei') + `<div class="card tight"><div class="row between small"><b>${icon('eu', 16)} ${G.euf.n}ª rata</b><span class="muted">scade il ${fmtDate(G.euf.due, true)}</span></div><div class="list mt">${G.euf.t.map((x, i) => `<div class="li"><span class="${d[i] ? 'good' : 'muted'}">${d[i] ? icon('check', 16) : icon('clock', 16)}</span><div class="grow small">${esc(x.t)}</div></div>`).join('')}</div><div class="tiny muted mt">Ogni obiettivo raggiunto sblocca miliardi per investimenti (PIL in su); se li manchi tutti, la rata viene congelata.</div></div>`;
}

// ---------- 24: correnti del partito ----------
const CORR_NAMES = ['Riformisti', 'Identitari', 'Liberali', 'Sociali', 'Moderati', 'Territori', 'Giovani', 'Popolari'];
function ensureCorrenti() {
  if (!isLeader()) return null;
  if (G.corr && G.corr.pid === myPid()) return G.corr;
  const pool = allPeople().filter(x => x.party === myPid() && !x.isPlayer && x.name !== G.player.name).slice(0, 3);
  const names = CORR_NAMES.slice().sort(() => Math.random() - 0.5);
  const L = pool.map((x, i) => ({ id: 'c' + i, n: names[i], capo: x.name, peso: 0, sat: 60 + irnd(-10, 10), ax: pick(['eco', 'soc', 'eu', 'imm']), dir: pick([-1, 1]) }));
  if (!L.length) return null;
  const w = L.map(() => rnd(15, 35)); const s = w.reduce((a, b) => a + b, 0) / 70; L.forEach((c, i) => c.peso = Math.round(w[i] / s));
  G.corr = { pid: myPid(), L }; return G.corr;
}
function correntiTick() {
  const C = ensureCorrenti(); if (!C) return;
  C.L.forEach(c => { c.sat = clamp(c.sat + (58 - c.sat) * 0.02 + gauss() * 0.8, 0, 100); });
  const low = C.L.find(c => c.sat < 18 && !c.warned);
  if (low) { low.warned = G.week; G.queue.push({ id: 'corrente_minaccia', ctx: { id: low.id } }); }
}
function openCorrenti() {
  const C = ensureCorrenti(); if (!C) return resultSheet('puzzle', 'Nessuna corrente', 'Il tuo partito è ancora troppo piccolo per avere correnti organizzate.');
  openSheet(`${head('Le correnti del partito', esc(myParty().name))}
    <p class="small muted">Ogni corrente ha un capo e un peso negli organi del partito. Se una corrente è scontenta ti vota contro, ti attacca in TV e alla fine può uscire dal partito.</p>
    ${C.L.map(c => `<div class="card tight"><div class="row">${portrait(c.capo, 44)}<div class="grow"><b class="small">${esc(c.n)}</b> <span class="tiny muted">${c.peso}% del partito</span><div class="tiny muted">guidata da ${esc(c.capo)} · vuole più ${esc(c.dir < 0 ? AXES[c.ax].l : AXES[c.ax].r).toLowerCase()}</div></div><span class="tag ${c.sat >= 55 ? 'g' : c.sat >= 30 ? 'w' : 'b'}">${fmt0(c.sat)}</span></div>
      <div class="row mt" style="gap:6px"><button class="btn sm grow" onclick="corrMeet('${c.id}')">${icon('cup', 14)} Incontra · ⚡1</button><button class="btn sm grow" onclick="corrGive('${c.id}')">${icon('star', 14)} Dai un incarico · ⚡2</button></div></div>`).join('')}`);
}
function corrMeet(id) { const c = G.corr.L.find(x => x.id === id); if (!spendPC(1)) return toast('Capitale politico insufficiente', 'bad'); c.sat = clamp(c.sat + 8 + G.player.car * 0.6, 0, 100); closeSheet(); openCorrenti(); toast(`${c.capo} è più disponibile`, 'good'); }
function corrGive(id) {
  const c = G.corr.L.find(x => x.id === id); if (!spendPC(2)) return toast('Capitale politico insufficiente', 'bad');
  c.sat = clamp(c.sat + 18, 0, 100); G.corr.L.filter(x => x !== c).forEach(x => x.sat = clamp(x.sat - 5, 0, 100));
  addNews(`${c.capo} (${c.n}) entra nella segreteria di ${myParty().short}.`, 'mio'); closeSheet(); openCorrenti();
}

// ---------- 27: inchieste a fasi ----------
// ---------- 29: direttori e fake news ----------
const DIRETTORI = [
  ['Corriere della Sera', 'Luciano Fontana', 1], ['la Repubblica', 'Mario Orfeo', -4], ['La Stampa', 'Andrea Malaguti', -2], ['Il Sole 24 Ore', 'Fabio Tamburini', 3],
  ['Il Giornale', 'Tommaso Cerno', 6], ['Libero', 'Mario Sechi', 7], ['La Verità', 'Maurizio Belpietro', 8], ['Il Fatto Quotidiano', 'Marco Travaglio', -6], ['Domani', 'Emiliano Fittipaldi', -6], ['Avvenire', 'Marco Girardo', -1],
];
function dirAttitude(d) { const a = myParty().ax, lean = ((a.eco || 0) + (a.soc || 0) + (a.imm || 0)) / 3; return Math.round(clamp(60 - Math.abs(lean - d[2]) * 8 + (G.groups.media || 0) / 4, 0, 100)); }
function openDirettori() {
  openSheet(`${head('I direttori dei giornali', 'Chi ti difende e chi ti attacca')}
    <div class="list">${DIRETTORI.map(d => { const v = dirAttitude(d); return `<div class="li">${portrait(d[1], 38)}<div class="grow"><b class="small">${esc(d[1])}</b><div class="tiny muted">${esc(d[0])}</div></div><span class="tag ${v >= 55 ? 'g' : v >= 35 ? '' : 'b'}">${v >= 55 ? 'ti difende' : v >= 35 ? 'neutrale' : 'ti attacca'}</span></div>`; }).join('')}</div>`);
}

// ---------- eventi ----------
const govIn = () => !!G.gov;
// l'esito della sentenza si decide una volta sola e resta nel contesto dell'evento
function sentOk(c) { if (c.ok === undefined) c.ok = chance(0.35 + G.player.integ * 0.07); return c.ok; }
const GOV_EVENTS = [
  { id: 'corrente_minaccia', for: 'leader', w: 0, chain: true, img: 'split', look: 'chat',
    title: c => { const x = G.corr && G.corr.L.find(y => y.id === c.id); return x ? `La corrente ${x.n} minaccia di uscire` : 'Una corrente minaccia di uscire'; },
    text: c => { const x = G.corr && G.corr.L.find(y => y.id === c.id); return x ? `${x.capo}, capo della corrente ${x.n} (${x.peso}% del partito), è stufo: «O cambia la linea o ce ne andiamo».` : 'Una corrente del partito è pronta a uscire.'; },
    choices: c => { const x = G.corr && G.corr.L.find(y => y.id === c.id); return [
      { t: 'Concedere: più spazio alla corrente', fx: { pc: -2 }, r: 'Rientra la minaccia, ma gli altri borbottano.', run: () => { if (x) { x.sat = 60; x.warned = 0; } } },
      { t: 'Tenere il punto: chi vuole se ne vada', fx: { cred: 2 }, r: '', run: () => { if (!x) return; if (chance(0.5)) { myParty().spinta -= 1.5 + x.peso / 15; const n = Math.round(myParty().seatsC * x.peso / 200); myParty().seatsC = Math.max(0, myParty().seatsC - n); addNews(`La corrente ${x.n} lascia ${myParty().short}: ${n} deputati passano al gruppo misto con ${x.capo}.`, 'bad'); G.corr.L = G.corr.L.filter(y => y !== x); } else { x.sat = 35; x.warned = 0; addNews(`${x.capo} resta in ${myParty().short}: «Per ora».`, 'parl'); } } },
    ]; } },
  { id: 'governatore', for: 'leader', w: 1.1, cool: 30, cond: () => Object.values(G.regions).some(r => r.gp === myPid()),
    prep: () => { const ids = Object.keys(G.regions).filter(k => G.regions[k].gp === myPid()); return ids.length ? { r: pick(ids), helps: chance(0.55) } : null; }, img: 'map', look: 'call',
    title: c => { const r = REGIONS_DEF.find(x => x.id === c.r); return r ? (c.helps ? `Il presidente della ${r.n} ti dà una mano` : `Il presidente della ${r.n} ti sfida`) : 'Un presidente di regione ti chiama'; },
    text: c => { const r = REGIONS_DEF.find(x => x.id === c.r), g = c.r && G.regions[c.r] ? G.regions[c.r].gov : 'Il governatore'; return c.helps ? `${g} mette a disposizione la sua macchina sul territorio${r ? ' in ' + r.n : ''}: comitati, sindaci, eventi.` : `${g} critica la linea del partito in un’intervista: vuole più fondi e più autonomia per la sua regione, e si propone come alternativa a te.`; },
    choices: c => c.helps ? [
      { t: 'Accettare e fare campagna insieme', fx: { fama: 2 }, r: 'Il partito cresce in quella regione.', run: () => { if (c.r) G.myReg[c.r] = (G.myReg[c.r] || 1) + 0.25; } },
      { t: 'Ringraziare, ma restare autonomi', fx: { cred: 1 }, r: 'Rapporti cordiali.' },
    ] : [
      { t: 'Promettere più fondi alla sua regione', fx: { funds: -50 }, r: 'Rientra la sfida.', run: () => { if (c.r) G.myReg[c.r] = (G.myReg[c.r] || 1) + 0.1; } },
      { t: 'Rispondere duro: la linea la decido io', fx: { cred: 2, seguito: -3 }, r: 'Tieni il punto, ma il partito si divide.' },
    ] },
  { id: 'autonomia_trattativa', for: 'premier', w: 1, cool: 52, cond: govIn, img: 'map', look: 'paper', title: 'Le regioni del Nord chiedono più autonomia',
    text: 'Lombardia, Veneto ed Emilia-Romagna chiedono le prime materie dell’autonomia differenziata: sanità, scuola e trasporti, con i fondi relativi. Il Sud teme di restare indietro.',
    choices: () => [
      { t: 'Concedere tutte le materie', fx: { satP: { LEGA: 8 }, grp: { sind: -4 }, oneOff: 0.3 }, r: 'Il Nord festeggia, il Sud protesta.', run: () => { ['CAM', 'PUG', 'SIC', 'CAL'].forEach(r => { if (G.myReg[r]) G.myReg[r] *= 0.97; }); } },
      { t: 'Solo alcune materie, con un fondo per il Sud', fx: { satP: { LEGA: 3 }, oneOff: 0.4 }, r: 'Un compromesso che costa qualcosa a tutti.' },
      { t: 'Rinviare: prima i livelli essenziali delle prestazioni', fx: { satP: { LEGA: -6 }, grp: { quir: 2 } }, r: 'La Lega è furiosa.' },
    ] },
  { id: 'sciopero_generale', for: 'premier', w: 1.4, cool: 40, cond: () => govIn() && (G.groups.sind || 0) < -25, img: 'mega', look: 'tv', title: 'Sciopero generale',
    text: () => `${INSTITUTIONS.cgil} proclama lo sciopero generale contro il governo: treni fermi, scuole chiuse, piazze piene. «Il Paese reale vi chiede di cambiare strada.»`,
    choices: () => [
      { t: 'Convocare subito i sindacati a Palazzo Chigi', fx: { pc: -2, grp: { sind: 8 } }, r: 'Si apre un tavolo: lo sciopero resta, ma i toni si abbassano.' },
      { t: 'Precettare i trasporti', fx: { grp: { sind: -8 }, appr: 0.3 }, r: 'I treni partono, ma lo scontro si inasprisce.' },
      { t: 'Ignorare: «È uno sciopero politico»', fx: { appr: -0.6, pil: -0.02 }, r: 'Il Paese si ferma per un giorno.' },
    ] },
  { id: 'avviso_garanzia', for: 'all', w: 0.6, cool: 120, cond: () => G.player.integ < 7 && G.player.fama > 30, img: 'gavel', look: 'paper', title: 'Avviso di garanzia',
    text: () => `La procura di Roma ti iscrive nel registro degli indagati per finanziamento illecito. È un atto dovuto, dicono gli avvocati, ma i giornali aprono con il tuo nome.`,
    choices: () => [
      { t: 'Autosospendermi dagli incarichi', fx: { cred: 4, fama: -2 }, r: 'Un gesto apprezzato, ma l’inchiesta va avanti.', later: { w: 10, id: 'rinvio_giudizio' } },
      { t: 'Difendermi: «Ho fiducia nella magistratura»', fx: { cred: 1 }, r: 'Toni istituzionali.', later: { w: 10, id: 'rinvio_giudizio' } },
      { t: 'Attaccare i giudici: «Giustizia a orologeria»', fx: { grp: { mag: -10 }, my: 0.5, cred: -3 }, r: 'Il tuo elettorato si compatta, i magistrati no.', later: { w: 10, id: 'rinvio_giudizio' } },
    ] },
  { id: 'rinvio_giudizio', for: 'all', w: 0, chain: true, img: 'gavel', look: 'paper', title: 'L’inchiesta va avanti',
    text: 'Il giudice dell’udienza preliminare decide sul tuo caso: rinvio a giudizio. Il processo comincerà tra qualche mese.',
    choices: () => [
      { t: 'Chiedere il rito abbreviato: chiudiamo in fretta', fx: { stress: 6 }, r: 'Tempi più brevi.', later: { w: 12, id: 'sentenza' } },
      { t: 'Andare a processo per dimostrare l’innocenza', fx: { cred: 2, stress: 10 }, r: 'Sarà lunga.', later: { w: 20, id: 'sentenza' } },
    ] },
  { id: 'sentenza', for: 'all', w: 0, chain: true, img: 'scales', look: 'paper', title: c => sentOk(c) ? 'Assolto: il fatto non sussiste' : 'Condannato in primo grado',
    text: c => sentOk(c) ? 'Il tribunale ti assolve con formula piena. Chi ti aveva attaccato ora tace.' : 'Il tribunale ti condanna in primo grado. Ci sarà l’appello, ma il colpo è pesante.',
    choices: c => sentOk(c) ? [{ t: '«Avevo ragione io»', fx: { fama: 4, cred: 5, my: 1 }, r: 'Ne esci rafforzato.', run: () => { G.flags.assolto = true; } }] : [
      { t: 'Ricorrere in appello e restare al mio posto', fx: { cred: -6, my: -1.5 }, r: 'Resti, ma il consenso cala.' },
      { t: 'Fare un passo indietro', fx: { cred: 4, fama: -6, stress: -10 }, r: 'Un gesto di responsabilità.', run: () => { if (G.player.minister && G.gov) { replaceMinister(G.player.minister, myPid()); G.player.minister = null; } } },
    ] },
  { id: 'editoriale', for: 'all', w: 1.2, cool: 20, cond: () => G.player.fama > 25, prep: () => { const d = pick(DIRETTORI); return { i: DIRETTORI.indexOf(d), pro: dirAttitude(d) >= 50 }; }, img: 'news', look: 'paper',
    title: c => { const d = DIRETTORI[c.i] || DIRETTORI[0]; return c.pro ? `${d[1]} ti difende in prima pagina` : `${d[1]} ti attacca in prima pagina`; },
    text: c => { const d = DIRETTORI[c.i] || DIRETTORI[0]; return c.pro ? `L’editoriale del direttore di ${d[0]} prende le tue parti: «Finalmente qualcuno che dice le cose come stanno».` : `L’editoriale del direttore di ${d[0]} è durissimo: «Incoerente e inadeguato».`; },
    choices: c => c.pro ? [{ t: 'Ringraziare pubblicamente', fx: { fama: 2, grp: { media: 2 } }, r: 'Un alleato in più nei giornali.' }, { t: 'Ignorare: nessun giornale è amico', fx: { cred: 1 }, r: 'Mantieni le distanze.' }]
      : [{ t: 'Rispondere con una lettera al giornale', fx: { fama: 2 }, r: 'Il dibattito continua.' }, { t: 'Attaccarlo sui social', fx: { my: 0.4, grp: { media: -4 } }, r: 'I tuoi applaudono, i giornalisti si compattano contro di te.' }, { t: 'Lasciar perdere', fx: { my: -0.3 }, r: 'Passa in fretta.' }] },
  { id: 'fake_news', for: 'all', w: 1, cool: 30, cond: () => G.player.fama > 30, img: 'phone', look: 'social', title: 'Una fake news su di te diventa virale',
    text: () => `Gira sui social una foto ritoccata di ${G.player.name} a una cena con un faccendiere. È falsa, ma ha già milioni di visualizzazioni.`,
    choices: () => [
      { t: 'Smentita ufficiale con le prove', fx: { cred: 2 }, r: 'La smentita gira meno della bufala, ma chi conta ti crede.' },
      { t: 'Querela e conferenza stampa', fx: { pc: -1, fama: 2 }, r: 'Ne parlano tutti, anche di chi l’ha messa in giro.' },
      { t: 'Risposta ironica con un video', fx: { fama: 3, my: 0.5 }, r: 'Il video fa più visualizzazioni della bufala.', run: () => { if (G.player.car < 6 && chance(0.4)) { myParty().spinta -= 1; addNews(`Il video ironico di ${G.player.name} non convince: polemiche.`, 'bad'); } } },
      { t: 'Ignorare', fx: { my: -0.8 }, r: 'La bufala resta in giro per giorni.' },
    ] },
];
GOV_EVENTS.forEach(e => { EVENTS.push(e); EVENT_BY_ID[e.id] = e; });

// ---------- azioni ----------
(function () {
  const b = ACTIONS.find(x => x.id === 'bruxelles'); if (b) { delete b.run; b.cost = 3; b.d = 'Incontri con la Commissione. Da settembre a novembre tratti la flessibilità sui conti in tre mosse.'; b.custom = () => openBrussels(); }
  ACTIONS.splice(ACTIONS.findIndex(x => x.id === 'riposo'), 0,
    { id: 'tavolo', n: 'Tavolo con le parti sociali', ico: 'hands', cost: 2, show: () => isPremier(), d: 'Sindacati e imprese a Palazzo Chigi: scegli la proposta su cui trovare l’accordo.', custom: () => openTavolo() },
    { id: 'correnti', n: 'Le correnti del partito', ico: 'puzzle', cost: 0, show: () => isLeader() && myParty().seatsC + myParty().seatsS > 10, d: 'Chi comanda nel tuo partito, cosa vuole e quanto è contento.', custom: () => openCorrenti() });
  ROUTINE_NO.push('tavolo', 'correnti', 'bruxelles');
})();
function openTavolo() {
  if (usedThisWeek('tavolo')) return toast('Il tavolo si è già riunito questa settimana', 'bad');
  openSheet(`${head('Tavolo con le parti sociali', 'Palazzo Chigi, Sala Verde')}
    <div class="row wrap" style="gap:6px">${[INSTITUTIONS.cgil + ' (CGIL)', INSTITUTIONS.cisl + ' (CISL)', INSTITUTIONS.uil + ' (UIL)', INSTITUTIONS.confindustria + ' (Confindustria)'].map(n => `<span class="tag">${esc(n)}</span>`).join('')}</div>
    <p class="small muted mt">Su cosa cerchi l’accordo?</p>
    ${[['cuneo', 'Taglio del cuneo fiscale', 'Più soldi in busta paga: piace a tutti, ma costa', { grp: { sind: 8, conf: 6 }, oneOff: 0.4, appr: 0.4 }],
       ['salario', 'Salario minimo per legge', 'I sindacati esultano, le imprese no', { grp: { sind: 12, conf: -10 }, appr: 0.3 }],
       ['produttivita', 'Contratti legati alla produttività', 'Le imprese ci stanno, la CGIL no', { grp: { conf: 10, sind: -6 }, pil: 0.02 }],
       ['sicurezza', 'Patto per la sicurezza sul lavoro', 'Accordo facile e apprezzato', { grp: { sind: 6, conf: 2, chiesa: 2 } }]].map(([k, t, d, fx]) => `<button class="choice" onclick='tavoloPick(${JSON.stringify(t)}, ${JSON.stringify(fx)})'><div class="t">${esc(t)}</div><div class="small muted">${esc(d)}</div>${fxChips(fx)}</button>`).join('')}`);
}
function tavoloPick(t, fx) {
  if (!spendPC(2)) return toast('Capitale politico insufficiente', 'bad');
  markUsed('tavolo'); applyFx(fx); closeSheet();
  addNews(`Accordo a Palazzo Chigi con le parti sociali: ${t.toLowerCase()}.`, 'gov'); renderGame();
  resultSheet('hands', 'Accordo raggiunto', `Firmato il protocollo: ${esc(t.toLowerCase())}.`);
}

// ---------- tick settimanale e pannelli ----------
const _storyTickGov = storyTick;
storyTick = function () { _storyTickGov(); try { euFundsTick(); correntiTick(); } catch (e) { console.error(e); } };
const _contiTabGov = contiTab;
contiTab = function () { return _contiTabGov() + euFundsHTML(); };
