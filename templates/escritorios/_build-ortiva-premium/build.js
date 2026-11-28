// Gera o Ortiva Premium (contabilidade) em templates/escritorios/premium/ortiva-premium/.
// Uso: node templates/escritorios/_build-ortiva-premium/build.js
// Páginas: index.html (início), escritorio.html (o escritório e as políticas), profissionais.html (a equipe),
// servicos.html (frentes, simulador, agendamento e dúvidas), conteudos.html (artigos) e 404.html.
// Textos e dados ficam no content.js; interações no app.js; o botão de tema vem de templates/_comum/tema-prumo.js.
const fs = require('fs');
const path = require('path');
const C = require('./content');
const { I, emblema } = require('./icons');
const T = require('../../_comum/tema-prumo');

const M = C.marca;
const SAIDA = path.join(__dirname, '..', 'premium', 'ortiva-premium');
const TEMA_CHAVE = 'ortiva-tema';
const COR_CLARO = '#F4F5EF';
const COR_ESCURO = '#071315';
const creditos = JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'creditos.json'), 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const foto = (nome) => `assets/img/fotos/${nome}.webp`;
const eq = Object.fromEntries(C.equipe.map((p) => [p.id, p]));
const sg = Object.fromEntries(C.segmentos.map((s) => [s.id, s]));
const endereco = `${M.rua}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const dataBR = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
const primeiro = (nome) => nome.split(' ')[0];
const WA_OLA = 'Olá! Vim pelo site da Ortiva Contabilidade.';

// peso do prumo pequeno, usado como separador na faixa corrida (no lugar de bolinha ou ponto médio)
const PESO = '<svg class="peso-sep" viewBox="0 0 14 20" aria-hidden="true"><path d="M7 0l7 7.5L7 20 0 7.5Z" fill="currentColor"/></svg>';

// botão da marca: barras de gráfico sobem no hover e o texto rola; data-magnetic puxa para o mouse
const btn = (href, txt, cls = 'btn-lima', extra = '') => `<a class="btn ${cls}" href="${href}" data-magnetic${extra}><span class="btn-barras" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span class="btn-txt" data-txt="${esc(txt)}"><span>${txt}</span></span>${I.dir}</a>`;
const botao = (txt, cls = 'btn-tinta', extra = '', ic = I.dir) => `<button class="btn ${cls}" data-magnetic${extra}><span class="btn-barras" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span class="btn-txt" data-txt="${esc(txt)}"><span>${txt}</span></span>${ic}</button>`;
// título de seção: as palavras sobem uma a uma (o app.js separa as palavras)
const tit = (tag, id, html, cls = '') => `<${tag}${id ? ` id="${id}"` : ''} class="palavras ${cls}">${html}</${tag}>`;

// ---------- partes comuns ----------
const PAGINAS = [
  ['index.html', 'Início'],
  ['escritorio.html', 'O escritório'],
  ['profissionais.html', 'Profissionais'],
  ['servicos.html', 'Serviços'],
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
<meta property="og:image" content="${M.dominio}/${foto('capa-predio')}">
<link rel="icon" href="assets/img/emblema.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Azeret+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
${T.head(TEMA_CHAVE)}
<script>try{var r=document.documentElement,s=sessionStorage;if(s.getItem("ortiva-cg")||matchMedia("(prefers-reduced-motion: reduce)").matches)r.classList.add("sem-cg");if(s.getItem("ortiva-troca")){r.classList.add("chegando");s.removeItem("ortiva-troca");}}catch(e){}</script>
</head>`;

// carregando: o fio desce, o peso balança até ficar no prumo, o contador chega a 100 e a tela sobe
const carregando = `<div class="carregando" aria-hidden="true">
  <div class="cg-fio"><span class="cg-pendulo"><i class="cg-peso"></i></span></div>
  <p class="cg-nome">${'ortiva'.split('').map((l, i) => `<span style="--i:${i}">${l}</span>`).join('')}</p>
  <p class="cg-rodape"><span>Alinhando os números</span><span class="cg-num"><b data-cg-num>0</b>%</span></p>
</div>
<div class="cortina" aria-hidden="true"><span class="cortina-fio"></span>${emblema('cortina-emblema')}</div>`;

const logo = (cls = '') => `<a class="logo ${cls}" href="index.html" aria-label="${M.completo}, início">${emblema()}<span class="logo-txt"><b>ortiva</b><small>Contabilidade</small></span></a>`;

const topo = (pagina) => {
  const links = PAGINAS.map(([href, nome]) => `<a href="${href}"${href === pagina ? ' aria-current="page"' : ''}>${nome}</a>`).join('');
  return `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo" data-topo>
  <div class="topo-in">
    ${logo()}
    <nav class="nav" aria-label="Principal">${links}</nav>
    ${btn('servicos.html#agendar', 'Agendar conversa', 'btn-lima topo-cta')}
    <button type="button" class="menu-btn" data-menu aria-expanded="false" aria-controls="menu-cel" aria-label="Abrir menu"><span class="mb-linhas" aria-hidden="true"><i></i><i></i></span></button>
  </div>
  <div class="menu-cel" id="menu-cel" inert>
    <nav aria-label="Menu do celular">${links}</nav>
    ${btn('servicos.html#agendar', 'Agendar conversa')}
    <div class="menu-tema"><span>Tema</span>${T.compacto('claro')}</div>
  </div>
</header>
${T.prumo('tema-lado', 'claro')}`;
};

const rodape = `<footer class="rodape">
  <div class="rod-in">
    <div class="rod-topo">
      <div class="rod-marca">
        ${logo('logo-grande')}
        <p class="rod-frase">Contabilidade consultiva para empresas e pessoas que querem decidir com os números na mão.</p>
        <div class="redes"><a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${M.instagramUser}">${I.insta}</a><a href="${M.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${I.linkedin}</a><a href="${wa(WA_OLA)}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a></div>
      </div>
      <div class="rod-cols">
        <div><h3>Escritório</h3><ul><li><a href="escritorio.html">Quem somos</a></li><li><a href="profissionais.html">Profissionais</a></li><li><a href="escritorio.html#politicas">Políticas</a></li><li><a href="conteudos.html">Conteúdos</a></li><li><a href="servicos.html#duvidas">Dúvidas</a></li></ul></div>
        <div><h3>Serviços</h3><ul>${C.segmentos.map((s) => `<li><a href="servicos.html#${s.id}">${s.nome}</a></li>`).join('')}<li><a href="servicos.html#simulador">Simulador de regime</a></li></ul></div>
        <div><h3>Canais de atendimento</h3><ul class="rod-canais">
          <li>${I.fone}<a href="tel:${M.telefoneLink}">${M.telefone}</a></li>
          <li>${I.whats}<a href="${wa(WA_OLA)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li>
          <li>${I.email}<a href="mailto:${M.email}">${M.email}</a></li>
          <li>${I.predio}<span>Presencial, com hora marcada</span></li>
          <li>${I.video}<span>Videochamada para todo o Brasil</span></li>
        </ul></div>
        <div><h3>Horário</h3><ul class="rod-horario">${C.horarioTexto.map((h) => `<li>${h}</li>`).join('')}</ul><p class="aberto" data-aberto></p></div>
      </div>
    </div>
    <div class="mapa-linha">
      <div class="map-box">
        <img src="assets/img/mapa_batel.webp" alt="Mapa do ${M.bairro}, em ${M.cidade}, com a localização da ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"></span>
        <div class="map-info"><b>${M.completo}</b><span>${endereco}, CEP ${M.cep}</span><span>${C.horarioTexto.slice(0, 2).join('. ')}</span>
          <div class="mbtns"><a href="${M.mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${M.rotaUrl}" target="_blank" rel="noopener">${I.rota}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>No escritório, no ${M.bairro}, a duas quadras do Pátio Batel. Por videochamada e pelo portal, em todo o Brasil.</p>
        <ul class="cidades" data-iguais>${C.cidades.map((c) => `<li>${c}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="rod-legal">
      <p><b>${M.razao}</b>, CNPJ ${M.cnpj}. ${M.registroEmpresa}. Responsável técnica: ${M.responsavel}.<br>${endereco}, CEP ${M.cep}. ${M.telefone}. ${M.email}.</p>
      <ul class="rod-links">
        <li><button type="button" class="link" data-legal="servico">Termos de prestação de serviço</button></li>
        <li><button type="button" class="link" data-legal="uso">Termos de uso</button></li>
        <li><button type="button" class="link" data-legal="privacidade">Política de privacidade</button></li>
        <li><a href="escritorio.html#politicas">Atendimento, honorários e confidencialidade</a></li>
        <li><button type="button" class="link" data-cookies>Preferências de cookies</button></li>
      </ul>
      <p class="rod-aviso">Site informativo, conforme o Código de Ética Profissional do Contador (NBC PG 01). Não divulga valores de honorários e não promete resultados. Simulações são estimativas e não substituem o diagnóstico.</p>
      <p>© <span data-ano>2026</span> ${M.completo}.</p>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditos.map((c) => `<li>${c.arq}: <a href="${c.url}" target="_blank" rel="noopener">${esc(c.autor)}</a>, ${c.fonte}</li>`).join('')}<li>Mapa: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">colaboradores do OpenStreetMap</a></li></ul></details>
    </div>
  </div>
  <p class="rod-gigante" aria-hidden="true">ortiva</p>
