(() => {
  const D = /*DADOS*/;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const raiz = document.documentElement;
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const guarda = {
    ler(k, t = localStorage) { try { return t.getItem(k); } catch (e) { return null; } },
    por(k, v, t = localStorage) { try { t.setItem(k, v); } catch (e) { /* sem armazenamento */ } },
  };
  const sorte = (a, b) => a + Math.random() * (b - a);
  // camélia pequena: cinco pétalas redondas e miolo
  const florSvg = (petala, miolo) => `<svg viewBox="0 0 24 24" width="100%" height="100%">${[[12, 4.4], [19.2, 9.6], [16.5, 18.2], [7.5, 18.2], [4.8, 9.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.4" fill="${petala}"/>`).join('')}<circle cx="12" cy="12" r="3.3" fill="${miolo}"/></svg>`;
  const cores = [['#6B2234', '#B99D70'], ['#EFD9D4', '#6B2234'], ['#B99D70', '#4A1624'], ['#C9798A', '#F8F5F2'], ['#4A1624', '#EFD9D4']];

  // ---------- abertura: três frases que surgem com desfoque, depois a cortina sobe ----------
  const abertura = $('#abertura');
  if (raiz.classList.contains('intro') && abertura) {
    const frase = $('.abertura-frase', abertura);
    const cada = 1150;
    const timers = [];
    let fim = false;
    const termina = () => {
      if (fim) return;
      fim = true;
      timers.forEach(clearTimeout);
      guarda.por('camelia-intro', '1', sessionStorage);
      abertura.classList.add('sobe');
      raiz.classList.add('pos-intro');
      setTimeout(() => { raiz.classList.remove('intro'); abertura.remove(); }, 800);
    };
    const mostra = (i) => {
      const [t, cor] = D.intro[i];
      frase.textContent = t;
      frase.dataset.cor = cor;
      frase.classList.remove('vai');
      void frase.offsetWidth;
      frase.classList.add('vai');
    };
    abertura.addEventListener('click', termina);
    addEventListener('keydown', termina, { once: true });
    D.intro.forEach((_, i) => timers.push(setTimeout(() => mostra(i), 250 + i * cada)));
    timers.push(setTimeout(termina, 250 + D.intro.length * cada));
  } else if (abertura) abertura.remove();

  // ---------- flores que se espalham onde a pessoa toca ou clica ----------
  if (!calmo) {
    let camada = null;
    addEventListener('pointerdown', (e) => {
      if (e.button > 0 || raiz.classList.contains('intro')) return;
      if (!camada || !camada.isConnected) {
        camada = document.createElement('div');
        camada.className = 'flores-clique';
        document.body.appendChild(camada);
      }
      const n = 14 + Math.floor(Math.random() * 6);
      for (let i = 0; i < n; i++) {
        const el = document.createElement('i');
        const ang = Math.random() * Math.PI * 2, dist = sorte(46, 130);
        const [p, m] = cores[Math.floor(Math.random() * cores.length)];
        const tam = sorte(7, 15);
        el.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${tam}px;height:${tam}px;--tx:${(Math.cos(ang) * dist).toFixed(1)}px;--ty:${(Math.sin(ang) * dist + sorte(36, 76)).toFixed(1)}px;--rot:${Math.round(sorte(-320, 320))}deg;--sc:${sorte(.7, 1.35).toFixed(2)};animation-duration:${Math.round(sorte(900, 1550))}ms`;
        el.innerHTML = florSvg(p, m);
        el.addEventListener('animationend', () => el.remove());
        camada.appendChild(el);
      }
    }, { passive: true });
  }

  // ---------- brilhos na capa: lascas de ouro e camélias piscando em volta, longe do rosto ----------
  const brilhos = $('[data-brilhos]');
  if (brilhos && !calmo) {
    const cel = matchMedia('(max-width: 900px)').matches;
    // caixa aproximada do rosto na foto da capa, em % da área da foto
    const rosto = cel ? { x0: 30, x1: 96, y0: 14, y1: 52 } : { x0: 34, x1: 98, y0: 14, y1: 50 };
    const noRosto = (x, y) => x > rosto.x0 && x < rosto.x1 && y > rosto.y0 && y < rosto.y1;
    const ouro = ['#D9B56E', '#B99D70', '#F1DDB4', '#C9798A', '#EFD9D4'];
    for (let i = 0; i < 30; i++) {
      let x, y, t = 0;
      do { x = sorte(4, 96); y = sorte(4, 94); t++; } while (noRosto(x, y) && t < 24);
      if (noRosto(x, y)) continue;
      const el = document.createElement('i');
      const flor = i % 4 === 0;
      const tam = flor ? sorte(13, 22) : sorte(9, 18);
      el.className = flor ? 'brilho brilho-flor' : 'brilho';
      el.style.cssText = `left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;width:${tam.toFixed(0)}px;height:${tam.toFixed(0)}px;animation-duration:${sorte(2.6, 5.2).toFixed(2)}s;animation-delay:${(-sorte(0, 5)).toFixed(2)}s;--brilho:${ouro[i % ouro.length]}`;
      if (flor) el.innerHTML = florSvg(ouro[i % ouro.length], '#6B2234');
      else {
        // lasca de ouro: polígono irregular, desenho próprio da marca
        const lados = 5 + (i % 2), pts = [];
        for (let k = 0; k < lados; k++) { const a = (k / lados) * Math.PI * 2 + sorte(0, .5), r = sorte(5, 11); pts.push(`${(12 + Math.cos(a) * r).toFixed(1)},${(12 + Math.sin(a) * r).toFixed(1)}`); }
        el.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%"><polygon points="${pts.join(' ')}" fill="${ouro[i % ouro.length]}"/></svg>`;
      }
      brilhos.appendChild(el);
    }
  }

  // ---------- camélias flutuando devagar no fundo das seções escuras ----------
  if (!calmo) {
    const pontos = [[8, 14], [86, 10], [22, 46], [74, 36], [6, 72], [92, 62], [44, 18], [60, 80], [18, 90], [84, 88], [50, 52], [34, 70]];
    $$('[data-flutuam]').forEach((camada) => pontos.forEach(([x, y], i) => {
      const el = document.createElement('i');
      const tam = Math.round(sorte(12, 24));
      el.style.cssText = `left:${x}%;top:${y}%;width:${tam}px;height:${tam}px;opacity:${sorte(.22, .5).toFixed(2)};animation-name:flutua${'abc'[i % 3]};animation-duration:${sorte(11, 20).toFixed(1)}s;animation-delay:-${sorte(0, 10).toFixed(1)}s`;
      el.innerHTML = florSvg(['#8E3149', '#B99D70', '#C9798A'][i % 3], ['#B99D70', '#4A1624', '#EFD9D4'][i % 3]);
      camada.appendChild(el);
    }));
  }

  // ---------- segmentos pelo link (?seg=facial,corporal) ----------
  const pedido = new URLSearchParams(location.search).get('seg');
  if (pedido) {
    const ok = pedido.split(',').map((s) => s.trim()).filter(Boolean);
    const todos = [...new Set($$('[data-seg]').map((el) => el.dataset.seg))];
    if (ok.some((s) => todos.includes(s))) {
      $$('[data-seg]').forEach((el) => { if (!ok.includes(el.dataset.seg)) el.remove(); });
      const ab = $('.abas');
      if (ab) ab.style.setProperty('--n', ab.children.length);
    }
  }

  // ---------- tratamentos: abas por segmento ----------
  const abas = $$('.aba');
  const ativaAba = (aba, foco, animar) => {
    abas.forEach((a) => {
      const sim = a === aba;
      a.setAttribute('aria-selected', String(sim));
      a.tabIndex = sim ? 0 : -1;
      const p = document.getElementById(a.getAttribute('aria-controls'));
      if (!p) return;
      p.hidden = !sim;
      // a lista da aba nova entra em cascata
      const ul = $('.trat-lista', p);
      if (sim && animar && ul) { ul.classList.remove('visto'); void ul.offsetWidth; ul.classList.add('visto'); }
    });
    if (foco) aba.focus();
  };
  if (abas.length) {
    ativaAba(abas.find((a) => a.getAttribute('aria-selected') === 'true') || abas[0]);
    abas.forEach((a, i) => {
      a.addEventListener('click', () => { if (a.getAttribute('aria-selected') !== 'true') ativaAba(a, false, true); });
      a.addEventListener('keydown', (e) => {
        const passo = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (passo) { e.preventDefault(); ativaAba(abas[(i + passo + abas.length) % abas.length], true, true); }
      });
    });
    $$('a[href^="#seg-"]').forEach((l) => l.addEventListener('click', (e) => {
      const aba = abas.find((a) => a.getAttribute('aria-controls') === l.getAttribute('href').slice(1));
      if (!aba) return;
      e.preventDefault();
      ativaAba(aba, false, true);
      $('#tratamentos').scrollIntoView({ behavior: calmo ? 'auto' : 'smooth' });
    }));
  }

  // ---------- antes e depois: cada cartão tem a própria cortina ----------
  $$('.ad-palco').forEach((palco) => {
    const range = $('.ad-range', palco);
    let mexeu = false;
    const poe = (v) => palco.style.setProperty('--p', `${v}%`);
    range.addEventListener('input', () => { mexeu = true; poe(range.value); });
    range.addEventListener('pointerdown', () => { mexeu = true; });
    if (calmo || !('IntersectionObserver' in window)) return;
    // na primeira vez que aparece, a cortina balança para mostrar que dá para arrastar
    const vai = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      vai.disconnect();
      const ini = performance.now() + 700 + Math.random() * 400, dur = 2000;
      const passo = (t) => {
        if (mexeu) return;
        const p = Math.max(0, Math.min((t - ini) / dur, 1));
        const v = 50 + Math.sin(p * Math.PI * 2) * 20 * (1 - p * .35);
        poe(Math.round(v * 10) / 10);
        range.value = v;
        if (p < 1) requestAnimationFrame(passo); else poe(50);
      };
      requestAnimationFrame(passo);
    }, { threshold: .6 });
    vai.observe(palco);
  });

  // ---------- aberto agora ----------
  const nomes = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const hm = (h) => `${Math.floor(h)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;
  const agora = new Date();
  const dia = agora.getDay();
  const hora = agora.getHours() + agora.getMinutes() / 60;
  const hoje = D.abertura[dia];
  let status;
  if (hoje && hora >= hoje[0] && hora < hoje[1]) status = `Aberto agora, até as ${hm(hoje[1])}`;
  else if (hoje && hora < hoje[0]) status = `Abre hoje às ${hm(hoje[0])}`;
  else {
    let d = dia, n = 0;
    do { d = (d + 1) % 7; n++; } while (!D.abertura[d] && n < 7);
    status = `Fechado agora. Abre ${n === 1 ? 'amanhã' : nomes[d]} às ${hm(D.abertura[d][0])}`;
  }
  $$('[data-status]').forEach((el) => { el.textContent = status; });
  const tr = $(`.horas [data-linha="${dia === 0 ? 2 : dia === 6 ? 1 : 0}"]`);
  if (tr) tr.classList.add('hoje');
  $$('[data-ano]').forEach((el) => { el.textContent = agora.getFullYear(); });

  // ---------- tema claro e escuro ----------
  const btnTema = $('.tema-btn');
  const marcaTema = () => {
    const escuro = raiz.dataset.tema === 'escuro';
    btnTema.setAttribute('aria-pressed', String(escuro));
    btnTema.setAttribute('aria-label', escuro ? 'Ativar tema claro' : 'Ativar tema escuro');
    btnTema.title = escuro ? 'Tema claro' : 'Tema escuro';
  };
  const aplicaTema = (escuro) => {
    if (escuro) raiz.dataset.tema = 'escuro'; else delete raiz.dataset.tema;
    guarda.por('camelia-tema', escuro ? 'escuro' : 'claro');
    marcaTema();
  };
  marcaTema();
  btnTema.addEventListener('click', () => {
    const escuro = raiz.dataset.tema !== 'escuro';
    if (document.startViewTransition && !calmo) {
      const r = btnTema.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = document.startViewTransition(() => aplicaTema(escuro));
      vt.ready.then(() => raiz.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${raio}px at ${x}px ${y}px)`] },
        { duration: 850, easing: 'cubic-bezier(.22, .7, .2, 1)', pseudoElement: '::view-transition-new(root)' },
      )).catch(() => {});
    } else {
      if (!calmo) raiz.classList.add('tema-anim');
      aplicaTema(escuro);
      setTimeout(() => raiz.classList.remove('tema-anim'), 700);
    }
  });

  // ---------- topo e menu ----------
  const topo = $('#topo');
  const rolou = () => topo.classList.toggle('rolou', scrollY > 10);
  addEventListener('scroll', rolou, { passive: true });
  rolou();
  const btnMenu = $('.menu-btn');
  const fechaMenu = () => { topo.classList.remove('aberto'); btnMenu.setAttribute('aria-expanded', 'false'); btnMenu.setAttribute('aria-label', 'Abrir menu'); };
  btnMenu.addEventListener('click', () => {
    const abre = !topo.classList.contains('aberto');
    topo.classList.toggle('aberto', abre);
    btnMenu.setAttribute('aria-expanded', String(abre));
    btnMenu.setAttribute('aria-label', abre ? 'Fechar menu' : 'Abrir menu');
  });
  $$('#menu a').forEach((a) => a.addEventListener('click', fechaMenu));

  // ---------- revelar na rolagem ----------
  // textos sobem; fotos saem de um zoom leve; cartões entram entrelaçados, alternando o lado e com um giro pequeno
  const alvos = [
    ...$$('.sec-topo > *, .medos-fecho, .seg-chamada, .pagar > div, .trat-fim, .ad-aviso, .sobre-txt > :not(.sobre-cit):not(.seguro), .seguro > div, .ag-lado > *, .form, .rodape-mapa > *'),
    ...$$('[data-cartao]'),
    ...$$('.sec .foto, .sobre-foto'),
  ].filter((el, i, a) => a.indexOf(el) === i && !el.closest('.capa') && !el.closest('.galeria'));
  const porPai = new Map();
  alvos.forEach((el) => {
    const pai = el.parentElement;
    const i = porPai.get(pai) || 0;
    porPai.set(pai, i + 1);
    if (el.matches('[data-cartao]')) { el.classList.add('rv', 'rv-cartao'); el.style.setProperty('--lado', i % 2 ? 1 : -1); el.style.setProperty('--d', `${Math.min(i * 110, 660)}ms`); }
    else if (el.matches('.foto, .sobre-foto')) { el.classList.add('rv', 'rv-foto'); el.style.setProperty('--d', `${Math.min(i * 60, 300)}ms`); }
    else { el.classList.add('rv'); el.style.setProperty('--d', `${Math.min(i * 60, 300)}ms`); }
  });
  // depois que entrou, o cartão passa a usar transições curtas, para o hover responder na hora
  alvos.forEach((el) => el.addEventListener('transitionend', (e) => {
    if (e.target === el && e.propertyName === 'transform' && el.classList.contains('visto')) el.classList.add('pronto');
  }));
  const linhas = $$('[data-linha], .trat-lista');
  if ('IntersectionObserver' in window && !calmo) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    [...alvos, ...linhas].forEach((el) => io.observe(el));
  } else [...alvos, ...linhas].forEach((el) => el.classList.add('visto'));

  // ---------- grupos com a mesma largura ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    g.style.removeProperty('--larg');
    const m = Math.max(...[...g.children].map((c) => c.scrollWidth));
    if (m > 0) g.style.setProperty('--larg', `${Math.ceil(m) + 2}px`);
  });
  iguala();
  if (document.fonts) document.fonts.ready.then(iguala);
  addEventListener('resize', iguala);

  // ---------- janelas dos termos ----------
  $$('[data-doc]').forEach((b) => b.addEventListener('click', () => { const d = $(`#doc-${b.dataset.doc}`); if (d && d.showModal) d.showModal(); }));
  $$('dialog.doc').forEach((d) => {
    $('[data-fecha]', d).addEventListener('click', () => d.close());
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });

  // ---------- cookies ----------
  const ck = $('#cookies');
  const CK = 'camelia-cookies';
  const marcaCk = () => raiz.classList.toggle('ck', !ck.hidden);
  if (!guarda.ler(CK)) ck.hidden = false;
  marcaCk();
  $$('[data-ck]').forEach((b) => b.addEventListener('click', () => { guarda.por(CK, b.dataset.ck); ck.hidden = true; marcaCk(); }));
  $$('[data-cookies]').forEach((b) => b.addEventListener('click', () => { ck.hidden = false; marcaCk(); $('[data-ck]', ck).focus(); }));

  // ---------- formulário ----------
  const form = $('#form');
  const erro = $('#form-erro');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const nome = (f.get('nome') || '').trim();
    const whats = (f.get('whats') || '').replace(/\D/g, '');
    const falta = [];
    if (!nome) falta.push('seu nome');
    if (whats.length < 10) falta.push('um WhatsApp com DDD');
    if (!f.get('ok_lgpd')) falta.push('a autorização de contato');
    $$('.campo, .check', form).forEach((c) => c.classList.remove('erro'));
    if (falta.length) {
      if (!nome) form.nome.closest('.campo').classList.add('erro');
      if (whats.length < 10) form.whats.closest('.campo').classList.add('erro');
      if (!f.get('ok_lgpd')) form.ok_lgpd.closest('.check').classList.add('erro');
      erro.textContent = `Falta ${falta.join(', ').replace(/, ([^,]*)$/, ' e $1')}.`;
      erro.hidden = false;
      (form.querySelector('.erro input') || form.nome).focus();
      return;
    }
    erro.hidden = true;
    const l = [
      `Olá! Quero agendar na ${D.nome}.`, '',
      `Nome: ${nome}`, `WhatsApp: ${f.get('whats')}`,
      `Tratamento: ${f.get('trat')}`, `Melhor período: ${f.get('periodo')}`, '',
      'Li a política de privacidade e autorizo o contato.',
    ];
    if (f.get('ok_news')) l.push('Aceito receber horários livres e novidades.');
    window.open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(l.join('\n'))}`, '_blank', 'noopener');
  });
})();
