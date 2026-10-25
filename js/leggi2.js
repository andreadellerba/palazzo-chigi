// ============================================================
//  30 LEGGI NUOVE (casa, intelligenza artificiale, Mezzogiorno,
//  sport, tecnologia, sanità, scuola, istituzioni, difesa...)
//  [testo, spiegazione, posizione sull'asse, costo in mld/anno, effetti]
// ============================================================
const LEGGI2_START = LAWS.length;

// ---------- casa e territorio ----------
L('n_casa_giovani', 'Welfare', 'Casa per i giovani', 'Fondo garanzia prima casa (Consap)', 'eco', 0,
  'Lo Stato garantisce fino all’80% del mutuo per gli under 36 con ISEE basso.', [
  ['Garanzia all’80% per gli under 36', 'Situazione attuale.', 0, 0, {}],
  ['Garanzia al 100% e niente tasse sul rogito', 'Mutuo senza anticipo e zero imposte per chi compra la prima casa sotto i 36 anni.', -2, 1.2, { pop: 2, sind: 3 }],
  ['Piano da 100.000 case popolari', 'Lo Stato costruisce e ristruttura case a canone sociale in dieci anni.', -6, 3, { pop: 2, sind: 8, conf: 2, occ: -0.05 }],
  ['Abolire la garanzia pubblica', 'Il mercato fa da sé: le banche valutano i mutui senza aiuto dello Stato.', 6, -0.5, { pop: -1, merc: 2 }],
], { sal: 2 });
L('n_affitti_brevi', 'Territorio', 'Affitti brevi turistici', 'Cedolare secca 21-26%, codice identificativo nazionale', 'eco', 0,
  'Cedolare secca al 21% sul primo appartamento e al 26% dal secondo; obbligo del codice identificativo.', [
  ['Cedolare 21-26% e codice nazionale', 'Situazione attuale.', 2, 0, {}],
  ['Tetto agli affitti brevi nei centri storici', 'I Comuni possono limitare il numero di appartamenti per turisti.', -5, 0, { pop: 1, conf: -3, sind: 3 }],
  ['Cedolare al 33% per chi ha più case', 'Si tassa di più chi fa impresa con gli affitti brevi.', -3, -0.3, { pop: 1, conf: -2 }],
  ['Liberalizzazione totale', 'Nessun limite e nessun codice: decide il proprietario.', 7, 0, { conf: 3, pop: -1 }],
], { sal: 1 });
L('n_acqua', 'Territorio', 'Gestione dell’acqua', 'Referendum 2011, gestori misti', 'eco', 0,
  'Acquedotti gestiti da società pubbliche, miste o private; perdite di rete intorno al 42%.', [
  ['Gestori misti come oggi', 'Situazione attuale.', 1, 0, {}],
  ['Tutto pubblico e un piano contro le perdite', 'Gestione solo pubblica e 2 miliardi l’anno per rifare le reti.', -6, 2, { pop: 2, sind: 4, occ: -0.03 }],
  ['Gare europee per i gestori', 'Concessioni a gara: entrano grandi operatori privati.', 6, -0.2, { merc: 3, ue: 3, pop: -2 }],
], { sal: 1 });

