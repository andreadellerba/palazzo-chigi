// ============================================================
//  DATI DI BASE — situazione politica italiana al 24 ottobre 2026
//  Fonti: Supermedia YouTrend-Agi, SWG, BiDiMedia, Termometro Politico (ottobre 2026),
//  camera.it (composizione gruppi), governo.it (Governo Meloni), Il Post (legge elettorale 2026)
// ============================================================

const START_DATE = new Date(2026, 9, 24); // sabato 24 ottobre 2026

// Assi ideologici: -10 = sinistra del cursore, +10 = destra del cursore
const AXES = {
  eco:  { n: 'Economia',     l: 'Stato sociale',  r: 'Mercato' },
  soc:  { n: 'Valori',       l: 'Progressista',   r: 'Conservatore' },
  eu:   { n: 'Europa',       l: 'Europeista',     r: 'Sovranista' },
  imm:  { n: 'Immigrazione', l: 'Accoglienza',    r: 'Chiusura' },
  amb:  { n: 'Ambiente',     l: 'Ecologista',     r: 'Sviluppista' },
  giu:  { n: 'Giustizia',    l: 'Giustizialista', r: 'Garantista' },
  terr: { n: 'Territorio',   l: 'Centralista/Sud', r: 'Autonomie/Nord' },
  ist:  { n: 'Istituzioni',  l: 'Parlamentare',   r: 'Presidenzialista' },
};
const AXIS_KEYS = Object.keys(AXES);

// Aree geografiche per i moltiplicatori di voto
const AREAS = { NO: 'Nord-Ovest', NE: 'Nord-Est', CEN: 'Centro', SUD: 'Sud', ISO: 'Isole' };

