// MODELO INTERMEDIÁRIO — vende mais que o Básico: palco de ofertas com abas, comparativo de planos,
// cards flutuantes em volta de foto, linha que se desenha com a rolagem (só em pontos-chave),
// galeria arrastável, contadores e mapa no rodapé. Ordem de toda página: imagem → planos → restante.
const { DUO_CSS, logo, icon, duo, socialIcon, socialLinks, esc, shell } = require('./helpers');
const { brandTile, streamLogos } = require('./basico');

const FONTS = 'family=Outfit:wght@500;600;700;800&family=Manrope:wght@400;500;600;700';
const IMG = 'assets/img/';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=Marialva%2C+PR';

// Linhas do comparativo residencial [EXEMPLO]
const COMPARE = [
  ['Download', { start: '500 Mega', familia: '800 Mega', ultra: '1 Giga' }],
  ['Upload', { start: '250 Mega', familia: '400 Mega', ultra: '500 Mega' }],
  ['Wi-Fi', { start: 'Wi-Fi 6', familia: 'Wi-Fi 6 + 1 ponto mesh', ultra: 'Wi-Fi 6 mesh (2 pontos)' }],
  ['Streaming incluso', { start: ['YouTube Premium'], familia: ['YouTube Premium', 'Max ou Prime Video'], ultra: ['YouTube Premium', 'Netflix', 'Max', 'Prime Video'] }],
  ['Instalação', { start: 'Grátis, agendada', familia: 'Grátis, em até 48h', ultra: 'Grátis, em até 24h' }],
  ['Atendimento', { start: 'Suporte local 24h', familia: 'Prioritário', ultra: 'Prioritário + técnico em 24h' }],
  ['Controle dos pais no app', { start: false, familia: true, ultra: true }],
  ['IP fixo', { start: false, familia: false, ultra: 'Opcional' }],
  ['Ideal para', { start: 'Até 3 telas', familia: 'Família e home office', ultra: 'Games, 4K e casa cheia' }],
];

