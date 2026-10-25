// ============================================================
//  RIDISEGNO (scelte dell'utente da proposte-7):
//  A4 testata a barra · B2 personaggio in una riga · C3 da fare a pillole
//  D2 azioni in lista · E4+E2 leggi per categoria · F1 con popup Oggi/Diventa
//  H2 classifica · I4 eventi in chat · J4 menu attaccato in basso · L2 staff in elenco
// ============================================================

// ---------- J4: menu con i nuovi nomi e icone ----------
(function () {
  const S = d => SVG(d);
  const set = {
    home: ['Home', S('<path d="M3 11 12 4l9 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>')],
    leggi: ['Decreti', S('<path d="M7 3h10v18l-5-3-5 3V3Z"/><path d="M10 8h4M10 12h4"/>')],
    aula: ['Parlamento', S('<path d="M3 18a9 9 0 0 1 18 0"/><path d="M7.5 18a4.5 4.5 0 0 1 9 0"/><path d="M2 21h20"/>')],
    italia: ['Nazione', S('<path d="M9 3c1 2 3 2 3 4s2 3 2 5 3 2 4 3l2 2-2 1-2-1-1 3-2-1v-3l-3-3-1-3-2-2V4Z"/><path d="M6 17l2 1-1 2-2-1Z"/>')],
    partiti: ['Partiti', S('<path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/>')],
    conti: ['Economia', S('<path d="M3 17l5-5 4 3 7-8"/><path d="M15 7h4v4"/>')],
  };
  TABS.forEach(t => { if (set[t.id]) { t.n = set[t.id][0]; t.svg = set[t.id][1]; } });
})();
navHTML = function () {
  const live = typeof pendingVoteIds === 'function' ? pendingVoteIds().length : 0;
  return `<nav class="nav4">${TABS.map(t => `<button type="button" class="n4 ${UI.tab === t.id ? 'on' : ''}" onclick="goTab('${t.id}')" title="${t.n}">${t.svg}${UI.tab === t.id ? `<span>${t.n}</span>` : ''}${t.id === 'aula' && live && UI.tab !== 'aula' ? `<i class="bd">${live}</i>` : ''}</button>`).join('')}</nav>`;
};


// ---------- L2: staff in elenco ----------
staffHTML = function () {
  ensureStory();
  return `<div class="list2">${Object.keys(STAFF_ROLES).map(r => { const s = G.staff[r]; return `<button class="r2" onclick="openStaff('${r}')">${s ? portrait(s.n, 32, { female: !!s.f }) : `<span class="ph2">${icon('plus', 14)}</span>`}<span class="grow"><b>${esc(STAFF_ROLES[r].n)}</b>${s ? `<em>${esc(s.n)}</em>` : ''}</span><span class="${s ? 'y' : 'm'}">${s ? '★'.repeat(s.liv) : 'da scegliere'}</span></button>`; }).join('')}</div>`;
};

// ---------- E4 + E2: catalogo per categoria, aperto mostra la tabella ----------
UI.lawOpen = UI.lawOpen || {};
function lawRowHTML(l, opt, extra) {
  const now = G.laws[l.id], busy = G.bills.find(b => !b.dead && b.lawId === l.id);
  return `<div class="lr" onclick="openLaw('${l.id}'${opt !== undefined ? ',' + opt : ''})"><i style="background:${CAT_COLOR[l.cat] || '#ffe14d'}"></i><div class="grow" style="min-width:0"><b class="ellipsis">${esc(opt !== undefined ? l.opts[opt].t : l.nome)}</b><span class="ellipsis">${opt !== undefined ? esc(l.nome) : esc(l.opts[now].t)}</span>${extra || ''}</div>${busy ? `<em class="y">in aula</em>` : ''}${icon('chevron', 14)}</div>`;
}
lawListHTML = function () {
  if (UI.lawMetric) {
    const best = bestLawsFor(UI.lawMetric, 15).filter(x => visibleLaws().includes(x.l));
    return best.length ? `<div class="tbl2">${best.map(x => lawRowHTML(x.l, x.i, effChipsHTML(x.effs, x.mine))).join('')}</div>` : '<div class="muted center mt2">Nessuna riforma disponibile.</div>';
  }
  const q = UI.lawQ.trim().toLowerCase();
  const all = visibleLaws().filter(l => !q || (l.nome + ' ' + l.attuale + ' ' + l.opts.map(o => o.t).join(' ')).toLowerCase().includes(q));
  if (!all.length) return '<div class="muted center mt2">Nessuna legge trovata</div>';
  if (q) return `<div class="tbl2">${all.map(l => lawRowHTML(l)).join('')}</div>`;
  return Object.keys(LAW_CATS).filter(c => all.some(l => l.cat === c)).map(c => {
    const ls = all.filter(l => l.cat === c), open = !!UI.lawOpen[c];
    return `<div class="cat4 ${open ? 'open' : ''}"><button class="ch4" onclick="UI.lawOpen['${c}']=!UI.lawOpen['${c}'];$('#lawlist').innerHTML=lawListHTML()"><span style="color:${CAT_COLOR[c] || '#ffe14d'}">${icon(CAT_ICON[c] || 'folder', 16)}</span><b class="grow">${esc(c)}</b><span class="m">${ls.length}</span><span class="y">${open ? '▾' : '▸'}</span></button>${open ? `<div class="tbl2">${ls.map(l => lawRowHTML(l)).join('')}</div>` : ''}</div>`;
  }).join('');
};

