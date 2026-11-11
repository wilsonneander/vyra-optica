// CSS do modelo Bronze (site enxuto de uma página). Embutido no <head> para carregar sem pedidos extras.
const css = `
:root{
  --ink:#1C1714;--ink-2:#2B231E;--text:#2A221D;--muted:#5C524A;
  --cream:#F6EFDF;--paper:#FFFBF2;
  --sea:#DCEEEA;--sea-2:#C6E3DC;--sea-ink:#1F4C46;
  --siri:#E4572E;--siri-dk:#B5381A;--siri-lt:#F7A47E;
  --wa:#1E9E52;
  --serif:'Gloock',Georgia,'Times New Roman',serif;
  --sans:'Figtree',Arial,Helvetica,sans-serif;
  --wrap:1180px;--gut:clamp(16px,4vw,40px);
  --sec:clamp(56px,7vw,104px);
}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--paper);color:var(--text);font:400 17px/1.65 var(--sans);overflow-x:hidden}
img,svg{display:block;max-width:100%}
img{height:auto}
a{color:inherit}
h1,h2,h3{font-family:var(--serif);font-weight:400;line-height:1.05;margin:0;letter-spacing:-.01em}
p{margin:0 0 1em}
.wrap{width:100%;max-width:var(--wrap);margin:0 auto;padding:0 var(--gut)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skip{position:absolute;left:12px;top:-60px;z-index:100;background:var(--siri);color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none}
.skip:focus{top:12px}
:focus-visible{outline:3px solid var(--siri);outline-offset:3px}

/* botões */
.btn{display:inline-flex;align-items:center;gap:10px;min-height:50px;padding:0 24px;border-radius:6px;font:600 16px/1 var(--sans);text-decoration:none;border:2px solid transparent;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .2s}
.btn:hover{transform:translateY(-2px)}
.btn .ic{width:20px;height:20px}
.btn-siri{background:var(--siri);color:#fff}
.btn-siri:hover{background:var(--siri-dk)}
.btn-line{border-color:currentColor;color:var(--cream)}
.btn-line:hover{background:var(--cream);color:var(--ink);border-color:var(--cream)}
.btn-ink{background:var(--ink);color:var(--cream)}
.btn-ink:hover{background:var(--ink-2)}
.btn-wa{background:var(--wa);color:#fff}
.btn-wa:hover{background:#178444}

/* topo */
.hdr{position:fixed;inset:0 0 auto;z-index:50;transition:background .3s,box-shadow .3s}
.hdr.solid{background:rgba(28,23,20,.94);box-shadow:0 6px 24px rgba(0,0,0,.18)}
@supports (backdrop-filter:blur(8px)){.hdr.solid{background:rgba(28,23,20,.82);backdrop-filter:blur(10px)}}
.hdr-in{display:flex;align-items:center;gap:24px;height:76px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--cream);margin-right:auto}
.brand img{width:34px;height:auto}
.brand span{font:400 23px/1 var(--serif)}
.nav{display:flex;gap:28px}
.nav a{color:var(--cream);text-decoration:none;font-size:15px;font-weight:500;opacity:.88;padding:6px 0;border-bottom:2px solid transparent}
.nav a:hover{opacity:1;border-color:var(--siri)}
.hdr .btn{min-height:42px;padding:0 18px;font-size:15px}
.menu-btn{display:none;background:none;border:0;color:var(--cream);width:44px;height:44px;padding:10px;cursor:pointer}
.menu-btn .ic{width:24px;height:24px}
.menu-btn .i-close,.hdr.open .menu-btn .i-open{display:none}
.hdr.open .menu-btn .i-close{display:block}
@media (max-width:900px){
  .nav{position:fixed;inset:76px 0 auto;flex-direction:column;gap:0;background:var(--ink);padding:8px var(--gut) 24px;transform:translateY(-12px);opacity:0;visibility:hidden;transition:.25s}
  .nav.open{transform:none;opacity:1;visibility:visible}
  .nav a{font-size:20px;padding:14px 0;border-bottom:1px solid rgba(246,239,223,.12)}
  .menu-btn{display:block}
  .hdr .btn-wa{display:none}
  .hdr.open{background:var(--ink)}
}

/* hero */
.hero{position:relative;min-height:min(100svh,920px);display:grid;align-items:end;color:var(--cream);background:var(--ink);overflow:hidden}
.hero-bg{position:absolute;inset:0}
.hero-bg img{width:100%;height:100%;object-fit:cover;opacity:.62}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(28,23,20,.75) 0%,rgba(28,23,20,.15) 38%,rgba(28,23,20,.55) 70%,var(--ink) 100%)}
.hero-in{position:relative;z-index:2;display:grid;grid-template-columns:1fr auto;align-items:end;gap:24px;padding-top:120px;padding-bottom:clamp(40px,6vw,72px)}
.hero h1{font-size:clamp(76px,15vw,200px);line-height:.86;letter-spacing:-.025em}
.hero h1 span{display:block}
.hero h1 .l2{color:var(--siri);padding-left:.42em}
.hero-line{font:400 clamp(22px,2.6vw,34px)/1.2 var(--serif);margin:28px 0 14px;max-width:22ch}
.hero-line em{font-style:normal;color:var(--siri-lt)}
.hero-txt{max-width:46ch;color:rgba(246,239,223,.82);margin-bottom:28px}
.hero-cta{display:flex;flex-wrap:wrap;gap:12px}
.mascote{width:clamp(150px,22vw,300px);filter:drop-shadow(0 18px 30px rgba(0,0,0,.45));margin-bottom:-6px}
.hero-info{position:relative;z-index:2;border-top:1px solid rgba(246,239,223,.16)}
.hero-info .wrap{display:flex;flex-wrap:wrap;gap:8px 40px;padding-top:18px;padding-bottom:18px;font-size:15px;color:rgba(246,239,223,.8)}
.hero-info strong{color:var(--cream);font-weight:600}
.hero-info .agora{color:var(--siri-lt);font-weight:600}
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
.sea{background:var(--sea)}
.sea-2{background:var(--sea-2)}
.cream{background:var(--cream)}
.alga{position:absolute;width:150px;color:var(--sea-ink);opacity:.28;pointer-events:none}
.alga.tr{right:-20px;top:-10px;transform:rotate(18deg)}
.alga.bl{left:-30px;bottom:-30px;transform:scaleX(-1) rotate(10deg)}
.alga.br{right:-30px;bottom:-40px}
.duo{display:grid;grid-template-columns:1fr 70px 1fr;gap:clamp(24px,5vw,72px);align-items:center;text-align:center}
.duo article{display:flex;flex-direction:column;align-items:center}
.duo .ill{width:min(280px,80%);color:var(--ink);margin-bottom:14px}
.duo h2{font-size:clamp(34px,4vw,48px);margin-bottom:14px}
.duo p{max-width:40ch;color:var(--muted)}
.duo .neck{width:62px;color:var(--sea-ink);opacity:.7}
@media (max-width:760px){.duo{grid-template-columns:1fr}.duo .neck{display:none}}

/* boas-vindas */
.welcome{text-align:center}
.welcome h2{font-size:clamp(36px,4.6vw,58px);margin-bottom:24px}
.welcome blockquote{margin:0 auto;max-width:62ch;font-size:clamp(17px,1.5vw,20px);color:var(--ink-2)}
.welcome cite{display:block;margin-top:22px;font:400 22px/1 var(--serif);font-style:normal;color:var(--sea-ink)}

/* faixa com foto */
.band{position:relative;color:var(--cream);text-align:center;padding:clamp(90px,12vw,160px) 0;background:var(--ink);overflow:hidden}
.band>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.42}
.band .wrap{position:relative}
.band h2{font-size:clamp(64px,11vw,150px);line-height:.9}
.band p{font:400 clamp(22px,2.4vw,30px)/1.2 var(--serif);color:var(--siri-lt);margin:14px 0 0}

/* grade de fotos do cardápio */
.grid-fotos{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,2.6vw,34px);list-style:none;margin:0;padding:0}
.grid-fotos li{display:flex;flex-direction:column;gap:12px}
.grid-fotos figure{margin:0;border-radius:10px;overflow:hidden;aspect-ratio:4/5;background:var(--sea-2);box-shadow:0 14px 30px -18px rgba(31,76,70,.6)}
.grid-fotos img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.grid-fotos li:hover img{transform:scale(1.05)}
.grid-fotos span{display:block;text-align:center;background:var(--paper);border-radius:6px;padding:10px 12px;font:400 19px/1.2 var(--serif);color:var(--ink)}
@media (max-width:760px){.grid-fotos{grid-template-columns:repeat(2,1fr)}.grid-fotos span{font-size:16px}}

/* cardápio completo */
.menu-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:16px 40px;margin:clamp(56px,7vw,90px) 0 28px}
.menu-head h2{font-size:clamp(38px,5vw,64px)}
.menu-head p{max-width:44ch;color:var(--muted);margin:0}
.cats{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:26px}
.cats a{font-size:15px;font-weight:600;text-decoration:none;padding:9px 14px;border-radius:6px;background:var(--paper);color:var(--sea-ink)}
.cats a:hover{background:var(--ink);color:var(--cream)}
.menu{columns:2 340px;column-gap:20px}
.menu section{break-inside:avoid;margin:0 0 20px;background:var(--paper);border-radius:12px;padding:clamp(22px,3vw,36px);scroll-margin-top:96px}
.menu h3{font-size:clamp(28px,2.8vw,36px);color:var(--ink)}
.menu .nota{display:flex;align-items:center;gap:10px;color:var(--siri-dk);font-size:15px;font-weight:600;margin:6px 0 18px}
.menu .nota svg{width:34px;color:var(--siri)}
.menu ul{list-style:none;margin:0;padding:0}
.menu li{padding:12px 0;border-bottom:1px solid #EDE3CF}
.menu li:last-child{border-bottom:0}
.row{display:flex;align-items:baseline;gap:10px}
.row b{font-weight:700;color:var(--ink)}
.row i{flex:1;border-bottom:2px dotted #D8CBB0;transform:translateY(-4px);min-width:16px}
.row strong{font:400 20px/1 var(--serif);color:var(--siri-dk);white-space:nowrap}
.menu small{display:block;color:var(--muted);font-size:15px;line-height:1.45;margin-top:3px}
.menu small em{font-style:normal;font-weight:600;color:var(--sea-ink)}
.bebidas{display:grid;grid-template-columns:auto 1fr auto;gap:18px 28px;align-items:center;background:var(--ink);color:var(--cream);border-radius:12px;padding:clamp(22px,3vw,34px)}
.bebidas h3{color:var(--cream);font-size:30px}
.bebidas p{margin:0;color:rgba(246,239,223,.8)}
.aviso{font-size:14px;color:var(--muted);margin:16px 0 0}
@media (max-width:900px){.bebidas{grid-template-columns:1fr}}

/* a casa */
.story{display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(32px,6vw,80px);align-items:center}
.story-txt>p:first-child{color:var(--sea-ink);font-weight:600;margin-bottom:8px}
.story h2{font-size:clamp(40px,5vw,66px);margin-bottom:22px}
.story-txt p{color:var(--muted)}
.selo{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center;margin-top:28px;padding:20px 22px;background:var(--paper);border-left:6px solid var(--siri);border-radius:4px 10px 10px 4px}
.selo img{width:58px}
.selo h3{font-size:24px;color:var(--ink);margin-bottom:4px}
.selo p{margin:0;font-size:15px;color:var(--muted)}
.mosaico{display:grid;grid-template-columns:1fr 1fr 1.25fr;grid-template-rows:repeat(2,minmax(150px,1fr));gap:12px;min-height:520px}
.mosaico figure{margin:0;border-radius:10px;overflow:hidden;background:var(--sea-2)}
.mosaico img{width:100%;height:100%;object-fit:cover}
.mosaico .m1{grid-row:1/2;grid-column:1/2}
.mosaico .m2{grid-row:1/3;grid-column:3/4}
.mosaico .m3{grid-row:2/3;grid-column:1/3}
.mosaico .marca{grid-row:1/2;grid-column:2/3;background:var(--ink);display:grid;place-items:center;padding:16px}
.mosaico .marca img{width:auto;height:100%;max-height:200px;object-fit:contain}
@media (max-width:900px){.story{grid-template-columns:1fr}.mosaico{min-height:420px}}
@media (max-width:520px){.mosaico{grid-template-columns:1fr 1fr;grid-template-rows:170px 170px 220px;min-height:0}.mosaico .m2{grid-row:3/4;grid-column:1/3}.mosaico .m3{grid-column:1/3}}

/* reservas e eventos */
.reserva{position:relative;color:var(--cream);background:var(--ink);padding:var(--sec) 0;overflow:hidden}
.reserva>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.22}
.reserva .wrap{position:relative}
.reserva-head{text-align:center;max-width:720px;margin:0 auto clamp(36px,5vw,56px)}
.reserva-head h2{font-size:clamp(46px,7vw,92px);margin-bottom:16px}
.reserva-head p{color:rgba(246,239,223,.82);font-size:clamp(17px,1.5vw,20px)}
.planos{display:grid;grid-template-columns:1fr 1.12fr 1fr;gap:18px;align-items:stretch}
.plano{display:flex;flex-direction:column;padding:clamp(24px,3vw,34px);border-radius:12px;background:rgba(246,239,223,.07);border:1px solid rgba(246,239,223,.16)}
.plano.top{background:var(--cream);color:var(--text);border-color:var(--cream);transform:translateY(-14px)}
.plano h3{font-size:clamp(30px,3vw,38px)}
.plano .para{font-weight:600;color:var(--siri-lt);margin:6px 0 18px}
.plano.top .para{color:var(--siri-dk)}
.plano .valor{font:400 26px/1 var(--serif);padding:14px 0;border-top:1px solid rgba(246,239,223,.2);border-bottom:1px solid rgba(246,239,223,.2);margin-bottom:18px}
.plano.top .valor{border-color:#E4D8BF}
.plano ul{margin:0 0 24px;padding:0 0 0 18px;flex:1}
.plano li{margin-bottom:8px;font-size:16px;line-height:1.45}
.plano li::marker{color:var(--siri)}
.plano .btn{align-self:flex-start}
.plano:not(.top) .btn{background:transparent;border-color:rgba(246,239,223,.5);color:var(--cream)}
.plano:not(.top) .btn:hover{background:var(--cream);color:var(--ink)}
.pagamento{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 26px;margin-top:40px;font-size:15px;color:rgba(246,239,223,.78);text-align:center}
.pagamento strong{color:var(--cream)}
@media (max-width:900px){.planos{grid-template-columns:1fr}.plano.top{transform:none}}

/* perguntas */
.faq-in{display:grid;grid-template-columns:.8fr 1.4fr;gap:clamp(28px,6vw,80px);align-items:start}
.faq-in h2{font-size:clamp(40px,5vw,64px);margin-bottom:18px}
.faq-in .side p{color:var(--muted)}
.faq-in .side .btn{margin-top:8px}
.faq details{border-bottom:1px solid #E2D6BD}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:20px;align-items:center;padding:20px 0;font:400 clamp(20px,1.9vw,24px)/1.25 var(--serif);color:var(--ink)}
.faq summary::-webkit-details-marker{display:none}
.faq summary svg{flex:none;width:22px;height:22px;color:var(--siri);transition:transform .25s}
.faq details[open] summary svg{transform:rotate(45deg)}
.faq details p{color:var(--muted);margin:0;padding:0 40px 22px 0}
@media (max-width:900px){.faq-in{grid-template-columns:1fr}}

/* visite */
.visite{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(28px,6vw,80px);align-items:center}
.visite h2{font-size:clamp(40px,5vw,64px);margin-bottom:18px}
.visite address{font-style:normal;font-size:19px;color:var(--ink);margin-bottom:6px}
.visite .ref{color:var(--muted)}
.visite .acoes{display:flex;flex-wrap:wrap;gap:12px;margin-top:22px}
.horas{background:var(--paper);border-radius:12px;padding:clamp(22px,3vw,34px)}
.horas h3{font-size:30px;color:var(--ink);margin-bottom:10px}
.horas table{width:100%;border-collapse:collapse}
.horas td{padding:14px 0;border-bottom:1px solid #EDE3CF}
.horas tr:last-child td{border-bottom:0}
.horas td:last-child{text-align:right;font-weight:600;color:var(--ink)}
.horas tr.hoje td{color:var(--siri-dk)}
.horas tr.hoje td:first-child::after{content:" (hoje)";font-weight:600}
.horas .fechado{color:var(--muted);font-weight:400}
@media (max-width:900px){.visite{grid-template-columns:1fr}}

/* rodapé */
.ftr{background:var(--sea-2);color:var(--ink);padding:clamp(48px,6vw,72px) 0 28px;font-size:15px}
.ftr-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1.3fr;gap:32px}
.ftr .brand{color:var(--ink);margin-bottom:14px}
.ftr .brand img{width:46px}
.ftr .brand span{font-size:26px}
.ftr h3{font:700 14px/1 var(--sans);letter-spacing:.06em;text-transform:uppercase;margin-bottom:16px;color:var(--sea-ink)}
.ftr ul{list-style:none;margin:0;padding:0}
.ftr li{margin-bottom:9px}
.ftr a{text-decoration:none}
.ftr a:hover{color:var(--siri-dk)}
.ftr p{color:var(--ink-2);max-width:30ch}
.redes{display:flex;gap:10px;margin-top:6px}
.redes a{display:grid;place-items:center;width:44px;height:44px;border-radius:10px;background:var(--ink);color:var(--cream)}
.redes a:hover{background:var(--siri);color:#fff}
.redes .ic{width:22px;height:22px}
.ftr-bot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin-top:44px;padding-top:20px;border-top:1px solid rgba(31,76,70,.2);color:var(--sea-ink);font-size:14px}
@media (max-width:900px){.ftr-grid{grid-template-columns:1fr 1fr}}
@media (max-width:520px){.ftr-grid{grid-template-columns:1fr}}

/* WhatsApp flutuante */
.wa-float{position:fixed;right:clamp(14px,2.5vw,28px);bottom:clamp(14px,2.5vw,28px);z-index:60;display:flex;align-items:center;gap:10px;height:60px;padding:0 20px 0 16px;border-radius:16px;background:var(--wa);color:#fff;text-decoration:none;font-weight:700;box-shadow:0 12px 28px -8px rgba(0,0,0,.45);transition:transform .2s,background .2s}
.wa-float:hover{transform:translateY(-3px);background:#178444}
.wa-float .ic{width:28px;height:28px}
@media (max-width:620px){.wa-float{width:60px;padding:0;justify-content:center}.wa-float span{display:none}}

/* entrada suave ao rolar (só com JS ativo) */
.js .rv{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease}
.js .rv.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.js .rv{opacity:1;transform:none;transition:none}}
`;
module.exports = { css };
