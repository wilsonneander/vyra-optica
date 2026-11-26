// Gera o Mecha Premium Vinho em templates/saloes/premium/mecha-premium-vinho/.
// Estrutura da referência pedida (Salonix, feita no Framer): capa escura com o nome gigante, manifesto com quatro fotos,
// problema e solução, serviços em sanfona, "por que a Mecha" em blocos, faixa de cinema, avaliações espalhadas,
// o atendimento em três momentos, dúvidas com foto, galeria desencontrada, agendamento com foto e rodapé vinho
// com a marca gigante. Páginas: início, serviços, sobre (com a equipe), contato e 404.
// Uso: node templates/saloes/_build-mecha-premium-vinho/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const T = require('../../_comum/tema-pilula');
const fabricaPartes = require('../_build-mecha-standard-terracota/partes');

const CHAVE_TEMA = 'mecha-vinho-tema';
const COR_CLARO = '#4A1512', COR_ESCURO = '#120A08';
const OUT = path.join(__dirname, '..', 'premium', 'mecha-premium-vinho');
const IMG = path.join(__dirname, 'img');
const IMG_TERRACOTA = path.join(__dirname, '..', '_build-mecha-standard-terracota', 'img');
const IMG_PREMIUM = path.join(__dirname, '..', '_build-mecha-premium', 'img');
const PASTAS = [IMG, IMG_TERRACOTA, IMG_PREMIUM].map((p) => path.join(p, 'fotos'));
const M = C.marca;

// ---------- fotos usadas (copiadas para assets/img) ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
const usadas = new Map();
const usa = (nome) => {
  if (usadas.has(nome)) return;
  const arq = PASTAS.map((p) => path.join(p, `${nome}.webp`)).find((f) => fs.existsSync(f));
  if (!arq) throw new Error(`Foto faltando: ${nome}`);
  usadas.set(nome, arq);
};
const fotoSrc = (n) => { usa(n); return `assets/img/${n}.webp`; };
const alt = (n) => C.fotos[n] ?? '';

const wa = (msg) => `https://wa.me/55${String(M.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
const P = fabricaPartes({ I, fotoSrc, wa });
const { esc, reais, minutos } = P;
const foto = (nome, o = {}) => P.img(nome, o.alt ?? alt(nome), o);

const instaUrl = `https://instagram.com/${C.instagram.usuario}`;
const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(`${M.completo} ${M.bairro}`)}`;
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${M.endereco}, ${M.bairro}, ${M.cidade}`)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
const tel = M.telefone.replace(/\D/g, '');
const nota = String(M.nota).replace('.', ',');
const estrelas = `<span class="estrelas" aria-hidden="true">${I.estrela.repeat(5)}</span>`;
const SEG = Object.fromEntries(C.segmentos.map((g) => [g.id, g]));
const servicosDo = (id) => C.servicos.filter((s) => s.seg === id);
const menorPreco = (id) => Math.min(...servicosDo(id).map((s) => s.preco));

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;600;700;800;900&family=Familjen+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">';

// ---------- peças pequenas ----------
// botão com preenchimento que escorre a partir do mouse e texto que rola para cima (o texto se repete em data-t)
const btn = (href, texto, { cls = 'btn-acento', ic = I.seta, attrs = '', antes = '' } = {}) =>
  `<a class="btn ${cls}" href="${href}" data-magnetic${attrs}>${antes}<span class="btn-txt" data-t="${esc(texto)}"><span>${esc(texto)}</span></span>${ic || ''}</a>`;
// texto de apoio entre colchetes, como na referência (texto simples, sem caixa nem borda)
const apoio = (t) => `<p class="apoio">[ ${esc(t)} ]</p>`;
// título que sobe palavra por palavra
const palavras = (t) => t.split(' ').map((p, k) => `<span class="pal" style="--k:${k}"><span>${esc(p)}</span></span>`).join(' ');
const tituloSec = (t, tag = 'h2', cls = '') => `<${tag} class="titulo-sec${cls}" aria-label="${esc(t)}"><span aria-hidden="true">${palavras(t)}</span></${tag}>`;
const cabSec = ({ ap, titulo, texto, acao = btn('#agendar', 'Agendar'), tag = 'h2' }) => `<div class="sec-cab">
      ${apoio(ap)}
      ${tituloSec(titulo, tag)}
      <div class="sec-cab-pe"><p>${texto}</p>${acao}</div>
    </div>`;
const mascara = (nome, o = {}) => `<figure class="mascara${o.cls ? ` ${o.cls}` : ''}"${o.cursor ? ` data-cursor="${o.cursor}"` : ''}>${foto(nome, o)}</figure>`;

// ---------- topo, menu, carregando, cortina, cursor ----------
const navItens = (pg) => {
  const ini = pg === 'inicio' ? '' : 'index.html';
  return [['index.html', 'Início', 'inicio'], ['servicos.html', 'Serviços', 'servicos'], ['sobre.html', 'Sobre e equipe', 'sobre'], [`${ini}#galeria`, 'Galeria', ''], [`${ini}#duvidas`, 'Dúvidas', ''], ['contato.html', 'Contato', 'contato']];
};
const agendarHref = (pg) => (pg === 'inicio' ? '#agendar' : 'index.html#agendar');
const topo = (pg) => `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo">
  <div class="largo topo-in">
    <a class="logo" href="index.html" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="menu" id="menu" aria-label="Principal">
      ${navItens(pg).map(([h, t, id]) => `<a href="${h}"${id && id === pg ? ' aria-current="page"' : ''}><span class="btn-txt" data-t="${t}"><span>${t}</span></span></a>`).join('\n      ')}
      <div class="menu-tema">${T.pilula('deitada', 'claro')}</div>
    </nav>
    <div class="topo-acoes">
      ${btn(agendarHref(pg), 'Agendar', { cls: 'btn-acento btn-p', ic: I.diag })}
      <button class="menu-btn" type="button" aria-controls="menu" aria-expanded="false" aria-label="Abrir o menu"><i></i><i></i></button>
    </div>
  </div>
</header>`;

// carregando: a mecha do símbolo se desenha, as palavras trocam e o contador vai a 100; depois a cortina sobe
const abertura = `<div class="abertura" id="abertura" aria-hidden="true">
  <svg class="ab-mecha" viewBox="0 0 32 32"><path class="ab-lamina" d="M25.6 3.4 27.8 5.2 8.6 28.8 6.2 27.2Z"/><path class="ab-fio" d="M6.4 3.6C14.8 6.4 9 13.2 15.6 17.2 21.4 20.6 18.6 26 26.4 28.6"/></svg>
  <p class="ab-palavra" data-ab-palavra>${C.abertura[0]}</p>
  <p class="ab-conta"><span data-ab-conta>0</span></p>
</div>`;
const cortina = `<div class="cortina" aria-hidden="true"><span class="cortina-logo">${I.simbolo()}</span></div>`;
const cursor = '<div class="cursor" aria-hidden="true"><i class="cursor-ponto"></i><i class="cursor-anel"><b data-cursor-txt></b></i></div>';

