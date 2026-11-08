// MODELO BÁSICO — estilo provedor de varejo: muita foto de pessoas, carrossel de ofertas,
// planos com streaming logo em seguida. Ordem de toda página: 1) imagem  2) planos  3) restante.
const { DUO_CSS, logo, icon, duo, socialIcon, socialLinks, esc, shell } = require('./helpers');

const BR = require('./brands');

const FONTS = 'family=Outfit:wght@500;600;700;800&family=Manrope:wght@400;500;600;700';
const IMG = 'assets/img/';

// Logos dos streamings em blocos com a cor de cada marca
function brandTile(name) {
  const svg = (k, vb, fill) => `<svg viewBox="${vb}" fill="${fill}" aria-hidden="true"><path d="${BR[k].path}"/></svg>`;
  switch (name) {
    case 'Netflix': return `<span class="st st-netflix" title="Netflix">${svg('netflix', '5.4 0 13.2 24', '#E50914')}<span class="sr">Netflix</span></span>`;
    case 'YouTube Premium': return `<span class="st st-yt" title="YouTube Premium">${svg('youtube', '0 3.5 24 17', '#FF0000')}<b>Premium</b><span class="sr">YouTube</span></span>`;
    case 'Prime Video': return `<span class="st st-prime" title="Prime Video">${svg('primevideo', '0 8.3 24 7.4', '#FFFFFF')}<span class="sr">Prime Video</span></span>`;
    case 'Max': return `<span class="st st-max" title="Max">max</span>`;
    default: return '';
  }
}
function streamLogos(list) {
  return list.map(s => s.includes(' ou ')
    ? s.split(' ou ').map(brandTile).join('<i class="st-or">ou</i>')
    : brandTile(s)).join('');
}

