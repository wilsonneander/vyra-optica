// Tema claro da versão do cliente THD. Entra depois do CSS do modelo (style.js) e troca só as cores.
// Regra do cliente: onde era marinho vira branco ou cinza bem claro, em todas as páginas menos Contato.
// O build põe "claro" no <body> de todas as páginas, menos Contato, e "pg-<página>" em todas.
// As seções alternam branco e cinza (--paper) para a página não ficar 100% branca.

module.exports = `
/* ===== menu: faixa marinho translúcida em todas as páginas ===== */
.hdr{background:rgba(2,20,48,.86);-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);box-shadow:0 10px 30px -20px rgba(2,20,48,.6)}
.hdr.solid{background:rgba(2,20,48,.9)}

/* ===== tema claro (todas as páginas menos Contato) ===== */
html:has(body.claro){scrollbar-color:var(--orange) var(--paper)}
.claro main,.claro .footer{--wire:rgba(2,20,48,.18)}
.claro .on-dark{color:var(--text)}
.claro .on-dark h1,.claro .on-dark h2,.claro .on-dark h3{color:var(--ink)}
.claro .blueprint{background-image:linear-gradient(rgba(2,20,48,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(2,20,48,.055) 1px,transparent 1px)}
/* blocos brancos da arte geométrica viram marinho no fundo claro */
.claro main .c-w,.claro .footer .c-w{--c:var(--navy)}
.claro .on-dark .btn-o{--fill:var(--navy)}
.claro .on-dark .btn-o:hover{color:#fff}
.claro .btn-line{border-color:rgba(11,22,48,.28);color:var(--ink);--fill:var(--navy)}
.claro .btn-line:hover{color:#fff;border-color:var(--navy)}

/* topo da home (branco) e das páginas internas (cinza) */
.claro .hero{background:#fff}
.claro .hero .lead{color:var(--text)}
.claro .facts li{border-top-color:var(--line);color:var(--muted)}
.claro .facts strong{color:var(--ink)}
.claro .scroll-hint{background:rgba(2,20,48,.12)}
.claro .phero{background:var(--paper)}
.claro .phero .lead{color:var(--text)}
.claro .crumbs{color:var(--muted)}
.claro .crumbs a:hover{color:var(--orange)}
.claro .pf-img{background:var(--pale)}
.claro .pf-img::after{background:linear-gradient(200deg,transparent 60%,rgba(2,20,48,.18))}

/* seções que eram marinho: cinza claro por padrão */
.claro .section-dark{background:var(--paper)}

/* jornada */
.claro .jrn-steps::before{background:rgba(2,20,48,.12)}
.claro .jrn-steps>li::before{background:var(--paper);box-shadow:inset 0 0 0 2px rgba(2,20,48,.3)}
.claro .jrn-steps>li.on::before{background:var(--orange);box-shadow:none}
.claro .jrn-steps p{color:var(--muted)}
.claro .jrn-tags a{color:var(--ink)}
.claro .jrn-tags a:hover{color:var(--orange)}
.claro .jrn-count{-webkit-text-stroke-color:rgba(2,20,48,.15)}
@media (max-width:920px){.claro .jrn-steps>li::before{background:var(--orange);box-shadow:none}}

/* linhas de serviço: o preenchimento do hover era marinho, agora é cinza */
.claro .srow::before{background:var(--paper)}
.claro .srow:hover h3,.claro .srow:focus-visible h3{color:var(--ink)}
.claro .srow:hover p,.claro .srow:focus-visible p{color:var(--muted)}
.claro .srow:hover .mk .c-b,.claro .srow:focus-visible .mk .c-b{--c:var(--blue)}

/* diagnóstico: cartão branco */
.claro .diag-card{background:#fff;color:var(--text);box-shadow:inset 0 0 0 1.5px var(--line),0 40px 80px -50px rgba(2,20,48,.45)}
.claro .diag-card h3{color:var(--ink)}
.claro .diag-score{color:var(--ink)}
.claro .diag-score small{color:var(--muted)}
.claro .diag-pend li{color:var(--ink);background:rgba(254,87,16,.1)}
.claro .geo-diag .tile .s{opacity:.16}

/* painéis "O que você pode esperar": o aberto era marinho, agora é branco com sombra */
.claro .pnl-item.on{background:#fff;color:var(--text);box-shadow:inset 0 0 0 1.5px var(--line),0 30px 60px -40px rgba(2,20,48,.4)}
.claro .pnl-item.on h3{color:var(--ink)}
.claro .pin-sec .pnl-item:not(.on){background:rgba(255,255,255,.6)}

/* globo: caixa clara, o planeta continua azul */
.claro .globe-box{background:radial-gradient(120% 90% at 30% 20%,#fff,var(--pale) 80%)}
.claro .globe-hint{color:var(--muted)}

/* gráfico de barras da contabilidade */
.claro .bars{border-left-color:rgba(2,20,48,.2);border-bottom-color:rgba(2,20,48,.2)}
.claro .bars path{stroke:var(--ink)}
.claro .bars-cap{color:var(--muted)}

/* missão (Quem somos) */
.claro .manifesto .mw{color:rgba(11,22,48,.14)}
.claro .manifesto .mw.lit{color:var(--ink)}
.claro .manifesto .mw.lit.hl{color:var(--orange)}

/* equipe: fundo do retrato em azul bem claro */
.claro .tm-pic{background:var(--pale)}
.claro .tm-art .c-o{--t:#C8D5EE}.claro .tm-art .c-b{--t:#D5DFF1}.claro .tm-art .c-l{--t:#BCCCE9}
.claro .tm:hover .tm-art .c-o{--t:#B3C5E7}.claro .tm:hover .tm-art .c-l{--t:#A9BEE4}
.claro .tm-ini{color:var(--navy)}

/* gestão contábil */
.claro .lg-tab[aria-selected=true]{background:#fff;box-shadow:inset 0 0 0 2px var(--orange),0 24px 50px -30px rgba(2,20,48,.35)}
.claro .lg-tab[aria-selected=true] strong{color:var(--ink)}
.claro .lg-tab[aria-selected=true] small{color:var(--muted)}
.claro .lg-stage{background:#fff;box-shadow:inset 0 0 0 1.5px var(--line),0 50px 90px -60px rgba(2,20,48,.45)}
.claro .lg-stage::before{background:radial-gradient(560px circle at var(--mx) var(--my),rgba(43,90,168,.1),transparent 62%),radial-gradient(380px circle at 0 100%,rgba(254,87,16,.07),transparent 70%)}
.claro .lg-copy h3{color:var(--ink)}
.claro .lg-copy p{color:var(--muted)}
.claro .lg-rows{border-top-color:var(--line)}
.claro .lg-rows li{border-bottom-color:var(--line);background-image:linear-gradient(90deg,rgba(2,20,48,.05),transparent)}
.claro .lg-n{color:var(--ink)}
.claro .lg-st{color:var(--muted)}
.claro .lg-rows li:hover .lg-st{color:var(--ink)}
.claro .lg-m{box-shadow:inset 0 0 0 1.5px rgba(2,20,48,.3)}
.claro .lg-sheets i{box-shadow:0 22px 40px -18px rgba(2,20,48,.35),inset 0 0 0 1px var(--line)}
.claro .lg-chart .gl path{stroke:rgba(2,20,48,.08)}
.claro .lg-chart .pt{fill:var(--orange)}

/* chamada final com o cubo de vidro */
.claro .cta{background:#fff;border-bottom:0}
.claro .cta h2{color:var(--ink)}
.claro .cta-lead{color:var(--muted)}
.claro .cta .link-arrow{color:var(--ink)}
.claro .cta .link-arrow:hover{color:var(--orange)}
.claro .cta-info{border-top-color:var(--line)}
.claro .cta-info dt{color:var(--muted)}
.claro .cta-info dd{color:var(--ink)}
.claro .cb{--fc:rgba(43,90,168,.13);--fb:rgba(26,59,135,.5);--fl:rgba(43,90,168,.22)}
.claro .cb-l{--fc:rgba(220,229,244,.7);--fb:rgba(26,59,135,.3);--fl:rgba(43,90,168,.1)}
.claro .cb-o{--fc:rgba(254,87,16,.42);--fb:rgba(222,71,6,.85);--fl:rgba(255,120,60,.4)}
.claro .cube-ring span{border-color:rgba(26,59,135,.18);border-top-color:var(--orange)}
.claro .cube-floor{background:radial-gradient(closest-side,rgba(2,20,48,.22),transparent)}

/* rodapé cinza claro */
.claro .footer{background:var(--paper);color:var(--text);border-top:1px solid var(--line)}
.claro .footer h3,.claro .where h2{color:var(--ink)}
.claro .where{border-bottom-color:var(--line)}
.claro .hours dt{color:var(--ink)}
.claro .social a{border-color:rgba(2,20,48,.18);color:var(--ink)}
.claro .social a:hover{color:#fff}
.claro .foot-bottom{border-top-color:var(--line);color:var(--muted)}
.claro .foot-geo{opacity:.07}
.claro .mapc{box-shadow:0 40px 70px -46px rgba(2,20,48,.45)}

/* ===== alternância branco e cinza por página ===== */
/* Início: topo branco, órgãos cinza, serviços branco, jornada cinza, diagnóstico branco, pilares cinza,
   quem somos branco, contabilidade cinza, chamada branca, rodapé cinza */
.pg-home .section-paper{background:#fff}
.pg-home .pin-sec{background:var(--paper)}
/* Quem somos: topo cinza, história branca, equipe cinza, missão branca, pilares cinza, órgãos branco, frentes cinza */
.pg-quem-somos .team{background:var(--paper)}
.pg-quem-somos .section-dark{background:#fff}
.pg-quem-somos .pin-sec{background:var(--paper)}
.pg-quem-somos .selos{background:#fff}
/* Contabilidade: topo cinza, texto branco, gestão cinza, extratos branco, chamada cinza */
.pg-contabilidade .section-dark{background:#fff}
.pg-contabilidade .cta{background:var(--paper)}
.pg-contabilidade .footer{background:#fff}
`;
