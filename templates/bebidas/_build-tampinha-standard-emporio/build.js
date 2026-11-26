// Gera o Tampinha Standard Empório em "templates/bebidas/standard/tampinha-standard-emporio/".
// Mesma loja e mesmos serviços do Tampinha Standard (catálogo, carrinho que fecha no WhatsApp, +18, kits, entrega,
// iFood e 99Food), com desenho de empório de bairro: gôndola, etiqueta de preço amarela, placas de corredor e
// ofertas do dia com contagem regressiva. Soma o padrão Standard: serviços por segmento, equipe, galeria,
// depoimentos, Instagram, agendamento, contato com LGPD, políticas, termos, privacidade, cookies e 404.
// Imagens reaproveitadas: recortes de produto do Palco e fotos de ambiente e logos do Tampinha Standard (ver content.js).
// Uso: node "templates/bebidas/_build-tampinha-standard-emporio/build.js"
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const T = require('../../_comum/tema-tampinha');

const CHAVE_TEMA = 'tampinha-emporio-tema';
const COR_CLARO = '#F3EFE4', COR_ESCURO = '#0B1E17';
const OUT = path.join(__dirname, '..', 'standard', 'tampinha-standard-emporio');
const DIR_TS = path.join(__dirname, '..', '_build-tampinha-standard', 'img');
const DIR_PALCO = path.join(__dirname, '..', '_build-tampinha-standard-palco', 'img', 'fotos');
const medidas = require(path.join(DIR_PALCO, 'medidas.json'));
const M = C.marca;

// ---------- utilidades ----------
const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const real = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');
const reais = (v) => (Number.isInteger(v) ? `R$ ${v.toLocaleString('pt-BR')}` : real(v));
const normal = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const minutos = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapaUrl = `https://www.openstreetmap.org/?mlat=${M.coordenadas[0]}&mlon=${M.coordenadas[1]}#map=17/${M.coordenadas[0]}/${M.coordenadas[1]}`;
const rotaUrl = `https://www.openstreetmap.org/directions?to=${M.coordenadas[0]}%2C${M.coordenadas[1]}`;
const instaUrl = `https://instagram.com/${M.instagram}`;
const nota = String(M.nota).replace('.', ',');
const estrelas = `<span class="estrelas" aria-hidden="true">${I.estrela.repeat(5)}</span>`;
const primeiro = (n) => n.split(' ')[0];
const iniciais = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');
const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DIAS_C = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

const todos = [...C.produtos, ...C.extras];
const porId = Object.fromEntries(todos.map((p) => [p.id, p]));
const cat = Object.fromEntries(C.categorias.map((c) => [c.id, c]));
const alc = (p) => (p.alc === undefined ? Boolean(cat[p.cat] && cat[p.cat].alc) : p.alc);
const profDe = (id) => C.equipe.find((m) => m.id === id);
const servDe = (id) => C.servicos.find((s) => s.id === id);
const fazDe = (id) => C.servicos.filter((s) => s.prof.includes(id));

// ---------- pasta de saída ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
for (const d of ['img', 'logos']) fs.mkdirSync(path.join(OUT, 'assets', d), { recursive: true });

// ---------- imagens: cada uma é copiada só se for usada ----------
const copias = new Map(); // destino em assets/ -> origem
const usa = (origem, destino) => {
  if (!fs.existsSync(origem)) throw new Error(`Imagem faltando: ${origem}`);
  copias.set(destino, origem);
  return `assets/${destino}`;
};
// foto de ambiente: "ts:nome" vem do Tampinha Standard; sem prefixo, deste modelo
const fotosUsadas = new Set();
const fotoSrc = (nome) => {
  fotosUsadas.add(nome);
  return nome.startsWith('ts:')
    ? usa(path.join(DIR_TS, 'fotos', `${nome.slice(3)}.webp`), `img/ts-${nome.slice(3)}.webp`)
    : usa(path.join(__dirname, 'img', 'fotos', `${nome}.webp`), `img/${nome}.webp`);
};
const foto = (nome, alt, { cls = '', lazy = true, attrs = '' } = {}) => `<img${cls ? ` class="${cls}"` : ''} src="${fotoSrc(nome)}" alt="${esc(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ''}${attrs}>`;
// produto: recorte do Palco; drink: foto inteira do Palco
const prodSrc = (p) => (p.amb
  ? usa(path.join(DIR_PALCO, 'ambiente', `${p.id}.webp`), `img/${p.id}.webp`)
  : usa(path.join(DIR_PALCO, 'produtos', `${p.id}.webp`), `img/p-${p.id}.webp`));
const prodImg = (p, lazy = true) => {
  const [w, h] = medidas[`${p.amb ? 'ambiente' : 'produtos'}/${p.id}`];
  return `<img src="${prodSrc(p)}" alt="${esc(`${p.nome} ${p.vol}`)}" width="${w}" height="${h}"${lazy ? ' loading="lazy" decoding="async"' : ''}>`;
};
const logoSrc = (arq) => usa(path.join(DIR_TS, 'logos', arq), `logos/${arq}`);
const logo99 = usa(path.join(DIR_PALCO, 'logos', 'logo-99food-largo.webp'), 'logos/99food.webp');
const logoIfood = logoSrc('ifood.svg');

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Rethink+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">';

// ---------- peças ----------
// etiqueta de gôndola: reais grandes e centavos em cima
const etiqueta = (v, de) => { const [r, c] = v.toFixed(2).split('.'); return `<span class="etq">${de ? `<s>de ${real(de)}</s>` : ''}<span class="etq-v"><small>R$</small>${r}<sup>,${c}</sup></span></span>`; };
const desconto = (p) => (p.de ? `<span class="flag">-${Math.round((1 - p.preco / p.de) * 100)}%</span>` : '');
const compra = (p) => `<div class="compra" data-compra="${p.id}">
            <button class="add" type="button" data-add="${p.id}" aria-label="Adicionar ${esc(p.nome)} ${esc(p.vol)} ao carrinho">${I.mais}<span>Pôr no carrinho</span></button>
            <div class="qtd" role="group" aria-label="Quantidade de ${esc(p.nome)}"><button type="button" data-menos="${p.id}" aria-label="Tirar um">${I.menos}</button><output data-qtd="${p.id}">0</output><button type="button" data-mais="${p.id}" aria-label="Pôr mais um">${I.mais}</button></div>
          </div>`;
const card = (p, cls = '', lazy = true) => `<article class="prod${p.amb ? ' prod-amb' : ''} ${cls}" data-id="${p.id}" data-cat="${p.cat}" data-busca="${esc(normal(`${p.nome} ${p.marca} ${p.vol} ${cat[p.cat] ? cat[p.cat].nome : ''}`))}"${alc(p) ? ' data-alc' : ''}>
          <div class="prod-foto">${prodImg(p, lazy)}${desconto(p)}${alc(p) ? '<span class="mais18" title="Venda só para maiores de 18 anos">+18</span>' : ''}</div>
          <div class="prod-info"><span class="prod-marca">${esc(p.marca)}</span><h3>${esc(p.nome)}</h3><span class="prod-vol">${esc(p.vol)}</span></div>
          <div class="prod-pe">${etiqueta(p.preco, p.de)}${compra(p)}</div>
        </article>`;
const cab = (titulo, texto, extra = '', id = '') => `<div class="cab rev"><div><h2${id ? ` id="${id}"` : ''}>${titulo}</h2>${texto ? `<p>${texto}</p>` : ''}</div>${extra}</div>`;
const setas = (alvo, rotulo) => `<div class="setas"><button type="button" class="seta" data-trilho-ir="-1" aria-controls="${alvo}" aria-label="${rotulo} anteriores">${I.esq}</button><button type="button" class="seta" data-trilho-ir="1" aria-controls="${alvo}" aria-label="Próximos ${rotulo}">${I.dir}</button></div>`;

