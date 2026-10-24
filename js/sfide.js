// ============================================================
//  LE SFIDE DEL DECENNIO: problemi nuovi che emergono col tempo.
//  Finché non li affronti pesano sull'economia o sul consenso;
//  ognuno sblocca una legge nuova con le sue riforme.
// ============================================================
const SFIDE = [
  { id: 'ia', w: 40, law: 'sf_ia', n: 'Intelligenza artificiale e lavoro', i: 'chip', peso: 'La disoccupazione sale di circa 0,2 punti l’anno.', tick: () => { G.econ.disBase += 0.004; },
    intro: 'Banche, assicurazioni e call center sostituiscono migliaia di impiegati con l’intelligenza artificiale. Gli economisti avvertono: senza un piano, la disoccupazione salirà ogni anno.' },
  { id: 'casa', w: 70, law: 'sf_casa', n: 'L’emergenza casa', i: 'home', peso: 'Se governi, il consenso cala un po’ ogni settimana.', tick: () => { if (isPremier() && G.gov) G.gov.popBank -= 0.05; },
    intro: 'Affitti su del 30% in tre anni nelle grandi città: studenti, giovani coppie e famiglie non trovano casa. È la prima preoccupazione degli italiani nei sondaggi.' },
  { id: 'anziani', w: 100, law: 'sf_anziani', n: 'Anziani non autosufficienti', i: 'users', peso: 'La spesa sociale cresce e il deficit sale di circa 0,15 punti l’anno.', tick: () => { G.econ.baseDef += 0.003; },
    intro: 'Quasi quattro milioni di anziani non sono autosufficienti e le famiglie non ce la fanno più. La spesa per l’assistenza cresce ogni anno senza un piano.' },
  { id: 'acqua', w: 125, law: 'sf_acqua', n: 'La siccità diventa strutturale', i: 'drop', peso: 'Agricoltura e industria frenano: la crescita perde qualcosa ogni settimana.', tick: () => { G.econ.shockPil -= 0.003; },
    intro: 'Terzo anno di fila con fiumi in secca e razionamenti al Sud. Le reti perdono il 40% dell’acqua: agricoltori e industrie chiedono un piano nazionale.' },
  { id: 'nascite', w: 155, law: 'sf_nascite', n: 'L’inverno demografico', i: 'baby', peso: 'Meno giovani al lavoro: la crescita rallenta lentamente.', tick: () => { G.econ.shockPil -= 0.002; },
    intro: 'Meno di 350.000 nascite l’anno: le scuole chiudono, le aziende non trovano giovani e i conti delle pensioni traballano.' },
  { id: 'clima', w: 190, law: 'sf_clima', n: 'Adattarsi al clima che cambia', i: 'rain', peso: 'Ogni anno i danni di frane e alluvioni pesano sui conti.', tick: () => { G.econ.oneOff += 0.01; },
    intro: 'Alluvioni, frane e grandinate costano miliardi ogni anno. La Commissione europea chiede a ogni Paese un piano di adattamento.' },
];
const SFIDA_BY_ID = {}; SFIDE.forEach(s => { SFIDA_BY_ID[s.id] = s; });

