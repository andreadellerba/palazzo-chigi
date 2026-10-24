// ============================================================
//  INTERVISTE: domande spiegate, risposte argomentate e coerenti
// ============================================================
// argomenti per ogni tema, verso sinistra (-1) o destra (1) dell'asse
const ARGS = {
  eco: { '-1': ['chi lavora e chi resta indietro ha bisogno di più tutele', 'lo Stato deve proteggere i più deboli', 'i salari italiani sono fermi da trent’anni'], '1': ['bisogna liberare chi produce e crea lavoro', 'meno tasse e meno burocrazia fanno crescere il Paese', 'i conti pubblici non sono un dettaglio'] },
  soc: { '-1': ['è una questione di diritti e di libertà', 'il Paese reale è più avanti della politica', 'nessuno deve essere discriminato'], '1': ['difendiamo la famiglia e i nostri valori', 'non tutto ciò che è possibile è anche giusto', 'gli italiani chiedono ordine e buon senso'] },
  eu: { '-1': ['l’Italia conta solo se sta al centro dell’Europa', 'da soli non andiamo da nessuna parte', 'servono regole comuni europee'], '1': ['prima vengono gli interessi nazionali', 'Bruxelles non può decidere tutto per noi', 'serve un’Europa delle nazioni'] },
  imm: { '-1': ['accoglienza e integrazione rendono il Paese più sicuro', 'abbiamo bisogno di lavoratori e di umanità', 'chi salva vite non va punito'], '1': ['servono regole e confini sicuri', 'non possiamo accogliere tutti', 'chi entra illegalmente va rimpatriato'] },
  amb: { '-1': ['la crisi climatica non aspetta', 'la transizione ecologica crea lavoro', 'dobbiamo lasciare un Paese vivibile ai nostri figli'], '1': ['non si può sacrificare l’industria all’ideologia', 'servono energia sicura e prezzi bassi', 'l’ambiente si difende col buon senso, non con i divieti'] },
  giu: { '-1': ['chi sbaglia deve pagare, basta impunità', 'la corruzione si combatte con strumenti forti', 'i magistrati devono poter lavorare'], '1': ['si è innocenti fino a sentenza definitiva', 'i processi devono essere giusti e rapidi', 'basta gogna mediatica'] },
  terr: { '-1': ['l’Italia deve restare unita', 'il Sud non può restare indietro', 'servono gli stessi diritti da Bolzano a Palermo'], '1': ['più autonomia a chi amministra bene', 'i territori conoscono i loro bisogni', 'meno centralismo romano'] },
  ist: { '-1': ['il Parlamento è il cuore della democrazia', 'servono contrappesi, non uomini soli al comando', 'la Costituzione va rispettata'], '1': ['i cittadini devono scegliere chi governa', 'serve stabilità, basta governi che durano un anno', 'chi vince deve poter governare'] },
};

function interviewTopics(n) {
  const out = [];
  const live = G.bills.filter(b => !b.dead && b.lawId && b.opt !== G.laws[b.lawId]).sort(() => Math.random() - 0.5);
  live.slice(0, 1).forEach(b => out.push({ kind: 'law', law: getLaw(b.lawId), to: b.opt, from: G.laws[b.lawId], by: b.proposer }));
  const hot = allLaws().filter(l => !l.custom && l.sal >= 2 && !out.some(t => t.law && t.law.id === l.id)).sort(() => Math.random() - 0.5);
  while (out.length < 2 && hot.length) {
    const l = hot.shift();
    const others = l.opts.map((o, i) => i).filter(i => i !== G.laws[l.id]);
    out.push({ kind: 'law', law: l, to: pick(others), from: G.laws[l.id], by: null });
  }
  const kinds = ['alleanza', 'governo', 'sondaggi'];
  if (!isLeader()) kinds.push('leader', 'leader');
  if (G.player.fama > 40) kinds.push('personale');
  while (out.length < n) out.push({ kind: pick(kinds) });
  return out.sort(() => Math.random() - 0.5);
}
function interviewQuestion(t, show) {
  if (t.kind === 'law') return lawQuestion(t, show);
  return otherQuestion(t.kind, show);
}

