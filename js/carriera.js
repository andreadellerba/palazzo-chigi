// ============================================================
//  CARRIERA DA MINISTRO E CAMBI DI CASACCA
//  dimissioni dal ministero, sondaggi con i partiti vicini,
//  offerte che arrivano da sole, scissione restando al governo
// ============================================================

// partiti vicini: mai l'opposizione, solo chi ti somiglia o sta con te
function nearParties() {
  const me = myPid(), myC = coalitionOf(me);
  return PIDS().filter(p => {
    if (p === me || !G.parties[p] || P(p).poll < 0.8) return false;
    if (myInGov()) return inGov(p) && compat(p, me) >= 40;
    if (G.gov && inGov(p)) return false;
    return compat(p, me) >= 50 || (myC && coalitionOf(p) === myC);
  });
}
// un nuovo titolare per un ministero lasciato libero
function replaceMinister(k, party) {
  const busy = Object.values(G.gov.ministers);
  const cand = allPeople().filter(x => x.party === party && !x.isPlayer && x.name !== G.player.name && !busy.includes(x.name));
  G.gov.ministers[k] = cand.length ? pick(cand).name : randomName();
  return G.gov.ministers[k];
}

// ---------- 1. dimissioni da ministro ----------
const RESIGN_WHY = {
  protesta: { t: 'Per protesta contro il governo', d: 'Ti smarchi dalle scelte del premier: più fama e seguito, ma l’alleanza si incrina.', fx: { fama: 6, seguito: 6, rap: -6, cred: 2 } },
  coerenza: { t: 'Per coerenza, dopo una scelta che non condivido', d: 'Un gesto di principio: guadagni credibilità e rispetto.', fx: { fama: 4, rap: 2, cred: 4, integ: 1 } },
  ambizione: { t: 'Per dedicarmi al partito e alla mia corsa', d: 'Hai le mani libere per la carriera: più seguito interno, il leader si insospettisce.', fx: { seguito: 10, fama: 2, rap: -10, stress: -12 } },
};
function openResignMin() {
  const m = MIN_BY_ID[G.player.minister];
  openSheet(`${head('Dimettiti da ministro', esc(m.n))}
    <p class="muted small">Lasci il ministero e torni ${G.player.parl ? 'in Parlamento' : 'al lavoro nel partito'}. Il posto resta a ${esc(myParty().short)}, ma la notizia apre i giornali. Perché lo fai?</p>
    ${Object.keys(RESIGN_WHY).map(k => `<button class="choice" onclick="resignMinistry('${k}')"><div class="t">${esc(RESIGN_WHY[k].t)}</div><div class="small muted">${esc(RESIGN_WHY[k].d)}</div>${fxChips(RESIGN_WHY[k].fx)}</button>`).join('')}`);
}
function resignMinistry(why) {
  const p = G.player, k = p.minister, m = MIN_BY_ID[k], W = RESIGN_WHY[why];
  if (!k || !G.gov) return;
  const who = replaceMinister(k, myPid());
  p.minister = null; p.exMin = { w: G.week, k, why };
  G.gov.vice = (G.gov.vice || []).filter(n => n !== p.name);
  applyFx(W.fx);
  if (why === 'protesta') { addRel(G.gov.premierParty, myPid(), -12); if (G.gov.sat[myPid()] !== undefined && G.gov.premierParty !== myPid()) G.gov.sat[myPid()] = clamp(G.gov.sat[myPid()] - 8, 0, 100); G.gov.approval = clamp(G.gov.approval - 1, 0, 100); }
  G.flags.offerSoon = G.week + 4;
  addNews(`${p.name} si dimette da ministr${p.art === 'la' ? 'a' : 'o'} (${m.n})${why === 'protesta' ? ' in polemica con il governo' : why === 'coerenza' ? ': «Una questione di coerenza»' : ': «Ora mi dedico al partito»'}. Al suo posto ${who}.`, 'mio');
  G.careerLog.push({ w: G.week, t: `Ti dimetti da ministro (${m.n})` });
  if (why === 'protesta' && typeof remember === 'function') remember(G.gov.premierParty, 'Ti sei dimesso sbattendo la porta', 0, 'sgarbo');
  closeSheet(); renderGame();
  resultSheet('door', 'Hai lasciato il ministero', `${esc(W.d)} Nelle prossime settimane potrebbero arrivarti offerte da altri partiti vicini.`);
}

