// ============================================================
//  CATALOGO LEGGI — stato attuale (ottobre 2026) e riforme pronte
//  Ogni opzione: [titolo, descrizione, posizione sull'asse (-10..10), costo mld€/anno, effetti]
//  Effetti: pop (consenso generale), pil (punti di crescita), occ (disoccupazione),
//  infl, sind/conf/chiesa/ue/merc/mag/quir (gruppi), corte (rischio bocciatura Consulta 0-1)
//  Il costo è annuo rispetto a oggi: positivo = più deficit, negativo = risparmio/entrate.
// ============================================================

const LAW_CATS = {
  Pensioni: 'hourglass', Lavoro: 'briefcase', Fisco: 'coin', Welfare: 'hand', Famiglia: 'baby', Sanità: 'hospital', Diritti: 'scales',
  Immigrazione: 'wave', Giustizia: 'gavel', Sicurezza: 'shield', Istituzioni: 'building', Scuola: 'book', Università: 'cap',
  Ambiente: 'leaf', Energia: 'bolt', Infrastrutture: 'bridge', Economia: 'factory', Difesa: 'helmet', Europa: 'eu', Territorio: 'map',
  Agricoltura: 'wheat', Cultura: 'mask',
};

const LAWS = [];
function L(id, cat, nome, rif, ax, cur, attuale, opts, extra) {
  LAWS.push(Object.assign({
    id, cat, nome, rif, ax, cur, attuale, sal: 2,
    opts: opts.map(o => ({ t: o[0], d: o[1], pos: o[2], costo: o[3] || 0, e: o[4] || {} })),
  }, extra || {}));
}

// ---------------- PENSIONI ----------------
L('pens_vecchiaia', 'Pensioni', 'Età della pensione di vecchiaia', 'L. 214/2011 (Fornero)', 'eco', 0,
  '67 anni con 20 di contributi; adeguamento alla speranza di vita reso graduale (+1 mese nel 2027, ulteriori aumenti dal 2028).', [
  ['Fornero con adeguamento graduale', 'Situazione attuale: 67 anni e piccoli aumenti legati alla speranza di vita.', 2, 0, {}],
  ['Blocco degli aumenti a 67 anni', 'Si congela l’età a 67 anni, niente adeguamenti automatici.', -2, 1.5, { pop: 2, sind: 8, ue: -5, merc: -3 }],
  ['Uscita flessibile da 64 anni', 'Pensione dai 64 anni con assegno ricalcolato col contributivo.', -1, 2.5, { pop: 3, sind: 6, ue: -6, merc: -4 }],
  ['Adeguamento pieno e immediato', 'Si applica subito tutto l’aumento previsto dalla speranza di vita.', 5, -0.8, { pop: -3, sind: -10, ue: 6, merc: 4 }],
  ['Pensione a 68 anni', 'Età di vecchiaia portata a 68 anni dal 2028.', 7, -4, { pop: -7, sind: -18, ue: 10, merc: 8, pil: 0.05 }],
], { sal: 3, pp: { LEGA: -4, M5S: -4, FDI: -1 } });

L('pens_anticipata', 'Pensioni', 'Pensione anticipata e "quote"', 'L. 214/2011, leggi di bilancio', 'eco', 0,
  '42 anni e 10 mesi di contributi (41 e 10 per le donne). Le "quote" sono state progressivamente superate; restano Ape sociale e lavoratori precoci.', [
  ['Regole attuali', '42a10m di contributi, Ape sociale per categorie fragili.', 2, 0, {}],
  ['Quota 41 per tutti', 'In pensione con 41 anni di contributi a qualsiasi età. Bandiera della Lega.', -4, 5, { pop: 4, sind: 10, ue: -10, merc: -6 }],
  ['Ritorno a Quota 100', '62 anni di età e 38 di contributi, come nel 2019-2021.', -5, 7, { pop: 3, sind: 8, ue: -12, merc: -8 }],
  ['Anticipo a 64 anni col contributivo', 'Uscita a 64 anni con 20 di contributi ma assegno tutto contributivo.', 1, 1.2, { pop: 1, sind: 2, ue: -2 }],
  ['Solo pensione di vecchiaia', 'Abolizione delle uscite anticipate (salvo lavori gravosi).', 8, -3, { pop: -7, sind: -20, ue: 8, merc: 6 }],
], { sal: 3, pp: { LEGA: -6, M5S: -5, FDI: -2, FN: -3 } });

L('pens_minime', 'Pensioni', 'Pensioni minime', 'L. 388/2000 e rivalutazioni annuali', 'eco', 0,
  'Integrazione al minimo intorno ai 620€ al mese, con piccoli aumenti straordinari decisi in manovra.', [
  ['Livello attuale', 'Minime intorno ai 620€ con rivalutazione annuale.', 1, 0, {}],
  ['Minime a 700€', 'Aumento di circa 80€ al mese per 2 milioni di pensionati.', -3, 2.5, { pop: 3, sind: 5, ue: -3 }],
  ['Minime a 1.000€', 'La storica promessa di Forza Italia: mille euro al mese per tutti.', -5, 9, { pop: 5, sind: 6, ue: -10, merc: -6 }],
  ['Contributo di solidarietà dalle pensioni d’oro', 'Taglio alla rivalutazione delle pensioni sopra 10 volte il minimo per finanziare le minime.', -4, -0.5, { pop: 2, sind: 2, corte: 0.3 }],
], { sal: 2, pp: { FI: -6, NM: -4 } });

L('pens_giovani', 'Pensioni', 'Pensione di garanzia per i giovani', 'Proposta CGIL/PD/M5S', 'eco', 0,
  'Non esiste: chi ha iniziato a lavorare dopo il 1996 avrà una pensione interamente contributiva, spesso bassa per chi ha carriere discontinue.', [
  ['Nessuna garanzia', 'Solo sistema contributivo puro.', 4, 0, {}],
  ['Pensione di garanzia', 'Assegno minimo garantito per chi ha carriere precarie, legato agli anni di lavoro.', -4, 1, { pop: 2, sind: 8 }],
  ['Contributi figurativi per formazione e maternità', 'Gli anni di studio, formazione e cura dei figli contano ai fini della pensione.', -2, 0.6, { pop: 2, sind: 4, chiesa: 3 }],
], { sal: 1 });

// ---------------- LAVORO ----------------
L('lav_salmin', 'Lavoro', 'Salario minimo', 'L. delega 2025 su retribuzione e contrattazione', 'eco', 0,
  'Non esiste un salario minimo legale. Il governo ha scelto una delega per estendere i minimi dei contratti collettivi più rappresentativi.', [
  ['Minimi dei contratti collettivi', 'Si estendono i trattamenti dei CCNL principali, niente soglia per legge.', 3, 0, {}],
  ['Salario minimo a 9€ lordi l’ora', 'Proposta unitaria delle opposizioni: nessun contratto sotto 9€.', -5, 0.3, { pop: 4, sind: 8, conf: -10, occ: 0.05 }],
  ['Salario minimo a 10€ l’ora', 'Soglia più alta, con fondo per le piccole imprese.', -7, 1, { pop: 3, sind: 10, conf: -18, occ: 0.15 }],
  ['Nessun intervento', 'Si lascia tutto alla contrattazione tra le parti.', 6, 0, { pop: -1, conf: 4, sind: -6 }],
], { sal: 3 });

L('lav_licenz', 'Lavoro', 'Licenziamenti (Jobs Act / art. 18)', 'D.Lgs. 23/2015', 'eco', 0,
  'Contratto a tutele crescenti con indennizzo, ampliato dalle sentenze della Consulta. Il referendum del giugno 2025 per abrogarlo non ha raggiunto il quorum.', [
  ['Tutele crescenti (attuale)', 'Indennizzo economico, reintegro solo in casi limitati.', 3, 0, {}],
  ['Ripristino dell’art. 18', 'Reintegro nel posto di lavoro in caso di licenziamento illegittimo.', -7, 0, { pop: 1, sind: 15, conf: -18, pil: -0.05, merc: -3 }],
  ['Indennizzi più alti', 'Fino a 36 mensilità anche nelle piccole imprese.', -3, 0, { pop: 1, sind: 6, conf: -6 }],
  ['Più flessibilità in uscita', 'Indennizzo fisso e prevedibile, meno contenzioso.', 7, 0, { pop: -2, sind: -15, conf: 12, pil: 0.03 }],
], { sal: 2 });