// ---------- F1: Oggi / Diventa con spiegazione a comparsa ----------
function lawOptPop(id, opt, ev) {
  if (ev) ev.stopPropagation();
  const l = getLaw(id); if (!l) return;
  const S = typeof SPIEGA !== 'undefined' && SPIEGA[id], o = S && S.o && S.o[opt];
  const el = document.createElement('div'); el.className = 'pop4';
  el.innerHTML = `<div class="pb4"><div class="lbl4">${esc(l.nome)}</div><h3>${esc(l.opts[opt].t)}</h3><p>${esc(l.opts[opt].d || '')}</p>${S ? `<p class="m">${esc(S.s)}</p>` : ''}${o ? `<div class="k4">In pratica</div><p>${esc(o[0])}</p><div class="gp4"><div><span class="g">Ci guadagna</span>${esc(o[1])}</div><div><span class="r">Ci perde</span>${esc(o[2])}</div></div>` : ''}<div class="tiny m center mt">tocca ovunque per chiudere</div></div>`;
  el.onclick = () => el.remove();
  document.body.appendChild(el);
}
billChangeHTML = function (b) {
  if (b.type === 'manovra') { const c = b.measures.reduce((s, id) => s + (BUDGET_BY_ID[id] ? BUDGET_BY_ID[id].c : 0), 0); return `<div class="bchg"><span class="o">${b.measures.length} misure di spesa e coperture</span><span class="n">${c > 0 ? '+' : ''}${fmt1(c)} mld sul deficit</span></div>`; }
  if (!b.lawId) return '';
  const l = getLaw(b.lawId), from = b.type === 'dl' && b.dlFrom !== undefined ? b.dlFrom : b.from;
  return `<div class="bchg"><span class="o" onclick="lawOptPop('${b.lawId}',${from},event)"><i>Oggi</i>${esc(l.opts[from].t)}</span><span class="ar">${icon('chevron', 14)}</span><span class="n" onclick="lawOptPop('${b.lawId}',${b.opt},event)"><i>Diventa</i>${esc(l.opts[b.opt].t)}</span></div>`;
};

// ---------- I4: eventi come chat ----------
const LOOK_KICKER = { tv: 'In diretta TV', paper: 'Sui giornali', call: 'Al telefono', social: 'Sui social', chat: 'In chat' };
function eventChatHTML(ev, item, v) {
  const c = item.ctx || {}, look = ev.look || (typeof EVENT_LOOK !== 'undefined' && EVENT_LOOK[ev.id]);
  let face, who;
  if (c.p && G.parties[c.p]) { face = leaderPortrait(c.p, 40); who = P(c.p).leader; }
  else if (c.n && person(c.n)) { face = portrait(c.n, 40, { party: person(c.n).party }); who = c.n; }
  else { const s = G.staff && (G.staff.portavoce || G.staff.gabinetto); face = s ? portrait(s.n, 40, { female: !!s.f }) : `<span class="ph2">${icon('phone', 18)}</span>`; who = s ? s.n + ' · staff' : 'Il tuo staff'; }
  return `<div class="ev4"><div class="kk">${esc(LOOK_KICKER[look] || 'Notizia')} · ${fmtDate(G.week, true)}</div>
    <div class="msg">${face}<div class="bb"><span class="who">${esc(who)}</span><b>${esc(v.title)}</b><p>${esc(v.text)}</p></div></div>
    ${v.choices.map((ch, i) => `<div class="ans" onclick="chooseEvent(${i})"><div class="ab">${esc(ch.t)}</div><div class="fx4">${fxChips(ch.fx, ch.run && !ch.fx ? '<span class="n">• esito incerto</span>' : '')}</div></div>`).join('')}</div>`;
}

