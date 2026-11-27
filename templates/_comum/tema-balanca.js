// Botão de tema claro/escuro dos escritórios (advocacia e contabilidade).
// Uma balança: o sol num prato, a lua no outro. O prato do tema escolhido desce, o travessão gira
// com uma mola e os pratos balançam até assentar. As cores da página passam de um tema para o outro.
//
// Uso no build:
//   const T = require('../../_comum/tema-balanca');
//   T.balanca('tema-lado', 'claro')        → markup (classe extra de posição e tema padrão do modelo)
//   T.head('chave-do-localStorage')        → <script> do <head>, aplica o tema salvo antes de pintar
//   T.js('chave', '#corClaro', '#corEscuro') → script da troca (vai no fim do app.js)
//   T.css                                   → estilos (vão no fim do style.css); cores de --tema-cor e --tema-fundo
// No HTML, <html data-tema="claro|escuro"> diz o tema padrão do modelo.

const SOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3.6"/><path d="M12 3.2v2M12 18.8v2M3.2 12h2M18.8 12h2M5.8 5.8l1.4 1.4M16.8 16.8l1.4 1.4M5.8 18.2l1.4-1.4M16.8 7.2l1.4-1.4"/></svg>';
const LUA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M15.2 4a8 8 0 1 0 4.9 11.6A6.4 6.4 0 0 1 15.2 4Z"/></svg>';

const balanca = (onde, padrao) => `<div class="tema-balanca ${onde}" role="group" aria-label="Tema do site">
  <span class="tb-coluna" aria-hidden="true"></span>
  <span class="tb-travessao" aria-hidden="true"></span>
  <button type="button" class="tb-prato tb-claro" data-tema-ir="claro" aria-label="Tema claro" aria-pressed="${padrao === 'claro'}"><span class="tb-fio" aria-hidden="true"></span>${SOL}</button>
  <button type="button" class="tb-prato tb-escuro" data-tema-ir="escuro" aria-label="Tema escuro" aria-pressed="${padrao === 'escuro'}"><span class="tb-fio" aria-hidden="true"></span>${LUA}</button>
</div>`;

const head = (chave) => `<script>try{var t=new URLSearchParams(location.search).get("tema")||localStorage.getItem("${chave}");if(t==="claro"||t==="escuro")document.documentElement.dataset.tema=t;}catch(e){}</script>`;

const js = (chave, corClaro, corEscuro) => `
/* ---------- tema claro ou escuro (balança na lateral e no topo do celular) ---------- */
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
    // clicar no prato que já está embaixo só faz a balança oscilar
    if (b.dataset.temaIr === raiz.dataset.tema) {
      const bal = b.closest('.tema-balanca');
      bal.classList.remove('tb-oscila'); void bal.offsetWidth; bal.classList.add('tb-oscila');
      return;
    }
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
/* ---------- seletor de tema: balança com o sol e a lua nos pratos ---------- */
/* --tb-ang é a inclinação do travessão; o prato do tema escolhido fica embaixo */
:where(.tema-balanca) { position: relative; }
.tema-balanca { --tb-ang: -13deg; --tb-braco: 30px; width: 96px; height: 70px; flex: none; border-radius: 18px; background: var(--tema-fundo); box-shadow: 0 14px 30px -16px rgba(0,0,0,.5), 0 0 0 1px rgba(0,0,0,.06); }
[data-tema="escuro"] .tema-balanca { --tb-ang: 13deg; }
.tb-coluna { position: absolute; left: 50%; top: 15px; bottom: 9px; width: 2px; margin-left: -1px; background: var(--tema-cor); border-radius: 2px; }
.tb-coluna::after { content: ""; position: absolute; left: 50%; bottom: 0; width: 22px; height: 2px; margin-left: -11px; background: inherit; border-radius: 2px; }
.tb-travessao { position: absolute; left: 50%; top: 14px; width: calc(var(--tb-braco) * 2 + 4px); height: 2px; margin-left: calc(var(--tb-braco) * -1 - 2px); background: var(--tema-cor); border-radius: 2px; rotate: var(--tb-ang); transition: rotate .9s cubic-bezier(.3, 1.7, .45, 1); }
.tb-travessao::after { content: ""; position: absolute; left: 50%; top: -3px; width: 8px; height: 8px; margin-left: -4px; border-radius: 50%; background: var(--tema-cor); }
/* cada prato pende da ponta do travessão: desce ou sobe o seno da inclinação vezes o braço */
.tb-prato { position: absolute; top: 15px; display: grid; place-items: end center; width: 34px; height: 40px; margin-left: -17px; padding: 0 0 2px; border: 0; background: none; color: var(--tema-cor); cursor: pointer; opacity: .55;
  transition: translate .9s cubic-bezier(.3, 1.7, .45, 1), opacity .4s ease; }
.tb-claro { left: calc(50% - var(--tb-braco)); translate: 0 calc(sin(var(--tb-ang)) * var(--tb-braco) * -1); }
.tb-escuro { left: calc(50% + var(--tb-braco)); translate: 0 calc(sin(var(--tb-ang)) * var(--tb-braco)); }
.tb-prato svg { width: 22px; height: 22px; transition: rotate .9s cubic-bezier(.3, 1.6, .45, 1); }
.tb-fio { position: absolute; left: 50%; top: 0; width: 1px; height: 16px; background: var(--tema-cor); opacity: .7; }
.tb-prato::after { content: ""; position: absolute; left: 3px; right: 3px; bottom: 0; height: 2px; border-radius: 2px; background: var(--tema-cor); }
.tb-prato[aria-pressed="true"] { opacity: 1; }
.tb-claro[aria-pressed="true"] svg { rotate: 90deg; }
.tb-escuro[aria-pressed="true"] svg { rotate: -20deg; }
.tb-prato:hover { opacity: 1; }
.tb-prato:focus-visible { outline: 2px solid var(--tema-cor); outline-offset: 2px; border-radius: 8px; }
/* toque no prato que já está embaixo: a balança oscila e volta */
@keyframes tbOscila { 0%, 100% { rotate: var(--tb-ang); } 30% { rotate: calc(var(--tb-ang) * -.45); } 62% { rotate: calc(var(--tb-ang) * 1.18); } 82% { rotate: calc(var(--tb-ang) * .92); } }
.tb-oscila .tb-travessao { animation: tbOscila .9s ease; }
/* a página inteira troca de cor junto, sem piscar */
html.tema-anim *:not(.tema-balanca, .tema-balanca *),
html.tema-anim *:not(.tema-balanca, .tema-balanca *)::before,
html.tema-anim *:not(.tema-balanca, .tema-balanca *)::after { transition: background-color .6s ease, color .6s ease, border-color .6s ease, outline-color .6s ease, box-shadow .6s ease, fill .6s ease, stroke .6s ease !important; }
html.tema-anim body { transition: background-color .6s ease, color .6s ease !important; }
@media (prefers-reduced-motion: reduce) {
  .tb-travessao, .tb-prato, .tb-prato svg { transition: none !important; animation: none !important; }
}
`;

module.exports = { balanca, head, js, css, SOL, LUA };