L('lav_termine', 'Lavoro', 'Contratti a termine', 'DL 48/2023 (Decreto Lavoro)', 'eco', 0,
  'Fino a 12 mesi senza causale; fino a 24 mesi con le causali previste dai contratti collettivi.', [
  ['Regole del Decreto Lavoro', 'Situazione attuale.', 4, 0, {}],
  ['Ritorno al Decreto Dignità', 'Causale obbligatoria dopo 12 mesi, massimo 24 mesi e più costi per i rinnovi.', -4, -0.2, { pop: 1, sind: 8, conf: -8 }],
  ['Liberalizzazione fino a 36 mesi', 'Contratti a termine senza causale fino a tre anni.', 7, 0, { sind: -10, conf: 8, pop: -1 }],
  ['Contributo extra sui precari', 'Chi abusa dei contratti brevi paga contributi più alti.', -2, -0.4, { sind: 4, conf: -4 }],
], { sal: 1 });

L('lav_rdc', 'Welfare', 'Sostegno alla povertà', 'DL 48/2023: Assegno di Inclusione', 'eco', 0,
  'Dal 2024 il Reddito di cittadinanza è stato sostituito dall’Assegno di Inclusione (famiglie con minori, anziani, disabili) e dal Supporto per la formazione e il lavoro.', [
  ['Assegno di Inclusione (attuale)', 'Sostegno solo ai nuclei considerati "non occupabili".', 3, 0, {}],
  ['Ritorno al Reddito di cittadinanza', 'Sostegno universale contro la povertà con obblighi di ricerca del lavoro. Bandiera del M5S.', -6, 4, { pop: 2, sind: 4, ue: -3, merc: -2 }],
  ['Reddito minimo europeo', 'Reddito minimo universale secondo la raccomandazione UE, con forte rete di servizi.', -8, 8, { pop: 1, sind: 6, ue: -2, merc: -4 }],
  ['Taglio e più politiche attive', 'Riduzione dell’ADI, risorse spostate su centri per l’impiego e formazione.', 7, -1.5, { pop: -2, sind: -6, chiesa: -4 }],
], { sal: 3, pp: { M5S: -9 } });

L('lav_cuneo', 'Fisco', 'Taglio del cuneo fiscale', 'L. 207/2024 (manovra 2025)', 'eco', 0,
  'Taglio strutturale dal 2025: bonus per i redditi fino a 20.000€ e detrazione aggiuntiva fino a 40.000€.', [
  ['Taglio attuale', 'Bonus e detrazione per i lavoratori dipendenti fino a 40.000€.', 0, 0, {}],
  ['Esteso fino a 50.000€', 'Più soldi in busta paga anche al ceto medio.', 1, 3, { pop: 3, sind: 5, conf: 4, pil: 0.04 }],
  ['Taglio dei contributi a carico delle imprese', 'Riduzione del costo del lavoro per chi assume.', 4, 5, { conf: 12, pil: 0.08, occ: -0.1 }],
  ['Fine del taglio', 'Si risparmiano 11 miliardi ma le buste paga calano.', 3, -11, { pop: -7, sind: -15, conf: -6, pil: -0.15 }],
], { sal: 3, fis: 1 });

L('lav_settimana', 'Lavoro', 'Settimana corta', 'Nessuna norma nazionale', 'eco', 0,
  'Nessuna legge: esistono sperimentazioni aziendali (Intesa Sanpaolo, Lamborghini, Luxottica).', [
  ['Nessuna norma', 'Si lascia alla contrattazione aziendale.', 3, 0, {}],
  ['Incentivi alla settimana di 4 giorni', 'Sgravi contributivi per chi riduce l’orario a parità di salario.', -4, 0.5, { pop: 2, sind: 6, conf: -2 }],
  ['Orario legale a 32 ore', 'Riduzione per legge dell’orario settimanale.', -8, 0, { pop: 2, sind: 10, conf: -18, pil: -0.1 }],
], { sal: 1 });

L('lav_sicurezza', 'Lavoro', 'Sicurezza sul lavoro', 'D.Lgs. 81/2008, patente a crediti (2024)', 'eco', 0,
  'Testo unico del 2008; dal 2024 patente a crediti nei cantieri. Circa 1.000 morti sul lavoro l’anno.', [
  ['Regole attuali', 'Testo unico e patente a crediti.', 3, 0, {}],
  ['Reato di omicidio sul lavoro e 3.000 ispettori', 'Nuovo reato specifico e raddoppio dei controlli.', -4, 0.4, { pop: 3, sind: 10, conf: -4 }],
  ['Semplificazione per le PMI', 'Meno adempimenti burocratici per le piccole imprese.', 5, 0, { conf: 6, sind: -8, pop: -1 }],
], { sal: 1 });

// ---------------- FISCO ----------------
L('fis_irpef', 'Fisco', 'IRPEF: aliquote', 'D.Lgs. 216/2023, L. bilancio 2026', 'eco', 0,
  'Tre aliquote: 23% fino a 28.000€, 33% da 28.000 a 50.000€ (ridotta dal 35% nel 2026), 43% oltre.', [
  ['Tre aliquote 23-33-43', 'Situazione attuale.', 2, 0, {}],
  ['Flat tax al 15% per tutti', 'Aliquota unica al 15% con deduzioni per le famiglie. La storica proposta della Lega.', 9, 50, { pop: 3, conf: 10, ue: -25, merc: -15, pil: 0.2, sind: -10 }],
  ['Flat tax incrementale', 'Aliquota del 15% solo sull’aumento di reddito rispetto agli anni precedenti.', 6, 3, { pop: 1, conf: 4, ue: -3 }],
  ['Taglio al ceto medio: 30% fino a 60.000€', 'Seconda aliquota al 30% ed estesa fino a 60.000€.', 3, 6, { pop: 3, conf: 3, ue: -5, merc: -2, pil: 0.05 }],
  ['Più progressiva: 5 aliquote e 47% sopra 100.000€', 'Sgravi sui redditi bassi pagati dai redditi più alti.', -6, -2, { pop: 0, sind: 8, conf: -8, merc: -2 }],
], { sal: 3, fis: 1, pp: { LEGA: 9, FI: 5 } });

L('fis_forf', 'Fisco', 'Flat tax per le partite IVA', 'L. 190/2014 e L. 197/2022', 'eco', 0,
  'Regime forfettario: imposta del 15% (5% per i primi 5 anni) per ricavi fino a 85.000€.', [
  ['Forfettario fino a 85.000€', 'Situazione attuale.', 5, 0, {}],
  ['Esteso a 100.000€', 'Più autonomi nella flat tax.', 7, 1, { pop: 1, ue: -3 }],
  ['Ridotto a 50.000€', 'Meno disparità con i lavoratori dipendenti.', -3, -1.2, { pop: -1, sind: 4 }],
  ['Abolito: tutti all’IRPEF', 'Fine del regime agevolato.', -6, -4, { pop: -3, sind: 4, conf: -4 }],
], { sal: 2, fis: 1, pp: { LEGA: 8 } });

L('fis_patrimoniale', 'Fisco', 'Imposta sui grandi patrimoni', 'Nessuna imposta generale', 'eco', 0,
  'Non esiste una patrimoniale generale: ci sono l’IMU sulle seconde case e le imposte di bollo su conti e titoli.', [
  ['Nessuna patrimoniale', 'Situazione attuale.', 4, 0, {}],
  ['Tassa sui patrimoni oltre 5 milioni', 'Aliquota dell’1,5-2% sui super-ricchi (modello Zucman). Proposta di AVS.', -8, -6, { pop: 2, sind: 8, conf: -12, merc: -6 }],
  ['Successioni più tassate oltre 1 milione', 'Allineamento alla media europea per le grandi eredità.', -5, -3, { pop: -2, conf: -4 }],
  ['Abolizione dell’IMU sulle seconde case', 'Taglio delle tasse sul mattone.', 8, 10, { pop: 2, conf: 2, ue: -8, merc: -4 }],
], { sal: 2, fis: 1 });

L('fis_contanti', 'Fisco', 'Tetto all’uso del contante', 'L. 197/2022', 'eco', 0,
  'Pagamenti in contanti consentiti fino a 5.000€ (dal 2023, prima 1.000€).', [
  ['Tetto a 5.000€', 'Situazione attuale.', 5, 0, {}],
  ['Tetto a 1.000€', 'Stretta contro l’evasione e il riciclaggio.', -5, -0.8, { pop: -1, mag: 6, ue: 3 }],
  ['Tetto a 10.000€', 'Allineamento al limite antiriciclaggio europeo.', 8, 0.3, { pop: 1, ue: -2, mag: -3 }],
], { sal: 1 });

L('fis_condoni', 'Fisco', 'Rottamazioni e condoni', 'Rottamazione-quinquies (L. bilancio 2026)', 'eco', 0,
  'È in corso la rottamazione-quinquies delle cartelle con pagamento rateale fino a 9 anni.', [
  ['Rottamazione in corso', 'Situazione attuale.', 5, 0, {}],
  ['Stop a condoni e rottamazioni', 'Nessuna nuova sanatoria, più riscossione.', -5, -0.5, { pop: -1, ue: 4, mag: 3 }],
  ['Saldo e stralcio generalizzato', 'Cancellazione delle cartelle sotto i 5.000€ e maxi-sconto sulle altre.', 9, -1.5, { pop: 2, ue: -6, mag: -6, merc: -2 }],
  ['Pace fiscale permanente', 'Rottamazione sempre aperta. Bandiera della Lega.', 8, 1, { pop: 1, ue: -8, merc: -3 }],
], { sal: 2, fis: 1, pp: { LEGA: 9 } });

