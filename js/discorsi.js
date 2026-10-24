// ============================================================
//  IL DISCORSO (G17): tre frasi, l'aula e i social reagiscono a ognuna
//  I BIVI DI CARRIERA (D5): scelte che chiudono un'altra strada
// ============================================================
const SPEECH = {
  fiducia: { n: 'Il discorso per la fiducia', at: 'Aula di Montecitorio', rounds: [
    { t: 'Come apri', o: [
      { t: '«Questo governo non alzerà le tasse a chi lavora.»', maj: 3, opp: -2, fx: { appr: 0.5, grp: { conf: 2 } }, soc: 18000 },
      { t: '«Chiederemo sacrifici a tutti, a partire da noi.»', maj: -1, opp: 2, fx: { grp: { merc: 3, ue: 2 } }, soc: 7000 },
      { t: '«Il Paese ha bisogno di unità, non di nemici.»', maj: 1, opp: 3, fx: { grp: { quir: 4 } }, soc: 9000 } ] },
    { t: 'L’Europa', o: [
      { t: '«L’Europa deve cambiare, e la cambieremo.»', maj: 2, opp: -1, fx: { grp: { ue: -2 } }, soc: 15000 },
      { t: '«Saremo un partner serio e affidabile.»', maj: 0, opp: 2, fx: { grp: { ue: 4, merc: 2 } }, soc: 5000 },
      { t: '«Prima l’Italia, sempre e comunque.»', maj: 1, opp: -3, fx: { grp: { ue: -4 }, my: 0.3 }, soc: 26000 } ] },
    { t: 'Come chiudi', o: [
      { t: '«Mettiamo al centro il lavoro dei giovani.»', maj: 2, opp: 1, fx: { appr: 0.5 }, soc: 14000 },
      { t: '«Ogni euro in più andrà alla sanità pubblica.»', maj: 1, opp: 2, fx: { grp: { sind: 3 }, appr: 0.6 }, soc: 12000 },
      { t: '«Sicurezza e legalità prima di tutto.»', maj: 2, opp: -2, fx: { grp: { mag: 2 }, my: 0.2 }, soc: 20000 } ] },
  ] },
  nazione: { n: 'Discorso alla nazione', at: 'Palazzo Chigi, a reti unificate', rounds: [
    { t: 'Il tono', o: [
      { t: '«Italiani, i sacrifici di oggi sono la forza di domani.»', maj: 0, opp: 1, fx: { grp: { merc: 3 }, appr: -0.2 }, soc: 8000 },
      { t: '«Questo è il governo che mantiene le promesse.»', maj: 3, opp: -2, fx: { appr: 0.6 }, soc: 22000 },
      { t: '«Nessuno resterà indietro.»', maj: 1, opp: 2, fx: { grp: { chiesa: 3 }, appr: 0.4 }, soc: 15000 } ] },
    { t: 'L’annuncio', o: [
      { t: 'Taglio delle bollette dal prossimo mese', maj: 2, opp: 0, fx: { appr: 1, oneOff: 0.6 }, soc: 30000 },
      { t: 'Piano per la casa ai giovani', maj: 1, opp: 1, fx: { appr: 0.7, oneOff: 0.4 }, soc: 21000 },
      { t: 'Nessun annuncio: solo rendiconto', maj: 0, opp: 1, fx: { grp: { media: 2 }, cred: 2 }, soc: 4000 } ] },
    { t: 'Il saluto', o: [
      { t: '«Viva l’Italia, viva la Repubblica.»', maj: 1, opp: 1, fx: { grp: { quir: 2 } }, soc: 9000 },
      { t: '«Ci rivediamo tra un anno, a testa alta.»', maj: 2, opp: -1, fx: { fama: 1 }, soc: 12000 },
      { t: '«Grazie a chi lavora ogni giorno.»', maj: 1, opp: 1, fx: { grp: { sind: 2 } }, soc: 11000 } ] },
  ] },
};
let SPK = null;
function openSpeech(kind, done) {
  SPK = { kind, i: 0, picks: [], done };
  if (!layers.length || !layers[layers.length - 1].el.classList.contains('full')) openSheet('', { full: true, locked: true });
  renderSpeech();
}
function renderSpeech() {
  const S = SPEECH[SPK.kind], r = S.rounds[SPK.i];
  const maj = SPK.picks.reduce((s, p) => s + p.maj, 0), opp = SPK.picks.reduce((s, p) => s + p.opp, 0), soc = SPK.picks.reduce((s, p) => s + p.soc, 0);
  const meter = clamp(50 + maj * 6 + opp * 3, 5, 95);
  let h = `<div class="center">${medal('podium', 64)}<div class="tiny gold mt" style="font-weight:800;letter-spacing:.1em">${esc(S.at.toUpperCase())}</div><h2 class="mt">${esc(S.n)}</h2></div>
    <div class="card tight mt"><div class="row between small"><b>Applausi</b><b style="color:${meter >= 55 ? 'var(--good)' : meter >= 40 ? 'var(--warn)' : 'var(--bad)'}">${meter}%</b></div><div class="bar mt"><i style="width:${meter}%;--c:${meter >= 55 ? 'var(--good)' : 'var(--warn)'}"></i></div>
      <div class="react">${SPK.picks.length ? `<span class="${maj >= 0 ? 'good' : 'bad'}">${maj >= 0 ? '▲' : '▼'} maggioranza</span><span class="${opp >= 0 ? 'good' : 'bad'}">${opp >= 0 ? '▲' : '▼'} opposizione</span><span class="gold">♥ ${fmt0(soc)} sui social</span>` : '<span class="muted">Scegli la prima frase</span>'}</div></div>
    ${SPK.picks.map(p => `<div class="bub me">${esc(p.t)}</div>`).join('')}`;
  if (r) h += sec(`${SPK.i + 1} di ${S.rounds.length} · ${esc(r.t)}`) + r.o.map((o, j) => `<button class="choice" onclick="pickSpeech(${j})"><div class="t">${esc(o.t)}</div>${fxChips(o.fx)}</button>`).join('');
  else h += `<button class="btn gold block mt2" onclick="endSpeech()">${icon('check')} Concludi il discorso</button>`;
  replaceSheet(h);
}
function pickSpeech(j) { const o = SPEECH[SPK.kind].rounds[SPK.i].o[j]; SPK.picks.push(o); SPK.i++; vib(12); renderSpeech(); }
function endSpeech() {
  const maj = SPK.picks.reduce((s, p) => s + p.maj, 0), opp = SPK.picks.reduce((s, p) => s + p.opp, 0);
  SPK.picks.forEach(p => applyFx(p.fx));
  applyFx({ fama: 2 });
  addNews(`${G.player.name}: ${SPEECH[SPK.kind].n.toLowerCase()}. ${maj >= 4 ? 'Ovazione della maggioranza' : maj >= 1 ? 'Applausi della maggioranza' : 'Accoglienza fredda'}${opp >= 3 ? ', apprezzamenti anche dall’opposizione' : ''}.`, 'mio');
  const done = SPK.done, res = { maj, opp }; SPK = null;
  if (done) done(res); else { closeSheet(); renderGame(); }
}
ACTIONS.splice(ACTIONS.findIndex(a => a.id === 'riposo'), 0, { id: 'discorso', n: 'Discorso alla nazione', ico: 'podium', cost: 2, show: () => isPremier(), d: 'Parli agli italiani a reti unificate: scegli tre frasi e guarda come reagiscono aula e social.', custom: () => { if (!spendPC(2)) return toast('Capitale politico insufficiente', 'bad'); markUsed('discorso'); openSpeech('nazione'); } });

