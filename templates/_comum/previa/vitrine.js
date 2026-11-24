/* Prévia nos aparelhos: botão "Ver nos aparelhos" ao lado de cada "Abrir" da vitrine.
   Colocado pelo instalador (templates/_comum/previa/instalar.js), que gera também previa/modelos.js.
   O botão é uma cópia do próprio botão "Abrir" da vitrine, em versão contornada, então herda a fonte,
   a altura e o formato de cada vitrine sem CSS próprio por nicho. */
(function () {
  'use strict';
  var cfg = window.PREVIA;
  if (!cfg || !cfg.modelos) return;

  var ICONES = '<svg viewBox="0 0 40 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:34px;height:20px;flex:none">' +
    '<rect x="1.5" y="6" width="7" height="13" rx="1.6"/>' +
    '<rect x="11.5" y="3.5" width="10.5" height="15.5" rx="1.8"/>' +
    '<rect x="24.5" y="4" width="14" height="10" rx="1.4"/><path d="M28.5 19.5h6M31.5 14v5.5"/></svg>';

  var css = document.createElement('style');
  css.textContent =
    '.previa-par{display:inline-grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:10px;max-width:100%}' +
    '.previa-par>*{min-width:0}' +
    '.previa-par>*,.previa-ver{white-space:nowrap}' +
    '.previa-ver{background:transparent!important;color:var(--previa-cor)!important;box-shadow:inset 0 0 0 2px var(--previa-cor)!important;text-shadow:none!important;clip-path:none!important}' +
    '.previa-ver:hover{background:var(--previa-cor)!important;color:var(--previa-txt)!important}' +
    '.previa-empilha{grid-auto-flow:row!important;width:100%}.previa-empilha>*{width:100%}' +
    '.previa-coluna{grid-auto-flow:row!important}.previa-coluna>*{width:100%}' +
    '@media (max-width:820px){.previa-par{grid-auto-flow:row;width:100%}.previa-par>*{width:100%}}';
  document.head.appendChild(css);

  function pastaDoLink(a) {
    var h = a.getAttribute('href') || '';
    var m = h.match(/^(?:\.\/)?([^/?#]+)\/(?:index\.html)?$/);
    return m ? m[1] : null;
  }

  function corVisivel(c) {
    return c && c !== 'transparent' && !/rgba\([^)]*,\s*0\)$/.test(c);
  }

  /* grupos com o botão novo: se não cabem lado a lado sem cortar texto, empilham (todos com a mesma largura) */
  var grupos = [];
  function encaixar() {
    grupos.forEach(function (g) {
      g.classList.remove('previa-empilha');
      var aperta = g.scrollWidth > g.clientWidth + 1 || g.getBoundingClientRect().right > (g.parentElement.getBoundingClientRect().right + 1) ||
        Array.prototype.some.call(g.children, function (b) { return b.scrollWidth > b.clientWidth + 1; });
      g.classList.toggle('previa-empilha', aperta);
    });
  }

  var links = Array.prototype.slice.call(document.querySelectorAll('a[href]'));
  cfg.modelos.forEach(function (modelo) {
    /* o "Abrir" principal: link com texto (não a imagem) que leva à pasta do modelo */
    var cta = links.filter(function (a) {
      return pastaDoLink(a) === modelo.pasta && !a.querySelector('img') && a.textContent.trim();
    })[0];
    if (!cta || cta.dataset.previa) return;
    cta.dataset.previa = '1';

    var ver = cta.cloneNode(false);
    ver.removeAttribute('target');
    ver.removeAttribute('rel');
    ver.removeAttribute('aria-label');
    ver.removeAttribute('id');
    ver.href = 'previa/?m=' + encodeURIComponent(modelo.pasta) + '&d=celular';
    ver.classList.add('previa-ver');
    ver.title = 'Ver o ' + modelo.nome + ' no celular, no tablet e no computador';
    ver.innerHTML = ICONES + '<span>Ver nos aparelhos</span>';

    var st = getComputedStyle(cta);
    var cor = corVisivel(st.backgroundColor) ? st.backgroundColor : st.color;
    ver.style.setProperty('--previa-cor', cor);
    ver.style.setProperty('--previa-txt', corVisivel(st.backgroundColor) ? st.color : '#fff');

    var pai = cta.parentElement;
    var paiGrade = /grid|flex/.test(getComputedStyle(pai).display) && pai.querySelectorAll(':scope > a').length > 1;
    if (paiGrade) {
      /* a vitrine já tem um grupo de botões: o botão novo vai numa linha embaixo, com a largura do grupo */
      var coluna = document.createElement('span');
      coluna.className = 'previa-par previa-coluna';
      pai.parentElement.insertBefore(coluna, pai);
      coluna.appendChild(pai);
      coluna.appendChild(ver);
    } else {
      var par = document.createElement('span');
      par.className = 'previa-par';
      pai.insertBefore(par, cta);
      par.appendChild(cta);
      par.appendChild(ver);
      grupos.push(par);
    }
  });

  encaixar();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(encaixar);
  window.addEventListener('load', encaixar);
  var t;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(encaixar, 100); });
})();
