// Mecha Salão, Silver: o que o site e a Área do cliente têm em comum (atalhos, aviso, grupos do mesmo tamanho,
// janelas legais, cookies e as peças de HTML montadas com os dados em uso).
const Comum = (() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const Loja = window.MechaLoja;
  const D = Loja.D;
  const L = Loja.ler();
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const guarda = {
    ler(k, padrao) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento: segue sem lembrar */ } },
  };
  const numeroWa = () => `55${String(L.empresa.whatsapp || '').replace(/\D/g, '')}`;
  const wa = (msg) => `https://wa.me/${numeroWa()}?text=${encodeURIComponent(msg)}`;
  const fotoSrc = (n) => (!n ? '' : /^(data:|https?:)/.test(n) ? n : `assets/img/${n}.webp`);
  const I = { ...D.ic, simbolo: () => D.simbolo };
  const P = window.MechaPartes({ I, fotoSrc, wa });

  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (t) => { if (!toastEl) return; toastEl.textContent = t; toastEl.classList.add('ve'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('ve'), 3000); };

  // grupos com o mesmo tamanho: mede o item mais largo e aplica em --larg
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

  // entrada suave dos blocos (uma vez); o atraso dos vizinhos sai da posição no grupo
  let io;
  const revela = (raiz = document) => {
    const els = $$('.rev, .sv-grade', raiz).filter((el) => !el.classList.contains('ve'));
    if (reduz || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('ve')); return; }
    io ||= new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('ve'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => {
      if (el.classList.contains('sv-grade')) [...el.children].forEach((c, k) => c.style.setProperty('--d', `${(k % 4) * 0.08}s`));
      else if (!el.style.getPropertyValue('--d')) {
        const irmaos = [...el.parentElement.children].filter((x) => x.classList.contains('rev'));
        const k = irmaos.indexOf(el);
        if (irmaos.length > 1 && k > 0) el.style.setProperty('--d', `${Math.min(k, 5) * 0.08}s`);
      }
      io.observe(el);
    });
  };

  // janelas legais e aviso de cookies
  const janelas = () => {
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
      if (!guarda.ler('mecha-salao-cookies', null)) { ck.hidden = false; igualaDepois(); }
      $$('[data-ck]', ck).forEach((b) => b.addEventListener('click', () => { guarda.gravar('mecha-salao-cookies', { escolha: b.dataset.ck, em: Date.now() }); ck.hidden = true; }));
      $$('[data-cookies]').forEach((b) => b.addEventListener('click', () => { ck.hidden = false; igualaDepois(); }));
    }
  };

  return { $, $$, Loja, D, L, reduz, guarda, wa, fotoSrc, I, P, toast, iguala, igualaDepois, revela, janelas };
})();

