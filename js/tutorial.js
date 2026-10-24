// ============================================================
//  TUTORIAL INIZIALE E CONSIGLI DURANTE LA PARTITA
// ============================================================
function tutorialSteps() {
  const car = !isLeader();
  const s = [
    { tab: 'home', ico: 'building', t: 'Benvenuto a Palazzo Chigi', x: `<p>L’obiettivo è arrivare a guidare il governo e restarci, oppure scalare un partito dal basso.</p><p><b>Ogni turno è una settimana.</b> Quando hai finito, premi il grande tasto <b>«Settimana successiva»</b> in basso: arrivano la rassegna stampa, i voti in aula e gli imprevisti.</p>` },
    { tab: 'home', ico: 'bolt', t: 'Capitale politico e azioni', x: `<p>In alto a destra trovi il <b>capitale politico ⚡</b>: è l’energia che spendi ogni settimana e si ricarica da sola.</p><p>Nelle <b>Azioni</b> (le medaglie da scorrere in orizzontale) scegli cosa fare: interviste, comizi, incontri con altri leader, raccolte fondi. La stella indica quelle consigliate. <b>Ogni azione si può fare una volta a settimana</b>, e prima di confermare vedi sempre pro e contro.</p>` },
    { tab: 'home', ico: 'chart', t: 'Gli indicatori in alto', x: `<p>Sotto la data, tre riquadri: il <b>sondaggio</b> del tuo partito, il consenso del <b>governo</b> e lo <b>spread</b>. Toccali per aprire la pagina giusta.</p><p>Nella tua scheda (il ritratto) quattro indicatori con il <b>mini grafico</b> delle ultime settimane: sondaggio, <b>notorietà del partito</b> (quanti italiani lo conoscono), governo e <b>fama</b>.</p>${car ? '<p>C’è anche il <b>rapporto con il leader</b> del tuo partito, da −100 a +100: conta per le promozioni.</p>' : ''}<p>Tocca il tuo ritratto per <b>creare il tuo avatar</b>.</p>` },
  ];
  if (car) s.push({ tab: 'home', ico: 'rocket', t: 'La tua carriera', x: `<p>Parti da ${RANKS[G.player.rank].n.toLowerCase()} e puoi salire fino a leader del partito. Servono <b>fama</b>, <b>seguito interno</b> (la tua corrente) e un buon <b>rapporto con il leader</b>.</p><p>Le promozioni arrivano da sole se hai i numeri, oppure puoi chiedere un incarico. Da parlamentare puoi <b>sfidare il leader al congresso</b> o <b>fondare un tuo partito</b> portandoti dietro chi ti segue.</p>` });
  s.push(
    { tab: 'leggi', ico: 'doc', t: 'Come si cambia una legge', x: `<div class="howto"><div>Apri una legge dal catalogo (sono leggi reali, con com’è oggi).</div><div>Scegli una delle riforme possibili.</div><div>Leggi <b>pro e contro</b> (economia e morale del Paese), chi è favorevole e la <b>previsione di voto</b>.</div><div>Presentala: da premier come disegno di legge o decreto; da parlamentare o leader come proposta di legge; da leader puoi anche metterla nel programma.</div><div>Il Parlamento la esamina: commissione → voto alla Camera → voto al Senato → firma del Presidente della Repubblica.</div></div>` },
    { tab: 'aula', ico: 'vote', t: 'Come si vota', x: `<p>Qui vedi l’emiciclo e tutte le proposte in discussione: tue, del governo e degli altri partiti.</p><p>Quando un provvedimento arriva in aula, a inizio settimana compare la scheda <b>«Votazioni in arrivo»</b>: voti <b>Sì, No o Astensione</b>. Se guidi un partito decidi anche il voto del tuo gruppo.</p><p>Votare contro la linea del partito ti dà visibilità ma peggiora il rapporto col leader. Da premier puoi porre la <b>fiducia</b>: gli alleati devono votarti o far cadere il governo.</p>` },
    { tab: 'italia', ico: 'map', t: 'L’Italia regione per regione', x: `<p>La mappa mostra primo partito, coalizioni, la tua forza, i presidenti di Regione e le prossime regionali.</p><p>Tocca una regione per vedere i sondaggi locali e fare un <b>comizio</b>: aumenta il tuo radicamento lì. Le regionali si votano alle date reali.</p>` },
    { tab: 'partiti', ico: 'hands', t: 'Sondaggi e alleanze', x: `<p>In <b>Sondaggi</b> segui l’andamento dei partiti. In <b>Partiti</b> vedi per ognuno l’<b>affinità</b> con le tue idee e il <b>rapporto</b> con te.</p><p>In <b>Alleanze</b> chiedi di entrare in una coalizione, inviti altri partiti, proponi la tua candidatura a premier o le primarie. Con la legge elettorale 2026 servono il <b>3%</b> per entrare in Parlamento e il <b>42%</b> di coalizione per il premio di maggioranza.</p>` },
    { tab: 'conti', ico: 'euro', t: 'Economia e manovra', x: `<p>Crescita, deficit, debito, spread, inflazione e disoccupazione si muovono con le tue scelte e con gli imprevisti.</p><p>Ogni <b>ottobre</b>, se governi, scrivi la <b>legge di bilancio</b>: scegli spese e coperture e guardi in tempo reale deficit, giudizio di Bruxelles (limite 3%) e reazione degli alleati. Va approvata entro il 31 dicembre.</p>` },
    { tab: 'home', ico: 'flag', t: 'Elezioni e governo', x: `<p>Le politiche sono previste per la primavera 2027. Dopo il voto: consultazioni al Quirinale, scelta dei ministri, giuramento e fiducia delle Camere.</p><p>Il governo può cadere per una crisi, una sfiducia, uno scandalo o lo spread, ma la tua carriera continua.</p><p>Man mano che giochi compariranno dei <b>consigli</b> nella schermata Palazzo. Puoi rivedere questo tutorial dal menu in alto a destra.</p>` },
  );
  return s;
}
let TUT = null;
function startTutorial(i) {
  TUT = { i: i || 0, steps: tutorialSteps() };
  openSheet('', { locked: true });
  renderTutorial();
}
function renderTutorial() {
  const st = TUT.steps[TUT.i];
  if (UI.tab !== st.tab) { UI.tab = st.tab; renderGame(); }
  const last = TUT.i === TUT.steps.length - 1;
  replaceSheet(`<div class="tut-ico" key="${TUT.i}">${medal(st.ico, 84)}</div><h2 class="center mt">${st.t}</h2><div class="small mt" style="line-height:1.5">${st.x}</div>
    <div class="dots">${TUT.steps.map((x, i) => `<i class="${i === TUT.i ? 'on' : ''}"></i>`).join('')}</div>
    <div class="row"><button class="btn" onclick="${TUT.i ? 'TUT.i--;renderTutorial()' : 'endTutorial()'}">${TUT.i ? '‹ Indietro' : 'Salta'}</button><button class="btn ${last ? 'gold' : 'pri'} grow" onclick="${last ? 'endTutorial()' : 'TUT.i++;renderTutorial()'}">${last ? 'Inizia a giocare' : 'Avanti ›'}</button></div>`);
}
function endTutorial() {
  try { localStorage.setItem(SAVE_PREFIX + 'tutorial', '1'); } catch (e) { }
  TUT = null; closeSheet(); UI.tab = 'home'; renderGame();
}

