// Avatar disegnati (generatore preso da Laurera: LAV, _lc, lavSvg)
const LAV={
  pelle:['#fde7d6','#fbdcc6','#f6d0b6','#f2c6a8','#ecbd9c','#e5b18c','#dca47c','#cf9469','#c08560','#a8714f'],
  colCap:['#0f0d0c','#2a1d16','#3d2b20','#5a3a24','#7a5232','#9a6a3f','#b98a55','#d8b06c','#ecd29a','#f3e6c4','#8a3a22','#b4532a','#d0703a','#6b6b6b','#9a9a9a','#cfcfcf','#f2f2f2'],
  colOcchi:['#3b2618','#1b1b1f','#6b4a2a','#5a7a3a','#3c7fbf','#6f8fa8','#8aa0b0'],
  colori:['#ef4444','#f97316','#f59e0b','#e8ff00','#22c55e','#15803d','#14b8a6','#38bdf8','#2563eb','#1e3a8a','#a78bfa','#7c3aed','#ff4fb8','#be123c','#f4f4f5','#9ca3af','#374151','#111827'],
  sfondi:['auto','#14151a','#0e1c33','#24507f','#1f2937','#3b0764','#064e3b','#7f1d1d','#78350f','#e8ff00','#f4f4f5'],
  // [chiave, etichetta]
  viso:[['ovale','Ovale'],['tondo','Tondo'],['squadrato','Squadrato'],['allungato','Allungato'],['cuore','A cuore']],
  capelli:[['corti','Corti'],['rasato','Rasati'],['spazzola','A spazzola'],['ciuffo','Ciuffo'],['riga','Riga di lato'],['indietro','Tirati indietro'],['frangia','Frangia'],['mossi','Mossi'],['ricci','Ricci'],['ricciCorti','Ricci corti'],['cresta','Cresta'],['codino','Codino'],['stempiato','Stempiato'],['chierica','Calvo ai lati'],['pelato','Pelato'],['pixie','Corti da donna'],['caschetto','Caschetto'],['lunghi','Lunghi lisci'],['lunghiMossi','Lunghi mossi'],['coda','Coda'],['codaAlta','Coda alta'],['chignon','Chignon'],['treccia','Treccia']],
  sfum:[['no','Nessuna'],['fade','Sfumati ai lati'],['tempie','Tempie grigie'],['brizzolato','Brizzolati'],['meches','Colpi di sole'],['ombre','Punte chiare']],
  barba:[['no','Nessuna'],['accenno','Accenno'],['corta','Corta'],['incolta','Incolta'],['piena','Piena'],['lunga','Lunga'],['pizzetto','Pizzetto'],['cerchio','A cerchio'],['baffi','Baffi'],['baffiPizzetto','Baffi e pizzetto'],['mento','Sul mento'],['basette','Basette']],
  sopr:[['normali','Normali'],['arcuate','Arcuate'],['dritte','Dritte'],['folte','Folte'],['sottili','Sottili'],['angolate','Angolate']],
  occhi:[['mandorla','A mandorla'],['tondi','Tondi'],['piccoli','Piccoli'],['sottili','Socchiusi']],
  naso:[['piccolo','Piccolo'],['medio','Medio'],['grande','Grande'],['aquilino','Aquilino'],['largo','Largo']],
  bocca:[['sorriso','Sorriso'],['aperto','Sorriso aperto'],['mezzo','Mezzo sorriso'],['serio','Serio'],['sottile','Labbra sottili']],
  occhiali:[['no','Nessuno'],['tondi','Da vista tondi'],['rett','Da vista squadrati'],['meta','Mezza montatura'],['sole','Da sole'],['aviator','Aviatore'],['sport','Sportivi']],
  testa:[['no','Nessuno'],['fascia','Fascia'],['fasciaLarga','Fascia larga'],['cappello','Cappellino'],['rovescio','Cappellino al contrario'],['visiera','Visiera'],['bandana','Bandana'],['berretto','Berretto di lana'],['pescatore','Cappello da pescatore']],
  maglia:[['polo','Polo'],['girocollo','Girocollo'],['scolloV','Scollo a V'],['sport','Sportiva'],['canotta','Canotta'],['felpa','Felpa']],
};
const _lc=(c,a)=>{if(!/^#[0-9a-f]{6}$/i.test(c))return c;const n=parseInt(c.slice(1),16),f=v=>Math.max(0,Math.min(255,v-a));return`rgb(${f(n>>16)},${f((n>>8)&255)},${f(n&255)})`;};   // a>0 scurisce, a<0 schiarisce
function lavSvg(c){
  const FS={ovale:{w:36,jw:22,cy:142},tondo:{w:39,jw:30,cy:138},squadrato:{w:37,jw:32,cy:138,sq:1},allungato:{w:33,jw:20,cy:148},cuore:{w:38,jw:15,cy:142}};
  const f=FS[c.viso]||FS.ovale,L=100-f.w,R=100+f.w,k=f.w/36,sk=c.pelle,hc=c.colCap,bc=c.colBarba||hc,E=94,ex=f.w*.42,cy=f.cy;
  const sx=s=>`<g transform="translate(100 0) scale(${k} 1) translate(-100 0)">${s}</g>`;
  let defs=`<radialGradient id="bg" cx="50%" cy="38%" r="72%"><stop offset="0" stop-color="${c.sfondo==='auto'?c.colMaglia:_lc(c.sfondo,-30)}" stop-opacity="${c.sfondo==='auto'?.4:1}"/><stop offset="1" stop-color="${c.sfondo==='auto'?'#14151a':c.sfondo}"/></radialGradient>`
    +`<radialGradient id="sk" cx="46%" cy="40%" r="70%"><stop offset="0" stop-color="${_lc(sk,-10)}"/><stop offset=".65" stop-color="${sk}"/><stop offset="1" stop-color="${_lc(sk,24)}"/></radialGradient>`
    +`<linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${_lc(hc,-28)}"/><stop offset=".45" stop-color="${hc}"/><stop offset="1" stop-color="${c.sfum==='ombre'?_lc(hc,-70):_lc(hc,18)}"/></linearGradient>`
    +`<linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${_lc(c.colMaglia,-14)}"/><stop offset="1" stop-color="${_lc(c.colMaglia,26)}"/></linearGradient>`
    +`<pattern id="bz" width="13" height="11" patternUnits="userSpaceOnUse"><path d="M1 2l3 1.2M7 5l2.6-.8M3 8.5l2.4 1.4M10 9.5l2.2.6" stroke="#ececec" stroke-width="1.2" stroke-opacity=".6" stroke-linecap="round"/></pattern>`
    +`<pattern id="rz" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="${_lc(hc,-20)}" opacity=".7"/></pattern>`
    +`<linearGradient id="fd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sk}" stop-opacity="0"/><stop offset="1" stop-color="${sk}" stop-opacity=".95"/></linearGradient>`;
  const H='url(#hg)';
  // forma dei capelli rasati: segue il cranio (coordinate per testa larga 36, poi adattata al viso)
  const BUZZ='M63.6 92C63.6 57.6 77.6 45.6 100 45.6C122.4 45.6 136.4 57.6 136.4 92L134.2 92C133.4 83 131.6 75.5 127.6 70.4C121 65.4 108.4 64.2 100 64.6C91.6 64.2 79 65.4 72.4 70.4C68.4 75.5 66.6 83 65.8 92Z';
  defs+=`<pattern id="bz2" width="6" height="5.6" patternUnits="userSpaceOnUse" patternTransform="rotate(17)">${[[.6,.9],[2.3,.4],[4.1,1.3],[5.4,.2],[1.4,2.5],[3.3,3],[5,3.6],[.4,4.4],[2.4,4.9],[4.4,5.2]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".33" fill="${_lc(hc,25)}"/>`).join('')}</pattern><mask id="bzm"><path d="${BUZZ}" fill="#fff" filter="url(#bzb)"/></mask><filter id="bzb" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.3"/></filter>`;
  // ── capelli: parte dietro (passa dietro collo e spalle) e parte davanti ──
  const C=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="FILL"/>`;
  const capBase=`<path d="M62 96C56 52 80 34 100 34C120 34 144 52 138 96C136 80 132 72 126 68C116 64 84 64 74 68C68 72 64 80 62 96Z" fill="FILL"/>`;
  const hairs={
    corti:{f:capBase},
    // rasati: aderenti al cranio (non sporgono), attaccatura sfumata, pelo fine
    rasato:{f:`<g mask="url(#bzm)"><path d="${BUZZ}" fill="${hc}" opacity=".5"/><path d="${BUZZ}" fill="url(#bz2)"/></g>`},
    spazzola:{f:`<path d="M62 94C58 64 66 50 72 46L72 36L80 42L84 30L91 40L97 27L103 39L110 28L115 40L122 32L126 44L130 40C138 52 142 70 138 94C136 80 132 72 126 68C116 64 84 64 74 68C68 72 64 80 62 94Z" fill="FILL"/>`},
    ciuffo:{f:capBase+`<path d="M72 70C66 50 80 32 100 30C118 22 138 32 136 48C134 58 122 62 110 66C98 70 84 72 72 70Z" fill="FILL"/>`},
    riga:{f:`<path d="M62 96C56 52 80 34 100 34C120 34 144 52 138 96C136 80 130 70 120 66C110 63 98 66 86 72C80 66 72 70 66 80C64 84 63 90 62 96Z" fill="FILL"/>`,x:`<path d="M86 38Q83 56 86 72" stroke="${_lc(hc,30)}" stroke-width="1.6" fill="none"/>`},
    indietro:{f:`<path d="M63 92C58 50 80 32 100 32C120 32 142 50 137 92C135 72 128 62 116 58C108 56 92 56 84 58C72 62 65 72 63 92Z" fill="FILL"/>`,x:`<path d="M78 58Q96 40 124 50M74 66Q96 46 130 58M84 56Q100 36 116 42" stroke="${_lc(hc,-30)}" stroke-width="1.3" fill="none" opacity=".6"/>`},
    frangia:{f:`<path d="M62 98C56 52 80 34 100 34C120 34 144 52 138 98C136 86 134 80 130 78L126 82L120 76L114 82L108 76L102 82L96 76L90 82L84 76L78 82L72 77C68 80 64 86 62 98Z" fill="FILL"/>`},
    mossi:{b:`<path d="M58 88C52 104 54 118 62 124L68 100Z" fill="FILL"/><path d="M142 88C148 104 146 118 138 124L132 100Z" fill="FILL"/>`,f:`<path d="M60 104C52 52 80 32 100 32C122 32 148 52 140 104C138 92 136 84 130 80C128 74 120 70 112 72C114 78 110 82 104 82C104 74 96 70 86 72C76 72 66 80 60 104Z" fill="FILL"/>`},
    ricci:{f:[[70,82],[70,68],[78,56],[90,48],[104,46],[117,50],[127,59],[132,72],[134,86],[66,94],[86,58],[100,56],[114,60],[76,72],[124,72],[96,64],[110,66]].map(([x,y])=>C(x,y,11.5)).join('')},
    ricciCorti:{f:capBase+[[72,70],[80,58],[92,51],[106,50],[118,56],[128,66],[86,64],[100,60],[114,63]].map(([x,y])=>C(x,y,7.5)).join('')},
    cresta:{f:`<g mask="url(#bzm)"><path d="${BUZZ}" fill="${hc}" opacity=".42"/><path d="${BUZZ}" fill="url(#bz2)"/></g><path d="M88 67C86 55 90 41 100 37C110 41 114 55 112 67C107 64.5 93 64.5 88 67Z" fill="FILL"/>`},
    codino:{f:C(100,30,12)+`<path d="M63 92C58 50 80 34 100 34C120 34 142 50 137 92C135 72 128 62 116 58C108 56 92 56 84 58C72 62 65 72 63 92Z" fill="FILL"/>`},
    stempiato:{f:`<path d="M62 96C56 52 80 34 100 34C120 34 144 52 138 96C136 82 134 70 128 58C122 64 120 70 114 68C108 62 92 62 86 68C80 70 78 64 72 58C66 70 64 82 62 96Z" fill="FILL"/>`},
    chierica:{f:`<path d="M62 98C58 82 60 70 66 62L71 66C67 74 66 86 67 99Z" fill="FILL"/><path d="M138 98C142 82 140 70 134 62L129 66C133 74 134 86 133 99Z" fill="FILL"/>`,shine:1},
    pelato:{f:'',shine:1},
    pixie:{f:`<path d="M62 98C56 50 82 32 102 34C126 34 144 52 138 94C134 78 126 70 116 70C104 72 90 78 74 86C68 88 64 92 62 98Z" fill="FILL"/>`},
    caschetto:{b:`<path d="M58 92C56 118 60 130 68 132L132 132C140 130 144 118 142 92Z" fill="FILL"/>`,f:`<path d="M60 106C58 52 80 34 100 34C120 34 142 52 140 106C138 92 136 82 130 78C116 80 84 80 70 78C64 82 62 92 60 106Z" fill="FILL"/>`},
    lunghi:{b:`<path d="M58 88C50 120 54 150 66 168C76 158 74 142 72 126L128 126C126 142 124 158 134 168C146 150 150 120 142 88Z" fill="FILL"/>`,f:`<path d="M62 102C58 54 80 34 100 34C122 34 142 54 138 102C134 80 118 64 101 62C84 64 66 80 62 102Z" fill="FILL"/>`,x:`<path d="M101 36V62" stroke="${_lc(hc,30)}" stroke-width="1.4"/>`},
    lunghiMossi:{b:[[60,96],[56,112],[58,128],[62,144],[68,160],[140,96],[144,112],[142,128],[138,144],[132,160]].map(([x,y])=>C(x,y,12)).join('')+`<path d="M64 100L136 100L134 160L66 160Z" fill="FILL"/>`,f:`<path d="M60 104C54 54 80 34 100 34C122 34 146 54 140 104C136 82 122 66 106 64C112 72 106 78 98 78C96 70 90 66 82 70C72 76 64 88 60 104Z" fill="FILL"/>`},
    coda:{b:`<path d="M128 70C162 70 168 114 152 150C154 118 146 98 128 94Z" fill="FILL"/>`,f:`<path d="M62 96C58 52 80 34 100 34C122 34 142 52 138 92C132 74 118 66 100 66C84 66 68 76 62 96Z" fill="FILL"/>`},
    codaAlta:{b:`<path d="M104 38C134 20 162 48 152 98C148 74 134 58 114 54Z" fill="FILL"/>`,f:`<path d="M62 96C58 52 80 34 100 34C122 34 142 52 138 92C132 74 118 66 100 66C84 66 68 76 62 96Z" fill="FILL"/><circle cx="110" cy="38" r="4" fill="${c.colTesta}"/>`},
    chignon:{f:C(100,30,15)+`<path d="M62 96C58 52 80 36 100 36C122 36 142 52 138 92C132 74 118 66 100 66C84 66 68 76 62 96Z" fill="FILL"/>`},
    treccia:{b:[[64,112],[62,126],[63,140],[66,154],[70,166]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="9" ry="8" fill="FILL" stroke="${_lc(hc,30)}" stroke-width="1.2"/>`).join(''),f:`<path d="M62 102C58 52 80 34 100 34C122 34 142 52 138 92C132 74 118 66 100 66C84 66 70 78 66 104Z" fill="FILL"/>`},
  };
  const hs=hairs[c.capelli]||hairs.corti;
  const hairBack=(hs.b||'').split('FILL').join(H),hairFront=(hs.f||'').split('FILL').join(H);
  let hairOver='';
  if(hs.f&&c.sfum==='brizzolato')hairOver+=(hs.f||'').split('FILL').join('url(#bz)');
  if(hs.f&&c.sfum==='meches')hairOver+=`<path d="M78 50Q86 44 92 58M98 42Q104 40 106 56M114 46Q122 46 124 60M70 64Q74 56 80 60" stroke="${_lc(hc,-80)}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".55"/>`;
  if(hs.f&&!['rasato','pelato','chierica','cresta'].includes(c.capelli)&&c.sfum!=='brizzolato')hairOver+=`<path d="M84 44Q96 38 112 42M80 52Q88 47 96 48" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".16"/>`;
  if(hs.f&&['fade','tempie'].includes(c.sfum)){const col=c.sfum==='fade'?'url(#fd)':'#c9c9c9',op=c.sfum==='fade'?1:.8;hairOver+=`<path d="M62 98C60 88 61 80 65 74C69 76 71 80 71 86C71 92 69 96 66 100Z" fill="${col}" opacity="${op}"/><path d="M138 98C140 88 139 80 135 74C131 76 129 80 129 86C129 92 131 96 134 100Z" fill="${col}" opacity="${op}"/>`;}
  if(hs.x)hairOver+=hs.x;
  // ── maglia ──
  const md=c.colDett,mt=c.maglia;
  let shirt='',under='';
  const body=`<path d="M20 214C24 178 56 162 100 162C144 162 176 178 180 214Z" fill="url(#mg)"/><path d="M50 182Q56 196 54 214M150 182Q144 196 146 214" stroke="${_lc(c.colMaglia,40)}" stroke-width="1.6" fill="none" opacity=".6"/>`;
  if(mt==='canotta'){under=`<path d="M20 214C24 180 50 166 82 163L118 163C150 166 176 180 180 214Z" fill="${_lc(sk,14)}"/>`;shirt=`<path d="M58 214C60 188 70 172 78 165L86 165Q100 182 114 165L122 165C130 172 140 188 142 214Z" fill="url(#mg)"/><path d="M86 165Q100 182 114 165" stroke="${md}" stroke-width="3" fill="none"/>`;}
  else if(mt==='felpa'){under=`<path d="M64 170C66 148 134 148 136 170Z" fill="${_lc(c.colMaglia,30)}"/>`;shirt=body+`<path d="M84 163Q100 176 116 163" stroke="${_lc(c.colMaglia,40)}" stroke-width="4" fill="none"/><path d="M100 172V214" stroke="${md}" stroke-width="2.4"/><path d="M92 170V190M108 170V190" stroke="${md}" stroke-width="1.8" stroke-linecap="round"/>`;}
  else{shirt=body;
    if(mt==='girocollo')shirt+=`<path d="M80 163Q100 180 120 163" stroke="${md}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    if(mt==='sport')shirt+=`<path d="M80 163Q100 180 120 163" stroke="${md}" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M40 176L70 166L66 214L40 214ZM160 176L130 166L134 214L160 214Z" fill="${md}" opacity=".85"/>`;
    if(mt==='scolloV')shirt+=`<path d="M82 162L100 188L118 162Z" fill="${_lc(sk,14)}"/><path d="M82 162L100 188L118 162" stroke="${md}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`;
    if(mt==='polo')shirt+=`<path d="M100 172V196" stroke="${_lc(c.colMaglia,40)}" stroke-width="2"/><circle cx="100" cy="181" r="1.8" fill="${md}"/><circle cx="100" cy="190" r="1.8" fill="${md}"/><path d="M82 160L100 172L92 182L77 166Z" fill="${md}"/><path d="M118 160L100 172L108 182L123 166Z" fill="${md}"/>`;
  }
  // ── viso ──
  const face=`M${L} 92C${L} 58 ${100-f.w*.62} 46 100 46C${100+f.w*.62} 46 ${R} 58 ${R} 92C${R} ${f.sq?126:116} ${100+f.jw} ${cy-6} 100 ${cy}C${100-f.jw} ${cy-6} ${L} ${f.sq?126:116} ${L} 92Z`;
  const ears=`<ellipse cx="${L+1}" cy="98" rx="7" ry="11" fill="${sk}"/><ellipse cx="${R-1}" cy="98" rx="7" ry="11" fill="${sk}"/><path d="M${L-1} 92Q${L-4} 98 ${L} 104M${R+1} 92Q${R+4} 98 ${R} 104" stroke="${_lc(sk,30)}" stroke-width="1.6" fill="none"/>`
    +(c.orecchini?`<circle cx="${L}" cy="110" r="2.6" fill="#f0c040"/><circle cx="${R}" cy="110" r="2.6" fill="#f0c040"/>`:'');
  const neck=`<path d="M86 ${cy-24}L86 163Q100 171 114 163L114 ${cy-24}Z" fill="${_lc(sk,16)}"/><ellipse cx="100" cy="${cy+4}" rx="16" ry="5" fill="${_lc(sk,42)}" opacity=".3" filter="url(#bl2)"/>`;
  // occhi
  const eye=(x)=>{const ir=c.occhi==='tondi'?3.8:c.occhi==='piccoli'?2.9:3.4;let w='',lid='';
    if(c.occhi==='tondi'){w=`<ellipse cx="${x}" cy="${E}" rx="6.6" ry="5.6" fill="#fff"/>`;lid=`<path d="M${x-6.6} ${E}Q${x} ${E-7.5} ${x+6.6} ${E}" stroke="#2b1d16" stroke-width="1.6" fill="none"/>`;}
    else if(c.occhi==='piccoli'){w=`<ellipse cx="${x}" cy="${E}" rx="5" ry="3.8" fill="#fff"/>`;lid=`<path d="M${x-5} ${E}Q${x} ${E-5} ${x+5} ${E}" stroke="#2b1d16" stroke-width="1.5" fill="none"/>`;}
    else if(c.occhi==='sottili'){w=`<path d="M${x-7} ${E+.5}Q${x} ${E-3.5} ${x+7} ${E+.5}Q${x} ${E+4} ${x-7} ${E+.5}Z" fill="#fff"/>`;lid=`<path d="M${x-7.5} ${E+.5}Q${x} ${E-4} ${x+7.5} ${E+.5}" stroke="#2b1d16" stroke-width="1.9" fill="none"/>`;}
    else{w=`<path d="M${x-7} ${E}Q${x} ${E-6} ${x+7} ${E}Q${x} ${E+5} ${x-7} ${E}Z" fill="#fff"/>`;lid=`<path d="M${x-7.4} ${E+.3}Q${x} ${E-6.6} ${x+7.4} ${E+.3}" stroke="#2b1d16" stroke-width="1.7" fill="none"/>`;}
    const id='e'+Math.round(x);
    return`<clipPath id="${id}">${w.replace('fill="#fff"','')}</clipPath>${w}<g clip-path="url(#${id})"><circle cx="${x}" cy="${E}" r="${ir}" fill="${c.colOcchi}"/><circle cx="${x}" cy="${E}" r="${ir*.48}" fill="#0b0b0d"/><circle cx="${x+1.1}" cy="${E-1.3}" r="${ir*.3}" fill="#fff"/></g>${lid}`;};
  const eyes=eye(100-ex)+eye(100+ex);
  // sopracciglia
  const bw={sottili:1.5,normali:2.6,folte:4,arcuate:2.4,dritte:3,angolate:2.8}[c.sopr]||2.6,B=E-11;
  const brow=(x,s)=>{const o=x+s*8.5,i=x-s*8.5;   // s=1 occhio destro: esterno a destra
    if(c.sopr==='arcuate')return`M${i} ${B+1}Q${x} ${B-6} ${o} ${B+1.5}`;
    if(c.sopr==='dritte'||c.sopr==='folte')return`M${i} ${B}Q${x} ${B-2} ${o} ${B+.5}`;
    if(c.sopr==='angolate')return`M${i} ${B+1.5}L${x+s*2} ${B-3}L${o} ${B+1}`;
    return`M${i} ${B+.5}Q${x} ${B-3.5} ${o} ${B+1}`;};
  const brows=`<path d="${brow(100-ex,-1)} ${brow(100+ex,1)}" stroke="${_lc(c.colBarba||hc,10)}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`;
  // naso
  const ns=_lc(sk,45);
  const nose={piccolo:`<path d="M97 111Q100 114 103 111" stroke="${ns}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`,
    medio:`<path d="M98.5 99Q95 110 96 112.5Q100 116 104 112.5" stroke="${ns}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`,
    grande:`<path d="M98 97Q92 112 93.5 115.5Q100 120 106.5 115.5Q108 112 104 110" stroke="${ns}" stroke-width="1.9" fill="none" stroke-linecap="round"/>`,
    aquilino:`<path d="M99 97Q102 103 100 108Q95 113 97 115.5Q100 117.5 104 115.5" stroke="${ns}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    largo:`<path d="M99 100Q97 109 95 111Q92 115 96 116Q100 118 104 116Q108 115 105 111" stroke="${ns}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`}[c.naso]||'';
  const noseSh=`<ellipse cx="101" cy="112" rx="6" ry="3" fill="${_lc(sk,22)}" opacity=".35"/>`;
  // bocca
  // bocca con le labbra: linea della bocca, labbro superiore sottile, inferiore più pieno con riflesso, angoli in ombra
  const M=Math.min(126,cy-14),P=v=>+v.toFixed(2);
  const qy=(x0,y0,q1,x1,y1,x)=>{const t=Math.max(0,Math.min(1,(x-x0)/(x1-x0)));return(1-t)*(1-t)*y0+2*t*(1-t)*q1+t*t*y1;};
  const bk=c.bocca||'sorriso',thin=bk==='sottile';
  const MG={sorriso:[88.5,111.5,M-1.4,M+4.6],aperto:[87.5,112.5,M-2,M+1.4],mezzo:[90,111,M+.2,M+2.4,M-3.2],serio:[91,109,M+.4,M+.9],sottile:[89,111,M-.6,M+3]}[bk]||[88.5,111.5,M-1.4,M+4.6];
  const [mxL,mxR]=MG,mHw=(mxR-mxL)/2,mc=(mxL+mxR)/2;
  const mLine=x=>qy(mxL,MG[2],MG[3],mxR,MG[4]!=null?MG[4]:MG[2],x);   // linea tra le labbra (per "aperto": bordo dei denti)
  const mOpen=x=>bk==='aperto'?qy(mxL,M-2,M+11,mxR,M-2,x):mLine(x);    // bordo alto del labbro inferiore
  const fr=(x,p)=>Math.pow(Math.max(0,1-Math.pow((x-mc)/mHw,2)),p);
  const UH=thin?1.5:2.5,LH=thin?2.2:3.7;
  const mUp=x=>mLine(x)-UH*fr(x,.7)+(Math.abs(x-mc)<2.2?.55*(1-Math.abs(x-mc)/2.2):0);   // bordo alto del labbro superiore (con l'arco di cupido)
  const mLow=x=>mOpen(x)+LH*fr(x,.6);                                                  // bordo basso del labbro inferiore
  const xs=Array.from({length:15},(_,i)=>mxL+(mxR-mxL)*i/14),pl=(f,a)=>a.map(x=>`${P(x)} ${P(f(x))}`).join('L');
  // colore delle labbra: la pelle spostata verso il rosa scuro
  const lipC=c.rossetto?'#b3263a':'#'+[1,3,5].map(i=>{const a=parseInt(sk.slice(i,i+2),16),b=parseInt('b8504a'.slice(i-1,i+1),16);return Math.round(a+(b-a)*.46).toString(16).padStart(2,'0');}).join('');
  const ms=_lc(sk,48);
  let mouth=``
    +`<path d="M${P(mc-1.2)} ${P(mUp(mc)-4.2)}L${P(mc-1.05)} ${P(mUp(mc-1.05)-.4)}M${P(mc+1.2)} ${P(mUp(mc)-4.2)}L${P(mc+1.05)} ${P(mUp(mc+1.05)-.4)}" stroke="${ms}" stroke-width=".8" opacity=".12"/>`;   // solco sopra il labbro
  if(bk==='aperto'){
    mouth+=`<path d="M${pl(mLine,xs)}L${pl(mOpen,[...xs].reverse())}Z" fill="#5a1d18"/>`
      +`<path d="M${pl(mLine,xs)}L${pl(x=>Math.min(mLine(x)+3.4,mOpen(x)),[...xs].reverse())}Z" fill="#f3efe7"/>`
      +`<path d="M${P(mc-4.2)} ${P(mLine(mc-4.2))}V${P(mLine(mc-4.2)+3)}M${P(mc)} ${P(mLine(mc)+.2)}V${P(mLine(mc)+3.2)}M${P(mc+4.2)} ${P(mLine(mc+4.2))}V${P(mLine(mc+4.2)+3)}" stroke="#d8d0c4" stroke-width=".5"/>`;
  }
  mouth+=`<path d="M${pl(mLine,xs)}L${pl(mUp,[...xs].reverse())}Z" fill="${_lc(lipC,16)}"/>`
    +`<path d="M${pl(mOpen,xs)}L${pl(mLow,[...xs].reverse())}Z" fill="${lipC}"/>`
    +`<ellipse cx="${P(mc)}" cy="${P(mOpen(mc)+LH*.45)}" rx="3.6" ry=".95" fill="#fff" opacity=".28"/>`
    +(bk==='aperto'?'':`<path d="M${pl(mLine,xs)}" stroke="#6b2a24" stroke-width="1.05" fill="none" stroke-linecap="round" opacity=".9"/>`)
    +`<circle cx="${P(mxL-.6)}" cy="${P(mLine(mxL))}" r="1.1" fill="${ms}" opacity=".35"/><circle cx="${P(mxR+.6)}" cy="${P(mLine(mxR))}" r="1.1" fill="${ms}" opacity=".35"/>`
    +`<ellipse cx="${P(mc)}" cy="${P(mLow(mc)+1.7)}" rx="5" ry="1.2" fill="${ms}" opacity=".18"/>`;   // ombra sotto il labbro
  // ── barba: segue la mascella, bordi "pelosi", trama dei peli, sfuma nella pelle sulle guance ──
  const X=d=>+(100+d).toFixed(2),jy=f.sq?126:116;
  defs+=`<filter id="fur2" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="7" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="1" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".45"/></filter>`
    +`<filter id="fur" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="4" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter>`
    +`<filter id="bl1" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".8"/></filter><filter id="bl2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.8"/></filter><filter id="bl4" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.5"/></filter>`
    +`<linearGradient id="bgr" x1="0" y1="90" x2="0" y2="${cy+20}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${_lc(bc,-14)}"/><stop offset=".55" stop-color="${bc}"/><stop offset="1" stop-color="${_lc(bc,28)}"/></linearGradient>`
    +`<pattern id="bst" width="7" height="6.6" patternUnits="userSpaceOnUse" patternTransform="rotate(11)">${[[.8,1.1,.45],[3.4,.6,.38],[5.6,2.2,.42],[2.1,3.5,.4],[4.6,4.6,.36],[6.3,5.6,.4],[1.2,5.8,.38],[3.9,2.7,.3]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${_lc(bc,10)}"/>`).join("")}</pattern>`
    +`<pattern id="bsn" width="9" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(7)"><path d="M1 .5l.6 3.2M6.2 .8l.7 3.4M2.2 4.8l.5 2.8M7.4 5.6l.3 2.2" stroke="${_lc(bc,34)}" stroke-width=".7" stroke-linecap="round" opacity=".5"/><path d="M3.6 2.2l.3 2.8M8 3.2l.4 2.4M5 5.4l.6 2.4" stroke="${_lc(bc,-30)}" stroke-width=".55" stroke-linecap="round" opacity=".35"/></pattern>`
    +`<linearGradient id="bmg" x1="0" y1="86" x2="0" y2="104" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="bmk"><rect width="200" height="220" fill="url(#bmg)"/></mask>`
    +`<clipPath id="fcl"><path d="${face}"/></clipPath>`;
  const bOut=e=>`M${L+1} 84L${L+1} 92C${+(L+1-e*.15).toFixed(2)} ${jy+e*.3} ${+(100-f.jw-e*.5).toFixed(2)} ${cy-6+e} 100 ${+(cy+e*1.05).toFixed(2)}C${+(100+f.jw+e*.5).toFixed(2)} ${cy-6+e} ${+(R-1+e*.15).toFixed(2)} ${jy+e*.3} ${R-1} 92L${R-1} 84`;
  const bIn=`C${R-5} 96 ${R-9} 106 ${R-13} 112C${R-17} 116 ${X(14)} ${M-6} ${X(12)} ${M-8}C${X(8)} ${M-11} ${X(3)} ${M-10.5} 100 ${M-9.5}C${X(-3)} ${M-10.5} ${X(-8)} ${M-11} ${X(-12)} ${M-8}C${X(-14)} ${M-6} ${L+17} 116 ${L+13} 112C${L+9} 106 ${L+5} 96 ${L+1} 84Z`;
  const bFull=e=>bOut(e)+bIn;
  // baffi e pizzetto costruiti sulla bocca: seguono la curva del sorriso senza toccarla
  const mTop=mUp,mh=mHw+1.6;
  const mustPts=[];for(let i=0;i<=14;i++)mustPts.push(mxL-1.6+(mxR-mxL+3.2)*i/14);
  const mBot=x=>mTop(Math.max(mxL,Math.min(mxR,x)))-1.1,mTh=x=>2+4.4*Math.max(0,1-Math.pow((x-mc)/mh,2));
  const must='M'+mustPts.map(x=>`${P(x)} ${P(mBot(x))}`).join('L')+'L'+[...mustPts].reverse().map(x=>`${P(x)} ${P(mBot(x)-mTh(x)-(Math.abs(x-mc)<1.2?-.6:0))}`).join('L')+'Z';
  const gTop=x=>mLow(x)+2.2,gy0=gTop(100),gBot=Math.min(cy-3.4,gy0+5.6),gL=X(-5.2),gR=X(5.2);
  const goat=`M${gL} ${P(gTop(gL))}`+[-2.6,0,2.6,5.2].map(d=>`L${X(d)} ${P(gTop(X(d)))}`).join('')+`C${X(6.2)} ${P(gTop(gR)+2.4)} ${X(5.4)} ${P(gBot-2)} ${X(3.4)} ${P(gBot-.4)}C${X(1.8)} ${P(gBot+.5)} ${X(-1.8)} ${P(gBot+.5)} ${X(-3.4)} ${P(gBot-.4)}C${X(-5.4)} ${P(gBot-2)} ${X(-6.2)} ${P(gTop(gL)+2.4)} ${gL} ${P(gTop(gL))}Z`;
  const soul='';
  // a cerchio: baffo e pizzetto uniti da due strisce sottili che girano attorno agli angoli della bocca
  const rs=s=>{const xe=s<0?mxL:mxR,o=s*1.4,w=s*1.9,gx=X(s*4.6),gy=gTop(gx);return`M${P(xe+o)} ${P(mBot(xe)-.6)}C${P(xe+o+s*1.6)} ${P(mBot(xe)+5)} ${P(xe+o)} ${P(gy+2.6)} ${gx} ${P(gy+1)}L${gx} ${P(gy+2.8)}C${P(xe+o+w)} ${P(gy+4.2)} ${P(xe+o+w+s*1.6)} ${P(mBot(xe)+5)} ${P(xe+o+w)} ${P(mBot(xe)-.6)}Z`;};
  const ring=rs(-1)+rs(1);
  const strap=bOut(1)+`C${R-6} 96 ${R-7} 110 ${R-9} 118C${R-12} 128 ${X(f.jw-4)} ${cy-10} 100 ${cy-3}C${X(-f.jw+4)} ${cy-10} ${L+12} 128 ${L+9} 118C${L+7} 110 ${L+6} 96 ${L+1} 84Z`;
  const burns=`M${L+1} 82L${L+7.5} 82C${L+8} 92 ${L+8.5} 102 ${L+7} 112L${L+1.5} 108ZM${R-1} 82L${R-7.5} 82C${R-8} 92 ${R-8.5} 102 ${R-7} 112L${R-1.5} 108Z`;
  // dense = barba piena con trama; stub = solo pelo corto (puntini)
  const dense=(d,op=1)=>`<g filter="url(#fur)" opacity="${op}"><path d="${d}" fill="url(#bgr)"/><path d="${d}" fill="url(#bsn)"/></g>`;
  // pezzi piccoli (baffi, pizzetto): bordo morbido senza deformarli
  const fine=(d,op=.9,fl="url(#bgr)")=>`<g filter="url(#fur2)" opacity="${op}"><path d="${d}" fill="${fl}"/><path d="${d}" fill="url(#bsn)"/></g>`;
  defs+=`<linearGradient id="bgg" x1="0" y1="${P(gy0-1)}" x2="0" y2="${P(gBot)}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${bc}" stop-opacity=".35"/><stop offset=".45" stop-color="${bc}" stop-opacity=".9"/><stop offset="1" stop-color="${_lc(bc,18)}"/></linearGradient>`;
  const stub=(d,op)=>`<path d="${d}" fill="${bc}" opacity="${op*.28}" filter="url(#bl1)"/><path d="${d}" fill="url(#bst)" opacity="${op}"/>`;
  const chinSh=e=>`<path d="M${X(-f.jw+2)} ${cy-8+e}Q100 ${cy+6+e*1.1} ${X(f.jw-2)} ${cy-8+e}" stroke="#000" stroke-width="5" fill="none" opacity=".2" filter="url(#bl2)"/>`;
  const bt=c.barba||'no';
  const beard={no:'',
    accenno:`<g mask="url(#bmk)">${stub(bFull(0),.75)}</g>`,
    corta:`<g mask="url(#bmk)">${stub(bFull(0),.9)}${dense(bFull(1),.6)}</g>${fine(must,.85)}`,
    incolta:`<g mask="url(#bmk)">${stub(bFull(1),1)}${dense(bFull(3),.75)}</g>${fine(must,.95)}`,
    piena:`<g mask="url(#bmk)">${stub(bFull(1),1)}${dense(bFull(4))}${chinSh(4)}</g>${fine(must)}`,
    lunga:`<g mask="url(#bmk)">${stub(bFull(2),1)}${dense(bFull(20))}${chinSh(20)}</g>${fine(must)}`,
    pizzetto:fine(goat,.92,"url(#bgg)"),
    cerchio:fine(must)+fine(ring,.8)+fine(goat,.92,"url(#bgg)"),
    baffi:fine(must),
    baffiPizzetto:fine(must)+fine(goat,.92,"url(#bgg)"),
    mento:dense(strap),
    basette:dense(burns,.95)}[bt]||'';
  // ── occhiali: montatura sottile, lenti con riflesso, ombra sul viso ──
  const gx1=+(100-ex).toFixed(2),gx2=+(100+ex).toFixed(2),arm=(dy=0)=>`M${gx1-10.5} ${E-2+dy}L${L+1} ${E-4}M${gx2+10.5} ${E-2+dy}L${R-1} ${E-4}`;
  defs+=`<linearGradient id="lens" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".24"/><stop offset=".42" stop-color="#fff" stop-opacity=".04"/><stop offset=".5" stop-color="#fff" stop-opacity=".16"/><stop offset=".62" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`
    +`<linearGradient id="dlens" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0f12"/><stop offset="1" stop-color="#3b4048"/></linearGradient>`
    +`<linearGradient id="tort" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a4a26"/><stop offset=".5" stop-color="#3a2212"/><stop offset="1" stop-color="#8a5a30"/></linearGradient>`
    +`<linearGradient id="slens" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1e3a8a"/><stop offset=".5" stop-color="#6d28d9"/><stop offset="1" stop-color="#ea580c"/></linearGradient>`;
  const gSh=s=>`<g transform="translate(.8 2.4)" opacity=".22" filter="url(#bl1)">${s}</g>`;
  const lensR=(x,w,h,r)=>`<rect x="${x-w/2}" y="${E-h/2-1}" width="${w}" height="${h}" rx="${r}"/>`;
  const gl=c.occhiali||'no';
  const glasses={no:'',
    tondi:gSh(`<g fill="none" stroke="#000" stroke-width="2"><circle cx="${gx1}" cy="${E}" r="9.6"/><circle cx="${gx2}" cy="${E}" r="9.6"/></g>`)
      +`<circle cx="${gx1}" cy="${E}" r="9.6" fill="url(#lens)"/><circle cx="${gx2}" cy="${E}" r="9.6" fill="url(#lens)"/><g fill="none" stroke="url(#tort)" stroke-width="2.1"><circle cx="${gx1}" cy="${E}" r="9.6"/><circle cx="${gx2}" cy="${E}" r="9.6"/><path d="M${gx1+9.6} ${E-1.6}Q100 ${E-5.5} ${gx2-9.6} ${E-1.6}${arm()}"/></g>`,
    rett:gSh(`<g fill="none" stroke="#000" stroke-width="2.4">${lensR(gx1,21,14,3.5)}${lensR(gx2,21,14,3.5)}</g>`)
      +`<g fill="url(#lens)">${lensR(gx1,21,14,3.5)}${lensR(gx2,21,14,3.5)}</g><g fill="none" stroke="#16181d" stroke-width="2.3">${lensR(gx1,21,14,3.5)}${lensR(gx2,21,14,3.5)}<path d="M${gx1+10.5} ${E-2.5}Q100 ${E-6} ${gx2-10.5} ${E-2.5}${arm()}"/></g><path d="M${gx1-8} ${E-6.6}H${gx1+3}M${gx2-8} ${E-6.6}H${gx2+3}" stroke="#fff" stroke-width=".6" opacity=".35"/>`,
    meta:gSh(`<path d="M${gx1-10.5} ${E-6}Q${gx1} ${E-8.5} ${gx1+10.5} ${E-6}M${gx2-10.5} ${E-6}Q${gx2} ${E-8.5} ${gx2+10.5} ${E-6}" stroke="#000" stroke-width="3" fill="none"/>`)
      +`<g fill="url(#lens)">${lensR(gx1,21,13,4)}${lensR(gx2,21,13,4)}</g><g fill="none" stroke="#9aa3ad" stroke-width=".7" opacity=".8"><path d="M${gx1-10.5} ${E-3}V${E+3}Q${gx1-10.5} ${E+5.5} ${gx1-7} ${E+5.5}H${gx1+7}Q${gx1+10.5} ${E+5.5} ${gx1+10.5} ${E+2}"/><path d="M${gx2-10.5} ${E-3}V${E+3}Q${gx2-10.5} ${E+5.5} ${gx2-7} ${E+5.5}H${gx2+7}Q${gx2+10.5} ${E+5.5} ${gx2+10.5} ${E+2}"/></g><path d="M${gx1-10.5} ${E-6}Q${gx1} ${E-8.5} ${gx1+10.5} ${E-6}M${gx2-10.5} ${E-6}Q${gx2} ${E-8.5} ${gx2+10.5} ${E-6}" stroke="#1a1410" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${gx1+10.5} ${E-5}Q100 ${E-7.5} ${gx2-10.5} ${E-5}${arm(-3)}" stroke="#9aa3ad" stroke-width="1.1" fill="none"/>`,
    sole:gSh(`<g fill="#000">${lensR(gx1,23,15,6)}${lensR(gx2,23,15,6)}</g>`)
      +`<g fill="url(#dlens)">${lensR(gx1,23,15,6)}${lensR(gx2,23,15,6)}</g><g fill="none" stroke="#0b0b0b" stroke-width="2">${lensR(gx1,23,15,6)}${lensR(gx2,23,15,6)}<path d="M${gx1+11.5} ${E-3.5}Q100 ${E-7} ${gx2-11.5} ${E-3.5}${arm()}"/></g><path d="M${gx1-8} ${E-3}L${gx1-1} ${E-6.5}M${gx2-7} ${E-3}L${gx2} ${E-6.5}" stroke="#fff" stroke-width="1.3" opacity=".32" stroke-linecap="round"/>`,
    aviator:gSh(`<g fill="#000"><path d="M${gx1-11} ${E-7}H${gx1+10}C${gx1+11} ${E+1} ${gx1+6} ${E+8} ${gx1-2} ${E+8}C${gx1-9} ${E+8} ${gx1-12} ${E+1} ${gx1-11} ${E-7}Z"/><path d="M${gx2+11} ${E-7}H${gx2-10}C${gx2-11} ${E+1} ${gx2-6} ${E+8} ${gx2+2} ${E+8}C${gx2+9} ${E+8} ${gx2+12} ${E+1} ${gx2+11} ${E-7}Z"/></g>`)
      +`<g fill="url(#dlens)" stroke="#c9a54a" stroke-width="1.2"><path d="M${gx1-11} ${E-7}H${gx1+10}C${gx1+11} ${E+1} ${gx1+6} ${E+8} ${gx1-2} ${E+8}C${gx1-9} ${E+8} ${gx1-12} ${E+1} ${gx1-11} ${E-7}Z"/><path d="M${gx2+11} ${E-7}H${gx2-10}C${gx2-11} ${E+1} ${gx2-6} ${E+8} ${gx2+2} ${E+8}C${gx2+9} ${E+8} ${gx2+12} ${E+1} ${gx2+11} ${E-7}Z"/></g><path d="M${gx1+10} ${E-6}Q100 ${E-9} ${gx2-10} ${E-6}M${gx1+9} ${E-3}Q100 ${E-5} ${gx2-9} ${E-3}${arm(-4)}" stroke="#c9a54a" stroke-width="1.1" fill="none"/><path d="M${gx1-7} ${E-4}L${gx1} ${E-6}M${gx2-6} ${E-4}L${gx2+1} ${E-6}" stroke="#fff" stroke-width="1.2" opacity=".3" stroke-linecap="round"/>`,
    sport:gSh(`<path d="M${L+2} ${E-4}C${gx1-6} ${E-11} ${gx2+6} ${E-11} ${R-2} ${E-4}L${R-4} ${E+4}C${gx2} ${E+9} ${X(4)} ${E+5} 100 ${E+1}C${X(-4)} ${E+5} ${gx1} ${E+9} ${L+4} ${E+4}Z" fill="#000"/>`)
      +`<path d="M${L+2} ${E-4}C${gx1-6} ${E-11} ${gx2+6} ${E-11} ${R-2} ${E-4}L${R-4} ${E+4}C${gx2} ${E+9} ${X(4)} ${E+5} 100 ${E+1}C${X(-4)} ${E+5} ${gx1} ${E+9} ${L+4} ${E+4}Z" fill="url(#slens)" opacity=".93"/><path d="M${L+2} ${E-4}C${gx1-6} ${E-11} ${gx2+6} ${E-11} ${R-2} ${E-4}" stroke="#111" stroke-width="2.6" fill="none"/><path d="M${gx1-5} ${E-4}C${gx1} ${E-7} ${gx2} ${E-7} ${gx2+5} ${E-4}" stroke="#fff" stroke-width="1.1" fill="none" opacity=".4"/>`}[gl]||'';
  // ── copricapi: seguono la testa, hanno volume e ombre, nascondono i capelli che ci stanno sotto ──
  const tc=c.colTesta||'#ffffff',tdk=_lc(tc,45),tlt=_lc(tc,-38),tt=c.testa||'no';
  defs+=`<linearGradient id="hatg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tlt}"/><stop offset=".45" stop-color="${tc}"/><stop offset="1" stop-color="${tdk}"/></linearGradient>`
    +`<linearGradient id="bandg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tlt}"/><stop offset=".5" stop-color="${tc}"/><stop offset="1" stop-color="${tdk}"/></linearGradient>`
    +`<linearGradient id="brg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${_lc(tc,-12)}"/><stop offset="1" stop-color="${_lc(tc,30)}"/></linearGradient>`;
  const hatLine={cappello:79,rovescio:79,bandana:73,berretto:84,pescatore:80}[tt]||0;
  if(hatLine)defs+=`<clipPath id="hcl"><rect x="0" y="${hatLine}" width="200" height="220"/></clipPath>`;
  const crown=`M${L-3} 80C${L-5} 48 ${X(-20)} 30 100 29C${X(20)} 30 ${R+5} 48 ${R+3} 80C${R-12} 74 ${L+12} 74 ${L-3} 80Z`;
  const crownDet=`<g stroke="${tdk}" stroke-width=".9" fill="none" opacity=".6"><path d="M100 30C${X(-12)} 42 ${X(-18)} 60 ${X(-20)} 76"/><path d="M100 30V74"/><path d="M100 30C${X(12)} 42 ${X(18)} 60 ${X(20)} 76"/></g><g stroke="${tlt}" stroke-width=".5" fill="none" opacity=".55" stroke-dasharray="1.2 1.3"><path d="M98.4 32C${X(-13.5)} 44 ${X(-19.5)} 60 ${X(-21.5)} 76"/><path d="M101.6 32C${X(13.5)} 44 ${X(19.5)} 60 ${X(21.5)} 76"/></g><circle cx="100" cy="30" r="2.8" fill="${tdk}"/><circle cx="99.3" cy="29.3" r="1" fill="${tlt}" opacity=".8"/><circle cx="${X(-11)}" cy="50" r=".9" fill="${tdk}"/><circle cx="${X(11)}" cy="50" r=".9" fill="${tdk}"/><path d="M${L-2} 79C${L+12} 73.5 ${R-12} 73.5 ${R+2} 79" stroke="#000" stroke-width="2.4" fill="none" opacity=".22" filter="url(#bl1)"/>`;
  const logo=`<circle cx="100" cy="60" r="5.2" fill="${_lc(tc,-60)}" opacity=".85"/><path d="M96.6 60.4l2.4 2.2 4.2-4.6" stroke="${tdk}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const brim=`M${L-2} 79C${L+12} 73.5 ${R-12} 73.5 ${R+2} 79C${R+8} 83 ${R+9} 89 ${R+5} 92C${R-14} 85.5 ${L+14} 85.5 ${L-5} 92C${L-9} 89 ${L-8} 83 ${L-2} 79Z`;
  const brimDet=`<path d="${brim}" fill="url(#brg)"/><path d="M${L-5} 92C${L+14} 85.5 ${R-14} 85.5 ${R+5} 92" stroke="${_lc(tc,70)}" stroke-width="1.6" fill="none"/><path d="M${L+1} 82.5C${L+14} 78 ${R-14} 78 ${R-1} 82.5" stroke="${tlt}" stroke-width=".55" fill="none" opacity=".6" stroke-dasharray="1.2 1.3"/>`;
  // ombre che il copricapo proietta sul viso
  const faceSh={cappello:`<ellipse cx="100" cy="90" rx="${f.w+6}" ry="8" fill="#1a0e08" opacity=".38" filter="url(#bl4)"/>`,visiera:`<ellipse cx="100" cy="90" rx="${f.w+6}" ry="8" fill="#1a0e08" opacity=".38" filter="url(#bl4)"/>`,pescatore:`<ellipse cx="100" cy="84" rx="${f.w+8}" ry="7" fill="#1a0e08" opacity=".32" filter="url(#bl4)"/>`,
    rovescio:`<ellipse cx="100" cy="80" rx="${f.w}" ry="3.5" fill="#1a0e08" opacity=".25" filter="url(#bl2)"/>`,berretto:`<ellipse cx="100" cy="86" rx="${f.w}" ry="3.5" fill="#1a0e08" opacity=".25" filter="url(#bl2)"/>`,bandana:`<ellipse cx="100" cy="75" rx="${f.w}" ry="3" fill="#1a0e08" opacity=".22" filter="url(#bl2)"/>`,
    fascia:`<path d="M${L} 79C${L+10} 72 ${R-10} 72 ${R} 79" stroke="#1a0e08" stroke-width="4" fill="none" opacity=".28" filter="url(#bl2)"/>`,fasciaLarga:`<path d="M${L} 81C${L+10} 74 ${R-10} 74 ${R} 81" stroke="#1a0e08" stroke-width="4" fill="none" opacity=".28" filter="url(#bl2)"/>`}[tt]||'';
  const ribs=(x0,x1,y0,y1,n,col,op)=>`<g stroke="${col}" stroke-width=".6" opacity="${op}">${Array.from({length:n},(_,i)=>`<path d="M${(x0+(x1-x0)*i/(n-1)).toFixed(1)} ${y0}V${y1}"/>`).join('')}</g>`;
  let head='';
  if(tt==='cappello')head=`<path d="${crown}" fill="url(#hatg)"/>${crownDet}${logo}${brimDet}`;
  else if(tt==='rovescio')head=`<path d="${crown}" fill="url(#hatg)"/>${crownDet}<path d="M89 80C89.5 69 110.5 69 111 80Z" fill="url(#hg)"/><path d="M89 80C89.5 69 110.5 69 111 80" stroke="${tdk}" stroke-width="1.4" fill="none"/><path d="M87 77.5H113V81H87Z" fill="${tdk}"/><rect x="97" y="76.6" width="6" height="5.2" rx="1" fill="#cfcfcf"/><rect x="98.3" y="77.8" width="3.4" height="2.8" rx=".5" fill="${tdk}"/>`;
  else if(tt==='visiera'){const band=`M${L-2} 72C${L+10} 63 ${R-10} 63 ${R+2} 72L${R+2} 80C${R-10} 72 ${L+10} 72 ${L-2} 80Z`;defs+=`<clipPath id="vcl"><path d="${band}"/></clipPath>`;
    head=`<path d="${band}" fill="url(#bandg)"/><g clip-path="url(#vcl)">${ribs(L-2,R+2,60,82,30,tdk,.25)}</g>${brimDet}`;}
  else if(tt==='fascia'||tt==='fasciaLarga'){const t0=tt==='fascia'?61:54,b0=tt==='fascia'?72:73;const band=`M${L-2} ${t0+9}C${L+10} ${t0} ${R-10} ${t0} ${R+2} ${t0+9}L${R+2} ${b0+8}C${R-10} ${b0} ${L+10} ${b0} ${L-2} ${b0+8}Z`;
    defs+=`<clipPath id="bndc"><path d="${band}"/></clipPath>`;
    head=`<path d="${band}" fill="url(#bandg)"/><g clip-path="url(#bndc)">${ribs(L-2,R+2,t0-2,b0+10,34,tdk,.28)}${tt==='fasciaLarga'?`<rect x="93" y="${t0+4}" width="14" height="${b0-t0-3}" rx="2" fill="${_lc(tc,-60)}" opacity=".7"/>`:''}</g><path d="M${L-2} ${t0+9}C${L+10} ${t0} ${R-10} ${t0} ${R+2} ${t0+9}" stroke="${tlt}" stroke-width="1" fill="none" opacity=".7"/><path d="M${L-2} ${b0+8}C${L+10} ${b0} ${R-10} ${b0} ${R+2} ${b0+8}" stroke="${tdk}" stroke-width="1.1" fill="none" opacity=".8"/>`;}
  else if(tt==='bandana'){const cap=`M${L-2} 75C${L-4} 46 ${X(-20)} 30 100 30C${X(20)} 30 ${R+4} 46 ${R+2} 75C${R-12} 69 ${L+12} 69 ${L-2} 75Z`;defs+=`<clipPath id="bdc"><path d="${cap}"/></clipPath>`;
    head=`<path d="M${R} 66C${R+8} 66 ${R+14} 70 ${R+12} 78L${R+18} 92L${R+10} 90L${R+6} 80Z" fill="${tdk}"/><path d="M${R+2} 70C${R+12} 74 ${R+18} 84 ${R+16} 96L${R+9} 92Z" fill="${_lc(tc,25)}"/><path d="${cap}" fill="url(#hatg)"/><g clip-path="url(#bdc)" fill="none" stroke="${_lc(tc,-70)}" stroke-width="1" opacity=".7">${[[78,44],[96,38],[114,42],[86,58],[104,52],[122,58],[72,62],[128,66],[96,66]].map(([x,y])=>`<path d="M${x} ${y}c2.5-3 6-1 4.5 2c-1.5 2.5-5 2-4.5-2zM${x+5} ${y+3}l2 2"/>`).join('')}</g><path d="M${L-2} 75C${L+12} 69 ${R-12} 69 ${R+2} 75" stroke="${tdk}" stroke-width="1.6" fill="none"/><circle cx="${R+3}" cy="70" r="4" fill="${tdk}"/>`;}
  else if(tt==='berretto'){const dome=`M${L-4} 86C${L-8} 46 ${X(-22)} 22 100 22C${X(22)} 22 ${R+8} 46 ${R+4} 86Z`,cuff=`M${L-5} 70C${L+10} 62 ${R-10} 62 ${R+5} 70L${R+5} 88C${R-10} 80 ${L+10} 80 ${L-5} 88Z`;defs+=`<clipPath id="dmc"><path d="${dome}"/></clipPath><clipPath id="cfc"><path d="${cuff}"/></clipPath>`;
    head=`<path d="${dome}" fill="url(#hatg)"/><g clip-path="url(#dmc)" stroke="${tdk}" stroke-width=".9" fill="none" opacity=".3">${Array.from({length:7},(_,j)=>`<path d="${Array.from({length:18},(_,i)=>`M${L-6+i*((R-L+12)/17)} ${30+j*6.5}l2 2.4l2-2.4`).join('')}"/>`).join('')}</g><path d="${cuff}" fill="url(#bandg)"/><g clip-path="url(#cfc)">${ribs(L-5,R+5,58,92,32,tdk,.45)}</g><circle cx="100" cy="21" r="9" fill="${tlt}" filter="url(#fur)"/><circle cx="98" cy="19" r="4" fill="#fff" opacity=".18"/>`;}
  else if(tt==='pescatore'){const cr=`M${L-1} 78C${L-2} 48 ${X(-18)} 32 100 32C${X(18)} 32 ${R+2} 48 ${R+1} 78Z`,bb=`M${L-12} 90C${L-7} 74 ${R+7} 74 ${R+12} 90C${R-4} 83 ${L+4} 83 ${L-12} 90Z`;
    head=`<path d="${cr}" fill="url(#hatg)"/><path d="M${L} 70C${L+10} 65 ${R-10} 65 ${R} 70" stroke="${tdk}" stroke-width="2.4" fill="none" opacity=".5"/><path d="${bb}" fill="url(#brg)"/><path d="M${L-12} 90C${L+4} 83 ${R-4} 83 ${R+12} 90" stroke="${_lc(tc,70)}" stroke-width="1.4" fill="none"/><path d="M${L-8} 86C${L+6} 79 ${R-6} 79 ${R+8} 86" stroke="${tlt}" stroke-width=".55" fill="none" opacity=".6" stroke-dasharray="1.2 1.3"/>`;}
  // dettagli del viso
  const extra=(c.guance?`<ellipse cx="${100-ex-2}" cy="110" rx="7" ry="4.5" fill="#ff7b7b" opacity=".25"/><ellipse cx="${100+ex+2}" cy="110" rx="7" ry="4.5" fill="#ff7b7b" opacity=".25"/>`:'')
    +(c.lentiggini?[[-22,106],[-17,109],[-24,111],[-14,104],[22,106],[17,109],[24,111],[14,104],[-3,104],[4,105]].map(([dx,y])=>`<circle cx="${100+dx}" cy="${y}" r="1.1" fill="#a0603a" opacity=".55"/>`).join(''):'')
    +(c.rughe?`<path d="M84 66Q100 62 116 66M86 71Q100 67 114 71" stroke="${_lc(sk,30)}" stroke-width="1.1" fill="none" opacity=".55"/><path d="M90 116Q86 124 89 130M110 116Q114 124 111 130" stroke="${_lc(sk,32)}" stroke-width="1.3" fill="none" opacity=".55"/><path d="M${100-ex-10} ${E+1}l-4 -2M${100-ex-10} ${E+3}l-4 1M${100+ex+10} ${E+1}l4 -2M${100+ex+10} ${E+3}l4 1" stroke="${_lc(sk,32)}" stroke-width="1" opacity=".6"/>`:'')
    +(c.neo?`<circle cx="${100+ex+6}" cy="116" r="1.6" fill="#5a3a24"/>`:'');
  const shine=hs.shine?`<ellipse cx="88" cy="58" rx="12" ry="6" fill="#fff" opacity=".18" transform="rotate(-20 88 58)"/>`:'';
  const cfg=`<desc>LAV:${encodeURIComponent(JSON.stringify(c))}</desc>`;
  return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="18 16 164 164">${cfg}<defs>${defs}</defs><rect x="0" y="0" width="200" height="200" fill="url(#bg)"/>`
    +sx(hairBack)+neck+`<g transform="translate(0 -7)">${under}${shirt}</g>`+ears+`<path d="${face}" fill="url(#sk)"/>`+shine+extra+noseSh+beard+nose+mouth+eyes+brows+(faceSh?`<g clip-path="url(#fcl)">${faceSh}</g>`:'')+(hatLine?`<g clip-path="url(#hcl)">${sx(hairFront+hairOver)}</g>`:sx(hairFront+hairOver))+glasses+head+`</svg>`;
}
