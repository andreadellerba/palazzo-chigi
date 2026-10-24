// ============================================================
//  CREA IL TUO AVATAR: tocca il ritratto e scegli ogni dettaglio
// ============================================================
// sezioni dell'editor: per ognuna le scelte (miniature), i colori e gli interruttori
const AVE_TABS = [
  { id: 'viso', n: 'Viso', i: 'smile', parts: [{ k: 'viso', n: 'Forma del viso', z: 'face' }, { col: 'pelle', n: 'Carnagione', list: () => LAV.pelle }, { tog: [['lentiggini', 'Lentiggini'], ['guance', 'Guance rosate'], ['rughe', 'Rughe d’espressione'], ['neo', 'Neo']] }] },
  { id: 'capelli', n: 'Capelli', i: 'sparkle', parts: [{ k: 'capelli', n: 'Taglio' }, { col: 'colCap', n: 'Colore', list: () => LAV.colCap }, { k: 'sfum', n: 'Sfumature', chips: true }] },
  { id: 'barba', n: 'Barba', i: 'user', parts: [{ k: 'barba', n: 'Barba e baffi', z: 'face' }, { col: 'colBarba', n: 'Colore', list: () => [''].concat(LAV.colCap), auto: 'Come i capelli' }] },
  { id: 'occhi', n: 'Occhi', i: 'eye', parts: [{ k: 'occhi', n: 'Forma degli occhi', z: 'eyes' }, { col: 'colOcchi', n: 'Colore degli occhi', list: () => LAV.colOcchi }, { k: 'sopr', n: 'Sopracciglia', z: 'eyes' }, { k: 'occhiali', n: 'Occhiali', z: 'eyes' }] },
  { id: 'bocca', n: 'Bocca', i: 'mic', parts: [{ k: 'bocca', n: 'Espressione', z: 'mouth' }, { k: 'naso', n: 'Naso', z: 'nose' }, { tog: [['rossetto', 'Rossetto']] }] },
  { id: 'testa', n: 'Accessori', i: 'cap', parts: [{ k: 'testa', n: 'In testa' }, { col: 'colTesta', n: 'Colore', list: () => LAV.colori }, { tog: [['orecchini', 'Orecchini']] }] },
  { id: 'maglia', n: 'Vestiti', i: 'briefcase', parts: [{ k: 'maglia', n: 'Capo', z: 'body' }, { col: 'colMaglia', n: 'Colore', list: () => [myParty().color].concat(LAV.colori.filter(c => c !== myParty().color)) }, { col: 'colDett', n: 'Dettagli', list: () => LAV.colori }] },
  { id: 'sfondo', n: 'Sfondo', i: 'palette', parts: [{ col: 'sfondo', n: 'Sfondo', list: () => LAV.sfondi, auto: 'Come il vestito' }] },
];
const AVE_ZOOM = { face: 'scale(1.3)', eyes: 'scale(2.3)', mouth: 'scale(2.3)', nose: 'scale(2.3)', body: 'scale(1.45)' };
const AVE_ORIG = { face: '50% 55%', eyes: '50% 47%', mouth: '50% 64%', nose: '50% 57%', body: '50% 100%' };
let AVE = null;
const AVE_THUMBS = {};
function aveURI(c) { const k = JSON.stringify(c); if (!AVE_THUMBS[k]) { try { AVE_THUMBS[k] = 'data:image/svg+xml,' + encodeURIComponent(lavSvg(c)); } catch (e) { AVE_THUMBS[k] = ''; } } return AVE_THUMBS[k]; }
function openAvatarEditor() {
  if (!G || !G.player) return;
  if (!G.player.av) rerollPlayerAvatar();
  AVE = { c: Object.assign({}, AV_BASE, G.player.av), tab: AVE ? AVE.tab : 'viso' };
  openSheet('', { full: true, locked: true });
  renderAvatarEditor();
}
function renderAvatarEditor(keep) {
  const sh = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null, st = sh ? sh.scrollTop : 0;
  const c = AVE.c, tab = AVE_TABS.find(t => t.id === AVE.tab);
  let h = `<div class="ave-top"><button class="btn sm" onclick="AVE=null;closeSheet()">Annulla</button><img src="${aveURI(c)}" alt=""><button class="btn sm gold" onclick="saveAvatar()">Salva</button></div>
    <div class="scrollx">${AVE_TABS.map(t => `<button class="fchip ${t.id === AVE.tab ? 'on' : ''}" onclick="AVE.tab='${t.id}';renderAvatarEditor()">${icon(t.i)} ${t.n}</button>`).join('')}</div>
    <div class="row mt" style="gap:8px;justify-content:center"><button class="btn sm" onclick="randomAvatar()">${icon('dice')} Casuale</button><button class="btn sm" onclick="AVE.c=Object.assign({},AV_BASE,G.player.av);renderAvatarEditor(true)">${icon('refresh')} Com’era</button></div>`;
  tab.parts.forEach(p => {
    if (p.k) {
      h += `<label class="lbl">${p.n}</label>`;
      if (p.chips) h += `<div class="row wrap" style="gap:6px">${LAV[p.k].map(([v, n]) => `<button class="fchip ${c[p.k] === v ? 'on' : ''}" onclick="setAve('${p.k}','${v}')">${n}</button>`).join('')}</div>`;
      else h += `<div class="ave-grid">${LAV[p.k].map(([v, n]) => { const t = Object.assign({}, c, { [p.k]: v }); return `<button class="ave-opt ${c[p.k] === v ? 'on' : ''}" onclick="setAve('${p.k}','${v}')"><span class="ave-th"><img src="${aveURI(t)}" alt="" style="${p.z ? `transform:${AVE_ZOOM[p.z]};transform-origin:${AVE_ORIG[p.z]}` : ''}"></span>${n}</button>`; }).join('')}</div>`;
    }
    if (p.col) {
      h += `<label class="lbl">${p.n}</label><div class="swatches">${p.list().map(v => v === '' || v === 'auto' ? `<button class="auto ${c[p.col] === v ? 'on' : ''}" onclick="setAve('${p.col}','${v}')" title="${p.auto}">${icon('refresh', 16)}</button>` : `<button class="${c[p.col] === v ? 'on' : ''}" style="background:${v}" onclick="setAve('${p.col}','${v}')"></button>`).join('')}</div>${p.auto ? `<div class="tiny muted" style="margin-top:6px">${icon('refresh', 13)} = ${p.auto.toLowerCase()}</div>` : ''}`;
    }
    if (p.tog) h += `<div class="card tight mt"><div class="list">${p.tog.map(([k, n]) => `<div class="li click" onclick="setAve('${k}',${!c[k]})"><b class="small grow">${n}</b><span class="tgl ${c[k] ? 'on' : ''}"><i></i></span></div>`).join('')}</div></div>`;
  });
  h += `<button class="btn gold block mt2" onclick="saveAvatar()">${icon('check')} Salva il mio avatar</button>`;
  replaceSheet(h);
  const s2 = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null;
  if (s2 && keep !== false) s2.scrollTop = keep ? st : 0;
}
function setAve(k, v) { AVE.c[k] = v; vib(6); renderAvatarEditor(true); }
function randomAvatar() { const old = G.player.av; rerollPlayerAvatar(); AVE.c = Object.assign({}, AV_BASE, G.player.av); G.player.av = old; renderAvatarEditor(true); }
function saveAvatar() {
  G.player.av = Object.assign({}, AVE.c);
  AVE = null; closeSheet(); saveGame('auto'); renderGame();
  toast('Avatar salvato', 'good');
}
