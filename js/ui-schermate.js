// ============================================================
//  SCHERMATE DI GIOCO · stile "Palazzo"
// ============================================================
const SVG = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const TABS = [
  { id: 'home', n: 'Home', c: '#ffd60a', svg: SVG('<path d="M3 9l9-5 9 5"/><path d="M5.5 10.5v7M9.8 10.5v7M14.2 10.5v7M18.5 10.5v7"/><path d="M3 20.5h18"/>') },
  { id: 'leggi', n: 'Leggi', c: '#fb923c', svg: SVG('<path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>') },
  { id: 'aula', n: 'Aula', c: '#38bdf8', svg: SVG('<path d="M3 18a9 9 0 0 1 18 0"/><path d="M7.5 18a4.5 4.5 0 0 1 9 0"/><path d="M2 21h20"/>') },
  { id: 'italia', n: 'Italia', c: '#22c55e', svg: SVG('<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>') },
  { id: 'partiti', n: 'Partiti', c: '#a78bfa', svg: SVG('<path d="M5 21V12"/><path d="M12 21V5"/><path d="M19 21v-6"/>') },
  { id: 'conti', n: 'Conti', c: '#f472b6', svg: SVG('<path d="M17 6.5a7 7 0 1 0 0 11"/><path d="M4 10h9M4 14h9"/>') },
];
function goTab(t) { const c = $('.content'); if (c) UI.scroll[UI.tab] = c.scrollTop; UI.tab = t; vib(8); renderGame(); }
function weeksLeft(w) { const d = w - G.week; return d <= 0 ? 'oggi' : d === 1 ? 'tra 1 settimana' : d < 9 ? `tra ${d} settimane` : `tra ${Math.round(d / 4.35)} mesi`; }
function sec(title, extra) { return `<div class="sec"><h4>${title}</h4>${extra || ''}</div>`; }

function renderGame() {
  const c = $('.content'); if (c) UI.scroll[UI.tab] = c.scrollTop;
  $('#app').dataset.tab = UI.tab;
  $('#app').innerHTML = `${topbar()}<div class="tricolore"></div>${tickerHTML()}<div class="content" id="content">${tabContent()}</div>${fabHTML()}${navHTML()}`;
  const n = $('.content'); if (n) n.scrollTop = UI.scroll[UI.tab] || 0;
  postRender();
}
function refresh() { renderGame(); }
function topbar() {
  const mp = myParty();
  const old = G.hist.polls.length > 5 ? G.hist.polls[G.hist.polls.length - 5].p[myPid()] : mp.poll;
  const d = mp.poll - (old || mp.poll);
  const chips = [];
  chips.push(`<span class="stat" onclick="goTab('partiti')">${esc(mp.short)}<b>${fmt1(mp.poll)}% <span class="d ${d >= 0 ? 'good' : 'bad'}">${d >= 0 ? '▲' : '▼'}${fmt1(Math.abs(d))}</span></b></span>`);
  if (G.gov) chips.push(`<span class="stat" onclick="openGovernment()">Governo<b style="color:${pctColor(G.gov.approval * 1.4)}">${fmt0(G.gov.approval)}%</b></span>`);
  chips.push(`<span class="stat" onclick="goTab('conti')">Spread<b class="${G.econ.spread > 200 ? 'bad' : ''}">${fmt0(G.econ.spread)}</b></span>`);
  const n = urgentCount();
  return `<div class="topbar"><div class="row between"><div class="grow"><div class="date"><span class="flip" key="${G.week}">${fmtDate(G.week)}</span></div><div class="role ellipsis">${esc(roleLabel())}</div></div>
    <span class="pill pc" onclick="toast('Capitale politico: si ricarica ogni settimana (+${pcIncome()})')">${icon('bolt')} ${G.pc}/${pcMax()}</span>
    <button class="iconbtn" onclick="openNotifications()">${icon('bell')}${n ? `<span class="bdg">${n}</span>` : ''}</button><button class="iconbtn" onclick="openMenu()">${icon('menu')}</button></div>
    <div class="chips">${chips.join('')}</div></div>`;
}
function tickerHTML() {
  const items = G.news.slice(0, 8).map(n => `<span>• ${esc(n.t)}</span>`).join('');
  return `<div class="ticker"><span class="lbl">ULTIM’ORA</span><div style="overflow:hidden;flex:1"><div class="run">${items}</div></div></div>`;
}
function fabHTML() {
  // un cerchio fisso in basso a destra su ogni pagina
  if (G.phase === 'fine') return `<button class="fab form" onclick="showSplash()" title="Menu iniziale">${icon('door')}</button>`;
  if (G.phase === 'formazione') return `<button class="fab form" onclick="openFormation()" title="Consultazioni">${icon('building')}</button>`;
  if (G.queue.length) return `<button class="fab alert" onclick="processQueue()" title="Decisioni in attesa">${icon('alert')}<span class="fbdg">${G.queue.length}</span></button>`;
  return `<button class="fab" onclick="nextWeek()" title="Settimana successiva">${icon('arrowr')}</button>`;
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
  let h = tipsHTML();
  h += `<div class="card hero center" style="--pc:${mp.color}">
    <span class="av-badge" onclick="openAvatarEditor()">${portrait(p.name, 78, { party: myPid() })}<span class="pbadge" style="--c:${mp.color}">${partyMark(myPid(), 26)}</span><span class="edit">${icon('edit')}</span></span>
    <h2 class="mt">${esc(p.name)}</h2><div class="role-l">${esc(roleLabel())}</div>
    ${g ? `<div class="row wrap" style="gap:4px;justify-content:center;margin-top:10px">${g.parties.map(partyChip).join('')}</div>` : ''}
    <div class="st4s">${stat4('Sondaggio', fmt1(mp.poll) + '%', 'poll', '#c4a5ff')}${stat4('Notorietà', fmt0(partyNoto(myPid())) + '%', 'noto', '#22d3ee')}${g ? stat4(isPremier() ? 'Tuo governo' : 'Governo', fmt0(g.approval) + '%', 'appr', '#ffd60a') : stat4('Fama', fmt0(p.fama), 'fama', '#f0abfc')}${isLeader() ? stat4('Fama', fmt0(p.fama), 'fama', '#f0abfc') : stat4('Col leader', relNum(p.rap), 'rap', relColorHex(p.rap))}</div>
    <div class="minirow"><span>${icon('coin')} ${euro(G.funds)}</span><span>${icon('sun')} Stress ${fmt0(p.stress)}</span><span>${icon('building')} ${!isLeader() ? esc(RANKS[p.rank].n) : (mp.seatsC + mp.seatsS) + ' parlamentari'}</span></div></div>`;
  // da fare ora
  const all = notifications(), todo = all.slice(0, 3);
  if (todo.length) h += sec('Da fare ora', all.length > 3 ? `<button class="btn sm" onclick="openNotifications()">Tutte</button>` : '') + `<div class="todo">${todo.map((n, i) => `<button class="todo-i u${n.u}" style="animation-delay:${i * 60}ms" onclick="${n.on}"><span class="nico ${n.u >= 2 ? 'u2' : n.u ? 'u1' : ''}">${emoIcon(n.ico, 19)}</span><span class="grow ellipsis">${esc(n.t)}</span>${icon('chevron', 16)}</button>`).join('')}</div>`;
  // azioni a medaglie
  const recs = recommendedActions(), rec = recs.map(r => r.id);
  const acts = availableActions().sort((a, b) => (rec.includes(b.id) && !b.done ? 1 : 0) - (rec.includes(a.id) && !a.done ? 1 : 0) || (a.done ? 1 : 0) - (b.done ? 1 : 0));
  h += sec('Azioni', `<button class="btn sm gold" onclick="autoPlan()">${icon('star')} Pianifica</button>`) +
    `<div class="acts">${acts.map((a, i) => { const r = recs.find(x => x.id === a.id); const star = rec.includes(a.id) && !a.done; return `<button class="act-t ${a.ok ? '' : 'off'} ${a.done ? 'done' : ''} ${star ? 'rec' : ''}" style="--ac:${a.ac};animation-delay:${i * 25}ms" onclick="${a.id === 'comizio' && r && r.param ? `quickAction('comizio','${r.param}')` : `openAction('${a.id}')`}"><span class="ai">${a.done ? icon('check') : icon(ACT_ICON[a.id] || a.ico || 'star')}</span><span class="an">${esc(a.n)}</span><span class="ac">${a.done ? 'fatta' : a.cost ? '⚡' + a.cost : 'gratis'}</span>${star ? '<span class="as">★</span>' : ''}</button>`; }).join('')}</div>
    <div class="tiny muted center mt">★ consigliate · ogni azione una volta a settimana</div>`;
  // alleati (premier)
  if (isPremier() && g.parties.length > 1) h += sec('Alleati') + `<div class="scrollx">${g.parties.filter(x => x !== myPid()).map(x => `<div class="due center" onclick="openParty('${x}')">${leaderPortrait(x, 46)}<b>${esc(P(x).short)}</b><div class="bar thin" style="width:80px"><i style="width:${g.sat[x]}%;--c:${pctColor(g.sat[x])}"></i></div><span class="dw" style="color:${pctColor(g.sat[x])}">${g.sat[x] >= 60 ? 'Soddisfatto' : g.sat[x] >= 35 ? 'Inquieto' : 'Furioso'}</span></div>`).join('')}</div>`;
  // carriera
  if (!isLeader()) h += sec('Carriera') + `<div class="card tight"><div class="progress">${RANKS.map((r, i) => `<i class="${i < p.rank ? 'd' : i === p.rank ? 'c' : ''}"></i>`).join('')}</div><div class="row between tiny mt"><b>${esc(RANKS[p.rank].n)}</b><span class="muted">seguito ${fmt0(p.seguito)}%</span></div><div class="tiny muted mt">${careerHint()}</div></div>`;
  // in arrivo
  const dl = [];
  if (G.cal.election > G.week) dl.push({ w: G.cal.election, i: 'vote', t: 'Elezioni politiche' });
  const y = yearOf(G.week); dl.push({ w: weekOf(`${monthOf(G.week) > 9 ? y + 1 : y}-10-10`), i: 'euro', t: 'Manovra' });
  Object.entries(G.regions).sort((a, b) => a[1].next - b[1].next).slice(0, 2).forEach(([rid, st]) => dl.push({ w: st.next, i: 'map', t: `Regionali ${regionName(rid)}` }));
  if (G.cal.quirinale > G.week) dl.push({ w: G.cal.quirinale, i: 'building', t: 'Nuovo Capo dello Stato' });
  G.referendums.filter(r => !r.done).forEach(r => dl.push({ w: r.w, i: 'pen', t: 'Referendum' }));
  dl.sort((a, b) => a.w - b.w);
  h += sec('In arrivo') + `<div class="scrollx">${dl.map(x => `<div class="due"><span class="di">${icon(x.i)}</span><b>${esc(x.t)}</b><span class="dw">${weeksLeft(x.w)}</span></div>`).join('')}</div>`;
  return h;
}
function newsRow(n) { return `<div class="news-item"><span class="w">${fmtDate(n.w, true).replace(/ \d{4}$/, '')}</span><span class="nk-${n.k}">${esc(n.t)}</span></div>`; }
function careerHint() {
  const next = { 0: 'Prossimo passo: consigliere comunale (comunali in primavera, servono fama e seguito).', 1: 'Prossimo passo: Consiglio regionale (alle regionali della tua regione).', 2: 'Prossimo passo: il Parlamento (chiedi la candidatura alle politiche).', 3: 'Prossimo passo: segreteria nazionale (fama 28+, rapporto col leader 30+).', 4: 'Prossimo passo: capogruppo o sottosegretario (fama 38+, rapporto 40+).', 5: 'Prossimo passo: ministro (fama 50+, rapporto 45+).', 6: 'Prossimo passo: guidare il partito (sfida il leader o fonda il tuo).' };
  return next[G.player.rank] || '';
}

