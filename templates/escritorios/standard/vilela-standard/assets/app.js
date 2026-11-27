// Vilela Standard: interações das quatro páginas. Sem biblioteca.
// Carregando e cortina entre páginas, topo, "Aberto agora", revelar ao rolar, lista de áreas com foto que segue o mouse,
// linha do tempo do atendimento, números, carrossel, equipe em abas, galeria, filtros, agendamento, formulários, FAQ,
// políticas, conteúdos, janelas legais e cookies. O script do tema é acrescentado pelo build.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const raiz = document.documentElement;
  const D = JSON.parse($('#vr-dados').textContent);
  const parado = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const comMouse = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const guarda = {
    ler(k, padrao) { try { return JSON.parse(localStorage.getItem(k)) ?? padrao; } catch (e) { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento, vale só nesta visita */ } },
  };
  const sessao = {
    ler(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    gravar(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* idem */ } },
  };
  const wa = (msg) => `https://wa.me/${D.wa}?text=${encodeURIComponent(msg)}`;
  const RELOGIO = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';

  // ---------- carregando (uma vez por visita) ----------
  const libera = () => raiz.classList.add('pronto');
  const cg = $('.carregando');
  if (raiz.classList.contains('sem-cg') || !cg) libera();
  else {
    sessao.gravar('vilela-cg', '1');
    const inicio = performance.now();
    const fecha = () => {
      const espera = Math.max(0, 2300 - (performance.now() - inicio));
      setTimeout(() => {
        cg.classList.add('sai');
        setTimeout(libera, 250);
        setTimeout(() => cg.remove(), 1100);
      }, espera);
    };
    Promise.race([
      Promise.all([document.fonts.ready, new Promise((ok) => (document.readyState === 'complete' ? ok() : addEventListener('load', ok, { once: true })))]),
      new Promise((ok) => setTimeout(ok, 4200)),
    ]).then(fecha);
  }

  // ---------- cortina entre páginas ----------
  if (raiz.classList.contains('chegando')) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      raiz.classList.add('chegou');
      raiz.classList.remove('chegando');
      setTimeout(() => raiz.classList.remove('chegou'), 1000);
    }));
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || parado || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname) return; // âncora na mesma página: rolagem normal
    e.preventDefault();
    raiz.classList.add('saindo');
    sessao.gravar('vilela-troca', '1');
    setTimeout(() => { location.href = url.href; }, 560);
  });
  // ao voltar pelo histórico, a página pode vir da memória com a cortina fechada
  addEventListener('pageshow', (e) => { if (e.persisted) raiz.classList.remove('saindo', 'chegando', 'chegou'); });

  // ---------- topo e menu do celular ----------
  const topo = $('[data-topo]');
  const marcaTopo = () => topo.classList.toggle('rolou', scrollY > 10);
  addEventListener('scroll', marcaTopo, { passive: true });
  marcaTopo();
  const menuBtn = $('[data-menu]');
  const menu = $('#menu-cel');
  const abreMenu = (abrir) => {
    menuBtn.setAttribute('aria-expanded', String(abrir));
    menuBtn.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    menu.hidden = !abrir;
  };
  menuBtn.addEventListener('click', () => abreMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) abreMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { abreMenu(false); menuBtn.focus(); } });

  // ---------- aberto agora ----------
  const hm = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const fala = (t) => t.replace(/^0/, '').replace(':00', 'h').replace(':', 'h');
  const status = () => {
    const agora = new Date();
    const hoje = D.horario[agora.getDay()];
    const min = agora.getHours() * 60 + agora.getMinutes();
    if (hoje && min >= hm(hoje[0]) && min < hm(hoje[1])) return `${RELOGIO}<span><b>Aberto agora</b>, até ${fala(hoje[1])}</span>`;
    for (let i = 0; i < 7; i++) {
      const d = new Date(agora); d.setDate(d.getDate() + i);
      const h = D.horario[d.getDay()];
      if (!h || (i === 0 && min >= hm(h[0]))) continue;
      const quando = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : d.toLocaleDateString('pt-BR', { weekday: 'long' });
      return `${RELOGIO}<span>Fechado agora. Abre ${quando} às ${fala(h[0])}</span>`;
    }
    return '';
  };
  $$('[data-aberto]').forEach((el) => { el.innerHTML = status(); el.classList.toggle('sim', el.innerHTML.includes('Aberto')); });
  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // ---------- revelar ao rolar (uma vez) ----------
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('visto'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('[data-rev]').forEach((el) => (parado ? el.classList.add('visto') : io.observe(el)));

  // ---------- capa: fotos pequenas acompanham o mouse ----------
  const arte = $('[data-capa-arte]');
  if (arte && comMouse && !parado) {
    const minis = $$('[data-prof]', arte);
    addEventListener('mousemove', (e) => {
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      minis.forEach((m) => { const p = Number(m.dataset.prof) * 14; m.style.setProperty('--mx', `${x * p}px`); m.style.setProperty('--my', `${y * p}px`); });
    }, { passive: true });
  }

  // ---------- lista de áreas: a foto segue o mouse ----------
  const lista = $('[data-lista-areas]');
  const flutua = $('[data-la-flutua]');
  if (lista && flutua && comMouse) {
    const img = $('img', flutua);
    let alvoX = 0, alvoY = 0, x = 0, y = 0, rodando = false;
    const anda = () => {
      x += (alvoX - x) * 0.16; y += (alvoY - y) * 0.16;
      flutua.style.transform = `translate(${x}px, ${y}px)`;
      rodando = flutua.classList.contains('ver') || Math.abs(alvoX - x) > 0.5;
      if (rodando) requestAnimationFrame(anda);
    };
    lista.addEventListener('mousemove', (e) => {
      alvoX = e.clientX + 24; alvoY = e.clientY - 100;
      if (!rodando) { x = alvoX; y = alvoY; rodando = true; requestAnimationFrame(anda); }
    });
    $$('a', lista).forEach((a) => a.addEventListener('mouseenter', () => { img.src = a.dataset.foto; flutua.classList.add('ver'); }));
    lista.addEventListener('mouseleave', () => flutua.classList.remove('ver'));
  }

  // ---------- linha do tempo do atendimento ----------
  const linhas = $$('[data-linha]');
  if (linhas.length) {
    const mede = () => linhas.forEach((l) => {
      const r = l.getBoundingClientRect();
      const meio = innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (meio - r.top) / r.height));
      l.style.setProperty('--prog', parado ? 1 : p.toFixed(3));
      $$('[data-etapa]', l).forEach((et) => et.classList.toggle('ativa', parado || et.getBoundingClientRect().top < meio));
    });
    let pedido = false;
    addEventListener('scroll', () => { if (!pedido) { pedido = true; requestAnimationFrame(() => { mede(); pedido = false; }); } }, { passive: true });
    addEventListener('resize', mede);
    mede();
  }

  // ---------- números que contam ----------
  const conta = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (!en.isIntersecting) return;
    conta.unobserve(en.target);
    const el = en.target, fim = Number(el.dataset.conta), ano = el.hasAttribute('data-ano-conta');
    const ini = ano ? fim - 15 : 0;
    if (parado) return;
    const t0 = performance.now();
    const passo = (t) => {
      const k = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round(ini + (fim - ini) * (1 - (1 - k) ** 3));
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }), { threshold: 0.6 });
  $$('[data-conta]').forEach((el) => conta.observe(el));

  // ---------- carrossel: setas, barras, arrastar, pausa com o mouse ----------
  $$('[data-carrossel]').forEach((car) => {
    const trilho = $('[data-trilho]', car);
    const slides = [...trilho.children];
    const barras = $$('[data-ir]', car);
    const DUR = 5000;
    let atual = 0, timer, inicioX = null, delta = 0;
    car.style.setProperty('--dur', `${DUR}ms`);
    const vai = (i) => {
      atual = (i + slides.length) % slides.length;
      trilho.style.translate = `${-atual * 100}% 0`;
      slides.forEach((s, j) => { s.classList.toggle('atual', j === atual); s.setAttribute('aria-hidden', String(j !== atual)); });
      barras.forEach((b, j) => {
        b.classList.toggle('feito', j < atual);
        b.classList.remove('atual'); void b.offsetWidth;
        b.classList.toggle('atual', j === atual);
        b.setAttribute('aria-current', String(j === atual));
      });
      agenda();
    };
    const agenda = () => { clearTimeout(timer); if (!parado && !car.classList.contains('pausado')) timer = setTimeout(() => vai(atual + 1), DUR); };
    $('[data-ant]', car).addEventListener('click', () => vai(atual - 1));
    $('[data-prox]', car).addEventListener('click', () => vai(atual + 1));
    barras.forEach((b) => b.addEventListener('click', () => vai(Number(b.dataset.ir))));
    car.addEventListener('mouseenter', () => { car.classList.add('pausado'); clearTimeout(timer); });
    car.addEventListener('mouseleave', () => { car.classList.remove('pausado'); vai(atual); });
    car.addEventListener('focusin', () => { car.classList.add('pausado'); clearTimeout(timer); });
    car.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') vai(atual - 1); if (e.key === 'ArrowRight') vai(atual + 1); });
    car.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; inicioX = e.clientX; delta = 0; car.classList.add('arrastando'); car.setPointerCapture(e.pointerId); });
    car.addEventListener('pointermove', (e) => {
      if (inicioX === null) return;
      delta = e.clientX - inicioX;
      trilho.style.translate = `calc(${-atual * 100}% + ${delta}px) 0`;
    });
    const solta = () => {
      if (inicioX === null) return;
      car.classList.remove('arrastando');
      inicioX = null;
      vai(Math.abs(delta) > 60 ? atual + (delta < 0 ? 1 : -1) : atual);
    };
    car.addEventListener('pointerup', solta);
    car.addEventListener('pointercancel', solta);
    vai(0);
  });

  // ---------- abas com teclado (equipe e políticas) ----------
  const abas = (grupo, aoTrocar) => {
    const botoes = $$('[role="tab"]', grupo);
    const ativa = (b, foco) => {
      botoes.forEach((x) => { const sim = x === b; x.setAttribute('aria-selected', String(sim)); x.tabIndex = sim ? 0 : -1; $(`#${x.getAttribute('aria-controls')}`).hidden = !sim; });
      if (foco) b.focus();
      aoTrocar?.(b);
    };
    botoes.forEach((b, i) => {
      b.addEventListener('click', () => ativa(b));
      b.addEventListener('keydown', (e) => {
        const passo = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (passo) { e.preventDefault(); ativa(botoes[(i + passo + botoes.length) % botoes.length], true); }
      });
    });
    return ativa;
  };
  const gEq = $('.eq-abas');
  if (gEq) {
    const ativaEq = abas(gEq);
    const pedido = new URLSearchParams(location.search).get('adv');
    const alvo = pedido && $(`[data-adv="${pedido}"]`, gEq);
    if (alvo) ativaEq(alvo);
  }
  const gPol = $('.pol-abas');
  if (gPol) abas(gPol);

  // ---------- frase que acende palavra por palavra ----------
  const frase = $('[data-frase]');
  if (frase) {
    const destaque = ['explicamos', 'antes', 'de', 'agir.'];
    frase.innerHTML = frase.textContent.split(' ').map((p) => `<span${destaque.includes(p) ? ' class="destaque"' : ''}>${p}</span>`).join(' ');
    const palavras = $$('span', frase);
    const acende = () => {
      const r = frase.getBoundingClientRect();
      const p = parado ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
      const n = Math.round(p * palavras.length);
      palavras.forEach((w, i) => w.classList.toggle('aceso', i < n));
    };
    addEventListener('scroll', () => requestAnimationFrame(acende), { passive: true });
    acende();
  }

  // ---------- filtro genérico (botões com aria-pressed) ----------
  const filtro = (grupo, chave, itens, aoFiltrar) => {
    const botoes = $$('button', grupo);
    const aplica = (valor) => {
      botoes.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset[chave] === valor)));
      itens().forEach((el) => {
        const mostra = valor === 'todas' || el.dataset[chave] === valor;
        el.classList.toggle('some', !mostra);
        el.classList.remove('entra');
        if (mostra && !parado) { void el.offsetWidth; el.classList.add('entra'); }
      });
      aoFiltrar?.(valor);
    };
    botoes.forEach((b) => b.addEventListener('click', () => aplica(b.dataset[chave])));
    return aplica;
  };

  // galeria por categoria e foto ampliada
  const fGal = $('[data-filtro-gal]');
  if (fGal) filtro(fGal, 'cat', () => $$('.gal-grade li'));
  const janFoto = $('[data-jan-foto]');
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ampliar]');
    if (!b) return;
    $('[data-jf-img]', janFoto).src = b.dataset.ampliar;
    $('[data-jf-img]', janFoto).alt = b.dataset.leg;
    $('[data-jf-leg]', janFoto).textContent = b.dataset.leg;
    janFoto.showModal();
  });

  // serviços por área (com âncora vinda de outra página: atuacao.html#civel)
  const fServ = $('[data-filtro-serv]');
  if (fServ) {
    const aplicaServ = filtro(fServ, 'area', () => $$('.serv'));
    const vaiArea = (id) => {
      if (!D.areas.some((a) => a.id === id)) return false;
      aplicaServ(id);
      $('#servicos').scrollIntoView({ behavior: parado ? 'auto' : 'smooth' });
      return true;
    };
    $$('[data-ir-area]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); vaiArea(a.dataset.irArea); history.replaceState(null, '', `#${a.dataset.irArea}`); }));
    const hash = location.hash.slice(1);
    if (hash) setTimeout(() => vaiArea(hash), 80);
  }

  // ---------- conteúdos: filtro, ver mais e janela do artigo ----------
  const fBlog = $('[data-filtro-blog]');
  if (fBlog) {
    const VISIVEIS = 4;
    const verMais = $('[data-ver-mais]');
    let tudo = false;
    const limita = (valor) => {
      const vis = $$('[data-blog] .art').filter((a) => !a.classList.contains('some'));
      vis.forEach((a, i) => { if (!tudo && valor === 'todas' && i >= VISIVEIS) a.classList.add('some'); });
      verMais.hidden = tudo || valor !== 'todas';
      $('[data-blog-vazio]').hidden = vis.length > 0;
    };
    const aplicaBlog = filtro(fBlog, 'area', () => $$('[data-blog] .art'), limita);
    verMais.addEventListener('click', () => { tudo = true; aplicaBlog('todas'); });
    aplicaBlog('todas');
  }
  const janArt = $('[data-jan-art]');
  if (janArt) {
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-art]');
      if (!b) return;
      const a = D.artigos.find((x) => x.id === b.dataset.art);
      $('[data-ja-foto]', janArt).src = a.foto;
      $('[data-ja-area]', janArt).textContent = a.areaNome;
      $('[data-ja-tit]', janArt).textContent = a.titulo;
      $('[data-ja-meta]', janArt).textContent = `Por ${a.autorNome}, ${a.autorOab}. ${a.dataTexto}. Leitura de ${a.leitura} minutos.`;
      $('[data-ja-corpo]', janArt).replaceChildren(...a.corpo.map((t) => Object.assign(document.createElement('p'), { textContent: t })));
      janArt.showModal();
    });
  }

  // ---------- FAQ em acordeão ----------
  $$('[data-faq] .faq-item button').forEach((b) => b.addEventListener('click', () => {
    const item = b.closest('.faq-item');
    const abrir = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(abrir));
    item.classList.toggle('aberto', abrir);
  }));

  // ---------- janelas: legais, foto, artigo ----------
  document.addEventListener('click', (e) => {
    const l = e.target.closest('[data-legal]');
    if (l) { e.preventDefault(); $$('dialog[open]').forEach((d) => d.close()); $(`[data-jan-legal="${l.dataset.legal}"]`).showModal(); return; }
    if (e.target.closest('[data-fechar]')) { e.target.closest('dialog').close(); return; }
    if (e.target.tagName === 'DIALOG') e.target.close(); // clique no fundo
  });

  // ---------- formulários ----------
  const mascara = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };
  $$('[data-mascara]').forEach((i) => i.addEventListener('input', () => { i.value = mascara(i.value); }));
  const valida = (form) => {
    let primeiro = null;
    $$('input, select, textarea', form).forEach((c) => {
      let ok = c.checkValidity();
      if (ok && c.type === 'email' && c.value) ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.value);
      if (ok && c.hasAttribute('data-mascara')) ok = c.value.replace(/\D/g, '').length >= 10;
      if (c.type !== 'radio' && c.type !== 'hidden') c.setAttribute('aria-invalid', String(!ok));
      if (!ok && !primeiro) primeiro = c;
    });
    return primeiro;
  };
  const erro = (form, campo) => {
    const msg = $('[data-msg]', form);
    msg.classList.remove('ok');
    msg.textContent = campo.name === 'lgpd' ? 'Para enviar, é preciso aceitar a Política de privacidade.' : 'Confira os campos destacados antes de enviar.';
    campo.focus();
  };

  // contato: confirma na tela, guarda nada e oferece o WhatsApp só com nome e assunto
  $$('[data-contato]').forEach((form) => {
    const txt = $('textarea', form), cont = $('[data-contador]', form);
    txt.addEventListener('input', () => { cont.textContent = `${txt.value.length} de ${txt.maxLength}`; });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ruim = valida(form);
      if (ruim) return erro(form, ruim);
      const f = new FormData(form);
      const protocolo = `VR-${Date.now().toString(36).slice(-6).toUpperCase()}`;
      $('[data-msg]', form).textContent = '';
      $('[data-protocolo]', form).textContent = protocolo;
      $('[data-ok-wa]', form).href = wa(`Olá! Sou ${f.get('nome')} e enviei pelo site um pedido de contato sobre ${f.get('assunto')} (protocolo ${protocolo}).`);
      $$('.form-grade, .opcoes, .campo, .sigilo, .aceite, button[type="submit"]', form).forEach((el) => { el.hidden = true; });
      $('[data-ok]', form).hidden = false;
      // aqui entra o envio para o e-mail ou o sistema do escritório; na demonstração nada sai do navegador
    });
  });

  // novidades por e-mail: só confirma na tela
  $$('[data-news]').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ruim = valida(form);
    if (ruim) return erro(form, ruim);
    const msg = $('[data-msg]', form);
    msg.classList.add('ok');
    msg.textContent = `Pronto, ${new FormData(form).get('nome')}. O próximo conteúdo chega no seu e-mail.`;
    form.reset();
  }));

  // ---------- agendamento: área, advogado, formato, dia e horário ----------
  const ag = $('[data-agenda]');
  if (ag) {
    const advsBox = $('[data-ag-advs]', ag), diasBox = $('[data-ag-dias]', ag), horasBox = $('[data-ag-horas]', ag);
    const resumo = (campo, texto) => { const dd = $(`[data-r="${campo}"]`); if (dd.textContent === texto) return; dd.textContent = texto; dd.classList.remove('muda'); void dd.offsetWidth; dd.classList.add('muda'); };
    const escolha = { area: null, adv: null, dia: null, hora: null };
    const fotoAdv = (id) => `assets/img/fotos/equipe-${id}.webp`;
    const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
    // ocupação fixa da demonstração por advogado, dia e hora; na versão do cliente, consultar a agenda real
    const ocupado = (adv, d, h) => ((adv.length * 7 + d.getDate() * 3 + h * 5) % 9) < 3;

    const montaAdvs = () => {
      const lista = D.equipe.filter((p) => p.areas.includes(escolha.area));
      advsBox.innerHTML = lista.map((p) => `<label><input type="radio" name="adv" value="${p.id}" required><span><img src="${fotoAdv(p.id)}" alt="" width="40" height="40"><span>${p.nome}<small>${p.oab}</small></span></span></label>`).join('');
      escolha.adv = null;
      const pedido = new URLSearchParams(location.search).get('adv');
      const auto = lista.length === 1 ? lista[0].id : lista.find((p) => p.id === pedido)?.id;
      if (auto) { $(`input[value="${auto}"]`, advsBox).checked = true; escolhaAdv(auto); } else { resumo('adv', 'Escolha o advogado'); montaDias(); }
    };
    const escolhaAdv = (id) => { escolha.adv = id; resumo('adv', D.equipe.find((p) => p.id === id).nome); montaDias(); };

    const montaDias = () => {
      escolha.dia = null; escolha.hora = null;
      resumo('quando', 'Escolha dia e horário');
      horasBox.innerHTML = '<p class="ag-dica">Escolha o dia.</p>';
      if (!escolha.adv) { diasBox.innerHTML = '<p class="ag-dica">Escolha o advogado para ver os dias livres.</p>'; return; }
      const p = D.equipe.find((x) => x.id === escolha.adv);
      const dias = [];
      for (let i = 1; dias.length < 10 && i < 40; i++) {
        const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i);
        if (p.agenda.includes(d.getDay()) && D.horario[d.getDay()]) dias.push(d);
      }
      diasBox.innerHTML = dias.map((d) => `<button type="button" aria-pressed="false" data-dia="${d.toISOString()}">${DIAS[d.getDay()]}<small>${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}</small></button>`).join('');
    };
    const montaHoras = () => {
      const d = new Date(escolha.dia);
      const [ini, fim] = D.horario[d.getDay()].map(hm);
      const horas = [];
      for (let m = Math.ceil(ini / 60) * 60; m + 50 <= fim; m += 60) if (m !== 12 * 60) horas.push(m);
      horasBox.innerHTML = horas.map((m) => `<button type="button" aria-pressed="false" data-hora="${m}"${ocupado(escolha.adv, d, m / 60) ? ' disabled aria-label="Ocupado"' : ''}>${String(m / 60).padStart(2, '0')}:00</button>`).join('');
    };

    ag.addEventListener('change', (e) => {
      const c = e.target;
      if (c.name === 'area') {
        escolha.area = c.value;
        resumo('area', D.areas.find((a) => a.id === c.value).nome);
        $('[data-ag-serv]', ag).hidden = true;
        ag.servico.value = '';
        montaAdvs();
      }
      if (c.name === 'adv') escolhaAdv(c.value);
      if (c.name === 'formato') resumo('formato', c.value);
    });
    diasBox.addEventListener('click', (e) => {
      const b = e.target.closest('[data-dia]');
      if (!b) return;
      $$('[data-dia]', diasBox).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      escolha.dia = b.dataset.dia; escolha.hora = null;
      resumo('quando', new Date(escolha.dia).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }));
      montaHoras();
    });
    horasBox.addEventListener('click', (e) => {
      const b = e.target.closest('[data-hora]');
      if (!b || b.disabled) return;
      $$('[data-hora]', horasBox).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      escolha.hora = Number(b.dataset.hora);
      resumo('quando', `${new Date(escolha.dia).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}, às ${escolha.hora / 60}h`);
    });

    // "Agendar sobre este assunto" nos cards de serviço
    $$('[data-agendar-area]').forEach((b) => b.addEventListener('click', () => {
      const r = $(`input[name="area"][value="${b.dataset.agendarArea}"]`, ag);
      r.checked = true;
      r.dispatchEvent(new Event('change', { bubbles: true }));
      ag.servico.value = b.dataset.agendarServ;
      const aviso = $('[data-ag-serv]', ag);
      aviso.textContent = `Serviço: ${b.dataset.agendarServ}`;
      aviso.hidden = false;
      $('#agendar').scrollIntoView({ behavior: parado ? 'auto' : 'smooth' });
    }));

    // advogado escolhido na página da equipe (atuacao.html?adv=helena#agendar): abre na primeira área dele
    const pedido = new URLSearchParams(location.search).get('adv');
    const adv = D.equipe.find((p) => p.id === pedido);
    if (adv) {
      const r = $(`input[name="area"][value="${adv.areas[0]}"]`, ag);
      r.checked = true;
      r.dispatchEvent(new Event('change', { bubbles: true }));
    }

    ag.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = $('[data-msg]', ag);
      const ruim = valida(ag);
      if (!escolha.area || !escolha.adv) { msg.textContent = 'Escolha a área e o advogado.'; return; }
      if (!escolha.dia || escolha.hora === null) { msg.textContent = 'Escolha o dia e o horário da reunião.'; return; }
      if (ruim) return erro(ag, ruim);
      const f = new FormData(ag);
      const p = D.equipe.find((x) => x.id === escolha.adv);
      const quando = `${new Date(escolha.dia).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}, às ${escolha.hora / 60}h`;
      const texto = [
        `Olá! Gostaria de marcar uma reunião pelo site da ${D.marca}.`,
        `Área: ${D.areas.find((a) => a.id === escolha.area).nome}${f.get('servico') ? ` (${f.get('servico')})` : ''}`,
        `Advogado: ${p.nome}`,
        `Formato: ${f.get('formato')}`,
        `Quando: ${quando}`,
        `Nome: ${f.get('nome')}`,
        `WhatsApp: ${f.get('fone')}`,
      ].join('\n');
      msg.classList.add('ok');
      msg.textContent = 'Pedido pronto. A conversa do WhatsApp abriu numa nova aba; é só enviar.';
      window.open(wa(texto), '_blank', 'noopener');
    });
  }

  // ---------- cookies ----------
  const ck = $('#cookies');
  if (ck) {
    const mostra = () => { ck.hidden = false; };
    if (!guarda.ler('vilela-cookies', null)) mostra();
    $$('[data-ck]', ck).forEach((b) => b.addEventListener('click', () => {
      guarda.gravar('vilela-cookies', { escolha: b.dataset.ck, em: new Date().toISOString() });
      ck.hidden = true;
      // a medição de visitas, quando existir, só é ligada aqui com escolha "todos"
    }));
    $$('[data-cookies]').forEach((b) => b.addEventListener('click', mostra));
  }
})();

/* ---------- tema claro ou escuro (balança na lateral e no topo do celular) ---------- */
(() => {
  const raiz = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  let fim;
  const marca = () => {
    document.querySelectorAll('[data-tema-ir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaIr === raiz.dataset.tema)));
    if (meta) meta.content = raiz.dataset.tema === 'claro' ? '#EEF1F2' : '#0D171F';
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tema-ir]');
    if (!b) return;
    // clicar no prato que já está embaixo só faz a balança oscilar
    if (b.dataset.temaIr === raiz.dataset.tema) {
      const bal = b.closest('.tema-balanca');
      bal.classList.remove('tb-oscila'); void bal.offsetWidth; bal.classList.add('tb-oscila');
      return;
    }
    // tema-anim liga a passagem suave das cores só durante a troca
    raiz.classList.add('tema-anim');
    raiz.dataset.tema = b.dataset.temaIr;
    try { localStorage.setItem('vilela-tema', raiz.dataset.tema); } catch (err) { /* sem armazenamento, vale só nesta visita */ }
    marca();
    clearTimeout(fim);
    fim = setTimeout(() => raiz.classList.remove('tema-anim'), 800);
  });
  marca();
})();
