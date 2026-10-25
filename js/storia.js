// ============================================================
//  MODALITÀ STORIA: il consigliere che ti dice cosa fare e perché
//  + diagnostica degli errori + esporta/importa più comodi
// ============================================================

// difficoltà: Storia, Facile, Difficile (la vecchia Media), Realistica
(function () {
  const old = Object.assign({}, DIFF);
  Object.keys(DIFF).forEach(k => delete DIFF[k]);
  DIFF.storia = { n: 'Storia', partner: 0.6, market: 0.5, events: 0.7, defect: 0.4, growth: 1.6, accept: -16, pc: 3 };
  DIFF.facile = old.facile;
  DIFF.media = Object.assign({}, old.media, { n: 'Difficile' });
  DIFF.realistica = old.realistica;
})();
const DIFF_DESC = {
  storia: 'Il consigliere ti dice ogni settimana quale legge approvare, cosa fare e perché, per portare il Paese ad avere tutti gli indicatori in positivo. Alleati e mercati molto indulgenti.',
  facile: 'Alleati più docili, mercati calmi, il tuo partito cresce più in fretta. Per imparare.',
  media: 'La politica italiana com’è: equilibrata ma senza sconti.',
  realistica: 'Alleati permalosi, franchi tiratori, spread nervoso. Come nella Prima Repubblica: i governi durano poco.',
};

