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

  window.AuraKit = { abreModal, fechaModal, guarda };
})();
