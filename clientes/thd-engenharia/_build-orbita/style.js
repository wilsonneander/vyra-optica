// CSS do modelo "Órbita" (THD Engenharia, segundo modelo premium).
// Cores do site original: laranja #FE5710, azul #1A3B87, azul do logo #2B5AA8, azul-céu dos anéis #5BC5F0, marinho #021430.
// Fontes: Unbounded (larga e arredondada como as letras do logo) nos títulos e Hanken Grotesk no texto.

const css = `/* THD Engenharia, modelo Órbita. Gerado por _build-orbita/build.js (edite _build-orbita/style.js) */
:root{
  --orange:#FE5710; --orange-d:#DE4706; --orange-dd:#B93A05; --blue:#1A3B87; --blue-l:#2B5AA8; --sky:#5BC5F0;
  --navy:#021430; --deep:#061A3D; --night:#010C1F; --green:#23A455; --green-d:#1A8A45;
  --ink:#071330; --text:#3A4560; --muted:#66708A; --line:#D9E0EC; --paper:#F3F5F9; --soft:#B9C5DC; --soft-2:#8FA3C9;
  --f-head:"Unbounded","Arial Black",Arial,sans-serif; --f-body:"Hanken Grotesk",Arial,sans-serif;
  --container:1240px; --gutter:clamp(16px,4vw,44px); --hdr:84px;
  --ease:cubic-bezier(.16,1,.3,1); --ease-io:cubic-bezier(.76,0,.24,1);
}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:100px;-webkit-text-size-adjust:100%;scrollbar-color:var(--orange) var(--night)}
html::-webkit-scrollbar{width:12px}
html::-webkit-scrollbar-track{background:var(--night)}
html::-webkit-scrollbar-thumb{background:linear-gradient(var(--orange),var(--sky));border:3px solid var(--night);border-radius:8px}
body{margin:0;font:400 17px/1.65 var(--f-body);color:var(--soft);background:var(--navy);-webkit-font-smoothing:antialiased;overflow-x:hidden;overflow-x:clip}
img{max-width:100%;height:auto;display:block}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit}
svg{width:1em;height:1em;flex:none}
h1,h2,h3{font-family:var(--f-head);color:#fff;line-height:1.08;margin:0 0 .55em;letter-spacing:-.035em;font-weight:600}
h1{font-size:clamp(2.1rem,4.7vw,4.15rem)}
h2{font-size:clamp(1.65rem,3.2vw,2.75rem);max-width:22ch}
h3{font-size:1.15rem;letter-spacing:-.02em;line-height:1.25}
h1 em,h2 em{font-style:normal;color:var(--orange)}
p{margin:0 0 1em}
strong{color:inherit}
::selection{background:var(--orange);color:#fff}
:focus-visible{outline:3px solid var(--orange);outline-offset:3px}
.container{width:100%;max-width:var(--container);margin:0 auto;padding:0 var(--gutter)}
.skip{position:absolute;left:-10000px;top:8px;z-index:400;background:var(--orange);color:#fff;padding:10px 16px}
.skip:focus{left:8px}
main{position:relative;z-index:1}

/* tons de seção */
.t-dark{background:transparent}
.t-deep{background:rgba(6,26,61,.9)}
.t-light{background:var(--paper);color:var(--text)}
.t-light h1,.t-light h2,.t-light h3{color:var(--ink)}
.t-orange{background:var(--orange);color:#fff}
.t-orange h2{color:#fff}

/* céu de fundo: canvas fixo com nós e conexões (aparece nas seções escuras) */
.sky{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}

/* texto de apoio acima do título: texto simples, sem traço, sem caixa */
.kicker{display:block;font:500 .86rem/1.3 var(--f-head);letter-spacing:-.01em;color:var(--orange);margin:0 0 20px}
.t-orange .kicker{color:#fff;opacity:.9}
.lead{font-size:clamp(1.05rem,1.45vw,1.2rem);line-height:1.6;color:#C6D1E5;max-width:54ch}

/* rolagem de letras no hover */
.roll{display:inline-grid;overflow:hidden;line-height:1.25;vertical-align:middle}
.roll>span{grid-area:1/1;transition:transform .55s var(--ease)}
.roll>span+span{transform:translateY(115%)}
a:hover>.roll>span:first-child,button:hover>.roll>span:first-child,a:focus-visible>.roll>span:first-child{transform:translateY(-115%)}
a:hover>.roll>span+span,button:hover>.roll>span+span,a:focus-visible>.roll>span+span{transform:none}

/* ---------- botões: preenchimento circular que nasce de onde o mouse entra ---------- */
.btn{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:58px;padding:16px 26px;border-radius:16px;font:700 .98rem/1 var(--f-body);letter-spacing:.005em;border:1.5px solid transparent;cursor:pointer;white-space:nowrap;transition:color .45s,border-color .45s,box-shadow .45s,transform .45s var(--ease)}
.btn:has(.b-ar){padding:9px 9px 9px 24px}
.btn::before{content:"";position:absolute;z-index:-1;left:var(--bx,50%);top:var(--by,50%);width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:var(--fill,#fff);transform:scale(0);transition:transform .7s var(--ease)}
.btn:hover::before,.btn:focus-visible::before{transform:scale(48)}
.btn>svg{font-size:1.25em}
.b-ar{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,.18);transition:transform .55s var(--ease),background .4s}
.btn:hover .b-ar{transform:rotate(-45deg);background:rgba(255,255,255,.26)}
.btn-sm{min-height:46px;font-size:.88rem;padding:12px 18px}
.btn-sm:has(.b-ar){padding:6px 6px 6px 18px}
.btn-sm .b-ar{width:34px;height:34px;border-radius:10px}
.btn-lg{min-height:66px;font-size:1.05rem;padding:20px 30px}
.btn-o{background:var(--orange);color:#fff;--fill:var(--navy)}
.btn-o:hover{box-shadow:0 22px 40px -18px rgba(254,87,16,.9)}
.t-dark .btn-o,.t-deep .btn-o,.hdr .btn-o{--fill:#fff}
.t-dark .btn-o:hover,.t-deep .btn-o:hover,.hdr .btn-o:hover{color:var(--navy)}
.t-dark .btn-o:hover .b-ar,.t-deep .btn-o:hover .b-ar,.hdr .btn-o:hover .b-ar{background:var(--orange);color:#fff}
.btn-w{background:var(--green);color:#fff;--fill:var(--green-d)}
.btn-w:hover{box-shadow:0 22px 40px -18px rgba(35,164,85,.9)}
.btn-ghost{border-color:rgba(255,255,255,.28);color:#fff;--fill:#fff;background:rgba(255,255,255,.03)}
.btn-ghost:hover{color:var(--navy);border-color:#fff}
.btn-ghost:hover .b-ar{background:var(--navy);color:#fff}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:34px}
.link-arrow{display:inline-flex;align-items:center;gap:10px;font:700 .98rem/1.2 var(--f-body);color:inherit;padding:6px 0;background:none;border:0;cursor:pointer;background-image:linear-gradient(var(--orange),var(--orange));background-position:0 100%;background-size:0 2px;background-repeat:no-repeat;transition:background-size .5s var(--ease),color .3s}
.link-arrow:hover{background-size:100% 2px}
.t-light .link-arrow{color:var(--ink)}
.link-arrow .i-arrow{transition:transform .45s var(--ease)}
.link-arrow:hover .i-arrow{transform:translateX(6px)}
.t-orange .link-arrow{background-image:linear-gradient(#fff,#fff)}

/* ---------- entrada ---------- */
@keyframes up{from{opacity:0;transform:translateY(34px);filter:blur(6px)}}
@keyframes wUp{from{transform:translateY(110%) rotateX(-75deg)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes rowIn{from{opacity:0;transform:translateY(16px)}}
@keyframes fadeIn{from{opacity:0}}
.js .up{animation:up 1.1s var(--ease) both;animation-delay:calc(var(--d,0s) + var(--ed,0s))}
.enter{--ed:.5s}
.split .w{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .02em .1em;margin:0 -.02em -.1em;perspective:700px}
.split .w>span{display:inline-block;transform-origin:50% 100%}
.js h1.split .w>span{animation:wUp 1.2s var(--ease) both;animation-delay:calc(.2s + var(--i) * 70ms + var(--ed,0s))}
.js .split:not(h1) .w>span{transform:translateY(110%) rotateX(-75deg);transition:transform 1.15s var(--ease);transition-delay:calc(var(--i) * 50ms)}
.js .split:not(h1).in .w>span{transform:none}
.js .rv{opacity:0;transform:translateY(42px);filter:blur(5px);transition:opacity .9s var(--ease),transform 1.1s var(--ease),filter .9s var(--ease);transition-delay:calc(var(--d,0) * 110ms)}
.js .rv.in{opacity:1;transform:none;filter:none}

/* lâminas: cada seção sobe como uma placa de cantos arredondados e se abre com a rolagem */
.sheet{position:relative}
.js .sheet:not(.full){clip-path:inset(calc((1 - var(--p,1)) * 16vh) calc((1 - var(--p,1)) * 5vw) 0 round calc((1 - var(--p,1)) * 64px) calc((1 - var(--p,1)) * 64px) 0 0)}
.js .sheet>.container{transform:translate3d(0,calc((1 - var(--p,1)) * 90px),0)}

/* fundos animados das seções */
.bg-orbits{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.9}
.bg-orbits ellipse{fill:none;stroke:rgba(91,197,240,.13);stroke-width:1.2;vector-effect:non-scaling-stroke}
.bg-orbits .bo-c ellipse{stroke:rgba(254,87,16,.1);stroke-dasharray:3 9}
.bg-orbits g{transform-box:view-box;transform-origin:50% 50%}
.bg-orbits .bo-a{animation:spin 70s linear infinite}
.bg-orbits .bo-b{animation:spin 90s linear infinite reverse}
.bg-orbits .bo-c{animation:spin 120s linear infinite}
.bo-s{fill:var(--sky)}
.bo-s.o{fill:var(--orange)}
.bg-grid{position:absolute;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(26,59,135,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(26,59,135,.07) 1px,transparent 1px);background-size:68px 68px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 40%,#000 25%,transparent 80%);mask-image:radial-gradient(ellipse 80% 70% at 50% 40%,#000 25%,transparent 80%);animation:gridMove 22s linear infinite}
.bg-grid::after{content:"";position:absolute;inset:0;background:radial-gradient(420px circle at var(--mx,50%) var(--my,30%),rgba(254,87,16,.09),transparent 70%)}
@keyframes gridMove{to{background-position:68px 68px,68px 68px}}
.sec{position:relative;padding:clamp(52px,5.5vw,88px) 0;overflow:clip}
.sec>.container,.selos>.container,.diag-sec>.container,.cta>.container{position:relative;z-index:1}
.head{margin-bottom:clamp(24px,3vw,40px)}

/* ---------- cursor: ponto + órbita que estica na direção do movimento ---------- */
.cursor{position:fixed;left:0;top:0;z-index:300;pointer-events:none;opacity:0;transition:opacity .3s}
.has-cursor .cursor{opacity:1}
.c-dot{position:fixed;left:-4px;top:-4px;width:8px;height:8px;border-radius:50%;background:var(--orange)}
.c-ring{position:fixed;left:-21px;top:-21px;width:42px;height:42px;display:grid;place-items:center}
.c-ring::before{content:"";position:absolute;inset:0;border-radius:50%;border:1.5px solid rgba(91,197,240,.85);transform:rotate(var(--ca,0deg)) scaleX(var(--cs,1));transition:inset .45s var(--ease),background .3s,border-color .3s}
.c-ring.hover::before{inset:-12px;background:rgba(254,87,16,.12);border-color:var(--orange)}
.c-ring.text::before{inset:-28px;background:var(--orange);border-color:var(--orange)}
.c-ring span{position:relative;font:700 .74rem var(--f-body);color:#fff;opacity:0;transition:opacity .25s;white-space:nowrap}
.c-ring.text span{opacity:1}
.has-cursor,.has-cursor a,.has-cursor button,.has-cursor label{cursor:none}

/* ---------- transição entre páginas: círculo laranja com os anéis do logo ---------- */
.warp{position:fixed;inset:0;z-index:250;pointer-events:none;background:var(--orange);perspective:900px;clip-path:circle(0 at var(--wx,50%) var(--wy,50%));transition:clip-path .75s var(--ease-io)}
.warp.cover{clip-path:circle(150% at var(--wx,50%) var(--wy,50%));pointer-events:auto}
.enter .warp{clip-path:circle(150% at 50% 50%);animation:warpOut .95s var(--ease-io) .1s forwards}
@keyframes warpOut{to{clip-path:circle(0 at 50% 50%)}}
.warp i{position:absolute;left:50%;top:50%;width:44vmin;height:44vmin;margin:-22vmin 0 0 -22vmin;border-radius:50%;border:4px solid #fff}
.warp-o{transform:rotateZ(-22deg) rotateY(66deg);animation:warpSpin 1.6s linear infinite}
.warp-s{border-color:var(--navy)!important;width:60vmin!important;height:60vmin!important;margin:-30vmin 0 0 -30vmin!important;transform:rotateZ(8deg) rotateX(72deg)}
@keyframes warpSpin{to{transform:rotateZ(338deg) rotateY(66deg)}}

/* ---------- cabeçalho ---------- */
.hdr{position:fixed;inset:0 0 auto;z-index:60;height:var(--hdr);color:#fff;transition:transform .6s var(--ease),background .4s,height .4s,box-shadow .4s}
.hdr-in{max-width:1420px;height:100%;margin:0 auto;display:flex;align-items:center;gap:24px;padding:0 var(--gutter)}
.brand img{height:44px;width:auto;transition:transform .5s var(--ease)}
.brand:hover img{transform:rotate(-4deg) scale(1.04)}
.nav{position:relative;margin:0 auto;display:flex;gap:2px;padding:6px;border-radius:18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.11);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);transition:background .4s,border-color .4s}
.nav a{position:relative;z-index:1;padding:10px 16px;border-radius:12px;font:600 .9rem/1.2 var(--f-body);color:#D3DCEC;transition:color .35s}
.nav a.hot{color:#fff}
.nav-ind{position:absolute;z-index:0;left:0;top:6px;bottom:6px;width:0;border-radius:12px;background:var(--orange);box-shadow:0 10px 24px -10px rgba(254,87,16,.9);transition:transform .55s var(--ease),width .55s var(--ease),opacity .3s}
.hdr.scrolled{height:70px;background:rgba(2,20,48,.74);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 1px 0 rgba(255,255,255,.06)}
.hdr.hide{transform:translateY(-105%)}
.hdr.light{color:var(--ink)}
.hdr.light .nav{background:rgba(7,19,48,.05);border-color:rgba(7,19,48,.1)}
.hdr.light .nav a{color:var(--text)}
.hdr.light .nav a.hot{color:#fff}
.hdr.light.scrolled{background:rgba(243,245,249,.8);box-shadow:0 1px 0 rgba(7,19,48,.08)}
.hdr.light .menu-btn{background:rgba(7,19,48,.06);border-color:rgba(7,19,48,.12)}
.menu-btn{display:none;position:relative;width:50px;height:50px;margin-left:auto;border-radius:15px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);cursor:pointer}
.menu-btn span{position:absolute;left:15px;right:15px;height:2px;background:currentColor;border-radius:2px;transition:transform .5s var(--ease)}
.menu-btn span:first-child{top:20px}
.menu-btn span+span{top:28px}
.menu-open .hdr{color:#fff!important}
.menu-open .menu-btn span:first-child{transform:translateY(4px) rotate(45deg)}
.menu-open .menu-btn span+span{transform:translateY(-4px) rotate(-45deg)}
.mmenu{position:fixed;inset:0;z-index:58;background:var(--navy);display:flex;flex-direction:column;justify-content:center;padding:110px var(--gutter) 40px;overflow:hidden;visibility:hidden;clip-path:circle(0 at calc(100% - 50px) 42px);transition:clip-path .85s var(--ease-io),visibility 0s .85s}
.mmenu.open{visibility:visible;clip-path:circle(150% at calc(100% - 50px) 42px);transition:clip-path .85s var(--ease-io),visibility 0s}
.mmenu nav{position:relative;z-index:1;display:grid;gap:4px}
.mmenu nav a{font:600 clamp(1.9rem,8.5vw,3.3rem)/1.18 var(--f-head);letter-spacing:-.04em;color:#fff;opacity:0;transform:translateY(40px) rotate(3deg);transform-origin:left;transition:opacity .6s var(--ease),transform .8s var(--ease),color .3s;transition-delay:calc(var(--i) * 60ms + .2s)}
.mmenu.open nav a{opacity:1;transform:none}
.mmenu nav a[aria-current]{color:var(--orange)}
.mmenu-foot{position:relative;z-index:1;display:grid;gap:8px;margin-top:44px;color:var(--soft-2)}
.mm-orb{position:absolute!important;right:-38%;bottom:-24%;width:120vw!important;max-width:none!important;opacity:.4}
body.menu-open{overflow:hidden}

/* ---------- giroscópio 3D (anéis do logo) ---------- */
.orb{position:relative;width:min(600px,100%);aspect-ratio:1;perspective:1500px;margin:0 auto}
.orb-rig{position:absolute;inset:0;transform-style:preserve-3d;transform:rotateX(calc(var(--tx,0) * 1deg)) rotateY(calc(var(--ty,0) * 1deg)) rotateZ(calc(var(--sr,0) * 1deg));transition:transform 1s var(--ease)}
.planet{position:absolute;inset:27%;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 34% 30%,#3D74CC 0,#1A3B87 36%,#0A2559 66%,#021430 100%);box-shadow:inset -34px -44px 80px rgba(0,0,0,.55),inset 14px 16px 44px rgba(91,197,240,.28),0 40px 90px -30px rgba(0,0,0,.7);transform:rotateZ(calc(var(--sr,0) * -1deg)) rotateY(calc(var(--ty,0) * -1deg)) rotateX(calc(var(--tx,0) * -1deg));transition:transform 1s var(--ease)}
.planet img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55;mix-blend-mode:luminosity;animation:drift 34s ease-in-out infinite alternate}
@keyframes drift{from{transform:scale(1.35) translateX(-8%)}to{transform:scale(1.35) translateX(8%)}}
.shine{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 30% 25%,rgba(255,255,255,.38),transparent 38%),radial-gradient(circle at 72% 82%,rgba(254,87,16,.32),transparent 46%)}
.ring{position:absolute;inset:var(--in,8%);transform-style:preserve-3d;transform:rotateZ(var(--rz,0deg)) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))}
.ring-in{position:absolute;inset:0;border-radius:50%;border:var(--bw,1.5px) var(--bs,solid) var(--c,rgba(255,255,255,.2));transform-style:preserve-3d;animation:spin var(--sp,20s) linear infinite var(--dir,normal)}
.r-o{--c:var(--orange);--bw:5px;--in:5%;--rz:-22deg;--ry:68deg;--sp:13s}
.r-s{--c:var(--sky);--bw:5px;--in:-2%;--rz:7deg;--rx:73deg;--sp:17s;--dir:reverse}
.r-a{--c:rgba(255,255,255,.2);--in:9%;--rx:58deg;--ry:-38deg;--sp:24s}
.r-b{--c:rgba(91,197,240,.55);--bs:dashed;--in:16%;--ry:-52deg;--rx:24deg;--sp:20s;--dir:reverse}
.r-d{--c:rgba(254,87,16,.4);--bs:dashed;--in:-9%;--rx:80deg;--rz:-40deg;--sp:44s}
.sat{position:absolute;left:50%;top:0;width:15px;height:15px;margin:-8px 0 0 -8px;border-radius:4px;background:var(--c);box-shadow:0 0 22px var(--c)}
.sat-2{top:auto;bottom:0;width:10px;height:10px;margin:0 0 -6px -5px;background:#fff;box-shadow:0 0 16px #fff}
.orb-glow{position:absolute;inset:18%;z-index:-1;border-radius:50%;background:radial-gradient(closest-side,rgba(43,90,168,.55),transparent);filter:blur(30px)}
.orb-line .orb-glow{display:none}
.js .orb .ring{animation:ringIn 1.8s var(--ease) both;animation-delay:calc(.25s + var(--ed,0s))}
.js .orb .ring:nth-child(3){animation-delay:calc(.37s + var(--ed,0s))}
.js .orb .ring:nth-child(4){animation-delay:calc(.49s + var(--ed,0s))}
.js .orb .ring:nth-child(5){animation-delay:calc(.61s + var(--ed,0s))}
.js .orb .ring:nth-child(6){animation-delay:calc(.73s + var(--ed,0s))}
.js .orb .planet{animation:planetIn 1.6s var(--ease) both;animation-delay:calc(.1s + var(--ed,0s))}
@keyframes ringIn{from{scale:.25;opacity:0}}
@keyframes planetIn{from{scale:.5;opacity:0}}

/* ---------- topo da home ---------- */
.hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:center;padding:calc(var(--hdr) + 36px) 0 36px;overflow:clip}
.hero-in{position:relative;z-index:1;display:grid;grid-template-columns:1.05fr .95fr;gap:30px;align-items:center}
.hero-text{will-change:transform}
.hero-vis{position:relative}
.hero-orb{width:min(620px,112%);margin-right:-6%}
.facts-wrap{position:relative;z-index:1}
.facts{position:relative;z-index:1;list-style:none;display:grid;grid-template-columns:repeat(3,1fr);margin-top:clamp(30px,5vh,60px);margin-bottom:0;padding-top:0}
.facts li{padding:22px 24px 0 0;border-top:1px solid rgba(255,255,255,.12);font-size:.95rem;color:var(--soft-2)}
.facts li+li{padding-left:24px;border-left:1px solid rgba(255,255,255,.12)}
.facts strong{display:block;margin-bottom:6px;font:600 .98rem/1.3 var(--f-head);letter-spacing:-.02em;color:#fff}

/* topo das páginas internas */
.phero{position:relative;min-height:min(72svh,680px);display:flex;align-items:center;padding:calc(var(--hdr) + 36px) 0 52px;overflow:clip}
.phero-in{position:relative;z-index:1;display:grid;grid-template-columns:1.15fr .85fr;gap:40px;align-items:center}
.phero h1{font-size:clamp(2.2rem,5.2vw,4.5rem);max-width:15ch}
.phero-orb{width:min(470px,100%)}
.crumbs{display:flex;gap:10px;font-size:.9rem;color:var(--soft-2);margin-bottom:28px}
.crumbs a{transition:color .3s}
.crumbs a:hover{color:#fff}

/* ---------- órgãos reguladores: placas que giram ---------- */
.selos{position:relative;padding:clamp(52px,5.5vw,88px) 0}
.selos-head{margin-bottom:clamp(30px,4vw,54px)}
.wall{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.wall li:nth-child(1),.wall li:nth-child(5){grid-column:span 2}
.flip{perspective:1100px}
.flip-in{position:relative;display:block;width:100%;height:190px;padding:0;border:0;background:none;cursor:pointer;transform-style:preserve-3d;transition:transform 1s var(--ease)}
.flip.on .flip-in{transform:rotateY(180deg)}
.fc{position:absolute;inset:0;display:grid;place-items:center;border-radius:24px;-webkit-backface-visibility:hidden;backface-visibility:hidden}
.fc-f{background:#fff;border:1px solid var(--line);box-shadow:0 30px 50px -38px rgba(7,19,48,.45)}
.fc-f img{height:calc(var(--h) * .82);width:auto;max-width:72%;object-fit:contain;-webkit-user-select:none;user-select:none}
.fc-b{transform:rotateY(180deg);background:var(--blue);color:#C9D6F0;align-content:center;gap:8px;padding:22px;text-align:center;font-size:.95rem;line-height:1.45}
.fc-b strong{display:block;font:600 1.2rem var(--f-head);letter-spacing:-.02em;color:#fff}
.t-deep .fc-b{background:var(--orange);color:#FFE6DA}
.selos-note{margin:26px 0 0;font-size:.82rem;color:var(--muted);max-width:70ch}
.t-deep .selos-note{color:var(--soft-2)}

/* ---------- pilha de camadas 3D ---------- */
.stack{position:relative;height:clamp(300px,44vh,460px);perspective:1800px;--sz:250px}
.stack-in{position:absolute;left:50%;top:54%;width:var(--sz);height:var(--sz);margin:calc(var(--sz) / -2) 0 0 calc(var(--sz) / -2);transform-style:preserve-3d;transform:rotateX(58deg) rotateZ(calc(-42deg + var(--sp,0) * 26deg))}
.stack-in::before{content:"";position:absolute;inset:-18%;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.5),transparent);transform:translateZ(-30px)}
.plate{position:absolute;inset:0;transform-style:preserve-3d;transform:translateZ(calc(var(--i) * var(--gap,48px)));transition:transform .9s var(--ease)}
.plate.on{transform:translateZ(calc(var(--i) * var(--gap,48px) + 34px))}
.pl-top{position:absolute;inset:0;display:flex;align-items:flex-end;padding:18px;border-radius:6px;background:rgba(43,90,168,.32);border:1.5px solid rgba(91,197,240,.6);cursor:pointer;transition:background .6s,border-color .6s,box-shadow .6s}
.pl-top span{font:600 .92rem/1.2 var(--f-head);letter-spacing:-.02em;color:#fff;opacity:.7;transition:opacity .4s}
.pl-a,.pl-b{position:absolute;transition:background .6s}
.pl-a{left:0;bottom:0;width:100%;height:14px;transform-origin:bottom;transform:rotateX(90deg);background:rgba(26,59,135,.92)}
.pl-b{left:0;top:0;width:14px;height:100%;transform-origin:left;transform:rotateY(90deg);background:rgba(10,37,82,.96)}
.plate.on .pl-top{background:var(--orange);border-color:#FF8A57;box-shadow:0 0 60px rgba(254,87,16,.55)}
.plate.on .pl-top span{opacity:1}
.plate.on .pl-a{background:var(--orange-d)}
.plate.on .pl-b{background:var(--orange-dd)}
.t-light .pl-top{background:rgba(255,255,255,.82);border-color:rgba(26,59,135,.28)}
.t-light .pl-top span{color:var(--ink)}
.t-light .pl-a{background:#C9D4E8}
.t-light .pl-b{background:#AEBEDB}
.t-light .stack-in::before{background:radial-gradient(closest-side,rgba(7,19,48,.18),transparent)}
.t-light .plate.on .pl-top span{color:#fff}
.stack-mini{--sz:112px;--gap:20px;height:170px}
.stack-mini .pl-top span{display:none}
.stack-mini .plate.on{transform:translateZ(calc(var(--i) * var(--gap) + 16px))}
.stack-mini .pl-a,.stack-mini .pl-b{height:8px}
.stack-mini .pl-b{width:8px;height:100%}
.stack-grp{--sz:190px;--gap:36px;height:300px;margin-top:20px}
.stack-grp .pl-top span{display:none}
.stack-grp .stack-in{animation:stackSpin 26s linear infinite}
@keyframes stackSpin{from{transform:rotateX(58deg) rotateZ(-42deg)}to{transform:rotateX(58deg) rotateZ(318deg)}}

/* serviços da home: seção presa na rolagem, a pilha sobe uma camada por frente */
.stk{position:relative;height:calc(var(--n) * 58vh + 70vh)}
.stk-sticky{position:sticky;top:0;height:100vh;display:flex;align-items:center;overflow:hidden;padding-top:60px}
.stk-sticky>.container{position:relative;z-index:1}
.head-row{display:flex;justify-content:space-between;align-items:flex-end;gap:20px 30px;flex-wrap:wrap;margin-bottom:clamp(14px,3vh,36px)}
.head-row h2{margin:0}
.stk-grid{display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(30px,5vw,80px);align-items:center}
.stk-tabs{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:6px}
.stk-tab{padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:var(--soft);font:600 .84rem/1.2 var(--f-body);cursor:pointer;transition:background .4s,border-color .4s,color .4s,transform .4s var(--ease)}
.stk-tab:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.3)}
.stk-tab[aria-selected=true]{background:var(--orange);border-color:var(--orange);color:#fff}
.stk-panels{display:grid}
.stk-panel{grid-area:1/1;opacity:0;visibility:hidden;transform:translateY(30px);transition:opacity .5s,transform .8s var(--ease),visibility 0s .8s}
.stk-panel.on{opacity:1;visibility:visible;transform:none;transition:opacity .6s .1s,transform .8s var(--ease) .1s,visibility 0s}
.stk-panel h3{font-size:clamp(1.25rem,2vw,1.6rem);margin-bottom:.3em}
.stk-sum{color:var(--soft-2);margin-bottom:22px}
.srows{display:grid;gap:10px}
.stk-panel.on .srow{animation:rowIn .7s var(--ease) both;animation-delay:calc(var(--k) * 70ms + .15s)}
.srow{position:relative;isolation:isolate;overflow:hidden;display:flex;align-items:center;gap:18px;padding:17px 18px 17px 22px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);transition:border-color .4s,transform .55s var(--ease)}
.srow::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(100deg,rgba(254,87,16,.22),rgba(254,87,16,0) 70%);transform:translateX(-101%);transition:transform .7s var(--ease)}
.srow:hover{transform:translateX(8px);border-color:rgba(254,87,16,.6)}
.srow:hover::before{transform:none}
.srow-t strong{display:block;font:600 .98rem/1.3 var(--f-head);letter-spacing:-.02em;color:#fff}
.srow-t small{display:block;margin-top:4px;font-size:.92rem;color:var(--soft-2)}
.go{display:grid;place-items:center;flex:none;width:42px;height:42px;margin-left:auto;border-radius:12px;background:rgba(255,255,255,.08);color:#fff;transition:transform .55s var(--ease),background .4s}
.srow:hover .go{background:var(--orange);transform:rotate(-45deg)}
.srow-cta{background:rgba(35,164,85,.1);border-color:rgba(35,164,85,.4)}
.srow-cta::before{background:linear-gradient(100deg,rgba(35,164,85,.25),rgba(35,164,85,0) 70%)}
.srow-cta:hover{border-color:var(--green)}
.srow-cta:hover .go{background:var(--green);transform:scale(1.08)}

/* ---------- jornada: trilho horizontal preso na rolagem ---------- */
.jr{position:relative;height:calc(var(--n) * 52vh + 70vh)}
.jr-sticky{position:sticky;top:0;height:100vh;overflow:hidden;display:flex;flex-direction:column;justify-content:center;padding-top:60px}
.jr-head{position:relative;z-index:1;margin-bottom:clamp(26px,5vh,60px)}
.jr-head h2{margin:0}
.jr-view{position:relative;z-index:1}
.jr-track{position:relative;list-style:none;margin:0;display:flex;gap:clamp(28px,4vw,64px);width:max-content;padding:0 var(--gutter) 0 max(var(--gutter),calc((100vw - var(--container)) / 2 + var(--gutter)));will-change:transform}
.jr-rail{position:absolute;top:26px;left:0;width:100%;height:2px;background:rgba(26,59,135,.14)}
.jr-fill{position:absolute;inset:0;background:linear-gradient(90deg,var(--sky),var(--orange));transform-origin:left;transform:scaleX(var(--f,0))}
.jr-spark{position:absolute;top:50%;left:calc(var(--f,0) * 100%);width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:5px;background:var(--orange);box-shadow:0 0 0 6px rgba(254,87,16,.18),0 0 30px 6px rgba(254,87,16,.55);transform:rotate(45deg)}
.jr-st{position:relative;flex:none;width:min(430px,78vw);padding-top:84px}
.jr-node{position:absolute;left:0;top:0;width:54px;height:54px;display:grid;place-items:center}
.jr-node i{position:absolute;inset:0;border-radius:50%;border:2px solid rgba(26,59,135,.22);background:var(--paper);transition:border-color .5s}
.jr-node b{position:relative;width:14px;height:14px;border-radius:4px;background:#C5D0E4;transition:background .5s,transform .6s var(--ease)}
.jr-st.on .jr-node i{border-color:var(--orange);animation:ping 2.6s var(--ease) infinite}
.jr-st.on .jr-node b{background:var(--orange);transform:rotate(45deg)}
@keyframes ping{0%{box-shadow:0 0 0 0 rgba(254,87,16,.35)}70%,100%{box-shadow:0 0 0 18px rgba(254,87,16,0)}}
.jr-card{padding:32px;border-radius:26px;background:#fff;border:1px solid var(--line);box-shadow:0 40px 70px -50px rgba(7,19,48,.5);transform:perspective(1000px) rotateY(var(--ry,0deg)) scale(var(--s,1));transform-origin:left center;transition:transform .9s var(--ease),opacity .7s,border-color .5s}
.jr-st:not(.on) .jr-card{--ry:-16deg;--s:.96;opacity:.5}
.jr-st.on .jr-card{border-color:rgba(254,87,16,.35)}
.jr-card h3{font-size:1.3rem}
.jr-card p{color:var(--text)}
.jr-tags{list-style:none;margin:20px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.jr-tags a{display:inline-block;padding:9px 13px;border-radius:10px;background:var(--paper);border:1px solid var(--line);font:600 .86rem/1.2 var(--f-body);color:var(--ink);transition:background .3s,color .3s,border-color .3s,transform .4s var(--ease)}
.jr-tags a:hover{background:var(--orange);border-color:var(--orange);color:#fff;transform:translateY(-2px)}

/* ---------- diagnóstico: baralho de perguntas + mapa em anel ---------- */
.diag-sec{position:relative;padding:clamp(52px,5.5vw,88px) 0;overflow:clip}
.diag{display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(30px,5vw,80px);align-items:start}
.diag-l>p.rv{max-width:48ch}
.diag-prog{display:flex;align-items:center;gap:16px;margin:30px 0 24px;font-size:.92rem;color:var(--soft-2)}
.diag-prog b{color:#fff}
.diag-prog i{flex:1;height:6px;border-radius:6px;background:rgba(255,255,255,.1);overflow:hidden}
.diag-prog em{display:block;height:100%;background:linear-gradient(90deg,var(--sky),var(--orange));transform-origin:left;transform:scaleX(var(--p,0));transition:transform .7s var(--ease)}
.deck{position:relative;height:310px;perspective:1400px;transform-style:preserve-3d}
.qc{position:absolute;inset:0;display:flex;flex-direction:column;padding:32px;border-radius:28px;background:linear-gradient(160deg,#fff 30%,#E9EEF7);color:var(--ink);box-shadow:0 40px 70px -40px rgba(0,0,0,.7);transform-origin:50% 100%;transform:translateY(calc(var(--o,0) * -16px)) translateZ(calc(var(--o,0) * -70px)) rotateX(calc(var(--o,0) * 3deg));opacity:calc(1 - var(--o,0) * .3);z-index:calc(20 - var(--o,0));transition:transform .85s var(--ease),opacity .6s}
.qc.gone{transform:translateX(-115%) translateY(30px) rotate(-12deg);opacity:0;z-index:30;pointer-events:none}
.qc.far{opacity:0;pointer-events:none}
.qc-k{margin:0 0 12px;font:500 .84rem/1.2 var(--f-head);color:var(--orange)}
.qc-q{margin:0 0 auto;font:600 clamp(1.15rem,1.9vw,1.55rem)/1.3 var(--f-head);letter-spacing:-.03em;color:var(--ink)}
.qc-end .link-arrow{color:var(--ink);align-self:flex-start}
.seg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:22px}
.seg button{padding:16px 10px;border-radius:14px;border:1.5px solid var(--line);background:#fff;font:700 1rem/1 var(--f-body);color:var(--ink);cursor:pointer;transition:background .35s,border-color .35s,color .35s,transform .4s var(--ease),box-shadow .4s}
.seg button:hover{transform:translateY(-3px);border-color:var(--blue-l);box-shadow:0 14px 24px -16px rgba(26,59,135,.6)}
.seg button[aria-pressed=true]{background:var(--orange);border-color:var(--orange);color:#fff}
.seg button[aria-pressed=true][data-v=sim]{background:var(--blue);border-color:var(--blue)}
.deck-nav{display:flex;justify-content:space-between;margin-top:22px}
.deck-nav button{display:inline-flex;align-items:center;gap:10px;padding:8px 0;border:0;background:none;color:var(--soft);font:700 .95rem var(--f-body);cursor:pointer;transition:color .3s,opacity .3s}
.deck-nav button:hover{color:#fff}
.deck-nav button:disabled{opacity:.3;cursor:default}
.deck-nav [data-deck-prev] svg{transform:rotate(180deg)}
.diag-card{position:sticky;top:110px;padding:34px;border-radius:30px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.11);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.diag-card h3{font-size:1.3rem}
.diag-msg{min-height:3.3em;color:var(--soft)}
.gauge{position:relative;width:min(250px,100%);aspect-ratio:1;margin:8px auto 20px}
.gauge svg{width:100%;height:100%}
.g-orbit{fill:none;stroke:rgba(91,197,240,.35);stroke-width:1;stroke-dasharray:2 7;transform-box:view-box;transform-origin:50% 50%;animation:spin 40s linear infinite}
.arc{fill:none;stroke:rgba(255,255,255,.1);stroke-width:16;transition:stroke .6s,stroke-width .6s var(--ease)}
.arc.ok{stroke:var(--sky);stroke-width:20}
.arc.miss{stroke:var(--orange);stroke-width:20}
.diag-score{position:absolute;inset:0;margin:0;display:grid;place-content:center;text-align:center}
.diag-score span{font:700 3.6rem/1 var(--f-head);letter-spacing:-.05em;color:#fff}
.diag-score small{margin-top:8px;font-size:.84rem;line-height:1.3;color:var(--soft-2)}
.diag-score.bump span{animation:bump .55s var(--ease)}
@keyframes bump{40%{transform:scale(1.25);color:var(--sky)}}
.diag-pend{list-style:none;margin:0 0 22px;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.diag-pend li{padding:8px 12px;border-radius:10px;background:rgba(254,87,16,.15);color:#FFB592;font-size:.88rem;font-weight:700;animation:rowIn .5s var(--ease) both}
.diag-card .btn{width:100%}

/* ---------- pilares: tambor 3D ---------- */
.pil{position:relative}
.pil-sticky{position:relative;overflow:hidden;display:flex;align-items:center;padding:clamp(52px,5.5vw,88px) 0}
.pil-in{position:relative;z-index:1;display:grid;grid-template-columns:.95fr 1.05fr;grid-template-areas:"head drum" "desc drum";gap:10px clamp(30px,5vw,70px);align-items:center}
.pil-head{grid-area:head;align-self:end}
.pil-tabs{position:relative;display:flex;flex-wrap:wrap;gap:4px 22px;margin-top:10px}
.pil-tabs button{padding:10px 0;border:0;background:none;font:700 .95rem var(--f-body);color:var(--muted);cursor:pointer;transition:color .3s}
.pil-tabs button[aria-selected=true]{color:var(--ink)}
.pil-bar{position:absolute;left:0;bottom:0;width:0;height:2px;background:var(--orange);transition:transform .6s var(--ease),width .6s var(--ease)}
.drum-wrap{grid-area:drum;height:min(46vh,400px);display:grid;place-items:center;perspective:1100px;-webkit-mask-image:linear-gradient(transparent,#000 28%,#000 72%,transparent);mask-image:linear-gradient(transparent,#000 28%,#000 72%,transparent)}
.drum{position:relative;width:100%;height:1.2em;font:700 clamp(2.1rem,4.9vw,5rem)/1.2 var(--f-head);letter-spacing:-.05em;transform-style:preserve-3d;transform:translateZ(-2.1em) rotateX(calc(var(--a,0) * 1deg))}
.drum-f{position:absolute;inset:0;display:grid;place-items:center;color:var(--ink);-webkit-backface-visibility:hidden;backface-visibility:hidden;transform:rotateX(calc(var(--i) * -40deg)) translateZ(2.1em);opacity:var(--o,.15);transition:color .5s}
.drum-f.on{color:var(--orange)}
.pil-desc{grid-area:desc;display:grid;align-self:start}
.pil-d{grid-area:1/1;opacity:0;transform:translateY(20px);transition:opacity .5s,transform .7s var(--ease)}
.pil-d.on{opacity:1;transform:none}
.pil-d h3{font-size:1.3rem}
.pil-d p{font-size:1.1rem;max-width:40ch;color:var(--text)}

/* ---------- quem somos (cartão 3D) ---------- */
.split-2{display:grid;grid-template-columns:1fr 1fr;gap:clamp(36px,6vw,90px);align-items:center}
.qs .split-2{grid-template-columns:.85fr 1.15fr}
.tilt{margin:0;perspective:1300px}
.tilt-in{position:relative;transform-style:preserve-3d;transform:rotateX(calc(var(--ty,0) * 1deg)) rotateY(calc(var(--tx,0) * 1deg));transition:transform .9s var(--ease)}
.tilt-in>img{width:100%;border-radius:28px;box-shadow:0 60px 90px -50px rgba(0,0,0,.6)}
.tilt-tall .tilt-in>img{aspect-ratio:4/5;object-fit:cover;max-height:640px}
.tilt-in::after{content:"";position:absolute;inset:0;border-radius:28px;background:var(--tint,transparent);mix-blend-mode:multiply;opacity:.6;transition:background .6s;pointer-events:none}
.tilt-ring{position:absolute;inset:-6% -16%;transform-style:preserve-3d;transform:rotateZ(-14deg) rotateX(74deg);pointer-events:none}
.tilt-ring i{position:absolute;inset:0;border-radius:50%;border:4px solid var(--tint,var(--sky));transition:border-color .6s;animation:spin 16s linear infinite}
.tilt-ring i::after{content:"";position:absolute;left:50%;top:-9px;width:16px;height:16px;margin-left:-8px;border-radius:4px;background:var(--orange);box-shadow:0 0 20px var(--orange)}
.tilt-sq{position:absolute;right:-22px;bottom:-22px;width:104px;height:104px;border-radius:24px;background:var(--orange);transform:translateZ(70px);box-shadow:0 30px 40px -20px rgba(254,87,16,.7);animation:bob 6s ease-in-out infinite}
@keyframes bob{50%{translate:0 -14px}}
.tilt-wide .tilt-ring{inset:-14% -8%}
.tilt-square .tilt-sq{width:80px;height:80px}
.logo-card{position:relative;overflow:hidden;aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;border-radius:28px;background:radial-gradient(circle at 50% 42%,#0D2B5E 0,var(--navy) 62%,var(--night) 100%);box-shadow:0 60px 90px -50px rgba(0,0,0,.6)}
.logo-card img{position:relative;z-index:1;width:62%;height:auto}
.logo-card span{position:relative;z-index:1;font:600 clamp(1.1rem,2.2vw,1.6rem)/1 var(--f-head);letter-spacing:.02em;color:#fff}
blockquote{margin:30px 0;padding:24px 26px;border-radius:22px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:var(--soft)}
blockquote strong{color:#fff}

/* ---------- contabilidade: barras isométricas ---------- */
.iso{margin:0}
.iso-stage{height:clamp(320px,36vw,460px);display:grid;place-items:center;perspective:1700px}
.iso-in{position:relative;width:350px;height:175px;padding:22px;display:grid;grid-template-rows:repeat(2,1fr);grid-auto-flow:column;grid-auto-columns:1fr;gap:20px;transform-style:preserve-3d;transform:translateY(44px) rotateX(calc(58deg + var(--my,0) * 6deg)) rotateZ(calc(-45deg + var(--mx,0) * 16deg));transition:transform 1s var(--ease)}
.iso-floor{position:absolute;inset:0;border-radius:26px;background:#fff;border:1px solid var(--line);box-shadow:0 50px 70px -40px rgba(7,19,48,.4)}
.bar3{position:relative;margin:5px;transform-style:preserve-3d;--hh:calc(var(--h) * 2.2px);transform:scaleZ(.02);transition:transform 1.4s var(--ease);transition-delay:calc(var(--k) * 90ms + .25s)}
.iso.in .bar3{transform:scaleZ(1)}
.bar3 i{position:absolute}
.f-t{inset:0;border-radius:3px;background:var(--sky);transform:translateZ(var(--hh))}
.f-a{left:0;bottom:0;width:100%;height:var(--hh);transform-origin:bottom;transform:rotateX(-90deg);background:var(--blue-l)}
.f-b{left:0;top:0;width:var(--hh);height:100%;transform-origin:left;transform:rotateY(-90deg);background:var(--blue)}
.bar3.hot .f-t{background:var(--orange)}
.bar3.hot .f-a{background:var(--orange-d)}
.bar3.hot .f-b{background:var(--orange-dd)}
.iso figcaption{text-align:center;font-size:.92rem;color:var(--muted);margin-top:6px}

/* ---------- chamada final laranja ---------- */
.cta{position:relative;padding:clamp(60px,6.5vw,108px) 0;overflow:clip;text-align:center}
.cta-orb{position:absolute!important;left:50%;top:50%;width:min(1100px,150vw)!important;max-width:none!important;transform:translate(-50%,-50%);opacity:.6;pointer-events:none}
.cta-orb .ring{--c:rgba(255,255,255,.5)}
.cta-orb .r-o{--c:var(--navy)}
.cta-orb .sat{background:#fff;box-shadow:none}
.cta h2{max-width:20ch;margin:0 auto .5em;font-size:clamp(1.85rem,4.2vw,3.6rem)}
.cta-lead{max-width:58ch;margin:0 auto;font-size:1.15rem;color:#FFE6DA}
.cta-actions{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:16px 30px;margin-top:38px}
.cta .link-arrow{color:#fff}
.cta-info{display:flex;flex-wrap:wrap;justify-content:center;gap:16px 50px;margin:60px 0 0}
.cta-info dt{font:500 .8rem var(--f-head);color:#FFD4C0}
.cta-info dd{margin:6px 0 0;font-weight:700}

/* ---------- serviços (página) ---------- */
.gnav-wrap{position:sticky;top:70px;z-index:40;background:rgba(2,20,48,.86);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.08);transition:top .6s var(--ease)}
.hdr-off .gnav-wrap{top:0}
.gnav{position:relative;display:flex;gap:4px;overflow-x:auto;padding-top:10px;padding-bottom:10px;scrollbar-width:none}
.gnav::-webkit-scrollbar{display:none}
.gnav a{position:relative;z-index:1;flex:none;padding:11px 16px;border-radius:12px;font:600 .92rem var(--f-body);color:var(--soft);transition:color .3s}
.gnav a.active{color:#fff}
.gnav .bar{position:absolute;left:0;top:10px;bottom:10px;width:0;border-radius:12px;background:var(--orange);transition:transform .55s var(--ease),width .55s var(--ease)}
.grp{display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(30px,5vw,80px);align-items:start}
.grp-head{position:sticky;top:160px}
.grp-head h2{font-size:clamp(1.5rem,2.6vw,2.2rem)}
.acc{display:grid;gap:14px}
.acc-item{border-radius:22px;background:#fff;border:1px solid var(--line);transition:border-color .4s,box-shadow .5s,transform .55s var(--ease)}
.t-deep .acc-item{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.1)}
.js .acc-item.rv.in:hover{transform:translateY(-3px);box-shadow:0 34px 50px -40px rgba(7,19,48,.55)}
.acc-item.open{border-color:rgba(254,87,16,.55)}
.acc-h{margin:0;font-size:inherit}
.acc-h button{display:flex;align-items:center;gap:20px;width:100%;padding:24px 24px 24px 26px;border:0;background:none;text-align:left;cursor:pointer;border-radius:22px}
.acc-t{display:block;font:600 1.05rem/1.3 var(--f-head);letter-spacing:-.02em;color:var(--ink)}
.t-deep .acc-t{color:#fff}
.acc-tt small{display:block;margin-top:6px;font:400 .95rem/1.5 var(--f-body);color:var(--muted)}
.t-deep .acc-tt small{color:var(--soft-2)}
.tog{display:grid;place-items:center;flex:none;width:44px;height:44px;margin-left:auto;border-radius:13px;background:var(--paper);color:var(--ink);transition:transform .6s var(--ease),background .35s,color .35s}
.t-deep .tog{background:rgba(255,255,255,.08);color:#fff}
.acc-item.open .tog{transform:rotate(135deg);background:var(--orange);color:#fff}
.acc-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .65s var(--ease)}
.acc-item.open .acc-body{grid-template-rows:1fr}
.acc-body>div{overflow:hidden}
.inner{padding:0 26px 26px}
.t-light .inner p{color:var(--text)}
.inner .actions{margin-top:18px;align-items:center}
.acc-item.flash{animation:flash 1.8s var(--ease)}
@keyframes flash{0%,40%{box-shadow:0 0 0 6px rgba(254,87,16,.35)}100%{box-shadow:0 0 0 0 rgba(254,87,16,0)}}

/* quem somos: disciplinas, missão e frentes */
.hist-lead{font-size:1.15rem;color:var(--ink)}
.disc{padding:0 3px;font-weight:700;color:var(--ink);background-image:linear-gradient(var(--dc),var(--dc));background-position:0 100%;background-size:100% 3px;background-repeat:no-repeat;transition:background-size .45s var(--ease),color .3s;cursor:default;border-radius:3px}
.disc:hover,.disc:focus{background-size:100% 100%;color:#fff;outline:none}
.d-o{--dc:var(--orange)}.d-l{--dc:var(--blue-l)}.d-g{--dc:var(--green)}.d-s{--dc:#2A9FD0}
.manifesto{margin:0;max-width:24ch;font:600 clamp(1.6rem,4vw,3.4rem)/1.22 var(--f-head);letter-spacing:-.04em;color:#fff}
.mw{opacity:.14;transition:opacity .5s,color .5s}
.mw.lit{opacity:1}
.mw.hl.lit{color:var(--orange)}
.fronts{list-style:none;margin:0;padding:0;display:flex;gap:14px;height:440px}
.fronts li{flex:1;min-width:0;transition:flex-grow .8s var(--ease)}
.fronts li:hover,.fronts li:focus-within{flex-grow:2.1}
.fronts a{position:relative;display:flex;flex-direction:column;height:100%;padding:26px;border-radius:26px;background:#fff;border:1px solid var(--line);overflow:hidden;transition:background .6s,border-color .6s}
.fronts li:hover a,.fronts li:focus-within a{background:var(--navy);border-color:var(--navy)}
.fronts .stack-mini{margin:4px -10px 0}
.fronts strong{margin-top:auto;font:600 1.12rem/1.25 var(--f-head);letter-spacing:-.02em;color:var(--ink);transition:color .5s}
.fronts li:hover strong,.fronts li:focus-within strong{color:#fff}
.fr-sum{max-height:0;opacity:0;overflow:hidden;color:var(--soft);transition:max-height .7s var(--ease),opacity .5s,margin .5s}
.fronts li:hover .fr-sum,.fronts li:focus-within .fr-sum{max-height:140px;opacity:1;margin-top:10px}
.fronts .go{position:absolute;right:20px;top:20px;background:var(--paper);color:var(--ink)}
.fronts li:hover .go{background:var(--orange);color:#fff;transform:rotate(-45deg)}
.fronts li:hover .pl-top{background:rgba(255,255,255,.12);border-color:rgba(91,197,240,.6)}
.fronts li:hover .plate.on .pl-top{background:var(--orange)}
.fronts li:hover .pl-a{background:#14336F}.fronts li:hover .pl-b{background:#0B2554}

/* contabilidade (página) */
.segments{list-style:none;margin:0 0 8px;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.segments li{padding:10px 14px;border-radius:12px;background:#fff;border:1px solid var(--line);font-weight:700;font-size:.92rem;color:var(--ink);transition:border-color .3s,transform .4s var(--ease)}
.segments li:hover{border-color:var(--orange);transform:translateY(-3px)}
.lgx{position:relative;height:175vh}
.lgx-sticky{position:sticky;top:0;height:100vh;overflow:hidden;display:flex;align-items:center;padding-top:60px}
.lgx-in{position:relative;z-index:1;display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(30px,5vw,80px);align-items:center}
.lgx-head>p{color:var(--soft)}
.lgx-tabs{display:grid;gap:10px;margin-top:26px}
.lgx-tabs button{padding:17px 20px;border-radius:18px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);text-align:left;cursor:pointer;transition:background .4s,border-color .4s,transform .45s var(--ease)}
.lgx-tabs button:hover{transform:translateX(6px)}
.lgx-tabs strong{display:block;font:600 1rem var(--f-head);letter-spacing:-.02em;color:#fff}
.lgx-tabs small{display:block;margin-top:4px;color:var(--soft-2)}
.lgx-tabs button[aria-selected=true]{background:rgba(254,87,16,.14);border-color:var(--orange)}
.sheet3d{perspective:1700px}
.sheet3d-in{display:grid;transform-style:preserve-3d;transform:rotateY(calc(var(--flip,0) * 180deg + var(--tx,0) * 1deg)) rotateX(calc(var(--ty,0) * 1deg));transition:transform 1.2s var(--ease)}
.face{grid-area:1/1;padding:clamp(26px,3vw,40px);border-radius:28px;background:#fff;color:var(--text);-webkit-backface-visibility:hidden;backface-visibility:hidden;box-shadow:0 60px 90px -50px rgba(0,0,0,.7)}
.face-b{transform:rotateY(180deg);background:linear-gradient(160deg,#fff 40%,#FFF1E9)}
.face h3{font-size:1.3rem;color:var(--ink)}
.lg-rows{list-style:none;margin:20px 0 0;padding:0}
.lg-rows li{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:13px 0;border-top:1px solid var(--line);font-weight:700;color:var(--ink)}
.lg-st{flex:none;padding:5px 10px;border-radius:8px;background:var(--paper);font-weight:600;font-size:.84rem;color:var(--muted)}
.face.on .lg-rows li{animation:rowIn .6s var(--ease) both;animation-delay:calc(var(--k) * 80ms + .35s)}
.lg-chart{width:100%;height:auto;margin:4px 0 0}
.lg-chart .gl path{stroke:var(--line);stroke-width:1}
.lg-chart .ln{fill:none;stroke:var(--orange);stroke-width:3;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.8s var(--ease) .4s}
.face-b.on .ln{stroke-dashoffset:0}

/* contato */
.ct .container{position:relative;z-index:1}
.contact{display:grid;grid-template-columns:1.2fr .8fr;gap:clamp(22px,4vw,50px);align-items:start}
.form{padding:clamp(26px,4vw,48px);border-radius:30px;background:#fff;border:1px solid var(--line);box-shadow:0 60px 100px -70px rgba(7,19,48,.55)}
.form h2{margin-bottom:.3em}
.form-note{color:var(--muted);margin-bottom:26px}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.fl{position:relative;display:block;margin-bottom:14px}
.fl input,.fl textarea{width:100%;padding:25px 16px 10px;border-radius:14px;border:1.5px solid var(--line);background:var(--paper);font:500 1rem/1.4 var(--f-body);color:var(--ink);resize:vertical;transition:border-color .3s,background .3s,box-shadow .3s}
.fl input:focus,.fl textarea:focus{outline:none;border-color:var(--blue-l);background:#fff;box-shadow:0 0 0 4px rgba(43,90,168,.13)}
.fl span{position:absolute;left:17px;top:17px;color:var(--muted);pointer-events:none;transform-origin:left top;transition:transform .35s var(--ease),color .3s}
.fl input:focus+span,.fl input:not(:placeholder-shown)+span,.fl textarea:focus+span,.fl textarea:not(:placeholder-shown)+span{transform:translateY(-10px) scale(.78);color:var(--blue-l)}
.fl.invalid input,.fl.invalid textarea{border-color:#D93025;background:#FFF6F5}
.subj{margin:4px 0 18px;padding:0;border:0}
.subj legend{margin-bottom:10px;font-weight:700;color:var(--ink)}
.subj>div{display:flex;flex-wrap:wrap;gap:8px}
.subj label{position:relative;cursor:pointer}
.subj input{position:absolute;opacity:0;pointer-events:none}
.subj span{display:inline-block;padding:10px 15px;border-radius:12px;border:1.5px solid var(--line);font-weight:700;font-size:.92rem;color:var(--text);transition:background .3s,border-color .3s,color .3s,transform .4s var(--ease)}
.subj label:hover span{transform:translateY(-2px);border-color:var(--blue-l)}
.subj input:checked+span{background:var(--navy);border-color:var(--navy);color:#fff}
.subj input:focus-visible+span{outline:3px solid var(--orange);outline-offset:2px}
.form .btn{margin-top:6px}
.form-status{margin:14px 0 0;font-weight:700}
.form-status.ok{color:var(--green-d)}
.form-status.err{color:#D93025}
.chan{position:relative;overflow:hidden;display:grid;gap:6px;padding:32px;border-radius:30px;background:var(--navy);color:var(--soft)}
.chan-orb{position:absolute!important;right:-62%;top:-34%;width:440px!important;opacity:.22;pointer-events:none}
.chan-hd{position:relative;margin:0 0 10px}
.chan-hd strong{display:block;font:600 1.2rem var(--f-head);letter-spacing:-.02em;color:#fff}
.chan-now{display:block;margin-top:6px;font-size:.92rem;color:var(--soft-2)}
.chan-now.open{color:#62D691}
.ch{position:relative;display:flex;gap:14px;align-items:flex-start;padding:15px 16px;border-radius:18px;transition:background .35s,transform .45s var(--ease)}
a.ch:hover{background:rgba(255,255,255,.06);transform:translateX(6px)}
.ch .ci{flex:none;margin-top:2px;font-size:22px;color:var(--orange)}
.ch strong{display:block;color:#fff}
.ch small{display:block;font-size:.92rem;color:var(--soft-2)}
.ch small a:hover{color:#fff}
.ch-wa{background:rgba(35,164,85,.13);border:1px solid rgba(35,164,85,.42)}
.ch-wa .ci{color:#62D691}

/* ---------- rodapé ---------- */
.footer{position:relative;z-index:1;overflow:hidden;padding:clamp(52px,5.5vw,88px) 0 0;background:var(--night);color:var(--soft-2)}
.where{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(30px,5vw,80px);align-items:center;padding-bottom:clamp(60px,8vw,100px)}
.where-copy p:not(.kicker){color:var(--soft)}
.where .btn{margin-top:12px}
.map3d{perspective:1500px}
${require('../_build/mapa-css')}
.map-box{height:420px;transform:rotateY(calc(-9deg + var(--tx,0) * 1deg)) rotateX(calc(4deg + var(--ty,0) * 1deg));transition:transform 1s var(--ease)}
.foot-grid{display:grid;grid-template-columns:1.4fr 1fr 1.3fr 1fr;gap:40px;padding-top:56px;padding-bottom:30px;border-top:1px solid rgba(255,255,255,.08)}
.footer h3{margin-bottom:18px;font-size:.95rem;color:#fff}
.footer ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.footer ul a{transition:color .3s}
.footer ul a:hover{color:#fff}
.foot-brand img{width:170px}
.foot-brand p{margin:18px 0 0;max-width:30ch}
.social{display:flex;gap:10px;margin-top:20px}
.social a{display:grid;place-items:center;width:46px;height:46px;border-radius:14px;background:rgba(255,255,255,.07);color:#fff;font-size:20px;transition:background .35s,transform .45s var(--ease)}
.social a:hover{background:var(--orange);transform:translateY(-4px) rotate(-6deg)}
.foot-contact li{display:flex;gap:10px;align-items:flex-start}
.foot-contact svg{margin-top:5px;color:var(--orange)}
.hours{margin:0}
.hours div{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.07)}
.hours dt,.hours dd{margin:0}
.hours dd{color:#fff;text-align:right}
.foot-word{margin:0;white-space:nowrap;text-align:center;font:700 clamp(2.4rem,8.6vw,9rem)/.95 var(--f-head);letter-spacing:-.06em;margin-top:clamp(30px,5vw,60px);color:rgba(91,197,240,.07);-webkit-user-select:none;user-select:none}
.foot-bottom{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;padding-top:22px;padding-bottom:30px;font-size:.85rem;border-top:1px solid rgba(255,255,255,.08)}
.foot-bottom a{color:#fff}
.wa-float{position:fixed;right:22px;bottom:22px;z-index:55;display:grid;place-items:center;width:62px;height:62px;border-radius:50%;background:var(--green);color:#fff;font-size:28px;box-shadow:0 18px 34px -12px rgba(35,164,85,.75);transition:transform .5s var(--ease)}
.wa-float:hover{transform:scale(1.08) rotate(-8deg)}
.wa-ring{position:absolute;left:-7px;top:-7px;width:76px!important;height:76px!important;transform:rotate(-90deg);pointer-events:none}
.wa-ring circle{fill:none;stroke:rgba(35,164,85,.25);stroke-width:2}
.wa-ring .p{stroke:var(--orange);stroke-width:2.5;stroke-linecap:round;stroke-dasharray:188.5;stroke-dashoffset:calc(188.5 * (1 - var(--sp,0)))}

/* ---------- responsivo ---------- */
@media (max-width:1100px){
  .nav a{padding:10px 12px}
  .hdr-cta{display:none}
  .foot-grid{grid-template-columns:1fr 1fr}
}
@media (max-width:920px),(max-height:620px){
  .stk,.jr,.pil,.lgx{height:auto}
  .stk-sticky,.jr-sticky,.pil-sticky,.lgx-sticky{position:relative;height:auto;padding:clamp(52px,5.5vw,88px) 0;overflow:visible}
  .jr-sticky{overflow:hidden}
  .jr-track{flex-direction:column;width:auto;padding:0 var(--gutter);gap:26px;transform:none!important}
  .jr-rail{top:0;bottom:0;left:calc(var(--gutter) + 26px)!important;width:2px!important;height:auto}
  .jr-fill{transform:none}
  .jr-spark{display:none}
  .jr-st{width:auto;padding:0 0 0 76px}
  .jr-st .jr-card{--ry:0deg!important;--s:1!important;opacity:1!important}
  .pil-in{grid-template-columns:1fr;grid-template-areas:"head" "desc"}
  .drum-wrap,.pil-tabs{display:none}
  .pil-desc{gap:14px}
  .pil-d{grid-area:auto;opacity:1;transform:none;padding:22px 24px;border-radius:20px;background:#fff;border:1px solid var(--line)}
  .lgx-in{grid-template-columns:1fr}
}
@media (max-width:920px){
  :root{--hdr:72px}
  .nav{display:none}
  .menu-btn{display:block}
  .hero-in,.phero-in,.stk-grid,.split-2,.qs .split-2,.diag,.grp,.where,.contact{grid-template-columns:1fr}
  .hero{min-height:auto}
  .hero-vis{order:-1;max-width:420px;width:82%;margin:0 auto -10px}
  .hero-orb{width:100%;margin:0}
  .phero{min-height:auto}
  .phero-orb{max-width:300px;order:-1;margin:0 auto}
  .facts{grid-template-columns:1fr}
  .facts li,.facts li+li{padding:16px 0;border-left:0}
  .stack{height:300px;--sz:160px;--gap:30px}
  .stk-vis{padding-top:40px}
  .stack .pl-top span{font-size:.72rem}
  .diag-card{position:relative;top:0}
  .grp-head{position:relative;top:0}
  .stack-grp{display:none}
  .fronts{flex-direction:column;height:auto}
  .fronts a{min-height:0}
  .fronts .stack-mini{display:none}
  .fronts strong{margin-top:0;padding-right:56px}
  .fr-sum{max-height:none;opacity:1;margin-top:8px;color:var(--muted)}
  .fronts li:hover .fr-sum{color:var(--soft)}
  .wall{grid-template-columns:1fr 1fr}
  .wall li:nth-child(1),.wall li:nth-child(5){grid-column:span 2}
  .flip-in{height:150px}
  .tilt-sq{width:72px;height:72px;right:-8px;bottom:-14px}
  .map-box{height:360px;transform:none}
  .js .sheet:not(.full){clip-path:inset(calc((1 - var(--p,1)) * 8vh) calc((1 - var(--p,1)) * 3vw) 0 round calc((1 - var(--p,1)) * 36px) calc((1 - var(--p,1)) * 36px) 0 0)}
}
@media (max-width:640px){
  body{font-size:16px}
  .row2{grid-template-columns:1fr}
  .seg{grid-template-columns:1fr 1fr 1fr;gap:8px}
  .seg button{padding:14px 6px;font-size:.92rem}
  .deck{height:340px}
  .qc{padding:24px}
  .iso-in{width:290px;height:146px;padding:16px;gap:12px}
  .bar3{--hh:calc(var(--h) * 2px)}
  .foot-grid{grid-template-columns:1fr}
  .actions .btn{width:100%}
  .cta-actions .btn{width:100%}
  .wa-float{right:16px;bottom:16px}
  .flip-in{height:130px}
  .fc-b{font-size:.85rem;padding:14px}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
  .js .rv{opacity:1;transform:none;filter:none}
  .js .split .w>span{transform:none}
  .js .sheet:not(.full){clip-path:none}
  .js .sheet>.container{transform:none}
  .bar3{transform:none}
}

/* ---------- equipe (Quem somos): retrato em órbita + anéis de progresso na formação ---------- */
.team .container{position:relative;z-index:1}
.team-orbits{opacity:.55}
.team-lead{max-width:40ch;margin:0;color:var(--soft)}
.team-grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(14px,1.8vw,24px)}
.a-o{--ac:var(--orange)}.a-b{--ac:#4F7FD6}.a-l{--ac:var(--sky)}.a-s{--ac:#9FE0FA}
.om{display:flex;perspective:1200px}
.om-in{position:relative;flex:1;display:flex;flex-direction:column;padding:28px clamp(18px,1.6vw,24px) 22px;border-radius:30px 30px 30px 8px;background:radial-gradient(120% 70% at 50% 0,rgba(43,90,168,.42),transparent 62%),linear-gradient(180deg,#0A2452,#061A3D 70%);box-shadow:inset 0 1px 0 rgba(185,197,220,.14),0 50px 70px -50px rgba(0,0,0,.8);transform-style:preserve-3d;transform:rotateX(calc(var(--ty,0) * .7deg)) rotateY(calc(var(--tx,0) * .7deg));transition:transform .9s var(--ease),box-shadow .6s}
.om:hover .om-in{box-shadow:inset 0 1px 0 rgba(185,197,220,.2),0 60px 80px -46px rgba(0,0,0,.85),0 0 0 1.5px color-mix(in srgb,var(--ac) 55%,transparent)}
.om-pic{position:relative;width:min(100%,230px);aspect-ratio:1;margin:0 auto 22px;transform-style:preserve-3d;transform:translateZ(40px)}
.om-face{position:absolute;inset:15%;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:radial-gradient(circle at 32% 26%,color-mix(in srgb,var(--ac) 85%,#fff) 0,var(--ac) 22%,var(--blue) 62%,var(--navy) 100%);box-shadow:0 26px 40px -20px rgba(0,0,0,.7),inset 0 -12px 30px rgba(2,20,48,.45);transition:transform .9s var(--ease)}
.om-face img{width:100%;height:100%;object-fit:cover}
.om-face b{font:600 clamp(2.2rem,3.4vw,2.9rem)/1 var(--f-head);letter-spacing:-.05em;color:#fff;text-shadow:0 6px 24px rgba(2,20,48,.5)}
.om:hover .om-face{transform:scale(1.05)}
.om-orbit{position:absolute;inset:4% -6%;transform-style:preserve-3d;pointer-events:none;transition:inset .9s var(--ease)}
.om-orbit i{position:absolute;inset:0;border-radius:50%;animation:spin 14s linear infinite}
.om-orbit i::after{content:"";position:absolute;left:50%;top:-6px;width:11px;height:11px;margin-left:-5.5px;border-radius:3px}
/* o1 fica atrás do rosto e o2 passa pela frente: a metade de baixo do anel cruza na frente */
.o1{transform:rotateZ(-18deg) rotateX(66deg)}
.o1 i{border:3px solid var(--ac);box-shadow:0 0 18px color-mix(in srgb,var(--ac) 45%,transparent)}
.o1 i::after{background:var(--orange);box-shadow:0 0 16px var(--orange)}
.o2{inset:10% -2%;transform:rotateZ(24deg) rotateX(72deg) translateZ(1px)}
.o2 i{border:2px dashed rgba(185,197,220,.6);animation-duration:22s;animation-direction:reverse}
.o2 i::after{background:var(--sky);width:8px;height:8px;margin-left:-4px;top:-4.5px;box-shadow:0 0 12px var(--sky)}
.om:hover .o1{inset:0 -12%}
.om:hover .o2{inset:8% -8%}
.om-in h3{margin:0 0 6px;text-align:center;color:#fff;font-size:1.08rem;transform:translateZ(24px)}
.om-role{margin:0 0 20px;text-align:center;font:500 .8rem/1.3 var(--f-head);letter-spacing:-.01em;color:var(--ac)}
.a-o .om-role{color:#FF8A57}
.om-edu{list-style:none;margin:0 0 22px;padding:16px 0 0;display:grid;gap:12px;border-top:1px solid rgba(185,197,220,.12)}
.om-edu li{display:grid;grid-template-columns:28px 1fr;gap:12px;align-items:start;color:#E6ECF7;font-size:.95rem;line-height:1.4}
.om-edu small{display:block;margin-bottom:2px;font-size:.74rem;letter-spacing:.06em;text-transform:uppercase;color:var(--soft-2)}
.om-edu li.now small{color:#FF8A57}
.om-ring{width:28px;height:28px;transform:rotate(-90deg)}
.om-ring circle{fill:none;stroke-width:2.6}
.om-ring .tr{stroke:rgba(185,197,220,.16)}
.om-ring .ar{stroke:var(--ac);stroke-linecap:round;stroke-dasharray:100 100;stroke-dashoffset:100;transition:stroke-dashoffset 1.6s var(--ease) .4s}
.om.in .om-ring .ar,.om-ring .ar{stroke-dashoffset:0}
.js .om:not(.in) .om-ring .ar{stroke-dashoffset:100}
.om-ring.now .ar{stroke-dasharray:58 100;stroke:var(--orange)}
.om-ring.now{animation:spin 6s linear infinite}
.om-ring rect{fill:var(--ac);opacity:.9}
.om-ring.now rect{fill:var(--orange)}
.om-btn{width:100%;margin-top:auto;min-height:54px;padding:14px 16px;font-size:.92rem;transform:translateZ(30px)}
@media (max-width:1100px){.team-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.om-pic{width:min(100%,210px)}}
@media (max-width:640px){
  .team-grid{grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:84%;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(var(--gutter) * -1);padding:8px var(--gutter) 30px;scroll-padding-left:var(--gutter);scrollbar-width:none}
  .team-grid::-webkit-scrollbar{display:none}
  .om{scroll-snap-align:start}
}
@media (prefers-reduced-motion:reduce){
  .om-orbit i,.om-ring.now{animation:none}
  .om-in,.om-face,.om-orbit{transition:none}
  .js .om:not(.in) .om-ring .ar{stroke-dashoffset:0}
}
`;
module.exports = { css };