const css = `/* Vyra · modelo Básico (fotos + ofertas) */
:root {
  --orange: #FF5A1F; --orange-600: #E8480C; --orange-700: #C2410C; --red: #E11D2E;
  --ink: #1E1512; --white: #FFFFFF; --mist: #FFF6F1; --peach: #FFD9C7; --line: #F5E2D8; --muted: #6E5A52;
  --grad: linear-gradient(135deg, #FF6A2B 0%, #E8480C 50%, #E11D2E 100%);
  --f-display: "Outfit", system-ui, sans-serif; --f-body: "Manrope", system-ui, sans-serif;
  --max: 1200px; --radius: 18px;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--white); color: var(--ink); font: 400 16px/1.6 var(--f-body); }
img { max-width: 100%; display: block; }
a { color: var(--orange-700); }
h1, h2, h3 { font-family: var(--f-display); line-height: 1.12; margin: 0; text-wrap: balance; }
h1 { font-size: clamp(34px, 5.2vw, 60px); font-weight: 800; letter-spacing: -0.03em; }
h2 { font-size: clamp(28px, 3.6vw, 42px); font-weight: 800; letter-spacing: -0.025em; }
h3 { font-size: 20px; font-weight: 700; letter-spacing: -0.01em; }
h2 em, h1 em { font-style: normal; color: var(--orange); }
p { margin: 0; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.container { max-width: var(--max); margin: 0 auto; padding-left: max(20px, env(safe-area-inset-left)); padding-right: max(20px, env(safe-area-inset-right)); }
.section { padding: 80px 0; }
.section.alt { background: var(--mist); }
.head { display: grid; gap: 12px; margin-bottom: 40px; max-width: 680px; }
.head.center { margin-left: auto; margin-right: auto; text-align: center; justify-items: center; }
.head p { color: var(--muted); font-size: 17px; }
.kicker { display: inline-flex; align-items: center; gap: 8px; font: 700 12.5px/1 var(--f-display); letter-spacing: .12em; text-transform: uppercase; color: var(--orange-700); }

/* Logos dos streamings */
.st { display: inline-flex; align-items: center; justify-content: center; gap: 4px; height: 34px; padding: 0 10px; border-radius: 9px; flex: none; box-shadow: 0 0 0 1px rgba(30,21,18,.08); transition: transform .25s ease; }
.st svg { height: 22px; width: auto; display: block; }
.st-netflix { background: #000; min-width: 34px; }
.st-netflix svg { height: 20px; }
.st-yt { background: #fff; color: #1E1512; }
.st-yt svg { height: 16px; }
.st-yt b { font: 800 12.5px/1 var(--f-display); letter-spacing: -0.01em; }
.st-prime { background: #00A8E1; padding: 0 12px; }
.st-prime svg { height: 15px; }
.st-max { background: #002BE7; color: #fff; font: 800 18px/1 var(--f-display); letter-spacing: -0.04em; padding: 0 12px; }
.st-or { font: 700 11px var(--f-display); font-style: normal; color: inherit; opacity: .75; padding: 0 2px; align-self: center; }
.logos { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.logos.lg .st { height: 46px; border-radius: 12px; padding: 0 16px; }
.logos.lg .st svg { height: 28px; }
.logos.lg .st-netflix svg { height: 28px; }
.logos.lg .st-yt svg { height: 22px; }
.logos.lg .st-yt b { font-size: 16px; }
.logos.lg .st-prime svg { height: 20px; }
.logos.lg .st-max { font-size: 24px; }
.logos .st:hover { transform: translateY(-2px); }

/* Selo da marca sobre fotos */
.vbug { position: absolute; z-index: 3; display: inline-flex; align-items: center; background: var(--white); border-radius: 12px; padding: 8px 12px; box-shadow: 0 10px 24px -12px rgba(30,21,18,.5); color: var(--orange); }
.vbug .logo { width: 62px; height: auto; display: block; }
.vbug.tr { top: 16px; right: 16px; }
.vbug.tl { top: 16px; left: 16px; }

/* Entrada suave ao rolar */
.rv { transition: opacity .7s ease, transform .7s ease; }
.rv.pre { opacity: 0; transform: translateY(26px); }
@media (prefers-reduced-motion: reduce) { .rv.pre { opacity: 1; transform: none; } }
.ico { width: 20px; height: 20px; flex: none; }
:focus-visible { outline: 2px solid var(--orange); outline-offset: 2px; }
${DUO_CSS}

/* Botões */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 26px; border-radius: 999px; font: 700 15.5px/1 var(--f-display); text-decoration: none; border: 2px solid transparent; cursor: pointer; transition: background-color .15s, color .15s, border-color .15s; }
.btn .ico { width: 18px; height: 18px; }
.btn-primary { background: var(--orange-600); color: var(--white); }
.btn-primary:hover { background: var(--orange-700); }
.btn-red { background: var(--red); color: var(--white); }
.btn-red:hover { background: #C81E2A; }
.btn-outline { border-color: var(--orange-600); color: var(--orange-700); background: transparent; }
.btn-outline:hover { background: var(--orange-600); color: var(--white); }
.btn-white { background: var(--white); color: var(--orange-700); }
.btn-white:hover { background: var(--ink); color: var(--white); }
.btn-ghost { border-color: rgba(255,255,255,.7); color: var(--white); }
.btn-ghost:hover { background: var(--white); color: var(--ink); }
.btn-wa { background: var(--white); color: var(--ink); border-color: var(--line); }
.btn-wa .ico { color: #1FA855; }
.btn-wa:hover { border-color: var(--ink); }

/* Barra superior e topo */
.topstrip { background: var(--ink); color: rgba(255,255,255,.82); font-size: 13px; }
.topstrip .container { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px 20px; padding-block: 8px; }
.topstrip b { color: var(--white); font-weight: 600; }
.topstrip a { color: var(--peach); text-decoration: none; }
.topstrip a:hover { color: var(--white); }
.topbar { background: var(--white); position: sticky; top: 0; z-index: 30; box-shadow: 0 1px 0 var(--line), 0 8px 24px -18px rgba(30,21,18,.3); }
.topbar .container { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 74px; }
.brand { color: var(--orange); display: flex; }
.brand .logo { width: 100px; height: auto; display: block; }
.nav { display: flex; align-items: center; gap: 24px; }
.nav a:not(.btn) { color: rgba(30,21,18,.78); text-decoration: none; font: 600 15px/1 var(--f-display); padding: 8px 0; border-bottom: 2px solid transparent; }
.nav a:not(.btn):hover { color: var(--ink); }
.nav a[aria-current="page"]:not(.btn) { color: var(--ink); border-color: var(--red); }
.nav .actions { display: flex; gap: 10px; margin-left: 8px; }
.nav .btn { padding: 11px 18px; font-size: 14.5px; }
.menu-btn { display: none; background: none; border: 0; color: var(--ink); padding: 8px; cursor: pointer; }
.menu-btn .ico { width: 26px; height: 26px; }
@media (max-width: 1020px) {
  .menu-btn { display: inline-flex; }
  .nav { position: absolute; left: 0; right: 0; top: 100%; background: var(--white); flex-direction: column; align-items: stretch; gap: 0; padding: 8px 20px 20px; display: none; box-shadow: 0 16px 30px -16px rgba(30,21,18,.3); }
  .nav.open { display: flex; }
  .nav a:not(.btn) { padding: 15px 0; border-bottom: 1px solid var(--line); font-size: 17px; }
  .nav a[aria-current="page"]:not(.btn) { color: var(--orange-700); border-color: var(--line); }
  .nav .actions { margin: 16px 0 0; flex-direction: column; }
}

/* Carrossel de abertura */
.hero { position: relative; overflow: hidden; background: var(--ink); }
.slides { position: relative; height: clamp(520px, 70vh, 680px); }
.slide { position: absolute; inset: 0; opacity: 0; visibility: hidden; transition: opacity .8s ease, visibility 0s linear .8s; }
.slide.on { opacity: 1; visibility: visible; transition: opacity .8s ease; }
.slide img { width: 100%; height: 100%; object-fit: cover; object-position: 70% center; transform: scale(1.06); transition: transform 7s ease-out; }
.slide.on img { transform: scale(1); }
.slide::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(232,72,12,.95) 0%, rgba(232,72,12,.82) 30%, rgba(225,29,46,.35) 58%, rgba(225,29,46,0) 75%); }
.slide .container { position: absolute; inset: 0; z-index: 2; display: flex; align-items: center; }
.slide .copy { max-width: 560px; color: var(--white); display: grid; gap: 18px; justify-items: start; }
.slide .tag { display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: 999px; background: var(--white); color: var(--red); font: 800 12.5px/1 var(--f-display); letter-spacing: .08em; text-transform: uppercase; }
.slide h1 em, .slide h2 em { color: var(--ink); }
.slide h2 { font-size: clamp(34px, 5.2vw, 60px); line-height: 1.05; letter-spacing: -0.03em; }
.slide p { font-size: 18.5px; color: rgba(255,255,255,.95); max-width: 46ch; }
.price-chip { display: inline-flex; align-items: baseline; gap: 6px; background: var(--white); color: var(--ink); border-radius: 16px; padding: 10px 18px; box-shadow: 0 14px 30px -14px rgba(30,21,18,.5); }
.price-chip small { font: 600 13px var(--f-body); color: var(--muted); }
.price-chip b { font: 800 34px/1 var(--f-display); color: var(--orange-600); letter-spacing: -0.02em; }
.slide .actions { display: flex; flex-wrap: wrap; gap: 12px; }
.hero-ctrl { position: absolute; left: 0; right: 0; bottom: 24px; z-index: 3; }
.hero-ctrl .container { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.dots { display: flex; gap: 8px; }
.dots button { width: 34px; height: 5px; border-radius: 5px; border: 0; padding: 0; background: rgba(255,255,255,.45); cursor: pointer; }
.dots button[aria-current="true"] { background: var(--white); width: 54px; }
.arrows { display: flex; gap: 10px; }
.arrows button { width: 46px; height: 46px; border-radius: 50%; border: 0; background: rgba(255,255,255,.95); color: var(--ink); display: grid; place-items: center; cursor: pointer; box-shadow: 0 8px 20px -10px rgba(0,0,0,.4); }
.arrows button:hover { background: var(--ink); color: var(--white); }
.arrows .prev .ico { transform: rotate(180deg); }
@media (max-width: 760px) {
  .slides { height: 660px; }
  .slide img { object-position: center top; height: 52%; }
  .slide::after { background: linear-gradient(180deg, rgba(232,72,12,0) 22%, rgba(232,72,12,.92) 48%, #E8480C 64%, #E11D2E 100%); }
  .slide .container { align-items: flex-end; padding-bottom: 76px; }
  .slide .copy { gap: 14px; }
  .slide p { font-size: 16px; }
  .price-chip b { font-size: 28px; }
  .arrows { display: none; }
}

/* Cabeçalho com foto (páginas internas) */
.phero { position: relative; min-height: 380px; display: flex; align-items: center; overflow: hidden; color: var(--white); background: var(--ink); }
.phero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 70% 30%; }
.phero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(232,72,12,.95) 0%, rgba(232,72,12,.8) 35%, rgba(225,29,46,.2) 70%, rgba(225,29,46,0) 85%); }
.phero .container { position: relative; z-index: 2; display: grid; gap: 14px; padding-block: 56px; width: 100%; }
.phero .crumbs { font-size: 14px; color: rgba(255,255,255,.85); }
.phero .crumbs a { color: var(--white); }
.phero p { font-size: 18.5px; max-width: 52ch; color: rgba(255,255,255,.95); }
.phero h1 { max-width: 16ch; }
.phero h1 em { color: var(--ink); }
@media (max-width: 760px) { .phero::after { background: linear-gradient(90deg, rgba(232,72,12,.94), rgba(225,29,46,.8)); } }

/* Planos */
.tabs { display: inline-flex; padding: 5px; border-radius: 999px; background: var(--white); box-shadow: 0 0 0 1px var(--line); margin-bottom: 40px; }
.tabs button { border: 0; background: none; padding: 11px 24px; border-radius: 999px; font: 700 15px/1 var(--f-display); color: var(--muted); cursor: pointer; }
.tabs button[aria-selected="true"] { background: var(--grad); color: var(--white); }
.tab-panel[hidden] { display: none; }
.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; align-items: center; }
@media (max-width: 980px) { .plans { grid-template-columns: 1fr; max-width: 440px; margin: 0 auto; gap: 30px; } }
.plan { position: relative; background: var(--white); border-radius: 24px; padding: 30px 28px; display: grid; gap: 16px; box-shadow: 0 0 0 1px var(--line), 0 24px 40px -32px rgba(30,21,18,.45); }
.plan.featured { background: var(--grad); color: var(--white); padding-block: 42px; box-shadow: 0 34px 60px -30px rgba(225,29,46,.7); }
.plan .badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--white); font: 800 12px/1 var(--f-display); letter-spacing: .08em; text-transform: uppercase; padding: 8px 14px; border-radius: 999px; white-space: nowrap; }
.plan .tag { font: 700 12.5px/1 var(--f-display); letter-spacing: .1em; text-transform: uppercase; color: var(--orange-700); }
.plan .name { font: 700 19px/1.2 var(--f-display); }
.plan .speed { font: 800 66px/.9 var(--f-display); letter-spacing: -0.04em; color: var(--orange); }
.plan.featured .speed { color: var(--white); }
.plan .speed small { font-size: 22px; letter-spacing: 0; margin-left: 6px; }
.streams { display: grid; gap: 8px; padding: 14px; border-radius: 14px; background: var(--mist); }
.plan.featured .streams { background: rgba(255,255,255,.14); }
.streams > span { font: 700 11.5px/1 var(--f-display); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.plan.featured .streams > span { color: rgba(255,255,255,.88); }
.streams div { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 11px; border-radius: 999px; background: var(--white); font: 700 13px/1 var(--f-display); font-style: normal; color: var(--ink); box-shadow: 0 0 0 1px var(--line); }
.chip::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--red); }
.plan.featured .chip { box-shadow: none; }
.plan ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 9px; font-size: 15px; }
.plan li { display: flex; gap: 10px; align-items: center; }
.plan li .ico { width: 18px; height: 18px; color: var(--orange-600); }
.plan.featured li .ico { color: var(--white); }
.plan .price { display: flex; align-items: baseline; gap: 4px; border-top: 1px solid var(--line); padding-top: 16px; }
.plan.featured .price { border-color: rgba(255,255,255,.25); }
.plan .price small { font: 600 14px var(--f-body); color: var(--muted); }
.plan.featured .price small { color: rgba(255,255,255,.88); }
.plan .price b { font: 800 40px/1 var(--f-display); letter-spacing: -0.03em; }
.plan .price .ask { font: 800 28px/1 var(--f-display); }
.plan .btn { width: 100%; }
.addons { margin-top: 40px; border-radius: 20px; padding: 22px 24px; background: var(--white); box-shadow: 0 0 0 1px var(--line); display: flex; flex-wrap: wrap; align-items: center; gap: 12px 14px; }
.addons b { font: 800 17px var(--f-display); margin-right: 6px; }
.addons .add { display: inline-flex; gap: 8px; align-items: center; padding: 9px 14px; border-radius: 12px; background: var(--mist); font-size: 14.5px; font-weight: 600; }
.addons .add em { font-style: normal; color: var(--orange-700); font-weight: 800; }
.note { font-size: 13px; color: var(--muted); margin-top: 18px; text-align: center; }

/* Faixa com foto e texto */
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.split > * { min-width: 0; }
.split.rev .media { order: 2; }
@media (max-width: 900px) { .split { grid-template-columns: 1fr; gap: 32px; } .split.rev .media { order: 0; } }
.media { position: relative; border-radius: 28px; overflow: hidden; aspect-ratio: 4 / 3; max-width: 100%; box-shadow: 0 30px 60px -36px rgba(30,21,18,.55); }
.media img { width: 100%; height: 100%; object-fit: cover; }
.media .float { position: absolute; left: 18px; bottom: 18px; background: var(--white); border-radius: 16px; padding: 12px 16px; display: flex; gap: 12px; align-items: center; box-shadow: 0 16px 30px -16px rgba(30,21,18,.5); }
.media .float b { font: 800 22px/1 var(--f-display); color: var(--orange-600); }
.media .float span { font-size: 13.5px; color: var(--muted); line-height: 1.3; }
.copy-block { display: grid; gap: 18px; justify-items: start; }
.copy-block p { color: var(--muted); font-size: 17px; }
.stream-row { display: flex; flex-wrap: wrap; gap: 8px; }
.stream-row .chip { padding: 9px 14px; font-size: 14px; }

/* Cards de diferenciais */
.grid { display: grid; gap: 18px; }
.g2 { grid-template-columns: 1fr 1fr; }
.g3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 980px) { .g3 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .g3, .g2 { grid-template-columns: 1fr; } }
.card { background: var(--white); border-radius: var(--radius); padding: 26px; display: grid; gap: 10px; align-content: start; box-shadow: 0 0 0 1px var(--line); }
.card p { color: var(--muted); font-size: 15px; }
.card.sm { padding: 18px; }
.card.sm h3 { font-size: 17px; }
.card.sm p { font-size: 14px; }
.ico-box { width: 56px; height: 56px; border-radius: 16px; background: var(--grad); display: grid; place-items: center; margin-bottom: 6px; position: relative; overflow: hidden; box-shadow: 0 12px 24px -12px rgba(232,72,12,.6); }
.ico-box::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 20% 15%, rgba(255,255,255,.3), transparent 55%); }
.card.sm .ico-box { width: 46px; height: 46px; border-radius: 13px; }

/* Fotos com legenda */
.photos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
@media (max-width: 860px) { .photos { grid-template-columns: 1fr; } }
.photo { position: relative; border-radius: 24px; overflow: hidden; aspect-ratio: 4 / 5; max-width: 100%; color: var(--white); }
.photo img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.photo:hover img { transform: scale(1.04); }
.photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 45%, rgba(30,21,18,.85)); }
.photo div { position: absolute; left: 22px; right: 22px; bottom: 22px; z-index: 2; display: grid; gap: 6px; }
.photo b { font: 800 22px/1.15 var(--f-display); }
.photo div span { font-size: 15px; color: rgba(255,255,255,.88); }
.photo .vbug { color: var(--orange); }
@media (max-width: 860px) { .photo { aspect-ratio: 16 / 10; } }

/* Perfis (Residencial) */
.profiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
@media (max-width: 980px) { .profiles { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .profiles { grid-template-columns: 1fr; } }
.profile { border-radius: 22px; overflow: hidden; background: var(--white); box-shadow: 0 0 0 1px var(--line); display: grid; align-content: start; }
.profile img { aspect-ratio: 4 / 3; width: 100%; object-fit: cover; }
.profile div { padding: 20px; display: grid; gap: 8px; }
.profile p { color: var(--muted); font-size: 14.5px; }
.profile a { font: 700 14.5px var(--f-display); text-decoration: none; }

/* Faixa com foto de fundo */
.band { position: relative; overflow: hidden; color: var(--white); background: var(--ink); }
.band > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.band::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(30,21,18,.92) 0%, rgba(30,21,18,.75) 45%, rgba(30,21,18,.25) 100%); }
.band.fire::after { background: linear-gradient(90deg, rgba(232,72,12,.94) 0%, rgba(225,29,46,.82) 50%, rgba(225,29,46,.35) 100%); }
.band .container { position: relative; z-index: 2; padding-block: 84px; display: grid; gap: 20px; justify-items: start; }
.band p { color: rgba(255,255,255,.9); font-size: 17.5px; max-width: 56ch; }
.band h2 { max-width: 20ch; }
.band h2 em { color: var(--orange); }
.band.fire h2 em { color: var(--ink); }
.band .kicker { color: var(--peach); }
.stats { display: flex; flex-wrap: wrap; gap: 14px 40px; margin-top: 6px; }
.stats div { display: grid; gap: 2px; }
.stats b { font: 800 36px/1 var(--f-display); letter-spacing: -0.02em; color: var(--orange); }
.stats span { font-size: 14px; color: rgba(255,255,255,.8); }
.stats.dark b { color: var(--orange-600); }
.stats.dark span { color: var(--muted); }
.cep { display: flex; gap: 10px; flex-wrap: wrap; width: min(560px, 100%); }
.cep input { flex: 1 1 220px; min-width: 0; border: 0; border-radius: 999px; padding: 15px 22px; font: 500 16px var(--f-body); }
.cep-result { font-weight: 700; min-height: 1.5em; }

/* Depoimentos */
.quote { background: var(--white); border-radius: var(--radius); padding: 26px; display: grid; gap: 16px; box-shadow: 0 0 0 1px var(--line); align-content: space-between; margin: 0; }
.stars { color: #FFB020; letter-spacing: 2px; font-size: 16px; }
.quote p { font-size: 15.5px; }
.quote footer { display: flex; align-items: center; gap: 12px; font-size: 13.5px; color: var(--muted); }
.avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--grad); color: var(--white); display: grid; place-items: center; font: 800 15px var(--f-display); flex: none; }
.quote footer b { display: block; color: var(--ink); font-family: var(--f-display); }

/* FAQ */
.faq { display: grid; gap: 10px; max-width: 860px; margin: 0 auto; }
.faq details { border-radius: 16px; background: var(--white); box-shadow: 0 0 0 1px var(--line); }
.faq summary { padding: 20px 22px; font: 700 17px/1.4 var(--f-display); cursor: pointer; list-style: none; display: flex; justify-content: space-between; gap: 16px; align-items: center; }
.faq summary::-webkit-details-marker { display: none; }
.faq summary .ico { color: var(--orange-600); transition: transform .2s; }
.faq details[open] summary .ico { transform: rotate(45deg); }
.faq details p { padding: 0 22px 22px; color: var(--muted); }
.center-cta { text-align: center; margin-top: 26px; }

/* Sobre */
.purpose { background: var(--grad); color: var(--white); border-radius: 26px; padding: clamp(28px, 4vw, 48px); display: grid; gap: 10px; }
.purpose small { font: 700 12.5px/1 var(--f-display); letter-spacing: .12em; text-transform: uppercase; color: var(--peach); }
.purpose p { font: 700 clamp(22px, 2.8vw, 32px)/1.3 var(--f-display); letter-spacing: -0.015em; }
.cities { display: flex; flex-wrap: wrap; gap: 10px; }
.city { padding: 10px 16px; border-radius: 999px; background: var(--white); box-shadow: 0 0 0 1px var(--line); font: 700 15px var(--f-display); }
.city.on { background: var(--ink); color: var(--white); box-shadow: none; }
.city.on::before { content: ""; display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--red); margin-right: 8px; }
.city small { font: 600 12px var(--f-body); color: var(--muted); margin-left: 6px; }

/* Formulários */
.form { display: grid; gap: 16px; }
.form .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 620px) { .form .row { grid-template-columns: 1fr; } }
label { display: grid; gap: 6px; font: 600 14.5px var(--f-display); }
input, select, textarea { font: 400 16px var(--f-body); color: var(--ink); padding: 13px 15px; border: 1px solid var(--line); border-radius: 12px; background: var(--white); width: 100%; }
input:focus, select:focus, textarea:focus { outline: 2px solid var(--orange); outline-offset: 0; border-color: var(--orange); }
textarea { min-height: 130px; resize: vertical; }
.form-ok { display: none; background: #E8FBF2; color: #0B6B41; border-radius: 12px; padding: 14px 16px; font-weight: 600; }
.form.sent .form-ok { display: block; }
.form-card { background: var(--white); border-radius: 24px; padding: clamp(22px, 4vw, 36px); box-shadow: 0 0 0 1px var(--line), 0 30px 60px -44px rgba(30,21,18,.5); }
fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 12px; }
legend { font: 800 19px var(--f-display); margin-bottom: 12px; }
.plan-pick { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 760px) { .plan-pick { grid-template-columns: 1fr; } }
.plan-pick label { position: relative; border: 1.5px solid var(--line); border-radius: 16px; padding: 18px; cursor: pointer; font-weight: 500; display: grid; gap: 4px; align-content: start; }
.plan-pick input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.plan-pick b { font: 800 19px var(--f-display); }
.plan-pick span { color: var(--muted); font: 500 14px var(--f-body); }
.plan-pick label:has(input:checked) { border-color: var(--orange-600); background: var(--mist); box-shadow: inset 0 0 0 1px var(--orange-600); }
.plan-pick label:has(input:focus-visible) { outline: 2px solid var(--orange); outline-offset: 2px; }
.contact-layout { display: grid; grid-template-columns: 1.35fr 1fr; gap: 28px; align-items: start; }
.contact-layout > * { min-width: 0; }
@media (max-width: 900px) { .contact-layout { grid-template-columns: 1fr; } }
.info-card { border-radius: 24px; overflow: hidden; background: var(--white); box-shadow: 0 0 0 1px var(--line); }
.info-card img { aspect-ratio: 16 / 9; width: 100%; object-fit: cover; }
.info-card .in { padding: 24px; display: grid; gap: 16px; }
.info-item { display: flex; gap: 12px; align-items: flex-start; }
.info-item .ico { color: var(--orange-600); margin-top: 3px; }
.info-item b { display: block; font-family: var(--f-display); }
.info-item span { color: var(--muted); font-size: 15px; }

/* Redes sociais */
.social { display: flex; gap: 10px; flex-wrap: wrap; }
.social a { width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; background: var(--orange-600); color: var(--white); transition: background-color .15s; }
.social a:hover { background: var(--red); }
.footer .social a { background: rgba(255,255,255,.1); }
.footer .social a:hover { background: var(--orange); }

/* Rodapé */
.footer { background: var(--ink); color: rgba(255,255,255,.75); padding: 64px 0 28px; font-size: 15px; }
.footer .cols { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 32px; }
@media (max-width: 860px) { .footer .cols { grid-template-columns: 1fr 1fr; } }
@media (max-width: 520px) { .footer .cols { grid-template-columns: 1fr; } }
.footer .logo { width: 116px; color: var(--white); display: block; margin-bottom: 14px; }
.footer h3 { color: var(--white); font-size: 15px; margin-bottom: 12px; }
.footer a { color: rgba(255,255,255,.75); text-decoration: none; }
.footer a:hover { color: var(--white); }
.footer ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.footer .bottom { border-top: 1px solid rgba(255,255,255,.12); margin-top: 40px; padding-top: 20px; font-size: 13px; display: grid; gap: 6px; }

.wa-float { position: fixed; right: max(18px, env(safe-area-inset-right)); bottom: max(18px, env(safe-area-inset-bottom)); width: 58px; height: 58px; border-radius: 50%; background: var(--grad); color: var(--white); display: grid; place-items: center; box-shadow: 0 10px 24px -6px rgba(232,72,12,.55); z-index: 40; }
.wa-float .ico { width: 28px; height: 28px; }

/* Cabeçalho dos cards de plano com a marca */
.plan .ph { display: flex; align-items: baseline; gap: 8px; }
.plan .ph .logo { width: 58px; height: auto; color: var(--orange); display: block; transform: translateY(3px); }
.plan.featured .ph .logo { color: var(--white); }
.plan .ph b { font: 800 22px/1 var(--f-display); letter-spacing: -0.02em; text-transform: lowercase; }
.plan .streams .logos .st { height: 30px; }
.plan .streams .logos .st svg { height: 18px; }
.plan .streams .logos .st-yt svg { height: 14px; }
.plan .streams .logos .st-prime svg { height: 13px; }
.plan .streams .logos .st-max { font-size: 16px; }

/* Hover leve */
.card, .profile, .quote, .plan, .review { transition: transform .3s ease, box-shadow .3s ease; }
.card:hover, .profile:hover, .review:hover { transform: translateY(-4px); box-shadow: 0 0 0 1px var(--line), 0 22px 36px -24px rgba(232,72,12,.45); }
.plan:hover { transform: translateY(-6px); }

/* Banners de plano (peças de campanha) */
.promos { display: grid; grid-template-columns: 1fr 1.2fr; gap: 22px; align-items: stretch; }
.promos > * { min-width: 0; }
@media (max-width: 980px) { .promos { grid-template-columns: 1fr; } }
.promo { position: relative; border-radius: 30px; overflow: hidden; color: var(--white); isolation: isolate; background: radial-gradient(circle at 25% 15%, #FF7A3D 0%, #E8480C 42%, #B3121F 100%); box-shadow: 0 40px 70px -40px rgba(179,18,31,.75); }
.promo::before { content: ""; position: absolute; inset: 0; z-index: -1; background-image: linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px); background-size: 60px 60px; }
.promo h3 { font: 800 clamp(30px, 3.4vw, 44px)/1.02 var(--f-display); letter-spacing: -0.03em; }
.promo p { font-size: 18px; color: rgba(255,255,255,.92); }
.promo-a { padding: 34px; display: grid; gap: 22px; }
.pa-body { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; align-items: end; }
@media (max-width: 520px) { .pa-body { grid-template-columns: 1fr; } }
.pa-photo { margin: 0; position: relative; border-radius: 200px 200px 22px 22px; overflow: hidden; aspect-ratio: 3 / 4; max-width: 100%; border: 4px solid rgba(255,255,255,.9); box-shadow: 0 24px 40px -20px rgba(0,0,0,.45); }
.pa-photo img { width: 100%; height: 100%; object-fit: cover; }
.pa-table { display: grid; gap: 8px; }
.pa-table > span { font: 800 16px var(--f-display); }
.pa-row { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; border: 1.5px solid rgba(255,255,255,.55); border-radius: 14px; padding: 10px 14px; }
.pa-row b { font: 800 30px/1 var(--f-display); letter-spacing: -0.03em; }
.pa-row b small { font-size: 14px; margin-left: 3px; }
.pa-row em { font: 700 15px var(--f-display); font-style: normal; }
.pa-row.hi { background: var(--white); color: var(--ink); border-color: var(--white); }
.pa-row.hi em { color: var(--orange-700); }
.pa-extra { display: grid; gap: 8px; border-radius: 14px; padding: 12px 14px; background: rgba(30,21,18,.25); }
.pa-extra span { font: 800 14px var(--f-display); }
.pa-foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.pa-foot .logo { width: 132px; height: auto; color: var(--white); display: block; }
.promo-b { display: grid; grid-template-rows: auto 1fr; }
.pb-photo { position: relative; aspect-ratio: 16 / 9; max-width: 100%; }
.pb-photo img { width: 100%; height: 100%; object-fit: cover; }
.pb-photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 45%, rgba(179,18,31,.9)); }
.pb-photo .vbug { top: 18px; left: 18px; }
.pb-copy { padding: 0 34px 34px; margin-top: -60px; position: relative; z-index: 2; display: grid; gap: 16px; }
.pb-price { display: flex; align-items: flex-end; gap: 10px; flex-wrap: wrap; }
.pb-price small { font: 800 14px/1.1 var(--f-display); text-transform: uppercase; }
.pb-price b { font: 800 clamp(64px, 8vw, 96px)/.8 var(--f-display); letter-spacing: -0.05em; }
.pb-price b sup { font-size: .38em; vertical-align: top; letter-spacing: 0; margin-left: 2px; }
.pb-price em { font: 700 14px/1.2 var(--f-display); font-style: normal; }
.pb-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.pb-tags span { padding: 6px 12px; border-radius: 999px; background: rgba(255,255,255,.16); font: 700 13px var(--f-display); }

/* Avaliações em carrossel contínuo */
.marquee { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent); mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent); padding-block: 8px; }
.marquee .track { display: flex; gap: 18px; width: max-content; animation: scrollx 70s linear infinite; }
.marquee.rev .track { animation-direction: reverse; animation-duration: 80s; margin-top: 18px; }
.marquee:hover .track { animation-play-state: paused; }
@keyframes scrollx { to { transform: translateX(calc(-50% - 9px)); } }
.review { width: 340px; flex: none; background: var(--white); border-radius: 20px; padding: 22px; display: grid; gap: 12px; align-content: space-between; box-shadow: 0 0 0 1px var(--line); }
.review p { font-size: 15px; }
.review footer { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--muted); }
.review footer b { display: block; color: var(--ink); font-family: var(--f-display); font-size: 14.5px; }
.review .plan-tag { margin-left: auto; padding: 5px 10px; border-radius: 999px; background: var(--mist); color: var(--orange-700); font: 700 12px var(--f-display); white-space: nowrap; }
@media (prefers-reduced-motion: reduce) { .marquee { overflow-x: auto; } .marquee .track { animation: none; } }

/* Diferenciais em lista ao lado da foto */
.why-wrap { display: grid; grid-template-columns: .9fr 1.1fr; gap: 56px; align-items: center; }
.why-wrap > * { min-width: 0; }
@media (max-width: 900px) { .why-wrap { grid-template-columns: 1fr; gap: 32px; } }
.why-wrap .media { aspect-ratio: 4 / 5; }
.list { display: grid; }
.li { display: grid; grid-template-columns: auto 1fr; gap: 6px 18px; padding: 18px 0; border-bottom: 1px solid var(--line); align-items: start; }
.li:first-child { border-top: 1px solid var(--line); }
.li .ico-box { width: 50px; height: 50px; border-radius: 14px; margin: 0; grid-row: span 2; }
.li h3 { font-size: 18px; }
.li p { color: var(--muted); font-size: 15px; }

/* Mosaico de fotos */
.bento { display: grid; grid-template-columns: 1.35fr 1fr; grid-template-rows: 1fr 1fr; gap: 18px; height: 640px; }
.bento .photo { aspect-ratio: auto; }
.bento .photo:first-child { grid-row: span 2; }
@media (max-width: 860px) { .bento { grid-template-columns: 1fr; grid-template-rows: none; height: auto; } .bento .photo { aspect-ratio: 16 / 10; } .bento .photo:first-child { grid-row: auto; } }

/* FAQ em duas colunas */
.faq-2 { display: grid; grid-template-columns: .8fr 1.2fr; gap: 48px; align-items: start; }
.faq-2 > * { min-width: 0; }
.faq-2 .faq { margin: 0; max-width: none; }
.faq-side { position: sticky; top: 110px; display: grid; gap: 18px; }
.faq-side .media { aspect-ratio: 4 / 3; }
@media (max-width: 900px) { .faq-2 { grid-template-columns: 1fr; } .faq-side { position: static; } }

/* Lista de verificação (Empresas) */
.checklist { display: grid; gap: 0; width: 100%; }
.checklist div { display: grid; grid-template-columns: auto 1fr; gap: 4px 14px; padding: 16px 0; border-bottom: 1px solid var(--line); }
.checklist .ck { width: 34px; height: 34px; border-radius: 50%; background: var(--grad); color: var(--white); display: grid; place-items: center; grid-row: span 2; }
.checklist .ck .ico { width: 18px; height: 18px; }
.checklist b { font: 700 17px var(--f-display); }
.checklist span { color: var(--muted); font-size: 15px; }

/* Adicionais com logos */
.addons .add { gap: 10px; }
.addons .add .st { height: 28px; }
.addons .add .st svg { height: 16px; }
.addons .add .st-yt svg { height: 13px; }
.addons .add .st-prime svg { height: 12px; }
.addons .add .st-max { font-size: 15px; }

/* Marca grande na chamada final */
.band.fire .watermark { position: absolute; right: -40px; bottom: -30px; width: min(520px, 60%); height: auto; color: rgba(255,255,255,.14); z-index: 1; pointer-events: none; }

@media (prefers-reduced-motion: reduce) { .slide, .slide img, .photo img { transition: none !important; } }
`;

