(() => {
  const D = /*DADOS*/;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const guarda = {
    ler(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    por(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento */ } },
  };

  // ---------- segmentos pelo link (?seg=facial,corporal) ----------
  const pedido = new URLSearchParams(location.search).get('seg');
  if (pedido) {
    const ok = pedido.split(',').map((s) => s.trim()).filter(Boolean);
    const todos = [...new Set($$('[data-seg]').map((el) => el.dataset.seg))];
    if (ok.some((s) => todos.includes(s))) {
      $$('[data-seg]').forEach((el) => { if (!ok.includes(el.dataset.seg)) el.remove(); });
      const segs = $('.segs');
      if (segs) segs.style.setProperty('--n', segs.children.length);
      const primeiro = $('.seg-tile');
      $$('.seg-tile').forEach((t) => t.classList.toggle('seg-tile-g', t === primeiro));
    }
  }

  // ---------- aberto agora ----------
  const nomes = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const hm = (h) => `${Math.floor(h)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;
  const agora = new Date();
  const dia = agora.getDay();
  const hora = agora.getHours() + agora.getMinutes() / 60;
  const hoje = D.abertura[dia];
  let status;
  if (hoje && hora >= hoje[0] && hora < hoje[1]) status = `Aberto agora, até as ${hm(hoje[1])}`;
  else {
    let d = dia, n = 0;
    if (hoje && hora < hoje[0]) status = `Abre hoje às ${hm(hoje[0])}`;
    else {
      do { d = (d + 1) % 7; n++; } while (!D.abertura[d] && n < 7);
      status = `Fechado agora. Abre ${n === 1 ? 'amanhã' : nomes[d]} às ${hm(D.abertura[d][0])}`;
    }
  }
  $$('[data-status]').forEach((el) => { el.textContent = status; });
  const linha = dia === 0 ? 2 : dia === 6 ? 1 : 0;
  const tr = $(`.horas [data-linha="${linha}"]`);
  if (tr) tr.classList.add('hoje');
  $$('[data-ano]').forEach((el) => { el.textContent = agora.getFullYear(); });

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
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.revela').forEach((el) => io.observe(el));
  } else $$('.revela').forEach((el) => el.classList.add('visto'));

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
  const abreDoc = (id) => { const d = $(`#doc-${id}`); if (d && d.showModal) d.showModal(); };
  $$('[data-doc]').forEach((b) => b.addEventListener('click', () => abreDoc(b.dataset.doc)));
  $$('dialog.doc').forEach((d) => {
    $('[data-fecha]', d).addEventListener('click', () => d.close());
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });

  // ---------- cookies ----------
  const ck = $('#cookies');
  const CK = 'camelia-cookies';
  const marcaCk = () => document.documentElement.classList.toggle('ck', !ck.hidden);
  if (!guarda.ler(CK)) ck.hidden = false;
  marcaCk();
  $$('[data-ck]').forEach((b) => b.addEventListener('click', () => { guarda.por(CK, b.dataset.ck); ck.hidden = true; marcaCk(); }));
  $$('[data-cookies]').forEach((b) => b.addEventListener('click', () => { ck.hidden = false; marcaCk(); iguala(); $('[data-ck]', ck).focus(); }));

  // ---------- formulário ----------
  const form = $('#form');
  const okSaude = $('#ok-saude');
  const camposSaude = $$('#saude-campos input');
  const ligaSaude = () => {
    camposSaude.forEach((i) => { i.disabled = !okSaude.checked; if (!okSaude.checked) { if (i.type === 'radio' || i.type === 'checkbox') i.checked = false; else i.value = ''; } });
    $('#saude').classList.toggle('liberado', okSaude.checked);
  };
  okSaude.addEventListener('change', ligaSaude);
  ligaSaude();

  const erro = $('#form-erro');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const falta = [];
    const nome = (f.get('nome') || '').trim();
    const whats = (f.get('whats') || '').replace(/\D/g, '');
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
      `Olá! Quero agendar na ${D.nome}.`,
      '',
      `Nome: ${nome}`,
      `WhatsApp: ${f.get('whats')}`,
      f.get('email') ? `E-mail: ${f.get('email')}` : null,
      `Tratamento: ${f.get('trat')}`,
      `Melhor período: ${f.get('periodo')}`,
      f.get('msg') ? `Mensagem: ${f.get('msg').trim()}` : null,
    ];
    if (f.get('ok_saude')) {
      const conds = f.getAll('cond');
      l.push('', 'Ficha de saúde prévia (autorizo o uso só para a avaliação):');
      if (f.get('gest')) l.push(`Grávida ou amamentando: ${f.get('gest')}`);
      if (f.get('alergia')) l.push(`Alergias: ${f.get('alergia')}`);
      if (f.get('remedio')) l.push(`Medicamentos: ${f.get('remedio')}`);
      if (conds.length) l.push(`Condições: ${conds.join(', ')}`);
    }
    l.push('', 'Li a política de privacidade e autorizo o contato.');
    if (f.get('ok_news')) l.push('Aceito receber horários livres e novidades.');
    window.open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(l.filter((x) => x !== null).join('\n'))}`, '_blank', 'noopener');
  });
})();
