// Mecha Salão, Bronze: topo com sombra ao rolar, menu do celular, entrada suave dos blocos, avaliações com setas,
// barra rápida da capa e formulário de agendamento que montam a mensagem do WhatsApp, janelas legais e cookies.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const D = JSON.parse($('#dados')?.textContent || '{}');
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reais = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
  const wa = (msg) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`;
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const servPor = Object.fromEntries((D.servicos || []).map((s) => [s.id, s]));
  const guarda = {
    ler(k, padrao) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento: segue sem lembrar */ } },
  };
  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (t) => { if (!toastEl) return; toastEl.textContent = t; toastEl.classList.add('ve'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('ve'), 2800); };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const deIso = (s) => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
  const diaTxt = (s) => { const d = deIso(s); return `${DIAS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}`; };
  const fechado = (s) => !D.abertura?.[deIso(s).getDay()];
  const hoje = new Date(), limite = new Date(); limite.setDate(limite.getDate() + 60);
  $$('input[type="date"]').forEach((i) => { i.min = iso(hoje); i.max = iso(limite); });

  // ---------- grupos com o mesmo tamanho: mede o item mais largo e aplica em --larg ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    if (!g.offsetParent && getComputedStyle(g).position !== 'fixed') return;
    if (getComputedStyle(g).position === 'static') g.style.position = 'relative';
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
    if (maior) g.style.setProperty('--larg', `${Math.ceil(maior) + 2}px`);
  });
  let igualaT;
  const igualaDepois = () => { clearTimeout(igualaT); igualaT = setTimeout(iguala, 60); };
  addEventListener('resize', igualaDepois);
  if (document.fonts) document.fonts.ready.then(iguala);
  iguala();

  // ---------- lista e calendário próprios (no lugar do dropdown e do calendário do navegador) ----------
  // O campo original continua no formulário guardando o valor; a peça nova só escolhe e dispara "change" nele.
  const SVG = (d) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICO = { baixo: SVG('<path d="M6.5 9.5 12 15l5.5-5.5"/>'), esq: SVG('<path d="M14.5 6 8.5 12l6 6"/>'), dir: SVG('<path d="M9.5 6l6 6-6 6"/>'), cal: SVG('<path d="M4 5.5h16v14.5H4zM4 10h16M8.5 3.5v4M15.5 3.5v4"/>') };
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const DIAS_C = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  let aberto = null, uid = 0;
  const fecha = (foca) => { if (!aberto) return; const a = aberto; aberto = null; a.caixa.classList.remove('abre'); a.btn.setAttribute('aria-expanded', 'false'); if (foca) a.btn.focus(); };
  const abre = (peca) => {
    if (aberto && aberto !== peca) fecha();
    aberto = peca;
    peca.btn.setAttribute('aria-expanded', 'true');
    // abre para cima quando não cabe embaixo
    // a lista prefere abrir para baixo e encolhe até caber; o calendário (altura fixa) só desce se couber inteiro
    const r = peca.btn.getBoundingClientRect();
    const baixo = innerHeight - r.bottom - 20, cima = r.top - 90;
    const ehCal = peca.caixa.classList.contains('cal');
    const acima = ehCal ? baixo < 380 && cima > baixo : baixo < 240 && cima > baixo;
    peca.caixa.classList.toggle('acima', acima);
    if (!ehCal) peca.caixa.style.maxHeight = `${Math.max(200, Math.min(360, acima ? cima : baixo))}px`;
    peca.caixa.classList.add('abre');
  };
  document.addEventListener('pointerdown', (e) => { if (aberto && !aberto.raiz.contains(e.target)) fecha(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && aberto) { e.stopPropagation(); fecha(true); } });

  const montaLista = (sel) => {
    const id = `lista-${++uid}`;
    const raiz = document.createElement('div'); raiz.className = 'escolha';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'escolha-btn';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
    const rot = sel.closest('label')?.querySelector('span');
    if (rot) { rot.id ||= `${id}-rot`; btn.setAttribute('aria-labelledby', `${rot.id} ${id}-txt`); }
    btn.innerHTML = `<span class="escolha-txt" id="${id}-txt"></span>${ICO.baixo}`;
    const caixa = document.createElement('div'); caixa.className = 'escolha-caixa'; caixa.id = id; caixa.setAttribute('role', 'listbox'); caixa.tabIndex = -1;
    const vazio = sel.querySelector('option[value=""]')?.textContent || 'Escolha';
    caixa.innerHTML = [...sel.querySelectorAll('optgroup')].map((g) => `<div role="group" aria-label="${g.label}"><p class="escolha-grupo">${g.label}</p>${[...g.querySelectorAll('option')].map((o) => {
      const s = servPor[o.value];
      return `<div class="escolha-op" role="option" id="${id}-${o.value}" data-v="${o.value}" aria-selected="false"><span>${o.textContent}${s?.quimica ? '<small>teste de mecha antes</small>' : ''}</span>${s ? `<em>${s.de ? '<small>a partir de</small>' : ''}${reais(s.preco)}</em>` : ''}</div>`;
    }).join('')}</div>`).join('');
    const ops = $$('.escolha-op', caixa);
    let ativo = -1;
    const marcaAtivo = (k) => {
      ativo = Math.max(0, Math.min(ops.length - 1, k));
      ops.forEach((o, i) => o.classList.toggle('foco', i === ativo));
      caixa.setAttribute('aria-activedescendant', ops[ativo].id);
      ops[ativo].scrollIntoView({ block: 'nearest' });
    };
    const mostra = () => {
      const o = sel.selectedOptions[0];
      $('.escolha-txt', btn).textContent = sel.value ? o.textContent : vazio;
      btn.classList.toggle('vazio', !sel.value);
      ops.forEach((x) => x.setAttribute('aria-selected', String(x.dataset.v === sel.value)));
    };
    const escolhe = (v) => { sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true })); fecha(true); };
    const peca = { raiz, btn, caixa };
    btn.addEventListener('click', () => {
      if (aberto === peca) return fecha();
      abre(peca); caixa.focus({ preventScroll: true });
      marcaAtivo(Math.max(0, ops.findIndex((o) => o.dataset.v === sel.value)));
    });
    btn.addEventListener('keydown', (e) => { if (['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); btn.click(); } });
    caixa.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); marcaAtivo(ativo + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); marcaAtivo(ativo - 1); }
      else if (e.key === 'Home') { e.preventDefault(); marcaAtivo(0); }
      else if (e.key === 'End') { e.preventDefault(); marcaAtivo(ops.length - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (ops[ativo]) escolhe(ops[ativo].dataset.v); }
      else if (e.key === 'Tab') fecha();
      else if (e.key.length === 1) { const k = ops.findIndex((o, i) => i > ativo && o.textContent.toLowerCase().startsWith(e.key.toLowerCase())); const k2 = k >= 0 ? k : ops.findIndex((o) => o.textContent.toLowerCase().startsWith(e.key.toLowerCase())); if (k2 >= 0) marcaAtivo(k2); }
    });
    ops.forEach((o, i) => { o.addEventListener('click', () => escolhe(o.dataset.v)); o.addEventListener('pointermove', () => { if (ativo !== i) marcaAtivo(i); }); });
    sel.addEventListener('change', mostra);
    sel.classList.add('nativo'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    raiz.append(btn, caixa); sel.after(raiz);
    mostra();
  };

  const montaCalendario = (inp) => {
    const id = `cal-${++uid}`;
    const raiz = document.createElement('div'); raiz.className = 'escolha';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'escolha-btn';
    btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
    const rot = inp.closest('label')?.querySelector('span');
    if (rot) { rot.id ||= `${id}-rot`; btn.setAttribute('aria-labelledby', `${rot.id} ${id}-txt`); }
    btn.innerHTML = `<span class="escolha-txt" id="${id}-txt"></span>${ICO.cal}`;
    const caixa = document.createElement('div'); caixa.className = 'escolha-caixa cal'; caixa.id = id; caixa.setAttribute('role', 'dialog'); caixa.setAttribute('aria-label', 'Escolher o dia');
    const min = deIso(inp.min), max = deIso(inp.max);
    let mes = new Date(min.getFullYear(), min.getMonth(), 1), foco = null;
    const pode = (d) => d >= min && d <= max && !!D.abertura?.[d.getDay()];
    const desenha = () => {
      const ano = mes.getFullYear(), m = mes.getMonth();
      const primeiro = new Date(ano, m, 1).getDay(), total = new Date(ano, m + 1, 0).getDate();
      const cel = [];
      for (let k = 0; k < primeiro; k++) cel.push('<span></span>');
      for (let d = 1; d <= total; d++) {
        const dt = new Date(ano, m, d), v = iso(dt), ok = pode(dt);
        const fechadoDia = dt >= min && dt <= max && !D.abertura?.[dt.getDay()];
        cel.push(`<button type="button" class="dia${v === iso(hoje) ? ' hoje' : ''}${v === inp.value ? ' sel' : ''}${fechadoDia ? ' fechado' : ''}" data-v="${v}" ${ok ? '' : 'aria-disabled="true"'} tabindex="${v === foco ? 0 : -1}" aria-label="${d} de ${MESES[m]}, ${DIAS[dt.getDay()]}${fechadoDia ? ', fechado' : ''}"${v === inp.value ? ' aria-pressed="true"' : ''}>${d}</button>`);
      }
      const antes = new Date(ano, m, 0) >= min, depois = new Date(ano, m + 1, 1) <= max;
      caixa.innerHTML = `<div class="cal-cab"><button type="button" class="cal-seta" data-mes="-1" aria-label="Mês anterior" ${antes ? '' : 'disabled'}>${ICO.esq}</button><p aria-live="polite">${MESES[m]} <span>${ano}</span></p><button type="button" class="cal-seta" data-mes="1" aria-label="Próximo mês" ${depois ? '' : 'disabled'}>${ICO.dir}</button></div>
        <div class="cal-sem" aria-hidden="true">${DIAS_C.map((d) => `<span>${d}</span>`).join('')}</div>
        <div class="cal-dias">${cel.join('')}</div>
        <p class="cal-nota">Fechado aos domingos e segundas.</p>`;
    };
    // primeiro dia livre a partir de uma data
    const proximoLivre = (d, passo = 1) => { const x = new Date(d); for (let k = 0; k < 70; k++) { if (pode(x)) return x; x.setDate(x.getDate() + passo); } return null; };
    const focaDia = (v) => { foco = v; const d = deIso(v); if (d.getMonth() !== mes.getMonth() || d.getFullYear() !== mes.getFullYear()) mes = new Date(d.getFullYear(), d.getMonth(), 1); desenha(); $(`[data-v="${v}"]`, caixa)?.focus(); };
    const mostra = () => {
      $('.escolha-txt', btn).textContent = inp.value ? (() => { const d = deIso(inp.value); return `${DIAS_C[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`; })() : 'Escolha o dia';
      btn.classList.toggle('vazio', !inp.value);
    };
    const peca = { raiz, btn, caixa };
    btn.addEventListener('click', () => {
      if (aberto === peca) return fecha();
      const base = inp.value ? deIso(inp.value) : proximoLivre(min) || min;
      foco = iso(base); mes = new Date(base.getFullYear(), base.getMonth(), 1);
      desenha(); abre(peca);
      $(`[data-v="${foco}"]`, caixa)?.focus({ preventScroll: true });
    });
    caixa.addEventListener('click', (e) => {
      const s = e.target.closest('[data-mes]');
      if (s) { mes = new Date(mes.getFullYear(), mes.getMonth() + +s.dataset.mes, 1); desenha(); return; }
      const d = e.target.closest('.dia');
      if (d && !d.hasAttribute('aria-disabled')) { inp.value = d.dataset.v; inp.dispatchEvent(new Event('change', { bubbles: true })); fecha(true); }
    });
    caixa.addEventListener('keydown', (e) => {
      const d = e.target.closest('.dia'); if (!d) return;
      const passos = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      if (passos[e.key]) {
        e.preventDefault();
        const n = deIso(d.dataset.v); n.setDate(n.getDate() + passos[e.key]);
        const alvo = n < min ? min : n > max ? max : n;
        focaDia(iso(alvo));
      } else if (e.key === 'PageDown' || e.key === 'PageUp') {
        e.preventDefault(); const n = deIso(d.dataset.v); n.setMonth(n.getMonth() + (e.key === 'PageDown' ? 1 : -1));
        focaDia(iso(n < min ? min : n > max ? max : n));
      }
    });
    inp.addEventListener('change', mostra);
    inp.type = 'hidden';
    raiz.append(btn, caixa); inp.after(raiz);
    mostra();
  };
  $$('select[data-lista]').forEach(montaLista);
  $$('input[data-cal]').forEach(montaCalendario);

  // ---------- topo: sombra ao rolar e menu do celular ----------
  const topo = $('.topo'), menu = $('#menu'), menuBtn = $('.menu-btn');
  const sombra = () => topo.classList.toggle('rolou', scrollY > 8);
  addEventListener('scroll', sombra, { passive: true }); sombra();
  const fechaMenu = () => { menu.classList.remove('abre'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Abrir o menu'); };
  menuBtn?.addEventListener('click', () => {
    const abre = !menu.classList.contains('abre');
    menu.classList.toggle('abre', abre);
    menuBtn.setAttribute('aria-expanded', String(abre));
    menuBtn.setAttribute('aria-label', abre ? 'Fechar o menu' : 'Abrir o menu');
  });
  $$('a', menu).forEach((a) => a.addEventListener('click', fechaMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('abre')) { fechaMenu(); menuBtn.focus(); } });
  document.addEventListener('click', (e) => { if (menu.classList.contains('abre') && !topo.contains(e.target)) fechaMenu(); });

  // ---------- entrada suave dos blocos ----------
  const revs = $$('.rev');
  if (reduz || !('IntersectionObserver' in window)) revs.forEach((el) => el.classList.add('ve'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('ve'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    revs.forEach((el) => io.observe(el));
  }

  // ---------- avaliações: setas, arrastar no celular e troca sozinha enquanto visível ----------
  const avals = $$('.aval'), fotos = $$('.aval-fotos img');
  let atual = 0, autoT;
  const mostra = (n) => {
    atual = (n + avals.length) % avals.length;
    avals.forEach((a, k) => { a.classList.toggle('on', k === atual); a.hidden = k !== atual; });
    fotos.forEach((f, k) => f.classList.toggle('on', k === atual));
  };
  const auto = () => { clearInterval(autoT); if (!reduz) autoT = setInterval(() => mostra(atual + 1), 7000); };
  $$('[data-aval]').forEach((b) => b.addEventListener('click', () => { mostra(atual + +b.dataset.aval); auto(); }));
  const cartao = $('.aval-cartao');
  if (cartao) {
    let x0 = null;
    cartao.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    cartao.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { mostra(atual + (dx < 0 ? 1 : -1)); auto(); }
    });
    cartao.addEventListener('mouseenter', () => clearInterval(autoT));
    cartao.addEventListener('mouseleave', auto);
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => (e.isIntersecting ? auto() : clearInterval(autoT))).observe(cartao);
  }

  // ---------- horário de hoje em destaque ----------
  $(`.horas tr[data-dia="${hoje.getDay()}"]`)?.classList.add('hoje');

  // ---------- barra rápida da capa: vai direto para o WhatsApp ----------
  const rapido = $('#form-rapido');
  rapido?.addEventListener('submit', (e) => {
    e.preventDefault();
    const s = servPor[rapido.servico.value], d = rapido.data.value;
    if (d && fechado(d)) { toast(`Não abrimos às ${DIAS[deIso(d).getDay()]}s. Escolha outro dia.`); return; }
    const msg = [`Olá! Quero agendar no ${D.nome}.`, s ? `Serviço: ${s.nome} (${s.de ? 'a partir de ' : ''}${reais(s.preco)})` : '', d ? `Melhor dia: ${diaTxt(d)}` : '', 'Quais horários vocês têm?'].filter(Boolean).join('\n');
    window.open(wa(msg), '_blank', 'noopener');
  });

  // ---------- agendamento ----------
  const form = $('#form-agenda');
  if (form) {
    const f = form.elements;
    const avisoQ = $('[data-aviso-quimica]', form);
    const escolhe = (id) => { f.servico.value = id; f.servico.dispatchEvent(new Event('change', { bubbles: true })); };
    f.servico.addEventListener('change', () => { avisoQ.hidden = !servPor[f.servico.value]?.quimica; });
    f.data.addEventListener('change', () => { if (f.data.value && fechado(f.data.value)) toast(`Não abrimos às ${DIAS[deIso(f.data.value).getDay()]}s. Escolha outro dia.`); });
    $$('[data-servico]').forEach((a) => a.addEventListener('click', () => {
      if (!servPor[a.dataset.servico]) return;
      escolhe(a.dataset.servico);
      toast(`${servPor[a.dataset.servico].nome} selecionado. Agora é só escolher o dia.`);
    }));

    const erro = $('.form-erro', form), ok = $('.form-ok', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      $$('.erro', form).forEach((x) => x.classList.remove('erro'));
      const faltam = [];
      const marca = (campo, nome) => { (campo.closest('fieldset') || campo.closest('label'))?.classList.add('erro'); faltam.push(nome); };
      if (!f.nome.value.trim()) marca(f.nome, 'nome');
      if (f.tel.value.replace(/\D/g, '').length < 10) marca(f.tel, 'telefone com DDD');
      if (f.email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value)) marca(f.email, 'e-mail válido');
      if (!f.servico.value) marca(f.servico, 'serviço');
      if (!f.data.value) marca(f.data, 'dia');
      else if (fechado(f.data.value)) marca(f.data, 'um dia em que o salão abre (terça a sábado)');
      const periodo = form.querySelector('input[name="periodo"]:checked');
      if (!periodo) marca(form.querySelector('input[name="periodo"]'), 'período');
      if (!f.lgpd.checked) faltam.push('o aceite da Política de Privacidade');
      if (faltam.length) { erro.hidden = false; erro.textContent = `Falta preencher: ${faltam.join(', ')}.`; ok.hidden = true; return; }
      erro.hidden = true;
      const s = servPor[f.servico.value];
      const quando = `${diaTxt(f.data.value)}, de ${periodo.value}`;
      const msg = [
        `Olá! Quero pedir um horário no ${D.nome}.`,
        `Nome: ${f.nome.value.trim()}`, `Telefone: ${f.tel.value.trim()}`, f.email.value ? `E-mail: ${f.email.value.trim()}` : '',
        `Serviço: ${s.nome} (${s.de ? 'a partir de ' : ''}${reais(s.preco)})`, `Quando: ${quando}`,
        f.obs.value.trim() ? `Observações: ${f.obs.value.trim()}` : '',
        `Aceito a Política de Privacidade. Novidades pelo WhatsApp: ${f.novidades.checked ? 'sim' : 'não'}.`,
      ].filter(Boolean).join('\n');
      window.open(wa(msg), '_blank', 'noopener');
      ok.hidden = false;
      ok.innerHTML = `<b>Pedido pronto para envio</b><span>${s.nome}, ${quando}. O WhatsApp abriu com a mensagem; é só enviar. Respondemos com os horários livres em até uma hora, no horário de funcionamento.</span>`;
      toast('Pedido montado. Confira no WhatsApp.');
    });
  }

  // ---------- janelas legais e cookies ----------
  $$('[data-doc]').forEach((b) => b.addEventListener('click', () => { const d = $(`#doc-${b.dataset.doc}`); if (d?.showModal) d.showModal(); }));
  $$('dialog.doc').forEach((d) => {
    $('[data-fecha]', d).addEventListener('click', () => d.close());
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });
  const ck = $('#cookies');
  if (ck) {
    if (!guarda.ler('mecha-salao-cookies', null)) { ck.hidden = false; igualaDepois(); }
    $$('[data-ck]', ck).forEach((b) => b.addEventListener('click', () => { guarda.gravar('mecha-salao-cookies', { escolha: b.dataset.ck, em: Date.now() }); ck.hidden = true; }));
    $$('[data-cookies]').forEach((b) => b.addEventListener('click', () => { ck.hidden = false; igualaDepois(); }));
  }
})();
