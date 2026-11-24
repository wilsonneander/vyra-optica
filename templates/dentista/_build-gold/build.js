// Gera o Gold de odontologia (Sorrisus Prime) em "templates/dentista/gold/".
// A página abre na fachada enviada pelo cliente; a rolagem aproxima a câmera da vidraça da recepção,
// atravessa o vidro e entra na clínica (GSAP + ScrollTrigger, sem cortes). Depois: dentista, tratamentos,
// estrutura em galeria horizontal, primeira visita, depoimentos autorizados, agendamento e rodapé com mapa.
// Uso: node templates/dentista/_build-gold/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');

const OUT = path.join(__dirname, '..', 'gold');
const FOTOS = path.join(__dirname, 'img', 'fotos');
const M = C.marca;
const D = C.dentista;

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${M.rua}, ${M.bairro}, ${M.cidade}`)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
// título com palavras separadas para subirem uma a uma; trecho entre * vira itálico
const palavras = (t) => t.split(/(\*[^*]+\*)/).filter(Boolean).map((parte) => {
  const it = parte.startsWith('*');
  return parte.replace(/\*/g, '').trim().split(/\s+/).map((w) => `<span class="pa"><span${it ? ' class="it"' : ''}>${esc(w)}</span></span>`).join(' ');
}).join(' ');

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets', 'vendor'), { recursive: true });
for (const f of fs.readdirSync(FOTOS)) fs.copyFileSync(path.join(FOTOS, f), path.join(OUT, 'assets', 'img', f));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_jardins.webp'), path.join(OUT, 'assets', 'img', 'mapa_jardins.webp'));
for (const f of ['gsap.min.js', 'ScrollTrigger.min.js']) fs.copyFileSync(path.join(__dirname, 'vendor', f), path.join(OUT, 'assets', 'vendor', f));
fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(OUT, 'assets', 'site.css'));
fs.copyFileSync(path.join(__dirname, 'app.js'), path.join(OUT, 'assets', 'site.js'));

const faltando = [];
const foto = (nome, { cls = '', lazy = true, alt } = {}) => {
  if (!fs.existsSync(path.join(FOTOS, `${nome}.webp`))) faltando.push(nome);
  return `<img class="${cls}" src="assets/img/${nome}.webp" alt="${esc(alt ?? C.fotos[nome] ?? nome)}"${lazy ? ' loading="lazy" decoding="async"' : ' decoding="async"'}>`;
};
const creditos = JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'creditos.json'), 'utf8'));

// ---------- desenhos próprios (traço fino, cantos arredondados, como o letreiro da fachada) ----------
const dente = (cls = '') => `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 15C26 8.5 14.5 9 11.6 18.6 9 27.5 14.4 35.4 16.2 45.5 17.3 52 19 57.6 22.2 57.6 26 57.6 26.2 46.4 32 44.2 37.8 46.4 38 57.6 41.8 57.6 45 57.6 46.7 52 47.8 45.5 49.6 35.4 55 27.5 52.4 18.6 49.5 9 38 8.5 32 15Z"/><path d="M21.5 41.5C28.5 37.5 36.5 30 44.5 21"/><path d="M38.6 22.2 45.6 19.6 43.6 26.4"/></svg>`;
const logo = `<span class="logo-marca">${dente('logo-dente')}<span class="logo-txt"><b>${M.nome}</b><small>${M.sub}</small></span></span>`;
const I = {
  seta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6.5 18.5 12 13 17.5"/></svg>',
  pino: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.5s-6.5-6.2-6.5-11.3a6.5 6.5 0 0 1 13 0c0 5.1-6.5 11.3-6.5 11.3Z"/><path d="M9.6 10.2c.8 1.1 4 1.1 4.8 0"/></svg>',
  // balão de conversa com um sorriso dentro (WhatsApp, desenhado na marca)
  conversa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 18.8 5.6 15A8 8 0 1 1 9 18.4Z"/><path d="M8.8 11.6c1.6 2 4.8 2 6.4 0"/></svg>',
  fone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3.8 9.6 4.4l1.1 4-1.9 1.5a11 11 0 0 0 5.3 5.3l1.5-1.9 4 1.1.6 2.4c-.6 1.8-2.2 2.9-4 2.6A14.6 14.6 0 0 1 4.6 7.8c-.3-1.8.8-3.4 2.6-4Z"/></svg>',
  aspas: '<svg class="aspas" viewBox="0 0 80 60" aria-hidden="true"><path d="M8 52c0-18 6-32 24-42M44 52c0-18 6-32 24-42"/><path d="M8 52c6 0 12-4 12-10s-5-10-11-10M44 52c6 0 12-4 12-10s-5-10-11-10"/></svg>',
  estrela: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 14.6 9l6.2.6-4.7 4.1 1.4 6.1L12 16.6l-5.5 3.2 1.4-6.1-4.7-4.1L9.4 9Z"/></svg>',
  // ícones da seção "A diferença": xícara (consulta sem pressa), dente sob varredura, plano assinado, sorriso na tela
  cafe: '<svg class="dif-ic" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 13h16v6.5A6.5 6.5 0 0 1 15.5 26h-3A6.5 6.5 0 0 1 6 19.5Z"/><path d="M22 15h2a3 3 0 0 1 0 6h-2.4"/><path d="M11 4.5c-.9 1.4.9 2.6 0 4.2M16 4.5c-.9 1.4.9 2.6 0 4.2"/></svg>',
  scanner: '<svg class="dif-ic" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 8.6c-2.6-2.6-7.4-2.2-8.4 1.9-1 3.9 1.3 7.2 2 11.4.5 2.8 1.2 5 2.5 5 1.7 0 1.8-4.6 3.9-5.4 2.1.8 2.2 5.4 3.9 5.4 1.3 0 2-2.2 2.5-5 .7-4.2 3-7.5 2-11.4-1-4.1-5.8-4.5-8.4-1.9Z"/><path d="M3.5 15.5h25"/><path d="M4 6V3.5h3M28 6V3.5h-3M4 26v2.5h3M28 26v2.5h-3"/></svg>',
  plano: '<svg class="dif-ic" viewBox="0 0 32 32" aria-hidden="true"><path d="M8 4h11l5 5v19H8Z"/><path d="M19 4v5h5M12 14h8M12 18h8"/><path d="M12 24c1.2-2 2.4-2 3.4 0s2.2 2 3.6-.4"/></svg>',
  sorriso: '<svg class="dif-ic" viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="5" width="24" height="16" rx="1.5"/><path d="M10 11.5c3 3.6 9 3.6 12 0M10.8 13.2h10.4"/><path d="M12.5 27h7M16 21v6"/></svg>',
};
// indicação de rolagem: um arco de porta com uma linha que desce por dentro
const rolarSvg = '<svg class="rolar-arco" viewBox="0 0 30 46" aria-hidden="true"><path d="M3 45V15a12 12 0 0 1 24 0v30"/><path class="rolar-linha" d="M15 13v12"/></svg>';

