/* AURA Fresh, comportamento dos componentes comuns (os três modelos).
   Cookies, formulário com consentimento, kits de compra, modal de ativos, modal do pote, menu, revelações,
   larguras iguais em grupos de botões e o modo de revisão jurídica (?revisao=1). */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const site = document.documentElement.dataset.site || 'aura';
  const guarda = {
    ler(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    salvar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* navegação privada */ } },
  };

  // ---------- tela de carregamento: o copo enche conforme as etapas reais terminam ----------
  const carga = $('[data-carga]');
  if (carga) {
    const lento = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const jaViu = (() => { try { return sessionStorage.getItem('aura-carga-vista') === '1'; } catch (e) { return false; } })();
    const minimo = lento ? (jaViu ? 650 : 1500) : 300;
    const com3d = !!document.querySelector('script[src*="pote-3d"]');
    const etapas = { fontes: false, pagina: false, tres: !com3d };
    const pronto3d = () => { etapas.tres = true; };
    if (com3d) {
      if (/\b(com|sem)-3d\b/.test(document.documentElement.className)) pronto3d();
      document.addEventListener('aura:3d-pronto', pronto3d);
      setTimeout(pronto3d, 7000); // nunca prende a página se o 3D demorar
    }
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { etapas.fontes = true; });
    if (document.readyState === 'complete') etapas.pagina = true; else addEventListener('load', () => { etapas.pagina = true; });
    setTimeout(() => { etapas.fontes = etapas.pagina = true; }, 8000);

    const pctEl = $('[data-carga-pct]', carga), faseEl = $('[data-carga-fase]', carga), agua = $('.carga-agua', carga), onda = $('.carga-onda', carga);
    const limpa = [223, 236, 230], verde = [46, 107, 44];
    const fases = [[0, 'abrindo o pote'], [28, 'pegando a dose'], [56, 'misturando na água'], [88, 'pronto, bom ritual']];
    const t0 = performance.now();
    let mostrado = 0, antes = t0;
    document.documentElement.classList.add('carregando');
    const passo = agora => {
      const feitas = Object.values(etapas).filter(Boolean).length, total = Object.keys(etapas).length;
      const passou = agora - t0, dt = Math.min(400, agora - antes); antes = agora;
      // o número anda devagar enquanto espera e corre para a etapa concluída (por tempo, não por quadro)
      const alvo = Math.max(feitas / total * 100, Math.min(82, passou / 45));
      const teto = feitas === total ? 100 : 96;
      mostrado = Math.min(teto, mostrado + Math.max(dt * 0.015, (alvo - mostrado) * (1 - Math.exp(-dt / 220))));
      const k = mostrado / 100;
      pctEl.textContent = Math.round(mostrado);
      agua.setAttribute('transform', `translate(0 ${(140 - k * 112).toFixed(1)})`);
      onda.style.fill = `rgb(${limpa.map((c, i) => Math.round(c + (verde[i] - c) * Math.max(0, (k - 0.25) / 0.75))).join(',')})`;
      const f = fases.filter(x => mostrado >= x[0]).pop(); if (f && faseEl.textContent !== f[1]) faseEl.textContent = f[1];
      carga.style.setProperty('--k', k.toFixed(3));
      if (mostrado >= 99.5 && passou >= minimo) {
        try { sessionStorage.setItem('aura-carga-vista', '1'); } catch (e) { /* privado */ }
        carga.classList.add('sai');
        document.documentElement.classList.remove('carregando');
        setTimeout(() => carga.remove(), 1000);
        return;
      }
      requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  // ---------- revisão jurídica ----------
  if (/[?&]revisao=1/.test(location.search)) document.documentElement.classList.add('revisao');

  // ---------- cabeçalho e menu ----------
  const cab = $('.cab');
  if (cab) {
    let ultimo = scrollY;
    addEventListener('scroll', () => {
      const y = scrollY;
      cab.classList.toggle('rolado', y > 30);
      cab.classList.toggle('some', y > ultimo && y > 400 && !cab.classList.contains('aberto'));
      ultimo = y;
    }, { passive: true });
    const bt = $('[data-menu]', cab);
    if (bt) bt.addEventListener('click', () => {
      const aberto = cab.classList.toggle('aberto');
      bt.setAttribute('aria-expanded', aberto);
      document.body.classList.toggle('trava', aberto);
    });
    $$('.cab-menu a', cab).forEach(a => a.addEventListener('click', () => { cab.classList.remove('aberto'); document.body.classList.remove('trava'); if (bt) bt.setAttribute('aria-expanded', 'false'); }));
  }

  // ---------- revelar ao entrar na tela ----------
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
  $$('[data-sobe]').forEach(el => io.observe(el));

  // ---------- grupos com a mesma largura ----------
  function iguala() {
    $$('[data-iguais]').forEach(g => {
      g.style.removeProperty('--larg');
      const filhos = [...g.children]; filhos.forEach(f => { f.style.width = 'auto'; });
      const maior = Math.max(...filhos.map(f => f.scrollWidth)) + 2;
      filhos.forEach(f => { f.style.width = ''; });
      g.style.setProperty('--larg', maior + 'px');
    });
  }
  iguala(); if (document.fonts) document.fonts.ready.then(iguala); addEventListener('resize', iguala);

  // ---------- cookies ----------
  const ck = $('[data-ck]');
  const chaveCk = site + '-cookies';
  function aplicaCk(v) { window.auraCookies = v; document.dispatchEvent(new CustomEvent('cookies', { detail: v })); }
  function abreCk() { if (!ck) return; ck.hidden = false; requestAnimationFrame(() => ck.classList.add('on')); }
  function fechaCk(v) { guarda.salvar(chaveCk, v); aplicaCk(v); ck.classList.remove('on'); setTimeout(() => { ck.hidden = true; }, 450); }
  if (ck) {
    const salvo = guarda.ler(chaveCk);
    if (salvo) aplicaCk(salvo); else setTimeout(abreCk, 900);
    $('[data-ck-sim]', ck).addEventListener('click', () => fechaCk({ necessarios: true, estatistica: true, marketing: true, quando: Date.now() }));
    $('[data-ck-nao]', ck).addEventListener('click', () => fechaCk({ necessarios: true, estatistica: false, marketing: false, quando: Date.now() }));
    const mais = $('[data-ck-mais]', ck), opcoes = $('.ck-opcoes', ck);
    mais.addEventListener('click', () => {
      if (opcoes.hidden) { opcoes.hidden = false; mais.textContent = 'Salvar minhas escolhas'; return; }
      fechaCk({ necessarios: true, estatistica: $('[name="ck-est"]', ck).checked, marketing: $('[name="ck-mkt"]', ck).checked, quando: Date.now() });
    });
    $$('[data-ck-abre]').forEach(b => b.addEventListener('click', () => {
      const v = guarda.ler(chaveCk) || {};
      $('[name="ck-est"]', ck).checked = !!v.estatistica; $('[name="ck-mkt"]', ck).checked = !!v.marketing;
      abreCk();
    }));
  }

  // ---------- formulário de contato com consentimento ----------
  $$('form[data-lead]').forEach(f => {
    f.addEventListener('submit', ev => {
      ev.preventDefault();
      let ok = true;
      $$('[required]', f).forEach(c => {
        const valido = c.type === 'checkbox' ? c.checked : c.value.trim() && (c.type !== 'email' || /.+@.+\..+/.test(c.value));
        c.classList.toggle('erro', !valido);
        const msg = c.closest('.campo, .consent') && c.closest('.campo, .consent').querySelector('.msg-erro');
        if (msg) msg.textContent = valido ? '' : (c.type === 'checkbox' ? 'Precisamos do seu aceite para responder.' : 'Confira este campo.');
        if (!valido) ok = false;
      });
      if (!ok) { const p = $('.erro', f); if (p) p.focus(); return; }
      // registro do consentimento: o que foi aceito, quando e a versão da política (o envio real vai para o CRM do cliente)
      const dados = Object.fromEntries(new FormData(f));
      const registro = { quando: new Date().toISOString(), politica: f.dataset.politica || 'v1', finalidade: 'responder ao contato', marketing: !!dados.marketing };
      guarda.salvar(site + '-ultimo-consentimento', registro);
      f.classList.add('enviado');
      $$('input, select, textarea, button[type="submit"]', f).forEach(c => { c.disabled = true; });
      const okEl = $('.form-ok', f); if (okEl) okEl.focus();
    });
  });

  // ---------- kits ----------
  const KITS = window.AURA_KITS || [];
  $$('[data-escolhe-kit]').forEach(grupo => {
    const bts = $$('button[data-kit]', grupo);
    const alvo = grupo.closest('[data-kit-area]') || document;
    function escolhe(id) {
      const k = KITS.find(x => x.id === id); if (!k) return;
      bts.forEach(b => b.setAttribute('aria-pressed', b.dataset.kit === id));
      $$('[data-kit-total]', alvo).forEach(el => { el.textContent = k.totalTxt; });
      $$('[data-kit-parcela]', alvo).forEach(el => { el.textContent = `${k.parcelas}x de ${k.parcelaTxt}`; });
      $$('[data-kit-dia]', alvo).forEach(el => { el.textContent = k.porDia; });
      $$('[data-kit-doses]', alvo).forEach(el => { el.textContent = k.doses; });
      $$('[data-kit-compra]', alvo).forEach(el => { el.href = k.url; });
      document.dispatchEvent(new CustomEvent('aura:kit', { detail: k }));
    }
    bts.forEach(b => b.addEventListener('click', () => escolhe(b.dataset.kit)));
    escolhe(grupo.dataset.escolheKit || 'kit2');
  });

  // ---------- modais (foco preso, Esc e clique fora fecham) ----------
  let ultimoFoco = null;
  function abreModal(m) {
    ultimoFoco = document.activeElement;
    m.hidden = false; requestAnimationFrame(() => m.classList.add('on'));
    document.body.classList.add('trava');
    setTimeout(() => { const f = $('.modal-fecha', m); if (f) f.focus(); }, 60);
  }
  function fechaModal(m) {
    m.classList.remove('on'); document.body.classList.remove('trava');
    setTimeout(() => { m.hidden = true; }, 380);
    if (m.dataset.modal === 'pote') document.dispatchEvent(new Event('aura:pote-fecha'));
    if (ultimoFoco) ultimoFoco.focus();
  }
  $$('.modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('.modal-fecha')) fechaModal(m); });
    m.addEventListener('keydown', e => {
      if (e.key === 'Escape') fechaModal(m);
      if (e.key === 'Tab') {
        const f = $$('button, a[href], input, [tabindex="0"]', m).filter(x => x.offsetParent);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
      if (m.dataset.modal === 'ativo' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) mostraAtivo(idxAtivo + (e.key === 'ArrowRight' ? 1 : -1));
    });
  });

  // modal de ativos
  const ATIVOS = window.AURA_ATIVOS || [];
  const mAtivo = $('[data-modal="ativo"]');
  let idxAtivo = 0;
  function mostraAtivo(i) {
    if (!mAtivo || !ATIVOS.length) return;
    idxAtivo = (i + ATIVOS.length) % ATIVOS.length;
    const a = ATIVOS[idxAtivo];
    mAtivo.style.setProperty('--m-cor', a.cor);
    $('[data-a="img"]', mAtivo).src = a.imgSrc; $('[data-a="img"]', mAtivo).alt = a.nome;
    $('[data-a="qtd"]', mAtivo).textContent = a.qtd;
    $('[data-a="nome"]', mAtivo).textContent = a.nome;
    $('[data-a="tec"]', mAtivo).textContent = a.tecnico;
    $('[data-a="frase"]', mAtivo).textContent = a.frase;
    $('[data-a="texto"]', mAtivo).textContent = a.texto;
    $('[data-a="revisar"]', mAtivo).textContent = a.revisar;
    $('[data-a="notas"]', mAtivo).innerHTML = a.notas.map(n => `<li>${n}</li>`).join('');
    const ant = ATIVOS[(idxAtivo - 1 + ATIVOS.length) % ATIVOS.length], prox = ATIVOS[(idxAtivo + 1) % ATIVOS.length];
    $('[data-a="ant"]', mAtivo).textContent = 'Anterior: ' + ant.nome;
    $('[data-a="prox"]', mAtivo).textContent = 'Próximo: ' + prox.nome;
  }
  if (mAtivo) {
    $('[data-a="ant"]', mAtivo).addEventListener('click', () => mostraAtivo(idxAtivo - 1));
    $('[data-a="prox"]', mAtivo).addEventListener('click', () => mostraAtivo(idxAtivo + 1));
    $$('[data-ativo]').forEach(b => b.addEventListener('click', e => {
      e.preventDefault();
      mostraAtivo(ATIVOS.findIndex(a => a.id === b.dataset.ativo));
      abreModal(mAtivo);
    }));
  }
  // modal do pote 3D
  const mPote = $('[data-modal="pote"]');
  if (mPote) $$('[data-abre-pote]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault(); abreModal(mPote);
    setTimeout(() => document.dispatchEvent(new Event('aura:pote-abre')), 30);
  }));

  // ---------- botão do WhatsApp aparece depois do primeiro scroll em telas pequenas ----------
  const zap = $('.zap');
  if (zap) { const v = () => zap.classList.toggle('cedo', scrollY < 80); v(); addEventListener('scroll', v, { passive: true }); }

  // ---------- ano no rodapé ----------
  $$('[data-ano]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // ---------- toque fluido: onda que nasce no ponto do clique ----------
  const reduzMov = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ALVOS_ONDA = '.btn, .seletor button, .hora-bts button, .filtro button, .ck-btns button, .ativo-nav button, .painel-menu nav button, .sair, .r2-ativos button, .modal-fecha, .zap, .nivel';
  document.addEventListener('pointerdown', e => {
    if (reduzMov) return;
    const b = e.target.closest(ALVOS_ONDA); if (!b) return;
    const r = b.getBoundingClientRect();
    const o = document.createElement('span'); o.className = 'onda';
    o.style.left = (e.clientX - r.left) + 'px'; o.style.top = (e.clientY - r.top) + 'px';
    o.style.setProperty('--onda-s', (Math.hypot(r.width, r.height) / 10).toFixed(1));
    b.appendChild(o); setTimeout(() => o.remove(), 750);
  });

  // ---------- tema claro e escuro (a tampa gira de um lado ao outro) ----------
  const raiz = document.documentElement;
  const chaveTema = site + '-tema';
  const padrao = raiz.dataset.temaPadrao || 'claro';
  const temaAtual = () => raiz.dataset.temaAtual || padrao;
  function poeTema(t) {
    raiz.dataset.temaAtual = t;
    $$('[data-tema-bt]').forEach(b => { b.setAttribute('aria-pressed', t === 'escuro'); b.setAttribute('aria-label', t === 'escuro' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'); });
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = getComputedStyle(document.body).backgroundColor;
    document.dispatchEvent(new CustomEvent('aura:tema', { detail: t }));
  }
  poeTema(temaAtual());
  $$('[data-tema-bt]').forEach(b => b.addEventListener('click', () => {
    const novo = temaAtual() === 'escuro' ? 'claro' : 'escuro';
    try { localStorage.setItem(chaveTema, novo); } catch (e) { /* privado */ }
    // pó verde sai da tampa
    if (!reduzMov) for (let i = 0; i < 9; i++) {
      const p = document.createElement('i'); p.className = 'po';
      const a = Math.PI * 2 * i / 9 + Math.random() * 0.4, d = 18 + Math.random() * 16;
      p.style.setProperty('--dx', Math.cos(a) * d + 'px'); p.style.setProperty('--dy', Math.sin(a) * d + 'px');
      p.style.background = ['#5f8f2f', '#9cbc5c', '#c4d997'][i % 3];
      b.appendChild(p); setTimeout(() => p.remove(), 720);
    }
    const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (document.startViewTransition && !reduzMov) {
      const vt = document.startViewTransition(() => poeTema(novo));
      vt.ready.then(() => {
        const fim = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        raiz.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${fim}px at ${x}px ${y}px)`] }, { duration: 750, easing: 'cubic-bezier(.2,.8,.2,1)', pseudoElement: '::view-transition-new(root)' });
      }).catch(() => {});
    } else {
      raiz.classList.add('troca-tema'); poeTema(novo); setTimeout(() => raiz.classList.remove('troca-tema'), 600);
    }
  }));

  // ---------- onde você está: o pote enche de pó conforme a página desce ----------
  const nivel = $('[data-nivel]');
  if (nivel) {
    const pctEl = $('[data-nivel-pct]', nivel), secEl = $('[data-nivel-sec]', nivel), fill = $('.enche-n', nivel), resta = $('[data-nivel-resta]', nivel);
    const secoes = $$('main > section, main > article, main > div > section, main > .rotulo-plano, footer.rodape').filter(s => s.offsetHeight > 0).map(s => {
      const nome = s.dataset.secao || (($('.apoio', s) || $('h1, h2', s) || {}).textContent || 'Início').trim();
      return { s, nome: s.matches('footer') ? 'Rodapé e contato' : nome.replace(/[.,]$/, '') };
    });
    let ultimoPct = -1;
    const anda = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const pct = max > 0 ? Math.round(Math.min(1, Math.max(0, scrollY / max)) * 100) : 0;
      nivel.classList.toggle('on', scrollY > 240);
      nivel.classList.toggle('cheio', pct >= 99);
      if (pct === ultimoPct) return; ultimoPct = pct;
      pctEl.textContent = pct + '%';
      if (fill) fill.setAttribute('transform', `translate(0 ${((1 - pct / 100) * 31).toFixed(2)})`);
      let atual = secoes[0];
      secoes.forEach(o => { if (o.s.getBoundingClientRect().top < innerHeight * 0.45) atual = o; });
      if (atual && secEl.textContent !== atual.nome) secEl.textContent = atual.nome;
      if (resta) resta.textContent = pct >= 99 ? 'fim, toque para subir' : `faltam ${100 - pct}%`;
      nivel.setAttribute('aria-label', `Você está em ${atual ? atual.nome : 'Início'}, ${pct}% da página. Voltar ao topo`);
    };
    anda(); addEventListener('scroll', anda, { passive: true }); addEventListener('resize', anda);
    nivel.addEventListener('click', e => {
      e.preventDefault();
      nivel.classList.remove('sobe'); void nivel.offsetWidth; nivel.classList.add('sobe');
      scrollTo({ top: 0, behavior: reduzMov ? 'auto' : 'smooth' });
    });
  }

  window.AuraKit = { abreModal, fechaModal, guarda };
})();