// le leggi delle sfide (nascoste finché la sfida non emerge)
L('sf_ia', 'Lavoro', 'Intelligenza artificiale e lavoro', 'AI Act UE · L. 132/2025', 'eco', 0,
  'C’è una legge quadro sull’intelligenza artificiale, ma niente per chi perde il lavoro a causa dell’automazione.', [
  ['Nessuna regola sul lavoro', 'Si lascia fare al mercato.', 2, 0, {}],
  ['Fondo per riqualificare i lavoratori', 'Corsi pagati e sostegno al reddito per chi cambia mestiere.', -2, 1.5, { pop: 2, sind: 5, occ: -0.15, pil: 0.03 }],
  ['Incentivi alle imprese che adottano l’IA', 'Crediti d’imposta per chi investe in automazione e forma il personale.', 4, 1, { conf: 8, pil: 0.08, occ: 0.05, sind: -4 }],
  ['Tassa sui robot e settimana corta', 'Chi sostituisce lavoratori con l’IA paga; orario ridotto a parità di stipendio.', -6, -1, { sind: 8, conf: -10, pil: -0.04, occ: -0.1, pop: 1 }],
], { sfida: 'ia', sal: 3 });
L('sf_casa', 'Welfare', 'Emergenza casa', 'Piano casa 2025 · L. 431/1998 sugli affitti', 'eco', 0,
  'Pochi alloggi pubblici, bonus sparsi e affitti in forte aumento nelle città.', [
  ['Bonus sparsi', 'Contributi affitto dei Comuni, nessun piano nazionale.', 1, 0, {}],
  ['Piano nazionale di case popolari', '100.000 alloggi pubblici in dieci anni.', -4, 2.5, { pop: 3, sind: 4, pil: 0.04 }],
  ['Stretta sugli affitti brevi', 'Limiti agli affitti turistici nei centri storici.', -2, 0, { pop: 2, conf: -5 }],
  ['Incentivi a costruire e affittare', 'Cedolare secca più bassa e semplificazioni per chi costruisce.', 4, 1.2, { conf: 6, pil: 0.05, pop: 1 }],
], { sfida: 'casa', sal: 3 });
L('sf_anziani', 'Welfare', 'Assistenza agli anziani non autosufficienti', 'L. 33/2023 · D.Lgs. 29/2024', 'eco', 0,
  'Indennità di accompagnamento uguale per tutti e assistenza lasciata alle famiglie e alle badanti.', [
  ['Indennità attuale', 'Circa 530 euro al mese, il resto lo pagano le famiglie.', 0, 0, {}],
  ['Assegno universale per gli anziani', 'Fino a 1.000 euro al mese in base al bisogno.', -3, 2, { pop: 3, chiesa: 4 }],
  ['Assistenza a domicilio con le Regioni', 'Infermieri e operatori a casa, meno ricoveri.', 0, 1, { pop: 2, sind: 2 }],
  ['Assicurazione obbligatoria', 'Un piccolo contributo da tutti per coprire il rischio da vecchi.', 5, -0.5, { pop: -2, merc: 3, conf: 3 }],
], { sfida: 'anziani', sal: 2 });
L('sf_acqua', 'Ambiente', 'Piano nazionale per l’acqua', 'D.Lgs. 152/2006 · Piano idrico', 'amb', 0,
  'Interventi d’emergenza durante le crisi; reti vecchie che perdono il 40% dell’acqua.', [
  ['Interventi d’emergenza', 'Si interviene solo quando la crisi esplode.', 0, 0, {}],
  ['Dighe, invasi e dissalatori', 'Grandi opere idriche al Sud e nelle isole.', 4, 2, { pil: 0.05, conf: 4 }],
  ['Riparare le reti', 'Un miliardo e mezzo l’anno per ridurre le perdite.', -1, 1.5, { pil: 0.04, pop: 1 }],
  ['Acqua pubblica', 'Il servizio torna ai Comuni, niente utili ai gestori.', -6, 1, { sind: 4, merc: -4, pop: 2 }],
], { sfida: 'acqua', sal: 2 });
L('sf_nascite', 'Famiglia', 'Piano nazionale per le nascite', 'Assegno unico · D.Lgs. 230/2021', 'soc', 0,
  'Assegno unico per i figli e bonus nascita: le nascite continuano a calare.', [
  ['Assegno unico attuale', 'Aiuti in base all’ISEE, niente di nuovo.', 0, 0, {}],
  ['500 euro al mese per ogni figlio', 'Assegno pieno per tutti fino a 18 anni.', 3, 6, { pop: 4, chiesa: 6, ue: -3 }],
  ['Asili, congedi e lavoro per le madri', 'Nidi gratis, congedi lunghi e pagati anche ai padri.', -3, 2.5, { pop: 3, occ: -0.1, sind: 3 }],
  ['Più immigrazione regolare per lavoro', 'Quote più alte per colmare la mancanza di giovani.', -5, 0, { pil: 0.08, occ: -0.05, chiesa: 3, pop: -2 }],
], { sfida: 'nascite', sal: 3 });
L('sf_clima', 'Ambiente', 'Adattamento al clima', 'Piano nazionale di adattamento 2023', 'amb', 0,
  'Un piano esiste sulla carta, ma senza fondi: si spende dopo i disastri.', [
  ['Si interviene dopo i disastri', 'Ricostruzione caso per caso.', 2, 0, {}],
  ['Piano da 5 miliardi in dieci anni', 'Argini, boschi, città più verdi e allerte.', -2, 1.5, { pil: 0.03, pop: 1, ue: 3 }],
  ['Assicurazione obbligatoria sulle catastrofi', 'Case e imprese assicurate contro alluvioni e terremoti.', 3, -0.3, { merc: 2, pop: -1 }],
  ['Fondo europeo comune', 'Chiedere a Bruxelles un fondo per il clima.', -3, 0.5, { ue: 5 }],
], { sfida: 'clima', sal: 2 });
['sf_ia', 'sf_casa', 'sf_anziani', 'sf_acqua', 'sf_nascite', 'sf_clima'].forEach(id => { LAW_BY_ID[id] = LAWS.find(l => l.id === id); });