// ---------- tecnologia ----------
L('n_ia', 'Economia', 'Intelligenza artificiale', 'L. 132/2025', 'eco', 0,
  'Prima legge italiana sull’IA: agenzie di controllo, regole per sanità e lavoro, un miliardo per le imprese.', [
  ['Legge del 2025 con un miliardo per le imprese', 'Situazione attuale.', 1, 0, {}],
  ['Fondo da 5 miliardi per un’IA italiana', 'Supercalcolo pubblico, startup e ricerca: l’Italia prova a giocarsela.', -1, 1, { pil: 0.05, conf: 4, media: 2 }],
  ['Regole severe e un’autorità indipendente', 'Divieti per riconoscimento facciale e controllo dei lavoratori.', -4, 0.1, { sind: 5, conf: -3, ue: 2 }],
  ['Mani libere alle aziende', 'Meno vincoli possibili per attirare investimenti.', 6, 0, { conf: 5, pil: 0.03, sind: -4 }],
], { sal: 1 });
L('n_rete', 'Infrastrutture', 'Rete in fibra', 'Rete di FiberCop e Open Fiber', 'eco', 0,
  'Due reti separate: FiberCop (ex Tim, fondo KKR con lo Stato) e Open Fiber (CDP e Macquarie).', [
  ['Due reti separate', 'Situazione attuale.', 2, 0, {}],
  ['Rete unica a controllo pubblico', 'Lo Stato riunisce le due reti e porta la fibra ovunque.', -5, 1.5, { pil: 0.03, merc: -2, pop: 1 }],
  ['Voucher per le famiglie e concorrenza', 'Incentivi alla domanda, la rete resta privata.', 4, 0.4, { pop: 1, conf: 2 }],
], { sal: 1 });
L('n_contante', 'Fisco', 'Tetto al contante', 'L. 197/2022', 'eco', 0,
  'Pagamenti in contanti consentiti fino a 5.000 euro.', [
  ['Tetto a 5.000 euro', 'Situazione attuale.', 3, 0, {}],
  ['Tetto a 1.000 euro', 'Meno contante per combattere l’evasione.', -4, -0.6, { ue: 3, conf: -2, pop: -1 }],
  ['Nessun tetto', 'Ognuno paga come vuole.', 8, 0.3, { pop: 1, ue: -4 }],
], { sal: 1 });
L('n_bollo', 'Fisco', 'Bollo auto', 'Tassa automobilistica regionale', 'eco', 0,
  'Tassa annuale su ogni auto, incassata dalle Regioni: circa 6,5 miliardi l’anno.', [
  ['Bollo regionale', 'Situazione attuale.', 0, 0, {}],
  ['Abolizione del bollo', 'Lo Stato rimborsa le Regioni: costa molto, piace molto.', 5, 6.5, { pop: 3, ue: -4, merc: -2 }],
  ['Bollo solo sulle auto più inquinanti', 'Gratis per le auto nuove ed elettriche, più caro per le vecchie.', -2, 0.8, { pop: -1, conf: 1 }],
], { sal: 1 });
L('n_auto_elettriche', 'Energia', 'Incentivi alle auto elettriche', 'Ecobonus', 'amb', 0,
  'Incentivi a fasce di ISEE per comprare auto elettriche rottamando le vecchie.', [
  ['Ecobonus a fasce', 'Situazione attuale.', 0, 0, {}],
  ['Incentivi forti e colonnine ovunque', 'Fino a 10.000 euro e 50.000 nuove colonnine.', -6, 1.2, { conf: 2, pil: 0.02, ue: 2 }],
  ['Stop agli incentivi, sì ai motori termici', 'Si difende l’auto tradizionale e la filiera italiana.', 6, -0.5, { conf: 1, ue: -2 }],
], { sal: 1 });
L('n_aree_idonee', 'Energia', 'Pannelli solari a terra', 'D.L. Agricoltura 2024, aree idonee', 'amb', 0,
  'Vietati i pannelli a terra nei campi agricoli; le Regioni scelgono le aree idonee.', [
  ['Divieto nei campi e scelta alle Regioni', 'Situazione attuale.', 3, 0, {}],
  ['Via libera agli impianti nelle aree idonee', 'Procedure veloci per solare ed eolico.', -5, 0, { pil: 0.03, prezzi: 0, infl: -0.05, ue: 3, conf: 2 }],
  ['Stop totale ai nuovi impianti a terra', 'Il paesaggio prima di tutto.', 7, 0, { infl: 0.03, conf: -1 }],
], { sal: 1 });

// ---------- lavoro ----------
L('n_smart', 'Lavoro', 'Lavoro da casa', 'L. 81/2017', 'eco', 0,
  'Il lavoro agile si decide con un accordo tra azienda e lavoratore.', [
  ['Accordo individuale', 'Situazione attuale.', 2, 0, {}],
  ['Diritto a due giorni da casa', 'Chi può lavorare da remoto ha diritto a due giorni a settimana.', -4, 0, { sind: 5, conf: -3, pop: 1 }],
  ['Sgravi alle aziende che lo concedono', 'Incentivi per chi adotta il lavoro agile.', 1, 0.4, { conf: 2, pop: 1 }],
], { sal: 1 });
L('n_settimana_corta', 'Lavoro', 'Settimana di quattro giorni', 'Sperimentazioni aziendali', 'eco', 0,
  'Solo alcune grandi aziende sperimentano la settimana corta.', [
  ['Libera sperimentazione', 'Situazione attuale.', 2, 0, {}],
  ['Incentivi a chi passa a 4 giorni a parità di stipendio', 'Sgravi contributivi alle aziende che riducono l’orario.', -4, 1, { sind: 7, conf: -2, pop: 2, pil: -0.02 }],
  ['Settimana corta per legge nel pubblico', 'Dal 2028 quattro giorni nella pubblica amministrazione.', -7, 0.6, { sind: 6, merc: -2, pop: 1 }],
], { sal: 1 });
L('n_opzione_donna', 'Pensioni', 'Opzione donna', 'L. bilancio 2025', 'eco', 0,
  'Pensione anticipata per le donne con 35 anni di contributi, solo per alcune categorie.', [
  ['Solo per alcune categorie', 'Situazione attuale.', 1, 0, {}],
  ['Per tutte le donne a 58 anni', 'Torna l’Opzione donna originale con il ricalcolo contributivo.', -3, 0.6, { pop: 2, sind: 4, ue: -1 }],
  ['Abolita', 'Si chiude il canale.', 4, -0.1, { pop: -1 }],
], { sal: 1 });

