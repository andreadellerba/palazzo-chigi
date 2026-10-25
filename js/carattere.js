// ============================================================
//  CARATTERE E ISPIRAZIONE del personaggio (creazione partita)
//  due tratti a scelta + una figura a cui ti ispiri (o scritta da te)
// ============================================================
const TRAITS = [
  { id: 'mediatore', n: 'Mediatore', d: 'Gli alleati ti trovano ragionevole: rapporti migliori con tutti, maggioranza più tranquilla.', fx: { rel: 4 }, wk: 'allies' },
  { id: 'trascinatore', n: 'Trascinatore', d: 'Comizi e interviste ti riescono meglio, ma studi poco i dossier.', fx: { car: 2, comp: -1 } },
  { id: 'tecnico', n: 'Tecnico', d: 'Competente e affidabile per mercati ed Europa, meno brillante in TV.', fx: { comp: 1, car: -1, grp: { merc: 10, ue: 8 } } },
  { id: 'populista', n: 'Populista', d: 'Parli alla pancia del Paese: cresci più in fretta, ma Bruxelles e i mercati diffidano.', fx: { fama: 4, grp: { ue: -10, merc: -6 } }, wk: 'push' },
  { id: 'testardo', n: 'Testardo', d: 'Non cambi idea: più credibilità, ma il leader e gli alleati ti trovano rigido.', fx: { cred: 8, rap: -6, rel: -2 } },
  { id: 'prudente', n: 'Prudente', d: 'Rischi poco: meno scandali e gaffe, ma fai meno notizia.', fx: { integ: 1, fama: -2 } },
  { id: 'ambizioso', n: 'Ambizioso', d: 'Punti in alto: cresce il tuo seguito nel partito, il leader ti tiene d’occhio.', fx: { seguito: 10, rap: -8, fama: 2 } },
  { id: 'comunicatore', n: 'Comunicatore', d: 'Sai usare TV e social: i media ti seguono di più.', fx: { fama: 3, grp: { media: 15 } } },
  { id: 'onesto', n: 'Incorruttibile', d: 'Integrità a prova di inchiesta: meno fondi dai donatori, più fiducia degli elettori.', fx: { integ: 2, funds: -30, cred: 5 } },
  { id: 'fumantino', n: 'Fumantino', d: 'Reagisci d’istinto: in TV buchi lo schermo, ma ogni tanto esageri.', fx: { car: 1, integ: -1, grp: { media: -5 } } },
];
const ISPIRAZIONI = [
  { id: 'degasperi', n: 'Alcide De Gasperi', d: 'Il padre dell’Italia in Europa: più credibilità a Bruxelles e al Quirinale.', fx: { grp: { ue: 12, quir: 6 } } },
  { id: 'berlinguer', n: 'Enrico Berlinguer', d: 'La questione morale: più integrità e credibilità.', fx: { integ: 1, cred: 8 } },
  { id: 'moro', n: 'Aldo Moro', d: 'L’arte della mediazione: rapporti migliori con tutti i partiti.', fx: { rel: 5 } },
  { id: 'pertini', n: 'Sandro Pertini', d: 'Il presidente più amato: più simpatia popolare.', fx: { fama: 4, grp: { quir: 4 } } },
  { id: 'einaudi', n: 'Luigi Einaudi', d: 'Conti in ordine e moneta solida: i mercati si fidano di più.', fx: { comp: 1, grp: { merc: 12 } } },
  { id: 'craxi', n: 'Bettino Craxi', d: 'Decisionismo: più carisma, ma più rischio di scandali.', fx: { car: 1, integ: -1 } },
  { id: 'pannella', n: 'Marco Pannella', d: 'Diritti e referendum: più spazio sui media e sui temi civili.', fx: { fama: 2, grp: { media: 8 } } },
  { id: 'berlusconi', n: 'Silvio Berlusconi', d: 'Il politico televisivo: più efficace in TV e con le imprese.', fx: { car: 1, grp: { media: 10, conf: 8 } } },
  { id: 'spinelli', n: 'Altiero Spinelli', d: 'Il sogno federale europeo: Bruxelles ti vede come un alleato.', fx: { grp: { ue: 15 } } },
  { id: 'churchill', n: 'Winston Churchill', d: 'Leadership nelle crisi: più carisma e fama.', fx: { car: 1, fama: 2 } },
  { id: 'mitterrand', n: 'François Mitterrand', d: 'Il socialista che governò a lungo: più competenza e sindacati vicini.', fx: { comp: 1, grp: { sind: 8 } } },
];
function characterStepHTML() {
  const pl = SETUP.player; pl.traits = pl.traits || []; pl.insp = pl.insp || null;
  const tr = TRAITS.map(t => `<div class="opt ${pl.traits.includes(t.id) ? 'on' : ''}" onclick="toggleTrait('${t.id}')"><div class="t bgt">${t.n}</div><div class="small muted" style="margin-top:3px">${t.d}</div></div>`).join('');
  const ins = ISPIRAZIONI.map(s => `<div class="opt ${pl.insp && pl.insp.id === s.id && !pl.insp.custom ? 'on' : ''}" onclick="pickInsp('${s.id}')"><div class="t bgt">${s.n}</div><div class="small muted" style="margin-top:3px">${s.d}</div></div>`).join('');
  const cu = pl.insp && pl.insp.custom;
  return `<h2>Il tuo carattere</h2><p class="muted">Scegli due tratti: cambiano come reagiscono alleati, media ed elettori.</p>
    <label class="lbl">Carattere · ${pl.traits.length}/2</label>${tr}
    <label class="lbl">A chi ti ispiri</label><p class="small muted" style="margin:0 0 8px">Il tuo modello politico: i giornalisti lo citeranno e ti dà un piccolo vantaggio.</p>${ins}
    <div class="opt ${cu ? 'on' : ''}"><div class="t bgt">Scrivo io</div><div class="small muted" style="margin-top:3px">Un nome qualsiasi (anche tuo nonno o il sindaco del paese) e lo stile che ti ha insegnato.</div>
      <input class="mt" placeholder="Nome" value="${esc(cu ? pl.insp.name : '')}" oninput="customInsp(this.value, null)">
      <select class="mt" onchange="customInsp(null, this.value)">${ISPIRAZIONI.map(s => `<option value="${s.id}" ${cu && pl.insp.id === s.id ? 'selected' : ''}>Stile: ${esc(s.d.split(':')[0])}</option>`).join('')}</select></div>`;
}
function toggleTrait(id) {
  const t = SETUP.player.traits = SETUP.player.traits || [];
  if (t.includes(id)) t.splice(t.indexOf(id), 1);
  else if (t.length >= 2) return toast('Massimo due tratti: togline uno', 'bad');
  else t.push(id);
  const b = document.querySelector('.setup .body'), st = b ? b.scrollTop : 0; renderSetup(); const b2 = document.querySelector('.setup .body'); if (b2) b2.scrollTop = st;
}
function pickInsp(id) {
  const pl = SETUP.player; pl.insp = pl.insp && pl.insp.id === id && !pl.insp.custom ? null : { id };
  const b = document.querySelector('.setup .body'), st = b ? b.scrollTop : 0; renderSetup(); const b2 = document.querySelector('.setup .body'); if (b2) b2.scrollTop = st;
}
function customInsp(name, style) {
  const pl = SETUP.player, cur = pl.insp && pl.insp.custom ? pl.insp : { custom: true, name: '', id: ISPIRAZIONI[0].id };
  if (name !== null) cur.name = name;
  if (style !== null) cur.id = style;
  pl.insp = cur.name.trim() ? cur : null;
  if (style !== null) { const b = document.querySelector('.setup .body'), st = b ? b.scrollTop : 0; renderSetup(); const b2 = document.querySelector('.setup .body'); if (b2) b2.scrollTop = st; }
}
function applyCharFx(fx) {
  const p = G.player;
  if (fx.car) p.car = clamp(p.car + fx.car, 1, 10);
  if (fx.comp) p.comp = clamp(p.comp + fx.comp, 1, 10);
  if (fx.integ) p.integ = clamp(p.integ + fx.integ, 1, 10);
  if (fx.fama) p.fama = clamp(p.fama + fx.fama, 0, 100);
  if (fx.seguito) p.seguito = clamp((p.seguito || 0) + fx.seguito, 0, 100);
  if (fx.rap) p.rap = clamp((p.rap || 0) + fx.rap, -100, 100);
  if (fx.cred) G.cred = clamp((G.cred || 50) + fx.cred, 0, 100);
  if (fx.funds) G.funds = Math.max(0, G.funds + fx.funds);
  if (fx.grp) Object.keys(fx.grp).forEach(k => { if (G.groups[k] !== undefined) G.groups[k] = clamp(G.groups[k] + fx.grp[k], -100, 100); });
  if (fx.rel) PIDS().forEach(id => { if (id !== myPid()) addRel(id, myPid(), fx.rel); });
}
function applyCharacter(pl) {
  const p = G.player;
  p.traits = (pl.traits || []).slice(0, 2);
  p.traits.forEach(id => { const t = TRAITS.find(x => x.id === id); if (t) applyCharFx(t.fx); });
  if (pl.insp) {
    const s = ISPIRAZIONI.find(x => x.id === pl.insp.id);
    if (s) { p.insp = { name: pl.insp.custom ? pl.insp.name.trim() : s.n, id: s.id }; applyCharFx(s.fx); addNews(`${p.name}: «Il mio modello? ${p.insp.name}».`, 'mio'); }
  }
}
// effetti settimanali di alcuni tratti
function characterTick() {
  const t = G.player.traits || [];
  if (t.includes('mediatore') && G.gov && inGov(myPid())) G.gov.parties.forEach(q => { if (q !== myPid() && G.gov.sat[q] !== undefined) G.gov.sat[q] = clamp(G.gov.sat[q] + 0.15, 0, 100); });
  if (t.includes('populista')) myParty().spinta += 0.12;
  if (t.includes('fumantino') && chance(0.03)) { applyCharFx({ fama: 2 }); myParty().spinta -= 0.8; addNews(`Gaffe di ${G.player.name} in diretta: una frase di troppo fa discutere.`, 'bad'); }
}
const _storyTickChar = storyTick;
storyTick = function () { _storyTickChar(); try { characterTick(); } catch (e) { console.error(e); } };
// nel profilo: carattere e ispirazione
const _openProfileChar = openProfile;
openProfile = function () {
  _openProfileChar();
  const p = G.player, sh = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null;
  if (!sh || (!(p.traits || []).length && !p.insp)) return;
  const tn = (p.traits || []).map(id => (TRAITS.find(t => t.id === id) || {}).n).filter(Boolean);
  const box = `<div class="card tight mt"><div class="tiny gold" style="font-weight:800;letter-spacing:.1em">CARATTERE</div><div class="mt"><b>${tn.map(esc).join(' · ') || '—'}</b></div>${p.insp ? `<div class="small muted mt">Si ispira a <b class="y">${esc(p.insp.name)}</b></div>` : ''}</div>`;
  const first = sh.querySelector('.sheet-head'); if (first) first.insertAdjacentHTML('afterend', box); else sh.insertAdjacentHTML('afterbegin', box);
};
