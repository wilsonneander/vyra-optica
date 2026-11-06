// MODELO BÁSICO — simples, objetivo, sem animações (só troca de cor no hover).
const { logo, icon, duo, socialLinks, esc, navLinks, shell } = require('./helpers');

const FONTS = 'family=Outfit:wght@600;700;800&family=Manrope:wght@400;500;600;700';

const css = `/* Vyra · modelo Básico */
:root {
  --violet: #6C2BD9; --violet-700: #5420B0; --ink: #160B2E; --green: #18E28A;
  --lilac: #C9B6FF; --white: #FFFFFF; --mist: #F6F3FD; --line: #E6E0F5; --muted: #5E5577;
  --f-display: "Outfit", system-ui, sans-serif; --f-body: "Manrope", system-ui, sans-serif;
  --radius: 12px; --max: 1120px;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--white); color: var(--ink); font: 400 16px/1.6 var(--f-body); }
img, svg { max-width: 100%; }
a { color: var(--violet); }
h1, h2, h3 { font-family: var(--f-display); line-height: 1.15; margin: 0; text-wrap: balance; }
h1 { font-size: clamp(32px, 5vw, 52px); font-weight: 800; letter-spacing: -0.03em; }
h2 { font-size: clamp(26px, 3.4vw, 36px); font-weight: 700; letter-spacing: -0.02em; }
h3 { font-size: 19px; font-weight: 600; }
p { margin: 0; }
.container { max-width: var(--max); margin: 0 auto; padding-left: max(20px, env(safe-area-inset-left)); padding-right: max(20px, env(safe-area-inset-right)); }
.section { padding: 64px 0; }
.section.alt { background: var(--mist); }
.section-head { display: grid; gap: 10px; margin-bottom: 32px; max-width: 640px; }
.section-head p { color: var(--muted); }
.ico { width: 22px; height: 22px; flex: none; }
:focus-visible { outline: 2px solid var(--violet); outline-offset: 2px; }

/* Botões */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 22px; border-radius: 999px; font: 700 15px/1 var(--f-display); text-decoration: none; border: 2px solid transparent; cursor: pointer; transition: background-color .15s, color .15s, border-color .15s; }
.btn-primary { background: var(--violet); color: var(--white); }
.btn-primary:hover { background: var(--violet-700); }
.btn-outline { border-color: var(--violet); color: var(--violet); background: transparent; }
.btn-outline:hover { background: var(--violet); color: var(--white); }
.btn-green { background: var(--green); color: var(--ink); }
.btn-green:hover { background: #12c477; }
.btn-light { border-color: rgba(255,255,255,.5); color: var(--white); }
.btn-light:hover { background: var(--white); color: var(--ink); }

/* Topo */
.topbar { background: var(--ink); color: var(--white); position: sticky; top: 0; z-index: 20; }
.topbar .container { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 68px; }
.brand { color: var(--white); display: flex; }
.brand .logo { width: 92px; height: auto; display: block; }
.nav { display: flex; align-items: center; gap: 26px; }
.nav a { color: rgba(255,255,255,.82); text-decoration: none; font-weight: 600; font-size: 15px; }
.nav a:hover, .nav a[aria-current="page"] { color: var(--white); }
.nav a[aria-current="page"] { box-shadow: 0 2px 0 var(--green); }
.nav .btn { color: var(--ink); }
.menu-btn { display: none; background: none; border: 0; color: var(--white); padding: 8px; cursor: pointer; }
@media (max-width: 860px) {
  .menu-btn { display: inline-flex; }
  .nav { position: absolute; left: 0; right: 0; top: 100%; background: var(--ink); flex-direction: column; align-items: stretch; gap: 0; padding: 8px 20px 20px; display: none; }
  .nav.open { display: flex; }
  .nav a { padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,.1); }
  .nav a[aria-current="page"] { box-shadow: none; color: var(--green); }
  .nav .btn { margin-top: 14px; border-bottom: 0; }
}

/* Hero */
.hero { background: var(--mist); padding: 72px 0; }
.hero .container { display: grid; grid-template-columns: 1.2fr 1fr; gap: 48px; align-items: center; }
.hero p.lead { font-size: 18px; color: var(--muted); margin: 18px 0 28px; max-width: 52ch; }
.hero h1 span { color: var(--violet); }
.hero .actions { display: flex; flex-wrap: wrap; gap: 12px; }
.cep-card { background: var(--white); border: 1px solid var(--line); border-radius: 18px; padding: 28px; display: grid; gap: 14px; }
.cep-card h2 { font-size: 22px; }
.cep-card p { color: var(--muted); font-size: 14.5px; }
.cep-row { display: flex; gap: 8px; }
.cep-row input { flex: 1; min-width: 0; }
.cep-result { font-size: 14px; font-weight: 600; color: var(--violet); min-height: 1.4em; }
@media (max-width: 860px) { .hero .container { grid-template-columns: 1fr; } }

/* Grades e cards */
.grid { display: grid; gap: 18px; }
.grid-4 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.grid-3 { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
.grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.card { background: var(--white); border: 1px solid var(--line); border-radius: var(--radius); padding: 24px; display: grid; gap: 10px; align-content: start; }
.card .ico-box { width: 60px; height: 60px; border-radius: 18px; background: var(--ink); display: grid; place-items: center; margin-bottom: 8px; position: relative; overflow: hidden; box-shadow: 0 10px 22px -12px rgba(22,11,46,.55); }
.card .ico-box::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 85% 90%, rgba(108,43,217,.55), transparent 60%); }
.duo { width: 32px; height: 32px; position: relative; }
.duo .s { stroke: var(--lilac); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.duo .f { fill: #8A55F0; }
.duo .k { stroke: var(--ink); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.duo .a { fill: var(--green); }
.duo .ag { fill: var(--green); opacity: .22; }
.duo .as { stroke: var(--green); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.card p { color: var(--muted); font-size: 15px; }
.card ul { margin: 4px 0 0; padding: 0; list-style: none; display: grid; gap: 6px; font-size: 14.5px; }
.card li { display: flex; gap: 8px; align-items: center; }
.card li .ico { width: 18px; height: 18px; color: var(--violet); }

/* Planos */
.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
@media (max-width: 900px) { .plans { grid-template-columns: 1fr; max-width: 420px; } }
.plan { border: 1px solid var(--line); border-radius: 16px; padding: 28px; display: grid; gap: 14px; align-content: start; background: var(--white); position: relative; }
.plan.featured { border: 2px solid var(--violet); }
.plan .badge { position: absolute; top: -12px; left: 24px; background: var(--violet); color: var(--white); font: 700 12px/1 var(--f-display); padding: 6px 12px; border-radius: 999px; }
.plan .name { font: 700 14px/1 var(--f-display); text-transform: uppercase; letter-spacing: .08em; color: var(--violet); }
.plan .speed { font: 800 48px/1 var(--f-display); letter-spacing: -0.03em; }
.plan .speed small { font-size: 18px; font-weight: 600; margin-left: 4px; }
.plan .price { font: 700 22px/1 var(--f-display); }
.plan .price small { font: 500 14px var(--f-body); color: var(--muted); }
.plan p { color: var(--muted); font-size: 14.5px; }
.plan ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 8px; font-size: 14.5px; }
.plan li { display: flex; gap: 8px; align-items: center; }
.plan li .ico { width: 18px; height: 18px; color: #0B8A52; }
.plan .btn { width: 100%; margin-top: 6px; }
.note { font-size: 13px; color: var(--muted); margin-top: 16px; }

/* Passos */
.steps { counter-reset: s; }
.step { display: grid; gap: 8px; align-content: start; }
.step::before { counter-increment: s; content: counter(s); width: 40px; height: 40px; border-radius: 50%; background: var(--violet); color: var(--white); font: 700 18px/40px var(--f-display); text-align: center; }
.step p { color: var(--muted); font-size: 15px; }

/* Faixa CTA */
.cta-band { background: var(--violet); color: var(--white); padding: 48px 0; }
.cta-band .container { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px; }
.cta-band p { color: var(--lilac); margin-top: 6px; }

/* Cabeçalho de página interna */
.page-head { background: var(--mist); padding: 52px 0 44px; }
.page-head p { color: var(--muted); font-size: 18px; margin-top: 12px; max-width: 60ch; }
.crumbs { font-size: 13.5px; color: var(--muted); margin-bottom: 12px; }
.crumbs a { color: var(--muted); }

/* Sobre */
.prose { display: grid; gap: 16px; max-width: 68ch; font-size: 17px; }
.purpose { background: var(--ink); color: var(--white); border-radius: 16px; padding: 28px; font: 600 22px/1.35 var(--f-display); }
.purpose small { display: block; font: 600 12px/1 var(--f-body); letter-spacing: .1em; text-transform: uppercase; color: var(--green); margin-bottom: 12px; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { padding: 8px 14px; border-radius: 999px; background: var(--white); border: 1px solid var(--line); font-weight: 600; font-size: 14.5px; }
.chip.on { background: var(--ink); color: var(--white); border-color: var(--ink); }
.chip.on::before { content: ""; display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--green); margin-right: 8px; }

/* FAQ */
.faq { display: grid; gap: 10px; max-width: 820px; }
.faq details { border: 1px solid var(--line); border-radius: var(--radius); background: var(--white); }
.faq summary { padding: 18px 20px; font: 600 17px/1.4 var(--f-display); cursor: pointer; list-style: none; display: flex; justify-content: space-between; gap: 16px; }
.faq summary::-webkit-details-marker { display: none; }
.faq summary .ico { color: var(--violet); transition: transform .15s; }
.faq details[open] summary .ico { transform: rotate(45deg); }
.faq details p { padding: 0 20px 20px; color: var(--muted); }

/* Formulários */
.form { display: grid; gap: 16px; }
.form .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 600px) { .form .row { grid-template-columns: 1fr; } }
label { display: grid; gap: 6px; font-weight: 600; font-size: 14.5px; }
input, select, textarea { font: 400 16px var(--f-body); color: var(--ink); padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--white); width: 100%; }
input:focus, select:focus, textarea:focus { outline: 2px solid var(--violet); outline-offset: 0; border-color: var(--violet); }
textarea { min-height: 130px; resize: vertical; }
.form-ok { display: none; background: #E8FBF2; color: #0B6B41; border-radius: 10px; padding: 14px 16px; font-weight: 600; }
.form.sent .form-ok { display: block; }
fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 12px; }
legend { font: 700 18px var(--f-display); margin-bottom: 12px; }
.plan-pick { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 700px) { .plan-pick { grid-template-columns: 1fr; } }
.plan-pick label { border: 1.5px solid var(--line); border-radius: 12px; padding: 16px; cursor: pointer; font-weight: 500; display: grid; gap: 4px; }
.plan-pick input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.plan-pick b { font: 700 18px var(--f-display); }
.plan-pick span { color: var(--muted); font-size: 14px; }
.plan-pick label:has(input:checked) { border-color: var(--violet); background: var(--mist); box-shadow: inset 0 0 0 1px var(--violet); }
.plan-pick label:has(input:focus-visible) { outline: 2px solid var(--violet); outline-offset: 2px; }
.contact-layout { display: grid; grid-template-columns: 1.4fr 1fr; gap: 32px; align-items: start; }
@media (max-width: 860px) { .contact-layout { grid-template-columns: 1fr; } }
.info-card { background: var(--mist); border-radius: 16px; padding: 26px; display: grid; gap: 18px; }
.info-item { display: flex; gap: 12px; align-items: flex-start; }
.info-item .ico { color: var(--violet); margin-top: 2px; }
.info-item b { display: block; font-family: var(--f-display); }
.info-item span { color: var(--muted); font-size: 15px; }

/* Redes sociais */
.social { display: flex; gap: 10px; flex-wrap: wrap; }
.social a { width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; background: var(--violet); color: var(--white); transition: background-color .15s; }
.social a:hover { background: var(--violet-700); }
.footer .social a { background: rgba(255,255,255,.1); }
.footer .social a:hover { background: var(--green); color: var(--ink); }

/* Rodapé */
.footer { background: var(--ink); color: rgba(255,255,255,.75); padding: 56px 0 28px; font-size: 15px; }
.footer .cols { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 32px; }
@media (max-width: 760px) { .footer .cols { grid-template-columns: 1fr; } }
.footer .logo { width: 110px; color: var(--white); display: block; margin-bottom: 14px; }
.footer h3 { color: var(--white); font-size: 15px; margin-bottom: 12px; }
.footer a { color: rgba(255,255,255,.75); text-decoration: none; }
.footer a:hover { color: var(--white); }
.footer ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.footer .bottom { border-top: 1px solid rgba(255,255,255,.12); margin-top: 40px; padding-top: 20px; font-size: 13px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px; }

/* WhatsApp flutuante */
.wa-float { position: fixed; right: max(18px, env(safe-area-inset-right)); bottom: max(18px, env(safe-area-inset-bottom)); width: 56px; height: 56px; border-radius: 50%; background: var(--green); color: var(--ink); display: grid; place-items: center; box-shadow: 0 6px 20px rgba(22,11,46,.25); z-index: 30; }
.wa-float .ico { width: 28px; height: 28px; }
`;

