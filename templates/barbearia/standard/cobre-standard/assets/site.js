// Cobre Barbearia, Silver: menu do celular, topo que some ao descer, relógio de Curitiba, revelações na rolagem,
// contadores, paralaxe, abas de serviços, galeria com filtro e ampliação, carrossel de depoimentos,
// agendamento com serviço, barbeiro, data e horário (pedido pelo WhatsApp, Google Agenda e .ics), dúvidas, janelas legais e cookies.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const D = JSON.parse($('#dados')?.textContent || '{}');
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reais = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
  const wa = (msg) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`;
  const limita = (v) => Math.min(1, Math.max(0, v));
  const hora = (h) => `${Math.floor(h)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;
  const minutos = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const DIAS_C = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const guarda = {
    ler(k, p) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : p; } catch { return p; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento */ } },
  };
  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (t) => { if (!toastEl) return; toastEl.textContent = t; toastEl.classList.add('ve'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('ve'), 2800); };

  // ---------- grupos com o mesmo tamanho: mede o item mais largo e aplica em --larg ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    if (!g.offsetParent && getComputedStyle(g).position !== 'fixed') return;
    if (getComputedStyle(g).position === 'static') g.style.position = 'relative';
    let maior = 0;
    for (const f of [...g.children]) {
      if (f.hidden || f.tagName === 'I') continue;
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
  const igualaDepois = () => { clearTimeout(igualaT); igualaT = setTimeout(() => { iguala(); marcaAba(); }, 60); };
  addEventListener('resize', igualaDepois);
  if (document.fonts) document.fonts.ready.then(igualaDepois);

  // ---------- menu do celular ----------
  const gaveta = $('#gaveta'), menuBtn = $('.menu-btn');
  const abreGaveta = () => {
    gaveta.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => gaveta.classList.add('abre')));
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    igualaDepois();
    setTimeout(() => $('.fecha', gaveta)?.focus(), 60);
  };
  const fechaGaveta = () => {
    gaveta.classList.remove('abre');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { gaveta.hidden = true; }, reduz ? 0 : 500);
  };
  menuBtn?.addEventListener('click', abreGaveta);
  $$('[data-fecha-gaveta]', gaveta).forEach((b) => b.addEventListener('click', () => { fechaGaveta(); menuBtn.focus(); }));
  $$('.gaveta-nav a', gaveta).forEach((a) => a.addEventListener('click', fechaGaveta));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && gaveta?.classList.contains('abre')) { fechaGaveta(); menuBtn.focus(); } });

  // ---------- relógio de Curitiba e "aberto agora" ----------
  const agoraLocal = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
    const h = +p.hour % 24, m = +p.minute, s = +p.second;
    return { dia, h, m, s, dec: h + m / 60 };
  };
  const status = () => {
    const a = agoraLocal(), hoje = D.abertura[a.dia];
    if (hoje && a.dec >= hoje[0] && a.dec < hoje[1]) return { aberto: true, txt: `Aberto agora, até as ${hora(hoje[1])}` };
    for (let k = 0; k < 8; k++) {
      const d = (a.dia + k) % 7, h = D.abertura[d];
      if (!h || (k === 0 && a.dec >= h[0])) continue;
      return { aberto: false, txt: `Fechado, abre ${k === 0 ? 'hoje' : k === 1 ? 'amanhã' : DIAS[d]} às ${hora(h[0])}` };
    }
    return { aberto: false, txt: 'Fechado' };
  };
  const relogio = $('[data-relogio]'), abertoEl = $('[data-aberto] span');
  const pinta = () => {
    const a = agoraLocal(), st = status();
    const hh = `${String(a.h).padStart(2, '0')}:${String(a.m).padStart(2, '0')}:${String(a.s).padStart(2, '0')}`;
    if (relogio) relogio.innerHTML = `Curitiba, <b>${hh}</b>. ${st.txt}`;
    if (abertoEl) abertoEl.textContent = st.txt;
  };
  pinta();
  setInterval(pinta, 1000);
  const hojeDia = agoraLocal().dia;
  $$(`.horas tr[data-dia="${hojeDia}"]`).forEach((tr) => tr.classList.add('hoje'));

  // ---------- revelações (uma vez), títulos palavra por palavra e contadores ----------
  const conta = (el) => {
    const alvo = parseFloat(el.dataset.conta), dec = +(el.dataset.dec || 0), sem = 'semMilhar' in el.dataset;
    const fmt = (v) => (sem ? String(Math.round(v)) : v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }));
    if (reduz) { el.textContent = fmt(alvo); return; }
    const ini = sem ? alvo - 30 : 0, t0 = performance.now(), dur = 1600;
    const passo = (t) => {
      const k = limita((t - t0) / dur), e = 1 - (1 - k) ** 3;
      el.textContent = fmt(ini + (alvo - ini) * e);
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };
  // as revelações só começam quando a tela de carregando se abre (senão a capa se monta escondida)
  const comecaRevelar = () => {
    const alvos = $$('.rev, .palavras, .revela, [data-conta]');
    if (reduz || !('IntersectionObserver' in window)) { alvos.forEach((el) => { el.classList.add('ve'); if (el.dataset.conta) conta(el); }); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('ve');
      if (e.target.dataset.conta) conta(e.target);
      io.unobserve(e.target);
    }), { rootMargin: '0px 0px -10% 0px' });
    alvos.forEach((el) => io.observe(el));
  };

  // ---------- carrossel da capa: cabelo, barba e sobrancelha ----------
  const slides = $$('.capa-slide'), slideBtns = $$('.capa-nav button'), slideNav = $('.capa-nav');
  if (slides.length > 1) {
    const DUR = 6000;
    let atual = 0, timer;
    slideNav.style.setProperty('--dur', `${DUR}ms`);
    slideNav.classList.add('parado');
    slides[0].classList.add('primeira');
    const agenda = () => { clearTimeout(timer); if (!reduz) timer = setTimeout(() => vai(atual + 1), DUR); };
    function vai(n) {
      n = (n + slides.length) % slides.length;
      if (n === atual) return;
      slides.forEach((s) => s.classList.remove('antes', 'primeira'));
      slides[atual].classList.remove('ativo');
      slides[atual].classList.add('antes');
      atual = n;
      void slides[atual].offsetWidth; // reinicia a animação do corte
      slides[atual].classList.add('ativo');
      slideBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(i === atual)));
      agenda();
    }
    slideBtns.forEach((b, i) => b.addEventListener('click', () => vai(i)));
    addEventListener('cobre:pronto', () => { if (!reduz) slideNav.classList.remove('parado'); agenda(); }, { once: true });
  }

  // ---------- tela de carregando ----------
  const carrega = $('#carrega');
  const pronto = () => {
    document.documentElement.classList.add('carregou');
    document.body.style.overflow = '';
    comecaRevelar();
    dispatchEvent(new Event('cobre:pronto'));
  };
  if (!carrega || reduz) { carrega?.classList.add('fim'); pronto(); } else {
    document.body.style.overflow = 'hidden';
    let rapido = false;
    try { rapido = sessionStorage.getItem('cobre-carregou') === '1'; sessionStorage.setItem('cobre-carregou', '1'); } catch { /* sem armazenamento */ }
    const minimo = rapido ? 700 : 2300; // na primeira visita a navalha passa devagar; nas páginas seguintes, rápido
    const imgs = $$('img').filter((i) => i.loading !== 'lazy');
    const total = imgs.length + 2;
    let feitos = 0;
    const conta1 = () => { feitos++; };
    imgs.forEach((i) => { if (i.complete) feitos++; else { i.addEventListener('load', conta1, { once: true }); i.addEventListener('error', conta1, { once: true }); } });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(conta1);
    if (document.readyState === 'complete') feitos++; else addEventListener('load', conta1, { once: true });
    const pcEl = $('[data-pc]', carrega), fraseEl = $('[data-frase]', carrega);
    const frases = ['Afiando a navalha', 'Esquentando a toalha', 'Ajeitando a cadeira'];
    let fraseI = 0, mostrado = 0, acabou = false;
    const t0 = performance.now();
    const passo = (t) => {
      if (acabou) return;
      const tempo = Math.min(1, (t - t0) / minimo);
      const real = t - t0 > 8000 ? 1 : feitos / total; // nunca prende o visitante: depois de 8 s abre de qualquer jeito
      mostrado += (Math.min(real, tempo) - mostrado) * .16;
      if (Math.min(real, tempo) >= 1 && mostrado > .985) mostrado = 1;
      carrega.style.setProperty('--pc', mostrado.toFixed(4));
      pcEl.textContent = Math.round(mostrado * 100);
      const f = Math.min(2, Math.floor(mostrado * 3));
      if (f !== fraseI) {
        fraseI = f;
        fraseEl.classList.add('troca');
        setTimeout(() => { fraseEl.textContent = frases[fraseI]; fraseEl.classList.remove('troca'); }, 260);
      }
      if (mostrado >= 1) {
        acabou = true;
        setTimeout(() => {
          carrega.classList.add('abre');
          setTimeout(pronto, 450);
          setTimeout(() => carrega.classList.add('fim'), 1500);
        }, 220);
        return;
      }
      requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  // ---------- rolagem: topo, capa e paralaxe ----------
  const topo = $('.topo'), capaEl = $('[data-capa]')?.parentElement;
  const pars = $$('[data-par]');
  let ultY = scrollY, pedido = false;
  const quadro = () => {
    pedido = false;
    const y = scrollY, vh = innerHeight;
    topo.classList.toggle('solido', y > 60);
    topo.classList.toggle('some', y > 400 && y > ultY + 4 && !gaveta.classList.contains('abre'));
    if (y < ultY - 4) topo.classList.remove('some');
    ultY = y;
    if (reduz) return;
    if (capaEl) capaEl.style.setProperty('--cp', limita(y / capaEl.offsetHeight).toFixed(3));
    for (const el of pars) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      const k = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.translate = `0 ${(k * parseFloat(el.dataset.par) * 100 * (innerWidth > 720 ? 1 : .5)).toFixed(1)}px`;
    }
  };
  addEventListener('scroll', () => { if (!pedido) { pedido = true; requestAnimationFrame(quadro); } }, { passive: true });
  quadro();

  // ---------- abas de serviços (marcador desliza) ----------
  const abas = $$('.abas [role="tab"]'), marca = $('.abas-marca');
  function marcaAba() {
    const a = abas.find((x) => x.getAttribute('aria-selected') === 'true');
    if (!a || !marca) return;
    marca.style.width = `${a.offsetWidth}px`;
    marca.style.translate = `${a.offsetLeft}px 0`;
  }
  const abreAba = (id, foco) => {
    abas.forEach((a) => {
      const sel = a.id === `aba-${id}`;
      a.setAttribute('aria-selected', String(sel));
      a.tabIndex = sel ? 0 : -1;
      $(`#${a.getAttribute('aria-controls')}`).hidden = !sel;
      if (sel && foco) a.focus();
    });
    marcaAba();
  };
  abas.forEach((a, i) => {
    a.addEventListener('click', () => abreAba(a.id.slice(4)));
    a.addEventListener('keydown', (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!k) return;
      e.preventDefault();
      abreAba(abas[(i + k + abas.length) % abas.length].id.slice(4), true);
    });
  });
  $$('[data-ir-aba]').forEach((l) => l.addEventListener('click', () => { if ($('.abas')) abreAba(l.dataset.irAba); }));
  marcaAba();

  // ---------- galeria: filtro por categoria e ampliação ----------
  const gals = $$('.gal');
  $$('[data-filtro]').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filtro;
    $$('[data-filtro]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    gals.forEach((g) => g.classList.add('sai'));
    setTimeout(() => {
      gals.forEach((g) => { g.hidden = f !== 'todos' && g.dataset.cat !== f; });
      requestAnimationFrame(() => requestAnimationFrame(() => gals.forEach((g) => g.classList.remove('sai'))));
    }, reduz ? 0 : 320);
  }));
  const cf = $('#caixa-foto');
  let cfLista = [], cfI = 0;
  const cfMostra = () => {
    const b = cfLista[cfI], img = $('img', b);
    $('img', cf).src = img.currentSrc || img.src;
    $('img', cf).alt = img.alt;
    $('figcaption', cf).textContent = img.alt;
  };
  $$('[data-foto]').forEach((b) => b.addEventListener('click', () => {
    cfLista = $$('.gal:not([hidden]) [data-foto]');
    cfI = cfLista.indexOf(b);
    cfMostra();
    cf.showModal();
  }));
  $$('[data-cf]', cf || document).forEach((b) => b.addEventListener('click', () => { cfI = (cfI + +b.dataset.cf + cfLista.length) % cfLista.length; cfMostra(); }));
  cf?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { cfI = (cfI + (e.key === 'ArrowRight' ? 1 : -1) + cfLista.length) % cfLista.length; cfMostra(); }
  });
  cf?.addEventListener('click', (e) => { if (e.target === cf || e.target.tagName === 'FIGURE') cf.close(); });

  // ---------- depoimentos: setas, arraste, barra de progresso e passagem automática ----------
  const trilho = $('.depo-trilho'), prog = $('.depo-prog');
  if (trilho) {
    const passo = () => ($('.depo-card', trilho)?.offsetWidth || 300) + 18;
    const atualiza = () => {
      const max = trilho.scrollWidth - trilho.clientWidth;
      const vis = trilho.clientWidth / trilho.scrollWidth;
      prog?.style.setProperty('--pp', `${Math.max(vis, max ? (trilho.scrollLeft / max) * (1 - vis) + vis : 1) * 100}%`);
    };
    const anda = (k) => {
      const max = trilho.scrollWidth - trilho.clientWidth - 4;
      if (k > 0 && trilho.scrollLeft >= max) trilho.scrollTo({ left: 0, behavior: reduz ? 'auto' : 'smooth' });
      else trilho.scrollBy({ left: k * passo(), behavior: reduz ? 'auto' : 'smooth' });
    };
    $$('[data-depo]').forEach((b) => b.addEventListener('click', () => { anda(+b.dataset.depo); pausa = true; }));
    trilho.addEventListener('scroll', atualiza, { passive: true });
    atualiza();
    let pausa = false, dentro = false;
    trilho.addEventListener('pointerenter', () => { dentro = true; });
    trilho.addEventListener('pointerleave', () => { dentro = false; });
    trilho.addEventListener('focusin', () => { pausa = true; });
    if (!reduz) setInterval(() => { if (!pausa && !dentro && !document.hidden) { const r = trilho.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) anda(1); } }, 6000);
    // arraste com o mouse (no toque, a rolagem nativa já resolve)
    let x0 = 0, s0 = 0, arrastando = false;
    trilho.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; arrastando = true; x0 = e.clientX; s0 = trilho.scrollLeft; trilho.classList.add('arrasta'); pausa = true; });
    addEventListener('pointermove', (e) => { if (arrastando) trilho.scrollLeft = s0 - (e.clientX - x0); });
    addEventListener('pointerup', () => { if (!arrastando) return; arrastando = false; trilho.classList.remove('arrasta'); });
  }

  // ---------- dúvidas: abre e fecha com altura animada ----------
  $$('.duv').forEach((d) => {
    const s = $('summary', d), r = $('.duv-r', d);
    s.addEventListener('click', (e) => {
      if (reduz || !r.animate) return;
      e.preventDefault();
      if (d.open) {
        const h = r.offsetHeight;
        r.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.22,.8,.24,1)' }).onfinish = () => { d.open = false; };
      } else {
        d.open = true;
        const h = r.offsetHeight;
        r.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 460, easing: 'cubic-bezier(.22,.8,.24,1)' });
      }
    });
  });

  // ---------- agendamento ----------
  const form = $('#form-agenda');
  if (form) {
    const S = Object.fromEntries(D.servicos.map((s) => [s.id, s]));
    const B = Object.fromEntries(D.equipe.map((b) => [b.id, b]));
    const selServ = $('#ag-servico'), extra = $('.ag-extra'), chkRisco = $('[name="risco"]', form);
    const diasEl = $('[data-dias]'), horasEl = $('[data-horas]'), aviso = $('[data-aviso-barbeiro]');
    const R = Object.fromEntries($$('[data-r]').map((el) => [el.dataset.r, el]));
    const erroEl = $('.ag-erro'), okEl = $('#ag-ok');
    const comRisco = new Set(['tesoura', 'degrade', 'maquina', 'corte-barba', 'ritual']);
    const st = { serv: '', risco: false, barb: 'qualquer', data: '', hora: null, quem: '' };

    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const deIso = (s) => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
    const duracao = () => (S[st.serv]?.min || 0) + (st.risco ? S.risco.min : 0);
    const preco = () => (S[st.serv]?.preco || 0) + (st.risco ? S.risco.preco : 0);
    const aptos = () => D.equipe.filter((b) => (!st.serv || b.faz.includes(st.serv)) && (!st.risco || b.faz.includes('risco')));
    const candidatos = (dia) => (st.barb === 'qualquer' ? aptos() : [B[st.barb]]).filter((b) => b && b.agenda[dia] && D.abertura[dia]);
    // ocupação simulada e estável: a mesma data e hora mostram sempre o mesmo resultado
    const ocupado = (bid, data, h) => {
      let x = 2166136261;
      for (const c of `${bid}|${data}|${h}`) x = Math.imul(x ^ c.charCodeAt(0), 16777619);
      x ^= x >>> 15; x = Math.imul(x, 2246822507); x ^= x >>> 13;
      return ((x >>> 0) % 100) < 30;
    };
    const livres = (data) => {
      const d = deIso(data), dia = d.getDay(), dur = duracao() || 30, out = new Map();
      const agora = agoraLocal(), ehHoje = data === iso(new Date());
      for (const b of candidatos(dia)) {
        const [ini, fim] = b.agenda[dia];
        for (let h = ini; h + dur / 60 <= fim + 1e-9; h += .5) {
          if (ehHoje && h < agora.dec + .5) continue;
          // o horário só serve se todos os blocos de meia hora da duração estiverem livres
          let ok = true;
          for (let k = h; k < h + dur / 60 - 1e-9; k += .5) if (ocupado(b.id, data, k)) { ok = false; break; }
          if (!out.has(h)) out.set(h, ok ? b.id : null); else if (!out.get(h) && ok) out.set(h, b.id);
        }
      }
      return [...out.entries()].sort((a, b) => a[0] - b[0]);
    };

    const pintaBarbeiros = () => {
      const ok = new Set(aptos().map((b) => b.id));
      $$('.ag-b[data-b]').forEach((l) => l.classList.toggle('nao', !ok.has(l.dataset.b)));
      if (st.barb !== 'qualquer' && !ok.has(st.barb)) {
        aviso.hidden = false;
        aviso.textContent = `${B[st.barb].nome.split(' ')[0]} não faz este serviço. Escolha outro barbeiro ou deixe sem preferência.`;
        $('[name="barbeiro"][value="qualquer"]', form).checked = true;
        st.barb = 'qualquer';
      } else aviso.hidden = true;
    };
    const pintaDias = () => {
      const hoje = new Date();
      let html = '';
      for (let k = 0; k < 14; k++) {
        const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + k), dia = d.getDay(), v = iso(d);
        const pode = candidatos(dia).length > 0 && (k > 0 || livres(v).some(([, b]) => b));
        html += `<label class="ag-dia"><input type="radio" name="data" value="${v}"${pode ? '' : ' disabled'}${st.data === v && pode ? ' checked' : ''}><span><small>${k === 0 ? 'Hoje' : DIAS_C[dia]}</small><b>${d.getDate()}</b><em>${MESES[d.getMonth()]}</em></span></label>`;
      }
      diasEl.innerHTML = html;
      if (st.data && !$(`[name="data"][value="${st.data}"]:not(:disabled)`, diasEl)) { st.data = ''; st.hora = null; }
    };
    const pintaHoras = () => {
      if (!st.serv || !st.data) { horasEl.innerHTML = `<p class="ag-vazio">${!st.serv ? 'Escolha o serviço' : 'Escolha a data'} para ver os horários livres.</p>`; st.hora = null; return; }
      const lista = livres(st.data);
      if (!lista.some(([, b]) => b)) { horasEl.innerHTML = '<p class="ag-vazio">Sem horário livre neste dia. Tente outra data ou outro barbeiro.</p>'; st.hora = null; return; }
      if (st.hora !== null && !lista.find(([h, b]) => h === st.hora && b)) st.hora = null;
      horasEl.innerHTML = lista.map(([h, b], i) => `<label class="ag-hora" style="--i:${i}"><input type="radio" name="hora" value="${h}" data-quem="${b || ''}"${b ? '' : ' disabled'}${st.hora === h ? ' checked' : ''}><span>${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}</span></label>`).join('');
      if (st.hora !== null) st.quem = lista.find(([h]) => h === st.hora)[1];
    };
    const resumo = () => {
      const s = S[st.serv];
      const set = (k, v, vazio) => { R[k].textContent = v || vazio; R[k].classList.toggle('vazio', !v); };
      set('servico', s ? `${s.nome}${st.risco ? ' + risco' : ''}` : '', 'Escolha o serviço');
      set('barbeiro', st.barb === 'qualquer' ? (st.quem && st.hora !== null ? `Sem preferência (${B[st.quem].nome.split(' ')[0]})` : 'Sem preferência') : B[st.barb].nome, '');
      const d = st.data ? deIso(st.data) : null;
      set('data', d ? `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}` : '', 'Escolha a data');
      set('hora', st.hora !== null ? `${String(Math.floor(st.hora)).padStart(2, '0')}:${st.hora % 1 ? '30' : '00'}` : '', 'Escolha o horário');
      R.min.textContent = minutos(duracao());
      R.total.textContent = s ? `${s.de ? 'a partir de ' : ''}${reais(preco())}` : 'R$ 0';
    };
    const tudo = () => { pintaBarbeiros(); pintaDias(); pintaHoras(); resumo(); };

    selServ.addEventListener('change', () => {
      st.serv = selServ.value;
      extra.hidden = !comRisco.has(st.serv);
      if (extra.hidden) { chkRisco.checked = false; st.risco = false; }
      selServ.closest('.campo').classList.remove('erro');
      tudo();
    });
    chkRisco.addEventListener('change', () => { st.risco = chkRisco.checked; tudo(); });
    form.addEventListener('change', (e) => {
      const t = e.target;
      if (t.name === 'barbeiro') { st.barb = t.value; aviso.hidden = true; pintaDias(); pintaHoras(); resumo(); }
      if (t.name === 'data') { st.data = t.value; st.hora = null; pintaHoras(); resumo(); }
      if (t.name === 'hora') { st.hora = +t.value; st.quem = t.dataset.quem; resumo(); }
    });
    // botões "Agendar" dos serviços, pacotes e da página da equipe
    const escolhe = (id) => {
      if (!S[id]) return;
      if (id === 'risco') { selServ.value = 'degrade'; st.serv = 'degrade'; chkRisco.checked = true; st.risco = true; } else { selServ.value = id; st.serv = id; }
      extra.hidden = !comRisco.has(st.serv);
      tudo();
    };
    $$('[data-agendar]').forEach((a) => a.addEventListener('click', () => escolhe(a.dataset.agendar)));
    const q = new URLSearchParams(location.search);
    if (q.get('servico')) escolhe(q.get('servico'));
    if (q.get('barbeiro') && B[q.get('barbeiro')]) {
      st.barb = q.get('barbeiro');
      const r = $(`[name="barbeiro"][value="${st.barb}"]`, form);
      if (r) r.checked = true;
    }
    extra.hidden = !comRisco.has(st.serv);
    tudo();

    const fone = $('[name="fone"]', form);
    fone.addEventListener('input', () => {
      const d = fone.value.replace(/\D/g, '').slice(0, 11);
      fone.value = d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
    });

    let ultimo = null;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = $('[name="nome"]', form), lgpd = $('[name="lgpd"]', form);
      const falta = [];
      if (!st.serv) { falta.push('o serviço'); selServ.closest('.campo').classList.add('erro'); }
      if (!st.data) falta.push('a data');
      if (st.hora === null) falta.push('o horário');
      nome.closest('.campo').classList.toggle('erro', nome.value.trim().length < 2);
      if (nome.value.trim().length < 2) falta.push('seu nome');
      const fd = fone.value.replace(/\D/g, '');
      fone.closest('.campo').classList.toggle('erro', fd.length < 10);
      if (fd.length < 10) falta.push('um WhatsApp válido');
      if (!lgpd.checked) falta.push('o aceite da política de privacidade');
      if (falta.length) {
        erroEl.hidden = false;
        erroEl.textContent = `Falta escolher ou preencher: ${falta.join(', ')}.`;
        return;
      }
      erroEl.hidden = true;
      const s = S[st.serv], d = deIso(st.data), hh = R.hora.textContent;
      const barb = st.barb === 'qualquer' ? `sem preferência (primeiro livre: ${B[st.quem].nome})` : B[st.barb].nome;
      const obs = $('[name="obs"]', form).value.trim();
      const msg = [
        `Olá, ${D.nome}! Quero agendar:`,
        `Serviço: ${s.nome}${st.risco ? ' + risco e desenho' : ''}`,
        `Barbeiro: ${barb}`,
        `Data: ${DIAS[d.getDay()]}, ${d.toLocaleDateString('pt-BR')} às ${hh}`,
        `Duração: ${minutos(duracao())}. Valor: ${s.de ? 'a partir de ' : ''}${reais(preco())}`,
        `Nome: ${nome.value.trim()}`,
        `WhatsApp: ${fone.value}`,
        obs ? `Observação: ${obs}` : '',
      ].filter(Boolean).join('\n');
      window.open(wa(msg), '_blank', 'noopener');
      const ini = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(st.hora), st.hora % 1 ? 30 : 0);
      const fim = new Date(ini.getTime() + duracao() * 60000);
      ultimo = { s, ini, fim, barb };
      $('[data-ok-txt]', okEl).textContent = `${s.nome} com ${st.barb === 'qualquer' ? B[st.quem].nome : B[st.barb].nome}, ${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} às ${hh}. O horário fica garantido quando confirmarmos pelo WhatsApp.`;
      const f = (x) => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      $('[data-gcal]', okEl).href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${s.nome}, ${D.nome}`)}&dates=${f(ini)}/${f(fim)}&details=${encodeURIComponent(`Barbeiro: ${barb}. Aguardando confirmação pelo WhatsApp.`)}&location=${encodeURIComponent(D.endereco)}`;
      form.hidden = true;
      okEl.hidden = false;
      igualaDepois();
      okEl.focus();
    });
    $('[data-ics]', okEl)?.addEventListener('click', () => {
      if (!ultimo) return;
      const f = (x) => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cobre Barbearia//Agenda//PT', 'BEGIN:VEVENT', `UID:${Date.now()}@cobrebarbearia`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(ultimo.ini)}`, `DTEND:${f(ultimo.fim)}`, `SUMMARY:${ultimo.s.nome}, ${D.nome}`, `DESCRIPTION:Barbeiro: ${ultimo.barb}. Aguardando confirmação pelo WhatsApp.`, `LOCATION:${D.endereco.replace(/,/g, '\\,')}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      a.download = 'agendamento-cobre.ics';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    $('[data-novo]', okEl)?.addEventListener('click', () => {
      okEl.hidden = true;
      form.hidden = false;
      st.hora = null;
      pintaHoras();
      resumo();
      form.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'start' });
    });
  }

  // ---------- janelas legais ----------
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-doc]');
    if (b) { e.preventDefault(); $(`#doc-${b.dataset.doc}`)?.showModal(); }
    const f = e.target.closest('[data-fecha]');
    if (f) f.closest('dialog')?.close();
  });
  $$('dialog.doc').forEach((d) => d.addEventListener('click', (e) => { if (e.target === d) d.close(); }));

  // ---------- cookies ----------
  const ck = $('#cookies');
  if (ck && !guarda.ler('cobre-cookies', null)) setTimeout(() => { ck.hidden = false; igualaDepois(); }, 1200);
  $$('[data-ck]').forEach((b) => b.addEventListener('click', () => { guarda.gravar('cobre-cookies', b.dataset.ck); ck.hidden = true; toast(b.dataset.ck === 'todos' ? 'Preferência salva: todos os cookies.' : 'Preferência salva: só os essenciais.'); }));
  $$('[data-cookies]').forEach((b) => b.addEventListener('click', () => { ck.hidden = false; igualaDepois(); }));

  iguala();
})();

/* ---------- tema claro ou escuro (pílula na lateral e no menu do celular) ---------- */
(() => {
  const raiz = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  let fim;
  const marca = () => {
    document.querySelectorAll('[data-tema-ir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaIr === raiz.dataset.tema)));
    if (meta) meta.content = raiz.dataset.tema === 'claro' ? '#F6F1EB' : '#111111';
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tema-ir]');
    if (!b || b.dataset.temaIr === raiz.dataset.tema) return;
    // tema-anim liga a passagem suave das cores só durante a troca
    raiz.classList.add('tema-anim');
    raiz.dataset.tema = b.dataset.temaIr;
    try { localStorage.setItem('cobre-barbearia-tema', raiz.dataset.tema); } catch (err) { /* sem armazenamento, vale só nesta visita */ }
    marca();
    clearTimeout(fim);
    fim = setTimeout(() => raiz.classList.remove('tema-anim'), 800);
  });
  marca();
})();