// ---------- abajur do tema: o pendente cúbico da recepção, pendurado no topo ----------
const abajur = `<button type="button" class="abajur" data-abajur aria-pressed="false" aria-label="Apagar a luz (tema escuro)">
      <svg viewBox="0 0 40 76" aria-hidden="true">
        <defs><radialGradient id="ab-brilho"><stop offset="0" stop-color="#FFE2A8" stop-opacity=".75"/><stop offset="1" stop-color="#FFE2A8" stop-opacity="0"/></radialGradient></defs>
        <circle class="ab-luz" cx="20" cy="62" r="24" fill="url(#ab-brilho)"/>
        <path class="ab-fio" d="M20 -40V46"/>
        <path class="ab-face" d="M8 52 20 58V72L8 66Z"/><path class="ab-face ab-face-2" d="M20 58 32 52V66L20 72Z"/>
        <path class="ab-cubo" d="M20 46 32 52V66L20 72 8 66V52ZM8 52 20 58 32 52M20 58V72"/>
      </svg>
      <span class="abajur-dica" aria-hidden="true">Apagar</span>
    </button>`;
// aplica o tema salvo (ou o do sistema) antes de pintar, e decide se a tela de carregamento aparece (uma vez por visita)
const temaCedo = (comCarregando) => `<script>(function(){var r=document.documentElement;r.classList.add('js');var t=null;try{t=localStorage.getItem('sorrisus-tema')}catch(e){}if(!t&&matchMedia('(prefers-color-scheme: dark)').matches)t='escuro';if(t==='escuro')r.dataset.tema='escuro';${comCarregando ? "var v=null;try{v=sessionStorage.getItem('sorrisus-cg')}catch(e){}if(!v)r.classList.add('carregando-on');" : ''}})();</script>`;