const js = `// Vyra · modelo Básico
(function () {
  var btn = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
  if (btn && nav) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  // Formulários: mostra a confirmação. Integre aqui com seu backend, e-mail ou WhatsApp.
  document.querySelectorAll('form.form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      f.classList.add('sent');
      var ok = f.querySelector('.form-ok'); if (ok) ok.focus();
      f.querySelectorAll('input:not([type=radio]), textarea').forEach(function (i) { i.value = ''; });
    });
  });

  // Máscara simples de CEP e telefone
  document.querySelectorAll('input[data-mask=cep]').forEach(function (i) {
    i.addEventListener('input', function () { var v = i.value.replace(/\\D/g, '').slice(0, 8); i.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; });
  });
  document.querySelectorAll('input[data-mask=tel]').forEach(function (i) {
    i.addEventListener('input', function () { var v = i.value.replace(/\\D/g, '').slice(0, 11);
      i.value = v.length > 6 ? '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4) : v.length > 2 ? '(' + v.slice(0, 2) + ') ' + v.slice(2) : v; });
  });

  // Consulta de cobertura (exemplo): leva para Assine já com o CEP preenchido
  var cep = document.getElementById('cep-form');
  if (cep) cep.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = cep.querySelector('input').value.replace(/\\D/g, '');
    var out = cep.querySelector('.cep-result');
    if (v.length !== 8) { out.textContent = 'Digite os 8 números do CEP.'; return; }
    out.textContent = 'Boa notícia: temos fibra na sua região. Vamos para a assinatura...';
    setTimeout(function () { location.href = 'assine.html#cep-' + v; }, 900);
  });

  // Assine já: pré-seleciona o plano (#essencial, #conecta, #ultra) e o CEP (#cep-00000000)
  var h = location.hash.slice(1);
  if (h) {
    var radio = document.querySelector('input[name=plano][value="' + h + '"]');
    if (radio) radio.checked = true;
    var m = h.match(/^cep-(\\d{8})$/), ci = document.getElementById('a-cep');
    if (m && ci) ci.value = m[1].slice(0, 5) + '-' + m[1].slice(5);
  }
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
`;