const js = `// Vyra · modelo Básico
(function () {
  var btn = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
  if (btn && nav) btn.addEventListener('click', function () { var o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });

  // Carrossel de ofertas
  var hero = document.querySelector('.hero');
  if (hero) {
    var slides = hero.querySelectorAll('.slide'), dots = hero.querySelectorAll('.dots button'), cur = 0, timer;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var go = function (i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === cur); s.setAttribute('aria-hidden', k !== cur); });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === cur); });
      clearTimeout(timer); if (!reduce) timer = setTimeout(function () { go(cur + 1); }, 6500);
    };
    hero.querySelector('.prev').addEventListener('click', function () { go(cur - 1); });
    hero.querySelector('.next').addEventListener('click', function () { go(cur + 1); });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
    hero.addEventListener('mouseenter', function () { clearTimeout(timer); });
    hero.addEventListener('mouseleave', function () { go(cur); });
    var x0 = null;
    hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });
    go(0);
  }

  // Abas Residencial / Empresas
  document.querySelectorAll('[role=tablist]').forEach(function (tl) {
    var tabs = tl.querySelectorAll('[role=tab]');
    tabs.forEach(function (t) { t.addEventListener('click', function () {
      tabs.forEach(function (o) { o.setAttribute('aria-selected', o === t); document.getElementById(o.getAttribute('aria-controls')).hidden = o !== t; });
    }); });
  });

  // Formulários: mostra a confirmação. Integre aqui com seu backend, e-mail ou WhatsApp.
  document.querySelectorAll('form.form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      f.classList.add('sent'); var ok = f.querySelector('.form-ok'); if (ok) ok.focus();
    });
  });

  // Máscaras
  document.querySelectorAll('input[data-mask=cep]').forEach(function (i) {
    i.addEventListener('input', function () { var v = i.value.replace(/\\D/g, '').slice(0, 8); i.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; });
  });
  document.querySelectorAll('input[data-mask=tel]').forEach(function (i) {
    i.addEventListener('input', function () { var v = i.value.replace(/\\D/g, '').slice(0, 11);
      i.value = v.length > 6 ? '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4) : v.length > 2 ? '(' + v.slice(0, 2) + ') ' + v.slice(2) : v; });
  });

  // Consulta de cobertura (exemplo): leva para Assine já com o CEP
  document.querySelectorAll('form.cep').forEach(function (cep) {
    cep.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = cep.querySelector('input').value.replace(/\\D/g, ''), out = cep.parentNode.querySelector('.cep-result');
      if (v.length !== 8) { out.textContent = 'Digite os 8 números do CEP.'; return; }
      out.textContent = 'Boa notícia: temos fibra na sua região. Vamos para a assinatura...';
      setTimeout(function () { location.href = 'assine.html#cep-' + v; }, 900);
    });
  });

  // Assine já: pré-seleciona o plano (#start, #familia, #ultra) e o CEP (#cep-00000000)
  var h = location.hash.slice(1);
  if (h) {
    var radio = document.querySelector('input[name=plano][value="' + h + '"]'); if (radio) radio.checked = true;
    var m = h.match(/^cep-(\\d{8})$/), ci = document.getElementById('a-cep');
    if (m && ci) ci.value = m[1].slice(0, 5) + '-' + m[1].slice(5);
  }
  // Entrada suave ao rolar (só esconde o que ainda está abaixo da tela)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function (el, i) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('pre'); el.style.transitionDelay = ((el.dataset.d || 0) * 90) + 'ms'; io.observe(el); }
    });
  }
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
`;

