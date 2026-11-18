/* AURA Fresh, motor 3D do pote (three.js r149, script clássico: abre direto pelo index.html).
   Peças: pote verde fosco com tampa, manga do rótulo (que pode virar folha plana), pó, folhas e copo.
   Cenas: hero do produto (tampa sobe e o pó sai), ritual do clube (dose cai no copo e a água fica verde),
   rótulo que se desenrola com pontos explicados, modal do pote que gira no arrasto e potes parados para os cards. */
(function () {
  'use strict';
  const T = window.THREE, RT = window.AuraRotulo;
  // cores em hexadecimal tratadas como sRGB (no r149 o padrão antigo as clareia na saída)
  if (T && T.ColorManagement) T.ColorManagement.legacyMode = false;
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
  const R = 1, CORPO_TOPO = 1.275, TAMPA_BASE = 1.275, TAMPA_TOPO = 2.1; // corpo e tampa se encontram na fenda do rótulo (RT.CORTE_Y)

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
    const po = new T.Mesh(new T.CylinderGeometry(0.93, 0.95, 1.05, 64, 1, false), m.po); po.position.y = 0.58;
    po.visible = !!opts.revela || !!opts.po; grupo.add(po);
    if (opts.po && !opts.revela) {
      // pote aberto: parede interna escura e o pó um pouco abaixo da boca, sem nada passando da borda
      const nivel = CORPO_TOPO - 0.16, boca = CORPO_TOPO + 0.1;
      const parede = new T.Mesh(new T.CylinderGeometry(0.922, 0.922, boca - nivel, 64, 1, true), m.interno);
      parede.position.y = (boca + nivel) / 2; grupo.add(parede);
      po.geometry = new T.CircleGeometry(0.92, 64); po.rotation.x = -Math.PI / 2; po.position.y = nivel;
    }

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
      const rosca = suave(0.04, 0.2, p), abre = suave(0.2, 0.42, p), sopro = suave(0.26, 0.72, p), fim = suave(0.74, 1, p);
      // pote gira devagar e mostra a frente no fim
      pote.grupo.rotation.y = lerp(-0.55, 0.25, p) + mx * 0.5 + (reduz ? 0 : Math.sin(t * 0.6) * 0.03);
      pote.grupo.rotation.x = my * 0.12;
      pote.grupo.position.y = reduz ? 0 : Math.sin(t * 1.1) * 0.03;
      // tampa sobe, inclina e volta a fechar no fim
      // tampa: desenrosca (gira subindo pela rosca), sobe e inclina; no fim volta e enrosca de novo
      const roscaK = rosca * (1 - suave(0.88, 1, p)), tampaK = abre * (1 - suave(0.74, 0.88, p));
      pote.tampa.position.set(lerp(0, 0.95, tampaK), TAMPA_BASE + roscaK * 0.08 + tampaK * 1.2, lerp(0, -0.25, tampaK));
      pote.tampa.rotation.set(tampaK * 0.35, -roscaK * Math.PI * 3, -tampaK * 0.62);
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

  // ---------- água: vidro líquido com borda clara (fresnel), para a gota, a lâmina e a espiral ----------
  const bordaAgua = { value: null };
  function matAgua(op = 0.22, { fade = 0, lado = T.FrontSide, borda = 1, cor = 0xeafff3 } = {}) {
    if (!bordaAgua.value) bordaAgua.value = new T.Color(0xdff3e6);
    const m = new T.MeshPhysicalMaterial({ color: cor, roughness: 0.03, metalness: 0, transparent: true, opacity: op, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 2.4, depthWrite: false, side: lado });
    m.onBeforeCompile = sh => {
      sh.uniforms.uBorda = bordaAgua;
      if (fade) {
        sh.vertexShader = 'varying float vRaio;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vRaio = length(position.xy);');
      }
      sh.fragmentShader = 'uniform vec3 uBorda;\n' + (fade ? 'varying float vRaio;\n' : '') + sh.fragmentShader.replace('#include <dithering_fragment>', `#include <dithering_fragment>
        float fres = pow(1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 2.4);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, uBorda, fres * ${(0.6 * borda).toFixed(2)});
        gl_FragColor.a = clamp(gl_FragColor.a + fres * ${(0.7 * borda).toFixed(2)}, 0.0, 1.0);
        ${fade ? `gl_FragColor.a *= 1.0 - smoothstep(${(fade * 0.45).toFixed(2)}, ${fade.toFixed(2)}, vRaio);` : ''}`);
    };
    m.customProgramCacheKey = () => 'agua' + fade + '-' + borda;
    return m;
  }

  // ---------- HERO da Nascente: a gota cai, a água rebate em espiral e a espiral vira o pote ----------
  // Linha do tempo (p de 0 a 1, guiada pela rolagem):
  //   0,00 a 0,05  a gota pendurada, respirando
  //   0,05 a 0,20  a gota cai (aceleração da gravidade) e se alonga
  //   0,20 a 0,40  impacto: cratera, coroa de respingos e anéis na lâmina d'água
  //   0,26 a 0,42  o rebote: a coluna sobe do centro e solta uma gota no alto
  //   0,34 a 0,64  a coluna se abre numa fita de água em espiral que aperta até o tamanho do pote
  //   0,48 a 0,76  a água preenche o molde de baixo para cima e o pote verde nasce atrás dela
  //   0,74 a 1,00  o pote sobe da água, gira e mostra a frente; gotas e folhas ficam suspensas
  function iniciaGota() {
    const sec = document.querySelector('[data-gota]');
    const canvas = sec && sec.querySelector('canvas.gota-3d');
    if (!canvas) return;
    const renderer = criaRenderer(canvas); renderer.localClippingEnabled = true;
    const cena = new T.Scene(); cena.environment = criaAmbiente(renderer, 0x56605a);
    const luz = new T.DirectionalLight(0xf4ffe9, 0.95); luz.position.set(-4, 8, 6); cena.add(luz);
    const contra = new T.DirectionalLight(0xc4d997, 0.9); contra.position.set(4, 3, -6); cena.add(contra);
    cena.add(new T.HemisphereLight(0xe8f5ea, 0x0b1410, 0.35));
    const cam = new T.PerspectiveCamera(30, 1, 0.1, 200);

    // lâmina d'água: anel polar (anéis de onda ficam redondos) com borda que some
    const lamina = new T.Mesh(new T.RingGeometry(0.001, 9, 128, reduz ? 40 : 96), matAgua(0.04, { fade: 9, borda: 0.42, cor: 0x9fb8a8 }));
    lamina.rotation.x = -Math.PI / 2; lamina.renderOrder = 3; cena.add(lamina);
    const lPos = lamina.geometry.attributes.position;
    const lRaio = new Float32Array(lPos.count);
    for (let i = 0; i < lPos.count; i++) lRaio[i] = Math.hypot(lPos.getX(i), lPos.getY(i));

    // gota em forma de lágrima (ponta para cima)
    const perfilGota = [];
    for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI; perfilGota.push(new T.Vector2(Math.sin(a) * Math.pow(Math.sin(a / 2), 1.1), Math.cos(a))); }
    const gota = new T.Mesh(new T.LatheGeometry(perfilGota.reverse(), 48), matAgua(0.3)); gota.scale.setScalar(0.17); gota.renderOrder = 4; cena.add(gota);

    // respingos (coroa) e gotas suspensas: esferas instanciadas
    const geoEsf = new T.SphereGeometry(1, 14, 10);
    const r1 = rng(51), NC = reduz ? 40 : 110;
    const coroa = new T.InstancedMesh(geoEsf, matAgua(0.35), NC); coroa.renderOrder = 4; cena.add(coroa);
    const dC = Array.from({ length: NC }, () => ({ a: r1() * Math.PI * 2, v: 0.6 + r1() * 1.6, vy: 1.2 + r1() * 1.7, tam: 0.018 + r1() * 0.045 }));
    const r2 = rng(77), NS = reduz ? 16 : 46;
    const soltas = new T.InstancedMesh(geoEsf, matAgua(0.32), NS); soltas.renderOrder = 4; cena.add(soltas);
    const dS = Array.from({ length: NS }, () => ({ a: r2() * Math.PI * 2, raio: 1.5 + r2() * 2.2, y: 0.2 + r2() * 2.8, tam: 0.025 + r2() * 0.07, vel: 0.15 + r2() * 0.4, fase: r2() * 6, atraso: r2() * 0.5 }));
    const mtx = new T.Matrix4(), q = new T.Quaternion(), vv = new T.Vector3(), ss = new T.Vector3();
    const poe = (im, i, x, y, z, s) => { vv.set(x, y, z); ss.setScalar(Math.max(0.0001, s)); mtx.compose(vv, q, ss); im.setMatrixAt(i, mtx); };

    // rebote: coluna afunilada que sobe do centro e a gota que se solta no alto
    const coluna = new T.Mesh(new T.CylinderGeometry(0.06, 0.2, 1, 32, 8, true).translate(0, 0.5, 0), matAgua(0.3, { lado: T.DoubleSide })); coluna.renderOrder = 4; cena.add(coluna);
    const topoGota = new T.Mesh(geoEsf, matAgua(0.32)); topoGota.renderOrder = 4; cena.add(topoGota);

    // fita de água em espiral (refeita a cada quadro; poucos vértices)
    const SEG = 260;
    const fGeo = new T.BufferGeometry();
    const fPos = new Float32Array((SEG + 1) * 2 * 3);
    const fIdx = [];
    for (let i = 0; i < SEG; i++) { const a = i * 2, b = a + 1, c = a + 2, d = a + 3; fIdx.push(a, c, b, b, c, d); }
    fGeo.setIndex(fIdx); fGeo.setAttribute('position', new T.BufferAttribute(fPos, 3));
    const fita = new T.Mesh(fGeo, matAgua(0.24, { lado: T.DoubleSide })); fita.renderOrder = 5; fita.frustumCulled = false; cena.add(fita);
    function moldaFita(cresce, aperta, giro) {
      const voltas = lerp(3.4, 2.6, aperta), alto = lerp(2.5, 2.12, aperta), larg = lerp(0.42, 0.62, aperta);
      for (let i = 0; i <= SEG; i++) {
        const u = i / SEG, uu = Math.min(u, cresce);
        const ang = uu * voltas * Math.PI * 2 + giro;
        // a fita nasce larga embaixo (saindo da água) e afina na ponta que sobe
        const raio = lerp(lerp(0.25, 1.5, Math.min(1, uu * 3)), 1.035, aperta) + Math.sin(uu * 18 + giro * 2) * 0.03 * (1 - aperta);
        const meia = larg / 2 * Math.min(1, (cresce - uu) * 7) * Math.min(1, 0.4 + u * 4);
        const y = uu * alto;
        const x = Math.cos(ang) * raio, z = Math.sin(ang) * raio;
        fPos.set([x, Math.max(0, y - meia), z], i * 6);
        fPos.set([x, y + meia, z], i * 6 + 3);
      }
      fGeo.attributes.position.needsUpdate = true; fGeo.computeVertexNormals();
    }

    // o pote: materiais próprios para recortar de baixo para cima sem mexer nos outros potes da página
    const corte = new T.Plane(new T.Vector3(0, -1, 0), 0);
    const pote = criaPote(); cena.add(pote.grupo);
    pote.grupo.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.material.clippingPlanes = [corte]; } });
    // casca de água com a forma do pote, que sobe na frente do verde
    const corteAgua = new T.Plane(new T.Vector3(0, -1, 0), 0);
    const perfilCasca = [[0, -0.02], [1.02, -0.02], [1.035, 0.06], [1.035, TAMPA_TOPO - 0.05], [1.0, TAMPA_TOPO + 0.02], [0, TAMPA_TOPO + 0.03]];
    const mCasca = matAgua(0.2); mCasca.clippingPlanes = [corteAgua];
    const casca = new T.Mesh(new T.LatheGeometry(perfilCasca.map(v => new T.Vector2(v[0], v[1])), 96), mCasca); casca.renderOrder = 6; cena.add(casca);
    // a linha de enchimento: um anel de água que acompanha o corte
    const anel = new T.Mesh(new T.TorusGeometry(1.03, 0.035, 12, 96), matAgua(0.45)); anel.rotation.x = Math.PI / 2; anel.renderOrder = 6; cena.add(anel);
    const sombra = criaSombra(0.5, 3.6); sombra.position.y = 0.002; cena.add(sombra);
    const folhas = criaFolhas(10, 61); cena.add(folhas.grupo);

    // cores da borda da água por tema (prata no escuro, verde-água no claro)
    const temaCor = () => { const claro = document.documentElement.dataset.temaAtual === 'claro'; bordaAgua.value.set(claro ? 0x4f7f62 : 0xdff3e6); };
    temaCor(); document.addEventListener('aura:tema', () => setTimeout(temaCor, 30));

    let W = 0, H = 0, retrato = false, mx = 0, tmx = 0;
    function ajusta() { W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return; renderer.setSize(W, H, false); cam.aspect = W / H; retrato = W / H < 0.85; }
    new ResizeObserver(ajusta).observe(canvas); ajusta();
    addEventListener('pointermove', e => { if (e.pointerType === 'mouse') tmx = e.clientX / innerWidth - 0.5; }, { passive: true });
    let kit = 1, kitK = 1;
    const laterais = [criaPote(), criaPote()];
    laterais.forEach(l => { l.grupo.scale.setScalar(0.001); cena.add(l.grupo); });
    document.addEventListener('aura:kit', e => { kit = e.detail.potes; });

    const legendas = [...sec.querySelectorAll('[data-fase]')];
    let atual = 0, rodando = false, visivel = true;
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) laco(); }).observe(sec);

    function onda(r, tt, A, c, k, larg) {
      if (tt <= 0) return 0;
      const f = c * tt, d = r - f;
      if (d > larg * 1.6) return 0;
      return A * Math.exp(-tt * 0.32) * Math.sin(k * d) * Math.exp(-(d * d) / (larg * larg)) / (1 + r * 0.4);
    }

    function quadro(p, agora) {
      const t = agora / 1000;
      mx = lerp(mx, tmx, 0.05);
      const solta = suave(0.04, 0.06, p), cai = clamp((p - 0.05) / 0.15);
      const tt = (p - 0.2) * 13, tt2 = (p - 0.5) * 9;
      const sobeJ = suave(0.24, 0.36, p), desfaz = suave(0.36, 0.46, p);
      const cresce = suave(0.33, 0.52, p), aperta = suave(0.46, 0.64, p), someFita = suave(0.66, 0.78, p);
      const enche = suave(0.48, 0.68, p), solido = suave(0.54, 0.74, p), someCasca = suave(0.72, 0.84, p);
      const fim = suave(0.74, 1, p);

      // gota: pendurada, depois cai acelerando e se alonga
      const yTopo = 3.1;
      const yG = cai < 1 ? lerp(yTopo, 0.05, cai * cai) : -1;
      gota.visible = p < 0.205;
      gota.position.set(0, yG + (reduz ? 0 : Math.sin(t * 2) * 0.02 * (1 - solta)), 0);
      gota.scale.set(0.17 * (1 - cai * 0.18), 0.17 * (1 + cai * 0.5 + (reduz ? 0 : Math.sin(t * 3) * 0.03 * (1 - solta))), 0.17 * (1 - cai * 0.18));

      // lâmina: cratera no impacto, dois trens de onda e o anel menor quando o pote pousa
      const cratera = tt > 0 ? Math.sin(Math.PI * clamp(tt / 0.9)) * 0.22 : 0;
      for (let i = 0; i < lPos.count; i++) {
        const r = lRaio[i];
        let h = (reduz ? 0 : Math.sin(r * 2.6 - t * 1.4) * 0.012 * Math.exp(-r * 0.25));
        h += onda(r, tt, 0.16, 1.5, 7, 0.7) + onda(r, tt - 0.5, 0.08, 1.1, 10, 0.55);
        h -= cratera * Math.exp(-(r * r) / 0.12);
        h += onda(r - 1.05, tt2, 0.07, 1.2, 9, 0.5) * (1 - fim * 0.6);
        lPos.setZ(i, h);
      }
      lPos.needsUpdate = true; lamina.geometry.computeVertexNormals();

      // coroa de respingos (balística, pela rolagem)
      const s = clamp((p - 0.2) / 0.2) * 1.15;
      for (let i = 0; i < NC; i++) {
        const d = dC[i];
        const rr = 0.12 + d.v * s * 0.9, y = d.vy * s - 2.6 * s * s;
        const vis = s > 0 && y > -0.02;
        poe(coroa, i, Math.cos(d.a) * rr, Math.max(0, y), Math.sin(d.a) * rr, vis ? d.tam * (1 - s * 0.35) : 0);
      }
      coroa.instanceMatrix.needsUpdate = true;

      // rebote: a coluna sobe, a gota do alto se solta e se desfaz quando a espiral começa
      coluna.visible = sobeJ > 0.001 && desfaz < 0.999;
      const alt = sobeJ * 1.9 * (1 - desfaz * 0.9);
      coluna.scale.set(1 - desfaz * 0.6, Math.max(0.001, alt), 1 - desfaz * 0.6);
      coluna.material.opacity = 0.3 * (1 - desfaz);
      topoGota.visible = coluna.visible;
      topoGota.position.set(0, alt + 0.08 + desfaz * 0.6, 0);
      topoGota.scale.setScalar(0.11 * sobeJ * (1 - desfaz));

      // fita em espiral
      fita.visible = cresce > 0.001 && someFita < 0.999;
      if (fita.visible) moldaFita(cresce, aperta, -p * 9 - (reduz ? 0 : t * 0.25));
      fita.material.opacity = 0.24 * (1 - someFita);

      // o pote nasce: a casca de água sobe primeiro e o verde vem logo atrás
      const flutua = fim * 0.32 + (reduz ? 0 : Math.sin(t * 1.1) * 0.025 * fim);
      pote.grupo.position.y = flutua;
      const hAgua = lerp(-0.06, TAMPA_TOPO + 0.08, enche), hSol = lerp(-0.06, TAMPA_TOPO + 0.08, solido);
      corteAgua.constant = enche >= 1 ? 100 : hAgua + flutua;
      corte.constant = solido >= 1 ? 100 : hSol + flutua;
      pote.grupo.visible = solido > 0.001;
      casca.visible = enche > 0.001 && someCasca < 0.999;
      casca.position.y = flutua;
      mCasca.opacity = 0.2 * (1 - someCasca);
      anel.visible = solido > 0.01 && solido < 0.99;
      anel.position.y = hSol + flutua;
      anel.scale.setScalar(1 + Math.sin(solido * Math.PI) * 0.02);
      pote.grupo.rotation.y = lerp(-1.6, 0.22, suave(0.5, 1, p)) + mx * 0.4 + (reduz ? 0 : Math.sin(t * 0.6) * 0.03);
      casca.rotation.y = pote.grupo.rotation.y;
      // no fim a tampa dá um quarto de volta, como quem confere a rosca
      pote.tampa.rotation.y = -suave(0.86, 0.98, p) * Math.PI * 0.5;
      sombra.material.opacity = 0.5 * solido;
      sombra.scale.setScalar(1 + (kitK - 1) * 0.6 - fim * 0.12);

      // gotas suspensas e folhas aparecem com o pote pronto
      const vem = suave(0.7, 0.9, p);
      for (let i = 0; i < NS; i++) {
        const d = dS[i];
        const k = clamp((vem - d.atraso * 0.5) / 0.5);
        const ang = d.a + p * d.vel * 3 + (reduz ? 0 : t * d.vel * 0.15);
        poe(soltas, i, Math.cos(ang) * d.raio, d.y + (reduz ? 0 : Math.sin(t * 0.8 + d.fase) * 0.08), Math.sin(ang) * d.raio - 0.4, d.tam * easeOut(k));
      }
      soltas.instanceMatrix.needsUpdate = true;
      folhas.lista.forEach(f => {
        const k = clamp((vem - f.atraso) / (1 - f.atraso));
        const ang = f.ang + p * f.vel * 2 + (reduz ? 0 : t * 0.07);
        f.f.position.set(Math.cos(ang) * f.raio * 1.1, 0.5 + f.alt, Math.sin(ang) * f.raio * 1.1 - 0.6);
        f.f.rotation.set(f.rx + p * 2 + t * 0.1, f.ry + p * 1.5, 0);
        f.f.scale.setScalar(Math.max(0.001, easeOut(k) * 0.85));
      });

      // potes do kit chegam pela água nas laterais
      kitK = lerp(kitK, fim > 0.5 ? kit : 1, 0.08);
      laterais.forEach((l, i) => {
        const k = clamp(kitK - 1 - i), lado = i === 0 ? -1 : 1;
        l.grupo.scale.setScalar(Math.max(0.001, easeOut(k) * 0.8));
        l.grupo.position.set(lado * lerp(1.1, 2.3, easeOut(k)), lerp(-1.6, 0.18, easeOut(k)), -1.2);
        l.grupo.rotation.y = -0.3 + lado * 0.45 + mx * 0.3;
      });

      // câmera: segue a gota, desce até a água e abre para o pote, que vai para a direita no fim
      const tanV = Math.tan(T.MathUtils.degToRad(cam.fov / 2)) * 2;
      const alvoY = p < 0.2 ? lerp(2.1, 0.6, suave(0.05, 0.2, p)) : lerp(0.6, 1.15, suave(0.2, 0.6, p));
      const altQ = p < 0.2 ? 4.4 : lerp(3.4, 4.7, suave(0.22, 0.62, p));
      const largQ = retrato ? 4.4 : 5.6 + (kitK - 1) * 1.3;
      const dist = Math.max(altQ / tanV, largQ / (tanV * cam.aspect));
      const desloca = retrato ? 0 : -W * 0.17 * suave(0.72, 0.94, p);
      cam.position.set(mx * -0.6, alvoY + lerp(0.9, 1.3, suave(0.2, 0.6, p)), dist);
      cam.lookAt(0, alvoY + fim * 0.2, 0);
      cam.setViewOffset(W, H, desloca, retrato ? H * 0.1 * fim : 0, W, H);
      cam.updateProjectionMatrix();
      renderer.render(cena, cam);

      legendas.forEach(el => { const [a, b] = el.dataset.fase.split(',').map(Number); el.classList.toggle('on', p >= a && p < b); });
      sec.style.setProperty('--p', p.toFixed(3));
      sec.style.setProperty('--intro', (1 - suave(0.03, 0.12, p)).toFixed(3));
      sec.style.setProperty('--fim', suave(0.8, 0.92, p).toFixed(3));
      sec.classList.toggle('fim-on', p > 0.84);
    }
    function laco() {
      if (rodando) return; rodando = true;
      const passo = agora => {
        if (!visivel) { rodando = false; return; }
        const alvo = progresso(sec);
        atual = reduz ? alvo : lerp(atual, alvo, 0.09);
        quadro(atual, agora);
        requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    }
    laco();
  }

  // ---------- HERO da Maré: o pote dentro do tubo de uma onda de água; a câmera entra no tubo com ele e sai na palavra AURA ----------
  // Linha do tempo (p de 0 a 1, guiada pela rolagem):
  //   0,00 a 0,10  a onda parada, enrolada em volta do pote, com a água correndo e gotas no lábio
  //   0,10 a 0,34  a câmera se aproxima e o pote sobe para perto dela, ainda na boca do tubo
  //   0,34 a 0,66  câmera e pote deslizam juntos por dentro do tubo até a saída
  //   0,50 a 0,90  fios de água saem do tubo e cada letra de AURA sobe cheia de água; o pote pousa na frente
  //   0,80 a 1,00  palavra pronta, os três ativos aparecem
  // A água é vidro líquido (transmission do three) refratando um fundo pintado dentro da própria cena.
  function texturaCorrente() {
    // mapa de normais em listras que seguem o giro da onda (sem emenda nos dois sentidos)
    const W = 256, H = 256, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'), img = g.createImageData(W, H), d = img.data, P2 = Math.PI * 2;
    const alt = (x, y) => { const u = x / W * P2, v = y / H * P2; return 0.55 * Math.sin(v * 5 + Math.sin(u * 2) * 1.4) + 0.3 * Math.sin(v * 12 + u + Math.sin(u * 3 + v * 2)) + 0.18 * Math.sin(u * 4 + v * 3); };
    const hs = new Float32Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) hs[y * W + x] = alt(x, y);
    const h = (x, y) => hs[((y + H) % H) * W + ((x + W) % W)];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let nx = (h(x - 1, y) - h(x + 1, y)) * 3, ny = (h(x, y - 1) - h(x, y + 1)) * 3, nz = 1;
      const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
      const i = (y * W + x) * 4; d[i] = (nx * 0.5 + 0.5) * 255; d[i + 1] = (ny * 0.5 + 0.5) * 255; d[i + 2] = (nz * 0.5 + 0.5) * 255; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping;
    return t;
  }
  function iniciaMare() {
    const sec = document.querySelector('[data-mare]');
    const canvas = sec && sec.querySelector('canvas.mare-3d');
    if (!canvas) return;
    const renderer = criaRenderer(canvas); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    const cena = new T.Scene(); cena.environment = criaAmbiente(renderer, 0xb9c9c6);
    const luz = new T.DirectionalLight(0xfff8f0, 1.1); luz.position.set(-6, 9, 7); cena.add(luz);
    const contra = new T.DirectionalLight(0xf0c6d7, 0.7); contra.position.set(6, 4, -6); cena.add(contra);
    cena.add(new T.HemisphereLight(0xeafaf6, 0x9fb5b0, 0.45));
    const cam = new T.PerspectiveCamera(30, 1, 0.05, 300);

    // fundo pintado dentro da cena (a água refrata o que está atrás dela, inclusive o degradê)
    const fundoU = { c1: { value: new T.Color() }, c2: { value: new T.Color() }, c3: { value: new T.Color() }, c4: { value: new T.Color() } };
    const fundo = new T.Mesh(new T.PlaneGeometry(2, 2), new T.ShaderMaterial({
      uniforms: fundoU, depthWrite: false, depthTest: false,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }',
      fragmentShader: `uniform vec3 c1; uniform vec3 c2; uniform vec3 c3; uniform vec3 c4; varying vec2 vUv;
        void main(){
          vec3 a = mix(c1, c2, smoothstep(0.0, 1.0, vUv.x * 0.85 + (1.0 - vUv.y) * 0.15));
          a = mix(a, c3, (1.0 - smoothstep(0.0, 0.62, distance(vUv, vec2(0.66, 0.56)))) * 0.75);
          a = mix(a, c4, smoothstep(0.72, 0.18, vUv.y) * 0.85);
          gl_FragColor = vec4(a, 1.0);
          #include <encodings_fragment>
        }`,
    }));
    fundo.frustumCulled = false; fundo.renderOrder = -10; cena.add(fundo);

    // água: vidro líquido com listras de corrente e borda clara
    const corrente = texturaCorrente();
    const rimU = { value: new T.Color(0xffffff) };
    function matMar(espessura, rep, rug) {
      const tx = corrente.clone(); tx.needsUpdate = true; tx.repeat.set(rep[0], rep[1]);
      const m = new T.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, thickness: espessura, ior: 1.33, roughness: rug, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.7, specularIntensity: 1, attenuationColor: new T.Color(0x6fcfc8), attenuationDistance: 1.9, normalMap: tx, normalScale: new T.Vector2(0.28, 0.28) });
      m.onBeforeCompile = sh => {
        sh.uniforms.uRim = rimU;
        sh.fragmentShader = 'uniform vec3 uRim;\n' + sh.fragmentShader.replace('#include <dithering_fragment>', `#include <dithering_fragment>
          float fres = pow(1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 2.2);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, uRim, fres * 0.7);`);
      };
      m.customProgramCacheKey = () => 'mar';
      return m;
    }
    const mOnda = matMar(1.6, [3, 9], 0.14), mLetra = matMar(1.6, [0.35, 0.35], 0.04), mRio = matMar(0.8, [1, 4], 0.08);
    mLetra.envMapIntensity = 2.3;
    const correntes = [mOnda.normalMap, mLetra.normalMap, mRio.normalMap];

    // lâmina d'água do chão: opaca e polida, se dissolve no degradê do fundo conforme se afasta
    const txChao = corrente.clone(); txChao.needsUpdate = true; txChao.repeat.set(40, 40); correntes.push(txChao);
    const mChao = new T.MeshPhysicalMaterial({ color: 0xe6f3f0, roughness: 0.12, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.1, normalMap: txChao, normalScale: new T.Vector2(0.12, 0.12) });
    const resU = { value: new T.Vector2(1, 1) };
    mChao.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, fundoU, { uRes: resU });
      sh.fragmentShader = 'uniform vec3 c1; uniform vec3 c2; uniform vec3 c3; uniform vec3 c4; uniform vec2 uRes;\n' + sh.fragmentShader.replace('#include <dithering_fragment>', `#include <dithering_fragment>
        vec2 su = gl_FragCoord.xy / uRes;
        vec3 bg = mix(c1, c2, smoothstep(0.0, 1.0, su.x * 0.85 + (1.0 - su.y) * 0.15));
        bg = mix(bg, c3, (1.0 - smoothstep(0.0, 0.62, distance(su, vec2(0.66, 0.56)))) * 0.75);
        bg = mix(bg, c4, smoothstep(0.72, 0.18, su.y) * 0.85);
        float longe = smoothstep(14.0, 44.0, length(vViewPosition));
        gl_FragColor.rgb = mix(gl_FragColor.rgb, linearToOutputTexel(vec4(bg, 1.0)).rgb, longe);`);
    };
    mChao.customProgramCacheKey = () => 'mare-chao';
    const chao = new T.Mesh(new T.PlaneGeometry(220, 220), mChao); chao.rotation.x = -Math.PI / 2; chao.position.z = -30; cena.add(chao);

    // ----- o tubo da onda: espiral contínua que nasce rente ao chão e se enrola em volta do pote -----
    // O perfil começa embaixo do centro (tangente ao chão, sem degrau), sobe pela direita, passa por cima
    // e o lábio desce pela esquerda. Puxado em profundidade de Z0 (boca, na frente) até Z1 (saída, no fundo).
    const NO = reduz ? 70 : 120, NL = 12, NP = NO * 2 + NL, NS = reduz ? 70 : 150;
    const Z0 = 1.4, Z1 = -26;
    const OC = { x: 0, y: 2.35 }, TH0 = -Math.PI / 2, TH1 = 3.95, R0 = 2.35, R1 = 1.5;
    const oGeo = new T.BufferGeometry();
    const oPos = new Float32Array(NP * (NS + 1) * 3), oUv = new Float32Array(NP * (NS + 1) * 2), oIdx = [];
    for (let i = 0; i < NS; i++) for (let j = 0; j < NP - 1; j++) { const a = i * NP + j, b = a + 1, c2 = a + NP, d2 = c2 + 1; oIdx.push(a, c2, b, b, c2, d2); }
    for (let i = 0; i <= NS; i++) for (let j = 0; j < NP; j++) { const k = (i * NP + j) * 2; oUv[k] = j / (NP - 1) * 2; oUv[k + 1] = i / NS; }
    oGeo.setIndex(oIdx); oGeo.setAttribute('position', new T.BufferAttribute(oPos, 3)); oGeo.setAttribute('uv', new T.BufferAttribute(oUv, 2));
    const onda = new T.Mesh(oGeo, mOnda); onda.frustumCulled = false; cena.add(onda);
    const ponto = { x: 0, y: 0 }, pa = { x: 0, y: 0 }, pb = { x: 0, y: 0 };
    function espiral(u, s, t, o) {
      const th1 = TH1 + Math.sin(s * 7 + t * 0.6) * 0.06 - (1 - s) * 0.2;
      const th = lerp(TH0, th1, u);
      const k = (th - TH0) / (TH1 - TH0);
      const r = R0 * Math.pow(R1 / R0, k) + (Math.sin(th * 3 + t * 1.3 + s * 9) * 0.04 + Math.sin(s * 14 - t * 0.9) * 0.035) * u;
      o.x = OC.x + Math.cos(th) * r; o.y = OC.y + Math.sin(th) * r;
      return o;
    }
    const espessura = u => u < 0.12 ? lerp(0.02, 0.72, suave(0, 0.12, u)) : lerp(0.72, 0.26, Math.pow((u - 0.12) / 0.88, 0.8));
    function moldaOnda(t) {
      for (let i = 0; i <= NS; i++) {
        const s = i / NS, z = lerp(Z1, Z0, s);
        const bF = s > 0.97 ? Math.sqrt(Math.max(0, 1 - Math.pow((s - 0.97) / 0.03, 2))) : 1;
        const bT = s < 0.02 ? Math.sqrt(Math.max(0, 1 - Math.pow((0.02 - s) / 0.02, 2))) : 1;
        const borda = bF * bT;
        for (let j = 0; j < NP; j++) {
          let u, lado = 0, ang = 0;
          if (j < NO) { u = j / (NO - 1); lado = 1; }
          else if (j < NO + NL) { u = 1; ang = (j - NO + 1) / (NL + 1) * Math.PI; }
          else { u = 1 - (j - NO - NL) / (NO - 1); lado = -1; }
          espiral(u, s, t, ponto);
          espiral(Math.max(0, u - 0.004), s, t, pa); espiral(Math.min(1, u + 0.004), s, t, pb);
          let tx = pb.x - pa.x, ty = pb.y - pa.y; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
          const nx = ty, ny = -tx, h = espessura(u) * borda + 0.004;
          let x, y;
          if (lado) { x = ponto.x + nx * h * lado; y = ponto.y + ny * h * lado; }
          else { x = ponto.x + nx * h * Math.cos(ang) + tx * h * Math.sin(ang); y = ponto.y + ny * h * Math.cos(ang) + ty * h * Math.sin(ang); }
          const k = (i * NP + j) * 3; oPos[k] = x; oPos[k + 1] = y; oPos[k + 2] = z + (1 - borda) * 0.3 * (s > 0.5 ? 1 : -1);
        }
      }
      oGeo.attributes.position.needsUpdate = true; oGeo.computeVertexNormals();
    }

    // gotas penduradas no lábio, perto da boca do tubo
    const perfilGota = [];
    for (let i = 0; i <= 20; i++) { const a = i / 20 * Math.PI; perfilGota.push(new T.Vector2(Math.sin(a) * Math.pow(Math.sin(a / 2), 1.1), Math.cos(a))); }
    const geoGota = new T.LatheGeometry(perfilGota.reverse(), 32);
    const gotas = [0.985, 0.955, 0.93].map((s, i) => { const m = new T.Mesh(geoGota, mLetra); m.userData = { s, fase: i * 1.7, tam: [0.16, 0.12, 0.1][i] }; cena.add(m); return m; });

    // ----- AURA: letras de água moldadas (contorno extrudado com borda bem redonda) -----
    const redondo = (pts, r, alvo) => {
      const n = pts.length, s = alvo || new T.Shape();
      for (let i = 0; i < n; i++) {
        const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n];
        const la = Math.hypot(a[0] - b[0], a[1] - b[1]), lc = Math.hypot(c[0] - b[0], c[1] - b[1]), rr = Math.min(r, la / 2, lc / 2);
        const p1 = [b[0] + (a[0] - b[0]) / la * rr, b[1] + (a[1] - b[1]) / la * rr], p2 = [b[0] + (c[0] - b[0]) / lc * rr, b[1] + (c[1] - b[1]) / lc * rr];
        if (i === 0) s.moveTo(p1[0], p1[1]); else s.lineTo(p1[0], p1[1]);
        s.quadraticCurveTo(b[0], b[1], p2[0], p2[1]);
      }
      s.closePath(); return s;
    };
    function formaA() {
      const s = redondo([[0, 0], [1.05, 3.4], [1.95, 3.4], [3, 0], [2.2, 0], [2.015, 0.6], [0.985, 0.6], [0.8, 0]], 0.2);
      s.holes.push(redondo([[1.18, 1.15], [1.82, 1.15], [1.5, 2.05]], 0.08, new T.Path()));
      return s;
    }
    function formaU() {
      const s = new T.Shape();
      s.moveTo(0, 3.4); s.lineTo(0, 1.45); s.absarc(1.45, 1.45, 1.45, Math.PI, Math.PI * 2, false); s.lineTo(2.9, 3.4); s.lineTo(2.1, 3.4); s.lineTo(2.1, 1.45);
      s.absarc(1.45, 1.45, 0.65, 0, Math.PI, true); s.lineTo(0.8, 3.4); s.closePath();
      return s;
    }
    function formaR() {
      const s = new T.Shape();
      s.moveTo(0, 0); s.lineTo(0, 3.4); s.lineTo(1.65, 3.4); s.absarc(1.65, 2.4, 1.0, Math.PI / 2, -Math.PI / 2, true);
      s.lineTo(2.95, 0); s.lineTo(2.05, 0); s.lineTo(1.08, 1.3); s.lineTo(0.8, 1.3); s.lineTo(0.8, 0); s.closePath();
      const h = new T.Path(); h.moveTo(0.8, 1.98); h.lineTo(1.6, 1.98); h.absarc(1.6, 2.4, 0.42, -Math.PI / 2, Math.PI / 2, false); h.lineTo(0.8, 2.82); h.closePath();
      s.holes.push(h);
      return s;
    }
    const extr = { depth: 0.45, bevelEnabled: true, bevelThickness: 0.42, bevelSize: 0.14, bevelSegments: reduz ? 4 : 9, curveSegments: reduz ? 10 : 22 };
    const defs = [[formaA, 3], [formaU, 2.9], [formaR, 2.95], [formaA, 3]], GAP = 0.5;
    const LARG = defs.reduce((s, d) => s + d[1], 0) + GAP * (defs.length - 1);
    const palavra = new T.Group(); cena.add(palavra);
    let xx = -LARG / 2;
    const letras = defs.map(([f, w], i) => {
      const geo = new T.ExtrudeGeometry(f(), extr); geo.translate(-w / 2, 0.14, -0.22);
      // uv planar para as listras de corrente correrem pela letra
      const pos = geo.attributes.position, uv = geo.attributes.uv;
      for (let k = 0; k < pos.count; k++) uv.setXY(k, pos.getX(k) + pos.getZ(k) * 0.5, pos.getY(k));
      const m = new T.Mesh(geo, mLetra); m.position.x = xx + w / 2; xx += w + GAP;
      m.scale.setScalar(0.001); palavra.add(m);
      return { m, x: m.position.x, i };
    });

    // fios de água do chão: saem da boca de trás do tubo e levam a água até cada letra
    const rios = [];
    function montaRios(wz) {
      rios.forEach(r => { palavra.remove(r.m); r.geo.dispose(); }); rios.length = 0;
      const bz = 9;
      letras.forEach(L => {
        const c = new T.CatmullRomCurve3([new T.Vector3(0, 0, bz), new T.Vector3(L.x * 0.35, 0, bz * 0.55), new T.Vector3(L.x * 0.9, 0, bz * 0.18), new T.Vector3(L.x, 0, 0.9)], false, 'centripetal');
        const geo = new T.TubeGeometry(c, 90, 0.24, 14, false); geo.setDrawRange(0, 0);
        const m = new T.Mesh(geo, mRio); m.scale.y = 0.18; m.position.y = 0.02; palavra.add(m);
        rios.push({ m, geo });
      });
    }

    // respingos quando cada letra sobe
    const geoEsf = new T.SphereGeometry(1, 14, 10);
    const r1 = rng(83), NR = reduz ? 24 : 96;
    const respingo = new T.InstancedMesh(geoEsf, matAgua(0.45, { borda: 1, cor: 0xf4fffb }), NR); respingo.frustumCulled = false; cena.add(respingo);
    const dR = Array.from({ length: NR }, (_, i) => ({ l: i % 4, a: r1() * Math.PI * 2, v: 0.6 + r1() * 1.6, vy: 1.5 + r1() * 2.6, tam: 0.03 + r1() * 0.07 }));
    const mtx = new T.Matrix4(), qq = new T.Quaternion(), vv = new T.Vector3(), ss = new T.Vector3();
    const poe = (i, x, y, z, s) => { vv.set(x, y, z); ss.setScalar(Math.max(0.0001, s)); mtx.compose(vv, qq, ss); respingo.setMatrixAt(i, mtx); };

    // o pote: dentro do tubo, sobe para perto da câmera, atravessa o tubo junto com ela e pousa na frente da palavra
    const pote = criaPote(); cena.add(pote.grupo);
    const sombra = criaSombra(0.28, 3.2); cena.add(sombra);

    // cores por tema
    function temaCor() {
      const esc = document.documentElement.dataset.temaAtual === 'escuro';
      const cs = esc ? ['#0d1d1c', '#1b2523', '#1f3a33', '#0a1514'] : ['#d6eef0', '#f3d7e4', '#eaf6f4', '#eef5f3'];
      ['c1', 'c2', 'c3', 'c4'].forEach((k, i) => fundoU[k].value.set(cs[i]));
      mChao.color.set(esc ? '#0f201e' : '#e4f2ef'); mChao.envMapIntensity = esc ? 0.45 : 1.1;
      [mOnda, mLetra, mRio].forEach(m => { m.attenuationColor.set(esc ? '#3fb3a6' : (m === mLetra ? '#4fbfb4' : '#6fcfc8')); m.attenuationDistance = esc ? 1.2 : (m === mLetra ? 0.75 : 1.9); });
      rimU.value.set(esc ? '#bff3e2' : '#ffffff');
      luz.intensity = esc ? 0.8 : 1.1;
    }
    temaCor(); document.addEventListener('aura:tema', () => setTimeout(temaCor, 30));

    let W = 0, H = 0, retrato = false, modo = '', WZ = -44, mx = 0, my = 0, tmx = 0, tmy = 0;
    function ajusta() {
      W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return;
      renderer.setSize(W, H, false); renderer.getDrawingBufferSize(resU.value); cam.aspect = W / H; retrato = W / H < 0.85;
      // no celular a palavra fica menor e mais longe, para caber inteira depois da saída do tubo
      const m = retrato ? 'r' : 'p';
      if (m !== modo) { modo = m; WZ = retrato ? -62 : -44; palavra.scale.setScalar(retrato ? 0.62 : 1); palavra.position.set(0, 0, WZ); montaRios(WZ); }
    }
    new ResizeObserver(ajusta).observe(canvas); ajusta();
    addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; tmx = e.clientX / innerWidth - 0.5; tmy = e.clientY / innerHeight - 0.5; }, { passive: true });
    // ?mare-p=0.5 congela a cena num ponto da linha do tempo (para revisar quadro a quadro)
    const pFixo = (location.search.match(/[?&]mare-p=([\d.]+)/) || [])[1];

    let atual = 0, rodando = false, visivel = true;
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) laco(); }).observe(sec);
    const P = new T.Vector3(), L = new T.Vector3(), PH = new T.Vector3(), LH = new T.Vector3(), PE = new T.Vector3(), LE = new T.Vector3(), PF = new T.Vector3(), LF = new T.Vector3(), tmp = new T.Vector3();
    const potI = new T.Vector3(), potV = new T.Vector3(), potF = new T.Vector3();

    function quadro(p, agora) {
      const t = reduz ? 0 : agora / 1000;
      mx = lerp(mx, tmx, 0.05); my = lerp(my, tmy, 0.05);
      correntes.forEach((c, i) => { c.offset.x = t * (i === 3 ? 0.01 : 0.04); c.offset.y = -t * (i === 3 ? 0.015 : 0.06); });

      const k1 = suave(0.1, 0.34, p);             // aproxima do pote, ainda na boca do tubo
      const k2 = suave(0.34, 0.66, p);            // desliza por dentro do tubo
      const k3 = suave(0.62, 0.86, p);            // sai do tubo e abre na palavra
      const tanV = deg => Math.tan(T.MathUtils.degToRad(deg / 2)) * 2;

      // a onda só é refeita enquanto a câmera ainda pode vê-la
      onda.visible = k3 < 0.999;
      if (onda.visible) moldaOnda(t);
      gotas.forEach((g, i) => {
        const d = g.userData; espiral(1, d.s, t, ponto); espiral(0.995, d.s, t, pa);
        const tx = ponto.x - pa.x, ty = ponto.y - pa.y, tl = Math.hypot(tx, ty) || 1;
        const estica = 1.5 + Math.sin(t * 2 + d.fase) * 0.25;
        g.position.set(ponto.x + tx / tl * 0.12, ponto.y + ty / tl * 0.12 - d.tam * estica, lerp(Z1, Z0, d.s));
        g.scale.set(d.tam, d.tam * estica, d.tam);
      });

      // ----- câmera -----
      let fov;
      if (retrato) {
        LH.set(0.2, 2.1, -0.5); const dI = Math.max(8.4 / tanV(30), 7.4 / (tanV(30) * cam.aspect));
        PH.set(-0.1 + mx * 0.1, 0.16, 1).normalize().multiplyScalar(dI).add(LH);
        PE.set(0, 2.05, 6.2); LE.set(-0.15, 1.75, -12);
        const sc = palavra.scale.x, dF = Math.max(5.6 * sc / tanV(34), (LARG * sc + 1.4) / (tanV(34) * cam.aspect));
        LF.set(0, 1.75 * sc, WZ); PF.set(0, 1.75 * sc + dF * 0.14, WZ + dF);
      } else {
        LH.set(0.3, 2.2, 0); const dI = Math.max(6.9 / tanV(30), 7.6 / (tanV(30) * cam.aspect));
        PH.set(-0.14 + mx * 0.08, 0.14 - my * 0.04, 1).normalize().multiplyScalar(dI).add(LH);
        PE.set(-0.2, 2.05, 4.8); LE.set(-0.7, 1.8, -12);
        const dF = Math.max(5.8 / tanV(34), (LARG + 2.2) / (tanV(34) * cam.aspect));
        LF.set(0, 1.9, WZ); PF.set(0, 1.9 + dF * 0.12, WZ + dF);
      }
      P.lerpVectors(PH, PE, k1); L.lerpVectors(LH, LE, k1);
      const camZ = lerp(PE.z, Z1 - 3.5, k2);
      if (k2 > 0) { P.set(PE.x + Math.sin(t * 0.7) * 0.05, PE.y + Math.cos(t * 0.6) * 0.04, camZ); L.set(LE.x, LE.y, camZ - 16); }
      P.lerp(PF, k3); L.lerp(LF, k3);
      fov = lerp(lerp(30, 40, k1), 34, k3);
      cam.fov = fov; cam.position.copy(P); cam.lookAt(L);
      if (retrato) cam.setViewOffset(W, H, 0, lerp(-H * 0.2, 0, k1) + H * 0.02 * k3, W, H);
      else cam.setViewOffset(W, H, lerp(-W * 0.2, -W * 0.06, k1) * (1 - k3), H * 0.09 * k3, W, H);
      cam.updateProjectionMatrix();

      // ----- pote -----
      const bob = reduz ? 0 : Math.sin(t * 1.2) * 0.05;
      potI.set(0.35, 0.36 + bob * 0.4, -0.2);
      potV.set(retrato ? 0.15 : 0.55, retrato ? 1.3 : 1.5, (k2 > 0 ? camZ : PE.z) - (retrato ? 5.6 : 5.2));
      const sc = palavra.scale.x;
      potF.set(retrato ? 2.2 : 4.1, 0.04, WZ + (retrato ? 5 : 3.6));
      const kp = suave(0.1, 0.3, p), kf = suave(0.66, 0.86, p);
      pote.grupo.position.lerpVectors(potI, potV, kp); pote.grupo.position.y += bob * kp * (1 - kf);
      pote.grupo.position.lerp(potF, kf);
      pote.grupo.scale.setScalar(lerp(lerp(0.85, retrato ? 0.48 : 0.66, kp), retrato ? 0.7 : 1, kf));
      pote.grupo.rotation.set(lerp(lerp(0.12, 0.05, kp), -0.08, kf), lerp(-0.5, -0.4, kp) + p * 5.2 * (1 - kf) + kf * 0.15 + mx * 0.3, lerp(lerp(-0.32, -0.12, kp), -0.2, kf));
      sombra.position.set(pote.grupo.position.x + 0.15, 0.01, pote.grupo.position.z);
      sombra.material.opacity = (document.documentElement.dataset.temaAtual === 'escuro' ? 0.5 : 0.28) * (1 - kp * (1 - kf));

      // ----- a água chega pelos fios e cada letra sobe, cheia -----
      respingo.visible = false;
      letras.forEach((Lt, i) => {
        const kr = easeOut(suave(0.5 + i * 0.035, 0.62 + i * 0.035, p));
        const ks = suave(0.8 + i * 0.02, 0.92 + i * 0.02, p); // depois que a letra enche, o fio entra nela e some
        const ini = Math.floor(ks * 90) * 14 * 6;
        rios[i].geo.setDrawRange(ini, Math.max(0, Math.floor(kr * 90) * 14 * 6 - ini));
        const k = suave(0.58 + i * 0.045, 0.74 + i * 0.045, p);
        const sobe = k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.pow(1 - k, 3) + Math.sin(k * Math.PI) * 0.14;
        const larga = 1 + (1 - k) * 0.22 + (reduz ? 0 : Math.sin(t * 2.2 + i) * 0.006 * k);
        Lt.m.scale.set(larga * Math.max(0.001, Math.min(1, k * 4)), Math.max(0.001, sobe), larga * Math.max(0.001, Math.min(1, k * 4)));
        Lt.k = k;
      });
      for (let i = 0; i < NR; i++) {
        const d = dR[i], k = letras[d.l].k, e = clamp(k / 0.55);
        const vis = k > 0 && e < 1;
        if (vis) respingo.visible = true;
        const sc2 = palavra.scale.x, cx = letras[d.l].x * sc2;
        const y = d.vy * e - 4.6 * e * e;
        poe(i, cx + Math.cos(d.a) * d.v * e * 1.4 * sc2, Math.max(0, y) * sc2, WZ + Math.sin(d.a) * d.v * e * 0.6 + 0.4, vis && y > 0 ? d.tam * sc2 : 0);
      }
      respingo.instanceMatrix.needsUpdate = true;

      renderer.render(cena, cam);
      sec.style.setProperty('--p', p.toFixed(3));
      sec.style.setProperty('--intro', (1 - suave(0.03, 0.12, p)).toFixed(3));
      sec.style.setProperty('--meio', (suave(0.2, 0.28, p) * (1 - suave(0.42, 0.5, p))).toFixed(3));
      sec.style.setProperty('--fim', suave(0.8, 0.9, p).toFixed(3));
      sec.classList.toggle('meio-on', p > 0.22 && p < 0.46);
      sec.classList.toggle('fim-on', p > 0.82);
    }
    function laco() {
      if (rodando) return; rodando = true;
      const passo = agora => {
        if (!visivel) { rodando = false; return; }
        const alvo = pFixo ? +pFixo : progresso(sec);
        atual = reduz || pFixo ? alvo : lerp(atual, alvo, 0.085);
        quadro(atual, agora);
        requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    }
    laco();
  }

  // ---------- PALCO da Nascente: pote solto na página, gira no arrasto, abre a tampa e mostra frente e verso ----------
  function iniciaPalco() {
    const sec = document.querySelector('[data-palco]');
    const canvas = sec && sec.querySelector('canvas.palco-3d');
    if (!canvas) return;
    const renderer = criaRenderer(canvas);
    const cena = new T.Scene(); cena.environment = criaAmbiente(renderer);
    const luz = new T.DirectionalLight(0xf4ffe6, 0.9); luz.position.set(-5, 8, 6); cena.add(luz);
    const contra = new T.DirectionalLight(0xc4d997, 0.6); contra.position.set(5, 3, -6); cena.add(contra);
    const cam = new T.PerspectiveCamera(26, 1, 0.3, 200);
    const pote = criaPote({ po: true }); cena.add(pote.grupo);
    const sombra = criaSombra(0.45, 3.6); cena.add(sombra);
    const po = criaPo(reduz ? 120 : 700, 88, ['#c4d997', '#9cbc5c', '#5f8f2f', '#2f6b3a']); cena.add(po.pts);

    const FRENTE = 0.22;
    let rot = FRENTE - 0.9, rotAlvo = FRENTE, inercia = 0, arrasto = null, ultimoX = 0, ociosoDesde = performance.now();
    let aberta = false, abreK = 0, sopro = 0;
    let W = 0, H = 0, visivel = false, rodando = false;
    function ajusta() {
      W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return;
      renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix();
    }
    new ResizeObserver(ajusta).observe(canvas); ajusta();

    canvas.addEventListener('pointerdown', e => { arrasto = e.pointerId; ultimoX = e.clientX; inercia = 0; canvas.setPointerCapture(e.pointerId); canvas.classList.add('girando'); sec.classList.add('mexeu'); });
    canvas.addEventListener('pointermove', e => { if (arrasto !== e.pointerId) return; const dx = e.clientX - ultimoX; ultimoX = e.clientX; rotAlvo += dx * 0.012; inercia = dx * 0.012; });
    const solta = () => { arrasto = null; canvas.classList.remove('girando'); ociosoDesde = performance.now(); };
    canvas.addEventListener('pointerup', solta); canvas.addEventListener('pointercancel', solta);

    // vai para o ângulo equivalente mais perto (sem dar voltas inteiras)
    const perto = alvo => { const d = ((alvo - rotAlvo) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI; return rotAlvo + d; };
    sec.querySelectorAll('[data-palco-acao]').forEach(b => b.addEventListener('click', () => {
      const a = b.dataset.palcoAcao;
      inercia = 0; ociosoDesde = performance.now() + 4000;
      if (a === 'tampa') { aberta = !aberta; if (aberta) sopro = 0; b.setAttribute('aria-pressed', String(aberta)); b.textContent = aberta ? 'Fechar a tampa' : 'Abrir a tampa'; }
      if (a === 'frente') rotAlvo = perto(FRENTE);
      if (a === 'verso') rotAlvo = perto(FRENTE + Math.PI);
    }));
    document.addEventListener('aura:palco', e => { inercia = 0; ociosoDesde = performance.now() + 4000; rotAlvo = perto(e.detail === 'verso' ? FRENTE + Math.PI : FRENTE); });

    new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) laco(); }, { rootMargin: '80px' }).observe(sec);
    function quadro(agora) {
      const t = agora / 1000;
      if (arrasto === null) { rotAlvo += inercia; inercia *= 0.93; if (!reduz && agora - ociosoDesde > 2500) rotAlvo += 0.0025; }
      rot = lerp(rot, rotAlvo, 0.1);
      pote.grupo.rotation.y = rot;
      pote.grupo.position.y = reduz ? 0 : Math.sin(t * 1.1) * 0.025;
      // tampa: desenrosca girando, sobe e pousa inclinada ao lado
      abreK = lerp(abreK, aberta ? 1 : 0, 0.07);
      const rosca = clamp(abreK / 0.45), sai = suave(0.4, 1, abreK);
      pote.tampa.position.set(lerp(0, 1.05, sai), TAMPA_BASE + rosca * 0.08 + sai * 1.15, lerp(0, -0.3, sai));
      pote.tampa.rotation.set(sai * 0.35, -rosca * Math.PI * 2.5, -sai * 0.62);
      // um sopro de pó quando a tampa sai
      if (aberta) sopro = Math.min(1, sopro + 0.012); else sopro = Math.max(0, sopro - 0.03);
      const k = suave(0.15, 1, sopro);
      for (let i = 0; i < po.dados.length; i++) {
        const d = po.dados[i];
        const kk = clamp((k - d.atraso) / (1 - d.atraso));
        const ang = d.ang + kk * d.gira * 2 + t * 0.12 * d.gira, rad = d.rad * (1 + kk * d.abre * 1.2);
        po.pos[i * 3] = Math.cos(ang) * rad; po.pos[i * 3 + 1] = CORPO_TOPO + 0.05 + kk * d.sobe * 0.7; po.pos[i * 3 + 2] = Math.sin(ang) * rad;
      }
      po.geo.attributes.position.needsUpdate = true;
      po.mat.opacity = 0.9 * abreK * (1 - suave(0.7, 1, sopro) * 0.85);
      // câmera: pote inteiro, um pouco mais alto com a tampa aberta
      const tanV = Math.tan(T.MathUtils.degToRad(cam.fov / 2)) * 2;
      const d = Math.max(lerp(3.4, 5.4, sai) / tanV, lerp(3.2, 4.8, sai) / (tanV * cam.aspect));
      cam.position.set(0, lerp(2.1, 3.6, sai), d); cam.lookAt(lerp(0, 0.4, sai), lerp(1.0, 1.55, sai), 0);
      cam.updateProjectionMatrix();
      renderer.render(cena, cam);
    }
    function laco() {
      if (rodando) return; rodando = true;
      const passo = agora => { if (!visivel) { rodando = false; return; } quadro(agora); requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
    }
  }

  // ---------- RITUAL do clube: gira a tampa, a colher pega a dose no pote e leva ao copo ----------
  // Linha do tempo (p de 0 a 1, guiada pela rolagem):
  //   0,00 a 0,10  água fria enche o copo
  //   0,12 a 0,30  a tampa desenrosca (uma volta e meia, subindo pela rosca)
  //   0,30 a 0,40  a tampa sai e é pousada atrás, entre o pote e o copo
  //   0,40 a 0,56  a colher desce no pote, pega a dose e sai com o pó em cima
  //   0,56 a 0,64  a colher atravessa até o copo
  //   0,64 a 0,80  a colher vira e o pó cai na água
  //   0,72 a 0,92  a água gira e fica verde
  function iniciaRitual() {
    const sec = document.querySelector('[data-ritual]');
    const canvas = sec && sec.querySelector('canvas.ritual-3d');
    if (!canvas) return;
    const renderer = criaRenderer(canvas);
    const cena = new T.Scene(); cena.environment = criaAmbiente(renderer, 0x8a8f86);
    const luz = new T.DirectionalLight(0xffffff, 0.9); luz.position.set(-5, 9, 6); cena.add(luz);
    cena.add(new T.HemisphereLight(0xffffff, 0x334433, 0.35));
    const cam = new T.PerspectiveCamera(26, 1, 0.3, 200);
    const m = materiais();

    // pote fechado, de frente
    const POTE_X = -1.3;
    const pote = criaPote({ po: true });
    pote.grupo.position.set(POTE_X, 0, 0); pote.grupo.rotation.y = 0.18; cena.add(pote.grupo);
    const sP = criaSombra(0.42, 3.2); sP.position.set(POTE_X, 0.003, 0); cena.add(sP);
    const sT = criaSombra(0.0, 2.6); cena.add(sT); // sombra da tampa pousada
    const TAMPA_FIM = new T.Vector3(-0.25, 0, -2.3); // posição local (no pote) onde a tampa é pousada

    // copo de vidro (perfil com parede grossa) e água que respeita a parede interna
    const COPO_X = 1.2, FUNDO = 0.12;
    const perfil = [[0, 0.02], [0.62, 0.02], [0.66, 0.04], [0.7, 0.2], [0.78, 2.1], [0.8, 2.12], [0.76, 2.12], [0.72, 0.2], [0.68, 0.1], [0, 0.1]];
    const copo = new T.Mesh(new T.LatheGeometry(perfil.map(v => new T.Vector2(v[0], v[1])), 72), new T.MeshPhysicalMaterial({ color: 0x9fb2a4, roughness: 0.06, transparent: true, opacity: 0.3, clearcoat: 1, side: T.DoubleSide, depthWrite: false, envMapIntensity: 1.1 }));
    copo.position.x = COPO_X; copo.renderOrder = 2; cena.add(copo);
    const raioInterno = y => (y <= 0.2 ? 0.68 + (0.72 - 0.68) * Math.max(0, (y - 0.1) / 0.1) : 0.72 + 0.04 * (y - 0.2) / 1.92) - 0.025;
    // cor chapada (sem tone mapping) para o verde não clarear com o reflexo do vidro
    const aguaMat = new T.MeshBasicMaterial({ color: 0xdfece6, transparent: true, opacity: 0.32, depthWrite: false, toneMapped: false });
    const agua = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 0.01, 64), aguaMat); agua.position.x = COPO_X; agua.renderOrder = 1; cena.add(agua);
    let nivelGeo = -1;
    function moldaAgua(topo) {
      if (Math.abs(topo - nivelGeo) < 0.004) return;
      nivelGeo = topo;
      const h = Math.max(0.01, topo - FUNDO);
      agua.geometry.dispose();
      agua.geometry = new T.CylinderGeometry(raioInterno(topo), raioInterno(FUNDO), h, 64, 1, false);
      agua.position.y = FUNDO + h / 2;
    }
    const sC = criaSombra(0.22, 2.2); sC.position.set(COPO_X, 0.003, 0); cena.add(sC);
    const corLimpa = new T.Color(0xdfece6), corVerde = new T.Color(0x2e6b2c);

    // colher dosadora: concha arredondada e cabo, em plástico verde-lima
    const colher = new T.Group();
    const plastico = new T.MeshPhysicalMaterial({ color: 0x9cbc5c, roughness: 0.45, clearcoat: 0.4, side: T.DoubleSide });
    const pc = [[0, 0], [0.19, 0.012], [0.235, 0.06], [0.25, 0.2], [0.236, 0.2], [0.222, 0.07], [0.185, 0.026], [0, 0.026]];
    const concha = new T.Mesh(new T.LatheGeometry(pc.map(v => new T.Vector2(v[0], v[1])), 40), plastico);
    const cabo = new T.Mesh(new T.BoxGeometry(0.95, 0.045, 0.12), plastico); cabo.position.set(-0.7, 0.19, 0);
    const monte = new T.Mesh(new T.SphereGeometry(0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), m.po); monte.scale.y = 0.45; monte.position.y = 0.17;
    colher.add(concha, cabo, monte); colher.scale.setScalar(0.001); cena.add(colher);

    // pó que cai e depois gira dentro da água
    const queda = criaPo(reduz ? 200 : 1300, 41, ['#5f8f2f', '#9cbc5c', '#2f6b3a', '#c4d997']); cena.add(queda.pts);

    const legendas = [...sec.querySelectorAll('[data-fase]')];
    let W = 0, H = 0, retrato = false;
    function ajusta() { W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return; renderer.setSize(W, H, false); cam.aspect = W / H; retrato = W / H < 0.85; }
    new ResizeObserver(ajusta).observe(canvas); ajusta();

    let atual = 0, rodando = false, visivel = false;
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) laco(); }, { rootMargin: '100px' }).observe(sec);
    const tv = new T.Vector3();

    function quadro(p, agora) {
      const t = agora / 1000;
      const enche = suave(0.0, 0.1, p);
      const rosca = suave(0.12, 0.3, p);
      const sai = suave(0.3, 0.4, p), ergue = suave(0.3, 0.34, p), anda = suave(0.33, 0.4, p);
      const desce = suave(0.4, 0.47, p), pega = suave(0.47, 0.52, p), sobe = suave(0.52, 0.56, p);
      const leva = suave(0.56, 0.64, p), vira = suave(0.64, 0.7, p), cai = suave(0.66, 0.8, p);
      const embora = suave(0.8, 0.86, p), mistura = suave(0.72, 0.92, p);

      // água
      const topo = FUNDO + 0.04 + enche * 1.5;
      moldaAgua(topo);
      aguaMat.color.copy(corLimpa).lerp(corVerde, mistura);
      aguaMat.opacity = lerp(0.32, 0.9, mistura);
      agua.visible = enche > 0.01;

      // tampa: desenrosca girando e subindo pela rosca, depois sai num arco e pousa atrás
      const giro = -rosca * Math.PI * 3;
      const y0 = TAMPA_BASE + rosca * 0.08;
      // sobe reto até sair da boca, depois vai num arco até a mesa
      pote.tampa.position.set(lerp(0, TAMPA_FIM.x, anda), lerp(y0 + ergue * 0.9, TAMPA_FIM.y, anda) + Math.sin(anda * Math.PI) * 0.5, lerp(0, TAMPA_FIM.z, anda));
      pote.tampa.rotation.set(Math.sin(sai * Math.PI) * 0.25, giro - sai * 0.6, 0);
      tv.copy(TAMPA_FIM); pote.grupo.localToWorld(tv);
      sT.position.set(tv.x, 0.003, tv.z); sT.material.opacity = 0.35 * suave(0.85, 1, sai);

      // colher: entra por cima do pote, mergulha, sai com o monte de pó, atravessa e vira sobre o copo
      const xPote = POTE_X + 0.18, yFora = 2.75, yDentro = CORPO_TOPO - 0.2;
      let cx = xPote, cy = yFora, rz = -0.32, cz = 0;
      if (p < 0.56) { cy = lerp(yFora, yDentro, desce) + (yFora - yDentro) * sobe; rz = lerp(-0.32, -0.42, desce) + 0.1 * sobe; }
      else {
        cx = lerp(xPote, COPO_X + 0.05, leva); cy = yFora + Math.sin(leva * Math.PI) * 0.35; cz = Math.sin(leva * Math.PI) * 0.3;
        rz = lerp(-0.22, 2.25, vira);
      }
      colher.position.set(cx, cy + embora * 1.2, cz);
      colher.rotation.set(0, 0, rz);
      const aparece = suave(0.39, 0.43, p) * (1 - embora);
      colher.scale.setScalar(Math.max(0.001, aparece));
      monte.visible = pega > 0.5 && cai < 0.12;
      monte.scale.set(1, 0.45 * Math.max(0.2, pega), 1);
      // pó do pote baixa um pouquinho depois da dose
      pote.po.position.y = CORPO_TOPO - 0.16 - pega * 0.02;

      // partículas: caem num funil a partir da colher e giram em espiral dentro da água
      for (let i = 0; i < queda.dados.length; i++) {
        const d = queda.dados[i];
        const k = clamp((cai - d.atraso * 0.6) / 0.6);
        const fundo = FUNDO + (topo - FUNDO) * (0.2 + d.tam * 0.72);
        const rMax = raioInterno(fundo) - 0.05;
        let x, y, z;
        if (k < 1) { const r0 = 0.04 + k * 0.22; x = COPO_X + Math.cos(d.ang) * d.rad * r0; y = lerp(yFora - 0.1, fundo, k * k); z = Math.sin(d.ang) * d.rad * r0; }
        else { const ang = d.ang + t * (0.8 + d.gira) * (1 - mistura * 0.6); const rr = Math.min(rMax, d.rad * rMax * (0.35 + mistura * 0.65)); x = COPO_X + Math.cos(ang) * rr; y = fundo; z = Math.sin(ang) * rr; }
        queda.pos[i * 3] = x; queda.pos[i * 3 + 1] = y; queda.pos[i * 3 + 2] = z;
      }
      queda.geo.attributes.position.needsUpdate = true;
      queda.mat.opacity = suave(0.66, 0.69, p) * (1 - mistura * 0.92); queda.mat.size = 0.06;

      // câmera: mesa inteira na metade direita; aproxima um pouco do copo no fim
      const zoom = suave(0.78, 1, p);
      const tanV = Math.tan(T.MathUtils.degToRad(cam.fov / 2)) * 2;
      const larg = retrato ? lerp(4.9, 4.6, zoom) : lerp(8.2, 7.4, zoom), alt = retrato ? 5.6 : 4.4;
      const d = Math.max(alt / tanV, larg / (tanV * cam.aspect));
      const foco = lerp(-0.1, 0.15, zoom);
      cam.position.set(foco + 0.5, lerp(2.9, 2.5, zoom), d);
      cam.lookAt(foco, 1.05, 0);
      cam.setViewOffset(W, H, retrato ? -W * 0.03 : -W * 0.17, retrato ? -H * 0.1 : 0, W, H);
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
    if (!T || !RT || !suportaWebGL()) { document.documentElement.classList.add('sem-3d'); document.dispatchEvent(new Event('aura:3d-pronto')); return; }
    try { await RT.carrega(BASE); } catch (e) { /* segue com o que tiver */ }
    const apoio = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    apoio.setPixelRatio(1); apoio.setClearColor(0, 0); apoio.outputEncoding = T.sRGBEncoding; apoio.toneMapping = T.ACESFilmicToneMapping;
    try { renderizaEstaticos(apoio); } catch (e) { console.error(e); }
    apoio.dispose(); if (apoio.forceContextLoss) apoio.forceContextLoss();
    iniciaHeroProduto();
    iniciaGota();
    try { iniciaMare(); } catch (e) { console.error(e); }
    iniciaPalco();
    iniciaRitual();
    iniciaRotulo();
    iniciaModal();
    document.documentElement.classList.add('com-3d');
    document.dispatchEvent(new Event('aura:3d-pronto'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inicia); else inicia();
})();
