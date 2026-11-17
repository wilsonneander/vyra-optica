// Desenhos próprios da Peakalika (traço 1.6, pontas redondas, curvas de voo). Sem bibliotecas de ícones.
const s = (body, vb = '0 0 24 24') => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

// avião da marca (o mesmo desenho do logo: bimotor visto de cima, apontando para a direita)
const aviaoPath = 'M22.6 12c0 .8-.9 1.3-2 1.3h-5.3l-4.5 7.3H8.4l2.3-7.3H6.4l-1.9 2.4H2.8l1.1-3.7-1.1-3.7h1.7l1.9 2.4h4.3L8.4 3.4h2.4l4.5 7.3h5.3c1.1 0 2 .5 2 1.3Z';

// castelo encantado em linha: cada traço tem pathLength=1 para ser desenhado com o scroll
const castelo = (() => {
  const p = (d, cls = '') => `<path pathLength="1"${cls ? ` class="${cls}"` : ''} d="${d}"/>`;
  const torre = (x, w, topo, base, ponta) => p(`M${x} ${base}V${topo}h${w}V${base}`) + p(`M${x - 6} ${topo}L${x + w / 2} ${ponta}L${x + w + 6} ${topo}Z`, 'tc') +
    p(`M${x + w / 2} ${ponta}v-16l12 4.5-12 4.5`, 'bd');
  const janela = (x, y, w = 10, h = 18) => p(`M${x} ${y + h}v-${h - w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0v${h - w / 2}`, 'jn');
  const ameias = (x0, x1, y) => { let d = `M${x0} ${y}`; for (let x = x0; x < x1; x += 16) d += `h8v-8h8v8`; return p(d); };
  return `<svg class="castelo" viewBox="0 0 640 380" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    ${p('M0 368H640', 'chao')}
    ${torre(298, 44, 96, 200, 22)}
    ${p('M262 368V196h116v172')}
    ${p('M302 368v-46a18 18 0 0 1 36 0v46')}
    ${torre(214, 40, 150, 368, 74)}${torre(386, 40, 150, 368, 74)}
    ${torre(136, 32, 214, 368, 152)}${torre(472, 32, 214, 368, 152)}
    ${torre(64, 26, 262, 368, 214)}${torre(550, 26, 262, 368, 214)}
    ${ameias(168, 214, 270)}${p('M168 368V270')}${ameias(426, 472, 270)}${p('M472 368V270')}
    ${ameias(90, 136, 300)}${ameias(504, 550, 300)}
    ${janela(315, 120)}${janela(229, 176)}${janela(401, 176)}${janela(146, 236, 12, 20)}${janela(482, 236, 12, 20)}
    ${janela(280, 232, 12, 22)}${janela(348, 232, 12, 22)}${janela(71, 290, 12, 18)}${janela(557, 290, 12, 18)}
  </svg>`;
})();

module.exports = {
  aviaoPath,
  aviao: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${aviaoPath}"/></svg>`,
  castelo,
  // rota curva com avião (separador da faixa e marcador do roteiro)
  rota: s('<path d="M2 18c4-9 10-12 18-11" stroke-dasharray="2 3"/><path fill="currentColor" stroke="none" d="m21.5 6.8-4.6-2.4 1 2.5-1.6 2 5.2-2.1Z"/>'),
  seta: s('<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>'),
  setaDiag: s('<path d="M7 17 17 7"/><path d="M8 7h9v9"/>'),
  setaEsq: s('<path d="M20 12H5"/><path d="m11 6-6 6 6 6"/>'),
  fechar: s('<path d="M6 6l12 12M18 6 6 18"/>'),
  mais: s('<path d="M12 5v14M5 12h14"/>'),
  menos: s('<path d="M5 12h14"/>'),
  play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5Z"/></svg>`,
  pausa: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>`,
  som: s('<path d="M4 9h3l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6"/>'),
  // estrela de nota (cinco pontas cheia, para avaliações)
  estrela: `<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="m10 1.6 2.6 5.5 6 .7-4.5 4.1 1.2 5.9L10 14.9l-5.3 2.9 1.2-5.9L1.4 7.8l6-.7Z"/></svg>`,
  // ícone do Google (letra G) para o link da avaliação original
  google: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3ZM12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Zm-5.6-8a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9.1L6.4 14ZM12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5L6.4 10C7.2 7.8 9.4 6 12 6Z"/></svg>`,
  whats: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 5-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2c0 1.2.8 2.3.9 2.5.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.3-.2Z"/></svg>`,
  insta: s('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><path d="M17 7.2v.1"/>'),
  face: s('<path d="M14.5 21v-8h3l.5-3.5h-3.5V7.8c0-1 .3-1.8 1.8-1.8H18V3.2A24 24 0 0 0 15.4 3c-2.6 0-4.4 1.6-4.4 4.5v2H8V13h3v8"/>'),
  pino: s('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.4"/>'),
  troca: s('<path d="M4 8h14l-3.5-3.5"/><path d="M20 16H6l3.5 3.5"/>'),
};