</footer>
<a class="whats-flutua" href="${wa('Olá! Vim pelo site da Ortiva Contabilidade e gostaria de conversar com um contador.')}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp" data-magnetic>${I.whats}<span>WhatsApp</span></a>
<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Guardamos no seu navegador o tema escolhido e esta preferência. A medição de visitas só é ligada se você aceitar. <button type="button" class="link" data-legal="privacidade">Saiba mais</button></p>
  <div class="ck-btns" data-iguais><button type="button" class="btn btn-tinta" data-ck="todos"><span class="btn-txt" data-txt="Aceitar todos"><span>Aceitar todos</span></span></button><button type="button" class="btn btn-linha" data-ck="essenciais"><span class="btn-txt" data-txt="Só os essenciais"><span>Só os essenciais</span></span></button></div>
</div>`;

// ---------- janelas legais (todas as páginas) ----------
const LEGAIS = {
  servico: ['Termos de prestação de serviço', `
    <p>Estes termos resumem como a ${M.razao} presta serviços contábeis. O que vale para cada cliente é o contrato de prestação de serviços assinado, que prevalece sobre este resumo.</p>
    <h3>Contratação</h3><p>O serviço começa depois do diagnóstico, da proposta por escrito e do contrato assinado pelas duas partes. O contrato descreve o escopo, os prazos, os honorários e seu reajuste, e o contador responsável por cada frente, com o registro no CRC.</p>
    <h3>Responsabilidade técnica</h3><p>O escritório executa os serviços com técnica e zelo, conforme as Normas Brasileiras de Contabilidade. O valor dos tributos depende da lei, das informações e dos documentos do cliente: nenhuma simulação ou estudo é garantia de economia.</p>
    <h3>Documentos e prazos</h3><p>O cliente envia os documentos do mês até o dia 5, pelo portal. Documentos fora do prazo podem mudar a data das entregas, e o escritório avisa por escrito o que muda. Multas causadas por atraso do cliente ficam com o cliente; por falha do escritório, com o escritório.</p>
    <h3>Comunicação</h3><p>Guias, relatórios e avisos são enviados pelo portal e pelos canais combinados no contrato.</p>
    <h3>Sigilo</h3><p>O escritório guarda sigilo sobre tudo o que souber em razão do trabalho, conforme o Código de Ética Profissional do Contador (NBC PG 01) e a LGPD.</p>
    <h3>Encerramento</h3><p>Qualquer das partes pode encerrar o contrato com o aviso prévio previsto nele. O escritório entrega a documentação e as informações necessárias ao novo responsável.</p>`],
  uso: ['Termos de uso', `
    <p>Ao usar este site, você concorda com estes termos. O site da ${M.completo} tem caráter informativo e segue o Código de Ética Profissional do Contador.</p>
    <h3>Conteúdo informativo</h3><p>Os conteúdos explicam temas contábeis e tributários de forma geral e não substituem a orientação para o seu caso. As regras mudam com frequência: confira a data de cada texto.</p>
    <h3>Simulador</h3><p>O simulador de regime tributário usa premissas simplificadas e números que você informa. O resultado é uma estimativa para comparação, não uma recomendação nem uma promessa de economia.</p>
    <h3>Formulários</h3><p>Use os formulários só para dizer o assunto e combinar o contato. Não envie documentos, senhas ou dados bancários por eles.</p>
    <h3>Propriedade</h3><p>Textos, marca e imagens pertencem ao escritório ou aos autores indicados nos créditos. A reprodução dos conteúdos é permitida com citação da fonte.</p>
    <h3>Links externos</h3><p>Links para outros sites, como mapas e redes sociais, abrem em nova aba e seguem as regras desses serviços.</p>`],
  privacidade: ['Política de privacidade', `
    <p>A ${M.razao}, CNPJ ${M.cnpj}, é a controladora dos dados enviados por este site e os trata conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018) e o sigilo profissional do contador.</p>
    <h3>Dados que coletamos</h3><p>Nome, e-mail, telefone ou WhatsApp, empresa, assunto e a mensagem que você escrever nos formulários de contato, de agendamento e de conteúdos por e-mail. Os números digitados no simulador ficam só no seu navegador e não são enviados.</p>
    <h3>Para que usamos</h3><p>Só para responder ao seu pedido, marcar a conversa e, se você pedir, enviar os conteúdos por e-mail. Não vendemos nem compartilhamos dados para publicidade.</p>
    <h3>Confidencialidade</h3><p>Os dados enviados são tratados como confidenciais e acessados apenas pela equipe que vai atender você.</p>
    <h3>Por quanto tempo guardamos</h3><p>Pedidos que não viram contratação são apagados em até 6 meses. Dados de clientes são guardados pelo tempo exigido pela lei fiscal e trabalhista.</p>
    <h3>Seus direitos</h3><p>Você pode pedir acesso, correção, portabilidade ou exclusão dos seus dados, e retirar o consentimento, pelo e-mail ${M.email}. Encarregada de dados: ${M.responsavel.split(',')[0]}.</p>
    <h3>Cookies e armazenamento</h3><p>O site guarda no seu navegador: a escolha de cookies (ortiva-cookies), o tema claro ou escuro (ortiva-tema) e marcações temporárias da visita (abertura e passagem entre páginas). A medição de visitas, quando existir, só é ligada depois de "Aceitar todos". Não usamos cookies de publicidade. Você pode mudar a escolha em "Preferências de cookies", no rodapé.</p>`],
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
  equipe: C.equipe.map(({ id, nome, crc, segmentos, agenda, foto: f }) => ({ id, nome, crc, segmentos, agenda, foto: foto(f) })),
  segmentos: C.segmentos.map((s) => ({ id: s.id, nome: s.nome })),
  agendaFiscal: C.agendaFiscal,
  artigos: C.artigos.map((a) => ({ ...a, autorNome: eq[a.autor].nome, autorCrc: eq[a.autor].crc, segNome: sg[a.segmento].nome, dataTexto: dataBR(a.data), foto: foto(a.foto) })),
};

const pagina = (arquivo, titulo, desc, corpo) => `${head(arquivo, titulo, desc)}
<body data-pagina="${arquivo.replace('.html', '')}">
${carregando}
${topo(arquivo)}
<main id="conteudo">
${corpo}
</main>
${rodape}
${janelas}
<script type="application/json" id="pr-dados">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>
<script src="assets/app.js" defer></script>
</body>
</html>
`;

// ---------- blocos reaproveitados entre páginas ----------
// como funciona: o fio do prumo desce pela linha do tempo e o peso acompanha a rolagem
const comoFunciona = `<section class="como" id="como" aria-labelledby="como-tit">
  <div class="sec-in como-grade">
    <div class="sec-cab como-cab">
      <p class="apoio">Como funciona</p>
      ${tit('h2', 'como-tit', 'Do primeiro contato à rotina do mês, <em>tudo no prumo.</em>')}
      <p>Você sabe o que acontece em cada etapa, quem cuida de cada frente e quando recebe cada entrega.</p>
      <div class="compromissos">
        ${C.compromissos.map((c) => `<div class="comp"><h3>${c.titulo}</h3><p>${c.texto}</p></div>`).join('')}
      </div>
    </div>
    <ol class="fio-tempo" data-fio>
      <li class="ft-fio" aria-hidden="true"><i></i><b class="ft-peso"></b></li>
      ${C.atendimento.map((e) => `<li class="ft-etapa" data-etapa>
        <div class="ft-cartao"><h3>${e.titulo}</h3><p>${e.texto}</p><p class="ft-nota">${I.relogio}<span>${e.nota}</span></p></div>
      </li>`).join('')}
    </ol>
  </div>
