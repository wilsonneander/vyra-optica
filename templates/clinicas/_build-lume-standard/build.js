// Gera o Bronze de odontologia (Lume Odontologia) em "templates/clinicas/standard/lume-standard/", inspirado nas referências
// Elan Dental (creme, argila e serifa com itálico) e Curevanta (muitas fotos em cartões e seções escuras):
// hero com foto, tratamentos em mosaico, antes e depois arrastável, procedimentos com foto que troca, equipe,
// a clínica com faixa de fotos, dúvidas, agendamento pelo WhatsApp, rodapé com mapa OSM e página 404.
// Uso: node templates/clinicas/_build-lume-standard/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');

const OUT = path.join(__dirname, '..', 'standard', 'lume-standard');
const FOTOS = path.join(__dirname, 'img', 'fotos');
const M = C.marca;

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const endereco = `${M.rua}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${M.rua}, ${M.bairro}, ${M.cidade}`)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
const waAgendar = wa(`Olá! Gostaria de agendar uma avaliação na ${M.completo}.`);

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
for (const f of fs.readdirSync(FOTOS)) fs.copyFileSync(path.join(FOTOS, f), path.join(OUT, 'assets', 'img', f));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_savassi.webp'), path.join(OUT, 'assets', 'img', 'mapa_savassi.webp'));
fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(OUT, 'assets', 'site.css'));
fs.copyFileSync(path.join(__dirname, 'app.js'), path.join(OUT, 'assets', 'site.js'));
const creditos = JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'creditos.json'), 'utf8'));

const faltando = [];
const foto = (nome, { cls = '', lazy = true, alt, pos } = {}) => {
  if (!fs.existsSync(path.join(FOTOS, `${nome}.webp`))) faltando.push(nome);
  return `<img${cls ? ` class="${cls}"` : ''} src="assets/img/${nome}.webp" alt="${esc(alt ?? C.fotos[nome] ?? '')}"${pos ? ` style="object-position:${pos}"` : ''}${lazy ? ' loading="lazy"' : ' fetchpriority="high"'} decoding="async">`;
};
// título em duas linhas: a segunda em itálico na cor argila
const tit = ([a, b], tag = 'h2', cls = '') => `<${tag}${cls ? ` class="${cls}"` : ''}><span class="l1">${a}</span> <em>${b}</em></${tag}>`;