// ---------- il consiglio della settimana ----------
// quale indicatore conviene migliorare adesso
function storyFocus() {
  const e = G.econ, out = [];
  if (e.deficit > 3) out.push({ k: 'deficit', w: (e.deficit - 3) * 3 + 2, why: `il deficit è al ${fmt1(e.deficit)}%, sopra il limite UE: rischi la procedura e lo spread` });
  if (e.spread > 160) out.push({ k: 'spread', w: (e.spread - 160) / 25 + 2, why: `lo spread è a ${fmt0(e.spread)}: paghiamo troppi interessi` });
  if (e.dis > 6) out.push({ k: 'lavoro', w: (e.dis - 6) * 1.5 + 1, why: `la disoccupazione è al ${fmt1(e.dis)}%` });
  if (e.pil < 1.2) out.push({ k: 'pil', w: (1.2 - e.pil) * 2 + 1, why: `il PIL cresce solo dello ${sgn(e.pil)}%` });
  if (e.infl > 2.5) out.push({ k: 'prezzi', w: (e.infl - 2.5) * 1.5 + 1, why: `l’inflazione è al ${fmt1(e.infl)}%: la spesa costa di più` });
  out.sort((a, b) => b.w - a.w);
  if (!out.length) out.push({ k: 'pil', w: 0, why: 'i conti sono in ordine: ora conviene far crescere l’economia' });
  return out;
}
function canProposeLaws() { return isPremier() || (G.player.minister && G.gov) || (isLeader() && myParty().seatsC + myParty().seatsS > 0) || G.player.parl; }
function storyAdvice() {
  const out = [], p = G.player, left = G.cal.election - G.week;
  // 1. la legge giusta da approvare adesso
  if (canProposeLaws()) {
    const vis = typeof visibleLaws === 'function' ? visibleLaws() : allLaws();
    for (const f of storyFocus()) {
      // meglio le riforme con meno controindicazioni sugli altri indicatori
      const bad = x => x.effs.filter(e => !e.good).length + (x.effs.some(e => e.k === 'consenso' && !e.good) ? 1 : 0);
      const near = left > 0 && left <= 20, best = bestLawsFor(f.k, 15).filter(x => vis.includes(x.l) && x.mine >= -0.2 && !x.l.cost && !(near && x.effs.some(e => e.k === 'consenso' && !e.good))).sort((a, b) => bad(a) - bad(b) || b.score - a.score);
      const ok = best.find(x => !G.gov || !isPremier() || G.gov.parties.every(q => q === myPid() || lawGain(q, x.l, G.laws[x.l.id], x.i) > -0.5)) || best[0];
      if (!ok) continue;
      const side = ok.effs.filter(e => e.k !== f.k).map(e => `${e.k === 'pil' ? 'PIL' : METRICS[e.k].n.toLowerCase()} ${e.up ? 'sale' : 'scende'}`).join(', ');
      out.push({ ico: CAT_ICON[ok.l.cat] || 'doc', t: `Approva «${ok.l.opts[ok.i].t}»`, d: `Perché ${f.why}. Questa riforma (${ok.l.nome.toLowerCase()}) migliora ${f.k === 'pil' ? 'il PIL' : METRICS[f.k].n.toLowerCase()}${side ? `; in più: ${side}` : ''}${ok.mine > 0.2 ? '. Il tuo partito è d’accordo' : ''}.`, b: 'Apri la legge', on: `openLaw('${ok.l.id}',${ok.i})` });
      break;
    }
  }
  // 2. il momento politico
  if (left > 0 && left <= 20) out.push({ ico: 'vote', t: `Mancano ${left} settimane al voto`, d: 'Adesso non approvare riforme impopolari: punta su comizi nelle regioni in bilico, interviste e campagna. Le leggi buone ma dolorose falle a inizio legislatura.', b: 'Comizio', on: "openAction('comizio')" });
  if (isPremier()) {
    const al = G.gov.parties.filter(q => q !== myPid()), low = al.sort((a, b) => (G.gov.sat[a] || 50) - (G.gov.sat[b] || 50))[0];
    if (low && (G.gov.sat[low] || 50) < 40) out.push({ ico: 'hands', t: `${P(low).short} è scontento`, d: `La sua soddisfazione è ${fmt0(G.gov.sat[low])}/100: sotto 15 può aprire la crisi. Un vertice di maggioranza o una legge che gli piace lo calmano.`, b: 'Vertice', on: "openAction('vertice')" });
    if (G.gov.approval < 38) out.push({ ico: 'tv', t: 'Il gradimento del governo è basso', d: `È al ${fmt0(G.gov.approval)}%. Un discorso alla nazione o un’intervista in TV aiutano subito; le riforme sui temi caldi aiutano nel tempo.`, b: 'Discorso', on: "openAction('discorso')" });
  } else if (isLeader() && G.gov && !inGov(myPid()) && typeof govStrength === 'function') {
    const s = govStrength();
    if (s.v < 45) out.push({ ico: 'gavel', t: 'Il governo è debole', d: `La sua forza è ${s.v}/100: è il momento di raccogliere le firme per la sfiducia, partito per partito.`, b: 'Sfiducia', on: "openAction('sfiducia')" });
    else if (!G.camp) out.push({ ico: 'mega', t: 'Lancia una campagna a tema', d: 'Sei settimane su un problema sentito (bollette, sanità, tasse): l’effetto cresce ogni settimana e sposta gli elettori verso di te.', b: 'Campagna', on: "openAction('campagna')" });
  } else if (!isLeader()) {
    if (p.rap < 20) out.push({ ico: 'salute', t: 'Migliora il rapporto con il leader', d: `È a ${fmt0(p.rap)}: senza la sua fiducia non avrai incarichi né il posto da capolista.`, b: 'Sostieni il leader', on: "openAction('lealta')" });
    else out.push({ ico: 'home', t: 'Costruisci il tuo seguito', d: 'Lavoro sul territorio e corrente: servono seguito e fama per salire di grado.', b: 'Territorio', on: "openAction('territorio')" });
  }
  if (p.fama < 35) out.push({ ico: 'tv', t: 'Fatti conoscere', d: `La tua fama è ${fmt0(p.fama)}: un’intervista in TV è il modo più rapido per farla salire.`, b: 'Intervista', on: "openAction('tv')" });
  if (p.stress > 70) out.push({ ico: 'sun', t: 'Sei sotto stress', d: `Stress a ${fmt0(p.stress)}: rischi gaffe e problemi di salute. Un weekend di riposo lo abbassa.`, b: 'Riposo', on: "openAction('riposo')" });
  return out.slice(0, 3);
}
function storyGuideHTML() {
  if (G.diff !== 'storia' || G.phase !== 'normale') return '';
  const a = storyAdvice(); if (!a.length) return '';
  const e = G.econ, ok = [e.pil >= 1.2, e.deficit <= 3, e.spread <= 160, e.dis <= 6, e.infl <= 2.5];
  return `<div class="card hero" style="--pc:#38bdf8"><div class="row between"><b>${icon('cap', 18)} Il consiglio della settimana</b><span class="tag ${ok.every(Boolean) ? 'g' : ''}">${ok.filter(Boolean).length}/5 in positivo</span></div>
    ${a.map(x => `<div class="sg"><span class="nico">${icon(x.ico, 18)}</span><div class="grow"><b class="small">${esc(x.t)}</b><div class="tiny muted">${esc(x.d)}</div></div><button class="btn sm" onclick="${x.on}">${esc(x.b)}</button></div>`).join('')}</div>`;
}
const _homeTabStory = homeTab;
homeTab = function () { return storyGuideHTML() + _homeTabStory(); };