// ============================================================
//  LEGGI
// ============================================================
function leggiTab() {
  const cats = ['Tutte'].concat(Object.keys(LAW_CATS).filter(c => allLaws().some(l => l.cat === c)));
  let h = `<div class="row"><div class="searchbox">${icon('search')}<input id="lawq" placeholder="Cerca una legge" value="${esc(UI.lawQ)}" oninput="UI.lawQ=this.value;$('#lawlist').innerHTML=lawListHTML()"></div><button class="iconbtn" onclick="openGlossary()">${icon('info')}</button></div>
    <div class="scrollx mt">${cats.map(c => `<button class="fchip ${UI.lawCat === c ? 'on' : ''}" onclick="UI.lawCat='${c}';renderGame()">${icon(CAT_ICON[c] || 'folder')} ${c}</button>`).join('')}</div>
    <div class="scrollx mt"><span class="tiny muted" style="align-self:center;flex:none">Voglio migliorare</span>${Object.keys(METRICS).map(m => `<button class="fchip ${UI.lawMetric === m ? 'on' : ''}" onclick="UI.lawMetric=UI.lawMetric==='${m}'?null:'${m}';renderGame()">${icon(METRIC_ICON[m])} ${METRICS[m].n}</button>`).join('')}</div>`;
  const live = G.bills.filter(b => !b.dead).length;
  h += `<div class="card tight mt click" onclick="goTab('aula')"><div class="row">${medal('vote', 44)}<div class="grow"><b>${live} provvedimenti in Parlamento</b><div class="small muted">Tuoi, del governo e degli altri partiti</div></div>${icon('chevron', 18)}</div></div>`;
  if (isPremier() || isLeader() || G.player.parl) h += `<button class="btn block" onclick="openCustomLaw()">${icon('pen')} Scrivi una nuova legge</button>`;
  h += sec(UI.lawMetric ? `Per migliorare: ${METRICS[UI.lawMetric].n}` : 'Il catalogo delle leggi') + `<div id="lawlist">${lawListHTML()}</div>`;
  if (G.enacted.length) h += sec('Ultime leggi cambiate') + `<div class="card tight"><div class="list">${G.enacted.slice(0, 12).map(e => { const l = getLaw(e.id); return `<div class="li click" onclick="openLaw('${e.id}')">${icon(CAT_ICON[l.cat] || 'doc')}<div class="grow"><div class="small"><b>${esc(l.opts[e.to].t)}</b></div><div class="tiny muted">${fmtDate(e.w, true)} · ${{ player: 'tuo governo', aigov: 'governo', parl: 'Parlamento', playerparl: 'tua proposta', revert: 'annullata', consulta: 'Consulta' }[e.by] || ''}</div></div></div>`; }).join('')}</div></div>`;
  return h;
}
function lawCardHTML(l, opt, extra) {
  const busy = G.bills.find(b => !b.dead && b.lawId === l.id);
  const changed = G.laws[l.id] !== l.cur;
  const promised = G.promises.find(pr => pr.lawId === l.id && !pr.kept);
  return `<div class="card tight click" onclick="openLaw('${l.id}'${opt !== undefined ? ',' + opt : ''})"><div class="row">${medal(CAT_ICON[l.cat] || 'doc', 44)}<div class="grow"><h3 style="font-size:16px">${esc(opt !== undefined ? l.opts[opt].t : l.nome)}</h3><div class="small muted ellipsis">${opt !== undefined ? esc(l.nome) : 'Oggi: ' + esc(l.opts[G.laws[l.id]].t)}</div>
    ${extra || ''}<div class="row wrap" style="gap:4px;margin-top:6px">${busy ? `<span class="tag w">${icon('vote')} in Parlamento</span>` : ''}${changed ? '<span class="tag o">modificata</span>' : ''}${promised ? '<span class="tag g">nel programma</span>' : ''}${l.cost ? '<span class="tag">costituzionale</span>' : ''}${l.custom ? '<span class="tag">tua proposta</span>' : ''}</div></div>${icon('chevron', 18)}</div></div>`;
}
function lawListHTML() {
  if (UI.lawMetric) {
    const best = bestLawsFor(UI.lawMetric, 15);
    return best.length ? best.map(x => lawCardHTML(x.l, x.i, effChipsHTML(x.effs, x.mine))).join('') : '<div class="muted center mt2">Nessuna riforma disponibile.</div>';
  }
  const q = UI.lawQ.trim().toLowerCase();
  const list = allLaws().filter(l => (UI.lawCat === 'Tutte' || l.cat === UI.lawCat) && (!q || (l.nome + ' ' + l.attuale + ' ' + l.opts.map(o => o.t).join(' ')).toLowerCase().includes(q)));
  if (!list.length) return '<div class="muted center mt2">Nessuna legge trovata</div>';
  return list.map(l => lawCardHTML(l)).join('');
}
let LAWSEL = null;
function openLaw(id, sel) {
  const l = getLaw(id), cur = G.laws[id];
  if (sel === undefined || sel === cur) sel = l.opts.findIndex((o, i) => i !== cur);
  LAWSEL = { id, sel };
  const imp = impactOf(l, cur, sel);
  let h = `<div class="sheet-head"><div class="row grow">${medal(CAT_ICON[l.cat] || 'doc', 52)}<div class="grow"><h2 style="font-size:22px">${esc(l.nome)}</h2><div class="tiny muted">${esc(l.rif)}</div></div></div><button class="xbtn" onclick="closeSheet()">${icon('x', 18)}</button></div>`;
  h += `<div class="qcard"><span class="tiny gold" style="font-weight:900;letter-spacing:.1em">COM’È OGGI</span><div style="margin-top:4px"><b>${esc(l.opts[cur].t)}</b></div><div class="small muted" style="margin-top:4px">${esc(cur === l.cur ? l.attuale : l.opts[cur].d)}</div></div>`;
  h += `<div class="mt">${explainHTML(l, sel)}</div>`;
  h += sec('Le riforme possibili');
  l.opts.forEach((op, i) => {
    if (i === cur) return;
    const dc = (op.costo || 0) - (l.opts[cur].costo || 0);
    h += `<button class="choice ${i === sel ? 'sel' : ''}" onclick="openLawRefresh('${id}',${i})"><div class="row between"><span class="t">${esc(op.t)}</span>${Math.abs(dc) > 0.05 ? `<span class="tag ${dc > 0 ? 'b' : 'g'}">${dc > 0 ? '+' : ''}${fmt1(dc)} mld</span>` : ''}</div>${i === sel ? `<div class="small muted" style="margin-top:4px">${esc(op.d)}</div>` : ''}${effChipsHTML(effectsOf(l, cur, i), lawGain(myPid(), l, cur, i))}${i === sel ? axisMini(l, op.pos) : ''}</button>`;
  });
  h += `<div class="row wrap mt" style="gap:4px"><span class="tiny good" style="font-weight:800">A FAVORE</span>${imp.fav.map(partyChip).join('') || '<span class="tiny dim">nessuno</span>'}</div><div class="row wrap mt" style="gap:4px"><span class="tiny bad" style="font-weight:800">CONTRO</span>${imp.contr.map(partyChip).join('') || '<span class="tiny dim">nessuno</span>'}</div>
    <details class="mt"><summary class="small gold">${icon('scales', 16)} Tutti i pro e contro</summary><div class="mt">${proConHTML(imp, { noParties: true })}</div></details>`;
  const fake = { type: l.cost ? 'cost' : 'ddl', proposer: isPremier() ? 'GOV' : 'PLAYER', lawId: id, opt: sel, from: cur, stages: [{ k: 'aula', h: 'C' }], stage: 0 };
  const vc = computeVote(fake, 'C', { det: true }), vs = computeVote(fake, 'S', { det: true });
  h += `<div class="card tight mt"><div class="tiny gold" style="font-weight:900;letter-spacing:.1em">PREVISIONE DI VOTO ${isPremier() ? '· PROPOSTA DEL GOVERNO' : '· TUA PROPOSTA'}</div>${voteBar(vc, 'Camera')}${voteBar(vs, 'Senato')}</div>`;
  h += lawActionsHTML(l, sel);
  if (layers.length && layers[layers.length - 1].law) replaceSheet(h); else openSheet(h);
  layers[layers.length - 1].law = true;
}
function openLawRefresh(id, i) { const sh = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null, st = sh ? sh.scrollTop : 0; openLaw(id, i); const s2 = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null; if (s2) s2.scrollTop = st; }
function axisMini(l, pos) { const x = (pos + 10) / 20 * 100; return `<div style="margin-top:10px"><div style="position:relative;height:4px;border-radius:2px;background:linear-gradient(90deg,#c2414a,#6c6f80 50%,#4b74d9)"><i style="position:absolute;left:${x}%;top:-5px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:var(--cream);border:2px solid var(--oro)"></i></div><div class="row between tiny dim" style="margin-top:4px"><span>${AXES[l.ax].l}</span><span>${AXES[l.ax].r}</span></div></div>`; }
function voteBar(v, name) {
  const t = Math.max(1, v.yes + v.no + v.abst);
  return `<div class="mt"><div class="row between small"><b>${name}</b><span class="${v.passed ? 'good' : 'bad'}" style="font-weight:900">${v.passed ? 'PASSA' : 'BOCCIATA'}</span></div><div class="votebar" style="margin-top:5px"><i style="width:${v.yes / t * 100}%;background:#34d399"></i><i style="width:${v.abst / t * 100}%;background:#8a8fa3"></i><i style="width:${v.no / t * 100}%;background:#ff6b6b"></i></div><div class="row between tiny muted" style="margin-top:3px"><span>Sì ${v.yes}</span><span>Astenuti ${v.abst}</span><span>No ${v.no}</span></div></div>`;
}
function lawActionsHTML(l, sel) {
  const btns = [];
  const busy = G.bills.find(b => !b.dead && b.lawId === l.id);
  if (busy) return `<div class="card tight mt"><b class="warn">C’è già un provvedimento in Parlamento su questa legge</b><div class="small mt">«${esc(billName(busy))}» — ${esc(stageLabel(busy))}</div><div class="mt">${iterHTML(busy)}</div><button class="btn block mt" onclick="closeSheet();goTab('aula')">${icon('vote')} Vai all’Aula</button></div>`;
  if (G.phase !== 'normale') return '';
  if (isPremier()) {
    if (l.cost) btns.push(`<button class="btn gold block" onclick="doPropose('${l.id}',${sel},'cost')">${icon('building')} Riforma costituzionale · ⚡6</button>`);
    else {
      btns.push(`<button class="btn pri block" onclick="doPropose('${l.id}',${sel},'ddl')">${icon('doc')} Disegno di legge del governo · ⚡3</button>`);
      btns.push(`<button class="btn block" onclick="doPropose('${l.id}',${sel},'dl')">${icon('bolt')} Decreto-legge, subito in vigore · ⚡5</button>`);
    }
    btns.push(`<div class="tiny muted center">Non sai la differenza? <a class="gold" onclick="openGlossary()">Tipi di legge e percorso</a></div>`);
  } else {
    const canParl = (isLeader() && (myParty().seatsC + myParty().seatsS > 0)) || G.player.parl;
    if (canParl) btns.push(`<button class="btn pri block" onclick="doPropose('${l.id}',${sel},'${l.cost ? 'cost' : 'ddl'}')">${icon('doc')} Presenta una proposta di legge · ⚡2</button>`);
    if (role() === 'alleato') btns.push(`<button class="btn block" onclick="doUltimatum('${l.id}',${sel})">${icon('fist')} Ultimatum al premier · ⚡3</button>`);
    if (G.player.minister && MIN_BY_ID[G.player.minister].cats.includes(l.cat)) btns.push(`<button class="btn gold block" onclick="doMinisterPropose('${l.id}',${sel})">${icon('building')} Proponi dal tuo ministero · ⚡2</button>`);
    if (isLeader() && !inGov(myPid()) && !l.cost) btns.push(`<button class="btn block" onclick="doReferendum('${l.id}',${sel})">${icon('pen')} Referendum abrogativo (500.000 firme) · ⚡4</button>`);
    if (!canParl && !btns.length) btns.push(`<div class="small muted center">Per presentare leggi devi essere in Parlamento o guidare un partito con parlamentari.</div>`);
  }
  if (isLeader()) {
    const inProg = G.promises.find(pr => pr.lawId === l.id && pr.opt === sel);
    btns.push(`<button class="btn block" onclick="togglePromise('${l.id}',${sel})">${icon('clipboard')} ${inProg ? 'Nel tuo programma · togli' : 'Metti nel programma'}</button>`);
  }
  return `<div class="col mt2">${btns.join('')}</div>`;
}