function lawQuestion(t, show) {
  const l = t.law, o = l.opts[t.to], cur = l.opts[t.from];
  const dir = o.pos >= cur.pos ? 1 : -1;
  const who = t.by === 'GOV' ? (isPremier() ? 'Il suo governo' : `Il ${G.gov ? G.gov.name : 'governo'}`) : t.by && t.by !== 'PLAYER' && G.parties[t.by] ? `${P(t.by).leader} (${P(t.by).short})` : null;
  const lean = show && show.lean < -0.3 ? 'Il nostro pubblico è molto sensibile al tema. ' : show && show.lean > 0.3 ? 'I nostri telespettatori se lo chiedono ogni giorno. ' : '';
  const q = who ? `${who} propone «${o.t}». Lei come voterebbe?` : lean + pick([
    `Parliamo di «${l.nome}»: lei è favorevole a «${o.t}»?`,
    `Molti chiedono «${o.t}». Qual è la sua posizione?`,
    `Tema «${l.nome}»: gli italiani si dividono. «${o.t}», sì o no?`,
    `Se domani si votasse «${o.t}», cosa farebbe il suo partito?`,
  ]);
  const explain = `<div class="tiny gold" style="font-weight:800">DI COSA SI PARLA</div><div class="small"><b>${esc(o.t)}</b>: ${esc(o.d)}</div><div class="tiny muted mt">Oggi: ${esc(cur.t)}${t.from === l.cur ? ' — ' + esc(l.attuale) : ''}</div>`;
  const my = lawGain(myPid(), l, t.from, t.to);
  const mood = (Math.abs(G.mood[l.ax] - cur.pos) - Math.abs(G.mood[l.ax] - o.pos)) / 10 * l.sal + (o.e.pop || 0) * 0.15;
  const mk = (txt, f, kind) => {
    const pro = [], contro = [];
    let coh = 0;
    if (kind === 'yes') coh = my > 0.15 ? 1 : my < -0.15 ? -1 : 0;
    if (kind === 'no') coh = my < -0.15 ? 1 : my > 0.15 ? -1 : 0;
    if (kind === 'mid') coh = Math.abs(my) < 0.35 ? 0.6 : -0.2;
    if (coh > 0.5) pro.push({ k: 'pol', t: 'Coerente con la linea del tuo partito' });
    else if (coh < 0) contro.push({ k: 'pol', t: coh <= -1 ? 'Contraddice la linea del tuo partito' : 'Risposta tiepida per la tua base' });
    const pub = f * mood;
    if (pub > 0.08) pro.push({ k: 'pop', t: 'La maggioranza del pubblico è d’accordo' });
    else if (pub < -0.08) contro.push({ k: 'pop', t: 'La maggioranza del pubblico non è d’accordo' });
    const likes = [], hates = [];
    PIDS().forEach(pid => { if (pid === myPid()) return; const g = lawGain(pid, l, t.from, t.to) * f; if (g > 0.25) likes.push(pid); else if (g < -0.25) hates.push(pid); });
    if (likes.length) pro.push({ k: 'pol', t: 'Piace a ' + likes.slice(0, 4).map(x => P(x).short).join(', ') });
    if (hates.length) contro.push({ k: 'pol', t: 'Irrita ' + hates.slice(0, 4).map(x => P(x).short).join(', ') });
    if (kind === 'mid') contro.push({ k: 'pop', t: 'Rischi di sembrare indeciso' });
    return { t: txt, pre: { pro, contro }, apply: sh => {
      const p = G.player, lines = [];
      const spinta = coh * 0.9 + pub * 1.2 + (p.car - 6) * 0.12;
      applyFx({ my: spinta * 0.8, fama: (sh ? sh.reach : 2) * 0.8 });
      if (coh <= -1) {
        applyFx({ cred: -4 }); lines.push('I tuoi elettori non capiscono: è l’opposto della linea del partito.');
        if (!isLeader()) { applyFx({ rap: -6, fama: 2 }); lines.push(`${P(myPid()).leader} non gradisce l’uscita fuori linea.`); }
      } else if (coh > 0.5) { applyFx({ cred: 1 }); lines.push('Risposta coerente con la linea: la base apprezza.'); if (!isLeader()) applyFx({ rap: 2 }); }
      if (pub > 0.08) lines.push('Sondaggio istantaneo: il pubblico è con te.');
      else if (pub < -0.08) lines.push('Il pubblico in studio rumoreggia: in molti la pensano diversamente.');
      likes.forEach(x => addRel(x, myPid(), 3)); hates.forEach(x => addRel(x, myPid(), -3));
      if (likes.length) lines.push(`Apprezzamenti da ${likes.slice(0, 3).map(x => P(x).short).join(', ')}.`);
      if (hates.length) lines.push(`Critiche da ${hates.slice(0, 3).map(x => P(x).short).join(', ')}.`);
      if (isPremier()) G.gov.popBank += spinta * 0.3;
      return { lines, good: spinta > 0.25 };
    } };
  };
  const costly = (o.costo || 0) - (cur.costo || 0) > 1;
  return { q, explain, answers: [
    mk(`«Sì: ${pick(ARGS[l.ax][dir])}.»`, 1, 'yes'),
    mk(`«No: ${pick(ARGS[l.ax][-dir])}.»`, -1, 'no'),
    mk(costly ? '«In parte: l’obiettivo è giusto, ma va finanziata senza fare nuovo debito.»' : '«In parte: serve gradualità e un confronto con le parti sociali.»', 0.35, 'mid'),
    dodgeAnswer(),
  ] };
}

