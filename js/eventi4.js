// ============================================================
//  DECISIONI A TEMPO (D1), PREZZO NASCOSTO (D2), MINISTRI CHE LITIGANO (D6),
//  IL MONDO CHE CAMBIA (X15), IL PAPA E IL QUIRINALE (X16)
// ============================================================

// ---------- X15: shock mondiali che durano mesi ----------
const SHOCKS = {
  germania: { n: 'Recessione in Germania', d: 'Il primo cliente dell’industria italiana è in recessione: l’export rallenta.', w: 30, tick: () => { G.econ.shockPil -= 0.004; } },
  dazi: { n: 'Guerra commerciale', d: 'Dazi incrociati tra Stati Uniti, Cina ed Europa: le imprese esportatrici soffrono.', w: 26, tick: () => { G.econ.shockPil -= 0.003; G.econ.shockInfl += 0.004; } },
  petrolio: { n: 'Petrolio alle stelle', d: 'Una crisi nel Golfo fa salire il greggio: benzina e bollette su.', w: 20, tick: () => { G.econ.shockInfl += 0.008; } },
  pandemia: { n: 'Nuova epidemia', d: 'Un virus respiratorio riempie gli ospedali: turismo e consumi frenano.', w: 16, tick: () => { G.econ.shockPil -= 0.006; } },
};
function shockTick() {
  if (!G.shock) return;
  const s = SHOCKS[G.shock.id];
  if (G.week >= G.shock.until) { addNews(`Fine dell’emergenza: ${s.n.toLowerCase()} alle spalle.`, 'good'); G.shock = null; return; }
  s.tick();
}
function shockHTML() {
  if (!G.shock) return '';
  const s = SHOCKS[G.shock.id], left = G.shock.until - G.week;
  return `<div class="card tight" style="border-color:rgba(255,107,107,.45)"><div class="row">${medal('globe', 44, '#ff9c9c')}<div class="grow"><b>Il mondo: ${esc(s.n)}</b><div class="tiny muted">${esc(s.d)} Ancora circa ${left} settimane.</div></div></div></div>`;
}
const startShock = (id, k) => { G.shock = { id, until: G.week + Math.round(SHOCKS[id].w * (k || 1)) }; };

// ---------- D2: il prezzo nascosto ----------
const HIDDEN = [
  'L’azienda che avevi aiutato annuncia di spostare la produzione all’estero.',
  'Il sindaco che avevi sostenuto pubblicamente finisce indagato per appalti.',
  'Una parte dei fondi stanziati è stata spesa male: la Corte dei conti apre un’indagine.',
  'Un consulente che aveva lavorato al dossier passa alla concorrenza e racconta tutto.',
  'L’accordo che avevi firmato contiene una clausola che nessuno aveva letto: costa più del previsto.',
];
function maybeHiddenPrice(ev, item, c) {
  if (!isPremier() || ev.chain || !ev.title || chance(0.7)) return;
  if (!(c.fx && (c.fx.oneOff || c.fx.grp || c.fx.satP))) return;
  const title = typeof ev.title === 'function' ? ev.title(item.ctx || {}) : ev.title;
  G.chains = G.chains || [];
  G.chains.push({ w: G.week + irnd(5, 10), id: 'prezzo_nascosto', ctx: { t: title, c: c.t, h: pick(HIDDEN) } });
}

// ---------- D1: dilemmi a tempo ----------
// se il tempo scade, decide lo staff (meglio se hai uno spin doctor o un capo di gabinetto)
function staffPick(choices) {
  const good = (G.staff && (G.staff.spin || G.staff.gabinetto)) ? 0.7 : 0.4;
  if (chance(good)) { let best = 0, bs = -1e9; choices.forEach((c, i) => { const f = c.fx || {}; const s = (f.appr || 0) * 2 + (f.my || 0) * 2 - (f.oneOff || 0) * 0.5 - (f.spread || 0) * 0.05; if (s > bs) { bs = s; best = i; } }); return best; }
  return irnd(0, choices.length - 1);
}

