// Componente de mapa do rodapé/contato, igual ao do modelo premium dos provedores (sites/_build/premium.js),
// nas cores da THD. Usado pelos três modelos: a moldura recebe a classe "mapc".
// Mapa estático do OpenStreetMap recolorido (gerado por _build/gerar-mapa.js), sem Google.

module.exports = `
.mapc{position:relative;height:340px;border-radius:28px;overflow:hidden;background:#E8EDF6;box-shadow:0 40px 70px -40px rgba(0,0,0,.8)}
.mapc .map-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.2s var(--ease)}
.mapc:hover .map-img{transform:scale(1.06)}
.mapc .map-pin{position:absolute;left:50%;top:50%;z-index:2;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;background:var(--orange);border:4px solid #fff;box-shadow:0 8px 18px -6px rgba(254,87,16,.8)}
.mapc .map-pin::before{content:"";position:absolute;inset:-10px;border-radius:50%;border:3px solid rgba(254,87,16,.55);animation:mapPing 2.2s ease-out infinite}
.mapc .map-pin b{position:absolute;left:24px;top:-5px;white-space:nowrap;font:700 13px/1.4 var(--f-head);color:var(--orange-d);text-shadow:0 0 4px #fff,0 0 4px #fff,0 0 2px #fff}
@keyframes mapPing{from{transform:scale(.7);opacity:1}to{transform:scale(1.7);opacity:0}}
.mapc .map-info{position:absolute;left:14px;top:14px;bottom:auto;right:auto;z-index:3;display:grid;gap:3px;max-width:270px;padding:14px 16px;border-radius:16px;background:#fff;color:var(--ink);box-shadow:0 14px 30px -12px rgba(0,0,0,.5);-webkit-backdrop-filter:none;backdrop-filter:none}
.mapc .map-info b{font:700 15px/1.2 var(--f-head);color:var(--ink);text-transform:none}
.mapc .map-info span{font-size:12.5px;line-height:1.35;color:#5F6A85}
.mapc .mbtns{display:flex;gap:6px;margin-top:8px}
.mapc .mbtns a{display:inline-flex;align-items:center;gap:6px;padding:9px 13px;border-radius:11px;background:linear-gradient(135deg,#FF7A3D 0%,#FE5710 45%,#DE4706 100%);color:#fff;font:600 13px/1 var(--f-head);text-decoration:none;transition:transform .3s var(--ease),filter .3s}
.mapc .mbtns a:hover{transform:translateY(-2px);filter:brightness(1.06);color:#fff}
.mapc .mbtns a.sq{padding:9px;background:#FFF1EA;color:var(--orange-d)}
.mapc .mbtns a.sq:hover{background:#FFE3D4;color:var(--orange-d)}
.mapc .mbtns svg{width:16px;height:16px}
.mapc .map-attr{position:absolute;right:8px;bottom:6px;z-index:3;font-size:11px;line-height:1.4;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,.85);color:var(--ink)}
.mapc .map-attr a{color:var(--ink)}
@media (max-width:600px){
  /* no celular o cartão ocupa a largura toda no topo; o mapa desce para o pino ficar abaixo dele */
  .mapc .map-info{left:10px;right:10px;top:10px;max-width:none}
  .mapc .map-img{inset:0 0 auto 0;height:128%}
  .mapc .map-pin{top:64%}
}
@media (prefers-reduced-motion:reduce){.mapc .map-pin::before{animation:none;opacity:.5}.mapc:hover .map-img{transform:none}}
`;
