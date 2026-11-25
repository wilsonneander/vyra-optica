/* Camélia Gold: clínica em 3D e voo de drone. Gerado por _build-camelia-premium/build.js */
window.CameliaCena={criar(canvas,D,opc){
'use strict';
// ===== cena/base.js =====
// ---------- base da cena: renderizador, luz, ambiente, materiais, texturas e formas ----------
// Este arquivo e os outros de cena/ são pedaços do corpo de criar(canvas, D, opc); o build junta todos.
const T = window.THREE;
const P = D.planta;
const Z0 = P.fundo, Z1 = P.frente, H = P.altura, E = 0.2;
const salas = P.salas.map((s, i) => ({ ...s, i, cx: (s.x[0] + s.x[1]) / 2, w: s.x[1] - s.x[0] }));
const SALA = Object.fromEntries(salas.map((s) => [s.id, s]));
const X0 = salas[0].x[0], X1 = salas[salas.length - 1].x[1];
const cel = !!opc.cel;
const PI = Math.PI;

const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.22;
const dprMax = cel ? 1.5 : 1.75;
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprMax));

const cena = new T.Scene();
const corNevoa = new T.Color('#F4EDE8');
cena.fog = new T.Fog(corNevoa, 62, 175);
const cam = new T.PerspectiveCamera(46, 1, 0.08, 300);

// sorteio com semente: a cena sai igual em toda visita
let semente = 20261119;
const rnd = () => { semente = (semente * 16807) % 2147483647; return (semente - 1) / 2147483646; };
const entre = (a, b) => a + rnd() * (b - a);

// ---------- ambiente (reflexos do ouro, do vidro e do inox) ----------
{
  const c = new T.Scene();
  const geo = new T.SphereGeometry(10, 48, 24);
  const pos = geo.attributes.position, cores = [];
  const ceu = new T.Color('#FFFFFF'), hor = new T.Color('#F6E4DD'), chao = new T.Color('#D8C9BE'), k = new T.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 10;
    if (y > 0) k.lerpColors(hor, ceu, Math.pow(y, 0.55)); else k.lerpColors(hor, chao, Math.min(1, -y * 2.4));
    cores.push(k.r, k.g, k.b);
  }
  geo.setAttribute('color', new T.Float32BufferAttribute(cores, 3));
  c.add(new T.Mesh(geo, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide })));
  const caixaLuz = (x, y, z, w, h, f) => {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(f, f * 0.97, f * 0.93), side: T.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); c.add(m);
  };
  caixaLuz(-5, 6, 5, 6, 3, 3.2); caixaLuz(6, 4, -3, 4, 4, 1.7); caixaLuz(0, 9, 0, 6, 6, 1.5); caixaLuz(4, 2, 7, 3, 2, 1.4);
  const pm = new T.PMREMGenerator(renderer);
  cena.environment = pm.fromScene(c, 0.035).texture;
  pm.dispose();
}

// ---------- luz: sol (que vira lua no tema escuro), céu e luz das salas ----------
const hemi = new T.HemisphereLight('#FFF6EE', '#E9D7CD', 0.24);
cena.add(hemi);
const sol = new T.DirectionalLight('#FFF0DF', 3.8);
const solDir = new T.Vector3(-0.55, 0.72, 0.42).normalize();
sol.castShadow = true;
sol.shadow.mapSize.set(cel ? 1024 : 2048, cel ? 1024 : 2048);
sol.shadow.bias = -0.00035;
sol.shadow.normalBias = 0.03;
sol.shadow.camera.near = 1;
sol.shadow.camera.far = 90;
cena.add(sol, sol.target);
const lx = new T.Vector3().crossVectors(new T.Vector3(0, 1, 0), solDir).normalize();
const ly = new T.Vector3().crossVectors(solDir, lx).normalize();
let raioSombra = 0;
const focoSombra = new T.Vector3();
function poeSol(foco, raio) {
  const sc = sol.shadow.camera;
  if (raio !== raioSombra) { raioSombra = raio; renderer.shadowMap.needsUpdate = true; sc.left = -raio; sc.right = raio; sc.top = raio; sc.bottom = -raio; sc.updateProjectionMatrix(); }
  // prende o foco à grade de texels da sombra para ela não tremer quando a câmera anda
  const tx = (2 * raio) / sol.shadow.mapSize.x;
  const a = Math.round(foco.dot(lx) / tx) * tx, b = Math.round(foco.dot(ly) / tx) * tx, c = foco.dot(solDir);
  const antes = focoSombra.clone();
  focoSombra.set(0, 0, 0).addScaledVector(lx, a).addScaledVector(ly, b).addScaledVector(solDir, c);
  if (antes.distanceToSquared(focoSombra) > 1e-8) renderer.shadowMap.needsUpdate = true;
  sol.target.position.copy(focoSombra);
  sol.position.copy(focoSombra).addScaledVector(solDir, 40);
}
// duas luzes que acompanham o drone: a da sala em que ele está e a da próxima
const luzSala = [0, 1].map(() => { const l = new T.PointLight('#FFE3CC', 7, 12, 1.6); cena.add(l); return l; });

