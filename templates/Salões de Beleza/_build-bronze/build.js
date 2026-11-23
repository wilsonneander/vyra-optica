// Gera o Bronze de barbearia (Mecha Barbearia, marca fictícia) em "templates/Salões de Beleza/bronze/".
// Landing page de uma página com o desenho da referência pedida (Salona, feito no Framer): capa escura com retrato,
// sobre com três fotos em paralaxe, lista de serviços com foto presa, frase com colunas de fotos passando, cartão de agendamento,
// equipe em grade com selo girando, foto larga que cresce, frase corrida, políticas no lugar do blog e rodapé claro com mapa.
// Uso: node "templates/Salões de Beleza/_build-bronze/build.js"
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const T = require('../../_comum/tema-pilula');
const CHAVE_TEMA = 'mecha-barbearia-tema';

const OUT = path.join(__dirname, '..', 'bronze');
const PASTAS = [path.join(__dirname, 'img', 'fotos'), path.join(__dirname, '..', '_build-gold', 'img', 'fotos')];
const M = C.marca;

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${M.rua}, ${M.bairro}, ${M.cidade}`)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
const reais = (v) => `R$ ${v.toLocaleString('pt-BR')}`;
const minutos = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
const hora = (h) => `${Math.floor(h)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;
const tel = M.telefone.replace(/\D/g, '');
const DIAS_C = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const estrelas = `<span class="estrelas" aria-hidden="true">${I.estrela.repeat(5)}</span>`;

// resumo da agenda: junta dias seguidos com o mesmo horário ("Ter a qua, 10h às 19h")
const resumoAgenda = (ag) => {
  const grupos = [];
  for (let d = 1; d <= 7; d++) {
    const dia = d % 7, h = ag[dia];
    if (!h) continue;
    const ult = grupos.at(-1);
    if (ult && ult.h.join() === h.join() && ult.fim === d - 1) { ult.fim = d; ult.dias.push(dia); } else grupos.push({ h, fim: d, dias: [dia] });
  }
  return grupos.map((g) => {
    const ds = g.dias.length > 2 ? `${DIAS_C[g.dias[0]]} a ${DIAS_C[g.dias.at(-1)].toLowerCase()}` : g.dias.map((x, k) => (k ? DIAS_C[x].toLowerCase() : DIAS_C[x])).join(' e ');
    return `${ds}, ${hora(g.h[0])} às ${hora(g.h[1])}`;
  });
};

// ---------- fotos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
const usadas = new Map();
const acha = (nome) => PASTAS.map((p) => path.join(p, `${nome}.webp`)).find((f) => fs.existsSync(f));
const foto = (nome, { cls = '', lazy = true, alt, attrs = '' } = {}) => {
  const arq = acha(nome);
  if (!arq) console.warn('Foto faltando:', nome);
  usadas.set(nome, arq);
  const desc = alt ?? C.fotos[nome] ?? '';
  return `<img${cls ? ` class="${cls}"` : ''} src="assets/img/${nome}.webp" alt="${esc(desc)}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}${attrs}>`;
};

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400..700&family=Golos+Text:wght@400;500;600&display=swap" rel="stylesheet">';

// ---------- dados para o navegador ----------
const dados = {
  whatsapp: M.whatsapp, nome: M.completo, endereco, abertura: C.abertura,
  servicos: C.servicos.map(({ id, nome, min, preco, de, quimica }) => ({ id, nome, min, preco, de: !!de, quimica: !!quimica })),
  equipe: C.equipe.map(({ id, nome, faz, agenda }) => ({ id, nome, faz, agenda })),
};

// ---------- topo e painel ----------
const nav = [['sobre', 'Sobre'], ['servicos', 'Serviços'], ['equipe', 'Equipe'], ['politicas', 'Políticas'], ['contato', 'Contato']];
const redes = (cls = '') => `<div class="redes ${cls}">
      <a href="${M.instagram}" target="_blank" rel="noopener">${I.insta}<span>Instagram</span></a>
      <a href="${M.facebook}" target="_blank" rel="noopener">${I.face}<span>Facebook</span></a>
      <a href="${M.linkedin}" target="_blank" rel="noopener">${I.linkedin}<span>LinkedIn</span></a>
      <a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">${I.whats}<span>WhatsApp</span></a>
    </div>`;
const topo = `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo">
  <button class="painel-btn" type="button" aria-controls="painel" aria-expanded="false" aria-label="Abrir o painel com menu e contatos">${I.pontos}</button>
  <a class="logo" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>
  <nav class="menu" aria-label="Principal">${nav.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav>
  <a class="topo-cta" href="#agendar">Agendar horário</a>
</header>
<div class="painel" id="painel" hidden>
  <div class="painel-fundo" data-fecha-painel></div>
  <aside class="painel-caixa" aria-label="Menu e contatos">
    <div class="painel-cab"><span class="logo">${I.logo}</span><button type="button" class="fecha" data-fecha-painel aria-label="Fechar o painel">${I.fechar}</button></div>
    <nav class="painel-nav" aria-label="Menu do painel">${[['inicio', 'Início'], ...nav, ['agendar', 'Agendar horário']].map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav>
    <dl class="painel-info">
      <div><dt>Endereço</dt><dd>${M.endereco}, ${M.bairro}, ${M.cidade}</dd></div>
      <div><dt>Funcionamento</dt><dd>${C.horarioCurto}</dd></div>
      <div><dt>Telefone</dt><dd><a href="tel:${tel}">${M.telefone}</a></dd></div>
      <div><dt>E-mail</dt><dd><a href="mailto:${M.email}">${M.email}</a></dd></div>
    </dl>
    ${T.pilula('deitada', 'claro')}
    ${redes('redes-painel')}
  </aside>
</div>`;

// ---------- capa ----------
const capa = `<section class="capa" id="inicio">
  <figure class="capa-foto">${foto('capa-barba', { lazy: false, attrs: ' width="1200" height="628"' })}</figure>
  <div class="largo capa-in">
    <div class="capa-txt">
    <p class="oferta"><b>5% de desconto</b><span>na sua primeira visita</span></p>
    <h1 class="capa-tit"><span>Degradê no ponto,</span> <em>barba na navalha,</em> <span>estilo que dura.</span></h1>
    <div class="prova">
      <span class="rostos">${['l12', 'l9', 'l10'].map((f) => foto(f, { alt: '' })).join('')}</span>
      <div><p class="nota">${estrelas}<b>${String(M.nota).replace('.', ',')}</b></p><p>${M.avaliacoes.toLocaleString('pt-BR')} avaliações no Google</p></div>
    </div>
    </div>
  </div>
  <div class="largo capa-base">
    <p>Barbearia com hora marcada na ${M.bairro}. Corte, barba e acabamento na navalha, com o preço combinado no espelho antes de começar.</p>
    <div class="capa-btns">
      <a class="btn btn-linha-clara" href="tel:${tel}">${I.telefone}${M.telefone}</a>
      <a class="btn btn-ouro" href="#servicos">Ver serviços e preços</a>
    </div>
  </div>
</section>`;

// ---------- sobre ----------
const rotulo = (t) => `<p class="rotulo">${I.simbolo()}<span>${t}</span></p>`;
const sobre = `<section class="sobre" id="sobre">
  <div class="largo">
    <div class="sobre-cab rev">
      ${rotulo('Sobre a barbearia')}
      <h2>Barbearia, para a gente, é mais que um serviço. É o seu horário de sentar e não pensar em nada.</h2>
    </div>
    <div class="sobre-fotos">
      <figure class="sf sf-a" data-par="-0.10">${foto('corte-m4')}<span class="selo-ic" aria-hidden="true">${I.cadeira}</span></figure>
      <figure class="sf sf-b" data-par="0.06">${foto('corte-m3')}
        <figcaption class="vidro"><b>Nosso foco</b><span>Técnica de barbearia clássica com acabamento atual: degradê feito à mão, barba na toalha quente e navalha nova a cada cliente.</span></figcaption>
      </figure>
      <figure class="sf sf-c" data-par="-0.16">${foto('corte-m2')}<span class="selo-ic" aria-hidden="true">${I.lamina}</span></figure>
    </div>
    <dl class="numeros rev">
      <div><dt>Desde</dt><dd>${M.desde}</dd></div>
      <div><dt>Barbeiros</dt><dd>${C.equipe.length}</dd></div>
      <div><dt>Nota no Google</dt><dd>${String(M.nota).replace('.', ',')}</dd></div>
      <div><dt>Tolerância de atraso</dt><dd>15 min</dd></div>
    </dl>
  </div>
</section>`;

// ---------- serviços ----------
const servicos = `<section class="servicos" id="servicos">
  <div class="largo servicos-cab">
    ${rotulo('Serviços e preços')}
    <h2 class="rev">Tudo o que sai da nossa cadeira, com preço e tempo na mesa.</h2>
  </div>
  <div class="largo servicos-in">
    <div class="servicos-foto">${foto('barba-tesoura')}<p>Valores de referência. A pigmentação começa em ${reais(45)} e o valor final é fechado no espelho, antes de começar.</p></div>
    <ul class="lista-serv">
      ${C.servicos.map((s) => `<li class="serv rev${s.destaque ? ' destaque' : ''}">
        <div class="serv-txt"><h3>${esc(s.nome)}${s.destaque ? ' <small>o mais pedido</small>' : ''}</h3><p>${esc(s.inclui)}</p></div>
        <div class="serv-preco"><b>${s.de ? '<small>a partir de</small> ' : ''}${reais(s.preco)}</b><span>${minutos(s.min)}</span><a href="#agendar" data-servico="${s.id}">Agendar</a></div>
      </li>`).join('\n      ')}
    </ul>
  </div>
  <div class="largo pagamento rev">
    <p><b>Pagamento</b>${esc(C.pagamento)}</p>
    <p><b>Remarcação</b>Sem custo até 24 horas antes. <a href="#politicas">Ver todas as políticas</a></p>
  </div>
</section>`;

// ---------- avaliações: frase presa com colunas de fotos passando ----------
const avaliacoes = `<section class="avaliacoes" id="avaliacoes" aria-label="Avaliações de clientes">
  <div class="aval-palco">
    <div class="aval-frase">
      <p class="aval-estrelas">${estrelas}<span class="vh">Nota 5 de 5</span></p>
      <div class="aval-textos">${C.depoimentos.map((d, k) => `<blockquote class="aval${k ? '' : ' on'}" data-aval="${k}"><p>“${esc(d.texto)}”</p></blockquote>`).join('')}</div>
      <div class="aval-quem">${C.depoimentos.map((d, k) => `<p class="quem${k ? '' : ' on'}" data-aval="${k}">${foto(d.foto, { alt: '' })}<b>${esc(d.nome)}</b><span>${esc(d.serv)}</span></p>`).join('')}</div>
    </div>
    <div class="aval-cols" aria-hidden="true">
      ${C.colunas.map((col, k) => `<div class="aval-col" data-col="${k}">${col.map((f) => foto(f, { alt: '' })).join('')}</div>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- agendamento (cartão escuro da referência) ----------
const agendar = `<section class="agendar" id="agendar">
  <div class="largo">
    <div class="agendar-cartao">
      <div class="agendar-fundo">${foto('barba-toalha', { alt: '' })}</div>
      <div class="agendar-txt rev">
        ${rotulo('Agendamento')}
        <h2>Marque seu horário e saia daqui no ponto.</h2>
        <p>Mande o pedido e confirmamos em até uma hora, no horário de funcionamento. Depois de enviar, você pode salvar o horário no Google Agenda ou na agenda do celular.</p>
        <div class="agendar-btns">
          <a class="btn btn-ouro" href="${wa(`Olá! Quero marcar um horário na ${M.completo}.`)}" target="_blank" rel="noopener">${I.whats}Chamar no WhatsApp</a>
          <a class="btn btn-linha-clara" href="mailto:${M.email}">${I.carta}Enviar e-mail</a>
        </div>
      </div>
      <form class="form" id="form-agenda" novalidate>
        <h3>Pedir um horário</h3>
        <p class="form-nota">Campos com * são obrigatórios.</p>
        <div class="campos">
          <label><span>Nome *</span><input name="nome" autocomplete="name" required placeholder="Seu nome"></label>
          <label><span>Telefone ou WhatsApp *</span><input name="tel" type="tel" autocomplete="tel" inputmode="tel" required placeholder="(11) 90000-0000"></label>
          <label class="largura"><span>E-mail</span><input name="email" type="email" autocomplete="email" placeholder="voce@email.com"></label>
          <label><span>Serviço *</span><select name="servico" required><option value="">Escolha</option>${C.servicos.map((s) => `<option value="${s.id}">${esc(s.nome)}, ${s.de ? 'a partir de ' : ''}${reais(s.preco)}</option>`).join('')}</select></label>
          <label><span>Barbeiro</span><select name="prof"><option value="">Sem preferência</option></select></label>
          <label><span>Data *</span><input name="data" type="date" required></label>
          <label><span>Horário *</span><select name="hora" required disabled><option value="">Escolha serviço e data</option></select></label>
          <label class="largura"><span>Algo que devemos saber?</span><textarea name="obs" rows="2" placeholder="O corte que você quer, alergias, se é a primeira pigmentação"></textarea></label>
        </div>
        <p class="form-aviso" data-aviso-quimica hidden>Pigmentação pede teste de sensibilidade com 48 horas de antecedência para quem nunca fez aqui. Combinamos o teste na confirmação.</p>
        <label class="aceite"><input type="checkbox" name="lgpd" required><span>Li a <button type="button" class="link" data-doc="privacidade">Política de Privacidade</button> e autorizo o uso do meu nome, telefone e e-mail só para responder a este pedido. *</span></label>
        <label class="aceite"><input type="checkbox" name="novidades"><span>Quero receber lembretes de horário e novidades pelo WhatsApp. Posso cancelar quando quiser.</span></label>
        <p class="form-erro" role="alert" hidden></p>
        <button class="btn btn-escuro" type="submit">Enviar pedido pelo WhatsApp ${I.seta}</button>
        <div class="form-ok" role="status" hidden></div>
      </form>
    </div>
  </div>
</section>`;

// ---------- equipe (seção escura, cabeçalho centralizado e quatro cartões lado a lado) ----------
const equipe = `<section class="equipe" id="equipe">
  <div class="largo">
    <div class="equipe-cab rev">
      ${rotulo('Equipe')}
      <h2>Quatro barbeiros, quatro jeitos de acertar o seu corte.</h2>
      <p>Cada um tem a própria agenda. Escolha quem vai te atender e o formulário mostra só os horários livres dele.</p>
    </div>
    <div class="cards-equipe">
      ${C.equipe.map((p) => `<article class="barbeiro rev">
        ${foto(p.foto)}
        <div class="vidro">
          <div class="barbeiro-nome"><h3>${esc(p.nome)}</h3><p>${esc(p.esp)}</p></div>
          <div class="barbeiro-acoes">
            <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Trabalhos de ${esc(p.nome.split(' ')[0])} no Instagram da Mecha">${I.insta}</a>
            <a href="#agendar" data-prof="${p.id}" aria-label="Agendar com ${esc(p.nome.split(' ')[0])}">${I.agenda}</a>
          </div>
          <p class="dias">${resumoAgenda(p.agenda).join('<br>')}</p>
        </div>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- o espaço: foto larga que cresce + frase corrida ----------
const espaco = `<section class="espaco" id="espaco" aria-label="O espaço">
  <figure class="espaco-foto">${foto('espaco-barbearia')}<figcaption>${M.endereco}, ${M.bairro}. Cadeiras de couro, espelhos iluminados, lavatórios e café passado na hora.</figcaption></figure>
  <div class="corrida" aria-hidden="true"><p>Toalha quente, navalha nova e o seu horário respeitado do começo ao fim.</p></div>
  <p class="vh">Toalha quente, navalha nova e o seu horário respeitado do começo ao fim.</p>
</section>`;

// ---------- políticas e higiene (no lugar do blog da referência) ----------
const politicas = `<section class="politicas" id="politicas">
  <div class="largo">
    <div class="pol-cab rev">${rotulo('Políticas da casa')}<h2>Regras claras, combinadas antes da capa.</h2></div>
    <div class="pol-grade">
      ${C.politicas.map((p) => `<article class="pol rev${p.destaque ? ' destaque' : ''}">
        ${foto(p.foto)}
        <div><p class="pol-meta"><span>${esc(p.tipo)}</span>${p.destaque ? '<span class="atencao">Atenção</span>' : ''}</p><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></div>
      </article>`).join('\n      ')}
    </div>
    <div class="higiene rev">
      <h3>Higiene</h3>
      <ul>${C.higiene.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <p class="nota-juridica">Textos de políticas e higiene a validar na revisão jurídica antes da publicação.</p>
    </div>
  </div>
</section>`;

// ---------- rodapé ----------
const creditos = [
  ...JSON.parse(fs.readFileSync(path.join(__dirname, '..', '_build-gold', 'img', 'creditos.json'), 'utf8')),
  ...JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'creditos.json'), 'utf8')),
];
const dias = C.horarios.map(([d, h], i) => `<tr data-dia="${i}"><th scope="row">${d}</th><td>${h}</td></tr>`).join('');
const rodape = `<footer class="rodape" id="contato">
  <div class="largo">
    <div class="rod-topo">
      <a class="logo logo-grande" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>
      <form class="news" id="form-news" novalidate>
        <h2>Ganhe 5% no primeiro corte</h2>
        <div class="news-linha"><label class="vh" for="news-email">Seu e-mail</label><input id="news-email" name="email" type="email" autocomplete="email" placeholder="Seu e-mail" required><button class="btn btn-ouro" type="submit">Quero o desconto</button></div>
        <label class="aceite"><input type="checkbox" name="lgpd" required><span>Aceito receber e-mails da ${M.completo} e li a <button type="button" class="link" data-doc="privacidade">Política de Privacidade</button>. Dá para sair quando quiser.</span></label>
        <p class="news-msg" role="status" hidden></p>
      </form>
    </div>
    <div class="rod-meio">
      <div class="rod-frase"><p>Cabelo no ponto e barba no traço, com hora marcada na ${M.bairro}.</p>${redes()}</div>
      <div class="rod-cols">
        <div><h3>Navegue</h3><ul>${[['inicio', 'Início'], ...nav, ['agendar', 'Agendar horário']].map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ul></div>
        <div><h3>Atendimento</h3><ul><li><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li><li><a href="tel:${tel}">Telefone ${M.telefone}</a></li><li><a href="mailto:${M.email}">${M.email}</a></li><li><a href="#agendar">Agendamento online</a></li></ul></div>
        <div><h3>Onde estamos</h3><ul><li>${M.endereco}</li><li>${M.bairro}, ${M.cidade}, ${M.uf}</li><li>CEP ${M.cep}</li></ul></div>
      </div>
    </div>
    <div class="mapa-linha">
      <div class="map-box">
        <img src="assets/img/mapa_vila-madalena.webp" alt="Mapa da ${M.bairro}, ${M.cidade}, com a localização da ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${endereco}, CEP ${M.cep}</span><span>${C.horarioCurto}</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Só na barbearia, com hora marcada (quem chega sem horário é atendido se houver cadeira livre). Clientes destes bairros chegam a pé ou em poucos minutos.</p>
        <ul class="bairros">${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
        <table class="horas"><caption>Horário de funcionamento</caption>${dias}</table>
      </div>
    </div>
    <div class="legal">
      <p><b>${M.razao}</b> (${M.casa}), CNPJ ${M.cnpj}. ${endereco}, CEP ${M.cep}. Telefone ${M.telefone}. WhatsApp ${M.whatsappTexto}. ${M.email}.</p>
      <p>Material esterilizado em autoclave ou descartável. Pigmentos e produtos com registro ou notificação na Anvisa. Licença sanitária municipal em dia.</p>
      <div class="legal-links"><button type="button" class="link" data-doc="servico">Termos de prestação de serviço</button><button type="button" class="link" data-doc="uso">Termos de uso</button><button type="button" class="link" data-doc="privacidade">Política de privacidade</button><button type="button" class="link" data-cookies>Preferências de cookies</button></div>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditos.filter((c) => usadas.has(c.arq)).map((c) => `<li>${esc(c.arq)}: ${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.autor)}, ${esc(c.fonte)}</a>` : esc(c.autor)}</li>`).join('')}</ul></details>
    </div>
    <div class="rod-fim"><p>© ${new Date().getFullYear()} ${M.completo}. Todos os direitos reservados.</p><p>Modelo de site com marca, pessoas, preços e avaliações fictícios.</p></div>
  </div>
