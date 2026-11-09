// MODELO PREMIUM — o mais chamativo: hero cinematográfico com miniaturas, imagens interativas
// (pontos clicáveis e comparador antes/depois), galeria presa que anda de lado com a rolagem,
// carrossel 3D de avaliações, cursor próprio, barra de rolagem da marca, transição entre páginas,
// botões magnéticos e WhatsApp com ondas. Ordem de toda página: imagem → planos (quando fizer sentido) → restante.
const { DUO_CSS, logo, icon, duo, socialIcon, socialLinks, esc, shell } = require('./helpers');
const { brandTile, streamLogos } = require('./basico');

const FONTS = 'family=Outfit:wght@300;400;500;600;700;800&family=Manrope:wght@400;500;600;700';
const IMG = 'assets/img/';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=Marialva%2C+PR';

const COMPARE = [
  ['Download', { start: '500 Mega', familia: '800 Mega', ultra: '1 Giga' }],
  ['Upload', { start: '250 Mega', familia: '400 Mega', ultra: '500 Mega' }],
  ['Wi-Fi', { start: 'Wi-Fi 6', familia: 'Wi-Fi 6 + 1 ponto mesh', ultra: 'Wi-Fi 6 mesh (2 pontos)' }],
  ['Streaming incluso', { start: ['YouTube Premium'], familia: ['YouTube Premium', 'Max ou Prime Video'], ultra: ['YouTube Premium', 'Netflix', 'Max', 'Prime Video'] }],
  ['Instalação', { start: 'Grátis, agendada', familia: 'Grátis, em até 48h', ultra: 'Grátis, em até 24h' }],
  ['Atendimento', { start: 'Suporte local 24h', familia: 'Prioritário', ultra: 'Prioritário + técnico em 24h' }],
  ['Controle dos pais no app', { start: false, familia: true, ultra: true }],
  ['IP fixo', { start: false, familia: false, ultra: 'Opcional' }],
];