const css = `/* Vyra · modelo Intermediário */
:root {
  --orange: #FF5A1F; --orange-600: #E8480C; --orange-700: #C2410C; --red: #E11D2E;
  --ink: #1E1512; --ink-2: #2A1D18; --white: #FFFFFF; --mist: #FFF6F1; --peach: #FFD9C7; --line: #F5E2D8; --muted: #6E5A52;
  --grad: linear-gradient(135deg, #FF6A2B 0%, #E8480C 50%, #E11D2E 100%);
  --f-display: "Outfit", system-ui, sans-serif; --f-body: "Manrope", system-ui, sans-serif;
  --max: 1220px; --ease: cubic-bezier(.2,.7,.2,1);
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--white); color: var(--ink); font: 400 16px/1.6 var(--f-body); overflow-x: hidden; }
img { max-width: 100%; display: block; }
a { color: var(--orange-700); }
h1, h2, h3 { font-family: var(--f-display); line-height: 1.1; margin: 0; text-wrap: balance; }
h1 { font-size: clamp(36px, 5.6vw, 66px); font-weight: 800; letter-spacing: -0.035em; }
h2 { font-size: clamp(30px, 3.8vw, 46px); font-weight: 800; letter-spacing: -0.03em; }
h3 { font-size: 20px; font-weight: 700; letter-spacing: -0.01em; }
h1 em, h2 em { font-style: normal; color: var(--orange); }
p { margin: 0; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.container { max-width: var(--max); margin: 0 auto; padding-left: max(20px, env(safe-area-inset-left)); padding-right: max(20px, env(safe-area-inset-right)); }
.section { padding: 96px 0; position: relative; }
.section.alt { background: var(--mist); }
.head { display: grid; gap: 12px; margin-bottom: 44px; max-width: 700px; }
.head.center { margin-left: auto; margin-right: auto; text-align: center; justify-items: center; }
.head p { color: var(--muted); font-size: 17.5px; }
.kicker { font: 700 12.5px/1 var(--f-display); letter-spacing: .14em; text-transform: uppercase; color: var(--orange-700); }
.ico { width: 20px; height: 20px; flex: none; }
:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }
${DUO_CSS}

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
.logos.lg .st { height: 46px; border-radius: 12px; padding: 0 16px; }
.logos.lg .st svg { height: 28px; }
.logos.lg .st-yt svg { height: 22px; }
.logos.lg .st-yt b { font-size: 16px; }
.logos.lg .st-prime svg { height: 20px; }
.logos.lg .st-max { font-size: 24px; }

/* Botões com brilho */
.btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 15px 28px; border-radius: 999px; font: 700 15.5px/1 var(--f-display); text-decoration: none; border: 2px solid transparent; cursor: pointer; transition: transform .25s var(--ease), box-shadow .25s var(--ease), background-color .2s, color .2s; }
.btn::after { content: ""; position: absolute; top: 0; bottom: 0; left: -60%; width: 40%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent); transform: skewX(-20deg); transition: left .6s var(--ease); }
.btn:hover::after { left: 120%; }
.btn:hover { transform: translateY(-2px); }
.btn .ico { width: 18px; height: 18px; transition: transform .25s var(--ease); }
.btn:hover .ico { transform: translateX(3px); }
.btn-primary { background: var(--grad); color: var(--white); box-shadow: 0 14px 28px -14px rgba(232,72,12,.7); }
.btn-red { background: var(--red); color: var(--white); }
.btn-outline { border-color: var(--orange-600); color: var(--orange-700); }
.btn-outline:hover { background: var(--orange-600); color: var(--white); }
.btn-white { background: var(--white); color: var(--orange-700); box-shadow: 0 14px 28px -14px rgba(0,0,0,.35); }
.btn-ghost { border-color: rgba(255,255,255,.7); color: var(--white); }
.btn-ghost:hover { background: var(--white); color: var(--ink); }
.btn-wa { background: var(--white); color: var(--ink); border-color: var(--line); }
.btn-wa .ico { color: #1FA855; }

/* Topo */
.progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 60; background: var(--grad); transform-origin: left; transform: scaleX(0); }
.hdr { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,.92); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: 0 1px 0 var(--line); transition: box-shadow .3s; }
.hdr.scrolled { box-shadow: 0 1px 0 var(--line), 0 12px 30px -20px rgba(30,21,18,.35); }
.hdr .container { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 78px; transition: min-height .3s var(--ease); }
.hdr.scrolled .container { min-height: 64px; }
.brand { color: var(--orange); display: flex; }
.brand .logo { width: 104px; height: auto; display: block; }
.nav { display: flex; align-items: center; gap: 6px; }
.nav a:not(.btn) { position: relative; color: rgba(30,21,18,.78); text-decoration: none; font: 600 15px/1 var(--f-display); padding: 10px 12px; border-radius: 999px; transition: background-color .2s, color .2s; }
.nav a:not(.btn):hover { background: var(--mist); color: var(--ink); }
.nav a[aria-current="page"]:not(.btn) { color: var(--orange-700); background: var(--mist); }
.nav .actions { display: flex; gap: 8px; margin-left: 10px; }
.nav .btn { padding: 12px 18px; font-size: 14.5px; }
.menu-btn { display: none; background: none; border: 0; color: var(--ink); padding: 8px; cursor: pointer; }
.menu-btn .ico { width: 26px; height: 26px; }
@media (max-width: 1060px) {
  .menu-btn { display: inline-flex; }
  .nav { position: absolute; left: 0; right: 0; top: 100%; background: var(--white); flex-direction: column; align-items: stretch; gap: 0; padding: 8px 20px 22px; box-shadow: 0 16px 30px -16px rgba(30,21,18,.3); clip-path: inset(0 0 100% 0); transition: clip-path .4s var(--ease); }
  .nav.open { clip-path: inset(0 0 0 0); }
  .nav a:not(.btn) { padding: 15px 4px; border-radius: 0; border-bottom: 1px solid var(--line); font-size: 17px; }
  .nav a[aria-current="page"]:not(.btn) { background: none; }
  .nav .actions { margin: 16px 0 0; flex-direction: column; }
}

/* Palco de ofertas */
.stage { position: relative; background: var(--ink); overflow: hidden; }
.stage .slides { position: relative; height: clamp(600px, 78vh, 760px); }
.slide { position: absolute; inset: 0; opacity: 0; visibility: hidden; transition: opacity .9s ease, visibility 0s linear .9s; }
.slide.on { opacity: 1; visibility: visible; transition: opacity .9s ease; }
.slide > img { width: 100%; height: 100%; object-fit: cover; object-position: 72% center; transform: scale(1.08); }
.slide.on > img { transform: scale(1); transition: transform 8s ease-out; }
.slide::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(232,72,12,.96) 0%, rgba(232,72,12,.84) 32%, rgba(225,29,46,.3) 60%, rgba(225,29,46,0) 78%); }
.slide .container { position: absolute; inset: 0; z-index: 2; display: flex; align-items: center; padding-bottom: 90px; }
.slide .copy { max-width: 580px; color: var(--white); display: grid; gap: 18px; justify-items: start; }
.slide .copy > * { opacity: 0; transform: translateY(24px); }
.slide.on .copy > * { opacity: 1; transform: none; transition: opacity .7s var(--ease), transform .7s var(--ease); }
.slide.on .copy > *:nth-child(2) { transition-delay: .08s; } .slide.on .copy > *:nth-child(3) { transition-delay: .16s; } .slide.on .copy > *:nth-child(4) { transition-delay: .24s; } .slide.on .copy > *:nth-child(5) { transition-delay: .32s; }
.slide .tag { padding: 7px 14px; border-radius: 999px; background: var(--white); color: var(--red); font: 800 12.5px/1 var(--f-display); letter-spacing: .08em; text-transform: uppercase; }
.slide h1, .slide h2 { font-size: clamp(36px, 5.6vw, 64px); line-height: 1.02; }
.slide h1 em, .slide h2 em { color: var(--ink); }
.slide p { font-size: 18.5px; color: rgba(255,255,255,.95); max-width: 46ch; }
.slide .actions { display: flex; flex-wrap: wrap; gap: 12px; }
/* Black Friday: Wi-Fi gigante e etiqueta de preço (feito em CSS, sem foto) */
.slide.bf h1 em, .slide.bf h2 em { color: #FF8A4C; }
.slide.bf::after { background: linear-gradient(90deg, rgba(18,10,6,.94) 0%, rgba(18,10,6,.72) 36%, rgba(18,10,6,0) 64%); }
.bf2 { position: absolute; inset: 0; overflow: hidden; background: radial-gradient(circle at 70% 58%, rgba(255,90,31,.42), transparent 42%), radial-gradient(circle at 70% 58%, rgba(225,29,46,.25), transparent 62%), linear-gradient(160deg, #1E1512 0%, #120B08 100%); }
.bf2::before { content: ""; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,.07) 1px, transparent 1.5px); background-size: 26px 26px; -webkit-mask-image: radial-gradient(circle at 70% 55%, #000, transparent 70%); mask-image: radial-gradient(circle at 70% 55%, #000, transparent 70%); }
.bf2-wifi { position: absolute; left: 70%; top: 60%; width: min(58vw, 760px); transform: translate(-50%, -62%); fill: none; stroke-linecap: round; overflow: visible; }
.bf2-wifi path { stroke: #FF7A3D; stroke-width: 18; opacity: .2; animation: arc 2.6s ease-in-out infinite; }
.bf2-wifi path:nth-child(1) { animation-delay: .75s; } .bf2-wifi path:nth-child(2) { animation-delay: .5s; } .bf2-wifi path:nth-child(3) { animation-delay: .25s; }
.bf2-wifi circle { fill: #FFB37A; filter: drop-shadow(0 0 18px #FF5A1F); }
@keyframes arc { 0%, 100% { opacity: .18; filter: none; } 35%, 55% { opacity: 1; filter: drop-shadow(0 0 10px #FF7A3D) drop-shadow(0 0 30px #FF5A1F); } }
.bf2-tag { position: absolute; left: 70%; top: 66%; transform: translate(-50%, -10%) rotate(-7deg); display: grid; justify-items: center; padding: 22px 46px 24px 64px; background: linear-gradient(135deg, #FFD54A, #FFB020); color: #1E1512; border-radius: 18px 26px 26px 18px; clip-path: polygon(34px 0, 100% 0, 100% 100%, 34px 100%, 0 50%); box-shadow: 0 30px 60px -20px rgba(0,0,0,.6); animation: tagSwing 5s ease-in-out infinite; transform-origin: 10% 50%; }
.bf2-tag::before { content: ""; position: absolute; left: 22px; top: 50%; width: 14px; height: 14px; margin-top: -7px; border-radius: 50%; background: #1E1512; }
.bf2-tag b { font: 800 clamp(64px, 8vw, 118px)/.86 var(--f-display); letter-spacing: -0.05em; }
.bf2-tag b small { font-size: .45em; letter-spacing: -0.02em; vertical-align: top; }
.bf2-tag span { font: 800 clamp(14px, 1.3vw, 19px)/1 var(--f-display); letter-spacing: .14em; text-transform: uppercase; margin-top: 6px; }
@keyframes bob { 50% { transform: translateY(-12px); } }
@keyframes tagSwing { 50% { transform: translate(-50%, -10%) rotate(-3deg); } }
.bf2-band { position: absolute; left: 70%; top: 14%; transform: translateX(-50%) rotate(-3deg); padding: 10px 22px; background: #0F0A08; color: var(--white); font: 800 clamp(18px, 2vw, 28px)/1 var(--f-display); letter-spacing: .18em; text-transform: uppercase; box-shadow: 0 0 0 2px #FF7A3D, 0 0 28px rgba(255,90,31,.6); white-space: nowrap; }
.bf2-band em { font-style: normal; color: #FF7A3D; }
.bf2-mini { position: absolute; width: 46px; height: 46px; padding: 10px; border-radius: 14px; background: rgba(255,255,255,.08); box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); color: #FFB37A; animation: bob 6s ease-in-out infinite; }
.bf2-mini svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; }
.bf2-mini.m1 { left: 48%; top: 22%; } .bf2-mini.m2 { left: 92%; top: 30%; animation-delay: -2s; } .bf2-mini.m3 { left: 90%; top: 76%; animation-delay: -4s; width: 56px; height: 56px; } .bf2-mini.m4 { left: 52%; top: 80%; animation-delay: -3s; width: 38px; height: 38px; }
@media (max-width: 900px) {
  .slide.bf::after { background: linear-gradient(0deg, rgba(18,10,6,.96) 30%, rgba(18,10,6,.5) 60%, rgba(18,10,6,0) 85%); }
  .bf2-wifi { left: 50%; top: 30%; width: 92vw; }
  .bf2-tag { left: 50%; top: 22%; padding: 14px 30px 16px 48px; }
  .bf2-band { left: 50%; top: 4%; }
  .bf2-mini.m1, .bf2-mini.m4 { display: none; } .bf2-mini.m2 { left: 84%; top: 40%; } .bf2-mini.m3 { left: 4%; top: 36%; }
}
.glass { position: absolute; z-index: 3; background: rgba(255,255,255,.94); color: var(--ink); border-radius: 20px; padding: 16px 18px; box-shadow: 0 24px 50px -24px rgba(30,21,18,.6); }
.slide .glass { opacity: 0; transform: translateY(20px) scale(.96); }
.slide.on .glass { opacity: 1; transform: none; transition: opacity .7s var(--ease) .5s, transform .7s var(--ease) .5s; }
.glass.price { right: 8%; bottom: 150px; display: grid; gap: 2px; }
.glass.price small { font: 600 12.5px var(--f-body); color: var(--muted); }
.glass.price b { font: 800 40px/1 var(--f-display); color: var(--orange-600); letter-spacing: -0.03em; }
.glass.brandc { right: 8%; top: 40px; display: flex; align-items: center; gap: 12px; }
.glass.brandc .logo { width: 70px; height: auto; color: var(--orange); }
.glass.brandc span { font: 700 13px/1.25 var(--f-display); color: var(--muted); }
.slide.on .glass.brandc { transition-delay: .65s; }
.tabs-bar { position: absolute; left: 0; right: 0; bottom: 0; z-index: 4; background: rgba(30,21,18,.55); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.tabs-bar .container { display: grid; grid-template-columns: repeat(4, 1fr); }
.stab { position: relative; background: none; border: 0; color: rgba(255,255,255,.7); text-align: left; padding: 20px 18px 22px; cursor: pointer; display: grid; gap: 2px; font: 600 13px var(--f-body); }
.stab b { font: 800 18px var(--f-display); color: var(--white); }
.stab::before { content: ""; position: absolute; left: 18px; right: 18px; top: 0; height: 3px; background: rgba(255,255,255,.25); border-radius: 3px; }
.stab i { position: absolute; left: 18px; top: 0; height: 3px; width: 0; background: var(--white); border-radius: 3px; }
.stab[aria-current="true"] { color: var(--white); }
.stab[aria-current="true"] i { animation: fill var(--dur, 7s) linear forwards; }
.stage.paused .stab[aria-current="true"] i { animation-play-state: paused; }
@keyframes fill { to { width: calc(100% - 36px); } }
@media (max-width: 860px) {
  .stage .slides { height: 720px; }
  .slide > img { height: 50%; object-position: center top; }
  .slide::after { background: linear-gradient(180deg, rgba(232,72,12,0) 20%, rgba(232,72,12,.92) 46%, #E8480C 62%, #E11D2E 100%); }
  .slide .container { align-items: flex-end; padding-bottom: 110px; }
  .slide .glass { display: none !important; }
  .slide .copy { gap: 14px; }
  .slide p { font-size: 16px; }
  .slide .logos .st { height: 28px; }
  .stab { padding: 14px 8px 16px; min-height: 0; } .stab b { font-size: 13px; line-height: 1.2; } .stab span { display: none; }
}
@media (max-width: 560px) {
  .tabs-bar .container { padding-right: 86px; }
  .stab b { display: none; }
  .stab { padding: 14px 4px; }
  .stab::before, .stab i { left: 4px; right: 4px; }
  @keyframes fill { to { width: calc(100% - 8px); } }
}

/* Faixa de logos corrida */
.ribbon { background: var(--grad); color: var(--white); overflow: hidden; padding: 16px 0; }
.ribbon .track { display: flex; align-items: center; gap: 34px; width: max-content; animation: scrollx 40s linear infinite; }
.ribbon .item { display: inline-flex; align-items: center; gap: 12px; font: 800 18px/1 var(--f-display); white-space: nowrap; }
.ribbon .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--white); opacity: .7; flex: none; }
@keyframes scrollx { to { transform: translateX(-50%); } }

/* Planos */
.ptabs { display: inline-flex; padding: 5px; border-radius: 999px; background: var(--white); box-shadow: 0 0 0 1px var(--line); margin-bottom: 44px; position: relative; }
.ptabs button { position: relative; z-index: 1; border: 0; background: none; padding: 12px 26px; border-radius: 999px; font: 700 15px/1 var(--f-display); color: var(--muted); cursor: pointer; transition: color .3s; }
.ptabs button[aria-selected="true"] { color: var(--white); }
.ptabs .pill { position: absolute; top: 5px; bottom: 5px; left: 5px; border-radius: 999px; background: var(--grad); transition: transform .45s var(--ease), width .45s var(--ease); }
.tab-panel[hidden] { display: none; }
.tab-panel { animation: fadeUp .6s var(--ease); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } }
.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; align-items: center; perspective: 1200px; }
@media (max-width: 980px) { .plans { grid-template-columns: 1fr; max-width: 450px; margin: 0 auto; gap: 30px; } }
.plan { position: relative; isolation: isolate; background: var(--white); border-radius: 26px; padding: 30px 28px; display: grid; gap: 16px; box-shadow: 0 0 0 1px var(--line), 0 24px 40px -32px rgba(30,21,18,.45); transition: transform .5s var(--ease), box-shadow .5s var(--ease); }
.plan::before { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; opacity: 0; transition: opacity .4s; background: radial-gradient(380px circle at var(--mx, 50%) var(--my, 0%), rgba(255,90,31,.14), transparent 60%); }
.plan:hover::before { opacity: 1; }
.plan:hover { box-shadow: 0 0 0 1.5px var(--orange), 0 30px 50px -30px rgba(232,72,12,.55); }
.plan.featured { background: var(--grad); color: var(--white); padding-block: 44px; box-shadow: 0 36px 64px -30px rgba(225,29,46,.75); }
.plan.featured::before { background: radial-gradient(380px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,.22), transparent 60%); }
.plan .badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--white); font: 800 12px/1 var(--f-display); letter-spacing: .08em; text-transform: uppercase; padding: 8px 14px; border-radius: 999px; white-space: nowrap; }
.plan .tag { font: 700 12.5px/1 var(--f-display); letter-spacing: .1em; text-transform: uppercase; color: var(--orange-700); }
.plan .ph { display: flex; align-items: baseline; gap: 8px; }
.plan .ph .logo { width: 58px; height: auto; color: var(--orange); transform: translateY(3px); }
.plan.featured .ph .logo { color: var(--white); }
.plan .ph b { font: 800 22px/1 var(--f-display); text-transform: lowercase; letter-spacing: -0.02em; }
.plan .speed { font: 800 70px/.9 var(--f-display); letter-spacing: -0.045em; color: var(--orange); }
.plan.featured .speed { color: var(--white); }
.plan .speed small { font-size: 22px; letter-spacing: 0; margin-left: 6px; }
.streams { display: grid; gap: 10px; padding: 14px; border-radius: 16px; background: var(--mist); }
.plan.featured .streams { background: rgba(255,255,255,.14); }
.streams > span { font: 700 11.5px/1 var(--f-display); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.plan.featured .streams > span { color: rgba(255,255,255,.88); }
.choose { display: flex; gap: 6px; flex-wrap: wrap; }
.choose button { border: 0; border-radius: 999px; padding: 7px 12px; font: 700 12.5px var(--f-display); cursor: pointer; background: rgba(255,255,255,.2); color: var(--white); transition: background-color .2s, color .2s; }
.choose button[aria-pressed="true"] { background: var(--white); color: var(--orange-700); }
.plan ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 9px; font-size: 15px; }
.plan li { display: flex; gap: 10px; align-items: center; }
.plan li .ico { width: 18px; height: 18px; color: var(--orange-600); }
.plan.featured li .ico { color: var(--white); }
.plan .price { display: flex; align-items: baseline; gap: 4px; border-top: 1px solid var(--line); padding-top: 16px; }
.plan.featured .price { border-color: rgba(255,255,255,.25); }
.plan .price small { font: 600 14px var(--f-body); color: var(--muted); }
.plan.featured .price small { color: rgba(255,255,255,.88); }
.plan .price b { font: 800 42px/1 var(--f-display); letter-spacing: -0.03em; }
.plan .price .ask { font: 800 28px/1 var(--f-display); }
.plan .btn { width: 100%; }
.plan.featured .btn-white:hover { background: var(--ink); color: var(--white); }
.note { font-size: 13px; color: var(--muted); margin-top: 20px; text-align: center; }

/* Comparativo */
.compare-wrap { overflow-x: auto; border-radius: 26px; box-shadow: 0 0 0 1px var(--line), 0 30px 60px -44px rgba(30,21,18,.45); background: var(--white); }
.compare { width: 100%; min-width: 760px; border-collapse: separate; border-spacing: 0; font-size: 15px; }
.compare th, .compare td { padding: 16px 20px; text-align: left; border-bottom: 1px solid var(--line); vertical-align: middle; }
.compare thead th { background: var(--white); padding-top: 26px; padding-bottom: 22px; }
.compare thead th:first-child { font: 800 22px/1.2 var(--f-display); }
.compare .colh { display: grid; gap: 6px; }
.compare .colh .logo { width: 52px; height: auto; color: var(--orange); }
.compare .colh b { font: 800 26px/1 var(--f-display); letter-spacing: -0.03em; text-transform: lowercase; }
.compare .colh span { font-size: 13px; color: var(--muted); }
.compare tbody th { font: 700 14.5px var(--f-display); color: var(--muted); width: 22%; background: var(--white); position: sticky; left: 0; z-index: 1; }
.compare td.feat { background: var(--mist); }
.compare thead th.feat { background: var(--grad); color: var(--white); border-radius: 18px 18px 0 0; }
.compare thead th.feat .logo, .compare thead th.feat span { color: rgba(255,255,255,.92); }
.compare tbody tr { transition: background-color .2s; }
.compare tbody tr:hover td, .compare tbody tr:hover th { background: #FFEDE3; }
.compare .yes { width: 26px; height: 26px; border-radius: 50%; background: var(--grad); color: var(--white); display: inline-grid; place-items: center; }
.compare .yes .ico { width: 15px; height: 15px; }
.compare .no { color: rgba(30,21,18,.3); font-weight: 700; }
.compare .pr b { font: 800 26px var(--f-display); letter-spacing: -0.02em; }
.compare .pr small { color: var(--muted); }
.compare tfoot td { border-bottom: 0; padding-bottom: 26px; }
.compare tfoot .btn { width: 100%; padding: 13px 16px; }
.compare-hint { display: none; font-size: 13px; color: var(--muted); margin-top: 10px; text-align: center; }
@media (max-width: 820px) { .compare-hint { display: block; } }

/* Bento de diferenciais */
.bento { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 230px; gap: 18px; }
.bento > * { min-width: 0; }
.tile { position: relative; border-radius: 28px; padding: 26px; overflow: hidden; isolation: isolate; background: var(--white); box-shadow: 0 0 0 1px var(--line); display: flex; flex-direction: column; justify-content: space-between; gap: 14px; transition: transform .5s var(--ease), box-shadow .5s; }
.tile:hover { transform: translateY(-6px); box-shadow: 0 0 0 1.5px rgba(255,90,31,.5), 0 30px 50px -34px rgba(232,72,12,.55); }
.tile p { color: var(--muted); font-size: 15px; }
.tile.photo { grid-column: span 2; grid-row: span 2; color: var(--white); padding: 30px; justify-content: flex-end; box-shadow: none; }
.tile.photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; transition: transform 1s var(--ease); }
.tile.photo:hover img { transform: scale(1.05); }
.tile.photo::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, transparent 35%, rgba(20,14,12,.88)); }
.tile.photo h3 { font-size: 30px; font-weight: 500; letter-spacing: -0.03em; } .tile.photo h3 b { font-weight: 800; }
.tile.photo p { color: rgba(255,255,255,.85); }
.tile.grad { background: var(--grad); color: var(--white); box-shadow: none; }
.tile.grad p { color: rgba(255,255,255,.88); }
.tile.dark { background: #140E0C; color: var(--white); box-shadow: none; }
.tile.dark p { color: rgba(255,255,255,.7); }
.tile.wide { grid-column: span 2; }
.tile .big { font: 800 64px/.9 var(--f-display); letter-spacing: -0.05em; }
.tile .big small { font-size: 22px; font-weight: 600; letter-spacing: 0; margin-left: 4px; }
@media (max-width: 1000px) { .bento { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .bento { grid-template-columns: 1fr; grid-auto-rows: auto; } .tile.photo, .tile.wide { grid-column: auto; } .tile.photo { grid-row: auto; min-height: 380px; } .tile { min-height: 200px; } }
.ico-box { width: 52px; height: 52px; border-radius: 15px; position: relative; overflow: hidden; display: grid; place-items: center; background: var(--grad); box-shadow: 0 12px 24px -12px rgba(232,72,12,.6); }
.ico-box::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 20% 15%, rgba(255,255,255,.32), transparent 55%); }

/* Linha que se desenha com a rolagem */
.path { position: relative; display: grid; gap: 90px; padding-block: 20px; }
.path svg.line { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; overflow: visible; pointer-events: none; }
.path .track { fill: none; stroke: var(--line); stroke-width: 2; }
.path .draw { fill: none; stroke: url(#pathgrad); stroke-width: 3.5; stroke-linecap: round; filter: drop-shadow(0 0 8px rgba(255,90,31,.55)); }
.path .head-dot { fill: var(--white); stroke: var(--orange); stroke-width: 4; filter: drop-shadow(0 0 10px rgba(255,90,31,.8)); transition: opacity .3s; }
.pcard { position: relative; z-index: 1; width: min(520px, 100%); background: var(--white); border-radius: 26px; padding: 32px 34px; text-align: center; display: grid; gap: 12px; justify-items: center; box-shadow: 0 0 0 1px var(--line), 0 24px 44px -30px rgba(30,21,18,.4); transition: box-shadow .5s var(--ease), transform .5s var(--ease); }
.pcard:nth-of-type(odd) { justify-self: start; margin-left: 4%; } .pcard:nth-of-type(even) { justify-self: end; margin-right: 4%; }
.pcard .num { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; background: var(--mist); color: var(--orange-700); font: 800 18px var(--f-display); transition: background-color .5s, color .5s; }
.pcard p { color: var(--muted); }
.pcard .num:has(.duo) { background: var(--grad); }
.pcard.lit { box-shadow: 0 0 0 2px var(--orange), 0 30px 60px -30px rgba(232,72,12,.55); transform: translateY(-4px); }
.pcard.lit .num { background: var(--grad); color: var(--white); }
@media (max-width: 860px) { .pcard:nth-of-type(n) { justify-self: center; margin: 0; } .path { gap: 56px; } }

/* Faixa com foto e texto */
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.split > * { min-width: 0; }
@media (max-width: 900px) { .split { grid-template-columns: 1fr; gap: 34px; } }
.media { position: relative; border-radius: 30px; overflow: hidden; aspect-ratio: 4 / 3; max-width: 100%; box-shadow: 0 34px 64px -38px rgba(30,21,18,.55); }
.media img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--ease); }
.media:hover img { transform: scale(1.04); }
.media .float { position: absolute; left: 18px; bottom: 18px; background: var(--white); border-radius: 16px; padding: 12px 16px; display: flex; gap: 12px; align-items: center; box-shadow: 0 16px 30px -16px rgba(30,21,18,.5); }
.media .float b { font: 800 22px/1 var(--f-display); color: var(--orange-600); }
.media .float span { font-size: 13.5px; color: var(--muted); line-height: 1.3; }
.vbug { position: absolute; z-index: 3; top: 16px; display: inline-flex; background: var(--white); border-radius: 12px; padding: 8px 12px; box-shadow: 0 10px 24px -12px rgba(30,21,18,.5); color: var(--orange); }
.vbug.tl { left: 16px; } .vbug.tr { right: 16px; }
.vbug .logo { width: 62px; height: auto; display: block; }
.copy-block { display: grid; gap: 18px; justify-items: start; }
.copy-block p { color: var(--muted); font-size: 17px; }

/* Revelar imagem */
.reveal-img { transition: clip-path 1.1s var(--ease); }
.reveal-img.pre { clip-path: inset(0 0 100% 0 round 240px 240px 32px 32px); }

/* Galeria arrastável */
.gal-top { display: flex; justify-content: space-between; align-items: end; gap: 20px; flex-wrap: wrap; margin-bottom: 30px; }
.gal-nav { display: flex; gap: 10px; }
.gal-nav button { width: 50px; height: 50px; border-radius: 50%; border: 0; background: var(--white); box-shadow: 0 0 0 1px var(--line); color: var(--ink); display: grid; place-items: center; cursor: pointer; transition: background-color .2s, color .2s; }
.gal-nav button:hover { background: var(--orange-600); color: var(--white); }
.gal-nav .prev .ico { transform: rotate(180deg); }
.gallery { display: flex; gap: 18px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding: 6px max(20px, calc((100vw - var(--max)) / 2 + 20px)) 20px; cursor: grab; }
.gallery::-webkit-scrollbar { display: none; }
.gallery.drag { cursor: grabbing; scroll-snap-type: none; }
.gcard { position: relative; flex: none; width: min(340px, 78vw); aspect-ratio: 3 / 4; border-radius: 26px; overflow: hidden; scroll-snap-align: start; color: var(--white); user-select: none; }
.gcard img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; transition: transform .8s var(--ease); }
.gcard:hover img { transform: scale(1.06); }
.gcard::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(30,21,18,.88)); }
.gcard .cap { position: absolute; left: 22px; right: 22px; bottom: 22px; z-index: 2; display: grid; gap: 6px; transform: translateY(26px); transition: transform .5s var(--ease); }
.gcard:hover .cap { transform: none; }
.gcard .cap b { font: 800 23px/1.15 var(--f-display); }
.gcard .cap span { font-size: 15px; color: rgba(255,255,255,.88); }
.gcard .cap a { color: var(--peach); font: 700 14px var(--f-display); text-decoration: none; opacity: 0; transition: opacity .4s; }
.gcard:hover .cap a { opacity: 1; }
@media (hover: none) { .gcard .cap { transform: none; } .gcard .cap a { opacity: 1; } }

/* Faixa com foto e contadores */
.band { position: relative; overflow: hidden; color: var(--white); background: var(--ink); }
.band > img { position: absolute; left: 0; top: -10%; width: 100%; height: 120%; object-fit: cover; will-change: transform; }
.band::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(30,21,18,.94) 0%, rgba(30,21,18,.78) 46%, rgba(30,21,18,.2) 100%); }
.band.fire::after { background: linear-gradient(90deg, rgba(232,72,12,.95) 0%, rgba(225,29,46,.85) 50%, rgba(225,29,46,.4) 100%); }
.band .container { position: relative; z-index: 2; padding-block: 96px; display: grid; gap: 20px; justify-items: start; }
.band p { color: rgba(255,255,255,.9); font-size: 17.5px; max-width: 56ch; }
.band h2 { max-width: 20ch; }
.band .kicker { color: var(--peach); }
.band.fire h2 em { color: var(--ink); }
.counters { display: flex; flex-wrap: wrap; gap: 18px 46px; margin-top: 8px; }
.counters div { display: grid; gap: 2px; }
.counters b { font: 800 44px/1 var(--f-display); letter-spacing: -0.03em; color: var(--orange); font-variant-numeric: tabular-nums; }
.counters span { font-size: 14px; color: rgba(255,255,255,.8); }
.counters.dark b { color: var(--orange-600); }
.counters.dark span { color: var(--muted); }
.cep { display: flex; gap: 10px; flex-wrap: wrap; width: min(580px, 100%); }
.cep input { flex: 1 1 220px; min-width: 0; border: 0; border-radius: 999px; padding: 16px 22px; font: 500 16px var(--f-body); }
.cep-result { font-weight: 700; min-height: 1.5em; }
.band .watermark { position: absolute; right: -40px; bottom: -30px; width: min(540px, 60%); height: auto; z-index: 1; pointer-events: none; color: rgba(255,255,255,.14); }

/* Avaliações */
.marquee { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent); mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent); padding-block: 8px; }
.marquee .track { display: flex; gap: 18px; width: max-content; animation: scrollx2 75s linear infinite; }
.marquee.rev .track { animation-direction: reverse; animation-duration: 85s; margin-top: 18px; }
.marquee:hover .track { animation-play-state: paused; }
@keyframes scrollx2 { to { transform: translateX(calc(-50% - 9px)); } }
.review { width: 350px; flex: none; background: var(--white); border-radius: 22px; padding: 22px; display: grid; gap: 12px; align-content: space-between; box-shadow: 0 0 0 1px var(--line); margin: 0; transition: transform .3s var(--ease), box-shadow .3s; }
.review:hover { transform: translateY(-4px); box-shadow: 0 0 0 1.5px var(--orange); }
.stars { color: #FFB020; letter-spacing: 2px; }
.review p { font-size: 15px; }
.review footer { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--muted); }
.review footer b { display: block; color: var(--ink); font-family: var(--f-display); font-size: 14.5px; }
.avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--grad); color: var(--white); display: grid; place-items: center; font: 800 15px var(--f-display); flex: none; }
.plan-tag { margin-left: auto; padding: 5px 10px; border-radius: 999px; background: var(--mist); color: var(--orange-700); font: 700 12px var(--f-display); white-space: nowrap; }

/* FAQ */
.faq-2 { display: grid; grid-template-columns: .8fr 1.2fr; gap: 56px; align-items: start; }
.faq-2 > * { min-width: 0; }
@media (max-width: 900px) { .faq-2 { grid-template-columns: 1fr; } }
.faq-side { position: sticky; top: 110px; display: grid; gap: 18px; }
@media (max-width: 900px) { .faq-side { position: static; } }
.acc { display: grid; gap: 10px; }
.acc-item { border-radius: 18px; background: var(--white); box-shadow: 0 0 0 1px var(--line); transition: box-shadow .3s; }
.acc-item.open { box-shadow: 0 0 0 1.5px var(--orange), 0 18px 34px -24px rgba(232,72,12,.45); }
.acc-item button { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; background: none; border: 0; padding: 20px 22px; text-align: left; font: 700 17px/1.4 var(--f-display); color: var(--ink); cursor: pointer; }
.acc-item .pm { width: 34px; height: 34px; border-radius: 50%; flex: none; display: grid; place-items: center; background: var(--mist); color: var(--orange-700); transition: transform .4s var(--ease), background-color .3s, color .3s; }
.acc-item.open .pm { transform: rotate(45deg); background: var(--grad); color: var(--white); }
.acc-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .45s var(--ease); }
.acc-body > div { overflow: hidden; }
.acc-body p { padding: 0 22px 22px; color: var(--muted); }
.acc-item.open .acc-body { grid-template-rows: 1fr; }

/* Cabeçalho com foto (páginas internas) */
.phero { position: relative; min-height: 420px; display: flex; align-items: center; overflow: hidden; color: var(--white); background: var(--ink); }
.phero > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 70% 30%; animation: settle 1.6s var(--ease) both; }
@keyframes settle { from { transform: scale(1.08); } }
.phero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(232,72,12,.96) 0%, rgba(232,72,12,.82) 36%, rgba(225,29,46,.2) 70%, rgba(225,29,46,0) 86%); }
.phero .container { position: relative; z-index: 2; display: grid; gap: 14px; padding-block: 60px; width: 100%; }
.phero .container > * { animation: fadeUp .8s var(--ease) both; }
.phero .container > *:nth-child(2) { animation-delay: .1s; } .phero .container > *:nth-child(3) { animation-delay: .2s; }
.phero .crumbs { font-size: 14px; color: rgba(255,255,255,.85); }
.phero .crumbs a { color: var(--white); }
.phero h1 { max-width: 16ch; }
.phero h1 em { color: var(--ink); }
.phero p { font-size: 18.5px; max-width: 52ch; color: rgba(255,255,255,.95); }
.phero .glass { right: 6%; bottom: 40px; animation: fadeUp .8s var(--ease) .4s both; }
@media (max-width: 760px) { .phero::after { background: linear-gradient(90deg, rgba(232,72,12,.94), rgba(225,29,46,.82)); } .phero .glass { display: none; } }

/* Perfis */
.profiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
@media (max-width: 980px) { .profiles { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .profiles { grid-template-columns: 1fr; } }
.profile { position: relative; border-radius: 24px; overflow: hidden; aspect-ratio: 3 / 4; max-width: 100%; color: var(--white); display: flex; align-items: flex-end; text-decoration: none; }
.profile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .8s var(--ease); }
.profile:hover img { transform: scale(1.06); }
.profile::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 35%, rgba(30,21,18,.9)); }
.profile div { position: relative; z-index: 2; padding: 22px; display: grid; gap: 6px; }
.profile p { color: rgba(255,255,255,.88); font-size: 14.5px; }
.profile .go { color: var(--peach); font: 700 14.5px var(--f-display); }

/* Sobre */
.cities { display: flex; flex-wrap: wrap; gap: 10px; }
.city { padding: 10px 16px; border-radius: 999px; background: var(--white); box-shadow: 0 0 0 1px var(--line); font: 700 15px var(--f-display); }
.city.on { background: var(--ink); color: var(--white); box-shadow: none; }
.city small { font: 600 12px var(--f-body); color: var(--muted); margin-left: 6px; }
.checklist { display: grid; width: 100%; }
.checklist div { display: grid; grid-template-columns: auto 1fr; gap: 4px 14px; padding: 16px 0; border-bottom: 1px solid var(--line); }
.checklist .ck { width: 34px; height: 34px; border-radius: 50%; background: var(--grad); color: var(--white); display: grid; place-items: center; grid-row: span 2; }
.checklist .ck .ico { width: 18px; height: 18px; }
.checklist b { font: 700 17px var(--f-display); }
.checklist span { color: var(--muted); font-size: 15px; }

/* Formulários */
.form { display: grid; gap: 16px; }
.form .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 620px) { .form .row { grid-template-columns: 1fr; } }
label { display: grid; gap: 6px; font: 600 14.5px var(--f-display); }
input, select, textarea { font: 400 16px var(--f-body); color: var(--ink); padding: 14px 16px; border: 1px solid var(--line); border-radius: 14px; background: var(--mist); width: 100%; transition: box-shadow .25s, background-color .25s, border-color .25s; }
input:focus, select:focus, textarea:focus { outline: none; background: var(--white); border-color: var(--orange); box-shadow: 0 0 0 4px rgba(255,90,31,.15); }
textarea { min-height: 130px; resize: vertical; }
.form-ok { display: none; background: #E8FBF2; color: #0B6B41; border-radius: 14px; padding: 14px 16px; font-weight: 600; animation: fadeUp .5s var(--ease); }
.form.sent .form-ok { display: block; }
.form-card { background: var(--white); border-radius: 28px; padding: clamp(22px, 4vw, 40px); box-shadow: 0 0 0 1px var(--line), 0 34px 64px -46px rgba(30,21,18,.5); }
fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 12px; }
legend { font: 800 19px var(--f-display); margin-bottom: 12px; }
.plan-pick { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 760px) { .plan-pick { grid-template-columns: 1fr; } }
.plan-pick label { position: relative; border: 1.5px solid var(--line); border-radius: 18px; padding: 18px; cursor: pointer; display: grid; gap: 8px; align-content: start; transition: border-color .2s, transform .25s var(--ease); }
.plan-pick label:hover { transform: translateY(-3px); }
.plan-pick input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.plan-pick b { font: 800 19px var(--f-display); }
.plan-pick span { color: var(--muted); font: 500 14px var(--f-body); }
.plan-pick label:has(input:checked) { border-color: var(--orange-600); background: var(--mist); box-shadow: inset 0 0 0 1px var(--orange-600); }
.plan-pick label:has(input:focus-visible) { outline: 2px solid var(--orange); outline-offset: 2px; }
.assine-layout { display: grid; grid-template-columns: 1fr 340px; gap: 28px; align-items: start; }
.assine-layout > * { min-width: 0; }
@media (max-width: 980px) { .assine-layout { grid-template-columns: 1fr; } }
.summary { position: sticky; top: 100px; border-radius: 28px; padding: 28px; background: var(--grad); color: var(--white); display: grid; gap: 14px; box-shadow: 0 34px 64px -30px rgba(225,29,46,.6); }
.summary .logo { width: 96px; height: auto; color: var(--white); }
.summary .sp { font: 800 64px/.9 var(--f-display); letter-spacing: -0.04em; }
.summary .sp small { font-size: 20px; margin-left: 6px; letter-spacing: 0; }
.summary .line { display: flex; justify-content: space-between; gap: 12px; border-top: 1px solid rgba(255,255,255,.25); padding-top: 12px; font-size: 15px; }
.summary .line b { font-family: var(--f-display); }
.contact-layout { display: grid; grid-template-columns: 1.3fr 1fr; gap: 28px; align-items: start; }
.contact-layout > * { min-width: 0; }
@media (max-width: 900px) { .contact-layout { grid-template-columns: 1fr; } }
.info { display: grid; gap: 12px; }
.info .item { display: flex; gap: 14px; align-items: center; padding: 18px; border-radius: 18px; background: var(--white); box-shadow: 0 0 0 1px var(--line); text-decoration: none; color: var(--ink); transition: transform .3s var(--ease); }
.info a.item:hover { transform: translateX(6px); }
.info .ib { width: 46px; height: 46px; border-radius: 14px; background: var(--grad); color: var(--white); display: grid; place-items: center; flex: none; }
.info b { display: block; font-family: var(--f-display); }
.info span { color: var(--muted); font-size: 14.5px; }

/* Redes */
.social { display: flex; gap: 10px; flex-wrap: wrap; }
.social a { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; background: var(--orange-600); color: var(--white); transition: transform .3s var(--ease), background-color .2s; }
.social a:hover { transform: translateY(-3px); background: var(--red); }
.foot .social a { background: rgba(255,255,255,.1); }
.foot .social a:hover { background: var(--orange); }

/* Rodapé com mapa pequeno */
.foot { background: var(--ink); color: rgba(255,255,255,.75); font-size: 15px; }
.where { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 44px; align-items: center; padding: 64px 0 48px; border-bottom: 1px solid rgba(255,255,255,.12); }
@media (max-width: 860px) { .where { grid-template-columns: 1fr; gap: 26px; } }
.map-box { position: relative; height: 270px; border-radius: 24px; overflow: hidden; background: #E9E4E1; box-shadow: 0 30px 60px -34px rgba(0,0,0,.7); }
.map-box img { width: 100%; height: 100%; object-fit: cover; filter: sepia(.25) saturate(1.25) hue-rotate(-12deg); }
.map-box .pin { position: absolute; left: 50%; top: 50%; z-index: 2; width: 22px; height: 22px; margin: -11px 0 0 -11px; border-radius: 50%; background: var(--red); border: 4px solid var(--white); box-shadow: 0 8px 18px -6px rgba(225,29,46,.8); }
.map-box .pin::before { content: ""; position: absolute; inset: -10px; border-radius: 50%; border: 3px solid rgba(225,29,46,.55); animation: ping 2.2s ease-out infinite; }
.map-box .pin b { position: absolute; left: 22px; top: -6px; white-space: nowrap; font: 800 13px var(--f-display); color: var(--red); text-shadow: 0 0 4px #fff, 0 0 4px #fff; }
@keyframes ping { from { transform: scale(.6); opacity: 1; } to { transform: scale(2.4); opacity: 0; } }
.map-info { position: absolute; left: 12px; top: 12px; z-index: 3; background: var(--white); color: var(--ink); border-radius: 14px; padding: 12px 14px; display: grid; gap: 3px; max-width: 260px; box-shadow: 0 12px 26px -12px rgba(0,0,0,.45); }
.map-info b { font: 800 15px var(--f-display); }
.map-info span { font-size: 12.5px; color: var(--muted); line-height: 1.35; }
.map-info .mbtns { display: flex; gap: 6px; margin-top: 8px; }
.map-info a { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 10px; background: var(--grad); color: var(--white); font: 700 13px var(--f-display); text-decoration: none; }
.map-info a.sq { padding: 8px; background: var(--mist); color: var(--orange-700); }
.map-info a .ico { width: 16px; height: 16px; }
.map-box .attr { position: absolute; right: 8px; bottom: 6px; z-index: 3; font-size: 11px; background: rgba(255,255,255,.85); color: var(--ink); padding: 2px 6px; border-radius: 4px; }
.map-box .attr a { color: var(--ink); }
.where h2 { color: var(--white); font-size: clamp(30px, 3.6vw, 46px); }
.where p { color: rgba(255,255,255,.75); margin-top: 10px; max-width: 46ch; }
.where .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.where .chips span { padding: 7px 13px; border-radius: 999px; background: rgba(255,255,255,.08); font: 600 13.5px var(--f-display); color: var(--white); }
.where .chips span.on { background: var(--grad); }
.where .chips small { opacity: .7; margin-left: 4px; font-weight: 500; }
.foot-brand { display: flex; justify-content: space-between; align-items: center; gap: 16px 24px; flex-wrap: wrap; padding: 28px 0; border-bottom: 1px solid rgba(255,255,255,.12); }
.foot-brand .logo { width: 124px; height: auto; color: var(--white); }
.foot-brand b { font: 800 clamp(18px, 2.2vw, 24px) var(--f-display); color: var(--white); }
.foot .cols { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; padding-top: 40px; }
@media (max-width: 860px) { .foot .cols { grid-template-columns: 1fr 1fr; } }
@media (max-width: 520px) { .foot .cols { grid-template-columns: 1fr; } }
.foot .logo-w { width: 120px; height: auto; color: var(--white); display: block; margin-bottom: 14px; }
.foot h3 { color: var(--white); font-size: 15px; margin-bottom: 12px; }
.foot a { color: rgba(255,255,255,.75); text-decoration: none; }
.foot a:hover { color: var(--white); }
.foot ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.foot .bottom { border-top: 1px solid rgba(255,255,255,.12); margin-top: 44px; padding: 20px 0 28px; font-size: 13px; display: grid; gap: 6px; }
.wa-float { position: fixed; right: max(18px, env(safe-area-inset-right)); bottom: max(18px, env(safe-area-inset-bottom)); width: 60px; height: 60px; border-radius: 50%; background: var(--grad); color: var(--white); display: grid; place-items: center; box-shadow: 0 12px 28px -8px rgba(232,72,12,.6); z-index: 45; transition: transform .3s var(--ease); }
.wa-float:hover { transform: scale(1.08) rotate(-8deg); }
.wa-float .ico { width: 28px; height: 28px; }

/* Planos em faixas (Residencial) */
.prows { display: grid; gap: 16px; }
.prow { position: relative; display: grid; grid-template-columns: 210px minmax(0, 1fr) 230px; gap: 30px; align-items: center; background: var(--white); border-radius: 26px; padding: 26px 30px; box-shadow: 0 0 0 1px var(--line); transition: transform .35s var(--ease), box-shadow .35s var(--ease); }
.prow:hover { transform: translateX(6px); box-shadow: 0 0 0 1.5px var(--orange), 0 26px 44px -30px rgba(232,72,12,.5); }
.prow.featured { background: var(--grad); color: var(--white); box-shadow: 0 30px 60px -30px rgba(225,29,46,.7); }
.prow .badge { position: absolute; top: -12px; left: 30px; background: var(--ink); color: var(--white); font: 800 11.5px/1 var(--f-display); letter-spacing: .08em; text-transform: uppercase; padding: 7px 12px; border-radius: 999px; }
.prow .ph { display: flex; align-items: baseline; gap: 8px; }
.prow .ph .logo { width: 54px; height: auto; color: var(--orange); transform: translateY(3px); }
.prow.featured .ph .logo { color: var(--white); }
.prow .ph b { font: 800 20px/1 var(--f-display); text-transform: lowercase; }
.prow .speed { font: 800 64px/.9 var(--f-display); letter-spacing: -0.045em; color: var(--orange); margin-top: 8px; }
.prow.featured .speed { color: var(--white); }
.prow .speed small { font-size: 20px; letter-spacing: 0; margin-left: 4px; }
.prow .mid { display: grid; gap: 12px; }
.prow ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; font-size: 14.5px; }
.prow li { display: flex; gap: 8px; align-items: center; }
.prow li .ico { width: 17px; height: 17px; color: var(--orange-600); }
.prow.featured li .ico { color: var(--white); }
.prow .side { display: grid; gap: 12px; justify-items: end; text-align: right; }
.prow .price small { font: 600 14px var(--f-body); opacity: .75; }
.prow .price b { font: 800 40px/1 var(--f-display); letter-spacing: -0.03em; }
.prow .side .btn { width: 100%; }
@media (max-width: 900px) { .prow { grid-template-columns: 1fr; gap: 18px; padding-top: 30px; } .prow .side { justify-items: start; text-align: left; } .prow ul { grid-template-columns: 1fr; } }

/* Planos empresariais em cards escuros */
.bplans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
@media (max-width: 980px) { .bplans { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; } }
.bplan { position: relative; overflow: hidden; isolation: isolate; background: var(--ink); color: var(--white); border-radius: 26px; padding: 32px 30px; display: grid; gap: 16px; align-content: start; border-top: 5px solid var(--orange); transition: transform .35s var(--ease), box-shadow .35s; }
.bplan::after { content: ""; position: absolute; right: -80px; top: -80px; width: 240px; height: 240px; border-radius: 50%; background: radial-gradient(circle, rgba(255,90,31,.35), transparent 65%); z-index: -1; }
.bplan:hover { transform: translateY(-6px); box-shadow: 0 30px 50px -30px rgba(232,72,12,.6); }
.bplan.featured { box-shadow: 0 0 0 2px var(--orange), 0 30px 60px -30px rgba(232,72,12,.7); }
.bplan .tag { font: 700 12px/1 var(--f-display); letter-spacing: .12em; text-transform: uppercase; color: var(--peach); }
.bplan .badge { position: absolute; top: 18px; right: 18px; background: var(--grad); color: var(--white); font: 800 11px/1 var(--f-display); letter-spacing: .08em; text-transform: uppercase; padding: 7px 11px; border-radius: 999px; }
.bplan .name { font: 800 22px var(--f-display); }
.bplan .speed { font: 800 60px/.9 var(--f-display); letter-spacing: -0.045em; color: var(--orange); }
.bplan .speed small { font-size: 20px; letter-spacing: 0; margin-left: 4px; color: var(--white); }
.bplan ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; font-size: 15px; color: rgba(255,255,255,.88); }
.bplan li { display: flex; gap: 10px; align-items: center; }
.bplan li .ico { width: 18px; height: 18px; color: var(--orange); }
.bplan .price { border-top: 1px solid rgba(255,255,255,.14); padding-top: 16px; display: flex; align-items: baseline; gap: 4px; }
.bplan .price small { font-size: 14px; opacity: .7; }
.bplan .price b { font: 800 38px/1 var(--f-display); }
.bplan .price .ask { font: 800 26px var(--f-display); }
.bplan .btn { width: 100%; }

/* Passos em linha (Empresas) */
.hsteps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; position: relative; counter-reset: st; }
.hsteps::before { content: ""; position: absolute; top: 27px; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, var(--orange), var(--red)); }
.hstep { position: relative; display: grid; gap: 10px; justify-items: start; }
.hstep::before { counter-increment: st; content: counter(st); width: 56px; height: 56px; border-radius: 50%; background: var(--white); box-shadow: 0 0 0 2px var(--orange); display: grid; place-items: center; font: 800 20px var(--f-display); color: var(--orange-700); }
.hstep p { color: var(--muted); }
@media (max-width: 800px) { .hsteps { grid-template-columns: 1fr; } .hsteps::before { display: none; } }

/* Entrada ao rolar */
.rv { transition: opacity .8s var(--ease), transform .8s var(--ease); }
.rv.pre { opacity: 0; transform: translateY(30px); }
.rv-l.pre { transform: translateX(-40px); } .rv-r.pre { transform: translateX(40px); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .rv.pre, .reveal-img.pre { opacity: 1; transform: none; clip-path: none; }
  .marquee, .ribbon { overflow-x: auto; }
  .marquee .track, .ribbon .track { animation: none !important; }
}
`;