L('fis_banche', 'Fisco', 'Tassa sugli extraprofitti', 'Contributo banche e assicurazioni (manovra 2026)', 'eco', 0,
  'Nella manovra 2026 banche e assicurazioni hanno versato un contributo concordato con il governo.', [
  ['Contributo concordato', 'Situazione attuale.', 1, 0, {}],
  ['Tassa sugli extraprofitti al 40%', 'Prelievo sugli utili da tassi di interesse.', -6, -4, { pop: 3, merc: -10, conf: -4 }],
  ['Nessun contributo', 'Le banche tornano a regime ordinario.', 6, 4, { pop: -2, merc: 4 }],
], { sal: 2, fis: 1 });

L('fis_rendite', 'Fisco', 'Tassazione delle rendite finanziarie', 'DL 66/2014', 'eco', 0,
  'Aliquota del 26% su interessi e dividendi, 12,5% sui titoli di Stato.', [
  ['26% (12,5% titoli di Stato)', 'Situazione attuale.', 3, 0, {}],
  ['Aumento al 30%', 'Titoli di Stato esclusi.', -5, -2.5, { merc: -6, conf: -3 }],
  ['Riduzione al 20%', 'Più attrattivi gli investimenti.', 6, 2.5, { merc: 4, pop: -1 }],
], { sal: 1, fis: 1 });

L('fis_edilizi', 'Fisco', 'Bonus edilizi', 'Superbonus (DL 34/2020) e successive modifiche', 'eco', 0,
  'Superbonus ridimensionato e chiuso; restano bonus ristrutturazioni al 50% sulla prima casa e 36% sulle altre.', [
  ['Bonus ridotti (attuale)', 'Situazione attuale.', 3, 0, {}],
  ['Ecobonus green al 65%', 'Incentivi per l’efficienza energetica in linea con la direttiva Case Green.', -4, 4, { pop: 2, conf: 6, ue: 2, pil: 0.06 }],
  ['Nuovo Superbonus 110%', 'Ritorno del bonus integrale. Bandiera del M5S.', -7, 20, { pop: 3, conf: 8, ue: -18, merc: -10, pil: 0.15 }],
  ['Abolizione di tutti i bonus', 'Stop agli incentivi edilizi.', 7, -5, { pop: -3, conf: -10, pil: -0.08 }],
], { sal: 2, fis: 1, pp: { M5S: -8 } });

L('fis_accise', 'Fisco', 'Accise sui carburanti', 'D.Lgs. 43/2025 (riordino)', 'amb', 0,
  'Riallineamento graduale delle accise di gasolio e benzina avviato nel 2025.', [
  ['Riallineamento graduale', 'Situazione attuale.', 2, 0, {}],
  ['Taglio di 20 centesimi', 'Benzina e gasolio meno cari subito.', 7, 8, { pop: 4, infl: -0.3, ue: -6, merc: -3 }],
  ['Accisa mobile', 'L’extragettito IVA da rincari viene restituito con tagli automatici.', 3, 1, { pop: 1 }],
  ['Aumento per il trasporto pubblico', 'Più accise sul diesel per finanziare treni e bus.', -7, -3, { pop: -4, infl: 0.2, ue: 3 }],
], { sal: 2, fis: 1, pp: { LEGA: 7, FN: 7 } });

L('fis_sugar', 'Fisco', 'Sugar tax e plastic tax', 'L. 160/2019, rinvii successivi', 'amb', 0,
  'Approvate nel 2019 ma rinviate ogni anno: non sono mai entrate in vigore.', [
  ['Rinviate', 'Situazione attuale.', 4, 0, {}],
  ['Attivarle', 'Tassa su bevande zuccherate e plastica monouso.', -5, -0.7, { pop: -2, conf: -6, ue: 2 }],
  ['Abolirle definitivamente', 'Si cancellano dalla legge.', 6, 0, { conf: 3 }],
], { sal: 1, fis: 1 });

L('fis_evasione', 'Fisco', 'Lotta all’evasione', 'Concordato preventivo, fatturazione elettronica', 'eco', 0,
  'Concordato preventivo biennale per gli autonomi e fatturazione elettronica. Evasione stimata intorno agli 80 miliardi l’anno.', [
  ['Strumenti attuali', 'Situazione attuale.', 4, 0, {}],
  ['Incrocio delle banche dati e più controlli', 'Uso massiccio dei dati bancari e assunzioni all’Agenzia delle Entrate.', -4, -3, { pop: -1, ue: 6, mag: 3, merc: 2 }],
  ['Cashback e detrazioni per pagamenti elettronici', 'Premi a chi paga con carta.', -2, 1.5, { pop: 1, ue: 2 }],
], { sal: 1, fis: 1 });

// ---------------- WELFARE / FAMIGLIA ----------------
L('fam_assegno', 'Famiglia', 'Assegno unico per i figli', 'D.Lgs. 230/2021', 'soc', 0,
  'Fino a circa 200€ al mese per figlio in base all’ISEE, più il bonus nuovi nati di 1.000€ (dal 2025).', [
  ['Assegno unico attuale', 'Situazione attuale.', 1, 0, {}],
  ['+30% dal terzo figlio', 'Più sostegno alle famiglie numerose.', 4, 3, { pop: 2, chiesa: 8 }],
  ['Quoziente familiare alla francese', 'Le tasse si calcolano sull’intero nucleo, divise per il numero di componenti.', 6, 6, { pop: 2, chiesa: 10, ue: -4 }],
  ['Meno per gli ISEE alti', 'Si concentra l’assegno sulle famiglie povere.', -2, -2, { pop: -1 }],
], { sal: 2, fis: 1, pp: { NM: 7, FDI: 6 } });

L('fam_congedi', 'Famiglia', 'Congedo di paternità', 'D.Lgs. 105/2022', 'soc', 0,
  '10 giorni obbligatori retribuiti al 100% per i padri.', [
  ['10 giorni', 'Situazione attuale.', 2, 0, {}],
  ['3 mesi paritari per entrambi i genitori', 'Congedo non trasferibile, come in Spagna.', -6, 1.5, { pop: 2, conf: -3 }],
  ['Congedo parentale all’80% per un anno', 'Più soldi durante il congedo facoltativo.', -2, 2, { pop: 2, chiesa: 4 }],
], { sal: 1, fis: 1 });

L('fam_nidi', 'Famiglia', 'Asili nido', 'Bonus nido, PNRR', 'eco', 0,
  'Bonus nido fino a 3.600€; i posti coprono circa il 30% dei bambini, molto meno al Sud.', [
  ['Bonus attuale', 'Situazione attuale.', 2, 0, {}],
  ['Nidi gratuiti per tutti', 'Retta azzerata negli asili pubblici e convenzionati.', -4, 3, { pop: 3, chiesa: 3, occ: -0.05 }],
  ['Piano da 200.000 nuovi posti', 'Costruzione e gestione di nuovi asili, priorità al Sud.', -3, 1.5, { pop: 2, pil: 0.02 }],
], { sal: 2, fis: 1 });

L('casa', 'Welfare', 'Politiche per la casa', 'Piano Casa Italia', 'eco', 0,
  'Piano Casa avviato dal governo con fondi limitati; affitti in forte crescita nelle grandi città.', [
  ['Piano attuale', 'Situazione attuale.', 2, 0, {}],
  ['100.000 alloggi popolari', 'Grande piano di edilizia residenziale pubblica.', -5, 2.5, { pop: 2, sind: 4, pil: 0.04 }],
  ['Cedolare secca e incentivi ai privati', 'Sgravi a chi affitta a canone concordato.', 5, 1, { pop: 1, conf: 3 }],
  ['Stretta sugli affitti brevi', 'Limiti agli affitti turistici nei centri storici.', -5, 0, { pop: 1, conf: -4 }],
], { sal: 2, fis: 1 });

// ---------------- SANITÀ ----------------
L('san_fondo', 'Sanità', 'Fondo sanitario nazionale', 'Leggi di bilancio', 'eco', 0,
  'Circa 143 miliardi nel 2026, intorno al 6,3% del PIL, sotto la media europea. Liste d’attesa lunghe e carenza di personale.', [
  ['Finanziamento attuale', 'Situazione attuale.', 2, 0, {}],
  ['Portarlo al 7% del PIL', 'Circa 15 miliardi in più: assunzioni e meno liste d’attesa.', -6, 15, { pop: 5, sind: 8, ue: -8, merc: -6 }],
  ['+5 miliardi per il personale', 'Assunzioni di medici e infermieri, stop al tetto di spesa.', -3, 5, { pop: 3, sind: 5, ue: -2 }],
  ['Più spazio ai privati e alle assicurazioni', 'Detrazioni per le polizze e convenzioni con le strutture private.', 7, -2, { pop: -3, conf: 6, sind: -6 }],
], { sal: 3, fis: 1 });

