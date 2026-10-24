// ============================================================
//  INTERFACCIA — componenti di base
// ============================================================
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let UI = { tab: 'home', map: 'primo', aula: 'C', lawCat: 'Tutte', lawQ: '', range: 52, partiti: 'sondaggi', scroll: {} };

// simbolo del partito: logo ufficiale libero se c'è, altrimenti uno stemma disegnato (colore, iniziali, anello d'oro)
function partyDef(pid) { return (G && G.parties && G.parties[pid]) || PARTIES_DEF.find(x => x.id === pid); }
function partyMark(pid, size) {
  size = size || 20;
  const d = partyDef(pid);
  if (!d) return `<span class="pmark em" style="--s:${size}px;--c:#7a7f92;--f:${size * .4}px">·</span>`;
  const L = typeof LOGHI !== 'undefined' && !d.mine ? LOGHI[pid] : null;
  const src = L ? (L.r > 1.6 ? L.m : L.src) : null;
  if (src) return `<span class="pmark ${L.bg ? 'pad' : ''}" style="--s:${size}px;${L.bg ? `--lb:${L.bg}` : ''}"><img src="${src}" alt=""></span>`;
  return emblem(d.mine && d.symbol ? d.symbol : d.short, d.color, size);
}
function emblem(t, color, size) {
  t = String(t || '?');
  const ic = ICON_PATHS[t] ? t : EMO_ICON[t];
  if (ic) return `<span class="pmark em ic" style="--s:${size}px;--c:${color}">${icon(ic)}</span>`;
  const n = [...t].length, k = n <= 1 ? .52 : n === 2 ? .4 : .32;
  return `<span class="pmark em" style="--s:${size}px;--c:${color};--f:${(size * k).toFixed(1)}px">${esc(t)}</span>`;
}
// simbolo grande per la scheda del partito (logo intero, anche orizzontale)
function partyLogoBig(pid) {
  const d = partyDef(pid), L = typeof LOGHI !== 'undefined' && d && !d.mine ? LOGHI[pid] : null;
  if (L && L.r > 1.2) return `<span class="plogo-w" style="--lb:${L.bg || '#fff'}"><img src="${L.src}" alt="${esc(d.name)}"></span>`;
  return partyMark(pid, 96);
}
function partyChip(pid) { const p = G.parties[pid]; if (!p) return pid === 'ALT' ? '<span class="chip nologo" style="--c:#888">Altri</span>' : ''; return `<span class="chip" style="--c:${p.color}">${partyMark(pid, 19)}${esc(p.short)}</span>`; }
function sym(pid, big) { return partyMark(pid, big ? 64 : 42); }
function barH(v, max, color, thin) { return `<div class="bar ${thin ? 'thin' : ''}"><i style="width:${clamp(v / max * 100, 0, 100)}%;--c:${color || 'var(--blu)'}"></i></div>`; }
function relColor(v) { return v > 25 ? 'var(--good)' : v < -25 ? 'var(--bad)' : 'var(--warn)'; }
function relColorHex(v) { return v > 25 ? '#2ecc71' : v < -25 ? '#ff5c5c' : '#ffb547'; }
function relLabel(v) { return v > 50 ? 'ottimo' : v > 25 ? 'buono' : v > -10 ? 'freddo' : v > -40 ? 'teso' : 'pessimo'; }
function firstName(n) { return String(n || '').split(' ')[0]; }
function pctColor(v) { return v >= 60 ? 'var(--good)' : v >= 35 ? 'var(--warn)' : 'var(--bad)'; }

// ---------- toast ----------
function toast(msg, kind) {
  let w = $('#toast-root'); if (!w.classList.contains('toast-wrap')) w.className = 'toast-wrap';
  const t = document.createElement('div'); t.className = 'toast ' + (kind || ''); t.innerHTML = msg; w.appendChild(t);
  setTimeout(() => { t.style.transition = 'opacity .4s'; t.style.opacity = 0; setTimeout(() => t.remove(), 400); }, 2600);
}

// ---------- fogli modali ----------
const layers = [];
function openSheet(html, opts) {
  opts = opts || {};
  const layer = document.createElement('div');
  layer.className = 'layer' + (opts.full ? ' full' : '');
  layer.innerHTML = `<div class="backdrop"></div><div class="sheet">${opts.full ? '' : '<div class="grab"></div>'}${html}</div>`;
  if (!opts.locked) layer.querySelector('.backdrop').onclick = () => closeSheet();
  $('#modal-root').appendChild(layer);
  layers.push({ el: layer, onClose: opts.onClose });
  return layer.querySelector('.sheet');
}
function closeSheet(all) {
  const n = all ? layers.length : 1;
  for (let i = 0; i < n; i++) {
    const l = layers.pop(); if (!l) return;
    l.el.classList.add('closing');
    setTimeout(() => l.el.remove(), 250);
    if (l.onClose) l.onClose();
  }
}
function replaceSheet(html) { const l = layers[layers.length - 1]; if (!l) return openSheet(html); l.el.querySelector('.sheet').innerHTML = (l.el.classList.contains('full') ? '' : '<div class="grab"></div>') + html; l.el.querySelector('.sheet').scrollTop = 0; return l.el.querySelector('.sheet'); }
function head(title, sub) { return `<div class="sheet-head"><div class="grow"><h2>${title}</h2>${sub ? `<div class="muted small">${sub}</div>` : ''}</div><button class="xbtn" onclick="closeSheet()">${icon('x', 18)}</button></div>`; }
function confirmSheet(title, body, ok, cb, kind) {
  openSheet(`${head(title)}<div>${body}</div><div class="row mt2"><button class="btn block" onclick="closeSheet()">Annulla</button><button class="btn block ${kind || 'pri'}" id="okbtn">${ok}</button></div>`);
  $('#okbtn').onclick = () => { closeSheet(); cb(); };
}

