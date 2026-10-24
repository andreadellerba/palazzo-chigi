// ============================================================
//  SCHERMATE DI GIOCO
// ============================================================
const SVG = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const TABS = [
  { id: 'home', n: 'Palazzo', c: '#ffd60a', svg: SVG('<path d="M3 9l9-5 9 5"/><path d="M5.5 10.5v7M9.8 10.5v7M14.2 10.5v7M18.5 10.5v7"/><path d="M3 20.5h18"/>') },
  { id: 'leggi', n: 'Leggi', c: '#fb923c', svg: SVG('<path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>') },
  { id: 'aula', n: 'Aula', c: '#38bdf8', svg: SVG('<path d="M3 18a9 9 0 0 1 18 0"/><path d="M7.5 18a4.5 4.5 0 0 1 9 0"/><path d="M2 21h20"/>') },
  { id: 'italia', n: 'Italia', c: '#22c55e', svg: SVG('<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>') },
  { id: 'partiti', n: 'Partiti', c: '#a78bfa', svg: SVG('<path d="M5 21V12"/><path d="M12 21V5"/><path d="M19 21v-6"/>') },
  { id: 'conti', n: 'Conti', c: '#f472b6', svg: SVG('<path d="M17 6.5a7 7 0 1 0 0 11"/><path d="M4 10h9M4 14h9"/>') },
];
function goTab(t) { const c = $('.content'); if (c) UI.scroll[UI.tab] = c.scrollTop; UI.tab = t; vib(8); renderGame(); }
function weeksLeft(w) { const d = w - G.week; return d <= 0 ? 'oggi' : d === 1 ? 'tra 1 settimana' : d < 9 ? `tra ${d} settimane` : `tra ${Math.round(d / 4.35)} mesi`; }

function renderGame() {
  const c = $('.content'); if (c) UI.scroll[UI.tab] = c.scrollTop;
  $('#app').dataset.tab = UI.tab;
  $('#app').innerHTML = `${topbar()}<div class="tricolore"></div>${tickerHTML()}<div class="content" id="content">${tabContent()}</div>${fabHTML()}${navHTML()}`;
  const n = $('.content'); if (n) n.scrollTop = UI.scroll[UI.tab] || 0;
  postRender();
}
function refresh() { renderGame(); }
function topbar() {
  const p = G.player, mp = myParty();
  const old = G.hist.polls.length > 5 ? G.hist.polls[G.hist.polls.length - 5].p[myPid()] : mp.poll;
  const d = mp.poll - (old || mp.poll);
  const chips = [];
  const st = (c, html, on) => `<span class="stat" style="--sc:${c}" ${on ? `onclick="${on}"` : ''}>${html}</span>`;
  chips.push(st(mp.color, `${esc(mp.short)} <b>${fmt1(mp.poll)}%</b> <span class="${d >= 0 ? 'good' : 'bad'}">${d >= 0 ? '▲' : '▼'}${fmt1(Math.abs(d))}</span>`));
  if (!isLeader()) chips.push(st(relColorHex(p.rap), `Con ${esc(firstName(myParty().leader))} <b style="color:${relColor(p.rap)}">${p.rap > 0 ? '+' : ''}${fmt0(p.rap)}</b>`, "toast('Rapporto con il leader del tuo partito: da −100 a +100')"));
  chips.push(st('#22d3ee', `Notorietà ${esc(mp.short)} <b>${fmt0(partyNoto(myPid()))}%</b>`, "toast('Percentuale di italiani che conosce il tuo partito')"));
  if (G.gov) chips.push(st('#ffd60a', `Governo <b style="color:${pctColor(G.gov.approval * 1.4)}">${fmt0(G.gov.approval)}%</b>`));
  chips.push(st('#f472b6', `Spread <b class="${G.econ.spread > 200 ? 'bad' : ''}">${fmt0(G.econ.spread)}</b>`));
  chips.push(st('#a78bfa', `Fama <b>${fmt0(p.fama)}</b>`, "toast('La tua notorietà personale (0-100)')"));
  chips.push(st('#22c55e', `Fondi <b>${euro(G.funds)}</b>`));
  chips.push(st('#fb923c', `Stress <b class="${p.stress > 70 ? 'bad' : ''}">${fmt0(p.stress)}</b>`));
  return `<div class="topbar"><div class="row between"><div class="grow"><div class="date"><span class="flip" key="${G.week}">${fmtDate(G.week)}</span></div><div class="role ellipsis">${esc(roleLabel())}</div></div>
    <span class="pill pc" onclick="toast('Capitale politico: si ricarica ogni settimana (+${pcIncome()})')">⚡ ${G.pc}/${pcMax()}</span>${(() => { const n = urgentCount(); return `<button class="iconbtn bell" onclick="openNotifications()">🔔${n ? `<span class="bdg">${n}</span>` : ""}</button>`; })()}<button class="iconbtn" onclick="openMenu()">☰</button></div>
    <div class="chips">${chips.join('')}</div></div>`;
}
function tickerHTML() {
  const items = G.news.slice(0, 8).map(n => `<span>• ${esc(n.t)}</span>`).join('');
  return `<div class="ticker"><span class="lbl">ULTIM’ORA</span><div style="overflow:hidden;flex:1"><div class="run">${items}</div></div></div>`;
}
function fabHTML() {
  if (G.phase === 'fine') return `<button class="fab form" onclick="showSplash()">Partita conclusa · Menu</button>`;
  if (G.phase === 'formazione') return `<button class="fab form" onclick="openFormation()">🏛 ${G.formation && G.formation.step === 'risultati' ? 'Risultati elettorali' : 'Consultazioni al Quirinale'}</button>`;
  if (G.queue.length) return `<button class="fab alert" onclick="processQueue()">⚠️ ${G.queue.length} ${G.queue.length > 1 ? 'decisioni' : 'decisione'} in attesa</button>`;
  return `<button class="fab" onclick="nextWeek()">Settimana successiva <span style="opacity:.75;font-weight:600">· ${fmtDate(G.week + 1, true)}</span> ▸</button>`;
}
function navHTML() {
  const live = typeof pendingVoteIds === 'function' ? pendingVoteIds().length : 0;
  return `<nav class="tabs-mobile2"><div class="tbar">${TABS.map(t => `<button type="button" class="tbtn ${UI.tab === t.id ? 'active' : ''}" style="--tc:${t.c}" onclick="goTab('${t.id}')" title="${t.n}">${t.svg}<span class="tl">${t.n}</span>${t.id === 'aula' && live && UI.tab !== 'aula' ? `<span class="badge">${live}</span>` : ''}</button>`).join('')}</div></nav>`;
}
function tabContent() {
  switch (UI.tab) {
    case 'home': return homeTab(); case 'leggi': return leggiTab(); case 'aula': return aulaTab();
    case 'italia': return italiaTab(); case 'partiti': return partitiTab(); case 'conti': return contiTab();
  }
  return '';
}
function postRender() {
  if (UI.tab === 'aula') { const s = $('#hemi-main'); if (s) setTimeout(() => fillHemi(s), 30); }
}