</section>`;

const contato = `<section class="contato" id="contato" aria-labelledby="contato-tit">
  <div class="sec-in contato-in">
    <div class="contato-txt">
      <p class="apoio">Contato</p>
      ${tit('h2', 'contato-tit', 'Conte o momento da empresa. <em>A gente responde em 1 dia útil.</em>')}
      <p>Diga o assunto e o melhor canal. Documentos e números ficam para a conversa e para o portal, protegidos pelo sigilo profissional.</p>
      <ul class="contato-canais">
        <li>${I.whats}<a href="${wa(WA_OLA)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li>
        <li>${I.fone}<a href="tel:${M.telefoneLink}">${M.telefone}</a></li>
        <li>${I.email}<a href="mailto:${M.email}">${M.email}</a></li>
        <li>${I.pino}<span>${M.rua}, ${M.bairro}</span></li>
      </ul>
      <p class="urgente">${I.calendario}<span><b>Guia vencendo hoje?</b> Ligue ou mande "prazo" no WhatsApp. O formulário não é o canal para urgências.</span></p>
    </div>
    <form class="form" data-contato novalidate>
      <div class="form-grade">
        <label class="campo"><span>Nome completo</span><input name="nome" autocomplete="name" required></label>
        <label class="campo"><span>E-mail</span><input name="email" type="email" autocomplete="email" required></label>
        <label class="campo"><span>WhatsApp</span><input name="fone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(41) 90000-0000" data-mascara required></label>
        <label class="campo"><span>Empresa (opcional)</span><input name="empresa" autocomplete="organization"></label>
        <label class="campo campo-largo"><span>Assunto</span><select name="assunto" required><option value="">Escolha a frente</option>${C.segmentos.map((s) => `<option>${s.nome}</option>`).join('')}<option>Ainda não sei</option></select></label>
      </div>
      <fieldset class="opcoes"><legend>Prefere o retorno por</legend><div class="opcoes-in" data-iguais>
        <label><input type="radio" name="retorno" value="WhatsApp" checked><span>WhatsApp</span></label>
        <label><input type="radio" name="retorno" value="E-mail"><span>E-mail</span></label>
        <label><input type="radio" name="retorno" value="Telefone"><span>Telefone</span></label>
      </div></fieldset>
      <label class="campo"><span>Em poucas linhas, o que você precisa</span><textarea name="msg" rows="3" maxlength="400" placeholder="Ex.: quero trocar de contador e revisar o regime para 2027"></textarea><small class="contador" data-contador>0 de 400</small></label>
      <p class="sigilo">${I.cadeado}<span>Os dados enviados são confidenciais e usados só para responder a você. Não inclua documentos, senhas ou dados bancários.</span></p>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Li e aceito a <button type="button" class="link" data-legal="privacidade">Política de privacidade</button> e autorizo o contato sobre este pedido.</span></label>
      ${botao('Enviar pedido de contato', 'btn-tinta', ' type="submit"')}
      <p class="form-msg" data-msg role="status"></p>
      <div class="form-ok" data-ok hidden>
        <h3>Pedido recebido</h3>
        <p>Protocolo <b data-protocolo></b>. A equipe responde em até 1 dia útil pelo canal escolhido.</p>
        <a class="btn btn-linha" data-ok-wa href="#" target="_blank" rel="noopener"><span class="btn-txt" data-txt="Adiantar pelo WhatsApp"><span>Adiantar pelo WhatsApp</span></span>${I.whats}</a>
      </div>
    </form>
  </div>
</section>`;

const cartaoArtigo = (a, cls = '') => `<article class="art ${cls}" data-seg="${a.segmento}">
  <button type="button" class="art-btn" data-art="${a.id}" data-cursor="Ler" aria-label="Ler: ${esc(a.titulo)}">
    <span class="art-foto revela"><img src="${foto(a.foto)}" alt="" width="1500" height="1000" loading="lazy"></span>
    <span class="art-txt">
      <span class="etiqueta">${sg[a.segmento].nome}</span>
      <span class="art-tit">${a.titulo}</span>
      <span class="art-res">${a.resumo}</span>
      <span class="art-meta">${eq[a.autor].nome}, ${dataBR(a.data)}, ${a.leitura} min</span>
    </span>
  </button>
</article>`;

const janelaArtigo = `<dialog class="janela jan-art" data-jan-art aria-labelledby="ja-tit">
  <div class="jan-in"><button type="button" class="jan-fechar" data-fechar aria-label="Fechar">${I.fechar}</button>
    <img data-ja-foto src="" alt="" width="1500" height="1000">
    <div class="ja-txt"><p class="etiqueta" data-ja-seg></p><h2 id="ja-tit" data-ja-tit></h2><p class="ja-meta" data-ja-meta></p><div data-ja-corpo></div>
      <p class="ja-aviso">Conteúdo informativo, com as regras vigentes na data de publicação. Não substitui a orientação de um contador para o seu caso.</p>
      ${btn('servicos.html#agendar', 'Agendar uma conversa', 'btn-tinta')}</div>
  </div>
</dialog>`;

// capa escura das páginas internas
const capaInterna = (id, apoio, linhas, sub, extra = '', fotoNome = '') => `<section class="capa-int" aria-labelledby="${id}">
  ${fotoNome ? `<img class="ci-foto" src="${foto(fotoNome)}" alt="" width="1500" height="1000" fetchpriority="high">` : ''}
  <svg class="ci-fio" viewBox="0 0 40 900" preserveAspectRatio="none" aria-hidden="true"><path d="M20 0v900"/></svg>
  <div class="ci-in">
    <p class="apoio">${apoio}</p>
    <h1 id="${id}" class="ci-tit">${linhas.map((l) => `<span class="ln"><span>${l}</span></span>`).join(' ')}</h1>
    ${sub ? `<p class="ci-sub">${sub}</p>` : ''}
    ${extra}
  </div>
</section>`;

// ---------- INÍCIO ----------
const prox = C.agendaFiscal.slice(2, 5);
const inicio = `<section class="capa" aria-labelledby="capa-tit">
  <div class="capa-in" data-capa>
    <p class="apoio capa-apoio">Contabilidade em ${M.cidade} desde ${M.desde}</p>
    <h1 id="capa-tit" class="capa-tit"><span class="ln"><span>Seu negócio,</span></span> <span class="ln"><em>no prumo.</em></span></h1>
    <div class="capa-baixo">
      <p class="capa-sub">Contabilidade consultiva, fiscal, folha e financeiro para empresas que querem entender os próprios números. No ${M.bairro} ou por vídeo, em todo o Brasil.</p>
      <a class="capa-redondo" href="servicos.html#agendar" data-magnetic data-cursor="Agendar"><span>Agendar conversa</span>${I.diag}</a>
    </div>
  </div>
  <figure class="capa-foto" data-capa-foto>
    <img src="${foto('capa-predio')}" alt="Fachada de vidro de um prédio comercial entre árvores" width="1920" height="1080" fetchpriority="high">
    <figcaption class="capa-legenda"><span class="apoio">Rotina em dia</span><b>Fechamento até o dia 20. Decisão com calma.</b></figcaption>
    <aside class="agenda-viva" aria-label="Próximos vencimentos gerais" data-agenda-viva>
      <p class="av-cab"><span>Agenda fiscal</span><span class="av-ao-vivo">${I.grafico}ao vivo</span></p>
      <ul data-av-lista>${prox.map((o) => `<li><b>${o.nome}</b><span>dia ${o.dia}</span></li>`).join('')}</ul>
      <p class="av-nota">Calendário geral de referência. O da sua empresa fica no portal.</p>
    </aside>
  </figure>
