// Tema claro/escuro, comum aos três modelos da THD (Blocos, Órbita e Fibra).
// O site abre sempre no tema original da marca. O escuro só entra quando o visitante escolhe, e a
// escolha fica salva em localStorage 'thd-tema'. ?tema=escuro ou ?tema=claro no link também vale.
// O script vai no <head> para aplicar o tema antes da primeira pintura (sem piscar).
//
// Onde fica o botão: no desktop, discreto dentro da nav (themeNav). No mobile, dentro do menu
// (themeMenu), na mesma área do WhatsApp e do e-mail. Cada modelo esconde o da nav no mesmo ponto
// em que o botão de menu aparece (themeCss recebe essa media query).

const head = `<script>(function(){try{var q=/[?&]tema=(escuro|claro)/.exec(location.search),t=q?(q[1]==='escuro'?'dark':'light'):localStorage.getItem('thd-tema');if(q)localStorage.setItem('thd-tema',t);if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();</script>`;

// Ícone: lua no tema claro (vai para o escuro) e sol no escuro (volta para o claro). Os dois giram ao trocar.
const icon = `<svg class="th-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><g class="th-moon"><path d="M19.5 14.6A7.6 7.6 0 0 1 9.4 4.5a7.6 7.6 0 1 0 10.1 10.1z"/></g><g class="th-sun"><circle cx="12" cy="12" r="3.9"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"/></g></svg>`;

const themeNav = (cls = '') => `<button class="th-btn${cls ? ' ' + cls : ''}" type="button" data-theme-toggle aria-pressed="false" aria-label="Ativar tema escuro" title="Tema escuro">${icon}</button>`;
const themeMenu = (cls = '') => `<button class="th-row${cls ? ' ' + cls : ''}" type="button" data-theme-toggle aria-pressed="false" aria-label="Ativar tema escuro">${icon}<span data-theme-label>Tema escuro</span></button>`;

// mq: a media query em que a nav some e o botão de menu aparece.
function themeCss(mq) {
  return `
/* ---------- tema claro/escuro (gerado por _build/theme.js) ---------- */
html[data-theme="dark"]{color-scheme:dark}
html.th-anim,html.th-anim *,html.th-anim *::before,html.th-anim *::after{transition:background-color .4s ease,color .4s ease,border-color .4s ease,box-shadow .4s ease,fill .4s ease,stroke .4s ease!important}
.th-ico{width:20px;height:20px;overflow:visible}
.th-ico g{transform-box:view-box;transform-origin:12px 12px;transition:transform .6s cubic-bezier(.2,.85,.2,1),opacity .35s}
.th-sun{opacity:0;transform:rotate(-90deg) scale(.5)}
html[data-theme="dark"] .th-moon{opacity:0;transform:rotate(90deg) scale(.5)}
html[data-theme="dark"] .th-sun{opacity:1;transform:none}
.th-btn{flex:none;display:grid;place-items:center;width:38px;height:38px;padding:0;border-radius:50%;border:1px solid rgba(255,255,255,.16);background:transparent;color:#C9D4EA;cursor:pointer;opacity:.85;transition:opacity .25s,color .25s,border-color .25s,background .25s,transform .25s}
.th-btn:hover,.th-btn:focus-visible{opacity:1;color:#fff;border-color:var(--orange);background:rgba(255,255,255,.05)}
.th-btn:active{transform:scale(.92)}
.th-row{display:inline-flex;align-items:center;gap:10px;width:fit-content;margin-top:6px;padding:11px 18px 11px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.04);color:#fff;font:600 .95rem/1 var(--f-body);cursor:pointer;transition:border-color .25s,background .25s}
.th-row:hover,.th-row:focus-visible{border-color:var(--orange);background:rgba(255,255,255,.08)}
.th-row .th-ico{color:var(--orange)}
@media ${mq}{.th-btn{display:none}}
/* mapa do rodapé (mapa-css.js, comum aos três): ruas em tom escuro e cartão escuro */
html[data-theme="dark"] .mapc{background:#0B1A36}
html[data-theme="dark"] .mapc .map-img{filter:invert(.9) hue-rotate(180deg) saturate(.55) brightness(.92) contrast(.95)}
html[data-theme="dark"] .mapc .map-info{background:var(--surface);color:var(--text)}
html[data-theme="dark"] .mapc .map-info b{color:var(--ink)}
html[data-theme="dark"] .mapc .map-info span{color:var(--muted)}
html[data-theme="dark"] .mapc .map-pin b{color:var(--orange);text-shadow:0 0 4px #07152F,0 0 4px #07152F,0 0 2px #07152F}
html[data-theme="dark"] .mapc .mbtns a.sq{background:rgba(254,87,16,.16);color:var(--orange)}
html[data-theme="dark"] .mapc .map-attr{background:rgba(7,21,47,.75);color:var(--muted)}
@media (prefers-reduced-motion:reduce){.th-ico g{transition:none}}
`;
}

// Liga os botões: troca data-theme no <html>, salva a escolha, ajusta rótulos e avisa os scripts
// (evento 'thd:tema') para quem desenha em canvas trocar a paleta.
const themeJs = `// THD · tema claro/escuro
(function () {
  var root = document.documentElement;
  function sync() {
    var dark = root.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', dark ? 'true' : 'false');
      b.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
      if (b.classList.contains('th-btn')) b.title = dark ? 'Tema claro' : 'Tema escuro';
      var l = b.querySelector('[data-theme-label]'); if (l) l.textContent = dark ? 'Tema claro' : 'Tema escuro';
    });
  }
  sync();
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-theme-toggle]');
    if (!b) return;
    var dark = root.getAttribute('data-theme') !== 'dark';
    root.classList.add('th-anim');
    if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    try { localStorage.setItem('thd-tema', dark ? 'dark' : 'light'); } catch (err) {}
    sync();
    document.dispatchEvent(new CustomEvent('thd:tema', { detail: { dark: dark } }));
    setTimeout(function () { root.classList.remove('th-anim'); }, 450);
  });
})();
`;

module.exports = { head, themeNav, themeMenu, themeCss, themeJs };