// ============================================================
//  PALAZZO (home)
// ============================================================
function homeTab() {
  const p = G.player, mp = myParty(), g = G.gov;
  let h = '';
  // eroe
  h += tipsHTML();
  h += `<div class="card hero" style="--pc:${mp.color}"><div class="row">${sym(myPid(), true)}<div class="grow"><div class="small gold" style="font-weight:700">${esc(roleLabel())}</div><h2 class="ellipsis">${esc(p.name)}</h2><div class="small muted">${esc(mp.name)} · ${fmt1(mp.poll)}% · ${mp.seatsC} dep. · ${mp.seatsS} sen.</div></div></div>
    <div class="grid2 mt"><div><div class="tiny muted">Notorietà del partito</div><b>${fmt0(partyNoto(myPid()))}%</b> <span class="tiny muted">degli italiani lo conosce</span>${barH(partyNoto(myPid()), 100, '#22d3ee', true)}</div>
    ${isLeader() ? `<div><div class="tiny muted">La tua fama personale</div><b>${fmt0(p.fama)}</b><span class="tiny muted">/100</span>${barH(p.fama, 100, '#a78bfa', true)}</div>` : `<div><div class="tiny muted">Rapporto con ${esc(myParty().leader)}</div><b style="color:${relColor(p.rap)}">${p.rap > 0 ? '+' : ''}${fmt0(p.rap)} · ${relLabel(p.rap)}</b>${barH(p.rap + 100, 200, relColor(p.rap), true)}</div>`}</div>`;
  if (g) {
    const gs = govSeats('C'), gss = govSeats('S');
    h += `<div class="mt" style="border-top:1px solid var(--line);padding-top:10px"><div class="row between"><b>${esc(g.name)}${g.tecnico ? ' (tecnico)' : ''}</b><span class="small muted">dal ${fmtDate(g.start, true)}</span></div>
      <div class="row wrap mt" style="gap:4px">${g.parties.map(partyChip).join('')}</div>
      <div class="grid2 mt"><div><div class="tiny muted">Consenso del governo</div><b style="font-size:20px;color:${pctColor(g.approval * 1.4)}">${fmt0(g.approval)}%</b>${barH(g.approval, 100, pctColor(g.approval * 1.4), true)}</div>
      <div><div class="tiny muted">Maggioranza</div><b>${gs}</b><span class="small muted">/${totalSeats('C')} Camera</span><br><b>${gss}</b><span class="small muted">/${totalSeats('S')} Senato</span></div></div></div>`;
  }
  h += `</div>`;
  // da fare ora e azioni consigliate
  h += todoHTML();
  h += recHTML();
  // scadenze
  const dl = [];
  if (G.cal.election > G.week) dl.push({ w: G.cal.election, t: '🗳 Elezioni politiche', s: fmtDate(G.cal.election) });
  const nextReg = Object.entries(G.regions).sort((a, b) => a[1].next - b[1].next)[0];
  if (nextReg) dl.push({ w: nextReg[1].next, t: `🗺 Regionali in ${regionName(nextReg[0])}`, s: fmtDate(nextReg[1].next) });
  if (G.cal.quirinale > G.week) dl.push({ w: G.cal.quirinale, t: '🏛 Elezione del Presidente della Repubblica', s: fmtDate(G.cal.quirinale) });
  const y = yearOf(G.week); const mw = weekOf(`${monthOf(G.week) > 9 ? y + 1 : y}-10-10`); dl.push({ w: mw, t: '💶 Manovra di bilancio', s: 'metà ottobre' });
  G.referendums.filter(r => !r.done).forEach(r => dl.push({ w: r.w, t: `🗳 Referendum: ${getLaw(r.lawId).nome}`, s: fmtDate(r.w) }));
  dl.sort((a, b) => a.w - b.w);
  h += `<div class="sec"><h4>Prossime scadenze</h4></div><div class="card tight"><div class="list">${dl.slice(0, 4).map(x => `<div class="li"><div class="grow"><b class="small">${x.t}</b><div class="tiny muted">${x.s}</div></div><span class="tag ${x.w - G.week < 6 ? 'w' : ''}">${weeksLeft(x.w)}</span></div>`).join('')}</div></div>`;
  // agenda
  const acts = availableActions();
  h += `<div class="sec"><h4>Agenda della settimana</h4><span class="small muted">⚡ ${G.pc} disponibili</span></div><div class="tiny muted" style="margin:-4px 2px 8px">Ogni azione si può fare una volta a settimana.</div><div class="actions">${acts.map(a => `<button class="act ${a.ok ? '' : 'off'} ${a.done ? 'done' : ''}" style="--ac:${a.ac}" onclick="openAction('${a.id}')"><span class="c">${a.cost ? '⚡' + a.cost : ''}</span><span class="i">${a.ico}</span>${esc(a.n)}</button>`).join('')}</div>`;
  // alleati (premier)
  if (isPremier() && g.parties.length > 1) {
    h += `<div class="sec"><h4>Umore degli alleati</h4></div><div class="card">${g.parties.filter(x => x !== myPid()).map(x => `<div class="row" style="margin:6px 0">${partyChip(x)}<span class="small grow ellipsis">${esc(P(x).leader)}</span><div style="width:110px">${barH(g.sat[x], 100, pctColor(g.sat[x]))}</div><b class="small" style="width:34px;text-align:right">${fmt0(g.sat[x])}</b></div>`).join('')}</div>`;
  }
  // carriera
  if (!isLeader()) {
    h += `<div class="sec"><h4>La tua carriera</h4></div><div class="card"><div class="row between"><b>${RANKS[p.rank].n}</b><span class="tag o">${p.rank + 1}/8</span></div><div class="progress mt">${RANKS.map((r, i) => `<i class="${i < p.rank ? 'd' : i === p.rank ? 'c' : ''}"></i>`).join('')}</div>
      <div class="grid3 mt"><div class="kpi"><div class="l">Fama</div><div class="v">${fmt0(p.fama)}</div></div><div class="kpi"><div class="l">Seguito</div><div class="v">${fmt0(p.seguito)}%</div></div><div class="kpi"><div class="l">Col leader</div><div class="v" style="color:${relColor(p.rap)}">${p.rap > 0 ? '+' : ''}${fmt0(p.rap)}</div></div></div>
      <div class="small muted mt">${careerHint()}</div></div>`;
  }
  // notizie
  h += `<div class="sec"><h4>Notizie</h4><button class="small gold" onclick="openNews()">Tutte ›</button></div><div class="card tight"><div class="list">${G.news.slice(0, 6).map(newsRow).join('')}</div></div>`;
  return h;
}
function newsRow(n) { return `<div class="news-item"><span class="w">${fmtDate(n.w, true).replace(/ \d{4}$/, '')}</span><span class="nk-${n.k}">${esc(n.t)}</span></div>`; }
function careerHint() {
  const p = G.player;
  const next = { 0: 'Per diventare consigliere comunale: fatti conoscere sul territorio (comunali in primavera).', 1: 'Per il Consiglio regionale: candidati alle regionali della tua regione o cresci di fama e seguito.', 2: 'Per entrare in Parlamento: alle politiche chiedi una candidatura (servono fama e un buon rapporto col leader).', 3: 'Per la segreteria nazionale: fama 28+ e rapporto col leader 30+.', 4: 'Capogruppo o sottosegretario: fama 38+, rapporto 40+, essere parlamentare.', 5: 'Ministro o vicesegretario: fama 50+, rapporto 45+.', 6: 'Per guidare il partito: sfida il leader al congresso (seguito 30%+, fama 35+), oppure fonda il tuo partito.' };
  return next[p.rank] || '';
}
function alertsList() {
  const out = [];
  if (G.flags.manovraDue && isPremier()) out.push({ i: '💶', t: `<b>Devi presentare la manovra ${G.flags.manovraDue}</b> entro metà ottobre.`, on: `openManovra(${G.flags.manovraDue})` });
  G.bills.filter(b => !b.dead && b.proposer === 'GOV' && isPremier() && b.stages[b.stage] && b.stages[b.stage].k === 'aula').forEach(b => {
    const v = predictVote(b); if (!v.passed) out.push({ i: '⚠️', t: `«${esc(billName(b))}» rischia di essere bocciato in aula. Valuta la fiducia.`, on: `goTab('aula')` });
  });
  G.bills.filter(b => !b.dead && b.type === 'dl' && isPremier() && b.proposer === 'GOV' && b.deadline - G.week <= 3).forEach(b => out.push({ i: '⏳', t: `Il decreto «${esc(billName(b))}» decade ${weeksLeft(b.deadline)}.` }));
  if (isPremier()) G.gov.parties.forEach(p => { if (p !== myPid() && G.gov.sat[p] < 25) out.push({ i: '🔥', t: `${esc(P(p).leader)} (${esc(P(p).short)}) è molto scontento. Rischio crisi.`, on: `openAction('vertice')` }); });
  if (isLeader() && G.cal.election - G.week < 30 && G.cal.election > G.week && !G.program) out.push({ i: '📋', t: 'Non hai ancora presentato il <b>programma elettorale</b>.', on: 'openProgram()' });
  if (isLeader() && G.cal.election - G.week < 26 && G.cal.election - G.week > 6 && !coalitionOf(myPid())) out.push({ i: '🤝', t: 'Corri da solo: valuta un’alleanza prima del deposito delle liste.', on: "UI.partiti='alleanze';goTab('partiti')" });
  if (G.player.stress > 75) out.push({ i: '😮‍💨', t: 'Sei molto stressato: rischi errori e problemi di salute.' });
  const myLive = G.bills.filter(b => !b.dead && isLeader() && b.proposer !== 'PLAYER' && b.stages[b.stage] && b.stages[b.stage].k === 'aula' && seatsOf(myPid(), b.stages[b.stage].h) > 0 && !G.myVotes[b.id]);
  if (myLive.length) out.push({ i: '🗳', t: `${myLive.length} ${myLive.length > 1 ? 'provvedimenti vanno' : 'provvedimento va'} al voto: decidi come vota il tuo gruppo.`, on: "goTab('aula')" });
  return out;
}