// ---------- testata: a tutta larghezza, voci divise da un punto, capitale politico in fondo ----------
topbar = function () {
  const mp = myParty(), d0 = dateOf(G.week);
  const old = G.hist.polls.length > 5 ? G.hist.polls[G.hist.polls.length - 5].p[myPid()] : mp.poll;
  const d = mp.poll - (old || mp.poll);
  const third = topbarThird().replace('class="stat"', 'class="s4"');
  const dot = '<i class="dot5">·</i>';
  return `<div class="topbar t5"><div class="tb5">
    <span class="dt">${fmtDate(G.week).toUpperCase()}</span>${dot}
    <span class="s4" onclick="goTab('partiti')">${esc(mp.short)} <b>${fmt1(mp.poll)}%</b><em class="${d >= 0 ? 'g' : 'r'}">${d >= 0 ? '▲' : '▼'}${fmt1(Math.abs(d))}</em></span>${dot}
    ${third}${dot}
    <span class="s4 y" onclick="toast('Capitale politico: si ricarica ogni settimana (+${pcIncome()})')">⚡${G.pc}</span>
    <button class="ib5" onclick="openMenu()">${icon('menu', 18)}</button>
  </div></div>`;
};

// ---------- il tuo personaggio: testo che va a capo, centrato sull'avatar; «Fiducia» ----------
homeHeroHTML = function () {
  const p = G.player, mp = myParty(), g = G.gov;
  return `<div class="hero2" style="--pc:${mp.color}"><span class="av-badge" onclick="openAvatarEditor()">${portrait(p.name, 48, { party: myPid() })}</span>
    <div class="grow tx2"><b class="nm">${esc(p.name)}</b><div class="rl">${esc(roleLabel())}</div></div>
    <div class="nums"><div><span>Sondaggio</span><b>${fmt1(mp.poll)}%</b></div>${g ? `<div><span>Fiducia</span><b style="color:${pctColor(g.approval * 1.4)}">${fmt0(g.approval)}%</b></div>` : ''}</div></div>
    <div class="hero2-sub">${icon('coin', 13)} ${euro(G.funds)} · fama ${fmt0(p.fama)} · stress ${fmt0(p.stress)} · ${!isLeader() ? esc(RANKS[p.rank].n) : (mp.seatsC + mp.seatsS) + ' parlamentari'}</div>`;
};

// ---------- Info: cose da fare (solo politica e governo) + scadenze in arrivo ----------
function infoHTML() {
  const skip = /^(Sfida aperta|Capitale politico|Sei molto stressato)/;
  const todo = notifications().filter(n => !skip.test(n.t));
  const dl = [];
  if (G.cal.election > G.week) dl.push({ w: G.cal.election, i: 'vote', t: 'Elezioni politiche' });
  const y = yearOf(G.week); dl.push({ w: weekOf(`${monthOf(G.week) > 9 ? y + 1 : y}-10-10`), i: 'euro', t: 'Manovra' });
  Object.entries(G.regions).sort((a, b) => a[1].next - b[1].next).slice(0, 2).forEach(([rid, st]) => dl.push({ w: st.next, i: 'map', t: `Regionali ${regionName(rid)}` }));
  if (G.cal.quirinale > G.week) dl.push({ w: G.cal.quirinale, i: 'building', t: 'Nuovo Capo dello Stato' });
  G.referendums.filter(r => !r.done).forEach(r => dl.push({ w: r.w, i: 'pen', t: 'Referendum' }));
  dl.sort((a, b) => a.w - b.w);
  const on = x => x.i === 'vote' ? "UI.partiti='alleanze';goTab('partiti')" : x.i === 'map' ? "goTab('italia')" : x.i === 'euro' ? "infoExplain('manovra')" : x.i === 'building' ? "infoExplain('quirinale')" : "infoExplain('referendum')";
  return sec('Info') + `<div class="pills3">${todo.map(n => `<button class="p3 u${n.u}" onclick="${n.on}">${icon(n.ico, 14)}<span>${esc(n.t)}</span></button>`).join('')}${dl.map(x => `<button class="p3 due3" onclick="${on(x)}">${icon(x.i, 14)}<span>${esc(x.t)} · ${weeksLeft(x.w)}</span></button>`).join('')}</div>`;
}

// ---------- niente più tasto «avanti veloce» ----------
fabHTML = _fabHTMLUi;

// ---------- logo nuovo: facciata di Palazzo Chigi in giallo su nero ----------

