// ============================================================
//  SPIEGAZIONI IN PAROLE SEMPLICI
//  s: di cosa si tratta · o[i]: [in pratica, chi ci guadagna, chi ci perde]
// ============================================================
const SPIEGA = {
  pens_vecchiaia: { s: 'Decide a che età si va in pensione per anzianità anagrafica. Oggi sono 67 anni e l’età sale piano piano perché si vive più a lungo.', o: [
    ['Si resta a 67 anni con piccoli aumenti nei prossimi anni.', 'I conti dell’INPS', 'Chi vorrebbe smettere prima'],
    ['L’età resta ferma a 67 anni per sempre, anche se l’aspettativa di vita cresce.', 'Chi è vicino alla pensione', 'I conti pubblici e i giovani che pagheranno'],
    ['Si può uscire a 64 anni, ma prendendo un assegno più basso.', 'Chi è stanco o ha lavori pesanti', 'Chi esce: prende meno ogni mese'],
    ['L’età sale subito di qualche mese, senza gradualità.', 'I conti pubblici', 'Chi sta per andare in pensione'],
    ['Tutti in pensione a 68 anni.', 'I conti pubblici e Bruxelles', 'Lavoratori anziani, sindacati'] ] },
  pens_anticipata: { s: 'Riguarda chi vuole andare in pensione prima dei 67 anni perché ha lavorato tanti anni (le famose «quote»).', o: [
    ['Serve quasi 43 anni di contributi per uscire prima.', 'I conti pubblici', 'Chi ha iniziato a lavorare giovane'],
    ['Dopo 41 anni di lavoro puoi andare in pensione a qualsiasi età.', 'Chi ha iniziato a lavorare presto (operai, artigiani)', 'I conti pubblici: costa 5 miliardi l’anno'],
    ['Si esce a 62 anni con 38 anni di contributi.', 'Lavoratori sessantenni', 'I conti pubblici e i giovani'],
    ['Si esce a 64 anni ma con l’assegno calcolato solo sui contributi versati.', 'Chi vuole libertà di scelta', 'Chi esce: assegno più basso'],
    ['Niente più uscite anticipate: tutti a 67 anni.', 'I conti pubblici', 'Chi ha cominciato a lavorare a 18-20 anni'] ] },
  pens_minime: { s: 'Le pensioni minime sono quelle di chi ha versato pochi contributi: lo Stato le integra fino a una soglia, oggi circa 620€ al mese.', o: [
    ['Le minime restano intorno ai 620€.', 'I conti pubblici', 'Due milioni di pensionati poveri'],
    ['Ogni pensionato al minimo prende circa 80€ in più al mese.', 'Pensionati poveri, soprattutto donne e Sud', 'I conti: 2,5 miliardi l’anno'],
    ['Tutte le pensioni minime salgono a 1.000€ al mese.', 'Pensionati poveri', 'I conti: 9 miliardi l’anno, Bruxelles protesta'],
    ['Le pensioni più alte (oltre 6.000€) crescono meno per pagare le minime.', 'Pensionati poveri', 'Le pensioni d’oro, con rischio ricorsi'] ] },
  pens_giovani: { s: 'Chi oggi ha 30-40 anni avrà una pensione calcolata solo sui contributi versati: con lavori precari rischia di prendere pochissimo.', o: [
    ['Nessuna garanzia: conta solo quanto hai versato.', 'I conti futuri', 'I giovani precari'],
    ['Uno Stato garantisce un assegno minimo a chi ha lavorato molti anni anche con contratti saltuari.', 'Giovani precari di oggi', 'I conti tra trent’anni'],
    ['Gli anni di studio, formazione e maternità valgono come contributi.', 'Laureati, madri, chi si forma', 'I conti futuri (poco)'] ] },
  lav_salmin: { s: 'Il salario minimo è la paga oraria sotto la quale nessun datore di lavoro può scendere. In Italia non c’è per legge: valgono i contratti nazionali.', o: [
    ['Si prende come riferimento la paga dei contratti nazionali più diffusi.', 'Le imprese e i sindacati più grandi', 'Chi ha contratti “pirata” da pochi euro'],
    ['Nessuno può essere pagato meno di 9€ lordi l’ora.', 'Circa 3 milioni di lavoratori poveri', 'Piccole imprese con margini bassi'],
    ['Paga minima di 10€ l’ora per tutti.', 'Lavoratori poveri', 'Piccole imprese: rischio meno assunzioni'],
    ['Lo Stato non interviene: decidono imprese e sindacati.', 'Le imprese', 'Chi ha paghe molto basse'] ] },
  lav_licenz: { s: 'Stabilisce cosa succede se un’azienda licenzia qualcuno senza un motivo valido: reintegro nel posto o solo un risarcimento in denaro.', o: [
    ['Chi è licenziato ingiustamente riceve soldi, ma raramente torna al suo posto.', 'Le imprese', 'Lavoratori più esposti'],
    ['Il giudice può ordinare di riassumere il lavoratore licenziato ingiustamente.', 'Lavoratori a tempo indeterminato', 'Imprese, investitori stranieri'],
    ['Più soldi a chi viene licenziato senza motivo, anche nelle piccole aziende.', 'Lavoratori delle piccole imprese', 'Piccole imprese'],
    ['Risarcimento fisso e prevedibile, meno cause in tribunale.', 'Imprese', 'Lavoratori licenziati'] ] },
  lav_termine: { s: 'Regola i contratti “a scadenza”: per quanto tempo e con quali motivi un’azienda può assumere solo per qualche mese.', o: [
    ['Fino a un anno senza dover spiegare il motivo.', 'Imprese che cercano flessibilità', 'Precari che restano tali'],
    ['Dopo un anno serve un motivo preciso e i rinnovi costano di più.', 'Precari: più spinta alla stabilizzazione', 'Imprese stagionali'],
    ['Contratti a termine fino a tre anni senza motivo.', 'Imprese', 'Giovani precari'],
    ['Chi usa troppi contratti brevi paga più contributi.', 'Lavoratori stabilizzati', 'Imprese che vivono di stagionali'] ] },
  lav_rdc: { s: 'Sono gli aiuti economici a chi è in povertà. Dal 2024 il Reddito di cittadinanza è stato sostituito da un assegno più ristretto.', o: [
    ['Aiuto solo a famiglie con minori, anziani o disabili.', 'I conti pubblici', 'Poveri “occupabili” senza lavoro'],
    ['Torna un sussidio per tutti i poveri, con l’obbligo di cercare lavoro.', 'Famiglie povere, soprattutto al Sud', 'I conti: 4 miliardi l’anno'],
    ['Un reddito minimo garantito per chiunque sia sotto la soglia di povertà.', 'Tutte le persone povere', 'I conti: 8 miliardi l’anno'],
    ['Meno sussidi e più soldi per corsi e centri per l’impiego.', 'I conti, chi trova lavoro', 'Famiglie in difficoltà'] ] },
  lav_cuneo: { s: 'Il “cuneo fiscale” è la differenza tra quanto costa un dipendente all’azienda e quanto gli arriva in busta paga. Tagliarlo vuol dire stipendi netti più alti.', o: [
    ['Resta lo sconto per i redditi fino a 40.000€.', 'Lavoratori dipendenti', '—'],
    ['Lo sconto arriva anche a chi guadagna fino a 50.000€.', 'Ceto medio dipendente', 'I conti: 3 miliardi'],
    ['Lo sconto va alle aziende, che pagano meno contributi per ogni dipendente.', 'Imprese che assumono', 'I conti: 5 miliardi'],
    ['Lo sconto finisce: buste paga più leggere.', 'I conti pubblici', '14 milioni di lavoratori'] ] },
  lav_settimana: { s: 'La settimana corta: lavorare 4 giorni invece di 5, a parità di stipendio.', o: [
    ['Ogni azienda decide da sola.', 'Imprese', '—'],
    ['Sconti fiscali alle aziende che provano i 4 giorni.', 'Lavoratori delle aziende che aderiscono', 'I conti (poco)'],
    ['Per legge l’orario scende a 32 ore a settimana.', 'Lavoratori', 'Imprese: più costi e meno produzione'] ] },
  lav_sicurezza: { s: 'Le regole per non morire o ferirsi sul lavoro. In Italia muoiono circa mille persone l’anno sul lavoro.', o: [
    ['Valgono le regole attuali.', '—', 'Chi lavora nei cantieri a rischio'],
    ['Nuovo reato per chi causa morti sul lavoro e molti più controlli.', 'Lavoratori, famiglie delle vittime', 'Imprese che risparmiano sulla sicurezza'],
    ['Meno carte e adempimenti per le piccole imprese.', 'Piccole imprese', 'Rischio meno sicurezza'] ] },
  fis_irpef: { s: 'L’IRPEF è l’imposta sul reddito che paga chiunque lavori o abbia una pensione. Le aliquote sono le percentuali che si pagano a seconda di quanto si guadagna.', o: [
    ['Si paga il 23%, il 33% o il 43% a seconda del reddito.', '—', '—'],
    ['Tutti pagano il 15%, ricchi e poveri.', 'Redditi alti e medio-alti', 'I conti: mancano 50 miliardi, servono tagli a sanità e servizi'],
    ['Paghi il 15% solo sulla parte di reddito che cresce rispetto agli anni prima.', 'Chi aumenta i guadagni', 'I conti (poco)'],
    ['Chi guadagna tra 28.000 e 60.000€ paga meno tasse.', 'Ceto medio', 'I conti: 6 miliardi'],
    ['I redditi bassi pagano meno, quelli sopra i 100.000€ di più.', 'Redditi bassi', 'Redditi alti'] ] },
  fis_forf: { s: 'Le partite IVA con ricavi bassi pagano una tassa fissa del 15% invece dell’IRPEF normale.', o: [
    ['Tassa al 15% fino a 85.000€ di ricavi.', 'Autonomi e professionisti', 'Dipendenti con lo stesso reddito, che pagano di più'],
    ['Il 15% vale fino a 100.000€.', 'Autonomi più grandi', 'I conti, equità coi dipendenti'],
    ['Il 15% vale solo fino a 50.000€.', 'Equità coi dipendenti', 'Autonomi tra 50 e 85.000€'],
    ['Niente più tassa agevolata: tutti all’IRPEF.', 'I conti, i dipendenti', '1,9 milioni di partite IVA'] ] },
  fis_patrimoniale: { s: 'Una patrimoniale è una tassa su ciò che si possiede (case, conti, azioni), non su quanto si guadagna.', o: [
    ['Nessuna tassa generale sulla ricchezza.', 'Chi ha grandi patrimoni', '—'],
    ['Chi possiede più di 5 milioni paga ogni anno 1,5-2%.', 'I conti: 6 miliardi in più', 'I più ricchi (circa 50.000 persone), rischio fughe all’estero'],
    ['Si paga di più quando si ereditano più di 1 milione.', 'I conti', 'Grandi eredità'],
    ['Niente più IMU sulle seconde case.', 'Proprietari di seconde case', 'I comuni e i conti: 10 miliardi'] ] },
  fis_contanti: { s: 'Il limite massimo che si può pagare in contanti. Più è basso, più è difficile evadere le tasse, ma meno libertà.', o: [
    ['Si può pagare in contanti fino a 5.000€.', 'Chi usa il contante', 'Lotta all’evasione'],
    ['Contanti solo fino a 1.000€.', 'Lotta all’evasione e al riciclaggio', 'Anziani e piccoli negozi'],
    ['Contanti fino a 10.000€.', 'Chi usa il contante', 'Lotta all’evasione'] ] },
  fis_condoni: { s: 'Rottamazioni e condoni permettono a chi ha debiti col fisco di pagare meno o a rate lunghe.', o: [
    ['Chi ha cartelle può pagarle a rate fino a 9 anni senza sanzioni.', 'Chi ha debiti col fisco', 'Chi le tasse le paga puntuale'],
    ['Basta condoni: chi deve, paga tutto.', 'Contribuenti onesti, i conti a lungo termine', 'Chi ha debiti fiscali'],
    ['Cancellate le cartelle piccole e sconti enormi sulle altre.', 'Chi ha debiti fiscali', 'Contribuenti onesti, i conti'],
    ['Una rottamazione sempre aperta.', 'Chi ha debiti fiscali', 'Il principio di pagare le tasse'] ] },
  fis_banche: { s: 'Una tassa sui guadagni “extra” delle banche, che negli ultimi anni hanno guadagnato molto grazie ai tassi alti.', o: [
    ['Le banche pagano un contributo concordato col governo.', 'Equilibrio', '—'],
    ['Le banche pagano il 40% sui guadagni extra.', 'I conti: 4 miliardi', 'Banche e azionisti; rischio meno prestiti'],
    ['Nessun contributo dalle banche.', 'Banche', 'I conti'] ] },
  fis_rendite: { s: 'La tassa su interessi, dividendi e guadagni da investimenti. I titoli di Stato hanno uno sconto.', o: [
    ['Si paga il 26%, i titoli di Stato il 12,5%.', '—', '—'],
    ['Si paga il 30% (titoli di Stato esclusi).', 'I conti', 'Risparmiatori e investitori'],
    ['Si paga il 20%.', 'Risparmiatori e investitori', 'I conti'] ] },
  fis_edilizi: { s: 'Gli sconti fiscali per chi ristruttura casa. Il Superbonus 110% è costato oltre 100 miliardi.', o: [
    ['Detrazione del 50% sulla prima casa, 36% sulle altre.', 'Proprietari che ristrutturano', '—'],
    ['Sconto del 65% per lavori che fanno risparmiare energia.', 'Edilizia, ambiente, bollette', 'I conti: 4 miliardi'],
    ['Torna il Superbonus: lavori gratis, paga lo Stato.', 'Edilizia, proprietari di casa', 'I conti: 20 miliardi l’anno'],
    ['Nessuno sconto per le ristrutturazioni.', 'I conti', 'Imprese edili, proprietari'] ] },
  fis_accise: { s: 'Le accise sono le tasse fisse su benzina e gasolio: valgono più di metà del prezzo alla pompa.', o: [
    ['Piano piano diesel e benzina pagano la stessa tassa.', 'Ambiente', 'Chi ha un’auto diesel'],
    ['Benzina e gasolio costano 20 centesimi in meno.', 'Automobilisti, autotrasporto', 'I conti: 8 miliardi'],
    ['Se il prezzo sale, le accise scendono automaticamente.', 'Automobilisti', 'I conti (poco)'],
    ['Accise più alte per finanziare treni e bus.', 'Pendolari, ambiente', 'Automobilisti'] ] },
  fis_sugar: { s: 'Due tasse “di scopo”: una sulle bibite zuccherate, una sulla plastica usa e getta. Sono state approvate nel 2019 ma mai applicate.', o: [
    ['Restano rinviate.', 'Industria alimentare e della plastica', '—'],
    ['Le due tasse entrano in vigore.', 'Salute, ambiente, i conti', 'Industria, consumatori'],
    ['Vengono cancellate per sempre.', 'Industria', 'Salute e ambiente'] ] },
  fis_evasione: { s: 'Gli strumenti per scoprire chi non paga le tasse. In Italia l’evasione vale circa 80 miliardi l’anno.', o: [
    ['Fatture elettroniche e accordi con gli autonomi.', '—', '—'],
    ['Il fisco incrocia conti correnti e spese per scovare chi evade.', 'I conti, chi paga già tutto', 'Chi evade; dubbi sulla privacy'],
    ['Rimborsi a chi paga con carta e bancomat.', 'Consumatori', 'I conti (all’inizio)'] ] },
  fam_assegno: { s: 'L’assegno unico è il contributo mensile che lo Stato dà alle famiglie per ogni figlio, più alto per chi ha meno reddito.', o: [
    ['Fino a circa 200€ al mese per figlio.', 'Famiglie con figli', '—'],
    ['Assegno più alto dal terzo figlio in su.', 'Famiglie numerose', 'I conti: 3 miliardi'],
    ['Le tasse si calcolano dividendo il reddito per i membri della famiglia.', 'Famiglie numerose e monoreddito', 'I conti: 6 miliardi; single'],
    ['Meno soldi a chi ha un ISEE alto.', 'I conti, famiglie povere', 'Famiglie benestanti'] ] },
  fam_congedi: { s: 'I giorni a casa pagati per i genitori quando nasce un figlio.', o: [
    ['I padri hanno 10 giorni obbligatori.', '—', 'Madri, che restano le uniche a casa'],
    ['Madri e padri hanno 3 mesi ciascuno, non cedibili.', 'Parità tra madri e padri, natalità', 'Imprese, i conti'],
    ['Durante il congedo facoltativo si prende l’80% dello stipendio.', 'Neo-genitori', 'I conti: 2 miliardi'] ] },
  fam_nidi: { s: 'Gli asili nido per i bambini da 0 a 3 anni: in Italia mancano posti, soprattutto al Sud.', o: [
    ['Bonus fino a 3.600€ l’anno per la retta.', 'Famiglie che trovano posto', 'Chi non trova posto'],
    ['Asilo nido gratis per tutti.', 'Famiglie giovani, madri che lavorano', 'I conti: 3 miliardi'],
    ['200.000 nuovi posti, prima al Sud.', 'Famiglie del Sud, lavoro femminile', 'I conti: 1,5 miliardi'] ] },
  casa: { s: 'Le politiche per chi non riesce a pagare affitto o mutuo, mentre gli affitti nelle città crescono.', o: [
    ['Pochi fondi e piano casa in partenza.', '—', 'Giovani e famiglie in affitto'],
    ['Lo Stato costruisce 100.000 case popolari.', 'Famiglie povere, giovani', 'I conti: 2,5 miliardi'],
    ['Sconti fiscali a chi affitta a prezzi concordati.', 'Proprietari e inquilini', 'I conti (poco)'],
    ['Limiti agli affitti turistici nei centri storici.', 'Residenti e studenti', 'Proprietari e turismo'] ] },
  san_fondo: { s: 'Quanti soldi lo Stato mette nella sanità pubblica: medici, infermieri, ospedali.', o: [
    ['Circa 143 miliardi l’anno.', '—', 'Pazienti in lista d’attesa'],
    ['15 miliardi in più: assunzioni e liste d’attesa più corte.', 'Pazienti, medici e infermieri', 'I conti: serve trovare 15 miliardi'],
    ['5 miliardi in più per assumere personale.', 'Pazienti, personale sanitario', 'I conti'],
    ['Più spazio a cliniche private e assicurazioni.', 'Sanità privata, chi può pagare', 'Chi non può pagare'] ] },
  san_liste: { s: 'Come ridurre i tempi d’attesa per visite ed esami nella sanità pubblica.', o: [
    ['Prenotazioni centralizzate e visite anche la sera.', '—', 'Chi aspetta mesi'],
    ['Se l’ospedale sfora i tempi, il medico non può fare visite private a pagamento.', 'Pazienti', 'Medici che lavorano anche privatamente'],
    ['Se l’ASL sfora i tempi, vai dal privato e lo Stato rimborsa.', 'Pazienti', 'I conti: 2 miliardi'] ] },
  san_medicina: { s: 'Come si entra alla facoltà di Medicina.', o: [
    ['Primo semestre aperto a tutti, poi graduatoria.', '—', '—'],
    ['Test d’ingresso prima di iscriversi.', 'Università', 'Aspiranti medici'],
    ['Tutti possono iscriversi.', 'Aspiranti medici', 'Università affollate, i conti'] ] },
  san_vaccini: { s: 'L’obbligo di fare i vaccini ai bambini per andare all’asilo e a scuola.', o: [
    ['Dieci vaccini obbligatori.', 'Salute pubblica', 'Famiglie contrarie ai vaccini'],
    ['I vaccini diventano solo consigliati.', 'Libertà di scelta', 'Rischio epidemie (morbillo)'],
    ['Più vaccini obbligatori, anche per adulti.', 'Salute pubblica', 'Libertà individuale'] ] },
  fine_vita: { s: 'Riguarda la possibilità per un malato grave e senza speranza di decidere di morire con l’aiuto di un medico.', o: [
    ['Nessuna legge: decide caso per caso la Corte costituzionale.', '—', 'Malati che devono andare in Svizzera'],
    ['Il malato terminale può chiedere il suicidio assistito nel servizio pubblico.', 'Malati gravi e famiglie', 'Mondo cattolico contrario'],
    ['Requisiti strettissimi e niente servizio pubblico.', 'Mondo cattolico', 'Malati gravi'],
    ['Anche il medico può somministrare il farmaco, come in Belgio.', 'Chi chiede piena libertà', 'Mondo cattolico, medici obiettori'] ] },
  aborto: { s: 'La legge 194 del 1978 permette di interrompere la gravidanza entro 90 giorni in ospedale pubblico.', o: [
    ['Legge 194, ma molti medici rifiutano per motivi di coscienza.', '—', 'Donne in regioni con pochi medici disponibili'],
    ['In ogni ospedale devono esserci medici disponibili.', 'Donne', 'Medici obiettori, mondo cattolico'],
    ['Più ostacoli e colloqui obbligatori.', 'Movimenti pro-vita', 'Donne'] ] },
  unioni: { s: 'Come lo Stato riconosce le coppie dello stesso sesso.', o: [
    ['Possono fare l’unione civile, non il matrimonio.', '—', 'Coppie omosessuali che vogliono sposarsi'],
    ['Matrimonio per tutte le coppie.', 'Coppie omosessuali', 'Chi difende il matrimonio tradizionale'],
    ['Si cancellano le unioni civili.', 'Tradizionalisti', 'Coppie omosessuali, diritti acquisiti'] ] },
  figli_coppie: { s: 'Riguarda i figli delle coppie dello stesso sesso e la maternità surrogata (utero in affitto).', o: [
    ['La surrogata è reato anche all’estero; i figli si riconoscono solo col giudice.', 'Chi difende la famiglia tradizionale', 'Figli di coppie omosessuali'],
    ['Entrambi i genitori registrati alla nascita.', 'Figli di coppie omosessuali', 'Tradizionalisti'],
    ['Possono adottare anche single e coppie omosessuali.', 'Bambini in attesa di adozione, coppie', 'Tradizionalisti'],
    ['Non è più reato fare la surrogata all’estero.', 'Coppie che la scelgono', 'Chi la considera sfruttamento della donna'] ] },
  omotransfobia: { s: 'Una pena più alta per chi aggredisce o discrimina qualcuno perché omosessuale o transgender.', o: [
    ['Nessuna aggravante specifica.', '—', 'Persone LGBT'],
    ['Pena aumentata per le aggressioni omotransfobiche.', 'Persone LGBT', 'Chi teme limiti alla libertà di parola'] ] },
  cannabis: { s: 'Le regole sull’uso della cannabis: oggi è illegale anche quella “light” senza effetto drogante.', o: [
    ['Tutto vietato, anche la cannabis light.', 'Chi vuole tolleranza zero', 'Mille aziende agricole della canapa'],
    ['Torna legale la cannabis light senza THC.', 'Aziende agricole e negozi', '—'],
    ['Si possono coltivare 4 piante a casa.', 'Consumatori, tribunali meno intasati', 'Chi teme più consumo'],
    ['Lo Stato vende la cannabis come il tabacco.', 'Le casse dello Stato, lotta alle mafie', 'Mondo cattolico, chi teme più consumo'] ] },
  cittadinanza: { s: 'Come uno straniero o un figlio di stranieri diventa cittadino italiano.', o: [
    ['Servono 10 anni di residenza; i figli nati qui aspettano i 18 anni.', '—', 'Un milione di ragazzi nati o cresciuti in Italia'],
    ['Chi finisce un ciclo di scuola in Italia diventa italiano.', 'Ragazzi cresciuti in Italia', 'Chi vuole regole severe'],
    ['Chi nasce in Italia da genitori residenti da 5 anni è italiano.', 'Bambini nati in Italia', 'Chi vuole regole severe'],
    ['Bastano 5 anni di residenza.', 'Stranieri che vivono qui', 'Chi vuole regole severe'],
    ['Servono 15 anni e un esame di lingua e cultura.', 'Chi vuole regole severe', 'Stranieri integrati'] ] },
  voto_fuorisede: { s: 'La possibilità di votare dalla città dove si studia o lavora, senza tornare nel comune di residenza.', o: [
    ['Solo sperimentazioni per studenti.', '—', '5 milioni di fuorisede'],
    ['Tutti i fuorisede votano dove vivono.', 'Studenti e lavoratori fuori sede', 'Costi organizzativi'] ] },
  imm_flussi: { s: 'Quanti lavoratori stranieri possono entrare legalmente ogni anno per lavorare.', o: [
    ['Circa 500.000 in tre anni.', '—', '—'],
    ['Il doppio dei lavoratori stranieri.', 'Imprese che non trovano personale', 'Chi vuole meno immigrazione'],
    ['Solo 100.000 in tre anni.', 'Chi vuole meno immigrazione', 'Agricoltura, edilizia, assistenza agli anziani'] ] },
  imm_accoglienza: { s: 'Come si accolgono i migranti arrivati irregolarmente e come si rimpatriano quelli senza diritto a restare.', o: [
    ['Regole severe e centri di rimpatrio in Albania.', 'Chi vuole fermezza', 'Migranti, ONG'],
    ['Si chiudono i centri in Albania e i migranti vanno nei comuni.', 'Migranti, i conti (Albania costa)', 'Chi vuole fermezza'],
    ['Si può entrare per cercare lavoro, niente più reato di clandestinità.', 'Migranti, imprese', 'Chi vuole meno immigrazione'],
    ['La Marina blocca i barconi davanti alla Libia.', 'Chi vuole fermare gli sbarchi', 'Migranti; rischio condanne internazionali'] ] },
  imm_ong: { s: 'Le regole per le navi delle organizzazioni umanitarie che salvano i migranti in mare.', o: [
    ['Le ONG devono sbarcare in porti lontani dopo un solo salvataggio.', 'Chi vuole fermezza', 'ONG, migranti'],
    ['Lo Stato e l’Europa organizzano i soccorsi.', 'Migranti in pericolo', 'Chi teme l’effetto richiamo'],
    ['Navi ONG sequestrate alla prima violazione.', 'Chi vuole fermezza', 'ONG, migranti'] ] },
  giu_separazione: { s: 'Separare la carriera dei giudici (che decidono) da quella dei pubblici ministeri (che accusano). I cittadini l’hanno bocciata al referendum nel 2026.', o: [
    ['Giudici e pm restano nella stessa carriera.', 'Magistratura', 'Chi vuole un giudice più terzo'],
    ['Si riprova a separare le carriere.', 'Avvocati, garantisti', 'Magistratura; rischio nuovo referendum perso'] ] },
  giu_abuso: { s: 'L’abuso d’ufficio era il reato per i pubblici ufficiali che favoriscono qualcuno violando le regole. È stato abolito nel 2024.', o: [
    ['Il reato non esiste più.', 'Sindaci che temevano denunce', 'Lotta alla corruzione'],
    ['Torna, ma solo per i favoritismi voluti.', 'Lotta alla corruzione', 'Amministratori pubblici'] ] },
  giu_intercettazioni: { s: 'Quando e quanto a lungo la polizia può ascoltare le telefonate di un sospettato.', o: [
    ['Massimo 45 giorni, salvo reati gravi.', 'Privacy', 'Indagini sulla corruzione'],
    ['Intercettazioni senza limiti di tempo contro la corruzione.', 'Indagini, magistratura', 'Privacy degli indagati'],
    ['Ancora più limiti e niente trojan nei telefoni.', 'Privacy, politici indagati', 'Indagini'] ] },
  giu_prescrizione: { s: 'Dopo quanto tempo un reato non è più punibile perché il processo è durato troppo.', o: [
    ['Il tempo si ferma un po’ dopo ogni condanna.', '—', '—'],
    ['Dopo la condanna in primo grado il tempo non scorre più.', 'Vittime, magistratura', 'Imputati: processi senza fine'],
    ['Tempi più brevi per chiudere i processi.', 'Imputati', 'Vittime: molti reati restano impuniti'] ] },
  giu_carceri: { s: 'Le carceri italiane sono piene al 130%: più detenuti che posti.', o: [
    ['Si costruiscono pian piano nuovi posti.', '—', 'Detenuti e agenti, sovraffollamento'],
    ['Sconti di pena e reati cancellati per svuotare le carceri.', 'Detenuti', 'Chi chiede certezza della pena; serve il voto di due terzi'],
    ['Pene brevi scontate fuori dal carcere.', 'Detenuti, carceri meno piene', 'Chi chiede certezza della pena'],
    ['10.000 nuovi posti in carcere in 5 anni.', 'Chi chiede certezza della pena', 'I conti: 1,5 miliardi'] ] },
  giu_tempi: { s: 'In Italia una causa civile può durare anni: questo frena le imprese e scoraggia gli investimenti.', o: [
    ['Riforma Cartabia in corso.', '—', 'Chi aspetta una sentenza'],
    ['10.000 assunzioni nei tribunali.', 'Cittadini e imprese in causa', 'I conti: 1 miliardo'] ] },
  sicurezza: { s: 'Le regole su ordine pubblico, occupazioni di case e proteste di piazza.', o: [
    ['Nuovi reati per chi occupa case o blocca le strade.', 'Chi chiede ordine', 'Manifestanti, sindacati'],
    ['Bloccare una strada torna una multa, non un reato.', 'Diritto di protesta', 'Chi chiede ordine'],
    ['10.000 agenti e militari in più nelle città.', 'Chi si sente insicuro', 'I conti: 1 miliardo'] ] },
  legittima_difesa: { s: 'Quando chi si difende da un ladro in casa può farlo senza essere punito.', o: [
    ['La difesa in casa è sempre legittima.', 'Chi si difende in casa', 'Rischio eccessi'],
    ['Il giudice valuta se la reazione era proporzionata.', 'Controllo sugli eccessi', 'Chi si difende'] ] },
  femminicidio: { s: 'Le misure contro la violenza sulle donne: ogni anno in Italia oltre cento donne vengono uccise da partner o ex.', o: [
    ['Reato di femminicidio con ergastolo.', '—', '—'],
    ['Lezioni obbligatorie su rispetto e consenso a scuola.', 'Prevenzione tra i giovani', 'Chi vuole che decidano le famiglie'],
    ['Più soldi ai centri antiviolenza e braccialetti elettronici.', 'Donne a rischio', 'I conti (poco)'] ] },
  premierato: { s: 'Cambiare la Costituzione per eleggere direttamente il capo del governo, come si fa coi sindaci.', o: [
    ['Il premier lo sceglie il Parlamento.', 'Equilibrio dei poteri', 'Stabilità: tanti governi brevi'],
    ['I cittadini eleggono direttamente il premier.', 'Stabilità, chi vince', 'Ruolo del Presidente della Repubblica'],
    ['Il governo cade solo se c’è già una nuova maggioranza pronta.', 'Stabilità', 'Poco: è un compromesso'],
    ['I cittadini eleggono direttamente il Presidente della Repubblica.', 'Chi vuole un capo forte', 'Equilibrio dei poteri'] ] },
  legge_elettorale: { s: 'Le regole che trasformano i voti in seggi in Parlamento.', o: [
    ['Proporzionale con un premio a chi supera il 42%.', 'Le coalizioni grandi', 'I partiti piccoli'],
    ['Un terzo dei seggi a chi vince nei collegi, liste bloccate.', 'Le coalizioni', 'Libertà degli elettori di scegliere i candidati'],
    ['Ogni partito prende seggi in proporzione ai voti.', 'Partiti piccoli e medi', 'La stabilità dei governi'],
    ['Collegi con ballottaggio, come in Francia.', 'Partiti grandi, stabilità', 'Partiti piccoli'] ] },
  autonomia: { s: 'Dare alle Regioni più ricche più poteri e più soldi su scuola, sanità, ambiente e altro.', o: [
    ['La legge c’è, ma le intese sono ferme.', '—', '—'],
    ['Veneto, Lombardia, Piemonte e Liguria gestiscono da sole più materie.', 'Regioni del Nord', 'Regioni del Sud, che temono meno risorse'],
    ['Prima si garantiscono gli stessi servizi minimi ovunque.', 'Regioni del Sud', 'I conti: 3 miliardi'],
    ['Si cancella la legge sull’autonomia.', 'Unità nazionale, Sud', 'Regioni del Nord'] ] },
  terzo_mandato: { s: 'Quante volte di fila si può essere eletti presidente di Regione o sindaco.', o: [
    ['Due mandati per i presidenti di Regione.', 'Ricambio', 'Presidenti molto popolari'],
    ['Si può fare un terzo mandato.', 'Presidenti in carica', 'Ricambio politico'],
    ['Massimo due mandati anche per i sindaci.', 'Ricambio', 'Sindaci dei piccoli comuni'] ] },
  province: { s: 'Le Province oggi esistono ancora ma i loro vertici sono eletti dai sindaci, non dai cittadini.', o: [
    ['Elezione indiretta, pochi poteri.', 'I conti', 'Strade e scuole provinciali trascurate'],
    ['I cittadini tornano a votare per le Province.', 'Territori, strade e scuole', 'I conti, più poltrone'] ] },
  fin_partiti: { s: 'Come si finanziano i partiti. Dal 2014 non ricevono più soldi pubblici diretti.', o: [
    ['Solo il 2 per mille volontario e le donazioni.', 'I conti', 'Partiti senza grandi donatori'],
    ['Lo Stato rimborsa i partiti in base ai voti.', 'Partiti piccoli, indipendenza dai ricchi', 'Molto impopolare'],
    ['Massimo 50.000€ da ogni donatore.', 'Trasparenza', 'Partiti con grandi donatori'] ] },
  rai: { s: 'Chi sceglie i vertici della televisione pubblica. Oggi li indica il governo.', o: [
    ['Il governo nomina l’amministratore delegato.', 'Il governo di turno', 'Indipendenza dell’informazione'],
    ['Una fondazione indipendente come la BBC.', 'Pluralismo', 'I partiti, che perdono influenza'],
    ['Si vende una rete a un privato.', 'I conti, il mercato', 'Servizio pubblico'] ] },
  canone: { s: 'La tassa per la televisione pubblica, che si paga nella bolletta della luce.', o: [
    ['90€ l’anno in bolletta.', 'La RAI', 'Famiglie'],
    ['Il canone viene abolito.', 'Famiglie: 90€ in meno', 'La RAI e i conti: 1,8 miliardi'],
    ['Si paga in base al reddito.', 'Famiglie povere', 'Redditi alti'] ] },
  scu_obbligo: { s: 'Fino a che età è obbligatorio andare a scuola.', o: [
    ['Obbligo fino a 16 anni.', '—', 'Ragazzi che abbandonano presto'],
    ['Obbligo fino a 18 anni.', 'Giovani: meno abbandoni', 'I conti: 1,5 miliardi'],
    ['Diploma tecnico in 4 anni più 2 di specializzazione.', 'Imprese che cercano tecnici', 'Chi teme una scuola troppo “aziendale”'] ] },
  scu_stipendi: { s: 'Quanto guadagnano gli insegnanti: tra i meno pagati dell’Europa occidentale.', o: [
    ['1.600-2.100€ netti al mese.', '—', 'Insegnanti'],
    ['Stipendi più alti del 20% in tre anni.', '900.000 insegnanti', 'I conti: 6 miliardi'],
    ['Aumenti solo a chi si forma ed è valutato bene.', 'Insegnanti più attivi', 'Sindacati, chi teme valutazioni arbitrarie'] ] },
  scu_paritarie: { s: 'Le scuole paritarie sono private (spesso cattoliche) ma riconosciute dallo Stato.', o: [
    ['Pochi fondi pubblici alle paritarie.', '—', '—'],
    ['Le famiglie ricevono un buono da spendere anche nelle paritarie.', 'Scuole paritarie, famiglie cattoliche', 'Scuola statale'],
    ['Nessun euro pubblico alle paritarie.', 'Scuola statale', 'Scuole paritarie'] ] },
  scu_condotta: { s: 'Le regole su voto in condotta e cellulari a scuola.', o: [
    ['Con 5 in condotta si è bocciati, cellulari vietati in classe.', 'Disciplina', 'Studenti indisciplinati'],
    ['Si torna alle regole di prima.', 'Studenti', 'Chi chiede disciplina'] ] },
  uni_tasse: { s: 'Quanto costa studiare all’università.', o: [
    ['Gratis per chi ha un ISEE sotto 22.000€.', 'Famiglie povere', 'Ceto medio'],
    ['Università gratis per tutti.', 'Studenti e famiglie', 'I conti: 1,8 miliardi'],
    ['Borse e posti letto per tutti gli aventi diritto.', 'Studenti fuori sede', 'I conti (poco)'] ] },
  ricerca: { s: 'Quanto investe l’Italia in ricerca scientifica: meno della media europea.', o: [
    ['1,4% del PIL.', '—', 'Ricercatori che emigrano'],
    ['Si arriva al 2% del PIL in 5 anni.', 'Scienza, innovazione, giovani ricercatori', 'I conti: 4 miliardi'] ] },
  nucleare: { s: 'Tornare a produrre energia nucleare con piccoli reattori di nuova generazione. L’Italia l’ha abbandonata dopo due referendum.', o: [
    ['Si studia il ritorno.', '—', '—'],
    ['Piano per costruire piccoli reattori entro il 2040.', 'Industria, energia stabile', 'Chi teme i rischi e le scorie'],
    ['Niente nucleare, solo rinnovabili.', 'Ambientalisti contrari al nucleare', 'Industria energivora'] ] },
  rinnovabili: { s: 'Sole, vento e acqua per produrre energia pulita. L’Italia è in ritardo sugli obiettivi.', o: [
    ['Limiti ai pannelli sui terreni agricoli.', 'Agricoltori', 'Transizione energetica'],
    ['Permessi in 6 mesi e più parchi solari ed eolici.', 'Ambiente, bollette future', 'Chi tutela il paesaggio'],
    ['Vietati pale e pannelli sui terreni agricoli.', 'Agricoltori, paesaggio', 'Transizione energetica'] ] },
  auto2035: { s: 'L’Europa ha deciso che dal 2035 non si potranno più vendere auto nuove a benzina e diesel.', o: [
    ['L’Italia chiede di rinviare o cambiare la regola.', 'Industria dell’auto', '—'],
    ['L’Italia sostiene lo stop e dà incentivi per le elettriche.', 'Ambiente', 'Industria tradizionale, chi non può permettersi un’elettrica'],
    ['L’Italia vota contro e chiede di cancellare la regola.', 'Industria tradizionale', 'Rapporti con Bruxelles'] ] },
  clima: { s: 'Una legge che fissa obiettivi per ridurre le emissioni e taglia gli aiuti alle fonti inquinanti.', o: [
    ['Nessuna legge.', '—', 'Ambiente'],
    ['Obiettivo zero emissioni al 2050, meno sussidi a gasolio e gas.', 'Ambiente, i conti', 'Autotrasporto, agricoltura, pescatori'] ] },
  ponte: { s: 'Il ponte sospeso tra Sicilia e Calabria: sarebbe il più lungo del mondo e costerebbe circa 13,5 miliardi.', o: [
    ['Il progetto è fermo tra permessi e controlli.', '—', '—'],
    ['Si aprono i cantieri.', 'Imprese edili, collegamenti col Sud', 'I conti; chi preferisce strade e ferrovie'],
    ['Si cancella il Ponte e si usano i soldi per strade e treni del Sud.', 'Pendolari del Sud', 'Imprese del progetto, chi sogna il Ponte'] ] },
  caccia: { s: 'Le regole sulla caccia: periodi, specie e luoghi in cui si può cacciare.', o: [
    ['Regole attuali.', '—', '—'],
    ['Periodi più brevi e più specie protette.', 'Animali, ambientalisti', 'Cacciatori'],
    ['Calendari più lunghi decisi dalle Regioni.', 'Cacciatori', 'Animali, ambientalisti'] ] },
  balneari: { s: 'Le concessioni degli stabilimenti balneari: l’Europa chiede gare pubbliche invece dei rinnovi automatici.', o: [
    ['Gare a partire dal 2027.', 'Equilibrio con Bruxelles', '—'],
    ['Gare subito.', 'Concorrenza, nuove imprese, Bruxelles', 'Balneari storici'],
    ['Rinnovi lunghi e niente gare.', 'Balneari storici', 'Rapporti con Bruxelles, nuove imprese'] ] },
  taxi: { s: 'Quante licenze dei taxi ci sono e chi può fare il servizio con le app.', o: [
    ['Licenze limitate decise dai comuni.', 'Tassisti', 'Clienti che non trovano un taxi'],
    ['Più licenze e app libere.', 'Clienti, prezzi più bassi', 'Tassisti che hanno pagato la licenza'] ] },
  privatizzazioni: { s: 'Vendere quote delle aziende pubbliche (come ENI e Poste) per incassare soldi e ridurre il debito.', o: [
    ['Piano di vendite già avviato.', '—', '—'],
    ['Lo Stato vende quote di ENI, Poste e Ferrovie.', 'Il debito pubblico (una tantum)', 'Controllo pubblico sui servizi'],
    ['Lo Stato ricompra aziende strategiche.', 'Controllo pubblico, lavoratori', 'I conti, i mercati'] ] },
  ilva: { s: 'L’acciaieria di Taranto, la più grande d’Europa: dà lavoro a migliaia di persone ma inquina molto.', o: [
    ['Si cerca un compratore privato.', '—', '—'],
    ['Lo Stato la gestisce direttamente.', 'Lavoratori', 'I conti: 2 miliardi'],
    ['Forni elettrici puliti e chiusura della parte inquinante.', 'Salute dei tarantini, ambiente', 'Parte dei posti di lavoro'] ] },
  zes: { s: 'Gli sconti fiscali per chi investe e assume nel Sud Italia.', o: [
    ['Sconti sugli investimenti nel Sud.', 'Imprese del Sud', '—'],
    ['Anche contributi più bassi per chi assume al Sud.', 'Lavoratori e imprese del Sud', 'I conti: 3 miliardi'],
    ['Niente aiuti speciali per il Sud.', 'I conti, imprese del Nord', 'Economia del Sud'] ] },
  ia: { s: 'Le regole e gli investimenti sull’intelligenza artificiale.', o: [
    ['Legge 2025 e un fondo da 1 miliardo.', '—', '—'],
    ['10 miliardi per supercomputer, startup e formazione.', 'Innovazione, startup', 'I conti: 2 miliardi l’anno'],
    ['Limiti all’uso dell’IA sul lavoro.', 'Lavoratori', 'Imprese tecnologiche'] ] },
  carne_coltivata: { s: 'La carne prodotta in laboratorio partendo da cellule animali.', o: [
    ['Vietata in Italia.', 'Allevatori', 'Ricerca'],
    ['Si può studiare e vendere se l’Europa la approva.', 'Ricerca, ambiente', 'Allevatori'] ] },
  difesa: { s: 'Quanto spende l’Italia per l’esercito. La NATO chiede di salire molto nei prossimi anni.', o: [
    ['Aumenti graduali verso gli impegni NATO.', '—', '—'],
    ['Si arriva al 3,5% del PIL entro il 2030.', 'Industria della difesa, alleati NATO', 'I conti: 15 miliardi l’anno, meno soldi per altro'],
    ['La spesa resta al 2%.', 'I conti', 'Rapporti con la NATO'],
    ['Si taglia la spesa militare.', 'I conti, pacifisti', 'Rapporti con gli alleati'] ] },
  leva: { s: 'Il servizio militare: dal 2005 non è più obbligatorio.', o: [
    ['Solo militari professionisti.', '—', '—'],
    ['6 mesi di addestramento volontario.', 'Chi vuole avvicinare i giovani alla difesa', 'I conti (poco)'],
    ['12 mesi di servizio civile o militare per tutti i giovani.', 'Comunità, volontariato', 'Giovani che perdono un anno'],
    ['Torna il servizio militare obbligatorio.', 'Chi chiede disciplina', 'Giovani, i conti: 4 miliardi'] ] },
  mes: { s: 'Il fondo europeo che aiuta i Paesi e le banche in crisi. L’Italia è l’unica a non aver approvato la riforma.', o: [
    ['L’Italia non ratifica.', 'Chi diffida di Bruxelles', 'Rapporti con l’Europa'],
    ['L’Italia ratifica la riforma.', 'Rapporti con l’Europa, banche', 'Chi teme vincoli europei'] ] },
  codice_strada: { s: 'Le regole della strada, dal cellulare alla guida ai limiti di velocità.', o: [
    ['Multe severe per cellulare e alcol.', 'Sicurezza stradale', 'Automobilisti indisciplinati'],
    ['30 all’ora in città.', 'Pedoni e ciclisti', 'Automobilisti'],
    ['Multe più leggere.', 'Automobilisti', 'Sicurezza stradale'] ] },
};
// blocco "in parole semplici" per una riforma
function explainHTML(law, opt) {
  const S = SPIEGA[law.id];
  if (!S) return law.custom ? `<div class="expl"><span class="k">In parole semplici</span>${esc(law.opts[opt].d || 'Proposta originale.')}</div>` : '';
  const o = S.o[opt];
  return `<div class="expl"><span class="k">Di cosa si tratta</span>${esc(S.s)}${o ? `<span class="k" style="margin-top:10px">In pratica</span>${esc(o[0])}<div class="who"><div class="w"><b>Ci guadagna</b>${esc(o[1])}</div><div class="l"><b>Ci perde</b>${esc(o[2])}</div></div>` : ''}</div>`;
}