// ---------- topo ----------
const nav = [['dentista', 'A dentista'], ['tratamentos', 'Tratamentos'], ['clinica', 'A clínica'], ['pacientes', 'Avaliações'], ['faq', 'Dúvidas'], ['contato', 'Contato']];
const topo = `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo" data-sobre-foto>
  <div class="topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, início">${logo}</a>
    <nav class="menu" id="menu" aria-label="Principal">
      ${nav.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('\n      ')}
      <a class="btn btn-ouro menu-agendar" href="#agendar">Agendar avaliação</a>
    </nav>
    ${abajur}
    <a class="btn btn-linha topo-agendar" href="#agendar">Agendar avaliação</a>
    <button type="button" class="menu-btn" aria-controls="menu" aria-expanded="false" aria-label="Abrir o menu"><span></span><span></span></button>
  </div>
</header>`;

// ---------- 1. fachada e entrada ----------
const entrada = `<section class="entrada" id="inicio" aria-label="Fachada da clínica">
  <div class="palco">
    <div class="fundo-borrado" aria-hidden="true"></div>
    <div class="fachada">${foto('fachada', { lazy: false })}</div>
    <div class="dentro" aria-hidden="true">
      <div class="dentro-img">
        <img src="assets/img/recepcao.webp" alt="" decoding="async">
        <div class="placa">${dente('placa-dente')}<b>${M.nome}</b><small>${M.sub}</small></div>
      </div>
      <div class="reflexo"></div>
    </div>
    <div class="veu" aria-hidden="true"></div>
    <div class="entrada-txt">
      <p class="sobre">${M.nome}, ${M.sub.toLowerCase()} nos Jardins</p>
      <h1>${palavras(C.chamada.replace('odontologia', '*odontologia*'))}</h1>
      <p class="apoio">${C.apoio}</p>
    </div>
    <a class="rolar" href="#dentista" aria-label="Rolar para entrar na clínica">${rolarSvg}<span>Role para entrar</span></a>
    <div class="bemvindo" aria-hidden="true"><p class="bv-1">${palavras(C.bemvindo[0])}</p><p class="bv-2">${C.bemvindo[1]}</p></div>
  </div>
</section>`;

// ---------- 2. o dentista ----------
const dentista = `<section class="dentista" id="dentista">
  <div class="dent-grade">
    <figure class="dent-foto revela">${foto(D.foto)}<figcaption>${D.nome}<br>${D.cro}</figcaption></figure>
    <div class="dent-txt">
      <p class="rotulo">Quem cuida do seu sorriso</p>
      <h2 class="titulo">${palavras(D.nome)}</h2>
      <p class="dent-esp">${D.titulo}. <em>${D.especialidade}</em>.</p>
      <p class="dent-resumo">${D.resumo}</p>
      <blockquote class="filosofia"><p>${D.filosofia}</p></blockquote>
    </div>
  </div>
  <div class="dent-sub">
    <div class="formacao">
      <h3>Formação</h3>
      <ol class="anos">${D.formacao.map(([a, t]) => `<li><time>${a}</time><span>${t}</span></li>`).join('')}</ol>
    </div>
    <div class="exper">
      <h3>Experiência</h3>
      ${D.experiencia.map(([t, x]) => `<div class="exp"><h4>${t}</h4><p>${x}</p></div>`).join('')}
    </div>
  </div>
</section>`;

// ---------- 2b. a diferença: foto da consulta com os números, e o que muda no atendimento ----------
const DF = C.diferenca;
const diferenca = `<section class="diferenca" aria-labelledby="dif-t">
  <div class="dif-grade">
    <div class="dif-midia">
      <figure class="dif-foto revela">${foto(DF.foto)}</figure>
      <div class="dif-numeros">${DF.numeros.map(([n, u, t]) => `<div><b><span data-conta="${n}">${n}</span> ${u}</b><span>${t}</span></div>`).join('')}</div>
    </div>
    <div class="dif-txt">
      <p class="rotulo">A diferença</p>
      <h2 class="titulo" id="dif-t">${palavras(DF.titulo)}</h2>
      <p class="dif-intro">${DF.texto}</p>
      <ul class="dif-lista">${C.diferenciais.map(([t, x, ic]) => `<li>${I[ic]}<div><b>${t}</b><span>${x}</span></div></li>`).join('')}</ul>
    </div>
  </div>
</section>`;