// ---------- diagnostica ----------
function logErr(msg, extra) {
  try {
    const k = SAVE_PREFIX + 'errlog', arr = JSON.parse(localStorage.getItem(k) || '[]');
    arr.unshift({ t: new Date().toISOString().slice(0, 16).replace('T', ' '), m: String(msg).slice(0, 300), x: extra ? String(extra).slice(0, 600) : '', w: G ? G.week : null, q: G && G.queue && G.queue[0] ? (G.queue[0].id || (G.queue[0].sp && G.queue[0].sp.k) || '') : '' });
    localStorage.setItem(k, JSON.stringify(arr.slice(0, 25)));
  } catch (e) {}
}
window.addEventListener('error', e => logErr(e.message, e.error && e.error.stack));
window.addEventListener('unhandledrejection', e => logErr('Promise: ' + (e.reason && e.reason.message || e.reason)));
const _ceLog = console.error;
console.error = function (...a) { try { const e = a.find(x => x && x.message); logErr(e ? e.message : a.join(' '), e && e.stack); } catch (er) {} return _ceLog.apply(console, a); };
function errLog() { try { return JSON.parse(localStorage.getItem(SAVE_PREFIX + 'errlog') || '[]'); } catch (e) { return []; } }
function openDiagnostics() {
  const L = errLog();
  openSheet(`${head('Diagnostica', 'Gli ultimi errori del gioco')}
    ${L.length ? `<div class="card tight"><div class="list">${L.map(x => `<div class="li" style="align-items:flex-start"><span class="nico">${icon('x', 16)}</span><div class="grow"><b class="small">${esc(x.m)}</b><div class="tiny muted">${esc(x.t)}${x.w !== null ? ' · settimana ' + x.w : ''}${x.q ? ' · in attesa: ' + esc(x.q) : ''}</div></div></div>`).join('')}</div></div>
    <button class="btn gold block mt" onclick="copyDiagnostics()">${icon('clipboard')} Copia e mandamelo</button>
    <button class="btn block mt" onclick="try{localStorage.removeItem(SAVE_PREFIX+'errlog')}catch(e){};closeSheet();toast('Registro svuotato')">Svuota il registro</button>` : '<div class="card center"><div class="mt">' + medal('check', 56) + '</div><p class="muted">Nessun errore registrato.</p></div>'}`);
}
function copyText(t, ok) {
  const done = () => toast(ok || 'Copiato', 'good');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, () => fallbackCopy(t, ok)); else fallbackCopy(t, ok);
}
function fallbackCopy(t, ok) { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); toast(ok || 'Copiato', 'good'); } catch (e) { toast('Copia non riuscita', 'bad'); } a.remove(); }
function copyDiagnostics() {
  const L = errLog().slice(0, 10);
  copyText('Diagnostica Palazzo Chigi\n' + L.map(x => `[${x.t}] sett.${x.w} ${x.q ? '(' + x.q + ') ' : ''}${x.m}\n${x.x}`).join('\n\n'), 'Copiato: incollalo in chat');
}

// ---------- esporta e importa più comodi (anche su iPhone) ----------
exportSave = function () {
  const name = `palazzo-chigi-${G.player.name.replace(/\s+/g, '_')}-${fmtDate(G.week, true).replace(/\s+/g, '-')}.json`;
  const data = JSON.stringify(G);
  try {
    const file = new File([data], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: 'Partita di Palazzo Chigi' }).catch(() => {}); return; }
  } catch (e) {}
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' })); a.download = name; a.click();
};
function openTransfer() {
  openSheet(`${head('Sposta la partita', 'Su un altro telefono o computer')}
    <div class="card tight"><b class="small">${icon('upload', 16)} Da questo telefono</b><div class="tiny muted mt">Salva il file (su iPhone puoi mandarlo con AirDrop, WhatsApp o salvarlo in File) oppure copia la partita come testo.</div>
      <div class="row mt" style="gap:8px"><button class="btn sm grow" onclick="exportSave()">${icon('upload')} Salva il file</button><button class="btn sm grow" onclick="copyText(JSON.stringify(G),'Partita copiata: incollala sull’altro telefono')">${icon('clipboard')} Copia testo</button></div></div>
    <div class="card tight"><b class="small">${icon('upload', 16)} Sull’altro telefono</b><div class="tiny muted mt">Apri il gioco, poi Menu › Sposta la partita, e scegli il file o incolla il testo.</div>
      <input class="mt" type="file" accept=".json,application/json,text/plain" onchange="importSave(this.files[0])">
      <textarea id="paste-save" class="mt" rows="3" placeholder="Oppure incolla qui il testo della partita" style="font-size:12px"></textarea>
      <button class="btn gold block mt" onclick="importText($('#paste-save').value)">Carica la partita incollata</button></div>`);
}
function importText(t) {
  try { const g = JSON.parse(t.trim()); if (!g || !g.player || !g.parties) throw new Error('x'); G = g; migrate(); saveGame('auto'); closeSheet(true); UI.tab = 'home'; renderGame(); toast('Partita caricata', 'good'); }
  catch (e) { toast('Testo non valido: copialo di nuovo per intero', 'bad'); }
}
importSave = function (file) {
  if (!file) return; const r = new FileReader();
  r.onload = () => importText(r.result);
  r.readAsText(file);
};
