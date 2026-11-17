// Botão de tema claro/escuro dos modelos de bebidas (Tampinha Bronze, Silver e Gold; N3 Drinks).
// Pílula com sol e lua; o marcador é uma tampinha coroa que ROLA de um ícone ao outro (gira enquanto anda),
// dá um pulinho ao chegar e solta bolhas de gás. A página troca de tema num círculo que se espalha
// a partir da tampinha (View Transitions); sem esse recurso, as cores passam suavemente de um tema ao outro.
//
// Uso no build:
//   const T = require('../../_comum/tema-tampinha');
//   T.pilula('tema-lado', 'claro')            → markup (tema-lado: fixa na lateral; deitada: dentro do menu do celular)
//   T.head('chave-do-localStorage')           → <script> do <head>, aplica o tema salvo antes de pintar
//   T.js('chave', '#corClaro', '#corEscuro')  → script da troca (vai no fim do app.js)
//   T.css                                      → estilos (vão no fim do style.css)
// Cores por modelo: --tema-cor (tampinha), --tt-fundo (pílula), --tt-icone (ícone apagado), --tt-borda, --tt-gas (bolhas).
// No HTML, <html data-tema="claro|escuro"> diz o tema padrão do modelo. ?tema=claro|escuro no link também vale.

const SOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.1"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M5.4 18.6l1.5-1.5M17.1 6.9l1.5-1.5"/></svg>';
const LUA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M15 3.4a8.6 8.6 0 1 0 5.7 12.3A6.9 6.9 0 0 1 15 3.4Z"/></svg>';

// tampinha coroa: 21 dentes na borda, miolo um pouco mais escuro e um brilho de metal
const TAMPA = (() => {
  const n = 21, ext = 20, int = 17.4, pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2, r = i % 2 ? int : ext;
    pts.push((20 + r * Math.cos(a)).toFixed(2) + ',' + (20 + r * Math.sin(a)).toFixed(2));
  }
  return `<svg viewBox="0 0 40 40" aria-hidden="true"><polygon points="${pts.join(' ')}" fill="currentColor"/><circle cx="20" cy="20" r="14.6" fill="rgba(0,0,0,.16)"/><circle cx="20" cy="20" r="13.2" fill="currentColor"/><path d="M11.5 15.2a9.6 9.6 0 0 1 7.2-5.1" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-linecap="round"/></svg>`;
})();

const pilula = (onde, padrao) => `<div class="tema-tampa ${onde}" role="group" aria-label="Tema do site">
  <span class="tt-gas" aria-hidden="true"></span>
  <i class="tt-marca" aria-hidden="true">${TAMPA}</i>
  <button type="button" data-tema-ir="claro" aria-label="Tema claro" title="Tema claro" aria-pressed="${padrao === 'claro'}">${SOL}</button>
  <button type="button" data-tema-ir="escuro" aria-label="Tema escuro" title="Tema escuro" aria-pressed="${padrao === 'escuro'}">${LUA}</button>
</div>`;

const head = (chave) => `<script>try{var t=new URLSearchParams(location.search).get("tema")||localStorage.getItem("${chave}");if(t==="claro"||t==="escuro")document.documentElement.dataset.tema=t;}catch(e){}</script>`;

const js = (chave, corClaro, corEscuro) => `
/* ---------- tema claro ou escuro: tampinha que rola entre o sol e a lua ---------- */
(() => {
  const raiz = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const calmo = matchMedia('(prefers-reduced-motion: reduce)');
  let fim;
  const marca = () => {
    document.querySelectorAll('[data-tema-ir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaIr === raiz.dataset.tema)));
    if (meta) meta.content = raiz.dataset.tema === 'claro' ? '${corClaro}' : '${corEscuro}';
  };
  // bolhas de gás saindo da tampinha quando ela para
  const gas = (pilula) => {
    const caixa = pilula.querySelector('.tt-gas');
    if (!caixa || calmo.matches) return;
    for (let i = 0; i < 11; i++) {
      const b = document.createElement('i');
      b.style.setProperty('--sx', (Math.random() * 30 - 15).toFixed(1) + 'px');
      b.style.setProperty('--dx', (Math.random() * 26 - 13).toFixed(1) + 'px');
      b.style.setProperty('--sz', (4 + Math.random() * 7).toFixed(1) + 'px');
      b.style.setProperty('--sobe', (44 + Math.random() * 46).toFixed(0) + 'px');
      b.style.animationDelay = (420 + Math.random() * 260).toFixed(0) + 'ms';
      caixa.appendChild(b);
      setTimeout(() => b.remove(), 2000);
    }
  };
  const aplica = (tema) => {
    raiz.dataset.tema = tema;
    try { localStorage.setItem('${chave}', tema); } catch (err) { /* sem armazenamento, vale só nesta visita */ }
    marca();
    document.dispatchEvent(new CustomEvent('tema', { detail: { tema } }));
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tema-ir]');
    if (!b || b.dataset.temaIr === raiz.dataset.tema) return;
    const pilula = b.closest('.tema-tampa');
    // a tampinha rola na hora; tema-anim liga o pulinho e a passagem suave das cores
    raiz.classList.add('tema-anim');
    clearTimeout(fim);
    fim = setTimeout(() => raiz.classList.remove('tema-anim'), 900);
    if (pilula) gas(pilula);
    const tema = b.dataset.temaIr;
    if (!document.startViewTransition || calmo.matches) { aplica(tema); return; }
    // a página nova se espalha em círculo a partir da tampinha, como bebida derramando
    const r = (pilula || b).getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    raiz.classList.add('tema-vt');
    const vt = document.startViewTransition(() => aplica(tema));
    vt.ready.then(() => {
      raiz.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + raio + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 900, easing: 'cubic-bezier(.6, 0, .25, 1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => {});
    vt.finished.finally(() => raiz.classList.remove('tema-vt'));
  });
  marca();
})();
`;