// ---------- capa ----------
const capa = `<section class="capa" id="inicio">
  <div class="capa-fotos" aria-hidden="true">
    ${C.capaFotos.map((f, k) => `<figure class="capa-foto${k === 0 ? ' ativa' : ''}">${foto(f, { lazy: k > 0, alt: '', attrs: k === 0 ? ' fetchpriority="high"' : '' })}</figure>`).join('\n    ')}
  </div>
  <div class="largo capa-in">
    <p class="capa-apoio">Salão de beleza na ${M.bairro}</p>
    <h1 class="capa-nome" aria-label="${M.nome}, salão de beleza"><span aria-hidden="true">${[...M.nome.toUpperCase()].map((l, k) => `<span class="letra" style="--k:${k}">${l}</span>`).join('')}</span></h1>
    <p class="capa-txt">Cabelo feito sob medida para a sua textura, o seu rosto e a sua rotina. Conversa no espelho antes de cada serviço e preço fechado antes de começar.</p>
    <div class="capa-btns" data-iguais>${btn('servicos.html', 'Ver serviços', { cls: 'btn-claro' })}${btn('contato.html', 'Contato', { cls: 'btn-vidro' })}</div>
    <a class="capa-cartao" href="servicos.html#seg-cor" data-cursor="Ver">
      ${foto('ondas-loiras', { alt: '' })}
      <span class="capa-cartao-txt"><b>Mechas e balayage</b><span>O serviço mais agendado</span><span>A partir de ${reais(480)}</span></span>
      <i aria-hidden="true">${I.mais}</i>
    </a>
    <div class="capa-pontos" role="group" aria-label="Fotos da capa">${C.capaFotos.map((f, k) => `<button type="button" data-capa="${k}" aria-label="Foto ${k + 1} de ${C.capaFotos.length}: ${esc(alt(f))}" aria-pressed="${k === 0}"><i></i></button>`).join('')}</div>
  </div>
  <a class="capa-desce" href="#manifesto" aria-label="Descer para o conteúdo"><span>Role</span><i></i></a>
</section>`;

// ---------- manifesto: nota, frase e quatro fotos com uma palavra ----------
const manifesto = `<section class="manifesto" id="manifesto">
  <div class="largo">
    <a class="nota" href="${googleUrl}" target="_blank" rel="noopener">${I.ramo}<span>${estrelas}<small>${nota} de 5 em ${M.avaliacoes} avaliações</small></span>${I.ramo.replace('class="ramo"', 'class="ramo ramo-d"')}</a>
    <p class="manifesto-frase">${palavras('Profissionais que escutam. Produtos que respeitam o fio. Preço combinado antes da capa. É assim que o cabelo bonito acontece.')}</p>
    <div class="manifesto-acao">${btn('#agendar', 'Agendar horário', { ic: I.diag })}</div>
    <div class="manifesto-fotos">
      ${C.manifesto.map((m, k) => `<figure class="mf" style="--k:${k}">${foto(m.foto)}<figcaption>${esc(m.palavra)}</figcaption></figure>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- problema e solução: cartas que viram ----------
const solucoes = `<section class="solucoes" id="solucoes">
  <div class="largo">
    ${cabSec({ ap: 'Problema e solução', titulo: 'Soluções', texto: 'Problema de cabelo de verdade pede solução de verdade: não um disfarce para o fim de semana, mas um resultado que dura.' })}
    <div class="cartas">
      ${C.solucoes.map((s, k) => `<article class="carta" style="--k:${k}">
        <button type="button" class="carta-in" aria-pressed="false" aria-label="${esc(s.problema)}: ver a solução" data-cursor="Virar">
          <span class="carta-frente">
            ${foto(s.foto)}
            <span class="carta-txt"><small>O problema</small><b>${esc(s.problema)}</b><span>${esc(s.antes)}</span></span>
            <i class="carta-vira" aria-hidden="true">${I.vira}</i>
          </span>
          <span class="carta-verso">
            <small>A solução</small><b>${esc(s.solucao)}</b><span>${esc(s.depois)}</span>
            <em>${esc(C.servicos.find((x) => x.id === s.servico).nome)}, a partir de ${reais(C.servicos.find((x) => x.id === s.servico).preco)}</em>
          </span>
        </button>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- serviços: sanfona por segmento ----------
const aviso = (s) => (s.quimica ? '<small class="sv-q">Teste de mecha 48h antes</small>' : '');
const svItem = (s) => `<li class="sv${s.destaque ? ' sv-destaque' : ''}">
            <div class="sv-txt"><b>${esc(s.nome)}${s.destaque ? '<em>o mais pedido</em>' : ''}</b><span>${esc(s.inclui)}</span>${aviso(s)}</div>
            <span class="sv-tempo">${I.relogio}${minutos(s.min)}</span>
            <span class="sv-preco">${s.de ? '<small>a partir de</small>' : ''}${reais(s.preco)}</span>
            <a class="sv-ag" href="index.html?servico=${s.id}#agendar" data-servico="${s.id}" aria-label="Agendar ${esc(s.nome)}">${I.diag}</a>
          </li>`;
const etapas = (g) => `<ul class="etapas" aria-label="Etapas">${g.etapas.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>`;
const servicos = `<section class="servicos" id="servicos">
  <div class="largo">
    ${cabSec({ ap: 'O que fazemos', titulo: 'Serviços', texto: 'Seis frentes de trabalho, cada uma com a sua especialista. Os preços são de referência e o valor final é fechado antes de começar.', acao: btn('servicos.html', 'Todos os preços') })}
    <div class="sanfona" data-sanfona>
      ${C.segmentos.map((g, k) => `<details class="svc" name="servicos"${k === 0 ? ' open' : ''} id="seg-${g.id}">
        <summary><span class="svc-mini">${foto(g.foto, { alt: '' })}</span><h3>${esc(g.nome)}</h3>${etapas(g)}<span class="svc-de">a partir de ${reais(menorPreco(g.id))}</span><i class="svc-mais" aria-hidden="true">${I.mais}</i></summary>
        <div class="svc-corpo">
          ${mascara(g.foto, { cls: 'svc-foto' })}
          <div class="svc-txt">
            ${apoio(g.apoio)}
            <h4>${esc(g.nome)}</h4>
            <p>${esc(g.texto)}</p>
            <ul class="sv-lista">
          ${servicosDo(g.id).map(svItem).join('\n          ')}
            </ul>
            ${btn(`index.html?servico=${servicosDo(g.id)[0].id}#agendar`, 'Agendar este serviço', { cls: 'btn-acento btn-largo', attrs: ` data-servico="${servicosDo(g.id)[0].id}"` })}
          </div>
        </div>
      </details>`).join('\n      ')}
    </div>
    <dl class="condicoes">
      <div><dt>Pagamento</dt><dd>${esc(C.pagamento)}</dd></div>
      <div><dt>Valores "a partir de"</dt><dd>${esc(C.aPartir)}</dd></div>
      <div><dt>Cancelamento e remarcação</dt><dd>Sem custo até 24 horas antes. <a href="#politicas">Ver todas as políticas</a></dd></div>
    </dl>
  </div>
</section>`;