// ------------------------------------------------------------
// PARTITI (sondaggi: media ottobre 2026; seggi: Camera da camera.it, Senato stimato)
// ------------------------------------------------------------
const PARTIES_DEF = [
  { id: 'FDI', name: "Fratelli d'Italia", short: 'FdI', color: '#1f4fa8', leader: 'Giorgia Meloni', lCar: 9, lComp: 7,
    area: 'Destra', family: 'ECR', poll: 27.6, seatsC: 117, seatsS: 63, coal: 'cdx',
    ax: { eco: 2, soc: 7, eu: 4, imm: 8, amb: 4, giu: 3, terr: -1, ist: 9 },
    geo: { NO: 1.0, NE: 0.95, CEN: 1.1, SUD: 0.95, ISO: 0.95 }, rx: { LAZ: 1.18, ABR: 1.15, MAR: 1.12, TAA: 0.6, VDA: 0.7 } },
  { id: 'PD', name: 'Partito Democratico', short: 'PD', color: '#e2001a', leader: 'Elly Schlein', lCar: 6, lComp: 6,
    area: 'Centrosinistra', family: 'S&D', poll: 20.6, seatsC: 68, seatsS: 37, coal: 'csx', primarie: true,
    ax: { eco: -5, soc: -6, eu: -8, imm: -6, amb: -5, giu: -1, terr: -3, ist: -6 },
    geo: { NO: 0.95, NE: 1.1, CEN: 1.15, SUD: 0.85, ISO: 0.85 }, rx: { EMR: 1.35, TOS: 1.35, UMB: 1.1, PUG: 1.1, TAA: 0.7 } },
  { id: 'M5S', name: 'Movimento 5 Stelle', short: 'M5S', color: '#f4c20d', leader: 'Giuseppe Conte', lCar: 7, lComp: 6,
    area: 'Populista progressista', family: 'The Left', poll: 12.4, seatsC: 48, seatsS: 27, coal: 'csx',
    ax: { eco: -6, soc: -3, eu: -1, imm: 0, amb: -5, giu: -8, terr: -6, ist: -4 },
    geo: { NO: 0.6, NE: 0.55, CEN: 0.9, SUD: 1.6, ISO: 1.6 }, rx: { CAM: 1.9, TAA: 0.4 } },
  { id: 'FN', name: 'Futuro Nazionale', short: 'FN', color: '#5b3a1e', leader: 'Roberto Vannacci', lCar: 7, lComp: 4,
    area: 'Destra radicale', family: 'NI', poll: 7.3, seatsC: 9, seatsS: 1, coal: null,
    ax: { eco: 2, soc: 10, eu: 9, imm: 10, amb: 7, giu: -2, terr: 0, ist: 8 },
    geo: { NO: 1.05, NE: 1.0, CEN: 1.15, SUD: 0.9, ISO: 0.85 }, rx: { TOS: 1.25, LIG: 1.2 } },
  { id: 'FI', name: 'Forza Italia', short: 'FI', color: '#2a9df4', leader: 'Antonio Tajani', lCar: 5, lComp: 7,
    area: 'Centrodestra', family: 'PPE', poll: 7.1, seatsC: 52, seatsS: 21, coal: 'cdx',
    ax: { eco: 6, soc: 3, eu: -6, imm: 5, amb: 3, giu: 9, terr: 1, ist: 4 },
    geo: { NO: 0.95, NE: 0.8, CEN: 0.8, SUD: 1.25, ISO: 1.35 }, rx: { CAL: 1.6, SIC: 1.4, MOL: 1.4, BAS: 1.4 } },
  { id: 'AVS', name: 'Alleanza Verdi e Sinistra', short: 'AVS', color: '#6aa84f', leader: 'Nicola Fratoianni e Angelo Bonelli', lCar: 5, lComp: 5,
    area: 'Sinistra', family: 'Verdi/Sinistra', poll: 6.4, seatsC: 10, seatsS: 4, coal: 'csx',
    ax: { eco: -9, soc: -9, eu: -5, imm: -9, amb: -10, giu: -3, terr: -3, ist: -8 },
    geo: { NO: 1.05, NE: 1.1, CEN: 1.05, SUD: 0.85, ISO: 0.95 }, rx: { TAA: 1.4 } },
  { id: 'LEGA', name: 'Lega', short: 'Lega', color: '#0b7a3e', leader: 'Matteo Salvini', lCar: 6, lComp: 5,
    area: 'Destra', family: 'Patrioti', poll: 5.4, seatsC: 55, seatsS: 25, coal: 'cdx',
    ax: { eco: 3, soc: 7, eu: 7, imm: 10, amb: 6, giu: 4, terr: 8, ist: 6 },
    geo: { NO: 1.5, NE: 1.7, CEN: 0.7, SUD: 0.5, ISO: 0.6 }, rx: { VEN: 2.0, LOM: 1.5, FVG: 1.7, TAA: 1.3 } },
  { id: 'AZ', name: 'Azione', short: 'Azione', color: '#1aa3c9', leader: 'Carlo Calenda', lCar: 5, lComp: 7,
    area: 'Centro liberale', family: 'Renew', poll: 3.0, seatsC: 10, seatsS: 3, coal: null,
    ax: { eco: 5, soc: -2, eu: -9, imm: 1, amb: 4, giu: 6, terr: 0, ist: -1 },
    geo: { NO: 1.2, NE: 1.0, CEN: 1.0, SUD: 0.85, ISO: 0.85 }, rx: { LAZ: 1.3 } },
  { id: 'IV', name: 'Italia Viva - Casa Riformista', short: 'IV', color: '#d6157f', leader: 'Matteo Renzi', lCar: 7, lComp: 7,
    area: 'Centro riformista', family: 'Renew', poll: 2.1, seatsC: 7, seatsS: 6, coal: 'csx',
    ax: { eco: 4, soc: -4, eu: -9, imm: -1, amb: 0, giu: 7, terr: -1, ist: 3 },
    geo: { NO: 0.9, NE: 0.8, CEN: 1.3, SUD: 1.0, ISO: 0.9 }, rx: { TOS: 1.6 } },
  { id: 'PE', name: '+Europa', short: '+Eu', color: '#8e3fb8', leader: 'Riccardo Magi', lCar: 5, lComp: 6,
    area: 'Liberale progressista', family: 'Renew', poll: 1.3, seatsC: 3, seatsS: 0, coal: 'csx',
    ax: { eco: 3, soc: -9, eu: -10, imm: -6, amb: -3, giu: 6, terr: 0, ist: -2 },
    geo: { NO: 1.2, NE: 1.0, CEN: 1.0, SUD: 0.8, ISO: 0.8 }, rx: {} },
  { id: 'SCN', name: 'Sud chiama Nord', short: 'ScN', color: '#ef7d22', leader: 'Cateno De Luca', lCar: 6, lComp: 5,
    area: 'Autonomista meridionale', family: 'NI', poll: 1.2, seatsC: 3, seatsS: 0, coal: null,
    ax: { eco: -3, soc: 1, eu: -2, imm: 2, amb: 0, giu: 0, terr: -9, ist: 0 },
    geo: { NO: 0.1, NE: 0.1, CEN: 0.25, SUD: 1.5, ISO: 3.8 }, rx: { SIC: 6.5 } },
  { id: 'NM', name: 'Noi Moderati', short: 'NM', color: '#5dc1e8', leader: 'Maurizio Lupi', lCar: 4, lComp: 6,
    area: 'Centro moderato', family: 'PPE', poll: 1.0, seatsC: 8, seatsS: 8, coal: 'cdx',
    ax: { eco: 4, soc: 5, eu: -5, imm: 5, amb: 2, giu: 7, terr: 0, ist: 4 },
    geo: { NO: 1.0, NE: 0.8, CEN: 0.9, SUD: 1.1, ISO: 1.2 }, rx: {} },
];
// Seggi "Altri": minoranze linguistiche, non iscritti, Autonomie, senatori a vita
const OTHER_SEATS = { C: 10, S: 10 };
const OTHER_POLL = 3.6; // altre liste minori