// Mecha Salão, Silver (site): aplica o que a Área do cliente salvou, topo que some e volta, entrada dos blocos,
// paralaxe, menu de segmentos, contadores, carrossel da equipe, antes e depois, avaliações, galeria com filtros
// e o agendamento com serviço, profissional, dia e horário que monta a mensagem do WhatsApp.
(() => {
  const { $, $$, Loja, D, L, reduz, wa, P, toast, iguala, igualaDepois, revela, janelas } = Comum;
  const pg = D.pagina;
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const ativos = P.ativos;
  const servicos = () => ativos(L.servicos);
  const servPor = () => Object.fromEntries(servicos().map((s) => [s.id, s]));
  const equipe = () => ativos(L.equipe);
  const abertura = P.abertura(L.horario);

  // ---------- 1. o que o painel salvou entra no lugar do HTML do build ----------
  if (Loja.lerSalvo()) {
    const E = L.empresa;
    const nav = $('[data-seg-nav]');
    if (nav) nav.innerHTML = `<i class="seg-nav-marca" aria-hidden="true"></i>${P.segNav(L)}`;
    const segs = $('[data-servicos]');
    if (segs) segs.innerHTML = P.servicosHtml(L);
    const sel = $('#form-agenda select[name="servico"]');
    if (sel) sel.innerHTML = `<option value="">Escolha o serviço</option>${P.opcoes(L)}`;
    const pros = $('[data-pros-lista]');
    if (pros) pros.innerHTML = equipe().map(P.proCard).join('');
    const membros = $('[data-membros]');
    if (membros) membros.innerHTML = equipe().map((m, k) => P.membro(m, L, k)).join('');
    const prods = $('[data-produtos]');
    if (prods) prods.innerHTML = ativos(L.produtos).map((p) => P.produto(p, E.nome)).join('');
    $$('[data-emp]').forEach((el) => { const v = E[el.dataset.emp]; if (v != null && v !== '') el.textContent = v; });
    $$('[data-emp-end]').forEach((el) => { el.textContent = `${E.endereco}, ${E.bairro}, ${E.cidade}, ${E.uf}, CEP ${E.cep}`; });
    $$('[data-emp-tel]').forEach((a) => { a.href = `tel:${P.soNumeros(E.telefone)}`; });
    $$('[data-emp-mail]').forEach((a) => { a.href = `mailto:${E.email}${a.href.includes('?') ? a.href.slice(a.href.indexOf('?')) : ''}`; });
    $$('[data-wa]').forEach((a) => { a.href = wa(a.dataset.wa); });
    $$('[data-horario-curto]').forEach((el) => { el.textContent = P.horarioCurto(L.horario); });
    $$('[data-horas]').forEach((el) => { el.innerHTML = P.horasLinhas(L.horario); });
  }

  // ---------- 2. topo: sombra, some ao descer e volta ao subir; menu do celular ----------
  const raiz = document.documentElement;
  const topo = $('.topo'), menu = $('#menu'), menuBtn = $('.menu-btn');
  let ultimoY = scrollY;
  const aoRolar = () => {
    const y = scrollY;
    topo?.classList.toggle('rolou', y > 8);
    const desce = y > ultimoY + 4, sobe = y < ultimoY - 4;
    if (desce && y > 320 && !menu?.classList.contains('abre')) raiz.classList.add('topo-some');
    else if (sobe || y < 120) raiz.classList.remove('topo-some');
    if (desce || sobe) ultimoY = y;
  };
  addEventListener('scroll', aoRolar, { passive: true }); aoRolar();
  const fechaMenu = () => { menu?.classList.remove('abre'); menuBtn?.setAttribute('aria-expanded', 'false'); menuBtn?.setAttribute('aria-label', 'Abrir o menu'); };
  menuBtn?.addEventListener('click', () => {
    const abre = !menu.classList.contains('abre');
    menu.classList.toggle('abre', abre);
    menuBtn.setAttribute('aria-expanded', String(abre));
    menuBtn.setAttribute('aria-label', abre ? 'Fechar o menu' : 'Abrir o menu');
    if (abre) igualaDepois();
  });
  $$('a', menu || document.createElement('div')).forEach((a) => a.addEventListener('click', fechaMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu?.classList.contains('abre')) { fechaMenu(); menuBtn.focus(); } });
  document.addEventListener('click', (e) => { if (menu?.classList.contains('abre') && !topo.contains(e.target)) fechaMenu(); });

  // ---------- 3. paralaxe da capa e das tendências ----------
  const capaFoto = $('.capa-foto img');
  const looks = $$('.look');
  let rafP = 0;
  const paralaxe = () => {
    rafP = 0;
    if (capaFoto && scrollY < innerHeight * 1.2) capaFoto.style.setProperty('--rolagem', (scrollY * 0.22).toFixed(1));
    for (const l of looks) {
      const r = l.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      const centro = r.top + r.height / 2 - innerHeight / 2;
      l.querySelector('.look-foto').style.setProperty('--py', `${(centro * +l.dataset.vel).toFixed(1)}px`);
    }
  };
  if (!reduz) { addEventListener('scroll', () => { rafP ||= requestAnimationFrame(paralaxe); }, { passive: true }); paralaxe(); }

  // ---------- 4. menu de segmentos: marca o segmento à vista e desliza o fundo ----------
  const segNav = $('[data-seg-nav]');
  if (segNav && 'IntersectionObserver' in window) {
    const marca = $('.seg-nav-marca', segNav);
    const ativa = (id) => {
      const a = $(`[data-nav-seg="${id}"]`, segNav);
      $$('a', segNav).forEach((x) => x.classList.toggle('ativo', x === a));
      if (!a) return;
      if (marca) { segNav.style.setProperty('--mt', `${a.offsetTop}px`); segNav.style.setProperty('--mh', `${a.offsetHeight}px`); segNav.style.setProperty('--mo', '1'); }
      if (segNav.scrollWidth > segNav.clientWidth) segNav.scrollTo({ left: a.offsetLeft - 16, behavior: reduz ? 'auto' : 'smooth' });
    };
    const vistos = new Map();
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => vistos.set(e.target.dataset.seg, e.isIntersecting ? e.intersectionRatio : 0));
      const melhor = [...vistos].filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])[0];
      if (melhor) ativa(melhor[0]);
    }, { rootMargin: '-30% 0px -45% 0px', threshold: [0, 0.1, 0.3, 0.6, 1] });
    $$('.seg').forEach((s) => obs.observe(s));
  }

  // ---------- 5. contadores (contam ao entrar na tela) ----------
  const conta = (el) => {
    const alvo = +el.dataset.conta, dec = el.dataset.dec ? 1 : 0, t0 = performance.now(), dur = 1600;
    const passo = (t) => {
      const p = Math.min(1, (t - t0) / dur), v = alvo * (1 - Math.pow(1 - p, 3));
      el.textContent = dec ? v.toFixed(1).replace('.', ',') : Math.round(v).toLocaleString('pt-BR');
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };
  const conts = $$('[data-conta]');
  if (conts.length && !reduz && 'IntersectionObserver' in window) {
    const oc = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { conta(e.target); oc.unobserve(e.target); } }), { threshold: 0.6 });
    conts.forEach((c) => { c.textContent = '0'; oc.observe(c); });
  }

  // ---------- 6. carrossel da equipe ----------
  const lista = $('[data-pros-lista]');
  if (lista) {
    const btns = $$('[data-pros]');
    const estado = () => {
      const fim = lista.scrollWidth - lista.clientWidth - 4;
      btns.forEach((b) => { b.disabled = +b.dataset.pros < 0 ? lista.scrollLeft <= 4 : lista.scrollLeft >= fim; });
    };
    btns.forEach((b) => b.addEventListener('click', () => {
      const card = lista.querySelector('.pro');
      const passo = card ? card.getBoundingClientRect().width + 20 : 300;
      lista.scrollBy({ left: passo * +b.dataset.pros, behavior: reduz ? 'auto' : 'smooth' });
    }));
    lista.addEventListener('scroll', () => requestAnimationFrame(estado), { passive: true });
    addEventListener('resize', estado); estado();
    // arrastar com o mouse
    let x0 = null, s0 = 0, moveu = false;
    lista.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; x0 = e.clientX; s0 = lista.scrollLeft; moveu = false; lista.style.scrollSnapType = 'none'; });
    addEventListener('pointermove', (e) => { if (x0 === null) return; const dx = e.clientX - x0; if (Math.abs(dx) > 4) moveu = true; lista.scrollLeft = s0 - dx; });
    addEventListener('pointerup', () => { if (x0 === null) return; x0 = null; lista.style.scrollSnapType = ''; });
    lista.addEventListener('click', (e) => { if (moveu) { e.preventDefault(); moveu = false; } }, true);
  }

  // ---------- 7. antes e depois arrastável ----------
  $$('[data-comparar]').forEach((c) => {
    const r = $('input', c);
    const poe = () => c.style.setProperty('--pos', `${r.value}%`);
    r.addEventListener('input', poe); poe();
  });

  // ---------- 8. avaliações: pausar as faixas ----------
  const pausa = $('[data-pausa]'), faixa = $('.aval-faixa');
  pausa?.addEventListener('click', () => {
    const p = !faixa.classList.contains('pausado');
    faixa.classList.toggle('pausado', p);
    pausa.setAttribute('aria-pressed', String(p));
    pausa.textContent = p ? 'Retomar as avaliações' : 'Pausar as avaliações';
  });
  if (reduz && faixa) faixa.classList.add('pausado');

  // ---------- 9. horário de hoje em destaque ----------
  const hoje = new Date();
  $$(`.horas tr[data-dia="${hoje.getDay()}"]`).forEach((tr) => tr.classList.add('hoje'));

  // ---------- 10. lista e calendário próprios ----------
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const deIso = (s) => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
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
    const r = peca.btn.getBoundingClientRect();
    const baixo = innerHeight - r.bottom - 20, cima = r.top - 90;
    const ehCal = peca.caixa.classList.contains('cal');
    const acima = ehCal ? baixo < 400 && cima > baixo : baixo < 240 && cima > baixo;
    peca.caixa.classList.toggle('acima', acima);
    if (!ehCal) peca.caixa.style.maxHeight = `${Math.max(200, Math.min(380, acima ? cima : baixo))}px`;
    peca.caixa.classList.add('abre');
  };
  document.addEventListener('pointerdown', (e) => { if (aberto && !aberto.raiz.contains(e.target)) fecha(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && aberto) { e.stopPropagation(); fecha(true); } });

  const montaLista = (sel) => {
    const id = `lista-${++uid}`;
    const SP = servPor();
    const raizL = document.createElement('div'); raizL.className = 'escolha';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'escolha-btn';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
    const rot = sel.closest('label')?.querySelector('span');
    if (rot) { rot.id ||= `${id}-rot`; btn.setAttribute('aria-labelledby', `${rot.id} ${id}-txt`); }
    btn.innerHTML = `<span class="escolha-txt" id="${id}-txt"></span>${ICO.baixo}`;
    const caixa = document.createElement('div'); caixa.className = 'escolha-caixa'; caixa.id = id; caixa.setAttribute('role', 'listbox'); caixa.tabIndex = -1;
    const vazio = sel.querySelector('option[value=""]')?.textContent || 'Escolha';
    caixa.innerHTML = [...sel.querySelectorAll('optgroup')].map((g) => `<div role="group" aria-label="${g.label}"><p class="escolha-grupo">${g.label}</p>${[...g.querySelectorAll('option')].map((o) => {
      const s = SP[o.value];
      return `<div class="escolha-op" role="option" id="${id}-${o.value}" data-v="${o.value}" aria-selected="false"><span>${o.textContent}${s ? `<small>${P.minutos(s.min)}${s.quimica ? ', teste 48h antes' : ''}</small>` : ''}</span>${s ? `<em>${s.de ? '<small>a partir de</small>' : ''}${P.reais(s.preco)}</em>` : ''}</div>`;
    }).join('')}</div>`).join('');
    const ops = $$('.escolha-op', caixa);
    let at = -1;
    const marcaAt = (k) => {
      at = Math.max(0, Math.min(ops.length - 1, k));
      ops.forEach((o, i) => o.classList.toggle('foco', i === at));
      caixa.setAttribute('aria-activedescendant', ops[at].id);
      ops[at].scrollIntoView({ block: 'nearest' });
    };
    const mostra = () => {
      $('.escolha-txt', btn).textContent = sel.value ? sel.selectedOptions[0].textContent : vazio;
      btn.classList.toggle('vazio', !sel.value);
      ops.forEach((x) => x.setAttribute('aria-selected', String(x.dataset.v === sel.value)));
    };
    const escolhe = (v) => { sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true })); fecha(true); };
    const peca = { raiz: raizL, btn, caixa };
    btn.addEventListener('click', () => {
      if (aberto === peca) return fecha();
      abre(peca); caixa.focus({ preventScroll: true });
      marcaAt(Math.max(0, ops.findIndex((o) => o.dataset.v === sel.value)));
    });
    btn.addEventListener('keydown', (e) => { if (['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); btn.click(); } });
    caixa.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); marcaAt(at + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); marcaAt(at - 1); }
      else if (e.key === 'Home') { e.preventDefault(); marcaAt(0); }
      else if (e.key === 'End') { e.preventDefault(); marcaAt(ops.length - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (ops[at]) escolhe(ops[at].dataset.v); }
      else if (e.key === 'Tab') fecha();
      else if (e.key.length === 1) { const t = e.key.toLowerCase(); const k = ops.findIndex((o, i) => i > at && o.textContent.toLowerCase().startsWith(t)); const k2 = k >= 0 ? k : ops.findIndex((o) => o.textContent.toLowerCase().startsWith(t)); if (k2 >= 0) marcaAt(k2); }
    });
    ops.forEach((o, i) => { o.addEventListener('click', () => escolhe(o.dataset.v)); o.addEventListener('pointermove', () => { if (at !== i) marcaAt(i); }); });
    sel.addEventListener('change', mostra);
    sel.classList.add('nativo'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    raizL.append(btn, caixa); sel.after(raizL);
    mostra();
  };

  // pode(d) decide quais dias aceitam pedido; nota() diz por que há dias riscados
  const montaCalendario = (inp, pode, nota) => {
    const id = `cal-${++uid}`;
    const raizC = document.createElement('div'); raizC.className = 'escolha';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'escolha-btn';
    btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
    const rot = inp.closest('label')?.querySelector('span');
    if (rot) { rot.id ||= `${id}-rot`; btn.setAttribute('aria-labelledby', `${rot.id} ${id}-txt`); }
    btn.innerHTML = `<span class="escolha-txt" id="${id}-txt"></span>${ICO.cal}`;
    const caixa = document.createElement('div'); caixa.className = 'escolha-caixa cal'; caixa.id = id; caixa.setAttribute('role', 'dialog'); caixa.setAttribute('aria-label', 'Escolher o dia');
    const min = deIso(inp.min), max = deIso(inp.max);
    let mes = new Date(min.getFullYear(), min.getMonth(), 1), foco = null;
    const dentro = (d) => d >= min && d <= max;
    const ok = (d) => dentro(d) && pode(d);
    const desenha = () => {
      const ano = mes.getFullYear(), m = mes.getMonth();
      const primeiro = new Date(ano, m, 1).getDay(), total = new Date(ano, m + 1, 0).getDate();
      const cel = [];
      for (let k = 0; k < primeiro; k++) cel.push('<span></span>');
      for (let d = 1; d <= total; d++) {
        const dt = new Date(ano, m, d), v = iso(dt), livre = ok(dt), risco = dentro(dt) && !livre;
        cel.push(`<button type="button" class="dia${v === iso(hoje) ? ' hoje' : ''}${v === inp.value ? ' sel' : ''}${risco ? ' fechado' : ''}" data-v="${v}" ${livre ? '' : 'aria-disabled="true"'} tabindex="${v === foco ? 0 : -1}" aria-label="${d} de ${MESES[m]}, ${DIAS[dt.getDay()]}${risco ? ', sem horário' : ''}"${v === inp.value ? ' aria-pressed="true"' : ''}>${d}</button>`);
      }
      const antes = new Date(ano, m, 0) >= min, depois = new Date(ano, m + 1, 1) <= max;
      caixa.innerHTML = `<div class="cal-cab"><button type="button" class="cal-seta" data-mes="-1" aria-label="Mês anterior" ${antes ? '' : 'disabled'}>${ICO.esq}</button><p aria-live="polite">${MESES[m]} <span>${ano}</span></p><button type="button" class="cal-seta" data-mes="1" aria-label="Próximo mês" ${depois ? '' : 'disabled'}>${ICO.dir}</button></div>
        <div class="cal-sem" aria-hidden="true">${DIAS_C.map((d) => `<span>${d}</span>`).join('')}</div>
        <div class="cal-dias">${cel.join('')}</div>
        <p class="cal-nota">${nota()}</p>`;
    };
    const proximoLivre = (d) => { const x = new Date(d); for (let k = 0; k < 70; k++) { if (ok(x)) return x; x.setDate(x.getDate() + 1); } return null; };
    const focaDia = (v) => { foco = v; const d = deIso(v); if (d.getMonth() !== mes.getMonth() || d.getFullYear() !== mes.getFullYear()) mes = new Date(d.getFullYear(), d.getMonth(), 1); desenha(); $(`[data-v="${v}"]`, caixa)?.focus(); };
    const mostra = () => {
      $('.escolha-txt', btn).textContent = inp.value ? (() => { const d = deIso(inp.value); return `${DIAS_C[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`; })() : 'Escolha o dia';
      btn.classList.toggle('vazio', !inp.value);
    };
    const peca = { raiz: raizC, btn, caixa };
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
        focaDia(iso(n < min ? min : n > max ? max : n));
      } else if (e.key === 'PageDown' || e.key === 'PageUp') {
        e.preventDefault(); const n = deIso(d.dataset.v); n.setMonth(n.getMonth() + (e.key === 'PageDown' ? 1 : -1));
        focaDia(iso(n < min ? min : n > max ? max : n));
      }
    });
    inp.addEventListener('change', mostra);
    inp.type = 'hidden';
    raizC.append(btn, caixa); inp.after(raizC);
    mostra();
  };

  // ---------- 11. agendamento: serviço, profissional, dia e horário ----------
  const form = $('#form-agenda');
  if (form) {
    const f = form.elements;
    const SP = servPor();
    const limite = new Date(); limite.setDate(limite.getDate() + 60);
    f.data.min = iso(hoje); f.data.max = iso(limite);
    const caixaPros = $('[data-pros-escolha]', form), caixaHoras = $('[data-horarios]', form), avisoQ = $('[data-aviso-quimica]', form);
    const resumo = (k, v) => { const el = $(`[data-r="${k}"]`); if (!el || el.innerHTML === v) return; el.innerHTML = v; el.classList.remove('muda'); void el.offsetWidth; el.classList.add('muda'); };

    // quem faz o serviço escolhido
    const fazem = (s) => equipe().filter((m) => !s || (m.faz || []).includes(s.seg));
    // horários livres num dia: [{ h, quem: [ids] }], em passos de 30 minutos dentro da agenda e do horário da casa
    const horariosDo = (d, s, proId) => {
      const w = d.getDay(), casa = abertura[w];
      if (!casa) return [];
      const dur = (s?.min || 60) / 60;
      const quem = proId ? equipe().filter((m) => m.id === proId) : fazem(s);
      const agora = new Date(); const ehHoje = iso(d) === iso(agora);
      const corte = agora.getHours() + agora.getMinutes() / 60 + 1;
      const mapa = new Map();
      for (const m of quem) {
        const h = m.dias?.[w]; if (!h) continue;
        const ini = Math.max(h[0], casa[0]), fim = Math.min(h[1], casa[1]);
        for (let t = ini; t + dur <= fim + 1e-9; t += 0.5) {
          if (ehHoje && t < corte) continue;
          if (!mapa.has(t)) mapa.set(t, []);
          mapa.get(t).push(m.id);
        }
      }
      return [...mapa].sort((a, b) => a[0] - b[0]).map(([h, q]) => ({ h, quem: q }));
    };
    const servAtual = () => SP[f.servico.value];
    const proAtual = () => form.querySelector('input[name="pro"]:checked')?.value || '';
    const pode = (d) => horariosDo(d, servAtual(), proAtual()).length > 0;
    const notaCal = () => {
      const fechados = [0, 1, 2, 3, 4, 5, 6].filter((w) => !abertura[w]).map((w) => DIAS[w]);
      const p = equipe().find((m) => m.id === proAtual());
      return `${fechados.length ? `Fechado ${fechados.length > 1 ? `${fechados.slice(0, -1).join(', ')} e ${fechados[fechados.length - 1]}` : fechados[0]}. ` : ''}${p ? `Dias riscados: ${P.primeiro(p.nome)} de folga ou sem horário.` : 'Dias riscados: sem horário livre.'}`;
    };

    // cartões de profissional
    const desenhaPros = () => {
      const s = servAtual(), atual = proAtual();
      const lista = fazem(s);
      caixaPros.innerHTML = `<label class="pe"><input type="radio" name="pro" value=""${!atual || !lista.some((m) => m.id === atual) ? ' checked' : ''}><span class="pe-foto">${D.simbolo}</span><span class="pe-txt"><b>Sem preferência</b><small>Primeira livre</small></span></label>${lista.map((m) => `<label class="pe"><input type="radio" name="pro" value="${m.id}"${m.id === atual ? ' checked' : ''}><span class="pe-foto">${P.img(m.foto, '', {})}</span><span class="pe-txt"><b>${P.esc(m.nome)}</b><small>${P.esc(m.cargo)}</small></span></label>`).join('')}`;
    };
    const turno = (h) => (h < 12 ? 'Manhã' : h < 18 ? 'Tarde' : 'Noite');
    const desenhaHoras = () => {
      const s = servAtual(), d = f.data.value ? deIso(f.data.value) : null;
      if (!s || !d) { caixaHoras.innerHTML = `<p class="horarios-vazio">${!s ? 'Escolha o serviço' : 'Escolha o dia'} para ver os horários.</p>`; return; }
      const livres = horariosDo(d, s, proAtual());
      const antes = form.querySelector('input[name="hora"]:checked')?.value;
      if (!livres.length) { caixaHoras.innerHTML = '<p class="horarios-vazio">Sem horário livre neste dia. Escolha outro dia ou outra profissional.</p>'; return; }
      let t = '';
      caixaHoras.innerHTML = livres.map((x, k) => {
        const tt = turno(x.h), cab = tt !== t ? `<p class="horarios-turno">${tt}</p>` : ''; t = tt;
        const v = String(x.h);
        return `${cab}<label class="hr" style="--k:${k}"><input type="radio" name="hora" value="${v}" data-quem="${x.quem.join(',')}"${v === antes ? ' checked' : ''}${k === 0 ? ' required' : ''}><span>${P.rotuloHora(x.h)}</span></label>`;
      }).join('');
    };
    const atualizaResumo = () => {
      const s = servAtual(), p = equipe().find((m) => m.id === proAtual());
      const hora = form.querySelector('input[name="hora"]:checked');
      resumo('servico', s ? P.esc(s.nome) : 'Escolha o serviço');
      resumo('pro', p ? P.esc(p.nome) : 'Sem preferência');
      resumo('quando', f.data.value ? `${DIAS_C[deIso(f.data.value).getDay()]}, ${deIso(f.data.value).getDate()} de ${MESES[deIso(f.data.value).getMonth()]}${hora ? `, ${P.rotuloHora(+hora.value)}` : ''}` : 'Escolha o dia e o horário');
      resumo('tempo', s ? P.minutos(s.min) : '&nbsp;');
      resumo('valor', s ? `${s.de ? '<small>a partir de</small>' : ''}${P.reais(s.preco)}` : '&nbsp;');
    };
    const confereDia = () => {
      if (f.data.value && !pode(deIso(f.data.value))) {
        toast(`Sem horário livre em ${DIAS[deIso(f.data.value).getDay()]}, ${deIso(f.data.value).getDate()}. Escolha outro dia.`);
        f.data.value = ''; f.data.dispatchEvent(new Event('change'));
      }
    };
    const tudo = () => { desenhaHoras(); atualizaResumo(); };

    montaLista(f.servico);
    montaCalendario(f.data, pode, notaCal);
    f.servico.addEventListener('change', () => {
      const s = servAtual();
      avisoQ.hidden = !s?.quimica;
      if (s?.quimica) avisoQ.textContent = s.seg === 'sobrancelha' ? 'A henna pede teste de sensibilidade 48 horas antes para quem nunca fez aqui. Combinamos o teste na confirmação.' : 'Este serviço pede teste de mecha e de sensibilidade 48 horas antes para quem nunca fez aqui. Combinamos o teste na confirmação.';
      desenhaPros(); confereDia(); tudo();
    });
    caixaPros.addEventListener('change', () => { confereDia(); tudo(); });
    caixaHoras.addEventListener('change', atualizaResumo);
    f.data.addEventListener('change', tudo);
    desenhaPros(); tudo();

    // links "Agendar" dos cartões de serviço e ?prof= vindo da página da equipe
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-servico]');
      if (!a || !SP[a.dataset.servico]) return;
      f.servico.value = a.dataset.servico; f.servico.dispatchEvent(new Event('change', { bubbles: true }));
      toast(`${SP[a.dataset.servico].nome} selecionado. Agora escolha quem, o dia e o horário.`);
    });
    const prof = new URLSearchParams(location.search).get('prof');
    if (prof && equipe().some((m) => m.id === prof)) {
      const m = equipe().find((x) => x.id === prof);
      const s1 = servicos().find((s) => (m.faz || []).includes(s.seg));
      if (s1) { f.servico.value = s1.id; f.servico.dispatchEvent(new Event('change', { bubbles: true })); }
      const r = caixaPros.querySelector(`input[value="${prof}"]`);
      if (r) { r.checked = true; caixaPros.dispatchEvent(new Event('change')); }
    }

    const erro = $('.form-erro', form), ok = $('.form-ok', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      $$('.erro', form).forEach((x) => x.classList.remove('erro'));
      const faltam = [];
      const marca = (el, nome) => { (el?.closest('fieldset') || el?.closest('.passo') || el?.closest('label'))?.classList.add('erro'); faltam.push(nome); };
      if (!f.servico.value) marca(f.servico, 'serviço');
      if (!f.data.value) marca(f.data, 'dia');
      const hora = form.querySelector('input[name="hora"]:checked');
      if (!hora) marca(caixaHoras, 'horário');
      if (!f.nome.value.trim()) marca(f.nome, 'nome');
      if (f.tel.value.replace(/\D/g, '').length < 10) marca(f.tel, 'telefone com DDD');
      if (f.email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value)) marca(f.email, 'e-mail válido');
      if (!f.lgpd.checked) faltam.push('o aceite da Política de Privacidade');
      if (faltam.length) { erro.hidden = false; erro.textContent = `Falta preencher: ${faltam.join(', ')}.`; ok.hidden = true; $('.erro', form)?.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'center' }); return; }
      erro.hidden = true;
      const s = servAtual(), d = deIso(f.data.value);
      const p = equipe().find((m) => m.id === proAtual());
      const quando = `${DIAS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}, às ${P.rotuloHora(+hora.value)}`;
      const msg = [
        `Olá! Quero pedir um horário no ${L.empresa.nome}.`,
        `Nome: ${f.nome.value.trim()}`, `Telefone: ${f.tel.value.trim()}`, f.email.value ? `E-mail: ${f.email.value.trim()}` : '',
        `Serviço: ${s.nome} (${s.de ? 'a partir de ' : ''}${P.reais(s.preco)}, ${P.minutos(s.min)})`,
        `Profissional: ${p ? p.nome : 'sem preferência'}`, `Quando: ${quando}`,
        f.obs.value.trim() ? `Observações: ${f.obs.value.trim()}` : '',
        `Aceito a Política de Privacidade. Novidades pelo WhatsApp: ${f.novidades.checked ? 'sim' : 'não'}.`,
      ].filter(Boolean).join('\n');
      window.open(wa(msg), '_blank', 'noopener');
      ok.hidden = false;
      ok.innerHTML = `<b>Pedido pronto para envio</b><span>${P.esc(s.nome)}${p ? ` com ${P.esc(P.primeiro(p.nome))}` : ''}, ${quando}. O WhatsApp abriu com a mensagem; é só enviar. Confirmamos em até uma hora, no horário de funcionamento.</span>`;
      toast('Pedido montado. Confira no WhatsApp.');
    });
  }

  // ---------- 12. galeria: filtros e foto ampliada ----------
  const gal = $('[data-galeria]');
  if (gal) {
    const itens = $$('.gal', gal);
    const filtros = $$('[data-filtro]');
    const nomesCat = Object.fromEntries([...L.segmentos.map((g) => [g.id, g.curto]), ['espaco', 'O espaço']]);
    const filtra = (cat) => {
      filtros.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtro === cat)));
      const entra = (el) => { el.hidden = false; el.classList.remove('saindo', 'entrando'); void el.offsetWidth; el.classList.add('entrando'); };
      const sai = itens.filter((el) => !el.hidden && cat !== 'todos' && el.dataset.cat !== cat);
      sai.forEach((el) => el.classList.add('saindo'));
      setTimeout(() => {
        sai.forEach((el) => { el.hidden = true; el.classList.remove('saindo'); });
        itens.filter((el) => cat === 'todos' || el.dataset.cat === cat).forEach(entra);
      }, reduz || !sai.length ? 0 : 260);
    };
    filtros.forEach((b) => b.addEventListener('click', () => filtra(b.dataset.filtro)));
    const cat0 = new URLSearchParams(location.search).get('categoria');
    if (cat0 && filtros.some((b) => b.dataset.filtro === cat0)) filtra(cat0);

    const cx = $('#caixa-foto'), img = $('img', cx);
    let atual = 0;
    const visiveis = () => itens.filter((el) => !el.hidden);
    const mostraFoto = (k, anima) => {
      const vs = visiveis(); if (!vs.length) return;
      atual = (k + vs.length) % vs.length;
      const el = vs[atual], o = $('img', el);
      img.src = o.currentSrc || o.src; img.alt = o.alt;
      $('[data-cf-leg]', cx).textContent = $('figcaption', el).textContent;
      $('[data-cf-cat]', cx).textContent = nomesCat[el.dataset.cat] || '';
      $('[data-cf-pos]', cx).textContent = `${atual + 1} de ${vs.length}`;
      if (anima) { img.classList.remove('troca'); void img.offsetWidth; img.classList.add('troca'); }
    };
    gal.addEventListener('click', (e) => {
      const b = e.target.closest('[data-abre]'); if (!b) return;
      mostraFoto(visiveis().indexOf(b.closest('.gal')), false);
      cx.showModal();
    });
    $$('[data-cf]', cx).forEach((b) => b.addEventListener('click', () => mostraFoto(atual + +b.dataset.cf, true)));
    $('[data-fecha]', cx).addEventListener('click', () => cx.close());
    cx.addEventListener('click', (e) => { if (e.target === cx) cx.close(); });
    cx.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') mostraFoto(atual + 1, true); else if (e.key === 'ArrowLeft') mostraFoto(atual - 1, true); });
    let x0 = null;
    cx.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    cx.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 40) mostraFoto(atual + (dx < 0 ? 1 : -1), true); });
  }

  // ---------- 13. o resto ----------
  janelas();
  revela();
  iguala();
})();

/* ---------- tema claro ou escuro (pílula na lateral e no menu do celular) ---------- */
(() => {
  const raiz = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  let fim;
  const marca = () => {
    document.querySelectorAll('[data-tema-ir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaIr === raiz.dataset.tema)));
    if (meta) meta.content = raiz.dataset.tema === 'claro' ? '#211B18' : '#120E0C';
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tema-ir]');
    if (!b || b.dataset.temaIr === raiz.dataset.tema) return;
    // tema-anim liga a passagem suave das cores só durante a troca
    raiz.classList.add('tema-anim');
    raiz.dataset.tema = b.dataset.temaIr;
    try { localStorage.setItem('mecha-salao-silver-tema', raiz.dataset.tema); } catch (err) { /* sem armazenamento, vale só nesta visita */ }
    marca();
    clearTimeout(fim);
    fim = setTimeout(() => raiz.classList.remove('tema-anim'), 800);
  });
  marca();
})();
