// Tampinha Bebidas, modelo Silver: interação da página e carrinho que monta o pedido para o WhatsApp.
(() => {
  const D = /*DADOS*/;
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

  // ---------- preloader ----------
  const t0 = performance.now();
  const pronto = () => setTimeout(() => { body.classList.add('pronto'); body.classList.remove('carregando'); }, Math.max(0, (calmo ? 0 : 2250) - (performance.now() - t0)));
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
  const agora = new Date();
  const h = agora.getHours() + agora.getMinutes() / 60;
  const hoje = D.abertura[agora.getDay()], ontem = D.abertura[(agora.getDay() + 6) % 7];
  const aberto = (h >= hoje[0] && h < hoje[1]) || (ontem[1] > 24 && h < ontem[1] - 24);
  status.textContent = aberto ? 'Aberto agora' : 'Fechado agora';
  status.classList.toggle('fechado', !aberto);

  // ---------- capa: palco com as bebidas ----------
  const capa = $('[data-capa]');
  const palco = $('[data-palco]');
  const cenas = $$('[data-cena]');
  const slides = $$('[data-slide]');
  const minis = $$('[data-ir]');
  const nome = $('[data-capa-nome]');
  let atual = 0;
  const ir = (i) => {
    i = (i + cenas.length) % cenas.length;
    if (i === atual) return;
    const ant = cenas[atual];
    ant.classList.remove('on'); ant.classList.add('sai'); ant.setAttribute('aria-hidden', 'true');
    setTimeout(() => ant.classList.remove('sai'), 700);
    cenas[i].classList.add('on'); cenas[i].setAttribute('aria-hidden', 'false');
    slides.forEach((s, k) => s.classList.toggle('on', k === i));
    minis.forEach((m, k) => m.classList.toggle('on', k === i));
    $$('[data-fundo]').forEach((f) => f.classList.toggle('on', +f.dataset.fundo === i));
    capa.style.setProperty('--tom', D.capa[i].tom);
    capa.style.setProperty('--luz', D.capa[i].luz);
    nome.classList.add('troca');
    setTimeout(() => { nome.textContent = D.capa[i].nome; nome.classList.remove('troca'); }, 450);
    atual = i;
  };
  minis.forEach((m) => {
    m.addEventListener('click', () => ir(+m.dataset.ir));
    // a barrinha de progresso da miniatura ativa é o relógio da troca automática
    if (!calmo) m.querySelector('i').addEventListener('animationend', () => { if (m.classList.contains('on')) ir(atual + 1); });
  });
  $('[data-capa-ant]').addEventListener('click', () => ir(atual - 1));
  $('[data-capa-prox]').addEventListener('click', () => ir(atual + 1));
  if (fino && !calmo) palco.addEventListener('pointermove', (e) => {
    const r = palco.getBoundingClientRect();
    palco.style.setProperty('--px', (((e.clientX - r.left) / r.width) - 0.5).toFixed(3));
    palco.style.setProperty('--py', (((e.clientY - r.top) / r.height) - 0.5).toFixed(3));
  });
  palco.addEventListener('pointerleave', () => { palco.style.setProperty('--px', 0); palco.style.setProperty('--py', 0); });
  let toqueX = null;
  palco.addEventListener('touchstart', (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
  palco.addEventListener('touchend', (e) => {
    if (toqueX === null) return;
    const dx = e.changedTouches[0].clientX - toqueX;
    if (Math.abs(dx) > 50) ir(atual + (dx < 0 ? 1 : -1));
    toqueX = null;
  });
  // pausa a troca automática quando a capa sai da tela
  new IntersectionObserver(([e]) => capa.classList.toggle('pausa', !e.isIntersecting)).observe(capa);

  // bolhas subindo no fundo
  const bolhas = $('[data-bolhas]');
  if (!calmo) for (let i = 0; i < 26; i++) {
    const b = document.createElement('i');
    const s = 4 + Math.random() * 14;
    b.style.cssText = `left:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-duration:${9 + Math.random() * 12}s;animation-delay:${-Math.random() * 20}s`;
    bolhas.appendChild(b);
  }

  // ---------- categorias ----------
  const cats = $$('.cat');
  const abreCat = (c) => cats.forEach((x) => x.classList.toggle('on', x === c));
  cats.forEach((c) => {
    c.addEventListener('mouseenter', () => fino && abreCat(c));
    c.addEventListener('focus', () => abreCat(c));
    c.addEventListener('click', () => {
      if (!fino && !c.classList.contains('on')) return abreCat(c);
      filtro.cat = c.dataset.filtro; filtro.marca = '';
      aplica(); irCatalogo();
    });
  });

  // ---------- carrossel de mais pedidos ----------
  const trilho = $('[data-trilho]');
  const barra = $('[data-trilho-barra]');
  const passo = () => (trilho.querySelector('.card').getBoundingClientRect().width + 18) * (innerWidth > 680 ? 2 : 1);
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
    $('[data-carr-sub]').textContent = n ? `${n} ${n === 1 ? 'item' : 'itens'} no engradado` : 'Nenhum item ainda';
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
    const svg = origem && (origem.closest('.card, .cena, .extra, .kit') || {}).querySelector && origem.closest('.card, .cena, .extra, .kit').querySelector('.arte');
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
    btnAvanca.innerHTML = q === 'itens' ? 'Continuar' : `${$('.topo-wa svg') ? $('.topo-wa').innerHTML : ''}Enviar pedido no WhatsApp`;
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

  // ---------- como pedir: linha que se completa com a rolagem ----------
  const comoEl = $('[data-como]');
  const caminho = $('.como-cheio');
  const tampa = $('.como-tampa');
  const passosEl = $$('.passo');
  function como() {
    if (!comoEl || innerWidth <= 900) return;
    const r = comoEl.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.2)));
    comoEl.style.setProperty('--p', p.toFixed(3));
    const svg = caminho.ownerSVGElement.getBoundingClientRect();
    const pt = caminho.getPointAtLength(p * caminho.getTotalLength());
    tampa.style.transform = `translate(${(pt.x / 1000) * svg.width}px, ${(pt.y / 120) * svg.height}px) rotate(${p * 720}deg)`;
    passosEl.forEach((s, i) => s.classList.toggle('feito', p >= (i / (passosEl.length - 1)) * 0.92 + 0.02));
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
  const revs = $$('.sec-cab, .cats-lista, .kit, .entrega-txt, .entrega-lado, .bairros-faixa, .faq, .map-box, .onde, .rodape-col, .msg-bolha');
  const obs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('ver'); obs.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  revs.forEach((el) => { if (!el.classList.contains('msg-bolha')) el.classList.add('rev'); obs.observe(el); });

  // paralaxe das faixas de foto: a imagem anda mais devagar que a página
  const paralaxes = $$('[data-paralaxe]');
  if (!calmo && paralaxes.length) {
    const move = () => paralaxes.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - innerHeight / 2) * -0.18).toFixed(1)}px, 0)`;
    });
    addEventListener('scroll', move, { passive: true }); move();
  }

  aoRolar();
})();
