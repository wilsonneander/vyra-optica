// Marca e ícones próprios da Camélia Estética, Gold Íris (cópia do logo do Silver, com cores da paleta Íris) (traço 1.6, pontas arredondadas, sem biblioteca de ícones).
const petala = (r, d, a) => `<path d="M24 24C${24 - d} ${24 - r * .3} ${24 - d} ${24 - r * .85} 24 ${24 - r}C${24 + d} ${24 - r * .85} ${24 + d} ${24 - r * .3} 24 24Z" transform="rotate(${a} 24 24)"/>`;
const flor = (cls = '') => `<svg class="flor ${cls}" viewBox="0 0 48 48" aria-hidden="true">
  <g fill="var(--flor-1, #E4DFEE)" stroke="var(--flor-2, #1E2233)" stroke-width="1.3" stroke-linejoin="round">${[0, 72, 144, 216, 288].map((a) => petala(20, 7.5, a)).join('')}</g>
  <g fill="var(--flor-2, #1E2233)">${[36, 108, 180, 252, 324].map((a) => petala(12, 4.2, a)).join('')}</g>
  <circle cx="24" cy="24" r="2.8" fill="var(--flor-3, #B8735A)"/>
</svg>`;

const logo = `<span class="logo-marca">${flor()}<span class="logo-txt"><b>Camélia</b><small>Olhar e pele</small></span></span>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#F6F3EF"/>
  <g fill="#E4DFEE" stroke="#1E2233" stroke-width="1.6" stroke-linejoin="round">${[0, 72, 144, 216, 288].map((a) => petala(20, 7.5, a)).join('')}</g>
  <g fill="#1E2233">${[36, 108, 180, 252, 324].map((a) => petala(12, 4.2, a)).join('')}</g>
  <circle cx="24" cy="24" r="2.8" fill="#B8735A"/></svg>`;

const s = (d, extra = '') => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;

// botão de tema: cada pétala num grupo próprio para fechar em sequência; a lua entra à noite
const temaFlor = `<svg viewBox="0 0 48 48" aria-hidden="true">
  ${[0, 72, 144, 216, 288].map((a, k) => `<g class="tm-pet" style="--a:${a}deg;--d:${k * 45}ms">${petala(19, 7.5, 0)}</g>`).join('')}
  <g class="tm-miolo">${[36, 108, 180, 252, 324].map((a) => petala(11, 4, a)).join('')}</g>
  <circle class="tm-centro" cx="24" cy="24" r="3"/>
  <path class="tm-lua" d="M27 16.6A8 8 0 1 0 31.4 27 6.4 6.4 0 0 1 27 16.6Z"/>
</svg>`;


// embalagens desenhadas da loja (sem foto): cada forma num viewBox 0 0 120 160, com a cor do produto
const rotulo = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#FFFDFB" fill-opacity=".9"/><path d="M${x + 8} ${y + h * .42}h${w - 16}M${x + 8} ${y + h * .62}h${(w - 16) * .6}" stroke="#1E2233" stroke-width="1.4" stroke-linecap="round" opacity=".5"/>`;
const sombra = '<ellipse cx="60" cy="152" rx="34" ry="4" fill="#1E2233" opacity=".12"/>';
const embalagem = (forma, cor) => {
  const f = {
    'conta-gotas': `<rect x="50" y="20" width="20" height="34" rx="9" fill="#1E2233"/><rect x="46" y="50" width="28" height="12" rx="2" fill="#2C3150"/><rect x="38" y="60" width="44" height="86" rx="8" fill="${cor}"/>${rotulo(44, 86, 32, 34)}`,
    frasco: `<rect x="52" y="18" width="16" height="16" rx="2" fill="#1E2233"/><path d="M50 34h20l-3 10H53Z" fill="#2C3150"/><rect x="34" y="44" width="52" height="102" rx="12" fill="${cor}"/>${rotulo(40, 78, 40, 40)}`,
    bisnaga: `<path d="M38 18h44l-6 112H44Z" fill="${cor}"/><path d="M38 18h44v6H38Z" fill="#1E2233" opacity=".25"/><rect x="48" y="130" width="24" height="16" rx="3" fill="#1E2233"/>${rotulo(46, 52, 28, 46)}`,
    pote: `<rect x="26" y="70" width="68" height="18" rx="4" fill="#1E2233"/><rect x="28" y="86" width="64" height="60" rx="10" fill="${cor}"/>${rotulo(36, 98, 48, 30)}`,
    tubo: `<rect x="52" y="16" width="16" height="58" rx="7" fill="#1E2233"/><rect x="50" y="70" width="20" height="76" rx="6" fill="${cor}"/><rect x="53" y="88" width="14" height="40" rx="2" fill="#FFFDFB" fill-opacity=".85"/>`,
    escovas: [0, 1, 2].map((k) => `<g transform="rotate(${(k - 1) * 12} 60 146)"><rect x="57" y="62" width="6" height="84" rx="3" fill="${k === 1 ? '#B8735A' : cor}"/><path d="M60 22c-9 0-10 9-10 20s1 22 10 22 10-11 10-22-1-20-10-20Z" fill="none" stroke="${k === 1 ? '#B8735A' : cor}" stroke-width="1.2" stroke-dasharray="1.6 1.4"/><path d="M52 30h16M51 38h18M51 46h18M51 54h18" stroke="${k === 1 ? '#B8735A' : cor}" stroke-width="1.1"/></g>`).join(''),
  }[forma];
  return `<svg class="emb" viewBox="0 0 120 160" aria-hidden="true">${sombra}${f}</svg>`;
};

module.exports = {
  flor, logo, favicon, temaFlor, embalagem,
  whats: `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.3Z"/></svg>`,
  pino: s('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>'),
  seta: s('<path d="M5 12h13M13 6.5 18.5 12 13 17.5"/>'),
  voltar: s('<path d="M19 12H6M11 6.5 5.5 12 11 17.5"/>'),
  mais: s('<path d="M12 6v12M6 12h12"/>'),
  menos: s('<path d="M6 12h12"/>'),
  fechar: s('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
  relogio: s('<circle cx="12" cy="12" r="8.2"/><path d="M12 7.6V12l3 2"/>'),
  // sacola com alça em arco, no traço da marca
  sacola: s('<path d="M5.5 8.5h13l-1 11.5h-11Z"/><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5"/>'),
  agenda: s('<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'),
  // laço de presente desenhado como duas pétalas
  presente: s('<rect x="4.5" y="10" width="15" height="10" rx="1.5"/><path d="M3.5 7.5h17v2.5h-17zM12 7.5V20M12 7.5c-1.5-3.5-5.5-3.6-5.5-1.6 0 1.4 2.6 1.6 5.5 1.6ZM12 7.5c1.5-3.5 5.5-3.6 5.5-1.6 0 1.4-2.6 1.6-5.5 1.6Z"/>'),
  estrela: '<svg class="st" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.8l2.4 5.3 5.8.6-4.3 3.9 1.2 5.7L10 14.4l-5.1 2.9 1.2-5.7L1.8 7.7l5.8-.6Z"/></svg>',
  insta: s('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>'),
  face: s('<path d="M14.5 8.5H16V5.6h-2c-2.3 0-3.5 1.4-3.5 3.6v1.6H8.4v2.9h2.1V20h3v-6.3h2.2l.4-2.9h-2.6V9.5c0-.6.3-1 1-1Z"/>'),
  linkedin: s('<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6s2.2.9 2.2 2.6V16"/>'),
};
