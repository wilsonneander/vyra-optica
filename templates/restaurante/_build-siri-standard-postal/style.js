// CSS do modelo Silver. Embutido no <head>. Mesma paleta do Bronze (creme, terracota, pêssego, tinta),
// com foto da praia na capa, cartões-postais e movimento. Fontes: Newsreader (títulos) + Epilogue (texto).
const css = `
:root{
  --ink:#1B1714;--ink-2:#2A2420;--graphite:#3F3E3B;--text:#2A2420;--muted:#6E6258;
  --cream:#F4EFE1;--sand:#EBE3D0;--blush:#F6E2D2;--white:#FFFFFF;--line:#E6DCC8;
  --terra:#CA603C;--terra-dk:#A94B2B;--peach:#E4A785;--peach-dk:#B8714F;
  --mar:#1F6F94;--mar-dk:#134B66;--turq:#3FA7BD;--espuma:#9FD6E2;--ceu:#DCEFF3;--noite:#0E2A3D;
  --serif:'Newsreader',Georgia,'Times New Roman',serif;
  --sans:'Epilogue',Arial,Helvetica,sans-serif;
  --wrap:1220px;--gut:clamp(16px,4vw,44px);
  --sec:clamp(72px,9vw,132px);
  --ease:cubic-bezier(.2,.75,.2,1);
  --r:4px;
}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--cream);color:var(--text);font:400 17px/1.65 var(--sans);overflow-x:hidden}
img,svg{display:block;max-width:100%}
img{height:auto}
a{color:inherit}
button{font:inherit;color:inherit}
h1,h2,h3{font-family:var(--serif);font-weight:400;line-height:1;margin:0;letter-spacing:-.02em}
h2{font-size:clamp(42px,5.6vw,80px);color:var(--terra);margin-bottom:22px}
h2 em,h1 em{font-style:italic}
p{margin:0 0 1em}
.wrap{width:100%;max-width:var(--wrap);margin:0 auto;padding:0 var(--gut)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skip{position:absolute;left:12px;top:-60px;z-index:300;background:var(--terra);color:#fff;padding:10px 16px;border-radius:var(--r);text-decoration:none}
.skip:focus{top:12px}
:focus-visible{outline:2px solid var(--terra);outline-offset:3px}
.apoio{font:500 13px/1.2 var(--sans);letter-spacing:.18em;text-transform:uppercase;color:var(--mar);margin-bottom:16px}
.sec{padding:var(--sec) 0;position:relative;overflow:hidden}

/* botões */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 26px;border-radius:var(--r);font:600 15px/1 var(--sans);letter-spacing:.02em;text-decoration:none;border:1px solid transparent;cursor:pointer;transition:background .25s,color .25s,border-color .25s,transform .25s var(--ease)}
.btn:hover{transform:translateY(-2px)}
.btn .ic{width:19px;height:19px;flex:none}
.btn-terra{background:var(--terra);color:#fff}
.btn-terra:hover{background:var(--terra-dk)}
.btn-tinta{background:var(--mar);color:#fff}
.btn-tinta:hover{background:var(--mar-dk)}
.btn-linha{border-color:rgba(27,23,20,.4);color:var(--ink);background:rgba(255,255,255,.35)}
.btn-linha:hover{background:var(--ink);border-color:var(--ink);color:var(--cream)}
.btn-linha-escura{border-color:var(--ink);color:var(--ink)}
.btn-linha-escura:hover{background:var(--ink);color:var(--cream)}

/* abertura: cortina terracota que sobe com borda de onda */
.intro{display:none}
.com-intro .intro{display:flex;position:fixed;inset:0;z-index:200;background:var(--terra);color:var(--cream);align-items:center;justify-content:center;text-align:center;transition:transform 1.05s cubic-bezier(.77,0,.18,1);cursor:pointer}
.intro-onda{position:absolute;left:0;top:calc(100% - 1px);width:100%;height:90px;fill:var(--terra)}
.intro.sai{transform:translateY(calc(-100% - 92px))}
.intro-in img{width:96px;margin:0 auto 18px;animation:boia 2.4s ease-in-out infinite}
.intro-in p{font:italic 400 clamp(40px,6vw,64px)/1 var(--serif);margin:0 0 10px;animation:sobe .8s var(--ease) both .1s}
.intro-in span{font:500 13px/1 var(--sans);letter-spacing:.2em;text-transform:uppercase;opacity:.8;animation:sobe .8s var(--ease) both .25s}
@keyframes boia{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-8px) rotate(3deg)}}
@keyframes sobe{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

/* topo */
.hdr{position:fixed;inset:0 0 auto;z-index:50;transition:background .35s,box-shadow .35s,transform .35s var(--ease)}
.hdr.solid{background:rgba(244,239,225,.94);box-shadow:0 10px 30px -24px rgba(27,23,20,.6)}
@supports (backdrop-filter:blur(8px)){.hdr.solid{background:rgba(244,239,225,.93);backdrop-filter:blur(14px) saturate(1.2)}}
.hdr:not(.solid):not(.open) .brand,.hdr:not(.solid):not(.open) .nav a,.hdr:not(.solid):not(.open) .menu-btn{color:var(--mar-dk)}
.hdr:not(.solid):not(.open) .brand em{color:var(--terra)}
.hdr-in{display:flex;align-items:center;gap:30px;height:78px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink);margin-right:auto}
.brand img{width:30px;height:auto}
.brand span{font:400 25px/1 var(--serif);letter-spacing:-.01em}
.brand em{color:var(--terra)}
.nav{display:flex;gap:30px}
.nav a{color:var(--ink);text-decoration:none;font-size:15px;font-weight:500;padding:6px 0;transition:color .2s}
.nav a:hover{color:var(--terra)}
.hdr-cta{min-height:44px;padding:0 20px}
.menu-btn{display:none;background:none;border:0;color:var(--ink);width:44px;height:44px;padding:10px;cursor:pointer}
.menu-btn .ic{width:24px;height:24px}
.menu-btn .i-close,.hdr.open .menu-btn .i-open{display:none}
.hdr.open .menu-btn .i-close{display:block}
.trilha{position:absolute;left:0;right:0;bottom:0;height:2px;opacity:0;transition:opacity .3s}
.hdr.solid .trilha{opacity:1}
.trilha-fio{position:absolute;inset:0;background:var(--terra);transform-origin:0 50%;transform:scaleX(var(--prog,0))}
.trilha-siri{position:absolute;bottom:-9px;left:calc(var(--prog,0) * (100% - 34px));width:34px;color:var(--terra)}
.crab{width:34px;height:auto;overflow:visible}
.crab .pernas-b{opacity:0}
.andando .crab .pernas-a{animation:passo .28s steps(1) infinite}
.andando .crab .pernas-b{animation:passo .28s steps(1) infinite reverse}
.andando .crab{animation:balanco .28s ease-in-out infinite alternate}
@keyframes passo{0%{opacity:1}50%{opacity:0}}
@keyframes balanco{from{transform:translateY(0)}to{transform:translateY(-1.5px)}}
@media (max-width:960px){
  .nav{position:fixed;inset:78px 0 auto;flex-direction:column;gap:0;background:var(--cream);padding:8px var(--gut) 26px;transform:translateY(-12px);opacity:0;visibility:hidden;transition:.3s var(--ease);box-shadow:0 30px 40px -30px rgba(27,23,20,.4)}
  .nav.open{transform:none;opacity:1;visibility:visible}
  .nav a{font:400 30px/1.1 var(--serif);padding:14px 0;border-bottom:1px solid var(--line)}
  .menu-btn{display:block}
  .hdr-cta{display:none}
  .hdr.open{background:var(--cream)}
}

/* capa: foto da praia + cartões-postais */
.capa{position:relative;min-height:max(100svh,720px);display:flex;align-items:center;background:var(--ceu);overflow:hidden;color:var(--mar-dk)}
.capa-foto{position:absolute;inset:0}
.capa-foto img{width:100%;height:100%;object-fit:cover;object-position:40% 60%}
.capa-veu{position:absolute;inset:0;background:linear-gradient(90deg,rgba(250,246,237,.95) 0%,rgba(250,246,237,.86) 30%,rgba(250,246,237,.45) 50%,rgba(250,246,237,0) 66%),linear-gradient(180deg,rgba(250,246,237,.7) 0%,rgba(250,246,237,0) 18%)}
.capa-borda{position:absolute;left:0;bottom:-1px;z-index:1;width:100%;height:clamp(40px,6vw,90px);fill:var(--cream)}
.capa-in{position:relative;z-index:2;display:grid;grid-template-columns:1.08fr .92fr;gap:clamp(24px,4vw,60px);align-items:center;padding-top:120px;padding-bottom:clamp(130px,14vw,190px)}
.capa-local{font:500 13px/1.2 var(--sans);letter-spacing:.18em;text-transform:uppercase;color:var(--mar);margin-bottom:22px}
.capa h1{font-size:clamp(76px,11.4vw,176px);line-height:.84;letter-spacing:-.035em;color:var(--mar-dk)}
.capa h1>span,.capa h1>em{display:block}
.capa h1 em{color:var(--terra);padding-left:.5em}
.capa-linha{font:italic 400 clamp(24px,2.6vw,34px)/1.2 var(--serif);margin:26px 0 12px;max-width:24ch}
.capa-texto{max-width:44ch;color:#35586B;margin-bottom:28px}
.capa-cta{display:flex;flex-wrap:wrap;gap:12px}
.capa .btn-linha{border-color:rgba(19,75,102,.45);color:var(--mar-dk);background:rgba(255,255,255,.55)}
.capa .btn-linha:hover{background:var(--mar-dk);border-color:var(--mar-dk);color:#fff}
.capa-status{margin:22px 0 0;font-size:15px;font-weight:600;color:var(--terra-dk);min-height:1.6em}
.js .ent{opacity:0;transform:translateY(28px)}
.pronto .ent{opacity:1;transform:none;transition:opacity .9s var(--ease),transform 1s var(--ease);transition-delay:calc(var(--d) * .1s)}
.postais{position:relative;height:clamp(440px,44vw,580px)}
.postais-pilha{list-style:none;margin:0;padding:0;position:absolute;inset:0}
.postal{position:absolute;left:50%;top:47%;width:clamp(230px,23vw,312px);--r:0deg;--x:0px;--y:0px;transform:translate(-50%,-50%) translate(var(--x),var(--y)) rotate(var(--r));transition:transform 1s var(--ease),opacity .7s;cursor:pointer}
.postal figure{margin:0;background:#fff;padding:12px 12px 0;border-radius:3px;box-shadow:0 34px 50px -30px rgba(27,23,20,.65),0 1px 2px rgba(27,23,20,.08)}
.postal img{width:100%;aspect-ratio:3/4;object-fit:cover;background:var(--sand)}
.postal figcaption{font:italic 400 18px/1.25 var(--serif);padding:12px 4px 16px;color:var(--ink)}
.postal[data-pos="0"]{--r:-3deg;z-index:5}
.postal[data-pos="1"]{--r:6deg;--x:64px;--y:-18px;z-index:4}
.postal[data-pos="2"]{--r:-10deg;--x:-70px;--y:12px;z-index:3}
.postal[data-pos="3"]{--r:12deg;--x:30px;--y:28px;z-index:2}
.postal[data-pos="4"],.postal[data-pos="5"],.postal[data-pos="6"]{--r:0deg;z-index:1;opacity:0}
.postal.sai{--x:-150%;--y:60px;--r:-24deg;opacity:0;z-index:6;transition:transform .75s cubic-bezier(.5,0,.75,0),opacity .6s .15s}
.selo-txt text{fill:currentColor;font:600 15px var(--sans);letter-spacing:.22em}
.postais-ctl{position:absolute;left:50%;bottom:0;transform:translateX(-50%);display:flex;gap:10px;z-index:8}
.postais-ctl button,.trilho-ctl button{display:grid;place-items:center;width:50px;height:50px;border-radius:50%;border:1px solid rgba(27,23,20,.35);background:rgba(244,239,225,.7);color:var(--ink);cursor:pointer;transition:background .25s,color .25s,border-color .25s}
.capa .postais-ctl button{border-color:rgba(19,75,102,.3);background:rgba(255,255,255,.9);color:var(--mar-dk)}
.postais-ctl button:hover,.trilho-ctl button:hover{background:var(--ink);border-color:var(--ink);color:var(--cream)}
.postais-ctl .ic,.trilho-ctl .ic{width:20px;height:20px}
@media (max-width:900px){
  .capa{align-items:flex-start}
  .capa-foto img{object-position:30% 50%}
  .capa-veu{background:linear-gradient(180deg,rgba(250,246,237,.93) 0%,rgba(250,246,237,.84) 58%,rgba(250,246,237,.4) 100%)}
  .capa-in{grid-template-columns:1fr;padding-top:104px;padding-bottom:120px;gap:10px}
  .capa h1 em{padding-left:.3em}
  .postais{height:470px}
  .postal{width:236px}
  .postal[data-pos="1"]{--x:48px}
  .postal[data-pos="2"]{--x:-52px}
}

/* faixa corrida */
.faixa{position:relative;z-index:3;margin:-46px -2% 0;width:104%;background:var(--mar);color:var(--cream);padding:16px 0;overflow:hidden;transform:rotate(-1.4deg);box-shadow:0 20px 30px -24px rgba(27,23,20,.6)}
.faixa-trilho{display:flex;width:max-content;animation:faixa 46s linear infinite}
.faixa:hover .faixa-trilho{animation-play-state:paused}
.faixa-trilho>div{display:flex;align-items:center;gap:30px;padding-right:30px}
.faixa span{font:italic 400 clamp(24px,2.6vw,32px)/1 var(--serif);white-space:nowrap}
.faixa .sep{width:42px;color:var(--espuma)}
@keyframes faixa{to{transform:translateX(-50%)}}

/* cardápio em livro: descer vira a página, subir a página volta (componente do Gold, cores do Silver) */
.livro-sec{position:relative;color:var(--cream);background:radial-gradient(120% 80% at 50% 70%,#1C5E7E 0%,var(--noite) 64%)}
.livro-sec .pin{display:flex;flex-direction:column;justify-content:center;gap:clamp(16px,2.4vh,28px);padding:clamp(90px,10vh,110px) 0 clamp(28px,4vh,44px)}
.js .livro-sec .pin{position:sticky;top:0;height:100svh;overflow:clip}
.menu-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:14px 40px}
.menu-top .apoio{color:var(--espuma);margin-bottom:8px}
.menu-top h2{font-size:clamp(36px,3.6vw,56px);color:#fff;margin:0}
.menu-dica{font:italic 400 18px/1.3 var(--serif);color:var(--peach);margin:6px 0 0}
.caps{display:flex;flex-wrap:wrap;gap:4px 22px}
.caps button{background:none;border:0;padding:6px 0;cursor:pointer;font-size:14px;font-weight:500;letter-spacing:.02em;color:rgba(220,239,243,.62);position:relative;transition:color .4s}
.caps button::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--peach);transform:scaleX(0);transform-origin:left;transition:transform .6s var(--ease)}
.caps button:hover,.caps button[aria-current=true]{color:var(--cream)}
.caps button[aria-current=true]::after{transform:scaleX(1)}
.book{position:relative;margin:0 auto;perspective:2600px}
.book-src{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;width:min(1180px,92vw);margin:0 auto}
.book-src .pg{min-height:560px}
.js .book.duo{--w:min(1180px,94vw,calc((100svh - 196px) * 1.56));width:var(--w);height:calc(var(--w) / 1.56)}
.js .book.solo{--w:min(86vw,440px,calc((100svh - 230px) * .66));width:var(--w);height:calc(var(--w) / .66)}
.book-stage{position:absolute;inset:0;transform-style:preserve-3d;transform:rotateX(calc(var(--ty,0) * 1deg + 4deg)) rotateY(calc(var(--tx,0) * 1deg));transition:transform 1.2s var(--ease)}
.book.duo .book-stage::before{content:"";position:absolute;inset:-14px -16px;background:var(--terra-dk);border-radius:6px;transform:translateZ(-3px);box-shadow:0 50px 90px -30px rgba(0,0,0,.8)}
.book.solo .book-stage::before{content:"";position:absolute;inset:-8px -8px -8px -10px;background:var(--terra-dk);border-radius:5px;transform:translateZ(-3px);box-shadow:0 40px 70px -26px rgba(0,0,0,.8)}
.base,.leaf{position:absolute;top:0;height:100%}
.base,.face{container-type:size}
.book.duo .base.l{left:0;width:50%}
.book.duo .base.r,.book.duo .leaf{left:50%;width:50%}
.book.solo .base.r,.book.solo .leaf{left:0;width:100%}
.leaf{transform-origin:left center;transform-style:preserve-3d;will-change:transform}
.face{position:absolute;inset:0;-webkit-backface-visibility:hidden;backface-visibility:hidden;overflow:hidden}
.face.back{transform:rotateY(180deg)}
.face::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:var(--s,0);background:linear-gradient(90deg,rgba(14,42,61,.42),rgba(14,42,61,0) 70%)}
.face.back::after{background:linear-gradient(270deg,rgba(14,42,61,.36),rgba(14,42,61,0) 70%)}
.base>.pg,.face>.pg{height:100%}
.face.blank{background:#FBF7EC}
.book.duo .base.l::after,.book.duo .face.back::before{content:"";position:absolute;top:0;bottom:0;right:0;width:12%;background:linear-gradient(270deg,rgba(60,38,22,.22),rgba(60,38,22,0));z-index:2;pointer-events:none}
.book.duo .base.r::after,.book.duo .face.front::before{content:"";position:absolute;top:0;bottom:0;left:0;width:10%;background:linear-gradient(90deg,rgba(60,38,22,.24),rgba(60,38,22,0));z-index:2;pointer-events:none}
.book.solo .face.front::before,.book.solo .base.r::after{content:"";position:absolute;top:0;bottom:0;left:0;width:6%;background:linear-gradient(90deg,rgba(60,38,22,.2),rgba(60,38,22,0));z-index:2;pointer-events:none}
.pg{position:relative;container-type:size;background:#FBF7EC;color:var(--text);padding:7cqh 8cqw 9cqh;display:flex;flex-direction:column;overflow:hidden;background-image:radial-gradient(120% 90% at 50% 40%,rgba(255,255,255,.6),rgba(235,227,208,.5))}
.book-src .pg{container-type:inline-size;padding:28px 30px 48px}
.pg-run{position:absolute;left:0;right:0;bottom:3.2cqh;margin:0;text-align:center;font:italic 400 clamp(11px,2cqh,14px)/1 var(--serif);color:var(--peach-dk)}
/* --k: o script acha a maior letra que cabe em cada página */
.pg-lista header{margin-bottom:2.6cqh}
.pg-lista h3{font-size:calc(clamp(24px,min(6.6cqh,9.4cqw),48px) * (.6 + var(--k,1) * .4));color:var(--terra)}
.pg-lista header p{font:italic 400 clamp(14px,min(3.2cqh,4.6cqw),21px)/1.2 var(--serif);color:var(--mar);margin:.6cqh 0 0}
.pg ul{list-style:none;margin:0;padding:0}
.pg li{padding:calc(clamp(3px,.9cqh,9px) * var(--k,1)) 0;border-bottom:1px solid var(--line)}
.pg li:last-child{border-bottom:0}
.row{display:flex;align-items:baseline;gap:8px}
.row b{font-weight:600;color:var(--ink);font-size:calc(clamp(13px,min(2.9cqh,4.2cqw),19px) * var(--k,1));line-height:1.2}
.row i{flex:1;border-bottom:1px dotted #CDBFA4;transform:translateY(-3px);min-width:12px}
.row strong{font:400 calc(clamp(14px,min(3.2cqh,4.6cqw),22px) * var(--k,1))/1 var(--serif);color:var(--terra);white-space:nowrap}
.pg-add{flex:none;align-self:center;margin:-6px 0 -6px 2px;display:grid;place-items:center;width:calc(clamp(20px,min(4cqh,5.8cqw),28px) * var(--k,1));aspect-ratio:1;padding:0;border-radius:50%;border:1px solid var(--terra);background:transparent;color:var(--terra);cursor:pointer;transition:background .25s,color .25s,transform .25s var(--ease)}
.pg-add:hover{background:var(--terra);color:#fff;transform:rotate(90deg)}
.pg-add .ic{width:58%;height:58%}
.pg small{display:block;color:var(--muted);font-size:calc(clamp(11.5px,min(2.45cqh,3.5cqw),15.5px) * var(--k,1));line-height:1.3;margin-top:.3cqh}
.pg small em{font-style:normal;font-weight:600;color:var(--peach-dk)}
.pg-nota{font:italic 400 clamp(15px,min(3.4cqh,4.8cqw),22px)/1.3 var(--serif);color:var(--ink-2);margin:auto 0 0;padding-top:3cqh}
.pg-beber{margin-top:2.2cqh;padding-top:2cqh;border-top:1px solid var(--line)}
.pg-beber h4{font:400 clamp(18px,min(4.4cqh,6.4cqw),30px)/1.05 var(--serif);color:var(--terra);margin:0 0 .8cqh}
.pg-beber p{font-size:clamp(12px,min(2.7cqh,3.9cqw),16.5px);line-height:1.4;color:var(--muted);margin:0}
.pg-fim .btn{align-self:flex-start;margin-top:2.4cqh}
.pg-aviso{font-size:clamp(10px,1.9cqh,12.5px);color:var(--muted);margin:auto 0 -4cqh;padding-top:1.6cqh;line-height:1.35}
.btn-sm{min-height:42px;padding:0 16px;font-size:13px}
.btn-sm .ic{width:16px;height:16px}
.pg-capa{justify-content:flex-start}
.pg-k{font-size:clamp(10px,2cqh,13px);font-weight:600;letter-spacing:.06em;color:var(--mar);margin:0 0 1.4cqh}
.pg-capa h3{font-size:clamp(40px,min(13cqh,19cqw),96px);color:var(--terra);line-height:.9}
.pg-sub{font:italic 400 clamp(15px,min(3.4cqh,5cqw),22px)/1.25 var(--serif);color:var(--ink-2);max-width:22ch;margin:2cqh 0 0}
.pg-siri{position:absolute;width:20cqw;right:8cqw;top:6cqh;transform:rotate(8deg)}
.cola{position:absolute;margin:0;background:#fff;padding:1.4cqh 1.4cqh 0;box-shadow:0 14px 26px -16px rgba(14,42,61,.55),0 1px 3px rgba(14,42,61,.12);transform:rotate(var(--rot,0deg))}
.cola::before{content:"";position:absolute;width:30%;height:4.6cqh;left:35%;top:-2.3cqh;background:rgba(159,214,226,.72);transform:rotate(-3deg);box-shadow:0 1px 2px rgba(0,0,0,.06)}
.cola img{width:100%;object-fit:cover;background:var(--sand)}
.cola figcaption{font:italic 400 clamp(12px,min(2.8cqh,4.2cqw),18px)/1.2 var(--serif);color:var(--ink-2);text-align:center;padding:1.2cqh 0 1.6cqh}
.c1{width:52cqw;left:24cqw;bottom:11cqh;--rot:-4deg}.c1 img{aspect-ratio:4/4.4}
.c2{--rot:-1.2deg}.c3{--rot:2deg}.c4{--rot:-2deg}.c5{--rot:2.2deg}.c6{--rot:1.8deg}.c7{--rot:-1.6deg}
.pg-fotos{display:grid;grid-template-columns:1fr 1fr;gap:4.4cqh 5cqw;padding-top:8cqh;padding-bottom:10cqh}
.pg-fotos.mista{grid-template-rows:minmax(0,1fr) minmax(0,1fr)}
.pg-fotos.mista .c2{grid-column:1/-1}
.pg-fotos.duas{grid-template-rows:minmax(0,1fr) auto}
.pg-fotos.duas .pg-frase{order:3;grid-column:1/-1;text-align:center;padding:0 4cqw}
.pg-fotos .cola{position:relative;inset:auto;width:auto;height:100%;min-height:0;display:flex;flex-direction:column}
.pg-fotos .cola img{flex:1 1 0;min-height:0;height:auto;width:100%}
.pg-frase{margin:0;align-self:center;font:italic 400 clamp(15px,min(3.6cqh,5.4cqw),25px)/1.3 var(--serif);color:var(--ink-2)}
.book-src .pg-fotos{display:block}
.book-src .pg-fotos .cola img{flex:none;aspect-ratio:4/3}
.book-src .pg-frase{position:static;transform:none;margin:12px 0;text-align:left}
.book-src .cola{position:relative;inset:auto;margin:18px auto;width:80%}
.book-src .pg-siri{width:80px}
@media (max-width:859px){.caps{display:none}.menu-dica{font-size:16px}}

/* um dia na casa: o sol anda conforme a rolagem */
.dia{position:relative;background:var(--cream)}
.js .dia{height:340vh}
.dia-pin{position:relative;overflow:hidden;color:var(--ink);transition:color .6s}
.js .dia-pin{position:sticky;top:0;height:100svh;min-height:600px}
.dia-ceu{position:absolute;inset:0;background:linear-gradient(180deg,#D3ECF3 0%,#E9F3EF 62%,#F6EEDD 100%)}
.ceu{position:absolute;inset:0}
.c-tarde{background:linear-gradient(180deg,#F7DAC4 0%,#EDAE8B 62%,#DD8962 100%);opacity:var(--tarde,0)}
.c-noite{background:linear-gradient(180deg,#081925 0%,#0E2A3D 60%,#1A4058 100%);opacity:var(--noite,0)}
.estrelas{position:absolute;inset:0 0 40% 0;opacity:var(--noite,0);background-image:radial-gradient(1.6px 1.6px at 8% 22%,#F4EFE1 50%,transparent 60%),radial-gradient(1.2px 1.2px at 22% 12%,#F4EFE1 50%,transparent 60%),radial-gradient(1.8px 1.8px at 36% 30%,#F4EFE1 50%,transparent 60%),radial-gradient(1.2px 1.2px at 52% 8%,#F4EFE1 50%,transparent 60%),radial-gradient(1.6px 1.6px at 64% 26%,#F4EFE1 50%,transparent 60%),radial-gradient(1.2px 1.2px at 78% 16%,#F4EFE1 50%,transparent 60%),radial-gradient(1.8px 1.8px at 90% 34%,#F4EFE1 50%,transparent 60%),radial-gradient(1.2px 1.2px at 44% 44%,#F4EFE1 50%,transparent 60%)}
.arco{position:absolute;left:6%;top:16%;width:88%;height:62%;overflow:visible}
.arco path{fill:none;stroke:currentColor;stroke-width:1.4;stroke-dasharray:2 10;opacity:.3}
.astro{position:absolute;left:calc(6% + 88% * var(--sx,.04));top:calc(16% + 62% * var(--sy,.95));width:clamp(64px,7vw,104px);aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle at 42% 40%,#F6BE98 0%,#E3774D 55%,#CA603C 100%);box-shadow:0 0 0 22px rgba(228,167,133,.18),0 0 0 48px rgba(228,167,133,.08);opacity:calc(.9 - var(--noite,0))}
.lua{position:absolute;right:14%;top:18%;width:58px;aspect-ratio:1;border-radius:50%;box-shadow:inset -15px 8px 0 0 #F4EFE1;opacity:var(--noite,0);transform:rotate(-20deg)}
.dia-mar{position:absolute;left:0;bottom:0;width:100%;height:14%;fill:var(--turq);opacity:.45;transition:fill .8s,opacity .8s}
.dia[data-fase="noite"] .dia-mar{fill:#123850;opacity:1}
.dia-in{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr auto;column-gap:clamp(30px,6vw,90px);padding-top:clamp(96px,12vh,130px);padding-bottom:clamp(24px,5vh,48px)}
.js .dia-in{height:100%}
.dia-head{grid-column:1/-1}
.dia-head h2{color:inherit;font-size:clamp(40px,5vw,72px);margin-bottom:10px}
.dia[data-fase="noite"] .dia-pin{color:var(--cream)}
.dia[data-fase="noite"] .apoio,.dia[data-fase="noite"] .hora{color:var(--peach)}
.dia-fotos{position:relative;min-height:0}
.dia-foto{margin:0 0 24px;background:#fff;padding:10px;border-radius:3px;box-shadow:0 34px 60px -34px rgba(27,23,20,.7)}
.dia-foto img{display:block;width:auto;height:auto;max-width:min(320px,100%);max-height:min(calc(100svh - 360px),470px)}
.dia-foto.larga img{max-width:min(580px,100%)}
.js .dia-foto{position:absolute;left:0;right:0;top:50%;width:fit-content;margin:0 auto;opacity:0;transform:translateY(-44%) scale(.96);transition:opacity .8s var(--ease),transform 1s var(--ease)}
.js .dia-foto.on{opacity:1;transform:translateY(-50%)}
.js .dia-foto.antes{opacity:0;transform:translate(-8%,-54%) scale(.96)}
.dia-txts{align-self:center}
.js .dia-txts{display:grid}
.dia-txt{margin-bottom:30px}
.js .dia-txt{grid-area:1/1;margin:0;opacity:0;transform:translateY(30px);transition:opacity .7s var(--ease),transform .9s var(--ease);pointer-events:none}
.js .dia-txt.on{opacity:1;transform:none;pointer-events:auto}
.dia-txt .hora{font:italic 400 26px/1 var(--serif);color:var(--graphite);margin-bottom:12px;transition:color .6s}
.dia-txt h3{font-size:clamp(44px,4.6vw,68px);line-height:.95;margin-bottom:8px}
.dia-prato{font:italic 400 clamp(22px,2vw,28px)/1.2 var(--serif);color:var(--terra);margin-bottom:18px;transition:color .6s}
.dia[data-fase="noite"] .dia-prato{color:var(--peach)}
.dia-txt p:last-child{font-size:clamp(17px,1.4vw,20px);max-width:38ch;opacity:.86}
.dia-linha{display:none}
.js .dia-linha{grid-column:1/-1;position:relative;display:flex;justify-content:space-between;padding-top:22px}
.dia-barra{position:absolute;left:0;right:0;top:0;height:2px;background:currentColor;opacity:.18}
.dia-barra i{position:absolute;inset:0;background:var(--terra);transform-origin:0 50%;transform:scaleX(var(--p,0))}
.dia-linha button{background:none;border:0;padding:4px 0;font:500 13px/1 var(--sans);letter-spacing:.16em;text-transform:uppercase;opacity:.55;cursor:pointer;transition:opacity .3s,color .3s}
.dia-linha button.on{opacity:1;color:var(--terra)}
.dia[data-fase="noite"] .dia-linha button.on{color:var(--peach)}
@media (max-width:860px){
  .dia-in{grid-template-columns:1fr;grid-template-rows:auto 1fr auto auto;padding-top:92px}
  .dia-head h2{font-size:38px}
  .dia-head .apoio{margin-bottom:8px}
  .dia-foto img{max-width:min(200px,100%);max-height:calc(100svh - 470px)}
  .dia-foto.larga img{max-width:min(320px,100%)}
  .dia-txt h3{font-size:34px;margin-bottom:4px}
  .dia-prato{font-size:19px;margin-bottom:8px}
  .dia-txt .hora{font-size:20px;margin-bottom:6px}
  .dia-txt p:last-child{font-size:16px}
  .js .dia-txts{min-height:190px;align-self:end}
}

/* cardápio */
.cardapio{background:var(--white)}
.card-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:20px 40px;margin-bottom:30px}
.card-head h2{margin:0}
.trilho-ctl{display:flex;align-items:center;gap:22px}
.trilho-ctl p{margin:0;color:var(--muted);max-width:26ch;font-size:15px;line-height:1.45}
.trilho-ctl>div{display:flex;gap:10px}
.trilho-ctl button{background:transparent}
.trilho{overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;cursor:grab;outline-offset:-3px}
.trilho::-webkit-scrollbar{display:none}
.trilho.arrasta{cursor:grabbing;scroll-snap-type:none}
.trilho.arrasta img{pointer-events:none}
.trilho ul{display:flex;gap:clamp(16px,2vw,26px);width:max-content;list-style:none;margin:0;padding:8px max(var(--gut),calc((100vw - var(--wrap)) / 2 + var(--gut))) 26px}
.prato{width:clamp(240px,25vw,320px);scroll-snap-align:start;scroll-margin-left:max(var(--gut),calc((100vw - var(--wrap)) / 2 + var(--gut)))}
.prato figure{margin:0 0 16px;aspect-ratio:4/5;overflow:hidden;border-radius:var(--r);background:var(--sand);box-shadow:0 26px 40px -30px rgba(27,23,20,.6)}
.prato img{width:100%;height:100%;object-fit:cover;transition:transform .9s var(--ease);user-select:none;-webkit-user-drag:none}
.prato:hover img{transform:scale(1.06)}
.prato h3{font-size:27px;margin-bottom:6px;color:var(--ink)}
.prato p{color:var(--muted);font-size:15px;line-height:1.45;margin-bottom:12px;min-height:2.9em}
.prato-pe{display:flex;align-items:center;justify-content:space-between}
.prato-pe strong{font:400 26px/1 var(--serif);color:var(--terra)}
.add-mini{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;border:0;background:var(--terra);color:#fff;cursor:pointer;transition:background .25s,transform .25s var(--ease)}
.add-mini:hover{background:var(--terra-dk);transform:rotate(90deg)}
.add-mini .ic{width:20px;height:20px}
.trilho-prog{position:relative;height:2px;background:var(--line);overflow:hidden}
.trilho-prog i{position:absolute;top:0;bottom:0;left:0;width:var(--w,30%);transform:translateX(var(--x,0));background:var(--terra);transition:transform .15s linear}
@media (max-width:860px){.trilho-ctl p{display:none}}

/* a casa */
.casa{background:var(--cream)}
.casa-in{display:grid;grid-template-columns:1fr 1.05fr;gap:clamp(40px,7vw,100px);align-items:center}
.casa-txt>p{color:var(--muted)}
.casa blockquote{margin:30px 0 0;padding:0}
.casa blockquote p{font:italic 400 clamp(22px,2vw,26px)/1.4 var(--serif);color:var(--ink);margin:0}
.casa cite{display:block;margin-top:12px;font:500 13px/1.2 var(--sans);font-style:normal;letter-spacing:.16em;text-transform:uppercase;color:var(--mar)}
.casa-fotos{position:relative;height:clamp(480px,50vw,640px)}
.cf{position:absolute;margin:0;background:#fff;padding:10px;border-radius:3px;box-shadow:0 34px 60px -36px rgba(27,23,20,.7)}
.cf img{width:100%;height:100%;object-fit:cover}
.cf1{left:0;top:4%;width:46%;height:60%;rotate:-4deg}
.cf2{right:2%;top:0;width:36%;height:54%;rotate:5deg}
.cf3{left:24%;bottom:2%;width:46%;height:50%;rotate:-1deg;z-index:2}
.cf1 img{object-position:50% 70%}
.selo-gira{position:absolute;right:2%;bottom:4%;z-index:3;display:grid;place-items:center;width:clamp(124px,12vw,156px);aspect-ratio:1;border-radius:50%;background:var(--mar);color:var(--cream);box-shadow:0 20px 40px -20px rgba(27,23,20,.7)}
.selo-txt{position:absolute;inset:0;width:100%;height:100%;animation:gira 28s linear infinite}
.selo-txt text{font-size:14px}
.selo-gira img{position:relative;width:38%}
@keyframes gira{to{transform:rotate(360deg)}}
.selo-nota{display:grid;grid-template-columns:minmax(220px,auto) 1fr;gap:8px 40px;align-items:baseline;margin-top:clamp(50px,6vw,80px);padding-top:28px;border-top:1px solid var(--line)}
.selo-nota h3{font-size:clamp(28px,3vw,38px);color:var(--ink)}
.selo-nota p{margin:0;color:var(--muted);max-width:60ch}
@media (max-width:900px){.casa-in{grid-template-columns:1fr}.casa-fotos{height:min(560px,120vw)}.selo-nota{grid-template-columns:1fr}}

/* reservas */
.reserva{position:relative;background:var(--noite);color:var(--cream);padding:calc(var(--sec) + 50px) 0 var(--sec);overflow:hidden}
.reserva-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.12}
.onda-topo{position:absolute;top:-1px;left:0;width:100%;height:clamp(36px,5vw,70px);fill:var(--cream);z-index:1}
.reserva-in{position:relative;z-index:2;display:grid;grid-template-columns:1fr .92fr;gap:clamp(36px,6vw,90px);align-items:start}
.reserva h2{color:var(--white)}
.reserva .apoio{color:var(--espuma)}
.reserva-txt>p{color:rgba(244,239,225,.8);max-width:46ch}
.formatos{display:grid;gap:10px;margin:30px 0 22px}
.formato{position:relative;display:grid;grid-template-columns:1fr auto;gap:4px 18px;align-items:center;padding:18px 22px;border:1px solid rgba(244,239,225,.2);border-radius:var(--r);cursor:pointer;transition:background .3s,color .3s,border-color .3s,transform .3s var(--ease)}
.formato:hover{border-color:rgba(244,239,225,.5)}
.formato input{position:absolute;opacity:0;pointer-events:none}
.formato:focus-within{outline:2px solid var(--peach);outline-offset:2px}
.formato.sel{background:var(--cream);color:var(--ink);border-color:var(--cream);transform:translateX(8px)}
.f-nome{font:400 28px/1 var(--serif)}
.f-para{grid-row:2;font-size:15px;color:var(--espuma)}
.formato.sel .f-para{color:var(--mar)}
.f-valor{grid-row:1/3;grid-column:2;font-size:14px;font-weight:600;text-align:right}
@keyframes painel{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.condicoes{list-style:none;margin:0;padding:0;animation:painel .5s var(--ease)}
.condicoes li{display:flex;gap:12px;align-items:baseline;margin-bottom:10px;color:rgba(244,239,225,.86);font-size:16px;line-height:1.45}
.condicoes svg{flex:none;width:22px;color:var(--espuma);transform:translateY(-2px)}
.reserva-form{background:var(--cream);color:var(--ink);padding:clamp(24px,3.4vw,42px);border-radius:6px;box-shadow:0 50px 80px -40px rgba(0,0,0,.8)}
.reserva-form h3{font-size:clamp(32px,3vw,40px);color:var(--terra);margin-bottom:22px}
.campo{display:grid;gap:7px;margin-bottom:16px;min-width:0}
.campo label,.campo .rot{font-size:14px;font-weight:600}
.campo small{font-weight:400;color:var(--muted)}
.campo input,.campo select,.campo textarea{width:100%;min-height:52px;border:1px solid #D8CCB4;border-radius:var(--r);background:#fff;padding:0 14px;font:400 16px/1.3 var(--sans);color:var(--ink);transition:border-color .2s,box-shadow .2s}
.campo textarea{padding:13px 14px;resize:vertical;min-height:72px}
.campo input:focus,.campo select:focus,.campo textarea:focus{outline:none;border-color:var(--terra);box-shadow:0 0 0 3px rgba(202,96,60,.18)}
.campo.erro input,.campo.erro select{border-color:var(--terra);box-shadow:0 0 0 3px rgba(202,96,60,.18)}
.campos2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.campo-aviso{margin:-6px 0 14px;font-size:14px;font-weight:600;color:var(--terra-dk)}
.stepper{display:grid;grid-template-columns:52px 1fr 52px;border:1px solid #D8CCB4;border-radius:var(--r);background:#fff;overflow:hidden}
.stepper button{display:grid;place-items:center;border:0;background:none;color:var(--terra);cursor:pointer;transition:background .2s}
.stepper button:hover{background:var(--blush)}
.stepper .ic{width:18px;height:18px}
.stepper input{border:0;min-height:50px;text-align:center;font-weight:700;font-size:18px;-moz-appearance:textfield;appearance:textfield}
.stepper input::-webkit-inner-spin-button,.stepper input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.stepper input:focus{box-shadow:none}
.btn-cheio{width:100%;margin-top:6px}
.form-nota{font-size:13px;color:var(--muted);margin:12px 0 0;text-align:center}
.pagamento{position:relative;z-index:2;display:flex;flex-wrap:wrap;justify-content:center;gap:8px 26px;margin:clamp(40px,5vw,64px) 0 0;font-size:15px;color:rgba(244,239,225,.75);text-align:center}
.pagamento strong{color:var(--cream)}
@media (max-width:900px){.reserva-in{grid-template-columns:1fr}.formato.sel{transform:none}}
@media (max-width:420px){.campos2{grid-template-columns:1fr}}

/* perguntas */
.duvidas{background:var(--white)}
.faq-in{display:grid;grid-template-columns:.8fr 1.4fr;gap:clamp(28px,6vw,90px);align-items:start}
.faq-in .side{position:sticky;top:110px}
.faq-in .side p{color:var(--muted)}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:20px;align-items:center;padding:22px 0;font:400 clamp(21px,2vw,26px)/1.25 var(--serif);color:var(--ink);transition:color .2s}
.faq summary:hover{color:var(--terra)}
.faq summary::-webkit-details-marker{display:none}
.faq summary .ic{flex:none;width:22px;height:22px;color:var(--terra);transition:transform .4s var(--ease)}
.faq details[open] summary .ic{transform:rotate(135deg)}
.faq-r{overflow:hidden}
.faq-r p{color:var(--muted);margin:0;padding:0 44px 24px 0}
@media (max-width:900px){.faq-in{grid-template-columns:1fr}.faq-in .side{position:static}}

/* rodapé com mapa */
.ftr{position:relative;background:var(--noite);color:rgba(244,239,225,.78);padding:calc(var(--sec) + 30px) 0 30px;font-size:15px;overflow:hidden}
.ftr .onda-topo{fill:var(--white)}
.visite{display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(32px,6vw,80px);align-items:center;margin-bottom:clamp(60px,8vw,100px)}
.visite .apoio{color:var(--espuma)}
.visite h2{color:var(--cream);font-size:clamp(40px,4.6vw,64px)}
.visite address{font-style:normal;font-size:19px;color:var(--cream);margin-bottom:6px}
.visite .ref{color:rgba(244,239,225,.65)}
.horas{width:100%;border-collapse:collapse;margin-top:20px}
.horas th,.horas td{padding:13px 0;border-bottom:1px solid rgba(244,239,225,.12);font-weight:400;text-align:left}
.horas td{text-align:right;font-weight:600;color:var(--cream)}
.horas .fechado{color:rgba(244,239,225,.5);font-weight:400}
.horas tr.hoje th,.horas tr.hoje td{color:var(--peach)}
.horas .hoje-tag{font-weight:600}
.mapc{position:relative;height:clamp(340px,36vw,440px);border-radius:6px;overflow:hidden;background:#F4EFE1;box-shadow:0 40px 70px -40px rgba(0,0,0,.9)}
.mapc .map-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.2s var(--ease)}
.mapc:hover .map-img{transform:scale(1.06)}
.mapc .map-pin{position:absolute;left:50%;top:50%;z-index:2;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;background:var(--terra);border:4px solid #fff;box-shadow:0 8px 18px -6px rgba(202,96,60,.8)}
.mapc .map-pin::before{content:"";position:absolute;inset:-10px;border-radius:50%;border:3px solid rgba(202,96,60,.55);animation:mapPing 2.2s ease-out infinite}
.mapc .map-pin b{position:absolute;left:24px;top:-5px;white-space:nowrap;font:600 14px/1.4 var(--sans);color:var(--terra-dk);text-shadow:0 0 4px #fff,0 0 4px #fff,0 0 2px #fff}
@keyframes mapPing{from{transform:scale(.7);opacity:1}to{transform:scale(1.7);opacity:0}}
.mapc .map-info{position:absolute;left:14px;top:14px;z-index:3;display:grid;gap:3px;max-width:290px;padding:16px 18px;border-radius:var(--r);background:#fff;color:var(--ink);box-shadow:0 14px 30px -12px rgba(0,0,0,.5)}
.mapc .map-info b{font:400 22px/1.1 var(--serif);color:var(--ink)}
.mapc .map-info span{font-size:13px;line-height:1.4;color:var(--muted)}
.mapc .mbtns{display:flex;gap:6px;margin-top:10px}
.mapc .mbtns a{display:inline-flex;align-items:center;gap:7px;padding:10px 14px;border-radius:var(--r);background:var(--terra);color:#fff;font:600 13px/1 var(--sans);text-decoration:none;transition:transform .3s var(--ease),background .3s}
.mapc .mbtns a:hover{transform:translateY(-2px);background:var(--terra-dk);color:#fff}
.mapc .mbtns a.sq{padding:10px;background:#FBE9DD;color:var(--terra-dk)}
.mapc .mbtns a.sq:hover{background:#F6D7C3;color:var(--terra-dk)}
.mapc .mbtns svg{width:16px;height:16px}
.mapc .map-attr{position:absolute;right:8px;bottom:6px;z-index:3;font-size:11px;line-height:1.4;padding:2px 6px;border-radius:3px;background:rgba(255,255,255,.85);color:var(--ink)}
.mapc .map-attr a{color:var(--ink)}
@media (max-width:600px){
  .mapc .map-info{left:10px;right:10px;top:10px;max-width:none}
  .mapc .map-img{inset:0 0 auto 0;height:128%}
  .mapc .map-pin{top:66%}
}
.ftr-grid{display:grid;grid-template-columns:1.6fr 1fr 1.2fr;gap:32px;padding-top:44px;border-top:1px solid rgba(244,239,225,.12)}
.ftr .brand{color:var(--cream);margin-bottom:16px}
.ftr .brand img{width:44px}
.ftr .brand span{font-size:30px}
.ftr .brand em{color:var(--peach)}
.ftr h3{font:600 12px/1 var(--sans);letter-spacing:.18em;text-transform:uppercase;margin-bottom:18px;color:var(--peach)}
.ftr ul{list-style:none;margin:0;padding:0}
.ftr li{margin-bottom:9px}
.ftr a{text-decoration:none;transition:color .2s}
.ftr a:hover{color:var(--peach)}
.ftr-grid p{color:rgba(244,239,225,.7);max-width:32ch}
.redes{display:flex;gap:12px;margin-top:16px}
.redes a{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;border:1px solid rgba(228,167,133,.45);color:var(--peach);transition:background .25s,color .25s,border-color .25s}
.redes a:hover{background:var(--peach);border-color:var(--peach);color:var(--ink)}
.redes .ic{width:20px;height:20px}
.ftr-bot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin-top:48px;padding-top:22px;border-top:1px solid rgba(244,239,225,.12);color:rgba(244,239,225,.5);font-size:13px;letter-spacing:.03em}
@media (max-width:900px){.visite{grid-template-columns:1fr}.ftr-grid{grid-template-columns:1fr 1fr}.ftr-grid>div:first-child{grid-column:1/-1}}
@media (max-width:520px){.ftr-grid{grid-template-columns:1fr}}

/* sacola de pedido */
.sacola{position:fixed;left:50%;bottom:clamp(10px,2vw,22px);z-index:70;width:min(580px,calc(100% - 20px));background:var(--noite);color:var(--cream);border-radius:6px;box-shadow:0 26px 50px -18px rgba(27,23,20,.75);transform:translate(-50%,160%);transition:transform .55s var(--ease)}
.sacola.on{transform:translate(-50%,0)}
.sacola-bar{display:flex;align-items:center;gap:10px;padding:10px 10px 10px 18px}
.sacola-ver{flex:1;display:grid;gap:3px;text-align:left;background:none;border:0;padding:4px 0;cursor:pointer;min-width:0}
.sacola-ver b{font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:rgba(244,239,225,.75)}
.sacola-ver span{font:400 26px/1 var(--serif);color:var(--peach)}
.sacola-limpar{background:none;border:0;color:rgba(244,239,225,.6);font-size:14px;text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:10px 6px}
.sacola-limpar:hover{color:var(--cream)}
.sacola .btn{min-height:48px;padding:0 18px}
.sacola-lista{max-height:44vh;overflow:auto;padding:16px 18px 8px;border-bottom:1px solid rgba(244,239,225,.14)}
.sacola-lista ul{list-style:none;margin:0;padding:0}
.sacola-lista li{display:flex;justify-content:space-between;gap:16px;padding:7px 0;font-size:15px}
.sacola-lista li span:last-child{color:var(--peach);white-space:nowrap}
.sacola.pulo{animation:pulo .45s var(--ease)}
@keyframes pulo{0%,100%{transform:translate(-50%,0)}40%{transform:translate(-50%,-8px)}}
@media (max-width:520px){.sacola .btn span{display:none}.sacola .btn{width:52px;padding:0}.sacola-limpar{padding:10px 2px}}
.toast{position:fixed;left:50%;bottom:108px;z-index:80;margin:0;padding:12px 18px;border-radius:var(--r);background:var(--cream);color:var(--ink);font-size:15px;font-weight:600;box-shadow:0 18px 40px -16px rgba(27,23,20,.6);transform:translate(-50%,20px);opacity:0;pointer-events:none;transition:opacity .3s,transform .4s var(--ease)}
.toast.on{opacity:1;transform:translate(-50%,0)}

/* WhatsApp flutuante */
.wa-float{position:fixed;right:clamp(14px,2.5vw,28px);bottom:clamp(14px,2.5vw,28px);z-index:60;display:grid;place-items:center;width:60px;height:60px;border-radius:50%;background:var(--terra);color:#fff;box-shadow:0 14px 30px -10px rgba(27,23,20,.55);transition:transform .35s var(--ease),background .2s,opacity .3s}
.wa-float:hover{transform:translateY(-3px) rotate(-8deg);background:var(--terra-dk)}
.wa-float .ic{width:28px;height:28px}
.tem-pedido .wa-float{opacity:0;transform:translateY(90px);pointer-events:none}

/* entrada ao rolar */
.js .rv{opacity:0;transform:translateY(34px);transition:opacity .9s var(--ease),transform 1s var(--ease)}
.js .rv.in{opacity:1;transform:none}
.js .trilho .prato{opacity:0;transform:translateX(40px);transition:opacity .8s var(--ease),transform .9s var(--ease);transition-delay:calc(var(--k,0) * 90ms)}
.js .trilho.in .prato{opacity:1;transform:none}

/* botão de tema no topo */
.hdr .tema-btn{color:var(--ink)}
.hdr:not(.solid):not(.open) .tema-btn{color:var(--mar-dk)}
@media (max-width:960px){.hdr-in{gap:12px}}

/* tema escuro: noite no mar. O papel do livro, os postais, as molduras das fotos e o mapa continuam claros */
html[data-theme="dark"]{--line:#25424F;--text:#DCE6E8;--muted:#A3B7BE;--blush:#1E3A4A}
html[data-theme="dark"] .pg,html[data-theme="dark"] .mapc{--line:#E6DCC8;--text:#2A2420;--muted:#6E6258}
html[data-theme="dark"] body{background:#0B1822}
html[data-theme="dark"] h2{color:#E27852}
html[data-theme="dark"] .apoio,html[data-theme="dark"] .capa-local,html[data-theme="dark"] .casa cite{color:var(--espuma)}
html[data-theme="dark"] .hdr.solid,html[data-theme="dark"] .hdr.open{background:rgba(11,24,34,.94);box-shadow:0 10px 30px -20px rgba(0,0,0,.9)}
html[data-theme="dark"] .hdr .brand,html[data-theme="dark"] .hdr .nav a,html[data-theme="dark"] .hdr .menu-btn,html[data-theme="dark"] .hdr .tema-btn,
html[data-theme="dark"] .hdr:not(.solid):not(.open) .brand,html[data-theme="dark"] .hdr:not(.solid):not(.open) .nav a,html[data-theme="dark"] .hdr:not(.solid):not(.open) .menu-btn,html[data-theme="dark"] .hdr:not(.solid):not(.open) .tema-btn{color:var(--cream)}
html[data-theme="dark"] .hdr .nav a:hover{color:var(--peach)}
html[data-theme="dark"] .btn-linha,html[data-theme="dark"] .btn-linha-escura{border-color:rgba(244,239,225,.42);color:var(--cream);background:transparent}
html[data-theme="dark"] .btn-linha:hover,html[data-theme="dark"] .btn-linha-escura:hover{background:var(--cream);border-color:var(--cream);color:var(--noite)}
html[data-theme="dark"] .capa{background:#0B1822;color:var(--cream)}
html[data-theme="dark"] .capa-veu{background:linear-gradient(90deg,rgba(11,24,34,.94) 0%,rgba(11,24,34,.84) 30%,rgba(11,24,34,.42) 52%,rgba(11,24,34,.08) 70%),linear-gradient(180deg,rgba(11,24,34,.75) 0%,rgba(11,24,34,0) 20%)}
html[data-theme="dark"] .capa h1{color:var(--cream)}
html[data-theme="dark"] .capa h1 em{color:#E27852}
html[data-theme="dark"] .capa-texto{color:#BFD2D8}
html[data-theme="dark"] .capa-status{color:var(--peach)}
html[data-theme="dark"] .capa .btn-linha{border-color:rgba(159,214,226,.45);background:rgba(11,24,34,.45);color:var(--cream)}
html[data-theme="dark"] .capa .btn-linha:hover{background:var(--cream);color:var(--noite)}
html[data-theme="dark"] .capa-borda,html[data-theme="dark"] .onda-topo{fill:#0B1822}
html[data-theme="dark"] .ftr .onda-topo{fill:#0F2230}
html[data-theme="dark"] .capa .postais-ctl button,html[data-theme="dark"] .trilho-ctl button{border-color:rgba(159,214,226,.35);background:rgba(11,24,34,.75);color:var(--cream)}
html[data-theme="dark"] .postais-ctl button:hover,html[data-theme="dark"] .trilho-ctl button:hover{background:var(--cream);border-color:var(--cream);color:var(--noite)}
html[data-theme="dark"] .postal figure,html[data-theme="dark"] .dia-foto,html[data-theme="dark"] .cf{box-shadow:0 34px 60px -30px rgba(0,0,0,.95)}
html[data-theme="dark"] .dia{background:#0B1822}
html[data-theme="dark"] .dia-pin{color:var(--cream)}
html[data-theme="dark"] .dia-ceu{background:linear-gradient(180deg,#1B4C64 0%,#1F5468 62%,#2D5A63 100%)}
html[data-theme="dark"] .c-tarde{background:linear-gradient(180deg,#5A3A3A 0%,#8E4F3C 62%,#A85A3C 100%)}
html[data-theme="dark"] .dia-txt .hora{color:var(--peach)}
html[data-theme="dark"] .dia-prato,html[data-theme="dark"] .dia-linha button.on{color:var(--peach)}
html[data-theme="dark"] .dia-mar{fill:#0E2A3D;opacity:.7}
html[data-theme="dark"] .cardapio,html[data-theme="dark"] .duvidas{background:#0F2230}
html[data-theme="dark"] .casa{background:#0B1822}
html[data-theme="dark"] .prato h3,html[data-theme="dark"] .casa blockquote p,html[data-theme="dark"] .selo-nota h3,html[data-theme="dark"] .faq summary{color:var(--cream)}
html[data-theme="dark"] .faq summary:hover{color:var(--peach)}
html[data-theme="dark"] .prato-pe strong{color:#E27852}
html[data-theme="dark"] .prato figure{box-shadow:0 26px 40px -26px rgba(0,0,0,.9)}
html[data-theme="dark"] .reserva-form{background:#132C3B;color:var(--cream);box-shadow:0 50px 80px -40px rgba(0,0,0,.95),inset 0 0 0 1px #25424F}
html[data-theme="dark"] .reserva-form h3{color:#E27852}
html[data-theme="dark"] .campo input,html[data-theme="dark"] .campo select,html[data-theme="dark"] .campo textarea,html[data-theme="dark"] .stepper{background:#0B1822;border-color:#2F5062;color:var(--cream)}
html[data-theme="dark"] .stepper input{background:transparent;color:var(--cream)}
html[data-theme="dark"] .stepper button{color:var(--peach)}
html[data-theme="dark"] .campo-aviso{color:var(--peach)}
html[data-theme="dark"] .ftr{background:#071219}
html[data-theme="dark"] .sacola{background:#132C3B;box-shadow:0 26px 50px -18px rgba(0,0,0,.9),inset 0 0 0 1px #25424F}
html[data-theme="dark"] .wa-float{box-shadow:0 14px 30px -10px rgba(0,0,0,.8)}
@media (max-width:900px){html[data-theme="dark"] .capa-veu{background:linear-gradient(180deg,rgba(11,24,34,.93) 0%,rgba(11,24,34,.84) 58%,rgba(11,24,34,.4) 100%)}}
@media (max-width:960px){html[data-theme="dark"] .nav{background:#0B1822;box-shadow:0 30px 40px -30px rgba(0,0,0,.9)}}

@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation:none!important;transition-duration:.01s!important;transition-delay:0s!important}
  .js .ent,.js .rv,.js .trilho .prato{opacity:1;transform:none}
}
`;
module.exports = { css };
