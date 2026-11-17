// Peças comuns do botão de tema dos modelos de lanches (Braseiro, Fornalha, Monta).
const SOL = '<svg class="tl-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M5.4 18.6l1.5-1.5M17.1 6.9l1.5-1.5"/></svg>';
const LUA = '<svg class="tl-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.6A8 8 0 0 1 9.4 4a8 8 0 1 0 10.6 10.6z"/></svg>';
const lado = (extra = '') => `<div class="tema-lado" role="group" aria-label="Tema do site">${extra}<div class="tl-trilho"><button class="tl-op" type="button" data-tema="claro" data-rot="Dia" aria-pressed="true" aria-label="Tema claro" title="Tema claro">${SOL}</button><button class="tl-op" type="button" data-tema="escuro" data-rot="Noite" aria-pressed="false" aria-label="Tema escuro" title="Tema escuro">${LUA}</button><i class="tl-marca" aria-hidden="true"></i></div></div>`;
const topo = () => `<button class="tema-topo" type="button" data-tema-troca aria-pressed="false" aria-label="Ativar tema escuro" title="Tema escuro"><span class="tt-sol">${SOL}</span><span class="tt-lua">${LUA}</span></button>`;
const head = (key) => `<script>(function(){try{var q=/[?&]tema=(escuro|claro)/.exec(location.search),t=q?(q[1]==='escuro'?'dark':'light'):localStorage.getItem('${key}');if(q)localStorage.setItem('${key}',t);if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();</script>`;
const js = (key) => `
/* ---------- tema claro/escuro: controle da lateral (computador) e botão do topo (celular) ----------
   Abre sempre no claro; a escolha fica salva em localStorage '${key}'. ?tema=escuro no link também vale. */
(function () {
  var root = document.documentElement, meta = document.querySelector('meta[name="theme-color"]');
  var corClaro = meta && meta.content, corEscuro = meta && meta.getAttribute('data-escuro');
  var escuro = function () { return root.getAttribute('data-theme') === 'dark'; };
  function sync() {
    var d = escuro();
    document.querySelectorAll('[data-tema]').forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-tema') === 'escuro') === d)); });
    document.querySelectorAll('[data-tema-troca]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(d));
      b.setAttribute('aria-label', d ? 'Ativar tema claro' : 'Ativar tema escuro');
      b.title = d ? 'Tema claro' : 'Tema escuro';
    });
    if (meta && corEscuro) meta.content = d ? corEscuro : corClaro;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-tema], [data-tema-troca]');
    if (!b) return;
    var d = b.hasAttribute('data-tema-troca') ? !escuro() : b.getAttribute('data-tema') === 'escuro';
    if (d === escuro()) return;
    root.classList.add('tema-anim');
    if (d) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    try { localStorage.setItem('${key}', d ? 'dark' : 'light'); } catch (err) {}
    sync();
    document.dispatchEvent(new CustomEvent('tema', { detail: { escuro: d } }));
    setTimeout(function () { root.classList.remove('tema-anim'); }, 750);
  });
  sync();
})();
`;
// transição suave de cores só durante a troca
const anim = `html.tema-anim, html.tema-anim *:not(.tema-lado, .tema-lado *, .tema-topo, .tema-topo *), html.tema-anim *:not(.tema-lado, .tema-lado *, .tema-topo, .tema-topo *)::before, html.tema-anim *:not(.tema-lado, .tema-lado *, .tema-topo, .tema-topo *)::after { transition: background-color .5s ease, color .5s ease, border-color .5s ease, box-shadow .5s ease, fill .5s ease !important; }
html[data-theme="dark"] { color-scheme: dark; }
.tl-trilho { position: relative; display: grid; gap: 6px; }
.tl-op { position: relative; z-index: 1; display: grid; place-items: center; width: 40px; height: 40px; padding: 0; border: 0; background: none; cursor: pointer; }
.tl-op .tl-ico { width: 19px; height: 19px; fill: none; }
.tl-marca { position: absolute; left: 0; top: 0; width: 40px; height: 40px; pointer-events: none; }
html[data-theme="dark"] .tl-marca { transform: translateY(46px); }
.tl-op .tl-ico { transition: transform .5s cubic-bezier(.34, 1.56, .64, 1); }
.tl-op[aria-pressed="true"] .tl-ico { transform: rotate(var(--giro, 0deg)) scale(1.08); }
.tl-op[data-tema="claro"] { --giro: 45deg; }
.tl-op[data-tema="escuro"] { --giro: -20deg; }
@keyframes tlDesce { 0% { transform: translateY(0) scale(1); } 30% { transform: translateY(8px) scale(.88, 1.32); } 68% { transform: translateY(50px) scale(1.1, .86); } 84% { transform: translateY(44px) scale(.97, 1.03); } 100% { transform: translateY(46px) scale(1); } }
@keyframes tlSobe { 0% { transform: translateY(46px) scale(1); } 30% { transform: translateY(38px) scale(.88, 1.32); } 68% { transform: translateY(-4px) scale(1.1, .86); } 84% { transform: translateY(2px) scale(.97, 1.03); } 100% { transform: translateY(0) scale(1); } }
html.tema-anim[data-theme="dark"] .tema-lado .tl-marca { animation: tlDesce .7s cubic-bezier(.45, 0, .2, 1) both; }
html.tema-anim:not([data-theme="dark"]) .tema-lado .tl-marca { animation: tlSobe .7s cubic-bezier(.45, 0, .2, 1) both; }
@media (prefers-reduced-motion: reduce) { html.tema-anim .tema-lado .tl-marca { animation: none !important; } }
.tema-topo { display: none; place-items: center; padding: 0; cursor: pointer; }
.tema-topo .tl-ico { width: 20px; height: 20px; fill: none; }
.tema-topo span { grid-area: 1 / 1; display: grid; transition: opacity .35s ease, transform .6s cubic-bezier(.34, 1.56, .64, 1); }
.tema-topo .tt-lua { opacity: 0; transform: rotate(-90deg) scale(.5); }
html[data-theme="dark"] .tema-topo .tt-sol { opacity: 0; transform: rotate(90deg) scale(.5); }
html[data-theme="dark"] .tema-topo .tt-lua { opacity: 1; transform: none; }
`;
module.exports = { lado, topo, head, js, anim };