// ---------- topo (todas as páginas) ----------
const topo = (pg) => {
  const b = pg === 'inicio' ? '' : 'index.html';
  const links = [[`${b}#corredores`, 'Corredores'], [`${b}#ofertas`, 'Ofertas'], [`${b}#kits`, 'Kits'], [`${b}#servicos`, 'Festas e serviços'], ['equipe.html', 'Equipe', 'equipe'], ['galeria.html', 'Galeria', 'galeria'], [`${b}#entrega`, 'Entrega'], [`${b}#contato`, 'Contato']];
  return `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo" id="topo" data-topo>
  <div class="barra-sup">
    <div class="wrap">
      <span>Entrega grátis acima de ${reais(C.entrega.gratisAcima)} na ${M.bairro} e região</span>
      <span class="status" data-status>Entregas das 10h às 23h</span>
    </div>
  </div>
  <div class="topo-meio">
    <div class="wrap">
      <a class="logo" href="index.html" aria-label="${M.completo}, início">${I.logo}</a>
      <form class="busca-topo" role="search" action="index.html#catalogo" data-busca-topo>
        <label class="sr" for="busca-topo">Procurar bebida ou marca</label>
        <span class="busca-ic">${I.busca}</span>
        <input id="busca-topo" name="busca" type="search" placeholder="Procurar cerveja, gin, gelo..." autocomplete="off">
        <button type="submit">Procurar</button>
      </form>
      <a class="topo-whats" href="${wa(`Olá, ${M.nome}! Vim pelo site.`)}" target="_blank" rel="noopener">${I.whats}<span><small>Peça no WhatsApp</small>${M.whatsappTexto}</span></a>
      <button class="carrinho-btn" type="button" data-abrir-carrinho aria-label="Abrir carrinho">${I.engradado}<b data-conta>0</b><span data-total-nav>R$ 0,00</span></button>
      <button class="menu-btn" type="button" aria-label="Abrir o menu" aria-expanded="false" aria-controls="menu">${I.menu}</button>
    </div>
  </div>
  <nav class="menu" id="menu" aria-label="Principal">
    <div class="wrap">
      ${links.map(([h, t, id]) => `<a href="${h}"${id === pg ? ' aria-current="page"' : ''}>${t}</a>`).join('\n      ')}
      <div class="menu-tema"><span>Tema do site</span>${T.pilula('deitada', 'claro')}</div>
    </div>
  </nav>
</header>
${T.pilula('tema-lado', 'claro')}`;
};

// ---------- capa: carrossel de cartazes + ofertas do dia + atendente ----------
const ofertas = C.produtos.filter((p) => p.de);
const capa = `<section class="capa" id="inicio" aria-label="Destaques do empório">
  <div class="wrap capa-grid">
    <div class="cartazes" data-cartazes aria-roledescription="carrossel" aria-label="Cartazes do empório">
      ${C.capa.map((s, k) => `<article class="cartaz${k ? '' : ' on'}" data-cartaz aria-roledescription="slide" aria-label="${k + 1} de ${C.capa.length}"${k ? ' aria-hidden="true"' : ''}>
        ${foto(s.foto, s.alt, { cls: 'cartaz-foto', lazy: k > 0, attrs: k ? '' : ' fetchpriority="high"' })}
        <div class="cartaz-txt">
          <p class="apoio">${esc(s.apoio)}</p>
          ${k ? `<h2 class="cartaz-t">${esc(s.titulo)}</h2>` : `<h1 class="cartaz-t">${esc(s.titulo)}</h1>`}
          <p>${esc(s.texto)}</p>
          <div class="cartaz-btns"><a class="btn btn-amarelo" href="${s.btn[1]}"${k ? ' tabindex="-1"' : ''}>${I.engradado}<span>${s.btn[0]}</span></a><a class="btn btn-vazado" href="${wa(`Olá, ${M.nome}! Vim pelo site.`)}" target="_blank" rel="noopener"${k ? ' tabindex="-1"' : ''}>${I.whats}<span>Chamar no WhatsApp</span></a></div>
        </div>
        <p class="cartaz-etq" aria-hidden="true"><span>${esc(s.etiqueta[0])}</span><b>${esc(s.etiqueta[1])}</b></p>
      </article>`).join('\n      ')}
      <div class="cartaz-ctrl">
        <button type="button" class="seta" data-cartaz-ir="-1" aria-label="Cartaz anterior">${I.esq}</button>
        <div class="cartaz-barras" aria-hidden="true">${C.capa.map(() => '<i><b></b></i>').join('')}</div>
        <button type="button" class="seta" data-cartaz-ir="1" aria-label="Próximo cartaz">${I.dir}</button>
      </div>
    </div>
    <a class="banner banner-oferta" href="#ofertas">
      <span class="banner-apoio">Ofertas do dia</span>
      <strong>${ofertas.length} bebidas com preço baixado até a meia-noite</strong>
      <span class="relogio-mini" aria-label="Tempo até as ofertas acabarem"><span data-conta-regressiva>--:--:--</span></span>
      <span class="banner-prods" aria-hidden="true">${ofertas.slice(0, 3).map((p) => prodImg(p, false)).join('')}</span>
    </a>
    <aside class="banner banner-atende" aria-label="Atendimento">
      ${foto('toninho', `${M.atendente}, do balcão da ${M.nome}`, { lazy: false })}
      <div>
        <b>${M.atendente}, do balcão</b>
        <p>"Mandou o pedido, eu confiro e já separo da câmara fria."</p>
        <span class="online" data-online>Respondendo agora no WhatsApp</span>
      </div>
    </aside>
  </div>
  <ul class="wrap selos">
    ${C.promessas.map(([ic, t, d]) => `<li><span class="selo-ic">${ic === 'sacola' ? `<img src="${logoIfood}" alt="" class="selo-ifood">` : I[ic]}</span><div><b>${t}</b><span>${d}</span></div></li>`).join('\n    ')}
  </ul>
</section>`;

// ---------- marcas ----------
const logos = C.marcas.map(([n, arq]) => `<button type="button" class="logo-marca" data-marca="${esc(n)}" aria-label="Ver bebidas ${esc(n)}"><img src="${logoSrc(arq)}" alt="${esc(n)}" loading="lazy"></button>`).join('');
const marcas = `<section class="marcas" aria-labelledby="marcas-t">
  <div class="wrap marcas-in">
    <h2 id="marcas-t">As marcas que você já conhece</h2>
    <div class="esteira"><div class="esteira-trilho">${logos}${logos.replace(/<button /g, '<button tabindex="-1" aria-hidden="true" ')}</div></div>
  </div>
</section>`;

// ---------- corredores (categorias) ----------
const contagem = (id) => C.produtos.filter((p) => p.cat === id).length;
const corredores = `<section class="corredores" id="corredores">
  <div class="wrap">
    ${cab('Escolha o corredor', 'Toque numa placa e a gente leva você direto para a gôndola certa.')}
    <ul class="placas">
      ${C.categorias.map((c) => `<li class="rev"${c.alc ? ' data-alc' : ''}><button type="button" class="placa" data-cat-ir="${c.id}">
        <span class="placa-nome"><b>${c.nome}</b><small>${contagem(c.id)} itens</small></span>
        <span class="placa-gondola${c.foto ? ' placa-foto' : ''}" aria-hidden="true">${c.foto ? prodImg(porId[c.foto]) : c.vitrine.map((id) => prodImg(porId[id])).join('')}</span>
      </button></li>`).join('\n      ')}
    </ul>
  </div>
</section>`;

