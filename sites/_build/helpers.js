// Peças compartilhadas pelos três modelos de site.
const LOGO_PATH = 'M35.20 0L19.80 0L-0.10-48.90L18.50-48.90L27.60-19.30L36.70-48.90L55.10-48.90L35.20 0ZM84.60 20.70L67.10 20.70L77.70-2.50L59.10-48.90L77.70-48.90L86.10-20.80L94.50-48.90L113.10-48.90L93 0.10L84.60 20.70ZM132.40 0L115 0L115-48.90L132.40-48.90L132.40-45.80Q137.20-49.90 144.80-49.90L144.80-49.90Q148.30-49.90 150.85-49Q153.40-48.10 155.20-46.20L155.20-46.20L145.10-32.70Q144.30-33.60 142.85-34.15Q141.40-34.70 139.60-34.70L139.60-34.70Q136.20-34.70 134.30-32.65Q132.40-30.60 132.40-26.60L132.40-26.60L132.40 0ZM175.70 1L175.70 1Q168.90 1 163.60-2.30Q158.30-5.60 155.30-11.35Q152.30-17.10 152.30-24.40L152.30-24.40Q152.30-31.80 155.30-37.60Q158.30-43.40 163.60-46.65Q168.90-49.90 175.70-49.90L175.70-49.90Q180.30-49.90 184.10-48.30L184.10-48.30Q186.50-47.20 188.30-45.70L188.30-45.70L188.30-48.90L205.40-48.90L205.40 0L188.30 0L188.30-3.30Q186.50-1.800 184.10-0.70L184.10-0.70Q180.30 1 175.70 1ZM179.40-14.50L179.40-14.50Q183.70-14.50 186.35-17.30Q189.00-20.10 189.00-24.50L189.00-24.50Q189.00-27.40 187.80-29.60Q186.60-31.80 184.45-33.10Q182.30-34.40 179.50-34.40Q176.70-34.40 174.55-33.10Q172.40-31.80 171.15-29.55Q169.90-27.30 169.90-24.50L169.90-24.50Q169.90-21.60 171.10-19.35Q172.30-17.10 174.50-15.80Q176.70-14.50 179.40-14.50Z';

// Logo vetorial: a cor do texto vem de `color` (currentColor); o ponto é sempre verde, salvo `dot`.
function logo(cls = 'logo', dot = '#18E28A') {
  return `<svg class="${cls}" viewBox="-0.10 -49.90 232.50 70.60" role="img" aria-label="Vyra"><path fill="currentColor" d="${LOGO_PATH}"/><circle fill="${dot}" cx="222.40" cy="-10" r="10"/></svg>`;
}

const ICONS = {
  fiber: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M19 20a3 3 0 0 1-3 2h-3"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none"/>',
  shield: '<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8.3-7.5 9.5-4.3-1.2-7.5-5-7.5-9.5V6z"/><path d="M8.8 12.2l2.2 2.2 4.4-4.6"/>',
  home: '<path d="M4 11l8-6.5 8 6.5"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
  building: '<rect x="4" y="3.5" width="11" height="17" rx="1.5"/><path d="M15 9h4.5a.5.5 0 0 1 .5.5v11H15"/><path d="M7.5 7.5h4M7.5 11h4M7.5 14.5h4M9.5 20.5v-2.5"/>',
  tree: '<path d="M12 21v-6"/><path d="M12 3c3.5 0 6 2.7 6 6 0 3.2-2.7 6-6 6s-6-2.8-6-6c0-3.3 2.5-6 6-6z"/><path d="M12 15l-2.5-2.5M12 12.5l2.5-2.5"/>',
  wifi: '<path d="M2.5 9a13.5 13.5 0 0 1 19 0"/><path d="M5.5 12.3a9 9 0 0 1 13 0"/><path d="M8.6 15.5a4.6 4.6 0 0 1 6.8 0"/><circle cx="12" cy="19" r="1.3" fill="currentColor" stroke="none"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
  phone: '<path d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/>',
  facebook: '<path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H9v3h2.5V21"/>',
  linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V17M12 17v-3.6c0-1.6 1-2.6 2.2-2.6s2 .8 2 2.6V17M12 10.5V17"/><circle cx="8" cy="7.6" r="1" fill="currentColor" stroke="none"/>',
  whatsapp: '<path d="M4 20.5l1.3-4a8.5 8.5 0 1 1 3.2 3z"/><path d="M9 8.6c.3-.6.7-.6 1-.6h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .5-.1.6l-.6.7c.6 1.2 1.7 2.3 3 2.9l.7-.7c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5v.5c0 .4-.2.8-.6 1-.6.3-1.4.5-2.4.2-2.6-.8-4.6-2.8-5.4-5.2-.3-1-.2-1.9.1-2.7z"/>',
};
function icon(name, cls = 'ico') {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

function socialLinks(c, cls = 'social') {
  const s = c.contact.social;
  const items = [['instagram', 'Instagram'], ['facebook', 'Facebook'], ['linkedin', 'LinkedIn'], ['whatsapp', 'WhatsApp']];
  return `<div class="${cls}">${items.map(([k, label]) => `<a href="${s[k]}" target="_blank" rel="noopener" aria-label="${label}">${icon(k)}</a>`).join('')}</div>`;
}

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function navLinks(c, active, cls = '') {
  return c.nav.map(n => `<a href="${n.href}"${n.id === active ? ' aria-current="page"' : ''}${cls ? ` class="${cls}"` : ''}>${n.label}</a>`).join('');
}

const PAGE_TITLES = { index: 'Internet fibra óptica no interior', sobre: 'Sobre nós', servicos: 'Serviços', faq: 'Perguntas frequentes', contato: 'Contato', assine: 'Assine já' };

function shell({ c, page, fonts, css = 'assets/style.css', bodyClass = '', body, scripts = ['assets/main.js'], head = '' }) {
  const title = page === 'index' ? `Vyra · ${PAGE_TITLES.index}` : `${PAGE_TITLES[page]} · Vyra`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${esc(c.brand.description)}">
<meta name="theme-color" content="#160B2E">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}&display=swap">
<link rel="stylesheet" href="${css}">
${head}</head>
<body class="${bodyClass}" data-page="${page}">
${body}
${scripts.map(s => `<script src="${s}"></script>`).join('\n')}
</body>
</html>
`;
}

module.exports = { logo, icon, socialLinks, esc, navLinks, shell, PAGE_TITLES };