// ---------- pro e contro ----------
const PCK = { eco: 'ECONOMIA', pop: 'MORALE', grp: 'SOCIETÀ', ist: 'ISTITUZ.', pol: 'POLITICA', per: 'TU' };
function proConHTML(imp, opts) {
  opts = opts || {};
  const li = arr => arr.map(x => `<div class="pc-item"><span class="k">${PCK[x.k] || ''}</span><span>${esc(x.t)}</span></div>`).join('');
  let h = `<div class="pc-box">
    <div class="pc-list p"><h5>${icon('check', 14)} Pro</h5>${imp.pro.length ? li(imp.pro) : '<div class="small dim">Nessun vantaggio evidente</div>'}</div>
    <div class="pc-list c"><h5>${icon('alert', 14)} Contro</h5>${imp.contro.length ? li(imp.contro) : '<div class="small dim">Nessuno svantaggio evidente</div>'}</div></div>`;
  if (!opts.noParties && (imp.fav || imp.contr)) {
    h += `<div class="mt small"><div class="row wrap" style="gap:4px"><span class="muted" style="min-width:74px">Favorevoli</span>${imp.fav.length ? imp.fav.map(partyChip).join('') : '<span class="dim">nessuno</span>'}</div>
      <div class="row wrap mt" style="gap:4px"><span class="muted" style="min-width:74px">Contrari</span>${imp.contr.length ? imp.contr.map(partyChip).join('') : '<span class="dim">nessuno</span>'}</div></div>`;
  }
  return h;
}
// pro/contro di una scelta a partire dai suoi effetti
const GRPN = { sind: 'Sindacati', conf: 'Imprese', chiesa: 'Chiesa', ue: 'Bruxelles', merc: 'Mercati', quir: 'Quirinale', mag: 'Magistratura', media: 'Media' };
function fxProCon(fx) {
  const pro = [], contro = [], neu = [];
  if (!fx) return { pro, contro, neu };
  const add = (v, p, c, k) => { if (v > 0) pro.push({ k, t: p }); else if (v < 0) contro.push({ k, t: c }); };
  if (fx.appr) add(fx.appr, `Consenso del governo +${fmt1(fx.appr)}`, `Consenso del governo ${fmt1(fx.appr)}`, 'pop');
  if (fx.my) add(fx.my, `${myParty().short} sale nei sondaggi`, `${myParty().short} perde consensi`, 'pop');
  if (fx.fama) add(fx.fama, `Notorietà +${fx.fama}`, `Notorietà ${fx.fama}`, 'per');
  if (fx.stress) add(-fx.stress, 'Recuperi energie', `Stress +${fx.stress}`, 'per');
  if (fx.salute) add(fx.salute, 'Salute migliore', 'Salute peggiore', 'per');
  if (fx.integ) add(fx.integ, 'Immagine di integrità', 'Integrità in dubbio', 'per');
  if (fx.pc) { if (fx.pc <= -50) contro.push({ k: 'per', t: 'Perdi il capitale politico della settimana' }); else add(fx.pc, `+${fx.pc} capitale politico`, `Costa ${-fx.pc} capitale politico`, 'pol'); }
  if (fx.funds) add(fx.funds, `+${euro(fx.funds)} di fondi`, `Costa ${euro(-fx.funds)}`, 'per');
  if (fx.spread) add(-fx.spread, `Spread ${fx.spread} punti`, `Spread +${fx.spread} punti`, 'eco');
  if (fx.pil) add(fx.pil, 'Crescita economica', 'Frena la crescita', 'eco');
  if (fx.infl) add(-fx.infl, 'Prezzi più bassi', 'Inflazione in aumento', 'eco');
  if (fx.oneOff) { const dd = fx.oneOff / G.econ.pilNom * 100; add(-fx.oneOff, `Entrate per ${fmt1(-fx.oneOff)} mld`, `Costa ${fmt1(fx.oneOff)} mld${dd >= 0.05 ? ` (deficit +${fmt1(dd)}%)` : ''}`, 'eco'); }
  if (fx.debt) add(-fx.debt, 'Debito in calo', 'Debito in aumento', 'eco');
  if (fx.grp) Object.keys(fx.grp).forEach(k => add(fx.grp[k], `${GRPN[k]} favorevoli`, `${GRPN[k]} contrari`, 'grp'));
  if (fx.rel) Object.keys(fx.rel).forEach(k => { if (G.parties[k]) add(fx.rel[k], `Rapporti migliori con ${P(k).short}`, `Rapporti peggiori con ${P(k).short}`, 'pol'); });
  if (fx.sat) add(fx.sat, 'Alleati più soddisfatti', 'Alleati scontenti', 'pol');
  if (fx.satP) Object.keys(fx.satP).forEach(k => { if (G.gov && G.gov.sat[k] !== undefined) add(fx.satP[k], `${P(k).short} soddisfatta`, `${P(k).short} irritata`, 'pol'); });
  if (fx.party) Object.keys(fx.party).forEach(k => { if (G.parties[k] && k !== myPid()) add(-fx.party[k], `${P(k).short} perde terreno`, `${P(k).short} guadagna terreno`, 'pol'); });
  if (fx.rap) add(fx.rap, 'Il leader ti apprezza', 'Rapporto col leader peggiora', 'pol');
  if (fx.seguito) add(fx.seguito, 'Cresce il tuo seguito interno', 'Perdi seguito nel partito', 'pol');
  if (fx.cred) add(fx.cred, 'Più credibilità', 'Meno credibilità', 'pol');
  if (fx.org) add(fx.org, 'Partito più organizzato', 'Organizzazione indebolita', 'pol');
  if (fx.mood) Object.keys(fx.mood).forEach(k => neu.push({ k: 'pop', t: `Il Paese si sposta verso «${fx.mood[k] > 0 ? AXES[k].r : AXES[k].l}»` }));
  return { pro, contro, neu };
}
function fxChips(fx, extra) {
  const r = fxProCon(fx);
  return `<div class="fx">${r.pro.map(x => `<span class="p">▲ ${esc(x.t)}</span>`).join('')}${r.contro.map(x => `<span class="c">▼ ${esc(x.t)}</span>`).join('')}${r.neu.map(x => `<span class="n">• ${esc(x.t)}</span>`).join('')}${extra || ''}</div>`;
}

