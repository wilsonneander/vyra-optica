// MODELO PREMIUM — experiência sofisticada: cursor próprio, rede animada em canvas, transições
// entre páginas, botões magnéticos, textos que se revelam, simulador de plano e assinatura em etapas.
const { logo, icon, socialLinks, esc, navLinks, shell } = require('./helpers');

const FONTS = 'family=Outfit:wght@300;400;500;600;700&family=Manrope:wght@400;500;600&family=JetBrains+Mono:wght@400;500';

// Divide um título em palavras animáveis. *palavra* recebe destaque.
function split(text, base = 0) {
  return text.split(' ').map((w, i) => {
    const em = /^\*.*\*[.,]?$/.test(w);
    const clean = w.replace(/\*/g, '');
    return `<span class="w"><span style="--i:${base + i}"${em ? ' class="em"' : ''}>${clean}</span></span>`;
  }).join(' ');
}

const css = `/* Vyra · modelo Premium */
:root {
  --violet: #6C2BD9; --violet-2: #8A55F0; --ink: #160B2E; --deep: #0C0619; --ink-2: #1D1138; --green: #18E28A;
  --lilac: #C9B6FF; --pink: #FF3EA5; --white: #FFFFFF; --fog: rgba(201,182,255,.66); --hair: rgba(201,182,255,.14);
  --f-display: "Outfit", system-ui, sans-serif; --f-body: "Manrope", system-ui, sans-serif; --f-mono: "JetBrains Mono", ui-monospace, monospace;
  --max: 1240px; --ease: cubic-bezier(.16,1,.3,1); --d0: .15s;
  color-scheme: dark;
}
html.loading { --d0: 1.45s; }
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--deep); color: var(--white); font: 400 16px/1.7 var(--f-body); overflow-x: hidden; }
::selection { background: var(--green); color: var(--ink); }
a { color: inherit; }
h1, h2, h3 { font-family: var(--f-display); margin: 0; font-weight: 400; text-wrap: balance; }
h1 { font-size: clamp(46px, 8.4vw, 124px); line-height: .96; letter-spacing: -0.045em; font-weight: 300; }
h2 { font-size: clamp(36px, 5.4vw, 76px); line-height: 1; letter-spacing: -0.04em; font-weight: 300; }
h3 { font-size: 22px; line-height: 1.25; letter-spacing: -0.015em; font-weight: 500; }
h1 b, h2 b, .em { font-weight: 600; }
.em { color: var(--green); }
p { margin: 0; }
.container { max-width: var(--max); margin: 0 auto; padding-left: max(24px, env(safe-area-inset-left)); padding-right: max(24px, env(safe-area-inset-right)); }
.section { padding: clamp(96px, 12vw, 160px) 0; position: relative; }
.label { font: 400 12px/1 var(--f-mono); letter-spacing: .18em; text-transform: uppercase; color: var(--fog); display: inline-flex; align-items: center; gap: 12px; }
.label::before { content: ""; width: 28px; height: 1px; background: var(--green); }
.lead { font-size: clamp(17px, 1.6vw, 20px); color: var(--fog); max-width: 52ch; }
.ico { width: 22px; height: 22px; flex: none; }
:focus-visible { outline: 2px solid var(--green); outline-offset: 4px; border-radius: 4px; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }

/* Palavras que sobem */
.w { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: .08em; margin-bottom: -.08em; }
.w > span { display: inline-block; animation: wordUp 1.1s var(--ease) both; animation-delay: calc(var(--d0) + var(--i) * 60ms); }
@keyframes wordUp { from { transform: translateY(105%) rotate(4deg); } }

/* Carregamento e transição */
.loader { position: fixed; inset: 0; z-index: 200; background: var(--deep); display: none; flex-direction: column; align-items: center; justify-content: center; gap: 26px; }
html.loading .loader { display: flex; animation: loaderOut .9s var(--ease) 1.15s forwards; }
.loader .logo { width: 140px; color: var(--white); animation: fadeIn .6s ease both; }
.loader .bar { width: 160px; height: 2px; background: var(--hair); border-radius: 2px; overflow: hidden; }
.loader .bar i { display: block; height: 100%; background: linear-gradient(90deg, var(--violet), var(--lilac), var(--green)); transform-origin: left; animation: barFill 1s var(--ease) .1s both; }
@keyframes barFill { from { transform: scaleX(0); } }
@keyframes loaderOut { to { transform: translateY(-100%); visibility: hidden; } }
@keyframes fadeIn { from { opacity: 0; } }
.curtain { position: fixed; inset: 0; z-index: 190; background: var(--violet); transform: scaleY(0); transform-origin: bottom; pointer-events: none; transition: transform .55s var(--ease); }
.curtain.cover { transform: scaleY(1); }
html.from-nav .curtain { transform: scaleY(1); transform-origin: top; animation: curtainOut .75s var(--ease) .05s forwards; }
@keyframes curtainOut { to { transform: scaleY(0); } }

/* Cursor próprio */
.cursor-dot, .cursor-ring { position: fixed; left: 0; top: 0; z-index: 300; pointer-events: none; opacity: 0; transition: opacity .3s; }
.has-cursor .cursor-dot, .has-cursor .cursor-ring { opacity: 1; }
.cursor-dot { width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 50%; background: var(--green); }
.cursor-ring { width: 42px; height: 42px; margin: -21px 0 0 -21px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(201,182,255,.55); display: grid; place-items: center; transition: width .45s var(--ease), height .45s var(--ease), margin .45s var(--ease), background-color .35s, box-shadow .35s, opacity .3s; }
.cursor-ring span { font: 500 11px/1 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--ink); opacity: 0; transition: opacity .2s; white-space: nowrap; }
.cursor-ring.hover { width: 70px; height: 70px; margin: -35px 0 0 -35px; background: rgba(138,85,240,.18); box-shadow: inset 0 0 0 1px rgba(201,182,255,.25); }
.cursor-ring.text { width: 96px; height: 96px; margin: -48px 0 0 -48px; background: var(--green); box-shadow: none; }
.cursor-ring.text span { opacity: 1; }
.cursor-ring.down { transform: scale(.85); }
.has-cursor, .has-cursor a, .has-cursor button, .has-cursor label, .has-cursor [data-cursor] { cursor: none; }
.has-cursor input, .has-cursor textarea, .has-cursor select { cursor: text; }

/* Progresso de rolagem */
.progress { position: fixed; left: 0; right: 0; top: 0; height: 2px; z-index: 120; transform-origin: left; transform: scaleX(0); background: linear-gradient(90deg, var(--violet), var(--lilac), var(--green)); }

/* Topo */
.hdr { position: fixed; inset: 0 0 auto; z-index: 100; padding-top: env(safe-area-inset-top); transition: transform .6s var(--ease), background-color .4s; }
.hdr.solid { background: rgba(12,6,25,.72); backdrop-filter: blur(18px) saturate(1.4); -webkit-backdrop-filter: blur(18px) saturate(1.4); }
.hdr.hide { transform: translateY(-110%); }
.hdr .container { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; min-height: 84px; gap: 24px; }
.hdr .brand { color: var(--white); display: flex; width: max-content; }
.hdr .brand .logo { width: 104px; height: auto; display: block; }
.hdr nav { display: flex; gap: 6px; padding: 6px; border-radius: 999px; background: rgba(255,255,255,.04); box-shadow: inset 0 0 0 1px var(--hair); }
.hdr nav a { padding: 9px 16px; border-radius: 999px; text-decoration: none; font: 400 14.5px/1 var(--f-display); color: var(--fog); transition: color .3s, background-color .3s; }
.hdr nav a:hover { color: var(--white); }
.hdr nav a[aria-current="page"] { color: var(--ink); background: var(--lilac); }
.hdr .right { justify-self: end; display: flex; align-items: center; gap: 12px; }
.burger { display: none; width: 48px; height: 48px; border-radius: 50%; border: 0; background: rgba(255,255,255,.06); box-shadow: inset 0 0 0 1px var(--hair); color: var(--white); place-items: center; }
@media (max-width: 1000px) {
  .hdr .container { grid-template-columns: 1fr auto; }
  .hdr nav, .hdr .right .btn { display: none; }
  .burger { display: grid; }
}
.mmenu { position: fixed; inset: 0; z-index: 150; background: var(--deep); padding: calc(110px + env(safe-area-inset-top)) max(24px, env(safe-area-inset-left)) 40px; display: flex; flex-direction: column; justify-content: space-between; clip-path: circle(0 at calc(100% - 48px) 42px); transition: clip-path .8s var(--ease); visibility: hidden; }
.mmenu.open { clip-path: circle(150% at calc(100% - 48px) 42px); visibility: visible; }
.mmenu a.big { display: block; font: 300 clamp(40px, 11vw, 64px)/1.1 var(--f-display); letter-spacing: -0.04em; text-decoration: none; color: var(--white); opacity: 0; transform: translateY(30px); transition: opacity .6s var(--ease), transform .6s var(--ease); }
.mmenu a.big[aria-current="page"] { color: var(--green); }
.mmenu.open a.big { opacity: 1; transform: none; }
.mmenu.open a.big:nth-child(2) { transition-delay: .05s; } .mmenu.open a.big:nth-child(3) { transition-delay: .1s; } .mmenu.open a.big:nth-child(4) { transition-delay: .15s; } .mmenu.open a.big:nth-child(5) { transition-delay: .2s; } .mmenu.open a.big:nth-child(6) { transition-delay: .25s; }
.mmenu .close { position: absolute; right: max(24px, env(safe-area-inset-right)); top: calc(18px + env(safe-area-inset-top)); }

/* Botões */
.btn { position: relative; display: inline-flex; align-items: center; gap: 12px; padding: 17px 30px; border-radius: 999px; border: 0; font: 500 15.5px/1 var(--f-display); text-decoration: none; cursor: pointer; overflow: hidden; isolation: isolate; color: var(--ink); background: var(--green); transition: transform .5s var(--ease), box-shadow .5s var(--ease); will-change: transform; }
.btn::before { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; background: var(--white); transform: translateY(101%); transition: transform .55s var(--ease); }
.btn:hover::before { transform: translateY(0); }
.btn:hover { box-shadow: 0 18px 40px -14px rgba(24,226,138,.55); }
.btn .ico { width: 18px; height: 18px; transition: transform .5s var(--ease); }
.btn:hover .ico { transform: translateX(4px) rotate(-45deg); }
.btn.ghost { color: var(--white); background: transparent; box-shadow: inset 0 0 0 1px rgba(201,182,255,.35); }
.btn.ghost::before { background: var(--lilac); }
.btn.ghost:hover { color: var(--ink); box-shadow: none; }
.btn.violet { background: var(--violet); color: var(--white); }
.btn.violet::before { background: var(--green); }
.btn.violet:hover { color: var(--ink); }
.btn.sm { padding: 13px 22px; font-size: 14.5px; }
.btn > span, .btn > svg { position: relative; }

/* Hero */
.hero { position: relative; min-height: min(100svh, 980px); display: flex; align-items: flex-end; padding: 150px 0 72px; overflow: hidden; }
.net { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.hero::after { content: ""; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 70% 30%, transparent 0, rgba(12,6,25,.4) 55%, var(--deep) 100%); pointer-events: none; }
.hero .container { position: relative; z-index: 2; width: 100%; display: grid; gap: 40px; }
.hero-foot { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 32px; animation: fadeUp 1s var(--ease) both; animation-delay: calc(var(--d0) + .6s); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } }
.hero .actions { display: flex; flex-wrap: wrap; gap: 14px; }
.live { display: grid; gap: 10px; font: 400 12px/1.4 var(--f-mono); color: var(--fog); min-width: 220px; padding: 18px 20px; border-radius: 18px; background: rgba(12,6,25,.5); box-shadow: inset 0 0 0 1px var(--hair); backdrop-filter: blur(10px); }
.live div { display: flex; justify-content: space-between; gap: 24px; }
.live b { color: var(--white); font-weight: 500; font-variant-numeric: tabular-nums; }
.led { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 12px var(--green); animation: blink 2s infinite; margin-right: 8px; }
@keyframes blink { 50% { opacity: .35; } }

/* Faixa corrida */
.marquee { overflow: hidden; border-block: 1px solid var(--hair); padding: 26px 0; background: var(--deep); }
.marquee .track { display: flex; width: max-content; animation: marquee 38s linear infinite; }
.marquee:hover .track { animation-play-state: paused; }
.marquee span { font: 300 clamp(26px, 3.4vw, 44px)/1 var(--f-display); letter-spacing: -0.03em; padding: 0 28px; display: inline-flex; align-items: center; gap: 56px; white-space: nowrap; }
.marquee span::after { content: ""; width: 10px; height: 10px; border-radius: 50%; background: var(--green); box-shadow: 0 0 14px var(--green); }
.marquee span:nth-child(3n+2) { color: var(--lilac); }
@keyframes marquee { to { transform: translateX(-50%); } }

/* Manifesto */
.manifesto p { font: 300 clamp(30px, 4.6vw, 64px)/1.15 var(--f-display); letter-spacing: -0.035em; max-width: 22ch; }
.manifesto .mw { opacity: .16; transition: opacity .4s; }
.manifesto .mw.lit { opacity: 1; }
.manifesto .mw.g.lit { color: var(--green); }

/* Bento */
.bento { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
.tile { position: relative; border-radius: 28px; padding: 34px; background: var(--ink-2); box-shadow: inset 0 0 0 1px var(--hair); overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; gap: 30px; min-height: 280px; isolation: isolate; }
.tile:nth-child(1) { grid-column: span 4; grid-row: span 2; }
.tile:nth-child(2), .tile:nth-child(3) { grid-column: span 2; }
.tile:nth-child(4) { grid-column: span 3; } .tile:nth-child(5) { grid-column: span 3; }
@media (max-width: 900px) { .bento { grid-template-columns: 1fr; } .tile:nth-child(n) { grid-column: auto; grid-row: auto; } }
.tile p { color: var(--fog); max-width: 42ch; }
.tile .num { font: 300 clamp(64px, 8vw, 120px)/.9 var(--f-display); letter-spacing: -0.05em; }
.tile .num small { font-size: .3em; color: var(--lilac); letter-spacing: 0; margin-left: 6px; }
.tile .ico-c { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; background: rgba(201,182,255,.08); color: var(--green); }
.fibers { position: absolute; inset: 0; z-index: -1; opacity: .9; }
.fibers i { position: absolute; left: -10%; right: -10%; height: 1px; background: linear-gradient(90deg, transparent, rgba(138,85,240,.5), transparent); }
.fibers i::after { content: ""; position: absolute; top: -2px; left: 0; width: 80px; height: 5px; border-radius: 5px; background: linear-gradient(90deg, transparent, var(--green)); filter: blur(.5px); animation: photon 3.6s linear infinite; }
.fibers i:nth-child(1) { top: 30%; } .fibers i:nth-child(2) { top: 42%; } .fibers i:nth-child(2)::after { animation-delay: -1.2s; animation-duration: 2.8s; }
.fibers i:nth-child(3) { top: 54%; } .fibers i:nth-child(3)::after { animation-delay: -2.1s; animation-duration: 4.2s; }
.fibers i:nth-child(4) { top: 66%; } .fibers i:nth-child(4)::after { animation-delay: -.6s; animation-duration: 3.2s; }
@keyframes photon { from { transform: translateX(-100px); } to { transform: translateX(1400px); } }

/* Luz que segue o mouse */
.spot::before { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; opacity: 0; transition: opacity .5s; background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(138,85,240,.28), transparent 60%); }
.spot:hover::before { opacity: 1; }

/* Simulador */
.sim { display: grid; grid-template-columns: 1.1fr .9fr; gap: 24px; }
@media (max-width: 960px) { .sim { grid-template-columns: 1fr; } }
.sim-panel { border-radius: 28px; padding: clamp(26px, 4vw, 44px); background: var(--ink-2); box-shadow: inset 0 0 0 1px var(--hair); display: grid; gap: 32px; align-content: start; }
.sim h3 { font-size: 15px; font-family: var(--f-mono); font-weight: 400; color: var(--fog); letter-spacing: .08em; text-transform: uppercase; }
.stepper { display: flex; align-items: center; gap: 20px; }
.stepper button { width: 54px; height: 54px; border-radius: 50%; border: 0; background: rgba(201,182,255,.08); color: var(--white); font: 300 26px/1 var(--f-display); transition: background-color .3s, transform .3s var(--ease); }
.stepper button:hover { background: var(--violet); transform: scale(1.06); }
.stepper output { font: 300 64px/1 var(--f-display); letter-spacing: -0.04em; min-width: 2ch; text-align: center; font-variant-numeric: tabular-nums; }
.stepper span { color: var(--fog); }
.acts { display: flex; flex-wrap: wrap; gap: 10px; }
.acts button { padding: 13px 20px; border-radius: 999px; border: 0; background: rgba(201,182,255,.06); box-shadow: inset 0 0 0 1px var(--hair); color: var(--fog); font: 400 15px/1 var(--f-display); transition: background-color .3s, color .3s, box-shadow .3s, transform .3s var(--ease); }
.acts button:hover { color: var(--white); transform: translateY(-2px); }
.acts button[aria-pressed="true"] { background: var(--lilac); color: var(--ink); box-shadow: none; }
.result { border-radius: 28px; padding: clamp(26px, 4vw, 44px); background: linear-gradient(160deg, var(--violet), #3B1785 70%); display: grid; gap: 18px; align-content: space-between; justify-items: start; position: relative; overflow: hidden; }
.gauge { width: 100%; max-width: 300px; justify-self: center; }
.gauge .track { stroke: rgba(255,255,255,.15); }
.gauge .val { stroke: var(--green); transition: stroke-dashoffset 1s var(--ease); filter: drop-shadow(0 0 8px rgba(24,226,138,.7)); }
.gauge text { fill: var(--white); font-family: var(--f-display); }
.result .rec { font: 300 clamp(34px, 4vw, 52px)/1 var(--f-display); letter-spacing: -0.04em; }
.result .rec b { font-weight: 600; }
.result p { color: var(--lilac); }

/* Planos */
.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; perspective: 1200px; }
@media (max-width: 980px) { .plans { grid-template-columns: 1fr; max-width: 460px; } }
.plan { position: relative; border-radius: 30px; padding: 36px; background: var(--ink-2); box-shadow: inset 0 0 0 1px var(--hair); display: flex; flex-direction: column; gap: 22px; isolation: isolate; transform-style: preserve-3d; transition: transform .6s var(--ease), box-shadow .5s; }
.plan:hover { box-shadow: inset 0 0 0 1px rgba(201,182,255,.35); }
.plan.featured { background: linear-gradient(var(--ink-2), var(--ink-2)) padding-box, conic-gradient(from var(--ang, 0deg), var(--violet), var(--green), var(--lilac), var(--violet)) border-box; border: 1.5px solid transparent; box-shadow: 0 40px 80px -40px rgba(108,43,217,.7); animation: spin 6s linear infinite; }
@property --ang { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@keyframes spin { to { --ang: 360deg; } }
.plan .top { display: flex; justify-content: space-between; align-items: center; }
.plan .name { font: 400 12px/1 var(--f-mono); letter-spacing: .18em; text-transform: uppercase; color: var(--fog); }
.plan .tag { font: 500 11px/1 var(--f-mono); letter-spacing: .1em; text-transform: uppercase; padding: 7px 11px; border-radius: 999px; background: var(--green); color: var(--ink); }
.plan .speed { font: 300 92px/.85 var(--f-display); letter-spacing: -0.06em; }
.plan .speed small { font-size: 22px; letter-spacing: 0; color: var(--lilac); margin-left: 8px; font-weight: 400; }
.plan p { color: var(--fog); font-size: 15px; }
.plan ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; font-size: 15px; }
.plan li { display: flex; gap: 12px; align-items: center; }
.plan li .ico { width: 18px; height: 18px; color: var(--green); }
.plan .foot { margin-top: auto; display: grid; gap: 18px; padding-top: 22px; border-top: 1px solid var(--hair); }
.plan .price { font: 400 30px/1 var(--f-display); letter-spacing: -0.02em; }
.plan .price small { font: 400 14px var(--f-body); color: var(--fog); }
.plan .btn { justify-content: center; }
.note { font: 400 12.5px/1.5 var(--f-mono); color: var(--fog); margin-top: 22px; }

/* Depoimentos */
.quotes { position: relative; min-height: 340px; }
.q { position: absolute; inset: 0; opacity: 0; transform: translateY(20px); transition: opacity .8s var(--ease), transform .8s var(--ease); display: grid; gap: 36px; align-content: start; pointer-events: none; }
.q.on { opacity: 1; transform: none; pointer-events: auto; }
.q p { font: 300 clamp(26px, 3.6vw, 48px)/1.2 var(--f-display); letter-spacing: -0.03em; max-width: 28ch; }
.q footer { font: 400 13px/1.5 var(--f-mono); color: var(--fog); letter-spacing: .06em; }
.q footer b { color: var(--white); font-weight: 500; }
.qdots { display: flex; gap: 10px; margin-top: 24px; }
.qdots button { width: 44px; height: 4px; border-radius: 4px; border: 0; padding: 0; background: var(--hair); position: relative; overflow: hidden; }
.qdots button[aria-current="true"]::after { content: ""; position: absolute; inset: 0; background: var(--green); transform-origin: left; animation: qbar 6s linear forwards; }
.quotes-wrap:hover .qdots button::after { animation-play-state: paused; }
@keyframes qbar { from { transform: scaleX(0); } }
@media (max-width: 700px) { .quotes { min-height: 420px; } }

/* CTA final */
.final { text-align: center; display: grid; justify-items: center; gap: 44px; overflow: hidden; }
.final h2 { font-size: clamp(56px, 12vw, 180px); line-height: .9; }
.orb { width: clamp(150px, 18vw, 200px); aspect-ratio: 1; border-radius: 50%; display: grid; place-items: center; background: var(--green); color: var(--ink); text-decoration: none; font: 500 18px/1.1 var(--f-display); text-align: center; position: relative; transition: transform .5s var(--ease), box-shadow .5s; box-shadow: 0 0 0 0 rgba(24,226,138,.4); }
.orb::before { content: ""; position: absolute; inset: -14px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(24,226,138,.35); animation: ring 2.6s var(--ease) infinite; }
@keyframes ring { from { transform: scale(.9); opacity: 1; } to { transform: scale(1.35); opacity: 0; } }
.orb:hover { box-shadow: 0 0 80px rgba(24,226,138,.5); }

/* Cabeçalho interno */
.phead { position: relative; padding: 200px 0 110px; overflow: hidden; }
.phead .net { opacity: .55; }
.phead::after { content: ""; position: absolute; inset: 0; background: linear-gradient(transparent 40%, var(--deep)); pointer-events: none; }
.phead .container { position: relative; z-index: 2; display: grid; gap: 30px; }
.phead .lead { animation: fadeUp 1s var(--ease) both; animation-delay: calc(var(--d0) + .45s); }
.crumbs { font: 400 12px/1 var(--f-mono); color: var(--fog); letter-spacing: .12em; text-transform: uppercase; display: flex; gap: 10px; animation: fadeIn 1s both; animation-delay: var(--d0); }
.crumbs a { text-decoration: none; color: var(--fog); transition: color .3s; }
.crumbs a:hover { color: var(--green); }

/* Revelar ao rolar */
.rv.pre { opacity: 0; transform: translateY(40px); }
.rv { transition: opacity 1.1s var(--ease), transform 1.1s var(--ease); }

/* Sobre */
.story { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; }
@media (max-width: 900px) { .story { grid-template-columns: 1fr; gap: 32px; } }
.story .big { font: 300 clamp(28px, 3.2vw, 42px)/1.2 var(--f-display); letter-spacing: -0.03em; }
.story .txt { display: grid; gap: 20px; color: var(--fog); font-size: 18px; align-content: end; }
.values { display: flex; gap: 12px; height: 440px; }
.val { position: relative; flex: 1; border-radius: 28px; background: var(--ink-2); box-shadow: inset 0 0 0 1px var(--hair); padding: 28px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; transition: flex-grow .8s var(--ease), background-color .5s; min-width: 0; }
.val.on { flex-grow: 3.4; background: var(--violet); }
@media (min-width: 901px) { .val:not(.on) h3 { writing-mode: vertical-rl; transform: rotate(180deg); } .val:not(.on):hover { background: #2A1A4F; } }
.val .n { font: 400 12px/1 var(--f-mono); color: var(--lilac); letter-spacing: .14em; }
.val h3 { font-size: clamp(22px, 2.4vw, 32px); font-weight: 400; letter-spacing: -0.03em; white-space: nowrap; }
.val p { color: var(--lilac); max-width: 30ch; opacity: 0; transform: translateY(12px); transition: opacity .5s, transform .6s var(--ease); }
.val.on p { opacity: 1; transform: none; transition-delay: .2s; }
@media (max-width: 900px) { .values { flex-direction: column; height: auto; } .val { min-height: 150px; } .val p { opacity: 1; transform: none; } .val h3 { white-space: normal; } }
.cities { border-top: 1px solid var(--hair); }
.city { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 26px 0; border-bottom: 1px solid var(--hair); transition: padding .5s var(--ease), color .3s; }
.city:hover { padding-left: 18px; }
.city b { font: 300 clamp(28px, 4vw, 52px)/1 var(--f-display); letter-spacing: -0.04em; }
.city span { font: 400 12px/1 var(--f-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--fog); display: inline-flex; align-items: center; }
.city.on b { color: var(--green); }
.purpose-big { font: 300 clamp(34px, 5.4vw, 80px)/1.05 var(--f-display); letter-spacing: -0.045em; max-width: 18ch; }

/* Serviços */
.svc { display: grid; grid-template-columns: 380px 1fr; gap: 72px; align-items: start; }
@media (max-width: 960px) { .svc { grid-template-columns: 1fr; gap: 24px; } .svc-nav { display: none; } }
.svc-nav { position: sticky; top: 130px; display: grid; gap: 4px; }
.svc-nav a { display: flex; align-items: center; gap: 16px; padding: 14px 0; text-decoration: none; font: 300 24px/1.2 var(--f-display); letter-spacing: -0.02em; color: rgba(201,182,255,.4); transition: color .4s, transform .5s var(--ease); }
.svc-nav a i { font: 400 11px/1 var(--f-mono); font-style: normal; letter-spacing: .12em; }
.svc-nav a.on { color: var(--white); transform: translateX(10px); }
.svc-nav a.on i { color: var(--green); }
.svc-list { display: grid; gap: 18px; }
.svc-item { position: relative; border-radius: 30px; padding: clamp(28px, 4vw, 48px); background: var(--ink-2); box-shadow: inset 0 0 0 1px var(--hair); display: grid; gap: 22px; min-height: 380px; align-content: space-between; isolation: isolate; overflow: hidden; scroll-margin-top: 120px; }
.svc-item .ico-c { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; background: rgba(201,182,255,.08); color: var(--green); }
.svc-item .ico-c .ico { width: 28px; height: 28px; }
.svc-item h2 { font-size: clamp(32px, 3.6vw, 48px); }
.svc-item p { color: var(--fog); font-size: 17px; max-width: 48ch; }
.svc-item ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.svc-item li { padding: 9px 15px; border-radius: 999px; font-size: 14px; box-shadow: inset 0 0 0 1px var(--hair); color: var(--lilac); }
.biz { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--hair); }
@media (max-width: 900px) { .biz { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .biz { grid-template-columns: 1fr; } }
.biz div { padding: 34px 28px 34px 0; display: grid; gap: 12px; align-content: start; border-bottom: 1px solid var(--hair); }
.biz b { font: 400 24px/1.2 var(--f-display); letter-spacing: -0.02em; }
.biz span { color: var(--fog); font-size: 15px; }
.biz i { font: 400 11px/1 var(--f-mono); font-style: normal; color: var(--green); letter-spacing: .14em; }

/* FAQ */
.faq-top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 40px; }
.search { position: relative; width: min(420px, 100%); }
.search input { width: 100%; padding: 18px 22px 18px 52px; border-radius: 999px; border: 0; background: var(--ink-2); box-shadow: inset 0 0 0 1px var(--hair); color: var(--white); font: 400 16px var(--f-body); transition: box-shadow .3s; }
.search input:focus { outline: none; box-shadow: inset 0 0 0 1.5px var(--green); }
.search svg { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--fog); width: 20px; height: 20px; }
.acc { border-top: 1px solid var(--hair); }
.acc-item { border-bottom: 1px solid var(--hair); }
.acc-item[hidden] { display: none; }
.acc-item button { width: 100%; background: none; border: 0; color: var(--white); display: grid; grid-template-columns: 60px 1fr auto; align-items: center; gap: 16px; padding: 30px 0; text-align: left; font: 300 clamp(20px, 2.4vw, 30px)/1.25 var(--f-display); letter-spacing: -0.02em; transition: color .3s, padding .5s var(--ease); }
.acc-item button i { font: 400 12px/1 var(--f-mono); font-style: normal; color: var(--fog); letter-spacing: .12em; }
.acc-item button:hover { padding-left: 12px; color: var(--lilac); }
.acc-item .pm { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; box-shadow: inset 0 0 0 1px var(--hair); transition: transform .6s var(--ease), background-color .4s, color .4s; }
.acc-item.open .pm { transform: rotate(135deg); background: var(--green); color: var(--ink); box-shadow: none; }
.acc-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .6s var(--ease); }
.acc-body > div { overflow: hidden; }
.acc-body p { padding: 0 0 32px 76px; color: var(--fog); font-size: 17px; max-width: 70ch; }
@media (max-width: 600px) { .acc-item button { grid-template-columns: 1fr auto; } .acc-item button i { display: none; } .acc-body p { padding-left: 0; } }
.acc-item.open .acc-body { grid-template-rows: 1fr; }
.empty { color: var(--fog); padding: 30px 0; }

/* Formulários */
.fl { position: relative; display: block; }
.fl input, .fl textarea, .fl select { width: 100%; padding: 28px 0 12px; border: 0; border-bottom: 1px solid rgba(201,182,255,.25); background: transparent; color: var(--white); font: 400 18px var(--f-body); border-radius: 0; transition: border-color .4s; }
.fl select option { background: var(--ink); }
.fl textarea { min-height: 130px; resize: vertical; }
.fl span { position: absolute; left: 0; top: 28px; color: var(--fog); font: 400 18px var(--f-body); pointer-events: none; transform-origin: left; transition: transform .45s var(--ease), color .3s; }
.fl input:focus, .fl textarea:focus, .fl select:focus { outline: none; border-bottom-color: var(--green); }
.fl input:focus + span, .fl input:not(:placeholder-shown) + span, .fl textarea:focus + span, .fl textarea:not(:placeholder-shown) + span, .fl.sel span { transform: translateY(-24px) scale(.72); color: var(--lilac); }
.fl::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: var(--green); transform: scaleX(0); transform-origin: left; transition: transform .6s var(--ease); }
.fl:focus-within::after { transform: scaleX(1); }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 32px; }
@media (max-width: 680px) { .grid2 { grid-template-columns: 1fr; } }
.form { display: grid; gap: 28px; }
.ok { display: none; gap: 14px; align-items: center; font: 400 18px var(--f-display); color: var(--green); }
.form.sent .ok { display: flex; animation: fadeUp .8s var(--ease); }
.contact { display: grid; grid-template-columns: 1.2fr 1fr; gap: 80px; align-items: start; }
@media (max-width: 960px) { .contact { grid-template-columns: 1fr; gap: 56px; } }
.channels { display: grid; border-top: 1px solid var(--hair); }
.channel { display: grid; grid-template-columns: 1fr auto; gap: 6px 20px; align-items: center; padding: 26px 0; border-bottom: 1px solid var(--hair); text-decoration: none; color: var(--white); transition: padding .5s var(--ease); }
a.channel:hover { padding-left: 14px; }
.channel small { font: 400 11.5px/1 var(--f-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--fog); grid-column: 1 / -1; }
.channel b { font: 300 clamp(22px, 2.6vw, 32px)/1.2 var(--f-display); letter-spacing: -0.02em; font-weight: 300; }
.channel .ico { color: var(--green); transition: transform .5s var(--ease); }
a.channel:hover .ico { transform: rotate(-45deg); }
.social { display: flex; gap: 10px; flex-wrap: wrap; }
.social a { width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; box-shadow: inset 0 0 0 1px var(--hair); color: var(--white); transition: background-color .4s, color .4s, box-shadow .4s, transform .5s var(--ease); }
.social a:hover { background: var(--green); color: var(--ink); box-shadow: none; }

/* Assine em etapas */
.wizard { display: grid; grid-template-columns: 1fr 380px; gap: 40px; align-items: start; }
@media (max-width: 1000px) { .wizard { grid-template-columns: 1fr; } }
.wsteps { display: flex; gap: 8px; margin-bottom: 40px; }
.wsteps div { flex: 1; display: grid; gap: 12px; font: 400 11.5px/1 var(--f-mono); letter-spacing: .12em; text-transform: uppercase; color: var(--fog); }
.wsteps div::before { content: ""; height: 3px; border-radius: 3px; background: var(--hair); background-image: linear-gradient(90deg, var(--violet), var(--green)); background-size: 0 100%; background-repeat: no-repeat; transition: background-size .8s var(--ease); }
.wsteps div.done::before, .wsteps div.cur::before { background-size: 100% 100%; }
.wsteps div.cur { color: var(--white); }
.wpanel { display: none; gap: 28px; animation: fadeUp .7s var(--ease); }
.wpanel.cur { display: grid; }
.wpanel h2 { font-size: clamp(30px, 3.6vw, 46px); }
.pick { display: grid; gap: 12px; }
.pick label { position: relative; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 22px; padding: 24px 28px; border-radius: 22px; background: var(--ink-2); box-shadow: inset 0 0 0 1px var(--hair); transition: box-shadow .4s, background-color .4s, transform .5s var(--ease); }
.pick label:hover { transform: translateX(6px); }
.pick input { position: absolute; opacity: 0; }
.pick .radio { width: 24px; height: 24px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px rgba(201,182,255,.4); display: grid; place-items: center; }
.pick .radio::after { content: ""; width: 10px; height: 10px; border-radius: 50%; background: var(--ink); transform: scale(0); transition: transform .4s var(--ease); }
.pick b { font: 300 34px/1 var(--f-display); letter-spacing: -0.04em; }
.pick b small { font-size: 15px; color: var(--fog); letter-spacing: 0; margin-left: 10px; }
.pick em { font-style: normal; font: 400 18px var(--f-display); }
.pick label:has(input:checked) { background: var(--violet); box-shadow: none; }
.pick label:has(input:checked) .radio { background: var(--green); box-shadow: none; }
.pick label:has(input:checked) .radio::after { transform: scale(1); }
.pick label:has(input:checked) b small { color: var(--lilac); }
.pick label:has(input:focus-visible) { outline: 2px solid var(--green); outline-offset: 3px; }
.wnav { display: flex; gap: 12px; flex-wrap: wrap; }
.wsum { position: sticky; top: 120px; border-radius: 30px; padding: 32px; background: var(--ink-2); box-shadow: inset 0 0 0 1px var(--hair); display: grid; gap: 18px; overflow: hidden; isolation: isolate; }
.wsum .sp { font: 300 76px/.9 var(--f-display); letter-spacing: -0.06em; }
.wsum .sp small { font-size: 20px; color: var(--lilac); letter-spacing: 0; margin-left: 8px; }
.wsum .line { display: flex; justify-content: space-between; gap: 16px; border-top: 1px solid var(--hair); padding-top: 14px; color: var(--fog); font-size: 15px; }
.wsum .line b { color: var(--white); font-weight: 500; font-family: var(--f-display); }
.done-box { display: none; justify-items: start; gap: 22px; animation: fadeUp .8s var(--ease); }
.done-box.on { display: grid; }
.check-anim path { stroke-dasharray: 60; stroke-dashoffset: 60; animation: draw .9s var(--ease) .2s forwards; }
.check-anim circle { stroke-dasharray: 190; stroke-dashoffset: 190; animation: draw 1s var(--ease) forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }

/* Rodapé */
.foot { position: relative; padding: 120px 0 0; border-top: 1px solid var(--hair); overflow: hidden; }
.foot .cols { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 40px; }
@media (max-width: 900px) { .foot .cols { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .foot .cols { grid-template-columns: 1fr; } }
.foot h3 { font: 400 11.5px/1 var(--f-mono); letter-spacing: .16em; text-transform: uppercase; color: var(--fog); margin-bottom: 20px; }
.foot ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.foot a { text-decoration: none; color: var(--white); transition: color .3s; }
.foot a:hover { color: var(--green); }
.foot .say { font: 300 clamp(26px, 3vw, 38px)/1.15 var(--f-display); letter-spacing: -0.03em; max-width: 16ch; margin-bottom: 30px; }
.foot .giant { display: block; width: 100%; height: auto; margin-top: 90px; color: rgba(201,182,255,.07); }
.foot .bottom { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; padding: 26px 0 34px; font: 400 12px/1.5 var(--f-mono); color: var(--fog); letter-spacing: .04em; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-delay: 0s !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .rv.pre { opacity: 1; transform: none; }
  html.loading .loader { display: none; }
  .marquee .track { animation: none; }
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
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Cursor próprio ---------- */
  if (fine && !reduce) {
    var dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring'; ring.innerHTML = '<span></span>';
    document.body.append(dot, ring);
    var mx = -100, my = -100, rx = -100, ry = -100, shown = false;
    addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; rx = mx; ry = my; document.body.classList.add('has-cursor'); }
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    }, { passive: true });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('has-cursor'); shown = false; });
    addEventListener('mousedown', function () { ring.classList.add('down'); });
    addEventListener('mouseup', function () { ring.classList.remove('down'); });
    (function loop() { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor], a, button, label, .spot');
      ring.classList.remove('hover', 'text');
      if (!t) return;
      var txt = t.getAttribute('data-cursor');
      if (txt) { ring.classList.add('text'); ring.firstChild.textContent = txt; } else ring.classList.add('hover');
    });
  }

  /* ---------- Transição entre páginas ---------- */
  var curtain = $('.curtain');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || !curtain || reduce || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    var href = a.getAttribute('href');
    if (!/^[\\w-]+\\.html(#[\\w-]*)?$/.test(href)) return;
    if (href.split('#')[0] === location.pathname.split('/').pop() && href.indexOf('#') > -1) return;
    e.preventDefault();
    try { sessionStorage.setItem('vyra-nav', '1'); } catch (err) {}
    curtain.classList.add('cover');
    setTimeout(function () { location.href = href; }, 520);
  });
  addEventListener('pageshow', function (e) { if (e.persisted && curtain) curtain.classList.remove('cover'); });

  /* ---------- Topo, progresso e menu ---------- */
  var hdr = $('.hdr'), prog = $('.progress'), lastY = 0;
  function onScroll() {
    var y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    hdr.classList.toggle('solid', y > 40);
    hdr.classList.toggle('hide', y > lastY && y > 300 && !document.body.classList.contains('menu-open'));
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var mm = $('.mmenu');
  $$('[data-menu]').forEach(function (b) { b.addEventListener('click', function () {
    var open = !mm.classList.contains('open');
    mm.classList.toggle('open', open); document.body.classList.toggle('menu-open', open);
    $$('[data-menu]').forEach(function (x) { x.setAttribute('aria-expanded', open); });
    if (open) setTimeout(function () { var f = mm.querySelector('a'); f && f.focus(); }, 300);
  }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && mm.classList.contains('open')) $('[data-menu]').click(); });

  /* ---------- Botões magnéticos e luz que segue o mouse ---------- */
  if (fine && !reduce) {
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * .3 + 'px,' + y * .35 + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
    $$('.spot').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
        if (el.hasAttribute('data-tilt')) el.style.transform = 'rotateX(' + ((y / r.height) - .5) * -6 + 'deg) rotateY(' + ((x / r.width) - .5) * 8 + 'deg)';
      });
      el.addEventListener('mouseleave', function () { if (el.hasAttribute('data-tilt')) el.style.transform = ''; });
    });
  }

  /* ---------- Rede de fibra em canvas ---------- */
  $$('canvas.net').forEach(function (cv) {
    var ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2), W, H, nodes = [], pulses = [], mouse = { x: -999, y: -999 }, running = true;
    var density = parseFloat(cv.dataset.density || '1');
    function resize() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(110, Math.round(W * H / 13000 * density));
      nodes = []; for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 });
      if (reduce) draw();
    }
    var LINK = 150;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        if (!reduce) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
          var dmx = mouse.x - a.x, dmy = mouse.y - a.y, dm = Math.hypot(dmx, dmy); if (dm < 180) { a.x += dmx * .004; a.y += dmy * .004; } }
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            var near = Math.hypot(mouse.x - (a.x + b.x) / 2, mouse.y - (a.y + b.y) / 2) < 160;
            ctx.strokeStyle = near ? 'rgba(201,182,255,' + (1 - d / LINK) * .7 + ')' : 'rgba(138,85,240,' + (1 - d / LINK) * .38 + ')';
            ctx.lineWidth = near ? 1 : .7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (!reduce && Math.random() < .0009 && pulses.length < 26) pulses.push({ a: a, b: b, t: 0, s: .008 + Math.random() * .012 });
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k], hot = Math.hypot(mouse.x - n.x, mouse.y - n.y) < 140;
        ctx.fillStyle = hot ? '#18E28A' : 'rgba(201,182,255,.55)';
        ctx.beginPath(); ctx.arc(n.x, n.y, hot ? 2.4 : 1.5, 0, 6.283); ctx.fill();
      }
      pulses = pulses.filter(function (p) {
        p.t += p.s; if (p.t >= 1) return false;
        var x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
        var g = ctx.createRadialGradient(x, y, 0, x, y, 9); g.addColorStop(0, 'rgba(24,226,138,.95)'); g.addColorStop(1, 'rgba(24,226,138,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill();
        return true;
      });
    }
    function loop() { if (running) draw(); requestAnimationFrame(loop); }
    resize(); addEventListener('resize', resize);
    var host = cv.parentElement;
    host.addEventListener('mousemove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    host.addEventListener('mouseleave', function () { mouse.x = mouse.y = -999; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { running = es[0].isIntersecting; }).observe(cv);
    if (!reduce) loop();
  });

  /* ---------- Revelar ao rolar ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    $$('.rv').forEach(function (el) { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); el.style.transitionDelay = (el.dataset.d || 0) * 110 + 'ms'; io.observe(el); } });
  }

  /* ---------- Manifesto: palavras acendem com a rolagem ---------- */
  var man = $('.manifesto');
  if (man) {
    var words = $$('.mw', man);
    var lit = function () {
      var r = man.getBoundingClientRect(), p = (innerHeight * .85 - r.top) / (r.height + innerHeight * .3);
      var n = reduce ? words.length : Math.round(Math.max(0, Math.min(1, p)) * words.length);
      words.forEach(function (w, i) { w.classList.toggle('lit', i < n); });
    };
    addEventListener('scroll', lit, { passive: true }); lit();
  }

  /* ---------- Status ao vivo (demonstração) ---------- */
  var lat = $('[data-live=lat]'), up = $('[data-live=up]');
  if (lat && !reduce) setInterval(function () { lat.textContent = (3 + Math.floor(Math.random() * 3)) + ' ms'; up.textContent = (99.9 + Math.random() * .09).toFixed(2).replace('.', ',') + '%'; }, 1800);

  /* ---------- Simulador de plano ---------- */
  var sim = $('.sim');
  if (sim) {
    var people = 3, out = $('output', sim), arc = $('.gauge .val'), num = $('.gauge text'), rec = $('.rec'), go = $('[data-sim-go]'), why = $('[data-sim-why]');
    var shownMbps = 0;
    function calc() {
      var acts = $$('.acts button[aria-pressed=true]', sim).reduce(function (s, b) { return s + +b.dataset.mbps; }, 0);
      var need = Math.round(people * 22 + acts * (1 + (people - 1) * .22));
      var plan = need <= 250 ? ['essencial', 'Essencial', '300 Mega'] : need <= 520 ? ['conecta', 'Conecta', '600 Mega'] : ['ultra', 'Ultra', '1 Giga'];
      out.value = people;
      arc.style.strokeDashoffset = 100 - Math.min(100, need / 10);
      rec.innerHTML = 'Plano <b>' + plan[1] + '</b>';
      why.textContent = 'Sua casa usa cerca de ' + need + ' Mbps nos horários de pico. O ' + plan[1] + ' (' + plan[2] + ') dá conta com folga.';
      go.setAttribute('href', 'assine.html#' + plan[0]); go.querySelector('span').textContent = 'Assinar ' + plan[1];
      var from = shownMbps, t0 = null; shownMbps = need;
      if (reduce) { num.textContent = need; return; }
      requestAnimationFrame(function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 700, 1); num.textContent = Math.round(from + (need - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); });
    }
    $$('[data-step]', sim).forEach(function (b) { b.addEventListener('click', function () { people = Math.max(1, Math.min(10, people + +b.dataset.step)); calc(); }); });
    $$('.acts button', sim).forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); calc(); }); });
    calc();
  }

  /* ---------- Depoimentos ---------- */
  var qs = $$('.q'), qd = $$('.qdots button'), qi = 0, qt;
  function showQ(i) { qi = i; qs.forEach(function (q, k) { q.classList.toggle('on', k === i); }); qd.forEach(function (d, k) { d.setAttribute('aria-current', k === i); }); clearTimeout(qt); if (!reduce) qt = setTimeout(function () { showQ((qi + 1) % qs.length); }, 6000); }
  qd.forEach(function (d, k) { d.addEventListener('click', function () { showQ(k); }); });
  if (qs.length) showQ(0);

  /* ---------- Valores (Sobre) no toque ---------- */
  $('.val').forEach(function (v) { var on = function () { $('.val').forEach(function (o) { o.classList.toggle('on', o === v); }); }; v.addEventListener('mouseenter', on); v.addEventListener('focus', on); v.addEventListener('click', on); });

  /* ---------- Serviços: índice fixo ---------- */
  var navs = $$('.svc-nav a');
  if (navs.length && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) navs.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
    $$('.svc-item').forEach(function (s) { so.observe(s); });
  }

  /* ---------- FAQ: acordeão e busca ---------- */
  $$('.acc-item button').forEach(function (b) { b.addEventListener('click', function () {
    var it = b.closest('.acc-item'), open = !it.classList.contains('open'); it.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
  }); });
  var sq = $('#faq-search');
  if (sq) sq.addEventListener('input', function () {
    var q = sq.value.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''), any = false;
    $$('.acc-item').forEach(function (it) { var hit = it.textContent.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').indexOf(q) > -1; it.hidden = !hit; any = any || hit; });
    $('.empty').hidden = any;
  });

  /* ---------- Formulários ---------- */
  $$('.fl select').forEach(function (s) { s.closest('.fl').classList.add('sel'); });
  $$('input[data-mask=cep]').forEach(function (i) { i.addEventListener('input', function () { var v = i.value.replace(/\\D/g, '').slice(0, 8); i.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; }); });
  $$('input[data-mask=tel]').forEach(function (i) { i.addEventListener('input', function () { var v = i.value.replace(/\\D/g, '').slice(0, 11);
    i.value = v.length > 6 ? '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4) : v.length > 2 ? '(' + v.slice(0, 2) + ') ' + v.slice(2) : v; }); });
  // Integre aqui com seu backend, e-mail ou WhatsApp.
  $$('form.form').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); if (!f.checkValidity()) { f.reportValidity(); return; } f.classList.add('sent'); }); });

  /* ---------- Assine já em etapas ---------- */
  var wz = $('.wizard form');
  if (wz) {
    var panels = $$('.wpanel', wz), marks = $$('.wsteps div'), cur = 0;
    function go(i) {
      cur = i; panels.forEach(function (p, k) { p.classList.toggle('cur', k === i); });
      marks.forEach(function (m, k) { m.classList.toggle('done', k < i); m.classList.toggle('cur', k === i); });
      scrollTo({ top: $('.wizard').getBoundingClientRect().top + scrollY - 120, behavior: reduce ? 'auto' : 'smooth' });
    }
    function valid(p) { var ok = true; $$('input, select', p).forEach(function (i) { if (ok && !i.checkValidity()) { i.reportValidity(); ok = false; } }); return ok; }
    $$('[data-next]', wz).forEach(function (b) { b.addEventListener('click', function () { if (valid(panels[cur])) go(cur + 1); }); });
    $$('[data-prev]', wz).forEach(function (b) { b.addEventListener('click', function () { go(cur - 1); }); });
    wz.addEventListener('submit', function (e) { e.preventDefault(); if (!valid(panels[cur])) return;
      panels.forEach(function (p) { p.classList.remove('cur'); }); marks.forEach(function (m) { m.classList.add('done'); m.classList.remove('cur'); });
      $('.done-box').classList.add('on'); });
    var sum = $('.wsum');
    function sync() { var r = $('input[name=plano]:checked', wz); if (!r) return;
      $('[data-s=name]', sum).textContent = r.dataset.name; $('[data-s=speed]', sum).innerHTML = r.dataset.speed + '<small>' + r.dataset.unit + '</small>'; $('[data-s=price]', sum).textContent = 'R$ ' + r.dataset.price; }
    var h = location.hash.slice(1), pre = h && $('input[name=plano][value="' + h + '"]', wz); if (pre) pre.checked = true;
    $$('input[name=plano]', wz).forEach(function (r) { r.addEventListener('change', sync); }); sync();
  }

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
    <nav aria-label="Principal">${navLinks(c, page)}</nav>
    <div class="right">
      <a class="btn sm" href="${c.cta.href}" data-magnetic${page === 'assine' ? ' aria-current="page"' : ''}><span>${c.cta.label}</span>${icon('arrow')}</a>
      <button class="burger" data-menu aria-label="Abrir menu" aria-expanded="false" aria-controls="mmenu">${icon('menu')}</button>
    </div>
  </div>
</header>
<div class="mmenu" id="mmenu" aria-label="Menu">
  <button class="burger close" data-menu aria-label="Fechar menu" aria-expanded="false" style="display:grid">${icon('close')}</button>
  <nav>${navLinks(c, page, 'big')}<a class="big" href="${c.cta.href}" style="color:var(--green)">${c.cta.label}</a></nav>
  ${socialLinks(c)}
</div>`;
}