L('san_liste', 'Sanità', 'Liste d’attesa', 'DL 73/2024', 'eco', 0,
  'CUP unico regionale, visite la sera e nel weekend, ma tempi ancora lunghi.', [
  ['Regole attuali', 'Situazione attuale.', 2, 0, {}],
  ['Stop all’intramoenia se si sforano i tempi', 'Il medico non può fare visite private se il pubblico non rispetta le scadenze.', -4, 0.5, { pop: 2, sind: -2 }],
  ['Rimborso del privato oltre i tempi massimi', 'Se l’ASL sfora, paghi il privato e lo Stato rimborsa.', 4, 2, { pop: 3, conf: 3 }],
], { sal: 2, fis: 1 });

L('san_medicina', 'Università', 'Accesso a Medicina', 'Riforma 2025 (semestre filtro)', 'eco', 0,
  'Dal 2025 primo semestre aperto a tutti, poi graduatoria nazionale.', [
  ['Semestre filtro', 'Situazione attuale.', 0, 0, {}],
  ['Ritorno al test d’ingresso', 'Test nazionale prima dell’iscrizione.', 4, 0, { pop: -1 }],
  ['Accesso libero', 'Nessun limite, più docenti e posti di specializzazione.', -5, 0.8, { pop: 1 }],
], { sal: 1 });

L('san_vaccini', 'Sanità', 'Obbligo vaccinale per la scuola', 'L. 119/2017 (Lorenzin)', 'soc', 0,
  '10 vaccini obbligatori da 0 a 16 anni per iscriversi a nidi e materne.', [
  ['10 vaccini obbligatori', 'Situazione attuale.', -3, 0, {}],
  ['Solo raccomandazione', 'Fine dell’obbligo, campagne informative.', 7, 0, { pop: -1 }],
  ['Obbligo esteso e anagrafe vaccinale', 'Più controlli e vaccini raccomandati agli adulti.', -6, 0.1, { pop: -1 }],
], { sal: 1, pp: { FN: 9, LEGA: 4 } });

// ---------------- DIRITTI ----------------
L('fine_vita', 'Diritti', 'Fine vita', 'Sentenza Consulta 242/2019', 'soc', 0,
  'Nessuna legge nazionale: vale la sentenza Cappato (suicidio assistito non punibile a precise condizioni). Leggi regionali contestate; DDL della maggioranza in Senato.', [
  ['Nessuna legge', 'Si applica solo la sentenza della Corte.', 4, 0, {}],
  ['Suicidio assistito nel Servizio sanitario', 'Legge che recepisce la Consulta e garantisce il percorso nel SSN.', -6, 0.1, { pop: 2, chiesa: -12 }],
  ['Legge restrittiva', 'Requisiti stretti, niente SSN, priorità alle cure palliative.', 6, 0.2, { pop: -2, chiesa: 6 }],
  ['Eutanasia legale', 'Anche l’eutanasia attiva, come in Belgio e Olanda.', -9, 0.1, { pop: 0, chiesa: -18 }],
], { sal: 2 });

L('aborto', 'Diritti', 'Interruzione di gravidanza', 'L. 194/1978', 'soc', 0,
  'Legale entro 90 giorni; obiezione di coscienza molto diffusa (circa 60% dei ginecologi). Dal 2024 associazioni pro-vita possono operare nei consultori.', [
  ['Legge 194 attuale', 'Situazione attuale.', 3, 0, {}],
  ['Non obiettori in ogni ospedale, RU486 nei consultori', 'Garanzia di accesso effettivo in tutte le regioni.', -6, 0.1, { pop: 1, chiesa: -10 }],
  ['Restrizioni', 'Più spazio all’obiezione e colloqui obbligatori.', 8, 0, { pop: -4, chiesa: 8, corte: 0.3 }],
], { sal: 3 });

L('unioni', 'Diritti', 'Matrimonio e unioni civili', 'L. 76/2016 (Cirinnà)', 'soc', 0,
  'Unioni civili per le coppie dello stesso sesso dal 2016; il matrimonio resta solo tra uomo e donna.', [
  ['Unioni civili', 'Situazione attuale.', -1, 0, {}],
  ['Matrimonio egualitario', 'Matrimonio per tutte le coppie, come in Spagna e Francia.', -8, 0, { pop: 0, chiesa: -12 }],
  ['Abrogazione delle unioni civili', 'Si torna a prima del 2016.', 9, 0, { pop: -6, chiesa: 2, corte: 0.6, ue: -6 }],
], { sal: 2 });

L('figli_coppie', 'Diritti', 'Figli delle coppie omogenitoriali e GPA', 'L. 169/2024 (GPA reato universale)', 'soc', 0,
  'La maternità surrogata è reato anche se fatta all’estero (dal 2024). Riconoscimento dei figli di due madri solo tramite tribunali.', [
  ['Situazione attuale', 'GPA reato universale, adozioni solo per coppie sposate.', 6, 0, {}],
  ['Riconoscimento alla nascita', 'Entrambi i genitori registrati all’anagrafe.', -5, 0, { pop: 0, chiesa: -6 }],
  ['Adozioni anche per single e coppie dello stesso sesso', 'Apertura delle adozioni.', -8, 0, { pop: -1, chiesa: -10 }],
  ['Abrogare il reato universale', 'La GPA all’estero non è più punibile in Italia.', -6, 0, { pop: -2, chiesa: -6 }],
], { sal: 1 });

L('omotransfobia', 'Diritti', 'Legge contro l’omotransfobia', 'DDL Zan (affossato nel 2021)', 'soc', 0,
  'Non esiste un’aggravante specifica per i reati d’odio legati a orientamento sessuale e identità di genere.', [
  ['Nessuna legge', 'Situazione attuale.', 4, 0, {}],
  ['Aggravante per omotransfobia', 'Estensione della legge Mancino.', -6, 0, { pop: 1, chiesa: -4 }],
], { sal: 1 });

L('cannabis', 'Diritti', 'Cannabis', 'DPR 309/1990, DL Sicurezza 2025', 'soc', 0,
  'Uso ricreativo illegale; il DL Sicurezza del 2025 ha vietato anche la cannabis light.', [
  ['Divieto attuale', 'Situazione attuale.', 6, 0, {}],
  ['Ripristino della cannabis light', 'Torna legale la filiera della canapa senza THC.', 0, -0.1, { pop: 1, conf: 3 }],
  ['Autocoltivazione depenalizzata', 'Fino a 4 piante per uso personale.', -5, 0, { pop: 0, mag: 2 }],
  ['Legalizzazione e monopolio di Stato', 'Vendita regolata come i tabacchi.', -9, -1, { pop: 0, chiesa: -6, mag: 4 }],
], { sal: 1 });

L('cittadinanza', 'Immigrazione', 'Cittadinanza', 'L. 91/1992, DL 36/2025', 'imm', 0,
  '10 anni di residenza legale; ius sanguinis limitato a due generazioni dal 2025. Il referendum per ridurre a 5 anni (giugno 2025) non ha raggiunto il quorum.', [
  ['Regole attuali', 'Situazione attuale.', 5, 0, {}],
  ['Ius scholae', 'Cittadinanza per chi completa un ciclo di studi in Italia.', -4, 0, { pop: 1, chiesa: 4 }],
  ['Ius soli temperato', 'Cittadino chi nasce in Italia da genitori residenti da almeno 5 anni.', -7, 0, { pop: -1, chiesa: 4 }],
  ['5 anni di residenza', 'Il quesito referendario del 2025 diventa legge.', -5, 0, { pop: -1 }],
  ['Stretta: 15 anni e test di lingua e cultura', 'Requisiti più severi.', 9, 0, { pop: 0, chiesa: -4, ue: -2 }],
], { sal: 2, pp: { FI: 2 } });

L('voto_fuorisede', 'Istituzioni', 'Voto dei fuorisede', 'Sperimentazioni 2024-2025', 'ist', 0,
  'Gli studenti fuorisede hanno votato a distanza in via sperimentale a Europee e referendum. Per le Politiche serve tornare a casa.', [
  ['Solo sperimentazioni', 'Situazione attuale.', 2, 0, {}],
  ['Voto a distanza per tutti i fuorisede', 'Lavoratori e studenti votano dove vivono.', -3, 0.1, { pop: 2 }],
], { sal: 1 });