// Alleanze impossibili (non si alleano MAI alle elezioni). Post-voto alcune diventano "solo governo tecnico".
const NEVER = [
  ['AVS', 'FDI'], ['AVS', 'LEGA'], ['AVS', 'FI'], ['AVS', 'NM'], ['AVS', 'FN'], ['AVS', 'AZ'],
  ['PD', 'FDI'], ['PD', 'LEGA'], ['PD', 'FN'],
  ['M5S', 'FDI'], ['M5S', 'FN'], ['M5S', 'AZ'], ['M5S', 'FI'], ['M5S', 'NM'],
  ['PE', 'FN'], ['PE', 'LEGA'], ['PE', 'FDI'],
  ['FN', 'IV'], ['FN', 'AZ'], ['FN', 'SCN'],
];
// Rapporti di partenza tra partiti (oltre all'affinità ideologica)
const REL_TWEAK = {
  'FDI-LEGA': 20, 'FDI-FI': 25, 'FDI-NM': 25, 'LEGA-FI': 5, 'FDI-FN': -10, 'LEGA-FN': -35, 'FI-FN': -40,
  'PD-M5S': 25, 'PD-AVS': 30, 'M5S-AVS': 25, 'PD-IV': 5, 'M5S-IV': -25, 'PD-PE': 20, 'PD-AZ': -5, 'AZ-IV': -15,
  'LEGA-M5S': -10, 'FI-AZ': 10, 'FI-IV': 5, 'AZ-FDI': -10,
};

// Coalizioni di partenza
const COALITIONS_DEF = [
  { id: 'cdx', name: 'Centrodestra', color: '#1f4fa8' },
  { id: 'csx', name: 'Campo largo', color: '#e2001a' },
];

// ------------------------------------------------------------
// REGIONI (elettori in milioni, presidenti in carica, prossime regionali)
// ------------------------------------------------------------
const REGIONS_DEF = [
  { id: 'PIE', n: 'Piemonte',              area: 'NO',  el: 3.4,  gov: 'Alberto Cirio',        gp: 'FI',   next: '2029-06-09', lab: [38, 88] },
  { id: 'VDA', n: "Valle d'Aosta",          area: 'NO',  el: 0.1,  gov: 'Renzo Testolin',       gp: 'AUT',  next: '2030-09-27', lab: [20, 58] },
  { id: 'LIG', n: 'Liguria',               area: 'NO',  el: 1.3,  gov: 'Marco Bucci',          gp: 'CIVD', next: '2029-10-28', lab: [52, 118] },
  { id: 'LOM', n: 'Lombardia',             area: 'NO',  el: 7.8,  gov: 'Attilio Fontana',      gp: 'LEGA', next: '2028-02-13', lab: [92, 64] },
  { id: 'TAA', n: 'Trentino-Alto Adige',   area: 'NE',  el: 0.8,  gov: 'Arno Kompatscher',     gp: 'AUT',  next: '2028-10-22', lab: [138, 32] },
  { id: 'VEN', n: 'Veneto',                area: 'NE',  el: 4.0,  gov: 'Alberto Stefani',      gp: 'LEGA', next: '2030-11-24', lab: [152, 60] },
  { id: 'FVG', n: 'Friuli Venezia Giulia', area: 'NE',  el: 1.0,  gov: 'Massimiliano Fedriga', gp: 'LEGA', next: '2028-04-02', lab: [192, 44] },
  { id: 'EMR', n: 'Emilia-Romagna',        area: 'NE',  el: 3.5,  gov: 'Michele de Pascale',   gp: 'PD',   next: '2029-11-18', lab: [128, 100] },
  { id: 'TOS', n: 'Toscana',               area: 'CEN', el: 3.0,  gov: 'Eugenio Giani',        gp: 'PD',   next: '2030-10-13', lab: [128, 145] },
  { id: 'UMB', n: 'Umbria',                area: 'CEN', el: 0.7,  gov: 'Stefania Proietti',    gp: 'CIVS', next: '2029-11-18', lab: [170, 162] },
  { id: 'MAR', n: 'Marche',                area: 'CEN', el: 1.2,  gov: 'Francesco Acquaroli',  gp: 'FDI',  next: '2030-09-29', lab: [190, 145] },
  { id: 'LAZ', n: 'Lazio',                 area: 'CEN', el: 4.6,  gov: 'Francesco Rocca',      gp: 'FDI',  next: '2028-02-13', lab: [180, 200] },
  { id: 'ABR', n: 'Abruzzo',               area: 'SUD', el: 1.1,  gov: 'Marco Marsilio',       gp: 'FDI',  next: '2029-03-11', lab: [215, 192] },
  { id: 'MOL', n: 'Molise',                area: 'SUD', el: 0.3,  gov: 'Francesco Roberti',    gp: 'FI',   next: '2028-06-26', lab: [236, 216] },
  { id: 'CAM', n: 'Campania',              area: 'SUD', el: 4.6,  gov: 'Roberto Fico',         gp: 'M5S',  next: '2030-11-24', lab: [243, 248] },
  { id: 'PUG', n: 'Puglia',                area: 'SUD', el: 3.2,  gov: 'Antonio Decaro',       gp: 'PD',   next: '2030-11-24', lab: [300, 240] },
  { id: 'BAS', n: 'Basilicata',            area: 'SUD', el: 0.45, gov: 'Vito Bardi',           gp: 'FI',   next: '2029-04-22', lab: [278, 266] },
  { id: 'CAL', n: 'Calabria',              area: 'SUD', el: 1.5,  gov: 'Roberto Occhiuto',     gp: 'FI',   next: '2030-10-06', lab: [292, 316] },
  { id: 'SIC', n: 'Sicilia',               area: 'ISO', el: 4.0,  gov: 'Renato Schifani',      gp: 'FI',   next: '2027-10-24', lab: [222, 378] },
  { id: 'SAR', n: 'Sardegna',              area: 'ISO', el: 1.3,  gov: 'Alessandra Todde',     gp: 'M5S',  next: '2029-02-25', lab: [70, 278] },
];
const GOV_PARTY_COAL = { FI: 'cdx', LEGA: 'cdx', FDI: 'cdx', NM: 'cdx', CIVD: 'cdx', AUT: 'aut', PD: 'csx', M5S: 'csx', CIVS: 'csx' };