function footer(c) {
  return `<footer class="foot">
  <div class="container">
    <div class="cols">
      <div><p class="say">${esc(c.brand.support)}</p>${socialLinks(c)}</div>
      <div><h3>Páginas</h3><ul>${c.nav.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}<li><a href="${c.cta.href}" style="color:var(--green)">${c.cta.label}</a></li></ul></div>
      <div><h3>Serviços</h3><ul>${c.services.map(s => `<li><a href="servicos.html#${s.id}">${s.title}</a></li>`).join('')}</ul></div>
      <div><h3>Contato</h3><ul><li>${c.contact.whatsapp}</li><li>${c.contact.email}</li><li>${c.contact.address}</li><li>${c.contact.city}</li></ul></div>
    </div>
    ${logo('giant', 'rgba(24,226,138,.35)')}
    <div class="bottom"><span>© <span id="year">2026</span> Vyra Fibra · CNPJ 00.000.000/0001-00</span><span>${esc(c.brand.slogan)}</span></div>
  </div>
</footer>`;
}

function phead(title, lead, crumb) {
  return `<section class="phead">
  <canvas class="net" data-density=".7" aria-hidden="true"></canvas>
  <div class="container">
    <nav class="crumbs" aria-label="Você está em"><a href="index.html">Início</a><span>/</span><span>${crumb}</span></nav>
    <h1>${split(title)}</h1>
    <p class="lead">${lead}</p>
  </div>
</section>`;
}

