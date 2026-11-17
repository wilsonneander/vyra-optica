/* AURA Fresh, motor 3D do pote (three.js r149, script clássico: abre direto pelo index.html).
   Peças: pote verde fosco com tampa, manga do rótulo (que pode virar folha plana), pó, folhas e copo.
   Cenas: hero do produto (tampa sobe e o pó sai), ritual do clube (dose cai no copo e a água fica verde),
   rótulo que se desenrola com pontos explicados, modal do pote que gira no arrasto e potes parados para os cards. */
(function () {
  'use strict';
  const T = window.THREE, RT = window.AuraRotulo;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BASE = (document.querySelector('meta[name="aura-img"]') || {}).content || 'assets/img/';

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const suave = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };
  const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
  function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function progresso(el) { const r = el.getBoundingClientRect(); const total = r.height - innerHeight; return total > 0 ? clamp(-r.top / total) : 0; }
  function suportaWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

  // ---------- medidas do pote (raio 1) ----------
  const R = 1, CORPO_TOPO = 1.26, TAMPA_BASE = 1.29, TAMPA_TOPO = 2.1;

  // ---------- ambiente de reflexo: estúdio com softboxes ----------
  function criaAmbiente(renderer, tom = 0x6f7a6f) {
    const s = new T.Scene();
    const sala = new T.Mesh(new T.BoxGeometry(1, 1, 1), new T.MeshBasicMaterial({ color: tom, side: T.BackSide }));
    sala.scale.set(30, 20, 30); sala.position.y = 6; s.add(sala);
    const painel = (w, h, d, x, y, z, k, cor = 0xffffff) => {
      const m = new T.MeshBasicMaterial({ color: cor }); m.color.multiplyScalar(k);
      const p = new T.Mesh(new T.BoxGeometry(w, h, d), m); p.position.set(x, y, z); s.add(p);
    };
    painel(16, 0.2, 10, 0, 15.5, 0, 4);
    painel(0.2, 12, 4, -14.8, 6, 3, 9);
    painel(0.2, 10, 3, 14.8, 6, -1, 3.5, 0xf6ffe8);
    painel(8, 8, 0.2, 3, 6, 14.8, 2);
    painel(30, 0.2, 30, 0, -3.9, 0, 0.3);
    const pm = new T.PMREMGenerator(renderer);
    const tex = pm.fromScene(s, 0.04).texture; pm.dispose();
    return tex;
  }
  function texRadial(interno, externo) {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, interno); gr.addColorStop(1, externo); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new T.CanvasTexture(c);
  }
  function criaSombra(op = 0.4, escala = 3.4) {
    const mat = new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: op, depthWrite: false, alphaMap: texRadial('#fff', '#000'), toneMapped: false });
    const s = new T.Mesh(new T.PlaneGeometry(escala, escala), mat); s.rotation.x = -Math.PI / 2; s.position.y = 0.003;
    return s;
  }
  function criaRenderer(canvas) {
    const r = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.setClearColor(0, 0);
    r.outputEncoding = T.sRGBEncoding; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
    return r;
  }

  // ---------- texturas compartilhadas ----------
  let texRot = null, texTampa = null, texPo = null, texPonto = null;
  const texFolhas = {};
  function texturaRotulo() {
    if (!texRot) { texRot = new T.CanvasTexture(RT.desenha()); texRot.encoding = T.sRGBEncoding; texRot.anisotropy = 8; }
    return texRot;
  }
  function texturaTampa() {
    if (!texTampa) { texTampa = new T.CanvasTexture(RT.desenhaTampa()); texTampa.encoding = T.sRGBEncoding; texTampa.anisotropy = 8; }
    return texTampa;
  }
  function texturaPo() {
    // pó verde visto de cima: pontinhos de clorofila sobre verde-lima
    if (texPo) return texPo;
    const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
    g.fillStyle = '#5d7f34'; g.fillRect(0, 0, 512, 512);
    const r = rng(9); const cores = ['#3f6a2a', '#7fa046', '#9cbc5c', '#2d5524', '#b9d27a'];
    for (let i = 0; i < 26000; i++) { g.fillStyle = cores[(r() * cores.length) | 0]; const s = 1 + r() * 2.4; g.fillRect(r() * 512, r() * 512, s, s); }
    texPo = new T.CanvasTexture(c); texPo.wrapS = texPo.wrapT = T.RepeatWrapping; texPo.encoding = T.sRGBEncoding;
    return texPo;
  }
  function texturaPonto() {
    if (!texPonto) texPonto = texRadial('rgba(255,255,255,1)', 'rgba(255,255,255,0)');
    return texPonto;
  }
  function texturaFolha(nome) {
    if (!texFolhas[nome]) { texFolhas[nome] = new T.TextureLoader().load(BASE + 'folha-' + nome + '.png'); texFolhas[nome].encoding = T.sRGBEncoding; }
    return texFolhas[nome];
  }

  // ---------- geometrias ----------
  function geoCorpo() {
    const p = [[0, 0], [0.9, 0], [0.97, 0.012], [0.99, 0.04], [0.994, 0.08], [0.994, CORPO_TOPO - 0.02], [0.98, CORPO_TOPO], [0.93, CORPO_TOPO + 0.06], [0.93, CORPO_TOPO + 0.1]];
    return new T.LatheGeometry(p.map(v => new T.Vector2(v[0], v[1])), 96);
  }
  function geoTampa() {
    // tampa em coordenadas locais (base em y = 0): parede e aba arredondada; o disco de cima é outra malha
    const h = TAMPA_TOPO - TAMPA_BASE;
    const p = [[0.95, 0.02], [0.98, 0], [0.994, 0.02], [0.996, h - 0.07], [0.99, h - 0.025], [0.972, h], [0.94, h + 0.004]];
    return new T.LatheGeometry(p.map(v => new T.Vector2(v[0], v[1])), 96);
  }
  // manga do rótulo (parte do corpo ou da tampa): cilindro que pode virar folha (e = 0 enrolado, e = 1 aberto)
  const SEG_U = 160;
  function geoManga(v0, v1) {
    const geo = new T.PlaneGeometry(1, 1, SEG_U, 2);
    const uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setY(i, v0 + uv.getY(i) * (v1 - v0));
    aplicaAbertura(geo, 0);
    return geo;
  }
  function aplicaAbertura(geo, e, dy = 0) {
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    const raio = RT.RAIO, C = Math.PI * 2 * raio, L = e * C / 2;
    for (let i = 0; i < pos.count; i++) {
      const u = uv.getX(i), v = uv.getY(i);
      const s = (u - 0.5) * C, a = Math.abs(s), sg = Math.sign(s) || 1;
      let x, z;
      if (a <= L) { x = s; z = raio; } else { const f = (a - L) / raio; x = sg * (L + raio * Math.sin(f)); z = raio * Math.cos(f); }
      pos.setXYZ(i, x, RT.Y0 + v * RT.H - dy, z);
    }
    pos.needsUpdate = true; geo.computeVertexNormals(); geo.computeBoundingSphere();
  }
  // as duas mangas, separadas na fenda entre corpo e tampa
  const V_CORPO = (RT.CORTE_Y - RT.Y0) / RT.H, V_TAMPA = V_CORPO;

  // ---------- materiais ----------
  const mats = {};
  function materiais() {
    if (mats.verde) return mats;
    mats.verde = new T.MeshPhysicalMaterial({ color: 0x22392a, roughness: 0.58, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.45 });
    mats.verdeLado = new T.MeshPhysicalMaterial({ color: 0x22392a, roughness: 0.58, clearcoat: 0.3, clearcoatRoughness: 0.45, side: T.DoubleSide });
    mats.rotulo = new T.MeshPhysicalMaterial({ map: texturaRotulo(), roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.4, side: T.FrontSide });
    mats.verso = new T.MeshStandardMaterial({ color: 0xe7ebdd, roughness: 0.8, side: T.BackSide });
    mats.tampaTopo = new T.MeshPhysicalMaterial({ map: texturaTampa(), roughness: 0.5, clearcoat: 0.4, clearcoatRoughness: 0.35 });
    mats.vidro = new T.MeshPhysicalMaterial({ color: 0xdfeee0, roughness: 0.25, transparent: true, opacity: 0.28, clearcoat: 1, clearcoatRoughness: 0.15, side: T.DoubleSide, depthWrite: false });
    mats.po = new T.MeshStandardMaterial({ map: texturaPo(), roughness: 0.95 });
    mats.interno = new T.MeshStandardMaterial({ color: 0x15241a, roughness: 0.9, side: T.BackSide });
    return mats;
  }

  // ---------- pote montado ----------
  function criaPote(opts = {}) {
    const m = materiais();
    const grupo = new T.Group();
    const geoC = opts.geoCorpo || geoManga(0, V_CORPO);
    const geoT = opts.geoTampa || geoManga(V_TAMPA, 1);

    // corpo: verde fosco, ou vidro com o pó dentro quando a cena revela o conteúdo
    const corpo = new T.Mesh(geoCorpo(), opts.revela ? m.vidro : m.verde); grupo.add(corpo);
    const boca = new T.Mesh(new T.CircleGeometry(0.93, 64), m.interno); boca.rotation.x = -Math.PI / 2; boca.position.y = CORPO_TOPO + 0.1; grupo.add(boca);
    const po = new T.Mesh(new T.CylinderGeometry(0.93, 0.95, 1.05, 64, 1, false), m.po); po.position.y = 0.58;
    po.visible = !!opts.revela || !!opts.po; grupo.add(po);
    if (opts.po && !opts.revela) { po.geometry = new T.CircleGeometry(0.92, 64); po.rotation.x = -Math.PI / 2; po.position.y = CORPO_TOPO + 0.02; }

    const mangaC = new T.Mesh(geoC, m.rotulo); grupo.add(mangaC);
    const versoC = new T.Mesh(geoC, m.verso); grupo.add(versoC);

    // tampa: pivô na base da tampa para poder subir e girar
    const tampa = new T.Group(); tampa.position.y = TAMPA_BASE; grupo.add(tampa);
    const parede = new T.Mesh(geoTampa(), m.verdeLado); tampa.add(parede);
    const topo = new T.Mesh(new T.CircleGeometry(0.945, 96), m.tampaTopo); topo.rotation.x = -Math.PI / 2; topo.position.y = TAMPA_TOPO - TAMPA_BASE + 0.004; tampa.add(topo);
    const dentro = new T.Mesh(new T.CircleGeometry(0.96, 64), m.interno); dentro.rotation.x = Math.PI / 2; dentro.position.y = 0.06; tampa.add(dentro);
    const mangaT = new T.Mesh(geoT, m.rotulo); mangaT.position.y = -TAMPA_BASE; tampa.add(mangaT);
    const versoT = new T.Mesh(geoT, m.verso); versoT.position.y = -TAMPA_BASE; tampa.add(versoT);

    return { grupo, tampa, corpo, po, geoC, geoT, mangaC, mangaT };
  }

  // ---------- partículas de pó ----------
  function criaPo(n, seed, cores) {
    const r = rng(seed);
    const geo = new T.BufferGeometry();
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    const dados = [];
    const c = new T.Color();
    for (let i = 0; i < n; i++) {
      c.set(cores[(r() * cores.length) | 0]); col.set([c.r, c.g, c.b], i * 3);
      const ang = r() * Math.PI * 2, rad = Math.sqrt(r()) * 0.85;
      dados.push({ ang, rad, sobe: 0.6 + r() * 2.6, abre: 0.4 + r() * 1.8, gira: (r() - 0.5) * 2, atraso: r() * 0.35, tam: r() });
    }
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    geo.setAttribute('color', new T.BufferAttribute(col, 3));
    const mat = new T.PointsMaterial({ size: 0.05, map: texturaPonto(), vertexColors: true, transparent: true, depthWrite: false, opacity: 0.95, sizeAttenuation: true });
    const pts = new T.Points(geo, mat);
    return { pts, geo, dados, pos, mat };
  }

  // ---------- folhas que voam (hortelã e salsa) ----------
  function criaFolhas(n, seed) {
    const r = rng(seed), grupo = new T.Group(), lista = [];
    for (let i = 0; i < n; i++) {
      const nome = i % 3 === 2 ? 'salsa' : 'hortela';
      const mat = new T.MeshStandardMaterial({ map: texturaFolha(nome), transparent: true, alphaTest: 0.35, side: T.DoubleSide, roughness: 0.6 });
      const tam = 0.45 + r() * 0.5;
      const f = new T.Mesh(new T.PlaneGeometry(tam, tam), mat);
      grupo.add(f);
      lista.push({ f, ang: r() * Math.PI * 2, raio: 1.6 + r() * 1.5, alt: 0.2 + r() * 2.6, vel: 0.6 + r() * 1.2, rx: r() * 6, ry: r() * 6, atraso: r() * 0.25 });
    }
    return { grupo, lista };
  }

  // ---------- potes parados para os cards (renderizados uma vez e trocados por <img>) ----------
  function renderizaEstaticos(renderer) {
    const imgs = [...document.querySelectorAll('img[data-pote]')];
    if (!imgs.length) return;
    const W = 640, H = 520;
    renderer.setSize(W, H, false);
    const cena = new T.Scene(); cena.environment = criaAmbiente(renderer);
    const luz = new T.DirectionalLight(0xffffff, 0.8); luz.position.set(-4, 7, 6); cena.add(luz);
    const cam = new T.PerspectiveCamera(24, W / H, 0.5, 100);
    const potes = [criaPote(), criaPote(), criaPote()];
    const arranjos = {
      1: [[0, 0, 0, -0.35]],
      2: [[-0.62, 0, -0.5, -0.1], [0.62, 0, 0.45, -0.55]],
      3: [[-1.15, 0, -0.9, 0.1], [1.15, 0, -0.9, -0.75], [0, 0, 0.55, -0.35]],
    };
    potes.forEach(p => cena.add(p.grupo));
    const sombras = potes.map(() => { const s = criaSombra(0.45, 3.2); cena.add(s); return s; });
    const cache = {};
    imgs.forEach(img => {
      const n = +img.dataset.pote || 1;
      if (!cache[n]) {
        potes.forEach((p, i) => {
          const a = arranjos[n][i]; p.grupo.visible = sombras[i].visible = !!a;
          if (a) { p.grupo.position.set(a[0], a[1], a[2]); p.grupo.rotation.y = a[3]; sombras[i].position.set(a[0], 0.003, a[2]); }
        });
        const larg = n === 1 ? 2.6 : n === 2 ? 4 : 5;
        const tanV = Math.tan(T.MathUtils.degToRad(cam.fov / 2)) * 2;
        const d = Math.max(3 / tanV, larg / (tanV * cam.aspect)) + 1.2;
        cam.position.set(0, 2.3, d); cam.lookAt(0, 1.02, 0);
        renderer.render(cena, cam);
        cache[n] = renderer.domElement.toDataURL('image/png');
      }
      img.src = cache[n]; img.classList.add('pronta');
    });
  }

  // ---------- HERO do produto: tampa sobe, o pó sai e as folhas giram ----------
  function iniciaHeroProduto() {
    const sec = document.querySelector('[data-hero-pote]');
    const canvas = sec && sec.querySelector('canvas.hero-3d');
    if (!canvas) return;
    const renderer = criaRenderer(canvas);
    const cena = new T.Scene(); cena.environment = criaAmbiente(renderer);
    const luz = new T.DirectionalLight(0xf4ffe6, 0.9); luz.position.set(-5, 8, 6); cena.add(luz);
    const contra = new T.DirectionalLight(0xc4d997, 0.7); contra.position.set(5, 3, -6); cena.add(contra);
    const cam = new T.PerspectiveCamera(28, 1, 0.3, 200);

    const pote = criaPote({ po: true }); cena.add(pote.grupo);
    const laterais = [criaPote(), criaPote()];
    laterais.forEach(l => { l.grupo.scale.setScalar(0.001); cena.add(l.grupo); });
    const sombra = criaSombra(0.5, 3.6); cena.add(sombra);
    const po = criaPo(reduz ? 300 : 2200, 21, ['#c4d997', '#9cbc5c', '#5f8f2f', '#2f6b3a', '#e3eec4']); cena.add(po.pts);
    const folhas = criaFolhas(14, 33); cena.add(folhas.grupo);

    const legendas = [...sec.querySelectorAll('[data-fase]')];
    let W = 0, H = 0, retrato = false, mx = 0, my = 0, tmx = 0, tmy = 0;
    let kit = 1, kitK = 0;
    function ajusta() {
      W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return;
      renderer.setSize(W, H, false); cam.aspect = W / H; retrato = W / H < 0.85;
    }
    new ResizeObserver(ajusta).observe(canvas); ajusta();
    addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; tmx = e.clientX / innerWidth - 0.5; tmy = e.clientY / innerHeight - 0.5; }, { passive: true });
    document.addEventListener('aura:kit', e => { kit = e.detail.potes; });

    let atual = 0, rodando = false, visivel = true;
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) laco(); }).observe(sec);

    function quadro(p, agora) {
      mx = lerp(mx, tmx, 0.06); my = lerp(my, tmy, 0.06);
      const t = agora / 1000;
      const abre = suave(0.08, 0.42, p), sopro = suave(0.14, 0.7, p), fim = suave(0.72, 1, p);
      // pote gira devagar e mostra a frente no fim
      pote.grupo.rotation.y = lerp(-0.55, 0.25, p) + mx * 0.5 + (reduz ? 0 : Math.sin(t * 0.6) * 0.03);
      pote.grupo.rotation.x = my * 0.12;
      pote.grupo.position.y = reduz ? 0 : Math.sin(t * 1.1) * 0.03;
      // tampa sobe, inclina e volta a fechar no fim
      const tampaK = abre * (1 - fim);
      pote.tampa.position.set(lerp(0, 0.95, tampaK), TAMPA_BASE + tampaK * 1.25, lerp(0, -0.25, tampaK));
      pote.tampa.rotation.set(tampaK * 0.35, 0, -tampaK * 0.62);
      // nuvem de pó saindo da boca do pote
      for (let i = 0; i < po.dados.length; i++) {
        const d = po.dados[i];
        const k = clamp((sopro - d.atraso) / (1 - d.atraso)) * (1 - fim * 0.85);
        const ang = d.ang + k * d.gira * 2.2 + t * 0.15 * d.gira;
        const rad = d.rad * (1 + k * d.abre * 1.6);
        po.pos[i * 3] = Math.cos(ang) * rad + mx * k * 0.6;
        po.pos[i * 3 + 1] = CORPO_TOPO + 0.05 + k * d.sobe - k * k * d.sobe * 0.35;
        po.pos[i * 3 + 2] = Math.sin(ang) * rad;
      }
      po.geo.attributes.position.needsUpdate = true;
      po.mat.opacity = 0.95 * suave(0.12, 0.2, p) * (1 - fim * 0.9);
      po.mat.size = retrato ? 0.05 : 0.04;
      // folhas em órbita
      folhas.lista.forEach((f, i) => {
        const k = clamp((suave(0.1, 0.55, p) - f.atraso) / (1 - f.atraso)) * (1 - fim * 0.6);
        const ang = f.ang + p * f.vel * 4 + (reduz ? 0 : t * 0.08);
        f.f.position.set(Math.cos(ang) * f.raio * k, 0.4 + f.alt * k, Math.sin(ang) * f.raio * k - 0.2);
        f.f.rotation.set(f.rx + p * 3, f.ry + p * 2, 0);
        f.f.scale.setScalar(Math.max(0.001, k));
      });
      // potes do kit entram dos lados
      kitK = lerp(kitK, kit, 0.08);
      laterais.forEach((l, i) => {
        const k = clamp(kitK - 1 - i), lado = i === 0 ? -1 : 1;
        l.grupo.scale.setScalar(Math.max(0.001, easeOut(k) * 0.82));
        l.grupo.position.set(lado * lerp(1.2, 2.25, easeOut(k)), 0, -1.1);
        l.grupo.rotation.y = -0.4 + lado * 0.5 + mx * 0.4;
      });
      sombra.scale.setScalar(1 + (kitK - 1) * 0.6);
      // câmera: aproxima no meio e abre no fim
      const tanV = Math.tan(T.MathUtils.degToRad(cam.fov / 2)) * 2;
      const alvoAlt = lerp(4.6, 5.6, abre) - fim * 1;
      const alvoLarg = retrato ? 4.4 : 6.2 + (kitK - 1) * 1.2;
      const d = Math.max(alvoAlt / tanV, alvoLarg / (tanV * cam.aspect));
      cam.position.set(mx * -0.8, lerp(2.2, 2.6, abre) + my * 0.4, d);
      cam.lookAt(0, lerp(1.05, 1.5, abre * (1 - fim)), 0);
      cam.setViewOffset(W, H, retrato ? 0 : -W * 0.16, retrato ? H * 0.12 : 0, W, H);
      cam.updateProjectionMatrix();
      renderer.render(cena, cam);
      // legendas por fase
      legendas.forEach(el => { const [a, b] = el.dataset.fase.split(',').map(Number); el.classList.toggle('on', p >= a && p < b); });
      sec.style.setProperty('--p', p.toFixed(3));
    }
    function laco() {
      if (rodando) return; rodando = true;
      const passo = agora => {
        if (!visivel) { rodando = false; return; }
        const alvo = progresso(sec);
        atual = reduz ? alvo : lerp(atual, alvo, 0.1);
        quadro(atual, agora);
        requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    }
    laco();
  }

  // ---------- RITUAL do clube: a dose cai no copo e a água fica verde ----------
  function iniciaRitual() {
    const sec = document.querySelector('[data-ritual]');
    const canvas = sec && sec.querySelector('canvas.ritual-3d');
    if (!canvas) return;
    const renderer = criaRenderer(canvas);
    const cena = new T.Scene(); cena.environment = criaAmbiente(renderer, 0x8a8f86);
    const luz = new T.DirectionalLight(0xffffff, 0.9); luz.position.set(-5, 9, 6); cena.add(luz);
    const cam = new T.PerspectiveCamera(26, 1, 0.3, 200);

    // pote aberto à esquerda, tampa encostada
    const pote = criaPote({ po: true });
    pote.grupo.position.set(-1.7, 0, -0.3); pote.grupo.rotation.y = 0.45; cena.add(pote.grupo);
    // tampa deitada de boca para cima, atrás do pote
    pote.tampa.position.set(0.15, TAMPA_TOPO - TAMPA_BASE + 0.004, -1.75); pote.tampa.rotation.set(Math.PI, 0, 0);
    const sP = criaSombra(0.4, 3.2); sP.position.set(-1.7, 0.003, -0.3); cena.add(sP);

    // copo de vidro e água
    const perfil = [[0, 0.02], [0.62, 0.02], [0.66, 0.04], [0.7, 0.2], [0.78, 2.1], [0.8, 2.12], [0.76, 2.12], [0.72, 0.2], [0.68, 0.1], [0, 0.1]];
    const copo = new T.Mesh(new T.LatheGeometry(perfil.map(v => new T.Vector2(v[0], v[1])), 72), new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, transparent: true, opacity: 0.13, clearcoat: 1, side: T.DoubleSide, depthWrite: false, envMapIntensity: 1.6 }));
    const xCopo = 1.0; copo.position.x = xCopo; cena.add(copo);
    const aguaMat = new T.MeshStandardMaterial({ color: 0xe9f3f0, emissive: 0x000000, roughness: 0.25, metalness: 0, envMapIntensity: 0.4, transparent: true, opacity: 0.35, depthWrite: false });
    const emLimpa = new T.Color(0x000000), emVerde = new T.Color(0x174a1c);
    const agua = new T.Mesh(new T.CylinderGeometry(0.75, 0.69, 1, 64, 1, false), aguaMat); agua.position.x = xCopo; cena.add(agua);
    const sC = criaSombra(0.25, 2.4); sC.position.set(xCopo, 0.003, 0); cena.add(sC);
    const corLimpa = new T.Color(0xe9f3f0), corVerde = new T.Color(0x1d5a22);

    // colher dosadora
    const colher = new T.Group();
    const concha = new T.Mesh(new T.CylinderGeometry(0.24, 0.2, 0.22, 40, 1, true), mats.verdeLado || materiais().verdeLado);
    const cabo = new T.Mesh(new T.BoxGeometry(0.9, 0.05, 0.12), materiais().verde); cabo.position.set(-0.6, 0.06, 0);
    const doseTopo = new T.Mesh(new T.CircleGeometry(0.22, 32), materiais().po); doseTopo.rotation.x = -Math.PI / 2; doseTopo.position.y = 0.09;
    colher.add(concha, cabo, doseTopo); cena.add(colher);

    // pó caindo e girando dentro do copo
    const queda = criaPo(reduz ? 200 : 1300, 41, ['#5f8f2f', '#9cbc5c', '#2f6b3a', '#c4d997']); cena.add(queda.pts);

    const legendas = [...sec.querySelectorAll('[data-fase]')];
    let W = 0, H = 0, retrato = false;
    function ajusta() { W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return; renderer.setSize(W, H, false); cam.aspect = W / H; retrato = W / H < 0.85; }
    new ResizeObserver(ajusta).observe(canvas); ajusta();

    let atual = 0, rodando = false, visivel = false;
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) laco(); }, { rootMargin: '100px' }).observe(sec);

    function quadro(p, agora) {
      const t = agora / 1000;
      const enche = suave(0.04, 0.3, p);      // água sobe no copo
      const pega = suave(0.22, 0.42, p);      // colher vai do pote ao copo
      const vira = suave(0.42, 0.52, p);      // colher vira
      const cai = suave(0.44, 0.7, p);        // pó cai
      const mistura = suave(0.5, 0.78, p);    // água fica verde
      // água
      const nivel = 0.15 + enche * 1.55;
      agua.scale.y = nivel; agua.position.y = 0.1 + nivel / 2;
      aguaMat.color.copy(corLimpa).lerp(corVerde, mistura); aguaMat.emissive.copy(emLimpa).lerp(emVerde, mistura); aguaMat.opacity = lerp(0.3, 0.97, mistura);
      // colher: sai de dentro do pote, faz um arco e para sobre o copo
      const px = lerp(-1.7, xCopo - 0.05, pega), py = lerp(1.1, 2.9, Math.sin(pega * Math.PI) * 0.5 + pega * 0.6);
      colher.position.set(px, py, lerp(-0.3, 0, pega));
      colher.rotation.set(0, 0, vira * 2.3);
      doseTopo.visible = cai < 0.15;
      colher.visible = p < 0.8; colher.scale.setScalar(1 - suave(0.7, 0.8, p) * 0.999);
      // partículas: caem num funil e depois giram em espiral dentro da água
      for (let i = 0; i < queda.dados.length; i++) {
        const d = queda.dados[i];
        const k = clamp((cai - d.atraso * 0.6) / 0.6);
        const topo = 2.7, fundo = 0.1 + nivel * (0.25 + d.tam * 0.7);
        let x, y, z;
        if (k < 1) { const r0 = 0.05 + k * 0.25; x = xCopo + Math.cos(d.ang) * d.rad * r0; y = lerp(topo, fundo, k * k); z = Math.sin(d.ang) * d.rad * r0; }
        else { const ang = d.ang + t * (0.8 + d.gira) * (1 - mistura * 0.6); const rr = d.rad * 0.7 * (0.3 + mistura * 0.7); x = xCopo + Math.cos(ang) * rr; y = fundo; z = Math.sin(ang) * rr; }
        queda.pos[i * 3] = x; queda.pos[i * 3 + 1] = y; queda.pos[i * 3 + 2] = z;
      }
      queda.geo.attributes.position.needsUpdate = true;
      queda.mat.opacity = suave(0.44, 0.48, p) * (1 - mistura * 0.92); queda.mat.size = 0.07;
      // câmera: plano aberto da mesa, fecha no copo no fim
      const zoom = suave(0.7, 1, p);
      const tanV = Math.tan(T.MathUtils.degToRad(cam.fov / 2)) * 2;
      // a mesa inteira (pote, tampa e copo) cabe na metade direita da tela
      const larg = retrato ? lerp(5.6, 5, zoom) : lerp(8.4, 7.6, zoom), alt = retrato ? 5.4 : 4.2;
      const d = Math.max(alt / tanV, larg / (tanV * cam.aspect));
      const foco = lerp(-0.3, -0.1, zoom);
      cam.position.set(foco + 0.6, lerp(2.7, 2.3, zoom), d);
      cam.lookAt(foco, 1.0, 0);
      cam.setViewOffset(W, H, retrato ? 0 : -W * 0.16, retrato ? -H * 0.14 : 0, W, H);
      cam.updateProjectionMatrix();
      renderer.render(cena, cam);
      legendas.forEach(el => { const [a, b] = el.dataset.fase.split(',').map(Number); el.classList.toggle('on', p >= a && p < b); });
      sec.style.setProperty('--p', p.toFixed(3));
      sec.style.setProperty('--mix', mistura.toFixed(3));
    }
    function laco() {
      if (rodando) return; rodando = true;
      const passo = agora => {
        if (!visivel) { rodando = false; return; }
        const alvo = progresso(sec);
        atual = reduz ? alvo : lerp(atual, alvo, 0.1);
        quadro(atual, agora);
        requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    }
  }

  // ---------- RÓTULO: o scroll tira o rótulo do pote até virar folha ----------
  function iniciaRotulo() {
    const sec = document.querySelector('[data-rotulo]');
    const canvas = sec && sec.querySelector('canvas.rotulo-3d');
    if (!canvas) return;
    const renderer = criaRenderer(canvas);
    const claro = sec.dataset.rotulo === 'claro';
    const cena = new T.Scene(); cena.environment = criaAmbiente(renderer, claro ? 0x9a9f96 : 0x6f7a6f);
    const luz = new T.DirectionalLight(0xffffff, 0.75); luz.position.set(-4, 7, 9); cena.add(luz);
    cena.add(new T.HemisphereLight(0xffffff, 0x2b3a2e, claro ? 0.5 : 0.7));
    const cam = new T.PerspectiveCamera(24, 1, 0.3, 200);
    const pote = criaPote({ revela: true }); cena.add(pote.grupo);
    const sombra = criaSombra(claro ? 0.22 : 0.4, 3.8); cena.add(sombra);

    const contador = sec.querySelector('[data-pct]');
    const barra = sec.querySelector('[data-pct-barra]');
    const pinos = [...sec.querySelectorAll('[data-pino]')];
    const svg = sec.querySelector('svg.fios');
    const legenda = sec.querySelector('[data-legenda]');
    const pv = new T.Vector3();

    let W = 0, H = 0, retrato = false;
    function ajusta() {
      W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return;
      renderer.setSize(W, H, false); cam.aspect = W / H; retrato = W / H < 0.95;
      if (svg) svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    }
    new ResizeObserver(ajusta).observe(canvas); ajusta();

    function enquadra(e) {
      const tanV = Math.tan(T.MathUtils.degToRad(cam.fov / 2)) * 2;
      const dPote = (2.3 / (retrato ? 0.42 : 0.5)) / tanV;
      const larguraAlvo = retrato ? 0.94 : 0.5;
      const dFolha = Math.max((RT.C / larguraAlvo) / (tanV * cam.aspect), (RT.H / 0.42) / tanV);
      const d = lerp(dPote, dFolha, suave(0, 1, e));
      const yAlvo = lerp(1.0, RT.Y0 + RT.H / 2, e);
      cam.position.set(0, yAlvo + lerp(1.1, 0.05, e), d);
      cam.lookAt(0, yAlvo, 0);
      cam.setViewOffset(W, H, 0, retrato ? -H * 0.02 : -H * lerp(0.06, 0.02, e), W, H);
      cam.updateProjectionMatrix();
    }

    let atual = 0, rodando = false, visivel = false;
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) laco(); }, { rootMargin: '100px' }).observe(sec);

    function posPino(nome) {
      const p = RT.pontos[nome]; if (!p) return null;
      pv.set((p[0] / RT.LW - 0.5) * RT.C, RT.Y0 + (1 - p[1] / RT.LH) * RT.H, RT.RAIO);
      pote.grupo.localToWorld(pv); pv.project(cam);
      return [(pv.x + 1) / 2 * W, (1 - pv.y) / 2 * H];
    }
    function desenhaPinos(fase) {
      let ativo = -1;
      pinos.forEach((el, i) => {
        const k = clamp((fase - i * 0.13) / 0.18);
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
          const ax = (esq ? tb.right + 14 : tb.left - 14) - cr.left, ay = tb.top - cr.top + 40;
          const meio = esq ? ax + 50 : ax - 50;
          fio.setAttribute('d', `M${pt[0]},${pt[1]} L${meio},${ay} L${ax},${ay}`);
          fio.style.strokeDashoffset = (1 - k);
        }
      });
      if (legenda && retrato) {
        const el = pinos[Math.max(0, ativo)];
        legenda.classList.toggle('on', ativo >= 0);
        if (el && legenda.dataset.atual !== el.dataset.pino) { legenda.dataset.atual = el.dataset.pino; legenda.innerHTML = el.querySelector('.texto').innerHTML; }
      }
    }
    function laco() {
      if (rodando) return; rodando = true;
      const passo = () => {
        if (!visivel) { rodando = false; return; }
        const alvo = progresso(sec);
        atual = reduz ? alvo : lerp(atual, alvo, 0.12);
        const gira = suave(0, 0.14, atual);
        const e = suave(0.12, 0.64, atual);
        const fase = clamp((atual - 0.68) / 0.3);
        // a manga da tampa abre junto, alinhada à do corpo
        aplicaAbertura(pote.geoC, e);
        aplicaAbertura(pote.geoT, e);
        pote.grupo.rotation.y = lerp(1.2, 0, gira);
        pote.grupo.position.z = e * 0.12;
        // a tampa sobe um pouco quando a folha abre, para revelar o pó
                sombra.scale.set(1 + e * 1.6, 1, 1);
        enquadra(e);
        if (contador) contador.textContent = Math.round(e * 100) + '%';
        if (barra) barra.style.transform = `scaleX(${e})`;
        sec.style.setProperty('--e', e.toFixed(3));
        renderer.render(cena, cam);
        desenhaPinos(fase + 0.0001);
        requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    }
  }

  // ---------- MODAL: pote grande que gira no arrasto e pote pequeno mostrando o verso ----------
  function iniciaModal() {
    const canvas = document.querySelector('canvas.modal-3d');
    if (!canvas) return;
    let renderer = null, cena, cam, grande, pequeno, sG, sP;
    let aberto = false, rodando = false, t0 = 0, rot = 0, rotAlvo = 0, arrasto = null, ultimoX = 0, inercia = 0;
    function cria() {
      renderer = criaRenderer(canvas);
      cena = new T.Scene(); cena.environment = criaAmbiente(renderer);
      const luz = new T.DirectionalLight(0xffffff, 0.8); luz.position.set(-5, 9, 8); cena.add(luz);
      cam = new T.PerspectiveCamera(26, 1, 0.3, 200);
      grande = criaPote(); cena.add(grande.grupo);
      pequeno = criaPote(); pequeno.grupo.scale.setScalar(0.55); cena.add(pequeno.grupo);
      sG = criaSombra(0.4, 3.4); cena.add(sG); sP = criaSombra(0.3, 2); cena.add(sP);
      new ResizeObserver(ajusta).observe(canvas); ajusta();
      canvas.addEventListener('pointerdown', e => { arrasto = e.pointerId; ultimoX = e.clientX; inercia = 0; canvas.setPointerCapture(e.pointerId); canvas.classList.add('girando'); });
      canvas.addEventListener('pointermove', e => { if (arrasto !== e.pointerId) return; const dx = e.clientX - ultimoX; ultimoX = e.clientX; rotAlvo += dx * 0.012; inercia = dx * 0.012; });
      const solta = () => { arrasto = null; canvas.classList.remove('girando'); };
      canvas.addEventListener('pointerup', solta); canvas.addEventListener('pointercancel', solta);
    }
    function ajusta() {
      const W = canvas.clientWidth, H = canvas.clientHeight; if (!W || !H) return;
      renderer.setSize(W, H, false); cam.aspect = W / H;
      const tanV = Math.tan(T.MathUtils.degToRad(cam.fov / 2)) * 2;
      const d = Math.max(3.4 / tanV, 4.4 / (tanV * cam.aspect));
      cam.position.set(0.3, 2.2, d); cam.lookAt(0.3, 0.95, 0); cam.updateProjectionMatrix();
    }
    function laco() {
      if (rodando) return; rodando = true;
      const passo = now => {
        if (!aberto) { rodando = false; return; }
        const e = easeOut(clamp((now - t0) / 900)), e2 = easeOut(clamp((now - t0 - 220) / 900));
        if (arrasto === null) { rotAlvo += inercia; inercia *= 0.93; if (!reduz) rotAlvo += 0.003; }
        rot = lerp(rot, rotAlvo, 0.12);
        grande.grupo.position.set(-0.45, lerp(1.6, 0, e), 0);
        grande.grupo.rotation.y = -0.2 + rot + (1 - e) * 3;
        const bob = reduz ? 0 : Math.sin(now / 900) * 0.04;
        pequeno.grupo.position.set(lerp(3.4, 1.65, e2), 0.15 + bob, 0.9);
        pequeno.grupo.rotation.set(0, Math.PI + 0.5, -0.12);
        sG.position.set(-0.45, 0.003, 0); sG.material.opacity = 0.4 * e;
        sP.position.set(1.65, 0.003, 0.9); sP.material.opacity = 0.3 * e2;
        renderer.render(cena, cam);
        requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    }
    document.addEventListener('aura:pote-abre', () => { if (!renderer) cria(); t0 = performance.now(); rot = rotAlvo = 0; ajusta(); aberto = true; laco(); });
    document.addEventListener('aura:pote-fecha', () => { aberto = false; });
  }

  // ---------- início ----------
  async function inicia() {
    if (!T || !RT || !suportaWebGL()) { document.documentElement.classList.add('sem-3d'); return; }
    try { await RT.carrega(BASE); } catch (e) { /* segue com o que tiver */ }
    const apoio = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    apoio.setPixelRatio(1); apoio.setClearColor(0, 0); apoio.outputEncoding = T.sRGBEncoding; apoio.toneMapping = T.ACESFilmicToneMapping;
    try { renderizaEstaticos(apoio); } catch (e) { console.error(e); }
    apoio.dispose(); if (apoio.forceContextLoss) apoio.forceContextLoss();
    iniciaHeroProduto();
    iniciaRitual();
    iniciaRotulo();
    iniciaModal();
    document.documentElement.classList.add('com-3d');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inicia); else inicia();
})();