// ---------- partes ----------
function header(c, page) {
  const links = c.basicNav.map(n => `<a href="${n.href}"${n.id === page ? ' aria-current="page"' : ''}>${n.label}</a>`).join('');
  return `<div class="topstrip"><div class="container">
  <span>Fibra óptica em <b>${c.cities.now.join(', ')}</b> e região · Suporte técnico 24h</span>
  <span>WhatsApp <b>${c.contact.whatsapp}</b> · <a href="#">Área do cliente</a></span>
</div></div>
<header class="topbar">
  <div class="container">
    <a class="brand" href="index.html" aria-label="Vyra, página inicial">${logo()}</a>
    <button class="menu-btn" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav">${icon('menu')}</button>
    <nav class="nav" id="nav" aria-label="Principal">
      ${links}
      <div class="actions">
        <a class="btn btn-wa" href="${c.contact.whatsappLink}" target="_blank" rel="noopener">${socialIcon('whatsapp')}WhatsApp</a>
        <a class="btn btn-red" href="assine.html"${page === 'assine' ? ' aria-current="page"' : ''}>Assine já</a>
      </div>
    </nav>
  </div>
</header>`;
}

function footer(c) {
  return `<footer class="footer">
  <div class="container">
    <div class="cols">
      <div>${logo()}<p>${esc(c.brand.slogan)}<br>${esc(c.brand.support)}</p><div style="margin-top:18px">${socialLinks(c)}</div></div>
      <div><h3>Navegação</h3><ul>${c.basicNav.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}<li><a href="assine.html">Assine já</a></li></ul></div>
      <div><h3>Planos</h3><ul>${c.combos.map(p => `<li><a href="assine.html#${p.id}">${p.name} · ${p.speed} ${p.unit}</a></li>`).join('')}<li><a href="empresas.html">Vyra Empresas</a></li></ul></div>
      <div><h3>Fale com a gente</h3><ul><li>WhatsApp: ${c.contact.whatsapp}</li><li>Telefone: ${c.contact.phone}</li><li>${c.contact.email}</li><li>${c.contact.address} · ${c.contact.city}</li></ul></div>
    </div>
    <div class="bottom"><span>© <span id="year">2026</span> Vyra Fibra. Todos os direitos reservados.</span><span>A Vyra é uma empresa de telecomunicações inscrita no CNPJ 00.000.000/0001-00 com licença SCM da Anatel. [EXEMPLO]</span></div>
  </div>
</footer>
<a class="wa-float" href="${c.contact.whatsappLink}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${socialIcon('whatsapp')}</a>`;
}

