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

// ================= CENTRAL DE ESTERILIZAÇÃO =================
const ester = {};
{
  const s = SALA.esterilizacao, g = poe(new T.Group(), s.cx, 0, 0); predio.add(g); g.userData.sala = s.id;
  const l = s.w / 2;
  const fundoX = -s.w / 2 + E / 2;
  // azulejo atrás das bancadas
  const az = (w, h) => { const m = mt.azulejo.clone(); m.map = mt.azulejo.map.clone(); m.map.repeat.set(w / 0.45, h / 0.45); m.map.needsUpdate = true; return reg(m); };
  g.add(poe(new T.Mesh(new T.PlaneGeometry(s.w - E, 1.4), az(s.w - E, 1.4)), 0, 1.6, Z0 + 0.004));
  const azL = new T.Mesh(new T.PlaneGeometry(2.8, 1.4), az(2.8, 1.4)); azL.rotation.y = -PI / 2; azL.position.set(l - 0.004, 1.6, -1.6); g.add(azL);
  // bancada em L de inox sobre armários brancos
  g.add(poe(caixa(s.w - E - 0.02, 0.86, 0.55, mt.laca, 0.02), (fundoX + l) / 2 - 0.01, 0.43, Z0 + 0.28));
  g.add(poe(caixa(s.w - E + 0.02, 0.035, 0.6, mt.inox, 0.005), (fundoX + l) / 2, 0.878, Z0 + 0.3));
  g.add(poe(caixa(0.55, 0.86, 2.3, mt.laca, 0.02), l - 0.28, 0.43, Z0 + 0.6 + 1.15));
  g.add(poe(caixa(0.6, 0.035, 2.3, mt.inox, 0.005), l - 0.3, 0.878, Z0 + 0.6 + 1.15));
  for (let i = 0; i < 4; i++) g.add(poe(barra(0.2, 0.006, mt.cromo), (fundoX + 0.25) + i * 0.82, 0.74, Z0 + 0.57));
  // cuba e torneira alta
  g.add(poe(caixa(0.4, 0.012, 0.42, mt.cinzaClaro, 0.06), l - 0.3, 0.9, -0.95));
  g.add(poe(tubo([[0, 0, 0], [0, 0.34, 0], [-0.03, 0.42, 0], [-0.13, 0.38, 0]], 0.011, mt.cromo, 20), l - 0.08, 0.895, -0.95));
  // autoclave com porta redonda e mostrador
  {
    const au = new T.Group(); au.position.set(0.55, 0.896, Z0 + 0.32); g.add(au);
    au.add(poe(caixa(0.64, 0.46, 0.5, mt.laca, 0.05), 0, 0.24, 0));
    au.add(poe(malha(new T.CylinderGeometry(0.16, 0.16, 0.04, 48).rotateX(PI / 2), mt.inox), -0.08, 0.24, 0.26));
    au.add(poe(malha(new T.TorusGeometry(0.165, 0.016, 10, 48), mt.ouro), -0.08, 0.24, 0.28));
    au.add(poe(malha(new T.CylinderGeometry(0.11, 0.11, 0.01, 40).rotateX(PI / 2), mt.vidro, false), -0.08, 0.24, 0.285));
    au.add(poe(caixa(0.05, 0.025, 0.04, mt.cromo, 0.008), 0.08, 0.24, 0.29));
    const disp = telaAparelho(0.14, 0.18, (c, w, h, t, p) => {
      c.fillStyle = '#2B2427'; c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(241,221,180,.25)'; c.lineWidth = 6; c.beginPath(); c.arc(w / 2, h * 0.42, w * 0.32, 0, PI * 2); c.stroke();
      c.strokeStyle = '#D9B56E'; c.beginPath(); c.arc(w / 2, h * 0.42, w * 0.32, -PI / 2, -PI / 2 + PI * 2 * Math.max(0.02, p)); c.stroke();
      c.fillStyle = '#F1DDB4'; c.textAlign = 'center'; c.font = `500 ${h * 0.16}px ${F_C}`; c.fillText(`${Math.round(20 + 114 * p)}°`, w / 2, h * 0.48);
      c.font = `500 ${h * 0.08}px ${F_C}`; c.fillText(p > 0.98 ? 'ESTÉRIL' : 'CICLO', w / 2, h * 0.88);
    }, 128);
    disp.m.position.set(0.21, 0.26, 0.252); au.add(disp.m); ester.disp = disp;
    au.add(sombraChao(0.9, 0.7, 0, 0, 0.35));
  }
  // lavadora ultrassônica e seladora
  g.add(poe(grupo(caixa(0.36, 0.2, 0.26, mt.inox, 0.02), poe(caixa(0.37, 0.025, 0.27, mt.laca, 0.01), 0, 0.11, 0), poe(caixa(0.12, 0.03, 0.02, mt.tela, 0.005), 0, 0.03, 0.135)), -0.35, 0.996, Z0 + 0.32));
  g.add(poe(grupo(caixa(0.44, 0.1, 0.22, mt.laca, 0.02), poe(barra(0.4, 0.012, mt.rosaLaca), -0.2, 0.06, 0.07)), -1.08, 0.946, Z0 + 0.32));
  // armário de vidro com envelopes esterilizados
  {
    const ar = new T.Group(); ar.position.set(-0.3, 1.95, Z0 + 0.18); g.add(ar);
    ar.add(caixa(2.0, 0.66, 0.34, mt.laca, 0.02));
    ar.add(poe(caixa(1.94, 0.02, 0.3, mt.laca, 0.004), 0, 0, 0.0));
    for (let i = 0; i < 16; i++) { const k = i % 8, fila = Math.floor(i / 8); const e2 = caixa(0.16, 0.012 + (k % 3) * 0.004, 0.24, k % 3 ? mt.branco : mt.toalhaRosa, 0.004); e2.position.set(-0.8 + k * 0.22, -0.28 + fila * 0.32 + 0.012 * (k % 2), 0.02); ar.add(e2); for (let j = 1; j < 3; j++) { const e3 = e2.clone(); e3.position.y += j * 0.02; ar.add(e3); } }
    [-0.49, 0.49].forEach((x) => { const v = malha(new T.PlaneGeometry(0.96, 0.62), mt.vidro, false); v.position.set(x, 0, 0.172); ar.add(v); ar.add(poe(caixa(0.012, 0.16, 0.02, mt.ouro, 0.004), x + (x < 0 ? 0.44 : -0.44), -0.15, 0.185)); });
  }
  // aviso da área e registro de ciclos
  const aviso = papelDesenhado(0.8, 0.16, (c, w, h) => { c.fillStyle = '#F3E1DA'; c.fillRect(0, 0, w, h); c.fillStyle = '#4A1624'; c.textAlign = 'center'; c.font = `500 ${h * 0.34}px ${F_C}`; c.letterSpacing = `${h * 0.04}px`; c.fillText('ÁREA DE ESTERILIZAÇÃO', w / 2, h * 0.62); });
  g.add(poe(new T.Mesh(new T.PlaneGeometry(0.8, 0.16), aviso), -0.3, 2.55, Z0 + 0.012));
  const ciclos = papelDesenhado(0.24, 0.32, (c, w, h) => {
    c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, w, h); c.fillStyle = '#4A1624'; c.font = `500 ${w * 0.07}px ${F_C}`; c.fillText('REGISTRO DE CICLOS', w * 0.08, h * 0.1);
    c.strokeStyle = 'rgba(46,35,38,.3)'; for (let i = 0; i < 10; i++) { c.beginPath(); c.moveTo(w * 0.08, h * (0.18 + i * 0.075)); c.lineTo(w * 0.92, h * (0.18 + i * 0.075)); c.stroke(); }
    c.strokeStyle = '#6B2234'; c.lineWidth = 2; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(w * 0.75, h * (0.16 + i * 0.075)); c.lineTo(w * 0.79, h * (0.175 + i * 0.075)); c.lineTo(w * 0.86, h * (0.14 + i * 0.075)); c.stroke(); }
  }, 256);
  const pr = new T.Group(); pr.position.set(l - 0.02, 1.55, -2.15); pr.rotation.y = -PI / 2; g.add(pr);
  pr.add(caixa(0.27, 0.36, 0.008, mt.carvalhoLiso, 0.004)); const fl = new T.Mesh(new T.PlaneGeometry(0.24, 0.32), ciclos); fl.position.z = 0.006; pr.add(fl);
  // cestos com material embalado
  for (let i = 0; i < 2; i++) { const ce = grupo(caixa(0.36, 0.12, 0.26, mt.cromo, 0.01)); for (let j = 0; j < 4; j++) ce.add(poe(caixa(0.08, 0.1, 0.22, j % 2 ? mt.toalhaRosa : mt.branco, 0.004), -0.12 + j * 0.08, 0.08, 0)); poe(ce, l - 0.3, 0.96, -1.55 - i * 0.42); g.add(ce); }
  g.add(sombraChao(3.6, 1.0, 0, Z0 + 0.5, 0.35));
}

// junta o que é parado em cada sala (o que anima fica de fora)
predio.children.filter((o) => o.isGroup && o.userData.sala).forEach((g) => funde(g));