// ---------- partes ----------
function header(c, page) {
  return `<header class="topbar">
  <div class="container">
    <a class="brand" href="index.html" aria-label="Vyra, página inicial">${logo()}</a>
    <button class="menu-btn" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav">${icon('menu')}</button>
    <nav class="nav" id="nav" aria-label="Principal">
      ${navLinks(c, page)}
      <a class="btn btn-green" href="${c.cta.href}"${page === 'assine' ? ' aria-current="page"' : ''}>${c.cta.label}</a>
    </nav>
  </div>
</header>`;
}

function footer(c) {
  return `<footer class="footer">
  <div class="container">
    <div class="cols">
      <div>${logo()}<p>${esc(c.brand.support)}</p><div style="margin-top:18px">${socialLinks(c)}</div></div>
      <div><h3>Navegação</h3><ul>${c.nav.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}<li><a href="${c.cta.href}">${c.cta.label}</a></li></ul></div>
      <div><h3>Fale com a gente</h3><ul>
        <li>WhatsApp: ${c.contact.whatsapp}</li><li>Telefone: ${c.contact.phone}</li><li>${c.contact.email}</li><li>${c.contact.address}<br>${c.contact.city}</li></ul></div>
    </div>
    <div class="bottom"><span>© <span id="year">2026</span> Vyra Fibra. Todos os direitos reservados.</span><span>CNPJ 00.000.000/0001-00</span></div>
  </div>
</footer>
<a class="wa-float" href="${c.contact.whatsappLink}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${icon('whatsapp')}</a>`;
}

