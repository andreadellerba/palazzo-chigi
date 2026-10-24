// ============================================================
//  RITRATTI DISEGNATI (stile Laurera) per leader, ministri e per te
// ============================================================
const AV_BASE = { viso: 'ovale', pelle: '#f6d0b6', capelli: 'corti', colCap: '#3d2b20', sfum: 'no', barba: 'no', colBarba: '', sopr: 'normali', occhi: 'mandorla', colOcchi: '#3b2618',
  naso: 'medio', bocca: 'sorriso', occhiali: 'no', testa: 'no', colTesta: '#ffffff', maglia: 'scolloV', colMaglia: '#1f2a44', colDett: '#f4f4f5', sfondo: 'auto', orecchini: false, lentiggini: false, guance: false, rughe: false, neo: false };
// aspetto dei personaggi più noti (stilizzato)
const AV_KNOWN = {
  'Giorgia Meloni': { capelli: 'lunghi', colCap: '#d8b06c', colOcchi: '#3c7fbf', orecchini: true, guance: true, colMaglia: '#1e3a8a', bocca: 'aperto' },
  'Elly Schlein': { capelli: 'caschetto', colCap: '#5a3a24', occhi: 'tondi', colOcchi: '#6b4a2a', colMaglia: '#be123c', bocca: 'mezzo' },
  'Giuseppe Conte': { capelli: 'indietro', colCap: '#2a1d16', sfum: 'tempie', viso: 'allungato', colMaglia: '#1f2937', bocca: 'mezzo' },
  'Antonio Tajani': { capelli: 'stempiato', colCap: '#9a9a9a', viso: 'tondo', colMaglia: '#1e3a8a', rughe: true },
  'Matteo Salvini': { capelli: 'corti', colCap: '#5a5048', sfum: 'brizzolato', barba: 'corta', colBarba: '#6b6b6b', colMaglia: '#15803d', maglia: 'felpa', bocca: 'aperto' },
  'Roberto Vannacci': { capelli: 'rasato', colCap: '#9a9a9a', viso: 'squadrato', sopr: 'dritte', bocca: 'serio', colMaglia: '#4d5a3a', maglia: 'girocollo', rughe: true },
  'Nicola Fratoianni e Angelo Bonelli': { capelli: 'stempiato', colCap: '#6b6b6b', barba: 'corta', colBarba: '#7a7a7a', occhiali: 'rett', colMaglia: '#15803d' },
  'Carlo Calenda': { capelli: 'corti', colCap: '#3d2b20', viso: 'tondo', colMaglia: '#0e7490', bocca: 'mezzo' },
  'Matteo Renzi': { capelli: 'corti', colCap: '#2a1d16', viso: 'tondo', bocca: 'aperto', colMaglia: '#be185d' },
  'Riccardo Magi': { capelli: 'corti', colCap: '#5a3a24', barba: 'accenno', occhiali: 'rett', colMaglia: '#7c3aed' },
  'Cateno De Luca': { capelli: 'chierica', colCap: '#6b6b6b', barba: 'corta', colBarba: '#6b6b6b', viso: 'tondo', colMaglia: '#c2410c' },
  'Maurizio Lupi': { capelli: 'stempiato', colCap: '#9a9a9a', occhiali: 'rett', colMaglia: '#0369a1' },
  'Sergio Mattarella': { capelli: 'stempiato', colCap: '#f2f2f2', viso: 'allungato', bocca: 'serio', rughe: true, colMaglia: '#111827' },
  'Giancarlo Giorgetti': { capelli: 'stempiato', colCap: '#cfcfcf', occhiali: 'rett', bocca: 'serio', colMaglia: '#14532d' },
  'Guido Crosetto': { capelli: 'pelato', colCap: '#9a9a9a', barba: 'corta', colBarba: '#9a9a9a', viso: 'tondo', colMaglia: '#1f2937' },
};
// personaggi femminili tra quelli noti (per il disegno del ritratto)
const AV_F = new Set(['Giorgia Meloni', 'Elly Schlein', 'Arianna Meloni', 'Eugenia Roccella', 'Daniela Santanchè', 'Isabella Rauti', 'Augusta Montaruli', 'Alessandra Locatelli', 'Vannia Gava', 'Anna Maria Bernini', 'Licia Ronzulli', 'Stefania Craxi', 'Maria Elisabetta Alberti Casellati', 'Letizia Moratti', 'Deborah Bergamini', 'Mariastella Gelmini', 'Mara Carfagna', 'Laura Ravetto', 'Chiara Braga', 'Debora Serracchiani', 'Pina Picierno', 'Chiara Appendino', 'Alessandra Todde', 'Paola Taverna', 'Mariolina Castellone', 'Barbara Floridia', 'Ilaria Salis', 'Ilaria Cucchi', 'Elisabetta Piccolotti', 'Giulia Pastorella', 'Elena Bonetti', 'Maria Elena Boschi', 'Raffaella Paita', 'Emma Bonino', 'Laura Castelli', 'Marina Elvira Calderone', 'Lucrezia Reichlin', 'Elsa Fornero', 'Paola Severino', 'Marta Cartabia', 'Luciana Lamorgese', 'Elisabetta Belloni', 'Maria Cristina Messa', 'Ilaria Capua', 'Stefania Proietti', 'Christine Lagarde', 'Ursula von der Leyen', 'Daniela Fumarola']);
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function seeded(seed) { let x = seed || 1; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 10000) / 10000; }; }
function avatarConfig(name, female, party) {
  if (G && G.player && name === G.player.name && G.player.av) return G.player.av;
  const r = seeded(hashStr(name)), pk = a => a[Math.floor(r() * a.length)];
  const F = female !== undefined ? female : AV_F.has(name);
  if (AV_KNOWN[name]) return Object.assign({}, AV_BASE, { guance: F, colMaglia: party && G && G.parties && G.parties[party] ? G.parties[party].color : AV_BASE.colMaglia }, AV_KNOWN[name]);
  const c = Object.assign({}, AV_BASE, {
    viso: pk(['ovale', 'tondo', 'squadrato', 'allungato']), pelle: pk(LAV.pelle.slice(0, 6)),
    capelli: F ? pk(['pixie', 'caschetto', 'lunghi', 'lunghiMossi', 'coda', 'chignon']) : pk(['corti', 'riga', 'indietro', 'stempiato', 'corti', 'spazzola', 'mossi', 'pelato']),
    colCap: pk(['#0f0d0c', '#2a1d16', '#3d2b20', '#5a3a24', '#7a5232', '#6b6b6b', '#9a9a9a', '#cfcfcf', '#d8b06c']),
    barba: F ? 'no' : pk(['no', 'no', 'no', 'accenno', 'corta', 'pizzetto']), occhiali: pk(['no', 'no', 'no', 'rett', 'tondi', 'meta']),
    bocca: pk(['sorriso', 'mezzo', 'serio', 'sorriso']), occhi: pk(['mandorla', 'tondi', 'piccoli']), colOcchi: pk(LAV.colOcchi),
    colMaglia: party && G && G.parties && G.parties[party] ? G.parties[party].color : pk(['#1f2937', '#1e3a8a', '#374151', '#111827']),
    orecchini: F && r() < 0.6, guance: F,
  });
  return Object.assign(c, AV_KNOWN[name] || {});
}
const AV_CACHE = {};
function portraitURI(name, female, party) {
  const key = name + '|' + (female ? 1 : 0) + '|' + (party || '') + '|' + (G && G.player && name === G.player.name && G.player.av ? JSON.stringify(G.player.av) : '');
  if (!AV_CACHE[key]) { try { AV_CACHE[key] = 'data:image/svg+xml,' + encodeURIComponent(lavSvg(avatarConfig(name, female, party))); } catch (e) { AV_CACHE[key] = ''; } }
  return AV_CACHE[key];
}
function portrait(name, size, opts) {
  opts = opts || {};
  const isMe = G && G.player && name === G.player.name;
  const uri = portraitURI(name, isMe ? G.player.art === 'la' : opts.female, opts.party);
  const ring = opts.ring || (opts.party && G.parties[opts.party] ? G.parties[opts.party].color : 'rgba(255,255,255,.2)');
  return `<span class="portrait" style="width:${size}px;height:${size}px;--ring:${ring}">${uri ? `<img src="${uri}" alt="">` : ''}</span>`;
}
function leaderPortrait(pid, size) { const n = leaderName(pid); return portrait(n, size, { party: pid }); }
// aspetto del giocatore: casuale ma stabile, si può cambiare dal profilo
function rerollPlayerAvatar() {
  const p = G.player, F = p.art === 'la';
  const r = Math.random, pk = a => a[Math.floor(r() * a.length)];
  p.av = Object.assign({}, AV_BASE, {
    viso: pk(['ovale', 'tondo', 'squadrato', 'allungato', 'cuore']), pelle: pk(LAV.pelle.slice(0, 7)),
    capelli: F ? pk(['pixie', 'caschetto', 'lunghi', 'lunghiMossi', 'coda', 'codaAlta', 'chignon', 'ricci']) : pk(['corti', 'riga', 'indietro', 'ciuffo', 'spazzola', 'mossi', 'ricciCorti', 'stempiato', 'rasato']),
    colCap: pk(LAV.colCap.slice(0, 13)), barba: F ? 'no' : pk(['no', 'no', 'accenno', 'corta', 'pizzetto', 'baffi']), colBarba: '',
    occhiali: pk(['no', 'no', 'no', 'rett', 'tondi']), bocca: pk(['sorriso', 'aperto', 'mezzo']), occhi: pk(['mandorla', 'tondi']), colOcchi: pk(LAV.colOcchi),
    colMaglia: myParty() ? myParty().color : '#1e3a8a', orecchini: F && r() < 0.6, guance: F,
  });
}
