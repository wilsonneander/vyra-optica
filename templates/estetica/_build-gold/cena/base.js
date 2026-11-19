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
// azulejo branco da esterilização
const cvAzulejo = tela(256, 256, (g, w, h) => {
  g.fillStyle = '#E6E1DD'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) { const t = 246 + rnd() * 6; g.fillStyle = `rgb(${t},${t - 2},${t - 4})`; g.fillRect(i * 64 + 2, j * 32 + 2, 60, 28); }
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
mt.azulejo = std('#FFFFFF', 0.25, { map: tex(cvAzulejo, 1, 1) });
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