// ------------------------------------------------------------
// MINISTERI (struttura attuale del Governo Meloni)
// ------------------------------------------------------------
const MINISTRIES = [
  { id: 'MEF',    n: 'Economia e Finanze',                      w: 5, key: 1, cats: ['Fisco', 'Economia'] },
  { id: 'EST',    n: 'Esteri e Cooperazione internazionale',    w: 5, key: 1, cats: ['Europa'] },
  { id: 'INT',    n: 'Interno',                                  w: 5, key: 1, cats: ['Immigrazione', 'Sicurezza'] },
  { id: 'GIU',    n: 'Giustizia',                                w: 4, key: 1, cats: ['Giustizia'] },
  { id: 'DIF',    n: 'Difesa',                                   w: 4, key: 1, cats: ['Difesa'] },
  { id: 'MIT',    n: 'Infrastrutture e Trasporti',               w: 4, cats: ['Infrastrutture'] },
  { id: 'MIMIT',  n: 'Imprese e Made in Italy',                  w: 3, cats: ['Economia'] },
  { id: 'LAV',    n: 'Lavoro e Politiche sociali',               w: 3, cats: ['Lavoro', 'Pensioni', 'Welfare'] },
  { id: 'MASE',   n: 'Ambiente e Sicurezza energetica',          w: 3, cats: ['Ambiente', 'Energia'] },
  { id: 'SAL',    n: 'Salute',                                   w: 3, cats: ['Sanità'] },
  { id: 'MIM',    n: 'Istruzione e Merito',                      w: 3, cats: ['Scuola'] },
  { id: 'MUR',    n: 'Università e Ricerca',                     w: 2, cats: ['Università'] },
  { id: 'MASAF',  n: 'Agricoltura e Sovranità alimentare',       w: 2, cats: ['Agricoltura'] },
  { id: 'CUL',    n: 'Cultura',                                  w: 2, cats: ['Cultura'] },
  { id: 'TUR',    n: 'Turismo',                                  w: 1, cats: [] },
  { id: 'SOTT',   n: 'Sottosegretario alla Presidenza',          w: 3, port: 0, cats: [] },
  { id: 'UE',     n: 'Affari europei, PNRR e Coesione',          w: 3, port: 0, cats: ['Europa'] },
  { id: 'RAPP',   n: 'Rapporti con il Parlamento',               w: 2, port: 0, cats: [] },
  { id: 'AFFREG', n: 'Affari regionali e Autonomie',             w: 2, port: 0, cats: ['Territorio'] },
  { id: 'RIF',    n: 'Riforme istituzionali',                    w: 2, port: 0, cats: ['Istituzioni'] },
  { id: 'PA',     n: 'Pubblica Amministrazione',                 w: 1, port: 0, cats: [] },
  { id: 'FAM',    n: 'Famiglia, Natalità e Pari opportunità',    w: 1, port: 0, cats: ['Diritti', 'Famiglia'] },
  { id: 'PROT',   n: 'Protezione civile e Politiche del mare',   w: 1, port: 0, cats: [] },
  { id: 'SPORT',  n: 'Sport e Giovani',                          w: 1, port: 0, cats: [] },
  { id: 'DIS',    n: 'Disabilità',                               w: 1, port: 0, cats: [] },
];