// ---------- 2. sondare un partito vicino ----------
function makeOffer(pid) {
  const p = G.player, items = [];
  if (inGov(pid) && p.minister) items.push({ k: 'min', t: `Tieni il ministero (${MIN_BY_ID[p.minister].n})` });
  if (inGov(pid) && !p.minister && G.gov && G.gov.premier !== 'PLAYER') {
    const mine = Object.keys(G.gov.ministers).filter(k => { const x = person(G.gov.ministers[k]); return x && x.party === pid && MIN_BY_ID[k]; });
    if (mine.length) { const k = mine.sort((a, b) => MIN_BY_ID[a].w - MIN_BY_ID[b].w)[0]; items.push({ k: 'newmin', m: k, t: `Un ministero: ${MIN_BY_ID[k].n}` }); }
  }
  const pool = [];
  if (p.rank < 6) pool.push({ k: 'vice', t: `Vicesegretario di ${P(pid).short}` });
  pool.push({ k: 'lista', t: 'Capolista sicuro alle prossime politiche' });
  pool.push({ k: 'corrente', t: 'Una corrente tutta tua nel partito' });
  pool.push({ k: 'tv', t: 'Spazio fisso in TV e sui giornali d’area' });
  const n = items.length ? 1 : (p.fama > 50 ? 2 : 1);
  for (let i = 0; i < n && pool.length; i++) items.push(pool.splice(irnd(0, pool.length - 1), 1)[0]);
  return { p: pid, items, extra: pool.length ? pool[irnd(0, pool.length - 1)] : null };
}
function openSonda() {
  const near = nearParties();
  if (!near.length) return resultSheet('phone', 'Nessuno da sondare', 'Non ci sono partiti abbastanza vicini a te. Le offerte dall’opposizione non le cerchi.');
  openSheet(`${head('Sonda un altro partito', 'Una telefonata riservata')}
    <p class="muted small">Chiami di nascosto un leader vicino e senti cosa ti offrirebbe se passassi con lui. Attento: la voce può arrivare al tuo partito.</p>
    <div class="list">${near.map(id => `<div class="li click" onclick="sondaAt('${id}')">${partyChip(id)}<div class="grow small">${esc(P(id).leader)}<div class="tiny muted">affinità ${fmt0(compat(id, myPid()))}% · ${inGov(id) ? 'al governo' : coalitionOf(id) && coalitionOf(id) === coalitionOf(myPid()) ? 'stessa coalizione' : 'area vicina'}</div></div><span class="small" style="color:${relColor(rel(id, myPid()))}">${rel(id, myPid()) > 0 ? '+' : ''}${fmt0(rel(id, myPid()))}</span></div>`).join('')}</div>`);
}
function sondaAt(pid) {
  if (usedThisWeek('sonda')) return toast('Hai già fatto una telefonata così questa settimana', 'bad');
  if (!spendPC(2)) return toast('Capitale politico insufficiente', 'bad');
  markUsed('sonda'); closeSheet();
  const p = G.player;
  if (chance(0.2)) { applyFx({ rap: -8 }); addNews(`Retroscena: ${p.name} in contatto con ${P(pid).short}. Gelo in ${myParty().short}.`, 'bad'); toast('La telefonata è finita sui giornali', 'bad'); }
  const interest = clamp(0.25 + compat(pid, myPid()) / 250 + p.fama / 180 + rel(pid, myPid()) / 300, 0.15, 0.92);
  if (!chance(interest)) { renderGame(); return resultSheet('phone', `${P(pid).leader} prende tempo`, `«Ti stimo, ma ora non è il momento.» Con più fama o rapporti migliori con ${esc(P(pid).short)} andrà meglio.`); }
  G.queue.unshift({ id: 'offerta_vicina', ctx: Object.assign(makeOffer(pid), { src: 'sonda' }) });
  processQueue();
}
// passare a un altro partito con il pacchetto concordato
function switchTo(pid, items) {
  const p = G.player, old = myPid(), has = k => items.some(x => x.k === k);
  addRel(old, pid, -10);
  if (p.parl) { const k = p.parl === 'C' ? 'seatsC' : 'seatsS'; if (P(old)[k] > 0) { P(old)[k]--; P(pid)[k]++; } }
  p.party = pid; p.rap = 30; p.seguito = has('corrente') ? 30 : 8;
  p.rank = has('vice') ? 6 : p.minister ? Math.max(p.rank, 6) : Math.max(3, Math.min(p.rank, 5));
  if (p.minister && G.gov) {
    if (has('min') && inGov(pid)) { if (G.gov.sat[old] !== undefined) G.gov.sat[old] = clamp(G.gov.sat[old] - 10, 0, 100); if (G.gov.sat[pid] !== undefined) G.gov.sat[pid] = clamp(G.gov.sat[pid] + 6, 0, 100); }
    else { replaceMinister(p.minister, old); p.minister = null; }
  }
  const nm = items.find(x => x.k === 'newmin');
  if (nm && G.gov && inGov(pid)) { G.gov.ministers[nm.m] = p.name; p.minister = nm.m; p.rank = Math.max(p.rank, 6); }
  if (has('lista')) p.listPromise = pid;
  if (has('tv')) applyFx({ fama: 6 });
  applyFx({ fama: 4, cred: -3 });
  addNews(`${p.name} lascia ${P(old).short} e passa a ${P(pid).short}${p.minister ? `, restando ministr${p.art === 'la' ? 'a' : 'o'}` : ''}.`, 'mio');
  G.careerLog.push({ w: G.week, t: `Passi a ${P(pid).short}` });
}
// contesti di riserva se l'evento arriva senza dati (vecchi salvataggi, test)
function offCtx(c) { if (!c.p || !G.parties[c.p] || !c.items) { const n = nearParties(); Object.assign(c, makeOffer(n[0] || PIDS().find(p => p !== myPid()))); } return c; }
function rimCtx(c) { if (!c.k || !MIN_BY_ID[c.k]) c.k = 'MEF'; return c; }
const offerText = c => c.items.map(x => x.t.charAt(0).toLowerCase() + x.t.slice(1)).join('; ') + '.';

