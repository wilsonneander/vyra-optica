// Amassa Standard: comportamento do site (um arquivo para todas as páginas).
// Os dados vêm de window.AMASSA, gravado pelo build. Nesta demonstração, agendamentos e contatos ficam no localStorage.
(() => {
  const D = window.AMASSA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const reais = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
  const hora = (h) => (h % 24 === 0 && h >= 24 ? 'meia-noite' : `${Math.floor(h % 24)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`);
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const guarda = {
    ler(k, padrao) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento: vale só nesta visita */ } },
  };
  const wa = (msg) => `https://wa.me/55${D.marca.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
  const servDe = (id) => D.servicos.find((e) => e.id === id);
  const profDe = (id) => D.equipe.find((m) => m.id === id);

  // datas no horário de Brasília
  const agoraBR = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const iso = `${p.year}-${p.month}-${p.day}`;
    return { iso, dia: new Date(`${iso}T12:00:00`).getDay(), h: Number(p.hour) + Number(p.minute) / 60, hm: `${p.hour}:${p.minute}` };
  };
  const somaDias = (iso, n) => { const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const diaSemana = (iso) => new Date(`${iso}T12:00:00`).getDay();
  const dataLonga = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

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
  $$('dialog').forEach((d) => {
    $$('[data-fecha]', d).forEach((x) => x.addEventListener('click', () => d.close()));
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });
  const ck = $('#cookies');
  if (ck) {
    if (!guarda.ler('amassa-cookies', null)) { ck.hidden = false; igualaDepois(); }
    $$('[data-ck]', ck).forEach((b) => b.addEventListener('click', () => { guarda.gravar('amassa-cookies', { escolha: b.dataset.ck, em: new Date().toISOString() }); ck.hidden = true; }));
    $$('[data-cookies]').forEach((b) => b.addEventListener('click', () => { ck.hidden = false; igualaDepois(); }));
  }

  // ---------- "Como você quer?": pedir pelo app, WhatsApp ou balcão ----------
  const dlgPedir = $('#pedir');
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pedir]');
    if (!b || !dlgPedir?.showModal) return;
    const p = b.dataset.pedir ? D.pratos.find((x) => x.id === b.dataset.pedir) : null;
    const item = $('[data-pedir-item]', dlgPedir);
    item.hidden = !p;
    if (p) item.textContent = `${p.nome}, ${p.de ? 'a partir de ' : ''}${reais(p.preco)}`;
    $('[data-pedir-wa]', dlgPedir).href = wa(p ? `Olá! Vim pelo site e quero pedir: ${p.nome}.` : 'Olá! Vim pelo site e quero fazer um pedido para entrega.');
    dlgPedir.showModal();
    igualaDepois();
  });

  // ---------- topo: sombra ao rolar e menu do celular ----------
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

  // ---------- aberto agora e horário do dia ----------
  const agora = agoraBR();
  const status = $('[data-status]');
  if (status) {
    const hoje = D.horario[agora.dia].turnos;
    const ontem = D.horario[(agora.dia + 6) % 7].turnos.find(([, b]) => b > 24 && agora.h < b - 24);
    const turno = ontem ? [0, ontem[1]] : hoje.find(([a, b]) => agora.h >= a && agora.h < b);
    if (turno) status.innerHTML = `<b>Chapa ligada agora</b>, até ${hora(turno[1])}`;
    else {
      let prox = hoje.find(([a]) => a > agora.h), dia = agora.dia, n = 0;
      while (!prox && n < 7) { n++; dia = (dia + 1) % 7; prox = D.horario[dia].turnos[0]; }
      if (prox) status.innerHTML = `<b>Chapa desligada agora.</b> Liga ${n === 0 ? 'hoje' : n === 1 ? 'amanhã' : DIAS[dia]} às ${hora(prox[0])}`;
    }
  }
  $$(`.horas tr[data-dia="${agora.dia}"]`).forEach((el) => el.classList.add('hoje'));

  // ---------- adesivos que dá para arrastar (posição salva neste navegador) ----------
  const posAd = guarda.ler('amassa-adesivos', {});
  $$('[data-arrasta]').forEach((ad, k) => {
    const chave = `${document.body.dataset.pg}-${k}`;
    const aplica = (x, y) => { ad.style.translate = `${x}px ${y}px`; };
    let [x, y] = posAd[chave] || [0, 0];
    aplica(x, y);
    let ini = null;
    ad.addEventListener('pointerdown', (e) => {
      ini = { px: e.clientX, py: e.clientY, x, y };
      ad.setPointerCapture(e.pointerId); ad.classList.add('pega');
    });
    ad.addEventListener('pointermove', (e) => {
      if (!ini) return;
      x = ini.x + e.clientX - ini.px; y = ini.y + e.clientY - ini.py;
      aplica(x, y);
    });
    const solta = () => { if (!ini) return; ini = null; ad.classList.remove('pega'); posAd[chave] = [Math.round(x), Math.round(y)]; guarda.gravar('amassa-adesivos', posAd); };
    ad.addEventListener('pointerup', solta); ad.addEventListener('pointercancel', solta);
    ad.addEventListener('keydown', (e) => {
      const passo = e.shiftKey ? 30 : 10;
      const m = { ArrowLeft: [-passo, 0], ArrowRight: [passo, 0], ArrowUp: [0, -passo], ArrowDown: [0, passo] }[e.key];
      if (!m) return;
      e.preventDefault(); x += m[0]; y += m[1]; aplica(x, y); posAd[chave] = [x, y]; guarda.gravar('amassa-adesivos', posAd);
    });
    ad.addEventListener('dblclick', () => { x = 0; y = 0; aplica(0, 0); delete posAd[chave]; guarda.gravar('amassa-adesivos', posAd); });
  });

  // ---------- manifesto: cada palavra é prensada conforme a rolagem ----------
  const palavras = $$('[data-palavras] span');
  if (palavras.length) {
    if (reduz) palavras.forEach((p) => p.classList.add('ok'));
    else {
      let pedido = false;
      const acende = () => {
        pedido = false;
        const r = palavras[0].parentElement.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
        const n = Math.round(p * palavras.length);
        palavras.forEach((w, k) => w.classList.toggle('ok', k < n));
      };
      addEventListener('scroll', () => { if (!pedido) { pedido = true; requestAnimationFrame(acende); } }, { passive: true });
      acende();
    }
  }

  // ---------- números contando ao aparecer ----------
  const contadores = $$('[data-conta]');
  if (contadores.length && !reduz && 'IntersectionObserver' in window) {
    const ioC = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      ioC.unobserve(e.target);
      const fim = Number(e.target.dataset.conta), t0 = performance.now();
      const passo = (t) => { const p = Math.min(1, (t - t0) / 1300); e.target.textContent = Math.round(fim * (1 - (1 - p) ** 3)); if (p < 1) requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
    }), { threshold: 0.6 });
    contadores.forEach((c) => { c.textContent = '0'; ioC.observe(c); });
  }

  // ---------- polaroides: carrossel em pilha (setas, toque, arraste e avanço que pausa com o mouse) ----------
  $$('[data-polas]').forEach((box) => {
    const fotos = $$('.pola', box);
    const giros = [[-3, 0, 0], [5, 14, 6], [-7, -12, 10], [3, 8, -8]];
    let i = 0, ocupado = false, pausa = false;
    const arruma = () => fotos.forEach((f, k) => {
      const o = (k - i + fotos.length) % fotos.length, g = giros[o] || giros[giros.length - 1];
      f.style.setProperty('--r', `${g[0]}deg`); f.style.setProperty('--tx', `${g[1]}px`); f.style.setProperty('--ty', `${g[2]}px`);
      f.style.setProperty('--z', String(fotos.length - o));
      f.setAttribute('aria-hidden', String(o !== 0));
    });
    const vai = (n) => {
      if (ocupado) return;
      const topo = fotos[i];
      if (n > 0 && !reduz) {
        ocupado = true; topo.classList.add('voa');
        setTimeout(() => { topo.classList.remove('voa'); i = (i + 1) % fotos.length; arruma(); ocupado = false; }, 300);
      } else { i = (i + n + fotos.length) % fotos.length; arruma(); }
    };
    arruma();
    $$('[data-pola-ir]', box).forEach((b) => b.addEventListener('click', () => vai(Number(b.dataset.polaIr))));
    let x0 = null, arrastou = false;
    $('.polas-pilha', box).addEventListener('click', () => { if (arrastou) { arrastou = false; return; } vai(1); });
    $('.polas-pilha', box).addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    $('.polas-pilha', box).addEventListener('pointerup', (e) => { if (x0 !== null && Math.abs(e.clientX - x0) > 40) { arrastou = true; vai(e.clientX < x0 ? 1 : -1); } x0 = null; });
    box.addEventListener('mouseenter', () => { pausa = true; }); box.addEventListener('mouseleave', () => { pausa = false; });
    box.addEventListener('focusin', () => { pausa = true; }); box.addEventListener('focusout', () => { pausa = false; });
    if (!reduz) setInterval(() => { const r = box.getBoundingClientRect(); if (!pausa && !document.hidden && r.top < innerHeight && r.bottom > 0) vai(1); }, 4200);
  });

  // ---------- comanda que sai impressa ----------
  const imp = $('[data-impressora]');
  if (imp) {
    const d = new Date();
    $('[data-cm-data]', imp).textContent = `${d.toLocaleDateString('pt-BR')} ${agora.hm}`;
    const imprime = () => {
      imp.classList.remove('pronta', 'imprimindo', 'carimbou');
      void imp.offsetWidth;
      if (reduz) { imp.classList.add('pronta', 'carimbou'); return; }
      imp.classList.add('imprimindo');
      setTimeout(() => imp.classList.add('carimbou'), 2700);
    };
    if ('IntersectionObserver' in window) {
      const ioI = new IntersectionObserver((es) => { if (es[0].isIntersecting) { imprime(); ioI.disconnect(); } }, { threshold: 0.35 });
      ioI.observe(imp);
    } else imprime();
    $$('[data-imprime]').forEach((b) => b.addEventListener('click', imprime));
  }

  // ---------- carrossel das avaliações ----------
  $$('[data-trilho-car]').forEach((tr) => {
    const passo = () => { const c = tr.children[0]; return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(tr).columnGap) || 16) : tr.clientWidth; };
    const fim = () => tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4;
    const vai = (n) => { if (n > 0 && fim()) tr.scrollTo({ left: 0, behavior: reduz ? 'auto' : 'smooth' }); else tr.scrollBy({ left: n * passo(), behavior: reduz ? 'auto' : 'smooth' }); };
    $$(`[data-trilho-ir][aria-controls="${tr.id}"]`).forEach((b) => b.addEventListener('click', () => vai(Number(b.dataset.trilhoIr))));
    tr.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); vai(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); vai(-1); } });
    let x0 = null, s0 = 0, moveu = false, pausa = false;
    tr.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; x0 = e.clientX; s0 = tr.scrollLeft; moveu = false; tr.classList.add('arrastando'); });
    addEventListener('pointermove', (e) => { if (x0 === null) return; const dx = e.clientX - x0; if (Math.abs(dx) > 4) moveu = true; tr.scrollLeft = s0 - dx; });
    addEventListener('pointerup', () => { if (x0 === null) return; x0 = null; tr.classList.remove('arrastando'); const p = passo(); tr.scrollTo({ left: Math.round(tr.scrollLeft / p) * p, behavior: reduz ? 'auto' : 'smooth' }); });
    tr.addEventListener('click', (e) => { if (moveu) { e.preventDefault(); e.stopPropagation(); moveu = false; } }, true);
    ['mouseenter', 'focusin', 'touchstart'].forEach((ev) => tr.addEventListener(ev, () => { pausa = true; }, { passive: true }));
    ['mouseleave', 'focusout'].forEach((ev) => tr.addEventListener(ev, () => { pausa = false; }));
    if (!reduz) setInterval(() => { const r = tr.getBoundingClientRect(); if (!pausa && !document.hidden && r.top < innerHeight && r.bottom > 0) vai(1); }, 5200);
  });

  // ---------- abas do cardápio (com setas do teclado) ----------
  const abas = $$('[data-aba]');
  const abre = (id, foco) => {
    abas.forEach((b) => { const s = b.dataset.aba === id; b.setAttribute('aria-selected', String(s)); b.tabIndex = s ? 0 : -1; if (s && foco) b.focus(); if (s) b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); });
    $$('.seg').forEach((s) => { s.hidden = s.id !== `seg-${id}`; });
  };
  abas.forEach((b, k) => {
    b.addEventListener('click', () => abre(b.dataset.aba));
    b.addEventListener('keydown', (e) => {
      const n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (n) { e.preventDefault(); abre(abas[(k + n + abas.length) % abas.length].dataset.aba, true); }
    });
  });

  // ---------- galeria: filtros e foto ampliada ----------
  const visor = $('[data-visor]');
  let fotosVisor = [], iv = 0, focoAntes;
  const mostraVisor = () => { const f = fotosVisor[iv]; $('[data-visor-img]', visor).src = f.dataset.foto; $('[data-visor-img]', visor).alt = f.dataset.leg; $('[data-visor-leg]', visor).textContent = f.dataset.leg; };
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
    $$('.gal-item').forEach((it) => it.classList.toggle('some', !(f === 'todas' || it.dataset.cat === f)));
  }));

  // ---------- agendamento: serviço, profissional, data e horário ----------
  const form = $('[data-agenda]');
  const horariosDe = (serv, iso) => {
    const d = diaSemana(iso), turnos = D.horario[d].turnos;
    const serie = (a, b, passo = 0.5) => { const l = []; for (let h = a; h <= b + 0.001; h += passo) l.push(h); return l; };
    let lista = [];
    if (serv.turnos === 'oficina') lista = d === 6 ? [15] : d === 0 ? [10] : [];
    else if (!turnos.length) lista = [];
    else if (serv.turnos === 'festa') turnos.forEach(([a, b]) => { lista.push(...serie(a, Math.min(b, 24) - 3, 1)); });
    else if (serv.turnos === 'evento') lista = [11, 12, 18, 19, 20];
    else turnos.forEach(([a, b]) => { lista.push(...serie(a, Math.min(b, 24) - 1)); });
    if (serv.turnos === 'evento' && !turnos.length) lista = [11, 12, 18, 19, 20]; // o carrinho vai até você mesmo com a casa fechada
    const a = agoraBR();
    if (iso === a.iso) lista = lista.filter((h) => h > a.h + 1);
    return lista;
  };
  const rotuloHora = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`;

  if (form) {
    const el = (n) => form.elements[n];
    const resumo = $('[data-resumo]'), r = (k) => $(`[data-r="${k}"]`, resumo);
    const selProf = $('[data-prof]', form), horas = $('[data-horas]', form), dataEl = $('[data-data]', form);
    const hoje = agoraBR().iso;
    let horaSel = null;
    const serv = () => servDe(form.querySelector('[name="serv"]:checked').value);
    const ajustaData = () => {
      const s = serv();
      // festas e eventos pedem antecedência
      const minimo = s.id === 'evento' ? 7 : s.id === 'aniversario' ? 2 : s.id === 'oficina' ? 1 : 0;
      dataEl.min = somaDias(hoje, minimo); dataEl.max = somaDias(hoje, 120);
      if (dataEl.value && dataEl.value < dataEl.min) dataEl.value = '';
    };
    const opcoes = () => {
      const s = serv(), antes = selProf.value;
      selProf.innerHTML = `<option value="">Sem preferência</option>${s.prof.map((id) => `<option value="${id}">${esc(profDe(id).nome)}, ${esc(profDe(id).cargo.toLowerCase())}</option>`).join('')}`;
      if (s.prof.includes(antes)) selProf.value = antes;
      const [mn, mx] = s.pessoas;
      el('pessoas').min = mn; el('pessoas').max = mx;
      if (Number(el('pessoas').value) < mn) el('pessoas').value = mn;
      if (Number(el('pessoas').value) > mx) el('pessoas').value = mx;
      ajustaData();
    };
    const desenhaHoras = () => {
      const iso = dataEl.value;
      if (!iso) { horas.innerHTML = '<p class="ag-vazio">Escolha uma data para ver os horários.</p>'; horaSel = null; return; }
      const lista = horariosDe(serv(), iso);
      if (!lista.length) {
        const d = diaSemana(iso), s = serv();
        horas.innerHTML = `<p class="ag-vazio">${s.turnos === 'oficina' ? 'A oficina acontece aos sábados às 15h e aos domingos às 10h.' : d === 1 ? 'A casa fecha às segundas.' : 'Não há horário livre nesse dia. Tente outra data.'}</p>`;
        horaSel = null; return;
      }
      if (!lista.map(rotuloHora).includes(horaSel)) horaSel = null;
      horas.innerHTML = lista.map((h) => { const t = rotuloHora(h); return `<button type="button" role="radio" aria-checked="${t === horaSel}" data-h="${t}">${t}</button>`; }).join('');
    };
    horas.addEventListener('click', (e) => { const b = e.target.closest('[data-h]'); if (!b) return; horaSel = b.dataset.h; $$('[data-h]', horas).forEach((x) => x.setAttribute('aria-checked', String(x === b))); atualiza(); });
    const atualiza = () => {
      const s = serv(), p = Number(el('pessoas').value) || 1;
      r('serv').textContent = s.nome;
      r('prof').textContent = selProf.value ? profDe(selProf.value).nome : 'Sem preferência';
      r('quando').textContent = dataEl.value ? `${dataLonga(dataEl.value)}${horaSel ? `, ${horaSel}` : ''}` : 'Escolha a data';
      r('pessoas').textContent = `${p} ${p === 1 ? 'pessoa' : 'pessoas'}`;
      r('total').textContent = s.preco ? `${s.de ? 'a partir de ' : ''}${reais(s.preco * p)}` : 'Sem custo';
      const sinal = r('sinal');
      sinal.hidden = !s.sinal;
      if (s.sinal) sinal.textContent = `Sinal de 30% (${reais(s.preco * p * 0.3)}) por Pix para confirmar. Devolvido se cancelar até 7 dias antes.`;
    };
    form.addEventListener('change', (e) => {
      if (e.target.name === 'serv') { opcoes(); desenhaHoras(); }
      if (e.target === dataEl) desenhaHoras();
      atualiza();
    });
    form.addEventListener('input', atualiza);
    const escolhe = (id, profId) => {
      const radio = form.querySelector(`[name="serv"][value="${id}"]`);
      if (!radio) return;
      radio.checked = true; opcoes();
      if (profId && serv().prof.includes(profId)) selProf.value = profId;
      desenhaHoras(); atualiza();
    };
    $$('[data-agendar]').forEach((a) => a.addEventListener('click', () => escolhe(a.dataset.agendar)));
    // vindo da página da equipe: ?serv=...&prof=...
    const q = new URLSearchParams(location.search);
    opcoes();
    if (q.get('serv')) escolhe(q.get('serv'), q.get('prof'));
    desenhaHoras(); atualiza();

    const erro = $('[data-erro]', form);
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const s = serv(), p = Number(el('pessoas').value);
      const falta = [];
      const marca = (campo, ok) => { campo.setAttribute('aria-invalid', String(!ok)); if (!ok) falta.push(campo); };
      marca(el('nome'), el('nome').value.trim().length > 2);
      marca(el('tel'), el('tel').value.replace(/\D/g, '').length >= 10);
      marca(el('pessoas'), p >= s.pessoas[0] && p <= s.pessoas[1]);
      marca(dataEl, !!dataEl.value);
      if (el('email').value) marca(el('email'), el('email').checkValidity());
      let msg = '';
      if (!horaSel) msg = 'Escolha um horário.';
      if (!el('lgpd').checked) msg = 'Para agendar, aceite o uso dos dados conforme a Política de privacidade.';
      if (falta.length) msg = 'Confira os campos marcados.';
      if (falta.includes(el('pessoas'))) msg = `${s.nome} é para ${s.pessoas[0]} a ${s.pessoas[1]} pessoas.`;
      erro.textContent = msg;
      if (msg) { (falta[0] || (!horaSel ? horas : el('lgpd'))).focus?.(); return; }
      const ag = { id: `a-${Date.now().toString(36)}`, serv: s.id, prof: selProf.value, pessoas: p, data: dataEl.value, hora: horaSel, nome: el('nome').value.trim(), obs: el('obs').value.trim(), criado: new Date().toISOString() };
      guarda.gravar('amassa-agendamentos', [...guarda.ler('amassa-agendamentos', []), ag]);
      const quando = `${dataLonga(ag.data)}, às ${ag.hora}`;
      const confirmaNaHora = ['mesa', 'retirada'].includes(s.id);
      const texto = `Olá! Quero agendar pelo site: ${s.nome}, ${quando}, ${p} ${p === 1 ? 'pessoa' : 'pessoas'}${ag.prof ? `, com ${profDe(ag.prof).nome}` : ''}. Nome: ${ag.nome}.${ag.obs ? ` Observações: ${ag.obs}.` : ''}`;
      const ok = $('[data-ok]', form.parentElement);
      $('[data-ok-txt]', ok).textContent = confirmaNaHora
        ? `${s.nome} para ${p} pessoas, ${quando}. Está confirmado. Envie também pelo WhatsApp para receber o lembrete no dia.`
        : `${s.nome} para ${p} pessoas, ${quando}. Envie o pedido pelo WhatsApp: a Bia responde em até 4 horas${s.sinal ? ' com a chave Pix do sinal' : ''} e confirma.`;
      $('[data-ok-wa]', ok).href = wa(texto);
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
      guarda.gravar('amassa-contatos', [...guarda.ler('amassa-contatos', []), { nome: el('nome').value, assunto: el('assunto').value, em: new Date().toISOString() }]);
      $('[data-ok]', fc).hidden = false;
      open(wa(`Olá! Sou ${el('nome').value.trim()}. Assunto: ${el('assunto').value}. ${el('msg').value.trim()}`), '_blank', 'noopener');
      toast('Mensagem enviada');
      fc.reset();
    });
  }
})();

/* ---------- tema claro ou escuro (pílula na lateral e no menu do celular) ---------- */
(() => {
  const raiz = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  let fim;
  const marca = () => {
    document.querySelectorAll('[data-tema-ir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaIr === raiz.dataset.tema)));
    if (meta) meta.content = raiz.dataset.tema === 'claro' ? '#F6EEDD' : '#140D0B';
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tema-ir]');
    if (!b || b.dataset.temaIr === raiz.dataset.tema) return;
    // tema-anim liga a passagem suave das cores só durante a troca
    raiz.classList.add('tema-anim');
    raiz.dataset.tema = b.dataset.temaIr;
    try { localStorage.setItem('amassa-tema', raiz.dataset.tema); } catch (err) { /* sem armazenamento, vale só nesta visita */ }
    marca();
    clearTimeout(fim);
    fim = setTimeout(() => raiz.classList.remove('tema-anim'), 800);
  });
  marca();
})();
