// Botão de tema claro/escuro da contabilidade: um prumo (fio com peso) pendurado entre o sol e a lua.
// O peso pende para o lado do tema escolhido e chega com mola, balançando até assentar.
// Mesmo formato das outras peças de tema (tema-balanca.js, tema-pilula.js); o script do <head> e os
// desenhos do sol e da lua vêm do tema-balanca.js, para não repetir código.
//
// Uso no build:
//   const T = require('../../_comum/tema-prumo');
//   T.prumo('tema-lado', 'claro')            → markup do prumo (computador e telas grandes)
//   T.compacto('claro')                      → dois botões compactos (menu do celular e do tablet)
//   T.head('chave-do-localStorage')          → <script> do <head>, aplica o tema salvo antes de pintar
//   T.js('chave', '#corClaro', '#corEscuro')  → script da troca (vai no fim do app.js)
//   T.css                                     → estilos (vão no fim do style.css); cores de --tema-cor, --tema-fundo e --tema-peso
const { head, SOL, LUA } = require('./tema-balanca');

const prumo = (onde, padrao) => `<div class="tema-prumo ${onde}" role="group" aria-label="Tema do site">
  <span class="tp-barra" aria-hidden="true"></span>
  <span class="tp-pendulo" aria-hidden="true"><i class="tp-peso"></i></span>
  <button type="button" class="tp-lado tp-claro" data-tema-ir="claro" aria-label="Tema claro" aria-pressed="${padrao === 'claro'}">${SOL}</button>
  <button type="button" class="tp-lado tp-escuro" data-tema-ir="escuro" aria-label="Tema escuro" aria-pressed="${padrao === 'escuro'}">${LUA}</button>
</div>`;

// versão compacta para o menu do celular e do tablet: dois botões iguais, sol e lua, sem o pêndulo
const compacto = (padrao) => `<div class="tema-compacto" role="group" aria-label="Tema do site">
  <button type="button" data-tema-ir="claro" aria-pressed="${padrao === 'claro'}">${SOL}<span>Claro</span></button>
  <button type="button" data-tema-ir="escuro" aria-pressed="${padrao === 'escuro'}">${LUA}<span>Escuro</span></button>
</div>`;

const js = (chave, corClaro, corEscuro) => `
/* ---------- tema claro ou escuro (prumo entre o sol e a lua) ---------- */
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
    if (!b) return;
    // tocar no lado que já está escolhido só faz o prumo balançar
    if (b.dataset.temaIr === raiz.dataset.tema) {
      const p = b.closest('.tema-prumo');
      if (p) { p.classList.remove('tp-balanca'); void p.offsetWidth; p.classList.add('tp-balanca'); }
      return;
    }
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
/* ---------- seletor de tema: prumo entre o sol e a lua ---------- */
/* --tp-ang é a inclinação do fio; positivo leva o peso para a esquerda (sol), negativo para a direita (lua) */
.tema-prumo { --tp-ang: 26deg; position: relative; width: 100px; height: 64px; flex: none; border-radius: 16px; background: var(--tema-fundo); box-shadow: 0 14px 30px -16px rgba(0,0,0,.5), 0 0 0 1px rgba(0,0,0,.06); }
[data-tema="escuro"] .tema-prumo { --tp-ang: -26deg; }
.tp-barra { position: absolute; left: 50%; top: 9px; width: 18px; height: 3px; margin-left: -9px; background: var(--tema-cor); }
.tp-pendulo { position: absolute; left: 50%; top: 11px; width: 2px; height: 30px; margin-left: -1px; background: var(--tema-cor); transform-origin: 50% 0; rotate: var(--tp-ang); transition: rotate 1s cubic-bezier(.3, 1.8, .45, 1); }
.tp-peso { position: absolute; left: 50%; bottom: -14px; width: 12px; height: 16px; margin-left: -6px; background: var(--tema-peso, var(--tema-cor)); clip-path: polygon(50% 0, 100% 38%, 50% 100%, 0 38%); }
.tp-lado { position: absolute; bottom: 6px; display: grid; place-items: center; width: 30px; height: 30px; padding: 0; border: 0; border-radius: 8px; background: none; color: var(--tema-cor); cursor: pointer; opacity: .45; transition: opacity .4s ease, scale .5s cubic-bezier(.3, 1.6, .45, 1); }
.tp-claro { left: 4px; } .tp-escuro { right: 4px; }
.tp-lado svg { width: 19px; height: 19px; }
.tp-lado[aria-pressed="true"] { opacity: 1; scale: 1.08; }
.tp-lado:hover { opacity: 1; }
.tp-lado:focus-visible { outline: 2px solid var(--tema-cor); outline-offset: 1px; }
@keyframes tpBalanca { 0%, 100% { rotate: var(--tp-ang); } 25% { rotate: calc(var(--tp-ang) * -.5); } 55% { rotate: calc(var(--tp-ang) * 1.25); } 80% { rotate: calc(var(--tp-ang) * .9); } }
.tp-balanca .tp-pendulo { animation: tpBalanca 1s ease; }
/* versão compacta (menu do celular): dois botões do mesmo tamanho */
.tema-compacto { display: inline-grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; border-radius: 12px; border: 1px solid color-mix(in srgb, var(--tema-cor) 18%, transparent); }
.tema-compacto button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 36px; padding: 0 12px; border: 0; border-radius: 8px; background: none; color: var(--tema-cor); font-size: 13.5px; font-weight: 500; opacity: .6; transition: background-color .3s, color .3s, opacity .3s; }
.tema-compacto svg { width: 17px; height: 17px; }
.tema-compacto button[aria-pressed="true"] { background: var(--tema-cor); color: var(--tema-fundo); opacity: 1; }
.tema-compacto button:focus-visible { outline: 2px solid var(--tema-cor); outline-offset: 2px; }
/* a página inteira troca de cor junto, sem piscar */
html.tema-anim *:not(.tema-prumo, .tema-prumo *),
html.tema-anim *:not(.tema-prumo, .tema-prumo *)::before,
html.tema-anim *:not(.tema-prumo, .tema-prumo *)::after { transition: background-color .6s ease, color .6s ease, border-color .6s ease, outline-color .6s ease, box-shadow .6s ease, fill .6s ease, stroke .6s ease !important; }
html.tema-anim body { transition: background-color .6s ease, color .6s ease !important; }
@media (prefers-reduced-motion: reduce) {
  .tp-pendulo, .tp-lado { transition: none !important; animation: none !important; }
}
`;

module.exports = { prumo, compacto, head, js, css };
