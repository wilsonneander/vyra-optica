// MODELO INTERMEDIÁRIO — mais elegante, animações simples (entrada ao rolar, contadores, hover).
const { DUO_CSS, logo, icon, duo, socialIcon, socialLinks, esc, navLinks, shell } = require('./helpers');
const BIZ_ICONS = ['fiber', 'wifi', 'shield', 'headset'];

const FONTS = 'family=Outfit:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500';

const css = `/* Vyra · modelo Intermediário */
:root {
  --violet: #E8480C; --violet-700: #C2410C; --ink: #1E1512; --ink-2: #2A1D18; --green: #FFFFFF;
  --lilac: #FFE3D4; --pink: #E11D2E; --white: #FFFFFF; --mist: #FFF6F1; --line: #F5E2D8; --muted: #6E5A52;
  --f-display: "Outfit", system-ui, sans-serif; --f-body: "Manrope", system-ui, sans-serif; --f-mono: "JetBrains Mono", ui-monospace, monospace;
  --max: 1180px; --ease: cubic-bezier(.2,.7,.2,1);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--white); color: var(--ink); font: 400 16px/1.65 var(--f-body); }
a { color: var(--violet); }
h1, h2, h3 { font-family: var(--f-display); margin: 0; line-height: 1.1; text-wrap: balance; }
h1 { font-size: clamp(38px, 6vw, 68px); font-weight: 700; letter-spacing: -0.035em; }
h2 { font-size: clamp(28px, 3.8vw, 44px); font-weight: 700; letter-spacing: -0.03em; }
h3 { font-size: 20px; font-weight: 600; letter-spacing: -0.01em; }
p { margin: 0; }
.container { max-width: var(--max); margin: 0 auto; padding-left: max(20px, env(safe-area-inset-left)); padding-right: max(20px, env(safe-area-inset-right)); }
.section { padding: 96px 0; }
.section.alt { background: var(--mist); }
.eyebrow { font: 500 12px/1 var(--f-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--violet); }
.section-head { display: grid; gap: 14px; margin-bottom: 48px; max-width: 680px; }
.section-head p { color: var(--muted); font-size: 17px; }
.section-head.center { margin-left: auto; margin-right: auto; text-align: center; justify-items: center; }
.ico { width: 22px; height: 22px; flex: none; }
:focus-visible { outline: 2px solid var(--green); outline-offset: 3px; }
.dark { background: linear-gradient(135deg, #FF6A2B 0%, #FF5A1F 35%, #E8480C 60%, #E11D2E 100%); color: var(--white); }
.footer.dark { background: var(--ink); }
.dark.dots { background-color: #E8480C; background-image: radial-gradient(rgba(255,255,255,.2) 1.2px, transparent 1.3px), linear-gradient(135deg, #FF6A2B 0%, #FF5A1F 35%, #E8480C 60%, #E11D2E 100%); background-size: 22px 22px, 100% 100%; }
.footer.dark.dots { background-color: var(--ink); background-image: radial-gradient(rgba(255,255,255,.1) 1.2px, transparent 1.3px); background-size: 22px 22px; }
.dark .eyebrow { color: var(--green); }
.dark .section-head p { color: var(--lilac); }
.dots { background-image: radial-gradient(rgba(255,255,255,.22) 1.2px, transparent 1.3px); background-size: 22px 22px; }

/* Botões */
.btn { --bg: var(--violet); --fg: var(--white); position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 26px; border-radius: 999px; font: 600 15.5px/1 var(--f-display); text-decoration: none; border: 0; cursor: pointer; background: var(--bg); color: var(--fg); transition: transform .25s var(--ease), box-shadow .25s var(--ease), background-color .25s; }
.btn .ico { width: 18px; height: 18px; transition: transform .25s var(--ease); }
.btn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -8px rgba(232,72,12,.55); }
.btn:hover .ico { transform: translateX(4px); }
.btn:active { transform: translateY(0); }
.btn-green { --bg: var(--green); --fg: var(--violet-700); }
.btn-green:hover { box-shadow: 0 12px 28px -8px rgba(30,21,18,.35); }
.btn-ghost { --bg: transparent; --fg: var(--white); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.35); }
.btn-ghost:hover { --bg: rgba(255,255,255,.08); box-shadow: inset 0 0 0 1.5px var(--white); }
.btn-line { --bg: transparent; --fg: var(--violet); box-shadow: inset 0 0 0 1.5px var(--violet); }
.btn-line:hover { --bg: var(--violet); --fg: var(--white); box-shadow: 0 10px 24px -8px rgba(232,72,12,.55); }

/* Topo */
.topbar { position: fixed; inset: 0 0 auto; z-index: 40; padding-top: env(safe-area-inset-top); transition: background-color .3s, box-shadow .3s, backdrop-filter .3s; }
.topbar.scrolled { background: rgba(30,21,18,.86); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: 0 1px 0 rgba(255,255,255,.08); }
.topbar .container { display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 76px; }
.brand { color: var(--white); display: flex; }
.brand .logo { width: 98px; height: auto; display: block; }
.nav { display: flex; align-items: center; gap: 30px; }
.nav a:not(.btn) { position: relative; color: rgba(255,255,255,.8); text-decoration: none; font: 500 15px/1 var(--f-display); padding: 8px 0; transition: color .2s; }
.nav a:not(.btn)::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 2px; border-radius: 2px; background: var(--green); transform: scaleX(0); transform-origin: left; transition: transform .3s var(--ease); }
.nav a:not(.btn):hover, .nav a[aria-current="page"]:not(.btn) { color: var(--white); }
.nav a:not(.btn):hover::after, .nav a[aria-current="page"]:not(.btn)::after { transform: scaleX(1); }
.nav .btn { padding: 12px 22px; }
.menu-btn { display: none; background: none; border: 0; color: var(--white); padding: 8px; cursor: pointer; }
@media (max-width: 900px) {
  .menu-btn { display: inline-flex; }
  .nav { position: fixed; inset: 76px 0 auto; background: var(--ink); flex-direction: column; align-items: stretch; gap: 0; padding: 8px 24px 24px; clip-path: inset(0 0 100% 0); transition: clip-path .4s var(--ease); }
  .nav.open { clip-path: inset(0 0 0 0); }
  .nav a:not(.btn) { padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,.08); font-size: 18px; }
  .nav a:not(.btn)::after { display: none; }
  .nav a[aria-current="page"]:not(.btn) { color: var(--green); }
  .nav .btn { margin-top: 18px; }
}

/* Hero */
.hero { position: relative; overflow: hidden; padding: 150px 0 96px; }
.hero::before { content: ""; position: absolute; width: 720px; height: 720px; right: -200px; top: -220px; border-radius: 50%; background: radial-gradient(circle, rgba(255,196,150,.45), transparent 65%); pointer-events: none; }
.hero .container { position: relative; display: grid; grid-template-columns: 1.15fr .85fr; gap: 56px; align-items: center; }
@media (max-width: 960px) { .hero .container { grid-template-columns: 1fr; } .hero { padding-top: 120px; } }
.status { display: inline-flex; align-items: center; gap: 10px; padding: 8px 16px 8px 12px; border-radius: 999px; background: rgba(255,255,255,.06); box-shadow: inset 0 0 0 1px rgba(255,255,255,.1); font: 500 12.5px/1 var(--f-mono); color: var(--lilac); }
.led { width: 9px; height: 9px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 0 rgba(255,255,255,.6); animation: led 2.2s infinite; }
@keyframes led { 70% { box-shadow: 0 0 0 9px rgba(255,255,255,0); } 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); } }
.hero h1 { margin: 24px 0 22px; }
.hero h1 em { font-style: normal; color: var(--ink); }
.hero .lead { font-size: 19px; color: var(--lilac); max-width: 50ch; }
.hero .actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 36px; }
.speed-card { background: linear-gradient(160deg, rgba(255,255,255,.09), rgba(255,255,255,.03)); box-shadow: inset 0 0 0 1px rgba(255,255,255,.12), 0 30px 60px -30px rgba(0,0,0,.6); border-radius: 24px; padding: 30px; display: grid; gap: 22px; backdrop-filter: blur(8px); }
.speed-card .top { display: flex; justify-content: space-between; align-items: center; font: 500 12px/1 var(--f-mono); color: var(--lilac); letter-spacing: .08em; text-transform: uppercase; }
.speed-card .big { font: 700 clamp(64px, 8vw, 92px)/.9 var(--f-display); letter-spacing: -0.04em; }
.speed-card .big small { font-size: 22px; font-weight: 600; color: var(--lilac); margin-left: 6px; letter-spacing: 0; }
.meter { height: 6px; border-radius: 6px; background: rgba(255,255,255,.1); overflow: hidden; }
.meter i { display: block; height: 100%; width: 0; border-radius: 6px; background: linear-gradient(90deg, var(--violet), var(--lilac) 60%, var(--green)); transition: width 2s var(--ease); }
.speed-card .kv { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.speed-card .kv div { background: rgba(255,255,255,.05); border-radius: 12px; padding: 12px; display: grid; gap: 4px; }
.speed-card .kv span { font: 500 10.5px/1 var(--f-mono); color: var(--lilac); text-transform: uppercase; letter-spacing: .08em; }
.speed-card .kv b { font: 600 19px/1 var(--f-display); }

/* Números */
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--line); border-radius: 20px; overflow: hidden; box-shadow: 0 0 0 1px var(--line); }
@media (max-width: 800px) { .stats { grid-template-columns: repeat(2, 1fr); } }
.stats div { background: var(--white); padding: 28px; display: grid; gap: 6px; }
.stats b { font: 700 40px/1 var(--f-display); letter-spacing: -0.03em; color: var(--violet); font-variant-numeric: tabular-nums; }
.stats span { color: var(--muted); font-size: 14.5px; }
.stats-wrap { margin-top: -48px; position: relative; z-index: 2; }

/* Cards */
.grid { display: grid; gap: 20px; }
.g4 { grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); }
.g3 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.g2 { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
.card { background: var(--white); border-radius: 20px; padding: 28px; display: grid; gap: 12px; align-content: start; box-shadow: 0 0 0 1px var(--line); transition: transform .35s var(--ease), box-shadow .35s var(--ease); }
.card:hover { transform: translateY(-6px); box-shadow: 0 0 0 1.5px var(--violet), 0 24px 40px -24px rgba(232,72,12,.45); }
${DUO_CSS}
.card .ico-box, .ico-big { position: relative; overflow: hidden; display: grid; place-items: center; background: linear-gradient(145deg, #FF7A3D 0%, #FF5A1F 40%, #E11D2E 100%); box-shadow: 0 12px 26px -14px rgba(232,72,12,.65), inset 0 0 0 1px rgba(255,255,255,.12); transition: transform .45s var(--ease), box-shadow .45s var(--ease); }
.card .ico-box::before, .ico-big::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 20% 15%, rgba(255,255,255,.32), transparent 55%); transition: opacity .45s; }
.card .ico-box::after, .ico-big::after { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 30% 20%, rgba(255,255,255,.28), transparent 55%); opacity: 0; transition: opacity .45s; }
.card .ico-box { width: 60px; height: 60px; border-radius: 18px; margin-bottom: 6px; }
.card:hover .ico-box, .service-row:hover .ico-big { transform: translateY(-3px) rotate(-4deg); box-shadow: 0 18px 30px -14px rgba(232,72,12,.7), inset 0 0 0 1px rgba(255,255,255,.18); }
.card:hover .ico-box::after, .service-row:hover .ico-big::after { opacity: 1; }
.dark .card .ico-box { background: rgba(255,255,255,.2); }
.card p { color: var(--muted); font-size: 15px; }
.dark .card { background: rgba(255,255,255,.12); box-shadow: 0 0 0 1px rgba(255,255,255,.25); }
.dark .card p { color: var(--lilac); }
.dark .card:hover { box-shadow: 0 0 0 1.5px var(--green), 0 24px 40px -24px rgba(255,255,255,.35); }
.checks { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; font-size: 15px; }
.checks li { display: flex; align-items: center; gap: 10px; }
.checks .ico { width: 18px; height: 18px; color: var(--violet); }

/* Abas e planos */
.tabs { display: inline-flex; padding: 5px; border-radius: 999px; background: var(--white); box-shadow: 0 0 0 1px var(--line); margin-bottom: 36px; }
.tabs button { border: 0; background: none; padding: 11px 22px; border-radius: 999px; font: 600 15px/1 var(--f-display); color: var(--muted); cursor: pointer; transition: background-color .3s, color .3s; }
.tabs button[aria-selected="true"] { background: var(--violet); color: var(--white); }
.tab-panel[hidden] { display: none; }
.tab-panel { animation: fadeUp .5s var(--ease); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } }
.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: stretch; }
@media (max-width: 960px) { .plans { grid-template-columns: 1fr; max-width: 440px; } }
.plan { background: var(--white); border-radius: 24px; padding: 32px; display: grid; gap: 16px; align-content: start; box-shadow: 0 0 0 1px var(--line); position: relative; transition: transform .35s var(--ease), box-shadow .35s var(--ease); }
.plan:hover { transform: translateY(-6px); box-shadow: 0 0 0 1.5px var(--violet), 0 28px 50px -28px rgba(232,72,12,.5); }
.plan.featured { background: linear-gradient(150deg, #FF6A2B, #E8480C 55%, #E11D2E); color: var(--white); box-shadow: 0 30px 60px -30px rgba(232,72,12,.75); }
.plan.featured:hover { box-shadow: 0 0 0 1.5px var(--green), 0 30px 60px -30px rgba(30,21,18,.8); }
.plan .badge { position: absolute; top: 24px; right: 24px; font: 500 11px/1 var(--f-mono); letter-spacing: .08em; text-transform: uppercase; padding: 7px 10px; border-radius: 999px; background: var(--green); color: var(--pink); }
.plan .name { font: 500 12px/1 var(--f-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--violet); }
.plan.featured .name { color: var(--lilac); }
.plan .speed { font: 700 60px/1 var(--f-display); letter-spacing: -0.04em; }
.plan .speed small { font-size: 20px; font-weight: 600; margin-left: 6px; letter-spacing: 0; }
.plan .price { font: 700 24px/1 var(--f-display); }
.plan .price small { font: 500 14px var(--f-body); opacity: .7; }
.plan p { font-size: 15px; color: var(--muted); }
.plan.featured p { color: var(--lilac); }
.plan.featured .checks .ico { color: var(--green); }
.plan hr { border: 0; height: 1px; background: currentColor; opacity: .12; margin: 0; width: 100%; }
.plan .btn { width: 100%; margin-top: 8px; }
.note { font-size: 13.5px; color: var(--muted); margin-top: 20px; }

/* Passos */
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; position: relative; }
.steps::before { content: ""; position: absolute; top: 27px; left: 8%; right: 8%; height: 2px; background: linear-gradient(90deg, var(--violet), var(--pink)); }
@media (max-width: 800px) { .steps { grid-template-columns: 1fr; } .steps::before { display: none; } }
.step { display: grid; gap: 12px; position: relative; }
.step .num { width: 56px; height: 56px; border-radius: 50%; background: var(--white); box-shadow: 0 0 0 2px var(--violet); display: grid; place-items: center; font: 700 20px/1 var(--f-display); color: var(--violet); transition: background-color .3s, color .3s; }
.step:hover .num { background: var(--violet); color: var(--white); }
.step p { color: var(--muted); }

/* Depoimentos */
.quote { background: var(--white); border-radius: 20px; padding: 28px; display: grid; gap: 18px; box-shadow: 0 0 0 1px var(--line); align-content: space-between; }
.quote p { font: 500 17px/1.55 var(--f-display); }
.quote footer { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--muted); }
.quote footer i { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--violet), var(--pink)); flex: none; }
.quote footer b { display: block; color: var(--ink); font-family: var(--f-display); }

/* Faixa CTA */
.cta { position: relative; overflow: hidden; border-radius: 28px; padding: clamp(36px, 6vw, 72px); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 28px; }
.cta::after { content: ""; position: absolute; width: 380px; height: 380px; right: -100px; bottom: -180px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.35), transparent 65%); pointer-events: none; }
.cta p { color: var(--lilac); margin-top: 10px; font-size: 17px; }
.cta > * { position: relative; z-index: 1; }

/* Página interna */
.page-head { position: relative; overflow: hidden; padding: 150px 0 72px; }
.page-head::before { content: ""; position: absolute; width: 600px; height: 600px; right: -160px; top: -260px; border-radius: 50%; background: radial-gradient(circle, rgba(255,196,150,.45), transparent 65%); }
.page-head .container { position: relative; display: grid; gap: 18px; }
.page-head p { color: var(--lilac); font-size: 19px; max-width: 58ch; }
.crumbs { font: 500 12.5px/1 var(--f-mono); color: var(--lilac); display: flex; gap: 8px; }
.crumbs a { color: var(--lilac); text-decoration: none; }
.crumbs a:hover { color: var(--white); }

/* Sobre */
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
@media (max-width: 900px) { .split { grid-template-columns: 1fr; gap: 40px; } }
.prose { display: grid; gap: 18px; font-size: 17.5px; }
.prose p:first-child { font: 600 24px/1.4 var(--f-display); letter-spacing: -0.01em; }
.netviz { aspect-ratio: 1; max-width: 100%; border-radius: 28px; position: relative; overflow: hidden; }
.netviz span { position: absolute; width: 12px; height: 12px; border-radius: 50%; background: var(--lilac); transform: translate(-50%, -50%); }
.netviz span.on { background: var(--green); box-shadow: 0 0 0 8px rgba(255,255,255,.18), 0 0 24px var(--green); animation: led 2.2s infinite; }
.netviz svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.netviz .cap { position: absolute; left: 24px; bottom: 22px; font: 500 12px/1.4 var(--f-mono); color: var(--lilac); }
.purpose { border-left: 3px solid var(--green); padding: 6px 0 6px 24px; font: 600 clamp(22px, 3vw, 30px)/1.3 var(--f-display); letter-spacing: -0.015em; max-width: 30ch; }
.value { display: flex; gap: 14px; align-items: flex-start; padding: 22px 0; border-top: 1px solid rgba(255,255,255,.1); }
.value .ico { color: var(--green); margin-top: 3px; }
.value b { font: 600 19px/1.3 var(--f-display); display: block; }
.value span { color: var(--lilac); }
.chips { display: flex; flex-wrap: wrap; gap: 10px; }
.chip { padding: 10px 18px; border-radius: 999px; background: var(--white); box-shadow: 0 0 0 1px var(--line); font: 500 15px/1 var(--f-display); transition: transform .25s var(--ease), box-shadow .25s; }
.chip:hover { transform: translateY(-2px); box-shadow: 0 0 0 1.5px var(--violet); }
.chip.on { background: var(--ink); color: var(--white); box-shadow: none; display: inline-flex; align-items: center; gap: 10px; }
.chip small { font: 500 11px var(--f-mono); color: var(--muted); margin-left: 6px; text-transform: uppercase; letter-spacing: .06em; }

/* Serviços */
.service-row { display: grid; grid-template-columns: 200px 1fr 1fr; gap: 40px; padding: 44px 0; border-top: 1px solid var(--line); align-items: start; }
.service-row:last-child { border-bottom: 1px solid var(--line); }
@media (max-width: 860px) { .service-row { grid-template-columns: 1fr; gap: 18px; } }
.service-row .ico-big { width: 80px; height: 80px; border-radius: 24px; }
.service-row .ico-big .duo { width: 40px; height: 40px; }
.service-row p { color: var(--muted); margin-top: 10px; font-size: 16.5px; }

/* FAQ */
.faq-layout { display: grid; grid-template-columns: 1fr 340px; gap: 48px; align-items: start; }
@media (max-width: 900px) { .faq-layout { grid-template-columns: 1fr; } }
.acc { border-top: 1px solid var(--line); }
.acc-item { border-bottom: 1px solid var(--line); }
.acc-item button { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 20px; background: none; border: 0; padding: 24px 0; text-align: left; font: 600 18px/1.4 var(--f-display); color: var(--ink); cursor: pointer; }
.acc-item button:hover { color: var(--violet); }
.acc-item button .pm { width: 34px; height: 34px; border-radius: 50%; flex: none; display: grid; place-items: center; box-shadow: inset 0 0 0 1.5px var(--line); transition: transform .35s var(--ease), background-color .3s, color .3s, box-shadow .3s; }
.acc-item button[aria-expanded="true"] .pm { transform: rotate(45deg); background: var(--violet); color: var(--white); box-shadow: none; }
.acc-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .4s var(--ease); }
.acc-body > div { overflow: hidden; }
.acc-body p { color: var(--muted); padding-bottom: 24px; max-width: 64ch; }
.acc-item.open .acc-body { grid-template-rows: 1fr; }
.side-card { position: sticky; top: 100px; border-radius: 24px; padding: 30px; display: grid; gap: 14px; }
.side-card p { color: var(--lilac); }

/* Formulários */
.form { display: grid; gap: 18px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
@media (max-width: 620px) { .row { grid-template-columns: 1fr; } }
.field { display: grid; gap: 8px; font: 600 14px/1.2 var(--f-display); }
.field input, .field select, .field textarea { font: 400 16px var(--f-body); color: var(--ink); padding: 15px 16px; border: 0; border-radius: 14px; background: var(--mist); box-shadow: inset 0 0 0 1px transparent; transition: box-shadow .25s, background-color .25s; width: 100%; }
.field input:hover, .field select:hover, .field textarea:hover { box-shadow: inset 0 0 0 1px var(--lilac); }
.field input:focus, .field select:focus, .field textarea:focus { outline: none; background: var(--white); box-shadow: inset 0 0 0 2px var(--violet), 0 0 0 5px rgba(232,72,12,.12); }
.field textarea { min-height: 140px; resize: vertical; }
.form-ok { display: none; align-items: center; gap: 12px; background: #E8FBF2; color: #0B6B41; border-radius: 14px; padding: 16px 18px; font-weight: 600; animation: fadeUp .5s var(--ease); }
.form.sent .form-ok { display: flex; }
.form-card { background: var(--white); border-radius: 28px; padding: clamp(24px, 4vw, 44px); box-shadow: 0 0 0 1px var(--line), 0 40px 80px -50px rgba(30,21,18,.4); }
.contact-layout { display: grid; grid-template-columns: 1.35fr 1fr; gap: 32px; align-items: start; }
@media (max-width: 900px) { .contact-layout { grid-template-columns: 1fr; } }
.info { display: grid; gap: 12px; }
.info a, .info div.item { display: flex; gap: 16px; align-items: center; padding: 20px; border-radius: 18px; background: var(--white); box-shadow: 0 0 0 1px var(--line); text-decoration: none; color: var(--ink); transition: transform .3s var(--ease), box-shadow .3s; }
.info a:hover { transform: translateX(6px); box-shadow: 0 0 0 1.5px var(--violet); }
.info .ib { width: 48px; height: 48px; border-radius: 15px; background: linear-gradient(145deg, #FF7A3D, #FF5A1F 40%, #E11D2E); color: var(--white); display: grid; place-items: center; flex: none; box-shadow: 0 10px 20px -12px rgba(232,72,12,.6); transition: transform .4s var(--ease); }
.info .ib-wa { color: var(--green); }
.info a:hover .ib { transform: rotate(-6deg); }
.info b { display: block; font-family: var(--f-display); }
.info span { color: var(--muted); font-size: 14.5px; }
fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 16px; }
legend { font: 700 20px var(--f-display); margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
legend i { font: 500 12px/1 var(--f-mono); font-style: normal; width: 30px; height: 30px; border-radius: 50%; background: var(--ink); color: var(--white); display: grid; place-items: center; }
.plan-pick { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 720px) { .plan-pick { grid-template-columns: 1fr; } }
.plan-pick label { position: relative; border-radius: 18px; padding: 20px; cursor: pointer; display: grid; gap: 4px; background: var(--mist); box-shadow: inset 0 0 0 1.5px transparent; transition: box-shadow .25s, background-color .25s, transform .25s var(--ease); }
.plan-pick label:hover { transform: translateY(-3px); box-shadow: inset 0 0 0 1.5px var(--lilac); }
.plan-pick input { position: absolute; opacity: 0; }
.plan-pick b { font: 700 26px/1 var(--f-display); letter-spacing: -0.02em; }
.plan-pick span { font: 500 12px var(--f-mono); color: var(--violet); text-transform: uppercase; letter-spacing: .1em; }
.plan-pick em { font-style: normal; color: var(--muted); font-size: 14.5px; }
.plan-pick label:has(input:checked) { background: var(--white); box-shadow: inset 0 0 0 2px var(--violet), 0 16px 30px -18px rgba(232,72,12,.6); }
.plan-pick label:has(input:focus-visible) { outline: 2px solid var(--violet); outline-offset: 3px; }
.assine-layout { display: grid; grid-template-columns: 1fr 340px; gap: 32px; align-items: start; }
@media (max-width: 980px) { .assine-layout { grid-template-columns: 1fr; } }
.summary { position: sticky; top: 100px; border-radius: 24px; padding: 28px; display: grid; gap: 16px; }
.summary .sp { font: 700 56px/1 var(--f-display); letter-spacing: -0.04em; }
.summary .sp small { font-size: 18px; margin-left: 6px; color: var(--lilac); }
.summary .line { display: flex; justify-content: space-between; font-size: 15px; color: var(--lilac); border-top: 1px solid rgba(255,255,255,.1); padding-top: 14px; }
.summary .line b { color: var(--white); font-family: var(--f-display); }

/* Redes */
.social { display: flex; gap: 10px; flex-wrap: wrap; }
.social a { position: relative; width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; color: var(--white); background: var(--violet); overflow: hidden; isolation: isolate; transition: transform .4s var(--ease), color .3s, box-shadow .4s; }
.social a::before { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: 50%; background: var(--pink); transform: scale(0); transition: transform .4s var(--ease); }
.social a .ico { width: 20px; height: 20px; }
.social a:hover { transform: translateY(-3px); box-shadow: 0 12px 22px -10px rgba(232,72,12,.7); }
.social a:hover::before { transform: scale(1); }
.footer .social a { background: rgba(255,255,255,.06); box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); color: var(--lilac); }
.footer .social a::before { background: var(--green); }
.footer .social a:hover { color: var(--ink); box-shadow: 0 12px 22px -10px rgba(255,255,255,.6); }

/* Rodapé */
.footer { padding: 80px 0 32px; font-size: 15px; color: var(--lilac); }
.footer .cols { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1.2fr; gap: 40px; }
@media (max-width: 900px) { .footer .cols { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .footer .cols { grid-template-columns: 1fr; } }
.footer .logo { width: 120px; color: var(--white); display: block; margin-bottom: 18px; }
.footer h3 { font: 500 12px/1 var(--f-mono); letter-spacing: .12em; text-transform: uppercase; color: var(--white); margin-bottom: 18px; }
.footer ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.footer a { color: var(--lilac); text-decoration: none; transition: color .2s; }
.footer a:hover { color: var(--green); }
.footer .bottom { margin-top: 56px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.1); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 13px; }
.wa-float { position: fixed; right: max(20px, env(safe-area-inset-right)); bottom: max(20px, env(safe-area-inset-bottom)); z-index: 50; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(145deg, #FF6A2B, #E11D2E); color: var(--white); display: grid; place-items: center; box-shadow: 0 12px 30px -8px rgba(232,72,12,.6); transition: transform .3s var(--ease); }
.wa-float:hover { transform: scale(1.08) rotate(-8deg); }
.wa-float .ico { width: 30px; height: 30px; }

/* Entrada ao rolar */
.reveal.pre { opacity: 0; transform: translateY(28px); }
.reveal { transition: opacity .8s var(--ease), transform .8s var(--ease); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .reveal.pre { opacity: 1; transform: none; }
  html { scroll-behavior: auto; }
}
`;