// ---------- 3. tratamentos: cartões em duas colunas desencontradas, com antes e depois arrastável ----------
const alca = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 7.5 5 12l4.5 4.5M14.5 7.5 19 12l-4.5 4.5"/></svg>';
const midia = (t) => (t.ad
  ? `<div class="ad" data-ad tabindex="0" role="slider" aria-label="Comparar antes e depois: ${t.nome.toLowerCase()}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" style="--corte:50%">
        ${foto(`${t.ad}-depois`, { cls: 'ad-depois', alt: `Depois: ${t.nome.toLowerCase()}, simulação ilustrativa` })}
        ${foto(`${t.ad}-antes`, { cls: 'ad-antes', alt: `Antes: ${t.nome.toLowerCase()}, simulação ilustrativa` })}
        <span class="ad-linha" aria-hidden="true"><span class="ad-alca">${alca}</span></span>
        <span class="ad-rot ad-rot-antes" aria-hidden="true">Antes</span><span class="ad-rot ad-rot-depois" aria-hidden="true">Depois</span>
        <span class="ad-aviso">Simulação ilustrativa</span>
      </div>`
  : `<figure class="tc-foto revela">${foto(t.foto)}</figure>`);
const cartao = (t, i) => `<article class="tc${t.alto ? ' tc-alto' : ''}${t.ad ? ' tc-ad' : ''}" id="t-${t.id}" style="order:${i}">
      <div class="tc-midia">${midia(t)}</div>
      <div class="tc-txt">
        <h3>${t.nome}</h3>
        <p class="tc-frase">${t.frase}</p>
        <p>${t.texto}</p>
        <div class="tc-pe"><span class="tc-tempo">${t.tempo}</span><a class="link-seta" href="${wa(`Olá! Gostaria de agendar uma avaliação para ${t.nome.toLowerCase()} na ${M.nome}.`)}" target="_blank" rel="noopener">Agendar${I.seta}</a></div>
      </div>
    </article>`;
const tratamentos = `<section class="tratamentos" id="tratamentos">
  <header class="tc-cab">
    <p class="rotulo">Tratamentos</p>
    <h2 class="titulo">${palavras('Cada sorriso pede *um caminho*')}</h2>
    <p>Da restauração do dia a dia à transformação completa do sorriso. Arraste a linha das fotos e compare o antes e o depois.</p>
  </header>
  <div class="tc-grade">
    <div class="tc-col">${C.tratamentos.map((t, i) => (i % 2 ? '' : cartao(t, i))).join('')}</div>
    <div class="tc-col tc-col-2">${C.tratamentos.map((t, i) => (i % 2 ? cartao(t, i) : '')).join('')}</div>
  </div>
</section>`;

// ---------- 4. estrutura (galeria horizontal) e primeira visita ----------
const clinica = `<section class="clinica" id="clinica">
  <div class="cl-pino">
    <header class="cl-cab">
      <p class="rotulo">Estrutura e experiência</p>
      <h2 class="titulo">${palavras('Uma casa pensada *do vidro ao instrumento*')}</h2>
      <p>Arraste a página e percorra os ambientes da clínica.</p>
    </header>
    <div class="cl-trilho">
      ${C.estrutura.map((e, i) => `<figure class="cl-quadro cl-q${i % 3}">${foto(e.foto)}<figcaption><b>${e.titulo}</b><span>${e.texto}</span></figcaption></figure>`).join('\n      ')}
    </div>
    <div class="cl-barra" aria-hidden="true"><i></i></div>
  </div>
</section>
<section class="visita" aria-labelledby="visita-t">
  <h2 class="titulo" id="visita-t">${palavras('Como é a *primeira visita*')}</h2>
  <ol class="caminho">${C.experiencia.map(([t, x]) => `<li><h3>${t}</h3><p>${x}</p></li>`).join('')}</ol>
</section>`;

