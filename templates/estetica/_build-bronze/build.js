// Gera o modelo Bronze de estética (Camélia Estética, marca fictícia) em "templates/estetica/bronze/".
// Bronze: uma página só, CSS e JS embutidos no index.html, fotos em assets/img.
// Uso: node templates/estetica/_build-bronze/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');

const OUT = path.join(__dirname, '..', 'bronze');
const FOTOS = path.join(__dirname, 'img', 'fotos');
const M = C.marca;
const R = C.responsavel;
const SEG = C.segmentos.filter((s) => s.ativo);
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`Rua Coronel Quirino, ${M.bairro}, ${M.cidade}`)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
const reais = (v) => `R$ ${v.toLocaleString('pt-BR')}`;
const lista = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} e ${a.at(-1)}`);

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
if (fs.existsSync(FOTOS)) for (const f of fs.readdirSync(FOTOS)) fs.copyFileSync(path.join(FOTOS, f), path.join(OUT, 'assets', 'img', f));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_cambui.webp'), path.join(OUT, 'assets', 'img', 'mapa_cambui.webp'));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8')
  .replace('/*DADOS*/', JSON.stringify({ whatsapp: M.whatsapp, nome: M.completo, abertura: C.abertura }));

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Gilda+Display&family=Albert+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">';

// ---------- fotos ----------
const faltando = [];
const foto = (nome, { cls = '', lazy = true, alt } = {}) => {
  const desc = alt || C.fotos[nome] || nome;
  if (fs.existsSync(path.join(FOTOS, `${nome}.webp`))) {
    return `<img class="foto ${cls}" src="assets/img/${nome}.webp" alt="${esc(desc)}"${lazy ? ' loading="lazy"' : ''}>`;
  }
  if (!faltando.includes(nome)) faltando.push(nome);
  return `<div class="foto foto-falta ${cls}" role="img" aria-label="${esc(desc)}">${I.flor('flor-falta')}<span>Foto: ${esc(desc)}</span></div>`;
};
const creditosArq = path.join(__dirname, 'img', 'creditos.json');
const creditos = fs.existsSync(creditosArq) ? JSON.parse(fs.readFileSync(creditosArq, 'utf8')) : [];
const listaCreditos = creditos.map((c) => `<li>${esc(c.arq)}: <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.autor)}, ${esc(c.fonte)}</a></li>`).join('');

// ---------- peças ----------
const precoDe = (t) => {
  if (t.gratis) return `<span class="t-preco"><small>avaliação</small>${t.gratis}</span>`;
  if (t.pacoteSo) return `<span class="t-preco"><small>pacote a partir de</small>${reais(t.de)}</span>`;
  if (t.de) return `<span class="t-preco"><small>a partir de</small>${reais(t.de)}</span>`;
  return `<span class="t-preco"><small>sessão</small>${reais(t.preco)}</span>`;
};
const trat = (s, t) => `<details class="trat" data-seg="${s.id}">
            <summary>
              <span class="t-nome"><b>${esc(t.nome)}</b><small>${esc(t.resumo)}</small></span>
              <span class="t-meta"><span>${I.relogio}${esc(t.duracao)}</span><span>${esc(t.sessoes)}</span></span>
              ${precoDe(t)}
              <span class="t-abre" aria-hidden="true">${I.mais}</span>
            </summary>
            <div class="t-corpo">
              <div><h4>O que inclui</h4><ul>${t.inclui.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>
              <div class="t-valores">
                ${t.pacote ? `<p><b>Pacote de ${t.pacote[0]} sessões:</b> ${reais(t.pacote[1])}</p>` : ''}
                ${t.extra ? `<p>${esc(t.extra)}</p>` : ''}
                <p class="t-nota">Valor final confirmado na avaliação. Pagamento em Pix, débito ou crédito.</p>
                <a class="btn btn-linha" href="${wa(`Olá! Quero agendar ${t.nome.toLowerCase()} na ${M.completo}.`)}" target="_blank" rel="noopener">${I.whats}<span>Agendar este tratamento</span></a>
              </div>
            </div>
          </details>`;

const extraSeg = (s) => {
  if (s.peles) {
    return `<div class="peles"><h3>Protocolos por tipo de pele</h3><dl>${s.peles.map(([p, d]) => `<div><dt>${p}</dt><dd>${d}</dd></div>`).join('')}</dl></div>`;
  }
  if (s.areas) {
    return `<div class="areas"><h3>Depilação por área</h3>
          <table><thead><tr><th scope="col">Área</th><th scope="col">Cera</th><th scope="col">Laser, por sessão</th></tr></thead>
          <tbody>${s.areas.map(([a, c, l]) => `<tr><th scope="row">${a}</th><td>${reais(c)}</td><td>${reais(l)}</td></tr>`).join('')}</tbody></table>
          <p>${esc(s.laserNota)}</p></div>`;
  }
  return '';
};

const blocoSeg = (s) => `<section class="seg" id="seg-${s.id}" data-seg="${s.id}" aria-labelledby="t-${s.id}">
        <div class="seg-lado">
          <div class="seg-foto revela">${foto(s.foto)}</div>
          <h3 id="t-${s.id}">${esc(s.nome)}</h3>
          <p>${esc(s.chamada)}</p>
        </div>
        <div class="seg-lista">
          ${s.itens.map((t) => trat(s, t)).join('\n          ')}
          ${extraSeg(s)}
        </div>
      </section>`;

const segTiles = SEG.map((s, i) => `<li class="revela" data-seg="${s.id}"><a href="#seg-${s.id}" class="seg-tile${i === 0 ? ' seg-tile-g' : ''}">
          ${foto(s.foto)}
          <span class="seg-tile-txt"><b>${esc(s.nome)}</b><small>${esc(s.chamada)}</small><span class="seg-ir">Ver preços ${I.seta}</span></span>
        </a></li>`).join('\n        ');

const opcoes = SEG.map((s) => `<optgroup label="${esc(s.nome)}" data-seg="${s.id}">${s.itens.map((t) => `<option>${esc(t.nome)}</option>`).join('')}${s.areas ? '<option>Depilação com cera</option><option>Depilação a laser</option>' : ''}</optgroup>`).join('');

const dias = C.horarios.map(([d, h], i) => `<tr data-linha="${i}"><th scope="row">${d}</th><td>${h}</td></tr>`).join('');

// ---------- textos legais [JURÍDICO] ----------
const legal = {
  servico: ['Termos de prestação de serviço', `
    <p>Estes termos valem para todos os atendimentos da ${M.completo} (${M.razao}, CNPJ ${M.cnpj}).</p>
    <h3>Avaliação e plano</h3><p>Todo tratamento facial e corporal e toda primeira sessão de laser começam por uma avaliação sem custo. Nela a cliente preenche a ficha de saúde e recebe o plano por escrito, com tratamento, número de sessões, intervalo e valor. Informar alergias, medicamentos e condições de saúde é necessário para a segurança do procedimento.</p>
    <h3>Preços e pagamento</h3><p>Os preços desta página são de sessão avulsa ou de pacote e podem mudar sem aviso; vale o valor do plano assinado. Pagamento em Pix, débito ou crédito, com sessão avulsa em até 3x e pacotes em até 10x sem juros no cartão.</p>
    <h3>Pacotes</h3><p>Valem por 6 meses a partir da primeira sessão e são pessoais. Na desistência, devolvemos o valor das sessões não feitas, calculado pelo preço do pacote, descontados 10% de custo administrativo.</p>
    <h3>Agendamento, cancelamento e remarcação</h3><p>Cancelamento e remarcação sem custo até 24h antes. Com menos de 24h, a sessão avulsa é cobrada em 50% e a de pacote conta como feita, exceto em caso de saúde com atestado. Tolerância de atraso de 15 minutos.</p>
    <h3>Garantia</h3><p>Garantimos o serviço bem executado: retoque do design de sobrancelhas em até 7 dias, reposição de fios de cílios caídos em até 72h e remarcação sem custo de sessão perdida por falha nossa. Não há garantia de resultado: cada organismo responde de um jeito.</p>
    <h3>Contraindicações</h3><p>A clínica pode recusar ou adiar um procedimento quando houver contraindicação ou risco à saúde, e pode pedir liberação médica.</p>
    <p>Dúvidas: ${M.email} ou WhatsApp ${M.whatsappTexto}.</p>`],
  uso: ['Termos de uso do site', `
    <p>Este site apresenta a ${M.completo}, seus tratamentos, preços e políticas. O conteúdo é informativo e não substitui a avaliação individual.</p>
    <h3>Informações e preços</h3><p>Fazemos o possível para manter tudo atualizado. Em caso de diferença, vale o que estiver no plano entregue na avaliação.</p>
    <h3>Imagens e textos</h3><p>Textos, marca e fotos pertencem à ${M.completo} ou são usados com licença. Não é permitido copiar para uso comercial.</p>
    <h3>Formulário</h3><p>O formulário monta uma mensagem e abre o WhatsApp no seu aparelho. Este site não guarda as respostas. O envio acontece só quando você toca em enviar dentro do WhatsApp.</p>
    <h3>Links externos</h3><p>WhatsApp, mapas e redes sociais seguem os termos de cada serviço.</p>`],
  privacidade: ['Política de privacidade', `
    <p>Controladora dos dados: ${M.razao}, CNPJ ${M.cnpj}, ${endereco}. Encarregado de dados: ${M.encarregado}.</p>
    <h3>Quais dados</h3><p>Nome, WhatsApp, e-mail, tratamento de interesse e período preferido, quando você envia o formulário. Se você autorizar de forma específica, também as informações de saúde da ficha prévia (gestação, alergias, medicamentos e condições de saúde).</p>
    <h3>Para que usamos</h3><p>Responder o seu pedido, agendar e preparar a avaliação. Dados de saúde são dados sensíveis pela LGPD (Lei 13.709/2018, art. 11) e são usados apenas para avaliar a indicação e a segurança do procedimento, com o seu consentimento específico. Novidades e horários livres só com a sua autorização separada.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins comerciais. A mensagem passa pelo WhatsApp, que tem a própria política. A ficha de saúde fica no prontuário da clínica, com acesso restrito à equipe que atende você.</p>
    <h3>Por quanto tempo</h3><p>Pedidos sem atendimento são apagados em até 6 meses. Prontuário e ficha de saúde são guardados pelo prazo exigido pelas normas sanitárias e profissionais.</p>
    <h3>Seus direitos</h3><p>Você pode pedir acesso, correção, cópia ou exclusão dos seus dados, e retirar o consentimento a qualquer momento, pelo e-mail ${M.encarregado}.</p>
    <h3>Cookies</h3><p>O site usa armazenamento essencial do navegador para lembrar a sua escolha sobre cookies. Não usamos cookies de publicidade. Medição de visitas só com a sua permissão no aviso de cookies.</p>`],
};
const dialogs = Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-topo"><h2 id="doc-${id}-t">${t}</h2><button type="button" class="doc-fecha" data-fecha aria-label="Fechar">${I.fechar}</button></div>
  <div class="doc-corpo">${corpo}<p class="doc-fim">Texto de modelo, a validar na revisão jurídica. Atualizado em novembro de 2026.</p></div>
</dialog>`).join('\n');