const pm = () => G.gov && G.gov.parties.filter(p => p !== myPid() && G.parties[p]);
const EVENTS4 = [
  // ---------- D1 ----------
  { id: 'borsa_apre', for: 'premier', w: 1.4, cool: 40, timer: 25, img: 'chartdown', look: 'tv', title: 'La Borsa apre tra pochi minuti',
    text: 'Nella notte un’agenzia di rating ha messo l’Italia sotto osservazione. Lo spread nei mercati asiatici è già a +40. Serve un messaggio prima dell’apertura.',
    choices: () => [{ t: 'Annunciare un taglio del deficit', fx: { spread: -25, appr: -1, grp: { merc: 5 } }, r: 'I mercati si calmano, gli alleati brontolano.' }, { t: 'Difendere la manovra', fx: { spread: 20, appr: 0.5 }, r: 'Giornata nera a Piazza Affari.' }, { t: 'Telefonata con la BCE', fx: { pc: -1, spread: -10, grp: { ue: 2 } }, r: 'Francoforte rassicura i mercati.' }] },
  { id: 'nave_ong', for: 'premier', w: 1.3, cool: 30, timer: 25, img: 'wave', look: 'tv', title: 'Una nave con 300 persone chiede un porto',
    text: 'Una nave umanitaria con 300 migranti, tra cui bambini, chiede un porto sicuro. Mare grosso: il comandante dice che ha poche ore.',
    choices: () => [{ t: 'Porto sicuro in Sicilia', fx: { appr: -0.5, grp: { chiesa: 5 }, satP: { LEGA: -5 } }, r: 'Sbarco nella notte, polemiche il giorno dopo.' }, { t: 'Porto lontano, a Ravenna', fx: { grp: { chiesa: -3 }, satP: { LEGA: 3 } }, r: 'Tre giorni di navigazione: le immagini fanno il giro del mondo.' }, { t: 'Chiedere a Malta e Spagna', fx: { grp: { ue: 1 }, appr: -0.3 }, r: 'Rimpallo per due giorni, poi sbarcano in Italia.' }] },
  { id: 'blackout_rete', for: 'premier', w: 1, cool: 50, timer: 20, img: 'bolt', look: 'tv', title: 'La rete elettrica rischia il collasso',
    text: 'Una centrale si è fermata e il gelo fa schizzare i consumi. Terna chiede subito se staccare l’industria per salvare le case.',
    choices: () => [{ t: 'Staccare le grandi industrie per 24 ore', fx: { pil: -0.02, grp: { conf: -5 }, appr: 0.4 }, r: 'Le case restano accese.' }, { t: 'Blackout a rotazione nelle città', fx: { appr: -1.5 }, r: 'Ore al buio in molte città.' }, { t: 'Importare energia a qualsiasi prezzo', fx: { oneOff: 0.6, infl: 0.05 }, r: 'Costa caro, ma nessuno se ne accorge.' }] },

  // ---------- D2: arriva dopo ----------
  { id: 'prezzo_nascosto', chain: true, for: 'premier', w: 0, img: 'eye', look: 'paper', title: c => `Il prezzo nascosto${c.t ? ': ' + c.t : ''}`,
    text: c => `Settimane fa avevi preso una decisione${c.c ? ': «' + c.c + '»' : ''}. ${c.h || pick(HIDDEN)}`,
    choices: () => [{ t: 'Assumersi la responsabilità', fx: { appr: -0.4, cred: 3 }, r: 'Ammettere l’errore ti fa perdere qualcosa oggi, ma guadagnare credibilità.' }, { t: 'Scaricare la colpa sui tecnici', fx: { cred: -3 }, r: 'Per ora regge, ma qualcuno se lo ricorderà.' }, { t: 'Rimediare con nuovi fondi', fx: { oneOff: 0.4, appr: 0.2 }, r: 'Il danno è riparato, a caro prezzo.' }] },

  // ---------- D6: ministri che litigano ----------
  { id: 'lite_ministri', for: 'premier', w: 1.6, cool: 16, cond: () => pm() && pm().length >= 1,
    prep: () => { const ks = Object.keys(G.gov.ministers).filter(k => { const p = person(G.gov.ministers[k]); return p && G.parties[p.party] && p.party !== myPid() || (p && p.party === myPid() && G.gov.ministers[k] !== G.player.name); }); const a = pick(ks); const pa = person(G.gov.ministers[a]).party; const bs = ks.filter(k => k !== a && person(G.gov.ministers[k]).party !== pa); if (!bs.length) return null; const b = pick(bs); return { a, b, na: G.gov.ministers[a], nb: G.gov.ministers[b], pa, pb: person(G.gov.ministers[b]).party }; },
    img: 'swap', look: 'chat', title: c => `${c.na.split(' ').pop()} contro ${c.nb.split(' ').pop()}`,
    text: c => `Lite in pubblico tra ${c.na} (${MIN_BY_ID[c.a].n}) e ${c.nb} (${MIN_BY_ID[c.b].n}) sui fondi della manovra. I giornali parlano di governo diviso: tutti aspettano che tu dia ragione a uno dei due.`,
    choices: c => [
      { t: `Dare ragione a ${c.na}`, fx: { satP: { [c.pa]: 6, [c.pb]: -7 } }, run: () => { remember(c.pb, `Hai dato torto a ${c.nb} in pubblico`, 0, 'sgarbo'); remember(c.pa, `Hai difeso ${c.na}`, 1); }, r: `${c.nb} incassa, il suo partito no.` },
      { t: `Dare ragione a ${c.nb}`, fx: { satP: { [c.pb]: 6, [c.pa]: -7 } }, run: () => { remember(c.pa, `Hai dato torto a ${c.na} in pubblico`, 0, 'sgarbo'); remember(c.pb, `Hai difeso ${c.nb}`, 1); }, r: `${c.na} incassa, il suo partito no.` },
      { t: 'Chiudere la lite in Consiglio dei ministri', fx: { pc: -2, sat: 1, appr: 0.3 }, r: 'Comunicato congiunto: «Piena sintonia». Nessuno ci crede, ma funziona.' }] },

  // ---------- X15: il mondo cambia ----------
  { id: 'shock_germania', for: 'premier', w: 0.7, cool: 104, cond: () => !G.shock, img: 'factory', look: 'paper', title: 'La Germania entra in recessione',
    text: 'Il primo mercato dell’export italiano si ferma. Per i prossimi mesi le fabbriche del Nord venderanno meno: la crescita frenerà per tutti.',
    choices: () => [{ t: 'Sostegni all’export e cassa integrazione', fx: { oneOff: 1, grp: { conf: 4, sind: 3 } }, run: () => startShock('germania', 0.7), r: 'L’impatto è attutito.' }, { t: 'Cercare nuovi mercati (USA, India, Golfo)', fx: { pc: -2, fama: 2 }, run: () => startShock('germania', 0.85), r: 'Missioni commerciali in tre continenti.' }, { t: 'Aspettare che passi', fx: {}, run: () => startShock('germania'), r: 'La crisi arriva tutta.' }] },
  { id: 'shock_dazi', for: 'premier', w: 0.7, cool: 104, cond: () => !G.shock, img: 'globe', look: 'tv', title: 'Scoppia la guerra commerciale',
    text: 'Stati Uniti e Cina alzano i dazi del 50% e l’Europa risponde. Per mesi export e prezzi ne risentiranno.',
    choices: () => [{ t: 'Linea comune europea', fx: { grp: { ue: 4 } }, run: () => startShock('dazi', 0.8), r: 'L’Europa tratta unita.' }, { t: 'Trattativa bilaterale con Washington', fx: { grp: { ue: -4 }, fama: 2 }, run: () => startShock('dazi', 0.7), r: 'Qualche esenzione per i prodotti italiani.' }, { t: 'Aiuti alle imprese colpite', fx: { oneOff: 1.2, grp: { conf: 4 } }, run: () => startShock('dazi', 0.85), r: 'Fondi per agroalimentare e moda.' }] },
  { id: 'shock_petrolio', for: 'premier', w: 0.7, cool: 104, cond: () => !G.shock, img: 'fire', look: 'tv', title: 'Il petrolio vola a 140 dollari',
    text: 'Una crisi nello Stretto di Hormuz blocca le petroliere. Benzina oltre i 2,5 euro, bollette in aumento per mesi.',
    choices: () => [{ t: 'Taglio delle accise sulla benzina', fx: { oneOff: 2, appr: 1 }, run: () => startShock('petrolio', 0.8), r: 'Pieno più leggero, conti più pesanti.' }, { t: 'Bonus per le famiglie povere', fx: { oneOff: 0.8, appr: 0.5 }, run: () => startShock('petrolio'), r: 'Aiuto mirato.' }, { t: 'Più rinnovabili, subito', fx: { oneOff: 0.5, grp: { ue: 3 } }, run: () => startShock('petrolio', 0.9), r: 'Effetti nel lungo periodo.' }] },
  { id: 'shock_pandemia', for: 'premier', w: 0.35, cool: 200, once: true, cond: () => !G.shock && G.week > 60, img: 'stetho', look: 'tv', title: 'Nuova epidemia: ospedali sotto pressione',
    text: 'Un virus respiratorio si diffonde rapidamente. Gli esperti chiedono misure, le imprese temono nuove chiusure.',
    choices: () => [{ t: 'Mascherine e vaccini, niente chiusure', fx: { appr: 0.5, oneOff: 1 }, run: () => startShock('pandemia', 0.8), r: 'Il Paese resta aperto.' }, { t: 'Chiusure mirate nelle zone rosse', fx: { appr: -0.5, oneOff: 2, grp: { conf: -4 } }, run: () => startShock('pandemia', 0.6), r: 'Il contagio rallenta, l’economia soffre.' }, { t: 'Minimizzare', fx: { appr: -1.5 }, run: () => startShock('pandemia', 1.3), r: 'Gli ospedali si riempiono.' }] },

  // ---------- X16: il Papa e il Quirinale ----------
  { id: 'papa_poveri', for: 'all', w: 1.2, cool: 40, img: 'church', look: 'social', title: () => `${INSTITUTIONS.papa}: «La politica non dimentichi i poveri»`,
    text: 'All’Angelus il Papa parla di salari troppo bassi e famiglie che non arrivano a fine mese. I giornali chiedono a tutti i leader una risposta.',
    choices: () => [{ t: 'Rispondere con una proposta concreta', fx: { grp: { chiesa: 5 }, cred: 2, pc: -1 }, r: 'Il Vaticano apprezza.' }, { t: 'Ringraziare e cambiare argomento', fx: { grp: { chiesa: 1 } }, r: 'Risposta di circostanza.' }, { t: '«La Chiesa non fa politica»', fx: { grp: { chiesa: -6 }, fama: 1 }, r: 'Polemica con i vescovi.' }] },
  { id: 'papa_pace', for: 'all', w: 1, cool: 50, img: 'dove', look: 'social', title: 'Il Papa chiede di fermare le armi',
    text: 'Dal Vaticano un appello a fermare l’invio di armi e ad aprire negoziati. Il mondo cattolico si mobilita.',
    choices: () => [{ t: 'Sostenere l’appello', fx: { grp: { chiesa: 5, ue: -2 }, rel: { M5S: 2, AVS: 2 } }, r: 'Ti schieri con la pace.' }, { t: 'Rispettoso dissenso', fx: { grp: { chiesa: -2, ue: 2 } }, r: '«La pace si difende anche aiutando chi è aggredito.»' }] },
  { id: 'quir_rinvio', for: 'premier', w: 1, cool: 40, cond: () => G.enacted.some(e => G.week - e.w < 6 && (e.by === 'player' || e.by === 'aigov')), img: 'building', look: 'call', title: 'Il Quirinale rinvia una legge alle Camere',
    text: () => `${INSTITUTIONS.pdr} non firma l’ultima legge approvata e la rimanda al Parlamento con un messaggio: «Profili di dubbia costituzionalità».`,
    choices: () => [{ t: 'Correggere il testo come chiede il Colle', fx: { grp: { quir: 8 }, pc: -2 }, r: 'Testo corretto in due settimane.' }, { t: 'Riapprovarla identica', fx: { grp: { quir: -12, mag: -3 }, fama: 2 }, r: 'Scontro istituzionale senza precedenti.' }, { t: 'Lasciarla cadere', fx: { appr: -0.5, grp: { quir: 3 } }, r: 'La riforma salta.' }] },
  { id: 'quir_messaggio', for: 'all', w: 1, cool: 50, cond: () => monthOf(G.week) === 11, img: 'building', look: 'tv', title: 'Il messaggio di fine anno del Presidente',
    text: () => `Nel messaggio di fine anno ${INSTITUTIONS.pdr} parla di lavoro povero, giovani che emigrano e rispetto tra le istituzioni. Milioni di spettatori.`,
    choices: () => [{ t: 'Commento istituzionale: «Parole da ascoltare»', fx: { grp: { quir: 4 }, cred: 1 }, r: 'Clima sereno col Colle.' }, { t: 'Cogliere l’occasione per un tuo annuncio', fx: { fama: 2, grp: { quir: -2 } }, r: 'Qualcuno lo trova inopportuno.' }] },
];
EVENTS4.forEach(e => { EVENTS.push(e); EVENT_BY_ID[e.id] = e; });
