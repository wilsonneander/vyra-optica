// Taioba Standard: comportamento do site e da Área do cliente (um arquivo para todas as páginas).
// Os dados vêm de window.TAIOBA, gravado pelo build. Nesta demonstração a conta fica no localStorage.
(() => {
  const D = window.TAIOBA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pg = document.body.dataset.pg;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const reais = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
  const minutos = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
  const hora = (h) => (h === 24 ? 'meia-noite' : `${Math.floor(h % 24)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`);
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const guarda = {
    ler(k, padrao, s = localStorage) { try { const v = s.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } },
    gravar(k, v, s = localStorage) { try { s.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento: vale só nesta visita */ } },
    apagar(k) { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch (e) { /* nada a fazer */ } },
  };
  const numeroWa = () => `55${D.marca.whatsapp.replace(/\D/g, '')}`;
  const wa = (msg) => `https://wa.me/${numeroWa()}?text=${encodeURIComponent(msg)}`;
  const expDe = (id) => D.experiencias.find((e) => e.id === id);
  const pessoaDe = (id) => D.equipe.find((m) => m.id === id);

  // datas no horário de Brasília
  const agoraBR = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const iso = `${p.year}-${p.month}-${p.day}`;
    return { iso, dia: new Date(`${iso}T12:00:00`).getDay(), h: Number(p.hour) + Number(p.minute) / 60 };
  };
  const somaDias = (iso, n) => { const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const diaSemana = (iso) => new Date(`${iso}T12:00:00`).getDay();
  const dataLonga = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const dataCurta = (iso) => { const d = new Date(`${iso}T12:00:00`); return { dia: d.getDate(), mes: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''), sem: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '') }; };

  // ---------- aviso rápido ----------
  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (t) => { if (!toastEl) return; toastEl.textContent = t; toastEl.classList.add('ve'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('ve'), 3200); };

  // ---------- grupos com o mesmo tamanho ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    if (!g.offsetParent && getComputedStyle(g).position !== 'fixed') return;
    g.style.removeProperty('--larg');
    if (getComputedStyle(g).display === 'grid') return; // em grade as colunas já dividem igual
    let maior = 0;
    for (const f of [...g.children]) {
      if (f.hidden) continue;
      const c = f.cloneNode(true);
      c.style.cssText = 'position:absolute;visibility:hidden;width:max-content;left:0;top:0;pointer-events:none';
      c.removeAttribute('id');
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
  let io;
  const revela = (raiz = document) => {
    const els = $$('.rev', raiz).filter((el) => !el.classList.contains('ve'));
    if (reduz || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('ve')); return; }
    io ||= new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('ve'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => {
      const irmaos = [...el.parentElement.children].filter((x) => x.classList.contains('rev'));
      const k = irmaos.indexOf(el);
      if (irmaos.length > 1 && k > 0) el.style.setProperty('--d', `${Math.min(k, 5) * 0.08}s`);
      io.observe(el);
    });
  };
  revela();

  // ---------- janelas legais e cookies ----------
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-doc]');
    if (b) { const d = $(`#doc-${b.dataset.doc}`); if (d?.showModal) d.showModal(); }
  });
  $$('dialog.doc').forEach((d) => {
    $$('[data-fecha]', d).forEach((x) => x.addEventListener('click', () => d.close()));
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });
  const ck = $('#cookies');
  if (ck) {
    if (!guarda.ler('taioba-cookies', null)) { ck.hidden = false; igualaDepois(); }
    $$('[data-ck]', ck).forEach((b) => b.addEventListener('click', () => { guarda.gravar('taioba-cookies', { escolha: b.dataset.ck, em: new Date().toISOString() }); ck.hidden = true; }));
    $$('[data-cookies]').forEach((b) => b.addEventListener('click', () => { ck.hidden = false; igualaDepois(); }));
  }

  // ---------- conta (compartilhada entre site e Área do cliente) ----------
  const Conta = {
    contas() {
      let c = guarda.ler('taioba-contas-v2', null);
      if (!c) {
        // primeira visita: cria a conta de exemplo com datas a partir de hoje
        const hoje = agoraBR().iso;
        const d = D.demo;
        c = { [d.email]: {
          nome: d.nome, email: d.email, senha: d.senha, telefone: d.telefone, nascimento: d.nascimento, visitas: d.visitas, prefs: d.prefs,
          reservas: d.reservas.map((r) => ({ ...r, data: somaDias(hoje, r.dias), dias: undefined })),
          pedidos: d.pedidos.map((p) => ({ ...p, data: somaDias(hoje, p.dias), dias: undefined })),
          criada: somaDias(hoje, -200),
        } };
        guarda.gravar('taioba-contas-v2', c);
      }
      return c;
    },
    sessao() { return guarda.ler('taioba-sessao', null) || guarda.ler('taioba-sessao', null, sessionStorage); },
    atual() { const e = this.sessao(); return e ? this.contas()[e] || null : null; },
    salvar(conta) { const c = this.contas(); c[conta.email] = conta; guarda.gravar('taioba-contas-v2', c); },
    entrar(email, lembrar) { guarda.apagar('taioba-sessao'); guarda.gravar('taioba-sessao', email, lembrar ? localStorage : sessionStorage); },
    sair() { guarda.apagar('taioba-sessao'); },
    apagar(email) { const c = this.contas(); delete c[email]; guarda.gravar('taioba-contas-v2', c); this.sair(); },
  };
  const logado = Conta.atual();
  if (logado) $$('[data-link-conta]').forEach((a) => { a.href = 'conta.html'; a.setAttribute('aria-label', `Minha conta, ${logado.nome}`); $$('[data-nome-conta]', a).forEach((s) => { s.textContent = `Olá, ${logado.nome.split(' ')[0]}`; }); });

  // ================= SITE =================
  // topo: sombra ao rolar e menu do celular
  const topo = $('[data-topo]');
  if (topo) {
    const marca = () => topo.classList.toggle('rolou', scrollY > 8);
    addEventListener('scroll', marca, { passive: true }); marca();
    const btn = $('.menu-btn'), menu = $('#menu');
    const fecha = () => { menu.classList.remove('aberto'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Abrir o menu'); };
    btn?.addEventListener('click', () => { const a = !menu.classList.contains('aberto'); menu.classList.toggle('aberto', a); btn.setAttribute('aria-expanded', String(a)); btn.setAttribute('aria-label', a ? 'Fechar o menu' : 'Abrir o menu'); });
    $$('a', menu).forEach((a) => a.addEventListener('click', fecha));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') fecha(); });
  }

  // aberto agora, lousa e horário do dia
  const agora = agoraBR();
  const status = $('[data-status]');
  if (status) {
    const hoje = D.horario[agora.dia].turnos;
    const ontem = D.horario[(agora.dia + 6) % 7].turnos.find(([, b]) => b > 24 && agora.h < b - 24);
    const turno = ontem ? [0, ontem[1]] : hoje.find(([a, b]) => agora.h >= a && agora.h < b);
    if (turno) status.innerHTML = `<b>Aberto agora</b> até ${hora(turno[1])}`;
    else {
      let prox = hoje.find(([a]) => a > agora.h), dia = agora.dia, n = 0;
      while (!prox && n < 7) { n++; dia = (dia + 1) % 7; prox = D.horario[dia].turnos[0]; }
      if (prox) status.innerHTML = `<b>Fechado agora.</b> Abre ${n === 0 ? 'hoje' : n === 1 ? 'amanhã' : DIAS[dia]} às ${hora(prox[0])}`;
    }
  }
  $$(`.dia[data-dia-semana="${agora.dia}"], .horas tr[data-dia="${agora.dia}"]`).forEach((el) => el.classList.add('hoje'));

  // carrosséis de cartões (semana e avaliações): setas, arraste com o mouse, toque nativo e
  // avanço sozinho na semana, que pausa com o mouse em cima, com foco ou com a aba escondida
  $$('[data-trilho-car]').forEach((tr) => {
    const passo = () => { const c = tr.children[0]; return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(tr).columnGap) || 16) : tr.clientWidth; };
    const fim = () => tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4;
    const vai = (n) => { if (n > 0 && fim()) tr.scrollTo({ left: 0, behavior: reduz ? 'auto' : 'smooth' }); else tr.scrollBy({ left: n * passo(), behavior: reduz ? 'auto' : 'smooth' }); };
    $$(`[data-trilho-ir][aria-controls="${tr.id}"]`).forEach((b) => b.addEventListener('click', () => vai(Number(b.dataset.trilhoIr))));
    tr.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); vai(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); vai(-1); } });
    let x0 = null, s0 = 0, moveu = false;
    tr.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.target.closest('a, button')) return; x0 = e.clientX; s0 = tr.scrollLeft; moveu = false; tr.classList.add('arrastando'); });
    addEventListener('pointermove', (e) => { if (x0 === null) return; const dx = e.clientX - x0; if (Math.abs(dx) > 4) moveu = true; tr.scrollLeft = s0 - dx; });
    addEventListener('pointerup', () => { if (x0 === null) return; x0 = null; tr.classList.remove('arrastando'); const p = passo(); tr.scrollTo({ left: Math.round(tr.scrollLeft / p) * p, behavior: reduz ? 'auto' : 'smooth' }); });
    tr.addEventListener('click', (e) => { if (moveu) { e.preventDefault(); e.stopPropagation(); moveu = false; } }, true);
    if (tr.id === 'semana-trilho') {
      // começa no dia de hoje
      const hoje = $('.dia.hoje', tr);
      if (hoje) requestAnimationFrame(() => { tr.scrollLeft += hoje.getBoundingClientRect().left - tr.children[0].getBoundingClientRect().left; });
      if (!reduz) {
        let pausa = false;
        ['mouseenter', 'focusin', 'touchstart'].forEach((ev) => tr.addEventListener(ev, () => { pausa = true; }, { passive: true }));
        ['mouseleave', 'focusout'].forEach((ev) => tr.addEventListener(ev, () => { pausa = false; }));
        setInterval(() => { const r = tr.getBoundingClientRect(); if (!pausa && !document.hidden && r.top < innerHeight && r.bottom > 0) vai(1); }, 5500);
      }
    }
  });

  // mini carrossel de fotos dos eventos
  $$('[data-mini]').forEach((m) => {
    const slides = $$('.mini-slide', m), pontos = $$('[data-mini-ir]', m);
    let i = 0, pausa = false;
    const vai = (n) => { i = (n + slides.length) % slides.length; slides.forEach((x, k) => x.classList.toggle('ativo', k === i)); pontos.forEach((p, k) => p.setAttribute('aria-selected', String(k === i))); };
    pontos.forEach((p) => p.addEventListener('click', () => vai(Number(p.dataset.miniIr))));
    m.addEventListener('mouseenter', () => { pausa = true; }); m.addEventListener('mouseleave', () => { pausa = false; });
    if (!reduz) setInterval(() => { if (!pausa && !document.hidden) vai(i + 1); }, 3800);
  });

  // folhas de taioba: cada uma anda numa velocidade diferente com a rolagem
  const fls = $$('.fl');
  if (fls.length && !reduz) {
    let pedido = false;
    const mexe = () => {
      pedido = false;
      const h = innerHeight;
      fls.forEach((f) => {
        const r = f.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > h + 200) return;
        const meio = r.top + r.height / 2 - h / 2;
        f.style.setProperty('--par', `${(-meio * Number(f.style.getPropertyValue('--v') || 0.3)).toFixed(1)}px`);
      });
    };
    addEventListener('scroll', () => { if (!pedido) { pedido = true; requestAnimationFrame(mexe); } }, { passive: true });
    mexe();
  }

  // abas do cardápio (com setas do teclado)
  const abas = $$('[data-aba]');
  const abre = (id, foco) => {
    abas.forEach((b) => { const s = b.dataset.aba === id; b.setAttribute('aria-selected', String(s)); b.tabIndex = s ? 0 : -1; if (s && foco) b.focus(); });
    $$('.seg').forEach((s) => { s.hidden = s.id !== `seg-${id}`; });
    revela();
  };
  abas.forEach((b, k) => {
    b.addEventListener('click', () => abre(b.dataset.aba));
    b.addEventListener('keydown', (e) => {
      const n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (n) { e.preventDefault(); abre(abas[(k + n + abas.length) % abas.length].dataset.aba, true); }
    });
  });
  if (abas.length) abre(abas[0].dataset.aba);

  // números da casa contando ao aparecer
  const contadores = $$('[data-conta]');
  if (contadores.length && !reduz && 'IntersectionObserver' in window) {
    const ioC = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      ioC.unobserve(e.target);
      const fim = Number(e.target.dataset.conta), t0 = performance.now();
      const passo = (t) => { const p = Math.min(1, (t - t0) / 1400); e.target.textContent = Math.round(fim * (1 - (1 - p) ** 3)); if (p < 1) requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
    }), { threshold: 0.6 });
    contadores.forEach((c) => { c.textContent = '0'; ioC.observe(c); });
  }

  // galeria: filtros e foto ampliada
  const visor = $('[data-visor]');
  let fotosVisor = [], iv = 0;
  const mostraVisor = () => { const f = fotosVisor[iv]; $('[data-visor-img]', visor).src = f.dataset.foto; $('[data-visor-img]', visor).alt = f.dataset.leg; $('[data-visor-leg]', visor).textContent = f.dataset.leg; };
  let focoAntes;
  const fechaVisor = () => { visor.hidden = true; document.body.style.overflow = ''; focoAntes?.focus(); };
  $$('[data-galeria]').forEach((g) => g.addEventListener('click', (e) => {
    const b = e.target.closest('[data-foto]'); if (!b || !visor) return;
    fotosVisor = $$('[data-foto]', g).filter((x) => !x.classList.contains('some'));
    iv = fotosVisor.indexOf(b); focoAntes = b;
    mostraVisor(); visor.hidden = false; document.body.style.overflow = 'hidden'; $('[data-visor-fecha]', visor).focus();
  }));
  if (visor) {
    $('[data-visor-fecha]', visor).addEventListener('click', fechaVisor);
    $$('[data-visor-ir]', visor).forEach((b) => b.addEventListener('click', () => { iv = (iv + Number(b.dataset.visorIr) + fotosVisor.length) % fotosVisor.length; mostraVisor(); }));
    visor.addEventListener('click', (e) => { if (e.target === visor) fechaVisor(); });
    addEventListener('keydown', (e) => {
      if (visor.hidden) return;
      if (e.key === 'Escape') fechaVisor();
      if (e.key === 'ArrowRight') $('[data-visor-ir="1"]', visor).click();
      if (e.key === 'ArrowLeft') $('[data-visor-ir="-1"]', visor).click();
    });
  }
  $$('[data-filtro]').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filtro;
    $$('[data-filtro]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$('.gal-item').forEach((it) => { const ve = f === 'todas' || it.dataset.cat === f; it.classList.toggle('some', !ve); it.classList.toggle('mostra', ve); });
  }));

  // ---------- reserva ----------
  const form = $('[data-reserva]');
  const horariosDe = (exp, iso) => {
    const d = diaSemana(iso), turnos = D.horario[d].turnos;
    if (!turnos.length) return [];
    const serie = (a, b, passo = 0.5) => { const l = []; for (let h = a; h <= b + 0.001; h += passo) l.push(h); return l; };
    let lista = [];
    if (exp.turnos === 'todos') turnos.forEach(([a, b]) => { lista.push(...serie(a, Math.min(b, 24) - 1.5)); });
    else if (exp.turnos === 'happy') { if (d >= 2 && d <= 5) lista = serie(18, 19); else if (d === 6) lista = serie(17, 19); }
    else if (exp.turnos === 'evento') lista = d === 0 ? [12] : [12, 19];
    const a = agoraBR();
    if (iso === a.iso) lista = lista.filter((h) => h > a.h + 1);
    return lista;
  };
  const rotuloHora = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`;
  const limites = { mesa: [1, 10], 'mesa-mineira': [2, 20], happy: [2, 20], aniversario: [5, 25], evento: [25, 80] };

  if (form) {
    const el = (n) => form.elements[n];
    const resumo = $('[data-resumo]'), r = (k) => $(`[data-r="${k}"]`, resumo);
    const selAnf = $('[data-anf]', form), selAmb = $('[data-amb]', form), horas = $('[data-horas]', form), dataEl = $('[data-data]', form);
    const hoje = agoraBR().iso;
    dataEl.min = hoje; dataEl.max = somaDias(hoje, 60);
    let horaSel = null;
    const exp = () => expDe(form.querySelector('[name="exp"]:checked').value);

    const opcoes = () => {
      const e = exp();
      const antes = selAnf.value;
      selAnf.innerHTML = `<option value="">Sem preferência</option>${e.anf.map((id) => `<option value="${id}">${esc(pessoaDe(id).nome)}, ${esc(pessoaDe(id).cargo.toLowerCase())}</option>`).join('')}`;
      if (e.anf.includes(antes)) selAnf.value = antes;
      const ambAntes = selAmb.value;
      selAmb.innerHTML = e.ambientes.map((a) => `<option value="${a}">${esc(D.ambientes[a])}</option>`).join('');
      if (e.ambientes.includes(ambAntes)) selAmb.value = ambAntes;
      const [mn, mx] = limites[e.id] || [1, 16];
      el('pessoas').min = mn; el('pessoas').max = mx;
      if (Number(el('pessoas').value) < mn) el('pessoas').value = mn;
      if (Number(el('pessoas').value) > mx) el('pessoas').value = mx;
    };
    const desenhaHoras = () => {
      const iso = dataEl.value;
      if (!iso) { horas.innerHTML = '<p class="res-vazio">Escolha uma data para ver os horários.</p>'; horaSel = null; return; }
      const lista = horariosDe(exp(), iso);
      if (!lista.length) {
        const d = diaSemana(iso);
        horas.innerHTML = `<p class="res-vazio">${d === 1 ? 'A casa fecha às segundas.' : `${esc(exp().nome)} não acontece nesse dia. Tente outra data.`}</p>`;
        horaSel = null; return;
      }
      if (!lista.map(rotuloHora).includes(horaSel)) horaSel = null;
      horas.innerHTML = lista.map((h) => { const t = rotuloHora(h); return `<button type="button" role="radio" aria-checked="${t === horaSel}" data-h="${t}">${t}</button>`; }).join('');
    };
    horas.addEventListener('click', (e) => { const b = e.target.closest('[data-h]'); if (!b) return; horaSel = b.dataset.h; $$('[data-h]', horas).forEach((x) => x.setAttribute('aria-checked', String(x === b))); atualiza(); });
    const atualiza = () => {
      const e = exp(), p = Number(el('pessoas').value) || 1;
      r('exp').textContent = e.nome;
      r('anf').textContent = selAnf.value ? pessoaDe(selAnf.value).nome : 'Sem preferência';
      r('amb').textContent = D.ambientes[selAmb.value] || '';
      r('quando').textContent = dataEl.value ? `${dataLonga(dataEl.value)}${horaSel ? `, ${horaSel}` : ''}` : 'Escolha a data';
      r('pessoas').textContent = `${p} ${p === 1 ? 'pessoa' : 'pessoas'}`;
      r('total').textContent = e.preco ? `${e.de ? 'a partir de ' : ''}${reais(e.preco * p)}` : 'Sem custo';
      const sinal = r('sinal');
      sinal.hidden = !e.sinal;
      if (e.sinal) sinal.textContent = `Sinal de 30% (${reais(e.preco * p * 0.3)}) por Pix para confirmar. Devolvido se cancelar até 48 horas antes.`;
      if (logado) r('conta').textContent = `Reserva guardada na conta de ${logado.nome.split(' ')[0]}.`;
    };
    form.addEventListener('change', (e) => {
      if (e.target.name === 'exp') { opcoes(); desenhaHoras(); }
      if (e.target === dataEl) desenhaHoras();
      atualiza();
    });
    form.addEventListener('input', atualiza);
    const escolhe = (id, anfId) => {
      const radio = form.querySelector(`[name="exp"][value="${id}"]`);
      if (!radio) return;
      radio.checked = true; opcoes();
      if (anfId && exp().anf.includes(anfId)) selAnf.value = anfId;
      desenhaHoras(); atualiza();
    };
    $$('[data-reservar]').forEach((a) => a.addEventListener('click', () => escolhe(a.dataset.reservar)));
    // vindo da página da equipe ou da Área do cliente: ?exp=...&anf=...
    const q = new URLSearchParams(location.search);
    opcoes();
    if (q.get('exp')) escolhe(q.get('exp'), q.get('anf'));
    // conta logada: preenche nome, contato e restrições
    if (logado) {
      el('nome').value = logado.nome; el('tel').value = logado.telefone || ''; el('email').value = logado.email;
      const rs = (logado.prefs?.restricoes || []).map((id) => D.restricoes.find((x) => x[0] === id)?.[1]).filter(Boolean);
      el('obs').value = [rs.join(', '), logado.prefs?.obs].filter(Boolean).join('. ');
      if (logado.prefs?.ambiente && exp().ambientes.includes(logado.prefs.ambiente)) selAmb.value = logado.prefs.ambiente;
    }
    desenhaHoras(); atualiza();

    const erro = $('[data-erro]', form);
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const e = exp(), p = Number(el('pessoas').value);
      const falta = [];
      const marca = (campo, ok) => { campo.setAttribute('aria-invalid', String(!ok)); if (!ok) falta.push(campo); };
      marca(el('nome'), el('nome').value.trim().length > 2);
      marca(el('tel'), el('tel').value.replace(/\D/g, '').length >= 10);
      marca(el('pessoas'), p >= Number(el('pessoas').min) && p <= Number(el('pessoas').max));
      marca(dataEl, !!dataEl.value);
      if (el('email').value) marca(el('email'), el('email').checkValidity());
      let msg = '';
      if (!horaSel) msg = 'Escolha um horário.';
      if (!el('lgpd').checked) msg = 'Para reservar, aceite o uso dos dados conforme a Política de privacidade.';
      if (falta.length) msg = 'Confira os campos marcados.';
      if (falta.includes(el('pessoas'))) msg = `${e.nome} recebe de ${el('pessoas').min} a ${el('pessoas').max} pessoas.`;
      erro.textContent = msg;
      if (msg) { (falta[0] || (!horaSel ? horas : el('lgpd'))).focus?.(); return; }
      const res = { id: `r-${Date.now().toString(36)}`, exp: e.id, anf: selAnf.value, amb: selAmb.value, pessoas: p, data: dataEl.value, hora: horaSel, nome: el('nome').value.trim(), tel: el('tel').value.trim(), email: el('email').value.trim(), obs: el('obs').value.trim(), status: e.sinal || p > 10 ? 'pendente' : 'confirmada', criada: new Date().toISOString() };
      if (logado) { logado.reservas = [...(logado.reservas || []), res]; Conta.salvar(logado); }
      else guarda.gravar('taioba-reservas', [...guarda.ler('taioba-reservas', []), res]);
      const quando = `${dataLonga(res.data)}, às ${res.hora}`;
      const texto = `Olá! Quero reservar pelo site: ${e.nome}, ${quando}, ${p} ${p === 1 ? 'pessoa' : 'pessoas'}, ${D.ambientes[res.amb]}${res.anf ? `, com ${pessoaDe(res.anf).nome}` : ''}. Nome: ${res.nome}. ${res.obs ? `Observações: ${res.obs}.` : ''}`;
      const ok = $('[data-ok]', form.parentElement);
      $('[data-ok-txt]', ok).textContent = res.status === 'confirmada'
        ? `${e.nome} para ${p} ${p === 1 ? 'pessoa' : 'pessoas'}, ${quando}. A mesa fica guardada por 15 minutos. Envie também pelo WhatsApp para receber o lembrete no dia.`
        : `${e.nome} para ${p} pessoas, ${quando}. Envie o pedido pelo WhatsApp: a equipe responde em até 2 horas${e.sinal ? ' com a chave Pix do sinal' : ''} e confirma a reserva.`;
      $('[data-ok-wa]', ok).href = wa(texto);
      $('[data-ok-conta]', ok).href = logado ? 'conta.html#reservas' : 'cadastro.html';
      $('[data-ok-conta] span', ok).textContent = logado ? 'Ver na Área do cliente' : 'Criar conta para acompanhar';
      form.hidden = true; resumo.hidden = true; ok.hidden = false; ok.focus(); iguala();
      $('[data-ok-nova]', ok).onclick = () => { ok.hidden = true; form.hidden = false; resumo.hidden = false; horaSel = null; desenhaHoras(); atualiza(); form.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' }); };
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
      guarda.gravar('taioba-contatos', [...guarda.ler('taioba-contatos', []), { nome: el('nome').value, assunto: el('assunto').value, em: new Date().toISOString() }]);
      $('[data-ok]', fc).hidden = false;
      open(wa(`Olá! Sou ${el('nome').value.trim()}. Assunto: ${el('assunto').value}. ${el('msg').value.trim()}`), '_blank', 'noopener');
      fc.reset();
    });
  }

  // ================= ÁREA DO CLIENTE =================
  // entrar
  const fEntrar = $('[data-entrar]');
  if (fEntrar) {
    if (logado) location.replace(`conta.html${location.hash}`);
    $('[data-demo]', fEntrar).addEventListener('click', () => { fEntrar.elements.email.value = D.demo.email; fEntrar.elements.senha.value = D.demo.senha; fEntrar.elements.senha.focus(); });
    $('[data-esqueci]', fEntrar).addEventListener('click', () => toast('No site publicado, chega um link de troca de senha no e-mail. Na demonstração, use a conta de exemplo.'));
    fEntrar.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const email = fEntrar.elements.email.value.trim().toLowerCase(), senha = fEntrar.elements.senha.value;
      const c = Conta.contas()[email];
      const erro = $('[data-erro]', fEntrar);
      if (!c || c.senha !== senha) { erro.textContent = 'E-mail ou senha não conferem.'; fEntrar.elements.senha.select(); return; }
      Conta.entrar(email, fEntrar.elements.lembrar.checked);
      location.href = `conta.html${location.hash}`;
    });
  }
  // criar conta
  const fCad = $('[data-cadastro]');
  if (fCad) {
    if (logado) location.replace('conta.html');
    fCad.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const el = (n) => fCad.elements[n], erro = $('[data-erro]', fCad);
      const email = el('email').value.trim().toLowerCase();
      const falta = [];
      [['nome', el('nome').value.trim().split(' ').length > 1], ['telefone', el('telefone').value.replace(/\D/g, '').length >= 10], ['email', el('email').checkValidity() && !!email], ['senha', el('senha').value.length >= 6]]
        .forEach(([n, ok]) => { el(n).setAttribute('aria-invalid', String(!ok)); if (!ok) falta.push(el(n)); });
      erro.textContent = falta.length ? 'Confira os campos marcados (nome e sobrenome, WhatsApp com DDD, e-mail e senha de 6 caracteres).' : !el('lgpd').checked ? 'Para criar a conta, aceite os Termos de uso e a Política de privacidade.' : Conta.contas()[email] ? 'Já existe uma conta com esse e-mail. Entre por aqui: cliente.html' : '';
      if (erro.textContent) { (falta[0] || el('lgpd')).focus(); return; }
      const nova = { nome: el('nome').value.trim(), email, senha: el('senha').value, telefone: el('telefone').value.trim(), nascimento: el('nascimento').value, visitas: 0, prefs: { restricoes: [], obs: '', ambiente: '', avisos: el('avisos').checked }, reservas: [], pedidos: [], criada: agoraBR().iso };
      // reservas feitas antes de criar a conta, com o mesmo e-mail, passam para a conta
      const avulsas = guarda.ler('taioba-reservas', []);
      nova.reservas = avulsas.filter((r) => r.email.toLowerCase() === email);
      guarda.gravar('taioba-reservas', avulsas.filter((r) => r.email.toLowerCase() !== email));
      Conta.salvar(nova); Conta.entrar(email, true);
      location.href = 'conta.html';
    });
  }

  // conta
  if (pg === 'conta') {
    const eu = logado;
    if (!eu) { location.replace('cliente.html'); return; }
    const salvar = () => Conta.salvar(eu);
    const hoje = agoraBR().iso;
    const estado = (r) => (r.status === 'cancelada' ? 'cancelada' : r.data < hoje ? 'concluida' : r.status);
    const ROT = { confirmada: 'Confirmada', pendente: 'Aguardando confirmação', cancelada: 'Cancelada', concluida: 'Concluída' };
    const proximas = () => (eu.reservas || []).filter((r) => estado(r) === 'confirmada' || estado(r) === 'pendente').sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
    const passadas = () => (eu.reservas || []).filter((r) => estado(r) === 'concluida' || estado(r) === 'cancelada').sort((a, b) => b.data.localeCompare(a.data));
    $('[data-ola]').textContent = `Olá, ${eu.nome.split(' ')[0]}`;
    const cx = (id) => $(`[data-cx="${id}"]`);
    const folhaSvg = $('.conta-nav [data-conta-aba="inicio"] svg')?.outerHTML || '';
    const titulo = (t, sub, extra = '') => `<header class="cx-cab"><div><h1>${t}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${extra}</header>`;
    const itemRes = (r, acoes = true) => {
      const e = expDe(r.exp), d = dataCurta(r.data), st = estado(r);
      const futura = st === 'confirmada' || st === 'pendente';
      return `<article class="item-res">
        <p class="data"><small>${d.sem}</small><b>${d.dia}</b><small>${d.mes}</small></p>
        <div><h4>${esc(e?.nome || 'Reserva')}</h4><p>${r.hora}, ${r.pessoas} ${r.pessoas === 1 ? 'pessoa' : 'pessoas'}, ${esc(D.ambientes[r.amb] || '')}${r.anf ? `, com ${esc(pessoaDe(r.anf)?.nome || '')}` : ''}</p>${r.obs ? `<p>${esc(r.obs)}</p>` : ''}<span class="estado estado-${st}">${ROT[st]}</span></div>
        ${acoes ? `<div class="acoes">${futura ? `<a class="btn btn-vidro btn-p" href="${wa(`Olá! Quero remarcar minha reserva de ${dataLonga(r.data)} às ${r.hora} (${e?.nome}).`)}" target="_blank" rel="noopener"><span>Remarcar</span></a><button type="button" class="btn btn-perigo btn-p" data-cancelar="${r.id}"><span>Cancelar</span></button>` : `<a class="btn btn-vidro btn-p" href="index.html?exp=${r.exp}${r.anf ? `&anf=${r.anf}` : ''}#reservar"><span>Reservar de novo</span></a>`}</div>` : ''}
      </article>`;
    };

    const render = {
      inicio() {
        const p = proximas()[0];
        const v = eu.visitas || 0, marcadas = v % 10;
        cx('inicio').innerHTML = `${titulo(`Olá, ${esc(eu.nome.split(' ')[0])}`, 'Tudo da sua relação com o Taioba num lugar só.')}
          <div class="cx-duo">
            <div class="cx-card prox">${p ? `<p class="apoio" style="color:var(--milho);margin:0">Próxima reserva</p><h3>${esc(expDe(p.exp)?.nome || 'Reserva')}</h3><p class="quando">${dataLonga(p.data)}, ${p.hora}</p><p>${p.pessoas} ${p.pessoas === 1 ? 'pessoa' : 'pessoas'}, ${esc(D.ambientes[p.amb] || '')}${p.anf ? `, com ${esc(pessoaDe(p.anf).nome)}` : ''}. ${ROT[estado(p)]}.</p><div class="lgpd-acoes"><button type="button" class="btn btn-vidro btn-p" data-ir-aba="reservas"><span>Ver reservas</span></button><a class="btn btn-vidro btn-p" href="https://www.openstreetmap.org/directions?to=-19.91575%2C-43.9164" target="_blank" rel="noopener"><span>Como chegar</span></a></div>` : `<h3>Nenhuma reserva marcada</h3><p>Que tal um jantar esta semana?</p><a class="btn btn-vidro btn-p" href="index.html#reservar"><span>Fazer uma reserva</span></a>`}</div>
            <div class="cx-card caderno"><h3>Caderno de visitas</h3>
              <div class="caderno-folhas" aria-label="${marcadas} de 10 visitas marcadas">${Array.from({ length: 10 }, (_, k) => `<span class="${k < marcadas ? 'marcada' : ''}${k === 9 ? ' premio' : ''}" style="--i:${k}">${folhaSvg}</span>`).join('')}</div>
              <p>${marcadas === 9 ? 'Na próxima visita, a porção de mandioca é por conta da casa.' : `Faltam ${10 - marcadas} visitas para a porção de mandioca por conta da casa.`} Cada visita é marcada pela equipe na hora da conta. Total: ${v} ${v === 1 ? 'visita' : 'visitas'}.</p>
            </div>
          </div>
          <div class="cx-card"><h3>Atalhos</h3><div class="lgpd-acoes"><a class="btn btn-verde btn-p" href="index.html#reservar"><span>Nova reserva</span></a><button type="button" class="btn btn-vidro btn-p" data-ir-aba="encomendas"><span>Fazer encomenda</span></button><button type="button" class="btn btn-vidro btn-p" data-ir-aba="preferencias"><span>Minhas restrições</span></button></div></div>`;
      },
      reservas() {
        const prox = proximas(), pas = passadas();
        cx('reservas').innerHTML = `${titulo('Reservas', 'Cancele ou remarque sem custo até 2 horas antes; eventos privativos, até 7 dias antes.', '<a class="btn btn-verde btn-p" href="index.html#reservar"><span>Nova reserva</span></a>')}
          <h2 style="font-size:1.5rem">Próximas</h2>
          <div class="lista-res">${prox.length ? prox.map((r) => itemRes(r)).join('') : '<p class="vazio">Nenhuma reserva marcada.</p>'}</div>
          <h2 style="font-size:1.5rem">Histórico</h2>
          <div class="lista-res">${pas.length ? pas.map((r) => itemRes(r)).join('') : '<p class="vazio">As visitas aparecem aqui depois da data.</p>'}</div>`;
      },
      encomendas() {
        const cesta = render.cesta ||= {};
        const total = () => D.encomendas.reduce((s, e) => s + (cesta[e.id] || 0) * e.preco, 0);
        const itens = () => D.encomendas.filter((e) => cesta[e.id]);
        cx('encomendas').innerHTML = `${titulo('Para levar', 'Peça com 24 horas. Retire no bar ou receba nos bairros perto (taxa de R$ 12).')}
          <div class="enc-grade">${D.encomendas.map((e) => `<article class="enc-item"><h4>${esc(e.nome)}</h4><p>${esc(e.det)}</p><div class="enc-pe"><b>${reais(e.preco)}</b><span class="qtd"><button type="button" data-menos="${e.id}" aria-label="Tirar ${esc(e.nome)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg></button><output aria-live="polite">${cesta[e.id] || 0}</output><button type="button" data-mais="${e.id}" aria-label="Pôr ${esc(e.nome)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button></span></div></article>`).join('')}</div>
          <div class="sacola" ${itens().length ? '' : 'hidden'}><p>${itens().reduce((s, e) => s + cesta[e.id], 0)} itens, <b>${reais(total())}</b></p>
            <div class="sacola-form"><select data-entrega aria-label="Como receber"><option value="retirar">Retirar no restaurante</option><option value="entregar">Entregar (R$ 12)</option></select><input type="date" data-quando aria-label="Data" min="${somaDias(hoje, 1)}" value="${somaDias(hoje, 1)}" style="min-height:44px;padding:0 10px;border-radius:6px;border:0"><button type="button" class="btn btn-verde btn-p" data-pedir><span>Enviar pedido no WhatsApp</span></button></div></div>
          <h2 style="font-size:1.5rem">Pedidos anteriores</h2>
          <div class="lista-res">${(eu.pedidos || []).length ? [...eu.pedidos].sort((a, b) => b.data.localeCompare(a.data)).map((p) => { const d = dataCurta(p.data); const tot = p.itens.reduce((s, [id, q]) => s + q * (D.encomendas.find((x) => x.id === id)?.preco || 0), 0); return `<article class="item-res"><p class="data"><small>${d.sem}</small><b>${d.dia}</b><small>${d.mes}</small></p><div><h4>${p.itens.map(([id, q]) => `${q} ${esc(D.encomendas.find((x) => x.id === id)?.nome || id)}`).join(', ')}</h4><p>${reais(tot)}${p.entrega === 'entregar' ? ', entrega' : ', retirada'}</p><span class="estado estado-${p.status === 'enviado' ? 'pendente' : 'confirmada'}">${p.status === 'enviado' ? 'Pedido enviado' : 'Retirado'}</span></div><div class="acoes"><button type="button" class="btn btn-vidro btn-p" data-repetir="${p.id}"><span>Pedir de novo</span></button></div></article>`; }).join('') : '<p class="vazio">Nenhuma encomenda ainda.</p>'}</div>`;
      },
      preferencias() {
        const pr = eu.prefs || {};
        cx('preferencias').innerHTML = `${titulo('Preferências', 'Usadas para preencher suas reservas e avisar a cozinha. Alergias são dados sensíveis e só a equipe do dia vê.')}
          <form class="cx-card form-conta" data-prefs>
            <fieldset style="border:0;padding:0;margin:0"><legend class="campo"><span>Restrições e alergias</span></legend><div class="chk-grade">${D.restricoes.map(([id, n]) => `<label><input type="checkbox" name="r" value="${id}"${(pr.restricoes || []).includes(id) ? ' checked' : ''}><span>${n}</span></label>`).join('')}</div></fieldset>
            <label class="campo"><span>Ambiente preferido</span><select name="ambiente"><option value="">Tanto faz</option>${['salao', 'varanda'].map((a) => `<option value="${a}"${pr.ambiente === a ? ' selected' : ''}>${D.ambientes[a]}</option>`).join('')}</select></label>
            <label class="campo"><span>Observações para a equipe</span><textarea name="obs" rows="3" placeholder="Mesa perto da janela, cadeirão, prefere ponto mal passado...">${esc(pr.obs || '')}</textarea></label>
            <label class="aceite"><input type="checkbox" name="avisos"${pr.avisos ? ' checked' : ''}><span>Quero receber avisos de menus novos pelo WhatsApp.</span></label>
            <button type="submit" class="btn btn-verde" style="justify-self:start"><span>Salvar preferências</span></button>
          </form>`;
      },
      dados() {
        cx('dados').innerHTML = `${titulo('Meus dados', 'Seus dados pessoais e os direitos da LGPD.')}
          <form class="cx-card form-conta" data-meus>
            <div class="res-linha"><label class="campo"><span>Nome</span><input name="nome" value="${esc(eu.nome)}" required></label><label class="campo"><span>WhatsApp</span><input name="telefone" type="tel" value="${esc(eu.telefone || '')}" required></label></div>
            <div class="res-linha"><label class="campo"><span>E-mail</span><input value="${esc(eu.email)}" disabled></label><label class="campo"><span>Aniversário</span><input name="nascimento" type="date" value="${esc(eu.nascimento || '')}"></label></div>
            <label class="campo"><span>Nova senha (deixe em branco para manter)</span><input name="senha" type="password" minlength="6" autocomplete="new-password"></label>
            <p class="form-erro" data-erro role="alert"></p>
            <button type="submit" class="btn btn-verde" style="justify-self:start"><span>Salvar dados</span></button>
          </form>
          <div class="cx-card"><h3>Seus dados, suas regras</h3><p style="color:var(--tinta-2);margin-bottom:16px">Conta criada em ${dataLonga(eu.criada || hoje)}. Você pode baixar tudo o que guardamos ou apagar a conta, com as reservas e preferências, a qualquer momento.</p>
            <div class="lgpd-acoes"><button type="button" class="btn btn-vidro btn-p" data-baixar><span>Baixar meus dados</span></button><button type="button" class="btn btn-perigo btn-p" data-apagar><span>Apagar minha conta</span></button></div>
          </div>`;
      },
    };

    const abasConta = $$('[data-conta-aba]');
    const abreAba = (id) => {
      if (!render[id]) id = 'inicio';
      abasConta.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.contaAba === id)));
      $$('[data-cx]').forEach((s) => { s.hidden = s.dataset.cx !== id; });
      render[id]();
      history.replaceState(null, '', `#${id}`);
    };
    abasConta.forEach((b) => b.addEventListener('click', () => { abreAba(b.dataset.contaAba); scrollTo({ top: 0, behavior: reduz ? 'auto' : 'smooth' }); }));

    document.addEventListener('click', (e) => {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.irAba) abreAba(t.dataset.irAba);
      if (t.dataset.cancelar) {
        const r = eu.reservas.find((x) => x.id === t.dataset.cancelar), ex = expDe(r.exp);
        const horasAte = (new Date(`${r.data}T${r.hora}:00-03:00`) - new Date()) / 36e5;
        const aviso = ex.sinal && horasAte < 168 ? ' Faltam menos de 7 dias: o sinal vira crédito por 60 dias, conforme a política.' : '';
        if (!confirm(`Cancelar ${ex.nome} de ${dataLonga(r.data)}, às ${r.hora}?${aviso}`)) return;
        r.status = 'cancelada'; salvar(); render.reservas(); toast('Reserva cancelada. A equipe foi avisada.');
      }
      if (t.dataset.mais || t.dataset.menos) {
        const id = t.dataset.mais || t.dataset.menos, c = render.cesta ||= {};
        c[id] = Math.max(0, Math.min(20, (c[id] || 0) + (t.dataset.mais ? 1 : -1)));
        render.encomendas();
        $(`[data-${t.dataset.mais ? 'mais' : 'menos'}="${id}"]`)?.focus();
      }
      if (t.dataset.repetir) {
        const p = eu.pedidos.find((x) => x.id === t.dataset.repetir);
        render.cesta = Object.fromEntries(p.itens);
        render.encomendas(); toast('Itens colocados na sacola.');
      }
      if ('pedir' in t.dataset) {
        const c = render.cesta, itens = Object.entries(c).filter(([, q]) => q > 0);
        const entrega = $('[data-entrega]').value, quando = $('[data-quando]').value;
        const tot = itens.reduce((s, [id, q]) => s + q * D.encomendas.find((x) => x.id === id).preco, 0) + (entrega === 'entregar' ? 12 : 0);
        eu.pedidos = [...(eu.pedidos || []), { id: `p-${Date.now().toString(36)}`, itens, data: quando, entrega, status: 'enviado' }];
        salvar();
        open(wa(`Olá! Sou ${eu.nome}. Encomenda pela Área do cliente para ${dataLonga(quando)} (${entrega === 'entregar' ? 'entrega' : 'retirada'}): ${itens.map(([id, q]) => `${q} ${D.encomendas.find((x) => x.id === id).nome}`).join(', ')}. Total ${reais(tot)}.`), '_blank', 'noopener');
        render.cesta = {}; render.encomendas(); toast('Pedido enviado. A equipe confirma pelo WhatsApp.');
      }
      if ('baixar' in t.dataset) {
        const { senha, ...dados } = eu;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' }));
        a.download = 'meus-dados-taioba.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }
      if ('apagar' in t.dataset) {
        if (!confirm('Apagar a conta, as reservas, as encomendas e as preferências? Isso não pode ser desfeito.')) return;
        Conta.apagar(eu.email); location.href = 'index.html';
      }
      if ('sair' in t.dataset) { Conta.sair(); location.href = 'cliente.html'; }
    });
    document.addEventListener('submit', (e) => {
      if (e.target.matches('[data-prefs]')) {
        e.preventDefault();
        const f = e.target;
        eu.prefs = { restricoes: $$('[name="r"]:checked', f).map((x) => x.value), ambiente: f.elements.ambiente.value, obs: f.elements.obs.value.trim(), avisos: f.elements.avisos.checked };
        salvar(); toast('Preferências salvas. Elas já vêm preenchidas na próxima reserva.');
      }
      if (e.target.matches('[data-meus]')) {
        e.preventDefault();
        const f = e.target, erro = $('[data-erro]', f);
        if (f.elements.nome.value.trim().length < 3 || f.elements.telefone.value.replace(/\D/g, '').length < 10) { erro.textContent = 'Confira o nome e o WhatsApp com DDD.'; return; }
        if (f.elements.senha.value && f.elements.senha.value.length < 6) { erro.textContent = 'A senha precisa ter pelo menos 6 caracteres.'; return; }
        erro.textContent = '';
        eu.nome = f.elements.nome.value.trim(); eu.telefone = f.elements.telefone.value.trim(); eu.nascimento = f.elements.nascimento.value;
        if (f.elements.senha.value) eu.senha = f.elements.senha.value;
        salvar(); $('[data-ola]').textContent = `Olá, ${eu.nome.split(' ')[0]}`; f.elements.senha.value = ''; toast('Dados atualizados.');
      }
    });
    abreAba(location.hash.slice(1) || 'inicio');
  }
})();
