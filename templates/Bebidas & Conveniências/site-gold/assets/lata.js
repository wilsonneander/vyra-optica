// Tampinha Gold: a lata da casa (Tampinha Reserva) em 3D, girando conforme a rolagem da seção #reserva.
// Three.js r160 carregado antes como window.THREE. Rótulo desenhado em canvas (mesma arte da lata em SVG).
// Sem WebGL (ou sem THREE) a seção mostra a lata desenhada e os capítulos continuam trocando com a rolagem.
(() => {
  const R = {"nome":"Tampinha Reserva","estilo":"Lager dourada","capitulos":3};
  const secao = document.querySelector('[data-reserva]');
  if (!secao) return;
  const canvas = secao.querySelector('[data-lata]');
  const caps = [...secao.querySelectorAll('[data-cap]')];
  const marcas = [...secao.querySelectorAll('[data-marca-cap]')];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ouro = '#B08D57', marfim = '#F4EEE3';

  // ---------- progresso da rolagem (vale com ou sem 3D) ----------
  let p = 0, capAtual = 0;
  const mede = () => {
    const r = secao.getBoundingClientRect();
    const total = r.height - innerHeight;
    p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    secao.style.setProperty('--p', p.toFixed(4));
    const i = Math.min(R.capitulos - 1, Math.floor(p * R.capitulos * 0.999 + 0.0001));
    if (i !== capAtual) {
      caps.forEach((c, k) => c.classList.toggle('on', k === i));
      marcas.forEach((m, k) => m.classList.toggle('on', k <= i));
      capAtual = i;
    }
    secao.classList.toggle('fim', p > 0.66);
    // no celular os botões flutuantes saem da frente enquanto a lata está na tela
    const r2 = secao.getBoundingClientRect();
    document.body.classList.toggle('na-reserva', r2.top < innerHeight * 0.5 && r2.bottom > innerHeight * 0.5);
  };
  addEventListener('scroll', mede, { passive: true });
  addEventListener('resize', mede);
  mede();

  const T = window.THREE;
  let renderer;
  try {
    if (!T) throw new Error('sem three');
    renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    secao.classList.add('sem-3d');
    return;
  }
  secao.classList.add('com-3d');
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const cena = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, 0.1, 100);

  // ---------- ambiente para os reflexos do metal: uma sala escura com softboxes ----------
  const pmrem = new T.PMREMGenerator(renderer);
  const sala = new T.Scene();
  sala.add(new T.Mesh(new T.BoxGeometry(20, 20, 20), new T.MeshBasicMaterial({ color: 0x050505, side: T.BackSide })));
  const softbox = (w, h, cor, força, pos, rot) => {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(cor).multiplyScalar(força), side: T.DoubleSide }));
    m.position.set(...pos); m.rotation.set(...rot); sala.add(m);
  };
  softbox(3, 9, 0xffffff, 3.2, [-6, 1, 3], [0, Math.PI / 2.6, 0]);
  softbox(2, 9, 0xd9b47a, 2.6, [6, 0, 1], [0, -Math.PI / 2.2, 0]);
  softbox(8, 2, 0xffffff, 1.4, [0, 7, 0], [Math.PI / 2, 0, 0]);
  softbox(1.2, 9, 0xffffff, 1.6, [2.5, 0, -6], [0, 0, 0]);
  cena.environment = pmrem.fromScene(sala, 0.03).texture;

  // ---------- rótulo ----------
  const W = 2048, H = 1024;
  const rotulo = document.createElement('canvas');
  rotulo.width = W; rotulo.height = H;
  const g = rotulo.getContext('2d');
  // pseudoaleatório fixo, para as gotas não mudarem a cada desenho
  let semente = 7;
  const rnd = () => { semente = (semente * 16807) % 2147483647; return (semente - 1) / 2147483646; };
  const desenhaRotulo = () => {
    semente = 7;
    const fundo = g.createLinearGradient(0, 0, 0, H);
    fundo.addColorStop(0, '#0d0c0a'); fundo.addColorStop(0.5, '#090807'); fundo.addColorStop(1, '#0d0c0a');
    g.fillStyle = fundo; g.fillRect(0, 0, W, H);
    g.lineCap = 'round'; g.lineJoin = 'round';
    // serras em volta da lata toda (período fecha na largura para não ter emenda)
    const serra = (y, amp, fase, alpha, lw) => {
      g.beginPath();
      for (let x = 0; x <= W; x += 8) {
        const a = (x / W) * Math.PI * 2;
        const yy = y - Math.abs(Math.sin(a * 9 + fase)) * amp - Math.sin(a * 4 + fase * 2) * amp * 0.55 - Math.sin(a * 17 + fase) * amp * 0.12;
        x ? g.lineTo(x, yy) : g.moveTo(x, yy);
      }
      g.strokeStyle = `rgba(176,141,87,${alpha})`; g.lineWidth = lw; g.stroke();
    };
    serra(390, 70, 0, 0.95, 4);
    serra(430, 52, 1.3, 0.7, 3);
    serra(462, 34, 2.1, 0.5, 2.5);
    serra(488, 20, 3.4, 0.32, 2);
    // hachura fina dentro da primeira serra, como gravura
    g.save(); g.globalAlpha = 0.18; g.strokeStyle = ouro; g.lineWidth = 1.2;
    for (let x = 0; x < W; x += 14) { g.beginPath(); g.moveTo(x, 520); g.lineTo(x + 40, 400); g.stroke(); }
    g.restore();
    g.fillStyle = '#090807'; g.fillRect(0, 500, W, 30);
    // ondas embaixo
    for (let k = 0; k < 6; k++) {
      g.beginPath();
      for (let x = 0; x <= W; x += 6) { const a = (x / W) * Math.PI * 2; const y = 820 + k * 26 + Math.sin(a * 32 + k * 0.9) * 7; x ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.strokeStyle = `rgba(176,141,87,${0.8 - k * 0.12})`; g.lineWidth = 3 - k * 0.3; g.stroke();
    }
    // sol de frente (centro do canvas = frente da lata)
    const cx = W / 2;
    g.beginPath(); g.arc(cx, 205, 108, 0, Math.PI * 2);
    const sol = g.createRadialGradient(cx - 30, 175, 10, cx, 205, 110);
    sol.addColorStop(0, '#E3C48E'); sol.addColorStop(0.6, ouro); sol.addColorStop(1, '#8A6C3F');
    g.fillStyle = sol; g.fill();
    g.beginPath(); g.arc(cx, 205, 138, 0, Math.PI * 2); g.strokeStyle = 'rgba(176,141,87,.5)'; g.lineWidth = 3; g.stroke();
    g.beginPath(); g.arc(cx, 205, 160, 0, Math.PI * 2); g.strokeStyle = 'rgba(176,141,87,.22)'; g.lineWidth = 2; g.stroke();
    // nome
    g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    g.fillStyle = marfim;
    g.font = '500 74px "Bodoni Moda", Georgia, serif';
    if ('letterSpacing' in g) g.letterSpacing = '22px';
    g.fillText('TAMPINHA', cx + 11, 615);
    if ('letterSpacing' in g) g.letterSpacing = '0px';
    g.fillStyle = ouro;
    g.font = 'italic 400 128px "Bodoni Moda", Georgia, serif';
    g.fillText('Reserva', cx, 735);
    g.fillStyle = 'rgba(244,238,227,.72)';
    g.font = '600 30px "Familjen Grotesk", Arial, sans-serif';
    if ('letterSpacing' in g) g.letterSpacing = '10px';
    g.fillText(R.estilo.toUpperCase(), cx + 5, 790);
    // costas da lata (bordas do canvas): texto legal e selo
    const costas = (x) => {
      g.textAlign = 'center';
      g.fillStyle = 'rgba(244,238,227,.8)';
      g.font = '600 22px "Familjen Grotesk", Arial, sans-serif';
      g.fillText('CERVEJA TIPO LAGER', x, 585);
      g.fillStyle = 'rgba(244,238,227,.55)';
      g.font = '400 19px "Familjen Grotesk", Arial, sans-serif';
      if ('letterSpacing' in g) g.letterSpacing = '2px';
      ['ÁGUA, MALTE DE CEVADA E LÚPULO', 'FEITA EM MINAS GERAIS PARA', 'TAMPINHA BEBIDAS & CONVENIÊNCIA', '473 ML   4,9% VOL'].forEach((t, i) => g.fillText(t, x, 625 + i * 30));
      g.fillStyle = ouro;
      g.font = '600 18px "Familjen Grotesk", Arial, sans-serif';
      g.fillText('BEBA COM MODERAÇÃO', x, 772);
      if ('letterSpacing' in g) g.letterSpacing = '0px';
      // tampinha coroa
      g.save(); g.translate(x, 205);
      g.beginPath();
      for (let i = 0; i < 42; i++) { const a = (i * Math.PI) / 21, r = i % 2 ? 62 : 70; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      g.closePath(); g.fillStyle = ouro; g.fill();
      g.beginPath(); g.arc(0, 0, 50, 0, Math.PI * 2); g.fillStyle = '#8A6C3F'; g.fill();
      g.beginPath(); g.arc(0, 0, 43, 0, Math.PI * 2); g.fillStyle = ouro; g.fill();
      g.strokeStyle = '#0B0A09'; g.lineWidth = 9; g.beginPath(); g.moveTo(-2, -26); g.lineTo(-2, 14); g.quadraticCurveTo(-2, 28, 14, 28); g.lineTo(18, 28); g.moveTo(-18, -10); g.lineTo(16, -10); g.stroke();
      g.restore();
    };
    costas(0); costas(W); // costas da lata: metade em cada ponta do canvas, fecham na emenda
    // gotas de condensação: brilho em cima, sombra embaixo
    for (let i = 0; i < 420; i++) {
      const x = rnd() * W, y = rnd() * H, r = 2 + rnd() * rnd() * 11;
      g.beginPath(); g.ellipse(x, y + r * 0.25, r * 0.9, r, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(0,0,0,.35)'; g.fill();
      g.beginPath(); g.ellipse(x, y, r * 0.85, r * 0.95, 0, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.07)'; g.fill();
      g.beginPath(); g.arc(x - r * 0.3, y - r * 0.35, r * 0.28, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.55)'; g.fill();
    }
    // escorridos
    for (let i = 0; i < 14; i++) {
      const x = rnd() * W, y = rnd() * H * 0.5, l = 120 + rnd() * 260;
      const esc = g.createLinearGradient(0, y, 0, y + l); esc.addColorStop(0, 'rgba(255,255,255,0)'); esc.addColorStop(1, 'rgba(255,255,255,.16)');
      g.fillStyle = esc; g.fillRect(x, y, 3, l);
      g.beginPath(); g.arc(x + 1.5, y + l, 5, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,.35)'; g.fill();
    }
  };
  desenhaRotulo();
  const textura = new T.CanvasTexture(rotulo);
  textura.colorSpace = T.SRGBColorSpace;
  textura.wrapS = T.RepeatWrapping;
  textura.offset.x = 0.5; // centro do canvas = frente da lata, virada para a câmera
  textura.anisotropy = renderer.capabilities.getMaxAnisotropy();
  if (document.fonts) document.fonts.load('italic 400 128px "Bodoni Moda"').then(() => document.fonts.ready).then(() => { desenhaRotulo(); textura.needsUpdate = true; });

  // ---------- a lata ----------
  const lata = new T.Group();
  const raio = 0.8, alto = 3.9, meio = alto / 2;
  const metal = new T.MeshStandardMaterial({ color: 0xd8d2c6, metalness: 1, roughness: 0.22, envMapIntensity: 1.2, side: T.DoubleSide });
  const metalEscuro = new T.MeshStandardMaterial({ color: 0x8f897d, metalness: 1, roughness: 0.35 });
  const corpoMat = new T.MeshPhysicalMaterial({ map: textura, metalness: 0.55, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.18, envMapIntensity: 1.1 });
  // corpo com rótulo
  const corpo = new T.Mesh(new T.CylinderGeometry(raio, raio, alto - 0.5, 128, 1, true), corpoMat);
  corpo.position.y = -0.05;
  lata.add(corpo);
  // ombro, pescoço e borda de cima; fundo com cúpula (perfil girado)
  const topo = new T.LatheGeometry([
    new T.Vector2(raio, 0), new T.Vector2(raio * 0.995, 0.06), new T.Vector2(raio * 0.93, 0.22), new T.Vector2(raio * 0.86, 0.32),
    new T.Vector2(raio * 0.86, 0.36), new T.Vector2(raio * 0.89, 0.39), new T.Vector2(raio * 0.88, 0.42), new T.Vector2(raio * 0.83, 0.41),
    new T.Vector2(raio * 0.8, 0.36), new T.Vector2(0, 0.36),
  ].map((v) => new T.Vector2(v.x, v.y)), 96);
  const topoM = new T.Mesh(topo, metal);
  topoM.position.y = meio - 0.3;
  lata.add(topoM);
  const fundo = new T.LatheGeometry([
    new T.Vector2(0, 0.12), new T.Vector2(raio * 0.6, 0.0), new T.Vector2(raio * 0.78, -0.02), new T.Vector2(raio * 0.86, 0.05),
    new T.Vector2(raio * 0.96, 0.18), new T.Vector2(raio, 0.28),
  ], 96);
  const fundoM = new T.Mesh(fundo, metal);
  fundoM.position.y = -meio - 0.03;
  lata.add(fundoM);
  // anel do lacre e a aba
  const lacre = new T.Mesh(new T.TorusGeometry(0.16, 0.035, 12, 40), metalEscuro);
  lacre.rotation.x = Math.PI / 2; lacre.position.set(0, meio + 0.07, 0.32);
  lata.add(lacre);
  const aba = new T.Mesh(new T.CapsuleGeometry(0.13, 0.32, 6, 16), metalEscuro);
  aba.rotation.x = Math.PI / 2; aba.scale.set(1, 1, 0.25); aba.position.set(0, meio + 0.08, 0.05);
  lata.add(aba);
  lata.rotation.order = 'YXZ';
  cena.add(lata);

  // reflexo no chão (cópia invertida e apagada) e anéis na água
  const chaoY = -meio - 0.05;
  const reflexo = lata.clone(true);
  reflexo.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = 0.16; o.material.depthWrite = false; } });
  reflexo.scale.y = -1;
  cena.add(reflexo);
  const aneis = [0, 1, 2].map((i) => {
    const a = new T.Mesh(new T.RingGeometry(0.98, 1.0, 96), new T.MeshBasicMaterial({ color: 0xb08d57, transparent: true, opacity: 0, side: T.DoubleSide, depthWrite: false }));
    a.rotation.x = -Math.PI / 2; a.userData.t = i / 3;
    cena.add(a);
    return a;
  });

  // bolhas e partículas douradas flutuando
  const N = 160;
  const pos = new Float32Array(N * 3), vel = new Float32Array(N);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 9; pos[i * 3 + 1] = (Math.random() - 0.5) * 7; pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1; vel[i] = 0.002 + Math.random() * 0.006; }
  const pGeo = new T.BufferGeometry(); pGeo.setAttribute('position', new T.BufferAttribute(pos, 3));
  const bolinha = document.createElement('canvas'); bolinha.width = bolinha.height = 64;
  const bg = bolinha.getContext('2d'); const rg = bg.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, 'rgba(255,240,210,1)'); rg.addColorStop(0.3, 'rgba(214,180,122,.6)'); rg.addColorStop(1, 'rgba(176,141,87,0)');
  bg.fillStyle = rg; bg.fillRect(0, 0, 64, 64);
  const pontos = new T.Points(pGeo, new T.PointsMaterial({ size: 0.07, map: new T.CanvasTexture(bolinha), transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
  cena.add(pontos);

  // luzes: chave quente de cima, contra-luz dourada atrás e um preenchimento frio fraco
  cena.add(new T.AmbientLight(0xffffff, 0.15));
  const chave = new T.SpotLight(0xfff1dc, 60, 30, 0.5, 0.6); chave.position.set(-4, 7, 6); cena.add(chave);
  const contra = new T.PointLight(0xd9a85c, 40, 20); contra.position.set(3.5, 2, -4); cena.add(contra);
  const fill = new T.PointLight(0x9fb4c8, 6, 20); fill.position.set(4, -1, 5); cena.add(fill);

  // ---------- tamanho e enquadramento ----------
  let estreito = false;
  const ajusta = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    estreito = camera.aspect < 0.9;
    camera.fov = estreito ? 40 : 30;
    camera.updateProjectionMatrix();
  };
  addEventListener('resize', ajusta);
  ajusta();

  // ---------- mouse ----------
  let mx = 0, my = 0;
  if (matchMedia('(pointer: fine)').matches && !calmo) secao.addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });

  // ---------- animação ----------
  const suave = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t * t * (3 - 2 * t);
  const est = { ry: 0, rx: 0, rz: 0, x: 0, y: 0, s: 0.6, z: 11 };
  let visivel = false, relogio = 0, ultimo = performance.now();
  const quadro = (agora) => {
    if (!visivel) return;
    requestAnimationFrame(quadro);
    const dt = Math.min(50, agora - ultimo); ultimo = agora;
    if (!calmo) relogio += dt / 1000;
    // alvo a partir da rolagem: entra subindo, gira uma volta e meia, inclina no fim para mostrar o lacre
    const entrada = ease(Math.min(1, p / 0.12));
    const fim = ease(Math.max(0, (p - 0.72) / 0.28));
    const alvo = {
      ry: -0.5 + p * Math.PI * 3 + mx * 0.4,
      rx: 0.08 + fim * 0.32 + my * 0.12,
      rz: Math.sin(p * Math.PI * 2) * 0.1 - fim * 0.08,
      x: estreito ? 0 : suave(1.55, 1.25, fim),
      y: (estreito ? 0.95 : 0) + (1 - entrada) * -1.6 + Math.sin(relogio * 1.2) * 0.06,
      s: 0.75 + entrada * 0.25,
      z: estreito ? 13.5 : suave(11.5, 10, fim),
    };
    const k = calmo ? 1 : 1 - Math.pow(0.0025, dt / 1000);
    for (const c in est) est[c] = suave(est[c], alvo[c], k);
    lata.rotation.set(est.rx, est.ry, est.rz);
    lata.position.set(est.x, est.y, 0);
    lata.scale.setScalar(est.s);
    reflexo.rotation.set(-est.rx, est.ry, -est.rz);
    const piso = chaoY * est.s + (estreito ? 0.95 : 0);
    reflexo.position.set(est.x, 2 * piso - est.y, 0);
    reflexo.scale.set(est.s, -est.s, est.s);
    camera.position.set(0, 0.3, est.z);
    camera.lookAt(estreito ? 0 : 0.35, estreito ? 0.2 : 0, 0);
    aneis.forEach((a) => {
      const t = calmo ? 0.5 : (a.userData.t + relogio * 0.22) % 1;
      a.position.set(est.x, piso + 0.01, 0);
      a.scale.setScalar(est.s * raio * (1.05 + t * 1.6));
      a.material.opacity = (1 - t) * 0.35;
    });
    if (!calmo) {
      for (let i = 0; i < N; i++) { pos[i * 3 + 1] += vel[i]; if (pos[i * 3 + 1] > 3.6) pos[i * 3 + 1] = -3.6; }
      pGeo.attributes.position.needsUpdate = true;
    }
    pontos.rotation.y = p * 0.8;
    renderer.render(cena, camera);
  };
  new IntersectionObserver(([e]) => {
    visivel = e.isIntersecting;
    if (visivel) { ajusta(); ultimo = performance.now(); requestAnimationFrame(quadro); }
  }, { rootMargin: '200px 0px' }).observe(secao);
})();