function carousel(c) {
  return `<section class="hero" aria-roledescription="carrossel" aria-label="Ofertas Vyra">
  <div class="slides">${c.slides.map((s, i) => `
    <div class="slide${i === 0 ? ' on' : ''}" aria-roledescription="slide" aria-label="${i + 1} de ${c.slides.length}">
      <img src="${IMG}${s.img}" alt="${esc(s.alt)}"${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}>
      <span class="vbug tr slide-bug">${logo()}</span>
      <div class="container"><div class="copy">
        <span class="tag">${s.tag}</span>
        ${i === 0 ? `<h1>${s.title}</h1>` : `<h2>${s.title}</h2>`}
        <p>${s.text}</p>
        <div class="logos">${streamLogos(s.streams || [])}</div>
        <div class="price-chip"><small>a partir de R$</small><b>${s.price}</b><small>/mês</small></div>
        <div class="actions"><a class="btn btn-white" href="${s.cta}">Assine já ${icon('arrow')}</a><a class="btn btn-ghost" href="#planos">Ver planos</a></div>
      </div></div>
    </div>`).join('')}
  </div>
  <div class="hero-ctrl"><div class="container">
    <div class="dots">${c.slides.map((s, i) => `<button type="button" aria-label="Ir para a oferta ${i + 1}"></button>`).join('')}</div>
    <div class="arrows"><button type="button" class="prev" aria-label="Oferta anterior">${icon('arrow')}</button><button type="button" class="next" aria-label="Próxima oferta">${icon('arrow')}</button></div>
  </div></div>
</section>`;
}

