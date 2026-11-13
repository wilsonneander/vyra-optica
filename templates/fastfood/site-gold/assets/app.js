/* Monta Burger: interações da página principal */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const C = window.Cardapio;
  const M = C.base.marca;
  const esc = C.esc;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ICO = {
    mais: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>',
    menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M8 6v12l10-6z" fill="currentColor"/></svg>',
    pausa: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg>',
  };

  /* ---------- botões do mesmo grupo com a mesma largura ---------- */
  const igualar = () => {
    $$('[data-iguais]').forEach((g) => {
      if (!g.offsetParent && getComputedStyle(g).position !== 'fixed') return;
      g.style.removeProperty('--larg');
      const maior = Math.max(...[...g.children].filter((c) => !c.classList.contains('marcador')).map((c) => c.offsetWidth));
      if (maior > 0) g.style.setProperty('--larg', maior + 'px');
    });
  };
  window.addEventListener('resize', () => { clearTimeout(igualar.t); igualar.t = setTimeout(igualar, 120); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(igualar);
  window.addEventListener('load', igualar);

  /* ---------- aviso ---------- */
  const aviso = $('[data-aviso]');
  const avisar = (t) => { aviso.textContent = t; aviso.classList.add('on'); clearTimeout(avisar.t); avisar.t = setTimeout(() => aviso.classList.remove('on'), 2600); };

  /* ---------- topo e menu ---------- */
  const topo = $('[data-topo]');
  const nav = $('[data-nav]');
  const btnMenu = $('[data-menu]');
  const fecharMenu = () => { nav.classList.remove('aberto'); btnMenu.setAttribute('aria-expanded', 'false'); };
  btnMenu.addEventListener('click', () => {
    const abre = !nav.classList.contains('aberto');
    nav.classList.toggle('aberto', abre); btnMenu.setAttribute('aria-expanded', String(abre));
  });
  $$('a', nav).forEach((a) => a.addEventListener('click', fecharMenu));
  document.addEventListener('click', (e) => { if (!nav.contains(e.target) && !btnMenu.contains(e.target)) fecharMenu(); });

  /* ---------- aberto agora ---------- */
  const st = C.status();
  $$('[data-status]').forEach((el) => {
    el.classList.toggle('aberto', st.aberto);
    const t = $('[data-status-txt]', el); if (t) t.textContent = st.txt; else el.textContent = st.txt;
  });

  /* ---------- capa: o hambúrguer se monta com a rolagem ---------- */
  const capa = $('[data-capa]');
  const palco = $('[data-palco]');
  const pilha = $('[data-pilha]');
  const cams = $$('.cam', pilha);
  const montado = $('[data-montado]');
  const rotulos = $$('[data-rot]', pilha);
  const sombra = $('[data-sombra]');
  const dica = $('[data-dica]');
  const dicaTxt = $('[data-dica-txt]');
  const Y0 = 60, AH = 600;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lim = (v) => Math.max(0, Math.min(1, v));
  let pAnt = -1;

  const montar = () => {
    const total = capa.offsetHeight - innerHeight;
    const p = total > 0 ? lim(-capa.getBoundingClientRect().top / (total * 0.82)) : 1;
    if (Math.abs(p - pAnt) < 0.0005) return;
    pAnt = p;
    const H = pilha.clientHeight, u = H / AH;
    palco.style.setProperty('--p', p.toFixed(3));
    pilha.classList.toggle('ocioso', p < 0.005);
    const pos = {};
    cams.forEach((img) => {
      const ordem = +img.dataset.ordem, de = +img.dataset.de, para = +img.dataset.para, alt = +img.dataset.alt;
      const atraso = (cams.length - 1 - ordem) * 0.045; // as de baixo chegam primeiro
      const q = ease(lim((p - atraso) / 0.6));
      const dy = (para - de) * u * q;
      const giro = Math.sin(q * Math.PI) * (ordem % 2 ? 2.5 : -2.5);
      img.style.transform = `translate3d(0, ${dy.toFixed(1)}px, 0) rotate(${giro.toFixed(2)}deg)`;
      pos[img.dataset.cam] = { y: ((de - Y0) + alt / 2) * u + dy, q };
    });
    // fim: a pilha dá lugar à foto do lanche montado (troca curta, com um pulinho)
    const m = lim((p - 0.88) / 0.06);
    montado.style.opacity = lim(m * 1.4).toFixed(3);
    montado.style.transform = `scale(${(0.94 + 0.06 * ease(m) + Math.sin(m * Math.PI) * 0.03).toFixed(3)})`;
    cams.forEach((img) => { img.style.opacity = (1 - lim((m - 0.25) * 1.6)).toFixed(3); });
    // a sombra sobe junto com o pão de baixo
    sombra.style.transform = `translate3d(0, ${(-0.17 * H * ease(lim(p / 0.8))).toFixed(1)}px, 0) scaleX(${(0.62 + p * 0.5).toFixed(3)})`;
    rotulos.forEach((li) => {
      const ps = pos[li.dataset.rot]; if (!ps) return;
      li.style.transform = `translate3d(0, ${(ps.y - li.offsetHeight / 2).toFixed(1)}px, 0)`;
      li.style.opacity = (1 - lim(ps.q * 1.7)).toFixed(3);
    });
    const pronto = p > 0.96;
    if (dica.classList.contains('pronto') !== pronto) {
      dica.classList.toggle('pronto', pronto);
      dicaTxt.textContent = pronto ? 'Pronto, montado. Agora é só pedir o seu' : 'Role a página e veja o burger se montar';
    }
  };
  if (!reduz) {
    let pedido = false;
    const agendar = () => { if (!pedido) { pedido = true; requestAnimationFrame(() => { pedido = false; montar(); }); } };
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', () => { pAnt = -1; agendar(); });
    $$('img', pilha).forEach((i) => i.complete || i.addEventListener('load', () => { pAnt = -1; agendar(); }));
    montar();
  }

  let rolou = false;
  const aoRolar = () => {
    const r = scrollY > 30;
    if (r !== rolou) { rolou = r; topo.classList.toggle('rolou', r); }
  };
  window.addEventListener('scroll', aoRolar, { passive: true }); aoRolar();

  /* ---------- vídeo da chapa: toca quando aparece ---------- */
  const video = $('[data-video]');
  const vBtn = $('[data-video-btn]');
  let pausadoPeloUsuario = false;
  const marcarBtn = () => {
    const tocando = !video.paused;
    vBtn.innerHTML = tocando ? ICO.pausa : ICO.play;
    vBtn.setAttribute('aria-label', tocando ? 'Pausar vídeo' : 'Tocar vídeo');
  };
  const economia = navigator.connection && navigator.connection.saveData;
  if (reduz || economia) { marcarBtn(); }
  else if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !pausadoPeloUsuario) { video.preload = 'auto'; video.play().catch(() => {}); }
      else if (!e.isIntersecting) video.pause();
    }), { threshold: 0.35 }).observe(video);
  }
  video.addEventListener('play', marcarBtn); video.addEventListener('pause', marcarBtn);
  vBtn.addEventListener('click', () => {
    if (video.paused) { pausadoPeloUsuario = false; video.play().catch(() => {}); }
    else { pausadoPeloUsuario = true; video.pause(); }
  });

  /* ---------- cardápio ---------- */
  let dados = C.publicado();
  const abas = $('[data-abas]');
  const grade = $('[data-grade]');
  const vazio = $('[data-vazio]');
  const busca = $('[data-busca]');
  let catAtual = null;
  const preco = (p) => (p.promo && p.promo < p.preco ? p.promo : p.preco);
  const seloOff = (p) => (p.promo && p.promo < p.preco ? `<span class="selo">-${Math.round((1 - p.promo / p.preco) * 100)}%</span>` : '');
  const precoHtml = (p) => (p.promo && p.promo < p.preco ? `<s>${C.real(p.preco)}</s><b>${C.real(p.promo)}</b>` : `<b>${C.real(p.preco)}</b>`);
  const porId = (id) => dados.produtos.find((p) => p.id === id);

  const cartao = (p, i) => `<article class="prato" style="--i:${i}">
      <div class="prato-foto"><img src="${esc(C.foto(p))}" alt="${esc(p.nome)}" width="400" height="400" loading="lazy">${seloOff(p)}</div>
      <h3>${esc(p.nome)}</h3>
      <p>${esc(p.desc || '')}</p>
      <div class="prato-pe"><span class="preco">${precoHtml(p)}</span><button class="add" type="button" data-add="${esc(p.id)}" aria-label="Pôr ${esc(p.nome)} na sacola">${ICO.mais}</button></div>
    </article>`;

  // marcador vermelho que desliza até a aba escolhida
  const moverMarcador = (instantaneo) => {
    const m = $('.marcador', abas); if (!m) return;
    const b = $('[aria-selected="true"]', abas);
    if (!b) { m.style.opacity = '0'; return; }
    if (instantaneo) m.style.transition = 'none';
    Object.assign(m.style, { opacity: '1', width: b.offsetWidth + 'px', height: b.offsetHeight + 'px', transform: `translate(${b.offsetLeft}px, ${b.offsetTop}px)` });
    if (instantaneo) { void m.offsetWidth; m.style.transition = ''; }
  };
  const desenharAbas = () => {
    const vis = C.visiveis(dados);
    const cats = dados.categorias.filter((c) => vis.some((p) => p.cat === c.id));
    if (!cats.some((c) => c.id === catAtual)) catAtual = cats[0] ? cats[0].id : null;
    const termo = busca.value.trim();
    abas.innerHTML = '<span class="marcador" aria-hidden="true"></span>' + cats.map((c) => {
      const n = vis.filter((p) => p.cat === c.id).length;
      return `<button type="button" role="tab" aria-selected="${!termo && c.id === catAtual}" data-cat="${esc(c.id)}">${esc(c.nome)}<small>${n}</small></button>`;
    }).join('');
    igualar();
    moverMarcador(true);
  };
  let trocaT = 0;
  const desenharGrade = (animar) => {
    const vis = C.visiveis(dados);
    const termo = C.semAcento(busca.value.trim());
    const lista = termo
      ? vis.filter((p) => C.semAcento(`${p.nome} ${p.desc || ''}`).includes(termo))
      : vis.filter((p) => p.cat === catAtual);
    const pinta = () => {
      grade.innerHTML = lista.map(cartao).join('');
      vazio.hidden = lista.length > 0;
      grade.classList.remove('saindo');
    };
    clearTimeout(trocaT);
    if (animar && !reduz) { grade.classList.add('saindo'); trocaT = setTimeout(pinta, 230); } else pinta();
  };
  const desenharCardapio = () => { desenharAbas(); desenharGrade(false); };
  window.addEventListener('resize', () => moverMarcador(true));
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(() => moverMarcador(true), 60));
  abas.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]'); if (!b || (b.getAttribute('aria-selected') === 'true')) return;
    catAtual = b.dataset.cat; busca.value = '';
    $$('[data-cat]', abas).forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    moverMarcador();
    desenharGrade(true);
  });
  abas.addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const bs = $$('button', abas); const i = bs.indexOf(document.activeElement); if (i < 0) return;
    const prox = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length];
    prox.focus(); prox.click();
  });
  busca.addEventListener('input', () => {
    const termo = busca.value.trim();
    $$('[data-cat]', abas).forEach((x) => x.setAttribute('aria-selected', String(!termo && x.dataset.cat === catAtual)));
    moverMarcador();
    clearTimeout(busca.t); busca.t = setTimeout(() => desenharGrade(true), 140);
  });

  /* ---------- os mais pedidos ---------- */
  const destBox = $('[data-destaques]');
  const desenharDestaques = () => {
    const ds = C.visiveis(dados).filter((p) => p.destaque).slice(0, 4);
    $('#mais-pedidos').hidden = !ds.length;
    destBox.innerHTML = ds.map((p, i) => `<article class="dest${i ? '' : ' grande'}">
        <img src="${esc(C.foto(p))}" alt="${esc(p.nome)}" width="600" height="500" loading="lazy">${seloOff(p)}
        <div class="dest-txt"><h3>${esc(p.nome)}</h3><p>${esc(p.desc || '')}</p>
          <div class="dest-pe"><span class="preco">${precoHtml(p)}</span><button class="add" type="button" data-add="${esc(p.id)}" aria-label="Pôr ${esc(p.nome)} na sacola">${ICO.mais}</button></div>
        </div>
      </article>`).join('');
  };

  /* ---------- sacola ---------- */
  const CHAVE_SACOLA = 'monta-sacola';
  let sacola = [];
  try { sacola = JSON.parse(localStorage.getItem(CHAVE_SACOLA)) || []; } catch (e) { sacola = []; }
  const guardar = () => { try { localStorage.setItem(CHAVE_SACOLA, JSON.stringify(sacola)); } catch (e) { /* sem armazenamento */ } };
  const sacolaBox = $('[data-sacola]');
  const itensBox = $('[data-sacola-itens]');
  const form = $('[data-sacola-form]');
  const qtdTopo = $('[data-sacola-qtd]');
  const btnSacola = $('.btn-sacola');
  const totais = () => {
    const sub = sacola.reduce((s, it) => { const p = porId(it.id); return s + (p ? preco(p) * it.qtd : 0); }, 0);
    const desc = Math.round(sub * 10) / 100;
    return { sub, desc, total: sub - desc };
  };
  const desenharSacola = () => {
    sacola = sacola.filter((it) => { const p = porId(it.id); return p && !p.oculto && it.qtd > 0; });
    const n = sacola.reduce((s, it) => s + it.qtd, 0);
    qtdTopo.hidden = !n; qtdTopo.textContent = n;
    itensBox.innerHTML = sacola.map((it) => {
      const p = porId(it.id);
      return `<li class="item"><img src="${esc(C.foto(p))}" alt="" width="64" height="64"><div><b>${esc(p.nome)}</b><span>${C.real(preco(p) * it.qtd)}</span></div>
        <div class="qtd-ctl"><button type="button" data-qtd="-1" data-id="${esc(p.id)}" aria-label="Tirar um ${esc(p.nome)}">${ICO.menos}</button><output>${it.qtd}</output><button type="button" data-qtd="1" data-id="${esc(p.id)}" aria-label="Mais um ${esc(p.nome)}">${ICO.mais}</button></div></li>`;
    }).join('');
    $('[data-sacola-vazia]').hidden = n > 0;
    form.hidden = !n;
    const t = totais();
    $('[data-sacola-sub]').textContent = C.real(t.sub);
    $('[data-sacola-desc]').textContent = '- ' + C.real(t.desc);
    $('[data-sacola-total]').textContent = C.real(t.total);
    guardar();
  };
  const voar = (img) => {
    if (!img || reduz) return;
    const a = img.getBoundingClientRect(), b = btnSacola.getBoundingClientRect();
    const v = img.cloneNode(); v.className = 'voa'; v.removeAttribute('loading');
    const lado = Math.min(a.width, 120);
    Object.assign(v.style, { left: a.left + a.width / 2 - lado / 2 + 'px', top: a.top + a.height / 2 - lado / 2 + 'px', width: lado + 'px', height: lado + 'px' });
    document.body.appendChild(v);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      v.style.transform = `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(.18)`;
      v.style.opacity = '.4';
    }));
    setTimeout(() => { v.remove(); btnSacola.classList.remove('pula'); void btnSacola.offsetWidth; btnSacola.classList.add('pula'); }, 720);
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    const p = porId(b.dataset.add); if (!p) return;
    const it = sacola.find((x) => x.id === p.id);
    if (it) it.qtd++; else sacola.push({ id: p.id, qtd: 1 });
    desenharSacola();
    voar(b.closest('article') && $('img', b.closest('article')));
    avisar(`${p.nome} na sacola`);
  });
  itensBox.addEventListener('click', (e) => {
    const b = e.target.closest('[data-qtd]'); if (!b) return;
    const it = sacola.find((x) => x.id === b.dataset.id); if (!it) return;
    it.qtd += +b.dataset.qtd; desenharSacola();
  });
  let focoAntes = null;
  const abrirSacola = () => {
    focoAntes = document.activeElement; sacolaBox.hidden = false; document.body.style.overflow = 'hidden';
    desenharSacola(); igualar(); setTimeout(() => $('.fechar', sacolaBox).focus(), 50);
  };
  const fecharSacola = () => { sacolaBox.hidden = true; document.body.style.overflow = ''; if (focoAntes) focoAntes.focus(); };
  $$('[data-abrir-sacola]').forEach((b) => b.addEventListener('click', abrirSacola));
  $$('[data-fechar-sacola]').forEach((b) => b.addEventListener('click', fecharSacola));
  document.addEventListener('keydown', (e) => {
    if (sacolaBox.hidden) return;
    if (e.key === 'Escape') fecharSacola();
    if (e.key === 'Tab') {
      const f = $$('button, input, select, a[href]', sacolaBox).filter((x) => x.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  const campoEnd = $('[data-campo-end]');
  form.addEventListener('change', () => {
    const entrega = form.tipo.value === 'entrega';
    campoEnd.hidden = !entrega; form.endereco.required = entrega;
  });
  form.endereco.required = true;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!sacola.length) return;
    const t = totais();
    const linhas = sacola.map((it) => { const p = porId(it.id); return `${it.qtd}x ${p.nome} (${C.real(preco(p) * it.qtd)})`; });
    const entrega = form.tipo.value === 'entrega';
    const msg = [`Olá, ${M.nome}! Quero fazer um pedido pelo site:`, '', ...linhas, '',
      `Subtotal: ${C.real(t.sub)}`, `Desconto do site (10%): - ${C.real(t.desc)}`, `Total: ${C.real(t.total)}`, '',
      `Nome: ${form.nome.value.trim()}`,
      entrega ? `Entrega em: ${form.endereco.value.trim()}` : 'Vou retirar no balcão',
      `Pagamento: ${form.pag.value}`].join('\n');
    window.open(`https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });

  /* ---------- depoimentos em carrossel: setas, arrastar, barra de progresso e passagem automática ---------- */
  const car = $('[data-carrossel]');
  const barra = $('[data-car-barra]');
  const setas = $$('[data-car]');
  const passo = () => { const v = $('.voz', car); return v ? v.offsetWidth + parseFloat(getComputedStyle(car).columnGap || 22) : 300; };
  const atualizarCar = () => {
    const max = car.scrollWidth - car.clientWidth;
    const fr = max > 0 ? car.scrollLeft / max : 0;
    const vis = car.clientWidth / car.scrollWidth;
    barra.style.width = (vis * 100).toFixed(1) + '%';
    barra.style.transform = `translateX(${(fr * (1 / vis - 1) * 100).toFixed(1)}%)`;
    setas[0].disabled = car.scrollLeft < 4; setas[1].disabled = car.scrollLeft > max - 4;
  };
  const andar = (d) => {
    const max = car.scrollWidth - car.clientWidth;
    if (d > 0 && car.scrollLeft > max - 4) car.scrollTo({ left: 0 }); else car.scrollBy({ left: d * passo() });
  };
  setas.forEach((b) => b.addEventListener('click', () => { andar(+b.dataset.car); pararAuto(); }));
  car.addEventListener('scroll', () => requestAnimationFrame(atualizarCar), { passive: true });
  car.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); andar(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); andar(-1); } });
  window.addEventListener('resize', atualizarCar); atualizarCar();
  // arrastar com o mouse
  let arr = null;
  car.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; arr = { x: e.clientX, s: car.scrollLeft, moveu: false }; });
  window.addEventListener('pointermove', (e) => {
    if (!arr) return;
    const dx = e.clientX - arr.x;
    if (Math.abs(dx) > 4 && !arr.moveu) { arr.moveu = true; car.classList.add('arrastando'); pararAuto(); }
    if (arr.moveu) car.scrollLeft = arr.s - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!arr) return;
    const moveu = arr.moveu; arr = null;
    if (moveu) { car.classList.remove('arrastando'); const p = passo(); car.scrollTo({ left: Math.round(car.scrollLeft / p) * p }); }
  });
  let carAuto = 0;
  const pararAuto = () => { clearInterval(carAuto); carAuto = 0; };
  if (!reduz) {
    carAuto = setInterval(() => { if (!document.hidden && !car.matches(':hover')) andar(1); }, 5200);
    car.addEventListener('focusin', pararAuto);
  }

  /* ---------- vídeo da capa ---------- */
  const hero = $('[data-hero]');
  const hVideo = $('[data-hero-video]');
  const hBtn = $('[data-hero-btn]');
  let hPausado = false;
  const marcarHero = () => {
    const tocando = !hVideo.paused;
    hBtn.innerHTML = tocando ? ICO.pausa : ICO.play;
    hBtn.setAttribute('aria-label', tocando ? 'Pausar vídeo' : 'Tocar vídeo');
  };
  hVideo.addEventListener('play', marcarHero); hVideo.addEventListener('pause', marcarHero);
  if (reduz || economia) { hPausado = true; marcarHero(); }
  else {
    hVideo.play().catch(() => marcarHero());
    new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !hPausado) hVideo.play().catch(() => {}); else if (!e.isIntersecting) hVideo.pause();
    }), { threshold: 0.1 }).observe(hero);
  }
  hBtn.addEventListener('click', () => {
    if (hVideo.paused) { hPausado = false; hVideo.play().catch(() => {}); } else { hPausado = true; hVideo.pause(); }
  });
  const topoNoVideo = () => topo.classList.toggle('sobre-video', scrollY < hero.offsetHeight - 70);
  window.addEventListener('scroll', topoNoVideo, { passive: true }); topoNoVideo();

  /* ---------- números que contam ---------- */
  const contar = (el) => {
    const fim = +el.dataset.conta, ini = el.dataset.de ? +el.dataset.de : 0;
    if (reduz) { el.textContent = fim; return; }
    const dur = 1600, t0 = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(ini + (fim - ini) * e);
      if (k < 1) requestAnimationFrame(tick);
    };
    el.textContent = ini; requestAnimationFrame(tick);
  };

  /* ---------- entrada suave ao aparecer ---------- */
  if ('IntersectionObserver' in window && !reduz) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('vis');
      $$('[data-conta]', e.target).forEach(contar);
      if (e.target.matches('[data-conta]')) contar(e.target);
      io.unobserve(e.target);
    }), { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
    $$('.rv, .sobre-num').forEach((el) => io.observe(el));
    // o 10% do cartão conta quando o cartão termina de entrar
    const off = $('[data-off] [data-conta]');
    if (off) { off.textContent = '0'; setTimeout(() => contar(off), 1300); }
  } else $$('.rv').forEach((el) => el.classList.add('vis'));

  const comMouse = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- cartão de 10% inclina seguindo o mouse ---------- */
  const offCard = $('[data-off]');
  if (comMouse && !reduz) {
    offCard.addEventListener('pointermove', (e) => {
      const r = offCard.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      offCard.style.setProperty('--ry', (x * 18).toFixed(1) + 'deg'); offCard.style.setProperty('--rx', (-y * 18).toFixed(1) + 'deg');
    });
    offCard.addEventListener('pointerleave', () => { offCard.style.setProperty('--ry', '0deg'); offCard.style.setProperty('--rx', '0deg'); });
  }

  /* ---------- botões principais puxam o mouse de leve ---------- */
  if (comMouse && !reduz) {
    $$('[data-ima]').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px`;
      });
      b.addEventListener('pointerleave', () => { b.style.translate = ''; });
    });
  }

  /* ---------- cursor da marca: ponto ketchup + anel que segue com atraso ---------- */
  if (comMouse && !reduz) {
    const doc = document.documentElement;
    const ponto = document.createElement('div'); ponto.className = 'cur-ponto';
    const anel = document.createElement('div'); anel.className = 'cur-anel';
    anel.innerHTML = `${$('.logo .simbolo').outerHTML}<span></span>`;
    const rot = $('span', anel);
    document.body.append(ponto, anel);
    doc.classList.add('cursor-on');
    let mx = innerWidth / 2, my = innerHeight / 2, ax = mx, ay = my, ativo = false;
    const estados = ['cursor-link', 'cursor-pedir', 'cursor-video', 'cursor-arrasta'];
    const definir = (estado, texto) => {
      estados.forEach((c) => doc.classList.toggle(c, c === estado));
      if (texto != null) rot.textContent = texto;
    };
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      ponto.style.transform = `translate(${mx}px, ${my}px)`;
      doc.classList.remove('cursor-fora');
      if (!ativo) { ativo = true; ax = mx; ay = my; }
      const t = e.target;
      if (t.closest('input, textarea, select')) definir(null);
      else if (t.closest('.carrossel')) definir('cursor-arrasta', car.classList.contains('arrastando') ? 'solta' : 'arrasta');
      else if (t.closest('.prato, .dest') && !t.closest('button')) definir('cursor-pedir', 'pedir');
      else if (t.closest('[data-cursor="video"], .chapa-video')) definir('cursor-video', hVideo && $('[data-video]').paused ? 'tocar' : 'assistir');
      else if (t.closest('a, button, label, [role="tab"]')) definir('cursor-link');
      else definir(null);
      doc.classList.toggle('cursor-escuro', !!t.closest('.hero, .chapa, .destaques, .rodape, .letreiro, .voz-verm'));
    }, { passive: true });
    document.addEventListener('pointerdown', () => doc.classList.add('cursor-aperta'));
    document.addEventListener('pointerup', () => doc.classList.remove('cursor-aperta'));
    document.addEventListener('mouseleave', () => doc.classList.add('cursor-fora'));
    const segue = () => {
      ax += (mx - ax) * 0.18; ay += (my - ay) * 0.18;
      anel.style.transform = `translate(${ax.toFixed(1)}px, ${ay.toFixed(1)}px)`;
      requestAnimationFrame(segue);
    };
    requestAnimationFrame(segue);
    // clicar no vídeo da chapa também toca e pausa
    $('.chapa-video').addEventListener('click', (e) => { if (!e.target.closest('button')) vBtn.click(); });
  }

  /* ---------- tudo junto ---------- */
  const desenharTudo = () => { desenharCardapio(); desenharDestaques(); desenharSacola(); };
  desenharTudo();
  // o painel publicou em outra aba: atualiza na hora
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('monta-cardapio')) { dados = C.publicado(); desenharTudo(); avisar('Cardápio atualizado'); }
  });
  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