const js = `// Vyra · modelo Intermediário
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  // Topo, barra de progresso e menu
  var hdr = $('.hdr'), prog = $('.progress');
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    hdr.classList.toggle('scrolled', scrollY > 20);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var mb = $('.menu-btn'), nav = $('.nav');
  if (mb) mb.addEventListener('click', function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });

  // Palco de ofertas com abas
  var stage = $('.stage');
  if (stage) {
    var slides = $$('.slide', stage), tabs = $$('.stab', stage), cur = 0, timer, DUR = 7000;
    stage.style.setProperty('--dur', DUR + 'ms');
    var go = function (i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === cur); s.setAttribute('aria-hidden', k !== cur); });
      tabs.forEach(function (t) { t.setAttribute('aria-current', 'false'); });
      void stage.offsetWidth; tabs[cur].setAttribute('aria-current', 'true');
      clearTimeout(timer); if (!reduce) timer = setTimeout(function () { go(cur + 1); }, DUR);
    };
    tabs.forEach(function (t, k) { t.addEventListener('click', function () { go(k); }); });
    stage.addEventListener('mouseenter', function () { clearTimeout(timer); stage.classList.add('paused'); });
    stage.addEventListener('mouseleave', function () { stage.classList.remove('paused'); go(cur); });
    var x0 = null;
    stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });
    go(0);
  }

  // Abas de planos com pílula deslizante
  $$('.ptabs').forEach(function (tl) {
    var btns = $$('[role=tab]', tl), pill = $('.pill', tl);
    function place(b) { pill.style.width = b.offsetWidth + 'px'; pill.style.transform = 'translateX(' + (b.offsetLeft - 5) + 'px)'; }
    btns.forEach(function (b) { b.addEventListener('click', function () {
      btns.forEach(function (o) { o.setAttribute('aria-selected', o === b); document.getElementById(o.getAttribute('aria-controls')).hidden = o !== b; });
      place(b);
    }); });
    place(btns[0]);
    addEventListener('resize', function () { place(btns.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]); });
    if (document.fonts) document.fonts.ready.then(function () { place(btns.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0]); });
  });

  // Plano Família: escolha do streaming
  $$('.choose').forEach(function (g) {
    var bs = $$('button', g), out = g.parentNode.querySelector('.logos');
    bs.forEach(function (b) { b.addEventListener('click', function () {
      bs.forEach(function (o) { o.setAttribute('aria-pressed', o === b); });
      out.innerHTML = b.dataset.logos;
    }); });
  });

  // Luz que segue o mouse e leve inclinação nos planos
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    $$('.plan').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
        el.style.transform = 'perspective(1200px) rotateX(' + ((y / r.height) - .5) * -5 + 'deg) rotateY(' + ((x / r.width) - .5) * 6 + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  // Linha que se desenha com a rolagem
  $$('.path').forEach(function (wrap) {
    var svg = $('svg.line', wrap), track = $('.track', svg), draw = $('.draw', svg), dot = $('.head-dot', svg), cards = $$('.pcard', wrap), len = 0;
    function build() {
      var w = wrap.clientWidth, h = wrap.clientHeight, n = cards.length;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      var d = 'M ' + (w * .5) + ' 0', amp = Math.min(w * .3, 300);
      for (var i = 0; i < n + 1; i++) {
        var y0 = i * h / (n + 1), y1 = (i + 1) * h / (n + 1), side = i % 2 ? -1 : 1;
        d += ' C ' + (w * .5 + side * amp) + ' ' + (y0 + (y1 - y0) * .35) + ', ' + (w * .5 + side * amp) + ' ' + (y0 + (y1 - y0) * .65) + ', ' + (w * .5) + ' ' + y1;
      }
      track.setAttribute('d', d); draw.setAttribute('d', d);
      len = draw.getTotalLength(); draw.style.strokeDasharray = len; update();
    }
    function update() {
      var r = wrap.getBoundingClientRect(), p = (innerHeight * .65 - r.top) / r.height;
      p = reduce ? 1 : Math.max(0, Math.min(1, p));
      draw.style.strokeDashoffset = len * (1 - p);
      var pt = draw.getPointAtLength(len * p); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
      dot.style.opacity = p > 0.01 && p < 0.99 ? 1 : 0;
      cards.forEach(function (c) { var cr = c.getBoundingClientRect(); c.classList.toggle('lit', reduce || (cr.top + cr.height / 2 - r.top) / r.height <= p + .02); });
    }
    build(); addEventListener('resize', build); addEventListener('scroll', update, { passive: true });
    if (document.fonts) document.fonts.ready.then(build);
  });

  // Galeria arrastável
  $$('.gallery').forEach(function (g) {
    var box = g.closest('section'), prev = $('.gal-nav .prev', box), next = $('.gal-nav .next', box);
    var step = function () { var c = $('.gcard', g); return c ? c.offsetWidth + 18 : 300; };
    if (prev) prev.addEventListener('click', function () { g.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { g.scrollBy({ left: step(), behavior: 'smooth' }); });
    var down = false, sx = 0, sl = 0, moved = false;
    g.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = g.scrollLeft; g.classList.add('drag'); });
    addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; g.scrollLeft = sl - dx; });
    addEventListener('pointerup', function () { if (!down) return; down = false; g.classList.remove('drag'); });
    g.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
  });

  // Foto de fundo com leve parallax
  var bands = $$('.band > img');
  if (!reduce && bands.length) addEventListener('scroll', function () {
    bands.forEach(function (im) { var r = im.parentNode.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; im.style.transform = 'translateY(' + ((r.top + r.height / 2 - innerHeight / 2) * -0.08) + 'px)'; });
  }, { passive: true });

  // Contadores
  function count(el) {
    var raw = el.dataset.count, end = parseFloat(raw.replace(',', '.')), dec = (raw.split(',')[1] || '').length, suf = el.dataset.suffix || '', t0 = null;
    if (reduce) { el.textContent = raw + suf; return; }
    requestAnimationFrame(function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1500, 1), v = end * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toFixed(dec).replace('.', ',') + suf; if (p < 1) requestAnimationFrame(step); });
  }

  // Entrada ao rolar (só esconde o que está abaixo da tela) e contadores
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) {
      if (!e.isIntersecting) return; e.target.classList.remove('pre');
      if (e.target.dataset.count) count(e.target);
      io.unobserve(e.target);
    }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('.rv, .reveal-img').forEach(function (el) {
      if (!reduce && el.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); el.style.transitionDelay = ((el.dataset.d || 0) * 100) + 'ms'; io.observe(el); }
    });
    $$('[data-count]').forEach(function (el) { io.observe(el); });
  }

  // FAQ
  $$('.acc-item button').forEach(function (b) { b.addEventListener('click', function () {
    var it = b.closest('.acc-item'), o = !it.classList.contains('open'); it.classList.toggle('open', o); b.setAttribute('aria-expanded', o);
  }); });

  // Formulários (integre aqui com seu backend, e-mail ou WhatsApp)
  $$('form.form').forEach(function (f) { f.addEventListener('submit', function (e) {
    e.preventDefault(); if (!f.checkValidity()) { f.reportValidity(); return; } f.classList.add('sent'); var ok = $('.form-ok', f); if (ok) ok.focus();
  }); });
  $$('input[data-mask=cep]').forEach(function (i) { i.addEventListener('input', function () { var v = i.value.replace(/\\D/g, '').slice(0, 8); i.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; }); });
  $$('input[data-mask=tel]').forEach(function (i) { i.addEventListener('input', function () { var v = i.value.replace(/\\D/g, '').slice(0, 11);
    i.value = v.length > 6 ? '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4) : v.length > 2 ? '(' + v.slice(0, 2) + ') ' + v.slice(2) : v; }); });
  $$('form.cep').forEach(function (cep) { cep.addEventListener('submit', function (e) {
    e.preventDefault(); var v = $('input', cep).value.replace(/\\D/g, ''), out = cep.parentNode.querySelector('.cep-result');
    if (v.length !== 8) { out.textContent = 'Digite os 8 números do CEP.'; return; }
    out.textContent = 'Boa notícia: temos fibra na sua região. Vamos para a assinatura...';
    setTimeout(function () { location.href = 'assine.html#cep-' + v; }, 900);
  }); });

  // Assine já: plano pela URL e resumo ao lado
  var radios = $$('input[name=plano]');
  function sync() { var r = $('input[name=plano]:checked'), s = $('.summary'); if (!r || !s) return;
    $('[data-s=name]', s).textContent = r.dataset.name; $('[data-s=speed]', s).innerHTML = r.dataset.speed + '<small>' + r.dataset.unit + '</small>';
    $('[data-s=price]', s).textContent = 'R$ ' + r.dataset.price; $('[data-s=logos]', s).innerHTML = r.dataset.logos; }
  var h = location.hash.slice(1);
  if (h) { var pre = $('input[name=plano][value="' + h + '"]'); if (pre) pre.checked = true;
    var m = h.match(/^cep-(\\d{8})$/), ci = document.getElementById('a-cep'); if (m && ci) ci.value = m[1].slice(0, 5) + '-' + m[1].slice(5); }
  radios.forEach(function (r) { r.addEventListener('change', sync); }); sync();

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
`;