// ---------- 3. offerte che arrivano da sole ----------
const CARRIERA_EVENTS = [
  { id: 'offerta_vicina', for: 'member', w: 1.4, cool: 26,
    cond: () => G.player.fama > 30 && nearParties().length > 0 && (G.player.rap < 15 || G.player.fama > 50 || (G.flags.offerSoon && G.week <= G.flags.offerSoon) || chance(0.4)),
    prep: () => makeOffer(pick(nearParties())), img: 'phone', look: 'call',
    title: c => offCtx(c).src === 'sonda' ? `${P(c.p).leader} ti fa un’offerta` : `${P(c.p).leader} ti corteggia`,
    text: c => `${offCtx(c).src === 'sonda' ? 'La tua telefonata ha funzionato.' : `${P(c.p).leader} ti chiama in privato.`} Se passi a ${P(c.p).name}, sul piatto c’è: ${offerText(c)}`,
    choices: c => {
      offCtx(c); const ch = [];
      ch.push({ t: `Accetto: passo a ${P(c.p).short}`, fx: {}, r: 'Cambi casacca: nuovo partito, nuove regole.', run: () => switchTo(c.p, c.items) });
      if (c.extra) { const a = { t: `Rilancio: voglio anche «${c.extra.t}»`, fx: {}, r: '' }; a.run = () => { if (chance(clamp(0.35 + G.player.fama / 200 + rel(c.p, myPid()) / 300, 0.15, 0.8))) { switchTo(c.p, c.items.concat([c.extra])); a.r = `${P(c.p).leader} accetta il rilancio: passi a ${P(c.p).short} con tutto il pacchetto.`; } else { addRel(c.p, myPid(), -6); a.r = `${P(c.p).leader} si irrita: «Hai tirato troppo la corda». L’offerta è ritirata.`; } }; ch.push(a); }
      const b = { t: 'La uso per alzare il prezzo nel mio partito', fx: {}, r: '' };
      b.run = () => { const p = G.player; if (chance(clamp(0.4 + p.rap / 200 + p.fama / 300, 0.1, 0.85))) { if (p.rank < 6 && !p.minister) { p.rank++; b.r = `${myParty().leader} non vuole perderti: diventi ${RANKS[p.rank].n.toLowerCase()}.`; } else { applyFx({ seguito: 10, rap: 4 }); b.r = `${myParty().leader} ti dà più spazio: il tuo seguito interno cresce.`; } } else { applyFx({ rap: -15 }); b.r = `${myParty().leader} la prende come una minaccia: «Chi vuole andarsene, se ne vada».`; } };
      ch.push(b);
      ch.push({ t: 'Rifiuto e lo dico al mio leader', fx: { rap: 8, rel: { [c.p]: -4 } }, r: 'Lealtà premiata.' });
      return ch;
    } },
  { id: 'rimpasto_offerta', for: 'member', w: 1, cool: 40,
    cond: () => G.player.minister && G.gov && G.gov.premier !== 'PLAYER' && G.player.fama > 35,
    prep: () => { const cur = MIN_BY_ID[G.player.minister]; if (!cur || !G.gov) return null; const ks = Object.keys(G.gov.ministers).filter(k => MIN_BY_ID[k] && MIN_BY_ID[k].w > cur.w && G.gov.ministers[k] !== G.player.name); return ks.length ? { k: pick(ks) } : null; },
    img: 'refresh', look: 'call',
    title: c => `${G.gov ? G.gov.premier : 'Il premier'} ti offre un altro ministero`,
    text: c => `${rimCtx(c) && ''}Il premier prepara un piccolo rimpasto e ti propone di passare a ${MIN_BY_ID[c.k].n}. Oggi lo guida ${(G.gov && G.gov.ministers[c.k]) || "un collega"}, che prenderebbe il tuo posto: non la prenderà bene.`,
    choices: c => [rimCtx(c)].length && [
      { t: `Accetto: vado a ${MIN_BY_ID[c.k].n}`, fx: { fama: 5, rap: 3 }, r: 'Promozione sul campo: un ministero più pesante.', run: () => { const p = G.player, old = p.minister, other = G.gov && G.gov.ministers[c.k], op = person(other); if (!old || !other) return; G.gov.ministers[c.k] = p.name; G.gov.ministers[old] = other; p.minister = c.k; if (op && G.gov.sat[op.party] !== undefined) G.gov.sat[op.party] = clamp(G.gov.sat[op.party] - 6, 0, 100); addNews(`Mini rimpasto: ${p.name} passa a ${MIN_BY_ID[c.k].n}, ${other} va a ${MIN_BY_ID[old].n}.`, 'gov'); G.careerLog.push({ w: G.week, t: `Ministro: ${MIN_BY_ID[c.k].n}` }); } },
      { t: 'Resto dove sono: il lavoro non è finito', fx: { cred: 2, rel: G.gov ? { [G.gov.premierParty]: 3 } : {} }, r: 'Il premier apprezza la serietà.' },
    ] },
  { id: 'chiamata_scissione', for: 'member', w: 1, cool: 50,
    cond: () => G.player.rank >= 3 && G.player.fama > 30 && (G.player.rap < 0 || G.player.seguito > 30),
    img: 'split', look: 'chat', title: 'Ti chiedono di guidare una scissione',
    text: () => `Un gruppo di parlamentari di ${myParty().short}, delusi da ${myParty().leader}, vuole uscire e fondare un nuovo partito. Manca solo un volto: il tuo.`,
    choices: () => [
      { t: 'Ci sto: prepariamo il nuovo partito', fx: { seguito: 10, rap: -8 }, r: 'Per due settimane «Fonda il tuo partito» costa la metà (⚡3) e ti seguono più parlamentari.', run: () => { G.flags.scInvite = G.week + 2; } },
      { t: 'Uso la minaccia per trattare col leader', fx: { seguito: 5, rap: -4 }, r: 'Il leader capisce l’antifona: ti tratta con più rispetto, ma non si fida.' },
      { t: 'Non è il momento', fx: { rap: 5 }, r: 'Il gruppo si scioglie, per ora.' },
    ] },
];
CARRIERA_EVENTS.forEach(e => { if (EVENT_BY_ID[e.id]) { const i = EVENTS.indexOf(EVENT_BY_ID[e.id]); if (i >= 0) EVENTS.splice(i, 1); } EVENTS.push(e); EVENT_BY_ID[e.id] = e; });