function pageHead(title, lead, crumb) {
  return `<section class="page-head"><div class="container">
  <div class="crumbs"><a href="index.html">Início</a> / ${crumb}</div>
  <h1>${title}</h1><p>${lead}</p></div></section>`;
}

function plansGrid(c) {
  return `<div class="plans">${c.plans.map(p => `
    <article class="plan${p.featured ? ' featured' : ''}">
      ${p.featured ? '<span class="badge">Mais escolhido</span>' : ''}
      <span class="name">${p.name}</span>
      <div class="speed">${p.speed}<small>${p.unit}</small></div>
      <div class="price">R$ ${p.price}<small> /mês</small></div>
      <p>${p.tagline}</p>
      <ul>${p.features.map(f => `<li>${icon('check')}${f}</li>`).join('')}</ul>
      <a class="btn ${p.featured ? 'btn-primary' : 'btn-outline'}" href="assine.html#${p.id}">Assinar ${p.name}</a>
    </article>`).join('')}
  </div>
  <p class="note">Valores de exemplo. Consulte a disponibilidade para o seu endereço.</p>`;
}

function ctaBand(c) {
  return `<section class="cta-band"><div class="container">
  <div><h2>Pronto para uma internet que não cai?</h2><p>${esc(c.brand.support)}</p></div>
  <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-green" href="assine.html">Assine já</a><a class="btn btn-light" href="contato.html">Falar com a gente</a></div>
</div></section>`;
}