// ---------- ofertas do dia ----------
const ofertasSec = `<section class="ofertas" id="ofertas">
  <div class="wrap">
    ${cab('Ofertas do dia', 'Preço baixado até a meia-noite, enquanto durar o estoque da câmara fria.', `<div class="ofertas-dir"><p class="relogio" aria-label="Tempo até as ofertas acabarem"><span>acaba em</span><b data-conta-regressiva data-blocos>--:--:--</b></p>${setas('trilho-ofertas', 'ofertas')}</div>`)}
    <div class="trilho" id="trilho-ofertas" data-trilho tabindex="0" aria-label="Ofertas do dia">
      ${ofertas.map((p) => card(p, 'prod-trilho')).join('\n      ')}
    </div>
    <div class="progresso" aria-hidden="true"><i data-progresso="trilho-ofertas"></i></div>
  </div>
</section>`;

// ---------- catálogo ----------
const ordenados = [...C.vitrineInicial.map((id) => porId[id]), ...C.produtos.filter((p) => !C.vitrineInicial.includes(p.id))];
const chips = [['tudo', 'Tudo'], ...C.categorias.map((c) => [c.id, c.curto || c.nome, c.alc])]
  .map(([id, nome, a]) => `<button type="button" class="chip" data-chip="${id}" aria-pressed="${id === 'tudo'}"${a ? ' data-alc' : ''}>${nome}</button>`).join('');
const catalogo = `<section class="catalogo" id="catalogo">
  <div class="wrap">
    ${cab('A gôndola inteira', 'Filtre pelo corredor ou procure pela marca. Os preços valem para o site e o WhatsApp.')}
    <div class="filtros">
      <div class="chips" data-iguais role="group" aria-label="Corredores">${chips}</div>
      <label class="busca">${I.busca}<input type="search" placeholder="Procurar bebida ou marca" aria-label="Procurar bebida ou marca" data-busca-input><button type="button" data-limpar aria-label="Limpar busca" hidden>${I.fechar}</button></label>
    </div>
    <p class="achados" data-achados aria-live="polite"></p>
    <div class="grade" data-grade>
      ${ordenados.map((p) => card(p)).join('\n      ')}
    </div>
    <div class="ver-mais"><button type="button" class="btn btn-linha" data-ver-mais>${I.mais}<span>Ver as outras bebidas</span></button></div>
    <div class="vazio" data-vazio hidden><p>Não achamos essa bebida no site, mas pode ser que tenha no estoque. Pergunte no WhatsApp: se não tiver, a gente tenta conseguir.</p><a class="btn btn-linha" href="${wa(`Olá, ${M.nome}! Vocês têm `)}" target="_blank" rel="noopener">${I.whats}<span>Perguntar no WhatsApp</span></a></div>
  </div>
</section>`;

// ---------- kits: cupom fiscal ----------
const kitTotal = (k) => k.itens.reduce((s, [id, q]) => s + porId[id].preco * q, 0);
const kitAlc = (k) => k.itens.some(([id]) => alc(porId[id]));
const kits = `<section class="kits" id="kits">
  <div class="wrap">
    ${cab('Kits prontos para não esquecer nada', 'Um toque e tudo vai para o carrinho. Dá para mudar as quantidades depois.')}
    <div class="kits-grade">
      ${C.kits.map((k) => `<article class="kit rev"${kitAlc(k) ? ' data-alc' : ''}>
        ${foto(k.foto, k.alt, { cls: 'kit-foto' })}
        <div class="cupom">
          <h3>${k.nome}</h3>
          <p>${esc(k.texto)}</p>
          <ul>${k.itens.map(([id, q]) => `<li><span>${q}x ${esc(porId[id].nome)}</span><i aria-hidden="true"></i><b>${real(porId[id].preco * q)}</b></li>`).join('')}</ul>
          <div class="cupom-pe">${etiqueta(kitTotal(k))}<button type="button" class="btn btn-verde" data-kit="${k.id}">${I.engradado}<span>Pôr o kit no carrinho</span></button></div>
        </div>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- serviços por segmento ----------
const precoServ = (s) => (s.preco ? `${s.de ? '<small>a partir de</small>' : ''}${reais(s.preco)}<small>${esc(s.unidade)}</small>` : `Sem custo<small>${s.unidade === 'sem custo' ? 'é só marcar' : esc(s.unidade)}</small>`);
const servCard = (s) => `<article class="serv rev" id="s-${s.id}">
          ${foto(s.foto, s.alt)}
          <div class="serv-txt">
            <h4>${esc(s.nome)}</h4>
            <p>${esc(s.inclui)}</p>
            <dl class="serv-dados">
              <div><dt>Duração</dt><dd>${s.id === 'chopp' ? 'até 8h de chopeira' : minutos(s.min)}</dd></div>
              ${s.pessoas ? `<div><dt>Pessoas</dt><dd>${s.pessoas[0]} a ${s.pessoas[1]}</dd></div>` : ''}
              <div><dt>Com</dt><dd>${s.prof.map((id) => esc(primeiro(profDe(id).nome))).join(' ou ')}</dd></div>
            </dl>
            ${s.sensivel ? `<p class="serv-aviso">${I.aviso}<span>Só para maiores de 18, com documento. <a href="#politicas">Ver as regras</a></span></p>` : ''}
            <div class="serv-pe"><p class="serv-preco">${precoServ(s)}</p><a class="btn btn-verde btn-p" href="#agendar" data-agendar="${s.id}">${I.calendario}<span>Agendar</span></a></div>
          </div>
        </article>`;
const servicos = `<section class="servicos" id="servicos">
  <div class="wrap">
    ${cab('Festas, entregas e empresas', 'Além do balcão, a Tampinha leva a bebida e quem serve. Tudo com duração, preço e quem cuida de você.')}
    <div class="abas" role="tablist" aria-label="Segmentos dos serviços">
      ${C.segmentos.map((g, k) => `<button type="button" role="tab" id="aba-${g.id}" aria-controls="seg-${g.id}" aria-selected="${k === 0}"${k ? ' tabindex="-1"' : ''} data-aba="${g.id}">${esc(g.nome)}</button>`).join('\n      ')}
    </div>
    ${C.segmentos.map((g, k) => `<div class="seg" role="tabpanel" id="seg-${g.id}" aria-labelledby="aba-${g.id}" tabindex="0"${k ? ' hidden' : ''}>
      <p class="seg-txt">${esc(g.texto)}</p>
      <div class="serv-grade">
        ${C.servicos.filter((s) => s.seg === g.id).map(servCard).join('\n        ')}
      </div>
    </div>`).join('\n    ')}
    <dl class="condicoes rev">
      <div><dt>Pagamento</dt><dd>${esc(C.pagamento)}</dd></div>
      <div><dt>Valores "a partir de"</dt><dd>${esc(C.aPartir)}</dd></div>
      <div><dt>Cancelamento e remarcação</dt><dd>${esc(C.cancelamento)} <a href="#politicas">Ver as políticas</a></dd></div>
    </dl>
  </div>
</section>`;

// ---------- quem somos ----------
const nos = `<section class="nos" id="nos">
  <div class="wrap nos-grid">
    <div class="nos-fotos rev">
      ${foto('prateleira', 'Prateleiras do empório cheias de garrafas', { cls: 'nos-f1' })}
      ${foto('ts:balcao', `${M.atendente} entregando um pedido no balcão`, { cls: 'nos-f2' })}
    </div>
    <div class="nos-txt rev">
      <p class="apoio">Quem somos</p>
      <h2>O empório da esquina, agora no seu celular.</h2>
      <p>A ${M.nome} abriu em ${M.desde} como uma portinha na ${M.endereco.split(',')[0]}, com uma geladeira e muita vontade de atender bem o bairro. Hoje são três câmaras frias, entregadores da casa, chopeiras para festa e o mesmo cuidado de sempre: quem pede no WhatsApp fala com a gente, não com robô.</p>
      <p>Conferimos a validade de tudo, trocamos casco de cerveja retornável e, se a bebida que você quer não estiver no site, a gente tenta conseguir.</p>
      <dl class="numeros">${C.numeros.map(([n, t]) => `<div><dt>${n}</dt><dd>${t}</dd></div>`).join('')}</dl>
    </div>
  </div>
</section>`;

