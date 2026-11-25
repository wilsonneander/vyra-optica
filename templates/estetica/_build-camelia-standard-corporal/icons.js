// Marca e ícones próprios da Camélia Estética (traço 1.6, pontas arredondadas, sem biblioteca de ícones).
const petala = (r, d, a) => `<path d="M24 24C${24 - d} ${24 - r * .3} ${24 - d} ${24 - r * .85} 24 ${24 - r}C${24 + d} ${24 - r * .85} ${24 + d} ${24 - r * .3} 24 24Z" transform="rotate(${a} 24 24)"/>`;
const flor = (cls = '') => `<svg class="flor ${cls}" viewBox="0 0 48 48" aria-hidden="true">
  <g fill="var(--flor-1, #EBE0D2)" stroke="var(--flor-2, #8C6B35)" stroke-width="1.3" stroke-linejoin="round">${[0, 72, 144, 216, 288].map((a) => petala(20, 7.5, a)).join('')}</g>
  <g fill="var(--flor-2, #8C6B35)">${[36, 108, 180, 252, 324].map((a) => petala(12, 4.2, a)).join('')}</g>
  <circle cx="24" cy="24" r="2.8" fill="var(--flor-3, #B99D70)"/>
</svg>`;

const logo = `<span class="logo-marca">${flor()}<span class="logo-txt"><b>Camélia</b><small>Estética</small></span></span>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#F8F5F2"/>
  <g fill="#EBE0D2" stroke="#8C6B35" stroke-width="1.6" stroke-linejoin="round">${[0, 72, 144, 216, 288].map((a) => petala(20, 7.5, a)).join('')}</g>
  <g fill="#8C6B35">${[36, 108, 180, 252, 324].map((a) => petala(12, 4.2, a)).join('')}</g>
  <circle cx="24" cy="24" r="2.8" fill="#B99D70"/></svg>`;

const s = (d, extra = '') => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;

// botão de tema: cada pétala num grupo próprio para fechar em sequência; a lua entra à noite
const temaFlor = `<svg viewBox="0 0 48 48" aria-hidden="true">
  ${[0, 72, 144, 216, 288].map((a, k) => `<g class="tm-pet" style="--a:${a}deg;--d:${k * 45}ms">${petala(19, 7.5, 0)}</g>`).join('')}
  <g class="tm-miolo">${[36, 108, 180, 252, 324].map((a) => petala(11, 4, a)).join('')}</g>
  <circle class="tm-centro" cx="24" cy="24" r="3"/>
  <path class="tm-lua" d="M27 16.6A8 8 0 1 0 31.4 27 6.4 6.4 0 0 1 27 16.6Z"/>
</svg>`;

module.exports = {
  flor, logo, favicon, temaFlor,
  whats: `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.3Z"/></svg>`,
  pino: s('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>'),
  seta: s('<path d="M5 12h13M13 6.5 18.5 12 13 17.5"/>'),
  mais: s('<path d="M12 6v12M6 12h12"/>'),
  fechar: s('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
  relogio: s('<circle cx="12" cy="12" r="8.2"/><path d="M12 7.6V12l3 2"/>'),
  folha: s('<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z"/><path d="M5 19 13 11"/>'),
  insta: s('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>'),
  face: s('<path d="M14.5 8.5H16V5.6h-2c-2.3 0-3.5 1.4-3.5 3.6v1.6H8.4v2.9h2.1V20h3v-6.3h2.2l.4-2.9h-2.6V9.5c0-.6.3-1 1-1Z"/>'),
  linkedin: s('<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6s2.2.9 2.2 2.6V16"/>'),
};