// ============================================================
//  LEGGI
// ============================================================
function leggiTab() {
  const cats = ['Tutte'].concat(Object.keys(LAW_CATS).filter(c => allLaws().some(l => l.cat === c)));
  let h = `<div class="row"><input id="lawq" placeholder="🔍 Cerca una legge (es. pensioni, cittadinanza)" value="${esc(UI.lawQ)}" oninput="UI.lawQ=this.value;$('#lawlist').innerHTML=lawListHTML()"></div>
    <div class="scrollx mt">${cats.map(c => `<button class="fchip ${UI.lawCat === c ? 'on' : ''}" onclick="UI.lawCat='${c}';renderGame()">${LAW_CATS[c] || '📚'} ${c}</button>`).join('')}</div>
    <div class="scrollx mt"><span class="tiny muted" style="align-self:center;flex:none">Voglio migliorare:</span>${Object.keys(METRICS).map(m => `<button class="fchip ${UI.lawMetric === m ? 'on' : ''}" onclick="UI.lawMetric=UI.lawMetric==='${m}'?null:'${m}';renderGame()">${METRICS[m].ico} ${METRICS[m].n}</button>`).join('')}</div>`;
  if (!UI.howHidden) h += `<div class="card mt"><div class="row between"><h3>📜 Come si fa una legge</h3><button class="xbtn" onclick="UI.howHidden=1;renderGame()">✕</button></div><div class="howto mt">
    <div>Tocca una legge: vedi <b>com’è oggi</b> e le <b>riforme possibili</b>.</div>
    <div>Scegli la riforma e leggi <b>pro e contro</b>, chi è favorevole e la <b>previsione di voto</b>.</div>
    <div>${isPremier() ? 'Presentala come <b>disegno di legge</b> (⚡3) o <b>decreto</b> (⚡5, subito in vigore).' : G.player.parl || (isLeader() && myParty().seatsC + myParty().seatsS > 0) ? 'Presentala come <b>proposta di legge</b> (⚡2): se la maggioranza non la vuole, resta ferma.' : 'Per presentarla devi avere parlamentari. Intanto puoi <b>metterla nel programma</b>.'}</div>
    <div>Va in commissione, poi al <b>voto della Camera e del Senato</b>: quando arriva in aula ti chiedo come votare.</div>
    <div>Se passa in entrambe e il Presidente firma, <b>è legge</b> e cambiano economia e consensi.</div></div></div>`;
  if (isPremier() || isLeader() || G.player.parl) h += `<button class="btn block mt" onclick="openCustomLaw()">✍️ Scrivi una nuova legge</button>`;
  const live = G.bills.filter(b => !b.dead).length;
  h += `<div class="card tight mt click" onclick="goTab('aula')"><div class="row"><span style="font-size:22px">🗳</span><div class="grow"><b>${live} provvedimenti in Parlamento</b><div class="small muted">Tuoi, del governo e degli altri partiti: vota e guarda pro e contro</div></div><span class="dim">›</span></div></div>`;
  h += `<div id="lawlist">${lawListHTML()}</div>`;
  if (G.enacted.length) h += `<div class="sec"><h4>Ultime leggi cambiate</h4></div><div class="card tight"><div class="list">${G.enacted.slice(0, 12).map(e => { const l = getLaw(e.id); return `<div class="li click" onclick="openLaw('${e.id}')"><div class="grow"><div class="small"><b>${esc(l.opts[e.to].t)}</b></div><div class="tiny muted">${fmtDate(e.w, true)} · ${{ player: 'tuo governo', aigov: 'governo', parl: 'Parlamento', playerparl: 'tua proposta', revert: 'annullata', consulta: 'Consulta' }[e.by] || ''}</div></div></div>`; }).join('')}</div></div>`;
  return h;
}
function lawListHTML() {
  if (UI.lawMetric) { const best = bestLawsFor(UI.lawMetric, 15); return `<div class="small muted mt">Le riforme che migliorano di più ${METRICS[UI.lawMetric].ico} <b>${METRICS[UI.lawMetric].n}</b>, partendo da quelle più vicine alle tue idee:</div>` + (best.length ? best.map(x => `<div class="card tight click mt" onclick="openLaw('${x.l.id}',${x.i})"><div class="tiny muted">${LAW_CATS[x.l.cat] || ''} ${esc(x.l.nome)}</div><b>${esc(x.l.opts[x.i].t)}</b>${effChipsHTML(x.effs, x.mine)}</div>`).join('') : '<div class="muted center mt2">Nessuna riforma disponibile.</div>'); }
  const q = UI.lawQ.trim().toLowerCase();
  const list = allLaws().filter(l => (UI.lawCat === 'Tutte' || l.cat === UI.lawCat) && (!q || (l.nome + ' ' + l.attuale + ' ' + l.opts.map(o => o.t).join(' ')).toLowerCase().includes(q)));
  if (!list.length) return '<div class="muted center mt2">Nessuna legge trovata</div>';
  return list.map(l => {
    const busy = G.bills.find(b => !b.dead && b.lawId === l.id);
    const changed = G.laws[l.id] !== l.cur;
    const promised = G.promises.find(pr => pr.lawId === l.id && !pr.kept);
    return `<div class="card tight click" onclick="openLaw('${l.id}')"><div class="row"><span style="font-size:22px">${LAW_CATS[l.cat] || '📜'}</span><div class="grow"><b>${esc(l.nome)}</b><div class="small muted ellipsis">Oggi: ${esc(l.opts[G.laws[l.id]].t)}</div>
      <div class="row wrap" style="gap:4px;margin-top:4px">${busy ? `<span class="tag w">in Parlamento</span>` : ''}${changed ? '<span class="tag o">modificata</span>' : ''}${promised ? '<span class="tag g">promessa</span>' : ''}${l.cost ? '<span class="tag">costituzionale</span>' : ''}${l.custom ? '<span class="tag">tua proposta</span>' : ''}</div></div><span class="dim">›</span></div></div>`;
  }).join('');
}
let LAWSEL = null;
function openLaw(id, sel) {
  const l = getLaw(id), cur = G.laws[id];
  if (sel === undefined) sel = l.opts.findIndex((o, i) => i !== cur);
  LAWSEL = { id, sel };
  const imp = impactOf(l, cur, sel);
  const o = l.opts[sel];
  let h = head(`${LAW_CATS[l.cat] || ''} ${esc(l.nome)}`, esc(l.rif));
  h += `<div class="card tight" style="border-color:rgba(214,178,94,.3)"><div class="tiny gold" style="font-weight:800">COM’È OGGI</div><div class="small mt" style="margin-top:4px">${esc(l.opts[cur].t)}</div><div class="small muted" style="margin-top:4px">${esc(cur === l.cur ? l.attuale : l.opts[cur].d)}</div></div>`;
  h += `<h4 class="mt2">Le possibili riforme</h4>`;
  l.opts.forEach((op, i) => {
    if (i === cur) return;
    h += `<button class="choice ${i === sel ? 'sel' : ''}" onclick="openLawRefresh('${id}',${i})"><div class="row between"><span class="t">${esc(op.t)}</span>${op.costo ? `<span class="tag ${op.costo - (l.opts[cur].costo || 0) > 0 ? 'b' : 'g'}">${op.costo - (l.opts[cur].costo || 0) > 0 ? '+' : ''}${fmt1(op.costo - (l.opts[cur].costo || 0))} mld</span>` : ''}</div><div class="small muted" style="margin-top:4px">${esc(op.d)}</div>${effChipsHTML(effectsOf(l, cur, i), lawGain(myPid(), l, cur, i))}${axisMini(l, op.pos)}</button>`;
  });
  h += `<h4 class="mt2">Pro e contro di «${esc(o.t)}»</h4><div class="mt">${proConHTML(imp)}</div>`;
  h += `<div class="small mt">Per il tuo partito: ${imp.mine > 0.2 ? '<b class="good">in linea con le tue idee</b>' : imp.mine < -0.2 ? '<b class="bad">contraria alle tue idee</b> (la tua base potrebbe non capire)' : '<b class="warn">neutra</b>'}</div>`;
  // previsione voto
  const fake = { type: l.cost ? 'cost' : 'ddl', proposer: isPremier() ? 'GOV' : 'PLAYER', lawId: id, opt: sel, from: cur, stages: [{ k: 'aula', h: 'C' }], stage: 0 };
  const vc = computeVote(fake, 'C', { det: true }), vs = computeVote(fake, 'S', { det: true });
  h += `<div class="card tight mt"><div class="tiny muted" style="font-weight:700">PREVISIONE DI VOTO ${isPremier() ? '(proposta del governo)' : '(tua proposta)'}</div>${voteBar(vc, 'Camera')}${voteBar(vs, 'Senato')}</div>`;
  h += lawActionsHTML(l, sel);
  const s = layers.length && layers[layers.length - 1].law ? replaceSheet(h) : openSheet(h);
  layers[layers.length - 1].law = true;
}
function openLawRefresh(id, i) { openLaw(id, i); }
function axisMini(l, pos) { const x = (pos + 10) / 20 * 100; return `<div style="margin-top:8px"><div style="position:relative;height:4px;border-radius:2px;background:linear-gradient(90deg,var(--rosso),#555 50%,var(--blu))"><i style="position:absolute;left:${x}%;top:-4px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#fff"></i></div><div class="row between tiny dim" style="margin-top:3px"><span>${AXES[l.ax].l}</span><span>${AXES[l.ax].r}</span></div></div>`; }
function voteBar(v, name) {
  const t = Math.max(1, v.yes + v.no + v.abst);
  return `<div class="mt"><div class="row between small"><b>${name}</b><span class="${v.passed ? 'good' : 'bad'}" style="font-weight:800">${v.passed ? 'PASSA' : 'BOCCIATA'}</span></div><div class="votebar mt" style="margin-top:4px"><i style="width:${v.yes / t * 100}%;background:#22c56b"></i><i style="width:${v.abst / t * 100}%;background:#8a8fa3"></i><i style="width:${v.no / t * 100}%;background:#ef4a4f"></i></div><div class="row between tiny muted" style="margin-top:2px"><span>Sì ${v.yes}</span><span>Ast. ${v.abst}</span><span>No ${v.no}</span></div></div>`;
}
function lawActionsHTML(l, sel) {
  const btns = [];
  const busy = G.bills.find(b => !b.dead && b.lawId === l.id);
  if (busy) return `<div class="card tight mt"><b class="warn">C’è già un provvedimento in Parlamento su questa legge:</b><div class="small mt">«${esc(billName(busy))}» — ${esc(stageLabel(busy))}</div><button class="btn block mt" onclick="closeSheet();goTab('aula')">Vai all’Aula</button></div>`;
  if (G.phase !== 'normale') return '';
  if (isPremier()) {
    if (l.cost) btns.push(`<button class="btn gold block" onclick="doPropose('${l.id}',${sel},'cost')">🇮🇹 Riforma costituzionale · ⚡6</button>`);
    else {
      btns.push(`<button class="btn pri block" onclick="doPropose('${l.id}',${sel},'ddl')">📄 Disegno di legge del governo · ⚡3</button>`);
      btns.push(`<button class="btn block" onclick="doPropose('${l.id}',${sel},'dl')">⚡ Decreto-legge (subito in vigore) · ⚡5</button>`);
    }
  } else {
    const canParl = (isLeader() && (myParty().seatsC + myParty().seatsS > 0)) || G.player.parl;
    if (canParl) btns.push(`<button class="btn pri block" onclick="doPropose('${l.id}',${sel},'${l.cost ? 'cost' : 'ddl'}')">📄 Presenta una proposta di legge · ⚡2</button>`);
    if (role() === 'alleato') btns.push(`<button class="btn block" onclick="doUltimatum('${l.id}',${sel})">✊ Ultimatum al premier · ⚡3</button>`);
    if (G.player.minister && MIN_BY_ID[G.player.minister].cats.includes(l.cat)) btns.push(`<button class="btn gold block" onclick="doMinisterPropose('${l.id}',${sel})">🏛 Proponi dal tuo ministero · ⚡2</button>`);
    if (isLeader() && !inGov(myPid()) && !l.cost) btns.push(`<button class="btn block" onclick="doReferendum('${l.id}',${sel})">✍️ Referendum abrogativo (500.000 firme) · ⚡4</button>`);
    if (!canParl && !btns.length) btns.push(`<div class="small muted center">Per presentare leggi devi essere in Parlamento o guidare un partito con parlamentari.</div>`);
  }
  if (isLeader()) {
    const inProg = G.promises.find(pr => pr.lawId === l.id && pr.opt === sel);
    btns.push(`<button class="btn block" onclick="togglePromise('${l.id}',${sel})">${inProg ? '✓ Nel tuo programma (togli)' : '📋 Metti nel programma'}</button>`);
  }
  return `<div class="col mt2">${btns.join('')}</div>`;
}