</section>
<div class="faixa" aria-hidden="true"><div class="faixa-in">${Array(4).fill(C.segmentos.map((s) => `<span>${s.nome}</span>${PESO}`).join('')).join('')}</div></div>

<section class="frentes" id="frentes" aria-labelledby="frentes-tit" data-frentes>
  <div class="frentes-pin">
    <div class="sec-in frentes-cab">
      <p class="apoio">O que fazemos</p>
      ${tit('h2', 'frentes-tit', 'Seis frentes, <em>uma contabilidade só.</em>')}
      <p>Cada frente tem um contador responsável, com registro no CRC-PR. Role para passar por elas.</p>
    </div>
    <div class="frentes-janela">
      <ul class="frentes-trilho" data-trilho-h>
        ${C.segmentos.map((s) => `<li class="frente"><a href="servicos.html#${s.id}" data-cursor="Ver">
          <span class="fr-foto"><img src="${foto(s.foto)}" alt="" width="1500" height="1000" loading="lazy"></span>
          <span class="fr-txt">
            <span class="fr-nome">${s.nome}</span>
            <span class="fr-res">${s.resumo}</span>
            <span class="fr-lista">${s.servicos.map((x) => `<span>${x.nome}</span>`).join('')}</span>
            <span class="fr-quem">${C.equipe.filter((p) => p.segmentos.includes(s.id)).map((p) => `<img src="${foto(p.foto)}" alt="${p.nome}" width="880" height="1100" loading="lazy">`).join('')}<span>${C.equipe.filter((p) => p.segmentos.includes(s.id)).map((p) => primeiro(p.nome)).join(' e ')}</span></span>
          </span>
          <span class="fr-seta">${I.diag}</span>
        </a></li>`).join('')}
        <li class="frente frente-fim"><a href="servicos.html" data-cursor="Abrir"><span class="fr-nome">Ver todos os serviços, prazos e o que inclui cada um</span><span class="fr-seta">${I.dir}</span></a></li>
      </ul>
    </div>
    <div class="lado-ctrl" aria-label="Passar as frentes" role="group"><button type="button" data-lado="-1" data-alvo=".frentes-janela" aria-label="Anterior">${I.esq}</button><button type="button" data-lado="1" data-alvo=".frentes-janela" aria-label="Próximo">${I.dir}</button></div>
    <div class="frentes-prog" aria-hidden="true"><i></i></div>
  </div>
</section>

<section class="visao" aria-labelledby="visao-tit">
  <figure class="visao-foto revela"><img src="${foto('predio-pb')}" alt="Prédio de escritórios em preto e branco" width="1050" height="1400" loading="lazy"><figcaption>Ortiva, desde ${M.desde}</figcaption></figure>
  <div class="visao-txt">
    <p class="apoio">Nossa visão</p>
    ${tit('h2', 'visao-tit', 'Crescer pede números claros, <em>não complicados.</em>')}
    <p>Acreditamos numa contabilidade presente, que explica antes de entregar e avisa antes do prazo. O dono da empresa não precisa virar contador: precisa entender o suficiente para decidir.</p>
    <dl class="numeros">${C.numeros.map((n) => `<div><dt data-conta="${n.valor}"${n.ano ? ' data-ano-conta' : ''}>${n.valor}</dt><dd>${n.texto}</dd></div>`).join('')}</dl>
    ${btn('escritorio.html', 'Conhecer o escritório', 'btn-lima')}
  </div>
</section>

<section class="painel" aria-labelledby="painel-tit">
  <div class="sec-in">
    <div class="sec-cab sec-cab-lado">
      ${tit('h2', 'painel-tit', 'O mês fechado vira um relatório <em>que se lê em cinco minutos.</em>')}
      <p>Receita, margem, impostos e caixa num painel só, com a explicação da contadora. Passe o mouse para girar o gráfico.</p>
    </div>
    <div class="painel-palco" data-palco3d data-cursor="Girar">
      <div class="p3d-cena"><div class="p3d-plano">
        ${[0.42, 0.5, 0.47, 0.58, 0.62, 0.55, 0.68, 0.72, 0.66, 0.8, 0.86, 0.94].map((v, i) => `<div class="b3d${i === 11 ? ' b3d-atual' : ''}" style="--v:${v};--i:${i}"><i class="f-topo"></i><i class="f-frente"></i><i class="f-lado"></i></div>`).join('')}
        <span class="p3d-sombra"></span>
      </div></div>
      <div class="pc pc-receita"><span>Receita no ano</span><b data-conta-moeda="842680">R$ 842.680</b><small>12 meses, dados fictícios</small></div>
      <div class="pc pc-margem"><span>Margem do mês</span><b><span data-conta="24">24</span>%</b><small>meta da empresa: 22%</small></div>
      <div class="pc pc-impostos"><span>Impostos sobre a receita</span><b><span data-conta="9">9</span>%</b><small>regime atual: Lucro Presumido</small></div>
      <div class="pc pc-passo"><span>Próximo passo</span><b>Revisão de enquadramento em janeiro</b><small>com Otávio Mendes</small></div>
      <p class="painel-nota">Exemplo do relatório mensal, com dados fictícios. Números reais só no portal do cliente.</p>
    </div>
  </div>
</section>

<section class="sim-chamada" aria-labelledby="simc-tit">
  <div class="sec-in simc-in">
    <div class="simc-txt">
      <p class="apoio">Simulador</p>
      ${tit('h2', 'simc-tit', 'Simples, Presumido ou Real? <em>Compare em um minuto.</em>')}
      <p>Informe atividade, faturamento e folha e veja uma estimativa dos três regimes lado a lado. Os números ficam só no seu navegador.</p>
      ${btn('servicos.html#simulador', 'Abrir o simulador', 'btn-lima')}
    </div>
    <div class="simc-barras" aria-hidden="true">
      <div style="--a:.74"><i></i><span>Simples</span></div>
      <div style="--a:.92"><i></i><span>Presumido</span></div>
      <div style="--a:.58"><i></i><span>Real</span></div>
    </div>
  </div>
</section>

${comoFunciona}

<section class="equipe-home" aria-labelledby="eqh-tit">
  <div class="sec-in">
    <div class="sec-cab sec-cab-lado">
      ${tit('h2', 'eqh-tit', 'Quem cuida <em>dos seus números.</em>')}
      <p>Cinco contadores, cada um responsável por uma frente, com registro no CRC-PR e agenda própria.</p>
    </div>
    <ul class="leque" data-leque>
      ${C.equipe.map((p, i) => `<li style="--i:${i};--n:${C.equipe.length}"><a href="profissionais.html#${p.id}" data-cursor="Ver">
        <span class="lq-foto"><img src="${foto(p.foto)}" alt="${p.nome}, ${p.cargo.toLowerCase()}" width="880" height="1100" loading="lazy"></span>
        <span class="lq-txt"><b>${p.nome}</b><span>${p.crc}</span><small>${p.segmentos.map((s) => sg[s].curto).join(' e ')}</small></span>
      </a></li>`).join('')}
    </ul>
    <div class="lado-ctrl" aria-label="Passar os profissionais" role="group"><button type="button" data-lado="-1" data-alvo=".leque" aria-label="Anterior">${I.esq}</button><button type="button" data-lado="1" data-alvo=".leque" aria-label="Próximo">${I.dir}</button></div>
    <p class="eqh-mais">${btn('profissionais.html', 'Ver os profissionais', 'btn-linha')}</p>
  </div>
</section>