// ---------------- IMMIGRAZIONE ----------------
L('imm_flussi', 'Immigrazione', 'Decreto flussi (immigrazione legale)', 'DPCM flussi 2026-2028', 'imm', 0,
  'Circa 500.000 ingressi programmati per lavoro nel triennio 2026-2028, su richiesta delle imprese.', [
  ['500.000 nel triennio', 'Situazione attuale.', 3, 0, {}],
  ['Raddoppio dei flussi', 'Più lavoratori stranieri per agricoltura, edilizia, cura.', -3, 0, { pop: -2, conf: 12, pil: 0.06, chiesa: 4 }],
  ['Riduzione a 100.000', 'Priorità ai disoccupati italiani.', 8, 0, { pop: 1, conf: -12, pil: -0.05 }],
], { sal: 2, pp: { FI: 0 } });

L('imm_accoglienza', 'Immigrazione', 'Accoglienza, rimpatri e Albania', 'Bossi-Fini, DL Cutro 2023, Protocollo Italia-Albania', 'imm', 0,
  'Bossi-Fini, stretta del Decreto Cutro sulla protezione speciale, centri in Albania usati come CPR per i rimpatri.', [
  ['Sistema attuale', 'Situazione attuale.', 7, 0, {}],
  ['Chiusura dei centri in Albania e accoglienza diffusa', 'Rete SAI dei comuni, protezione speciale ripristinata.', -6, -0.3, { pop: -1, ue: 3, chiesa: 8 }],
  ['Superamento della Bossi-Fini', 'Ingresso per ricerca di lavoro, abolizione del reato di clandestinità.', -8, 0, { pop: -3, conf: 4, chiesa: 8 }],
  ['Blocco navale e respingimenti', 'Pattugliamento militare davanti alle coste libiche e tunisine.', 10, 1, { pop: 1, ue: -10, chiesa: -10, corte: 0.6 }],
], { sal: 3 });

L('imm_ong', 'Immigrazione', 'ONG e soccorso in mare', 'DL 1/2023 (Decreto Piantedosi)', 'imm', 0,
  'Porti di sbarco assegnati anche lontani, obbligo di sbarco immediato dopo il primo soccorso, fermi amministrativi.', [
  ['Decreto Piantedosi', 'Situazione attuale.', 7, 0, {}],
  ['Missione pubblica di soccorso', 'Una nuova Mare Nostrum, con l’Europa.', -6, 0.5, { pop: -1, ue: 3, chiesa: 8 }],
  ['Confisca delle navi ONG', 'Sequestro immediato in caso di violazioni.', 10, 0, { pop: 0, chiesa: -6, corte: 0.4, ue: -4 }],
], { sal: 2 });

// ---------------- GIUSTIZIA ----------------
L('giu_separazione', 'Giustizia', 'Separazione delle carriere', 'Riforma costituzionale Nordio', 'giu', 0,
  'Bocciata al referendum confermativo del 22-23 marzo 2026 (No 53,7%). Giudici e pm restano nella stessa carriera con un unico CSM.', [
  ['Carriera unica', 'Situazione attuale dopo il referendum.', -1, 0, {}],
  ['Ripresentare la separazione', 'Due CSM, sorteggio dei membri, Alta Corte disciplinare.', 8, 0, { pop: -3, mag: -20 }],
], { sal: 2, cost: 1 });

L('giu_abuso', 'Giustizia', 'Abuso d’ufficio', 'L. 114/2024 (Nordio)', 'giu', 0,
  'Reato abolito nel 2024 per evitare la "paura della firma" dei sindaci.', [
  ['Abolito', 'Situazione attuale.', 7, 0, {}],
  ['Reintrodurlo in forma ristretta', 'Solo per i casi di favoritismo intenzionale.', -4, 0, { mag: 8, ue: 3, pop: 1 }],
], { sal: 1 });

L('giu_intercettazioni', 'Giustizia', 'Intercettazioni', 'Riforme 2024-2025', 'giu', 0,
  'Limite di 45 giorni salvo reati gravi; divieto di pubblicare le intercettazioni di chi non è indagato.', [
  ['Regole attuali', 'Situazione attuale.', 6, 0, {}],
  ['Intercettazioni più ampie e trojan contro la corruzione', 'Nessun limite di durata per i reati contro la PA.', -7, 0, { mag: 15, pop: 1 }],
  ['Ulteriori limiti', 'Stop ai trojan e divieto di pubblicazione esteso.', 9, 0, { mag: -15, pop: -2, media: -10 }],
], { sal: 1 });

L('giu_prescrizione', 'Giustizia', 'Prescrizione', 'Riforma 2024 (ritorno alla prescrizione sostanziale)', 'giu', 0,
  'Torna la prescrizione "sostanziale" con sospensioni dopo le condanne in primo e secondo grado.', [
  ['Regole attuali', 'Situazione attuale.', 5, 0, {}],
  ['Stop dopo il primo grado', 'Come la riforma Bonafede del 2019.', -7, 0, { mag: 8, pop: 1 }],
  ['Prescrizione breve', 'Tempi più corti per i processi.', 9, 0, { mag: -12, pop: -3 }],
], { sal: 1 });

L('giu_carceri', 'Giustizia', 'Carceri', 'Piano carceri 2024-2025', 'giu', 0,
  'Sovraffollamento intorno al 130%, record di suicidi. Il governo punta su nuove strutture.', [
  ['Piano attuale', 'Situazione attuale.', 0, 0, {}],
  ['Amnistia e indulto', 'Serve la maggioranza dei 2/3 del Parlamento (art. 79 Cost.).', 8, -0.3, { pop: -6, mag: -6, chiesa: 10 }, ],
  ['Pene alternative e liberazione anticipata', 'Più domiciliari e lavori socialmente utili per pene brevi.', 5, -0.2, { pop: -2, chiesa: 6 }],
  ['Nuove carceri e certezza della pena', '10.000 nuovi posti in 5 anni.', -3, 1.5, { pop: 2 }],
], { sal: 1, q23: [1] });

L('giu_tempi', 'Giustizia', 'Tempi della giustizia civile', 'Riforma Cartabia (2021)', 'giu', 0,
  'Obiettivo PNRR di ridurre del 40% i tempi del civile; arretrato ancora alto.', [
  ['Situazione attuale', 'Riforma Cartabia.', 1, 0, {}],
  ['10.000 assunzioni tra magistrati e cancellieri', 'Piano straordinario per gli uffici giudiziari.', 0, 1, { mag: 10, pop: 1, pil: 0.04 }],
], { sal: 1, fis: 1 });

L('sicurezza', 'Sicurezza', 'Sicurezza urbana e proteste', 'DL 48/2025 (Decreto Sicurezza)', 'soc', 0,
  'Nuovi reati (occupazioni abusive, blocco stradale), tutele legali per le forze dell’ordine, stretta nelle carceri.', [
  ['Decreto Sicurezza', 'Situazione attuale.', 8, 0, {}],
  ['Abrogare le norme anti-protesta', 'Blocchi stradali e resistenza passiva tornano illeciti minori.', -5, 0, { pop: -1, sind: 6 }],
  ['Più agenti e Strade sicure', '10.000 nuovi agenti e militari nelle stazioni.', 7, 1, { pop: 2 }],
], { sal: 2 });

L('legittima_difesa', 'Sicurezza', 'Legittima difesa', 'L. 36/2019', 'soc', 0,
  'Difesa "sempre legittima" in casa propria in caso di intrusione con violenza.', [
  ['Regole del 2019', 'Situazione attuale.', 7, 0, {}],
  ['Ritorno alla proporzionalità', 'Il giudice valuta caso per caso.', -4, 0, { pop: -2, mag: 3 }],
], { sal: 1 });

L('femminicidio', 'Sicurezza', 'Violenza sulle donne', 'Reato di femminicidio (2025), Codice rosso', 'soc', 0,
  'Reato autonomo di femminicidio con ergastolo, Codice rosso. Nessuna educazione affettiva obbligatoria nelle scuole.', [
  ['Situazione attuale', 'Reato specifico e Codice rosso.', 2, 0, {}],
  ['Educazione affettiva obbligatoria a scuola', 'Corsi su consenso e rispetto in tutte le scuole.', -5, 0.1, { pop: 2, chiesa: -3 }],
  ['Più fondi ai centri antiviolenza e braccialetti', 'Raddoppio dei fondi e controllo elettronico.', -2, 0.3, { pop: 2 }],
], { sal: 1 });

// ---------------- ISTITUZIONI ----------------
L('premierato', 'Istituzioni', 'Premierato', 'DDL costituzionale Casellati', 'ist', 0,
  'Elezione diretta del Presidente del Consiglio: approvato dal Senato nel 2024, fermo alla Camera.', [
  ['Repubblica parlamentare', 'Situazione attuale.', -1, 0, {}],
  ['Premierato', 'Il premier eletto dai cittadini, premio alla coalizione vincente.', 9, 0, { pop: 0, quir: -15 }],
  ['Cancellierato con sfiducia costruttiva', 'Modello tedesco: il governo cade solo se c’è già una nuova maggioranza.', 3, 0, { quir: -2 }],
  ['Presidenzialismo', 'Elezione diretta del Presidente della Repubblica.', 10, 0, { pop: 0, quir: -25 }],
], { sal: 2, cost: 1 });

