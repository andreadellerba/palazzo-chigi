// ============================================================
//  QUESTIONARIO SULLE IDEE + SPIEGAZIONE DEGLI ASSI
// ============================================================
// cosa vuol dire ogni lato di ogni asse, in parole semplici
const AXIS_HELP = {
  eco: ['Più Stato: welfare, salario minimo, tasse progressive', 'Più mercato: meno tasse, meno Stato, liberalizzazioni'],
  soc: ['Diritti civili: matrimonio egualitario, fine vita, cannabis', 'Valori tradizionali: famiglia, ordine, religione'],
  eu: ['Più Europa: integrazione, regole e scelte comuni', 'Più sovranità: interessi nazionali prima di Bruxelles'],
  imm: ['Accoglienza: integrazione, cittadinanza più facile', 'Chiusura: confini, rimpatri, meno ingressi'],
  amb: ['Ambiente prima: rinnovabili, stop ai fossili', 'Sviluppo prima: industria, energia a basso costo, grandi opere'],
  giu: ['Pugno duro: intercettazioni, niente prescrizione', 'Garantismo: diritti degli imputati, processi rapidi'],
  terr: ['Stato centrale: stessi servizi ovunque, aiuti al Sud', 'Autonomie: più poteri e risorse alle Regioni'],
  ist: ['Parlamento forte: contrappesi e proporzionale', 'Premier forte: elezione diretta e stabilità'],
};
function axisPosLabel(k, v) {
  if (v <= -6) return { t: AXES[k].l + ' (deciso)', c: '#ff6b6b' };
  if (v <= -2) return { t: AXES[k].l, c: '#ff9f9f' };
  if (v < 2) return { t: 'Al centro', c: '#cbd5e1' };
  if (v < 6) return { t: AXES[k].r, c: '#93b4ff' };
  return { t: AXES[k].r + ' (deciso)', c: '#6b9bff' };
}
// affermazioni: dir +1 = essere d'accordo sposta verso destra dell'asse
const QUIZ = [
  { ax: 'eco', dir: -1, q: 'Lo Stato deve garantire un salario minimo per legge.' },
  { ax: 'soc', dir: -1, q: 'Le coppie dello stesso sesso devono potersi sposare.' },
  { ax: 'imm', dir: 1, q: 'Servono più rimpatri e confini più controllati.' },
  { ax: 'eu', dir: -1, q: 'L’Italia deve decidere di più insieme agli altri Paesi europei.' },
  { ax: 'amb', dir: 1, q: 'Le grandi opere come il Ponte sullo Stretto vanno fatte.' },
  { ax: 'giu', dir: 1, q: 'Troppi processi mediatici: serve più garantismo.' },
  { ax: 'terr', dir: 1, q: 'Le Regioni che amministrano bene devono avere più autonomia e trattenere più tasse.' },
  { ax: 'ist', dir: 1, q: 'Il Presidente del Consiglio dovrebbe essere eletto direttamente dai cittadini.' },
  { ax: 'eco', dir: 1, q: 'Bisogna abbassare le tasse anche se si taglia la spesa pubblica.' },
  { ax: 'soc', dir: 1, q: 'La famiglia tradizionale va protetta e aiutata più delle altre.' },
  { ax: 'imm', dir: -1, q: 'Chi nasce e studia in Italia deve diventare cittadino più facilmente.' },
  { ax: 'eu', dir: 1, q: 'Prima gli interessi nazionali, anche a costo di scontrarsi con Bruxelles.' },
  { ax: 'amb', dir: -1, q: 'Bisogna abbandonare presto benzina, diesel e gas, anche se costa.' },
  { ax: 'giu', dir: -1, q: 'Contro la corruzione servono intercettazioni senza limiti di tempo.' },
  { ax: 'terr', dir: -1, q: 'Lo Stato deve investire soprattutto nel Sud.' },
  { ax: 'ist', dir: -1, q: 'Il Parlamento deve restare al centro: niente uomini soli al comando.' },
];
const QUIZ_ANS = [['Molto d’accordo', 2, '#22c55e'], ['D’accordo', 1, '#86efac'], ['Neutrale', 0, '#94a3b8'], ['In disaccordo', -1, '#fca5a5'], ['Per niente', -2, '#ef4444']];
function quizResult(answers) {
  const ax = {}; AXIS_KEYS.forEach(k => ax[k] = 0);
  QUIZ.forEach((q, i) => { if (answers[i] !== undefined) ax[q.ax] += answers[i] * q.dir * 2.5; });
  AXIS_KEYS.forEach(k => ax[k] = clamp(Math.round(ax[k]), -10, 10));
  return ax;
}
function quizHTML() {
  const i = SETUP.qi, q = QUIZ[i];
  return `<div class="row between"><h2>Le tue idee</h2><span class="tag o">${i + 1} / ${QUIZ.length}</span></div>
    <div class="progress mt">${QUIZ.map((x, j) => `<i class="${j < i ? 'd' : j === i ? 'c' : ''}"></i>`).join('')}</div>
    <div class="swipe-card mt2" style="--vc:var(--oro);touch-action:auto"><div class="tiny gold" style="font-weight:800">${AXES[q.ax].n.toUpperCase()}</div><div class="big-q mt">${esc(q.q)}</div></div>
    <div class="col mt2">${QUIZ_ANS.map((a, j) => `<button class="btn block" style="border-color:${a[2]};color:${a[2]}" onclick="quizAnswer(${a[1]})">${a[0]}</button>`).join('')}</div>
    <div class="row mt">${i ? '<button class="btn sm" onclick="SETUP.qi--;renderSetup()">‹ Domanda precedente</button>' : ''}<button class="btn sm" style="margin-left:auto" onclick="SETUP.manual=true;renderSetup()">Imposta a mano</button></div>`;
}
function quizAnswer(v) {
  SETUP.answers[SETUP.qi] = v; vib(10);
  if (SETUP.qi < QUIZ.length - 1) { SETUP.qi++; renderSetup(); return; }
  const ax = quizResult(SETUP.answers);
  const tgt = SETUP.mode === 'fondatore' ? SETUP.party.ax : SETUP.player.ax;
  Object.assign(tgt, ax);
  if (SETUP.mode === 'carriera') SETUP.join.ownIdeas = true;
  SETUP.quizDone = true; renderSetup();
}
// riga di un asse con spiegazione e posizione
function axisRowHTML(k, v) {
  const pl = axisPosLabel(k, v);
  return `<div class="axisrow"><div class="row between"><span class="name">${AXES[k].n}</span><span class="axis-pos" id="axp_${k}" style="color:${pl.c}">${pl.t}</span></div>
    <input type="range" min="-10" max="10" step="1" value="${v}" oninput="setAx('${k}',+this.value)">
    <div class="axis-help"><div>◀ ${AXIS_HELP[k][0]}</div><div>${AXIS_HELP[k][1]} ▶</div></div></div>`;
}
