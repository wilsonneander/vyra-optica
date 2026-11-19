// Tema escuro do modelo Fibra. Só redefine os tokens e corrige o que tinha cor fixa de tema claro.
const mq = '(max-width:920px),(max-height:700px)';
const css = `
:root{--surface:#fff;--solid:var(--ink)}
html[data-theme="dark"]{
  --paper:#081833; --surface:#0E2247; --line:#1F3763;
  --ink:#EEF2FA; --text:#B6C2D9; --muted:#8C99B4; --solid:var(--orange); --orange-dd:#FF7A3D;
}
html[data-theme="dark"] .cmp-b{background:linear-gradient(160deg,#241C2E 20%,#3A2420)}
html[data-theme="dark"] .ac-eye,html[data-theme="dark"] .ac-help a{color:var(--sky)}
`;
module.exports = { mq, css };