// facciata di Palazzo Chigi su piazza Colonna, gialla su nero
function chigiSVG() {
  const Y = '#ffe14d', K = '#000';
  let w = '';
  const cols = [16, 25, 34, 61, 70, 79];
  cols.forEach(x => { w += `<rect x="${x}" y="45" width="5" height="9" fill="${K}"/><path d="M${x - 1} 45 L${x + 2.5} 42 L${x + 6} 45Z" fill="${K}"/>`; });
  cols.forEach(x => { w += `<rect x="${x}" y="60" width="5" height="8" fill="${K}"/>`; });
  cols.forEach(x => { w += `<rect x="${x}" y="74" width="5" height="7" fill="${K}"/>`; });
  [43, 52].forEach(x => { w += `<rect x="${x}" y="45" width="5" height="9" fill="${K}"/><path d="M${x - 1} 45 L${x + 2.5} 42 L${x + 6} 45Z" fill="${K}"/>`; });
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${K}"/><g transform="translate(15 15.4) scale(.7)">
    <path d="M50 8V30" stroke="${Y}" stroke-width="1.6"/><rect x="50.8" y="8" width="4.4" height="7" fill="#009246"/><rect x="55.2" y="8" width="4.4" height="7" fill="#fff"/><rect x="59.6" y="8" width="4.4" height="7" fill="#ce2b37"/>
    <rect x="12" y="30" width="76" height="4" fill="${Y}"/><rect x="7" y="34" width="86" height="5" fill="${Y}"/>
    <rect x="10" y="39" width="80" height="48" fill="${Y}"/>
    <rect x="10" y="56" width="80" height="1.6" fill="${K}"/><rect x="10" y="70.5" width="80" height="1.6" fill="${K}"/>
    ${w}
    <rect x="40" y="58" width="20" height="2.4" fill="${K}"/><rect x="41" y="60.4" width="1.6" height="3.6" fill="${K}"/><rect x="57.4" y="60.4" width="1.6" height="3.6" fill="${K}"/>
    <path d="M44 87V77a6 6 0 0 1 12 0v10Z" fill="${K}"/><rect x="39.5" y="72" width="2.4" height="15" fill="${K}"/><rect x="58.1" y="72" width="2.4" height="15" fill="${K}"/>
    <rect x="4" y="87" width="92" height="4" fill="${Y}"/></g></svg>`;
}
logoChigi = function (size) { return `<span class="logo-chigi lg2" style="--ls:${size}px">${chigiSVG()}</span>`; };

// ---------- spiegazioni delle scadenze toccate in Info ----------
function infoExplain(k) {
  const y = yearOf(G.week), wm = weekOf(`${monthOf(G.week) > 9 ? y + 1 : y}-10-10`);
  const T = {
    manovra: ['La manovra', `Ogni anno a metà ottobre il governo presenta la legge di bilancio: decide spese, tagli e tasse dell’anno dopo e quanto deficit fare. Va approvata da Camera e Senato entro il 31 dicembre, altrimenti scatta l’esercizio provvisorio. Prossima: ${weeksLeft(wm)}.`, isPremier() ? 'Da premier la scrivi tu: scegli le misure, guardi il deficit e il parere di Bruxelles.' : 'Se non sei al governo puoi votarla in aula e criticarla in TV.'],
    quirinale: ['Il nuovo Capo dello Stato', `Il mandato del Presidente della Repubblica dura sette anni. Alla scadenza Camera, Senato e delegati regionali lo eleggono a scrutinio segreto: nei primi tre voti servono i due terzi, poi basta la maggioranza assoluta. Elezione ${weeksLeft(G.cal.quirinale)}.`, 'Se guidi un partito puoi proporre un nome e trattare con gli altri.'],
    referendum: ['Il referendum', 'Gli italiani votano sì o no per cancellare una legge (o confermare una riforma costituzionale). Per i referendum abrogativi serve che voti più della metà degli elettori.', 'Puoi fare campagna per il sì o per il no.'],
  }[k];
  if (!T) return;
  openSheet(`${head(esc(T[0]))}<p style="line-height:1.55">${esc(T[1])}</p><div class="card tight mt"><div class="small">${esc(T[2])}</div></div>`);
}

// ---------- menu a pagina intera, voci in maiuscolo ----------
openMenu = function () {
  const row = (i, t, s, on) => `<button class="m5" onclick="${on}"><span class="mi5">${icon(i, 18)}</span><span class="grow"><b>${t}</b>${s ? `<em>${s}</em>` : ''}</span>${icon('chevron', 14)}</button>`;
  openSheet(`${head('Menu')}
    ${sec('Tu e il governo')}<div class="list5">
    ${row('building', 'Il governo', G.gov ? esc(G.gov.name) : '', 'closeSheet();openGovernment()')}
    ${row('user', 'Profilo e carriera', esc(G.player.name), 'closeSheet();openProfile()')}
    ${row('palette', 'Crea il tuo avatar', 'Viso, capelli, occhiali, vestiti', 'closeSheet();openAvatarEditor()')}
    ${isLeader() ? row('clipboard', 'Programma elettorale', G.program ? 'annunciato' : 'da presentare', 'closeSheet();openProgram()') : ''}
    ${row('book', 'La tua storia', 'La linea del tempo della carriera', 'closeSheet();openTimeline()')}
    ${row('trophy', 'Traguardi', Object.keys(G.ach || {}).length + ' su ' + ACHIEVEMENTS.length, 'closeSheet();openAchievements()')}
    ${row('key', 'Istituzioni e poteri', 'Quirinale, Camere, UE, parti sociali', 'closeSheet();openInstitutions()')}</div>
    ${sec('Media')}<div class="list5">
    ${row('news', 'Archivio notizie', G.news.length + ' notizie', 'closeSheet();openNews()')}
    ${row('mic', 'Giornalisti', 'Chi ti segue, chi ti attacca', 'closeSheet();openJournalists()')}
    ${row('news', 'Direttori dei giornali', 'Chi ti difende e chi ti attacca', 'closeSheet();openDirettori()')}
    ${row('phone', 'Sui social', 'Il feed e i tuoi follower', 'closeSheet();openFeed()')}</div>
    ${sec('Partita')}<div class="list5">
    ${row('save', 'Salva partita', 'Tre slot sul telefono', 'closeSheet();openSave()')}
    ${row('upload', 'Sposta la partita', 'Su un altro telefono: file o testo', 'closeSheet();openTransfer()')}
    ${row('palette', 'Stile grafico', styleNow() === 'bru' ? 'Brutalista: tocca per il classico' : 'Classico: tocca per il brutalista', "setStyle(styleNow() === 'bru' ? 'classico' : 'bru');closeSheet()")}
    ${row('radio', 'Suoni', soundOn() ? 'Attivi: tocca per spegnerli' : 'Spenti: tocca per accenderli', "setSound(!soundOn());closeSheet();toast(soundOn() ? 'Suoni attivi' : 'Suoni spenti')")}
    ${row('cap', 'Tutorial', 'Rivedi la guida passo passo', 'closeSheet();startTutorial(0)')}
    ${row('info', 'Come si gioca', 'Riassunto delle regole', 'closeSheet();openGuide()')}
    ${row('search', 'Diagnostica', 'Gli ultimi errori, da mandarmi', 'closeSheet();openDiagnostics()')}
    ${row('star', 'Crediti', 'Loghi, fonti dei dati, avatar', 'closeSheet();openCredits()')}
    ${row('door', 'Torna al menu iniziale', 'La partita resta salvata', "closeSheet();saveGame('auto');showSplash()")}</div>
    <div class="tiny m center mt2">Difficoltà ${D().n} · ${G.legislature}ª legislatura</div>`, { full: true });
};

// ---------- stellina «Pianifica» con anteprima: le azioni che farebbe sono evidenziate ----------
function planPreview() {
  if (G.phase !== 'normale') return { ids: [], pc: 0 };
  const saved = { used: Object.assign({}, G.usedActs || {}), pc: G.pc, funds: G.funds, stress: G.player.stress }, ids = [];
  try {
    for (let k = 0; k < 6; k++) {
      const recs = recommendedActions().filter(r => r.id !== 'tv' && r.id !== 'dibattito' && r.id !== 'riposo');
      const r = recs[0]; if (!r) break;
      const a = ACTIONS.find(x => x.id === r.id);
      if (r.id === 'comizio') { if (G.funds < 20 || G.pc < 1) break; G.pc -= 1; G.funds -= 20; markUsed('comizio'); ids.push('comizio'); continue; }
      if (a.custom || !a.run) { markUsed(r.id); continue; }
      const c = actionCost(a); if (G.pc < c) break;
      G.pc -= c; if (a.funds) G.funds -= a.funds; markUsed(r.id); ids.push(r.id);
    }
  } catch (e) { console.error(e); }
  const spent = saved.pc - G.pc;
  G.usedActs = saved.used; G.pc = saved.pc; G.funds = saved.funds; G.player.stress = saved.stress;
  return { ids, pc: spent };
}
function planStarHTML(P5) {
  if (!P5.ids.length) return `<span class="starb2 off">${icon('star', 13)} niente da fare</span>`;
  return `<button class="starb2" onclick="autoPlan()" title="Fai le azioni evidenziate">${icon('star', 13)} ${P5.ids.length} ${P5.ids.length > 1 ? 'azioni' : 'azione'} · ⚡${P5.pc}</button>`;
}
