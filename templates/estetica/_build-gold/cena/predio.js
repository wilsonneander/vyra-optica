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
  } else if (s.w < 4) janelasFrente.push({ cx: s.cx, w: 1.05, y0: 1.15, topo: 2.8 });
  else janelasFrente.push({ cx: s.cx, w: 1.9, y0: 0.6, topo: 2.95 });
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