const segNomes = lista(SEG.map((s) => s.nome.toLowerCase()));

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${M.completo} | Clínica de estética no ${M.bairro}, ${M.cidade}</title>
<meta name="description" content="${M.completo}: ${segNomes} no ${M.bairro}, ${M.cidade}. Avaliação sem custo, preços claros e agendamento pelo WhatsApp.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#F8F5F2">
<meta property="og:title" content="${M.completo}">
<meta property="og:description" content="Avaliação sem custo, plano por escrito e agendamento pelo WhatsApp.">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<script>document.documentElement.classList.add("js")</script>
${fontes}
<style>
${css}
</style>
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'BeautySalon', name: M.completo, legalName: M.razao, telephone: M.telefone, email: M.email,
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  openingHours: ['Mo-Fr 09:00-20:00', 'Sa 08:00-14:00'],
})}</script>
</head>
<body>
<a class="pular" href="#tratamentos">Pular para os tratamentos</a>

<header class="topo" id="topo">
  <div class="wrap topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="menu" id="menu" aria-label="Seções">
      <a href="#tratamentos">Tratamentos e preços</a>
      <a href="#atendimento">Como funciona</a>
      <a href="#clinica">A clínica</a>
      <a href="#agendar">Agendar</a>
    </nav>
    <a class="btn btn-vinho topo-cta" href="${wa(`Olá! Quero agendar uma avaliação na ${M.completo}.`)}" target="_blank" rel="noopener">${I.whats}<span>Agendar no WhatsApp</span></a>
    <button class="menu-btn" type="button" aria-controls="menu" aria-expanded="false" aria-label="Abrir menu"><span></span><span></span></button>
  </div>
