// ============================================================
//  REGOLA LE LEGGI: un cursore per ogni legge in vigore.
//  Lo sposti e vedi subito cosa sale, cosa scende, quanto costa
//  e chi è a favore; poi presenti tutto come pacchetto di riforme.
// ============================================================
let TUNE = null;
function openTuner(cat) {
  TUNE = { cat: cat || (UI.lawCat !== 'Tutte' ? UI.lawCat : 'Fisco'), ch: (TUNE && TUNE.ch) || {} };
  openSheet('', { full: true, locked: true });
  renderTuner();
}
// le opzioni di una legge ordinate da un estremo all'altro del suo tema
const tuneOrder = l => l.opts.map((o, i) => ({ o, i })).sort((a, b) => a.o.pos - b.o.pos || (a.o.costo || 0) - (b.o.costo || 0));
function tuneSummary() {
  const raw = { pil: 0, deficit: 0, spread: 0, lavoro: 0, prezzi: 0, consenso: 0 };
  const parties = {};
  let n = 0;
  Object.entries(TUNE.ch).forEach(([id, opt]) => {
    const l = getLaw(id), cur = G.laws[id]; if (!l || opt === cur) return; n++;
    const r = effectsRaw(l, cur, opt); Object.keys(raw).forEach(k => { raw[k] += r[k]; });
    PIDS().forEach(p => { parties[p] = (parties[p] || 0) + lawGain(p, l, cur, opt); });
  });
  return { raw, parties, n };
}
function renderTuner() {
  const sh = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null, st = sh ? sh.scrollTop : 0;
  const cats = Object.keys(LAW_CATS).filter(c => visibleLaws().some(l => l.cat === c && !l.custom && !l.cost));
  const busy = new Set(G.bills.filter(b => !b.dead && b.lawId).map(b => b.lawId));
  const S = tuneSummary();
  const fmtV = (k, v) => k === 'deficit' ? `${v > 0 ? '+' : ''}${fmt1(v)}% PIL` : k === 'spread' ? `${v > 0 ? '+' : ''}${fmt0(v)}` : k === 'consenso' ? `${v > 0 ? '+' : ''}${fmt1(v)}` : `${v > 0 ? '+' : ''}${(Math.round(v * 100) / 100).toString().replace('.', ',')}`;
  const rows = Object.keys(METRICS).map(k => { const v = S.raw[k]; if (Math.abs(v) < EFF_THR[k]) return ''; const good = (v > 0 ? 1 : -1) * METRICS[k].good > 0; return `<div class="tsum ${good ? 'g' : 'b'}">${icon(METRICS[k].ico, 16)}<span class="grow">${METRICS[k].n}</span><b>${v > 0 ? '▲' : '▼'} ${fmtV(k, v)}</b></div>`; }).join('');
  const fav = Object.entries(S.parties).filter(([p, v]) => v > 0.3).sort((a, b) => b[1] - a[1]).map(([p]) => p);
  const con = Object.entries(S.parties).filter(([p, v]) => v < -0.3).sort((a, b) => a[1] - b[1]).map(([p]) => p);
  let h = `<div class="row between"><button class="btn sm" onclick="TUNE=null;closeSheet()">Chiudi</button><span class="tag o">${icon('gear')} Regola le leggi</span><button class="btn sm" onclick="TUNE.ch={};renderTuner()">Azzera</button></div>
    <div class="card hero mt tune-top"><div class="row between"><b>${S.n ? `${S.n} ${S.n > 1 ? 'modifiche' : 'modifica'}` : 'Sposta un cursore'}</b><span class="tiny muted">effetto all’anno</span></div>
      ${S.n ? (rows || '<div class="small muted mt">Effetti economici minimi.</div>') + `<div class="row wrap mt" style="gap:4px"><span class="tiny good" style="font-weight:800">A FAVORE</span>${fav.map(partyChip).join('') || '<span class="tiny dim">nessuno</span>'}</div><div class="row wrap" style="gap:4px;margin-top:6px"><span class="tiny bad" style="font-weight:800">CONTRO</span>${con.map(partyChip).join('') || '<span class="tiny dim">nessuno</span>'}</div>` : '<div class="small muted mt">Ogni legge ha un cursore: spostalo e qui vedi cosa sale e cosa scende.</div>'}</div>
    <div class="scrollx">${cats.map(c => `<button class="fchip ${TUNE.cat === c ? 'on' : ''}" onclick="TUNE.cat='${c}';renderTuner()">${icon(CAT_ICON[c] || 'folder')} ${c}</button>`).join('')}</div>`;
  visibleLaws().filter(l => l.cat === TUNE.cat && !l.custom && !l.cost).forEach(l => {
    const ord = tuneOrder(l), cur = G.laws[l.id], sel = TUNE.ch[l.id] !== undefined ? TUNE.ch[l.id] : cur;
    const pos = ord.findIndex(x => x.i === sel), curPos = ord.findIndex(x => x.i === cur), changed = sel !== cur;
    const dc = (l.opts[sel].costo || 0) - (l.opts[cur].costo || 0);
    h += `<div class="card tight ${changed ? 'tuned' : ''}"><div class="row between"><b class="small">${esc(l.nome)}</b>${busy.has(l.id) ? `<span class="tag w">in Parlamento</span>` : changed ? `<span class="tag ${dc > 0.05 ? 'b' : dc < -0.05 ? 'g' : ''}">${dc > 0 ? '+' : ''}${fmt1(dc)} mld</span>` : ''}</div>
      <div class="tune-val ${changed ? 'gold' : ''}">${esc(l.opts[sel].t)}</div>
      <div class="tune-rail"><input type="range" min="0" max="${ord.length - 1}" step="1" value="${pos}" ${busy.has(l.id) ? 'disabled' : ''} oninput="tuneSet('${l.id}', +this.value)"><i class="now" style="left:calc(${curPos / Math.max(1, ord.length - 1)} * (100% - 26px) + 13px)" title="oggi"></i></div>
      <div class="row between tiny dim"><span>${esc(AXES[l.ax].l)}</span><span>oggi: ${esc(l.opts[cur].t)}</span><span>${esc(AXES[l.ax].r)}</span></div>
      ${changed ? effChipsHTML(effectsOf(l, cur, sel), lawGain(myPid(), l, cur, sel)) : ''}</div>`;
  });
  const can = isPremier() || (isLeader() && (myParty().seatsC + myParty().seatsS > 0)) || G.player.parl;
  const cost = S.n * 2;
  h += can ? `<button class="btn gold block mt2" ${S.n ? '' : 'disabled'} onclick="submitTuner()">${icon('doc')} ${isPremier() ? 'Presenta il pacchetto del governo' : 'Presenta le proposte'} · ⚡${cost}</button><div class="tiny muted center mt">Ogni modifica diventa un ${isPremier() ? 'disegno di legge' : 'proposta di legge'} e passa da Camera e Senato.</div>`
    : `<div class="tiny muted center mt2">Per presentare le modifiche devi essere in Parlamento o guidare un partito con parlamentari. Puoi comunque provarle per vedere gli effetti.</div>`;
  replaceSheet(h);
  const s2 = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null; if (s2) s2.scrollTop = st;
}
function tuneSet(id, pos) {
  const l = getLaw(id), opt = tuneOrder(l)[pos].i;
  if (opt === G.laws[id]) delete TUNE.ch[id]; else TUNE.ch[id] = opt;
  clearTimeout(TUNE.t); TUNE.t = setTimeout(renderTuner, 60);
}
function submitTuner() {
  const busy = new Set(G.bills.filter(b => !b.dead && b.lawId).map(b => b.lawId));
  const list = Object.entries(TUNE.ch).filter(([id, opt]) => opt !== G.laws[id] && !busy.has(id));
  if (!list.length) return toast('Nessuna modifica da presentare', 'bad');
  if (!spendPC(list.length * 2)) return toast('Capitale politico insufficiente', 'bad');
  const proposer = isPremier() ? 'GOV' : 'PLAYER';
  list.forEach(([id, opt]) => proposeBill(id, +opt, 'ddl', proposer, 'C'));
  if (!isPremier()) { G.player.fama = clamp(G.player.fama + list.length, 0, 100); }
  addNews(`${isPremier() ? 'Il governo' : G.player.name} presenta un pacchetto di ${list.length} riforme.`, isPremier() ? 'gov' : 'mio');
  TUNE = null; closeSheet(); renderGame(); toast(`${list.length} ${list.length > 1 ? 'riforme presentate' : 'riforma presentata'} in Parlamento`, 'good');
}
