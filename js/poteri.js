// ============================================================
//  IL PAESE E I POTERI · LA TRATTATIVA DI ALLEANZA
// ============================================================

// ---------- come funziona ogni potere ----------
const POWERS_INFO = {
  sind: { chi: 'Le tre grandi confederazioni (CGIL, CISL, UIL): milioni di lavoratori e pensionati iscritti.',
    su: ['Leggi su salari, pensioni e sicurezza sul lavoro', 'Il «Tavolo con le parti sociali» da premier', 'Partecipare alle loro manifestazioni', 'In manovra: taglio del cuneo e rinnovi dei contratti'],
    giu: ['Precettare gli scioperi', 'Tagli a pensioni e welfare', 'Più libertà di licenziare', 'Ignorare le loro piattaforme'],
    alto: 'Pace sociale: se governi, il consenso del governo sale un po’.', basso: 'Scioperi generali e piazze contro il governo (sotto −15), consenso in calo.' },
  conf: { chi: 'Confindustria e le associazioni delle imprese: chi investe, assume e produce.',
    su: ['Meno tasse sulle imprese e sul lavoro', 'Incentivi agli investimenti (Transizione 5.0)', 'Grandi opere ed energia meno cara', 'Il «Tavolo con le parti sociali»'],
    giu: ['Nuove tasse, patrimoniale ed extraprofitti', 'Più burocrazia e vincoli', 'Nazionalizzazioni', 'Conti pubblici fuori controllo'],
    alto: 'Le imprese investono: la crescita del PIL accelera.', basso: 'Investimenti fermi: il PIL cresce meno.' },
  chiesa: { chi: 'La Conferenza episcopale italiana e la Santa Sede: parlano a milioni di elettori cattolici.',
    su: ['Aiuti alle famiglie e ai figli', 'Lotta alla povertà e accoglienza dei migranti', 'Ascoltare gli appelli del Papa', 'Scuole paritarie e terzo settore'],
    giu: ['Fine vita e cannabis legale', 'Linea dura sui migranti', 'Tagli al welfare'],
    alto: 'L’elettorato cattolico ti segue: piccolo aiuto al consenso.', basso: 'Critiche dei vescovi: il consenso cala un po’.' },
  ue: { chi: 'La Commissione europea: controlla i conti dei Paesi membri e i fondi del PNRR.',
    su: ['Deficit sotto il 3% e debito in calo', 'Una «Missione a Bruxelles»', 'Rispettare gli impegni del PNRR', 'Votare con gli alleati europei'],
    giu: ['Deficit oltre il limite', 'Scontri pubblici con Bruxelles', 'Veti in Consiglio europeo'],
    alto: 'Flessibilità sui conti più facile e spread più basso.', basso: 'Niente flessibilità, giudizi duri sulla manovra e spread più alto.' },
  merc: { chi: 'Fondi, banche e agenzie di rating che comprano i titoli di Stato italiani.',
    su: ['Conti in ordine: deficit e debito in calo', 'Un governo stabile', 'Privatizzazioni e riforme pro mercato'],
    giu: ['Deficit oltre il 3%', 'Crisi di governo', 'Tasse sulle banche e nazionalizzazioni'],
    alto: 'Spread più basso: interessi sul debito più leggeri (conta molto se governi).', basso: 'Spread più alto e rischio di declassamento del rating.' },
  quir: { chi: 'Il Presidente della Repubblica: firma leggi, decreti e nomine dei ministri.',
    su: ['Pochi decreti, solo se urgenti', 'Ministri competenti e senza ombre', 'Unità nazionale nelle emergenze', 'Rispetto per le istituzioni'],
    giu: ['Troppi decreti-legge', 'Leggi a rischio di incostituzionalità', 'Ministri discussi', 'Attacchi ai magistrati'],
    alto: 'Firma decreti e nomine senza problemi.', basso: 'Sotto zero può rifiutare i decreti; sotto −30 la Consulta boccia più facilmente le tue leggi.' },
  mag: { chi: 'L’Associazione nazionale magistrati e il Consiglio superiore della magistratura.',
    su: ['Più risorse e personale per i tribunali', 'Difendere l’indipendenza dei giudici', 'Leggi severe contro mafia e corruzione'],
    giu: ['Separazione delle carriere', 'Limiti alle intercettazioni', 'Attacchi ai giudici'],
    alto: 'Clima disteso sulle riforme della giustizia.', basso: 'Scontro aperto: polemiche e comunicati che, se governi, costano consenso.' },
  media: { chi: 'TV, giornali e grandi siti di informazione.',
    su: ['Interviste riuscite e conferenze stampa', 'Rispetto della libertà di stampa', 'Essere disponibili con i giornalisti'],
    giu: ['Gaffe e risposte evasive', 'Querele ai giornalisti', 'Nomine RAI di parte'],
    alto: 'Più spazio: interviste e social ti fanno crescere di più (fino a +25% di fama).', basso: 'Copertura ostile: ogni apparizione rende meno.' },
};
// chi si irrita quando migliori il rapporto con un potere
const POWER_RIVAL = { sind: 'conf', conf: 'sind' };