// ---------- Mezzogiorno e infrastrutture ----------
L('n_av_sud', 'Infrastrutture', 'Alta velocità al Sud', 'Salerno-Reggio Calabria, lavori in corso', 'terr', 0,
  'L’alta velocità arriva a Salerno; il tratto fino a Reggio è finanziato solo in parte.', [
  ['Lavori a tratti', 'Situazione attuale.', 0, 0, {}],
  ['Finanziare tutta la Salerno-Reggio e la Palermo-Catania', 'Venti miliardi in dieci anni per collegare il Sud.', -6, 2, { pil: 0.05, occ: -0.04, pop: 1, conf: 3 }],
  ['Prima le opere al Nord', 'Pedemontane e valichi alpini: dove passa più traffico.', 6, 1, { pil: 0.03, conf: 2 }],
], { sal: 1 });
L('n_porti_sud', 'Economia', 'Porti del Sud', 'Autorità di sistema portuale', 'eco', 0,
  'Sedici autorità portuali indipendenti; Gioia Tauro e Taranto sotto le potenzialità.', [
  ['Sedici autorità portuali', 'Situazione attuale.', 0, 0, {}],
  ['Porti Spa unica con investimenti al Sud', 'Una società nazionale gestisce i porti e investe su Gioia Tauro e Taranto.', -3, 0.8, { pil: 0.03, occ: -0.02 }],
  ['Privatizzare la gestione dei porti', 'Concessioni lunghe ai grandi operatori internazionali.', 6, -0.4, { merc: 3, sind: -4 }],
], { sal: 1 });

// ---------- scuola, sport, cultura ----------
L('n_sport_scuola', 'Scuola', 'Sport a scuola', 'Educazione motoria alla primaria (2023)', 'soc', 0,
  'Due ore di educazione fisica a settimana; insegnanti di motoria solo nelle ultime classi della primaria.', [
  ['Due ore e insegnanti solo in parte', 'Situazione attuale.', 0, 0, {}],
  ['Un’ora al giorno di sport e palestre ristrutturate', 'Sport ogni giorno e 2 miliardi per le palestre scolastiche.', -2, 1.2, { pop: 2, occ: -0.01 }],
  ['Accordi con le società sportive', 'Le ore di sport le fanno le associazioni del territorio.', 3, 0.3, { pop: 1, conf: 1 }],
], { sal: 1 });
L('n_cellulari', 'Scuola', 'Telefoni a scuola', 'Circolari ministeriali 2024-2025', 'soc', 0,
  'Telefoni vietati in classe dalla primaria alle superiori.', [
  ['Divieto in classe', 'Situazione attuale.', 2, 0, {}],
  ['Divieto anche nell’intervallo, con armadietti', 'I telefoni restano chiusi per tutta la giornata.', 5, 0.1, { pop: 1, chiesa: 2 }],
  ['Libertà alle scuole', 'Ogni istituto decide come usarli, anche per la didattica.', -4, 0, { media: 1 }],
], { sal: 1 });
L('n_stadi', 'Cultura', 'Nuovi stadi', 'Commissario per gli stadi (2025)', 'eco', 0,
  'Stadi vecchi in vista degli Europei 2032: un commissario per accelerare.', [
  ['Commissario e procedure accelerate', 'Situazione attuale.', 2, 0, {}],
  ['Fondo pubblico per gli stadi degli Europei', 'Due miliardi per rifare gli stadi delle città ospitanti.', -2, 0.4, { pop: 2, conf: 2 }],
  ['Stadi solo con soldi privati, in cambio di centri commerciali', 'Le società costruiscono, lo Stato concede le aree.', 5, 0, { conf: 3, pop: 0 }],
], { sal: 1 });
L('n_canone', 'Cultura', 'Canone RAI', 'In bolletta, 90 euro (2026)', 'eco', 0,
  'Il canone della televisione pubblica si paga nella bolletta della luce: 90 euro l’anno.', [
  ['90 euro in bolletta', 'Situazione attuale.', 0, 0, {}],
  ['Abolito: la RAI vive di pubblicità e fiscalità generale', 'Niente più canone: lo Stato copre con il bilancio.', 5, 1.7, { pop: 2, media: -3 }],
  ['Canone legato al reddito', 'Gratis per i redditi bassi, di più per chi guadagna molto.', -4, -0.1, { pop: 1 }],
], { sal: 1 });