// ---------- por que a Mecha: blocos de tamanhos diferentes ----------
const W = C.porque;
const chips = (lista) => `<ul class="chips">${lista.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;
const porque = `<section class="porque" id="porque">
  <div class="largo">
    ${cabSec({ ap: 'Por que a Mecha', titulo: 'Por que nós?', texto: 'Cabelo bonito com atendimento sem pressa, produtos profissionais e cuidado que continua quando você vai para casa.' })}
    <div class="bento">
      <article class="bt bt-paixao" data-inclina>${foto(W.paixao.foto)}<div><h3>${esc(W.paixao.titulo)}</h3><p>${esc(W.paixao.texto)}</p></div></article>
      <article class="bt bt-produtos" data-inclina><div><h3>${esc(W.produtos.titulo)}</h3><p>${esc(W.produtos.texto)}</p>${chips(W.produtos.etiquetas)}</div>${foto(W.produtos.foto)}</article>
      <article class="bt bt-leque" data-inclina><div class="leque" aria-hidden="true">${W.leque.map((f, k) => `<span style="--k:${k - 1}">${foto(f, { alt: '' })}</span>`).join('')}</div><p class="bt-num"><b data-conta="${W.atendimentos}">${W.atendimentos.toLocaleString('pt-BR')}</b>+</p><p>Atendimentos por mês, entre corte, cor, cachos e penteados.</p></article>
      <article class="bt bt-marca" data-inclina>${foto(W.marcaFoto)}<p class="bt-logo">${I.simbolo()}<b>${M.nome}</b></p></article>
      <article class="bt bt-casa" data-inclina><div><h3>${esc(W.casa.titulo)}</h3><p>${esc(W.casa.texto)}</p>${chips(W.casa.etiquetas)}</div>${foto('oleo')}</article>
      <article class="bt bt-voltam" data-inclina><div class="rostos" aria-hidden="true">${W.rostos.map((f) => foto(f, { alt: '' })).join('')}</div><p class="bt-num"><b data-conta="${W.voltam}">${W.voltam}</b>%</p><p>Das clientes voltam em até três meses.</p></article>
    </div>
  </div>
</section>`;

// ---------- faixa de cinema ----------
const cinema = `<section class="cinema" aria-label="O salão">
  <div class="cinema-fotos" aria-hidden="true">${C.cinema.fotos.map((f) => foto(f, { alt: '' })).join('')}</div>
  <p class="cinema-frase">${palavras(C.cinema.frase)}</p>
</section>`;

// ---------- avaliações: uma no centro, as outras espalhadas em volta ----------
const d0 = C.depoimentos[0];
const avaliacoes = `<section class="avaliacoes" id="avaliacoes">
  <div class="largo aval-palco">
    <div class="aval-centro" aria-live="polite">
      <a class="nota" href="${googleUrl}" target="_blank" rel="noopener">${I.ramo}<span>${estrelas}<small>${nota} de 5 em ${M.avaliacoes} avaliações</small></span>${I.ramo.replace('class="ramo"', 'class="ramo ramo-d"')}</a>
      <blockquote data-aval-txt><p>${esc(d0.texto)}</p></blockquote>
      <p class="aval-quem"><b data-aval-nome>${esc(d0.nome)}</b><span data-aval-serv>${esc(d0.serv)}</span></p>
    </div>
    <ul class="aval-cartoes" aria-label="Outras avaliações" data-transborda>
      ${C.depoimentos.map((d, k) => `<li class="ac" style="--k:${k}"${k === 0 ? ' hidden' : ''}><button type="button" data-aval="${k}" data-cursor="Ler">
        <span class="ac-foto">${foto(d.foto, { alt: '' })}<span class="ac-sobre">${estrelas}<span>${esc(d.texto.split('. ')[0].replace(/\.$/, ''))}.</span></span></span>
        <span class="ac-quem"><b>${esc(d.nome)}</b><small>${esc(d.serv)}</small></span>
      </button></li>`).join('\n      ')}
    </ul>
  </div>
  <script type="application/json" id="avaliacoes-dados">${JSON.stringify(C.depoimentos.map(({ nome, serv, texto }) => ({ nome, serv, texto })))}</script>
  <p class="largo aval-nota">Avaliações de exemplo no formato das do Google. Fotos ilustrativas.</p>
</section>`;

// ---------- o atendimento em três momentos ----------
const processo = `<section class="processo" id="processo">
  <div class="largo">
    ${cabSec({ ap: 'Como funciona', titulo: 'O atendimento', texto: 'Toda visita na Mecha segue o mesmo caminho, pensado em volta de você e do seu cabelo.' })}
    <div class="proc" data-proc>
      <div class="proc-fotos">${C.processo.map((p, k) => `<figure class="proc-foto${k === 0 ? ' ativa' : ''}">${foto(p.foto)}</figure>`).join('')}</div>
      <div class="proc-abas" role="tablist" aria-label="Momentos do atendimento">
        ${C.processo.map((p, k) => `<button type="button" role="tab" id="proc-${k}" aria-selected="${k === 0}" aria-controls="proc-p" data-proc-aba="${k}"><b>${esc(p.titulo)}</b><span>${esc(p.texto)}</span><i class="proc-barra"></i></button>`).join('\n        ')}
      </div>
      <p class="vh" id="proc-p" role="tabpanel" aria-labelledby="proc-0" aria-live="polite">${esc(C.processo[0].texto)}</p>
    </div>
  </div>
</section>`;

// ---------- tendências: carrossel ----------
const tendencias = `<section class="tendencias" id="tendencias">
  <div class="largo tend-cab">
    <div>${apoio('Tendências da estação')}${tituloSec('Lookbook')}</div>
    <div class="setas"><button type="button" class="seta" data-car="-1" aria-label="Fotos anteriores">${I.esquerda}</button><button type="button" class="seta" data-car="1" aria-label="Próximas fotos">${I.direita}</button></div>
  </div>
  <div class="carrossel" data-carrossel data-transborda tabindex="0" aria-roledescription="carrossel" aria-label="Tendências da estação" data-cursor="Arrastar">
    ${C.looks.map((l) => `<figure class="look">${foto(l.foto)}<figcaption><b>${esc(l.nome)}</b><span>${esc(l.texto)}</span></figcaption></figure>`).join('\n    ')}
  </div>
  <div class="largo tend-pe"><p>Referências para a conversa no espelho. A profissional adapta cada uma ao seu fio e ao seu rosto.</p><i class="car-progresso" aria-hidden="true"><i></i></i></div>
</section>`;

// ---------- galeria por categoria ----------
const cats = [...C.segmentos.map((g) => [g.id, g.curto]), ['espaco', 'O espaço']].filter(([id]) => C.galeria.some((f) => f.cat === id));
const galeria = `<section class="galeria" id="galeria">
  <div class="largo">
    ${cabSec({ ap: 'Resultados reais', titulo: 'Galeria', texto: 'Trabalhos da equipe e o dia a dia do salão, separados por categoria. Toque numa foto para ver maior.' })}
    <div class="filtros" role="group" aria-label="Filtrar a galeria por categoria" data-iguais>
      <button type="button" data-filtro="todos" aria-pressed="true">Todos</button>
      ${cats.map(([id, t]) => `<button type="button" data-filtro="${id}" aria-pressed="false">${esc(t)}</button>`).join('\n      ')}
    </div>
    <div class="gal-grade" data-galeria>
      ${C.galeria.map((f, k) => `<figure class="gal" data-cat="${f.cat}" style="--k:${k % 4}"><button type="button" data-abre aria-label="Ampliar: ${esc(f.legenda)}" data-cursor="Ver">${foto(f.foto)}</button><figcaption>${esc(f.legenda)}</figcaption></figure>`).join('\n      ')}
    </div>
  </div>
