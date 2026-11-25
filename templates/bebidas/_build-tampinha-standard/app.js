(() => {
  const D = /*DADOS*/;
  const miniHTML = (p) => `<img src="${p.i}" alt=""${p.l ? ` class="eh-logo" style="background:${p.l}"` : ""}>`;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const real = (v) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const normal = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const guarda = {
    ler(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    gravar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento */ } },
  };

  // ---------- grupos com a mesma largura ----------
  const igualar = () => $$('[data-iguais]').forEach((g) => {
    g.style.removeProperty('--larg');
    const filhos = [...g.children].filter((f) => f.offsetParent !== null);
    if (!filhos.length) return;
    filhos.forEach((f) => { f.style.width = 'auto'; });
    const maior = Math.max(...filhos.map((f) => f.getBoundingClientRect().width));
    filhos.forEach((f) => { f.style.width = ''; });
    g.style.setProperty('--larg', Math.ceil(maior) + 'px');
  });
  igualar();
  if (document.fonts) document.fonts.ready.then(igualar);
  addEventListener('resize', igualar);

  // ---------- idade ----------
  const idade = $('#idade');
  const raiz = document.documentElement;
  const resposta = guarda.ler('tampinha-idade');
  const abrirIdade = () => { idade.hidden = false; document.body.classList.add('travado'); setTimeout(() => $('[data-idade="sim"]', idade).focus(), 50); };
  if (!resposta) abrirIdade();
  $$('[data-idade]').forEach((b) => b.addEventListener('click', () => {
    const sim = b.dataset.idade === 'sim';
    guarda.gravar('tampinha-idade', sim ? 'sim' : 'nao');
    raiz.classList.toggle('sem-alcool', !sim);
    if (!sim) Object.keys(carrinho).forEach((id) => { if (ehAlc(id)) delete carrinho[id]; });
    idade.hidden = true;
    document.body.classList.remove('travado');
    salvar(); filtrar(); igualar();
  }));
  $('[data-rever-idade]').addEventListener('click', abrirIdade);
  const ehAlc = (id) => { const c = $(`.prod[data-id="${id}"]`); return Boolean(c && c.hasAttribute('data-alc')); };

  // ---------- topo ----------
  const topo = $('#topo');
  const aoRolar = () => topo.classList.toggle('rolou', scrollY > 40);
  addEventListener('scroll', aoRolar, { passive: true }); aoRolar();
  const burger = $('.burger'), menu = $('#menu');
  burger.addEventListener('click', () => { const ab = menu.classList.toggle('aberto'); burger.setAttribute('aria-expanded', String(ab)); });
  $$('a', menu).forEach((a) => a.addEventListener('click', () => { menu.classList.remove('aberto'); burger.setAttribute('aria-expanded', 'false'); }));

  // aberto agora?
  const status = $('[data-status]');
  const agora = new Date(), dia = agora.getDay(), h = agora.getHours() + agora.getMinutes() / 60;
  const ontem = D.abertura[(dia + 6) % 7];
  const hoje = D.abertura[dia];
  const fmtH = (x) => (x % 24) + 'h';
  if (ontem[1] > 24 && h < ontem[1] - 24) { status.textContent = `Aberto agora, entregas até ${fmtH(ontem[1])}`; status.classList.add('aberto'); }
  else if (h >= hoje[0] && h < hoje[1]) { status.textContent = `Aberto agora, entregas até ${fmtH(hoje[1])}`; status.classList.add('aberto'); }
  else status.textContent = `Fechado agora. Abrimos às ${fmtH(h < hoje[0] ? hoje[0] : D.abertura[(dia + 1) % 7][0])}`;
  const online = $('[data-online]');
  if (online && !status.classList.contains('aberto')) { online.textContent = 'Fora do horário: respondo a partir das 10h'; online.classList.add('fora'); }
  const linhaHoje =dia === 0 ? 2 : dia >= 5 ? 1 : 0;
  const tr = $(`.horarios tr[data-dia="${linhaHoje}"]`); if (tr) tr.classList.add('hoje');
  $$('[data-ano]').forEach((e) => { e.textContent = agora.getFullYear(); });

  // ---------- revelar ao rolar ----------
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.revela, .passos, .estrada').forEach((el) => io.observe(el));
  requestAnimationFrame(() => setTimeout(() => $('.capa').classList.add('pronta'), 120));

  // capa acompanha o mouse
  const capaArte = $('.capa-arte');
  if (!calmo && matchMedia('(pointer: fine)').matches) {
    $('.capa').addEventListener('pointermove', (e) => {
      const r = capaArte.getBoundingClientRect();
      capaArte.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      capaArte.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
  }

  // ---------- carrossel ----------
  const carr = $('[data-carrossel]'), barra = $('[data-progresso]');
  const progresso = () => {
    const vis = carr.clientWidth / carr.scrollWidth, max = carr.scrollWidth - carr.clientWidth;
    barra.style.width = (vis * 100) + '%';
    barra.style.transform = `translateX(${max ? (carr.scrollLeft / max) * ((1 - vis) / vis) * 100 : 0}%)`;
  };
  carr.addEventListener('scroll', progresso, { passive: true }); addEventListener('resize', progresso); progresso();
  $$('[data-rolar]').forEach((b) => b.addEventListener('click', () => {
    const fim = carr.scrollLeft + carr.clientWidth >= carr.scrollWidth - 4;
    const ini = carr.scrollLeft <= 4;
    const dir = +b.dataset.rolar;
    if (dir > 0 && fim) carr.scrollTo({ left: 0 });
    else if (dir < 0 && ini) carr.scrollTo({ left: carr.scrollWidth });
    else carr.scrollBy({ left: dir * carr.clientWidth * 0.8 });
  }));

  // ---------- filtros do catálogo ----------
  const cards = $$('[data-grade] .prod');
  const entrada = $('[data-busca-input]'), limpar = $('[data-limpar]');
  const achados = $('[data-achados]'), vazio = $('[data-vazio]');
  const nomes = Object.fromEntries($$('.chip').map((c) => [c.dataset.chip, c.textContent]));
  let catAtual = 'tudo', tudoAberto = false;
  const LIMITE = 10, verMais = $('[data-ver-mais]');
  function filtrar() {
    const q = normal(entrada.value);
    const semAlc = raiz.classList.contains('sem-alcool');
    const corta = catAtual === 'tudo' && !q && !tudoAberto;
    let n = 0, mostrados = 0;
    cards.forEach((c) => {
      const passa = (catAtual === 'tudo' || c.dataset.cat === catAtual) && (!q || q.split(/\s+/).every((p) => c.dataset.busca.includes(p))) && !(semAlc && c.hasAttribute('data-alc'));
      if (passa) n++;
      const ok = passa && (!corta || n <= LIMITE);
      const antes = !c.hidden;
      c.hidden = !ok;
      if (ok) { c.classList.remove('entra'); if (!antes || filtrar.anima) { void c.offsetWidth; c.style.setProperty('--i', Math.min(mostrados, 12)); c.classList.add('entra'); } mostrados++; }
    });
    filtrar.anima = false;
    verMais.hidden = !(corta && n > LIMITE);
    verMais.lastChild.textContent = `Ver as outras ${n - LIMITE} bebidas`;
    limpar.hidden = !q;
    vazio.hidden = n > 0;
    achados.textContent = q || catAtual !== 'tudo'
      ? `${n} ${n === 1 ? 'bebida' : 'bebidas'}${catAtual !== 'tudo' ? ' em ' + nomes[catAtual] : ''}${q ? ` para "${entrada.value.trim()}"` : ''}`
      : `${n} bebidas geladas esperando por você`;
  }
  const escolher = (id) => {
    catAtual = id;
    $$('.chip').forEach((c) => { const on = c.dataset.chip === id; c.classList.toggle('on', on); c.setAttribute('aria-pressed', String(on)); });
    filtrar.anima = true; filtrar();
  };
  $$('.chip').forEach((c) => c.addEventListener('click', () => escolher(c.dataset.chip)));
  verMais.addEventListener('click', () => { tudoAberto = true; filtrar(); const c = cards.filter((x) => !x.hidden)[LIMITE]; if (c) c.querySelector('button').focus({ preventScroll: true }); });
  entrada.addEventListener('input', () => { filtrar.anima = true; filtrar(); });
  limpar.addEventListener('click', () => { entrada.value = ''; filtrar.anima = true; filtrar(); entrada.focus(); });
  const irCatalogo = () => $('#catalogo').scrollIntoView({ behavior: calmo ? 'auto' : 'smooth' });
  $$('[data-filtro]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); entrada.value = ''; escolher(b.dataset.filtro); irCatalogo(); }));
  $$('[data-marca]').forEach((b) => b.addEventListener('click', () => { entrada.value = b.dataset.marca; escolher('tudo'); irCatalogo(); }));

  // ---------- carrinho ----------
  let carrinho = {};
  try { carrinho = JSON.parse(guarda.ler('tampinha-carrinho') || '{}') || {}; } catch (e) { carrinho = {}; }
  Object.keys(carrinho).forEach((id) => { if (!D.produtos[id] || !(carrinho[id] > 0)) delete carrinho[id]; });
  const gaveta = $('#carrinho'), veu = $('[data-veu]');
  const itensEl = $('[data-itens]'), vazioCar = $('[data-car-vazio]');
  const subtotal = () => Object.entries(carrinho).reduce((s, [id, q]) => s + D.produtos[id].p * q, 0);
  const conta = () => Object.values(carrinho).reduce((s, q) => s + q, 0);
  const form = $('[data-pedido]');
  const retirada = () => form.receber.value === 'retirada';
  const taxa = () => (retirada() || subtotal() >= D.entrega.gratisAcima || !conta() ? 0 : D.entrega.taxa);

  function salvar() { guarda.gravar('tampinha-carrinho', JSON.stringify(carrinho)); desenhar(); }
  function mudar(id, delta, origem) {
    const q = (carrinho[id] || 0) + delta;
    if (q > 0) carrinho[id] = Math.min(q, 99); else delete carrinho[id];
    if (delta > 0 && origem) voar(origem);
    salvar();
  }

  function desenhar() {
    const n = conta(), sub = subtotal(), t = taxa();
    $$('[data-conta]').forEach((e) => { e.textContent = n; });
    $$('[data-total-nav]').forEach((e) => { e.textContent = real(sub); });
    $$('[data-compra]').forEach((c) => {
      const q = carrinho[c.dataset.compra] || 0;
      c.classList.toggle('tem', q > 0);
      const o = $('output', c); if (o) o.textContent = q;
    });
    const barraCar = $('[data-barra]');
    barraCar.hidden = n === 0;
    document.body.classList.toggle('tem-itens', n > 0);

    // itens da gaveta
    itensEl.innerHTML = '';
    Object.entries(carrinho).forEach(([id, q]) => {
      const p = D.produtos[id];
      const li = document.createElement('li');
      li.innerHTML = `<span class="mini">${miniHTML(p)}</span><div><b></b><span>${q} x ${real(p.p)} = <strong>${real(p.p * q)}</strong></span></div>
        <div class="qtd"><button type="button" aria-label="Tirar um">${$('[data-menos] svg').outerHTML}</button><output>${q}</output><button type="button" aria-label="Pôr mais um">${$('[data-mais] svg').outerHTML}</button></div>`;
      $('b', li).textContent = p.n;
      const [menos, mais] = $$('button', li);
      menos.addEventListener('click', () => mudar(id, -1));
      mais.addEventListener('click', () => mudar(id, 1));
      itensEl.appendChild(li);
    });
    vazioCar.hidden = n > 0;
    form.hidden = n === 0;

    const frete = $('[data-frete]'), falta = D.entrega.gratisAcima - sub;
    frete.hidden = n === 0;
    frete.classList.toggle('gratis', falta <= 0 || retirada());
    $('[data-frete-txt]').innerHTML = retirada() ? 'Retirada no balcão: <b>sem taxa de entrega</b>.'
      : falta > 0 ? `Faltam <b>${real(falta)}</b> para a entrega grátis.` : '<b>Entrega grátis</b> liberada no seu pedido.';
    $('[data-frete-barra]').style.width = Math.min(100, (sub / D.entrega.gratisAcima) * 100) + '%';
    $('[data-subtotal]').textContent = real(sub);
    $('[data-taxa]').textContent = retirada() ? 'retirada' : t ? real(t) : 'grátis';
    $('[data-total]').textContent = real(sub + t);
    $('[data-enviar]').disabled = n === 0;
  }

  // a foto do produto voa até o carrinho
  function voar(origem) {
    const alvoBtn = matchMedia('(max-width: 760px)').matches && !$('[data-barra]').hidden ? $('.barra-carrinho button') : $('.carrinho-btn');
    const pular = () => { alvoBtn.classList.remove('pulo'); void alvoBtn.offsetWidth; alvoBtn.classList.add('pulo'); };
    if (calmo || gaveta.classList.contains('aberto')) return pular();
    const bloco = origem.closest('.prod, .kit, .extra');
    const foto = (bloco && bloco.querySelector('img')) || origem;
    const a = foto.getBoundingClientRect(), b = alvoBtn.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'voa';
    if (foto.tagName === 'IMG') { const im = foto.cloneNode(); im.removeAttribute('loading'); el.appendChild(im); }
    const lado = Math.min(a.width, a.height, 220);
    el.style.width = el.style.height = lado + 'px';
    el.style.left = a.left + a.width / 2 - lado / 2 + 'px'; el.style.top = a.top + a.height / 2 - lado / 2 + 'px';
    document.body.appendChild(el);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const fim = 36 / lado;
    const anim = el.animate([
      { transform: 'translate(0,0) scale(1)', borderRadius: '6px', opacity: 1 },
      { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 80}px) scale(${Math.max(fim * 2.4, 0.35)})`, borderRadius: '50%', offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(${fim})`, borderRadius: '50%', opacity: 0.85 },
    ], { duration: 760, easing: 'cubic-bezier(.45,.05,.3,1)' });
    anim.onfinish = () => { el.remove(); pular(); };
  }

  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]'), mais = e.target.closest('[data-mais]'), menos = e.target.closest('[data-menos]');
    if (add) mudar(add.dataset.add, 1, add);
    else if (mais) mudar(mais.dataset.mais, 1);
    else if (menos) mudar(menos.dataset.menos, -1);
  });
  $$('[data-kit]').forEach((b) => b.addEventListener('click', () => {
    D.kits[b.dataset.kit].forEach(([id, q]) => { carrinho[id] = Math.min((carrinho[id] || 0) + q, 99); });
    voar(b); salvar();
    const txt = b.lastChild.textContent; b.lastChild.textContent = 'Kit no carrinho';
    setTimeout(() => { b.lastChild.textContent = txt; }, 1800);
  }));

  // abrir e fechar
  let antesFoco = null;
  const abrir = () => {
    antesFoco = document.activeElement;
    veu.hidden = false; requestAnimationFrame(() => veu.classList.add('on'));
    gaveta.classList.add('aberto'); gaveta.setAttribute('aria-hidden', 'false');
    document.body.classList.add('travado');
    setTimeout(() => { $('.car-fechar').focus(); igualar(); }, 80);
  };
  const fechar = () => {
    veu.classList.remove('on'); setTimeout(() => { veu.hidden = true; }, 350);
    gaveta.classList.remove('aberto'); gaveta.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('travado');
    if (antesFoco) antesFoco.focus({ preventScroll: true });
  };
  $$('[data-abrir-carrinho]').forEach((b) => b.addEventListener('click', abrir));
  $$('[data-fechar-carrinho]').forEach((b) => b.addEventListener('click', () => { fechar(); if (b.dataset.ir) setTimeout(irCatalogo, 200); }));
  veu.addEventListener('click', fechar);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && gaveta.classList.contains('aberto')) fechar(); });

  // formulário do pedido
  const campoEnd = $('[data-endereco]'), campoTroco = $('[data-troco]'), erro = $('[data-erro]');
  form.addEventListener('change', () => {
    campoEnd.hidden = retirada();
    campoTroco.hidden = form.pag.value !== 'Dinheiro';
    desenhar();
  });
  $('[data-enviar]').addEventListener('click', () => {
    const nome = form.nome.value.trim(), end = form.endereco.value.trim();
    $$('.campo', form).forEach((c) => c.classList.remove('falta'));
    if (!nome || (!retirada() && end.length < 6)) {
      if (!nome) form.nome.closest('.campo').classList.add('falta');
      if (!retirada() && end.length < 6) campoEnd.classList.add('falta');
      erro.textContent = !nome ? 'Diga seu nome para a gente saber de quem é o pedido.' : 'Coloque o endereço com número e bairro para a entrega.';
      (!nome ? form.nome : form.endereco).focus();
      return;
    }
    erro.textContent = '';
    const sub = subtotal(), t = taxa();
    const linhas = Object.entries(carrinho).map(([id, q]) => `${q}x ${D.produtos[id].n}  ${real(D.produtos[id].p * q)}`);
    const msg = [
      `Olá, ${D.nome}! Quero fazer este pedido:`, '',
      ...linhas, '',
      `Produtos: ${real(sub)}`,
      `Entrega: ${retirada() ? 'retirada no balcão' : t ? real(t) : 'grátis'}`,
      `*Total: ${real(sub + t)}*`, '',
      `Nome: ${nome}`,
      retirada() ? 'Vou retirar no balcão.' : `Endereço: ${end}`,
      `Pagamento: ${form.pag.value}${form.pag.value === 'Dinheiro' && form.troco.value.trim() ? `, troco para R$ ${form.troco.value.trim()}` : ''}`,
      form.obs.value.trim() ? `Observação: ${form.obs.value.trim()}` : '',
    ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
    window.open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });

  filtrar();
  desenhar();
})();