// ---------- emiciclo ----------
function partyOrder(ids) { return ids.slice().sort((a, b) => { const A = a === 'ALT' ? 0.5 : (P(a).ax.eco + P(a).ax.soc + P(a).ax.imm) / 3; const B = b === 'ALT' ? 0.5 : (P(b).ax.eco + P(b).ax.soc + P(b).ax.imm) / 3; return A - B; }); }
function hemiPositions(n) {
  const rows = Math.max(4, Math.round(Math.sqrt(n / 2.2)));
  const r0 = 40, r1 = 98; const pos = [];
  const radii = []; for (let i = 0; i < rows; i++) radii.push(r0 + (r1 - r0) * i / (rows - 1));
  const tot = radii.reduce((s, r) => s + r, 0);
  let left = n;
  radii.forEach((r, i) => {
    let k = i === rows - 1 ? left : Math.round(n * r / tot); left -= k;
    for (let j = 0; j < k; j++) { const a = Math.PI - (k === 1 ? Math.PI / 2 : j * Math.PI / (k - 1)); pos.push({ x: 100 + r * Math.cos(a), y: 102 - r * Math.sin(a), a }); }
  });
  pos.sort((p, q) => q.a - p.a);
  return pos;
}
function hemicycle(h, opts) {
  opts = opts || {};
  const ids = partyOrder(PIDS().filter(id => seatsOf(id, h) > 0).concat(G.otherSeats[h] ? ['ALT'] : []));
  const seats = [];
  ids.forEach(id => { const n = id === 'ALT' ? G.otherSeats[h] : seatsOf(id, h); for (let i = 0; i < n; i++) seats.push(id); });
  const pos = hemiPositions(seats.length);
  const rad = seats.length > 300 ? 2.15 : 2.9;
  let html = `<svg class="hemi" viewBox="0 0 200 108" ${opts.id ? `id="${opts.id}"` : ''}>`;
  seats.forEach((pid, i) => {
    const p = pos[i]; if (!p) return;
    const col = pid === 'ALT' ? '#7a7f92' : P(pid).color;
    const gov = G.gov && G.gov.parties.includes(pid);
    html += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${rad}" fill="${opts.empty ? '#2a3350' : col}" data-c="${col}" data-p="${pid}" ${opts.ring && gov ? 'stroke="#fff" stroke-width=".5"' : ''} style="transition-delay:${(i * (opts.slow ? 6 : 2))}ms"/>`;
  });
  html += `<text x="100" y="98" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${seats.length}</text><text x="100" y="106" text-anchor="middle" font-size="5.5" fill="#8f9bb8">maggioranza ${majority(h)}</text></svg>`;
  return html;
}
function hemiLegend(h) {
  const ids = partyOrder(PIDS().filter(id => seatsOf(id, h) > 0));
  return `<div class="legend">${ids.map(id => `<span><i class="dot" style="--c:${P(id).color}"></i>${esc(P(id).short)} <b>${seatsOf(id, h)}</b></span>`).join('')}${G.otherSeats[h] ? `<span><i class="dot" style="--c:#7a7f92"></i>Altri <b>${G.otherSeats[h]}</b></span>` : ''}</div>`;
}
// anima il voto: colora i seggi in base al voto di ciascun gruppo
function animateVote(svg, by) {
  if (!svg) return;
  const counters = {};
  const circles = Array.from(svg.querySelectorAll('circle'));
  circles.forEach(c => {
    const pid = c.dataset.p; const v = by[pid]; if (!v) return;
    counters[pid] = (counters[pid] || 0) + 1;
    const i = counters[pid];
    let col = '#4a5270';
    if (i <= v.yes) col = '#22c56b'; else if (i <= v.yes + v.no) col = '#ef4a4f'; else col = '#8a8fa3';
    setTimeout(() => { c.setAttribute('fill', col); }, 30);
  });
}
function fillHemi(svg) { if (!svg) return; svg.querySelectorAll('circle').forEach(c => setTimeout(() => c.setAttribute('fill', c.dataset.c), 20)); }