// ---------- equipe e galeria (resumo no início) ----------
const equipeIni = `<section class="equipe-ini" id="equipe">
  <div class="wrap">
    ${cab('Quem atende você', 'Do balcão à chopeira, as mesmas pessoas todos os dias.', `<a class="btn btn-linha" href="equipe.html"><span>Conhecer a equipe</span>${I.seta}</a>`)}
    <div class="eq-grade">
      ${C.equipe.map((m) => `<a class="eq rev" href="equipe.html#p-${m.id}">${foto(m.foto, m.nome)}<span class="eq-txt"><b>${esc(m.nome)}</b><small>${esc(m.cargo)}</small></span></a>`).join('\n      ')}
    </div>
  </div>
</section>`;
const galeriaIni = `<section class="gal-ini">
  <div class="wrap">
    ${cab('Por dentro do empório', 'Câmara fria, balcão, festas e entregas. Toque numa foto para ampliar.', `<a class="btn btn-linha" href="galeria.html"><span>Ver a galeria</span>${I.seta}</a>`)}
    <div class="mosaico" data-galeria>
      ${['prateleira', 'open-bar', 'gin-tonica', 'chopeira-festa', 'geladeira'].map((n) => { const g = C.galeria.find((x) => x.foto === n); return `<button type="button" class="mos rev" data-foto="${fotoSrc(n)}" data-leg="${esc(g.leg)}">${foto(n, g.leg)}<span class="mos-leg">${esc(g.leg)}</span></button>`; }).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- depoimentos ----------
const depoimentos = `<section class="depo" id="avaliacoes">
  <div class="wrap">
    ${cab('Quem pediu, voltou', `<span class="nota">${estrelas}<b>${nota}</b> de média em ${M.avaliacoes.toLocaleString('pt-BR')} avaliações no Google</span>`, setas('trilho-depo', 'depoimentos'))}
    <div class="trilho trilho-depo" id="trilho-depo" data-trilho data-auto tabindex="0" aria-label="Depoimentos de clientes">
      ${C.depoimentos.map((d) => `<figure class="depo-card">
        ${I.aspas}
        <blockquote><p>${esc(d.texto)}</p></blockquote>
        <figcaption><span class="depo-ini" aria-hidden="true">${esc(iniciais(d.nome))}</span><span><b>${esc(d.nome)}</b><small>${esc(d.quando)} no Google</small></span>${estrelas}</figcaption>
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- Instagram ----------
const G = C.instagram;
const instagram = `<section class="insta" id="instagram">
  <div class="wrap insta-in">
    <div class="insta-txt rev">
      <span class="insta-ic" aria-hidden="true">${I.insta}</span>
      <h2>@${M.instagram}</h2>
      <p>${G.publicacoes} publicações e ${G.seguidores} seguidores de olho nas ofertas da semana, nos rótulos novos e nas festas que a gente serve.</p>
      <a class="btn btn-verde" href="${instaUrl}" target="_blank" rel="noopener"><span>Seguir no Instagram</span>${I.diag}</a>
    </div>
    <ul class="insta-grade" aria-label="Últimas publicações do Instagram">
      ${G.posts.map((p) => `<li class="rev"><a href="${instaUrl}" target="_blank" rel="noopener" aria-label="Publicação: ${esc(p.texto)}">${foto(p.foto, p.texto)}<span class="insta-sobre"><span>${esc(p.texto)}</span><b>${I.coracao}${p.curtidas}</b></span></a></li>`).join('\n      ')}
    </ul>
  </div>
</section>`;

// ---------- como pedir + entrega ----------
const como = `<section class="como" id="como">
  <div class="wrap">
    ${cab('Do carrinho ao WhatsApp em um minuto', '')}
    <ol class="passos">
      <li class="rev"><span class="passo-ic">${I.engradado}</span><h3>Escolha as bebidas</h3><p>Toque em "Pôr no carrinho" em cada uma. O carrinho guarda tudo, mesmo se você fechar a página.</p></li>
      <li class="rev"><span class="passo-ic">${I.balao}</span><h3>Diga como quer receber</h3><p>Entrega ou retirada no balcão, forma de pagamento e alguma observação, se tiver.</p></li>
      <li class="rev"><span class="passo-ic">${I.whats}</span><h3>Envie no WhatsApp</h3><p>O pedido abre pronto na conversa com a gente. É só mandar e aguardar a confirmação.</p></li>
    </ol>
    <div class="seguro rev">${I.cadeado}<div><b>Site 100% seguro</b><p>Conexão protegida do começo ao fim. Você não digita cartão nem senha por aqui: o pagamento é feito na entrega, por Pix, cartão ou dinheiro.</p></div></div>
  </div>
</section>`;
const dias = C.horarios.map(([d, h], i) => `<tr data-linha="${i}"><th scope="row">${d}</th><td>${h}</td></tr>`).join('');
const entrega = `<section class="entrega" id="entrega">
  <div class="wrap entrega-grid">
    <div class="entrega-info rev">
      <h2>Entrega gelada em ${C.entrega.tempo}</h2>
      <p>Nossos entregadores saem da ${M.bairro} com a bebida em bolsa térmica. Taxa de ${real(C.entrega.taxa)}, grátis a partir de ${reais(C.entrega.gratisAcima)} em compras. Também dá para retirar no balcão ou marcar o horário da entrega.</p>
      <table class="horarios"><caption>Horário de entrega</caption><tbody>${dias}</tbody></table>
    </div>
    <div class="entrega-foto rev">
      ${foto('ts:moto', 'Entregador de moto com a caixa de entregas')}
      <div class="apps">
        <h3>Prefere pedir pelo aplicativo?</h3>
        <p>Também estamos no iFood e no 99Food, com o mesmo estoque.</p>
        <div class="apps-btns" data-iguais>
          <a class="app" href="${M.ifood}" target="_blank" rel="noopener" aria-label="Pedir no iFood"><img src="${logoIfood}" alt="iFood"></a>
          <a class="app" href="${M.food99}" target="_blank" rel="noopener" aria-label="Pedir no 99Food"><img src="${logo99}" alt="99Food"></a>
        </div>
      </div>
    </div>
  </div>
</section>`;

// ---------- agendar ----------
const agendar = `<section class="agendar" id="agendar">
  <div class="wrap agendar-in">
    <div class="ag-cab rev">
      <h2>Marque o seu</h2>
      <p>Escolha o serviço, quem vai atender, o dia e o horário. Entrega e retirada confirmam na hora; festas, empresas e degustação recebem a confirmação pelo WhatsApp em até 4 horas.</p>
    </div>
    <form class="ag-form rev" data-agenda novalidate>
      <fieldset class="ag-servicos">
        <legend>Serviço</legend>
        <div class="ag-opcoes">
          ${C.servicos.map((s, k) => `<label><input type="radio" name="serv" value="${s.id}"${k === 0 ? ' checked' : ''}><span><b>${esc(s.nome)}</b><small>${s.preco ? `${s.de ? 'a partir de ' : ''}${reais(s.preco)} ${esc(s.unidade)}` : 'sem custo'}</small></span></label>`).join('\n          ')}
        </div>
      </fieldset>
      <div class="ag-linha">
        <label class="campo"><span>Quem atende</span><select name="prof" data-prof></select></label>
        <label class="campo" data-campo-pessoas><span>Pessoas</span><input type="number" name="pessoas" min="1" max="300" value="30" inputmode="numeric"></label>
      </div>
      <div class="ag-linha">
        <label class="campo"><span>Data</span><input type="date" name="data" required data-data></label>
        <div class="campo"><span id="hora-t">Horário</span><div class="ag-horas" role="radiogroup" aria-labelledby="hora-t" data-horas><p class="ag-vazio">Escolha uma data para ver os horários.</p></div></div>
      </div>
      <div class="ag-linha">
        <label class="campo"><span>Nome</span><input name="nome" autocomplete="name" required></label>
        <label class="campo"><span>WhatsApp</span><input name="tel" type="tel" autocomplete="tel" inputmode="tel" placeholder="(31) 90000-0000" required></label>
      </div>
      <label class="campo"><span>Endereço da entrega ou do evento</span><input name="end" autocomplete="street-address" placeholder="Rua, número e bairro"></label>
      <label class="campo"><span>Observações</span><textarea name="obs" rows="2" placeholder="Ocasião, marca do barril, bebidas que não podem faltar..."></textarea></label>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Concordo com o uso dos meus dados para o agendamento, conforme a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</span></label>
      <p class="form-erro" data-erro role="alert"></p>
      <button class="btn btn-verde btn-g" type="submit">${I.calendario}<span>Confirmar agendamento</span></button>
    </form>
    <aside class="ag-resumo rev" aria-live="polite" data-resumo>
      <p class="ag-resumo-t">Resumo do agendamento</p>
      <dl>
        <div><dt>Serviço</dt><dd data-r="serv"></dd></div>
        <div><dt>Com</dt><dd data-r="prof">Sem preferência</dd></div>
        <div><dt>Quando</dt><dd data-r="quando">Escolha a data</dd></div>
        <div><dt>Duração</dt><dd data-r="dur"></dd></div>
        <div class="ag-total"><dt>Estimativa</dt><dd data-r="total"></dd></div>
      </dl>
      <p class="ag-sinal" data-r="sinal" hidden></p>
      <p class="ag-obs">O valor final vem na confirmação. Pagamento por Pix, cartão ou dinheiro.</p>
    </aside>
    <div class="ag-ok" data-ok hidden tabindex="-1">
      <h3>Pedido de agendamento registrado</h3>
      <p data-ok-txt></p>
      <div class="ag-ok-btns" data-iguais><a class="btn btn-whats" data-ok-wa href="#" target="_blank" rel="noopener">${I.whats}<span>Enviar no WhatsApp</span></a><button type="button" class="btn btn-linha" data-ok-nova><span>Marcar outro</span></button></div>
    </div>
  </div>
</section>`;

// ---------- políticas, dúvidas e contato ----------
const politicas = `<section class="politicas" id="politicas">
  <div class="wrap">
    ${cab('Combinado não sai caro', 'Agendamento, atraso, cancelamento e garantia, em regras curtas para a bebida chegar certa, na hora marcada.')}
    <div class="pol-in">
      <dl class="pol-lista">
        ${C.politicas.map((p) => `<div class="rev"><dt>${esc(p.titulo)}</dt><dd>${esc(p.texto)}</dd></div>`).join('\n        ')}
      </dl>
      <aside class="pol-sensivel rev">
        <h3>${I.aviso}<span>${esc(C.sensivel.titulo)}</span></h3>
        <p>${esc(C.sensivel.texto)}</p>
        <ul>${C.sensivel.itens.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </aside>
    </div>
  </div>
</section>`;
const duvidas = `<section class="duvidas" id="duvidas">
  <div class="wrap duvidas-grid">
    <div class="cab rev"><div><h2>Ficou alguma dúvida?</h2><p>Se não estiver aqui, pergunte no WhatsApp. Quem responde é o ${M.atendente}.</p></div><a class="btn btn-linha" href="${wa(`Olá, ${M.nome}! Tenho uma dúvida.`)}" target="_blank" rel="noopener">${I.whats}<span>Perguntar</span></a></div>
    <div class="faq">${C.faq.map(([q, r]) => `<details class="rev"><summary><span>${esc(q)}</span><i aria-hidden="true">${I.mais}</i></summary><p>${esc(r)}</p></details>`).join('')}</div>
  </div>
</section>`;
const contato = `<section class="contato" id="contato">
  <div class="wrap contato-in">
    <div class="rev">
      <h2>Fale com o empório</h2>
      <p>Orçamento de festa, geladeira para a empresa, pedido grande, parceria ou só uma pergunta. Respondemos em até um dia útil.</p>
      <ul class="canais">
        <li><span>WhatsApp</span><a href="${wa(`Olá, ${M.nome}! Vim pelo site.`)}" target="_blank" rel="noopener">${M.whatsappTexto}</a></li>
        <li><span>Telefone</span><a href="tel:+55${M.telefone.replace(/\D/g, '')}">${M.telefone}</a></li>
        <li><span>E-mail</span><a href="mailto:${M.email}">${M.email}</a></li>
        <li><span>Endereço</span><span>${esc(endereco)}</span></li>
      </ul>
    </div>
    <form class="contato-form rev" data-contato novalidate>
      <div class="ag-linha">
        <label class="campo"><span>Nome</span><input name="nome" autocomplete="name" required></label>
        <label class="campo"><span>WhatsApp ou telefone</span><input name="tel" type="tel" autocomplete="tel" required></label>
      </div>
      <label class="campo"><span>E-mail</span><input name="email" type="email" autocomplete="email"></label>
      <label class="campo"><span>Assunto</span><select name="assunto"><option>Orçamento de festa</option><option>Geladeira da empresa</option><option>Pedido grande</option><option>Degustação</option><option>Parceria ou fornecedor</option><option>Outro assunto</option></select></label>
      <label class="campo"><span>Mensagem</span><textarea name="msg" rows="4" required></textarea></label>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Concordo com o uso dos meus dados para responder ao contato, conforme a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</span></label>
      <p class="form-erro" data-erro role="alert"></p>
      <button class="btn btn-verde" type="submit">${I.balao}<span>Enviar mensagem</span></button>
      <p class="form-ok" data-ok hidden>Recebemos sua mensagem. Para agilizar, abrimos também a conversa no WhatsApp.</p>
    </form>
  </div>
</section>`;

// ---------- rodapé com mapa (todas as páginas) ----------
const credOwn = JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'creditos.json'), 'utf8'));
const credTs = JSON.parse(fs.readFileSync(path.join(DIR_TS, 'creditos.json'), 'utf8'));
const rodape = (pg) => {
  const b = pg === 'inicio' ? '' : 'index.html';
  const lista = [
    ...credOwn.filter((c) => fotosUsadas.has(c.arq)).map((c) => `<li>${esc(c.arq)}: <a href="${esc(c.url)}" target="_blank" rel="noopener">Pexels</a></li>`),
    ...credTs.filter((c) => fotosUsadas.has(`ts:${c.arq}`)).map((c) => (c.fonte === 'Unsplash'
      ? `<li>${esc(c.arq)}: <a href="https://unsplash.com/photos/${c.id.split('-').slice(-1)}" target="_blank" rel="noopener">Unsplash</a></li>`
      : `<li>${esc(c.arq)}: <a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(c.arquivo.replace(/ /g, '_'))}" target="_blank" rel="noopener">${esc(c.autor || 'Wikimedia Commons')}</a>, ${esc(c.licenca || '')}</li>`)),
  ].join('');
  return `<footer class="rodape">
  <div class="wrap">
    <div class="rodape-mapa">
      <div class="map-box">
        <img src="${usa(path.join(__dirname, 'img', 'mapa_floresta_garrafa.webp'), 'img/mapa_floresta_garrafa.webp')}" alt="Mapa da ${M.bairro}, em ${M.cidade}, com a localização da ${M.completo} na Rua Pouso Alegre" width="1240" height="760" loading="lazy">
        <span class="pin" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${esc(endereco)}, CEP ${M.cep}</span><span>Todos os dias a partir das 10h</span>
          <div class="mbtns" data-iguais><a href="${mapaUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Entregamos nos bairros abaixo. Mora perto e não achou o seu? Chame no WhatsApp.</p>
        <ul class="bairros" data-iguais>${C.bairros.map((x) => `<li>${x}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="rodape-cols">
      <div class="rodape-marca"><a class="logo" href="index.html" aria-label="${M.completo}, início">${I.logo}</a><p>${esc(M.frase)}</p><div class="rodape-seguro">${I.cadeado}<span>Site 100% seguro</span></div></div>
      <div><h3>Corredores</h3><ul>${C.categorias.map((c) => `<li${c.alc ? ' data-alc' : ''}><a href="${b ? `index.html?cat=${c.id}` : ''}#catalogo" data-cat-ir="${c.id}">${c.nome}</a></li>`).join('')}</ul></div>
      <div><h3>O empório</h3><ul><li><a href="${b}#servicos">Festas e serviços</a></li><li><a href="${b}#agendar">Agendar</a></li><li><a href="equipe.html">Equipe</a></li><li><a href="galeria.html">Galeria</a></li><li><a href="${b}#politicas">Políticas</a></li><li><a href="${b}#duvidas">Dúvidas</a></li></ul></div>
      <div><h3>Fale com a gente</h3><ul><li><a href="${wa(`Olá, ${M.nome}!`)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li><li><a href="tel:+55${M.telefone.replace(/\D/g, '')}">Telefone ${M.telefone}</a></li><li><a href="mailto:${M.email}">${M.email}</a></li><li><a href="${instaUrl}" target="_blank" rel="noopener">Instagram @${M.instagram}</a></li><li><a href="${M.facebook}" target="_blank" rel="noopener">Facebook</a></li></ul></div>
    </div>
    <p class="aviso18">Beba com moderação. Venda e entrega de bebida alcoólica proibidas para menores de 18 anos. Se for dirigir, não beba. <button type="button" class="link" data-rever-idade>Rever confirmação de idade</button></p>
    <div class="legal">
      <p><b>${M.razao}</b>, CNPJ ${M.cnpj}. ${esc(endereco)}, CEP ${M.cep}.</p>
      <div class="legal-links"><button type="button" class="link" data-doc="uso">Termos de uso</button><button type="button" class="link" data-doc="privacidade">Política de privacidade</button><button type="button" class="link" data-cookies>Preferências de cookies</button></div>
      <details class="creditos"><summary>Créditos das imagens</summary><p>Fotos do Pexels e do Unsplash (uso livre) e do Wikimedia Commons. Fotos de produto e logos das marcas usados só para identificar o que a loja vende; as marcas pertencem aos seus donos.</p><ul>${lista}<li>Mapa: dados do OpenStreetMap</li></ul></details>
      <p class="legal-fim">© <span data-ano>2026</span> ${M.completo}. Marca, pessoas, preços e avaliações fictícios de demonstração.</p>
    </div>
  </div>
</footer>`;
};

// ---------- carrinho, +18, janelas legais, cookies e visor (todas as páginas) ----------
const leve = C.leveTambem.map((id) => porId[id]).map((p) => `<li class="extra"><span class="mini">${prodImg(p)}</span><div><b>${esc(p.nome)}</b><span>${esc(p.vol)} por ${real(p.preco)}</span></div>${compra(p)}</li>`).join('');
const carrinho = `<div class="barra-carrinho" data-barra hidden><button type="button" data-abrir-carrinho>${I.engradado}<span><b data-conta>0</b> itens</span><strong data-total-nav>R$ 0,00</strong><em>Ver pedido</em></button></div>
<a class="whats-flutua" href="${wa(`Olá, ${M.nome}! Vim pelo site e quero fazer um pedido.`)}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">${I.whats}<span>WhatsApp</span></a>
<div class="veu" data-veu hidden></div>
<aside class="carrinho" id="carrinho" aria-label="Seu pedido" aria-hidden="true">
  <div class="car-topo"><h2>${I.engradado}Seu pedido</h2><button type="button" class="car-fechar" data-fechar-carrinho aria-label="Fechar carrinho">${I.fechar}</button></div>
  <div class="car-corpo">
    <div class="frete" data-frete><p data-frete-txt></p><div class="frete-barra"><i data-frete-barra></i></div></div>
    <ul class="car-itens" data-itens></ul>
    <div class="car-vazio" data-car-vazio>${foto('balde-cima', '')}<p>Seu carrinho está vazio. Escolha uma bebida e toque em "Pôr no carrinho".</p><a class="btn btn-linha" href="index.html#catalogo" data-fechar-carrinho data-ir="catalogo">Ver as bebidas</a></div>
    <div class="leve"><h3>Leve também</h3><ul>${leve}</ul></div>
    <form class="pedido" data-pedido novalidate>
      <h3>Para quem e como</h3>
      <label class="campo"><span>Seu nome</span><input name="nome" type="text" autocomplete="name" required></label>
      <fieldset class="opcoes"><legend>Receber</legend><div data-iguais>
        <label><input type="radio" name="receber" value="entrega" checked><span>Entrega</span></label>
        <label><input type="radio" name="receber" value="retirada"><span>Retirar no balcão</span></label>
      </div></fieldset>
      <label class="campo" data-endereco><span>Endereço com número e bairro</span><input name="endereco" type="text" autocomplete="street-address"></label>
      <fieldset class="opcoes"><legend>Pagamento na entrega</legend><div data-iguais>
        <label><input type="radio" name="pag" value="Pix" checked><span>Pix</span></label>
        <label><input type="radio" name="pag" value="Cartão na maquininha"><span>Cartão</span></label>
        <label><input type="radio" name="pag" value="Dinheiro"><span>Dinheiro</span></label>
      </div></fieldset>
      <label class="campo" data-troco hidden><span>Troco para quanto?</span><input name="troco" type="text" inputmode="decimal" placeholder="Ex.: 100"></label>
      <label class="campo"><span>Observação</span><input name="obs" type="text" placeholder="Ex.: interfone 302, bem gelada"></label>
      <p class="form-erro" data-erro-pedido role="alert"></p>
    </form>
  </div>
  <div class="car-pe">
    <dl class="contas"><div><dt>Produtos</dt><dd data-subtotal>R$ 0,00</dd></div><div><dt>Entrega</dt><dd data-taxa>R$ 0,00</dd></div><div class="total"><dt>Total</dt><dd data-total>R$ 0,00</dd></div></dl>
    <button type="button" class="btn btn-whats btn-enviar" data-enviar>${I.whats}<span>Enviar pedido no WhatsApp</span></button>
    <p class="car-seguro">${I.cadeado}<span>Site 100% seguro. Você paga só quando receber.</span></p>
  </div>
</aside>`;

const idade = `<div class="idade" id="idade" role="dialog" aria-modal="true" aria-labelledby="idade-t" hidden>
  <div class="idade-caixa">
    ${foto('ts:brinde', '', { cls: 'idade-foto' })}
    <div class="idade-txt">
      ${I.logo}
      <h2 id="idade-t">Antes de entrar: você tem 18 anos ou mais?</h2>
      <p>Vendemos bebida alcoólica só para maiores de idade. Se ainda não tiver 18, mostramos apenas refrigerante, água, chá, suco, energético e drinks sem álcool.</p>
      <div class="idade-btns" data-iguais><button type="button" class="btn btn-verde" data-idade="sim">Tenho 18 ou mais</button><button type="button" class="btn btn-linha" data-idade="nao">Ainda não tenho</button></div>
    </div>
  </div>
</div>`;

const legal = {
  uso: ['Termos de uso', `
    <p>Estes termos valem para o site da ${M.completo}.</p>
    <h3>Pedidos e agendamentos</h3><p>O carrinho e os agendamentos do site montam uma mensagem que você envia pelo WhatsApp. O pedido só vale depois da nossa confirmação. Pedidos pelo iFood e pelo 99Food seguem também as regras de cada aplicativo.</p>
    <h3>Bebida alcoólica</h3><p>A venda de bebida alcoólica é proibida para menores de 18 anos (Lei 13.106/2015). Pedimos documento na entrega, na retirada e nos eventos, e recusamos a venda sem ele.</p>
    <h3>Preços e estoque</h3><p>Os valores do site são de referência e podem mudar. Ofertas do dia valem até a meia-noite ou enquanto durar o estoque. Se faltar um item, avisamos antes de sair para a entrega.</p>
    <h3>Chopeira e equipamentos</h3><p>Chopeira, cilindro e balcão de bar emprestados ficam sob responsabilidade de quem contrata até o recolhimento. Dano por uso errado é cobrado à parte.</p>
    <h3>Conteúdo</h3><p>Textos, marca e fotos pertencem à ${M.nome} ou aos autores indicados nos créditos. As marcas das bebidas pertencem aos seus fabricantes.</p>
    <h3>Contato</h3><p>Dúvidas sobre estes termos: ${M.email}.</p>`],
  privacidade: ['Política de privacidade', `
    <p>A ${M.completo} (${M.razao}, CNPJ ${M.cnpj}) trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
    <h3>O que coletamos</h3><p>Nome, telefone, e-mail, endereço de entrega ou do evento e os detalhes do pedido ou do agendamento que você informar.</p>
    <h3>Para que usamos</h3><p>Para confirmar e entregar pedidos, organizar agendamentos, responder contatos e, só se você pedir, mandar as ofertas da semana.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins de publicidade. Os dados passam apenas pelo WhatsApp, pelo provedor do site e, nos pedidos por aplicativo, pelo próprio aplicativo.</p>
    <h3>Cookies e armazenamento</h3><p>O site guarda no seu navegador a escolha sobre cookies, a confirmação de idade, o tema claro ou escuro, o carrinho e, nesta demonstração, os agendamentos e contatos enviados. A medição de visitas só liga com "Aceitar todos". Não usamos cookies de publicidade.</p>
    <h3>Seus direitos</h3><p>Você pode pedir para ver, corrigir ou apagar seus dados a qualquer momento por ${M.email}.</p>
    <h3>Por quanto tempo</h3><p>Dados de pedidos e agendamentos ficam por 12 meses. Contatos sem resposta são apagados em 6 meses.</p>`],
};
const janelas = `${idade}
${Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-in">
    <header><h2 id="doc-${id}-t">${t}</h2><button type="button" class="doc-x" data-fecha aria-label="Fechar">${I.fechar}</button></header>
    <div class="doc-corpo">${corpo}</div>
    <p class="doc-pe">Atualizado em novembro de 2026.</p>
  </div>
</dialog>`).join('\n')}
<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Guardamos no navegador o carrinho, o tema e as suas escolhas. A medição de visitas só liga se você aceitar. <button type="button" class="link" data-doc="privacidade">Saiba mais</button></p>
  <div class="ck-btns" data-iguais><button type="button" class="btn btn-verde btn-p" data-ck="todos">Aceitar todos</button><button type="button" class="btn btn-linha btn-p" data-ck="essenciais">Só os essenciais</button></div>
</div>
<div class="visor" data-visor hidden role="dialog" aria-modal="true" aria-label="Foto ampliada">
  <button type="button" class="visor-x" data-visor-fecha aria-label="Fechar">${I.fechar}</button>
  <button type="button" class="visor-seta" data-visor-ir="-1" aria-label="Foto anterior">${I.esq}</button>
  <figure><img alt="" data-visor-img><figcaption data-visor-leg></figcaption></figure>
  <button type="button" class="visor-seta" data-visor-ir="1" aria-label="Próxima foto">${I.dir}</button>
</div>
<p class="toast" data-toast role="status" aria-live="polite"></p>`;

// ---------- página da equipe ----------
const pgCab = (titulo, texto) => `<section class="pg-cab">
  <div class="wrap"><p class="apoio"><a href="index.html">Início</a></p><h1>${titulo}</h1><p>${texto}</p></div>
</section>`;
const pgEquipe = `${pgCab('A equipe do empório', 'Seis pessoas no balcão, na chopeira, no bar e nas entregas. Veja a escala da semana e marque com quem você prefere.')}
<section class="membros">
  <div class="wrap">
    ${C.equipe.map((m, k) => `<article class="membro${k % 2 ? ' inverte' : ''}" id="p-${m.id}">
      <figure class="membro-foto rev">${foto(m.foto, `${m.nome}, ${m.cargo.toLowerCase()}`, { lazy: k > 1 })}</figure>
      <div class="membro-txt rev">
        <p class="apoio">${esc(m.cargo)}</p>
        <h2>${esc(m.nome)}</h2>
        <p>${esc(m.bio)}</p>
        <dl class="membro-dados">
          <div><dt>Especialidade</dt><dd>${esc(m.esp)}</dd></div>
          <div><dt>No ramo</dt><dd>${m.anos} anos</dd></div>
          <div><dt>Atende em</dt><dd>${fazDe(m.id).map((s) => esc(s.nome)).join(', ')}</dd></div>
        </dl>
        <div class="escala-rola"><table class="escala"><caption>Escala da semana</caption><tr>${[1, 2, 3, 4, 5, 6, 0].map((d) => `<th scope="col">${DIAS_C[d]}</th>`).join('')}</tr><tr>${[1, 2, 3, 4, 5, 6, 0].map((d) => (m.dias[d] ? `<td>${esc(m.dias[d])}</td>` : '<td class="folga">folga</td>')).join('')}</tr></table></div>
        <a class="btn btn-verde" href="index.html?serv=${fazDe(m.id)[0].id}&amp;prof=${m.id}#agendar">${I.calendario}<span>Agendar com ${esc(primeiro(m.nome))}</span></a>
      </div>
    </article>`).join('\n    ')}
  </div>
</section>
<section class="junte">
  <div class="wrap junte-in rev">
    ${foto('balcao-avental', 'Balcão do empório com atendente de avental')}
    <div><h2>Quer trabalhar no empório?</h2><p>Abrimos vagas para balcão, entregas e eventos algumas vezes por ano. Mande uma mensagem contando onde já trabalhou.</p><a class="btn btn-linha" href="${wa('Olá! Vim pelo site e quero enviar meu currículo para a Tampinha.')}" target="_blank" rel="noopener">${I.whats}<span>Enviar currículo</span></a></div>
  </div>
</section>`;

// ---------- página da galeria ----------
const pgGaleria = `${pgCab('Galeria do empório', 'A câmara fria, o balcão, as festas que a gente serve, os drinks e as entregas. Toque numa foto para ampliar.')}
<section class="galeria">
  <div class="wrap">
    <div class="chips" role="group" aria-label="Filtrar por categoria" data-iguais>
      <button type="button" class="chip" aria-pressed="true" data-gal="todas">Todas</button>
      ${C.galeriaCats.map(([id, n]) => `<button type="button" class="chip" aria-pressed="false" data-gal="${id}">${n}</button>`).join('\n      ')}
    </div>
    <div class="gal-grade" data-galeria>
      ${C.galeria.map((g, k) => `<button type="button" class="gal-item${k % 4 === 0 ? ' alto' : ''}" data-cat="${g.cat}" data-foto="${fotoSrc(g.foto)}" data-leg="${esc(g.leg)}">${foto(g.foto, g.leg, { lazy: k > 3 })}<span class="gal-leg">${esc(g.leg)}<small>${C.galeriaCats.find((c) => c[0] === g.cat)[1]}</small></span></button>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- dados para o navegador ----------
const dados = {
  nome: M.nome, whatsapp: M.whatsapp, abertura: C.abertura, entrega: C.entrega,
  produtos: Object.fromEntries(todos.map((p) => [p.id, { n: `${p.nome} ${p.vol}`, p: p.preco, i: prodSrc(p), c: p.cat, a: alc(p) ? 1 : 0 }])),
  kits: Object.fromEntries(C.kits.map((k) => [k.id, k.itens])),
  servicos: C.servicos.map(({ id, nome, min, preco, de, unidade, pessoas, prof, sinal, antecedencia, turnos }) => ({ id, nome, min, preco, de, unidade, pessoas, prof, sinal, antecedencia, turnos })),
  equipe: C.equipe.map(({ id, nome, cargo }) => ({ id, nome, cargo })),
};

// ---------- montagem ----------
const ld = {
  '@context': 'https://schema.org', '@type': 'LiquorStore', name: M.completo, telephone: M.telefone, email: M.email,
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: M.coordenadas[0], longitude: M.coordenadas[1] },
  openingHours: ['Mo-Th 10:00-23:00', 'Fr-Sa 10:00-01:00', 'Su 10:00-22:00'],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: M.nota, reviewCount: M.avaliacoes },
};
const cabeca = (titulo, descricao) => `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<meta name="robots" content="noindex">
<meta name="theme-color" content="${COR_CLARO}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:image" content="assets/img/ts-capa.webp">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${T.head(CHAVE_TEMA)}
<script>document.documentElement.classList.add("js");try{if(localStorage.getItem("tampinha-emporio-idade")==='"nao"')document.documentElement.classList.add("sem-alcool")}catch(e){}</script>
${fontes}`;
const paginas = [];
const pagina = ({ arquivo, pg, titulo, descricao, corpo }) => paginas.push({ arquivo, html: () => `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
${cabeca(titulo, descricao)}
<link rel="stylesheet" href="assets/style.css">
${pg === 'inicio' ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ''}
</head>
<body data-pg="${pg}">
${topo(pg)}
<main id="conteudo">
${corpo}
</main>
${rodape(pg)}
${carrinho}
${janelas}
<script>window.TAMPINHA=${JSON.stringify(dados)};</script>
<script src="assets/app.js" defer></script>
</body>
</html>
` });

