/* Salvi Premium (nutrição): comportamento do site. Sem bibliotecas.
   O script do tema (templates/_comum/tema-pilula.js) é acrescentado no fim deste arquivo pelo build. */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const raiz = document.documentElement;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(pointer: fine)').matches;
  const D = JSON.parse($('#dados')?.textContent || '{}');
  const limita = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const le = (k, padrao, t = localStorage) => { try { const v = t.getItem(k); return v === null ? padrao : JSON.parse(v); } catch { return padrao; } };
  const grava = (k, v, t = localStorage) => { try { t.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento: vale só nesta visita */ } };
  const normal = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const waLink = (msg) => `https://wa.me/55${D.whats}?text=${encodeURIComponent(msg)}`;

  // ---------- aviso rápido ----------
  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('mostra');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('mostra'), 4200);
  };

  // ---------- componentes do mesmo grupo com a mesma largura (a do item mais longo) ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    const filhos = [...g.children].map((c) => (c.matches('li, label') && c.firstElementChild ? c.firstElementChild : c));
    g.style.removeProperty('--larg');
    filhos.forEach((f) => { f.style.width = 'auto'; });
    const maior = Math.max(...filhos.map((f) => f.getBoundingClientRect().width));
    filhos.forEach((f) => { f.style.width = ''; });
    if (maior > 0) g.style.setProperty('--larg', `${Math.ceil(maior)}px`);
  });
  iguala();
  document.fonts?.ready.then(iguala);
  addEventListener('resize', iguala);

  // ===================== ABERTURA E CORTINA =====================
  const pronto = () => { raiz.classList.add('pos-intro'); dispatchEvent(new Event('salvi:pronto')); };
  const abertura = $('#abertura');
  if (raiz.classList.contains('intro') && abertura) {
    const conta = $('[data-conta]', abertura);
    const inicio = performance.now();
    const imgs = $$('img[fetchpriority="high"]');
    let carregadas = 0, fim = false, mostrado = 0;
    const alvo = () => (imgs.length ? carregadas / imgs.length : 1) * 0.7 + Math.min((performance.now() - inicio) / 2200, 1) * 0.3;
    const termina = () => {
      if (fim) return;
      fim = true;
      grava('salvi-intro', 1, sessionStorage);
      abertura.classList.add('abre');
      pronto();
      setTimeout(() => { raiz.classList.remove('intro'); abertura.remove(); }, 1300);
    };
    imgs.forEach((im) => { if (im.complete) carregadas++; else im.addEventListener('load', () => carregadas++, { once: true }); });
    const passo = () => {
      if (fim) return;
      mostrado += (alvo() - mostrado) * 0.08;
      conta.textContent = Math.round(mostrado * 100);
      const t = performance.now() - inicio;
      if ((mostrado > 0.985 && t > 2300) || t > 6000) { conta.textContent = '100'; setTimeout(termina, 200); return; }
      requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
    abertura.addEventListener('click', termina);
    addEventListener('keydown', termina, { once: true });
  } else {
    abertura?.remove();
    raiz.classList.remove('intro');
    requestAnimationFrame(pronto);
  }

  // cortina: ao chegar de outra página do site, o prato se fecha no centro e libera a página
  const cortina = $('.cortina');
  if (raiz.classList.contains('chegando') && cortina) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      cortina.classList.add('abre');
      setTimeout(() => { raiz.classList.remove('chegando'); cortina.classList.remove('abre'); }, 1000);
    }));
  }
  // ao sair: o prato cresce a partir do clique e cobre a tela; a próxima página começa coberta
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || !cortina || reduz || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.protocol !== location.protocol) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // só âncora na mesma página
    e.preventDefault();
    cortina.style.setProperty('--cx', `${e.clientX}px`);
    cortina.style.setProperty('--cy', `${e.clientY}px`);
    cortina.classList.add('fecha');
    grava('salvi-nav', 1, sessionStorage);
    setTimeout(() => { location.href = a.href; }, 720);
  });
  addEventListener('pageshow', (e) => { if (e.persisted) cortina?.classList.remove('fecha'); });

  // ===================== TOPO E MENUS =====================
  const topo = $('[data-topo]');
  const menuBtn = $('.menu-btn'), menu = $('#menu-cel');
  let ultimoTopo = scrollY;
  const atualizaTopo = () => {
    const y = scrollY;
    topo?.classList.toggle('rolou', y > 30);
    const aberto = menuBtn?.getAttribute('aria-expanded') === 'true';
    topo?.classList.toggle('some', !aberto && y > 500 && y > ultimoTopo + 4);
    if (y < ultimoTopo - 4 || y < 500) topo?.classList.remove('some');
    ultimoTopo = y;
  };
  addEventListener('scroll', atualizaTopo, { passive: true });
  atualizaTopo();

  const fechaMenu = () => {
    if (!menu || menu.hidden) return;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Abrir o menu');
    menu.classList.remove('aberto');
    document.body.style.overflow = '';
    setTimeout(() => { if (!menu.classList.contains('aberto')) menu.hidden = true; }, reduz ? 0 : 700);
  };
  menuBtn?.addEventListener('click', () => {
    if (menuBtn.getAttribute('aria-expanded') === 'true') return fechaMenu();
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('aberto'));
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Fechar o menu');
    document.body.style.overflow = 'hidden';
  });
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) fechaMenu(); });

  const sub = $('.tem-sub'), subBtn = $('.nav-sub-btn');
  const abreSub = (v) => { sub?.classList.toggle('aberto', v); subBtn?.setAttribute('aria-expanded', String(v)); };
  subBtn?.addEventListener('click', () => abreSub(subBtn.getAttribute('aria-expanded') !== 'true'));
  if (fino) { sub?.addEventListener('pointerenter', () => abreSub(true)); sub?.addEventListener('pointerleave', () => abreSub(false)); }
  document.addEventListener('click', (e) => { if (sub && !sub.contains(e.target)) abreSub(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { abreSub(false); fechaMenu(); } });

  // ===================== CURSOR, MAGNETISMO E INCLINAÇÃO =====================
  if (fino && !reduz) {
    const cur = $('.cursor'), anel = $('.cur-anel'), ponto = $('.cur-ponto'), txt = $('.cur-txt');
    if (cur) {
      raiz.classList.add('cursor-ligado');
      cur.classList.add('fora'); // aparece no primeiro movimento do mouse
      let mx = innerWidth / 2, my = innerHeight / 2, ax = mx, ay = my;
      addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        mx = e.clientX; my = e.clientY;
        cur.classList.remove('fora');
        // posição pela propriedade translate: ela vem antes de rotate e scale, que mudam o anel sem tirá-lo do lugar
        ponto.style.translate = `${mx}px ${my}px`;
        const alvo = e.target.closest('[data-cursor], a, button, label, summary, select, .planta-sala');
        const palavra = alvo?.closest('[data-cursor]')?.dataset.cursor;
        cur.dataset.estado = palavra ? 'texto' : alvo ? 'link' : '';
        if (palavra) txt.textContent = palavra;
      }, { passive: true });
      document.addEventListener('pointerleave', () => cur.classList.add('fora'));
      addEventListener('pointerdown', () => cur.classList.add('aperta'));
      addEventListener('pointerup', () => cur.classList.remove('aperta'));
      const segue = () => {
        ax += (mx - ax) * 0.18; ay += (my - ay) * 0.18;
        anel.style.translate = `${ax.toFixed(1)}px ${ay.toFixed(1)}px`;
        requestAnimationFrame(segue);
      };
      segue();
    }
    // botões magnéticos: puxam na direção do mouse e voltam com mola
    $$('[data-magnetic]').forEach((el) => {
      el.style.transition += ', translate .55s cubic-bezier(.34,1.56,.64,1)';
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${(((e.clientX - r.left) / r.width - 0.5) * 16).toFixed(1)}px ${(((e.clientY - r.top) / r.height - 0.5) * 12).toFixed(1)}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
    // fotos que inclinam seguindo o mouse
    $$('.inclina').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(((e.clientY - r.top) / r.height - 0.5) * -8).toFixed(2)}deg`);
      });
      el.addEventListener('pointerleave', () => { el.style.removeProperty('--ry'); el.style.removeProperty('--rx'); });
    });
  }

  // ===================== A HISTÓRIA NA ROLAGEM =====================
  const CENAS = [
    ['.sec-cab > div, .sec-cab-dir', 'cena'],
    ['.sobre-lead, .sobre-frase, .numeros li, .formacao, .sobre-btns', 'cena'],
    ['.seg-abas, .seg-chamada, .seg-lado > p, .seg-lado > .link-seta, .condicoes > div', 'cena'], ['.receita', 'cena-zoom'],
    ['.car-slide, .car-ctrl', 'cena'],
    ['.tour-visor', 'cena-zoom'], ['.tour-lado', 'cena-lado'],
    ['.leque', 'cena-var'],
    ['.ag-intro > p, .ag-nota', 'cena'], ['.ag', 'cena-lado'],
    ['.conv-busca, .conv-todos, .reembolso h3, .trilha li', 'cena'],
    ['.g-placar', 'cena'], ['.g-card', 'cena-zoom'],
    ['.post-card, .filtros, .blog-busca, .insta-cab, .insta-grade li', 'cena'],
    ['.faq details, .comb-item, .sensiveis > div, .comb-pe', 'cena'],
    ['.ct-lista li', 'cena'], ['.ct-form', 'cena-lado'],
    ['.perfil-txt > *, .lista-grande li, .art-corpo > *, .pg-lead, .pg-acoes', 'cena'], ['.esp-prof', 'cena-zoom'],
    ['.rod-topo > *, .mapa-linha > *, .legal', 'cena'],
  ];
  const cenas = [];
  if (!reduz) {
    CENAS.forEach(([sel, cls]) => $$(sel).forEach((el) => {
      if (el.closest('.capa, .metodo, .area-login, .painel')) return;
      el.classList.add(cls);
      if (cls === 'cena-lado') el.style.setProperty('--lado', '70px');
      // irmãos lado a lado entram em sequência: o atraso vira distância de rolagem
      const irmaos = [...el.parentElement.children].filter((x) => x.classList.contains(cls));
      cenas.push({ el, atraso: Math.min(irmaos.indexOf(el), 6) * 0.045 });
    }));
  } else raiz.classList.add('sem-anim');

  const capa = $('.capa'), metodoEl = $('.metodo'), rodSimb = $('.rod-simbolo');
  const etapas = $$('.metodo-etapas li'), rotulos = $$('.prato-rot');
  let etapaAtiva = -1, pedido = false, ultimoY = scrollY;
  raiz.dataset.rolagem = 'desce';
  const rola = () => {
    pedido = false;
    const vh = innerHeight;
    const y = scrollY;
    if (Math.abs(y - ultimoY) > 2) { raiz.dataset.rolagem = y > ultimoY ? 'desce' : 'sobe'; ultimoY = y; }
    // primeiro lê tudo, depois escreve, para não forçar o layout a cada elemento
    const leituras = cenas.map(({ el, atraso }) => { const r = el.getBoundingClientRect(); return [el, r.top, r.bottom, atraso, r.width === 0 && r.height === 0]; });
    const rm = metodoEl?.getBoundingClientRect();
    // --p: entrada pela borda de baixo; --q: saída pela borda de cima (nos dois sentidos)
    for (const [el, top, bottom, atraso, oculto] of leituras) {
      if (oculto) { el.style.setProperty('--p', 1); el.style.setProperty('--q', 1); continue; }
      const p = limita((vh * (1.02 - atraso) - top) / (vh * 0.32));
      const q = limita((bottom - vh * 0.02) / (vh * 0.3));
      el.style.setProperty('--p', (1 - (1 - p) ** 3).toFixed(3));
      el.style.setProperty('--q', (1 - (1 - q) ** 3).toFixed(3));
    }
    if (capa) capa.style.setProperty('--h', limita(y / (vh * 0.9)).toFixed(3));
    // o prato: --m vai de 0 a 1 enquanto o palco fica preso na tela
    if (rm && !reduz) {
      const m = limita(-rm.top / (rm.height - vh));
      metodoEl.style.setProperty('--m', m.toFixed(4));
      const k = Math.min(etapas.length - 1, Math.floor(m * etapas.length * 0.999));
      if (k !== etapaAtiva) {
        etapaAtiva = k;
        etapas.forEach((li, i) => li.classList.toggle('ativa', i === k));
        rotulos.forEach((r, i) => { r.classList.toggle('feita', i <= k); r.classList.toggle('ativa', i === k); });
      }
    }
    if (rodSimb) rodSimb.style.setProperty('--giro', ((y / 6) % 360).toFixed(1));
  };
  if (reduz) { etapas.forEach((li) => li.classList.add('ativa')); rotulos.forEach((r) => r.classList.add('feita')); }
  addEventListener('scroll', () => { if (!pedido) { pedido = true; requestAnimationFrame(rola); } }, { passive: true });
  addEventListener('resize', rola);
  addEventListener('toggle', () => requestAnimationFrame(rola), true);
  if ('ResizeObserver' in window) { let ro = false; new ResizeObserver(() => { if (!ro) { ro = true; requestAnimationFrame(() => { ro = false; rola(); }); } }).observe(document.body); }
  rola();

  // títulos, fotos e contadores ligam ao entrar e desligam ao sair por qualquer borda
  const contaAte = (el) => {
    const fim = +el.dataset.contaAte, ini = performance.now(), dur = 1600;
    const vai = (t) => { const k = limita((t - ini) / dur); el.textContent = Math.round(fim * (1 - (1 - k) ** 3)).toLocaleString('pt-BR'); if (k < 1 && el.isConnected) requestAnimationFrame(vai); };
    requestAnimationFrame(vai);
  };
  const ligaVisiveis = () => {
    if (reduz || !('IntersectionObserver' in window)) { $$('.tit, .capa-tit, .mascara').forEach((el) => el.classList.add('vis')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      const el = en.target;
      if (en.isIntersecting) {
        el.classList.add('vis');
        if (el.dataset.contaAte) contaAte(el);
      } else el.classList.remove('vis');
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    $$('.tit, .capa-tit, .mascara, [data-conta-ate]').forEach((el) => io.observe(el));
  };
  addEventListener('salvi:pronto', () => setTimeout(ligaVisiveis, raiz.classList.contains('chegando') ? 350 : 120), { once: true });

  // ===================== ABAS (especialidades e Área do cliente) =====================
  $$('[role="tablist"]').forEach((lista) => {
    const abas = $$('[role="tab"]', lista);
    const ativa = (aba, foco = false) => {
      abas.forEach((a) => {
        const sim = a === aba;
        a.setAttribute('aria-selected', String(sim));
        a.tabIndex = sim ? 0 : -1;
        const painel = document.getElementById(a.getAttribute('aria-controls'));
        if (!painel) return;
        painel.hidden = !sim;
        if (sim) { painel.classList.remove('entra'); void painel.offsetWidth; painel.classList.add('entra'); $$('.mascara', painel).forEach((m) => m.classList.add('vis')); }
      });
      if (foco) aba.focus();
      requestAnimationFrame(rola);
    };
    abas.forEach((a, k) => {
      a.addEventListener('click', () => ativa(a));
      a.addEventListener('keydown', (e) => {
        const d = { ArrowRight: 1, ArrowLeft: -1, Home: -k, End: abas.length - 1 - k }[e.key];
        if (d === undefined) return;
        e.preventDefault();
        ativa(abas[(k + d + abas.length) % abas.length], true);
      });
    });
  });

  // ===================== ARRASTAR PARA O LADO (carrossel e avaliações) =====================
  const arrastavel = (el) => {
    let x0 = 0, s0 = 0, ativo = false, moveu = false;
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      ativo = true; moveu = false; x0 = e.clientX; s0 = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', (e) => {
      if (!ativo) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 5) { moveu = true; el.classList.add('arrastando'); }
      el.scrollLeft = s0 - dx;
    });
    const solta = () => { ativo = false; setTimeout(() => el.classList.remove('arrastando'), 30); };
    el.addEventListener('pointerup', solta);
    el.addEventListener('pointercancel', solta);
    el.addEventListener('click', (e) => { if (moveu) { e.preventDefault(); e.stopPropagation(); moveu = false; } }, true);
  };
  $$('.car-trilho, [data-mesa]').forEach(arrastavel);

  // ===================== CARROSSEL =====================
  $$('[data-carrossel]').forEach((car) => {
    const trilho = $('.car-trilho', car), barra = $('.car-barra', car);
    const passo = () => ($('.car-slide', trilho)?.getBoundingClientRect().width || 300) + 22;
    const vai = (d) => {
      const max = trilho.scrollWidth - trilho.clientWidth;
      const alvo = d > 0 && trilho.scrollLeft >= max - 4 ? 0 : d < 0 && trilho.scrollLeft <= 4 ? max : trilho.scrollLeft + d * passo();
      trilho.scrollTo({ left: alvo, behavior: reduz ? 'auto' : 'smooth' });
    };
    $$('[data-car]', car).forEach((b) => b.addEventListener('click', () => vai(+b.dataset.car)));
    trilho.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); vai(e.key === 'ArrowRight' ? 1 : -1); } });
    const mede = () => {
      const max = trilho.scrollWidth - trilho.clientWidth;
      barra.style.setProperty('--larg', limita(trilho.clientWidth / trilho.scrollWidth, 0.08, 1).toFixed(3));
      barra.style.setProperty('--pos', max > 0 ? (trilho.scrollLeft / max).toFixed(3) : 0);
    };
    trilho.addEventListener('scroll', mede, { passive: true });
    addEventListener('resize', mede);
    mede();
    // passa sozinho a cada 5 s; para com o mouse em cima, com foco, arrastando ou fora da tela
    if (!reduz) {
      let parado = false, naTela = false;
      car.addEventListener('pointerenter', () => { parado = true; });
      car.addEventListener('pointerleave', () => { parado = false; });
      car.addEventListener('focusin', () => { parado = true; });
      car.addEventListener('focusout', () => { parado = false; });
      new IntersectionObserver(([en]) => { naTela = en.isIntersecting; }).observe(car);
      setInterval(() => { if (!parado && naTela && !document.hidden) vai(1); }, 5000);
    }
  });

  // ===================== AGENDA POR PROFISSIONAL =====================
  const SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const EQ = Object.fromEntries((D.equipe || []).map((p) => [p.id, p]));
  const SV = Object.fromEntries((D.servicos || []).map((s) => [s.id, s]));
  const chaveDia = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const deChave = (k) => { const [a, m, d] = k.split('-').map(Number); return new Date(a, m - 1, d); };
  const diaCurto = (d) => `${SEMANA[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}`;
  // ocupação de demonstração: fixa para o mesmo dia, hora e profissional (a agenda real vem do sistema da clínica)
  const sorteio = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) % 100; };
  const pedidos = () => le('salvi-pedidos', []);
  const horarios = (prof, d, dur = 60, modal = 'Presencial') => {
    const ag = prof?.agenda;
    if (!ag || !ag.dias.includes(d.getDay())) return [];
    if (modal === 'Online' && !ag.online.includes(d.getDay())) return [];
    const fim = d.getDay() === 6 ? Math.min(ag.fim, 12) : ag.fim;
    const k = chaveDia(d), agora = new Date();
    const tomados = new Set(pedidos().filter((p) => p.prof === prof.id && p.data === k).map((p) => p.hora));
    const livres = [];
    for (let h = ag.ini; h + Math.ceil(dur / 60) <= fim; h++) {
      if (h === 12) continue; // almoço
      if (k === chaveDia(agora) && h <= agora.getHours() + 2) continue;
      if (sorteio(`${prof.id}|${k}|${h}`) < 46 || tomados.has(h)) continue;
      livres.push(h);
    }
    return livres;
  };
  const proximosDias = (n = 21) => Array.from({ length: n }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); return d; });
  const proximoLivre = (prof) => {
    for (const d of proximosDias(30)) { const h = horarios(prof, d); if (h.length) return `${diaCurto(d)} às ${h[0]}h`; }
    return '';
  };
  $$('[data-proximo]').forEach((el) => {
    const t = proximoLivre(EQ[el.dataset.proximo]);
    if (!t) return;
    el.textContent = el.closest('.ag-prof') ? `Próximo: ${t}` : el.closest('.perfil-agenda') ? `Próximo horário livre: ${t}` : t;
  });

  const form = $('[data-agenda]');
  const sel = { prof: '', dia: '', hora: null };
  if (form) {
    const fServ = $('#ag-servico', form), diasEl = $('[data-dias]', form), horasEl = $('[data-horas]', form);
    const resumo = $('[data-resumo]', form), erro = $('[data-erro]', form);
    const modal = () => $('input[name="modal"]:checked', form)?.value || 'Presencial';
    const servico = () => SV[fServ.value];
    const profsDo = () => servico().profs;

    const pintaProfs = () => {
      const ok = profsDo();
      $$('.ag-prof', form).forEach((l) => {
        const dentro = ok.includes(l.dataset.prof);
        l.classList.toggle('fora', !dentro);
        $('input', l).disabled = !dentro;
      });
      if (!ok.includes(sel.prof)) sel.prof = ok[0];
      $(`input[name="prof"][value="${sel.prof}"]`, form).checked = true;
      const online = $('input[value="Online"]', form);
      online.disabled = !servico().online;
      if (online.disabled && online.checked) $('input[value="Presencial"]', form).checked = true;
    };
    const pintaDias = () => {
      const prof = EQ[sel.prof], dur = servico().dur;
      const dias = proximosDias(21).map((d) => ({ d, n: horarios(prof, d, dur, modal()).length }));
      if (!dias.some((x) => x.n && chaveDia(x.d) === sel.dia)) { sel.dia = chaveDia(dias.find((x) => x.n)?.d || dias[0].d); sel.hora = null; }
      const rolaAteDia = () => { const s = $('[aria-checked="true"]', diasEl); if (s) diasEl.scrollLeft += s.getBoundingClientRect().left - diasEl.getBoundingClientRect().left - 4; };
      diasEl.innerHTML = dias.map(({ d, n }) => `<button type="button" class="ag-dia" role="radio" aria-checked="${chaveDia(d) === sel.dia}" data-dia="${chaveDia(d)}"${n ? '' : ' disabled'} aria-label="${diaCurto(d)}, ${n ? `${n} horários livres` : 'sem horário'}"><small>${SEMANA[d.getDay()].slice(0, 3)}</small><b>${d.getDate()}</b><small>${MESES[d.getMonth()]}</small><i>${n ? `${n} livres` : 'cheio'}</i></button>`).join('');
      rolaAteDia();
      pintaHoras();
    };
    const pintaHoras = () => {
      const livres = horarios(EQ[sel.prof], deChave(sel.dia), servico().dur, modal());
      if (!livres.includes(sel.hora)) sel.hora = null;
      horasEl.innerHTML = livres.length
        ? livres.map((h) => `<button type="button" class="ag-hora" role="radio" aria-checked="${h === sel.hora}" data-hora="${h}">${h}h00</button>`).join('')
        : '<p class="ag-vazio">Sem horário livre neste dia. Escolha outro dia ou outra profissional.</p>';
      pintaResumo();
    };
    const pintaResumo = () => {
      const s = servico(), p = EQ[sel.prof], d = deChave(sel.dia);
      resumo.innerHTML = sel.hora === null ? '' : `<b>${s.nome}</b> com ${p.nome}, ${modal().toLowerCase()}, ${diaCurto(d)} às ${sel.hora}h. Duração de ${s.dur} minutos, ${s.aPartir ? 'a partir de ' : ''}R$ ${s.preco.toLocaleString('pt-BR')}.`;
    };
    const tudo = () => { pintaProfs(); pintaDias(); };

    fServ.addEventListener('change', tudo);
    form.addEventListener('change', (e) => {
      if (e.target.name === 'prof') { sel.prof = e.target.value; pintaDias(); }
      if (e.target.name === 'modal') pintaDias();
    });
    diasEl.addEventListener('click', (e) => { const b = e.target.closest('[data-dia]'); if (!b) return; sel.dia = b.dataset.dia; $$('.ag-dia', diasEl).forEach((x) => x.setAttribute('aria-checked', String(x === b))); pintaHoras(); });
    horasEl.addEventListener('click', (e) => { const b = e.target.closest('[data-hora]'); if (!b) return; sel.hora = +b.dataset.hora; $$('.ag-hora', horasEl).forEach((x) => x.setAttribute('aria-checked', String(x === b))); pintaResumo(); });
    // setas do teclado dentro dos grupos de dias e de horários
    [diasEl, horasEl].forEach((g) => g.addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      const bs = $$('button:not(:disabled)', g), i = bs.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      const prox = bs[(i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length];
      prox.focus(); prox.click();
    }));

    // escolha vinda da URL (?prof=&serv=) ou de um botão da própria página
    const escolhe = ({ serv, prof }) => {
      if (serv && SV[serv]) fServ.value = serv;
      if (prof && EQ[prof]) {
        if (!SV[fServ.value].profs.includes(prof)) fServ.value = 'primeira-consulta';
        sel.prof = prof;
      }
      tudo();
    };
    const q = new URLSearchParams(location.search);
    sel.prof = 'bruna';
    escolhe({ serv: q.get('serv'), prof: q.get('prof') });
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-escolhe-serv], [data-escolhe-prof]');
      if (b) escolhe({ serv: b.dataset.escolheServ, prof: b.dataset.escolheProf });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      erro.textContent = '';
      const f = new FormData(form);
      const nome = String(f.get('nome') || '').trim(), tel = String(f.get('tel') || '').replace(/\D/g, ''), email = String(f.get('email') || '').trim();
      $$('input, select, textarea', form).forEach((c) => c.removeAttribute('aria-invalid'));
      const falha = (campo, msg) => { if (campo) { campo.setAttribute('aria-invalid', 'true'); campo.focus(); } erro.textContent = msg; };
      if (sel.hora === null) return falha(null, 'Escolha um dia e um horário livre.');
      if (nome.length < 3) return falha($('#ag-nome'), 'Escreva o seu nome completo.');
      if (tel.length < 10 || tel.length > 11) return falha($('#ag-tel'), 'Informe um WhatsApp com DDD.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return falha($('#ag-email'), 'Informe um e-mail válido.');
      if (!$('#ag-lgpd').checked) return falha($('#ag-lgpd'), 'Para enviar, aceite a Política de privacidade.');
      const s = servico(), p = EQ[sel.prof], d = deChave(sel.dia);
      const conv = String(f.get('convenio') || '').trim() || 'Particular';
      const obs = String(f.get('obs') || '').trim();
      const lista = pedidos();
      lista.push({ serv: s.id, prof: p.id, data: sel.dia, hora: sel.hora, modal: modal(), nome, criado: Date.now() });
      grava('salvi-pedidos', lista);
      const msg = `Olá! Quero agendar pelo site da ${D.marca}.\n\nServiço: ${s.nome}\nProfissional: ${p.nome}\nQuando: ${diaCurto(d)} às ${sel.hora}h (${modal().toLowerCase()})\nConvênio: ${conv}\nNome: ${nome}\nWhatsApp: ${f.get('tel')}\nE-mail: ${email}${obs ? `\nObservação: ${obs}` : ''}`;
      window.open(waLink(msg), '_blank', 'noopener');
      toast(`Pedido enviado: ${diaCurto(d)} às ${sel.hora}h com ${p.curto}. Confirmamos pelo WhatsApp.`);
      sel.hora = null;
      pintaDias();
    });
  }

  // ===================== CONVÊNIOS COM BUSCA =====================
  const conv = $('[data-convenios]');
  if (conv && D.convenios) {
    const campo = $('#conv-q'), lista = $('#conv-lista'), res = $('[data-conv-res]');
    let itens = [], foco = -1;
    const marca = (nome, q) => {
      const i = normal(nome).indexOf(q);
      return i < 0 || !q ? nome : `${nome.slice(0, i)}<mark>${nome.slice(i, i + q.length)}</mark>${nome.slice(i + q.length)}`;
    };
    const fecha = () => { lista.hidden = true; campo.setAttribute('aria-expanded', 'false'); campo.removeAttribute('aria-activedescendant'); foco = -1; };
    const mostra = (c, digitado) => {
      fecha();
      res.classList.remove('mostra'); void res.offsetWidth; res.classList.add('mostra');
      $$('[data-conv]', conv).forEach((b) => b.classList.toggle('marcado', c && b.dataset.conv === c.nome));
      if (c) {
        res.innerHTML = `<h3>${c.nome}</h3><span class="selo-tipo${c.tipo === 'direto' ? '' : ' reemb'}">${c.tipo === 'direto' ? 'Atendimento direto pelo plano' : 'Atendimento por reembolso'}</span><p>${c.obs}</p><a class="btn btn-cheio" href="#agendar" data-usa-conv="${c.nome}"><span class="btn-onda" aria-hidden="true"></span><span class="btn-txt">Agendar com este plano</span></a>`;
      } else {
        res.innerHTML = `<h3>Não achamos "${digitado.replace(/[<>"&]/g, '')}" na lista</h3><p>Quase todo plano com cobertura ambulatorial reembolsa a consulta com nutricionista. Mande o nome do seu plano no WhatsApp que conferimos para você.</p><a class="btn btn-cheio" href="${waLink(`Olá! Meu plano é ${digitado}. Ele cobre a consulta?`)}" target="_blank" rel="noopener"><span class="btn-onda" aria-hidden="true"></span><span class="btn-txt">Perguntar no WhatsApp</span></a>`;
      }
    };
    const filtra = () => {
      const q = normal(campo.value);
      itens = q ? D.convenios.filter((c) => normal(c.nome).includes(q)) : [];
      foco = -1;
      lista.innerHTML = itens.map((c, i) => `<li role="option" id="conv-op-${i}" aria-selected="false" data-i="${i}"><span>${marca(c.nome, q)}</span><small>${c.tipo === 'direto' ? 'direto' : 'reembolso'}</small></li>`).join('') || (q ? '<li role="option" aria-disabled="true" aria-selected="false">Nenhum plano com esse nome</li>' : '');
      lista.hidden = !q;
      campo.setAttribute('aria-expanded', String(!!q));
    };
    campo.addEventListener('input', filtra);
    campo.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!itens.length) return;
        e.preventDefault();
        foco = (foco + (e.key === 'ArrowDown' ? 1 : -1) + itens.length) % itens.length;
        $$('li', lista).forEach((li, i) => li.setAttribute('aria-selected', String(i === foco)));
        campo.setAttribute('aria-activedescendant', `conv-op-${foco}`);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (!campo.value.trim()) return;
        mostra(itens[foco >= 0 ? foco : 0] || null, campo.value.trim());
      } else if (e.key === 'Escape') fecha();
    });
    lista.addEventListener('pointerdown', (e) => { const li = e.target.closest('[data-i]'); if (!li) return; e.preventDefault(); const c = itens[+li.dataset.i]; campo.value = c.nome; mostra(c); });
    campo.addEventListener('blur', () => setTimeout(fecha, 120));
    conv.addEventListener('click', (e) => {
      const b = e.target.closest('[data-conv]');
      if (b) { const c = D.convenios.find((x) => x.nome === b.dataset.conv); campo.value = c.nome; mostra(c); }
      const u = e.target.closest('[data-usa-conv]');
      if (u && $('#ag-conv')) $('#ag-conv').value = u.dataset.usaConv;
    });
  }

  // ===================== TOUR VIRTUAL EM CILINDRO 3D =====================
  const tourApp = $('[data-tour]');
  if (tourApp && D.tour) {
    const visor = $('.tour-visor', tourApp), cil = $('.tour-cil', tourApp), leg = $('.tour-legenda', tourApp);
    const voce = $('.planta-voce', tourApp);
    const SALA = Object.fromEntries(D.tour.map((t) => [t.id, t]));
    const ARCO = 150, N = 40, PASSO = ARCO / N;
    let sala = D.tour[0], yaw = 0, vel = 0, limite = 40, P = 620, mexeu = false;
    const rad = (g) => (g * Math.PI) / 180;
    const aplica = () => { cil.style.setProperty('--yaw', `${yaw.toFixed(2)}deg`); };
    const monta = () => {
      P = parseFloat(getComputedStyle(visor).getPropertyValue('--P')) || 620;
      const w = 2 * P * Math.tan(rad(PASSO / 2)), total = w * N, h = total / 2;
      const meioFov = (Math.atan(visor.clientWidth / 2 / P) * 180) / Math.PI;
      limite = Math.max(0, ARCO / 2 - meioFov);
      yaw = limita(yaw, -limite, limite);
      const fatias = Array.from({ length: N }, (_, i) => {
        const a = ARCO / 2 - PASSO * (i + 0.5);
        return `<div class="tour-fatia" style="width:${(w + 0.8).toFixed(2)}px;height:${h.toFixed(1)}px;margin:${(-h / 2).toFixed(1)}px 0 0 ${(-w / 2).toFixed(2)}px;background-image:url('${sala.src}');background-size:${total.toFixed(1)}px ${h.toFixed(1)}px;background-position:${(-i * w).toFixed(2)}px 0;transform:rotateY(${a.toFixed(3)}deg) translateZ(${(-P).toFixed(1)}px)"></div>`;
      }).join('');
      // portas: yaw positivo fica à direita
      const portas = sala.liga.map(([id, y]) => `<button type="button" class="tour-porta" data-ir="${id}" style="transform:rotateY(${-y}deg) translateZ(${(-P + 4).toFixed(1)}px) translateY(${(h * 0.08).toFixed(1)}px)" aria-label="Ir para: ${SALA[id].nome}"><i>${'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6.5 18.5 12 13 17.5"/></svg>'}</i><span>${SALA[id].nome}</span></button>`).join('');
      cil.innerHTML = fatias + portas;
      aplica();
    };
    const marcaPlanta = () => {
      $$('.planta-sala', tourApp).forEach((g) => g.classList.toggle('ativa', g.dataset.sala === sala.id));
      $$('.tour-salas button', tourApp).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sala === sala.id)));
      const [x, y, w, h] = sala.planta;
      voce?.setAttribute('cx', x + w / 2); voce?.setAttribute('cy', y + h - 14);
      leg.innerHTML = `<b>${sala.nome}</b><span>${sala.texto}</span>`;
      visor.setAttribute('aria-label', `Tour virtual: ${sala.nome}. ${sala.alt}. Use as setas para olhar em volta.`);
    };
    const vaiPara = (id) => {
      if (!SALA[id] || id === sala.id) return;
      const img = new Image();
      img.src = SALA[id].src;
      visor.classList.add('troca');
      const troca = () => { sala = SALA[id]; yaw = 0; vel = 0; monta(); marcaPlanta(); requestAnimationFrame(() => visor.classList.remove('troca')); };
      Promise.all([img.decode?.().catch(() => {}), new Promise((ok) => setTimeout(ok, reduz ? 0 : 420))]).then(troca);
    };
    monta(); marcaPlanta();
    visor.classList.add('tour-pronto');
    addEventListener('resize', monta);

    // arrastar com inércia; teclado gira de 8 em 8 graus
    let x0 = 0, y0Yaw = 0, arrastando = false, ultX = 0, ultT = 0;
    visor.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.tour-porta')) return;
      arrastando = true; x0 = ultX = e.clientX; y0Yaw = yaw; ultT = performance.now(); vel = 0;
      visor.setPointerCapture(e.pointerId);
    });
    visor.addEventListener('pointermove', (e) => {
      if (!arrastando) return;
      const grauPx = 180 / Math.PI / P;
      yaw = limita(y0Yaw - (e.clientX - x0) * grauPx, -limite, limite);
      const t = performance.now();
      vel = (-(e.clientX - ultX) * grauPx) / Math.max(1, t - ultT) * 16;
      ultX = e.clientX; ultT = t;
      if (!mexeu && Math.abs(e.clientX - x0) > 6) { mexeu = true; visor.classList.add('mexeu'); }
      aplica();
    });
    const solta = () => { arrastando = false; };
    visor.addEventListener('pointerup', solta);
    visor.addEventListener('pointercancel', solta);
    visor.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      yaw = limita(yaw + (e.key === 'ArrowRight' ? 8 : -8), -limite, limite);
      mexeu = true; visor.classList.add('mexeu');
      aplica();
    });
    // inércia ao soltar e um passeio lento enquanto ninguém mexeu
    let naTela = false, t0 = performance.now();
    new IntersectionObserver(([en]) => { naTela = en.isIntersecting; }).observe(visor);
    const anda = (t) => {
      if (naTela && !arrastando) {
        if (Math.abs(vel) > 0.01 && !reduz) { yaw = limita(yaw + vel, -limite, limite); vel *= 0.92; aplica(); }
        else if (!mexeu && !reduz) { yaw = Math.sin((t - t0) / 5200) * limite * 0.8; aplica(); }
      }
      requestAnimationFrame(anda);
    };
    requestAnimationFrame(anda);
    tourApp.addEventListener('click', (e) => {
      const b = e.target.closest('[data-ir], [data-sala]');
      if (b) vaiPara(b.dataset.ir || b.dataset.sala);
    });
    $$('.planta-sala', tourApp).forEach((g) => {
      g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', `Ir para: ${SALA[g.dataset.sala].nome}`);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); vaiPara(g.dataset.sala); } });
    });
  }

  // ===================== GALERIA E FOTO AMPLIADA =====================
  const galeria = $('.galeria');
  if (galeria) {
    const itens = $$('.gal-grade li', galeria), lb = $('.lightbox', galeria);
    const lbImg = $('img', lb), lbLeg = $('figcaption', lb);
    let atual = 0;
    $$('[data-filtro]', galeria).forEach((b) => b.addEventListener('click', () => {
      $$('[data-filtro]', galeria).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      let o = 0;
      itens.forEach((li) => {
        const mostra = b.dataset.filtro === 'Todas' || li.dataset.cat === b.dataset.filtro;
        li.classList.toggle('escondida', !mostra);
        li.classList.remove('chega');
        if (mostra) { li.style.setProperty('--o', o++); void li.offsetWidth; li.classList.add('chega'); }
      });
    }));
    const visiveis = () => itens.filter((li) => !li.classList.contains('escondida')).map((li) => $('.gal-item', li));
    const abre = (i) => {
      const v = visiveis();
      atual = (i + v.length) % v.length;
      lbImg.src = v[atual].dataset.full;
      lbImg.alt = $('img', v[atual]).alt;
      lbLeg.textContent = v[atual].dataset.legenda;
      if (!lb.open) lb.showModal();
    };
    galeria.addEventListener('click', (e) => { const b = e.target.closest('.gal-item'); if (b) abre(visiveis().indexOf(b)); });
    $$('[data-lb]', lb).forEach((b) => b.addEventListener('click', () => abre(atual + +b.dataset.lb)));
    lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') abre(atual + 1); if (e.key === 'ArrowLeft') abre(atual - 1); });
  }

  // ===================== BLOG: assunto e busca =====================
  const blog = $('[data-blog]');
  if (blog) {
    let cat = 'Todos';
    const q = $('#blog-q'), vazio = $('[data-blog-vazio]');
    const filtra = () => {
      const t = normal(q.value);
      let n = 0;
      $$('.post-item', blog).forEach((p) => { const ok = (cat === 'Todos' || p.dataset.cat === cat) && (!t || normal(p.dataset.busca).includes(t)); p.classList.toggle('escondida', !ok); n += ok; });
      vazio.hidden = n > 0;
      requestAnimationFrame(rola);
    };
    $$('[data-blog-cat]').forEach((b) => b.addEventListener('click', () => { cat = b.dataset.blogCat; $$('[data-blog-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); filtra(); }));
    q.addEventListener('input', filtra);
  }

  // ===================== JANELAS LEGAIS E COOKIES =====================
  document.addEventListener('click', (e) => {
    const abre = e.target.closest('[data-doc]');
    if (abre) { e.preventDefault(); document.getElementById(`doc-${abre.dataset.doc}`)?.showModal(); }
    if (e.target.closest('[data-fecha]')) e.target.closest('dialog')?.close();
    if (e.target.matches('dialog')) e.target.close(); // clique fora do conteúdo
    if (e.target.closest('[data-demo]')) toast('Na demonstração os arquivos não são baixados. No site do cliente, o PDF abre aqui.');
  });
  const cookies = $('#cookies');
  if (cookies) {
    if (!le('salvi-cookies', null)) setTimeout(() => { cookies.hidden = false; iguala(); }, raiz.classList.contains('intro') ? 2600 : 800);
    cookies.addEventListener('click', (e) => {
      const b = e.target.closest('[data-ck]');
      if (!b) return;
      grava('salvi-cookies', { escolha: b.dataset.ck, data: new Date().toISOString() });
      cookies.hidden = true;
    });
    document.addEventListener('click', (e) => { if (e.target.closest('[data-cookies]')) { cookies.hidden = false; iguala(); } });
  }

  // ===================== CONTATO =====================
  const ct = $('[data-contato]');
  ct?.addEventListener('submit', (e) => {
    e.preventDefault();
    const erro = $('[data-erro]', ct), f = new FormData(ct);
    erro.textContent = '';
    $$('input, textarea', ct).forEach((c) => c.removeAttribute('aria-invalid'));
    const falha = (id, msg) => { const c = $(id); c.setAttribute('aria-invalid', 'true'); c.focus(); erro.textContent = msg; };
    if (String(f.get('nome')).trim().length < 3) return falha('#ct-nome', 'Escreva o seu nome.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(f.get('email')).trim())) return falha('#ct-email', 'Informe um e-mail válido.');
    if (String(f.get('msg')).trim().length < 10) return falha('#ct-msg', 'Conte um pouco mais na mensagem.');
    if (!$('#ct-lgpd').checked) return falha('#ct-lgpd', 'Para enviar, aceite a Política de privacidade.');
    ct.reset();
    toast('Mensagem recebida. Respondemos em até um dia útil, pelo e-mail ou pelo WhatsApp.');
  });

  // ===================== PLANOS ALIMENTARES (comuns à equipe e ao paciente) =====================
  const EA = D.equipeArea;
  const CAT = Object.fromEntries((EA?.categorias || []).map((c) => [c.id, c]));
  const copia = (o) => JSON.parse(JSON.stringify(o));
  const escHtml = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pacientesTodos = () => [...(EA?.pacientes || []), ...le('salvi-pacientes-novos', [])];
  // o plano salvo pela nutricionista vale mais que o modelo da categoria
  const planoDe = (pac) => le('salvi-planos', {})[pac.id] || { categoria: pac.categoria, ...copia(CAT[pac.categoria].plano) };
  const triagemDe = (pac) => ({ ...(pac.triagem || {}), ...(le('salvi-triagens', {})[pac.id] || {}) });
  const guardaEm = (chave, id, valor) => { const t = le(chave, {}); t[id] = valor; grava(chave, t); };
  const dataNum = (k) => { const d = deChave(k); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; };
  const hojeChave = () => chaveDia(new Date());
  const slug = (s) => normal(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // ---------- PDF do plano alimentar, gerado no navegador, sem biblioteca ----------
  // PDF 1.4 com as fontes padrão do leitor (Helvetica e Times) em WinAnsi, que tem os acentos do português.
  const baixaPlanoPdf = ({ pac, plano, triagem, prof }) => {
    const L = 595.28, A = 841.89, M = 50;
    const limpa = (s) => String(s ?? '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/[^\x20-\xFF]/g, '');
    const txt = (s) => limpa(s).replace(/[\\()]/g, '\\$&');
    // largura aproximada da Helvetica, só para quebrar as linhas sem passar da margem
    const larg = (s, t) => [...limpa(s)].reduce((a, c) => a + (/[il.,:;'!|\s]/.test(c) ? 280 : /[fjrtI]/.test(c) ? 340 : /[mwMW]/.test(c) ? 860 : /[A-Z0-9]/.test(c) ? 680 : 570), 0) * t / 1000;
    const quebra = (s, t, max) => {
      const linhas = []; let atual = '';
      for (const p of limpa(s).split(/\s+/).filter(Boolean)) { const tenta = atual ? `${atual} ${p}` : p; if (larg(tenta, t) > max && atual) { linhas.push(atual); atual = p; } else atual = tenta; }
      if (atual) linhas.push(atual);
      return linhas;
    };
    const cor = (h) => h.match(/\w\w/g).map((x) => (parseInt(x, 16) / 255).toFixed(3)).join(' ');
    const paginas = [];
    let ops, y;
    const texto = (s, x, yy, t, fonte = 'F1', c = '22301F') => ops.push(`BT /${fonte} ${t} Tf ${cor(c)} rg ${x.toFixed(1)} ${yy.toFixed(1)} Td (${txt(s)}) Tj ET`);
    const caixa = (x, yy, w, h, c) => ops.push(`${cor(c)} rg ${x.toFixed(1)} ${yy.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)} re f`);
    const novaPagina = () => { ops = []; paginas.push(ops); caixa(0, A - 8, L, 8, '2E4430'); y = A - 56; };
    const cabe = (h) => { if (y - h < 80) novaPagina(); };
    const paragrafo = (s, t = 10.5, x = M, c = '4F5848') => quebra(s, t, L - x - M).forEach((l) => { cabe(t * 1.5); texto(l, x, y, t, 'F1', c); y -= t * 1.5; });
    const titulo = (s) => { cabe(44); y -= 10; texto(s.toUpperCase(), M, y, 8.5, 'F2', 'C4582F'); y -= 18; };
    const marcador = (s) => quebra(s, 10.5, L - M * 2 - 16).forEach((l, i) => { cabe(16); if (!i) caixa(M + 2, y + 2.5, 5, 5, '6F8A65'); texto(l, M + 16, y, 10.5); y -= 15.5; });

    // capa: faixa da marca com o nome do paciente
    novaPagina();
    caixa(0, A - 140, L, 140, '1D2A1F');
    texto('Salvi', M, A - 64, 28, 'F3', 'F2EBDD');
    texto('NUTRIÇÃO', M + 2, A - 80, 8, 'F2', 'B9C2AE');
    texto('Plano alimentar', L - M - larg('Plano alimentar', 19) * 0.92, A - 62, 19, 'F3', 'EE7B4C');
    texto(pac.nome, M, A - 116, 17, 'F2', 'F2EBDD');
    const nomeCat = CAT[plano.categoria || pac.categoria]?.nome || '';
    texto(nomeCat, L - M - larg(nomeCat, 10.5), A - 114, 10.5, 'F1', 'B9C2AE');
    y = A - 176;
    const dados = [['Nutricionista', `${prof.nome}, ${prof.crn}`], ['Emitido em', dataNum(hojeChave())], ['Próxima consulta', pac.proxima ? dataNum(pac.proxima) : 'a combinar']];
    dados.forEach(([r, v], i) => { const x = M + i * ((L - 2 * M) / 3); texto(r.toUpperCase(), x, y, 7.5, 'F2', '737A6B'); texto(v, x, y - 15, 10.5, 'F2'); });
    y -= 38;
    caixa(M, y, L - 2 * M, 0.8, 'DCE4D2');
    y -= 8;
    if (triagem.objetivo) { titulo('Objetivo'); paragrafo(triagem.objetivo, 11.5, M, '22301F'); }
    const cuidados = [['Alergias e restrições', triagem.restricoes], ['Medicações e suplementos', triagem.medicacoes]].filter(([, v]) => v);
    if (cuidados.length) { titulo('Cuidados'); cuidados.forEach(([r, v]) => paragrafo(`${r}: ${v}`)); }

    titulo('Refeições');
    plano.refeicoes.forEach((r) => {
      cabe(30 + Math.min(r.opcoes.length, 3) * 16);
      caixa(M, y - 6, L - 2 * M, 24, 'F4EEE4');
      texto(r.nome, M + 10, y + 1, 12, 'F2');
      if (r.hora) texto(r.hora, L - M - 10 - larg(r.hora, 10), y + 1, 10, 'F2', 'C4582F');
      y -= 26;
      r.opcoes.filter((o) => o.trim()).forEach(marcador);
      y -= 8;
    });
    if (plano.orientacoes?.trim()) { titulo('Orientações'); paragrafo(plano.orientacoes); }
    const metas = (plano.metas || []).filter((m) => m.trim());
    if (metas.length) { titulo('Metas até a próxima consulta'); metas.forEach(marcador); }
    // assinatura
    cabe(70);
    y -= 40;
    caixa(M, y + 14, 200, 0.8, '22301F');
    texto(prof.nome, M, y, 10.5, 'F2');
    texto(`Nutricionista, ${prof.crn}`, M, y - 14, 9, 'F1', '737A6B');

    // rodapé com a numeração, agora que o total de páginas é conhecido
    const lg = D.legal || {};
    paginas.forEach((p, i) => {
      ops = p;
      caixa(M, 52, L - 2 * M, 0.6, 'DCE4D2');
      texto(`${lg.razao || ''}, CNPJ ${lg.cnpj || ''}. ${lg.whatsapp ? `WhatsApp ${lg.whatsapp}.` : ''}`, M, 38, 7.5, 'F1', '737A6B');
      texto(`Plano individual de ${pac.nome}. Não substitui a orientação da consulta.`, M, 27, 7.5, 'F1', '737A6B');
      const pg = `Página ${i + 1} de ${paginas.length}`;
      texto(pg, L - M - larg(pg, 7.5), 38, 7.5, 'F2', '737A6B');
    });

    // montagem do arquivo: objetos, tabela de posições e trailer
    const objs = [];
    const poe = (s) => objs.push(s);
    poe(''); poe(''); // catálogo e árvore de páginas, preenchidos no fim
    poe('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    poe('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    poe('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>');
    const kids = paginas.map((p) => {
      const corpo = p.join('\n');
      const c = poe(`<< /Length ${corpo.length} >>\nstream\n${corpo}\nendstream`);
      return poe(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${L} ${A}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${c} 0 R >>`);
    });
    objs[0] = '<< /Type /Catalog /Pages 2 0 R >>';
    objs[1] = `<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(' ')}] /Count ${kids.length} >>`;
    const info = poe(`<< /Title (${txt(`Plano alimentar de ${pac.nome}`)}) /Author (${txt(`${prof.nome}, ${D.marca}`)}) /Producer (${txt(D.marca)}) >>`);
    let out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    const pos = objs.map((o, i) => { const p = out.length; out += `${i + 1} 0 obj\n${o}\nendobj\n`; return p; });
    const xref = out.length;
    out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${pos.map((p) => `${String(p).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    const bytes = Uint8Array.from(out, (c) => c.charCodeAt(0) & 255);
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `plano-alimentar-${slug(pac.nome)}.pdf` });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast(`PDF baixado: plano alimentar de ${pac.nome}.`);
  };

  // ===================== ÁREA DO CLIENTE (demonstração) =====================
  const area = $('[data-area]');
  if (area && D.area) {
    const A = D.area, login = $('[data-area-login]'), painel = $('[data-painel]'), fl = $('[data-login]');
    // o plano da paciente é o que a nutricionista salvou na área da equipe (ou o modelo da categoria)
    const pacLogin = () => pacientesTodos().find((p) => p.id === EA?.pacienteDoLogin);
    const pintaPlanoPaciente = () => {
      const pac = pacLogin();
      if (!pac) return;
      const plano = planoDe(pac);
      $('[data-plano-paciente]').innerHTML = plano.refeicoes.map((r) => `<li><div class="ref-hora"><b>${escHtml(r.nome)}</b><span>${escHtml(r.hora)}</span></div><ul>${r.opcoes.filter((o) => o.trim()).map((o) => `<li>${escHtml(o)}</li>`).join('')}</ul></li>`).join('');
      $('[data-orient-paciente]').innerHTML = plano.orientacoes ? `<h2>Orientações</h2><p>${escHtml(plano.orientacoes)}</p>` : '';
    };
    $('[data-pdf-paciente]')?.addEventListener('click', () => { const pac = pacLogin(); baixaPlanoPdf({ pac, plano: planoDe(pac), triagem: triagemDe(pac), prof: EQ[pac.prof] }); });
    const entra = () => { login.hidden = true; painel.hidden = false; montaPainel(); pintaPlanoPaciente(); scrollTo(0, 0); requestAnimationFrame(rola); };
    // máscara do CPF: 000.000.000-00 enquanto digita
    $('#ar-cpf').addEventListener('input', (e) => {
      const d = e.target.value.replace(/\D/g, '').slice(0, 11);
      e.target.value = d.replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
    });
    fl.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = $('#ar-cpf').value.replace(/\D/g, '') === A.login.cpf.replace(/\D/g, '') && $('#ar-senha').value === A.login.senha;
      $('[data-erro]', fl).textContent = ok ? '' : 'CPF ou senha não conferem. Na demonstração, use os dados mostrados abaixo.';
      if (ok) { grava('salvi-cliente', true, sessionStorage); entra(); }
    });
    $('[data-sair]').addEventListener('click', () => { grava('salvi-cliente', false, sessionStorage); painel.hidden = true; login.hidden = false; });

    let montado = false;
    const montaPainel = () => {
      if (montado) return;
      montado = true;
      // consultas: a de demonstração e os pedidos feitos neste aparelho
      const consultas = $('[data-consultas]');
      const pintaConsultas = () => {
        const meus = pedidos().map((p, i) => ({ ...p, i }));
        const dataP = deChave(A.proxima.data);
        consultas.innerHTML = `<div class="consulta-item"><b>${diaCurto(dataP)} às ${A.proxima.hora}</b><span>${A.proxima.servico} com ${EQ[A.paciente.prof].nome}, ${A.proxima.modal.toLowerCase()}. Confirmada.</span></div>${meus.map((p) => `<div class="consulta-item"><b>${diaCurto(deChave(p.data))} às ${p.hora}h</b><span>${SV[p.serv]?.nome || 'Consulta'} com ${EQ[p.prof]?.nome || ''}, ${p.modal.toLowerCase()}. Aguardando confirmação.</span><button type="button" class="link" data-cancela="${p.i}">Cancelar este pedido</button></div>`).join('')}`;
      };
      pintaConsultas();
      consultas.addEventListener('click', (e) => {
        const b = e.target.closest('[data-cancela]');
        if (!b) return;
        const l = pedidos(); l.splice(+b.dataset.cancela, 1); grava('salvi-pedidos', l);
        pintaConsultas();
        toast('Pedido cancelado. O horário voltou para a agenda.');
      });
      // listas que lembram o que foi marcado
      const marcaveis = (sel, chave) => {
        const salvo = le(chave, []);
        $$(sel).forEach((c) => { c.checked = salvo.includes(c.dataset.meta ?? c.dataset.compra); c.addEventListener('change', () => grava(chave, $$(sel).filter((x) => x.checked).map((x) => x.dataset.meta ?? x.dataset.compra))); });
      };
      marcaveis('[data-meta]', 'salvi-metas');
      marcaveis('[data-compra]', 'salvi-compras');
      // água do dia
      const hoje = chaveDia(new Date()), copos = $$('[data-copo]');
      const pintaAgua = (n) => { copos.forEach((c, i) => c.setAttribute('aria-pressed', String(i < n))); $('[data-agua-n]').textContent = n; };
      pintaAgua(le(`salvi-agua-${hoje}`, 0));
      copos.forEach((c, i) => c.addEventListener('click', () => { const atual = le(`salvi-agua-${hoje}`, 0); const n = atual === i + 1 ? i : i + 1; grava(`salvi-agua-${hoje}`, n); pintaAgua(n); }));
      // gráfico da evolução
      const svg = $('[data-grafico]'), legG = $('[data-grafico-leg]');
      const ROT = { cintura: ['Cintura', 'cm'], musculo: ['Massa muscular', 'kg'], energia: ['Energia', 'de 5'] };
      const grafico = (campo) => {
        const pts = A.evolucao, vals = pts.map((p) => p[campo]);
        const mn = Math.min(...vals), mx = Math.max(...vals), folga = (mx - mn || 1) * 0.35;
        const X = (i) => 60 + (i * 480) / Math.max(1, pts.length - 1);
        const Y = (v) => 200 - ((v - (mn - folga)) / (mx - mn + 2 * folga)) * 170;
        const linha = pts.map((p, i) => `${X(i).toFixed(1)},${Y(p[campo]).toFixed(1)}`).join(' ');
        svg.innerHTML = `<line class="g-eixo" x1="40" y1="210" x2="580" y2="210"/>${[0.25, 0.5, 0.75].map((f) => `<line class="g-eixo" x1="40" y1="${210 - f * 180}" x2="580" y2="${210 - f * 180}" stroke-dasharray="3 6"/>`).join('')}
          <polygon class="g-area" points="${X(0)},210 ${linha} ${X(pts.length - 1)},210"/>
          <polyline class="g-linha" pathLength="1" points="${linha}"/>
          ${pts.map((p, i) => `<circle class="g-ponto" cx="${X(i)}" cy="${Y(p[campo])}" r="7"/><text class="g-valor" x="${X(i)}" y="${Y(p[campo]) - 16}">${String(p[campo]).replace('.', ',')}</text><text class="g-rot" x="${X(i)}" y="240" text-anchor="middle">${diaCurto(deChave(p.data)).split(', ')[1]}</text>`).join('')}`;
        const dif = vals.at(-1) - vals[0];
        legG.textContent = `${ROT[campo][0]}: de ${String(vals[0]).replace('.', ',')} para ${String(vals.at(-1)).replace('.', ',')} ${ROT[campo][1]} em ${pts.length} consultas (${dif > 0 ? '+' : ''}${String(+dif.toFixed(1)).replace('.', ',')}).`;
        svg.setAttribute('aria-label', legG.textContent);
      };
      grafico('cintura');
      $$('[data-evo]').forEach((b) => b.addEventListener('click', () => { $$('[data-evo]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); grafico(b.dataset.evo); }));
      // diário alimentar
      const fd = $('[data-diario]'), listaD = $('[data-diario-lista]');
      const pintaDiario = () => {
        const itens = le('salvi-diario', []);
        listaD.innerHTML = itens.length ? itens.slice().reverse().map((d) => `<li><span><b>${d.ref}</b>: ${d.txt.replace(/[<>&]/g, '')}</span><small>Fome ${d.fome.toLowerCase()}, ${d.quando}</small></li>`).join('') : '<li><span>Nada anotado ainda. Anote a próxima refeição, sem julgamento: o diário serve para a conversa no retorno.</span></li>';
      };
      pintaDiario();
      fd.addEventListener('submit', (e) => {
        e.preventDefault();
        const f = new FormData(fd), txt = String(f.get('txt')).trim();
        if (!txt) { $('#di-txt').focus(); return; }
        const itens = le('salvi-diario', []);
        const agora = new Date();
        itens.push({ ref: f.get('ref'), txt, fome: f.get('fome'), quando: `${diaCurto(agora)} às ${agora.getHours()}h${String(agora.getMinutes()).padStart(2, '0')}` });
        grava('salvi-diario', itens.slice(-30));
        $('#di-txt').value = '';
        pintaDiario();
        toast('Anotado no diário.');
      });
      iguala();
    };
    // quem já entrou nesta visita volta direto ao painel (depois de montaPainel existir)
    if (le('salvi-cliente', false, sessionStorage)) entra();
  }

  // ===================== ÁREA DA EQUIPE: pacientes, triagem e plano alimentar =====================
  const formPro = $('[data-login-pro]');
  if (area && EA && formPro) {
    const loginBox = $('[data-area-login]'), formPac = $('[data-login]'), painelPro = $('[data-painel-pro]');
    const lista = $('[data-pro-pacientes]'), ficha = $('[data-pro-ficha]'), busca = $('#pro-busca');
    const novoBtn = $('[data-pro-novo]'), novoForm = $('[data-pro-novo-form]');
    let prof = null, pac = null, aba = 'triagem', rascunho = null;
    const categoriaDe = (p) => le('salvi-planos', {})[p.id]?.categoria || p.categoria;
    const ICX = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

    // paciente ou equipe: troca o formulário de entrada
    loginBox.addEventListener('click', (e) => {
      const b = e.target.closest('[data-papel]');
      if (!b) return;
      const equipe = b.dataset.papel === 'equipe';
      formPac.hidden = equipe; formPro.hidden = !equipe;
      $$('[data-papel]', loginBox).forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.papel === b.dataset.papel)));
      $$(`[data-papel="${b.dataset.papel}"]`, equipe ? formPro : formPac)[0]?.focus();
      $$('.mascara', loginBox).forEach((m) => m.classList.add('vis'));
      $$('.tit', equipe ? formPro : formPac).forEach((t) => t.classList.add('vis'));
      iguala();
    });

    const entraPro = (id) => {
      prof = EQ[id];
      if (!prof) return;
      grava('salvi-pro', id, sessionStorage);
      loginBox.hidden = true; painelPro.hidden = false;
      $('[data-pro-ola]').textContent = `Olá, ${prof.curto}`;
      pintaLista();
      const primeiro = pacientesTodos().find((p) => p.prof === prof.id);
      if (primeiro) escolhe(primeiro.id, false); else ficha.innerHTML = '<p class="pro-vazio">Nenhum paciente ainda. Crie o primeiro em "Novo paciente".</p>';
      scrollTo(0, 0);
      requestAnimationFrame(rola);
    };
    formPro.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = $('#pro-senha').value === EA.senha;
      $('[data-erro]', formPro).textContent = ok ? '' : 'Senha incorreta. Na demonstração, a senha já vem preenchida.';
      if (ok) entraPro($('#pro-quem').value);
    });
    $('[data-sair-pro]').addEventListener('click', () => { grava('salvi-pro', '', sessionStorage); painelPro.hidden = true; loginBox.hidden = false; });

    // lista de pacientes da profissional, com busca
    const meus = () => pacientesTodos().filter((p) => p.prof === prof.id);
    const pintaLista = () => {
      const t = normal(busca.value);
      const ps = meus().filter((p) => !t || normal(p.nome).includes(t));
      $('[data-pro-sub]').textContent = `${meus().length} pacientes em acompanhamento. Toque num nome para abrir a triagem e o plano.`;
      lista.innerHTML = ps.map((p) => `<li><button type="button" class="pro-pac" data-pac="${p.id}"${pac?.id === p.id ? ' aria-current="true"' : ''}><b>${escHtml(p.nome)}</b><span>${escHtml(CAT[categoriaDe(p)]?.nome || '')}</span><small>${p.proxima ? `Próxima consulta: ${dataNum(p.proxima)}` : 'Sem consulta marcada'}</small></button></li>`).join('') || '<li class="pro-vazio">Nenhum paciente com esse nome.</li>';
    };
    busca.addEventListener('input', pintaLista);
    lista.addEventListener('click', (e) => { const b = e.target.closest('[data-pac]'); if (b) escolhe(b.dataset.pac, true); });

    // novo paciente já nasce com o modelo da categoria escolhida
    novoBtn.addEventListener('click', () => { novoForm.hidden = !novoForm.hidden; novoBtn.setAttribute('aria-expanded', String(!novoForm.hidden)); if (!novoForm.hidden) $('#pn-nome').focus(); });
    novoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = $('#pn-nome').value.trim().replace(/\s+/g, ' ');
      if (nome.length < 3) { $('#pn-nome').setAttribute('aria-invalid', 'true'); $('#pn-nome').focus(); return; }
      $('#pn-nome').removeAttribute('aria-invalid');
      const novo = { id: `${slug(nome)}-${Date.now().toString(36)}`, nome, prof: prof.id, categoria: $('#pn-cat').value, desde: hojeChave(), proxima: '', triagem: {} };
      grava('salvi-pacientes-novos', [...le('salvi-pacientes-novos', []), novo]);
      novoForm.reset(); novoForm.hidden = true; novoBtn.setAttribute('aria-expanded', 'false');
      aba = 'triagem';
      escolhe(novo.id, true);
      toast(`${nome} entrou na sua lista com o modelo de ${CAT[novo.categoria].nome}.`);
    });

    // ficha do paciente: cabeçalho, triagem e editor do plano
    const primeiroNome = (n) => n.split(' ')[0];
    const escolhe = (id, rolar) => {
      pac = pacientesTodos().find((p) => p.id === id);
      if (!pac) return;
      rascunho = planoDe(pac);
      pintaLista();
      pintaFicha();
      if (rolar && innerWidth < 980) ficha.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'start' });
    };
    const campoTriagem = ([k, rot]) => `<label class="campo${['objetivo', 'observacoes', 'rotina'].includes(k) ? ' campo-largo' : ''}" for="tg-${k}"><span>${rot}</span><textarea id="tg-${k}" data-tg="${k}" rows="2">${escHtml(triagemDe(pac)[k] || '')}</textarea></label>`;
    const editor = () => `
      <div class="ed-topo">
        <label class="campo" for="ed-cat"><span>Categoria do plano</span><select id="ed-cat" data-ed-cat>${EA.categorias.map((c) => `<option value="${c.id}"${c.id === rascunho.categoria ? ' selected' : ''}>${c.nome}</option>`).join('')}</select></label>
        <button type="button" class="btn btn-linha" data-ed-modelo><span class="btn-onda" aria-hidden="true"></span><span class="btn-txt">Usar o modelo desta categoria</span></button>
      </div>
      <p class="ed-dica">O modelo é o ponto de partida. Ajuste refeições, horários e opções ao que ${escHtml(primeiroNome(pac.nome))} precisa.</p>
      <ol class="ed-refeicoes">${rascunho.refeicoes.map((r, i) => `<li class="ed-ref" data-r="${i}">
        <div class="ed-ref-cab">
          <label class="campo" for="er-${i}-n"><span>Refeição</span><input id="er-${i}-n" data-campo="nome" value="${escHtml(r.nome)}"></label>
          <label class="campo" for="er-${i}-h"><span>Horário</span><input id="er-${i}-h" data-campo="hora" value="${escHtml(r.hora)}"></label>
          <button type="button" class="ed-tira" data-tira-ref aria-label="Remover a refeição ${escHtml(r.nome)}">${ICX}</button>
        </div>
        <ul class="ed-opcoes">${r.opcoes.map((o, j) => `<li><label class="sr" for="er-${i}-${j}">Opção ${j + 1} de ${escHtml(r.nome)}</label><input id="er-${i}-${j}" data-op="${j}" value="${escHtml(o)}" placeholder="Escreva a opção"><button type="button" class="ed-tira" data-tira-op="${j}" aria-label="Remover esta opção">${ICX}</button></li>`).join('')}</ul>
        <button type="button" class="link-seta ed-poe" data-poe-op>+ Opção</button>
      </li>`).join('')}</ol>
      <button type="button" class="link-seta ed-poe" data-poe-ref>+ Refeição</button>
      <div class="ed-textos">
        <label class="campo" for="ed-orient"><span>Orientações</span><textarea id="ed-orient" data-ed-orient rows="4">${escHtml(rascunho.orientacoes || '')}</textarea></label>
        <label class="campo" for="ed-metas"><span>Metas (uma por linha)</span><textarea id="ed-metas" data-ed-metas rows="4">${escHtml((rascunho.metas || []).join('\n'))}</textarea></label>
      </div>
      <div class="ed-pe"><button type="button" class="btn btn-cheio" data-ed-salva><span class="btn-onda" aria-hidden="true"></span><span class="btn-txt">Salvar plano</span></button><p class="ed-status" data-ed-status></p></div>`;
    const pintaFicha = () => {
      const cat = CAT[rascunho.categoria]?.nome || '';
      ficha.innerHTML = `
        <header class="ficha-cab">
          <div><p class="apoio">${escHtml(cat)}</p><h2>${escHtml(pac.nome)}</h2><p>Paciente desde ${dataNum(pac.desde)}. ${pac.proxima ? `Próxima consulta em ${dataNum(pac.proxima)}.` : 'Sem consulta marcada.'}</p></div>
          <button type="button" class="btn btn-cheio" data-pdf data-cursor="PDF"><span class="btn-onda" aria-hidden="true"></span><span class="btn-txt">Baixar plano de ${escHtml(primeiroNome(pac.nome))}</span><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/></svg></button>
        </header>
        <div class="painel-abas ficha-abas" role="tablist" aria-label="Ficha de ${escHtml(pac.nome)}">
          <button type="button" role="tab" id="fa-b-triagem" aria-controls="fa-triagem" aria-selected="${aba === 'triagem'}" tabindex="${aba === 'triagem' ? 0 : -1}">Triagem</button>
          <button type="button" role="tab" id="fa-b-plano" aria-controls="fa-plano" aria-selected="${aba === 'plano'}" tabindex="${aba === 'plano' ? 0 : -1}">Plano alimentar</button>
        </div>
        <section class="ficha-painel" id="fa-triagem" role="tabpanel" aria-labelledby="fa-b-triagem"${aba === 'triagem' ? '' : ' hidden'}>
          <form class="triagem" data-triagem novalidate>${EA.triagemCampos.map(campoTriagem).join('')}
            <div class="ed-pe campo-largo"><button type="submit" class="btn btn-cheio"><span class="btn-onda" aria-hidden="true"></span><span class="btn-txt">Salvar triagem</span></button><p class="ed-status" data-tg-status></p></div>
          </form>
        </section>
        <section class="ficha-painel" id="fa-plano" role="tabpanel" aria-labelledby="fa-b-plano"${aba === 'plano' ? '' : ' hidden'}><div data-editor>${editor()}</div></section>`;
    };
    const pintaEditor = () => { const ed = $('[data-editor]', ficha); if (ed) ed.innerHTML = editor(); };
    const pintaCategoria = () => { const ap = $('.ficha-cab .apoio', ficha); if (ap) ap.textContent = CAT[rascunho.categoria]?.nome || ''; };
    const triagemAtual = () => Object.fromEntries($$('[data-tg]', ficha).map((t) => [t.dataset.tg, t.value.trim()]));
    const marcaStatus = (sel, msg) => { const s = $(sel, ficha); if (s) s.textContent = msg; };

    // tudo o que a profissional digita vai para o rascunho; nada se perde ao trocar de aba
    ficha.addEventListener('input', (e) => {
      const t = e.target, li = t.closest('[data-r]');
      if (li && t.dataset.campo) rascunho.refeicoes[+li.dataset.r][t.dataset.campo] = t.value;
      else if (li && t.dataset.op !== undefined) rascunho.refeicoes[+li.dataset.r].opcoes[+t.dataset.op] = t.value;
      else if (t.matches('[data-ed-orient]')) rascunho.orientacoes = t.value;
      else if (t.matches('[data-ed-metas]')) rascunho.metas = t.value.split('\n');
      if (t.closest('#fa-plano')) marcaStatus('[data-ed-status]', 'Alterações ainda não salvas.');
      if (t.matches('[data-tg]')) marcaStatus('[data-tg-status]', 'Alterações ainda não salvas.');
    });
    ficha.addEventListener('click', (e) => {
      const t = e.target;
      const tab = t.closest('[role="tab"]');
      if (tab) {
        aba = tab.id === 'fa-b-triagem' ? 'triagem' : 'plano';
        $$('[role="tab"]', ficha).forEach((b) => { const sim = b === tab; b.setAttribute('aria-selected', String(sim)); b.tabIndex = sim ? 0 : -1; });
        $('#fa-triagem', ficha).hidden = aba !== 'triagem';
        $('#fa-plano', ficha).hidden = aba !== 'plano';
        return;
      }
      const li = t.closest('[data-r]'), i = li ? +li.dataset.r : -1;
      if (t.closest('[data-tira-op]')) { rascunho.refeicoes[i].opcoes.splice(+t.closest('[data-tira-op]').dataset.tiraOp, 1); pintaEditor(); marcaStatus('[data-ed-status]', 'Alterações ainda não salvas.'); return; }
      if (t.closest('[data-tira-ref]')) { rascunho.refeicoes.splice(i, 1); pintaEditor(); marcaStatus('[data-ed-status]', 'Alterações ainda não salvas.'); return; }
      if (t.closest('[data-poe-op]')) { rascunho.refeicoes[i].opcoes.push(''); pintaEditor(); $(`#er-${i}-${rascunho.refeicoes[i].opcoes.length - 1}`, ficha)?.focus(); return; }
      if (t.closest('[data-poe-ref]')) { rascunho.refeicoes.push({ nome: 'Nova refeição', hora: '', opcoes: [''] }); pintaEditor(); $(`#er-${rascunho.refeicoes.length - 1}-n`, ficha)?.select(); return; }
      if (t.closest('[data-ed-modelo]')) {
        const id = $('[data-ed-cat]', ficha).value;
        rascunho = { categoria: id, ...copia(CAT[id].plano) };
        pintaEditor();
        marcaStatus('[data-ed-status]', `Modelo de ${CAT[id].nome} aplicado. Ajuste e salve.`);
        return;
      }
      if (t.closest('[data-ed-salva]')) {
        rascunho.refeicoes = rascunho.refeicoes.map((r) => ({ ...r, opcoes: r.opcoes.map((o) => o.trim()).filter(Boolean) })).filter((r) => r.nome.trim());
        rascunho.metas = (rascunho.metas || []).map((m) => m.trim()).filter(Boolean);
        guardaEm('salvi-planos', pac.id, rascunho);
        rascunho = copia(rascunho);
        pintaLista();
        pintaEditor();
        pintaCategoria();
        const agora = new Date();
        marcaStatus('[data-ed-status]', `Plano salvo às ${agora.getHours()}h${String(agora.getMinutes()).padStart(2, '0')}. ${primeiroNome(pac.nome)} já vê esta versão na Área do cliente.`);
        return;
      }
      if (t.closest('[data-pdf]')) {
        baixaPlanoPdf({ pac, plano: rascunho, triagem: { ...triagemDe(pac), ...($$('[data-tg]', ficha).length ? triagemAtual() : {}) }, prof });
      }
    });
    ficha.addEventListener('change', (e) => { if (e.target.matches('[data-ed-cat]')) marcaStatus('[data-ed-status]', `Toque em "Usar o modelo desta categoria" para trocar para ${CAT[e.target.value].nome}.`); });
    ficha.addEventListener('submit', (e) => {
      if (!e.target.matches('[data-triagem]')) return;
      e.preventDefault();
      guardaEm('salvi-triagens', pac.id, triagemAtual());
      marcaStatus('[data-tg-status]', 'Triagem salva.');
      toast(`Triagem de ${pac.nome} salva.`);
    });

    const salvo = le('salvi-pro', '', sessionStorage);
    if (salvo) entraPro(salvo);
  }
})();