// ============================================================
//  AULA
// ============================================================
function aulaTab() {
  const h0 = UI.aula;
  let h = aulaBanner();
  h += `<button class="btn sm block" onclick="openGlossary()">${icon('info')} Come funziona il Parlamento</button>`;
  h += `<div class="seg mt"><button class="${h0 === 'C' ? 'on' : ''}" onclick="UI.aula='C';renderGame()">Camera · ${totalSeats('C')}</button><button class="${h0 === 'S' ? 'on' : ''}" onclick="UI.aula='S';renderGame()">Senato · ${totalSeats('S')}</button></div>`;
  h += `<div class="card mt">${hemicycle(h0, { id: 'hemi-main', empty: true, ring: true })}<div class="mt">${hemiLegend(h0)}</div>`;
  if (G.gov) h += `<div class="small mt">Maggioranza di governo: <b>${govSeats(h0)}</b> seggi su ${totalSeats(h0)} · ${govSeats(h0) >= majority(h0) ? '<span class="good">autosufficiente</span>' : '<span class="bad">sotto la maggioranza</span>'}</div>`;
  h += `<div class="tiny dim mt">Presidente ${h0 === 'C' ? 'della Camera: ' + INSTITUTIONS.presCamera : 'del Senato: ' + INSTITUTIONS.presSenato}</div></div>`;
  const live = G.bills.filter(b => !b.dead).sort((a, b) => (b.stages[b.stage] && b.stages[b.stage].k === 'aula' ? 1 : 0) - (a.stages[a.stage] && a.stages[a.stage].k === 'aula' ? 1 : 0));
  h += sec(`In discussione · ${live.length}`);
  if (!live.length) h += `<div class="muted small center">Nessun provvedimento in discussione.</div>`;
  live.forEach(b => { h += billCard(b); });
  const voted = G.bills.filter(b => b.votes.length).sort((a, b) => b.votes[b.votes.length - 1].w - a.votes[a.votes.length - 1].w).slice(0, 10);
  if (voted.length) h += sec('Votazioni recenti') + `<div class="card tight"><div class="list">${voted.map(b => { const v = b.votes[b.votes.length - 1]; return `<div class="li click" onclick="openVoteReplay(${b.id})">${icon(v.passed ? 'check' : 'x')}<div class="grow"><div class="small"><b>${esc(billName(b))}</b></div><div class="tiny muted">${v.h === 'C' ? 'Camera' : 'Senato'} · ${fmtDate(v.w, true)}${v.fiducia ? ' · fiducia' : ''} · Sì ${v.yes} · No ${v.no}</div></div><span class="tag ${v.passed ? 'g' : 'b'}">${v.passed ? 'approvato' : 'respinto'}</span></div>`; }).join('')}</div></div>`;
  return h;
}
function aulaBanner() {
  const pv = pendingVoteIds();
  if (pv.length) return `<div class="card hero center" style="--pc:#38bdf8">${medal('vote', 60)}<h3 class="mt">Devi votare ${pv.length} ${pv.length > 1 ? 'provvedimenti' : 'provvedimento'}</h3><div class="small muted mt">Si vota in aula questa settimana. Se non decidi, il tuo gruppo segue la linea del partito.</div><button class="btn gold block mt" onclick="openVotesNow()">${icon('vote')} Vota ora</button></div>`;
  const seats = myParty().seatsC + myParty().seatsS;
  let why;
  if (isPremier()) why = 'Nessun provvedimento del tuo governo è al voto questa settimana.';
  else if (!G.player.parl && !(isLeader() && seats)) why = isLeader() ? `${esc(myParty().short)} non ha parlamentari: voterai dopo le elezioni, se superi il 3%.` : 'Non sei in Parlamento: voterai quando sarai eletto deputato o senatore.';
  else why = 'Nessun voto per te questa settimana. Quando un testo arriva in aula te lo segnalo qui e nelle notifiche.';
  return `<div class="card tight"><div class="row">${medal('check', 40)}<div class="small muted grow">${why}</div></div></div>`;
}
function proposerLabel(b) {
  if (b.proposer === 'GOV') return isPremier() ? `<span class="tag o">${icon('crown')} Tuo governo</span>` : `<span class="tag">${icon('building')} Governo</span>`;
  if (b.proposer === 'PLAYER') return `<span class="tag o">${icon('user')} Tua proposta</span>`;
  return partyChip(b.proposer);
}
function billCard(b) {
  const s = b.stages[b.stage] || {};
  const inAula = s.k === 'aula';
  let h = `<div class="card vote-card" style="--vc:${b.proposer === 'GOV' ? '#ffd60a' : G.parties[b.proposer] ? P(b.proposer).color : '#a78bfa'}">
    <div class="row between">${kindTag(b)}${proposerLabel(b)}</div>
    <h3 style="margin-top:10px">${esc(billName(b))}</h3>
    ${b.lawId && getLaw(b.lawId).nome !== billName(b) ? `<div class="small muted">${esc(getLaw(b.lawId).nome)}</div>` : ''}
    ${b.lawId ? effChipsHTML(effectsOf(getLaw(b.lawId), b.from, b.opt), lawGain(myPid(), getLaw(b.lawId), b.from, b.opt)) : ''}
    <div class="mt">${iterHTML(b)}</div>
    <div class="row between small mt"><span>${esc(stageLabel(b))}${s.k === 'comm' && b.wait > 0 && !b.stalled ? ` · ${b.wait} sett.` : ''}</span>${b.type === 'dl' ? `<span class="tag w">${icon('clock')} scade ${fmtDate(b.deadline, true)}</span>` : ''}</div>`;
  if (isPremier() && b.proposer === 'GOV' && b.type !== 'cost' && inAula) h += fiduciaCompareHTML(b, b.fiducia);
  else if (inAula) { const pr = predictVote(b); h += `<div class="small mt">Previsione: <b class="${pr.passed ? 'good' : 'bad'}">${pr.passed ? 'passa' : 'bocciata'}</b> <span class="muted">(Sì ${pr.yes}, No ${pr.no}, Astenuti ${pr.abst})</span></div>`; }
  h += `<div class="row wrap mt" style="gap:6px"><button class="btn sm" onclick="openBill(${b.id})">${icon('scales')} Pro e contro</button>`;
  if (isPremier() && b.proposer === 'GOV' && b.type !== 'cost' && inAula) h += `<button class="btn sm ${b.fiducia ? 'gold' : ''}" onclick="toggleFiducia(${b.id})">${icon('lock')} ${b.fiducia ? 'Fiducia posta' : 'Porre la fiducia · ⚡3'}</button>`;
  if (isPremier() && b.proposer === 'GOV' && b.type !== 'manovra') h += `<button class="btn sm" onclick="withdrawBill(${b.id})">Ritira</button>`;
  if (isLeader() && !inGov(myPid()) && b.proposer === 'GOV') h += `<button class="btn sm" onclick="doObstr(${b.id})">${icon('hand')} Ostruzionismo · ⚡2</button>`;
  h += `</div>`;
  if (inAula) {
    const pend = pendingVoteIds().includes(b.id);
    const mine = G.myPersonal[b.id] || G.myVotes[b.id];
    const relevant = G.player.parl === s.h || (isLeader() && seatsOf(myPid(), s.h) > 0);
    if (pend) h += `<button class="btn gold block mt" onclick="openVotes([${b.id}],true)">${icon('vote')} Al voto questa settimana · Vota</button>`;
    else if (mine && relevant) h += `<div class="small mt">${icon('vote', 16)} Il tuo voto: <b class="gold">${VLAB[mine]}</b> · risultato la prossima settimana</div>`;
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
  let imp;
  if (b.type === 'manovra') imp = manovraImpact(b.measures);
  else { const l = getLaw(b.lawId); imp = impactOf(l, b.type === 'dl' ? (b.dlFrom !== undefined ? b.dlFrom : b.from) : G.laws[b.lawId], b.opt); }
  let h = head(esc(billName(b)), `${b.proposer === 'GOV' ? (G.gov ? esc(G.gov.name) : 'Governo') : b.proposer === 'PLAYER' ? 'tua proposta' : esc(P(b.proposer).name)}`);
  h += `<div class="row wrap" style="gap:6px">${kindTag(b)}</div><div class="mt">${iterHTML(b)}</div>`;
  if (b.lawId) { const l = getLaw(b.lawId); h += `<div class="change mt"><div><span class="tiny muted">OGGI</span><b>${esc(l.opts[b.from].t)}</b></div><span class="arrow">${icon('chevron')}</span><div><span class="tiny muted">DIVENTEREBBE</span><b>${esc(l.opts[b.opt].t)}</b></div></div><div class="mt">${explainHTML(l, b.opt)}</div>`; }
  if (b.type === 'manovra') h += `<div class="card tight mt"><div class="small">${b.measures.map(id => `<div class="row between" style="padding:3px 0"><span>${esc(BUDGET_BY_ID[id].n)}</span><b class="${BUDGET_BY_ID[id].c > 0 ? 'bad' : 'good'}">${BUDGET_BY_ID[id].c > 0 ? '+' : ''}${fmt1(BUDGET_BY_ID[id].c)}</b></div>`).join('')}</div></div>`;
  h += `<div class="mt">${proConHTML(imp)}</div>`;
  if (b.stages[b.stage] && b.stages[b.stage].k === 'aula') h += isPremier() && b.proposer === 'GOV' && b.type !== 'cost' ? fiduciaCompareHTML(b, b.fiducia) : `<div class="card tight mt">${voteBar(predictVote(b), b.stages[b.stage].h === 'C' ? 'Previsione Camera' : 'Previsione Senato')}</div>`;
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
  if (UI.map === 'mio') { const s = regionShares(rid)[myPid()]; const max = Math.max(...REGIONS_DEF.map(r => regionShares(r.id)[myPid()])); const k = clamp(s / max, 0.08, 1); return `color-mix(in srgb, ${myParty().color} ${Math.round(k * 100)}%, #1f1f22)`; }
  if (UI.map === 'gov') { const gp = st.gp; if (G.parties[gp]) return P(gp).color; return { AUT: '#9aa0b4', CIVD: '#5b7fd1', CIVS: '#d05b62' }[gp] || '#777'; }
  if (UI.map === 'elez') { const d = st.next - G.week; return d < 30 ? '#ff2d3d' : d < 80 ? '#8a3a40' : '#2a2a2e'; }
  return '#555';
}
function italiaTab() {
  let h = `<div class="scrollx">${MAPMODES.map(([k, n]) => `<button class="fchip ${UI.map === k ? 'on' : ''}" onclick="UI.map='${k}';renderGame()">${n}</button>`).join('')}</div>`;
  h += `<div class="card mt map"><svg viewBox="0 0 360 470">`;
  REGIONS_DEF.forEach(r => { h += `<path d="${REGION_PATHS[r.id].d}" fill="${regionColor(r.id)}" onclick="openRegion('${r.id}')"/>`; });
  REGIONS_DEF.forEach(r => { h += `<text x="${r.lab[0]}" y="${r.lab[1]}" text-anchor="middle">${r.id}</text>`; });
  h += `</svg><div class="legend mt">${mapLegend()}</div></div>`;
  h += sec('Regioni') + `<div class="card tight"><div class="list">${REGIONS_DEF.map(r => { const st = G.regions[r.id]; const s = regionShares(r.id); return `<div class="li click" onclick="openRegion('${r.id}')"><span class="dot" style="--c:${regionColor(r.id)}"></span><div class="grow"><b class="small">${r.n}</b><div class="tiny muted">${esc(st.gov)} · regionali ${fmtDate(st.next, true)}</div></div><span class="small">${esc(myParty().short)} <b>${fmt1(s[myPid()])}%</b></span></div>`; }).join('')}</div></div>`;
  return h;
}
function mapLegend() {
  if (UI.map === 'primo') { const set = new Set(REGIONS_DEF.map(r => { const s = regionShares(r.id); return Object.keys(s).sort((a, b) => s[b] - s[a])[0]; })); return [...set].map(id => `<span><i class="dot" style="--c:${P(id).color}"></i>${esc(P(id).short)}</span>`).join(''); }
  if (UI.map === 'coal') return G.coalitions.map(c => `<span><i class="dot" style="--c:${c.color}"></i>${esc(c.name)}</span>`).join('') + '<span><i class="dot" style="--c:#888"></i>Liste singole</span>';
  if (UI.map === 'mio') return `<span>Più acceso = più forte per ${esc(myParty().short)}</span>`;
  if (UI.map === 'gov') return '<span>Colore del partito del presidente di Regione</span>';
  return '<span><i class="dot" style="--c:#ff2d3d"></i>entro 30 settimane</span><span><i class="dot" style="--c:#8a3a40"></i>entro 80</span>';
}
function openRegion(rid) {
  const r = REGIONS_DEF.find(x => x.id === rid), st = G.regions[rid], s = regionShares(rid);
  const top = Object.keys(s).sort((a, b) => s[b] - s[a]).slice(0, 8);
  const gpName = G.parties[st.gp] ? P(st.gp).short : { AUT: 'autonomisti', CIVD: 'civico, centrodestra', CIVS: 'civica, centrosinistra' }[st.gp];
  let h = head(r.n, `${fmt1(r.el)} milioni di elettori · ${AREAS[r.area]}`);
  h += `<div class="card tight"><div class="row">${portrait(st.gov, 48, { party: G.parties[st.gp] ? st.gp : undefined })}<div class="grow"><div class="tiny muted">Presidente della Regione</div><b>${esc(st.gov)}</b> <span class="small muted">(${esc(gpName)})</span></div></div><div class="small mt">${icon('calendar', 16)} Prossime regionali: <b>${fmtDate(st.next)}</b> (${weeksLeft(st.next)})</div></div>`;
  h += sec('Intenzioni di voto') + `<div>${top.map(id => `<div class="res-row" style="grid-template-columns:70px 1fr 54px">${partyChip(id)}${barH(s[id], s[top[0]] * 1.1, P(id).color)}<span class="pct small">${fmt1(s[id])}%</span></div>`).join('')}</div>`;
  if (myPid() === 'MIO' || isLeader()) h += `<div class="small muted mt">Radicamento di ${esc(myParty().short)}: <b>${fmt0(((G.myReg[rid] || 1) - 1) * 100 + 100)}%</b> della media${G.player.region === rid ? ' · è la tua regione' : ''}</div>`;
  h += `<div class="col mt2"><button class="btn pri block" onclick="closeSheet();doComizio('${rid}')">${icon('mega')} Comizio in ${r.n} · ⚡1 · 20k€</button>`;
  if (isPremier()) h += `<button class="btn block" onclick="closeSheet();doVisita('${rid}')">${icon('building')} Visita istituzionale · ⚡2</button>`;
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
    h += sec('Intenzioni di voto') + `<div class="card"><div class="seg" style="max-width:220px;margin:0 auto 8px"><button class="${UI.range === 12 ? 'on' : ''}" onclick="UI.range=12;renderGame()">3 mesi</button><button class="${UI.range === 52 ? 'on' : ''}" onclick="UI.range=52;renderGame()">1 anno</button><button class="${UI.range === 999 ? 'on' : ''}" onclick="UI.range=999;renderGame()">Tutto</button></div>
      ${hist.length > 1 ? lineChart(show.map(id => ({ color: P(id).color, w: id === myPid() ? 3 : 1.8, pts: hist.map(x => [x.w, x.p[id] || 0]) })), { ymin: 0, fmt: v => Math.round(v) + '%' }) : '<div class="small muted">Il grafico si riempie con il passare delle settimane.</div>'}</div>`;
    const old = G.hist.polls.length > 4 ? G.hist.polls[G.hist.polls.length - 5].p : {};
    h += `<div class="card tight"><div class="list">${ids.map(id => { const d = P(id).poll - (old[id] || P(id).poll); return `<div class="li click" onclick="openParty('${id}')">${partyMark(id, 34)}<div class="grow"><div class="row between"><b class="small">${esc(P(id).name)}</b><b>${fmt1(P(id).poll)}%</b></div><div class="row between"><div class="grow">${barH(P(id).poll, P(ids[0]).poll * 1.05, P(id).color, true)}</div><span class="tiny ${d >= 0 ? 'good' : 'bad'}" style="width:44px;text-align:right">${d >= 0 ? '▲' : '▼'}${fmt1(Math.abs(d))}</span></div></div>${spark(histOf('poll', 12, id), P(id).color, 54, 22)}</div>`; }).join('')}</div><div class="tiny dim mt">Altri: ${fmt1(OTHER_POLL)}% · Soglia di sbarramento 3%</div></div>`;
    h += sec('Coalizioni') + `<div class="card">${G.coalitions.map(c => { const s = c.members.reduce((t, m) => t + (G.parties[m] ? P(m).poll : 0), 0); return `<div style="margin:8px 0"><div class="row between small"><b>${esc(c.name)}</b><b>${fmt1(s)}%</b></div><div style="position:relative;margin-top:4px">${barH(s, 60, c.color)}<i style="position:absolute;left:${42 / 60 * 100}%;top:-3px;bottom:-3px;width:2px;background:var(--cream);opacity:.7"></i></div><div class="row wrap" style="gap:3px;margin-top:6px">${c.members.map(partyChip).join('')}</div></div>`; }).join('')}<div class="tiny dim">La linea bianca è il 42%: la soglia del premio di maggioranza.</div></div>`;
  }
  if (v === 'partiti') {
    h += '<div class="mt"></div>';
    PIDS().sort((a, b) => P(b).poll - P(a).poll).forEach(id => {
      const p = P(id), me = id === myPid();
      const c = me ? 100 : compat(id, myPid()), r = me ? 0 : rel(id, myPid());
      const coal = coalitionOf(id);
      h += `<div class="card tight click" onclick="openParty('${id}')"><div class="row"><span class="av-badge">${leaderPortrait(id, 52)}<span class="pbadge" style="--c:${p.color}">${partyMark(id, 24)}</span></span><div class="grow"><div class="row between"><h3 class="ellipsis" style="font-size:16px">${esc(p.name)}</h3><b>${fmt1(p.poll)}%</b></div><div class="tiny muted ellipsis">${esc(leaderName(id))} · ${p.seatsC} dep. · ${p.seatsS} sen.${coal ? ' · ' + esc(coal.name) : ''}${inGov(id) ? ' · al governo' : ''}</div>
        ${me ? '<div class="tiny gold mt">Il tuo partito</div>' : `<div class="row mt" style="gap:6px"><span class="tiny muted" style="width:52px">Affinità</span><div class="grow">${barH(c, 100, pctColor(c), true)}</div><span class="tiny muted" style="width:56px">Rapporto</span><div class="grow">${barH(r + 100, 200, relColor(r), true)}</div></div>`}</div></div></div>`;
    });
  }
  if (v === 'alleanze') h += alleanzeHTML();
  return h;
}
function openParty(id) {
  const p = P(id), me = id === myPid();
  let h = `<div class="sheet-head"><div class="row grow"><span class="av-badge">${leaderPortrait(id, 70)}<span class="pbadge" style="--c:${p.color}">${partyMark(id, 26)}</span></span><div class="grow"><h2 style="font-size:22px">${esc(p.name)}</h2><div class="tiny muted">${esc(p.area)} · ${esc(p.family)}</div><div class="small">Leader: <b>${esc(leaderName(id))}</b></div></div></div><button class="xbtn" onclick="closeSheet()">${icon('x', 18)}</button></div>`;
  h += `<div class="grid3"><div class="kpi center"><div class="l">Sondaggi</div><div class="v">${fmt1(p.poll)}%</div>${spark(histOf('poll', 12, id), p.color, 70, 20)}</div><div class="kpi center"><div class="l">Deputati</div><div class="v">${p.seatsC}</div></div><div class="kpi center"><div class="l">Senatori</div><div class="v">${p.seatsS}</div></div></div>`;
  h += `<div class="card tight center mt">${partyLogoBig(id)}<div class="tiny muted mt">${me ? 'Il simbolo del tuo partito' : typeof LOGHI !== 'undefined' && LOGHI[id] ? 'Simbolo · Wikimedia Commons, pubblico dominio' : 'Stemma disegnato per il gioco: il simbolo ufficiale non ha una licenza libera'}</div></div>`;
  if (!me) {
    const c = compat(id, myPid()), r = rel(id, myPid());
    h += `<div class="card tight mt"><div class="row between small"><span>Affinità di idee con te</span><b style="color:${pctColor(c)}">${fmt0(c)}%</b></div>${barH(c, 100, pctColor(c), true)}<div class="row between small mt"><span>Rapporto con ${esc(firstName(p.leader))}</span><b style="color:${relColor(r)}">${relNum(r)} · ${relLabel(r)}</b></div>${barH(r + 100, 200, relColor(r), true)}
      ${never(id, myPid()) ? '<div class="small bad mt">Veto: alleanza normalmente impossibile</div>' : ''}${G.gov && inGov(id) ? `<div class="small mt">Soddisfazione nel governo: <b>${fmt0(G.gov.sat[id] || 0)}</b></div>` : ''}
      <div class="tiny muted mt">Il rapporto sale con incontri, voti comuni, interviste concilianti e trattative riuscite; scende con attacchi e tradimenti.</div></div>`;
  }
  h += sec(me ? 'Le idee' : 'Idee a confronto') + `<div>${AXIS_KEYS.map(k => { const x = (p.ax[k] + 10) / 20 * 100, y = (myParty().ax[k] + 10) / 20 * 100; return `<div style="margin:10px 0"><div class="row between tiny muted"><span>${AXES[k].l}</span><b style="color:var(--cream)">${AXES[k].n}</b><span>${AXES[k].r}</span></div><div style="position:relative;height:6px;border-radius:3px;background:rgba(255,255,255,.08);margin-top:5px">${!me ? `<i style="position:absolute;left:${y}%;top:-4px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:${myParty().color};border:2px solid var(--cream);opacity:.8"></i>` : ''}<i style="position:absolute;left:${x}%;top:-5px;width:16px;height:16px;margin-left:-8px;border-radius:50%;background:${p.color};border:2px solid var(--oro)"></i></div></div>`; }).join('')}</div>${!me ? `<div class="tiny dim">Pallino grande: ${esc(p.short)} · pallino piccolo: ${esc(myParty().short)}</div>` : ''}`;
  if (!me && isLeader()) {
    const myC = coalitionOf(myPid()), same = myC && myC.members.includes(id);
    h += `<div class="col mt2"><button class="btn block" onclick="closeSheet();doIncontro('${id}')">${icon('cup')} Incontro riservato con ${esc(firstName(p.leader))} · ⚡1</button>`;
    if (same) h += `<div class="small center good">Siete già alleati in ${esc(myC.name)}</div>`;
    else h += `<button class="btn gold block" onclick="closeSheet();openDeal('${id}')">${icon('hands')} Apri una trattativa di alleanza</button>`;
    h += `</div>`;
  }
  openSheet(h);
}
function alleanzeHTML() {
  let h = '';
  const myC = coalitionOf(myPid());
  const locked = G.flags.listsDeposited === G.cal.election;
  h += `<div class="card hero mt center">${medal('hands', 56)}<h3 class="mt">La tua posizione</h3><div class="small mt">${myC ? `${esc(myParty().short)} fa parte di <b>${esc(myC.name)}</b>. Candidato premier: <b>${myC.cand === 'PLAYER' ? 'tu' : esc(myC.cand || 'da decidere (primarie)')}</b>.` : `${esc(myParty().short)} corre da solo. Servono il 3% per entrare e il 42% di coalizione per il premio.`}</div>${locked ? '<div class="tag w mt">Liste depositate: alleanze bloccate fino al voto</div>' : ''}</div>`;
  if (isLeader()) h += `<details class="card tight"><summary class="small gold">${icon('info', 16)} Come funzionano le alleanze</summary><div class="howto mt">
    <div>Apri una <b>trattativa</b> con un partito: metti sul tavolo ministeri, leggi del loro programma, la candidatura a premier, posti in lista.</div>
    <div>Più l’<b>affinità</b> e il <b>rapporto</b> sono alti, meno devi concedere. Con un rapporto ottimo si può anche superare un veto, ma una parte degli elettori e dei parlamentari potrebbe non seguirti.</div>
    <div>Le promesse fatte vanno mantenute: se governi, gli alleati si aspettano quei ministeri e quelle leggi.</div>
    <div>Le alleanze si chiudono con il <b>deposito delle liste</b>, 6 settimane prima del voto.</div></div></details>`;
  G.coalitions.forEach(c => {
    const s = c.members.reduce((t, m) => t + (G.parties[m] ? P(m).poll : 0), 0);
    const mine = c.members.includes(myPid());
    h += `<div class="card"><div class="row between"><h3>${esc(c.name)}</h3><b class="gold" style="font-size:20px;font-weight:800">${fmt1(s)}%</b></div><div class="row wrap mt" style="gap:4px">${c.members.map(partyChip).join('')}</div><div class="small muted mt">Candidato premier: ${c.cand === 'PLAYER' ? '<b class="gold">tu</b>' : esc(c.cand || 'primarie da svolgere')}</div>`;
    if (isLeader() && !locked) {
      if (!mine && !myC) { const big = c.members.slice().sort((a, b) => P(b).poll - P(a).poll)[0]; h += `<button class="btn pri block mt" onclick="openDeal('${big}','${c.id}')">${icon('hands')} Tratta per entrare in ${esc(c.name)}</button>`; }
      if (mine) {
        if (c.cand !== 'PLAYER' && !(c.id === 'csx' && !c.cand)) h += `<button class="btn gold block mt" onclick="askPremiership('${c.id}')">${icon('crown')} Chiedi la candidatura a premier · ⚡4</button>`;
        if (c.id === 'csx' && !c.cand && !(G.primarie && G.primarie.player)) h += `<button class="btn gold block mt" onclick="joinPrimarie()">${icon('vote')} Candidati alle primarie · ⚡3</button>`;
        if (G.primarie && G.primarie.player && !G.primarie.done) h += `<div class="small gold mt">Sei candidato alle primarie (spinta ${fmt1(G.primarie.boost || 0)}). Usa «Campagna per le primarie» nelle azioni.</div>`;
        const others = PIDS().filter(id => !c.members.includes(id));
        if (others.length) h += `<div class="tiny muted mt">Invita un partito in ${esc(c.name)}:</div><div class="row wrap mt" style="gap:6px">${others.map(id => `<button class="chip" style="--c:${P(id).color};height:32px" onclick="openDeal('${id}')">${partyMark(id, 22)}${esc(P(id).short)}</button>`).join('')}</div>`;
        h += `<button class="btn red block mt" onclick="leaveCoalition()">Esci dalla coalizione</button>`;
      }
    }
    h += `</div>`;
  });
  if (isLeader() && !myC && !locked) h += `<div class="card"><h3>Fonda una tua coalizione</h3><div class="small muted mt">Tratta con un partito: se accetta nasce la tua coalizione e il candidato premier sei tu.</div><div class="row wrap mt" style="gap:6px">${PIDS().filter(id => id !== myPid()).map(id => `<button class="chip" style="--c:${P(id).color};height:32px" onclick="openDeal('${id}')">${partyMark(id, 22)}${esc(P(id).short)}</button>`).join('')}</div></div>`;
  if (!isLeader()) h += `<div class="small muted center mt">Le alleanze le decide ${esc(myParty().leader)}. Diventa leader per trattare tu.</div>`;
  return h;
}

