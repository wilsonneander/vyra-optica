// CSS do modelo Bronze (site enxuto de uma página). Embutido no <head> para carregar sem pedidos extras.
const css = `
:root{
  --ink:#1B1714;--ink-2:#2A2420;--graphite:#3F3E3B;--text:#2A2420;--muted:#6B6158;
  --cream:#F4EFE1;--sand:#EBE3D0;--white:#FFFFFF;--line:#E3D9C5;
  --terra:#CA603C;--terra-dk:#A94B2B;--peach:#E4A785;--peach-dk:#B8714F;
  --serif:'Gloock',Georgia,'Times New Roman',serif;
  --sans:'Figtree',Arial,Helvetica,sans-serif;
  --wrap:1180px;--gut:clamp(16px,4vw,40px);
  --sec:clamp(64px,8vw,120px);
  --r:4px;
}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--white);color:var(--text);font:400 17px/1.65 var(--sans);overflow-x:hidden}
img,svg{display:block;max-width:100%}
img{height:auto}
a{color:inherit}
h1,h2,h3{font-family:var(--serif);font-weight:400;line-height:1.05;margin:0;letter-spacing:-.01em}
p{margin:0 0 1em}
.wrap{width:100%;max-width:var(--wrap);margin:0 auto;padding:0 var(--gut)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skip{position:absolute;left:12px;top:-60px;z-index:100;background:var(--terra);color:#fff;padding:10px 16px;border-radius:var(--r);text-decoration:none}
.skip:focus{top:12px}
:focus-visible{outline:2px solid var(--terra);outline-offset:3px}

/* botões */
.btn{display:inline-flex;align-items:center;gap:10px;min-height:50px;padding:0 26px;border-radius:var(--r);font:600 15px/1 var(--sans);letter-spacing:.02em;text-decoration:none;border:2px solid transparent;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .2s}
.btn:hover{transform:translateY(-1px)}
.btn .ic{width:19px;height:19px}
.btn-siri{background:var(--terra);color:#fff}
.btn-siri:hover{background:var(--terra-dk)}
.btn-line{border:1px solid rgba(244,239,225,.55);color:var(--cream)}
.btn-line:hover{background:var(--cream);color:var(--ink);border-color:var(--cream)}
.btn-ink{background:var(--ink);color:var(--cream)}
.btn-ink:hover{background:var(--graphite)}
.btn-wa{background:var(--terra);color:#fff}
.btn-wa:hover{background:var(--terra-dk)}

/* topo */
.hdr{position:fixed;inset:0 0 auto;z-index:50;transition:background .3s,box-shadow .3s}
.hdr.solid{background:var(--graphite);box-shadow:0 1px 0 rgba(228,167,133,.18)}
@supports (backdrop-filter:blur(8px)){.hdr.solid{background:rgba(63,62,59,.9);backdrop-filter:blur(10px)}}
.hdr-in{display:flex;align-items:center;gap:24px;height:76px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--cream);margin-right:auto}
.brand img{width:34px;height:auto}
.brand span{font:400 23px/1 var(--serif)}
.nav{display:flex;gap:28px}
.nav a{color:var(--cream);text-decoration:none;font-size:14px;font-weight:500;letter-spacing:.04em;opacity:.86;padding:6px 0;border-bottom:2px solid transparent}
.nav a:hover{opacity:1;color:var(--peach);border-color:var(--peach)}
.hdr .btn{min-height:42px;padding:0 18px;font-size:15px}
.menu-btn{display:none;background:none;border:0;color:var(--cream);width:44px;height:44px;padding:10px;cursor:pointer}
.menu-btn .ic{width:24px;height:24px}
.menu-btn .i-close,.hdr.open .menu-btn .i-open{display:none}
.hdr.open .menu-btn .i-close{display:block}
@media (max-width:900px){
  .nav{position:fixed;inset:76px 0 auto;flex-direction:column;gap:0;background:var(--graphite);padding:8px var(--gut) 24px;transform:translateY(-12px);opacity:0;visibility:hidden;transition:.25s}
  .nav.open{transform:none;opacity:1;visibility:visible}
  .nav a{font-size:20px;padding:14px 0;border-bottom:1px solid rgba(244,239,225,.12)}
  .menu-btn{display:block}
  .hdr .btn-wa{display:none}
  .hdr.open{background:var(--graphite)}
}

/* hero */
.hero{position:relative;min-height:min(100svh,920px);display:grid;align-items:end;color:var(--cream);background:var(--ink);overflow:hidden}
.hero-bg{position:absolute;inset:0}
.hero-bg img{width:100%;height:100%;object-fit:cover;opacity:.62}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(28,23,20,.75) 0%,rgba(28,23,20,.15) 38%,rgba(28,23,20,.55) 70%,var(--ink) 100%)}
.hero-in{position:relative;z-index:2;display:grid;grid-template-columns:1fr auto;align-items:end;gap:24px;padding-top:120px;padding-bottom:clamp(40px,6vw,72px)}
.hero h1{font-size:clamp(76px,15vw,200px);line-height:.86;letter-spacing:-.025em}
.hero h1 span{display:block}
.hero h1 .l2{color:var(--terra);padding-left:.42em}
.hero-line{font:400 clamp(22px,2.6vw,34px)/1.2 var(--serif);margin:28px 0 14px;max-width:22ch}
.hero-line em{font-style:normal;color:var(--peach)}
.hero-txt{max-width:46ch;color:rgba(244,239,225,.82);margin-bottom:28px}
.hero-cta{display:flex;flex-wrap:wrap;gap:12px}
.mascote{width:clamp(150px,22vw,300px);filter:drop-shadow(0 18px 30px rgba(0,0,0,.45));margin-bottom:-6px}
.hero-info{position:relative;z-index:2;border-top:1px solid rgba(244,239,225,.16)}
.hero-info .wrap{display:flex;flex-wrap:wrap;gap:8px 40px;padding-top:18px;padding-bottom:18px;font-size:15px;color:rgba(244,239,225,.8)}
.hero-info strong{color:var(--cream);font-weight:600}
.hero-info .agora{color:var(--peach);font-weight:600}
.hero-info a{text-decoration:none}
.hero-info a:hover{color:var(--cream)}
@media (max-width:760px){
  .hero-in{grid-template-columns:1fr}
  .mascote{order:-1;justify-self:end;width:104px;margin:0 0 -78px}
  .hero-in{padding-top:96px;gap:0}
  .hero h1 .l2{padding-left:0}
}

/* destaques com ilustração */
.sec{padding:var(--sec) 0;position:relative;overflow:hidden}
.cream{background:var(--cream)}
.sand{background:var(--sand)}
.white{background:var(--white)}
.alga{position:absolute;width:150px;color:var(--peach);opacity:.55;pointer-events:none}
.alga.tr{right:-20px;top:-10px;transform:rotate(18deg)}
.alga.bl{left:-30px;bottom:-30px;transform:scaleX(-1) rotate(10deg)}
.alga.br{right:-30px;bottom:-40px}
.duo{display:grid;grid-template-columns:1fr 70px 1fr;gap:clamp(24px,5vw,72px);align-items:center;text-align:center}
.duo article{display:flex;flex-direction:column;align-items:center}
.duo .ill{width:min(280px,80%);color:var(--graphite);margin-bottom:14px}
.duo h2{font-size:clamp(34px,4vw,48px);margin-bottom:14px;color:var(--terra)}
.duo p{max-width:40ch;color:var(--muted)}
.duo .neck{width:62px;color:var(--peach)}
@media (max-width:760px){.duo{grid-template-columns:1fr}.duo .neck{display:none}}

/* boas-vindas */
.welcome{text-align:center}
.welcome h2{font-size:clamp(36px,4.6vw,58px);margin-bottom:24px;color:var(--terra)}
.welcome blockquote{margin:0 auto;max-width:62ch;font-size:clamp(17px,1.5vw,20px);color:var(--ink-2)}
.welcome cite{display:block;margin-top:22px;font:400 22px/1 var(--serif);font-style:normal;color:var(--peach-dk)}

/* faixa com foto */
.band{position:relative;color:var(--cream);text-align:center;padding:clamp(90px,12vw,160px) 0;background:var(--ink);overflow:hidden}
.band>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.42}
.band .wrap{position:relative}
.band h2{font-size:clamp(64px,11vw,150px);line-height:.9}
.band p{font:400 clamp(22px,2.4vw,30px)/1.2 var(--serif);color:var(--peach);margin:14px 0 0}

/* grade de fotos do cardápio */
.grid-fotos{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,2.6vw,34px);list-style:none;margin:0;padding:0}
.grid-fotos li{display:flex;flex-direction:column;gap:12px}
.grid-fotos figure{margin:0;border-radius:var(--r);overflow:hidden;aspect-ratio:4/5;background:var(--sand);box-shadow:0 18px 34px -22px rgba(27,23,20,.55)}
.grid-fotos img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.grid-fotos li:hover img{transform:scale(1.05)}
.grid-fotos span{display:block;text-align:center;padding:4px 12px 0;font:400 19px/1.2 var(--serif);color:var(--ink)}
@media (max-width:760px){.grid-fotos{grid-template-columns:repeat(2,1fr)}.grid-fotos span{font-size:16px}}

/* cardápio completo */
.menu-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:16px 40px;margin:clamp(56px,7vw,90px) 0 28px}
.menu-head h2{font-size:clamp(38px,5vw,64px);color:var(--terra)}
.menu-head p{max-width:44ch;color:var(--muted);margin:0}
.cats{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:26px}
.cats a{font-size:14px;font-weight:600;letter-spacing:.03em;text-decoration:none;padding:9px 16px;border-radius:var(--r);border:1px solid var(--line);background:var(--white);color:var(--ink-2)}
.cats a:hover{background:var(--ink);border-color:var(--ink);color:var(--cream)}
.menu{columns:2 340px;column-gap:20px}
.menu section{break-inside:avoid;margin:0 0 20px;background:var(--white);border-radius:var(--r);padding:clamp(22px,3vw,36px);scroll-margin-top:96px}
.menu h3{font-size:clamp(28px,2.8vw,36px);color:var(--terra)}
.menu .nota{display:flex;align-items:center;gap:10px;color:var(--peach-dk);font-size:15px;font-weight:600;margin:6px 0 18px}
.menu .nota svg{width:34px;color:var(--peach)}
.menu ul{list-style:none;margin:0;padding:0}
.menu li{padding:12px 0;border-bottom:1px solid var(--line)}
.menu li:last-child{border-bottom:0}
.row{display:flex;align-items:baseline;gap:10px}
.row b{font-weight:700;color:var(--ink)}
.row i{flex:1;border-bottom:1px dotted #CDBFA4;transform:translateY(-4px);min-width:16px}
.row strong{font:400 20px/1 var(--serif);color:var(--terra);white-space:nowrap}
.menu small{display:block;color:var(--muted);font-size:15px;line-height:1.45;margin-top:3px}
.menu small em{font-style:normal;font-weight:600;color:var(--peach-dk)}
.bebidas{display:grid;grid-template-columns:auto 1fr auto;gap:18px 28px;align-items:center;background:var(--ink);color:var(--cream);border-radius:var(--r);padding:clamp(22px,3vw,34px)}
.bebidas h3{color:var(--peach);font-size:30px}
.bebidas p{margin:0;color:rgba(244,239,225,.8)}
.aviso{font-size:14px;color:var(--muted);margin:16px 0 0}
@media (max-width:900px){.bebidas{grid-template-columns:1fr}}

/* a casa */
.story{display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(32px,6vw,80px);align-items:center}
.story-txt>p:first-child{font:400 24px/1.2 var(--serif);color:var(--peach-dk);margin-bottom:10px}
.story h2{font-size:clamp(40px,5vw,66px);margin-bottom:22px;color:var(--terra)}
.story-txt p{color:var(--muted)}
.selo{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center;margin-top:28px;padding:20px 22px;background:var(--cream);border-left:3px solid var(--terra);border-radius:0 var(--r) var(--r) 0}
.selo img{width:58px}
.selo h3{font-size:24px;color:var(--ink);margin-bottom:4px}
.selo p{margin:0;font-size:15px;color:var(--muted)}
.mosaico{display:grid;grid-template-columns:1fr 1fr 1.25fr;grid-template-rows:repeat(2,260px);gap:12px}
.mosaico figure{margin:0;border-radius:var(--r);overflow:hidden;background:var(--sand)}
.mosaico img{width:100%;height:100%;object-fit:cover}
.mosaico .m1{grid-row:1/2;grid-column:1/2}
.mosaico .m2{grid-row:1/3;grid-column:3/4}
.mosaico .m3{grid-row:2/3;grid-column:1/3}
.mosaico .m1 img{object-position:50% 72%}
.mosaico .m2 img{object-position:50% 60%}
.mosaico .m3 img{object-position:50% 45%}
.mosaico .m4{grid-row:1/2;grid-column:2/3}
.mosaico .m4 img{object-position:50% 80%}
@media (max-width:900px){.story{grid-template-columns:1fr}.mosaico{grid-template-rows:repeat(2,220px)}}
@media (max-width:520px){.mosaico{grid-template-columns:1fr 1fr;grid-template-rows:170px 170px 220px;min-height:0}.mosaico .m2{grid-row:3/4;grid-column:1/3}.mosaico .m3{grid-column:1/3}}

/* reservas e eventos */
.reserva{position:relative;color:var(--cream);background:var(--ink);padding:var(--sec) 0;overflow:hidden}
.reserva>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.22}
.reserva .wrap{position:relative}
.reserva-head{text-align:center;max-width:720px;margin:0 auto clamp(36px,5vw,56px)}
.reserva-head h2{font-size:clamp(46px,7vw,92px);margin-bottom:16px;color:var(--white)}
.reserva-head p{color:rgba(244,239,225,.82);font-size:clamp(17px,1.5vw,20px)}
.planos{display:grid;grid-template-columns:1fr 1.12fr 1fr;gap:18px;align-items:stretch}
.plano{display:flex;flex-direction:column;padding:clamp(24px,3vw,34px);border-radius:var(--r);background:rgba(244,239,225,.06);border:1px solid rgba(244,239,225,.16)}
.plano.top{background:var(--cream);color:var(--text);border-color:var(--cream);transform:translateY(-14px)}
.plano h3{font-size:clamp(30px,3vw,38px)}
.plano .para{font-weight:600;color:var(--peach);margin:6px 0 18px}
.plano.top h3{color:var(--terra)}
.plano.top .para{color:var(--peach-dk)}
.plano .valor{font:400 26px/1 var(--serif);padding:14px 0;border-top:1px solid rgba(244,239,225,.2);border-bottom:1px solid rgba(244,239,225,.2);margin-bottom:18px}
.plano.top .valor{border-color:var(--line)}
.plano ul{margin:0 0 24px;padding:0 0 0 18px;flex:1}
.plano li{margin-bottom:8px;font-size:16px;line-height:1.45}
.plano li::marker{color:var(--peach)}
.plano .btn{align-self:flex-start}
.plano:not(.top) .btn{background:transparent;border-color:rgba(244,239,225,.5);color:var(--cream)}
.plano:not(.top) .btn:hover{background:var(--cream);color:var(--ink)}
.pagamento{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 26px;margin-top:40px;font-size:15px;color:rgba(244,239,225,.78);text-align:center}
.pagamento strong{color:var(--cream)}
@media (max-width:900px){.planos{grid-template-columns:1fr}.plano.top{transform:none}}

/* perguntas */
.faq-in{display:grid;grid-template-columns:.8fr 1.4fr;gap:clamp(28px,6vw,80px);align-items:start}
.faq-in h2{font-size:clamp(40px,5vw,64px);margin-bottom:18px;color:var(--terra)}
.faq-in .side p{color:var(--muted)}
.faq-in .side .btn{margin-top:8px}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:20px;align-items:center;padding:20px 0;font:400 clamp(20px,1.9vw,24px)/1.25 var(--serif);color:var(--ink)}
.faq summary::-webkit-details-marker{display:none}
.faq summary svg{flex:none;width:20px;height:20px;color:var(--terra);transition:transform .25s}
.faq details[open] summary svg{transform:rotate(45deg)}
.faq details p{color:var(--muted);margin:0;padding:0 40px 22px 0}
@media (max-width:900px){.faq-in{grid-template-columns:1fr}}

/* visite */
.visite{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(28px,6vw,80px);align-items:center}
.visite h2{font-size:clamp(40px,5vw,64px);margin-bottom:18px;color:var(--terra)}
.visite address{font-style:normal;font-size:19px;color:var(--ink);margin-bottom:6px}
.visite .ref{color:var(--muted)}
.visite .acoes{display:flex;flex-wrap:wrap;gap:12px;margin-top:22px}
.horas{background:var(--cream);border-radius:var(--r);padding:clamp(22px,3vw,34px)}
.horas h3{font-size:30px;color:var(--terra);margin-bottom:10px}
.horas table{width:100%;border-collapse:collapse}
.horas td{padding:14px 0;border-bottom:1px solid var(--line)}
.horas tr:last-child td{border-bottom:0}
.horas td:last-child{text-align:right;font-weight:600;color:var(--ink)}
.horas tr.hoje td{color:var(--terra)}
.horas tr.hoje td:first-child::after{content:" (hoje)";font-weight:600}
.horas .fechado{color:var(--muted);font-weight:400}
@media (max-width:900px){.visite{grid-template-columns:1fr}}

/* rodapé */
.ftr{background:var(--ink);color:rgba(244,239,225,.78);padding:clamp(56px,7vw,88px) 0 28px;font-size:15px}
.ftr-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1.3fr;gap:32px}
.ftr .brand{color:var(--cream);margin-bottom:14px}
.ftr .brand img{width:46px}
.ftr .brand span{font-size:26px}
.ftr h3{font:600 12px/1 var(--sans);letter-spacing:.16em;text-transform:uppercase;margin-bottom:18px;color:var(--peach)}
.ftr ul{list-style:none;margin:0;padding:0}
.ftr li{margin-bottom:9px}
.ftr a{text-decoration:none;transition:color .2s}
.ftr a:hover{color:var(--peach)}
.ftr p{color:rgba(244,239,225,.72);max-width:30ch}
.redes{display:flex;gap:12px;margin-top:4px}
.redes a{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;border:1px solid rgba(228,167,133,.45);color:var(--peach);transition:background .25s,color .25s,border-color .25s}
.redes a:hover{background:var(--peach);border-color:var(--peach);color:var(--ink)}
.redes .ic{width:20px;height:20px}
.ftr-bot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin-top:48px;padding-top:22px;border-top:1px solid rgba(244,239,225,.12);color:rgba(244,239,225,.55);font-size:13px;letter-spacing:.03em}
@media (max-width:900px){.ftr-grid{grid-template-columns:1fr 1fr}}
@media (max-width:520px){.ftr-grid{grid-template-columns:1fr}}

/* WhatsApp flutuante */
.wa-float{position:fixed;right:clamp(14px,2.5vw,28px);bottom:clamp(14px,2.5vw,28px);z-index:60;display:flex;align-items:center;gap:10px;height:58px;padding:0 22px 0 18px;border-radius:var(--r);background:var(--terra);color:#fff;text-decoration:none;font-weight:600;letter-spacing:.02em;box-shadow:0 14px 30px -10px rgba(27,23,20,.55);transition:transform .2s,background .2s}
.wa-float:hover{transform:translateY(-2px);background:var(--terra-dk)}
.wa-float .ic{width:26px;height:26px}
@media (max-width:620px){.wa-float{width:58px;padding:0;justify-content:center}.wa-float span{display:none}}

/* entrada suave ao rolar (só com JS ativo) */
.js .rv{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease}
.js .rv.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.js .rv{opacity:1;transform:none;transition:none}}
`;
module.exports = { css };