// ---------- consigli ----------
const TIPS = [
  { id: 'agenda', c: () => G.week >= 1 && G.week <= 3, x: 'Ogni settimana usa le azioni: con un’intervista, un comizio e una campagna social il tuo partito cresce. Il capitale ⚡ non speso oltre il massimo va perso. «Pianifica» le fa in automatico.' },
  { id: 'pcfull', c: () => G.pc >= pcMax() && G.week > 3, x: 'Hai il capitale politico al massimo: oltre non si accumula. Spendilo nelle azioni prima di andare avanti.' },
  { id: 'soglia', c: () => isLeader() && myParty().poll < 3 && G.cal.election - G.week < 26, x: 'Sei sotto il 3%: da solo non entreresti in Parlamento. Cresci con comizi e interviste oppure entra in una coalizione (Partiti → Alleanze).' },
  { id: 'noto', c: () => myPid() === 'MIO' && partyNoto('MIO') < 30 && G.week > 4, x: 'Pochi italiani conoscono il tuo partito. Interviste in TV, social e manifestazioni alzano la notorietà; senza notorietà i voti non arrivano.' },
  { id: 'sedi', c: () => myPid() === 'MIO' && G.org < 15 && G.week > 6, x: 'Il partito ha poca organizzazione: apri sedi sul territorio. Più organizzazione vuol dire campagne più efficaci e firme per i referendum.' },
  { id: 'programma', c: () => isLeader() && !G.program && G.cal.election - G.week < 28 && G.cal.election - G.week > 6, x: 'Prepara il programma: apri le leggi, tocca «Metti nel programma» e poi annuncialo dal menu in alto a destra. Promesse popolari ma sostenibili fanno crescere i consensi.' },
  { id: 'alleanze', c: () => isLeader() && !coalitionOf(myPid()) && G.cal.election - G.week < 22 && G.cal.election - G.week > 6, x: 'Corri da solo. Per il premio di maggioranza serve una coalizione al 42%: in Partiti → Alleanze puoi entrare in una coalizione o invitare altri partiti.' },
  { id: 'voti', c: () => (G.player.parl || (isLeader() && myParty().seatsC > 0)) && !Object.keys(G.myPersonal || {}).length, x: 'Quando un provvedimento arriva in aula ti chiedo come votare. Il voto contro la linea del partito ti fa notare, ma peggiora il rapporto col leader.' },
  { id: 'fondi', c: () => isLeader() && G.funds < 40, x: 'Fondi quasi finiti: comizi e campagne costano. Usa «Raccolta fondi» tra le azioni.' },
  { id: 'stress', c: () => G.player.stress > 65, x: 'Sei molto stressato. Un «Weekend di riposo» ti fa recuperare: con lo stress alto rischi errori e problemi di salute.' },
  { id: 'rap', c: () => !isLeader() && G.player.rap < 0, x: 'Il rapporto con il leader del partito è freddo: senza la sua fiducia niente promozioni. «Sostieni il leader» e voti in linea aiutano.' },
  { id: 'promo', c: () => !isLeader() && G.player.rank >= 3 && G.player.rank < 6 && G.player.fama >= 28 && G.player.rap >= 30, x: 'Hai i numeri per salire: prova «Chiedi un incarico» tra le azioni.' },
  { id: 'sfida', c: () => !isLeader() && G.player.rank >= 3 && G.player.seguito >= 30 && G.player.fama >= 35, x: 'Hai abbastanza seguito per sfidare il leader al congresso. In alternativa puoi fondare un tuo partito.' },
  { id: 'premier', c: () => isPremier() && G.week - G.gov.start < 3, x: 'Sei a Palazzo Chigi. Il disegno di legge è lento ma sicuro; il decreto entra subito in vigore ma va convertito in 60 giorni, e troppi decreti irritano il Quirinale.' },
  { id: 'alleati', c: () => isPremier() && G.gov.parties.some(p => p !== myPid() && G.gov.sat[p] < 35), x: 'Un alleato è scontento: un vertice di maggioranza, un incontro o una legge che piace a lui evitano la crisi.' },
  { id: 'flex', c: () => isPremier() && monthOf(G.week) === 8, x: 'È settembre: con una «Missione a Bruxelles» puoi ottenere flessibilità sui conti prima della manovra di ottobre.' },
  { id: 'deficit', c: () => isPremier() && G.econ.deficit > 3.4, x: 'Il deficit è sopra il 3%: Bruxelles e i mercati si innervosiscono. Nella prossima manovra servono coperture.' },
  { id: 'campagna', c: () => isLeader() && inCampaign(), x: 'Siamo in campagna elettorale: i comizi valgono il doppio, e puoi fare spot e il confronto TV tra leader.' },
  { id: 'promesse', c: () => isPremier() && G.week - G.gov.start > 40 && G.promises.some(p => !p.kept), x: 'Ricorda le promesse del programma: alle prossime elezioni gli elettori ti giudicheranno anche su quelle mantenute.' },
];
function currentTip() { if (!G.tipsSeen) G.tipsSeen = {}; return TIPS.find(t => { if (G.tipsSeen[t.id]) return false; try { return t.c(); } catch (e) { return false; } }); }
function tipsHTML() {
  const t = currentTip(); if (!t) return '';
  return `<div class="tip">${icon('bulb')}<div class="grow"><b class="h">Consiglio</b><div class="small" style="margin-top:4px">${t.x}</div><div class="row mt" style="justify-content:flex-end"><button class="btn sm" onclick="G.tipsSeen['${t.id}']=G.week;renderGame()">Ho capito</button></div></div></div>`;
}