</header>

<main>
  <section class="capa" id="inicio">
    <div class="wrap capa-in">
      <div class="capa-txt">
        <p class="apoio">Clínica de estética no ${M.bairro}, ${M.cidade}</p>
        <h1>Cuidar da pele começa por uma boa conversa.</h1>
        <p class="capa-sub">${segNomes.charAt(0).toUpperCase() + segNomes.slice(1)}. A primeira visita é uma avaliação sem custo: você sai com o plano por escrito, o número de sessões e o valor, e decide com calma.</p>
        <div class="capa-btns">
          <a class="btn btn-vinho" href="${wa(`Olá! Quero agendar uma avaliação na ${M.completo}.`)}" target="_blank" rel="noopener">${I.whats}<span>Agendar avaliação</span></a>
          <a class="btn btn-linha" href="#tratamentos"><span>Ver tratamentos e preços</span></a>
        </div>
        <dl class="capa-dados">
          <div><dt>Hoje</dt><dd data-status>Seg a sex, 9h às 20h</dd></div>
          <div><dt>Responsável técnica</dt><dd>${R.nome}, ${R.registro}</dd></div>
        </dl>
      </div>
      <div class="capa-foto">
        ${foto('capa', { cls: 'arco', lazy: false })}
        <p class="capa-selo"><b>Avaliação sem custo</b><span>40 minutos, com plano por escrito</span></p>
      </div>
    </div>
    <ul class="wrap segs" style="--n:${SEG.length}">
        ${segTiles}
    </ul>
  </section>

  <section class="sec" id="tratamentos" aria-labelledby="t-trat">
    <div class="wrap">
      <div class="sec-topo">
        <h2 id="t-trat">Tratamentos e preços</h2>
        <p>Valor da sessão avulsa e do pacote, duração e número de sessões. Toque no tratamento para ver o que inclui.</p>
      </div>
      ${SEG.map(blocoSeg).join('\n      ')}
      <div class="pagar">
        ${C.pagamento.map(([t, d]) => `<div class="revela"><h3>${t}</h3><p>${d}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="sec sec-rosa" id="atendimento" aria-labelledby="t-atend">
    <div class="wrap">
      <div class="sec-topo">
        <h2 id="t-atend">Como funciona o atendimento</h2>
        <p>Nenhum protocolo começa sem avaliação. É nela que a gente confere se o tratamento é indicado para você.</p>
      </div>
      <ol class="etapas">
        ${C.etapas.map(([t, d]) => `<li class="revela"><h3>${t}</h3><p>${d}</p></li>`).join('')}
      </ol>
      <div class="atend-grid">
        <div class="contra revela">
          ${foto('avaliacao')}
          <div class="contra-txt">
            <h3>Quando o tratamento não é indicado</h3>
            <ul>${C.contraindicacoes.map((c) => `<li>${c}</li>`).join('')}</ul>
            <p class="miudo">A lista completa é conferida na ficha de saúde da avaliação.</p>
          </div>
        </div>
        <div class="politicas">
          <h3>Agendamento, cancelamento e remarcação</h3>
          ${C.politicas.map(([t, d], i) => `<details class="pol"${i === 0 ? ' open' : ''}><summary>${t}<span aria-hidden="true">${I.mais}</span></summary><p>${d}</p></details>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <section class="sec" id="clinica" aria-labelledby="t-clin">
    <div class="wrap">
      <div class="resp">
        <div class="resp-foto revela">${foto('responsavel')}</div>
        <div class="resp-txt">
          <p class="apoio">Quem responde pela clínica</p>
          <h2 id="t-clin">${R.nome}</h2>
          <p class="resp-cargo">${R.cargo}. <b>${R.registro}</b></p>
          <p>${R.texto}</p>
          <p>${R.equipe}</p>
          <div class="seguro">
            ${C.seguranca.map(([t, d]) => `<div><h3>${t}</h3><p>${d}</p></div>`).join('')}
          </div>
          <p class="aviso-res">${C.avisoResultado}</p>
        </div>
      </div>
      <div class="galeria-topo"><h2>Por dentro da clínica</h2><p>Salas individuais, luz clara e silêncio. Desde ${M.desde} no ${M.bairro}.</p></div>
      <div class="galeria">
        ${['galeria-harmonizacao', 'galeria-produtos', 'galeria-corredor', 'galeria-serum', 'galeria-cilios', 'galeria-toxina'].map((g, i) => `<figure class="g g${i + 1} revela">${foto(g)}</figure>`).join('')}
      </div>
    </div>
  </section>

  <section class="sec sec-gelo" id="agendar" aria-labelledby="t-ag">
    <div class="wrap ag">
      <div class="ag-lado">
        <h2 id="t-ag">Agende sua avaliação</h2>
        <p>Preencha e o pedido abre pronto no WhatsApp. Respondemos em horário de atendimento, normalmente em menos de uma hora.</p>
        <table class="horas"><caption>Horário de funcionamento</caption><tbody>${dias}</tbody></table>
        <p class="ag-end">${I.pino}<span>${endereco}<br>CEP ${M.cep}</span></p>
        <a class="btn btn-vinho" href="${wa(`Olá! Quero agendar uma avaliação na ${M.completo}.`)}" target="_blank" rel="noopener">${I.whats}<span>Prefiro chamar direto</span></a>
      </div>
      <form class="form" id="form" novalidate>
        <div class="campos">
          <label class="campo"><span>Nome</span><input name="nome" autocomplete="name" required></label>
          <label class="campo"><span>WhatsApp</span><input name="whats" type="tel" inputmode="tel" autocomplete="tel" placeholder="(19) 90000-0000" required></label>
          <label class="campo"><span>E-mail <small>(opcional)</small></span><input name="email" type="email" autocomplete="email"></label>
          <label class="campo"><span>Tratamento</span><select name="trat"><option>Ainda não sei, quero a avaliação</option>${opcoes}</select></label>
        </div>
        <fieldset class="periodo"><legend>Melhor período</legend>
          <div class="opts">${['Manhã', 'Tarde', 'Noite', 'Sábado'].map((p, i) => `<label><input type="radio" name="periodo" value="${p}"${i ? '' : ' checked'}><span>${p}</span></label>`).join('')}</div>
        </fieldset>
        <label class="campo"><span>Mensagem <small>(opcional)</small></span><textarea name="msg" rows="3"></textarea></label>

        <fieldset class="saude" id="saude">
          <legend>Ficha de saúde prévia <small>(opcional)</small></legend>
          <p>Se quiser, adiante algumas respostas da avaliação. São dados sensíveis pela LGPD: só usamos para conferir se o tratamento é seguro para você. Também dá para responder pessoalmente.</p>
          <label class="check"><input type="checkbox" name="ok_saude" id="ok-saude"><span>Autorizo a ${M.completo} a usar os dados de saúde que eu informar abaixo apenas para a minha avaliação e a segurança do atendimento.</span></label>
          <div class="saude-campos" id="saude-campos">
            <fieldset class="sim-nao"><legend>Está grávida ou amamentando?</legend><div class="opts"><label><input type="radio" name="gest" value="Não" disabled><span>Não</span></label><label><input type="radio" name="gest" value="Sim" disabled><span>Sim</span></label></div></fieldset>
            <label class="campo"><span>Alergias</span><input name="alergia" placeholder="Ex.: cola, henna, ácidos, látex" disabled></label>
            <label class="campo"><span>Medicamentos em uso</span><input name="remedio" placeholder="Ex.: isotretinoína, anticoagulante" disabled></label>
            <fieldset class="conds"><legend>Tem alguma destas condições?</legend>
              ${['Marca-passo ou implante metálico', 'Diabetes', 'Problema de coagulação', 'Herpes que volta com frequência'].map((c) => `<label class="check"><input type="checkbox" name="cond" value="${c}" disabled><span>${c}</span></label>`).join('')}
            </fieldset>
          </div>
        </fieldset>

        <div class="consent">
          <label class="check"><input type="checkbox" name="ok_lgpd" required><span>Li a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button> e autorizo o contato pelo WhatsApp, telefone ou e-mail para responder este pedido.</span></label>
          <label class="check"><input type="checkbox" name="ok_news"><span>Quero receber horários livres e novidades. Posso cancelar quando quiser.</span></label>
        </div>
        <p class="form-erro" id="form-erro" role="alert" hidden></p>
        <button class="btn btn-vinho btn-enviar" type="submit">${I.whats}<span>Enviar pedido pelo WhatsApp</span></button>
        <p class="miudo">O pedido abre no WhatsApp com a mensagem pronta. Nada fica salvo neste site.</p>
      </form>
    </div>
  </section>

  <section class="sec" id="duvidas" aria-labelledby="t-faq">
    <div class="wrap faq">
      <h2 id="t-faq">Dúvidas frequentes</h2>
      <div>${C.faq.map(([q, a]) => `<details class="pol"><summary>${q}<span aria-hidden="true">${I.mais}</span></summary><p>${a}</p></details>`).join('')}</div>
    </div>
  </section>
</main>

<footer class="rodape">
  <div class="wrap">
    <div class="rodape-mapa">
      <div class="map-box">
        <img src="assets/img/mapa_cambui.webp" alt="Mapa do ${M.bairro}, ${M.cidade}, com a localização da ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${endereco}</span><span>Seg a sex, 9h às 20h. Sábado, 8h às 14h</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Atendimento só na clínica, com hora marcada. Recebemos clientes destes bairros e cidades vizinhas.</p>
        <ul class="bairros" data-iguais>${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="rodape-cols">
      <div class="rodape-marca"><a class="logo" href="#inicio" aria-label="${M.completo}">${I.logo}</a><p>${esc(M.frase)}</p></div>
      <div><h3>Tratamentos</h3><ul>${SEG.map((s) => `<li data-seg="${s.id}"><a href="#seg-${s.id}">${s.nome}</a></li>`).join('')}<li><a href="#atendimento">Políticas de atendimento</a></li></ul></div>
      <div><h3>Canais de atendimento</h3><ul><li><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li><li><a href="tel:${M.telefone.replace(/\D/g, '')}">Telefone ${M.telefone}</a></li><li><a href="mailto:${M.email}">${M.email}</a></li></ul></div>
      <div><h3>Redes</h3>
        <div class="redes">
          <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
          <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
          <a href="${M.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${I.linkedin}</a>
          <a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a>
        </div>
        <p class="user">${M.instagramUser}</p>
      </div>
    </div>
    <div class="legal">
      <p><b>${M.razao}</b>, CNPJ ${M.cnpj}. ${endereco}, CEP ${M.cep}. Telefone ${M.telefone}, ${M.email}.</p>
      <p>Responsável técnica: ${R.nome}, ${R.cargo.split(',')[0].toLowerCase()}, ${R.registro}.</p>
      <div class="legal-links"><button type="button" class="link" data-doc="servico">Termos de prestação de serviço</button><button type="button" class="link" data-doc="uso">Termos de uso</button><button type="button" class="link" data-doc="privacidade">Política de privacidade</button><button type="button" class="link" data-cookies>Preferências de cookies</button></div>
      <p class="miudo">${C.avisoResultado} O conteúdo deste site é informativo e não substitui a avaliação individual.</p>
      ${listaCreditos ? `<details class="creditos"><summary>Créditos das imagens</summary><ul>${listaCreditos}</ul></details>` : ''}
    </div>
    <div class="rodape-fim"><span>© <span data-ano>2026</span> ${M.completo}. Marca fictícia de demonstração.</span><span>Preços e dados ilustrativos.</span></div>
  </div>
</footer>

<a class="whats-flutua" href="${wa(`Olá! Quero agendar uma avaliação na ${M.completo}.`)}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">${I.whats}<span>Agendar</span></a>

<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Usamos só o essencial para o site funcionar. Se você permitir, também medimos visitas de forma anônima para melhorar a página. <button type="button" class="link" data-doc="privacidade">Saiba mais</button></p>
  <div class="cookies-btns"><button type="button" class="btn btn-vinho" data-ck="todos">Aceitar todos</button><button type="button" class="btn btn-linha" data-ck="essenciais">Só os essenciais</button></div>
</div>

${dialogs}

<script>
${js}
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('ok', path.relative(process.cwd(), path.join(OUT, 'index.html')), `${Math.round(html.length / 1024)} KB`);
if (faltando.length) console.log('fotos faltando em _build/img/fotos/:', faltando.join(', '));
