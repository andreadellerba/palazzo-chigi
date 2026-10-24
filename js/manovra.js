// ============================================================
//  MANOVRA DIVERSA OGNI ANNO: misure a rotazione e novità
// ============================================================
const BUDGET_EXTRA = [
  // nuove spese e tagli di tasse
  { id: 'e_asili', g: 'Spese', n: 'Asili nido gratuiti', c: 1.2, e: { pop: 1.5, chiesa: 2 }, d: 'Retta azzerata per i redditi medio-bassi.' },
  { id: 'e_casa', g: 'Spese', n: 'Piano casa e affitti calmierati', c: 1.5, e: { pop: 2, conf: 1 }, d: 'Alloggi pubblici e sconti fiscali a chi affitta a canone concordato.' },
  { id: 'e_under30', g: 'Spese', n: 'Taglio delle tasse per gli under 30', c: 1.8, e: { pop: 1.5, conf: 1 }, d: 'IRPEF ridotta per i giovani che lavorano.' },
  { id: 'e_medici', g: 'Spese', n: 'Assunzioni di medici e infermieri', c: 2, e: { pop: 2, sind: 3 }, d: 'Contro le liste d’attesa e i pronto soccorso pieni.' },
  { id: 'e_ia', g: 'Spese', n: 'Fondo per l’intelligenza artificiale', c: 1, e: { pil: 0.05, conf: 3 }, d: 'Ricerca, start-up e formazione digitale.' },
  { id: 'e_ponte', g: 'Spese', n: 'Ponte sullo Stretto: nuova tranche', c: 1.5, e: { pil: 0.03, pop: -0.5, conf: 2 }, d: 'Fondi per i cantieri tra Calabria e Sicilia.' },
  { id: 'e_studenti', g: 'Spese', n: 'Trasporto pubblico gratis per gli studenti', c: 0.8, e: { pop: 1 }, d: 'Abbonamenti gratuiti fino a 26 anni.' },
  { id: 'e_cuneo', g: 'Spese', n: 'Taglio più forte del cuneo fiscale', c: 4, e: { pop: 2.5, sind: 3, conf: 3 }, d: 'Più soldi in busta paga per i redditi fino a 40.000 euro.' },
  { id: 'e_irpef', g: 'Spese', n: 'Taglio IRPEF al ceto medio', c: 3, e: { pop: 2, conf: 1 }, d: 'Aliquota del secondo scaglione dal 35% al 33%.' },
  { id: 'e_assegno', g: 'Spese', n: 'Assegno unico più alto', c: 2, e: { pop: 1.5, chiesa: 4 }, d: 'Più soldi alle famiglie con figli.' },
  { id: 'e_dissesto', g: 'Spese', n: 'Piano contro frane e alluvioni', c: 1.5, e: { pil: 0.03, pop: 0.5 }, d: 'Argini, fiumi e messa in sicurezza dei territori.' },
  { id: 'e_carceri', g: 'Spese', n: 'Piano carceri', c: 0.8, e: { mag: 3 }, d: 'Nuovi posti e personale penitenziario.' },
  // nuove coperture
  { id: 'x_zucchero', g: 'Coperture', n: 'Tassa sulle bevande zuccherate', c: -0.4, e: { pop: -0.3, conf: -1 }, d: 'Rinviata per anni: ora si applica.' },
  { id: 'x_privat', g: 'Coperture', n: 'Privatizzazioni di quote pubbliche', c: -2, e: { merc: 3, sind: -3 }, d: 'Vendita di quote di aziende partecipate.' },
  { id: 'x_cripto', g: 'Coperture', n: 'Tassa su cripto e plusvalenze', c: -0.6, e: { pop: 0.2 }, d: 'Aliquota più alta sui guadagni da cripto-attività.' },
  { id: 'x_energia', g: 'Coperture', n: 'Contributo delle aziende energetiche', c: -2, e: { conf: -3, merc: -2, pop: 1 }, d: 'Prelievo sugli utili straordinari del settore.' },
  { id: 'x_enti', g: 'Coperture', n: 'Accorpamento degli enti inutili', c: -0.8, e: { pop: 0.5 }, d: 'Chiusura di enti e agenzie doppioni.' },
  { id: 'x_catasto', g: 'Coperture', n: 'Riforma del catasto', c: -2, e: { pop: -2, conf: -1 }, d: 'Valori delle case aggiornati: più IMU sulle seconde case.' },
  { id: 'x_web', g: 'Coperture', n: 'Web tax raddoppiata', c: -0.8, e: { ue: 1, conf: -1 }, d: 'Dal 3% al 6% sui ricavi digitali dei colossi del web.' },
  { id: 'x_voli', g: 'Coperture', n: 'Tassa sui voli privati e sugli yacht', c: -0.3, e: { pop: 0.5 }, d: 'Simbolica, ma piace molto.' },
  { id: 'x_bonusedil', g: 'Coperture', n: 'Stop ai crediti residui dei bonus edilizi', c: -2, e: { conf: -4, pop: -1 }, d: 'Chiude le ultime code del Superbonus.' },
  { id: 'x_turnover', g: 'Coperture', n: 'Blocco delle assunzioni nella PA', c: -1.5, e: { sind: -4 }, d: 'Si sostituisce solo una parte di chi va in pensione.' },
];
BUDGET_EXTRA.forEach(m => { m.extra = true; BUDGET_MEASURES.push(m); BUDGET_BY_ID[m.id] = m; });

// il menu della manovra di un anno: sempre diverso, ma stabile per quell'anno
function manovraMenu(year) {
  const r = seeded(hashStr('manovra-' + year) || 7), shuffle = a => a.map(x => [r(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);
  const base = BUDGET_MEASURES.filter(m => !m.extra), extra = BUDGET_MEASURES.filter(m => m.extra);
  const spese = shuffle(base.filter(m => m.g === 'Spese' && m.id !== 'm_statali')).slice(0, 7);
  if (year % 3 === 0) spese.unshift(BUDGET_BY_ID.m_statali); // i contratti statali si rinnovano ogni tre anni
  const cop = shuffle(base.filter(m => m.g === 'Coperture')).slice(0, 6);
  const nuoveS = shuffle(extra.filter(m => m.g === 'Spese')).slice(0, 4), nuoveC = shuffle(extra.filter(m => m.g === 'Coperture')).slice(0, 3);
  return spese.concat(nuoveS, cop, nuoveC);
}