// ------------------------------------------------------------
// PERSONE: [nome, partito, competenza 1-10, rischio scandalo 0-10, ministeri preferiti]
// IND = indipendente/tecnico d'area, TEC = tecnico puro
// ------------------------------------------------------------
const PEOPLE_RAW = [
  // Fratelli d'Italia
  ['Giorgia Meloni', 'FDI', 8, 2, 'SOTT'], ['Guido Crosetto', 'FDI', 8, 3, 'DIF'], ['Francesco Lollobrigida', 'FDI', 5, 4, 'MASAF'],
  ['Adolfo Urso', 'FDI', 5, 2, 'MIMIT'], ['Giovanbattista Fazzolari', 'FDI', 6, 2, 'SOTT'], ['Tommaso Foti', 'FDI', 6, 2, 'UE'],
  ['Luca Ciriani', 'FDI', 6, 1, 'RAPP'], ['Nello Musumeci', 'FDI', 6, 2, 'PROT'], ['Eugenia Roccella', 'FDI', 6, 1, 'FAM'],
  ['Alessandro Giuli', 'FDI', 6, 2, 'CUL'], ['Giovanni Donzelli', 'FDI', 5, 4, 'INT'], ['Galeazzo Bignami', 'FDI', 6, 3, 'MIT'],
  ['Fabio Rampelli', 'FDI', 5, 2, 'CUL'], ['Lucio Malan', 'FDI', 5, 1, 'RAPP'], ['Arianna Meloni', 'FDI', 5, 2, 'FAM'],
  ['Marcello Gemmato', 'FDI', 5, 3, 'SAL'], ['Isabella Rauti', 'FDI', 5, 1, 'DIF'], ['Edmondo Cirielli', 'FDI', 5, 2, 'EST'],
  ['Marco Osnato', 'FDI', 6, 2, 'MEF'], ['Maurizio Leo', 'FDI', 7, 1, 'MEF'], ['Alfredo Mantovano', 'FDI', 7, 1, 'SOTT'],
  ['Gianmarco Mazzi', 'FDI', 5, 2, 'TUR'], ['Daniela Santanchè', 'FDI', 4, 9, 'TUR'], ['Andrea Delmastro', 'FDI', 4, 8, 'GIU'],
  ['Nicola Procaccini', 'FDI', 6, 2, 'MASE'], ['Carlo Nordio', 'IND', 6, 2, 'GIU'], ['Augusta Montaruli', 'FDI', 4, 6, 'MUR'],
  // Lega
  ['Matteo Salvini', 'LEGA', 5, 4, 'MIT'], ['Giancarlo Giorgetti', 'LEGA', 8, 1, 'MEF'], ['Roberto Calderoli', 'LEGA', 7, 2, 'AFFREG'],
  ['Luca Zaia', 'LEGA', 8, 1, 'AFFREG'], ['Massimiliano Fedriga', 'LEGA', 8, 1, 'AFFREG'], ['Alessandra Locatelli', 'LEGA', 6, 1, 'DIS'],
  ['Edoardo Rixi', 'LEGA', 7, 2, 'MIT'], ['Nicola Molteni', 'LEGA', 6, 2, 'INT'], ['Claudio Durigon', 'LEGA', 5, 4, 'LAV'],
  ['Riccardo Molinari', 'LEGA', 6, 2, 'RAPP'], ['Massimiliano Romeo', 'LEGA', 6, 1, 'PA'], ['Gian Marco Centinaio', 'LEGA', 6, 2, 'MASAF'],
  ['Alberto Bagnai', 'LEGA', 6, 1, 'MEF'], ['Claudio Borghi', 'LEGA', 5, 3, 'MEF'], ['Andrea Ostellari', 'LEGA', 5, 2, 'GIU'],
  ['Vannia Gava', 'LEGA', 6, 2, 'MASE'], ['Giuseppe Valditara', 'LEGA', 6, 2, 'MIM'], ['Andrea Crippa', 'LEGA', 4, 3, 'SPORT'],
  // Forza Italia
  ['Antonio Tajani', 'FI', 7, 1, 'EST'], ['Anna Maria Bernini', 'FI', 6, 1, 'MUR'], ['Paolo Zangrillo', 'FI', 6, 1, 'PA'],
  ['Maurizio Gasparri', 'FI', 5, 3, 'RAPP'], ['Licia Ronzulli', 'FI', 5, 3, 'FAM'], ['Francesco Paolo Sisto', 'FI', 7, 2, 'GIU'],
  ['Giorgio Mulè', 'FI', 6, 2, 'DIF'], ['Alessandro Cattaneo', 'FI', 6, 1, 'MIMIT'], ['Roberto Occhiuto', 'FI', 7, 3, 'AFFREG'],
  ['Stefania Craxi', 'FI', 6, 2, 'EST'], ['Gilberto Pichetto Fratin', 'FI', 5, 1, 'MASE'], ['Maria Elisabetta Alberti Casellati', 'FI', 6, 2, 'RIF'],
  ['Letizia Moratti', 'FI', 7, 2, 'SAL'], ['Deborah Bergamini', 'FI', 6, 1, 'CUL'], ['Valentino Valentini', 'FI', 6, 2, 'MIMIT'],
  ['Paolo Barelli', 'FI', 5, 3, 'SPORT'],
  // Noi Moderati
  ['Maurizio Lupi', 'NM', 6, 2, 'MIT'], ['Mariastella Gelmini', 'NM', 7, 1, 'PA'], ['Mara Carfagna', 'NM', 7, 1, 'FAM'],
  ['Alessandro Colucci', 'NM', 5, 1, 'SPORT'],
  // Futuro Nazionale
  ['Roberto Vannacci', 'FN', 6, 5, 'DIF'], ['Rossano Sasso', 'FN', 4, 3, 'MIM'], ['Edoardo Ziello', 'FN', 4, 3, 'INT'],
  ['Domenico Furgiuele', 'FN', 4, 4, 'MIT'], ['Antonio Maria Rinaldi', 'FN', 5, 2, 'UE'], ['Laura Ravetto', 'FN', 5, 2, 'RAPP'],
  ['Emanuele Pozzolo', 'FN', 3, 9, 'SPORT'],
  // PD
  ['Elly Schlein', 'PD', 6, 1, 'LAV'], ['Stefano Bonaccini', 'PD', 8, 2, 'AFFREG'], ['Francesco Boccia', 'PD', 6, 2, 'AFFREG'],
  ['Andrea Orlando', 'PD', 7, 1, 'LAV'], ['Peppe Provenzano', 'PD', 6, 1, 'EST'], ['Roberto Gualtieri', 'PD', 8, 1, 'MEF'],
  ['Antonio Decaro', 'PD', 7, 2, 'MIT'], ['Dario Franceschini', 'PD', 7, 2, 'CUL'], ['Graziano Delrio', 'PD', 7, 1, 'MIT'],
  ['Antonio Misiani', 'PD', 7, 1, 'MEF'], ['Chiara Braga', 'PD', 6, 1, 'MASE'], ['Gianni Cuperlo', 'PD', 6, 1, 'RIF'],
  ['Paolo Gentiloni', 'PD', 9, 1, 'EST'], ['Lorenzo Guerini', 'PD', 8, 1, 'DIF'], ['Debora Serracchiani', 'PD', 6, 1, 'GIU'],
  ['Pina Picierno', 'PD', 6, 1, 'UE'], ['Giorgio Gori', 'PD', 7, 1, 'MIMIT'], ['Beppe Sala', 'PD', 7, 3, 'MIT'],
  ['Nicola Zingaretti', 'PD', 7, 2, 'SAL'], ['Marco Furfaro', 'PD', 5, 1, 'FAM'], ['Arturo Scotto', 'PD', 5, 1, 'LAV'],
  // M5S
  ['Giuseppe Conte', 'M5S', 7, 2, 'GIU'], ['Stefano Patuanelli', 'M5S', 7, 1, 'MIMIT'], ['Chiara Appendino', 'M5S', 6, 3, 'MIT'],
  ['Alessandra Todde', 'M5S', 7, 2, 'MIMIT'], ['Roberto Fico', 'M5S', 6, 1, 'RAPP'], ['Paola Taverna', 'M5S', 5, 2, 'SAL'],
  ['Mariolina Castellone', 'M5S', 6, 1, 'SAL'], ['Riccardo Ricciardi', 'M5S', 4, 2, 'CUL'], ['Ettore Licheri', 'M5S', 5, 1, 'RAPP'],
  ['Pasquale Tridico', 'M5S', 7, 1, 'LAV'], ['Barbara Floridia', 'M5S', 5, 1, 'MIM'], ['Alfonso Colucci', 'M5S', 5, 1, 'GIU'],
  // AVS
  ['Nicola Fratoianni', 'AVS', 6, 2, 'LAV'], ['Angelo Bonelli', 'AVS', 6, 2, 'MASE'], ['Ilaria Salis', 'AVS', 3, 6, 'FAM'],
  ['Marco Grimaldi', 'AVS', 5, 1, 'MIT'], ['Ilaria Cucchi', 'AVS', 5, 1, 'GIU'], ['Elisabetta Piccolotti', 'AVS', 5, 1, 'MIM'],
  ['Peppe De Cristofaro', 'AVS', 5, 1, 'RAPP'], ['Mimmo Lucano', 'AVS', 4, 6, 'AFFREG'],
  // Azione
  ['Carlo Calenda', 'AZ', 7, 1, 'MIMIT'], ['Matteo Richetti', 'AZ', 6, 1, 'RAPP'], ['Ettore Rosato', 'AZ', 6, 1, 'DIF'],
  ['Giulia Pastorella', 'AZ', 6, 1, 'PA'], ['Elena Bonetti', 'AZ', 6, 1, 'FAM'],
  // Italia Viva
  ['Matteo Renzi', 'IV', 8, 5, 'EST'], ['Maria Elena Boschi', 'IV', 6, 3, 'RIF'], ['Davide Faraone', 'IV', 5, 2, 'SAL'],
  ['Raffaella Paita', 'IV', 6, 1, 'MIT'],
  // +Europa
  ['Riccardo Magi', 'PE', 6, 1, 'RIF'], ['Emma Bonino', 'PE', 8, 1, 'EST'], ['Benedetto Della Vedova', 'PE', 7, 1, 'UE'],
  // Sud chiama Nord
  ['Cateno De Luca', 'SCN', 5, 5, 'AFFREG'], ['Laura Castelli', 'SCN', 6, 2, 'MEF'],
  // Indipendenti d'area / ministri tecnici attuali
  ['Matteo Piantedosi', 'IND', 7, 2, 'INT'], ['Marina Elvira Calderone', 'IND', 6, 2, 'LAV'], ['Orazio Schillaci', 'IND', 6, 1, 'SAL'],
  ['Andrea Abodi', 'IND', 6, 1, 'SPORT'], ['Luigi Marattin', 'IND', 7, 1, 'MEF'],
  // Tecnici
  ['Mario Draghi', 'TEC', 10, 0, 'MEF'], ['Daniele Franco', 'TEC', 9, 0, 'MEF'], ['Carlo Cottarelli', 'TEC', 8, 0, 'MEF'],
  ['Lucrezia Reichlin', 'TEC', 8, 0, 'MEF'], ['Ignazio Visco', 'TEC', 8, 0, 'MEF'], ['Elsa Fornero', 'TEC', 7, 0, 'LAV'],
  ['Tito Boeri', 'TEC', 8, 0, 'LAV'], ['Pietro Ichino', 'TEC', 7, 0, 'LAV'], ['Paola Severino', 'TEC', 8, 0, 'GIU'],
  ['Marta Cartabia', 'TEC', 9, 0, 'GIU'], ['Nicola Gratteri', 'TEC', 7, 1, 'GIU'], ['Raffaele Cantone', 'TEC', 7, 0, 'PA'],
  ['Enrico Giovannini', 'TEC', 8, 0, 'MIT'], ['Roberto Cingolani', 'TEC', 8, 1, 'MASE'], ['Vittorio Colao', 'TEC', 8, 0, 'MIMIT'],
  ['Luciana Lamorgese', 'TEC', 8, 0, 'INT'], ['Franco Gabrielli', 'TEC', 8, 0, 'INT'], ['Giampaolo Di Paola', 'TEC', 8, 0, 'DIF'],
  ['Elisabetta Belloni', 'TEC', 9, 0, 'EST'], ['Enzo Moavero Milanesi', 'TEC', 8, 0, 'UE'], ['Patrizio Bianchi', 'TEC', 7, 0, 'MIM'],
  ['Maria Cristina Messa', 'TEC', 7, 0, 'MUR'], ['Ilaria Capua', 'TEC', 7, 1, 'SAL'], ['Silvio Brusaferro', 'TEC', 7, 0, 'SAL'],
  ['Sabino Cassese', 'TEC', 9, 0, 'RIF'], ['Giuliano Amato', 'TEC', 8, 1, 'RIF'], ['Andrea Riccardi', 'TEC', 7, 0, 'FAM'],
  ['Francesco Profumo', 'TEC', 7, 0, 'MUR'], ['Fabrizio Curcio', 'TEC', 7, 0, 'PROT'],
];

