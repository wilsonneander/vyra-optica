/* ESTALO, motor 3D das latas (three.js r149, script clássico para abrir direto pelo index.html).
   Tudo o que mexe é função do scroll: o hero (lata abrindo em câmera lenta) e o rótulo que se desenrola.
   As latas paradas dos cards são renderizadas uma vez num renderizador fora da tela e viram <img>. */
(function () {
  'use strict';
  const T = window.THREE;
  const SABORES = window.ESTALO_SABORES;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- utilidades ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const suave = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };
  const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
  function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function progresso(el) {
    const r = el.getBoundingClientRect();
    const total = r.height - innerHeight;
    return total > 0 ? clamp(-r.top / total) : 0;
  }
  function suportaWebGL() {
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
  }

  // ---------- medidas da lata (473 ml, raio 1) ----------
  const R = 1;
  const ROT_Y0 = 0.34, ROT_Y1 = 4.53;          // faixa do rótulo no corpo
  const ROT_H = ROT_Y1 - ROT_Y0;
  const ROT_C = Math.PI * 2 * R;               // volta completa do rótulo
  const TOPO = 4.97;                            // altura da tampa
  const LW = 2048, LH = Math.round(LW * ROT_H / ROT_C); // canvas do rótulo na mesma proporção

  // ---------- ambiente de reflexo (estúdio com softboxes) ----------
  function criaAmbiente(renderer) {
    const s = new T.Scene();
    const sala = new T.Mesh(new T.BoxGeometry(1, 1, 1), new T.MeshBasicMaterial({ color: 0x77777b, side: T.BackSide }));
    sala.scale.set(30, 20, 30); sala.position.y = 6; s.add(sala);
    const painel = (w, h, d, x, y, z, k, cor = 0xffffff) => {
      const m = new T.MeshBasicMaterial({ color: cor }); m.color.multiplyScalar(k);
      const p = new T.Mesh(new T.BoxGeometry(w, h, d), m); p.position.set(x, y, z); s.add(p); return p;
    };
    painel(16, 0.2, 10, 0, 15.5, 0, 5);          // softbox de cima
    painel(0.2, 14, 3.2, -14.8, 6, 2, 13);        // faixa forte da esquerda (o brilho vertical da lata)
    painel(0.2, 12, 2.4, 14.8, 6, -2, 5);         // faixa da direita
    painel(6, 9, 0.2, 4, 6, 14.8, 2.6);           // frente
    painel(10, 6, 0.2, -6, 4, -14.8, 1.4, 0xfff4ea);
    painel(0.2, 16, 2.2, -14.7, 6, -6, 0.04);       // faixas escuras: reflexo preto vertical da lata
    painel(0.2, 16, 1.6, 14.7, 6, 5, 0.06);
    painel(30, 0.2, 30, 0, -3.9, 0, 0.35);           // chão do estúdio, meio escuro
    const pm = new T.PMREMGenerator(renderer);
    const tex = pm.fromScene(s, 0.035).texture;
    pm.dispose();
    return tex;
  }

  // ---------- texturas compartilhadas ----------
  let texGotas = null;
  function gotasCanvas() {
    // mapa de relevo com gotas de condensação (usado como bumpMap no rótulo e no alumínio)
    if (texGotas) return texGotas;
    const c = document.createElement('canvas'); c.width = 1024; c.height = 700;
    const g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
    const r = rng(7);
    for (let i = 0; i < 2600; i++) {
      const x = r() * c.width, y = r() * c.height, rad = 0.6 + Math.pow(r(), 3) * 5.5;
      const gr = g.createRadialGradient(x - rad * 0.3, y - rad * 0.3, 0, x, y, rad);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.7, 'rgba(200,200,200,.8)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, rad, rad * (1 + r() * 0.5), 0, 0, Math.PI * 2); g.fill();
    }
    texGotas = new T.CanvasTexture(c);
    texGotas.wrapS = texGotas.wrapT = T.RepeatWrapping;
    return texGotas;
  }

  function texPiso() {
    // opaco perto da lata (esconde o reflexo aos poucos) e transparente na borda (sem linha de horizonte)
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, '#8c8c8c'); gr.addColorStop(0.16, '#e8e8e8'); gr.addColorStop(0.42, '#ffffff'); gr.addColorStop(1, '#000000');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    return new T.CanvasTexture(c);
  }
  function texRadial(interno, externo) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, interno); gr.addColorStop(1, externo);
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    return new T.CanvasTexture(c);
  }

  // ---------- desenho do rótulo ----------
  const F_T = 'Archivo', F_M = '"Martian Mono"', F_C = '"Hanken Grotesk"';
  function fonte(g, peso, px, fam, largo) {
    g.font = `${peso} ${largo ? 'expanded ' : ''}${px}px ${fam}, sans-serif`;
    try { g.fontStretch = largo ? 'expanded' : 'normal'; } catch (e) { /* navegador antigo */ }
  }
  function corClara(hex) {
    const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, gg = (n >> 8) & 255, b = n & 255;
    return (0.2126 * r + 0.7152 * gg + 0.0722 * b) / 255 > 0.45;
  }
  const PONTOS_ROTULO = {}; // posições (px do rótulo) dos elementos que o rótulo aberto explica

  function desenhaRotulo(s) {
    const c = document.createElement('canvas'); c.width = LW; c.height = LH;
    const g = c.getContext('2d');
    const tinta = corClara(s.campo) ? '#140f0b' : '#F4F2EC';
    const tintaSuave = corClara(s.campo) ? 'rgba(20,15,11,.66)' : 'rgba(244,242,236,.72)';

    g.fillStyle = s.campo; g.fillRect(0, 0, LW, LH);
    // leve variação de tom, como tinta impressa em alumínio
    const vg = g.createLinearGradient(0, 0, 0, LH);
    vg.addColorStop(0, 'rgba(255,255,255,.06)'); vg.addColorStop(0.5, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.08)');
    g.fillStyle = vg; g.fillRect(0, 0, LW, LH);

    // faixa inclinada da marca no centro (frente da lata)
    const cx = LW * 0.5, fw = LW * 0.15;
    g.fillStyle = s.fundo;
    g.beginPath(); g.moveTo(cx - fw / 2 + 26, 0); g.lineTo(cx + fw / 2 + 26, 0); g.lineTo(cx + fw / 2 - 26, LH); g.lineTo(cx - fw / 2 - 26, LH); g.closePath(); g.fill();
    g.save(); g.translate(cx, LH * 0.5); g.rotate(-Math.PI / 2 - 0.035);
    fonte(g, 900, 250, F_T, true); g.fillStyle = s.faixaTexto || '#F4F2EC'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('ESTALO', 0, 8);
    g.restore();

    // lado esquerdo: chamada e tabela nutricional
    g.fillStyle = tinta; g.textAlign = 'right'; g.textBaseline = 'alphabetic';
    fonte(g, 900, 66, F_T, true); g.fillText('ABRE NO', cx - fw / 2 - 70, 190); g.fillText('ESTALO.', cx - fw / 2 - 70, 262);
    fonte(g, 500, 22, F_M); g.fillStyle = tintaSuave; g.fillText('ABRE.  ESCUTA.  BEBE.', cx - fw / 2 - 70, 312);

    const tx = LW * 0.19, ty = 470, tw = 330, th = 560;
    g.fillStyle = '#F2EFE6'; g.fillRect(tx, ty, tw, th);
    g.fillStyle = '#141414'; g.textAlign = 'left';
    fonte(g, 800, 33, F_C); g.fillText('Informação nutricional', tx + 18, ty + 52);
    g.fillRect(tx + 18, ty + 68, tw - 36, 9);
    const linhas = [['Porção', '1 lata'], ['Valor energético', '10 kcal'], ['Açúcares', '2 g'], ['Sódio', '150 mg'], ['Niacina', '8 mg'], ['Vitamina B6', '1 mg'], ['Vitamina B12', '2 µg'], ['Cafeína', '160 mg']];
    fonte(g, 500, 23, F_C);
    linhas.forEach((l, i) => {
      const y = ty + 118 + i * 50;
      g.textAlign = 'left'; g.fillText(l[0], tx + 18, y); g.textAlign = 'right'; g.fillText(l[1], tx + tw - 18, y);
      g.fillRect(tx + 18, y + 14, tw - 36, 2);
      if (l[0] === 'Açúcares') PONTOS_ROTULO.acucar = [tx + tw - 10, y - 8];
      if (l[0] === 'Cafeína') PONTOS_ROTULO.cafeina = [tx + tw - 10, y - 8];
    });
    fonte(g, 500, 15, F_M); g.textAlign = 'left'; g.fillStyle = '#555';
    g.fillText('VALORES DE EXEMPLO PARA O LAYOUT.', tx + 18, ty + th - 40); g.fillText('NÃO É UM PRODUTO REAL.', tx + 18, ty + th - 18);

    // lado direito: sabor, nota, ícone do estalo, especificações
    const rx = cx + fw / 2 + 60;
    g.fillStyle = tinta; g.textAlign = 'left';
    fonte(g, 500, 24, F_M); g.fillText('SABOR', rx, 180);
    const nomeTam = s.nome.length > 8 ? 74 : 92;
    fonte(g, 900, nomeTam, F_T, true); g.fillText(s.nome.toUpperCase(), rx, 180 + nomeTam + 6);
    PONTOS_ROTULO.fruta = [rx + 40, 180 + nomeTam * 0.55];
    fonte(g, 500, 36, F_C); g.fillStyle = tintaSuave; g.fillText(s.curto, rx, 180 + nomeTam + 62);
    fonte(g, 500, 22, F_M); g.fillText('ENERGÉTICO COM GÁS', rx, 180 + nomeTam + 106);

    // ícone do estalo: lacre visto de cima com ondas de som
    const ix = rx + 30, iy = 560;
    g.fillStyle = tinta; g.beginPath(); g.ellipse(ix, iy, 26, 26, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = s.campo; g.beginPath(); g.ellipse(ix + 3, iy, 9, 12, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = tinta; g.lineWidth = 9; g.lineCap = 'round';
    [46, 70, 94].forEach(rr => { g.beginPath(); g.arc(ix, iy, rr, -0.55, 0.55); g.stroke(); });
    PONTOS_ROTULO.gas = [ix + 94, iy];

    g.fillStyle = tinta; g.fillRect(rx, LH - 250, 470, 4);
    fonte(g, 500, 23, F_M); g.fillStyle = tintaSuave;
    g.fillText('473 ML   ' + s.nota.toUpperCase(), rx, LH - 205);
    g.fillText('ESTALANDO DESDE 2026', rx, LH - 168);

    // texto vertical de reciclagem e código de barras
    g.save(); g.translate(LW * 0.885, 120); g.rotate(Math.PI / 2);
    fonte(g, 500, 21, F_M); g.fillStyle = tintaSuave; g.textAlign = 'left';
    g.fillText('RECICLE. LATA DE ALUMÍNIO INFINITAMENTE RECICLÁVEL', 0, 0);
    g.restore();
    const bx = LW * 0.905, by = LH - 520, bw = 120, bh = 290;
    g.fillStyle = '#F2EFE6'; g.fillRect(bx, by, bw, bh);
    const rb = rng(11); g.fillStyle = '#111';
    for (let y = by + 16; y < by + bh - 40;) { const h = 2 + Math.floor(rb() * 7); g.fillRect(bx + 16, y, bw - 32, h); y += h + 2 + Math.floor(rb() * 6); }
    fonte(g, 500, 13, F_M); g.fillText('7 89100 26473 2', bx + 8, by + bh - 14);
    PONTOS_ROTULO.lata = [bx + bw / 2, by - 6];

    // marca de edição limitada
    if (s.limitado) { fonte(g, 800, 24, F_M); g.fillStyle = s.acento || tinta; g.fillText('EDIÇÃO LIMITADA', rx, 120); }

    // gotinhas de condensação por cima da impressão
    const r = rng(3);
    for (let i = 0; i < 800; i++) {
      const x = r() * LW, y = r() * LH, rad = 0.8 + Math.pow(r(), 3) * 4.5;
      g.fillStyle = `rgba(255,255,255,${0.06 + r() * 0.16})`;
      g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
      g.fillStyle = `rgba(0,0,0,${0.05 + r() * 0.08})`;
      g.beginPath(); g.arc(x + rad * 0.35, y + rad * 0.4, rad * 0.7, 0, Math.PI * 2); g.fill();
    }
    const tex = new T.CanvasTexture(c);
    tex.anisotropy = 8;
    return tex;
  }

  // ---------- geometrias ----------
  function geoCorpo() {
    const p = [[0, 0.1], [0.55, 0.06], [0.74, 0.02], [0.86, 0], [0.93, 0.03], [0.975, 0.1], [0.997, 0.2], [1, 0.32], [1, 4.55], [0.985, 4.68], [0.93, 4.85], [0.885, 4.96], [0.878, 5.03], [0.888, 5.08], [0.884, 5.12], [0.862, 5.135], [0.842, 5.11], [0.832, 5.03], [0.82, TOPO]];
    return new T.LatheGeometry(p.map(v => new T.Vector2(v[0], v[1])), 96);
  }

  // rótulo como malha própria: cilindro que pode virar folha plana (e = 0 enrolado, e = 1 aberto)
  const SEG_U = 160, SEG_V = 6;
  function geoRotulo() {
    const geo = new T.PlaneGeometry(1, 1, SEG_U, SEG_V);
    aplicaAbertura(geo, 0, 1.004);
    return geo;
  }
  function aplicaAbertura(geo, e, raio = 1.004) {
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    const C = Math.PI * 2 * raio, L = e * C / 2;
    for (let i = 0; i < pos.count; i++) {
      const u = uv.getX(i), v = uv.getY(i);
      const s = (u - 0.5) * C, a = Math.abs(s), sg = Math.sign(s) || 1;
      let x, z;
      if (a <= L) { x = s; z = raio; }
      else { const f = (a - L) / raio; x = sg * (L + raio * Math.sin(f)); z = raio * Math.cos(f); }
      pos.setXYZ(i, x, ROT_Y0 + v * ROT_H, z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  function geoLacre() {
    // lacre (anel de puxar) visto de cima: corpo arredondado com o furo do dedo
    const sh = new T.Shape();
    const w = 0.26, l0 = -0.2, l1 = 0.56, rr = 0.2;
    sh.moveTo(-w + rr, l0); sh.lineTo(w - rr, l0); sh.quadraticCurveTo(w, l0, w, l0 + rr);
    sh.lineTo(w, l1 - rr); sh.quadraticCurveTo(w, l1, w - rr, l1); sh.lineTo(-w + rr, l1); sh.quadraticCurveTo(-w, l1, -w, l1 - rr);
    sh.lineTo(-w, l0 + rr); sh.quadraticCurveTo(-w, l0, -w + rr, l0);
    const furo = new T.Path(); furo.absellipse(0, 0.33, 0.15, 0.13, 0, Math.PI * 2, true); sh.holes.push(furo);
    const geo = new T.ExtrudeGeometry(sh, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 24 });
    geo.rotateX(Math.PI / 2); // deita o lacre no plano da tampa (y para cima)
    return geo;
  }

  function geoBoca() {
    const sh = new T.Shape();
    sh.moveTo(-0.3, 0); sh.quadraticCurveTo(-0.34, -0.36, 0, -0.42); sh.quadraticCurveTo(0.34, -0.36, 0.3, 0); sh.quadraticCurveTo(0, 0.08, -0.3, 0);
    const geo = new T.ShapeGeometry(sh, 24); geo.rotateX(-Math.PI / 2);
    return geo;
  }

  // ---------- montagem da lata ----------
  const mats = {};
  function materiaisBase() {
    if (mats.aluminio) return mats;
    const bump = gotasCanvas();
    mats.aluminio = new T.MeshStandardMaterial({ color: 0xe4e5e8, metalness: 1, roughness: 0.24, envMapIntensity: 1.1, bumpMap: bump, bumpScale: 0.002 });
    mats.tampa = new T.MeshStandardMaterial({ color: 0xd2d4d8, metalness: 1, roughness: 0.32, side: T.DoubleSide });
    mats.lacre = new T.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 1, roughness: 0.2 });
    mats.boca = new T.MeshBasicMaterial({ color: 0x0b0b0b });
    mats.versoRotulo = new T.MeshStandardMaterial({ color: 0xdedcd6, roughness: 0.7, metalness: 0.1, side: T.BackSide });
    return mats;
  }
  const texRotulos = {};
  function texRotulo(id) { if (!texRotulos[id]) texRotulos[id] = desenhaRotulo(SABORES.find(s => s.id === id)); return texRotulos[id]; }

  function criaLata(id, opts = {}) {
    const m = materiaisBase();
    const grupo = new T.Group();
    const corpo = new T.Mesh(geoCorpo(), m.aluminio); grupo.add(corpo);
    const tampa = new T.Mesh(new T.CircleGeometry(0.83, 64), m.tampa); tampa.rotation.x = -Math.PI / 2; tampa.position.y = TOPO; grupo.add(tampa);
    const rebite = new T.Mesh(new T.SphereGeometry(0.06, 16, 8), m.lacre); rebite.scale.y = 0.4; rebite.position.set(0, TOPO + 0.01, 0); grupo.add(rebite);

    const boca = new T.Mesh(geoBoca(), m.boca); boca.position.set(0, TOPO + 0.004, -0.18); boca.scale.setScalar(0.001); grupo.add(boca);

    const pivo = new T.Group(); pivo.position.set(0, TOPO + 0.035, 0); grupo.add(pivo);
    const lacre = new T.Mesh(geoLacre(), m.lacre); pivo.add(lacre);

    const geoR = opts.geoRotulo || geoRotulo();
    const matR = new T.MeshStandardMaterial({ map: texRotulo(id), roughness: 0.36, metalness: 0.18, envMapIntensity: 0.9, bumpMap: gotasCanvas(), bumpScale: 0.0025 });
    const rotulo = new T.Mesh(geoR, matR); grupo.add(rotulo);
    const verso = new T.Mesh(geoR, m.versoRotulo); grupo.add(verso);

    return { grupo, rotulo, matR, pivo, boca, geoR, setSabor(nid) { matR.map = texRotulo(nid); matR.needsUpdate = true; } };
  }

  function criaSombra(op = 0.42, escala = 4.2) {
    const mat = new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: op, depthWrite: false, alphaMap: texRadial('#ffffff', '#000000'), toneMapped: false });
    const s = new T.Mesh(new T.PlaneGeometry(escala, escala), mat); s.rotation.x = -Math.PI / 2; s.position.y = 0.004;
    return s;
  }

  function criaRenderer(canvas, alpha = true) {
    const r = new T.WebGLRenderer({ canvas, antialias: true, alpha, preserveDrawingBuffer: false, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    r.setClearColor(0x000000, 0);
    return r;
  }

  // ---------- latas paradas para os cards ----------
  function renderizaEstaticas(renderer) {
    const imgs = [...document.querySelectorAll('img[data-lata]')];
    if (!imgs.length) return;
    const W = 420, H = 760;
    renderer.setSize(W, H, false);
    const cena = new T.Scene(); cena.environment = criaAmbiente(renderer);
    const luz = new T.DirectionalLight(0xffffff, 0.5); luz.position.set(-4, 8, 6); cena.add(luz);
    const cam = new T.PerspectiveCamera(20, W / H, 1, 100);
    cam.position.set(0, 4.6, 19.5); cam.lookAt(0, 2.45, 0);
    const lata = criaLata(SABORES[0].id);
    lata.grupo.rotation.y = -0.38; cena.add(lata.grupo);
    cena.add(criaSombra(0.5, 4.4));
    const cache = {};
    imgs.forEach(img => {
      const id = img.dataset.lata;
      if (!cache[id]) { lata.setSabor(id); renderer.render(cena, cam); cache[id] = renderer.domElement.toDataURL('image/png'); }
      img.src = cache[id];
      img.classList.add('pronta');
    });
  }

  // ---------- HERO: lata abrindo em câmera lenta, tempo controlado pelo scroll ----------
  const T_INI = -20, T_FIM = 50;
  function iniciaHero() {
    const sec = document.querySelector('[data-hero]');
    const canvas = sec && sec.querySelector('canvas.hero-3d');
    if (!canvas) return;
    const renderer = criaRenderer(canvas);
    const cena = new T.Scene(); cena.environment = criaAmbiente(renderer);
    const luz = new T.DirectionalLight(0xffffff, 0.55); luz.position.set(-6, 9, 7); cena.add(luz);
    const cam = new T.PerspectiveCamera(26, 1, 0.5, 200);

    let saborAtual = SABORES[0];
    const lata = criaLata(saborAtual.id);
    cena.add(lata.grupo);
    // reflexo no chão: a mesma lata espelhada, vista através do piso translúcido
    const espelho = criaLata(saborAtual.id);
    espelho.grupo.scale.y = -1; cena.add(espelho.grupo);
    const piso = new T.Mesh(new T.PlaneGeometry(26, 26), new T.MeshBasicMaterial({ color: saborAtual.campo, transparent: true, alphaMap: texPiso(), toneMapped: false, depthWrite: false }));
    piso.rotation.x = -Math.PI / 2; piso.position.y = 0.002; cena.add(piso);
    const sombra = criaSombra(0.32, 5); sombra.position.y = 0.006; cena.add(sombra);

    // gotas do spray: cada uma tem saída, direção e tamanho fixos; a posição é função do tempo (dá para voltar o scroll)
    const N = 460, rg = rng(42), gotas = [];
    for (let i = 0; i < N; i++) {
      const ang = rg() * Math.PI * 2, abre = 0.006 + Math.pow(rg(), 1.6) * 0.03;
      gotas.push({
        t0: 0.8 + Math.pow(rg(), 1.8) * 30,
        vx: Math.cos(ang) * abre, vz: Math.sin(ang) * abre - 0.004,
        vy: 0.03 + rg() * 0.075,
        ox: (rg() - 0.5) * 0.36, oz: -0.18 - rg() * 0.28,
        tam: 0.01 + Math.pow(rg(), 3.2) * 0.05, giro: rg() * 6.28,
      });
    }
    const matGota = new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, metalness: 0.0, envMapIntensity: 2.2, transparent: true, opacity: 0.62, clearcoat: 1, clearcoatRoughness: 0.05 });
    const inst = new T.InstancedMesh(new T.SphereGeometry(1, 12, 8), matGota, N);
    inst.instanceMatrix.setUsage(T.DynamicDrawUsage);
    cena.add(inst);
    const nevoa = new T.Sprite(new T.SpriteMaterial({ map: texRadial('rgba(255,255,255,.95)', 'rgba(255,255,255,0)'), transparent: true, depthWrite: false, opacity: 0 }));
    cena.add(nevoa);
    const nevoa2 = nevoa.clone(); nevoa2.material = nevoa.material.clone(); cena.add(nevoa2);

    const tmp = new T.Object3D(), corGota = new T.Color();
    function tintaGotas() { corGota.set(saborAtual.campo).lerp(new T.Color(0xffffff), 0.7); matGota.color.copy(corGota); }
    tintaGotas();

    function poseNoTempo(t) {
      // lacre: sobe entre 0 e 7 ms, passa do ponto e assenta em pé
      const sobe = easeOut((t - 0) / 7);
      const volta = suave(9, 22, t) * 0.18;
      const ang = sobe * 1.25 - volta;
      [lata, espelho].forEach(l => {
        l.pivo.rotation.x = t < 0 ? 0 : -ang;
        const b = clamp((t - 1.2) / 4);
        l.boca.scale.setScalar(Math.max(0.001, b));
      });
      // recuo da lata no estalo
      const tranco = t > 0 ? Math.sin(clamp(t / 10) * Math.PI) * 0.025 : 0;
      lata.grupo.position.y = -tranco; espelho.grupo.position.y = tranco;

      const base = new T.Vector3(0, TOPO + 0.02, 0);
      let visiveis = 0;
      for (let i = 0; i < N; i++) {
        const d = gotas[i], dt = t - d.t0;
        if (dt <= 0) { tmp.scale.setScalar(0); tmp.position.set(0, -50, 0); }
        else {
          const g = 0.00006;
          tmp.position.set(base.x + d.ox + d.vx * dt, base.y + d.vy * dt - g * dt * dt, base.z + d.oz + d.vz * dt);
          const nasce = clamp(dt / 2.5), some = 1 - suave(26, 46, dt);
          tmp.scale.set(d.tam * nasce * some, d.tam * nasce * some * 1.25, d.tam * nasce * some);
          tmp.rotation.set(0, 0, d.giro);
          visiveis++;
        }
        tmp.updateMatrix(); inst.setMatrixAt(i, tmp.matrix);
      }
      inst.instanceMatrix.needsUpdate = true;
      // névoa: o gás frio que sai primeiro
      const n1 = suave(0, 4, t) * (1 - suave(10, 34, t));
      nevoa.material.opacity = n1 * 0.85;
      const e1 = 0.6 + suave(0, 20, t) * 2.6;
      nevoa.scale.set(e1, e1 * 1.3, 1); nevoa.position.set(0, TOPO + 0.4 + suave(0, 30, t) * 1.2, -0.25);
      const n2 = suave(3, 10, t) * (1 - suave(18, 48, t));
      nevoa2.material.opacity = n2 * 0.5;
      const e2 = 1 + suave(3, 40, t) * 3.4;
      nevoa2.scale.set(e2, e2, 1); nevoa2.position.set(0.1, TOPO + 1.3 + suave(3, 45, t) * 1.6, -0.35);
    }

    // interface do hero
    const leitura = sec.querySelector('[data-ms]');
    const barra = sec.querySelector('[data-regua-barra]');
    const quadro = sec.querySelector('[data-quadro]');
    const regua = sec.querySelector('[data-regua]');
    let alvo = 0, atual = 0, arrastando = false, ponteiro = 0, ponteiroS = 0;

    function trocaSabor(id) {
      const s = SABORES.find(x => x.id === id); if (!s) return;
      saborAtual = s;
      lata.setSabor(id); espelho.setSabor(id);
      piso.material.color.set(s.campo); tintaGotas();
      sec.style.setProperty('--campo', s.campo);
      sec.style.setProperty('--fundo', s.fundo);
      sec.classList.toggle('escuro', !corClara(s.campo));
      sec.querySelectorAll('[data-sabor]').forEach(b => b.setAttribute('aria-pressed', b.dataset.sabor === id));
      const nome = sec.querySelector('[data-hero-nome]'), nota = sec.querySelector('[data-hero-nota]');
      if (nome) { nome.textContent = s.nome; nota.textContent = s.sabor + '. ' + s.nota + '.'; }
      document.dispatchEvent(new CustomEvent('estalo:sabor', { detail: s }));
    }
    sec.querySelectorAll('[data-sabor]').forEach(b => b.addEventListener('click', () => trocaSabor(b.dataset.sabor)));
    trocaSabor(saborAtual.id);

    // a régua também pode ser arrastada: leva o scroll até o tempo escolhido
    if (regua) {
      const irPara = ev => {
        const r = regua.getBoundingClientRect(), k = clamp((ev.clientX - r.left) / r.width);
        const sr = sec.getBoundingClientRect(), total = sr.height - innerHeight;
        scrollTo({ top: scrollY + sr.top + k * total, behavior: arrastando ? 'auto' : 'smooth' });
      };
      regua.addEventListener('pointerdown', e => { arrastando = true; regua.setPointerCapture(e.pointerId); irPara(e); });
      regua.addEventListener('pointermove', e => { if (arrastando) irPara(e); });
      regua.addEventListener('pointerup', () => { arrastando = false; });
      regua.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        e.preventDefault(); const sr = sec.getBoundingClientRect(); scrollBy({ top: d * (sr.height - innerHeight) / 14, behavior: 'smooth' });
      });
    }
    addEventListener('pointermove', e => { ponteiro = (e.clientX / innerWidth - 0.5) * 2; }, { passive: true });

    let W = 0, H = 0;
    function ajusta() {
      W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return;
      renderer.setSize(W, H, false);
      cam.aspect = W / H;
      const retrato = W / H < 0.9;
      // desloca o enquadramento: lata à direita no computador e no tablet, no meio da tela no celular
      if (!retrato) {
        cam.fov = 24; cam.position.set(0, 4.2, 23.5); cam.lookAt(0, 3.55, 0);
        cam.setViewOffset(W, H, -W * 0.125, H * 0.035, W, H);
      } else if (W < 600) {
        cam.fov = 30; cam.position.set(0, 4.4, 27); cam.lookAt(0, 2.7, 0);
        cam.setViewOffset(W, H, 0, -H * 0.02, W, H);
      } else {
        cam.fov = 30; cam.position.set(0, 4.4, 22); cam.lookAt(0, 2.7, 0);
        cam.setViewOffset(W, H, -W * 0.21, -H * 0.06, W, H);
      }
      cam.updateProjectionMatrix();
    }
    new ResizeObserver(ajusta).observe(canvas); ajusta();

    let visivel = true;
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) laco(); }, { rootMargin: '100px' }).observe(sec);

    let rodando = false;
    function laco() {
      if (rodando) return; rodando = true;
      const passo = () => {
        if (!visivel) { rodando = false; return; }
        alvo = progresso(sec);
        atual = reduz ? alvo : lerp(atual, alvo, 0.14);
        if (Math.abs(atual - alvo) < 0.0004) atual = alvo;
        const t = T_INI + atual * (T_FIM - T_INI);
        poseNoTempo(t);
        ponteiroS = lerp(ponteiroS, reduz ? 0 : ponteiro, 0.05);
        const giro = -0.42 + atual * 0.5 + ponteiroS * 0.14;
        lata.grupo.rotation.y = giro; espelho.grupo.rotation.y = giro;
        if (leitura) leitura.textContent = (t < 0 ? '−' : '+') + Math.abs(t).toFixed(1).replace('.', ',') + ' ms';
        if (barra) barra.style.transform = `scaleX(${atual})`;
        if (quadro) quadro.textContent = 'QUADRO ' + String(Math.round(atual * 70) + 1).padStart(4, '0');
        sec.style.setProperty('--p', atual.toFixed(4));
        renderer.render(cena, cam);
        requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    }
    laco();
  }

  // ---------- RÓTULO: o scroll desenrola o rótulo da lata até virar folha ----------
  function iniciaRotulo() {
    const sec = document.querySelector('[data-rotulo]');
    const canvas = sec && sec.querySelector('canvas.rotulo-3d');
    if (!canvas) return;
    const renderer = criaRenderer(canvas);
    const cena = new T.Scene(); cena.environment = criaAmbiente(renderer);
    const luz = new T.DirectionalLight(0xffffff, 0.5); luz.position.set(-5, 8, 9); cena.add(luz);
    const cam = new T.PerspectiveCamera(26, 1, 0.5, 200);
    const geo = geoRotulo();
    const lata = criaLata(sec.dataset.rotulo || 'pitanga', { geoRotulo: geo });
    cena.add(lata.grupo);
    const sombra = criaSombra(0.34, 5.4); cena.add(sombra);

    const contador = sec.querySelector('[data-pct]');
    const barra = sec.querySelector('[data-pct-barra]');
    const pinos = [...sec.querySelectorAll('[data-pino]')];
    const svg = sec.querySelector('svg.fios');
    const legenda = sec.querySelector('[data-legenda]');
    const pv = new T.Vector3();

    let W = 0, H = 0, retrato = false;
    function ajusta() {
      W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return;
      renderer.setSize(W, H, false); cam.aspect = W / H; retrato = W / H < 0.9;
      if (svg) svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    }
    new ResizeObserver(ajusta).observe(canvas); ajusta();

    function enquadra(e) {
      // distância da câmera: começa enquadrando a lata em pé e termina enquadrando a folha aberta
      const tanV = Math.tan(T.MathUtils.degToRad(cam.fov / 2)) * 2;
      const dLata = (5.2 / (retrato ? 0.5 : 0.6)) / tanV;
      const larguraAlvo = retrato ? 0.9 : 0.47;
      const dFolha = Math.max((ROT_C * 1.004 / larguraAlvo) / (tanV * cam.aspect), (ROT_H / 0.5) / tanV);
      const d = lerp(dLata, dFolha, suave(0, 1, e));
      const yAlvo = lerp(2.6, 2.45, e);
      cam.position.set(0, yAlvo + lerp(1.6, 0.2, e), d);
      cam.lookAt(0, yAlvo, 0);
      cam.setViewOffset(W, H, 0, retrato ? -H * 0.02 : -H * lerp(0.09, 0.14, e), W, H);
      cam.updateProjectionMatrix();
    }

    let atual = 0, rodando = false, visivel = false;
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) laco(); }, { rootMargin: '100px' }).observe(sec);

    function posPino(nome) {
      const p = PONTOS_ROTULO[nome]; if (!p) return null;
      const C = ROT_C * 1.004;
      pv.set((p[0] / LW - 0.5) * C, ROT_Y0 + (1 - p[1] / LH) * ROT_H, 1.004);
      lata.grupo.localToWorld(pv); pv.project(cam);
      return [(pv.x + 1) / 2 * W, (1 - pv.y) / 2 * H];
    }

    function desenhaPinos(fase) {
      let ativo = -1;
      pinos.forEach((el, i) => {
        const k = clamp((fase - i * 0.16) / 0.2);
        el.style.setProperty('--k', k.toFixed(3));
        el.classList.toggle('on', k > 0.02);
        if (k > 0.5) ativo = i;
        const pt = posPino(el.dataset.pino);
        const ponto = el.querySelector('.ponto'), fio = svg && svg.querySelector(`[data-fio="${el.dataset.pino}"]`);
        if (!pt) return;
        ponto.style.transform = `translate(${pt[0]}px, ${pt[1]}px) scale(${k})`;
        if (fio) {
          if (retrato) { fio.setAttribute('d', ''); return; }
          const tb = el.querySelector('.texto').getBoundingClientRect(), cr = canvas.getBoundingClientRect();
          const esq = el.dataset.lado === 'e';
          const ax = (esq ? tb.right + 14 : tb.left - 14) - cr.left, ay = tb.top - cr.top + 46;
          const meio = esq ? ax + 60 : ax - 60;
          fio.setAttribute('d', `M${pt[0]},${pt[1]} L${meio},${ay} L${ax},${ay}`);
          fio.style.strokeDashoffset = (1 - k) * 1;
        }
      });
      if (legenda && retrato) {
        const el = pinos[Math.max(0, ativo)];
        legenda.classList.toggle('on', ativo >= 0);
        if (el && legenda.dataset.atual !== el.dataset.pino) {
          legenda.dataset.atual = el.dataset.pino;
          legenda.innerHTML = el.querySelector('.texto').innerHTML;
        }
      }
    }

    function laco() {
      if (rodando) return; rodando = true;
      const passo = () => {
        if (!visivel) { rodando = false; return; }
        const alvo = progresso(sec);
        atual = reduz ? alvo : lerp(atual, alvo, 0.12);
        // fases: gira para a frente, desenrola, depois acende os pontos
        const gira = suave(0, 0.14, atual);
        const e = suave(0.12, 0.66, atual);
        const fase = clamp((atual - 0.7) / 0.28) * 1.0;
        aplicaAbertura(geo, e);
        lata.grupo.rotation.y = lerp(0.9, 0, gira) + Math.sin(atual * 6) * 0.02 * (1 - e);
        lata.grupo.rotation.x = 0;
        lata.grupo.position.z = e * 0.1;
        sombra.scale.set(1 + e * 1.1, 1, 1);
        enquadra(e);
        const pct = Math.round(e * 100);
        if (contador) contador.textContent = String(pct).padStart(3, '0') + '%';
        if (barra) barra.style.transform = `scaleX(${e})`;
        sec.style.setProperty('--e', e.toFixed(3));
        renderer.render(cena, cam);
        desenhaPinos(fase * 1.0 + 0.0001);
        requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    }
  }

  // ---------- início ----------
  async function inicia() {
    if (!T || !suportaWebGL()) { document.documentElement.classList.add('sem-3d'); return; }
    try {
      await Promise.all([
        document.fonts.load(`900 100px ${F_T}`), document.fonts.load(`500 20px ${F_M}`), document.fonts.load(`800 20px ${F_M}`),
        document.fonts.load(`500 20px ${F_C}`), document.fonts.load(`800 20px ${F_C}`),
      ]);
    } catch (e) { /* segue com a fonte que tiver */ }
    // renderizador de apoio: gera as latas paradas dos cards e é descartado
    const rApoio = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    rApoio.setPixelRatio(1); rApoio.setClearColor(0, 0);
    try { renderizaEstaticas(rApoio); } catch (e) { console.error(e); }
    rApoio.dispose(); if (rApoio.forceContextLoss) rApoio.forceContextLoss();
    iniciaHero();
    iniciaRotulo();
    document.documentElement.classList.add('com-3d');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inicia); else inicia();
})();
