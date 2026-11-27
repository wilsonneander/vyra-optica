// Gera o Vilela Standard (advocacia) em templates/escritorios/standard/vilela-standard/.
// Uso: node templates/escritorios/_build-vilela-standard/build.js
// Páginas: index.html (início), escritorio.html (o escritório e a equipe), atuacao.html (áreas, atendimento,
// agendamento e dúvidas), conteudos.html (blog) e 404.html. Textos e dados ficam no content.js.
const fs = require('fs');
const path = require('path');
const C = require('./content');
const { I, emblema } = require('./icons');
const T = require('../../_comum/tema-balanca');

const M = C.marca;
const SAIDA = path.join(__dirname, '..', 'standard', 'vilela-standard');
const TEMA_CHAVE = 'vilela-tema';
const COR_CLARO = '#EEF1F2';
const COR_ESCURO = '#0D171F';
const creditos = JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'creditos.json'), 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const foto = (nome) => `assets/img/fotos/${nome}.webp`;
const eq = Object.fromEntries(C.equipe.map((p) => [p.id, p]));
const ar = Object.fromEntries(C.areas.map((a) => [a.id, a]));
const curto = (a) => a.curto || a.nome;
const endereco = `${M.rua}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const dataBR = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
// texto do aro que gira na capa: o § separa as áreas
const ARO = ['Vilela Rocha Advocacia', ...C.areas.map(curto)].join('\u00a0\u00a0§\u00a0\u00a0') + '\u00a0\u00a0§\u00a0\u00a0';

const btn = (href, txt, cls = 'btn-lima', extra = '') => `<a class="btn ${cls}" href="${href}"${extra}><span>${txt}</span>${I.dir}</a>`;

// ---------- partes comuns ----------
const PAGINAS = [
  ['index.html', 'Início'],
  ['escritorio.html', 'O escritório'],
  ['atuacao.html', 'Áreas de atuação'],
  ['conteudos.html', 'Conteúdos'],
];

const head = (pagina, titulo, desc) => `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="${COR_CLARO}">
<link rel="canonical" href="${M.dominio}/${pagina === 'index.html' ? '' : pagina}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${M.dominio}/${foto('capa-biblioteca')}">
<link rel="icon" href="assets/img/emblema.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Public+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
${T.head(TEMA_CHAVE)}
<script>try{var r=document.documentElement,s=sessionStorage;if(s.getItem("vilela-cg")||matchMedia("(prefers-reduced-motion: reduce)").matches)r.classList.add("sem-cg");if(s.getItem("vilela-troca")){r.classList.add("chegando");s.removeItem("vilela-troca");}}catch(e){}</script>
</head>`;

const carregando = `<div class="carregando" aria-hidden="true">
  <div class="cg-in">
    ${emblema('cg-emblema')}
    <p class="cg-nome">${M.nome.split('').map((l, i) => `<span style="--i:${i}">${l === ' ' ? '&nbsp;' : l}</span>`).join('')}</p>
    <p class="cg-sub">Advocacia</p>
  </div>
</div>
<div class="cortina" aria-hidden="true">${emblema('cortina-emblema')}</div>`;

const topo = (pagina) => {
  const links = PAGINAS.map(([href, nome]) => `<a href="${href}"${href === pagina ? ' aria-current="page"' : ''}>${nome}</a>`).join('');
  return `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo" data-topo>
  <div class="topo-in">
    <a class="logo" href="index.html" aria-label="${M.completo}, início">${emblema()}<span class="logo-txt"><b>${M.nome}</b><small>Advocacia</small></span></a>
    <nav class="nav" aria-label="Principal">${links}</nav>
    <a class="btn btn-tinta topo-cta" href="atuacao.html#agendar"><span>Agendar reunião</span>${I.dir}</a>
    ${T.balanca('tema-topo', 'claro')}
    <button type="button" class="menu-btn" data-menu aria-expanded="false" aria-controls="menu-cel" aria-label="Abrir menu">${I.menu}</button>
  </div>
  <div class="menu-cel" id="menu-cel" hidden>
    <nav aria-label="Menu do celular">${links}</nav>
    <a class="btn btn-lima" href="atuacao.html#agendar"><span>Agendar reunião</span>${I.dir}</a>
    <p class="menu-info">${I.fone}<a href="tel:${M.telefoneLink}">${M.telefone}</a></p>
  </div>
</header>
${T.balanca('tema-lado', 'claro')}`;
};

const newsletter = `<section class="news" aria-labelledby="news-tit">
  <div class="news-in" data-rev>
    <h2 id="news-tit">Receba os conteúdos da ${M.nome} no seu e-mail</h2>
    <p>Um e-mail por mês com mudanças na lei explicadas em linguagem simples. Sem ofertas de serviço.</p>
    <form class="news-form" data-news novalidate>
      <label class="campo"><span>Primeiro nome</span><input name="nome" autocomplete="given-name" required></label>
      <label class="campo"><span>Seu e-mail</span><input name="email" type="email" autocomplete="email" required></label>
      <button class="btn btn-tinta" type="submit"><span>Inscrever-se</span>${I.dir}</button>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Aceito receber os conteúdos e li a <button type="button" class="link" data-legal="privacidade">Política de privacidade</button>. Posso cancelar quando quiser.</span></label>
      <p class="form-msg" data-msg role="status"></p>
    </form>
  </div>