L('legge_elettorale', 'Istituzioni', 'Legge elettorale', 'Legge 2026 ("Stabilicum")', 'ist', 0,
  'Approvata definitivamente l’8 ottobre 2026: proporzionale con soglia al 3% (10% per le coalizioni), premio di 70 deputati e 35 senatori a chi supera il 42% in entrambe le Camere, fino a 3 preferenze, candidato premier dichiarato.', [
  ['Stabilicum (2026)', 'Proporzionale con premio di maggioranza al 42%.', 6, 0, {}],
  ['Ritorno al Rosatellum', 'Un terzo dei seggi in collegi uninominali, liste bloccate.', 3, 0, { pop: -1 }],
  ['Proporzionale puro con preferenze', 'Nessun premio, soglia al 4%.', -6, 0, { pop: 1 }],
  ['Maggioritario a doppio turno', 'Collegi uninominali con ballottaggio, alla francese.', 7, 0, { pop: 0 }],
], { sal: 1, sys: ['stabilicum', 'rosatellum', 'proporzionale', 'doppioturno'] });

L('autonomia', 'Territorio', 'Autonomia differenziata', 'L. 86/2024 (Calderoli)', 'terr', 0,
  'Ridimensionata dalla Consulta (sent. 192/2024): intese con le regioni ferme, livelli essenziali delle prestazioni (LEP) ancora da finanziare.', [
  ['Legge Calderoli in attesa', 'Situazione attuale.', 5, 0, {}],
  ['Firmare le intese con Veneto, Lombardia, Piemonte e Liguria', 'Trasferimento di competenze nelle materie non-LEP.', 9, 0.5, { pop: -1, corte: 0.3 }],
  ['Prima i LEP finanziati per tutti', 'Stessi servizi garantiti in ogni regione prima di ogni intesa.', -3, 3, { pop: 1 }],
  ['Abrogazione', 'Si cancella la legge Calderoli.', -7, 0, { pop: 0 }],
], { sal: 2, pp: { LEGA: 10, FI: 2, FDI: 3 } });

L('terzo_mandato', 'Territorio', 'Mandati di governatori e sindaci', 'L. 165/2004 e riforme 2024', 'terr', 0,
  'Governatori limitati a due mandati consecutivi (la Consulta nel 2025 ha bocciato la legge campana sul terzo). Sindaci: tre mandati sopra i 15.000 abitanti.', [
  ['Due mandati per i governatori', 'Situazione attuale.', 0, 0, {}],
  ['Terzo mandato per i governatori', 'Zaia, De Luca, Emiliano e altri avrebbero potuto ricandidarsi.', 6, 0, { pop: -1 }],
  ['Due mandati per tutti', 'Limite rigido anche per i sindaci.', -4, 0, { pop: 1 }],
], { sal: 1, pp: { LEGA: 8 } });

L('province', 'Territorio', 'Province', 'L. 56/2014 (Delrio)', 'terr', 0,
  'Enti di secondo livello: presidenti e consiglieri eletti dai sindaci, non dai cittadini.', [
  ['Province di secondo livello', 'Situazione attuale.', 0, 0, {}],
  ['Ritorno all’elezione diretta', 'Più poteri e fondi alle province.', 3, 0.4, { pop: -1 }],
], { sal: 1 });

L('fin_partiti', 'Istituzioni', 'Finanziamento dei partiti', 'DL 149/2013', 'ist', 0,
  'Abolito il finanziamento pubblico diretto: restano il 2x1000 volontario e le donazioni private.', [
  ['2x1000 e donazioni', 'Situazione attuale.', 2, 0, {}],
  ['Ritorno al finanziamento pubblico', 'Rimborsi legati ai voti, con controlli della Corte dei conti.', -2, 0.1, { pop: -5 }],
  ['Tetto alle donazioni private', 'Massimo 50.000€ da ogni donatore.', -4, 0, { pop: 1, conf: -2 }],
], { sal: 1 });

L('rai', 'Istituzioni', 'Governance della RAI', 'L. 220/2015', 'ist', 0,
  'L’amministratore delegato è nominato su indicazione del governo; il Media Freedom Act europeo chiede più indipendenza.', [
  ['Nomina governativa', 'Situazione attuale.', 5, 0, {}],
  ['RAI indipendente modello BBC', 'Fondazione con vertici scelti da un organismo indipendente.', -6, 0, { pop: 1, ue: 4, media: 10 }],
  ['Privatizzare una rete', 'Vendita di Rai 2 o Rai 3.', 7, -1, { pop: -1, media: -6 }],
], { sal: 1 });

L('canone', 'Cultura', 'Canone RAI', 'L. 208/2015', 'eco', 0,
  '90€ l’anno addebitati nella bolletta elettrica.', [
  ['90€ in bolletta', 'Situazione attuale.', 0, 0, {}],
  ['Abolizione del canone', 'Copertura con la fiscalità generale e la pubblicità.', 6, 1.8, { pop: 3, media: -4 }],
  ['Canone progressivo in base al reddito', 'Esenti i redditi bassi.', -3, 0, { pop: 1 }],
], { sal: 1, fis: 1, pp: { LEGA: 8 } });

// ---------------- SCUOLA E UNIVERSITÀ ----------------
L('scu_obbligo', 'Scuola', 'Obbligo scolastico', 'L. 296/2006', 'eco', 0,
  'Obbligo fino a 16 anni, diritto-dovere all’istruzione e formazione fino a 18. Riforma tecnico-professionale 4+2 in sperimentazione.', [
  ['Obbligo a 16 anni', 'Situazione attuale.', 1, 0, {}],
  ['Obbligo a 18 anni', 'Contro la dispersione scolastica, la più alta d’Europa dopo la Spagna.', -4, 1.5, { pop: 1, pil: 0.02 }],
  ['Filiera tecnico-professionale 4+2 per tutti', 'Diploma in 4 anni più 2 di ITS, in raccordo con le imprese.', 4, 0.3, { conf: 8 }],
], { sal: 1, fis: 1 });

L('scu_stipendi', 'Scuola', 'Stipendi degli insegnanti', 'CCNL Istruzione e Ricerca', 'eco', 0,
  'Gli stipendi sono tra i più bassi dell’Europa occidentale: circa 1.600-2.100€ netti.', [
  ['Contratti attuali', 'Situazione attuale.', 1, 0, {}],
  ['Aumento del 20% verso la media europea', 'Piano in tre anni.', -4, 6, { pop: 3, sind: 10, ue: -3 }],
  ['Carriera e premi al merito', 'Scatti legati a formazione e valutazione.', 5, 1, { sind: -6 }],
], { sal: 2, fis: 1 });

L('scu_paritarie', 'Scuola', 'Scuole paritarie', 'L. 62/2000', 'soc', 0,
  'Contributi statali limitati e piccole detrazioni per le famiglie.', [
  ['Contributi attuali', 'Situazione attuale.', 1, 0, {}],
  ['Buono scuola per la libera scelta', 'Le famiglie possono usare un voucher anche nelle paritarie.', 7, 1.2, { chiesa: 12, sind: -4 }],
  ['Stop ai fondi alle paritarie', 'Tutto alla scuola statale.', -7, -0.5, { chiesa: -12 }],
], { sal: 1 });

L('scu_condotta', 'Scuola', 'Voto in condotta e cellulari in classe', 'L. 150/2024 (Valditara)', 'soc', 0,
  'Con il 5 in condotta si è bocciati, con il 6 si porta un elaborato a settembre; cellulari vietati in classe.', [
  ['Riforma Valditara', 'Situazione attuale.', 6, 0, {}],
  ['Abrogazione', 'Si torna alle regole precedenti.', -4, 0, { pop: -1 }],
], { sal: 1 });

L('uni_tasse', 'Università', 'Tasse universitarie', 'L. 232/2016', 'eco', 0,
  'No tax area per ISEE fino a 22.000€; borse di studio non sempre garantite a tutti gli idonei.', [
  ['Regole attuali', 'Situazione attuale.', 2, 0, {}],
  ['Università gratuita', 'Abolizione delle tasse universitarie.', -6, 1.8, { pop: 3 }],
  ['Borse e studentati per tutti gli idonei', '60.000 nuovi posti letto.', -3, 0.8, { pop: 2 }],
], { sal: 1, fis: 1 });

