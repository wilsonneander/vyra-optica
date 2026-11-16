/* ESTALO, interações da página. Quase tudo aqui é função da posição do scroll. */
(function () {
  'use strict';
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  let vh = innerHeight;

  // ---------- grupos com a mesma largura (diretriz do projeto) ----------
  function iguala() {
    $$('[data-iguais]').forEach(g => {
      g.style.removeProperty('--larg');
      const filhos = [...g.children];
      filhos.forEach(f => { f.style.width = 'auto'; });
      const maior = Math.max(...filhos.map(f => Math.ceil(f.getBoundingClientRect().width)));
      filhos.forEach(f => { f.style.width = ''; });
      g.style.setProperty('--larg', maior + 'px');
    });
  }
  document.fonts.ready.then(iguala);
  addEventListener('resize', iguala);

  // ---------- topo: some ao descer, volta ao subir; menu do celular ----------
  const topo = $('[data-topo]');
  const btnMenu = $('[data-abre-menu]');
  let ultimoY = scrollY;
  btnMenu.addEventListener('click', () => {
    const ab = topo.classList.toggle('aberto');
    btnMenu.setAttribute('aria-expanded', ab);
  });
  $$('.menu a').forEach(a => a.addEventListener('click', () => { topo.classList.remove('aberto'); btnMenu.setAttribute('aria-expanded', false); }));

  // ---------- fita: anda sozinha e acelera com a velocidade do scroll ----------
  const fita = $('[data-fita]');
  if (fita) fita.innerHTML += fita.innerHTML;
  let fitaX = 0, vel = 0;

  // ---------- trilho horizontal dos sabores ----------
  const trilhoSec = $('[data-trilho-sec]'), trilho = $('[data-trilho]'), trilhoBarra = $('[data-trilho-barra]');
  let trilhoMax = 0;
  function medeTrilho() {
    if (!trilho) return;
    trilhoMax = Math.max(0, trilho.scrollWidth - innerWidth);
    trilhoSec.style.height = (vh + trilhoMax * 1.1) + 'px';
  }

  // ---------- elementos ligados ao scroll ----------
  const contas = $$('[data-conta]');
  const medidores = $$('.medidor i');
  const horas = $$('.card-hora');
  const paralaxes = $$('[data-paralaxe]');
  const zooms = $$('[data-zoom]');
  const mapa = $('[data-paralaxe-box]');
  const lojas = $$('.loja');
  const finalTit = $('[data-final-tit]');
  const finalLatas = $('[data-final-latas]');
  const gigante = $('[data-gigante]');
  const lacres = $('.lacres');

  // posição do elemento ao atravessar a tela: 0 entrando por baixo, 1 saindo por cima
  function travessia(el) { const r = el.getBoundingClientRect(); return clamp((vh - r.top) / (vh + r.height)); }
  // 0 quando o topo encosta embaixo da tela, 1 quando chega a uma fração da altura
  function chegada(el, ate = 0.35) { const r = el.getBoundingClientRect(); return clamp((vh - r.top) / (vh * (1 - ate))); }

  const fmt = (v, casas) => casas ? v.toFixed(casas).replace('.', ',') : Math.round(v).toLocaleString('pt-BR');

  function quadro() {
    const y = scrollY;
    const dy = y - ultimoY;
    vel = vel * 0.9 + dy * 0.1;

    // topo
    if (!topo.classList.contains('aberto')) {
      if (dy > 4 && y > 300) topo.classList.add('some');
      else if (dy < -4) topo.classList.remove('some');
    }
    ultimoY = y;

    // fita
    if (fita) {
      fitaX -= reduz ? 0 : (0.6 + Math.min(Math.abs(vel) * 0.25, 14)) * (vel < -1 ? -1 : 1);
      const meio = fita.scrollWidth / 2;
      if (fitaX < -meio) fitaX += meio;
      if (fitaX > 0) fitaX -= meio;
      fita.style.transform = `translate3d(${fitaX}px,0,0)`;
    }

    // trilho
    if (trilhoSec) {
      const r = trilhoSec.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - vh));
      trilho.style.transform = `translate3d(${-p * trilhoMax}px,0,0)`;
      if (trilhoBarra) trilhoBarra.style.transform = `scaleX(${p})`;
    }

    contas.forEach(el => {
      const k = chegada(el, 0.45), alvo = parseFloat(el.dataset.conta), casas = +el.dataset.casas || 0;
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(alvo * e, casas);
    });
    medidores.forEach(el => el.style.setProperty('--m', (1 - Math.pow(1 - chegada(el, 0.3), 2)).toFixed(3)));

    horas.forEach(el => {
      const r = el.getBoundingClientRect();
      const c = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.setProperty('--v', clamp(1 - Math.abs(c) * 1.8).toFixed(3));
    });
    paralaxes.forEach(el => {
      const k = travessia(el.parentElement), f = parseFloat(el.dataset.paralaxe) || 0.1;
      el.style.setProperty('--py', ((0.5 - k) * f * 400).toFixed(1) + 'px');
    });
    zooms.forEach(el => el.style.setProperty('--z', (1.22 - travessia(el.parentElement) * 0.22).toFixed(3)));
    if (mapa) {
      const k = travessia(mapa);
      mapa.style.setProperty('--z', (1.25 - k * 0.25).toFixed(3));
      lojas.forEach((l, i) => l.style.setProperty('--ly', ((0.5 - k) * (40 + i * 30)).toFixed(1) + 'px'));
    }
    if (finalTit) {
      const k = chegada(finalTit, 0.4);
      [...finalTit.children].forEach((s, i) => s.style.setProperty('--s', (0.72 + clamp(k * 1.2 - i * 0.12) * 0.28).toFixed(3)));
    }
    if (finalLatas) finalLatas.style.setProperty('--q', (1 - Math.pow(1 - chegada(finalLatas, 0.15), 3)).toFixed(3));
    if (gigante) {
      const k = chegada(gigante, 0.05);
      gigante.style.setProperty('--ls', (1 - k).toFixed(3));
      if (lacres) lacres.style.setProperty('--q', k.toFixed(3));
    }
  }

  let pendente = false;
  function agenda() { if (!pendente) { pendente = true; requestAnimationFrame(() => { pendente = false; quadro(); }); } }
  addEventListener('scroll', agenda, { passive: true });
  // a fita anda mesmo parada
  (function anda() { quadro(); requestAnimationFrame(anda); })();

  addEventListener('resize', () => { vh = innerHeight; medeTrilho(); });
  medeTrilho();
  document.fonts.ready.then(medeTrilho);

  // ---------- entradas suaves ----------
  const alvosRevela = $$('.cab, .card-hora, .card-quem, .agenda-lista li, .card-receita, .card-fardo, .faq details, .estalo-lista li, .onde-grid > div, .rodape-topo > *');
  alvosRevela.forEach(el => el.classList.add('revela'));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      const irmaos = [...e.target.parentElement.children].filter(x => x.classList.contains('revela'));
      e.target.style.transitionDelay = (Math.max(0, irmaos.indexOf(e.target)) % 4) * 0.08 + 's';
      e.target.classList.add('on'); io.unobserve(e.target);
    }
  }), { rootMargin: '0px 0px -8% 0px' });
  alvosRevela.forEach(el => io.observe(el));

  // ---------- dúvidas: abre suave, uma por vez ----------
  $$('[data-faq] details').forEach(d => {
    const s = d.querySelector('summary'), corpo = d.querySelector('div');
    s.addEventListener('click', ev => {
      ev.preventDefault();
      if (reduz) { d.open = !d.open; return; }
      if (d.open) {
        const a = corpo.offsetHeight;
        corpo.animate([{ height: a + 'px' }, { height: '0px' }], { duration: 380, easing: 'cubic-bezier(.2,.9,.25,1)' }).onfinish = () => { d.open = false; };
      } else {
        $$('[data-faq] details[open]').forEach(o => { if (o !== d) o.open = false; });
        d.open = true;
        const a = corpo.offsetHeight;
        corpo.animate([{ height: '0px' }, { height: a + 'px' }], { duration: 480, easing: 'cubic-bezier(.2,.9,.25,1)' });
      }
    });
  });
})();