function phero(img, alt, title, lead, crumb) {
  return `<section class="phero">
  <img src="${IMG}${img}" alt="${esc(alt)}" fetchpriority="high">
  <div class="container">
    <div class="crumbs"><a href="index.html">Início</a> / ${crumb}</div>
    <h1>${title}</h1><p>${lead}</p>
  </div>
</section>`;
}

function planCard(p, biz) {
  const price = p.price
    ? `<div class="price"><small>R$</small><b>${p.price}</b><small>/mês</small></div>`
    : `<div class="price"><span class="ask">Sob consulta</span></div>`;
  const href = biz ? 'contato.html' : `assine.html#${p.id}`;
  const label = biz ? (p.price ? 'Contratar' : 'Pedir proposta') : 'Quero esse';
  return `<article class="plan rv${p.featured ? ' featured' : ''}">
    ${p.featured ? `<span class="badge">${p.tag}</span>` : `<span class="tag">${p.tag}</span>`}
    <div class="ph">${logo('logo', p.featured ? '#FFFFFF' : '#E11D2E')}<b>${p.name.replace('Vyra ', '')}</b></div>
    <div class="speed">${p.speed}<small>${p.unit}</small></div>
    ${p.streams ? `<div class="streams"><span>Streaming incluso</span><div class="logos">${streamLogos(p.streams)}</div></div>` : ''}
    <ul>${p.features.map(f => `<li>${icon('check')}${f}</li>`).join('')}</ul>
    ${price}
    <a class="btn ${p.featured ? 'btn-white' : 'btn-primary'}" href="${href}">${label}</a>
  </article>`;
}

function plansSection(c, mode = 'both') {
  const res = `<div class="plans">${c.combos.map(p => planCard(p)).join('')}</div>
    <div class="addons rv"><b>Monte seu combo:</b>${c.addons.map(a => { const key = ['Netflix', 'Max', 'Prime Video'].find(k => a.name.startsWith(k)); return `<span class="add">${key ? brandTile(key) : ''}${a.name} <em>${a.price}</em></span>`; }).join('')}</div>
    <p class="note">Valores de exemplo. Streamings sujeitos a disponibilidade e às regras de cada serviço; as marcas pertencem aos seus donos.</p>`;
  const biz = `<div class="plans">${c.businessPlans.map(p => planCard(p, true)).join('')}</div>
    <p class="note">Valores de exemplo. Planos empresariais com contrato e nota fiscal.</p>`;
  const title = mode === 'biz' ? 'Planos <em>Vyra Empresas</em>' : 'Planos de internet fibra <em>Vyra</em>';
  const sub = mode === 'biz' ? 'Conexão estável para quem não pode parar.' : 'Fibra até a sua casa, com os streamings que você já usa.';
  let body;
  if (mode === 'both') body = `<div style="text-align:center"><div class="tabs" role="tablist" aria-label="Tipo de plano">
      <button role="tab" aria-selected="true" aria-controls="tab-res" id="t-res">Residencial</button>
      <button role="tab" aria-selected="false" aria-controls="tab-biz" id="t-biz">Empresas</button></div></div>
    <div class="tab-panel" id="tab-res" role="tabpanel" aria-labelledby="t-res">${res}</div>
    <div class="tab-panel" id="tab-biz" role="tabpanel" aria-labelledby="t-biz" hidden>${biz}</div>`;
  else body = mode === 'biz' ? biz : res;
  return `<section class="section alt" id="planos"><div class="container">
    <div class="head center rv"><span class="kicker">Planos</span><h2>${title}</h2><p>${sub}</p></div>
    ${body}
  </div></section>`;
}

function streamingSplit(c) {
  return `<section class="section"><div class="container split">
    <div class="media rv"><img src="${IMG}tv_pai_filho.jpg" alt="Pai e filho assistindo TV no sofá" loading="lazy">
      <span class="vbug tl">${logo()}</span>
      <div class="float"><b>4K</b><span>sem travar,<br>no horário de pico</span></div></div>
    <div class="copy-block rv" data-d="1"><span class="kicker">Internet + streaming</span>
      <h2>Seus streamings favoritos <em>na conta da internet.</em></h2>
      <p>Assine a Vyra e leve YouTube Premium em qualquer plano. No Família, escolha mais um streaming. No Ultra, leve todos.</p>
      <div class="logos lg">${streamLogos(c.streamings)}</div>
      <a class="btn btn-primary" href="#planos">Comparar planos ${icon('arrow')}</a>
    </div>
  </div></section>`;
}

function why(c) {
  const items = [...c.benefits,
    { icon: 'wifi', title: 'Wi-Fi 6 em todos os planos', text: 'Roteador moderno incluso, com sinal forte em toda a casa.' },
    { icon: 'home', title: 'Cobertura em expansão', text: 'Levamos fibra para bairros, distritos e chácaras do interior.' }];
  return `<section class="section alt"><div class="container why-wrap">
    <div class="media rv"><img src="${IMG}idosa_celular.jpg" alt="Senhora sorrindo enquanto usa o celular" loading="lazy"><span class="vbug tr">${logo()}</span>
      <div class="float"><b>100%</b><span>fibra óptica<br>até a sua casa</span></div></div>
    <div class="rv" data-d="1">
      <div class="head" style="margin-bottom:22px"><span class="kicker">Por que a Vyra</span><h2>Por que escolher a <em>Vyra?</em></h2><p>Diferenciais que fazem diferença no seu dia a dia.</p></div>
      <div class="list">${items.map(b => `<div class="li"><div class="ico-box">${duo(b.icon)}</div><h3>${b.title}</h3><p>${b.text}</p></div>`).join('')}</div>
    </div>
  </div></section>`;
}

function moments() {
  return `<section class="section"><div class="container">
    <div class="head rv"><span class="kicker">Conexão que você merece</span><h2>Para todos os <em>momentos.</em></h2></div>
    <div class="bento">
      <div class="photo rv"><img src="${IMG}amigas_mesa.jpg" alt="Amigas rindo enquanto olham o celular" loading="lazy"><span class="vbug tl">${logo()}</span><div><b>Com os amigos</b><span>Vídeo, foto e chamada sem travar, mesmo com todo mundo conectado.</span></div></div>
      <div class="photo rv" data-d="1"><img src="${IMG}gamer_sofa.jpg" alt="Jovem jogando videogame no sofá" loading="lazy"><div><b>Jogos sem lag</b><span>Baixa latência para quem joga online.</span></div></div>
      <div class="photo rv" data-d="2"><img src="${IMG}mulher_videochamada.jpg" alt="Mulher em videochamada no notebook" loading="lazy"><div><b>Home office</b><span>Reunião estável e upload rápido.</span></div></div>
    </div>
  </div></section>`;
}