// spiegazioni semplici, come per le altre leggi
Object.assign(SPIEGA, {
  sf_ia: { s: 'L’intelligenza artificiale cambia molti lavori d’ufficio: chi perde il posto va aiutato a trovarne un altro.', o: [['Si lascia fare alle imprese.', 'Chi adotta l’IA', 'Impiegati sostituiti'], ['Lo Stato paga corsi e un sostegno a chi cambia lavoro.', 'Lavoratori da riqualificare', 'Conti pubblici'], ['Si premiano le imprese che investono e formano.', 'Imprese, crescita', 'Chi perde il posto senza paracadute'], ['Chi automatizza paga e si lavora meno ore.', 'Lavoratori dipendenti', 'Imprese e investimenti']] },
  sf_casa: { s: 'Gli affitti sono cresciuti molto più degli stipendi: giovani e famiglie fanno fatica a trovare casa.', o: [['Restano solo piccoli bonus.', 'Proprietari', 'Inquilini'], ['Lo Stato costruisce case popolari.', 'Famiglie a basso reddito, edilizia', 'Conti pubblici'], ['Meno case ai turisti, più agli abitanti.', 'Inquilini nei centri città', 'Proprietari e piattaforme'], ['Si spinge il mercato a costruire e affittare.', 'Costruttori, proprietari', 'Chi non può pagare affitti di mercato']] },
  sf_anziani: { s: 'Sempre più anziani hanno bisogno di assistenza: oggi pesa quasi tutto sulle famiglie.', o: [['Tutto resta com’è.', 'Conti pubblici nel breve', 'Famiglie con anziani'], ['Un assegno più alto in base al bisogno.', 'Anziani e famiglie', 'Conti pubblici'], ['Assistenza a casa organizzata con le Regioni.', 'Anziani, ospedali meno pieni', 'Regioni che devono organizzarsi'], ['Ognuno si assicura per la vecchiaia.', 'Conti pubblici, assicurazioni', 'Lavoratori che pagano il premio']] },
  sf_acqua: { s: 'L’Italia ha sempre meno acqua e reti che ne perdono quasi metà.', o: [['Si interviene solo nelle emergenze.', 'Nessuno nel lungo periodo', 'Agricoltori e Sud'], ['Si costruiscono dighe, invasi e dissalatori.', 'Sud, agricoltura, imprese edili', 'Ambientalisti, conti pubblici'], ['Si riparano i tubi che perdono.', 'Cittadini, ambiente', 'Conti pubblici'], ['L’acqua torna gestita dai Comuni.', 'Utenti, Comuni', 'Gestori privati, investitori']] },
  sf_nascite: { s: 'Nascono sempre meno bambini: tra vent’anni mancheranno lavoratori e contribuenti.', o: [['Si continua con gli aiuti attuali.', 'Conti pubblici', 'Giovani famiglie'], ['Un assegno pieno a ogni figlio.', 'Famiglie con figli', 'Conti pubblici'], ['Servizi e lavoro per i genitori, soprattutto le madri.', 'Madri lavoratrici, imprese', 'Conti pubblici'], ['Più lavoratori stranieri regolari.', 'Imprese, conti delle pensioni', 'Chi vuole meno immigrazione']] },
  sf_clima: { s: 'Alluvioni e frane sono sempre più frequenti: prevenire costa meno che ricostruire.', o: [['Si ricostruisce dopo ogni disastro.', 'Conti pubblici nel breve', 'Territori fragili'], ['Si investe in prevenzione per dieci anni.', 'Territori, imprese edili', 'Conti pubblici'], ['Case e imprese si assicurano contro le catastrofi.', 'Conti pubblici', 'Proprietari che pagano il premio'], ['Si chiede a Bruxelles un fondo comune.', 'Conti italiani', 'Tempi lunghi']] },
});

const sfidaAperta = s => G.sfide && G.sfide[s.id] && G.laws[s.law] === getLaw(s.law).cur;
function sfideTick() {
  G.sfide = G.sfide || {};
  LAWS.forEach(l => { if (G.laws[l.id] === undefined) G.laws[l.id] = l.cur; });
  SFIDE.forEach(s => {
    if (!G.sfide[s.id] && G.week >= s.w && G.phase === 'normale') { G.sfide[s.id] = G.week; G.queue.push({ id: 'sfida_' + s.id, ctx: {} }); addNews(`Nuova sfida per il Paese: ${s.n.toLowerCase()}.`, 'eco'); }
    if (sfidaAperta(s)) s.tick();
  });
}
function sfideHTML() {
  const aperte = SFIDE.filter(s => G.sfide && G.sfide[s.id]);
  if (!aperte.length) return '';
  return sec('Le sfide del decennio') + aperte.map(s => { const open = sfidaAperta(s), l = getLaw(s.law); return `<div class="card tight click" onclick="openLaw('${s.law}')"><div class="row">${medal(s.i, 44, open ? '#ff9c9c' : '#7ee8b8')}<div class="grow"><b>${esc(s.n)}</b><div class="tiny ${open ? 'bad' : 'good'}">${open ? esc(s.peso) : 'Affrontata: ' + esc(l.opts[G.laws[s.law]].t)}</div></div>${icon('chevron', 18)}</div></div>`; }).join('');
}
// l'evento che annuncia ogni sfida
SFIDE.forEach(s => {
  const ev = { id: 'sfida_' + s.id, chain: true, for: 'all', w: 0, img: s.i, look: 'tv', title: `Nuova sfida: ${s.n}`, text: s.intro + ' ' + s.peso,
    choices: () => [{ t: isPremier() ? 'Metterla in agenda del governo' : 'Farne una battaglia del partito', fx: { fama: 1 }, r: 'Trovi la nuova legge nel catalogo e nella pagina Conti: finché non la cambi, il problema peserà.' }, { t: 'Rimandare', fx: {}, r: 'Il problema resta e cresce.' }] };
  EVENTS.push(ev); EVENT_BY_ID[ev.id] = ev;
});
