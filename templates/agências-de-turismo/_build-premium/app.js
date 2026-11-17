// Peakalika Turismo, modelo Premium. Interações sem bibliotecas.
// Motor de scroll: cada [data-pin] (seção presa) e [data-p] (elemento que atravessa a tela) recebe --p de 0 a 1.
(() => {
  const D = /*DADOS*/;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const root = document.documentElement;
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toque = matchMedia('(hover: none), (pointer: coarse)').matches;
  const economia = navigator.connection && navigator.connection.saveData;
  const largo = () => innerWidth > 960;
  if (calmo) root.classList.add('calmo');
  const waLink = (msg) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`;

  // ---------- grupos com a mesma largura (regra do projeto) ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    g.style.removeProperty('--larg');
    const filhos = [...g.children];
    filhos.forEach((f) => { f.style.width = 'auto'; });
    const maior = Math.max(...filhos.map((f) => f.getBoundingClientRect().width));
    filhos.forEach((f) => { f.style.width = ''; });
    g.style.setProperty('--larg', `${Math.ceil(maior)}px`);
  });

  // ---------- textos que entram palavra por palavra ----------
  $$('[data-split]').forEach((el) => {
    let i = 0;
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w"><span style="--i:${i++}">${w}</span></span>`).join(' ');
  });

  // ---------- aparecer ao entrar na tela ----------
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('visivel'); io.unobserve(e.target); }
  }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
  $$('[data-split], [data-anima], .final h2, .carimbo').forEach((el) => io.observe(el));

  // ---------- vídeos: tocam só quando aparecem ----------
  const toca = (v) => { if (economia) return; const p = v.play(); if (p) p.catch(() => {}); };
  const ioVideo = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; toca(v); } else v.pause();
  }), { threshold: .15 });
  $$('video[data-auto]').forEach((v) => ioVideo.observe(v));

  // ---------- preloader ----------
  const pre = $('[data-pre]');
  const num = $('[data-pre-num]');
  const inicio = performance.now();
  let pct = 0;
  const contaPre = () => {
    const alvo = Math.min(100, (performance.now() - inicio) / 22);
    pct = Math.max(pct, alvo);
    num.textContent = Math.round(pct);
    pre.style.setProperty('--pct', (pct / 100).toFixed(3));
    if (pct < 100) requestAnimationFrame(contaPre);
  };
  contaPre();
  const primeiro = $('[data-capa-video]');
  const prontos = Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((ok) => { if (primeiro.readyState >= 2) ok(); else { primeiro.addEventListener('loadeddata', ok, { once: true }); setTimeout(ok, 3200); } }),
    new Promise((ok) => setTimeout(ok, calmo ? 200 : 1600)),
  ]);
  prontos.then(() => {
    pct = 100; num.textContent = '100'; pre.style.setProperty('--pct', 1);
    pre.classList.add('sai');
    document.body.classList.remove('carregando');
    setTimeout(() => { root.classList.add('pronto'); document.body.classList.add('pronto'); }, 250);
    setTimeout(() => pre.remove(), 1500);
    iguala();
    toca(primeiro);
  });

  // ---------- capa: troca de cenas ----------
  const capaVideos = $$('[data-capa-video]');
  const capaBts = $$('[data-capa-ir]');
  let cena = 0, cenaTimer;
  const irCena = (n) => {
    capaVideos[cena].classList.remove('ativo'); capaBts[cena].classList.remove('ativo');
    const antigo = capaVideos[cena];
    cena = (n + capaVideos.length) % capaVideos.length;
    const v = capaVideos[cena];
    if (v.preload === 'none') v.preload = 'auto';
    v.currentTime = 0; toca(v);
    v.classList.add('ativo');
    void capaBts[cena].offsetWidth; capaBts[cena].classList.add('ativo');
    setTimeout(() => antigo.pause(), 1500);
    clearTimeout(cenaTimer); cenaTimer = setTimeout(() => irCena(cena + 1), 7000);
  };
  capaBts.forEach((b) => b.addEventListener('click', () => irCena(+b.dataset.capaIr)));
  if (!calmo) cenaTimer = setTimeout(() => irCena(1), 9000);

  // ---------- topo, menu e progresso ----------
  const topo = $('[data-topo]');
  const barra = $('[data-progresso]');
  const menu = $('[data-menu]'), menuBt = $('[data-menu-bt]');
  const abreMenu = (abrir) => {
    menu.hidden = !abrir; menuBt.setAttribute('aria-expanded', abrir);
    menuBt.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = abrir ? 'hidden' : '';
  };
  menuBt.addEventListener('click', () => abreMenu(menu.hidden));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => abreMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) abreMenu(false); });
  const navLinks = $$('.nav a');
  const secoes = navLinks.map((a) => $(a.getAttribute('href')));
  let ultimoY = 0;

  // ---------- motor de scroll ----------
  const pins = $$('[data-pin]');
  const vistas = $$('[data-p]');
  const progressoPin = (el) => {
    const r = el.getBoundingClientRect();
    const total = r.height - innerHeight;
    return total > 0 ? clamp(-r.top / total) : (r.top < 0 ? 1 : 0);
  };
  const progressoVista = (el) => {
    const r = el.getBoundingClientRect();
    return clamp((innerHeight - r.top) / (innerHeight + r.height));
  };
  const visivelNaTela = (el) => { const r = el.getBoundingClientRect(); return r.bottom > -200 && r.top < innerHeight + 200; };

  const cache = new Map();
  const quadro = () => {
    const y = scrollY;
    // topo some ao descer e volta ao subir
    topo.classList.toggle('solido', y > 40);
    topo.classList.toggle('some', y > 500 && y > ultimoY && menu.hidden);
    ultimoY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    barra.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    // link ativo no menu
    let ativo = -1;
    secoes.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .45) ativo = i; });
    navLinks.forEach((a, i) => a.classList.toggle('ativo', i === ativo));

    if (calmo) return;
    for (const el of pins) {
      if (!visivelNaTela(el)) continue;
      const p = progressoPin(el);
      if (cache.get(el) !== p) { cache.set(el, p); el.style.setProperty('--p', p.toFixed(4)); el.dispatchEvent(new CustomEvent('progresso', { detail: p })); }
    }
    for (const el of vistas) {
      if (!visivelNaTela(el)) continue;
      const p = progressoVista(el);
      if (cache.get(el) !== p) { cache.set(el, p); el.style.setProperty('--p', p.toFixed(4)); el.dispatchEvent(new CustomEvent('progresso', { detail: p })); }
    }
  };
  let pedido = false;
  const agenda = () => { if (!pedido) { pedido = true; requestAnimationFrame(() => { pedido = false; quadro(); }); } };
  addEventListener('scroll', agenda, { passive: true });
  addEventListener('resize', () => { iguala(); agenda(); });
  addEventListener('load', agenda);
  if (document.fonts) document.fonts.ready.then(iguala);

  // capa: a cena só troca enquanto a capa está à vista
  $('.capa').addEventListener('progresso', (e) => {
    const v = capaVideos[cena];
    if (e.detail > .98) v.pause(); else if (v.paused && root.classList.contains('pronto')) toca(v);
  });

  // ---------- inclinação 3D nos cartões ----------
  if (!toque && !calmo) {
    $$('[data-tilt]').forEach((c) => {
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--ry', `${(x - .5) * 14}deg`);
        c.style.setProperty('--rx', `${(.5 - y) * 12}deg`);
        c.style.setProperty('--mx', `${x * 100}%`);
        c.style.setProperty('--my', `${y * 100}%`);
      });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--ry', '0deg'); c.style.setProperty('--rx', '0deg'); });
    });
    const busca = $('[data-tilt-leve]');
    busca.addEventListener('pointermove', (e) => {
      const r = busca.getBoundingClientRect();
      busca.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - .5) * 3}deg`);
      busca.style.setProperty('--rx', `${(.5 - (e.clientY - r.top) / r.height) * 3}deg`);
    });
    busca.addEventListener('pointerleave', () => { busca.style.setProperty('--ry', '0deg'); busca.style.setProperty('--rx', '0deg'); });

    // botões magnéticos
    $$('[data-ima]').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  // ---------- poeira mágica (rastro do cursor) e fogos de artifício ----------
  const tela = $('[data-poeira]');
  const ctx = tela.getContext('2d');
  const dpr = Math.min(2, devicePixelRatio || 1);
  let parts = [];
  const ajustaTela = () => { tela.width = innerWidth * dpr; tela.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  ajustaTela(); addEventListener('resize', ajustaTela);
  const CORES_FOGO = [['#FF674A', '#FFB38F'], ['#E8C987', '#FFF4D6'], ['#FFFFFF', '#CFE3FF'], ['#FF8B19', '#FFD9A0']];
  const fogos = (x, y, escala = 1) => {
    if (calmo) return;
    const [c1, c2] = CORES_FOGO[(Math.random() * CORES_FOGO.length) | 0];
    const n = 70 + ((Math.random() * 40) | 0);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * .1, vel = (2.2 + Math.random() * 2.6) * escala;
      parts.push({ x, y, vx: Math.cos(a) * vel, vy: Math.sin(a) * vel, v: 1, dec: .011 + Math.random() * .01, r: 1.1 + Math.random() * 1.2, c: Math.random() > .4 ? c1 : c2, g: .045, atrito: .975, rastro: true });
    }
  };
  window.peakFogos = fogos;
  let animando = false;
  const anima = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalCompositeOperation = 'lighter';
    parts = parts.filter((p) => p.v > 0);
    for (const p of parts) {
      if (p.atrito) { p.vx *= p.atrito; p.vy *= p.atrito; }
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.v -= p.dec;
      ctx.globalAlpha = Math.max(0, p.v);
      ctx.fillStyle = p.c;
      if (p.rastro) { ctx.strokeStyle = p.c; ctx.lineWidth = p.r; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (parts.length) requestAnimationFrame(anima); else { animando = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  };
  const liga = () => { if (!animando) { animando = true; requestAnimationFrame(anima); } };
  const soltaFogos = (x, y, n = 3) => {
    for (let i = 0; i < n; i++) setTimeout(() => { fogos(x + (Math.random() - .5) * 260, y + (Math.random() - .5) * 140, .8 + Math.random() * .5); liga(); }, i * 260);
  };

  // cursor próprio com rótulo
  const cursor = $('[data-cursor-el]');
  if (!toque && !calmo) {
    root.classList.add('tem-cursor');
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; });
    const segue = () => {
      cx = lerp(cx, tx, .2); cy = lerp(cy, ty, .2);
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(segue);
    };
    segue();
    const rotulo = cursor.firstElementChild;
    document.addEventListener('pointerover', (e) => {
      const alvo = e.target.closest('[data-cursor], a, button, label, input, select');
      cursor.classList.toggle('com-texto', !!(alvo && alvo.dataset.cursor));
      cursor.classList.toggle('em-link', !!(alvo && !alvo.dataset.cursor));
      rotulo.textContent = alvo && alvo.dataset.cursor ? alvo.dataset.cursor : '';
    });
  }

  // fogos ao passar nos botões dourados
  $$('[data-fogos-hover]').forEach((b) => {
    let ultimo = 0;
    b.addEventListener('pointerenter', () => {
      if (performance.now() - ultimo < 1200) return;
      ultimo = performance.now();
      const r = b.getBoundingClientRect();
      soltaFogos(r.left + r.width / 2, r.top - 60, 2);
    });
  });

  // ---------- transição 3D: montanha-russa em primeira pessoa ----------
  // O trilho é uma curva 3D (x e altura variam com a distância z). A câmera anda sobre ele com o scroll,
  // olha para a frente, inclina nas curvas e projeta trilhos, dormentes e suportes em perspectiva.
  // No fim do percurso o nome da próxima seção vem em direção à tela e passa pelo usuário.
  $$('[data-trem]').forEach((sec) => {
    const cv = $('[data-trem-tela]', sec);
    const c = cv.getContext('2d');
    const nome = sec.dataset.nome, apoio = sec.dataset.apoio;
    let sem = +sec.dataset.semente;
    const rnd = () => (sem = (sem * 9301 + 49297) % 233280) / 233280;
    const AX = [9 + rnd() * 8, 3 + rnd() * 4], FX = [.018 + rnd() * .012, .05 + rnd() * .03], PX = [rnd() * 6, rnd() * 6];
    const AY = [7 + rnd() * 4, 2 + rnd() * 2], FY = [.035 + rnd() * .02, .09 + rnd() * .04];
    const COMP = 230, VISTA = 110, BITOLA = .8;
    const meio = (z) => ({ x: AX[0] * Math.sin(z * FX[0] + PX[0]) + AX[1] * Math.sin(z * FX[1] + PX[1]), y: 10 + AY[0] * Math.sin(z * FY[0]) + AY[1] * Math.sin(z * FY[1] + 1) * Math.min(1, z / 30), z });
    const luzes = Array.from({ length: 220 }, () => ({ a: (rnd() - .5) * 3.4, e: rnd() * .025, r: rnd() * 1.4 + .4, ouro: rnd() > .7 }));
    const estrelas = Array.from({ length: 140 }, () => ({ a: (rnd() - .5) * 4, e: .05 + rnd() * .6, r: rnd() * 1.1 + .3 }));
    let W = 0, H = 0, alvoP = 0, p = 0, ativo = false, rodando = false;
    const tamanho = () => { const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; };
    const desenha = () => {
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const fov = Math.max(W, H) * .62;
      const zc = p * COMP;
      const base = meio(zc), frente = meio(zc + 7);
      const cam = { x: base.x, y: base.y + 1.7, z: zc };
      const fx = frente.x - cam.x, fy = frente.y + 1.2 - cam.y, fz = frente.z - cam.z;
      const yaw = Math.atan2(fx, fz), pitch = Math.atan2(fy, Math.hypot(fx, fz));
      const curva = meio(zc + 10).x - 2 * meio(zc + 5).x + base.x;
      const roll = clamp(-curva * .06, -.35, .35);
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const proj = (P) => {
        const dx = P.x - cam.x, dy = P.y - cam.y, dz = P.z - cam.z;
        const x1 = dx * cy - dz * sy, z1 = dx * sy + dz * cy;
        const y2 = dy * cp - z1 * sp, z2 = dy * sp + z1 * cp;
        if (z2 < .25) return null;
        return { x: W / 2 + x1 * fov / z2, y: H / 2 - y2 * fov / z2, z: z2 };
      };
      // céu e chão (com o horizonte acompanhando a inclinação da câmera)
      c.save();
      c.translate(W / 2, H / 2); c.rotate(roll); c.translate(-W / 2, -H / 2);
      const hz = H / 2 + Math.tan(pitch) * fov;
      const ceu = c.createLinearGradient(0, hz - H, 0, hz);
      ceu.addColorStop(0, '#050B16'); ceu.addColorStop(.75, '#0D1A30'); ceu.addColorStop(1, '#1D2E4C');
      c.fillStyle = ceu; c.fillRect(-W, hz - H * 2, W * 3, H * 2);
      const chao = c.createLinearGradient(0, hz, 0, hz + H);
      chao.addColorStop(0, '#0B1526'); chao.addColorStop(1, '#03070E');
      c.fillStyle = chao; c.fillRect(-W, hz, W * 3, H * 2);
      for (const e of estrelas) { const x = W / 2 + Math.tan(e.a - yaw * .35) * fov * .6; c.globalAlpha = .55; c.fillStyle = '#F6F0E6'; c.fillRect(x, hz - e.e * H, e.r, e.r); }
      for (const l of luzes) { const x = W / 2 + Math.tan(clamp(l.a - yaw, -1.4, 1.4)) * fov; c.globalAlpha = .7; c.fillStyle = l.ouro ? '#E8C987' : '#F6F0E6'; c.beginPath(); c.arc(x, hz - l.e * fov * .3, l.r, 0, 6.283); c.fill(); }
      c.globalAlpha = 1;
      // trilho, do mais longe para o mais perto
      const passo = .55;
      let ant = null;
      for (let z = Math.min(zc + VISTA, COMP + 40); z > zc + .4; z -= passo) {
        const m = meio(z), m2 = meio(z + .4);
        let tx = m2.x - m.x, tz = m2.z - m.z; const tl = Math.hypot(tx, tz); tx /= tl; tz /= tl;
        const rx = tz, rz = -tx;
        const L = proj({ x: m.x - rx * BITOLA, y: m.y, z: m.z - rz * BITOLA });
        const R = proj({ x: m.x + rx * BITOLA, y: m.y, z: m.z + rz * BITOLA });
        if (!L || !R) { ant = null; continue; }
        const nevoa = clamp(1 - (L.z - 8) / VISTA);
        const k = Math.round(z / passo);
        if (k % 6 === 0) {
          const S = proj({ x: m.x, y: -2, z: m.z });
          if (S) { c.globalAlpha = nevoa * .35; c.strokeStyle = '#E8C987'; c.lineWidth = clamp(2 * fov / L.z / 60, .6, 4); c.beginPath(); c.moveTo((L.x + R.x) / 2, (L.y + R.y) / 2); c.lineTo(S.x, S.y); c.stroke(); }
        }
        if (k % 2 === 0) { c.globalAlpha = nevoa * .55; c.strokeStyle = '#F6F0E6'; c.lineWidth = clamp(1.4 * fov / L.z / 60, .5, 3); c.beginPath(); c.moveTo(L.x, L.y); c.lineTo(R.x, R.y); c.stroke(); }
        if (ant) {
          c.globalAlpha = nevoa; c.strokeStyle = '#FF674A'; c.lineCap = 'round';
          c.lineWidth = clamp(4.2 * fov / L.z / 60, 1, 9);
          c.beginPath(); c.moveTo(ant.L.x, ant.L.y); c.lineTo(L.x, L.y); c.moveTo(ant.R.x, ant.R.y); c.lineTo(R.x, R.y); c.stroke();
        }
        ant = { L, R };
      }
      // nome da próxima seção, suspenso sobre o trilho no fim do percurso
      const zl = COMP + 4, ml = meio(zl);
      const Pl = proj({ x: ml.x, y: ml.y + 5, z: zl });
      if (Pl) {
        const tam = 4.2 * fov / Pl.z;
        const a = clamp((140 - Pl.z) / 60) * clamp((Pl.z - .6) / 2.2);
        c.globalAlpha = a; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
        c.fillStyle = '#E8C987'; c.font = `600 ${Math.max(8, tam * .16)}px "Hanken Grotesk", sans-serif`;
        c.fillText(apoio.toUpperCase().split('').join(String.fromCharCode(8202)), Pl.x, Pl.y - tam * .95);
        c.fillStyle = '#F6F0E6'; c.font = `400 ${tam}px Gloock, Georgia, serif`;
        c.fillText(nome, Pl.x, Pl.y);
      }
      c.restore();
      c.globalAlpha = 1;
      // frente do carrinho, presa à câmera: barra de segurança e laterais escuras com filete coral
      const bw = Math.min(W * .7, 900), bx = (W - bw) / 2, by = H - Math.min(H * .1, 84);
      const g = c.createLinearGradient(0, by, 0, H); g.addColorStop(0, '#1B2638'); g.addColorStop(1, '#070D18');
      c.fillStyle = g; c.beginPath(); c.moveTo(bx + bw * .06, by); c.lineTo(bx + bw * .94, by); c.lineTo(bx + bw, H); c.lineTo(bx, H); c.closePath(); c.fill();
      c.fillStyle = '#FF674A'; c.fillRect(bx + bw * .06, by, bw * .88, 2);
      c.strokeStyle = 'rgba(246, 240, 230, .75)'; c.lineWidth = 3; c.lineCap = 'round';
      c.beginPath(); c.moveTo(bx + bw * .3, by + 2); c.lineTo(bx + bw * .34, by - 26); c.lineTo(bx + bw * .66, by - 26); c.lineTo(bx + bw * .7, by + 2); c.stroke();
    };
    const loop = () => {
      if (!ativo) { rodando = false; return; }
      p = lerp(p, alvoP, .14);
      desenha();
      if (Math.abs(alvoP - p) > .0004) requestAnimationFrame(loop); else { p = alvoP; desenha(); rodando = false; }
    };
    const pede = () => { if (!rodando && ativo) { rodando = true; requestAnimationFrame(loop); } };
    sec.addEventListener('progresso', (e) => { alvoP = e.detail; pede(); });
    new IntersectionObserver(([e]) => { ativo = e.isIntersecting; if (ativo) { tamanho(); desenha(); pede(); } }).observe(sec);
    addEventListener('resize', () => { if (ativo) { tamanho(); desenha(); } });
    if (document.fonts) document.fonts.ready.then(() => { if (ativo) desenha(); });
    if (calmo) { alvoP = p = .85; }
  });

  // ---------- destinos: mapa-múndi com rotas saindo de Curitiba ----------
  const dest = $('[data-destinos]');
  const rotas = $$('[data-rota]', dest), cidades = $$('[data-cidade]', dest);
  const dFotos = $$('[data-dfoto]', dest), dCards = $$('[data-dcard]', dest), dItens = $$('[data-dest-item]', dest);
  const mAviao = $('[data-mapa-aviao]', dest);
  let dAtual = -1;
  const voaDestinos = (p) => {
    const n = rotas.length;
    const f = clamp(p * 1.03) * n;
    const i = Math.min(n - 1, Math.floor(f));
    const k = clamp((f - i) / .6);
    rotas.forEach((r, j) => {
      r.classList.toggle('feita', j < i); r.classList.toggle('ativa', j === i);
      r.style.strokeDashoffset = j === i ? (1 - k).toFixed(3) : '';
    });
    cidades.forEach((cd, j) => { cd.classList.toggle('feita', j < i); cd.classList.toggle('ativa', j === i && k > .98); });
    const L = rotas[i].getTotalLength();
    const a = rotas[i].getPointAtLength(L * k), b = rotas[i].getPointAtLength(Math.min(L, L * k + 1.5));
    const ang = k >= 1 ? 0 : Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    mAviao.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(.75)`);
    mAviao.style.opacity = k >= 1 ? 0 : 1;
    if (i !== dAtual) {
      dAtual = i;
      [dFotos, dCards].forEach((lista) => lista.forEach((el, j) => el.classList.toggle('on', j === i)));
      dItens.forEach((li, j) => { li.classList.toggle('on', j === i); li.classList.toggle('feito', j < i); });
    }
  };
  dest.addEventListener('progresso', (e) => voaDestinos(e.detail));
  voaDestinos(calmo ? 0 : 0);

  // ---------- roteiro: um dia perfeito na Disney ----------
  const roteiro = $('[data-roteiro]');
  const rVideos = $$('[data-rvideo]', roteiro), rItens = $$('[data-r-item]', roteiro);
  const rHora = $('[data-r-hora]'), rTit = $('[data-r-titulo]'), rTxt = $('[data-r-texto]');
  let rAtual = -1;
  const mudaRoteiro = (i) => {
    if (i === rAtual) return;
    rAtual = i;
    rVideos.forEach((v, j) => {
      v.classList.toggle('on', j === i);
      if (j === i) { if (v.preload === 'none') v.preload = 'auto'; toca(v); } else setTimeout(() => { if (!v.classList.contains('on')) v.pause(); }, 1000);
    });
    rItens.forEach((li, j) => { li.classList.toggle('on', j === i); li.classList.toggle('feito', j < i); });
    const li = rItens[i];
    rHora.textContent = li.dataset.hora; rHora.classList.remove('muda'); void rHora.offsetWidth; rHora.classList.add('muda');
    rTit.textContent = li.dataset.t; rTxt.textContent = li.dataset.d;
    const box = rTit.parentElement; box.classList.remove('muda'); void box.offsetWidth; box.classList.add('muda');
  };
  roteiro.addEventListener('progresso', (e) => mudaRoteiro(Math.min(rItens.length - 1, Math.floor(clamp(e.detail * 1.02) * rItens.length))));
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) rVideos.forEach((v) => v.pause()); else if (rAtual >= 0) toca(rVideos[rAtual]); else mudaRoteiro(0); }).observe(roteiro);

  // ---------- serviços: mosaico ----------
  // o recorte (clip-path) zera a área do bloco para o observador, então quem é observado é o mosaico inteiro
  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting) return; obs.disconnect();
    $$('[data-bloco]').forEach((b) => b.classList.add('visivel'));
  }, { threshold: .08 }).observe($('.bento'));
  $$('[data-bloco]').forEach((b) => {
    if (toque || calmo) return;
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - .5) * 10}deg`);
      b.style.setProperty('--rx', `${(.5 - (e.clientY - r.top) / r.height) * 8}deg`);
    });
    b.addEventListener('pointerleave', () => { b.style.setProperty('--ry', '0deg'); b.style.setProperty('--rx', '0deg'); });
  });

  // ---------- transição do menu: o avião passa e a página troca por trás ----------
  const voo = $('[data-voo]');
  const vooDestino = $('[data-voo-destino]');
  let navegando = false;
  const NOMES = { inicio: 'Início', passagens: 'Passagens', destinos: 'Destinos', disney: 'Disney', servicos: 'Serviços', vistos: 'Vistos', clientes: 'Clientes' };
  const nomeDe = (alvo, link) => NOMES[alvo.id] || link.textContent.trim();
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const alvo = document.getElementById(a.getAttribute('href').slice(1));
    if (!alvo || alvo.id === 'conteudo') return;
    e.preventDefault();
    const vai = () => scrollTo({ top: alvo.getBoundingClientRect().top + scrollY, behavior: 'instant' });
    if (calmo || navegando) { vai(); return; }
    navegando = true;
    vooDestino.textContent = nomeDe(alvo, a);
    voo.classList.add('ativo'); void voo.offsetWidth; voo.classList.add('entra');
    setTimeout(() => {
      vai();
      voo.classList.add('sai');
      setTimeout(() => {
        voo.classList.remove('ativo', 'entra', 'sai');
        navegando = false;
      }, 800);
    }, 820);
  });

  // ---------- contagem regressiva da viagem ----------
  const dataIn = $('[data-contagem-data]');
  const campos = { d: $('[data-c="d"]'), h: $('[data-c="h"]'), m: $('[data-c="m"]'), s: $('[data-c="s"]') };
  let alvo = null;
  try { const salvo = localStorage.getItem('peak-viagem'); if (salvo) { dataIn.value = salvo; alvo = new Date(`${salvo}T08:00:00`); } } catch (e) { /* sem armazenamento */ }
  const hoje = new Date(); dataIn.min = hoje.toISOString().slice(0, 10);
  const poe = (el, txt) => { if (el.textContent !== txt) { el.textContent = txt; el.classList.remove('vira'); void el.offsetWidth; el.classList.add('vira'); } };
  const contagem = () => {
    if (!alvo) return;
    let ms = Math.max(0, alvo - Date.now());
    const d = Math.floor(ms / 864e5); ms -= d * 864e5;
    const h = Math.floor(ms / 36e5); ms -= h * 36e5;
    const m = Math.floor(ms / 6e4); ms -= m * 6e4;
    poe(campos.d, String(d).padStart(3, '0')); poe(campos.h, String(h).padStart(2, '0'));
    poe(campos.m, String(m).padStart(2, '0')); poe(campos.s, String(Math.floor(ms / 1000)).padStart(2, '0'));
  };
  dataIn.addEventListener('change', () => {
    if (!dataIn.value) return;
    alvo = new Date(`${dataIn.value}T08:00:00`);
    try { localStorage.setItem('peak-viagem', dataIn.value); } catch (e) { /* sem armazenamento */ }
    contagem();
  });
  setInterval(contagem, 1000); contagem();

  // ---------- vistos: passaporte em 3D e avião no caminho ----------
  const pass = $('[data-passaporte]');
  const passEl = $('.passaporte', pass);
  if (!toque && !calmo) {
    pass.addEventListener('pointermove', (e) => {
      const r = pass.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      passEl.style.setProperty('--ry', `${(x - .5) * 40}deg`);
      passEl.style.setProperty('--rx', `${(.5 - y) * 26}deg`);
      passEl.style.setProperty('--bx', `${100 - x * 100}%`);
    });
    pass.addEventListener('pointerleave', () => { passEl.style.removeProperty('--ry'); passEl.style.removeProperty('--rx'); });
  }
  const jornada = $('[data-jornada]');
  const jPath = $('[data-jornada-path]');
  const jAviao = $('[data-jornada-aviao]');
  const etapas = $$('[data-etapa]');
  jornada.addEventListener('progresso', (e) => {
    const k = clamp((e.detail - .25) * 2.4);
    const svg = jPath.ownerSVGElement.getBoundingClientRect();
    const base = jornada.getBoundingClientRect();
    const L = jPath.getTotalLength();
    const pt = jPath.getPointAtLength(L * k), pt2 = jPath.getPointAtLength(Math.min(L, L * k + 3));
    const sx = svg.width / 1200, sy = svg.height / 220;
    jAviao.style.setProperty('--ax', `${svg.left - base.left + pt.x * sx}px`);
    jAviao.style.setProperty('--ay', `${svg.top - base.top + pt.y * sy}px`);
    jAviao.style.setProperty('--ar', `${Math.atan2((pt2.y - pt.y) * sy, (pt2.x - pt.x) * sx) * 180 / Math.PI}deg`);
    etapas.forEach((et, i) => et.classList.toggle('ativa', k >= i / etapas.length + .02));
  });
  if (calmo) etapas.forEach((et) => et.classList.add('ativa'));
  new IntersectionObserver(([e]) => { if (e.isIntersecting) $('.carimbo').classList.add('visivel'); }, { threshold: .5 }).observe(pass);

  // ---------- número de clientes ----------
  $$('[data-conta]').forEach((el) => {
    const fim = +el.dataset.conta;
    const fmt = (n) => n.toLocaleString('pt-BR');
    if (calmo) { el.textContent = fmt(fim); return; }
    new IntersectionObserver(([e], obs) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const t0 = performance.now();
      const sobe = (t) => { const k = clamp((t - t0) / 2200); el.textContent = fmt(Math.round(fim * (1 - Math.pow(1 - k, 4)))); if (k < 1) requestAnimationFrame(sobe); };
      requestAnimationFrame(sobe);
    }, { threshold: .6 }).observe(el);
  });

  // ---------- baralho de depoimentos ----------
  const baralho = $('[data-baralho]');
  const cartas = $$('[data-depo]', baralho);
  let topoCarta = 0, autoDepo;
  const arruma = () => cartas.forEach((c, i) => {
    const pos = (i - topoCarta + cartas.length) % cartas.length;
    c.style.setProperty('--pos', pos); c.dataset.pos = pos;
    c.setAttribute('aria-hidden', pos ? 'true' : 'false');
    $$('a', c).forEach((a) => { a.tabIndex = pos ? -1 : 0; });
  });
  const vai = (d) => { topoCarta = (topoCarta + d + cartas.length) % cartas.length; arruma(); reinicia(); };
  const reinicia = () => { clearInterval(autoDepo); if (!calmo) autoDepo = setInterval(() => vai(1), 6500); };
  $$('[data-depo-ir]').forEach((b) => b.addEventListener('click', () => vai(+b.dataset.depoIr)));
  arruma(); reinicia();
  let arr = null;
  baralho.addEventListener('pointerdown', (e) => {
    const c = e.target.closest('[data-depo]');
    if (!c || c.dataset.pos !== '0' || e.target.closest('a')) return;
    arr = { c, x0: e.clientX, dx: 0 }; c.classList.add('arrasta'); c.setPointerCapture(e.pointerId);
  });
  baralho.addEventListener('pointermove', (e) => {
    if (!arr) return;
    arr.dx = e.clientX - arr.x0;
    arr.c.style.setProperty('--dx', `${arr.dx}px`); arr.c.style.setProperty('--dr', `${arr.dx * .05}deg`);
  });
  const solta = () => {
    if (!arr) return;
    const { c, dx } = arr; arr = null;
    c.classList.remove('arrasta'); c.style.removeProperty('--dx'); c.style.removeProperty('--dr');
    if (Math.abs(dx) > 90) vai(dx < 0 ? 1 : -1);
  };
  baralho.addEventListener('pointerup', solta); baralho.addEventListener('pointercancel', solta);

  // ---------- instagram: esteira curva em 3D ----------
  const insta = $('[data-insta-trilho]');
  const posts = $$('[data-post]', insta);
  let off = 0, velInsta = .5, ultimoScroll = scrollY, instaAtivo = false, metade = 0;
  const mede = () => { metade = insta.scrollWidth / 2; };
  mede(); addEventListener('resize', mede); addEventListener('load', mede);
  const giraInsta = () => {
    if (!instaAtivo) return;
    const dy = scrollY - ultimoScroll; ultimoScroll = scrollY;
    velInsta = lerp(velInsta, .5 + Math.abs(dy) * .25, .08);
    off = (off + velInsta) % metade;
    insta.style.transform = `translate3d(${-off}px,0,0)`;
    const meio = innerWidth / 2;
    for (const p of posts) {
      const r = p.getBoundingClientRect();
      const d = clamp((r.left + r.width / 2 - meio) / meio, -1.4, 1.4);
      p.style.setProperty('--ry', `${(-d * 28).toFixed(2)}deg`);
      p.style.setProperty('--tz', `${(Math.abs(d) * 90).toFixed(1)}px`);
    }
    requestAnimationFrame(giraInsta);
  };
  if (!calmo) new IntersectionObserver(([e]) => { const era = instaAtivo; instaAtivo = e.isIntersecting; if (instaAtivo && !era) { mede(); requestAnimationFrame(giraInsta); } }).observe(insta);

  // ---------- final: fogos quando o título aparece ----------
  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting) return; obs.disconnect();
    setTimeout(() => { soltaFogos(innerWidth * .28, innerHeight * .3, 3); setTimeout(() => soltaFogos(innerWidth * .72, innerHeight * .28, 3), 700); }, 600);
  }, { threshold: .5 }).observe($('.final h2'));

  // ---------- buscador: vira mensagem no WhatsApp ----------
  const busca = $('[data-busca]');
  const trecho = $('[data-trecho]');
  const volta = $('[data-volta]');
  let pax = 1;
  const paxOut = $('[data-pax-n]');
  $$('[data-pax]').forEach((b) => b.addEventListener('click', () => {
    pax = clamp(pax + +b.dataset.pax, 1, 12);
    paxOut.textContent = `${pax} ${pax > 1 ? 'viajantes' : 'viajante'}`;
  }));
  trecho.addEventListener('change', () => { const so = trecho.value === 'Só ida'; volta.classList.toggle('off', so); $('input', volta).disabled = so; });
  $('[data-troca]').addEventListener('click', () => { const o = $('[data-origem]'), d = $('[data-destino]'); [o.value, d.value] = [d.value, o.value]; });
  const dataBr = (v) => v ? v.split('-').reverse().join('/') : 'a definir';
  busca.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(busca);
    const linhas = [
      'Olá, Peakalika! Quero uma cotação:',
      `Tipo: ${f.get('tipo')}`,
      `Trecho: ${f.get('trecho')}`,
      `Viajantes: ${pax}`,
      `Saindo de: ${f.get('origem') || 'a definir'}`,
      `Destino: ${f.get('destino') || 'a definir'}`,
      `Ida: ${dataBr(f.get('ida'))}`,
    ];
    if (f.get('trecho') !== 'Só ida') linhas.push(`Volta: ${dataBr(f.get('volta'))}`);
    window.open(waLink(linhas.join('\n')), '_blank', 'noopener');
  });

  // ---------- chat ----------
  const chatBt = $('[data-chat-bt]'), chatJan = $('[data-chat-janela]');
  const abreChat = (abrir) => { chatJan.hidden = !abrir; chatBt.setAttribute('aria-expanded', abrir); if (abrir) iguala(); };
  chatBt.addEventListener('click', () => abreChat(chatJan.hidden));
  $('[data-chat-fecha]').addEventListener('click', () => abreChat(false));
  $$('[data-chat-op]').forEach((b) => b.addEventListener('click', () => {
    window.open(waLink(`Olá, Peakalika! Vim pelo site e quero falar sobre: ${b.dataset.chatOp}.`), '_blank', 'noopener');
  }));
  const agora = new Date(), faixa = D.abertura[agora.getDay()];
  const aberto = faixa && agora.getHours() >= faixa[0] && agora.getHours() < faixa[1];
  $('[data-chat-status]').textContent = aberto ? 'Estamos online agora' : 'Deixe sua mensagem, respondemos logo cedo';
  // o botão do chat some na capa e volta depois dela
  new IntersectionObserver(([e]) => document.body.classList.toggle('sem-chat', e.isIntersecting), { threshold: .5 }).observe($('.capa-fixa'));

  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  quadro();
})();
