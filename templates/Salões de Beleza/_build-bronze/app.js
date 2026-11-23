// Mecha Salão, Bronze: topo com sombra ao rolar, menu do celular, entrada suave dos blocos, avaliações com setas,
// barra rápida da capa e formulário de agendamento que montam a mensagem do WhatsApp, janelas legais e cookies.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const D = JSON.parse($('#dados')?.textContent || '{}');
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reais = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
  const wa = (msg) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`;
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const servPor = Object.fromEntries((D.servicos || []).map((s) => [s.id, s]));
  const guarda = {
    ler(k, padrao) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento: segue sem lembrar */ } },
  };
  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (t) => { if (!toastEl) return; toastEl.textContent = t; toastEl.classList.add('ve'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('ve'), 2800); };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const deIso = (s) => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
  const diaTxt = (s) => { const d = deIso(s); return `${DIAS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}`; };
  const fechado = (s) => !D.abertura?.[deIso(s).getDay()];
  const hoje = new Date(), limite = new Date(); limite.setDate(limite.getDate() + 60);
  $$('input[type="date"]').forEach((i) => { i.min = iso(hoje); i.max = iso(limite); });

  // ---------- grupos com o mesmo tamanho: mede o item mais largo e aplica em --larg ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    if (!g.offsetParent && getComputedStyle(g).position !== 'fixed') return;
    if (getComputedStyle(g).position === 'static') g.style.position = 'relative';
    let maior = 0;
    for (const f of [...g.children]) {
      if (f.hidden) continue;
      const c = f.cloneNode(true);
      c.style.cssText = 'position:absolute;visibility:hidden;width:max-content;left:0;top:0;pointer-events:none';
      c.removeAttribute('id');
      g.appendChild(c);
      maior = Math.max(maior, c.getBoundingClientRect().width);
      c.remove();
    }
    if (maior) g.style.setProperty('--larg', `${Math.ceil(maior) + 2}px`);
  });
  let igualaT;
  const igualaDepois = () => { clearTimeout(igualaT); igualaT = setTimeout(iguala, 60); };
  addEventListener('resize', igualaDepois);
  if (document.fonts) document.fonts.ready.then(iguala);
  iguala();

  // ---------- topo: sombra ao rolar e menu do celular ----------
  const topo = $('.topo'), menu = $('#menu'), menuBtn = $('.menu-btn');
  const sombra = () => topo.classList.toggle('rolou', scrollY > 8);
  addEventListener('scroll', sombra, { passive: true }); sombra();
  const fechaMenu = () => { menu.classList.remove('abre'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Abrir o menu'); };
  menuBtn?.addEventListener('click', () => {
    const abre = !menu.classList.contains('abre');
    menu.classList.toggle('abre', abre);
    menuBtn.setAttribute('aria-expanded', String(abre));
    menuBtn.setAttribute('aria-label', abre ? 'Fechar o menu' : 'Abrir o menu');
  });
  $$('a', menu).forEach((a) => a.addEventListener('click', fechaMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('abre')) { fechaMenu(); menuBtn.focus(); } });
  document.addEventListener('click', (e) => { if (menu.classList.contains('abre') && !topo.contains(e.target)) fechaMenu(); });

  // ---------- entrada suave dos blocos ----------
  const revs = $$('.rev');
  if (reduz || !('IntersectionObserver' in window)) revs.forEach((el) => el.classList.add('ve'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('ve'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    revs.forEach((el) => io.observe(el));
  }

  // ---------- avaliações: setas, arrastar no celular e troca sozinha enquanto visível ----------
  const avals = $$('.aval'), fotos = $$('.aval-fotos img');
  let atual = 0, autoT;
  const mostra = (n) => {
    atual = (n + avals.length) % avals.length;
    avals.forEach((a, k) => { a.classList.toggle('on', k === atual); a.hidden = k !== atual; });
    fotos.forEach((f, k) => f.classList.toggle('on', k === atual));
  };
  const auto = () => { clearInterval(autoT); if (!reduz) autoT = setInterval(() => mostra(atual + 1), 7000); };
  $$('[data-aval]').forEach((b) => b.addEventListener('click', () => { mostra(atual + +b.dataset.aval); auto(); }));
  const cartao = $('.aval-cartao');
  if (cartao) {
    let x0 = null;
    cartao.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    cartao.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { mostra(atual + (dx < 0 ? 1 : -1)); auto(); }
    });
    cartao.addEventListener('mouseenter', () => clearInterval(autoT));
    cartao.addEventListener('mouseleave', auto);
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => (e.isIntersecting ? auto() : clearInterval(autoT))).observe(cartao);
  }

  // ---------- horário de hoje em destaque ----------
  $(`.horas tr[data-dia="${hoje.getDay()}"]`)?.classList.add('hoje');

  // ---------- barra rápida da capa: vai direto para o WhatsApp ----------
  const rapido = $('#form-rapido');
  rapido?.addEventListener('submit', (e) => {
    e.preventDefault();
    const s = servPor[rapido.servico.value], d = rapido.data.value;
    if (d && fechado(d)) { toast(`Não abrimos às ${DIAS[deIso(d).getDay()]}s. Escolha outro dia.`); return; }
    const msg = [`Olá! Quero agendar no ${D.nome}.`, s ? `Serviço: ${s.nome} (${s.de ? 'a partir de ' : ''}${reais(s.preco)})` : '', d ? `Melhor dia: ${diaTxt(d)}` : '', 'Quais horários vocês têm?'].filter(Boolean).join('\n');
    window.open(wa(msg), '_blank', 'noopener');
  });

  // ---------- agendamento ----------
  const form = $('#form-agenda');
  if (form) {
    const f = form.elements;
    const avisoQ = $('[data-aviso-quimica]', form);
    const escolhe = (id) => { f.servico.value = id; avisoQ.hidden = !servPor[id]?.quimica; };
    f.servico.addEventListener('change', () => { avisoQ.hidden = !servPor[f.servico.value]?.quimica; });
    f.data.addEventListener('change', () => { if (f.data.value && fechado(f.data.value)) toast(`Não abrimos às ${DIAS[deIso(f.data.value).getDay()]}s. Escolha outro dia.`); });
    $$('[data-servico]').forEach((a) => a.addEventListener('click', () => {
      if (!servPor[a.dataset.servico]) return;
      escolhe(a.dataset.servico);
      toast(`${servPor[a.dataset.servico].nome} selecionado. Agora é só escolher o dia.`);
    }));

    const erro = $('.form-erro', form), ok = $('.form-ok', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      $$('.erro', form).forEach((x) => x.classList.remove('erro'));
      const faltam = [];
      const marca = (campo, nome) => { (campo.closest('fieldset') || campo.closest('label'))?.classList.add('erro'); faltam.push(nome); };
      if (!f.nome.value.trim()) marca(f.nome, 'nome');
      if (f.tel.value.replace(/\D/g, '').length < 10) marca(f.tel, 'telefone com DDD');
      if (f.email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value)) marca(f.email, 'e-mail válido');
      if (!f.servico.value) marca(f.servico, 'serviço');
      if (!f.data.value) marca(f.data, 'dia');
      else if (fechado(f.data.value)) marca(f.data, 'um dia em que o salão abre (terça a sábado)');
      const periodo = form.querySelector('input[name="periodo"]:checked');
      if (!periodo) marca(form.querySelector('input[name="periodo"]'), 'período');
      if (!f.lgpd.checked) faltam.push('o aceite da Política de Privacidade');
      if (faltam.length) { erro.hidden = false; erro.textContent = `Falta preencher: ${faltam.join(', ')}.`; ok.hidden = true; return; }
      erro.hidden = true;
      const s = servPor[f.servico.value];
      const quando = `${diaTxt(f.data.value)}, de ${periodo.value}`;
      const msg = [
        `Olá! Quero pedir um horário no ${D.nome}.`,
        `Nome: ${f.nome.value.trim()}`, `Telefone: ${f.tel.value.trim()}`, f.email.value ? `E-mail: ${f.email.value.trim()}` : '',
        `Serviço: ${s.nome} (${s.de ? 'a partir de ' : ''}${reais(s.preco)})`, `Quando: ${quando}`,
        f.obs.value.trim() ? `Observações: ${f.obs.value.trim()}` : '',
        `Aceito a Política de Privacidade. Novidades pelo WhatsApp: ${f.novidades.checked ? 'sim' : 'não'}.`,
      ].filter(Boolean).join('\n');
      window.open(wa(msg), '_blank', 'noopener');
      ok.hidden = false;
      ok.innerHTML = `<b>Pedido pronto para envio</b><span>${s.nome}, ${quando}. O WhatsApp abriu com a mensagem; é só enviar. Respondemos com os horários livres em até uma hora, no horário de funcionamento.</span>`;
      toast('Pedido montado. Confira no WhatsApp.');
    });
  }

  // ---------- janelas legais e cookies ----------
  $$('[data-doc]').forEach((b) => b.addEventListener('click', () => { const d = $(`#doc-${b.dataset.doc}`); if (d?.showModal) d.showModal(); }));
  $$('dialog.doc').forEach((d) => {
    $('[data-fecha]', d).addEventListener('click', () => d.close());
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });
  const ck = $('#cookies');
  if (ck) {
    if (!guarda.ler('mecha-salao-cookies', null)) { ck.hidden = false; igualaDepois(); }
    $$('[data-ck]', ck).forEach((b) => b.addEventListener('click', () => { guarda.gravar('mecha-salao-cookies', { escolha: b.dataset.ck, em: Date.now() }); ck.hidden = true; }));
    $$('[data-cookies]').forEach((b) => b.addEventListener('click', () => { ck.hidden = false; igualaDepois(); }));
  }
})();