pagina({ arquivo: 'index.html', pg: 'inicio', titulo: `${M.completo} | Empório de bebidas na ${M.bairro}, BH`, descricao: `Empório de bebidas na ${M.bairro}, BH: cerveja, refri, energético, destilado, drinks e gelo com entrega. Monte o carrinho e peça pelo WhatsApp. Chopp para festa, open bar e entrega com hora marcada.`, corpo: [capa, marcas, corredores, ofertasSec, catalogo, kits, servicos, nos, equipeIni, galeriaIni, depoimentos, instagram, como, entrega, agendar, politicas, duvidas, contato].join('\n') });
pagina({ arquivo: 'equipe.html', pg: 'equipe', titulo: `Equipe | ${M.completo}`, descricao: 'Conheça quem atende no balcão, na chopeira, no bar de eventos e nas entregas da Tampinha.', corpo: pgEquipe });
pagina({ arquivo: 'galeria.html', pg: 'galeria', titulo: `Galeria | ${M.completo}`, descricao: 'Fotos do empório, da câmara fria, das festas, dos drinks e das entregas da Tampinha.', corpo: pgGaleria });
for (const p of paginas) fs.writeFileSync(path.join(OUT, p.arquivo), p.html());

// ---------- 404: arquivo único com o CSS dentro ----------
// O zero do "404" é uma tampinha coroa caída que rola de um lado para o outro da gôndola.
const tampa404 = I.favicon.replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">', '<svg class="z" viewBox="0 0 48 48" aria-hidden="true">');
const css404 = `:root{--papel:#F3EFE4;--tinta:#10372B;--texto:#2F4A40;--verde:#17533F;--etq:#F5C518;--borda:rgba(16,55,43,.18);color-scheme:light}
:root[data-tema="escuro"]{--papel:#0B1E17;--tinta:#F1ECDD;--texto:#C9D0C6;--verde:#2B8A68;--borda:rgba(241,236,221,.18);color-scheme:dark}
*{box-sizing:border-box;margin:0}
body{min-height:100vh;min-height:100svh;display:grid;place-items:center;padding:32px 16px;background:var(--papel);color:var(--texto);font:400 17px/1.6 'Rethink Sans','Helvetica Neue',Arial,sans-serif;overflow-x:hidden}
.c404{width:min(680px,100%);display:grid;justify-items:center;gap:16px;text-align:center}
.logo{color:var(--tinta);display:block;width:190px}.logo svg{width:100%;height:auto;display:block}
.logo-nome{font-family:'Barlow Condensed',Impact,sans-serif;font-weight:800}.logo-sub{font-family:'Rethink Sans',Arial,sans-serif;font-weight:600}
.num{display:flex;align-items:flex-end;gap:clamp(6px,2vw,14px);margin-top:12px;font:800 clamp(110px,26vw,210px)/.8 'Barlow Condensed',Impact,sans-serif;color:var(--tinta)}
.z{width:.74em;height:.74em;margin-bottom:.03em;animation:rola 3.2s cubic-bezier(.45,0,.3,1) infinite alternate}
@keyframes rola{from{transform:translateX(-14%) rotate(-140deg)}to{transform:translateX(14%) rotate(140deg)}}
.gondola{width:min(420px,90%);height:10px;border-radius:3px;background:var(--verde);box-shadow:0 8px 0 -3px var(--borda)}
h1{font:800 clamp(2rem,6vw,3.2rem)/1 'Barlow Condensed',Impact,sans-serif;text-transform:uppercase;color:var(--tinta);text-wrap:balance}
.txt{max-width:44ch;text-wrap:pretty}
.btns{display:inline-grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:10px;margin-top:6px}
.btn{display:inline-flex;align-items:center;justify-content:center;height:52px;padding:0 24px;border-radius:8px;font:700 18px/1 'Barlow Condensed',Impact,sans-serif;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;white-space:nowrap;transition:transform .2s}
.b1{background:var(--etq);color:#1A1A12}.b2{color:var(--tinta);box-shadow:inset 0 0 0 2px var(--tinta)}
.btn:hover{transform:translateY(-2px)}
.rodape{font-size:.94rem}.rodape a{color:var(--tinta);font-weight:600;text-underline-offset:3px}
:focus-visible{outline:3px solid var(--etq);outline-offset:3px}
@media (max-width:520px){.btns{grid-auto-flow:row;width:100%}}
@media (prefers-reduced-motion:reduce){.z{animation:none}}`;
fs.writeFileSync(path.join(OUT, '404.html'), `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página não encontrada | ${M.completo}</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="${COR_CLARO}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
${T.head(CHAVE_TEMA)}
${fontes}
<style>${css404}</style>
</head>
<body>
<main class="c404">
  <a class="logo" href="/" aria-label="${M.completo}, início">${I.logo}</a>
  <p class="num" aria-label="404"><span>4</span>${tampa404}<span>4</span></p>
  <span class="gondola" aria-hidden="true"></span>
  <h1>Essa prateleira está vazia</h1>
  <p class="txt">O endereço que você procurou saiu da gôndola ou mudou de corredor. A câmara fria continua cheia: volte ao início ou veja as ofertas do dia.</p>
  <div class="btns"><a class="btn b1" href="/">Voltar ao início</a><a class="btn b2" href="/#ofertas">Ver as ofertas</a></div>
  <p class="rodape">Com sede agora? <a href="https://wa.me/${M.whatsapp}" target="_blank" rel="noopener">Peça pelo WhatsApp</a>.</p>
</main>
</body>
</html>
`);

// ---------- arquivos de apoio ----------
for (const [destino, origem] of copias) fs.copyFileSync(origem, path.join(OUT, 'assets', destino));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'assets', 'style.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
fs.writeFileSync(path.join(OUT, 'assets', 'app.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + T.js(CHAVE_TEMA, COR_CLARO, COR_ESCURO));
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(`ok: ${path.relative(process.cwd(), OUT)} (${copias.size} imagens)`);