// Governo Meloni in carica (governo.it, ottobre 2026)
const CURRENT_CABINET = {
  MEF: 'Giancarlo Giorgetti', EST: 'Antonio Tajani', INT: 'Matteo Piantedosi', GIU: 'Carlo Nordio', DIF: 'Guido Crosetto',
  MIT: 'Matteo Salvini', MIMIT: 'Adolfo Urso', LAV: 'Marina Elvira Calderone', MASE: 'Gilberto Pichetto Fratin',
  SAL: 'Orazio Schillaci', MIM: 'Giuseppe Valditara', MUR: 'Anna Maria Bernini', MASAF: 'Francesco Lollobrigida',
  CUL: 'Alessandro Giuli', TUR: 'Gianmarco Mazzi', SOTT: 'Alfredo Mantovano', UE: 'Tommaso Foti', RAPP: 'Luca Ciriani',
  AFFREG: 'Roberto Calderoli', RIF: 'Maria Elisabetta Alberti Casellati', PA: 'Paolo Zangrillo', FAM: 'Eugenia Roccella',
  PROT: 'Nello Musumeci', SPORT: 'Andrea Abodi', DIS: 'Alessandra Locatelli',
};
const CURRENT_VICE = ['Antonio Tajani', 'Matteo Salvini'];

