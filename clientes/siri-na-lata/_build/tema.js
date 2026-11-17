// Tema claro/escuro, comum aos três modelos do Siri na Lata (Bronze, Silver e Gold).
// O site abre sempre no claro (identidade da casa); o escuro só entra quando o visitante escolhe,
// e a escolha fica salva em localStorage 'siri-tema'. ?tema=escuro ou ?tema=claro no link também vale.
// O script do <head> aplica o tema antes da primeira pintura (sem piscar claro).
// Cada modelo define as próprias cores do escuro em html[data-theme="dark"] { ... } no seu CSS.

const HEAD = `<script>(function(){try{var q=/[?&]tema=(escuro|claro)/.exec(location.search),t=q?(q[1]==='escuro'?'dark':'light'):localStorage.getItem('siri-tema');if(q)localStorage.setItem('siri-tema',t);if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();</script>`;

// Ícone: sol de praia no claro (com a linha do mar), lua no escuro. Troca girando.
function botao(cls = 'tema-btn') {
  return `<button class="${cls}" type="button" data-theme-toggle aria-pressed="false" aria-label="Ativar tema escuro" title="Tema escuro"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g class="t-sol"><circle cx="12" cy="11" r="4"/><path d="M12 3v1.6M12 17.4V19M4 11h1.6M18.4 11H20M6.3 5.3l1.1 1.1M16.6 15.6l1.1 1.1M6.3 16.7l1.1-1.1M16.6 6.4l1.1-1.1"/><path d="M3 21.5c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1"/></g><g class="t-lua"><path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1z"/><path d="M16.5 3.5v2.4M15.3 4.7h2.4" stroke-width="1.4"/></g></svg></button>`;
}

// Estilo do botão: herda a cor do topo (currentColor); o modelo ajusta tamanho e borda se quiser.
const CSS = `
html{color-scheme:light}
html[data-theme="dark"]{color-scheme:dark}
html.tema-anim,html.tema-anim *,html.tema-anim *::before,html.tema-anim *::after{transition:background-color .35s ease,color .35s ease,border-color .35s ease,box-shadow .35s ease,fill .35s ease,stroke .35s ease !important}
.tema-btn{flex:none;width:42px;height:42px;padding:0;border-radius:50%;display:grid;place-items:center;cursor:pointer;background:transparent;color:inherit;border:1px solid color-mix(in srgb,currentColor 30%,transparent);opacity:.88;transition:opacity .2s,border-color .2s,transform .2s}
.tema-btn:hover{opacity:1;border-color:currentColor}
.tema-btn:active{transform:scale(.92)}
.tema-btn svg{width:21px;height:21px;display:block;overflow:visible}
.tema-btn g{transform-origin:12px 12px;transition:transform .55s cubic-bezier(.2,.8,.2,1),opacity .3s}
.tema-btn .t-lua{opacity:0;transform:rotate(-90deg) scale(.6)}
html[data-theme="dark"] .tema-btn .t-sol{opacity:0;transform:rotate(90deg) scale(.6)}
html[data-theme="dark"] .tema-btn .t-lua{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.tema-btn g{transition:none}}
`;

// Liga o botão: troca data-theme no <html>, salva a escolha e ajusta theme-color e o rótulo acessível.
// Avisa o resto do site com o evento 'siri:tema' (detail.dark).
const JS = `(function(){
  var root=document.documentElement,meta=document.querySelector('meta[name="theme-color"]');
  var light=meta&&meta.content,dark=meta&&meta.getAttribute('data-dark');
  function sync(){
    var d=root.getAttribute('data-theme')==='dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function(b){
      b.setAttribute('aria-pressed',d?'true':'false');
      b.setAttribute('aria-label',d?'Ativar tema claro':'Ativar tema escuro');
      b.title=d?'Tema claro':'Tema escuro';
    });
    if(meta&&dark)meta.content=d?dark:light;
  }
  sync();
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-theme-toggle]');
    if(!b)return;
    var d=root.getAttribute('data-theme')!=='dark';
    root.classList.add('tema-anim');
    if(d)root.setAttribute('data-theme','dark');else root.removeAttribute('data-theme');
    try{localStorage.setItem('siri-tema',d?'dark':'light');}catch(err){}
    sync();
    document.dispatchEvent(new CustomEvent('siri:tema',{detail:{dark:d}}));
    setTimeout(function(){root.classList.remove('tema-anim');},420);
  });
})();`;

module.exports = { HEAD, CSS, JS, botao };