// ============================================================
//  AULA
// ============================================================
function aulaTab() {
  const h0 = UI.aula;
  let h = `<div class="seg"><button class="${h0 === 'C' ? 'on' : ''}" onclick="UI.aula='C';renderGame()">Camera (${totalSeats('C')})</button><button class="${h0 === 'S' ? 'on' : ''}" onclick="UI.aula='S';renderGame()">Senato (${totalSeats('S')})</button></div>`;
  h = aulaBanner() + h;
  h += `<div class="card mt">${hemicycle(h0, { id: 'hemi-main', empty: true, ring: true })}<div class="mt">${hemiLegend(h0)}</div>`;
  if (G.gov) h += `<div class="small mt">Maggioranza di governo: <b>${govSeats(h0)}</b> seggi su ${totalSeats(h0)} (${govSeats(h0) >= majority(h0) ? '<span class="good">autosufficiente</span>' : '<span class="bad">sotto la maggioranza</span>'})</div>`;
  h += `<div class="tiny dim mt">Presidente ${h0 === 'C' ? 'della Camera: ' + INSTITUTIONS.presCamera : 'del Senato: ' + INSTITUTIONS.presSenato}</div></div>`;
  const live = G.bills.filter(b => !b.dead).sort((a, b) => (b.stages[b.stage] && b.stages[b.stage].k === 'aula' ? 1 : 0) - (a.stages[a.stage] && a.stages[a.stage].k === 'aula' ? 1 : 0));
  h += `<div class="sec"><h4>In discussione (${live.length})</h4></div>`;
  if (!live.length) h += `<div class="muted small center">Nessun provvedimento in discussione.</div>`;
  live.forEach(b => { h += billCard(b); });
  const voted = G.bills.filter(b => b.votes.length).sort((a, b) => b.votes[b.votes.length - 1].w - a.votes[a.votes.length - 1].w).slice(0, 10);
  if (voted.length) {
    h += `<div class="sec"><h4>Votazioni recenti</h4></div><div class="card tight"><div class="list">${voted.map(b => { const v = b.votes[b.votes.length - 1]; return `<div class="li click" onclick="openVoteReplay(${b.id})"><div class="grow"><div class="small"><b>${esc(billName(b))}</b></div><div class="tiny muted">${v.h === 'C' ? 'Camera' : 'Senato'} · ${fmtDate(v.w, true)}${v.fiducia ? ' · fiducia' : ''} · Sì ${v.yes} · No ${v.no}</div></div><span class="tag ${v.passed ? 'g' : 'b'}">${v.passed ? 'approvato' : 'respinto'}</span></div>`; }).join('')}</div></div>`;
  }
  return h;
}
function aulaBanner() {
  const pv = pendingVoteIds();
  if (pv.length) return `<div class="card hero" style="--pc:#38bdf8"><div class="row"><span style="font-size:34px">🗳</span><div class="grow"><b>Devi votare ${pv.length} ${pv.length > 1 ? 'provvedimenti' : 'provvedimento'}</b><div class="tiny muted">Si vota in aula questa settimana. Se non decidi, il tuo gruppo segue la linea del partito.</div></div></div><button class="btn gold block mt" onclick="openVotesNow()">Vota ora</button></div>`;
  const seats = myParty().seatsC + myParty().seatsS;
  let why;
  if (isPremier()) why = 'Nessun provvedimento del tuo governo è al voto questa settimana.';
  else if (!G.player.parl && !(isLeader() && seats)) why = isLeader() ? `${esc(myParty().short)} non ha parlamentari: voterai dopo le elezioni, se superi il 3%. Intanto segui cosa fanno gli altri.` : 'Non sei in Parlamento: voterai quando sarai eletto deputato o senatore.';
  else why = 'Nessun voto per te questa settimana. Quando un testo arriva in aula, te lo segnalo qui e nelle notifiche 🔔.';
  return `<div class="card tight"><div class="row"><span style="font-size:24px">✅</span><div class="small muted grow">${why}</div></div></div>`;
}
function proposerLabel(b) {
  if (b.proposer === 'GOV') return isPremier() ? '<span class="tag o">Tuo governo</span>' : '<span class="tag">Governo</span>';
  if (b.proposer === 'PLAYER') return `<span class="tag o">Tua proposta</span>`;
  return partyChip(b.proposer);
}
function billCard(b) {
  const s = b.stages[b.stage] || {};
  const pr = predictVote(b);
  const inAula = s.k === 'aula';
  const myH = s.h || 'C';
  let h = `<div class="card" ${inAula ? 'style="border-color:rgba(255,181,71,.35)"' : ''}>
    <div class="row between"><span class="tag">${billTypeName(b)}</span>${proposerLabel(b)}</div>
    <div style="margin-top:8px"><b>${esc(billName(b))}</b></div>
    ${b.lawId ? `<div class="small muted">${esc(getLaw(b.lawId).nome)}</div>` : ''}
    ${b.lawId ? effChipsHTML(effectsOf(getLaw(b.lawId), b.from, b.opt), lawGain(myPid(), getLaw(b.lawId), b.from, b.opt)) : ""}
    <div class="progress mt">${b.stages.map((x, i) => `<i class="${i < b.stage ? 'd' : i === b.stage ? 'c' : ''}"></i>`).join('')}</div>
    <div class="row between small mt"><span>${esc(stageLabel(b))}${s.k === 'comm' && b.wait > 0 && !b.stalled ? ` · ${b.wait} sett.` : ''}</span>${b.type === 'dl' ? `<span class="tag w">scade ${fmtDate(b.deadline, true)}</span>` : ''}</div>`;
  if (s.k === 'aula') h += `<div class="small mt">Previsione: <b class="${pr.passed ? 'good' : 'bad'}">${pr.passed ? 'passa' : 'bocciata'}</b> <span class="muted">(Sì ${pr.yes}, No ${pr.no}, Ast. ${pr.abst})</span></div>`;
  h += `<div class="row wrap mt" style="gap:6px"><button class="btn sm" onclick="openBill(${b.id})">⚖️ Pro e contro</button>`;
  if (isPremier() && b.proposer === 'GOV' && b.type !== 'cost' && s.k === 'aula') h += `<button class="btn sm ${b.fiducia ? 'gold' : ''}" onclick="toggleFiducia(${b.id})">${b.fiducia ? '✓ Fiducia posta' : 'Porre la fiducia · ⚡3'}</button>`;
  if (isPremier() && b.proposer === 'GOV' && b.type !== 'manovra') h += `<button class="btn sm" onclick="withdrawBill(${b.id})">Ritira</button>`;
  if (isLeader() && !inGov(myPid()) && b.proposer === 'GOV') h += `<button class="btn sm" onclick="doObstr(${b.id})">🛑 Ostruzionismo · ⚡2</button>`;
  h += `</div>`;
  // il tuo voto: stato chiaro
  if (inAula) {
    const pend = pendingVoteIds().includes(b.id);
    const mine = G.myPersonal[b.id] || G.myVotes[b.id];
    const relevant = G.player.parl === s.h || (isLeader() && seatsOf(myPid(), s.h) > 0);
    if (pend) h += `<button class="btn gold block mt" onclick="openVotes([${b.id}],true)">🗳 Al voto questa settimana · Vota</button>`;
    else if (mine && relevant) h += `<div class="small mt">🗳 Il tuo voto: <b class="gold">${VLAB[mine]}</b> · risultato la prossima settimana</div>`;
    else if (!relevant && !(isPremier() && b.proposer === 'GOV')) h += `<div class="tiny muted mt">Non voti su questo testo: ${G.player.parl ? 'si vota nell’altra Camera' : 'non sei in Parlamento'}.</div>`;
  }
  return h + `</div>`;
}
function setMyVote(id, v) { if (v) G.myVotes[id] = v; else delete G.myVotes[id]; vib(); renderGame(); }
function toggleFiducia(id) {
  const b = G.bills.find(x => x.id === id);
  if (b.fiducia) { b.fiducia = false; G.pc += 3; renderGame(); return; }
  if (!spendPC(3)) { toast('Capitale politico insufficiente', 'bad'); return; }
  b.fiducia = true; toast('Fiducia posta: gli alleati devono votare sì', 'good'); renderGame();
}
function withdrawBill(id) { confirmSheet('Ritirare il provvedimento?', '<p class="muted">Il testo esce dal calendario. Gli alleati che lo volevano saranno delusi.</p>', 'Ritira', () => { const b = G.bills.find(x => x.id === id); b.dead = true; if (b.type === 'dl') revertDecree(b, 'ritirato'); addNews(`Il governo ritira «${billName(b)}».`, 'gov'); renderGame(); }, 'red'); }
function openBill(id) {
  const b = G.bills.find(x => x.id === id);
  let imp, h;
  if (b.type === 'manovra') { imp = manovraImpact(b.measures); }
  else { const l = getLaw(b.lawId); imp = impactOf(l, b.type === 'dl' ? (b.dlFrom !== undefined ? b.dlFrom : b.from) : G.laws[b.lawId], b.opt); }
  h = head(esc(billName(b)), `${billTypeName(b)} · ${b.proposer === 'GOV' ? (G.gov ? esc(G.gov.name) : 'Governo') : b.proposer === 'PLAYER' ? 'tua proposta' : esc(P(b.proposer).name)}`);
  if (b.lawId) { const l = getLaw(b.lawId); h += `<div class="card tight"><div class="tiny gold" style="font-weight:800">OGGI</div><div class="small">${esc(l.opts[b.from].t)}</div><div class="tiny gold mt" style="font-weight:800">DIVENTEREBBE</div><div class="small">${esc(l.opts[b.opt].d)}</div></div>`; }
  if (b.type === 'manovra') h += `<div class="card tight"><div class="small">${b.measures.map(id => `<div class="row between" style="padding:3px 0"><span>${esc(BUDGET_BY_ID[id].n)}</span><b class="${BUDGET_BY_ID[id].c > 0 ? 'bad' : 'good'}">${BUDGET_BY_ID[id].c > 0 ? '+' : ''}${fmt1(BUDGET_BY_ID[id].c)}</b></div>`).join('')}</div></div>`;
  h += proConHTML(imp);
  const pr = predictVote(b);
  if (b.stages[b.stage] && b.stages[b.stage].k === 'aula') h += `<div class="card tight mt">${voteBar(pr, b.stages[b.stage].h === 'C' ? 'Previsione Camera' : 'Previsione Senato')}</div>`;
  openSheet(h);
}
function openVoteReplay(id) {
  const b = G.bills.find(x => x.id === id); const v = b.votes[b.votes.length - 1];
  openSheet(`${head(esc(billName(b)), `${v.h === 'C' ? 'Camera dei deputati' : 'Senato della Repubblica'} · ${fmtDate(v.w)}`)}
    <div class="card">${hemicycle(v.h, { id: 'hemi-replay', empty: true })}</div>
    <div class="center mt"><span class="stamp ${v.passed ? 'good' : 'bad'}">${v.passed ? 'APPROVATO' : 'RESPINTO'}</span></div>
    <div class="grid3 mt"><div class="kpi center"><div class="l">Sì</div><div class="v good">${v.yes}</div></div><div class="kpi center"><div class="l">Astenuti</div><div class="v">${v.abst}</div></div><div class="kpi center"><div class="l">No</div><div class="v bad">${v.no}</div></div></div>
    <div class="card tight mt"><div class="list">${Object.entries(v.by || {}).filter(([k]) => k !== 'ALT').map(([k, x]) => `<div class="li">${partyChip(k)}<span class="grow tiny muted">${x.vote === 'yes' ? 'favorevole' : x.vote === 'no' ? 'contrario' : 'astenuto'}</span><span class="tiny">Sì ${x.yes} · No ${x.no} · Ast ${x.abst}</span></div>`).join('')}</div></div>`);
  setTimeout(() => animateVote($('#hemi-replay'), v.by || {}), 350);
}

