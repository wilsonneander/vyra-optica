// Tampinha Standard Empório: comportamento do site (um arquivo para todas as páginas).
// Os dados vêm de window.TAMPINHA, gravado pelo build. Carrinho, idade, agendamentos e contatos ficam no localStorage
// (nesta demonstração, nada vai para um servidor: o pedido e o agendamento terminam no WhatsApp).
(() => {
  const D = window.TAMPINHA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const raiz = document.documentElement;
  const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const real = (v) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const reais = (v) => (Number.isInteger(v) ? `R$ ${v.toLocaleString('pt-BR')}` : real(v));
  const normal = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const guarda = {
    ler(k, padrao = null) { try { const v = localStorage.getItem(k); return v === null ? padrao : JSON.parse(v); } catch (e) { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento: vale só nesta visita */ } },
  };
  const wa = (msg) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`;
  const naInicial = document.body.dataset.pg === 'inicio';

  // datas no horário de Brasília
  const agoraBR = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const iso = `${p.year}-${p.month}-${p.day}`;
    return { iso, dia: new Date(`${iso}T12:00:00`).getDay(), h: Number(p.hour) + Number(p.minute) / 60, seg: Number(p.hour) * 3600 + Number(p.minute) * 60 + Number(p.second) };
  };
  const somaDias = (iso, n) => { const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const diaSemana = (iso) => new Date(`${iso}T12:00:00`).getDay();
  const dataLonga = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  // ---------- aviso rápido ----------
  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (t) => { toastEl.textContent = t; toastEl.classList.add('ve'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('ve'), 3000); };

  // ---------- grupos com o mesmo tamanho (a largura do item mais longo) ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    g.style.removeProperty('--larg');
    if (!g.offsetParent && getComputedStyle(g).position !== 'fixed') return;
    if (getComputedStyle(g).display === 'grid') return; // em grade, as colunas já dividem igual
    let maior = 0;
    for (const f of g.children) {
      if (f.hidden || f.offsetParent === null) continue;
      const c = f.cloneNode(true);
      c.style.cssText = 'position:absolute;visibility:hidden;width:max-content;left:0;top:0;pointer-events:none';
      c.removeAttribute('id');
      // sem o name, o rádio clonado não desmarca o original do mesmo grupo
      c.querySelectorAll('[name]').forEach((x) => x.removeAttribute('name'));
      g.appendChild(c);
      maior = Math.max(maior, c.getBoundingClientRect().width);
      c.remove();
    }
    if (maior) g.style.setProperty('--larg', `${Math.min(Math.ceil(maior) + 2, g.clientWidth || 9999)}px`);
  });
  let igualaT;
  const igualaDepois = () => { clearTimeout(igualaT); igualaT = setTimeout(iguala, 60); };
  addEventListener('resize', igualaDepois);
  if (document.fonts) document.fonts.ready.then(iguala);
  iguala();

  // ---------- entrada suave dos blocos ----------
  const blocos = $$('.rev');
  if (reduz || !('IntersectionObserver' in window)) blocos.forEach((el) => el.classList.add('ve'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('ve'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    blocos.forEach((el) => {
      const irmaos = [...el.parentElement.children].filter((x) => x.classList.contains('rev'));
      const k = irmaos.indexOf(el);
      if (k > 0) el.style.setProperty('--d', `${Math.min(k, 6) * 0.07}s`);
      io.observe(el);
    });
  }

  // ---------- janelas legais e cookies ----------
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-doc]');
    if (b) { const d = $(`#doc-${b.dataset.doc}`); if (d && d.showModal) d.showModal(); }
  });
  $$('dialog').forEach((d) => {
    $$('[data-fecha]', d).forEach((x) => x.addEventListener('click', () => d.close()));
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });
  const ck = $('#cookies');
  const abreCookies = () => { ck.hidden = false; igualaDepois(); };
  if (!guarda.ler('tampinha-emporio-cookies')) abreCookies();
  $$('[data-ck]', ck).forEach((b) => b.addEventListener('click', () => { guarda.gravar('tampinha-emporio-cookies', { escolha: b.dataset.ck, em: new Date().toISOString() }); ck.hidden = true; }));
  $$('[data-cookies]').forEach((b) => b.addEventListener('click', abreCookies));

  // ---------- topo: sombra ao rolar e menu do celular ----------
  const topo = $('[data-topo]');
  const marcaTopo = () => topo.classList.toggle('rolou', scrollY > 40);
  addEventListener('scroll', marcaTopo, { passive: true }); marcaTopo();
  const menuBtn = $('.menu-btn'), menu = $('#menu');
  const fechaMenu = () => { menu.classList.remove('aberto'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Abrir o menu'); };
  menuBtn.addEventListener('click', () => { const a = !menu.classList.contains('aberto'); menu.classList.toggle('aberto', a); menuBtn.setAttribute('aria-expanded', String(a)); menuBtn.setAttribute('aria-label', a ? 'Fechar o menu' : 'Abrir o menu'); });
  $$('a', menu).forEach((a) => a.addEventListener('click', fechaMenu));

  // ---------- aberto agora? ----------
  const agora = agoraBR();
  const status = $('[data-status]');
  const fmtH = (x) => `${x % 24}h`;
  const ontem = D.abertura[(agora.dia + 6) % 7], hoje = D.abertura[agora.dia];
  let aberto = false;
  if (ontem[1] > 24 && agora.h < ontem[1] - 24) { status.textContent = `Aberto agora, entregas até ${fmtH(ontem[1])}`; aberto = true; }
  else if (agora.h >= hoje[0] && agora.h < hoje[1]) { status.textContent = `Aberto agora, entregas até ${fmtH(hoje[1])}`; aberto = true; }
  else status.textContent = `Fechado agora. Abrimos às ${fmtH(agora.h < hoje[0] ? hoje[0] : D.abertura[(agora.dia + 1) % 7][0])}`;
  status.classList.toggle('aberto', aberto);
  const online = $('[data-online]');
  if (online && !aberto) { online.textContent = 'Fora do horário: respondo a partir das 10h'; online.classList.add('fora'); }
  const linhaHoje = agora.dia === 0 ? 2 : agora.dia >= 5 ? 1 : 0;
  $$(`.horarios tr[data-linha="${linhaHoje}"]`).forEach((tr) => tr.classList.add('hoje'));
  $$('[data-ano]').forEach((e) => { e.textContent = new Date().getFullYear(); });

  // ---------- ofertas do dia: contagem até a meia-noite ----------
  const relogios = $$('[data-conta-regressiva]');
  if (relogios.length) {
    const doisDig = (n) => String(n).padStart(2, '0');
    const tique = () => {
      const falta = 86400 - agoraBR().seg;
      const t = `${doisDig(Math.floor(falta / 3600))}:${doisDig(Math.floor((falta % 3600) / 60))}:${doisDig(falta % 60)}`;
      relogios.forEach((r) => { r.textContent = t; });
    };
    tique(); setInterval(tique, 1000);
  }

  // ---------- capa: carrossel de cartazes (setas, arraste, avanço que pausa com o mouse) ----------
  const cartazes = $('[data-cartazes]');
  if (cartazes) {
    const slides = $$('[data-cartaz]', cartazes), barras = $$('.cartaz-barras i', cartazes);
    const TEMPO = 6500;
    cartazes.style.setProperty('--tempo', `${TEMPO}ms`);
    let i = 0, timer = null, pausa = false;
    const mostra = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        const on = k === i;
        s.classList.toggle('on', on);
        s.setAttribute('aria-hidden', String(!on));
        $$('a', s).forEach((a) => { a.tabIndex = on ? 0 : -1; });
      });
      barras.forEach((b, k) => { b.classList.remove('on'); b.classList.toggle('feito', k < i); });
      void cartazes.offsetWidth;
      barras[i].classList.add('on');
      agenda();
    };
    const agenda = () => { clearTimeout(timer); if (!reduz && !pausa) timer = setTimeout(() => mostra(i + 1), TEMPO); };
    $$('[data-cartaz-ir]', cartazes).forEach((b) => b.addEventListener('click', () => mostra(i + Number(b.dataset.cartazIr))));
    const pausar = (p) => { pausa = p; cartazes.classList.toggle('pausa', p); if (p) clearTimeout(timer); else agenda(); };
    cartazes.addEventListener('mouseenter', () => pausar(true));
    cartazes.addEventListener('mouseleave', () => pausar(false));
    cartazes.addEventListener('focusin', () => pausar(true));
    cartazes.addEventListener('focusout', () => pausar(false));
    let x0 = null;
    cartazes.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    cartazes.addEventListener('pointerup', (e) => { if (x0 !== null && Math.abs(e.clientX - x0) > 50) mostra(i + (e.clientX < x0 ? 1 : -1)); x0 = null; });
    document.addEventListener('visibilitychange', () => (document.hidden ? clearTimeout(timer) : agenda()));
    if (reduz) cartazes.classList.add('pausa');
    mostra(0);
  }

  // ---------- trilhos (ofertas e depoimentos): setas, arraste com o mouse e barra de progresso ----------
  $$('[data-trilho]').forEach((tr) => {
    const barra = $(`[data-progresso="${tr.id}"]`);
    const passo = () => { const c = tr.children[0]; return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(tr).columnGap) || 16) : tr.clientWidth; };
    const fim = () => tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4;
    const vai = (n) => {
      if (n > 0 && fim()) tr.scrollTo({ left: 0 });
      else if (n < 0 && tr.scrollLeft <= 4) tr.scrollTo({ left: tr.scrollWidth });
      else tr.scrollBy({ left: n * passo() * Math.max(1, Math.floor(tr.clientWidth / passo()) - 1) });
    };
    $$(`[data-trilho-ir][aria-controls="${tr.id}"]`).forEach((b) => b.addEventListener('click', () => vai(Number(b.dataset.trilhoIr))));
    tr.addEventListener('keydown', (e) => { if (e.target !== tr) return; if (e.key === 'ArrowRight') { e.preventDefault(); vai(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); vai(-1); } });
    const progresso = () => {
      if (!barra) return;
      const vis = tr.clientWidth / tr.scrollWidth, max = tr.scrollWidth - tr.clientWidth;
      barra.style.width = `${vis * 100}%`;
      barra.style.transform = `translateX(${max ? (tr.scrollLeft / max) * ((1 - vis) / vis) * 100 : 0}%)`;
    };
    tr.addEventListener('scroll', progresso, { passive: true }); addEventListener('resize', progresso); progresso();
    let x0 = null, s0 = 0, moveu = false, pausa = false;
    tr.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.target.closest('button')) return; x0 = e.clientX; s0 = tr.scrollLeft; moveu = false; });
    addEventListener('pointermove', (e) => { if (x0 === null) return; const dx = e.clientX - x0; if (Math.abs(dx) > 5) { moveu = true; tr.classList.add('arrastando'); } tr.scrollLeft = s0 - dx; });
    addEventListener('pointerup', () => { if (x0 === null) return; x0 = null; tr.classList.remove('arrastando'); });
    tr.addEventListener('click', (e) => { if (moveu) { e.preventDefault(); e.stopPropagation(); moveu = false; } }, true);
    tr.addEventListener('dragstart', (e) => e.preventDefault());
    if (tr.hasAttribute('data-auto') && !reduz) {
      ['mouseenter', 'focusin', 'touchstart'].forEach((ev) => tr.addEventListener(ev, () => { pausa = true; }, { passive: true }));
      ['mouseleave', 'focusout'].forEach((ev) => tr.addEventListener(ev, () => { pausa = false; }));
      setInterval(() => { const r = tr.getBoundingClientRect(); if (!pausa && !document.hidden && r.top < innerHeight && r.bottom > 0) vai(1); }, 5500);
    }
  });

  // ---------- confirmação de idade (+18) ----------
  const idade = $('#idade');
  const ehAlc = (id) => Boolean(D.produtos[id] && D.produtos[id].a);
  const abrirIdade = () => { idade.hidden = false; document.body.classList.add('travado'); igualaDepois(); setTimeout(() => $('[data-idade="sim"]', idade).focus(), 50); };
  if (!guarda.ler('tampinha-emporio-idade')) abrirIdade();
  $$('[data-idade]').forEach((b) => b.addEventListener('click', () => {
    const sim = b.dataset.idade === 'sim';
    guarda.gravar('tampinha-emporio-idade', sim ? 'sim' : 'nao');
    raiz.classList.toggle('sem-alcool', !sim);
    if (!sim) Object.keys(carrinho).forEach((id) => { if (ehAlc(id)) delete carrinho[id]; });
    idade.hidden = true;
    document.body.classList.remove('travado');
    salvar(); filtrar(); igualaDepois();
  }));
  $$('[data-rever-idade]').forEach((b) => b.addEventListener('click', abrirIdade));

  // ---------- catálogo: corredores, busca e "ver mais" (só na página inicial) ----------
  const grade = $('[data-grade]');
  const cards = grade ? $$('.prod', grade) : [];
  const entrada = $('[data-busca-input]'), limpar = $('[data-limpar]');
  const achados = $('[data-achados]'), vazio = $('[data-vazio]'), verMais = $('[data-ver-mais]');
  const nomes = Object.fromEntries($$('[data-chip]').map((c) => [c.dataset.chip, c.textContent]));
  const LIMITE = 12;
  let catAtual = 'tudo', tudoAberto = false, anima = false;
  function filtrar() {
    if (!grade) return;
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
      if (ok) {
        c.classList.remove('entra');
        if (!reduz && (!antes || anima)) { void c.offsetWidth; c.style.setProperty('--i', Math.min(mostrados, 12)); c.classList.add('entra'); }
        mostrados++;
      }
    });
    anima = false;
    verMais.parentElement.hidden = !(corta && n > LIMITE);
    verMais.lastChild.textContent = `Ver as outras ${n - LIMITE} bebidas`;
    limpar.hidden = !q;
    vazio.hidden = n > 0;
    achados.textContent = q || catAtual !== 'tudo'
      ? `${n} ${n === 1 ? 'bebida' : 'bebidas'}${catAtual !== 'tudo' ? ` em ${nomes[catAtual]}` : ''}${q ? ` para "${entrada.value.trim()}"` : ''}`
      : `${n} bebidas geladas na gôndola`;
  }
  const escolher = (id) => {
    catAtual = nomes[id] ? id : 'tudo';
    $$('[data-chip]').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.chip === catAtual)));
    anima = true; filtrar();
  };
  const irCatalogo = () => $('#catalogo').scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' });
  if (grade) {
    $$('[data-chip]').forEach((c) => c.addEventListener('click', () => escolher(c.dataset.chip)));
    verMais.addEventListener('click', () => { tudoAberto = true; filtrar(); const c = cards.filter((x) => !x.hidden)[LIMITE]; if (c) c.querySelector('button').focus({ preventScroll: true }); });
    entrada.addEventListener('input', () => { anima = true; filtrar(); });
    limpar.addEventListener('click', () => { entrada.value = ''; anima = true; filtrar(); entrada.focus(); });
    $$('[data-cat-ir]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); entrada.value = ''; escolher(b.dataset.catIr); irCatalogo(); }));
    $$('[data-marca]').forEach((b) => b.addEventListener('click', () => { entrada.value = b.dataset.marca; escolher('tudo'); irCatalogo(); }));
    // vindo de outra página: ?cat=... ou ?busca=...
    const q = new URLSearchParams(location.search);
    if (q.get('busca')) { entrada.value = q.get('busca'); $('#busca-topo').value = q.get('busca'); }
    if (q.get('cat')) escolher(q.get('cat'));
  }
  // busca do topo: na inicial filtra a gôndola; nas outras páginas leva até ela
  $('[data-busca-topo]').addEventListener('submit', (e) => {
    const termo = $('#busca-topo').value.trim();
    if (!grade) { e.preventDefault(); location.href = `index.html?busca=${encodeURIComponent(termo)}#catalogo`; return; }
    e.preventDefault();
    entrada.value = termo; escolher('tudo'); irCatalogo(); fechaMenu();
  });

  // ---------- carrinho ----------
  let carrinho = guarda.ler('tampinha-emporio-carrinho', {}) || {};
  Object.keys(carrinho).forEach((id) => { if (!D.produtos[id] || !(carrinho[id] > 0)) delete carrinho[id]; });
  const gaveta = $('#carrinho'), veu = $('[data-veu]');
  const itensEl = $('[data-itens]'), vazioCar = $('[data-car-vazio]');
  const form = $('[data-pedido]');
  const subtotal = () => Object.entries(carrinho).reduce((s, [id, q]) => s + D.produtos[id].p * q, 0);
  const conta = () => Object.values(carrinho).reduce((s, q) => s + q, 0);
  const retirada = () => form.receber.value === 'retirada';
  const taxa = () => (retirada() || subtotal() >= D.entrega.gratisAcima || !conta() ? 0 : D.entrega.taxa);
  const svgMenos = $('[data-menos] svg').outerHTML, svgMais = $('[data-mais] svg').outerHTML;

  function salvar() { guarda.gravar('tampinha-emporio-carrinho', carrinho); desenhar(); }
  function mudar(id, delta, origem) {
    if (delta > 0 && ehAlc(id) && raiz.classList.contains('sem-alcool')) return;
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
    $('[data-barra]').hidden = n === 0;
    document.body.classList.toggle('tem-itens', n > 0);
    itensEl.innerHTML = '';
    Object.entries(carrinho).forEach(([id, q]) => {
      const p = D.produtos[id];
      const li = document.createElement('li');
      li.innerHTML = `<span class="mini"><img src="${esc(p.i)}" alt=""${p.c === 'drink' ? ' class="amb"' : ''}></span><div><b></b><span>${q} x ${real(p.p)} = <strong>${real(p.p * q)}</strong></span></div>
        <div class="qtd"><button type="button" aria-label="Tirar um">${svgMenos}</button><output>${q}</output><button type="button" aria-label="Pôr mais um">${svgMais}</button></div>`;
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
    $('[data-frete-barra]').style.width = `${Math.min(100, (sub / D.entrega.gratisAcima) * 100)}%`;
    $('[data-subtotal]').textContent = real(sub);
    $('[data-taxa]').textContent = retirada() ? 'retirada' : t ? real(t) : 'grátis';
    $('[data-total]').textContent = real(sub + t);
    $('[data-enviar]').disabled = n === 0;
  }

  // a foto do produto voa até o carrinho
  function voar(origem) {
    const barraVisivel = !$('[data-barra]').hidden && getComputedStyle($('[data-barra]')).display !== 'none';
    const alvo = barraVisivel ? $('.barra-carrinho button') : $('.carrinho-btn');
    const pular = () => { alvo.classList.remove('pulo'); void alvo.offsetWidth; alvo.classList.add('pulo'); };
    if (reduz || gaveta.classList.contains('aberto')) return pular();
    const bloco = origem.closest('.prod, .kit, .extra');
    const img = bloco && bloco.querySelector('img');
    if (!img) return pular();
    const a = img.getBoundingClientRect(), b = alvo.getBoundingClientRect();
    const lado = Math.min(Math.max(a.width, a.height), 180);
    const el = document.createElement('div');
    el.className = 'voa';
    const im = img.cloneNode(); im.removeAttribute('loading'); el.appendChild(im);
    Object.assign(el.style, { width: `${lado}px`, height: `${lado}px`, left: `${a.left + a.width / 2 - lado / 2}px`, top: `${a.top + a.height / 2 - lado / 2}px` });
    document.body.appendChild(el);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const fim = 36 / lado;
    el.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 80}px) scale(${Math.max(fim * 2.4, 0.35)}) rotate(-12deg)`, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(${fim}) rotate(8deg)`, opacity: 0.85 },
    ], { duration: 720, easing: 'cubic-bezier(.45,.05,.3,1)' }).onfinish = () => { el.remove(); pular(); };
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
    const rotulo = $('span', b), txt = rotulo.textContent;
    rotulo.textContent = 'Kit no carrinho';
    setTimeout(() => { rotulo.textContent = txt; }, 1800);
  }));

  // abrir e fechar a gaveta
  let focoAntes = null;
  const abrir = () => {
    focoAntes = document.activeElement;
    veu.hidden = false; requestAnimationFrame(() => veu.classList.add('on'));
    gaveta.classList.add('aberto'); gaveta.setAttribute('aria-hidden', 'false');
    document.body.classList.add('travado');
    setTimeout(() => { $('.car-fechar').focus(); iguala(); }, 80);
  };
  const fechar = () => {
    veu.classList.remove('on'); setTimeout(() => { veu.hidden = true; }, 350);
    gaveta.classList.remove('aberto'); gaveta.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('travado');
    if (focoAntes) focoAntes.focus({ preventScroll: true });
  };
  $$('[data-abrir-carrinho]').forEach((b) => b.addEventListener('click', abrir));
  $$('[data-fechar-carrinho]').forEach((b) => b.addEventListener('click', (e) => {
    if (b.dataset.ir && grade) { e.preventDefault(); fechar(); setTimeout(irCatalogo, 200); } else fechar();
  }));
  veu.addEventListener('click', fechar);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (gaveta.classList.contains('aberto')) fechar(); fechaMenu(); } });

  // pedido no WhatsApp
  const campoEnd = $('[data-endereco]'), campoTroco = $('[data-troco]'), erroPedido = $('[data-erro-pedido]');
  form.addEventListener('change', () => { campoEnd.hidden = retirada(); campoTroco.hidden = form.pag.value !== 'Dinheiro'; desenhar(); });
  $('[data-enviar]').addEventListener('click', () => {
    const nome = form.nome.value.trim(), end = form.endereco.value.trim();
    $$('.campo', form).forEach((c) => c.classList.remove('falta'));
    if (!nome || (!retirada() && end.length < 6)) {
      if (!nome) form.nome.closest('.campo').classList.add('falta');
      if (!retirada() && end.length < 6) campoEnd.classList.add('falta');
      erroPedido.textContent = !nome ? 'Diga seu nome para a gente saber de quem é o pedido.' : 'Coloque o endereço com número e bairro para a entrega.';
      (!nome ? form.nome : form.endereco).focus();
      return;
    }
    erroPedido.textContent = '';
    const sub = subtotal(), t = taxa();
    const temAlc = Object.keys(carrinho).some(ehAlc);
    const msg = [
      `Olá, ${D.nome}! Quero fazer este pedido pelo site:`, '',
      ...Object.entries(carrinho).map(([id, q]) => `${q}x ${D.produtos[id].n}  ${real(D.produtos[id].p * q)}`), '',
      `Produtos: ${real(sub)}`,
      `Entrega: ${retirada() ? 'retirada no balcão' : t ? real(t) : 'grátis'}`,
      `*Total: ${real(sub + t)}*`, '',
      `Nome: ${nome}`,
      retirada() ? 'Vou retirar no balcão.' : `Endereço: ${end}`,
      `Pagamento: ${form.pag.value}${form.pag.value === 'Dinheiro' && form.troco.value.trim() ? `, troco para R$ ${form.troco.value.trim()}` : ''}`,
      form.obs.value.trim() ? `Observação: ${form.obs.value.trim()}` : '',
      temAlc ? 'Confirmo que tenho 18 anos ou mais.' : '',
    ].filter((l, k, a) => l !== '' || (a[k - 1] !== '' && k < a.length - 1)).join('\n');
    window.open(wa(msg), '_blank', 'noopener');
  });

  // ---------- abas dos serviços (com setas do teclado) ----------
  const abas = $$('[data-aba]');
  const abreAba = (id, foco) => {
    abas.forEach((b) => { const s = b.dataset.aba === id; b.setAttribute('aria-selected', String(s)); b.tabIndex = s ? 0 : -1; if (s && foco) b.focus(); });
    $$('.seg').forEach((s) => { s.hidden = s.id !== `seg-${id}`; });
  };
  abas.forEach((b, k) => {
    b.addEventListener('click', () => abreAba(b.dataset.aba));
    b.addEventListener('keydown', (e) => {
      const n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (n) { e.preventDefault(); abreAba(abas[(k + n + abas.length) % abas.length].dataset.aba, true); }
    });
  });

  // ---------- galeria: filtros e foto ampliada ----------
  const visor = $('[data-visor]');
  let fotosVisor = [], iv = 0, focoVisor;
  const mostraVisor = () => { const f = fotosVisor[iv]; $('[data-visor-img]', visor).src = f.dataset.foto; $('[data-visor-img]', visor).alt = f.dataset.leg; $('[data-visor-leg]', visor).textContent = f.dataset.leg; };
  const fechaVisor = () => { visor.hidden = true; document.body.classList.remove('travado'); if (focoVisor) focoVisor.focus(); };
  $$('[data-galeria]').forEach((g) => g.addEventListener('click', (e) => {
    const b = e.target.closest('[data-foto]'); if (!b) return;
    fotosVisor = $$('[data-foto]', g).filter((x) => !x.classList.contains('some'));
    iv = fotosVisor.indexOf(b); focoVisor = b;
    mostraVisor(); visor.hidden = false; document.body.classList.add('travado'); $('[data-visor-fecha]', visor).focus();
  }));
  $('[data-visor-fecha]', visor).addEventListener('click', fechaVisor);
  $$('[data-visor-ir]', visor).forEach((b) => b.addEventListener('click', () => { iv = (iv + Number(b.dataset.visorIr) + fotosVisor.length) % fotosVisor.length; mostraVisor(); }));
  visor.addEventListener('click', (e) => { if (e.target === visor) fechaVisor(); });
  addEventListener('keydown', (e) => {
    if (visor.hidden) return;
    if (e.key === 'Escape') fechaVisor();
    if (e.key === 'ArrowRight') $('[data-visor-ir="1"]', visor).click();
    if (e.key === 'ArrowLeft') $('[data-visor-ir="-1"]', visor).click();
  });
  $$('[data-gal]').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.gal;
    $$('[data-gal]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$('.gal-item').forEach((it) => it.classList.toggle('some', !(f === 'todas' || it.dataset.cat === f)));
  }));

  // ---------- agendamento: serviço, quem atende, data e horário ----------
  const fa = $('[data-agenda]');
  if (fa) {
    const servDe = (id) => D.servicos.find((s) => s.id === id);
    const profDe = (id) => D.equipe.find((m) => m.id === id);
    const el = (n) => fa.elements[n];
    const resumo = $('[data-resumo]'), r = (k) => $(`[data-r="${k}"]`, resumo);
    const selProf = $('[data-prof]', fa), horas = $('[data-horas]', fa), dataEl = $('[data-data]', fa), campoPessoas = $('[data-campo-pessoas]', fa);
    const hojeIso = agoraBR().iso;
    const rotulo = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`;
    const duracao = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
    let horaSel = null;
    const serv = () => servDe(fa.querySelector('[name="serv"]:checked').value);
    // horários de cada tipo de serviço; "loja" segue o horário de entrega do dia
    const horariosDe = (s, iso) => {
      const d = diaSemana(iso), serie = (a, b, p) => { const l = []; for (let h = a; h <= b + 0.001; h += p) l.push(h); return l; };
      let lista;
      if (s.turnos === 'loja') { const [a, b] = D.abertura[d]; lista = serie(a + 0.5, Math.min(b, 24) - 1, 0.5); }
      else if (s.turnos === 'comercial') lista = d === 0 || d === 6 ? [] : serie(9, 16, 1);
      else if (s.turnos === 'noite') lista = d >= 2 && d <= 6 ? [18, 19, 20] : [];
      else lista = [11, 12, 14, 16, 18, 19, 20];
      const a = agoraBR();
      return iso === a.iso ? lista.filter((h) => h > a.h + 1) : lista;
    };
    const opcoes = () => {
      const s = serv(), antes = selProf.value;
      selProf.innerHTML = `<option value="">Sem preferência</option>${s.prof.map((id) => `<option value="${id}">${esc(profDe(id).nome)}, ${esc(profDe(id).cargo.toLowerCase())}</option>`).join('')}`;
      if (s.prof.includes(antes)) selProf.value = antes;
      campoPessoas.hidden = !s.pessoas;
      if (s.pessoas) {
        const [mn, mx] = s.pessoas, p = el('pessoas');
        p.min = mn; p.max = mx;
        if (Number(p.value) < mn) p.value = mn;
        if (Number(p.value) > mx) p.value = mx;
      }
      dataEl.min = somaDias(hojeIso, s.antecedencia); dataEl.max = somaDias(hojeIso, 120);
      if (dataEl.value && dataEl.value < dataEl.min) dataEl.value = '';
    };
    const desenhaHoras = () => {
      const iso = dataEl.value;
      if (!iso) { horas.innerHTML = '<p class="ag-vazio">Escolha uma data para ver os horários.</p>'; horaSel = null; return; }
      const s = serv(), lista = horariosDe(s, iso);
      if (!lista.length) {
        horas.innerHTML = `<p class="ag-vazio">${s.turnos === 'comercial' ? 'A visita às empresas é de segunda a sexta, das 9h às 16h.' : s.turnos === 'noite' ? 'A degustação acontece de terça a sábado, às 18h, 19h ou 20h.' : 'Não há horário livre nesse dia. Tente outra data.'}</p>`;
        horaSel = null; return;
      }
      if (!lista.map(rotulo).includes(horaSel)) horaSel = null;
      horas.innerHTML = lista.map((h) => { const t = rotulo(h); return `<button type="button" role="radio" aria-checked="${t === horaSel}" data-h="${t}">${t}</button>`; }).join('');
    };
    horas.addEventListener('click', (e) => { const b = e.target.closest('[data-h]'); if (!b) return; horaSel = b.dataset.h; $$('[data-h]', horas).forEach((x) => x.setAttribute('aria-checked', String(x === b))); atualiza(); });
    const atualiza = () => {
      const s = serv(), p = Number(el('pessoas').value) || 1;
      r('serv').textContent = s.nome;
      r('prof').textContent = selProf.value ? profDe(selProf.value).nome : 'Sem preferência';
      r('quando').textContent = dataEl.value ? `${dataLonga(dataEl.value)}${horaSel ? `, ${horaSel}` : ''}` : 'Escolha a data';
      r('dur').textContent = s.id === 'chopp' ? 'até 8h de chopeira' : duracao(s.min);
      r('total').textContent = !s.preco ? 'Sem custo' : s.pessoas ? `${s.de ? 'a partir de ' : ''}${reais(s.preco * p)}` : `${s.de ? 'a partir de ' : ''}${reais(s.preco)}`;
      const sinal = r('sinal');
      sinal.hidden = !s.sinal;
      if (s.sinal) sinal.textContent = `Sinal de 30% por Pix para reservar a data (${reais(Math.round((s.pessoas ? s.preco * p : s.preco) * 0.3))}). Volta inteiro se cancelar até 7 dias antes.`;
    };
    fa.addEventListener('change', (e) => {
      if (e.target.name === 'serv') { opcoes(); desenhaHoras(); }
      if (e.target === dataEl) desenhaHoras();
      atualiza();
    });
    fa.addEventListener('input', atualiza);
    const escolhe = (id, profId) => {
      const radio = fa.querySelector(`[name="serv"][value="${id}"]`);
      if (!radio) return;
      radio.checked = true; opcoes();
      if (profId && serv().prof.includes(profId)) selProf.value = profId;
      desenhaHoras(); atualiza();
    };
    $$('[data-agendar]').forEach((a) => a.addEventListener('click', () => escolhe(a.dataset.agendar)));
    opcoes();
    const q = new URLSearchParams(location.search);
    if (q.get('serv')) escolhe(q.get('serv'), q.get('prof'));
    desenhaHoras(); atualiza();

    const erro = $('[data-erro]', fa);
    fa.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const s = serv(), p = Number(el('pessoas').value);
      const falta = [];
      const marca = (campo, ok) => { campo.setAttribute('aria-invalid', String(!ok)); if (!ok) falta.push(campo); };
      marca(el('nome'), el('nome').value.trim().length > 2);
      marca(el('tel'), el('tel').value.replace(/\D/g, '').length >= 10);
      marca(dataEl, Boolean(dataEl.value));
      const precisaEnd = s.id !== 'retirada' && s.id !== 'degustacao';
      marca(el('end'), !precisaEnd || el('end').value.trim().length > 5);
      if (s.pessoas) marca(el('pessoas'), p >= s.pessoas[0] && p <= s.pessoas[1]);
      let msg = '';
      if (!horaSel) msg = 'Escolha um horário.';
      if (!el('lgpd').checked) msg = 'Para agendar, aceite o uso dos dados conforme a Política de privacidade.';
      if (falta.length) msg = falta.includes(el('end')) ? 'Coloque o endereço da entrega ou do evento.' : 'Confira os campos marcados.';
      if (s.pessoas && falta.includes(el('pessoas'))) msg = `${s.nome} é para ${s.pessoas[0]} a ${s.pessoas[1]} pessoas.`;
      erro.textContent = msg;
      if (msg) { (falta[0] || (!horaSel ? horas : el('lgpd'))).focus?.(); return; }
      const ag = { id: `a-${Date.now().toString(36)}`, serv: s.id, prof: selProf.value, data: dataEl.value, hora: horaSel, pessoas: s.pessoas ? p : null, nome: el('nome').value.trim(), criado: new Date().toISOString() };
      guarda.gravar('tampinha-emporio-agendamentos', [...guarda.ler('tampinha-emporio-agendamentos', []), ag]);
      const quando = `${dataLonga(ag.data)}, às ${ag.hora}`;
      const texto = [
        `Olá, ${D.nome}! Quero agendar pelo site: ${s.nome}, ${quando}${s.pessoas ? `, ${p} pessoas` : ''}${ag.prof ? `, com ${profDe(ag.prof).nome}` : ''}.`,
        `Nome: ${ag.nome}. WhatsApp: ${el('tel').value.trim()}.`,
        el('end').value.trim() ? `Endereço: ${el('end').value.trim()}.` : '',
        el('obs').value.trim() ? `Observações: ${el('obs').value.trim()}.` : '',
      ].filter(Boolean).join('\n');
      const confirmaNaHora = s.turnos === 'loja';
      const ok = $('[data-ok]', fa.parentElement);
      $('[data-ok-txt]', ok).textContent = confirmaNaHora
        ? `${s.nome}, ${quando}. Está reservado. Envie também pelo WhatsApp para receber o lembrete.`
        : `${s.nome}, ${quando}. Envie o pedido pelo WhatsApp: respondemos em até 4 horas${s.sinal ? ' com a chave Pix do sinal' : ''} e confirmamos.`;
      $('[data-ok-wa]', ok).href = wa(texto);
      fa.hidden = true; resumo.hidden = true; ok.hidden = false; ok.focus(); iguala();
      $('[data-ok-nova]', ok).onclick = () => { ok.hidden = true; fa.hidden = false; resumo.hidden = false; horaSel = null; desenhaHoras(); atualiza(); fa.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' }); };
    });
  }

  // ---------- contato ----------
  const fc = $('[data-contato]');
  if (fc) {
    fc.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const el = (n) => fc.elements[n], erro = $('[data-erro]', fc);
      const falta = ['nome', 'tel', 'msg'].map(el).filter((c) => { const ok = c.value.trim().length > 1; c.setAttribute('aria-invalid', String(!ok)); return !ok; });
      if (el('email').value && !el('email').checkValidity()) { el('email').setAttribute('aria-invalid', 'true'); falta.push(el('email')); }
      erro.textContent = falta.length ? 'Preencha os campos marcados.' : !el('lgpd').checked ? 'Para enviar, aceite o uso dos dados conforme a Política de privacidade.' : '';
      if (erro.textContent) { (falta[0] || el('lgpd')).focus(); return; }
      guarda.gravar('tampinha-emporio-contatos', [...guarda.ler('tampinha-emporio-contatos', []), { nome: el('nome').value.trim(), assunto: el('assunto').value, em: new Date().toISOString() }]);
      $('[data-ok]', fc).hidden = false;
      window.open(wa(`Olá, ${D.nome}! Sou ${el('nome').value.trim()}. Assunto: ${el('assunto').value}. ${el('msg').value.trim()}`), '_blank', 'noopener');
      toast('Mensagem enviada');
      fc.reset();
    });
  }

  filtrar();
  desenhar();
})();
