// ============================================================
//  IMPREVISTI E DECISIONI
//  for: 'premier' (sei a Palazzo Chigi), 'nogov' (non sei premier), 'all',
//       'leader' (guidi un partito), 'member' (carriera, non sei leader)
// ============================================================

// effetti: appr (consenso governo), my (spinta al tuo partito), fama, stress, salute, integ, pc, funds(k€),
// spread, pil, infl, oneOff (mld nell'anno), grp:{}, rel:{PARTITO:+x}, sat (tutti i partner), satP:{}, mood:{asse:+x},
// party:{PARTITO: spinta}, rap, seguito, cred, org
function applyFx(fx) {
  if (!fx) return;
  if (typeof softenFx === 'function') fx = softenFx(fx);
  const p = G.player, g = G.gov;
  if (fx.appr && g) g.popBank += fx.appr;
  if (fx.my) myParty().spinta += fx.my * (isLeader() ? 1 : 0.3);
  // con i media dalla tua parte la notorietà cresce di più (fino a +25%)
  if (fx.fama) p.fama = clamp(p.fama + (fx.fama > 0 ? fx.fama * (1 + (G.groups.media || 0) / 400) : fx.fama), 0, 100);
  if (fx.stress) p.stress = clamp(p.stress + fx.stress, 0, 100);
  if (fx.salute) p.salute = clamp(p.salute + fx.salute, 0, 100);
  if (fx.integ) p.integ = clamp(p.integ + fx.integ, 1, 10);
  if (fx.pc) G.pc = Math.max(0, G.pc + fx.pc);
  if (fx.funds) G.funds = Math.max(0, G.funds + fx.funds);
  if (fx.spread) G.econ.shockSpread += fx.spread;
  if (fx.pil) G.econ.shockPil += fx.pil;
  if (fx.infl) G.econ.shockInfl += fx.infl;
  if (fx.oneOff) G.econ.oneOff += fx.oneOff;
  if (fx.debt) G.econ.debito += fx.debt;
  if (fx.grp) Object.keys(fx.grp).forEach(k => { G.groups[k] = clamp(G.groups[k] + fx.grp[k], -100, 100); });
  if (fx.rel) Object.keys(fx.rel).forEach(k => { if (G.parties[k]) addRel(k, myPid(), fx.rel[k]); });
  if (fx.sat && g) g.parties.forEach(x => { if (x !== myPid()) g.sat[x] = clamp((g.sat[x] || 50) + fx.sat, 0, 100); });
  if (fx.satP && g) Object.keys(fx.satP).forEach(k => { if (g.sat[k] !== undefined) g.sat[k] = clamp(g.sat[k] + fx.satP[k], 0, 100); });
  if (fx.mood) Object.keys(fx.mood).forEach(k => { G.mood[k] = clamp(G.mood[k] + fx.mood[k], -10, 10); });
  if (fx.party) Object.keys(fx.party).forEach(k => { if (G.parties[k]) G.parties[k].spinta += fx.party[k]; });
  if (fx.govParties && g) g.parties.forEach(x => { G.parties[x].spinta += fx.govParties; });
  if (fx.rap) p.rap = clamp(p.rap + fx.rap, -100, 100);
  if (fx.seguito) p.seguito = clamp(p.seguito + fx.seguito, 0, 100);
  if (fx.cred) G.cred = clamp(G.cred + fx.cred, 0, 100);
  if (fx.org) G.org = clamp(G.org + fx.org, 0, 100);
  if (fx.dis) G.econ.disBase += fx.dis;
}

const RAND_REG = () => pick(REGIONS_DEF);
const govMinister = id => G.gov && G.gov.ministers[id] ? G.gov.ministers[id] : 'il ministro';
const premierName = () => G.gov ? (G.gov.premier === 'PLAYER' ? G.player.name : G.gov.premier) : 'il governo';
const oppLeader = () => { const opp = PIDS().filter(p => !inGov(p) && p !== myPid()).sort((a, b) => P(b).poll - P(a).poll)[0]; return opp ? P(opp) : P('PD'); };