// ---------- D5: bivi di carriera ----------
const PATHS = {
  europa: { n: 'Profilo europeo', d: 'Rapporti migliori con Bruxelles e mercati, interviste più autorevoli.', run: () => { G.groups.ue = clamp(G.groups.ue + 15, -100, 100); G.groups.merc = clamp(G.groups.merc + 8, -100, 100); } },
  territorio: { n: 'Uomo del territorio', d: 'Radicamento forte nella tua regione e nel Sud, seguito interno.', run: () => { G.myReg[G.player.region] = (G.myReg[G.player.region] || 1) + 0.5; G.player.seguito = clamp((G.player.seguito || 0) + 8, 0, 100); } },
  tecnico: { n: 'Profilo tecnico', d: 'Più competenza e fiducia del Quirinale, ma meno carisma in TV.', run: () => { G.player.comp = Math.min(10, G.player.comp + 1); G.player.car = Math.max(1, G.player.car - 1); G.groups.quir = clamp(G.groups.quir + 10, -100, 100); } },
  partito: { n: 'Uomo di partito', d: 'Il partito ti segue compatto: più organizzazione e lealtà.', run: () => { G.org = clamp((G.org || 0) + 10, 0, 100); G.player.rap = clamp((G.player.rap || 0) + 15, -100, 100); } },
};
const BIVI = [
  { id: 'bivio_primo', for: 'all', w: 2.5, once: true, cond: () => G.week > 12 && !G.player.path && G.player.fama > 25, img: 'swap', look: 'chat', title: 'Che politico vuoi diventare?',
    text: 'Il tuo staff ti mette davanti a una scelta: puntare su Bruxelles e i palazzi europei, o sul territorio e la tua regione. Le due strade non si possono fare insieme.',
    choices: () => [{ t: 'Strada europea', fx: { fama: 2 }, run: () => { G.player.path = 'europa'; PATHS.europa.run(); }, r: PATHS.europa.d }, { t: 'Strada del territorio', fx: { fama: 1 }, run: () => { G.player.path = 'territorio'; PATHS.territorio.run(); }, r: PATHS.territorio.d }] },
  { id: 'bivio_secondo', for: 'all', w: 2, once: true, cond: () => G.player.path && G.week > 60 && G.player.fama > 45 && !G.player.path2, img: 'swap', look: 'chat', title: 'Tecnico o capo partito?',
    text: 'Ti offrono un ruolo da tecnico stimato in Europa e al Quirinale; il partito invece ti vuole sempre più al centro della macchina. Scegli chi vuoi essere.',
    choices: () => [{ t: 'Il profilo tecnico', fx: {}, run: () => { G.player.path2 = 'tecnico'; PATHS.tecnico.run(); }, r: PATHS.tecnico.d }, { t: 'L’uomo di partito', fx: {}, run: () => { G.player.path2 = 'partito'; PATHS.partito.run(); }, r: PATHS.partito.d }] },
  { id: 'offerta_commissario', for: 'nogov', w: 1.2, once: true, cond: () => !isPremier() && G.player.fama > 55 && G.player.path === 'europa', img: 'eu', look: 'call', title: 'Ti offrono di andare a Bruxelles',
    text: 'Il governo propone il tuo nome come commissario europeo. Prestigio enorme, ma per cinque anni lasceresti la politica italiana: la partita finirebbe qui, con un bel finale.',
    choices: () => [{ t: 'Accettare: Bruxelles', fx: { fama: 10 }, run: () => { G.careerLog.push({ w: G.week, t: 'Nominato commissario europeo' }); setTimeout(() => endGame('commissario'), 600); }, r: 'Una carriera europea comincia.' }, { t: 'Rifiutare: la mia partita è in Italia', fx: { cred: 3, my: 0.3 }, r: 'Resti a Roma, con più credibilità.' }] },
  { id: 'offerta_sindaco', for: 'all', w: 1.2, once: true, cond: () => !isPremier() && G.player.fama > 40 && G.player.path === 'territorio', img: 'home', look: 'chat', title: 'Candidarti a sindaco della tua città?',
    text: 'Il partito ti chiede di guidare la lista per il comune capoluogo della tua regione. Vincere ti darebbe un consenso enorme a casa, ma meno tempo per Roma.',
    choices: () => [{ t: 'Candidarsi', fx: { fama: 4, stress: 6 }, run: () => { G.myReg[G.player.region] = (G.myReg[G.player.region] || 1) + 0.8; G.player.sindaco = true; G.careerLog.push({ w: G.week, t: 'Eletto sindaco della tua città' }); }, r: 'Vinci al primo turno: la tua regione è con te.' }, { t: 'Restare in prima linea a Roma', fx: { rap: 4 }, r: 'Il partito apprezza la scelta.' }] },
];
BIVI.forEach(e => { EVENTS.push(e); EVENT_BY_ID[e.id] = e; });
