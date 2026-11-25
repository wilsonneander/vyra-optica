// Garoa Lava Car, modelo Silver: interações da página.
(() => {
  const D = {"whatsapp":"5531998124470","abertura":{"0":null,"1":[8,18],"2":[8,18],"3":[8,18],"4":[8,18],"5":[8,18],"6":[8,14]},"niveis":[{"id":"platina","nome":"Platina","precos":{"P":60,"M":70,"G":85}},{"id":"diamante","nome":"Diamante","precos":{"P":90,"M":105,"G":125}},{"id":"rubi","nome":"Rubi","precos":{"P":180,"M":210,"G":250}}],"planos":[{"id":"uber-pro","nome":"Uber Pro","precos":{"P":199,"M":229,"G":259}},{"id":"essencial","nome":"Cuidado Essencial","precos":{"P":279,"M":319,"G":359}},{"id":"avancado","nome":"Cuidado Avançado","precos":{"P":349,"M":399,"G":449}}]};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wa = (msg) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`;
  const fmt = (n, dec = 0) => n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });

  /* ---------- grupos com largura igual ---------- */
  const igualar = () => {
    $$('[data-iguais]').forEach((g) => {
      if (!g.offsetParent) return;
      g.classList.remove('medido');
      g.style.removeProperty('--larg');
      const maior = Math.max(...[...g.children].map((c) => c.offsetWidth));
      if (maior > 0) { g.style.setProperty('--larg', maior + 'px'); g.classList.add('medido'); }
    });
  };
  window.addEventListener('resize', () => { clearTimeout(igualar.t); igualar.t = setTimeout(igualar, 120); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(igualar);
  window.addEventListener('load', igualar);
  igualar();

  /* ---------- abertura ---------- */
  const abrir = () => {
    if (document.body.classList.contains('carregado')) return;
    document.body.classList.add('carregado');
    setTimeout(() => document.body.classList.add('pronto'), calmo ? 0 : 900);
  };
  setTimeout(abrir, calmo ? 0 : 1250);
  window.addEventListener('load', () => setTimeout(abrir, calmo ? 0 : 900));
  setTimeout(abrir, 2600); // garantia

  /* ---------- topo e menu ---------- */
  const topo = $('.topo');
  const sobe = $('.sobe-topo');
  let ultimoY = 0;
  const rolar = () => {
    const y = scrollY;
    topo.classList.toggle('solido', y > 40);
    topo.classList.toggle('some', y > 500 && y > ultimoY && !document.body.classList.contains('travado'));
    ultimoY = y;
    const h = document.documentElement.scrollHeight - innerHeight;
    sobe.classList.toggle('mostra', y > 700);
    sobe.style.setProperty('--prog', 132 - 132 * Math.min(1, y / (h || 1)));
  };
  addEventListener('scroll', rolar, { passive: true });
  rolar();

  const menu = $('#menu-mob');
  const menuBt = $('.menu-bt');
  const fechaMenu = () => { menu.hidden = true; menuBt.setAttribute('aria-expanded', 'false'); document.body.classList.remove('travado'); };
  menuBt.addEventListener('click', () => {
    menu.hidden = false; menuBt.setAttribute('aria-expanded', 'true'); document.body.classList.add('travado');
    $$('li', menu).forEach((li, i) => li.style.setProperty('--k', i));
    igualar();
  });
  $('.menu-fecha').addEventListener('click', fechaMenu);
  $$('a', menu).forEach((a) => a.addEventListener('click', fechaMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) fechaMenu(); });

  // link do menu marcado conforme a seção visível
  const links = $$('.nav a');
  const alvos = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const ioNav = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle('atual', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  alvos.forEach((s) => ioNav.observe(s));

  /* ---------- aberto ou fechado agora ---------- */
  const agora = new Date();
  const faixa = D.abertura[agora.getDay()];
  const hora = agora.getHours() + agora.getMinutes() / 60;
  const aberto = faixa && hora >= faixa[0] && hora < faixa[1];
  $$('[data-status]').forEach((el) => { el.textContent = aberto ? 'Aberto agora' : 'Fechado agora'; el.classList.toggle('fechado', !aberto); });
  $$('[data-ano]').forEach((el) => { el.textContent = agora.getFullYear(); });

  /* ---------- revelar ao rolar ---------- */
  $$('[data-palavras]').forEach((t) => $$('.pw', t).forEach((p, i) => p.firstElementChild.style.setProperty('--k', i)));
  $$('.compromissos, .numeros, .planos-grade').forEach((g) => $$('[data-revela]', g).forEach((el, i) => el.style.setProperty('--k', i)));
  const io = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visto');
    if (e.target.dataset.conta !== undefined) contar(e.target);
    io.unobserve(e.target);
  }), { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  $$('[data-palavras], [data-revela], .insta-fotos, [data-conta]').forEach((el) => io.observe(el));

  function contar(el) {
    const alvo = parseFloat(el.dataset.conta), dec = +el.dataset.dec || 0;
    if (calmo) { el.textContent = fmt(alvo, dec); return; }
    const t0 = performance.now(), dur = 1600;
    const passo = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(alvo * e, dec);
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  // número que rola até o novo valor (preços)
  function trocarNumero(el, novo) {
    const de = parseFloat(el.textContent.replace(/\./g, '')) || 0;
    if (calmo || de === novo) { el.textContent = fmt(novo); return; }
    const t0 = performance.now(), dur = 600;
    const passo = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round(de + (novo - de) * e));
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  /* ---------- paralaxe leve ---------- */
  const par = $$('[data-paralaxe]');
  if (!calmo && par.length && matchMedia('(min-width: 921px)').matches) {
    const mover = () => {
      par.forEach((el) => {
        const r = el.getBoundingClientRect();
        const c = r.top + r.height / 2 - innerHeight / 2;
        el.style.transform = `translateY(${(c * parseFloat(el.dataset.paralaxe)).toFixed(1)}px)`;
      });
    };
    addEventListener('scroll', () => requestAnimationFrame(mover), { passive: true });
    mover();
  }

  /* ---------- bolhas que seguem o mouse na capa ---------- */
  const capa = $('.capa');
  if (!calmo && capa && matchMedia('(pointer: fine)').matches) {
    let ultima = 0;
    capa.addEventListener('mousemove', (e) => {
      const t = performance.now();
      if (t - ultima < 70) return;
      ultima = t;
      const b = document.createElement('span');
      const s = 6 + Math.random() * 16;
      b.className = 'bolha-mouse';
      b.style.cssText = `left:${e.clientX - s / 2}px;top:${e.clientY - s / 2}px;width:${s}px;height:${s}px`;
      document.body.appendChild(b);
      setTimeout(() => b.remove(), 1400);
    });
  }

  /* ---------- troca de foto com o rodo passando ---------- */
  function trocarFoto(fotos, i) {
    const atual = fotos.find((f) => f.classList.contains('ativa'));
    const nova = fotos[i];
    if (atual === nova) return;
    fotos.forEach((f) => f.classList.remove('antiga'));
    if (atual) { atual.classList.remove('ativa'); atual.classList.add('antiga'); }
    void nova.offsetWidth;
    nova.classList.add('ativa');
  }

  /* ---------- lavagem técnica: níveis e porte ---------- */
  const abas = $$('[data-nivel]');
  const nivelFotos = $$('.nivel-foto > img');
  const etapas = $$('.etapas li');
  const agua = $('[data-agua]');
  let nivel = 0, porteNivel = 'M';
  const textoNivel = $('[data-nivel-texto]');
  const desenharNivel = () => {
    const n = D.niveis[nivel];
    abas.forEach((a, i) => a.setAttribute('aria-selected', i === nivel ? 'true' : 'false'));
    $('#painel-nivel').setAttribute('aria-labelledby', abas[nivel].id);
    trocarFoto(nivelFotos, nivel);
    $('[data-nivel-nome]').textContent = n.nome;
    $('[data-nivel-bt]').textContent = n.nome;
    textoNivel.textContent = abas[nivel].dataset.texto;
    etapas.forEach((li) => {
      const dentro = +li.dataset.min <= nivel;
      const estava = !li.classList.contains('fora');
      li.classList.toggle('fora', !dentro);
      li.classList.remove('entrou');
      if (dentro && !estava) { void li.offsetWidth; li.classList.add('entrou'); }
    });
    agua.style.setProperty('--nivel', ['36%', '64%', '94%'][nivel]);
    trocarNumero($('[data-nivel-preco]'), n.precos[porteNivel]);
    $('[data-nivel-wa]').href = wa(`Olá, Garoa! Quero agendar a lavagem ${n.nome}. Porte do carro: ${porteNivel}`);
  };
  abas.forEach((a, i) => a.addEventListener('click', () => { nivel = i; desenharNivel(); }));
  $('.nivel-abas').addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    nivel = (nivel + (e.key === 'ArrowRight' ? 1 : 2)) % 3;
    abas[nivel].focus(); desenharNivel();
  });
  $$('[data-porte-nivel]').forEach((b) => b.addEventListener('click', () => {
    porteNivel = b.dataset.porteNivel;
    $$('[data-porte-nivel]').forEach((x) => x.setAttribute('aria-checked', x === b ? 'true' : 'false'));
    desenharNivel();
  }));
  agua.style.setProperty('--nivel', '36%');

  /* ---------- acabamentos ---------- */
  const acabs = $$('.acab');
  const acabFotos = $$('.acab-moldura > img');
  const rodo = $('.acab-rodo');
  const largo = matchMedia('(min-width: 921px)');
  const ativarAcab = (i, alternar) => {
    acabs.forEach((li, j) => {
      const on = alternar && !largo.matches ? (j === i && !li.classList.contains('ativo')) : j === i;
      li.classList.toggle('ativo', on);
      li.querySelector('.acab-nome').setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    if (acabFotos[i] && !acabFotos[i].classList.contains('ativa')) {
      trocarFoto(acabFotos, i);
      if (!calmo) { rodo.classList.remove('passa'); void rodo.offsetWidth; rodo.classList.add('passa'); }
    }
  };
  acabs.forEach((li, i) => {
    li.querySelector('.acab-nome').addEventListener('click', () => ativarAcab(i, true));
    li.addEventListener('mouseenter', () => { if (largo.matches) ativarAcab(i, false); });
  });

  /* ---------- vídeos ---------- */
  const grande = $('[data-vid-grande]');
  const vidBt = $('[data-vid-bt]');
  const barra = $('[data-vid-barra]');
  const minis = $$('.vid-mini');
  let pausadoPeloUsuario = false;
  const tocar = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  const marcarBt = () => {
    vidBt.classList.toggle('parado', grande.paused);
    vidBt.setAttribute('aria-label', grande.paused ? 'Tocar vídeo' : 'Pausar vídeo');
  };
  grande.addEventListener('play', marcarBt);
  grande.addEventListener('pause', marcarBt);
  grande.addEventListener('timeupdate', () => { if (grande.duration) barra.style.width = (grande.currentTime / grande.duration * 100) + '%'; });
  vidBt.addEventListener('click', () => {
    if (grande.paused) { pausadoPeloUsuario = false; tocar(grande); } else { pausadoPeloUsuario = true; grande.pause(); }
  });
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !pausadoPeloUsuario && !calmo) tocar(grande); else if (!e.isIntersecting) grande.pause();
  }, { threshold: 0.35 }).observe(grande);
  marcarBt();
  minis.forEach((m) => {
    const v = m.querySelector('video');
    m.addEventListener('mouseenter', () => { if (!calmo) tocar(v); });
    m.addEventListener('mouseleave', () => { v.pause(); });
    m.addEventListener('click', () => {
      if (m.classList.contains('ativo')) return;
      minis.forEach((x) => x.classList.toggle('ativo', x === m));
      grande.classList.add('troca');
      setTimeout(() => {
        grande.src = m.dataset.src;
        $('[data-vid-t]').textContent = m.dataset.t;
        $('[data-vid-d]').textContent = m.dataset.d;
        pausadoPeloUsuario = false;
        grande.addEventListener('loadeddata', () => grande.classList.remove('troca'), { once: true });
        tocar(grande);
      }, 350);
      if (!largo.matches) grande.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth', block: 'center' });
    });
  });

  /* ---------- antes e depois ---------- */
  const comp = $('[data-comp]');
  const range = $('.comp-range', comp);
  const setP = (v) => comp.style.setProperty('--p', v + '%');
  range.addEventListener('input', () => setP(range.value));
  range.addEventListener('pointerdown', () => comp.classList.add('arrastando'));
  addEventListener('pointerup', () => comp.classList.remove('arrastando'));
  // dica de movimento na primeira vez que aparece
  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting || calmo) return;
    obs.disconnect();
    const quadros = [[50, 0], [80, 700], [22, 1500], [50, 2200]];
    const t0 = performance.now();
    const anim = (t) => {
      const dt = t - t0;
      let i = quadros.findIndex(([, ms]) => ms > dt);
      if (i === -1) { setP(50); range.value = 50; return; }
      const [a, ta] = quadros[i - 1], [b, tb] = quadros[i];
      const k = (dt - ta) / (tb - ta), ee = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const v = a + (b - a) * ee;
      setP(v); range.value = v;
      if (!comp.classList.contains('arrastando')) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  }, { threshold: 0.5 }).observe(comp);
  const adAbas = $$('[data-ad]');
  adAbas.forEach((b) => b.addEventListener('click', () => {
    if (b.getAttribute('aria-selected') === 'true') return;
    adAbas.forEach((x) => x.setAttribute('aria-selected', x === b ? 'true' : 'false'));
    comp.classList.add('trocando');
    setTimeout(() => {
      const depois = $('.comp-depois', comp), antes = $('.comp-antes img', comp);
      depois.src = b.dataset.depois; depois.alt = `Depois: ${b.dataset.alt} limpos`;
      antes.src = b.dataset.antes; antes.alt = `Antes: ${b.dataset.alt} sujos`;
      let carregadas = 0;
      const pronto = () => { if (++carregadas === 2) comp.classList.remove('trocando'); };
      [depois, antes].forEach((img) => (img.complete ? pronto() : img.addEventListener('load', pronto, { once: true })));
    }, 380);
  }));

  /* ---------- planos: porte ---------- */
  $$('[data-porte]').forEach((b) => b.addEventListener('click', () => {
    const p = b.dataset.porte;
    $$('[data-porte]').forEach((x) => x.setAttribute('aria-checked', x === b ? 'true' : 'false'));
    D.planos.forEach((pl) => {
      trocarNumero($(`[data-preco-plano="${pl.id}"]`), pl.precos[p]);
      $(`[data-wa-plano="${pl.id}"]`).href = wa(`Olá, Garoa! Quero assinar o plano ${pl.nome}. Porte do carro: ${p}`);
    });
  }));

  /* ---------- avaliações ---------- */
  const janela = $('[data-aval]');
  const trilho = $('.aval-trilho', janela);
  const cartoes = $$('.aval', trilho);
  const prog = $('.aval-prog span', janela);
  let pos = 0, timer;
  const porVez = () => (innerWidth <= 640 ? 1 : 2);
  const ir = (n) => {
    const max = cartoes.length - porVez();
    pos = n > max ? 0 : n < 0 ? max : n;
    const passo = cartoes[0].offsetWidth + 20;
    trilho.style.transform = `translateX(${-pos * passo}px)`;
    reiniciar();
  };
  const reiniciar = () => {
    clearTimeout(timer);
    prog.classList.remove('anda'); prog.style.width = '0';
    if (calmo) return;
    void prog.offsetWidth; prog.classList.add('anda'); prog.style.width = '';
    timer = setTimeout(() => ir(pos + 1), 6000);
  };
  $('[data-aval-prox]').addEventListener('click', () => ir(pos + 1));
  $('[data-aval-ant]').addEventListener('click', () => ir(pos - 1));
  let x0 = null;
  janela.addEventListener('pointerdown', (e) => { x0 = e.clientX; janela.classList.add('arrastando'); });
  addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null; janela.classList.remove('arrastando');
    if (Math.abs(dx) > 50) ir(pos + (dx < 0 ? 1 : -1));
  });
  janela.addEventListener('mouseenter', () => { clearTimeout(timer); prog.classList.remove('anda'); });
  janela.addEventListener('mouseleave', reiniciar);
  addEventListener('resize', () => ir(Math.min(pos, cartoes.length - porVez())));
  new IntersectionObserver(([e], obs) => { if (e.isIntersecting) { reiniciar(); obs.disconnect(); } }).observe(janela);

  /* ---------- FAQ: uma aberta por vez ---------- */
  const faqs = $$('.faq details');
  faqs.forEach((d) => d.addEventListener('toggle', () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));

  /* ---------- formulário ---------- */
  const form = $('[data-form]');
  const fone = $('[data-mascara]', form);
  fone.addEventListener('input', () => {
    const d = fone.value.replace(/\D/g, '').slice(0, 11);
    fone.value = d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`
      : d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
      : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
  });
  const hoje = new Date(); hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
  form.data.min = hoje.toISOString().slice(0, 10);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const aviso = $('[data-aviso]', form);
    const obrig = ['nome', 'fone', 'carro', 'servico', 'data'];
    let ok = true;
    obrig.forEach((n) => {
      const el = form[n];
      const bom = n === 'fone' ? el.value.replace(/\D/g, '').length >= 10 : el.value.trim() !== '';
      el.classList.toggle('erro', !bom);
      if (!bom) ok = false;
    });
    if (!ok) { aviso.textContent = 'Preencha os campos destacados pra gente montar sua mensagem.'; return; }
    const [a, m, d] = form.data.value.split('-');
    const msg = `Olá, Garoa! Quero agendar.\n\nNome: ${form.nome.value.trim()}\nWhatsApp: ${form.fone.value}\nCarro: ${form.carro.value.trim()} (porte ${form.porte.value})\nServiço: ${form.servico.value}\nData: ${d}/${m}/${a}, ${form.periodo.value.toLowerCase()}${form.busca.checked ? '\nQuero o leva e traz.' : ''}`;
    aviso.textContent = 'Abrindo o WhatsApp com a mensagem pronta...';
    window.open(wa(msg), '_blank', 'noopener');
  });
  $$('input, select', form).forEach((el) => el.addEventListener('input', () => el.classList.remove('erro')));
})();

/* ---------- tema claro ou escuro (pílula na lateral e no menu do celular) ---------- */
(() => {
  const raiz = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  let fim;
  const marca = () => {
    document.querySelectorAll('[data-tema-ir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaIr === raiz.dataset.tema)));
    if (meta) meta.content = raiz.dataset.tema === 'claro' ? '#0A1322' : '#0A1322';
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tema-ir]');
    if (!b || b.dataset.temaIr === raiz.dataset.tema) return;
    // tema-anim liga a passagem suave das cores só durante a troca
    raiz.classList.add('tema-anim');
    raiz.dataset.tema = b.dataset.temaIr;
    try { localStorage.setItem('garoa-tema', raiz.dataset.tema); } catch (err) { /* sem armazenamento, vale só nesta visita */ }
    marca();
    clearTimeout(fim);
    fim = setTimeout(() => raiz.classList.remove('tema-anim'), 800);
  });
  marca();
})();