function dodgeAnswer() {
  const opp = PIDS().filter(p => p !== myPid() && (isPremier() ? !inGov(p) : inGov(p))).sort((a, b) => P(b).poll - P(a).poll)[0];
  const tgt = opp ? P(opp).leader : 'i nostri avversari';
  return { t: `«Lo chieda a ${tgt}: ${isPremier() ? 'quando governavano non hanno risolto nulla' : 'governano e non hanno risolto nulla'}.»`,
    pre: { pro: [{ k: 'per', t: 'Notorietà, clip virale se ti riesce' }], contro: [{ k: 'pol', t: 'Non rispondi: credibilità −1' }, { k: 'pol', t: opp ? `Irrita ${P(opp).short}` : 'Toni da comizio' }] },
    apply: () => {
      const ok = G.player.car + rnd(-3, 3) > 6.5;
      applyFx({ fama: ok ? 3 : 1, my: ok ? 0.6 : -0.4, cred: -1 }); if (opp) addRel(opp, myPid(), -4);
      return { lines: [ok ? 'La battuta funziona: la clip gira sui social.' : 'Il conduttore incalza: «Non ha risposto alla domanda». Brutta figura.'], good: ok };
    } };
}

function otherQuestion(kind, show) {
  const p = G.player, mp = myParty();
  const A = (t, fx, pro, contro, lines, good) => ({ t, pre: { pro: pro.map(x => ({ k: x[0], t: x[1] })), contro: contro.map(x => ({ k: x[0], t: x[1] })) },
    apply: () => { applyFx(Object.assign({ fama: (show ? show.reach : 2) * 0.6 }, fx)); return { lines, good }; } });
  if (kind === 'alleanza') {
    const cands = PIDS().filter(x => x !== myPid() && !never(x, myPid())).sort((a, b) => P(b).poll - P(a).poll).slice(0, 6);
    const x = cands.length ? pick(cands) : 'PD';
    const c = compat(x, myPid()), close = c >= 55;
    return { q: `Alle prossime elezioni vi alleerete con ${P(x).name} di ${P(x).leader}?`,
      explain: `<div class="small">Affinità tra ${esc(mp.short)} e ${esc(P(x).short)}: <b style="color:${pctColor(c)}">${fmt0(c)}%</b> · rapporto attuale ${rel(x, myPid()) > 0 ? '+' : ''}${fmt0(rel(x, myPid()))}</div>`,
      answers: [
        A(`«Sì, con ${P(x).short} abbiamo molto in comune e lavoreremo insieme.»`, { rel: { [x]: 8 }, my: close ? 0.5 : -0.8, cred: close ? 1 : -3 }, [['pol', `Rapporto con ${P(x).short} +8`]].concat(close ? [['pop', 'I tuoi elettori approvano']] : []), close ? [] : [['pop', 'Parte dei tuoi elettori non capisce l’alleanza']], [close ? 'Apertura apprezzata da entrambi gli elettorati.' : 'Sui social i tuoi sostenitori protestano.'], close),
        A(`«Mai con ${P(x).short}: abbiamo idee opposte.»`, { rel: { [x]: -10 }, my: close ? -0.4 : 0.6, cred: close ? -1 : 1 }, close ? [] : [['pop', 'La tua base apprezza la chiarezza']], [['pol', `Rapporto con ${P(x).short} −10`]].concat(close ? [['pol', 'Ti chiudi una porta utile']] : []), [close ? 'Molti commentatori parlano di occasione persa.' : 'Risposta netta, la base applaude.'], !close),
        A('«Decideremo sui programmi, non sulle sigle.»', { rel: { [x]: 2 } }, [['pol', 'Lasci aperte tutte le strade']], [['pop', 'Risposta prudente, poco incisiva']], ['Risposta prudente.'], false),
      ] };
  }
  if (kind === 'governo') {
    if (isPremier()) {
      const good = G.econ.pil > 0.7 && G.econ.spread < 150;
      return { q: 'Presidente, le opposizioni dicono che il suo governo ha fallito. Cosa risponde?',
        explain: `<div class="small">Crescita ${sgn(G.econ.pil)}%, spread ${fmt0(G.econ.spread)}, consenso del governo ${fmt0(G.gov.approval)}%.</div>`,
        answers: [
          A('«I numeri parlano: occupazione, spread e conti sono migliori di come li abbiamo trovati.»', { appr: good ? 1.5 : -1 }, good ? [['pop', 'I dati sono dalla tua parte']] : [], good ? [] : [['pop', 'I dati non ti danno ragione: rischio fact-checking']], [good ? 'Rivendicazione convincente.' : 'I fact-checker ti smentiscono il giorno dopo.'], good),
          A('«Abbiamo fatto errori, ma stiamo correggendo la rotta.»', { appr: 0.5, cred: 3 }, [['pol', 'Credibilità +3'], ['pop', 'Sembri sincero']], [['pol', 'Gli avversari useranno l’ammissione']], ['L’ammissione colpisce: in molti apprezzano.'], true),
          A('«Paghiamo i disastri di chi c’era prima.»', { appr: 0.3, cred: -1 }, [['pol', 'La tua base gradisce']], [['pol', 'Scaricabarile: credibilità −1']], ['Risposta classica, effetto modesto.'], false),
        ] };
    }
    const g = G.gov; if (!g) return otherQuestion('sondaggi', show);
    const opp = !inGov(myPid()), pp = g.premierParty;
    return { q: `Che voto dà al ${g.name}?`,
      explain: `<div class="small">Consenso del governo: <b>${fmt0(g.approval)}%</b>. ${opp ? 'Tu sei all’opposizione.' : 'Il tuo partito fa parte della maggioranza.'}</div>`,
      answers: [
        A('«Bocciato: tasse, sanità e salari, hanno fallito su tutto.»', opp ? { my: 0.7, rel: pp ? { [pp]: -3 } : {} } : { my: -0.5, rel: pp ? { [pp]: -10 } : {}, rap: isLeader() ? 0 : -10 }, opp ? [['pop', 'La tua base apprezza la durezza']] : [['per', 'Fa notizia']], opp ? [['pol', pp ? `Irrita ${P(pp).short}` : 'Scontro col governo']] : [['pol', 'Attacchi il tuo stesso governo']], [opp ? 'Bordata efficace.' : 'Fuoco amico: la maggioranza si agita.'], opp),
        A('«Promosso: sta facendo bene.»', opp ? { my: -0.6, rel: pp ? { [pp]: 6 } : {} } : { my: 0.3, rel: pp ? { [pp]: 4 } : {}, rap: 3 }, opp ? [['pol', pp ? `${P(pp).short} apprezza` : 'Toni concilianti']] : [['pol', 'Lealtà alla maggioranza']], opp ? [['pop', 'I tuoi elettori non capiscono']] : [], [opp ? 'Giudizio sorprendente per un oppositore.' : 'Difesa compatta del governo.'], !opp),
        A('«Luci e ombre: bene su alcune cose, male su salari e sanità.»', { cred: 1 }, [['pol', 'Credibilità +1: sembri equilibrato']], [['pop', 'Poco incisivo']], ['Giudizio equilibrato.'], true),
      ] };
  }
  if (kind === 'leader') {
    const L = myParty().leader;
    return { q: `Lei è d’accordo con la linea di ${L}?`,
      explain: `<div class="small">Rapporto con ${esc(L)}: <b style="color:${relColor(p.rap)}">${p.rap > 0 ? '+' : ''}${fmt0(p.rap)} (${relLabel(p.rap)})</b> · seguito interno ${fmt0(p.seguito)}%</div>`,
      answers: [
        A(`«Pienamente: ${firstName(L)} è la guida giusta.»`, { rap: 7 }, [['pol', `Rapporto con ${L} +7`]], [['per', 'Poca visibilità personale']], ['Il leader apprezza la lealtà.'], true),
        A('«Su quasi tutto sì, su alcune cose discuteremo dentro il partito.»', { rap: -2, seguito: 2, fama: 1 }, [['pol', 'Seguito interno +2']], [['pol', 'Rapporto col leader −2']], ['Equilibrio apprezzato dalla tua area.'], true),
        A('«Serve un cambio di passo, anche ai vertici.»', { rap: -14, seguito: 5, fama: 4 }, [['per', 'Notorietà +4'], ['pol', 'Seguito interno +5']], [['pol', `Rapporto con ${L} −14`]], ['Titoli sui giornali: «Sfida al leader?»'], true),
      ] };
  }
  if (kind === 'personale') {
    return { q: 'Si candiderà a guidare il Paese?', explain: `<div class="small">Fama ${fmt0(p.fama)} · ${esc(mp.short)} al ${fmt1(mp.poll)}%</div>`,
      answers: [
        A('«Se gli italiani me lo chiederanno, sono pronto.»', { fama: 3, my: 0.4, rap: isLeader() ? 0 : -6 }, [['per', 'Notorietà +3'], ['pop', 'Sembri ambizioso e determinato']], isLeader() ? [] : [['pol', `${myParty().leader} si sente sfidato`]], ['Dichiarazione da leader.'], true),
        A('«Oggi penso solo al lavoro da fare.»', { cred: 1 }, [['pol', 'Credibilità +1']], [['per', 'Poca notizia']], ['Risposta istituzionale.'], false),
      ] };
  }
  // sondaggi
  const old = G.hist.polls.length > 8 ? (G.hist.polls[G.hist.polls.length - 9].p[myPid()] || mp.poll) : mp.poll;
  const up = mp.poll >= old;
  return { q: `I sondaggi vi danno al ${fmt1(mp.poll)}%, ${up ? 'in crescita' : 'in calo'}. ${up ? 'Qual è il segreto?' : 'Cosa non funziona?'}`,
    explain: `<div class="small">Due mesi fa: ${fmt1(old)}%</div>`,
    answers: [
      A(up ? '«Parliamo dei problemi veri delle famiglie.»' : '«I sondaggi sbagliano: nelle piazze vediamo altro.»', { my: up ? 0.4 : 0.1 }, [['pop', up ? 'Messaggio chiaro' : 'Mostri sicurezza']], up ? [] : [['pol', 'Poco credibile se il calo continua']], ['Il pubblico prende nota.'], up),
      A(up ? '«Merito della squadra e dei militanti.»' : '«Abbiamo sbagliato a comunicare: cambieremo passo.»', { cred: 2, my: 0.2 }, [['pol', 'Credibilità +2']], [], ['Risposta umile, apprezzata.'], true),
    ] };
}