// ============================================================
//  CONTI PUBBLICI E POTERI
// ============================================================
function contiTab() {
  const e = G.econ;
  const k = (l, v, cls, sub, m, hk) => `<div class="kpi ${m ? 'click' : ''}" ${m ? `onclick="openAdvice('${m}')"` : ''}><div class="l">${l}</div><div class="row between" style="align-items:flex-end"><div class="v ${cls || ''}">${v}</div>${spark(histOf(hk, 12), cls === 'bad' ? '#ff9c9c' : cls === 'good' ? '#7ee8b8' : '#ff2d3d', 58, 24)}</div>${sub ? `<div class="tiny muted">${sub}</div>` : ''}${m ? '<div class="tiny gold" style="font-weight:800;margin-top:3px">Come migliorarlo ›</div>' : ''}</div>`;
  const red = redMetrics();
  let h = '';
  if (red.length) h += `<div class="card hero" style="--pc:#ff6b6b"><h4>Indicatori in rosso</h4>${red.map(r => `<div class="li click" onclick="openAdvice('${r.k}')"><span class="nico u2">${icon(METRIC_ICON[r.k])}</span><div class="grow small"><b>${esc(r.t)}</b><div class="tiny muted">Le leggi che aiutano</div></div><span class="btn sm">Rimedi</span></div>`).join('')}</div>`;
  h += `<div class="grid2">${k('Crescita PIL', sgn(e.pil) + '%', e.pil < 0.4 ? 'bad' : e.pil > 1 ? 'good' : '', 'annua', 'pil', 'pil')}${k('Deficit / PIL', fmt1(e.deficit) + '%', e.deficit > 3 ? 'bad' : 'good', 'limite UE 3%', 'deficit', 'deficit')}${k('Debito / PIL', fmt1(e.debito) + '%', e.debito > 140 ? 'bad' : '', 'circa ' + fmt0(e.debito * e.pilNom / 100) + ' mld', 'deficit', 'debito')}${k('Spread', fmt0(e.spread), e.spread > 200 ? 'bad' : e.spread < 100 ? 'good' : 'warn', 'BTP-Bund', 'spread', 'spread')}${k('Inflazione', fmt1(e.infl) + '%', e.infl > 3 ? 'bad' : '', '', 'prezzi', 'infl')}${k('Disoccupazione', fmt1(e.dis) + '%', e.dis > 7.5 ? 'bad' : '', '', 'lavoro', 'dis')}</div>`;
  h += `<div class="row wrap mt" style="gap:6px"><span class="tag o">${icon('star')} Rating ${e.rating}</span><span class="tag ${e.pde ? 'b' : 'g'}">${icon('eu')} ${e.pde ? 'In procedura UE per deficit' : 'Fuori dalla procedura UE'}</span></div>`;
  const hist = G.hist.econ.slice(-UI.range);
  if (hist.length > 1) {
    h += sec('Spread') + `<div class="card">${lineChart([{ color: '#ff9c6b', pts: hist.map(x => [x.w, x.spread]) }], { ymin: 0, ref: 200 })}</div>`;
    h += sec('Deficit e crescita') + `<div class="card">${lineChart([{ color: '#ff6b6b', pts: hist.map(x => [x.w, x.deficit]) }, { color: '#34d399', pts: hist.map(x => [x.w, x.pil]) }], { ref: 3, fmt: v => fmt1(v) })}<div class="legend"><span><i class="dot" style="--c:#ff6b6b"></i>Deficit %</span><span><i class="dot" style="--c:#34d399"></i>PIL %</span></div></div>`;
  }
  const b = G.bills.find(x => x.type === 'manovra' && !x.dead);
  h += sec('Legge di bilancio') + `<div class="card">`;
  if (b) h += `<b>${esc(billName(b))}</b><div class="mt">${iterHTML(b)}</div><div class="small mt">Saldo misure: <b>${fmt1(budgetSum('c', b.measures))} mld</b></div><button class="btn sm mt" onclick="openBill(${b.id})">${icon('scales')} Pro e contro</button>`;
  else h += `<div class="small">Misure in vigore quest’anno: <b>${G.budget.active.length}</b> (saldo ${fmt1(budgetSum('c'))} mld). La prossima manovra si presenta a metà ottobre.</div>`;
  if (isPremier() && G.flags.manovraDue) h += `<button class="btn gold block mt" onclick="openManovra(${G.flags.manovraDue})">${icon('euro')} Prepara la manovra ${G.flags.manovraDue}</button>`;
  h += `</div>`;
  h += sec('Il Paese e i poteri') + `<div class="card tight"><div class="list">${Object.keys(GROUPS).map(gk => { const v = G.groups[gk]; return `<div class="pow click" onclick="openPower('${gk}')"><span class="nico" style="color:${relColorHex(v)}">${icon(GROUP_ICON[gk])}</span><div class="grow"><div class="row between"><b class="small">${GROUPS[gk].n}</b><span class="tiny" style="color:${relColorHex(v)};font-weight:800">${relNum(v)} · ${relLabel(v)}</span></div><div class="tiny muted">${GROUPS[gk].who}</div><div class="meter"><i style="left:${(v + 100) / 2}%"></i></div></div>${icon('chevron', 16)}</div>`; }).join('')}</div><div class="tiny muted mt">Tocca un potere per capire come migliorare il rapporto.</div></div>`;
  h += sec('Clima del Paese') + `<div class="card"><div class="small muted">Dove si colloca oggi l’opinione pubblica</div>${AXIS_KEYS.map(kk => { const x = (G.mood[kk] + 10) / 20 * 100; return `<div style="margin:10px 0"><div class="row between tiny muted"><span>${AXES[kk].l}</span><b style="color:var(--cream)">${AXES[kk].n}</b><span>${AXES[kk].r}</span></div><div style="position:relative;height:6px;border-radius:3px;background:rgba(255,255,255,.08);margin-top:5px"><i style="position:absolute;left:${x}%;top:-5px;width:16px;height:16px;margin-left:-8px;border-radius:50%;background:var(--oro);border:2px solid var(--cream)"></i></div></div>`; }).join('')}</div>`;
  return h;
}