const js = `// Vyra · modelo Intermediário
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Topo muda ao rolar
  var top = document.querySelector('.topbar');
  function onScroll() { top.classList.toggle('scrolled', window.scrollY > 20); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  var btn = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.innerHTML = open ? btn.dataset.close : btn.dataset.open;
  });

  // Entrada ao rolar: só esconde o que ainda está abaixo da tela
  var items = [].slice.call(document.querySelectorAll('.reveal'));
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el, i) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('pre');
        el.style.transitionDelay = ((el.dataset.d || 0) * 90) + 'ms';
        io.observe(el);
      }
    });
  }

  // Contadores
  function count(el) {
    var end = parseFloat(el.dataset.count), dur = 1400, t0 = null, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = end + suf; return; }
    function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = v + suf; if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { count(e.target); co.unobserve(e.target); } }); });
    counters.forEach(function (c) { co.observe(c); });
  } else counters.forEach(count);

  // Medidor do hero
  var m = document.querySelector('.meter i'); if (m) setTimeout(function () { m.style.width = m.dataset.w; }, 300);

  // Abas Casa / Empresa
  document.querySelectorAll('[role=tablist]').forEach(function (tl) {
    var tabs = tl.querySelectorAll('[role=tab]');
    tabs.forEach(function (t) { t.addEventListener('click', function () {
      tabs.forEach(function (o) { o.setAttribute('aria-selected', o === t); document.getElementById(o.getAttribute('aria-controls')).hidden = o !== t; });
    }); });
  });

  // FAQ (acordeão)
  document.querySelectorAll('.acc-item button').forEach(function (b) {
    b.addEventListener('click', function () {
      var item = b.closest('.acc-item'), open = !item.classList.contains('open');
      item.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
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

  // Formulários (integre aqui com seu backend, e-mail ou WhatsApp)
  document.querySelectorAll('form.form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      f.classList.add('sent'); var ok = f.querySelector('.form-ok'); ok && ok.focus();
    });
  });

  // Assine já: plano pela URL (#conecta) e resumo ao lado
  var radios = document.querySelectorAll('input[name=plano]');
  function sync() {
    var r = document.querySelector('input[name=plano]:checked'); if (!r) return;
    var s = document.querySelector('.summary'); if (!s) return;
    s.querySelector('[data-s=name]').textContent = r.dataset.name;
    s.querySelector('[data-s=speed]').innerHTML = r.dataset.speed + '<small>' + r.dataset.unit + '</small>';
    s.querySelector('[data-s=price]').textContent = 'R$ ' + r.dataset.price;
  }
  var h = location.hash.slice(1), pre = h && document.querySelector('input[name=plano][value="' + h + '"]');
  if (pre) pre.checked = true;
  radios.forEach(function (r) { r.addEventListener('change', sync); }); sync();

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
`;

