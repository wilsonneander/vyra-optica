// Desenhos em SVG do Gold Íris, gerados em código (no build e no navegador):
// olho com cílios fio a fio, sobrancelha fio a fio, perna (laser) e a silhueta do mapa do corpo.
// Roda no Node (build, para o HTML já sair desenhado) e no navegador (provador, comparador e o olho da capa).
(function (raiz) {
  const r1 = (v) => Math.round(v * 10) / 10;
  // gerador pseudoaleatório com semente, para o desenho sair sempre igual
  const semente = (s) => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };

  // ponto e tangente de uma Bézier cúbica
  const bez = (p, t) => {
    const u = 1 - t;
    return [
      u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
      u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
    ];
  };
  const tan = (p, t) => {
    const u = 1 - t;
    const dx = 3 * u * u * (p[1][0] - p[0][0]) + 6 * u * t * (p[2][0] - p[1][0]) + 3 * t * t * (p[3][0] - p[2][0]);
    const dy = 3 * u * u * (p[1][1] - p[0][1]) + 6 * u * t * (p[2][1] - p[1][1]) + 3 * t * t * (p[3][1] - p[2][1]);
    const l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l];
  };
  const cub = (p) => `M${r1(p[0][0])} ${r1(p[0][1])}C${r1(p[1][0])} ${r1(p[1][1])} ${r1(p[2][0])} ${r1(p[2][1])} ${r1(p[3][0])} ${r1(p[3][1])}`;

  // ---------- olho (viewBox 0 0 480 320) ----------
  const CANTO_I = [92, 214], CANTO_E = [402, 200];
  const palpebra = (a) => [CANTO_I, [150, 270 - 166 * a], [318, 262 - 168 * a], CANTO_E];
  const PALP_BAIXO = [CANTO_I, [160, 270], [322, 262], CANTO_E];

  // comprimento do fio pela posição t (0 = canto interno, 1 = canto externo) e pelo estilo
  const COMP = {
    antes: (t) => 13 + 8 * Math.sin(Math.PI * t),
    natural: (t) => 26 + 9 * Math.sin(Math.PI * t) + 6 * t,
    boneca: (t) => 24 + 26 * Math.pow(Math.sin(Math.PI * t), 1.4),
    gatinho: (t) => 20 + 34 * Math.pow(t, 1.5),
    volume: (t) => 27 + 19 * Math.pow(t, 1.2) + 8 * Math.sin(Math.PI * t),
    lifting: (t) => 24 + 8 * Math.sin(Math.PI * t) + 4 * t,
  };
  // curvatura: quanto o fio dobra para cima, e onde (L dobra perto da raiz)
  const CURVA = { C: [0.32, 0.6], D: [0.5, 0.55], L: [0.62, 0.28] };

  function cilios(o, a, rnd) {
    const p = palpebra(a);
    const estilo = o.estilo || 'natural';
    const comp = COMP[estilo] || COMP.natural;
    const escala = (o.comp || 1) * (a < 0.3 ? 0.55 : 1);
    const [curl, onde] = CURVA[o.curva || 'C'];
    const n = estilo === 'antes' ? 34 : estilo === 'volume' ? 46 : 58;
    const leque = estilo === 'volume' ? 4 : estilo === 'boneca' && o.hibrido ? 2 : 1;
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = 0.06 + (i / (n - 1)) * 0.92 + (rnd() - 0.5) * 0.012;
      const [x, y] = bez(p, t);
      const [tx, ty] = tan(p, t);
      // normal para fora (para cima com o olho aberto); fechado, os fios caem para baixo
      let nx = ty, ny = -tx;
      if (ny > 0) { nx = -nx; ny = -ny; }
      const abre = a >= 0.3 ? 1 : -1;
      // os fios abrem em leque: os de dentro inclinam para o nariz, os de fora para a têmpora
      const ang = Math.atan2(ny * abre, nx) + (t - 0.45) * (estilo === 'lifting' ? 0.35 : 0.55) * abre;
      const L = comp(t) * escala * (estilo === 'antes' ? 0.85 + rnd() * 0.3 : 0.94 + rnd() * 0.12);
      for (let k = 0; k < leque; k++) {
        const ab = leque > 1 ? (k - (leque - 1) / 2) * 0.09 : 0;
        const dx = Math.cos(ang + ab), dy = Math.sin(ang + ab);
        // dobra: o fio sai na direção da normal e a ponta sobe (lifting dobra mais)
        // o fio sai na normal (controle perto da raiz) e a ponta gira para o lado de fora e para cima
        const dobra = (estilo === 'lifting' ? curl + 0.3 : curl) * abre;
        const lado = t - 0.42;
        const giro = (lado > 0 ? 1 : -1) * (0.25 + Math.abs(lado) * 0.9) * (0.6 + dobra);
        const cx = x + dx * L * onde, cy = y + dy * L * onde;
        const fx = x + Math.cos(ang + ab + giro) * L * 0.92, fy = y + Math.sin(ang + ab + giro) * L * 0.92 - dobra * L * 0.35 * abre;
        const w = estilo === 'antes' ? 1.3 : leque > 1 ? 1.05 : 1.7;
        const op = estilo === 'antes' ? 0.55 + rnd() * 0.25 : 0.88;
        out.push(`<path d="M${r1(x)} ${r1(y)}Q${r1(cx)} ${r1(cy)} ${r1(fx)} ${r1(fy)}" stroke-width="${w}" opacity="${r1(op)}"/>`);
      }
    }
    // cílios de baixo, curtos e claros
    if (a >= 0.3) {
      for (let i = 0; i < 16; i++) {
        const t = 0.3 + (i / 15) * 0.64;
        const [x, y] = bez(PALP_BAIXO, t);
        const L = (estilo === 'antes' ? 6 : 8) + 6 * t + rnd() * 3;
        const ang = Math.PI / 2 + (t - 0.55) * 0.9;
        out.push(`<path d="M${r1(x)} ${r1(y + 2)}l${r1(Math.cos(ang) * L)} ${r1(Math.sin(ang) * L)}" stroke-width=".9" opacity=".45"/>`);
      }
    }
    return out.join('');
  }

  // ---------- sobrancelha ----------
  // linha central: cabeça (canto do nariz), ponto alto do arco e cauda, com a espessura em cada ponto
  const FORMAS = {
    antes: { pts: [[112, 84], [190, 60], [300, 52], [404, 78]], esp: [30, 26, 24, 12], bagunca: true },
    arco: { pts: [[116, 80], [196, 52], [316, 34], [410, 70]], esp: [26, 22, 14, 4] },
    reta: { pts: [[116, 78], [206, 62], [320, 54], [410, 68]], esp: [24, 21, 15, 4] },
    ascendente: { pts: [[118, 84], [210, 54], [330, 22], [412, 58]], esp: [24, 20, 13, 3.5] },
    lamination: { pts: [[116, 80], [196, 48], [316, 34], [410, 68]], esp: [32, 28, 18, 5], penteada: true },
  };
  function sobrancelha(forma, rnd, henna) {
    const F = FORMAS[forma] || FORMAS.arco;
    const p = F.pts;
    const out = [];
    const espessura = (t) => {
      const e = F.esp;
      if (t < 1 / 3) return e[0] + (e[1] - e[0]) * t * 3;
      if (t < 2 / 3) return e[1] + (e[2] - e[1]) * (t - 1 / 3) * 3;
      return e[2] + (e[3] - e[2]) * (t - 2 / 3) * 3;
    };
    // contorno preenchido (henna) para marcar o desenho
    if (henna) {
      const cima = [], baixo = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24, [x, y] = bez(p, t), [tx, ty] = tan(p, t), e = espessura(t) / 2;
        cima.push([x + ty * e, y - tx * e]); baixo.push([x - ty * e, y + tx * e]);
      }
      const pts = cima.concat(baixo.reverse());
      out.push(`<path class="henna" d="M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}Z"/>`);
    }
    const n = F.bagunca ? 210 : F.penteada ? 260 : 230;
    for (let i = 0; i < n; i++) {
      const t = Math.pow(rnd(), 0.95);
      const [x, y] = bez(p, t);
      const [tx, ty] = tan(p, t);
      const e = espessura(t);
      const off = (rnd() - 0.5) * e;
      const bx = x + ty * off, by = y - tx * off;
      // fios da cabeça sobem quase retos; no corpo e na cauda deitam na direção da cauda
      let ang;
      if (F.penteada) ang = -Math.PI / 2 + 0.35 * t + (rnd() - 0.5) * 0.25;
      else ang = t < 0.14 ? -Math.PI / 2 + 0.25 + (rnd() - 0.5) * 0.3 : Math.atan2(ty, tx) - 0.38 + (off / e) * 0.5 + (rnd() - 0.5) * 0.22;
      const L = (F.penteada ? 14 : 12) + rnd() * 9 - t * 3;
      const cx = bx + Math.cos(ang) * L * 0.5 + (F.penteada ? 2 : 0), cy = by + Math.sin(ang) * L * 0.5 + 2;
      const fx = bx + Math.cos(ang) * L, fy = by + Math.sin(ang) * L;
      out.push(`<path d="M${r1(bx)} ${r1(by)}Q${r1(cx)} ${r1(cy)} ${r1(fx)} ${r1(fy)}" stroke-width="${r1(0.9 + rnd() * 0.7)}" opacity="${r1(0.5 + rnd() * 0.45)}"/>`);
    }
    // fios fora do desenho, no "antes"
    if (F.bagunca) {
      for (let i = 0; i < 46; i++) {
        const t = rnd();
        const [x, y] = bez(p, t);
        const lado = rnd() > 0.45 ? 1 : -1;
        const bx = x + (rnd() - 0.5) * 10, by = y + lado * (espessura(t) / 2 + 6 + rnd() * 18);
        const ang = -0.6 + (rnd() - 0.5) * 1.2;
        const L = 5 + rnd() * 7;
        out.push(`<path d="M${r1(bx)} ${r1(by)}l${r1(Math.cos(ang) * L)} ${r1(Math.sin(ang) * L)}" stroke-width=".9" opacity="${r1(0.35 + rnd() * 0.3)}"/>`);
      }
    }
    return out.join('');
  }

  // olho completo. o = { estilo, curva, comp, sobr, henna, abertura (0 a 1), olhar: [dx, dy], semente, id }
  function olho(o = {}) {
    const a = o.abertura ?? 1;
    const id = o.id || 'o';
    const [gx, gy] = o.olhar || [0, 0];
    const rnd = semente(o.semente || 7);
    const up = palpebra(a);
    const forma = `${cub(up)}${cub([...PALP_BAIXO].reverse()).replace('M', 'L')}Z`;
    const ix = 246 + gx * 34, iy = 182 + gy * 14;
    const fibras = [];
    for (let i = 0; i < 64; i++) {
      const ang = (i / 64) * Math.PI * 2;
      const r0 = 25 + (i % 3) * 3, rf = 50 + (i % 4) * 2.4;
      fibras.push(`M${r1(ix + Math.cos(ang) * r0)} ${r1(iy + Math.sin(ang) * r0)}L${r1(ix + Math.cos(ang + 0.05) * rf)} ${r1(iy + Math.sin(ang + 0.05) * rf)}`);
    }
    const dobra = [[104, 192], [168, 150 - 26 * a], [310, 138 - 26 * a], [396, 182]];
    return `<svg class="olho-svg" viewBox="0 0 480 320" role="img" aria-label="${o.rotulo || 'Desenho de um olho'}">
  <defs>
    <clipPath id="${id}-abertura"><path d="${forma}"/></clipPath>
    <radialGradient id="${id}-iris" cx=".5" cy=".5" r=".5"><stop offset=".3" stop-color="var(--olho-1, #6E6196)"/><stop offset=".85" stop-color="var(--olho-2, #3D3A5E)"/><stop offset="1" stop-color="var(--olho-3, #262A40)"/></radialGradient>
    <linearGradient id="${id}-sombra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E2233" stop-opacity=".28"/><stop offset=".45" stop-color="#1E2233" stop-opacity="0"/></linearGradient>
  </defs>
  ${o.sobr ? `<g class="sobr" stroke="var(--fio, #1E2233)" fill="none" stroke-linecap="round">${sobrancelha(o.sobr, semente((o.semente || 7) + 3), o.henna)}</g>` : ''}
  <path class="dobra" d="${cub(dobra)}" fill="none"/>
  <g clip-path="url(#${id}-abertura)">
    <rect class="esclera" x="60" y="60" width="380" height="240"/>
    <g class="iris-g">
    <circle cx="${r1(ix)}" cy="${r1(iy)}" r="58" fill="url(#${id}-iris)"/>
    <path d="${fibras.join('')}" stroke="var(--olho-fibra, #B7ACD8)" stroke-width=".8" opacity=".55"/>
    <circle cx="${r1(ix)}" cy="${r1(iy)}" r="58" fill="none" stroke="#1E2233" stroke-width="2.2" opacity=".7"/>
    <circle cx="${r1(ix)}" cy="${r1(iy)}" r="21" fill="#141726"/>
    <circle cx="${r1(ix - 18)}" cy="${r1(iy - 20)}" r="9" fill="#fff" opacity=".9"/>
    <circle cx="${r1(ix + 16)}" cy="${r1(iy + 14)}" r="3.4" fill="#fff" opacity=".6"/>
    </g>
    <path d="${forma}" fill="url(#${id}-sombra)"/>
  </g>
  <path class="palp-baixo" d="${cub(PALP_BAIXO)}" fill="none"/>
  <path class="palp" d="${cub(up)}" fill="none"/>
  <g class="cil" stroke="var(--fio, #1E2233)" fill="none" stroke-linecap="round">${cilios({ estilo: o.estilo, curva: o.curva, comp: o.comp, hibrido: o.hibrido }, a, rnd)}</g>
</svg>`;
  }

  // ---------- perna (comparador do laser), viewBox 0 0 480 300 ----------
  function perna(o = {}) {
    const rnd = semente(o.semente || 19);
    const id = o.id || 'p';
    // perna deitada, do joelho (esquerda) ao tornozelo (direita)
    const cima = 'M20 96C110 70 210 70 300 98S420 128 470 122';
    const baixo = 'M470 196C420 194 360 212 300 214S110 228 20 222';
    const fios = [];
    if (o.pelos) {
      for (let i = 0; i < 260; i++) {
        const x = 30 + rnd() * 430;
        const yc = 100 + (x / 470) * 20, yb = 220 - (x / 470) * 22;
        const y = yc + 10 + rnd() * (yb - yc - 20);
        const L = 5 + rnd() * 6, ang = 0.35 + (rnd() - 0.5) * 0.5;
        fios.push(`<path d="M${r1(x)} ${r1(y)}q${r1(L * 0.6)} ${r1(-1)} ${r1(Math.cos(ang) * L)} ${r1(Math.sin(ang) * L)}" stroke-width="${r1(0.8 + rnd() * 0.5)}" opacity="${r1(0.45 + rnd() * 0.4)}"/>`);
        if (rnd() > 0.7) fios.push(`<circle cx="${r1(x - 1)}" cy="${r1(y)}" r="1" opacity=".35"/>`);
      }
    }
    return `<svg class="perna-svg" viewBox="0 0 480 300" role="img" aria-label="${o.rotulo || 'Desenho de uma perna'}">
  <defs>
    <linearGradient id="${id}-pele" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--pele-1, #E9CDB8)"/><stop offset=".55" stop-color="var(--pele-2, #DDB79D)"/><stop offset="1" stop-color="var(--pele-3, #C99A7E)"/></linearGradient>
    <linearGradient id="${id}-brilho" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${o.pelos ? '.12' : '.4'}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  </defs>
  <path d="${cima}L${baixo.slice(1)}Z" fill="url(#${id}-pele)"/>
  <path d="M60 118C170 100 300 108 440 136" stroke="url(#${id}-brilho)" stroke-width="16" fill="none" stroke-linecap="round"/>
  <path d="${cima}" class="contorno" fill="none"/><path d="${baixo}" class="contorno" fill="none"/>
  <path d="M110 150c22 8 40 6 54-4" class="contorno fino" fill="none"/>
  <g stroke="#3A2A24" fill="#3A2A24" stroke-linecap="round">${fios.join('')}</g>
</svg>`;
  }

  // ---------- silhueta do mapa do corpo (viewBox 0 0 220 500), metade direita espelhada ----------
  const META = [
    [118, 74], [121, 92], [148, 100], [160, 136], [168, 196], [175, 250], [181, 282], [176, 298], [167, 292], [163, 252],
    [157, 204], [149, 156], [139, 128], [134, 166], [128, 200], [138, 246], [141, 274], [137, 330], [131, 372], [129, 412],
    [125, 456], [124, 470], [131, 486], [121, 494], [113, 490], [112, 466], [113, 420], [114, 372], [116, 322], [110, 288],
  ];
  function silhueta() {
    const dir = META, esq = META.slice(0, -1).reverse().map(([x, y]) => [220 - x, y]);
    const pts = dir.concat(esq);
    // Catmull-Rom fechada em Bézier
    const n = pts.length;
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
    }
    return `${d}Z`;
  }
  const cabeca = '<ellipse cx="110" cy="44" rx="22" ry="29"/>';

  const API = { olho, perna, silhueta, cabeca, semente };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else raiz.Desenho = API;
})(typeof window !== 'undefined' ? window : globalThis);