// ---------- sanità e diritti ----------
L('n_medici_base', 'Sanità', 'Medici di famiglia', 'Convenzione con il Servizio sanitario', 'eco', 0,
  'I medici di base sono liberi professionisti convenzionati; in molte zone mancano.', [
  ['Liberi professionisti convenzionati', 'Situazione attuale.', 1, 0, {}],
  ['Dipendenti del Servizio sanitario nelle Case di comunità', 'Orari lunghi, studi associati, più medici dove mancano.', -5, 1.5, { pop: 2, sind: 5 }],
  ['Più autonomia e incentivi a chi apre nelle zone scoperte', 'Bonus per chi va nei piccoli centri.', 3, 0.5, { pop: 1 }],
], { sal: 1 });
L('n_azzardo', 'Sanità', 'Gioco d’azzardo', 'Decreto Dignità 2018 (divieto di pubblicità)', 'soc', 0,
  'Pubblicità vietata; slot e scommesse online fruttano allo Stato circa 11 miliardi l’anno.', [
  ['Pubblicità vietata', 'Situazione attuale.', 0, 0, {}],
  ['Via le slot dai bar e distanze dalle scuole', 'Si riduce l’offerta di gioco sul territorio.', 4, 1.2, { chiesa: 6, pop: 1 }],
  ['Torna la sponsorizzazione nello sport', 'Le squadre di calcio possono avere sponsor di scommesse.', -3, -0.3, { conf: 2, chiesa: -4 }],
], { sal: 1 });
L('n_animali', 'Diritti', 'Tutela degli animali', 'L. 82/2025 (reati contro gli animali)', 'soc', 0,
  'Pene più alte per maltrattamenti e uccisioni; gli animali tutelati in quanto tali.', [
  ['Legge del 2025', 'Situazione attuale.', 0, 0, {}],
  ['Animali in Costituzione come esseri senzienti e stop agli allevamenti in gabbia', 'Tutela ancora più forte, anche negli allevamenti.', -4, 0.3, { pop: 1, conf: -2 }],
  ['Più tutele per allevatori e cacciatori', 'Si allentano alcuni vincoli per il mondo agricolo.', 5, 0, { conf: 1, pop: -1 }],
], { sal: 1 });
L('n_cannabis', 'Diritti', 'Cannabis', 'D.L. Sicurezza 2025 (divieto della cannabis light)', 'soc', 0,
  'Vietata anche la cannabis light; il consumo personale resta illecito amministrativo.', [
  ['Divieto anche della cannabis light', 'Situazione attuale.', 6, 0, {}],
  ['Torna legale la cannabis light', 'Si salva una filiera da migliaia di posti di lavoro.', 0, -0.1, { conf: 1, occ: -0.01 }],
  ['Legalizzazione con monopolio di Stato', 'Coltivazione e vendita controllate, come il tabacco.', -7, -0.8, { pop: 0, chiesa: -6, mag: 2 }],
], { sal: 1 });
L('n_caccia', 'Ambiente', 'Caccia', 'L. 157/1992, modifiche 2025', 'amb', 0,
  'Calendario venatorio deciso dalle Regioni; nel 2025 allentati alcuni limiti.', [
  ['Regole del 2025', 'Situazione attuale.', 3, 0, {}],
  ['Stop alla caccia nei parchi e alle specie a rischio', 'Più tutela per la fauna selvatica.', -5, 0, { pop: 1, conf: -1 }],
  ['Più giorni e più specie cacciabili', 'Si allarga la stagione venatoria.', 7, 0, { pop: -1, conf: 1 }],
], { sal: 1 });
L('n_carne_coltivata', 'Agricoltura', 'Carne coltivata', 'L. 172/2023 (divieto)', 'amb', 0,
  'In Italia è vietato produrre e vendere carne coltivata in laboratorio.', [
  ['Divieto', 'Situazione attuale.', 5, 0, {}],
  ['Via libera alla ricerca, vendita solo con il via dell’UE', 'Si allinea l’Italia alle regole europee.', -3, 0, { ue: 3, conf: 1 }],
], { sal: 1 });