${C.depoimentos.mostrar ? `<section class="depo" aria-labelledby="depo-tit">
  <figure class="depo-foto revela"><img src="${foto('equipe-risos')}" alt="Duas pessoas conversando e rindo no escritório" width="1050" height="1400" loading="lazy"></figure>
  <div class="depo-txt">
    <p class="apoio">Sobre o atendimento</p>
    ${tit('h2', 'depo-tit', 'O que os clientes dizem <em>do jeito de trabalhar.</em>')}
    <div class="pilha" data-pilha aria-roledescription="carrossel" aria-label="Depoimentos" data-cursor="Arrastar">
      ${C.depoimentos.itens.map((d, i) => `<blockquote class="pl-carta" style="--k:${i}" aria-hidden="${i !== 0}">${I.aspas}<p>${d.texto}</p><footer><b>${d.nome}</b><span>${d.sobre}</span></footer></blockquote>`).join('')}
    </div>
    <div class="pilha-ctrl"><p class="pilha-conta" data-pilha-conta aria-live="polite"></p><div class="setas"><button type="button" data-pl-ant aria-label="Depoimento anterior" data-magnetic>${I.esq}</button><button type="button" data-pl-prox aria-label="Próximo depoimento" data-magnetic>${I.dir}</button></div></div>
    <p class="aviso-exemplo">${C.depoimentos.aviso}</p>
  </div>
</section>` : ''}

<section class="conteudos-home" aria-labelledby="ch-tit">
  <div class="sec-in">
    <div class="sec-cab sec-cab-lado">
      ${tit('h2', 'ch-tit', 'Conteúdos <em>para decidir melhor.</em>')}
      <p>Reforma tributária, folha, imposto de renda e caixa explicados pela equipe, em linguagem simples.</p>
    </div>
    <div class="colagem">
      ${C.artigos.slice(0, 3).map((a, i) => cartaoArtigo(a, `col-${i}`)).join('')}
    </div>
    <p class="ch-mais">${btn('conteudos.html', 'Ver todos os conteúdos', 'btn-linha')}</p>
  </div>
</section>

<section class="final" aria-labelledby="final-tit">
  <svg class="final-fio" viewBox="0 0 40 600" preserveAspectRatio="none" aria-hidden="true"><path d="M20 0v600"/></svg>
  <div class="final-in">
    <p class="apoio">Vamos conversar</p>
    ${tit('h2', 'final-tit', 'A próxima boa decisão da sua empresa <em>começa com uma pergunta.</em>')}
    <div class="final-btns">${btn('servicos.html#agendar', 'Agendar conversa')}${btn(wa(WA_OLA), 'Perguntar no WhatsApp', 'btn-vazado', ' target="_blank" rel="noopener"')}</div>
  </div>
</section>

${contato}
${janelaArtigo}`;

// ---------- O ESCRITÓRIO ----------
const escritorio = `${capaInterna('ce-tit', 'O escritório', ['Pequeno o bastante', '<em>para conhecer cada cliente.</em>'], `Contabilidade consultiva no ${M.bairro}, em ${M.cidade}, desde ${M.desde}. Cinco contadores, seis frentes e um jeito de trabalhar: explicar antes de entregar.`, btn('servicos.html#agendar', 'Agendar conversa'), 'sala-reuniao')}

<section class="sobre" aria-labelledby="sobre-tit">
  <div class="sec-in sobre-grade">
    <p class="frase-txt" data-frase>Ortiva vem de orto, que quer dizer reto. Nosso desenho é o prumo, o fio com um peso na ponta que mostra se uma parede está reta. É o que fazemos com os números da sua empresa: mostrar com clareza se está tudo alinhado, antes que algo entorte.</p>
    <div class="sobre-txt">
      <h2 id="sobre-tit" class="vh">Quem somos</h2>
      <p>A ${M.completo} nasceu em ${M.desde}, no ${M.bairro}, quando Laura Tavares deixou a auditoria para atender empresas pequenas e médias de perto. Hoje somos cinco contadores e uma equipe de apoio.</p>
      <p>Atendemos empresas do Simples, do Lucro Presumido e do Lucro Real, e pessoas físicas. Cada cliente tem um contador de referência por frente e um calendário de entregas no portal.</p>
      <p>O registro da organização contábil é no CRC-PR, e cada profissional assina com o próprio registro.</p>
    </div>
  </div>
  <ul class="sec-in valores">
    <li class="valor"><h3>Clareza</h3><p>Relatório que se lê, reunião que explica e resposta com nome de quem respondeu.</p></li>
    <li class="valor"><h3>Antecedência</h3><p>Guias com 5 dias de folga, avisos antes do prazo e calendário do mês sempre à vista.</p></li>
    <li class="valor"><h3>Sobriedade</h3><p>Sem promessa de economia, sem atalho fiscal. Planejamento dentro da lei, com premissas por escrito.</p></li>
  </ul>
</section>

<section class="escritorio-fotos" aria-labelledby="ef-tit">
  <div class="sec-in ef-grade">
    <div class="ef-txt">
      <p class="apoio">Por dentro</p>
      ${tit('h2', 'ef-tit', `Um conjunto no ${M.bairro}, <em>com sala de reunião e café.</em>`)}
      <p>As conversas iniciais acontecem aqui ou por vídeo. O estacionamento do prédio tem vagas para visitantes.</p>
    </div>
    <div class="carrossel" data-carrossel aria-roledescription="carrossel" aria-label="Fotos do escritório" data-cursor="Arrastar">
      <div class="car-trilho" data-trilho>
        ${C.carrossel.map((s, i) => `<figure class="car-slide" role="group" aria-roledescription="slide" aria-label="${i + 1} de ${C.carrossel.length}"><img src="${foto(s.foto)}" alt="${s.legenda}" width="1500" height="1000" loading="lazy" draggable="false"><figcaption>${s.legenda}</figcaption></figure>`).join('')}
      </div>
      <div class="car-ctrl">
        <div class="car-barras">${C.carrossel.map((_, i) => `<button type="button" data-ir="${i}" aria-label="Ir para a foto ${i + 1}"><i></i></button>`).join('')}</div>
        <div class="setas"><button type="button" data-ant aria-label="Foto anterior" data-magnetic>${I.esq}</button><button type="button" data-prox aria-label="Próxima foto" data-magnetic>${I.dir}</button></div>
      </div>
    </div>
  </div>
</section>

<section class="galeria" id="galeria" aria-labelledby="gal-tit">
  <div class="sec-in">
    <div class="sec-cab sec-cab-lado">
      ${tit('h2', 'gal-tit', 'Galeria')}
      <div class="filtro" role="group" aria-label="Filtrar fotos" data-iguais data-filtro-gal>
        <button type="button" aria-pressed="true" data-cat="todas">Todas</button>
        ${[...new Set(C.galeria.map((g) => g.cat))].map((c) => `<button type="button" aria-pressed="false" data-cat="${c}">${c}</button>`).join('')}
      </div>
    </div>
    <ul class="gal-grade">
      ${C.galeria.map((g) => `<li data-cat="${g.cat}"><button type="button" data-ampliar="${foto(g.foto)}" data-leg="${g.legenda}" data-cursor="Ampliar"><img src="${foto(g.foto)}" alt="${g.legenda}" width="1500" height="1000" loading="lazy"><span>${g.legenda}</span></button></li>`).join('')}
    </ul>
  </div>
</section>

<section class="curitiba" aria-labelledby="cwb-tit">
  <img class="cwb-foto" src="${foto('jardim-botanico')}" alt="Estufa do Jardim Botânico de Curitiba com canteiros de flores amarelas" width="1500" height="1000" loading="lazy">
  <div class="cwb-in">
    ${tit('h2', 'cwb-tit', `No ${M.bairro}, em ${M.cidade}. <em>E por vídeo, em todo o Brasil.</em>`)}
    <p>Portal do cliente, assinatura eletrônica e reuniões por vídeo: a mesma rotina e o mesmo contador de referência para quem está longe.</p>
  </div>
</section>

