// ============================================================
//  OPPOSIZIONE: sfiducia preparata con le adesioni, lavorare ai
//  fianchi gli alleati, commissione d'inchiesta, campagne a tema,
//  effetto rimpianto, leader dell'opposizione, forza del governo
// ============================================================
const isOpp = () => isLeader() && !inGov(myPid()) && !!G.gov;
// primo partito non al governo
function oppTopParty() { if (!G.gov) return null; return PIDS().filter(p => !inGov(p)).sort((a, b) => P(b).poll - P(a).poll)[0] || null; }
// forza del governo da 0 a 100: gradimento, compattezza degli alleati, margine in aula
function govStrength() {
  const g = G.gov; if (!g) return null;
  const al = g.parties.filter(p => p !== g.premierParty && !(p === myPid() && isPremier()));
  const sat = al.length ? al.reduce((s, p) => s + (g.sat[p] || 55), 0) / al.length : 70;
  const margin = (govSeats('C') - majority('C')) / totalSeats('C') * 100;
  return { v: Math.round(clamp(g.approval * 0.55 + sat * 0.3 + margin * 1.5, 0, 100)), appr: g.approval, sat, margin: govSeats('C') - majority('C') };
}
function openGovStrength() {
  const s = govStrength(); if (!s) return;
  const al = G.gov.parties.filter(p => p !== G.gov.premierParty);
  openSheet(`${head('Fiducia nel governo', esc(G.gov.name))}
    <div class="center"><div class="bignum" style="color:${(inGov(myPid()) ? s.v >= 50 : s.v < 40) ? 'var(--good)' : s.v >= 40 && s.v < 60 ? 'var(--warn)' : 'var(--bad)'}">${s.v}</div><div class="small muted">su 100: ${s.v >= 60 ? 'solido' : s.v >= 40 ? 'in bilico' : 'debole'}${inGov(myPid()) ? '' : s.v < 40 ? ': è il momento di attaccare' : s.v >= 60 ? ', difficile da far cadere' : ''}</div></div>
    <div class="card tight mt"><div class="list">
      <div class="li"><div class="grow small">Gradimento degli italiani</div><b>${fmt0(s.appr)}%</b></div>
      <div class="li"><div class="grow small">Soddisfazione media degli alleati</div><b>${fmt0(s.sat)}/100</b></div>
      <div class="li"><div class="grow small">Margine alla Camera</div><b>${s.margin >= 0 ? '+' : ''}${s.margin} seggi</b></div></div></div>
    ${al.length ? sec('Gli alleati') + `<div class="card tight"><div class="list">${al.map(p => `<div class="li">${partyChip(p)}<div class="grow"></div><span class="tag ${G.gov.sat[p] < 30 ? 'g' : G.gov.sat[p] < 45 ? 'w' : ''}">${fmt0(G.gov.sat[p] || 0)}/100</span></div>`).join('')}</div></div>` : ''}
    ${inGov(myPid()) ? `<p class="small muted mt">È il tuo governo: per rafforzarlo tieni contenti gli alleati (vertici di maggioranza, leggi che piacciono a loro), fai crescere l'economia e scegli alleati coerenti. Sotto 40 rischi la crisi.</p>` : ''}<p class="small muted mt" style="${inGov(myPid()) ? 'display:none' : ''}">Per indebolirlo: <b>lavora ai fianchi</b> gli alleati (più sono scontenti, più firmano la sfiducia), apri una <b>commissione d’inchiesta</b>, lancia <b>campagne a tema</b> sui problemi del Paese. Sotto 40 la sfiducia diventa possibile.</p>`);
}

// ---------- 2A: sfiducia preparata con le adesioni ----------
function sfidInit() {
  if (G.sfid && G.gov && G.sfid.gov === G.gov.start) return G.sfid;
  G.sfid = { gov: G.gov.start, start: G.week, sig: { [myPid()]: true }, asked: {} };
  return G.sfid;
}
function sfidChance(pid) {
  const g = G.gov, me = myPid();
  if (pid === g.premierParty) return 0;
  if (inGov(pid)) return clamp((50 - (g.sat[pid] || 55)) / 45 + rel(pid, me) / 250, 0.02, 0.8);
  return clamp(0.2 + compat(pid, me) / 130 + rel(pid, me) / 160, 0.08, 0.95);
}
function sfidSeats() { const s = G.sfid; return s ? Object.keys(s.sig).filter(p => G.parties[p]).reduce((t, p) => t + seatsOf(p, 'C'), 0) : 0; }
function openSfiducia() { sfidInit(); openSheet('', { full: true, locked: true }); renderSfiducia(); }
function renderSfiducia() {
  const s = sfidInit(), need = majority('C'), have = sfidSeats(), tot = totalSeats('C');
  const list = PIDS().filter(p => p !== myPid() && seatsOf(p, 'C') > 0).sort((a, b) => (s.sig[b] ? 1 : 0) - (s.sig[a] ? 1 : 0) || sfidChance(b) - sfidChance(a));
  const row = p => {
    const ch = sfidChance(p), asked = s.asked[p] === G.week;
    const st = s.sig[p] ? `<span class="tag g">${icon('check', 12)} firma</span>` : p === G.gov.premierParty ? '<span class="tag">partito del premier</span>' : `<button class="btn sm ${asked ? 'off' : ''}" onclick="askSfid('${p}')">${asked ? 'chiesto' : `Chiedi · ${Math.round(ch * 100)}% · ⚡1`}</button>`;
    return `<div class="li">${partyChip(p)}<div class="grow small muted">${seatsOf(p, 'C')} deputati${inGov(p) ? ` · al governo (${fmt0(G.gov.sat[p] || 0)}/100)` : ''}</div>${st}</div>`;
  };
  replaceSheet(`<div class="row between"><button class="btn sm" onclick="closeSheet();renderGame()">Chiudi</button><span class="tag o">${icon('gavel')} Sfiducia</span><span></span></div>
    <div class="center mt">${medal('gavel', 60)}<h2 class="mt">Mozione di sfiducia</h2><div class="small muted">contro il ${esc(G.gov.name)}</div></div>
    <div class="card hero mt"><div class="row between small"><b>Firmatari</b><span><b class="${have >= need ? 'good' : ''}">${have}</b> su ${need} necessari</span></div>
      <div class="bmtr"><div class="tr"><b style="width:${Math.min(100, have / tot * 100)}%"></b><s style="left:${need / tot * 100}%"></s></div></div>
      <div class="tiny muted mt">Raccogli le adesioni settimana dopo settimana: ogni partito puoi chiederlo una volta a settimana. Gli alleati del governo firmano solo se sono scontenti, e possono ripensarci.</div></div>
    ${sec('I partiti')}<div class="card tight"><div class="list">${list.map(row).join('')}</div></div>
    <button class="btn ${have >= need ? 'gold' : 'red'} block mt2" onclick="voteSfid()">${icon('vote')} Deposita la mozione e vota · ⚡2</button>
    <div class="tiny muted center mt">${have >= need ? 'Hai i numeri sulla carta: qualche franco tiratore può sempre tradire.' : 'Senza i numeri sarà respinta, ma fa notizia.'}</div>
    <button class="btn sm block mt" onclick="G.sfid=null;closeSheet();renderGame()">Rinuncia alla raccolta</button>`);
}
function askSfid(pid) {
  const s = sfidInit();
  if (s.asked[pid] === G.week) return;
  if (!spendPC(1)) return toast('Capitale politico insufficiente', 'bad');
  s.asked[pid] = G.week;
  if (chance(sfidChance(pid))) {
    s.sig[pid] = true;
    if (inGov(pid)) { G.gov.sat[pid] = clamp((G.gov.sat[pid] || 50) - 10, 0, 100); addNews(`CLAMOROSO: ${P(pid).short} firma la mozione di sfiducia contro il governo.`, 'bad'); }
    toast(`${P(pid).short} firma`, 'good');
  } else { if (inGov(pid)) addRel(pid, myPid(), -2); toast(`${P(pid).short} per ora non firma`, 'bad'); }
  renderSfiducia();
}
function voteSfid() {
  if (!spendPC(2)) return toast('Capitale politico insufficiente', 'bad');
  const s = G.sfid; let yes = 0;
  Object.keys(s.sig).forEach(p => { if (!G.parties[p]) return; const n = seatsOf(p, 'C'); yes += Math.round(n * (inGov(p) ? rnd(0.75, 0.95) : rnd(0.9, 1))); });
  const no = totalSeats('C') - yes - irnd(3, 12);
  G.sfid = null; closeSheet();
  applyFx({ fama: 3, my: 0.4 });
  if (yes >= majority('C')) { addNews(`La Camera approva la mozione di sfiducia: ${yes} sì. Il governo cade!`, 'mio'); G.careerLog.push({ w: G.week, t: 'Fai cadere il governo con la sfiducia' }); renderGame(); openCrisis('sfiducia'); return; }
  addNews(`Respinta la mozione di sfiducia di ${myParty().short}: ${yes} sì, ${no} no.`, 'parl');
  renderGame(); resultSheet('gavel', 'Mozione respinta', `${yes} sì, ${no} no: ne servivano ${majority('C')}. L’opposizione però ha guadagnato la scena.`);
}

// ---------- 3D: lavorare ai fianchi e commissione d'inchiesta ----------
function openFianchi() {
  const al = G.gov.parties.filter(p => p !== myPid());
  openSheet(`${head('Lavora ai fianchi', 'Incontri riservati con un alleato del governo')}
    <p class="small muted">Lo convinci che nel governo conta poco e che con te avrebbe di più. Più è vicino alle tue idee, più funziona. Il partito del premier è il più difficile.</p>
    <div class="list">${al.map(p => `<div class="li click" onclick="doFianchi('${p}')">${partyChip(p)}<div class="grow small muted">soddisfazione ${fmt0(G.gov.sat[p] || 0)}/100 · affinità ${fmt0(compat(p, myPid()))}%</div>${icon('chevron', 16)}</div>`).join('')}</div>`);
}
function doFianchi(pid) {
  if (usedThisWeek('fianchi')) return toast('L’hai già fatto questa settimana', 'bad');
  if (!spendPC(2)) return toast('Capitale politico insufficiente', 'bad');
  markUsed('fianchi'); closeSheet();
  const g = G.gov, before = g.sat[pid] || 55;
  let d = 5 + compat(pid, myPid()) / 18 + Math.max(0, rel(pid, myPid())) / 15 + rnd(0, 4);
  if (pid === g.premierParty) d *= 0.35;
  g.sat[pid] = clamp(before - d, 0, 100); addRel(pid, myPid(), 3);
  let txt = `${P(pid).leader} ascolta con interesse. Soddisfazione nel governo: ${fmt0(before)} → ${fmt0(g.sat[pid])}.`;
  if (chance(0.25)) { g.sat[pid] = clamp(g.sat[pid] + d * 0.4, 0, 100); addRel(g.premierParty, myPid(), -6); addNews(`Retroscena: incontri riservati tra ${myParty().short} e ${P(pid).short}. Irritazione a Palazzo Chigi.`, 'bad'); txt += ' Ma la notizia trapela: a Palazzo Chigi sono furiosi e l’effetto si attenua.'; }
  renderGame(); resultSheet('hands', 'Incontro riservato', txt);
}
const INCHIESTE = ['gli appalti del PNRR', 'le nomine in RAI', 'i fondi alle fondazioni dei partiti', 'la sanità nelle regioni', 'le banche e i risparmiatori', 'i servizi segreti e i dossier'];
function doInchiesta() {
  if (G.flags.inch) return toast('C’è già una commissione al lavoro', 'bad');
  if (G.flags.inchNext && G.week < G.flags.inchNext) return toast(`Potrai chiederne un’altra tra ${G.flags.inchNext - G.week} settimane`, 'bad');
  if (!spendPC(3)) return toast('Capitale politico insufficiente', 'bad');
  const t = pick(INCHIESTE);
  G.flags.inch = { w: G.week + irnd(3, 6), t }; G.flags.inchNext = G.week + 16;
  addNews(`${myParty().short} ottiene una commissione d’inchiesta su ${t}.`, 'mio');
  applyFx({ fama: 2 }); renderGame();
  resultSheet('search', 'Commissione d’inchiesta', `Si indaga su ${esc(t)}. Tra qualche settimana arriveranno i risultati: possono mettere in difficoltà il governo, oppure risolversi in un nulla di fatto.`);
}

// ---------- 6B: campagne a tema di più settimane ----------
const CAMPAGNE = [
  { id: 'bollette', n: 'Caro bollette', ax: 'eco', grp: { sind: 1 }, d: 'Le famiglie non arrivano a fine mese.' },
  { id: 'sanita', n: 'Sanità pubblica', ax: 'eco', grp: { sind: 1 }, d: 'Liste d’attesa e pronto soccorso al collasso.' },
  { id: 'tasse', n: 'Meno tasse', ax: 'eco', grp: { conf: 1 }, d: 'Il fisco soffoca chi lavora e chi produce.' },
  { id: 'sicurezza', n: 'Sicurezza', ax: 'giu', grp: {}, d: 'Le città non sono più sicure.' },
  { id: 'immigrazione', n: 'Immigrazione', ax: 'imm', grp: {}, d: 'Sbarchi e accoglienza fuori controllo.' },
  { id: 'europa', n: 'Europa', ax: 'eu', grp: { ue: 1 }, d: 'Il governo isola l’Italia in Europa.' },
  { id: 'clima', n: 'Clima e ambiente', ax: 'amb', grp: {}, d: 'Alluvioni e siccità: serve agire ora.' },
  { id: 'diritti', n: 'Diritti', ax: 'soc', grp: {}, d: 'Libertà civili e diritti di tutti.' },
];
function openCampagna() {
  if (G.camp) return toast(`La campagna «${CAMPAGNE.find(c => c.id === G.camp.id).n}» è ancora in corso`, 'bad');
  openSheet(`${head('Campagna a tema', 'Sei settimane su un solo tema')}
    <p class="small muted">Insisti per settimane sullo stesso problema: l’effetto cresce ogni settimana e sposta l’opinione pubblica verso le tue idee. I temi più sentiti dagli italiani rendono di più.</p>
    <div class="list">${CAMPAGNE.map(c => `<div class="li click" onclick="startCampagna('${c.id}')"><div class="grow"><b class="small">${esc(c.n)}</b><div class="tiny muted">${esc(c.d)}</div></div><span class="tag ${G.sal[c.ax] >= 1 ? 'o' : ''}">${G.sal[c.ax] >= 1 ? 'tema caldo' : 'tema minore'}</span></div>`).join('')}</div>`);
}
function startCampagna(id) {
  if (!spendPC(2)) return toast('Capitale politico insufficiente', 'bad');
  G.camp = { id, w: G.week, n: 0 };
  closeSheet(); addNews(`${myParty().short} lancia una campagna nazionale: «${CAMPAGNE.find(c => c.id === id).n}».`, 'mio');
  renderGame(); toast('Campagna lanciata: cresce per sei settimane', 'good');
}
function campagnaTick() {
  const c = G.camp; if (!c) return;
  const C = CAMPAGNE.find(x => x.id === c.id); c.n++;
  const k = Math.min(c.n, 5) / 5 * (0.6 + Math.min(1.5, G.sal[C.ax] || 0.5) * 0.4);
  myParty().spinta += 1.1 * k;
  G.player.fama = clamp(G.player.fama + 0.6 * k, 0, 100);
  const tgt = myParty().ax[C.ax];
  if (G.mood[C.ax] !== undefined && tgt !== undefined) G.mood[C.ax] = clamp(G.mood[C.ax] + Math.sign(tgt - G.mood[C.ax]) * 0.12 * k, -10, 10);
  Object.keys(C.grp).forEach(g => { if (G.groups[g] !== undefined) G.groups[g] = clamp(G.groups[g] + C.grp[g], -100, 100); });
  if (c.n >= 6) { G.flags.campDone = true; addNews(`Si chiude la campagna «${C.n}» di ${myParty().short}.`, 'mio'); G.camp = null; }
}

// ---------- tick settimanale ----------
function oppTick() {
  const g = G.gov;
  // effetto rimpianto: dopo Palazzo Chigi, se chi viene dopo governa peggio
  if (isPremier()) { G.flags.premAppr = g.approval; G.flags.wasPremier = true; }
  else if (G.flags.wasPremier) { G.flags.wasPremier = false; G.flags.exPremier = G.week; }
  if (G.flags.exPremier && G.week - G.flags.exPremier < 78 && g && !isPremier() && isLeader() && G.flags.premAppr > g.approval) myParty().spinta += Math.min(1.2, (G.flags.premAppr - g.approval) * 0.05);
  // leader dell'opposizione: più spazio in TV e sui giornali
  if (isOpp() && oppTopParty() === myPid()) { myParty().spinta += 0.35; G.player.fama = clamp(G.player.fama + 0.25, 0, 100); }
  // adesioni alla sfiducia che si ritirano se l'alleato torna contento
  if (G.sfid) {
    if (!g || G.sfid.gov !== g.start) G.sfid = null;
    else Object.keys(G.sfid.sig).forEach(p => { if (inGov(p) && (g.sat[p] || 55) > 45 && chance(0.35)) { delete G.sfid.sig[p]; addNews(`${P(p).short} ritira la firma dalla mozione di sfiducia.`, 'parl'); } });
  }
  // la commissione d'inchiesta chiude i lavori
  if (G.flags.inch && G.week >= G.flags.inch.w) { G.queue.push({ id: 'inchiesta_esito', ctx: { t: G.flags.inch.t, ok: chance(0.45 + G.player.fama / 400) } }); G.flags.inch = null; }
  campagnaTick();
  // governi del computer: scandali e liti (4C)
  if (g && g.premier !== 'PLAYER' && chance(0.05 * D().events)) aiGovTrouble();
}
function aiGovTrouble() {
  const g = G.gov, al = g.parties.filter(p => p !== myPid());
  const r = Math.random();
  if (r < 0.4) {
    const ks = Object.keys(g.ministers).filter(k => MIN_BY_ID[k] && g.ministers[k] !== G.player.name); if (!ks.length) return;
    const k = pick(ks), who = g.ministers[k], pp = person(who);
    g.popBank -= 2; if (pp && g.sat[pp.party] !== undefined) g.sat[pp.party] = clamp(g.sat[pp.party] - 6, 0, 100);
    addNews(`Bufera sul ministro ${who} (${MIN_BY_ID[k].n}): indagato per abuso d’ufficio. L’opposizione chiede le dimissioni.`, 'bad');
  } else if (r < 0.75 && al.length > 1) {
    const [a, b] = al.slice().sort(() => Math.random() - 0.5);
    g.sat[a] = clamp((g.sat[a] || 55) - 7, 0, 100); g.sat[b] = clamp((g.sat[b] || 55) - 7, 0, 100); g.popBank -= 1;
    addNews(`Lite nella maggioranza: ${P(a).leader} e ${P(b).leader} si attaccano a distanza. Vertice di governo convocato d’urgenza.`, 'bad');
  } else {
    g.popBank -= 1.5;
    addNews(`Gaffe di ${g.premier} in diretta: polemiche e meme sui social.`, 'bad');
  }
}
const _storyTickOpp = storyTick;
storyTick = function () { _storyTickOpp(); try { oppTick(); } catch (e) { console.error(e); } };

EVENTS.push({ id: 'inchiesta_esito', for: 'all', w: 0, chain: true, img: 'search', look: 'paper',
  title: c => c.ok ? 'La commissione d’inchiesta fa centro' : 'L’inchiesta finisce in nulla',
  text: c => c.ok ? `La commissione su ${c.t || 'il governo'} porta alla luce irregolarità e favori. I giornali aprono con le carte, il governo è in difficoltà.` : `Dopo settimane di audizioni sulla questione di ${c.t || 'il governo'} non emerge niente di rilevante. La maggioranza parla di «circo mediatico».`,
  choices: c => c.ok ? [
    { t: 'Cavalcare il caso in TV', fx: { fama: 5, my: 1 }, r: 'Il tuo volto è ovunque.', run: () => { if (G.gov) { G.gov.popBank -= 3; const al = G.gov.parties.filter(p => p !== myPid()); if (al.length) { const p = pick(al); G.gov.sat[p] = clamp((G.gov.sat[p] || 55) - 8, 0, 100); } } } },
    { t: 'Tono istituzionale: «Ora chiarezza»', fx: { cred: 4, fama: 2 }, r: 'Guadagni credibilità anche tra gli indecisi.', run: () => { if (G.gov) G.gov.popBank -= 2; } },
  ] : [
    { t: 'Rivendicare comunque il lavoro fatto', fx: { cred: -2, fama: 1 }, r: 'Non convinci molto.' },
    { t: 'Ammettere: «Nessuna irregolarità, bene così»', fx: { cred: 3 }, r: 'Un gesto di serietà apprezzato.' },
  ] });
EVENT_BY_ID.inchiesta_esito = EVENTS[EVENTS.length - 1];

// ---------- azioni ----------
(function () {
  const a = ACTIONS.find(x => x.id === 'sfiducia');
  if (a) { a.cost = 0; delete a.run; delete a.fx; a.d = 'Raccogli le firme dei partiti settimana dopo settimana; quando hai i numeri, deposita la mozione.'; a.custom = () => openSfiducia(); }
  const at = ACTIONS.findIndex(x => x.id === 'riposo');
  ACTIONS.splice(at, 0,
    { id: 'fianchi', n: 'Lavora ai fianchi', ico: 'hands', cost: 2, show: () => isOpp() && G.gov.parties.length > 1, d: 'Incontri riservati con un alleato del governo per renderlo scontento.', risk: '25% che trapeli', custom: () => openFianchi() },
    { id: 'inchiesta', n: 'Commissione d’inchiesta', ico: 'search', cost: 3, show: () => isOpp() && myParty().seatsC + myParty().seatsS >= 15, d: 'Indaga su un caso scomodo per il governo: può far emergere uno scandalo.', risk: 'Può finire in nulla', custom: () => doInchiesta() },
    { id: 'campagna', n: 'Campagna a tema', ico: 'mega', cost: 2, show: () => isLeader() && !isPremier(), d: 'Sei settimane su un solo tema: l’effetto cresce ogni settimana.', custom: () => openCampagna() });
  ROUTINE_NO.push('fianchi', 'inchiesta', 'campagna');
})();

// riquadro in Home: campagna in corso, raccolta firme, forza del governo
const _homeTabOpp = homeTab;
homeTab = function () {
  let h = '';
  if (G.camp) { const C = CAMPAGNE.find(c => c.id === G.camp.id); h += `<div class="card tight"><div class="row">${medal('mega', 40)}<div class="grow"><b class="small">Campagna «${esc(C.n)}»</b><div class="prog" style="margin:6px 0 2px">${[1, 2, 3, 4, 5, 6].map(i => `<i class="${i <= G.camp.n ? 'd' : i === G.camp.n + 1 ? 'n' : ''}"></i>`).join('')}</div><div class="tiny muted">settimana ${Math.min(6, G.camp.n + 1)} di 6 · l’effetto cresce</div></div></div></div>`; }
  if (G.sfid && isOpp()) h += `<div class="card tight click" onclick="openSfiducia()"><div class="row">${medal('gavel', 40)}<div class="grow"><b class="small">Raccolta firme per la sfiducia</b><div class="tiny muted">${sfidSeats()} deputati su ${majority('C')} necessari</div></div>${icon('chevron', 16)}</div></div>`;
  return h + _homeTabOpp();
};
