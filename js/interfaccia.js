// ============================================================
//  INTERFACCIA: suoni, calendario che sfoglia, avanzamento veloce,
//  consigli alla prima visita, Home compatta, meno tocchi
// ============================================================

// ---------- suoni sintetizzati (nessun file da scaricare) ----------
const SND = { ctx: null };
function soundOn() { try { return localStorage.getItem(SAVE_PREFIX + 'snd') === '1'; } catch (e) { return false; } }
function setSound(on) { try { localStorage.setItem(SAVE_PREFIX + 'snd', on ? '1' : '0'); } catch (e) {} if (on) sfx('bell'); }
function actx() { if (!SND.ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; SND.ctx = new A(); } if (SND.ctx.state === 'suspended') SND.ctx.resume(); return SND.ctx; }
function noiseBuf(c, sec) { const b = c.createBuffer(1, c.sampleRate * sec, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; }
function sfx(kind) {
  if (!soundOn()) return;
  try {
    const c = actx(); if (!c) return; const t = c.currentTime, out = c.createGain(); out.gain.value = 0.5; out.connect(c.destination);
    if (kind === 'page') { // pagina che si gira
      const n = c.createBufferSource(); n.buffer = noiseBuf(c, 0.35); const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(3500, t + 0.3); const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.35, t + 0.05); g.gain.exponentialRampToValueAtTime(0.001, t + 0.33); n.connect(f).connect(g).connect(out); n.start(t);
    } else if (kind === 'bell') { // campanella dell'aula
      [880, 1320].forEach((fq, i) => { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = fq; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25 / (i + 1), t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1); o.connect(g).connect(out); o.start(t); o.stop(t + 1.2); });
    } else if (kind === 'applause') { // applausi
      for (let k = 0; k < 26; k++) { const n = c.createBufferSource(); n.buffer = noiseBuf(c, 0.06); const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1500 + Math.random() * 1500; const g = c.createGain(), s = t + Math.random() * 1.4; g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(0.25, s + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, s + 0.06); n.connect(f).connect(g).connect(out); n.start(s); }
    } else if (kind === 'tap') {
      const o = c.createOscillator(), g = c.createGain(); o.frequency.value = 520; g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06); o.connect(g).connect(out); o.start(t); o.stop(t + 0.07);
    }
  } catch (e) {}
}

// ---------- calendario che sfoglia ----------
function weekFlip(from, to) {
  const el = document.createElement('div'); el.className = 'wkflip';
  const pg = w => { const d = dateOf(w); return `<div class="wd">${MESI[d.getMonth()].toUpperCase()} ${d.getFullYear()}</div><div class="wn">${d.getDate()}</div><div class="ww">settimana ${w + 1}</div>`; };
  el.innerHTML = `<div class="cal"><div class="pg to">${pg(to)}</div><div class="pg from">${pg(from)}</div></div>`;
  document.body.appendChild(el); sfx('page');
  setTimeout(() => el.classList.add('out'), 620); setTimeout(() => el.remove(), 900);
}
const _nextWeekUi = nextWeek;
nextWeek = function () {
  if (G.phase !== 'normale' || G.queue.length) return _nextWeekUi();
  const from = G.week; _nextWeekUi();
  if (G.week !== from) { weekFlip(from, G.week); const s = G.lastSummary; if (s && s.votes && s.votes.length) setTimeout(() => sfx('bell'), 500); }
};

// ---------- avanza fino al prossimo evento importante ----------
function fastForward() {
  if (G.phase !== 'normale' || G.queue.length) return nextWeek();
  const from = G.week, before = { poll: myParty().poll, appr: G.gov ? G.gov.approval : null, spread: G.econ.spread };
  let s = null, n = 0, auto = [];
  while (n < 8) {

    auto = runRoutine();
    s = advanceWeek(); if (!s) break; n++;
    G.queue = s.specials.map(x => ({ sp: x })).concat(G.queue);
    if (G.queue.length || G.phase !== 'normale' || pendingVoteIds().length || (G.cal.election - G.week <= 3 && G.cal.election > G.week)) break;
  }
  saveGame('auto'); renderGame(); vib(12);
  if (G.week !== from) weekFlip(from, G.week);
  if (s) { showWeekSummary(s, before, auto); if (n > 1) toast(`Avanzato di ${n} settimane`, 'good'); }
}
const _fabHTMLUi = fabHTML;
fabHTML = function () {
  const h = _fabHTMLUi();
  if (G.phase !== 'normale' || G.queue.length) return h;
  return h + `<button class="fab2" onclick="fastForward()" title="Avanza fino al prossimo evento">${icon('arrowr', 16)}${icon('arrowr', 16)}</button>`;
};