<section class="insta" aria-labelledby="insta-tit">
  <div class="sec-in">
    <div class="sec-cab sec-cab-lado">
      ${tit('h2', 'insta-tit', `No Instagram, <em>${M.instagramUser}</em>`)}
      <p>Glossário contábil, datas do mês e bastidores do fechamento.</p>
    </div>
    <ul class="insta-grade">
      ${C.instagram.map((p) => `<li><a href="${M.instagram}" target="_blank" rel="noopener" data-cursor="Abrir"><img src="${foto(p.foto)}" alt="" width="1500" height="1000" loading="lazy"><span>${p.texto}</span></a></li>`).join('')}
    </ul>
    <p class="insta-link"><a class="btn btn-linha" href="${M.instagram}" target="_blank" rel="noopener" data-magnetic><span class="btn-barras" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span class="btn-txt" data-txt="Seguir ${M.instagramUser}"><span>Seguir ${M.instagramUser}</span></span>${I.insta}</a></p>
  </div>
</section>

<section class="politicas" id="politicas" aria-labelledby="pol-tit">
  <div class="sec-in pol-grade">
    <div class="sec-cab">
      <p class="apoio">Políticas</p>
      ${tit('h2', 'pol-tit', 'Atendimento, honorários <em>e confidencialidade.</em>')}
      <p>O que você pode esperar do escritório antes, durante e depois da contratação.</p>
      <div class="pol-abas" role="tablist" aria-label="Políticas">${C.politicas.map((p, i) => `<button type="button" role="tab" id="pab-${p.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" aria-controls="pol-${p.id}">${p.titulo}</button>`).join('')}</div>
    </div>
    <div class="pol-paineis">${C.politicas.map((p, i) => `<section class="pol ${p.destaque ? 'pol-destaque' : ''}" id="pol-${p.id}" role="tabpanel" aria-labelledby="pab-${p.id}"${i === 0 ? '' : ' hidden'}><h3>${p.titulo}</h3><ul>${p.itens.map((t) => `<li>${t}</li>`).join('')}</ul></section>`).join('')}</div>
  </div>
</section>

${contato}`;

// ---------- PROFISSIONAIS ----------
const profissionais = `<section class="capa-int capa-prof" aria-labelledby="cp-tit">
  <svg class="ci-fio" viewBox="0 0 40 900" preserveAspectRatio="none" aria-hidden="true"><path d="M20 0v900"/></svg>
  <div class="ci-in">
    <p class="apoio">Profissionais</p>
    <h1 id="cp-tit" class="ci-tit"><span class="ln"><span>Cinco contadores.</span></span> <span class="ln"><em>Um responsável por frente.</em></span></h1>
    <p class="ci-sub">Todos com registro ativo no CRC-PR. Passe pelos nomes para ver quem é e clique para ler o perfil.</p>
    <ul class="nomes" data-nomes>
      ${C.equipe.map((p) => `<li><a href="#${p.id}" data-foto="${foto(p.foto)}" data-cursor="Perfil"><span class="nm-nome">${p.nome}</span><span class="nm-cargo">${p.cargo}</span><span class="nm-crc">${p.crc}</span><img class="nm-mini" src="${foto(p.foto)}" alt="" width="880" height="1100" loading="lazy"></a></li>`).join('')}
    </ul>
    <div class="nomes-flutua" data-nomes-flutua aria-hidden="true"><img src="" alt=""></div>
  </div>
</section>

