// ============================================================
//  STILE "PALAZZO": icone a linea, medaglioni, mini grafici,
//  iter delle leggi spiegato, glossario del Parlamento
// ============================================================
const ICON_PATHS = {
  tv: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 3l4 3 4-3"/>',
  mega: '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>',
  phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
  cup: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z"/><path d="M16 11h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3"/>',
  coin: '<circle cx="12" cy="12" r="8"/><path d="M15 9.5a3 3 0 1 0 0 5M8 11h5M8 13h5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
  vote: '<path d="M4 13h16v7H4z"/><path d="M8 13l3-8 6 2-2 6"/>',
  doc: '<path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  building: '<path d="M3 9l9-5 9 5"/><path d="M5.5 10.5v7M9.8 10.5v7M14.2 10.5v7M18.5 10.5v7"/><path d="M3 20.5h18"/>',
  hands: '<path d="M7 11l3-3 3 2 4-4 4 4-6 6-3-2-3 3z"/><path d="M3 12l4-4"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  factory: '<path d="M3 20V10l5 3V10l5 3V6h4l1 4h3v10z"/><path d="M7 17h2M12 17h2M17 17h2"/>',
  eu: '<circle cx="12" cy="12" r="8"/><path d="M12 6v.01M16 7.5v.01M18 12v.01M16 16.5v.01M12 18v.01M8 16.5v.01M6 12v.01M8 7.5v.01"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-5l-2 2M4 13a8 8 0 0 0 14 5l2-2"/><path d="M4 4v4h4M20 20v-4h-4"/>',
  door: '<path d="M6 21V4h10v17"/><path d="M3 21h18M13 12h.01"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
  radio: '<rect x="3" y="8" width="18" height="12" rx="2"/><circle cx="8" cy="14" r="2.5"/><path d="M14 12h4M14 16h4M7 8l9-5"/>',
  podium: '<path d="M3 21h18M5 21V12h4v9M10 21V8h4v13M15 21v-6h4v6"/>',
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
  salute: '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z"/>',
  puzzle: '<path d="M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3z"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  chartdown: '<path d="M3 7l6 6 4-4 8 8"/><path d="M15 17h6v-6"/>',
  sword: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="M13 19l6-6M16 16l4 4M19 21l2-2"/>',
  split: '<path d="M6 3v6a6 6 0 0 0 6 6 6 6 0 0 1 6 6M18 3v6a6 6 0 0 1-3 5"/><path d="M3 6l3-3 3 3M15 6l3-3 3 3"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  gavel: '<path d="M14 4l6 6M11 7l6 6M8 10l6-6 6 6-6 6zM3 21l8-8"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  fire: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 2 1 3 2 3-4Z"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  euro: '<path d="M17 6.5a7 7 0 1 0 0 11"/><path d="M4 10h9M4 14h9"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-5-6.7"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  wave: '<path d="M2 14c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 6 0"/><path d="M2 19c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 6 0"/><path d="M8 9c1-3 4-5 8-5"/>',
  rain: '<path d="M7 15a4.5 4.5 0 1 1 .8-8.9A6 6 0 0 1 19 9a3.5 3.5 0 0 1-1 6.8"/><path d="M9 18l-1 3M13 18l-1 3M17 18l-1 3"/>',
  volcano: '<path d="M3 21l6-10h6l6 10z"/><path d="M10 11l2-3 2 3M12 3v2M8 4l1 2M16 4l-1 2"/>',
  fist: '<path d="M7 11V7.5a1.5 1.5 0 0 1 3 0V10M10 9V6.5a1.5 1.5 0 0 1 3 0V10M13 9.5V7a1.5 1.5 0 0 1 3 0v4"/><path d="M16 10a1.5 1.5 0 0 1 3 0v3a7 7 0 0 1-7 7h-1a6 6 0 0 1-6-6v-1a2 2 0 0 1 2-2h3"/>',
  car: '<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3zM7 19v2M17 19v2"/><path d="M7.5 13.5h.01M16.5 13.5h.01"/>',
  bank: '<path d="M3 9 12 4l9 5"/><path d="M5 10v7M9 10v7M15 10v7M19 10v7M3 20h18"/><path d="M12 7h.01"/>',
  baby: '<circle cx="12" cy="10" r="6"/><path d="M9.5 10h.01M14.5 10h.01M10 13a3 3 0 0 0 4 0"/><path d="M7 20c1-2 3-3 5-3s4 1 5 3"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  scales: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/>',
  headset: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  swap: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>',
  church: '<path d="M12 2v5M10 4h4"/><path d="M6 21V11l6-4 6 4v10z"/><path d="M10 21v-4a2 2 0 0 1 4 0v4"/>',
  candle: '<path d="M9 21h6V10H9zM12 10V8"/><path d="M12 3c1.5 1.5 1.5 3 0 4-1.5-1-1.5-2.5 0-4z"/>',
  helmet: '<path d="M4 15a8 8 0 0 1 16 0z"/><path d="M2 15h20v2H2zM12 7v4"/>',
  hospital: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>',
  tractor: '<circle cx="7" cy="16" r="4"/><circle cx="18" cy="18" r="2"/><path d="M7 12V6h6l2 6h4v4h-3M11 16h5"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  laptop: '<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M2 19h20"/>',
  dove: '<path d="M3 13c3 0 5-2 6-5 1 3 3 4 6 4l5-5-1 6c-1 5-5 8-10 8-3 0-5-1-6-3l3-2c-1 0-2-1-3-3z"/>',
  stetho: '<path d="M6 3v6a5 5 0 0 0 10 0V3"/><path d="M11 14v2a5 5 0 0 0 10 0v-2"/><circle cx="21" cy="12" r="1.6"/>',
  tent: '<path d="M3 20 12 4l9 16zM12 4v16M8 20l4-6 4 6"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  hand: '<path d="M8 11V5a1.5 1.5 0 0 1 3 0v5M11 10V3.5a1.5 1.5 0 0 1 3 0V10M14 10V5a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7h-.5a6 6 0 0 1-5.4-3.4L2.5 13a1.5 1.5 0 0 1 2.6-1.4L8 15"/>',
  trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4.5a2.5 2.5 0 0 0 2.5 4M17 6h2.5a2.5 2.5 0 0 1-2.5 4M12 14v3M8.5 21h7M9.5 17h5v4h-5z"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
  frown: '<circle cx="12" cy="12" r="9"/><path d="M8.5 16a4 4 0 0 1 7 0M9 9.5h.01M15 9.5h.01"/>',
  cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/>',
  rocket: '<path d="M12 2c3 3 5 7 4 12l-4 3-4-3C7 9 9 5 12 2z"/><path d="M8 14l-3 3 1 3 3-2M16 14l3 3-1 3-3-2"/><circle cx="12" cy="9" r="1.5"/>',
  crown: '<path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 11H5L3 7Z"/><path d="M5 21h14"/>',
  medal: '<circle cx="12" cy="15" r="5"/><path d="M8 3l3 7M16 3l-3 7M12 13v4"/>',
  ambulance: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M8.5 9v4M6.5 11h4"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 8.5h.01M15.5 15.5h.01M15.5 8.5h.01M8.5 15.5h.01M12 12h.01"/>',
  burst: '<path d="M12 2l2 6 6-3-3 6 6 2-6 2 3 6-6-3-2 6-2-6-6 3 3-6-6-2 6-2-3-6 6 3z"/>',
  axe: '<path d="M14 4l6 6-3 3-6-6zM12 9l-9 9 3 3 9-9"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  umbrella: '<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v7a2 2 0 0 1-4 0"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  leaf: '<path d="M5 20c0-9 6-15 15-15 0 9-6 15-15 15zM5 20l7-7"/>',
  cart: '<path d="M3 4h2l2.5 11h11L21 8H6.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
  bridge: '<path d="M2 16h20M4 16V9M20 16V9M4 9c4 4 12 4 16 0M8 11v5M12 12v4M16 11v5"/>',
  wheat: '<path d="M12 21V8"/><path d="M12 8c-3 0-4-2-4-5 3 0 4 2 4 5zM12 8c3 0 4-2 4-5-3 0-4 2-4 5zM12 13c-3 0-4-2-4-5 3 0 4 2 4 5zM12 13c3 0 4-2 4-5-3 0-4 2-4 5z"/>',
  mask: '<path d="M4 5h16v6a8 8 0 0 1-16 0z"/><path d="M8.5 10h.01M15.5 10h.01M9 14a4 4 0 0 0 6 0"/>',
  plane: '<path d="M10.5 13.5 3 11l1-2 7.5 1.5L16 4h2l-1.5 7.5L21 13l-1 2-4.5-1-3.5 6h-2l1-6z"/>',
  ship: '<path d="M3 15l2 5h14l2-5z"/><path d="M6 15V9h12v6M12 9V4M9 6h6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c1 1 1 2 1 2.5h6c0-.5 0-1.5 1-2.5A6 6 0 0 0 12 3z"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  siren: '<path d="M7 18v-5a5 5 0 0 1 10 0v5M5 18h14v3H5zM12 3v2M4 7l1.5 1.5M20 7l-1.5 1.5"/>',
  news: '<rect x="3" y="5" width="15" height="15" rx="2"/><path d="M18 9h3v9a2 2 0 0 1-2 2M7 9h7M7 13h7M7 17h4"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',
  hourglass: '<path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  truck: '<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  drop: '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M12 7l4 3-1.5 5h-5L8 10z"/>',
  save: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  grad: '<path d="M3 21h18M5 21V10l7-5 7 5v11"/><path d="M9 21v-6h6v6"/>',
  palette: '<path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2s-1-2 0-3 2-1 3-1a4 4 0 0 0 4-4c0-4.5-4-8-9-8z"/><path d="M7.5 11h.01M10 7.5h.01M14.5 7.5h.01"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M4 20l4-1 11-11-3-3L5 16z"/>',
};
function icon(name, size) { const p = ICON_PATHS[name]; if (!p) return ''; return `<svg class="lic" viewBox="0 0 24 24"${size ? ` style="width:${size}px;height:${size}px"` : ''}>${p}</svg>`; }
// azione -> icona a linea
const ACT_ICON = { vertice: 'hands', conferenza: 'mic', parti: 'factory', bruxelles: 'eu', rimpasto: 'refresh', anticipate: 'vote', dimissioni: 'door', tv: 'tv', social: 'phone', comizio: 'mega', visita: 'map', incontro: 'cup', sedi: 'building', fondi: 'coin', manif: 'flag', sfiducia: 'gavel', crisi: 'fire', spot: 'radio', dibattito: 'podium', primarie: 'vote', territorio: 'home', lealta: 'salute', corrente: 'puzzle', promo: 'trend', congresso: 'sword', scissione: 'split', riposo: 'sun', poteri: 'key' };
// categorie di leggi, indicatori economici e poteri -> icona
const CAT_ICON = { Pensioni: 'hourglass', Lavoro: 'briefcase', Fisco: 'coin', Welfare: 'hand', Famiglia: 'baby', Sanità: 'hospital', Diritti: 'scales', Immigrazione: 'wave', Giustizia: 'gavel', Sicurezza: 'shield', Istituzioni: 'building', Scuola: 'book', Università: 'cap', Ambiente: 'leaf', Energia: 'bolt', Infrastrutture: 'bridge', Economia: 'factory', Difesa: 'helmet', Europa: 'eu', Territorio: 'map', Agricoltura: 'wheat', Cultura: 'mask', Tutte: 'folder' };
const METRIC_ICON = { pil: 'trend', deficit: 'euro', spread: 'chartdown', lavoro: 'briefcase', prezzi: 'cart', consenso: 'smile' };
const GROUP_ICON = { sind: 'fist', conf: 'factory', chiesa: 'church', ue: 'eu', merc: 'chart', quir: 'building', mag: 'gavel', media: 'tv' };
// emoji usate nei testi -> icona a linea equivalente
const EMO_ICON = { '🗳': 'vote', '⚠️': 'alert', '🏛': 'building', '💶': 'euro', '🔴': 'alert', '⏳': 'clock', '🔥': 'fire', '📋': 'clipboard', '🤝': 'hands', '📈': 'trend', '⚔️': 'sword', '⚡': 'bolt', '😮‍💨': 'sun', '📉': 'chartdown', '👷': 'briefcase', '🛒': 'cart', '🙂': 'smile', '✍️': 'pen', '🗺': 'map',
  '🌊': 'wave', '🌧': 'rain', '🌋': 'volcano', '☀️': 'sun', '✊': 'fist', '🏭': 'factory', '🚗': 'car', '🇺🇸': 'globe', '🏦': 'bank', '🇪🇺': 'eu', '👶': 'baby', '🕵️': 'eye', '🎙': 'mic', '📺': 'tv', '⚖️': 'scales', '🎧': 'headset', '🔀': 'swap', '📕': 'book', '⛪': 'church', '🕯': 'candle', '⛑': 'helmet', '🏥': 'hospital', '🚜': 'tractor', '🚕': 'car', '🚔': 'shield', '💻': 'laptop', '🇺🇦': 'globe', '🕊': 'dove', '📱': 'phone', '📊': 'chart', '🩺': 'stetho', '🗡': 'sword', '🎪': 'tent', '📞': 'phone', '🗂': 'folder', '✋': 'hand', '📣': 'mega', '☕': 'cup', '🗓': 'calendar', '🏆': 'trophy', '🌟': 'sparkle', '😓': 'frown', '👏': 'hands', '😬': 'frown', '💔': 'frown', '🎓': 'cap', '🚀': 'rocket', '👑': 'crown', '🏅': 'medal', '🚑': 'ambulance', '🏘': 'home', '📖': 'book', '🇮🇹': 'flag', '🎲': 'dice', '💥': 'burst', '🚪': 'door', '🪓': 'axe', '🫡': 'salute', '🧩': 'puzzle', '🏢': 'building', '💰': 'coin', '🚩': 'flag', '📡': 'radio', '🎤': 'podium', '🏖': 'umbrella', '💼': 'briefcase', '🎯': 'target', '🚨': 'siren', '🔒': 'lock', '🔔': 'bell', '✅': 'check', '❌': 'x', '📜': 'doc', '📄': 'doc', '🛑': 'hand', '📝': 'pen', '💡': 'bulb', '🧭': 'target', '✈️': 'plane', '🚢': 'ship', '🛢': 'drop', '🧠': 'chip', '⚽': 'ball', '🎭': 'mask', '🌾': 'wheat', '🌳': 'leaf', '🌉': 'bridge', '🎖': 'helmet', '👴': 'hourglass', '🛠': 'briefcase', '🤲': 'hand', '🚓': 'shield', '🏫': 'book', '📰': 'news', '📷': 'camera', '🔑': 'key', '🌍': 'globe', '🚚': 'truck' };