// ---------- texturas desenhadas aqui ----------
const tela = (w, h, desenha) => { const c = document.createElement('canvas'); c.width = w; c.height = h; desenha(c.getContext('2d'), w, h); return c; };
const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const tex = (c, rx = 1, ry = 1, cor = true) => {
  const t = new T.CanvasTexture(c);
  t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = aniso;
  if (cor) t.colorSpace = T.SRGBColorSpace;
  return t;
};
const repete = (desenha, w, h) => (g) => { for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) { g.save(); g.translate(ox, oy); desenha(g); g.restore(); } };
// granilite claro com lascas rosa, areia, ouro e vinho
const cvGranilite = tela(512, 512, (g, w, h) => {
  g.fillStyle = '#F3EDE7'; g.fillRect(0, 0, w, h);
  const cores = ['#E9CFC7', '#E9CFC7', '#DDD5CE', '#DED6CF', '#CDB68E', '#FFFFFF', '#FFFFFF', '#BE8790'];
  const lascas = [];
  for (let i = 0; i < 1100; i++) {
    const x = rnd() * w, y = rnd() * h, r = 1.4 + rnd() ** 2.2 * 7.5, cor = cores[(rnd() * cores.length) | 0], n = 5 + ((rnd() * 3) | 0), pts = [];
    for (let k = 0; k < n; k++) { const a = (k / n) * PI * 2 + rnd() * 0.6, rr = r * (0.55 + rnd() * 0.55); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
    lascas.push([cor, pts]);
  }
  repete((c) => lascas.forEach(([cor, pts]) => { c.fillStyle = cor; c.beginPath(); pts.forEach(([px, py], k) => (k ? c.lineTo(px, py) : c.moveTo(px, py))); c.closePath(); c.fill(); }), w, h)(g);
});
// tábuas largas de carvalho claro
const cvCarvalho = tela(512, 512, (g, w, h) => {
  const linhas = 4, alt = h / linhas;
  for (let l = 0; l < linhas; l++) {
    let x = -rnd() * 300;
    while (x < w) {
      const comp = 220 + rnd() * 200, tom = 214 + rnd() * 16;
      g.fillStyle = `rgb(${tom + 14},${tom - 2},${tom - 26})`;
      g.fillRect(x, l * alt, comp, alt);
      for (let k = 0; k < 18; k++) { g.strokeStyle = `rgba(150,110,70,${0.04 + rnd() * 0.06})`; g.lineWidth = 0.6 + rnd(); const yy = l * alt + rnd() * alt; g.beginPath(); g.moveTo(x, yy); g.bezierCurveTo(x + comp * 0.3, yy + entre(-3, 3), x + comp * 0.7, yy + entre(-3, 3), x + comp, yy + entre(-2, 2)); g.stroke(); }
      g.fillStyle = 'rgba(120,90,60,.35)'; g.fillRect(x, l * alt, 1.4, alt);
      x += comp;
    }
    g.fillStyle = 'rgba(120,90,60,.3)'; g.fillRect(0, l * alt, w, 1.2);
  }
});
// vinílico claro de clínica: placas grandes, junta quase invisível
const cvVinilico = tela(512, 512, (g, w, h) => {
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const t = 238 + rnd() * 5; g.fillStyle = `rgb(${t},${t - 4},${t - 8})`; g.fillRect(i * 256, j * 256, 256, 256); }
  for (let k = 0; k < 2600; k++) { g.fillStyle = `rgba(${rnd() > 0.5 ? '255,255,255' : '190,175,165'},${0.05 + rnd() * 0.08})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2); }
  g.strokeStyle = 'rgba(170,155,145,.35)'; g.lineWidth = 1.5; g.strokeRect(0.75, 0.75, 256, 256); g.strokeRect(256.75, 256.75, 256, 256); g.strokeRect(256.75, 0.75, 256, 256); g.strokeRect(0.75, 256.75, 256, 256);
});
// pedra do caminho do jardim
const cvPedra = tela(256, 512, (g, w, h) => {
  g.fillStyle = '#D9CDBF'; g.fillRect(0, 0, w, h);
  for (let j = 0; j < 4; j++) { const off = j % 2 ? 64 : 0; for (let i = -1; i < 3; i++) { const t = 226 + rnd() * 14; g.fillStyle = `rgb(${t + 6},${t - 2},${t - 12})`; g.fillRect(i * 128 + off + 3, j * 128 + 3, 122, 122); } }
});
// grão para o bouclé e o reboco (relevo)
const cvBoucle = tela(256, 256, (g, w, h) => {
  g.fillStyle = '#888'; g.fillRect(0, 0, w, h);
  repete((c) => { for (let k = 0; k < 900; k++) { const x = (k * 97.13) % w, y = (k * 61.7) % h; c.fillStyle = `rgba(255,255,255,${0.25 + (k % 7) * 0.08})`; c.beginPath(); c.arc(x + Math.sin(k) * 9, y + Math.cos(k * 1.3) * 9, 2 + (k % 3), 0, PI * 2); c.fill(); } }, w, h)(g);
});
const cvReboco = tela(256, 256, (g, w, h) => {
  const d = g.createImageData(w, h);
  for (let i = 0; i < w * h; i++) { const v = 118 + rnd() * 20; d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = v; d.data[i * 4 + 3] = 255; }
  g.putImageData(d, 0, 0);
});
// mármore claro com veios finos
const cvMarmore = tela(512, 512, (g, w, h) => {
  g.fillStyle = '#F5F2EF'; g.fillRect(0, 0, w, h);
  for (let k = 0; k < 16; k++) {
    g.strokeStyle = `rgba(${170 + rnd() * 30},${150 + rnd() * 30},${140 + rnd() * 30},${0.12 + rnd() * 0.2})`; g.lineWidth = 0.6 + rnd() * 1.6;
    let x = rnd() * w, y = 0; g.beginPath(); g.moveTo(x, y);
    while (y < h) { x += entre(-24, 24); y += entre(18, 40); g.lineTo(x, y); }
    g.stroke();
  }
});
// sombra de contato embaixo dos móveis
const texSombra = new T.CanvasTexture(tela(128, 128, (g) => {
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(70,45,40,.5)'); gr.addColorStop(0.55, 'rgba(70,45,40,.2)'); gr.addColorStop(1, 'rgba(70,45,40,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
}));
const texBrilho = new T.CanvasTexture(tela(64, 64, (g) => {
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
}));
const imagem = (src, cor = true) => {
  const t = new T.Texture();
  if (cor) t.colorSpace = T.SRGBColorSpace;
  t.anisotropy = aniso;
  if (!src) return t;
  const img = new Image();
  img.onload = () => { t.image = img; t.needsUpdate = true; };
  img.src = src;
  return t;
};

// ---------- materiais ----------
const todosMats = new Set();
// reflexo forte só em metal e vidro; o resto recebe pouco ambiente, para a luz direta desenhar volume
const reg = (m) => { const e = m.envMapIntensity ?? 1; m.envMapIntensity = m.userData.env = (m.metalness > 0.5 || m.transparent) ? e : e * 0.36; todosMats.add(m); return m; };
const std = (cor, r = 0.9, ex = {}) => reg(new T.MeshStandardMaterial({ color: cor, roughness: r, metalness: 0, ...ex }));
const fis = (cor, ex = {}) => reg(new T.MeshPhysicalMaterial({ color: cor, roughness: 0.9, ...ex }));
const tReboco = tex(cvReboco, 3, 3, false);
const tBoucle = tex(cvBoucle, 3, 3, false);
const mt = {
  parede: std('#F6F1EC', 0.95, { bumpMap: tReboco, bumpScale: 0.6 }),
  fachada: std('#F8F4EF', 0.92, { bumpMap: tReboco, bumpScale: 0.8 }),
  rosaParede: std('#EFD8D0', 0.92, { bumpMap: tReboco, bumpScale: 0.5 }),
  rosaPo: std('#E9CDC4', 0.75),
  rosaLaca: std('#EBCFC6', 0.38),
  branco: std('#FBF8F5', 0.85),
  laca: std('#FBF9F7', 0.3),
  teto: std('#FBF9F6', 0.97, { emissive: new T.Color('#FFF8F2'), emissiveIntensity: 0.2 }),
  ouro: std('#D4B27A', 0.3, { metalness: 1 }),
  ouroFosco: std('#C9AC7C', 0.48, { metalness: 1 }),
  inox: std('#DCDCDA', 0.26, { metalness: 1 }),
  cromo: std('#F2F2F2', 0.12, { metalness: 1 }),
  vidro: reg(new T.MeshPhysicalMaterial({ color: '#FFFFFF', roughness: 0.04, metalness: 0, transparent: true, opacity: 0.14, depthWrite: false, envMapIntensity: 1.6, side: T.DoubleSide })),
  espelho: std('#FFFFFF', 0.04, { metalness: 1, envMapIntensity: 1.2 }),
  estofado: fis('#E8C8BF', { roughness: 0.7, sheen: 1, sheenRoughness: 0.5, sheenColor: new T.Color('#FFF1EC') }),
  estofadoClaro: fis('#F3E2DC', { roughness: 0.75, sheen: 1, sheenRoughness: 0.5, sheenColor: new T.Color('#FFFFFF') }),
  boucle: fis('#F4EFE8', { roughness: 1, sheen: 1, sheenRoughness: 0.8, sheenColor: new T.Color('#FFFFFF'), bumpMap: tBoucle, bumpScale: 1.4 }),
  boucleRosa: fis('#EFDAD2', { roughness: 1, sheen: 1, sheenRoughness: 0.8, sheenColor: new T.Color('#FFF4F0'), bumpMap: tBoucle, bumpScale: 1.4 }),
  carvalho: std('#DCC6A8', 0.7, { map: tex(cvCarvalho, 1, 1) }),
  carvalhoLiso: std('#D9C1A1', 0.62),
  marmore: std('#F5F2EF', 0.28, { map: tex(cvMarmore, 1, 1) }),
  travertino: std('#E8DDD0', 0.7, { bumpMap: tReboco, bumpScale: 1.2 }),
  ceramica: std('#ECE2D9', 0.6),
  ceramicaRosa: std('#E6CBC2', 0.55),
  papel: std('#FFFFFF', 1),
  toalha: fis('#FBF8F4', { roughness: 1, sheen: 1, sheenRoughness: 0.9, sheenColor: new T.Color('#FFFFFF'), bumpMap: tBoucle, bumpScale: 0.8 }),
  toalhaRosa: fis('#F1DCD4', { roughness: 1, sheen: 1, sheenRoughness: 0.9, sheenColor: new T.Color('#FFFFFF'), bumpMap: tBoucle, bumpScale: 0.8 }),
  linho: fis('#F6EFE7', { roughness: 1, sheen: 0.6, sheenColor: new T.Color('#FFFFFF'), transparent: true, opacity: 0.88, side: T.DoubleSide }),
  vinho: std('#8E3D4E', 0.55),
  vinhoLaca: std('#7A2A3D', 0.32),
  salvia: std('#B6C1A8', 0.92),
  salviaEsc: std('#98A68A', 0.92),
  cipreste: std('#8D9C80', 0.95),
  oliva: std('#C3CBB6', 0.9),
  folha: std('#A3B293', 0.8, { side: T.DoubleSide }),
  tronco: std('#9C8A78', 0.95),
  terra: std('#8C7A6A', 1),
  areia: std('#EFE6DD', 1),
  grama: std('#D5DCC8', 1),
  pedraClara: std('#E9E0D6', 0.9),
  caminho: std('#E4D8CA', 0.95, { map: tex(cvPedra, 1, 6) }),
  tela: std('#2B2427', 0.35),
  cinzaClaro: std('#E4DDD8', 0.8),
  borracha: std('#CFC6C0', 0.9),
  pampa: std('#EADBC4', 1),
  liquidoRosa: std('#F1C9C3', 0.1, { transparent: true, opacity: 0.85 }),
  sombra: new T.MeshBasicMaterial({ map: texSombra, transparent: true, depthWrite: false, opacity: 0.45 }),
};
mt.pisoGranilite = std('#FFFFFF', 0.55, { map: tex(cvGranilite, 1, 1) });
mt.pisoCarvalho = std('#FFFFFF', 0.68, { map: tex(cvCarvalho, 1, 1) });
mt.pisoVinilico = std('#FFFFFF', 0.42, { map: tex(cvVinilico, 1, 1) });
// luzes que acendem (emissivas): a intensidade muda com o tema e com a chegada do drone
const emissivo = (cor, base = 1, noite = base) => { const m = std('#FFFFFF', 0.5, { emissive: new T.Color(cor), emissiveIntensity: base }); m.userData.base = base; m.userData.noite = noite; return m; };
mt.globo = emissivo('#FFE6CC', 0.35, 2.4);
mt.ledFrio = emissivo('#FFF8F2', 0.15, 0.4);
mt.neon = emissivo('#FF7B98', 0);
mt.neon.color.set('#FFB8C6');
mt.chama = emissivo('#FFC27A', 2.2, 3);
mt.janelaNoite = mt.vidro;

// ---------- formas ----------
const cacheGeo = new Map();
const memo = (k, f) => { if (!cacheGeo.has(k)) cacheGeo.set(k, f()); return cacheGeo.get(k); };
// caixa de cantos arredondados (a normal sai da própria curva, sem emenda)
function geoCaixa(w, h, d, r = 0.02, k = r > 0.04 ? 3 : 2) {
  r = Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4);
  return memo(`c${w},${h},${d},${r}`, () => {
    if (r <= 0.0065) return new T.BoxGeometry(w, h, d);
    const n = 2 * k + 1;
    const g = new T.BoxGeometry(1, 1, 1, n, n, n);
    const pos = g.attributes.position, nor = g.attributes.normal;
    const meio = [w / 2, h / 2, d / 2];
    const mapa = (u, m) => {
      const j = Math.round((u + 0.5) * n);
      if (j <= k) return -m + (j / k) * r;
      if (j >= n - k) return m - r + ((j - (n - k)) / k) * r;
      return -m + r + ((j - k) / (n - 2 * k)) * (2 * m - 2 * r);
    };
    const p = new T.Vector3(), c = new T.Vector3(), dv = new T.Vector3();
    for (let i = 0; i < pos.count; i++) {
      p.set(mapa(pos.getX(i), meio[0]), mapa(pos.getY(i), meio[1]), mapa(pos.getZ(i), meio[2]));
      c.set(T.MathUtils.clamp(p.x, -meio[0] + r, meio[0] - r), T.MathUtils.clamp(p.y, -meio[1] + r, meio[1] - r), T.MathUtils.clamp(p.z, -meio[2] + r, meio[2] - r));
      dv.subVectors(p, c);
      if (dv.lengthSq() < 1e-12) dv.set(nor.getX(i), nor.getY(i), nor.getZ(i));
      dv.normalize();
      pos.setXYZ(i, c.x + dv.x * r, c.y + dv.y * r, c.z + dv.z * r);
      nor.setXYZ(i, dv.x, dv.y, dv.z);
    }
    return g;
  });
}
const malha = (geo, mat, sombra = true) => { const m = new T.Mesh(geo, mat); m.castShadow = sombra; m.receiveShadow = true; return m; };
const caixa = (w, h, d, mat, r = 0.02) => malha(geoCaixa(w, h, d, r), mat);
const cil = (rt, rb, h, mat, seg = 32) => malha(memo(`y${rt},${rb},${h},${seg}`, () => new T.CylinderGeometry(rt, rb, h, seg)), mat);
const esf = (r, mat, ws = 32, hs = 16) => malha(memo(`s${r},${ws}`, () => new T.SphereGeometry(r, ws, hs)), mat);
const toro = (r, t, mat, arco = PI * 2, rs = 12, ts = 64) => malha(new T.TorusGeometry(r, t, rs, ts, arco), mat);
const torno = (pts, mat, seg = 48, ini = 0, arco = PI * 2) => malha(new T.LatheGeometry(pts.map(([r, y]) => new T.Vector2(r, y)), seg, ini, arco), mat);
const curva = (pts, fechada = false) => new T.CatmullRomCurve3(pts.map((p) => new T.Vector3(...p)), fechada, 'centripetal');
const tubo = (pts, r, mat, seg = 48, fechado = false) => malha(new T.TubeGeometry(curva(pts, fechado), seg, r, 10, fechado), mat);
const poe = (o, x = 0, y = 0, z = 0, ry = 0) => { o.position.set(x, y, z); if (ry) o.rotation.y = ry; return o; };
const grupo = (...f) => { const g = new T.Group(); f.forEach((o) => o && g.add(o)); return g; };
const matsSombra = new Map();
const sombraChao = (w, d, x = 0, z = 0, op = 0.45) => {
  const k = Math.round(op * 20) / 20;
  if (!matsSombra.has(k)) matsSombra.set(k, Object.assign(mt.sombra.clone(), { opacity: k }));
  const m = new T.Mesh(memo('pl1', () => new T.PlaneGeometry(1, 1)), matsSombra.get(k));
  m.scale.set(w, d, 1); m.rotation.x = -PI / 2; m.position.set(x, 0.008, z); m.renderOrder = 2; return m;
};
// arco: retângulo com meia-volta em cima (o desenho de janela e espelho da marca)
function caminhoArco(p, cx, y0, w, topo) {
  const r = w / 2, yc = topo - r;
  p.moveTo(cx - r, y0); p.lineTo(cx + r, y0); p.lineTo(cx + r, yc); p.absarc(cx, yc, r, 0, PI, false); p.lineTo(cx - r, y0);
  return p;
}
const formaArco = (w, alt, y0 = 0) => caminhoArco(new T.Shape(), 0, y0, w, y0 + alt);
// placa com contorno de arco, extrudada
const placaArco = (w, alt, esp, mat) => malha(new T.ExtrudeGeometry(formaArco(w, alt), { depth: esp, bevelEnabled: false, curveSegments: 32 }), mat);
// moldura em arco (anel): fora menos dentro
function molduraArco(w, alt, borda, esp, mat) {
  const s = formaArco(w, alt);
  s.holes.push(caminhoArco(new T.Path(), 0, borda, w - borda * 2, alt - borda));
  return malha(new T.ExtrudeGeometry(s, { depth: esp, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2, curveSegments: 32 }), mat);
}
// superfície plana em arco com UV de 0 a 1 (para foto e espelho)
function telaArco(w, alt, mat) {
  const g = new T.ShapeGeometry(formaArco(w, alt), 32);
  const uv = g.attributes.uv, pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / alt);
  return malha(g, mat, false);
}
// parede plana com aberturas: as que tocam o chão entram no contorno, as janelas viram furos
function parede(x0, x1, alt, portas = [], janelas = [], mat = mt.parede, esp = E) {
  const s = new T.Shape();
  s.moveTo(x0, 0);
  [...portas].sort((a, b) => a.cx - b.cx).forEach((p) => {
    const r = p.w / 2, yc = p.topo - r;
    s.lineTo(p.cx - r, 0); s.lineTo(p.cx - r, yc); s.absarc(p.cx, yc, r, PI, 0, true); s.lineTo(p.cx + r, 0);
  });
  s.lineTo(x1, 0); s.lineTo(x1, alt); s.lineTo(x0, alt); s.lineTo(x0, 0);
  janelas.forEach((j) => s.holes.push(caminhoArco(new T.Path(), j.cx, j.y0, j.w, j.topo)));
  return malha(new T.ExtrudeGeometry(s, { depth: esp, bevelEnabled: false, curveSegments: 28 }), mat);
}
// frente canelada (ripas meia-cana), usada no balcão e nos aparadores
function canelado(w, alt, prof, ripas, mat) {
  const s = new T.Shape(), n = ripas * 10;
  // a forma fica no plano do chão (y da forma = -z do mundo) e a extrusão sobe
  s.moveTo(-w / 2, 0);
  for (let i = 0; i <= n; i++) { const x = -w / 2 + (i / n) * w; s.lineTo(x, -(prof + 0.022 * Math.sqrt(Math.abs(Math.sin((i / n) * PI * ripas))))); }
  s.lineTo(w / 2, 0); s.lineTo(-w / 2, 0);
  const m = malha(new T.ExtrudeGeometry(s, { depth: alt, bevelEnabled: false }), mat);
  m.rotation.x = -PI / 2;
  return m;
}
// folhagem macia: esfera com relevo (o relevo depende da posição, então as emendas fecham)
function folhagem(r, mat, sem = 1) {
  const g = new T.SphereGeometry(r, 20, 14);
  const p = g.attributes.position, v = new T.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = Math.sin(v.x * 6.1 / r + sem) * Math.sin(v.y * 5.3 / r + sem * 1.7) * Math.sin(v.z * 6.7 / r + sem * 0.6) + 0.5 * Math.sin(v.x * 13 / r + v.z * 11 / r + sem);
    v.multiplyScalar(1 + 0.09 * n);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return malha(g, mat);
}
// texto em textura (fundo transparente) num plano
function placaTexto(w, alt, desenha, px = 512) {
  const c = tela(px, Math.round((px * alt) / w), desenha);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = aniso;
  const m = new T.Mesh(new T.PlaneGeometry(w, alt), reg(new T.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.8, metalness: 0 })));
  m.userData.redesenha = () => { desenha(c.getContext('2d'), c.width, c.height); t.needsUpdate = true; };
  textos.push(m);
  return m;
}
const textos = [];
const F_T = "'Spectral', Georgia, serif", F_C = "'Urbanist', 'Segoe UI', Arial, sans-serif";
// pétala da camélia (mesmo desenho do logo)
function formaPetala(r, d) {
  const s = new T.Shape();
  s.moveTo(0, 0); s.bezierCurveTo(-d, r * 0.3, -d, r * 0.85, 0, r); s.bezierCurveTo(d, r * 0.85, d, r * 0.3, 0, 0);
  return s;
}
// camélia em relevo: cinco pétalas de fora, cinco de dentro e o miolo
function camelia(tam, matFora = mt.ouro, matDentro = mt.vinhoLaca, matMiolo = mt.ouro, esp = 0.02) {
  const g = new T.Group(), k = tam / 48;
  const geoF = new T.ExtrudeGeometry(formaPetala(20 * k, 7.5 * k), { depth: esp, bevelEnabled: true, bevelThickness: esp * 0.4, bevelSize: esp * 0.3, bevelSegments: 2, curveSegments: 16 });
  const geoD = new T.ExtrudeGeometry(formaPetala(12 * k, 4.2 * k), { depth: esp, bevelEnabled: true, bevelThickness: esp * 0.4, bevelSize: esp * 0.3, bevelSegments: 2, curveSegments: 12 });
  [0, 72, 144, 216, 288].forEach((a) => { const m = malha(geoF, matFora, false); m.rotation.z = -(a * PI) / 180; g.add(m); });
  [36, 108, 180, 252, 324].forEach((a) => { const m = malha(geoD, matDentro, false); m.rotation.z = -(a * PI) / 180; m.position.z = esp * 1.2; g.add(m); });
  const c = esf(2.8 * k, matMiolo, 16, 10); c.scale.z = 0.5; c.position.z = esp * 2.4; g.add(c);
  return g;
}
// flor de verdade, para os vasos: pétalas curvas em volta do miolo
function florVaso(r, cor = mt.rosaPo) {
  const g = new T.Group();
  for (let i = 0; i < 9; i++) {
    const p = esf(r * 0.55, cor, 14, 10); const a = (i / 9) * PI * 2, anel = i < 5 ? 1 : 0.55;
    p.scale.set(1, 0.38, 0.75); p.position.set(Math.cos(a) * r * 0.5 * anel, (i < 5 ? 0 : 0.18) * r, Math.sin(a) * r * 0.5 * anel); p.rotation.y = -a; p.rotation.z = 0.5;
    g.add(p);
  }
  g.add(poe(esf(r * 0.22, mt.ouroFosco, 12, 8), 0, r * 0.25, 0));
  return g;
}

// ---------- fusão: junta os objetos parados de um grupo por material (menos chamadas de desenho) ----------
function juntaGeos(lista) {
  let n = 0; lista.forEach((g) => { n += g.attributes.position.count; });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2);
  let o = 0;
  lista.forEach((g) => { const c = g.attributes.position.count; pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3); if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2); o += c; g.dispose(); });
  const r = new T.BufferGeometry();
  r.setAttribute('position', new T.BufferAttribute(pos, 3)); r.setAttribute('normal', new T.BufferAttribute(nor, 3)); r.setAttribute('uv', new T.BufferAttribute(uv, 2));
  r.computeBoundingSphere();
  return r;
}
function funde(grupo, pular = new Set()) {
  grupo.updateMatrixWorld(true);
  const inv = new T.Matrix4().copy(grupo.matrixWorld).invert(), mx = new T.Matrix4();
  const porMat = new Map(), sai = [];
  grupo.traverse((o) => {
    if (!o.isMesh || o === grupo) return;
    for (let p = o; p && p !== grupo; p = p.parent) if (p.userData.vivo || pular.has(p)) return;
    let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    Object.keys(g.attributes).forEach((k) => { if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k); });
    if (!g.attributes.normal) g.computeVertexNormals();
    g.applyMatrix4(mx.multiplyMatrices(inv, o.matrixWorld));
    if (!porMat.has(o.material)) porMat.set(o.material, { geos: [], sombra: false, ordem: 0 });
    const it = porMat.get(o.material); it.geos.push(g); it.sombra = it.sombra || o.castShadow; it.ordem = Math.max(it.ordem, o.renderOrder);
    sai.push(o);
  });
  sai.forEach((o) => o.parent.remove(o));
  porMat.forEach((it, m) => { const me = new T.Mesh(juntaGeos(it.geos), m); me.castShadow = it.sombra && !m.transparent; me.receiveShadow = true; me.renderOrder = it.ordem; grupo.add(me); });
}

// ===== cena/predio.js =====
// ---------- o prédio da clínica e o jardim ----------
// Térreo comprido com as salas em fila, ligadas por arcos no eixo z = 0 (a enfilade que o drone atravessa).
// Fachada para +z, com uma janela em arco por sala e a porta de vidro na recepção.
const REC = SALA.recepcao;
const PORTA = { cx: REC.cx, w: 1.9, topo: 2.95 };
const ARCO_INT = { w: 1.5, topo: 2.55 };
const janelasFrente = [];
salas.forEach((s) => {
  if (s.id === 'recepcao') {
    [-1, 1].forEach((l) => janelasFrente.push({ cx: s.cx + l * 1.75, w: 0.72, y0: 0.62, topo: 2.7 }));
  } else janelasFrente.push({ cx: s.cx, w: 1.9, y0: 0.6, topo: 2.95 });
});
const uvEscala = (g, sx, sy) => { const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * sx, uv.getY(i) * sy); return g; };
const predio = new T.Group();
cena.add(predio);

// ---------- chão e jardim ----------
{
  const chao = new T.Mesh(new T.CircleGeometry(320, 72), mt.areia);
  chao.rotation.x = -PI / 2; chao.position.y = -0.36; chao.receiveShadow = true; predio.add(chao);
  // gramado claro em volta do prédio
  const rr = (x0, z0, x1, z1, r) => { const s = new T.Shape(); s.moveTo(x0 + r, z0); s.lineTo(x1 - r, z0); s.quadraticCurveTo(x1, z0, x1, z0 + r); s.lineTo(x1, z1 - r); s.quadraticCurveTo(x1, z1, x1 - r, z1); s.lineTo(x0 + r, z1); s.quadraticCurveTo(x0, z1, x0, z1 - r); s.lineTo(x0, z0 + r); s.quadraticCurveTo(x0, z0, x0 + r, z0); return s; };
  const grama = new T.Mesh(new T.ShapeGeometry(rr(X0 - 34, -(Z1 + 40), X1 + 34, -(Z0 - 26), 14), 12), mt.grama);
  grama.rotation.x = -PI / 2; grama.position.y = -0.298; grama.receiveShadow = true; predio.add(grama);
  // caminho de pedra da rua até a porta
  const cam0 = Z1 + E + 1.4, cam1 = Z1 + 26;
  const caminho = new T.Mesh(uvEscala(new T.PlaneGeometry(2, cam1 - cam0), 1, 1), mt.caminho);
  mt.caminho.map.repeat.set(1, (cam1 - cam0) / 2.2);
  caminho.rotation.x = -PI / 2; caminho.position.set(PORTA.cx, -0.282, (cam0 + cam1) / 2); caminho.receiveShadow = true; predio.add(caminho);
  // embasamento, varanda e degrau
  const base = caixa(X1 - X0 + 2 * E + 1, 0.3, Z1 - Z0 + 2 * E + 1, mt.pedraClara, 0.02);
  poe(base, (X0 + X1) / 2, -0.15, (Z0 + Z1) / 2); predio.add(base);
  predio.add(poe(caixa(4.8, 0.3, 1, mt.pedraClara, 0.02), PORTA.cx, -0.15, Z1 + E + 0.95));
  predio.add(poe(caixa(3.4, 0.15, 0.45, mt.pedraClara, 0.02), PORTA.cx, -0.225, Z1 + E + 1.67));
  // cerca viva baixa na frente, aberta na varanda
  const cerca = (a, b, z) => { const m = caixa(b - a, 0.56, 0.56, mt.salviaEsc, 0.22); poe(m, (a + b) / 2, -0.02, z); predio.add(m); };
  cerca(X0 - 0.6, PORTA.cx - 2.55, Z1 + E + 0.82); cerca(PORTA.cx + 2.55, X1 + 0.6, Z1 + E + 0.82);
  // vasos com topiaria dos dois lados da porta
  [-1, 1].forEach((l) => {
    const v = grupo(
      torno([[0, 0], [0.22, 0], [0.27, 0.05], [0.3, 0.5], [0.33, 0.55], [0.31, 0.58], [0, 0.58]], mt.branco, 40),
      poe(cil(0.022, 0.026, 0.5, mt.tronco, 8), 0, 0.8, 0),
      poe(folhagem(0.36, mt.salvia, l + 3), 0, 1.22, 0),
    );
    poe(v, PORTA.cx + l * 1.85, 0, Z1 + E + 0.9); predio.add(v);
  });
  // oliveiras: tronco torcido e copa em tufos prateados
  const oliveira = (x, z, k = 1, sem = 1) => {
    const g = new T.Group();
    g.add(tubo([[0, 0, 0], [0.1 * k, 0.7 * k, 0.04], [-0.06 * k, 1.4 * k, 0.1 * k], [0.08 * k, 2.0 * k, 0]], 0.08 * k, mt.tronco, 24));
    g.add(tubo([[-0.06 * k, 1.4 * k, 0.1 * k], [-0.5 * k, 2.0 * k, 0.2 * k], [-0.75 * k, 2.3 * k, 0.1 * k]], 0.04 * k, mt.tronco, 12));
    for (let i = 0; i < 11; i++) {
      const a = (i / 11) * PI * 2 + sem, rr2 = i ? (0.45 + (i % 3) * 0.22) * k : 0;
      const tufo = folhagem((0.3 + (i % 4) * 0.06) * k, i % 3 ? mt.salvia : mt.oliva, sem + i); tufo.scale.y = 0.62;
      g.add(poe(tufo, Math.cos(a) * rr2 - 0.2 * k, (2.35 + ((i * 37) % 5) * 0.09 - (i % 3) * 0.08) * k, Math.sin(a) * rr2));
    }
    poe(g, x, -0.3, z);
    predio.add(g);
  };
  [[X0 - 7.5, 2.5, 1.15], [-3.5, 12.5, 1.0], [8, 10, 1.1], [X1 + 6, 9, 1.2]].forEach(([x, z, k], i) => oliveira(x, z, k, i * 1.7));
  // ciprestes altos e finos, em fila atrás e nas pontas do prédio
  const cipreste = (x, z, alt = 5, sem = 1) => { const c = folhagem(0.62, sem % 2 ? mt.salviaEsc : mt.cipreste, sem); c.scale.set(0.72, alt / 1.24, 0.72); c.position.set(x, -0.3 + alt / 2 + 0.25, z); predio.add(c); predio.add(poe(cil(0.07, 0.09, 0.5, mt.tronco, 8), x, -0.05, z)); };
  for (let x = X0 - 2; x <= X1 + 2; x += 3.1) cipreste(x, Z0 - 2.6 - (Math.round(x) % 2) * 0.4, 4.6 + ((x * 7) % 3) * 0.5, Math.round(x));
  [[X0 - 2.6, 1.5, 5.4], [X0 - 2.8, -1.5, 4.8], [X1 + 2.6, 1.8, 5.2], [X1 + 2.8, -1.2, 5.8]].forEach(([x, z, a], i) => cipreste(x, z, a, i + 50));
  // bolas de topiaria soltas no gramado
  [[-20, 9, 0.55], [-19, 10.2, 0.4], [10.5, 6.8, 0.5], [11.4, 7.6, 0.36], [22.5, 9.4, 0.5]].forEach(([x, z, r], i) => predio.add(poe(folhagem(r, mt.salviaEsc, i + 9), x, -0.3 + r * 0.8, z)));
  // balizadores de luz no caminho (acendem à noite)
  for (let z = Z1 + 4; z < Z1 + 22; z += 3.2) [-1, 1].forEach((l) => predio.add(grupo(poe(cil(0.05, 0.06, 0.46, mt.branco, 16), PORTA.cx + l * 1.35, -0.07, z), poe(cil(0.052, 0.052, 0.05, mt.globo, 16), PORTA.cx + l * 1.35, 0.185, z))));
  // banco de pedra
  predio.add(poe(grupo(poe(caixa(1.6, 0.08, 0.45, mt.travertino, 0.03), 0, 0.42, 0), poe(caixa(0.16, 0.42, 0.4, mt.travertino, 0.02), -0.6, 0.21, 0), poe(caixa(0.16, 0.42, 0.4, mt.travertino, 0.02), 0.6, 0.21, 0)), PORTA.cx - 2.6, -0.3, Z1 + 9, PI / 2));
  // totem com a camélia na entrada do caminho
  const totem = placaArco(0.8, 2.1, 0.16, mt.rosaPo);
  const flor = camelia(0.46);
  poe(flor, 0, 1.45, 0.17);
  const nome = placaTexto(0.66, 0.34, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.textAlign = 'center'; g.fillStyle = '#4A1624'; g.font = `400 ${h * 0.42}px ${F_T}`; g.fillText('Camélia', w / 2, h * 0.5);
    g.fillStyle = '#8A7149'; g.font = `600 ${h * 0.16}px ${F_C}`; g.letterSpacing = `${h * 0.05}px`; g.fillText('ESTÉTICA', w / 2, h * 0.82);
  }, 256);
  poe(nome, 0, 0.86, 0.165);
  predio.add(poe(grupo(totem, flor, nome), PORTA.cx + 1.75, -0.3, Z1 + 13.5, -0.12));
}

// ---------- pisos de cada sala ----------
const pisoDe = { recepcao: 'pisoGranilite', consultorio: 'pisoCarvalho', corporal: 'pisoCarvalho' };
salas.forEach((s) => {
  const nomeMat = pisoDe[s.id] || 'pisoVinilico';
  const tam = nomeMat === 'pisoGranilite' ? 2.6 : nomeMat === 'pisoCarvalho' ? 1.7 : 1.25;
  const g = uvEscala(new T.PlaneGeometry(s.w, Z1 - Z0), s.w / tam, (Z1 - Z0) / tam);
  const m = new T.Mesh(g, mt[nomeMat]);
  m.rotation.x = -PI / 2; m.position.set(s.cx, 0.002, 0); m.receiveShadow = true;
  predio.add(m);
});
// soleira de granilite embaixo de cada arco
salas.slice(0, -1).forEach((s) => {
  const m = new T.Mesh(uvEscala(new T.PlaneGeometry(E + 0.04, ARCO_INT.w), 0.1, 0.6), mt.pisoGranilite);
  m.rotation.x = -PI / 2; m.position.set(s.x[1], 0.003, 0); m.receiveShadow = true; predio.add(m);
});

// ---------- paredes ----------
const frente = parede(X0 - E, X1 + E, H, [PORTA], janelasFrente, mt.fachada);
frente.position.z = Z1; predio.add(frente);
predio.add(poe(caixa(X1 - X0 + 2 * E, H, E, mt.parede, 0), (X0 + X1) / 2, H / 2, Z0 - E / 2));
[[X0 - E / 2], [X1 + E / 2]].forEach(([x]) => predio.add(poe(caixa(E, H, Z1 - Z0 + 2 * E, mt.parede, 0), x, H / 2, (Z0 + Z1) / 2)));
// contorno de arco em faixa (aberto embaixo), para portas e arcos internos
function faixaArco(w, alt, b, esp, mat) {
  const R = w / 2, yc = alt - R, s = new T.Shape();
  s.moveTo(-R - b, 0); s.lineTo(-R - b, yc); s.absarc(0, yc, R + b, PI, 0, true); s.lineTo(R + b, 0); s.lineTo(R, 0); s.lineTo(R, yc); s.absarc(0, yc, R, 0, PI, false); s.lineTo(-R, 0);
  return malha(new T.ExtrudeGeometry(s, { depth: esp, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 32 }), mat);
}
// paredes internas com o arco no meio, moldura clara dos dois lados
salas.slice(0, -1).forEach((s) => {
  const xw = s.x[1];
  const p = parede(Z0, Z1, H, [{ cx: 0, ...ARCO_INT }], [], mt.parede);
  p.rotation.y = -PI / 2; p.position.x = xw + E / 2; predio.add(p);
  [-1, 1].forEach((l) => {
    const f = faixaArco(ARCO_INT.w, ARCO_INT.topo, 0.09, 0.025, mt.branco);
    f.rotation.y = l > 0 ? PI / 2 : -PI / 2; f.position.set(xw + l * (E / 2), 0, 0); predio.add(f);
  });
});
// rodapé claro no fundo e nas laterais de cada sala
salas.forEach((s) => {
  predio.add(poe(caixa(s.w - E, 0.09, 0.018, mt.branco, 0.004), s.cx, 0.045, Z0 + 0.009));
  [s.x[0] + E / 2 + 0.009, s.x[1] - E / 2 - 0.009].forEach((x, k) => {
    const bordaInterna = (k === 0 && s.i > 0) || (k === 1 && s.i < salas.length - 1);
    const xx = s.i === 0 && k === 0 ? X0 + 0.009 : s.i === salas.length - 1 && k === 1 ? X1 - 0.009 : x;
    const pedacos = bordaInterna ? [[Z0, -ARCO_INT.w / 2 - 0.09], [ARCO_INT.w / 2 + 0.09, Z1]] : [[Z0, Z1]];
    pedacos.forEach(([a, b]) => predio.add(poe(caixa(0.018, 0.09, b - a, mt.branco, 0.004), xx, 0.045, (a + b) / 2)));
  });
});

// ---------- janelas: caixilho dourado, vidro dos dois lados, peitoril e faixa rosa em volta ----------
const vidroFora = reg(new T.MeshPhysicalMaterial({ color: '#FFFFFF', roughness: 0.05, transparent: true, opacity: 0.16, depthWrite: false, envMapIntensity: 1.7, emissive: new T.Color('#FFD2A6'), emissiveIntensity: 0 }));
vidroFora.userData.base = 0; vidroFora.userData.noite = 0.55;
const vidroDentro = reg(new T.MeshPhysicalMaterial({ color: '#FFFFFF', roughness: 0.05, transparent: true, opacity: 0.1, depthWrite: false, envMapIntensity: 1.2 }));
function janela(j, z, alvo = predio, faixa = true) {
  const alt = j.topo - j.y0, R = j.w / 2, yc = j.topo - R;
  const g = new T.Group();
  const mold = molduraArco(j.w, alt, 0.045, 0.05, mt.ouro);
  mold.position.set(0, 0, -0.025); g.add(mold);
  g.add(poe(caixa(0.022, alt - 0.08, 0.03, mt.ouro, 0.006), 0, alt / 2, 0));
  g.add(poe(caixa(j.w - 0.08, 0.022, 0.03, mt.ouro, 0.006), 0, yc - j.y0, 0));
  const vf = telaArco(j.w - 0.08, alt - 0.08, vidroFora); vf.position.set(0, 0.04, 0.004); vf.renderOrder = 3; g.add(vf);
  const vd = telaArco(j.w - 0.08, alt - 0.08, vidroDentro); vd.position.set(0, 0.04, -0.004); vd.rotation.y = PI; vd.position.x = 0; vd.renderOrder = 3; g.add(vd);
  g.add(poe(caixa(j.w + 0.22, 0.05, 0.16, mt.pedraClara, 0.01), 0, -0.025, E / 2 + 0.07));
  g.add(poe(caixa(j.w + 0.1, 0.035, 0.12, mt.branco, 0.008), 0, -0.018, -E / 2 - 0.05));
  if (faixa) { const f = faixaArco(j.w, alt, 0.1, 0.025, mt.rosaPo); f.position.set(0, 0, E / 2); g.add(f); }
  g.position.set(j.cx, j.y0, z);
  alvo.add(g);
  return g;
}
janelasFrente.forEach((j) => janela(j, Z1 + E / 2));

// ---------- porta de vidro em duas folhas (abre quando o drone chega) e bandeira em leque ----------
const folhas = [];
{
  const R = PORTA.w / 2, yc = PORTA.topo - R, zc = Z1 + E / 2;
  const fx = faixaArco(PORTA.w, PORTA.topo, 0.12, 0.03, mt.rosaPo); fx.position.set(PORTA.cx, 0, Z1 + E); predio.add(fx);
  const aro = faixaArco(PORTA.w - 0.02, PORTA.topo - 0.01, 0.04, E + 0.02, mt.ouro); aro.position.set(PORTA.cx, 0, Z1 - 0.01); predio.add(aro);
  // bandeira: meia-lua de vidro com raios dourados
  const meia = new T.Shape(); meia.moveTo(-R, 0); meia.absarc(0, 0, R, PI, 0, true); meia.lineTo(-R, 0);
  const vb = malha(new T.ShapeGeometry(meia, 32), vidroFora, false); vb.position.set(PORTA.cx, yc, zc + 0.004); predio.add(vb);
  const vb2 = malha(new T.ShapeGeometry(meia, 32), vidroDentro, false); vb2.rotation.y = PI; vb2.position.set(PORTA.cx, yc, zc - 0.004); predio.add(vb2);
  predio.add(poe(caixa(PORTA.w - 0.04, 0.035, 0.04, mt.ouro, 0.006), PORTA.cx, yc, zc));
  for (let i = 1; i < 6; i++) { const a = (i / 6) * PI, r = caixa(0.018, R - 0.04, 0.03, mt.ouro, 0.004); r.position.set(PORTA.cx + Math.cos(a) * (R - 0.04) / 2, yc + Math.sin(a) * (R - 0.04) / 2, zc); r.rotation.z = a - PI / 2; predio.add(r); }
  // folhas: dobradiça em cada lateral
  [-1, 1].forEach((l) => {
    const w = R - 0.02, h = yc - 0.02, piv = new T.Group();
    const quadro = new T.Group();
    quadro.add(poe(caixa(0.045, h, 0.045, mt.ouro, 0.008), -l * 0.022, h / 2, 0), poe(caixa(0.045, h, 0.045, mt.ouro, 0.008), -l * (w - 0.022), h / 2, 0));
    quadro.add(poe(caixa(w, 0.06, 0.045, mt.ouro, 0.008), -l * w / 2, 0.03, 0), poe(caixa(w, 0.045, 0.045, mt.ouro, 0.008), -l * w / 2, h - 0.022, 0));
    const v = malha(new T.PlaneGeometry(w - 0.06, h - 0.1), vidroFora, false); v.position.set(-l * w / 2, h / 2, 0.005); quadro.add(v);
    const v2 = malha(new T.PlaneGeometry(w - 0.06, h - 0.1), vidroDentro, false); v2.rotation.y = PI; v2.position.set(-l * w / 2, h / 2, -0.005); quadro.add(v2);
    quadro.add(poe(cil(0.012, 0.012, 0.6, mt.ouro, 10), -l * (w - 0.1), 1.05, 0.05));
    piv.add(quadro); piv.position.set(PORTA.cx + l * R, 0.01, zc);
    piv.userData.lado = l; piv.userData.vivo = true;
    predio.add(piv); folhas.push(piv);
  });
}

// ---------- fachada: barrado rosa, pilastras e beiral ----------
{
  const zf = Z1 + E;
  const bar = (a, b) => predio.add(poe(caixa(b - a, 0.42, 0.05, mt.rosaPo, 0.01), (a + b) / 2, 0.21, zf + 0.025));
  bar(X0 - E, PORTA.cx - PORTA.w / 2 - 0.12); bar(PORTA.cx + PORTA.w / 2 + 0.12, X1 + E);
  [X0 - E + 0.16, ...salas.slice(0, -1).map((s) => s.x[1]), X1 + E - 0.16].forEach((x) => predio.add(poe(caixa(0.32, H - 0.42, 0.06, mt.fachada, 0.01), x, 0.42 + (H - 0.42) / 2, zf + 0.03)));
  // laterais e fundo com o mesmo barrado
  predio.add(poe(caixa(X1 - X0 + 2 * E, 0.42, 0.05, mt.rosaPo, 0.01), (X0 + X1) / 2, 0.21, Z0 - E - 0.025));
  [X0 - E - 0.025, X1 + E + 0.025].forEach((x) => predio.add(poe(caixa(0.05, 0.42, Z1 - Z0 + 2 * E, mt.rosaPo, 0.01), x, 0.21, (Z0 + Z1) / 2)));
}

// ---------- telhado: laje, platibanda, frontão com a marca e o pavimento recuado (sobe e some no final) ----------
const telhado = new T.Group();
predio.add(telhado);
{
  const L = X1 - X0 + 2 * E, zc = (Z0 + Z1) / 2, D = Z1 - Z0 + 2 * E;
  telhado.add(poe(caixa(L + 0.4, 0.28, D + 0.4, mt.fachada, 0.01), (X0 + X1) / 2, H + 0.14, zc));
  telhado.add(poe(caixa(L + 0.42, 0.03, 0.03, mt.ouro, 0.004), (X0 + X1) / 2, H - 0.012, zc + D / 2 + 0.2));
  // platibanda baixa com capa dourada
  const pl = (w, d, x, z) => { telhado.add(poe(caixa(w, 0.46, d, mt.fachada, 0.01), x, H + 0.28 + 0.23, z)); telhado.add(poe(caixa(w + 0.02, 0.025, d + 0.03, mt.ouroFosco, 0.004), x, H + 0.28 + 0.47, z)); };
  pl(L + 0.4, 0.14, (X0 + X1) / 2, zc + D / 2 + 0.13); pl(L + 0.4, 0.14, (X0 + X1) / 2, zc - D / 2 - 0.13);
  pl(0.14, D + 0.12, X0 - E - 0.13, zc); pl(0.14, D + 0.12, X1 + E + 0.13, zc);
  // frontão da entrada
  const fx = PORTA.cx, fz = Z1 + E + 0.2;
  telhado.add(poe(caixa(4.4, 1.12, 0.32, mt.rosaPo, 0.02), fx, H + 0.56, fz));
  telhado.add(poe(caixa(4.44, 0.03, 0.36, mt.ouro, 0.004), fx, H + 1.13, fz));
  const flor = camelia(0.66); flor.position.set(fx - 1.3, H + 0.62, fz + 0.165); telhado.add(flor);
  const nome = placaTexto(2.3, 0.62, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.textBaseline = 'alphabetic';
    g.fillStyle = '#4A1624'; g.font = `400 ${h * 0.6}px ${F_T}`; g.fillText('Camélia', 4, h * 0.62);
    g.fillStyle = '#8A7149'; g.font = `600 ${h * 0.17}px ${F_C}`; g.letterSpacing = `${h * 0.075}px`; g.fillText('ESTÉTICA', 8, h * 0.92);
  }, 512);
  nome.position.set(fx + 0.18, H + 0.6, fz + 0.162); telhado.add(nome);
  // pavimento de cima, recuado, com terraço na frente
  const up = { x0: SALA.avaliacao.x[0], x1: SALA.corporal.x[1], z0: Z0 + 0.1, z1: 0.9, y: H + 0.28, h: 2.7 };
  const wUp = up.x1 - up.x0;
  const janUp = Array.from({ length: 6 }, (_, i) => ({ cx: up.x0 + (wUp / 6) * (i + 0.5), w: 0.92, y0: 0.5, topo: 2.12 }));
  const fr = parede(up.x0, up.x1, up.h, [], janUp, mt.fachada); fr.position.set(0, up.y, up.z1 - E); telhado.add(fr);
  janUp.forEach((j) => {
    janela(j, up.z1 - E / 2, telhado, true).position.y += up.y;
    // cortina de linho atrás do vidro
    telhado.add(poe(caixa(j.w - 0.1, j.topo - j.y0 - 0.2, 0.01, mt.linho, 0), j.cx, up.y + (j.y0 + j.topo) / 2 - 0.05, up.z1 - E - 0.12));
  });
  telhado.add(poe(caixa(wUp, up.h, E, mt.fachada, 0), (up.x0 + up.x1) / 2, up.y + up.h / 2, up.z0 + E / 2));
  [up.x0 + E / 2, up.x1 - E / 2].forEach((x) => telhado.add(poe(caixa(E, up.h, up.z1 - up.z0, mt.fachada, 0), x, up.y + up.h / 2, (up.z0 + up.z1) / 2)));
  telhado.add(poe(caixa(wUp + 0.36, 0.22, up.z1 - up.z0 + 0.36, mt.fachada, 0.01), (up.x0 + up.x1) / 2, up.y + up.h + 0.11, (up.z0 + up.z1) / 2));
  telhado.add(poe(caixa(wUp + 0.38, 0.03, 0.03, mt.ouro, 0.004), (up.x0 + up.x1) / 2, up.y + up.h - 0.01, up.z1 + 0.18));
  telhado.add(poe(caixa(wUp + 0.36, 0.3, 0.12, mt.fachada, 0.01), (up.x0 + up.x1) / 2, up.y + up.h + 0.37, up.z1 + 0.12));
  // deque de madeira e floreiras com oliveiras pequenas no terraço
  telhado.add(poe(caixa(wUp, 0.04, Z1 + E - up.z1 - 0.05, mt.carvalho, 0.005), (up.x0 + up.x1) / 2, up.y + 0.02, (up.z1 + Z1 + E) / 2));
  for (let i = 0; i < 4; i++) {
    const x = up.x0 + 1.4 + i * ((wUp - 2.8) / 3);
    telhado.add(poe(caixa(0.9, 0.42, 0.42, mt.branco, 0.03), x, up.y + 0.25, Z1 - 0.15));
    telhado.add(poe(folhagem(0.32, i % 2 ? mt.salvia : mt.salviaEsc, i + 20), x - 0.15, up.y + 0.68, Z1 - 0.15));
    telhado.add(poe(folhagem(0.24, mt.salvia, i + 30), x + 0.22, up.y + 0.62, Z1 - 0.12));
  }
}
// teto de cada sala (claro, com um pouco de luz própria para não parecer escuro)
salas.forEach((s) => { const t = new T.Mesh(new T.PlaneGeometry(s.w - E, Z1 - Z0), mt.teto); t.rotation.x = PI / 2; t.position.set(s.cx, H - 0.002, 0); telhado.add(t); });
// materiais do telhado separados, para ele poder sumir sem levar as paredes junto
const matsTelhado = new Map();
telhado.traverse((o) => {
  if (!o.isMesh) return;
  if (!matsTelhado.has(o.material)) { const c = o.material.clone(); c.userData = { ...o.material.userData, opac: o.material.opacity, transp: o.material.transparent }; reg(c); matsTelhado.set(o.material, c); }
  o.material = matsTelhado.get(o.material);
});
let telhadoFade = 1;
function opacidadeTelhado(v) {
  if (Math.abs(v - telhadoFade) < 0.002) return;
  telhadoFade = v;
  telhado.visible = v > 0.01;
  telhado.position.y = (1 - v) * 7;
  matsTelhado.forEach((m) => {
    const tr = v < 0.999 || m.userData.transp;
    if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }
    m.opacity = (m.userData.opac ?? 1) * v;
  });
  telhado.traverse((o) => { if (o.isMesh) o.castShadow = v > 0.6; });
}

// ===== cena/salas.js =====
// ---------- móveis e objetos de cada sala ----------
// Cada sala monta em coordenadas locais (x a partir do centro da sala, z e y como no mundo).
const presenca = Object.fromEntries(salas.map((s) => [s.id, 0]));
presenca.fachada = 1; presenca.planta = 0;
const animacoes = [];
const telas = [];
const foco = new T.SpotLight('#FFF4EA', 0, 7, 0.55, 0.65, 1.4);
cena.add(foco, foco.target);
const focos = {};

// setor de anel extrudado para cima (sofá curvo, encosto de poltrona, tampos)
function anelSetor(r0, r1, a0, a1, alt, mat, bev = 0.03, seg = 56) {
  const s = new T.Shape(), p = (r, a) => [Math.cos(a) * r, -Math.sin(a) * r];
  s.moveTo(...p(r1, a0));
  for (let i = 1; i <= seg; i++) s.lineTo(...p(r1, a0 + ((a1 - a0) * i) / seg));
  for (let i = seg; i >= 0; i--) s.lineTo(...p(r0, a0 + ((a1 - a0) * i) / seg));
  const b = Math.min(bev, alt / 2.2);
  const g = new T.ExtrudeGeometry(s, { depth: Math.max(0.001, alt - 2 * b), bevelEnabled: b > 0, bevelThickness: b, bevelSize: b * 0.9, bevelSegments: 3, curveSegments: 4 });
  g.rotateX(-PI / 2); g.translate(0, b, 0);
  return malha(g, mat);
}
// barra (cilindro) deitada no eixo x, de 0 até comp
const barra = (comp, r, mat) => malha(memo(`b${comp},${r}`, () => new T.CylinderGeometry(r, r, comp, 12).rotateZ(PI / 2).translate(comp / 2, 0, 0)), mat);
// tela de aparelho com textura desenhada (brilha um pouco)
function telaAparelho(w, h, desenha, px = 384) {
  const c = tela(px, Math.round((px * h) / w), () => {});
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace;
  const m = new T.Mesh(new T.PlaneGeometry(w, h), reg(new T.MeshStandardMaterial({ map: t, emissive: '#FFFFFF', emissiveMap: t, emissiveIntensity: 0.55, roughness: 0.3 })));
  const item = { m, c, t, desenha, ultimo: -1 };
  item.pinta = (tempo, p) => { desenha(c.getContext('2d'), c.width, c.height, tempo, p); t.needsUpdate = true; };
  item.pinta(0, 0);
  telas.push(item);
  return item;
}
// quadro com moldura fina
function quadro(w, h, mapa, matMoldura = mt.ouro, borda = 0.03, prof = 0.03) {
  const g = new T.Group();
  g.add(poe(caixa(w, borda, prof, matMoldura, 0.005), 0, h / 2 - borda / 2, 0), poe(caixa(w, borda, prof, matMoldura, 0.005), 0, -h / 2 + borda / 2, 0));
  g.add(poe(caixa(borda, h, prof, matMoldura, 0.005), -w / 2 + borda / 2, 0, 0), poe(caixa(borda, h, prof, matMoldura, 0.005), w / 2 - borda / 2, 0, 0));
  const fundo = new T.Mesh(new T.PlaneGeometry(w - borda * 2, h - borda * 2), mapa.isMaterial ? mapa : reg(new T.MeshStandardMaterial({ map: mapa, roughness: 0.75 })));
  fundo.position.z = -prof / 2 + 0.006; g.add(fundo);
  return g;
}
// poltrona concha (encosto curvo que abraça)
function poltrona(mat = mt.boucle) {
  const g = new T.Group();
  g.add(poe(cil(0.3, 0.31, 0.035, mt.ouroFosco, 40), 0, 0.018, 0));
  g.add(torno([[0, 0.035], [0.33, 0.035], [0.36, 0.08], [0.37, 0.34], [0.35, 0.4], [0, 0.4]], mat, 48));
  g.add(torno([[0, 0.39], [0.29, 0.39], [0.32, 0.42], [0.315, 0.47], [0.2, 0.495], [0, 0.5]], mat, 48));
  g.add(poe(anelSetor(0.27, 0.385, PI * 0.82, PI * 2.18, 0.44, mat, 0.05), 0, 0.37, 0));
  g.add(sombraChao(1, 1, 0, 0, 0.4));
  return g;
}
// banqueta com rodízios (profissional)
function banqueta(mat = mt.estofado) {
  const g = new T.Group();
  for (let i = 0; i < 5; i++) { const a = (i / 5) * PI * 2, pe = barra(0.24, 0.016, mt.cromo); pe.position.set(0, 0.06, 0); pe.rotation.y = -a; g.add(pe); g.add(poe(esf(0.024, mt.borracha, 10, 8), Math.cos(a) * 0.24, 0.024, Math.sin(a) * 0.24)); }
  g.add(poe(cil(0.022, 0.022, 0.4, mt.cromo, 12), 0, 0.26, 0));
  g.add(poe(torno([[0, 0], [0.2, 0], [0.215, 0.02], [0.21, 0.07], [0.17, 0.09], [0, 0.095]], mat, 40), 0, 0.46, 0));
  g.add(sombraChao(0.7, 0.7, 0, 0, 0.35));
  return g;
}
// vaso com flores de camélia
function vasoFlores(n = 3, matVaso = mt.ceramicaRosa, alt = 0.16) {
  const g = new T.Group();
  g.add(torno([[0, 0], [0.045, 0], [0.06, alt * 0.35], [0.05, alt * 0.8], [0.03, alt], [0.034, alt + 0.01], [0, alt + 0.01]], matVaso, 32));
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2, d = n > 1 ? 0.06 : 0, topo = [Math.cos(a) * d, alt + 0.12 + i * 0.03, Math.sin(a) * d];
    g.add(tubo([[0, alt, 0], [topo[0] * 0.5, alt + 0.06, topo[2] * 0.5], topo], 0.004, mt.salviaEsc, 8));
    const f = florVaso(0.06, i % 2 ? mt.rosaPo : mt.estofadoClaro); f.position.set(...topo); f.rotation.x = Math.cos(a) * 0.3; g.add(f);
    const fo = esf(0.03, mt.folha, 10, 6); fo.scale.set(1, 0.25, 0.5); fo.position.set(topo[0] * 0.7 + 0.03, alt + 0.07, topo[2] * 0.7); g.add(fo);
  }
  return g;
}
// capim-dos-pampas num vaso alto
function vasoPampas(alt = 0.62) {
  const g = new T.Group();
  g.add(torno([[0, 0], [0.13, 0], [0.19, alt * 0.3], [0.17, alt * 0.75], [0.09, alt * 0.95], [0.1, alt], [0, alt]], mt.ceramica, 40));
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * PI * 2 + 0.3, inc = 0.12 + (i % 3) * 0.07, comp = 0.75 + (i % 4) * 0.12;
    const ponta = [Math.cos(a) * inc * comp, alt + comp, Math.sin(a) * inc * comp];
    g.add(tubo([[0, alt - 0.05, 0], [ponta[0] * 0.4, alt + comp * 0.45, ponta[2] * 0.4], ponta], 0.004, mt.pampa, 10));
    const pl = folhagem(0.09, mt.pampa, i + 40); pl.scale.set(0.55, 2.6, 0.55); pl.position.set(ponta[0] * 1.04, ponta[1] + 0.17, ponta[2] * 1.04); pl.rotation.set(ponta[2] * 1.4, 0, -ponta[0] * 1.4); g.add(pl);
  }
  g.add(sombraChao(0.7, 0.7, 0, 0, 0.4));
  return g;
}
// oliveira num vaso de cerâmica
function plantaVaso(alt = 1.5, sem = 1) {
  const g = new T.Group();
  g.add(torno([[0, 0], [0.18, 0], [0.24, 0.08], [0.26, 0.42], [0.24, 0.46], [0, 0.46]], mt.ceramica, 40));
  g.add(poe(cil(0.22, 0.22, 0.02, mt.terra, 24), 0, 0.44, 0));
  g.add(tubo([[0, 0.4, 0], [0.04, alt * 0.45, 0.02], [-0.03, alt * 0.7, 0.03], [0.02, alt * 0.85, 0]], 0.022, mt.tronco, 16));
  for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2 + sem; g.add(poe(folhagem(0.17 + (i % 3) * 0.04, i % 2 ? mt.salvia : mt.salviaEsc, sem + i), Math.cos(a) * 0.2, alt * (0.82 + (i % 3) * 0.08), Math.sin(a) * 0.2)); }
  g.add(poe(folhagem(0.2, mt.salvia, sem + 9), 0, alt * 1.02, 0));
  g.add(sombraChao(0.9, 0.9, 0, 0, 0.45));
  return g;
}
// frascos de produto
function frasco(r = 0.025, alt = 0.11, mat = mt.branco, tampa = mt.ouro) {
  return grupo(torno([[0, 0], [r, 0], [r * 1.05, alt * 0.1], [r, alt * 0.75], [r * 0.45, alt * 0.88], [r * 0.4, alt * 0.92], [0, alt * 0.92]], mat, 24), poe(cil(r * 0.42, r * 0.42, alt * 0.16, tampa, 16), 0, alt * 0.98, 0));
}
// luminária de lupa sobre rodízios, com braço articulado (resolve o braço para alcançar um ponto)
function lupaLuz() {
  const g = new T.Group();
  for (let i = 0; i < 5; i++) { const a = (i / 5) * PI * 2, pe = barra(0.27, 0.018, mt.branco); pe.position.y = 0.07; pe.rotation.y = -a; g.add(pe); g.add(poe(esf(0.026, mt.borracha, 10, 8), Math.cos(a) * 0.27, 0.026, Math.sin(a) * 0.27)); }
  g.add(poe(cil(0.035, 0.04, 0.08, mt.branco, 16), 0, 0.08, 0));
  g.add(poe(cil(0.015, 0.015, 1.2, mt.cromo, 12), 0, 0.7, 0));
  const ombro = poe(new T.Group(), 0, 1.31, 0); g.add(ombro);
  ombro.add(esf(0.032, mt.branco, 16, 10));
  const L1 = 0.5, L2 = 0.42;
  const b1 = new T.Group(); ombro.add(b1); b1.add(barra(L1, 0.013, mt.branco));
  const b2 = poe(new T.Group(), L1, 0, 0); b1.add(b2); b2.add(esf(0.024, mt.branco, 12, 8)); b2.add(barra(L2, 0.011, mt.branco));
  const cab = poe(new T.Group(), L2, 0, 0); b2.add(cab);
  const anel = new T.Group(); anel.rotation.x = PI / 2; anel.position.y = -0.04; cab.add(anel);
  anel.add(toro(0.13, 0.026, mt.branco, PI * 2, 12, 48));
  const luz = emissivo('#FFF7EE', 0.05, 0.05); luz.userData.fixo = true;
  anel.add(toro(0.112, 0.009, luz, PI * 2, 8, 48));
  anel.add(malha(new T.CylinderGeometry(0.105, 0.105, 0.006, 40).rotateX(PI / 2), mt.vidro, false));
  cab.add(barra(0.05, 0.01, mt.branco));
  g.add(sombraChao(0.8, 0.8, 0, 0, 0.35));
  g.userData.vivo = true;
  const ombroMundo = new T.Vector3();
  // alcança `alvo` (coordenadas do grupo pai da luminária)
  const alcanca = (alvo) => {
    ombroMundo.set(0, 1.31, 0).add(g.position);
    const dx = alvo.x - ombroMundo.x, dz = alvo.z - ombroMundo.z, dy = alvo.y + 0.05 - ombroMundo.y;
    ombro.rotation.y = Math.atan2(-dz, dx) - g.rotation.y;
    const d = Math.min(Math.hypot(dx, dz, dy), L1 + L2 - 0.01), hz = Math.hypot(dx, dz);
    const c2 = T.MathUtils.clamp((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1), a2 = -Math.acos(c2);
    const a1 = Math.atan2(dy, hz) - Math.atan2(L2 * Math.sin(a2), L1 + L2 * Math.cos(a2));
    b1.rotation.z = a1; b2.rotation.z = a2; cab.rotation.z = -(a1 + a2);
  };
  return { g, alcanca, luz, anel };
}
// carrinho auxiliar com bandeja, seringas, frascos e luvas
function carrinho(itens = 'injetavel') {
  const g = new T.Group();
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { g.add(poe(cil(0.011, 0.011, 0.84, mt.ouro, 10), a * 0.25, 0.46, b * 0.17)); g.add(poe(esf(0.028, mt.borracha, 10, 8), a * 0.25, 0.028, b * 0.17)); });
  [0.16, 0.52, 0.87].forEach((y) => g.add(poe(caixa(0.56, 0.022, 0.4, mt.laca, 0.008), 0, y, 0)));
  g.add(poe(caixa(0.56, 0.035, 0.012, mt.laca, 0.004), 0, 0.9, 0.195), poe(caixa(0.56, 0.035, 0.012, mt.laca, 0.004), 0, 0.9, -0.195));
  g.add(poe(caixa(0.3, 0.05, 0.2, mt.toalha, 0.02), 0, 0.555, 0), poe(caixa(0.28, 0.045, 0.19, mt.toalhaRosa, 0.02), 0.02, 0.6, 0));
  const topo = 0.882;
  if (itens === 'injetavel') {
    g.add(poe(caixa(0.3, 0.012, 0.2, mt.inox, 0.006), -0.08, topo + 0.006, 0));
    for (let i = 0; i < 3; i++) { const s = grupo(poe(barra(0.1, 0.007, mt.vidro), 0, 0, 0), poe(barra(0.05, 0.003, mt.cromo), -0.05, 0, 0), poe(barra(0.012, 0.011, mt.branco), 0.098, 0, 0)); poe(s, -0.17, topo + 0.02, -0.06 + i * 0.05); s.rotation.y = 0.1 * i; g.add(s); }
    for (let i = 0; i < 3; i++) g.add(poe(grupo(torno([[0, 0], [0.016, 0], [0.016, 0.045], [0.008, 0.055], [0, 0.055]], mt.liquidoRosa, 16), poe(cil(0.01, 0.01, 0.014, mt.ouro, 12), 0, 0.06, 0)), 0.1 + i * 0.04, topo, -0.12));
    g.add(poe(caixa(0.12, 0.07, 0.22, mt.branco, 0.008), 0.17, topo + 0.035, 0.06));
    const luva = folhagem(0.04, mt.rosaPo, 7); luva.scale.set(1.2, 0.7, 1.6); g.add(poe(luva, 0.17, topo + 0.08, 0.06));
  } else {
    // cílios: paletas de fios, pinças e cola
    for (let i = 0; i < 3; i++) g.add(poe(caixa(0.09, 0.008, 0.06, i % 2 ? mt.branco : mt.rosaPo, 0.004), -0.15 + i * 0.1, topo + 0.004, -0.06));
    for (let i = 0; i < 2; i++) { const p = barra(0.12, 0.003, mt.cromo); p.position.set(-0.05, topo + 0.006, 0.06 + i * 0.03); g.add(p); }
    g.add(poe(frasco(0.014, 0.05, mt.branco, mt.vinhoLaca), 0.17, topo, 0.05));
  }
  g.add(poe(grupo(torno([[0, 0], [0.04, 0], [0.04, 0.09], [0, 0.09]], mt.vidro, 24), poe(esf(0.022, mt.toalha, 10, 8), 0, 0.03, 0), poe(esf(0.02, mt.toalha, 10, 8), 0.012, 0.06, 0.01), poe(cil(0.042, 0.042, 0.01, mt.ouro, 24), 0, 0.095, 0)), -0.18, topo, 0.12));
  g.add(sombraChao(0.9, 0.7, 0, 0, 0.4));
  return g;
}
// maca: corporal (com apoio de rosto) ou de cílios (cabeceira levantada e travesseiro)
function maca(tipo = 'corporal') {
  const g = new T.Group();
  const comp = 1.86, larg = 0.68, alt = 0.7;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => g.add(poe(cil(0.03, 0.022, alt - 0.08, mt.carvalhoLiso, 16), a * (comp / 2 - 0.12), (alt - 0.08) / 2, b * (larg / 2 - 0.08))));
  [-1, 1].forEach((b) => g.add(poe(caixa(comp - 0.3, 0.03, 0.03, mt.carvalhoLiso, 0.01), 0, 0.18, b * (larg / 2 - 0.08))));
  g.add(poe(caixa(comp - 0.04, 0.06, larg - 0.04, mt.laca, 0.02), 0, alt - 0.05, 0));
  const est = tipo === 'cilios' ? mt.estofado : mt.estofadoClaro;
  if (tipo === 'cilios') {
    g.add(poe(caixa(comp - 0.55, 0.11, larg, est, 0.05), -0.27, alt + 0.05, 0));
    const cab = poe(new T.Group(), comp / 2 - 0.55, alt + 0.05, 0); cab.rotation.z = 0.24; g.add(cab);
    cab.add(poe(caixa(0.55, 0.11, larg, est, 0.05), 0.27, 0, 0));
    const trav = malha(new T.CapsuleGeometry(0.06, 0.34, 6, 16).rotateX(PI / 2), mt.toalha); trav.position.set(0.36, 0.1, 0); trav.scale.set(1.5, 0.75, 1); cab.add(trav);
    g.add(poe(caixa(0.5, 0.06, 0.4, mt.toalha, 0.025), -0.55, alt + 0.135, 0));
  } else {
    g.add(poe(caixa(comp, 0.11, larg, est, 0.05), 0, alt + 0.05, 0));
    // apoio de rosto em ferradura
    const fer = malha(new T.TorusGeometry(0.12, 0.045, 10, 40, PI * 1.55), est); fer.rotation.set(-PI / 2, 0, PI * 0.72); fer.position.set(comp / 2 + 0.16, alt + 0.03, 0); g.add(fer);
    g.add(poe(barra(0.16, 0.012, mt.cromo), comp / 2 - 0.02, alt - 0.02, 0.05), poe(barra(0.16, 0.012, mt.cromo), comp / 2 - 0.02, alt - 0.02, -0.05));
    g.add(poe(caixa(0.48, 0.07, 0.36, mt.toalha, 0.03), -0.6, alt + 0.14, 0), poe(caixa(0.44, 0.06, 0.34, mt.toalhaRosa, 0.03), -0.6, alt + 0.2, 0.01));
    const rolo = malha(new T.CapsuleGeometry(0.055, 0.42, 6, 16).rotateX(PI / 2), mt.toalha); rolo.position.set(0.05, alt + 0.16, 0); g.add(rolo);
  }
  g.add(sombraChao(comp + 0.5, larg + 0.5, 0, 0, 0.5));
  return g;
}
// cadeira de procedimentos reclinável: encosto e perneira giram, o assento sobe um pouco
function cadeiraProcedimento() {
  const g = new T.Group();
  const base = cil(0.34, 0.36, 0.05, mt.laca, 48); base.scale.x = 1.45; base.position.y = 0.025; g.add(base);
  const friso = cil(0.355, 0.355, 0.012, mt.ouro, 48); friso.scale.x = 1.45; friso.position.y = 0.055; g.add(friso);
  for (let i = 0; i < 6; i++) g.add(poe(toro(0.09, 0.02, mt.branco, PI * 2, 8, 32), 0, 0.09 + i * 0.05, 0).rotateX(PI / 2));
  g.add(poe(cil(0.075, 0.075, 0.34, mt.branco, 24), 0, 0.24, 0));
  const topo = new T.Group(); g.add(topo);
  topo.add(poe(caixa(0.62, 0.07, 0.48, mt.laca, 0.03), 0, 0.44, 0));
  topo.add(poe(caixa(0.64, 0.13, 0.62, mt.estofado, 0.055), 0, 0.545, 0));
  const encosto = poe(new T.Group(), 0.31, 0.56, 0); topo.add(encosto);
  encosto.add(poe(caixa(0.74, 0.12, 0.6, mt.estofado, 0.055), 0.38, 0.0, 0));
  encosto.add(poe(caixa(0.7, 0.05, 0.48, mt.laca, 0.02), 0.37, -0.075, 0));
  encosto.add(poe(caixa(0.27, 0.1, 0.38, mt.estofado, 0.045), 0.88, 0.01, 0));
  const trav = malha(new T.CapsuleGeometry(0.05, 0.24, 6, 16).rotateX(PI / 2), mt.toalha); trav.position.set(0.86, 0.09, 0); trav.scale.set(1.6, 0.7, 1); encosto.add(trav);
  const perneira = poe(new T.Group(), -0.31, 0.56, 0); topo.add(perneira);
  perneira.add(poe(caixa(0.72, 0.12, 0.58, mt.estofado, 0.055), -0.37, 0, 0));
  perneira.add(poe(caixa(0.68, 0.05, 0.46, mt.laca, 0.02), -0.36, -0.075, 0));
  perneira.add(poe(caixa(0.06, 0.18, 0.5, mt.laca, 0.025), -0.73, -0.05, 0));
  [-1, 1].forEach((l) => {
    topo.add(poe(caixa(0.44, 0.06, 0.1, mt.estofado, 0.03), 0.06, 0.8, l * 0.37));
    topo.add(poe(cil(0.012, 0.012, 0.25, mt.ouro, 10), 0.18, 0.66, l * 0.35), poe(cil(0.012, 0.012, 0.25, mt.ouro, 10), -0.08, 0.66, l * 0.35));
  });
  g.add(sombraChao(2.2, 1.1, 0, 0, 0.5));
  g.userData.vivo = true;
  const poeRecline = (r) => { encosto.rotation.z = T.MathUtils.lerp(1.12, 0.2, r); perneira.rotation.z = T.MathUtils.lerp(0.98, 0.07, r); topo.position.y = 0.06 * r; };
  poeRecline(0);
  return { g, poeRecline };
}
// estante em arco com livros
function estante(w = 1.3, h = 2.4, d = 0.34) {
  const g = new T.Group();
  const fundo = placaArco(w, h, 0.02, mt.rosaLaca); g.add(fundo);
  const lados = new T.Group();
  const R = w / 2, yc = h - R, s = new T.Shape();
  s.moveTo(-R, 0); s.lineTo(-R, yc); s.absarc(0, yc, R, PI, 0, true); s.lineTo(R, 0); s.lineTo(R - 0.04, 0); s.lineTo(R - 0.04, yc); s.absarc(0, yc, R - 0.04, 0, PI, false); s.lineTo(-R + 0.04, 0);
  lados.add(malha(new T.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 32 }), mt.laca)); g.add(lados);
  const cores = [mt.rosaPo, mt.branco, mt.salvia, mt.vinho, mt.carvalhoLiso, mt.estofadoClaro, mt.ouroFosco, mt.cinzaClaro];
  [0.05, 0.55, 1.05, 1.55].forEach((y, k) => {
    g.add(poe(caixa(w - 0.08, 0.03, d - 0.02, mt.laca, 0.006), 0, y, d / 2));
    let x = -w / 2 + 0.08;
    const fim = w / 2 - 0.08 - (k % 2 ? 0.32 : 0.1);
    while (x < fim) {
      const lw = entre(0.022, 0.05), lh = entre(0.2, 0.3);
      const livro = caixa(lw, lh, entre(0.16, 0.22), cores[(rnd() * cores.length) | 0], 0.004);
      livro.position.set(x + lw / 2, y + 0.015 + lh / 2, d / 2 + 0.02);
      if (rnd() > 0.9) { livro.rotation.z = -0.25; livro.position.x += 0.03; x += 0.04; }
      g.add(livro); x += lw + 0.004;
    }
    if (k % 2) g.add(poe(vasoFlores(1, mt.ceramica, 0.12), w / 2 - 0.22, y + 0.015, d / 2));
    else if (k === 2) g.add(poe(esf(0.06, mt.ouro, 24, 16), w / 2 - 0.14, y + 0.075, d / 2));
  });
  return g;
}
// camélia em néon: contorno de cinco lóbulos e miolo, desenhada aos poucos
function neonCamelia(R) {
  const pts = [];
  for (let i = 0; i < 160; i++) { const a = (i / 160) * PI * 2 + PI / 2, r = R * (0.68 + 0.32 * Math.pow(Math.abs(Math.cos(2.5 * (a - PI / 2))), 0.7)); pts.push(new T.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0)); }
  const g = new T.TubeGeometry(new T.CatmullRomCurve3(pts, true, 'centripetal'), 360, 0.011, 8, true);
  const miolo = [];
  for (let i = 0; i <= 80; i++) { const a = (i / 80) * PI * 3.2, r = R * 0.06 + (R * 0.2 * i) / 80; miolo.push(new T.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0)); }
  const g2 = new T.TubeGeometry(new T.CatmullRomCurve3(miolo), 160, 0.009, 8, false);
  const m1 = malha(g, mt.neon, false), m2 = malha(g2, mt.neon, false);
  const n1 = g.index.count, n2 = g2.index.count;
  const desenha = (p) => { g.setDrawRange(0, Math.floor((n1 * T.MathUtils.clamp(p / 0.8, 0, 1)) / 6) * 6); g2.setDrawRange(0, Math.floor((n2 * T.MathUtils.clamp((p - 0.7) / 0.3, 0, 1)) / 6) * 6); };
  desenha(0);
  const gr = grupo(m1, m2); gr.userData.vivo = true;
  return { g: gr, desenha };
}
// tapete com borda dourada fina
function tapete(rx, rz, cor = '#F1E8E0', anel = '#E7CFC6') {
  const c = tela(512, 512, (g, w, h) => {
    g.fillStyle = cor; g.fillRect(0, 0, w, h);
    for (let k = 0; k < 2500; k++) { g.fillStyle = `rgba(255,255,255,${0.04 + rnd() * 0.08})`; g.fillRect(rnd() * w, rnd() * h, 2, 2); }
    g.strokeStyle = '#C9AE7E'; g.lineWidth = 5; g.beginPath(); g.ellipse(w / 2, h / 2, w / 2 - 22, h / 2 - 22, 0, 0, PI * 2); g.stroke();
    g.strokeStyle = anel; g.lineWidth = 26; g.beginPath(); g.ellipse(w / 2, h / 2, w / 2 - 60, h / 2 - 60, 0, 0, PI * 2); g.stroke();
  });
  const m = new T.Mesh(new T.CircleGeometry(1, 72), reg(new T.MeshStandardMaterial({ map: tex(c), roughness: 1, bumpMap: tBoucle, bumpScale: 0.6 })));
  m.rotation.x = -PI / 2; m.scale.set(rx, rz, 1); m.receiveShadow = true;
  return m;
}
const quadroMat = (src) => reg(new T.MeshStandardMaterial({ map: imagem(src), roughness: 0.7 }));
// texto de documento (diploma, registro, avisos)
function papelDesenhado(w, h, desenha, px = 400) {
  const c = tela(px, Math.round((px * h) / w), desenha);
  const m = reg(new T.MeshStandardMaterial({ map: tex(c), roughness: 0.85 }));
  m.userData.redesenha = () => { desenha(c.getContext('2d'), c.width, c.height); m.map.needsUpdate = true; };
  textos.push({ userData: m.userData });
  return m;
}
const L_ = (s) => s.w / 2 - E / 2;

// ================= RECEPÇÃO =================
{
  const s = SALA.recepcao, g = poe(new T.Group(), s.cx, 0, 0); predio.add(g); g.userData.sala = s.id;
  // painel em arco com a camélia atrás do balcão
  g.add(poe(placaArco(2.1, 3.0, 0.04, mt.rosaParede), 0, 0, Z0 + 0.002));
  const flor = camelia(0.62); flor.position.set(0, 2.25, Z0 + 0.05); g.add(flor);
  const nome = placaTexto(1.5, 0.42, (c, w, h) => {
    c.clearRect(0, 0, w, h); c.textAlign = 'center';
    c.fillStyle = '#4A1624'; c.font = `400 ${h * 0.58}px ${F_T}`; c.fillText('Camélia', w / 2, h * 0.6);
    c.fillStyle = '#8A7149'; c.font = `600 ${h * 0.15}px ${F_C}`; c.letterSpacing = `${h * 0.07}px`; c.fillText('ESTÉTICA', w / 2, h * 0.9);
  });
  nome.position.set(0, 1.62, Z0 + 0.046); g.add(nome);
  // balcão curvo canelado com tampo de mármore
  {
    const zc = Z0 + 0.3, R1 = 1.5, R0 = 1.0, a0 = PI * 0.18, a1 = PI * 0.82, n = 420, ripas = 30;
    const sh = new T.Shape(), p = (r, a) => [Math.cos(a) * r, -(zc + Math.sin(a) * r)];
    for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + (a1 - a0) * t, r = R1 + 0.028 * Math.sqrt(Math.abs(Math.sin(t * PI * ripas))); i ? sh.lineTo(...p(r, a)) : sh.moveTo(...p(r, a)); }
    for (let i = 60; i >= 0; i--) sh.lineTo(...p(R0, a0 + ((a1 - a0) * i) / 60));
    const geo = new T.ExtrudeGeometry(sh, { depth: 1.0, bevelEnabled: false, curveSegments: 2 }); geo.rotateX(-PI / 2);
    g.add(malha(geo, mt.rosaLaca));
    const tampo = anelSetor(R0 - 0.03, R1 + 0.07, a0 - 0.03, a1 + 0.03, 0.045, mt.marmore, 0.012); tampo.position.set(0, 1.0, zc); g.add(tampo);
    const mesa = anelSetor(0.62, R0, a0, a1, 0.035, mt.laca, 0.01); mesa.position.set(0, 0.74, zc); g.add(mesa);
    g.add(poe(vasoFlores(3, mt.ceramica, 0.15), -0.78, 1.045, zc + 1.12));
    g.add(poe(caixa(0.2, 0.025, 0.26, mt.vinhoLaca, 0.006), 0.55, 1.058, zc + 1.2).rotateY(-0.35));
    g.add(poe(barra(0.15, 0.004, mt.ouro), 0.5, 1.075, zc + 1.18));
    g.add(sombraChao(3.4, 1.6, 0, zc + 1.0, 0.4));
  }
  // pendentes de globo
  [-0.62, 0, 0.62].forEach((x) => { g.add(poe(esf(0.15, mt.globo, 32, 16), x, 2.5, -1.55)); g.add(poe(cil(0.004, 0.004, H - 2.65, mt.ouro, 6), x, (H + 2.65) / 2, -1.55)); g.add(poe(cil(0.05, 0.05, 0.02, mt.ouro, 20), x, H - 0.01, -1.55)); });
  // sofá curvo de bouclé, mesa de travertino e tapete redondo
  {
    const cx = -1.05, cz = 0.95, R = 1.55, a0 = PI * 0.73, a1 = PI * 1.27;
    const so = new T.Group(); so.position.set(cx, 0, cz); g.add(so);
    so.add(anelSetor(0.82, R, a0, a1, 0.38, mt.boucle, 0.06));
    so.add(anelSetor(1.31, R, a0, a1, 0.8, mt.boucle, 0.08));
    so.add(poe(anelSetor(0.84, 1.33, a0 + 0.03, a1 - 0.03, 0.14, mt.boucle, 0.05), 0, 0.34, 0));
    g.add(poe(torno([[0, 0], [0.17, 0], [0.19, 0.02], [0.14, 0.31], [0.43, 0.32], [0.45, 0.35], [0.43, 0.38], [0, 0.38]], mt.travertino, 56), cx, 0, cz));
    g.add(poe(caixa(0.22, 0.03, 0.28, mt.estofadoClaro, 0.006), cx + 0.08, 0.395, cz - 0.05).rotateY(0.3));
    g.add(poe(caixa(0.18, 0.025, 0.24, mt.vinhoLaca, 0.006), cx + 0.09, 0.42, cz - 0.04).rotateY(0.15));
    g.add(poe(vasoFlores(1, mt.ceramicaRosa, 0.1), cx - 0.2, 0.38, cz + 0.15));
    const tp = tapete(1.45, 1.45); tp.position.set(cx - 0.15, 0.004, cz); g.add(tp);
    g.add(sombraChao(2.4, 3.0, cx - 0.7, cz, 0.35));
  }
  // gravura na parede lateral, console com produtos, pampas e oliveira
  const grav = quadro(1.3, 0.65, quadroMat(D.texturas.gravuraProdutos), mt.ouro, 0.03); grav.rotation.y = PI / 2; grav.position.set(-L_(s) + 0.12, 1.75, 0.95); g.add(grav);
  {
    const con = new T.Group(); con.rotation.y = -PI / 2; con.position.set(L_(s) - 0.22, 0, 1.95); g.add(con);
    con.add(poe(caixa(1.1, 0.04, 0.34, mt.marmore, 0.01), 0, 0.82, 0));
    [-0.48, 0.48].forEach((x) => con.add(poe(caixa(0.05, 0.8, 0.3, mt.ouroFosco, 0.01), x, 0.4, 0)));
    for (let i = 0; i < 6; i++) con.add(poe(frasco(0.022 + (i % 3) * 0.005, 0.1 + (i % 2) * 0.05, [mt.branco, mt.ceramicaRosa, mt.branco][i % 3], i % 2 ? mt.ouro : mt.vinhoLaca), -0.4 + i * 0.15, 0.84, (i % 2) * 0.06 - 0.03));
    con.add(sombraChao(1.4, 0.6, 0, 0, 0.35));
  }
  g.add(poe(vasoPampas(0.62), L_(s) - 0.42, 0, Z0 + 0.45));
  g.add(poe(plantaVaso(1.55, 2), -L_(s) + 0.4, 0, Z1 - 0.42));
}

// ================= CONSULTÓRIO =================
const consult = {};
{
  const s = SALA.consultorio, g = poe(new T.Group(), s.cx, 0, 0); predio.add(g); g.userData.sala = s.id;
  const l = L_(s);
  g.add(poe(caixa(s.w - E, H, 0.02, mt.rosaParede, 0), 0, H / 2, Z0 + 0.011));
  const matMold = std('#F4E3DC', 0.6);
  const moldura = (x, y, w, h) => {
    const z = Z0 + 0.03;
    g.add(poe(caixa(w, 0.025, 0.02, matMold, 0.006), x, y + h / 2, z), poe(caixa(w, 0.025, 0.02, matMold, 0.006), x, y - h / 2, z));
    g.add(poe(caixa(0.025, h, 0.02, matMold, 0.006), x - w / 2, y, z), poe(caixa(0.025, h, 0.02, matMold, 0.006), x + w / 2, y, z));
  };
  [-1, 1].forEach((k) => { moldura(k * 1.9, 2.1, 1.55, 1.6, 0); moldura(k * 1.9, 0.66, 1.55, 0.7); });
  moldura(0, 0.55, 1.2, 0.5);
  // retrato da responsável técnica em moldura de arco dourada, com luz de quadro
  const ret = quadroMat(D.texturas.retrato);
  const ft = telaArco(1.0, 1.4, ret); ft.position.set(0, 1.04, Z0 + 0.034); g.add(ft);
  const mf = molduraArco(1.12, 1.52, 0.06, 0.045, mt.ouro); mf.position.set(0, 0.98, Z0 + 0.022); g.add(mf);
  g.add(poe(barra(0.52, 0.018, mt.ouro), -0.26, 2.66, Z0 + 0.16));
  g.add(poe(caixa(0.46, 0.008, 0.024, mt.globo, 0.002), 0, 2.645, Z0 + 0.16));
  g.add(poe(cil(0.008, 0.008, 0.16, mt.ouro, 8), 0, 2.66, Z0 + 0.08).rotateX(PI / 2));
  focos.consultorio = { p: new T.Vector3(s.cx, 2.62, Z0 + 0.5), a: new T.Vector3(s.cx, 1.65, Z0), int: 9, ang: 0.5 };
  // arandelas dos dois lados
  [-1, 1].forEach((k) => { g.add(poe(cil(0.06, 0.06, 0.015, mt.ouro, 24), k * 0.95, 2.0, Z0 + 0.03).rotateX(PI / 2)); const gl = esf(0.075, mt.globo, 24, 12); gl.scale.z = 0.7; g.add(poe(gl, k * 0.95, 2.0, Z0 + 0.08)); });
  // diplomas e registro no conselho
  const diploma = papelDesenhado(0.5, 0.38, (c, w, h) => {
    c.fillStyle = '#FFFDF9'; c.fillRect(0, 0, w, h); c.strokeStyle = '#C9AE7E'; c.lineWidth = 3; c.strokeRect(12, 12, w - 24, h - 24); c.lineWidth = 1; c.strokeRect(20, 20, w - 40, h - 40);
    c.textAlign = 'center'; c.fillStyle = '#4A1624'; c.font = `400 ${h * 0.12}px ${F_T}`; c.fillText('Diploma', w / 2, h * 0.3);
    c.fillStyle = '#6F6466'; c.font = `500 ${h * 0.055}px ${F_C}`; c.fillText('BACHARELADO EM BIOMEDICINA', w / 2, h * 0.43);
    c.fillStyle = '#2E2326'; c.font = `italic 400 ${h * 0.09}px ${F_T}`; c.fillText(D.responsavel, w / 2, h * 0.6);
    c.strokeStyle = '#B99D70'; c.beginPath(); c.moveTo(w * 0.3, h * 0.78); c.lineTo(w * 0.7, h * 0.78); c.stroke();
    c.fillStyle = '#D9B56E'; c.beginPath(); c.arc(w * 0.82, h * 0.78, h * 0.08, 0, PI * 2); c.fill();
  });
  const registro = papelDesenhado(0.5, 0.38, (c, w, h) => {
    c.fillStyle = '#FFFDF9'; c.fillRect(0, 0, w, h); c.strokeStyle = '#C9AE7E'; c.lineWidth = 3; c.strokeRect(12, 12, w - 24, h - 24);
    c.textAlign = 'center'; c.fillStyle = '#6F6466'; c.font = `500 ${h * 0.05}px ${F_C}`; c.fillText('CONSELHO REGIONAL DE BIOMEDICINA', w / 2, h * 0.24);
    c.fillStyle = '#4A1624'; c.font = `400 ${h * 0.13}px ${F_T}`; c.fillText(D.registro, w / 2, h * 0.47);
    c.fillStyle = '#2E2326'; c.font = `italic 400 ${h * 0.075}px ${F_T}`; c.fillText('Habilitação em estética', w / 2, h * 0.65);
    c.fillStyle = '#8A7149'; c.font = `500 ${h * 0.045}px ${F_C}`; c.fillText('REGISTRO FICTÍCIO DE DEMONSTRAÇÃO', w / 2, h * 0.84);
  });
  g.add(poe(quadro(0.5, 0.38, diploma, mt.ouroFosco, 0.022), 1.9, 2.32, Z0 + 0.035));
  g.add(poe(quadro(0.5, 0.38, registro, mt.ouroFosco, 0.022), 1.9, 1.82, Z0 + 0.035));
  // mesa oval de carvalho, poltronas e objetos
  const mesa = cil(1, 1, 0.05, mt.carvalhoLiso, 72); mesa.scale.set(0.95, 1, 0.46); mesa.position.set(0, 0.735, -1.6); g.add(mesa);
  [-1, 1].forEach((k) => g.add(poe(caixa(0.12, 0.71, 0.56, mt.laca, 0.05), k * 0.6, 0.355, -1.6)));
  g.add(poe(caixa(1.1, 0.42, 0.03, mt.rosaLaca, 0.012), 0, 0.42, -1.4));
  g.add(sombraChao(2.4, 1.3, 0, -1.6, 0.4));
  g.add(poe(poltrona(mt.boucle), 0, 0, -2.38));
  g.add(poe(poltrona(mt.boucleRosa), -0.64, 0, -0.5, PI + 0.22));
  g.add(poe(poltrona(mt.boucleRosa), 0.64, 0, -0.5, PI - 0.22));
  const tp = tapete(1.75, 1.2, '#F4EDE6', '#ECD8D0'); tp.position.set(0, 0.004, -1.25); g.add(tp);
  // notebook aberto virado para a Helena, caderno com o plano, caneta e camélia
  const note = new T.Group(); note.position.set(0.38, 0.76, -1.68); note.rotation.y = 0.25; g.add(note);
  note.add(poe(caixa(0.34, 0.012, 0.23, mt.cinzaClaro, 0.006), 0, 0.006, 0));
  const tampa = poe(new T.Group(), 0, 0.012, -0.115); tampa.rotation.x = -1.85 + PI / 2; note.add(tampa);
  tampa.add(poe(caixa(0.34, 0.008, 0.23, mt.cinzaClaro, 0.005), 0, 0, 0.115));
  const cad = papelDesenhado(0.22, 0.3, (c, w, h) => {
    c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, w, h); c.fillStyle = '#6B2234'; c.font = `italic 400 ${w * 0.1}px ${F_T}`; c.fillText('Plano de cuidado', w * 0.1, h * 0.12);
    c.strokeStyle = 'rgba(185,157,112,.5)'; for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo(w * 0.1, h * (0.2 + i * 0.065)); c.lineTo(w * 0.9, h * (0.2 + i * 0.065)); c.stroke(); }
    c.strokeStyle = 'rgba(46,35,38,.55)'; c.lineWidth = 1.5; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(w * 0.12, h * (0.19 + i * 0.065)); c.bezierCurveTo(w * 0.3, h * (0.17 + i * 0.065), w * 0.5, h * (0.2 + i * 0.065), w * (0.5 + rnd() * 0.35), h * (0.185 + i * 0.065)); c.stroke(); }
  }, 256);
  const caderno = new T.Mesh(new T.PlaneGeometry(0.22, 0.3), cad); caderno.rotation.set(-PI / 2, 0, 0.25); caderno.position.set(-0.18, 0.763, -1.5); g.add(caderno);
  g.add(poe(caixa(0.225, 0.008, 0.305, mt.branco, 0.002), -0.18, 0.759, -1.5).rotateY(0.25));
  g.add(poe(barra(0.14, 0.005, mt.ouro), -0.05, 0.77, -1.42).rotateY(0.6));
  g.add(poe(vasoFlores(1, mt.ceramicaRosa, 0.12), -0.62, 0.76, -1.76));
  g.add(poe(estante(1.3, 2.45, 0.34), -l + 0.02, 0, -2.05, PI / 2));
  g.add(poe(plantaVaso(1.7, 5), l - 0.42, 0, Z1 - 0.45));
  consult.g = g;
}

// ================= SALA DE AVALIAÇÃO =================
const aval = {};
{
  const s = SALA.avaliacao, g = poe(new T.Group(), s.cx, 0, 0); predio.add(g); g.userData.sala = s.id;
  const l = L_(s);
  // aparador canelado com tampo de mármore
  g.add(poe(caixa(2.3, 0.78, 0.46, mt.laca, 0.02), -0.75, 0.39, Z0 + 0.25));
  g.add(poe(canelado(2.28, 0.72, 0.004, 32, mt.rosaLaca), -0.75, 0.035, Z0 + 0.48));
  g.add(poe(caixa(2.36, 0.03, 0.5, mt.marmore, 0.008), -0.75, 0.795, Z0 + 0.26));
  g.add(sombraChao(2.8, 0.9, -0.75, Z0 + 0.4, 0.4));
  // aparelho de análise de pele: cúpula aberta para a frente, anel de luz por dentro
  {
    const ap = new T.Group(); ap.position.set(-1.32, 0.81, Z0 + 0.3); ap.rotation.y = 0.28; g.add(ap);
    ap.add(poe(cil(0.13, 0.15, 0.05, mt.laca, 32), 0, 0.025, 0));
    ap.add(poe(cil(0.035, 0.035, 0.16, mt.cromo, 12), 0, 0.13, 0));
    const cup = new T.Group(); cup.position.set(0, 0.48, 0.06); ap.add(cup);
    const fora = malha(new T.SphereGeometry(0.3, 48, 24, 0, PI * 2, 0, PI / 2).rotateX(-PI / 2), mt.laca); cup.add(fora);
    const dentro = malha(new T.SphereGeometry(0.285, 48, 24, 0, PI * 2, 0, PI / 2).rotateX(-PI / 2), reg(new T.MeshStandardMaterial({ color: '#EFE9E5', roughness: 0.6, side: T.BackSide })), false); cup.add(dentro);
    cup.add(toro(0.293, 0.014, mt.ouro, PI * 2, 10, 64));
    const led = emissivo('#FFF4EC', 0.15, 0.15); led.userData.fixo = true; aval.led = led;
    cup.add(poe(toro(0.24, 0.007, led, PI * 2, 8, 64), 0, 0, -0.06));
    cup.add(poe(toro(0.08, 0.016, mt.branco, PI, 8, 24), 0, -0.2, 0.0).rotateX(PI / 2));
    aval.cupula = cup;
  }
  // monitor com o mapa da pele (anima quando o drone está na sala)
  {
    const mo = new T.Group(); mo.position.set(-0.22, 0.81, Z0 + 0.3); mo.rotation.y = 0.16; g.add(mo);
    mo.add(poe(caixa(0.24, 0.015, 0.16, mt.laca, 0.006), 0, 0.008, 0));
    mo.add(poe(cil(0.016, 0.016, 0.24, mt.cromo, 12), 0, 0.13, -0.02));
    mo.add(poe(caixa(0.64, 0.41, 0.028, mt.laca, 0.012), 0, 0.42, 0));
    const ecra = telaAparelho(0.6, 0.37, (c, w, h, t, p) => {
      c.fillStyle = '#FBF7F5'; c.fillRect(0, 0, w, h);
      const fx = w * 0.32, fy = h * 0.52;
      // mapa de calor suave sobre o rosto
      [['rgba(233,205,196,.75)', 0.34], ['rgba(217,181,110,.35)', 0.26], ['rgba(190,135,144,.35)', 0.17], ['rgba(190,135,144,.5)', 0.09]].forEach(([cor, r], i) => {
        c.fillStyle = cor; c.beginPath(); c.ellipse(fx + Math.sin(t * 0.8 + i) * 4, fy + h * 0.05 * Math.cos(i), w * r * 0.55, h * r * 1.05, 0, 0, PI * 2); c.fill();
      });
      c.strokeStyle = '#6B2234'; c.lineWidth = 1.6; c.beginPath(); c.ellipse(fx, fy, w * 0.14, h * 0.36, 0, 0, PI * 2); c.stroke();
      c.lineWidth = 1; c.beginPath(); c.moveTo(fx - w * 0.06, fy - h * 0.06); c.quadraticCurveTo(fx - w * 0.035, fy - h * 0.09, fx - w * 0.01, fy - h * 0.06); c.moveTo(fx + w * 0.01, fy - h * 0.06); c.quadraticCurveTo(fx + w * 0.035, fy - h * 0.09, fx + w * 0.06, fy - h * 0.06); c.moveTo(fx, fy - h * 0.02); c.lineTo(fx - w * 0.012, fy + h * 0.08); c.lineTo(fx + w * 0.01, fy + h * 0.09); c.moveTo(fx - w * 0.04, fy + h * 0.17); c.quadraticCurveTo(fx, fy + h * 0.2, fx + w * 0.04, fy + h * 0.17); c.stroke();
      // linha de leitura que desce e sobe
      const y = h * (0.15 + 0.72 * (0.5 + 0.5 * Math.sin(t * 1.4)));
      c.strokeStyle = 'rgba(185,157,112,.95)'; c.lineWidth = 2; c.beginPath(); c.moveTo(fx - w * 0.2, y); c.lineTo(fx + w * 0.2, y); c.stroke();
      c.fillStyle = '#4A1624'; c.font = `500 ${h * 0.062}px ${F_C}`; c.fillText('ANÁLISE DA PELE', w * 0.6, h * 0.17);
      [['Hidratação', 0.72], ['Textura', 0.58], ['Manchas', 0.34], ['Oleosidade', 0.46]].forEach(([n, v], i) => {
        const yy = h * (0.3 + i * 0.16), vv = v * Math.min(1, p * 1.4);
        c.fillStyle = '#6F6466'; c.font = `400 ${h * 0.055}px ${F_C}`; c.fillText(n, w * 0.6, yy);
        c.fillStyle = '#ECE2DC'; c.fillRect(w * 0.6, yy + h * 0.03, w * 0.32, h * 0.03);
        c.fillStyle = i % 2 ? '#B99D70' : '#C98B97'; c.fillRect(w * 0.6, yy + h * 0.03, w * 0.32 * vv, h * 0.03);
      });
    });
    ecra.m.position.set(0, 0.42, 0.0155); mo.add(ecra.m); aval.ecra = ecra;
  }
  // espelho em arco
  { const mf = molduraArco(0.92, 1.72, 0.05, 0.035, mt.ouro); mf.position.set(1.45, 0.95, Z0 + 0.012); g.add(mf); const es = telaArco(0.82, 1.62, mt.espelho); es.position.set(1.45, 1.0, Z0 + 0.02); g.add(es); }
  g.add(poe(torno([[0, 0], [0.16, 0], [0.16, 0.012], [0.03, 0.03], [0.03, 0.6], [0.22, 0.61], [0.22, 0.64], [0, 0.64]], mt.ouroFosco, 40), 1.45, 0, Z0 + 0.32));
  g.add(poe(vasoFlores(3, mt.ceramica, 0.14), 1.45, 0.64, Z0 + 0.32));
  // banqueta da cliente diante do aparelho, lupa, poltrona e mesinha com a ficha
  g.add(poe(banqueta(mt.estofadoClaro), -1.3, 0, -1.95));
  aval.lupa = lupaLuz(); aval.lupa.g.position.set(-2.05, 0, -1.55); aval.lupa.g.rotation.y = 0.4; g.add(aval.lupa.g);
  aval.parado = new T.Vector3(-1.85, 1.55, -2.35); aval.ativo = new T.Vector3(-1.42, 1.18, -1.95);
  g.add(poe(poltrona(mt.boucle), 0.95, 0, -1.25, -0.55));
  g.add(poe(torno([[0, 0], [0.14, 0], [0.14, 0.012], [0.025, 0.03], [0.025, 0.54], [0.26, 0.55], [0.27, 0.58], [0, 0.58]], mt.carvalhoLiso, 40), 1.72, 0, -0.62));
  const ficha = papelDesenhado(0.21, 0.29, (c, w, h) => {
    c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, w, h); c.fillStyle = '#4A1624'; c.font = `500 ${w * 0.075}px ${F_C}`; c.fillText('FICHA DE AVALIAÇÃO', w * 0.1, h * 0.1);
    c.strokeStyle = 'rgba(46,35,38,.25)'; for (let i = 0; i < 14; i++) { c.beginPath(); c.moveTo(w * 0.1, h * (0.17 + i * 0.055)); c.lineTo(w * 0.9, h * (0.17 + i * 0.055)); c.stroke(); }
    c.strokeStyle = '#B99D70'; c.lineWidth = 2; for (let i = 0; i < 5; i++) c.strokeRect(w * 0.1, h * (0.2 + i * 0.11), w * 0.05, w * 0.05);
  }, 256);
  const prancheta = new T.Group(); prancheta.position.set(1.7, 0.585, -0.6); prancheta.rotation.y = -0.4; g.add(prancheta);
  prancheta.add(poe(caixa(0.24, 0.008, 0.33, mt.carvalhoLiso, 0.006), 0, 0.004, 0));
  const fl = new T.Mesh(new T.PlaneGeometry(0.21, 0.29), ficha); fl.rotation.x = -PI / 2; fl.position.set(0, 0.0095, 0.01); prancheta.add(fl);
  prancheta.add(poe(caixa(0.08, 0.012, 0.025, mt.ouro, 0.004), 0, 0.012, -0.15));
  g.add(poe(plantaVaso(1.45, 8), l - 0.42, 0, Z1 - 0.45));
}

// ================= SALA DE PROCEDIMENTOS (a cadeira) =================
const proc = {};
{
  const s = SALA.procedimentos, g = poe(new T.Group(), s.cx, 0, 0); predio.add(g); g.userData.sala = s.id;
  const l = L_(s);
  proc.cadeira = cadeiraProcedimento(); proc.cadeira.g.position.set(0.3, 0, -0.95); g.add(proc.cadeira.g);
  proc.lupa = lupaLuz(); proc.lupa.g.position.set(1.62, 0, -1.78); g.add(proc.lupa.g);
  proc.parado = new T.Vector3(1.75, 1.55, -2.42); proc.ativo = new T.Vector3(1.12, 1.25, -0.95);
  g.add(poe(carrinho('injetavel'), 1.78, 0, -0.08, 0.35));
  g.add(poe(banqueta(), -0.55, 0, -1.85));
  // armário com pia, prateleira de carvalho e gravura
  g.add(poe(caixa(3.3, 0.86, 0.55, mt.laca, 0.02), -1.15, 0.43, Z0 + 0.29));
  for (let i = 0; i < 4; i++) { g.add(poe(caixa(0.81, 0.8, 0.008, mt.laca, 0.004), -2.38 + i * 0.825, 0.43, Z0 + 0.57)); g.add(poe(barra(0.22, 0.007, mt.ouro), -2.49 + i * 0.825, 0.72, Z0 + 0.59)); }
  g.add(poe(caixa(3.36, 0.04, 0.6, mt.marmore, 0.008), -1.15, 0.88, Z0 + 0.3));
  g.add(poe(caixa(0.5, 0.012, 0.34, mt.cinzaClaro, 0.05), -2.25, 0.902, Z0 + 0.32));
  g.add(poe(tubo([[0, 0, 0], [0, 0.26, 0], [0, 0.33, 0.07], [0, 0.27, 0.15]], 0.011, mt.ouro, 20), -2.25, 0.9, Z0 + 0.08));
  [[-1.4, 0.13], [-1.25, 0.1], [-1.1, 0.16], [-0.95, 0.11]].forEach(([x, h], i) => g.add(poe(frasco(0.026, h, i % 2 ? mt.ceramicaRosa : mt.branco, mt.ouro), x, 0.9, Z0 + 0.25)));
  g.add(poe(caixa(1.7, 0.04, 0.24, mt.carvalhoLiso, 0.01), -0.95, 1.62, Z0 + 0.13));
  for (let i = 0; i < 5; i++) g.add(poe(grupo(torno([[0, 0], [0.04, 0], [0.042, 0.07], [0.035, 0.08], [0, 0.08]], mt.vidro, 24), poe(cil(0.04, 0.04, 0.015, i % 2 ? mt.ouro : mt.branco, 24), 0, 0.086, 0)), -1.6 + i * 0.3, 1.64, Z0 + 0.13));
  g.add(poe(quadro(0.8, 0.53, quadroMat(D.texturas.gravuraSerum), mt.ouro, 0.025), -0.95, 2.2, Z0 + 0.03));
  g.add(sombraChao(3.8, 1.0, -1.15, Z0 + 0.55, 0.4));
  // geladeira de medicamentos com porta de vidro (toxina fica a 4 graus)
  {
    const gel = new T.Group(); gel.position.set(l - 0.32, 0, Z0 + 0.32); gel.rotation.y = -0.15; g.add(gel);
    gel.add(poe(caixa(0.5, 0.86, 0.5, mt.laca, 0.04), 0, 0.43, 0));
    gel.add(poe(caixa(0.42, 0.012, 0.4, mt.cromo, 0.003), 0, 0.42, 0.02));
    for (let i = 0; i < 4; i++) gel.add(poe(grupo(torno([[0, 0], [0.012, 0], [0.012, 0.04], [0.006, 0.05], [0, 0.05]], mt.liquidoRosa, 12), poe(cil(0.008, 0.008, 0.01, mt.ouro, 10), 0, 0.054, 0)), -0.12 + i * 0.08, 0.43, 0.05));
    const vp = malha(new T.PlaneGeometry(0.42, 0.62), mt.vidro, false); vp.position.set(0, 0.48, 0.252); gel.add(vp);
    gel.add(poe(caixa(0.02, 0.4, 0.03, mt.ouro, 0.006), 0.19, 0.5, 0.26));
    const disp = telaAparelho(0.12, 0.05, (c, w, h) => { c.fillStyle = '#2B2427'; c.fillRect(0, 0, w, h); c.fillStyle = '#F1DDB4'; c.font = `500 ${h * 0.6}px ${F_C}`; c.textAlign = 'center'; c.fillText('4 °C', w / 2, h * 0.72); }, 128);
    disp.m.position.set(0, 0.8, 0.252); gel.add(disp.m);
    gel.add(sombraChao(0.8, 0.8, 0, 0, 0.4));
  }
  // luz de teto redonda sobre a cadeira
  proc.teto = emissivo('#FFF8F0', 0.12, 0.25); proc.teto.userData.fixo = true;
  g.add(poe(cil(0.48, 0.48, 0.02, proc.teto, 48), 0.55, H - 0.012, -0.95));
  g.add(poe(torno([[0.5, 0], [0.52, 0.01], [0.5, 0.03]], mt.ouro, 48), 0.55, H - 0.035, -0.95));
  g.add(poe(plantaVaso(1.5, 11), l - 0.42, 0, Z1 - 0.45));
}

// ================= SALA CORPORAL =================
const corp = {};
{
  const s = SALA.corporal, g = poe(new T.Group(), s.cx, 0, 0); predio.add(g); g.userData.sala = s.id;
  const l = L_(s);
  g.add(poe(maca('corporal'), 0.1, 0, -1.05));
  g.add(poe(banqueta(mt.boucleRosa), -1.05, 0, -0.15));
  // cortina de linho na janela, balança devagar
  {
    g.add(poe(barra(2.7, 0.012, mt.ouro), -1.35, 3.08, Z1 - 0.14));
    const geo = new T.PlaneGeometry(1.05, 2.98, 36, 1);
    const pos = geo.attributes.position, base = Float32Array.from(pos.array);
    const cort = malha(geo, mt.linho, false); cort.position.set(-0.72, 1.57, Z1 - 0.16); cort.userData.vivo = true; g.add(cort);
    animacoes.push((dt, t) => {
      if (Math.abs(camX() - s.cx) > 9) return;
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3], y = base[i * 3 + 1], baixo = (1.49 - y) / 2.98;
        pos.setZ(i, Math.sin(x * 19 + 0.5) * 0.045 + Math.sin(t * 0.9 + x * 4) * 0.025 * baixo);
      }
      pos.needsUpdate = true; geo.computeVertexNormals();
    });
  }
  // console de carvalho com toalhas, velas, pedras e difusor
  {
    const co = new T.Group(); co.position.set(-0.75, 0, Z0 + 0.25); g.add(co);
    co.add(poe(caixa(2.4, 0.06, 0.42, mt.carvalhoLiso, 0.015), 0, 0.5, 0));
    [-1.1, 1.1].forEach((x) => co.add(poe(caixa(0.06, 0.47, 0.38, mt.carvalhoLiso, 0.01), x, 0.235, 0)));
    co.add(poe(caixa(2.2, 0.03, 0.36, mt.carvalhoLiso, 0.01), 0, 0.16, 0));
    // cesto com toalhas enroladas
    co.add(poe(torno([[0, 0], [0.2, 0], [0.22, 0.17], [0.21, 0.18], [0, 0.03]], mt.pampa, 40), -0.8, 0.53, 0));
    for (let i = 0; i < 4; i++) { const r = malha(memo('rolo', () => new T.CapsuleGeometry(0.05, 0.26, 6, 14).rotateX(PI / 2)), i % 2 ? mt.toalhaRosa : mt.toalha); r.position.set(-0.86 + (i % 2) * 0.11, 0.64 + Math.floor(i / 2) * 0.09, -0.02 + (i % 2) * 0.03); r.rotation.y = 0.2; co.add(r); }
    // velas acesas
    [[-0.25, 0.14], [-0.12, 0.2], [0.0, 0.11]].forEach(([x, h], i) => {
      co.add(poe(cil(0.045, 0.045, h, mt.ceramica, 24), x, 0.53 + h / 2, 0.05));
      const ch = malha(memo('chama', () => new T.SphereGeometry(0.012, 10, 8).scale(1, 2.2, 1)), mt.chama, false); ch.position.set(x, 0.53 + h + 0.025, 0.05); ch.userData.vivo = true; co.add(ch);
      animacoes.push((dt, t) => { ch.scale.y = 0.85 + Math.sin(t * 9 + i * 2) * 0.1 + Math.sin(t * 23 + i) * 0.06; });
    });
    // bandeja com pedras quentes
    const bj = cil(0.2, 0.18, 0.025, mt.travertino, 40); bj.scale.z = 0.6; bj.position.set(0.45, 0.545, 0); co.add(bj);
    [[0.36, -0.03], [0.46, 0.03], [0.55, -0.02], [0.42, 0.06], [0.52, 0.07]].forEach(([x, z], i) => { const p = esf(0.04 - (i % 2) * 0.008, mt.cinzaClaro, 20, 12); p.scale.y = 0.45; p.position.set(x, 0.575, z); co.add(p); });
    // difusor de aroma com névoa subindo
    co.add(poe(torno([[0, 0], [0.07, 0], [0.09, 0.06], [0.08, 0.14], [0.03, 0.19], [0.015, 0.2], [0, 0.2]], mt.ceramicaRosa, 40), 0.9, 0.53, 0));
    const N = 26, geo = new T.BufferGeometry(), arr = new Float32Array(N * 3), vida = Array.from({ length: N }, (_, i) => i / N);
    geo.setAttribute('position', new T.BufferAttribute(arr, 3));
    const nev = new T.Points(geo, new T.PointsMaterial({ map: texBrilho, size: 0.09, transparent: true, opacity: 0.35, depthWrite: false, color: '#FFFFFF' }));
    nev.position.set(0.9, 0.74, 0); co.add(nev);
    animacoes.push((dt, t) => {
      if (Math.abs(camX() - s.cx) > 10) return;
      for (let i = 0; i < N; i++) { vida[i] = (vida[i] + dt * 0.22) % 1; const v = vida[i]; arr[i * 3] = Math.sin(v * 7 + i) * 0.05 * v; arr[i * 3 + 1] = v * 0.55; arr[i * 3 + 2] = Math.cos(v * 5 + i * 1.3) * 0.04 * v; }
      geo.attributes.position.needsUpdate = true;
    });
    co.add(sombraChao(2.8, 0.8, 0, 0.05, 0.35));
  }
  // arte abstrata na parede, em moldura de carvalho
  const arte = papelDesenhado(1.1, 0.74, (c, w, h) => {
    c.fillStyle = '#F7EFE9'; c.fillRect(0, 0, w, h);
    [['#EBCFC6', 0.28, 0.55, 0.32], ['#E0C9A4', 0.62, 0.38, 0.26], ['#D7DCC9', 0.78, 0.72, 0.2], ['#C98B97', 0.45, 0.3, 0.08]].forEach(([cor, x, y, r]) => { c.fillStyle = cor; c.beginPath(); c.ellipse(w * x, h * y, w * r, h * r * 1.2, 0.4, 0, PI * 2); c.fill(); });
    c.strokeStyle = '#B99D70'; c.lineWidth = 3; c.beginPath(); c.moveTo(w * 0.1, h * 0.8); c.bezierCurveTo(w * 0.35, h * 0.55, w * 0.6, h * 0.95, w * 0.9, h * 0.6); c.stroke();
  });
  g.add(poe(quadro(1.1, 0.74, arte, mt.carvalhoLiso, 0.035, 0.035), -0.75, 1.72, Z0 + 0.03));
  // aparelho de radiofrequência
  {
    const rf = new T.Group(); rf.position.set(l - 0.48, 0, -2.25); rf.rotation.y = -0.5; g.add(rf);
    rf.add(poe(caixa(0.46, 0.84, 0.44, mt.laca, 0.06), 0, 0.5, 0));
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => rf.add(poe(esf(0.03, mt.borracha, 10, 8), a * 0.18, 0.03, b * 0.17)));
    rf.add(poe(cil(0.02, 0.02, 0.08, mt.cromo, 10), 0, 0.96, 0));
    const ec = telaAparelho(0.36, 0.24, (c, w, h) => {
      c.fillStyle = '#FBF7F5'; c.fillRect(0, 0, w, h); c.fillStyle = '#4A1624'; c.font = `500 ${h * 0.09}px ${F_C}`; c.fillText('RADIOFREQUÊNCIA', w * 0.08, h * 0.18);
      c.fillStyle = '#6B2234'; c.font = `400 ${h * 0.32}px ${F_T}`; c.fillText('40 °C', w * 0.08, h * 0.58);
      c.strokeStyle = '#B99D70'; c.lineWidth = 3; c.beginPath(); for (let i = 0; i <= 40; i++) { const x = w * (0.08 + i * 0.021), y = h * (0.8 - 0.12 * Math.sin(i * 0.4)); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
    });
    const sup = new T.Group(); sup.position.set(0, 1.08, 0.02); sup.rotation.x = -0.35; rf.add(sup);
    sup.add(caixa(0.4, 0.28, 0.03, mt.laca, 0.012)); ec.m.position.z = 0.016; sup.add(ec.m);
    rf.add(poe(cil(0.03, 0.025, 0.1, mt.laca, 16), 0.26, 0.82, 0));
    rf.add(poe(grupo(cil(0.022, 0.018, 0.2, mt.branco, 16), poe(cil(0.024, 0.024, 0.02, mt.ouro, 16), 0, 0.1, 0)), 0.26, 0.92, 0));
    rf.add(tubo([[0.26, 0.84, 0], [0.32, 0.5, 0.08], [0.2, 0.25, 0.22], [0.0, 0.45, 0.24]], 0.007, mt.branco, 30));
    rf.add(sombraChao(0.8, 0.8, 0, 0, 0.4));
  }
  g.add(poe(plantaVaso(1.6, 14), l - 0.42, 0, Z1 - 0.45));
  const tp = tapete(1.4, 0.9, '#F3EBE3', '#EEDCD4'); tp.position.set(0.1, 0.004, -1.05); g.add(tp);
}

// ================= ESTÚDIO DO OLHAR (cílios, sobrancelhas e depilação) =================
const olhar = {};
{
  const s = SALA.olhar, g = poe(new T.Group(), s.cx, 0, 0); predio.add(g); g.userData.sala = s.id;
  const l = L_(s);
  g.add(poe(maca('cilios'), 0.12, 0, -1.1));
  g.add(poe(carrinho('cilios'), 1.95, 0, -0.18, -0.25));
  g.add(poe(banqueta(mt.boucleRosa), 1.22, 0, -0.42));
  // luz de anel no tripé, inclinada para o travesseiro
  {
    const al = new T.Group(); al.position.set(1.62, 0, -1.72); g.add(al);
    [0, 1, 2].forEach((i) => { const a = (i / 3) * PI * 2 + 0.4; al.add(tubo([[0, 0.78, 0], [Math.cos(a) * 0.36, 0, Math.sin(a) * 0.36]], 0.012, mt.cromo, 4)); });
    al.add(poe(cil(0.016, 0.016, 0.82, mt.cromo, 12), 0, 1.18, 0));
    const anel = new T.Group(); anel.position.set(-0.22, 1.5, 0.26); al.add(anel);
    anel.lookAt(new T.Vector3(s.cx + 0.95, 0.75, -1.1));
    anel.add(toro(0.3, 0.03, mt.branco, PI * 2, 12, 72));
    const luz = emissivo('#FFF6EE', 0.08, 0.08); luz.userData.fixo = true; olhar.anel = luz;
    anel.add(poe(toro(0.3, 0.018, luz, PI * 2, 8, 72), 0, 0, 0.022));
    al.add(tubo([[0, 1.58, 0], [-0.12, 1.6, 0.14], [-0.22, 1.5, 0.26]], 0.01, mt.cromo, 8));
    al.add(sombraChao(0.9, 0.9, 0, 0, 0.35));
    focos.olhar = { p: new T.Vector3(s.cx + 1.4, 1.55, -1.45), a: new T.Vector3(s.cx + 0.9, 0.8, -1.1), int: 6, ang: 0.6 };
  }
  // laser de diodo: torre branca com tela inclinada e ponteira no cabo
  {
    const lz = new T.Group(); lz.position.set(-l + 0.5, 0, -2.3); lz.rotation.y = 0.55; g.add(lz);
    lz.add(poe(caixa(0.48, 1.0, 0.55, mt.laca, 0.1), 0, 0.56, 0));
    lz.add(poe(caixa(0.5, 0.06, 0.57, mt.rosaLaca, 0.03), 0, 0.9, 0));
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => lz.add(poe(esf(0.032, mt.borracha, 10, 8), a * 0.18, 0.032, b * 0.2)));
    const ec = telaAparelho(0.36, 0.25, (c, w, h) => {
      c.fillStyle = '#FBF7F5'; c.fillRect(0, 0, w, h); c.fillStyle = '#4A1624'; c.font = `500 ${h * 0.085}px ${F_C}`; c.fillText('LASER DE DIODO', w * 0.08, h * 0.17);
      c.fillStyle = '#6B2234'; c.font = `400 ${h * 0.26}px ${F_T}`; c.fillText('808 nm', w * 0.08, h * 0.52);
      [0.55, 0.8, 0.4].forEach((v, i) => { c.fillStyle = '#ECE2DC'; c.fillRect(w * 0.08, h * (0.64 + i * 0.1), w * 0.8, h * 0.05); c.fillStyle = i % 2 ? '#B99D70' : '#C98B97'; c.fillRect(w * 0.08, h * (0.64 + i * 0.1), w * 0.8 * v, h * 0.05); });
    });
    const sup = new T.Group(); sup.position.set(0, 1.12, 0.12); sup.rotation.x = -0.6; lz.add(sup);
    sup.add(caixa(0.4, 0.28, 0.03, mt.laca, 0.012)); ec.m.position.z = 0.016; sup.add(ec.m);
    lz.add(poe(cil(0.035, 0.03, 0.12, mt.laca, 16), 0.28, 0.85, 0.1));
    lz.add(poe(grupo(cil(0.028, 0.024, 0.24, mt.branco, 16), poe(caixa(0.05, 0.03, 0.05, mt.rosaLaca, 0.01), 0, 0.13, 0)), 0.28, 0.98, 0.1));
    const hel = []; for (let i = 0; i <= 60; i++) { const a = i * 0.55; hel.push([0.26 + Math.cos(a) * 0.035, 0.85 - i * 0.008, 0.18 + Math.sin(a) * 0.035]); }
    hel.push([0.1, 0.42, 0.3], [-0.05, 0.6, 0.29]);
    lz.add(tubo(hel, 0.006, mt.branco, 200));
    lz.add(sombraChao(0.9, 0.9, 0, 0, 0.4));
  }
  // camélia em néon na parede do fundo
  olhar.neon = neonCamelia(0.42); olhar.neon.g.position.set(0.55, 1.95, Z0 + 0.03); g.add(olhar.neon.g);
  g.add(poe(caixa(1.15, 0.004, 0.004, mt.ouro, 0), 0.55, 1.28, Z0 + 0.02));
  // prateleira com paletas, espelho redondo e planta
  g.add(poe(caixa(1.2, 0.04, 0.22, mt.carvalhoLiso, 0.01), -1.25, 1.35, Z0 + 0.12));
  [[-1.65, 0.12], [-1.45, 0.16], [-1.25, 0.1]].forEach(([x, h], i) => g.add(poe(frasco(0.024, h, i % 2 ? mt.ceramicaRosa : mt.branco, mt.ouro), x, 1.37, Z0 + 0.12)));
  g.add(poe(vasoFlores(2, mt.ceramica, 0.13), -0.85, 1.37, Z0 + 0.12));
  g.add(poe(plantaVaso(1.5, 17), l - 0.42, 0, Z1 - 0.45));
  const tp = tapete(1.3, 0.85, '#F4EDE6', '#ECD8D0'); tp.position.set(0.15, 0.004, -1.1); g.add(tp);
}

// junta o que é parado em cada sala (o que anima fica de fora)
predio.children.filter((o) => o.isGroup && o.userData.sala).forEach((g) => funde(g));

// ===== cena/voo.js =====
// ---------- o voo do drone ----------
// Cada parada tem uma pose (posição p e ponto de mira a). Entre duas paradas o drone passa pelos arcos (z = 0).
// A página informa a posição contínua no roteiro (pos: parada atual + fração do voo) e o quanto já leu da parada.
const v3 = (x, y, z) => new T.Vector3(x, y, z);
const noLocal = (id, x, y, z) => v3(SALA[id].cx + x, y, z);
const POSES = {
  fachada: { p: v3(-27.5, 5.4, 15.2), a: v3(-9.5, 1.7, 0), r: { p: v3(-25, 5.6, 19.5), a: v3(-11.8, 2.6, 1.5) } },
  consultorio: { p: noLocal('consultorio', -1.95, 1.62, 2.3), a: noLocal('consultorio', 0.25, 1.38, -2.45), r: { p: noLocal('consultorio', -1.2, 1.7, 2.65), a: noLocal('consultorio', 0.1, 1.35, -2.4) } },
  avaliacao: { p: noLocal('avaliacao', -1.85, 1.62, 2.15), a: noLocal('avaliacao', -0.35, 1.08, -2.3), r: { p: noLocal('avaliacao', -1.0, 1.7, 2.65), a: noLocal('avaliacao', -0.6, 1.1, -2.2) } },
  procedimentos: { p: noLocal('procedimentos', -2.15, 1.78, 2.4), a: noLocal('procedimentos', 0.5, 0.8, -1.0), r: { p: noLocal('procedimentos', -1.3, 1.85, 2.7), a: noLocal('procedimentos', 0.55, 0.85, -1.0) } },
  corporal: { p: noLocal('corporal', -2.15, 1.72, 2.3), a: noLocal('corporal', 0.25, 0.72, -1.2), r: { p: noLocal('corporal', -1.2, 1.8, 2.65), a: noLocal('corporal', 0.2, 0.75, -1.2) } },
  olhar: { p: noLocal('olhar', -2.15, 1.7, 2.3), a: noLocal('olhar', 0.35, 1.12, -1.6), r: { p: noLocal('olhar', -1.2, 1.78, 2.65), a: noLocal('olhar', 0.4, 1.1, -1.6) } },
  planta: { p: v3(-0.3, 43, 34), a: v3(-0.3, 0, -0.6), r: { p: v3(23.5, 30, 10), a: v3(0.5, 0, 0) } },
};
let retrato = false;
const pose = (id) => { const q = POSES[id]; return retrato && q.r ? q.r : q; };
const arcos = (k, i0, i1) => {
  for (let i = i0; i < i1; i++) {
    const xw = salas[i].x[1];
    k.push({ p: v3(xw - 0.85, 1.47, 0), a: v3(xw + 3, 1.42, 0) }, { p: v3(xw + 0.85, 1.47, 0), a: v3(xw + 4.5, 1.38, 0) });
  }
};
function pontosVoo(de, para) {
  const k = [pose(de)];
  if (de === 'fachada') {
    k.push({ p: v3(PORTA.cx - 5, 3.9, 13.5), a: v3(PORTA.cx, 1.7, Z1) });
    k.push({ p: v3(PORTA.cx - 0.3, 1.8, Z1 + 3.8), a: v3(PORTA.cx, 1.55, 0) });
    k.push({ p: v3(PORTA.cx, 1.62, Z1 - 0.7), a: v3(PORTA.cx + 0.2, 1.4, Z0) });
    if (para === 'planta') { k.push({ p: v3(PORTA.cx, 5, 2), a: v3(0, 0, 0) }); }
    else { k.push({ p: v3(PORTA.cx + 1.25, 1.52, 0.5), a: v3(REC.x[1] + 2.5, 1.45, 0) }); arcos(k, REC.i, SALA[para].i); }
  } else if (para === 'planta') {
    const s = SALA[de];
    k.push({ p: v3(s.cx - 0.3, 2.35, 0.8), a: v3(s.cx - 0.8, 0.5, -1.2) });
    k.push({ p: v3(s.cx - 2.5, 7, 6), a: v3(s.cx - 7, 0.4, -0.6) });
    k.push({ p: v3(9, 16, 15), a: v3(2.5, 0, -0.6) });
  } else {
    const s = SALA[de];
    k.push({ p: v3(s.x[1] - 1.75, 1.52, 0.4), a: v3(s.x[1] + 2.5, 1.45, 0) });
    arcos(k, s.i, SALA[para].i);
  }
  k.push(pose(para));
  return k;
}
let roteiro = ['fachada', ...salas.filter((s) => s.id !== 'recepcao').map((s) => s.id), 'planta'];
let trechos = [];
function montaTrechos() {
  trechos = [];
  for (let i = 0; i < roteiro.length - 1; i++) {
    const k = pontosVoo(roteiro[i], roteiro[i + 1]);
    const cp = new T.CatmullRomCurve3(k.map((q) => q.p.clone()), false, 'centripetal');
    const ca = new T.CatmullRomCurve3(k.map((q) => q.a.clone()), false, 'centripetal');
    cp.arcLengthDivisions = 300;
    trechos.push({ cp, ca });
  }
}

// ---------- estado ----------
let alvoPos = 0, pos = 0, leitura = 0, leituraS = 0, noite = opc.escuro ? 1 : 0, alvoNoite = noite, rolagem = 0, ativo = true, ultimo = performance.now(), tempo = 0;
const calmo = !!opc.calmo;
const camPos = new T.Vector3(), camAlvo = new T.Vector3(), dirTmp = new T.Vector3(), ant = new T.Vector3(1, 0, 0);
function camX() { return cam.position.x; }
const suave = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const ease = (f) => 0.5 - 0.5 * Math.cos(PI * T.MathUtils.clamp(f, 0, 1));
const dentro = (p) => p.x > X0 - 0.1 && p.x < X1 + 0.1 && p.z > Z0 - 0.1 && p.z < Z1 + 0.15 && p.y < H;
const lerpC = (a, b, t) => new T.Color(a).lerp(new T.Color(b), t);
const DIA = { hemi: 0.24, sol: 3.8, exp: 1.22 }, NOITE = { hemi: 0.1, sol: 0.45, exp: 1.05 };
const luzBase = { recepcao: ['#FFE3C8', 11], consultorio: ['#FFE2CC', 11], avaliacao: ['#FFF1E6', 10], procedimentos: ['#FFF4EC', 10], corporal: ['#FFD7B5', 8.5], olhar: ['#FFEDE6', 9.5] };

function poeCamera(dt) {
  const n = roteiro.length;
  const seg = Math.min(Math.floor(pos), n - 2), f = T.MathUtils.clamp(pos - seg, 0, 1);
  const tr = trechos[Math.max(0, seg)];
  const e = ease(f);
  const t = tr.cp.getUtoTmapping(e);
  tr.cp.getPoint(t, camPos); tr.ca.getPoint(t, camAlvo);
  // aproximação lenta enquanto a pessoa lê, desfeita no começo do voo seguinte
  const empurra = (seg === 0 ? 0.9 : 0.32) * (f > 0.001 ? (1 - suave(f / 0.35)) * leituraS : leituraS);
  if (pos >= n - 1) { tr.cp.getPoint(1, camPos); tr.ca.getPoint(1, camAlvo); }
  dirTmp.subVectors(camAlvo, camPos).normalize();
  camPos.addScaledVector(dirTmp, empurra);
  // drone pairando: leve deriva e, na fachada, uma volta curta em torno da clínica
  if (!calmo) {
    const amp = roteiro[Math.round(pos)] === 'fachada' || roteiro[Math.round(pos)] === 'planta' ? 2.4 : 1;
    camPos.x += Math.sin(tempo * 0.71) * 0.022 * amp; camPos.y += Math.sin(tempo * 1.13) * 0.03 * amp; camPos.z += Math.cos(tempo * 0.53) * 0.022 * amp;
    if (pos < 0.6) { const giro = Math.sin(tempo * 0.12) * 0.07 * (1 - pos / 0.6); const dx = camPos.x - camAlvo.x, dz = camPos.z - camAlvo.z; camPos.x = camAlvo.x + dx * Math.cos(giro) - dz * Math.sin(giro); camPos.z = camAlvo.z + dx * Math.sin(giro) + dz * Math.cos(giro); }
  }
  cam.position.copy(camPos);
  cam.lookAt(camAlvo);
  // inclina um pouco nas curvas, como drone
  if (!calmo && dt > 0) {
    const giroY = Math.atan2(dirTmp.x, dirTmp.z) - Math.atan2(ant.x, ant.z);
    const g2 = Math.atan2(Math.sin(giroY), Math.cos(giroY));
    rolagem += (T.MathUtils.clamp(-g2 / dt * 0.05, -0.07, 0.07) - rolagem) * (1 - Math.exp(-dt * 4));
    cam.rotateZ(rolagem);
  }
  ant.copy(dirTmp);
  // sombra: perto e nítida dentro da clínica, larga do lado de fora
  if (dentro(camPos)) { const s = salas.reduce((b, x) => (Math.abs(x.cx - camPos.x) < Math.abs(b.cx - camPos.x) ? x : b)); poeSol(v3(s.cx, 0, 0.3), 8.5); }
  else poeSol(v3(T.MathUtils.clamp(camAlvo.x, X0, X1), 0, 0), roteiro[Math.round(pos)] === 'planta' || camPos.y > 10 ? 25 : 24);
  // luzes que acompanham o drone (as duas salas mais próximas)
  const xr = dentro(camPos) ? camPos.x : T.MathUtils.clamp(camAlvo.x, X0, X1);
  const pesos = salas.map((s) => [s, Math.max(0, 1 - Math.abs(xr - s.cx) / 4.5)]).sort((a, b) => b[1] - a[1]);
  luzSala.forEach((l, i) => {
    const [s, w] = pesos[i];
    const [cor, int] = luzBase[s.id];
    l.position.set(s.cx, H - 0.55, -0.4); l.color.set(cor);
    l.intensity = int * w * T.MathUtils.lerp(1, 2.3, noite) * (dentro(camPos) ? 1 : 0.7);
  });
}

// ---------- presença em cada sala e o que acontece nela ----------
const foraAlvo = new T.Vector3(), cabMundo = new T.Vector3();
let ultimaTela = 0;
function atualizaSalas(dt) {
  const k = 1 - Math.exp(-dt * 1.9);
  roteiro.forEach((id, i) => { const alvo = T.MathUtils.clamp(1 - Math.abs(pos - i) * 2.6, 0, 1); const antes = presenca[id]; presenca[id] += ((calmo ? Math.round(alvo) : alvo) - presenca[id]) * (calmo ? 1 : k); if (Math.abs(presenca[id] - antes) > 2e-4 && id !== 'fachada') renderer.shadowMap.needsUpdate = true; });
  const pr = (id) => presenca[id] || 0;
  const noiteE = (m) => T.MathUtils.lerp(m.userData.base ?? 0, m.userData.noite ?? m.userData.base ?? 0, noite);
  // porta de vidro abre quando o drone chega perto
  const dPorta = Math.hypot(cam.position.x - PORTA.cx, cam.position.z - Z1);
  const ab = 1 - suave((dPorta - 2.2) / 4.5);
  folhas.forEach((f) => { f.userData.ab = (f.userData.ab || 0) + (ab - (f.userData.ab || 0)) * (calmo ? 1 : 1 - Math.exp(-dt * 3)); const r0 = f.rotation.y; f.rotation.y = -f.userData.lado * f.userData.ab * 1.35; if (Math.abs(r0 - f.rotation.y) > 1e-4) renderer.shadowMap.needsUpdate = true; });
  // avaliação: a lupa desce sobre a banqueta, o anel acende e o mapa da pele corre
  const pa = suave(pr('avaliacao'));
  foraAlvo.lerpVectors(aval.parado, aval.ativo, pa); aval.lupa.alcanca(foraAlvo);
  aval.lupa.luz.emissiveIntensity = 0.05 + 2.4 * pa; aval.led.emissiveIntensity = 0.15 + 1.6 * pa;
  // procedimentos: a cadeira reclina, a perneira sobe e a lupa vem para cima do rosto
  const pp = suave(pr('procedimentos'));
  proc.cadeira.poeRecline(pp);
  foraAlvo.lerpVectors(proc.parado, proc.ativo, suave((pp - 0.25) / 0.75)); proc.lupa.alcanca(foraAlvo);
  proc.lupa.luz.emissiveIntensity = 0.05 + 2.6 * suave((pp - 0.5) / 0.5);
  proc.teto.emissiveIntensity = noiteE(proc.teto) + 1.3 * pp;
  // olhar: o néon se desenha e a luz de anel acende
  const po = pr('olhar');
  olhar.neon.desenha(Math.max(po, noite * 0.999));
  mt.neon.emissiveIntensity = 1.15 * Math.max(po, noite);
  olhar.anel.emissiveIntensity = 0.08 + 2.6 * suave((po - 0.3) / 0.7);
  // telas animadas (no máximo 15 quadros por segundo)
  if (tempo - ultimaTela > 1 / 15) {
    ultimaTela = tempo;
    if (pa > 0.02) aval.ecra.pinta(tempo, pa);
  }
  // luz de destaque: quadro do consultório, lupa da cadeira ou luz de anel
  const cands = [['consultorio', pr('consultorio')], ['procedimentos', pp], ['olhar', po]].sort((a, b) => b[1] - a[1]);
  const [qual, forca] = cands[0];
  if (qual === 'procedimentos') {
    proc.lupa.anel.getWorldPosition(cabMundo);
    foco.position.copy(cabMundo); foco.target.position.set(SALA.procedimentos.cx + 1.1, 0.9, -0.95); foco.angle = 0.42; foco.distance = 2.6; foco.intensity = 7 * suave((forca - 0.5) / 0.5);
  } else {
    const f = focos[qual]; foco.position.copy(f.p); foco.target.position.copy(f.a); foco.angle = f.ang; foco.distance = 6; foco.intensity = f.int * forca;
  }
  // telhado: sobe e some na vista de cima
  const ip = roteiro.indexOf('planta');
  const rt = ip > 0 ? T.MathUtils.clamp((pos - (ip - 1)) / 0.5, 0, 1) : 0;
  const tAntes = telhadoFade; opacidadeTelhado(1 - suave(rt)); if (tAntes !== telhadoFade) renderer.shadowMap.needsUpdate = true;
}

// ---------- tema: dia e noite (o sol vira lua, as janelas acendem por fora) ----------
let noiteAplicada = -1;
function aplicaNoite() {
  if (Math.abs(noite - noiteAplicada) < 0.001) return;
  noiteAplicada = noite;
  hemi.intensity = T.MathUtils.lerp(DIA.hemi, NOITE.hemi, noite);
  hemi.color.copy(lerpC('#FFF6EE', '#8087AA', noite)); hemi.groundColor.copy(lerpC('#E9D7CD', '#3A2B33', noite));
  sol.intensity = T.MathUtils.lerp(DIA.sol, NOITE.sol, noite); sol.color.copy(lerpC('#FFF0DF', '#B4C3EA', noite));
  renderer.toneMappingExposure = T.MathUtils.lerp(DIA.exp, NOITE.exp, noite);
  cena.fog.color.copy(lerpC('#F4EDE8', '#1C1519', noite));
  todosMats.forEach((m) => {
    if ('envMapIntensity' in m) m.envMapIntensity = (m.userData.env ?? 1) * T.MathUtils.lerp(1, 0.3, noite);
    if (m.userData.noite !== undefined && !m.userData.fixo) m.emissiveIntensity = T.MathUtils.lerp(m.userData.base ?? 0, m.userData.noite, noite);
  });
}

// ---------- tamanho e enquadramento (a mira fica do lado oposto ao texto) ----------
function ajusta() {
  const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
  renderer.setSize(w, h, false);
  const r = w / h < 1.05;
  if (r) { const fh = h * 1.24; cam.fov = 58; cam.aspect = w / fh; cam.setViewOffset(w, fh, 0, fh - h, w, h); }
  else { const fw = w * 1.26; cam.fov = 44; cam.aspect = fw / h; cam.setViewOffset(fw, h, 0, 0, w, h); }
  cam.updateProjectionMatrix();
  if (r !== retrato || !trechos.length) { retrato = r; montaTrechos(); }
}

// ---------- laço ----------
let pedido = 0, primeiro = null;
function quadroLoop(agora) {
  pedido = requestAnimationFrame(quadroLoop);
  const dt = Math.min(0.05, (agora - ultimo) / 1000); ultimo = agora;
  if (!ativo || document.hidden) return;
  tempo += dt;
  const k = calmo ? 1 : 1 - Math.exp(-dt * 4.2);
  pos += (alvoPos - pos) * k; if (Math.abs(alvoPos - pos) < 1e-4) pos = alvoPos;
  leituraS += (leitura - leituraS) * (calmo ? 1 : 1 - Math.exp(-dt * 3));
  noite += (alvoNoite - noite) * (calmo ? 1 : 1 - Math.exp(-dt * 2.6)); if (Math.abs(alvoNoite - noite) < 0.002) noite = alvoNoite;
  aplicaNoite();
  poeCamera(dt);
  if (primeiro) renderer.shadowMap.needsUpdate = true;
  atualizaSalas(dt);
  animacoes.forEach((f) => f(dt, tempo));
  renderer.render(cena, cam);
  if (primeiro) { const f = primeiro; primeiro = null; f(); }
}
funde(predio, new Set([telhado, ...predio.children.filter((o) => o.userData.sala)]));
funde(telhado);
ajusta();
aplicaNoite();
poeCamera(0);
atualizaSalas(0.016);

const api = {
  salas, roteiro: () => roteiro.slice(),
  // ids das paradas ativas, na ordem da página
  paradas(ids) { roteiro = ids.filter((id) => POSES[id]); montaTrechos(); },
  // movimento reduzido: a câmera corta de uma sala para outra, sem voar
  definir(p, l = 0) { alvoPos = T.MathUtils.clamp(p, 0, roteiro.length - 1); leitura = calmo ? 0 : T.MathUtils.clamp(l, 0, 1); if (calmo) alvoPos = Math.round(alvoPos); },
  pular(p) { api.definir(p); pos = alvoPos; },
  tema(escuro) { alvoNoite = escuro ? 1 : 0; },
  ajusta, ativo(v) { ativo = v; },
  redesenha() { textos.forEach((o) => o.userData.redesenha && o.userData.redesenha()); telas.forEach((t) => t.pinta(tempo, 1)); },
  projeta(x, y, z) { const v = v3(x, y, z).project(cam); return { x: (v.x * 0.5 + 0.5) * canvas.clientWidth, y: (-v.y * 0.5 + 0.5) * canvas.clientHeight, atras: v.z > 1 }; },
  camera() { return { x: cam.position.x, z: cam.position.z, y: cam.position.y, pos }; },
  telhado: () => telhadoFade,
  // só para testes: avança o tempo sem desenhar
  simula(seg) { for (let i = 0; i < seg * 30; i++) { tempo += 1 / 30; pos += (alvoPos - pos) * 0.15; leituraS += (leitura - leituraS) * 0.1; poeCamera(1 / 30); atualizaSalas(1 / 30); animacoes.forEach((f) => f(1 / 30, tempo)); } },
  aoPrimeiroQuadro(f) { primeiro = f; },
  info() { const r = renderer.info.render; return { chamadas: r.calls, triangulos: r.triangles, geometrias: renderer.info.memory.geometries, texturas: renderer.info.memory.textures }; },
  comecar() { renderer.compile(cena, cam); ultimo = performance.now(); pedido = requestAnimationFrame(quadroLoop); },
  parar() { cancelAnimationFrame(pedido); },
};
return api;

}};