function plans(c) {
  return `<div class="plans">${c.plans.map((p, i) => `
    <article class="plan spot rv${p.featured ? ' featured' : ''}" data-tilt data-d="${i}">
      <div class="top"><span class="name">${p.name}</span>${p.featured ? '<span class="tag">Mais escolhido</span>' : ''}</div>
      <div class="speed">${p.speed}<small>${p.unit}</small></div>
      <p>${p.tagline}</p>
      <ul>${p.features.map(f => `<li>${icon('check')}${f}</li>`).join('')}</ul>
      <div class="foot">
        <div class="price">R$ ${p.price}<small> /mês</small></div>
        <a class="btn${p.featured ? '' : ' ghost'}" href="assine.html#${p.id}" data-cursor="Assinar"><span>Assinar ${p.name}</span>${icon('arrow')}</a>
      </div>
    </article>`).join('')}
  </div>
  <p class="note">Valores de exemplo · consulte a disponibilidade no seu endereço.</p>`;
}

function finalCta() {
  return `<section class="section final">
  <span class="label rv">Pronto para conectar?</span>
  <h2 class="rv">Conecte<b class="em">-se.</b></h2>
  <a class="orb rv" href="assine.html" data-magnetic data-cursor="Vamos">Assine<br>já</a>
</section>`;
}

