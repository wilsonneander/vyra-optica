// Botão de tema claro/escuro dos modelos automotivos (Pistão Bronze, Silver e Gold; Garoa Lava Car).
// Pílula branca com sol e lua; um marcador colorido desliza entre os dois e amassa como uma gota no caminho.
// Durante a troca, todas as cores da página passam de um tema para o outro em vez de trocar de uma vez.
//
// Uso no build:
//   const T = require('../../_comum/tema-pilula');
//   T.pilula('tema-lado', 'claro')        → markup (onde: tema-lado na lateral, ou uma classe de pílula deitada)
//   T.head('chave-do-localStorage')       → <script> do <head>, aplica o tema salvo antes de pintar
//   T.js('chave', '#corClaro', '#corEscuro') → script da troca (vai no fim do app.js)
//   T.css                                  → estilos (vão no fim do style.css); a cor do marcador vem de --tema-cor
// No HTML, <html data-tema="claro|escuro"> diz o tema padrão do modelo.

const SOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';
const LUA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M14.8 3.4a8.7 8.7 0 1 0 5.8 12.4A7 7 0 0 1 14.8 3.4Z"/></svg>';

const pilula = (onde, padrao) => `<div class="tema-pilula ${onde}" role="group" aria-label="Tema do site">
  <i class="tema-marca" aria-hidden="true"></i>
  <button type="button" data-tema-ir="claro" aria-label="Tema claro" aria-pressed="${padrao === 'claro'}">${SOL}</button>
  <button type="button" data-tema-ir="escuro" aria-label="Tema escuro" aria-pressed="${padrao === 'escuro'}">${LUA}</button>
</div>`;

const head = (chave) => `<script>try{var t=new URLSearchParams(location.search).get("tema")||localStorage.getItem("${chave}");if(t==="claro"||t==="escuro")document.documentElement.dataset.tema=t;}catch(e){}</script>`;

const js = (chave, corClaro, corEscuro) => `
/* ---------- tema claro ou escuro (pílula na lateral e no menu do celular) ---------- */
(() => {
  const raiz = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  let fim;
  const marca = () => {
    document.querySelectorAll('[data-tema-ir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaIr === raiz.dataset.tema)));
    if (meta) meta.content = raiz.dataset.tema === 'claro' ? '${corClaro}' : '${corEscuro}';
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tema-ir]');
    if (!b || b.dataset.temaIr === raiz.dataset.tema) return;
    // tema-anim liga a passagem suave das cores só durante a troca
    raiz.classList.add('tema-anim');
    raiz.dataset.tema = b.dataset.temaIr;
    try { localStorage.setItem('${chave}', raiz.dataset.tema); } catch (err) { /* sem armazenamento, vale só nesta visita */ }
    marca();
    clearTimeout(fim);
    fim = setTimeout(() => raiz.classList.remove('tema-anim'), 800);
  });
  marca();
})();
`;

const css = `
/* ---------- seletor de tema: pílula com sol e lua e um marcador que desliza como gota ---------- */
/* position com especificidade zero: a lateral fixa (.tema-lado) de cada modelo continua valendo */
:where(.tema-pilula) { position: relative; }
.tema-pilula { --tb: 40px; --tg: 6px; --tp: 6px; --x: 0; --y: 1; --d: 0px; display: inline-grid; gap: var(--tg); padding: var(--tp); background: #fff; border-radius: 30px; box-shadow: 0 10px 30px -10px rgba(0,0,0,.45), 0 0 0 1px rgba(0,0,0,.05); }
/* pílula deitada (menu do celular e barras horizontais) */
.tema-pilula.deitada { --x: 1; --y: 0; grid-auto-flow: column; }
[data-tema="escuro"] .tema-pilula { --d: calc(var(--tb) + var(--tg)); }
.tema-pilula button { position: relative; z-index: 1; display: grid; place-items: center; width: var(--tb); height: var(--tb); padding: 0; border: 0; border-radius: 50%; background: transparent; color: #8a8a8a; cursor: pointer; transition: color .45s ease, transform .4s cubic-bezier(.34, 1.5, .5, 1); }
.tema-pilula button svg { width: 52%; height: 52%; transition: transform .7s cubic-bezier(.34, 1.5, .5, 1); }
.tema-pilula button:hover { transform: scale(1.1); color: var(--tema-cor); }
.tema-pilula button[aria-pressed="true"] { color: #fff; }
.tema-pilula button[aria-pressed="true"]:hover { transform: none; }
.tema-pilula button[data-tema-ir="claro"][aria-pressed="true"] svg { transform: rotate(90deg); }
.tema-pilula button[data-tema-ir="escuro"][aria-pressed="true"] svg { transform: rotate(-24deg); }
.tema-marca { position: absolute; left: var(--tp); top: var(--tp); width: var(--tb); height: var(--tb); border-radius: 50%; background: var(--tema-cor); box-shadow: 0 0 0 4px var(--tema-halo), 0 8px 16px -8px var(--tema-cor); pointer-events: none;
  translate: calc(var(--x) * var(--d)) calc(var(--y) * var(--d)); transition: translate .7s cubic-bezier(.6, -.05, .2, 1.25); }
/* a gota: estica no sentido do caminho, achata ao chegar e volta ao redondo */
.tema-pilula { --g1: .84 1.3; --g2: 1.14 .86; --g3: .97 1.04; }
.tema-pilula.deitada { --g1: 1.3 .84; --g2: .86 1.14; --g3: 1.04 .97; }
@keyframes temaGotaA { 0% { scale: 1; } 30% { scale: var(--g1); } 72% { scale: var(--g2); } 88% { scale: var(--g3); } 100% { scale: 1; } }
@keyframes temaGotaB { 0% { scale: 1; } 30% { scale: var(--g1); } 72% { scale: var(--g2); } 88% { scale: var(--g3); } 100% { scale: 1; } }
.tema-anim[data-tema="escuro"] .tema-marca { animation: temaGotaA .7s cubic-bezier(.45, 0, .2, 1); }
.tema-anim[data-tema="claro"] .tema-marca { animation: temaGotaB .7s cubic-bezier(.45, 0, .2, 1); }
/* a página inteira troca de cor junto, sem piscar */
html.tema-anim *:not(.tema-pilula, .tema-pilula *),
html.tema-anim *:not(.tema-pilula, .tema-pilula *)::before,
html.tema-anim *:not(.tema-pilula, .tema-pilula *)::after { transition: background-color .6s ease, color .6s ease, border-color .6s ease, outline-color .6s ease, box-shadow .6s ease, fill .6s ease, stroke .6s ease, -webkit-text-stroke-color .6s ease !important; }
html.tema-anim body { transition: background-color .6s ease, color .6s ease !important; }
@media (prefers-reduced-motion: reduce) {
  .tema-marca, .tema-pilula button, .tema-pilula button svg { transition: none !important; animation: none !important; }
}
`;

module.exports = { pilula, head, js, css, SOL, LUA };