// leggi (riforme possibili) che piacciono di più a un potere
function lawsForPower(gk, n) {
  const out = [];
  allLaws().forEach(l => {
    const cur = G.laws[l.id];
    l.opts.forEach((o, i) => { if (i === cur) return; const d = (o.e[gk] || 0) - (l.opts[cur].e[gk] || 0); if (d > 0) out.push({ l, i, d }); });
  });
  out.sort((a, b) => b.d - a.d);
  const seen = new Set(), res = [];
  out.forEach(x => { if (!seen.has(x.l.id) && res.length < n) { seen.add(x.l.id); res.push(x); } });
  return res;
}
const canMeetPowers = () => isLeader() || isPremier() || !!G.player.minister;
function openPower(gk) {
  const g = GROUPS[gk], info = POWERS_INFO[gk], v = Math.round(G.groups[gk]), col = relColorHex(v);
  let h = `<div class="sheet-head"><div class="row grow">${medal(GROUP_ICON[gk], 56, col)}<div class="grow"><h2 style="font-size:22px">${g.n}</h2><div class="tiny muted">${esc(g.who)}</div></div></div><button class="xbtn" onclick="closeSheet()">${icon('x', 18)}</button></div>`;
  h += `<div class="card hero center" style="--pc:${col}"><div class="bignum" style="color:${col}">${relNum(v)}</div><div class="role-l" style="color:${col}">Rapporto ${relLabel(v)}</div><div class="meter" style="margin:14px 6px 4px"><i style="left:${(v + 100) / 2}%"></i></div><div class="row between tiny dim"><span>−100 ostili</span><span>+100 alleati</span></div><div class="small muted mt">${esc(info.chi)}</div></div>`;
  h += sec('Come migliorare') + `<div class="card tight"><div class="list">${info.su.map(x => `<div class="li small"><span class="good">${icon('check', 18)}</span><span class="grow">${esc(x)}</span></div>`).join('')}</div></div>`;
  h += sec('Cosa li allontana') + `<div class="card tight"><div class="list">${info.giu.map(x => `<div class="li small"><span class="bad">${icon('x', 18)}</span><span class="grow">${esc(x)}</span></div>`).join('')}</div></div>`;
  h += sec('Cosa cambia per te') + `<div class="who"><div class="w"><b>Rapporto buono</b>${esc(info.alto)}</div><div class="l"><b>Rapporto teso</b>${esc(info.basso)}</div></div>`;
  const laws = lawsForPower(gk, 4);
  if (laws.length) h += sec('Leggi che apprezzano') + laws.map(x => `<button class="choice" onclick="closeSheet();openLaw('${x.l.id}',${x.i})"><div class="tiny muted">${icon(LAW_CATS[x.l.cat] || 'doc', 14)} ${esc(x.l.nome)}</div><div class="t">${esc(x.l.opts[x.i].t)}</div><div class="fx"><span class="p">▲ ${g.n} +${Math.round(x.d)}</span></div></button>`).join('');
  if (canMeetPowers()) {
    const used = usedThisWeek('poteri');
    h += `<button class="btn gold block mt2" ${used || G.pc < 2 ? 'disabled' : ''} onclick="meetPower('${gk}')">${icon('key')} ${used ? 'Incontro già fatto questa settimana' : `Incontro riservato · ⚡2`}</button>`;
  } else h += `<div class="tiny muted center mt2">Gli incontri riservati sono per leader di partito, ministri e premier.</div>`;
  openSheet(h);
}
function pickPower() {
  openSheet(`${head('Incontra un potere', 'Un incontro riservato a settimana · ⚡2')}<div class="list">${Object.keys(GROUPS).map(gk => { const v = G.groups[gk]; return `<div class="pow click" onclick="closeSheet();meetPower('${gk}')"><span class="nico" style="color:${relColorHex(v)}">${icon(GROUP_ICON[gk])}</span><div class="grow"><div class="row between"><b class="small">${GROUPS[gk].n}</b><span class="tiny" style="color:${relColorHex(v)};font-weight:800">${relNum(v)}</span></div><div class="meter"><i style="left:${(v + 100) / 2}%"></i></div></div>${icon('chevron', 16)}</div>`; }).join('')}</div>`);
}
function meetPower(gk) {
  if (usedThisWeek('poteri')) return toast('Hai già incontrato un potere questa settimana', 'bad');
  if (!spendPC(2)) return toast('Capitale politico insufficiente', 'bad');
  markUsed('poteri');
  const gain = Math.round(6 + G.player.car * 0.6 + (isPremier() ? 2 : 0) + rnd(-2, 3));
  G.groups[gk] = clamp(G.groups[gk] + gain, -100, 100);
  const chips = [{ t: `${GROUPS[gk].n} +${gain}`, g: true }];
  const riv = POWER_RIVAL[gk];
  if (riv) { G.groups[riv] = clamp(G.groups[riv] - 2, -100, 100); chips.push({ t: `${GROUPS[riv].n} −2`, g: false }); }
  addNews(`${G.player.name} incontra ${GROUPS[gk].who}: colloquio riservato.`, 'mio');
  closeSheet(true); renderGame();
  flyResult(GROUP_ICON[gk], `Incontro con ${GROUPS[gk].n}`, chips, 'Rapporto migliorato');
}
// azione settimanale
ACTIONS.splice(ACTIONS.findIndex(a => a.id === 'riposo'), 0, { id: 'poteri', n: 'Incontra un potere', ico: 'key', cost: 2, show: () => canMeetPowers(), d: 'Sindacati, imprese, vescovi, Bruxelles, mercati, Quirinale, magistrati o giornali: un incontro riservato per migliorare i rapporti.', custom: () => pickPower() });

