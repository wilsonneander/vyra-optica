/* Prévia nos aparelhos: mostra o site real do modelo dentro de um celular, um tablet ou um computador.
   O site roda num iframe com a largura e a altura do aparelho, então os breakpoints e o vh são os de verdade.
   Trocar de aparelho só muda o tamanho do iframe: o site não recarrega e não perde a rolagem.
   A lista de modelos vem de modelos.js, gerado por templates/_comum/previa/instalar.js. */
(function () {
  'use strict';

  var APARELHOS = {
    celular: { w: 390, h: 844, casco: 12 },
    tablet: { w: 768, h: 1024, casco: 22 },
    computador: { w: 1440, h: 900, casco: 0 }
  };
  var TOPO = 40; /* barra de endereço da janela do computador */
  var ORDEM = ['celular', 'tablet', 'computador'];

  var cfg = window.PREVIA || { titulo: 'Modelos', modelos: [] };
  var modelos = cfg.modelos || [];
  var $ = function (id) { return document.getElementById(id); };
  var body = document.body;
  var palco = $('palco'), encaixe = $('encaixe'), aparelho = $('aparelho');
  var frame = $('site'), seletor = $('modelo');
  var botoes = Array.prototype.slice.call(document.querySelectorAll('.aparelhos button'));
  var indicador = document.querySelector('.indicador');

  var url = new URL(location.href);
  var estado = {
    modelo: url.searchParams.get('m') || (modelos[0] && modelos[0].pasta) || '',
    aparelho: APARELHOS[url.searchParams.get('d')] ? url.searchParams.get('d') : 'computador',
    deitado: url.searchParams.get('o') === 'deitado'
  };

  /* Modelo fora da lista (vitrine nova sem reinstalar): abre a pasta mesmo assim */
  if (estado.modelo && !modelos.some(function (m) { return m.pasta === estado.modelo; })) {
    modelos.push({ pasta: estado.modelo, nome: estado.modelo });
  }
  modelos.forEach(function (m) {
    var op = document.createElement('option');
    op.value = m.pasta;
    op.textContent = m.nome;
    seletor.appendChild(op);
  });
  seletor.value = estado.modelo;
  if (modelos.length < 2) seletor.disabled = true;
  if (cfg.titulo) document.querySelector('.voltar').title = 'Voltar para ' + cfg.titulo;

  function nomeDoModelo() {
    var m = modelos.filter(function (x) { return x.pasta === estado.modelo; })[0];
    return m ? m.nome : estado.modelo;
  }

  function gravarEndereco() {
    var u = new URL(location.href);
    u.searchParams.set('m', estado.modelo);
    u.searchParams.set('d', estado.aparelho);
    if (estado.deitado && estado.aparelho !== 'computador') u.searchParams.set('o', 'deitado');
    else u.searchParams.delete('o');
    history.replaceState(null, '', u);
    document.title = nomeDoModelo() + ' no ' + estado.aparelho + ' | Prévia';
  }

  /* Medidas: o aparelho tem o tamanho real em CSS px e é reduzido com scale para caber no palco */
  function medir() {
    var st = getComputedStyle(palco);
    var livreW = palco.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight);
    var livreH = palco.clientHeight - parseFloat(st.paddingTop) - parseFloat(st.paddingBottom);
    var a = APARELHOS[estado.aparelho];
    var w, h, ext, exh, s;

    if (estado.aparelho === 'computador') {
      /* largura mínima de 1440 para mostrar o layout de computador; em monitor maior, usa o espaço todo */
      w = Math.max(a.w, Math.floor(livreW));
      s = Math.min(1, livreW / w);
      h = Math.max(560, Math.floor(livreH / s - TOPO));
      ext = w; exh = h + TOPO;
    } else {
      w = estado.deitado ? a.h : a.w;
      h = estado.deitado ? a.w : a.h;
      ext = w + a.casco * 2; exh = h + a.casco * 2;
      s = Math.min(1, livreW / ext, livreH / exh);
    }
    return { w: w, h: h, ext: ext, exh: exh, s: s };
  }

  function aplicarTamanho() {
    var m = medir();
    aparelho.style.width = m.ext + 'px';
    aparelho.style.height = m.exh + 'px';
    aparelho.style.transform = 'scale(' + m.s + ')';
    encaixe.style.width = m.ext * m.s + 'px';
    encaixe.style.height = m.exh * m.s + 'px';
    $('medida').textContent = m.w + ' × ' + m.h;
    $('zoom').textContent = 'zoom ' + Math.round(m.s * 100) + '%';
  }

  function moverIndicador() {
    var ativo = botoes.filter(function (b) { return b.dataset.aparelho === estado.aparelho; })[0];
    if (!ativo) return;
    indicador.style.width = ativo.offsetWidth + 'px';
    indicador.style.transform = 'translateX(' + ativo.offsetLeft + 'px)';
  }

  /* Some com a barra de rolagem dentro do celular e do tablet, como no aparelho de verdade.
     Só muda a exibição dentro da prévia: o arquivo do modelo não é tocado. */
  function ajustarBarraDeRolagem() {
    try {
      var doc = frame.contentDocument;
      if (!doc || !doc.head) return;
      var css = doc.getElementById('previa-sem-barra');
      var esconder = estado.aparelho !== 'computador';
      if (esconder && !css) {
        css = doc.createElement('style');
        css.id = 'previa-sem-barra';
        css.textContent = 'html{scrollbar-width:none}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none}';
        doc.head.appendChild(css);
      } else if (!esconder && css) {
        css.remove();
      }
    } catch (e) { /* site de outra origem: segue com a barra */ }
  }

  var timerTroca;
  function escolherAparelho(nome, girar) {
    if (!APARELHOS[nome]) return;
    var mudou = nome !== estado.aparelho || girar;
    estado.aparelho = nome;
    if (girar) estado.deitado = !estado.deitado;
    body.dataset.aparelho = nome;
    body.classList.toggle('deitado', estado.deitado && nome !== 'computador');
    $('girar').disabled = nome === 'computador';
    botoes.forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.aparelho === nome)); });
    moverIndicador();
    aplicarTamanho();
    ajustarBarraDeRolagem();
    gravarEndereco();
    if (mudou) {
      body.classList.add('trocando');
      var medida = document.querySelector('.medida');
      medida.classList.remove('pisca'); void medida.offsetWidth; medida.classList.add('pisca');
      clearTimeout(timerTroca);
      timerTroca = setTimeout(function () { body.classList.remove('trocando'); }, 700);
    }
  }

  function carregarModelo(pasta) {
    estado.modelo = pasta;
    seletor.value = pasta;
    body.classList.add('carregando-site');
    frame.src = '../' + pasta + '/';
    $('novaaba').href = '../' + pasta + '/';
    gravarEndereco();
  }

  frame.addEventListener('load', function () {
    body.classList.remove('carregando-site');
    ajustarBarraDeRolagem();
    try {
      var loc = frame.contentWindow.location;
      $('endereco').textContent = loc.host + loc.pathname + loc.search + loc.hash;
      $('novaaba').href = loc.href;
      /* atalhos de teclado funcionam mesmo com o foco dentro do site */
      frame.contentWindow.addEventListener('keydown', atalhos);
      frame.contentWindow.addEventListener('hashchange', function () {
        $('endereco').textContent = loc.host + loc.pathname + loc.search + loc.hash;
        $('novaaba').href = loc.href;
      });
    } catch (e) {
      $('endereco').textContent = frame.src;
    }
  });

  botoes.forEach(function (b) {
    b.addEventListener('click', function () { escolherAparelho(b.dataset.aparelho); });
  });
  seletor.addEventListener('change', function () { carregarModelo(seletor.value); });
  $('girar').addEventListener('click', function () { escolherAparelho(estado.aparelho, true); });
  $('recarregar').addEventListener('click', recarregar);
  $('telacheia').addEventListener('click', telaCheia);

  function recarregar() {
    var r = $('recarregar');
    r.classList.remove('gira'); void r.offsetWidth; r.classList.add('gira');
    body.classList.add('carregando-site');
    try { frame.contentWindow.location.reload(); } catch (e) { frame.src = frame.src; }
  }

  function telaCheia() {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  document.addEventListener('fullscreenchange', function () {
    body.classList.toggle('cheia', !!document.fullscreenElement);
  });

  function atalhos(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var alvo = e.target;
    if (alvo && (alvo.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName))) return;
    var k = e.key.toLowerCase();
    if (k === '1' || k === '2' || k === '3') { escolherAparelho(ORDEM[+k - 1]); e.preventDefault(); }
    else if (k === 'g' && estado.aparelho !== 'computador') { escolherAparelho(estado.aparelho, true); e.preventDefault(); }
    else if (k === 'r') { recarregar(); e.preventDefault(); }
    else if (k === 'f') { telaCheia(); e.preventDefault(); }
  }
  document.addEventListener('keydown', atalhos);

  /* Redimensionar a janela recalcula sem animar */
  var timerResize;
  new ResizeObserver(function () {
    body.classList.add('sem-anim');
    aplicarTamanho();
    moverIndicador();
    clearTimeout(timerResize);
    timerResize = setTimeout(function () { body.classList.remove('sem-anim'); }, 120);
  }).observe(palco);

  /* Primeira pintura sem animação, depois tudo anima */
  body.classList.add('sem-anim');
  indicador.style.transition = 'none';
  escolherAparelho(estado.aparelho);
  carregarModelo(estado.modelo);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      body.classList.remove('sem-anim');
      indicador.style.transition = '';
    });
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moverIndicador);
})();
