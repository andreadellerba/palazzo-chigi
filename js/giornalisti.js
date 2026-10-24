// ============================================================
//  LE TELEFONATE DEI GIORNALISTI: conversazioni a più battute
//  Ogni scenario dipende da cosa sta succedendo nella partita;
//  alla fine il giornale esce con un titolo che dipende da te.
// ============================================================
function journalistScenario(j) {
  const me = myPid(), out = [];
  const bill = G.bills.find(b => !b.dead && b.stages[b.stage] && b.stages[b.stage].k === 'aula');
  const prom = G.promises.find(p => !p.kept && G.week - p.w > 20);
  const weakAlly = isPremier() ? G.gov.parties.find(p => p !== me && G.gov.sat[p] < 45) : null;
  const rival = PIDS().filter(p => p !== me).sort((a, b) => P(b).poll - P(a).poll)[0];
  out.push({ id: 'esclusiva' }, { id: 'sondaggio', d: { poll: myParty().poll } }, { id: 'vecchio_post', d: { su: pick(['i meridionali', 'il calcio femminile', 'i vegani', 'l’Europa', 'i ciclisti', 'gli insegnanti']) } }, { id: 'vacanze' }, { id: 'scoop', d: { p: rival } });
  if (j.rel < -10) out.push({ id: 'retroscena' }, { id: 'retroscena' });
  if (bill) out.push({ id: 'voto', d: { b: bill.id } });
  if (prom) out.push({ id: 'promessa', d: { l: prom.lawId, o: prom.opt } });
  if (weakAlly) out.push({ id: 'alleato', d: { p: weakAlly } });
  if (G.econ.spread > 150 || G.econ.deficit > 3.2) out.push({ id: 'conti' });
  return pick(out);
}
// il titolo che esce il giorno dopo
const jHead = (j, t) => ({ head: t, run2: () => addNews(`${j.t}: «${t}»`, 'info') });
function journalistCallView(c, j) {
  const d = c.d || {}, me = myParty(), you = isPremier() ? 'Presidente' : firstName(G.player.name), nm = G.player.name;
  const base = { face: jPortrait(j, 96), who: j.n, sub: `${j.t} · ${jLabel(j)}` };
  const rel = v => () => { j.rel = clamp(j.rel + v, -100, 100); };
  let sc = null;
  if (c.sc === 'retroscena') sc = { line: `Sono ${j.n} di ${j.t}. Domani pubblichiamo un retroscena: nel suo partito c’è chi dice che decide tutto da solo. Vuole commentare?`, ans: [
    Object.assign({ t: 'Smentisco tutto', fx: { appr: -0.2 }, run: rel(-5), r: 'Il pezzo esce con la smentita in fondo.' }, jHead(j, `Malumori in ${me.short}, ma ${nm} smentisce`)),
    { t: 'Le spiego come stanno le cose', fx: {}, run: rel(5), next: { line: 'D’accordo, mi dica: chi la critica dentro il partito?', ans: [
      Object.assign({ t: '«Nessun nome: le critiche fanno bene»', fx: { cred: 2, seguito: 1 }, r: 'Pezzo equilibrato: ne esci bene.' }, jHead(j, `${nm}: «Le critiche ci fanno crescere»`)),
      Object.assign({ t: '«Chi ha perso il congresso»', fx: { fama: 2, rap: -3, seguito: -2 }, r: 'Il partito si spacca sui giornali.' }, jHead(j, `Resa dei conti in ${me.short}`))] } },
    Object.assign({ t: 'Se lo pubblica, la querelo', fx: { grp: { media: -6 }, fama: 1 }, run: rel(-15), r: 'La minaccia diventa la notizia.' }, jHead(j, `${nm} minaccia querela a ${j.t}`))] };
  else if (c.sc === 'sondaggio') sc = { line: `${you}, ${j.n} di ${j.t}. Domani usciamo con un sondaggio che dà ${me.short} al ${fmt1(d.poll || me.poll)}%. Che lettura ne dà?`, ans: [
    Object.assign({ t: '«I sondaggi veri sono le elezioni»', fx: { cred: 1 }, r: 'Risposta classica, non fa danni.' }, jHead(j, `${nm}: «Contano solo le urne»`)),
    { t: '«È solo l’inizio: cresceremo ancora»', fx: { fama: 2, my: 0.2 }, run: rel(2), next: { line: 'Addirittura? Fino a quanto pensa di arrivare?', ans: [
      Object.assign({ t: '«Primo partito entro due anni»', fx: { fama: 3, cred: -1 }, r: 'Ambizione da prima pagina.' }, jHead(j, `${nm} sfida tutti: «Saremo il primo partito»`)),
      Object.assign({ t: '«Abbastanza per decidere il governo»', fx: { cred: 1, fama: 1 }, r: 'Messaggio chiaro agli alleati.' }, jHead(j, `${me.short} vuole essere decisiva`))] } }] };
  else if (c.sc === 'vecchio_post') sc = { line: `Buongiorno, ${j.n} di ${j.t}. È riemerso un suo post di dieci anni fa, molto duro su ${d.su || 'l’Europa'}. Vuole scusarsi?`, ans: [
    Object.assign({ t: 'Chiedo scusa, ero un’altra persona', fx: { cred: 1, fama: 1 }, run: rel(3), r: 'Scuse accettate: il caso dura un giorno.' }, jHead(j, `Il vecchio post di ${nm}: «Chiedo scusa»`)),
    Object.assign({ t: 'Era una battuta, non esageriamo', fx: { fama: 2, my: -0.2 }, r: 'La polemica va avanti per giorni.' }, jHead(j, `${nm} non si scusa: «Era ironia»`)),
    Object.assign({ t: 'Lei fa gossip, non giornalismo', fx: { grp: { media: -4 } }, run: rel(-10), r: 'Ora sei tu la notizia.' }, jHead(j, `${nm} attacca la stampa`))] };
  else if (c.sc === 'vacanze') sc = { line: `${j.n} di ${j.t}. Abbiamo le foto della sua ultima vacanza: barca, isola, amici importanti. Le pubblichiamo domani, vuole dire qualcosa?`, ans: [
    Object.assign({ t: 'Pagata di tasca mia, ecco le ricevute', fx: { integ: 1, cred: 2 }, r: 'Trasparenza: il caso si sgonfia.' }, jHead(j, `Le vacanze di ${nm}: «Tutto pagato da me»`)),
    Object.assign({ t: 'Anche i politici vanno in vacanza', fx: { appr: -0.2, fama: 1 }, r: 'Qualche invidia sui social.' }, jHead(j, `Barca e isola: l’estate di ${nm}`)),
    { t: 'Le chiedo di non pubblicarle', fx: {}, run: rel(-4), next: { line: 'Mi dia una buona ragione per non farlo.', ans: [
      Object.assign({ t: 'In cambio le do un’intervista esclusiva', fx: { fama: 2 }, run: rel(8), r: 'Le foto restano nel cassetto. Per ora.' }, jHead(j, `Intervista esclusiva a ${nm}`)),
      { t: 'C’erano i miei figli', fx: { cred: 1 }, run: rel(2), r: 'Pubblica solo le foto senza i bambini.' }] } }] };
  else if (c.sc === 'scoop' && G.parties[d.p]) sc = { line: `${you}, ${j.n} di ${j.t}, parliamo fuori registrazione. Ho un’informazione imbarazzante su ${leaderName(d.p)}. Gliela do, ma in cambio voglio la prima intervista quando succede qualcosa di grosso.`, ans: [
    Object.assign({ t: 'Affare fatto', fx: { integ: -1 }, run: () => { j.rel = clamp(j.rel + 10, -100, 100); P(d.p).spinta -= 0.5; addRel(d.p, myPid(), -4); }, r: 'Il pezzo esce: il rivale è in difficoltà, e tu hai un debito con un giornalista.' }, jHead(j, `Imbarazzo per ${leaderName(d.p)}`)),
    { t: 'Non faccio questi giochi', fx: { integ: 1, cred: 1 }, run: rel(-2), r: '«Peccato, lo darò a qualcun altro.»' }] };
  else if (c.sc === 'voto') { const b = G.bills.find(x => x.id === d.b); if (b) sc = { line: `${you}, ${j.n} di ${j.t}. In aula si vota «${billName(b)}»: come voterete? Ci sono dissidenti nel suo gruppo?`, ans: [
    Object.assign({ t: 'Voteremo compatti, come deciso', fx: { cred: 1 }, r: 'Nessuna sorpresa annunciata.' }, jHead(j, `«${billName(b)}»: ${me.short} compatta`)),
    Object.assign({ t: 'Ognuno voterà secondo coscienza', fx: { fama: 1, rap: -2 }, r: 'Il leader non gradisce.' }, jHead(j, `Libertà di coscienza in ${me.short}`)),
    { t: 'Lo scoprirà in aula', fx: {}, run: rel(-3), r: 'Risposta evasiva.' }] }; }
  else if (c.sc === 'promessa') { const l = getLaw(d.l); if (l) sc = { line: `${you}, ${j.n} di ${j.t}. Aveva promesso «${l.opts[d.o].t}». È passato tanto tempo: che fine ha fatto?`, ans: [
    Object.assign({ t: 'Arriva entro l’anno, ci metto la faccia', fx: { cred: 1, fama: 1 }, r: 'Ora gli elettori aspettano: ti conviene mantenerla.' }, jHead(j, `${nm}: «La riforma entro l’anno»`)),
    Object.assign({ t: 'Le priorità sono cambiate', fx: { cred: -3 }, r: 'Gli avversari ti rinfacciano la promessa.' }, jHead(j, `Promessa mancata: ${l.opts[d.o].t}`)),
    Object.assign({ t: 'Colpa degli alleati che frenano', fx: { cred: -1, sat: -2 }, r: 'Gli alleati se la prendono.' }, jHead(j, `${nm} scarica sugli alleati`))] }; }
  else if (c.sc === 'alleato' && G.parties[d.p]) sc = { line: `${you}, ${j.n} di ${j.t}. Ci risulta che ${leaderName(d.p)} stia valutando di lasciare la maggioranza. Conferma?`, ans: [
    Object.assign({ t: 'Il governo è solido', fx: { appr: 0.2 }, r: 'Smentita di rito.' }, jHead(j, `${nm}: «Il governo è solido»`)),
    Object.assign({ t: 'Gli parlerò io, oggi stesso', fx: { satP: { [d.p]: 4 }, pc: -1 }, r: 'La telefonata con l’alleato fa notizia.' }, jHead(j, `Vertice tra ${nm} e ${leaderName(d.p)}`)),
    Object.assign({ t: 'Chi vuole andarsene, vada', fx: { fama: 2, satP: { [d.p]: -8 } }, r: 'Scontro aperto.' }, jHead(j, `Gelo nella maggioranza: «Chi vuole andarsene, vada»`))] };
  else if (c.sc === 'conti') sc = { line: `${you}, ${j.n} di ${j.t}. Spread a ${fmt0(G.econ.spread)} e deficit al ${fmt1(G.econ.deficit)}%: i mercati sono preoccupati. E lei?`, ans: [
    Object.assign({ t: 'Nessun allarme: i fondamentali sono buoni', fx: { spread: 5 }, r: 'I mercati non si fidano del tutto.' }, jHead(j, `${nm}: «Nessun allarme sui conti»`)),
    Object.assign({ t: 'Prepariamo una correzione dei conti', fx: { spread: -10, appr: -0.4, grp: { merc: 3 } }, r: 'Spread in calo, malumori in maggioranza.' }, jHead(j, 'In arrivo una correzione dei conti')),
    Object.assign({ t: 'Colpa della speculazione', fx: { fama: 1, grp: { merc: -3 } }, r: 'Titoli duri sui giornali finanziari.' }, jHead(j, `${nm} contro gli speculatori`))] };
  if (!sc) sc = { line: `${you}, sono ${j.n} di ${j.t}. Le propongo un’intervista esclusiva per domani: i lettori vogliono sapere cosa pensa davvero.`, ans: [
    { t: 'Volentieri, cominciamo', fx: {}, run: rel(4), next: { line: 'Allora, prima domanda secca: qual è la cosa più importante che farà nei prossimi sei mesi?', ans: [
      Object.assign({ t: '«Più soldi in busta paga a chi lavora»', fx: { fama: 3, my: 0.3, grp: { sind: 2 } }, r: 'L’intervista finisce in prima pagina.' }, jHead(j, `${nm}: «Più soldi a chi lavora»`)),
      Object.assign({ t: '«Rimettere in ordine i conti»', fx: { fama: 2, cred: 2, grp: { merc: 2 } }, r: 'Piace agli economisti, meno ai social.' }, jHead(j, `${nm}: «Conti in ordine prima di tutto»`)),
      Object.assign({ t: '«Battere i miei avversari»', fx: { fama: 3, my: 0.1, cred: -1 }, r: 'Titolo battagliero, polemica assicurata.' }, jHead(j, `${nm} all’attacco: «Li batteremo»`))] } },
    { t: 'Non è il momento', fx: {}, run: rel(-3), r: `${j.n} prende nota: «Ci risentiamo».` }] };
  return Object.assign(base, sc);
}