function promos(c) {
  const [a, b, u] = c.combos;
  const perDay = (p) => (parseFloat(p.replace(',', '.')) / 30).toFixed(2).replace('.', ',');
  return `<section class="section"><div class="container">
    <div class="promos">
      <article class="promo promo-a rv">
        <div><h3>O Família cabe<br>no seu bolso.</h3><p>800 Mega por menos de R$ ${perDay(b.price)} por dia.</p></div>
        <div class="pa-body">
          <figure class="pa-photo"><img src="${IMG}mulher_celular_sofa.jpg" alt="Mulher sorrindo com o celular" loading="lazy"></figure>
          <div class="pa-table"><span>Aqui tem:</span>
            ${c.combos.map(p => `<div class="pa-row${p.featured ? ' hi' : ''}"><b>${p.speed}<small>${p.unit}</small></b><em>R$ ${p.price}</em></div>`).join('')}
            <div class="pa-extra"><span>+ streaming incluso</span><div class="logos">${streamLogos(['YouTube Premium', 'Max', 'Prime Video'])}</div></div>
          </div>
        </div>
        <div class="pa-foot">${logo('logo', '#FFFFFF')}<a class="btn btn-white" href="assine.html#${b.id}">Quero o Família</a></div>
      </article>
      <article class="promo promo-b rv" data-d="1">
        <div class="pb-photo"><img src="${IMG}tv_pai_filho.jpg" alt="Pai e filho assistindo TV" loading="lazy"><span class="vbug">${logo()}</span></div>
        <div class="pb-copy">
          <h3>Vyra Ultra: todos os streamings, <br>uma conta só.</h3>
          <div class="logos lg">${streamLogos(u.streams)}</div>
          <div class="pb-tags"><span>1 Giga de fibra</span><span>Wi-Fi 6 mesh</span><span>Técnico em 24h</span><span>IP fixo opcional</span></div>
          <div class="pb-price"><small>Por<br>apenas R$</small><b>${u.price.split(',')[0]}<sup>,${u.price.split(',')[1]}</sup></b><em>/mês<br>valor de exemplo</em></div>
          <div><a class="btn btn-white" href="assine.html#${u.id}">Assinar o Ultra ${icon('arrow')}</a></div>
        </div>
      </article>
    </div>
  </div></section>`;
}

function bizBand() {
  return `<section class="band"><img src="${IMG}reuniao_laptop.jpg" alt="Equipe reunida olhando um notebook" loading="lazy">
  <div class="container">
    <span class="kicker">Vyra Empresas</span>
    <h2>Internet empresarial <em>que não para.</em></h2>
    <p>Link dedicado, IP fixo, SLA em contrato e um gerente de conta que conhece a sua operação.</p>
    <div class="stats"><div><b>99,9%</b><span>de disponibilidade (meta)</span></div><div><b>4h</b><span>SLA de reparo no dedicado</span></div><div><b>24/7</b><span>monitoramento</span></div></div>
    <a class="btn btn-primary" href="empresas.html">Conhecer planos empresariais ${icon('arrow')}</a>
  </div></section>`;
}

function aboutSplit(c) {
  return `<section class="section"><div class="container split rev">
    <div class="media"><img src="${IMG}familia_sofa.jpg" alt="Família sorrindo no sofá de casa" loading="lazy"></div>
    <div class="copy-block"><span class="kicker">Sobre a Vyra</span>
      <h2>Você e o interior, <em>conectados.</em></h2>
      <p>${c.about.intro} Construímos uma rede 100% fibra óptica e um atendimento feito por gente da região.</p>
      <div class="stats dark">${c.stats.slice(0, 3).map(s => `<div><b>${s.value}${s.suffix}</b><span>${s.label}</span></div>`).join('')}</div>
      <a class="btn btn-outline" href="sobre.html">Conhecer a Vyra</a>
    </div>
  </div></section>`;
}

function testimonials(c) {
  const initials = w => w.replace(/^(Dona|Seu) /, '').split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();
  const card = r => `<blockquote class="review"><div class="stars" aria-label="5 estrelas">★★★★★</div><p>“${r.text}”</p><footer><span class="avatar">${initials(r.name)}</span><div><b>${r.name}</b>${r.where}</div><span class="plan-tag">${r.plan}</span></footer></blockquote>`;
  const half = Math.ceil(c.reviews.length / 2);
  const row1 = c.reviews.slice(0, half).map(card).join(''), row2 = c.reviews.slice(half).map(card).join('');
  return `<section class="section alt"><div class="container">
    <div class="head center rv"><span class="kicker">Avaliações</span><h2>Quem já é Vyra <em>recomenda</em></h2><p>Avaliações de exemplo, para substituir por relatos reais de clientes.</p></div>
  </div>
  <div class="marquee" aria-label="Avaliações de clientes"><div class="track">${row1}<div aria-hidden="true" style="display:contents">${row1}</div></div></div>
  <div class="marquee rev" aria-hidden="true"><div class="track">${row2}${row2}</div></div>
  </section>`;
}