L('ricerca', 'Università', 'Spesa per la ricerca', 'Programmazione MUR', 'eco', 0,
  'Spesa in ricerca e sviluppo intorno all’1,4% del PIL, contro il 2,2% della media UE.', [
  ['Livello attuale', 'Situazione attuale.', 1, 0, {}],
  ['Portarla al 2% del PIL', 'Piano straordinario in 5 anni, rientro dei cervelli.', -3, 4, { pil: 0.08, conf: 6, pop: 1 }],
], { sal: 1, fis: 1 });

// ---------------- AMBIENTE ED ENERGIA ----------------
L('nucleare', 'Energia', 'Nucleare', 'Legge delega sul nucleare sostenibile', 'amb', 0,
  'Dopo i referendum del 1987 e 2011, il governo ha avviato una legge delega per il ritorno al nucleare di nuova generazione (piccoli reattori).', [
  ['Delega in attuazione', 'Situazione attuale.', 4, 0, {}],
  ['Piano nazionale: reattori SMR entro il 2040', 'Investimenti pubblici e accordi con Enel, Ansaldo e partner esteri.', 6, 1, { conf: 8, pil: 0.02 }],
  ['Rinuncia definitiva al nucleare', 'Tutto sulle rinnovabili.', -7, 0, { conf: -3 }],
], { sal: 2, pp: { AZ: 8, IV: 4, M5S: -6, AVS: -10, PD: -2 } });

L('rinnovabili', 'Energia', 'Rinnovabili', 'Decreto aree idonee, DL Agricoltura 2024', 'amb', 0,
  'Limiti al fotovoltaico a terra su terreni agricoli; obiettivi 2030 in ritardo.', [
  ['Regole attuali', 'Situazione attuale.', 3, 0, {}],
  ['Semplificazioni e obiettivo 2030 accelerato', 'Autorizzazioni in 6 mesi, agrivoltaico, eolico offshore.', -6, 1, { pil: 0.04, ue: 4, conf: 4 }],
  ['Stop a pale e pannelli sui terreni agricoli', 'Tutela del paesaggio e dell’agricoltura.', 7, 0, { ue: -3 }],
], { sal: 1 });

L('auto2035', 'Energia', 'Stop ai motori a benzina e diesel nel 2035', 'Regolamento UE 2023/851', 'amb', 0,
  'Il regolamento europeo vieta la vendita di auto nuove a combustione dal 2035. L’Italia chiede di rivederlo.', [
  ['Chiedere la revisione', 'Posizione attuale del governo italiano.', 4, 0, {}],
  ['Sostenere lo stop e incentivi alle elettriche', 'Bonus auto elettriche e colonnine.', -6, 1, { ue: 6, conf: -3 }],
  ['Opposizione totale in Europa', 'L’Italia vota contro e chiede l’abolizione.', 9, 0, { ue: -8, conf: 4 }],
], { sal: 1 });

L('clima', 'Ambiente', 'Legge sul clima e sussidi fossili', 'Nessuna legge quadro', 'amb', 0,
  'Nessuna legge quadro sul clima; circa 20 miliardi di sussidi ambientalmente dannosi.', [
  ['Nessuna legge', 'Situazione attuale.', 4, 0, {}],
  ['Legge sul clima e taglio dei sussidi fossili', 'Neutralità al 2050 e riduzione graduale dei sussidi.', -8, -2, { pop: -1, conf: -6, ue: 5 }],
], { sal: 1 });

L('ponte', 'Infrastrutture', 'Ponte sullo Stretto di Messina', 'DL 35/2023', 'amb', 0,
  'Progetto approvato dal CIPESS nel 2025; la Corte dei conti ha negato la registrazione e l’iter è ripartito. Cantieri non ancora aperti.', [
  ['Iter in corso', 'Situazione attuale.', 5, 0, {}],
  ['Aprire i cantieri', 'Opera da circa 13,5 miliardi.', 8, 1.5, { pil: 0.03, conf: 4, pop: 0 }],
  ['Cancellare il Ponte', 'Fondi spostati su ferrovie e strade di Sicilia e Calabria.', -5, -1, { pop: 1 }],
], { sal: 2, pp: { LEGA: 10, FI: 6, FDI: 5, M5S: -6, PD: -5, AVS: -9, SCN: 4 } });

L('caccia', 'Ambiente', 'Caccia', 'L. 157/1992', 'amb', 0,
  'Legge del 1992 con ampliamenti recenti su calendari e specie cacciabili.', [
  ['Regole attuali', 'Situazione attuale.', 3, 0, {}],
  ['Più restrizioni', 'Tutela della fauna, periodi più brevi.', -6, 0, { pop: 1 }],
  ['Più libertà ai cacciatori', 'Calendari regionali più ampi.', 8, 0, { pop: -1 }],
], { sal: 1 });

L('balneari', 'Economia', 'Concessioni balneari', 'Direttiva Bolkestein, DL 131/2024', 'eu', 0,
  'Proroga delle concessioni fino al 2027, poi gare pubbliche come chiede l’Europa.', [
  ['Gare dal 2027', 'Situazione attuale.', 1, 0, {}],
  ['Gare subito', 'Rispetto immediato della direttiva europea.', -5, -0.5, { ue: 8, pop: 0 }],
  ['Proroga lunga, fuori dalla Bolkestein', 'Scontro con la Commissione.', 9, 0, { ue: -12, corte: 0.4 }],
], { sal: 1 });

L('taxi', 'Economia', 'Taxi e NCC', 'L. 21/1992', 'eco', 0,
  'Licenze contingentate dai comuni; liberalizzazioni sempre respinte.', [
  ['Licenze attuali', 'Situazione attuale.', -2, 0, {}],
  ['Liberalizzazione', 'Più licenze, app e NCC liberi.', 8, 0, { pop: 1, conf: 3 }],
], { sal: 1 });

// ---------------- ECONOMIA E IMPRESE ----------------
L('privatizzazioni', 'Economia', 'Privatizzazioni', 'Piano 2024-2026', 'eco', 0,
  'Vendute quote di MPS; previste cessioni di quote di Poste, ENI e FS per circa 20 miliardi.', [
  ['Piano attuale', 'Situazione attuale.', 3, 0, {}],
  ['Vendere quote di ENI, Poste e FS', 'Si incassa per ridurre il debito.', 8, 0.2, { merc: 6, sind: -6, pop: -1 }, ],
  ['Nazionalizzazioni strategiche', 'Lo Stato riprende rete TIM, ex Ilva e autostrade.', -7, 2, { sind: 8, merc: -6, conf: -4 }],
], { sal: 1, debt: [0, -1.5, 0.5] });

L('ilva', 'Economia', 'Ex Ilva di Taranto', 'Amministrazione straordinaria', 'eco', 0,
  'Acciaierie d’Italia in amministrazione straordinaria; vendita a investitori esteri in corso, 10.000 lavoratori.', [
  ['Vendita in corso', 'Situazione attuale.', 3, 0, {}],
  ['Nazionalizzazione', 'Lo Stato gestisce direttamente l’acciaieria.', -8, 2, { sind: 10, merc: -3 }],
  ['Riconversione green e chiusura dell’area a caldo', 'Forni elettrici, bonifiche e reimpiego dei lavoratori.', -4, 1.5, { sind: -3, ue: 3 }],
], { sal: 1 });

L('zes', 'Territorio', 'Mezzogiorno: ZES unica e decontribuzione', 'DL 124/2023', 'terr', 0,
  'Dal 2024 una Zona economica speciale unica per tutto il Sud con credito d’imposta per investimenti.', [
  ['ZES unica', 'Situazione attuale.', -4, 0, {}],
  ['Rafforzarla con la decontribuzione Sud', 'Taglio del 30% dei contributi per chi assume al Sud.', -7, 3, { pop: 2, conf: 6, ue: -3, occ: -0.1 }],
  ['Abolire gli incentivi territoriali', 'Stesse regole in tutta Italia.', 6, -2.5, { pop: -2 }],
], { sal: 2, fis: 1 });

L('ia', 'Economia', 'Intelligenza artificiale', 'Legge sull’IA (2025)', 'eco', 0,
  'L’Italia ha approvato nel 2025 una legge nazionale coordinata con l’AI Act europeo, con un fondo da 1 miliardo.', [
  ['Legge attuale', 'Situazione attuale.', 1, 0, {}],
  ['Fondo nazionale IA da 10 miliardi', 'Supercalcolo, startup e formazione.', 2, 2, { pil: 0.04, conf: 6 }],
  ['Regole più severe su lavoro e privacy', 'Limiti all’uso dell’IA nei luoghi di lavoro.', -5, 0, { sind: 6, conf: -4 }],
], { sal: 1, fis: 1 });

L('carne_coltivata', 'Agricoltura', 'Carne coltivata', 'L. 172/2023', 'soc', 0,
  'Vietata produzione e vendita dal 2023, primo paese al mondo.', [
  ['Divieto', 'Situazione attuale.', 6, 0, {}],
  ['Consentire la ricerca e la vendita', 'Con l’autorizzazione europea.', -5, 0, { ue: 3 }],
], { sal: 1 });

