// Gera o Silver de odontologia (Raiz Odontologia) em "templates/clinicas/standard/raiz-standard/", no desenho da referência Aveline:
// hero emoldurado com carrossel de fotos e profissional da vez, jornada, frase que se escreve na rolagem, números,
// tratamentos em trilho, painel de cuidado (agendamento, alinhadores, orçamento), equipe, antes e depois arrastável,
// estrutura com galeria, avaliações, artigos, dúvidas, formulário, rodapé com mapa OSM e página 404.
// Uso: node templates/clinicas/_build-raiz-standard/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');

const OUT = path.join(__dirname, '..', 'standard', 'raiz-standard');
const FOTOS = path.join(__dirname, 'img', 'fotos');
const M = C.marca;

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const endereco = `${M.rua}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${M.rua}, ${M.bairro}, ${M.cidade}`)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
const eq = Object.fromEntries(C.equipe.map((p) => [p.id, p]));

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
for (const f of fs.readdirSync(FOTOS)) fs.copyFileSync(path.join(FOTOS, f), path.join(OUT, 'assets', 'img', f));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_batel.webp'), path.join(OUT, 'assets', 'img', 'mapa_batel.webp'));
fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(OUT, 'assets', 'site.css'));
fs.copyFileSync(path.join(__dirname, 'app.js'), path.join(OUT, 'assets', 'site.js'));
const creditos = JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'creditos.json'), 'utf8'));

const faltando = [];
const foto = (nome, { cls = '', lazy = true, alt, pos } = {}) => {
  if (!fs.existsSync(path.join(FOTOS, `${nome}.webp`))) faltando.push(nome);
  return `<img${cls ? ` class="${cls}"` : ''} src="assets/img/${nome}.webp" alt="${esc(alt ?? C.fotos[nome] ?? '')}"${pos ? ` style="object-position:${pos}"` : ''}${lazy ? ' loading="lazy"' : ''} decoding="async">`;
};