// vecchi simboli di partito (salvataggi precedenti) -> icona
[['★', 'star'], ['✦', 'sparkle'], ['⚑', 'flag'], ['❖', 'puzzle'], ['☀', 'sun'], ['✪', 'medal'], ['⬢', 'shield'], ['❂', 'target'], ['✿', 'leaf'], ['⚘', 'leaf'], ['♜', 'building'], ['⚖', 'scales'], ['🕊', 'dove'], ['🌳', 'leaf'], ['🦅', 'crown'], ['🌿', 'leaf'], ['🛡', 'shield'], ['⚙', 'gear']].forEach(([e, i]) => { if (!EMO_ICON[e]) EMO_ICON[e] = i; });
// numero con segno (+5, −3, 0), senza «−0»
function relNum(v) { const r = Math.round(v); return r > 0 ? '+' + r : r < 0 ? '−' + Math.abs(r) : '0'; }
function emoIcon(e, size) { return ICON_PATHS[e] ? icon(e, size) : EMO_ICON[e] ? icon(EMO_ICON[e], size) : esc(e || ''); }
// medaglione dorato: accetta un nome di icona, un'emoji o un ritratto già pronto (html)
function medal(x, size, color) {
  size = size || 76;
  let inner = '';
  if (typeof x === 'string' && x.trim().startsWith('<')) inner = x;
  else if (ICON_PATHS[x]) inner = icon(x);
  else if (EMO_ICON[x]) inner = icon(EMO_ICON[x]);
  else inner = esc(x || '');
  return `<span class="medallion" style="--ms:${size}px${color ? `;--mc:${color}` : ''}">${inner}</span>`;
}

