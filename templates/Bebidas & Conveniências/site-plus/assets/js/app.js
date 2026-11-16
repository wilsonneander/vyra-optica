/* N3 Drinks, interações da página. Quase tudo aqui é função da posição do scroll. */
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

  // ---------- modal do sabor ----------
  const SAB = window.N3_SABORES || [];
  const modal = $('[data-modal]');
  let modalId = null, focoAntes = null;
  function preencheModal(s) {
    const i = SAB.indexOf(s);
    const ant = SAB[(i - 1 + SAB.length) % SAB.length], prox = SAB[(i + 1) % SAB.length];
    const claro = (() => { const n = parseInt(s.campo.slice(1), 16); return (0.2126 * (n >> 16 & 255) + 0.7152 * (n >> 8 & 255) + 0.0722 * (n & 255)) / 255 > 0.45; })();
    modal.style.setProperty('--campo', s.campo);
    modal.style.setProperty('--fundo', s.fundo);
    modal.classList.toggle('palco-escuro', !claro);
    const m = k => modal.querySelector(`[data-m="${k}"]`);
    m('tag').textContent = s.tag; m('nome').textContent = s.nome; m('frase').textContent = s.frase;
    m('desc').textContent = s.desc; m('notas').textContent = s.notas.join(', ');
    m('preco').textContent = s.preco; m('fardo').textContent = s.fardo;
    m('cafeina').textContent = s.cafeina; m('kcal').textContent = s.kcal; m('acucar').textContent = s.acucar; m('sodio').textContent = s.sodio;
    m('anterior').textContent = ant.nome; m('proximo').textContent = prox.nome;
  }
  function abreModal(id, troca) {
    const s = SAB.find(x => x.id === id); if (!s || !modal) return;
    modalId = id;
    preencheModal(s);
    if (!troca) {
      focoAntes = document.activeElement;
      modal.hidden = false;
      document.documentElement.classList.add('modal-aberto');
      requestAnimationFrame(() => { modal.classList.add('on'); iguala(); });
      setTimeout(() => modal.querySelector('.modal-x').focus(), 60);
    } else {
      const info = modal.querySelector('.modal-info');
      info.classList.remove('troca'); void info.offsetWidth; info.classList.add('troca');
    }
    document.dispatchEvent(new CustomEvent('n3:modal', { detail: { id, troca: !!troca } }));
  }
  function fechaModal() {
    if (!modal || modal.hidden) return;
    modal.classList.remove('on');
    document.dispatchEvent(new CustomEvent('n3:modal-fecha'));
    setTimeout(() => {
      modal.hidden = true; document.documentElement.classList.remove('modal-aberto');
      if (focoAntes && focoAntes.focus) focoAntes.focus({ preventScroll: true });
    }, reduz ? 0 : 380);
  }
  document.addEventListener('click', e => {
    const gat = e.target.closest('[data-abre]');
    if (gat && !e.target.closest('[data-modal]')) { e.preventDefault(); abreModal(gat.dataset.abre); return; }
    const fecha = e.target.closest('[data-fecha]');
    if (fecha) { if (fecha.tagName !== 'A') e.preventDefault(); fechaModal(); return; }
    const ir = e.target.closest('[data-modal-ir]');
    if (ir) {
      const i = SAB.findIndex(x => x.id === modalId), n = SAB.length;
      abreModal(SAB[(i + +ir.dataset.modalIr + n) % n].id, true);
    }
  });
  document.addEventListener('keydown', e => {
    if (!modal || modal.hidden) return;
    if (e.key === 'Escape') { fechaModal(); return; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      if (document.activeElement && document.activeElement.matches('input, textarea')) return;
      const i = SAB.findIndex(x => x.id === modalId), n = SAB.length, d = e.key === 'ArrowRight' ? 1 : -1;
      abreModal(SAB[(i + d + n) % n].id, true); return;
    }
    if (e.key === 'Tab') {
      // mantém o foco dentro do modal
      const f = $$('a[href], button:not([disabled])', modal).filter(el => el.offsetParent !== null);
      if (!f.length) return;
      const pri = f[0], ult = f[f.length - 1];
      if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
    }
  });

  // ---------- cursor animado (só com mouse) ----------
  const cursor = $('.cursor');
  if (cursor && matchMedia('(hover: hover) and (pointer: fine)').matches && !reduz) {
    document.documentElement.classList.add('tem-cursor');
    const ponto = $('.cursor-ponto', cursor), anel = $('.cursor-anel', cursor), rotulo = $('b', anel);
    let mx = innerWidth / 2, my = innerHeight / 2, ax = mx, ay = my, px = mx, py = my, visto = false;
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      if (!visto) { visto = true; ax = mx; ay = my; cursor.classList.add('on'); }
      const alvo = e.target.closest ? e.target : null;
      let modo = '', texto = '';
      if (alvo) {
        if (alvo.closest('.modal-3d')) { modo = 'rotulo'; texto = 'Girar'; }
        else if (alvo.closest('[data-regua]')) { modo = 'rotulo'; texto = 'Arrastar'; }
        else if (alvo.closest('[data-abre]')) { modo = 'rotulo'; texto = 'Abrir'; }
        else if (alvo.closest('input, textarea')) modo = 'texto';
        else if (alvo.closest('a, button, summary, label, [role="slider"]')) modo = 'link';
      }
      cursor.dataset.modo = modo;
      if (texto && rotulo.textContent !== texto) rotulo.textContent = texto;
    }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.remove('on'));
    document.addEventListener('pointerenter', () => { if (visto) cursor.classList.add('on'); });
    addEventListener('pointerdown', () => cursor.classList.add('aperta'));
    addEventListener('pointerup', () => cursor.classList.remove('aperta'));
    (function segue() {
      // o anel vem atrás do ponto com atraso e estica na direção do movimento
      ax += (mx - ax) * 0.16; ay += (my - ay) * 0.16;
      const vx = mx - px, vy = my - py; px = mx; py = my;
      const vel = Math.min(Math.hypot(vx, vy), 60);
      const ang = Math.atan2(vy, vx) * 180 / Math.PI;
      const estica = cursor.dataset.modo ? 1 : 1 + vel / 90;
      ponto.style.transform = `translate3d(${mx}px,${my}px,0)`;
      anel.style.transform = `translate3d(${ax}px,${ay}px,0) rotate(${ang}deg) scale(${estica}, ${1 / Math.sqrt(estica)})`;
      rotulo.style.transform = `rotate(${-ang}deg)`;
      requestAnimationFrame(segue);
    })();
  }
})();
