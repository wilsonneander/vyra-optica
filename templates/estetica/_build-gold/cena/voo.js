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
  esterilizacao: { p: noLocal('esterilizacao', -1.15, 1.72, 1.95), a: noLocal('esterilizacao', 0.5, 1.02, -2.3), r: { p: noLocal('esterilizacao', -0.6, 1.8, 2.6), a: noLocal('esterilizacao', 0.3, 1.0, -2.2) } },
  planta: { p: v3(1.5, 46, 36), a: v3(1.5, 0, -0.6), r: { p: v3(27, 31, 10), a: v3(3.5, 0, 0) } },
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
const luzBase = { recepcao: ['#FFE3C8', 11], consultorio: ['#FFE2CC', 11], avaliacao: ['#FFF1E6', 10], procedimentos: ['#FFF4EC', 10], corporal: ['#FFD7B5', 8.5], olhar: ['#FFEDE6', 9.5], esterilizacao: ['#F4F6FA', 11] };

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
let cicloAutoclave = 0, ultimaTela = 0;
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
  // esterilização: a autoclave faz um ciclo enquanto o drone está lá
  const pe = pr('esterilizacao');
  cicloAutoclave = pe > 0.5 ? Math.min(1, cicloAutoclave + dt / 4.5) : pe < 0.1 ? 0 : cicloAutoclave;
  // telas animadas (no máximo 15 quadros por segundo)
  if (tempo - ultimaTela > 1 / 15) {
    ultimaTela = tempo;
    if (pa > 0.02) aval.ecra.pinta(tempo, pa);
    if (pe > 0.02) ester.disp.pinta(tempo, cicloAutoclave);
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