const EVENTS = [
  // ===================== IMMIGRAZIONE =====================
  { id: 'sbarchi', for: 'premier', w: 3, cool: 20, img: 'wave', title: 'Lampedusa al collasso',
    text: () => `In 72 ore sono sbarcate oltre 7.000 persone. L’hotspot ospita il triplo della capienza. ${govMinister('INT')} chiede una decisione entro stasera.`,
    choices: () => [
      { t: 'Stato di emergenza e redistribuzione nelle regioni', fx: { appr: -1, oneOff: 0.4, mood: { imm: 0.4 }, satP: { LEGA: -4 } }, r: 'I governatori protestano, ma l’isola respira.' },
      { t: 'Chiedere a Bruxelles la solidarietà obbligatoria', fx: { grp: { ue: 4 }, appr: -0.5, pc: -1 }, r: 'La Commissione promette aiuti, i tempi sono lunghi.' },
      { t: 'Linea dura: accordi con Tunisia e Libia per bloccare le partenze', fx: { appr: 1, grp: { chiesa: -8, ue: -2 }, satP: { LEGA: 6, FN: 6 }, mood: { imm: 0.6 } }, r: 'Le partenze calano, le ONG denunciano violazioni dei diritti.' },
      { t: 'Corridoi umanitari e accoglienza diffusa', fx: { appr: -2, grp: { chiesa: 8 }, satP: { LEGA: -8, FDI: -5 }, mood: { imm: -0.3 } }, r: 'Papa e vescovi applaudono, la destra insorge.' },
    ] },
  { id: 'sbarchi_opp', for: 'nogov', w: 2, cool: 20, img: 'wave', title: 'Sbarchi record a Lampedusa',
    text: () => `Migliaia di arrivi in pochi giorni. Il ${G.gov ? G.gov.name : 'governo'} è sotto pressione. Come reagisci?`,
    choices: () => [
      { t: 'Attacca il governo: «Hanno fallito, altro che blocco navale»', fx: { my: 1, fama: 2, mood: { imm: 0.3 } }, r: 'La tua dichiarazione apre i TG.' },
      { t: 'Chiedi più umanità e un piano europeo', fx: { my: 0.5, grp: { chiesa: 4 }, mood: { imm: -0.2 } }, r: 'Il mondo cattolico apprezza.' },
      { t: 'Vai a Lampedusa di persona', fx: { fama: 4, my: 1.2, funds: -15, stress: 4 }, r: 'Le immagini con i volontari fanno il giro dei social.' },
    ] },

  // ===================== CALAMITÀ =====================
  { id: 'alluvione', for: 'premier', w: 2, cool: 30, img: 'rain', prep: () => ({ r: pick(REGIONS_DEF.filter(r => ['EMR', 'TOS', 'LIG', 'PIE', 'VEN', 'MAR', 'CAM', 'CAL', 'SIC'].includes(r.id))) }),
    title: c => `Alluvione in ${c.r.n}`,
    text: c => `Fiumi esondati, migliaia di sfollati e danni stimati in miliardi. Il presidente ${G.regions[c.r.id].gov} chiede lo stato di emergenza nazionale.`,
    choices: c => [
      { t: 'Stanziare subito 2 miliardi e nominare un commissario', fx: { oneOff: 2, appr: 2.5, pil: -0.02 }, r: 'Interventi rapidi: la popolazione apprezza.', run: () => { G.myReg[c.r.id] = (G.myReg[c.r.id] || 1) + 0.15; } },
      { t: 'Fondi europei di solidarietà e 500 milioni subito', fx: { oneOff: 0.5, appr: 0.5, grp: { ue: 3 } }, r: 'Le risorse arrivano, ma a rilento: proteste dei sindaci.' },
      { t: 'Andare sul posto con stivali e fango', fx: { appr: 1.5, fama: 3, stress: 5, pc: -2 }, r: 'Foto che restano nella memoria del Paese.' },
    ] },
  { id: 'alluvione_opp', for: 'nogov', w: 1.5, cool: 30, img: 'rain', prep: () => ({ r: RAND_REG() }), title: c => `Maltempo devastante in ${c.r.n}`,
    text: c => `Frane e allagamenti in ${c.r.n}. Il governo promette fondi. Che fai?`,
    choices: c => [
      { t: 'Unità nazionale: «Non è il momento delle polemiche»', fx: { my: 0.6, cred: 2, grp: { quir: 3 } }, r: 'Il Quirinale apprezza il senso delle istituzioni.' },
      { t: 'Denuncia i ritardi sul dissesto idrogeologico', fx: { my: 0.8, fama: 2 }, r: 'Polemica accesa nei talk show.' },
      { t: 'Organizza i volontari del partito', fx: { funds: -20, org: 2, my: 0.8 }, r: 'I tuoi militanti spalano fango per giorni.', run: () => { G.myReg[c.r.id] = (G.myReg[c.r.id] || 1) + 0.2; } },
    ] },
  { id: 'flegrei', for: 'premier', w: 1, cool: 60, img: 'volcano', title: 'Campi Flegrei: scossa di magnitudo 4.6',
    text: 'Il bradisismo accelera. Pozzuoli e Bagnoli in strada di notte. La Protezione civile chiede di aggiornare il piano di evacuazione.',
    choices: () => [
      { t: 'Piano straordinario: verifiche sugli edifici e 1,5 miliardi', fx: { oneOff: 1.5, appr: 2 }, r: 'La popolazione si sente protetta.' },
      { t: 'Evacuazione preventiva della zona rossa', fx: { oneOff: 3, appr: -1, pil: -0.03 }, r: 'Misura drastica: 80.000 persone spostate, polemiche e paura.' },
      { t: 'Rassicurare: monitoraggio continuo', fx: { appr: -1.5 }, r: 'I sindaci accusano il governo di sottovalutare.' },
    ] },
  { id: 'siccita', for: 'premier', w: 1.2, cool: 40, cond: () => [5, 6, 7].includes(monthOf(G.week)), img: 'sun', title: 'Siccità e incendi',
    text: 'Ondata di calore record: incendi in Sicilia e Sardegna, razionamento dell’acqua in diversi comuni del Sud.',
    choices: () => [
      { t: 'Piano idrico nazionale da 3 miliardi', fx: { oneOff: 1, appr: 1.5, grp: { conf: 3 } }, r: 'Si avviano dissalatori e riparazione delle reti.' },
      { t: 'Canadair dall’Europa ed emergenza nazionale', fx: { oneOff: 0.3, appr: 1, grp: { ue: 2 } }, r: 'Gli incendi vengono domati in una settimana.' },
      { t: 'Lasciare la gestione alle Regioni', fx: { appr: -1.5 }, r: 'Rimpallo di responsabilità sui giornali.' },
    ] },

  // ===================== LAVORO E ECONOMIA =====================
  { id: 'sciopero', for: 'premier', w: 2, cool: 16, cond: () => G.groups.sind < -15, img: 'fist', title: 'Sciopero generale',
    text: () => `${INSTITUTIONS.cgil} (CGIL) e ${INSTITUTIONS.uil} (UIL) proclamano lo sciopero generale contro la politica economica del governo. Treni e scuole fermi.`,
    choices: () => [
      { t: 'Convocare i sindacati a Palazzo Chigi', fx: { pc: -2, grp: { sind: 10 }, oneOff: 1, appr: 0.5 }, r: 'Si apre un tavolo: qualche concessione su salari e sicurezza.' },
      { t: 'Precettazione: garantire i servizi minimi', fx: { grp: { sind: -12 }, appr: 0.5, satP: { LEGA: 4 } }, r: 'Lo sciopero è ridimensionato, ma lo scontro si inasprisce.' },
      { t: 'Ignorare: «Sciopero politico»', fx: { grp: { sind: -6 }, appr: -1 }, r: 'Piazze piene in 50 città.' },
    ] },
  { id: 'piazza_cgil', for: 'nogov', w: 1.5, cool: 20, img: 'fist', title: 'Manifestazione nazionale dei sindacati',
    text: 'La CGIL porta in piazza San Giovanni 200.000 persone contro la manovra. Sei invitato sul palco.',
    choices: () => [
      { t: 'Partecipare in prima fila', fx: { grp: { sind: 10, conf: -4 }, my: 0.8, fama: 2, rel: { PD: 2, AVS: 3, M5S: 2 } }, r: 'Abbracci con i lavoratori, foto in prima pagina.' },
      { t: 'Inviare un messaggio di solidarietà', fx: { grp: { sind: 4 }, my: 0.2 }, r: 'Presenza discreta.' },
      { t: 'Prendere le distanze: «Le piazze non risolvono»', fx: { grp: { sind: -8, conf: 5 }, my: 0.3, rel: { FDI: 2, AZ: 2 } }, r: 'L’elettorato moderato apprezza.' },
    ] },
  { id: 'ilva', for: 'premier', w: 1.5, cool: 40, img: 'factory', title: 'Ex Ilva: gli altiforni si fermano',
    text: 'L’acquirente straniero si sfila. Senza un intervento l’acciaieria di Taranto chiude: 10.000 lavoratori diretti, 20.000 con l’indotto.',
    choices: () => [
      { t: 'Prestito ponte pubblico e nuova gara', fx: { oneOff: 1, appr: 1, grp: { sind: 4 } }, r: 'Si guadagna tempo.' },
      { t: 'Nazionalizzazione', fx: { oneOff: 2, grp: { sind: 10, merc: -5, ue: -4 }, appr: 1.5 }, r: 'Lo Stato torna a produrre acciaio.', run: () => { G.laws.ilva = 1; } },
      { t: 'Chiusura dell’area a caldo e cassa integrazione', fx: { oneOff: 0.8, grp: { sind: -10 }, appr: -2, pil: -0.04 }, r: 'Taranto in piazza, ma la città respira aria più pulita.' },
    ] },
  { id: 'stellantis', for: 'premier', w: 1.5, cool: 40, img: 'car', title: 'Stellantis taglia la produzione',
    text: 'Il gruppo annuncia lo stop della linea di Mirafiori e 2.000 esuberi. La Fiom chiama i lavoratori in piazza a Torino.',
    choices: () => [
      { t: 'Incentivi all’auto in cambio di garanzie sull’occupazione', fx: { oneOff: 1, grp: { conf: 4, sind: 3 }, appr: 0.5 }, r: 'Accordo raggiunto: la linea resta aperta per due anni.' },
      { t: 'Cercare un secondo costruttore (cinese) per l’Italia', fx: { grp: { ue: -3, conf: 2 }, pil: 0.02, appr: 0.5 }, r: 'Trattativa aperta con un gruppo asiatico.' },
      { t: '«Hanno preso miliardi dallo Stato»: scontro frontale', fx: { grp: { conf: -6, sind: 6 }, appr: 1 }, r: 'Lo scontro piace all’opinione pubblica, meno ai mercati.' },
    ] },
  { id: 'dazi', for: 'premier', w: 1.5, cool: 40, img: 'globe', title: 'Nuovi dazi americani',
    text: 'Washington annuncia dazi del 25% su vino, formaggi e macchinari europei. Export a rischio per 10 miliardi.',
    choices: () => [
      { t: 'Linea comune europea e contro-dazi', fx: { grp: { ue: 6 }, pil: -0.04 }, r: 'L’UE risponde compatta, il negoziato sarà lungo.' },
      { t: 'Mediazione personale con la Casa Bianca', fx: { pc: -3, grp: { ue: -4 }, appr: 1, pil: -0.01 }, r: 'Qualche esenzione per i prodotti italiani.' },
      { t: 'Fondo da 1 miliardo per gli esportatori', fx: { oneOff: 1, grp: { conf: 6 }, pil: -0.02 }, r: 'Le imprese apprezzano.' },
    ] },
  { id: 'energia', for: 'premier', w: 1.5, cool: 30, img: 'fire', title: 'Bollette alle stelle',
    text: 'Tensioni in Medio Oriente: il prezzo del gas sale del 60%. Famiglie e imprese chiedono aiuto.',
    choices: () => [
      { t: 'Taglio degli oneri di sistema e bonus sociale (3 mld)', fx: { oneOff: 3, appr: 2, infl: -0.3 }, r: 'Bollette calmierate per sei mesi.' },
      { t: 'Tetto al prezzo del gas a livello europeo', fx: { pc: -2, grp: { ue: 4 }, infl: 0.4 }, r: 'Bruxelles discute, i prezzi restano alti.' },
      { t: 'Tassare gli extraprofitti delle società energetiche', fx: { oneOff: -2, appr: 1.5, grp: { merc: -4, conf: -3 }, infl: 0.3 }, r: 'Gettito in arrivo, ricorsi delle società.' },
    ] },
  { id: 'banca', for: 'premier', w: 0.8, cool: 60, img: 'bank', title: 'Crisi di una banca regionale',
    text: 'Una popolare del Centro-Sud è a rischio dissesto: 300.000 correntisti spaventati, code agli sportelli.',
    choices: () => [
      { t: 'Salvataggio pubblico con il Fondo interbancario', fx: { oneOff: 1.5, grp: { merc: 6 }, appr: 0.5 }, r: 'Correntisti tutelati.' },
      { t: 'Risoluzione con bail-in: pagano azionisti e obbligazionisti', fx: { appr: -3, grp: { ue: 4 } }, r: 'Rabbia dei risparmiatori traditi.' },
      { t: 'Fusione con un grande gruppo bancario', fx: { pc: -2, grp: { merc: 3 } }, r: 'Accordo nella notte, costo per lo Stato contenuto.' },
    ] },
  { id: 'spread_alto', for: 'premier', w: 3, cool: 10, cond: () => G.econ.spread > 220, img: 'chartdown', title: 'Lo spread vola',
    text: () => `Lo spread BTP-Bund è a ${fmt0(G.econ.spread)} punti. ${INSTITUTIONS.bankit} (Banca d’Italia) chiede «prudenza sui conti».`,
    choices: () => [
      { t: 'Manovra correttiva da 8 miliardi', fx: { oneOff: -8, appr: -4, spread: -40, grp: { merc: 10, ue: 6 } }, r: 'I mercati si calmano, gli elettori no.' },
      { t: 'Rassicurare i mercati con un discorso in Parlamento', fx: { pc: -3, spread: -12 }, r: 'Effetto parziale.' },
      { t: '«Non ci faremo dettare l’agenda dai mercati»', fx: { appr: 1, spread: 25, grp: { merc: -10 } }, r: 'Applausi in piazza, vendite sui BTP.' },
    ] },
  { id: 'pnrr', for: 'premier', w: 1, cool: 999, once: true, img: 'eu', title: 'Il conto finale del PNRR',
    text: 'Bruxelles verifica gli ultimi obiettivi del Piano nazionale di ripresa e resilienza. Alcuni cantieri sono in ritardo.',
    choices: () => [
      { t: 'Task force a Palazzo Chigi per chiudere i progetti', fx: { pc: -3, grp: { ue: 6 }, pil: 0.05 }, r: 'L’ultima rata viene erogata.' },
      { t: 'Chiedere una proroga', fx: { grp: { ue: -4 } }, r: 'La Commissione concede poco.' },
    ] },
  { id: 'istat_natalita', for: 'all', w: 1, cool: 52, img: 'baby', title: 'Natalità: nuovo minimo storico',
    text: 'L’ISTAT certifica meno di 370.000 nascite l’anno, il dato più basso dall’Unità d’Italia.',
    choices: () => isPremier() ? [
      { t: 'Piano natalità: assegno unico +30% dal terzo figlio', fx: { oneOff: 1.5, grp: { chiesa: 6 }, appr: 1 }, r: 'Misura apprezzata dalle famiglie numerose.' },
      { t: 'Nidi gratis e congedi paritari', fx: { oneOff: 1.5, appr: 1 }, r: 'Le associazioni femminili applaudono.' },
      { t: 'Nessun intervento straordinario', fx: { appr: -0.5 }, r: 'Critiche sui giornali.' },
    ] : [
      { t: 'Proponi un piano per la natalità', fx: { my: 0.6, fama: 1 }, r: 'Ne parlano i giornali.' },
      { t: 'Accusa il governo di slogan senza risultati', fx: { my: 0.4 }, r: 'Botta e risposta sui social.' },
    ] },

  // ===================== SCANDALI =====================
  { id: 'scandalo_min', for: 'premier', w: 2.5, cool: 12, prep: () => {
      const list = Object.entries(G.gov.ministers).map(([k, n]) => ({ k, n, p: person(n) })).filter(x => x.p && !x.p.isPlayer);
      const risk = list.filter(x => chance(x.p.scandal / 10)); const c = risk.length ? pick(risk) : null; return c;
    }, cond: () => G.gov && Object.keys(G.gov.ministers).length > 0, img: 'eye',
    title: c => `Bufera su ${c.n}`,
    text: c => `${pick(['Un’inchiesta di Report', 'Il Fatto Quotidiano', 'Un’indagine della Procura di Roma', 'Domani'])} rivela ${pick(['consulenze d’oro affidate ad amici', 'un conflitto di interessi su un appalto', 'fondi pubblici usati per spese private', 'pressioni su una nomina', 'rapporti con un imprenditore indagato'])}. Coinvolto il ministro (${MIN_BY_ID[c.k].n}), ${c.p.party !== myPid() && G.parties[c.p.party] ? 'esponente di ' + P(c.p.party).short : 'della tua squadra'}.`,
    choices: c => [
      { t: 'Difenderlo: «Garantismo, aspettiamo i giudici»', fx: { appr: -2, grp: { mag: -4, quir: -3 } }, r: 'La polemica dura settimane.', run: () => { if (c.p.party !== myPid() && G.gov.sat[c.p.party] !== undefined) G.gov.sat[c.p.party] += 6; } },
      { t: 'Chiedere le dimissioni', fx: { appr: 1.5, grp: { mag: 3 } }, r: `${c.n} si dimette.`, run: () => { delete G.gov.ministers[c.k]; G.flags.vacant = c.k; if (c.p.party !== myPid() && G.gov.sat[c.p.party] !== undefined) G.gov.sat[c.p.party] -= 12; addNews(`${c.n} si dimette da ministro.`, 'bad'); } },
      { t: 'Prendere l’interim e aspettare', fx: { appr: -0.5, stress: 4 }, r: 'Una soluzione ponte.', run: () => { delete G.gov.ministers[c.k]; G.gov.interim = c.k; if (c.p.party !== myPid() && G.gov.sat[c.p.party] !== undefined) G.gov.sat[c.p.party] -= 6; } },
    ] },
  { id: 'gaffe', for: 'premier', w: 2, cool: 10, prep: () => { const k = pick(Object.keys(G.gov.ministers)); return { k, n: G.gov.ministers[k] }; }, cond: () => G.gov && Object.keys(G.gov.ministers).length > 3, img: 'mic',
    title: c => `Gaffe di ${c.n}`,
    text: c => `In un’intervista ${c.n} se ne esce con una frase infelice ${pick(['sui giovani “choosy”', 'sulle donne e il lavoro', 'sui meridionali', 'sui pensionati', 'sugli insegnanti'])}. Indignazione sui social.`,
    choices: c => [
      { t: 'Fargli chiedere scusa pubblicamente', fx: { appr: 0.3 }, r: 'Scuse accettate a metà.' },
      { t: 'Prendere le distanze in conferenza stampa', fx: { appr: 0.8, pc: -1 }, r: 'Il ministro è irritato.', run: () => { const p = person(c.n); if (p && G.gov.sat[p.party] !== undefined && p.party !== myPid()) G.gov.sat[p.party] -= 5; } },
      { t: 'Ignorare: «Polemica strumentale»', fx: { appr: -1.2 }, r: 'Il caso si gonfia.' },
    ] },
  { id: 'report_me', for: 'leader', w: 1.2, cool: 40, cond: () => G.player.fama > 25, img: 'tv', title: 'Report indaga su di te',
    text: () => `Una puntata di Report ricostruisce i finanziamenti a ${myParty().name}: ${G.player.integ >= 7 ? 'nessun illecito, ma qualche donatore imbarazzante' : 'emergono fatture sospette e una società di consulenza riconducibile al tuo staff'}.`,
    choices: () => [
      { t: 'Pubblicare tutti i bilanci online', fx: { cred: 4, fama: 2, my: G.player.integ >= 7 ? 1 : -0.5 }, r: G.player.integ >= 7 ? 'Trasparenza totale: il caso si sgonfia.' : 'I documenti sollevano altre domande.' },
      { t: 'Querelare la trasmissione', fx: { grp: { media: -8 }, my: -0.3 }, r: 'Accuse di attacco alla libertà di stampa.' },
      { t: 'Ignorare e andare avanti', fx: { my: G.player.integ >= 7 ? 0 : -1 }, r: 'Il tema resta sui social.' },
    ] },
  { id: 'avviso', for: 'leader', w: 1, cool: 80, cond: () => G.player.integ <= 5 && G.player.fama > 30, img: 'scales', title: 'Avviso di garanzia',
    text: () => `La Procura ti iscrive nel registro degli indagati per finanziamento illecito. La notizia è su tutti i siti.`,
    choices: () => [
      { t: '«Sono sereno, ho fiducia nella magistratura»', fx: { my: -2, appr: -3, integ: -1, stress: 10 }, r: 'Il caso resta aperto.', run: () => { G.flags.indagato = G.week; } },
      { t: 'Attaccare i pm: «Giustizia a orologeria»', fx: { my: -1, appr: -2, grp: { mag: -15, quir: -6 }, stress: 8 }, r: 'Una parte dell’elettorato si compatta, il Quirinale è irritato.', run: () => { G.flags.indagato = G.week; } },
      ...(isPremier() ? [{ t: 'Dimettersi da Presidente del Consiglio', fx: { integ: 1, cred: 5 }, r: 'Gesto apprezzato da molti. Il governo cade.', run: () => openCrisis('scandalo') }] : []),
    ] },
  { id: 'intercettazione', for: 'all', w: 1, cool: 30, cond: () => !!G.gov, img: 'headset', prep: () => { const opts = PIDS().filter(p => p !== myPid()); return { p: pick(opts) }; },
    title: c => `Intercettazioni imbarazzanti per ${P(c.p).short}`,
    text: c => `Un’inchiesta sugli appalti pubblica conversazioni di dirigenti di ${P(c.p).name}. Il leader ${P(c.p).leader} parla di «gogna mediatica».`,
    choices: c => [
      { t: 'Cavalcare il caso', fx: { my: 0.8, rel: { [c.p]: -10 } }, r: 'Duro attacco sui social.', run: () => { P(c.p).spinta -= 1.5; } },
      { t: 'Garantismo: «Si aspettino i processi»', fx: { rel: { [c.p]: 6 }, grp: { mag: -2 } }, r: `${P(c.p).leader} ringrazia pubblicamente.`, run: () => { P(c.p).spinta -= 1; } },
    ] },

  // ===================== ALLEATI E POLITICA =====================
  { id: 'fuoco_amico', for: 'premier', w: 2.5, cool: 8, prep: () => { const ps = G.gov.parties.filter(p => p !== myPid()); return ps.length ? { p: pick(ps) } : null; }, cond: () => G.gov && G.gov.parties.length > 1, img: 'fire',
    title: c => `${P(c.p).leader} attacca il governo`,
    text: c => `In un comizio ${P(c.p).leader} (${P(c.p).short}) critica pubblicamente una scelta del governo: «Noi non ci stiamo, gli italiani ci hanno votato per altro».`,
    choices: c => [
      { t: 'Convocare un vertice di maggioranza', fx: { pc: -2, satP: { [c.p]: 8 } }, r: 'Fumata bianca dopo tre ore.' },
      { t: 'Rispondere a muso duro', fx: { appr: 0.5, satP: { [c.p]: -8 }, rel: { [c.p]: -6 } }, r: 'Tensione alle stelle nella coalizione.' },
      { t: 'Ignorare', fx: { satP: { [c.p]: -3 } }, r: 'Il caso si spegne, ma resta il malumore.' },
    ] },
  { id: 'nomine', for: 'premier', w: 1, cool: 52, img: 'briefcase', title: 'Nomine nelle partecipate',
    text: 'Vanno rinnovati i vertici di ENI, ENEL, Leonardo e Poste. Gli alleati presentano le loro liste.',
    choices: () => [
      { t: 'Spartizione con gli alleati', fx: { sat: 8, grp: { merc: -3, media: -3 } }, r: 'Coalizione soddisfatta, i giornali parlano di lottizzazione.' },
      { t: 'Manager scelti per competenza con cacciatori di teste', fx: { sat: -6, grp: { merc: 6 } }, r: 'I mercati apprezzano, gli alleati meno.' },
      { t: 'Uomini di fiducia di Palazzo Chigi', fx: { sat: -10, appr: -0.5, pc: 2 }, r: 'Accentramento del potere: scontro con gli alleati.' },
    ] },
  { id: 'rai_nomine', for: 'premier', w: 1, cool: 52, img: 'radio', title: 'Il nuovo vertice della RAI',
    text: 'Il CdA RAI va rinnovato. Il governo indica l’amministratore delegato.',
    choices: () => [
      { t: 'Un dirigente vicino alla maggioranza', fx: { sat: 4, grp: { media: -6, ue: -2 }, appr: -0.3 }, r: '«TeleMeloni bis», titolano le opposizioni.' },
      { t: 'Un profilo indipendente scelto con l’opposizione', fx: { sat: -4, grp: { media: 8 }, appr: 0.5 }, r: 'Gesto di distensione apprezzato.' },
    ] },
  { id: 'cambio_casacca', for: 'leader', w: 1.5, cool: 20, cond: () => myParty().poll > 5 && G.player.fama > 30, prep: () => { const ps = PIDS().filter(p => p !== myPid() && seatsOf(p, 'C') > 5 && compat(p, myPid()) > 45); return ps.length ? { p: pick(ps) } : null; }, img: 'swap',
    title: c => `Parlamentari di ${P(c.p).short} bussano alla tua porta`,
    text: c => `Tre deputati di ${P(c.p).name}, delusi dalla linea del partito, vorrebbero passare con te.`,
    choices: c => [
      { t: 'Accoglierli', fx: { rel: { [c.p]: -15 }, my: 0.5, cred: -2 }, r: 'Nasce la componente del tuo partito alla Camera.', run: () => { const n = Math.min(3, P(c.p).seatsC); P(c.p).seatsC -= n; myParty().seatsC += n; addNews(`${n} deputati lasciano ${P(c.p).short} e passano a ${myParty().short}.`, 'mio'); } },
      { t: 'Rifiutare: «Niente trasformismo»', fx: { cred: 3, rel: { [c.p]: 4 } }, r: 'Gesto apprezzato dagli elettori.' },
    ] },
  { id: 'vannacci_prov', for: 'all', w: 0.3, cool: 104, cond: () => !!G.parties.FN && myPid() !== 'FN', img: 'book', title: 'Nuovo libro di Vannacci',
    text: 'Il generale presenta un nuovo libro con frasi destinate a far discutere su immigrazione e diritti. È polemica nazionale.',
    choices: () => [
      { t: 'Condannare duramente', fx: { my: 0.3, rel: { FN: -8 } }, r: 'Una parte del Paese ti applaude.', run: () => { P('FN').spinta += 0.4; } },
      { t: '«Libertà di pensiero, anche se non condivido»', fx: { rel: { FN: 4 }, my: 0.1 }, r: 'Equilibrismo che non convince tutti.' },
      { t: 'Non commentare', fx: {}, r: 'Silenzio strategico.' },
    ] },
  { id: 'papa', for: 'all', w: 1, cool: 40, img: 'church', title: () => `Appello di ${INSTITUTIONS.papa}`,
    text: 'Il Papa chiede all’Italia più accoglienza per i migranti e più sostegno ai poveri. Le parole rimbalzano su tutti i giornali.',
    choices: () => [
      { t: 'Raccogliere l’appello', fx: { grp: { chiesa: 8 }, my: 0.3, mood: { imm: -0.2 } }, r: 'Il mondo cattolico apprezza.' },
      { t: 'Rispetto, ma «lo Stato ha altre responsabilità»', fx: { grp: { chiesa: -4 }, my: 0.2 }, r: 'Toni misurati.' },
    ] },
  { id: 'quirinale_monito', for: 'premier', w: 2, cool: 20, cond: () => G.gov && G.gov.decreti.filter(x => G.week - x < 16).length >= 4, img: 'building', title: 'Il Quirinale richiama il governo',
    text: () => `${INSTITUTIONS.pdr} scrive ai presidenti delle Camere: troppi decreti-legge, spesso privi dei requisiti di necessità e urgenza, e troppe fiducie.`,
    choices: () => [
      { t: 'Impegnarsi a ridurre i decreti', fx: { grp: { quir: 10 }, pc: -1 }, r: 'Il Colle prende atto.', run: () => { G.gov.decreti = []; } },
      { t: 'Rispondere che il Paese ha bisogno di risposte rapide', fx: { grp: { quir: -12 }, appr: 0.3 }, r: 'Gelo istituzionale.' },
    ] },
  { id: 'mozione_sfiducia', for: 'premier', w: 1, cool: 30, cond: () => G.gov.approval < 38, img: 'vote', prep: () => ({ l: oppLeader() }), title: 'Mozione di sfiducia',
    text: c => `Le opposizioni guidate da ${c.l.leader} presentano una mozione di sfiducia contro un ministro e contro il governo.`,
    choices: () => [
      { t: 'Affrontare l’aula con un discorso duro', fx: { pc: -2, appr: 0.5, sat: 2 }, r: 'La mozione è respinta, la maggioranza si ricompatta.' },
      { t: 'Lasciar rispondere ai capigruppo', fx: { appr: -0.5 }, r: 'Respinta, ma l’assenza del premier fa notizia.' },
    ] },

  // ===================== SOCIETÀ =====================
  { id: 'femminicidio', for: 'all', w: 1.2, cool: 30, img: 'candle', title: 'Un altro femminicidio scuote il Paese',
    text: 'Una studentessa di 22 anni uccisa dall’ex fidanzato. Manifestazioni in tutte le città, il caso domina il dibattito.',
    choices: () => isPremier() ? [
      { t: 'Educazione affettiva obbligatoria nelle scuole', fx: { appr: 1, grp: { chiesa: -3 } }, r: 'Il governo annuncia un decreto.', run: () => { if (G.laws.femminicidio !== 1) proposeBill('femminicidio', 1, 'ddl', 'GOV', 'C'); } },
      { t: 'Più fondi ai centri antiviolenza', fx: { oneOff: 0.3, appr: 1 }, r: 'Risorse raddoppiate.' },
      { t: 'Inasprimento delle pene', fx: { appr: 0.5 }, r: 'Le associazioni: «Serve prevenzione, non solo carcere».' },
    ] : [
      { t: 'Partecipare alla manifestazione', fx: { my: 0.5, fama: 1 }, r: 'Presenza silenziosa, molto apprezzata.' },
      { t: 'Proporre una legge sull’educazione affettiva', fx: { my: 0.6, fama: 1 }, r: 'La proposta raccoglie firme trasversali.' },
    ] },
  { id: 'morti_lavoro', for: 'all', w: 1.2, cool: 30, img: 'helmet', title: 'Strage in un cantiere',
    text: () => `Crolla un solaio in un cantiere a ${pick(['Firenze', 'Brandizzo', 'Casteldaccia', 'Suviana', 'Calenzano', 'Bologna'])}: cinque operai morti, tre in subappalto.`,
    choices: () => isPremier() ? [
      { t: 'Stretta sui subappalti e 3.000 ispettori', fx: { oneOff: 0.4, grp: { sind: 8, conf: -3 }, appr: 1 }, r: 'Sindacati soddisfatti.' },
      { t: 'Lutto nazionale e funerali di Stato', fx: { appr: 0.5 }, r: 'Il Paese si stringe alle famiglie.' },
    ] : [
      { t: 'Chiedere il reato di omicidio sul lavoro', fx: { my: 0.5, grp: { sind: 5 } }, r: 'La proposta viene rilanciata dai sindacati.' },
      { t: 'Visitare il cantiere e le famiglie', fx: { fama: 2, my: 0.4, stress: 3 }, r: 'Momento toccante.' },
    ] },
  { id: 'pronto_soccorso', for: 'premier', w: 1.5, cool: 26, cond: () => [11, 0, 1].includes(monthOf(G.week)), img: 'hospital', title: 'Pronto soccorso al collasso',
    text: 'Picco influenzale: barelle nei corridoi e attese di 48 ore. I medici minacciano lo sciopero.',
    choices: () => [
      { t: 'Decreto: 2 miliardi per assunzioni straordinarie', fx: { oneOff: 2, appr: 2, grp: { sind: 4 } }, r: 'Ossigeno per gli ospedali.' },
      { t: 'Gettonisti e straordinari pagati di più', fx: { oneOff: 0.5, appr: 0.5 }, r: 'Tampone che regge a fatica.' },
      { t: 'Scaricare la responsabilità sulle Regioni', fx: { appr: -1.5 }, r: 'Scontro con i governatori.' },
    ] },
  { id: 'trattori', for: 'premier', w: 1, cool: 52, img: 'tractor', title: 'I trattori assediano Roma',
    text: 'Agricoltori in protesta contro le regole europee, il gasolio caro e i prezzi bassi pagati dalla grande distribuzione.',
    choices: () => [
      { t: 'Esenzione IRPEF agricola e sconto sul gasolio', fx: { oneOff: 0.6, appr: 1, grp: { ue: -2 } }, r: 'I trattori tornano a casa.' },
      { t: 'Portare le richieste a Bruxelles', fx: { pc: -2, grp: { ue: 2 } }, r: 'Qualche deroga alla PAC.' },
      { t: 'Fermare i blocchi stradali', fx: { appr: -1 }, r: 'Tensioni sul raccordo anulare.' },
    ] },
  { id: 'taxi', for: 'premier', w: 0.8, cool: 52, img: 'car', title: 'Sciopero dei taxi',
    text: 'Tassisti in piazza contro una norma che apre agli NCC e alle app. Città bloccate.',
    choices: () => [
      { t: 'Ritirare la norma', fx: { appr: -0.3, grp: { conf: -2 } }, r: 'I taxi tornano in strada.' },
      { t: 'Andare avanti con la liberalizzazione', fx: { appr: 0.5, grp: { conf: 3 } }, r: 'Giorni di disagi, poi la protesta rientra.' },
    ] },
  { id: 'mafia_arresto', for: 'all', w: 0.8, cool: 60, img: 'siren', title: 'Arrestato un superlatitante',
    text: 'I Carabinieri del ROS catturano un boss latitante da vent’anni. Festa a Palermo.',
    choices: () => [
      { t: 'Complimentarsi con le forze dell’ordine', fx: isPremier() ? { appr: 1.5, grp: { mag: 3 } } : { my: 0.2 }, r: 'Giornata di orgoglio per lo Stato.' },
      { t: 'Rilanciare la lotta alla mafia: più fondi alle procure', fx: isPremier() ? { oneOff: 0.3, appr: 1, grp: { mag: 6 } } : { my: 0.4, grp: { mag: 4 } }, r: 'Le procure ringraziano.' },
    ] },
  { id: 'cyber', for: 'premier', w: 0.8, cool: 60, img: 'laptop', title: 'Attacco hacker alla Pubblica Amministrazione',
    text: 'Un gruppo filorusso blocca i siti di INPS e di alcune ASL. Dati di milioni di cittadini a rischio.',
    choices: () => [
      { t: 'Potenziare l’Agenzia per la cybersicurezza (500 milioni)', fx: { oneOff: 0.5, appr: 0.5 }, r: 'Sistemi ripristinati in 48 ore.' },
      { t: 'Espellere diplomatici del paese sospettato', fx: { appr: 0.8, grp: { ue: 2 } }, r: 'Tensione diplomatica.' },
    ] },
  { id: 'ucraina', for: 'premier', w: 1, cool: 26, img: 'shield', title: 'Nuovo pacchetto di aiuti all’Ucraina',
    text: 'Gli alleati europei chiedono all’Italia un nuovo invio di sistemi di difesa aerea. Nella maggioranza c’è chi frena.',
    choices: () => [
      { t: 'Approvare il pacchetto', fx: { grp: { ue: 6 }, satP: { LEGA: -6, M5S: -8, FN: -8 }, appr: -0.5 }, r: 'Bruxelles e Washington ringraziano.' },
      { t: 'Solo aiuti civili e umanitari', fx: { grp: { ue: -3 }, satP: { LEGA: 4, M5S: 4 }, appr: 0.5 }, r: 'Scelta che divide gli alleati europei.' },
    ] },
  { id: 'medio_oriente', for: 'all', w: 1, cool: 26, img: 'dove', title: 'Medio Oriente: piazze piene',
    text: 'Nuova escalation in Medio Oriente. Manifestazioni in tutte le città italiane, scontri a Roma e Milano.',
    choices: () => isPremier() ? [
      { t: 'Iniziativa diplomatica e aiuti umanitari', fx: { pc: -2, appr: 1, grp: { chiesa: 4 } }, r: 'L’Italia si propone come mediatrice.' },
      { t: 'Linea della fermezza sull’ordine pubblico', fx: { appr: 0.3, grp: { sind: -3 } }, r: 'Cortei contenuti, polemiche sulle cariche.' },
    ] : [
      { t: 'Partecipare ai cortei per la pace', fx: { my: 0.6, rel: { AVS: 3, M5S: 3 } }, r: 'Bandiere e slogan, foto sui giornali.' },
      { t: 'Condannare le violenze nei cortei', fx: { my: 0.3, rel: { FDI: 2 } }, r: 'Posizione d’ordine.' },
    ] },
  { id: 'virale', for: 'all', w: 2, cool: 12, img: 'phone', title: 'Sei virale sui social',
    text: () => `Un tuo video ${pick(['in cui rispondi a un contestatore', 'mentre balli a una festa di partito', 'con una battuta su un avversario', 'in cui spieghi la manovra in 60 secondi'])} supera i 5 milioni di visualizzazioni.`,
    choices: () => [
      { t: 'Cavalcare l’onda con altri contenuti', fx: { fama: 4, my: 0.6, cred: -1 }, r: 'TikTok ti adora, i commentatori un po’ meno.' },
      { t: 'Restare istituzionale', fx: { fama: 2, cred: 1 }, r: 'Profilo serio, crescita lenta.' },
    ] },
  { id: 'sondaggio_shock', for: 'leader', w: 1, cool: 20, img: 'chart', title: 'Sondaggio shock',
    text: () => `Un istituto stima ${myParty().short} in ${myParty().poll > myParty().base ? 'crescita sorprendente' : 'calo verticale'}. Il dato rimbalza in tutti i talk show.`,
    choices: () => [
      { t: 'Commentare: «L’unico sondaggio che conta è il voto»', fx: { cred: 1 }, r: 'Classico.' },
      { t: 'Rilanciare con una grande iniziativa', fx: { pc: -2, my: 1, fama: 2 }, r: 'Il partito si mobilita.' },
    ] },
  { id: 'salute', for: 'all', w: 2, cool: 20, cond: () => G.player.stress > 75, img: 'stetho', title: 'Il corpo presenta il conto',
    text: 'Notti insonni, agenda impossibile. Il tuo medico ti consiglia di fermarti qualche giorno.',
    choices: () => [
      { t: 'Una settimana di riposo', fx: { stress: -35, salute: 10, pc: -99, fama: -1 }, r: 'Torni più lucido.' },
      { t: 'Andare avanti, il Paese non aspetta', fx: { salute: -10, stress: 5 }, r: 'Tieni duro... per ora.' },
    ] },

  // ===================== CARRIERA (non leader) =====================
  { id: 'lealta', for: 'member', w: 2.5, cool: 10, img: 'hands', title: () => `${P(myPid()).leader} ti chiede lealtà`,
    text: () => `Il partito deve votare una scelta controversa. ${P(myPid()).leader} ti chiede di difendere la linea in TV, anche se non sei del tutto d’accordo.`,
    choices: () => [
      { t: 'Difendere la linea senza esitazioni', fx: { rap: 12, fama: 2, cred: -1 }, r: 'Il leader ti nota.' },
      { t: 'Difenderla, ma con qualche distinguo', fx: { rap: 3, fama: 3, seguito: 2 }, r: 'Equilibrio apprezzato da una parte del partito.' },
      { t: 'Criticarla apertamente', fx: { rap: -18, fama: 7, seguito: 5 }, r: 'Titoli sui giornali: «Il dissenso interno».' },
    ] },
  { id: 'corrente_rivale', for: 'member', w: 1.5, cool: 20, cond: () => G.player.rank >= 2, img: 'sword', title: 'Una corrente rivale ti attacca',
    text: 'Un dirigente concorrente fa circolare veleni sul tuo conto nelle chat interne del partito.',
    choices: () => [
      { t: 'Rispondere con un’intervista', fx: { fama: 3, seguito: -2, rap: -3 }, r: 'Lo scontro diventa pubblico.' },
      { t: 'Lavorare in silenzio sui territori', fx: { seguito: 4, stress: 3 }, r: 'Il tempo è dalla tua parte.' },
      { t: 'Chiedere l’arbitrato del leader', fx: { rap: 4, seguito: -1 }, r: 'Il leader media.' },
    ] },
  { id: 'festa_partito', for: 'member', w: 1.5, cool: 26, img: 'tent', title: () => `Invito alla festa nazionale di ${P(myPid()).short}`,
    text: () => `${{ FDI: 'Atreju', PD: 'la Festa dell’Unità', LEGA: 'Pontida', M5S: 'Nova', FI: 'la festa azzurra', AVS: 'la festa di AVS', FN: 'la festa del Mondo al contrario' }[myPid()] || 'La festa nazionale'} ti offre un panel in prima serata.`,
    choices: () => [
      { t: 'Accettare e preparare un discorso forte', fx: { fama: 4, seguito: 4, stress: 4, rap: 2 }, r: 'Applausi a scena aperta.' },
      { t: 'Usare il palco per lanciare la tua corrente', fx: { fama: 5, seguito: 7, rap: -8 }, r: 'Il leader si irrigidisce.' },
    ] },
  { id: 'proposta_lista', for: 'member', w: 1, cool: 52, cond: () => G.player.rank <= 2, img: 'clipboard', title: 'Candidatura alle suppletive',
    text: () => `Si è liberato un seggio in un collegio della tua regione (${regionName(G.player.region)}). Il partito cerca un candidato.`,
    choices: () => [
      { t: 'Candidarti', fx: { stress: 6, funds: -10 }, r: '', run: () => { const p = G.player; const ok = chance(clamp(0.2 + p.fama / 120 + regionShares(p.region)[myPid()] / 50 + p.rap / 300, 0.05, 0.85)); if (ok) { p.rank = Math.max(p.rank, 3); p.parl = 'C'; myParty().seatsC++; addNews(`${p.name} vince le elezioni suppletive ed entra alla Camera!`, 'good'); G.careerLog.push({ w: G.week, t: 'Eletto alle suppletive' }); } else { p.fama += 3; addNews(`${p.name} perde le suppletive, ma si fa conoscere.`, 'bad'); } } },
      { t: 'Lasciare spazio ad altri', fx: { rap: 5 }, r: 'Il partito apprezza lo spirito di squadra.' },
    ] },
  { id: 'offerta_altro_partito', for: 'member', w: 1, cool: 40, cond: () => G.player.fama > 25, prep: () => { const ps = typeof nearParties === 'function' ? nearParties() : []; return ps.length ? { p: pick(ps) } : null; }, img: 'phone', title: c => `${P(c.p).leader} ti corteggia`,
    text: c => `${P(c.p).leader} ti offre un ruolo di primo piano se passi a ${P(c.p).name}.`,
    choices: c => [
      { t: 'Accettare e cambiare partito', fx: { cred: -6, fama: 4 }, r: '', run: () => { const p = G.player, old = myPid(); addRel(old, c.p, -8); G.player.party = c.p; p.rank = Math.max(3, Math.min(p.rank, 5)); p.rap = 30; p.seguito = 5; if (p.parl) { const k = p.parl === 'C' ? 'seatsC' : 'seatsS'; P(old)[k]--; P(c.p)[k]++; } addNews(`${p.name} lascia ${P(old).short} e passa a ${P(c.p).short}.`, 'mio'); G.careerLog.push({ w: G.week, t: `Passi a ${P(c.p).short}` }); } },
      { t: 'Rifiutare e dirlo al tuo leader', fx: { rap: 10 }, r: 'Lealtà premiata.' },
    ] },
];