</footer>
<a class="whats-flutua" href="${wa(`Olá! Vim pelo site da ${M.completo}.`)}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${I.whats}<span>WhatsApp</span></a>`;

// ---------- janelas legais e cookies ----------
const legal = {
  servico: ['Termos de prestação de serviço', `
    <h3>Agendamento e confirmação</h3><p>O horário só está garantido depois da confirmação da ${M.completo} pelo WhatsApp, telefone ou e-mail. Sem hora marcada, o atendimento depende de cadeira livre.</p>
    <h3>Valores e pagamento</h3><p>Os preços do site são de referência. A pigmentação tem valor "a partir de", que depende da área a preencher e é fechado antes do serviço. Nenhum valor é alterado sem o seu aceite. Pix, débito e crédito; combos e pigmentação em até 2 vezes sem juros.</p>
    <h3>Atraso, cancelamento e remarcação</h3><p>Tolerância de 15 minutos. Cancelamento e remarcação sem custo até 24 horas antes. Duas faltas sem aviso pedem sinal de 30% via Pix nos agendamentos seguintes, abatido no valor do serviço.</p>
    <h3>Pigmentação e produtos químicos</h3><p>Teste de sensibilidade obrigatório, com 48 horas de antecedência para quem nunca fez o serviço aqui. O barbeiro pode recusar ou adiar o serviço quando a pele não estiver em condições, explicando o motivo. Informe alergias, medicamentos e procedimentos recentes.</p>
    <h3>Garantia</h3><p>Corte e barba: ajuste sem custo em até 7 dias. Pigmentação: retoque de cor sem custo em até 15 dias, seguindo os cuidados indicados. A garantia não cobre mudança de ideia sobre o resultado combinado nem procedimentos feitos fora da barbearia.</p>
    <h3>Higiene</h3><p>Material esterilizado em autoclave ou descartável e produtos com registro ou notificação na Anvisa. Texto a validar na revisão jurídica antes da publicação.</p>`],
  uso: ['Termos de uso', `
    <p>Este site apresenta os serviços da ${M.completo} (${M.razao}, CNPJ ${M.cnpj}) e recebe pedidos de agendamento. Ao usar o site, você concorda com estes termos.</p>
    <h3>Conteúdo</h3><p>Textos, marcas e imagens pertencem à ${M.nome} ou a seus autores, conforme os créditos. Fotos de clientes só são publicadas com autorização por escrito.</p>
    <h3>Pedidos de agendamento</h3><p>O formulário envia o pedido pelo WhatsApp. O horário só vale depois da nossa confirmação.</p>
    <h3>Links externos</h3><p>Mapas, agendas, redes sociais e WhatsApp abrem serviços de terceiros, com políticas próprias.</p>`],
  privacidade: ['Política de privacidade', `
    <p>A ${M.razao} (CNPJ ${M.cnpj}) trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
    <h3>Dados que coletamos</h3><p>Nome, telefone, e-mail, serviço, barbeiro, data e observações que você escreve no formulário, e o e-mail do cadastro de desconto. Alergias informadas para a pigmentação são dados sensíveis e só são usadas para a sua segurança no atendimento.</p>
    <h3>Para que usamos</h3><p>Responder ao pedido, confirmar e lembrar o horário e registrar o serviço feito. Novidades e promoções só com o seu consentimento, que pode ser retirado a qualquer momento.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins de publicidade. O pedido trafega pelo WhatsApp (Meta) e os pagamentos pelo processador do cartão ou do Pix.</p>
    <h3>Por quanto tempo</h3><p>Pedidos sem atendimento são apagados em 6 meses. Fichas de cliente ficam enquanto houver relação com a barbearia e pelo prazo legal depois dela.</p>
    <h3>Seus direitos</h3><p>Confirmar, acessar, corrigir, apagar ou levar seus dados, e revogar consentimentos, pelo e-mail ${M.email}. Encarregado de dados: ${M.razao}.</p>
    <h3>Cookies e armazenamento</h3><p>O site guarda no seu navegador apenas a sua escolha sobre cookies. Não usamos cookies de publicidade. Medição de visitas só com a sua permissão no aviso de cookies.</p>`],
};
const dialogs = `${Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-cab"><h2 id="doc-${id}-t">${t}</h2><button type="button" class="doc-fecha" data-fecha aria-label="Fechar">${I.fechar}</button></div>
  <div class="doc-corpo">${corpo}<p class="doc-data">Atualizado em novembro de 2026.</p></div>
</dialog>`).join('\n')}
<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Usamos só o armazenamento necessário para o site funcionar. Medição de visitas, apenas se você permitir. <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</p>
  <div class="cookies-btns" data-iguais><button type="button" class="btn btn-escuro" data-ck="todos">Aceitar todos</button><button type="button" class="btn btn-linha" data-ck="essenciais">Só os essenciais</button></div>
