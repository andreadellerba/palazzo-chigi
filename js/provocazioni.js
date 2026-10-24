// ============================================================
//  LE PROVOCAZIONI DEI LEADER: a turno, ognuno fa parlare di sé
// ============================================================
const STUNTS = [
  { i: 'book', t: l => `Il nuovo libro di ${l}`, x: l => `${l} presenta un libro con frasi destinate a far discutere. Code in libreria e polemica nei talk show.` },
  { i: 'phone', t: l => `${l} balla su TikTok`, x: l => `Un video di ${l} che balla una canzone dell’estate supera i dieci milioni di visualizzazioni. Ironia e simpatia sui social.` },
  { i: 'mic', t: l => `${l} da un rapper in podcast`, x: l => `${l} parla di tutto per tre ore in un podcast seguitissimo dai ventenni: dalla politica alla sua playlist.` },
  { i: 'tv', t: l => `${l} litiga in diretta TV`, x: l => `In prima serata ${l} perde la pazienza con il conduttore. La clip della lite è ovunque.` },
  { i: 'chat', t: l => `Il post di ${l} su X`, x: l => `Un post notturno di ${l} contro i giudici e la stampa scatena migliaia di risposte e le reazioni di tutti i partiti.` },
  { i: 'ball', t: l => `${l} allo stadio con la maglia della squadra`, x: l => `Le foto di ${l} in curva al derby fanno il giro dei giornali sportivi e politici.` },
  { i: 'camera', t: l => `${l} in copertina in costume`, x: l => `Un settimanale pubblica le foto delle vacanze di ${l}. Gossip, meme e qualche polemica sui costi.` },
  { i: 'mega', t: l => `${l} annuncia una raccolta firme`, x: l => `${l} lancia una raccolta firme lampo per un referendum: banchetti in tutte le piazze.` },
];
function leaderStunt() {
  const pool = PIDS().filter(p => p !== myPid() && G.parties[p] && P(p).poll > 2);
  if (!pool.length) return null;
  const pid = pick(pool.flatMap(p => Array(Math.max(1, Math.round(P(p).poll / 4))).fill(p)));
  const s = pick(STUNTS.filter(x => x.i !== 'book' || pid === 'FN' || chance(0.4)));
  return { p: pid, s: STUNTS.indexOf(s) };
}
const EV_STUNT = { id: 'leader_provoca', for: 'all', w: 2, cool: 6, prep: leaderStunt, img: 'mega', look: 'social',
  title: c => STUNTS[c.s].t(leaderName(c.p)), text: c => STUNTS[c.s].x(leaderName(c.p)),
  choices: c => [
    { t: 'Attaccarlo: «Pagliacciate, il Paese ha altri problemi»', fx: { my: 0.2, fama: 1, rel: { [c.p]: -5 } }, run: () => { P(c.p).spinta += 0.2; }, r: 'Il botta e risposta dà visibilità a entrambi.' },
    { t: 'Rispondere con ironia', fx: { fama: 2, my: 0.2 }, r: 'La tua battuta gira quanto la sua.' },
    { t: 'Ignorarlo', fx: {}, run: () => { P(c.p).spinta += 0.3; }, r: 'Lui si prende la scena per qualche giorno.' },
  ] };
EVENTS.push(EV_STUNT); EVENT_BY_ID[EV_STUNT.id] = EV_STUNT;