// ============================================================
//  ITALIA (mappa)
// ============================================================
const MAPMODES = [['primo', 'Primo partito'], ['coal', 'Coalizioni'], ['mio', 'Il tuo partito'], ['gov', 'Governatori'], ['elez', 'Prossime regionali']];
function regionColor(rid) {
  const st = G.regions[rid];
  if (UI.map === 'primo') { const s = regionShares(rid); const top = Object.keys(s).sort((a, b) => s[b] - s[a])[0]; return P(top).color; }
  if (UI.map === 'coal') { const s = regionShares(rid); const bl = {}; PIDS().forEach(id => { const c = coalitionOf(id); const k = c ? c.id : id; bl[k] = (bl[k] || 0) + s[id]; }); const top = Object.keys(bl).sort((a, b) => bl[b] - bl[a])[0]; const c = G.coalitions.find(x => x.id === top); return c ? (c.color || '#888') : (G.parties[top] ? P(top).color : '#888'); }
  if (UI.map === 'mio') { const s = regionShares(rid)[myPid()]; const max = Math.max(...REGIONS_DEF.map(r => regionShares(r.id)[myPid()])); const k = clamp(s / max, 0.08, 1); return `color-mix(in srgb, ${myParty().color} ${Math.round(k * 100)}%, #1c2643)`; }
  if (UI.map === 'gov') { const gp = st.gp; if (G.parties[gp]) return P(gp).color; return { AUT: '#9aa0b4', CIVD: '#5b7fd1', CIVS: '#d05b62' }[gp] || '#777'; }
  if (UI.map === 'elez') { const d = st.next - G.week; return d < 30 ? '#d6b25e' : d < 80 ? '#8a7a4a' : '#2a3350'; }
  return '#555';
}
function italiaTab() {
  let h = `<div class="scrollx">${MAPMODES.map(([k, n]) => `<button class="fchip ${UI.map === k ? 'on' : ''}" onclick="UI.map='${k}';renderGame()">${n}</button>`).join('')}</div>`;
  h += `<div class="card mt map"><svg viewBox="0 0 360 470">`;
  REGIONS_DEF.forEach(r => { h += `<path d="${REGION_PATHS[r.id].d}" fill="${regionColor(r.id)}" onclick="openRegion('${r.id}')"/>`; });
  REGIONS_DEF.forEach(r => { h += `<text x="${r.lab[0]}" y="${r.lab[1]}" text-anchor="middle">${r.id}</text>`; });
  h += `</svg><div class="legend mt">${mapLegend()}</div></div>`;
  // elenco regioni
  h += `<div class="sec"><h4>Regioni</h4></div><div class="card tight"><div class="list">${REGIONS_DEF.map(r => { const st = G.regions[r.id]; const s = regionShares(r.id); return `<div class="li click" onclick="openRegion('${r.id}')"><span class="dot" style="--c:${regionColor(r.id)}"></span><div class="grow"><b class="small">${r.n}</b><div class="tiny muted">${esc(st.gov)} · regionali ${fmtDate(st.next, true)}</div></div><span class="small">${esc(myParty().short)} <b>${fmt1(s[myPid()])}%</b></span></div>`; }).join('')}</div></div>`;
  return h;
}
function mapLegend() {
  if (UI.map === 'primo') { const set = new Set(REGIONS_DEF.map(r => { const s = regionShares(r.id); return Object.keys(s).sort((a, b) => s[b] - s[a])[0]; })); return [...set].map(id => `<span><i class="dot" style="--c:${P(id).color}"></i>${esc(P(id).short)}</span>`).join(''); }
  if (UI.map === 'coal') return G.coalitions.map(c => `<span><i class="dot" style="--c:${c.color}"></i>${esc(c.name)}</span>`).join('') + '<span><i class="dot" style="--c:#888"></i>Liste singole</span>';
  if (UI.map === 'mio') return `<span>Più scuro = più debole, più acceso = più forte per ${esc(myParty().short)}</span>`;
  if (UI.map === 'gov') return '<span>Colore del partito del presidente di Regione</span>';
  return '<span><i class="dot" style="--c:#d6b25e"></i>entro 30 settimane</span><span><i class="dot" style="--c:#8a7a4a"></i>entro 80</span>';
}
function openRegion(rid) {
  const r = REGIONS_DEF.find(x => x.id === rid), st = G.regions[rid], s = regionShares(rid);
  const top = Object.keys(s).sort((a, b) => s[b] - s[a]).slice(0, 8);
  const gpName = G.parties[st.gp] ? P(st.gp).short : { AUT: 'autonomisti', CIVD: 'civico, centrodestra', CIVS: 'civica, centrosinistra' }[st.gp];
  let h = head(r.n, `${fmt1(r.el)} milioni di elettori · ${AREAS[r.area]}`);
  h += `<div class="card tight"><div class="row"><span style="font-size:26px">🏛</span><div class="grow"><div class="tiny muted">Presidente della Regione</div><b>${esc(st.gov)}</b> <span class="small muted">(${esc(gpName)})</span></div></div><div class="small mt">Prossime regionali: <b>${fmtDate(st.next)}</b> (${weeksLeft(st.next)})</div></div>`;
  h += `<h4 class="mt2">Intenzioni di voto in regione</h4><div class="mt">${top.map(id => `<div class="res-row" style="grid-template-columns:54px 1fr 54px">${partyChip(id)}${barH(s[id], s[top[0]] * 1.1, P(id).color)}<span class="pct small">${fmt1(s[id])}%</span></div>`).join('')}</div>`;
  if (myPid() === 'MIO' || isLeader()) h += `<div class="small muted mt">Radicamento di ${esc(myParty().short)}: <b>${fmt1(((G.myReg[rid] || 1) - 1) * 100 + 100)}%</b> della media${G.player.region === rid ? ' · è la tua regione' : ''}</div>`;
  h += `<div class="col mt2">`;
  if (isLeader() || !isLeader()) h += `<button class="btn pri block" onclick="closeSheet();doComizio('${rid}')">📣 Comizio / iniziativa in ${r.n} · ⚡1 · 20k€</button>`;
  if (isPremier()) h += `<button class="btn block" onclick="closeSheet();doVisita('${rid}')">🏛 Visita istituzionale del governo · ⚡2</button>`;
  h += `</div>`;
  openSheet(h);
}