// ---------- desenhos próprios: traço de 1,6 com pontas redondas, como o dente com broto da marca ----------
const dente = (cls = 'logo-dente') => `<svg class="${cls}" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 11.2c-3-2.6-8.8-2.8-10.4 2-1.4 4.2.8 7.6 1.7 11.4.8 3.4 1.2 8 3.3 8 2 0 2.1-5.2 5.4-5.8 3.3.6 3.4 5.8 5.4 5.8 2.1 0 2.5-4.6 3.3-8 .9-3.8 3.1-7.2 1.7-11.4-1.6-4.8-7.4-4.6-10.4-2Z"/><path class="broto" d="M20 11.2c.2-3.4 2.4-5.8 5.8-6.2-.2 3.2-2.6 5.6-5.8 6.2Z"/><path d="M14.6 32.4c-.5 1.9-1.9 2.9-3.6 2.8M25.4 32.4c.5 1.9 1.9 2.9 3.6 2.8"/></svg>`;
const logo = `<span class="logo-marca">${dente()}<span class="logo-txt"><b>${M.nome}</b><small>${M.sub}</small></span></span>`;
const S = (d, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I = {
  seta: S('<path d="M5 12h13.5M13.5 6.5 19 12l-5.5 5.5"/>'),
  diag: S('<path d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15"/>'),
  esq: S('<path d="M14.5 6 8.5 12l6 6"/>'),
  dir: S('<path d="M9.5 6l6 6-6 6"/>'),
  mais: S('<path d="M12 6v12M6 12h12"/>', 'ic ic-mais'),
  fechar: S('<path d="M7 7l10 10M17 7 7 17"/>'),
  menu: S('<path d="M4 8h16M4 16h10"/>'),
  fone: S('<path d="M7.2 3.8 9.6 4.4l1.1 4-1.9 1.5a11 11 0 0 0 5.3 5.3l1.5-1.9 4 1.1.6 2.4c-.6 1.8-2.2 2.9-4 2.6A14.6 14.6 0 0 1 4.6 7.8c-.3-1.8.8-3.4 2.6-4Z"/>'),
  // balão de conversa com sorriso (WhatsApp desenhado na marca)
  conversa: S('<path d="M4.5 19 5.6 15.2A8 8 0 1 1 9 18.6Z"/><path d="M8.8 11.6c1.6 2 4.8 2 6.4 0"/>'),
  pino: S('<path d="M12 21.5s-6.5-6.2-6.5-11.3a6.5 6.5 0 0 1 13 0c0 5.1-6.5 11.3-6.5 11.3Z"/><path d="M9.6 10.2c.8 1.1 4 1.1 4.8 0"/>'),
  relogio: S('<path d="M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Z"/><path d="M12 8v4.2l2.6 1.6"/>', 'ic ic-relogio'),
  estrela: '<svg class="ic-estrela" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 14.6 9l6.2.6-4.7 4.1 1.4 6.1L12 16.6l-5.5 3.2 1.4-6.1-4.7-4.1L9.4 9Z"/></svg>',
  email: S('<path d="M4 6.5h16v11H4Z"/><path d="m4.5 7 7.5 6 7.5-6"/>'),
  insta: S('<rect x="4.5" y="4.5" width="15" height="15" rx="4.5"/><path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM16.4 7.6h.01"/>'),
  face: S('<path d="M13.5 20v-7h2.6l.4-3h-3V8.4c0-.9.3-1.4 1.5-1.4h1.6V4.3c-.4-.1-1.3-.2-2.3-.2-2.3 0-3.8 1.4-3.8 3.9V10H8v3h2.5v7"/>'),
  // jornada
  escaner: S('<path d="M12 8.2c-2-2-5.6-1.7-6.4 1.5-.7 3 1 5.5 1.5 8.6.4 2.1.9 3.7 1.9 3.7 1.3 0 1.4-3.4 3-4.1 1.6.7 1.7 4.1 3 4.1 1 0 1.5-1.6 1.9-3.7.5-3.1 2.2-5.6 1.5-8.6-.8-3.2-4.4-3.5-6.4-1.5Z"/><path d="M2.8 13.2h18.4"/><path d="M3 5V3h2.5M21 5V3h-2.5"/>'),
  plano: S('<path d="M6 3.5h8.5l3.5 3.5v13.5H6Z"/><path d="M14.5 3.5V7H18M9 11h6M9 14h6"/><path d="M9 18c.9-1.4 1.8-1.4 2.6 0s1.7 1.4 2.7-.3"/>'),
  cadeira: S('<path d="M7 4.5c1.6 0 2.6 1 2.8 2.6l.9 6.4h6.8a2 2 0 0 1 0 4H9.6a2 2 0 0 1-2-1.7L6 6.7C5.8 5.4 6.2 4.5 7 4.5Z"/><path d="M12.5 17.5V21M9 21h7M17.5 8.5l2.5-2M15 9.5h3"/>'),
  calendario: S('<path d="M4.5 6h15v13.5h-15Z"/><path d="M4.5 10h15M8.5 3.5V7M15.5 3.5V7"/><path d="M9.6 14.6c.6.8 2 1.3 2.6 2.2.6-1.6 1.6-3 3-4"/>'),
  // estrutura
  raio: S('<path d="M5 4.5h14v15H5Z"/><path d="M12 7.6c-1.5-1.4-4-1.2-4.6 1-.5 2.2.7 3.9 1.1 6.1.3 1.4.6 2.4 1.3 2.4.9 0 1-2.4 2.2-2.9 1.2.5 1.3 2.9 2.2 2.9.7 0 1-1 1.3-2.4.4-2.2 1.6-3.9 1.1-6.1-.6-2.2-3.1-2.4-4.6-1Z"/>'),
  coroa: S('<path d="M5 9.5 8 13l4-6 4 6 3-3.5-1.4 8H6.4Z"/><path d="M7 20h10"/>'),
  fonesOuvido: S('<path d="M4.5 15v-2.5a7.5 7.5 0 0 1 15 0V15"/><path d="M4.5 14.5h3v5.5h-1.5a1.5 1.5 0 0 1-1.5-1.5ZM19.5 14.5h-3v5.5h1.5a1.5 1.5 0 0 0 1.5-1.5Z"/>'),
  // tema: dente que brilha (claro) e lua (escuro)
  tema: `<svg class="tema-svg" viewBox="0 0 40 40" aria-hidden="true">
      <g class="tema-raios"><path d="M20 3.5v3M31.7 8.3l-2.1 2.1M36.5 20h-3M8.3 8.3l2.1 2.1M3.5 20h3"/></g>
      <path class="tema-lua" d="M30.5 9.2a6 6 0 1 0 5.3 8.6 4.8 4.8 0 1 1-5.3-8.6Z"/>
      <path class="tema-dente" d="M20 13.6c-2.3-2-6.7-2.1-7.9 1.5-1 3.2.6 5.8 1.3 8.7.6 2.6.9 6 2.5 6 1.5 0 1.6-3.9 4.1-4.4 2.5.5 2.6 4.4 4.1 4.4 1.6 0 1.9-3.4 2.5-6 .7-2.9 2.3-5.5 1.3-8.7-1.2-3.6-5.6-3.5-7.9-1.5Z"/>
      <path class="tema-brilho" d="M15.4 17.6c.4-1.4 1.6-2 2.8-1.8"/>
    </svg>`,
};
const jornadaIc = { escaner: I.escaner, plano: I.plano, cadeira: I.cadeira, calendario: I.calendario };
const clinicaIc = { raio: I.raio, coroa: I.coroa, fone: I.fonesOuvido };

// arcada desenhada (cartão "A cada 6 meses"): dentes vistos de baixo ao longo de um U, com a placa transparente por cima
const arcada = (() => {
  const dentes = [];
  const N = 14;
  for (let i = 0; i < N; i++) {
    const t = (i / (N - 1)) * 2 - 1; // -1..1
    const a = t * 1.42;
    const x = 160 + 128 * Math.sin(a);
    const y = 40 + 190 * (1 - Math.cos(a)) * 0.92;
    const k = Math.abs(t);
    const w = 20 + k * 16; const h = 24 + k * 8;
    const ang = (a * 180) / Math.PI;
    dentes.push(`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(-ang).toFixed(1)})"><rect x="${(-w / 2).toFixed(1)}" y="${(-h / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(w * 0.42).toFixed(1)}"/>${k > 0.45 ? `<path d="M${(-w / 4).toFixed(1)} 0h${(w / 2).toFixed(1)}"/>` : ''}</g>`);
  }
  return `<svg class="arcada" viewBox="0 0 320 340" aria-hidden="true"><g class="arcada-dentes">${dentes.join('')}</g><g class="arcada-placa">${dentes.join('')}</g></svg>`;
})();

// ---------- tema cedo (antes de pintar) ----------
const temaCedo = `<script>(function(){var r=document.documentElement;r.classList.add('js');var t=null;try{t=localStorage.getItem('raiz-tema')}catch(e){}if(!t&&matchMedia('(prefers-color-scheme: dark)').matches)t='escuro';if(t==='escuro')r.dataset.tema='escuro';})();</script>`;
const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Geologica:wght@300..600&family=Mona+Sans:wght@400..600&family=Azeret+Mono:wght@400;500&display=swap" rel="stylesheet">';
const botaoTema = `<button type="button" class="tema" data-botao-tema aria-pressed="false" aria-label="Mudar para o tema escuro">${I.tema}</button>`;

// ---------- topo ----------
const nav = [['tratamentos', 'Tratamentos'], ['equipe', 'Equipe'], ['clinica', 'A clínica'], ['resultados', 'Resultados'], ['faq', 'Dúvidas'], ['contato', 'Contato']];
// no computador, "Tratamentos" fica no centro exato do topo
const navEsq = [['equipe', 'Equipe'], ['clinica', 'A clínica'], ['resultados', 'Resultados']];
const navDir = [['faq', 'Dúvidas'], ['contato', 'Contato']];
// submenu "Tratamentos": abre no hover, no foco e no clique; cada item abre a ficha do tratamento
const subTrat = `<li class="tem-sub" data-sub><button type="button" class="sub-btn" data-alvo="#tratamentos" aria-expanded="false" aria-controls="sub-trat">Tratamentos${S('<path d="M7 10l5 5 5-5"/>', 'ic ic-desce')}</button>
      <div class="sub" id="sub-trat"><div class="sub-in">
        <ul class="sub-lista">${C.tratamentos.map((t) => `<li><a href="#tratamentos" data-abre-trat="${t.id}"><img src="assets/img/${t.foto}.webp" alt="" loading="lazy"><span><b>${t.nome}</b><small>${t.tempo}</small></span>${I.diag}</a></li>`).join('')}</ul>
        <a class="sub-todos" href="#tratamentos">Ver todos os tratamentos${I.dir}</a>
      </div></div></li>`;
const topo = `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo" data-topo>
  <div class="topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, início">${logo}</a>
    <nav class="menu" aria-label="Principal"><ul class="menu-esq">${navEsq.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ul><ul class="menu-meio">${subTrat}</ul><ul class="menu-dir">${navDir.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ul></nav>
    <div class="topo-acoes">
      <span class="aberto" data-aberto>${I.relogio}<span data-aberto-txt>Segunda a sábado</span></span>
      ${botaoTema}
      <a class="btn btn-escuro topo-cta" href="#agendar">Agendar</a>
      <button type="button" class="abre-menu" data-abre-menu aria-expanded="false" aria-controls="menu-cel" aria-label="Abrir menu">${I.menu}${I.fechar}</button>
    </div>
  </div>
</header>
<div class="menu-cel" id="menu-cel" data-menu-cel hidden>
  <nav aria-label="Menu do celular"><ul>${nav.map(([id, t]) => `<li><a href="#${id}">${t}</a>${id === 'tratamentos' ? `<ul class="cel-sub">${C.tratamentos.map((x) => `<li><a href="#tratamentos" data-abre-trat="${x.id}">${x.nome}</a></li>`).join('')}</ul>` : ''}</li>`).join('')}</ul></nav>
  <div class="menu-cel-base"><a class="btn btn-escuro" href="#agendar">Agendar consulta</a><a class="btn btn-linha" href="${wa('Olá! Gostaria de agendar uma consulta na Raiz Odontologia.')}" target="_blank" rel="noopener">${I.conversa}WhatsApp</a></div>
</div>`;

// ---------- hero ----------
const H = C.hero;
const hero = `<section class="hero" id="inicio" aria-label="Apresentação">
  <div class="hero-quadro" data-hero>
    <div class="hero-fotos">${H.slides.map((s, i) => `<figure class="hero-foto${i === 0 ? ' ativa' : ''}" data-slide>${foto(s.foto, { lazy: i > 0, alt: s.alt, pos: s.pos })}</figure>`).join('')}</div>
    <div class="hero-veu" aria-hidden="true"></div>
    <div class="hero-in">
      <h1 class="hero-tit">${H.titulo.split(' ').map((w, i) => `<span class="pa" style="--i:${i}"><span>${esc(w)}</span></span>`).join(' ')}</h1>
      <div class="hero-rodape">
        <div class="hero-linha">
          <p class="hero-txt">${H.texto}</p>
          <div class="hero-btns">
            <a class="btn btn-claro" href="#agendar">Agendar avaliação<span class="btn-ic">${I.dir}</span></a>
            <a class="btn btn-vidro" href="#tratamentos">Ver tratamentos</a>
          </div>
        </div>
        <div class="hero-lado">
          <div class="hero-ctrl">
            <button type="button" class="redondo vidro" data-hero-ant aria-label="Foto anterior">${I.esq}</button>
            <div class="hero-barras" aria-hidden="true">${H.slides.map((_, i) => `<span${i === 0 ? ' class="on"' : ''}><i></i></span>`).join('')}</div>
            <button type="button" class="redondo vidro" data-hero-prox aria-label="Próxima foto">${I.dir}</button>
          </div>
          <a class="hero-prof" href="#equipe" data-hero-prof>
            <span class="hero-prof-fotos">${H.slides.map((s, i) => `<img src="assets/img/${eq[s.prof].foto}.webp" alt=""${i === 0 ? ' class="on"' : ''} loading="lazy">`).join('')}</span>
            <span class="hero-prof-txt"><b data-prof-nome>${eq[H.slides[0].prof].nome}</b><span data-prof-area>${eq[H.slides[0].prof].area}</span><small><span data-prof-exp>${eq[H.slides[0].prof].experiencia}</span> de experiência</small></span>
            <span class="redondo mini">${I.diag}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>`;

// ---------- jornada ----------
const jornada = `<section class="jornada" aria-label="Como é o cuidado">
  <div class="caixa">
    <ol class="jornada-lista" data-jornada>${C.jornada.map(([t, d, ic], i) => `<li style="--i:${i}"><span class="jornada-ic">${jornadaIc[ic]}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
  </div>
</section>`;

// ---------- sobre ----------
const So = C.sobre;
const sobre = `<section class="sobre" id="sobre">
  <div class="caixa">
    <div class="sobre-topo">
      <div class="sobre-lado" data-rv>
        <p class="rot">Sobre a clínica /</p>
        <div class="sobre-rostos">${['equipe-rafael', 'equipe-helena'].map((f) => `<span>${foto(f, { alt: '' })}</span>`).join('')}</div>
        <a class="link-seta" href="#equipe">Conheça a equipe${I.dir}</a>
      </div>
      <p class="frase" data-frase>${So.frase.split(' ').map((w) => `<span>${esc(w)}</span>`).join(' ')}</p>
    </div>
    <div class="sobre-base">
      <div class="numeros" data-rv>
        <p class="rot">${So.numerosTitulo}</p>
        <dl>${So.numeros.map(([v, suf, r]) => `<div><dt><span data-conta="${v}">${v}</span>${suf}</dt><dd>${r}</dd></div>`).join('')}</dl>
      </div>
      <figure class="sobre-foto" data-rv>${foto(So.foto)}<figcaption>${So.legenda}</figcaption></figure>
    </div>
  </div>
</section>`;

// ---------- tratamentos ----------
const tratamentos = `<section class="tratamentos" id="tratamentos">
  <div class="caixa">
    <header class="sec-cab" data-rv>
      <h2><span class="rot">Tratamentos /</span> Conheça os tratamentos que mais fazemos</h2>
      <p>Todo tratamento começa com um check-up digital e um plano por escrito, com os valores antes. A clínica é calma e silenciosa, pensada para nenhuma consulta parecer corrida.</p>
    </header>
    <div class="trat-corpo">
      <div class="trat-lado" data-rv>
        <p class="nota-google"><span class="avatares" aria-hidden="true">${['av-2', 'av-3', 'av-4'].map((a) => foto(a, { alt: '' })).join('')}</span><span><b>4,9 no Google</b><small>Nota de exemplo</small></span></p>
        <p>Os pacientes contam que as consultas são tranquilas e bem explicadas. Deslize para ver o que mais fazemos e toque num cartão para saber como funciona.</p>
        <div class="setas"><button type="button" class="redondo claro" data-trilho-ant aria-label="Tratamentos anteriores">${I.esq}</button><button type="button" class="redondo escuro" data-trilho-prox aria-label="Próximos tratamentos">${I.dir}</button></div>
      </div>
      <ul class="trilho" data-trilho>${C.tratamentos.map((t) => `<li><button type="button" class="trat" data-abre-trat="${t.id}" aria-haspopup="dialog">${foto(t.foto)}<span class="trat-meta">${t.tempo}, ${t.sessoes.charAt(0).toLowerCase() + t.sessoes.slice(1)}</span><span class="trat-nome">${t.nome}</span><span class="redondo vidro mini">${I.diag}</span></button></li>`).join('')}</ul>
    </div>
  </div>
</section>`;

// ---------- cuidado (painel) ----------
const O = C.orcamento;
const cuidado = `<section class="cuidado" id="cuidado">
  <div class="caixa">
    <header class="sec-cab centro" data-rv>
      <p class="rot">Cuidado de perto /</p>
      <h2>Um cuidado que você acompanha, da primeira consulta ao retorno</h2>
    </header>
    <div class="painel">
      <form class="cartao agendar" id="agendar" data-agendar data-rv novalidate>
        <div class="cartao-cab"><h3>Agende uma visita</h3><span class="etiqueta">${I.conversa}Resposta no WhatsApp</span></div>
        <p class="cartao-txt">Escolha a consulta, o dia e o período. A recepção confirma o horário com você pelo WhatsApp.</p>
        <fieldset><legend>Consulta</legend><div class="opcoes">${C.consultas.map(([id, n, d], i) => `<label class="opcao"><input type="radio" name="consulta" value="${id}"${i === 0 ? ' checked' : ''}><span>${n}<small>${d}</small></span></label>`).join('')}</div></fieldset>
        <fieldset><legend>Dia</legend><div class="dias" data-dias></div></fieldset>
        <fieldset><legend>Período</legend><div class="periodos">${['Manhã', 'Tarde', 'Fim do dia'].map((p, i) => `<label class="per"><input type="radio" name="periodo" value="${p}"${i === 0 ? ' checked' : ''}><span>${p}</span></label>`).join('')}</div></fieldset>
        <div class="agendar-base">
          <p><small>Sua visita</small><b data-ag-nome>${C.consultas[0][1]}</b><span data-ag-prof>com ${eq[C.consultas[0][3]].nome}</span></p>
          <button class="btn btn-petroleo" type="submit">Pedir horário<span class="btn-ic">${I.dir}</span></button>
        </div>
      </form>
      <div class="cartao alinhador" data-rv data-alinhador>
        <div class="cartao-cab"><h3>Plano de alinhadores</h3><span class="etiqueta clara">No prazo</span></div>
        <div class="al-num"><p><b data-conta="14">14</b><span>/ 22 placas</span></p><p class="al-ret"><small>Próximo retorno</small><b data-retorno>em 10 dias</b></p></div>
        <div class="segmentos" aria-hidden="true">${Array.from({ length: 22 }, (_, i) => `<i${i < 14 ? ' class="on"' : i === 14 ? ' class="agora"' : ''} style="--i:${i}"></i>`).join('')}</div>
        <div class="al-rot"><span>Início</span><span>Refinamento</span></div>
        <dl class="al-dados"><div><dt>Uso hoje</dt><dd>21h10</dd></div><div><dt>Movimento até agora</dt><dd>64%</dd></div></dl>
        <p class="exemplo">Exemplo do acompanhamento que o paciente recebe</p>
      </div>
      <div class="cartao orcamento" data-rv>
        <div class="cartao-cab"><h3>Orçamento por escrito</h3><span class="etiqueta clara">Sem surpresas</span></div>
        <ul>${O.itens.map(([n, v]) => `<li><span>${n}</span><b${v.startsWith('-') ? ' class="desc"' : ''}>${v}</b></li>`).join('')}</ul>
        <div class="orc-total"><span>Você paga</span><b>${O.total}</b></div>
        <p class="exemplo">${O.parcelas}. Valores de exemplo.</p>
      </div>
      <div class="cartao manutencao" data-rv>
        <p class="mono">A cada 6 meses</p>
        <h3>Mantenha o cuidado em dia</h3>
        <p>Limpezas, retornos dos alinhadores e lembretes gentis. Um sorriso bonito começa com constância.</p>
        <a class="btn btn-claro" href="${wa('Olá! Quero entender como funciona o plano de manutenção da Raiz Odontologia.')}" target="_blank" rel="noopener">Como funciona a manutenção<span class="btn-ic">${I.dir}</span></a>
        ${arcada}
      </div>
    </div>
  </div>
</section>`;

// ---------- equipe ----------
const e0 = C.equipe[0];
const equipe = `<section class="equipe" id="equipe">
  <div class="caixa">
    <header class="sec-cab" data-rv>
      <h2><span class="rot">Especialistas /</span> Mãos experientes, consultas sem pressa</h2>
      <a class="btn btn-linha" href="#agendar">Agendar com um especialista${I.dir}</a>
    </header>
    <div class="eq-corpo" data-equipe>
      <figure class="eq-foto" data-rv>${C.equipe.map((p, i) => `<img class="${i === 0 ? 'on' : ''}" src="assets/img/${p.foto}.webp" alt="${esc(`${p.nome}, ${p.area}`)}" loading="lazy" data-eq-foto="${p.id}">`).join('')}<figcaption class="eq-cro" data-eq-cro>${e0.cro}</figcaption></figure>
      <div class="eq-info">
        <ul class="eq-lista" role="tablist" aria-label="Profissionais">${C.equipe.map((p, i) => `<li><button type="button" role="tab" aria-selected="${i === 0}" data-eq="${p.id}"><b>${p.nome}</b><span>${p.area}</span><i class="eq-prog" aria-hidden="true"></i></button></li>`).join('')}</ul>
        <div class="eq-bio" role="tabpanel" aria-live="polite">
          <p data-eq-bio>${e0.bio}</p>
          <dl><div><dt>Experiência</dt><dd data-eq-exp>${e0.experiencia}</dd></div><div><dt>Formação</dt><dd data-eq-form>${e0.formacao}</dd></div><div><dt>Na clínica</dt><dd data-eq-dias>${e0.dias}</dd></div></dl>
          <a class="btn btn-escuro" data-eq-agendar href="#agendar"><span>Agendar com <span data-eq-nome>${e0.nome}</span></span><span class="btn-ic">${I.dir}</span></a>
        </div>
      </div>
    </div>
  </div>
</section>`;

// ---------- resultados: antes e depois ----------
const c0 = C.casos[0];
const resultados = `<section class="resultados" id="resultados">
  <div class="caixa res-grade">
    <div class="res-txt" data-rv>
      <p class="rot">Resultados /</p>
      <h2>Arraste e veja a diferença</h2>
      <div class="abas" role="tablist" aria-label="Casos">${C.casos.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-caso="${c.id}">${c.nome}</button>`).join('')}</div>
      <p class="res-caso" data-caso-txt>${c0.texto}</p>
      <p class="res-tempo"><small>Tempo de tratamento</small><b data-caso-tempo>${c0.tempo}</b></p>
      <p class="res-aviso">As imagens são simulações ilustrativas. Na clínica, mostramos casos reais só com autorização por escrito do paciente.</p>
    </div>
    <div class="comp" data-comp data-rv style="--pos:50%">
      ${C.casos.map((c, i) => `<div class="comp-par${i === 0 ? ' on' : ''}" data-par="${c.id}"><img class="comp-depois" src="assets/img/${c.depois}.webp" alt="${esc(`${c.nome}, depois`)}" loading="lazy"><img class="comp-antes" src="assets/img/${c.antes}.webp" alt="${esc(`${c.nome}, antes`)}" loading="lazy"></div>`).join('')}
      <span class="comp-rot antes">Antes</span><span class="comp-rot depois">Depois</span>
      <span class="comp-selo">Simulação ilustrativa</span>
      <span class="comp-linha" aria-hidden="true"><span class="comp-pega">${I.esq}${dente('comp-dente')}${I.dir}</span></span>
      <input class="comp-range" type="range" min="0" max="100" value="50" step="0.5" aria-label="Comparar antes e depois" data-comp-range>
    </div>
  </div>
</section>`;

// ---------- clínica ----------
const K = C.clinica;
const clinica = `<section class="clinica" id="clinica">
  <div class="caixa">
    <div class="cl-grade">
      <div class="cl-txt" data-rv>
        <p class="rot">Por dentro da clínica /</p>
        <h2>${K.titulo}</h2>
        <p class="cl-lead">${K.texto}</p>
        <ul class="cl-itens">${K.itens.map(([t, d, ic]) => `<li>${clinicaIc[ic]}<div><h3>${t}</h3><p>${d}</p></div></li>`).join('')}</ul>
      </div>
      <figure class="cl-foto" data-rv>
        ${foto('consultorio')}
        <div class="cl-dados" data-cl-dados>
          <dl><div><dt>Check-ups recomendados</dt><dd><b>2</b> por ano</dd></div><div><dt>Consulta média</dt><dd><b>40</b> min</dd></div></dl>
          <div class="cl-agenda"><p><span>Agenda de hoje</span><b data-agenda-pct>60%</b></p><div class="segmentos fino" data-agenda>${Array.from({ length: 30 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div></div>
        </div>
      </figure>
    </div>
    <ul class="galeria" data-galeria>${K.galeria.map(([f, t], i) => `<li class="g${i}" data-rv><button type="button" data-foto="${f}" data-legenda="${t}" aria-label="Ampliar foto: ${t}">${foto(f)}<span>${t}</span></button></li>`).join('')}</ul>
  </div>
</section>`;

// ---------- avaliações ----------
const avaliacoes = `<section class="avaliacoes" id="avaliacoes">
  <div class="caixa av-grade">
    <div class="av-lado" data-rv>
      <p class="rot">Avaliações /</p>
      <h2>O que dizem os pacientes</h2>
      <p class="av-nota">${I.estrela}<b>4,9</b><span>no Google<small>Nota de exemplo</small></span></p>
    </div>
    <div class="av-corpo" data-av data-rv>
      <div class="av-slides">${C.avaliacoes.map((a, i) => `<figure class="av${i === 0 ? ' on' : ''}" data-av-item aria-hidden="${i !== 0}"><blockquote>“${a.texto}”</blockquote><figcaption>${foto(a.foto, { alt: '' })}<span><b>${a.nome}</b><small>${a.tratamento}</small></span></figcaption></figure>`).join('')}</div>
      <div class="av-ctrl">
        <div class="av-barras" aria-hidden="true">${C.avaliacoes.map((_, i) => `<span${i === 0 ? ' class="on"' : ''}><i></i></span>`).join('')}</div>
        <div class="setas"><button type="button" class="redondo escuro" data-av-ant aria-label="Avaliação anterior">${I.esq}</button><button type="button" class="redondo escuro" data-av-prox aria-label="Próxima avaliação">${I.dir}</button></div>
      </div>
      <p class="av-aviso">Depoimentos e fotos de exemplo. Para publicar, use relatos reais com autorização por escrito.</p>
    </div>
  </div>
</section>`;

// ---------- artigos ----------
const artigos = `<section class="artigos" id="artigos">
  <div class="caixa">
    <header class="sec-cab" data-rv>
      <h2><span class="rot">Blog /</span> Dicas para manter o sorriso saudável</h2>
    </header>
    <ul class="art-grade">${C.artigos.map((a, i) => `<li data-rv><button type="button" class="art" data-artigo="${i}" aria-haspopup="dialog"><span class="art-foto">${foto(a.foto)}<span class="art-tag">${a.tag}</span></span><span class="art-meta"><span>${a.autor}</span><span>${a.data}, ${a.leitura} de leitura</span></span><span class="art-tit">${a.titulo}</span></button></li>`).join('')}</ul>
  </div>
</section>`;

// ---------- faq ----------
const faq = `<section class="faq" id="faq">
  <div class="caixa faq-grade">
    <div class="faq-lado" data-rv>
      <p class="rot">Dúvidas /</p>
      <h2>Perguntas respondidas</h2>
      <p>Ficou alguma dúvida? Ligue para a recepção no <a href="tel:${M.telefoneLink}">${M.telefone}</a> ou chame no WhatsApp que a gente conversa.</p>
    </div>
    <ul class="faq-lista" data-rv>${C.faq.map(([q, r], i) => `<li class="${i === 0 ? 'aberta' : ''}"><h3><button type="button" aria-expanded="${i === 0}" aria-controls="faq-${i}" id="faq-b${i}" data-faq>${q}<span class="redondo faq-ic">${I.mais}</span></button></h3><div class="faq-r" id="faq-${i}" role="region" aria-labelledby="faq-b${i}"><div><p>${r}</p></div></div></li>`).join('')}</ul>
  </div>
</section>`;

// ---------- contato + formulário ----------
const contato = `<section class="contato" id="contato">
  <div class="caixa">
    <div class="ct-bloco" data-rv>
      <div class="ct-form-lado">
        <p class="rot">Pronto para um sorriso mais saudável? /</p>
        <h2>${C.contato.titulo}</h2>
        <p class="ct-lead">${C.contato.texto}</p>
        <form class="form" data-form novalidate>
          <div class="campo"><label for="f-nome">Nome</label><input id="f-nome" name="nome" autocomplete="name" required placeholder="Como podemos chamar você?"><small class="erro">Conte seu nome para a recepção.</small></div>
          <div class="campo"><label for="f-tel">WhatsApp</label><input id="f-tel" name="tel" type="tel" inputmode="tel" autocomplete="tel" required placeholder="(41) 90000-0000" data-mascara><small class="erro">Informe um número com DDD.</small></div>
          <div class="campo"><label for="f-email">E-mail <em>(opcional)</em></label><input id="f-email" name="email" type="email" autocomplete="email" placeholder="voce@email.com"><small class="erro">Confira o e-mail.</small></div>
          <div class="campo"><label for="f-trat">Tratamento</label><select id="f-trat" name="trat"><option value="">Ainda não sei, quero uma avaliação</option>${C.tratamentos.map((t) => `<option>${t.nome}</option>`).join('')}<option>Urgência</option></select></div>
          <fieldset class="campo largo"><legend>Melhor período</legend><div class="periodos">${['Manhã', 'Tarde', 'Fim do dia', 'Tanto faz'].map((p, i) => `<label class="per"><input type="radio" name="periodo" value="${p}"${i === 3 ? ' checked' : ''}><span>${p}</span></label>`).join('')}</div></fieldset>
          <div class="campo largo"><label for="f-msg">Mensagem <em>(opcional)</em></label><textarea id="f-msg" name="msg" rows="3" placeholder="Conte o que está incomodando ou o que você quer mudar no sorriso"></textarea></div>
          <label class="aceite largo"><input type="checkbox" name="aceite" required><span>Concordo que a ${M.completo} use estes dados para entrar em contato comigo, conforme a LGPD.</span><small class="erro">Precisamos do seu consentimento para responder.</small></label>
          <div class="form-base largo"><button class="btn btn-petroleo" type="submit">Enviar pedido<span class="btn-ic">${I.dir}</span></button><a class="ct-fone" href="tel:${M.telefoneLink}">${I.fone}${M.telefone}</a></div>
          <div class="form-ok" data-form-ok hidden tabindex="-1"><span class="form-ok-ic">${dente('ok-dente')}</span><h3>Pedido pronto, <span data-ok-nome></span>!</h3><p>Abrimos o WhatsApp da clínica com a sua mensagem. É só tocar em enviar. Se a janela não abriu, <a data-ok-wa href="#" target="_blank" rel="noopener">clique aqui</a>.</p><button type="button" class="btn btn-linha" data-form-novo>Enviar outro pedido</button></div>
        </form>
      </div>
      <figure class="ct-foto">${foto('lounge')}<figcaption><b>${M.completo}</b><span>${M.rua}, ${M.bairro}</span>${C.horarioTexto.map((h) => `<span>${h}</span>`).join('')}</figcaption></figure>
    </div>
  </div>
</section>`;

// ---------- rodapé ----------
const rodape = `<footer class="rodape">
  <div class="caixa">
    <div class="rod-topo">
      <div class="rod-marca">
        <a class="logo" href="#inicio" aria-label="${M.completo}, início">${logo}</a>
        <p>Um e-mail curto por mês com dicas de saúde bucal, novidades da clínica e campanhas da estação.</p>
        <form class="news" data-news novalidate><label class="sr" for="n-email">Seu e-mail</label><input id="n-email" type="email" placeholder="Seu e-mail" required><button class="btn btn-petroleo" type="submit">Assinar</button><small class="news-msg" data-news-msg aria-live="polite"></small></form>
      </div>
      <div class="rod-cols">
        <div><h3>Tratamentos</h3><ul>${C.tratamentos.slice(0, 5).map((t) => `<li><a href="#tratamentos" data-abre-trat="${t.id}">${t.nome}</a></li>`).join('')}</ul></div>
        <div><h3>Clínica</h3><ul><li><a href="#sobre">Sobre</a></li><li><a href="#equipe">Especialistas</a></li><li><a href="#avaliacoes">Avaliações</a></li><li><a href="#artigos">Blog</a></li><li><a href="#faq">Dúvidas</a></li></ul></div>
        <div><h3>Visite</h3><p>${M.rua}<br>${M.bairro}, ${M.cidade}, ${M.uf}</p><p>${C.horarioTexto.join('<br>')}</p><p><a href="${rotaUrl}" target="_blank" rel="noopener">Como chegar</a></p></div>
        <div><h3>Contato</h3><p><a href="tel:${M.telefoneLink}">${M.telefone}</a><br><a href="${wa('Olá! Gostaria de falar com a Raiz Odontologia.')}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a><br><a href="mailto:${M.email}">${M.email}</a></p>
          <div class="redes"><a class="redondo" href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a><a class="redondo" href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a><a class="redondo" href="${wa('Olá!')}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.conversa}</a></div></div>
      </div>
    </div>
    <div class="mapa-linha">
      <div class="map-box">
        <img src="assets/img/mapa_batel.webp" alt="Mapa do ${M.bairro}, ${M.cidade}, com a localização da ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"></span>
        <div class="map-info"><b>${M.completo}</b><span>${endereco}, CEP ${M.cep}</span><span>${C.horarioTexto.join('. ')}</span>
          <div class="mbtns"><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Atendimento na clínica, com hora marcada. Recebemos pacientes destes bairros e de toda Curitiba e região.</p>
        <ul class="bairros" data-iguais>${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="rod-base">
      <p>© <span data-ano>2026</span> ${M.completo}. ${M.razao}, CNPJ ${M.cnpj}. Responsável técnica: ${M.responsavel}.</p>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditos.map((c) => `<li>${c.arq}: ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener">${esc(c.autor)}</a>, ${c.fonte}` : esc(c.autor)}</li>`).join('')}</ul></details>
    </div>
  </div>
  <p class="rod-gigante" aria-hidden="true">${M.nome}</p>
</footer>`;

// ---------- janelas ----------
const janelas = `<dialog class="janela jan-trat" data-jan-trat aria-labelledby="jt-tit">
  <div class="jan-in">
    <button type="button" class="redondo jan-fechar" data-fechar aria-label="Fechar">${I.fechar}</button>
    <div class="jt-foto"><img data-jt-foto src="" alt=""></div>
    <div class="jt-txt">
      <p class="mono" data-jt-meta></p>
      <h2 id="jt-tit" data-jt-nome></h2>
      <p data-jt-texto></p>
      <dl><div><dt>Indicado para</dt><dd data-jt-para></dd></div></dl>
      <h3>O que está incluso</h3>
      <ul data-jt-inclui></ul>
      <p class="jt-valor">O valor sai na avaliação, por escrito, antes de começar.</p>
      <a class="btn btn-petroleo" data-jt-wa href="#" target="_blank" rel="noopener">Agendar pelo WhatsApp<span class="btn-ic">${I.dir}</span></a>
    </div>
  </div>
</dialog>
<dialog class="janela jan-art" data-jan-art aria-labelledby="ja-tit">
  <div class="jan-in">
    <button type="button" class="redondo jan-fechar" data-fechar aria-label="Fechar">${I.fechar}</button>
    <img data-ja-foto src="" alt="">
    <div class="ja-txt"><p class="mono" data-ja-meta></p><h2 id="ja-tit" data-ja-tit></h2><div data-ja-corpo></div>
      <a class="btn btn-linha" href="#agendar" data-fechar>Agendar uma consulta${I.dir}</a></div>
  </div>
</dialog>
<dialog class="janela jan-foto" data-jan-foto aria-label="Foto ampliada">
  <button type="button" class="redondo jan-fechar" data-fechar aria-label="Fechar">${I.fechar}</button>
  <figure><img data-jf-img src="" alt=""><figcaption data-jf-leg></figcaption></figure>
</dialog>`;

// dados para o app.js (janelas, agendamento, equipe e status de horário)
const dados = {
  wa: M.whatsapp,
  marca: M.completo,
  horario: C.horario,
  tratamentos: C.tratamentos.map(({ id, nome, foto: f, tempo, sessoes, texto, para, inclui }) => ({ id, nome, foto: f, tempo, sessoes, texto, para, inclui })),
  equipe: C.equipe,
  consultas: C.consultas.map(([id, nome, dur, prof]) => ({ id, nome, dur, prof: eq[prof].nome })),
  slides: C.hero.slides.map((s) => s.prof),
  casos: C.casos.map(({ id, texto, tempo }) => ({ id, texto, tempo })),
  artigos: C.artigos,
};

const head = (titulo, desc) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#F1F4F2">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" stroke="#0F5560" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.2c-3-2.6-8.8-2.8-10.4 2-1.4 4.2.8 7.6 1.7 11.4.8 3.4 1.2 8 3.3 8 2 0 2.1-5.2 5.4-5.8 3.3.6 3.4 5.8 5.4 5.8 2.1 0 2.5-4.6 3.3-8 .9-3.8 3.1-7.2 1.7-11.4-1.6-4.8-7.4-4.6-10.4-2Z"/><path d="M20 11.2c.2-3.4 2.4-5.8 5.8-6.2-.2 3.2-2.6 5.6-5.8 6.2Z"/></svg>')}">
${temaCedo}
${fontes}`;

const html = `${head(`${M.completo} | Clínica odontológica no ${M.bairro}, ${M.cidade}`, `${M.completo}: check-up, clareamento, alinhadores, implantes, lentes de contato e odontopediatria no ${M.bairro}, ${M.cidade}. Plano por escrito e consultas sem pressa.`)}
<link rel="stylesheet" href="assets/site.css">
</head>
<body>
${topo}
<main id="conteudo">
${hero}
${jornada}
${sobre}
${tratamentos}
${cuidado}
${equipe}
${resultados}
${clinica}
${avaliacoes}
${artigos}
${faq}
${contato}
</main>
${rodape}
<a class="wa-fixo" href="${wa('Olá! Gostaria de agendar uma consulta na Raiz Odontologia.')}" target="_blank" rel="noopener" aria-label="Falar com a clínica no WhatsApp"><span class="wa-fixo-txt">Fale com a gente</span><span class="wa-fixo-ic">${I.conversa}</span></a>
${janelas}
<script id="dados" type="application/json">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>
<script src="assets/site.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'index.html'), html);

// ---------- 404: arquivo único, funciona em qualquer endereço ----------
// A arcada perdeu um dente: o que falta flutua acima do vão. CSS e fontes inline/Google, sem depender de assets/.
const arco404 = (() => {
  const N = 10; const g = [];
  for (let i = 0; i < N; i++) {
    const t = (i / (N - 1)) * 2 - 1; const a = t * 1.25;
    const x = 200 + 165 * Math.sin(a); const y = 30 + 120 * (1 - Math.cos(a));
    const k = Math.abs(t); const w = 30 + k * 12; const h = 40 + (1 - k) * 8;
    if (i === 4) { g.push(`<g class="vao" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><path d="M${(-w / 2 + 3).toFixed(1)} -6c4 6 ${(w - 6) / 2} 8 ${(w - 6).toFixed(1)} 0"/></g>`); continue; }
    g.push(`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((-a * 180) / Math.PI).toFixed(1)})"><rect x="${(-w / 2).toFixed(1)}" y="${(-h / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(w * 0.45).toFixed(1)}"/></g>`);
  }
  return `<svg class="arco" viewBox="0 0 400 200" aria-hidden="true"><path class="gengiva" d="M20 52c40 110 320 110 360 0"/>${g.join('')}</svg>`;
})();
const css404 = `:root{--fundo:#F1F4F2;--sup:#fff;--tinta:#0E1D1F;--texto:#3C4D4E;--suave:#6C7D7C;--pet:#0F5560;--pet-txt:#fff;--agua:#DDEBE8;--linha:rgba(14,29,31,.12)}
:root[data-tema="escuro"]{--fundo:#0A1516;--sup:#102022;--tinta:#E8F0EE;--texto:#B5C5C3;--suave:#829593;--pet:#7FD3C4;--pet-txt:#06262B;--agua:#13292B;--linha:rgba(232,240,238,.12)}
*{box-sizing:border-box;margin:0}html{color-scheme:light}:root[data-tema="escuro"]{color-scheme:dark}
body{min-height:100vh;min-height:100svh;display:grid;place-items:center;background:var(--fundo);color:var(--texto);font:400 17px/1.6 "Mona Sans",Georgia,serif;padding:32px 16px;overflow-x:hidden}
.c404{width:min(720px,100%);text-align:center;display:grid;justify-items:center;gap:18px}
.logo{display:inline-flex;align-items:center;gap:10px;color:var(--tinta);text-decoration:none;font:500 22px/1 Geologica,sans-serif;letter-spacing:-.03em}
.logo svg{width:34px;height:34px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.logo small{display:block;font:400 12px/1.4 "Mona Sans",sans-serif;color:var(--suave);letter-spacing:0}
.cena{position:relative;width:min(420px,90vw);margin-top:clamp(70px,12vw,110px)}
.arco{width:100%;overflow:visible;fill:var(--sup);stroke:var(--tinta);stroke-width:2;stroke-linejoin:round}
.arco .gengiva{fill:none;stroke:var(--pet);stroke-width:3;stroke-linecap:round;opacity:.35}
.arco .vao path{fill:none;stroke:var(--pet);stroke-dasharray:4 5;stroke-linecap:round}
.solto{position:absolute;left:50%;top:-34%;width:22%;translate:-50% 0;animation:flutua 4.2s ease-in-out infinite}
.solto svg{width:100%;fill:var(--sup);stroke:var(--tinta);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 18px 18px rgba(14,29,31,.14))}
.solto .broto{fill:var(--pet);stroke:var(--pet)}
@keyframes flutua{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-14px) rotate(5deg)}}
.cod{font:500 13px/1 "Azeret Mono",monospace;color:var(--pet);letter-spacing:.04em}
h1{font:400 clamp(40px,7vw,72px)/1 Geologica,sans-serif;letter-spacing:-.045em;color:var(--tinta);text-wrap:balance}
p.txt{max-width:46ch;text-wrap:pretty}
.btns{display:inline-grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:10px;margin-top:8px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;height:52px;padding:0 24px;border-radius:16px;font:500 16px/1 "Mona Sans",sans-serif;text-decoration:none;white-space:nowrap;transition:transform .3s,background-color .3s}
.btn:hover{transform:translateY(-2px)}
.b1{background:var(--pet);color:var(--pet-txt)}.b2{border:1px solid var(--linha);color:var(--tinta);background:var(--sup)}
@media (max-width:520px){.btns{grid-auto-flow:row;width:100%}}
@media (prefers-reduced-motion:reduce){.solto{animation:none}}`;
const html404 = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página não encontrada | ${M.completo}</title>
<meta name="robots" content="noindex">
${temaCedo}
${fontes}
<style>${css404}</style>
</head>
<body>
<main class="c404">
  <a class="logo" href="/">${dente('')}<span>${M.nome}<small>${M.sub}</small></span></a>
  <div class="cena">${arco404}<span class="solto">${dente('')}</span></div>
  <p class="cod">Erro 404</p>
  <h1>Esta página foi extraída.</h1>
  <p class="txt">Procuramos na arcada inteira e o endereço que você abriu não está aqui. Pode ter mudado de lugar ou nunca ter existido.</p>
  <div class="btns"><a class="btn b1" href="./">Voltar ao início</a><a class="btn b2" href="${wa('Olá! Tentei abrir uma página do site e não encontrei. Podem me ajudar?')}" target="_blank" rel="noopener">Falar no WhatsApp</a></div>
</main>
<script>document.querySelector('.logo').href=location.pathname.replace(/[^/]*$/,'')||'/';document.querySelector('.b1').href=document.querySelector('.logo').href;</script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, '404.html'), html404);

if (faltando.length) console.warn('FOTOS FALTANDO:', [...new Set(faltando)].join(', '));
console.log('ok', path.relative(process.cwd(), OUT), Math.round(html.length / 1024) + 'k');
