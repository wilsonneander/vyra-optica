/* N3 Drinks, interações da página. Quase tudo aqui é função da posição do scroll. */
(function () {
  'use strict';
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  let vh = innerHeight;
  let rolagem = null; // rolagem suave em andamento (o topo não se esconde enquanto ela roda)

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
    if (rolagem) topo.classList.remove('some');
    else if (!topo.classList.contains('aberto')) {
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
      const k = chegada(gigante, 0.6);
      gigante.style.setProperty('--ls', (1 - k).toFixed(3));
    }
  }

  let pendente = false;
  function agenda() { if (!pendente) { pendente = true; requestAnimationFrame(() => { pendente = false; quadro(); }); } }
  addEventListener('scroll', agenda, { passive: true });
  // a fita anda mesmo parada
  (function anda() { quadro(); requestAnimationFrame(anda); })();

  // marca gigante do rodapé ocupa a largura exata, qualquer que seja o tamanho da tela
  function encaixaGigante() {
    if (!gigante) return;
    gigante.style.setProperty('--ls', '0'); gigante.style.fontSize = '100px';
    const w = gigante.getBoundingClientRect().width, alvo = gigante.parentElement.clientWidth;
    if (w) gigante.style.fontSize = (100 * alvo / w * 0.97).toFixed(2) + 'px';
  }
  document.fonts.ready.then(encaixaGigante);
  addEventListener('resize', () => { vh = innerHeight; medeTrilho(); encaixaGigante(); });
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

  // ---------- rolagem suave até a seção clicada ----------
  // acelera, desliza e desacelera; a duração cresce com a distância; mexer na rodinha ou tocar interrompe
  const suaveIO = x => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
  function cancelaRolagem() { if (rolagem) { cancelAnimationFrame(rolagem.raf); rolagem = null; } }
  ['wheel', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, e => {
    if (ev === 'keydown' && !['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) return;
    cancelaRolagem();
  }, { passive: true }));
  function rolaAte(alvo, hash) {
    cancelaRolagem();
    const destino = Math.min(alvo === 'topo' ? 0 : alvo.getBoundingClientRect().top + scrollY, document.documentElement.scrollHeight - innerHeight);
    const inicio = scrollY, dist = destino - inicio;
    if (hash) history.pushState(null, '', hash);
    if (reduz || Math.abs(dist) < 2) { scrollTo(0, destino); return; }
    const dur = Math.min(1700, Math.max(650, 480 + Math.abs(dist) * 0.07));
    const t0 = performance.now();
    rolagem = { raf: 0 };
    const passo = agora => {
      const k = Math.min(1, (agora - t0) / dur);
      scrollTo(0, inicio + dist * suaveIO(k));
      if (k < 1 && rolagem) rolagem.raf = requestAnimationFrame(passo);
      else { rolagem = null; if (alvo !== 'topo') { alvo.setAttribute('tabindex', '-1'); alvo.focus({ preventScroll: true }); } }
    };
    rolagem.raf = requestAnimationFrame(passo);
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.closest('[data-abre]') || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const hash = a.getAttribute('href');
    if (hash === '#conteudo') return;
    const alvo = hash === '#' || hash === '#inicio' ? 'topo' : document.querySelector(hash);
    if (!alvo) return;
    e.preventDefault();
    topo.classList.remove('aberto'); btnMenu.setAttribute('aria-expanded', false);
    // vindo do modal: espera ele fechar e liberar a rolagem da página
    if (a.closest('[data-modal]')) setTimeout(() => rolaAte(alvo, hash), reduz ? 0 : 420);
    else rolaAte(alvo, hash);
  });

  // link do menu acende conforme a seção que está na tela
  const linksMenu = $$('.menu a[href^="#"]');
  const secoesMenu = linksMenu.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const ioMenu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    linksMenu.forEach(a => a.classList.toggle('ativo', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secoesMenu.forEach(s => ioMenu.observe(s));
  addEventListener('scroll', () => { if (scrollY < innerHeight * 0.5) linksMenu.forEach(a => a.classList.remove('ativo')); }, { passive: true });

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

  // ---------- cookies ----------
  // a escolha fica em localStorage ('n3-cookies'). Scripts de estatística e marketing devem ouvir o evento 'cookies'
  // no document e só carregar quando window.n3Cookies.estatistica / .marketing for true.
  const ck = $('[data-ck]');
  if (ck) {
    const ler = () => { try { return JSON.parse(localStorage.getItem('n3-cookies')); } catch (e) { return null; } };
    const por = v => { try { localStorage.setItem('n3-cookies', JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } };
    const pref = $('[data-ck-pref]', ck), ajusta = $('[data-ck-ajusta]', ck), salva = $('[data-ck-salva]', ck), btns = $('[data-ck-btns]', ck);
    const chaves = $$('[data-ck-tipo]', ck);
    const aplica = e => { window.n3Cookies = e; document.dispatchEvent(new CustomEvent('cookies', { detail: e })); };
    const prefs = on => {
      pref.hidden = !on; salva.hidden = !on; btns.hidden = on;
      ajusta.setAttribute('aria-expanded', on); ajusta.textContent = on ? 'Voltar' : 'Escolher quais cookies';
    };
    const mostra = abrePrefs => {
      const e = ler() || {};
      chaves.forEach(c => { c.checked = Boolean(e[c.dataset.ckTipo]); });
      prefs(Boolean(abrePrefs));
      ck.hidden = false; void ck.offsetWidth; ck.classList.add('on');
    };
    const fecha = () => { ck.classList.remove('on'); setTimeout(() => { if (!ck.classList.contains('on')) ck.hidden = true; }, reduz ? 0 : 800); };
    const guarda = (est, mkt) => { const e = { necessarios: true, estatistica: est, marketing: mkt, quando: new Date().toISOString() }; por(e); aplica(e); fecha(); };
    $('[data-ck-todos]', ck).addEventListener('click', () => guarda(true, true));
    $('[data-ck-nec]', ck).addEventListener('click', () => guarda(false, false));
    salva.addEventListener('click', () => guarda(...chaves.map(c => c.checked)));
    ajusta.addEventListener('click', () => prefs(pref.hidden));
    $$('[data-ck-abre]').forEach(b => b.addEventListener('click', () => mostra(true)));
    const salvo = ler();
    if (salvo) aplica(salvo); else setTimeout(() => mostra(false), reduz ? 0 : 1400);
  }

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

/* tema:inicio */
/* ---------- tema claro ou escuro: tampinha que rola entre o sol e a lua ---------- */
(() => {
  const raiz = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const calmo = matchMedia('(prefers-reduced-motion: reduce)');
  let fim;
  const marca = () => {
    document.querySelectorAll('[data-tema-ir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaIr === raiz.dataset.tema)));
    if (meta) meta.content = raiz.dataset.tema === 'claro' ? '#F2F1EC' : '#111210';
  };
  // bolhas de gás saindo da tampinha quando ela para
  const gas = (pilula) => {
    const caixa = pilula.querySelector('.tt-gas');
    if (!caixa || calmo.matches) return;
    for (let i = 0; i < 11; i++) {
      const b = document.createElement('i');
      b.style.setProperty('--sx', (Math.random() * 30 - 15).toFixed(1) + 'px');
      b.style.setProperty('--dx', (Math.random() * 26 - 13).toFixed(1) + 'px');
      b.style.setProperty('--sz', (4 + Math.random() * 7).toFixed(1) + 'px');
      b.style.setProperty('--sobe', (44 + Math.random() * 46).toFixed(0) + 'px');
      b.style.animationDelay = (420 + Math.random() * 260).toFixed(0) + 'ms';
      caixa.appendChild(b);
      setTimeout(() => b.remove(), 2000);
    }
  };
  const aplica = (tema) => {
    raiz.dataset.tema = tema;
    try { localStorage.setItem('n3-tema', tema); } catch (err) { /* sem armazenamento, vale só nesta visita */ }
    marca();
    document.dispatchEvent(new CustomEvent('tema', { detail: { tema } }));
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tema-ir]');
    if (!b || b.dataset.temaIr === raiz.dataset.tema) return;
    const pilula = b.closest('.tema-tampa');
    // a tampinha rola na hora; tema-anim liga o pulinho e a passagem suave das cores
    raiz.classList.add('tema-anim');
    clearTimeout(fim);
    fim = setTimeout(() => raiz.classList.remove('tema-anim'), 900);
    if (pilula) gas(pilula);
    const tema = b.dataset.temaIr;
    if (!document.startViewTransition || calmo.matches) { aplica(tema); return; }
    // a página nova se espalha em círculo a partir da tampinha, como bebida derramando
    const r = (pilula || b).getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    raiz.classList.add('tema-vt');
    const vt = document.startViewTransition(() => aplica(tema));
    vt.ready.then(() => {
      raiz.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + raio + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 900, easing: 'cubic-bezier(.6, 0, .25, 1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => {});
    vt.finished.finally(() => raiz.classList.remove('tema-vt'));
  });
  marca();
})();
/* tema:fim */
