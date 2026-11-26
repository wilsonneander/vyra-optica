// Cobre Premium: tela de carregando com o relógio do corte, transição entre páginas, cursor com listras de poste,
// botões magnéticos, história na rolagem (monta descendo, desfaz e refaz subindo), carrossel da capa,
// cardápio com foto, linha do tempo de 45 minutos, guia do degradê, equipe em leque, galeria em carrossel,
// cupom de avaliações, cartão do clube, agendamento (serviço, barbeiro, data e horário), contato, dúvidas, janelas legais e cookies.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const raiz = document.documentElement;
  const D = JSON.parse($('#dados')?.textContent || '{}');
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(pointer: fine)').matches;
  const reais = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
  const wa = (msg) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`;
  const limita = (v) => Math.min(1, Math.max(0, v));
  const hora = (h) => `${Math.floor(h)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;
  const hhmm = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`;
  const minutos = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const DIAS_C = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const guarda = {
    ler(k, p, t = localStorage) { try { const v = t.getItem(k); return v ? JSON.parse(v) : p; } catch { return p; } },
    gravar(k, v, t = localStorage) { try { t.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento */ } },
    apagar(k, t = localStorage) { try { t.removeItem(k); } catch { /* sem armazenamento */ } },
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
    setTimeout(() => { gaveta.hidden = true; }, reduz ? 0 : 550);
  };
  menuBtn?.addEventListener('click', abreGaveta);
  $$('[data-fecha-gaveta]', gaveta).forEach((b) => b.addEventListener('click', () => { fechaGaveta(); menuBtn.focus(); }));
  $$('.gaveta-nav a', gaveta).forEach((a) => a.addEventListener('click', fechaGaveta));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && gaveta?.classList.contains('abre')) { fechaGaveta(); menuBtn.focus(); } });

  // ---------- hora de Curitiba, "aberto agora" e agenda simulada ----------
  const agoraLocal = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
    const h = +p.hour % 24, m = +p.minute, s = +p.second;
    return { dia, h, m, s, dec: h + m / 60 };
  };
  const status = () => {
    const a = agoraLocal(), hoje = D.abertura[a.dia];
    if (hoje && a.dec >= hoje[0] && a.dec < hoje[1]) return { aberto: true, txt: `Aberto até as ${hora(hoje[1])}`, curto: `Aberto até ${hora(hoje[1])}` };
    for (let k = 0; k < 8; k++) {
      const d = (a.dia + k) % 7, h = D.abertura[d];
      if (!h || (k === 0 && a.dec >= h[0])) continue;
      const quando = k === 0 ? 'hoje' : k === 1 ? 'amanhã' : DIAS[d];
      return { aberto: false, txt: `Fechado, abre ${quando} às ${hora(h[0])}`, curto: `Abre ${quando} ${hora(h[0])}` };
    }
    return { aberto: false, txt: 'Fechado', curto: 'Fechado' };
  };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const deIso = (s) => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
  // ocupação simulada e estável: a mesma data e hora mostram sempre o mesmo resultado (até ligar uma agenda de verdade)
  const ocupado = (bid, data, h) => {
    let x = 2166136261;
    for (const c of `${bid}|${data}|${h}`) x = Math.imul(x ^ c.charCodeAt(0), 16777619);
    x ^= x >>> 15; x = Math.imul(x, 2246822507); x ^= x >>> 13;
    return ((x >>> 0) % 100) < 30;
  };
  const proximoLivre = (b) => {
    const agora = agoraLocal(), hoje = new Date();
    for (let k = 0; k < 14; k++) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + k), dia = d.getDay(), ag = b.agenda[dia];
      if (!ag || !D.abertura[dia]) continue;
      for (let h = ag[0]; h + .5 <= ag[1]; h += .5) {
        if (k === 0 && h < agora.dec + .5) continue;
        if (!ocupado(b.id, iso(d), h)) return k === 0 ? `Hoje, ${hora(h)}` : k === 1 ? `Amanhã, ${hora(h)}` : `${DIAS_C[dia]}, ${d.getDate()} de ${MESES[d.getMonth()]}, ${hora(h)}`;
      }
    }
    return 'Consulte pelo WhatsApp';
  };
  $$('[data-proximo]').forEach((el) => { const b = D.equipe.find((x) => x.id === el.dataset.proximo); if (b) el.textContent = proximoLivre(b); });

  const relogio = $('[data-relogio]'), abertoEl = $('[data-aberto]');
  const pinta = () => {
    const a = agoraLocal(), st = status();
    if (relogio) relogio.textContent = `${String(a.h).padStart(2, '0')}:${String(a.m).padStart(2, '0')}, ${st.txt.toLowerCase()}`;
    if (abertoEl) { $('span', abertoEl).textContent = `${String(a.h).padStart(2, '0')}:${String(a.m).padStart(2, '0')}, ${st.aberto ? st.curto.toLowerCase() : 'fechado'}`; abertoEl.classList.toggle('sim', st.aberto); }
  };
  pinta();
  setInterval(pinta, 15000);
  $$(`.horas tr[data-dia="${agoraLocal().dia}"]`).forEach((tr) => tr.classList.add('hoje'));

  // ---------- revelações nos dois sentidos: títulos, fotos e contadores ligam ao entrar e desligam ao sair ----------
  const conta = (el) => {
    const alvo = parseFloat(el.dataset.conta), dec = +(el.dataset.dec || 0);
    const fmt = (v) => v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (reduz) { el.textContent = fmt(alvo); return; }
    const t0 = performance.now(), dur = 1500;
    const passo = (t) => {
      const k = limita((t - t0) / dur), e = 1 - (1 - k) ** 3;
      el.textContent = fmt(alvo * e);
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };
  const comecaRevelar = () => {
    const alvos = $$('.palavras, .revela, [data-conta]');
    if (reduz || !('IntersectionObserver' in window)) { alvos.forEach((el) => { el.classList.add('visto'); if (el.dataset.conta) conta(el); }); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const el = e.target;
      if (e.isIntersecting && !el.classList.contains('visto')) { el.classList.add('visto'); if (el.dataset.conta) conta(el); }
      else if (!e.isIntersecting) el.classList.remove('visto');
    }), { rootMargin: '-6% 0px -6% 0px' });
    alvos.forEach((el) => io.observe(el));
  };

  // ---------- tela de carregando: o relógio vai de 00 a 45 minutos conforme as fotos e fontes chegam ----------
  const carrega = $('#carrega');
  const troca = $('.troca');
  let jaPronto = false;
  const pronto = () => {
    if (jaPronto) return;
    jaPronto = true;
    raiz.classList.add('carregou');
    document.body.style.overflow = '';
    comecaRevelar();
    dispatchEvent(new Event('cobre:pronto'));
  };
  if (raiz.classList.contains('chegando')) {
    // veio de outra página do site: a cortina da transição sai e a abertura não repete
    guarda.apagar('cobre-premium-troca', sessionStorage);
    carrega?.classList.add('fim');
    pronto();
    requestAnimationFrame(() => requestAnimationFrame(() => troca?.classList.add('descobre')));
    setTimeout(() => { raiz.classList.remove('chegando'); troca?.classList.remove('descobre'); }, 1100);
  } else if (!carrega || reduz) { carrega?.classList.add('fim'); pronto(); } else {
    document.body.style.overflow = 'hidden';
    const rapido = guarda.ler('cobre-premium-abertura', false, sessionStorage);
    guarda.gravar('cobre-premium-abertura', true, sessionStorage);
    const minimo = rapido ? 650 : 2300;
    const imgs = $$('img').filter((i) => i.loading !== 'lazy');
    const total = imgs.length + 2;
    let feitos = 0;
    const conta1 = () => { feitos++; };
    imgs.forEach((i) => { if (i.complete) feitos++; else { i.addEventListener('load', conta1, { once: true }); i.addEventListener('error', conta1, { once: true }); } });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(conta1);
    if (document.readyState === 'complete') feitos++; else addEventListener('load', conta1, { once: true });
    const minEl = $('[data-carrega-min]', carrega), fraseEl = $('[data-frase]', carrega);
    const frases = D.carregando || [];
    let fraseI = 0, mostrado = 0, acabou = false;
    const t0 = performance.now();
    const passo = (t) => {
      if (acabou) return;
      const tempo = Math.min(1, (t - t0) / minimo);
      const real = t - t0 > 8000 ? 1 : feitos / total; // nunca prende o visitante: depois de 8 s abre de qualquer jeito
      mostrado += (Math.min(real, tempo) - mostrado) * .14;
      if (Math.min(real, tempo) >= 1 && mostrado > .985) mostrado = 1;
      carrega.style.setProperty('--pc', mostrado.toFixed(4));
      minEl.textContent = String(Math.round(mostrado * 45)).padStart(2, '0');
      const f = Math.min(frases.length - 1, Math.floor(mostrado * frases.length));
      if (f !== fraseI && frases[f]) {
        fraseI = f;
        fraseEl.classList.add('troca');
        setTimeout(() => { fraseEl.textContent = frases[fraseI]; fraseEl.classList.remove('troca'); }, 240);
      }
      if (mostrado >= 1) {
        acabou = true;
        setTimeout(() => {
          carrega.classList.add('abre');
          setTimeout(pronto, 380);
          setTimeout(() => carrega.classList.add('fim'), 1200);
        }, 240);
        return;
      }
      requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  // ---------- transição entre páginas: a cortina sobe antes de trocar de página ----------
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || reduz || !troca || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname) || url.pathname === location.pathname) return;
    e.preventDefault();
    guarda.gravar('cobre-premium-troca', 1, sessionStorage);
    troca.classList.add('cobre');
    setTimeout(() => { location.href = url.href; }, 650);
  });
  // a página volta do cache do navegador (botão voltar) sem a cortina fechada
  addEventListener('pageshow', (e) => { if (e.persisted) { troca?.classList.remove('cobre'); guarda.apagar('cobre-premium-troca', sessionStorage); } });

  // ---------- cursor: anel com listras de poste que segue o mouse com atraso ----------
  const cursor = $('.cursor');
  if (cursor && fino && !reduz) {
    raiz.classList.add('cursor-on');
    const txt = $('.cursor-txt', cursor);
    let x = -100, y = -100, ax = -100, ay = -100, anda = false;
    const segue = () => {
      ax += (x - ax) * .2; ay += (y - ay) * .2;
      cursor.style.setProperty('--ax', `${ax.toFixed(1)}px`); cursor.style.setProperty('--ay', `${ay.toFixed(1)}px`);
      if (Math.abs(x - ax) + Math.abs(y - ay) > .3) requestAnimationFrame(segue); else anda = false;
    };
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      cursor.style.setProperty('--x', `${x}px`); cursor.style.setProperty('--y', `${y}px`);
      cursor.classList.remove('fora');
      if (!anda) { anda = true; requestAnimationFrame(segue); }
    }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      const t = e.target;
      const palavra = t.closest('[data-cursor]');
      const campo = t.closest('input:not([type="range"]), select, textarea');
      const link = t.closest('a, button, label, summary, [role="tab"], input[type="range"]');
      cursor.classList.toggle('campo', !!campo);
      cursor.classList.toggle('palavra', !!palavra && !campo);
      cursor.classList.toggle('link', !!link && !palavra && !campo);
      if (palavra) txt.innerHTML = `<span>${palavra.dataset.cursor}</span>`;
    });
    document.addEventListener('pointerleave', () => cursor.classList.add('fora'));
    addEventListener('pointerdown', () => cursor.classList.add('aperta'));
    addEventListener('pointerup', () => cursor.classList.remove('aperta'));
  }

  // ---------- botões: o fundo cresce de onde o mouse entra; magnéticos com mola ----------
  $$('.btn').forEach((b) => {
    const marca = (e) => { const r = b.getBoundingClientRect(); b.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`); b.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`); };
    b.addEventListener('pointerenter', marca);
    b.addEventListener('pointerleave', marca);
  });
  if (fino && !reduz) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${((e.clientX - r.left - r.width / 2) * .28).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * .34).toFixed(1)}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
    // cards e fotos inclinam seguindo o mouse
    $$('[data-inclina]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--rx', `${((.5 - py) * 9).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${((px - .5) * 11).toFixed(2)}deg`);
      });
      el.addEventListener('pointerleave', () => { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); });
    });
  }

  // ---------- carrossel da capa: setas, pontos, arraste e pausa ao passar o mouse ----------
  const moldura = $('.capa-moldura');
  const slides = $$('.capa-slide'), pontos = $$('[data-capa-slide]');
  if (moldura && slides.length > 1) {
    const DUR = 6500;
    let atual = 0, timer, pausado = false;
    moldura.style.setProperty('--dur', `${DUR}ms`);
    moldura.classList.add('parado');
    const agenda = () => { clearTimeout(timer); if (!reduz && !pausado && jaPronto) timer = setTimeout(() => vai(atual + 1, 1), DUR); };
    function vai(n, dir) {
      n = (n + slides.length) % slides.length;
      if (n === atual) return;
      moldura.classList.toggle('volta', dir < 0);
      slides.forEach((s) => s.classList.remove('antes'));
      slides[atual].classList.remove('ativo');
      slides[atual].classList.add('antes');
      atual = n;
      void slides[atual].offsetWidth; // reinicia o corte
      slides[atual].classList.add('ativo');
      pontos.forEach((b, i) => b.setAttribute('aria-pressed', String(i === atual)));
      agenda();
    }
    pontos.forEach((b, i) => b.addEventListener('click', () => vai(i, i > atual ? 1 : -1)));
    $$('[data-capa-ir]').forEach((b) => b.addEventListener('click', () => vai(atual + +b.dataset.capaIr, +b.dataset.capaIr)));
    moldura.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'mouse') return; pausado = true; moldura.classList.add('parado'); clearTimeout(timer); });
    moldura.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'mouse') return; pausado = false; if (!reduz) moldura.classList.remove('parado'); agenda(); });
    const area = $('[data-carrossel]');
    let x0 = null;
    area.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    addEventListener('pointerup', (e) => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) vai(atual + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); });
    addEventListener('cobre:pronto', () => { if (!reduz) moldura.classList.remove('parado'); agenda(); }, { once: true });
  }

  // ---------- cardápio: abas por segmento e a foto ao lado troca com uma cortina ----------
  const fotoLado = $('[data-cardapio-foto]');
  const mostraPrato = (li) => {
    if (!li || !fotoLado) return;
    $$('.prato.ativo').forEach((x) => x.classList.remove('ativo'));
    li.classList.add('ativo');
    const src = `assets/img/${li.dataset.pratoFoto}.webp`;
    const ultima = $$('img', fotoLado).at(-1);
    $('[data-cardapio-nome]', fotoLado).textContent = li.dataset.pratoNome;
    $('[data-cardapio-preco]', fotoLado).textContent = li.dataset.pratoPreco;
    if (ultima?.getAttribute('src') === src) return;
    const img = new Image();
    img.src = src; img.alt = ''; img.className = reduz ? '' : 'entra';
    fotoLado.insertBefore(img, $('figcaption', fotoLado));
    $$('img', fotoLado).slice(0, -2).forEach((x) => x.remove());
  };
  $$('.prato').forEach((li) => { li.addEventListener('pointerenter', () => mostraPrato(li)); li.addEventListener('focusin', () => mostraPrato(li)); });
  const abas = $$('.abas [role="tab"]');
  const abreAba = (id, foco) => {
    abas.forEach((a) => {
      const sel = a.id === `aba-${id}`;
      a.setAttribute('aria-selected', String(sel));
      a.tabIndex = sel ? 0 : -1;
      const painel = $(`#${a.getAttribute('aria-controls')}`);
      painel.hidden = !sel;
      if (sel) { mostraPrato($('.prato', painel)); if (foco) a.focus(); }
    });
    requestAnimationFrame(rola);
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
  $$('[data-ir-aba]').forEach((l) => l.addEventListener('click', () => { if (abas.length) abreAba(l.dataset.irAba); }));
  mostraPrato($('.seg:not([hidden]) .prato'));

  // ---------- guia do degradê: a linha sobe e o cabelo se desfaz até a pele ----------
  const guia = $('#guia');
  let degradeAtual = 2;
  if (guia && D.degrades) {
    // as duas máscaras (cabelo e barba por fazer) usam os mesmos pontos: onde o cabelo começa a sumir, o meio e a pele
    const stops = $$('[data-stop]', guia);
    const linha = $('[data-linha-degrade]', guia), regua = $('[data-guia-regua]', guia);
    const campos = $$('[data-guia]', guia);
    const Y0 = 30, FIM = 268, ALT = FIM - Y0, BASE = 256; // medidas do desenho (viewBox 400 x 440)
    const alvoDe = (d) => {
      const topo = BASE - d.alto * 150, pele = topo + (FIM - topo) * (1 - d.pele);
      return { topo, cabelo: (topo - Y0) / ALT, meio: ((topo + pele) / 2 - Y0) / ALT, pele: Math.min(1, (pele - Y0) / ALT) };
    };
    let cur = alvoDe(D.degrades[degradeAtual]);
    const pintaStops = (v) => stops.forEach((s) => s.setAttribute('offset', v[s.dataset.stop].toFixed(3)));
    pintaStops(cur);
    linha.style.translate = `0 ${cur.topo - 200}px`;
    const aplica = (i) => {
      degradeAtual = i;
      const d = D.degrades[i], alvo = alvoDe(d), ini = { ...cur }, t0 = performance.now();
      const anda = (t) => {
        const k = reduz ? 1 : limita((t - t0) / 700), e = k < .5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2;
        cur = Object.fromEntries(Object.keys(alvo).map((c) => [c, ini[c] + (alvo[c] - ini[c]) * e]));
        pintaStops(cur);
        if (k < 1) requestAnimationFrame(anda);
      };
      requestAnimationFrame(anda);
      linha.style.translate = `0 ${alvo.topo - 200}px`;
      campos.forEach((c) => { c.textContent = d[c.dataset.guia]; });
      const ficha = $('.guia-ficha', guia);
      ficha.classList.remove('guia-troca'); void ficha.offsetWidth; ficha.classList.add('guia-troca');
      regua.value = i;
      regua.setAttribute('aria-valuetext', d.nome);
      $$('[data-guia-ir]', guia).forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.guiaIr === i)));
    };
    regua.addEventListener('input', () => aplica(+regua.value));
    $$('[data-guia-ir]', guia).forEach((b) => b.addEventListener('click', () => aplica(+b.dataset.guiaIr)));
  }

  // ---------- galeria: carrossel com filtro, setas, arraste, passagem automática e ampliação ----------
  const pista = $('[data-pista]');
  const gals = $$('.gal');
  if (pista) {
    const passo = () => { const g = gals.find((x) => !x.hidden); return (g ? g.offsetWidth : 300) + 18; };
    const anda = (k) => {
      const max = pista.scrollWidth - pista.clientWidth - 4;
      if (k > 0 && pista.scrollLeft >= max) pista.scrollTo({ left: 0, behavior: reduz ? 'auto' : 'smooth' });
      else if (k < 0 && pista.scrollLeft <= 4) pista.scrollTo({ left: max + 4, behavior: reduz ? 'auto' : 'smooth' });
      else pista.scrollBy({ left: k * passo(), behavior: reduz ? 'auto' : 'smooth' });
    };
    $$('[data-gal-ir]').forEach((b) => b.addEventListener('click', () => anda(+b.dataset.galIr)));
    // passa sozinho a cada 4,5 s enquanto está na tela; para com o mouse em cima, com o foco ou durante o arraste
    let parado = false;
    const sec = pista.closest('section');
    [pista, $('.gal-setas')].forEach((el) => { el?.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') parado = true; }); el?.addEventListener('pointerleave', () => { parado = false; }); });
    pista.addEventListener('focusin', () => { parado = true; });
    pista.addEventListener('focusout', () => { parado = false; });
    if (!reduz) setInterval(() => { if (parado || document.hidden) return; const r = sec.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) anda(1); }, 4500);
    // arraste com o mouse (no toque, a rolagem lateral nativa já resolve)
    let x0 = 0, s0 = 0, movido = 0, arrastando = false;
    pista.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; arrastando = true; movido = 0; x0 = e.clientX; s0 = pista.scrollLeft; });
    addEventListener('pointermove', (e) => {
      if (!arrastando) return;
      movido = Math.abs(e.clientX - x0);
      if (movido > 6) pista.classList.add('arrasta');
      pista.scrollLeft = s0 - (e.clientX - x0);
    });
    addEventListener('pointerup', () => { if (!arrastando) return; arrastando = false; requestAnimationFrame(() => pista.classList.remove('arrasta')); });
  }
  $$('[data-filtro]').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filtro;
    $$('[data-filtro]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    gals.forEach((g) => g.classList.add('sai'));
    setTimeout(() => {
      gals.forEach((g) => { g.hidden = f !== 'todos' && g.dataset.cat !== f; });
      pista?.scrollTo({ left: 0 });
      requestAnimationFrame(() => gals.forEach((g) => g.classList.remove('sai')));
    }, reduz ? 0 : 340);
  }));
  const cf = $('#caixa-foto');
  let cfLista = [], cfI = 0;
  const cfMostra = () => {
    const img = $('img', cfLista[cfI]);
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
  cf?.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { cfI = (cfI + (e.key === 'ArrowRight' ? 1 : -1) + cfLista.length) % cfLista.length; cfMostra(); } });
  cf?.addEventListener('click', (e) => { if (e.target === cf || e.target.tagName === 'FIGURE') cf.close(); });

  // ---------- a história na rolagem ----------
  const cenas = reduz ? [] : $$('.cena, .cena-lado, .cena-zoom').map((el) => {
    const irmaos = [...el.parentElement.children].filter((x) => x.matches('.cena, .cena-lado, .cena-zoom'));
    return { el, atraso: Math.min(irmaos.indexOf(el), 6) * .035 };
  });
  const paralaxe = reduz ? [] : $$('.casa-foto img, .toalha-foto img, .fecho-foto img').map((el) => [el, el.closest('section') || el]);
  const topo = $('.topo');
  const manifesto = $$('[data-acende] span');
  const manifestoEl = $('[data-acende]');
  const corte = $('.corte'), corteFotos = $$('.corte-foto'), cortePassos = $$('.corte-passo'), corteRel = $('[data-corte-relogio]');
  const leque = $('[data-leque]'), cupom = $('[data-cupom]'), cupomPapel = $('.cupom-papel'), cartao = $('[data-cartao]');
  let cartaoMouse = false, corteI = -1, acesas = -1;
  let ultY = scrollY, pedido = false;
  raiz.dataset.rolagem = 'desce';
  function rola() {
    pedido = false;
    const vh = innerHeight, y = scrollY;
    if (Math.abs(y - ultY) > 2) raiz.dataset.rolagem = y > ultY ? 'desce' : 'sobe';
    topo?.classList.toggle('some', y > 500 && y > ultY + 4 && !gaveta?.classList.contains('abre'));
    if (y < ultY - 4) topo?.classList.remove('some');
    velocidade = Math.min(40, velocidade + Math.abs(y - ultY) * .15);
    ultY = y;
    if (reduz) return;
    // primeiro lê tudo, depois escreve, para não forçar o layout a cada elemento
    const leituras = cenas.map(({ el, atraso }) => { const r = el.getBoundingClientRect(); return [el, r.top, r.bottom, atraso, r.width === 0 && r.height === 0]; });
    const par = paralaxe.map(([el, sec]) => [el, sec.getBoundingClientRect()]);
    const rMold = moldura?.getBoundingClientRect(), rMan = manifestoEl?.getBoundingClientRect(), rCorte = corte?.getBoundingClientRect();
    const rLeque = leque?.getBoundingClientRect(), rCupom = cupom?.getBoundingClientRect(), rCartao = cartao?.getBoundingClientRect();

    for (const [el, top, bottom, atraso, oculto] of leituras) {
      if (oculto) { el.style.setProperty('--p', 1); el.style.setProperty('--q', 1); continue; }
      const p = limita((vh * (1.02 - atraso) - top) / (vh * .32));
      const q = limita((bottom - vh * .02) / (vh * .3));
      el.style.setProperty('--p', (1 - (1 - p) ** 3).toFixed(3));
      el.style.setProperty('--q', (1 - (1 - q) ** 3).toFixed(3));
    }
    for (const [el, r] of par) {
      if (r.bottom < -200 || r.top > vh + 200) continue;
      el.style.setProperty('--py', `${((r.top + r.height / 2 - vh / 2) * -.08).toFixed(1)}px`);
    }
    if (rMold) moldura.style.setProperty('--cp', limita(-rMold.top / (rMold.height * .9) + (y > 0 ? .02 : 0)).toFixed(3));
    if (rMan && manifesto.length) {
      const k = limita((vh * .85 - rMan.top) / (rMan.height + vh * .3));
      const n = Math.round(k * manifesto.length);
      if (n !== acesas) { acesas = n; manifesto.forEach((s, i) => s.classList.toggle('on', i < n)); }
    }
    if (rCorte) {
      const k = limita(-rCorte.top / (rCorte.height - vh));
      corte.style.setProperty('--cp', k.toFixed(4));
      const min = k * 45;
      corteRel.textContent = `${String(Math.floor(min)).padStart(2, '0')}:${String(Math.floor((min % 1) * 60)).padStart(2, '0')}`;
      let i = 0;
      D.etapas.forEach((m, j) => { if (min >= m) i = j; });
      if (i !== corteI) {
        corteI = i;
        corteFotos.forEach((f, j) => { f.classList.toggle('ativo', j === i); f.classList.toggle('passou', j < i); });
        cortePassos.forEach((p2, j) => { p2.classList.toggle('ativo', j === i); p2.classList.toggle('passou', j < i); });
      }
    }
    if (rLeque && innerWidth > 1000) leque.style.setProperty('--abre', (1 - (1 - limita((vh * .95 - rLeque.top) / (vh * .55))) ** 2).toFixed(3));
    if (rCupom) cupomPapel.style.setProperty('--imp', Math.max(.06, limita((vh * .92 - rCupom.top) / Math.min(rCupom.height, vh * 1.1))).toFixed(3));
    if (rCartao && !cartaoMouse) {
      const c = (rCartao.top + rCartao.height / 2 - vh / 2) / vh;
      cartao.style.setProperty('--ry', `${(-16 + c * 26).toFixed(2)}deg`);
      cartao.style.setProperty('--rx', `${(8 - c * 10).toFixed(2)}deg`);
    }
  }
  // velocidade da rolagem acelera as faixas e as listras do poste, depois volta ao normal
  let velocidade = 0, laco = false;
  const animsVel = () => [...$$('.faixa-trilho'), ...$$('.poste-listras')].flatMap((el) => el.getAnimations());
  let anims = [];
  const acelera = () => {
    velocidade *= .92;
    const taxa = 1 + velocidade / 4;
    anims.forEach((a) => { a.playbackRate = taxa; });
    if (velocidade > .05) requestAnimationFrame(acelera); else { anims.forEach((a) => { a.playbackRate = 1; }); laco = false; }
  };
  addEventListener('scroll', () => {
    if (!pedido) { pedido = true; requestAnimationFrame(rola); }
    if (!reduz && !laco) { laco = true; if (!anims.length) anims = animsVel(); requestAnimationFrame(acelera); }
  }, { passive: true });
  addEventListener('resize', rola);
  addEventListener('load', rola);
  if ('ResizeObserver' in window) { let ro = false; new ResizeObserver(() => { if (!ro) { ro = true; requestAnimationFrame(() => { ro = false; rola(); }); } }).observe($('main') || document.body); }
  rola();

  // cartão do clube: inclina e brilha seguindo o mouse
  if (cartao && fino && !reduz) {
    cartao.addEventListener('pointermove', (e) => {
      cartaoMouse = true;
      const r = cartao.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      cartao.style.setProperty('--ry', `${((px - .5) * 28).toFixed(2)}deg`);
      cartao.style.setProperty('--rx', `${((.5 - py) * 22).toFixed(2)}deg`);
      cartao.style.setProperty('--bx', `${(px * 100).toFixed(1)}%`);
      cartao.style.setProperty('--by', `${(py * 100).toFixed(1)}%`);
    });
    cartao.addEventListener('pointerleave', () => { cartaoMouse = false; rola(); });
  }

  // ---------- dúvidas: abre e fecha com altura animada ----------
  $$('.duv').forEach((d) => {
    const s = $('summary', d), r = $('.duv-r', d);
    s.addEventListener('click', (e) => {
      if (reduz || !r.animate) return;
      e.preventDefault();
      if (d.open) {
        r.animate([{ height: `${r.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.22,.8,.24,1)' }).onfinish = () => { d.open = false; };
      } else {
        d.open = true;
        r.animate([{ height: '0px', opacity: 0 }, { height: `${r.offsetHeight}px`, opacity: 1 }], { duration: 460, easing: 'cubic-bezier(.22,.8,.24,1)' });
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
    const erroEl = $('.ag-erro', form), okEl = $('#ag-ok');
    const comRisco = new Set(['tesoura', 'degrade', 'maquina', 'corte-barba', 'ritual']);
    const st = { serv: '', risco: false, barb: 'qualquer', data: '', hora: null, quem: '' };
    const duracao = () => (S[st.serv]?.min || 0) + (st.risco ? S.risco.min : 0);
    const preco = () => (S[st.serv]?.preco || 0) + (st.risco ? S.risco.preco : 0);
    const aptos = () => D.equipe.filter((b) => (!st.serv || b.faz.includes(st.serv)) && (!st.risco || b.faz.includes('risco')));
    const candidatos = (dia) => (st.barb === 'qualquer' ? aptos() : [B[st.barb]]).filter((b) => b && b.agenda[dia] && D.abertura[dia]);
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
      horasEl.innerHTML = lista.map(([h, b], i) => `<label class="ag-hora" style="--i:${i}"><input type="radio" name="hora" value="${h}" data-quem="${b || ''}"${b ? '' : ' disabled'}${st.hora === h ? ' checked' : ''}><span>${hhmm(h)}</span></label>`).join('');
      if (st.hora !== null) st.quem = lista.find(([h]) => h === st.hora)[1];
    };
    const resumo = () => {
      const s = S[st.serv];
      const set = (k, v, vazio) => { R[k].textContent = v || vazio; R[k].classList.toggle('vazio', !v); };
      set('servico', s ? `${s.nome}${st.risco ? ' + risco' : ''}` : '', 'Escolha o serviço');
      set('barbeiro', st.barb === 'qualquer' ? (st.quem && st.hora !== null ? `Sem preferência (${B[st.quem].nome.split(' ')[0]})` : 'Sem preferência') : B[st.barb].nome, '');
      const d = st.data ? deIso(st.data) : null;
      set('data', d ? `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}` : '', 'Escolha a data');
      set('hora', st.hora !== null ? hhmm(st.hora) : '', 'Escolha o horário');
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
    // botões "Agendar" do cardápio, pacotes, guia, barboterapia e da página da equipe
    const escolhe = (id) => {
      if (!S[id]) return;
      if (id === 'risco') { selServ.value = 'degrade'; st.serv = 'degrade'; chkRisco.checked = true; st.risco = true; } else { selServ.value = id; st.serv = id; }
      extra.hidden = !comRisco.has(st.serv);
      tudo();
    };
    $$('[data-agendar]').forEach((a) => a.addEventListener('click', () => {
      escolhe(a.dataset.agendar);
      if ('guiaAgendar' in a.dataset && D.degrades) $('[name="obs"]', form).value = `Quero o ${D.degrades[degradeAtual].nome.toLowerCase()}, escolhido no guia do site.`;
    }));
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
    const mascara = (el) => el.addEventListener('input', () => {
      const d = el.value.replace(/\D/g, '').slice(0, 11);
      el.value = d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
    });
    mascara(fone);

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
      if (falta.length) { erroEl.hidden = false; erroEl.textContent = `Falta escolher ou preencher: ${falta.join(', ')}.`; return; }
      erroEl.hidden = true;
      const s = S[st.serv], d = deIso(st.data), hh = hhmm(st.hora);
      const quem = st.barb === 'qualquer' ? B[st.quem] : B[st.barb];
      const barb = st.barb === 'qualquer' ? `sem preferência (primeiro livre: ${quem.nome})` : quem.nome;
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
      $('[data-ok-txt]', okEl).textContent = `${s.nome} com ${quem.nome}, ${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} às ${hh}. O horário fica garantido quando confirmarmos pelo WhatsApp.`;
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

  // ---------- contato: valida, abre o WhatsApp com a mensagem e mostra a confirmação ----------
  const formC = $('#form-contato');
  if (formC) {
    const okC = $('#contato-ok'), erroC = $('.ag-erro', formC);
    formC.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = (n) => $(`[name="${n}"]`, formC);
      const retorno = v('retorno').value.trim();
      const regras = [
        ['nome', v('nome').value.trim().length >= 2, 'seu nome'],
        ['retorno', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(retorno) || retorno.replace(/\D/g, '').length >= 10, 'um WhatsApp ou e-mail válido'],
        ['assunto', !!v('assunto').value, 'o assunto'],
        ['mensagem', v('mensagem').value.trim().length >= 5, 'a mensagem'],
      ];
      const falta = [];
      regras.forEach(([n, ok, txt]) => { v(n).closest('.campo').classList.toggle('erro', !ok); if (!ok) falta.push(txt); });
      if (!v('lgpd').checked) falta.push('o aceite da política de privacidade');
      if (falta.length) { erroC.hidden = false; erroC.textContent = `Falta preencher: ${falta.join(', ')}.`; return; }
      erroC.hidden = true;
      const msg = [`Olá, ${D.nome}! Mensagem pelo site.`, `Assunto: ${v('assunto').value}`, `Nome: ${v('nome').value.trim()}`, `Retorno: ${retorno}`, '', v('mensagem').value.trim()].join('\n');
      window.open(wa(msg), '_blank', 'noopener');
      formC.hidden = true;
      okC.hidden = false;
      okC.focus();
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
  if (ck && !guarda.ler('cobre-premium-cookies', null)) setTimeout(() => { ck.hidden = false; igualaDepois(); }, 1600);
  $$('[data-ck]').forEach((b) => b.addEventListener('click', () => {
    guarda.gravar('cobre-premium-cookies', { escolha: b.dataset.ck, data: new Date().toISOString() });
    ck.hidden = true;
    toast(b.dataset.ck === 'todos' ? 'Preferência salva: todos os cookies.' : 'Preferência salva: só os essenciais.');
  }));
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
    if (meta) meta.content = raiz.dataset.tema === 'claro' ? '#F2ECE2' : '#121214';
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tema-ir]');
    if (!b || b.dataset.temaIr === raiz.dataset.tema) return;
    // tema-anim liga a passagem suave das cores só durante a troca
    raiz.classList.add('tema-anim');
    raiz.dataset.tema = b.dataset.temaIr;
    try { localStorage.setItem('cobre-premium-tema', raiz.dataset.tema); } catch (err) { /* sem armazenamento, vale só nesta visita */ }
    marca();
    clearTimeout(fim);
    fim = setTimeout(() => raiz.classList.remove('tema-anim'), 800);
  });
  marca();
})();