</section>`;

const rodape = `<footer class="rodape">
  <div class="rod-in">
    <div class="rod-topo">
      <div class="rod-marca">
        <a class="logo logo-grande" href="index.html" aria-label="${M.completo}, início">${emblema()}<span class="logo-txt"><b>${M.nome}</b><small>Advocacia</small></span></a>
        <p class="rod-frase">Advocacia que explica antes de agir.</p>
        <div class="redes"><a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${M.instagramUser}">${I.insta}</a><a href="${M.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${I.linkedin}</a><a href="${wa('Olá! Vim pelo site da Vilela Rocha Advocacia.')}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a></div>
      </div>
      <div class="rod-cols">
        <div><h3>Escritório</h3><ul><li><a href="escritorio.html">Quem somos</a></li><li><a href="escritorio.html#equipe">Equipe</a></li><li><a href="escritorio.html#politicas">Políticas</a></li><li><a href="conteudos.html">Conteúdos</a></li><li><a href="atuacao.html#duvidas">Dúvidas</a></li></ul></div>
        <div><h3>Áreas</h3><ul>${C.areas.map((a) => `<li><a href="atuacao.html#${a.id}">${a.nome}</a></li>`).join('')}</ul></div>
        <div><h3>Canais de atendimento</h3><ul class="rod-canais">
          <li>${I.fone}<a href="tel:${M.telefoneLink}">${M.telefone}</a></li>
          <li>${I.whats}<a href="${wa('Olá! Vim pelo site da Vilela Rocha Advocacia.')}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li>
          <li>${I.email}<a href="mailto:${M.email}">${M.email}</a></li>
          <li>${I.predio}<span>Presencial, com hora marcada</span></li>
          <li>${I.video}<span>Videochamada para todo o Brasil</span></li>
        </ul></div>
        <div><h3>Horário</h3><ul class="rod-horario">${C.horarioTexto.map((h) => `<li>${h}</li>`).join('')}</ul><p class="aberto" data-aberto></p></div>
      </div>
    </div>
    <div class="mapa-linha">
      <div class="map-box">
        <img src="assets/img/mapa_caminho-das-arvores.webp" alt="Mapa do ${M.bairro}, em ${M.cidade}, com a localização da ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"></span>
        <div class="map-info"><b>${M.completo}</b><span>${endereco}, CEP ${M.cep}</span><span>${C.horarioTexto.slice(0, 2).join('. ')}</span>
          <div class="mbtns"><a href="${M.mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${M.rotaUrl}" target="_blank" rel="noopener">${I.rota}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>No escritório, no ${M.bairro}, com estacionamento no prédio. Por videochamada, em todo o Brasil.</p>
        <ul class="cidades" data-iguais>${C.cidades.map((c) => `<li>${c}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="rod-legal">
      <p><b>${M.razao}</b>, CNPJ ${M.cnpj}. ${M.registroSociedade}. Responsável técnica: ${M.responsavel}.<br>${endereco}, CEP ${M.cep}. ${M.telefone}. ${M.email}.</p>
      <ul class="rod-links">
        <li><button type="button" class="link" data-legal="servico">Termos de prestação de serviço</button></li>
        <li><button type="button" class="link" data-legal="uso">Termos de uso</button></li>
        <li><button type="button" class="link" data-legal="privacidade">Política de privacidade</button></li>
        <li><a href="escritorio.html#politicas">Atendimento, honorários e confidencialidade</a></li>
        <li><button type="button" class="link" data-cookies>Preferências de cookies</button></li>
      </ul>
      <p class="rod-aviso">Este site tem caráter informativo, conforme o Código de Ética e Disciplina da OAB e o Provimento 205/2021. Não divulga valores e não promete resultados.</p>
      <p>© <span data-ano>2026</span> ${M.completo}.</p>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditos.map((c) => `<li>${c.arq}: <a href="${c.url}" target="_blank" rel="noopener">${esc(c.autor)}</a>, ${c.fonte}</li>`).join('')}<li>Mapa: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">colaboradores do OpenStreetMap</a></li></ul></details>
    </div>
  </div>
  <p class="rod-gigante" aria-hidden="true">${M.nome}</p>
</footer>
<a class="whats-flutua" href="${wa('Olá! Vim pelo site da Vilela Rocha Advocacia e gostaria de marcar uma reunião.')}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">${I.whats}<span>WhatsApp</span></a>
<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Guardamos no seu navegador o tema escolhido e esta preferência. A medição de visitas só é ligada se você aceitar. <button type="button" class="link" data-legal="privacidade">Saiba mais</button></p>
  <div class="ck-btns" data-iguais><button type="button" class="btn btn-tinta" data-ck="todos"><span>Aceitar todos</span></button><button type="button" class="btn btn-linha" data-ck="essenciais"><span>Só os essenciais</span></button></div>
</div>`;

// ---------- janelas legais (todas as páginas) ----------
const LEGAIS = {
  servico: ['Termos de prestação de serviço', `
    <p>Estes termos resumem como a ${M.razao} presta serviços advocatícios. O que vale para cada cliente é o contrato de honorários assinado, que prevalece sobre este resumo.</p>
    <h3>Contratação</h3><p>O serviço começa depois da reunião de análise, da proposta por escrito e do contrato assinado pelas duas partes. O contrato descreve o objeto, as etapas previstas, os honorários conforme a tabela da OAB/BA, as despesas e o advogado responsável.</p>
    <h3>Obrigação de meio</h3><p>A advocacia é obrigação de meio: o escritório se compromete a atuar com técnica, diligência e ética, mas não pode garantir o resultado, que depende das provas, da lei e de decisões de terceiros.</p>
    <h3>Deveres do cliente</h3><p>Fornecer informações verdadeiras e documentos completos, avisar mudanças de endereço ou contato e comparecer quando sua presença for necessária.</p>
    <h3>Comunicação</h3><p>As atualizações são enviadas pelos canais combinados no contrato. Prazos e audiências são confirmados por escrito.</p>
    <h3>Sigilo</h3><p>O escritório guarda sigilo sobre tudo o que souber em razão do trabalho, nos termos do Estatuto da Advocacia (Lei 8.906/1994) e do Código de Ética e Disciplina da OAB.</p>
    <h3>Encerramento</h3><p>O cliente pode revogar o mandato e o escritório pode renunciar a ele, nas formas previstas em lei e no contrato, com aviso e entrega dos documentos.</p>`],
  uso: ['Termos de uso', `
    <p>Ao usar este site, você concorda com estes termos. O site da ${M.completo} tem caráter informativo e segue o Código de Ética e Disciplina da OAB e o Provimento 205/2021 do Conselho Federal.</p>
    <h3>Conteúdo informativo</h3><p>Os textos do site e dos conteúdos explicam temas jurídicos de forma geral e não substituem a orientação para o seu caso. Ler o site ou enviar o formulário não cria relação entre cliente e advogado.</p>
    <h3>Sem promessa de resultado</h3><p>Nenhuma informação do site é promessa ou garantia de resultado.</p>
    <h3>Formulários</h3><p>Use os formulários só para dizer o assunto e combinar o contato. Não envie documentos nem detalhes sigilosos por eles. Urgências e prazos correndo devem ser informados por telefone ou WhatsApp.</p>
    <h3>Propriedade</h3><p>Textos, marca e imagens pertencem ao escritório ou aos autores indicados nos créditos. A reprodução dos conteúdos é permitida com citação da fonte.</p>
    <h3>Links externos</h3><p>Links para outros sites, como mapas e redes sociais, abrem em nova aba e seguem as regras desses serviços.</p>`],
  privacidade: ['Política de privacidade', `
    <p>A ${M.razao}, CNPJ ${M.cnpj}, é a controladora dos dados enviados por este site e os trata conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018) e o sigilo profissional da advocacia.</p>
    <h3>Dados que coletamos</h3><p>Nome, e-mail, telefone ou WhatsApp, assunto e a mensagem que você escrever nos formulários de contato, de agendamento e de conteúdos por e-mail.</p>
    <h3>Para que usamos</h3><p>Só para responder ao seu pedido, marcar a reunião e, se você pedir, enviar os conteúdos por e-mail. Não vendemos nem compartilhamos dados para publicidade.</p>
    <h3>Confidencialidade</h3><p>Os dados enviados são tratados como confidenciais e acessados apenas pela equipe que vai atender você. Dados de saúde e de família são tratados como dados sensíveis, com acesso ainda mais restrito.</p>
    <h3>Por quanto tempo guardamos</h3><p>Pedidos que não viram contratação são apagados em até 6 meses. Dados de clientes são guardados pelo tempo exigido por lei e pelas regras da OAB.</p>
    <h3>Seus direitos</h3><p>Você pode pedir acesso, correção, portabilidade ou exclusão dos seus dados, e retirar o consentimento, pelo e-mail ${M.email}. Encarregada de dados: ${M.responsavel.split(',')[0]}.</p>
    <h3>Cookies e armazenamento</h3><p>O site guarda no seu navegador: a escolha de cookies (vilela-cookies), o tema claro ou escuro (vilela-tema) e marcações temporárias da visita (abertura e passagem entre páginas). A medição de visitas, quando existir, só é ligada depois de "Aceitar todos". Não usamos cookies de publicidade. Você pode mudar a escolha em "Preferências de cookies", no rodapé.</p>`],
};

const janelas = `${Object.entries(LEGAIS).map(([id, [titulo, corpo]]) => `<dialog class="janela jan-legal" data-jan-legal="${id}" aria-labelledby="jl-${id}">
  <div class="jan-in"><button type="button" class="jan-fechar" data-fechar aria-label="Fechar">${I.fechar}</button>
    <h2 id="jl-${id}">${titulo}</h2><div class="jan-texto">${corpo}</div></div>
</dialog>`).join('\n')}
<dialog class="janela jan-foto" data-jan-foto aria-label="Foto ampliada">
  <button type="button" class="jan-fechar" data-fechar aria-label="Fechar">${I.fechar}</button>
  <figure><img data-jf-img src="" alt=""><figcaption data-jf-leg></figcaption></figure>
</dialog>`;

// dados lidos pelo app.js
const dados = {
  wa: M.whatsapp,
  marca: M.completo,
  horario: C.horario,
  equipe: C.equipe.map(({ id, nome, oab, areas, agenda }) => ({ id, nome, oab, areas, agenda })),
  areas: C.areas.map((a) => ({ id: a.id, nome: a.nome })),
  artigos: C.artigos.map((a) => ({ ...a, autorNome: eq[a.autor].nome, autorOab: eq[a.autor].oab, areaNome: ar[a.area].nome, dataTexto: dataBR(a.data), foto: foto(a.foto) })),
};

const pagina = (arquivo, titulo, desc, corpo) => `${head(arquivo, titulo, desc)}
<body data-pagina="${arquivo.replace('.html', '')}">
${carregando}
${topo(arquivo)}
<main id="conteudo">
${corpo}
</main>
${newsletter}
${rodape}
${janelas}
<script type="application/json" id="vr-dados">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>
<script src="assets/app.js" defer></script>
</body>
</html>
`;

// ---------- blocos reaproveitados entre páginas ----------
const comoFunciona = `<section class="como" id="como" aria-labelledby="como-tit">
  <div class="sec-in">
    <div class="sec-cab" data-rev>
      <p class="apoio">Como funciona o atendimento</p>
      <h2 id="como-tit">Do primeiro contato ao acompanhamento, <em>sem surpresa</em> no caminho.</h2>
      <p>Você sabe o que acontece em cada etapa, quem cuida do seu caso e quando vai ter notícia.</p>
    </div>
    <ol class="linha-tempo" data-linha>
      <li class="lt-fio" aria-hidden="true"><i></i></li>
      ${C.atendimento.map((e) => `<li class="lt-etapa" data-etapa>
        <span class="lt-ponto" aria-hidden="true"></span>
        <div class="lt-cartao"><h3>${e.titulo}</h3><p>${e.texto}</p><p class="lt-nota">${e.nota}</p></div>
      </li>`).join('')}
    </ol>
    <div class="compromissos">
      ${C.compromissos.map((c, i) => `<div class="comp" data-rev style="--d:${i * 90}ms"><h3>${c.titulo}</h3><p>${c.texto}</p></div>`).join('')}
    </div>
  </div>
</section>`;

const contato = `<section class="contato" id="contato" aria-labelledby="contato-tit">
  <div class="sec-in contato-in">
    <div class="contato-txt" data-rev>
      <p class="apoio">Contato</p>
      <h2 id="contato-tit">Conte-nos qual é o assunto. <em>Só o assunto.</em></h2>
      <p>A equipe responde em até 1 dia útil para marcar a reunião com o advogado da área. Detalhes e documentos ficam para a reunião, protegidos pelo sigilo profissional.</p>
      <ul class="contato-canais">
        <li>${I.whats}<a href="${wa('Olá! Vim pelo site da Vilela Rocha Advocacia.')}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li>
        <li>${I.fone}<a href="tel:${M.telefoneLink}">${M.telefone}</a></li>
        <li>${I.email}<a href="mailto:${M.email}">${M.email}</a></li>
        <li>${I.pino}<span>${M.rua}, ${M.bairro}</span></li>
      </ul>
      <p class="urgente">${I.relogio}<span><b>Prazo correndo ou audiência marcada?</b> Ligue ou mande "prazo" no WhatsApp. O formulário não é o canal para urgências.</span></p>
    </div>
    <form class="form" data-contato novalidate>
      <div class="form-grade">
        <label class="campo"><span>Nome completo</span><input name="nome" autocomplete="name" required></label>
        <label class="campo"><span>E-mail</span><input name="email" type="email" autocomplete="email" required></label>
        <label class="campo"><span>WhatsApp</span><input name="fone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(71) 90000-0000" data-mascara required></label>
        <label class="campo"><span>Assunto</span><select name="assunto" required><option value="">Escolha a área</option>${C.areas.map((a) => `<option>${a.nome}</option>`).join('')}<option>Outro assunto</option></select></label>
      </div>
      <fieldset class="opcoes"><legend>Prefere o retorno por</legend><div class="opcoes-in" data-iguais>
        <label><input type="radio" name="retorno" value="WhatsApp" checked><span>WhatsApp</span></label>
        <label><input type="radio" name="retorno" value="E-mail"><span>E-mail</span></label>
        <label><input type="radio" name="retorno" value="Telefone"><span>Telefone</span></label>
      </div></fieldset>
      <label class="campo"><span>Em poucas linhas, sobre o que é</span><textarea name="msg" rows="3" maxlength="400" placeholder="Ex.: dúvida sobre aposentadoria por tempo de contribuição"></textarea><small class="contador" data-contador>0 de 400</small></label>
      <p class="sigilo">${I.cadeado}<span>Os dados enviados são confidenciais e usados só para responder a você. Não inclua documentos, números de processo ou detalhes sigilosos.</span></p>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Li e aceito a <button type="button" class="link" data-legal="privacidade">Política de privacidade</button> e autorizo o contato sobre este pedido.</span></label>
      <button class="btn btn-tinta" type="submit"><span>Enviar pedido de contato</span>${I.dir}</button>
      <p class="form-msg" data-msg role="status"></p>
      <div class="form-ok" data-ok hidden>
        <h3>Pedido recebido</h3>
        <p>Protocolo <b data-protocolo></b>. A equipe responde em até 1 dia útil pelo canal escolhido.</p>
        <a class="btn btn-linha" data-ok-wa href="#" target="_blank" rel="noopener"><span>Adiantar pelo WhatsApp</span>${I.whats}</a>
      </div>
    </form>
  </div>
</section>`;

const cartaoArtigo = (a, destaque = false) => `<article class="art ${destaque ? 'art-destaque' : ''}" data-area="${a.area}" data-rev>
  <button type="button" class="art-btn" data-art="${a.id}" aria-label="Ler: ${esc(a.titulo)}">
    <span class="art-foto"><img src="${foto(a.foto)}" alt="" width="1500" height="1000" loading="lazy"></span>
    <span class="art-txt">
      <span class="etiqueta">${ar[a.area].nome}</span>
      <span class="art-tit">${a.titulo}</span>
      <span class="art-res">${a.resumo}</span>
      <span class="art-meta">${eq[a.autor].nome}, ${dataBR(a.data)}</span>
      <span class="btn btn-linha btn-p"><span>Ler mais</span>${I.dir}</span>
    </span>
  </button>
</article>`;

const janelaArtigo = `<dialog class="janela jan-art" data-jan-art aria-labelledby="ja-tit">
  <div class="jan-in"><button type="button" class="jan-fechar" data-fechar aria-label="Fechar">${I.fechar}</button>
    <img data-ja-foto src="" alt="" width="1500" height="1000">
    <div class="ja-txt"><p class="etiqueta" data-ja-area></p><h2 id="ja-tit" data-ja-tit></h2><p class="ja-meta" data-ja-meta></p><div data-ja-corpo></div>
      <p class="ja-aviso">Conteúdo informativo. Não substitui a orientação de um advogado para o seu caso.</p>
      <a class="btn btn-tinta" href="atuacao.html#agendar"><span>Agendar uma reunião</span>${I.dir}</a></div>
  </div>
</dialog>`;

// ---------- INÍCIO ----------
const inicio = `<section class="capa" aria-labelledby="capa-tit">
  <svg class="capa-arcos" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><circle cx="1060" cy="420" r="520"/><circle cx="1060" cy="420" r="380"/><circle cx="-60" cy="980" r="420"/></svg>
  <div class="capa-in">
    <div class="capa-txt">
      <p class="apoio capa-apoio">Advocacia em ${M.cidade} desde ${M.desde}</p>
      <h1 id="capa-tit" class="capa-tit"><span class="ln"><span>Advocacia que</span></span> <span class="ln"><span>explica</span></span> <span class="ln"><em>antes de agir.</em></span></h1>
      <p class="capa-sub">Consultoria e atuação em processos nas áreas cível, trabalhista, empresarial, de família e previdenciária. No escritório, no ${M.bairro}, ou por videochamada em todo o Brasil.</p>
      <div class="capa-btns">${btn('atuacao.html#agendar', 'Agendar reunião')}${btn('#areas', 'Ver as áreas', 'btn-vazado')}</div>
      <p class="aberto capa-aberto" data-aberto></p>
    </div>
    <div class="capa-arte" data-capa-arte>
      <div class="capa-roda">
        <svg class="aro" viewBox="0 0 400 400" aria-hidden="true"><defs><path id="aro-p" d="M200 200m-182 0a182 182 0 1 1 364 0a182 182 0 1 1-364 0"/></defs><text><textPath href="#aro-p" textLength="1140">${ARO.toUpperCase()}</textPath></text></svg>
        <figure class="capa-foto"><img src="${foto('capa-biblioteca')}" alt="Advogada sentada na biblioteca do escritório" width="1100" height="1100" fetchpriority="high"></figure>
      </div>
      <img class="capa-mini m1" data-prof="1.6" src="${foto('reuniao')}" alt="" width="1500" height="1000">
      <img class="capa-mini m2" data-prof="-1.2" src="${foto('familia')}" alt="" width="1500" height="1000">
      <img class="capa-mini m3" data-prof="2.2" src="${foto('assinatura')}" alt="" width="1500" height="1000">
    </div>
  </div>
  <div class="faixa" aria-hidden="true"><div class="faixa-in">${Array(4).fill(C.areas.map((a) => `<span>${a.nome}</span><i>§</i>`).join('')).join('')}</div></div>
</section>

<section class="areas-home" id="areas" aria-labelledby="areas-tit">
  <div class="sec-in">
    <div class="sec-cab sec-cab-lado" data-rev>
      <h2 id="areas-tit">Cinco áreas, <em>um advogado de referência</em> para cada cliente.</h2>
      <p>Atuamos de forma preventiva, consultiva e em processos. Passe pelas áreas para ver o que cada uma cobre.</p>
    </div>
    <ul class="lista-areas" data-lista-areas>
      ${C.areas.map((a) => `<li data-rev><a href="atuacao.html#${a.id}" data-foto="${foto(a.foto)}">
        <img class="la-mini" src="${foto(a.foto)}" alt="" width="1500" height="1000" loading="lazy">
        <span class="la-nome">${a.nome}</span>
        <span class="la-res">${a.resumo}</span>
        <span class="la-quem">${a.servicos.map((s) => s.nome).slice(0, 2).join(', ')}</span>
        <span class="la-seta">${I.dir}</span>
      </a></li>`).join('')}
    </ul>
    <div class="la-flutua" data-la-flutua aria-hidden="true"><img src="" alt=""></div>
  </div>
</section>

${comoFunciona}

<section class="escritorio-home" aria-labelledby="esc-tit">
  <div class="sec-in esc-grade">
    <div class="esc-txt" data-rev>
      <p class="apoio">O escritório</p>
      <h2 id="esc-tit">Uma sociedade de advogados <em>pequena de propósito.</em></h2>
      <p>Somos quatro advogados. Isso permite que quem atende você na primeira reunião seja quem acompanha o caso até o fim, com linguagem clara e retorno dentro do prazo combinado.</p>
      <dl class="numeros">${C.numeros.map((n) => `<div><dt data-conta="${n.valor}"${n.ano ? ' data-ano-conta' : ''}>${n.valor}</dt><dd>${n.texto}</dd></div>`).join('')}</dl>
      ${btn('escritorio.html', 'Conhecer o escritório', 'btn-linha')}
    </div>
    <div class="carrossel" data-carrossel aria-roledescription="carrossel" aria-label="Fotos do escritório">
      <div class="car-trilho" data-trilho>
        ${C.carrossel.map((s, i) => `<figure class="car-slide" role="group" aria-roledescription="slide" aria-label="${i + 1} de ${C.carrossel.length}"><img src="${foto(s.foto)}" alt="${s.legenda}" width="1500" height="1000" loading="lazy" draggable="false"><figcaption>${s.legenda}</figcaption></figure>`).join('')}
      </div>
      <div class="car-ctrl">
        <div class="car-barras">${C.carrossel.map((_, i) => `<button type="button" data-ir="${i}" aria-label="Ir para a foto ${i + 1}"><i></i></button>`).join('')}</div>
        <div class="car-setas"><button type="button" data-ant aria-label="Foto anterior">${I.esq}</button><button type="button" data-prox aria-label="Próxima foto">${I.dir}</button></div>
      </div>
    </div>
  </div>
</section>

<section class="equipe-home" aria-labelledby="eqh-tit">
  <div class="sec-in">
    <div class="sec-cab sec-cab-lado" data-rev>
      <h2 id="eqh-tit">Quem vai <em>atender você.</em></h2>
      <p>Cada área tem um advogado responsável, com registro na OAB/BA e agenda própria.</p>
    </div>
    <ul class="eq-cartoes">
      ${C.equipe.map((p, i) => `<li data-rev style="--d:${i * 80}ms"><a href="escritorio.html?adv=${p.id}#equipe">
        <span class="eq-foto"><img src="${foto(p.foto)}" alt="${p.nome}, ${p.cargo.toLowerCase()}" width="880" height="1100" loading="lazy"></span>
        <span class="eq-frase">${p.frase}</span>
        <span class="eq-nome">${p.nome}</span>
        <span class="eq-cargo">${p.cargo}, ${p.oab}</span>
        <span class="eq-areas">${p.areas.map((a) => curto(ar[a])).join(' e ')}</span>
      </a></li>`).join('')}
    </ul>
  </div>
</section>

${C.depoimentos.mostrar ? `<section class="depo" aria-labelledby="depo-tit">
  <div class="sec-in">
    <div class="sec-cab" data-rev>
      <p class="apoio">Sobre o atendimento</p>
      <h2 id="depo-tit">O que os clientes dizem <em>da forma como são atendidos.</em></h2>
    </div>
    <ul class="depo-lista">
      ${C.depoimentos.itens.map((d, i) => `<li data-rev style="--d:${i * 80}ms"><blockquote>${I.aspas}<p>${d.texto}</p><footer><b>${d.nome}</b><span>${d.sobre}</span></footer></blockquote></li>`).join('')}
    </ul>
    <p class="aviso-exemplo">${C.depoimentos.aviso}</p>
  </div>
</section>` : ''}

<section class="conteudos-home" aria-labelledby="ch-tit">
  <div class="sec-in">
    <div class="sec-cab sec-cab-lado" data-rev>
      <h2 id="ch-tit">Atualizações <em>jurídicas.</em></h2>
      <p>Análises e mudanças na lei explicadas pela equipe, para entender melhor direitos e deveres.</p>
    </div>
    <div class="ch-grade">
      ${C.artigos.slice(0, 4).map((a, i) => cartaoArtigo(a, i === 0)).join('')}
    </div>
    <p class="ch-mais">${btn('conteudos.html', 'Ver todos os conteúdos', 'btn-linha')}</p>
  </div>
</section>

<section class="brasil" aria-labelledby="br-tit">
  <div class="brasil-in" data-rev>
    <svg class="brasil-ondas" viewBox="0 0 600 600" aria-hidden="true"><circle cx="300" cy="300" r="80"/><circle cx="300" cy="300" r="150"/><circle cx="300" cy="300" r="220"/><circle cx="300" cy="300" r="290"/></svg>
    <div>
      <p class="apoio">Atuação</p>
      <h2 id="br-tit">Escritório em ${M.cidade}, <em>atendimento em todo o Brasil.</em></h2>
      <p>Reunião, contrato e acompanhamento por videochamada, com a mesma equipe e o mesmo cuidado do atendimento presencial. Para audiências fora da Bahia, trabalhamos com advogados parceiros, sempre informados no contrato.</p>
    </div>
    ${btn('atuacao.html#agendar', 'Agendar por vídeo')}
  </div>
</section>

${contato}
${janelaArtigo}`;

// ---------- O ESCRITÓRIO ----------
const escritorio = `<section class="capa-int capa-escritorio" aria-labelledby="ce-tit">
  <img class="ci-foto" src="${foto('sala-cidade')}" alt="" width="1500" height="1000" fetchpriority="high">
  <svg class="ci-arco" viewBox="0 0 1440 700" preserveAspectRatio="none" aria-hidden="true"><path d="M-40 700C180 160 760 -60 1500 160"/></svg>
  <div class="ci-in">
    <p class="apoio">O escritório</p>
    <h1 id="ce-tit" class="ci-tit"><span class="ln"><span>Atuamos de perto,</span></span> <span class="ln"><span>do primeiro contato</span></span> <span class="ln"><em>à última etapa.</em></span></h1>
    ${btn('atuacao.html#agendar', 'Agendar reunião')}
  </div>
</section>

<section class="sobre" aria-labelledby="sobre-tit">
  <div class="sec-in sobre-grade">
    <p class="sobre-nome" aria-hidden="true"><span>Vilela</span><span>Rocha</span><span>Advocacia</span></p>
    <div class="sobre-txt" data-rev>
      <h2 id="sobre-tit" class="vh">Quem somos</h2>
      <p>Somos uma sociedade de advogados fundada em ${M.desde}, em ${M.cidade}, com atuação nas áreas cível, trabalhista, empresarial, de família e sucessões e previdenciária.</p>
      <p>Atuamos de forma preventiva, consultiva e em processos, ajudando pessoas e empresas a entender os riscos, decidir com informação e proteger o que construíram.</p>
      <p>Nosso jeito de trabalhar está na proximidade: linguagem clara, um advogado de referência para cada cliente e notícia a cada passo importante.</p>
    </div>
  </div>
  <div class="sec-in valores">
    ${C.valores.map((v, i) => `<div class="valor" data-rev style="--d:${i * 100}ms"><h3>${v.titulo}</h3><p>${v.texto}</p></div>`).join('')}
  </div>
</section>

<section class="frase" aria-label="Nosso propósito">
  <p class="frase-txt" data-frase>Acreditamos que ninguém deveria assinar, pedir ou decidir algo sem entender o que está fazendo. Por isso explicamos antes de agir.</p>
</section>

<section class="equipe" id="equipe" aria-labelledby="eq-tit">
  <div class="sec-in">
    <div class="sec-cab" data-rev>
      <p class="apoio">Equipe</p>
      <h2 id="eq-tit">Quatro advogados, <em>cada um responsável pela sua área.</em></h2>
    </div>
    <div class="eq-abas" role="tablist" aria-label="Advogados">
      ${C.equipe.map((p, i) => `<button type="button" role="tab" id="aba-${p.id}" aria-controls="painel-${p.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-adv="${p.id}">
        <span class="eqa-foto"><img src="${foto(p.foto)}" alt="" width="880" height="1100" loading="lazy"></span>
        <span class="eqa-nome">${p.nome}</span>
      </button>`).join('')}
    </div>
    ${C.equipe.map((p, i) => `<div class="eq-painel" role="tabpanel" id="painel-${p.id}" aria-labelledby="aba-${p.id}"${i === 0 ? '' : ' hidden'}>
      <div class="eqp-cab"><h3>${p.nome}</h3><p>${p.cargo}, ${p.oab}</p></div>
      <div class="eqp-grade">
        <div class="eqp-bio">${p.bio.map((b) => `<p>${b}</p>`).join('')}<blockquote>${p.frase}</blockquote></div>
        <div class="eqp-dados">
          <h4>Áreas</h4><ul class="eqp-areas">${p.areas.map((a) => `<li><a href="atuacao.html#${a}">${ar[a].nome}</a></li>`).join('')}</ul>
          <h4>Formação</h4><ul class="eqp-form">${p.formacao.map((f) => `<li>${f}</li>`).join('')}</ul>
          <h4>Atende</h4><p>${p.agenda.map((d) => ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'][d]).join(', ')}</p>
          ${btn(`atuacao.html?adv=${p.id}#agendar`, `Agendar com ${p.nome.split(' ')[0]}`, 'btn-lima')}
        </div>
      </div>
    </div>`).join('')}
  </div>
</section>

<section class="galeria" id="galeria" aria-labelledby="gal-tit">
  <div class="sec-in">
    <div class="sec-cab sec-cab-lado" data-rev>
      <h2 id="gal-tit">Por dentro <em>do escritório.</em></h2>
      <div class="filtro" role="group" aria-label="Filtrar fotos" data-iguais data-filtro-gal>
        <button type="button" aria-pressed="true" data-cat="todas">Todas</button>
        ${[...new Set(C.galeria.map((g) => g.cat))].map((c) => `<button type="button" aria-pressed="false" data-cat="${c}">${c}</button>`).join('')}
      </div>
    </div>
    <ul class="gal-grade">
      ${C.galeria.map((g) => `<li data-cat="${g.cat}"><button type="button" data-ampliar="${foto(g.foto)}" data-leg="${g.legenda}"><img src="${foto(g.foto)}" alt="${g.legenda}" width="1500" height="1000" loading="lazy"><span>${g.legenda}</span></button></li>`).join('')}
    </ul>
  </div>
</section>

<section class="insta" aria-labelledby="insta-tit">
  <div class="sec-in">
    <div class="sec-cab sec-cab-lado" data-rev>
      <h2 id="insta-tit">No Instagram, <em>${M.instagramUser}</em></h2>
      <p>Conteúdo informativo, glossário jurídico e bastidores do escritório.</p>
    </div>
    <ul class="insta-grade">
      ${C.instagram.map((p, i) => `<li data-rev style="--d:${i * 60}ms"><a href="${M.instagram}" target="_blank" rel="noopener"><img src="${foto(p.foto)}" alt="" width="1500" height="1000" loading="lazy"><span>${p.texto}</span></a></li>`).join('')}
    </ul>
    <p class="insta-link"><a class="btn btn-linha" href="${M.instagram}" target="_blank" rel="noopener"><span>Seguir ${M.instagramUser}</span>${I.insta}</a></p>
  </div>
</section>

<section class="politicas" id="politicas" aria-labelledby="pol-tit">
  <div class="sec-in pol-grade">
    <div class="sec-cab" data-rev>
      <p class="apoio">Políticas</p>
      <h2 id="pol-tit">Atendimento, honorários e <em>confidencialidade.</em></h2>
      <p>O que você pode esperar do escritório antes, durante e depois da contratação.</p>
      <div class="pol-abas" role="tablist" aria-label="Políticas">${C.politicas.map((p, i) => `<button type="button" role="tab" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" aria-controls="pol-${p.id}" data-pol="${p.id}">${p.titulo}</button>`).join('')}</div>
    </div>
    <div class="pol-paineis">${C.politicas.map((p, i) => `<section class="pol ${p.destaque ? 'pol-destaque' : ''}" id="pol-${p.id}" role="tabpanel"${i === 0 ? '' : ' hidden'}><h3>${p.titulo}</h3><ul>${p.itens.map((t) => `<li>${t}</li>`).join('')}</ul></section>`).join('')}</div>
  </div>
</section>`;

// ---------- ÁREAS DE ATUAÇÃO ----------
const atuacao = `<section class="capa-int capa-atuacao" aria-labelledby="ca-tit">
  <div class="ci-in">
    <p class="apoio">Áreas de atuação</p>
    <h1 id="ca-tit" class="ci-tit"><span class="ln"><span>Cada área com</span></span> <span class="ln"><em>quem entende dela.</em></span></h1>
    <p class="ci-sub">Serviços para pessoas e empresas, com o que inclui cada um e o que levar na primeira reunião. Honorários sempre em proposta por escrito, depois da conversa.</p>
    <nav class="atalhos" aria-label="Ir para a área" data-iguais>${C.areas.map((a) => `<a href="#${a.id}" data-ir-area="${a.id}">${curto(a)}</a>`).join('')}</nav>
  </div>
  <svg class="ca-paragrafo" viewBox="0 0 200 300" aria-hidden="true"><text x="100" y="250" text-anchor="middle">§</text></svg>
</section>

<section class="servicos" id="servicos" aria-labelledby="serv-tit">
  <div class="sec-in">
    <div class="serv-cab" data-rev>
      <h2 id="serv-tit">Serviços <em>por área</em></h2>
      <div class="filtro" role="group" aria-label="Filtrar serviços por área" data-iguais data-filtro-serv>
        <button type="button" aria-pressed="true" data-area="todas">Todas</button>
        ${C.areas.map((a) => `<button type="button" aria-pressed="false" data-area="${a.id}">${curto(a)}</button>`).join('')}
      </div>
    </div>
    <div class="serv-corpo">
      <div class="serv-grade">
        ${C.areas.map((a) => `<span class="ancora" id="${a.id}" aria-hidden="true"></span>${a.servicos.map((s) => `<article class="serv" data-area="${a.id}">
          <div class="serv-topo"><span class="etiqueta">${a.nome}</span><span class="serv-para">${s.para}</span></div>
          <h3>${s.nome}</h3>
          <ul class="serv-inclui">${s.inclui.map((x) => `<li>${x}</li>`).join('')}</ul>
          <dl class="serv-dados">
            <div><dt>Primeira reunião</dt><dd>50 min, presencial ou vídeo</dd></div>
            <div><dt>Levar</dt><dd>${s.docs}</dd></div>
            <div><dt>Honorários</dt><dd>Proposta por escrito após a reunião</dd></div>
          </dl>
          <button type="button" class="btn btn-linha btn-p" data-agendar-area="${a.id}" data-agendar-serv="${esc(s.nome)}"><span>Agendar sobre este assunto</span>${I.dir}</button>
        </article>`).join('')}`).join('')}
      </div>
      <aside class="condicoes" data-rev aria-label="Condições de atendimento">
        <h3>Valem para todos os serviços</h3>
        <ul>
          <li>${I.relogio}<span>${C.condicoes.reuniao}</span></li>
          <li>${I.fone}<span>${C.condicoes.retorno}</span></li>
          <li>${I.doc}<span>${C.condicoes.honorarios}</span></li>
          <li>${I.pena}<span>${C.condicoes.remarcar}</span></li>
        </ul>
        <p>O site não divulga valores nem formas de pagamento, por regra do Provimento 205/2021 da OAB. <a href="escritorio.html#politicas">Ver as políticas</a></p>
      </aside>
    </div>
  </div>
</section>

${comoFunciona}

<section class="agendar" id="agendar" aria-labelledby="ag-tit">
  <div class="sec-in ag-grade">
    <div class="ag-txt" data-rev>
      <p class="apoio">Agendamento</p>
      <h2 id="ag-tit">Marque a reunião <em>com o advogado da área.</em></h2>
      <p>Escolha o assunto, quem vai atender, o formato e o melhor horário. O pedido chega à equipe pelo WhatsApp e a confirmação vem em até 1 dia útil.</p>
      <div class="ag-resumo" data-ag-resumo aria-live="polite">
        <p class="ag-r-tit">Seu pedido</p>
        <dl>
          <div><dt>Assunto</dt><dd data-r="area">Escolha a área</dd></div>
          <div><dt>Com</dt><dd data-r="adv">Escolha o advogado</dd></div>
          <div><dt>Formato</dt><dd data-r="formato">Presencial</dd></div>
          <div><dt>Quando</dt><dd data-r="quando">Escolha dia e horário</dd></div>
        </dl>
      </div>
    </div>
    <form class="form ag-form" data-agenda novalidate>
      <fieldset><legend>Assunto</legend>
        <div class="ag-opcoes ag-areas">${C.areas.map((a) => `<label><input type="radio" name="area" value="${a.id}" required><span>${curto(a)}</span></label>`).join('')}</div>
        <input type="hidden" name="servico" value="">
        <p class="ag-serv" data-ag-serv hidden></p>
      </fieldset>
      <fieldset><legend>Advogado</legend><div class="ag-opcoes ag-advs" data-ag-advs><p class="ag-dica">Escolha a área para ver quem atende.</p></div></fieldset>
      <fieldset><legend>Formato</legend><div class="ag-opcoes ag-formato" data-iguais>
        <label><input type="radio" name="formato" value="Presencial" checked><span>${I.predio}Presencial</span></label>
        <label><input type="radio" name="formato" value="Videochamada"><span>${I.video}Videochamada</span></label>
      </div></fieldset>
      <fieldset><legend>Dia</legend><div class="ag-dias" data-ag-dias><p class="ag-dica">Escolha o advogado para ver os dias livres.</p></div></fieldset>
      <fieldset><legend>Horário</legend><div class="ag-horas" data-ag-horas><p class="ag-dica">Escolha o dia.</p></div></fieldset>
      <div class="form-grade">
        <label class="campo"><span>Nome completo</span><input name="nome" autocomplete="name" required></label>
        <label class="campo"><span>WhatsApp</span><input name="fone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(71) 90000-0000" data-mascara required></label>
      </div>
      <p class="sigilo">${I.cadeado}<span>Não descreva o caso aqui. O advogado ouve os detalhes na reunião, sob sigilo profissional.</span></p>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Li e aceito a <button type="button" class="link" data-legal="privacidade">Política de privacidade</button> e a <a href="escritorio.html#politicas">política de agendamento e cancelamento</a>.</span></label>
      <button class="btn btn-tinta" type="submit"><span>Enviar pedido pelo WhatsApp</span>${I.whats}</button>
      <p class="form-msg" data-msg role="status"></p>
    </form>
  </div>
</section>

<section class="duvidas" id="duvidas" aria-labelledby="faq-tit">
  <div class="sec-in faq-grade">
    <div class="sec-cab" data-rev>
      <p class="apoio">Dúvidas frequentes</p>
      <h2 id="faq-tit">Antes de <em>marcar a reunião.</em></h2>
      <p>Não achou a sua? Pergunte pelo WhatsApp.</p>
      ${btn(wa('Olá! Tenho uma dúvida antes de marcar a reunião.'), 'Perguntar no WhatsApp', 'btn-linha', ' target="_blank" rel="noopener"')}
    </div>
    <div class="faq" data-faq>
      ${C.faq.map(([p, r], i) => `<div class="faq-item">
        <h3><button type="button" aria-expanded="false" aria-controls="faq-${i}" id="faq-b${i}">${p}<span class="faq-ic">${I.mais}</span></button></h3>
        <div class="faq-resp" id="faq-${i}" role="region" aria-labelledby="faq-b${i}"><div><p>${r}</p></div></div>
      </div>`).join('')}
    </div>
  </div>
</section>

${contato}`;

// ---------- CONTEÚDOS ----------
const [destaque, ...demais] = C.artigos;
const conteudos = `<section class="blog" aria-labelledby="blog-tit">
  <div class="sec-in">
    <div class="blog-cab">
      <p class="apoio">Conteúdos</p>
      <h1 id="blog-tit" class="ci-tit"><span class="ln"><span>Atualizações</span></span> <span class="ln"><em>jurídicas.</em></span></h1>
      <p>Conteúdos produzidos pela equipe sobre os temas das nossas áreas. Análises, mudanças na legislação e orientações gerais para compreender melhor direitos e deveres.</p>
      <div class="filtro" role="group" aria-label="Filtrar conteúdos" data-iguais data-filtro-blog>
        <button type="button" aria-pressed="true" data-area="todas">Ver todos</button>
        ${C.areas.map((a) => `<button type="button" aria-pressed="false" data-area="${a.id}">${curto(a)}</button>`).join('')}
      </div>
    </div>
    <div class="blog-grade" data-blog>
      ${cartaoArtigo(destaque, true)}
      ${demais.map((a) => cartaoArtigo(a)).join('')}
    </div>
    <p class="blog-vazio" data-blog-vazio hidden>Ainda não há conteúdos desta área. Veja os outros temas.</p>
    <p class="blog-mais"><button type="button" class="ver-mais" data-ver-mais><span>Ver mais</span>${I.baixo}</button></p>
  </div>
</section>
${janelaArtigo}`;

// ---------- 404 (arquivo único, CSS dentro, links a partir da raiz) ----------
const pagina404 = `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página não encontrada | ${M.completo}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/assets/img/emblema.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Public+Sans:wght@400;500&display=swap" rel="stylesheet">
${T.head(TEMA_CHAVE)}
<style>
:root { --fundo: #EEF1F2; --tinta: #13212C; --texto: #3B4954; --lima: #D6EBB6; --linha: rgba(19,33,44,.14); color-scheme: light; }
[data-tema="escuro"] { --fundo: #0D171F; --tinta: #EAF0F0; --texto: #B8C4CA; --linha: rgba(234,240,240,.14); color-scheme: dark; }
* { box-sizing: border-box; margin: 0; }
body { min-height: 100dvh; display: grid; place-items: center; padding: 32px 16px; background: var(--fundo); color: var(--texto); font: 400 17px/1.6 "Public Sans", Arial, sans-serif; text-align: center; }
main { max-width: 560px; }
.num { display: flex; align-items: center; justify-content: center; gap: 6px; font: 500 clamp(110px, 26vw, 190px)/1 "Cormorant Garamond", Georgia, serif; color: var(--tinta); }
.num svg { width: .62em; height: .7em; color: var(--tinta); overflow: visible; }
.trav { transform-origin: 32px 28px; animation: pende 3.2s ease-in-out infinite; }
.prato-e, .prato-d { animation: contra 3.2s ease-in-out infinite; }
.prato-e { transform-origin: 16px 28px; } .prato-d { transform-origin: 48px 28px; }
@keyframes pende { 0%, 100% { transform: rotate(-16deg); } 50% { transform: rotate(16deg); } }
@keyframes contra { 0%, 100% { transform: rotate(16deg); } 50% { transform: rotate(-16deg); } }
h1 { font: 500 clamp(30px, 5vw, 42px)/1.15 "Cormorant Garamond", Georgia, serif; color: var(--tinta); margin: 18px 0 10px; }
p { margin: 0 auto 28px; max-width: 44ch; }
.btns { display: inline-grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 10px; }
a { display: inline-flex; align-items: center; justify-content: center; height: 50px; padding: 0 22px; border-radius: 12px; text-decoration: none; font-weight: 500; }
.a1 { background: var(--tinta); color: var(--fundo); } .a2 { border: 1px solid var(--linha); color: var(--tinta); }
a:hover { background: var(--lima); color: #13212C; border-color: var(--lima); }
@media (max-width: 480px) { .btns { grid-auto-flow: row; width: 100%; } }
@media (prefers-reduced-motion: reduce) { .trav, .prato-e, .prato-d { animation: none; } }
</style>
</head>
<body>
<main>
  <p class="num" aria-label="404"><span>4</span><svg viewBox="0 0 64 72" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 70V30a26 26 0 0 1 52 0v40"/><path d="M22 62h20M32 24v38"/><g class="trav"><path d="M16 28h32"/><g class="prato-e"><path d="M16 28l-6 14M16 28l6 14M8.5 42a7.5 4 0 0 0 15 0Z"/></g><g class="prato-d"><path d="M48 28l-6 14M48 28l6 14M40.5 42a7.5 4 0 0 0 15 0Z"/></g></g><circle cx="32" cy="22" r="2.6" fill="currentColor" stroke="none"/></svg><span>4</span></p>
  <h1>Esta página saiu da pauta.</h1>
  <p>O endereço não existe ou mudou de lugar. A balança ainda procura o equilíbrio, mas você pode voltar ao início ou falar com a equipe.</p>
  <div class="btns"><a class="a1" href="/">Voltar ao início</a><a class="a2" href="${wa('Olá! Vim pelo site da Vilela Rocha Advocacia.')}" target="_blank" rel="noopener">Falar no WhatsApp</a></div>
</main>
</body>
</html>
`;

// ---------- grava ----------
const copiaPasta = (de, para) => {
  fs.mkdirSync(para, { recursive: true });
  for (const f of fs.readdirSync(de)) fs.copyFileSync(path.join(de, f), path.join(para, f));
};

fs.rmSync(SAIDA, { recursive: true, force: true });
fs.mkdirSync(path.join(SAIDA, 'assets', 'img'), { recursive: true });
copiaPasta(path.join(__dirname, 'img', 'fotos'), path.join(SAIDA, 'assets', 'img', 'fotos'));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_caminho-das-arvores.webp'), path.join(SAIDA, 'assets', 'img', 'mapa_caminho-das-arvores.webp'));
fs.writeFileSync(path.join(SAIDA, 'assets', 'img', 'emblema.svg'), emblema().replace('class="emblema "', 'xmlns="http://www.w3.org/2000/svg"').replace(/currentColor/g, '#13212C'));
fs.writeFileSync(path.join(SAIDA, 'assets', 'style.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
fs.writeFileSync(path.join(SAIDA, 'assets', 'app.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + T.js(TEMA_CHAVE, COR_CLARO, COR_ESCURO));

const desc = `${M.completo}: advocacia cível, trabalhista, empresarial, de família e previdenciária em ${M.cidade}, ${M.uf}, e por videochamada.`;
fs.writeFileSync(path.join(SAIDA, 'index.html'), pagina('index.html', `${M.completo} | Advocacia em ${M.cidade}`, desc, inicio));
fs.writeFileSync(path.join(SAIDA, 'escritorio.html'), pagina('escritorio.html', `O escritório e a equipe | ${M.completo}`, `Conheça a ${M.completo}, os advogados, as políticas de atendimento, honorários e confidencialidade.`, escritorio));
fs.writeFileSync(path.join(SAIDA, 'atuacao.html'), pagina('atuacao.html', `Áreas de atuação | ${M.completo}`, `Serviços nas áreas cível, trabalhista, empresarial, de família e previdenciária, como funciona o atendimento e agendamento de reunião.`, atuacao));
fs.writeFileSync(path.join(SAIDA, 'conteudos.html'), pagina('conteudos.html', `Conteúdos | ${M.completo}`, `Atualizações jurídicas da equipe da ${M.completo}, em linguagem simples.`, conteudos));
fs.writeFileSync(path.join(SAIDA, '404.html'), pagina404);
fs.writeFileSync(path.join(SAIDA, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${M.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(SAIDA, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGINAS.map(([p]) => `  <url><loc>${M.dominio}/${p === 'index.html' ? '' : p}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log('ok', path.relative(process.cwd(), SAIDA));