// ---------- mini grafico dell'andamento ----------
function spark(vals, color, w, h) {
  vals = (vals || []).filter(v => v !== null && v !== undefined && !isNaN(v));
  w = w || 74; h = h || 26;
  if (vals.length < 2) return `<svg class="spark" width="${w}" height="${h}"><path d="M2 ${h / 2}H${w - 2}" stroke="${color}" stroke-opacity=".3" stroke-dasharray="3 3"/></svg>`;
  const mn = Math.min(...vals), mx = Math.max(...vals), rg = mx - mn || 1;
  const pts = vals.map((v, i) => [i / (vals.length - 1) * (w - 4) + 2, h - 3 - (v - mn) / rg * (h - 6)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  const last = pts[pts.length - 1];
  return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d} L${(w - 2).toFixed(1)} ${h} L2 ${h}Z" fill="${color}" opacity=".14"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="2.6" fill="${color}"/></svg>`;
}
function histOf(key, n, pid) {
  n = n || 10;
  if (key === 'poll') return G.hist.polls.slice(-n).map(x => x.p[pid || myPid()]);
  if (key === 'appr') return G.hist.econ.slice(-n).map(x => x.appr);
  if (['pil', 'deficit', 'debito', 'spread', 'dis', 'infl'].includes(key)) return G.hist.econ.slice(-n).map(x => x[key]);
  return (G.hist.me || []).slice(-n).map(x => x[key]);
}
const BAD_UP = { spread: 1, deficit: 1, dis: 1, infl: 1, debito: 1 };
// indicatore: numero grande, etichetta, freccia dell'andamento e mini grafico
function stat4(label, value, key, color) {
  const h = histOf(key, 10).filter(v => v !== null && v !== undefined);
  const d = h.length > 1 ? h[h.length - 1] - h[0] : 0;
  const up = d > 0, good = BAD_UP[key] ? !up : up;
  // verde se migliora, rosso se peggiora, neutro se fermo
  color = Math.abs(d) > 0.05 ? (good ? "#34d399" : "#ff6b6b") : "#f3e6c4";
  const num = parseFloat(String(value).replace(',', '.')), dec = key === 'poll' ? 1 : 0, suf = String(value).endsWith('%') ? '%' : '';  if (['poll', 'noto', 'appr', 'fama'].includes(key) && !isNaN(num)) value = `<span ${rollAttr('st' + key, num, dec)}>${dec ? fmt1(num) : fmt0(num)}</span>${suf}`;
  return `<div class="st4"><div class="st4-v" style="color:${color}">${value}</div><div class="st4-l">${label}${Math.abs(d) > 0.05 ? ` <span class="${good ? 'good' : 'bad'}">${up ? '▲' : '▼'}</span>` : ''}</div>${spark(h, color, 70, 24)}</div>`;
}

// ---------- l'iter delle leggi, spiegato ----------
const TYPE_INFO = {
  ddl: { n: 'Disegno di legge', i: 'doc', x: 'È una legge proposta dal governo. Passa prima da una Camera e poi dall’altra: in ciascuna una commissione la esamina e poi l’aula la vota. Entra in vigore solo dopo il sì di entrambe e la firma del Presidente della Repubblica. È la strada normale: sicura ma lenta (qualche mese).' },
  pdl: { n: 'Proposta di legge', i: 'users', x: 'È una legge proposta da un partito o da singoli parlamentari, non dal governo. Segue lo stesso percorso del disegno di legge, ma se la maggioranza non la vuole resta ferma in commissione: le proposte dell’opposizione arrivano in aula solo nella “quota opposizioni” e di solito vengono respinte. Servono a farsi notare e a mettere in difficoltà il governo.' },
  dl: { n: 'Decreto-legge', i: 'bolt', x: 'Il governo lo approva da solo ed entra in vigore subito. Ma è “a tempo”: il Parlamento deve convertirlo in legge entro 60 giorni (voto della Camera e del Senato), altrimenti decade e tutto torna come prima. Si usa per le urgenze; se il governo ne abusa, il Presidente della Repubblica protesta o rifiuta di firmarli.' },
  cost: { n: 'Riforma costituzionale', i: 'building', x: 'Cambia la Costituzione. Serve una doppia approvazione: ogni Camera la vota due volte, con almeno 3 mesi di pausa tra la prima e la seconda volta, e nella seconda serve la maggioranza assoluta (metà più uno di tutti i membri). Se non si arriva ai due terzi, gli oppositori possono chiedere un referendum confermativo: decidono i cittadini, senza quorum.' },
  manovra: { n: 'Legge di bilancio', i: 'euro', x: 'È la manovra: decide tasse e spese dell’anno successivo. Il governo la presenta a metà ottobre, va prima al Senato e poi alla Camera, quasi sempre con la fiducia. Deve essere approvata entro il 31 dicembre, altrimenti scatta l’esercizio provvisorio (e i mercati si innervosiscono). Bruxelles dà il suo parere a fine novembre.' },
};
const STEP_INFO = {
  comm: { n: 'Commissione', i: 'users', x: 'Un gruppo ristretto di parlamentari specializzati (lavoro, bilancio, giustizia…) esamina il testo, ascolta esperti e può modificarlo con emendamenti. Di solito dura qualche settimana. Se la maggioranza non vuole un testo, lo lascia fermo qui.' },
  aula: { n: 'Voto in aula', i: 'vote', x: 'Votano tutti i deputati (alla Camera, 400) o i senatori (al Senato, circa 205). Di norma passa se i sì superano i no. Il governo può porre la fiducia: i suoi alleati devono votare sì, altrimenti il governo cade. Qui conta anche il tuo voto, se sei in quella Camera.' },
  pausa: { n: 'Pausa di 3 mesi', i: 'clock', x: 'Solo per le riforme costituzionali: tra la prima e la seconda votazione di ogni Camera devono passare almeno tre mesi, per dare tempo di riflettere.' },
  firma: { n: 'Firma del Presidente', i: 'pen', x: 'Il Presidente della Repubblica promulga la legge e la fa pubblicare in Gazzetta Ufficiale: da quel momento è in vigore. Se ha dubbi di costituzionalità può rinviarla alle Camere una volta sola; se il Parlamento la riapprova, deve firmarla.' },
};
function billKind(b) { return b.type === 'ddl' && b.proposer !== 'GOV' ? 'pdl' : b.type; }
function stepShort(s) { const H = s.h === 'C' ? 'Camera' : 'Senato'; if (s.k === 'comm') return `Comm. ${H}`; if (s.k === 'aula') return `Voto ${H}${s.r ? ' ' + s.r + 'ª' : ''}`; if (s.k === 'pausa') return '3 mesi'; return 'Firma'; }
function iterHTML(b) {
  return `<div class="iter">${b.stages.map((s, i) => `<button class="it ${i < b.stage ? 'done' : i === b.stage ? 'now' : ''} ${s.h === 'C' ? 'hc' : s.h === 'S' ? 'hs' : ''}" onclick="event.stopPropagation();openStepInfo(${b.id},${i})"><span class="dot">${i < b.stage ? icon('check', 14) : icon(STEP_INFO[s.k].i, 14)}</span><span class="lb">${stepShort(s)}</span></button>`).join('<span class="ln"></span>')}</div>`;
}
function kindTag(b) { const k = billKind(b); return `<button class="tag kind" onclick="event.stopPropagation();openTypeInfo('${k}')">${icon(TYPE_INFO[k].i, 14)} ${TYPE_INFO[k].n} <span class="q">?</span></button>`; }
function openTypeInfo(k) {
  const t = TYPE_INFO[k];
  openSheet(`${head(t.n)}<div class="center">${medal(t.i, 70)}</div><p style="line-height:1.55">${t.x}</p><button class="btn block mt" onclick="closeSheet();openGlossary()">${icon('book')} Tutti i tipi di legge e il percorso</button>`);
}
function openStepInfo(id, i) {
  const b = G.bills.find(x => x.id === id); const s = b.stages[i], t = STEP_INFO[s.k];
  const where = s.h ? (s.h === 'C' ? 'alla Camera' : 'al Senato') : '';
  const status = i < b.stage ? 'Passaggio già superato' : i === b.stage ? `Il testo è qui adesso${s.k === 'comm' && b.wait > 0 ? ` · circa ${b.wait} settimane` : s.k === 'aula' ? ' · si vota a breve' : ''}` : 'Passaggio successivo';
  openSheet(`${head(`${t.n} ${where}`)}<div class="center">${medal(t.i, 70)}</div><div class="center mt"><span class="tag o">${status}</span></div><p style="line-height:1.55">${t.x}</p><div class="mt">${iterHTML(b)}</div>`);
}
function openGlossary() {
  const steps = ['comm', 'aula', 'pausa', 'firma'];
  openSheet(`${head('Come funziona il Parlamento')}
    <p class="small muted">In Italia una legge deve essere approvata nello stesso testo da <b>Camera</b> (400 deputati) e <b>Senato</b> (200 senatori più quelli a vita). Poi la firma il Presidente della Repubblica.</p>
    <div class="sec"><h4>I tipi di legge</h4></div>
    ${Object.keys(TYPE_INFO).map(k => `<div class="card tight"><div class="row">${medal(TYPE_INFO[k].i, 40)}<h3>${TYPE_INFO[k].n}</h3></div><div class="small mt" style="line-height:1.5">${TYPE_INFO[k].x}</div></div>`).join('')}
    <div class="sec"><h4>Le tappe</h4></div>
    ${steps.map(k => `<div class="card tight"><div class="row">${medal(STEP_INFO[k].i, 40)}<h3>${STEP_INFO[k].n}</h3></div><div class="small mt" style="line-height:1.5">${STEP_INFO[k].x}</div></div>`).join('')}
    <div class="sec"><h4>Parole utili</h4></div>
    <div class="card tight small" style="line-height:1.55"><b>Fiducia:</b> il governo lega la sua sopravvivenza a un voto: gli alleati devono votare sì, altrimenti il governo cade.<br><b>Navetta:</b> se una Camera modifica il testo, torna all’altra.<br><b>Ostruzionismo:</b> l’opposizione rallenta presentando migliaia di emendamenti.<br><b>Referendum abrogativo:</b> 500.000 firme per cancellare una legge; vale solo se vota più della metà degli elettori.<br><b>Consulta:</b> la Corte costituzionale può annullare una legge contraria alla Costituzione.</div>`);
}
// fiducia: cosa cambia, con i numeri
function fiduciaCompareHTML(b, chosen) {
  const s = b.stages[b.stage]; if (!s || !s.h) return '';
  const no = computeVote(b, s.h, { det: true }), si = computeVote(b, s.h, { fiducia: true, det: true });
  // franchi tiratori attesi tra i partiti di governo
  let risk = 0, oppYes = 0;
  PIDS().forEach(pid => { const n = seatsOf(pid, s.h); if (!n) return; const st = stance(pid, b, s.h); if (inGov(pid) && st.s > 0.15) risk += n * clamp((0.01 + Math.max(0, -st.gain) * 0.09) * D().defect, 0, 0.4); if (!inGov(pid) && no.by[pid] && no.by[pid].vote === 'yes') oppYes += n; });
  risk = Math.round(risk); const riskF = Math.round(risk * 0.3);
  return `<div class="fidcmp">
    <div class="${!chosen ? 'on' : ''}"><b>Senza fiducia</b><div class="res ${no.passed ? 'good' : 'bad'}">${no.passed ? 'Passa' : 'Bocciata'}</div>Sì ${no.yes} · No ${no.no}<br>Si vota sulla legge: ${oppYes ? `anche ${oppYes} voti d’opposizione possono dire sì` : 'ognuno vota secondo le sue idee'}. Rischio franchi tiratori: circa <b style="display:inline;color:var(--warn)">${risk}</b>. Gratis.</div>
    <div class="${chosen ? 'on' : ''}"><b>Con la fiducia · ⚡3</b><div class="res ${si.passed ? 'good' : 'bad'}">${si.passed ? 'Passa' : 'Bocciata'}</div>Sì ${si.yes} · No ${si.no}<br>Si vota sul governo: l’opposizione vota no anche se la legge le piace${oppYes ? ` (per questo i sì possono calare)` : ''}, ma gli alleati non possono tradire: franchi tiratori circa <b style="display:inline;color:var(--good)">${riskF}</b>. Se la perdi, il governo cade.</div></div>
    <div class="tiny muted mt">Conviene porre la fiducia quando la tua maggioranza ha i numeri ma teme i franchi tiratori, non quando ti servono i voti dell’opposizione.</div>`;
}

// ---------- ⚡ (capitale politico) come icona a linea, ovunque compaia nel testo ----------
const PC_RE = /⚡️?/;
function boltify(root) {
  if (!root || !root.ownerDocument && root !== document) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => PC_RE.test(n.nodeValue) && !/^(SCRIPT|STYLE|TEXTAREA|OPTION|TITLE)$/.test(n.parentNode && n.parentNode.nodeName) ? 1 : 3 });
  const list = []; while (w.nextNode()) list.push(w.currentNode);
  list.forEach(n => {
    const f = document.createDocumentFragment();
    n.nodeValue.split(/⚡️?/).forEach((p, i) => { if (i) { const b = document.createElement('i'); b.className = 'pcu'; f.appendChild(b); } if (p) f.appendChild(document.createTextNode(p)); });
    n.parentNode.replaceChild(f, n);
  });
}
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) boltify(n); else if (n.nodeType === 3 && n.parentNode && PC_RE.test(n.nodeValue)) boltify(n.parentNode); }))).observe(document.documentElement, { childList: true, subtree: true });

