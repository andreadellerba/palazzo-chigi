// ============================================================
//  EFFETTI A COLPO D'OCCHIO E CONSIGLI SUGLI INDICATORI
// ============================================================
// metriche: per ognuna "meglio" se il valore va nella direzione indicata
const METRICS = {
  pil:     { ico: '📈', n: 'PIL',        good: 1,  tip: 'Crescita economica' },
  deficit: { ico: '💶', n: 'Deficit',    good: -1, tip: 'Conti pubblici' },
  spread:  { ico: '📉', n: 'Spread',     good: -1, tip: 'Fiducia dei mercati' },
  lavoro:  { ico: '👷', n: 'Lavoro',     good: 1,  tip: 'Occupazione' },
  prezzi:  { ico: '🛒', n: 'Prezzi',     good: -1, tip: 'Inflazione' },
  consenso:{ ico: '🙂', n: 'Consenso',   good: 1,  tip: 'Gradimento degli italiani' },
};
// variazioni di una riforma rispetto a oggi (valori grezzi)
function effectsRaw(law, from, to) {
  const o0 = law.opts[from], o1 = law.opts[to], d = k => (o1.e[k] || 0) - (o0.e[k] || 0);
  return {
    pil: d('pil'),
    deficit: ((o1.costo || 0) - (o0.costo || 0)) / G.econ.pilNom * 100,
    spread: -(d('ue') * 0.5 + d('merc') * 1.2) + Math.max(0, ((o1.costo || 0) - (o0.costo || 0)) / G.econ.pilNom * 100 - 0.2) * 20,
    lavoro: -d('occ'),
    prezzi: d('infl'),
    consenso: d('pop'),
  };
}
const EFF_THR = { pil: 0.005, deficit: 0.02, spread: 2, lavoro: 0.01, prezzi: 0.05, consenso: 0.5 };
function effectsOf(law, from, to) {
  const r = effectsRaw(law, from, to);
  return Object.keys(METRICS).filter(k => Math.abs(r[k]) >= EFF_THR[k]).map(k => {
    const up = r[k] > 0, good = (up ? 1 : -1) * METRICS[k].good > 0;
    const big = Math.abs(r[k]) >= EFF_THR[k] * 6;
    return { k, up, good, big, v: r[k] };
  });
}
function effChipsHTML(effs, mine) {
  if (!effs.length && mine === undefined) return '';
  let h = effs.map(e => `<span class="eff ${e.good ? 'g' : 'b'}">${METRICS[e.k].ico} ${METRICS[e.k].n} ${e.up ? '▲' : '▼'}${e.big ? (e.up ? '▲' : '▼') : ''}</span>`).join('');
  if (mine !== undefined && Math.abs(mine) > 0.2) h += `<span class="eff ${mine > 0 ? 'g' : 'b'}">${mine > 0 ? '👍 Piace al tuo partito' : '👎 Contro le tue idee'}</span>`;
  if (!effs.length) h += '<span class="eff n">Nessun effetto economico</span>';
  return `<div class="effs">${h}</div>`;
}
// le riforme che migliorano di più un indicatore
function bestLawsFor(metric, n) {
  const busy = new Set(G.bills.filter(b => !b.dead && b.lawId).map(b => b.lawId));
  const out = [];
  allLaws().forEach(l => {
    if (busy.has(l.id)) return;
    const cur = G.laws[l.id];
    l.opts.forEach((o, i) => {
      if (i === cur) return;
      const r = effectsRaw(l, cur, i);
      const gain = r[metric] * METRICS[metric].good / EFF_THR[metric];
      if (gain <= 1) return;
      // penalità: costi, impopolarità, lontananza dalle tue idee
      const side = (r.consenso < 0 ? r.consenso * 0.6 : 0) + (metric !== 'deficit' && r.deficit > 0 ? -r.deficit * 8 : 0) + lawGain(myPid(), l, cur, i) * 3;
      const mine = lawGain(myPid(), l, cur, i);
      out.push({ l, i, score: gain * (mine < -0.2 ? 0.35 : 1) + side, effs: effectsOf(l, cur, i), mine });
    });
  });
  out.sort((a, b) => b.score - a.score);
  const seen = new Set(); const res = [];
  out.forEach(x => { if (!seen.has(x.l.id) && res.length < n) { seen.add(x.l.id); res.push(x); } });
  return res;
}
// stato degli indicatori economici: quali sono "in rosso"
function redMetrics() {
  const e = G.econ, out = [];
  if (e.pil < 0.4) out.push({ k: 'pil', t: `Crescita debole: PIL ${sgn(e.pil)}%` });
  if (e.spread > 180) out.push({ k: 'spread', t: `Spread alto: ${fmt0(e.spread)} punti` });
  if (e.deficit > 3.2) out.push({ k: 'deficit', t: `Deficit al ${fmt1(e.deficit)}%: sopra il limite UE` });
  if (e.dis > 7.5) out.push({ k: 'lavoro', t: `Disoccupazione al ${fmt1(e.dis)}%` });
  if (e.infl > 3) out.push({ k: 'prezzi', t: `Inflazione al ${fmt1(e.infl)}%` });
  if (G.gov && isPremier() && G.gov.approval < 35) out.push({ k: 'consenso', t: `Consenso del governo al ${fmt0(G.gov.approval)}%` });
  return out;
}
function openAdvice(metric) {
  const m = METRICS[metric];
  const list = bestLawsFor(metric, 6);
  let h = head(`${m.ico} Migliorare: ${m.n}`, m.tip);
  const extra = {
    deficit: 'In manovra: scegli più coperture (spending review, contributo delle banche, taglio dei bonus) e meno spese.',
    spread: 'Anche una «Missione a Bruxelles», conti in ordine e un governo stabile abbassano lo spread.',
    pil: 'In manovra: investimenti pubblici e incentivi alle imprese (Transizione 5.0) spingono la crescita.',
    consenso: 'Conferenze stampa, visite nelle regioni e leggi popolari risollevano il consenso.',
    lavoro: 'In manovra: decontribuzione per chi assume e investimenti pubblici.',
    prezzi: 'In manovra: il fondo contro il caro bollette raffredda i prezzi.',
  }[metric];
  if (extra) h += `<div class="tip"><b class="h">💡 Idea</b><div class="small" style="margin-top:4px">${extra}</div></div>`;
  h += `<h4>Leggi che aiutano</h4>`;
  if (!list.length) h += '<div class="small muted mt">Nessuna riforma disponibile migliora questo indicatore in modo sensibile.</div>';
  list.forEach(x => {
    h += `<button class="choice" onclick="closeSheet();openLaw('${x.l.id}',${x.i})"><div class="tiny muted">${LAW_CATS[x.l.cat] || ''} ${esc(x.l.nome)}</div><div class="t">${esc(x.l.opts[x.i].t)}</div>${effChipsHTML(x.effs, x.mine)}</button>`;
  });
  openSheet(h);
}
