// Tema escuro do modelo Blocos. Só redefine os tokens e corrige o que tinha cor fixa de tema claro.
// As cores da marca (laranja, azuis, marinho) não mudam; as seções que já eram escuras continuam iguais.
const mq = '(max-width:920px)';
const css = `
:root{--surface:#fff;--solid:var(--ink)}
html[data-theme="dark"]{
  --white:#07152F; --paper:#0B1C3C; --surface:#10244A; --pale:#17305C; --line:#1F3763;
  --ink:#EEF2FA; --text:#B6C2D9; --muted:#8C99B4; --solid:var(--orange);
}
html[data-theme="dark"] .gnav-wrap{background:rgba(7,21,47,.92)}
html[data-theme="dark"] .hist{background:radial-gradient(ellipse 60% 70% at 78% 50%,#10244A 0,rgba(16,36,74,0) 70%),var(--white)}
html[data-theme="dark"] .tm-trail li.now::before{background:var(--surface)}
`;
module.exports = { mq, css };