// título com palavras animáveis; *palavra* recebe destaque em gradiente
function split(text) {
  return text.split(' ').map((w, i) => {
    const em = /\*/.test(w);
    return `<span class="w"><span style="--i:${i}"${em ? ' class="em"' : ''}>${w.replace(/\*/g, '')}</span></span>`;
  }).join(' ');
}
const shortName = p => p.name.replace('Vyra ', '');
const attr = s => s.replace(/'/g, '&#39;');

const css = `/* Vyra · modelo Premium */
:root {
  --orange: #FF5A1F; --orange-600: #E8480C; --orange-700: #C2410C; --red: #E11D2E;
  --ink: #1E1512; --night: #140E0C; --night-2: #201713; --white: #FFFFFF; --mist: #FFF6F1; --peach: #FFD9C7; --line: #F2E2D9; --muted: #6E5A52;
  --grad: linear-gradient(135deg, #FF7A3D 0%, #FF5A1F 35%, #E8480C 65%, #E11D2E 100%);
  --f-display: "Outfit", system-ui, sans-serif; --f-body: "Manrope", system-ui, sans-serif;
  --max: 1240px; --ease: cubic-bezier(.16,1,.3,1); --d0: .1s;
}
html.loading { --d0: 1.3s; }
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scrollbar-color: #FF5A1F #F6EFEB; scrollbar-width: thin; }
::-webkit-scrollbar { width: 11px; height: 11px; }
::-webkit-scrollbar-track { background: #F6EFEB; }
::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #FF7A3D, #E11D2E); border-radius: 11px; border: 2px solid #F6EFEB; }
::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #FF5A1F, #B3121F); }
::selection { background: var(--orange); color: var(--white); }
body { margin: 0; background: var(--white); color: var(--ink); font: 400 16px/1.65 var(--f-body); overflow-x: hidden; }
img { max-width: 100%; display: block; }
a { color: var(--orange-700); }
h1, h2, h3 { font-family: var(--f-display); margin: 0; line-height: 1.05; text-wrap: balance; }
h1 { font-size: clamp(42px, 6.6vw, 92px); font-weight: 300; letter-spacing: -0.045em; }
h2 { font-size: clamp(32px, 4.4vw, 60px); font-weight: 300; letter-spacing: -0.04em; }
h1 b, h2 b { font-weight: 700; }
h3 { font-size: 21px; font-weight: 600; letter-spacing: -0.015em; }
.em, h1 em, h2 em { font-style: normal; font-weight: 700; background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
p { margin: 0; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.container { max-width: var(--max); margin: 0 auto; padding-left: max(22px, env(safe-area-inset-left)); padding-right: max(22px, env(safe-area-inset-right)); }
.section { padding: clamp(90px, 11vw, 140px) 0; position: relative; }
.section.soft { background: var(--mist); }
.section.dark { background: var(--night); color: var(--white); overflow: hidden; }
.section.dark::before { content: ""; position: absolute; width: 760px; height: 760px; left: -280px; top: -320px; border-radius: 50%; background: radial-gradient(circle, rgba(255,90,31,.22), transparent 65%); pointer-events: none; }
.head { display: grid; gap: 16px; margin-bottom: 54px; max-width: 760px; position: relative; }
.head.center { margin-left: auto; margin-right: auto; text-align: center; justify-items: center; }
.head p { color: var(--muted); font-size: 18px; max-width: 58ch; }
.dark .head p { color: rgba(255,255,255,.7); }
.kicker { display: inline-flex; align-items: center; gap: 10px; font: 600 12.5px/1 var(--f-display); letter-spacing: .2em; text-transform: uppercase; color: var(--orange-700); }
.kicker::before { content: ""; width: 26px; height: 2px; border-radius: 2px; background: var(--grad); }
.dark .kicker { color: var(--peach); }
.ico { width: 20px; height: 20px; flex: none; }
:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }
${DUO_CSS}

/* Palavras que sobem */
.w { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: .1em; margin-bottom: -.1em; }
.w > span { display: inline-block; transform: translateY(110%); }
@keyframes wordUp { from { transform: translateY(110%); } to { transform: none; } }
.hslide.on .w > span, .phero .w > span { animation: wordUp 1s var(--ease) both; animation-delay: calc(var(--d0) + var(--i) * 55ms); }

/* Logos de streaming */
.st { display: inline-flex; align-items: center; justify-content: center; gap: 4px; height: 32px; padding: 0 10px; border-radius: 9px; flex: none; box-shadow: 0 0 0 1px rgba(30,21,18,.08); }
.st svg { height: 20px; width: auto; display: block; }
.st-netflix { background: #000; min-width: 32px; }
.st-yt { background: #fff; color: #1E1512; }
.st-yt svg { height: 15px; }
.st-yt b { font: 800 12.5px/1 var(--f-display); }
.st-prime { background: #00A8E1; padding: 0 12px; }
.st-prime svg { height: 14px; }
.st-max { background: #002BE7; color: #fff; font: 800 17px/1 var(--f-display); letter-spacing: -0.04em; padding: 0 12px; }
.st-or { font: 700 11px var(--f-display); font-style: normal; opacity: .75; padding: 0 2px; align-self: center; }
.logos { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.logos.lg .st { height: 48px; border-radius: 13px; padding: 0 16px; }
.logos.lg .st svg { height: 28px; }
.logos.lg .st-yt svg { height: 22px; }
.logos.lg .st-yt b { font-size: 16px; }
.logos.lg .st-prime svg { height: 20px; }
.logos.lg .st-max { font-size: 25px; }

/* Botões */
.btn { position: relative; isolation: isolate; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 17px 30px; border-radius: 999px; font: 600 15.5px/1 var(--f-display); text-decoration: none; border: 0; cursor: pointer; transition: transform .5s var(--ease), box-shadow .4s var(--ease), color .3s; will-change: transform; }
.btn::before { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; transform: translateY(102%); transition: transform .55s var(--ease); }
.btn:hover::before { transform: none; }
.btn .ico { width: 18px; height: 18px; transition: transform .5s var(--ease); }
.btn:hover .ico { transform: translateX(4px) rotate(-45deg); }
.btn-primary { background: var(--grad); color: var(--white); box-shadow: 0 18px 36px -16px rgba(232,72,12,.75); }
.btn-primary::before { background: var(--night); }
.btn-light { background: var(--white); color: var(--orange-700); box-shadow: 0 18px 36px -18px rgba(0,0,0,.45); }
.btn-light::before { background: var(--grad); }
.btn-light:hover { color: var(--white); }
.btn-ghost { background: transparent; color: var(--white); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.55); }
.btn-ghost::before { background: var(--white); }
.btn-ghost:hover { color: var(--ink); }
.btn-line { background: transparent; color: var(--orange-700); box-shadow: inset 0 0 0 1.5px var(--orange-600); }
.btn-line::before { background: var(--grad); }
.btn-line:hover { color: var(--white); }
.btn-red { background: var(--red); color: var(--white); }
.btn-red::before { background: var(--night); }
.btn.sm { padding: 13px 22px; font-size: 14.5px; }

/* Carregamento, transição e progresso */
.loader { position: fixed; inset: 0; z-index: 300; background: var(--white); display: none; flex-direction: column; align-items: center; justify-content: center; gap: 24px; }
html.loading .loader { display: flex; animation: loaderOut .9s var(--ease) 1s forwards; }
.loader .logo { width: 150px; color: var(--orange); animation: pop .7s var(--ease) both; }
.loader .bar { width: 170px; height: 3px; border-radius: 3px; background: var(--line); overflow: hidden; }
.loader .bar i { display: block; height: 100%; background: var(--grad); transform-origin: left; animation: barFill .9s var(--ease) both; }
@keyframes pop { from { opacity: 0; transform: scale(.9); } }
@keyframes barFill { from { transform: scaleX(0); } }
@keyframes loaderOut { to { transform: translateY(-100%); visibility: hidden; } }
.curtain { position: fixed; inset: 0; z-index: 290; background: var(--grad); transform: scaleY(0); transform-origin: bottom; pointer-events: none; transition: transform .55s var(--ease); }
.curtain.cover { transform: scaleY(1); }
html.from-nav .curtain { transform: scaleY(1); transform-origin: top; animation: curtainOut .75s var(--ease) .05s forwards; }
@keyframes curtainOut { to { transform: scaleY(0); } }
.progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 120; background: var(--grad); transform-origin: left; transform: scaleX(0); }

/* Cursor próprio */
.cursor-dot, .cursor-ring { position: fixed; left: 0; top: 0; z-index: 400; pointer-events: none; opacity: 0; transition: opacity .3s; }
.has-cursor .cursor-dot, .has-cursor .cursor-ring { opacity: 1; }
.cursor-dot { width: 7px; height: 7px; margin: -3.5px 0 0 -3.5px; border-radius: 50%; background: var(--orange); }
.cursor-ring { width: 42px; height: 42px; margin: -21px 0 0 -21px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px rgba(255,90,31,.6); display: grid; place-items: center; transition: width .45s var(--ease), height .45s var(--ease), margin .45s var(--ease), background-color .35s, box-shadow .35s, opacity .3s; mix-blend-mode: normal; }
.cursor-ring span { font: 700 11px/1 var(--f-display); letter-spacing: .1em; text-transform: uppercase; color: var(--white); opacity: 0; transition: opacity .2s; white-space: nowrap; }
.cursor-ring.hover { width: 66px; height: 66px; margin: -33px 0 0 -33px; background: rgba(255,90,31,.12); box-shadow: inset 0 0 0 1.5px rgba(255,90,31,.35); }
.cursor-ring.text { width: 92px; height: 92px; margin: -46px 0 0 -46px; background: var(--grad); box-shadow: 0 12px 30px -10px rgba(232,72,12,.7); }
.cursor-ring.text span { opacity: 1; }
.has-cursor, .has-cursor a, .has-cursor button, .has-cursor label, .has-cursor [data-cursor] { cursor: none; }
.has-cursor input, .has-cursor textarea, .has-cursor select { cursor: text; }

/* Topo */
.hdr { position: fixed; inset: 0 0 auto; z-index: 100; padding-top: env(safe-area-inset-top); color: var(--white); transition: background-color .4s, color .4s, box-shadow .4s, transform .5s var(--ease); }
.hdr.solid { background: rgba(255,255,255,.86); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); color: var(--ink); box-shadow: 0 1px 0 var(--line), 0 18px 40px -30px rgba(30,21,18,.4); }
.hdr.hide { transform: translateY(-110%); }
.hdr .container { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 84px; }
.brand { display: flex; color: var(--white); transition: color .4s; }
.hdr.solid .brand { color: var(--orange); }
.brand .logo { width: 108px; height: auto; display: block; }
.nav { display: flex; align-items: center; gap: 4px; padding: 6px; border-radius: 999px; background: rgba(255,255,255,.1); box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); backdrop-filter: blur(8px); transition: background-color .4s, box-shadow .4s; }
.hdr.solid .nav { background: var(--mist); box-shadow: inset 0 0 0 1px var(--line); }
.nav a { padding: 10px 15px; border-radius: 999px; text-decoration: none; font: 500 14.5px/1 var(--f-display); color: inherit; opacity: .85; transition: opacity .3s, background-color .3s, color .3s; }
.nav a:hover { opacity: 1; }
.nav a[aria-current="page"] { opacity: 1; background: var(--white); color: var(--orange-700); }
.hdr.solid .nav a[aria-current="page"] { background: var(--grad); color: var(--white); }
.hdr .right { display: flex; gap: 10px; align-items: center; }
.hdr .wa-link { display: inline-flex; align-items: center; gap: 8px; color: inherit; text-decoration: none; font: 600 14.5px var(--f-display); padding: 10px 12px; border-radius: 999px; }
.hdr .wa-link .ico { color: #25D366; }
.burger { display: none; width: 50px; height: 50px; border-radius: 50%; border: 0; background: rgba(255,255,255,.14); color: inherit; place-items: center; cursor: pointer; }
.hdr.solid .burger { background: var(--mist); }
@media (max-width: 1100px) { .nav, .hdr .wa-link, .hdr .right .btn { display: none; } .burger { display: grid; } }
.mmenu { position: fixed; inset: 0; z-index: 150; background: var(--white); padding: calc(110px + env(safe-area-inset-top)) max(24px, env(safe-area-inset-left)) 36px; display: flex; flex-direction: column; justify-content: space-between; gap: 24px; clip-path: circle(0 at calc(100% - 50px) 42px); visibility: hidden; transition: clip-path .7s cubic-bezier(.7,0,.3,1), visibility 0s linear .7s; }
.mmenu.open { clip-path: circle(150% at calc(100% - 50px) 42px); visibility: visible; transition: clip-path .8s var(--ease), visibility 0s; }
.mmenu nav { display: grid; }
.mmenu nav a { font: 300 clamp(36px, 10vw, 56px)/1.15 var(--f-display); letter-spacing: -0.04em; color: var(--ink); text-decoration: none; opacity: 0; transform: translateY(26px); transition: opacity .3s, transform .4s var(--ease); }
.mmenu.open nav a { opacity: 1; transform: none; transition: opacity .6s var(--ease), transform .6s var(--ease); }
.mmenu.open nav a:nth-child(2) { transition-delay: .05s; } .mmenu.open nav a:nth-child(3) { transition-delay: .1s; } .mmenu.open nav a:nth-child(4) { transition-delay: .15s; } .mmenu.open nav a:nth-child(5) { transition-delay: .2s; } .mmenu.open nav a:nth-child(6) { transition-delay: .25s; } .mmenu.open nav a:nth-child(7) { transition-delay: .3s; }
.mmenu nav a[aria-current="page"] { font-weight: 700; color: var(--orange-700); }
.mmenu .close { position: absolute; right: max(22px, env(safe-area-inset-right)); top: calc(17px + env(safe-area-inset-top)); width: 50px; height: 50px; border-radius: 50%; border: 0; background: var(--mist); color: var(--ink); display: grid; place-items: center; }

/* Hero cinematográfico */
.hero { position: relative; height: min(100svh, 920px); min-height: 640px; background: var(--night); overflow: hidden; color: var(--white); }
.hslide { position: absolute; inset: 0; opacity: 0; visibility: hidden; transition: opacity 1.1s ease, visibility 0s linear 1.1s; }
.hslide.on { opacity: 1; visibility: visible; transition: opacity 1.1s ease; }
.hslide .himg { position: absolute; inset: -30px; transition: transform .6s var(--ease); }
.hslide .himg img { width: 100%; height: 100%; object-fit: cover; object-position: 70% center; transform: scale(1.12); transition: transform 9s ease-out; }
.hslide.on .himg img { transform: scale(1.02); }
.hslide::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(20,14,12,.92) 0%, rgba(20,14,12,.7) 34%, rgba(20,14,12,.15) 70%, rgba(20,14,12,.05) 100%), linear-gradient(0deg, rgba(20,14,12,.85), transparent 35%), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(255,90,31,.35), transparent 70%); }
.hslide .container { position: absolute; inset: 0; z-index: 2; display: flex; align-items: center; padding-top: 60px; padding-bottom: 150px; }
.hcopy { max-width: 640px; display: grid; gap: 22px; justify-items: start; }
.hcopy .tag { display: inline-flex; align-items: center; gap: 8px; padding: 8px 15px; border-radius: 999px; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); backdrop-filter: blur(8px); font: 600 12.5px/1 var(--f-display); letter-spacing: .14em; text-transform: uppercase; }
.hcopy .tag i { width: 8px; height: 8px; border-radius: 50%; background: var(--orange); box-shadow: 0 0 12px var(--orange); }
.hcopy h1, .hcopy h2 { font-size: clamp(42px, 6.2vw, 86px); font-weight: 300; letter-spacing: -0.045em; line-height: 1; }
.hcopy p, .hcopy .logos, .hcopy .actions, .hcopy .tag { opacity: 0; transform: translateY(20px); }
.hslide.on .hcopy p, .hslide.on .hcopy .logos, .hslide.on .hcopy .actions, .hslide.on .hcopy .tag { opacity: 1; transform: none; transition: opacity .8s var(--ease), transform .8s var(--ease); }
.hslide.on .hcopy .tag { transition-delay: var(--d0); } .hslide.on .hcopy p { transition-delay: calc(var(--d0) + .45s); } .hslide.on .hcopy .logos { transition-delay: calc(var(--d0) + .55s); } .hslide.on .hcopy .actions { transition-delay: calc(var(--d0) + .65s); }
.hcopy p { font-size: 19px; color: rgba(255,255,255,.85); max-width: 46ch; }
.hcopy .actions { display: flex; flex-wrap: wrap; gap: 12px; }
.hprice { position: absolute; z-index: 3; right: max(22px, calc((100vw - var(--max)) / 2 + 22px)); top: 22%; display: grid; gap: 6px; padding: 20px 22px; border-radius: 24px; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.22), 0 30px 60px -30px rgba(0,0,0,.6); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); opacity: 0; transform: translateY(24px); }
.hslide.on .hprice { opacity: 1; transform: none; transition: opacity .9s var(--ease) calc(var(--d0) + .7s), transform .9s var(--ease) calc(var(--d0) + .7s); }
.hprice .logo { width: 74px; height: auto; color: var(--white); }
.hprice small { font: 500 12.5px var(--f-body); color: rgba(255,255,255,.75); }
.hprice b { font: 700 46px/1 var(--f-display); letter-spacing: -0.04em; }
.hthumbs { position: absolute; z-index: 4; right: max(22px, calc((100vw - var(--max)) / 2 + 22px)); bottom: 34px; display: flex; gap: 12px; }
.hthumb { position: relative; width: 190px; border: 0; padding: 0; border-radius: 18px; overflow: hidden; background: rgba(255,255,255,.1); cursor: pointer; text-align: left; color: var(--white); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); transition: transform .5s var(--ease), box-shadow .3s; }
.hthumb:hover { transform: translateY(-4px); }
.hthumb img { width: 100%; height: 76px; object-fit: cover; opacity: .55; transition: opacity .3s; }
.hthumb[aria-current="true"] img { opacity: 1; }
.hthumb span { display: block; padding: 9px 12px 12px; font: 600 13px/1.2 var(--f-display); }
.hthumb i { position: absolute; left: 0; bottom: 0; height: 3px; width: 0; background: var(--grad); }
.hthumb[aria-current="true"] i { animation: fill var(--dur, 7s) linear forwards; }
.hero.paused .hthumb[aria-current="true"] i { animation-play-state: paused; }
@keyframes fill { to { width: 100%; } }
.scroll-ind { position: absolute; z-index: 4; left: max(22px, calc((100vw - var(--max)) / 2 + 22px)); bottom: 38px; display: inline-flex; align-items: center; gap: 12px; color: rgba(255,255,255,.75); text-decoration: none; font: 500 12.5px var(--f-display); letter-spacing: .14em; text-transform: uppercase; }
.scroll-ind i { width: 24px; height: 38px; border-radius: 14px; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.55); position: relative; }
.scroll-ind i::after { content: ""; position: absolute; left: 50%; top: 8px; width: 4px; height: 8px; margin-left: -2px; border-radius: 2px; background: var(--white); animation: wheel 1.8s ease-in-out infinite; }
@keyframes wheel { 60% { transform: translateY(10px); opacity: 0; } }
@media (max-width: 900px) {
  .hero { height: auto; min-height: 760px; }
  .hslide .container { align-items: flex-end; padding-bottom: 130px; }
  .hslide::after { background: linear-gradient(0deg, rgba(20,14,12,.95) 15%, rgba(20,14,12,.55) 55%, rgba(20,14,12,.2)); }
  .hprice, .scroll-ind { display: none; }
  .hthumbs { left: 22px; right: 22px; bottom: 26px; }
  .hthumb { flex: 1; width: auto; } .hthumb img { height: 54px; } .hthumb span { font-size: 11.5px; padding: 7px 9px 9px; }
  .hcopy p { font-size: 16.5px; }
}

/* Faixa de logos */
.logoband { background: var(--night); color: var(--white); overflow: hidden; padding: 22px 0; border-top: 1px solid rgba(255,255,255,.06); }
.logoband .track { display: flex; align-items: center; gap: 40px; width: max-content; animation: scrollx 45s linear infinite; }
.logoband:hover .track { animation-play-state: paused; }
.logoband .item { display: inline-flex; align-items: center; gap: 12px; font: 300 24px/1 var(--f-display); letter-spacing: -0.02em; white-space: nowrap; }
.logoband .item b { font-weight: 700; }
.logoband .star { width: 10px; height: 10px; border-radius: 50%; background: var(--grad); box-shadow: 0 0 14px rgba(255,90,31,.8); flex: none; }
@keyframes scrollx { to { transform: translateX(-50%); } }

/* Planos */
.ptabs { display: inline-flex; padding: 6px; border-radius: 999px; background: var(--white); box-shadow: 0 0 0 1px var(--line), 0 16px 30px -24px rgba(30,21,18,.4); margin-bottom: 56px; position: relative; }
.ptabs button { position: relative; z-index: 1; border: 0; background: none; padding: 13px 28px; border-radius: 999px; font: 600 15px/1 var(--f-display); color: var(--muted); cursor: pointer; transition: color .3s; }
.ptabs button[aria-selected="true"] { color: var(--white); }
.ptabs .pill { position: absolute; top: 6px; bottom: 6px; left: 6px; border-radius: 999px; background: var(--grad); transition: transform .55s var(--ease), width .55s var(--ease); box-shadow: 0 10px 20px -10px rgba(232,72,12,.7); }
.tab-panel[hidden] { display: none; }
.tab-panel { animation: fadeUp .7s var(--ease); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } }
.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: center; }
@media (max-width: 1000px) { .plans { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; gap: 34px; } }
.plan { position: relative; isolation: isolate; background: var(--white); border-radius: 30px; padding: 34px 30px; display: grid; gap: 18px; box-shadow: 0 0 0 1px var(--line), 0 30px 50px -40px rgba(30,21,18,.5); transition: transform .6s var(--ease), box-shadow .5s var(--ease); }
.plan::before { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; opacity: 0; transition: opacity .4s; background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(255,90,31,.14), transparent 60%); }
.plan:hover::before { opacity: 1; }
.plan:hover { box-shadow: 0 0 0 1.5px rgba(255,90,31,.6), 0 40px 60px -36px rgba(232,72,12,.55); }
.plan.featured { color: var(--white); padding-block: 46px; background: linear-gradient(var(--night), var(--night)) padding-box, conic-gradient(from var(--ang, 0deg), #FF7A3D, #E11D2E, #FFD9C7, #FF5A1F, #FF7A3D) border-box; border: 2px solid transparent; box-shadow: 0 50px 80px -40px rgba(225,29,46,.7); animation: spin 6s linear infinite; }
.plan.featured::before { background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(255,90,31,.3), transparent 60%); }
@property --ang { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@keyframes spin { to { --ang: 360deg; } }
.plan .badge { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: var(--grad); color: var(--white); font: 700 12px/1 var(--f-display); letter-spacing: .12em; text-transform: uppercase; padding: 9px 15px; border-radius: 999px; white-space: nowrap; box-shadow: 0 10px 20px -8px rgba(232,72,12,.7); }
.plan .tag { font: 600 12px/1 var(--f-display); letter-spacing: .16em; text-transform: uppercase; color: var(--orange-700); }
.plan .ph { display: flex; align-items: baseline; gap: 8px; }
.plan .ph .logo { width: 60px; height: auto; color: var(--orange); transform: translateY(3px); }
.plan.featured .ph .logo { color: var(--white); }
.plan .ph b { font: 700 23px/1 var(--f-display); text-transform: lowercase; letter-spacing: -0.02em; }
.plan .speed { font: 300 84px/.85 var(--f-display); letter-spacing: -0.06em; }
.plan .speed small { font-size: 22px; letter-spacing: 0; margin-left: 6px; font-weight: 600; color: var(--orange); }
.streams { display: grid; gap: 10px; padding: 14px; border-radius: 18px; background: var(--mist); }
.plan.featured .streams { background: rgba(255,255,255,.07); box-shadow: inset 0 0 0 1px rgba(255,255,255,.1); }
.streams > span { font: 600 11.5px/1 var(--f-display); letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.plan.featured .streams > span { color: rgba(255,255,255,.7); }
.choose { display: flex; gap: 6px; flex-wrap: wrap; }
.choose button { border: 0; border-radius: 999px; padding: 7px 12px; font: 600 12.5px var(--f-display); cursor: pointer; background: rgba(255,255,255,.12); color: var(--white); transition: background-color .25s, color .25s; }
.choose button[aria-pressed="true"] { background: var(--grad); }
.plan ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; font-size: 15px; }
.plan li { display: flex; gap: 10px; align-items: center; }
.plan li .ico { width: 18px; height: 18px; color: var(--orange-600); }
.plan.featured li { color: rgba(255,255,255,.85); }
.plan.featured li .ico { color: var(--orange); }
.plan .price { display: flex; align-items: baseline; gap: 4px; border-top: 1px solid var(--line); padding-top: 18px; }
.plan.featured .price { border-color: rgba(255,255,255,.12); }
.plan .price small { font: 500 14px var(--f-body); color: var(--muted); }
.plan.featured .price small { color: rgba(255,255,255,.65); }
.plan .price b { font: 700 44px/1 var(--f-display); letter-spacing: -0.04em; }
.plan.featured .price b { background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
.plan .price .ask { font: 700 28px/1 var(--f-display); }
.plan .btn { width: 100%; }
.note { font-size: 13px; color: var(--muted); margin-top: 24px; text-align: center; }
.dark .note { color: rgba(255,255,255,.55); }

/* Planos em faixas (Residencial) */
.prows { display: grid; gap: 18px; }
.prow { position: relative; isolation: isolate; overflow: hidden; display: grid; grid-template-columns: 230px minmax(0, 1fr) 240px; gap: 32px; align-items: center; background: var(--white); border-radius: 30px; padding: 30px 34px; box-shadow: 0 0 0 1px var(--line), 0 24px 44px -38px rgba(30,21,18,.5); transition: transform .5s var(--ease), box-shadow .5s; }
.prow::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(90deg, transparent, rgba(255,90,31,.08), transparent); transform: translateX(-100%); transition: transform .9s var(--ease); }
.prow:hover::after { transform: translateX(100%); }
.prow:hover { transform: translateY(-4px); box-shadow: 0 0 0 1.5px rgba(255,90,31,.55), 0 34px 54px -38px rgba(232,72,12,.6); }
.prow.featured { background: var(--night); color: var(--white); box-shadow: 0 0 0 2px var(--orange), 0 40px 70px -40px rgba(225,29,46,.7); }
.prow .badge { display: inline-block; margin-bottom: 12px; background: var(--grad); color: var(--white); font: 700 11px/1 var(--f-display); letter-spacing: .1em; text-transform: uppercase; padding: 7px 12px; border-radius: 999px; }
.prow .ph { display: flex; align-items: baseline; gap: 8px; }
.prow .ph .logo { width: 56px; height: auto; color: var(--orange); transform: translateY(3px); }
.prow.featured .ph .logo { color: var(--white); }
.prow .ph b { font: 700 21px/1 var(--f-display); text-transform: lowercase; }
.prow .speed { font: 300 74px/.85 var(--f-display); letter-spacing: -0.06em; margin-top: 10px; }
.prow .speed small { font-size: 20px; font-weight: 600; color: var(--orange); letter-spacing: 0; margin-left: 4px; }
.prow .mid { display: grid; gap: 14px; }
.prow ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; font-size: 14.5px; }
.prow li { display: flex; gap: 8px; align-items: center; }
.prow li .ico { width: 17px; height: 17px; color: var(--orange-600); }
.prow.featured li { color: rgba(255,255,255,.85); }
.prow .side { display: grid; gap: 12px; justify-items: end; text-align: right; }
.prow .price small { font: 500 14px var(--f-body); opacity: .7; }
.prow .price b { font: 700 42px/1 var(--f-display); letter-spacing: -0.04em; }
.prow.featured .price b { background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
.prow .side .btn { width: 100%; }
@media (max-width: 920px) { .prow { grid-template-columns: 1fr; gap: 18px; } .prow .side { justify-items: start; text-align: left; } .prow ul { grid-template-columns: 1fr; } }

/* Planos empresariais */
.bplans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
@media (max-width: 1000px) { .bplans { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; } }
.bplan { position: relative; overflow: hidden; isolation: isolate; background: var(--night-2); color: var(--white); border-radius: 30px; padding: 36px 32px; display: grid; gap: 18px; align-content: start; box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); transition: transform .5s var(--ease), box-shadow .5s; }
.bplan::after { content: ""; position: absolute; right: -90px; top: -90px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(255,90,31,.4), transparent 65%); z-index: -1; transition: transform .8s var(--ease); }
.bplan:hover { transform: translateY(-8px); box-shadow: inset 0 0 0 1px rgba(255,90,31,.5), 0 40px 60px -36px rgba(232,72,12,.6); }
.bplan:hover::after { transform: scale(1.4); }
.bplan.featured { box-shadow: inset 0 0 0 2px var(--orange), 0 40px 70px -40px rgba(232,72,12,.7); }
.bplan .tag { font: 600 12px/1 var(--f-display); letter-spacing: .16em; text-transform: uppercase; color: var(--peach); }
.bplan .badge { position: absolute; top: 20px; right: 20px; background: var(--grad); font: 700 11px/1 var(--f-display); letter-spacing: .1em; text-transform: uppercase; padding: 7px 11px; border-radius: 999px; }
.bplan .name { font: 600 24px var(--f-display); }
.bplan .speed { font: 300 70px/.85 var(--f-display); letter-spacing: -0.06em; }
.bplan .speed small { font-size: 20px; font-weight: 600; letter-spacing: 0; margin-left: 4px; color: var(--orange); }
.bplan ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; font-size: 15px; color: rgba(255,255,255,.82); }
.bplan li { display: flex; gap: 10px; align-items: center; }
.bplan li .ico { width: 18px; height: 18px; color: var(--orange); }
.bplan .price { border-top: 1px solid rgba(255,255,255,.12); padding-top: 18px; display: flex; align-items: baseline; gap: 4px; }
.bplan .price small { font-size: 14px; opacity: .65; }
.bplan .price b { font: 700 40px/1 var(--f-display); background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
.bplan .price .ask { font: 700 26px var(--f-display); }
.bplan .btn { width: 100%; }

/* Imagem com pontos clicáveis */
.hs-wrap { position: relative; border-radius: 34px; overflow: hidden; aspect-ratio: 16 / 9; max-width: 100%; box-shadow: 0 60px 100px -50px rgba(0,0,0,.8); }
.hs-wrap > img { width: 100%; height: 100%; object-fit: cover; }
.hs-wrap::after { content: ""; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(20,14,12,.45), transparent 50%); pointer-events: none; }
.hs { position: absolute; z-index: 2; width: 44px; height: 44px; margin: -22px 0 0 -22px; border-radius: 50%; border: 0; padding: 0; background: rgba(255,255,255,.95); color: var(--orange-700); display: grid; place-items: center; cursor: pointer; box-shadow: 0 10px 24px -8px rgba(0,0,0,.5); transition: transform .4s var(--ease), background-color .3s, color .3s; }
.hs::before { content: ""; position: absolute; inset: -8px; border-radius: 50%; border: 2px solid rgba(255,255,255,.7); animation: ping 2.4s ease-out infinite; }
.hs .ico { width: 18px; height: 18px; transition: transform .4s var(--ease); }
.hs:hover, .hs.open { transform: scale(1.12); background: var(--orange); color: var(--white); z-index: 6; }
.hs.open .ico { transform: rotate(45deg); }
.tip { position: absolute; z-index: 3; left: 50%; bottom: calc(100% + 16px); width: 250px; transform: translateX(-50%) translateY(10px); background: var(--white); color: var(--ink); border-radius: 18px; padding: 16px 18px; text-align: left; box-shadow: 0 24px 50px -20px rgba(0,0,0,.55); opacity: 0; visibility: hidden; transition: opacity .35s, transform .45s var(--ease), visibility 0s linear .35s; pointer-events: none; }
.tip b { display: block; font: 700 16px var(--f-display); margin-bottom: 4px; }
.tip span { font-size: 14px; color: var(--muted); line-height: 1.45; display: block; }
.tip .logos { margin-top: 10px; }
.hs.open .tip, .hs:hover .tip, .hs:focus-visible .tip { opacity: 1; visibility: visible; transform: translateX(-50%); transition: opacity .35s, transform .45s var(--ease); }
.hs.below .tip { bottom: auto; top: calc(100% + 16px); }
@keyframes ping { from { transform: scale(.7); opacity: 1; } to { transform: scale(1.7); opacity: 0; } }
.hs-legend { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; justify-content: center; }
.hs-legend span { padding: 9px 15px; border-radius: 999px; background: rgba(255,255,255,.08); font: 500 14px var(--f-display); color: rgba(255,255,255,.85); }
@media (max-width: 700px) { .hs-wrap { aspect-ratio: 4 / 5; } .hs-wrap > img { object-position: 45% center; } .tip { width: 210px; } }

/* Comparador antes/depois */
.ba { position: relative; border-radius: 34px; overflow: hidden; aspect-ratio: 16 / 9; max-width: 100%; --pos: 50%; box-shadow: 0 50px 90px -50px rgba(30,21,18,.6); user-select: none; touch-action: pan-y; }
.ba img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ba .before { position: absolute; inset: 0; clip-path: inset(0 calc(100% - var(--pos)) 0 0); }
.ba .before img { filter: blur(7px) saturate(.55) brightness(.8); transform: scale(1.04); }
.ba .buffer { position: absolute; left: calc(var(--pos) / 2); top: 50%; transform: translate(-50%, -50%); display: grid; justify-items: center; gap: 10px; color: var(--white); font: 600 14px var(--f-display); text-shadow: 0 2px 10px rgba(0,0,0,.5); }
.ba .buffer i { width: 46px; height: 46px; border-radius: 50%; border: 4px solid rgba(255,255,255,.35); border-top-color: var(--white); animation: rot 1s linear infinite; }
@keyframes rot { to { transform: rotate(360deg); } }
.ba .handle { position: absolute; top: 0; bottom: 0; left: var(--pos); width: 3px; margin-left: -1.5px; background: var(--white); z-index: 2; pointer-events: none; }
.ba .handle span { position: absolute; top: 50%; left: 50%; width: 58px; height: 58px; margin: -29px 0 0 -29px; border-radius: 50%; background: var(--grad); box-shadow: 0 12px 30px -8px rgba(232,72,12,.8), 0 0 0 6px rgba(255,255,255,.35); display: grid; place-items: center; color: var(--white); }
.ba .handle span::before, .ba .handle span::after { content: ""; position: absolute; top: 50%; width: 0; height: 0; margin-top: -6px; border: 6px solid transparent; }
.ba .handle span::before { left: 12px; border-right-color: #fff; } .ba .handle span::after { right: 12px; border-left-color: #fff; }
.ba .lbl { position: absolute; top: 22px; z-index: 2; padding: 9px 15px; border-radius: 999px; font: 600 13.5px var(--f-display); backdrop-filter: blur(8px); }
.ba .lbl.l { left: 22px; background: rgba(20,14,12,.55); color: var(--white); }
.ba .lbl.r { right: 22px; background: var(--white); color: var(--orange-700); }
.ba input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; z-index: 3; cursor: ew-resize; margin: 0; }
@media (max-width: 700px) { .ba { aspect-ratio: 4 / 5; } }

/* Galeria presa (anda de lado com a rolagem) */
.hgal { position: relative; background: var(--white); }
.hgal-sticky { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; justify-content: center; overflow: hidden; gap: 40px; }
.hgal-track { display: flex; gap: 22px; padding-left: max(22px, calc((100vw - var(--max)) / 2 + 22px)); padding-right: 22px; will-change: transform; }
.hcard { position: relative; flex: none; width: clamp(280px, 30vw, 420px); aspect-ratio: 3 / 4; border-radius: 30px; overflow: hidden; color: var(--white); }
.hcard:nth-child(even) { margin-top: 60px; }
.hcard img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.08); transition: transform 1s var(--ease); }
.hcard:hover img { transform: scale(1); }
.hcard::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 45%, rgba(20,14,12,.9)); }
.hcard .cap { position: absolute; left: 24px; right: 24px; bottom: 24px; z-index: 2; display: grid; gap: 6px; }
.hcard .cap small { font: 600 12px var(--f-display); letter-spacing: .16em; text-transform: uppercase; color: var(--peach); }
.hcard .cap b { font: 600 26px/1.1 var(--f-display); letter-spacing: -0.02em; }
.hcard .cap span { font-size: 15px; color: rgba(255,255,255,.82); }
.hcard .num { position: absolute; top: 20px; right: 22px; z-index: 2; font: 300 44px/1 var(--f-display); color: rgba(255,255,255,.85); }
@media (max-width: 900px) {
  .hgal { height: auto !important; padding: 90px 0; }
  .hgal-sticky { position: static; height: auto; }
  .hgal-track { overflow-x: auto; scroll-snap-type: x mandatory; transform: none !important; scrollbar-width: none; padding-bottom: 10px; }
  .hcard { scroll-snap-align: start; width: 78vw; } .hcard:nth-child(even) { margin-top: 0; }
}

.ico-box { width: 54px; height: 54px; border-radius: 16px; position: relative; overflow: hidden; display: grid; place-items: center; background: var(--grad); box-shadow: 0 14px 26px -12px rgba(232,72,12,.65); flex: none; }
.ico-box::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 20% 15%, rgba(255,255,255,.32), transparent 55%); }

/* Cards flutuantes em volta da foto */
.scatter { position: relative; height: 640px; }
.scatter .photo-c { position: absolute; left: 50%; top: 50%; width: min(440px, 40%); aspect-ratio: 4 / 5; transform: translate(-50%, -50%); border-radius: 240px 240px 32px 32px; overflow: hidden; box-shadow: 0 50px 80px -40px rgba(225,29,46,.55); border: 6px solid var(--white); }
.scatter .photo-c img { width: 100%; height: 100%; object-fit: cover; }
.scatter .ring { position: absolute; left: 50%; top: 50%; width: min(700px, 64%); aspect-ratio: 1; margin: calc(min(700px, 64%) / -2) 0 0 calc(min(700px, 64%) / -2); border-radius: 50%; border: 2px dashed rgba(232,72,12,.28); animation: ringspin 60s linear infinite; }
@keyframes ringspin { to { transform: rotate(360deg); } }
.fcard { position: absolute; z-index: 2; width: 260px; background: var(--white); border-radius: 20px; padding: 16px 18px; box-shadow: 0 24px 44px -24px rgba(30,21,18,.4), 0 0 0 1px var(--line); display: grid; grid-template-columns: auto 1fr; gap: 4px 14px; align-items: center; animation: bob 6s ease-in-out infinite; transition: translate .25s linear; }
.fcard .ico-box { grid-row: span 2; }
.fcard b { font: 800 16.5px/1.2 var(--f-display); }
.fcard > span { font-size: 13.5px; color: var(--muted); line-height: 1.35; }
.fcard.f1 { left: 2%; top: 4%; } .fcard.f2 { left: 0; top: 40%; animation-delay: -2s; } .fcard.f3 { left: 5%; bottom: 4%; animation-delay: -4s; }
.fcard.f4 { right: 2%; top: 4%; animation-delay: -1s; } .fcard.f5 { right: 0; top: 40%; animation-delay: -3s; } .fcard.f6 { right: 5%; bottom: 4%; animation-delay: -5s; }
.fcard.logo-card { grid-template-columns: 1fr; gap: 10px; }
@keyframes bob { 50% { transform: translateY(-12px); } }
@media (max-width: 1080px) {
  .scatter { height: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .scatter .photo-c { position: relative; left: auto; top: auto; transform: none; width: 100%; grid-column: 1 / -1; aspect-ratio: 16 / 10; border-radius: 28px; }
  .scatter .ring { display: none; }
  .fcard { position: relative; inset: auto !important; width: auto; animation: none; }
}
@media (max-width: 560px) { .scatter { grid-template-columns: 1fr; } }

/* Revelar imagem */
.reveal-img { transition: clip-path 1.1s var(--ease); }
.reveal-img.pre { clip-path: inset(0 0 100% 0 round 240px 240px 32px 32px); }

/* Avaliações em carrossel 3D */
.cf { position: relative; height: 420px; perspective: 1400px; }
.cf-card { position: absolute; left: 50%; top: 0; width: min(440px, 84vw); margin: 0 0 0 calc(min(440px, 84vw) / -2); background: var(--white); color: var(--ink); border-radius: 28px; padding: 32px; display: grid; gap: 18px; box-shadow: 0 40px 70px -40px rgba(0,0,0,.6); transition: transform .9s var(--ease), opacity .7s, filter .7s; will-change: transform; cursor: pointer; }
.cf-card .stars { color: #FFB020; letter-spacing: 3px; font-size: 18px; }
.cf-card p { font: 400 18px/1.55 var(--f-display); letter-spacing: -0.005em; }
.cf-card footer { display: flex; align-items: center; gap: 12px; font-size: 13.5px; color: var(--muted); }
.cf-card footer b { display: block; color: var(--ink); font: 700 15px var(--f-display); }
.avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--grad); color: var(--white); display: grid; place-items: center; font: 700 16px var(--f-display); flex: none; }
.plan-tag { margin-left: auto; padding: 6px 11px; border-radius: 999px; background: var(--mist); color: var(--orange-700); font: 600 12px var(--f-display); white-space: nowrap; }
.cf-nav { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 20px; }
.cf-nav button.arr { width: 54px; height: 54px; border-radius: 50%; border: 0; background: rgba(255,255,255,.1); color: var(--white); display: grid; place-items: center; cursor: pointer; transition: background-color .3s; }
.cf-nav button.arr:hover { background: var(--orange); }
.cf-nav .prev .ico { transform: rotate(180deg); }
.cf-dots { display: flex; gap: 8px; }
.cf-dots button { width: 9px; height: 9px; border-radius: 9px; border: 0; padding: 0; background: rgba(255,255,255,.3); cursor: pointer; transition: width .4s var(--ease), background-color .3s; }
.cf-dots button[aria-current="true"] { width: 30px; background: var(--orange); }

/* Faixas com foto */
.band { position: relative; overflow: hidden; color: var(--white); background: var(--night); }
.band > img { position: absolute; left: 0; top: -12%; width: 100%; height: 124%; object-fit: cover; will-change: transform; }
.band::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(20,14,12,.94) 0%, rgba(20,14,12,.75) 48%, rgba(20,14,12,.2) 100%); }
.band.fire::after { background: linear-gradient(100deg, rgba(232,72,12,.96) 0%, rgba(225,29,46,.88) 50%, rgba(179,18,31,.5) 100%); }
.band .container { position: relative; z-index: 2; padding-block: clamp(100px, 12vw, 150px); display: grid; gap: 22px; justify-items: start; }
.band p { color: rgba(255,255,255,.88); font-size: 18px; max-width: 54ch; }
.band h2 { max-width: 18ch; }
.band.fire h2 em { background: none; color: var(--night); }
.band .kicker { color: var(--peach); }
.counters { display: flex; flex-wrap: wrap; gap: 20px 54px; margin-top: 6px; }
.counters div { display: grid; gap: 4px; }
.counters b { font: 300 56px/1 var(--f-display); letter-spacing: -0.04em; font-variant-numeric: tabular-nums; }
.counters span { font-size: 14px; color: rgba(255,255,255,.75); }
.counters.light b { color: var(--orange-600); font-weight: 400; }
.counters.light span { color: var(--muted); }
.cep { display: flex; gap: 10px; flex-wrap: wrap; width: min(600px, 100%); padding: 8px; border-radius: 999px; background: rgba(255,255,255,.16); box-shadow: inset 0 0 0 1px rgba(255,255,255,.25); backdrop-filter: blur(10px); }
.cep input { flex: 1 1 200px; min-width: 0; border: 0; border-radius: 999px; padding: 15px 22px; font: 500 16px var(--f-body); background: var(--white); color: var(--ink); }
.cep-result { font-weight: 700; min-height: 1.5em; }
.band .watermark { position: absolute; right: -50px; bottom: -40px; width: min(600px, 62%); height: auto; z-index: 1; pointer-events: none; color: rgba(255,255,255,.12); }

/* Faixa com foto e texto */
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
.split > * { min-width: 0; }
@media (max-width: 920px) { .split { grid-template-columns: 1fr; gap: 40px; } }
.media { position: relative; border-radius: 34px; overflow: hidden; aspect-ratio: 4 / 5; max-width: 100%; box-shadow: 0 50px 90px -50px rgba(30,21,18,.6); transform-style: preserve-3d; transition: transform .6s var(--ease); }
.media img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--ease); }
.media:hover img { transform: scale(1.05); }
.media .float { position: absolute; left: 20px; bottom: 20px; display: flex; gap: 12px; align-items: center; padding: 14px 18px; border-radius: 18px; background: rgba(255,255,255,.92); backdrop-filter: blur(10px); box-shadow: 0 18px 34px -16px rgba(30,21,18,.5); }
.media .float b { font: 700 26px/1 var(--f-display); background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
.media .float span { font-size: 13.5px; color: var(--muted); line-height: 1.3; }
.vbug { position: absolute; z-index: 3; top: 18px; display: inline-flex; background: var(--white); border-radius: 13px; padding: 9px 13px; box-shadow: 0 12px 26px -12px rgba(30,21,18,.5); color: var(--orange); }
.vbug.tl { left: 18px; } .vbug.tr { right: 18px; }
.vbug .logo { width: 64px; height: auto; display: block; }
.copy-block { display: grid; gap: 20px; justify-items: start; }
.copy-block p { color: var(--muted); font-size: 17.5px; }
.dark .copy-block p { color: rgba(255,255,255,.72); }

/* Manifesto que acende */
.manifesto p { font: 300 clamp(30px, 4.4vw, 60px)/1.18 var(--f-display); letter-spacing: -0.035em; max-width: 24ch; }
.manifesto .mw { opacity: .14; transition: opacity .35s; }
.manifesto .mw.lit { opacity: 1; }
.manifesto .mw.g.lit { background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; font-weight: 600; }

/* Linha que se desenha (Sobre) */
.path { position: relative; display: grid; gap: 100px; padding-block: 20px; }
.path svg.line { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; overflow: visible; pointer-events: none; }
.path .track { fill: none; stroke: rgba(255,255,255,.1); stroke-width: 2; }
.path .draw { fill: none; stroke: url(#pathgrad); stroke-width: 3.5; stroke-linecap: round; filter: drop-shadow(0 0 10px rgba(255,90,31,.7)); }
.path .head-dot { fill: var(--white); stroke: var(--orange); stroke-width: 4; filter: drop-shadow(0 0 12px rgba(255,90,31,.9)); transition: opacity .3s; }
.pcard { position: relative; z-index: 1; width: min(520px, 100%); background: var(--night-2); color: var(--white); border-radius: 28px; padding: 34px 36px; text-align: center; display: grid; gap: 12px; justify-items: center; box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); transition: box-shadow .6s var(--ease), transform .6s var(--ease); }
.pcard:nth-of-type(odd) { justify-self: start; margin-left: 4%; } .pcard:nth-of-type(even) { justify-self: end; margin-right: 4%; }
.pcard .ico-box { opacity: .5; transition: opacity .5s; }
.pcard p { color: rgba(255,255,255,.72); }
.pcard.lit { box-shadow: inset 0 0 0 1.5px var(--orange), 0 30px 70px -30px rgba(232,72,12,.6); transform: translateY(-4px); }
.pcard.lit .ico-box { opacity: 1; }
@media (max-width: 860px) { .pcard:nth-of-type(n) { justify-self: center; margin: 0; } .path { gap: 60px; } }

/* Simulador */
.sim { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr); gap: 24px; }
.sim > * { min-width: 0; }
@media (max-width: 960px) { .sim { grid-template-columns: minmax(0, 1fr); } }
.sim-panel { border-radius: 30px; padding: clamp(24px, 4vw, 44px); background: var(--white); box-shadow: 0 0 0 1px var(--line); display: grid; gap: 30px; align-content: start; }
.sim h3 { font: 600 13px var(--f-display); letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.stepper { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.stepper button { width: 54px; height: 54px; border-radius: 50%; border: 0; background: var(--mist); color: var(--ink); font: 300 26px/1 var(--f-display); cursor: pointer; transition: background-color .3s, color .3s, transform .3s var(--ease); }
.stepper button:hover { background: var(--grad); color: var(--white); transform: scale(1.06); }
.stepper output { font: 300 64px/1 var(--f-display); letter-spacing: -0.04em; min-width: 2ch; text-align: center; font-variant-numeric: tabular-nums; }
.stepper span { color: var(--muted); }
.acts { display: flex; flex-wrap: wrap; gap: 10px; }
.acts button { padding: 12px 18px; border-radius: 999px; border: 0; background: var(--mist); color: var(--muted); font: 500 15px/1 var(--f-display); cursor: pointer; transition: background-color .3s, color .3s, transform .3s var(--ease); }
.acts button:hover { transform: translateY(-2px); color: var(--ink); }
.acts button[aria-pressed="true"] { background: var(--grad); color: var(--white); }
.result { border-radius: 30px; padding: clamp(24px, 4vw, 44px); background: var(--night); color: var(--white); display: grid; gap: 16px; justify-items: start; align-content: space-between; position: relative; overflow: hidden; }
.result::before { content: ""; position: absolute; right: -120px; top: -120px; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle, rgba(255,90,31,.45), transparent 65%); }
.gauge { width: 100%; max-width: 300px; justify-self: center; position: relative; }
.gauge .track { stroke: rgba(255,255,255,.12); }
.gauge .val { stroke: url(#gaugegrad); transition: stroke-dashoffset 1s var(--ease); }
.gauge text { fill: var(--white); font-family: var(--f-display); }
.result .rec { font: 300 clamp(32px, 4vw, 48px)/1 var(--f-display); letter-spacing: -0.04em; position: relative; }
.result .rec b { font-weight: 700; }
.result p { color: rgba(255,255,255,.72); position: relative; }
.result .btn { position: relative; }
@media (max-width: 520px) { .stepper button { width: 46px; height: 46px; } .stepper output { font-size: 48px; } .result .btn { width: 100%; } }

/* Comparativo */
.compare-wrap { overflow-x: auto; border-radius: 30px; box-shadow: 0 0 0 1px var(--line), 0 40px 70px -50px rgba(30,21,18,.5); background: var(--white); }
.compare { width: 100%; min-width: 760px; border-collapse: separate; border-spacing: 0; font-size: 15px; }
.compare th, .compare td { padding: 17px 22px; text-align: left; border-bottom: 1px solid var(--line); vertical-align: middle; }
.compare thead th { background: var(--white); padding-top: 28px; padding-bottom: 22px; }
.compare thead th:first-child { font: 600 22px/1.2 var(--f-display); }
.compare .colh { display: grid; gap: 6px; }
.compare .colh .logo { width: 52px; height: auto; color: var(--orange); }
.compare .colh b { font: 700 26px/1 var(--f-display); text-transform: lowercase; letter-spacing: -0.03em; }
.compare .colh span { font-size: 13px; color: var(--muted); }
.compare tbody th { font: 600 14.5px var(--f-display); color: var(--muted); width: 22%; background: var(--white); position: sticky; left: 0; z-index: 1; }
.compare td.feat { background: var(--mist); }
.compare thead th.feat { background: var(--night); color: var(--white); border-radius: 20px 20px 0 0; }
.compare thead th.feat .logo, .compare thead th.feat span { color: rgba(255,255,255,.85); }
.compare tbody tr:hover td, .compare tbody tr:hover th { background: #FFEDE3; }
.compare .yes { width: 26px; height: 26px; border-radius: 50%; background: var(--grad); color: var(--white); display: inline-grid; place-items: center; }
.compare .yes .ico { width: 15px; height: 15px; }
.compare .no { color: rgba(30,21,18,.3); font-weight: 700; }
.compare .pr b { font: 700 26px var(--f-display); }
.compare tfoot td { border-bottom: 0; padding-bottom: 28px; }
.compare tfoot .btn { width: 100%; padding: 13px 16px; }

/* Perfis */
.profiles { display: grid; grid-template-columns: 1.3fr 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 18px; height: 620px; }
.profiles > a:first-child { grid-row: span 2; }
.profile { position: relative; border-radius: 28px; overflow: hidden; color: var(--white); display: flex; align-items: flex-end; text-decoration: none; isolation: isolate; }
.profile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; transition: transform 1s var(--ease); }
.profile:hover img { transform: scale(1.06); }
.profile::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, transparent 35%, rgba(20,14,12,.9)); }
.profile div { padding: 24px; display: grid; gap: 6px; transform: translateY(18px); transition: transform .6s var(--ease); }
.profile:hover div { transform: none; }
.profile p { color: rgba(255,255,255,.85); font-size: 14.5px; }
.profile .go { color: var(--peach); font: 600 14.5px var(--f-display); opacity: 0; transition: opacity .4s; }
.profile:hover .go { opacity: 1; }
@media (hover: none) { .profile div { transform: none; } .profile .go { opacity: 1; } }
@media (max-width: 900px) { .profiles { grid-template-columns: 1fr 1fr; grid-template-rows: none; height: auto; } .profiles > a { aspect-ratio: 3 / 4; } .profiles > a:first-child { grid-row: auto; grid-column: 1 / -1; aspect-ratio: 16 / 10; } }
@media (max-width: 520px) { .profiles { grid-template-columns: 1fr; } }

/* Checklist e passos */
.checklist { display: grid; width: 100%; }
.checklist div { display: grid; grid-template-columns: auto 1fr; gap: 4px 16px; padding: 18px 0; border-bottom: 1px solid var(--line); }
.checklist .ck { width: 36px; height: 36px; border-radius: 50%; background: var(--grad); color: var(--white); display: grid; place-items: center; grid-row: span 2; }
.checklist .ck .ico { width: 18px; height: 18px; }
.checklist b { font: 600 18px var(--f-display); }
.checklist span { color: var(--muted); font-size: 15px; }

/* FAQ */
.faq-top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 36px; }
.search { position: relative; width: min(420px, 100%); }
.search input { width: 100%; padding: 17px 22px 17px 52px; border-radius: 999px; border: 0; background: var(--mist); box-shadow: inset 0 0 0 1px var(--line); font: 400 16px var(--f-body); color: var(--ink); transition: box-shadow .3s, background-color .3s; }
.search input:focus { outline: none; background: var(--white); box-shadow: inset 0 0 0 2px var(--orange), 0 0 0 5px rgba(255,90,31,.12); }
.search svg { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: var(--muted); }
.faq-2 { display: grid; grid-template-columns: .75fr 1.25fr; gap: 60px; align-items: start; }
.faq-2 > * { min-width: 0; }
@media (max-width: 920px) { .faq-2 { grid-template-columns: 1fr; } }
.faq-side { position: sticky; top: 120px; display: grid; gap: 18px; }
.faq-side .media { aspect-ratio: 4 / 3; }
@media (max-width: 920px) { .faq-side { position: static; } }
.acc { display: grid; gap: 12px; }
.acc-item { border-radius: 22px; background: var(--white); box-shadow: 0 0 0 1px var(--line); transition: box-shadow .4s; }
.acc-item[hidden] { display: none; }
.acc-item.open { box-shadow: 0 0 0 1.5px var(--orange), 0 24px 44px -30px rgba(232,72,12,.5); }
.acc-item button { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; background: none; border: 0; padding: 22px 24px; text-align: left; font: 500 18px/1.4 var(--f-display); color: var(--ink); cursor: pointer; }
.acc-item .pm { width: 38px; height: 38px; border-radius: 50%; flex: none; display: grid; place-items: center; background: var(--mist); color: var(--orange-700); transition: transform .5s var(--ease), background-color .3s, color .3s; }
.acc-item.open .pm { transform: rotate(135deg); background: var(--grad); color: var(--white); }
.acc-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .5s var(--ease); }
.acc-body > div { overflow: hidden; }
.acc-body p { padding: 0 24px 24px; color: var(--muted); }
.acc-item.open .acc-body { grid-template-rows: 1fr; }
.empty { color: var(--muted); padding: 20px 0; }

/* Cabeçalho com foto */
.phero { position: relative; min-height: 560px; display: flex; align-items: flex-end; overflow: hidden; color: var(--white); background: var(--night); }
.phero > img { position: absolute; inset: -20px; width: calc(100% + 40px); height: calc(100% + 40px); object-fit: cover; object-position: 70% 30%; animation: settle 2s var(--ease) both; }
@keyframes settle { from { transform: scale(1.1); } }
.phero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(20,14,12,.9) 0%, rgba(20,14,12,.6) 40%, rgba(20,14,12,.1) 80%), linear-gradient(0deg, rgba(20,14,12,.8), transparent 50%), radial-gradient(ellipse 50% 70% at 0% 100%, rgba(255,90,31,.35), transparent 70%); }
.phero .container { position: relative; z-index: 2; display: grid; gap: 18px; padding-block: 150px 70px; width: 100%; }
.phero .crumbs { font: 500 13px var(--f-display); letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.7); }
.phero .crumbs a { color: var(--white); text-decoration: none; }
.phero h1 { max-width: 15ch; }
.phero p { font-size: 19px; max-width: 52ch; color: rgba(255,255,255,.85); animation: fadeUp 1s var(--ease) calc(var(--d0) + .4s) both; }
.phero .hprice { opacity: 1; transform: none; top: auto; bottom: 70px; animation: fadeUp 1s var(--ease) calc(var(--d0) + .6s) both; }
@media (max-width: 900px) { .phero { min-height: 480px; } .phero .hprice { display: none; } }

/* Formulários */
.form { display: grid; gap: 26px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 22px 28px; }
@media (max-width: 640px) { .grid2 { grid-template-columns: 1fr; } }
.fl { position: relative; display: block; }
.fl input, .fl textarea, .fl select { width: 100%; padding: 26px 18px 10px; border: 0; border-radius: 16px; background: var(--mist); box-shadow: inset 0 0 0 1px var(--line); color: var(--ink); font: 400 16px var(--f-body); transition: box-shadow .3s, background-color .3s; }
.fl textarea { min-height: 140px; resize: vertical; }
.fl span { position: absolute; left: 18px; top: 19px; color: var(--muted); font: 400 16px var(--f-body); pointer-events: none; transform-origin: left; transition: transform .35s var(--ease), color .3s; }
.fl input:focus, .fl textarea:focus, .fl select:focus { outline: none; background: var(--white); box-shadow: inset 0 0 0 2px var(--orange), 0 0 0 5px rgba(255,90,31,.12); }
.fl input:focus + span, .fl input:not(:placeholder-shown) + span, .fl textarea:focus + span, .fl textarea:not(:placeholder-shown) + span, .fl.sel span { transform: translateY(-11px) scale(.76); color: var(--orange-700); }
.ok { display: none; gap: 12px; align-items: center; padding: 16px 18px; border-radius: 16px; background: #E8FBF2; color: #0B6B41; font-weight: 600; }
.form.sent .ok { display: flex; animation: fadeUp .6s var(--ease); }
.form-card { background: var(--white); border-radius: 32px; padding: clamp(24px, 4vw, 44px); box-shadow: 0 0 0 1px var(--line), 0 40px 80px -56px rgba(30,21,18,.55); }
.contact { display: grid; grid-template-columns: 1.25fr 1fr; gap: 34px; align-items: start; }
.contact > * { min-width: 0; }
@media (max-width: 960px) { .contact { grid-template-columns: 1fr; } }
.channels { display: grid; gap: 12px; }
.channel { display: flex; gap: 16px; align-items: center; padding: 20px; border-radius: 22px; background: var(--white); box-shadow: 0 0 0 1px var(--line); text-decoration: none; color: var(--ink); transition: transform .4s var(--ease), box-shadow .3s; }
a.channel:hover { transform: translateX(8px); box-shadow: 0 0 0 1.5px var(--orange); }
.channel .ib { width: 50px; height: 50px; border-radius: 16px; background: var(--grad); color: var(--white); display: grid; place-items: center; flex: none; }
.channel b { display: block; font: 600 16px var(--f-display); }
.channel span { color: var(--muted); font-size: 14.5px; }

/* Assinatura em etapas */
.wizard { display: grid; grid-template-columns: 1fr 360px; gap: 30px; align-items: start; }
.wizard > * { min-width: 0; }
@media (max-width: 1000px) { .wizard { grid-template-columns: 1fr; } }
.wsteps { display: flex; gap: 8px; margin-bottom: 30px; }
.wsteps div { flex: 1; display: grid; gap: 10px; font: 600 12px/1 var(--f-display); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
.wsteps div::before { content: ""; height: 4px; border-radius: 4px; background: var(--line); background-image: var(--grad); background-size: 0 100%; background-repeat: no-repeat; transition: background-size .8s var(--ease); }
.wsteps div.done::before, .wsteps div.cur::before { background-size: 100% 100%; }
.wsteps div.cur { color: var(--orange-700); }
.wpanel { display: none; gap: 24px; animation: fadeUp .6s var(--ease); border: 0; padding: 0; margin: 0; }
.wpanel.cur { display: grid; }
.wpanel h2 { font-size: clamp(28px, 3.4vw, 42px); }
.pick { display: grid; gap: 12px; }
.pick label { position: relative; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 20px; padding: 22px 26px; border-radius: 22px; background: var(--mist); box-shadow: inset 0 0 0 1px var(--line); cursor: pointer; transition: box-shadow .3s, background-color .3s, transform .4s var(--ease); }
.pick label:hover { transform: translateX(6px); }
.pick input { position: absolute; opacity: 0; }
.pick .radio { width: 24px; height: 24px; border-radius: 50%; box-shadow: inset 0 0 0 2px rgba(30,21,18,.25); display: grid; place-items: center; }
.pick .radio::after { content: ""; width: 10px; height: 10px; border-radius: 50%; background: var(--white); transform: scale(0); transition: transform .35s var(--ease); }
.pick b { font: 300 32px/1 var(--f-display); letter-spacing: -0.04em; }
.pick b small { font: 600 15px var(--f-display); letter-spacing: 0; margin-left: 10px; color: var(--muted); }
.pick em { font: 600 18px var(--f-display); font-style: normal; }
.pick label:has(input:checked) { background: var(--night); color: var(--white); box-shadow: 0 0 0 2px var(--orange), 0 20px 40px -24px rgba(232,72,12,.7); }
.pick label:has(input:checked) .radio { background: var(--grad); box-shadow: none; }
.pick label:has(input:checked) .radio::after { transform: scale(1); }
.pick label:has(input:checked) b small { color: var(--peach); }
.pick label:has(input:focus-visible) { outline: 2px solid var(--orange); outline-offset: 3px; }
.wnav { display: flex; gap: 12px; flex-wrap: wrap; }
.wsum { position: sticky; top: 120px; border-radius: 32px; padding: 32px; background: var(--night); color: var(--white); display: grid; gap: 16px; overflow: hidden; isolation: isolate; }
.wsum::before { content: ""; position: absolute; right: -100px; top: -100px; width: 280px; height: 280px; border-radius: 50%; background: radial-gradient(circle, rgba(255,90,31,.45), transparent 65%); z-index: -1; }
.wsum .logo { width: 96px; height: auto; color: var(--white); }
.wsum .sp { font: 300 74px/.9 var(--f-display); letter-spacing: -0.06em; }
.wsum .sp small { font-size: 20px; font-weight: 600; letter-spacing: 0; margin-left: 6px; color: var(--orange); }
.wsum .line { display: flex; justify-content: space-between; gap: 14px; border-top: 1px solid rgba(255,255,255,.12); padding-top: 14px; color: rgba(255,255,255,.7); font-size: 15px; }
.wsum .line b { color: var(--white); font-family: var(--f-display); }
.done-box { display: none; justify-items: start; gap: 20px; animation: fadeUp .8s var(--ease); }
.done-box.on { display: grid; }
.check-anim path { stroke-dasharray: 60; stroke-dashoffset: 60; animation: draw .9s var(--ease) .2s forwards; }
.check-anim circle { stroke-dasharray: 190; stroke-dashoffset: 190; animation: draw 1s var(--ease) forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }

/* Redes */
.social { display: flex; gap: 10px; flex-wrap: wrap; }
.social a { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; background: rgba(255,255,255,.08); color: var(--white); box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); transition: transform .4s var(--ease), background-color .3s; }
.social a:hover { transform: translateY(-4px); background: var(--orange); }
.social.light a { background: var(--mist); color: var(--orange-700); box-shadow: none; }
.social.light a:hover { background: var(--grad); color: var(--white); }

/* Rodapé com mapa */
.foot { background: var(--night); color: rgba(255,255,255,.7); font-size: 15px; position: relative; overflow: hidden; }
.foot::before { content: ""; position: absolute; width: 700px; height: 700px; right: -300px; top: -300px; border-radius: 50%; background: radial-gradient(circle, rgba(255,90,31,.18), transparent 65%); pointer-events: none; }
.where { position: relative; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 50px; align-items: center; padding: 80px 0 56px; border-bottom: 1px solid rgba(255,255,255,.1); }
@media (max-width: 880px) { .where { grid-template-columns: 1fr; gap: 28px; } }
.map-box { position: relative; height: 290px; border-radius: 28px; overflow: hidden; background: #E9E4E1; box-shadow: 0 40px 70px -40px rgba(0,0,0,.8); }
.map-box img { width: 100%; height: 100%; object-fit: cover; filter: sepia(.25) saturate(1.3) hue-rotate(-12deg); transition: transform 1.2s var(--ease); }
.map-box:hover img { transform: scale(1.06); }
.map-box .pin { position: absolute; left: 50%; top: 50%; z-index: 2; width: 24px; height: 24px; margin: -12px 0 0 -12px; border-radius: 50%; background: var(--red); border: 4px solid var(--white); box-shadow: 0 8px 18px -6px rgba(225,29,46,.8); }
.map-box .pin::before { content: ""; position: absolute; inset: -10px; border-radius: 50%; border: 3px solid rgba(225,29,46,.55); animation: ping 2.2s ease-out infinite; }
.map-box .pin b { position: absolute; left: 24px; top: -5px; white-space: nowrap; font: 700 13px var(--f-display); color: var(--red); text-shadow: 0 0 4px #fff, 0 0 4px #fff; }
.map-info { position: absolute; left: 14px; top: 14px; z-index: 3; background: var(--white); color: var(--ink); border-radius: 16px; padding: 14px 16px; display: grid; gap: 3px; max-width: 270px; box-shadow: 0 14px 30px -12px rgba(0,0,0,.5); }
.map-info b { font: 700 15px var(--f-display); }
.map-info span { font-size: 12.5px; color: var(--muted); line-height: 1.35; }
.map-info .mbtns { display: flex; gap: 6px; margin-top: 8px; }
.map-info a { display: inline-flex; align-items: center; gap: 6px; padding: 9px 13px; border-radius: 11px; background: var(--grad); color: var(--white); font: 600 13px var(--f-display); text-decoration: none; }
.map-info a.sq { padding: 9px; background: var(--mist); color: var(--orange-700); }
.map-info a .ico { width: 16px; height: 16px; }
.map-box .attr { position: absolute; right: 8px; bottom: 6px; z-index: 3; font-size: 11px; background: rgba(255,255,255,.85); color: var(--ink); padding: 2px 6px; border-radius: 4px; }
.map-box .attr a { color: var(--ink); }
.where h2 { color: var(--white); }
.where p { color: rgba(255,255,255,.7); margin-top: 12px; max-width: 46ch; }
.where .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.where .chips span { padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,.07); box-shadow: inset 0 0 0 1px rgba(255,255,255,.1); font: 500 13.5px var(--f-display); color: var(--white); }
.where .chips span.on { background: var(--grad); box-shadow: none; }
.where .chips small { opacity: .65; margin-left: 4px; }
.foot-brand { position: relative; display: flex; justify-content: space-between; align-items: center; gap: 16px 24px; flex-wrap: wrap; padding: 32px 0; border-bottom: 1px solid rgba(255,255,255,.1); }
.foot-brand .logo { width: 130px; height: auto; color: var(--white); }
.foot-brand b { font: 300 clamp(20px, 2.6vw, 30px) var(--f-display); letter-spacing: -0.02em; color: var(--white); }
.foot .cols { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; padding-top: 44px; }
@media (max-width: 860px) { .foot .cols { grid-template-columns: 1fr 1fr; } }
@media (max-width: 520px) { .foot .cols { grid-template-columns: 1fr; } }
.foot h3 { color: var(--white); font: 600 13px var(--f-display); letter-spacing: .14em; text-transform: uppercase; margin-bottom: 16px; }
.foot a { color: rgba(255,255,255,.72); text-decoration: none; transition: color .3s; }
.foot a:hover { color: var(--orange); }
.foot ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.foot .bottom { position: relative; border-top: 1px solid rgba(255,255,255,.1); margin-top: 48px; padding: 22px 0 30px; font-size: 13px; display: grid; gap: 6px; }

/* WhatsApp com ondas */
.wa-float { position: fixed; right: max(20px, env(safe-area-inset-right)); bottom: max(20px, env(safe-area-inset-bottom)); z-index: 110; width: 62px; height: 62px; border-radius: 50%; background: linear-gradient(145deg, #2EE07A, #1FA855); color: var(--white); display: grid; place-items: center; box-shadow: 0 14px 30px -8px rgba(31,168,85,.6), 0 0 22px rgba(46,224,122,.35); transition: transform .4s var(--ease); }
.wa-float::before, .wa-float::after { content: ""; position: absolute; inset: 0; border-radius: 50%; border: 2px solid rgba(46,224,122,.55); animation: wave 3s ease-out infinite; }
.wa-float::after { animation-delay: 1.5s; }
@keyframes wave { from { transform: scale(1); opacity: .9; } to { transform: scale(1.75); opacity: 0; } }
.wa-float:hover { transform: scale(1.08); }
.wa-float .ico { width: 30px; height: 30px; position: relative; }

/* Entrada ao rolar */
.rv { transition: opacity 1s var(--ease), transform 1s var(--ease); }
.rv.pre { opacity: 0; transform: translateY(40px); }
.rv-l.pre { transform: translateX(-50px); } .rv-r.pre { transform: translateX(50px); } .rv-s.pre { transform: scale(.94); }
.clip { transition: clip-path 1.3s var(--ease); }
.clip.pre { clip-path: inset(100% 0 0 0 round 34px); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-delay: 0s !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .rv.pre, .clip.pre, .reveal-img.pre { opacity: 1; transform: none; clip-path: none; }
  .w > span { transform: none; }
  html.loading .loader { display: none; }
  .logoband .track { animation: none; }
}
`;

const headScript = `<script>
(function(){var d=document.documentElement;if(/[?&]shot/.test(location.search))return;try{
if(!sessionStorage.getItem('vyra-loaded')){d.classList.add('loading');sessionStorage.setItem('vyra-loaded','1');}
else if(sessionStorage.getItem('vyra-nav')){d.classList.add('from-nav');sessionStorage.removeItem('vyra-nav');}
}catch(e){}})();
</script>
`;

const js = `// Vyra · modelo Premium
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* Cursor próprio */
  if (fine && !reduce) {
    var dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring'; ring.innerHTML = '<span></span>';
    document.body.append(dot, ring);
    var mx = -100, my = -100, rx = -100, ry = -100, shown = false;
    addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; if (!shown) { shown = true; rx = mx; ry = my; document.body.classList.add('has-cursor'); } dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)'; }, { passive: true });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('has-cursor'); shown = false; });
    (function loop() { rx += (mx - rx) * .17; ry += (my - ry) * .17; ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor], a, button, label, input[type=range]');
      ring.classList.remove('hover', 'text'); if (!t) return;
      var txt = t.getAttribute('data-cursor'); if (txt) { ring.classList.add('text'); ring.firstChild.textContent = txt; } else ring.classList.add('hover');
    });
  }

  /* Transição entre páginas */
  var curtain = $('.curtain');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]'); if (!a || !curtain || reduce || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    var href = a.getAttribute('href'); if (!/^[\\w-]+\\.html(#[\\w-]*)?$/.test(href)) return;
    e.preventDefault(); try { sessionStorage.setItem('vyra-nav', '1'); } catch (err) {}
    curtain.classList.add('cover'); setTimeout(function () { location.href = href; }, 520);
  });
  addEventListener('pageshow', function (e) { if (e.persisted && curtain) curtain.classList.remove('cover'); });

  /* Topo, progresso e menu */
  var hdr = $('.hdr'), prog = $('.progress'), lastY = 0;
  function onScroll() { var y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    hdr.classList.toggle('solid', y > 60); hdr.classList.toggle('hide', y > lastY && y > 400 && !document.body.classList.contains('menu-open')); lastY = y; }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var mm = $('.mmenu');
  $$('[data-menu]').forEach(function (b) { b.addEventListener('click', function () { var o = !mm.classList.contains('open'); mm.classList.toggle('open', o); document.body.classList.toggle('menu-open', o); $$('[data-menu]').forEach(function (x) { x.setAttribute('aria-expanded', o); }); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && mm.classList.contains('open')) $('[data-menu]').click(); });

  /* Cards flutuantes acompanham o mouse */
  var sc = $('.scatter');
  if (sc && fine && !reduce) sc.addEventListener('mousemove', function (e) {
    var r = sc.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
    $$('.fcard', sc).forEach(function (c, i) { var d = (i % 3 + 1) * 8; c.style.translate = (dx * d) + 'px ' + (dy * d) + 'px'; });
  });

  /* Botões magnéticos */
  if (fine && !reduce) $$('[data-magnetic]').forEach(function (el) {
    el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(); el.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .25 + 'px,' + (e.clientY - r.top - r.height / 2) * .3 + 'px)'; });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  });

  /* Hero com miniaturas */
  var hero = $('.hero');
  if (hero) {
    var hs = $$('.hslide', hero), th = $$('.hthumb', hero), cur = 0, timer, DUR = 7000;
    hero.style.setProperty('--dur', DUR + 'ms');
    var go = function (i) { cur = (i + hs.length) % hs.length;
      hs.forEach(function (s, k) { s.classList.toggle('on', k === cur); s.setAttribute('aria-hidden', k !== cur); });
      th.forEach(function (t) { t.setAttribute('aria-current', 'false'); }); void hero.offsetWidth; th[cur].setAttribute('aria-current', 'true');
      clearTimeout(timer); if (!reduce) timer = setTimeout(function () { go(cur + 1); }, DUR); };
    th.forEach(function (t, k) { t.addEventListener('click', function () { go(k); }); });
    hero.addEventListener('mouseenter', function () { clearTimeout(timer); hero.classList.add('paused'); });
    hero.addEventListener('mouseleave', function () { hero.classList.remove('paused'); go(cur); });
    if (fine && !reduce) hero.addEventListener('mousemove', function (e) { var dx = e.clientX / innerWidth - .5, dy = e.clientY / innerHeight - .5;
      $$('.himg', hero).forEach(function (im) { im.style.transform = 'translate(' + (-dx * 24) + 'px,' + (-dy * 18) + 'px)'; }); });
    var x0 = null; hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });
    go(0);
  }

  /* Abas de planos */
  $$('.ptabs').forEach(function (tl) { var bs = $$('[role=tab]', tl), pill = $('.pill', tl);
    var place = function (b) { pill.style.width = b.offsetWidth + 'px'; pill.style.transform = 'translateX(' + (b.offsetLeft - 6) + 'px)'; };
    var curB = function () { return bs.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]; };
    bs.forEach(function (b) { b.addEventListener('click', function () { bs.forEach(function (o) { o.setAttribute('aria-selected', o === b); document.getElementById(o.getAttribute('aria-controls')).hidden = o !== b; }); place(b); }); });
    place(bs[0]); addEventListener('resize', function () { place(curB()); }); if (document.fonts) document.fonts.ready.then(function () { place(curB()); }); });

  /* Escolha do streaming no Família */
  $$('.choose').forEach(function (g) { var bs = $$('button', g), out = g.parentNode.querySelector('.logos');
    bs.forEach(function (b) { b.addEventListener('click', function () { bs.forEach(function (o) { o.setAttribute('aria-pressed', o === b); }); out.innerHTML = b.dataset.logos; }); }); });

  /* Luz e inclinação nos cards */
  if (fine && !reduce) $$('.plan, [data-tilt]').forEach(function (el) {
    el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
      el.style.transform = 'perspective(1200px) rotateX(' + ((y / r.height) - .5) * -6 + 'deg) rotateY(' + ((x / r.width) - .5) * 7 + 'deg) translateY(-4px)'; });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  });

  /* Pontos clicáveis na imagem */
  $$('.hs').forEach(function (b) { b.addEventListener('click', function () { var o = !b.classList.contains('open'); $$('.hs').forEach(function (x) { x.classList.remove('open'); x.setAttribute('aria-expanded', 'false'); }); b.classList.toggle('open', o); b.setAttribute('aria-expanded', o); }); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.hs')) $$('.hs.open').forEach(function (x) { x.classList.remove('open'); x.setAttribute('aria-expanded', 'false'); }); });

  /* Comparador antes/depois */
  $$('.ba').forEach(function (ba) { var r = $('input', ba);
    var set = function (v) { ba.style.setProperty('--pos', v + '%'); r.value = v; };
    r.addEventListener('input', function () { set(r.value); });
    if (!reduce && 'IntersectionObserver' in window) { var played = false, ob = new IntersectionObserver(function (es) { if (es[0].isIntersecting && !played) { played = true; ob.disconnect();
      var t0 = null; requestAnimationFrame(function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 2400, 1), v = 50 + Math.sin(p * Math.PI * 2) * 28 * (1 - p); set(v.toFixed(1)); if (p < 1) requestAnimationFrame(step); }); } }, { threshold: .5 }); ob.observe(ba); } });

  /* Galeria presa que anda de lado */
  $$('.hgal').forEach(function (sec) { var track = $('.hgal-track', sec), sticky = $('.hgal-sticky', sec);
    function size() { if (innerWidth <= 900 || reduce) { sec.style.height = ''; track.style.transform = ''; return; }
      var extra = track.scrollWidth - innerWidth; sec.style.height = (innerHeight + Math.max(0, extra)) + 'px'; move(); }
    function move() { if (innerWidth <= 900 || reduce) return; var r = sec.getBoundingClientRect(), extra = track.scrollWidth - innerWidth, p = Math.max(0, Math.min(1, -r.top / (sec.offsetHeight - innerHeight)));
      track.style.transform = 'translateX(' + (-p * extra) + 'px)'; }
    size(); addEventListener('resize', size); addEventListener('scroll', move, { passive: true }); addEventListener('load', size); });

  /* Carrossel 3D de avaliações */
  $$('.cf-wrap').forEach(function (w) { var cards = $$('.cf-card', w), dots = $$('.cf-dots button', w), n = cards.length, cur = 0, t;
    function render() { cards.forEach(function (c, i) { var o = i - cur; if (o > n / 2) o -= n; if (o < -n / 2) o += n; var a = Math.abs(o);
      c.style.transform = 'translateX(' + (o * 58) + '%) translateZ(' + (-a * 160) + 'px) rotateY(' + (o * -16) + 'deg)'; c.style.opacity = a > 2 ? 0 : 1 - a * .25; c.style.zIndex = 10 - a; c.style.filter = a ? 'saturate(.6) brightness(.85)' : 'none'; c.setAttribute('aria-hidden', a !== 0); });
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === cur); }); }
    function go(i) { cur = (i + n) % n; render(); clearTimeout(t); if (!reduce) t = setTimeout(function () { go(cur + 1); }, 5000); }
    $('.cf-nav .prev', w).addEventListener('click', function () { go(cur - 1); }); $('.cf-nav .next', w).addEventListener('click', function () { go(cur + 1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); }); cards.forEach(function (c, i) { c.addEventListener('click', function () { go(i); }); });
    w.addEventListener('mouseenter', function () { clearTimeout(t); }); w.addEventListener('mouseleave', function () { go(cur); });
    var x0 = null; w.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true }); w.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });
    go(0); });

  /* Manifesto que acende */
  $$('.manifesto').forEach(function (m) { var ws = $$('.mw', m);
    var lit = function () { var r = m.getBoundingClientRect(), p = (innerHeight * .85 - r.top) / (r.height + innerHeight * .25), k = reduce ? ws.length : Math.round(Math.max(0, Math.min(1, p)) * ws.length); ws.forEach(function (w, i) { w.classList.toggle('lit', i < k); }); };
    addEventListener('scroll', lit, { passive: true }); lit(); });

  /* Linha que se desenha */
  $$('.path').forEach(function (wrap) { var svg = $('svg.line', wrap), track = $('.track', svg), draw = $('.draw', svg), dot = $('.head-dot', svg), cards = $$('.pcard', wrap), len = 0;
    function build() { var w = wrap.clientWidth, h = wrap.clientHeight, n = cards.length; svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      var d = 'M ' + (w * .5) + ' 0', amp = Math.min(w * .3, 300);
      for (var i = 0; i < n + 1; i++) { var y0 = i * h / (n + 1), y1 = (i + 1) * h / (n + 1), sd = i % 2 ? -1 : 1; d += ' C ' + (w * .5 + sd * amp) + ' ' + (y0 + (y1 - y0) * .35) + ', ' + (w * .5 + sd * amp) + ' ' + (y0 + (y1 - y0) * .65) + ', ' + (w * .5) + ' ' + y1; }
      track.setAttribute('d', d); draw.setAttribute('d', d); len = draw.getTotalLength(); draw.style.strokeDasharray = len; update(); }
    function update() { var r = wrap.getBoundingClientRect(), p = reduce ? 1 : Math.max(0, Math.min(1, (innerHeight * .65 - r.top) / r.height));
      draw.style.strokeDashoffset = len * (1 - p); var pt = draw.getPointAtLength(len * p); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); dot.style.opacity = p > .01 && p < .99 ? 1 : 0;
      cards.forEach(function (c) { var cr = c.getBoundingClientRect(); c.classList.toggle('lit', reduce || (cr.top + cr.height / 2 - r.top) / r.height <= p + .02); }); }
    build(); addEventListener('resize', build); addEventListener('scroll', update, { passive: true }); if (document.fonts) document.fonts.ready.then(build); });

  /* Parallax nas faixas */
  var bands = $$('.band > img');
  if (!reduce && bands.length) addEventListener('scroll', function () { bands.forEach(function (im) { var r = im.parentNode.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; im.style.transform = 'translateY(' + ((r.top + r.height / 2 - innerHeight / 2) * -0.1) + 'px)'; }); }, { passive: true });

  /* Contadores */
  function count(el) { var raw = el.dataset.count, end = parseFloat(raw.replace(',', '.')), dec = (raw.split(',')[1] || '').length, suf = el.dataset.suffix || '', t0 = null;
    if (reduce) { el.textContent = raw + suf; return; }
    requestAnimationFrame(function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1600, 1); el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec).replace('.', ',') + suf; if (p < 1) requestAnimationFrame(step); }); }

  /* Entrada ao rolar */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; e.target.classList.remove('pre'); e.target.classList.add('rv-in'); if (e.target.dataset.count) count(e.target); io.unobserve(e.target); }); }, { rootMargin: '0px 0px -10% 0px' });
    $$('.rv, .clip, .reveal-img').forEach(function (el) { if (!reduce && el.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); el.style.transitionDelay = ((el.dataset.d || 0) * 110) + 'ms'; io.observe(el); } else el.classList.add('rv-in'); });
    $$('[data-count]').forEach(function (el) { io.observe(el); });
  }

  /* Simulador */
  var sim = $('.sim');
  if (sim) { var people = 3, out = $('output', sim), arc = $('.gauge .val', sim), num = $('.gauge text', sim), rec = $('.rec', sim), goB = $('[data-sim-go]', sim), why = $('[data-sim-why]', sim), shownM = 0;
    function calc() { var acts = $$('.acts button[aria-pressed=true]', sim).reduce(function (s, b) { return s + +b.dataset.mbps; }, 0), need = Math.round(people * 22 + acts * (1 + (people - 1) * .22));
      var plan = need <= 250 ? ['start', 'Start', '500 Mega'] : need <= 520 ? ['familia', 'Família', '800 Mega'] : ['ultra', 'Ultra', '1 Giga'];
      out.value = people; arc.style.strokeDashoffset = 100 - Math.min(100, need / 10); rec.innerHTML = 'Vyra <b>' + plan[1] + '</b>';
      why.textContent = 'Sua casa usa cerca de ' + need + ' Mbps nos horários de pico. O ' + plan[1] + ' (' + plan[2] + ') dá conta com folga.';
      goB.setAttribute('href', 'assine.html#' + plan[0]); goB.querySelector('span').textContent = 'Assinar o ' + plan[1];
      var from = shownM, t0 = null; shownM = need; if (reduce) { num.textContent = need; return; }
      requestAnimationFrame(function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 700, 1); num.textContent = Math.round(from + (need - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }); }
    $$('[data-step]', sim).forEach(function (b) { b.addEventListener('click', function () { people = Math.max(1, Math.min(10, people + +b.dataset.step)); calc(); }); });
    $$('.acts button', sim).forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); calc(); }); });
    calc(); }

  /* FAQ: acordeão e busca */
  $$('.acc-item button').forEach(function (b) { b.addEventListener('click', function () { var it = b.closest('.acc-item'), o = !it.classList.contains('open'); it.classList.toggle('open', o); b.setAttribute('aria-expanded', o); }); });
  var sq = $('#faq-search');
  if (sq) sq.addEventListener('input', function () { var norm = function (x) { return x.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); }, q = norm(sq.value), any = false;
    $$('.acc-item').forEach(function (it) { var hit = norm(it.textContent).indexOf(q) > -1; it.hidden = !hit; any = any || hit; }); $('.empty').hidden = any; });

  /* Formulários */
  $$('.fl select').forEach(function (s) { s.closest('.fl').classList.add('sel'); });
  $$('input[data-mask=cep]').forEach(function (i) { i.addEventListener('input', function () { var v = i.value.replace(/\\D/g, '').slice(0, 8); i.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; }); });
  $$('input[data-mask=tel]').forEach(function (i) { i.addEventListener('input', function () { var v = i.value.replace(/\\D/g, '').slice(0, 11); i.value = v.length > 6 ? '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4) : v.length > 2 ? '(' + v.slice(0, 2) + ') ' + v.slice(2) : v; }); });
  // Integre aqui com seu backend, e-mail ou WhatsApp.
  $$('form.form').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); if (!f.checkValidity()) { f.reportValidity(); return; } f.classList.add('sent'); }); });
  $$('form.cep').forEach(function (cep) { cep.addEventListener('submit', function (e) { e.preventDefault(); var v = $('input', cep).value.replace(/\\D/g, ''), out = cep.parentNode.querySelector('.cep-result');
    if (v.length !== 8) { out.textContent = 'Digite os 8 números do CEP.'; return; } out.textContent = 'Boa notícia: temos fibra na sua região. Vamos para a assinatura...'; setTimeout(function () { location.href = 'assine.html#cep-' + v; }, 900); }); });

  /* Assinatura em etapas */
  var wz = $('.wizard form');
  if (wz) { var panels = $$('.wpanel', wz), marks = $$('.wsteps div', wz), cur2 = 0;
    var go2 = function (i) { cur2 = i; panels.forEach(function (p, k) { p.classList.toggle('cur', k === i); }); marks.forEach(function (m, k) { m.classList.toggle('done', k < i); m.classList.toggle('cur', k === i); }); scrollTo({ top: $('.wizard').getBoundingClientRect().top + scrollY - 120, behavior: reduce ? 'auto' : 'smooth' }); };
    var valid = function (p) { var ok = true; $$('input, select', p).forEach(function (i) { if (ok && !i.checkValidity()) { i.reportValidity(); ok = false; } }); return ok; };
    $$('[data-next]', wz).forEach(function (b) { b.addEventListener('click', function () { if (valid(panels[cur2])) go2(cur2 + 1); }); });
    $$('[data-prev]', wz).forEach(function (b) { b.addEventListener('click', function () { go2(cur2 - 1); }); });
    wz.addEventListener('submit', function (e) { e.preventDefault(); if (!valid(panels[cur2])) return; panels.forEach(function (p) { p.classList.remove('cur'); }); marks.forEach(function (m) { m.classList.add('done'); m.classList.remove('cur'); }); $('.done-box').classList.add('on'); });
    var sum = $('.wsum'); var sync = function () { var r = $('input[name=plano]:checked', wz); if (!r) return; $('[data-s=name]', sum).textContent = r.dataset.name; $('[data-s=speed]', sum).innerHTML = r.dataset.speed + '<small>' + r.dataset.unit + '</small>'; $('[data-s=price]', sum).textContent = 'R$ ' + r.dataset.price; $('[data-s=logos]', sum).innerHTML = r.dataset.logos; };
    var h = location.hash.slice(1), pre = h && $('input[name=plano][value="' + h + '"]', wz); if (pre) pre.checked = true;
    var m = h && h.match(/^cep-(\\d{8})$/), ci = document.getElementById('a-cep'); if (m && ci) ci.value = m[1].slice(0, 5) + '-' + m[1].slice(5);
    $$('input[name=plano]', wz).forEach(function (r) { r.addEventListener('change', sync); }); sync(); }

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
`;

// ---------- partes ----------
function chrome(c, page) {
  return `<div class="loader" aria-hidden="true">${logo()}<div class="bar"><i></i></div></div>
<div class="curtain" aria-hidden="true"></div>
<div class="progress" aria-hidden="true"></div>
<header class="hdr">
  <div class="container">
    <a class="brand" href="index.html" aria-label="Vyra, página inicial">${logo()}</a>
    <nav class="nav" aria-label="Principal">${c.basicNav.map(n => `<a href="${n.href}"${n.id === page ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}</nav>
    <div class="right">
      <a class="wa-link" href="${c.contact.whatsappLink}" target="_blank" rel="noopener">${socialIcon('whatsapp')}WhatsApp</a>
      <a class="btn btn-primary sm" href="assine.html" data-magnetic>Assine já ${icon('arrow')}</a>
      <button class="burger" data-menu aria-label="Abrir menu" aria-expanded="false" aria-controls="mmenu">${icon('menu')}</button>
    </div>
  </div>
</header>
<div class="mmenu" id="mmenu">
  <button class="close" data-menu aria-label="Fechar menu" aria-expanded="false">${icon('close')}</button>
  <nav aria-label="Menu">${c.basicNav.map(n => `<a href="${n.href}"${n.id === page ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}<a href="assine.html" style="color:var(--orange-700);font-weight:700">Assine já</a></nav>
  <div class="social light">${socialLinks(c).replace(/^<div class="social">|<\/div>$/g, '')}</div>
</div>`;
}

function footer(c) {
  return `<footer class="foot">
  <div class="container">
    <div class="where">
      <div class="map-box rv">
        <img src="${IMG}mapa_marialva.jpg" alt="Mapa do centro de Marialva, Paraná" loading="lazy">
        <span class="pin" aria-hidden="true"><b>Vyra Fibra</b></span>
        <div class="map-info"><b>Vyra Fibra</b><span>${c.contact.address} · ${c.contact.city}</span><span>${c.contact.hours[0][1]}</span>
          <div class="mbtns"><a href="${MAPS}" target="_blank" rel="noopener">${icon('pin')}Abrir no Maps</a><a class="sq" href="${MAPS}" target="_blank" rel="noopener" aria-label="Como chegar">${icon('arrow')}</a></div></div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="rv" data-d="1">
        <span class="kicker" style="color:var(--peach)">Cobertura</span>
        <h2 style="margin-top:14px">Onde <b>atendemos</b></h2>
        <p>Fibra óptica em Marialva e região, chegando a novas cidades do interior. Confira se a Vyra já está disponível no seu endereço.</p>
        <div class="chips">${c.cities.now.map(x => `<span class="on">${x}</span>`).join('')}${c.cities.soon.map(x => `<span>${x}<small>em breve</small></span>`).join('')}</div>
      </div>
    </div>
    <div class="foot-brand">${logo()}<b>${esc(c.brand.slogan)}</b></div>
    <div class="cols">
      <div><h3>Navegação</h3><ul>${c.basicNav.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}<li><a href="assine.html">Assine já</a></li></ul></div>
      <div><h3>Planos</h3><ul>${c.combos.map(p => `<li><a href="assine.html#${p.id}">${p.name} · ${p.speed} ${p.unit}</a></li>`).join('')}<li><a href="empresas.html">Vyra Empresas</a></li></ul></div>
      <div><h3>Contato</h3><ul><li>WhatsApp: ${c.contact.whatsapp}</li><li>Telefone: ${c.contact.phone}</li><li>${c.contact.email}</li><li>${c.contact.hours[1][0]}: ${c.contact.hours[1][1]}</li></ul></div>
      <div><h3>Redes sociais</h3>${socialLinks(c)}</div>
    </div>
    <div class="bottom"><span>© <span id="year">2026</span> Vyra Fibra. Todos os direitos reservados.</span><span>A Vyra é uma empresa de telecomunicações inscrita no CNPJ 00.000.000/0001-00 com licença SCM da Anatel. [EXEMPLO]</span></div>
  </div>
</footer>
<a class="wa-float" href="${c.contact.whatsappLink}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp" data-cursor="Falar">${socialIcon('whatsapp')}</a>`;
}

const HERO = [
  { img: 'familia_celulares.jpg', alt: 'Família no sofá usando celulares e tablet', tag: 'Plano Família', title: 'A casa inteira *conectada,* sem disputa.', text: '800 Mega de fibra, Wi-Fi 6 mesh e YouTube Premium com Max ou Prime Video.', streams: ['YouTube Premium', 'Max ou Prime Video'], price: '129,90', cta: 'assine.html#familia', thumb: 'Plano Família' },
  { img: 'tv_pai_filho.jpg', alt: 'Pai e filho assistindo TV no sofá', tag: 'Combo completo', title: 'Todos os streamings, *uma* *conta* *só.*', text: '1 Giga com Netflix, Max, Prime Video e YouTube Premium inclusos.', streams: ['Netflix', 'Max', 'Prime Video', 'YouTube Premium'], price: '179,90', cta: 'assine.html#ultra', thumb: 'Combo completo' },
  { img: 'mulher_celular_sofa.jpg', alt: 'Mulher sorrindo com o celular no sofá', tag: 'Incluso em todos', title: 'YouTube Premium *de* *presente.*', text: 'Vídeos sem anúncio e música offline em qualquer plano Vyra.', streams: ['YouTube Premium'], price: '99,90', cta: 'residencial.html', thumb: 'YouTube Premium' },
];

function hero() {
  return `<section class="hero" aria-roledescription="carrossel" aria-label="Ofertas Vyra">
  ${HERO.map((s, i) => `<div class="hslide${i === 0 ? ' on' : ''}" aria-roledescription="slide" aria-label="${i + 1} de ${HERO.length}">
    <div class="himg"><img src="${IMG}${s.img}" alt="${esc(s.alt)}"${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}></div>
    <div class="container"><div class="hcopy">
      <span class="tag"><i></i>${s.tag}</span>
      ${i === 0 ? `<h1>${split(s.title)}</h1>` : `<h2>${split(s.title)}</h2>`}
      <p>${s.text}</p>
      <div class="logos">${streamLogos(s.streams)}</div>
      <div class="actions"><a class="btn btn-primary" href="${s.cta}" data-magnetic data-cursor="Assinar">Assine já ${icon('arrow')}</a><a class="btn btn-ghost" href="#planos" data-magnetic>Ver planos</a></div>
    </div></div>
    <div class="hprice">${logo('logo', '#FF5A1F')}<small>a partir de</small><b>R$ ${s.price}</b><small>por mês · valor de exemplo</small></div>
  </div>`).join('')}
  <a class="scroll-ind" href="#planos"><i></i>Role para descobrir</a>
  <div class="hthumbs">${HERO.map((s, i) => `<button type="button" class="hthumb" aria-current="${i === 0}" aria-label="Ver oferta ${s.thumb}"><img src="${IMG}${s.img}" alt="" loading="lazy"><span>${s.thumb}</span><i></i></button>`).join('')}</div>
</section>`;
}

function logoband(c) {
  const items = [...c.streamings.map(s => `<span class="item">${brandTile(s)}</span>`), '<span class="item">Wi-Fi <b>6</b> incluso</span>', '<span class="item"><b>1 Giga</b> de fibra</span>', '<span class="item">Suporte <b>24h</b></span>', '<span class="item">Instalação <b>grátis</b></span>'];
  const row = items.join('<span class="star"></span>') + '<span class="star"></span>';
  return `<div class="logoband" aria-label="Incluso nos planos"><div class="track">${row}<span aria-hidden="true" style="display:contents">${row}</span></div></div>`;
}

function phero(c, img, alt, title, lead, crumb, price) {
  return `<section class="phero">
  <img src="${IMG}${img}" alt="${esc(alt)}" fetchpriority="high">
  <div class="container"><div class="crumbs"><a href="index.html">Início</a> · ${crumb}</div><h1>${split(title)}</h1><p>${lead}</p></div>
  ${price ? `<div class="hprice">${logo('logo', '#FF5A1F')}<small>planos a partir de</small><b>R$ ${c.combos[0].price}</b><small>por mês · valor de exemplo</small></div>` : ''}
</section>`;
}

function planCard(p, biz, i) {
  const price = p.price ? `<div class="price"><small>R$</small><b>${p.price}</b><small>/mês</small></div>` : '<div class="price"><span class="ask">Sob consulta</span></div>';
  let streams = '';
  if (p.streams) {
    const choice = p.streams.find(s => s.includes(' ou ')), base = p.streams.filter(s => !s.includes(' ou '));
    streams = choice
      ? `<div class="streams"><span>Streaming incluso · escolha 1</span><div class="logos">${streamLogos([...base, choice.split(' ou ')[0]])}</div><div class="choose" role="group" aria-label="Escolha o streaming">${choice.split(' ou ').map((o, k) => `<button type="button" aria-pressed="${k === 0}" data-logos='${attr(streamLogos([...base, o]))}'>${o}</button>`).join('')}</div></div>`
      : `<div class="streams"><span>Streaming incluso</span><div class="logos">${streamLogos(p.streams)}</div></div>`;
  }
  return `<article class="plan rv${p.featured ? ' featured' : ''}" data-d="${i}">
    ${p.featured ? `<span class="badge">${p.tag}</span>` : `<span class="tag">${p.tag}</span>`}
    <div class="ph">${logo('logo', p.featured ? '#FF5A1F' : '#E11D2E')}<b>${shortName(p)}</b></div>
    <div class="speed">${p.speed}<small>${p.unit}</small></div>
    ${streams}
    <ul>${p.features.map(x => `<li>${icon('check')}${x}</li>`).join('')}</ul>
    ${price}
    <a class="btn ${p.featured ? 'btn-primary' : 'btn-line'}" href="${biz ? 'empresas.html#proposta' : 'assine.html#' + p.id}" data-cursor="${biz ? 'Proposta' : 'Assinar'}">${biz ? (p.price ? 'Contratar' : 'Pedir proposta') : 'Quero esse'} ${icon('arrow')}</a>
  </article>`;
}

function plansTabs(c) {
  return `<section class="section soft" id="planos"><div class="container">
    <div class="head center rv"><span class="kicker">Planos</span><h2>Escolha o seu <em>plano Vyra</em></h2><p>Fibra óptica até a sua casa, com Wi-Fi 6 e os streamings que você já ama.</p></div>
    <div style="text-align:center"><div class="ptabs" role="tablist" aria-label="Tipo de plano"><span class="pill" aria-hidden="true"></span>
      <button role="tab" aria-selected="true" aria-controls="tab-res" id="t-res">Residencial</button><button role="tab" aria-selected="false" aria-controls="tab-biz" id="t-biz">Empresas</button></div></div>
    <div class="tab-panel" id="tab-res" role="tabpanel" aria-labelledby="t-res"><div class="plans">${c.combos.map((p, i) => planCard(p, false, i)).join('')}</div></div>
    <div class="tab-panel" id="tab-biz" role="tabpanel" aria-labelledby="t-biz" hidden><div class="plans">${c.businessPlans.map((p, i) => planCard(p, true, i)).join('')}</div></div>
    <p class="note">Valores de exemplo. Streamings sujeitos a parceria e às regras de cada serviço; as marcas pertencem aos seus donos.</p>
  </div></section>`;
}

function rowPlans(c) {
  return `<section class="section soft" id="planos"><div class="container">
    <div class="head center rv"><span class="kicker">Planos residenciais</span><h2>Fibra com <em>streaming incluso</em></h2><p>Escolha a velocidade ideal. Todos com Wi-Fi 6 e instalação grátis.</p></div>
    <div class="prows">${c.combos.map((p, i) => `<article class="prow rv${p.featured ? ' featured' : ''}" data-d="${i}">
      <div>${p.featured ? `<span class="badge">${p.tag}</span>` : ''}<div class="ph">${logo('logo', p.featured ? '#FF5A1F' : '#E11D2E')}<b>${shortName(p)}</b></div><div class="speed">${p.speed}<small>${p.unit}</small></div></div>
      <div class="mid"><div class="logos">${streamLogos(p.streams)}</div><ul>${p.features.map(x => `<li>${icon('check')}${x}</li>`).join('')}</ul></div>
      <div class="side"><div class="price"><small>R$ </small><b>${p.price}</b><small>/mês</small></div><a class="btn ${p.featured ? 'btn-primary' : 'btn-line'}" href="assine.html#${p.id}" data-cursor="Assinar">Quero o ${shortName(p)} ${icon('arrow')}</a></div>
    </article>`).join('')}</div>
    <p class="note">Valores de exemplo. Streamings sujeitos a parceria; as marcas pertencem aos seus donos.</p>
  </div></section>`;
}

function bizPlans(c) {
  return `<section class="section dark" id="planos"><div class="container">
    <div class="head center rv"><span class="kicker">Planos empresariais</span><h2>Planos <em>Vyra Empresas</em></h2><p>IP fixo, SLA em contrato e um gerente que conhece a sua operação.</p></div>
    <div class="bplans">${c.businessPlans.map((p, i) => `<article class="bplan rv${p.featured ? ' featured' : ''}" data-d="${i}" data-tilt>
      ${p.featured ? `<span class="badge">${p.tag}</span>` : ''}<span class="tag">${p.featured ? 'Empresas' : p.tag}</span>
      <span class="name">${p.name}</span><div class="speed">${p.speed}<small>${p.unit}</small></div>
      <ul>${p.features.map(x => `<li>${icon('check')}${x}</li>`).join('')}</ul>
      <div class="price">${p.price ? `<small>R$ </small><b>${p.price}</b><small>/mês</small>` : '<span class="ask">Sob consulta</span>'}</div>
      <a class="btn ${p.featured ? 'btn-primary' : 'btn-light'}" href="#proposta" data-cursor="Proposta">${p.price ? 'Contratar' : 'Pedir proposta'} ${icon('arrow')}</a>
    </article>`).join('')}</div>
    <p class="note">Valores de exemplo. Planos empresariais com contrato e nota fiscal.</p>
  </div></section>`;
}

function hotspots(c) {
  const pts = [
    [16, 28, 'wifi', 'Wi-Fi 6 mesh', 'Pontos de acesso que cobrem a casa toda, do quarto à varanda.'],
    [50, 62, 'home', 'Todo mundo conectado', 'Cada pessoa no seu aparelho, sem uma travar a outra.'],
    [57, 36, 'shield', 'Controle dos pais', 'Defina horários e filtre conteúdo das crianças pelo app.', true],
    [82, 26, 'headset', 'Suporte 24 horas', 'Técnicos da região por WhatsApp, telefone ou visita.'],
    [74, 70, 'fiber', 'Streaming incluso', 'Seus serviços favoritos já na conta da internet.', false, true],
  ];
  return `<section class="section dark"><div class="container">
    <div class="head center rv"><span class="kicker">Experiência Vyra</span><h2>Toque nos pontos e veja <em>o que muda em casa</em></h2></div>
    <div class="hs-wrap clip">
      <img src="${IMG}familia_sofa.jpg" alt="Família sorrindo no sofá de casa" loading="lazy">
      ${pts.map(p => `<button type="button" class="hs${p[1] < 40 ? ' below' : ''}" style="left:${p[0]}%;top:${p[1]}%" aria-expanded="false" aria-label="${p[3]}">${icon('plus')}<span class="tip"><b>${p[3]}</b><span>${p[4]}</span>${p[6] ? `<div class="logos">${streamLogos(c.streamings)}</div>` : ''}</span></button>`).join('')}
    </div>
    <div class="hs-legend rv">${pts.map(p => `<span>${p[3]}</span>`).join('')}</div>
  </div></section>`;
}

function beforeAfter() {
  return `<section class="section"><div class="container split">
    <div class="copy-block rv rv-l"><span class="kicker">Arraste e compare</span><h2>Internet comum <em>×</em> <b>fibra Vyra</b></h2>
      <p>Na internet comum, o vídeo trava justo no horário de pico. Com a fibra Vyra, a imagem chega em 4K, sem carregar, mesmo com a casa cheia.</p>
      <div class="counters light"><div><b data-count="4" data-suffix="K">4K</b><span>sem travar</span></div><div><b data-count="4" data-suffix=" ms">4 ms</b><span>de latência média*</span></div></div>
      <small style="color:var(--muted)">* Valor de exemplo, medido na rede da Vyra.</small>
    </div>
    <div class="ba rv rv-r" data-cursor="Arraste">
      <img src="${IMG}tv_pai_filho.jpg" alt="Pai e filho assistindo TV com imagem nítida" loading="lazy">
      <div class="before"><img src="${IMG}tv_pai_filho.jpg" alt="" loading="lazy"></div>
      <div class="buffer"><i></i>Carregando...</div>
      <span class="lbl l">Internet comum</span><span class="lbl r">Fibra Vyra</span>
      <div class="handle"><span></span></div>
      <input type="range" min="0" max="100" value="50" aria-label="Comparar internet comum e fibra Vyra">
    </div>
  </div></section>`;
}

function hgallery() {
  const items = [
    ['amigas_mesa.jpg', 'Amigas rindo com o celular', 'Amigos', 'Vídeo e chamada sem travar', 'Todo mundo postando ao mesmo tempo.'],
    ['gamer_sofa.jpg', 'Jovem jogando videogame', 'Games', 'Jogos sem lag', 'Baixa latência para jogar online.'],
    ['mulher_videochamada.jpg', 'Mulher em videochamada', 'Home office', 'Reunião que não cai', 'Upload rápido e conexão estável.'],
    ['idosa_celular.jpg', 'Senhora usando o celular', 'Família', 'Para todas as idades', 'Simples, com suporte que explica.'],
    ['mae_tablet.jpg', 'Mãe com bebês e tablet', 'Crianças', 'Desenhos e aulas online', 'Com controle dos pais no app.'],
    ['homem_escritorio.jpg', 'Homem trabalhando no notebook', 'Negócios', 'Sua empresa online', 'Maquininha e sistema sem parar.'],
  ];
  return `<section class="hgal"><div class="hgal-sticky">
    <div class="container"><div class="head rv" style="margin:0"><span class="kicker">Para cada momento</span><h2>Uma conexão, <em>mil momentos.</em></h2></div></div>
    <div class="hgal-track">${items.map((g, i) => `<div class="hcard"><img src="${IMG}${g[0]}" alt="${g[1]}" loading="lazy"><span class="num">0${i + 1}</span><div class="cap"><small>${g[2]}</small><b>${g[3]}</b><span>${g[4]}</span></div></div>`).join('')}</div>
  </div></section>`;
}

function scatter(c) {
  const cards = [
    ['wifi', 'Wi-Fi 6 incluso', 'Sinal forte em toda a casa.'],
    ['headset', 'Suporte local 24h', 'Gente da região atende.'],
    ['calendar', 'Instalação grátis', 'No dia que você escolher.'],
    ['fiber', '100% fibra óptica', 'Do poste até o roteador.'],
    ['shield', 'Sem letra miúda', 'A velocidade contratada é a entregue.'],
  ];
  return `<section class="section soft"><div class="container">
    <div class="head center rv"><span class="kicker">Por que a Vyra</span><h2>Tudo o que a sua casa <em>precisa</em></h2><p>Tecnologia de capital com atendimento de quem conhece a sua cidade.</p></div>
    <div class="scatter">
      <span class="ring" aria-hidden="true"></span>
      <div class="photo-c reveal-img"><img src="${IMG}familia_sofa.jpg" alt="Família sorrindo no sofá" loading="lazy"></div>
      ${cards.map((k, i) => `<div class="fcard f${i + 1}"><div class="ico-box">${duo(k[0])}</div><b>${k[1]}</b><span>${k[2]}</span></div>`).join('')}
      <div class="fcard f6 logo-card"><b>Streaming na conta</b><div class="logos">${streamLogos(c.streamings)}</div></div>
    </div>
  </div></section>`;
}

function coverflow(c) {
  const ini = w => w.replace(/^(Dona|Seu) /, '').split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();
  return `<section class="section dark"><div class="container cf-wrap">
    <div class="head center rv"><span class="kicker">Avaliações</span><h2>Quem é Vyra <em>recomenda</em></h2><p>Avaliações de exemplo, para substituir por relatos reais de clientes.</p></div>
    <div class="cf">${c.reviews.map(r => `<blockquote class="cf-card"><div class="stars" aria-label="5 estrelas">★★★★★</div><p>“${r.text}”</p><footer><span class="avatar">${ini(r.name)}</span><div><b>${r.name}</b>${r.where}</div><span class="plan-tag">${r.plan}</span></footer></blockquote>`).join('')}</div>
    <div class="cf-nav"><button type="button" class="arr prev" aria-label="Anterior">${icon('arrow')}</button><div class="cf-dots">${c.reviews.map((r, i) => `<button type="button" aria-label="Avaliação ${i + 1}"></button>`).join('')}</div><button type="button" class="arr next" aria-label="Próxima">${icon('arrow')}</button></div>
  </div></section>`;
}

function bizBand() {
  return `<section class="band"><img src="${IMG}reuniao_laptop.jpg" alt="Equipe reunida olhando um notebook" loading="lazy">
  <div class="container"><span class="kicker">Vyra Empresas</span><h2>Internet empresarial <em>que não para.</em></h2>
    <p>Link dedicado, IP fixo, SLA em contrato e um gerente de conta que conhece a sua operação.</p>
    <div class="counters"><div><b data-count="99,9" data-suffix="%">99,9%</b><span>de disponibilidade (meta)</span></div><div><b data-count="4" data-suffix="h">4h</b><span>SLA no link dedicado</span></div><div><b data-count="24" data-suffix="/7">24/7</b><span>monitoramento</span></div></div>
    <a class="btn btn-light" href="empresas.html" data-magnetic>Conhecer planos empresariais ${icon('arrow')}</a></div></section>`;
}

function finalCta() {
  return `<section class="band fire"><img src="${IMG}fibra.jpg" alt="" loading="lazy">${logo('watermark', 'rgba(255,255,255,.12)')}
  <div class="container"><h2>Pronto para navegar <em>em outro nível?</em></h2><p>Consulte a cobertura na sua rua e contrate hoje mesmo.</p>
    <form class="cep" novalidate><label class="sr" for="cep-final">CEP</label><input id="cep-final" inputmode="numeric" placeholder="Digite seu CEP" data-mask="cep" required><button class="btn btn-light" type="submit" data-cursor="Consultar">Consultar cobertura</button></form>
    <div class="cep-result" role="status" aria-live="polite"></div></div></section>`;
}

function simulator() {
  return `<section class="section"><div class="container">
    <div class="head rv"><span class="kicker">Simulador</span><h2>Quanta internet <em>a sua casa precisa?</em></h2></div>
    <div class="sim">
      <div class="sim-panel rv rv-l">
        <div style="display:grid;gap:14px"><h3>Pessoas em casa</h3><div class="stepper"><button type="button" data-step="-1" aria-label="Menos uma pessoa">−</button><output aria-live="polite">3</output><button type="button" data-step="1" aria-label="Mais uma pessoa">+</button><span>pessoas</span></div></div>
        <div style="display:grid;gap:14px"><h3>O que vocês fazem online</h3><div class="acts">
          <button type="button" aria-pressed="true" data-mbps="35">Home office</button><button type="button" aria-pressed="true" data-mbps="45">Streaming 4K</button>
          <button type="button" aria-pressed="false" data-mbps="40">Games online</button><button type="button" aria-pressed="false" data-mbps="20">Aulas online</button>
          <button type="button" aria-pressed="false" data-mbps="25">Câmeras</button><button type="button" aria-pressed="false" data-mbps="10">Casa inteligente</button></div></div>
      </div>
      <div class="result rv rv-r">
        <span class="kicker" style="color:var(--peach)">Recomendação</span>
        <svg class="gauge" viewBox="0 0 200 130" aria-hidden="true"><defs><linearGradient id="gaugegrad" x1="0" x2="1"><stop offset="0" stop-color="#FF7A3D"/><stop offset="1" stop-color="#E11D2E"/></linearGradient></defs>
          <path class="track" d="M20 115 A80 80 0 0 1 180 115" fill="none" stroke-width="12" stroke-linecap="round" pathLength="100"/>
          <path class="val" d="M20 115 A80 80 0 0 1 180 115" fill="none" stroke-width="12" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
          <text x="100" y="100" text-anchor="middle" font-size="44" font-weight="300">0</text><text x="100" y="124" text-anchor="middle" font-size="11" style="fill:rgba(255,255,255,.6)">Mbps no pico</text></svg>
        <div class="rec" aria-live="polite">Vyra <b>Família</b></div><p data-sim-why></p>
        <a class="btn btn-primary" href="assine.html#familia" data-sim-go data-cursor="Assinar"><span>Assinar o Família</span>${icon('arrow')}</a>
      </div>
    </div>
  </div></section>`;
}

function compare(c) {
  const ids = c.combos.map(p => p.id);
  const cell = v => v === true ? `<span class="yes" aria-label="Sim">${icon('check')}</span>` : v === false ? '<span class="no" aria-label="Não">—</span>' : Array.isArray(v) ? `<div class="logos">${streamLogos(v)}</div>` : v;
  return `<section class="section soft"><div class="container">
    <div class="head center rv"><span class="kicker">Comparativo</span><h2>Compare os planos <em>lado a lado</em></h2></div>
    <div class="compare-wrap rv"><table class="compare">
      <thead><tr><th scope="col">O que vem<br>no plano</th>${c.combos.map(p => `<th scope="col"${p.featured ? ' class="feat"' : ''}><div class="colh">${logo('logo', p.featured ? '#FF5A1F' : '#E11D2E')}<b>${shortName(p)}</b><span>${p.tag}</span></div></th>`).join('')}</tr></thead>
      <tbody>${COMPARE.map(([l, v]) => `<tr><th scope="row">${l}</th>${ids.map((id, k) => `<td${c.combos[k].featured ? ' class="feat"' : ''}>${cell(v[id])}</td>`).join('')}</tr>`).join('')}
        <tr><th scope="row">Mensalidade</th>${c.combos.map(p => `<td class="pr${p.featured ? ' feat' : ''}"><small>R$ </small><b>${p.price}</b><small>/mês</small></td>`).join('')}</tr></tbody>
      <tfoot><tr><td></td>${c.combos.map(p => `<td${p.featured ? ' class="feat"' : ''}><a class="btn ${p.featured ? 'btn-primary' : 'btn-line'}" href="assine.html#${p.id}">Assinar ${shortName(p)}</a></td>`).join('')}</tr></tfoot>
    </table></div>
  </div></section>`;
}

function profiles() {
  const P = (img, alt, t, d, href, plan) => `<a class="profile rv" href="${href}" data-cursor="Ver plano"><img src="${IMG}${img}" alt="${alt}" loading="lazy"><div><h3>${t}</h3><p>${d}</p><span class="go">${plan} →</span></div></a>`;
  return `<section class="section"><div class="container">
    <div class="head rv"><span class="kicker">Para cada casa</span><h2>Qual plano é <em>a sua cara?</em></h2></div>
    <div class="profiles">
      ${P('familia_celulares.jpg', 'Família usando celulares e tablet', 'Família conectada', 'Várias telas ao mesmo tempo, sem briga pelo Wi-Fi.', 'assine.html#familia', 'Vyra Família')}
      ${P('gamer_sofa.jpg', 'Jovem jogando videogame', 'Gamer', '1 Giga e baixa latência.', 'assine.html#ultra', 'Vyra Ultra')}
      ${P('mulher_videochamada.jpg', 'Mulher em videochamada', 'Home office', 'Reunião estável e upload rápido.', 'assine.html#familia', 'Vyra Família')}
      ${P('mae_tablet.jpg', 'Mãe com bebês e tablet', 'Crianças em casa', 'Desenhos e aulas com controle dos pais.', 'assine.html#start', 'Vyra Start')}
      ${P('amigas_cafe.jpg', 'Amigas olhando o celular', 'Quem mora sozinho', 'O essencial com YouTube Premium.', 'assine.html#start', 'Vyra Start')}
    </div>
  </div></section>`;
}

function streamingSplit(c) {
  return `<section class="section dark"><div class="container split">
    <div class="media rv rv-l" data-tilt><img src="${IMG}tv_pai_filho.jpg" alt="Pai e filho assistindo TV" loading="lazy"><span class="vbug tl">${logo()}</span><div class="float"><b>4K</b><span>sem travar,<br>no horário de pico</span></div></div>
    <div class="copy-block rv rv-r"><span class="kicker">Internet + streaming</span><h2>Seus streamings favoritos <em>na conta da internet.</em></h2>
      <p>YouTube Premium em qualquer plano. No Família, você escolhe mais um. No Ultra, leva todos, numa fatura só.</p>
      <div class="logos lg">${streamLogos(c.streamings)}</div>
      <a class="btn btn-primary" href="#planos" data-magnetic>Comparar planos ${icon('arrow')}</a></div>
  </div></section>`;
}

function manifesto(text) {
  return text.split(' ').map(w => /\*/.test(w) ? `<span class="mw g">${w.replace(/\*/g, '')}</span>` : `<span class="mw">${w}</span>`).join(' ');
}

function faqFull(c) {
  return `<section class="section"><div class="container faq-2">
    <div class="faq-side rv rv-l">
      <div class="media"><img src="${IMG}mulher_ligacao.jpg" alt="Atendente sorrindo ao telefone" loading="lazy"><span class="vbug tr">${logo()}</span><div class="float"><b>24h</b><span>suporte por<br>gente de verdade</span></div></div>
      <a class="btn btn-primary" href="${c.contact.whatsappLink}" target="_blank" rel="noopener" data-magnetic>${socialIcon('whatsapp')}Chamar no WhatsApp</a>
    </div>
    <div class="rv rv-r">
      <div class="faq-top"><span class="kicker">${c.faq.length} perguntas</span><label class="search" for="faq-search"><span class="sr">Buscar pergunta</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="faq-search" type="search" placeholder="Buscar: instalação, Wi-Fi, streaming..."></label></div>
      <div class="acc">${c.faq.map((f, i) => `<div class="acc-item"><button aria-expanded="false" aria-controls="q${i}">${f.q}<span class="pm">${icon('plus')}</span></button><div class="acc-body" id="q${i}"><div><p>${f.a}</p></div></div></div>`).join('')}</div>
      <p class="empty" hidden>Nenhuma pergunta encontrada. Fale com a gente pelo WhatsApp ${c.contact.whatsapp}.</p>
    </div>
  </div></section>`;
}

function channels(c) {
  return `<div class="channels">
    <a class="channel" href="${c.contact.whatsappLink}" target="_blank" rel="noopener" data-cursor="Abrir"><span class="ib">${socialIcon('whatsapp')}</span><div><b>WhatsApp · mais rápido</b><span>${c.contact.whatsapp}</span></div></a>
    <div class="channel"><span class="ib">${icon('phone')}</span><div><b>Telefone</b><span>${c.contact.phone}</span></div></div>
    <div class="channel"><span class="ib">${icon('mail')}</span><div><b>E-mail</b><span>${c.contact.email}</span></div></div>
    <a class="channel" href="${MAPS}" target="_blank" rel="noopener" data-cursor="Mapa"><span class="ib">${icon('pin')}</span><div><b>Endereço</b><span>${c.contact.address} · ${c.contact.city}</span></div></a>
    <div class="channel"><span class="ib">${icon('clock')}</span><div>${c.contact.hours.map(h => `<b>${h[0]}</b><span>${h[1]}</span>`).join('<br>')}</div></div>
  </div>`;
}

function contactForm(biz) {
  return `<form class="form form-card" novalidate>
    <div class="grid2"><label class="fl"><input id="c-nome" placeholder=" " autocomplete="name" required><span>Seu nome</span></label><label class="fl"><input id="c-tel" placeholder=" " inputmode="tel" data-mask="tel" required><span>WhatsApp</span></label></div>
    ${biz ? `<div class="grid2"><label class="fl"><input id="c-emp" placeholder=" " autocomplete="organization" required><span>Empresa</span></label><label class="fl"><input id="c-cnpj" placeholder=" " inputmode="numeric"><span>CNPJ</span></label></div>` : ''}
    <label class="fl"><input id="c-email" type="email" placeholder=" " autocomplete="email" required><span>E-mail</span></label>
    <label class="fl"><select id="c-assunto">${biz ? '<option>Proposta de link dedicado</option><option>Plano Empresa 400</option><option>Plano Empresa 800</option><option>Outro</option>' : '<option>Quero contratar</option><option>Proposta para empresa</option><option>Suporte técnico</option><option>Financeiro</option><option>Outro</option>'}</select><span>Assunto</span></label>
    <label class="fl"><textarea id="c-msg" placeholder=" " required></textarea><span>Mensagem</span></label>
    <div><button class="btn btn-primary" type="submit" data-magnetic>${biz ? 'Pedir proposta' : 'Enviar mensagem'} ${icon('arrow')}</button></div>
    <div class="ok" role="status">${icon('check')}${biz ? 'Pedido recebido. Um consultor fala com você em breve.' : 'Mensagem enviada. Respondemos em breve.'}</div>
  </form>`;
}

function pathSection(items, kicker, title) {
  return `<section class="section dark"><div class="container">
    <div class="head center rv"><span class="kicker">${kicker}</span><h2>${title}</h2></div>
    <div class="path"><svg class="line" aria-hidden="true"><defs><linearGradient id="pathgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A3D"/><stop offset="1" stop-color="#E11D2E"/></linearGradient></defs><path class="track"/><path class="draw"/><circle class="head-dot" r="8" cx="-20" cy="-20"/></svg>
      ${items.map(it => `<div class="pcard"><div class="ico-box">${duo(it.icon)}</div><h3>${it.title}</h3><p>${it.text}</p></div>`).join('')}</div>
  </div></section>`;
}

// ---------- páginas ----------
const pages = {
  index: c => `${chrome(c, 'index')}
<main>
  ${hero()}
  ${logoband(c)}
  ${plansTabs(c)}
  ${hotspots(c)}
  ${beforeAfter()}
  ${hgallery()}
  ${scatter(c)}
  ${coverflow(c)}
  ${bizBand()}
  ${finalCta()}
</main>
${footer(c)}`,

  sobre: c => `${chrome(c, 'sobre')}
<main>
  ${phero(c, 'familia_sofa.jpg', 'Família sorrindo no sofá', 'Feita no interior, *para* *o* *interior.*', c.about.intro, 'Sobre nós')}
  <section class="section manifesto"><div class="container"><span class="kicker" style="margin-bottom:34px">Manifesto</span>
    <p>${manifesto('Por muito tempo o interior ficou com o que sobrava. A Vyra existe para mudar isso: *fibra* *de* *verdade,* *gente* *de* *perto.*')}</p></div></section>
  <section class="section soft"><div class="container split">
    <div class="media rv rv-l" data-tilt><img src="${IMG}mulher_ligacao.jpg" alt="Atendente sorrindo ao telefone" loading="lazy"><span class="vbug tl">${logo()}</span><div class="float"><b>24h</b><span>suporte por gente<br>da região</span></div></div>
    <div class="copy-block rv rv-r"><span class="kicker">Nossa história</span><h2>Gente de perto, <em>fibra de verdade.</em></h2>${c.about.story.map(p => `<p>${p}</p>`).join('')}
      <div class="counters light"><div><b data-count="100" data-suffix="%">100%</b><span>fibra óptica</span></div><div><b data-count="24" data-suffix="h">24h</b><span>de suporte</span></div><div><b data-count="1" data-suffix=" Giga">1 Giga</b><span>velocidade máxima</span></div></div></div>
  </div></section>
  ${pathSection([{ icon: 'fiber', title: 'Missão', text: c.about.mission }, { icon: 'home', title: 'Visão', text: c.about.vision }, { icon: 'shield', title: 'Valores', text: c.about.valuesText }], 'O que nos move', 'Missão, visão <em>e valores</em>')}
</main>
${footer(c)}`,

  residencial: c => `${chrome(c, 'residencial')}
<main>
  ${phero(c, 'gamer_sofa.jpg', 'Jovem jogando videogame no sofá', 'Internet residencial *com* *streaming.*', 'Planos de 500 Mega a 1 Giga com YouTube Premium incluso, Wi-Fi 6 e instalação grátis.', 'Residencial', true)}
  ${rowPlans(c)}
  ${simulator()}
  ${compare(c)}
  ${streamingSplit(c)}
  ${profiles()}
</main>
${footer(c)}`,

  empresas: c => `${chrome(c, 'empresas')}
<main>
  ${phero(c, 'reuniao_laptop.jpg', 'Equipe reunida olhando um notebook', 'Sua operação *não* *para.*', 'IP fixo, link dedicado e SLA em contrato para comércio, clínicas, indústria e agro.', 'Empresas')}
  ${bizPlans(c)}
  <section class="section"><div class="container split">
    <div class="media rv rv-l" data-tilt><img src="${IMG}homem_escritorio.jpg" alt="Homem sorrindo trabalhando no notebook" loading="lazy"><span class="vbug tl">${logo()}</span><div class="float"><b>SLA</b><span>tempo de reparo<br>garantido em contrato</span></div></div>
    <div class="copy-block rv rv-r"><span class="kicker">Para o seu negócio</span><h2>Conexão de empresa, <em>atendimento de vizinho.</em></h2>
      <p>Maquininha, sistema na nuvem, câmeras e nota fiscal dependem da internet. A Vyra cuida para que nada disso pare.</p>
      <div class="checklist">${c.business.map(b => `<div><span class="ck">${icon('check')}</span><b>${b.title}</b><span>${b.text}</span></div>`).join('')}</div></div>
  </div></section>
  <section class="band"><img src="${IMG}equipe_laptop.jpg" alt="Equipe trabalhando com notebooks" loading="lazy">
    <div class="container"><span class="kicker">Garantia em contrato</span><h2>Se cair, <em>a prioridade é sua.</em></h2><p>Monitoramento 24 horas, gerente de conta e técnicos da região prontos para ir até você.</p>
      <div class="counters"><div><b data-count="99,9" data-suffix="%">99,9%</b><span>de disponibilidade (meta)</span></div><div><b data-count="4" data-suffix="h">4h</b><span>SLA no link dedicado</span></div><div><b data-count="24" data-suffix="/7">24/7</b><span>monitoramento</span></div></div></div></section>
  <section class="section soft" id="proposta"><div class="container contact">
    <div style="display:grid;gap:22px"><div class="head rv" style="margin:0"><span class="kicker">Proposta</span><h2>Peça uma proposta <em>sob medida.</em></h2><p>Um consultor responde em até 1 dia útil.</p></div><div class="rv">${contactForm(true)}</div></div>
    <div class="rv" data-d="1">${channels(c)}</div>
  </div></section>
</main>
${footer(c)}`,

  faq: c => `${chrome(c, 'faq')}
<main>
  ${phero(c, 'amigas_cafe.jpg', 'Duas amigas olhando o celular num café', 'Perguntas *frequentes.*', 'Respostas rápidas sobre instalação, planos, streaming e suporte.', 'FAQ')}
  ${faqFull(c)}
</main>
${footer(c)}`,

  contato: c => `${chrome(c, 'contato')}
<main>
  ${phero(c, 'mulher_aceno.jpg', 'Mulher acenando numa videochamada', 'Vamos *conversar.*', 'Tire dúvidas, peça uma proposta ou fale com o suporte. Gente da região responde.', 'Contato')}
  <section class="section"><div class="container contact">
    <div style="display:grid;gap:22px"><div class="head rv" style="margin:0"><span class="kicker">Mensagem</span><h2>Envie sua <em>mensagem</em></h2></div><div class="rv">${contactForm(false)}</div></div>
    <div class="rv" data-d="1">${channels(c)}<div style="margin-top:22px">${socialLinks(c).replace('class="social"', 'class="social light"')}</div></div>
  </div></section>
</main>
${footer(c)}`,

  assine: c => `${chrome(c, 'assine')}
<main>
  ${phero(c, 'mulher_celular_sofa.jpg', 'Mulher sorrindo com o celular no sofá', 'Sua fibra *começa* *aqui.*', 'Três passos rápidos. A gente confirma a cobertura e agenda a instalação com você.', 'Assine já')}
  <section class="section soft" id="planos"><div class="container wizard">
    <form novalidate>
      <div class="wsteps" aria-hidden="true"><div class="cur">01 · Plano</div><div>02 · Endereço</div><div>03 · Seus dados</div></div>
      <fieldset class="wpanel cur"><legend class="sr">Escolha o plano</legend><h2>Escolha o <em>plano</em></h2>
        <div class="pick">${c.combos.map(p => `<label data-cursor="Escolher"><input type="radio" name="plano" value="${p.id}" data-name="${p.name}" data-speed="${p.speed}" data-unit="${p.unit}" data-price="${p.price}" data-logos='${attr(streamLogos(p.streams))}'${p.featured ? ' checked' : ''} required><span class="radio"></span><b>${p.speed} ${p.unit}<small>${p.name}</small></b><em>R$ ${p.price}</em></label>`).join('')}</div>
        <div class="wnav"><button class="btn btn-primary" type="button" data-next>Continuar ${icon('arrow')}</button></div></fieldset>
      <fieldset class="wpanel"><legend class="sr">Endereço</legend><h2>Onde vamos <em>instalar?</em></h2>
        <div class="grid2"><label class="fl"><input id="a-cep" placeholder=" " inputmode="numeric" data-mask="cep" required><span>CEP</span></label><label class="fl"><input id="a-num" placeholder=" " required><span>Número</span></label></div>
        <label class="fl"><input id="a-rua" placeholder=" " required><span>Rua</span></label>
        <div class="grid2"><label class="fl"><input id="a-bairro" placeholder=" " required><span>Bairro</span></label><label class="fl"><select id="a-periodo"><option>Manhã</option><option>Tarde</option><option>Sábado</option></select><span>Melhor período</span></label></div>
        <div class="wnav"><button class="btn btn-line" type="button" data-prev>Voltar</button><button class="btn btn-primary" type="button" data-next>Continuar ${icon('arrow')}</button></div></fieldset>
      <fieldset class="wpanel"><legend class="sr">Seus dados</legend><h2>Agora, <em>sobre você</em></h2>
        <div class="grid2"><label class="fl"><input id="a-nome" placeholder=" " autocomplete="name" required><span>Nome completo</span></label><label class="fl"><input id="a-cpf" placeholder=" " inputmode="numeric" required><span>CPF</span></label>
        <label class="fl"><input id="a-tel" placeholder=" " inputmode="tel" data-mask="tel" required><span>WhatsApp</span></label><label class="fl"><input id="a-email" type="email" placeholder=" " required><span>E-mail</span></label></div>
        <div class="wnav"><button class="btn btn-line" type="button" data-prev>Voltar</button><button class="btn btn-primary" type="submit" data-cursor="Enviar">Enviar pedido ${icon('arrow')}</button></div></fieldset>
      <div class="done-box" role="status"><svg class="check-anim" width="90" height="90" viewBox="0 0 64 64" fill="none" stroke="#FF5A1F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="32" cy="32" r="29"/><path d="M20 33l8 8 16-17"/></svg>
        <h2>Pedido <em>recebido.</em></h2><p style="color:var(--muted);font-size:18px">Vamos confirmar a cobertura e falar com você pelo WhatsApp.</p><a class="btn btn-line" href="index.html">Voltar ao início</a></div>
    </form>
    <aside class="wsum" aria-live="polite">${logo('logo', '#FF5A1F')}<span data-s="name" style="font:600 20px var(--f-display)">Vyra Família</span><div class="sp" data-s="speed">800<small>Mega</small></div><div class="logos" data-s="logos"></div>
      <div class="line"><span>Mensalidade</span><b data-s="price">R$ 129,90</b></div><div class="line"><span>Instalação</span><b>Grátis</b></div><div class="line"><span>Wi-Fi 6</span><b>Incluso</b></div><div class="line"><span>Suporte</span><b>24 horas</b></div></aside>
  </div></section>
</main>
${footer(c)}`,
};

function build(c) {
  const out = {};
  for (const [id, fn] of Object.entries(pages)) out[id + '.html'] = shell({ c, page: id, fonts: FONTS, body: fn(c), head: headScript });
  return { pages: out, css, js };
}
module.exports = { build };
