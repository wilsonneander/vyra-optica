// JS do modelo Silver, sem dependências. Escrito como função comum e serializado no build
// (assim não precisa escapar nada). Recebe horários, itens do cardápio e dados de contato do content.js.
const C = require('../_build/content');

function app(H, ITENS, CFG) {
  var d = document, de = d.documentElement, w = window;
  var RM = !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var minutos = function (s) { var a = s.split(':'); return a[0] * 60 + (+a[1]); };
  var hm = function (s) { return s.replace(':00', 'h').replace(':', 'h'); };
  var wa = function (msg) { return 'https://wa.me/' + CFG.wa + '?text=' + encodeURIComponent(msg); };

  /* ---------- abertura ---------- */
  var intro = $('[data-intro]');
  var pronto = function () { de.classList.add('pronto'); };
  if (de.classList.contains('com-intro') && intro) {
    var saiu = false;
    var sair = function () {
      if (saiu) return; saiu = true;
      intro.classList.add('sai');
      setTimeout(pronto, 420);
      setTimeout(function () { intro.parentNode && intro.parentNode.removeChild(intro); de.classList.remove('com-intro'); }, 1200);
      try { sessionStorage.setItem('siri-intro', '1'); } catch (e) {}
    };
    setTimeout(sair, 1300);
    intro.addEventListener('click', sair);
    d.addEventListener('keydown', sair, { once: true });
  } else {
    requestAnimationFrame(pronto);
  }

  /* ---------- topo, menu e siri da rolagem ---------- */
  var hdr = $('[data-hdr]'), btn = $('[data-menu]'), nav = $('#nav'), andarT;
  function setMenu(o) {
    hdr.classList.toggle('open', o); nav.classList.toggle('open', o);
    btn.setAttribute('aria-expanded', o); btn.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu');
  }
  btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  function topo() {
    var y = w.scrollY, max = de.scrollHeight - w.innerHeight;
    hdr.classList.toggle('solid', y > 40);
    hdr.style.setProperty('--prog', max > 0 ? clamp(y / max, 0, 1).toFixed(4) : 0);
    if (!RM) { hdr.classList.add('andando'); clearTimeout(andarT); andarT = setTimeout(function () { hdr.classList.remove('andando'); }, 180); }
  }

  /* ---------- entrada ao rolar ---------- */
  var alvos = $$('.rv, [data-trilho]');
  $$('.prato').forEach(function (li, i) { li.style.setProperty('--k', i); });
  if ('IntersectionObserver' in w) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });
    alvos.forEach(function (el) { io.observe(el); });
  } else alvos.forEach(function (el) { el.classList.add('in'); });

  /* ---------- parallax leve ---------- */
  var par = RM ? [] : $$('[data-par]');
  function parallax() {
    var vh = w.innerHeight;
    par.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var y = -((r.top + r.height / 2) - vh / 2) * parseFloat(el.getAttribute('data-par'));
      el.style.transform = 'translate(0px,' + y.toFixed(1) + 'px)';
    });
  }

  /* ---------- um dia na casa: sol que anda com a rolagem ---------- */
  var D = $('[data-dia]');
  var dFotos = D ? $$('.dia-foto', D) : [], dTxts = D ? $$('.dia-txt', D) : [], dBtns = D ? $$('[data-ir]', D) : [];
  var astro = D && $('[data-astro]', D), barra = D && $('[data-dia-barra]', D), dIdx = -1;
  var bz = function (t, a, b, c, e) { var u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * e; };
  function dia() {
    if (!D) return;
    var r = D.getBoundingClientRect(), total = D.offsetHeight - w.innerHeight;
    if (r.bottom < 0 || r.top > w.innerHeight) return;
    var p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
    var t = clamp(p / 0.86, 0, 1);
    D.style.setProperty('--sx', (bz(t, 40, 200, 800, 960) / 1000).toFixed(4));
    D.style.setProperty('--sy', (bz(t, 380, 30, 30, 380) / 400).toFixed(4));
    D.style.setProperty('--tarde', clamp((p - 0.22) / 0.28, 0, 1).toFixed(3));
    var noite = clamp((p - 0.66) / 0.18, 0, 1);
    D.style.setProperty('--noite', noite.toFixed(3));
    D.setAttribute('data-fase', noite > 0.45 ? 'noite' : 'dia');
    barra.style.setProperty('--p', p.toFixed(4));
    var i = p < 0.34 ? 0 : p < 0.68 ? 1 : 2;
    if (i !== dIdx) {
      dIdx = i;
      dFotos.forEach(function (f, k) { f.classList.toggle('on', k === i); f.classList.toggle('antes', k < i); });
      dTxts.forEach(function (x, k) { x.classList.toggle('on', k === i); });
      dBtns.forEach(function (b, k) { b.classList.toggle('on', k === i); });
    }
  }
  dBtns.forEach(function (b, k) {
    b.addEventListener('click', function () {
      var total = D.offsetHeight - w.innerHeight, top = D.getBoundingClientRect().top + w.scrollY;
      w.scrollTo({ top: top + total * [0.14, 0.5, 0.9][k], behavior: RM ? 'auto' : 'smooth' });
    });
  });

  /* um único laço de rolagem */
  var tick = false;
  function quadro() { tick = false; topo(); parallax(); dia(); }
  w.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(quadro); } }, { passive: true });
  w.addEventListener('resize', function () { if (!tick) { tick = true; requestAnimationFrame(quadro); } });
  quadro();

  /* ---------- capa: pilha de cartões-postais ---------- */
  var P = $('[data-postais]');
  if (P) {
    var ordem = $$('.postal', P), ocupado = false, timer = null, pausa = false;
    var aplicar = function (lista, desde) {
      lista.forEach(function (c, i) { c.setAttribute('data-pos', i + (desde || 0)); c.setAttribute('aria-hidden', i + (desde || 0) ? 'true' : 'false'); });
    };
    var semTransicao = function (el, fn) { el.style.transition = 'none'; fn(); void el.offsetWidth; el.style.transition = ''; };
    var proximo = function () {
      if (ocupado) return; ocupado = true;
      var f = ordem.shift(); ordem.push(f);
      f.classList.add('sai');
      aplicar(ordem.slice(0, -1));
      setTimeout(function () {
        semTransicao(f, function () { f.classList.remove('sai'); f.setAttribute('data-pos', ordem.length - 1); f.setAttribute('aria-hidden', 'true'); });
        ocupado = false;
      }, 700);
    };
    var anterior = function () {
      if (ocupado) return; ocupado = true;
      var l = ordem.pop(); ordem.unshift(l);
      semTransicao(l, function () { l.classList.add('sai'); });
      requestAnimationFrame(function () { l.classList.remove('sai'); aplicar(ordem); });
      setTimeout(function () { ocupado = false; }, 700);
    };
    var tocar = function () { clearInterval(timer); if (!RM && !pausa) timer = setInterval(function () { if (!d.hidden) proximo(); }, 4200); };
    $('[data-next]', P).addEventListener('click', function () { proximo(); tocar(); });
    $('[data-prev]', P).addEventListener('click', function () { anterior(); tocar(); });
    P.addEventListener('click', function (e) { var c = e.target.closest('.postal'); if (c && c === ordem[0]) { proximo(); tocar(); } });
    P.addEventListener('mouseenter', function () { pausa = true; clearInterval(timer); });
    P.addEventListener('mouseleave', function () { pausa = false; tocar(); });
    P.addEventListener('focusin', function () { pausa = true; clearInterval(timer); });
    P.addEventListener('focusout', function () { pausa = false; tocar(); });
    // começa a girar depois da entrada; as fotos de trás carregam logo para não piscar
    setTimeout(function () { $$('img[loading="lazy"]', P).forEach(function (i) { i.loading = 'eager'; }); tocar(); }, 2600);
  }

  /* ---------- carrossel dos mais pedidos ---------- */
  var T = $('[data-trilho]');
  if (T) {
    var prog = $('[data-tr-prog]'), lis = $$('.prato', T), lista = $('ul', T);
    var passo = function () { return lis[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(lista).columnGap) || 20); };
    var barraT = function () {
      var max = T.scrollWidth - T.clientWidth, v = T.clientWidth / T.scrollWidth;
      prog.style.setProperty('--w', (v * 100).toFixed(2) + '%');
      prog.style.setProperty('--x', (max > 0 ? (T.scrollLeft / max) * (1 / v - 1) * 100 : 0).toFixed(2) + '%');
    };
    $('[data-tr-next]').addEventListener('click', function () { T.scrollBy({ left: passo(), behavior: RM ? 'auto' : 'smooth' }); });
    $('[data-tr-prev]').addEventListener('click', function () { T.scrollBy({ left: -passo(), behavior: RM ? 'auto' : 'smooth' }); });
    T.addEventListener('scroll', barraT, { passive: true });
    w.addEventListener('resize', barraT);
    barraT();
    // arrastar com o mouse (no toque o navegador já rola)
    var x0 = 0, s0 = 0, arrastando = false, moveu = false;
    T.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('button')) return;
      arrastando = true; moveu = false; x0 = e.clientX; s0 = T.scrollLeft;
    });
    w.addEventListener('pointermove', function (e) {
      if (!arrastando) return;
      var dx = e.clientX - x0;
      if (Math.abs(dx) > 4) { moveu = true; T.classList.add('arrasta'); }
      if (moveu) T.scrollLeft = s0 - dx;
    });
    w.addEventListener('pointerup', function () {
      if (!arrastando) return; arrastando = false;
      if (moveu) {
        var l = T.scrollLeft; T.classList.remove('arrasta'); T.scrollLeft = l;
        var p = passo(); T.scrollTo({ left: Math.round(l / p) * p, behavior: RM ? 'auto' : 'smooth' });
      }
    });
    T.addEventListener('click', function (e) { if (moveu) { e.preventDefault(); e.stopPropagation(); moveu = false; } }, true);
  }

  /* ---------- abas do cardápio ---------- */
  var abas = $$('.abas [role="tab"]'), marca = $('.abas-marca');
  var marcar = function (t) { if (!t || !marca) return; marca.style.setProperty('--aw', t.offsetWidth + 'px'); marca.style.setProperty('--ax', t.offsetLeft + 'px'); };
  var abaAtual = function () { return abas.filter(function (x) { return x.getAttribute('aria-selected') === 'true'; })[0]; };
  var selAba = function (t, foco) {
    abas.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
      d.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    marcar(t);
    if (foco) t.focus();
  };
  abas.forEach(function (t, i) {
    t.addEventListener('click', function () { selAba(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = abas.length, j = k === 'ArrowRight' ? (i + 1) % n : k === 'ArrowLeft' ? (i - 1 + n) % n : k === 'Home' ? 0 : k === 'End' ? n - 1 : -1;
      if (j > -1) { e.preventDefault(); selAba(abas[j], true); }
    });
  });
  marcar(abaAtual());
  w.addEventListener('resize', function () { marcar(abaAtual()); });
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { marcar(abaAtual()); });

  /* ---------- pedido montado no site ---------- */
  var mapa = {}; ITENS.forEach(function (it) { mapa[it.id] = it; });
  var ped = {};
  try { ped = JSON.parse(sessionStorage.getItem('siri-pedido')) || {}; } catch (e) {}
  var sac = $('[data-sacola]'), sacLista = $('#sacola-lista'), sacVer = $('[data-sac-ver]');
  var toastEl = $('[data-toast]'), toastT;
  var toast = function (t) {
    toastEl.textContent = t; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 1900);
  };
  var verLista = function (o) { sacLista.hidden = !o; sacVer.setAttribute('aria-expanded', o); };
  function render() {
    var ids = Object.keys(ped).filter(function (k) { return ped[k] > 0 && mapa[k]; });
    var n = 0, total = 0;
    ids.forEach(function (k) { n += ped[k]; total += ped[k] * mapa[k].preco; });
    $$('[data-qtd]').forEach(function (el) {
      var q = ped[el.getAttribute('data-qtd')] || 0;
      el.closest('.item').classList.toggle('tem', q > 0);
      $('output', el).textContent = q;
    });
    sac.classList.toggle('on', n > 0);
    de.classList.toggle('tem-pedido', n > 0);
    if (!n) verLista(false);
    $('[data-sac-qtd]').textContent = n + (n === 1 ? ' item no pedido' : ' itens no pedido');
    $('[data-sac-total]').textContent = 'R$ ' + total;
    $('[data-sac-lista]').innerHTML = ids.map(function (k) {
      return '<li><span>' + ped[k] + 'x ' + mapa[k].nome + '</span><span>R$ ' + ped[k] * mapa[k].preco + '</span></li>';
    }).join('');
    var msg = CFG.msg + ' fazer um pedido para retirada:\n\n' + ids.map(function (k) { return ped[k] + 'x ' + mapa[k].nome + ' (R$ ' + ped[k] * mapa[k].preco + ')'; }).join('\n') + '\n\nTotal: R$ ' + total + '\nNome para retirada: ';
    $('[data-sac-enviar]').href = wa(msg);
    try { sessionStorage.setItem('siri-pedido', JSON.stringify(ped)); } catch (e) {}
  }
  function mudar(id, delta, origem) {
    if (!mapa[id]) return;
    ped[id] = Math.max(0, (ped[id] || 0) + delta);
    if (!ped[id]) delete ped[id];
    render();
    var box = $('[data-qtd="' + id + '"]');
    if (origem && origem.classList.contains('q-add') && box) $('.q-step [data-add]', box).focus();
    if (delta < 0 && !ped[id] && box && origem && origem.closest('.q-step')) $('.q-add', box).focus();
    if (delta > 0) {
      toast(mapa[id].nome + ' no pedido');
      sac.classList.remove('pulo'); void sac.offsetWidth; sac.classList.add('pulo');
    }
  }
  d.addEventListener('click', function (e) {
    var a = e.target.closest('[data-add]'); if (a) { mudar(a.getAttribute('data-add'), 1, a); return; }
    var s = e.target.closest('[data-sub]'); if (s) mudar(s.getAttribute('data-sub'), -1, s);
  });
  sacVer.addEventListener('click', function () { verLista(sacLista.hidden); });
  $('[data-sac-limpar]').addEventListener('click', function () { ped = {}; render(); toast('Pedido limpo'); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); verLista(false); } });
  render();

  /* ---------- reserva guiada ---------- */
  var F = $('[data-reserva]');
  if (F) {
    var radios = $$('input[name="formato"]'), diaIn = $('#r-dia'), horaSel = $('#r-hora'), pes = $('#r-pes'), nome = $('#r-nome'), obs = $('#r-obs'), aviso = $('[data-dia-aviso]');
    var DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    var formato = function () { return radios.filter(function (r) { return r.checked; })[0]; };
    var selFormato = function () {
      var f = formato();
      radios.forEach(function (r) { r.closest('.formato').classList.toggle('sel', r.checked); });
      $$('[data-cond]').forEach(function (u) { u.hidden = u.getAttribute('data-cond') !== f.value; });
    };
    radios.forEach(function (r) { r.addEventListener('change', function () { selFormato(); pes.value = r.getAttribute('data-pessoas'); }); });
    selFormato();
    try { diaIn.min = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date()); } catch (e) {}
    var horasDo = function (dw) {
      var h = H.filter(function (x) { return x.d.indexOf(dw) > -1; })[0];
      if (!h || !h.a) return null;
      var out = [], f = minutos(h.f) - 60;
      for (var t = minutos(h.a); t <= f; t += 30) out.push(('0' + Math.floor(t / 60)).slice(-2) + ':' + ('0' + t % 60).slice(-2));
      return out;
    };
    var diaSemana = function (v) { return new Date(v + 'T12:00:00').getDay(); };
    var fechado = false;
    var preencher = function () {
      var v = diaIn.value, lista = null, msg = '';
      fechado = false;
      if (v) { lista = horasDo(diaSemana(v)); if (!lista) { fechado = true; msg = 'Nesse dia a casa está fechada. Abrimos de quarta a domingo.'; } }
      if (!lista) lista = horasDo(3) || [];
      var atual = horaSel.value;
      horaSel.innerHTML = '<option value="">Escolha</option>' + lista.map(function (h) { return '<option value="' + h + '">' + hm(h) + '</option>'; }).join('');
      if (lista.indexOf(atual) > -1) horaSel.value = atual;
      aviso.hidden = !msg; aviso.textContent = msg;
    };
    diaIn.addEventListener('change', function () { preencher(); diaIn.closest('.campo').classList.remove('erro'); });
    preencher();
    $$('[data-pes]', F).forEach(function (b) {
      b.addEventListener('click', function () { pes.value = clamp((parseInt(pes.value, 10) || 0) + parseInt(b.getAttribute('data-pes'), 10), 1, 200); });
    });
    [nome, horaSel].forEach(function (el) { el.addEventListener('input', function () { el.closest('.campo').classList.remove('erro'); }); });
    F.addEventListener('submit', function (e) {
      e.preventDefault();
      var ruins = [];
      if (!nome.value.trim()) ruins.push(nome);
      if (!diaIn.value || fechado || (diaIn.min && diaIn.value < diaIn.min)) ruins.push(diaIn);
      if (!horaSel.value) ruins.push(horaSel);
      $$('.campo', F).forEach(function (c) { c.classList.remove('erro'); });
      if (ruins.length) {
        ruins.forEach(function (el) { el.closest('.campo').classList.add('erro'); });
        if (!fechado && ruins.indexOf(diaIn) > -1 && diaIn.value) { aviso.hidden = false; aviso.textContent = 'Escolha uma data a partir de hoje.'; }
        ruins[0].focus();
        return;
      }
      var v = diaIn.value.split('-');
      var msg = CFG.msg + ' fazer uma reserva.\n\nTipo: ' + formato().value + '\nNome: ' + nome.value.trim() + '\nDia: ' + DIAS[diaSemana(diaIn.value)] + ', ' + v[2] + '/' + v[1] + '\nHorário: ' + hm(horaSel.value) + '\nPessoas: ' + pes.value + (obs.value.trim() ? '\nObservação: ' + obs.value.trim() : '');
      var u = wa(msg), j = w.open(u, '_blank', 'noopener');
      if (!j) w.location.href = u;
    });
  }

  /* ---------- perguntas com abertura suave ---------- */
  $$('[data-faq] details').forEach(function (dt) {
    var s = $('summary', dt), r = $('.faq-r', dt), anim = null;
    s.addEventListener('click', function (e) {
      if (RM || !r.animate) return;
      e.preventDefault();
      if (anim) anim.cancel();
      if (dt.open) {
        anim = r.animate([{ height: r.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing: 'ease' });
        anim.onfinish = function () { dt.open = false; anim = null; };
      } else {
        dt.open = true;
        anim = r.animate([{ height: '0px', opacity: 0 }, { height: r.offsetHeight + 'px', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.2,.75,.2,1)' });
        anim.onfinish = function () { anim = null; };
      }
    });
  });

  /* ---------- aberto agora (horário de Brasília) ---------- */
  var NOMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  try {
    var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var g = function (t) { return (p.filter(function (x) { return x.type === t; })[0] || {}).value; };
    var hojeD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), agora = (+g('hour') % 24) * 60 + (+g('minute'));
    var hoje = H.filter(function (h) { return h.d.indexOf(hojeD) > -1; })[0], txt;
    $$('tr[data-dias]').forEach(function (tr) {
      if (tr.getAttribute('data-dias').split(',').indexOf(String(hojeD)) > -1) {
        tr.classList.add('hoje');
        var sp = d.createElement('span'); sp.className = 'hoje-tag'; sp.textContent = ' (hoje)'; $('th', tr).appendChild(sp);
      }
    });
    if (hoje && hoje.a && agora >= minutos(hoje.a) && agora < minutos(hoje.f)) txt = 'Aberto agora, até as ' + hm(hoje.f) + '. Vem pra areia.';
    else {
      for (var i = 0; i < 8; i++) {
        var dd = (hojeD + i) % 7, h = H.filter(function (x) { return x.d.indexOf(dd) > -1; })[0];
        if (h && h.a && (i > 0 || agora < minutos(h.a))) { txt = 'Fechado agora. Abrimos ' + (i === 0 ? 'hoje' : i === 1 ? 'amanhã' : NOMES[dd]) + ' às ' + hm(h.a) + '.'; break; }
      }
    }
    var el = $('[data-agora]'); if (el && txt) el.textContent = txt;
  } catch (e) {}
}

const H = C.horarios.map((h) => ({ d: h.d, a: h.abre, f: h.fecha }));
const ITENS = [];
C.cardapio.forEach((c) => c.itens.forEach((it, i) => ITENS.push({ id: `${c.id}-${i}`, nome: it.nome, preco: it.preco })));
const CFG = { wa: C.contato.whatsapp, msg: C.contato.mensagemPadrao };

const js = `(${app.toString()})(${JSON.stringify(H)},${JSON.stringify(ITENS)},${JSON.stringify(CFG)});`;
module.exports = { js };