// ---------- logo: la facciata di Palazzo Chigi, senza scritte ----------
ICON_PATHS.chigi = '<path d="M1.5 20.5h21"/><path d="M2.3 8.6h19.4"/><path d="M3 9.9h18"/><path d="M3.4 9.9v10.6M20.6 9.9v10.6"/><path d="M12 8.6V3.6"/><path d="M12 3.8h3.4v2.3H12"/><rect x="5" y="11.1" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="7.5" y="11.1" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="10" y="11.1" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="12.9" y="11.1" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="15.4" y="11.1" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="17.9" y="11.1" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="5" y="13.9" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="7.5" y="13.9" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="10" y="13.9" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="12.9" y="13.9" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="15.4" y="13.9" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="17.9" y="13.9" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="5" y="16.8" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="7.5" y="16.8" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="15.4" y="16.8" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><rect x="17.9" y="16.8" width="1.15" height="1.8" rx=".2" fill="currentColor" stroke="none"/><path d="M10.2 16.3h3.6"/><path d="M10.75 20.5v-2.4a1.25 1.25 0 0 1 2.5 0v2.4"/>';
function logoChigi(size) { return `<span class="logo-chigi" style="--ls:${size}px">${icon('chigi')}</span>`; }
ICON_PATHS.arrowr = '<path d="M5 12h14M13 6l6 6-6 6"/>';
// colore della linguetta di ogni categoria di leggi (fascicoli)
const CAT_COLOR = { Pensioni: '#fb923c', Lavoro: '#38bdf8', Fisco: '#22c55e', Welfare: '#f472b6', Famiglia: '#f9a8d4', Sanità: '#ef4444', Diritti: '#a78bfa', Immigrazione: '#0ea5e9', Giustizia: '#94a3b8', Sicurezza: '#64748b', Istituzioni: '#d6b25e', Scuola: '#facc15', Università: '#eab308', Ambiente: '#16a34a', Energia: '#f59e0b', Infrastrutture: '#a8a29e', Economia: '#10b981', Difesa: '#6b7280', Europa: '#3b82f6', Territorio: '#84cc16', Agricoltura: '#a3e635', Cultura: '#c084fc' };

// ---------- M3: numeri che scorrono quando cambiano ----------
const rollAttr = (key, val, dec) => `data-roll="${key}" data-v="${val}" data-d="${dec || 0}"`;
function rollNumbers() {
  UI.prevNums = UI.prevNums || {};
  document.querySelectorAll('[data-roll]').forEach(el => {
    const k = el.dataset.roll, v = +el.dataset.v, d = +el.dataset.d, prev = UI.prevNums[k];
    UI.prevNums[k] = v;
    if (prev === undefined || isNaN(v) || Math.abs(prev - v) < (d ? 0.05 : 0.5)) return;
    const t0 = performance.now(), ms = 900, f = x => d ? fmt1(x) : fmt0(x);
    el.classList.add('rolling');
    (function step(t) { const k2 = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k2, 3); el.textContent = f(prev + (v - prev) * e); if (k2 < 1) requestAnimationFrame(step); else el.classList.remove('rolling'); })(t0);
  });
}