// ---------------- DIFESA ED EUROPA ----------------
L('difesa', 'Difesa', 'Spesa per la difesa', 'Impegni NATO (vertice dell’Aia 2025)', 'eu', 0,
  'Circa 2% del PIL; impegno NATO a raggiungere il 3,5% più 1,5% di sicurezza entro il 2035. Richiesta flessibilità UE per la difesa nella manovra 2027.', [
  ['Aumento graduale', 'Situazione attuale.', 3, 0, {}],
  ['3,5% del PIL entro il 2030', 'Grande riarmo e industria della difesa.', 8, 15, { pop: -3, ue: 6, merc: -2, conf: 4 }],
  ['Congelare al 2%', 'Nessun nuovo aumento.', -3, -3, { pop: 1, ue: -3 }],
  ['Tagliare la spesa militare', 'Ritiro da alcune missioni all’estero.', -9, -5, { pop: 1, ue: -8 }],
], { sal: 2, fis: 1, pp: { FDI: 6, FI: 7, NM: 6, LEGA: 1, FN: 5, PD: 1, M5S: -7, AVS: -9, AZ: 8, IV: 7, PE: 7, SCN: -2 } });

L('leva', 'Difesa', 'Servizio militare', 'L. 226/2004 (sospensione della leva)', 'soc', 0,
  'La leva obbligatoria è sospesa dal 2005.', [
  ['Leva sospesa', 'Situazione attuale.', 0, 0, {}],
  ['Mini-naja volontaria di 6 mesi', 'Formazione militare e di protezione civile su base volontaria.', 6, 0.5, { pop: 0 }],
  ['Servizio civile universale di 12 mesi', 'Per tutti i giovani, civile o militare.', -2, 1, { pop: 0 }],
  ['Leva obbligatoria', 'Ritorno al servizio militare obbligatorio.', 9, 4, { pop: -4 }],
], { sal: 1 });

L('mes', 'Europa', 'Riforma del MES', 'Trattato MES riformato', 'eu', 0,
  'L’Italia è l’unico paese che non l’ha ratificata: la Camera l’ha bocciata nel dicembre 2023.', [
  ['Non ratificata', 'Situazione attuale.', 7, 0, {}],
  ['Ratificare il MES', 'Si sblocca il paracadute per le banche europee.', -6, 0, { ue: 15, merc: 6, pop: -1 }],
], { sal: 1 });

L('codice_strada', 'Infrastrutture', 'Codice della strada', 'L. 177/2024', 'soc', 0,
  'Stretta su cellulare alla guida e alcol, casco, targa e assicurazione per i monopattini.', [
  ['Codice 2024', 'Situazione attuale.', 5, 0, {}],
  ['Limite di 30 km/h nelle città', 'Come a Bologna e Parigi.', -6, 0, { pop: -2 }],
  ['Sanzioni più leggere', 'Ammorbidimento delle norme del 2024.', 7, 0, { pop: 1 }],
], { sal: 1 });

// Mappa rapida id -> legge
const LAW_BY_ID = {};
LAWS.forEach(l => { LAW_BY_ID[l.id] = l; });

// ============================================================
//  MISURE ANNUALI DELLA MANOVRA (valgono per l'anno, si rinnovano o no)
//  costo in mld€: positivo = spesa / minori entrate; negativo = copertura
// ============================================================
const BUDGET_MEASURES = [
  // Spese e tagli di tasse
  { id: 'm_statali',   g: 'Spese', n: 'Rinnovo contratti statali',             c: 3,   e: { sind: 6, pop: 1 }, d: 'Aumenti per 3,2 milioni di dipendenti pubblici.' },
  { id: 'm_sanita',    g: 'Spese', n: 'Fondo sanitario +3 miliardi',           c: 3,   e: { pop: 2, sind: 3 }, d: 'Assunzioni e liste d’attesa.' },
  { id: 'm_pensrival', g: 'Spese', n: 'Rivalutazione piena delle pensioni',    c: 2,   e: { pop: 1, sind: 4 }, d: 'Nessun taglio all’adeguamento all’inflazione.' },
  { id: 'm_tredic',    g: 'Spese', n: 'Detassazione tredicesime e straordinari', c: 2, e: { pop: 2, conf: 2 }, d: 'Aliquota al 10% su premi e straordinari.' },
  { id: 'm_famiglie',  g: 'Spese', n: 'Bonus famiglie e nuovi nati',           c: 1,   e: { pop: 1, chiesa: 4 }, d: 'Carta per i nuovi nati e bonus mamme lavoratrici.' },
  { id: 'm_invest',    g: 'Spese', n: 'Investimenti pubblici',                 c: 4,   e: { pil: 0.12, conf: 4 }, d: 'Opere, manutenzione, dissesto idrogeologico.' },
  { id: 'm_difesa',    g: 'Spese', n: 'Spesa per la difesa +0,15% PIL',        c: 3.5, e: { ue: 3, pop: -1 }, d: 'Con la clausola di salvaguardia nazionale UE.' },
  { id: 'm_bollette',  g: 'Spese', n: 'Fondo contro il caro bollette',         c: 3,   e: { pop: 2, infl: -0.2 }, d: 'Bonus sociale e riduzione oneri di sistema.' },
  { id: 'm_ind50',     g: 'Spese', n: 'Transizione 5.0 e iperammortamento',    c: 2,   e: { conf: 8, pil: 0.05 }, d: 'Incentivi agli investimenti delle imprese.' },
  { id: 'm_scuola',    g: 'Spese', n: 'Scuola e università',                   c: 1.5, e: { pop: 1, sind: 2 }, d: 'Edilizia scolastica, borse di studio.' },
  { id: 'm_comuni',    g: 'Spese', n: 'Fondi a comuni e regioni',              c: 1,   e: { pop: 1 }, d: 'Trasporto locale e servizi sociali.' },
  { id: 'm_sud',       g: 'Spese', n: 'Fondo per il Mezzogiorno',              c: 1.5, e: { pop: 1 }, d: 'Coesione e infrastrutture al Sud.' },
  { id: 'm_sicurezza', g: 'Spese', n: 'Forze dell’ordine e straordinari',      c: 1,   e: { pop: 1 }, d: 'Assunzioni nelle forze di polizia.' },
  { id: 'm_cultura',   g: 'Spese', n: 'Cultura e Carta giovani',               c: 0.5, e: { pop: 0.5 }, d: 'Carta della cultura e del merito.' },
  // Coperture
  { id: 'c_spending',  g: 'Coperture', n: 'Spending review dei ministeri',     c: -2,  e: { pop: 0 }, d: 'Risparmi mirati sulle spese di funzionamento.' },
  { id: 'c_tagli',     g: 'Coperture', n: 'Tagli lineari ai ministeri',        c: -4,  e: { pop: -1, sind: -4 }, d: 'Taglio uguale per tutti: rapido ma rischioso.' },
  { id: 'c_banche',    g: 'Coperture', n: 'Contributo straordinario di banche e assicurazioni', c: -3, e: { pop: 1, merc: -4 }, d: 'Prelievo una tantum sugli utili.' },
  { id: 'c_giochi',    g: 'Coperture', n: 'Prelievo su giochi e scommesse',     c: -0.8, e: { pop: 0 }, d: 'Aumento del prelievo sul gioco.' },
  { id: 'c_tabacchi',  g: 'Coperture', n: 'Accise su tabacchi e sigarette elettroniche', c: -1, e: { pop: -0.5 }, d: 'Aumento delle accise.' },
  { id: 'c_evasione',  g: 'Coperture', n: 'Recupero evasione (stima)',          c: -3,  e: { ue: -2 }, d: 'Entrate incerte: Bruxelles le considera poco credibili.', risk: 0.4 },
  { id: 'c_taxexp',    g: 'Coperture', n: 'Taglio di detrazioni e bonus fiscali', c: -4, e: { pop: -2 }, d: 'Riordino delle 600 agevolazioni fiscali.' },
  { id: 'c_rottam',    g: 'Coperture', n: 'Nuova rottamazione delle cartelle', c: -1.5, e: { ue: -3, mag: -3 }, d: 'Incasso una tantum, aiuta poco i conti strutturali.' },
  { id: 'c_iva',       g: 'Coperture', n: 'Aumento dell’IVA al 10% → 12%',     c: -6,  e: { pop: -5, infl: 0.4, conf: -4 }, d: 'Gettito sicuro ma molto impopolare.' },
  { id: 'c_pensioni',  g: 'Coperture', n: 'Raffreddamento della rivalutazione delle pensioni alte', c: -1.5, e: { pop: -1, sind: -5 }, d: 'Adeguamento parziale sopra 4 volte il minimo.' },
];
const BUDGET_BY_ID = {};
BUDGET_MEASURES.forEach(m => { BUDGET_BY_ID[m.id] = m; });