// ---------- giustizia, istituzioni, difesa ----------
L('n_carceri', 'Giustizia', 'Carceri sovraffollate', 'Piano carceri 2024', 'giu', 0,
  'Oltre 62.000 detenuti per 51.000 posti; un piano per nuovi padiglioni.', [
  ['Piano per nuovi padiglioni', 'Situazione attuale.', 0, 0, {}],
  ['Pene alternative per i reati minori', 'Domiciliari e lavori socialmente utili per chi ha meno di due anni da scontare.', 4, -0.2, { mag: 2, chiesa: 4, pop: -1 }],
  ['Venti nuove carceri in cinque anni', 'Un grande piano di edilizia penitenziaria.', -5, 1.2, { pop: 1, occ: -0.01 }],
  ['Indulto di due anni', 'Un provvedimento di clemenza per svuotare le celle.', 6, -0.3, { chiesa: 5, pop: -3, mag: -2 }],
], { sal: 1 });
L('n_fuorisede', 'Istituzioni', 'Voto dei fuorisede', 'Sperimentazione alle europee 2024', 'ist', 0,
  'Solo gli studenti fuorisede hanno potuto votare dove studiano, e solo alle europee.', [
  ['Sperimentazione solo per studenti', 'Situazione attuale.', 0, 0, {}],
  ['Voto dove vivi per tutti i fuorisede', 'Lavoratori e studenti votano senza tornare a casa.', -2, 0.05, { pop: 2 }],
  ['Voto elettronico da remoto', 'Si vota anche dal telefono, con l’identità digitale.', 3, 0.2, { pop: 1, media: 2 }],
], { sal: 1 });
L('n_terzo_mandato', 'Istituzioni', 'Terzo mandato dei presidenti di Regione', 'Limite di due mandati', 'ist', 0,
  'I presidenti di Regione non possono fare più di due mandati consecutivi.', [
  ['Massimo due mandati', 'Situazione attuale.', 0, 0, {}],
  ['Via libera al terzo mandato', 'Possono ricandidarsi i presidenti più popolari.', 4, 0, { pop: -1 }],
  ['Un solo mandato lungo di sei anni', 'Niente rielezione: più ricambio.', -3, 0, { pop: 1 }],
], { sal: 1 });
L('n_lobby', 'Istituzioni', 'Registro dei lobbisti', 'Nessuna legge nazionale', 'ist', 0,
  'Non esiste un registro nazionale obbligatorio dei rappresentanti di interessi.', [
  ['Nessuna regola nazionale', 'Situazione attuale.', 2, 0, {}],
  ['Registro obbligatorio e agende pubbliche', 'Ogni incontro con ministri e parlamentari va reso pubblico.', -5, 0.02, { pop: 2, media: 3, conf: -2 }],
], { sal: 1 });
L('n_leva', 'Difesa', 'Servizio militare volontario', 'Leva sospesa dal 2005', 'soc', 0,
  'Esercito professionale; la leva obbligatoria è sospesa.', [
  ['Esercito professionale', 'Situazione attuale.', 0, 0, {}],
  ['Riserva volontaria di 10.000 cittadini', 'Addestramento nei fine settimana per una riserva pronta alle emergenze.', 4, 0.4, { pop: 0, ue: 1 }],
  ['Servizio civile universale di sei mesi', 'Per tutti i diciottenni: protezione civile, sanità, cultura.', -3, 1.5, { pop: 1, chiesa: 3, occ: -0.02 }],
  ['Torna la leva obbligatoria', 'Dodici mesi per tutti i diciottenni.', 8, 3, { pop: -2, ue: -1 }],
], { sal: 1 });
L('n_cyber', 'Difesa', 'Difesa cibernetica', 'Agenzia per la cybersicurezza nazionale', 'eu', 0,
  'Un’agenzia nazionale coordina la difesa dagli attacchi informatici.', [
  ['Agenzia nazionale', 'Situazione attuale.', 0, 0, {}],
  ['Comando cyber e 5.000 specialisti', 'Una forza armata digitale con assunzioni straordinarie.', 2, 0.8, { ue: 2, occ: -0.01 }],
  ['Difesa cyber comune europea', 'Si mettono insieme le forze con gli altri Paesi UE.', -5, 0.4, { ue: 5 }],
], { sal: 1 });

// registra le nuove leggi
LAWS.slice(LEGGI2_START).forEach(l => { LAW_BY_ID[l.id] = l; });