// ---------- desenhos próprios: traço 1,6 com pontas redondas, como o dente com luz da marca ----------
const DENTE = 'M20 16.4c-2.6-2.2-7.6-2.3-9 1.6-1.2 3.6.7 6.5 1.5 9.8.7 2.9 1 6.6 2.8 6.6 1.7 0 1.8-4.4 4.7-5 2.9.6 3 5 4.7 5 1.8 0 2.1-3.7 2.8-6.6.8-3.3 2.7-6.2 1.5-9.8-1.4-3.9-6.4-3.8-9-1.6Z';
const marcaSvg = (cls = 'logo-svg') => `<svg class="${cls}" viewBox="0 0 40 40" aria-hidden="true"><path class="raios" d="M20 4.2v3.6M10.6 7.6l2.3 2.6M29.4 7.6l-2.3 2.6"/><path d="${DENTE}"/></svg>`;
const logo = `<span class="logo-marca">${marcaSvg()}<span class="logo-txt">${M.nome}<small>${M.sub}</small></span></span>`;
const S = (d, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I = {
  diag: S('<path d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15"/>'),
  esq: S('<path d="M14.5 6 8.5 12l6 6"/>'),
  dir: S('<path d="M9.5 6l6 6-6 6"/>'),
  mais: S('<path d="M12 6v12M6 12h12"/>', 'ic ic-mais'),
  fechar: S('<path d="M7 7l10 10M17 7 7 17"/>'),
  menu: S('<path d="M4 9h16M4 15h11"/>'),
  fone: S('<path d="M7.2 3.8 9.6 4.4l1.1 4-1.9 1.5a11 11 0 0 0 5.3 5.3l1.5-1.9 4 1.1.6 2.4c-.6 1.8-2.2 2.9-4 2.6A14.6 14.6 0 0 1 4.6 7.8c-.3-1.8.8-3.4 2.6-4Z"/>'),
  // balão de conversa com sorriso (WhatsApp desenhado na marca)
  conversa: S('<path d="M4.5 19 5.6 15.2A8 8 0 1 1 9 18.6Z"/><path d="M8.8 11.6c1.6 2 4.8 2 6.4 0"/>'),
  pino: S('<path d="M12 21.5s-6.5-6.2-6.5-11.3a6.5 6.5 0 0 1 13 0c0 5.1-6.5 11.3-6.5 11.3Z"/><path d="M12 7.6v.01"/>'),
  seta: S('<path d="M5 12h13.5M13.5 6.5 19 12l-5.5 5.5"/>'),
  insta: S('<rect x="4.5" y="4.5" width="15" height="15" rx="4.5"/><path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM16.4 7.6h.01"/>'),
  face: S('<path d="M13.5 20v-7h2.6l.4-3h-3V8.4c0-.9.3-1.4 1.5-1.4h1.6V4.3c-.4-.1-1.3-.2-2.3-.2-2.3 0-3.8 1.4-3.8 3.9V10H8v3h2.5v7"/>'),
  // tema: o dente da marca com a luz acesa (claro) e com a lua (escuro)
  tema: `<svg class="tema-svg" viewBox="0 0 40 40" aria-hidden="true"><path class="tema-raios" d="M20 3.6v3.6M10.6 7.2l2.3 2.6M29.4 7.2l-2.3 2.6M5.4 15.4l3.2 1M34.6 15.4l-3.2 1"/><path class="tema-lua" d="M28.6 4.8a5.4 5.4 0 1 0 6 7.6 4.3 4.3 0 1 1-6-7.6Z"/><path d="${DENTE}"/></svg>`,
};

// ---------- tema cedo (antes de pintar) ----------
const temaCedo = `<script>(function(){var r=document.documentElement;r.classList.add('js');var t=null;try{t=localStorage.getItem('lume-tema')}catch(e){}if(!t&&matchMedia('(prefers-color-scheme: dark)').matches)t='escuro';if(t==='escuro')r.dataset.tema='escuro';})();</script>`;
const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Petrona:ital,wght@0,300..500;1,300..500&family=Libre+Franklin:wght@400;500;600&display=swap" rel="stylesheet">';
const botaoTema = `<button type="button" class="tema" data-botao-tema aria-pressed="false" aria-label="Mudar para o tema escuro">${I.tema}</button>`;

// ---------- topo ----------
const nav = [['tratamentos', 'Tratamentos'], ['resultados', 'Resultados'], ['procedimentos', 'Procedimentos'], ['equipe', 'Equipe'], ['clinica', 'A clínica'], ['faq', 'Dúvidas']];
const topo = `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo" data-topo>
  <a class="logo" href="#inicio" aria-label="${M.completo}, início">${logo}</a>
  <nav class="menu" aria-label="Principal"><ul>${nav.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ul></nav>
  <div class="topo-acoes">
    ${botaoTema}
    <a class="btn btn-tinta topo-cta" href="#agendar">Agendar</a>
    <button type="button" class="abre-menu" data-abre-menu aria-expanded="false" aria-controls="menu-cel" aria-label="Abrir menu">${I.menu}${I.fechar}</button>
  </div>
  <div class="menu-cel" id="menu-cel" data-menu-cel hidden>
    <ul>${nav.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ul>
    <a class="btn btn-argila" href="#agendar">Agendar consulta</a>
  </div>
</header>`;

// ---------- hero ----------
const H = C.hero;
const hero = `<section class="hero" id="inicio" aria-label="Apresentação">
  <figure class="hero-foto">${foto('hero', { lazy: false, alt: H.alt, pos: '62% 40%' })}</figure>
  <div class="hero-veu" aria-hidden="true"></div>
  <div class="caixa hero-in">
    <p class="apoio hero-apoio">${H.apoio}</p>
    ${tit(H.titulo, 'h1', 'hero-tit')}
    <p class="hero-txt">${H.texto}</p>
    <div class="hero-btns">
      <a class="btn btn-argila" href="${waAgendar}" target="_blank" rel="noopener">${I.conversa}Agendar pelo WhatsApp</a>
      <a class="btn btn-linha" href="#tratamentos">Ver tratamentos</a>
    </div>
  </div>
  <aside class="hero-cartao" aria-label="Atendimento">
    <p class="hero-status" data-aberto>Segunda a sábado</p>
    <ul>${C.garantias.map((g) => `<li>${g}</li>`).join('')}</ul>
    <a class="hero-end" href="#onde">${I.pino}${M.rua}, ${M.bairro}</a>
  </aside>
</section>`;

// ---------- tratamentos ----------
const tratamentos = `<section class="sec tratamentos" id="tratamentos">
  <div class="caixa">
    <header class="sec-cab" data-rv>
      <div><p class="apoio">Cuidado do começo ao fim</p>${tit(['Tratamentos pensados', 'para o seu sorriso.'])}</div>
      <p class="sec-lead">Das pequenas correções a uma reabilitação completa, toda indicação parte do que você quer, das proporções do seu rosto e da saúde da boca a longo prazo.</p>
    </header>
    <ul class="trat-grade">${C.tratamentos.map((t, i) => `<li class="trat t${i}" data-rv style="--d:${(i % 4) * 70}ms"><a href="${wa(`Olá! Quero saber mais sobre ${t.nome.toLowerCase()} na ${M.completo}.`)}" target="_blank" rel="noopener">
      <span class="trat-foto">${foto(t.foto, { pos: t.pos })}</span>
      <span class="trat-txt"><span class="trat-tempo">${t.tempo}</span><span class="trat-nome">${t.nome}</span><span class="trat-desc">${t.texto}</span><span class="trat-ir">Agendar avaliação<span class="quadro">${I.diag}</span></span></span>
    </a></li>`).join('')}</ul>
  </div>
</section>`;

// ---------- resultados: antes e depois ----------
const c0 = C.casos[0];
const resultados = `<section class="sec resultados" id="resultados">
  <div class="caixa">
    <header class="sec-cab" data-rv>
      <div><p class="apoio">Sorrisos refinados com cuidado</p>${tit(['Resultados naturais,', 'nunca exagerados.'])}</div>
      <div class="abas" role="tablist" aria-label="Casos" data-iguais>${C.casos.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-caso="${c.id}">${c.nome}</button>`).join('')}</div>
    </header>
    <div class="res-grade">
      <div class="comp" data-comp data-rv style="--pos:50%">
        ${C.casos.map((c, i) => `<div class="comp-par${i === 0 ? ' on' : ''}" data-par="${c.id}"><img class="comp-depois" src="assets/img/${c.depois}.webp" alt="${esc(`${c.nome}, depois`)}" loading="lazy"><img class="comp-antes" src="assets/img/${c.antes}.webp" alt="${esc(`${c.nome}, antes`)}" loading="lazy"></div>`).join('')}
        <span class="comp-rot antes">Antes</span><span class="comp-rot depois">Depois</span>
        <span class="comp-linha" aria-hidden="true"><span class="comp-pega">${I.esq}${I.dir}</span></span>
        <input class="comp-range" type="range" min="0" max="100" value="50" step="0.5" aria-label="Arraste para comparar antes e depois" data-comp-range>
      </div>
      <article class="caso" data-rv style="--d:120ms">
        <p class="caso-tag" data-caso-tag>${c0.nome}</p>
        <h3 data-caso-tit>${c0.titulo}</h3>
        <p data-caso-txt>${c0.texto}</p>
        <dl data-caso-dados>${c0.dados.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
        <p class="caso-aviso">Simulação ilustrativa. Na clínica, mostramos casos reais só com autorização por escrito do paciente. Resultados variam de pessoa para pessoa.</p>
      </article>
    </div>
  </div>
</section>`;

// ---------- procedimentos ----------
const P = C.procedimentos;
const procedimentos = `<section class="sec procedimentos" id="procedimentos">
  <div class="caixa proc-grade">
    <figure class="proc-foto" data-rv aria-hidden="true">
      ${P.map(([id, , , , , f], i) => `<img class="${i === 0 ? 'on' : ''}" data-proc-foto="${id}" src="assets/img/${f}.webp" alt="" loading="lazy">`).join('')}
      <figcaption><span>Duração</span><b data-proc-dur>${P[0][3]}</b></figcaption>
    </figure>
    <div class="proc-lado">
      <header data-rv><p class="apoio">Do dia a dia à urgência</p>${tit(['Procedimentos explicados', 'antes de começar.'])}<p class="sec-lead">Você sabe quanto tempo leva e como fica depois. Passe pela lista para ver cada um.</p></header>
      <ul class="proc-lista" data-proc>${P.map(([id, n, t, d, dep, f], i) => `<li data-rv style="--d:${i * 50}ms"><button type="button" class="proc${i === 0 ? ' on' : ''}" data-proc-id="${id}" data-dur="${esc(d)}" aria-pressed="${i === 0}">
        <img class="proc-mini" src="assets/img/${f}.webp" alt="" loading="lazy">
        <span class="proc-nome">${n}</span><span class="proc-txt">${t}</span>
        <span class="proc-meta"><span>${d}</span><span>${dep}</span></span>
      </button></li>`).join('')}</ul>
    </div>
  </div>
</section>`;

// ---------- equipe ----------
const equipe = `<section class="sec equipe" id="equipe">
  <div class="caixa">
    <header class="sec-cab" data-rv>
      <div><p class="apoio">Quem cuida de você</p>${tit(['Precisão clínica,', 'com espaço para conversa.'])}</div>
      <a class="btn btn-linha" href="#agendar">Agendar com a equipe${I.dir}</a>
    </header>
    <ul class="eq-grade">${C.equipe.map((p, i) => `<li class="eq" data-rv style="--d:${i * 80}ms">
      <figure>${foto(p.foto, { alt: `${p.nome}, ${p.area}` })}<figcaption>${p.area}</figcaption></figure>
      <h3>${p.nome}</h3><p class="eq-cro">${p.cro}</p><p>${p.bio}</p>
    </li>`).join('')}</ul>
  </div>
</section>`;

// ---------- a clínica (seção escura) com faixa de fotos ----------
const K = C.clinica;
const faixa = K.fotos.map(([f, l]) => `<li><figure>${foto(f)}<figcaption>${l}</figcaption></figure></li>`).join('');
const clinica = `<section class="sec clinica" id="clinica">
  <div class="caixa cl-grade">
    <div class="cl-txt" data-rv>
      <p class="apoio">Por dentro da Lume</p>
      ${tit(K.titulo)}
      <p class="sec-lead">${K.texto}</p>
      <dl class="cl-itens">${K.itens.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
    </div>
    <div class="cl-mosaico">
      <figure class="m1" data-rv>${foto('sala-laranja')}</figure>
      <figure class="m2" data-rv style="--d:120ms">${foto('corredor')}</figure>
    </div>
  </div>
  <div class="faixa" data-faixa aria-label="Fotos da clínica"><ul>${faixa}</ul><ul aria-hidden="true">${faixa.replace(/alt="[^"]*"/g, 'alt=""')}</ul></div>
</section>`;

// ---------- dúvidas ----------
const faq = `<section class="sec faq" id="faq">
  <div class="caixa faq-grade">
    <div class="faq-lado" data-rv>
      <p class="apoio">Perguntas de quem vem pela primeira vez</p>
      ${tit(['Dúvidas, respondidas', 'com calma.'])}
      <p class="sec-lead">Não achou a sua? Ligue para <a href="tel:${M.telefoneLink}">${M.telefone}</a> ou chame no WhatsApp.</p>
      <figure class="faq-foto">${foto('cadeira-sorriso', { pos: '50% 30%' })}</figure>
    </div>
    <ul class="faq-lista" data-rv style="--d:100ms">${C.faq.map(([q, r], i) => `<li class="${i === 0 ? 'aberta' : ''}"><h3><button type="button" aria-expanded="${i === 0}" aria-controls="faq-${i}" id="faq-b${i}" data-faq>${q}<span class="faq-ic">${I.mais}</span></button></h3><div class="faq-r" id="faq-${i}" role="region" aria-labelledby="faq-b${i}"><div><p>${r}</p></div></div></li>`).join('')}</ul>
  </div>
</section>`;

// ---------- agendamento ----------
const A = C.agendar;
const agendar = `<section class="sec agendar" id="agendar">
  <div class="caixa ag-grade">
    <div class="ag-cartao" data-rv>
      ${foto('retrato-sorriso', { cls: 'ag-foto', pos: '50% 25%' })}
      <div class="ag-txt">
        <p class="apoio">Um primeiro passo tranquilo</p>
        ${tit(A.titulo)}
        <p>${A.texto}</p>
        <dl>
          <div><dt>Ligue</dt><dd><a href="tel:${M.telefoneLink}">${M.telefone}</a></dd></div>
          <div><dt>WhatsApp</dt><dd><a href="${waAgendar}" target="_blank" rel="noopener">${M.whatsappTexto}</a></dd></div>
          <div><dt>Visite</dt><dd>${M.rua}, ${M.bairro}<br>${C.horarioTexto.join('<br>')}</dd></div>
        </dl>
      </div>
    </div>
    <form class="form" data-form novalidate data-rv style="--d:100ms">
      <h3>Pedir uma avaliação</h3>
      <p class="form-sub">Campos com asterisco são obrigatórios.</p>
      <div class="campo"><label for="f-nome">Nome *</label><input id="f-nome" name="nome" autocomplete="name" required placeholder="Como podemos chamar você?"><small class="erro">Conte seu nome para a recepção.</small></div>
      <div class="campo"><label for="f-tel">WhatsApp *</label><input id="f-tel" name="tel" type="tel" inputmode="tel" autocomplete="tel" required placeholder="(31) 90000-0000" data-mascara><small class="erro">Informe um número com DDD.</small></div>
      <div class="campo largo"><label for="f-trat">Tratamento</label><select id="f-trat" name="trat"><option value="">Ainda não sei, quero uma avaliação</option>${C.tratamentos.map((t) => `<option>${t.nome}</option>`).join('')}<option>Urgência</option></select></div>
      <fieldset class="campo largo"><legend>Melhor período</legend><div class="periodos">${['Manhã', 'Tarde', 'Fim do dia', 'Tanto faz'].map((p, i) => `<label class="per"><input type="radio" name="periodo" value="${p}"${i === 3 ? ' checked' : ''}><span>${p}</span></label>`).join('')}</div></fieldset>
      <div class="campo largo"><label for="f-msg">Mensagem</label><textarea id="f-msg" name="msg" rows="3" placeholder="Conte o que está incomodando ou o que você quer mudar"></textarea></div>
      <label class="aceite largo"><input type="checkbox" name="aceite" required><span>Concordo que a ${M.completo} use estes dados para falar comigo, conforme a LGPD. *</span><small class="erro">Precisamos do seu consentimento para responder.</small></label>
      <button class="btn btn-argila largo" type="submit">${I.conversa}Enviar pelo WhatsApp</button>
      <div class="form-ok" data-form-ok hidden tabindex="-1">${marcaSvg('ok-svg')}<h3>Pedido pronto, <span data-ok-nome></span>.</h3><p>Abrimos o WhatsApp da clínica com a sua mensagem. É só tocar em enviar. Se a janela não abriu, <a data-ok-wa href="#" target="_blank" rel="noopener">clique aqui</a>.</p><button type="button" class="btn btn-linha" data-form-novo>Enviar outro pedido</button></div>
    </form>
  </div>
</section>`;

// ---------- rodapé ----------
const rodape = `<footer class="rodape">
  <div class="caixa">
    <div class="rod-topo">
      <div class="rod-marca">
        <a class="logo" href="#inicio" aria-label="${M.completo}, início">${logo}</a>
        <p>Odontologia com tempo para ouvir, na Savassi.</p>
        <div class="redes"><a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a><a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a><a href="${waAgendar}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.conversa}</a></div>
      </div>
      <div class="rod-cols">
        <div><h3>Explore</h3><ul>${nav.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ul></div>
        <div><h3>Contato</h3><ul><li><a href="tel:${M.telefoneLink}">${M.telefone}</a></li><li><a href="${waAgendar}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li><li><a href="mailto:${M.email}">${M.email}</a></li></ul></div>
        <div><h3>Horário</h3><ul>${C.horarioTexto.map((h) => `<li>${h}</li>`).join('')}<li>Domingo e feriados, fechado</li></ul></div>
      </div>
    </div>
    <div class="mapa-linha" id="onde">
      <div class="map-box">
        <img src="assets/img/mapa_savassi.webp" alt="Mapa da ${M.bairro}, ${M.cidade}, com a localização da ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"></span>
        <div class="map-info"><b>${M.completo}</b><span>${endereco}, CEP ${M.cep}</span><span>${C.horarioTexto.join('. ')}</span>
          <div class="mbtns"><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Atendimento na clínica, com hora marcada. Recebemos pacientes destes bairros e de toda Belo Horizonte.</p>
        <ul class="bairros" data-iguais>${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="rod-base">
      <p>© <span data-ano>2026</span> ${M.completo}. ${M.razao}, CNPJ ${M.cnpj}. Responsável técnica: ${M.responsavel}.</p>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditos.map((c) => `<li>${c.arq}: ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener">${esc(c.autor)}</a>, ${c.fonte}` : esc(c.autor)}</li>`).join('')}</ul></details>
    </div>
  </div>
  <p class="rod-gigante" aria-hidden="true">${M.nome} <em>${M.sub}</em></p>
</footer>`;

const dados = { wa: M.whatsapp, marca: M.completo, horario: C.horario, casos: C.casos.map(({ id, nome, titulo, texto, dados: d }) => ({ id, nome, titulo, texto, dados: d })) };

const head = (titulo, desc) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#F5F0EA">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" stroke="#A65A3A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4.2v3.6M10.6 7.6l2.3 2.6M29.4 7.6l-2.3 2.6"/><path d="${DENTE}"/></svg>`)}">
${temaCedo}
${fontes}`;

const html = `${head(`${M.completo} | Dentista na ${M.bairro}, ${M.cidade}`, `${M.completo}: clareamento, alinhadores, implantes, lentes de contato, próteses e odontopediatria na ${M.bairro}, ${M.cidade}. Plano por escrito e urgência no mesmo dia.`)}
<link rel="preload" as="image" href="assets/img/hero.webp">
<link rel="stylesheet" href="assets/site.css">
</head>
<body>
${topo}
<main id="conteudo">
${hero}
${tratamentos}
${resultados}
${procedimentos}
${equipe}
${clinica}
${faq}
${agendar}
</main>
${rodape}
<a class="wa-fixo" href="${waAgendar}" target="_blank" rel="noopener" aria-label="Agendar pelo WhatsApp">${I.conversa}<span>Agendar pelo WhatsApp</span></a>
<script id="dados" type="application/json">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>
<script src="assets/site.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'index.html'), html);

// ---------- 404: arquivo único, funciona em qualquer endereço ----------
// O zero do "404" é o dente da marca, cuja luz tenta acender e falha: "A luz não chegou até aqui."
const css404 = `:root{--fundo:#F5F0EA;--sup:#FFFDFA;--tinta:#201C19;--texto:#4D4540;--suave:#7E736A;--argila:#A65A3A;--argila-txt:#FFF8F2;--linha:rgba(32,28,25,.14)}
:root[data-tema="escuro"]{--fundo:#15120F;--sup:#1E1A17;--tinta:#F4ECE3;--texto:#CCC1B6;--suave:#998D82;--argila:#DE9170;--argila-txt:#24130B;--linha:rgba(244,236,227,.14)}
*{box-sizing:border-box;margin:0}html{color-scheme:light}:root[data-tema="escuro"]{color-scheme:dark}
body{min-height:100vh;min-height:100svh;display:grid;place-items:center;background:var(--fundo);color:var(--texto);font:400 17px/1.6 "Libre Franklin",Georgia,sans-serif;padding:32px 16px;overflow-x:hidden}
.c404{width:min(680px,100%);text-align:center;display:grid;justify-items:center;gap:18px}
.logo{display:inline-flex;align-items:center;gap:10px;color:var(--tinta);text-decoration:none;font:400 26px/1 Petrona,Georgia,serif}
.logo small{font:500 11px/1 "Libre Franklin",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--suave);margin-left:6px}
svg{fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.logo svg{width:32px;height:32px;color:var(--argila)}
.num{display:flex;align-items:center;justify-content:center;gap:clamp(4px,2vw,14px);font:300 clamp(110px,26vw,220px)/.9 Petrona,Georgia,serif;color:var(--tinta);letter-spacing:-.04em;margin:clamp(24px,6vw,56px) 0 4px}
.zero{width:.78em;height:.9em;color:var(--tinta)}
.zero .raios{stroke:var(--argila);stroke-width:1.4;animation:pisca 3.6s infinite}
@keyframes pisca{0%,18%,24%,46%,100%{opacity:.12}20%,22%,48%,60%{opacity:1}}
.cod{font:500 12px/1 "Libre Franklin",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--argila)}
h1{font:400 clamp(34px,6vw,56px)/1.05 Petrona,Georgia,serif;color:var(--tinta);letter-spacing:-.02em;text-wrap:balance}
h1 em{color:var(--argila)}
p.txt{max-width:44ch;text-wrap:pretty}
.btns{display:inline-grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:10px;margin-top:10px}
.btn{display:inline-flex;align-items:center;justify-content:center;height:50px;padding:0 24px;border-radius:12px;font:500 15px/1 "Libre Franklin",sans-serif;text-decoration:none;white-space:nowrap;transition:transform .3s,background-color .3s}
.btn:hover{transform:translateY(-2px)}
.b1{background:var(--argila);color:var(--argila-txt)}.b2{border:1px solid var(--linha);color:var(--tinta);background:var(--sup)}
@media (max-width:520px){.btns{grid-auto-flow:row;width:100%}}
@media (prefers-reduced-motion:reduce){.zero .raios{animation:none;opacity:.5}}`;
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
  <a class="logo" href="/">${marcaSvg('')}${M.nome}<small>${M.sub}</small></a>
  <p class="num" aria-label="404"><span>4</span>${marcaSvg('zero')}<span>4</span></p>
  <p class="cod">Página não encontrada</p>
  <h1>A luz não chegou <em>até aqui.</em></h1>
  <p class="txt">O endereço que você abriu não existe mais ou mudou de lugar. O resto do site continua aceso.</p>
  <div class="btns"><a class="btn b1" href="./">Voltar ao início</a><a class="btn b2" href="${wa('Olá! Tentei abrir uma página do site e não encontrei. Podem me ajudar?')}" target="_blank" rel="noopener">Falar no WhatsApp</a></div>
</main>
<script>var b=location.pathname.replace(/[^/]*$/,'')||'/';document.querySelector('.logo').href=b;document.querySelector('.b1').href=b;</script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, '404.html'), html404);

if (faltando.length) console.warn('FOTOS FALTANDO:', [...new Set(faltando)].join(', '));
console.log('ok', path.relative(process.cwd(), OUT), Math.round(html.length / 1024) + 'k');