// ---------- consigli alla prima visita di ogni sezione ----------
const TAB_TIPS = {
  home: 'Qui trovi chi sei, le Info della settimana e le azioni. Le azioni evidenziate in giallo sono quelle che fa il tasto ★ accanto al titolo. La freccia in basso a destra fa passare la settimana.',
  leggi: 'Il catalogo delle leggi in vigore. Toccane una per vedere com’è oggi e come potresti cambiarla, oppure usa «Regola le leggi attuali» per spostare i cursori e vedere subito cosa sale e cosa scende.',
  aula: 'Camera e Senato: chi ha i seggi e cosa si vota. Ogni card mostra com’è la legge oggi, cosa diventerebbe e quanti sì e no sono previsti. Toccala per i dettagli.',
  italia: 'La mappa: tocca una regione per vedere chi governa e quanto è forte il tuo partito. Le icone sono gli eventi in corso.',
  partiti: 'Sondaggi (anche per istituto, età e zona), schede dei partiti e alleanze. Da qui costruisci la tua coalizione.',
  conti: 'L’economia: PIL, deficit, debito, spread. Il colore dice se il valore sta migliorando o peggiorando nelle ultime settimane.',
};
function tabTipHTML(tab) {
  G.flags.tabTips = G.flags.tabTips || {};
  if (G.flags.tabTips[tab] || !TAB_TIPS[tab]) return '';
  return `<div class="card tight tabtip"><div class="row" style="align-items:flex-start">${icon('info', 18)}<div class="grow small">${TAB_TIPS[tab]}</div></div><div class="right mt"><button class="btn sm" onclick="G.flags.tabTips['${tab}']=1;renderGame()">Ho capito</button></div></div>`;
}
const _tabContentUi = tabContent;
tabContent = function () { return tabTipHTML(UI.tab) + _tabContentUi(); };

// ---------- Home compatta: 3 numeri chiave ----------
function homeHeroHTML() {
  const p = G.player, mp = myParty(), g = G.gov;
  const second = g ? stat4(isPremier() ? 'Tuo governo' : 'Governo', fmt0(g.approval) + '%', 'appr', '#ffd60a') : stat4('Notorietà', fmt0(partyNoto(myPid())) + '%', 'noto', '#22d3ee');
  const third = isLeader() ? stat4('Fama', fmt0(p.fama), 'fama', '#f0abfc') : stat4('Col leader', relNum(p.rap), 'rap', relColorHex(p.rap));
  return `<div class="card hero hcomp" style="--pc:${mp.color}">
    <div class="row"><span class="av-badge" onclick="openAvatarEditor()">${portrait(p.name, 58, { party: myPid() })}<span class="pbadge" style="--c:${mp.color}">${partyMark(myPid(), 20)}</span></span>
      <div class="grow"><h3>${esc(p.name)}</h3><div class="role-l">${esc(roleLabel())}</div>${g ? `<div class="row wrap" style="gap:3px;margin-top:5px">${g.parties.map(partyChip).join('')}</div>` : ''}</div></div>
    <div class="st4s s3">${stat4('Sondaggio', fmt1(mp.poll) + '%', 'poll', '#c4a5ff')}${second}${third}</div>
    <div class="minirow"><span>${icon('coin')} ${euro(G.funds)}</span><span>${icon('sun')} Stress ${fmt0(p.stress)}</span><span>${icon('building')} ${!isLeader() ? esc(RANKS[p.rank].n) : (mp.seatsC + mp.seatsS) + ' parlamentari'}</span></div></div>`;
}

// ---------- meno tocchi: vicepremier direttamente dalla lista ----------
function toggleViceInline(mid) {
  const f = G.formation, n = f.ministers[mid]; if (!n) return;
  if (f.vice.includes(n)) f.vice = f.vice.filter(x => x !== n);
  else if (f.vice.length < 2) f.vice.push(n);
  else return toast('Al massimo due vicepremier: prima togline uno', 'bad');
  const sh = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null, st = sh ? sh.scrollTop : 0;
  renderCabinet(); vib(6);
  const s2 = layers.length ? layers[layers.length - 1].el.querySelector('.sheet') : null; if (s2) s2.scrollTop = st;
}
// applausi insieme ai coriandoli
const _confettiUi = confetti;
confetti = function (...a) { sfx('applause'); return _confettiUi.apply(this, a); };

// ---------- stile grafico: Brutalista (predefinito) o Classico ----------
function styleNow() { try { return localStorage.getItem(SAVE_PREFIX + 'stile') || 'bru'; } catch (e) { return 'bru'; } }
function applyStyle() {
  if (/proposte/.test(location.pathname)) return;
  const s = styleNow(); document.documentElement.classList.toggle('bru', s === 'bru');
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = s === 'bru' ? '#000000' : '#0a1024';
}
function setStyle(s) { try { localStorage.setItem(SAVE_PREFIX + 'stile', s); } catch (e) {} applyStyle(); if (G && G.player && $('#app') && $('#app').innerHTML) renderGame(); }
applyStyle();
