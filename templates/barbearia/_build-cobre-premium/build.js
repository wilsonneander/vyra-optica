// Gera o Cobre Premium (barbearia, marca fictícia Cobre Barbearia) em "templates/barbearia/premium/cobre-premium/".
// Referência de desenho: https://taper-barbers.framer.website/ (Framer): creme e tinta, títulos condensados com uma palavra
// em letra cursiva, rótulos em fonte mono, letreiro de cadeiras livres, cardápio com foto ao lado, a linha do tempo de um corte,
// guia do degradê, cupom de avaliações e clube. As cores de destaque são as da Cobre (cobre no lugar do vermelho da referência).
// Mesma empresa do Cobre Standard: conteúdo, fotos e ícones vêm de ../_build-cobre-standard/.
// Páginas: index.html, equipe.html e 404.html.
// Uso: node templates/barbearia/_build-cobre-premium/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const T = require('../../_comum/tema-pilula');
const CHAVE_TEMA = 'cobre-premium-tema';

const OUT = path.join(__dirname, '..', 'premium', 'cobre-premium');
const STD = path.join(__dirname, '..', '_build-cobre-standard');
const FOTOS = path.join(STD, 'img', 'fotos');
const M = C.marca;

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const semMarca = (t) => String(t).replace(/\s*\[(EXEMPLO|JURÍDICO)\]/g, '');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/?mlat=${M.lat}&mlon=${M.lon}#map=17/${M.lat}/${M.lon}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
const reais = (v) => `R$ ${v.toLocaleString('pt-BR')}`;
const minutos = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
const hora = (h) => `${Math.floor(h)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;
const tel = M.telefone.replace(/\D/g, '');
const DIAS_C = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const estrelas = `<span class="estrelas" aria-hidden="true">${I.estrela.repeat(5)}</span>`;
const nota = String(M.nota).replace('.', ',');
const avaliacoes = M.avaliacoes.toLocaleString('pt-BR');

// ---------- fotos: confere se existe e guarda as usadas para copiar e creditar ----------
const creditos = JSON.parse(fs.readFileSync(path.join(STD, 'img', 'creditos.json'), 'utf8'));
const dims = Object.fromEntries(creditos.map((c) => [c.arq, [c.w, c.h]]));
const usadas = new Set();
const foto = (nome, { alt, lazy = true, cls = '' } = {}) => {
  if (!fs.existsSync(path.join(FOTOS, `${nome}.webp`))) throw new Error(`foto faltando: ${nome}`);
  usadas.add(nome);
  const [w, h] = dims[nome] || [1400, 934];
  const a = alt ?? C.fotos[nome] ?? '';
  return `<img src="assets/img/${nome}.webp" alt="${esc(a)}" width="${w}" height="${h}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}${cls ? ` class="${cls}"` : ''}>`;
};

// ---------- peças de texto ----------
// título: palavras que sobem uma a uma, com o complemento em letra cursiva (como na referência)
const palavras = (t) => t.split(' ').map((p, i) => `<span class="pal" style="--w:${i}"><span>${p}</span></span>`).join(' ');
const titulo = (tag, forte, cursiva, attrs = '') => `<${tag} class="palavras"${attrs}>${palavras(forte)}${cursiva ? ` <em class="cursiva">${cursiva}</em>` : ''}</${tag}>`;
// rótulo da seção em fonte mono: nome entre parênteses e uma linha de apoio
const rotulo = (nome, apoio) => `<p class="rotulo"><span>(${nome})</span>${apoio ? `<span>${apoio}</span>` : ''}</p>`;
// botão premium: fundo que cresce do ponto onde o mouse entra e texto que troca rolando
const btn = (href, texto, { cls = 'btn-cobre', icone = '', attrs = '', cursor = '' } = {}) => {
  const tag = href ? 'a' : 'button';
  const alvo = href ? ` href="${href}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''}` : ' type="button"';
  return `<${tag} class="btn ${cls}"${alvo} data-magnetic${cursor ? ` data-cursor="${cursor}"` : ''}${attrs ? ` ${attrs}` : ''}><span class="btn-fundo" aria-hidden="true"></span>${icone}<span class="btn-txt" data-t="${esc(texto)}"><span>${esc(texto)}</span></span></${tag}>`;
};

const servPorId = Object.fromEntries([...C.servicos, ...C.pacotes.map((p) => ({ ...p, seg: 'pacotes', inclui: p.inclui.join(', ') }))].map((s) => [s.id, s]));
const precoTxt = (s) => `${s.de ? 'a partir de ' : ''}${reais(s.preco)}`;

// ---------- topo (igual nas duas páginas; "base" é o prefixo das âncoras) ----------
const navItens = [['servicos', 'Serviços'], ['um-corte', 'O corte'], ['equipe.html', 'Equipe'], ['clube', 'Clube'], ['galeria', 'Galeria'], ['duvidas', 'Dúvidas']];
const href = (id, base) => (id.endsWith('.html') ? id : `${base}#${id}`);
const redes = () => `<div class="redes">
      <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram" data-magnetic>${I.insta}</a>
      <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook" data-magnetic>${I.face}</a>
      <a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener" aria-label="WhatsApp" data-magnetic>${I.whats}</a>
    </div>`;