// ============================================================
//  PARTITI, SONDAGGI, ALLEANZE
// ============================================================
function partitiTab() {
  const v = UI.partiti;
  let h = `<div class="seg"><button class="${v === 'sondaggi' ? 'on' : ''}" onclick="UI.partiti='sondaggi';renderGame()">Sondaggi</button><button class="${v === 'partiti' ? 'on' : ''}" onclick="UI.partiti='partiti';renderGame()">Partiti</button><button class="${v === 'alleanze' ? 'on' : ''}" onclick="UI.partiti='alleanze';renderGame()">Alleanze</button></div>`;
  if (v === 'sondaggi') {
    const ids = PIDS().sort((a, b) => P(b).poll - P(a).poll);
    const hist = G.hist.polls.slice(-UI.range);
    const show = ids.slice(0, 7).concat(ids.slice(7).includes(myPid()) ? [myPid()] : []);
    h += `<div class="card mt"><div class="row between"><h3>Intenzioni di voto</h3><div class="seg" style="width:150px"><button class="${UI.range === 12 ? 'on' : ''}" onclick="UI.range=12;renderGame()">3m</button><button class="${UI.range === 52 ? 'on' : ''}" onclick="UI.range=52;renderGame()">1a</button><button class="${UI.range === 999 ? 'on' : ''}" onclick="UI.range=999;renderGame()">Tutto</button></div></div>
      ${hist.length > 1 ? lineChart(show.map(id => ({ color: P(id).color, w: id === myPid() ? 3 : 1.8, pts: hist.map(x => [x.w, x.p[id] || 0]) })), { ymin: 0, fmt: v => Math.round(v) + '%' }) : '<div class="small muted mt">Il grafico si riempie con il passare delle settimane.</div>'}</div>`;
    const old = G.hist.polls.length > 4 ? G.hist.polls[G.hist.polls.length - 5].p : {};
    h += `<div class="card">${ids.map(id => { const d = P(id).poll - (old[id] || P(id).poll); return `<div class="res-row">${partyChip(id)}${barH(P(id).poll, P(ids[0]).poll * 1.08, P(id).color)}<span class="pct small">${fmt1(P(id).poll)}% <span class="tiny ${d >= 0 ? 'good' : 'bad'}">${d >= 0 ? '▲' : '▼'}${fmt1(Math.abs(d))}</span></span></div>`; }).join('')}<div class="tiny dim mt">Altri: ${fmt1(OTHER_POLL)}% · Soglia di sbarramento 3%</div></div>`;
    // coalizioni
    h += `<div class="sec"><h4>Coalizioni (soglia premio 42%)</h4></div><div class="card">${G.coalitions.map(c => { const s = c.members.reduce((t, m) => t + (G.parties[m] ? P(m).poll : 0), 0); return `<div style="margin:8px 0"><div class="row between small"><b>${esc(c.name)}</b><b>${fmt1(s)}%</b></div><div style="position:relative">${barH(s, 60, c.color)}<i style="position:absolute;left:${42 / 60 * 100}%;top:-3px;bottom:-3px;width:2px;background:#fff;opacity:.6"></i></div><div class="row wrap" style="gap:3px;margin-top:4px">${c.members.map(partyChip).join('')}</div></div>`; }).join('')}</div>`;
  }
  if (v === 'partiti') {
    PIDS().sort((a, b) => P(b).poll - P(a).poll).forEach(id => {
      const p = P(id), me = id === myPid();
      const c = me ? 100 : compat(id, myPid()), r = me ? 0 : rel(id, myPid());
      const coal = coalitionOf(id);
      h += `<div class="card tight click mt" onclick="openParty('${id}')"><div class="row">${sym(id)}<div class="grow"><div class="row between"><b class="ellipsis">${esc(p.name)}</b><b>${fmt1(p.poll)}%</b></div><div class="small muted ellipsis">${esc(leaderName(id))} · ${p.seatsC} dep. · ${p.seatsS} sen.${coal ? ' · ' + esc(coal.name) : ''}${inGov(id) ? ' · al governo' : ''}</div>
        ${me ? '<div class="tiny gold mt">Il tuo partito</div>' : `<div class="row mt" style="gap:6px"><span class="tiny muted" style="width:56px">Affinità</span><div class="grow">${barH(c, 100, pctColor(c), true)}</div><span class="tiny muted" style="width:56px">Rapporto</span><div class="grow">${barH(r + 100, 200, relColor(r), true)}</div></div>`}</div></div></div>`;
    });
  }
  if (v === 'alleanze') h += alleanzeHTML();
  return h;
}
function openParty(id) {
  const p = P(id), me = id === myPid();
  let h = `<div class="row">${sym(id, true)}<div class="grow"><h2>${esc(p.name)}</h2><div class="muted small">${esc(p.area)} · ${esc(p.family)} · leader ${esc(leaderName(id))}</div></div><button class="xbtn" onclick="closeSheet()">✕</button></div>`;
  h += `<div class="grid3 mt"><div class="kpi"><div class="l">Sondaggi</div><div class="v">${fmt1(p.poll)}%</div></div><div class="kpi"><div class="l">Deputati</div><div class="v">${p.seatsC}</div></div><div class="kpi"><div class="l">Senatori</div><div class="v">${p.seatsS}</div></div></div>`;
  if (!me) {
    const c = compat(id, myPid()), r = rel(id, myPid());
    h += `<div class="card tight mt"><div class="row between small"><span>Affinità ideologica con te</span><b style="color:${pctColor(c)}">${fmt0(c)}%</b></div>${barH(c, 100, pctColor(c), true)}<div class="row between small mt"><span>Rapporto personale</span><b style="color:${relColor(r)}">${r > 0 ? '+' : ''}${fmt0(r)}</b></div>${barH(r + 100, 200, relColor(r), true)}
      ${NEVER.some(([a, b]) => (a === id && b === myPid()) || (b === id && a === myPid())) ? '<div class="small bad mt">Alleanza impossibile</div>' : ''}${G.gov && inGov(id) ? `<div class="small mt">Soddisfazione nel governo: <b>${fmt0(G.gov.sat[id] || 0)}</b></div>` : ''}</div>`;
  }
  h += `<h4 class="mt2">Posizioni${me ? '' : ' a confronto'}</h4><div class="mt">${AXIS_KEYS.map(k => { const x = (p.ax[k] + 10) / 20 * 100, y = (myParty().ax[k] + 10) / 20 * 100; return `<div style="margin:9px 0"><div class="row between tiny muted"><span>${AXES[k].l}</span><b style="color:var(--text)">${AXES[k].n}</b><span>${AXES[k].r}</span></div><div style="position:relative;height:6px;border-radius:3px;background:rgba(255,255,255,.08);margin-top:4px">${!me ? `<i style="position:absolute;left:${y}%;top:-3px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:${myParty().color};border:2px solid #fff;opacity:.7"></i>` : ''}<i style="position:absolute;left:${x}%;top:-4px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:${p.color};border:2px solid #fff"></i></div></div>`; }).join('')}</div>${!me ? `<div class="tiny dim">Pallino pieno: ${esc(p.short)} · pallino chiaro: ${esc(myParty().short)}</div>` : ''}`;
  if (!me && isLeader()) {
    const myC = coalitionOf(myPid()), same = myC && myC.members.includes(id), sc = inviteScore(id);
    h += `<div class="col mt2"><button class="btn pri block" onclick="closeSheet();doIncontro('${id}')">☕ Incontro riservato con ${esc(p.leader)} · ⚡1</button>`;
    if (same) h += `<div class="small center good">Siete già alleati in ${esc(myC.name)}</div>`;
    else if (sc.block) h += `<div class="small center bad">Alleanza impossibile: veto di ${esc(P(sc.block).short)}</div>`;
    else h += `<button class="btn gold block" onclick="closeSheet();invitePartner('${id}')">🤝 ${myC ? `Invitalo in ${esc(myC.name)}` : 'Proponi un’alleanza'} · probabilità ${sc.score}% · ⚡1</button>`;
    const theirC = coalitionOf(id);
    if (theirC && !same && !myC) h += `<button class="btn block" onclick="closeSheet();UI.partiti='alleanze';goTab('partiti')">Oppure chiedi di entrare in ${esc(theirC.name)}</button>`;
    h += `</div>`;
  }
  openSheet(h);
}
function alleanzeHTML() {
  let h = '';
  const myC = coalitionOf(myPid());
  const locked = G.flags.listsDeposited === G.cal.election;
  if (isLeader()) h += `<div class="card mt"><h3>🤝 Come funzionano le alleanze</h3><div class="howto mt">
    <div>Puoi <b>chiedere di entrare</b> in una coalizione esistente (Centrodestra, Campo largo…): gli alleati ti chiederanno di mettere nel programma le loro leggi bandiera.</div>
    <div>Se sei già in una coalizione, puoi <b>invitare altri partiti</b> a entrarci: devono accettare loro e non devono esserci veti con chi c’è già.</div>
    <div>Se corri da solo, puoi <b>fondare la tua coalizione</b> invitando un partito: il candidato premier sei tu.</div>
    <div>Più l’<b>affinità</b> (idee vicine) e il <b>rapporto</b> (incontri, voti, interviste) sono alti, più è facile. Alcune alleanze sono impossibili.</div>
    <div>Le alleanze si chiudono con il <b>deposito delle liste</b>, 6 settimane prima del voto.</div></div></div>`;
  h += `<div class="card mt hero"><h3>La tua posizione</h3><div class="small mt">${myC ? `${esc(myParty().short)} fa parte di <b>${esc(myC.name)}</b>. Candidato premier: <b>${myC.cand === 'PLAYER' ? esc(G.player.name) + ' (tu)' : esc(myC.cand || 'da decidere (primarie)')}</b>.` : `${esc(myParty().short)} corre da solo. Con la legge elettorale 2026 servono il 3% per entrare e il 42% (in coalizione) per il premio di maggioranza.`}</div>${locked ? '<div class="tag w mt">Liste depositate: alleanze bloccate fino al voto</div>' : ''}</div>`;
  G.coalitions.forEach(c => {
    const s = c.members.reduce((t, m) => t + (G.parties[m] ? P(m).poll : 0), 0);
    const mine = c.members.includes(myPid());
    h += `<div class="card"><div class="row between"><h3>${esc(c.name)}</h3><b>${fmt1(s)}%</b></div><div class="row wrap mt" style="gap:4px">${c.members.map(partyChip).join('')}</div><div class="small muted mt">Candidato premier: ${c.cand === 'PLAYER' ? '<b class="gold">tu</b>' : esc(c.cand || 'primarie da svolgere')}</div>`;
    if (isLeader() && !locked) {
      if (!mine && !myC) { const js = joinScore(c, myPid()); h += `<button class="btn pri block mt" onclick="askJoin('${c.id}')">Chiedi di entrare · probabilità ${js.score}%</button>${js.block ? `<div class="small bad mt">Veto di ${esc(P(js.block).short)}: alleanza impossibile</div>` : ''}`; }
      if (mine) {
        if (c.cand !== 'PLAYER' && !(c.id === 'csx' && !c.cand)) h += `<button class="btn gold block mt" onclick="askPremiership('${c.id}')">Chiedi di essere tu il candidato premier · ⚡4</button>`;
        if (c.id === 'csx' && !c.cand && !(G.primarie && G.primarie.player)) h += `<button class="btn gold block mt" onclick="joinPrimarie()">Candidati alle primarie · ⚡3</button>`;
        if (G.primarie && G.primarie.player && !G.primarie.done) h += `<div class="small gold mt">Sei candidato alle primarie (spinta ${fmt1(G.primarie.boost || 0)}). Usa «Campagna per le primarie» nell’agenda.</div>`;
        const others = PIDS().filter(id => !c.members.includes(id));
        if (others.length) h += `<div class="mt small muted">Invita un partito in ${esc(c.name)} (· ⚡1):</div><div class="row wrap mt" style="gap:6px">${others.map(id => { const sc = inviteScore(id); return `<button class="btn sm ${sc.block ? 'off' : ''}" onclick="invitePartner('${id}')">${esc(P(id).short)} · ${sc.block ? 'veto' : sc.score + '%'}</button>`; }).join('')}</div><div class="tiny dim mt">I partiti già in un’altra coalizione accettano più raramente.</div>`;
        h += `<button class="btn red block mt" onclick="leaveCoalition()">Esci dalla coalizione</button>`;
      }
    }
    h += `</div>`;
  });
  if (isLeader() && !myC && !locked) {
    const free = PIDS().filter(id => id !== myPid() && !coalitionOf(id));
    const all = PIDS().filter(id => id !== myPid());
    h += `<div class="card"><h3>Fonda una tua coalizione</h3><div class="small muted mt">Invita un partito: se accetta nasce la tua coalizione e il candidato premier sei tu. Quelli già alleati con altri accettano più raramente.</div><div class="row wrap mt" style="gap:6px">${all.map(id => { const sc = inviteScore(id); return `<button class="btn sm ${sc.block ? 'off' : ''}" onclick="invitePartner('${id}')">${esc(P(id).short)} · ${sc.block ? 'veto' : sc.score + '%'}</button>`; }).join('')}</div>${free.length ? '' : ''}</div>`;
  }
  if (!isLeader()) h += `<div class="small muted center mt">Le alleanze le decide ${esc(myParty().leader)}. Diventa leader per trattare tu.</div>`;
  return h;
}

