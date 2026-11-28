// Ortiva Premium: interações das cinco páginas. Sem biblioteca.
// Carregando e cortina entre páginas, topo, agenda fiscal "ao vivo", títulos palavra por palavra, máscaras de foto,
// rolagem com direção (--p e --q), faixa horizontal das frentes, gráfico 3D, leque da equipe, pilha de depoimentos,
// carrossel, galeria, filtros, simulador de regime, agendamento, formulários, cookies, cursor e botões magnéticos.
// O script do tema é acrescentado pelo build.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const raiz = document.documentElement;
  const D = JSON.parse($('#pr-dados').textContent);
  const parado = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const comMouse = matchMedia('(hover: hover) and (pointer: fine)').matches;
  // cursor próprio e magnetismo só no computador: na prévia de celular com mouse ficam desligados
  const telaGrande = matchMedia('(min-width: 1025px)').matches;
  const limita = (v) => Math.max(0, Math.min(1, v));
  const suave = (k) => 1 - Math.pow(1 - k, 3);
  const guarda = {
    ler(k, padrao) { try { return JSON.parse(localStorage.getItem(k)) ?? padrao; } catch (e) { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento, vale só nesta visita */ } },
  };
  const sessao = {
    ler(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    gravar(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* idem */ } },
  };
  const wa = (msg) => `https://wa.me/${D.wa}?text=${encodeURIComponent(msg)}`;
  const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const RELOGIO = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5h4"/></svg>';

  // ---------- carregando (uma vez por visita): o contador chega a 100 junto com o prumo ----------
  const libera = () => { raiz.classList.add('pronto'); dispatchEvent(new Event('ortiva:pronto')); };
  const cg = $('.carregando');
  if (raiz.classList.contains('sem-cg') || !cg) libera();
  else {
    sessao.gravar('ortiva-cg', '1');
    const num = $('[data-cg-num]', cg);
    const t0 = performance.now();
    const MIN = 2500;
    const conta = (t) => { const k = limita((t - t0) / MIN); num.textContent = Math.round(suave(k) * 100); if (k < 1) requestAnimationFrame(conta); };
    requestAnimationFrame(conta);
    const fecha = () => setTimeout(() => {
      cg.classList.add('sai');
      setTimeout(libera, 250);
      setTimeout(() => cg.remove(), 1200);
    }, Math.max(0, MIN + 150 - (performance.now() - t0)));
    Promise.race([
      Promise.all([document.fonts.ready, new Promise((ok) => (document.readyState === 'complete' ? ok() : addEventListener('load', ok, { once: true })))]),
      new Promise((ok) => setTimeout(ok, 4200)),
    ]).then(fecha);
  }

  // ---------- cortina entre páginas: sobe ao sair e continua subindo na página seguinte ----------
  if (raiz.classList.contains('chegando')) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      raiz.classList.add('chegou');
      raiz.classList.remove('chegando');
      setTimeout(() => raiz.classList.remove('chegou'), 1000);
    }));
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || parado || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname) return; // âncora na mesma página: rolagem normal
    e.preventDefault();
    raiz.classList.add('saindo');
    sessao.gravar('ortiva-troca', '1');
    setTimeout(() => { location.href = url.href; }, 620);
  });
  addEventListener('pageshow', (e) => { if (e.persisted) raiz.classList.remove('saindo', 'chegando', 'chegou'); });

  // ---------- topo: fica sólido ao rolar, some descendo e volta subindo ----------
  const topo = $('[data-topo]');
  const menuBtn = $('[data-menu]');
  const menu = $('#menu-cel');
  let menuAberto = false;
  // o menu fica sempre no HTML: a classe abre a cortina e o inert tira o conteúdo do teclado e do leitor de tela quando fechado
  const abreMenu = (abrir) => {
    menuAberto = abrir;
    menuBtn.setAttribute('aria-expanded', String(abrir));
    menuBtn.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('visivel', abrir);
    menu.inert = !abrir;
    raiz.classList.toggle('menu-aberto', abrir);
    topo.classList.toggle('rolou', abrir || scrollY > 10);
  };
  menuBtn.addEventListener('click', () => abreMenu(!menuAberto));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) abreMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuAberto) { abreMenu(false); menuBtn.focus(); } });

  // ---------- aberto agora ----------
  const hm = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const fala = (t) => t.replace(/^0/, '').replace(':00', 'h').replace(':', 'h');
  const status = () => {
    const agora = new Date();
    const hoje = D.horario[agora.getDay()];
    const min = agora.getHours() * 60 + agora.getMinutes();
    if (hoje && min >= hm(hoje[0]) && min < hm(hoje[1])) return `${RELOGIO}<span><b>Aberto agora</b>, até ${fala(hoje[1])}</span>`;
    for (let i = 0; i < 7; i++) {
      const d = new Date(agora); d.setDate(d.getDate() + i);
      const h = D.horario[d.getDay()];
      if (!h || (i === 0 && min >= hm(h[0]))) continue;
      const quando = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : d.toLocaleDateString('pt-BR', { weekday: 'long' });
      return `${RELOGIO}<span>Fechado agora. Abre ${quando} às ${fala(h[0])}</span>`;
    }
    return '';
  };
  $$('[data-aberto]').forEach((el) => { el.innerHTML = status(); el.classList.toggle('sim', el.innerHTML.includes('Aberto')); });
  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // ---------- agenda fiscal "ao vivo": os três próximos vencimentos gerais a partir de hoje ----------
  const av = $('[data-av-lista]');
  if (av) {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const proximos = D.agendaFiscal.map((o) => {
      const d = new Date(hoje.getFullYear(), hoje.getMonth(), o.dia);
      if (d < hoje) d.setMonth(d.getMonth() + 1);
      return { ...o, d, falta: Math.round((d - hoje) / 864e5) };
    }).sort((a, b) => a.falta - b.falta).slice(0, 3);
    av.innerHTML = proximos.map((o) => `<li class="${o.falta === 0 ? 'hoje' : ''}"><b>${o.nome}</b><span>${o.falta === 0 ? 'hoje' : o.falta === 1 ? 'amanhã' : `em ${o.falta} dias`}</span><small>${o.quem}, dia ${o.dia}</small></li>`).join('');
  }

  // ---------- títulos: separa as palavras (mantendo o <em>) para subirem uma a uma ----------
  let k = 0;
  const divide = (el) => {
    [...el.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const pal = document.createElement('span'); pal.className = 'pal';
          const dentro = document.createElement('span'); dentro.textContent = p; dentro.style.setProperty('--k', k++);
          pal.appendChild(dentro); frag.appendChild(pal);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) divide(n);
    });
  };
  $$('.palavras').forEach((el) => { k = 0; divide(el); });

  // liga ao entrar e desliga ao sair por qualquer borda: títulos, fotos e números refazem o efeito
  const contar = (el, liga) => {
    const fim = Number(el.dataset.conta ?? el.dataset.contaMoeda);
    const moeda = 'contaMoeda' in el.dataset;
    const ini = el.hasAttribute('data-ano-conta') ? fim - 15 : 0;
    const mostra = (v) => { el.textContent = moeda ? reais.format(v) : Math.round(v); };
    cancelAnimationFrame(el._raf);
    if (!liga) { mostra(ini); return; }
    const t0 = performance.now();
    const passo = (t) => { const q = limita((t - t0) / 1400); mostra(ini + (fim - ini) * suave(q)); if (q < 1) el._raf = requestAnimationFrame(passo); };
    el._raf = requestAnimationFrame(passo);
  };
  const alvos = $$('.palavras, .revela, [data-conta], [data-conta-moeda]');
  if (parado) alvos.forEach((el) => el.classList.add('visto'));
  else {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      const el = en.target;
      el.classList.toggle('visto', en.isIntersecting);
      if (el.matches('[data-conta], [data-conta-moeda]')) contar(el, en.isIntersecting);
    }), { rootMargin: '0px 0px -6% 0px', threshold: 0.12 });
    const comeca = () => alvos.forEach((el) => io.observe(el));
    if (raiz.classList.contains('pronto')) comeca(); else addEventListener('ortiva:pronto', comeca, { once: true });
  }

  // ---------- frentes: a faixa anda de lado enquanto a página desce (só no computador) ----------
  const frentes = $('[data-frentes]');
  const trilhoH = $('[data-trilho-h]');
  let distH = 0;
  const medeFrentes = () => {
    if (!frentes) return;
    if (innerWidth > 900 && !parado) {
      distH = Math.max(0, trilhoH.scrollWidth - innerWidth);
      frentes.style.height = `${Math.max(innerHeight, 660) + distH}px`;
    } else { distH = 0; frentes.style.height = ''; trilhoH.style.removeProperty('--x'); }
  };
  medeFrentes();

  // ---------- a história na rolagem: --p (entrada por baixo) e --q (saída por cima) em cada bloco ----------
  const CENAS = [
    ['.sec-cab > p, .sec-cab > .apoio, .sec-cab > .btn, .sec-cab .filtro, .sec-cab .pol-abas, .serv-cab .filtro, .blog .filtro', 'cena'],
    ['.numeros > div, .visao-txt > p, .visao-txt > .btn, .simc-txt > p, .simc-txt > .btn, .comp, .eqh-mais, .ch-mais', 'cena'],
    ['.painel-palco, .simc-barras, .carrossel, .sim', 'cena-zoom'],
    ['.ft-etapa, .condicoes, .ag-resumo', 'cena-lado'],
    ['.depo-txt > p, .pilha-ctrl, .art, .final .apoio, .final-btns', 'cena'],
    ['.contato-txt > p, .contato-canais li, .form:not(.ag-form):not(.news-form)', 'cena'],
    ['.sobre-txt p, .valor, .ef-txt > p, .gal-grade li, .insta-grade li, .insta-link, .pol-paineis, .cwb-in > p', 'cena'],
    ['.nomes li, .pf-txt > :not(h2), .ficha, .ag-form > *, .faq-item, .news-in > p, .news-form', 'cena'],
    ['.mapa-linha > *, .rod-cols > div, .rod-legal > *, .rod-marca > *', 'cena'],
  ];
  const cenas = [];
  if (!parado) {
    CENAS.forEach(([sel, cls]) => $$(sel).forEach((el) => {
      if (el.closest('.capa, .frentes-pin, .cookies, dialog') || el.classList.contains('cena') || el.classList.contains('cena-lado') || el.classList.contains('cena-zoom')) return;
      el.classList.add(cls);
      // irmãos lado a lado entram em sequência: o atraso vira distância de rolagem
      const irmaos = [...el.parentElement.children].filter((x) => x.classList.contains(cls));
      cenas.push({ el, atraso: Math.min(irmaos.indexOf(el), 6) * 0.035 });
    }));
  }
  const capaFoto = $('[data-capa-foto]');
  const palco3d = $('[data-palco3d]');
  const simcBarras = $('.simc-barras');
  const leque = $('[data-leque]');
  const fios = $$('[data-fio]');
  const frase = $('[data-frase]');
  const cwb = $('.cwb-foto');
  const progFrentes = $('.frentes-prog');
  if (frase) {
    const destaque = ['reto.', 'alinhado,', 'entorte.'];
    frase.innerHTML = frase.textContent.trim().split(/\s+/).map((p) => `<span${destaque.includes(p) ? ' class="destaque"' : ''}>${p}</span>`).join(' ');
  }
  const palavrasFrase = frase ? $$('span', frase) : [];
  // entrada e saída de um bloco grande, para crescer e encolher com a rolagem
  const presenca = (r, vh) => suave(Math.min(limita((vh * 0.95 - r.top) / (vh * 0.55)), limita((r.bottom - vh * 0.05) / (vh * 0.5))));

  let pedido = false, ultimoY = scrollY;
  raiz.dataset.rolagem = 'desce';
  const rola = () => {
    pedido = false;
    const vh = innerHeight, y = scrollY;
    if (Math.abs(y - ultimoY) > 2) {
      const desce = y > ultimoY;
      raiz.dataset.rolagem = desce ? 'desce' : 'sobe';
      if (!menuAberto) topo.classList.toggle('some', desce && y > 300);
      ultimoY = y;
    }
    topo.classList.toggle('rolou', y > 10 || menuAberto);
    // primeiro lê tudo, depois escreve, para não forçar o layout a cada elemento
    const leituras = cenas.map(({ el, atraso }) => { const r = el.getBoundingClientRect(); return [el, r, atraso]; });
    for (const [el, r, atraso] of leituras) {
      if (r.width === 0 && r.height === 0) { el.style.setProperty('--p', 1); el.style.setProperty('--q', 1); continue; }
      const p = limita((vh * (1.01 - atraso) - r.top) / (vh * 0.3));
      const q = limita((r.bottom - vh * 0.02) / (vh * 0.3));
      el.style.setProperty('--p', suave(p).toFixed(3));
      el.style.setProperty('--q', suave(q).toFixed(3));
    }
    if (capaFoto && !parado) capaFoto.style.setProperty('--h', limita(y / (vh * 0.8)).toFixed(3));
    if (frentes && distH) {
      const r = frentes.getBoundingClientRect();
      const k2 = limita(-r.top / distH);
      trilhoH.style.setProperty('--x', `${(-k2 * distH).toFixed(1)}px`);
      progFrentes?.style.setProperty('--fp', k2.toFixed(3));
    }
    if (palco3d && !parado) palco3d.style.setProperty('--cresce', presenca(palco3d.getBoundingClientRect(), vh).toFixed(3));
    if (simcBarras && !parado) simcBarras.style.setProperty('--cresce', presenca(simcBarras.getBoundingClientRect(), vh).toFixed(3));
    if (leque && !parado && innerWidth > 900) leque.style.setProperty('--abre', presenca(leque.getBoundingClientRect(), vh).toFixed(3));
    fios.forEach((l) => {
      const r = l.getBoundingClientRect();
      const meio = vh * 0.6;
      l.style.setProperty('--prog', parado ? 1 : limita((meio - r.top) / r.height).toFixed(3));
      $$('[data-etapa]', l).forEach((et) => et.classList.toggle('ativa', parado || et.getBoundingClientRect().top < meio));
    });
    if (frase) {
      const r = frase.getBoundingClientRect();
      const n = Math.round((parado ? 1 : limita((vh * 0.85 - r.top) / (r.height + vh * 0.35))) * palavrasFrase.length);
      palavrasFrase.forEach((w, i) => w.classList.toggle('aceso', i < n));
    }
    if (cwb && !parado) { const r = cwb.parentElement.getBoundingClientRect(); cwb.style.setProperty('--py', `${((r.top + r.height / 2 - vh / 2) * -0.12).toFixed(1)}px`); }
  };
  addEventListener('scroll', () => { if (!pedido) { pedido = true; requestAnimationFrame(rola); } }, { passive: true });
  addEventListener('resize', () => { medeFrentes(); rola(); });
  addEventListener('load', () => { medeFrentes(); rola(); });
  if ('ResizeObserver' in window) { let ro = false; new ResizeObserver(() => { if (!ro) { ro = true; requestAnimationFrame(() => { ro = false; rola(); }); } }).observe($('main')); }
  rola();

  // ---------- faixa corrida: anda para a esquerda descendo e para a direita subindo ----------
  const faixa = $('.faixa-in');
  if (faixa && !parado) {
    let x = 0, ativo = false, ultimo = scrollY, impulso = 0;
    const copia = () => faixa.scrollWidth / 4;
    new IntersectionObserver(([en]) => { ativo = en.isIntersecting; if (ativo) requestAnimationFrame(anda); }).observe(faixa);
    function anda() {
      const dir = raiz.dataset.rolagem === 'sobe' ? -1 : 1;
      impulso = impulso * 0.9 + Math.abs(scrollY - ultimo) * 0.15;
      ultimo = scrollY;
      x = (x + dir * (0.6 + impulso)) % copia();
      if (x < 0) x += copia();
      faixa.style.transform = `translate3d(${-x}px, 0, 0)`;
      if (ativo) requestAnimationFrame(anda);
    }
  }

  // ---------- gráfico 3D: gira seguindo o mouse ----------
  if (palco3d && comMouse && !parado) {
    palco3d.addEventListener('pointermove', (e) => {
      const r = palco3d.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      palco3d.style.setProperty('--rz', `${(-38 + px * 26).toFixed(1)}deg`);
      palco3d.style.setProperty('--rx', `${(58 - py * 14).toFixed(1)}deg`);
    });
    palco3d.addEventListener('pointerleave', () => { palco3d.style.removeProperty('--rz'); palco3d.style.removeProperty('--rx'); });
  }

  // ---------- fotos dos perfis inclinam com o mouse ----------
  if (comMouse && !parado) {
    $$('[data-inclina]').forEach((f) => {
      f.addEventListener('pointermove', (e) => {
        const r = f.getBoundingClientRect();
        f.style.setProperty('--iy', `${(((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(1)}deg`);
        f.style.setProperty('--ix', `${(((e.clientY - r.top) / r.height - 0.5) * -10).toFixed(1)}deg`);
      });
      f.addEventListener('pointerleave', () => { f.style.removeProperty('--iy'); f.style.removeProperty('--ix'); });
    });
  }

  // ---------- profissionais: a foto segue o mouse sobre os nomes; índice acompanha a leitura ----------
  const nomes = $('[data-nomes]');
  const nFlutua = $('[data-nomes-flutua]');
  if (nomes && nFlutua && comMouse && !parado) {
    const img = $('img', nFlutua);
    let ax = 0, ay = 0, x = 0, y = 0, rodando = false;
    const anda = () => {
      x += (ax - x) * 0.14; y += (ay - y) * 0.14;
      nFlutua.style.transform = `translate(${x}px, ${y}px)`;
      rodando = nFlutua.classList.contains('ver') || Math.abs(ax - x) > 0.5;
      if (rodando) requestAnimationFrame(anda);
    };
    nomes.addEventListener('mousemove', (e) => {
      ax = e.clientX + 30; ay = e.clientY - 150;
      if (!rodando) { x = ax; y = ay; rodando = true; requestAnimationFrame(anda); }
    });
    $$('a', nomes).forEach((a) => a.addEventListener('mouseenter', () => { img.src = a.dataset.foto; nFlutua.classList.add('ver'); }));
    nomes.addEventListener('mouseleave', () => nFlutua.classList.remove('ver'));
  }
  const indice = $('[data-indice]');
  if (indice) {
    const links = $$('a', indice);
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.setAttribute('aria-current', String(a.hash === `#${en.target.id}`)));
      const ativo = links.find((a) => a.hash === `#${en.target.id}`);
      if (ativo && indice.scrollWidth > indice.clientWidth) indice.scrollTo({ left: ativo.offsetLeft - 16, behavior: parado ? 'auto' : 'smooth' });
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('.perfil').forEach((p) => io.observe(p));
  }

  // ---------- faixas de lado no celular (frentes e equipe): setas, dedo e arraste com o mouse ----------
  $$('[data-lado]').forEach((b) => b.addEventListener('click', () => {
    const faixa = $(b.dataset.alvo);
    const item = faixa.querySelector('li');
    const passo = item ? item.getBoundingClientRect().width + 14 : faixa.clientWidth * 0.8;
    faixa.scrollBy({ left: Number(b.dataset.lado) * passo, behavior: parado ? 'auto' : 'smooth' });
  }));
  $$('.frentes-janela, .leque').forEach((faixa) => {
    let x0 = null, inicio = 0, moveu = false;
    faixa.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || faixa.scrollWidth <= faixa.clientWidth) return;
      x0 = e.clientX; inicio = faixa.scrollLeft; moveu = false;
    });
    addEventListener('pointermove', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 5 && !moveu) { moveu = true; faixa.classList.add('arrastando-lado'); }
      if (moveu) faixa.scrollLeft = inicio - dx;
    });
    addEventListener('pointerup', () => {
      if (x0 === null) return;
      x0 = null;
      if (!moveu) return;
      // devolve o encaixe no card mais próximo depois de soltar
      const fim = faixa.scrollLeft;
      faixa.classList.remove('arrastando-lado');
      faixa.scrollLeft = fim;
    });
    // arrastar não pode abrir o link do card
    faixa.addEventListener('click', (e) => { if (moveu) { e.preventDefault(); e.stopPropagation(); moveu = false; } }, true);
    faixa.addEventListener('dragstart', (e) => e.preventDefault());
  });

  // ---------- carrossel: setas, barras, arrastar, pausa com o mouse ----------
  $$('[data-carrossel]').forEach((car) => {
    const trilho = $('[data-trilho]', car);
    const slides = [...trilho.children];
    const barras = $$('[data-ir]', car);
    const DUR = 5000;
    let atual = 0, timer, inicioX = null, delta = 0;
    car.style.setProperty('--dur', `${DUR}ms`);
    const vai = (i) => {
      atual = (i + slides.length) % slides.length;
      trilho.style.translate = `${-atual * 100}% 0`;
      slides.forEach((s, j) => { s.classList.toggle('atual', j === atual); s.setAttribute('aria-hidden', String(j !== atual)); });
      barras.forEach((b, j) => {
        b.classList.toggle('feito', j < atual);
        b.classList.remove('atual'); void b.offsetWidth;
        b.classList.toggle('atual', j === atual);
        b.setAttribute('aria-current', String(j === atual));
      });
      agenda();
    };
    const agenda = () => { clearTimeout(timer); if (!parado && !car.classList.contains('pausado')) timer = setTimeout(() => vai(atual + 1), DUR); };
    $('[data-ant]', car).addEventListener('click', () => vai(atual - 1));
    $('[data-prox]', car).addEventListener('click', () => vai(atual + 1));
    barras.forEach((b) => b.addEventListener('click', () => vai(Number(b.dataset.ir))));
    car.addEventListener('mouseenter', () => { car.classList.add('pausado'); clearTimeout(timer); });
    car.addEventListener('mouseleave', () => { car.classList.remove('pausado'); vai(atual); });
    car.addEventListener('focusin', () => { car.classList.add('pausado'); clearTimeout(timer); });
    car.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') vai(atual - 1); if (e.key === 'ArrowRight') vai(atual + 1); });
    car.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; inicioX = e.clientX; delta = 0; car.classList.add('arrastando'); car.setPointerCapture(e.pointerId); });
    car.addEventListener('pointermove', (e) => { if (inicioX === null) return; delta = e.clientX - inicioX; trilho.style.translate = `calc(${-atual * 100}% + ${delta}px) 0`; });
    const solta = () => { if (inicioX === null) return; car.classList.remove('arrastando'); inicioX = null; vai(Math.abs(delta) > 60 ? atual + (delta < 0 ? 1 : -1) : atual); };
    car.addEventListener('pointerup', solta);
    car.addEventListener('pointercancel', solta);
    vai(0);
  });

  // ---------- depoimentos em pilha: a carta de cima voa e vai para o fim ----------
  const pilha = $('[data-pilha]');
  if (pilha) {
    let cartas = $$('.pl-carta', pilha);
    const conta = $('[data-pilha-conta]');
    const total = cartas.length;
    let atual = 0, ocupado = false;
    const arruma = () => {
      cartas.forEach((c, i) => { c.style.setProperty('--pos', i); c.setAttribute('aria-hidden', String(i !== 0)); c.style.translate = ''; });
      conta.textContent = `${atual + 1} de ${total}`;
    };
    const prox = () => {
      if (ocupado) return;
      const topoC = cartas[0];
      if (parado) { cartas.push(cartas.shift()); atual = (atual + 1) % total; arruma(); return; }
      ocupado = true;
      topoC.classList.add('voa');
      setTimeout(() => {
        cartas.push(cartas.shift());
        atual = (atual + 1) % total;
        topoC.classList.remove('voa');
        arruma();
        ocupado = false;
      }, 420);
    };
    const ant = () => { if (ocupado) return; cartas.unshift(cartas.pop()); atual = (atual - 1 + total) % total; arruma(); };
    $('[data-pl-prox]').addEventListener('click', prox);
    $('[data-pl-ant]').addEventListener('click', ant);
    pilha.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') prox(); if (e.key === 'ArrowLeft') ant(); });
    let x0 = null, dx = 0;
    pilha.addEventListener('pointerdown', (e) => { x0 = e.clientX; dx = 0; cartas[0].style.transition = 'none'; pilha.setPointerCapture(e.pointerId); });
    pilha.addEventListener('pointermove', (e) => { if (x0 === null) return; dx = e.clientX - x0; cartas[0].style.translate = `${dx}px ${Math.abs(dx) * -0.08}px`; });
    const solta = () => {
      if (x0 === null) return;
      x0 = null;
      cartas[0].style.transition = '';
      if (Math.abs(dx) > 80) prox(); else cartas[0].style.translate = '';
    };
    pilha.addEventListener('pointerup', solta);
    pilha.addEventListener('pointercancel', solta);
    arruma();
  }

  // ---------- abas com teclado (políticas) ----------
  const gPol = $('.pol-abas');
  if (gPol) {
    const botoes = $$('[role="tab"]', gPol);
    const ativa = (b, foco) => {
      botoes.forEach((x) => { const sim = x === b; x.setAttribute('aria-selected', String(sim)); x.tabIndex = sim ? 0 : -1; $(`#${x.getAttribute('aria-controls')}`).hidden = !sim; });
      if (foco) b.focus();
    };
    botoes.forEach((b, i) => {
      b.addEventListener('click', () => ativa(b));
      b.addEventListener('keydown', (e) => {
        const passo = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (passo) { e.preventDefault(); ativa(botoes[(i + passo + botoes.length) % botoes.length], true); }
      });
    });
  }

  // ---------- filtro genérico (botões com aria-pressed) ----------
  const filtro = (grupo, chave, itens, aoFiltrar) => {
    const botoes = $$('button', grupo);
    const aplica = (valor) => {
      botoes.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset[chave] === valor)));
      itens().forEach((el) => {
        const mostra = valor === 'todas' || el.dataset[chave] === valor;
        el.classList.toggle('some', !mostra);
        el.classList.remove('entra');
        if (mostra && !parado) { void el.offsetWidth; el.classList.add('entra'); }
      });
      aoFiltrar?.(valor);
      requestAnimationFrame(rola);
    };
    botoes.forEach((b) => b.addEventListener('click', () => aplica(b.dataset[chave])));
    return aplica;
  };

  // galeria por categoria e foto ampliada
  const fGal = $('[data-filtro-gal]');
  if (fGal) filtro(fGal, 'cat', () => $$('.gal-grade li'));
  const janFoto = $('[data-jan-foto]');
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ampliar]');
    if (!b) return;
    $('[data-jf-img]', janFoto).src = b.dataset.ampliar;
    $('[data-jf-img]', janFoto).alt = b.dataset.leg;
    $('[data-jf-leg]', janFoto).textContent = b.dataset.leg;
    janFoto.showModal();
  });

  // serviços por frente (com âncora vinda de outra página: servicos.html#fiscal)
  const fServ = $('[data-filtro-serv]');
  if (fServ) {
    const aplicaServ = filtro(fServ, 'seg', () => $$('.ficha'));
    const vaiSeg = (id) => {
      if (!D.segmentos.some((s) => s.id === id)) return false;
      aplicaServ(id);
      $('#servicos').scrollIntoView({ behavior: parado ? 'auto' : 'smooth' });
      return true;
    };
    $$('[data-ir-seg]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); vaiSeg(a.dataset.irSeg); history.replaceState(null, '', `#${a.dataset.irSeg}`); }));
    const hash = location.hash.slice(1);
    if (hash) setTimeout(() => vaiSeg(hash), 120);
  }

  // ---------- conteúdos: filtro, ver mais e janela do artigo ----------
  const fBlog = $('[data-filtro-blog]');
  if (fBlog) {
    const VISIVEIS = 4;
    const verMais = $('[data-ver-mais]');
    let tudo = false;
    const limitaBlog = (valor) => {
      const vis = $$('[data-blog] .art').filter((a) => !a.classList.contains('some'));
      vis.forEach((a, i) => { if (!tudo && valor === 'todas' && i >= VISIVEIS) a.classList.add('some'); });
      verMais.hidden = tudo || valor !== 'todas';
      $('[data-blog-vazio]').hidden = vis.length > 0;
    };
    const aplicaBlog = filtro(fBlog, 'seg', () => $$('[data-blog] .art'), limitaBlog);
    verMais.addEventListener('click', () => { tudo = true; aplicaBlog('todas'); });
    aplicaBlog('todas');
  }
  const janArt = $('[data-jan-art]');
  if (janArt) {
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-art]');
      if (!b) return;
      const a = D.artigos.find((x) => x.id === b.dataset.art);
      $('[data-ja-foto]', janArt).src = a.foto;
      $('[data-ja-seg]', janArt).textContent = a.segNome;
      $('[data-ja-tit]', janArt).textContent = a.titulo;
      $('[data-ja-meta]', janArt).textContent = `Por ${a.autorNome}, ${a.autorCrc}. ${a.dataTexto}. Leitura de ${a.leitura} minutos.`;
      $('[data-ja-corpo]', janArt).replaceChildren(...a.corpo.map((t) => Object.assign(document.createElement('p'), { textContent: t })));
      janArt.showModal();
    });
  }

  // ---------- FAQ em acordeão ----------
  $$('[data-faq] .faq-item button').forEach((b) => b.addEventListener('click', () => {
    const item = b.closest('.faq-item');
    const abrir = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(abrir));
    item.classList.toggle('aberto', abrir);
  }));

  // ---------- janelas: legais, foto, artigo ----------
  document.addEventListener('click', (e) => {
    const l = e.target.closest('[data-legal]');
    if (l) { e.preventDefault(); $$('dialog[open]').forEach((d) => d.close()); $(`[data-jan-legal="${l.dataset.legal}"]`).showModal(); return; }
    if (e.target.closest('[data-fechar]')) { e.target.closest('dialog').close(); return; }
    if (e.target.tagName === 'DIALOG') e.target.close(); // clique no fundo
  });

  // ---------- formulários ----------
  const mascara = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };
  $$('[data-mascara]').forEach((i) => i.addEventListener('input', () => { i.value = mascara(i.value); }));
  const valida = (form) => {
    let primeiro = null;
    $$('input, select, textarea', form).forEach((c) => {
      if (c.type === 'range') return;
      let ok = c.checkValidity();
      if (ok && c.type === 'email' && c.value) ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.value);
      if (ok && c.hasAttribute('data-mascara')) ok = c.value.replace(/\D/g, '').length >= 10;
      if (c.type !== 'radio' && c.type !== 'hidden') c.setAttribute('aria-invalid', String(!ok));
      if (!ok && !primeiro) primeiro = c;
    });
    return primeiro;
  };
  const erro = (form, campo) => {
    const msg = $('[data-msg]', form);
    msg.classList.remove('ok');
    msg.textContent = campo.name === 'lgpd' ? 'Para enviar, é preciso aceitar a Política de privacidade.' : 'Confira os campos destacados antes de enviar.';
    campo.focus();
  };

  // contato: confirma na tela e oferece o WhatsApp só com nome e assunto; nada sigiloso sai pelo site
  $$('[data-contato]').forEach((form) => {
    const txt = $('textarea', form), cont = $('[data-contador]', form);
    txt.addEventListener('input', () => { cont.textContent = `${txt.value.length} de ${txt.maxLength}`; });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ruim = valida(form);
      if (ruim) return erro(form, ruim);
      const f = new FormData(form);
      const protocolo = `PR-${Date.now().toString(36).slice(-6).toUpperCase()}`;
      $('[data-msg]', form).textContent = '';
      $('[data-protocolo]', form).textContent = protocolo;
      $('[data-ok-wa]', form).href = wa(`Olá! Sou ${f.get('nome')} e enviei pelo site um pedido de contato sobre ${f.get('assunto')} (protocolo ${protocolo}).`);
      $$('.form-grade, .opcoes, .campo, .sigilo, .aceite, button[type="submit"]', form).forEach((el) => { el.hidden = true; });
      $('[data-ok]', form).hidden = false;
      // aqui entra o envio para o e-mail ou o sistema do escritório; na demonstração nada sai do navegador
    });
  });

  // carta mensal por e-mail: só confirma na tela
  $$('[data-news]').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ruim = valida(form);
    if (ruim) return erro(form, ruim);
    const msg = $('[data-msg]', form);
    msg.classList.add('ok');
    msg.textContent = `Pronto, ${new FormData(form).get('nome')}. A próxima carta chega no seu e-mail.`;
    form.reset();
  }));

  // ---------- simulador de enquadramento: estimativa simplificada dos três regimes ----------
  const sim = $('[data-sim]');
  if (sim) {
    // LC 123/2006: [limite da faixa, alíquota nominal, parcela a deduzir]
    const ANEXOS = {
      I: [[180e3, 0.04, 0], [360e3, 0.073, 5940], [720e3, 0.095, 13860], [1.8e6, 0.107, 22500], [3.6e6, 0.143, 87300], [4.8e6, 0.19, 378000]],
      II: [[180e3, 0.045, 0], [360e3, 0.078, 5940], [720e3, 0.10, 13860], [1.8e6, 0.112, 22500], [3.6e6, 0.147, 85500], [4.8e6, 0.30, 720000]],
      III: [[180e3, 0.06, 0], [360e3, 0.112, 9360], [720e3, 0.135, 17640], [1.8e6, 0.16, 35640], [3.6e6, 0.21, 125640], [4.8e6, 0.33, 648000]],
      V: [[180e3, 0.155, 0], [360e3, 0.18, 4500], [720e3, 0.195, 9900], [1.8e6, 0.205, 17100], [3.6e6, 0.23, 62100], [4.8e6, 0.305, 540000]],
    };
    // parte do ICMS dentro do DAS (fica fora da comparação para comércio e indústria)
    const ICMS_DAS = { I: 0.335, II: 0.32 };
    const ISS = 0.03, CPP = 0.278;
    const PRESUNCAO = { comercio: [0.08, 0.12], industria: [0.08, 0.12], servicos: [0.32, 0.32], intelectual: [0.32, 0.32] };
    const CREDITOS = { comercio: 0.55, industria: 0.45, servicos: 0.12, intelectual: 0.08 };
    const irpj = (base) => Math.max(0, base) * 0.15 + Math.max(0, base - 240000) * 0.10;
    const ehServico = (a) => a === 'servicos' || a === 'intelectual';
    const pct = (v) => `${(v * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;

    const calcula = ({ ativ, fat, folha, margem }) => {
      const fatorR = fat ? folha / fat : 0;
      const anexo = { comercio: 'I', industria: 'II', servicos: 'III', intelectual: fatorR >= 0.28 ? 'III' : 'V' }[ativ];
      let simples = null;
      if (fat <= 4.8e6) {
        const faixas = ANEXOS[anexo];
        const i = faixas.findIndex((f) => fat <= f[0]);
        let ef = (fat * faixas[i][1] - faixas[i][2]) / fat;
        if (ICMS_DAS[anexo] && i < 5) ef *= 1 - ICMS_DAS[anexo];
        simples = fat * ef + (ehServico(ativ) && i === 5 ? fat * ISS : 0);
      }
      const [pIr, pCs] = PRESUNCAO[ativ];
      const iss = ehServico(ativ) ? fat * ISS : 0;
      const presumido = irpj(fat * pIr) + fat * pCs * 0.09 + fat * 0.0365 + iss + folha * CPP;
      const lucro = fat * margem;
      const real = irpj(lucro) + Math.max(0, lucro) * 0.09 + fat * (1 - CREDITOS[ativ]) * 0.0925 + iss + folha * CPP;
      return { simples, presumido, real, fatorR, anexo };
    };

    const NOMES = { simples: 'Simples Nacional', presumido: 'Lucro Presumido', real: 'Lucro Real' };
    const ATIV = { comercio: 'comércio', industria: 'indústria', servicos: 'serviços', intelectual: 'serviços intelectuais' };
    const atualiza = () => {
      const f = new FormData(sim);
      const v = { ativ: f.get('ativ'), fat: Number(f.get('fat')), folha: Number(f.get('folha')), margem: Number(f.get('margem')) / 100 };
      $$('input[type="range"]', sim).forEach((r) => r.style.setProperty('--pct', `${((r.value - r.min) / (r.max - r.min)) * 100}%`));
      $('[data-out="fat"]', sim).textContent = reais.format(v.fat);
      $('[data-out="folha"]', sim).textContent = reais.format(v.folha);
      $('[data-out="margem"]', sim).textContent = `${f.get('margem')}%`;
      const r = calcula(v);
      $('[data-fator]', sim).innerHTML = v.ativ === 'intelectual'
        ? `Fator R de <b>${pct(r.fatorR)}</b>: ${r.fatorR >= 0.28 ? 'a partir de 28%, o Simples usa o Anexo III.' : 'abaixo de 28%, o Simples usa o Anexo V.'}`
        : `No Simples, ${ATIV[v.ativ]} usa o <b>Anexo ${r.anexo}</b>.`;
      const valores = ['simples', 'presumido', 'real'].map((k2) => [k2, r[k2]]);
      const validos = valores.filter(([, x]) => x !== null);
      const max = Math.max(...validos.map(([, x]) => x), 1);
      const menor = validos.reduce((a, b) => (b[1] < a[1] ? b : a));
      valores.forEach(([k2, x]) => {
        const li = $(`[data-regime="${k2}"]`, sim);
        li.classList.toggle('fora', x === null);
        li.classList.toggle('menor', k2 === menor[0]);
        $('i', li).style.setProperty('--w', x === null ? 0 : (x / max).toFixed(3));
        $('[data-v]', li).textContent = x === null ? 'indisponível' : reais.format(x);
        $('[data-p]', li).textContent = x === null ? 'Faturamento acima de R$ 4,8 milhões no ano' : `${pct(x / v.fat)} do faturamento`;
      });
      $('[data-sim-menor]', sim).textContent = `Neste cenário, a menor estimativa é o ${NOMES[menor[0]]}. Créditos, benefícios e o detalhe das atividades podem mudar a conta: confirme no diagnóstico.`;
    };
    sim.addEventListener('input', atualiza);
    sim.addEventListener('submit', (e) => e.preventDefault());
    atualiza();
  }

  // ---------- agendamento: frente, contador, formato, dia e horário ----------
  const ag = $('[data-agenda]');
  if (ag) {
    const profsBox = $('[data-ag-profs]', ag), diasBox = $('[data-ag-dias]', ag), horasBox = $('[data-ag-horas]', ag);
    const resumo = (campo, texto) => { const dd = $(`[data-r="${campo}"]`); if (dd.textContent === texto) return; dd.textContent = texto; dd.classList.remove('muda'); void dd.offsetWidth; dd.classList.add('muda'); };
    const escolha = { seg: null, prof: null, dia: null, hora: null };
    const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
    const pedidoProf = new URLSearchParams(location.search).get('prof');
    const quandoTexto = () => `${new Date(escolha.dia).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}, às ${Math.floor(escolha.hora / 60)}h${escolha.hora % 60 ? '30' : ''}`;
    // ocupação fixa da demonstração por contador, dia e hora; na versão do cliente, consultar a agenda real
    const ocupado = (prof, d, m) => ((prof.length * 7 + d.getDate() * 3 + m / 30 * 5) % 9) < 3;

    const montaProfs = () => {
      const lista = D.equipe.filter((p) => p.segmentos.includes(escolha.seg));
      profsBox.innerHTML = lista.map((p) => `<label><input type="radio" name="prof" value="${p.id}" required><span><img src="${p.foto}" alt="" width="44" height="44"><span>${p.nome}<small>${p.crc}</small></span></span></label>`).join('');
      escolha.prof = null;
      const auto = lista.length === 1 ? lista[0].id : lista.find((p) => p.id === pedidoProf)?.id;
      if (auto) { $(`input[value="${auto}"]`, profsBox).checked = true; escolheProf(auto); } else { resumo('prof', 'Escolha o contador'); montaDias(); }
    };
    const escolheProf = (id) => { escolha.prof = id; resumo('prof', D.equipe.find((p) => p.id === id).nome); montaDias(); };
    const montaDias = () => {
      escolha.dia = null; escolha.hora = null;
      resumo('quando', 'Escolha dia e horário');
      horasBox.innerHTML = '<p class="ag-dica">Escolha o dia.</p>';
      if (!escolha.prof) { diasBox.innerHTML = '<p class="ag-dica">Escolha o contador para ver os dias livres.</p>'; return; }
      const p = D.equipe.find((x) => x.id === escolha.prof);
      const dias = [];
      for (let i = 1; dias.length < 10 && i < 40; i++) {
        const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i);
        if (p.agenda.includes(d.getDay()) && D.horario[d.getDay()]) dias.push(d);
      }
      diasBox.innerHTML = dias.map((d) => `<button type="button" aria-pressed="false" data-dia="${d.toISOString()}">${DIAS[d.getDay()]}<small>${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}</small></button>`).join('');
    };
    const montaHoras = () => {
      const d = new Date(escolha.dia);
      const [ini, fim] = D.horario[d.getDay()].map(hm);
      // conversas de 30 min, de meia em meia hora, com pausa das 12h às 13h
      const livres = [];
      for (let m = Math.ceil(ini / 60) * 60; m + 30 <= fim; m += 30) if (m < 12 * 60 || m >= 13 * 60) livres.push(m);
      horasBox.innerHTML = livres.map((m) => `<button type="button" aria-pressed="false" data-hora="${m}"${ocupado(escolha.prof, d, m) ? ' disabled aria-label="Ocupado"' : ''}>${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}</button>`).join('');
    };

    ag.addEventListener('change', (e) => {
      const c = e.target;
      if (c.name === 'seg') {
        escolha.seg = c.value;
        resumo('seg', D.segmentos.find((s) => s.id === c.value).nome);
        $('[data-ag-serv]', ag).hidden = true;
        ag.servico.value = '';
        montaProfs();
      }
      if (c.name === 'prof') escolheProf(c.value);
      if (c.name === 'formato') resumo('formato', c.value);
    });
    diasBox.addEventListener('click', (e) => {
      const b = e.target.closest('[data-dia]');
      if (!b) return;
      $$('[data-dia]', diasBox).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      escolha.dia = b.dataset.dia; escolha.hora = null;
      resumo('quando', new Date(escolha.dia).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }));
      montaHoras();
    });
    horasBox.addEventListener('click', (e) => {
      const b = e.target.closest('[data-hora]');
      if (!b || b.disabled) return;
      $$('[data-hora]', horasBox).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      escolha.hora = Number(b.dataset.hora);
      resumo('quando', quandoTexto());
    });

    const escolheSeg = (seg, servico) => {
      const r = $(`input[name="seg"][value="${seg}"]`, ag);
      r.checked = true;
      r.dispatchEvent(new Event('change', { bubbles: true }));
      if (servico) {
        ag.servico.value = servico;
        const aviso = $('[data-ag-serv]', ag);
        aviso.textContent = `Serviço: ${servico}`;
        aviso.hidden = false;
      }
    };
    // "Agendar sobre este serviço" nas fichas e "Agendar a revisão" no simulador
    $$('[data-agendar-seg]').forEach((b) => b.addEventListener('click', () => {
      escolheSeg(b.dataset.agendarSeg, b.dataset.agendarServ);
      $('#agendar').scrollIntoView({ behavior: parado ? 'auto' : 'smooth' });
    }));
    $$('[data-agendar-sim]').forEach((b) => b.addEventListener('click', () => escolheSeg('fiscal', 'Revisão de enquadramento')));
    // contador escolhido na página dos profissionais (servicos.html?prof=laura#agendar): abre na primeira frente dele
    const prof = D.equipe.find((p) => p.id === pedidoProf);
    if (prof) escolheSeg(prof.segmentos[0]);

    ag.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = $('[data-msg]', ag);
      msg.classList.remove('ok');
      const ruim = valida(ag);
      if (!escolha.seg || !escolha.prof) { msg.textContent = 'Escolha a frente e o contador.'; return; }
      if (!escolha.dia || escolha.hora === null) { msg.textContent = 'Escolha o dia e o horário da conversa.'; return; }
      if (ruim) return erro(ag, ruim);
      const f = new FormData(ag);
      const p = D.equipe.find((x) => x.id === escolha.prof);
      const texto = [
        `Olá! Gostaria de marcar uma conversa pelo site da ${D.marca}.`,
        `Assunto: ${D.segmentos.find((s) => s.id === escolha.seg).nome}${f.get('servico') ? ` (${f.get('servico')})` : ''}`,
        `Contador: ${p.nome}`,
        `Formato: ${f.get('formato')}`,
        `Quando: ${quandoTexto()}`,
        `Nome: ${f.get('nome')}`,
        `WhatsApp: ${f.get('fone')}`,
      ].join('\n');
      msg.classList.add('ok');
      msg.textContent = 'Pedido pronto. A conversa do WhatsApp abriu numa nova aba; é só enviar.';
      window.open(wa(texto), '_blank', 'noopener');
    });
  }

  // ---------- cookies ----------
  const ck = $('#cookies');
  if (ck) {
    const mostra = () => { ck.hidden = false; };
    if (!guarda.ler('ortiva-cookies', null)) mostra();
    $$('[data-ck]', ck).forEach((b) => b.addEventListener('click', () => {
      guarda.gravar('ortiva-cookies', { escolha: b.dataset.ck, em: new Date().toISOString() });
      ck.hidden = true;
      // a medição de visitas, quando existir, só é ligada aqui com escolha "todos"
    }));
    $$('[data-cookies]').forEach((b) => b.addEventListener('click', mostra));
  }

  // ---------- botões magnéticos: seguem o mouse quando ele chega perto e voltam com mola ----------
  if (comMouse && telaGrande && !parado) {
    $$('[data-magnetic]').forEach((el) => {
      const forca = el.matches('.capa-redondo, .whats-flutua') ? 0.35 : 0.25;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${((e.clientX - r.left - r.width / 2) * forca).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * forca * 1.2).toFixed(1)}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
  }

  // ---------- cursor: anel e ponto; o anel mostra uma palavra sobre o que dá para fazer ----------
  if (comMouse && telaGrande && !parado) {
    const cx = document.createElement('div');
    cx.className = 'cursor fora';
    cx.setAttribute('aria-hidden', 'true');
    cx.innerHTML = '<span class="cur-anel"><i><b></b></i></span><span class="cur-ponto"><i></i></span>';
    document.body.appendChild(cx);
    const anel = $('.cur-anel', cx), ponto = $('.cur-ponto', cx), rot = $('b', cx);
    raiz.classList.add('cursor-on');
    let mx = -100, my = -100, ax = -100, ay = -100;
    const avalia = (alvo) => {
      if (!(alvo instanceof Element)) return;
      const campo = alvo.closest('input:not([type="range"]):not([type="radio"]):not([type="checkbox"]), textarea, select');
      const rotulo = alvo.closest('[data-cursor]');
      const link = alvo.closest('a, button, label, summary, [role="tab"], input[type="range"]');
      cx.classList.toggle('texto', !!campo);
      cx.classList.toggle('rotulo', !campo && !!rotulo && (!link || link === rotulo || rotulo.contains(link) === false || link.contains(rotulo)));
      cx.classList.toggle('link', !campo && !cx.classList.contains('rotulo') && !!link);
      if (cx.classList.contains('rotulo')) rot.textContent = rotulo.dataset.cursor;
    };
    addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      cx.classList.remove('fora');
      ponto.style.transform = `translate(${mx}px, ${my}px)`;
    }, { passive: true });
    addEventListener('pointerover', (e) => avalia(e.target));
    document.addEventListener('pointerleave', () => cx.classList.add('fora'));
    addEventListener('pointerdown', () => cx.classList.add('aperta'));
    addEventListener('pointerup', () => cx.classList.remove('aperta'));
    const segue = () => {
      ax += (mx - ax) * 0.2; ay += (my - ay) * 0.2;
      anel.style.transform = `translate(${ax.toFixed(1)}px, ${ay.toFixed(1)}px)`;
      requestAnimationFrame(segue);
    };
    requestAnimationFrame(segue);
  }
})();
