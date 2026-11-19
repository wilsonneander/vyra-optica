// Tema escuro do modelo Órbita. O site já é escuro; o tema escuro escurece as seções claras (t-light)
// e os cartões brancos, e o cabeçalho deixa de virar claro sobre elas.
const mq = '(max-width:920px)';
const css = `
:root{--surface:#fff;--solid:var(--ink)}
html[data-theme="dark"]{
  --paper:#0A1C3E; --surface:#102650; --line:#1F3966;
  --ink:#EEF2FA; --text:#B6C2D9; --muted:#8C99B4; --solid:var(--orange);
}
html[data-theme="dark"] .t-light .pl-top{background:rgba(16,38,80,.82);border-color:rgba(91,197,240,.28)}
html[data-theme="dark"] .qc{background:linear-gradient(160deg,var(--surface) 30%,#0B1D40)}
html[data-theme="dark"] .face-b{background:linear-gradient(160deg,var(--surface) 40%,#3A2A33)}
html[data-theme="dark"] .fl.invalid input,html[data-theme="dark"] .fl.invalid textarea{background:#3A1A22}
html[data-theme="dark"] .fl input:focus+span,html[data-theme="dark"] .fl input:not(:placeholder-shown)+span,html[data-theme="dark"] .fl textarea:focus+span,html[data-theme="dark"] .fl textarea:not(:placeholder-shown)+span{color:var(--sky)}
/* o cabeçalho troca para claro sobre as seções claras; no escuro elas também são escuras, então ele fica escuro */
html[data-theme="dark"] .hdr.light .nav{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.11)}
html[data-theme="dark"] .hdr.light.scrolled{background:rgba(2,20,48,.74);box-shadow:0 1px 0 rgba(255,255,255,.06)}
html[data-theme="dark"] .hdr.light .menu-btn{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.16)}
/* no tema claro, sobre as seções claras, o botão de tema acompanha o cabeçalho claro */
html:not([data-theme="dark"]) .hdr.light .th-btn{color:var(--text);border-color:rgba(7,19,48,.16)}
html:not([data-theme="dark"]) .hdr.light .th-btn:hover{color:var(--ink);border-color:var(--orange);background:rgba(7,19,48,.04)}
`;
module.exports = { mq, css };