// ---------- 5. depoimentos e resultados (sem inventar nada) ----------
const pacientes = `<section class="pacientes" id="pacientes">
  <header class="sec-cab">
    <p class="rotulo">Depoimentos e resultados</p>
    <h2 class="titulo">${palavras('A palavra é *de quem senta na cadeira*')}</h2>
    <p>Quem passou pela cadeira conta como foi, do primeiro contato ao retorno.</p>
  </header>
  <div class="av-carrossel" data-carrossel>
    <div class="av-trilho" tabindex="0" aria-label="Avaliações de pacientes">
      ${C.avaliacoes.map((a) => `<figure class="av">
        ${I.aspas}
        <div class="av-estrelas" role="img" aria-label="Nota 5 de 5">${I.estrela.repeat(5)}</div>
        <blockquote><p>${a.texto}</p></blockquote>
        <figcaption>${foto(a.foto, { cls: 'av-foto', alt: `Foto de ${a.nome}` })}<span><b>${a.nome}</b><small>${a.trat}, ${a.quando}</small></span></figcaption>
      </figure>`).join('\n      ')}
    </div>
    <div class="av-ctrl">
      <div class="av-barra" aria-hidden="true"><i></i></div>
      <div class="av-btns"><button type="button" data-av="-1" aria-label="Avaliação anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H6M11 6.5 5.5 12l5.5 5.5"/></svg></button><button type="button" data-av="1" aria-label="Próxima avaliação">${I.seta}</button></div>
    </div>
    <p class="av-nota">Relatos de exemplo deste modelo. Na versão da clínica entram só depoimentos reais, publicados com autorização por escrito do paciente.</p>
  </div>
  <div class="resultados">
    <div class="res-google">
      <h3>Avaliações no Google</h3>
      <p>Nota e número de avaliações do perfil da clínica: <b>[preencher com o perfil real]</b>.</p>
      <a class="btn btn-linha-escura" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${M.nome} ${M.cidade}`)}" target="_blank" rel="noopener">Ver no Google</a>
    </div>
    <div class="res-casos">
      <h3>Casos clínicos</h3>
      <p>As comparações de antes e depois deste modelo são simulações ilustrativas. Na versão da clínica, só entram casos reais com o termo de autorização assinado pelo paciente, seguindo o Código de Ética Odontológica. Nenhum resultado é garantido: cada caso responde de um jeito, e isso é explicado na avaliação.</p>
    </div>
  </div>