// ---------- azioni ----------
ACTIONS.splice(ACTIONS.findIndex(a => a.id === 'riposo'), 0,
  { id: 'dimmin', n: 'Dimettiti da ministro', ico: 'door', cost: 0, show: () => !!G.player.minister && !isPremier(), d: 'Lasci il ministero per protesta, per coerenza o per dedicarti alla tua corsa.', risk: 'Perdi il ministero', custom: () => openResignMin() },
  { id: 'sonda', n: 'Sonda un altro partito', ico: 'phone', cost: 2, show: () => !isLeader() && G.player.fama >= 15, d: 'Una telefonata riservata con un partito vicino: senti cosa ti offrirebbe per passare con lui.', risk: '20% che finisca sui giornali', custom: () => openSonda() });
ROUTINE_NO.push('dimmin', 'sonda');

// ---------- indicare un altro premier quando l'incarico spetta a te ----------
const TECNICI = ['Mario Draghi', 'Daniele Franco', 'Marta Cartabia', 'Elisabetta Belloni', 'Carlo Cottarelli', 'Fabio Panetta', 'Lucrezia Reichlin'];
function openOtherPremier(mem) {
  window._opMem = mem;
  const me = myPid(), allies = mem.filter(p => p !== me && G.parties[p]).sort((a, b) => seatsOf(b, 'C') - seatsOf(a, 'C'));
  const mates = allPeople().filter(x => x.party === me && !x.isPlayer && x.name !== G.player.name).sort((a, b) => b.comp - a.comp).slice(0, 3);
  const tech = TECNICI.filter(t => !Object.values(G.gov ? G.gov.ministers : {}).includes(t)).slice(0, 3);
  const row = (fn, arg, t, d) => `<button class="choice" onclick="${fn}('${arg}')"><div class="t">${esc(t)}</div><div class="small muted">${d}</div></button>`;
  openSheet(`${head('Indica un altro premier', 'Tu resti leader e puoi entrare nel governo')}
    ${allies.length ? sec('Un leader alleato') + allies.map(p => row('otherPremier', 'a:' + p, `${P(p).leader} (${P(p).short})`, `L’alleato è felice e il rapporto migliora molto. Tu puoi fare il vicepremier.`)).join('') : ''}
    ${mates.length ? sec(`Una persona di ${esc(myParty().short)}`) + mates.map(x => row('otherPremier', 'm:' + x.name.replace(/'/g, '’'), x.name, `Competenza ${x.comp}/10. Il governo resta in mano al tuo partito, ma il premier non sei tu.`)).join('') : ''}
    ${sec('Un tecnico esterno') + tech.map(t => row('otherPremier', 't:' + t, t, 'Mercati, Europa e Quirinale apprezzano: spread giù. Agli elettori piace meno.')).join('')}
    <button class="btn block mt2" onclick="closeSheet()">Torna indietro</button>`);
}
function otherPremier(code) {
  const mem = window._opMem, me = myPid(), kind = code[0], v = code.slice(2), p = G.player;
  let name, party, note;
  if (kind === 'a') { name = P(v).leader; party = v; }
  else if (kind === 'm') { name = (allPeople().find(x => x.name.replace(/'/g, '’') === v) || { name: v }).name; party = me; }
  else { name = v; party = null; }
  formAIGovernment(mem, name, party, kind === 't');
  if (kind === 'a') { addRel(v, me, 15); G.gov.sat[v] = clamp((G.gov.sat[v] || 60) + 15, 0, 100); applyFx({ fama: 2, cred: 2 }); note = `${name} ti ringrazia: «Un gesto di generosità che non dimenticherò».`; if (typeof remember === 'function') remember(v, 'Ti ha lasciato Palazzo Chigi', 2, 'favore'); }
  else if (kind === 'm') { G.gov.sat[me] = 88; note = `${name} guida il governo, ma la linea la detti tu da leader di ${esc(myParty().short)}.`; }
  else { applyFx({ spread: -15, grp: { merc: 8, quir: 8, ue: 5 }, my: -1 }); note = 'I mercati festeggiano, i tuoi elettori un po’ meno.'; }
  G.player.fama = clamp(p.fama + 3, 0, 100);
  addNews(`${p.name} rinuncia a Palazzo Chigi e indica ${name} come Presidente del Consiglio.`, 'mio');
  G.careerLog.push({ w: G.week, t: `Rinunci alla premiership e indichi ${name}` });
  closeSheet(true); renderGame();
  toast(note, 'good'); setTimeout(() => offerMinistry(), 400);
}
