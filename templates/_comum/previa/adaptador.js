/* Adaptador de aparelhos dentro do site.
   Colocado pelo instalador (templates/_comum/previa/instalar.js) só nas cópias dos sites que ficam nas vitrines
   do catálogo. Os modelos originais em templates/<nicho>/ não recebem este arquivo.

   Mostra um controle discreto no canto do site: Celular, Tablet e Computador.
   Celular e Tablet abrem o próprio site por cima, dentro do aparelho, num iframe com a medida real
   (os breakpoints e o vh são os do aparelho). Trocar entre eles não recarrega. Computador fecha e volta ao site.
   Tudo fica num shadow DOM: o CSS do site não muda o controle e o controle não muda o site. */
(function () {
  'use strict';
  if (window.top !== window) return;          /* já está dentro de um aparelho ou da tela de prévia */
  if (window.__previaAdaptador) return;
  window.__previaAdaptador = true;

  var APARELHOS = {
    celular: { w: 390, h: 844, casco: 12, nome: 'Celular' },
    tablet: { w: 768, h: 1024, casco: 22, nome: 'Tablet' }
  };

  var ICONE = {
    celular: '<svg viewBox="0 0 24 24"><rect x="7" y="2.8" width="10" height="18.4" rx="2.4"/><path d="M10.6 18.2h2.8"/></svg>',
    tablet: '<svg viewBox="0 0 24 24"><rect x="4.2" y="3" width="15.6" height="18" rx="2.2"/><path d="M11 18.2h2"/></svg>',
    computador: '<svg viewBox="0 0 24 24"><rect x="2.6" y="4" width="18.8" height="12.4" rx="1.6"/><path d="M9 20h6M12 16.4V20"/></svg>',
    girar: '<svg viewBox="0 0 24 24"><rect x="8" y="7.5" width="8.5" height="13" rx="1.6"/><path d="M4 9.5a8 8 0 0 1 8-6.6M12 2.9l-2.3-1.4M12 2.9l-1.5 2.3"/></svg>',
    fechar: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };

  var CSS = [
    ':host{all:initial}',
    '*{box-sizing:border-box}',
    'svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none}',
    '.ui{font:600 13.5px/1.2 "Schibsted Grotesk","Segoe UI",Arial,sans-serif;color:#EEEBE6;-webkit-font-smoothing:antialiased}',
    /* seletor: três botões do mesmo tamanho e um marcador que desliza */
    '.sel{position:relative;display:inline-grid;grid-auto-flow:column;grid-auto-columns:1fr;padding:4px;border-radius:12px;background:rgba(16,16,18,.9);border:1px solid rgba(255,255,255,.1);box-shadow:0 14px 34px -14px rgba(0,0,0,.6);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}',
    '.sel button{position:relative;z-index:1;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:36px;padding:0 12px;border:0;border-radius:9px;background:none;color:#9C978F;font:inherit;cursor:pointer;transition:color .3s}',
    '.sel button:hover{color:#fff}',
    '.sel button[aria-checked="true"]{color:#1A1408}',
    '.sel button:focus-visible,.acao:focus-visible{outline:2px solid #D9B26A;outline-offset:2px}',
    '.sel .nome{display:none}',
    '.ind{position:absolute;top:4px;bottom:4px;left:0;width:0;border-radius:9px;background:#D9B26A;transition:transform .55s cubic-bezier(.22,.8,.24,1),width .55s cubic-bezier(.22,.8,.24,1)}',
    /* controle no canto do site */
    '.dock{position:fixed;left:16px;bottom:16px;z-index:2147483646;transition:opacity .3s,transform .3s,left .45s cubic-bezier(.22,.8,.24,1),bottom .45s cubic-bezier(.22,.8,.24,1)}',
    '.dock .sel{opacity:.82;transition:opacity .25s}',
    '.dock:hover .sel,.dock:focus-within .sel{opacity:1}',
    '.dock:hover .nome,.dock:focus-within .nome{display:inline}',
    '.aberto .dock{opacity:0;pointer-events:none;transform:translateY(10px)}',
    /* camada com o aparelho */
    '.cena{position:fixed;inset:0;z-index:2147483647;display:grid;grid-template-rows:auto 1fr;background:radial-gradient(120% 90% at 50% 40%,#1B1B20,#0C0C0E);opacity:0;visibility:hidden;transition:opacity .4s,visibility 0s .4s}',
    '.aberto .cena{opacity:1;visibility:visible;transition:opacity .4s}',
    '.topo{display:flex;align-items:center;justify-content:center;gap:10px;padding:12px 16px;border-bottom:1px solid #2A2A31;background:#17171B}',
    '.topo .sel{background:#101012;box-shadow:none}',
    '.topo .nome{display:inline}',
    '.medida{position:absolute;left:18px;color:#8F8B85;font-weight:500;font-variant-numeric:tabular-nums}',
    '.medida b{color:#EEEBE6;font-weight:600;margin-right:8px}',
    '.acao{display:inline-grid;place-items:center;width:40px;height:40px;border:1px solid #2A2A31;border-radius:10px;background:#202026;color:#8F8B85;cursor:pointer;transition:color .2s,border-color .2s}',
    '.acao:hover{color:#fff;border-color:#D9B26A}',
    '.fechar{position:absolute;right:16px}',
    '.girar svg{transition:transform .6s cubic-bezier(.22,.8,.24,1)}',
    '.deitado .girar svg{transform:rotate(-90deg)}',
    '.palco{position:relative;display:grid;place-items:center;min-height:0;padding:24px;overflow:hidden}',
    '.encaixe{position:relative;transition:width .62s cubic-bezier(.22,.8,.24,1),height .62s cubic-bezier(.22,.8,.24,1)}',
    '.aparelho{position:absolute;left:0;top:0;display:flex;transform-origin:0 0;background:#060607;box-shadow:inset 0 0 0 1px #3A3A42,0 0 0 1px #000,0 50px 90px -30px rgba(0,0,0,.85);transition:width .62s cubic-bezier(.22,.8,.24,1),height .62s cubic-bezier(.22,.8,.24,1),transform .62s cubic-bezier(.22,.8,.24,1),padding .62s cubic-bezier(.22,.8,.24,1),border-radius .62s cubic-bezier(.22,.8,.24,1)}',
    '.tela{position:relative;flex:1;overflow:hidden;background:#fff;transition:border-radius .62s}',
    '.tela iframe{display:block;width:100%;height:100%;border:0;background:#fff}',
    '.cel .aparelho{padding:12px;border-radius:56px}.cel .tela{border-radius:44px}',
    '.tab .aparelho{padding:22px;border-radius:38px}.tab .tela{border-radius:16px}',
    '.carr{position:absolute;inset:0;display:grid;place-items:center;background:#F3F1EC;opacity:0;pointer-events:none;transition:opacity .35s}',
    '.carr span{width:34px;height:34px;border:3px solid #D8D3CA;border-top-color:#8A6A2E;border-radius:50%;animation:gira .8s linear infinite}',
    '.carregando .carr{opacity:1}',
    '@keyframes gira{to{transform:rotate(360deg)}}',
    '.sem-anim .encaixe,.sem-anim .aparelho,.sem-anim .tela{transition:none}',
    '@media (max-width:760px){.medida{display:none}.topo{justify-content:flex-start}}',
    '@media (max-width:620px){.dock{display:none}}',
    '@media (prefers-reduced-motion:reduce){.encaixe,.aparelho,.tela,.ind,.cena{transition:none!important}}'
  ].join('');

  function seletor(classe) {
    return '<div class="sel ' + classe + '" role="radiogroup" aria-label="Ver o site no aparelho"><span class="ind"></span>' +
      ['celular', 'tablet', 'computador'].map(function (k) {
        var nome = k === 'computador' ? 'Computador' : APARELHOS[k].nome;
        return '<button type="button" role="radio" data-a="' + k + '" title="Ver no ' + nome.toLowerCase() + '" aria-label="' + nome + '">' +
          ICONE[k] + '<span class="nome">' + nome + '</span></button>';
      }).join('') + '</div>';
  }

  function iniciar() {
    if (!document.body) return;
    var fonte = document.createElement('link');
    fonte.rel = 'stylesheet';
    fonte.href = 'https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;600&display=swap';
    document.head.appendChild(fonte);

    var host = document.createElement('previa-aparelhos');
    host.setAttribute('aria-label', 'Prévia em aparelhos');
    document.documentElement.appendChild(host);
    var raiz = host.attachShadow({ mode: 'open' });
    raiz.innerHTML = '<style>' + CSS + '</style>' +
      '<div class="ui" id="ui">' +
        '<div class="dock">' + seletor('no-site') + '</div>' +
        '<div class="cena" role="dialog" aria-modal="true" aria-label="Site no aparelho">' +
          '<div class="topo">' +
            '<p class="medida"><b id="medida"></b><span id="zoom"></span></p>' +
            seletor('na-cena') +
            '<button type="button" class="acao girar" title="Girar o aparelho" aria-label="Girar o aparelho">' + ICONE.girar + '</button>' +
            '<button type="button" class="acao fechar" title="Voltar ao site (Esc)" aria-label="Voltar ao site">' + ICONE.fechar + '</button>' +
          '</div>' +
          '<div class="palco"><div class="encaixe"><div class="aparelho"><div class="tela">' +
            '<iframe title="Este site no aparelho" allow="fullscreen; clipboard-write; geolocation; autoplay"></iframe>' +
            '<div class="carr"><span></span></div>' +
          '</div></div></div></div>' +
        '</div>' +
      '</div>';

    var ui = raiz.getElementById('ui');
    var q = function (s) { return raiz.querySelector(s); };
    var palco = q('.palco'), encaixe = q('.encaixe'), aparelho = q('.aparelho'), frame = q('iframe');
    var estado = { aparelho: 'computador', deitado: false };
    var overflowAntes = '';

    function marcar() {
      raiz.querySelectorAll('.sel').forEach(function (sel) {
        var ativo = null;
        sel.querySelectorAll('button').forEach(function (b) {
          var sim = b.dataset.a === estado.aparelho;
          b.setAttribute('aria-checked', String(sim));
          if (sim) ativo = b;
        });
        var ind = sel.querySelector('.ind');
        if (ativo && ativo.offsetWidth) {
          ind.style.width = ativo.offsetWidth + 'px';
          ind.style.transform = 'translateX(' + ativo.offsetLeft + 'px)';
        }
      });
    }

    function medir() {
      var a = APARELHOS[estado.aparelho];
      if (!a) return;
      var st = getComputedStyle(palco);
      var livreW = palco.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight);
      var livreH = palco.clientHeight - parseFloat(st.paddingTop) - parseFloat(st.paddingBottom);
      var w = estado.deitado ? a.h : a.w, h = estado.deitado ? a.w : a.h;
      var ext = w + a.casco * 2, exh = h + a.casco * 2;
      var s = Math.min(1, livreW / ext, livreH / exh);
      aparelho.style.width = ext + 'px';
      aparelho.style.height = exh + 'px';
      aparelho.style.transform = 'scale(' + s + ')';
      encaixe.style.width = ext * s + 'px';
      encaixe.style.height = exh * s + 'px';
      raiz.getElementById('medida').textContent = w + ' × ' + h;
      raiz.getElementById('zoom').textContent = 'zoom ' + Math.round(s * 100) + '%';
    }

    function semBarra() {
      try {
        var d = frame.contentDocument;
        if (d && d.head && !d.getElementById('previa-sem-barra')) {
          var c = d.createElement('style');
          c.id = 'previa-sem-barra';
          c.textContent = 'html{scrollbar-width:none}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none}';
          d.head.appendChild(c);
        }
      } catch (e) { /* outra origem */ }
    }

    function escolher(nome, girar) {
      if (girar) estado.deitado = !estado.deitado;
      if (nome === 'computador') return fechar();
      var abrindo = estado.aparelho === 'computador';
      estado.aparelho = nome;
      ui.classList.toggle('cel', nome === 'celular');
      ui.classList.toggle('tab', nome === 'tablet');
      ui.classList.toggle('deitado', estado.deitado);
      if (abrindo) {
        ui.classList.add('sem-anim');
        overflowAntes = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        ui.classList.add('carregando');
        frame.src = location.href;      /* a mesma página que está aberta, com a mesma âncora */
        ui.classList.add('aberto');
      }
      medir();
      marcar();
      if (abrindo) requestAnimationFrame(function () { requestAnimationFrame(function () { ui.classList.remove('sem-anim'); marcar(); }); });
    }

    function fechar() {
      estado.aparelho = 'computador';
      ui.classList.remove('aberto');
      document.documentElement.style.overflow = overflowAntes;
      marcar();
      setTimeout(function () { if (estado.aparelho === 'computador') frame.removeAttribute('src'); }, 420);
    }

    frame.addEventListener('load', function () { ui.classList.remove('carregando'); semBarra(); });

    raiz.querySelectorAll('.sel button').forEach(function (b) {
      b.addEventListener('click', function () { escolher(b.dataset.a); });
    });
    q('.girar').addEventListener('click', function () { escolher(estado.aparelho, true); });
    q('.fechar').addEventListener('click', fechar);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && estado.aparelho !== 'computador') fechar();
    });
    new ResizeObserver(function () {
      if (estado.aparelho === 'computador') return marcar();
      ui.classList.add('sem-anim'); medir(); marcar();
      clearTimeout(medir.t); medir.t = setTimeout(function () { ui.classList.remove('sem-anim'); }, 120);
    }).observe(document.documentElement);

    /* Desvia de elementos fixos do site no mesmo canto (aviso de cookies, barra lateral estreita).
       Blocos grandes (fundo de tela inteira, painel que ocupa metade da tela) fazem parte do layout e não contam. */
    var dock = q('.dock');
    function grande(r) { return r.width >= innerWidth * 0.45 || (r.height >= innerHeight * 0.6 && r.width >= 240); }
    function fixoEm(x, y) {
      var lista = document.elementsFromPoint(x, y);
      for (var i = 0; i < lista.length; i++) {
        var n = lista[i], achou = null;
        if (n === host) continue;
        while (n && n !== document.body && n !== document.documentElement) {
          var pos = getComputedStyle(n).position;
          if (pos === 'fixed' || pos === 'sticky') { achou = n; break; }
          n = n.parentElement;
        }
        if (!achou) return null;                                   /* conteúdo normal da página por cima */
        if (!grande(achou.getBoundingClientRect())) return achou;  /* aviso, botão ou barra fixa pequena */
        /* camada fixa de tela inteira (fundo, efeito): olha o que está embaixo dela */
      }
      return null;
    }
    function desviar() {
      if (estado.aparelho !== 'computador' || !dock.offsetWidth) return;
      var vw = innerWidth, vh = innerHeight, d = dock.getBoundingClientRect();
      var base = { left: 16, bottom: 16 };
      var largura = d.width, altura = d.height;
      var pontos = [[16 + 4, vh - 16 - 4], [16 + largura / 2, vh - 16 - altura / 2], [16 + largura - 4, vh - 16 - 4], [16 + 4, vh - 16 - altura + 4]];
      pontos.forEach(function (p) {
        var el = fixoEm(p[0], p[1]);
        if (!el) return;
        var r = el.getBoundingClientRect();
        if (r.height >= vh * 0.6) base.left = Math.max(base.left, Math.round(r.right + 12));  /* barra lateral */
        else base.bottom = Math.max(base.bottom, Math.round(vh - r.top + 12));              /* aviso no canto */
      });
      dock.style.left = base.left + 'px';
      dock.style.bottom = base.bottom + 'px';
    }
    setInterval(desviar, 700);
    window.addEventListener('load', desviar);

    marcar();
    desviar();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(marcar);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