// ---------- partes ----------
function header(c, page) {
  return `<header class="topbar">
  <div class="container">
    <a class="brand" href="index.html" aria-label="Vyra, página inicial">${logo('logo', '#FFFFFF')}</a>
    <button class="menu-btn" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav" data-open='${icon('menu')}' data-close='${icon('close')}'>${icon('menu')}</button>
    <nav class="nav" id="nav" aria-label="Principal">
      ${navLinks(c, page)}
      <a class="btn btn-green" href="${c.cta.href}"${page === 'assine' ? ' aria-current="page"' : ''}>${c.cta.label}${icon('arrow')}</a>
    </nav>
  </div>
</header>`;
}

function footer(c) {
  return `<footer class="footer dark dots">
  <div class="container">
    <div class="cols">
      <div>${logo()}<p style="max-width:32ch">${esc(c.brand.slogan)} ${esc(c.brand.support)}</p><div style="margin-top:22px">${socialLinks(c, 'social', true)}</div></div>
      <div><h3>Navegação</h3><ul>${c.nav.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}</ul></div>
      <div><h3>Serviços</h3><ul>${c.services.map(s => `<li><a href="servicos.html#${s.id}">${s.title}</a></li>`).join('')}</ul></div>
      <div><h3>Contato</h3><ul><li>${c.contact.whatsapp}</li><li>${c.contact.email}</li><li>${c.contact.address}<br>${c.contact.city}</li><li><a href="${c.cta.href}" style="color:var(--green)">${c.cta.label} →</a></li></ul></div>
    </div>
    <div class="bottom"><span>© <span id="year">2026</span> Vyra Fibra · CNPJ 00.000.000/0001-00</span><span>Feito no interior, para o interior.</span></div>
  </div>
</footer>
<a class="wa-float" href="${c.contact.whatsappLink}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${socialIcon('whatsapp')}</a>`;
}