// ---------- partes ----------
const shortName = p => p.name.replace('Vyra ', '');
const attr = s => s.replace(/'/g, '&#39;');

function header(c, page) {
  return `<div class="progress" aria-hidden="true"></div>
<header class="hdr">
  <div class="container">
    <a class="brand" href="index.html" aria-label="Vyra, página inicial">${logo()}</a>
    <button class="menu-btn" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav">${icon('menu')}</button>
    <nav class="nav" id="nav" aria-label="Principal">
      ${c.basicNav.map(n => `<a href="${n.href}"${n.id === page ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}
      <div class="actions">
        <a class="btn btn-wa" href="${c.contact.whatsappLink}" target="_blank" rel="noopener">${socialIcon('whatsapp')}WhatsApp</a>
        <a class="btn btn-red" href="assine.html"${page === 'assine' ? ' aria-current="page"' : ''}>Assine já</a>
      </div>
    </nav>
  </div>
</header>`;
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
        <h2>Onde atendemos</h2>
        <p>Fibra óptica em Marialva e região, chegando a novas cidades do interior. Confira se a Vyra já está disponível no seu endereço.</p>
        <div class="chips">${c.cities.now.map(x => `<span class="on">${x}</span>`).join('')}${c.cities.soon.map(x => `<span>${x}<small>em breve</small></span>`).join('')}</div>
      </div>
    </div>
    <div class="foot-brand">${logo()}<b>${esc(c.brand.slogan)}</b></div>
    <div class="cols">
      <div><h3>Navegação</h3><ul>${c.basicNav.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}<li><a href="assine.html">Assine já</a></li></ul></div>
      <div><h3>Planos</h3><ul>${c.combos.map(p => `<li><a href="assine.html#${p.id}">${p.name} · ${p.speed} ${p.unit}</a></li>`).join('')}<li><a href="empresas.html">Vyra Empresas</a></li></ul></div>
      <div><h3>Fale com a gente</h3><ul><li>WhatsApp: ${c.contact.whatsapp}</li><li>Telefone: ${c.contact.phone}</li><li>${c.contact.email}</li><li>${c.contact.hours[1][0]}: ${c.contact.hours[1][1]}</li></ul></div>
      <div><h3>Redes sociais</h3>${socialLinks(c)}</div>
    </div>
    <div class="bottom"><span>© <span id="year">2026</span> Vyra Fibra. Todos os direitos reservados.</span><span>A Vyra é uma empresa de telecomunicações inscrita no CNPJ 00.000.000/0001-00 com licença SCM da Anatel. [EXEMPLO]</span></div>
  </div>
</footer>
<a class="wa-float" href="${c.contact.whatsappLink}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${socialIcon('whatsapp')}</a>`;
}

function stage(c) {
  const BF = { bf: true, alt: 'Black Friday Vyra: 50% de desconto', tag: 'Black Friday', title: 'Wi-Fi 6 e fibra <em>pela metade do preço.</em>', text: '50% de desconto nos 3 primeiros meses em todos os planos. A partir de R$ 49,95 por mês, com instalação grátis (oferta de exemplo).', price: '49,95', cta: 'assine.html', streams: ['YouTube Premium'] };
  const slides = [BF, ...c.slides];
  const tabsInfo = [['Black Friday', '50% off por 3 meses'], ['Plano Família', '800 Mega + streaming'], ['YouTube Premium', 'incluso em todos'], ['Combo completo', '1 Giga + 4 streamings']];
  return `<section class="stage" aria-roledescription="carrossel" aria-label="Ofertas Vyra">
  <div class="slides">${slides.map((s, i) => `
    <div class="slide${i === 0 ? ' on' : ''}${s.bf ? ' bf' : ''}" aria-roledescription="slide" aria-label="${i + 1} de ${slides.length}">
      ${s.bf ? `<div class="bf2" aria-hidden="true">
        <svg class="bf2-wifi" viewBox="0 0 400 300"><path d="M20 120a254 254 0 0 1 360 0"/><path d="M70 170a183 183 0 0 1 260 0"/><path d="M120 220a113 113 0 0 1 160 0"/><circle cx="200" cy="268" r="22"/></svg>
        <span class="bf2-band">Black <em>Friday</em></span>
        <div class="bf2-tag"><b>50<small>%</small></b><span>de desconto</span></div>
        <span class="bf2-mini m1"><svg viewBox="0 0 24 24"><path d="M2.5 9a13.5 13.5 0 0 1 19 0"/><path d="M5.8 12.6a9 9 0 0 1 12.4 0"/><path d="M9.1 16.1a4.5 4.5 0 0 1 5.8 0"/><circle cx="12" cy="19.5" r="1.2" fill="currentColor" stroke="none"/></svg></span><span class="bf2-mini m2"><svg viewBox="0 0 24 24"><path d="M2.5 9a13.5 13.5 0 0 1 19 0"/><path d="M5.8 12.6a9 9 0 0 1 12.4 0"/><path d="M9.1 16.1a4.5 4.5 0 0 1 5.8 0"/><circle cx="12" cy="19.5" r="1.2" fill="currentColor" stroke="none"/></svg></span><span class="bf2-mini m3"><svg viewBox="0 0 24 24"><path d="M2.5 9a13.5 13.5 0 0 1 19 0"/><path d="M5.8 12.6a9 9 0 0 1 12.4 0"/><path d="M9.1 16.1a4.5 4.5 0 0 1 5.8 0"/><circle cx="12" cy="19.5" r="1.2" fill="currentColor" stroke="none"/></svg></span><span class="bf2-mini m4"><svg viewBox="0 0 24 24"><path d="M2.5 9a13.5 13.5 0 0 1 19 0"/><path d="M5.8 12.6a9 9 0 0 1 12.4 0"/><path d="M9.1 16.1a4.5 4.5 0 0 1 5.8 0"/><circle cx="12" cy="19.5" r="1.2" fill="currentColor" stroke="none"/></svg></span>
      </div>` : `<img src="${IMG}${s.img}" alt="${esc(s.alt)}"${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}>`}
      <div class="container"><div class="copy">
        <span class="tag">${s.tag}</span>
        ${i === 0 ? `<h1>${s.title}</h1>` : `<h2>${s.title}</h2>`}
        <p>${s.text}</p>
        <div class="logos">${streamLogos(s.streams || [])}</div>
        <div class="actions"><a class="btn btn-white" href="${s.cta}">Assine já ${icon('arrow')}</a><a class="btn btn-ghost" href="#planos">Ver planos</a></div>
      </div></div>
      ${s.bf ? '' : `<div class="glass brandc">${logo()}<span>Fibra óptica<br>no interior</span></div>
      <div class="glass price"><small>a partir de</small><b>R$ ${s.price}</b><small>por mês · exemplo</small></div>`}
    </div>`).join('')}
  </div>
  <div class="tabs-bar"><div class="container">${tabsInfo.map((t, i) => `<button type="button" class="stab" aria-current="${i === 0}" aria-label="Oferta: ${t[0]}"><i></i><b>${t[0]}</b><span>${t[1]}</span></button>`).join('')}</div></div>
</section>`;
}

function ribbon(c) {
  const items = [...c.streamings.map(s => `<span class="item">${brandTile(s)}</span>`), '<span class="item">Wi-Fi 6 incluso</span>', '<span class="item">Instalação grátis</span>', '<span class="item">Suporte local 24h</span>', '<span class="item">100% fibra óptica</span>'];
  const row = items.join('<span class="dot"></span>') + '<span class="dot"></span>';
  return `<div class="ribbon" aria-label="Incluso nos planos Vyra"><div class="track">${row}<span aria-hidden="true" style="display:contents">${row}</span></div></div>`;
}

function phero(c, img, alt, title, lead, crumb, glass = true) {
  return `<section class="phero">
  <img src="${IMG}${img}" alt="${esc(alt)}" fetchpriority="high">
  <div class="container">
    <div class="crumbs"><a href="index.html">Início</a> / ${crumb}</div>
    <h1>${title}</h1><p>${lead}</p>
  </div>
  ${glass ? `<div class="glass price"><small>planos a partir de</small><b>R$ ${c.combos[0].price}</b><small>por mês · exemplo</small></div>` : ''}
</section>`;
}

function planCard(p, biz, i) {
  const price = p.price ? `<div class="price"><small>R$</small><b>${p.price}</b><small>/mês</small></div>` : `<div class="price"><span class="ask">Sob consulta</span></div>`;
  const href = biz ? 'contato.html' : `assine.html#${p.id}`;
  const label = biz ? (p.price ? 'Contratar' : 'Pedir proposta') : 'Quero esse';
  let streams = '';
  if (p.streams) {
    const choice = p.streams.find(s => s.includes(' ou '));
    const base = p.streams.filter(s => !s.includes(' ou '));
    if (choice) {
      const opts = choice.split(' ou ');
      streams = `<div class="streams"><span>Streaming incluso · escolha 1</span><div class="logos">${streamLogos([...base, opts[0]])}</div>
        <div class="choose" role="group" aria-label="Escolha o streaming">${opts.map((o, k) => `<button type="button" aria-pressed="${k === 0}" data-logos='${attr(streamLogos([...base, o]))}'>${o}</button>`).join('')}</div></div>`;
    } else streams = `<div class="streams"><span>Streaming incluso</span><div class="logos">${streamLogos(p.streams)}</div></div>`;
  }
  return `<article class="plan rv${p.featured ? ' featured' : ''}" data-d="${i}">
    ${p.featured ? `<span class="badge">${p.tag}</span>` : `<span class="tag">${p.tag}</span>`}
    <div class="ph">${logo('logo', p.featured ? '#FFFFFF' : '#E11D2E')}<b>${shortName(p)}</b></div>
    <div class="speed">${p.speed}<small>${p.unit}</small></div>
    ${streams}
    <ul>${p.features.map(f => `<li>${icon('check')}${f}</li>`).join('')}</ul>
    ${price}
    <a class="btn ${p.featured ? 'btn-white' : 'btn-primary'}" href="${href}">${label}</a>
  </article>`;
}

function plansSection(c, mode = 'both') {
  const res = `<div class="plans">${c.combos.map((p, i) => planCard(p, false, i)).join('')}</div>
    <p class="note">Valores de exemplo. Streamings sujeitos a parceria e às regras de cada serviço; as marcas pertencem aos seus donos.</p>`;
  const biz = `<div class="plans">${c.businessPlans.map((p, i) => planCard(p, true, i)).join('')}</div><p class="note">Valores de exemplo. Planos empresariais com contrato e nota fiscal.</p>`;
  const title = mode === 'biz' ? 'Planos <em>Vyra Empresas</em>' : 'Escolha seu plano <em>Vyra</em>';
  const sub = mode === 'biz' ? 'Conexão estável, IP fixo e SLA para quem não pode parar.' : 'Fibra até a sua casa, com os streamings que você já usa.';
  const body = mode === 'both'
    ? `<div style="text-align:center"><div class="ptabs" role="tablist" aria-label="Tipo de plano"><span class="pill" aria-hidden="true"></span>
        <button role="tab" aria-selected="true" aria-controls="tab-res" id="t-res">Residencial</button>
        <button role="tab" aria-selected="false" aria-controls="tab-biz" id="t-biz">Empresas</button></div></div>
      <div class="tab-panel" id="tab-res" role="tabpanel" aria-labelledby="t-res">${res}</div>
      <div class="tab-panel" id="tab-biz" role="tabpanel" aria-labelledby="t-biz" hidden>${biz}</div>`
    : (mode === 'biz' ? biz : res);
  return `<section class="section alt" id="planos"><div class="container">
    <div class="head center rv"><span class="kicker">Planos</span><h2>${title}</h2><p>${sub}</p></div>
    ${body}
  </div></section>`;
}

function rowPlans(c) {
  return `<section class="section alt" id="planos"><div class="container">
    <div class="head center rv"><span class="kicker">Planos residenciais</span><h2>Escolha seu plano <em>Vyra</em></h2><p>Fibra até a sua casa, Wi-Fi 6 e streaming incluso.</p></div>
    <div class="prows">${c.combos.map((p, i) => `<article class="prow rv${p.featured ? ' featured' : ''}" data-d="${i}">
      ${p.featured ? `<span class="badge">${p.tag}</span>` : ''}
      <div><div class="ph">${logo('logo', p.featured ? '#FFFFFF' : '#E11D2E')}<b>${shortName(p)}</b></div><div class="speed">${p.speed}<small>${p.unit}</small></div></div>
      <div class="mid"><div class="logos">${streamLogos(p.streams)}</div><ul>${p.features.map(x => `<li>${icon('check')}${x}</li>`).join('')}</ul></div>
      <div class="side"><div class="price"><small>R$ </small><b>${p.price}</b><small>/mês</small></div><a class="btn ${p.featured ? 'btn-white' : 'btn-primary'}" href="assine.html#${p.id}">Quero o ${shortName(p)}</a></div>
    </article>`).join('')}</div>
    <p class="note">Valores de exemplo. Streamings sujeitos a parceria e às regras de cada serviço; as marcas pertencem aos seus donos.</p>
  </div></section>`;
}

function bizPlans(c) {
  return `<section class="section alt" id="planos"><div class="container">
    <div class="head center rv"><span class="kicker">Planos empresariais</span><h2>Planos <em>Vyra Empresas</em></h2><p>IP fixo, SLA em contrato e atendimento prioritário.</p></div>
    <div class="bplans">${c.businessPlans.map((p, i) => `<article class="bplan rv${p.featured ? ' featured' : ''}" data-d="${i}">
      ${p.featured ? `<span class="badge">${p.tag}</span>` : ''}<span class="tag">${p.featured ? 'Empresas' : p.tag}</span>
      <span class="name">${p.name}</span><div class="speed">${p.speed}<small>${p.unit}</small></div>
      <ul>${p.features.map(x => `<li>${icon('check')}${x}</li>`).join('')}</ul>
      <div class="price">${p.price ? `<small>R$ </small><b>${p.price}</b><small>/mês</small>` : '<span class="ask">Sob consulta</span>'}</div>
      <a class="btn ${p.featured ? 'btn-primary' : 'btn-white'}" href="#proposta">${p.price ? 'Contratar' : 'Pedir proposta'}</a>
    </article>`).join('')}</div>
    <p class="note">Valores de exemplo. Planos empresariais com contrato e nota fiscal.</p>
  </div></section>`;
}

function compare(c) {
  const ids = c.combos.map(p => p.id);
  const cell = v => v === true ? `<span class="yes" aria-label="Sim">${icon('check')}</span>` : v === false ? '<span class="no" aria-label="Não">—</span>' : Array.isArray(v) ? `<div class="logos">${streamLogos(v)}</div>` : v;
  return `<section class="section"><div class="container">
    <div class="head center rv"><span class="kicker">Comparativo</span><h2>Compare os planos <em>lado a lado</em></h2><p>Tudo o que vem em cada plano, sem letra miúda.</p></div>
    <div class="compare-wrap rv">
      <table class="compare">
        <thead><tr><th scope="col">O que vem<br>no plano</th>${c.combos.map(p => `<th scope="col"${p.featured ? ' class="feat"' : ''}><div class="colh">${logo('logo', p.featured ? '#FFFFFF' : '#E11D2E')}<b>${shortName(p)}</b><span>${p.tag}</span></div></th>`).join('')}</tr></thead>
        <tbody>${COMPARE.map(([label, vals]) => `<tr><th scope="row">${label}</th>${ids.map((id, k) => `<td${c.combos[k].featured ? ' class="feat"' : ''}>${cell(vals[id])}</td>`).join('')}</tr>`).join('')}
          <tr><th scope="row">Mensalidade</th>${c.combos.map(p => `<td class="pr${p.featured ? ' feat' : ''}"><small>R$ </small><b>${p.price}</b><small>/mês</small></td>`).join('')}</tr>
        </tbody>
        <tfoot><tr><td></td>${c.combos.map(p => `<td${p.featured ? ' class="feat"' : ''}><a class="btn ${p.featured ? 'btn-primary' : 'btn-outline'}" href="assine.html#${p.id}">Assinar ${shortName(p)}</a></td>`).join('')}</tr></tfoot>
      </table>
    </div>
    <p class="compare-hint">Arraste a tabela para o lado para ver todos os planos.</p>
  </div></section>`;
}

function bento(c) {
  return `<section class="section alt"><div class="container">
    <div class="head rv"><span class="kicker">Por que a Vyra</span><h2>Tecnologia de capital, <em>atendimento de vizinho.</em></h2></div>
    <div class="bento">
      <div class="tile photo rv"><img src="${IMG}familia_cinco.jpg" alt="Pai, mãe e três filhos sorrindo juntos no sofá" style="object-position:50% 62%" loading="lazy"><span class="vbug tl">${logo()}</span><h3>100% <b>fibra óptica</b></h3><p>Do poste até o seu roteador, sem trecho de cabo metálico.</p></div>
      <div class="tile grad rv" data-d="1"><div class="big"><span data-count="1" data-suffix="">1</span><small>Giga</small></div><p>Velocidade máxima, com Wi-Fi 6 mesh.</p></div>
      <div class="tile rv" data-d="2"><div class="ico-box">${duo('headset')}</div><div><h3>Suporte 24h</h3><p>Gente da região atende.</p></div></div>
      <div class="tile dark wide rv" data-d="1"><h3>Streaming na conta</h3><div class="logos lg">${streamLogos(c.streamings)}</div></div>
      <div class="tile rv" data-d="2"><div class="ico-box">${duo('calendar')}</div><div><h3>Instalação grátis</h3><p>No dia que você escolher.</p></div></div>
      <div class="tile rv" data-d="3"><div class="ico-box">${duo('shield')}</div><div><h3>Sem letra miúda</h3><p>A velocidade contratada é a entregue.</p></div></div>
    </div>
  </div></section>`;
}

function pathSection(items, kicker, title, sub, alt) {
  return `<section class="section${alt ? ' alt' : ''}"><div class="container">
    <div class="head center rv"><span class="kicker">${kicker}</span><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>
    <div class="path">
      <svg class="line" aria-hidden="true"><defs><linearGradient id="pathgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A3D"/><stop offset="1" stop-color="#E11D2E"/></linearGradient></defs>
        <path class="track"/><path class="draw"/><circle class="head-dot" r="8" cx="-20" cy="-20"/></svg>
      ${items.map((it, i) => `<div class="pcard"><span class="num">${it.num || i + 1}</span><h3>${it.title}</h3><p>${it.text}</p>${it.extra || ''}</div>`).join('')}
    </div>
  </div></section>`;
}

function streamingSplit(c) {
  return `<section class="section"><div class="container split">
    <div class="media rv rv-l"><img src="${IMG}tv_pai_filho.jpg" alt="Pai e filho assistindo TV no sofá" loading="lazy"><span class="vbug tl">${logo()}</span>
      <div class="float"><b>4K</b><span>sem travar,<br>no horário de pico</span></div></div>
    <div class="copy-block rv rv-r"><span class="kicker">Internet + streaming</span>
      <h2>Seus streamings favoritos <em>na conta da internet.</em></h2>
      <p>YouTube Premium em qualquer plano. No Família, você escolhe mais um. No Ultra, leva todos, numa fatura só.</p>
      <div class="logos lg">${streamLogos(c.streamings)}</div>
      <a class="btn btn-primary" href="#planos">Comparar planos ${icon('arrow')}</a>
    </div>
  </div></section>`;
}

function gallery() {
  const items = [
    ['amigos_celular.jpg', 'Dois amigos rindo de um vídeo no celular', 'Com os amigos', 'Vídeo e chamada sem travar.', 'residencial.html'],
    ['amigos_game.jpg', 'Dois amigos rindo enquanto jogam videogame no sofá', 'Jogos sem lag', 'Baixa latência para jogar online.', 'assine.html#ultra'],
    ['mulher_videochamada.jpg', 'Mulher em videochamada', 'Home office', 'Reunião estável e upload rápido.', 'assine.html#familia'],
    ['idosa_celular.jpg', 'Senhora usando o celular', 'Para todas as idades', 'Simples, com suporte que explica.', 'contato.html'],
    ['mae_tablet.jpg', 'Mãe com bebês e tablet', 'Crianças em casa', 'Desenhos e aulas com controle dos pais.', 'assine.html#familia'],
    ['jovem_notebook.jpg', 'Jovem sorrindo ao lado do notebook', 'Pequenas empresas', 'Maquininha e sistema sempre online.', 'empresas.html'],
  ];
  return `<section class="section" style="padding-bottom:70px"><div class="container gal-top">
      <div class="head rv" style="margin:0"><span class="kicker">Conexão que você merece</span><h2>Para todos os <em>momentos.</em></h2></div>
      <div class="gal-nav"><button type="button" class="prev" aria-label="Anterior">${icon('arrow')}</button><button type="button" class="next" aria-label="Próximo">${icon('arrow')}</button></div>
    </div>
    <div class="gallery" tabindex="0" aria-label="Galeria de momentos">${items.map(g => `<div class="gcard"><img src="${IMG}${g[0]}" alt="${g[1]}" loading="lazy" draggable="false"><div class="cap"><b>${g[2]}</b><span>${g[3]}</span><a href="${g[4]}">Ver plano ideal →</a></div></div>`).join('')}</div>
  </section>`;
}

function bizBand() {
  return `<section class="band"><img src="${IMG}equipe_comemora.jpg" alt="Equipe diversa comemorando em frente ao notebook" style="object-position:50% 30%" loading="lazy">
  <div class="container">
    <span class="kicker">Vyra Empresas</span>
    <h2>Internet empresarial <em>que não para.</em></h2>
    <p>Link dedicado, IP fixo, SLA em contrato e um gerente de conta que conhece a sua operação.</p>
    <div class="counters"><div><b data-count="99,9" data-suffix="%">99,9%</b><span>de disponibilidade (meta)</span></div><div><b data-count="4" data-suffix="h">4h</b><span>SLA no link dedicado</span></div><div><b data-count="24" data-suffix="/7">24/7</b><span>monitoramento</span></div></div>
    <a class="btn btn-primary" href="empresas.html">Conhecer planos empresariais ${icon('arrow')}</a>
  </div></section>`;
}

function reviews(c) {
  const initials = w => w.replace(/^(Dona|Seu) /, '').split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();
  const card = r => `<blockquote class="review"><div class="stars" aria-label="5 estrelas">★★★★★</div><p>“${r.text}”</p><footer><span class="avatar">${initials(r.name)}</span><div><b>${r.name}</b>${r.where}</div><span class="plan-tag">${r.plan}</span></footer></blockquote>`;
  const half = Math.ceil(c.reviews.length / 2), r1 = c.reviews.slice(0, half).map(card).join(''), r2 = c.reviews.slice(half).map(card).join('');
  return `<section class="section alt"><div class="container">
    <div class="head center rv"><span class="kicker">Avaliações</span><h2>Quem já é Vyra <em>recomenda</em></h2><p>Avaliações de exemplo, para substituir por relatos reais de clientes.</p></div></div>
    <div class="marquee" aria-label="Avaliações de clientes"><div class="track">${r1}<div aria-hidden="true" style="display:contents">${r1}</div></div></div>
    <div class="marquee rev" aria-hidden="true"><div class="track">${r2}${r2}</div></div>
  </section>`;
}

function faqBlock(c, n) {
  const list = n ? c.faq.slice(0, n) : c.faq;
  return `<section class="section"><div class="container faq-2">
    <div class="faq-side rv rv-l">
      <div class="head" style="margin:0"><span class="kicker">Dúvidas</span><h2>Perguntas <em>frequentes</em></h2><p>Não achou sua resposta? Um técnico da região responde no WhatsApp.</p></div>
      <div class="media"><img src="${IMG}mulher_ligacao.jpg" alt="Atendente sorrindo ao telefone" loading="lazy"><span class="vbug tr">${logo()}</span><div class="float"><b>24h</b><span>suporte por<br>gente de verdade</span></div></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-primary" href="${c.contact.whatsappLink}" target="_blank" rel="noopener">${socialIcon('whatsapp')}Chamar no WhatsApp</a>${n ? '<a class="btn btn-outline" href="faq.html">Todas as perguntas</a>' : ''}</div>
    </div>
    <div class="acc rv rv-r">${list.map((f, i) => `<div class="acc-item"><button aria-expanded="false" aria-controls="q${i}">${f.q}<span class="pm">${icon('plus')}</span></button><div class="acc-body" id="q${i}"><div><p>${f.a}</p></div></div></div>`).join('')}</div>
  </div></section>`;
}

function finalCta() {
  return `<section class="band fire"><img src="${IMG}fibra.jpg" alt="" loading="lazy">
  ${logo('watermark', 'rgba(255,255,255,.14)')}
  <div class="container">
    <h2>Pronto para navegar <em>em outro nível?</em></h2>
    <p>Consulte a cobertura na sua rua e contrate hoje mesmo.</p>
    <form class="cep" novalidate><label class="sr" for="cep-final">CEP</label><input id="cep-final" inputmode="numeric" placeholder="Digite seu CEP" data-mask="cep" required><button class="btn btn-white" type="submit">Consultar cobertura</button></form>
    <div class="cep-result" role="status" aria-live="polite"></div>
  </div></section>`;
}

function contactForm(biz) {
  return `<form class="form form-card" novalidate>
    <div class="row"><label for="c-nome">Nome<input id="c-nome" autocomplete="name" required></label><label for="c-tel">WhatsApp<input id="c-tel" inputmode="tel" data-mask="tel" autocomplete="tel" required></label></div>
    ${biz ? `<div class="row"><label for="c-emp">Empresa<input id="c-emp" autocomplete="organization" required></label><label for="c-cnpj">CNPJ<input id="c-cnpj" inputmode="numeric"></label></div>` : ''}
    <label for="c-email">E-mail<input id="c-email" type="email" autocomplete="email" required></label>
    <label for="c-assunto">Assunto<select id="c-assunto">${biz ? '<option>Proposta de link dedicado</option><option>Plano Empresa 400</option><option>Plano Empresa 800</option><option>Outro</option>' : '<option>Quero contratar</option><option>Proposta para empresa</option><option>Suporte técnico</option><option>Financeiro</option><option>Outro</option>'}</select></label>
    <label for="c-msg">Mensagem<textarea id="c-msg" required></textarea></label>
    <div><button class="btn btn-primary" type="submit">${biz ? 'Pedir proposta' : 'Enviar mensagem'} ${icon('arrow')}</button></div>
    <div class="form-ok" tabindex="-1" role="status">${biz ? 'Pedido recebido. Um consultor fala com você em breve.' : 'Mensagem enviada. Respondemos em breve.'}</div>
  </form>`;
}

function infoList(c) {
  return `<div class="info">
    <a class="item" href="${c.contact.whatsappLink}" target="_blank" rel="noopener"><span class="ib">${socialIcon('whatsapp')}</span><div><b>WhatsApp</b><span>${c.contact.whatsapp}</span></div></a>
    <div class="item"><span class="ib">${icon('phone')}</span><div><b>Telefone</b><span>${c.contact.phone}</span></div></div>
    <div class="item"><span class="ib">${icon('mail')}</span><div><b>E-mail</b><span>${c.contact.email}</span></div></div>
    <a class="item" href="${MAPS}" target="_blank" rel="noopener"><span class="ib">${icon('pin')}</span><div><b>Endereço</b><span>${c.contact.address} · ${c.contact.city}</span></div></a>
    <div class="item"><span class="ib">${icon('clock')}</span><div>${c.contact.hours.map(h => `<b>${h[0]}</b><span>${h[1]}</span>`).join('<br>')}</div></div>
    <div class="item" style="justify-content:space-between;flex-wrap:wrap"><b>Siga a Vyra</b>${socialLinks(c)}</div>
  </div>`;
}

const STEPS = c => [
  { title: 'Consulte a cobertura', text: 'Informe seu CEP e veja na hora se a fibra Vyra já chega na sua rua.' },
  { title: 'Escolha o plano e o streaming', text: 'Start, Família ou Ultra. No Família, você escolhe entre Max e Prime Video.', extra: `<div class="logos" style="justify-content:center">${streamLogos(c.streamings)}</div>` },
  { title: 'Agende a instalação', text: 'Você escolhe o dia e o período. Instalação grátis, feita por técnicos da região.' },
  { title: 'Conecte-se', text: 'O técnico testa a velocidade com você e deixa o Wi-Fi 6 configurado.' },
];

function profileCard(img, alt, title, text, href, plan, d) {
  return `<a class="profile rv" data-d="${d}" href="${href}"><img src="${IMG}${img}" alt="${alt}" loading="lazy"><div><h3>${title}</h3><p>${text}</p><span class="go">${plan} →</span></div></a>`;
}

// ---------- páginas ----------
const pages = {
  index: c => `${header(c, 'index')}
<main>
  ${stage(c)}
  ${ribbon(c)}
  ${plansSection(c, 'both')}
  ${bento(c)}
  ${pathSection(STEPS(c), 'Como funciona', 'Da consulta ao Wi-Fi <em>em 4 passos</em>', 'Simples, rápido e sem burocracia.', false)}
  ${gallery()}
  ${bizBand()}
  ${reviews(c)}
  ${finalCta()}
</main>
${footer(c)}`,

  sobre: c => `${header(c, 'sobre')}
<main>
  ${phero(c, 'familia_sofa.jpg', 'Família sorrindo no sofá', 'Feita no interior, <em>para o interior.</em>', c.about.intro, 'Sobre nós', false)}
  <section class="section"><div class="container split">
    <div class="media rv rv-l"><img src="${IMG}mulher_ligacao.jpg" alt="Atendente sorrindo ao telefone" loading="lazy"><span class="vbug tl">${logo()}</span><div class="float"><b>24h</b><span>suporte por gente<br>da região</span></div></div>
    <div class="copy-block rv rv-r"><span class="kicker">Nossa história</span><h2>Gente de perto, <em>fibra de verdade.</em></h2>${c.about.story.map(p => `<p>${p}</p>`).join('')}
      <div class="counters dark"><div><b data-count="100" data-suffix="%">100%</b><span>fibra óptica</span></div><div><b data-count="24" data-suffix="h">24h</b><span>de suporte</span></div><div><b data-count="1" data-suffix=" Giga">1 Giga</b><span>velocidade máxima</span></div></div></div>
  </div></section>
  ${pathSection([
    { num: duo('fiber').replace('class="duo"', 'class="duo" style="width:24px;height:24px"'), title: 'Missão', text: c.about.mission },
    { num: duo('home').replace('class="duo"', 'class="duo" style="width:24px;height:24px"'), title: 'Visão', text: c.about.vision },
    { num: duo('shield').replace('class="duo"', 'class="duo" style="width:24px;height:24px"'), title: 'Valores', text: c.about.valuesText },
  ], 'O que nos move', 'Missão, visão <em>e valores</em>', '', true)}
</main>
${footer(c)}`,

  residencial: c => `${header(c, 'residencial')}
<main>
  ${phero(c, 'amigos_game.jpg', 'Dois amigos rindo enquanto jogam videogame no sofá', 'Internet residencial <em>com streaming.</em>', 'Planos de 500 Mega a 1 Giga com YouTube Premium incluso, Wi-Fi 6 e instalação grátis.', 'Residencial')}
  ${rowPlans(c)}
  ${compare(c)}
  <section class="section alt"><div class="container">
    <div class="head rv"><span class="kicker">Para cada casa</span><h2>Qual plano é <em>a sua cara?</em></h2></div>
    <div class="profiles">
      ${profileCard('familia_celulares.jpg', 'Família usando celulares e tablet', 'Família conectada', 'Várias telas ao mesmo tempo.', 'assine.html#familia', 'Vyra Família', 0)}
      ${profileCard('amigos_game.jpg', 'Dois amigos rindo enquanto jogam videogame no sofá', 'Gamer', '1 Giga e baixa latência.', 'assine.html#ultra', 'Vyra Ultra', 1)}
      ${profileCard('mulher_videochamada.jpg', 'Mulher em videochamada', 'Home office', 'Reunião estável, upload rápido.', 'assine.html#familia', 'Vyra Família', 2)}
      ${profileCard('mae_tablet.jpg', 'Mãe com bebês e tablet', 'Crianças em casa', 'Desenhos e aulas online.', 'assine.html#start', 'Vyra Start', 3)}
    </div>
  </div></section>
  ${streamingSplit(c)}
</main>
${footer(c)}`,

  empresas: c => `${header(c, 'empresas')}
<main>
  ${phero(c, 'empreendedor_mesa.jpg', 'Empreendedor sorrindo na mesa de trabalho com notebook', 'Vyra Empresas: <em>sua operação não para.</em>', 'IP fixo, link dedicado e SLA em contrato para comércio, clínicas, indústria e agro.', 'Empresas', false)}
  ${bizPlans(c)}
  <section class="section"><div class="container split">
    <div class="media rv rv-l"><img src="${IMG}jovem_notebook.jpg" alt="Jovem sorrindo ao lado do notebook" loading="lazy"><span class="vbug tl">${logo()}</span><div class="float"><b>SLA</b><span>tempo de reparo<br>garantido em contrato</span></div></div>
    <div class="copy-block rv rv-r"><span class="kicker">Para o seu negócio</span><h2>Conexão de empresa, <em>atendimento de vizinho.</em></h2>
      <p>Maquininha, sistema na nuvem, câmeras e nota fiscal dependem da internet. A Vyra cuida para que nada disso pare.</p>
      <div class="checklist">${c.business.map(b => `<div><span class="ck">${icon('check')}</span><b>${b.title}</b><span>${b.text}</span></div>`).join('')}</div>
    </div>
  </div></section>
  <section class="section alt"><div class="container">
    <div class="head rv"><span class="kicker">Como trabalhamos</span><h2>Do diagnóstico <em>à ativação</em></h2></div>
    <div class="hsteps rv">
      <div class="hstep"><h3>Diagnóstico</h3><p>Um consultor entende a sua operação, os horários de pico e os sistemas críticos.</p></div>
      <div class="hstep"><h3>Projeto sob medida</h3><p>Definimos banda, IP fixo, redundância e o SLA ideal para o seu negócio.</p></div>
      <div class="hstep"><h3>Ativação e monitoramento</h3><p>Instalação fora do horário comercial e monitoramento 24 horas.</p></div>
    </div>
  </div></section>
  <section class="section" id="proposta"><div class="container contact-layout">
    <div style="display:grid;gap:18px"><div class="head rv" style="margin:0"><span class="kicker">Proposta</span><h2>Peça uma proposta <em>sob medida.</em></h2><p>Um consultor responde em até 1 dia útil.</p></div><div class="rv">${contactForm(true)}</div></div>
    <div class="rv" data-d="1">${infoList(c)}</div>
  </div></section>
</main>
${footer(c)}`,

  faq: c => `${header(c, 'faq')}
<main>
  ${phero(c, 'casal_celular.jpg', 'Casal rindo com o celular no sofá', 'Perguntas <em>frequentes.</em>', 'Respostas rápidas sobre instalação, planos, streaming e suporte.', 'FAQ', false)}
  ${faqBlock(c)}
</main>
${footer(c)}`,

  contato: c => `${header(c, 'contato')}
<main>
  ${phero(c, 'mulher_aceno.jpg', 'Mulher acenando numa videochamada', 'Fale com <em>a gente.</em>', 'Tire dúvidas, peça uma proposta ou fale com o suporte. Gente da região responde.', 'Contato', false)}
  <section class="section"><div class="container contact-layout">
    <div style="display:grid;gap:18px"><div class="head rv" style="margin:0"><span class="kicker">Mensagem</span><h2>Envie sua <em>mensagem</em></h2></div><div class="rv">${contactForm(false)}</div></div>
    <div class="rv" data-d="1">${infoList(c)}</div>
  </div></section>
</main>
${footer(c)}`,

  assine: c => `${header(c, 'assine')}
<main>
  ${phero(c, 'mulher_sofa_laranja.jpg', 'Mulher sorrindo com o celular no sofá', 'Assine <em>já.</em>', 'Escolha o plano, preencha seus dados e a gente agenda a instalação.', 'Assine já', false)}
  <section class="section alt" id="planos"><div class="container assine-layout">
    <form class="form form-card" novalidate>
      <fieldset><legend>1. Escolha o plano</legend>
        <div class="plan-pick">${c.combos.map(p => `<label><input type="radio" name="plano" value="${p.id}" data-name="${p.name}" data-speed="${p.speed}" data-unit="${p.unit}" data-price="${p.price}" data-logos='${attr(streamLogos(p.streams))}'${p.featured ? ' checked' : ''} required><b>${p.name}</b><span>${p.speed} ${p.unit} · R$ ${p.price}/mês</span><div class="logos">${streamLogos(p.streams)}</div></label>`).join('')}</div>
      </fieldset>
      <fieldset><legend>2. Seus dados</legend>
        <div class="row"><label for="a-nome">Nome completo<input id="a-nome" autocomplete="name" required></label><label for="a-cpf">CPF<input id="a-cpf" inputmode="numeric" required></label></div>
        <div class="row"><label for="a-tel">WhatsApp<input id="a-tel" inputmode="tel" data-mask="tel" autocomplete="tel" required></label><label for="a-email">E-mail<input id="a-email" type="email" autocomplete="email" required></label></div>
      </fieldset>
      <fieldset><legend>3. Endereço de instalação</legend>
        <div class="row"><label for="a-cep">CEP<input id="a-cep" inputmode="numeric" data-mask="cep" placeholder="00000-000" required></label><label for="a-num">Número<input id="a-num" required></label></div>
        <label for="a-rua">Rua<input id="a-rua" autocomplete="address-line1" required></label>
        <div class="row"><label for="a-bairro">Bairro<input id="a-bairro" required></label><label for="a-periodo">Melhor período<select id="a-periodo"><option>Manhã</option><option>Tarde</option><option>Sábado</option></select></label></div>
      </fieldset>
      <div><button class="btn btn-primary" type="submit">Enviar pedido de assinatura ${icon('arrow')}</button></div>
      <div class="form-ok" tabindex="-1" role="status">Pedido recebido. Vamos confirmar a cobertura e falar com você pelo WhatsApp.</div>
    </form>
    <aside class="summary" aria-live="polite">
      ${logo('logo', '#FFFFFF')}
      <span data-s="name" style="font:800 20px var(--f-display)">Vyra Família</span>
      <div class="sp" data-s="speed">800<small>Mega</small></div>
      <div class="logos" data-s="logos"></div>
      <div class="line"><span>Mensalidade</span><b data-s="price">R$ 129,90</b></div>
      <div class="line"><span>Instalação</span><b>Grátis</b></div>
      <div class="line"><span>Wi-Fi 6</span><b>Incluso</b></div>
    </aside>
  </div></section>
</main>
${footer(c)}`,
};

function build(c) {
  const out = {};
  for (const [id, fn] of Object.entries(pages)) out[id + '.html'] = shell({ c, page: id, fonts: FONTS, body: fn(c) });
  return { pages: out, css, js };
}
module.exports = { build };