function faqBlock(c, n) {
  const list = n ? c.faq.slice(0, n) : c.faq;
  return `<section class="section"><div class="container faq-2">
    <div class="faq-side rv">
      <div class="head" style="margin:0"><span class="kicker">Dúvidas</span><h2>Perguntas <em>frequentes</em></h2><p>Não achou sua resposta? Fale com um técnico da região pelo WhatsApp.</p></div>
      <div class="media"><img src="${IMG}mulher_ligacao.jpg" alt="Atendente sorrindo ao telefone" loading="lazy"><span class="vbug tr">${logo()}</span><div class="float"><b>24h</b><span>suporte por<br>gente de verdade</span></div></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-primary" href="${c.contact.whatsappLink}" target="_blank" rel="noopener">${socialIcon('whatsapp')}Chamar no WhatsApp</a>${n ? '<a class="btn btn-outline" href="faq.html">Todas as perguntas</a>' : ''}</div>
    </div>
    <div class="faq rv" data-d="1">${list.map(f => `<details><summary>${f.q}${icon('plus')}</summary><p>${f.a}</p></details>`).join('')}</div>
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

function contactForm(c, biz) {
  return `<form class="form form-card" novalidate>
    <div class="row">
      <label for="c-nome">Nome<input id="c-nome" autocomplete="name" required></label>
      <label for="c-tel">WhatsApp<input id="c-tel" inputmode="tel" data-mask="tel" autocomplete="tel" required></label>
    </div>
    ${biz ? `<div class="row"><label for="c-emp">Empresa<input id="c-emp" autocomplete="organization" required></label><label for="c-cnpj">CNPJ<input id="c-cnpj" inputmode="numeric"></label></div>` : ''}
    <label for="c-email">E-mail<input id="c-email" type="email" autocomplete="email" required></label>
    <label for="c-assunto">Assunto<select id="c-assunto">${biz ? '<option>Proposta de link dedicado</option><option>Plano Empresa 400</option><option>Plano Empresa 800</option><option>Outro</option>' : '<option>Quero contratar</option><option>Proposta para empresa</option><option>Suporte técnico</option><option>Financeiro</option><option>Outro</option>'}</select></label>
    <label for="c-msg">Mensagem<textarea id="c-msg" required></textarea></label>
    <div><button class="btn btn-primary" type="submit">${biz ? 'Pedir proposta' : 'Enviar mensagem'}</button></div>
    <div class="form-ok" tabindex="-1" role="status">${biz ? 'Pedido recebido. Um consultor fala com você em breve.' : 'Mensagem enviada. Respondemos em breve.'}</div>
  </form>`;
}

function infoCard(c, img, alt) {
  return `<aside class="info-card"><img src="${IMG}${img}" alt="${esc(alt)}" loading="lazy"><div class="in">
    <div class="info-item">${socialIcon('whatsapp')}<div><b>WhatsApp</b><span>${c.contact.whatsapp}</span></div></div>
    <div class="info-item">${icon('phone')}<div><b>Telefone</b><span>${c.contact.phone}</span></div></div>
    <div class="info-item">${icon('mail')}<div><b>E-mail</b><span>${c.contact.email}</span></div></div>
    <div class="info-item">${icon('pin')}<div><b>Endereço</b><span>${c.contact.address} · ${c.contact.city}</span></div></div>
    ${c.contact.hours.map(h => `<div class="info-item">${icon('clock')}<div><b>${h[0]}</b><span>${h[1]}</span></div></div>`).join('')}
    <div><b style="font-family:var(--f-display);display:block;margin-bottom:10px">Redes sociais</b>${socialLinks(c)}</div>
  </div></aside>`;
}

// ---------- páginas (sempre: imagem → planos → restante) ----------
const pages = {
  index: c => `${header(c, 'index')}
<main>
  ${carousel(c)}
  ${plansSection(c, 'both')}
  ${promos(c)}
  ${streamingSplit(c)}
  ${why(c)}
  ${moments()}
  ${bizBand()}
  ${aboutSplit(c)}
  ${testimonials(c)}
  ${faqBlock(c, 5)}
  ${finalCta()}
</main>
${footer(c)}`,

  sobre: c => `${header(c, 'sobre')}
<main>
  ${phero('familia_sofa.jpg', 'Família sorrindo no sofá', 'Feita no interior, <em>para o interior.</em>', c.about.intro, 'Sobre nós')}
  <section class="section"><div class="container split">
    <div class="media"><img src="${IMG}mulher_ligacao.jpg" alt="Mulher sorrindo ao telefone" loading="lazy"><div class="float"><b>24h</b><span>suporte por gente<br>da região</span></div></div>
    <div class="copy-block"><span class="kicker">Nossa história</span><h2>Gente de perto, <em>fibra de verdade.</em></h2>${c.about.story.map(p => `<p>${p}</p>`).join('')}</div>
  </div></section>
  <section class="section alt"><div class="container">
    <div class="purpose"><small>Nosso propósito</small><p>${c.about.purpose}</p></div>
    <div class="grid g3" style="margin-top:22px">${c.about.values.map((v, i) => `<div class="card"><div class="ico-box">${duo(['shield', 'headset', 'fiber', 'calendar', 'home'][i])}</div><h3>${v.title}</h3><p>${v.text}</p></div>`).join('')}</div>
  </div></section>
  ${moments()}
  <section class="section alt"><div class="container">
    <div class="head"><span class="kicker">Cobertura</span><h2>Onde a fibra Vyra <em>já chega</em></h2><p>Atendemos hoje e já estamos levando fibra para novas cidades.</p></div>
    <div class="cities">${c.cities.now.map(x => `<span class="city on">${x}</span>`).join('')}${c.cities.soon.map(x => `<span class="city">${x}<small>em breve</small></span>`).join('')}</div>
  </div></section>
  ${finalCta()}
</main>
${footer(c)}`,

  residencial: c => `${header(c, 'residencial')}
<main>
  ${phero('gamer_sofa.jpg', 'Jovem jogando videogame no sofá', 'Internet residencial <em>com streaming.</em>', 'Planos de 500 Mega a 1 Giga com YouTube Premium incluso, Wi-Fi 6 e instalação grátis.', 'Residencial')}
  ${plansSection(c, 'res')}
  ${promos(c)}
  <section class="section"><div class="container">
    <div class="head rv"><span class="kicker">Para cada casa</span><h2>Qual plano é <em>a sua cara?</em></h2></div>
    <div class="profiles">
      <div class="profile rv"><img src="${IMG}familia_celulares.jpg" alt="Família usando celulares e tablet" loading="lazy"><div><h3>Família conectada</h3><p>Várias telas ao mesmo tempo, sem briga pelo Wi-Fi.</p><a href="assine.html#familia">Vyra Família →</a></div></div>
      <div class="profile rv"><img src="${IMG}gamer_sofa.jpg" alt="Jovem jogando videogame" loading="lazy"><div><h3>Gamer</h3><p>1 Giga, baixa latência e download rápido de jogos.</p><a href="assine.html#ultra">Vyra Ultra →</a></div></div>
      <div class="profile rv"><img src="${IMG}mulher_videochamada.jpg" alt="Mulher em videochamada no notebook" loading="lazy"><div><h3>Home office</h3><p>Reunião em vídeo estável, upload rápido e suporte prioritário.</p><a href="assine.html#familia">Vyra Família →</a></div></div>
      <div class="profile rv"><img src="${IMG}mae_tablet.jpg" alt="Mãe com bebês assistindo no tablet" loading="lazy"><div><h3>Crianças em casa</h3><p>Desenhos e aulas online, com controle dos pais no app.</p><a href="assine.html#start">Vyra Start →</a></div></div>
    </div>
  </div></section>
  ${streamingSplit(c)}
  ${why(c)}
  ${faqBlock(c, 5)}
  ${finalCta()}
</main>
${footer(c)}`,

  empresas: c => `${header(c, 'empresas')}
<main>
  ${phero('reuniao_laptop.jpg', 'Equipe reunida olhando um notebook', 'Vyra Empresas: <em>sua operação não para.</em>', 'Planos com IP fixo, link dedicado e SLA em contrato para comércio, clínicas, indústria e agro.', 'Empresas')}
  ${plansSection(c, 'biz')}
  <section class="section"><div class="container split">
    <div class="media"><img src="${IMG}homem_escritorio.jpg" alt="Homem sorrindo trabalhando no notebook" loading="lazy"><div class="float"><b>SLA</b><span>tempo de reparo<br>garantido em contrato</span></div></div>
    <div class="copy-block"><span class="kicker">Para o seu negócio</span><h2>Conexão de empresa, <em>atendimento de vizinho.</em></h2>
      <p>Maquininha, sistema na nuvem, câmeras e nota fiscal dependem da internet. A Vyra cuida para que nada disso pare.</p>
      <div class="checklist">${c.business.map(b => `<div><span class="ck">${icon('check')}</span><b>${b.title}</b><span>${b.text}</span></div>`).join('')}</div>
    </div>
  </div></section>
  <section class="band"><img src="${IMG}equipe_laptop.jpg" alt="Equipe trabalhando com notebooks" loading="lazy">
    <div class="container"><span class="kicker">Garantia em contrato</span><h2>Se cair, <em>a prioridade é sua.</em></h2>
      <p>Monitoramento 24 horas, gerente de conta e técnicos da região prontos para ir até você.</p>
      <div class="stats"><div><b>99,9%</b><span>de disponibilidade (meta)</span></div><div><b>4h</b><span>SLA no link dedicado</span></div><div><b>24/7</b><span>monitoramento</span></div></div></div>
  </section>
  <section class="section alt"><div class="container contact-layout">
    <div style="display:grid;gap:18px"><div class="head" style="margin:0"><span class="kicker">Proposta</span><h2>Peça uma proposta <em>sob medida.</em></h2><p>Um consultor responde em até 1 dia útil.</p></div>${contactForm(c, true)}</div>
    ${infoCard(c, 'homem_escritorio.jpg', 'Homem trabalhando no notebook')}
  </div></section>
</main>
${footer(c)}`,

  faq: c => `${header(c, 'faq')}
<main>
  ${phero('amigas_cafe.jpg', 'Duas amigas olhando o celular num café', 'Perguntas <em>frequentes.</em>', 'Respostas rápidas sobre instalação, planos, streaming e suporte.', 'FAQ')}
  ${faqBlock(c)}
  ${finalCta()}
</main>
${footer(c)}`,

  contato: c => `${header(c, 'contato')}
<main>
  ${phero('mulher_aceno.jpg', 'Mulher acenando numa videochamada', 'Fale com <em>a gente.</em>', 'Tire dúvidas, peça uma proposta ou fale com o suporte. Gente da região responde.', 'Contato')}
  <section class="section"><div class="container contact-layout">
    <div style="display:grid;gap:18px"><div class="head" style="margin:0"><span class="kicker">Mensagem</span><h2>Envie sua <em>mensagem</em></h2></div>${contactForm(c)}</div>
    ${infoCard(c, 'mulher_videochamada.jpg', 'Mulher em videochamada no notebook')}
  </div></section>
</main>
${footer(c)}`,

  assine: c => `${header(c, 'assine')}
<main>
  ${phero('mulher_celular_sofa.jpg', 'Mulher sorrindo com o celular no sofá', 'Assine <em>já.</em>', 'Escolha o plano e preencha seus dados. A gente confirma a cobertura e agenda a instalação.', 'Assine já')}
  <section class="section alt" id="planos"><div class="container" style="max-width:920px">
    <form class="form form-card" novalidate>
      <fieldset><legend>1. Escolha o plano</legend>
        <div class="plan-pick">${c.combos.map(p => `<label><input type="radio" name="plano" value="${p.id}"${p.featured ? ' checked' : ''} required><b>${p.name} · ${p.speed} ${p.unit}</b><span>R$ ${p.price}/mês</span><span>${p.streams.join(' + ')}</span></label>`).join('')}</div>
      </fieldset>
      <fieldset><legend>2. Seus dados</legend>
        <div class="row"><label for="a-nome">Nome completo<input id="a-nome" autocomplete="name" required></label><label for="a-cpf">CPF<input id="a-cpf" inputmode="numeric" required></label></div>
        <div class="row"><label for="a-tel">WhatsApp<input id="a-tel" inputmode="tel" data-mask="tel" autocomplete="tel" required></label><label for="a-email">E-mail<input id="a-email" type="email" autocomplete="email" required></label></div>
      </fieldset>
      <fieldset><legend>3. Endereço de instalação</legend>
        <div class="row"><label for="a-cep">CEP<input id="a-cep" inputmode="numeric" data-mask="cep" placeholder="00000-000" required></label><label for="a-num">Número<input id="a-num" required></label></div>
        <label for="a-rua">Rua<input id="a-rua" autocomplete="address-line1" required></label>
        <div class="row"><label for="a-bairro">Bairro<input id="a-bairro" required></label><label for="a-periodo">Melhor período para instalação<select id="a-periodo"><option>Manhã</option><option>Tarde</option><option>Sábado</option></select></label></div>
      </fieldset>
      <div><button class="btn btn-red" type="submit">Enviar pedido de assinatura</button></div>
      <div class="form-ok" tabindex="-1" role="status">Pedido recebido. Vamos confirmar a cobertura e falar com você pelo WhatsApp.</div>
    </form>
  </div></section>
  ${why(c)}
</main>
${footer(c)}`,
};

function build(c) {
  const out = {};
  for (const [id, fn] of Object.entries(pages)) out[id + '.html'] = shell({ c, page: id, fonts: FONTS, body: fn(c) });
  return { pages: out, css, js };
}
module.exports = { build, brandTile, streamLogos };