function marquee(c) {
  const items = ['300 Mega', '600 Mega', '1 Giga', ...c.cities.now, 'Suporte 24h', ...c.cities.soon.slice(0, 3), 'Wi-Fi 6', '100% fibra óptica'];
  const row = items.map(t => `<span>${t}</span>`).join('');
  return `<div class="marquee" aria-hidden="true"><div class="track">${row}${row}</div></div>`;
}

function manifesto(text) {
  // palavras entre * ficam verdes quando acendem
  return text.split(' ').map(w => /\*/.test(w) ? `<span class="mw g">${w.replace(/\*/g, '')}</span>` : `<span class="mw">${w}</span>`).join(' ');
}

// ---------- páginas ----------
const pages = {
  index: c => `${chrome(c, 'index')}
<main>
  <section class="hero">
    <canvas class="net" aria-hidden="true"></canvas>
    <div class="container">
      <span class="label" style="animation:fadeIn 1s both;animation-delay:var(--d0)"><i class="led"></i>Rede online · ${c.cities.now[0]}</span>
      <h1>${split('Velocidade de capital, *onde* *você* *está.*')}</h1>
      <div class="hero-foot">
        <div style="display:grid;gap:30px">
          <p class="lead">Internet 100% fibra óptica para casas e empresas do interior. Tecnologia de capital, atendimento de quem está perto.</p>
          <div class="actions"><a class="btn" href="assine.html" data-magnetic data-cursor="Assinar"><span>Assine já</span>${icon('arrow')}</a><a class="btn ghost" href="servicos.html" data-magnetic><span>Ver planos</span></a></div>
        </div>
        <div class="live" aria-label="Status da rede (demonstração)">
          <div><span><i class="led"></i>status</span><b>online</b></div>
          <div><span>latência</span><b data-live="lat">4 ms</b></div>
          <div><span>disponibilidade</span><b data-live="up">99,95%</b></div>
        </div>
      </div>
    </div>
  </section>
  ${marquee(c)}

  <section class="section manifesto"><div class="container">
    <span class="label" style="margin-bottom:40px">Manifesto</span>
    <p>${manifesto('Por muito tempo o interior ficou com o que sobrava. A Vyra existe para mudar isso: *fibra* *de* *verdade,* *gente* *de* *perto.*')}</p>
  </div></section>

  <section class="section" style="padding-top:0"><div class="container">
    <div class="bento">
      <div class="tile spot rv"><div class="fibers" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <span class="label">Tecnologia</span>
        <div><div class="num">100<small>%</small></div><h3 style="margin:14px 0 10px">${c.benefits[0].title}</h3><p>${c.benefits[0].text}</p></div></div>
      ${c.benefits.slice(1).map((b, i) => `<div class="tile spot rv" data-d="${i + 1}"><div class="ico-c">${icon(b.icon)}</div><div><h3 style="margin-bottom:10px">${b.title}</h3><p>${b.text}</p></div></div>`).join('')}
      <div class="tile spot rv" data-d="2"><span class="label">Velocidade máxima</span><div class="num">1<small>Giga</small></div></div>
    </div>
  </div></section>

  <section class="section" style="padding-top:0"><div class="container">
    <div style="display:grid;gap:22px;margin-bottom:56px" class="rv"><span class="label">Simulador</span><h2>Quanta internet <b>a sua casa</b> precisa?</h2></div>
    <div class="sim">
      <div class="sim-panel rv">
        <div style="display:grid;gap:16px"><h3>Pessoas em casa</h3>
          <div class="stepper"><button type="button" data-step="-1" aria-label="Menos uma pessoa">−</button><output aria-live="polite">3</output><button type="button" data-step="1" aria-label="Mais uma pessoa">+</button><span>pessoas</span></div></div>
        <div style="display:grid;gap:16px"><h3>O que vocês fazem online</h3>
          <div class="acts">
            <button type="button" aria-pressed="true" data-mbps="35">Home office</button>
            <button type="button" aria-pressed="true" data-mbps="45">Streaming 4K</button>
            <button type="button" aria-pressed="false" data-mbps="40">Games online</button>
            <button type="button" aria-pressed="false" data-mbps="20">Aulas online</button>
            <button type="button" aria-pressed="false" data-mbps="25">Câmeras</button>
            <button type="button" aria-pressed="false" data-mbps="10">Casa inteligente</button>
          </div></div>
      </div>
      <div class="result rv" data-d="1">
        <span class="label" style="color:var(--lilac)">Recomendação</span>
        <svg class="gauge" viewBox="0 0 200 130" aria-hidden="true">
          <path class="track" d="M20 115 A80 80 0 0 1 180 115" fill="none" stroke-width="10" stroke-linecap="round" pathLength="100"/>
          <path class="val" d="M20 115 A80 80 0 0 1 180 115" fill="none" stroke-width="10" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
          <text x="100" y="100" text-anchor="middle" font-size="44" font-weight="300">0</text>
          <text x="100" y="124" text-anchor="middle" font-size="11" style="fill:#C9B6FF;font-family:'JetBrains Mono',monospace">Mbps no pico</text>
        </svg>
        <div class="rec" aria-live="polite">Plano <b>Conecta</b></div>
        <p data-sim-why></p>
        <a class="btn" href="assine.html#conecta" data-sim-go data-magnetic data-cursor="Assinar"><span>Assinar Conecta</span>${icon('arrow')}</a>
      </div>
    </div>
  </div></section>

  <section class="section" style="padding-top:0"><div class="container">
    <div style="display:grid;gap:22px;margin-bottom:56px" class="rv"><span class="label">Planos</span><h2>Escolha a sua <b>velocidade</b></h2></div>
    ${plans(c)}
  </div></section>

  <section class="section" style="background:var(--ink)"><div class="container quotes-wrap">
    <span class="label" style="margin-bottom:48px">Quem usa · depoimentos de exemplo</span>
    <div class="quotes">${c.testimonials.map(t => `<blockquote class="q" style="margin:0"><p>“${t.text}”</p><footer><b>${t.who}</b> · ${t.where}</footer></blockquote>`).join('')}</div>
    <div class="qdots">${c.testimonials.map((t, i) => `<button type="button" aria-label="Depoimento ${i + 1}"></button>`).join('')}</div>
  </div></section>
  ${finalCta()}
</main>
${footer(c)}`,

  sobre: c => `${chrome(c, 'sobre')}
<main>
  ${phead('Feita no *interior,* para o *interior.*', c.about.intro, 'Sobre nós')}
  <section class="section"><div class="container story">
    <p class="big rv">${c.about.story[0]}</p>
    <div class="txt rv" data-d="1">${c.about.story.slice(1).map(p => `<p>${p}</p>`).join('')}</div>
  </div></section>
  <section class="section manifesto" style="padding-top:0"><div class="container">
    <span class="label" style="margin-bottom:40px">Propósito</span>
    <p>${manifesto(c.about.purpose.replace('internet de verdade', '*internet* *de* *verdade*'))}</p>
  </div></section>
  <section class="section" style="padding-top:0"><div class="container">
    <div style="display:grid;gap:22px;margin-bottom:56px" class="rv"><span class="label">Valores</span><h2>O que <b>nos guia</b></h2></div>
    <div class="values rv">${c.about.values.map((v, i) => `<div class="val${i === 0 ? ' on' : ''}" tabindex="0" data-cursor="Ver"><span class="n">0${i + 1}</span><div><h3>${v.title}</h3><p>${v.text}</p></div></div>`).join('')}</div>
  </div></section>
  <section class="section" style="padding-top:0"><div class="container">
    <div style="display:grid;gap:22px;margin-bottom:56px" class="rv"><span class="label">Cobertura</span><h2>Onde a fibra <b>já chega</b></h2></div>
    <div class="cities rv">${c.cities.now.map(x => `<div class="city on"><b>${x}</b><span><i class="led"></i>online</span></div>`).join('')}${c.cities.soon.map(x => `<div class="city"><b>${x}</b><span>em breve</span></div>`).join('')}</div>
  </div></section>
  ${finalCta()}
</main>
${footer(c)}`,

  servicos: c => `${chrome(c, 'servicos')}
<main>
  ${phead('Conexão para *cada* *lugar.*', 'Internet fibra óptica para casa, empresa e área rural, com suporte de quem está perto.', 'Serviços')}
  <section class="section" style="padding-top:40px"><div class="container svc">
    <nav class="svc-nav" aria-label="Serviços">${c.services.map((s, i) => `<a href="#${s.id}"${i === 0 ? ' class="on"' : ''}><i>0${i + 1}</i>${s.title}</a>`).join('')}</nav>
    <div class="svc-list">${c.services.map((s, i) => `<article class="svc-item spot rv" id="${s.id}">
      <div class="ico-c">${icon(s.icon)}</div>
      <div style="display:grid;gap:16px"><span class="label">0${i + 1}</span><h2>${s.title}</h2><p>${s.text}</p></div>
      <ul>${s.items.map(x => `<li>${x}</li>`).join('')}</ul>
    </article>`).join('')}
    <p class="note">* Sujeito à disponibilidade da equipe técnica na região.</p></div>
  </div></section>
  <section class="section" style="padding-top:0"><div class="container">
    <div style="display:grid;gap:22px;margin-bottom:56px" class="rv"><span class="label">Residencial</span><h2>Planos para a <b>sua casa</b></h2></div>
    ${plans(c)}
  </div></section>
  <section class="section" style="background:var(--ink)"><div class="container">
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:28px;margin-bottom:56px" class="rv">
      <div style="display:grid;gap:22px"><span class="label">Vyra Empresas</span><h2>Sua operação <b>não para.</b></h2></div>
      <a class="btn violet" href="contato.html" data-magnetic data-cursor="Falar"><span>Pedir proposta</span>${icon('arrow')}</a>
    </div>
    <div class="biz rv">${c.business.map((b, i) => `<div><i>0${i + 1}</i><b>${b.title}</b><span>${b.text}</span></div>`).join('')}</div>
  </div></section>
  ${finalCta()}
</main>
${footer(c)}`,

  faq: c => `${chrome(c, 'faq')}
<main>
  ${phead('Perguntas *frequentes.*', 'Respostas rápidas sobre instalação, planos e suporte.', 'FAQ')}
  <section class="section" style="padding-top:40px"><div class="container">
    <div class="faq-top rv"><span class="label">${c.faq.length} perguntas</span>
      <label class="search" for="faq-search"><span class="sr">Buscar pergunta</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="faq-search" type="search" placeholder="Buscar: instalação, Wi-Fi, empresa..."></label></div>
    <div class="acc rv">${c.faq.map((f, i) => `<div class="acc-item">
      <button aria-expanded="false" aria-controls="faq-${i}"><i>${String(i + 1).padStart(2, '0')}</i>${f.q}<span class="pm">${icon('plus')}</span></button>
      <div class="acc-body" id="faq-${i}"><div><p>${f.a}</p></div></div></div>`).join('')}</div>
    <p class="empty" hidden>Nenhuma pergunta encontrada. Fale com a gente pelo WhatsApp ${c.contact.whatsapp}.</p>
  </div></section>
  ${finalCta()}
</main>
${footer(c)}`,

  contato: c => `${chrome(c, 'contato')}
<main>
  ${phead('Vamos *conversar.*', 'Tire dúvidas, peça uma proposta para sua empresa ou fale com o suporte. Gente de verdade responde.', 'Contato')}
  <section class="section" style="padding-top:40px"><div class="container contact">
    <form class="form rv" novalidate>
      <div class="grid2">
        <label class="fl"><input id="c-nome" placeholder=" " autocomplete="name" required><span>Seu nome</span></label>
        <label class="fl"><input id="c-tel" placeholder=" " inputmode="tel" data-mask="tel" required><span>WhatsApp</span></label>
      </div>
      <label class="fl"><input id="c-email" type="email" placeholder=" " autocomplete="email" required><span>E-mail</span></label>
      <label class="fl"><select id="c-assunto"><option>Quero contratar</option><option>Proposta para empresa</option><option>Suporte técnico</option><option>Financeiro</option><option>Outro</option></select><span>Assunto</span></label>
      <label class="fl"><textarea id="c-msg" placeholder=" " required></textarea><span>Mensagem</span></label>
      <div><button class="btn" type="submit" data-magnetic data-cursor="Enviar"><span>Enviar mensagem</span>${icon('arrow')}</button></div>
      <div class="ok" role="status">${icon('check')}Mensagem enviada. Respondemos em breve.</div>
    </form>
    <div class="rv" data-d="1" style="display:grid;gap:40px">
      <div class="channels">
        <a class="channel" href="${c.contact.whatsappLink}" target="_blank" rel="noopener" data-cursor="Abrir"><small>WhatsApp · mais rápido</small><b>${c.contact.whatsapp}</b>${icon('arrow')}</a>
        <div class="channel"><small>Telefone</small><b>${c.contact.phone}</b></div>
        <div class="channel"><small>E-mail</small><b>${c.contact.email}</b></div>
        <div class="channel"><small>Endereço</small><b>${c.contact.address}<br>${c.contact.city}</b></div>
        ${c.contact.hours.map(h => `<div class="channel"><small>${h[0]}</small><b style="font-size:20px">${h[1]}</b></div>`).join('')}
      </div>
      <div style="display:grid;gap:18px"><span class="label">Redes sociais</span>${socialLinks(c)}</div>
    </div>
  </div></section>
</main>
${footer(c)}`,

  assine: c => `${chrome(c, 'assine')}
<main>
  ${phead('Sua fibra *começa* *aqui.*', 'Três passos rápidos. A gente confirma a cobertura e agenda a instalação com você.', 'Assine já')}
  <section class="section" style="padding-top:40px"><div class="container wizard">
    <form novalidate>
      <div class="wsteps" aria-hidden="true"><div class="cur">01 · Plano</div><div>02 · Endereço</div><div>03 · Seus dados</div></div>
      <fieldset class="wpanel cur" style="border:0;padding:0;margin:0">
        <legend class="sr">Escolha o plano</legend>
        <h2>Escolha o <b>plano</b></h2>
        <div class="pick">${c.plans.map(p => `<label data-cursor="Escolher"><input type="radio" name="plano" value="${p.id}" data-name="${p.name}" data-speed="${p.speed}" data-unit="${p.unit}" data-price="${p.price}"${p.featured ? ' checked' : ''} required><span class="radio"></span><b>${p.speed} ${p.unit}<small>${p.name}</small></b><em>R$ ${p.price}</em></label>`).join('')}</div>
        <div class="wnav"><button class="btn" type="button" data-next><span>Continuar</span>${icon('arrow')}</button></div>
      </fieldset>
      <fieldset class="wpanel" style="border:0;padding:0;margin:0">
        <legend class="sr">Endereço de instalação</legend>
        <h2>Onde vamos <b>instalar?</b></h2>
        <div class="grid2">
          <label class="fl"><input id="a-cep" placeholder=" " inputmode="numeric" data-mask="cep" required><span>CEP</span></label>
          <label class="fl"><input id="a-num" placeholder=" " required><span>Número</span></label>
        </div>
        <label class="fl"><input id="a-rua" placeholder=" " required><span>Rua</span></label>
        <div class="grid2">
          <label class="fl"><input id="a-bairro" placeholder=" " required><span>Bairro</span></label>
          <label class="fl"><select id="a-periodo"><option>Manhã</option><option>Tarde</option><option>Sábado</option></select><span>Melhor período</span></label>
        </div>
        <div class="wnav"><button class="btn ghost" type="button" data-prev><span>Voltar</span></button><button class="btn" type="button" data-next><span>Continuar</span>${icon('arrow')}</button></div>
      </fieldset>
      <fieldset class="wpanel" style="border:0;padding:0;margin:0">
        <legend class="sr">Seus dados</legend>
        <h2>Agora, <b>sobre você</b></h2>
        <div class="grid2">
          <label class="fl"><input id="a-nome" placeholder=" " autocomplete="name" required><span>Nome completo</span></label>
          <label class="fl"><input id="a-cpf" placeholder=" " inputmode="numeric" required><span>CPF</span></label>
          <label class="fl"><input id="a-tel" placeholder=" " inputmode="tel" data-mask="tel" required><span>WhatsApp</span></label>
          <label class="fl"><input id="a-email" type="email" placeholder=" " required><span>E-mail</span></label>
        </div>
        <div class="wnav"><button class="btn ghost" type="button" data-prev><span>Voltar</span></button><button class="btn" type="submit" data-cursor="Enviar"><span>Enviar pedido</span>${icon('arrow')}</button></div>
      </fieldset>
      <div class="done-box" role="status">
        <svg class="check-anim" width="88" height="88" viewBox="0 0 64 64" fill="none" stroke="#18E28A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="32" cy="32" r="29"/><path d="M20 33l8 8 16-17"/></svg>
        <h2>Pedido <b>recebido.</b></h2>
        <p class="lead">Vamos confirmar a cobertura e falar com você pelo WhatsApp para agendar a instalação.</p>
        <a class="btn ghost" href="index.html"><span>Voltar ao início</span></a>
      </div>
    </form>
    <aside class="wsum spot" aria-live="polite">
      <span class="label">Resumo</span>
      <h3 data-s="name">Conecta</h3>
      <div class="sp" data-s="speed">600<small>Mega</small></div>
      <div class="line"><span>Mensalidade</span><b data-s="price">R$ 129,90</b></div>
      <div class="line"><span>Instalação</span><b>Grátis</b></div>
      <div class="line"><span>Wi-Fi</span><b>Incluso</b></div>
      <div class="line"><span>Suporte</span><b>24 horas</b></div>
    </aside>
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
