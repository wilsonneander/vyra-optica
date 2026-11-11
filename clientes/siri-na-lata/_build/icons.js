// Ilustrações em traço próprias do Siri na Lata (sem biblioteca de ícones).
// Traço arredondado, espessura constante, cor herdada (currentColor).
const svg = (vb, body, cls = '', sw = 2.4) =>
  `<svg class="${cls}" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

// latinha aberta com siri desfiado e torrada
const lataSiri = (cls) => svg('0 0 220 170', `
  <ellipse cx="96" cy="78" rx="62" ry="16"/>
  <path d="M34 78v58c0 9 28 16 62 16s62-7 62-16V78"/>
  <path d="M34 98c0 9 28 16 62 16s62-7 62-16"/>
  <path d="M34 128c0 9 28 16 62 16s62-7 62-16" stroke-dasharray="2 7"/>
  <path d="M40 76c6-16 18-22 26-18 6-12 22-14 30-6 9-9 26-8 32 4 10-2 20 6 20 18"/>
  <path d="M58 70c4-4 9-5 13-3M86 62c4-3 9-3 12 0M112 64c5-2 10 0 12 4M70 80c3 2 7 2 10 0M104 80c3 2 7 2 10 0"/>
  <path d="M142 70c10-20 30-40 52-48 10-4 18 2 14 10-6 14-26 30-48 42"/>
  <path d="M152 66c10-14 26-28 44-36" stroke-dasharray="2 6"/>
  <path d="M66 66l14-38c1-3 4-4 7-3l12 4c3 1 4 4 3 7l-10 34"/>
  <path d="M74 54l20 6M78 42l18 6"/>
  <path d="M60 30c-2-8 4-14 10-12M80 22c0-6 6-10 11-7"/>
`, cls);

// cesta de porção com batatas e camarão
const porcao = (cls) => svg('0 0 220 170', `
  <path d="M30 86h150l-14 60c-1 5-6 8-11 8H55c-5 0-10-3-11-8z"/>
  <path d="M38 104h134M42 122h126M46 140h118" stroke-dasharray="3 6"/>
  <path d="M66 86V48l10-4v42M84 86V36l10 2v48M102 86V44l10-6v48M120 86V30l10 4v52M138 86V50l10 2v34"/>
  <path d="M180 92h18c6 0 10 4 10 10v0c0 6-4 10-10 10h-14"/>
  <path d="M152 40c8-22 46-30 56-4 6 16-4 32-22 32"/>
  <path d="M162 44c6-14 30-18 36-2 4 10-2 18-12 18"/>
  <path d="M152 40l10 4M186 68v-8"/>
  <path d="M186 68l-14 10 4-12-10-4 16-2"/>
  <path d="M170 30l2 10M184 26l-2 12M196 30l-6 10M204 42l-10 4M200 56l-8-2"/>
  <path d="M152 40c-10-6-22-8-32-4M154 36c-6-8-14-12-24-12"/>
  <circle cx="160" cy="38" r="1.6" fill="currentColor"/>
`, cls);

// long neck com rodela de limão (divisor central)
const longNeck = (cls) => svg('0 0 70 260', `
  <path d="M28 8h14v8h-14z"/>
  <path d="M29 16v40c0 10-12 18-12 34v150c0 7 5 12 12 12h12c7 0 12-5 12-12V90c0-16-12-24-12-34V16"/>
  <path d="M17 132h36v62H17"/>
  <path d="M24 150h22M24 162h16M24 174h20"/>
  <path d="M35 60v20" stroke-dasharray="2 6"/>
`, cls, 2);

// ramo de alga (decoração de canto)
const alga = (cls) => svg('0 0 160 200', `
  <path d="M30 196C40 150 34 110 60 70 78 42 96 26 112 8"/>
  <path d="M46 150c-18-6-30-20-32-38 16 4 28 14 32 38zM52 120c18-4 30-16 34-34-16 2-28 14-34 34z"/>
  <path d="M62 96c-16-8-24-22-24-38 14 6 22 18 24 38zM74 76c16-2 28-12 34-28-16 0-28 10-34 28z"/>
  <path d="M88 52c-12-8-18-20-16-34 12 6 18 18 16 34zM100 34c12 0 22-8 26-20-12 0-22 8-26 20z"/>
  <path d="M40 176c14-4 26-2 34 6"/>
`, cls, 1.6);

// pequena onda (usada nos rótulos do cardápio)
const onda = (cls) => svg('0 0 60 12', `<path d="M2 6c6-6 10-6 14 0s8 6 14 0 10-6 14 0 8 6 14 0"/>`, cls, 2);

// redes (desenhos próprios, preenchidos)
const instagram = (cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.3-3.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z"/></svg>`;
const whatsapp = (cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.9a8.1 8.1 0 1 1-4.2 15l-.3-.2-3 .8.8-2.9-.2-.3A8.1 8.1 0 0 1 12 3.9Z"/><path fill="currentColor" d="M9.1 7.2c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.3 3.6 5.6 4.9 2.8 1.1 3.3.9 3.9.8.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5l-.6-.4-2-1c-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5.3-.5c.1-.2 0-.4 0-.5l-1-2.2Z"/></svg>`;
const pino = (cls = 'ic') => svg('0 0 24 24', `<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><path d="M12 7.5c1.4 0 2.5 1.1 2.5 2.5S13.4 12.5 12 12.5 9.5 11.4 9.5 10 10.6 7.5 12 7.5Z"/>`, cls, 1.8);
const seta = (cls = 'ic') => svg('0 0 24 24', `<path d="M4 12h15M13 6l6 6-6 6"/>`, cls, 2);
const menu = (cls = 'ic') => svg('0 0 24 24', `<path d="M3 7h18M3 12h12M3 17h18"/>`, cls, 2);
const fechar = (cls = 'ic') => svg('0 0 24 24', `<path d="M5 5l14 14M19 5L5 19"/>`, cls, 2);

module.exports = { lataSiri, porcao, longNeck, alga, onda, instagram, whatsapp, pino, seta, menu, fechar };