// spiegazioni in parole semplici: [in pratica, chi ci guadagna, chi ci perde]
Object.assign(SPIEGA, {
  n_casa_giovani: { s: 'Per i giovani comprare casa è difficile: servono anticipo e garanzie che spesso non hanno.', o: [['Lo Stato fa da garante per gran parte del mutuo.', 'Giovani con reddito basso', 'Nessuno in particolare'], ['Mutuo senza anticipo e niente tasse sul rogito.', 'Giovani che comprano casa', 'Conti pubblici'], ['Lo Stato costruisce case da affittare a prezzi bassi.', 'Famiglie a basso reddito, edilizia', 'Conti pubblici'], ['Nessun aiuto pubblico: decidono le banche.', 'Conti pubblici', 'Giovani senza risparmi']] },
  n_affitti_brevi: { s: 'Gli affitti ai turisti rendono più di quelli lunghi e nelle città d’arte mancano case per chi ci vive.', o: [['Tassa piatta sugli affitti brevi e un codice per ogni casa.', 'Proprietari', 'Residenti dei centri storici'], ['I Comuni possono mettere un tetto agli appartamenti per turisti.', 'Residenti e studenti', 'Proprietari e piattaforme'], ['Chi ha più case paga di più.', 'Conti pubblici, residenti', 'Chi affitta molte case'], ['Nessun limite.', 'Proprietari e turismo', 'Chi cerca casa in affitto']] },
  n_acqua: { s: 'Gli acquedotti italiani perdono quasi metà dell’acqua: servono miliardi di lavori.', o: [['Gestori pubblici, misti o privati a seconda del territorio.', 'Nessuno in particolare', 'Nessuno in particolare'], ['Solo gestione pubblica e un grande piano contro le perdite.', 'Cittadini, lavoratori del settore', 'Conti pubblici'], ['Gestori scelti con gare europee.', 'Grandi aziende, efficienza', 'Chi teme aumenti delle bollette']] },
  n_ia: { s: 'L’intelligenza artificiale cambia economia e lavoro: si decide quanto investire e quanto regolare.', o: [['Regole di base e un miliardo per le imprese.', 'Imprese tecnologiche', 'Nessuno in particolare'], ['Cinque miliardi per supercalcolo, ricerca e startup.', 'Ricerca e imprese, crescita', 'Conti pubblici'], ['Regole severe e un’autorità indipendente.', 'Lavoratori, privacy', 'Aziende che usano l’IA'], ['Pochi vincoli per attirare investimenti.', 'Grandi aziende tecnologiche', 'Lavoratori e privacy']] },
  n_rete: { s: 'La fibra ottica è la strada del futuro: oggi ci sono due reti che a volte si sovrappongono.', o: [['Due reti in concorrenza.', 'Concorrenza', 'Le zone meno redditizie'], ['Una rete unica controllata dallo Stato.', 'Aree rurali, coperture complete', 'Conti pubblici, investitori privati'], ['Voucher alle famiglie per abbonarsi alla fibra.', 'Famiglie', 'Conti pubblici']] },
  n_contante: { s: 'Il tetto ai pagamenti in contanti serve a frenare evasione e riciclaggio, ma limita la libertà di pagare.', o: [['Contanti fino a 5.000 euro.', 'Chi preferisce il contante', 'Lotta all’evasione'], ['Contanti solo fino a 1.000 euro.', 'Lotta all’evasione', 'Anziani e piccoli negozi'], ['Nessun limite.', 'Chi usa contanti', 'Lotta all’evasione e al riciclaggio']] },
  n_bollo: { s: 'Il bollo auto è una delle tasse più odiate, ma finanzia le Regioni.', o: [['Si paga ogni anno alla propria Regione.', 'Bilanci delle Regioni', 'Automobilisti'], ['Nessun bollo: paga lo Stato al posto degli automobilisti.', 'Automobilisti', 'Conti pubblici'], ['Gratis per auto nuove ed elettriche, più caro per le vecchie.', 'Chi ha auto nuove, ambiente', 'Chi ha auto vecchie']] },
  n_auto_elettriche: { s: 'Le auto elettriche inquinano meno ma costano di più: gli incentivi abbassano il prezzo.', o: [['Incentivi a fasce di reddito.', 'Chi compra elettrico', 'Nessuno in particolare'], ['Incentivi forti e colonnine ovunque.', 'Ambiente, chi compra elettrico', 'Conti pubblici'], ['Niente incentivi, si difendono i motori tradizionali.', 'Conti pubblici, filiera dei motori', 'Ambiente']] },
  n_aree_idonee: { s: 'Per produrre energia pulita servono spazi per pannelli e pale: la difficoltà è dove metterli.', o: [['Niente pannelli nei campi, decidono le Regioni.', 'Agricoltura, paesaggio', 'Rinnovabili'], ['Procedure rapide nelle aree adatte.', 'Bollette più basse, clima', 'Chi teme per il paesaggio'], ['Stop ai nuovi impianti a terra.', 'Paesaggio', 'Rinnovabili, bollette']] },
  n_smart: { s: 'Il lavoro da casa fa risparmiare tempo e traffico, ma non tutte le aziende lo vogliono.', o: [['Si decide caso per caso con l’azienda.', 'Imprese', 'Chi vorrebbe lavorare da casa'], ['Diritto a due giorni a settimana da casa.', 'Lavoratori d’ufficio', 'Imprese e negozi dei centri'], ['Sgravi per chi concede il lavoro agile.', 'Lavoratori e imprese', 'Conti pubblici']] },
  n_settimana_corta: { s: 'Lavorare quattro giorni a parità di stipendio: alcune aziende lo provano già.', o: [['Ogni azienda decide da sola.', 'Imprese', 'Nessuno in particolare'], ['Incentivi a chi passa a quattro giorni.', 'Lavoratori', 'Conti pubblici, produttività'], ['Quattro giorni per legge negli uffici pubblici.', 'Dipendenti pubblici', 'Servizi ai cittadini']] },
  n_opzione_donna: { s: 'Opzione donna permette alle lavoratrici di andare in pensione prima con un assegno più basso.', o: [['Solo per alcune categorie di donne.', 'Conti pubblici', 'Lavoratrici escluse'], ['Per tutte le donne a 58 anni con 35 di contributi.', 'Lavoratrici', 'Conti pubblici'], ['Nessuna uscita anticipata dedicata.', 'Conti pubblici', 'Lavoratrici']] },
  n_av_sud: { s: 'L’alta velocità si ferma a Salerno: il Sud resta lontano dal resto del Paese.', o: [['Lavori a pezzi, quando ci sono i fondi.', 'Conti pubblici', 'Pendolari del Sud'], ['Si finanzia tutta la linea fino a Reggio e in Sicilia.', 'Sud, turismo, imprese', 'Conti pubblici'], ['Prima le opere dove passa più traffico.', 'Nord, logistica', 'Sud']] },
  n_porti_sud: { s: 'I porti del Sud potrebbero intercettare il traffico del Mediterraneo, ma sono frammentati.', o: [['Ogni porto con la sua autorità.', 'Territori', 'Efficienza'], ['Una società nazionale che investe al Sud.', 'Sud, lavoro', 'Conti pubblici'], ['Gestione affidata ai grandi operatori privati.', 'Investitori, efficienza', 'Lavoratori portuali']] },
  n_sport_scuola: { s: 'I ragazzi italiani fanno poco sport e molte palestre scolastiche cadono a pezzi.', o: [['Due ore a settimana.', 'Nessuno in particolare', 'Studenti sedentari'], ['Un’ora al giorno e palestre nuove.', 'Studenti, salute', 'Conti pubblici'], ['Lo sport lo fanno le associazioni del territorio.', 'Società sportive', 'Insegnanti di educazione fisica']] },
  n_cellulari: { s: 'Gli smartphone distraggono in classe: molti Paesi li hanno vietati.', o: [['Vietati durante le lezioni.', 'Concentrazione degli studenti', 'Nessuno in particolare'], ['Chiusi in armadietto per tutta la giornata.', 'Concentrazione, socialità', 'Libertà degli studenti'], ['Ogni scuola decide.', 'Autonomia delle scuole', 'Uniformità delle regole']] },
  n_stadi: { s: 'Gli stadi italiani sono tra i più vecchi d’Europa e nel 2032 arrivano gli Europei.', o: [['Un commissario accelera i progetti.', 'Club e città', 'Nessuno in particolare'], ['Soldi pubblici per gli stadi degli Europei.', 'Tifosi, città ospitanti', 'Conti pubblici'], ['Stadi privati in cambio di aree da edificare.', 'Club, costruttori', 'Consumo di suolo']] },
  n_canone: { s: 'Il canone finanzia la RAI: oggi si paga nella bolletta della luce.', o: [['Novanta euro l’anno in bolletta.', 'RAI', 'Famiglie'], ['Niente canone, paga lo Stato.', 'Famiglie', 'Conti pubblici, indipendenza RAI'], ['Si paga in base al reddito.', 'Redditi bassi', 'Redditi alti']] },
  n_medici_base: { s: 'In molte zone mancano medici di famiglia e gli studi chiudono presto.', o: [['Medici liberi professionisti convenzionati.', 'Medici', 'Pazienti delle zone scoperte'], ['Medici dipendenti nelle Case di comunità.', 'Pazienti, orari lunghi', 'Conti pubblici, autonomia dei medici'], ['Incentivi a chi apre dove mancano.', 'Piccoli centri', 'Conti pubblici']] },
  n_azzardo: { s: 'Il gioco d’azzardo porta soldi allo Stato ma crea dipendenze.', o: [['Pubblicità vietata.', 'Salute pubblica', 'Concessionari'], ['Via le slot dai bar e distanze dalle scuole.', 'Salute, famiglie', 'Entrate dello Stato, gestori'], ['Sponsor di scommesse nello sport.', 'Squadre di calcio', 'Salute pubblica']] },
  n_animali: { s: 'Gli animali sono tutelati come esseri senzienti: si decide quanto.', o: [['Pene più alte per i maltrattamenti.', 'Animali', 'Nessuno in particolare'], ['Tutela in Costituzione e stop alle gabbie.', 'Animali, ambientalisti', 'Allevatori'], ['Meno vincoli per allevatori e cacciatori.', 'Mondo agricolo', 'Animali']] },
  n_cannabis: { s: 'La cannabis divide: per alcuni è una droga da vietare, per altri un mercato da togliere alla criminalità.', o: [['Vietata anche quella senza effetti stupefacenti.', 'Chi vuole regole severe', 'Coltivatori e negozi di cannabis light'], ['Torna legale la cannabis light.', 'Agricoltori e commercianti', 'Chi vuole regole severe'], ['Legalizzazione con monopolio di Stato.', 'Entrate dello Stato, lotta alle mafie', 'Chi teme più consumo']] },
  n_caccia: { s: 'La caccia è regolata dalle Regioni con una legge nazionale degli anni ’90.', o: [['Regole del 2025.', 'Cacciatori', 'Ambientalisti'], ['Più parchi protetti e specie tutelate.', 'Fauna, ambiente', 'Cacciatori'], ['Stagione più lunga e più specie.', 'Cacciatori', 'Fauna selvatica']] },
  n_carne_coltivata: { s: 'La carne prodotta in laboratorio da cellule animali: l’Italia l’ha vietata.', o: [['Vietata.', 'Allevatori italiani', 'Ricerca'], ['Ricerca libera e vendita solo con l’ok europeo.', 'Ricerca, startup', 'Allevatori']] },
  n_carceri: { s: 'Le carceri italiane sono piene oltre la capienza: condizioni difficili e molti suicidi.', o: [['Si costruiscono nuovi padiglioni.', 'Polizia penitenziaria', 'Detenuti nel breve'], ['Pene alternative per i reati minori.', 'Detenuti, reinserimento', 'Chi chiede pene certe'], ['Venti nuove carceri.', 'Sicurezza percepita, edilizia', 'Conti pubblici'], ['Un indulto per liberare posti.', 'Detenuti', 'Vittime, sicurezza percepita']] },
  n_fuorisede: { s: 'Milioni di italiani vivono lontano da dove sono iscritti per votare.', o: [['Solo gli studenti, solo alle europee.', 'Nessuno in particolare', 'Lavoratori fuorisede'], ['Tutti i fuorisede votano dove vivono.', 'Partecipazione', 'Nessuno in particolare'], ['Voto dal telefono con l’identità digitale.', 'Partecipazione, giovani', 'Sicurezza del voto']] },
  n_terzo_mandato: { s: 'I presidenti di Regione possono fare al massimo due mandati: alcuni vorrebbero il terzo.', o: [['Due mandati e basta.', 'Ricambio', 'Presidenti popolari'], ['Possibile il terzo mandato.', 'Presidenti uscenti', 'Ricambio della classe politica'], ['Un solo mandato lungo.', 'Ricambio', 'Continuità']] },
  n_lobby: { s: 'Chi rappresenta interessi incontra ministri e parlamentari senza obblighi di trasparenza.', o: [['Nessuna regola nazionale.', 'Lobbisti', 'Trasparenza'], ['Registro obbligatorio e incontri pubblici.', 'Trasparenza, cittadini', 'Lobbisti']] },
  n_leva: { s: 'Dal 2005 la leva è sospesa: con le guerre vicine si discute di riserve e servizio civile.', o: [['Solo militari professionisti.', 'Libertà dei giovani', 'Riserve in caso di crisi'], ['Una riserva volontaria addestrata.', 'Difesa, protezione civile', 'Conti pubblici'], ['Sei mesi di servizio civile per tutti.', 'Comunità, protezione civile', 'Conti pubblici, giovani'], ['Dodici mesi di leva obbligatoria.', 'Difesa', 'Giovani, conti pubblici']] },
  n_cyber: { s: 'Gli attacchi informatici a ospedali, aziende e ministeri sono sempre più frequenti.', o: [['Un’agenzia nazionale coordina la difesa.', 'Sicurezza', 'Nessuno in particolare'], ['Un comando cyber con migliaia di specialisti.', 'Sicurezza, lavoro qualificato', 'Conti pubblici'], ['Difesa comune con gli altri Paesi europei.', 'Europa, sicurezza', 'Sovranità nazionale']] },
});
