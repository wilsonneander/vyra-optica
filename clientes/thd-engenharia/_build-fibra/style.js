// CSS do modelo "Fibra" (THD Engenharia, terceiro modelo premium).
// Cores do site original: laranja #FE5710, azul #1A3B87, azul do logo #2B5AA8, azul-céu dos anéis #5BC5F0, marinho #021430.
// Fontes: Big Shoulders Display (condensada, industrial, em caixa-alta nos títulos) e Schibsted Grotesk no texto.

const css = `/* THD Engenharia, modelo Fibra. Gerado por _build-fibra/build.js (edite _build-fibra/style.js) */
@property --x{syntax:'<number>';inherits:true;initial-value:50}
:root{
  --orange:#FE5710; --orange-d:#DE4706; --orange-dd:#B93A05; --blue:#1A3B87; --blue-l:#2B5AA8; --sky:#5BC5F0;
  --navy:#021430; --deep:#061A3D; --night:#010C1F; --green:#23A455; --green-d:#1A8A45;
  --ink:#071330; --text:#3A4560; --muted:#5F6A85; --line:#D7DEEA; --paper:#EEF1F6; --soft:#B9C5DC; --soft-2:#8FA3C9;
  --f-head:"Big Shoulders Display","Big Shoulders","Arial Narrow",Arial,sans-serif; --f-body:"Schibsted Grotesk",Arial,sans-serif;
  --rail:92px; --container:1280px; --gutter:clamp(16px,4vw,48px);
  --ease:cubic-bezier(.16,1,.3,1); --ease-io:cubic-bezier(.76,0,.24,1);
}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:40px;-webkit-text-size-adjust:100%;scrollbar-color:var(--orange) var(--paper)}
body{margin:0;padding-left:var(--rail);font:400 17px/1.65 var(--f-body);color:var(--text);background:var(--paper);-webkit-font-smoothing:antialiased;overflow-x:hidden;overflow-x:clip}
img{max-width:100%;height:auto;display:block}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit}
svg{width:1em;height:1em;flex:none}
h1,h2,h3{font-family:var(--f-head);font-weight:800;text-transform:uppercase;color:var(--ink);line-height:.94;letter-spacing:.002em;margin:0 0 .45em}
h1{font-size:clamp(2.9rem,6.6vw,7rem)}
h2{font-size:clamp(2.3rem,4.6vw,4.4rem);max-width:17ch}
h3{font-size:1.6rem;line-height:1}
h1 em,h2 em{font-style:normal;color:var(--orange)}
p{margin:0 0 1em}
::selection{background:var(--orange);color:#fff}
:focus-visible{outline:3px solid var(--orange);outline-offset:3px}
.container{width:100%;max-width:var(--container);margin:0 auto;padding:0 var(--gutter)}
.skip{position:absolute;left:-10000px;top:8px;z-index:400;background:var(--orange);color:#fff;padding:10px 16px}
.skip:focus{left:calc(var(--rail) + 8px)}
main{position:relative;z-index:1}

/* tons */
.t-paper{background:var(--paper)}
.t-white{background:#fff}
.t-navy{background:var(--navy);color:var(--soft)}
.t-deep{background:var(--deep);color:var(--soft)}
.t-night{background:var(--night);color:var(--soft-2)}
.t-orange{background:var(--orange);color:#fff}
.t-navy h1,.t-navy h2,.t-navy h3,.t-deep h2,.t-deep h3,.t-night h2,.t-night h3,.t-orange h2{color:#fff}

/* fios de luz (canvas) */
.fibers{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0}
.sec{position:relative;padding:clamp(52px,5.5vw,88px) 0;overflow:clip}
.sec>.container{position:relative;z-index:1}
.head{margin-bottom:clamp(24px,3vw,40px)}

/* texto de apoio: texto simples em caixa-alta, sem caixa, sem traço */
.kicker{display:block;margin:0 0 18px;font:700 .78rem/1.3 var(--f-body);letter-spacing:.16em;text-transform:uppercase;color:var(--orange-dd)}
.t-navy .kicker,.t-deep .kicker,.t-night .kicker{color:var(--orange)}
.t-orange .kicker{color:#fff}
.lead{font-size:clamp(1.05rem,1.4vw,1.22rem);line-height:1.6;color:var(--text);max-width:52ch}

/* rolagem de letras */
.roll{display:inline-grid;overflow:hidden;line-height:1.25;vertical-align:middle}
.roll>span{grid-area:1/1;transition:transform .55s var(--ease)}
.roll>span+span{transform:translateY(115%)}
a:hover>.roll>span:first-child,button:hover>.roll>span:first-child,a:focus-visible>.roll>span:first-child{transform:translateY(-115%)}
a:hover>.roll>span+span,button:hover>.roll>span+span,a:focus-visible>.roll>span+span{transform:none}

/* ---------- botões: a cor nova corre da esquerda para a direita ---------- */
.btn{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:56px;padding:0 24px;border-radius:10px;border:0;font:700 .96rem/1 var(--f-body);letter-spacing:.01em;cursor:pointer;white-space:nowrap;transition:color .45s,box-shadow .5s,transform .45s var(--ease)}
.btn::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--fill,#fff);transform:scaleX(0);transform-origin:right;transition:transform .6s var(--ease)}
.btn:hover::before,.btn:focus-visible::before{transform:scaleX(1);transform-origin:left}
.btn:has(.b-ar){padding:0 8px 0 22px}
.btn>svg{font-size:1.25em}
.b-ar{display:grid;place-items:center;width:40px;height:40px;border-radius:7px;background:rgba(255,255,255,.18);transition:transform .55s var(--ease),background .4s,color .4s}
.btn:hover .b-ar{transform:translateX(3px)}
.btn-sm{min-height:46px;font-size:.88rem;padding:0 18px}
.btn-sm:has(.b-ar){padding:0 6px 0 16px}
.btn-sm .b-ar{width:34px;height:34px}
.btn-lg{min-height:66px;font-size:1.04rem;padding:0 28px}
.btn-o{background:var(--orange);color:#fff;--fill:var(--navy)}
.btn-o:hover{box-shadow:0 22px 40px -18px rgba(254,87,16,.85)}
.t-navy .btn-o,.t-deep .btn-o,.t-night .btn-o{--fill:#fff}
.t-navy .btn-o:hover,.t-deep .btn-o:hover,.t-night .btn-o:hover{color:var(--navy)}
.t-navy .btn-o:hover .b-ar,.t-deep .btn-o:hover .b-ar,.t-night .btn-o:hover .b-ar{background:var(--orange);color:#fff}
.btn-w{background:var(--green);color:#fff;--fill:var(--green-d)}
.btn-w:hover{box-shadow:0 22px 40px -18px rgba(35,164,85,.85)}
.btn-n{background:var(--navy);color:#fff;--fill:#fff}
.btn-n:hover{color:var(--navy)}
.btn-n:hover .b-ar{background:var(--orange);color:#fff}
.btn-line{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1.5px rgba(7,19,48,.28);--fill:var(--ink)}
.btn-line .b-ar{background:rgba(7,19,48,.07)}
.btn-line:hover{color:#fff}
.btn-line:hover .b-ar{background:var(--orange);color:#fff}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}
.link-arrow{display:inline-flex;align-items:center;gap:10px;padding:6px 0;border:0;background:none;cursor:pointer;font:700 .98rem/1.2 var(--f-body);color:inherit;background-image:linear-gradient(var(--orange),var(--orange));background-position:0 100%;background-size:0 2px;background-repeat:no-repeat;transition:background-size .5s var(--ease)}
.link-arrow:hover{background-size:100% 2px}
.t-paper .link-arrow,.t-white .link-arrow{color:var(--ink)}
.t-navy .link-arrow,.t-deep .link-arrow{color:#fff}
.link-arrow .i-arrow{transition:transform .45s var(--ease)}
.link-arrow:hover .i-arrow{transform:translateX(6px)}

/* ---------- entradas ---------- */
@keyframes up{from{opacity:0;transform:translateY(30px)}}
@keyframes wRise{from{transform:translateY(108%) skewY(7deg)}}
@keyframes rowIn{from{opacity:0;transform:translateY(14px)}}
@keyframes blink{50%{opacity:0}}
.js .up{animation:up 1s var(--ease) both;animation-delay:calc(var(--d,0s) + var(--ed,0s))}
.enter{--ed:.55s}
.hl{line-height:.9}
.hl .w{display:inline-block;overflow:hidden;vertical-align:top;padding:.16em .02em .06em;margin:-.16em -.02em -.06em}
.hl .w>span{display:inline-block;transform-origin:0 100%}
.js .hl .w>span{animation:wRise 1.05s var(--ease) both;animation-delay:calc(.2s + var(--i) * 60ms + var(--ed,0s))}
.js .rv{opacity:0;transform:translateY(36px);transition:opacity .9s var(--ease),transform 1.1s var(--ease);transition-delay:calc(var(--d,0) * 100ms)}
.js .rv.in{opacity:1;transform:none}
/* títulos: um bloco laranja atravessa o título e deixa o texto no lugar */
.bl{position:relative;width:fit-content}
.bl::after{content:"";position:absolute;inset:-.04em -.08em;background:var(--orange);transform:scaleX(0);transform-origin:left;pointer-events:none}
.t-orange .bl::after{background:var(--navy)}
.js .bl .bl-t{opacity:0}
.js .bl.in .bl-t{animation:blText 1.1s steps(1) both}
.js .bl.in::after{animation:blBlock 1.1s var(--ease-io) both}
@keyframes blBlock{0%{transform:scaleX(0);transform-origin:left}48%{transform:scaleX(1);transform-origin:left}52%{transform:scaleX(1);transform-origin:right}100%{transform:scaleX(0);transform-origin:right}}
@keyframes blText{0%{opacity:0}50%{opacity:1}100%{opacity:1}}

/* ---------- cursor: pulso de luz com rastro ---------- */
.cursor{position:fixed;left:0;top:0;z-index:300;pointer-events:none;opacity:0;transition:opacity .3s}
.has-cursor .cursor{opacity:1}
.c-dot{position:fixed;left:-6px;top:-6px;width:12px;height:12px;border-radius:3px;background:var(--orange);box-shadow:0 0 0 2px rgba(255,255,255,.75),0 0 18px rgba(254,87,16,.7);transition:width .35s var(--ease),height .35s var(--ease),left .35s var(--ease),top .35s var(--ease),background .3s}
.cursor.hover .c-dot{left:-17px;top:-17px;width:34px;height:34px;border-radius:9px;background:rgba(254,87,16,.18);box-shadow:inset 0 0 0 2px var(--orange)}
.c-tr{position:fixed;left:-3px;top:-3px;width:6px;height:6px;border-radius:2px;background:var(--sky);opacity:calc(.55 - var(--n) * .08)}
.c-tag{position:fixed;left:20px;top:18px;padding:8px 11px;border-radius:7px;background:var(--navy);color:#fff;font:700 .7rem/1 var(--f-body);letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;opacity:0;transition:opacity .25s}
.cursor.text .c-tag{opacity:1}
.has-cursor,.has-cursor a,.has-cursor button,.has-cursor label{cursor:none}

/* ---------- transição entre páginas: venezianas ---------- */
.shut{position:fixed;inset:0;z-index:250;display:flex;pointer-events:none}
.shut i{flex:1;background:var(--navy);transform:scaleY(0);transform-origin:top;transition:transform .55s var(--ease-io);transition-delay:calc(var(--k) * 55ms)}
.shut i:nth-child(2n){background:var(--deep)}
.shut i:nth-child(3){background:var(--orange)}
.shut.cover{pointer-events:auto}
.shut.cover i{transform:scaleY(1)}
.enter .shut i{transform:scaleY(1);transform-origin:bottom;animation:shutOut .75s var(--ease-io) forwards;animation-delay:calc(.08s + var(--k) * 65ms)}
@keyframes shutOut{to{transform:scaleY(0)}}

/* ---------- trilho de navegação (lateral no computador, barra no topo no celular) ---------- */
.rail{position:fixed;left:0;top:0;bottom:0;z-index:60;width:var(--rail);display:flex;flex-direction:column;align-items:center;padding:22px 0 20px;background:var(--navy);color:#fff;box-shadow:1px 0 0 rgba(255,255,255,.06);transition:transform .55s var(--ease)}
.brand img{width:62px;height:auto;transition:transform .5s var(--ease)}
.brand:hover img{transform:scale(1.06) rotate(-4deg)}
.rail-nav{display:flex;flex-direction:column;align-items:center;gap:10px;margin:auto 0}
.rail-nav a{position:relative;display:grid;place-items:center;width:50px;height:50px;border-radius:12px;color:var(--soft-2);transition:color .3s,background .3s}
.rail-nav a svg{width:23px;height:23px;transition:transform .45s var(--ease)}
.rail-nav a:hover,.rail-nav a:focus-visible{color:#fff;background:rgba(255,255,255,.07)}
.rail-nav a:hover svg{transform:translateY(-2px)}
.rail-nav a[aria-current]{color:#fff;background:var(--orange)}
.rail-nav a[aria-current]:hover svg{transform:none}
/* nome da página: aparece ao lado do ícone ao passar o mouse ou focar pelo teclado */
.rn-tip{position:absolute;left:calc(100% + 18px);top:50%;padding:11px 16px;border-radius:8px;background:var(--night);color:#fff;font:700 .8rem/1 var(--f-body);letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;box-shadow:0 16px 32px -14px rgba(1,12,31,.7),inset 0 0 0 1px rgba(91,197,240,.16);pointer-events:none;opacity:0;transform:translate(-10px,-50%);clip-path:inset(0 100% 0 0);transition:opacity .25s,transform .45s var(--ease),clip-path .45s var(--ease)}
.rn-tip::before{content:'';position:absolute;left:-5px;top:50%;width:10px;height:10px;background:var(--night);transform:translateY(-50%) rotate(45deg)}
.rail-nav a:hover .rn-tip,.rail-nav a:focus-visible .rn-tip{opacity:1;transform:translate(0,-50%);clip-path:inset(-10px -10px -10px -10px)}
.rail-nav a[aria-current] .rn-tip{background:var(--orange)}
.rail-nav a[aria-current] .rn-tip::before{background:var(--orange)}
.rail-prog{position:relative;width:3px;height:72px;margin-bottom:6px;border-radius:3px;background:rgba(255,255,255,.12);overflow:hidden}
.rail-prog i{position:absolute;inset:0;background:linear-gradient(var(--sky),var(--orange));transform-origin:top;transform:scaleY(var(--sp,0))}
.menu-btn{display:none;align-items:center;gap:12px;padding:10px 12px;border:0;border-radius:10px;background:rgba(255,255,255,.08);color:#fff;cursor:pointer}
.mb-t{font:700 .78rem/1 var(--f-body);letter-spacing:.14em;text-transform:uppercase}
.mb-i{position:relative;display:block;width:22px;height:12px}
.mb-i i{position:absolute;left:0;right:0;height:2px;border-radius:2px;background:currentColor;transition:transform .5s var(--ease)}
.mb-i i:first-child{top:0}
.mb-i i+i{bottom:0;left:7px}
.menu-open .mb-i i:first-child{transform:translateY(5px) rotate(45deg)}
.menu-open .mb-i i+i{left:0;transform:translateY(-5px) rotate(-45deg)}
.top-cta{position:fixed;right:24px;top:20px;z-index:59;display:flex;gap:10px;transition:transform .55s var(--ease),box-shadow .5s,color .45s}
.top-cta.hide{transform:translateY(calc(-100% - 40px))}
.mmenu{position:fixed;inset:0;z-index:58;padding-left:var(--rail);background:var(--night);color:#fff;overflow:hidden;visibility:hidden;clip-path:inset(0 0 100% 0);transition:clip-path .8s var(--ease-io),visibility 0s .8s}
.mmenu.open{visibility:visible;clip-path:inset(0);transition:clip-path .8s var(--ease-io),visibility 0s}
.mm-in{position:relative;z-index:1;height:100%;max-width:var(--container);margin:0 auto;display:grid;grid-template-columns:1.1fr .9fr;gap:50px;align-items:center;padding:90px var(--gutter) 130px}
.mmenu nav{display:grid}
.mmenu nav a{width:fit-content;font:800 clamp(2.6rem,7vw,6rem)/1.02 var(--f-head);text-transform:uppercase;color:#fff;opacity:0;transform:translateY(60px);transition:opacity .6s var(--ease),transform .9s var(--ease),color .3s;transition-delay:calc(var(--i) * 55ms + .2s)}
.mmenu.open nav a{opacity:1;transform:none}
.mmenu nav a:hover,.mmenu nav a[aria-current]{color:var(--orange)}
.mm-prev{position:relative;aspect-ratio:4/3;border-radius:14px;overflow:hidden;background:var(--deep)}
.mm-prev img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;clip-path:inset(100% 0 0 0);transition:clip-path .75s var(--ease)}
.mm-prev img.on{clip-path:inset(0)}
.mm-foot{position:absolute;z-index:1;left:calc(var(--rail) + var(--gutter));right:var(--gutter);bottom:34px;display:flex;flex-wrap:wrap;gap:8px 34px;color:var(--soft-2);font-size:.95rem}
.mm-foot a:hover{color:#fff}
body.menu-open{overflow:hidden}

/* ---------- mídia com venezianas que se abrem ---------- */
.media{position:relative;margin:0;border-radius:14px;overflow:hidden;background:var(--navy)}
.media img{width:100%;height:100%;object-fit:cover;scale:1.14}
.bars{position:absolute;inset:0;display:flex;pointer-events:none}
.bars i{flex:1;background:var(--navy);transform-origin:top;transform:scaleY(0)}
.js .bars i{animation:barsOut 1.05s var(--ease-io) both;animation-delay:calc(.45s + var(--k) * 80ms + var(--ed,0s))}
.js .bars i:nth-child(3){background:var(--orange)}
@keyframes barsOut{from{transform:scaleY(1)}to{transform:scaleY(0)}}
.logo-card{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:radial-gradient(circle at 50% 40%,#0D2B5E,var(--navy) 65%)}
.logo-card img{width:min(240px,46%);height:auto;scale:1}
.logo-card span{font:800 clamp(1.6rem,2.6vw,2.4rem)/1 var(--f-head);text-transform:uppercase;letter-spacing:.06em;color:#fff}
.media-tag{position:absolute;left:14px;bottom:14px;max-width:calc(100% - 28px);margin:0;padding:12px 16px;border-radius:9px;background:rgba(2,20,48,.82);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font-weight:700;font-size:.9rem;line-height:1.35}

/* ---------- topo da home ---------- */
.hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(110px,15vh,160px) 0 44px;overflow:clip}
.hero-in{position:relative;z-index:1}
.hero .hl{max-width:none;margin-bottom:.32em}
.hero-row{display:grid;grid-template-columns:.92fr 1.08fr;gap:clamp(30px,5vw,70px);align-items:end}
.hero-copy .lead{margin:0}
.hero-media{height:clamp(240px,25vw,350px)}
.facts{list-style:none;margin:clamp(34px,5vh,60px) 0 0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:0}
.facts li{padding:20px 24px 0 0;border-top:1.5px solid var(--ink);font-size:.95rem;color:var(--muted)}
.facts li+li{padding-left:24px}
.facts strong{display:block;margin-bottom:4px;font:800 1.5rem/1 var(--f-head);text-transform:uppercase;color:var(--ink)}

/* topo das páginas internas */
.phero{position:relative;padding:clamp(104px,14vh,140px) 0 clamp(44px,5vw,72px);overflow:clip}
.phero-in{position:relative;z-index:1}
.phero .hl{max-width:15ch}
.phero-row{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(30px,5vw,70px);align-items:end;margin-top:14px}
.phero-row.no-media{grid-template-columns:1fr}
.phero-media{height:clamp(220px,24vw,340px)}
.crumbs{display:flex;gap:10px;margin-bottom:26px;font-size:.9rem;color:var(--muted)}
.crumbs a:hover{color:var(--ink)}

/* ---------- órgãos reguladores em linhas ---------- */
.orgs{position:relative;padding:clamp(52px,5.5vw,88px) 0;overflow:clip}
.orgs>.container{position:relative;z-index:1}
.orgs-head{margin-bottom:clamp(26px,4vw,50px)}
.org-list{list-style:none;margin:0;padding:0;border-top:1.5px solid var(--ink)}
.org{position:relative;isolation:isolate;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;align-items:center;gap:20px;padding:24px 12px;border-bottom:1px solid var(--line);overflow:hidden;transition:padding .6s var(--ease)}
.org::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--navy);transform:scaleY(0);transform-origin:bottom;transition:transform .6s var(--ease)}
.org:hover{padding-left:34px}
.org:hover::before{transform:scaleY(1)}
.org-n{font:800 clamp(2.1rem,4.4vw,4rem)/1 var(--f-head);text-transform:uppercase;color:var(--ink);transition:color .4s}
.org-p{font-size:1.02rem;color:var(--muted);transition:color .4s}
.org:hover .org-n{color:#fff}
.org:hover .org-p{color:var(--soft)}
.org-logo{display:grid;place-items:center;width:120px;height:64px;border-radius:8px;background:#fff}
.org-logo img{height:calc(var(--h) * .5);width:auto;max-width:100px;object-fit:contain}
.t-deep .org-list{border-top-color:rgba(255,255,255,.4)}
.t-deep .org{border-bottom-color:rgba(255,255,255,.1)}
.t-deep .org::before{background:var(--orange)}
.t-deep .org-n{color:#fff}
.t-deep .org-p{color:var(--soft-2)}
.t-deep .org:hover .org-p{color:#FFE6DA}
.org-float{position:absolute;left:0;top:0;z-index:5;width:250px;height:170px;display:grid;place-items:center;border-radius:14px;background:#fff;box-shadow:0 40px 70px -30px rgba(2,20,48,.55);pointer-events:none;opacity:0;transition:opacity .35s;will-change:transform}
.org-float.on{opacity:1}
.org-float img{grid-area:1/1;max-width:72%;max-height:62%;width:auto;object-fit:contain;opacity:0;transform:translateY(24px) scale(.9);transition:opacity .35s,transform .5s var(--ease)}
.org-float img.on{opacity:1;transform:none}
@media (hover:hover) and (pointer:fine){.org-logo{display:none}}
@media not ((hover:hover) and (pointer:fine)){.org-float{display:none}}
.orgs-note{margin:24px 0 0;max-width:70ch;font-size:.82rem;color:var(--muted)}
.t-deep .orgs-note{color:var(--soft-2)}

/* ---------- serviços da home: prisma 3D preso na rolagem ---------- */
.prs{position:relative;height:calc(var(--n) * 60vh + 70vh)}
.prs-sticky{position:sticky;top:0;height:100vh;display:flex;align-items:center;overflow:hidden}
.prs-in{position:relative;z-index:1;display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(30px,5vw,80px);align-items:center}
.prs-l h2{font-size:clamp(2.2rem,4vw,3.8rem)}
.prs-idx{display:grid;max-width:440px;margin:30px 0 26px}
.prs-idx button{position:relative;display:flex;align-items:center;padding:15px 0;border:0;border-bottom:1px solid rgba(255,255,255,.14);background:none;text-align:left;font:700 1.02rem var(--f-body);color:var(--soft-2);cursor:pointer;transition:color .3s,padding .5s var(--ease)}
.prs-idx button:hover{color:#fff;padding-left:8px}
.prs-idx button[aria-selected=true]{color:#fff}
.prs-idx i{position:absolute;left:0;right:0;bottom:-1px;height:2px;background:linear-gradient(90deg,var(--sky),var(--orange));transform-origin:left;transform:scaleX(var(--f,0))}
.prism-wrap{position:relative;height:600px;display:grid;place-items:center;perspective:1700px}
.prism{--pw:min(480px,38vw);position:relative;width:var(--pw);height:560px;transform-style:preserve-3d;transform:translateZ(calc(var(--pw) / -2)) rotateY(calc(var(--a,0) * -90deg))}
.pf{position:absolute;inset:0;display:flex;flex-direction:column;padding:34px 32px;border-radius:4px;-webkit-backface-visibility:hidden;backface-visibility:hidden;transform:rotateY(calc(var(--i) * 90deg)) translateZ(calc(var(--pw) / 2));background:var(--paper);color:var(--text)}
.pf h3{font-size:clamp(2rem,2.8vw,2.7rem);margin-bottom:.15em;color:var(--ink)}
.pf-sum{margin-bottom:16px;font-size:.98rem}
.pf-art{display:block;flex:1;width:calc(100% + 64px);height:auto;min-height:50px;margin:4px -32px 14px;color:inherit}
.pf-art path{fill:none;stroke:currentColor;stroke-opacity:.2;stroke-width:1.5;vector-effect:non-scaling-stroke}
.pf-art .p{stroke:var(--pc,var(--orange));stroke-opacity:1;stroke-width:3;stroke-linecap:round;stroke-dasharray:9 91;animation:cab 2.8s linear infinite;animation-delay:calc(var(--k) * -.47s)}
.pf-1{--pc:#fff}.pf-2{--pc:var(--sky)}
.pf-list{list-style:none;margin:auto 0 0;padding:0}
.pf-list a{display:grid;grid-template-columns:1fr auto;gap:2px 16px;align-items:center;padding:12px 0;border-top:1px solid rgba(7,19,48,.14);transition:padding .45s var(--ease)}
.pf-list a:hover{padding-left:10px}
.pf-list strong{font:700 .96rem/1.25 var(--f-body);color:var(--ink)}
.pf-list small{grid-column:1;font-size:.84rem;line-height:1.4;opacity:.8}
.pf-list svg{grid-row:1/3;grid-column:2;font-size:1.2rem;transition:transform .45s var(--ease)}
.pf-list a:hover svg{transform:translateX(5px)}
.pf-1{background:var(--orange);color:#FFE9DE}
.pf-1 h3,.pf-1 .pf-list strong{color:#fff}
.pf-1 .pf-list a{border-color:rgba(255,255,255,.3)}
.pf-2{background:var(--blue);color:#C9D6F0}
.pf-2 h3,.pf-2 .pf-list strong{color:#fff}
.pf-2 .pf-list a{border-color:rgba(255,255,255,.2)}
.pf-2 .pf-list svg{color:var(--sky)}
.pf-3{background:#fff}
.pf-0 .pf-list svg,.pf-3 .pf-list svg{color:var(--orange-dd)}
.prism-floor{position:absolute;left:50%;bottom:-6px;width:min(560px,46vw);height:60px;margin-left:calc(min(560px,46vw) / -2);border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.55),transparent);filter:blur(6px)}

/* ---------- jornada: a luz corre pela fibra ---------- */
.jrn{position:relative;padding:clamp(52px,5.5vw,88px) 0;overflow:clip}
.jrn-head{max-width:820px;margin-bottom:clamp(26px,3.5vw,48px)}
.jrn-head p{max-width:52ch}
.jrn-body{position:relative}
.jrn-svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.jb{fill:none;stroke:rgba(26,59,135,.14);stroke-width:3;stroke-linecap:round}
.jl{fill:none;stroke:var(--orange);stroke-width:4;stroke-linecap:round;filter:drop-shadow(0 0 6px rgba(254,87,16,.55))}
.jp circle{fill:var(--orange)}
.jp .jp-h{fill:rgba(254,87,16,.2);transform-box:fill-box;transform-origin:center;animation:jpPulse 1.6s var(--ease) infinite}
@keyframes jpPulse{0%{transform:scale(.4);opacity:1}100%{transform:scale(1.6);opacity:0}}
.jrn-list{position:relative;list-style:none;margin:0;padding:0;display:grid;gap:clamp(36px,6vw,80px)}
.jrn-st{position:relative;display:grid;grid-template-columns:1fr 1fr;column-gap:180px}
.jrn-st.l .jrn-card{grid-column:1}
.jrn-st.r .jrn-card{grid-column:2}
.jrn-node{position:absolute;top:40px;width:26px;height:26px;margin-left:-13px;border-radius:6px;background:var(--paper);border:3px solid #C3CEE2;transform:rotate(45deg);transition:background .5s,border-color .5s,box-shadow .6s}
.jrn-st.l .jrn-node{left:calc(50% - 56px)}
.jrn-st.r .jrn-node{left:calc(50% + 56px)}
.jrn-st.on .jrn-node{background:var(--orange);border-color:var(--orange);box-shadow:0 0 0 9px rgba(254,87,16,.14)}
.jrn-card{padding:32px 34px;border-radius:14px;background:#fff;border:1px solid var(--line);transition:box-shadow .7s,border-color .6s,transform .8s var(--ease)}
.jrn-st.on .jrn-card{border-color:rgba(254,87,16,.45);box-shadow:0 40px 70px -46px rgba(2,20,48,.45)}
.jrn-card h3{font-size:clamp(1.8rem,2.6vw,2.4rem);transition:color .5s}
.jrn-st.on .jrn-card h3{color:var(--orange-dd)}
.tags{list-style:none;margin:18px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.tags a{display:inline-block;padding:9px 13px;border-radius:8px;background:var(--paper);font:700 .86rem/1.2 var(--f-body);color:var(--ink);transition:background .3s,color .3s,transform .4s var(--ease)}
.tags a:hover{background:var(--ink);color:#fff;transform:translateY(-2px)}

/* ---------- diagnóstico: chaves de três posições + rack 3D ---------- */
.dg{position:relative;padding:clamp(52px,5.5vw,88px) 0;overflow:clip}
.dg-in{position:relative;z-index:1;display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(30px,5vw,80px);align-items:start}
.dg-l>p.rv{max-width:50ch}
.dq-list{list-style:none;margin:30px 0 22px;padding:0;border-top:1px solid rgba(255,255,255,.12)}
.dq{display:grid;grid-template-columns:1fr auto;align-items:center;gap:12px 24px;padding:16px 0;border-bottom:1px solid rgba(255,255,255,.12)}
.dq-q{margin:0;font-weight:600;font-size:1.02rem;line-height:1.4;color:#fff;transition:color .4s}
.dq.done .dq-q{color:var(--soft-2)}
.tri{position:relative;display:flex;padding:4px;border-radius:10px;background:rgba(255,255,255,.07)}
.tri button{position:relative;z-index:1;padding:10px 14px;border:0;border-radius:7px;background:none;font:700 .88rem/1 var(--f-body);color:var(--soft);cursor:pointer;transition:color .3s}
.tri button:hover{color:#fff}
.tri button[aria-pressed=true]{color:#fff}
.tri-th{position:absolute;left:0;top:4px;bottom:4px;width:0;border-radius:7px;background:var(--orange);opacity:0;transition:transform .5s var(--ease),width .5s var(--ease),opacity .3s,background .3s}
.tri.v-sim .tri-th{background:var(--blue-l)}
.dg-reset{color:#fff}
.dg-r{position:sticky;top:40px}
.rack{perspective:1500px}
.rack-in{position:relative;transform-style:preserve-3d;transform:rotateY(calc(-14deg + var(--tx,0) * 1deg)) rotateX(calc(5deg + var(--ty,0) * 1deg));transition:transform 1s var(--ease)}
.rack-face{position:relative;display:grid;gap:7px;padding:14px 34px 22px;border-radius:10px;background:linear-gradient(#0C2350,#061736);box-shadow:inset 0 0 0 1px rgba(91,197,240,.18),0 60px 80px -50px rgba(0,0,0,.85);transform-style:preserve-3d}
.rack-face::before,.rack-face::after{content:"";position:absolute;top:56px;bottom:18px;width:8px;background:repeating-linear-gradient(180deg,rgba(91,197,240,.35) 0 4px,transparent 4px 12px);border-radius:2px}
.rack-face::before{left:13px}
.rack-face::after{right:13px}
.rack-cap{display:flex;align-items:baseline;gap:8px;margin:0;padding:6px 0 12px;color:var(--soft-2)}
.rack-cap span{margin-right:auto;font:700 .72rem/1 var(--f-body);letter-spacing:.14em;text-transform:uppercase}
.rack-cap b{font:800 2.6rem/1 var(--f-head);color:#fff}
.rack-cap small{font-size:.84rem}
.rack-cap.bump b{animation:bump .55s var(--ease)}
@keyframes bump{40%{transform:scale(1.3);color:var(--sky)}}
.slot{position:relative;height:42px;border-radius:5px;background:rgba(0,0,0,.4);box-shadow:inset 0 0 0 1px rgba(91,197,240,.14),inset 0 6px 10px rgba(0,0,0,.4);transform-style:preserve-3d}
.mod{position:absolute;inset:0;display:flex;align-items:center;gap:12px;padding:0 22px 0 14px;border-radius:5px;background:linear-gradient(#2A4D8F,#1A3B87);color:#fff;transform:translateZ(110px);opacity:0;transition:transform .9s var(--ease),opacity .45s,background .5s}
.mod::after{content:"";position:absolute;right:9px;top:9px;bottom:9px;width:4px;border-radius:2px;background:var(--sky);box-shadow:0 0 12px var(--sky)}
.mod-l{font:700 .86rem/1.2 var(--f-body);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mod-st{font:600 .68rem/1 var(--f-body);letter-spacing:.1em;text-transform:uppercase;opacity:.8}
.mod-v{flex:1;min-width:20px;height:14px;border-radius:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.22) 0 3px,transparent 3px 7px)}
.slot.ok .mod{transform:translateZ(1px);opacity:1}
.slot.miss .mod{transform:translateZ(46px) translateX(14px);opacity:1;background:linear-gradient(#FF6C2C,#DE4706)}
.slot.miss .mod::after{background:#fff;box-shadow:0 0 12px #fff;animation:blink 1.2s steps(1) infinite}
.rack-side{position:absolute;top:0;bottom:0;width:70px;background:linear-gradient(90deg,#041330,#0A2148)}
.rs-l{left:0;transform-origin:left;transform:rotateY(90deg)}
.rs-r{right:0;transform-origin:right;transform:rotateY(-90deg)}
.rack-top{position:absolute;left:0;right:0;top:0;height:70px;background:#0F2A5C;transform-origin:top;transform:rotateX(-90deg)}
.dg-msg{min-height:3.2em;margin:26px 0 12px;color:var(--soft)}
.dg-pend{list-style:none;margin:0 0 20px;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.dg-pend li{padding:8px 12px;border-radius:8px;background:rgba(254,87,16,.16);font-weight:700;font-size:.88rem;color:#FFB592;animation:rowIn .5s var(--ease) both}
.dg-r .btn{width:100%}

/* ---------- pilares: palavras que se acendem ---------- */
.plr{position:relative}
.plr-sticky{position:relative;display:flex;align-items:center;overflow:hidden;padding:clamp(52px,5.5vw,88px) 0}
.plr-in{display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(30px,5vw,80px);align-items:center}
.plr-desc{display:grid;margin-top:30px}
.plr-d{grid-area:1/1;opacity:0;transform:translateY(24px);transition:opacity .5s,transform .7s var(--ease)}
.plr-d.on{opacity:1;transform:none}
.plr-d h3{font-size:2rem;color:var(--orange-dd)}
.plr-d p{max-width:38ch;font-size:1.12rem}
.plr-words{position:relative;height:min(48vh,420px);overflow:hidden;-webkit-mask-image:linear-gradient(transparent,#000 22%,#000 78%,transparent);mask-image:linear-gradient(transparent,#000 22%,#000 78%,transparent)}
.plr-track{list-style:none;margin:0;padding:0;will-change:transform}
.pw{position:relative;display:block;padding:.04em 0;border:0;background:none;cursor:pointer;text-align:left;font:900 clamp(3rem,7.4vw,7.6rem)/1 var(--f-head);text-transform:uppercase;color:transparent;-webkit-text-stroke:2px rgba(7,19,48,.28)}
.pw::after{content:attr(data-t);position:absolute;inset:.04em 0;color:var(--orange);-webkit-text-stroke:0;clip-path:inset(0 calc(100% - var(--f,0) * 100%) 0 0)}

/* ---------- quem somos (home): foto que abre em íris ---------- */
.qs{position:relative;padding:clamp(52px,5.5vw,88px) 0;overflow:clip}
.qs-in{position:relative;z-index:1;display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(36px,6vw,90px);align-items:center}
.iris{margin:0;aspect-ratio:4/5;max-height:660px;border-radius:14px;overflow:hidden;clip-path:circle(calc(var(--r,75) * 1%) at 50% 50%)}
.iris img{width:100%;height:100%;object-fit:cover;scale:calc(1.4 - var(--rp,1) * .4)}
blockquote{margin:28px 0;padding:24px 26px;border-radius:12px;background:rgba(255,255,255,.05);font-size:1.05rem;color:var(--soft)}
blockquote strong{display:block;margin-bottom:6px;font:800 1.4rem/1 var(--f-head);text-transform:uppercase;color:var(--orange)}

/* ---------- contabilidade: impressora de extrato ---------- */
.split-2{display:grid;grid-template-columns:1fr 1fr;gap:clamp(36px,6vw,90px);align-items:center}
.prn{margin:0;display:grid;place-items:center;perspective:1400px}
.prn-in{position:relative;width:min(410px,100%);transform-style:preserve-3d;transform:rotateY(calc(-9deg + var(--tx,0) * 1deg)) rotateX(calc(7deg + var(--ty,0) * 1deg));transition:transform 1s var(--ease)}
.prn-head{position:relative;z-index:2;display:flex;align-items:center;gap:16px;padding:20px 24px 34px;border-radius:16px 16px 8px 8px;background:var(--navy);color:#fff;box-shadow:0 30px 50px -30px rgba(2,20,48,.7)}
.prn-head img{width:58px}
.prn-head b{display:block;font:800 1.45rem/1 var(--f-head);text-transform:uppercase}
.prn-head small{color:var(--soft-2);font-size:.84rem}
.prn-slot{position:relative;z-index:3;display:block;height:10px;margin:-20px 18px 0;border-radius:5px;background:#000;box-shadow:inset 0 3px 5px rgba(0,0,0,.9)}
.prn-clip{position:relative;z-index:1;margin:-5px 30px 0;padding-bottom:40px;overflow:hidden}
.prn-paper{padding:26px 22px 38px;background:#fff;color:var(--ink);box-shadow:0 30px 40px -30px rgba(2,20,48,.5);-webkit-mask:linear-gradient(#000 0 0) top/100% calc(100% - 11px) no-repeat,conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) bottom/16px 11px repeat-x;mask:linear-gradient(#000 0 0) top/100% calc(100% - 11px) no-repeat,conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) bottom/16px 11px repeat-x}
.js .prn-paper{transform:translateY(-101%)}
.js .prn.in .prn-paper{animation:print 2.2s steps(22) .3s forwards}
@keyframes print{to{transform:none}}
.pp-t{margin:0 0 12px;padding-bottom:12px;border-bottom:1.5px dashed var(--line);font:800 1.15rem/1 var(--f-head);text-transform:uppercase}
.pp-row{display:grid;grid-template-columns:84px 1fr;align-items:center;gap:12px;padding:7px 0;font-weight:700;font-size:.9rem}
.pp-row i{height:10px;border-radius:3px;background:var(--paper);overflow:hidden}
.pp-row b{display:block;width:calc(var(--v) * 1%);height:100%;border-radius:3px;background:var(--blue-l);transform-origin:left}
.pp-row.hot b{background:var(--orange)}
.js .pp-row b{transform:scaleX(0);transition:transform 1.1s var(--ease);transition-delay:calc(2.4s + var(--k) * 150ms)}
.js .prn.in .pp-row b{transform:none}
.pp-chart{width:100%;height:auto;margin:12px 0 0}
.pp-g{fill:none;stroke:var(--line);stroke-width:1}
.pp-l{fill:none;stroke:var(--orange);stroke-width:3;stroke-linejoin:round;stroke-linecap:round}
.js .pp-l{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.6s var(--ease) 3s}
.js .prn.in .pp-l{stroke-dashoffset:0}
.pp-f{margin:12px 0 0;padding-top:12px;border-top:1.5px dashed var(--line);font-size:.82rem;line-height:1.45;color:var(--muted)}

/* ---------- chamada final laranja ---------- */
.cta{position:relative;padding:clamp(60px,6.5vw,108px) 0;overflow:clip}
.cta-in{position:relative;z-index:1;display:grid;grid-template-columns:1.25fr .75fr;gap:clamp(30px,5vw,80px);align-items:end}
.cta h2{font-size:clamp(2.6rem,5.6vw,5.8rem);max-width:15ch}
.cta-lead{max-width:48ch;margin:0;font-size:1.15rem;color:#FFE9DE}
.cta-lead .u{color:#fff;font-weight:700;text-decoration:underline;text-underline-offset:4px}
.cta-r{display:grid;gap:12px}
.cta-r .btn{width:100%;justify-content:space-between}
.cta-info{display:grid;gap:12px;margin:22px 0 0}
.cta-info div{display:flex;justify-content:space-between;gap:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,.35)}
.cta-info dt{color:#FFD9C7;font-size:.9rem}
.cta-info dd{margin:0;font-weight:700;text-align:right}

/* ---------- serviços (página): índice fixo + catálogo ---------- */
.cat{position:relative;padding:clamp(40px,4.5vw,72px) 0 clamp(52px,5.5vw,88px)}
.cat-in{display:grid;grid-template-columns:270px 1fr;gap:clamp(30px,5vw,80px);align-items:start}
.cat-nav{position:sticky;top:24px;display:grid;gap:4px;padding:24px;border-radius:14px;background:var(--navy);color:var(--soft)}
.cat-nav-t{margin:0 0 8px;font:700 .74rem/1 var(--f-body);letter-spacing:.14em;text-transform:uppercase;color:var(--orange)}
.cat-links{display:grid}
.cat-links a{display:grid;gap:9px;padding:12px 0;font-weight:700;color:var(--soft-2);transition:color .3s}
.cat-links a:hover,.cat-links a.active{color:#fff}
.cat-links i{height:3px;border-radius:3px;background:rgba(255,255,255,.1);overflow:hidden}
.cat-links b{display:block;height:100%;background:linear-gradient(90deg,var(--sky),var(--orange));transform-origin:left;transform:scaleX(var(--f,0))}
.cat-nav .btn{margin-top:14px}
.grp{scroll-margin-top:30px}
.grp+.grp{margin-top:clamp(70px,9vw,120px)}
.grp-head{margin-bottom:26px}
.grp-head h2{font-size:clamp(2rem,3.6vw,3.3rem);max-width:20ch}
.acc{border-top:1.5px solid var(--ink)}
.acc-item{position:relative;border-bottom:1px solid var(--line);scroll-margin-top:120px}
.acc-item::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--orange);transform:scaleX(0);transform-origin:left;transition:transform .7s var(--ease)}
.acc-item:hover::after,.acc-item.open::after{transform:scaleX(1)}
.acc-h{margin:0;font-size:inherit;line-height:inherit;text-transform:none}
.acc-h button{display:flex;align-items:center;gap:24px;width:100%;padding:26px 4px;border:0;background:none;text-align:left;cursor:pointer;transition:padding .5s var(--ease)}
.acc-h button:hover{padding-left:16px}
.acc-t{display:block;font:800 clamp(1.5rem,2.4vw,2.1rem)/1 var(--f-head);text-transform:uppercase;color:var(--ink);transition:color .3s}
.acc-h button:hover .acc-t,.acc-item.open .acc-t{color:var(--orange-dd)}
.acc-tt small{display:block;margin-top:8px;font:400 .98rem/1.5 var(--f-body);color:var(--muted)}
.tog{display:grid;place-items:center;flex:none;width:48px;height:48px;margin-left:auto;border-radius:10px;box-shadow:inset 0 0 0 1.5px var(--line);color:var(--ink);transition:transform .6s var(--ease),background .35s,color .35s,box-shadow .35s}
.acc-item.open .tog{transform:rotate(135deg);background:var(--orange);box-shadow:none;color:#fff}
.acc-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .65s var(--ease)}
.acc-item.open .acc-body{grid-template-rows:1fr}
.acc-body>div{overflow:hidden}
.inner{max-width:68ch;padding:0 4px 30px}
.inner .actions{margin-top:18px;align-items:center}
.acc-item.flash{animation:flash 1.8s var(--ease)}
@keyframes flash{0%,40%{background:rgba(254,87,16,.1)}100%{background:transparent}}

/* ---------- quem somos (página) ---------- */
.hist-lead{font-size:1.2rem;color:var(--ink)}
.disc{padding:0 3px;border-radius:3px;font-weight:700;color:var(--ink);background-image:linear-gradient(var(--dc),var(--dc));background-position:0 100%;background-size:100% 3px;background-repeat:no-repeat;cursor:default;transition:background-size .45s var(--ease),color .3s}
.disc:hover,.disc:focus,.disc.on{background-size:100% 100%;color:#fff;outline:none}
.d-o{--dc:var(--orange)}.d-l{--dc:var(--blue-l)}.d-g{--dc:var(--green)}.d-s{--dc:#2A9FD0}
.cables-wrap{padding:30px;border-radius:14px;background:var(--paper)}
.cables{width:100%;height:auto;overflow:visible}
.cables text{font:700 15px var(--f-body);fill:var(--muted);transition:fill .4s}
.cab-b{fill:none;stroke:#C9D2E3;stroke-width:5;stroke-linecap:round;transition:stroke .5s}
.cab-p{fill:none;stroke:var(--cc);stroke-width:5;stroke-linecap:round;stroke-dasharray:14 86;opacity:.5;animation:cab 2.4s linear infinite}
.cab rect{fill:var(--cc)}
.c-o{--cc:var(--orange)}.c-l{--cc:var(--blue-l)}.c-g{--cc:var(--green)}.c-s{--cc:#2A9FD0}
@keyframes cab{to{stroke-dashoffset:-100}}
.cables[data-on] .cab{opacity:.35;transition:opacity .4s}
.cables[data-on="o"] .c-o,.cables[data-on="l"] .c-l,.cables[data-on="g"] .c-g,.cables[data-on="s"] .c-s{opacity:1}
.cables[data-on="o"] .c-o .cab-b,.cables[data-on="l"] .c-l .cab-b,.cables[data-on="g"] .c-g .cab-b,.cables[data-on="s"] .c-s .cab-b{stroke:var(--cc)}
.cables[data-on="o"] .c-o .cab-p,.cables[data-on="l"] .c-l .cab-p,.cables[data-on="g"] .c-g .cab-p,.cables[data-on="s"] .c-s .cab-p{stroke:#fff;opacity:.9;animation-duration:1.1s}
.cables[data-on="o"] .c-o text,.cables[data-on="l"] .c-l text,.cables[data-on="g"] .c-g text,.cables[data-on="s"] .c-s text{fill:var(--ink)}
.hub rect{fill:var(--navy)}
.hub text{font:800 34px var(--f-head);fill:#fff;text-anchor:middle}
.mis .container{position:relative;z-index:1}
.tw{max-width:24ch;margin:0;font:800 clamp(2.3rem,5.4vw,5.2rem)/1.02 var(--f-head);text-transform:uppercase;color:#fff}
.tw-w{white-space:nowrap}
.tw .c{position:relative;opacity:.14;transition:opacity .12s}
.tw .c.on{opacity:1}
.tw .hl .c.on{color:var(--orange)}
.tw .c.cur::after{content:"";position:absolute;left:100%;top:.06em;bottom:.08em;width:.42em;margin-left:.04em;background:var(--orange);animation:blink 1s steps(1) infinite}
.fronts{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1.15fr 1fr 1fr;gap:14px}
.fronts li:first-child{grid-row:span 2}
.fronts li:nth-child(4){grid-column:span 2}
.fronts a{position:relative;isolation:isolate;display:flex;flex-direction:column;height:100%;min-height:250px;padding:30px;border-radius:14px;background:#fff;overflow:hidden}
.fronts a::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--navy);clip-path:circle(0 at var(--cx,90%) var(--cy,10%));transition:clip-path .8s var(--ease)}
.fronts a:hover::before,.fronts a:focus-visible::before{clip-path:circle(150% at var(--cx,90%) var(--cy,10%))}
.fronts strong{max-width:12ch;padding-right:50px;font:800 clamp(2rem,3vw,2.8rem)/.95 var(--f-head);text-transform:uppercase;color:var(--ink);transition:color .45s}
.fr-sum{margin-top:12px;color:var(--muted);transition:color .45s}
.fronts .pf-art{width:calc(100% + 60px);margin:20px -30px 0;color:var(--ink);transition:color .45s}
.fronts a:hover .pf-art{color:#fff}
.fr-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;padding-top:24px}
.fr-list span{padding:6px 10px;border-radius:7px;background:var(--paper);font-size:.84rem;font-weight:700;color:var(--ink);transition:background .45s,color .45s}
.fronts .go{position:absolute;right:22px;top:24px;display:grid;place-items:center;width:42px;height:42px;border-radius:9px;background:var(--paper);color:var(--ink);transition:background .4s,color .4s,transform .5s var(--ease)}
.fronts a:hover strong,.fronts a:focus-visible strong{color:#fff}
.fronts a:hover .fr-sum,.fronts a:focus-visible .fr-sum{color:var(--soft)}
.fronts a:hover .fr-list span,.fronts a:focus-visible .fr-list span{background:rgba(255,255,255,.1);color:#fff}
.fronts a:hover .go,.fronts a:focus-visible .go{background:var(--orange);color:#fff;transform:translateX(4px)}

/* ---------- contabilidade (página) ---------- */
.cmp-sec .container{position:relative;z-index:1}
.cmp-head{display:grid;grid-template-columns:1fr 1fr;gap:20px clamp(30px,5vw,80px);align-items:end;margin-bottom:30px}
.cmp-head p{margin:0;color:var(--soft)}
.cmp-tabs{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
.cmp-tabs button{padding:16px 20px;border:0;border-radius:12px;background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12);text-align:left;cursor:pointer;transition:background .4s,box-shadow .4s}
.cmp-tabs button:hover{background:rgba(255,255,255,.09)}
.cmp-tabs button[aria-pressed=true]{background:rgba(254,87,16,.14);box-shadow:inset 0 0 0 1.5px var(--orange)}
.cmp-tabs strong{display:block;font:800 1.3rem/1 var(--f-head);text-transform:uppercase;color:#fff}
.cmp-tabs small{display:block;margin-top:6px;color:var(--soft-2)}
.cmp{--x:50;position:relative;display:grid;border-radius:16px;overflow:hidden;-webkit-user-select:none;user-select:none;touch-action:pan-y}
.cmp.anim{transition:--x .9s var(--ease)}
.cmp-a,.cmp-b{grid-area:1/1;display:flex;padding:clamp(26px,4vw,48px)}
.cmp-a{background:#fff;color:var(--text)}
.cmp-b{background:linear-gradient(160deg,#FFF6F1 20%,#FFE3D4);color:var(--text);clip-path:inset(0 0 0 calc(var(--x) * 1%))}
/* cada lado ocupa metade; arrastado até o fim, o conteúdo daquele lado vai para o centro */
.cmp-c{width:46%}
.cmp-a .cmp-c{transform:translateX(calc(max(0, (var(--x) - 50) / 50) * 58%))}
.cmp-b .cmp-c{margin-left:auto;transform:translateX(calc(min(0, (var(--x) - 50) / 50) * 58%))}
.t-navy .cmp h3{font-size:clamp(1.8rem,2.8vw,2.6rem);color:var(--ink)}
.cmp-tag{margin:0 0 14px;font:700 .74rem/1 var(--f-body);letter-spacing:.14em;text-transform:uppercase;color:var(--orange-dd)}
.lg-rows{list-style:none;margin:20px 0 0;padding:0}
.lg-rows li{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:12px 0;border-top:1px solid var(--line);font-weight:700;color:var(--ink)}
.lg-rows small{flex:none;padding:5px 10px;border-radius:7px;background:var(--paper);font-weight:600;font-size:.82rem;color:var(--muted)}
.lg-chart{width:100%;height:auto;margin-top:4px}
.lg-chart .gl path{stroke:var(--line);stroke-width:1}
.lg-chart .ar{fill:rgba(254,87,16,.14)}
.lg-chart .ln{fill:none;stroke:var(--orange);stroke-width:3;stroke-linejoin:round}
.cmp-h{position:absolute;top:0;bottom:0;left:calc(var(--x) * 1%);z-index:3;width:56px;margin-left:-28px;padding:0;border:0;background:none;cursor:ew-resize;touch-action:none}
.cmp-h i{position:absolute;left:50%;top:0;bottom:0;width:3px;margin-left:-1.5px;background:var(--orange);box-shadow:0 0 16px rgba(254,87,16,.6)}
.cmp-h span{position:absolute;left:50%;top:50%;display:flex;align-items:center;justify-content:center;gap:0;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:12px;background:var(--orange);color:#fff;box-shadow:0 14px 30px -10px rgba(254,87,16,.8);transition:transform .4s var(--ease)}
.cmp-h span svg:first-child{transform:rotate(180deg)}
.cmp-h:hover span,.cmp.drag .cmp-h span{transform:scale(1.1)}
.segs-in{align-items:start}
.segs{list-style:none;margin:0;padding:0;border-top:1.5px solid var(--ink)}
.segs li{padding:20px 4px;border-bottom:1px solid var(--line);font:800 clamp(1.7rem,3vw,2.6rem)/1 var(--f-head);text-transform:uppercase;color:var(--ink);transition:color .35s,padding .5s var(--ease)}
.segs li:first-child{color:var(--orange-dd)}
.segs li:hover{padding-left:16px;color:var(--orange-dd)}

/* ---------- contato ---------- */
.ct .container{position:relative;z-index:1}
.contact{display:grid;grid-template-columns:1.25fr .75fr;gap:clamp(22px,4vw,50px);align-items:start}
.form{padding:clamp(26px,4vw,52px);border-radius:16px;background:#fff}
.form h2{margin-bottom:.25em;font-size:clamp(2.2rem,3.6vw,3.2rem)}
.form-note{color:var(--muted);margin-bottom:22px}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:0 26px}
.fl{position:relative;display:block;margin-bottom:20px}
.fl input,.fl textarea{width:100%;padding:28px 0 10px;border:0;border-radius:0;border-bottom:2px solid var(--line);background:transparent linear-gradient(var(--orange),var(--orange)) no-repeat 0 100%/0 2px;font:500 1.06rem/1.4 var(--f-body);color:var(--ink);resize:vertical;transition:background-size .5s var(--ease)}
.fl input:focus,.fl textarea:focus{outline:none;background-size:100% 2px}
.fl span{position:absolute;left:0;top:28px;color:var(--muted);pointer-events:none;transform-origin:left top;transition:transform .35s var(--ease),color .3s}
.fl input:focus+span,.fl input:not(:placeholder-shown)+span,.fl textarea:focus+span,.fl textarea:not(:placeholder-shown)+span{transform:translateY(-22px) scale(.8);color:var(--orange-dd)}
.fl.invalid input,.fl.invalid textarea{border-bottom-color:#D93025}
.fl.invalid span{color:#D93025}
.subj{margin:8px 0 22px;padding:0;border:0}
.subj legend{margin-bottom:12px;font-weight:700;color:var(--ink)}
.subj>div{display:flex;flex-wrap:wrap;gap:8px}
.subj label{position:relative;cursor:pointer}
.subj input{position:absolute;opacity:0;pointer-events:none}
.subj span{display:inline-block;padding:11px 16px;border-radius:9px;background:var(--paper);font-weight:700;font-size:.92rem;color:var(--text);transition:background .3s,color .3s,transform .4s var(--ease)}
.subj label:hover span{transform:translateY(-2px)}
.subj input:checked+span{background:var(--ink);color:#fff}
.subj input:focus-visible+span{outline:3px solid var(--orange);outline-offset:2px}
.form .btn{margin-top:6px}
.form-status{margin:14px 0 0;font-weight:700}
.form-status.ok{color:var(--green-d)}
.form-status.err{color:#D93025}
.chan{position:relative;overflow:hidden;display:grid;gap:6px;padding:30px;border-radius:16px}
.chan>*:not(.fibers){position:relative;z-index:1}
.chan-hd{margin:0 0 10px}
.chan-hd strong{display:block;font:800 1.7rem/1 var(--f-head);text-transform:uppercase;color:#fff}
.chan-now{display:block;margin-top:8px;font-size:.92rem;color:var(--soft-2)}
.chan-now.open{color:#62D691}
.ch{display:flex;gap:14px;align-items:flex-start;padding:15px 16px;border-radius:12px;transition:background .35s,transform .45s var(--ease)}
a.ch:hover{background:rgba(255,255,255,.06);transform:translateX(6px)}
.ch .ci{flex:none;margin-top:2px;font-size:22px;color:var(--orange)}
.ch strong{display:block;color:#fff}
.ch small{display:block;font-size:.92rem;color:var(--soft-2)}
.ch small a:hover{color:#fff}
.ch-wa{background:rgba(35,164,85,.13);box-shadow:inset 0 0 0 1px rgba(35,164,85,.42)}
.ch-wa .ci{color:#62D691}

/* ---------- rodapé ---------- */
.footer{position:relative;z-index:1;overflow:hidden;padding:clamp(52px,5.5vw,88px) 0 0}
.where{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(30px,5vw,80px);align-items:center;padding-bottom:clamp(60px,8vw,100px)}
.where-copy p:not(.kicker){color:var(--soft)}
.where .btn{margin-top:12px}
${require('../_build/mapa-css')}
.map-frame{height:420px}
.map-frame.mapc .map-info b{font-size:20px;text-transform:uppercase}
.map-frame.mapc .mbtns a,.map-frame.mapc .map-pin b{font-size:16px}
.map-frame.mapc .map-pin b{text-transform:uppercase;top:-6px}
.js .map-frame{clip-path:inset(0 0 100% 0);transition:clip-path 1.3s var(--ease-io)}
.js .map-frame.in{clip-path:inset(0)}
.foot-grid{display:grid;grid-template-columns:1.4fr 1fr 1.3fr 1fr;gap:40px;padding-top:56px;padding-bottom:30px;border-top:1px solid rgba(255,255,255,.08)}
.footer h3{margin-bottom:16px;font-size:1.3rem;color:#fff}
.footer ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.footer ul a{transition:color .3s}
.footer ul a:hover{color:#fff}
.foot-brand img{width:170px}
.foot-brand p{margin:18px 0 0;max-width:30ch}
.social{display:flex;gap:10px;margin-top:20px}
.social a{display:grid;place-items:center;width:46px;height:46px;border-radius:10px;background:rgba(255,255,255,.07);color:#fff;font-size:20px;transition:background .35s,transform .45s var(--ease)}
.social a:hover{background:var(--orange);transform:translateY(-4px)}
.foot-contact li{display:flex;gap:10px;align-items:flex-start}
.foot-contact svg{margin-top:5px;color:var(--orange)}
.hours{margin:0}
.hours div{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.07)}
.hours dt,.hours dd{margin:0}
.hours dd{color:#fff;text-align:right}
.foot-word{margin:clamp(30px,5vw,60px) 0 0;white-space:nowrap;text-align:center;font:900 clamp(3rem,11.5vw,12.5rem)/.86 var(--f-head);text-transform:uppercase;color:transparent;-webkit-text-stroke:1.5px rgba(91,197,240,.2);background:radial-gradient(300px circle at var(--mx,50%) var(--my,50%),var(--orange),rgba(254,87,16,0) 70%);-webkit-background-clip:text;background-clip:text;-webkit-user-select:none;user-select:none}
.foot-bottom{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;padding-top:22px;padding-bottom:30px;font-size:.85rem;border-top:1px solid rgba(255,255,255,.08)}
.wa-float{position:fixed;right:22px;bottom:22px;z-index:55;display:flex;align-items:center;gap:0;height:60px;padding:0 17px;border-radius:16px;background:var(--green);color:#fff;font-size:26px;box-shadow:0 18px 34px -12px rgba(35,164,85,.75);transition:gap .5s var(--ease),transform .5s var(--ease)}
.wa-float span{max-width:0;overflow:hidden;white-space:nowrap;font:700 .92rem/1 var(--f-body);transition:max-width .6s var(--ease)}
.wa-float:hover{gap:10px;transform:translateY(-3px)}
.wa-float:hover span{max-width:140px}

/* ---------- responsivo ---------- */
@media (max-width:1180px){
  .foot-grid{grid-template-columns:1fr 1fr}
  .jrn-st{column-gap:120px}
  .jrn-st.l .jrn-node{left:calc(50% - 38px)}
  .jrn-st.r .jrn-node{left:calc(50% + 38px)}
}
@media (min-width:921px) and (max-height:700px){
  .rail-nav{display:none}
  .menu-btn{display:flex;flex-direction:column;gap:10px;margin:auto 0;padding:14px 10px}
  .mb-t{writing-mode:vertical-rl;transform:rotate(180deg)}
}
@media (max-width:920px),(max-height:699px){
  .prs,.plr{height:auto}
  .prs-sticky,.plr-sticky{position:relative;height:auto;padding:clamp(52px,5.5vw,88px) 0;overflow:visible}
  .prs-in,.plr-in{grid-template-columns:1fr}
  .prs-idx{display:none}
  .prism-wrap{height:auto;perspective:none;display:block}
  .prism{width:auto;height:auto;transform:none;display:grid;gap:14px}
  .pf{position:relative;inset:auto;transform:none;filter:none!important;border-radius:14px}
  .prism-floor{display:none}
  .plr-words{display:none}
  .plr-desc{gap:12px}
  .plr-d{grid-area:auto;opacity:1;transform:none;padding:22px 24px;border-radius:14px;background:var(--paper)}
}
@media (max-width:920px){
  :root{--rail:0px}
  body{padding-left:0}
  .rail{inset:0 0 auto;width:auto;height:64px;flex-direction:row;justify-content:space-between;padding:0 16px;box-shadow:0 1px 0 rgba(255,255,255,.06)}
  .rail.hide{transform:translateY(-100%)}
  .brand img{width:58px}
  .rail-nav,.rail-prog,.top-cta{display:none}
  .menu-btn{display:flex}
  .mmenu{padding-left:0}
  .mm-in{grid-template-columns:1fr;padding-top:100px}
  .mm-prev{display:none}
  .mm-foot{left:var(--gutter);flex-direction:column}
  .hero{min-height:auto;padding-top:110px}
  .hero-row,.phero-row,.split-2,.qs-in,.dg-in,.cat-in,.where,.contact,.cta-in,.cmp-head{grid-template-columns:1fr}
  .facts{grid-template-columns:1fr}
  .facts li,.facts li+li{padding:16px 0}
  .phero{padding-top:110px}
  .org{grid-template-columns:1fr auto;gap:6px 16px}
  .org-p{grid-column:1}
  .org-logo{grid-row:1/3;grid-column:2}
  .jrn-st{grid-template-columns:1fr;padding-left:54px}
  .jrn-st .jrn-card{grid-column:1!important}
  .jrn-st .jrn-node{left:13px!important;margin-left:0;top:36px}
  .dg-r{position:relative;top:0}
  .rack-in{transform:none}
  .iris{max-height:520px;aspect-ratio:4/4}
  .cat-nav{position:sticky;top:64px;z-index:10;margin:0 calc(var(--gutter) * -1);padding:10px var(--gutter);border-radius:0;transition:top .55s var(--ease)}
  .hdr-off .cat-nav{top:0}
  .cat-nav-t,.cat-nav .btn{display:none}
  .cat-links{display:flex;gap:18px;overflow-x:auto;scrollbar-width:none}
  .cat-links::-webkit-scrollbar{display:none}
  .cat-links a{flex:none;padding:8px 0}
  .grp,.acc-item{scroll-margin-top:140px}
  .fronts{grid-template-columns:1fr}
  .fronts li:first-child,.fronts li:nth-child(4){grid-row:auto;grid-column:auto}
  .fronts a{min-height:0}
  .map-frame{height:360px}
}
@media (max-width:640px){
  body{font-size:16px}
  .row2{grid-template-columns:1fr}
  .dq{grid-template-columns:1fr}
  .tri{justify-self:start}
  .mod-st{display:none}
  .rack-face{padding:12px 26px 18px}
  .rack-face::before{left:9px}.rack-face::after{right:9px}
  .foot-grid{grid-template-columns:1fr}
  .actions .btn{width:100%}
  .wa-float{right:16px;bottom:16px}
  .cmp-tabs{grid-template-columns:1fr}
  .cmp-a,.cmp-b{padding:24px}
  .cmp-c{width:100%;transform:none!important}
  .cmp-b{clip-path:none;display:none}
  .cmp.show-b .cmp-a{display:none}
  .cmp.show-b .cmp-b{display:flex}
  .cmp-h{display:none}
  .cables-wrap{padding:18px}
  .prn-clip{margin:-5px 20px 0}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
  .js .rv{opacity:1;transform:none}
  .js .bl .bl-t{opacity:1}
  .bars{display:none}
  .js .prn-paper{transform:none}
  .js .pp-row b{transform:none}
  .js .pp-l{stroke-dashoffset:0}
  .js .map-frame{clip-path:none}
}

/* ---------- área do cliente (demonstrativa) ---------- */
.top-acc{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.2)}
.top-acc>svg{font-size:1.15em}
.rail-acc{display:none}
.js [data-ac-dash]{display:none}
.js.ac-in [data-ac-dash]{display:block}
.js.ac-in [data-ac-login]{display:none}
.ac-login{position:relative;min-height:100svh;display:flex;align-items:center;padding:clamp(104px,14vh,140px) 0 clamp(44px,5vw,72px);overflow:clip}
.ac-login-in{position:relative;z-index:1;display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(30px,5vw,80px);align-items:center}
.ac-login .hl{font-size:clamp(2.8rem,5.8vw,6.2rem);max-width:12ch}
.ac-feat{list-style:none;margin:30px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;column-gap:24px;max-width:560px;border-top:1.5px solid var(--ink)}
.ac-feat li{padding:14px 0;border-bottom:1px solid var(--line);font-weight:700;color:var(--ink)}
.ac-feat small{display:block;margin-top:2px;font-weight:500;font-size:.9rem;color:var(--muted)}
.ac-form{border-radius:6px 6px 26px 6px;box-shadow:0 40px 80px -50px rgba(7,19,48,.55)}
.ac-form .btn{width:100%}
.fl-pw input{padding-right:90px}
.ac-eye{position:absolute;right:0;bottom:10px;padding:8px 6px;border:0;background:none;cursor:pointer;font:700 .76rem/1 var(--f-body);letter-spacing:.12em;text-transform:uppercase;color:var(--blue)}
.ac-eye:hover{color:var(--orange-dd)}
.ac-help{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px 20px;margin:18px 0 0;font-size:.95rem}
.ac-help a{font-weight:700;color:var(--blue);text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:4px}
.ac-help a:hover{color:var(--orange-dd)}
.ac-demo{margin:22px 0 0;padding-top:16px;border-top:1px dashed var(--line);font-size:.88rem;color:var(--muted)}
.ac-top{padding-bottom:clamp(28px,3vw,44px)}
.ac-hello{display:flex;justify-content:space-between;align-items:flex-end;gap:16px 24px;flex-wrap:wrap}
.ac-hello .hl{margin:0;outline:none}
.ac-hello .btn-line{background:#fff}
.ac-id{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:20px;margin:34px 0 0;border-top:1.5px solid var(--ink)}
.ac-id div{padding:16px 0 4px}
.ac-id dt{font:700 .72rem/1.3 var(--f-body);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.ac-id dd{margin:6px 0 0;font:800 1.55rem/1 var(--f-head);text-transform:uppercase;color:var(--ink);overflow-wrap:anywhere}
.ac-id dd.ok{color:var(--green-d)}
.ac-main{padding-top:0}
.ac-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:clamp(14px,1.6vw,22px);align-items:stretch}
.ac-card{position:relative;overflow:hidden;padding:clamp(24px,3vw,44px);border-radius:14px}
.ac-card>*:not(.fibers){position:relative;z-index:1}
.ac-card h2{font-size:clamp(2rem,3.2vw,3rem);max-width:none}
.ac-plan{grid-column:span 7;display:flex;flex-direction:column;border-radius:6px 6px 30px 6px}
.ac-plan h2{margin-bottom:.15em}
.ac-speed{display:flex;align-items:flex-end;gap:14px;margin:8px 0 22px}
.ac-speed b{font:900 clamp(6rem,12vw,10.5rem)/.8 var(--f-head);letter-spacing:-.01em;color:#fff}
.ac-speed span{padding-bottom:.12em;font:800 clamp(1.8rem,3vw,2.6rem)/.9 var(--f-head);text-transform:uppercase;color:var(--orange)}
.ac-speed small{display:block;margin-top:6px;font:600 .92rem/1.2 var(--f-body);text-transform:none;color:var(--soft)}
.ac-spec{display:flex;flex-wrap:wrap;gap:14px 34px;margin:0 0 28px}
.ac-spec dt{font:700 .7rem/1.3 var(--f-body);letter-spacing:.14em;text-transform:uppercase;color:var(--soft-2)}
.ac-spec dd{margin:4px 0 0;font-weight:700;color:#fff}
.ac-plan-foot{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:18px;margin-top:auto;padding-top:24px;border-top:1px solid rgba(255,255,255,.12)}
.ac-price{margin:0}
.ac-price small{display:block;margin-bottom:6px;font:700 .72rem/1.3 var(--f-body);letter-spacing:.14em;text-transform:uppercase;color:var(--soft-2)}
.ac-price b{font:800 clamp(2.6rem,4.2vw,3.6rem)/.9 var(--f-head);color:#fff}
.ac-price span{margin-left:8px;font-weight:600;color:var(--soft)}
.ac-test{grid-column:span 5;display:flex;flex-direction:column}
.ac-test-c{display:flex;flex-direction:column;flex:1}
.gauge{width:100%;max-width:300px;margin:0 auto 18px}
.gauge svg{width:100%;height:auto;overflow:visible}
.g-tr,.g-fl,.g-lt{fill:none;stroke-linecap:round}
.g-tr{stroke:var(--line);stroke-width:14}
.g-fl{stroke:var(--blue);stroke-width:14;stroke-dasharray:100;stroke-dashoffset:100;opacity:0;transition:stroke-dashoffset 1.8s var(--ease) .2s,opacity .2s .2s}
.ac-test.in .g-fl,html:not(.js) .g-fl{stroke-dashoffset:0;opacity:1}
.g-lt{stroke:var(--sky);stroke-width:4;stroke-dasharray:9 91;filter:drop-shadow(0 0 5px var(--sky));animation:gRun 2.6s linear infinite}
@keyframes gRun{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
.g-v{font:900 64px/1 var(--f-head);fill:var(--ink);text-anchor:middle}
.g-u{font:700 11px/1 var(--f-body);letter-spacing:.16em;text-transform:uppercase;fill:var(--muted);text-anchor:middle}
.ac-tips{list-style:none;margin:0 0 24px;padding:0;font-size:.96rem}
.ac-tips li{padding:10px 0;border-top:1px solid var(--line)}
.ac-tips li:last-child{border-bottom:1px solid var(--line)}
.ac-test .btn{width:100%;margin-top:auto}
.ac-detail{grid-column:span 12;display:grid;grid-template-columns:1fr 1fr;gap:clamp(26px,4vw,64px)}
.ac-ben{list-style:none;margin:8px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;column-gap:24px}
.ac-ben li{padding:13px 0;border-top:1px solid var(--line)}
.ac-ben strong{display:block;color:var(--ink);line-height:1.3}
.ac-ben small{display:block;margin-top:3px;font-size:.9rem;line-height:1.45;color:var(--muted)}
.ac-terms{padding:clamp(20px,2.4vw,32px);border-radius:12px;background:var(--paper)}
.ac-terms dl{margin:0 0 26px}
.ac-terms dl>div{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px 16px;padding:12px 0;border-bottom:1px solid var(--line)}
.ac-terms dt{font-weight:600;color:var(--muted)}
.ac-terms dd{margin:0;font-weight:700;color:var(--ink);text-align:right}
.ac-fid small{flex-basis:100%;font-size:.86rem;color:var(--muted)}
.ac-bar{flex-basis:100%;height:8px;margin:8px 0 0;border-radius:4px;background:#D2D9E6;overflow:hidden}
.ac-bar i{display:block;width:var(--p);height:100%;background:var(--orange);transform-origin:left;transition:transform 1.4s var(--ease) .3s}
.js .ac-detail:not(.in) .ac-bar i{transform:scaleX(0)}
.ac-terms h3{margin:0 0 10px;font-size:1.4rem}
.ac-cond{margin:0;padding:0 0 0 1.1em;font-size:.93rem;color:var(--text)}
.ac-cond li+li{margin-top:8px}
.ac-sched{grid-column:span 5}
.ac-fat{grid-column:span 7}
.ac-act{display:flex;flex-direction:column}
.ac-act>p:not(.kicker){max-width:46ch}
.ac-chips{margin:6px 0 18px}
.ac-chips legend{margin-bottom:10px;font-size:.92rem}
.t-deep .ac-chips legend{color:#fff}
.t-deep .subj span{background:rgba(255,255,255,.07);color:var(--soft)}
.t-deep .subj input:checked+span{background:var(--orange);color:#fff}
.ac-act .btn{width:100%;margin-top:auto}
/* Área do Cliente em destaque no trilho do menu */
.rail-nav a.rn-acc{color:#fff;background:var(--blue);box-shadow:inset 0 0 0 1.5px rgba(91,197,240,.5)}
.rail-nav a.rn-acc:hover,.rail-nav a.rn-acc:focus-visible{background:var(--blue-l)}
.rail-nav a.rn-acc[aria-current]{background:var(--orange);box-shadow:none}
.sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
/* link discreto do WhatsApp */
.wa-lnk{display:inline-flex;align-items:center;gap:8px;width:fit-content;margin-top:16px;padding:4px 0;font-weight:700;font-size:.94rem;color:var(--orange-dd)}
.wa-lnk svg{font-size:1.15em;color:var(--green)}
.wa-lnk span{background:linear-gradient(currentColor,currentColor) 0 100%/0 1.5px no-repeat;transition:background-size .45s var(--ease)}
.wa-lnk:hover span{background-size:100% 1.5px}
.t-deep .wa-lnk{color:var(--soft)}
.t-deep .wa-lnk:hover{color:#fff}
.t-deep .wa-lnk svg{color:#62D691}
.ac-sched .wa-lnk{align-self:center}
/* condições que recolhem */
.ac-cond-h{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px}
.ac-cond-h h3{margin:0}
.ac-tog{display:grid;place-items:center;width:38px;height:38px;border:0;border-radius:9px;background:#fff;color:var(--ink);font-size:18px;cursor:pointer;box-shadow:0 0 0 1px var(--line);transition:background .3s,color .3s}
.ac-tog:hover{background:var(--ink);color:#fff}
.ac-tog svg{transition:transform .45s var(--ease)}
.ac-tog[aria-expanded="false"] svg{transform:rotate(180deg)}
.ac-cond-w{display:grid;grid-template-rows:1fr;transition:grid-template-rows .55s var(--ease)}
.ac-cond-w>div{overflow:hidden}
.ac-cond-w.shut-c{grid-template-rows:0fr}
/* faturas */
.ac-fat{display:flex;flex-direction:column}
.ft-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
.ft-head h2{margin-bottom:.3em}
.ft-exp{flex:none;display:grid;place-items:center;width:46px;height:46px;border:0;border-radius:10px;background:var(--paper);color:var(--ink);font-size:20px;cursor:pointer;transition:background .3s,color .3s,transform .45s var(--ease)}
.ft-exp:hover{background:var(--ink);color:#fff;transform:scale(1.06)}
.ft-sum{display:flex;flex-wrap:wrap;gap:6px 18px;margin:0 0 18px;font-size:.9rem;font-weight:700}
.ft-sum span{display:inline-flex;align-items:center;gap:6px}
.ft-sum svg{font-size:1.1em}
.ft-pago{color:var(--green-d)}
.ft-aberto,.ft-futuro{color:var(--muted)}
.ft-atraso{color:#D93025}
.ft-acts{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px}
.ft-list{list-style:none;margin:0;padding:0 6px 0 0;max-height:418px;overflow:auto;border-top:1.5px solid var(--ink);scrollbar-width:thin;scrollbar-color:var(--soft) transparent}
.ft{display:grid;grid-template-columns:34px 1fr auto 92px;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--line)}
.ft.now{background:linear-gradient(90deg,rgba(254,87,16,.07),transparent 70%)}
.ft-ic{display:grid;place-items:center;width:34px;height:34px;border-radius:8px;font-size:17px}
.ft-ic.ft-pago{background:rgba(35,164,85,.12)}
.ft-ic.ft-aberto,.ft-ic.ft-futuro{background:var(--paper)}
.ft-ic.ft-atraso{background:rgba(217,48,37,.1)}
.ft-m b{display:block;font:800 1.25rem/1 var(--f-head);text-transform:uppercase;color:var(--ink)}
.ft-m small{display:block;margin-top:3px;font-size:.84rem;color:var(--muted)}
.ft-v{font-weight:700;color:var(--ink);white-space:nowrap}
.ft-a{justify-self:end;min-width:88px;padding:9px 12px;border:0;border-radius:8px;background:var(--paper);font:700 .84rem/1 var(--f-body);color:var(--ink);cursor:pointer;transition:background .3s,color .3s}
.ft-a:hover{background:var(--ink);color:#fff}
.ft-a.hot{background:#D93025;color:#fff}
.ft-a.hot:hover{background:#A9221A}
.ac-fat .wa-lnk{margin-top:14px}
/* modal das faturas */
.ft-modal{width:min(980px,calc(100% - 32px));max-width:none;max-height:calc(100dvh - 32px);margin:auto;padding:0;border:0;border-radius:16px;background:#fff;color:var(--text);box-shadow:0 50px 100px -40px rgba(1,12,31,.8);overflow:auto;overscroll-behavior:contain}
.ft-modal::backdrop{background:rgba(1,12,31,.74);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.ft-modal[open]{animation:ftIn .5s var(--ease)}
@keyframes ftIn{from{opacity:0;transform:translateY(26px) scale(.98)}}
body:has(.ft-modal[open]){overflow:hidden}
.has-cursor .ft-modal,.has-cursor .ft-modal *{cursor:auto}
.has-cursor .ft-modal :is(a,button){cursor:pointer}
.ftm-head{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding:22px clamp(18px,3vw,36px) 16px;background:#fff;border-bottom:1px solid var(--line)}
.ftm-head .kicker{margin-bottom:10px}
.ftm-head h2{margin:0;max-width:none;font-size:clamp(1.9rem,3.4vw,2.8rem)}
.ftm-x{flex:none;display:grid;place-items:center;width:46px;height:46px;border:0;border-radius:10px;background:var(--paper);color:var(--ink);font-size:20px;cursor:pointer;transition:background .3s,color .3s}
.ftm-x:hover{background:var(--orange);color:#fff}
.ftm-body{padding:20px clamp(18px,3vw,36px) 30px}
.ftm-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px 20px;margin-bottom:6px}
.ftm-top .ft-sum,.ftm-top .ft-acts{margin-bottom:12px}
.ftm-tb{width:100%;border-collapse:collapse;font-size:.96rem}
.ftm-tb thead th{padding:10px 12px 10px 0;border-bottom:1.5px solid var(--ink);text-align:left;font:700 .72rem/1.3 var(--f-body);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.ftm-tb tbody th,.ftm-tb td{padding:13px 12px 13px 0;border-bottom:1px solid var(--line);text-align:left;vertical-align:middle}
.ftm-tb tbody th{font:800 1.2rem/1 var(--f-head);text-transform:uppercase;color:var(--ink)}
.ftm-tb td:last-child{padding-right:0;text-align:right}
.ftm-tb td small{display:block;font-size:.8rem;color:#D93025}
.ftm-tb tr.now{background:linear-gradient(90deg,rgba(254,87,16,.07),transparent 70%)}
.ftm-st{display:inline-flex;align-items:center;gap:8px;font-weight:700}
.ftm-st svg{font-size:1.1em}
/* fatura gerada */
.ftm-back{margin-bottom:18px}
.ftm-back .i-arrow{transform:rotate(180deg)}
.ftm-back:hover .i-arrow{transform:rotate(180deg) translateX(6px)}
.doc{border:1px solid var(--line);border-radius:6px 6px 22px 6px;overflow:hidden}
.doc-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px 24px;padding:20px clamp(18px,2.6vw,30px);background:var(--navy);color:var(--soft)}
.doc-brand{display:flex;align-items:center;gap:14px}
.doc-brand img{width:58px;height:auto}
.doc-brand b{display:block;font:800 1.3rem/1 var(--f-head);text-transform:uppercase;color:#fff}
.doc-brand small{font-size:.82rem}
.doc-tag{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;background:rgba(255,255,255,.08);font-weight:700;font-size:.9rem;color:#fff}
.doc-tag.ft-pago svg{color:#62D691}
.doc-tag.ft-atraso svg{color:#FF8A80}
.doc-tag.ft-aberto svg,.doc-tag.ft-futuro svg{color:var(--soft-2)}
.doc-main{display:grid;grid-template-columns:1fr 1fr;gap:clamp(20px,3vw,40px);padding:clamp(20px,2.6vw,30px)}
.doc-main .kicker{margin-bottom:8px}
.doc-main h3{margin:0 0 16px;font-size:clamp(2rem,3.4vw,2.8rem)}
.doc-dl{margin:0}
.doc-dl div{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--line)}
.doc-dl dt{color:var(--muted)}
.doc-dl dd{margin:0;font-weight:700;color:var(--ink);text-align:right}
.doc-total{margin:18px 0 0}
.doc-total small{display:block;font:700 .72rem/1.3 var(--f-body);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.doc-total b{font:900 clamp(2.8rem,5vw,4rem)/1 var(--f-head);color:var(--ink)}
.doc-note{margin:12px 0 0;padding:12px 14px;border-radius:9px;background:var(--paper);font-size:.9rem}
.doc-note.ok{background:rgba(35,164,85,.1);color:var(--green-d);font-weight:700}
.doc-note.late{background:rgba(217,48,37,.08);color:#A9221A}
.doc-pay{display:grid;gap:16px;align-content:start}
.doc-box{padding:16px;border-radius:12px;background:var(--paper)}
.doc-box p{margin:0 0 8px;font-weight:700;color:var(--ink)}
.doc-box code{display:block;margin-bottom:12px;font:500 .8rem/1.45 ui-monospace,Consolas,monospace;color:var(--text);overflow-wrap:anywhere}
.doc-bars{display:block;width:100%;height:56px;margin-bottom:10px}
.doc-bars rect{fill:var(--ink)}
.doc-copy{width:100%;min-height:44px;font-size:.86rem}
.doc-copy.done{background:var(--green);--fill:var(--green)}
.doc-acts{display:flex;flex-wrap:wrap;align-items:center;gap:10px 22px;padding:0 clamp(20px,2.6vw,30px) clamp(20px,2.6vw,30px)}
.doc-acts .wa-lnk{margin:0}
.doc-demo{margin:14px 0 0;font-size:.84rem;color:var(--muted)}
@media (max-width:760px){
  .doc-main{grid-template-columns:1fr}
  .ftm-tb thead{display:none}
  .ftm-tb,.ftm-tb tbody{display:block}
  .ftm-tb tr{display:grid;grid-template-columns:1fr auto;gap:6px 12px;padding:14px 0;border-bottom:1px solid var(--line)}
  .ftm-tb tbody th,.ftm-tb td{padding:0;border:0}
  .ftm-tb td[data-l="Vencimento"]{grid-column:1;font-size:.9rem;color:var(--muted)}
  .ftm-tb td[data-l="Vencimento"]::before{content:"Vence em "}
  .ftm-tb td[data-l="Valor"]{grid-row:1;grid-column:2;text-align:right;font-weight:700;color:var(--ink)}
  .ftm-tb td[data-l="Situação"]{grid-column:1;font-size:.9rem}
  .ftm-tb td:last-child{grid-row:2/4;grid-column:2;align-self:center}
}
@media (max-width:480px){
  .ft{grid-template-columns:34px 1fr auto;row-gap:8px}
  .ft-a{grid-column:2/4;justify-self:stretch}
  .ft-acts .btn{flex:1 1 100%}
}
@media print{
  body{padding:0;background:#fff}
  body:has(.ft-modal[open]) *{visibility:hidden}
  .ft-modal[open],.ft-modal[open] *{visibility:visible}
  .ft-modal[open]{position:absolute;inset:0 auto auto 0;width:100%;max-height:none;overflow:visible;box-shadow:none;animation:none}
  .ftm-x,.ftm-back,.doc-acts,.doc-copy,.ftm-list .ft-acts{display:none!important}
  .doc-top{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}
@media (max-width:1080px){
  .ac-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ac-plan,.ac-test,.ac-detail,.ac-sched,.ac-fat{grid-column:span 2}
  .ac-test{display:grid;grid-template-columns:minmax(200px,280px) 1fr;gap:0 clamp(24px,4vw,48px);align-items:center}
  .gauge{margin:0}
  .ac-id{grid-template-columns:1fr 1fr}
}
@media (max-width:920px){
  .rail-acc{display:flex;align-items:center;gap:8px;margin:0 10px 0 auto;padding:10px 12px;border-radius:10px;background:var(--orange);color:#fff;font:700 .74rem/1 var(--f-body);letter-spacing:.1em;text-transform:uppercase}
  .rail-acc svg{width:17px;height:17px}
  .ac-login{min-height:auto;padding-top:110px}
  .ac-login-in,.ac-detail{grid-template-columns:1fr}
}
@media (max-width:700px){
  .ac-grid{grid-template-columns:1fr}
  .ac-plan,.ac-test,.ac-detail,.ac-sched,.ac-fat{grid-column:auto}
  .ac-test{display:flex}
  .gauge{margin:0 auto 18px;max-width:260px}
  .ac-ben{grid-template-columns:1fr}
}
@media (max-width:640px){
  .ac-feat{grid-template-columns:1fr}
  .ac-id dd{font-size:1.3rem}
  .ac-hello .btn{width:100%}
  .ac-plan-foot .btn{width:100%}
  .ac-terms dd{text-align:left}
}
@media (max-width:380px){.rail-acc span{display:none}}
@media (prefers-reduced-motion:reduce){
  .g-lt{animation:none;display:none}
  .g-fl{stroke-dashoffset:0}
  .js .ac-detail:not(.in) .ac-bar i{transform:none}
}

/* ---------- equipe (Quem somos): cartões em escada, retrato com fios de luz, formação em cabos ---------- */
.team-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px 40px;flex-wrap:wrap}
.team-head h2{margin:0}
.team-lead{max-width:38ch;margin:0;font-size:1.06rem}
.team-grid{list-style:none;margin:0;padding:0 0 56px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(14px,1.6vw,22px)}
.a-o{--ac:var(--orange)}.a-b{--ac:#4F7FD6}.a-l{--ac:var(--sky)}.a-s{--ac:#9FE0FA}
.fx{display:flex;flex-direction:column;background:#fff;border-radius:6px 6px 22px 6px;overflow:hidden;box-shadow:0 30px 60px -48px rgba(7,19,48,.55);transition:box-shadow .6s var(--ease),opacity .9s var(--ease),transform 1.1s var(--ease)}
.fx:nth-child(even){margin:56px 0 -56px}
.fx:hover{box-shadow:0 50px 80px -46px rgba(7,19,48,.6)}
.fx-pic{position:relative;margin:0;aspect-ratio:4/4.6;overflow:hidden;background:radial-gradient(90% 70% at 85% 10%,color-mix(in srgb,var(--ac) 30%,transparent),transparent 60%),var(--navy);isolation:isolate}
.fx-pic img{position:absolute;left:0;right:0;bottom:0;width:100%;height:auto;aspect-ratio:1;object-fit:cover;z-index:0;transform-origin:50% 100%;-webkit-mask-image:linear-gradient(transparent,#000 24%);mask-image:linear-gradient(transparent,#000 24%);transition:transform 1.2s var(--ease)}
.fx:hover .fx-pic img{transform:scale(1.05)}
.fx-fios{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none}
.fx-pic img~figcaption{z-index:3}
.fx-pic:has(img) .fx-fios{-webkit-mask-image:linear-gradient(#000 12%,transparent 34%);mask-image:linear-gradient(#000 12%,transparent 34%)}
.fx-fios path{fill:none;vector-effect:non-scaling-stroke}
.fx-fios .fb{stroke:rgba(143,163,201,.22);stroke-width:1.2}
.fx-fios .fp{stroke:var(--ac);stroke-width:2.4;stroke-linecap:round;stroke-dasharray:14 86;stroke-dashoffset:calc(var(--k) * 33);filter:drop-shadow(0 0 5px var(--ac));animation:cab 5.5s linear infinite;animation-delay:calc(var(--k) * -1.7s)}
.fx-fios .fp:nth-of-type(2){stroke:var(--orange);filter:drop-shadow(0 0 5px var(--orange));animation-duration:7s}
.fx:hover .fx-fios .fp{animation-duration:2.2s}
.fx-ini{position:absolute;left:clamp(16px,1.6vw,24px);bottom:42px;z-index:2;font:800 clamp(6rem,10vw,9rem)/.8 var(--f-head);letter-spacing:-.01em;color:transparent;-webkit-text-stroke:2px rgba(255,255,255,.85);transition:color .6s var(--ease),transform .8s var(--ease)}
.fx:hover .fx-ini{color:#fff;transform:translateY(-6px)}
.fx-pic figcaption{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:12px clamp(16px,1.6vw,24px);background:linear-gradient(90deg,var(--ac) 0 6px,rgba(1,12,31,.72) 6px);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font:700 .76rem/1.3 var(--f-body);letter-spacing:.14em;text-transform:uppercase}
.fx-body{display:flex;flex-direction:column;flex:1;padding:22px clamp(16px,1.6vw,24px) 22px}
.fx-body h3{margin:0 0 18px;font-size:clamp(1.9rem,2.4vw,2.3rem);line-height:.92}
.fx-edu{list-style:none;margin:0 0 24px;padding:0}
.fx-edu li{position:relative;padding:11px 0 12px;border-top:1px solid var(--line);color:var(--ink);font-weight:500;line-height:1.38;overflow:hidden}
.fx-edu li:last-child{border-bottom:1px solid var(--line)}
.fx-edu small{display:block;margin-bottom:3px;font:700 .7rem/1.3 var(--f-body);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.fx-edu li.now small{color:var(--orange-dd)}
/* curso em andamento: um pulso de luz corre pelo cabo */
.fx-edu li.now::before{content:"";position:absolute;top:-1px;left:0;width:34%;height:2px;background:linear-gradient(90deg,transparent,var(--orange),transparent);animation:fxPulse 2.6s var(--ease-io) infinite}
@keyframes fxPulse{from{transform:translateX(-100%)}to{transform:translateX(300%)}}
.fx-btn{width:100%;margin-top:auto;min-height:52px;padding:0 16px;font-size:.92rem}
@media (max-width:1180px){
  .team-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .fx:nth-child(even){margin:40px 0 -40px}
}
@media (max-width:640px){
  .team-grid{grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:84%;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(var(--gutter) * -1);padding:8px var(--gutter) 30px;scroll-padding-left:var(--gutter);scrollbar-width:none}
  .team-grid::-webkit-scrollbar{display:none}
  .fx{scroll-snap-align:start}
  .fx:nth-child(even){margin:0}
}
@media (prefers-reduced-motion:reduce){
  .fx-fios .fp,.fx-edu li.now::before{animation:none}
  .fx-ini,.fx-pic img{transition:none}
}
`;
module.exports = { css };
