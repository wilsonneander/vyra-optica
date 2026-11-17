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
    if (pct < 100) requestAnimationFrame(contaPre);
  };
  contaPre();
  const primeiro = $('[data-capa-video]');
  const prontos = Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((ok) => { if (primeiro.readyState >= 2) ok(); else { primeiro.addEventListener('loadeddata', ok, { once: true }); setTimeout(ok, 3200); } }),
    new Promise((ok) => setTimeout(ok, calmo ? 200 : 2300)),
  ]);
  prontos.then(() => {
    pct = 100; num.textContent = '100';
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
  const destinos = $('[data-destinos]');
  const trilho = $('[data-destinos-trilho]');
  const rotaAviao = $('[data-rota-aviao]');
  const medeDestinos = () => {
    if (!largo() || calmo) { destinos.style.removeProperty('--altura'); return; }
    const dist = Math.max(0, trilho.scrollWidth - innerWidth);
    destinos.style.setProperty('--dist', dist);
    destinos.style.setProperty('--altura', `${dist + innerHeight * 1.15}px`);
  };

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
  addEventListener('resize', () => { medeDestinos(); iguala(); agenda(); });
  addEventListener('load', () => { medeDestinos(); agenda(); });
  if (document.fonts) document.fonts.ready.then(() => { iguala(); medeDestinos(); });

  // capa: a cena só troca enquanto a capa está à vista
  $('.capa').addEventListener('progresso', (e) => {
    const v = capaVideos[cena];
    if (e.detail > .98) v.pause(); else if (v.paused && root.classList.contains('pronto')) toca(v);
  });

  // destinos: avião na rota e paralaxe da foto dentro de cada cartão
  const rotaPath = $('.rota-voo path');
  destinos.addEventListener('progresso', (e) => {
    const p = e.detail;
    const svg = rotaPath.ownerSVGElement.getBoundingClientRect();
    const L = rotaPath.getTotalLength();
    const pt = rotaPath.getPointAtLength(L * p), pt2 = rotaPath.getPointAtLength(Math.min(L, L * p + 2));
    const sx = svg.width / 1000, sy = svg.height / 40;
    const ang = Math.atan2((pt2.y - pt.y) * sy, (pt2.x - pt.x) * sx) * 180 / Math.PI;
    rotaAviao.style.setProperty('--ax', `${pt.x * sx}px`);
    rotaAviao.style.setProperty('--ay', `${pt.y * sy}px`);
    rotaAviao.style.setProperty('--ar', `${ang}deg`);
    $$('.destino', trilho).forEach((c) => {
      const r = c.getBoundingClientRect();
      const meio = (r.left + r.width / 2 - innerWidth / 2) / innerWidth;
      c.style.setProperty('--px', `${(-meio * 60).toFixed(1)}px`);
    });
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
  const CORES_PO = ['#E8C987', '#FFF4D6', '#FFB38F', '#FFFFFF'];
  const CORES_FOGO = [['#FF674A', '#FFB38F'], ['#E8C987', '#FFF4D6'], ['#FFFFFF', '#CFE3FF'], ['#FF8B19', '#FFD9A0']];
  const po = (x, y, n = 2, forca = 1) => {
    for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - .5) * 1.2 * forca, vy: (Math.random() - .2) * 1.2 * forca + .3, v: 1, dec: .012 + Math.random() * .02, r: .6 + Math.random() * 1.8, c: CORES_PO[(Math.random() * 4) | 0], g: .02 });
  };
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
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy, ultimaPo = 0;
    addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      const agora = performance.now();
      if (agora - ultimaPo > 16) { po(tx, ty, 2); liga(); ultimaPo = agora; }
    });
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

  // ---------- céu estrelado com estrela cadente e a fada que voa sobre o castelo ----------
  $$('[data-ceu]').forEach((cv) => {
    if (calmo) return;
    const c = cv.getContext('2d');
    let w, h, estrelas = [], cadentes = [], fada = null, ativo = false, t = 0;
    const tamanho = () => {
      const r = cv.getBoundingClientRect(); w = r.width; h = r.height;
      cv.width = w * dpr; cv.height = h * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0);
      estrelas = Array.from({ length: Math.min(260, (w * h) / 6000) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.3 + .2, f: Math.random() * 6.28, s: .5 + Math.random() * 1.5, o: Math.random() > .85 }));
    };
    tamanho(); addEventListener('resize', tamanho);
    const voo = () => {
      // a fada atravessa o céu em arco, deixando um rastro de poeira dourada
      const castelo = cv.parentElement.querySelector('.castelo-bt');
      const ref = castelo ? castelo.getBoundingClientRect() : null;
      const base = cv.getBoundingClientRect();
      const y0 = ref ? ref.top - base.top + ref.height * .2 : h * .3;
      fada = { t: 0, x0: -40, x1: w + 40, y0, cx: w * .5, cy: y0 - Math.min(260, h * .2), rastro: [] };
    };
    const desenha = () => {
      if (!ativo) return;
      t += 1;
      c.clearRect(0, 0, w, h);
      for (const e of estrelas) {
        const a = .35 + .65 * Math.abs(Math.sin(t * .012 * e.s + e.f));
        c.globalAlpha = a; c.fillStyle = e.o ? '#E8C987' : '#FFFFFF';
        c.beginPath(); c.arc(e.x, e.y, e.r, 0, 6.283); c.fill();
      }
      if (Math.random() < .006) cadentes.push({ x: Math.random() * w * .8, y: Math.random() * h * .4, vx: 7 + Math.random() * 4, vy: 2.5 + Math.random() * 2, v: 1 });
      cadentes = cadentes.filter((s) => s.v > 0);
      for (const s of cadentes) {
        s.x += s.vx; s.y += s.vy; s.v -= .018;
        const g = c.createLinearGradient(s.x, s.y, s.x - s.vx * 12, s.y - s.vy * 12);
        g.addColorStop(0, `rgba(255,244,214,${s.v})`); g.addColorStop(1, 'rgba(255,244,214,0)');
        c.globalAlpha = 1; c.strokeStyle = g; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(s.x, s.y); c.lineTo(s.x - s.vx * 12, s.y - s.vy * 12); c.stroke();
      }
      if (fada) {
        fada.t += .0045;
        const k = fada.t, ik = 1 - k;
        const x = ik * ik * fada.x0 + 2 * ik * k * fada.cx + k * k * fada.x1;
        const y = ik * ik * fada.y0 + 2 * ik * k * fada.cy + k * k * fada.y0 + Math.sin(k * 30) * 8;
        fada.rastro.push({ x, y, v: 1, vy: Math.random() * .6 });
        for (let i = 0; i < 2; i++) fada.rastro.push({ x: x + (Math.random() - .5) * 10, y: y + (Math.random() - .5) * 10, v: .8, vy: .4 + Math.random() });
        fada.rastro = fada.rastro.filter((p) => p.v > 0);
        c.globalCompositeOperation = 'lighter';
        for (const p of fada.rastro) { p.v -= .012; p.y += p.vy; c.globalAlpha = Math.max(0, p.v); c.fillStyle = '#FFE7A8'; c.beginPath(); c.arc(p.x, p.y, 1.2, 0, 6.283); c.fill(); }
        const brilho = c.createRadialGradient(x, y, 0, x, y, 18);
        brilho.addColorStop(0, 'rgba(255,250,230,1)'); brilho.addColorStop(1, 'rgba(255,231,168,0)');
        c.globalAlpha = 1; c.fillStyle = brilho; c.beginPath(); c.arc(x, y, 18, 0, 6.283); c.fill();
        c.globalCompositeOperation = 'source-over';
        if (k >= 1 && !fada.rastro.length) fada = null;
        else if (k >= 1) fada.t = 1;
      }
      c.globalAlpha = 1;
      requestAnimationFrame(desenha);
    };
    let jaVoou = false;
    new IntersectionObserver(([e]) => {
      const era = ativo; ativo = e.isIntersecting;
      if (ativo && !era) { tamanho(); requestAnimationFrame(desenha); }
    }).observe(cv);
    const castelo = cv.parentElement.querySelector('[data-castelo]');
    if (castelo) new IntersectionObserver(([e]) => { if (e.isIntersecting && !jaVoou) { jaVoou = true; setTimeout(voo, 700); } }, { threshold: .6 }).observe(castelo);
    cv.parentElement.addEventListener('peak-fada', voo);
  });

  // castelo: toque solta fogos e chama a fada de novo
  const casteloBt = $('[data-castelo-bt]');
  casteloBt.addEventListener('click', (e) => {
    const r = casteloBt.getBoundingClientRect();
    soltaFogos(r.left + r.width / 2, r.top + r.height * .15, 5);
    casteloBt.closest('.disney').dispatchEvent(new Event('peak-fada'));
  });
  // fogos sozinhos quando o castelo termina de se desenhar
  let casteloAceso = false;
  $('[data-castelo]').addEventListener('progresso', (e) => {
    if (!casteloAceso && e.detail > .5) {
      casteloAceso = true;
      const r = casteloBt.getBoundingClientRect();
      soltaFogos(r.left + r.width / 2, r.top + r.height * .1, 4);
    }
  });

  // ---------- carrossel 3D de cenas ----------
  const roda = $('[data-roda]');
  const cenas = $$('[data-cena]');
  const legenda = $('[data-roda-legenda]');
  let frente = -1;
  const defineFrente = (i) => {
    if (i === frente) return;
    frente = i;
    cenas.forEach((c, j) => {
      const v = $('video', c);
      const perto = j === i;
      c.classList.toggle('frente', perto);
      if (perto) { if (v.preload === 'none') v.preload = 'auto'; toca(v); } else v.pause();
    });
    const c = cenas[i];
    legenda.innerHTML = `<b>${$('b', c).textContent}</b><span>${$('figcaption span', c).textContent}</span>`;
  };
  roda.addEventListener('progresso', (e) => {
    $('[data-roda-barra]').parentElement.style.setProperty('--p', e.detail);
    const i = Math.round(e.detail * (cenas.length - 1));
    if (e.detail > 0 && e.detail < 1) defineFrente(i); else defineFrente(e.detail >= 1 ? cenas.length - 1 : 0);
  });
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) cenas.forEach((c) => $('video', c).pause()); else if (frente >= 0) toca($('video', cenas[frente])); }).observe(roda);

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
    const r = $('[data-contagem]').getBoundingClientRect();
    soltaFogos(r.left + r.width / 2, r.top, 4);
  });
  setInterval(contagem, 1000); contagem();

  // ---------- serviços: foto que segue o cursor ----------
  const flutua = $('[data-serv-flutua]');
  const flutuaImg = $('img', flutua);
  if (!toque && !calmo) {
    let fx = 0, fy = 0, alvoX = 0, alvoY = 0, vel = 0, rodando = false;
    const passo = () => {
      const dx = alvoX - fx; vel = lerp(vel, dx, .1);
      fx = lerp(fx, alvoX, .14); fy = lerp(fy, alvoY, .14);
      flutua.style.setProperty('--x', `${fx}px`); flutua.style.setProperty('--y', `${fy}px`);
      flutua.style.setProperty('--rot', `${clamp(vel * .12, -14, 14)}deg`);
      if (flutua.classList.contains('on') || Math.abs(dx) > .5) requestAnimationFrame(passo); else rodando = false;
    };
    $$('.serv').forEach((li) => {
      li.addEventListener('pointerenter', (e) => {
        if (!flutua.classList.contains('on')) { fx = alvoX = e.clientX; fy = alvoY = e.clientY; }
        flutuaImg.src = li.dataset.serv;
        flutua.classList.add('on'); flutua.style.setProperty('--s', 1);
        if (!rodando) { rodando = true; requestAnimationFrame(passo); }
      });
      li.addEventListener('pointermove', (e) => { alvoX = e.clientX + 40; alvoY = e.clientY; });
    });
    $('[data-servicos]').addEventListener('pointerleave', () => { flutua.classList.remove('on'); flutua.style.setProperty('--s', .6); });
  }

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
  medeDestinos(); quadro();
})();
