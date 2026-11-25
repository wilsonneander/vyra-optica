// Lume Odontologia, Bronze: comportamento da página (leve, sem biblioteca).
(() => {
  const D = JSON.parse(document.getElementById('dados').textContent);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const raiz = document.documentElement;
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wa = (msg) => `https://wa.me/${D.wa}?text=${encodeURIComponent(msg)}`;

  // ---------- grupos com a mesma largura (regra das diretrizes) ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    g.style.removeProperty('--larg');
    const filhos = [...g.children];
    filhos.forEach((f) => { f.style.width = 'max-content'; });
    const maior = Math.max(...filhos.map((f) => f.getBoundingClientRect().width));
    filhos.forEach((f) => { f.style.width = ''; });
    g.style.setProperty('--larg', `${Math.ceil(maior)}px`);
  });
  iguala();
  document.fonts?.ready.then(iguala);
  let tIg; addEventListener('resize', () => { clearTimeout(tIg); tIg = setTimeout(iguala, 150); });

  // entrada do hero quando as fontes chegam
  const pronto = () => raiz.classList.add('pronto');
  (document.fonts?.ready || Promise.resolve()).then(() => requestAnimationFrame(pronto));
  setTimeout(pronto, 1200);

  // ---------- topo ----------
  const topo = $('[data-topo]');
  const waFixo = $('.wa-fixo');
  // o WhatsApp fixo aparece depois do hero (no hero, o botão já está à vista)
  const marcaRolagem = () => { topo.classList.toggle('rolou', scrollY > 30); waFixo?.classList.toggle('ve', scrollY > innerHeight * 0.6); };
  marcaRolagem(); addEventListener('scroll', marcaRolagem, { passive: true });

  const btnMenu = $('[data-abre-menu]');
  const menuCel = $('[data-menu-cel]');
  const fechaMenu = () => { menuCel.hidden = true; btnMenu.setAttribute('aria-expanded', 'false'); btnMenu.setAttribute('aria-label', 'Abrir menu'); };
  btnMenu.addEventListener('click', () => {
    const abrir = menuCel.hidden;
    menuCel.hidden = !abrir;
    btnMenu.setAttribute('aria-expanded', String(abrir));
    btnMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  });
  $$('a', menuCel).forEach((a) => a.addEventListener('click', fechaMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menuCel.hidden) { fechaMenu(); btnMenu.focus(); } });
  document.addEventListener('click', (e) => { if (!menuCel.hidden && !topo.contains(e.target)) fechaMenu(); });

  // "Aberto agora, até 19h" a partir do horário do content.js (hora de Brasília)
  const status = $('[data-aberto]');
  const atualizaStatus = () => {
    const agora = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const h = D.horario[agora.getDay()];
    const hora = agora.getHours() + agora.getMinutes() / 60;
    if (h && hora >= h[0] && hora < h[1]) { status.textContent = `Aberto agora, até ${h[1]}h`; return; }
    for (let i = 0; i < 8; i++) {
      const dia = (agora.getDay() + i) % 7; const hh = D.horario[dia];
      if (!hh || (i === 0 && hora >= hh[0])) continue;
      const quando = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'][dia];
      status.textContent = `Fechado agora. Abre ${quando} às ${hh[0]}h`; return;
    }
  };
  if (status) { atualizaStatus(); setInterval(atualizaStatus, 60000); }

  // ---------- tema claro e escuro ----------
  const btnTema = $('[data-botao-tema]');
  const sincTema = () => {
    const escuro = raiz.dataset.tema === 'escuro';
    btnTema.setAttribute('aria-pressed', String(escuro));
    btnTema.setAttribute('aria-label', escuro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro');
    $('meta[name="theme-color"]').content = escuro ? '#15120F' : '#F5F0EA';
  };
  sincTema();
  btnTema.addEventListener('click', () => {
    const vaiEscuro = raiz.dataset.tema !== 'escuro';
    const aplica = () => {
      if (vaiEscuro) raiz.dataset.tema = 'escuro'; else delete raiz.dataset.tema;
      try { localStorage.setItem('lume-tema', vaiEscuro ? 'escuro' : 'claro'); } catch (e) { /* sem armazenamento */ }
      sincTema();
    };
    if (!document.startViewTransition || calmo) { aplica(); return; }
    // o novo tema se abre em círculo a partir do botão
    const r = btnTema.getBoundingClientRect();
    const x = r.left + r.width / 2; const y = r.top + r.height / 2;
    const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(aplica).ready.then(() => {
      raiz.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${raio}px at ${x}px ${y}px)`] }, { duration: 700, easing: 'cubic-bezier(.2,.7,.1,1)', pseudoElement: '::view-transition-new(root)' });
    });
  });

  // ---------- aparecer na rolagem (uma vez) ----------
  const io = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visto');
    e.target.dispatchEvent(new CustomEvent('visto'));
    io.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-rv]').forEach((el) => io.observe(el));

  // ---------- antes e depois ----------
  const comp = $('[data-comp]');
  if (comp) {
    const range = $('[data-comp-range]', comp);
    let mexeu = false;
    const poe = (v) => comp.style.setProperty('--pos', `${v}%`);
    range.addEventListener('input', () => { mexeu = true; poe(range.value); });
    range.addEventListener('pointerdown', () => { mexeu = true; comp.classList.add('arrastando'); });
    addEventListener('pointerup', () => comp.classList.remove('arrastando'));
    // ao aparecer, a linha balança uma vez para mostrar que dá para arrastar
    comp.addEventListener('visto', () => {
      if (calmo) return;
      const t0 = performance.now() + 500;
      const anda = (t) => {
        if (mexeu) return;
        const k = Math.max(0, (t - t0) / 2000);
        if (k > 1) { poe(50); range.value = 50; return; }
        const v = 50 + Math.sin(k * Math.PI * 2) * 16 * (1 - k);
        poe(v); range.value = v; requestAnimationFrame(anda);
      };
      requestAnimationFrame(anda);
    });
    const casos = Object.fromEntries(D.casos.map((c) => [c.id, c]));
    const abas = $$('[data-caso]');
    const escolhe = (b) => {
      abas.forEach((x) => { x.setAttribute('aria-selected', String(x === b)); x.tabIndex = x === b ? 0 : -1; });
      $$('[data-par]', comp).forEach((p) => p.classList.toggle('on', p.dataset.par === b.dataset.caso));
      const c = casos[b.dataset.caso];
      $('[data-caso-tag]').textContent = c.nome;
      $('[data-caso-tit]').textContent = c.titulo;
      $('[data-caso-txt]').textContent = c.texto;
      $('[data-caso-dados]').innerHTML = c.dados.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
      const caso = $('.caso'); caso.classList.remove('troca'); void caso.offsetWidth; caso.classList.add('troca');
      mexeu = true; poe(50); range.value = 50;
    };
    abas.forEach((b, k) => {
      b.tabIndex = k === 0 ? 0 : -1;
      b.addEventListener('click', () => escolhe(b));
      b.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        const n = abas[(k + d + abas.length) % abas.length]; escolhe(n); n.focus();
      });
    });
  }

  // ---------- procedimentos: a foto acompanha o item ----------
  const procs = $$('[data-proc-id]');
  const dur = $('[data-proc-dur]');
  const ativaProc = (b) => {
    procs.forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    $$('[data-proc-foto]').forEach((img) => img.classList.toggle('on', img.dataset.procFoto === b.dataset.procId));
    if (dur) dur.textContent = b.dataset.dur;
  };
  procs.forEach((b) => {
    b.addEventListener('click', () => ativaProc(b));
    b.addEventListener('focus', () => ativaProc(b));
    b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') ativaProc(b); });
  });

  // ---------- dúvidas em sanfona ----------
  $$('[data-faq]').forEach((b) => b.addEventListener('click', () => {
    const li = b.closest('li');
    const abrir = !li.classList.contains('aberta');
    li.classList.toggle('aberta', abrir);
    b.setAttribute('aria-expanded', String(abrir));
  }));

  // ---------- formulário: valida e abre o WhatsApp com o pedido pronto ----------
  const form = $('[data-form]');
  if (form) {
    const tel = $('[data-mascara]', form);
    tel.addEventListener('input', () => {
      const d = tel.value.replace(/\D/g, '').slice(0, 11);
      tel.value = d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
    });
    const regras = [
      [$('#f-nome'), (v) => v.trim().length >= 2],
      [tel, (v) => v.replace(/\D/g, '').length >= 10],
      [$('[name="aceite"]', form), (_, el) => el.checked],
    ];
    const caixa = (el) => el.closest('.campo, .aceite');
    regras.forEach(([el, ok]) => el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => { if (ok(el.value, el)) caixa(el).classList.remove('invalido'); }));
    const ok = $('[data-form-ok]', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let primeiro = null;
      regras.forEach(([el, valido]) => {
        const bom = valido(el.value, el);
        caixa(el).classList.toggle('invalido', !bom);
        if (!bom && !primeiro) primeiro = el;
      });
      if (primeiro) { primeiro.focus(); return; }
      const f = new FormData(form);
      const msg = [`Olá! Gostaria de agendar uma avaliação na ${D.marca}.`, `Nome: ${f.get('nome')}`, `WhatsApp: ${f.get('tel')}`, `Tratamento: ${f.get('trat') || 'Ainda não sei, quero uma avaliação'}`, `Melhor período: ${f.get('periodo')}`, f.get('msg') ? `Mensagem: ${f.get('msg')}` : ''].filter(Boolean).join('\n');
      const link = wa(msg);
      $('[data-ok-nome]', form).textContent = String(f.get('nome')).trim().split(' ')[0];
      $('[data-ok-wa]', form).href = link;
      ok.hidden = false; ok.focus();
      window.open(link, '_blank', 'noopener');
    });
    $('[data-form-novo]', form).addEventListener('click', () => { form.reset(); ok.hidden = true; $('#f-nome').focus(); });
  }

  const ano = $('[data-ano]'); if (ano) ano.textContent = new Date().getFullYear();
})();