function pageHead(title, lead, crumb) {
  return `<section class="page-head dark dots"><div class="container">
  <nav class="crumbs" aria-label="Você está em"><a href="index.html">Início</a><span>/</span><span>${crumb}</span></nav>
  <h1>${title}</h1><p>${lead}</p></div></section>`;
}

function plansGrid(c) {
  return `<div class="plans">${c.plans.map((p, i) => `
    <article class="plan reveal${p.featured ? ' featured' : ''}" data-d="${i}">
      ${p.featured ? '<span class="badge">Mais escolhido</span>' : ''}
      <span class="name">${p.name}</span>
      <div class="speed">${p.speed}<small>${p.unit}</small></div>
      <p>${p.tagline}</p>
      <hr>
      <ul class="checks">${p.features.map(f => `<li>${icon('check')}${f}</li>`).join('')}</ul>
      <div class="price">R$ ${p.price}<small> /mês</small></div>
      <a class="btn ${p.featured ? 'btn-green' : 'btn-line'}" href="assine.html#${p.id}">Assinar ${p.name}${icon('arrow')}</a>
    </article>`).join('')}
  </div>`;
}

function cta(c) {
  return `<section class="section"><div class="container">
  <div class="cta dark dots reveal">
    <div><h2>Pronto para uma internet que não cai?</h2><p>${esc(c.brand.support)}</p></div>
    <div style="display:flex;gap:14px;flex-wrap:wrap"><a class="btn btn-green" href="assine.html">Assine já${icon('arrow')}</a><a class="btn btn-ghost" href="contato.html">Falar com a gente</a></div>
  </div></div></section>`;
}