const EVENT_BY_ID = {}; EVENTS.forEach(e => { EVENT_BY_ID[e.id] = e; });

function eventFits(e) {
  const r = role();
  if (e.for === 'premier' && r !== 'premier') return false;
  if (e.for === 'nogov' && r === 'premier') return false;
  if (e.for === 'leader' && !isLeader()) return false;
  if (e.for === 'member' && isLeader()) return false;
  if (e.chain) return false;
  if (e.once && G.seenEvents[e.id]) return false;
  if (G.evCool[e.id] && G.week < G.evCool[e.id]) return false;
  if (e.id === 'sondaggio_shock' && !topicFresh('sondaggi', 10)) return false;
  try { if (e.cond && !e.cond()) return false; } catch (err) { return false; }
  return true;
}
function rollEvents() {
  const n = chance(0.45 * D().events) ? 1 : 0;
  const extra = chance(0.12 * D().events) ? 1 : 0;
  for (let i = 0; i < n + extra; i++) {
    const pool = EVENTS.filter(eventFits);
    if (!pool.length) return;
    const tot = pool.reduce((s, e) => s + e.w, 0);
    let x = Math.random() * tot, ev = pool[0];
    for (const e of pool) { x -= e.w; if (x <= 0) { ev = e; break; } }
    let ctx = {};
    if (ev.prep) { ctx = ev.prep(); if (!ctx) continue; }
    // lo stesso evento non torna prima di un anno di gioco
    G.evCool[ev.id] = G.week + Math.max(ev.cool || 20, 52);
    G.seenEvents[ev.id] = true; if (ev.id === 'sondaggio_shock') topicMark('sondaggi');
    G.queue.push({ id: ev.id, ctx });
  }
}
function eventView(item) {
  const ev = EVENT_BY_ID[item.id]; const c = item.ctx;
  const val = v => typeof v === 'function' ? v(c) : v;
  return { img: ev.img, title: val(ev.title), text: val(ev.text), choices: ev.choices(c) };
}