// Istituzioni e attori
const INSTITUTIONS = {
  pdr: 'Sergio Mattarella', pdrEnd: '2029-02-03', presSenato: 'Ignazio La Russa', presCamera: 'Lorenzo Fontana',
  bankit: 'Fabio Panetta', bce: 'Christine Lagarde', commissione: 'Ursula von der Leyen', commEco: 'Valdis Dombrovskis',
  cgil: 'Maurizio Landini', cisl: 'Daniela Fumarola', uil: 'Pierpaolo Bombardieri', confindustria: 'Emanuele Orsini',
  cei: 'card. Matteo Zuppi', papa: 'Papa Leone XIV',
};

// Gruppi sociali e attori (rapporto con te: -100..100)
const GROUPS = {
  sind:  { n: 'Sindacati',          who: 'CGIL, CISL, UIL' },
  conf:  { n: 'Imprese',            who: 'Confindustria' },
  chiesa:{ n: 'Chiesa',             who: 'CEI e Vaticano' },
  ue:    { n: 'Bruxelles',          who: 'Commissione europea' },
  merc:  { n: 'Mercati',            who: 'Investitori e agenzie di rating' },
  quir:  { n: 'Quirinale',          who: 'Presidente della Repubblica' },
  mag:   { n: 'Magistratura',       who: 'ANM e CSM' },
  media: { n: 'Media',              who: 'TV e giornali' },
};

