// ============================================================
//  NUOVI IMPREVISTI: aziende famose, economia reale,
//  attacchi dell'opposizione (se governi) e del governo (se sei all'opposizione)
//  Scenari plausibili e inventati: nessuna accusa a persone o aziende reali.
// ============================================================
const govBillInAula = () => G.bills.find(b => !b.dead && b.proposer === 'GOV' && b.type !== 'manovra' && b.stages[b.stage]);
const pickMinisterCtx = () => { if (!G.gov) return null; const ks = Object.keys(G.gov.ministers).filter(k => G.gov.ministers[k] && G.gov.ministers[k] !== G.player.name); if (!ks.length) return null; const k = pick(ks); return { k, n: G.gov.ministers[k] }; };
const EVENTS2 = [
  // ===================== AZIENDE E MERCATO =====================
  { id: 'ita_rotte', for: 'premier', w: 1.4, cool: 50, img: 'plane', title: 'ITA Airways taglia le rotte',
    text: 'Dopo l’ingresso di Lufthansa, ITA Airways annuncia il taglio di alcune rotte nazionali da Linate e Fiumicino. Sicilia e Sardegna protestano: «Isole sempre più lontane».',
    choices: () => [
      { t: 'Garantire i collegamenti con la continuità territoriale', fx: { oneOff: 0.2, appr: 0.8, grp: { conf: -1 } }, r: 'Le rotte restano, con un contributo pubblico.' },
      { t: 'Lasciare fare al mercato: arriveranno le low cost', fx: { grp: { merc: 3, conf: 2 }, appr: -1 }, r: 'Le low cost riempiono i vuoti, ma con prezzi ballerini.' },
      { t: 'Minacciare il golden power sul piano industriale', fx: { grp: { ue: -3, merc: -3 }, appr: 1.2, fama: 1 }, r: 'Francoforte frena i tagli. Bruxelles osserva perplessa.' },
    ] },
  { id: 'ryanair_sud', for: 'premier', w: 1.4, cool: 50, img: 'plane', title: 'Ryanair minaccia di tagliare i voli al Sud',
    text: 'Ryanair annuncia meno voli in Calabria, Sicilia e Abruzzo se non verrà abolita l’addizionale comunale sui biglietti aerei. I governatori chiedono di intervenire.',
    choices: () => [
      { t: 'Abolire l’addizionale nelle regioni del Sud', fx: { oneOff: 0.25, appr: 1, mood: { terr: -0.2 } }, r: 'I voli restano: più turisti, meno entrate per lo Stato.' },
      { t: '«Non ci facciamo ricattare»', fx: { appr: 0.3, fama: 1, pil: -0.01 }, r: 'Qualche rotta chiude davvero: protestano gli albergatori.' },
      { t: 'Un tavolo con tutte le compagnie aeree', fx: { pc: -1, grp: { conf: 2 } }, r: 'Si guadagna tempo: le rotte sono confermate per la stagione.' },
    ] },
  { id: 'pirelli_cina', for: 'premier', w: 1.1, cool: 70, img: 'car', title: 'Pirelli e il socio cinese',
    text: 'Il primo azionista cinese di Pirelli chiede più peso nel consiglio d’amministrazione. Gli Stati Uniti avvertono: i sensori dei pneumatici sono tecnologia sensibile.',
    choices: () => [
      { t: 'Golden power: limiti al socio cinese', fx: { grp: { merc: -2, ue: 2 }, appr: 0.8 }, r: 'Washington ringrazia, Pechino protesta formalmente.' },
      { t: 'Mediare un accordo tra i soci', fx: { pc: -1, grp: { conf: 3 } }, r: 'Compromesso sul consiglio d’amministrazione.' },
      { t: 'Non intervenire: è una società privata', fx: { grp: { merc: 3 }, appr: -0.5 }, r: 'Polemiche sulla sicurezza nazionale.' },
    ] },
  { id: 'extraprofitti', for: 'premier', w: 1.4, cool: 40, img: 'bolt', title: 'Utili record per l’energia',
    text: 'Le grandi compagnie dell’energia annunciano utili record mentre le famiglie pagano bollette ancora alte. L’opposizione chiede di tassare gli extraprofitti.',
    choices: () => [
      { t: 'Contributo straordinario sugli extraprofitti', fx: { oneOff: -2, appr: 1.5, grp: { conf: -6, merc: -4 } }, r: 'Entrano 2 miliardi; le aziende annunciano ricorsi.' },
      { t: 'Accordo volontario: tariffe calmierate per un anno', fx: { pc: -2, appr: 0.8, grp: { conf: 2 } }, r: 'Sconti in bolletta per sei milioni di famiglie.' },
      { t: 'Nessun intervento: il mercato si sta assestando', fx: { appr: -1.2, grp: { conf: 3, merc: 2 } }, r: 'I sondaggi registrano malumore.' },
    ] },
  { id: 'eni_gas', for: 'premier', w: 1.1, cool: 60, img: 'globe', title: 'ENI firma un maxi accordo sul gas',
    text: 'ENI chiude un accordo miliardario per nuovo gas dal Nord Africa. Occasione per rilanciare il Piano Mattei, ma gli ambientalisti protestano.',
    choices: () => [
      { t: 'Volare alla firma: «L’Italia hub del gas»', fx: { fama: 3, appr: 0.8, grp: { conf: 3 }, mood: { amb: 0.3 } }, r: 'Foto storica e prezzi del gas in calo.' },
      { t: 'Legare l’accordo alle rinnovabili', fx: { grp: { ue: 3 }, appr: 0.4, mood: { amb: -0.2 } }, r: 'Parte del progetto finanzierà impianti solari.' },
      { t: 'Lasciare la scena all’azienda', fx: {}, r: 'Notizia da pagine economiche.' },
    ] },
  { id: 'leonardo_ue', for: 'premier', w: 1.2, cool: 60, img: 'shield', title: 'Commessa europea per Leonardo',
    text: 'Leonardo è in corsa per una grande commessa della difesa europea. Serve una scelta politica: fabbriche in Italia o filiera condivisa con Germania e Francia?',
    choices: () => [
      { t: 'Pretendere produzione e posti di lavoro in Italia', fx: { pil: 0.03, grp: { sind: 3, ue: -2 }, appr: 0.6 }, r: 'Gli stabilimenti italiani festeggiano.' },
      { t: 'Filiera europea condivisa', fx: { grp: { ue: 5, merc: 2 }, pil: 0.01 }, r: 'Bruxelles apprezza la scelta europeista.' },
      { t: 'Frenare: più armi non è una priorità', fx: { grp: { chiesa: 3, conf: -4 }, rel: { M5S: 3, AVS: 3 }, satP: { FDI: -3 } }, r: 'Pacifisti soddisfatti, industria delusa.' },
    ] },
  { id: 'fincantieri_operai', for: 'premier', w: 1.1, cool: 60, img: 'ship', title: 'Fincantieri non trova operai',
    text: 'Fincantieri ha ordini per anni ma non trova saldatori e carpentieri. Chiede più ingressi di lavoratori dall’estero con il decreto flussi.',
    choices: () => [
      { t: 'Più ingressi regolari per l’industria', fx: { pil: 0.02, grp: { conf: 4 }, mood: { imm: -0.2 }, satP: { LEGA: -3 } }, r: 'I cantieri navali ripartono a pieno ritmo.' },
      { t: 'Formare giovani italiani: scuole di mestiere', fx: { oneOff: 0.3, grp: { sind: 3 }, appr: 0.5 }, r: 'Risultati tra un paio d’anni.' },
      { t: 'Alzare i salari, non gli ingressi', fx: { grp: { sind: 5, conf: -3 }, rel: { PD: 2, AVS: 2 } }, r: 'La FIOM applaude, le imprese no.' },
    ] },
  { id: 'pedaggi', for: 'premier', w: 1.3, cool: 52, cond: () => [10, 11, 0].includes(monthOf(G.week)), img: 'car', title: 'Pedaggi autostradali in aumento',
    text: 'Da gennaio i pedaggi autostradali salgono dell’1,8%. Associazioni dei consumatori e autotrasportatori sul piede di guerra.',
    choices: () => [
      { t: 'Congelare gli aumenti per un anno', fx: { oneOff: 0.3, appr: 1 }, r: 'Gli automobilisti ringraziano, i concessionari chiedono compensazioni.' },
      { t: 'Aumenti solo dove ci sono investimenti', fx: { pc: -1, grp: { conf: 1 } }, r: 'Misura tecnica, accolta con freddezza.' },
      { t: 'Gli aumenti sono previsti dalle concessioni', fx: { appr: -0.8, grp: { merc: 1 } }, r: 'Rabbia sui social a ogni casello.' },
    ] },
  { id: 'data_center', for: 'premier', w: 1.2, cool: 60, img: 'chip', title: 'Miliardi per i data center',
    text: 'Microsoft e Amazon annunciano investimenti miliardari in data center tra Lombardia e Piemonte. Chiedono permessi rapidi ed energia a prezzi certi.',
    choices: () => [
      { t: 'Corsia veloce per i permessi', fx: { pil: 0.04, grp: { conf: 5 }, mood: { amb: 0.2 } }, r: 'Cantieri al via in pochi mesi.' },
      { t: 'Sì, ma con energia rinnovabile e posti di lavoro', fx: { pil: 0.02, grp: { ue: 2 }, appr: 0.5 }, r: 'Accordo su impianti solari dedicati.' },
      { t: 'Prima la rete elettrica per le famiglie', fx: { pil: -0.01, appr: 0.3, grp: { conf: -3 } }, r: 'Parte degli investimenti va in Spagna.' },
    ] },
  { id: 'elettrodomestici', for: 'premier', w: 1.2, cool: 60, img: 'factory', title: 'Elettrodomestici: chiudono due fabbriche',
    text: 'Il gruppo turco che ha rilevato le fabbriche ex Whirlpool annuncia chiusure e quasi duemila esuberi tra Marche, Lombardia e Campania.',
    choices: () => [
      { t: 'Golden power e tavolo al ministero', fx: { pc: -2, grp: { sind: 5 }, appr: 0.8 }, r: 'Esuberi dimezzati dopo settimane di trattativa.' },
      { t: 'Cassa integrazione e nuovi investitori', fx: { oneOff: 0.4, grp: { sind: 2 } }, r: 'Gli operai restano in attesa di un acquirente.' },
      { t: '«Sono scelte aziendali»', fx: { grp: { sind: -6 }, appr: -1 }, r: 'Presidi davanti ai cancelli.' },
    ] },
  { id: 'banca_ia', for: 'premier', w: 1.1, cool: 60, img: 'bank', title: 'La banca e l’intelligenza artificiale',
    text: 'Il primo gruppo bancario italiano annuncia migliaia di uscite volontarie e nuove assunzioni di esperti digitali: l’intelligenza artificiale cambia il lavoro in filiale.',
    choices: () => [
      { t: 'Un patto per la formazione digitale', fx: { pc: -1, grp: { sind: 3, conf: 2 }, appr: 0.4 }, r: 'Fondi per riqualificare i dipendenti.' },
      { t: 'Tassare chi sostituisce il lavoro con l’IA', fx: { grp: { merc: -5, conf: -4, sind: 4 }, rel: { M5S: 3 } }, r: 'Dibattito acceso: nessuno sa bene come applicarla.' },
      { t: 'È innovazione: lasciare fare', fx: { grp: { merc: 3 }, appr: -0.4 }, r: 'I sindacati dei bancari protestano.' },
    ] },
  { id: 'web_tax', for: 'premier', w: 1.2, cool: 60, img: 'globe', title: 'Washington contro la web tax',
    text: 'Gli Stati Uniti minacciano dazi sui prodotti italiani se non verrà ritirata la tassa sui servizi digitali che colpisce i colossi del web.',
    choices: () => [
      { t: 'Mantenerla: i giganti del web devono pagare', fx: { appr: 0.8, grp: { ue: 2, conf: -2 }, pil: -0.02 }, r: 'Tensione diplomatica con Washington.' },
      { t: 'Sospenderla in attesa di un accordo globale', fx: { oneOff: 0.4, grp: { merc: 2 }, appr: -0.5 }, r: 'Si evitano i dazi, si perdono entrate.' },
      { t: 'Portare la partita a Bruxelles', fx: { grp: { ue: 4 }, pc: -1 }, r: 'La Commissione apre un tavolo con gli USA.' },
    ] },
  { id: 'auto_cinese', for: 'premier', w: 1.1, cool: 70, img: 'car', title: 'Auto elettriche cinesi in Italia?',
    text: 'Un grande costruttore cinese di auto elettriche cerca uno stabilimento in Europa e guarda all’Italia: migliaia di posti di lavoro, ma timori per la concorrenza.',
    choices: () => [
      { t: 'Corteggiarlo: incentivi e un sito al Sud', fx: { pil: 0.04, oneOff: 0.4, grp: { sind: 3, ue: -3 }, appr: 0.6 }, r: 'Trattativa avviata con la Regione.' },
      { t: 'Sì, ma con fornitori italiani', fx: { pil: 0.02, grp: { conf: 3 } }, r: 'Accordo più lento ma più solido.' },
      { t: 'No: difendere l’auto europea', fx: { grp: { ue: 3, sind: -2 }, satP: { LEGA: 2 } }, r: 'Lo stabilimento andrà in Ungheria.' },
    ] },
  { id: 'scalata_bancaria', for: 'premier', w: 1, cool: 70, img: 'bank', title: 'Scalata bancaria e golden power',
    text: 'Un grande gruppo bancario lancia un’offerta su una banca concorrente. Il governo può porre condizioni con il golden power: i mercati aspettano.',
    choices: () => [
      { t: 'Condizioni severe: credito alle imprese e sportelli', fx: { grp: { merc: -4, ue: -3, sind: 2 }, appr: 0.5 }, r: 'Bruxelles chiede chiarimenti sui poteri speciali.' },
      { t: 'Via libera senza condizioni', fx: { grp: { merc: 4, ue: 2 } }, r: 'Nasce un campione europeo del credito.' },
      { t: 'Favorire un terzo polo bancario', fx: { pc: -2, grp: { merc: -2, conf: 2 }, satP: { LEGA: 3 } }, r: 'Manovre di palazzo sulle pagine finanziarie.' },
    ] },
  { id: 'logistica_natale', for: 'premier', w: 1.5, cool: 50, cond: () => monthOf(G.week) === 11, img: 'truck', title: 'Sciopero nei magazzini a Natale',
    text: 'Corrieri e magazzinieri della logistica scioperano nella settimana di Natale per turni e salari. Pacchi in ritardo in tutta Italia.',
    choices: () => [
      { t: 'Convocare aziende e sindacati', fx: { pc: -1, grp: { sind: 4 }, appr: 0.4 }, r: 'Accordo su turni e premi.' },
      { t: 'Una legge sul lavoro delle piattaforme', fx: { grp: { sind: 5, conf: -3 }, rel: { PD: 2, M5S: 2 } }, r: 'Le aziende parlano di costi insostenibili.' },
      { t: 'Garantire le consegne con i servizi minimi', fx: { grp: { sind: -6 }, appr: 0.2 }, r: 'Clima teso nei magazzini.' },
    ] },
  { id: 'poste_quota', for: 'premier', w: 1, cool: 80, img: 'coin', title: 'Vendere un’altra quota di Poste?',
    text: 'Il Tesoro valuta di vendere un’altra quota di Poste Italiane per ridurre il debito. I sindacati temono per gli uffici nei piccoli comuni.',
    choices: () => [
      { t: 'Vendere: meno debito', fx: { debt: -0.15, grp: { merc: 3, sind: -4 }, appr: -0.4 }, r: 'Incassati circa 3 miliardi.' },
      { t: 'Vendere, ma con gli uffici garantiti per legge', fx: { debt: -0.1, grp: { merc: 2 }, pc: -1 }, r: 'Compromesso apprezzato dai sindaci.' },
      { t: 'Non vendere: Poste resta pubblica', fx: { grp: { sind: 3, merc: -2 }, appr: 0.3 }, r: 'I mercati notano un’altra privatizzazione rinviata.' },
    ] },
  { id: 'canone_rai', for: 'premier', w: 1.1, cool: 70, img: 'tv', title: 'Il canone RAI in bolletta',
    text: 'Alcuni partiti chiedono di abolire il canone RAI pagato in bolletta. Senza quelle entrate servirebbero tagli o fondi pubblici.',
    choices: () => [
      { t: 'Abolirlo e finanziare la RAI con il bilancio', fx: { oneOff: 1.7, appr: 1.5, grp: { media: -4 }, satP: { LEGA: 4 } }, r: 'Famiglie contente, conti un po’ meno.' },
      { t: 'Ridurlo di qualche euro', fx: { oneOff: 0.4, appr: 0.5 }, r: 'Misura simbolica.' },
      { t: 'Lasciarlo: serve un servizio pubblico forte', fx: { grp: { media: 3 }, appr: -0.4 }, r: 'Polemiche brevi.' },
    ] },
  { id: 'ponte_corte', for: 'premier', w: 1.1, cool: 80, img: 'bridge', title: 'Ponte sullo Stretto: altolà della Corte dei conti',
    text: 'La Corte dei conti non registra la delibera sul Ponte sullo Stretto e chiede chiarimenti sui costi. I cantieri slittano ancora.',
    choices: () => [
      { t: 'Andare avanti comunque: «Il Ponte si farà»', fx: { grp: { mag: -6, quir: -3 }, satP: { LEGA: 5 }, appr: -0.3 }, r: 'Scontro istituzionale sulle prime pagine.' },
      { t: 'Rispondere ai rilievi e riprovare', fx: { pc: -1, grp: { quir: 2 } }, r: 'Qualche mese di ritardo, iter corretto.' },
      { t: 'Spostare i fondi su strade e treni del Sud', fx: { appr: 0.6, satP: { LEGA: -7 }, rel: { PD: 2, M5S: 2 } }, r: 'Salvini non la prende bene.' },
    ] },
  { id: 'treni_tilt', for: 'premier', w: 1.5, cool: 30, img: 'clock', title: 'Guasto alla rete: treni in tilt',
    text: 'Un guasto sulla linea ad alta velocità blocca per ore i treni tra Roma, Firenze e Milano. Migliaia di passeggeri a terra, ritardi fino a cinque ore.',
    choices: () => [
      { t: 'Indennizzi automatici per i passeggeri', fx: { appr: 0.8, grp: { conf: -1 } }, r: 'Rimborsi rapidi: i pendolari apprezzano.' },
      { t: 'Piano straordinario di manutenzione', fx: { oneOff: 0.5, pil: 0.01, appr: 0.4 }, r: 'Cantieri notturni per due anni.' },
      { t: '«Sono i cantieri del PNRR, poi andrà meglio»', fx: { appr: -0.8 }, r: 'Ironie sui social per giorni.' },
    ] },
  { id: 'tende_studenti', for: 'premier', w: 1.2, cool: 50, cond: () => [8, 9, 10].includes(monthOf(G.week)), img: 'tent', title: 'Studenti in tenda davanti alle università',
    text: 'Studenti accampati davanti ai rettorati di Milano, Roma e Bologna: una stanza costa anche 700 euro al mese.',
    choices: () => [
      { t: 'Piano nazionale di studentati pubblici', fx: { oneOff: 0.6, appr: 1, rel: { PD: 2, AVS: 2 } }, r: 'Nuovi posti letto in tre anni.' },
      { t: 'Bonus affitto per i fuori sede', fx: { oneOff: 0.3, appr: 0.8 }, r: 'Aiuto immediato, ma i prezzi non scendono.' },
      { t: 'Limiti agli affitti brevi turistici', fx: { grp: { conf: -3 }, appr: 0.5, satP: { FI: -3 } }, r: 'Albergatori favorevoli, piattaforme contrarie.' },
    ] },
  { id: 'superbonus_conto', for: 'premier', w: 1.1, cool: 70, img: 'euro', title: 'Superbonus: il conto si allunga',
    text: 'L’ISTAT rivede i conti: i crediti del Superbonus pesano più del previsto sul debito. Bruxelles chiede spiegazioni.',
    choices: () => [
      { t: 'Stretta sui crediti residui', fx: { grp: { ue: 4, merc: 3, conf: -4 }, appr: -0.5 }, r: 'Le imprese edili protestano.' },
      { t: 'Spalmare il costo su più anni', fx: { grp: { merc: -2 }, debt: 0.1 }, r: 'Il problema si sposta in avanti.' },
      { t: 'Accusare chi l’ha inventato', fx: { fama: 1, rel: { M5S: -6 }, appr: 0.2 }, r: 'Conte replica: «Ha fatto crescere il PIL».' },
    ] },
  { id: 'finals_torino', for: 'all', w: 1.6, cool: 40, cond: () => monthOf(G.week) === 10, img: 'trophy', title: 'Trionfo azzurro a Torino',
    text: 'Un tennista italiano vince le ATP Finals davanti al pubblico di Torino. Il Paese festeggia.',
    choices: () => [
      { t: 'Complimenti via social', fx: { fama: 1 }, r: 'Un post da migliaia di «mi piace».' },
      { t: 'Andare in tribuna alla finale', fx: { fama: 3, stress: 2, funds: -5 }, r: 'Le telecamere ti inquadrano sul punto decisivo.' },
      { t: 'Proporre più fondi per lo sport di base', fx: { fama: 1, my: 0.3 }, r: 'Le società sportive applaudono.' },
    ] },

  // ===================== L'OPPOSIZIONE ATTACCA (sei premier) =====================
  { id: 'opp_piazza', for: 'premier', w: 1.8, cool: 26, cond: () => G.week - G.gov.start > 8, img: 'flag', title: 'Le opposizioni unite in piazza',
    text: () => `${oppLeader().leader} porta in piazza tutte le opposizioni contro il governo: «Salari fermi e sanità al collasso». Decine di migliaia di persone a Roma.`,
    choices: () => [
      { t: 'Rispondere con i numeri: occupazione record', fx: { appr: 0.5, fama: 1 }, r: 'Botta e risposta nei telegiornali.' },
      { t: 'Invitare le opposizioni a Palazzo Chigi', fx: { pc: -1, appr: 0.8, grp: { quir: 3 }, rel: { PD: 3, M5S: 3 } }, r: 'Gesto apprezzato dal Quirinale.' },
      { t: 'Attaccare: «Piazze politiche, noi governiamo»', fx: { appr: -0.3, my: 0.4, rel: { PD: -4, M5S: -4, AVS: -4 } }, r: 'La tua base apprezza, il clima si inasprisce.' },
    ] },
  { id: 'opp_tv', for: 'premier', w: 2, cool: 14, prep: () => { const ps = PIDS().filter(p => !inGov(p) && p !== myPid()).sort((a, b) => P(b).poll - P(a).poll); return ps.length ? { p: ps[Math.min(ps.length - 1, irnd(0, 2))] } : null; }, img: 'tv', title: '«Il governo ha fallito»',
    text: c => `In prima serata ${P(c.p).leader} (${P(c.p).short}) attacca: «Il carrello della spesa costa il 20% in più e il governo dorme». La clip è virale.`,
    choices: c => [
      { t: 'Replicare in diretta con un’intervista', fx: { pc: -1, fama: 2, appr: 0.6, stress: 2 }, r: 'Il confronto a distanza fa ascolti record.', run: () => addRel(c.p, myPid(), -3) },
      { t: 'Lasciare rispondere un ministro', fx: { appr: 0.2 }, r: 'Risposta tecnica, poco efficace.' },
      { t: 'Ignorare: «Non rispondo alle polemiche»', fx: { appr: -0.6 }, r: 'Il silenzio sembra imbarazzo.' },
    ] },
  { id: 'opp_sfiducia_min', for: 'premier', w: 1.3, cool: 30, prep: pickMinisterCtx, img: 'gavel', title: 'Mozione contro un tuo ministro',
    text: c => `Le opposizioni presentano una mozione di sfiducia contro ${c.n} (${MIN_BY_ID[c.k].n}): «Ha gestito male il dossier più caldo del suo ministero».`,
    choices: c => [
      { t: 'Difenderlo in aula: «Ha tutta la mia fiducia»', fx: { pc: -1, appr: -0.3, sat: 2 }, r: 'Mozione respinta: la maggioranza tiene.' },
      { t: 'Chiedergli un passo indietro', fx: { appr: 0.6, sat: -4 }, r: 'Il ministro si dimette: l’interim passa a te, poi serve un rimpasto.', run: () => { delete G.gov.ministers[c.k]; G.gov.interim = c.k; addNews(`${c.n} si dimette. L’interim passa al Presidente del Consiglio.`, 'gov'); } },
      { t: 'Contrattaccare: «Strumentalizzazioni»', fx: { appr: -0.2, my: 0.2, rel: { PD: -3, M5S: -3 } }, r: 'Muro contro muro.' },
    ] },
  { id: 'opp_inchiesta', for: 'premier', w: 1.2, cool: 40, img: 'news', title: 'Un’inchiesta sui conti del partito',
    text: 'Un quotidiano pubblica un’inchiesta sulle consulenze pagate dalla fondazione vicina al tuo partito. Nessun reato contestato, ma l’opposizione chiede chiarezza in aula.',
    choices: () => [
      { t: 'Pubblicare tutti i bilanci online', fx: { integ: 1, appr: 0.4, cred: 3 }, r: 'Trasparenza totale: la polemica si sgonfia.' },
      { t: 'Querelare il giornale', fx: { grp: { media: -8 }, appr: -0.6 }, r: 'Federazione della stampa e opposizioni protestano.' },
      { t: 'Minimizzare: «Fango a orologeria»', fx: { appr: -0.4, my: 0.2 }, r: 'Il caso resta aperto.' },
    ] },
  { id: 'opp_ostruzionismo', for: 'premier', w: 1.5, cool: 16, prep: () => { const b = govBillInAula(); return b ? { b } : null; }, img: 'hand', title: 'Ostruzionismo sulla tua legge',
    text: c => `Le opposizioni depositano 3.000 emendamenti su «${billName(c.b)}»: il testo rischia di restare impantanato per settimane.`,
    choices: c => [
      { t: 'Porre la fiducia e tagliare il dibattito', fx: { pc: -2, grp: { quir: -2 } }, r: 'Il testo va avanti, l’opposizione grida al bavaglio.', run: () => { if (c.b.type !== 'cost') c.b.fiducia = true; } },
      { t: 'Trattare: accogliere qualche emendamento', fx: { pc: -1, rel: { PD: 2, M5S: 2, AZ: 2 } }, r: 'Clima più disteso in aula.' },
      { t: 'Lasciare correre: tempi lunghi', fx: { appr: -0.3 }, r: 'Il testo slitta di due settimane.', run: () => { c.b.obstr = (c.b.obstr || 0) + 2; } },
    ] },
  { id: 'opp_question_time', for: 'premier', w: 1.6, cool: 18, img: 'mic', title: 'Question time infuocato',
    text: () => `Al question time ${oppLeader().leader} ti incalza su liste d’attesa e pronto soccorso: «Gli italiani aspettano mesi per una visita».`,
    choices: () => [
      { t: 'Annunciare un piano straordinario per le liste d’attesa', fx: { oneOff: 0.5, appr: 1 }, r: 'Promessa impegnativa: ora va mantenuta.' },
      { t: 'Dati alla mano: «Mai così tanti fondi alla sanità»', fx: { appr: 0.2, fama: 1 }, r: 'Botta e risposta senza vincitori.' },
      { t: 'Scaricare la colpa sulle Regioni', fx: { appr: -0.3, rel: { PD: -2 } }, r: 'I governatori protestano.' },
    ] },

  // ===================== IL GOVERNO TI ATTACCA (sei all'opposizione) =====================
  { id: 'gov_attacca', for: 'nogov', w: 1.6, cool: 16, cond: () => isLeader() && !!G.gov && !inGov(myPid()) && myParty().poll > 3, img: 'sword', title: 'Il premier ti attacca',
    text: () => `${premierName()} in conferenza stampa: «${myParty().short} sa solo dire no, non ha mai governato niente». La frase rimbalza ovunque.`,
    choices: () => [
      { t: 'Replica dura: «Pensi alle bollette degli italiani»', fx: { fama: 2, my: 0.5 }, r: 'Il botta e risposta aumenta la tua visibilità.', run: () => addRel(G.gov.premierParty, myPid(), -3) },
      { t: 'Rispondere con una proposta concreta', fx: { cred: 3, my: 0.4 }, r: 'Gli osservatori apprezzano lo stile.' },
      { t: 'Non raccogliere la provocazione', fx: { cred: 1 }, r: 'Passa quasi inosservata.' },
    ] },
  { id: 'gov_esclusione', for: 'nogov', w: 1.3, cool: 40, cond: () => isLeader() && !!G.gov && !inGov(myPid()) && [9, 10, 11].includes(monthOf(G.week)), img: 'door', title: 'Esclusi dal tavolo sulla manovra',
    text: 'Il governo convoca a Palazzo Chigi solo i partiti di maggioranza sulla legge di bilancio. Le opposizioni non sono invitate.',
    choices: () => [
      { t: 'Presentare una contromanovra', fx: { cred: 4, fama: 2, my: 0.4 }, r: 'Le tue proposte finiscono sui giornali economici.' },
      { t: 'Fronte comune con le altre opposizioni', fx: { my: 0.3, rel: { PD: 3, M5S: 3, AVS: 3, AZ: 2 } }, r: 'Conferenza stampa congiunta.' },
      { t: 'Rivolgersi al Quirinale', fx: { grp: { quir: 2 }, fama: 1 }, r: 'Il Colle invita al dialogo.' },
    ] },
  { id: 'gov_querela', for: 'nogov', w: 1.1, cool: 40, cond: () => isLeader() && !!G.gov && !inGov(myPid()) && G.player.fama > 25, prep: pickMinisterCtx, img: 'gavel', title: 'Un ministro ti querela',
    text: c => `${c.n}, ministro (${MIN_BY_ID[c.k].n}), annuncia una querela per diffamazione dopo le tue critiche in TV.`,
    choices: () => [
      { t: 'Non ritiro nulla: «Ho detto la verità»', fx: { fama: 3, my: 0.4, stress: 3 }, r: 'Solidarietà dalle altre opposizioni.' },
      { t: 'Chiarire e abbassare i toni', fx: { cred: 2 }, r: 'La querela viene ritirata.' },
      { t: 'Rilanciare: «Venga in aula a rispondere»', fx: { fama: 2, my: 0.3 }, r: 'Il caso arriva in Parlamento.', run: () => addRel(G.gov.premierParty, myPid(), -3) },
    ] },

  // ===================== PER TUTTI =====================
  { id: 'deepfake', for: 'all', w: 1.2, cool: 50, cond: () => G.player.fama > 30, img: 'camera', title: 'Un tuo video falso diventa virale',
    text: 'Un video manipolato con l’intelligenza artificiale ti fa dire frasi mai pronunciate. Milioni di visualizzazioni in poche ore.',
    choices: () => [
      { t: 'Denuncia alla Polizia postale e smentita', fx: { fama: 1, stress: 3 }, r: 'Le piattaforme rimuovono il video.' },
      { t: 'Proporre una legge contro i deepfake', fx: { fama: 2, my: 0.4, pc: -1 }, r: 'Proposta trasversale: se ne parla molto.' },
      { t: 'Riderci sopra con un video ironico', fx: { fama: 3, my: 0.3 }, r: 'L’autoironia piace al web.' },
    ] },
  { id: 'tv_sostituto', for: 'member', w: 1.4, cool: 26, img: 'tv', title: () => `In TV al posto di ${P(myPid()).leader}`,
    text: () => `${P(myPid()).leader} non può andare in un talk show di prima serata: il partito chiede a te di sostituirlo.`,
    choices: () => [
      { t: 'Accettare e seguire la linea', fx: { fama: 3, rap: 3 }, r: 'Prova solida: il leader apprezza.' },
      { t: 'Accettare e dire la tua', fx: { fama: 4, seguito: 3, rap: -4 }, r: 'Ti notano tutti, il leader un po’ meno contento.' },
      { t: 'Declinare', fx: { rap: -1 }, r: 'Va qualcun altro.' },
    ] },
];
EVENTS2.forEach(e => { EVENTS.push(e); EVENT_BY_ID[e.id] = e; });