const topo = (base, atual) => `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo">
  <div class="largo topo-in">
    <a class="logo" href="${base || '#inicio'}" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="menu" aria-label="Principal">${navItens.map(([id, t]) => `<a href="${href(id, base)}"${atual === id ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
    <div class="topo-dir">
      <p class="aberto" data-aberto><span>Curitiba</span></p>
      ${btn(`${base}#agendar`, 'Agendar', { cls: 'btn-cobre btn-p topo-cta', cursor: 'Agendar' })}
      <button class="menu-btn" type="button" aria-controls="gaveta" aria-expanded="false" aria-label="Abrir o menu">${I.menu}</button>
    </div>
  </div>
</header>
<div class="gaveta" id="gaveta" hidden>
  <div class="gaveta-fundo" data-fecha-gaveta></div>
  <aside class="gaveta-caixa" aria-label="Menu">
    <div class="gaveta-cab"><span class="logo">${I.logo}</span><button type="button" class="fecha" data-fecha-gaveta aria-label="Fechar o menu">${I.fechar}</button></div>
    <nav class="gaveta-nav" aria-label="Menu do celular">${[['inicio', 'Início'], ...navItens, ['agendar', 'Agendar horário'], ['contato', 'Contato']].map(([id, t]) => `<a href="${href(id, base)}">${t}</a>`).join('')}</nav>
    <dl class="gaveta-info">
      <div><dt>Endereço</dt><dd>${M.endereco}, ${M.bairro}</dd></div>
      <div><dt>WhatsApp</dt><dd><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">${M.whatsappTexto}</a></dd></div>
    </dl>
    ${T.pilula('deitada', 'claro')}
    ${redes()}
  </aside>
</div>`;

// ---------- capa: carrossel emoldurado, letreiro de cadeiras livres ----------
const capa = `<section class="capa" id="inicio">
  <div class="capa-moldura" data-capa>
    <div class="capa-slides" data-carrossel role="region" aria-roledescription="carrossel" aria-label="Fotos da casa" data-cursor="Arrastar">
      ${C.capaSlides.map((sl, i) => `<figure class="capa-slide${i === 0 ? ' ativo' : ''}" style="--pos:${sl.pos}" role="group" aria-roledescription="slide" aria-label="${sl.rotulo}">${foto(sl.foto, { lazy: i > 0 ? true : false })}</figure>`).join('\n      ')}
    </div>
    <div class="capa-veu" aria-hidden="true"></div>
    <div class="capa-in">
      <div class="capa-cantos">
        <p><span class="capa-cobre">(Barbearia desde ${M.desde})</span><span>${M.endereco}, ${M.bairro}</span></p>
        <p class="capa-agora"><span class="capa-cobre">${M.cidade}, agora</span><span data-relogio>${M.cidade}</span></p>
      </div>
      <div class="capa-meio">
        <p class="capa-lead">Degradê, corte na tesoura e barba com toalha quente, feitos por quatro barbeiros que não têm pressa. Agende em menos de um minuto ou chegue sem horário.</p>
        <div class="capa-btns">${btn('#agendar', 'Agendar horário', { cursor: 'Agendar' })}${btn('#servicos', 'Ver os preços', { cls: 'btn-vidro' })}</div>
      </div>
      <h1 class="capa-tit"><span class="capa-tit-forte">Afiado</span> <em class="cursiva">sem pressa</em></h1>
      <div class="capa-base">
        <a class="capa-nota" href="#depoimentos">
          <span class="capa-rostos" aria-hidden="true">${C.equipe.map((b) => foto(b.foto, { alt: '' })).join('')}</span>
          <span><b>${nota}</b>${I.estrela}<small>${avaliacoes} avaliações no Google</small></span>
        </a>
        <div class="capa-ctrl" role="group" aria-label="Trocar a foto">
          <button type="button" class="capa-seta" data-capa-ir="-1" aria-label="Foto anterior" data-magnetic>${I.setaEsq}</button>
          <ol class="capa-pontos">${C.capaSlides.map((sl, i) => `<li><button type="button" data-capa-slide="${i}" aria-pressed="${i === 0}"><span>${sl.rotulo}</span><i aria-hidden="true"></i></button></li>`).join('')}</ol>
          <button type="button" class="capa-seta" data-capa-ir="1" aria-label="Próxima foto" data-magnetic>${I.setaDir}</button>
        </div>
        <div class="letreiro" data-letreiro>
          <span class="letreiro-luzes" aria-hidden="true">${C.equipe.map(() => '<i></i>').join('')}</span>
          <span class="letreiro-txt" data-flap aria-live="polite">Cadeiras livres</span>
          ${btn('#agendar', 'Agendar', { cls: 'btn-tinta btn-p', cursor: 'Agendar' })}
        </div>
      </div>
    </div>
  </div>
</section>
<div class="faixas" aria-hidden="true">
  ${['a', 'b'].map((f) => `<div class="faixa faixa-${f}"><div class="faixa-trilho">${[0, 1].map(() => `<span>${C.faixa.map(([forte, cur]) => `<b>${forte}</b><em class="cursiva">${cur}</em>${I.simbolo}`).join('')}</span>`).join('')}</div></div>`).join('\n  ')}
</div>`;

// ---------- a casa: manifesto que acende com a rolagem, contadores e o poste ----------
const manifesto = `A Cobre é uma barbearia de bairro com uma regra só: ninguém sai da cadeira com o corte pela metade. Sem pressa no degradê, sem pular o contorno, sem o famoso "tá bom assim". Quatro barbeiros, um café coado, uma playlist que a gente leva a sério e a mesma cadeira esperando você a cada três semanas.`;
const casa = `<section class="casa" id="sobre">
  <div class="largo casa-grade">
    <div class="casa-txt">
      ${rotulo('A casa', `Desde ${M.desde}, quatro cadeiras no ${M.bairro}`)}
      <p class="casa-manifesto" data-acende>${manifesto.split(' ').map((p) => `<span>${esc(p)}</span>`).join(' ')}</p>
      <dl class="casa-numeros">
        <div class="cena"><dt>para um degradê, do começo ao fim</dt><dd><span data-conta="45">45</span><small>min</small></dd></div>
        <div class="cena"><dt>em ${avaliacoes} avaliações no Google</dt><dd><span data-conta="${M.nota}" data-dec="1">${nota}</span><small>nota</small></dd></div>
        <div class="cena"><dt>cortes desde que a casa abriu</dt><dd><span data-conta="${M.atendimentos}">${M.atendimentos}</span><small>mil</small></dd></div>
      </dl>
    </div>
    <div class="casa-palco">
      <figure class="casa-foto revela">${foto('sobre-navalha')}</figure>
      <div class="casa-poste cena-zoom">${I.poste}</div>
      <div class="casa-selo" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="circ" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><text><textPath href="#circ">COBRE BARBEARIA  CURITIBA  DESDE ${M.desde}  </textPath></text></svg>${I.simbolo}</div>
    </div>
  </div>
</section>`;

// ---------- cardápio: lista por segmento com a foto presa ao lado; pacotes em bilhetes ----------
const servicos = `<section class="cardapio" id="servicos">
  <div class="largo">
    <div class="sec-cab">
      <div>${rotulo('O cardápio', 'Preço, duração e o que inclui')}${titulo('h2', 'Quinze coisas que a gente faz', 'muito bem.')}</div>
      <p class="cena">Passe o mouse ou toque num serviço para ver a foto. O botão leva direto para o agendamento com ele escolhido.</p>
    </div>
    <div class="abas" role="tablist" aria-label="Segmentos" data-iguais>
      ${C.segmentos.map((g, i) => `<button type="button" role="tab" id="aba-${g.id}" aria-controls="seg-${g.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}>${g.nome}</button>`).join('\n      ')}    </div>
    <div class="cardapio-grade">
      <div class="cardapio-listas">
        ${C.segmentos.map((g, i) => `<div class="seg" id="seg-${g.id}" role="tabpanel" aria-labelledby="aba-${g.id}"${i ? ' hidden' : ''}>
          <p class="seg-frase">${esc(g.frase)}</p>
          <ul class="pratos">
            ${C.servicos.filter((s) => s.seg === g.id).map((s) => `<li class="prato cena" data-prato-foto="${s.foto}" data-prato-nome="${esc(s.nome)}" data-prato-preco="${s.adicional ? '+ ' : ''}${precoTxt(s)}">
              <a href="#agendar" data-agendar="${s.id}" data-cursor="Agendar" aria-label="Agendar ${esc(s.nome)}, ${minutos(s.min)}, ${s.adicional ? 'mais ' : ''}${precoTxt(s)}">
                <span class="prato-mini">${foto(s.foto, { alt: '' })}</span>
                <span class="prato-nome">${esc(s.nome)}</span>
                <span class="prato-info"><b>${minutos(s.min)}</b> ${esc(s.inclui)}</span>
                <span class="prato-preco">${s.adicional ? '+ ' : ''}${precoTxt(s)}</span>
                <span class="prato-seta" aria-hidden="true">${I.setaDir}</span>
              </a>
            </li>`).join('\n            ')}
          </ul>
        </div>`).join('\n        ')}
      </div>
      <aside class="cardapio-lado">
        <figure class="cardapio-foto" data-cardapio-foto>
          ${foto(C.servicos[0].foto, { alt: '' })}
          <figcaption><b data-cardapio-nome>${esc(C.servicos[0].nome)}</b><span data-cardapio-preco>${precoTxt(C.servicos[0])}</span></figcaption>
        </figure>
        <p class="cardapio-nota">Todo corte inclui lavagem, toalha quente na nuca e um café. Pix, débito e crédito; pacotes em até 2 vezes sem juros. Cancelamento e remarcação sem custo até 24 horas antes.</p>
        <a class="link-seta" href="#combinados">Ver os combinados da casa ${I.setaDir}</a>
      </aside>
    </div>
    <div class="bilhetes">
      ${C.pacotes.map((p, i) => `<article class="bilhete cena${p.destaque ? ' bilhete-destaque' : ''}" style="--i:${i}" data-inclina>
        <div class="bilhete-corpo">
          <p class="bilhete-tipo">${p.destaque ? 'Pacote mais completo' : 'Pacote da casa'}</p>
          <h3>${p.nome}</h3>
          <p>${esc(p.frase)}</p>
          <ul>${p.inclui.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        </div>
        <div class="bilhete-canhoto">
          <p class="bilhete-preco"><b>${reais(p.preco)}</b><span>separados, ${reais(p.avulso)}</span></p>
          <p class="bilhete-min">${minutos(p.min)} de cadeira</p>
          ${btn('#agendar', `Agendar o ${p.nome}`, { cls: p.destaque ? 'btn-cobre' : 'btn-linha', attrs: `data-agendar="${p.id}"`, cursor: 'Agendar' })}
        </div>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- um corte na Cobre: cena presa, o relógio corre de 0 a 45 minutos ----------
const umCorte = `<section class="corte" id="um-corte" style="--n:${C.etapas.length}">
  <div class="corte-fixo">
    <div class="largo corte-cab">
      ${rotulo('Um corte na Cobre', 'Role para ver o relógio andar')}
      ${titulo('h2', '45 minutos,', 'sem pressa.')}
    </div>
    <div class="largo corte-palco">
      <p class="corte-relogio" aria-hidden="true"><b data-corte-relogio>00:00</b><span>minutos de cadeira</span></p>
      <div class="corte-fotos">
        ${C.etapas.map((e, i) => `<figure class="corte-foto${i === 0 ? ' ativo' : ''}">${foto(e.foto)}</figure>`).join('\n        ')}
      </div>
      <ol class="corte-passos">
        ${C.etapas.map((e, i) => `<li class="corte-passo${i === 0 ? ' ativo' : ''}"><small>aos ${e.min} min</small><h3>${e.nome}</h3><p>${esc(e.texto)}</p></li>`).join('\n        ')}
      </ol>
    </div>
    <div class="largo"><div class="corte-barra" aria-hidden="true"><i></i></div></div>
  </div>
</section>`;

// ---------- guia do degradê: cabeça em SVG, o degradê sobe conforme a escolha ----------
// Retrato de perfil: o cabelo é uma forma só, e duas máscaras em gradiente fazem o degradê. A máscara do cabelo some
// de cima para baixo; a da barba por fazer (pontinhos) aparece onde o cabelo some e termina na pele.
// O app.js move os "offset" dos <stop data-stop> e a linha tracejada conforme o degradê escolhido.
const pararFade = (opacs) => ['cabelo', 'meio', 'pele'].map((k, i) => `<stop data-stop="${k}" offset="${[.55, .7, .85][i]}" stop-color="#fff" stop-opacity="${opacs[i]}"/>`).join('');
const PERFIL = 'M205 58C262 56 304 96 308 150C311 190 302 222 290 246C282 262 280 276 284 300L294 440H164L170 330C150 326 132 322 124 316C115 310 110 304 110 296C111 290 112 285 107 281C102 278 103 272 108 268C104 265 102 262 104 258C106 254 107 250 105 247L98 245C90 243 88 236 92 230L108 197C106 191 110 185 112 178C114 168 112 158 114 146C118 96 150 58 205 58Z';
const cabeca = `<svg class="cabeca" viewBox="0 0 400 440" role="img" aria-labelledby="cabeca-t">
  <title id="cabeca-t">Retrato de perfil de um cliente na cadeira, mostrando até onde o degradê sobe na lateral da cabeça</title>
  <defs>
    <path id="forma-cabelo" d="M116 142C110 104 128 64 168 44C196 30 238 30 266 44C300 62 318 100 318 148C318 192 306 226 292 252C287 262 281 264 276 258C266 244 256 228 248 214L226 218L214 218C210 200 206 182 200 168C180 156 150 152 128 150C122 148 118 146 116 142Z"/>
    <clipPath id="c-cabelo"><use href="#forma-cabelo"/></clipPath>
    <linearGradient id="g-pele" x1="90" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:var(--pele)"/><stop offset="1" style="stop-color:var(--pele-sombra)"/></linearGradient>
    <linearGradient id="g-fade" x1="0" y1="30" x2="0" y2="268" gradientUnits="userSpaceOnUse">${pararFade([1, .35, 0])}</linearGradient>
    <linearGradient id="g-barba" x1="0" y1="30" x2="0" y2="268" gradientUnits="userSpaceOnUse">${pararFade([1, 1, 0])}</linearGradient>
    <mask id="m-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="440"><rect width="400" height="440" fill="url(#g-fade)"/></mask>
    <mask id="m-barba" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="440"><rect width="400" height="440" fill="url(#g-barba)"/></mask>
    <pattern id="p-barba" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.05" style="fill:var(--cabelo)"/><circle cx="4.6" cy="4.2" r=".95" style="fill:var(--cabelo)"/></pattern>
    <pattern id="p-capa" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#1D1E23"/><rect width="2" height="22" fill="#C2703A"/></pattern>
  </defs>
  <circle class="cabeca-fundo" cx="205" cy="205" r="162"/>
  <circle class="cabeca-aro" cx="205" cy="205" r="176"/>
  <path class="cabeca-pele" d="${PERFIL}"/>
  <path class="cabeca-sombra" d="M170 330C204 320 238 298 262 268L284 300L288 344C248 346 208 342 170 330Z"/>
  <use href="#forma-cabelo" fill="url(#p-barba)" mask="url(#m-barba)"/>
  <g mask="url(#m-fade)">
    <use class="cabeca-cabelo" href="#forma-cabelo"/>
    <g class="cabeca-mechas" clip-path="url(#c-cabelo)"><path d="M126 122C150 80 190 52 240 50"/><path d="M138 136C166 96 204 72 262 70"/><path d="M158 150C190 116 236 98 290 104"/><path d="M178 162C212 138 256 128 304 138"/><path d="M210 176C240 162 276 164 310 178"/></g>
  </g>
  <path class="cabeca-linha" data-linha-degrade d="M186 200H330"/>
  <path class="cabeca-orelha" d="M228 172C250 164 266 182 264 202C262 222 250 234 236 234C228 234 224 226 228 220C232 214 226 208 224 200C222 188 222 176 228 172Z"/>
  <path class="cabeca-traco" d="M238 184C250 186 254 200 250 212C247 220 240 218 240 210"/>
  <path class="cabeca-sobrancelha" d="M118 175C128 168 142 168 154 173"/>
  <path class="cabeca-olho" d="M124 190C129 186 137 187 141 191C135 194 129 194 124 190Z"/>
  <path class="cabeca-traco" d="M121 185C130 180 140 181 145 188M104 238C110 236 114 240 112 245M106 268C111 268 114 267 119 265"/>
  <path class="cabeca-traco cabeca-mandibula" d="M130 318C168 316 210 298 238 270"/>
  <path class="cabeca-contorno" d="${PERFIL}"/>
  <path class="cabeca-gola" d="M160 350C200 366 260 364 298 348L300 368C260 384 200 384 158 370Z"/>
  <path class="cabeca-capa" d="M84 440C96 394 134 370 160 364C200 380 262 380 300 364C332 374 362 402 376 440Z" fill="url(#p-capa)"/>
</svg>`;
const d0 = C.degrades[2];
const guia = `<section class="guia" id="guia">
  <div class="largo guia-grade">
    <div class="guia-palco cena-zoom" data-cursor="Arrastar">
      ${cabeca}
      <p class="guia-pente" aria-hidden="true"><small>pente</small><b data-guia="pente">${d0.pente}</b></p>
    </div>
    <div class="guia-txt">
      ${rotulo('Guia do degradê', 'Saiba o que pedir')}
      ${titulo('h2', 'Não sabe o que', 'pedir?')}
      <p class="cena">Cinco degradês, do quase nada ao ousado. Arraste, escolha um e diga o nome quando sentar na cadeira. O resto é com a gente.</p>
      <label class="guia-regua cena"><span class="vh">Altura do degradê</span><input type="range" min="0" max="${C.degrades.length - 1}" step="1" value="2" data-guia-regua aria-valuetext="${d0.nome}"></label>
      <div class="guia-nomes cena" role="group" aria-label="Escolha o degradê">
        ${C.degrades.map((d, i) => `<button type="button" data-guia-ir="${i}" aria-pressed="${i === 2}">${d.nome.replace('Degradê ', '')}</button>`).join('')}
      </div>
      <div class="guia-ficha cena" aria-live="polite">
        <h3 data-guia="nome">${d0.nome}</h3>
        <p data-guia="pede">${esc(d0.pede)}</p>
        <dl><div><dt>Pente</dt><dd data-guia="pente">${d0.pente}</dd></div><div><dt>Volta</dt><dd data-guia="freq">${d0.freq}</dd></div><div><dt>Valor</dt><dd>${reais(servPorId.degrade.preco)}</dd></div></dl>
        ${btn('#agendar', 'Agendar este degradê', { attrs: 'data-agendar="degrade" data-guia-agendar', cursor: 'Agendar' })}
      </div>
    </div>
  </div>
</section>`;

// ---------- intervalo: a barboterapia ----------
const toalha = `<section class="toalha" id="barboterapia">
  <figure class="toalha-foto">${foto('barba-pincel')}</figure>
  <div class="toalha-vapor" aria-hidden="true">${[0, 1, 2].map((k) => `<svg viewBox="0 0 60 200" style="--k:${k}"><path d="M30 200c-18-30 18-50 0-80s18-50 0-80 10-30 0-40"/></svg>`).join('')}</div>
  <div class="largo toalha-in">
    ${rotulo('A barboterapia', 'Sexta é o dia mais pedido')}
    ${titulo('h2', 'Duas toalhas quentes', 'e silêncio.')}
    <p class="cena">Vapor de ozônio, esfoliação, duas toalhas quentes, navalha nova e máscara calmante no fim. ${minutos(servPorId.barboterapia.min)}, ${reais(servPorId.barboterapia.preco)}.</p>
    <div class="cena">${btn('#agendar', 'Agendar a barboterapia', { attrs: 'data-agendar="barboterapia"', cursor: 'Agendar' })}</div>
  </div>
</section>`;

// ---------- equipe: as cartas se espalham conforme a rolagem ----------
const cartaBarbeiro = (b, i) => `<a class="carta" style="--i:${i}" href="equipe.html#${b.id}" data-cursor="Ver" data-inclina>
        <figure>${foto(b.foto)}</figure>
        <div class="carta-info">
          <h3>${b.nome}</h3>
          <p>${esc(b.esp)}</p>
          <p class="carta-prox">Próximo horário livre <b data-proximo="${b.id}">consultando</b></p>
        </div>
      </a>`;
const equipePrevia = `<section class="equipe" id="equipe">
  <div class="largo">
    <div class="sec-cab">
      <div>${rotulo('Quem corta', 'Quatro cadeiras, quatro especialidades')}${titulo('h2', 'Escolha a sua', 'cadeira.')}</div>
      <div class="sec-cab-dir cena"><p>Marque sempre com o mesmo barbeiro ou pegue a próxima cadeira livre.</p>${btn('equipe.html', 'Conhecer a equipe', { cls: 'btn-linha', icone: '', cursor: 'Ver' })}</div>
    </div>
    <div class="leque" data-leque>
      ${C.equipe.map(cartaBarbeiro).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- galeria: carrossel com filtro (setas, arraste, passagem automática e pausa no mouse) ----------
const galeria = `<section class="galeria" id="galeria">
  <div class="largo galeria-cab">
    <div>${rotulo('A casa por dentro', 'Toque numa foto para ampliar')}${titulo('h2', 'Quatro cadeiras,', 'uma playlist.')}</div>
    <div class="galeria-ctrl">
      <div class="filtros" role="group" aria-label="Filtrar a galeria" data-iguais>
        <button type="button" data-filtro="todos" aria-pressed="true">Todas</button>
        ${C.galeriaCats.map((c) => `<button type="button" data-filtro="${c.id}" aria-pressed="false">${c.nome}</button>`).join('\n        ')}
      </div>
      <div class="gal-setas"><button type="button" class="gal-seta" data-gal-ir="-1" aria-label="Fotos anteriores" data-magnetic>${I.setaEsq}</button><button type="button" class="gal-seta" data-gal-ir="1" aria-label="Próximas fotos" data-magnetic>${I.setaDir}</button></div>
    </div>
  </div>
  <ul class="gal-pista" data-pista tabindex="0" aria-label="Fotos da casa, role para o lado" data-cursor="Arrastar">
    ${C.galeria.map(([f, cat], i) => `<li class="gal" data-cat="${cat}" style="--i:${i}"><button type="button" data-foto="${f}" data-cursor="Ver" aria-label="Ampliar: ${esc(C.fotos[f])}">${foto(f)}<span class="gal-cat">${C.galeriaCats.find((c) => c.id === cat).nome}</span></button></li>`).join('\n    ')}
  </ul>
</section>
<dialog class="caixa-foto" id="caixa-foto" aria-label="Foto ampliada">
  <figure><img src="" alt=""><figcaption></figcaption></figure>
  <button type="button" class="cf-btn cf-ant" data-cf="-1" aria-label="Foto anterior">${I.setaEsq}</button>
  <button type="button" class="cf-btn cf-prox" data-cf="1" aria-label="Próxima foto">${I.setaDir}</button>
  <button type="button" class="cf-btn cf-fecha" data-fecha aria-label="Fechar">${I.fechar}</button>
</dialog>`;

// ---------- avaliações: cupom que imprime com a rolagem ----------
const avaliacoesSec = `<section class="avaliacoes" id="depoimentos">
  <div class="largo aval-grade">
    <div class="aval-lado">
      ${rotulo('Quem já sentou', 'Avaliações do Google')}
      ${titulo('h2', 'Não é só a gente', 'que diz.')}
      <div class="aval-nota cena"><b><span data-conta="${M.nota}" data-dec="1">${nota}</span></b><div>${estrelas}<p>${avaliacoes} avaliações no Google</p></div></div>
    </div>
    <div class="cupom" data-cupom>
      <div class="cupom-papel">
        <p class="cupom-cab"><b>${M.completo}</b><span>${M.endereco}, ${M.bairro}</span><span>${M.cidade}, ${M.uf}</span></p>
        <p class="cupom-col"><span>Avaliações de clientes</span><span>Qtd</span></p>
        <ul>
          ${C.depoimentos.map((d) => `<li class="cupom-item"><p class="cupom-linha">${estrelas}<span>1</span></p><blockquote>${esc(d.texto)}</blockquote><p class="cupom-quem">${esc(d.nome)}, ${esc(d.serv)}</p></li>`).join('\n          ')}
        </ul>
        <p class="cupom-total"><span>Total</span><b>${nota} de 5</b></p>
        <p class="cupom-total"><span>Avaliações</span><b>${avaliacoes}</b></p>
        <p class="cupom-fim">Obrigado. Até daqui a três semanas.</p>
      </div>
    </div>
  </div>
</section>`;

// ---------- clube: cartão de metal que inclina com o mouse ----------
const clube = `<section class="clube" id="clube">
  <div class="largo clube-grade">
    <div class="clube-txt">
      ${rotulo('O Clube Cobre', 'Plano mensal')}
      ${titulo('h2', 'Nunca mais', 'agende.')}
      <p class="cena">Um plano por mês, dois cortes e a sua cadeira guardada no mesmo horário a cada 15 dias.</p>
      <ul class="clube-lista">${C.clube.inclui.map((t) => `<li class="cena">${I.check}<span>${esc(t)}</span></li>`).join('')}</ul>
      <p class="clube-preco cena"><b>${reais(C.clube.preco)}</b><span>por mês</span></p>
      <div class="clube-btns cena" data-iguais>${btn(wa(`Olá, ${M.completo}! Quero entrar no Clube Cobre.`), 'Quero entrar', { icone: I.whats })}${btn('#duvidas', 'Tirar uma dúvida', { cls: 'btn-linha' })}</div>
      <p class="clube-regras cena">${esc(semMarca(C.clube.regras))}</p>
    </div>
    <div class="clube-palco cena-zoom">
      <div class="cartao" data-cartao data-cursor="Girar">
        <div class="cartao-face">
          <p class="cartao-topo">${I.simbolo}<span>Clube Cobre</span></p>
          <p class="cartao-chip" aria-hidden="true"></p>
          <p class="cartao-hora"><small>Sua cadeira</small><b>Quinta, 19h30</b></p>
          <p class="cartao-nome"><small>Membro desde ${new Date().getFullYear()}</small><b>Seu nome aqui</b></p>
          <span class="cartao-brilho" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  </div>
</section>`;

// ---------- Instagram: mural de fotos soltas ----------
const instagram = `<section class="insta" id="instagram" aria-labelledby="insta-t">
  <div class="largo">
    <div class="insta-perfil cena">
      <span class="insta-avatar">${I.simbolo}</span>
      <div class="insta-quem"><h2 id="insta-t"><a href="${M.instagram}" target="_blank" rel="noopener">${M.instagramUser}</a></h2><p>${M.completo}. ${M.bairro}, ${M.cidade}. Agenda pelo link.</p></div>
      ${btn(M.instagram, 'Seguir', { icone: I.insta })}
    </div>
    <ul class="mural">
      ${C.instagram.map((p, i) => `<li class="cena" style="--i:${i}"><a href="${M.instagram}" target="_blank" rel="noopener" data-cursor="Ver" aria-label="Ver no Instagram: ${esc(p.legenda)}">${foto(p.foto)}
        <span class="mural-veu"><span class="mural-nums"><span>${I.coracao}${p.curt}</span><span>${I.balao}${p.com}</span></span><span>${esc(p.legenda)}</span></span></a></li>`).join('\n      ')}
    </ul>
  </div>
</section>`;

// ---------- agendamento: serviço, barbeiro, data e horário ----------
const optServ = [
  ...C.segmentos.map((g) => `<optgroup label="${g.nome}">${C.servicos.filter((s) => s.seg === g.id && !s.adicional).map((s) => `<option value="${s.id}">${esc(s.nome)}, ${precoTxt(s)}</option>`).join('')}</optgroup>`),
  `<optgroup label="Pacotes">${C.pacotes.map((p) => `<option value="${p.id}">${esc(p.nome)}, ${reais(p.preco)}</option>`).join('')}</optgroup>`,
].join('');
const agendar = `<section class="agendar" id="agendar">
  <div class="largo">
    <div class="sec-cab">
      <div>${rotulo('Agendamento', 'Confirmação em até uma hora')}${titulo('h2', 'Puxe a sua', 'cadeira.')}</div>
      <p class="cena">Escolha o serviço, o barbeiro, o dia e a hora. O pedido chega no nosso WhatsApp com tudo preenchido.</p>
    </div>
    <form class="ag" id="form-agenda" novalidate>
      <div class="ag-passos">
        <fieldset class="ag-passo cena">
          <legend>Serviço</legend>
          <label class="campo"><span class="vh">Serviço</span><select name="servico" id="ag-servico" required><option value="">Escolha o serviço</option>${optServ}</select></label>
          <label class="ag-extra"><input type="checkbox" name="risco" value="risco"><span>Adicionar risco e desenho (+ ${reais(servPorId.risco.preco)}, ${servPorId.risco.min} min)</span></label>
        </fieldset>
        <fieldset class="ag-passo cena">
          <legend>Barbeiro</legend>
          <div class="ag-barbeiros">
            <label class="ag-b"><input type="radio" name="barbeiro" value="qualquer" checked><span class="ag-b-in"><span class="ag-b-foto ag-b-qualquer">${I.tesoura}</span><b>Sem preferência</b><small>Primeiro horário livre</small></span></label>
            ${C.equipe.map((b) => `<label class="ag-b" data-b="${b.id}"><input type="radio" name="barbeiro" value="${b.id}"><span class="ag-b-in"><span class="ag-b-foto">${foto(b.foto, { alt: '' })}</span><b>${b.nome.split(' ')[0]}</b><small>${esc(b.esp.split(',')[0])}</small></span></label>`).join('\n            ')}
          </div>
          <p class="ag-aviso" data-aviso-barbeiro hidden></p>
        </fieldset>
        <fieldset class="ag-passo cena">
          <legend>Data</legend>
          <div class="ag-dias" data-dias></div>
        </fieldset>
        <fieldset class="ag-passo cena">
          <legend>Horário</legend>
          <div class="ag-horas" data-horas><p class="ag-vazio">Escolha o serviço e a data para ver os horários livres.</p></div>
        </fieldset>
        <fieldset class="ag-passo ag-dados cena">
          <legend>Seus dados</legend>
          <label class="campo"><span>Nome</span><input name="nome" autocomplete="name" required></label>
          <label class="campo"><span>WhatsApp</span><input name="fone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(41) 90000-0000" required></label>
          <label class="campo campo-largo"><span>Observação (opcional)</span><textarea name="obs" rows="2" placeholder="Ex.: quero manter o comprimento em cima"></textarea></label>
          <label class="aceite campo-largo"><input type="checkbox" name="lgpd" required><span>Concordo com o uso dos meus dados para responder e confirmar este agendamento, conforme a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</span></label>
        </fieldset>
      </div>
      <aside class="ag-resumo cena-lado" aria-live="polite">
        <p class="ag-resumo-cab">${I.simbolo}<span>Comanda</span></p>
        <dl>
          <div><dt>Serviço</dt><dd data-r="servico">Escolha o serviço</dd></div>
          <div><dt>Barbeiro</dt><dd data-r="barbeiro">Sem preferência</dd></div>
          <div><dt>Data</dt><dd data-r="data">Escolha a data</dd></div>
          <div><dt>Horário</dt><dd data-r="hora">Escolha o horário</dd></div>
          <div><dt>Duração</dt><dd data-r="min">0 min</dd></div>
        </dl>
        <p class="ag-total"><span>Total</span><b data-r="total">R$ 0</b></p>
        <button class="btn btn-cobre ag-enviar" type="submit" data-magnetic data-cursor="Enviar"><span class="btn-fundo" aria-hidden="true"></span>${I.whats}<span class="btn-txt" data-t="Pedir pelo WhatsApp"><span>Pedir pelo WhatsApp</span></span></button>
        <p class="ag-erro" role="alert" hidden></p>
        <p class="ag-mini">Cancelamento e remarcação sem custo até 24 horas antes.</p>
      </aside>
    </form>
    <div class="ag-ok" id="ag-ok" hidden tabindex="-1">
      <span class="ag-ok-ic">${I.check}</span>
      <h3>Pedido aberto no WhatsApp</h3>
      <p data-ok-txt></p>
      <div class="ag-ok-btns" data-iguais><a class="btn btn-linha" data-gcal target="_blank" rel="noopener">${I.agenda}Google Agenda</a><button type="button" class="btn btn-linha" data-ics>${I.agenda}Baixar .ics</button><button type="button" class="btn btn-cobre" data-novo>Novo agendamento</button></div>
    </div>
  </div>
</section>`;

// ---------- contato: formulário para dúvidas e pedidos ----------
const contato = `<section class="contato" id="contato">
  <div class="largo contato-grade">
    <div class="contato-txt">
      ${rotulo('Contato', 'Resposta no mesmo dia útil')}
      ${titulo('h2', 'Fala com', 'a gente.')}
      <p class="cena">Dia do noivo, vale-presente, clube ou uma dúvida sobre o seu cabelo. Quem responde é a recepção da casa.</p>
      <ul class="contato-canais cena">
        <li><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">${I.whats}<span><small>WhatsApp</small>${M.whatsappTexto}</span></a></li>
        <li><a href="tel:${tel}">${I.telefone}<span><small>Telefone</small>${M.telefone}</span></a></li>
        <li><a href="mailto:${M.email}">${I.balao}<span><small>E-mail</small>${M.email}</span></a></li>
      </ul>
    </div>
    <form class="contato-form cena-lado" id="form-contato" novalidate>
      <label class="campo"><span>Nome</span><input name="nome" autocomplete="name" required></label>
      <label class="campo"><span>WhatsApp ou e-mail</span><input name="retorno" autocomplete="email" required></label>
      <label class="campo campo-largo"><span>Assunto</span><select name="assunto" required><option value="">Escolha o assunto</option>${C.assuntos.map((a) => `<option>${a}</option>`).join('')}</select></label>
      <label class="campo campo-largo"><span>Mensagem</span><textarea name="mensagem" rows="4" required></textarea></label>
      <label class="aceite campo-largo"><input type="checkbox" name="lgpd" required><span>Concordo com o uso dos meus dados para responder a esta mensagem, conforme a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</span></label>
      <p class="ag-erro campo-largo" role="alert" hidden></p>
      <div class="campo-largo">${btn('', 'Enviar mensagem', { attrs: 'data-contato-enviar', cursor: 'Enviar' }).replace('type="button"', 'type="submit"')}</div>
    </form>
    <div class="contato-ok" id="contato-ok" hidden tabindex="-1"><span class="ag-ok-ic">${I.check}</span><h3>Mensagem pronta no WhatsApp</h3><p>Se a conversa não abriu, escreva para ${M.email}. Respondemos no mesmo dia útil.</p></div>
  </div>
</section>`;

// ---------- combinados da casa (política de agendamento, atraso, cancelamento e garantia) ----------
const combinados = `<section class="combinados" id="combinados">
  <div class="largo">
    <div class="sec-cab">
      <div>${rotulo('Os combinados', 'Agendamento, atraso, cancelamento e garantia')}${titulo('h2', 'Tudo combinado', 'antes da máquina.')}</div>
      <button type="button" class="link-seta cena" data-doc="servico">Ler os termos completos ${I.setaDir}</button>
    </div>
    <div class="comb-grade">
      <ul class="comb-lista">${C.combinados.map((c, i) => `<li class="cena" style="--i:${i}"><h3>${c.nome}</h3><p>${esc(semMarca(c.texto))}</p></li>`).join('')}</ul>
      <article class="comb-destaque cena-zoom"><p class="comb-aviso">Atenção, serviço com químico</p><h3>${C.combinadoDestaque.nome}</h3><p>${esc(C.combinadoDestaque.texto)}</p></article>
    </div>
  </div>
</section>`;

// ---------- dúvidas ----------
const duvidas = `<section class="duvidas" id="duvidas">
  <div class="largo duv-grade">
    <div class="duv-lado">
      ${rotulo('Dúvidas', 'As perguntas de sempre')}
      ${titulo('h2', 'Antes de', 'sentar.')}
      <div class="cena">${btn(wa(`Olá, ${M.completo}! Tenho uma dúvida.`), 'Perguntar no WhatsApp', { icone: I.whats })}</div>
    </div>
    <div class="duv-lista">
      ${C.faq.map(([p, r], i) => `<details class="duv cena"${i === 0 ? ' open' : ''}><summary>${esc(p)}<span class="duv-mais" aria-hidden="true">${I.mais}</span></summary><div class="duv-r"><p>${esc(semMarca(r))}</p></div></details>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- chamada final com o horário da casa ----------
const diasTab = (cls) => `<table class="${cls}"><caption class="vh">Horário de funcionamento</caption>${C.horarios.map(([d, h], i) => `<tr data-dia="${i}"><th scope="row">${d}</th><td>${h}</td></tr>`).join('')}</table>`;
const fecho = (base = '') => `<section class="fecho">
  <figure class="fecho-foto">${foto('espaco-salao')}</figure>
  <div class="largo fecho-in">
    <div>
      ${rotulo('O próximo corte', 'Com hora marcada ou sem')}
      ${titulo('h2', 'Puxe uma cadeira,', 'o resto é com a gente.')}
      <div class="fecho-btns cena" data-iguais>${btn(`${base}#agendar`, 'Agendar horário', { cursor: 'Agendar' })}${btn(wa(`Olá, ${M.completo}!`), 'WhatsApp', { cls: 'btn-vidro', icone: I.whats })}</div>
    </div>
    <div class="fecho-horas cena-lado"><h3>Horário</h3>${diasTab('horas')}</div>
  </div>
</section>`;

// ---------- rodapé ----------
const rodape = (base) => `<footer class="rodape">
  <div class="largo">
    <div class="rod-topo">
      <a class="logo logo-grande" href="${base || '#inicio'}" aria-label="${M.completo}, início">${I.logo}</a>
      <p>Corte, barba e sobrancelha com hora marcada no ${M.bairro}, ${M.cidade}.</p>
      ${redes()}
    </div>
    <div class="rod-cols">
      <div><h3>Navegue</h3><ul>${[['inicio', 'Início'], ...navItens, ['agendar', 'Agendar horário'], ['contato', 'Contato']].map(([id, t]) => `<li><a href="${href(id, base)}">${t}</a></li>`).join('')}</ul></div>
      <div><h3>Serviços</h3><ul>${C.segmentos.map((g) => `<li><a href="${base}#servicos" data-ir-aba="${g.id}">${g.nome}</a></li>`).join('')}<li><a href="${base}#guia">Guia do degradê</a></li><li><a href="${base}#clube">Clube Cobre</a></li></ul></div>
      <div><h3>Atendimento</h3><ul><li><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li><li><a href="tel:${tel}">Telefone ${M.telefone}</a></li><li><a href="mailto:${M.email}">${M.email}</a></li></ul></div>
      <div><h3>Funcionamento</h3>${diasTab('horas')}</div>
    </div>
    <div class="mapa-linha">
      <div class="map-box">
        <img class="mapa-claro" src="assets/img/mapa_batel_claro.webp" alt="Mapa do ${M.bairro}, ${M.cidade}, com a localização da ${M.completo}" width="1240" height="760" loading="lazy">
        <img class="mapa-escuro" src="assets/img/mapa_batel.webp" alt="Mapa do ${M.bairro}, ${M.cidade}, com a localização da ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${endereco}, CEP ${M.cep}</span><span>${C.horarioCurto}</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Só na barbearia, com hora marcada. Quem chega sem horário é atendido se houver cadeira livre. Clientes destes bairros chegam em poucos minutos:</p>
        <ul class="bairros">${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="legal">
      <p><b>${M.razao}</b>, CNPJ ${M.cnpj}. ${endereco}, CEP ${M.cep}. Telefone ${M.telefone}. ${M.email}.</p>
      <p>Tesouras e pentes esterilizados em autoclave, navalhas e lâminas descartáveis. Produtos com registro ou notificação na Anvisa. Licença sanitária municipal em dia.</p>
      <div class="legal-links"><button type="button" class="link" data-doc="servico">Termos de prestação de serviço</button><button type="button" class="link" data-doc="uso">Termos de uso</button><button type="button" class="link" data-doc="privacidade">Política de privacidade</button><button type="button" class="link" data-cookies>Preferências de cookies</button></div>
      <details class="creditos"><summary>Créditos das imagens</summary><ul data-creditos></ul></details>
    </div>
    <p class="rod-marca" aria-hidden="true">Cobre</p>
    <div class="rod-fim"><p>© ${new Date().getFullYear()} ${M.completo}. Todos os direitos reservados.</p><p>Modelo de site com marca, pessoas, preços e avaliações fictícios.</p></div>
  </div>
</footer>
<a class="whats-flutua" href="${wa(`Olá! Vim pelo site da ${M.completo} e quero agendar um horário.`)}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp" data-magnetic>${I.whats}<span>WhatsApp</span></a>`;

// ---------- janelas legais e cookies [JURÍDICO] ----------
const legal = {
  servico: ['Termos de prestação de serviço', `
    <h3>Agendamento e confirmação</h3><p>O horário só está garantido depois da confirmação da ${M.completo} pelo WhatsApp, telefone ou e-mail. Sem hora marcada, o atendimento depende de cadeira livre.</p>
    <h3>Valores e pagamento</h3><p>Os preços do site são de referência. A pigmentação tem valor "a partir de", fechado antes do serviço conforme a área. Nenhum valor muda sem o seu aceite. Pix, débito e crédito; pacotes em até 2 vezes sem juros.</p>
    <h3>Atraso, cancelamento e remarcação</h3><p>Tolerância de 15 minutos. Cancelamento e remarcação sem custo até 24 horas antes. Duas faltas sem aviso pedem sinal de 30% via Pix nos agendamentos seguintes, abatido no valor do serviço.</p>
    <h3>Pigmentação e produtos químicos</h3><p>Teste de sensibilidade obrigatório 48 horas antes para quem nunca fez o serviço aqui. O barbeiro pode adiar o serviço quando a pele não estiver em condições, explicando o motivo.</p>
    <h3>Garantia</h3><p>Corte e barba: ajuste sem custo em até 7 dias com o mesmo barbeiro. A garantia não cobre mudança de ideia sobre o resultado combinado.</p>
    <h3>Clube Cobre</h3><p>Plano mensal sem fidelidade, cobrado no cartão de crédito. Cortes não usados no mês não acumulam. O cancelamento vale a partir da renovação seguinte.</p>
    <h3>Crianças</h3><p>Menores de 12 anos são atendidos com um responsável presente durante todo o serviço.</p>`],
  uso: ['Termos de uso', `
    <p>Este site apresenta os serviços da ${M.completo} (${M.razao}, CNPJ ${M.cnpj}) e recebe pedidos de agendamento e mensagens. Ao usar o site, você concorda com estes termos.</p>
    <h3>Conteúdo</h3><p>Textos e marca pertencem à ${M.completo}. As imagens pertencem a seus autores, conforme os créditos. Fotos de clientes só são publicadas com autorização por escrito.</p>
    <h3>Pedidos de agendamento</h3><p>O formulário monta o pedido e abre o WhatsApp. Os horários mostrados são uma previsão e só valem depois da nossa confirmação.</p>
    <h3>Links externos</h3><p>Mapas, agendas, Instagram e WhatsApp são serviços de terceiros, com políticas próprias.</p>`],
  privacidade: ['Política de privacidade', `
    <p>A ${M.razao} (CNPJ ${M.cnpj}) trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
    <h3>Dados que coletamos</h3><p>No agendamento: nome, WhatsApp, serviço, barbeiro, data, horário e a observação que você escrever. No contato: nome, WhatsApp ou e-mail, assunto e mensagem.</p>
    <h3>Para que usamos</h3><p>Responder ao pedido ou à mensagem, confirmar e lembrar o horário e registrar o serviço feito. Novidades só com o seu consentimento, que pode ser retirado a qualquer momento.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins de publicidade. O pedido trafega pelo WhatsApp (Meta) e os pagamentos pelo processador do cartão ou do Pix.</p>
    <h3>Por quanto tempo</h3><p>Pedidos e mensagens sem atendimento são apagados em 6 meses. Fichas de cliente ficam enquanto houver relação com a barbearia e pelo prazo legal depois dela.</p>
    <h3>Seus direitos</h3><p>Confirmar, acessar, corrigir, apagar ou levar seus dados e revogar consentimentos pelo e-mail ${M.email}.</p>
    <h3>Cookies e armazenamento</h3><p>O site guarda no seu navegador a escolha de cookies, o tema claro ou escuro e se a tela de abertura já passou nesta visita. Não usamos cookies de publicidade. Medição de visitas só com a sua permissão.</p>`],
};
const dialogs = `${Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-cab"><h2 id="doc-${id}-t">${t}</h2><button type="button" class="doc-fecha" data-fecha aria-label="Fechar">${I.fechar}</button></div>
  <div class="doc-corpo">${corpo}<p class="doc-data">Atualizado em novembro de 2026. Texto a validar na revisão jurídica.</p></div>
</dialog>`).join('\n')}
<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Usamos só o armazenamento necessário para o site funcionar. Medição de visitas, apenas se você permitir. <button type="button" class="link" data-doc="privacidade">Saiba mais</button>.</p>
  <div class="cookies-btns" data-iguais><button type="button" class="btn btn-cobre" data-ck="todos">Aceitar todos</button><button type="button" class="btn btn-linha" data-ck="essenciais">Só os essenciais</button></div>
</div>
<div class="toast" data-toast role="status" aria-live="polite"></div>`;

// ---------- página da equipe ----------
// régua da semana: cada dia é uma barra entre 8h e 21h
const reguaSemana = (b) => `<div class="semana" role="list" aria-label="Dias e horários de ${b.nome}">
        ${[1, 2, 3, 4, 5, 6].map((d) => {
          const h = b.agenda[d];
          const txt = h ? `${hora(h[0])} às ${hora(h[1])}` : 'folga';
          return `<div class="semana-dia${h ? '' : ' folga'}" role="listitem"><b>${DIAS_C[d]}</b><span class="semana-trilho">${h ? `<i style="--ini:${(h[0] - 8) / 13};--fim:${(h[1] - 8) / 13}"></i>` : ''}</span><small>${txt}</small></div>`;
        }).join('\n        ')}
      </div>`;
const equipePagina = `<section class="eqp-capa">
  <div class="largo">
    ${rotulo('A equipe', 'Mais de 40 anos de cadeira somados')}
    <h1 class="palavras">${palavras('Quatro cadeiras,')} <em class="cursiva">quatro mãos boas.</em></h1>
    <p class="eqp-lead cena">Conheça cada barbeiro, veja os dias em que está na casa e agende direto com quem você quiser.</p>
    <nav class="eqp-retratos" aria-label="Barbeiros">
      ${C.equipe.map((b, i) => `<a href="#${b.id}" style="--i:${i}" data-cursor="Ver" data-inclina><figure>${foto(b.foto, { lazy: false, alt: '' })}</figure><span>${b.nome.split(' ')[0]}</span></a>`).join('\n      ')}
    </nav>
  </div>
</section>
${C.equipe.map((b, i) => {
  const anos = new Date().getFullYear() - b.desde;
  const servs = b.faz.map((id) => servPorId[id]).filter(Boolean);
  return `<section class="perfil${i % 2 ? ' perfil-inv' : ''}" id="${b.id}" aria-labelledby="${b.id}-t">
  <div class="largo perfil-grade">
    <div class="perfil-fotos">
      <figure class="perfil-foto revela">${foto(b.foto)}<figcaption>${I.insta}${b.insta}</figcaption></figure>
    </div>
    <div class="perfil-txt">
      <p class="rotulo"><span>(${esc(b.cargo)})</span><span>${esc(b.esp)}</span></p>
      <h2 id="${b.id}-t" class="palavras">${palavras(b.nome)}</h2>
      <blockquote class="perfil-frase cena">${esc(b.frase)}</blockquote>
      <p class="cena">${esc(b.bio)}</p>
      <dl class="perfil-dados cena">
        <div><dt>Na profissão</dt><dd><span data-conta="${anos}">${anos}</span> anos</dd></div>
        <div><dt>Próximo horário livre</dt><dd data-proximo="${b.id}">consultando</dd></div>
      </dl>
      <div class="cena">${reguaSemana(b)}</div>
      <details class="perfil-servs cena"><summary>Serviços que ${b.nome.split(' ')[0]} atende (${servs.length})</summary><ul>${servs.map((s) => `<li><span>${esc(s.nome)}</span><b>${precoTxt(s)}</b></li>`).join('')}</ul></details>
      <div class="perfil-trab">${b.trabalhos.map((f, k) => `<figure class="cena" style="--k:${k}" data-inclina>${foto(f)}</figure>`).join('')}</div>
      <div class="cena">${btn(`index.html?barbeiro=${b.id}#agendar`, `Agendar com ${b.nome.split(' ')[0]}`, { cursor: 'Agendar' })}</div>
    </div>
  </div>
</section>`;
}).join('\n')}
<section class="jeito">
  <div class="largo">
    <div class="sec-cab">${rotulo('Como a equipe trabalha')}${titulo('h2', 'O mesmo cuidado', 'em todas as cadeiras.')}</div>
    <ul class="jeito-lista">
      <li class="cena" style="--i:0"><h3>Conversa antes da máquina</h3><p>Todo atendimento começa no espelho: como você penteia, quanto tempo tem de manhã e o que não quer de jeito nenhum.</p></li>
      <li class="cena" style="--i:1"><h3>Material limpo na sua frente</h3><p>Tesouras e pentes saem da autoclave, navalha e lâmina são abertas na hora e a toalha é trocada a cada cliente.</p></li>
      <li class="cena" style="--i:2"><h3>Formação todo ano</h3><p>A casa paga um curso por ano para cada barbeiro. Visagismo, texturas e técnicas novas de degradê entram no cardápio depois de treinadas entre a gente.</p></li>
      <li class="cena" style="--i:3"><h3>Ajuste em até 7 dias</h3><p>Se algo não ficou como combinado, volte em até uma semana que o mesmo barbeiro acerta, sem custo.</p></li>
    </ul>
  </div>
</section>`;

// ---------- dados para o app.js ----------
const dados = {
  whatsapp: M.whatsapp, nome: M.completo, endereco, email: M.email,
  abertura: C.abertura,
  servicos: Object.values(servPorId).map((s) => ({ id: s.id, nome: s.nome, min: s.min, preco: s.preco, de: !!s.de, seg: s.seg })),
  equipe: C.equipe.map((b) => ({ id: b.id, nome: b.nome, faz: b.faz, agenda: b.agenda })),
  etapas: C.etapas.map((e) => e.min),
  degrades: C.degrades,
  carregando: C.carregando,
};

// ---------- página ----------
const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Martian+Mono:wght@400;500&family=Schibsted+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Yellowtail&display=swap" rel="stylesheet">';
const ld = {
  '@context': 'https://schema.org', '@type': 'BarberShop', name: M.completo, url: M.dominio,
  image: `${M.dominio}/assets/img/corte-degrade.webp`, telephone: M.telefone, email: M.email, priceRange: 'R$ 20 a R$ 175',
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: M.lat, longitude: M.lon },
  openingHoursSpecification: Object.entries(C.abertura).filter(([, h]) => h).map(([d, h]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d], opens: `${String(h[0]).padStart(2, '0')}:00`, closes: `${String(h[1]).padStart(2, '0')}:00` })),
  aggregateRating: { '@type': 'AggregateRating', ratingValue: M.nota, reviewCount: M.avaliacoes },
  sameAs: [M.instagram, M.facebook],
};
const COR_CLARO = '#F2ECE2', COR_ESCURO = '#121214';

const pagina = ({ titulo: tit, descricao, canon, corpo, base, atual, classe }) => `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(tit)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${M.dominio}/${canon}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(tit)}"><meta property="og:description" content="${esc(descricao)}"><meta property="og:image" content="${M.dominio}/assets/img/corte-degrade.webp"><meta property="og:locale" content="pt_BR">
<meta name="theme-color" content="${COR_CLARO}">
<script>document.documentElement.classList.add('js');try{if(sessionStorage.getItem('cobre-premium-troca')==='1')document.documentElement.classList.add('chegando')}catch(e){}</script>
${T.head(CHAVE_TEMA)}
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${fontes}
<link rel="stylesheet" href="assets/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body class="${classe}">
<div class="carrega" id="carrega" aria-hidden="true">
  <div class="carrega-in">
    ${I.simbolo}
    <p class="carrega-relogio"><b data-carrega-min>00</b><span>:</span><b>00</b></p>
    <p class="carrega-frase" data-frase>${C.carregando[0]}</p>
    <div class="carrega-barra"><i></i></div>
  </div></div>
<div class="troca" aria-hidden="true">${I.simbolo}</div>
${topo(base, atual)}
<main id="conteudo">
${corpo}
</main>
${rodape(base)}
${T.pilula('tema-lado', 'claro')}
<div class="cursor" aria-hidden="true"><span class="cursor-anel"></span><span class="cursor-ponto"></span><span class="cursor-txt"></span></div>
${dialogs}
<script type="application/json" id="dados">${JSON.stringify(dados)}</script>
<script src="assets/site.js" defer></script>
</body>
</html>
`;

const index = pagina({
  titulo: `${M.completo} | Barbearia no ${M.bairro}, ${M.cidade}`,
  descricao: `Barbearia com hora marcada no ${M.bairro}, ${M.cidade}: degradê, corte na tesoura, barba com toalha quente, barboterapia, sobrancelha e corte infantil. Agende online escolhendo o barbeiro.`,
  canon: '', base: '', atual: '', classe: 'pg-inicio',
  corpo: [capa, casa, servicos, umCorte, guia, toalha, equipePrevia, galeria, avaliacoesSec, clube, instagram, agendar, contato, combinados, duvidas, fecho()].join('\n'),
});
const equipeHtml = pagina({
  titulo: `Equipe | ${M.completo}, ${M.bairro}`,
  descricao: `Conheça os barbeiros da ${M.completo}: especialidades, dias de atendimento e serviços de cada um. Agende direto com quem você preferir.`,
  canon: 'equipe.html', base: 'index.html', atual: 'equipe.html', classe: 'pg-equipe',
  corpo: [equipePagina, fecho('index.html')].join('\n'),
});

// ---------- 404: o zero é um espelho de mão que não reflete nada ----------
const pagina404 = `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página não encontrada | ${M.completo}</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="${COR_CLARO}">
${T.head(CHAVE_TEMA)}
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
${fontes}
<style>
:root { --fundo: ${COR_CLARO}; --tinta: #15161A; --txt-2: rgba(21, 22, 26, .74); --cobre: #C2703A; --cobre-txt: #9A4F1F; --no-cobre: #15161A; --linha: rgba(21, 22, 26, .16); color-scheme: light; }
[data-tema="escuro"] { --fundo: ${COR_ESCURO}; --tinta: #F2ECE2; --txt-2: rgba(242, 236, 226, .76); --cobre: #F0AD73; --cobre-txt: #F0AD73; --no-cobre: #121214; --linha: rgba(242, 236, 226, .18); color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; min-height: 100svh; display: grid; place-items: center; padding: 32px 16px; background: var(--fundo); color: var(--tinta); font: 400 17px/1.6 'Schibsted Grotesk', 'Segoe UI', sans-serif; text-align: center; }
main { max-width: 640px; }
.logo { display: inline-flex; align-items: center; gap: 10px; color: inherit; text-decoration: none; font: 900 26px/1 'Big Shoulders Display', 'Arial Narrow', sans-serif; text-transform: uppercase; }
.logo svg { width: 34px; height: 34px; }
.logo em { font: 400 20px/1 'Yellowtail', cursive; text-transform: none; color: var(--cobre-txt); }
.num { display: flex; align-items: center; justify-content: center; gap: 2vw; margin: 28px 0 8px; font: 900 clamp(120px, 26vw, 220px)/.9 'Big Shoulders Display', 'Arial Narrow', sans-serif; }
.espelho { width: clamp(70px, 15vw, 128px); height: auto; transform-origin: 50% 90%; animation: balanca 3.2s ease-in-out infinite; }
@keyframes balanca { 0%, 100% { rotate: -8deg; } 50% { rotate: 8deg; } }
h1 { margin: 0 0 10px; font: 900 clamp(34px, 6vw, 56px)/1 'Big Shoulders Display', 'Arial Narrow', sans-serif; text-transform: uppercase; }
h1 em { font: 400 .8em/1 'Yellowtail', cursive; text-transform: none; color: var(--cobre-txt); }
p { margin: 0 auto 26px; color: var(--txt-2); max-width: 46ch; }
.btns { display: inline-grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 10px; }
.btns a { display: inline-flex; align-items: center; justify-content: center; min-height: 52px; padding: 0 22px; border: 1px solid var(--linha); border-radius: 10px; color: inherit; font-weight: 600; text-decoration: none; transition: background-color .3s, color .3s, border-color .3s; }
.btns a:first-child { background: var(--cobre); border-color: var(--cobre); color: var(--no-cobre); }
.btns a:hover { border-color: var(--cobre); }
.atalhos { display: flex; justify-content: center; gap: 22px; margin-top: 26px; font-size: 15px; }
.atalhos a { color: var(--cobre-txt); }
@media (max-width: 520px) { .btns { grid-auto-flow: row; width: 100%; } }
@media (prefers-reduced-motion: reduce) { .espelho { animation: none; } }
</style>
</head>
<body>
<main>
  <a class="logo" href="/">${I.simbolo}<span>Cobre</span><em>barbearia</em></a>
  <div class="num" aria-hidden="true"><span>4</span>${I.espelho}<span>4</span></div>
  <h1>Essa página <em>não está aqui.</em></h1>
  <p>Olhamos em todas as cadeiras e no espelho de mão. O endereço pode ter mudado ou foi digitado com uma letra a mais.</p>
  <div class="btns"><a href="/">Voltar ao início</a><a href="/#agendar">Agendar horário</a></div>
  <nav class="atalhos" aria-label="Atalhos"><a href="/equipe.html">Equipe</a><a href="/#servicos">Serviços</a><a href="${wa(`Olá, ${M.completo}! Vim pelo site.`)}" target="_blank" rel="noopener">WhatsApp</a></nav>
</main>
</body>
</html>
`;

// créditos só das fotos usadas (preenchido depois de montar as páginas)
const listaCred = creditos.filter((c) => usadas.has(c.arq)).map((c) => `<li>${esc(c.arq)}: <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.autor)}, ${esc(c.fonte)}</a></li>`).join('');
const fecha = (h) => h.replace('<ul data-creditos></ul>', `<ul data-creditos>${listaCred}</ul>`);

// ---------- grava ----------
// esvazia a pasta sem apagá-la (no Windows a pasta aberta num terminal não pode ser removida)
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
for (const nome of usadas) fs.copyFileSync(path.join(FOTOS, `${nome}.webp`), path.join(OUT, 'assets', 'img', `${nome}.webp`));
fs.copyFileSync(path.join(STD, 'img', 'mapa_batel.webp'), path.join(OUT, 'assets', 'img', 'mapa_batel.webp'));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_batel_claro.webp'), path.join(OUT, 'assets', 'img', 'mapa_batel_claro.webp'));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'assets', 'site.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
fs.writeFileSync(path.join(OUT, 'assets', 'site.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + T.js(CHAVE_TEMA, COR_CLARO, COR_ESCURO));
fs.writeFileSync(path.join(OUT, 'index.html'), fecha(index));
fs.writeFileSync(path.join(OUT, 'equipe.html'), fecha(equipeHtml));
fs.writeFileSync(path.join(OUT, '404.html'), pagina404);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${M.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${M.dominio}/</loc></url><url><loc>${M.dominio}/equipe.html</loc></url></urlset>\n`);
console.log(`ok: ${OUT} (${usadas.size} fotos)`);
