// Tampinha Bebidas, modelo Gold: interação da página e carrinho que monta o pedido para o WhatsApp.
(() => {
  const D = {"whatsapp":"5531999990000","nome":"Tampinha","abertura":[[10,22],[10,23],[10,23],[10,23],[10,23],[10,25],[10,25]],"entrega":{"taxa":6.9,"gratisAcima":99,"tempo":"30 a 45 min"},"produtos":{"reserva":{"n":"Tampinha Reserva","v":"lata 473ml","p":12.9,"c":"cerveja","a":1},"coca-vidro":{"n":"Coca-Cola Original","v":"garrafa de vidro 290ml","p":3.99,"c":"refri","a":0},"coca-2l":{"n":"Coca-Cola Original","v":"garrafa 2L","p":11.99,"c":"refri","a":0},"coca-zero-lata":{"n":"Coca-Cola Zero Açúcar","v":"lata 350ml","p":4.49,"c":"refri","a":0},"guarana-lata":{"n":"Guaraná Antarctica","v":"lata 350ml","p":3.99,"c":"refri","a":0},"guarana-zero-lata":{"n":"Guaraná Antarctica Zero","v":"lata 350ml","p":3.99,"c":"refri","a":0},"guarana-zero-2l":{"n":"Guaraná Antarctica Zero","v":"garrafa 2L","p":9.49,"c":"refri","a":0},"fanta-lata":{"n":"Fanta Laranja","v":"lata 350ml","p":3.99,"c":"refri","a":0},"sprite-2l":{"n":"Sprite","v":"garrafa 2L","p":9.49,"c":"refri","a":0},"sprite-zero-lata":{"n":"Sprite Sem Açúcar","v":"lata 350ml","p":3.99,"c":"refri","a":0},"schweppes-lata":{"n":"Água Tônica Schweppes","v":"lata 350ml","p":4.29,"c":"refri","a":0},"heineken-ln":{"n":"Heineken","v":"long neck 330ml","p":6.49,"c":"cerveja","a":1},"heineken-lata":{"n":"Heineken","v":"lata 350ml","p":5.49,"c":"cerveja","a":1},"heineken-zero":{"n":"Heineken 0.0 sem álcool","v":"long neck 330ml","p":6.49,"c":"cerveja","a":0},"budweiser-ln":{"n":"Budweiser","v":"long neck 330ml","p":5.99,"c":"cerveja","a":1},"budweiser-lata":{"n":"Budweiser","v":"lata 350ml","p":4.49,"c":"cerveja","a":1},"budweiser-aluminio":{"n":"Budweiser","v":"garrafa de alumínio 355ml","p":7.49,"c":"cerveja","a":1},"sol-ln":{"n":"Sol Premium","v":"long neck 330ml","p":5.25,"c":"cerveja","a":1},"skol-lata":{"n":"Skol Pilsen","v":"lata 350ml","p":3.29,"c":"cerveja","a":1},"brahma-lata":{"n":"Brahma Chopp","v":"lata 350ml","p":3.79,"c":"cerveja","a":1},"amstel-lata":{"n":"Amstel Lager","v":"lata 269ml","p":3.49,"c":"cerveja","a":1},"original-lata":{"n":"Antarctica Original","v":"lata 350ml","p":4.29,"c":"cerveja","a":1},"spaten-lata":{"n":"Spaten Munich","v":"latão 473ml","p":5.99,"c":"cerveja","a":1},"monster":{"n":"Monster Energy","v":"lata 473ml","p":9.38,"c":"energetico","a":0},"monster-zero":{"n":"Monster Absolutely Zero","v":"lata 473ml","p":9.38,"c":"energetico","a":0},"monster-violet":{"n":"Monster Ultra Violet","v":"lata 473ml","p":9.38,"c":"energetico","a":0},"monster-peachy":{"n":"Monster Ultra Peachy Keen","v":"lata 473ml","p":9.38,"c":"energetico","a":0},"redbull":{"n":"Red Bull Energy Drink","v":"lata 250ml","p":8.99,"c":"energetico","a":0},"smirnoff":{"n":"Vodka Smirnoff","v":"garrafa 998ml","p":37.6,"c":"destilado","a":1},"absolut":{"n":"Vodka Absolut","v":"garrafa 1L","p":89.9,"c":"destilado","a":1},"red-label":{"n":"Johnnie Walker Red Label","v":"garrafa 1L","p":109,"c":"destilado","a":1},"tanqueray":{"n":"Gin Tanqueray London Dry","v":"garrafa 750ml","p":114.9,"c":"destilado","a":1},"vinho-miolo":{"n":"Miolo Seleção Cabernet e Merlot","v":"garrafa 750ml","p":59.9,"c":"destilado","a":1},"vinho-campo-largo":{"n":"Campo Largo Tinto Suave","v":"garrafa 750ml","p":27.9,"c":"destilado","a":1},"vinho-pergola":{"n":"Pérgola Tinto Suave","v":"garrafa 750ml","p":29.9,"c":"destilado","a":1},"vinho-vindima":{"n":"Vindima Tinto Suave","v":"garrafa 750ml","p":24.9,"c":"destilado","a":1},"matte":{"n":"Matte Leão Natural","v":"garrafa 1,5L","p":7.99,"c":"cha","a":0},"del-valle-uva":{"n":"Del Valle Uva","v":"caixa 1L","p":9.99,"c":"cha","a":0},"ades-laranja":{"n":"Ades Soja e Laranja","v":"caixa 1L","p":8.99,"c":"cha","a":0},"drink-gin-frutas":{"n":"Gin tônica de frutas vermelhas","v":"copo 400ml","p":26.9,"c":"drink","a":1},"drink-rose":{"n":"Gin rosé com limão siciliano","v":"taça 200ml","p":24.9,"c":"drink","a":1},"drink-spritz-morango":{"n":"Spritz de morango","v":"taça 350ml","p":22.9,"c":"drink","a":1},"drink-maracuja":{"n":"Batida de maracujá","v":"taça 350ml","p":19.9,"c":"drink","a":1},"drink-soda-frutas":{"n":"Soda italiana de frutas vermelhas","v":"copo 400ml","p":14.9,"c":"drink","a":0},"crystal":{"n":"Água Crystal sem gás","v":"garrafa 500ml","p":2.49,"c":"agua","a":0},"crystal-azul":{"n":"Água Crystal sem gás gelada","v":"garrafa 500ml","p":2.79,"c":"agua","a":0},"galao-hydrate":{"n":"Água mineral Hydrate","v":"galão 5L","p":8.9,"c":"agua","a":0},"gelo":{"n":"Gelo em cubos","v":"saco 5kg","p":12.9,"c":"extra","a":0},"copo":{"n":"Copo descartável 300ml","v":"pacote 50un","p":7.9,"c":"extra","a":0},"carvao":{"n":"Carvão vegetal","v":"saco 3kg","p":19.9,"c":"extra","a":0}},"cats":{"cerveja":"Cervejas","energetico":"Energéticos","destilado":"Destilados e vinhos","cha":"Chás e sucos","drink":"Drinks","agua":"Água","refri":"Refrigerantes","extra":"Conveniência"},"kits":{"kit-churrasco":[["skol-lata",12],["coca-2l",2],["gelo",1],["carvao",1]],"kit-esquenta":[["smirnoff",1],["redbull",4],["gelo",1]],"kit-gin":[["tanqueray",1],["schweppes-lata",6],["gelo",1]]}};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const body = document.body;
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(pointer: fine)').matches;
  const real = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const guarda = {
    ler(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    por(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } },
  };

  // ---------- o que a loja publicou na Área do Cliente (painel.html) ----------
  // Sem publicação, o site fica como foi gerado. Com publicação, catálogo, categorias, seleção da casa,
  // preço da lata e horário são redesenhados a partir dos dados salvos (loja.js).
  const L = window.Loja, HR = window.Horario;
  if (L && L.temPublicado()) {
    const P = L.publicado();
    const e = L.esc;
    const cats = P.categorias;
    const nomeCat = (id) => (cats.find((c) => c.id === id) || {}).nome || '';
    const vis = L.visiveis(P);
    const icMais = ($('.add svg') || {}).outerHTML || '+';
    const icMenos = ($('[data-menos] svg') || {}).outerHTML || '-';
    const icSeta = ($('.ind-seta svg') || {}).outerHTML || '';
    const etiqueta = (v) => { const [r, c] = Number(v).toFixed(2).split('.'); return `<span class="etiqueta"><small>R$</small>${r}<i>,${c}</i></span>`; };
    const compraHTML = (p) => `<div class="compra" data-compra="${e(p.id)}"><button class="add" type="button" data-add="${e(p.id)}" aria-label="Pôr ${e(p.nome)} ${e(p.vol)} no carrinho">${icMais}<span>Adicionar</span></button><div class="qtd" aria-label="Quantidade de ${e(p.nome)}"><button type="button" data-menos="${e(p.id)}" aria-label="Tirar um">${icMenos}</button><output data-qtd="${e(p.id)}">0</output><button type="button" data-mais="${e(p.id)}" aria-label="Pôr mais um">${icMais}</button></div></div>`;
    const arte = (p, alt = true) => { const src = L.foto(p); const amb = p.amb && !p.fotoData; return src ? `<img class="arte${amb ? ' arte-amb' : ''}" src="${e(src)}" alt="${alt ? e(`${p.nome} ${p.vol}`) : ''}" loading="lazy" decoding="async" data-arte="${e(p.id)}">` : ''; };
    const normal = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const cardHTML = (p, cls = '') => `<article class="card${p.amb && !p.fotoData ? ' card-amb' : ''}${cls ? ' ' + cls : ''}" data-id="${e(p.id)}" data-cat="${e(p.cat)}" data-marca="${e(p.marca || '')}" data-preco="${p.preco}" data-busca="${e(normal(`${p.nome} ${p.marca || ''} ${p.vol} ${nomeCat(p.cat)}`))}"${p.alc ? ' data-alc' : ''} style="--tinta:${e(p.cor || '#B08D57')}">
          <div class="card-arte" data-tilt><span class="card-halo"></span>${arte(p)}</div>
          <div class="card-info"><small>${e(p.marca || nomeCat(p.cat))}${p.alc ? '<em>+18</em>' : ''}</small><h3>${e(p.nome)}</h3><span>${e(p.vol)}</span></div>
          <div class="card-pe">${etiqueta(p.preco)}${compraHTML(p)}</div>
        </article>`;
    // catálogo e seleção da casa
    const grade = $('[data-grade]');
    if (grade) grade.innerHTML = vis.map((p) => cardHTML(p)).join('');
    const trilhoEl = $('[data-trilho]');
    if (trilhoEl) trilhoEl.innerHTML = vis.filter((p) => p.destaque).map((p) => cardHTML(p, 'card-g')).join('');
    // filtros do catálogo
    const chipsEl = $('[data-chips]');
    if (chipsEl) chipsEl.innerHTML = [{ id: 'tudo', nome: 'Tudo' }, ...cats].map((c) => `<button type="button" class="chip${c.id === 'tudo' ? ' on' : ''}" data-chip="${e(c.id)}" aria-pressed="${c.id === 'tudo'}">${e(c.chip || c.nome)}</button>`).join('');
    // categorias em índice: as garrafas que aparecem são as primeiras da categoria
    const indiceEl = $('[data-indice]');
    if (indiceEl) indiceEl.innerHTML = cats.map((c) => {
      const da = vis.filter((p) => p.cat === c.id);
      const garrafas = da.filter((p) => !p.amb || p.fotoData).slice(0, 3);
      const artes = garrafas.length ? garrafas.map((p) => arte(p, false)).join('') : da[0] ? `<img class="ind-foto" src="${e(L.foto(da[0]))}" alt="" loading="lazy">` : '';
      const maior = c.alc || da.some((p) => p.alc);
      return `<li><button type="button" class="ind" data-filtro="${e(c.id)}" aria-label="${e(c.nome)}: ver ${da.length} opções"><span class="ind-nome">${e(c.nome)}</span><span class="ind-artes" aria-hidden="true">${artes}</span><span class="ind-info">${da.length} ${da.length === 1 ? 'opção' : 'opções'}${maior ? ' <em>+18</em>' : ''}</span><span class="ind-seta">${icSeta}</span></button></li>`;
    }).join('');
    // dados do carrinho
    vis.forEach((p) => { D.produtos[p.id] = { n: p.nome, v: p.vol, p: p.preco, c: p.cat, a: p.alc ? 1 : 0 }; });
    D.cats = Object.fromEntries([...cats.map((c) => [c.id, c.nome]), ['extra', 'Conveniência']]);
    // kits só aparecem se todas as bebidas deles continuam no site
    const ok = new Set([...vis.map((p) => p.id), ...(L.base.extras || [])]);
    $$('[data-kit]').forEach((b) => { const k = D.kits[b.dataset.kit]; if (k && !k.every(([id]) => ok.has(id))) b.closest('.kit').hidden = true; });
    // preço da lata da casa
    const res = vis.find((p) => p.id === 'reserva');
    const pe = $('.reserva-pe');
    if (pe) { if (res) pe.querySelector('.etiqueta').outerHTML = etiqueta(res.preco); else pe.hidden = true; }
    D.abertura = P.abertura;
  }
  // horário (o padrão ou o publicado)
  if (HR) {
    const horas = $('[data-horas]');
    if (horas) horas.innerHTML = HR.grupos(D.abertura).map(([d, h]) => `<li><span>${d}</span><b>${h}</b></li>`).join('');
    const ht = $('[data-horario-texto]');
    if (ht) ht.textContent = HR.texto(D.abertura);
  }
  // publicou no painel em outra aba: o site atualiza sozinho
  addEventListener('storage', (ev) => { if (L && ev.key === L.CHAVE_PUB) location.reload(); });

  // ---------- preloader ----------
  const t0 = performance.now();
  const pronto = () => setTimeout(() => { body.classList.add('pronto'); body.classList.remove('carregando'); }, Math.max(0, (calmo ? 0 : 1900) - (performance.now() - t0)));
  if (document.readyState === 'complete') pronto(); else addEventListener('load', pronto);
  setTimeout(() => body.classList.add('pronto') || body.classList.remove('carregando'), 3800);

  // ---------- grupos com a mesma largura ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    g.style.removeProperty('--larg');
    const kids = [...g.children];
    kids.forEach((k) => { k.style.width = 'auto'; });
    const max = Math.max(...kids.map((k) => k.getBoundingClientRect().width));
    kids.forEach((k) => { k.style.width = ''; });
    if (!max) return; // grupo escondido: mede de novo quando aparecer
    g.style.setProperty('--larg', Math.ceil(max) + 'px');
  });
  iguala();
  document.fonts && document.fonts.ready.then(iguala);
  let tRes; addEventListener('resize', () => { clearTimeout(tRes); tRes = setTimeout(iguala, 150); });

  // ---------- topo ----------
  const topo = $('[data-topo]');
  const menu = $('#menu');
  const hamb = $('[data-hamb]');
  const volta = $('[data-volta]');
  const anel = $('.volta-anel');
  let ultimoY = scrollY;
  const aoRolar = () => {
    const y = scrollY;
    topo.classList.toggle('cheio', y > 40);
    topo.classList.toggle('some', y > 500 && y > ultimoY && !menu.classList.contains('on'));
    ultimoY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    volta.classList.toggle('ver', y > 700);
    anel.style.strokeDashoffset = 100 - (y / max) * 100;
    como();
  };
  addEventListener('scroll', aoRolar, { passive: true });
  volta.addEventListener('click', () => scrollTo({ top: 0, behavior: calmo ? 'auto' : 'smooth' }));
  const menuAbre = (on) => {
    menu.classList.toggle('on', on); topo.classList.toggle('menu-on', on);
    hamb.setAttribute('aria-expanded', on); body.classList.toggle('travado', on);
  };
  hamb.addEventListener('click', () => menuAbre(!menu.classList.contains('on')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => menuAbre(false)));
  const secoes = $$('main section[id]');
  const obsMenu = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) $$('a', menu).forEach((a) => a.classList.toggle('ativo', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secoes.forEach((s) => obsMenu.observe(s));

  // aberto ou fechado agora
  const status = $('[data-status]');
  const st = HR ? HR.status(D.abertura) : { aberto: true, txt: 'Aberto agora' };
  status.textContent = st.txt;
  status.classList.toggle('fechado', !st.aberto);

  // ---------- capa: garrafas sobre a água ----------
  const capa = $('[data-capa]');
  const vitrine = $('[data-vitrine]');
  if (fino && !calmo) capa.addEventListener('pointermove', (e) => {
    vitrine.style.setProperty('--px', (e.clientX / innerWidth - 0.5).toFixed(3));
    vitrine.style.setProperty('--py', (e.clientY / innerHeight - 0.5).toFixed(3));
  });
  // gotas suspensas no ar, como na foto de estúdio
  const gotas = $('[data-gotas]');
  if (!calmo) for (let i = 0; i < 34; i++) {
    const b = document.createElement('i');
    const s = 2 + Math.random() * Math.random() * 9;
    b.style.cssText = `left:${Math.random() * 100}%;top:${8 + Math.random() * 70}%;width:${s}px;height:${s}px;animation-duration:${6 + Math.random() * 8}s;animation-delay:${-Math.random() * 10}s`;
    gotas.appendChild(b);
  }
  // a capa afunda devagar ao rolar
  const capaRola = () => {
    const y = scrollY;
    if (y > innerHeight * 1.2) return;
    capa.style.setProperty('--rola', (y / innerHeight).toFixed(3));
  };
  if (!calmo) { addEventListener('scroll', capaRola, { passive: true }); capaRola(); }

  // ---------- categorias: índice ----------
  const inds = $$('.ind');
  inds.forEach((c) => c.addEventListener('click', () => {
    filtro.cat = c.dataset.filtro; filtro.marca = '';
    aplica(); irCatalogo();
  }));
  // no computador as garrafas da categoria seguem o mouse dentro da linha
  if (fino && !calmo) inds.forEach((c) => c.addEventListener('pointermove', (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
  }));

  // ---------- carrossel de mais pedidos ----------
  const trilho = $('[data-trilho]');
  const barra = $('[data-trilho-barra]');
  const passo = () => (trilho.querySelector('.card').getBoundingClientRect().width + 20) * (innerWidth > 680 ? 2 : 1);
  $('[data-trilho-ant]').addEventListener('click', () => trilho.scrollBy({ left: -passo(), behavior: 'smooth' }));
  $('[data-trilho-prox]').addEventListener('click', () => trilho.scrollBy({ left: passo(), behavior: 'smooth' }));
  const barraTrilho = () => {
    const max = trilho.scrollWidth - trilho.clientWidth;
    const fr = trilho.clientWidth / trilho.scrollWidth;
    barra.style.width = fr * 100 + '%';
    barra.style.transform = `translateX(${max ? (trilho.scrollLeft / max) * ((1 - fr) / fr) * 100 : 0}%)`;
  };
  trilho.addEventListener('scroll', barraTrilho, { passive: true });
  addEventListener('resize', barraTrilho); barraTrilho();
  let arr = null;
  trilho.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.target.closest('button')) return;
    arr = { x: e.clientX, s: trilho.scrollLeft, mov: false };
  });
  addEventListener('pointermove', (e) => {
    if (!arr) return;
    const dx = e.clientX - arr.x;
    if (Math.abs(dx) > 5) { arr.mov = true; trilho.classList.add('arrasta'); }
    trilho.scrollLeft = arr.s - dx;
  });
  addEventListener('pointerup', () => { if (arr) { trilho.classList.remove('arrasta'); arr = null; } });

  // ---------- catálogo ----------
  const grade = $('[data-grade]');
  const cards = $$('.card', grade);
  const ordemOriginal = [...cards];
  const filtro = { cat: 'tudo', marca: '', busca: '', ordem: '' };
  const normal = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const chips = $$('[data-chip]');
  const contagem = $('[data-contagem]');
  const fMarca = $('[data-filtro-marca]');
  // mostra 15 por vez; "Ver mais" libera mais 15 sem refazer a animação dos que já estavam na tela
  const LOTE = 15;
  let limite = LOTE;
  const verMais = $('[data-ver-mais]');
  const aplica = (maisUm = false) => {
    if (!maisUm) limite = LOTE;
    chips.forEach((c) => { const on = c.dataset.chip === filtro.cat; c.classList.toggle('on', on); c.setAttribute('aria-pressed', on); });
    fMarca.hidden = !filtro.marca;
    $('[data-marca-nome]').textContent = filtro.marca;
    const termo = normal(filtro.busca.trim());
    let lista = [...ordemOriginal];
    if (filtro.ordem === 'menor') lista.sort((a, b) => a.dataset.preco - b.dataset.preco);
    if (filtro.ordem === 'maior') lista.sort((a, b) => b.dataset.preco - a.dataset.preco);
    if (filtro.ordem === 'az') lista.sort((a, b) => a.dataset.busca.localeCompare(b.dataset.busca));
    let n = 0;
    const antes = maisUm ? limite - LOTE : 0;
    lista.forEach((c) => {
      const ok = (filtro.cat === 'tudo' || c.dataset.cat === filtro.cat) && (!filtro.marca || c.dataset.marca === filtro.marca) && (!termo || c.dataset.busca.includes(termo));
      c.hidden = !ok || n >= limite;
      grade.appendChild(c);
      if (ok && n < limite && n >= antes) { c.classList.remove('entra'); void c.offsetWidth; c.style.setProperty('--n', Math.min(n - antes, 12)); c.classList.add('entra'); }
      if (ok) n++;
    });
    verMais.parentElement.hidden = n <= limite;
    verMais.textContent = `Ver mais bebidas (${n - limite})`;
    contagem.textContent = n === 1 ? '1 bebida' : `${n} bebidas`;
    $('[data-vazio]').hidden = n > 0;
  };
  verMais.addEventListener('click', () => { limite += LOTE; aplica(true); });
  chips.forEach((c) => c.addEventListener('click', () => { filtro.cat = c.dataset.chip; aplica(); }));
  let tBusca;
  $('[data-busca]').addEventListener('input', (e) => { clearTimeout(tBusca); tBusca = setTimeout(() => { filtro.busca = e.target.value; aplica(); }, 140); });
  $('[data-ordem]').addEventListener('change', (e) => { filtro.ordem = e.target.value; aplica(); });
  $('[data-limpar-marca]').addEventListener('click', () => { filtro.marca = ''; aplica(); });
  const irCatalogo = () => $('#bebidas').scrollIntoView({ behavior: calmo ? 'auto' : 'smooth' });
  $$('[data-ir-cat]').forEach((b) => b.addEventListener('click', () => { filtro.cat = b.dataset.irCat; filtro.marca = ''; aplica(); irCatalogo(); }));
  $$('.marca[data-marca]').forEach((m) => m.addEventListener('click', () => {
    filtro.marca = m.dataset.marca; filtro.cat = 'tudo'; filtro.busca = ''; $('[data-busca]').value = '';
    aplica(); irCatalogo();
  }));
  aplica();

  // inclinação 3D das garrafas nos cards
  if (fino && !calmo) $$('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 26 + 'deg');
      el.style.setProperty('--rx', -((e.clientY - r.top) / r.height - 0.5) * 16 + 'deg');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });

  // ---------- carrinho ----------
  const cart = new Map(Object.entries(guarda.ler('tampinha-carrinho') || {}).filter(([id, q]) => D.produtos[id] && q > 0));
  let maior = guarda.ler('tampinha-18') === true;
  const carrinho = $('[data-carrinho]');
  const veu = $('[data-veu]');
  const lista = $('[data-lista]');
  const btnAvanca = $('[data-avancar]');
  const form = $('[data-form]');
  let etapa = 'itens';
  const subtotal = () => [...cart].reduce((s, [id, q]) => s + D.produtos[id].p * q, 0);
  const itens = () => [...cart.values()].reduce((s, q) => s + q, 0);
  const retirada = () => form.modo.value === 'retirada';
  const taxa = () => (retirada() || !cart.size || subtotal() >= D.entrega.gratisAcima ? 0 : D.entrega.taxa);
  const temAlcool = () => [...cart.keys()].some((id) => D.produtos[id].a);
  // copia a foto do produto (sem lazy, sem alt repetido) para o carrinho, o aviso e o voo
  const arteDe = (id) => { const s = document.querySelector(`img[data-arte="${id}"]`); return s ? s.outerHTML.replace(' loading="lazy"', '').replace(/ alt="[^"]*"/, ' alt=""') : ''; };

  const aviso = $('[data-aviso]');
  let tAviso;
  const avisa = (txt, id) => {
    aviso.innerHTML = (id ? arteDe(id).replace('<img ', '<img style="width:22px;height:34px;object-fit:contain" ') : '') + `<span>${txt}</span>`;
    aviso.classList.add('on');
    clearTimeout(tAviso); tAviso = setTimeout(() => aviso.classList.remove('on'), 2400);
  };

  const desenha = () => {
    const n = itens(), sub = subtotal(), tx = taxa();
    $$('[data-conta]').forEach((el) => { el.textContent = n; });
    $('[data-conta-txt]').textContent = n === 1 ? '1 item' : `${n} itens`;
    $('[data-total-barra]').textContent = real(sub + tx);
    body.classList.toggle('tem-itens', n > 0);
    $$('[data-compra]').forEach((c) => {
      const q = cart.get(c.dataset.compra) || 0;
      c.classList.toggle('tem', q > 0);
      c.querySelector('output').textContent = q;
    });
    $('[data-carr-sub]').textContent = n ? `${n} ${n === 1 ? 'item' : 'itens'} no carrinho` : 'Nenhum item ainda';
    // lista
    const ids = [...cart.keys()];
    $$('li', lista).forEach((li) => { if (!cart.has(li.dataset.id)) li.remove(); });
    ids.forEach((id) => {
      const p = D.produtos[id], q = cart.get(id);
      let li = lista.querySelector(`li[data-id="${id}"]`);
      if (!li) {
        li = document.createElement('li'); li.dataset.id = id;
        li.innerHTML = `${arteDe(id)}<div><b>${p.n}</b><small>${p.v}</small><strong></strong></div><div class="qtd" style="display:inline-flex"><button type="button" data-menos="${id}" aria-label="Tirar um">${$('[data-menos]').innerHTML}</button><output></output><button type="button" data-mais="${id}" aria-label="Pôr mais um">${$('[data-mais]').innerHTML}</button></div>`;
        lista.appendChild(li);
      }
      li.querySelector('output').textContent = q;
      li.querySelector('strong').textContent = real(p.p * q);
    });
    $('[data-carr-vazio]').hidden = n > 0;
    // frete
    const frete = $('[data-frete]');
    frete.hidden = !n || retirada();
    const falta = D.entrega.gratisAcima - sub;
    frete.classList.toggle('gratis', falta <= 0);
    $('[data-frete-txt]').innerHTML = falta <= 0 ? '<b>Entrega grátis liberada.</b> Gelada e sem taxa.' : `Faltam <b>${real(falta)}</b> para a entrega grátis.`;
    $('[data-frete-barra]').style.width = Math.min(100, (sub / D.entrega.gratisAcima) * 100) + '%';
    // resumo
    $('[data-subtotal]').textContent = real(sub);
    $('[data-taxa]').textContent = retirada() ? 'retirada' : tx ? real(tx) : n ? 'grátis' : real(0);
    $('[data-total]').textContent = real(sub + tx);
    btnAvanca.disabled = !n;
    $('[data-etapa="dados"]').disabled = !n;
    if (!n && etapa === 'dados') mostraEtapa('itens');
    $('[data-aviso-18]').hidden = !temAlcool();
    guarda.por('tampinha-carrinho', Object.fromEntries(cart));
  };

  // garrafa voando até o carrinho
  const alvo = () => { const b = $('.barra-carrinho button'); return b && b.offsetParent && body.classList.contains('tem-itens') ? b : $('.topo-carrinho'); };
  const voa = (id, origem) => {
    const dono = origem && origem.closest('.card, .garrafa, .extra, .kit, .reserva-palco');
    const svg = dono && dono.querySelector('.arte, .reserva-canvas');
    const destino = alvo();
    const pulso = () => { const t = $('.topo-carrinho'); t.classList.remove('pula'); void t.offsetWidth; t.classList.add('pula'); };
    if (calmo || !svg) return pulso();
    const a = svg.getBoundingClientRect(), b = destino.getBoundingClientRect();
    const v = document.createElement('div'); v.className = 'voo'; v.innerHTML = arteDe(id);
    body.appendChild(v);
    const x0 = a.left + a.width / 2 - 30, y0 = a.top + a.height / 2 - 60;
    const x1 = b.left + b.width / 2 - 30, y1 = b.top + b.height / 2 - 60;
    const cy = Math.min(y0, y1) - 160;
    const quadros = [];
    for (let k = 0; k <= 24; k++) {
      const t = k / 24, u = 1 - t;
      const x = u * u * x0 + 2 * u * t * ((x0 + x1) / 2) + t * t * x1;
      const y = u * u * y0 + 2 * u * t * cy + t * t * y1;
      quadros.push({ transform: `translate(${x}px, ${y}px) rotate(${t * 380}deg) scale(${1 - t * 0.75})`, opacity: t > 0.92 ? 0 : 1 });
    }
    v.animate(quadros, { duration: 850, easing: 'cubic-bezier(.45,.05,.55,.95)' }).onfinish = () => { v.remove(); pulso(); };
  };

  // confirmação de idade antes da primeira bebida alcoólica
  const idade = $('[data-idade]');
  let pendente = null;
  const pedeIdade = (acao) => { pendente = acao; idade.hidden = false; iguala(); $('[data-idade-sim]').focus(); };
  $('[data-idade-sim]').addEventListener('click', () => { maior = true; guarda.por('tampinha-18', true); idade.hidden = true; if (pendente) pendente(); pendente = null; });
  $('[data-idade-nao]').addEventListener('click', () => { idade.hidden = true; pendente = null; avisa('Tudo bem. As bebidas sem álcool continuam liberadas.'); });

  const add = (id, q = 1, origem = null, silencioso = false) => {
    const p = D.produtos[id];
    if (!p) return;
    if (p.a && !maior) return pedeIdade(() => add(id, q, origem, silencioso));
    cart.set(id, (cart.get(id) || 0) + q);
    desenha();
    voa(id, origem);
    if (!silencioso) avisa(`${p.n} no carrinho`, id);
  };
  const tira = (id) => {
    const q = (cart.get(id) || 0) - 1;
    if (q > 0) cart.set(id, q); else cart.delete(id);
    desenha();
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-add]');
    if (a) { a.classList.remove('gira'); void a.offsetWidth; a.classList.add('gira'); return add(a.dataset.add, 1, a); }
    const m = e.target.closest('[data-mais]');
    if (m) return add(m.dataset.mais, 1, m.closest('.carrinho') ? null : m, true);
    const t = e.target.closest('[data-menos]');
    if (t) return tira(t.dataset.menos);
    const k = e.target.closest('[data-kit]');
    if (k) {
      const kit = D.kits[k.dataset.kit];
      const faz = () => { kit.forEach(([id, q]) => cart.set(id, (cart.get(id) || 0) + q)); desenha(); voa(kit[0][0], k); avisa('Kit no carrinho. Dá para ajustar as quantidades.', kit[0][0]); };
      return kit.some(([id]) => D.produtos[id].a) && !maior ? pedeIdade(faz) : faz();
    }
    if (e.target.closest('[data-abrir-carrinho]')) return abre(true);
    if (e.target.closest('[data-fechar-carrinho]')) return abre(false);
  });

  let focoAntes = null;
  const abre = (on) => {
    if (on) { focoAntes = document.activeElement; veu.hidden = false; requestAnimationFrame(() => veu.classList.add('on')); }
    else { veu.classList.remove('on'); setTimeout(() => { veu.hidden = true; }, 400); }
    carrinho.classList.toggle('on', on);
    carrinho.toggleAttribute('inert', !on);
    carrinho.setAttribute('aria-hidden', !on);
    body.classList.toggle('travado', on);
    if (on) setTimeout(() => $('.fechar', carrinho).focus(), 300); else if (focoAntes) focoAntes.focus({ preventScroll: true });
  };
  veu.addEventListener('click', () => abre(false));
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!idade.hidden) { idade.hidden = true; pendente = null; } else if (carrinho.classList.contains('on')) abre(false); else if (menu.classList.contains('on')) menuAbre(false);
  });

  const mostraEtapa = (q) => {
    etapa = q;
    $$('[data-etapa]').forEach((b) => b.classList.toggle('on', b.dataset.etapa === q));
    $$('[data-pane]').forEach((p) => p.classList.toggle('on', p.dataset.pane === q));
    btnAvanca.innerHTML = q === 'itens' ? 'Continuar' : `${$('.flutua-wa').innerHTML}Enviar pedido no WhatsApp`;
    $('.carr-corpo').scrollTop = 0;
    if (q === 'dados') setTimeout(() => iguala(), 30);
  };
  $$('[data-etapa]').forEach((b) => b.addEventListener('click', () => !b.disabled && mostraEtapa(b.dataset.etapa)));
  form.addEventListener('change', (e) => {
    if (e.target.name === 'modo') {
      $('[data-so-entrega]').hidden = retirada();
      $('[data-pag-legenda]').textContent = retirada() ? 'Pagamento na retirada' : 'Pagamento na entrega';
      desenha();
    }
    if (e.target.name === 'pag') $('[data-troco]').hidden = form.pag.value !== 'Dinheiro';
  });
  form.addEventListener('input', (e) => e.target.closest('.campo') && e.target.closest('.campo').classList.remove('invalido'));
  form.addEventListener('submit', (e) => e.preventDefault());

  // monta a mensagem já separada por categoria (a triagem do pedido)
  const mensagem = () => {
    const f = form;
    const grupos = {};
    cart.forEach((q, id) => { const p = D.produtos[id]; (grupos[p.c] = grupos[p.c] || []).push(`${q}x ${p.n} ${p.v}  ${real(p.p * q)}`); });
    const ordem = [...Object.keys(D.cats)];
    const linhas = [`*Pedido pelo site | ${D.nome}*`, '', `*Nome:* ${f.nome.value.trim()}`];
    if (retirada()) linhas.push('*Recebimento:* retirada no balcão');
    else {
      const bairro = f.bairro.value === 'outro' ? 'outro bairro (confirmar taxa)' : f.bairro.value;
      linhas.push('*Recebimento:* entrega', `*Endereço:* ${f.endereco.value.trim()}, ${bairro}${f.compl.value.trim() ? ` (${f.compl.value.trim()})` : ''}`);
    }
    linhas.push('');
    ordem.filter((c) => grupos[c]).forEach((c) => { linhas.push(`*${D.cats[c]}*`, ...grupos[c], ''); });
    const sub = subtotal(), tx = taxa();
    linhas.push(`Subtotal: ${real(sub)}`, `Entrega: ${retirada() ? 'retirada' : tx ? real(tx) : 'grátis'}`, `*Total: ${real(sub + tx)}*`, '');
    let pag = `*Pagamento:* ${f.pag.value}`;
    if (f.pag.value === 'Dinheiro' && f.troco.value.trim()) pag += ` (troco para R$ ${f.troco.value.trim()})`;
    linhas.push(pag);
    if (f.obs.value.trim()) linhas.push(`*Observação:* ${f.obs.value.trim()}`);
    if (temAlcool()) linhas.push('', 'Confirmo ter 18 anos ou mais.');
    return linhas.join('\n');
  };
  const erro = $('[data-erro]');
  btnAvanca.addEventListener('click', () => {
    if (etapa === 'itens') return mostraEtapa('dados');
    erro.textContent = '';
    const falta = [];
    if (!form.nome.value.trim()) falta.push(form.nome);
    if (!retirada() && !form.endereco.value.trim()) falta.push(form.endereco);
    if (falta.length) {
      falta.forEach((i) => { const c = i.closest('.campo'); c.classList.remove('invalido'); void c.offsetWidth; c.classList.add('invalido'); });
      erro.textContent = falta.length > 1 ? 'Preencha seu nome e o endereço de entrega.' : falta[0] === form.nome ? 'Preencha seu nome.' : 'Preencha o endereço de entrega.';
      return falta[0].focus();
    }
    const troco = parseFloat(form.troco.value.replace(',', '.'));
    if (form.pag.value === 'Dinheiro' && troco && troco < subtotal() + taxa()) {
      erro.textContent = `O troco precisa ser maior que o total de ${real(subtotal() + taxa())}.`;
      return form.troco.focus();
    }
    window.open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(mensagem())}`, '_blank', 'noopener');
    avisa('Pedido montado. Agora é só enviar no WhatsApp.');
  });
  desenha();

  // ---------- como pedir: a linha dourada desce com a rolagem e acende os passos ----------
  const comoEl = $('[data-como]');
  const passosEl = $$('.passo');
  function como() {
    if (!comoEl) return;
    const r = comoEl.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height));
    comoEl.style.setProperty('--p', p.toFixed(3));
    passosEl.forEach((s) => s.classList.toggle('feito', p * r.height >= s.offsetTop + 10));
  }
  como();

  // ---------- FAQ: abre suave, uma por vez ----------
  $$('.faq-item').forEach((d) => {
    const s = $('summary', d), r = $('.faq-r', d);
    s.addEventListener('click', (e) => {
      e.preventDefault();
      if (d.open) {
        if (calmo) { d.open = false; return; }
        r.animate([{ height: r.offsetHeight + 'px' }, { height: '0px' }], { duration: 380, easing: 'cubic-bezier(.22,.8,.24,1)' }).onfinish = () => { d.open = false; };
      } else {
        $$('.faq-item[open]').forEach((o) => o !== d && $('summary', o).click());
        d.open = true;
        if (!calmo) r.animate([{ height: '0px', opacity: 0 }, { height: r.offsetHeight + 'px', opacity: 1 }], { duration: 450, easing: 'cubic-bezier(.22,.8,.24,1)' });
      }
    });
  });

  // ---------- revelar ao rolar ----------
  const revs = $$('.sec-cab, .mom, .indice li, .kit, .entrega-txt, .entrega-lado, .faq, .map-box, .onde, .rodape-col, .msg-bolha, .como-foto');
  const obs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('ver'); obs.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  revs.forEach((el) => { if (!el.classList.contains('msg-bolha')) el.classList.add('rev'); obs.observe(el); });

  // paralaxe das faixas de foto: a imagem anda mais devagar que a página
  const paralaxes = $$('[data-paralaxe], [data-paralaxe-in]');
  if (!calmo && paralaxes.length) {
    const move = () => paralaxes.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const f = el.hasAttribute('data-paralaxe') ? -0.18 : -0.08;
      el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - innerHeight / 2) * f).toFixed(1)}px, 0)`;
    });
    addEventListener('scroll', move, { passive: true }); move();
  }

  aoRolar();
})();

