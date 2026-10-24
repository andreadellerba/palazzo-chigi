// ============================================================
//  ALTRI IMPREVISTI: aziende, esteri, calendario, sport, tecnologia,
//  natura, opposizione, scelte di persone e CATENE DI CONSEGUENZE
//  Scenari plausibili e inventati: nessuna accusa a persone o aziende reali.
// ============================================================
const mese = () => monthOf(G.week);
// chi mandi? scelta tra i ministri e lo staff, con pro e contro
function peopleChoices(c, mids, task) {
  const out = [];
  mids.forEach(mid => {
    const n = G.gov && G.gov.ministers[mid]; if (!n || n === G.player.name) return;
    const p = person(n), comp = p ? p.comp : 5, party = p && G.parties[p.party] ? p.party : null;
    out.push({ t: `Mandare ${n} (${MIN_BY_ID[mid].n})`, fx: comp >= 7 ? { appr: 1, satP: party ? { [party]: 3 } : undefined } : comp <= 4 ? { appr: -0.8 } : { appr: 0.3 }, r: comp >= 7 ? `${n} gestisce ${task} con competenza.` : comp <= 4 ? `${n} inciampa: le immagini non aiutano.` : `${n} se la cava.` });
  });
  out.push({ t: 'Andare di persona', fx: { appr: 1.2, fama: 2, stress: 5, pc: -1 }, r: 'La tua presenza fa la differenza, ma ti costa energie.' });
  return out.slice(-4);
}
const EVENTS3 = [
  // ---------- X1 · grandi aziende ----------
  { id: 'tim_rete', for: 'premier', w: 1.1, cool: 70, img: 'radio', look: 'paper', title: 'La rete telefonica cambia padrone',
    text: 'Il fondo che controlla la rete fissa ex TIM valuta la vendita a un gruppo straniero. Il ministero può usare il golden power: la rete è infrastruttura strategica.',
    choices: () => [{ t: 'Golden power: la rete resta in mani italiane', fx: { grp: { merc: -3, ue: -1 }, appr: 0.8 }, r: 'La vendita salta, i mercati storcono il naso.' }, { t: 'Lo Stato sale nel capitale', fx: { oneOff: 1.2, grp: { sind: 3 }, appr: 0.5 }, r: 'Il Tesoro compra una quota di minoranza.' }, { t: 'Via libera con garanzie su investimenti', fx: { grp: { merc: 3, conf: 2 } }, r: 'Accordo su fibra e posti di lavoro.' }] },
  { id: 'autostrade_conc', for: 'premier', w: 1, cool: 80, img: 'car', look: 'paper', title: 'Concessioni autostradali in scadenza',
    text: 'Scadono alcune concessioni autostradali: rinnovarle ai privati, farle gestire allo Stato o metterle a gara?',
    choices: () => [{ t: 'Gara europea', fx: { grp: { ue: 4, merc: 2 } }, r: 'Procedura lunga ma trasparente.' }, { t: 'Gestione pubblica con ANAS', fx: { grp: { sind: 3, merc: -3 }, appr: 0.5, oneOff: 0.5 }, r: 'I caselli passano allo Stato.' }, { t: 'Proroga ai gestori attuali', fx: { grp: { conf: 2, ue: -4 }, appr: -0.8 }, r: 'Bruxelles apre un’istruttoria.' }] },
  { id: 'mps_vendita', for: 'premier', w: 1, cool: 90, img: 'bank', look: 'paper', title: 'L’ultima quota di Monte dei Paschi',
    text: 'Il Tesoro ha ancora una quota di Monte dei Paschi. Vendere ora fa incassare, ma Siena teme di perdere la sua banca.',
    choices: () => [{ t: 'Vendere tutto', fx: { debt: -0.05, grp: { merc: 3 }, appr: -0.3 }, r: 'Incasso record, Siena protesta.' }, { t: 'Tenere la quota', fx: { grp: { merc: -1 } }, r: 'Lo Stato resta nel capitale.' }, { t: 'Vendere a un polo bancario italiano', fx: { debt: -0.04, grp: { ue: -1, conf: 2 }, pc: -1 }, r: 'Nasce un nuovo terzo polo.' }] },
  { id: 'rai_ascolti', for: 'premier', w: 1, cool: 60, img: 'tv', look: 'social', title: 'La RAI perde ascolti e conduttori',
    text: 'Altri volti noti lasciano la RAI per le piattaforme. «TeleMeloni», ironizzano le opposizioni sul servizio pubblico.',
    choices: () => [{ t: 'Riforma della governance RAI', fx: { grp: { media: 6, ue: 2 }, satP: { FDI: -2 } }, r: 'Vertici scelti con un concorso pubblico.' }, { t: 'Difendere i vertici attuali', fx: { grp: { media: -4 }, appr: -0.4 }, r: 'Polemica per giorni.' }, { t: 'Più fondi per l’informazione locale', fx: { oneOff: 0.2, grp: { media: 3 } }, r: 'Le sedi regionali respirano.' }] },
  // ---------- X3 · esteri ----------
  { id: 'gas_crisi', for: 'premier', w: 1.2, cool: 60, cond: () => [10, 11, 0, 1].includes(mese()), img: 'bolt', look: 'tv', title: 'Inverno freddo, stoccaggi di gas sotto la media',
    text: 'Un’ondata di gelo e un gasdotto fermo: gli stoccaggi scendono sotto il 40%. Il prezzo del gas raddoppia in una settimana.',
    choices: () => [{ t: 'Riduzione obbligatoria dei consumi', fx: { appr: -1, infl: -0.1, grp: { conf: -3 } }, r: 'Termosifoni a 19 gradi negli uffici pubblici.' }, { t: 'Comprare GNL a qualsiasi prezzo', fx: { oneOff: 1.5, infl: 0.2, appr: 0.5 }, r: 'Navi metaniere in arrivo da USA e Qatar.' }, { t: 'Acquisto comune con l’UE', fx: { grp: { ue: 4 }, infl: 0.1 }, r: 'Prezzi un po’ più bassi, tempi più lunghi.' }] },
  { id: 'ostaggi', for: 'premier', w: 0.8, cool: 80, img: 'globe', look: 'tv', title: 'Italiani sequestrati all’estero',
    text: 'Tre cooperanti italiani sono stati rapiti in Africa occidentale. I servizi segreti hanno un contatto con i rapitori.',
    choices: () => [{ t: 'Trattativa riservata', fx: { appr: 1, grp: { quir: 2 }, oneOff: 0.1 }, r: 'Dopo tre settimane tornano a casa: il Paese tira un sospiro di sollievo.' }, { t: 'Blitz con le forze speciali', fx: { appr: 2, fama: 3, stress: 4 }, r: 'Operazione riuscita, ma ad alto rischio.', run: () => { if (chance(0.25)) { applyFx({ appr: -4 }); addNews('Il blitz fallisce: un ostaggio ferito. Polemiche sul governo.', 'bad'); } } }, { t: 'Lasciare fare alla diplomazia', fx: { appr: -0.3 }, r: 'I tempi si allungano.' }] },
  { id: 'libia_partenze', for: 'premier', w: 1.2, cool: 40, cond: () => [4, 5, 6, 7].includes(mese()), img: 'wave', look: 'tv', title: 'La Libia riapre le partenze',
    text: 'Dopo un cambio al vertice a Tripoli, le motovedette libiche non pattugliano più: centinaia di barchini verso la Sicilia.',
    choices: () => [{ t: 'Missione diplomatica a Tripoli', fx: { pc: -2, fama: 2, grp: { ue: 1 } }, r: 'Accordo rinnovato in cambio di aiuti.' }, { t: 'Più navi della Marina', fx: { oneOff: 0.4, satP: { LEGA: 3 }, grp: { chiesa: -3 } }, r: 'Controlli rafforzati.' }, { t: 'Chiedere una missione europea', fx: { grp: { ue: 3 }, appr: -0.3 }, r: 'Bruxelles promette, i tempi sono lunghi.' }] },
  { id: 'usa_elezioni', for: 'all', w: 1.5, once: true, cond: () => yearOf(G.week) === 2028 && mese() === 10, img: 'globe', look: 'tv', title: 'Elezioni presidenziali negli Stati Uniti',
    text: 'Gli americani scelgono il nuovo presidente. La notte elettorale si segue in diretta anche da Roma: dazi, NATO e Ucraina dipendono anche da qui.',
    choices: () => [{ t: 'Congratularsi subito con il vincitore', fx: { fama: 1 }, r: 'Telefonata cordiale.' }, { t: 'Aspettare i risultati ufficiali', fx: { cred: 1 }, r: 'Prudenza istituzionale.' }] },
  // ---------- X5 · calendario vero ----------
  { id: 'sanremo', for: 'all', w: 2, cool: 40, cond: () => mese() === 1, img: 'mic', look: 'social', title: 'Sanremo: un monologo politico fa discutere',
    text: 'Dal palco dell’Ariston un artista lancia una frecciata alla politica. Tutti ti chiedono un commento.',
    choices: () => [{ t: 'Rispondere con ironia', fx: { fama: 3, my: 0.3 }, r: 'La tua battuta diventa un meme.' }, { t: '«Sanremo è Sanremo», niente polemiche', fx: { cred: 1 }, r: 'Risposta elegante.' }, { t: 'Attaccare la RAI', fx: { fama: 2, grp: { media: -4 }, my: -0.2 }, r: 'Polemica che dura una settimana.' }] },
  { id: 'aprile25', for: 'all', w: 2, cool: 40, cond: () => mese() === 3, img: 'flag', look: 'social', title: '25 aprile: dove sarai?',
    text: 'Festa della Liberazione: cortei in tutta Italia, i giornalisti aspettano di vedere dove andrai.',
    choices: () => [{ t: 'Al corteo di Milano', fx: { fama: 2, rel: { PD: 2, AVS: 3 }, grp: { sind: 2 } }, r: 'Applausi e qualche fischio.' }, { t: 'All’Altare della Patria con le istituzioni', fx: { grp: { quir: 3 }, cred: 1 }, r: 'Scelta istituzionale.' }, { t: 'Un messaggio sui social', fx: { fama: 1 }, r: 'Passa quasi inosservato.' }] },
  { id: 'maggio1', for: 'all', w: 1.8, cool: 40, cond: () => mese() === 4, img: 'fist', look: 'social', title: 'Primo maggio: il concertone e i sindacati',
    text: 'Dal palco di piazza San Giovanni i sindacati chiedono salari più alti e sicurezza sul lavoro.',
    choices: () => [{ t: 'Annunciare una misura sulla sicurezza sul lavoro', fx: { grp: { sind: 5 }, pc: -1, my: 0.2 }, r: 'I sindacati prendono nota.' }, { t: 'Festeggiare con i lavoratori di una fabbrica', fx: { fama: 2, grp: { sind: 2, conf: 1 } }, r: 'Foto in tuta blu.' }, { t: 'Nessun commento', fx: { grp: { sind: -2 } }, r: 'Silenzio notato.' }] },
  { id: 'maturita', for: 'all', w: 1.6, cool: 40, cond: () => mese() === 5, img: 'cap', look: 'social', title: 'Maturità: la traccia che divide',
    text: 'Una traccia della prima prova cita un autore controverso. Studenti e professori discutono sui social.',
    choices: () => [{ t: 'Fare gli auguri ai maturandi', fx: { fama: 1, my: 0.1 }, r: 'Il tuo video ha migliaia di visualizzazioni tra i giovani.' }, { t: 'Entrare nella polemica sulla traccia', fx: { fama: 2, my: -0.1 }, r: 'Discussione accesa.' }] },
  { id: 'esodo', for: 'premier', w: 1.6, cool: 40, cond: () => mese() === 7, img: 'car', look: 'tv', title: 'Esodo estivo: autostrade e treni in tilt',
    text: 'Bollino nero sulle autostrade e treni in ritardo per un guasto: migliaia di turisti bloccati sotto il sole.',
    choices: () => [{ t: 'Rimborsi e acqua gratis nelle stazioni', fx: { appr: 0.6, oneOff: 0.05 }, r: 'Gesto apprezzato.' }, { t: 'Commissario per le infrastrutture estive', fx: { pc: -1, appr: 0.3 }, r: 'Promessa: mai più un’estate così.' }, { t: '«Problemi normali d’agosto»', fx: { appr: -1 }, r: 'La frase fa il giro dei social.' }] },
  { id: 'rimini', for: 'all', w: 1.4, cool: 40, cond: () => mese() === 7, img: 'users', look: 'chat', title: 'Invito al Meeting di Rimini',
    text: 'Il Meeting per l’amicizia fra i popoli ti invita a parlare. Platea cattolica e moderata, migliaia di giovani.',
    choices: () => [{ t: 'Accettare e parlare di famiglia e lavoro', fx: { fama: 2, grp: { chiesa: 4 }, my: 0.2 }, r: 'Applausi lunghi.' }, { t: 'Accettare e parlare di diritti', fx: { fama: 2, grp: { chiesa: -2 }, my: 0.1 }, r: 'Accoglienza tiepida.' }, { t: 'Declinare', fx: {}, r: 'Ci va un tuo rivale.' }] },
  { id: 'natale', for: 'premier', w: 1.4, cool: 40, cond: () => mese() === 11, img: 'star', look: 'paper', title: 'Natale: caro prezzi e tredicesime',
    text: 'I consumatori denunciano prezzi su del 7% per il cenone. Le associazioni chiedono un bonus per le famiglie povere.',
    choices: () => [{ t: 'Bonus spesa di Natale', fx: { oneOff: 0.5, appr: 1 }, r: 'Carta da 100 euro per un milione di famiglie.' }, { t: 'Accordo con la grande distribuzione', fx: { pc: -1, appr: 0.5, infl: -0.05 }, r: 'Paniere a prezzi bloccati.' }, { t: 'Nessun intervento', fx: { appr: -0.5 }, r: 'I telegiornali parlano di Natale amaro.' }] },
  // ---------- X6 · sport ----------
  { id: 'giro', for: 'all', w: 1.2, cool: 40, cond: () => mese() === 4, img: 'trophy', look: 'social', title: 'Il Giro d’Italia passa dalla tua regione',
    text: () => `La tappa di domani attraversa ${regionName(G.player.region)}. Gli organizzatori ti invitano sull’ammiraglia.`,
    choices: () => [{ t: 'Salire sull’ammiraglia', fx: { fama: 2, stress: 2 }, r: 'Belle immagini tra la folla.', run: () => { G.myReg[G.player.region] = (G.myReg[G.player.region] || 1) + 0.05; } }, { t: 'Un saluto via social', fx: { fama: 1 }, r: 'Qualche like.' }] },
  { id: 'europei', for: 'all', w: 3, once: true, cond: () => yearOf(G.week) === 2028 && [5, 6].includes(mese()), img: 'ball', look: 'tv', title: 'L’Italia in finale agli Europei',
    text: 'Gli azzurri sono in finale. Il Paese si ferma, i maxischermi riempiono le piazze.',
    choices: () => [{ t: 'Volare allo stadio', fx: { fama: 4, stress: 3, appr: 0.5 }, r: 'In tribuna con il Presidente della Repubblica.' }, { t: 'Guardarla in piazza con i tifosi', fx: { fama: 3, my: 0.4 }, r: 'Le foto in mezzo alla gente spopolano.' }, { t: 'Nessuna foto: niente politica sul calcio', fx: { cred: 2 }, r: 'Scelta sobria.' }] },
  { id: 'olimpiadi', for: 'all', w: 2, once: true, cond: () => yearOf(G.week) === 2028 && mese() === 7, img: 'medal', look: 'tv', title: 'Pioggia di medaglie azzurre',
    text: 'Le Olimpiadi di Los Angeles regalano all’Italia un record di ori. Gli atleti chiedono più impianti e più sport a scuola.',
    choices: () => [{ t: 'Un piano per lo sport a scuola', fx: { oneOff: 0.3, fama: 2, my: 0.3 }, r: 'Due ore di sport in più alle elementari.' }, { t: 'Ricevere gli atleti a Roma', fx: { fama: 3 }, r: 'Festa con i campioni.' }] },
  // ---------- X7 · tecnologia ----------
  { id: 'hacker_sanita', for: 'premier', w: 1.2, cool: 50, img: 'laptop', look: 'tv', title: 'Attacco hacker agli ospedali',
    text: 'Un ransomware blocca i sistemi di tre aziende sanitarie: prenotazioni ferme, referti irraggiungibili. I criminali chiedono un riscatto.',
    choices: () => [{ t: 'Non pagare e ripristinare con l’Agenzia cyber', fx: { appr: -0.5, cred: 2, oneOff: 0.2 }, r: 'Una settimana di disagi, poi tutto riparte.' }, { t: 'Piano nazionale di sicurezza informatica', fx: { oneOff: 1, appr: 0.5, grp: { conf: 2 } }, r: 'Investimenti per tre anni.' }, { t: 'Lasciare decidere alle Regioni', fx: { appr: -1 }, r: 'Rimpallo di responsabilità.' }] },
  { id: 'blackout', for: 'premier', w: 1, cool: 60, cond: () => [6, 7].includes(mese()), img: 'bolt', look: 'tv', title: 'Blackout nel caldo record',
    text: 'Con 40 gradi e i condizionatori al massimo, la rete elettrica cede: mezza Sicilia e parte della Calabria al buio per ore.',
    choices: () => [{ t: 'Investimenti straordinari sulla rete', fx: { oneOff: 1, appr: 0.6 }, r: 'Piano Terna accelerato.' }, { t: 'Sanzioni ai gestori', fx: { appr: 0.4, grp: { conf: -3 } }, r: 'Multe e indennizzi.' }, { t: '«Evento eccezionale»', fx: { appr: -0.8 }, r: 'I siciliani non apprezzano.' }] },
  { id: 'dati_rubati', for: 'all', w: 1, cool: 60, img: 'lock', look: 'paper', title: 'Rubati i dati di milioni di italiani',
    text: 'Un gruppo di hacker mette in vendita i dati fiscali e sanitari di milioni di cittadini. Si scopre che ci sono anche quelli di molti politici.',
    choices: () => [{ t: 'Chiedere una commissione d’inchiesta', fx: { fama: 2, my: 0.2 }, r: 'Proposta accolta.' }, { t: 'Proporre più fondi per la cybersicurezza', fx: { cred: 2 }, r: 'Bene accolta dagli esperti.' }] },
  // ---------- X8 · natura ed emergenze ----------
  { id: 'terremoto', for: 'premier', w: 0.9, cool: 70, prep: () => ({ r: pick(REGIONS_DEF.filter(r => ['MAR', 'ABR', 'UMB', 'CAM', 'CAL', 'SIC', 'EMR'].includes(r.id))) }), img: 'alert', look: 'tv', title: c => `Terremoto in ${c.r.n}`,
    text: c => `Una scossa di magnitudo 5.8 colpisce l’entroterra di ${c.r.n}: crolli, sfollati, paesi isolati. Chi mandi a coordinare i soccorsi?`,
    choices: c => peopleChoices(c, ['INT', 'PROT', 'MIT'], 'l’emergenza') },
  { id: 'etna', for: 'premier', w: 0.8, cool: 60, img: 'volcano', look: 'tv', title: 'L’Etna erutta, aeroporto di Catania chiuso',
    text: 'Fontane di lava e una nube di cenere: l’aeroporto resta chiuso per tre giorni, turismo e agricoltura in ginocchio.',
    choices: () => [{ t: 'Stato di emergenza e ristori', fx: { oneOff: 0.4, appr: 0.8 }, r: 'Aiuti a chi ha perso il raccolto.' }, { t: 'Voli dirottati e bus gratuiti', fx: { oneOff: 0.1, appr: 0.4 }, r: 'Disagi contenuti.' }] },
  { id: 'caldo', for: 'premier', w: 1.2, cool: 50, cond: () => mese() === 6, img: 'sun', look: 'tv', title: 'Caldo record: 45 gradi in Sicilia',
    text: 'Ondata di calore senza precedenti: ospedali sotto pressione, cantieri fermi nelle ore calde, anziani a rischio.',
    choices: () => [{ t: 'Stop ai lavori all’aperto nelle ore calde', fx: { grp: { sind: 4, conf: -2 }, appr: 0.5 }, r: 'Ordinanza nazionale.' }, { t: 'Centri climatizzati per gli anziani', fx: { oneOff: 0.2, appr: 0.7 }, r: 'Aperti in 300 comuni.' }, { t: 'Lasciare fare alle Regioni', fx: { appr: -0.6 }, r: 'Regole diverse ovunque.' }] },
  { id: 'alluvione_chi', for: 'premier', w: 0.9, cool: 60, prep: () => ({ r: pick(REGIONS_DEF.filter(r => ['EMR', 'LIG', 'TOS', 'VEN', 'PIE'].includes(r.id))) }), img: 'rain', look: 'tv', title: c => `Fiumi esondati in ${c.r.n}`,
    text: c => `Piogge eccezionali in ${c.r.n}: argini rotti e paesi allagati. Serve qualcuno sul posto, subito.`,
    choices: c => peopleChoices(c, ['PROT', 'MASE', 'INT'], 'i soccorsi') },
  // ---------- X9 · opposizione e piazze ----------
  { id: 'referendum_lampo', for: 'premier', w: 1, cool: 70, img: 'pen', look: 'social', title: 'Firme online per un referendum contro di te',
    text: () => `In pochi giorni 500.000 firme online per abrogare una legge del tuo governo. ${oppLeader().leader} cavalca la protesta.`,
    choices: () => [{ t: 'Sfidarli: «Ci vediamo alle urne»', fx: { fama: 2, my: 0.3, appr: -0.3 }, r: 'Scontro aperto.' }, { t: 'Modificare la legge per evitare il voto', fx: { pc: -2, appr: 0.4 }, r: 'Il referendum perde senso.' }, { t: 'Ignorare', fx: { appr: -0.5 }, r: 'La protesta cresce.' }] },
  { id: 'occupazioni', for: 'premier', w: 1.2, cool: 40, cond: () => [9, 10, 11].includes(mese()), img: 'cap', look: 'chat', title: 'Scuole occupate in tutta Italia',
    text: 'Gli studenti occupano decine di licei contro la riforma della scuola e il caro affitti universitario.',
    choices: () => [{ t: 'Incontrare una delegazione di studenti', fx: { fama: 2, appr: 0.4 }, r: 'Dialogo apprezzato.' }, { t: 'Sgomberi e sanzioni', fx: { appr: -0.5, satP: { LEGA: 2 } }, r: 'Immagini di tensione.' }, { t: 'Lasciare fare ai presidi', fx: {}, r: 'Le occupazioni finiscono a Natale.' }] },
  // ---------- X10 · chi mandi? ----------
  { id: 'chi_tv', for: 'premier', w: 1.4, cool: 26, img: 'tv', look: 'chat', title: 'Chi va in TV a difendere il governo?',
    text: 'Stasera il talk show più visto dedica la puntata agli scontri nella maggioranza. Serve una faccia del governo.',
    choices: c => peopleChoices(c, ['MEF', 'SOTT', 'RAPP', 'LAV'], 'il confronto in studio') },
  { id: 'chi_bruxelles', for: 'premier', w: 1, cool: 40, img: 'eu', look: 'chat', title: 'Chi tratta a Bruxelles sui conti?',
    text: 'L’Eurogruppo discute i conti italiani. Serve qualcuno che convinca i falchi del Nord.',
    choices: c => peopleChoices(c, ['MEF', 'UE', 'EST'], 'la trattativa') },

  // ---------- X2 · CATENE DI CONSEGUENZE ----------
  { id: 'condono', for: 'premier', w: 1.2, cool: 80, img: 'coin', look: 'paper', title: 'Un condono per fare cassa?',
    text: 'Il ministero dell’Economia propone un condono edilizio e fiscale: 2 miliardi subito, ma Bruxelles e magistrati storcono il naso.',
    choices: () => [{ t: 'Sì al condono', fx: { oneOff: -2, grp: { mag: -5, ue: -3 }, appr: 0.3 }, r: 'Incassi rapidi.', later: { w: 8, id: 'condono_inchiesta' } }, { t: 'No: niente regali a chi non paga', fx: { cred: 3, grp: { mag: 3 } }, r: 'Scelta di rigore.' }] },
  { id: 'condono_inchiesta', chain: true, for: 'premier', w: 0, img: 'gavel', look: 'paper', title: 'Il condono finisce sotto inchiesta',
    text: 'Due mesi dopo il condono, la procura scopre centinaia di sanatorie irregolari in zone a rischio frana.',
    choices: () => [{ t: 'Sospendere il condono', fx: { appr: -0.5, cred: 2, oneOff: 0.5 }, r: 'Marcia indietro.' }, { t: 'Difendere la norma', fx: { grp: { mag: -6 }, appr: -1 }, r: 'Scontro con i magistrati.' }] },
  { id: 'nomina_amico', for: 'premier', w: 1.2, cool: 80, img: 'briefcase', look: 'chat', title: 'Una nomina delicata',
    text: 'Per guidare una grande azienda pubblica ti suggeriscono un manager molto vicino al tuo partito, ma senza esperienza nel settore.',
    choices: () => [{ t: 'Nominarlo: è uno dei nostri', fx: { my: 0.2, grp: { merc: -2 } }, r: 'Il partito è contento.', later: { w: 10, id: 'nomina_scandalo' } }, { t: 'Scegliere un tecnico esperto', fx: { grp: { merc: 3 }, cred: 2 }, r: 'Scelta apprezzata dagli investitori.' }] },
  { id: 'nomina_scandalo', chain: true, for: 'premier', w: 0, img: 'news', look: 'paper', title: 'Il manager che hai nominato è nei guai',
    text: 'Il manager scelto mesi fa ha affidato consulenze milionarie ad amici. I giornali ricordano chi lo ha nominato.',
    choices: () => [{ t: 'Rimuoverlo subito', fx: { appr: -0.5, cred: 1 }, r: 'Danno limitato.' }, { t: 'Aspettare la magistratura', fx: { appr: -1.5, integ: -1 }, r: 'Lo scandalo si allarga.' }] },
  { id: 'promessa_sud', for: 'premier', w: 1.2, cool: 80, img: 'factory', look: 'paper', title: 'Promessa agli operai del Sud',
    text: 'Gli operai di uno stabilimento in Puglia rischiano il posto. Puoi promettere che lo Stato troverà un acquirente entro tre mesi.',
    choices: () => [{ t: 'Prometterlo in pubblico', fx: { appr: 1, grp: { sind: 4 } }, r: 'Applausi davanti ai cancelli.', later: { w: 12, id: 'promessa_sud_conto' } }, { t: 'Solo cassa integrazione', fx: { oneOff: 0.2, grp: { sind: -2 } }, r: 'Nessuna promessa, nessun illusione.' }] },
  { id: 'promessa_sud_conto', chain: true, for: 'premier', w: 0, img: 'fist', look: 'tv', title: 'Gli operai tornano a chiedere conto',
    text: 'Sono passati tre mesi: l’acquirente promesso non è arrivato. Gli operai occupano la fabbrica e ripetono le tue parole.',
    choices: () => [{ t: 'Intervento pubblico con Invitalia', fx: { oneOff: 0.6, appr: 0.8, grp: { sind: 4 } }, r: 'Lo Stato entra nel capitale: posti salvi.' }, { t: 'Chiedere ancora tempo', fx: { appr: -1.2, grp: { sind: -6 } }, r: 'La promessa tradita fa male.' }] },
  { id: 'tagli_sanita', for: 'premier', w: 1, cool: 80, img: 'hospital', look: 'paper', title: 'Tagliare la spesa sanitaria?',
    text: 'Per far quadrare i conti, il Tesoro propone di congelare le assunzioni negli ospedali per un anno.',
    choices: () => [{ t: 'Congelare le assunzioni', fx: { oneOff: -1, grp: { merc: 2, sind: -3 } }, r: 'Un miliardo risparmiato.', later: { w: 10, id: 'tagli_sanita_ps' } }, { t: 'No: la sanità non si tocca', fx: { appr: 0.4, grp: { merc: -1 } }, r: 'Bisogna trovare i soldi altrove.' }] },
  { id: 'tagli_sanita_ps', chain: true, for: 'premier', w: 0, img: 'ambulance', look: 'tv', title: 'Pronto soccorso al collasso',
    text: 'Mesi dopo il blocco delle assunzioni, i pronto soccorso hanno attese di 20 ore. Le opposizioni ricordano la tua scelta.',
    choices: () => [{ t: 'Sbloccare le assunzioni e chiedere scusa', fx: { oneOff: 1.2, appr: 0.5, cred: -1 }, r: 'Si torna indietro.' }, { t: 'Medici a gettone per l’emergenza', fx: { oneOff: 0.5, appr: -0.5 }, r: 'Toppa costosa.' }] },
  { id: 'dossier_rivale', for: 'leader', w: 1, cool: 80, cond: () => !!(G.staff && G.staff.spin), img: 'eye', look: 'chat', title: 'Lo spin doctor ha un dossier',
    text: 'Il tuo spin doctor ti mostra un dossier imbarazzante su un leader avversario. «Basta una telefonata a un giornalista amico.»',
    choices: () => [{ t: 'Farlo uscire', fx: { my: 0.6, integ: -1 }, r: 'Il rivale è in difficoltà per giorni.', later: { w: 6, id: 'dossier_boomerang' } }, { t: 'Distruggerlo', fx: { integ: 1, cred: 2 }, r: '«Non facciamo politica così.»' }] },
  { id: 'dossier_boomerang', chain: true, for: 'all', w: 0, img: 'news', look: 'paper', title: 'Chi ha passato il dossier?',
    text: 'Un quotidiano ricostruisce come il dossier sul leader avversario sia arrivato ai giornali. Le tracce portano al tuo staff.',
    choices: () => [{ t: 'Licenziare lo spin doctor', fx: { appr: -0.3, cred: 1 }, run: () => { if (G.staff) delete G.staff.spin; }, r: 'Il caso si chiude, perdi un collaboratore.' }, { t: 'Negare tutto', fx: { integ: -1, my: -0.5 }, r: 'Nessuno ci crede davvero.' }] },
];
EVENTS3.forEach(e => { EVENTS.push(e); EVENT_BY_ID[e.id] = e; });