</section>
<dialog class="caixa-foto" id="caixa-foto" aria-label="Foto ampliada">
  <figure><img src="" alt=""><figcaption><b data-cf-leg></b><span data-cf-pos></span></figcaption></figure>
  <button type="button" class="cf-btn cf-fecha" data-fecha aria-label="Fechar">${I.fechar}</button>
  <button type="button" class="cf-btn cf-ant" data-cf="-1" aria-label="Foto anterior">${I.esquerda}</button>
  <button type="button" class="cf-btn cf-prox" data-cf="1" aria-label="Próxima foto">${I.direita}</button>
</dialog>`;

// ---------- Instagram incorporado ----------
const G = C.instagram;
const instagram = `<section class="insta" id="instagram">
  <div class="largo insta-in">
    <div class="insta-perfil">
      ${apoio('No Instagram')}
      <div class="insta-topo"><span class="insta-avatar" aria-hidden="true">${I.simbolo()}</span><div><h2>@${G.usuario}</h2><p>${esc(G.nome)}</p></div></div>
      <dl class="insta-num"><div><dt>publicações</dt><dd>${G.posts}</dd></div><div><dt>seguidores</dt><dd>${G.seguidores}</dd></div><div><dt>seguindo</dt><dd>${G.seguindo}</dd></div></dl>
      <p class="insta-bio">${esc(G.bio)}</p>
      ${btn(instaUrl, 'Seguir no Instagram', { attrs: ' target="_blank" rel="noopener"', ic: I.insta })}
    </div>
    <div class="insta-grade">
      ${G.fotos.map((f) => `<a class="insta-post" href="${instaUrl}" target="_blank" rel="noopener" data-cursor="Abrir">${foto(f.foto, { alt: f.legenda })}<span class="insta-sobre" aria-hidden="true"><span>${I.coracao}${f.curtidas.toLocaleString('pt-BR')}</span><span>${I.balao}${f.comentarios}</span></span></a>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- dúvidas com foto ----------
const duvidas = `<section class="duvidas" id="duvidas">
  <div class="largo">
    ${cabSec({ ap: 'Dúvidas comuns', titulo: 'Clareza', texto: `Respostas curtas para o que mais perguntam na recepção. Não achou a sua? <a href="${wa(`Olá, ${M.completo}! Tenho uma dúvida:`)}" target="_blank" rel="noopener">Pergunte no WhatsApp</a>.`, acao: btn('contato.html', 'Fale conosco', { cls: 'btn-linha' }) })}
    <div class="duv-in">
      ${mascara('espelho-mao', { cls: 'duv-foto' })}
      <div class="duv-lista">
        ${C.faq.map(([q, r], k) => `<details class="duv"${k === 0 ? ' open' : ''} name="duvidas"><summary><span>${esc(q)}</span><i aria-hidden="true">${I.mais}</i></summary><p>${esc(r)}</p></details>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>`;

// ---------- políticas e higiene ----------
const politicas = `<section class="politicas" id="politicas">
  <div class="largo pol-in">
    <div class="pol-lista">
      ${apoio('Políticas da casa')}
      ${tituloSec('Regras claras')}
      ${C.politicas.map((p, k) => `<details class="pol${p.destaque ? ' destaque' : ''}"${k === 0 || p.destaque ? ' open' : ''}><summary><span>${esc(p.titulo)}${p.destaque ? '<small>Atenção</small>' : ''}</span><i aria-hidden="true">${I.mais}</i></summary><p>${esc(p.texto)}</p></details>`).join('\n      ')}
    </div>
    <aside class="higiene">
      <h3>Higiene e produtos</h3>
      <ul>${C.higiene.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <p class="nota-juridica">Textos de políticas e higiene a validar na revisão jurídica antes da publicação.</p>
    </aside>
  </div>
</section>`;

// ---------- agendamento: serviço, profissional, dia e horário ----------
const opcoes = C.segmentos.map((g) => `<optgroup label="${esc(g.nome)}">${servicosDo(g.id).map((s) => `<option value="${s.id}">${esc(s.nome)}</option>`).join('')}</optgroup>`).join('');
const agendar = `<section class="agendar" id="agendar">
  <div class="largo">
    ${cabSec({ ap: 'Vamos começar', titulo: 'Agendar', texto: 'Escolha o serviço, a profissional, o dia e o horário. O pedido segue pronto pelo WhatsApp e confirmamos em até uma hora.', acao: '' })}
    <div class="ag-in">
      <form class="form" id="form-agenda" novalidate>
        <div class="passo">
          <label class="campo"><span>Qual serviço? *</span><select name="servico" required><option value="">Escolha o serviço</option>${opcoes}</select></label>
          <p class="form-aviso" data-aviso-quimica hidden></p>
        </div>
        <fieldset class="passo"><legend>Com quem? *</legend><div class="pros-escolha" data-pros-escolha></div></fieldset>
        <div class="passo"><label class="campo"><span>Que dia? *</span><input name="data" type="date" required></label></div>
        <fieldset class="passo"><legend>Que horas? *</legend><div class="horarios" data-horarios><p class="horarios-vazio">Escolha o serviço e o dia para ver os horários.</p></div></fieldset>
        <div class="campos">
          <label class="campo"><span>Nome *</span><input name="nome" autocomplete="name" required placeholder="Seu nome"></label>
          <label class="campo"><span>Telefone ou WhatsApp *</span><input name="tel" type="tel" autocomplete="tel" inputmode="tel" required placeholder="(11) 90000-0000"></label>
          <label class="campo larga"><span>E-mail</span><input name="email" type="email" autocomplete="email" placeholder="voce@email.com"></label>
          <label class="campo larga"><span>Algo que devemos saber?</span><textarea name="obs" rows="3" placeholder="O resultado que você quer, alergias, química recente, outro serviço no mesmo dia"></textarea></label>
        </div>
        <label class="aceite"><input type="checkbox" name="lgpd" required><span>Li a <button type="button" class="link" data-doc="privacidade">Política de Privacidade</button> e autorizo o uso do meu nome, telefone e e-mail só para responder a este pedido. *</span></label>
        <label class="aceite"><input type="checkbox" name="novidades"><span>Quero receber lembretes e novidades pelo WhatsApp. Posso cancelar quando quiser.</span></label>
        <p class="form-erro" role="alert" hidden></p>
        <button class="btn btn-acento btn-largo" type="submit" data-magnetic><span class="btn-txt" data-t="Enviar pedido pelo WhatsApp"><span>Enviar pedido pelo WhatsApp</span></span>${I.whats}</button>
        <div class="form-ok" role="status" hidden></div>
      </form>
      <aside class="ag-lado" aria-live="polite">
        ${mascara('cliente-sorri', { cls: 'ag-foto' })}
        <dl class="ag-resumo">
          <div><dt>Serviço</dt><dd data-r="servico">Escolha o serviço</dd></div>
          <div><dt>Com</dt><dd data-r="pro">Sem preferência</dd></div>
          <div><dt>Quando</dt><dd data-r="quando">Escolha o dia e o horário</dd></div>
          <div><dt>Duração</dt><dd data-r="tempo">&nbsp;</dd></div>
          <div class="ag-total"><dt>Valor</dt><dd data-r="valor">&nbsp;</dd></div>
        </dl>
      </aside>
    </div>
  </div>
</section>`;

// ---------- rodapé com mapa e a marca gigante ----------
const creditos = [IMG, IMG_TERRACOTA, IMG_PREMIUM].flatMap((p) => JSON.parse(fs.readFileSync(path.join(p, 'creditos.json'), 'utf8')));
const creditosUsados = () => creditos.filter((c, k, arr) => usadas.has(c.arq) && arr.findIndex((x) => x.arq === c.arq) === k);
const rodape = (pg) => {
  const ini = pg === 'inicio' ? '' : 'index.html';
  return `<footer class="rodape" id="visite">
  <div class="largo">
    <div class="rod-topo">
      <div class="rod-marca-txt">
        <a class="logo" href="index.html" aria-label="${M.completo}, início">${I.logo}</a>
        <p>Salão de beleza feito de conversa, técnica e cuidado, para cada cliente, em cada visita.</p>
        ${btn('contato.html', 'Fale com a Mecha', { cls: 'btn-claro' })}
      </div>
      <div class="rod-cols">
        <div><h3>Navegue</h3><ul>${[['index.html', 'Início'], [`${ini}#servicos`, 'Serviços'], [`${ini}#porque`, 'Por que a Mecha'], [`${ini}#avaliacoes`, 'Avaliações'], [`${ini}#galeria`, 'Galeria'], [`${ini}#agendar`, 'Agendar']].map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
        <div><h3>Páginas</h3><ul>${[['servicos.html', 'Serviços e preços'], ['sobre.html', 'Sobre e equipe'], ['contato.html', 'Contato'], ['404.html', 'Página 404']].map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
        <div><h3>Atendimento</h3><ul>
          <li><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">${I.whats}${M.whatsapp}</a></li>
          <li><a href="tel:${tel}">${I.telefone}${M.telefone}</a></li>
          <li><a href="mailto:${M.email}">${I.carta}${M.email}</a></li>
          <li class="redes"><a href="${instaUrl}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a><a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a><a href="${M.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${I.tiktok}</a></li>
        </ul></div>
      </div>
    </div>
    <div class="mapa-linha">
      <div class="map-box">
        <img src="assets/img/mapa_vila-madalena.webp" alt="Mapa da ${M.bairro}, ${M.cidade}, com a localização do ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${endereco}, CEP ${M.cep}</span><span>${P.horarioCurto(C.horario)}</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Só no salão, com hora marcada. Noivas também no local da festa. Clientes destes bairros chegam a pé ou em poucos minutos.</p>
        <ul class="bairros">${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
        <table class="horas"><caption>Horário de funcionamento</caption><tbody>${P.horasLinhas(C.horario)}</tbody></table>
      </div>
    </div>
    <div class="legal">
      <p><b>${M.razao}</b> (${M.casa}), CNPJ ${M.cnpj}. ${endereco}, CEP ${M.cep}. Telefone ${M.telefone}. WhatsApp ${M.whatsapp}. ${M.email}.</p>
      <p>Material esterilizado em autoclave ou descartável. Produtos com registro ou notificação na Anvisa.</p>
      <div class="legal-links"><button type="button" class="link" data-doc="servico">Termos de prestação de serviço</button><button type="button" class="link" data-doc="uso">Termos de uso</button><button type="button" class="link" data-doc="privacidade">Política de privacidade</button><button type="button" class="link" data-cookies>Preferências de cookies</button></div>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditosUsados().map((c) => `<li>${esc(c.arq)}: ${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.autor)}, ${esc(c.fonte)}</a>` : esc(c.autor)}</li>`).join('')}</ul></details>
    </div>
  </div>
  <p class="rod-gigante" aria-hidden="true">${I.simbolo()}<span>${M.nome.toUpperCase()}</span></p>
  <div class="rod-fim"><div class="largo"><p>© ${new Date().getFullYear()} ${M.completo}. Todos os direitos reservados.</p><p>Modelo de site com marca, pessoas, preços e avaliações fictícios.</p></div></div>
</footer>
<a class="whats-flutua" href="${wa(`Olá! Vim pelo site do ${M.completo} e quero agendar um horário.`)}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp" data-magnetic>${I.whats}<span>WhatsApp</span></a>`;
};

// ---------- janelas legais, cookies, aviso ----------
const legal = {
  servico: ['Termos de prestação de serviço', `
    <h3>Agendamento e confirmação</h3><p>O horário só está garantido depois da confirmação do ${M.completo} pelo WhatsApp, telefone ou e-mail. Sem hora marcada, o atendimento depende de cadeira livre.</p>
    <h3>Valores e pagamento</h3><p>Os preços do site são de referência. Serviços com valor "a partir de" dependem do comprimento e do volume do cabelo, e o valor é fechado no diagnóstico, antes de começar. Nenhum valor é alterado sem o seu aceite. ${esc(C.pagamento)}</p>
    <h3>Atraso, cancelamento e remarcação</h3><p>Tolerância de 15 minutos. Cancelamento e remarcação sem custo até 24 horas antes. Serviços acima de R$ 300 pedem sinal de 30% via Pix, que vira crédito para nova data em até 60 dias quando o aviso vem com menos de 24 horas.</p>
    <h3>Coloração, química e henna</h3><p>Teste de mecha e de sensibilidade obrigatório, 48 horas antes para quem nunca fez o serviço aqui. A profissional pode recusar ou adiar o serviço quando o fio, a pele ou o couro cabeludo não estiverem em condições, explicando o motivo.</p>
    <h3>Garantia</h3><p>Ajuste sem custo nos prazos de cada serviço, com a mesma profissional, quando algo não ficou como combinado. A garantia não cobre mudança de ideia sobre o resultado combinado nem processos feitos fora do salão.</p>
    <h3>Noivas e eventos</h3><p>Prova obrigatória até uma semana antes. Atendimento fora do salão tem taxa de deslocamento combinada no orçamento.</p>
    <h3>Higiene</h3><p>Material esterilizado em autoclave ou descartável e produtos com registro ou notificação na Anvisa. Texto a validar na revisão jurídica antes da publicação.</p>`],
  uso: ['Termos de uso', `
    <p>Este site apresenta os serviços do ${M.completo} (${M.razao}, CNPJ ${M.cnpj}) e recebe pedidos de agendamento e contato. Ao usar o site, você concorda com estes termos.</p>
    <h3>Conteúdo</h3><p>Textos, marcas e imagens pertencem à ${M.nome} ou a seus autores, conforme os créditos. Fotos de clientes só são publicadas com autorização por escrito.</p>
    <h3>Pedidos de agendamento</h3><p>O formulário envia o pedido pelo WhatsApp. Os horários mostrados seguem a agenda de cada profissional, mas o horário só vale depois da nossa confirmação.</p>
    <h3>Links externos</h3><p>Mapas, redes sociais, Instagram e WhatsApp abrem serviços de terceiros, com políticas próprias.</p>`],
  privacidade: ['Política de privacidade', `
    <p>A ${M.razao} (CNPJ ${M.cnpj}) trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
    <h3>Dados que coletamos</h3><p>Nome, telefone, e-mail, serviço, profissional, dia, horário e observações que você escreve nos formulários de agendamento e de contato. Alergias e informações de saúde são dados sensíveis e só são usadas para a sua segurança no atendimento.</p>
    <h3>Para que usamos</h3><p>Responder ao pedido, confirmar e lembrar o horário e registrar o serviço feito, como a fórmula da cor. Novidades e promoções só com o seu consentimento, que pode ser retirado a qualquer momento.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins de publicidade. O pedido trafega pelo WhatsApp (Meta) e os pagamentos pelo processador do cartão ou do Pix.</p>
    <h3>Por quanto tempo</h3><p>Pedidos sem atendimento são apagados em 6 meses. Fichas de cliente ficam enquanto houver relação com o salão e pelo prazo legal depois dela.</p>
    <h3>Seus direitos</h3><p>Confirmar, acessar, corrigir, apagar ou levar seus dados, e revogar consentimentos, pelo e-mail ${M.email}.</p>
    <h3>Cookies e armazenamento</h3><p>O site guarda no seu navegador apenas a sua escolha sobre cookies, o tema claro ou escuro e se a abertura já foi vista nesta visita. Não usamos cookies de publicidade. Medição de visitas só com a sua permissão no aviso de cookies.</p>`],
};
const dialogs = `${Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-cab"><h2 id="doc-${id}-t">${t}</h2><button type="button" class="doc-fecha" data-fecha aria-label="Fechar">${I.fechar}</button></div>
  <div class="doc-corpo">${corpo}<p class="doc-data">Atualizado em novembro de 2026.</p></div>
</dialog>`).join('\n')}
<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Usamos só o armazenamento necessário para o site funcionar. Medição de visitas, apenas se você permitir. <button type="button" class="link" data-doc="privacidade">Saiba mais</button>.</p>
  <div class="cookies-btns" data-iguais><button type="button" class="btn btn-acento" data-ck="todos"><span class="btn-txt" data-t="Aceitar todos"><span>Aceitar todos</span></span></button><button type="button" class="btn btn-linha" data-ck="essenciais"><span class="btn-txt" data-t="Só os essenciais"><span>Só os essenciais</span></span></button></div>
</div>
<div class="toast" data-toast role="status" aria-live="polite"></div>`;

// ---------- cabeçalho das páginas internas ----------
const pgCab = ({ ap, titulo, texto, acoes, fotos }) => `<section class="pg-cab">
  <div class="largo pg-cab-in">
    <div>${apoio(ap)}${tituloSec(titulo, 'h1')}<p class="pg-cab-txt">${texto}</p><div class="pg-cab-btns" data-iguais>${acoes}</div></div>
    <div class="pg-cab-fotos" aria-hidden="true">${fotos.map((f, k) => `<span style="--k:${k}">${foto(f, { alt: '', lazy: false })}</span>`).join('')}</div>
  </div>
  <a class="capa-desce" href="#conteudo-pg" aria-label="Descer para o conteúdo"><span>Role</span><i></i></a>
</section>`;

// ---------- página de serviços ----------
const pgServicos = `${pgCab({ ap: 'O que fazemos', titulo: 'Serviços', texto: 'Cada serviço é uma experiência pensada para você: o que inclui, quanto tempo leva e quanto custa, antes de você sentar na cadeira.', acoes: `${btn('#lista', 'Ver os preços', { cls: 'btn-acento', ic: I.desce })}${btn('sobre.html#equipe', 'Nossa equipe', { cls: 'btn-linha' })}`, fotos: ['ondas-loiras', 'cachos-secador', 'noiva-ondas'] })}
<section class="pg-servicos" id="conteudo-pg">
  <div class="largo" id="lista">
    <div class="filtros filtros-seg" role="group" aria-label="Filtrar serviços por segmento" data-iguais>
      <button type="button" data-seg-filtro="todos" aria-pressed="true">Todos</button>
      ${C.segmentos.map((g) => `<button type="button" data-seg-filtro="${g.id}" aria-pressed="false">${esc(g.curto)}</button>`).join('\n      ')}
    </div>
    ${C.segmentos.map((g, k) => `<article class="seg-bloco${k % 2 ? ' inverte' : ''}" id="seg-${g.id}" data-seg="${g.id}">
      ${mascara(g.foto, { cls: 'seg-foto' })}
      <div class="seg-txt">
        ${apoio(g.apoio)}
        <h2>${esc(g.nome)}</h2>
        <p>${esc(g.texto)}</p>
        ${etapas(g)}
        <ul class="sv-lista">
          ${servicosDo(g.id).map(svItem).join('\n          ')}
        </ul>
      </div>
    </article>`).join('\n    ')}
    <dl class="condicoes">
      <div><dt>Pagamento</dt><dd>${esc(C.pagamento)}</dd></div>
      <div><dt>Valores "a partir de"</dt><dd>${esc(C.aPartir)}</dd></div>
      <div><dt>Cancelamento e remarcação</dt><dd>Sem custo até 24 horas antes. <a href="index.html#politicas">Ver todas as políticas</a></dd></div>
    </dl>
  </div>
</section>`;

// ---------- página sobre e equipe ----------
const pgSobre = `${pgCab({ ap: 'Quem somos', titulo: 'Sobre', texto: `A Mecha nasceu em ${M.desde} para quem leva o cabelo a sério e quer ser escutada antes da primeira tesourada.`, acoes: `${btn('servicos.html', 'Ver serviços')}${btn('contato.html', 'Contato', { cls: 'btn-linha' })}`, fotos: ['equipe-risos', 'recepcao-tablet', 'risada-cadeira'] })}
<section class="historia" id="conteudo-pg">
  <div class="largo hist-in">
    ${mascara('salao-claro', { cls: 'hist-foto' })}
    <div class="hist-txt">
      ${apoio('Nossa história')}
      ${tituloSec('Um salão de bairro que conhece cada cliente pelo nome')}
      <p>Desde ${M.desde} na ${M.bairro}, a Mecha junta cabeleireira, colorista, trancista, especialista em noivas, manicure e designer de sobrancelha no mesmo endereço. Cada uma tem a própria agenda, então você escolhe com quem quer ser atendida.</p>
      <p>O jeito é o mesmo desde o primeiro dia: conversa no espelho, teste antes de qualquer química e o valor fechado antes de começar.</p>
    </div>
  </div>
  <div class="largo numeros">
    ${C.numeros.map(([v, suf, t]) => `<p><b><span data-conta="${v}">${v}</span>${suf}</b><span>${esc(t)}</span></p>`).join('\n    ')}
  </div>
</section>
<section class="equipe" id="equipe">
  <div class="largo">
    ${cabSec({ ap: 'As profissionais', titulo: 'Nossa equipe', texto: 'Conheça quem vai cuidar de você, o que cada uma faz melhor e os dias em que atende.' })}
    <div class="membros">
      ${C.equipe.map((m, k) => `<article class="membro${k % 2 ? ' inverte' : ''}" id="p-${m.id}">
        ${mascara(m.foto, { cls: 'membro-foto' })}
        <div class="membro-txt">
          <p class="apoio">[ ${esc(m.cargo)} ]</p>
          <h3>${esc(m.nome)}</h3>
          <p class="membro-bio">${esc(m.bio)}</p>
          <dl class="membro-dados"><div><dt>Especialidade</dt><dd>${esc(m.esp)}</dd></div><div><dt>Na profissão</dt><dd>${m.anos} anos</dd></div><div><dt>Atende</dt><dd>${esc(m.faz.map((s) => SEG[s].curto).join(', '))}</dd></div></dl>
          ${P.agenda(m, { horario: C.horario })}
          ${btn(`index.html?prof=${m.id}#agendar`, `Agendar com ${P.primeiro(m.nome)}`, { ic: I.calendario })}
        </div>
      </article>`).join('\n      ')}
    </div>
    <div class="equipe-pe">
      <div><h3>Responsável técnica</h3><p>${esc(C.equipe[0].nome)}, colorista, responde pelos produtos químicos da casa: confere o registro na Anvisa, a validade e a ficha de cada cliente antes de qualquer cor, alinhamento ou henna.</p></div>
      <div><h3>Trabalhe com a gente</h3><p>Procuramos profissionais que gostem de conversar antes de começar. Mande seu portfólio para <a href="mailto:${M.email}?subject=Trabalhe%20conosco">${M.email}</a>.</p></div>
    </div>
  </div>
</section>`;

// ---------- página de contato ----------
const pgContato = `${pgCab({ ap: 'Fale com a gente', titulo: 'Contato', texto: 'Para agendar, tirar dúvidas, pedir orçamento de noiva ou falar de parceria. A recepção responde em até uma hora, no horário de funcionamento.', acoes: `${btn('#mensagem', 'Mandar mensagem', { ic: I.desce })}${btn('sobre.html#equipe', 'Nossa equipe', { cls: 'btn-linha' })}`, fotos: ['secando-liso', 'espelho-escova', 'difusor-sorriso'] })}
<section class="contato" id="conteudo-pg">
  <div class="largo contato-in">
    <div class="contato-info">
      <article class="ct ct-horas"><h2>Horário</h2><table class="horas"><caption class="vh">Horário de funcionamento</caption><tbody>${P.horasLinhas(C.horario)}</tbody></table></article>
      <article class="ct"><h2>Endereço</h2><p>${M.endereco}<br>${M.bairro}, ${M.cidade}, ${M.uf}<br>CEP ${M.cep}</p><p class="ct-nota">${M.referencia}. ${M.estacionamento}.</p>${btn(rotaUrl, 'Como chegar', { cls: 'btn-linha btn-p', attrs: ' target="_blank" rel="noopener"', ic: I.pino })}</article>
      <article class="ct"><h2>Canais</h2><ul class="canais">
        <li><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">${I.whats}<span><small>WhatsApp</small>${M.whatsapp}</span></a></li>
        <li><a href="tel:${tel}">${I.telefone}<span><small>Telefone</small>${M.telefone}</span></a></li>
        <li><a href="mailto:${M.email}">${I.carta}<span><small>E-mail</small>${M.email}</span></a></li>
        <li><a href="${instaUrl}" target="_blank" rel="noopener">${I.insta}<span><small>Instagram</small>@${C.instagram.usuario}</span></a></li>
      </ul></article>
    </div>
    <form class="form form-contato" id="mensagem" novalidate>
      <h2>Mande uma mensagem</h2>
      <p class="form-intro">Campos com * são obrigatórios. A resposta chega pelo canal que você preferir.</p>
      <div class="campos">
        <label class="campo"><span>Nome *</span><input name="nome" autocomplete="name" required></label>
        <label class="campo"><span>Telefone ou WhatsApp *</span><input name="tel" type="tel" autocomplete="tel" inputmode="tel" required></label>
        <label class="campo larga"><span>E-mail</span><input name="email" type="email" autocomplete="email"></label>
        <label class="campo larga"><span>Assunto *</span><select name="assunto" required><option value="">Escolha o assunto</option><option>Agendamento</option><option>Orçamento de noiva ou evento</option><option>Dúvida sobre um serviço</option><option>Elogio ou reclamação</option><option>Parcerias e trabalhe conosco</option></select></label>
        <label class="campo larga"><span>Mensagem *</span><textarea name="msg" rows="5" required></textarea></label>
      </div>
      <fieldset class="prefere"><legend>Prefere a resposta por</legend><div class="prefere-ops" data-iguais><label><input type="radio" name="canal" value="WhatsApp" checked><span>WhatsApp</span></label><label><input type="radio" name="canal" value="E-mail"><span>E-mail</span></label><label><input type="radio" name="canal" value="Telefone"><span>Telefone</span></label></div></fieldset>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Li a <button type="button" class="link" data-doc="privacidade">Política de Privacidade</button> e autorizo o uso destes dados só para responder a esta mensagem. *</span></label>
      <p class="form-erro" role="alert" hidden></p>
      <button class="btn btn-acento btn-largo" type="submit" data-magnetic><span class="btn-txt" data-t="Enviar mensagem"><span>Enviar mensagem</span></span>${I.seta}</button>
      <div class="form-ok" role="status" hidden></div>
    </form>
  </div>
</section>`;

// ---------- montagem das páginas ----------
const precos = C.servicos.map((s) => s.preco);
const ld = {
  '@context': 'https://schema.org', '@type': 'HairSalon', name: M.completo, url: M.dominio,
  image: `${M.dominio}/assets/img/${C.capaFotos[0]}.webp`, telephone: M.telefone, email: M.email, priceRange: `R$ ${Math.min(...precos)} a R$ ${Math.max(...precos)}`,
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: -23.5564, longitude: -46.6893 },
  openingHoursSpecification: C.horario.map((d, i) => [d, i]).filter(([d]) => d.aberto).map(([d, i]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i], opens: d.abre, closes: d.fecha })),
  aggregateRating: { '@type': 'AggregateRating', ratingValue: M.nota, reviewCount: M.avaliacoes },
  sameAs: [instaUrl, M.facebook, M.tiktok],
};
// dados que o navegador usa no agendamento
const dados = {
  nome: M.completo,
  whatsapp: M.whatsapp,
  horario: C.horario,
  servicos: C.servicos,
  equipe: C.equipe.map(({ id, nome, cargo, foto: f, faz, dias }) => ({ id, nome, cargo, foto: f, faz, dias })),
  abertura: C.abertura,
  simbolo: I.simbolo(),
};
// carregando só na primeira página da visita; cortina de chegada quando se vem de outra página do site
const headIntro = '<script>try{var h=document.documentElement,r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(!r&&!sessionStorage.getItem("mecha-vinho-intro"))h.classList.add("intro");if(!r&&sessionStorage.getItem("mecha-vinho-nav")){h.classList.add("chegando");sessionStorage.removeItem("mecha-vinho-nav")}}catch(e){}</script>';

const pagina = ({ arquivo, pg, titulo: t, descricao, corpo, comLd = false }) => {
  const html = `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${M.dominio}/${arquivo === 'index.html' ? '' : arquivo}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(descricao)}"><meta property="og:image" content="${M.dominio}/assets/img/${C.capaFotos[0]}.webp"><meta property="og:locale" content="pt_BR">
<meta name="theme-color" content="${COR_CLARO}">
${T.head(CHAVE_TEMA)}
${headIntro}
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${fontes}
<link rel="stylesheet" href="assets/site.css">
${comLd ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ''}
</head>
<body class="pg-${pg}${pg === 'inicio' ? '' : ' pg-interna'}">
${abertura}
${cortina}
${cursor}
${topo(pg)}
<main id="conteudo">
${corpo}
</main>
${rodape(pg)}
${T.pilula('tema-lado', 'claro')}
${dialogs}
<script type="application/json" id="dados">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>
<script src="assets/partes.js" defer></script>
<script src="assets/site.js" defer></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, arquivo), html);
};

const corpoInicio = [capa, manifesto, solucoes, servicos, porque, cinema, avaliacoes, processo, tendencias, galeria, instagram, duvidas, politicas, agendar].join('\n');
pagina({ arquivo: 'index.html', pg: 'inicio', titulo: `${M.completo} | Salão de beleza na ${M.bairro}, ${M.cidade}`, descricao: `Salão de beleza com hora marcada na ${M.bairro}: corte, escova, cor e mechas, cachos e tranças, tratamentos, penteados e noivas, unhas e sobrancelha. Preço fechado antes de começar.`, corpo: corpoInicio, comLd: true });
pagina({ arquivo: 'servicos.html', pg: 'servicos', titulo: `Serviços e preços | ${M.completo}, ${M.bairro}`, descricao: `Todos os serviços do ${M.completo} com o que inclui, duração e preço: corte, cor, cachos e tranças, tratamentos, penteados e noivas, unhas e sobrancelha.`, corpo: pgServicos });
pagina({ arquivo: 'sobre.html', pg: 'sobre', titulo: `Sobre e equipe | ${M.completo}, ${M.bairro}`, descricao: `A história do ${M.completo} e a equipe: colorista, cabeleireira, trancista, especialista em noivas, manicure e designer de sobrancelha, com a agenda de cada uma.`, corpo: pgSobre });
pagina({ arquivo: 'contato.html', pg: 'contato', titulo: `Contato | ${M.completo}, ${M.bairro}`, descricao: `Horário, endereço, WhatsApp, telefone e formulário de contato do ${M.completo} na ${M.bairro}, ${M.cidade}.`, corpo: pgContato });

// ---------- 404: arquivo único com o CSS dentro, funciona em qualquer endereço ----------
// O zero do "404" é um elástico de cabelo (xuxinha) franzido, e uma mecha solta cai de dentro dele.
const xuxinha = `<svg class="xuxinha" viewBox="0 0 120 120" aria-hidden="true"><path d="${(() => {
  const pts = []; const n = 22;
  for (let k = 0; k <= n * 8; k++) { const a = (k / (n * 8)) * Math.PI * 2; const r = 44 + Math.sin(a * n) * 5; pts.push(`${(60 + Math.cos(a) * r).toFixed(1)} ${(60 + Math.sin(a) * r).toFixed(1)}`); }
  return `M${pts.join(' L')}Z`;
})()}" fill="none" stroke="var(--acento)" stroke-width="13" stroke-linejoin="round"/><path class="fio" d="M60 80c-6 12 10 18 2 30" fill="none" stroke="var(--tinta)" stroke-width="3" stroke-linecap="round"/></svg>`;
const css404 = `:root{--fundo:#F5EEE6;--papel:#FBF8F4;--tinta:#4A1512;--texto:#6B5751;--acento:#A8231C;--linha:rgba(74,21,18,.14);color-scheme:light}
[data-tema="escuro"]{--fundo:#170D0B;--papel:#21130F;--tinta:#F4E7DE;--texto:#C7B4AA;--acento:#D04A3C;--linha:rgba(244,231,222,.14);color-scheme:dark}
*{box-sizing:border-box;margin:0}
body{min-height:100vh;display:grid;place-items:center;padding:32px 16px;background:var(--fundo);color:var(--texto);font:400 17px/1.6 "Familjen Grotesk",Georgia,serif;text-align:center}
.c404{width:min(680px,100%);display:grid;justify-items:center;gap:18px}
.logo{display:inline-flex;align-items:center;gap:10px;color:var(--tinta);text-decoration:none;font:800 26px "Schibsted Grotesk",Georgia,serif;letter-spacing:-.04em}
.logo svg{width:34px;height:34px}
.num{display:flex;align-items:center;gap:6px;font:900 clamp(110px,26vw,220px)/1 "Schibsted Grotesk",Georgia,serif;letter-spacing:-.06em;color:var(--tinta)}
.xuxinha{width:.82em;height:.82em;animation:gira 14s linear infinite}
.fio{animation:balanca 3s ease-in-out infinite;transform-origin:60px 80px}
@keyframes gira{to{transform:rotate(360deg)}}
@keyframes balanca{50%{transform:rotate(14deg)}}
.apoio{color:var(--acento);font:600 13px "Familjen Grotesk",sans-serif;letter-spacing:.12em;text-transform:uppercase}
h1{font:800 clamp(30px,5vw,46px)/1.05 "Schibsted Grotesk",Georgia,serif;letter-spacing:-.035em;color:var(--tinta);text-transform:uppercase}
.acoes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;width:min(460px,100%);margin-top:8px}
.acoes a{display:flex;align-items:center;justify-content:center;min-height:52px;padding:0 18px;text-decoration:none;font:600 16px "Familjen Grotesk",sans-serif;background:var(--acento);color:#fff;transition:transform .3s,background .3s}
.acoes a+a{background:transparent;color:var(--tinta);box-shadow:inset 0 0 0 1.5px var(--tinta)}
.acoes a:hover{transform:translateY(-3px)}
.atalhos{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 18px;font-size:15px}
.atalhos a{color:var(--tinta)}
@media (max-width:420px){.acoes{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.xuxinha,.fio{animation:none}}`;
const html404 = `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página não encontrada | ${M.completo}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(I.favicon.replace('fill="#1F1B18"', `fill="${COR_CLARO}"`).replace('stroke="#C9A27F"', 'stroke="#E8B4A4"'))}">
${T.head(CHAVE_TEMA)}
${fontes}
<style>${css404}</style>
</head>
<body>
<main class="c404">
  <a class="logo" href="/">${I.simbolo()}${M.nome}</a>
  <p class="num" aria-label="404"><span>4</span>${xuxinha}<span>4</span></p>
  <p class="apoio">Erro 404</p>
  <h1>Essa mecha se soltou</h1>
  <p>O endereço que você abriu não existe ou mudou de lugar. Volte ao início ou siga por um dos atalhos.</p>
  <div class="acoes"><a href="/">Voltar ao início</a><a href="${wa(`Olá, ${M.completo}! Cheguei numa página que não existe no site.`)}" target="_blank" rel="noopener">WhatsApp</a></div>
  <p class="atalhos"><a href="/servicos.html">Serviços</a><a href="/sobre.html">Sobre e equipe</a><a href="/contato.html">Contato</a><a href="/#agendar">Agendar</a></p>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, '404.html'), html404);

// ---------- arquivos de apoio ----------
for (const [nome, arq] of usadas) fs.copyFileSync(arq, path.join(OUT, 'assets', 'img', `${nome}.webp`));
fs.copyFileSync(path.join(IMG_PREMIUM, 'mapa_vila-madalena.webp'), path.join(OUT, 'assets', 'img', 'mapa_vila-madalena.webp'));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon.replace('fill="#1F1B18"', `fill="${COR_CLARO}"`).replace('stroke="#C9A27F"', 'stroke="#E8B4A4"'));
fs.writeFileSync(path.join(OUT, 'assets', 'site.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
fs.writeFileSync(path.join(OUT, 'assets', 'site.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + T.js(CHAVE_TEMA, COR_CLARO, COR_ESCURO));
fs.copyFileSync(path.join(__dirname, '..', '_build-mecha-standard-terracota', 'partes.js'), path.join(OUT, 'assets', 'partes.js'));
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${M.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['', 'servicos.html', 'sobre.html', 'contato.html'].map((u) => `<url><loc>${M.dominio}/${u}</loc></url>`).join('')}</urlset>\n`);
console.log(`ok: ${OUT} (${usadas.size} fotos)`);