/* ---------- tema claro ou escuro: tampinha que rola entre o sol e a lua ---------- */
(() => {
  const raiz = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const calmo = matchMedia('(prefers-reduced-motion: reduce)');
  let fim;
  const marca = () => {
    document.querySelectorAll('[data-tema-ir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaIr === raiz.dataset.tema)));
    if (meta) meta.content = raiz.dataset.tema === 'claro' ? '#F6F1E7' : '#0B0A09';
  };
  // bolhas de gás saindo da tampinha quando ela para
  const gas = (pilula) => {
    const caixa = pilula.querySelector('.tt-gas');
    if (!caixa || calmo.matches) return;
    for (let i = 0; i < 11; i++) {
      const b = document.createElement('i');
      b.style.setProperty('--sx', (Math.random() * 30 - 15).toFixed(1) + 'px');
      b.style.setProperty('--dx', (Math.random() * 26 - 13).toFixed(1) + 'px');
      b.style.setProperty('--sz', (4 + Math.random() * 7).toFixed(1) + 'px');
      b.style.setProperty('--sobe', (44 + Math.random() * 46).toFixed(0) + 'px');
      b.style.animationDelay = (420 + Math.random() * 260).toFixed(0) + 'ms';
      caixa.appendChild(b);
      setTimeout(() => b.remove(), 2000);
    }
  };
  const aplica = (tema) => {
    raiz.dataset.tema = tema;
    try { localStorage.setItem('tampinha-gold-tema', tema); } catch (err) { /* sem armazenamento, vale só nesta visita */ }
    marca();
    document.dispatchEvent(new CustomEvent('tema', { detail: { tema } }));
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tema-ir]');
    if (!b || b.dataset.temaIr === raiz.dataset.tema) return;
    const pilula = b.closest('.tema-tampa');
    // a tampinha rola na hora; tema-anim liga o pulinho e a passagem suave das cores
    raiz.classList.add('tema-anim');
    clearTimeout(fim);
    fim = setTimeout(() => raiz.classList.remove('tema-anim'), 900);
    if (pilula) gas(pilula);
    const tema = b.dataset.temaIr;
    if (!document.startViewTransition || calmo.matches) { aplica(tema); return; }
    // a página nova se espalha em círculo a partir da tampinha, como bebida derramando
    const r = (pilula || b).getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    raiz.classList.add('tema-vt');
    const vt = document.startViewTransition(() => aplica(tema));
    vt.ready.then(() => {
      raiz.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + raio + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 900, easing: 'cubic-bezier(.6, 0, .25, 1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => {});
    vt.finished.finally(() => raiz.classList.remove('tema-vt'));
  });
  marca();
})();