// ---------- páginas ----------
const pages = {
  index: c => `${header(c, 'index')}
<main>
  <section class="hero"><div class="container">
    <div>
      <h1>Internet fibra óptica <span>de verdade</span> no interior.</h1>
      <p class="lead">${c.brand.slogan} Planos de 300 Mega a 1 Giga, com instalação agendada e suporte técnico da sua região.</p>
      <div class="actions"><a class="btn btn-primary" href="assine.html">Assine já</a><a class="btn btn-outline" href="servicos.html">Ver planos</a></div>
    </div>
    <form class="cep-card" id="cep-form" novalidate>
      <h2>A Vyra chega na sua rua?</h2>
      <p>Digite seu CEP e confira a cobertura.</p>
      <label for="cep-home">CEP<div class="cep-row"><input id="cep-home" inputmode="numeric" placeholder="00000-000" data-mask="cep" required><button class="btn btn-primary" type="submit">Consultar</button></div></label>
      <div class="cep-result" role="status" aria-live="polite"></div>
    </form>
  </div></section>

  <section class="section"><div class="container">
    <div class="section-head"><h2>Por que escolher a Vyra</h2><p>Uma rede pensada para o interior, com o atendimento que você merece.</p></div>
    <div class="grid grid-4">${c.benefits.map(b => `<div class="card"><div class="ico-box">${duo(b.icon)}</div><h3>${b.title}</h3><p>${b.text}</p></div>`).join('')}</div>
  </div></section>

  <section class="section alt"><div class="container">
    <div class="section-head"><h2>Planos para a sua casa</h2><p>Todos com Wi-Fi incluso e instalação agendada.</p></div>
    ${plansGrid(c)}
  </div></section>

  <section class="section"><div class="container">
    <div class="section-head"><h2>Como contratar</h2></div>
    <div class="grid grid-3 steps">${c.steps.map(s => `<div class="step"><h3>${s.title}</h3><p>${s.text}</p></div>`).join('')}</div>
  </div></section>
  ${ctaBand(c)}
</main>
${footer(c)}`,

  sobre: c => `${header(c, 'sobre')}
<main>
  ${pageHead('Sobre a Vyra', c.about.intro, 'Sobre nós')}
  <section class="section"><div class="container grid grid-2" style="align-items:start;gap:40px">
    <div class="prose">${c.about.story.map(p => `<p>${p}</p>`).join('')}</div>
    <div class="purpose"><small>Nosso propósito</small>${c.about.purpose}</div>
  </div></section>
  <section class="section alt"><div class="container">
    <div class="section-head"><h2>O que nos guia</h2></div>
    <div class="grid grid-3">${c.about.values.map(v => `<div class="card"><h3>${v.title}</h3><p>${v.text}</p></div>`).join('')}</div>
  </div></section>
  <section class="section"><div class="container">
    <div class="section-head"><h2>Onde estamos</h2><p>Atendemos hoje e já estamos levando fibra para novas cidades.</p></div>
    <div class="chips">${c.cities.now.map(x => `<span class="chip on">${x}</span>`).join('')}${c.cities.soon.map(x => `<span class="chip">${x} · em breve</span>`).join('')}</div>
  </div></section>
  ${ctaBand(c)}
</main>
${footer(c)}`,

  servicos: c => `${header(c, 'servicos')}
<main>
  ${pageHead('Serviços', 'Internet fibra óptica para casa, empresa e área rural, com suporte de quem está perto.', 'Serviços')}
  <section class="section"><div class="container">
    <div class="grid grid-3">${c.services.map(s => `<div class="card" id="${s.id}"><div class="ico-box">${duo(s.icon)}</div><h3>${s.title}</h3><p>${s.text}</p><ul>${s.items.map(i => `<li>${icon('check')}${i}</li>`).join('')}</ul></div>`).join('')}</div>
    <p class="note">* Sujeito à disponibilidade da equipe técnica na região.</p>
  </div></section>
  <section class="section alt"><div class="container">
    <div class="section-head"><h2>Planos residenciais</h2></div>
    ${plansGrid(c)}
  </div></section>
  <section class="section"><div class="container">
    <div class="section-head"><h2>Vyra Empresas</h2><p>Para negócios que não podem ficar offline.</p></div>
    <div class="grid grid-4">${c.business.map(b => `<div class="card"><h3>${b.title}</h3><p>${b.text}</p></div>`).join('')}</div>
    <div style="margin-top:24px"><a class="btn btn-primary" href="contato.html">Pedir proposta</a></div>
  </div></section>
  ${ctaBand(c)}
</main>
${footer(c)}`,

  faq: c => `${header(c, 'faq')}
<main>
  ${pageHead('Perguntas frequentes', 'Respostas rápidas sobre instalação, planos e suporte.', 'FAQ')}
  <section class="section"><div class="container">
    <div class="faq">${c.faq.map(f => `<details><summary>${f.q}${icon('plus')}</summary><p>${f.a}</p></details>`).join('')}</div>
    <div class="card" style="margin-top:32px;max-width:820px"><h3>Não achou sua resposta?</h3><p>Fale com a gente pelo WhatsApp ${c.contact.whatsapp} ou envie uma mensagem.</p><div><a class="btn btn-primary" href="contato.html">Ir para contato</a></div></div>
  </div></section>
</main>
${footer(c)}`,

  contato: c => `${header(c, 'contato')}
<main>
  ${pageHead('Contato', 'Tire dúvidas, peça uma proposta para sua empresa ou fale com o suporte.', 'Contato')}
  <section class="section"><div class="container contact-layout">
    <form class="form" novalidate>
      <div class="row">
        <label for="c-nome">Nome<input id="c-nome" name="nome" autocomplete="name" required></label>
        <label for="c-tel">Telefone / WhatsApp<input id="c-tel" name="telefone" inputmode="tel" data-mask="tel" autocomplete="tel" required></label>
      </div>
      <label for="c-email">E-mail<input id="c-email" type="email" name="email" autocomplete="email" required></label>
      <label for="c-assunto">Assunto<select id="c-assunto" name="assunto"><option>Quero contratar</option><option>Proposta para empresa</option><option>Suporte técnico</option><option>Financeiro</option><option>Outro</option></select></label>
      <label for="c-msg">Mensagem<textarea id="c-msg" name="mensagem" required></textarea></label>
      <div><button class="btn btn-primary" type="submit">Enviar mensagem</button></div>
      <div class="form-ok" tabindex="-1" role="status">Mensagem enviada. Respondemos em breve.</div>
    </form>
    <aside class="info-card">
      <div class="info-item">${icon('whatsapp')}<div><b>WhatsApp</b><span>${c.contact.whatsapp}</span></div></div>
      <div class="info-item">${icon('phone')}<div><b>Telefone</b><span>${c.contact.phone}</span></div></div>
      <div class="info-item">${icon('mail')}<div><b>E-mail</b><span>${c.contact.email}</span></div></div>
      <div class="info-item">${icon('pin')}<div><b>Endereço</b><span>${c.contact.address}<br>${c.contact.city}</span></div></div>
      ${c.contact.hours.map(h => `<div class="info-item">${icon('clock')}<div><b>${h[0]}</b><span>${h[1]}</span></div></div>`).join('')}
      <div><b style="font-family:var(--f-display);display:block;margin-bottom:10px">Redes sociais</b>${socialLinks(c)}</div>
    </aside>
  </div></section>
</main>
${footer(c)}`,

  assine: c => `${header(c, 'assine')}
<main>
  ${pageHead('Assine já', 'Preencha os dados abaixo. Nossa equipe confirma a cobertura e agenda a instalação com você.', 'Assine já')}
  <section class="section"><div class="container" style="max-width:860px">
    <form class="form" novalidate>
      <fieldset><legend>1. Escolha o plano</legend>
        <div class="plan-pick">${c.plans.map(p => `<label><input type="radio" name="plano" value="${p.id}"${p.featured ? ' checked' : ''} required><b>${p.name} · ${p.speed} ${p.unit}</b><span>R$ ${p.price}/mês</span></label>`).join('')}</div>
      </fieldset>
      <fieldset><legend>2. Seus dados</legend>
        <div class="row"><label for="a-nome">Nome completo<input id="a-nome" autocomplete="name" required></label>
        <label for="a-cpf">CPF<input id="a-cpf" inputmode="numeric" required></label></div>
        <div class="row"><label for="a-tel">WhatsApp<input id="a-tel" inputmode="tel" data-mask="tel" autocomplete="tel" required></label>
        <label for="a-email">E-mail<input id="a-email" type="email" autocomplete="email" required></label></div>
      </fieldset>
      <fieldset><legend>3. Endereço de instalação</legend>
        <div class="row"><label for="a-cep">CEP<input id="a-cep" inputmode="numeric" data-mask="cep" placeholder="00000-000" required></label>
        <label for="a-num">Número<input id="a-num" required></label></div>
        <label for="a-rua">Rua<input id="a-rua" autocomplete="address-line1" required></label>
        <div class="row"><label for="a-bairro">Bairro<input id="a-bairro" required></label>
        <label for="a-periodo">Melhor período para instalação<select id="a-periodo"><option>Manhã</option><option>Tarde</option><option>Sábado</option></select></label></div>
      </fieldset>
      <div><button class="btn btn-primary" type="submit">Enviar pedido de assinatura</button></div>
      <div class="form-ok" tabindex="-1" role="status">Pedido recebido. Vamos confirmar a cobertura e falar com você pelo WhatsApp.</div>
    </form>
  </div></section>
</main>
${footer(c)}`,
};

function build(c) {
  const out = {};
  for (const [id, fn] of Object.entries(pages)) out[id + '.html'] = shell({ c, page: id, fonts: FONTS, body: fn(c) });
  return { pages: out, css, js };
}
module.exports = { build };