function netviz() {
  const nodes = [[18, 24], [42, 14], [70, 22], [84, 46], [62, 50], [34, 44], [16, 66], [44, 76], [74, 78], [52, 32]];
  const links = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 6], [6, 7], [7, 8], [8, 3], [4, 7], [1, 9], [9, 4], [9, 2]];
  return `<div class="netviz dark dots reveal">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${links.map(([a, b]) => `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="rgba(255,255,255,.55)" stroke-width=".5"/>`).join('')}</svg>
    ${nodes.map(([x, y], i) => `<span${i === 4 ? ' class="on"' : ''} style="left:${x}%;top:${y}%"></span>`).join('')}
    <div class="cap">rede Vyra · nó Marialva online</div>
  </div>`;
}

// ---------- páginas ----------
const pages = {
  index: c => `${header(c, 'index')}
<main>
  <section class="hero dark dots"><div class="container">
    <div>
      <span class="status"><i class="led"></i>rede online · ${c.cities.now[0]}</span>
      <h1>Velocidade de capital, <em>onde você está.</em></h1>
      <p class="lead">Internet 100% fibra óptica para casas e empresas do interior, com instalação agendada e suporte de técnicos da sua região.</p>
      <div class="actions"><a class="btn btn-green" href="assine.html">Assine já${icon('arrow')}</a><a class="btn btn-ghost" href="servicos.html">Conhecer planos</a></div>
    </div>
    <div class="speed-card" aria-label="Exemplo de medição do plano Conecta">
      <div class="top"><span>Plano Conecta</span><span><i class="led" style="display:inline-block;margin-right:8px"></i>conectado</span></div>
      <div class="big"><span data-count="600">600</span><small>Mbps</small></div>
      <div class="meter"><i data-w="78%"></i></div>
      <div class="kv"><div><span>upload</span><b>300</b></div><div><span>latência</span><b>4 ms</b></div><div><span>Wi-Fi</span><b>6</b></div></div>
    </div>
  </div></section>

  <div class="container stats-wrap"><div class="stats reveal">${c.stats.map(s => `<div><b data-count="${s.value}" data-suffix="${s.suffix}">${s.value}${s.suffix}</b><span>${s.label}</span></div>`).join('')}</div></div>

  <section class="section"><div class="container">
    <div class="section-head reveal"><span class="eyebrow">Por que a Vyra</span><h2>Uma rede pensada para o interior</h2><p>Tecnologia de capital com o atendimento de quem conhece a sua cidade.</p></div>
    <div class="grid g4">${c.benefits.map((b, i) => `<div class="card reveal" data-d="${i}"><div class="ico-box">${duo(b.icon)}</div><h3>${b.title}</h3><p>${b.text}</p></div>`).join('')}</div>
  </div></section>

  <section class="section alt"><div class="container">
    <div class="section-head reveal"><span class="eyebrow">Planos</span><h2>Escolha a velocidade ideal</h2></div>
    <div class="tabs" role="tablist" aria-label="Tipo de cliente">
      <button role="tab" aria-selected="true" aria-controls="tab-casa" id="t-casa">Para casa</button>
      <button role="tab" aria-selected="false" aria-controls="tab-empresa" id="t-empresa">Para empresa</button>
    </div>
    <div class="tab-panel" id="tab-casa" role="tabpanel" aria-labelledby="t-casa">${plansGrid(c)}<p class="note">Valores de exemplo. Consulte a disponibilidade para o seu endereço.</p></div>
    <div class="tab-panel" id="tab-empresa" role="tabpanel" aria-labelledby="t-empresa" hidden>
      <div class="grid g4">${c.business.map((b, i) => `<div class="card"><div class="ico-box">${duo(BIZ_ICONS[i])}</div><h3>${b.title}</h3><p>${b.text}</p></div>`).join('')}</div>
      <div style="margin-top:28px"><a class="btn" href="contato.html">Pedir proposta${icon('arrow')}</a></div>
    </div>
  </div></section>

  <section class="section"><div class="container">
    <div class="section-head center reveal"><span class="eyebrow">Como funciona</span><h2>Da consulta ao Wi-Fi em três passos</h2></div>
    <div class="steps">${c.steps.map((s, i) => `<div class="step reveal" data-d="${i}"><div class="num">${i + 1}</div><h3>${s.title}</h3><p>${s.text}</p></div>`).join('')}</div>
  </div></section>

  <section class="section alt"><div class="container">
    <div class="section-head reveal"><span class="eyebrow">Clientes</span><h2>Quem usa, recomenda</h2></div>
    <div class="grid g3">${c.testimonials.map((t, i) => `<blockquote class="quote reveal" data-d="${i}" style="margin:0"><p>“${t.text}”</p><footer><i></i><div><b>${t.who}</b>${t.where} · exemplo</div></footer></blockquote>`).join('')}</div>
  </div></section>
  ${cta(c)}
</main>
${footer(c)}`,

  sobre: c => `${header(c, 'sobre')}
<main>
  ${pageHead('Sobre a Vyra', c.about.intro, 'Sobre nós')}
  <section class="section"><div class="container split">
    <div class="prose reveal">${c.about.story.map(p => `<p>${p}</p>`).join('')}</div>
    ${netviz()}
  </div></section>
  <section class="section dark dots"><div class="container split" style="align-items:start">
    <div class="reveal"><span class="eyebrow">Propósito</span><div class="purpose" style="margin-top:20px">${c.about.purpose}</div></div>
    <div class="reveal">${c.about.values.map(v => `<div class="value">${icon('check')}<div><b>${v.title}</b><span>${v.text}</span></div></div>`).join('')}</div>
  </div></section>
  <section class="section"><div class="container">
    <div class="section-head reveal"><span class="eyebrow">Cobertura</span><h2>Onde a fibra Vyra já chega</h2><p>Começamos em Marialva e seguimos crescendo pelo interior.</p></div>
    <div class="chips reveal">${c.cities.now.map(x => `<span class="chip on"><i class="led"></i>${x}</span>`).join('')}${c.cities.soon.map(x => `<span class="chip">${x}<small>em breve</small></span>`).join('')}</div>
  </div></section>
  <div class="container"><div class="stats reveal">${c.stats.map(s => `<div><b data-count="${s.value}" data-suffix="${s.suffix}">${s.value}${s.suffix}</b><span>${s.label}</span></div>`).join('')}</div></div>
  ${cta(c)}
</main>
${footer(c)}`,

  servicos: c => `${header(c, 'servicos')}
<main>
  ${pageHead('Serviços', 'Internet fibra óptica para casa, empresa e área rural, com suporte de quem está perto.', 'Serviços')}
  <section class="section"><div class="container">
    ${c.services.map(s => `<div class="service-row reveal" id="${s.id}">
      <div class="ico-big">${duo(s.icon)}</div>
      <div><h2 style="font-size:clamp(24px,3vw,32px)">${s.title}</h2><p>${s.text}</p></div>
      <ul class="checks">${s.items.map(i => `<li>${icon('check')}${i}</li>`).join('')}</ul>
    </div>`).join('')}
    <p class="note">* Sujeito à disponibilidade da equipe técnica na região.</p>
  </div></section>
  <section class="section alt"><div class="container">
    <div class="section-head reveal"><span class="eyebrow">Residencial</span><h2>Planos para a sua casa</h2></div>
    ${plansGrid(c)}<p class="note">Valores de exemplo.</p>
  </div></section>
  <section class="section dark dots"><div class="container">
    <div class="section-head reveal"><span class="eyebrow">Vyra Empresas</span><h2>Sua operação não pode parar</h2><p>Conexão dedicada com garantia em contrato.</p></div>
    <div class="grid g4">${c.business.map((b, i) => `<div class="card reveal" data-d="${i}"><h3>${b.title}</h3><p>${b.text}</p></div>`).join('')}</div>
    <div style="margin-top:32px"><a class="btn btn-green" href="contato.html">Pedir proposta${icon('arrow')}</a></div>
  </div></section>
  ${cta(c)}
</main>
${footer(c)}`,

  faq: c => `${header(c, 'faq')}
<main>
  ${pageHead('Perguntas frequentes', 'Respostas rápidas sobre instalação, planos e suporte.', 'FAQ')}
  <section class="section"><div class="container faq-layout">
    <div class="acc reveal">${c.faq.map((f, i) => `<div class="acc-item">
      <button aria-expanded="false" aria-controls="faq-${i}">${f.q}<span class="pm">${icon('plus')}</span></button>
      <div class="acc-body" id="faq-${i}"><div><p>${f.a}</p></div></div>
    </div>`).join('')}</div>
    <aside class="side-card dark dots reveal">
      <h3>Ainda com dúvida?</h3><p>Fale com um técnico da sua região. A gente responde rápido.</p>
      <a class="btn btn-green" href="${c.contact.whatsappLink}" target="_blank" rel="noopener">${socialIcon('whatsapp')}WhatsApp</a>
      <a class="btn btn-ghost" href="contato.html">Enviar mensagem</a>
    </aside>
  </div></section>
</main>
${footer(c)}`,

  contato: c => `${header(c, 'contato')}
<main>
  ${pageHead('Fale com a gente', 'Tire dúvidas, peça uma proposta para sua empresa ou fale com o suporte.', 'Contato')}
  <section class="section"><div class="container contact-layout">
    <form class="form form-card reveal" novalidate>
      <div class="row">
        <label class="field" for="c-nome">Nome<input id="c-nome" autocomplete="name" required></label>
        <label class="field" for="c-tel">WhatsApp<input id="c-tel" inputmode="tel" data-mask="tel" autocomplete="tel" required></label>
      </div>
      <label class="field" for="c-email">E-mail<input id="c-email" type="email" autocomplete="email" required></label>
      <label class="field" for="c-assunto">Assunto<select id="c-assunto"><option>Quero contratar</option><option>Proposta para empresa</option><option>Suporte técnico</option><option>Financeiro</option><option>Outro</option></select></label>
      <label class="field" for="c-msg">Mensagem<textarea id="c-msg" required></textarea></label>
      <div><button class="btn" type="submit">Enviar mensagem${icon('arrow')}</button></div>
      <div class="form-ok" tabindex="-1" role="status">${icon('check')}Mensagem enviada. Respondemos em breve.</div>
    </form>
    <div class="info reveal" data-d="1">
      <a href="${c.contact.whatsappLink}" target="_blank" rel="noopener"><span class="ib ib-wa">${socialIcon('whatsapp')}</span><div><b>WhatsApp</b><span>${c.contact.whatsapp}</span></div></a>
      <div class="item"><span class="ib">${icon('phone')}</span><div><b>Telefone</b><span>${c.contact.phone}</span></div></div>
      <div class="item"><span class="ib">${icon('mail')}</span><div><b>E-mail</b><span>${c.contact.email}</span></div></div>
      <div class="item"><span class="ib">${icon('pin')}</span><div><b>Endereço</b><span>${c.contact.address} · ${c.contact.city}</span></div></div>
      <div class="item"><span class="ib">${icon('clock')}</span><div>${c.contact.hours.map(h => `<b>${h[0]}</b><span>${h[1]}</span>`).join('<br>')}</div></div>
      <div class="item" style="justify-content:space-between;flex-wrap:wrap"><b>Siga a Vyra</b>${socialLinks(c, 'social', true)}</div>
    </div>
  </div></section>
</main>
${footer(c)}`,

  assine: c => `${header(c, 'assine')}
<main>
  ${pageHead('Assine já', 'Leva dois minutos. A gente confirma a cobertura e agenda a instalação com você.', 'Assine já')}
  <section class="section"><div class="container assine-layout">
    <form class="form form-card" novalidate>
      <fieldset><legend><i>1</i>Escolha o plano</legend>
        <div class="plan-pick">${c.plans.map(p => `<label><input type="radio" name="plano" value="${p.id}" data-name="${p.name}" data-speed="${p.speed}" data-unit="${p.unit}" data-price="${p.price}"${p.featured ? ' checked' : ''} required><span>${p.name}</span><b>${p.speed} ${p.unit}</b><em>R$ ${p.price}/mês</em></label>`).join('')}</div>
      </fieldset>
      <fieldset><legend><i>2</i>Seus dados</legend>
        <div class="row"><label class="field" for="a-nome">Nome completo<input id="a-nome" autocomplete="name" required></label><label class="field" for="a-cpf">CPF<input id="a-cpf" inputmode="numeric" required></label></div>
        <div class="row"><label class="field" for="a-tel">WhatsApp<input id="a-tel" inputmode="tel" data-mask="tel" required></label><label class="field" for="a-email">E-mail<input id="a-email" type="email" required></label></div>
      </fieldset>
      <fieldset><legend><i>3</i>Endereço de instalação</legend>
        <div class="row"><label class="field" for="a-cep">CEP<input id="a-cep" inputmode="numeric" data-mask="cep" placeholder="00000-000" required></label><label class="field" for="a-num">Número<input id="a-num" required></label></div>
        <label class="field" for="a-rua">Rua<input id="a-rua" required></label>
        <div class="row"><label class="field" for="a-bairro">Bairro<input id="a-bairro" required></label><label class="field" for="a-periodo">Melhor período<select id="a-periodo"><option>Manhã</option><option>Tarde</option><option>Sábado</option></select></label></div>
      </fieldset>
      <div><button class="btn" type="submit">Enviar pedido${icon('arrow')}</button></div>
      <div class="form-ok" tabindex="-1" role="status">${icon('check')}Pedido recebido. Vamos falar com você pelo WhatsApp.</div>
    </form>
    <aside class="summary dark dots" aria-live="polite">
      <span class="eyebrow">Seu plano</span>
      <h3 data-s="name">Conecta</h3>
      <div class="sp" data-s="speed">600<small>Mega</small></div>
      <div class="line"><span>Mensalidade</span><b data-s="price">R$ 129,90</b></div>
      <div class="line"><span>Instalação</span><b>Grátis</b></div>
      <div class="line"><span>Wi-Fi</span><b>Incluso</b></div>
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