// ---------- grafici ----------
function lineChart(series, o) {
  o = Object.assign({ w: 340, h: 150, pad: 26 }, o || {});
  const all = series.flatMap(s => s.pts.map(p => p[1]));
  if (!all.length) return '';
  let ymin = o.ymin !== undefined ? o.ymin : Math.min(...all), ymax = o.ymax !== undefined ? o.ymax : Math.max(...all);
  if (ymax - ymin < 1) { ymax += 0.5; ymin -= 0.5; }
  const xs = series.flatMap(s => s.pts.map(p => p[0])); const xmin = Math.min(...xs), xmax = Math.max(...xs) || 1;
  const X = x => o.pad + (x - xmin) / Math.max(1, xmax - xmin) * (o.w - o.pad - 8);
  const Y = y => 8 + (1 - (y - ymin) / (ymax - ymin)) * (o.h - 26);
  let s = `<svg class="chart" viewBox="0 0 ${o.w} ${o.h}">`;
  for (let i = 0; i <= 3; i++) { const v = ymin + (ymax - ymin) * i / 3; const y = Y(v); s += `<line x1="${o.pad}" x2="${o.w}" y1="${y}" y2="${y}" stroke="rgba(255,255,255,.07)"/><text x="${o.pad - 4}" y="${y + 3}" fill="#5d6987" font-size="9" text-anchor="end">${o.fmt ? o.fmt(v) : Math.round(v)}</text>`; }
  if (o.ref !== undefined && o.ref >= ymin && o.ref <= ymax) s += `<line x1="${o.pad}" x2="${o.w}" y1="${Y(o.ref)}" y2="${Y(o.ref)}" stroke="rgba(255,92,92,.5)" stroke-dasharray="4 3"/>`;
  series.forEach(se => { if (se.pts.length < 2) return; s += `<path class="l" d="${se.pts.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join('')}" stroke="${se.color}" style="stroke-width:${se.w || 2}"/>`; });
  const xl = [xmin, Math.round((xmin + xmax) / 2), xmax];
  xl.forEach(x => { const d = dateOf(x); s += `<text x="${X(x)}" y="${o.h - 4}" fill="#5d6987" font-size="9" text-anchor="middle">${MESI3[d.getMonth()]} ${String(d.getFullYear()).slice(2)}</text>`; });
  return s + '</svg>';
}

// ---------- confetti ----------
function confetti(colors) {
  const c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
  const W = c.width = innerWidth * devicePixelRatio, H = c.height = innerHeight * devicePixelRatio; const ctx = c.getContext('2d');
  colors = colors || ['#1fa463', '#ffffff', '#e5484d', '#d6b25e'];
  const ps = Array.from({ length: 160 }, () => ({ x: W / 2 + rnd(-W / 4, W / 4), y: H * 0.35, vx: rnd(-9, 9) * devicePixelRatio, vy: rnd(-22, -6) * devicePixelRatio, s: rnd(5, 11) * devicePixelRatio, c: pick(colors), r: rnd(0, 6), vr: rnd(-0.3, 0.3) }));
  let t = 0;
  (function f() {
    ctx.clearRect(0, 0, W, H);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.55 * devicePixelRatio; p.vx *= 0.99; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); });
    if (++t < 150) requestAnimationFrame(f); else c.remove();
  })();
}
function countUp(el, to, dec, ms) {
  if (!el) return; const t0 = performance.now(); ms = ms || 1200;
  (function f(t) { const k = Math.min(1, (t - t0) / ms); const e = 1 - Math.pow(1 - k, 3); el.textContent = dec ? fmt1(to * e) : fmt0(to * e); if (k < 1) requestAnimationFrame(f); })(t0);
}
function vib(ms) { try { navigator.vibrate && navigator.vibrate(ms || 15); } catch (e) { } }