// ============================================================
//  MENU E SCHEDE ACCESSORIE
// ============================================================
function menuItem(i, t, s, on) { return `<div class="li click" onclick="${on}"><span class="nico">${icon(i)}</span><div class="grow"><b>${t}</b>${s ? `<div class="tiny muted">${s}</div>` : ''}</div>${icon('chevron', 16)}</div>`; }
function openMenu() {
  openSheet(`${head('Menu')}<div class="card tight"><div class="list">
    ${menuItem('building', 'Il governo', G.gov ? esc(G.gov.name) : '', 'closeSheet();openGovernment()')}
    ${menuItem('user', 'Profilo e carriera', esc(G.player.name), 'closeSheet();openProfile()')}
    ${menuItem('palette', 'Crea il tuo avatar', 'Viso, capelli, occhiali, vestiti', 'closeSheet();openAvatarEditor()')}
    ${isLeader() ? menuItem('clipboard', 'Programma elettorale', G.program ? 'annunciato' : 'da presentare', 'closeSheet();openProgram()') : ''}
    ${menuItem('book', 'La tua storia', 'La linea del tempo della carriera', 'closeSheet();openTimeline()')}
    ${menuItem('trophy', 'Traguardi', Object.keys(G.ach || {}).length + ' su ' + ACHIEVEMENTS.length, 'closeSheet();openAchievements()')}
    ${menuItem('news', 'Archivio notizie', G.news.length + ' notizie', 'closeSheet();openNews()')}
    ${menuItem('key', 'Istituzioni e poteri', 'Quirinale, Camere, UE, parti sociali', 'closeSheet();openInstitutions()')}
    </div></div><div class="card tight"><div class="list">
    ${menuItem('save', 'Salva partita', 'Tre slot sul telefono', 'closeSheet();openSave()')}
    ${menuItem('upload', 'Esporta su file', 'Backup da conservare', 'exportSave()')}
    ${menuItem('cap', 'Tutorial', 'Rivedi la guida passo passo', 'closeSheet();startTutorial(0)')}
    ${menuItem('info', 'Come si gioca', 'Riassunto delle regole', 'closeSheet();openGuide()')}
    ${menuItem('star', 'Crediti', 'Loghi, fonti dei dati, avatar', 'closeSheet();openCredits()')}
    ${menuItem('door', 'Torna al menu iniziale', 'La partita resta salvata', "closeSheet();saveGame('auto');showSplash()")}
    </div></div><div class="tiny dim center">Difficoltà ${D().n} · ${G.legislature}ª legislatura</div>`);
}
function openCredits() {
  openSheet(`${head('Crediti')}<div class="card tight small" style="line-height:1.55">
    <b>Loghi dei partiti</b> — Wikimedia Commons, file in pubblico dominio: ${Object.values(LOGHI_FONTI).map(esc).join(', ')}. Per Fratelli d’Italia, AVS, Futuro Nazionale e Italia Viva non c’è un logo libero adatto: il gioco usa uno stemma disegnato con il colore del partito.<br><br>
    <b>Dati politici</b> — sondaggi di ottobre 2026 (Supermedia YouTrend-Agi, SWG, BiDiMedia, Termometro Politico), composizione dei gruppi da camera.it, governo da governo.it, legge elettorale 2026 (Il Post).<br><br>
    <b>Mappa</b> — confini regionali ISTAT (openpolis/geojson-italy).<br><br>
    <b>Avatar</b> — disegnati con il generatore di Laurera.<br><br>
    Palazzo Chigi è un gioco di simulazione: non è affiliato a nessun partito e gli eventi sono inventati.</div>`);
}
function openSave() {
  openSheet(`${head('Salva partita')}<div class="list">${['1', '2', '3'].map(s => { const i = slotInfo(s); return `<div class="li"><span class="nico">${icon('save')}</span><div class="grow"><b>Slot ${s}</b><div class="small muted">${i ? `${esc(i.name)} · ${esc(i.party)} · ${esc(i.date)}` : 'vuoto'}</div></div><button class="btn sm pri" onclick="saveGame('${s}');toast('Salvato nello slot ${s}','good');closeSheet()">Salva qui</button></div>`; }).join('')}</div><div class="tiny dim mt">La partita si salva anche da sola ogni settimana.</div>`);
}
function openNews() { openSheet(`${head('Archivio notizie')}<div class="list">${G.news.slice(0, 200).map(newsRow).join('')}</div>`); }
function openInstitutions() {
  const I = INSTITUTIONS;
  const row = (a, b) => `<div class="li"><span class="grow small muted">${a}</span><b class="small right">${esc(b)}</b></div>`;
  openSheet(`${head('Istituzioni e poteri')}<div class="card tight"><div class="list">
    ${row('Presidente della Repubblica', I.pdr + (G.cal.quirinale > G.week ? ` (fino al ${fmtDate(G.cal.quirinale, true)})` : ''))}${row('Presidente del Senato', I.presSenato)}${row('Presidente della Camera', I.presCamera)}
    ${row('Governatore Banca d’Italia', I.bankit)}${row('Presidente BCE', I.bce)}${row('Presidente Commissione UE', I.commissione)}${row('Commissario UE all’economia', I.commEco)}
    ${row('CGIL', I.cgil)}${row('CISL', I.cisl)}${row('UIL', I.uil)}${row('Confindustria', I.confindustria)}${row('Presidente CEI', I.cei)}${row('Santa Sede', I.papa)}</div></div>
    ${sec('Rapporti con i poteri')}<div class="card tight"><div class="list">${Object.keys(GROUPS).map(gk => `<div class="li click" onclick="openPower('${gk}')"><span class="nico" style="color:${relColorHex(G.groups[gk])}">${icon(GROUP_ICON[gk])}</span><b class="grow small">${GROUPS[gk].n}</b><span class="tiny" style="color:${relColorHex(G.groups[gk])}">${relLabel(G.groups[gk])}</span>${icon('chevron', 16)}</div>`).join('')}</div></div>
    ${sec('Referendum')}<div class="card tight"><div class="list">${G.referendums.length ? G.referendums.map(r => `<div class="li small"><span class="grow">${esc(getLaw(r.lawId).nome)} (${r.kind === 'conf' ? 'confermativo' : 'abrogativo'})</span><span>${r.done ? (r.res && r.res.won ? 'approvato' : 'respinto') : fmtDate(r.w, true)}</span></div>`).join('') : '<div class="small dim">Nessuno</div>'}</div></div>`);
}
function openGovernment() {
  const g = G.gov;
  if (!g) { openSheet(`${head('Il governo')}<div class="muted">Nessun governo in carica.</div>`); return; }
  let h = head(esc(g.name), `Presidente del Consiglio: ${g.premier === 'PLAYER' ? esc(G.player.name) : esc(g.premier)} · dal ${fmtDate(g.start)}`);
  h += `<div class="row wrap" style="gap:4px">${g.parties.map(partyChip).join('')}</div>`;
  if (g.vice && g.vice.length) h += `<div class="small mt">Vicepresidenti: <b>${g.vice.map(esc).join(', ')}</b></div>`;
  h += `<div class="card tight mt"><div class="list">${MINISTRIES.map(m => { const n = g.ministers[m.id]; const p = n ? person(n) : null; return `<div class="li">${n ? portrait(n, 38, { party: p && G.parties[p.party] ? p.party : undefined }) : `<span class="nico">${icon('user')}</span>`}<div class="grow"><div class="tiny muted">${m.port === 0 ? 'Senza portafoglio · ' : ''}${esc(m.n)}</div><b class="small">${n ? esc(n) : (g.interim === m.id ? 'interim del premier' : '<span class="dim">vacante</span>')}</b></div>${p ? (p.party === 'TEC' ? '<span class="tag">tecnico</span>' : p.party === 'IND' ? '<span class="tag">indip.</span>' : partyChip(p.party)) : ''}</div>`; }).join('')}</div></div>`;
  if (isPremier()) h += `<button class="btn gold block mt" onclick="closeSheet();openAction('rimpasto')">${icon('refresh')} Rimpasto di governo</button>`;
  openSheet(h);
}
function openProfile() {
  const p = G.player, bg = BACKGROUNDS.find(b => b.id === p.bg);
  const st = (l, v, max, c) => `<div class="row" style="margin:7px 0"><span class="small" style="width:100px">${l}</span><div class="grow">${barH(v, max, c)}</div><b class="small" style="width:40px;text-align:right">${fmt0(v)}</b></div>`;
  let h = `<div class="sheet-head"><div class="row grow"><span class="av-badge" onclick="closeSheet();openAvatarEditor()">${portrait(p.name, 76, { party: myPid() })}<span class="edit">${icon('edit')}</span></span><div class="grow"><h2 style="font-size:22px">${esc(p.name)}</h2><div class="small muted">${p.age} anni · ${esc(bg.n)} · ${regionName(p.region)}</div><div class="role-l">${esc(roleLabel())}</div></div></div><button class="xbtn" onclick="closeSheet()">${icon('x', 18)}</button></div>`;
  h += `<button class="btn block" onclick="closeSheet();openAvatarEditor()">${icon('palette')} Crea il tuo avatar</button>`;
  h += sec('Qualità') + `<div class="card">${st('Carisma', p.car, 10, 'var(--oro)')}${st('Competenza', p.comp, 10, '#5b8cff')}${st('Integrità', p.integ, 10, '#34d399')}${st('Fama', p.fama, 100, '#c77dff')}${st('Salute', p.salute, 100, pctColor(p.salute))}${st('Stress', p.stress, 100, p.stress > 70 ? 'var(--bad)' : 'var(--warn)')}</div>`;
  if (isLeader()) h += `<div class="card">${st('Organizzazione', G.org, 100, '#5b8cff')}${st('Credibilità', G.cred, 100, '#34d399')}<div class="small mt">Fondi del partito: <b>${euro(G.funds)}</b></div></div>`;
  else h += `<div class="card">${st('Seguito interno', p.seguito, 100, '#5b8cff')}<div class="row" style="margin:7px 0"><span class="small" style="width:100px">Col leader</span><div class="grow">${barH(p.rap + 100, 200, relColor(p.rap))}</div><b class="small" style="width:40px;text-align:right">${fmt0(p.rap)}</b></div></div>`;
  h += sec('Carriera') + `<div class="card tight"><div class="list">${RANKS.map((r, i) => `<div class="li"><span class="nico" style="${i <= p.rank ? '' : 'opacity:.4'}">${icon(i < p.rank ? 'check' : i === p.rank ? 'target' : 'lock')}</span><div class="grow"><b class="small ${i === p.rank ? 'gold' : i > p.rank ? 'dim' : ''}">${r.n}</b><div class="tiny muted">${r.d}</div></div></div>`).join('')}</div></div>`;
  h += sec('Bilancio') + `<div class="grid2">${[['Leggi approvate', G.stats.laws], ['Decreti', G.stats.decreti], ['Fiducie', G.stats.fiducie], ['Settimane da premier', G.stats.weeksPremier]].map(([a, b]) => `<div class="kpi"><div class="l">${a}</div><div class="v">${b}</div></div>`).join('')}</div>`;
  openSheet(h);
}