// Talk show e programmi (orientamento: -1 progressista, +1 conservatore)
const TALKSHOWS = [
  { n: 'Porta a Porta', ch: 'Rai 1', lean: 0.2, reach: 3 }, { n: 'Otto e mezzo', ch: 'La7', lean: -0.6, reach: 2 },
  { n: 'DiMartedì', ch: 'La7', lean: -0.4, reach: 2 }, { n: 'Quarta Repubblica', ch: 'Rete 4', lean: 0.7, reach: 2 },
  { n: 'Dritto e Rovescio', ch: 'Rete 4', lean: 0.8, reach: 2 }, { n: 'Piazzapulita', ch: 'La7', lean: -0.6, reach: 2 },
  { n: 'Che tempo che fa', ch: 'Nove', lean: -0.5, reach: 3 }, { n: 'In Onda', ch: 'La7', lean: -0.3, reach: 1 },
  { n: 'Cinque Minuti', ch: 'Rai 1', lean: 0.3, reach: 2 }, { n: 'Report', ch: 'Rai 3', lean: -0.5, reach: 2 },
];

// Percorsi di provenienza del tuo personaggio
const BACKGROUNDS = [
  { id: 'avv', n: 'Avvocato',               car: 6, comp: 7, integ: 6, fama: 4,  fondi: 30, d: '+ competenza su giustizia', bonus: { giu: 1 } },
  { id: 'imp', n: 'Imprenditore',           car: 6, comp: 6, integ: 5, fama: 8,  fondi: 80, d: '+ fondi e rapporto con le imprese', bonus: { conf: 15 } },
  { id: 'sind', n: 'Sindacalista',          car: 7, comp: 5, integ: 7, fama: 6,  fondi: 15, d: '+ rapporto con i sindacati', bonus: { sind: 20 } },
  { id: 'prof', n: 'Professore universitario', car: 5, comp: 9, integ: 7, fama: 4, fondi: 20, d: '+ competenza, credibilità con Bruxelles', bonus: { ue: 10, merc: 5 } },
  { id: 'mag', n: 'Magistrato',             car: 5, comp: 8, integ: 9, fama: 10, fondi: 15, d: '+ integrità, rapporto con la magistratura', bonus: { mag: 25 } },
  { id: 'med', n: 'Medico',                 car: 6, comp: 7, integ: 8, fama: 5,  fondi: 20, d: '+ credibilità sulla sanità', bonus: {} },
  { id: 'mil', n: 'Generale dell’Esercito', car: 7, comp: 6, integ: 6, fama: 14, fondi: 15, d: '+ fama iniziale, forte con l’elettorato d’ordine', bonus: {} },
  { id: 'gio', n: 'Giornalista / volto TV', car: 8, comp: 5, integ: 5, fama: 16, fondi: 20, d: '+ carisma e fama, più facile andare in TV', bonus: { media: 20 } },
  { id: 'inf', n: 'Influencer / attivista', car: 8, comp: 4, integ: 6, fama: 12, fondi: 10, d: '+ social, molto seguito tra i giovani', bonus: { media: 5 } },
  { id: 'sin', n: 'Sindaco di provincia',   car: 6, comp: 6, integ: 7, fama: 5,  fondi: 20, d: '+ esperienza amministrativa e radicamento locale', bonus: {} },
  { id: 'man', n: 'Manager pubblico',       car: 5, comp: 8, integ: 6, fama: 3,  fondi: 40, d: '+ competenza economica, mercati più tranquilli', bonus: { merc: 10 } },
  { id: 'eco', n: 'Economista / ex Bankitalia', car: 4, comp: 9, integ: 8, fama: 6, fondi: 25, d: '+ mercati e Bruxelles si fidano', bonus: { merc: 20, ue: 15 } },
];

// Gradi della carriera dentro un partito
const RANKS = [
  { n: 'Militante',                d: 'Iscritto e attivista: volantini, gazebo, social.' },
  { n: 'Consigliere comunale',     d: 'Eletto nel tuo comune, primi passi nelle istituzioni.' },
  { n: 'Consigliere regionale',    d: 'Siedi nel Consiglio della tua regione.' },
  { n: 'Parlamentare',             d: 'Deputato o senatore della Repubblica.' },
  { n: 'Dirigente nazionale',      d: 'Membro della segreteria, responsabile di un dipartimento.' },
  { n: 'Capogruppo / Sottosegretario', d: 'Guidi i parlamentari del partito o affianchi un ministro.' },
  { n: 'Ministro / Vicesegretario', d: 'Tra i volti di punta del partito.' },
  { n: 'Leader del partito',       d: 'Decidi tu linea, alleanze e candidature.' },
];

// Simboli disponibili per il tuo partito
const SYMBOLS = ['★', '✦', '⚑', '❖', '☀', '✪', '⬢', '❂', '✿', '⚘', '♜', '⚖', '🕊', '🌳', '🔥', '🦅', '🌿', '🛡', '⚙', '🏛'];
const PARTY_COLORS = ['#7b2ff7', '#ff5a1f', '#00a88f', '#e91e63', '#3f51b5', '#009688', '#ff9800', '#795548', '#9c27b0', '#00bcd4', '#8bc34a', '#c62828'];