</section>`;

// ---------- 5b. dúvidas frequentes ----------
const faq = `<section class="faq" id="faq">
  <div class="faq-grade">
    <div class="faq-cab">
      <p class="rotulo">Dúvidas frequentes</p>
      <h2 class="titulo">${palavras('Antes de *marcar*')}</h2>
      <p>Não encontrou a sua pergunta? A recepção responde pelo WhatsApp.</p>
      <a class="link-seta" href="${wa(`Olá! Tenho uma dúvida sobre os tratamentos da ${M.nome}.`)}" target="_blank" rel="noopener">Perguntar no WhatsApp${I.seta}</a>
    </div>
    <div class="faq-lista">
      ${C.faq.map(([p, r]) => `<details><summary><span>${p}</span><i aria-hidden="true"></i></summary><div class="faq-r"><p>${r}</p></div></details>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- 6. contato e agendamento ----------
const dias = C.horarios.map(([d, h]) => `<tr><th scope="row">${d}</th><td>${h}</td></tr>`).join('');
const agendar = `<section class="agendar" id="agendar">
  <div class="ag-grade">
    <div class="ag-txt">
      <p class="rotulo">Contato e agendamento</p>
      <h2 class="titulo">${palavras('A porta está *aberta*')}</h2>
      <p>Conte o que você procura e escolha o melhor período. A recepção confirma o horário pelo WhatsApp.</p>
      <dl class="ag-dados">
        <div><dt>Endereço</dt><dd>${M.endereco}<br>${M.bairro}, ${M.cidade}, ${M.uf}<br>CEP ${M.cep}</dd></div>
        <div><dt>WhatsApp</dt><dd><a href="${wa(`Olá! Gostaria de agendar uma avaliação na ${M.nome}.`)}" target="_blank" rel="noopener">${M.whatsappTexto}</a></dd></div>
        <div><dt>Telefone</dt><dd><a href="tel:${M.telefoneLink}">${M.telefone}</a></dd></div>
        <div><dt>Horários</dt><dd><table class="horas">${dias}</table></dd></div>
      </dl>
    </div>
    <form class="ag-form" data-agenda novalidate>
      <label class="campo"><span>Seu nome</span><input name="nome" autocomplete="name" required></label>
      <label class="campo"><span>WhatsApp</span><input name="fone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(11) 90000-0000" required></label>
      <label class="campo"><span>O que você procura</span><select name="trat">
        <option value="">Ainda não sei, quero uma avaliação</option>
        ${C.tratamentos.map((t) => `<option>${t.nome}</option>`).join('')}
      </select></label>
      <fieldset class="periodos"><legend>Melhor período</legend>
        <div class="per-grupo" data-iguais>${['Manhã', 'Tarde', 'Noite', 'Sábado'].map((p, i) => `<label><input type="radio" name="periodo" value="${p}"${i ? '' : ' checked'}><span>${p}</span></label>`).join('')}</div>
      </fieldset>
      <label class="campo"><span>Mensagem (opcional)</span><textarea name="msg" rows="3" placeholder="Conte um pouco do que incomoda ou do que você quer mudar"></textarea></label>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Autorizo a ${M.nome} a usar estes dados só para responder este pedido, conforme a Lei Geral de Proteção de Dados.</span></label>
      <p class="ag-erro" role="alert"></p>
      <button class="btn btn-ouro ag-enviar" type="submit">${I.conversa}Pedir horário pelo WhatsApp</button>
    </form>
  </div>
</section>`;

// ---------- rodapé com o mapa padrão ----------
const rodape = `<footer class="rodape" id="contato">
  <div class="rodape-in">
    <div class="mapa-linha">
      <div class="map-box">
        <img src="assets/img/mapa_jardins.webp" alt="Mapa do ${M.bairro}, ${M.cidade}, com a localização da ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"></span>
        <div class="map-info"><b>${M.completo}</b><span>${endereco}, CEP ${M.cep}</span><span>Seg a sex, 8h às 20h. Sábado, 8h às 13h</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Só na clínica, com hora marcada. Recebemos pacientes destes bairros e de toda a cidade.</p>
        <ul class="bairros" data-iguais>${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="rodape-cols">
      <div class="r-marca"><a class="logo" href="#inicio" aria-label="${M.completo}, início">${logo}</a><p>Seu sorriso, nossa prioridade.</p></div>
      <div><h3>Contato</h3><p><a href="${wa(`Olá! Gostaria de falar com a ${M.nome}.`)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a><br><a href="tel:${M.telefoneLink}">Telefone ${M.telefone}</a><br><a href="mailto:${M.email}">${M.email}</a></p></div>
      <div><h3>Redes</h3><p><a href="${M.instagram}" target="_blank" rel="noopener">Instagram</a><br><a href="${M.facebook}" target="_blank" rel="noopener">Facebook</a><br><a href="${M.linkedin}" target="_blank" rel="noopener">LinkedIn</a></p></div>
      <div><h3>Responsável técnico</h3><p>${D.nome}<br>${D.cro}</p></div>
    </div>
    <div class="legal">
      <p>${M.razao}, CNPJ ${M.cnpj}. ${endereco}, CEP ${M.cep}.</p>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditos.map((c) => `<li>${c.arq}: ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener">${esc(c.autor)}</a>, ${c.fonte}` : esc(c.autor)}</li>`).join('')}</ul></details>
    </div>
  </div>
</footer>
<a class="whats-flutua" href="${wa(`Olá! Gostaria de agendar uma avaliação na ${M.nome}.`)}" target="_blank" rel="noopener" aria-label="Conversar pelo WhatsApp">${I.conversa}</a>`;

// ---------- SEO local ----------
const ld = {
  '@context': 'https://schema.org', '@type': 'Dentist', name: M.completo, telephone: M.telefone, email: M.email,
  image: 'assets/img/fachada.webp',
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  openingHours: ['Mo-Fr 08:00-20:00', 'Sa 08:00-13:00'],
  employee: { '@type': 'Person', name: D.nome, jobTitle: D.especialidade },
};

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${M.nome}, odontologia avançada nos Jardins, São Paulo</title>
<meta name="description" content="${esc(`Implantes, lentes de contato dental, clareamento, ortodontia e harmonização orofacial com planejamento digital. ${M.endereco}, ${M.bairro}, ${M.cidade}.`)}">
<meta name="theme-color" content="#1C1915">
<meta property="og:title" content="${M.completo}">
<meta property="og:description" content="${esc(C.chamada)}">
<meta property="og:image" content="assets/img/fachada.webp">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1C1915"/><g fill="none" stroke="#D8C3A0" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">${dente().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g></svg>`)}">
<link rel="preload" as="image" href="assets/img/fachada.webp" fetchpriority="high">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital@1&family=Gantari:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css">
${temaCedo(true)}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<div class="carregando" aria-hidden="true">
  <span class="cg-porta cg-esq"></span><span class="cg-porta cg-dir"></span>
  <div class="cg-centro">${dente('cg-dente').replace(/<path /g, '<path pathLength="1" ')}<b>${M.nome}</b><small>${M.sub}</small><span class="cg-barra"><i></i></span><span class="cg-txt">Abrindo a recepção</span></div>
</div>
${topo}
<main id="conteudo">
${entrada}
${dentista}
${diferenca}
${tratamentos}
${clinica}
${pacientes}
${faq}
${agendar}
</main>
${rodape}
<script type="application/json" id="dados">${JSON.stringify({ whatsapp: M.whatsapp, nome: M.nome })}</script>
<script src="assets/vendor/gsap.min.js"></script>
<script src="assets/vendor/ScrollTrigger.min.js"></script>
<script src="assets/site.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\n');

// ---------- 404: a porta que não abre. Página inteira em um arquivo, para funcionar em qualquer endereço ----------
const p404 = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página não encontrada, ${M.nome}</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#1C1915">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital@1&family=Gantari:wght@400;500&display=swap" rel="stylesheet">
${temaCedo(false)}
<style>
:root { --fundo: #F6F1E9; --tit: #1C1915; --texto: #6E655B; --ouro: #B08A52; --ouro-txt: #8A6A3B; --linha: rgba(43, 38, 33, .16); --btn: #1C1915; --btn-txt: #D8C3A0; color-scheme: light; }
:root[data-tema="escuro"] { --fundo: #14110E; --tit: #F1E8D9; --texto: #A3978A; --ouro-txt: #CDA86C; --linha: rgba(236, 227, 212, .16); --btn: #D8C3A0; --btn-txt: #14110E; color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; min-height: 100svh; display: grid; place-items: center; background: var(--fundo); color: var(--texto); font: 400 17px/1.6 "Gantari", "Segoe UI", sans-serif; padding: 90px 16px 40px; overflow-x: hidden; transition: background-color .5s, color .5s; }
.topo { position: fixed; inset: 0 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 18px clamp(16px, 5vw, 72px); color: var(--tit); }
.logo { display: flex; align-items: center; gap: 12px; color: inherit; text-decoration: none; }
.logo svg { width: 36px; height: 36px; fill: none; stroke: var(--ouro); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.logo b { font: 400 21px/1 "Libre Caslon Display", Georgia, serif; }
main { text-align: center; max-width: 620px; position: relative; }
.arco { position: absolute; left: 50%; top: -30px; width: min(440px, 92vw); height: min(520px, 110vw); translate: -50% 0; border: 1px solid var(--linha); border-bottom: 0; border-radius: 50% 50% 0 0 / 38% 38% 0 0; z-index: -1; }
.codigo { display: flex; align-items: center; justify-content: center; gap: clamp(6px, 2vw, 18px); font: 400 clamp(110px, 24vw, 220px)/1 "Libre Caslon Display", Georgia, serif; color: var(--tit); }
.codigo svg { width: .78em; height: .78em; fill: none; stroke: var(--ouro); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; transform-origin: 50% 90%; animation: balanca 3.6s ease-in-out infinite; }
.codigo svg path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: desenha 1.8s cubic-bezier(.6, 0, .2, 1) forwards .2s; }
.codigo svg path:nth-child(2) { animation-delay: 1.1s; animation-duration: .7s; }
.codigo svg path:nth-child(3) { animation-delay: 1.6s; animation-duration: .4s; }
.codigo span { animation: sobe 1.1s cubic-bezier(.2, .7, .2, 1) both; }
.codigo span:last-child { animation-delay: .12s; }
@keyframes desenha { to { stroke-dashoffset: 0; } }
@keyframes balanca { 0%, 100% { rotate: -5deg; } 50% { rotate: 5deg; } }
@keyframes sobe { from { opacity: 0; transform: translateY(30px); } }
h1 { font: 400 clamp(30px, 4.4vw, 46px)/1.1 "Libre Caslon Display", Georgia, serif; color: var(--tit); margin: 18px 0 14px; }
h1 em { font-family: "Libre Caslon Text", Georgia, serif; font-style: italic; color: var(--ouro-txt); }
p { margin: 0 auto 32px; max-width: 460px; }
.btns { display: inline-grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 12px; }
.btns a { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 52px; padding: 0 24px; text-decoration: none; font-weight: 500; letter-spacing: .03em; border: 1px solid var(--btn); transition: background-color .35s, color .35s, transform .35s; white-space: nowrap; }
.btns a:first-child { background: var(--btn); color: var(--btn-txt); }
.btns a:last-child { color: var(--tit); }
.btns a:hover { transform: translateY(-2px); }
.btns a:last-child:hover { background: var(--btn); color: var(--btn-txt); }
.tema { width: 40px; height: 40px; border: 1px solid var(--linha); background: none; color: var(--tit); cursor: pointer; display: grid; place-items: center; transition: border-color .3s; }
.tema:hover { border-color: var(--ouro); }
.tema svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linejoin: round; }
.tema .face { fill: #F6DFAE; stroke: none; transition: opacity .4s; }
:root[data-tema="escuro"] .tema .face { opacity: 0; }
:focus-visible { outline: 2px solid var(--ouro); outline-offset: 3px; }
@media (max-width: 520px) { .btns { grid-auto-flow: row; width: 100%; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } .codigo svg path { stroke-dashoffset: 0; } }
</style>
</head>
<body>
<header class="topo">
  <a class="logo" href="index.html" aria-label="${M.completo}, início">${dente()}<b>${M.nome}</b></a>
  <button type="button" class="tema" aria-pressed="false" aria-label="Alternar entre tema claro e escuro"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="face" d="M5 8.5 12 12v8L5 16.5Z"/><path class="face" d="M12 12l7-3.5v8L12 20Z"/><path d="M12 4 19 8.5v8L12 20l-7-3.5v-8ZM5 8.5 12 12l7-3.5M12 12v8"/></svg></button>
</header>
<main>
  <span class="arco" aria-hidden="true"></span>
  <div class="codigo" role="img" aria-label="Erro 404"><span>4</span>${dente().replace(/<path /g, '<path pathLength="1" ')}<span>4</span></div>
  <h1>Esta porta <em>não abre</em>.</h1>
  <p>O endereço que você procurou não existe ou mudou de lugar. A recepção continua no mesmo endereço, pronta para receber você.</p>
  <div class="btns"><a href="index.html">Voltar à recepção</a><a href="${wa(`Olá! Cheguei numa página que não existe no site da ${M.nome} e gostaria de agendar uma avaliação.`)}" target="_blank" rel="noopener">Falar no WhatsApp</a></div>
</main>
<script>
(function () {
  var r = document.documentElement, b = document.querySelector('.tema');
  var marca = function () { b.setAttribute('aria-pressed', String(r.dataset.tema === 'escuro')); };
  marca();
  b.addEventListener('click', function () {
    var novo = r.dataset.tema === 'escuro' ? 'claro' : 'escuro';
    if (novo === 'escuro') r.dataset.tema = 'escuro'; else delete r.dataset.tema;
    try { localStorage.setItem('sorrisus-tema', novo); } catch (e) {}
    marca();
  });
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, '404.html'), p404);
console.log(`ok ${path.relative(process.cwd(), OUT)}${faltando.length ? `\nfotos faltando: ${faltando.join(', ')}` : ''}`);