// ============================================================
//  CONTI PUBBLICI
// ============================================================
function contiTab() {
  const e = G.econ;
  const k = (l, v, cls, sub, m) => `<div class="kpi ${m ? 'click' : ''}" ${m ? `onclick="openAdvice('${m}')"` : ''} style="--kc:${cls === 'bad' ? '#ff5c5c' : cls === 'good' ? '#2ecc71' : cls === 'warn' ? '#ffb547' : '#4b8bff'}"><div class="l">${l}</div><div class="v ${cls || ''}">${v}</div>${sub ? `<div class="tiny muted">${sub}</div>` : ''}${m ? '<div class="tiny" style="color:var(--tc);font-weight:700;margin-top:2px">Come migliorarlo ›</div>' : ''}</div>`;
  const red = redMetrics();
  let h = '';
  if (red.length) h += `<div class="card hero" style="--pc:#ff5c5c"><h3>🚨 Indicatori in rosso</h3>${red.map(r => `<div class="li click" onclick="openAdvice('${r.k}')"><span class="nico u2">${METRICS[r.k].ico}</span><div class="grow small"><b>${esc(r.t)}</b><div class="tiny muted">Tocca per le leggi che aiutano</div></div><span class="btn sm">Rimedi</span></div>`).join('')}</div>`;
  h += `<div class="grid2">${k('Crescita PIL', sgn(e.pil) + '%', e.pil < 0.4 ? 'bad' : e.pil > 1 ? 'good' : '', 'annua', 'pil')}${k('Deficit / PIL', fmt1(e.deficit) + '%', e.deficit > 3 ? 'bad' : 'good', 'limite UE 3%', 'deficit')}${k('Debito / PIL', fmt1(e.debito) + '%', e.debito > 140 ? 'bad' : '', 'circa ' + fmt0(e.debito * e.pilNom / 100) + ' mld', 'deficit')}${k('Spread BTP-Bund', fmt0(e.spread), e.spread > 200 ? 'bad' : e.spread < 100 ? 'good' : 'warn', 'punti base', 'spread')}${k('Inflazione', fmt1(e.infl) + '%', e.infl > 3 ? 'bad' : '', '', 'prezzi')}${k('Disoccupazione', fmt1(e.dis) + '%', e.dis > 7.5 ? 'bad' : '', '', 'lavoro')}</div>`;
  h += `<div class="row wrap mt" style="gap:6px"><span class="tag o">Rating ${e.rating}</span><span class="tag ${e.pde ? 'b' : 'g'}">${e.pde ? 'In procedura UE per deficit eccessivo' : 'Fuori dalla procedura UE'}</span><span class="tag">PIL nominale ${fmt0(e.pilNom)} mld</span></div>`;
  const hist = G.hist.econ.slice(-UI.range);
  if (hist.length > 1) {
    h += `<div class="card mt"><h3>Spread</h3>${lineChart([{ color: '#ff7a59', pts: hist.map(x => [x.w, x.spread]) }], { ymin: 0, ref: 200 })}</div>`;
    h += `<div class="card"><h3>Deficit e crescita</h3>${lineChart([{ color: '#ff5c5c', pts: hist.map(x => [x.w, x.deficit]) }, { color: '#2ecc71', pts: hist.map(x => [x.w, x.pil]) }], { ref: 3, fmt: v => fmt1(v) })}<div class="legend"><span><i class="dot" style="--c:#ff5c5c"></i>Deficit %</span><span><i class="dot" style="--c:#2ecc71"></i>PIL %</span></div></div>`;
    if (hist.some(x => x.appr)) h += `<div class="card"><h3>Consenso del governo</h3>${lineChart([{ color: '#d6b25e', pts: hist.filter(x => x.appr).map(x => [x.w, x.appr]) }], { ymin: 0, ymax: 80, fmt: v => Math.round(v) + '%' })}</div>`;
  }
  // manovra
  const b = G.bills.find(x => x.type === 'manovra' && !x.dead);
  h += `<div class="sec"><h4>Legge di bilancio</h4></div><div class="card">`;
  if (b) h += `<b>${esc(billName(b))}</b><div class="small muted">${esc(stageLabel(b))}</div><div class="small mt">Saldo misure: <b>${fmt1(budgetSum('c', b.measures))} mld</b></div><button class="btn sm mt" onclick="openBill(${b.id})">Pro e contro</button>`;
  else h += `<div class="small">Misure in vigore quest’anno: <b>${G.budget.active.length}</b> (saldo ${fmt1(budgetSum('c'))} mld). La prossima manovra si presenta a metà ottobre.</div>`;
  if (isPremier() && G.flags.manovraDue) h += `<button class="btn gold block mt" onclick="openManovra(${G.flags.manovraDue})">💶 Prepara la manovra ${G.flags.manovraDue}</button>`;
  h += `</div>`;
  // gruppi sociali
  h += `<div class="sec"><h4>Il Paese e i poteri</h4></div><div class="card">${Object.keys(GROUPS).map(gk => { const v = G.groups[gk]; return `<div class="row" style="margin:7px 0"><span class="small" style="width:96px">${GROUPS[gk].n}</span><div class="grow">${barH(v + 100, 200, relColor(v), true)}</div><b class="small" style="width:36px;text-align:right;color:${relColor(v)}">${v > 0 ? '+' : ''}${fmt0(v)}</b></div>`; }).join('')}<div class="tiny dim">Rapporto con te: ${Object.values(GROUPS).map(g => g.who).join(' · ')}</div></div>`;
  h += `<div class="card"><h3>Clima del Paese</h3><div class="small muted">Dove si colloca oggi l’opinione pubblica</div>${AXIS_KEYS.map(kk => { const x = (G.mood[kk] + 10) / 20 * 100; return `<div style="margin:9px 0"><div class="row between tiny muted"><span>${AXES[kk].l}</span><b style="color:var(--text)">${AXES[kk].n}</b><span>${AXES[kk].r}</span></div><div style="position:relative;height:6px;border-radius:3px;background:rgba(255,255,255,.08);margin-top:4px"><i style="position:absolute;left:${x}%;top:-4px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:var(--oro)"></i></div></div>`; }).join('')}</div>`;
  return h;
}

