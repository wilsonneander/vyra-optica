// Peças compartilhadas pelos três modelos de site.
const LOGO_PATH = 'M35.20 0L19.80 0L-0.10-48.90L18.50-48.90L27.60-19.30L36.70-48.90L55.10-48.90L35.20 0ZM84.60 20.70L67.10 20.70L77.70-2.50L59.10-48.90L77.70-48.90L86.10-20.80L94.50-48.90L113.10-48.90L93 0.10L84.60 20.70ZM132.40 0L115 0L115-48.90L132.40-48.90L132.40-45.80Q137.20-49.90 144.80-49.90L144.80-49.90Q148.30-49.90 150.85-49Q153.40-48.10 155.20-46.20L155.20-46.20L145.10-32.70Q144.30-33.60 142.85-34.15Q141.40-34.70 139.60-34.70L139.60-34.70Q136.20-34.70 134.30-32.65Q132.40-30.60 132.40-26.60L132.40-26.60L132.40 0ZM175.70 1L175.70 1Q168.90 1 163.60-2.30Q158.30-5.60 155.30-11.35Q152.30-17.10 152.30-24.40L152.30-24.40Q152.30-31.80 155.30-37.60Q158.30-43.40 163.60-46.65Q168.90-49.90 175.70-49.90L175.70-49.90Q180.30-49.90 184.10-48.30L184.10-48.30Q186.50-47.20 188.30-45.70L188.30-45.70L188.30-48.90L205.40-48.90L205.40 0L188.30 0L188.30-3.30Q186.50-1.800 184.10-0.70L184.10-0.70Q180.30 1 175.70 1ZM179.40-14.50L179.40-14.50Q183.70-14.50 186.35-17.30Q189.00-20.10 189.00-24.50L189.00-24.50Q189.00-27.40 187.80-29.60Q186.60-31.80 184.45-33.10Q182.30-34.40 179.50-34.40Q176.70-34.40 174.55-33.10Q172.40-31.80 171.15-29.55Q169.90-27.30 169.90-24.50L169.90-24.50Q169.90-21.60 171.10-19.35Q172.30-17.10 174.50-15.80Q176.70-14.50 179.40-14.50Z';

// Logo vetorial: a cor do texto vem de `color` (currentColor); o ponto é sempre vermelho, salvo `dot`.
function logo(cls = 'logo', dot = '#E11D2E') {
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
  if (SOCIAL_SOLID[name]) return socialIcon(name, cls); // redes sociais sempre com o glifo oficial
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

// Ícones duotone da marca (grade 32px): .s traço lilás, .f preenchimento violeta, .k detalhe escuro, .a/.as verde (luz/sinal).
const DUO = {
  fiber: '<path class="s" d="M4 9c8 0 12 7 19 7M4 16h19M4 23c8 0 12-7 19-7"/><circle class="ag" cx="26" cy="16" r="5.5"/><circle class="a" cx="26" cy="16" r="2.8"/>',
  headset: '<path class="s" d="M7 18v-3a9 9 0 0 1 18 0v3"/><rect class="f" x="4.5" y="16.5" width="5.5" height="9" rx="2.75"/><rect class="f" x="22" y="16.5" width="5.5" height="9" rx="2.75"/><path class="s" d="M24.75 25.5c0 2.2-2.6 3-6.5 3"/><circle class="a" cx="16.6" cy="28.5" r="2.2"/>',
  calendar: '<path class="f" d="M5 11a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v2.5H5z"/><rect class="s" x="5" y="7" width="22" height="21" rx="4"/><path class="s" d="M11 4v5M21 4v5"/><path class="as" d="M11.5 20l3.2 3.2 6-6.4"/>',
  shield: '<path class="s" d="M8 4h11l6.5 6.5V26a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path class="f" d="M19 4v6.5h6.5z"/><path class="s" d="M10.5 14.5h8M10.5 19h5"/><circle class="a" cx="22.5" cy="23.5" r="5.5"/><path class="k" d="M20.2 23.6l1.6 1.6 3-3.2"/>',
  home: '<path class="f" d="M8 14.5V27h16V14.5L16 8z"/><path class="s" d="M4.5 15.5L16 6l11.5 9.5"/><rect class="a" x="13.5" y="19.5" width="5" height="7.5" rx="1.2"/>',
  building: '<rect class="f" x="5.5" y="4.5" width="13.5" height="23" rx="2"/><path class="s" d="M19 12h5a2 2 0 0 1 2 2v13.5h-7"/><path class="k" d="M9.5 10h5.5M9.5 14.5h5.5M9.5 19h5.5"/><circle class="a" cx="22.5" cy="18" r="1.9"/><path class="s" d="M3.5 27.5h25"/>',
  tree: '<circle class="f" cx="15" cy="13" r="8.5"/><path class="k" d="M15 20v-5.5l3-3M15 16.5l-3-3"/><path class="s" d="M15 21.5v6M7 27.5h16"/><path class="as" d="M24.5 5.5a6 6 0 0 1 3 3"/><circle class="a" cx="24" cy="9" r="1.8"/>',
  wifi: '<path class="s" d="M3.5 13a17.5 17.5 0 0 1 25 0M7.8 17.6a11.5 11.5 0 0 1 16.4 0"/><path class="as" d="M12 22.2a5.6 5.6 0 0 1 8 0"/><circle class="ag" cx="16" cy="26.5" r="4.5"/><circle class="a" cx="16" cy="26.5" r="2.2"/>',
};
function duo(name, cls = 'duo') {
  return `<svg class="${cls}" viewBox="0 0 32 32" fill="none" aria-hidden="true">${DUO[name] || DUO.fiber}</svg>`;
}

// Glifos das redes sociais: Bootstrap Icons v1.11.3 (licença MIT), grade 16px.
const SOCIAL_SOLID = {
  instagram: '<path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>',
  facebook: '<path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>',
  linkedin: '<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>',
  whatsapp: '<path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>',
};

function socialLinks(c, cls = 'social') {
  const s = c.contact.social;
  const items = [['instagram', 'Instagram'], ['facebook', 'Facebook'], ['linkedin', 'LinkedIn'], ['whatsapp', 'WhatsApp']];
  return `<div class="${cls}">${items.map(([k, label]) => `<a href="${s[k]}" target="_blank" rel="noopener" aria-label="${label}">${socialIcon(k)}</a>`).join('')}</div>`;
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
<meta name="theme-color" content="#FF5A1F">
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

// Ícones da marca sobre bloco em gradiente laranja→vermelho: traço branco, preenchimento claro translúcido.
const DUO_CSS = `
.duo { width: 32px; height: 32px; position: relative; z-index: 1; }
.duo .s { stroke: #FFFFFF; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.duo .f { fill: rgba(255,255,255,.4); }
.duo .k { stroke: #B0300A; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.duo .a { fill: #FFFFFF; }
.duo .ag { fill: #FFFFFF; opacity: .3; }
.duo .as { stroke: #FFFFFF; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.ico-grad { background: linear-gradient(145deg, #FF7A3D 0%, #FF5A1F 40%, #E11D2E 100%); }
`;

function socialIcon(k, cls = 'ico') {
  return `<svg class="${cls}" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">${SOCIAL_SOLID[k]}</svg>`;
}

module.exports = { DUO_CSS, logo, icon, duo, socialIcon, socialLinks, esc, navLinks, shell, PAGE_TITLES };