</div>
<div class="toast" data-toast role="status" aria-live="polite"></div>`;

// ---------- SEO local ----------
const ld = {
  '@context': 'https://schema.org', '@type': 'BarberShop', name: M.completo, url: M.dominio,
  image: `${M.dominio}/assets/img/capa-barba.webp`, telephone: M.telefone, email: M.email, priceRange: 'R$ 25 a R$ 105',
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: -23.5564, longitude: -46.6893 },
  openingHoursSpecification: Object.entries(C.abertura).filter(([, h]) => h).map(([d, h]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d], opens: `${String(h[0]).padStart(2, '0')}:00`, closes: `${String(h[1]).padStart(2, '0')}:00` })),
  aggregateRating: { '@type': 'AggregateRating', ratingValue: M.nota, reviewCount: M.avaliacoes },
  sameAs: [M.instagram, M.facebook, M.linkedin],
};
const titulo = `${M.completo} | Barbearia na ${M.bairro}, ${M.cidade}`;
const descricao = `Barbearia com hora marcada na ${M.bairro}: corte masculino, degradê na navalha, barba com toalha quente, sobrancelha e pigmentação. Preços claros e agendamento online.`;

const html = `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${M.dominio}/">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(titulo)}"><meta property="og:description" content="${esc(descricao)}"><meta property="og:image" content="${M.dominio}/assets/img/capa-barba.webp"><meta property="og:locale" content="pt_BR">
<meta name="theme-color" content="#161311">
${T.head(CHAVE_TEMA)}
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${fontes}
<link rel="stylesheet" href="assets/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
${topo}
<main id="conteudo">
${capa}
${sobre}
${servicos}
${avaliacoes}
${agendar}
${equipe}
${espaco}
${politicas}
</main>
${rodape}
${T.pilula('tema-lado', 'claro')}
${dialogs}
<script type="application/json" id="dados">${JSON.stringify(dados)}</script>
<script src="assets/site.js" defer></script>
</body>
</html>
`;

// ---------- grava ----------
for (const [nome, arq] of usadas) if (arq) fs.copyFileSync(arq, path.join(OUT, 'assets', 'img', `${nome}.webp`));
fs.copyFileSync(path.join(__dirname, '..', '_build-gold', 'img', 'mapa_vila-madalena.webp'), path.join(OUT, 'assets', 'img', 'mapa_vila-madalena.webp'));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'assets', 'site.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
fs.writeFileSync(path.join(OUT, 'assets', 'site.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + T.js(CHAVE_TEMA, '#161311', '#161311'));
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${M.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${M.dominio}/</loc></url></urlset>\n`);
console.log(`ok: ${OUT} (${usadas.size} fotos)`);