// ============================================================
//  MENU
// ============================================================
function openMenu() {
  const item = (i, t, s, on) => `<div class="li click" onclick="${on}"><span style="font-size:22px;width:30px;text-align:center">${i}</span><div class="grow"><b>${t}</b>${s ? `<div class="tiny muted">${s}</div>` : ''}</div><span class="dim">›</span></div>`;
  openSheet(`${head('Menu')}<div class="card tight"><div class="list">
    ${item('🏛', 'Il governo', G.gov ? esc(G.gov.name) : '', 'closeSheet();openGovernment()')}
    ${item('👤', 'Il mio profilo e la carriera', esc(G.player.name), 'closeSheet();openProfile()')}
    ${isLeader() ? item('📋', 'Programma elettorale', G.program ? 'annunciato' : 'da presentare', 'closeSheet();openProgram()') : ''}
    ${item('📰', 'Archivio notizie', G.news.length + ' notizie', 'closeSheet();openNews()')}
    ${item('🏛', 'Istituzioni', 'Quirinale, Camere, Corte, UE, parti sociali', 'closeSheet();openInstitutions()')}
    </div></div><div class="card tight"><div class="list">
    ${item('💾', 'Salva partita', 'Tre slot sul telefono', 'closeSheet();openSave()')}
    ${item('📤', 'Esporta su file', 'Backup da conservare', 'exportSave()')}
    ${item('🎓', 'Tutorial', 'Rivedi la guida passo passo', 'closeSheet();startTutorial(0)')}${item('❓', 'Come si gioca', 'Riassunto delle regole', 'closeSheet();openGuide()')}
    ${item('🚪', 'Torna al menu iniziale', 'La partita resta salvata', 'closeSheet();saveGame(\'auto\');showSplash()')}
    </div></div><div class="tiny dim center">Difficoltà ${D().n} · Legislatura ${['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV'][G.legislature] || G.legislature}</div>`);
}
function openSave() {
  openSheet(`${head('Salva partita')}<div class="list">${['1', '2', '3'].map(s => { const i = slotInfo(s); return `<div class="li"><div class="grow"><b>Slot ${s}</b><div class="small muted">${i ? `${esc(i.name)} · ${esc(i.party)} · ${esc(i.date)}` : 'vuoto'}</div></div><button class="btn sm pri" onclick="saveGame('${s}');toast('Salvato nello slot ${s}','good');closeSheet()">Salva qui</button></div>`; }).join('')}</div><div class="tiny dim mt">La partita si salva anche da sola a ogni settimana.</div>`);
}
function openNews() {
  openSheet(`${head('Archivio notizie')}<div class="list">${G.news.slice(0, 200).map(newsRow).join('')}</div>`);
}
function openInstitutions() {
  const I = INSTITUTIONS;
  const row = (a, b) => `<div class="li"><span class="grow small muted">${a}</span><b class="small right">${esc(b)}</b></div>`;
  openSheet(`${head('Istituzioni e società')}<div class="card tight"><div class="list">
    ${row('Presidente della Repubblica', I.pdr + (G.cal.quirinale > G.week ? ` (mandato fino al ${fmtDate(G.cal.quirinale, true)})` : ''))}${row('Presidente del Senato', I.presSenato)}${row('Presidente della Camera', I.presCamera)}
    ${row('Governatore Banca d’Italia', I.bankit)}${row('Presidente BCE', I.bce)}${row('Presidente Commissione UE', I.commissione)}${row('Commissario UE all’economia', I.commEco)}
    ${row('CGIL', I.cgil)}${row('CISL', I.cisl)}${row('UIL', I.uil)}${row('Confindustria', I.confindustria)}${row('Presidente CEI', I.cei)}${row('Santa Sede', I.papa)}</div></div>
    <div class="card tight"><h4>Referendum</h4><div class="list">${G.referendums.length ? G.referendums.map(r => `<div class="li small"><span class="grow">${esc(getLaw(r.lawId).nome)} (${r.kind === 'conf' ? 'confermativo' : 'abrogativo'})</span><span>${r.done ? (r.res && r.res.won ? '✅' : '❌') : fmtDate(r.w, true)}</span></div>`).join('') : '<div class="small dim">Nessuno</div>'}</div></div>`);
}
function openGovernment() {
  const g = G.gov;
  if (!g) { openSheet(`${head('Il governo')}<div class="muted">Nessun governo in carica.</div>`); return; }
  let h = head(esc(g.name), `Presidente del Consiglio: ${g.premier === 'PLAYER' ? esc(G.player.name) : esc(g.premier)} · dal ${fmtDate(g.start)}`);
  h += `<div class="row wrap" style="gap:4px">${g.parties.map(partyChip).join('')}</div>`;
  if (g.vice && g.vice.length) h += `<div class="small mt">Vicepresidenti: <b>${g.vice.map(esc).join(', ')}</b></div>`;
  h += `<div class="card tight mt"><div class="list">${MINISTRIES.map(m => { const n = g.ministers[m.id]; const p = n ? person(n) : null; return `<div class="li"><div class="grow"><div class="tiny muted">${m.port === 0 ? 'Senza portafoglio · ' : ''}${esc(m.n)}</div><b class="small">${n ? esc(n) : (g.interim === m.id ? 'interim del premier' : '<span class="dim">vacante</span>')}</b></div>${p ? (p.party === 'TEC' ? '<span class="tag">tecnico</span>' : p.party === 'IND' ? '<span class="tag">indip.</span>' : partyChip(p.party)) : ''}${p ? `<span class="tiny muted" style="width:30px;text-align:right">${p.comp}/10</span>` : ''}</div>`; }).join('')}</div></div>`;
  if (isPremier()) h += `<button class="btn gold block mt" onclick="closeSheet();openAction('rimpasto')">🔄 Rimpasto di governo</button>`;
  openSheet(h);
}
function openProfile() {
  const p = G.player, bg = BACKGROUNDS.find(b => b.id === p.bg);
  const st = (l, v, max, c) => `<div class="row" style="margin:6px 0"><span class="small" style="width:96px">${l}</span><div class="grow">${barH(v, max, c)}</div><b class="small" style="width:40px;text-align:right">${fmt0(v)}</b></div>`;
  let h = `<div class="row">${sym(myPid(), true)}<div class="grow"><h2>${esc(p.name)}</h2><div class="small muted">${p.age} anni · ${esc(bg.n)} · ${regionName(p.region)}</div><div class="small gold">${esc(roleLabel())}</div></div><button class="xbtn" onclick="closeSheet()">✕</button></div>`;
  h += `<div class="card mt">${st('Carisma', p.car, 10, 'var(--oro)')}${st('Competenza', p.comp, 10, 'var(--blu)')}${st('Integrità', p.integ, 10, 'var(--verde)')}${st('Fama', p.fama, 100, '#c77dff')}${st('Salute', p.salute, 100, pctColor(p.salute))}${st('Stress', p.stress, 100, p.stress > 70 ? 'var(--bad)' : 'var(--warn)')}</div>`;
  if (isLeader()) h += `<div class="card">${st('Organizzazione', G.org, 100, 'var(--blu)')}${st('Credibilità', G.cred, 100, 'var(--verde)')}<div class="small mt">Fondi del partito: <b>${euro(G.funds)}</b></div></div>`;
  else h += `<div class="card">${st('Seguito interno', p.seguito, 100, 'var(--blu)')}<div class="row" style="margin:6px 0"><span class="small" style="width:96px">Col leader</span><div class="grow">${barH(p.rap + 100, 200, relColor(p.rap))}</div><b class="small" style="width:40px;text-align:right">${fmt0(p.rap)}</b></div></div>`;
  h += `<h4 class="mt2">Carriera</h4><div class="card tight"><div class="list">${RANKS.map((r, i) => `<div class="li"><span style="width:22px">${i < p.rank ? '✅' : i === p.rank ? '📍' : '▫️'}</span><div class="grow"><b class="small ${i === p.rank ? 'gold' : i > p.rank ? 'dim' : ''}">${r.n}</b><div class="tiny muted">${r.d}</div></div></div>`).join('')}</div></div>`;
  h += `<h4 class="mt2">Bilancio</h4><div class="grid2 mt">${[['Leggi approvate', G.stats.laws], ['Decreti', G.stats.decreti], ['Fiducie', G.stats.fiducie], ['Settimane da premier', G.stats.weeksPremier]].map(([a, b]) => `<div class="kpi"><div class="l">${a}</div><div class="v">${b}</div></div>`).join('')}</div>`;
  if (G.careerLog.length) h += `<h4 class="mt2">Momenti chiave</h4><div class="card tight"><div class="list">${G.careerLog.slice().reverse().map(x => `<div class="news-item"><span class="w">${fmtDate(x.w, true)}</span><span>${esc(x.t)}</span></div>`).join('')}</div></div>`;
  openSheet(h);
}