const css = `
/* ---------- seletor de tema: pílula com sol e lua e uma tampinha que rola entre os dois ---------- */
/* position com especificidade zero: a lateral fixa (.tema-lado) de cada modelo continua valendo */
:where(.tema-tampa) { position: relative; }
.tema-tampa { --tb: 40px; --tg: 6px; --tp: 6px; --x: 0; --y: 1; --d: 0px; --giro: 0deg;
  display: inline-grid; gap: var(--tg); padding: var(--tp); border-radius: 30px;
  background: var(--tt-fundo, #fff); box-shadow: 0 12px 30px -12px rgba(0,0,0,.5), inset 0 0 0 1px var(--tt-borda, rgba(0,0,0,.06)); }
.tema-tampa.deitada { --x: 1; --y: 0; grid-auto-flow: column; }
[data-tema="escuro"] .tema-tampa { --d: calc(var(--tb) + var(--tg)); --giro: 236deg; }
.tema-tampa button { position: relative; z-index: 2; display: grid; place-items: center; width: var(--tb); height: var(--tb); padding: 0; border: 0; border-radius: 50%; background: transparent; color: var(--tt-icone, #8a8a8a); cursor: pointer; transition: color .45s ease .15s, transform .4s cubic-bezier(.34, 1.5, .5, 1); }
.tema-tampa button svg { width: 50%; height: 50%; transition: transform .8s cubic-bezier(.34, 1.5, .5, 1); }
.tema-tampa button:hover { transform: scale(1.12); color: var(--tema-cor); }
.tema-tampa button[aria-pressed="true"] { color: var(--tt-ativo, #fff); }
.tema-tampa button[aria-pressed="true"]:hover { transform: none; }
.tema-tampa button[data-tema-ir="claro"][aria-pressed="true"] svg { transform: rotate(90deg); }
.tema-tampa button[data-tema-ir="escuro"][aria-pressed="true"] svg { transform: rotate(-22deg); }
/* a tampinha: anda e gira junto, como se rolasse pela pílula */
.tt-marca { position: absolute; z-index: 1; left: calc(var(--tp) - 3px); top: calc(var(--tp) - 3px); width: calc(var(--tb) + 6px); height: calc(var(--tb) + 6px); color: var(--tema-cor); pointer-events: none;
  translate: calc(var(--x) * var(--d)) calc(var(--y) * var(--d)); rotate: var(--giro);
  filter: drop-shadow(0 6px 8px rgba(0,0,0,.28));
  transition: translate .75s cubic-bezier(.65, -.12, .25, 1.18), rotate .75s cubic-bezier(.65, -.12, .25, 1.18); }
.tt-marca svg { width: 100%; height: 100%; }
/* o pulinho: aperta ao sair, estica no meio do caminho e assenta com um quique */
@keyframes ttPuloA { 0% { scale: 1; } 18% { scale: .86; } 50% { scale: 1.16; } 76% { scale: .95; } 90% { scale: 1.03; } 100% { scale: 1; } }
@keyframes ttPuloB { 0% { scale: 1; } 18% { scale: .86; } 50% { scale: 1.16; } 76% { scale: .95; } 90% { scale: 1.03; } 100% { scale: 1; } }
.tema-anim[data-tema="escuro"] .tt-marca { animation: ttPuloA .8s ease-out; }
.tema-anim[data-tema="claro"] .tt-marca { animation: ttPuloB .8s ease-out; }
/* bolhas de gás que sobem da tampinha */
.tt-gas { position: absolute; z-index: 3; left: calc(var(--tp) + var(--tb) / 2); top: calc(var(--tp) + var(--tb) / 2); width: 0; height: 0; pointer-events: none;
  translate: calc(var(--x) * var(--d)) calc(var(--y) * var(--d)); }
.tt-gas i { position: absolute; left: var(--sx); top: 0; width: var(--sz); height: var(--sz); margin: calc(var(--sz) / -2); border-radius: 50%;
  border: 1.5px solid var(--tt-gas, var(--tema-cor)); background: color-mix(in srgb, var(--tt-gas, var(--tema-cor)) 22%, transparent);
  opacity: 0; animation: ttSobe 1.1s cubic-bezier(.3, .6, .4, 1) both; }
@keyframes ttSobe {
  0% { opacity: 0; translate: 0 0; scale: .3; }
  15% { opacity: .95; }
  55% { translate: calc(var(--dx) * -.6) calc(var(--sobe) * -.55); }
  100% { opacity: 0; translate: var(--dx) calc(var(--sobe) * -1); scale: 1.15; }
}
/* sem View Transitions: a página inteira troca de cor junto, sem piscar */
html.tema-anim:not(.tema-vt) *:not(.tema-tampa, .tema-tampa *),
html.tema-anim:not(.tema-vt) *:not(.tema-tampa, .tema-tampa *)::before,
html.tema-anim:not(.tema-vt) *:not(.tema-tampa, .tema-tampa *)::after { transition: background-color .6s ease, color .6s ease, border-color .6s ease, outline-color .6s ease, box-shadow .6s ease, fill .6s ease, stroke .6s ease !important; }
html.tema-anim:not(.tema-vt) body { transition: background-color .6s ease, color .6s ease !important; }
/* com View Transitions: a página antiga fica parada e a nova entra por cima, em círculo */
::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
::view-transition-new(root) { z-index: 2; }
@media (prefers-reduced-motion: reduce) {
  .tt-marca, .tema-tampa button, .tema-tampa button svg { transition: none !important; animation: none !important; }
  .tt-gas { display: none; }
}
`;

module.exports = { pilula, head, js, css, SOL, LUA, TAMPA };
