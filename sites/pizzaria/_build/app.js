/* Fornalha Pizza Bar, modelo Gold: telas, cardápio, meio a meio, sacola, roleta e reserva. */
(() => {
  const D = window.FORNALHA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const brl = (n) => 'R$ ' + n.toFixed(2).replace('.', ',').replace(',00', '');
  const item = (id) => D.itens.find((i) => i.id === id);
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const guarda = {
    ler(k, pad) { try { return JSON.parse(localStorage.getItem(k)) ?? pad; } catch (e) { return pad; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } },
  };
  const abrirWhats = (txt) => window.open(`https://wa.me/${D.marca.whatsapp}?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');

  /* ---------- aviso ---------- */
  const aviso = $('[data-aviso]');
  let avisoT;
  const avisar = (txt) => {
    aviso.textContent = txt;
    aviso.classList.add('on');
    clearTimeout(avisoT);
    avisoT = setTimeout(() => aviso.classList.remove('on'), 3200);
  };

  /* ---------- grupos com fundo: todos com a largura do item mais longo ---------- */
  const igualar = () => {
    $$('[data-iguais]').forEach((g) => {
      const sel = g.dataset.iguais;
      const itens = [...g.children].filter((c) => !sel || c.matches(sel));
      if (!g.offsetParent && getComputedStyle(g).position !== 'fixed') return; // escondido: mede quando aparecer
      g.classList.remove('medido');
      const maior = Math.max(...itens.map((c) => c.offsetWidth));
      if (maior > 0) { g.style.setProperty('--larg', maior + 'px'); g.classList.add('medido'); }
    });
  };
  window.addEventListener('resize', () => { clearTimeout(igualar.t); igualar.t = setTimeout(igualar, 120); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(igualar);
  igualar();

  /* ---------- capa: vídeo do pizzaiolo primeiro, depois a foto ---------- */
  (() => {
    const capa = $('.capa');
    const v = $('[data-capa-video]');
    const barra = $('[data-capa-tempo]');
    const rever = $('[data-capa-rever]');
    if (!capa || !v) return;
    const economia = navigator.connection && navigator.connection.saveData;
    const virarFoto = () => capa.classList.add('foto');
    if (calmo || economia) { v.remove(); $('.capa-tempo').remove(); capa.classList.add('foto'); return; }
    const tocar = () => {
      capa.classList.remove('foto');
      v.currentTime = 0;
      const p = v.play();
      if (p && p.catch) p.catch(virarFoto);
    };
    let raf;
    const andar = () => {
      if (v.duration) barra.style.transform = `scaleX(${Math.min(1, v.currentTime / v.duration)})`;
      raf = requestAnimationFrame(andar);
    };
    v.addEventListener('play', () => { cancelAnimationFrame(raf); andar(); });
    v.addEventListener('ended', () => { cancelAnimationFrame(raf); virarFoto(); });
    v.addEventListener('error', virarFoto, true);
    rever.addEventListener('click', tocar);
    // pausa fora da tela e retoma ao voltar
    new IntersectionObserver(([e]) => {
      if (capa.classList.contains('foto')) return;
      if (e.isIntersecting) v.play().catch(virarFoto); else v.pause();
    }, { threshold: 0.25 }).observe(capa);
    tocar();
  })();

  /* ---------- telas ---------- */
  const VISTAS = ['inicio', 'cardapio', 'reserva'];
  let vistaAtual = null;
  const luz = $('.nav-luz');
  const moverLuz = () => {
    const a = $('.painel .nav a[aria-current="page"]');
    if (!a || !luz) return;
    luz.style.width = a.offsetWidth + 'px';
    luz.style.transform = `translateX(${a.offsetLeft}px)`;
  };
  const mostrar = (v, rolar = true) => {
    if (!VISTAS.includes(v)) v = 'inicio';
    if (v !== vistaAtual) {
      $$('[data-vista]').forEach((s) => s.classList.toggle('ativa', s.dataset.vista === v));
      $$('.nav a').forEach((a) => { if (a.dataset.ir === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
      document.body.dataset.vista = v;
      vistaAtual = v;
      moverLuz();
      igualar();
      if (v === 'cardapio') requestAnimationFrame(() => { moverAba(); refazerEntrada(); });
      observar();
    }
    if (rolar) window.scrollTo({ top: 0, behavior: 'instant' });
  };
  document.addEventListener('click', (e) => {
    const ir = e.target.closest('[data-ir]');
    if (ir) {
      e.preventDefault();
      const v = ir.dataset.ir;
      if (location.hash !== '#' + v) history.pushState(null, '', '#' + v);
      mostrar(v);
      if (ir.hasAttribute('data-fechar-sacola')) fecharSacola();
      return;
    }
    const ancora = e.target.closest('a[href^="#"]');
    if (ancora && ancora.getAttribute('href').length > 1) {
      const alvo = document.getElementById(ancora.getAttribute('href').slice(1));
      const tela = alvo && alvo.closest('[data-vista]');
      if (tela && !VISTAS.includes(alvo.id)) {
        e.preventDefault();
        mostrar(tela.dataset.vista, false);
        requestAnimationFrame(() => alvo.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth', block: 'center' }));
      }
    }
  });
  window.addEventListener('popstate', () => mostrar(location.hash.slice(1)));
  window.addEventListener('resize', () => { moverLuz(); moverAba(); ajustarLetreiro(); });

  /* ---------- revelar ao rolar ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('visto'); io.unobserve(en.target); }
  }), { threshold: .12 }) : null;
  const observar = () => {
    $$('.vista.ativa .rv:not(.visto), .rodape .rv:not(.visto)').forEach((el) => io ? io.observe(el) : el.classList.add('visto'));
  };
  $$('.roleta, .casa, .hora, .mapa-onde, .rodape-cols').forEach((el) => el.classList.add('rv'));

  /* ---------- forno aceso? (horário de Brasília) ---------- */
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const hFmt = (h) => h >= 24 ? 'meia-noite' : `${Math.floor(h)}h${h % 1 ? String(Math.round(h % 1 * 60)).padStart(2, '0') : ''}`;
  const agoraSP = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), h: +p.hour + +p.minute / 60 };
  };
  (() => {
    const { dia, h } = agoraSP();
    const el = $('[data-forno]');
    const turno = (D.horarios[dia] || []).find(([a, b]) => h >= a && h < b);
    if (turno) {
      el.innerHTML = `Forno <b>aceso</b> agora, até ${hFmt(turno[1]) === 'meia-noite' ? 'a meia-noite' : 'as ' + hFmt(turno[1])}.`;
    } else {
      let txt = '';
      for (let k = 0; k < 8 && !txt; k++) {
        const d = (dia + k) % 7;
        const prox = (D.horarios[d] || []).find(([a]) => k > 0 || a > h);
        if (prox) txt = `${k === 0 ? 'hoje' : k === 1 ? 'amanhã' : DIAS[d]} às ${hFmt(prox[0])}`;
      }
      el.classList.add('apagado');
      el.innerHTML = `Forno <b>descansando</b>. Acende ${txt}.`;
    }
    const linha = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça a quinta', 3: 'Terça a quinta', 4: 'Terça a quinta', 5: 'Sexta', 6: 'Sábado' }[dia];
    const tr = $(`.horarios tr[data-dia="${linha}"]`);
    if (tr) tr.classList.add('hoje');
  })();

  /* ---------- letreiro gigante ---------- */
  const letreiro = $('[data-marca]');
  const letras = letreiro ? $$('span', letreiro) : [];
  const BASE = 62;
  function ajustarLetreiro() {
    if (!letreiro) return;
    letras.forEach((l) => l.style.setProperty('--w', BASE));
    letreiro.style.setProperty('--tam', '100px');
    const larg = letreiro.parentElement.clientWidth - parseFloat(getComputedStyle(letreiro.parentElement).paddingLeft) * 2;
    const atual = letras.reduce((s, l) => s + l.offsetWidth, 0);
    if (atual) letreiro.style.setProperty('--tam', Math.min(240, (100 * larg * 1.04) / atual) + 'px');
  }
  if (letreiro) {
    document.fonts && document.fonts.ready.then(ajustarLetreiro);
    ajustarLetreiro();
    letreiro.addEventListener('pointermove', (e) => {
      if (calmo) return;
      const pesos = letras.map((l) => {
        const r = l.getBoundingClientRect();
        const d = (e.clientX - (r.left + r.width / 2)) / r.width;
        return 0.55 + 1.6 * Math.exp(-d * d / 1.6);
      });
      const soma = pesos.reduce((a, b) => a + b, 0);
      letras.forEach((l, i) => l.style.setProperty('--w', Math.max(50, Math.min(140, BASE * letras.length * pesos[i] / soma)).toFixed(1)));
    });
    letreiro.addEventListener('pointerleave', () => letras.forEach((l) => l.style.setProperty('--w', BASE)));
    letreiro.addEventListener('click', (e) => {
      const l = e.target.closest('span');
      if (!l) return;
      letras.forEach((x, i) => setTimeout(() => { x.classList.remove('pula'); void x.offsetWidth; x.classList.add('pula'); }, Math.abs(i - letras.indexOf(l)) * 60));
    });
  }

  /* ---------- cardápio ---------- */
  const pratos = $$('.prato');
  const abas = $$('.aba');
  const abaLuz = $('.aba-luz');
  const titulo = $('[data-menu-titulo]');
  const busca = $('[data-busca]');
  const vazio = $('[data-vazio]');
  const TIT = { todos: 'O cardápio inteiro', pizza: 'Pizzas de forno a lenha', massa: 'Massas frescas da casa', salada: 'Saladas', drink: 'Drinks e bebidas', dividir: 'Pra dividir na mesa' };
  const filtro = { cat: 'todos', q: '', tags: new Set() };
  function moverAba() {
    const a = abas.find((x) => x.getAttribute('aria-selected') === 'true');
    if (!a || !abaLuz || !a.offsetWidth) return;
    abaLuz.style.width = a.offsetWidth + 'px';
    abaLuz.style.transform = `translateX(${a.offsetLeft - 5}px)`;
    abaLuz.style.left = '5px';
  }
  function refazerEntrada() {
    let o = 0;
    pratos.forEach((p) => {
      if (p.hidden) return;
      p.style.setProperty('--o', o++);
      p.style.animation = 'none';
      void p.offsetWidth;
      p.style.animation = '';
    });
  }
  const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  function filtrar() {
    const q = semAcento(filtro.q.trim());
    let n = 0;
    abas.forEach((x) => x.classList.toggle('apagada', !!q && x.dataset.cat !== 'todos'));
    pratos.forEach((p) => {
      // a busca procura no cardápio inteiro, sem olhar a aba
      const ok = (q || filtro.cat === 'todos' || p.dataset.cat === filtro.cat)
        && (!q || semAcento(p.dataset.busca).includes(q))
        && [...filtro.tags].every((t) => p.dataset.tags.split(' ').includes(t));
      p.hidden = !ok;
      if (ok) n++;
    });
    vazio.hidden = n > 0;
    const novo = q ? `Achamos ${n} pra "${filtro.q.trim()}"` : TIT[filtro.cat];
    if (titulo.textContent !== novo) {
      titulo.textContent = novo;
      titulo.classList.remove('troca'); void titulo.offsetWidth; titulo.classList.add('troca');
    }
    refazerEntrada();
  }
  abas.forEach((a) => a.addEventListener('click', () => {
    abas.forEach((x) => x.setAttribute('aria-selected', x === a ? 'true' : 'false'));
    filtro.cat = a.dataset.cat;
    moverAba();
    a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: calmo ? 'auto' : 'smooth' });
    filtrar();
    const topo = $('#cardapio').getBoundingClientRect().top + scrollY - 20;
    if (scrollY > topo) window.scrollTo({ top: topo, behavior: calmo ? 'auto' : 'smooth' });
  }));
  let buscaT;
  busca.addEventListener('input', () => { clearTimeout(buscaT); buscaT = setTimeout(() => { filtro.q = busca.value; filtrar(); }, 160); });
  $$('[data-filtro]').forEach((b) => b.addEventListener('click', () => {
    const t = b.dataset.filtro;
    const on = !filtro.tags.has(t);
    on ? filtro.tags.add(t) : filtro.tags.delete(t);
    b.setAttribute('aria-pressed', on);
    filtrar();
  }));
  $('[data-limpar]').addEventListener('click', () => {
    filtro.q = ''; busca.value = ''; filtro.tags.clear();
    $$('[data-filtro]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    abas[0].click();
  });

  /* ---------- sacola ---------- */
  let sacola = guarda.ler('fornalha-sacola', []);
  if (!Array.isArray(sacola)) sacola = [];
  const sacolaBtn = $('[data-sacola]');
  const gaveta = $('[data-gaveta]');
  const form = $('[data-g-pedido]');
  const subtotal = () => sacola.reduce((s, l) => s + l.unit * l.qtd, 0);
  function salvar() { guarda.gravar('fornalha-sacola', sacola); desenharSacola(); }
  function por(linha) {
    const igual = sacola.find((l) => l.key === linha.key);
    if (igual) igual.qtd += linha.qtd; else sacola.push(linha);
    salvar();
    sacolaBtn.classList.remove('balanca'); void sacolaBtn.offsetWidth; sacolaBtn.classList.add('balanca');
  }
  function desenharSacola() {
    const qtd = sacola.reduce((s, l) => s + l.qtd, 0);
    const sub = subtotal();
    $('[data-qtd]').textContent = qtd;
    $('[data-total]').textContent = qtd ? brl(sub) : 'Sacola';
    sacolaBtn.classList.toggle('cheia', qtd > 0);
    sacolaBtn.setAttribute('aria-label', qtd ? `Abrir sacola, ${qtd} itens, ${brl(sub)}` : 'Abrir sacola vazia');
    $('[data-g-vazia]').hidden = qtd > 0;
    form.hidden = qtd === 0;
    $('[data-g-lista]').innerHTML = sacola.map((l, i) => `
      <li class="g-item">
        <img src="assets/img/${l.id}.webp" alt="" width="64" height="64">
        <div><b>${l.nome}</b>${l.det ? `<small>${l.det}</small>` : ''}<span class="g-preco">${brl(l.unit * l.qtd)}</span></div>
        <div class="passo"><button type="button" data-l="${i}" data-d="-1" aria-label="Tirar um">${l.qtd === 1 ? '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 7.5h13M9.5 7.5V5.5h5v2M7 7.5l.9 11.5h8.2L17 7.5"/></svg>' : '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5.5 12h13"/></svg>'}</button><output>${l.qtd}</output><button type="button" data-l="${i}" data-d="1" aria-label="Pôr mais um"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5.5v13M5.5 12h13"/></svg></button></div>
      </li>`).join('');
    const entrega = form.modo.value === 'entrega';
    const taxa = entrega ? D.marca.taxa : 0;
    $('[data-g-sub]').textContent = brl(sub);
    $('[data-g-taxa]').textContent = brl(taxa);
    $('[data-g-taxa-l]').hidden = !entrega;
    $('[data-g-end]').hidden = !entrega;
    $('[data-g-total]').textContent = brl(sub + taxa);
    const falta = entrega ? D.marca.minimo - sub : 0;
    $('[data-g-falta]').textContent = falta > 0 ? `Faltam ${brl(falta)} pro pedido mínimo da entrega. Que tal uma bruschetta?` : '';
    $('.g-enviar').disabled = falta > 0;
  }
  $('[data-g-lista]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-l]');
    if (!b) return;
    const l = sacola[+b.dataset.l];
    l.qtd += +b.dataset.d;
    if (l.qtd <= 0) sacola.splice(+b.dataset.l, 1);
    salvar();
  });
  form.addEventListener('change', desenharSacola);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const entrega = form.modo.value === 'entrega';
    if (entrega && form.end.value.trim().length < 6) { form.end.focus(); form.end.classList.add('invalido'); avisar('Falta o endereço pra gente entregar.'); return; }
    form.end.classList.remove('invalido');
    const sub = subtotal(), taxa = entrega ? D.marca.taxa : 0;
    const linhas = sacola.map((l) => `${l.qtd}x ${l.nome}${l.det ? ` (${l.det})` : ''}: ${brl(l.unit * l.qtd)}`);
    abrirWhats(['Oi, Fornalha! Quero fazer um pedido:', '', ...linhas, '', `Subtotal: ${brl(sub)}`, entrega ? `Entrega: ${brl(taxa)}` : 'Retiro no balcão', `Total: ${brl(sub + taxa)}`, '', entrega ? `Endereço: ${form.end.value.trim()}` : '', `Pagamento: ${form.pag.value}`].filter((x, i, a) => x !== '' || a[i - 1] !== '').join('\n'));
    avisar('Pedido pronto no WhatsApp. É só enviar!');
  });

  let focoAntes;
  const travar = (on) => { document.documentElement.style.overflow = on ? 'hidden' : ''; };
  function abrirSacola() {
    focoAntes = document.activeElement;
    gaveta.hidden = false;
    travar(true);
    $('.fechar', gaveta).focus();
  }
  function fecharSacola() {
    if (gaveta.hidden) return;
    gaveta.classList.add('fechando');
    setTimeout(() => { gaveta.hidden = true; gaveta.classList.remove('fechando'); travar(false); focoAntes && focoAntes.focus && focoAntes.focus(); }, calmo ? 0 : 280);
  }
  sacolaBtn.addEventListener('click', abrirSacola);
  $$('[data-fechar-sacola]').forEach((b) => b.addEventListener('click', fecharSacola));

  // a foto voa até a sacola
  function voar(deEl, id) {
    if (calmo || !deEl) return;
    const r = deEl.getBoundingClientRect();
    const alvo = sacolaBtn.getBoundingClientRect();
    const img = document.createElement('img');
    img.src = `assets/img/${id}.webp`;
    img.className = 'voando';
    const t = Math.min(r.width, r.height, 140);
    Object.assign(img.style, { left: r.left + r.width / 2 - 40 + 'px', top: r.top + r.height / 2 - 40 + 'px' });
    document.body.appendChild(img);
    const dx = alvo.left + alvo.width / 2 - (r.left + r.width / 2), dy = alvo.top + alvo.height / 2 - (r.top + r.height / 2);
    img.animate([
      { transform: `scale(${t / 80}) rotate(0)`, opacity: 1 },
      { transform: `translate(${dx * .45}px, ${dy * .45 - 120}px) scale(.9) rotate(200deg)`, opacity: 1, offset: .5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.2) rotate(420deg)`, opacity: .6 },
    ], { duration: 820, easing: 'cubic-bezier(.5,0,.6,1)' }).onfinish = () => img.remove();
  }

  /* ---------- modal do prato ---------- */
  const modal = $('[data-modal]');
  const M = {
    foto: $('[data-m-foto]'), img: $('[data-m-img]'), meia: $('[data-m-meia]'), nome: $('[data-m-nome]'), desc: $('[data-m-desc]'),
    tags: $('[data-m-tags]'), pizza: $('[data-m-pizza]'), meias: $('[data-m-meias]'), bordas: $('[data-m-bordas]'),
    n: $('[data-m-n]'), preco: $('[data-m-preco]'), obs: $('[data-m-obs]'),
  };
  const est = { id: null, qtd: 1, tam: 'grande', meia: null, borda: 0 };
  M.bordas.innerHTML = D.bordas.map(([n, p], i) => `<label><input type="radio" name="borda" value="${i}"${i ? '' : ' checked'}><span>${n}<em>${p ? '+ ' + brl(p) : ''}</em></span></label>`).join('');
  const precoUnit = () => {
    const it = item(est.id);
    if (it.cat !== 'pizza') return it.preco;
    const val = (x) => est.tam === 'broto' ? x.broto : x.preco;
    let p = val(it);
    if (est.meia) p = Math.max(p, val(item(est.meia)));
    return p + D.bordas[est.borda][1];
  };
  const atualizarPreco = () => { M.n.textContent = est.qtd; M.preco.textContent = brl(precoUnit() * est.qtd); };
  function desenharMeias() {
    M.meias.innerHTML = `<button type="button" class="meia" data-meia="" aria-pressed="${!est.meia}"><i>Inteira</i>Só essa</button>` + D.pizzas.filter((p) => p !== est.id).map((p) => `<button type="button" class="meia" data-meia="${p}" aria-pressed="${est.meia === p}"><img src="assets/img/${p}.webp" alt="" width="74" height="74" loading="lazy">${item(p).nome}</button>`).join('');
  }
  M.meias.addEventListener('click', (e) => {
    const b = e.target.closest('[data-meia]');
    if (!b) return;
    est.meia = b.dataset.meia || null;
    $$('.meia', M.meias).forEach((x) => x.setAttribute('aria-pressed', x === b));
    if (est.meia) {
      M.meia.hidden = false;
      M.meia.src = `assets/img/${est.meia}.webp`;
      M.meia.style.animation = 'none'; void M.meia.offsetWidth; M.meia.style.animation = '';
      M.foto.classList.add('dividida');
    } else { M.meia.hidden = true; M.foto.classList.remove('dividida'); }
    atualizarPreco();
  });
  M.pizza.addEventListener('change', (e) => {
    if (e.target.name === 'tam') est.tam = e.target.value;
    if (e.target.name === 'borda') est.borda = +e.target.value;
    atualizarPreco();
  });
  $$('[data-m-qtd]').forEach((b) => b.addEventListener('click', () => {
    est.qtd = Math.max(1, Math.min(20, est.qtd + +b.dataset.mQtd));
    M.n.classList.remove('pula'); void M.n.offsetWidth; M.n.classList.add('pula');
    atualizarPreco();
  }));
  function abrir(id) {
    const it = item(id);
    if (!it) return;
    Object.assign(est, { id, qtd: 1, tam: 'grande', meia: null, borda: 0 });
    M.img.src = `assets/img/${id}.webp`;
    M.img.alt = it.nome;
    M.meia.hidden = true;
    M.foto.classList.remove('dividida');
    M.foto.classList.toggle('pizza', it.cat === 'pizza');
    M.img.style.animation = 'none'; void M.img.offsetWidth; M.img.style.animation = '';
    M.nome.textContent = it.nome;
    M.desc.textContent = it.desc;
    const tg = $(`.prato[data-id="${id}"] .tags`);
    M.tags.innerHTML = tg ? tg.outerHTML : '';
    M.pizza.hidden = it.cat !== 'pizza';
    M.obs.value = '';
    if (it.cat === 'pizza') {
      M.pizza.querySelector('input[name="tam"][value="grande"]').checked = true;
      M.pizza.querySelector('input[name="borda"][value="0"]').checked = true;
      desenharMeias();
    }
    atualizarPreco();
    focoAntes = document.activeElement;
    modal.hidden = false;
    travar(true);
    $('.fechar', modal).focus();
  }
  function fechar() {
    if (modal.hidden) return;
    modal.classList.add('fechando');
    setTimeout(() => { modal.hidden = true; modal.classList.remove('fechando'); travar(false); focoAntes && focoAntes.focus && focoAntes.focus(); }, calmo ? 0 : 230);
  }
  $$('[data-fechar]').forEach((b) => b.addEventListener('click', fechar));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) fechar(); else fecharSacola();
  });
  // prender o foco dentro do modal/gaveta
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const caixa = !modal.hidden ? $('.modal-caixa') : !gaveta.hidden ? $('.gaveta-caixa') : null;
    if (!caixa) return;
    const f = $$('button:not([disabled]), input:not([type="radio"]), input[type="radio"]:checked, select, textarea, a[href]', caixa).filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
  });
  $('[data-m-add]').addEventListener('click', () => {
    const it = item(est.id);
    const det = [];
    if (it.cat === 'pizza') {
      det.push(est.tam === 'broto' ? 'Broto' : 'Grande');
      if (est.meia) det.push('meio a meio com ' + item(est.meia).nome);
      if (est.borda) det.push(D.bordas[est.borda][0].toLowerCase());
    }
    const obs = M.obs.value.trim();
    if (obs) det.push(obs);
    voar(M.foto, est.id);
    por({ key: [est.id, est.tam, est.meia, est.borda, obs].join('|'), id: est.id, nome: it.nome, det: det.join(', '), unit: precoUnit(), qtd: est.qtd });
    fechar();
    avisar(`${it.nome} foi pra sacola.`);
  });

  // cliques nos pratos, nos favoritos e no + rápido
  document.addEventListener('click', (e) => {
    const ab = e.target.closest('[data-abrir]');
    if (ab) { abrir(ab.dataset.abrir); return; }
    const rp = e.target.closest('[data-rapido]');
    if (rp) {
      const it = item(rp.dataset.rapido);
      voar(rp.closest('.prato').querySelector('img'), it.id);
      const grande = it.cat === 'pizza';
      por({ key: [it.id, grande ? 'grande' : '', null, 0, ''].join('|'), id: it.id, nome: it.nome, det: grande ? 'Grande' : '', unit: it.preco, qtd: 1 });
      avisar(grande ? `${it.nome} grande na sacola. Toque na foto pra montar meio a meio.` : `${it.nome} foi pra sacola.`);
    }
  });

  /* ---------- roleta ---------- */
  const roda = $('[data-roda]');
  const roletaBox = $('.roleta-roda');
  const res = $('[data-resultado]');
  const botaoGirar = $('[data-girar]');
  let giro = 0, girando = false;
  function confete(x, y) {
    if (calmo) return;
    const cores = ['#C42E1A', '#F4B41A', '#2F6B3A', '#FFFAF0', '#E8641E'];
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('span');
      p.className = 'miolo' + (i % 3 === 0 ? ' folhinha' : '');
      p.style.background = cores[i % cores.length];
      p.style.left = x + 'px'; p.style.top = y + 'px';
      document.body.appendChild(p);
      const a = Math.random() * Math.PI * 2, v = 90 + Math.random() * 170;
      p.animate([
        { transform: 'translate(0,0) rotate(0)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * v}px, ${Math.sin(a) * v + 140}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
      ], { duration: 1100 + Math.random() * 600, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = () => p.remove();
    }
  }
  function girar() {
    if (girando) return;
    girando = true;
    botaoGirar.disabled = true;
    roletaBox.classList.add('girando');
    res.innerHTML = '';
    const k = Math.floor(Math.random() * D.pizzas.length);
    const resto = ((360 - k * 45) % 360 + 360) % 360;
    const atual = ((giro % 360) + 360) % 360;
    giro += (calmo ? 0 : 360 * (5 + Math.floor(Math.random() * 3))) + ((resto - atual + 360) % 360) + (Math.random() * 24 - 12);
    roda.style.transform = `rotate(${giro}deg)`;
    const fim = () => {
      girando = false;
      botaoGirar.disabled = false;
      botaoGirar.textContent = 'Girar de novo';
      roletaBox.classList.remove('girando');
      const it = item(D.pizzas[k]);
      res.innerHTML = `<div class="saiu"><img src="assets/img/${it.id}.webp" alt="" width="86" height="86"><div><small>O forno escolheu</small><b>${it.nome}</b><button type="button" data-abrir="${it.id}">Quero essa</button></div></div>`;
      const r = roda.getBoundingClientRect();
      confete(r.left + r.width / 2, r.top + r.height * .3);
    };
    if (calmo) fim(); else setTimeout(fim, 4650);
  }
  botaoGirar.addEventListener('click', girar);
  roda.addEventListener('click', girar);

  /* ---------- reserva ---------- */
  const R = { dia: null, hora: null, pessoas: 2 };
  const fr = $('[data-reserva]');
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const SEM = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const diasBox = $('[data-dias]');
  for (let k = 0; k < 14; k++) {
    const d = new Date(hoje); d.setDate(hoje.getDate() + k);
    const fechado = !(D.horarios[d.getDay()] || []).length;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'dia';
    b.disabled = fechado;
    b.setAttribute('aria-pressed', 'false');
    b.dataset.k = k;
    b.innerHTML = `<small>${k === 0 ? 'hoje' : k === 1 ? 'amanhã' : SEM[d.getDay()]}</small><b>${d.getDate()}</b><small>${fechado ? 'fechado' : MESES[d.getMonth()]}</small>`;
    b.setAttribute('aria-label', `${d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}${fechado ? ', fechado' : ''}`);
    diasBox.appendChild(b);
  }
  const marcar = (campo, txt) => {
    const dd = $(`[data-c="${campo}"]`);
    if (dd.textContent === txt) return;
    dd.textContent = txt;
    dd.classList.remove('muda'); void dd.offsetWidth; dd.classList.add('muda');
  };
  diasBox.addEventListener('click', (e) => {
    const b = e.target.closest('.dia');
    if (!b || b.disabled) return;
    $$('.dia', diasBox).forEach((x) => x.setAttribute('aria-pressed', x === b));
    const d = new Date(hoje); d.setDate(hoje.getDate() + +b.dataset.k);
    R.dia = d; R.hora = null;
    marcar('dia', d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, ''));
    marcar('hora', 'a escolher');
    const agora = agoraSP();
    const slots = [];
    (D.horarios[d.getDay()] || []).forEach(([a, z]) => { for (let h = a; h <= z - 1; h += .5) if (+b.dataset.k > 0 || h > agora.h + 1) slots.push(h); });
    $('[data-horas]').innerHTML = slots.length
      ? slots.map((h, i) => `<button type="button" class="hora-btn" style="--o:${i}" data-h="${h}" aria-pressed="false">${Math.floor(h)}:${h % 1 ? '30' : '00'}</button>`).join('')
      : '<p class="dica">Hoje não dá mais tempo. Escolhe outro dia?</p>';
  });
  $('[data-horas]').addEventListener('click', (e) => {
    const b = e.target.closest('.hora-btn');
    if (!b) return;
    $$('.hora-btn').forEach((x) => x.setAttribute('aria-pressed', x === b));
    R.hora = b.textContent;
    marcar('hora', R.hora);
  });
  const mesa = $('[data-mesa]');
  function desenharMesa() {
    const n = R.pessoas;
    const tampo = n > 8 ? 60 : 50;
    const raio = tampo + 30;
    const [cw, ch] = n > 8 ? [22, 16] : [28, 20];
    let s = `<circle class="mesa-tampo" r="${tampo}"/>`;
    for (let i = 0; i < n; i++) {
      const a = i / n * 360 - 90, rad = a * Math.PI / 180;
      s += `<rect class="mesa-cadeira" x="${(-cw / 2).toFixed(1)}" y="${(-ch / 2).toFixed(1)}" width="${cw}" height="${ch}" rx="7" transform="translate(${(Math.cos(rad) * raio).toFixed(1)} ${(Math.sin(rad) * raio).toFixed(1)}) rotate(${a + 90})" style="animation-delay:${i === n - 1 ? 0 : -1}s"/>`;
      s += `<circle class="mesa-prato" r="${n > 8 ? 8 : 10}" cx="${(Math.cos(rad) * (tampo - 16)).toFixed(1)}" cy="${(Math.sin(rad) * (tampo - 16)).toFixed(1)}"/>`;
    }
    mesa.innerHTML = s;
    const out = $('[data-pessoas-n]');
    out.textContent = n;
    out.classList.remove('pula'); void out.offsetWidth; out.classList.add('pula');
    marcar('pessoas', n === 1 ? '1 pessoa' : `${n} pessoas`);
  }
  $$('[data-pessoas]').forEach((b) => b.addEventListener('click', () => {
    const n = Math.max(1, Math.min(12, R.pessoas + +b.dataset.pessoas));
    if (n === R.pessoas) { avisar(n === 12 ? 'Mais de 12 pessoas? Chama no WhatsApp que a gente monta o salão.' : 'Mesa pra ninguém não rola.'); return; }
    R.pessoas = n;
    desenharMesa();
  }));
  desenharMesa();
  fr.addEventListener('change', (e) => { if (e.target.name === 'ocasiao') marcar('ocasiao', e.target.value); });
  fr.nome.addEventListener('input', () => marcar('nome', fr.nome.value.trim() || '...'));
  fr.fone.addEventListener('input', () => {
    const d = fr.fone.value.replace(/\D/g, '').slice(0, 11);
    fr.fone.value = d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
  });
  fr.addEventListener('submit', (e) => {
    e.preventDefault();
    const erro = $('[data-erro]');
    $$('.invalido', fr).forEach((x) => x.classList.remove('invalido'));
    let msg = '';
    if (!R.dia) msg = 'Escolha o dia da reserva.';
    else if (!R.hora) msg = 'Escolha o horário.';
    else if (fr.nome.value.trim().length < 2) { msg = 'Diz seu nome pra gente guardar a mesa.'; fr.nome.classList.add('invalido'); fr.nome.focus(); }
    else if (fr.fone.value.replace(/\D/g, '').length < 10) { msg = 'Confere o WhatsApp com DDD.'; fr.fone.classList.add('invalido'); fr.fone.focus(); }
    erro.textContent = msg;
    if (msg) return;
    const dia = R.dia.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    abrirWhats([
      'Oi, Fornalha! Quero reservar uma mesa:', '',
      `Dia: ${dia}`, `Horário: ${R.hora}`, `Pessoas: ${R.pessoas}`, `Ocasião: ${fr.ocasiao.value}`,
      `Nome: ${fr.nome.value.trim()}`, `WhatsApp: ${fr.fone.value}`,
      ...(fr.obs.value.trim() ? [`Observação: ${fr.obs.value.trim()}`] : []),
    ].join('\n'));
    avisar('Reserva pronta no WhatsApp. É só enviar!');
  });

  /* ---------- começo ---------- */
  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  desenharSacola();
  mostrar(location.hash.slice(1) || 'inicio', false);
  if (VISTAS.includes(location.hash.slice(1))) requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  if (location.hash && !VISTAS.includes(location.hash.slice(1))) {
    const alvo = document.getElementById(location.hash.slice(1));
    const tela = alvo && alvo.closest('[data-vista]');
    if (tela) { mostrar(tela.dataset.vista, false); requestAnimationFrame(() => alvo.scrollIntoView({ block: 'center' })); }
  }
})();