// ============================================================
//  SCHERMATA INIZIALE
// ============================================================
function showSplash() {
  const auto = slotInfo('auto');
  $('#app').innerHTML = `<div class="splash">
    <div class="logo">${logoChigi(120)}</div>
    <h1>Palazzo Chigi</h1>
    <div class="flag3"><i></i><i></i><i></i></div>
    <div class="sub">Simulatore politico italiano · dati reali a ottobre 2026</div>
    <div class="btns">
      ${auto ? `<button class="btn gold block" onclick="continueGame()">${icon('chevron')} Continua · ${esc(auto.name)} (${esc(auto.party)}), ${esc(auto.date)}</button>` : ''}
      <button class="btn ${auto ? '' : 'pri'} block" onclick="startSetup()">${icon('plus')} Nuova partita</button>
      <button class="btn block" onclick="openLoad()">${icon('folder')} Carica partita</button>
      <button class="btn block" onclick="openGuide()">${icon('info')} Come si gioca</button>
    </div>
    <div class="tiny dim mt2">Partiti, leader, seggi, leggi e istituzioni reali. Eventi e risultati sono simulati.</div>
  </div>`;
}
function continueGame() { if (loadGame('auto')) { UI.tab = 'home'; renderGame(); afterLoad(); } }
function openLoad() {
  const rows = ['1', '2', '3', 'auto'].map(s => { const i = slotInfo(s); return `<div class="li"><div class="grow"><b>${s === 'auto' ? 'Salvataggio automatico' : 'Slot ' + s}</b><div class="small muted">${i ? `${esc(i.name)} · ${esc(i.party)} · ${esc(i.date)}${i.premier ? ' · premier' : ''}` : 'vuoto'}</div></div>${i ? `<button class="btn sm pri" onclick="closeSheet(true);if(loadGame('${s}')){renderGame();afterLoad();}">Carica</button>` : ''}</div>`; }).join('');
  openSheet(`${head('Carica partita')}<div class="list">${rows}</div><label class="lbl">Importa un file di salvataggio</label><input type="file" accept=".json,application/json" onchange="importSave(this.files[0])">`);
}
function importSave(file) {
  if (!file) return; const r = new FileReader();
  r.onload = () => { try { G = JSON.parse(r.result); migrate(); closeSheet(true); renderGame(); toast('Partita importata', 'good'); } catch (e) { toast('File non valido', 'bad'); } };
  r.readAsText(file);
}
function exportSave() {
  const blob = new Blob([JSON.stringify(G)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `palazzo-chigi-${G.player.name.replace(/\s+/g, '_')}-${fmtDate(G.week, true).replace(/\s+/g, '-')}.json`; a.click();
}
function openGuide() {
  openSheet(`${head('Come si gioca')}<div class="col small">
  <p><b>Obiettivo:</b> diventare Presidente del Consiglio e governare l’Italia il più a lungo possibile, oppure scalare un partito esistente dal basso.</p>
  <p><b>Ogni turno è una settimana.</b> Hai un <span class="gold">capitale politico ⚡</span> da spendere in azioni: interviste, comizi, proposte di legge, vertici, trattative.</p>
  <p><b>Le leggi sono reali:</b> per ognuna vedi com’è oggi e le riforme possibili, con pro e contro economici e sul morale del Paese, e quali partiti sono favorevoli o contrari. In Parlamento ogni gruppo vota in base alle sue idee: anche dall’opposizione puoi votare Sì, No o astenerti.</p>
  <p><b>Le alleanze contano:</b> ogni partito ha una posizione su 8 assi (economia, valori, Europa, immigrazione, ambiente, giustizia, territorio, istituzioni). Più sei lontano, più è difficile allearsi. Alcune alleanze sono impossibili (es. AVS con la destra).</p>
  <p><b>Elezioni con la legge 2026:</b> proporzionale, soglia 3%, premio di maggioranza a chi supera il 42% in entrambe le Camere. Poi consultazioni al Quirinale, ministri, fiducia.</p>
  <p><b>Ogni ottobre la manovra:</b> scegli spese e coperture, guarda il deficit, Bruxelles e lo spread.</p>
  <p><b>Imprevisti:</b> calamità, scandali, crisi economiche, alleati che litigano. Ogni scelta mostra prima i pro e i contro.</p>
  <p><b>Si perde il governo</b> per una crisi, una sfiducia, uno scandalo, lo spread o perdendo le elezioni. Ma la carriera continua.</p></div>`);
}

// ============================================================
//  CREAZIONE PARTITA
// ============================================================
let SETUP = null;
function startSetup() {
  const ax = {}; AXIS_KEYS.forEach(k => ax[k] = 0);
  SETUP = { step: 0, mode: 'fondatore', diff: 'media',
    player: { name: '', art: 'il', age: 42, region: 'LAZ', bg: 'avv', ax: Object.assign({}, ax) },
    party: { name: '', short: '', symbol: 'star', color: PARTY_COLORS[0], ax: Object.assign({}, ax), people: [randomName(), randomName(), randomName(), randomName(), randomName(), randomName()] },
    join: { party: 'FDI', rank: 0, ownIdeas: false } };
  renderSetup();
}
const SETUP_STEPS = () => SETUP.mode === 'fondatore' ? ['Modalità', 'Personaggio', 'Partito', 'Idee', 'Squadra', 'Difficoltà'] : ['Modalità', 'Personaggio', 'Partito', 'Idee', 'Difficoltà'];
function renderSetup() {
  const steps = SETUP_STEPS(), st = steps[SETUP.step];
  let body = '';
  if (st === 'Modalità') body = `<h2>Come vuoi entrare in politica?</h2><p class="muted">Ottobre 2026: il governo Meloni è al quarto anno, le elezioni politiche sono previste per la primavera 2027.</p>
    <div class="opt ${SETUP.mode === 'fondatore' ? 'on' : ''}" onclick="SETUP.mode='fondatore';renderSetup()"><div class="row">${medal('flag', 52)}<div class="grow"><div class="t">Fonda il tuo partito</div><div class="small muted" style="margin-top:4px">Parti da zero con un tuo movimento: nome, simbolo, idee. Cresci nei sondaggi, cerca alleati, corri per Palazzo Chigi.</div></div></div></div>
    <div class="opt ${SETUP.mode === 'carriera' ? 'on' : ''}" onclick="SETUP.mode='carriera';renderSetup()"><div class="row">${medal('rocket', 52)}<div class="grow"><div class="t">Entra in un partito esistente</div><div class="small muted" style="margin-top:4px">Inizi da militante, consigliere o parlamentare di FdI, PD, M5S, Lega… Fai carriera, diventa ministro, scala il partito o fai una scissione come Vannacci.</div></div></div></div>`;
  if (st === 'Personaggio') {
    body = `<h2>Il tuo personaggio</h2>
    <label class="lbl">Nome e cognome</label><input id="pname" value="${esc(SETUP.player.name)}" placeholder="Es. Andrea Rossi" oninput="SETUP.player.name=this.value">
    <label class="lbl">Come vuoi essere chiamato/a</label><div class="seg"><button class="${SETUP.player.art === 'il' ? 'on' : ''}" onclick="SETUP.player.art='il';renderSetup()">Il Presidente</button><button class="${SETUP.player.art === 'la' ? 'on' : ''}" onclick="SETUP.player.art='la';renderSetup()">La Presidente</button></div>
    <label class="lbl">Età: <b id="agev">${SETUP.player.age}</b> anni</label><input type="range" min="25" max="72" value="${SETUP.player.age}" oninput="SETUP.player.age=+this.value;$('#agev').textContent=this.value">
    <label class="lbl">Regione d’origine (il tuo bacino elettorale)</label><select onchange="SETUP.player.region=this.value">${REGIONS_DEF.map(r => `<option value="${r.id}" ${r.id === SETUP.player.region ? 'selected' : ''}>${r.n}</option>`).join('')}</select>
    <label class="lbl">Da dove vieni</label>
    ${BACKGROUNDS.map(b => `<div class="opt ${SETUP.player.bg === b.id ? 'on' : ''}" onclick="SETUP.player.bg='${b.id}';renderSetup()"><div class="row between"><div class="t" style="font-size:15px">${b.n}</div><div class="tiny muted">Carisma ${b.car} · Competenza ${b.comp} · Integrità ${b.integ}</div></div><div class="small muted">${b.d}</div></div>`).join('')}`;
  }
  if (st === 'Partito' && SETUP.mode === 'fondatore') {
    const pa = SETUP.party;
    body = `<h2>Il tuo partito</h2>
    <div class="row mt">${emblem(pa.symbol, pa.color, 64)}<div class="grow"><b style="font-size:18px">${esc(pa.name || 'Nome del partito')}</b><div class="muted">${esc(pa.short || 'SIGLA')}</div></div></div>
    <label class="lbl">Nome</label><input value="${esc(pa.name)}" placeholder="Es. Italia Futura" oninput="SETUP.party.name=this.value">
    <label class="lbl">Sigla (max 6 lettere)</label><input value="${esc(pa.short)}" maxlength="6" placeholder="Es. IF" oninput="SETUP.party.short=this.value">
    <label class="lbl">Simbolo</label><div class="symgrid">${SYMBOLS.map(s => `<button class="${pa.symbol === s ? 'on' : ''}" onclick="SETUP.party.symbol='${s}';renderSetup()">${icon(s)}</button>`).join('')}</div>
    <label class="lbl">Colore</label><div class="colgrid">${PARTY_COLORS.map(c => `<button class="${pa.color === c ? 'on' : ''}" style="background:${c}" onclick="SETUP.party.color='${c}';renderSetup()"></button>`).join('')}</div>`;
  }
  if (st === 'Partito' && SETUP.mode === 'carriera') {
    body = `<h2>In quale partito entri?</h2>
    ${PARTIES_DEF.map(p => `<div class="opt ${SETUP.join.party === p.id ? 'on' : ''}" onclick="SETUP.join.party='${p.id}';renderSetup()"><div class="row">${partyMark(p.id, 44)}<div class="grow"><div class="t" style="font-size:15px">${esc(p.name)}</div><div class="small muted">${esc(p.leader)} · ${esc(p.area)} · ${fmt1(p.poll)}% · ${p.seatsC} deputati</div></div></div></div>`).join('')}
    <label class="lbl">Da quale livello parti</label>
    ${[0, 1, 2, 3].map(r => `<div class="opt ${SETUP.join.rank === r ? 'on' : ''}" onclick="SETUP.join.rank=${r};renderSetup()"><div class="t" style="font-size:15px">${RANKS[r].n}</div><div class="small muted">${RANKS[r].d}${r === 3 ? ' Siedi già in Parlamento nella XIX legislatura.' : ''}</div></div>`).join('')}`;
  }
  if (st === 'Idee') {
    const tgt = SETUP.mode === 'fondatore' ? SETUP.party.ax : SETUP.player.ax;
    if (SETUP.mode === 'carriera' && !SETUP.join.ownIdeas) { const pp = PARTIES_DEF.find(p => p.id === SETUP.join.party); Object.assign(SETUP.player.ax, pp.ax); }
    if (!SETUP.quizDone && !SETUP.manual) {
      if (SETUP.qi === undefined) {
        body = `<h2>${SETUP.mode === 'fondatore' ? 'Le idee del partito' : 'Le tue idee'}</h2><p class="muted">${SETUP.mode === 'fondatore' ? 'Da qui dipendono chi ti vota e con chi potrai allearti.' : 'Partono da quelle del partito: se te ne allontani, il leader ti vedrà come un corpo estraneo, ma potrai costruire una tua corrente.'}</p>
          <div class="opt on" onclick="SETUP.qi=0;SETUP.answers=[];renderSetup()"><div class="row">${medal('clipboard', 46)}<div class="grow"><div class="t">Rispondi a 16 domande</div><div class="small muted" style="margin-top:4px">Consigliato: in un minuto il gioco capisce dove ti collochi.</div></div></div></div>
          <div class="opt" onclick="SETUP.manual=true;renderSetup()"><div class="row">${medal('gear', 46)}<div class="grow"><div class="t">Imposta a mano</div><div class="small muted" style="margin-top:4px">Sposti tu gli 8 cursori.</div></div></div></div>
          ${SETUP.mode === 'carriera' ? `<div class="opt" onclick="SETUP.quizDone=true;renderSetup()"><div class="row">${medal('hands', 46)}<div class="grow"><div class="t">Le stesse del partito</div><div class="small muted" style="margin-top:4px">Parti in linea con ${esc(PARTIES_DEF.find(p => p.id === SETUP.join.party).short)}.</div></div></div></div>` : ''}`;
      } else body = quizHTML();
    } else {
      const close = PARTIES_DEF.map(p => ({ p, c: clamp(100 - axisDistRaw(tgt, p.ax) * 8, 0, 100) })).sort((a, b) => b.c - a.c);
      body = `<div class="row between"><h2>${SETUP.quizDone ? 'Il tuo profilo' : 'Le tue idee'}</h2><button class="btn sm" onclick="SETUP.quizDone=false;SETUP.manual=false;SETUP.qi=undefined;renderSetup()">Rifai il test</button></div>
        <div class="card hero mt"><div class="tiny muted">I partiti più vicini a te</div><div class="row wrap mt" style="gap:6px">${close.slice(0, 3).map(x => `<span class="chip" style="--c:${x.p.color}">${partyMark(x.p.id, 19)}${esc(x.p.short)} ${Math.round(x.c)}%</span>`).join('')}</div><div class="tiny muted mt">Più sono vicini, più è facile allearsi e prendere i loro elettori.</div></div>
        <p class="small muted">Sposta i cursori per ritoccare. Sotto ogni tema trovi cosa significa ogni lato.</p>
        ${AXIS_KEYS.map(k => axisRowHTML(k, tgt[k])).join('')}
        <div class="card mt"><h4>Affinità con tutti i partiti</h4><div id="affinity" class="mt">${affinityHTML(close)}</div></div>`;
    }
  }
  if (st === 'Squadra') {
    body = `<h2>La tua squadra</h2><p class="muted small">I dirigenti del tuo partito: potranno diventare ministri. Puoi cambiare i nomi.</p>
    ${SETUP.party.people.map((n, i) => `<label class="lbl">Dirigente ${i + 1}</label><input value="${esc(n)}" oninput="SETUP.party.people[${i}]=this.value">`).join('')}`;
  }
  if (st === 'Difficoltà') {
    body = `<h2>Difficoltà</h2>
    ${Object.entries(DIFF).map(([k, d]) => `<div class="opt ${SETUP.diff === k ? 'on' : ''}" onclick="SETUP.diff='${k}';renderSetup()"><div class="t">${d.n}</div><div class="small muted mt">${{ facile: 'Alleati più docili, mercati calmi, il tuo partito cresce più in fretta. Per imparare.', media: 'Equilibrata: la politica italiana com’è, con qualche aiuto.', realistica: 'Alleati permalosi, franchi tiratori, spread nervoso. Come nella Prima Repubblica: i governi durano poco.' }[k]}</div></div>`).join('')}
    <div class="card mt"><h4>Riepilogo</h4><div class="mt small">
      <b>${esc(SETUP.player.name || '—')}</b>, ${SETUP.player.age} anni, ${BACKGROUNDS.find(b => b.id === SETUP.player.bg).n.toLowerCase()} da ${regionName(SETUP.player.region)}.<br>
      ${SETUP.mode === 'fondatore' ? `Fondi <b>${esc(SETUP.party.name || '—')}</b> (${esc(SETUP.party.short || '—')}).` : `Entri in <b>${PARTIES_DEF.find(p => p.id === SETUP.join.party).name}</b> come ${RANKS[SETUP.join.rank].n.toLowerCase()}.`}</div></div>`;
  }
  const last = SETUP.step === steps.length - 1;
  $('#app').innerHTML = `<div class="setup"><div class="body"><div class="steps">${steps.map((s, i) => `<i class="${i <= SETUP.step ? 'on' : ''}"></i>`).join('')}</div>${body}</div>
    <div class="foot"><button class="btn" onclick="${SETUP.step ? 'SETUP.step--;renderSetup()' : 'showSplash()'}">‹ Indietro</button><button class="btn ${last ? 'gold' : 'pri'} grow" onclick="setupNext()">${last ? 'Inizia la partita' : 'Avanti ›'}</button></div></div>`;
  $('.setup .body').scrollTop = 0;
}
function axisDistRaw(a, b) { let s = 0; AXIS_KEYS.forEach(k => { const d = (a[k] || 0) - (b[k] || 0); s += d * d; }); return Math.sqrt(s / AXIS_KEYS.length); }
function affinityHTML(close) {
  return close.map(x => `<div class="row" style="margin:6px 0"><span style="width:74px">${`<span class="chip" style="--c:${x.p.color}">${partyMark(x.p.id, 19)}${esc(x.p.short)}</span>`}</span><div class="grow">${barH(x.c, 100, pctColor(x.c), true)}</div><b class="small" style="width:40px;text-align:right">${Math.round(x.c)}%</b></div>`).join('');
}
function setAx(k, v) {
  const tgt = SETUP.mode === 'fondatore' ? SETUP.party.ax : SETUP.player.ax;
  tgt[k] = v; if (SETUP.mode === 'carriera') SETUP.join.ownIdeas = true;
  const pl = axisPosLabel(k, v), el = $('#axp_' + k); if (el) { el.textContent = pl.t; el.style.color = pl.c; }
  const close = PARTIES_DEF.map(p => ({ p, c: clamp(100 - axisDistRaw(tgt, p.ax) * 8, 0, 100) })).sort((a, b) => b.c - a.c);
  $('#affinity').innerHTML = affinityHTML(close);
}
function setupNext() {
  const steps = SETUP_STEPS(), st = steps[SETUP.step];
  if (st === 'Idee' && !SETUP.quizDone && !SETUP.manual) { toast('Rispondi alle domande o scegli «Imposta a mano»', 'bad'); return; }
  if (st === 'Personaggio' && !SETUP.player.name.trim()) { toast('Scrivi il tuo nome', 'bad'); return; }
  if (st === 'Partito' && SETUP.mode === 'fondatore' && (!SETUP.party.name.trim() || !SETUP.party.short.trim())) { toast('Dai un nome e una sigla al partito', 'bad'); return; }
  if (SETUP.step < steps.length - 1) { SETUP.step++; renderSetup(); return; }
  const cfg = { mode: SETUP.mode, diff: SETUP.diff, player: Object.assign({}, SETUP.player, { name: SETUP.player.name.trim() }) };
  if (SETUP.mode === 'fondatore') cfg.party = Object.assign({}, SETUP.party, { name: SETUP.party.name.trim(), short: SETUP.party.short.trim().toUpperCase() });
  else cfg.join = SETUP.join;
  newGame(cfg);
  rerollPlayerAvatar();
  UI.tab = 'home';
  renderGame();
  saveGame('auto');
  setTimeout(() => {
    confetti();
    openSheet(`<div class="center">${medal('flag', 84)}<h2 class="mt">Benvenut${G.player.art === 'la' ? 'a' : 'o'} in politica</h2>
      <p class="muted">${fmtDate(0)}. ${G.mode === 'fondatore' ? `${esc(P('MIO').name)} parte dall’${fmt1(P('MIO').poll)}%. Hai circa 30 settimane prima delle elezioni politiche: fatti conoscere, scrivi il programma, cerca alleati.` : `Sei ${RANKS[G.player.rank].n.toLowerCase()} di ${esc(myParty().name)}. Il leader è ${esc(myParty().leader)}: conquista la sua fiducia, costruisci il tuo seguito e scala il partito.`}</p></div>
      <button class="btn gold block mt" onclick="closeSheet();setTimeout(()=>startTutorial(0),320)">Guida rapida (consigliata)</button><button class="btn block mt" onclick="closeSheet()">Salta, conosco il gioco</button>`);
  }, 300);
}