// effetti settimanali dei poteri
function powersTick() {
  const g = G.groups;
  Object.keys(GROUPS).forEach(k => { g[k] = clamp(g[k] * 0.995, -100, 100); });
  if (isPremier() && G.gov) {
    if (g.mag < -40 && chance(0.08)) { G.gov.popBank -= 0.6; addNews('L’Associazione nazionale magistrati attacca il governo: «Riforme punitive contro l’indipendenza dei giudici».', 'bad'); }
    if (g.sind < -40 && chance(0.06)) { G.gov.popBank -= 0.5; addNews(`${INSTITUTIONS.cgil} (CGIL) annuncia la mobilitazione: «Il governo non ascolta i lavoratori».`, 'bad'); }
    if (g.chiesa < -40 && chance(0.05)) { G.gov.popBank -= 0.4; addNews('Il presidente della CEI critica il governo: «Si dimenticano i più deboli».', 'bad'); }
  }
  // patti di alleanza scaduti
  if (G.pacts) G.pacts = G.pacts.filter(p => G.week <= p.until);
}

// ============================================================
//  TRATTATIVA DI ALLEANZA
// ============================================================
let DEAL = null;
const KEY_MIN_N = 'Economia, Esteri, Interno, Difesa o Giustizia';
function dealBase(pid, cid) {
  const me = myPid(), myC = coalitionOf(me);
  let kind, c = null, base, block = null, old = null;
  if (cid) { kind = 'join'; c = G.coalitions.find(x => x.id === cid); const js = joinScore(c, me); base = js.score; block = js.block || null; }
  else { kind = myC ? 'invite' : 'found'; c = myC || null; const sc = inviteScore(pid); base = sc.score; block = sc.block || null; old = sc.old || null; }
  // un veto si può superare solo se il veto riguarda te e il rapporto con quel leader è ottimo
  let override = false;
  if (block) {
    const other = kind === 'join' ? block : pid;
    const direct = never(me, other);
    if (direct && rel(other, me) >= 55) { override = true; base = Math.round(12 + (rel(other, me) - 55) * 0.8); }
  }
  return { kind, c, base, block, override, old };
}
function openDeal(pid, cid) {
  if (!isLeader()) return toast('Le alleanze le decide il leader del partito', 'bad');
  if (G.flags.listsDeposited === G.cal.election) return toast('Liste già depositate: alleanze bloccate fino al voto', 'bad');
  const b = dealBase(pid, cid);
  if (b.block && !b.override) {
    const who = b.kind === 'join' ? b.block : (never(myPid(), pid) ? pid : b.block);
    const r = rel(who, myPid());
    openSheet(`<div class="center">${medal('lock', 76, '#ff9c9c')}<h2 class="mt">Veto</h2><p class="muted">${esc(P(who).short)} ${b.kind === 'join' || never(myPid(), pid) ? `non si siede al tavolo con ${esc(myParty().short)}` : `non si alleerà mai con ${esc(P(pid).short)}`}: le distanze sono troppe.</p></div>
      ${never(myPid(), who) ? `<div class="card tight"><div class="small">Un veto si può superare solo con un rapporto <b>ottimo</b> con ${esc(P(who).leader)} (almeno +55). Oggi: <b style="color:${relColorHex(r)}">${relNum(r)}</b>.</div>${barH(r + 100, 200, relColor(r), true)}<div class="tiny muted mt">Incontri riservati, voti comuni in aula e interviste concilianti avvicinano i leader.</div></div><button class="btn block mt" onclick="closeSheet();doIncontro('${who}')">${icon('cup')} Incontro riservato con ${esc(firstName(P(who).leader))} · ⚡1</button>` : ''}`);
    return;
  }
  DEAL = { pid, cid: cid || null, offers: {}, law: null };
  // la legge bandiera che chiede il partito
  const best = allLaws().filter(l => !l.custom && !G.bills.some(x => !x.dead && x.lawId === l.id)).map(l => { const bo = bestOpt(pid, l); if (bo === G.laws[l.id]) return null; return { l, bo, v: lawGain(pid, l, G.laws[l.id], bo) * l.sal }; }).filter(Boolean).sort((a, b) => b.v - a.v)[0];
  if (best) DEAL.law = { lawId: best.l.id, opt: best.bo };
  openSheet('', { full: true });
  renderDeal();
}
function dealOffers() {
  const D0 = DEAL, b = dealBase(D0.pid, D0.cid), p = P(D0.pid), myC = coalitionOf(myPid());
  const list = [
    { id: 'min1', i: 'briefcase', t: 'Un ministero', s: 'Se governerai, un dicastero a loro', pts: 10 },
    { id: 'minKey', i: 'key', t: 'Un ministero chiave', s: KEY_MIN_N, pts: 18 },
    { id: 'vice', i: 'crown', t: `Vicepremier per ${firstName(p.leader)}`, s: 'Il numero due del governo', pts: 8 },
  ];
  if (D0.law) { const l = getLaw(D0.law.lawId), mine = lawGain(myPid(), l, G.laws[l.id], D0.law.opt); list.push({ id: 'law', i: 'flag', t: 'La loro legge bandiera nel programma', s: `${l.opts[D0.law.opt].t}${mine < -0.2 ? ' · contro le tue idee: −3 credibilità' : ''}`, pts: 9 }); }
  if ((b.kind === 'invite' || b.kind === 'found') && (!myC || myC.cand === 'PLAYER')) list.push({ id: 'premier', i: 'crown', t: `Candidato premier: ${p.leader}`, s: 'Rinunci a guidare tu la coalizione', pts: 28 });
  if (b.kind === 'join' && b.c && b.c.cand !== 'PLAYER') list.push({ id: 'pretendi', i: 'target', t: 'Pretendi la candidatura a premier', s: 'Guiderai tu la coalizione: la trattativa si complica', pts: -24 });
  list.push({ id: 'collegi', i: 'map', t: 'Collegi sicuri ai loro candidati', s: 'I tuoi militanti brontolano: −0,3 al tuo partito', pts: 6 });
  list.push({ id: 'fondi', i: 'coin', t: 'Contributo alla campagna comune', s: 'Costa 120k€', pts: 5, need: () => G.funds >= 120 });
  list.push({ id: 'serrata', i: 'clock', t: 'Trattativa a oltranza', s: 'Notti di riunioni: ⚡2 in più', pts: 6, need: () => G.pc >= 4 });
  return list;
}
function dealScore() {
  const b = dealBase(DEAL.pid, DEAL.cid);
  const pts = dealOffers().filter(o => DEAL.offers[o.id]).reduce((s, o) => s + o.pts, 0);
  const tot = clamp(b.base + pts, 0, 100);
  const prob = tot >= 50 ? clamp(0.55 + (tot - 50) / 60, 0.55, 0.97) : clamp(tot / 50 * 0.35, 0.02, 0.35);
  return { b, pts, tot, prob };
}
function renderDeal() {
  const p = P(DEAL.pid), sc = dealScore(), b = sc.b;
  const title = b.kind === 'join' ? `Entrare in ${esc(b.c.name)}` : b.kind === 'invite' ? `${esc(p.short)} in ${esc(b.c.name)}` : `Nuova coalizione con ${esc(p.short)}`;
  let h = `<div class="row between"><button class="btn sm" onclick="closeSheet()">‹ Chiudi</button><span class="tag o">${icon('hands')} Trattativa</span></div>
    <div class="center mt"><div class="row" style="justify-content:center;gap:18px">${portrait(G.player.name, 64, { party: myPid() })}<span class="gold" style="font-family:var(--serif);font-weight:900;font-size:20px">&amp;</span>${leaderPortrait(DEAL.pid, 64)}</div><h2 class="mt">${title}</h2><div class="small muted">Al tavolo: ${esc(p.leader)} (${esc(p.short)})</div></div>`;
  h += `<div class="card hero mt"><div class="row between small"><b>Disponibilità di ${esc(p.short)}</b><b class="${sc.tot >= 50 ? 'good' : 'bad'}">${sc.tot}/100</b></div><div class="deal-meter"><i style="width:${sc.tot}%"></i><b style="left:50%"></b></div>
    <div class="row between tiny muted" style="margin-top:4px"><span>Partenza ${b.base}${sc.pts ? ` · offerte ${sc.pts > 0 ? '+' : ''}${sc.pts}` : ''}</span><span>Serve 50 · probabilità ${Math.round(sc.prob * 100)}%</span></div>
    <div class="grid3 mt"><div class="center"><div class="tiny muted">Affinità</div><b style="color:${pctColor(compat(DEAL.pid, myPid()))}">${fmt0(compat(DEAL.pid, myPid()))}%</b></div><div class="center"><div class="tiny muted">Rapporto</div><b style="color:${relColorHex(rel(DEAL.pid, myPid()))}">${relNum(rel(DEAL.pid, myPid()))}</b></div><div class="center"><div class="tiny muted">Loro sondaggio</div><b>${fmt1(p.poll)}%</b></div></div></div>`;
  if (b.override) h += `<div class="card tight" style="border-color:rgba(255,107,107,.5)"><div class="row">${medal('alert', 40, '#ff9c9c')}<div class="small grow"><b class="bad">Alleanza oltre il veto.</b> Il rapporto con ${esc(p.leader)} è così buono che si può tentare, ma se va in porto: elettori delusi (−1,5 a entrambi i partiti) e più franchi tiratori nelle votazioni.</div></div></div>`;
  h += sec('Cosa metti sul tavolo');
  dealOffers().forEach(o => {
    const on = !!DEAL.offers[o.id], dis = o.need && !o.need() && !on;
    h += `<button class="offer ${on ? 'on' : ''}" ${dis ? 'disabled style="opacity:.45"' : ''} onclick="DEAL.offers['${o.id}']=!DEAL.offers['${o.id}'];renderDealKeep()"><span class="ck ${on ? 'on' : ''}">${on ? icon('check', 14) : ''}</span>${medal(o.i, 40)}<div class="grow"><b class="small">${esc(o.t)}</b><div class="tiny muted">${esc(o.s)}</div></div><span class="pts" style="${o.pts < 0 ? 'color:var(--bad)' : ''}">${o.pts > 0 ? '+' : ''}${o.pts}</span></button>`;
  });
  h += `<div class="tiny muted mt">Le promesse vanno mantenute: se diventi premier, gli alleati si aspettano quei ministeri e quelle leggi. Tradirle costa caro.</div>`;
  h += `<button class="btn gold block mt2" onclick="closeDeal()">${icon('hands')} Firma l’accordo · ⚡2 · ${Math.round(sc.prob * 100)}%</button>`;
  replaceSheet(h);
}
function renderDealKeep() { const sh = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null, st = sh ? sh.scrollTop : 0; vib(6); renderDeal(); if (sh) sh.scrollTop = st; }
function closeDeal() {
  const sc = dealScore(), b = sc.b, pid = DEAL.pid, p = P(pid), of = DEAL.offers;
  const extra = of.serrata ? 2 : 0;
  if (G.pc < 2 + extra) return toast('Capitale politico insufficiente', 'bad');
  if (of.fondi && G.funds < 120) return toast('Fondi insufficienti', 'bad');
  spendPC(2 + extra);
  closeSheet();
  if (!chance(sc.prob)) {
    addRel(pid, myPid(), -3);
    addNews(`Salta la trattativa tra ${myParty().short} e ${p.short}.`, 'parl');
    resultSheet('door', 'Niente accordo', `${esc(p.leader)}: «Non ci sono le condizioni». Migliora il rapporto o metti sul tavolo di più, poi riprova.`);
    renderGame(); return;
  }
  // accordo fatto
  let c = b.c;
  if (b.kind === 'join') {
    c.members.push(myPid()); c.members.forEach(m => addRel(m, myPid(), 5));
    coalitionDemands(c, myPid()).forEach(d => { if (!G.promises.some(x => x.lawId === d.lawId && x.opt === d.opt)) G.promises.push({ lawId: d.lawId, opt: d.opt, w: G.week, pact: d.party }); });
    if (of.pretendi) { c.cand = 'PLAYER'; c.candParty = myPid(); c.candLocked = true; }
  } else {
    if (!c) { c = { id: 'mia', name: `Coalizione ${myParty().name}`, members: [myPid()], cand: 'PLAYER', candParty: myPid(), candLocked: true, color: myParty().color, mine: true }; G.coalitions.push(c); }
    if (b.old) { b.old.members = b.old.members.filter(m => m !== pid); b.old.members.forEach(m => addRel(m, pid, -10)); addNews(`${p.short} lascia ${b.old.name}.`, 'parl'); if (b.old.members.length < 2) G.coalitions = G.coalitions.filter(x => x !== b.old); }
    c.members.push(pid); addRel(pid, myPid(), 6);
    if (of.premier) { c.cand = p.leader; c.candParty = pid; c.candLocked = true; }
  }
  if (of.law && DEAL.law) { const l = getLaw(DEAL.law.lawId); if (!G.promises.some(x => x.lawId === l.id && x.opt === DEAL.law.opt)) G.promises.push({ lawId: l.id, opt: DEAL.law.opt, w: G.week, pact: pid }); if (lawGain(myPid(), l, G.laws[l.id], DEAL.law.opt) < -0.2) G.cred = clamp(G.cred - 3, 0, 100); }
  if (of.collegi) myParty().spinta -= 0.3;
  if (of.fondi) G.funds -= 120;
  if (b.override) { myParty().spinta -= 1.5; p.spinta -= 1.5; c.members.filter(m => m !== pid && m !== myPid()).forEach(m => addRel(m, myPid(), -8)); }
  G.pacts = G.pacts || [];
  G.pacts.push({ pid, w: G.week, until: G.cal.election + 30, min: (of.min1 ? 1 : 0) + (of.minKey ? 1 : 0), key: !!of.minKey, vice: !!of.vice, fragile: !!b.override });
  addNews(`Accordo fatto: ${b.kind === 'join' ? `${myParty().short} entra in ${c.name}` : `${p.short} entra in ${c.name}`}${b.override ? ' (nonostante gli storici veti)' : ''}.`, 'mio');
  confetti([myParty().color, p.color, '#d6b25e']);
  const prom = [of.min1 && 'un ministero', of.minKey && 'un ministero chiave', of.vice && 'la vicepresidenza', of.law && 'una legge bandiera', of.premier && 'la candidatura a premier', of.collegi && 'collegi sicuri', of.fondi && 'fondi per la campagna'].filter(Boolean);
  resultSheet('hands', 'Accordo raggiunto', `${esc(p.leader)} stringe la mano: ${b.kind === 'join' ? `sei in ${esc(c.name)}` : `${esc(p.short)} entra in ${esc(c.name)}`}.${prom.length ? ` Hai promesso ${prom.join(', ')}.` : ''}`);
  DEAL = null; renderGame();
}
// le promesse fatte nelle trattative, al momento di formare il governo
function pactsLine(set) {
  return (G.pacts || []).filter(x => set.includes(x.pid) && (x.min || x.vice)).map(x => `${esc(P(x.pid).short)}: ${x.min ? `${x.min} minister${x.min > 1 ? 'i' : 'o'}${x.key ? ' (uno chiave)' : ''}` : ''}${x.min && x.vice ? ' + ' : ''}${x.vice ? 'vicepremier' : ''}`).join(' · ');
}
function checkPacts() {
  if (!G.gov || !G.pacts) return;
  const KEY = MINISTRIES.filter(m => m.key).map(m => m.id);
  G.pacts.forEach(x => {
    if (x.checked || !G.gov.parties.includes(x.pid) || x.pid === myPid()) return;
    x.checked = true;
    const mins = Object.keys(G.gov.ministers).filter(k => { const pp = person(G.gov.ministers[k]); return pp && pp.party === x.pid; });
    const keyOk = !x.key || mins.some(k => KEY.includes(k));
    const viceOk = !x.vice || (G.gov.vice || []).some(n => person(n) && person(n).party === x.pid);
    if (mins.length >= x.min && keyOk && viceOk) { G.gov.sat[x.pid] = clamp((G.gov.sat[x.pid] || 50) + 6, 0, 100); addNews(`${P(x.pid).leader}: «Patti rispettati, lealtà al governo».`, 'gov'); }
    else { G.gov.sat[x.pid] = clamp((G.gov.sat[x.pid] || 50) - 16, 0, 100); addRel(x.pid, myPid(), -12); addNews(`${P(x.pid).leader} attacca: «Promesse tradite, avevamo un accordo».`, 'bad'); }
  });
}
