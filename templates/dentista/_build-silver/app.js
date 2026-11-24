// Raiz Odontologia, Silver: comportamento da página (sem biblioteca).
(() => {
  const D = JSON.parse(document.getElementById('dados').textContent);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const raiz = document.documentElement;
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wa = (msg) => `https://wa.me/${D.wa}?text=${encodeURIComponent(msg)}`;
  const icCheck = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>';

  // ---------- grupos com a mesma largura (regra das diretrizes) ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    g.style.removeProperty('--larg');
    const filhos = [...g.children];
    filhos.forEach((f) => { f.style.width = 'max-content'; });
    const maior = Math.max(...filhos.map((f) => f.getBoundingClientRect().width));
    filhos.forEach((f) => { f.style.width = ''; });
    g.style.setProperty('--larg', `${Math.ceil(maior)}px`);
  });
  iguala();
  document.fonts?.ready.then(iguala);
  let tIg; addEventListener('resize', () => { clearTimeout(tIg); tIg = setTimeout(iguala, 150); });

  // título do hero sobe palavra por palavra quando as fontes chegam
  const pronto = () => raiz.classList.add('pronto');
  (document.fonts?.ready || Promise.resolve()).then(() => requestAnimationFrame(pronto));
  setTimeout(pronto, 1200);

  // ---------- topo ----------
  const topo = $('[data-topo]');
  const heroQ = $('[data-hero]');
  const links = $$('.menu a');
  const secoes = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const aoRolar = () => {
    const limite = heroQ ? heroQ.offsetHeight - 90 : 80;
    topo.classList.toggle('solido', scrollY > limite);
    let atual = null; let maior = -Infinity;
    secoes.forEach((s) => { const t = s.getBoundingClientRect().top; if (t < innerHeight * 0.4 && t > maior) { maior = t; atual = s.id; } });
    links.forEach((a) => a.classList.toggle('ativo', a.getAttribute('href') === `#${atual}`));
  };
  addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  // menu do celular
  const btnMenu = $('[data-abre-menu]');
  const menuCel = $('[data-menu-cel]');
  const fechaMenu = () => { menuCel.hidden = true; btnMenu.setAttribute('aria-expanded', 'false'); btnMenu.setAttribute('aria-label', 'Abrir menu'); raiz.classList.remove('menu-aberto'); };
  btnMenu.addEventListener('click', () => {
    const abrir = menuCel.hidden;
    menuCel.hidden = !abrir;
    btnMenu.setAttribute('aria-expanded', String(abrir));
    btnMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    raiz.classList.toggle('menu-aberto', abrir);
  });
  $$('a', menuCel).forEach((a) => a.addEventListener('click', fechaMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menuCel.hidden) fechaMenu(); });

  // aberto agora / fechado
  const status = $('[data-aberto]');
  const statusTxt = $('[data-aberto-txt]');
  const dias = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const atualizaStatus = () => {
    const ag = new Date(); const d = ag.getDay(); const h = ag.getHours() + ag.getMinutes() / 60;
    const hj = D.horario[d];
    if (hj && h >= hj[0] && h < hj[1]) { statusTxt.textContent = `Aberto agora, até ${hj[1]}h`; status.classList.remove('fechado'); return; }
    status.classList.add('fechado');
    if (hj && h < hj[0]) { statusTxt.textContent = `Fechado, abre hoje às ${hj[0]}h`; return; }
    for (let i = 1; i <= 7; i++) {
      const nd = (d + i) % 7; const p = D.horario[nd];
      if (p) { statusTxt.textContent = `Fechado, abre ${i === 1 ? 'amanhã' : dias[nd]} às ${p[0]}h`; return; }
    }
  };
  atualizaStatus(); setInterval(atualizaStatus, 60000);

  // ---------- tema claro e escuro ----------
  const btnTema = $('[data-botao-tema]');
  const sincTema = () => {
    const escuro = raiz.dataset.tema === 'escuro';
    btnTema.setAttribute('aria-pressed', String(escuro));
    btnTema.setAttribute('aria-label', escuro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro');
    $('meta[name="theme-color"]').content = escuro ? '#0A1516' : '#F1F4F2';
  };
  sincTema();
  btnTema.addEventListener('click', () => {
    const vaiEscuro = raiz.dataset.tema !== 'escuro';
    const aplica = () => {
      if (vaiEscuro) raiz.dataset.tema = 'escuro'; else delete raiz.dataset.tema;
      try { localStorage.setItem('raiz-tema', vaiEscuro ? 'escuro' : 'claro'); } catch (e) { /* sem armazenamento */ }
      sincTema();
    };
    if (!document.startViewTransition || calmo) { aplica(); return; }
    const r = btnTema.getBoundingClientRect();
    const x = r.left + r.width / 2; const y = r.top + r.height / 2;
    const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(aplica).ready.then(() => {
      raiz.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${raio}px at ${x}px ${y}px)`] }, { duration: 750, easing: 'cubic-bezier(.2,.7,.1,1)', pseudoElement: '::view-transition-new(root)' });
    });
  });

  // ---------- aparecer na rolagem ----------
  const io = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visto');
    e.target.dispatchEvent(new CustomEvent('visto'));
    io.unobserve(e.target);
  }), { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  $$('[data-rv], [data-jornada], [data-cl-dados], [data-comp]').forEach((el) => io.observe(el));

  // contadores (aceitam vírgula decimal)
  const conta = (el) => {
    const alvo = el.dataset.conta; const dec = alvo.includes(',') ? alvo.split(',')[1].length : 0;
    const n = parseFloat(alvo.replace(',', '.'));
    if (calmo) return;
    const t0 = performance.now(); const dur = 1600;
    const passo = (t) => {
      const k = Math.min(1, (t - t0) / dur); const v = n * (1 - Math.pow(1 - k, 3));
      el.textContent = v.toFixed(dec).replace('.', ',');
      if (k < 1) requestAnimationFrame(passo); else el.textContent = alvo;
    };
    requestAnimationFrame(passo);
  };
  const ioConta = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { conta(e.target); ioConta.unobserve(e.target); } }), { threshold: 0.6 });
  $$('[data-conta]').forEach((el) => ioConta.observe(el));

  // ---------- frase que se escreve na rolagem ----------
  const frase = $('[data-frase]');
  if (frase && !calmo) {
    const pals = $$('span', frase);
    let pend = false;
    const pinta = () => {
      pend = false;
      const r = frase.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
      const ate = Math.round(k * pals.length);
      pals.forEach((p, i) => p.classList.toggle('lido', i < ate));
    };
    addEventListener('scroll', () => { if (!pend) { pend = true; requestAnimationFrame(pinta); } }, { passive: true });
    pinta();
  }

  // ---------- hero: carrossel de fotos com o profissional da vez ----------
  const hero = $('[data-hero]');
  if (hero) {
    const slides = $$('[data-slide]', hero);
    const barras = $$('.hero-barras span', hero);
    const profImgs = $$('.hero-prof-fotos img', hero);
    const profTxt = $('.hero-prof-txt', hero);
    const eq = Object.fromEntries(D.equipe.map((p) => [p.id, p]));
    let i = 0;
    const vai = (n) => {
      const ant = i; i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('ativa', k === i));
      barras.forEach((b, k) => { b.classList.remove('on'); b.classList.toggle('feito', k < i); });
      void barras[i].offsetWidth; barras[i].classList.add('on');
      profImgs.forEach((im, k) => im.classList.toggle('on', k === i));
      if (ant !== i) {
        const p = eq[D.slides[i]];
        $('[data-prof-nome]', hero).textContent = p.nome;
        $('[data-prof-area]', hero).textContent = p.area;
        $('[data-prof-exp]', hero).textContent = p.experiencia;
        profTxt.classList.remove('troca'); void profTxt.offsetWidth; profTxt.classList.add('troca');
        $('[data-hero-prof]', hero).dataset.prof = p.id;
      }
    };
    $('[data-hero-prof]', hero).dataset.prof = D.slides[0];
    barras.forEach((b) => b.querySelector('i').addEventListener('animationend', () => { if (b.classList.contains('on')) vai(i + 1); }));
    $('[data-hero-prox]', hero).addEventListener('click', () => vai(i + 1));
    $('[data-hero-ant]', hero).addEventListener('click', () => vai(i - 1));
    const pausa = (s) => hero.classList.toggle('pausado', s);
    hero.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') pausa(true); });
    hero.addEventListener('pointerleave', () => pausa(false));
    hero.addEventListener('focusin', () => pausa(true));
    hero.addEventListener('focusout', () => pausa(false));
    document.addEventListener('visibilitychange', () => pausa(document.hidden));
    if (calmo) pausa(true);
    let x0 = null;
    hero.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) vai(i + (dx < 0 ? 1 : -1)); x0 = null; });
    // o cartão do profissional leva à equipe já com ele escolhido
    $('[data-hero-prof]', hero).addEventListener('click', (e) => { const id = e.currentTarget.dataset.prof; setTimeout(() => escolheProf?.(id), 50); });
  }

  // ---------- trilho de tratamentos ----------
  const trilho = $('[data-trilho]');
  if (trilho) {
    const ant = $('[data-trilho-ant]'); const prox = $('[data-trilho-prox]');
    const passo = () => (trilho.querySelector('li')?.getBoundingClientRect().width || 280) + 14;
    ant.addEventListener('click', () => trilho.scrollBy({ left: -passo(), behavior: 'smooth' }));
    prox.addEventListener('click', () => trilho.scrollBy({ left: passo(), behavior: 'smooth' }));
    const estado = () => {
      const fim = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 4;
      ant.className = `redondo ${trilho.scrollLeft > 4 ? 'escuro' : 'claro'}`;
      prox.className = `redondo ${fim ? 'claro' : 'escuro'}`;
    };
    trilho.addEventListener('scroll', estado, { passive: true }); estado();
    // arrastar com o mouse
    let arr = null;
    trilho.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; arr = { x: e.clientX, s: trilho.scrollLeft, mov: false }; });
    addEventListener('pointermove', (e) => { if (!arr) return; const dx = e.clientX - arr.x; if (Math.abs(dx) > 5) { arr.mov = true; trilho.style.scrollSnapType = 'none'; } trilho.scrollLeft = arr.s - dx; });
    addEventListener('pointerup', () => { if (!arr) return; const m = arr.mov; arr = null; trilho.style.scrollSnapType = ''; if (m) { trilho.dataset.arrastou = '1'; setTimeout(() => delete trilho.dataset.arrastou, 60); } });
  }

  // ---------- janelas ----------
  const abreJanela = (dlg) => { if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', ''); };
  $$('dialog.janela').forEach((dlg) => {
    dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-fechar]')) dlg.close(); });
  });
  const jTrat = $('[data-jan-trat]');
  const trat = Object.fromEntries(D.tratamentos.map((t) => [t.id, t]));
  const abreTrat = (id) => {
    const t = trat[id]; if (!t) return;
    const img = $('[data-jt-foto]', jTrat); img.src = `assets/img/${t.foto}.webp`; img.alt = t.nome;
    $('[data-jt-meta]', jTrat).textContent = `${t.tempo}, ${t.sessoes.charAt(0).toLowerCase()}${t.sessoes.slice(1)}`;
    $('[data-jt-nome]', jTrat).textContent = t.nome;
    $('[data-jt-texto]', jTrat).textContent = t.texto;
    $('[data-jt-para]', jTrat).textContent = t.para;
    $('[data-jt-inclui]', jTrat).innerHTML = t.inclui.map((x) => `<li>${icCheck}${x}</li>`).join('');
    $('[data-jt-wa]', jTrat).href = wa(`Olá! Gostaria de agendar uma avaliação de ${t.nome.toLowerCase()} na ${D.marca}.`);
    abreJanela(jTrat);
  };
  $$('[data-abre-trat]').forEach((b) => b.addEventListener('click', (e) => {
    if (trilho?.dataset.arrastou) { e.preventDefault(); return; }
    e.preventDefault(); abreTrat(b.dataset.abreTrat);
  }));

  const jArt = $('[data-jan-art]');
  $$('[data-artigo]').forEach((b) => b.addEventListener('click', () => {
    const a = D.artigos[+b.dataset.artigo];
    const img = $('[data-ja-foto]', jArt); img.src = `assets/img/${a.foto}.webp`; img.alt = '';
    $('[data-ja-meta]', jArt).textContent = `${a.tag}, por ${a.autor}, ${a.data}`;
    $('[data-ja-tit]', jArt).textContent = a.titulo;
    $('[data-ja-corpo]', jArt).innerHTML = a.corpo.map((p) => `<p>${p}</p>`).join('');
    abreJanela(jArt);
  }));

  const jFoto = $('[data-jan-foto]');
  $$('[data-foto]').forEach((b) => b.addEventListener('click', () => {
    const img = $('[data-jf-img]', jFoto); img.src = `assets/img/${b.dataset.foto}.webp`; img.alt = b.dataset.legenda;
    $('[data-jf-leg]', jFoto).textContent = b.dataset.legenda;
    abreJanela(jFoto);
  }));

  // ---------- agendamento rápido ----------
  const ag = $('[data-agendar]');
  if (ag) {
    const semana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const caixa = $('[data-dias]', ag);
    const hoje = new Date(); const lista = [];
    for (let k = 1; lista.length < 6 && k < 14; k++) {
      const d = new Date(hoje); d.setDate(hoje.getDate() + k);
      if (D.horario[d.getDay()]) lista.push(d);
    }
    caixa.innerHTML = lista.map((d, k) => `<label class="dia"><input type="radio" name="dia" value="${d.toISOString().slice(0, 10)}"${k === 0 ? ' checked' : ''}><span>${semana[d.getDay()]}<b>${d.getDate()}</b></span></label>`).join('');
    const cons = Object.fromEntries(D.consultas.map((c) => [c.id, c]));
    const resumo = () => {
      const c = cons[ag.consulta.value];
      $('[data-ag-nome]', ag).textContent = c.nome;
      $('[data-ag-prof]', ag).textContent = `com ${c.prof}`;
    };
    ag.addEventListener('change', resumo);
    ag.addEventListener('submit', (e) => {
      e.preventDefault();
      const c = cons[ag.consulta.value];
      const d = new Date(`${ag.dia.value}T12:00:00`);
      const data = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
      open(wa(`Olá! Gostaria de agendar: ${c.nome} (${c.dur}) com ${c.prof}, ${data}, período da ${ag.periodo.value.toLowerCase()}.`), '_blank', 'noopener');
    });
  }
  // próximo retorno do exemplo de alinhadores
  const ret = $('[data-retorno]');
  if (ret) { const d = new Date(); d.setDate(d.getDate() + 10); while (!D.horario[d.getDay()]) d.setDate(d.getDate() + 1); ret.textContent = d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, ''); }

  // agenda de hoje: segmentos preenchem ao aparecer
  const agenda = $('[data-agenda]');
  if (agenda) {
    const pct = parseInt($('[data-agenda-pct]').textContent, 10) / 100;
    const segs = $$('i', agenda); const n = Math.round(segs.length * pct);
    agenda.closest('[data-cl-dados]').addEventListener('visto', () => {
      agenda.classList.add('visto');
      segs.forEach((s, k) => setTimeout(() => s.classList.toggle('on', k < n), calmo ? 0 : 300 + k * 45));
    });
  }

  // ---------- equipe ----------
  let escolheProf = null;
  const eqBox = $('[data-equipe]');
  if (eqBox) {
    const tabs = $$('[data-eq]', eqBox);
    const fotos = $$('[data-eq-foto]', eqBox);
    const eq = Object.fromEntries(D.equipe.map((p) => [p.id, p]));
    escolheProf = (id) => {
      const p = eq[id]; if (!p) return;
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.eq === id)));
      fotos.forEach((f) => {
        const on = f.dataset.eqFoto === id;
        if (f.classList.contains('on') && !on) { f.classList.remove('on'); f.classList.add('sai'); setTimeout(() => f.classList.remove('sai'), 900); }
        else if (on) f.classList.add('on');
      });
      $('[data-eq-cro]', eqBox).textContent = p.cro;
      const bio = $('[data-eq-bio]', eqBox); bio.textContent = p.bio;
      bio.parentElement.classList.remove('troca'); void bio.parentElement.offsetWidth; bio.parentElement.classList.add('troca');
      $('[data-eq-exp]', eqBox).textContent = p.experiencia;
      $('[data-eq-form]', eqBox).textContent = p.formacao;
      $('[data-eq-dias]', eqBox).textContent = p.dias;
      $('[data-eq-nome]', eqBox).textContent = p.nome;
      $('[data-eq-wa]', eqBox).href = wa(`Olá! Gostaria de agendar uma consulta com ${p.nome}.`);
    };
    tabs.forEach((t, k) => {
      t.addEventListener('click', () => escolheProf(t.dataset.eq));
      t.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) escolheProf(t.dataset.eq); });
      t.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return; e.preventDefault(); const n = tabs[(k + d + tabs.length) % tabs.length]; n.focus(); escolheProf(n.dataset.eq);
      });
    });
  }

  // ---------- antes e depois ----------
  const comp = $('[data-comp]');
  if (comp) {
    const range = $('[data-comp-range]', comp);
    let mexeu = false;
    const poe = (v) => comp.style.setProperty('--pos', `${v}%`);
    range.addEventListener('input', () => { mexeu = true; poe(range.value); });
    range.addEventListener('pointerdown', () => { mexeu = true; comp.classList.add('arrastando'); });
    addEventListener('pointerup', () => comp.classList.remove('arrastando'));
    // ao aparecer, a linha balança para mostrar que dá para arrastar
    comp.addEventListener('visto', () => {
      if (calmo) return;
      const t0 = performance.now();
      const anda = (t) => {
        if (mexeu) return;
        const k = (t - t0) / 2200; if (k > 1) { poe(50); range.value = 50; return; }
        const v = 50 + Math.sin(k * Math.PI * 2) * 18 * (1 - k);
        poe(v); range.value = v; requestAnimationFrame(anda);
      };
      setTimeout(() => requestAnimationFrame(anda), 500);
    });
    const casos = Object.fromEntries(D.casos.map((c) => [c.id, c]));
    const abas = $$('[data-caso]');
    abas.forEach((b, k) => {
      b.addEventListener('click', () => {
        abas.forEach((x) => x.setAttribute('aria-selected', String(x === b)));
        $$('[data-par]', comp).forEach((p) => p.classList.toggle('on', p.dataset.par === b.dataset.caso));
        const c = casos[b.dataset.caso];
        const txt = $('[data-caso-txt]'); txt.textContent = c.texto; txt.classList.remove('troca'); void txt.offsetWidth; txt.classList.add('troca');
        $('[data-caso-tempo]').textContent = c.tempo;
        poe(50); range.value = 50;
      });
      b.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return; const n = abas[(k + d + abas.length) % abas.length]; n.focus(); n.click();
      });
    });
  }

  // ---------- avaliações ----------
  const av = $('[data-av]');
  if (av) {
    const itens = $$('[data-av-item]', av); const barras = $$('.av-barras span', av);
    let i = 0;
    const vai = (n) => {
      i = (n + itens.length) % itens.length;
      itens.forEach((it, k) => { it.classList.toggle('on', k === i); it.setAttribute('aria-hidden', String(k !== i)); });
      barras.forEach((b, k) => { b.classList.remove('on'); b.classList.toggle('feito', k < i); });
      void barras[i].offsetWidth; barras[i].classList.add('on');
    };
    av.style.setProperty('--dur', '8s');
    barras.forEach((b) => b.querySelector('i').addEventListener('animationend', () => { if (b.classList.contains('on')) vai(i + 1); }));
    $('[data-av-prox]', av).addEventListener('click', () => vai(i + 1));
    $('[data-av-ant]', av).addEventListener('click', () => vai(i - 1));
    av.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') av.classList.add('pausado'); });
    av.addEventListener('pointerleave', () => av.classList.remove('pausado'));
    av.addEventListener('focusin', () => av.classList.add('pausado'));
    av.addEventListener('focusout', () => av.classList.remove('pausado'));
    if (calmo) av.classList.add('pausado');
    // só começa a passar quando aparece
    av.classList.add('pausado');
    av.addEventListener('visto', () => { if (!calmo) av.classList.remove('pausado'); });
    let x0 = null;
    av.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    av.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) vai(i + (dx < 0 ? 1 : -1)); x0 = null; });
  }

  // ---------- dúvidas ----------
  $$('[data-faq]').forEach((b) => b.addEventListener('click', () => {
    const li = b.closest('li'); const abrir = !li.classList.contains('aberta');
    $$('.faq-lista li.aberta').forEach((o) => { o.classList.remove('aberta'); $('[data-faq]', o).setAttribute('aria-expanded', 'false'); });
    li.classList.toggle('aberta', abrir); b.setAttribute('aria-expanded', String(abrir));
  }));

  // ---------- formulário ----------
  const form = $('[data-form]');
  if (form) {
    const tel = $('[data-mascara]', form);
    tel.addEventListener('input', () => {
      const d = tel.value.replace(/\D/g, '').slice(0, 11);
      let v = d;
      if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length > 7) v = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
      tel.value = v;
    });
    const regras = {
      nome: (v) => v.trim().length >= 2,
      tel: (v) => v.replace(/\D/g, '').length >= 10,
      email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      aceite: (_, el) => el.checked,
    };
    const confere = (el) => {
      const ok = regras[el.name] ? regras[el.name](el.value, el) : true;
      (el.closest('.campo') || el.closest('.aceite')).classList.toggle('invalido', !ok);
      el.setAttribute('aria-invalid', String(!ok));
      return ok;
    };
    $$('input', form).forEach((el) => {
      if (!regras[el.name]) return;
      el.addEventListener('blur', () => { if (el.value || el.type === 'checkbox') confere(el); });
      el.addEventListener('input', () => { if (el.closest('.invalido')) confere(el); });
      el.addEventListener('change', () => { if (el.type === 'checkbox') confere(el); });
    });
    const ok = $('[data-form-ok]', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const campos = ['nome', 'tel', 'email', 'aceite'].map((n) => form.elements[n]);
      const ruins = campos.filter((el) => !confere(el));
      if (ruins.length) { ruins[0].focus(); return; }
      const f = form.elements;
      const linhas = [
        `Olá! Meu nome é ${f.nome.value.trim()} e gostaria de agendar uma consulta na ${D.marca}.`,
        `Tratamento: ${f.trat.value || 'avaliação'}`,
        `Melhor período: ${f.periodo.value}`,
        `WhatsApp: ${f.tel.value}`,
      ];
      if (f.email.value) linhas.push(`E-mail: ${f.email.value}`);
      if (f.msg.value.trim()) linhas.push(`Mensagem: ${f.msg.value.trim()}`);
      const link = wa(linhas.join('\n'));
      $('[data-ok-nome]', ok).textContent = f.nome.value.trim().split(' ')[0];
      $('[data-ok-wa]', ok).href = link;
      form.classList.add('enviado'); ok.hidden = false; ok.focus();
      open(link, '_blank', 'noopener');
    });
    $('[data-form-novo]', form).addEventListener('click', () => {
      form.reset(); form.classList.remove('enviado'); ok.hidden = true;
      $$('.invalido', form).forEach((c) => c.classList.remove('invalido'));
      form.elements.nome.focus();
    });
  }

  // ---------- novidades por e-mail (sem servidor: só confirma na tela) ----------
  const news = $('[data-news]');
  if (news) news.addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = $('input', news); const msg = $('[data-news-msg]', news);
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value);
    msg.classList.toggle('erro-msg', !valido);
    msg.textContent = valido ? 'Pronto! O próximo e-mail chega no começo do mês.' : 'Confira o e-mail digitado.';
    if (valido) inp.value = '';
  });

  $$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