<div class="perfis">
  <nav class="perfis-indice" aria-label="Profissionais" data-indice>
    ${C.equipe.map((p) => `<a href="#${p.id}">${p.nome}</a>`).join('')}
  </nav>
  <div class="perfis-lista">
    ${C.equipe.map((p, i) => `<article class="perfil ${i % 2 ? 'perfil-inv' : ''}" id="${p.id}" aria-labelledby="pf-${p.id}">
      <figure class="pf-foto revela" data-inclina><img src="${foto(p.foto)}" alt="${p.nome}, ${p.cargo.toLowerCase()}" width="880" height="1100" loading="lazy"><figcaption>${p.crc}</figcaption></figure>
      <div class="pf-txt">
        <p class="apoio">${p.cargo}</p>
        ${tit('h2', `pf-${p.id}`, p.nome)}
        <blockquote class="pf-frase">${p.frase}</blockquote>
        ${p.bio.map((b) => `<p>${b}</p>`).join('')}
        <dl class="pf-dados">
          <div><dt>Frentes</dt><dd class="pf-frentes">${p.segmentos.map((s) => `<a href="servicos.html#${s}">${sg[s].nome}</a>`).join('')}</dd></div>
          <div><dt>Formação</dt><dd><ul>${p.formacao.map((f) => `<li>${f}</li>`).join('')}</ul></dd></div>
          <div><dt>Na Ortiva desde</dt><dd>${p.desde}</dd></div>
          <div><dt>Atende</dt><dd>${p.agenda.map((d) => DIAS[d]).join(', ')}, presencial ou por vídeo</dd></div>
          <div><dt>Registro</dt><dd>${p.crc}</dd></div>
        </dl>
        ${btn(`servicos.html?prof=${p.id}#agendar`, `Agendar com ${primeiro(p.nome)}`)}
      </div>
    </article>`).join('')}
  </div>
</div>

<section class="final final-curto" aria-labelledby="pfin-tit">
  <div class="final-in">
    ${tit('h2', 'pfin-tit', 'Não sabe com quem falar? <em>A gente direciona.</em>')}
    <div class="final-btns">${btn(wa('Olá! Vim pelo site da Ortiva e quero saber com qual contador devo falar.'), 'Perguntar no WhatsApp', 'btn-lima', ' target="_blank" rel="noopener"')}</div>
  </div>
</section>`;

// ---------- SERVIÇOS ----------
const servicos = `${capaInterna('cs-tit', 'Serviços', ['Seis frentes.', '<em>Escolha por onde começar.</em>'], 'O que inclui cada serviço, para quem é e em quanto tempo fica pronto. Honorários sempre em proposta por escrito, depois do diagnóstico.', `<nav class="atalhos" aria-label="Ir para a frente" data-iguais>${C.segmentos.map((s) => `<a href="#${s.id}" data-ir-seg="${s.id}">${s.curto}</a>`).join('')}</nav>`)}

<section class="servicos" id="servicos" aria-labelledby="serv-tit">
  <div class="sec-in">
    <div class="serv-cab">
      ${tit('h2', 'serv-tit', 'Serviços <em>por frente</em>')}
      <div class="filtro" role="group" aria-label="Filtrar serviços por frente" data-iguais data-filtro-serv>
        <button type="button" aria-pressed="true" data-seg="todas">Todas</button>
        ${C.segmentos.map((s) => `<button type="button" aria-pressed="false" data-seg="${s.id}">${s.curto}</button>`).join('')}
      </div>
    </div>
    <div class="serv-corpo">
      <div class="fichas">
        ${C.segmentos.map((s) => `<span class="ancora" id="${s.id}" aria-hidden="true"></span>${s.servicos.map((x) => `<article class="ficha" data-seg="${s.id}">
          <p class="etiqueta">${s.nome}</p>
          <h3>${x.nome}</h3>
          <p class="fi-para">${x.para}</p>
          <ul class="fi-inclui">${x.inclui.map((t) => `<li>${t}</li>`).join('')}</ul>
          <dl class="fi-dados">
            <div><dt>Prazo</dt><dd>${x.prazo}</dd></div>
            <div><dt>Responsável</dt><dd>${C.equipe.filter((p) => p.segmentos.includes(s.id)).map((p) => p.nome).join(' ou ')}</dd></div>
            <div><dt>Honorários</dt><dd>Proposta por escrito após o diagnóstico</dd></div>
          </dl>
          <button type="button" class="btn btn-linha btn-p" data-agendar-seg="${s.id}" data-agendar-serv="${esc(x.nome)}" data-magnetic><span class="btn-barras" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span class="btn-txt" data-txt="Agendar sobre este serviço"><span>Agendar sobre este serviço</span></span>${I.dir}</button>
        </article>`).join('')}`).join('')}
      </div>
      <aside class="condicoes" aria-label="Condições de atendimento">
        <h3>Valem para todos os serviços</h3>
        <ul>
          <li>${I.relogio}<span>${C.condicoes.reuniao}</span></li>
          <li>${I.fone}<span>${C.condicoes.retorno}</span></li>
          <li>${I.doc}<span>${C.condicoes.honorarios}</span></li>
          <li>${I.calendario}<span>${C.condicoes.remarcar}</span></li>
        </ul>
        <p>O site não divulga valores de honorários, em respeito às normas do Conselho Federal de Contabilidade. <a href="escritorio.html#politicas">Ver as políticas</a></p>
      </aside>
    </div>
  </div>
</section>

${comoFunciona}

<section class="simulador" id="simulador" aria-labelledby="sim-tit">
  <div class="sec-in">
    <div class="sec-cab sec-cab-lado">
      ${tit('h2', 'sim-tit', 'Simulador de <em>enquadramento tributário</em>')}
      <p>Uma estimativa simplificada para comparar Simples Nacional, Lucro Presumido e Lucro Real com os seus números. Nada do que você digita sai do navegador.</p>
    </div>
    <form class="sim" data-sim novalidate>
      <div class="sim-campos">
        <fieldset><legend>Atividade principal</legend><div class="sim-ativ" data-iguais>
          <label><input type="radio" name="ativ" value="comercio" checked><span>Comércio</span></label>
          <label><input type="radio" name="ativ" value="industria"><span>Indústria</span></label>
          <label><input type="radio" name="ativ" value="servicos"><span>Serviços em geral</span></label>
          <label><input type="radio" name="ativ" value="intelectual"><span>Serviços intelectuais</span></label>
        </div></fieldset>
        <label class="faixa-campo" data-cursor="Arrastar"><span>Faturamento dos últimos 12 meses <output data-out="fat"></output></span><input type="range" name="fat" min="120000" max="6000000" step="20000" value="900000"></label>
        <label class="faixa-campo" data-cursor="Arrastar"><span>Folha anual de salários e pró-labore <output data-out="folha"></output></span><input type="range" name="folha" min="0" max="2400000" step="10000" value="180000"></label>
        <label class="faixa-campo" data-cursor="Arrastar"><span>Margem de lucro antes dos impostos <output data-out="margem"></output></span><input type="range" name="margem" min="2" max="45" step="1" value="18"></label>
        <p class="sim-fator" data-fator aria-live="polite"></p>
      </div>
      <div class="sim-result" aria-live="polite">
        <p class="sim-r-tit">Estimativa de tributos por ano</p>
        <ul class="sim-barras" data-sim-barras>
          <li data-regime="simples"><span class="sb-nome">Simples Nacional</span><span class="sb-trilho"><i></i></span><b data-v>-</b><small data-p></small></li>
          <li data-regime="presumido"><span class="sb-nome">Lucro Presumido</span><span class="sb-trilho"><i></i></span><b data-v>-</b><small data-p></small></li>
          <li data-regime="real"><span class="sb-nome">Lucro Real</span><span class="sb-trilho"><i></i></span><b data-v>-</b><small data-p></small></li>
        </ul>
        <p class="sim-menor" data-sim-menor></p>
        <details class="sim-premissas"><summary>Premissas desta simulação</summary>
          <ul>
            <li>Simples Nacional pelas tabelas da LC 123/2006 (Anexos I, II, III e V), com o Fator R para serviços intelectuais. Acima de R$ 4,8 milhões, o regime não está disponível.</li>
            <li>Comércio e indústria: ICMS fora da comparação nos três regimes, porque depende de créditos e do estado.</li>
            <li>Serviços: ISS estimado em 3% no Presumido e no Real (em Curitiba vai de 2% a 5%).</li>
            <li>Presumido: presunção de 8% (IRPJ) e 12% (CSLL) para comércio e indústria, 32% para serviços; PIS e Cofins de 3,65%.</li>
            <li>Real: IRPJ e CSLL sobre a margem informada; PIS e Cofins de 9,25% com créditos estimados sobre compras.</li>
            <li>Fora do Simples, contribuição patronal estimada em 27,8% da folha. Não inclui IBS e CBS da transição, benefícios fiscais nem regimes especiais.</li>
          </ul>
        </details>
        <p class="sim-aviso">Estimativa ilustrativa, não é recomendação nem promessa de economia. A escolha do regime depende do diagnóstico com um contador.</p>
        ${btn('#agendar', 'Agendar a revisão de enquadramento', 'btn-lima', ' data-agendar-sim')}
      </div>
    </form>
  </div>
</section>

<section class="agendar" id="agendar" aria-labelledby="ag-tit">
  <div class="sec-in ag-grade">
    <div class="ag-txt">
      <p class="apoio">Agendamento</p>
      ${tit('h2', 'ag-tit', 'Marque a conversa <em>com o contador da frente.</em>')}
      <p>Escolha o assunto, quem vai atender, o formato e um dos horários livres. O pedido chega à equipe pelo WhatsApp e a confirmação vem em até 1 dia útil.</p>
      <div class="ag-resumo" data-ag-resumo aria-live="polite">
        <p class="ag-r-tit">Seu pedido</p>
        <dl>
          <div><dt>Assunto</dt><dd data-r="seg">Escolha a frente</dd></div>
          <div><dt>Com</dt><dd data-r="prof">Escolha o contador</dd></div>
          <div><dt>Formato</dt><dd data-r="formato">Videochamada</dd></div>
          <div><dt>Quando</dt><dd data-r="quando">Escolha dia e horário</dd></div>
        </dl>
      </div>
    </div>
    <form class="form ag-form" data-agenda novalidate>
      <fieldset><legend>Assunto</legend>
        <div class="ag-opcoes ag-segs" data-iguais>${C.segmentos.map((s) => `<label><input type="radio" name="seg" value="${s.id}" required><span>${s.curto}</span></label>`).join('')}</div>
        <input type="hidden" name="servico" value="">
        <p class="ag-serv" data-ag-serv hidden></p>
      </fieldset>
      <fieldset><legend>Contador</legend><div class="ag-opcoes ag-profs" data-ag-profs><p class="ag-dica">Escolha a frente para ver quem atende.</p></div></fieldset>
      <fieldset><legend>Formato</legend><div class="ag-opcoes ag-formato" data-iguais>
        <label><input type="radio" name="formato" value="Videochamada" checked><span>${I.video}Videochamada</span></label>
        <label><input type="radio" name="formato" value="Presencial no Batel"><span>${I.predio}Presencial</span></label>
      </div></fieldset>
      <fieldset><legend>Dia</legend><div class="ag-dias" data-ag-dias><p class="ag-dica">Escolha o contador para ver os dias livres.</p></div></fieldset>
      <fieldset><legend>Horários disponíveis</legend><div class="ag-horas" data-ag-horas><p class="ag-dica">Escolha o dia.</p></div></fieldset>
      <div class="form-grade">
        <label class="campo"><span>Nome completo</span><input name="nome" autocomplete="name" required></label>
        <label class="campo"><span>WhatsApp</span><input name="fone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(41) 90000-0000" data-mascara required></label>
      </div>
      <p class="sigilo">${I.cadeado}<span>Não envie documentos nem números da empresa aqui. O contador vê tudo na conversa, sob sigilo profissional.</span></p>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Li e aceito a <button type="button" class="link" data-legal="privacidade">Política de privacidade</button> e a <a href="escritorio.html#politicas">política de agendamento e cancelamento</a>.</span></label>
      ${botao('Enviar pedido pelo WhatsApp', 'btn-tinta', ' type="submit"', I.whats)}
      <p class="form-msg" data-msg role="status"></p>
    </form>
  </div>
</section>

<section class="duvidas" id="duvidas" aria-labelledby="faq-tit">
  <div class="sec-in faq-grade">
    <div class="sec-cab">
      <p class="apoio">Dúvidas frequentes</p>
      ${tit('h2', 'faq-tit', 'Perguntas que <em>abrem caminho.</em>')}
      <p>Não achou a sua? Pergunte pelo WhatsApp.</p>
      ${btn(wa('Olá! Tenho uma dúvida antes de marcar a conversa.'), 'Perguntar no WhatsApp', 'btn-linha', ' target="_blank" rel="noopener"')}
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
const conteudos = `${capaInterna('blog-tit', 'Conteúdos', ['Números explicados', '<em>em linguagem simples.</em>'], 'Reforma tributária, Simples Nacional, folha, imposto de renda e caixa. Textos da equipe, com a data e as regras vigentes quando foram escritos.')}

<section class="blog" aria-label="Lista de conteúdos">
  <div class="sec-in">
    <div class="filtro" role="group" aria-label="Filtrar conteúdos" data-iguais data-filtro-blog>
      <button type="button" aria-pressed="true" data-seg="todas">Ver todos</button>
      ${C.segmentos.map((s) => `<button type="button" aria-pressed="false" data-seg="${s.id}">${s.curto}</button>`).join('')}
    </div>
    <div class="blog-grade" data-blog>
      ${cartaoArtigo(destaque, 'art-destaque')}
      ${demais.map((a) => cartaoArtigo(a)).join('')}
    </div>
    <p class="blog-vazio" data-blog-vazio hidden>Ainda não há conteúdos desta frente. Veja os outros temas.</p>
    <p class="blog-mais"><button type="button" class="ver-mais" data-ver-mais><span>Ver mais</span>${I.baixo}</button></p>
  </div>
</section>

<section class="news" aria-labelledby="news-tit">
  <div class="news-in">
    ${tit('h2', 'news-tit', 'Uma carta por mês <em>com o que mudou.</em>')}
    <p>Prazos do mês seguinte e mudanças na legislação explicadas pela equipe. Sem ofertas de serviço.</p>
    <form class="news-form" data-news novalidate>
      <label class="campo"><span>Primeiro nome</span><input name="nome" autocomplete="given-name" required></label>
      <label class="campo"><span>Seu e-mail</span><input name="email" type="email" autocomplete="email" required></label>
      ${botao('Inscrever-se', 'btn-lima', ' type="submit"')}
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Aceito receber os conteúdos e li a <button type="button" class="link" data-legal="privacidade">Política de privacidade</button>. Posso cancelar quando quiser.</span></label>
      <p class="form-msg" data-msg role="status"></p>
    </form>
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
<link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@500;600&family=Azeret+Mono:wght@400&display=swap" rel="stylesheet">
${T.head(TEMA_CHAVE)}
<style>
:root { --fundo: #F4F5EF; --tinta: #0B1C1F; --texto: #3A4846; --lima: #CBF24B; --linha: rgba(11,28,31,.16); color-scheme: light; }
[data-tema="escuro"] { --fundo: #071315; --tinta: #EEF2EA; --texto: #B5C2BD; --linha: rgba(238,242,234,.16); color-scheme: dark; }
* { box-sizing: border-box; margin: 0; }
body { min-height: 100dvh; display: grid; place-items: center; padding: 32px 16px; background: var(--fundo); color: var(--texto); font: 400 17px/1.6 "Host Grotesk", Arial, sans-serif; text-align: center; }
main { max-width: 600px; }
.num { display: flex; align-items: flex-start; justify-content: center; gap: 4px; font: 600 clamp(120px, 28vw, 210px)/.9 "Host Grotesk", Arial, sans-serif; letter-spacing: -.06em; color: var(--tinta); }
.zero { position: relative; width: .62em; height: .9em; }
.zero svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.pend { transform-origin: 50px 6px; animation: pende 2.8s ease-in-out infinite; }
@keyframes pende { 0%, 100% { transform: rotate(-14deg); } 50% { transform: rotate(14deg); } }
.mono { font: 400 13px/1.4 "Azeret Mono", monospace; letter-spacing: .08em; text-transform: uppercase; color: var(--texto); margin: 26px 0 8px; }
h1 { font: 600 clamp(28px, 5vw, 40px)/1.1 "Host Grotesk", Arial, sans-serif; letter-spacing: -.03em; color: var(--tinta); margin-bottom: 12px; }
p { margin: 0 auto 28px; max-width: 46ch; }
.btns { display: inline-grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 10px; }
a { display: inline-flex; align-items: center; justify-content: center; height: 52px; padding: 0 22px; border-radius: 26px; text-decoration: none; font-weight: 600; }
.a1 { background: var(--lima); color: #0B1C1F; } .a2 { border: 1.5px solid var(--linha); color: var(--tinta); }
a:hover { background: var(--tinta); color: var(--fundo); border-color: var(--tinta); }
@media (max-width: 480px) { .btns { grid-auto-flow: row; width: 100%; } }
@media (prefers-reduced-motion: reduce) { .pend { animation: none; } }
</style>
</head>
<body>
<main>
  <p class="num" aria-label="404"><span>4</span><span class="zero"><svg viewBox="0 0 100 150" fill="none" aria-hidden="true"><path d="M20 6h60" stroke="currentColor" stroke-width="8"/><g class="pend"><path d="M50 6v80" stroke="currentColor" stroke-width="5"/><path d="M50 82l22 24-22 38-22-38Z" fill="#CBF24B" stroke="currentColor" stroke-width="4"/></g></svg></span><span>4</span></p>
  <p class="mono">Fora do prumo</p>
  <h1>Esta página saiu do alinhamento.</h1>
  <p>O endereço não existe ou mudou de lugar. O prumo ainda procura o centro, mas você pode voltar ao início ou falar com a equipe.</p>
  <div class="btns"><a class="a1" href="/">Voltar ao início</a><a class="a2" href="${wa(WA_OLA)}" target="_blank" rel="noopener">Falar no WhatsApp</a></div>
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
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_batel.webp'), path.join(SAIDA, 'assets', 'img', 'mapa_batel.webp'));
fs.writeFileSync(path.join(SAIDA, 'assets', 'img', 'emblema.svg'), emblema().replace('class="emblema "', 'xmlns="http://www.w3.org/2000/svg"').replace(/var\(--em-peso, currentColor\)/, '#CBF24B').replace(/currentColor/g, '#0B1C1F'));
fs.writeFileSync(path.join(SAIDA, 'assets', 'style.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
fs.writeFileSync(path.join(SAIDA, 'assets', 'app.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + T.js(TEMA_CHAVE, COR_CLARO, COR_ESCURO));

const desc = `${M.completo}: contabilidade consultiva, fiscal, departamento pessoal, BPO financeiro e imposto de renda em ${M.cidade}, ${M.uf}, e por vídeo.`;
fs.writeFileSync(path.join(SAIDA, 'index.html'), pagina('index.html', `${M.completo} | Contabilidade em ${M.cidade}`, desc, inicio));
fs.writeFileSync(path.join(SAIDA, 'escritorio.html'), pagina('escritorio.html', `O escritório | ${M.completo}`, `Conheça a ${M.completo}, o escritório no ${M.bairro} e as políticas de atendimento, honorários e confidencialidade.`, escritorio));
fs.writeFileSync(path.join(SAIDA, 'profissionais.html'), pagina('profissionais.html', `Profissionais | ${M.completo}`, `Os contadores da ${M.completo}, com registro no CRC-PR, frentes de atuação e agenda.`, profissionais));
fs.writeFileSync(path.join(SAIDA, 'servicos.html'), pagina('servicos.html', `Serviços e simulador | ${M.completo}`, 'Serviços contábeis por frente, simulador de enquadramento tributário, agendamento de conversa e dúvidas frequentes.', servicos));
fs.writeFileSync(path.join(SAIDA, 'conteudos.html'), pagina('conteudos.html', `Conteúdos | ${M.completo}`, `Reforma tributária, Simples Nacional, folha e imposto de renda explicados pela equipe da ${M.completo}.`, conteudos));
fs.writeFileSync(path.join(SAIDA, '404.html'), pagina404);
fs.writeFileSync(path.join(SAIDA, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${M.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(SAIDA, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGINAS.map(([p]) => `  <url><loc>${M.dominio}/${p === 'index.html' ? '' : p}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log('ok', path.relative(process.cwd(), SAIDA));
