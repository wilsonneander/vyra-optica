// Gera o Taioba Standard (bar e cozinha mineira fictícia: carnes à parte, porções e drinks) em
// templates/restaurante/standard/taioba-standard/.
// Desenho escuro com folhas de taioba desfocadas flutuando, cartões arredondados e botões verdes com brilho.
// Início: capa com foto da varanda, semana no Taioba (carrossel de cartões altos), eventos, a casa, banner do
// cardápio com celular, cardápio completo por segmento, experiências, equipe, galeria, Instagram, avaliações,
// encomendas, reserva, políticas, dúvidas e contato. Mais as páginas da equipe e da galeria e a Área do cliente.
// Uso: node templates/restaurante/_build-taioba-standard/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const T = require('../../_comum/tema-pilula');

const CHAVE_TEMA = 'taioba-tema';
const COR_CLARO = '#F2EEE6', COR_ESCURO = '#141312';
const OUT = path.join(__dirname, '..', 'standard', 'taioba-standard');
const IMG = path.join(__dirname, 'img');
const M = C.marca;

// ---------- utilidades ----------
const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const reais = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
const minutos = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
const hora = (h) => (h === 24 ? 'meia-noite' : `${Math.floor(h % 24)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`);
const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DIAS_C = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const textoDia = (d) => (d.turnos.length ? d.turnos.map(([a, b]) => `${hora(a)} ${b === 24 ? 'à' : 'às'} ${hora(b)}`).join(' e ') : 'Fechado');
const horarioCurto = () => {
  const grupos = [];
  for (let i = 1; i <= 7; i++) {
    const k = i % 7, d = C.horario[k];
    if (!d.turnos.length) continue;
    const t = textoDia(d), ult = grupos[grupos.length - 1];
    if (ult && ult.t === t) ult.dias.push(k); else grupos.push({ t, dias: [k] });
  }
  return grupos.map((g) => {
    const n = g.dias.map((k) => DIAS_C[k]);
    const dias = n.length === 1 ? n[0] : n.length === 2 ? `${n[0]} e ${n[1]}` : `${n[0]} a ${n[n.length - 1]}`;
    return `${dias[0].toUpperCase()}${dias.slice(1)}, ${g.t}`;
  }).join('. ');
};

// ---------- fotos usadas (copiadas para assets/img) ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
const usadas = new Set();
const src = (nome) => { if (!fs.existsSync(path.join(IMG, `${nome}.webp`))) console.warn('Foto faltando:', nome); usadas.add(nome); return `assets/img/${nome}.webp`; };
const foto = (nome, { cls = '', lazy = true, alt, attrs = '' } = {}) => `<img${cls ? ` class="${cls}"` : ''} src="${src(nome)}" alt="${esc(alt ?? C.fotos[nome] ?? '')}"${lazy ? ' loading="lazy" decoding="async"' : ''}${attrs}>`;

const wa = (msg) => `https://wa.me/55${M.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapaUrl = `https://www.openstreetmap.org/?mlat=${M.coordenadas[0]}&mlon=${M.coordenadas[1]}#map=17/${M.coordenadas[0]}/${M.coordenadas[1]}`;
const rotaUrl = `https://www.openstreetmap.org/directions?to=${M.coordenadas[0]}%2C${M.coordenadas[1]}`;
const instaUrl = `https://instagram.com/${M.instagram}`;
const nota = String(M.nota).replace('.', ',');
const estrelas = `<span class="estrelas" aria-hidden="true">${I.estrela.repeat(5)}</span>`;
const anf = (id) => C.equipe.find((m) => m.id === id);
const primeiro = (n) => n.split(' ')[0];
const iniciais = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Literata:ital,opsz,wght@1,7..72,400;1,7..72,500&display=swap" rel="stylesheet">';

// folhas de taioba desfocadas que flutuam (decorativas). Cada uma: [x%, y%, tamanho px, giro, desfoque px, velocidade]
const folhas = (lista) => `<div class="folhas" aria-hidden="true">${lista.map(([x, y, t, r, b, v], k) => `<span class="fl" style="--x:${x}%;--y:${y}%;--t:${t}px;--r:${r}deg;--b:${b}px;--v:${v};--k:${k}">${I.folha('var(--folha-cor)', 'var(--folha-nerv)')}</span>`).join('')}</div>`;

// ---------- topo ----------
const nav = (pg) => {
  const b = pg === 'inicio' ? '' : 'index.html';
  return [[`${b}#inicio`, 'Início', 'inicio'], [`${b}#semana`, 'Semana', 'semana'], [`${b}#cardapio`, 'Cardápio', 'cardapio'], [`${b}#eventos`, 'Eventos', 'eventos'], ['equipe.html', 'Equipe', 'equipe'], ['galeria.html', 'Galeria', 'galeria']];
};
const topo = (pg) => `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo" data-topo>
  <div class="topo-in">
    <a class="logo" href="index.html" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="menu" id="menu" aria-label="Principal">
      ${nav(pg).map(([h, t, id]) => `<a href="${h}"${id === pg ? ' aria-current="page"' : ''}>${t}</a>`).join('\n      ')}
      <a class="menu-cliente" href="cliente.html" data-link-conta>${I.pessoa}<span data-nome-conta>Área do cliente</span></a>
      <div class="menu-tema"><span>Tema</span>${T.pilula('deitada', 'escuro')}</div>
    </nav>
    <div class="topo-acoes">
      <a class="topo-cliente" href="cliente.html" data-link-conta aria-label="Área do cliente" title="Área do cliente">${I.pessoa}<span data-nome-conta>Área do cliente</span></a>
      <a class="btn btn-verde btn-p" href="${pg === 'inicio' ? '' : 'index.html'}#reservar"><span>Reservar<span class="so-largo"> online</span></span>${I.diag}</a>
      <button class="menu-btn" type="button" aria-controls="menu" aria-expanded="false" aria-label="Abrir o menu">${I.menu}</button>
    </div>
  </div>
</header>
${T.pilula('tema-lado', 'escuro')}`;

// ---------- capa ----------
const capa = `<section class="capa" id="inicio">
  <figure class="capa-foto">${foto('capa-salao-noite', { lazy: false, attrs: ' fetchpriority="high"' })}</figure>
  ${folhas([[3, 18, 110, -30, 6, 0.25], [86, 62, 150, 40, 8, 0.4], [92, 14, 70, 120, 3, 0.15], [10, 78, 90, 200, 5, 0.35]])}
  <div class="capa-in">
    <p class="capa-status" data-status>${esc(horarioCurto())}</p>
    <p class="apoio">Bem-vindo ao Taioba</p>
    <h1>Carne à parte, porção no meio da mesa e drink gelado na mão.</h1>
    <p class="capa-lead">Bar e cozinha mineira em ${M.bairro}, Belo Horizonte. Arroz, feijão, farofa, mandioca e batata para dividir, carnes na brasa e caipirinha de limão-cravo, numa varanda cheia de planta.</p>
    <div class="capa-btns" data-iguais><a class="btn btn-verde" href="#reservar"><span>Reservar online</span>${I.diag}</a><a class="btn btn-vidro" href="${wa('Olá! Vim pelo site e quero reservar uma mesa no Taioba.')}" target="_blank" rel="noopener">${I.whats}<span>Reservar pelo WhatsApp</span></a></div>
    <a class="capa-nota" href="#avaliacoes">${estrelas}<b>${nota}</b><span>${M.avaliacoes.toLocaleString('pt-BR')} avaliações no Google</span></a>
  </div>
</section>`;

// ---------- semana no Taioba: carrossel de cartões altos ----------
const semana = `<section class="semana" id="semana">
  <div class="largo">
    <div class="sec-topo rev">
      <div><span class="sec-ic" aria-hidden="true">${I.calendario}</span><h2>Semana no Taioba</h2></div>
      <div class="setas"><button type="button" class="seta" data-trilho-ir="-1" aria-controls="semana-trilho" aria-label="Anterior">${I.esquerda}</button><button type="button" class="seta" data-trilho-ir="1" aria-controls="semana-trilho" aria-label="Próximo">${I.direita}</button></div>
    </div>
  </div>
  <div class="trilho" id="semana-trilho" data-trilho-car tabindex="0" aria-label="Programação da semana" aria-roledescription="carrossel">
    ${C.semana.map((s) => `<article class="dia" data-dia-semana="${DIAS.indexOf(s.dia)}">
      ${foto(s.foto, { lazy: false, attrs: ' decoding="async"' })}
      <div class="dia-txt">
        <p class="dia-nome">${esc(s.dia)}<em class="dia-hoje">hoje</em></p>
        <h3>${esc(s.titulo)} <i>${esc(s.destaque)}</i></h3>
        <p>${esc(s.texto)}</p>
        <a class="btn btn-mini" href="#reservar" data-reservar="${s.exp}"><span>Reservar</span>${I.diag}</a>
      </div>
    </article>`).join('\n    ')}
  </div>
</section>`;

// ---------- eventos ----------
const eventos = `<section class="eventos" id="eventos">
  ${folhas([[2, 70, 120, 20, 7, 0.3], [94, 8, 80, -60, 4, 0.2]])}
  <div class="largo eventos-in">
    <div class="ev-txt rev">
      <p class="apoio">Eventos</p>
      <h2>Faça sua festa<br>com a gente</h2>
      <a class="btn btn-vidro" href="#reservar" data-reservar="evento"><span>Montar meu evento</span>${I.diag}</a>
    </div>
    <div class="ev-lado rev">
      <div class="mini" data-mini aria-roledescription="carrossel" aria-label="Fotos de eventos">
        <div class="mini-trilho">${C.eventosFotos.map((n, k) => `<figure class="mini-slide${k ? '' : ' ativo'}">${foto(n)}</figure>`).join('')}</div>
        <div class="mini-pontos" role="tablist" aria-label="Escolher foto">${C.eventosFotos.map((n, k) => `<button type="button" role="tab" aria-selected="${!k}" aria-label="Foto ${k + 1}" data-mini-ir="${k}"></button>`).join('')}</div>
      </div>
      <p>Aniversários, confraternizações de empresa e casamentos pequenos, de 25 a 80 pessoas, com porções sem parar, carnes na brasa e drinks da casa.</p>
    </div>
  </div>
</section>`;

// ---------- a casa ----------
const casa = `<section class="casa" id="casa">
  <div class="largo casa-in">
    <div class="casa-txt rev">
      <p class="apoio">A casa</p>
      <h2>Um sobrado de 1952 com cara de quintal de vó, no meio de Santa Tereza.</h2>
      <p>O Taioba nasceu no bairro mais boêmio de Belo Horizonte, num sobrado com varanda para a horta. A ideia sempre foi simples: a mesa inteira dividindo panelinha de arroz, feijão e farofa, a carne chegando à parte na tábua e um drink gelado do lado.</p>
      <p>A mandioca é frita só depois do pedido, a farinha da farofa é torrada toda manhã e a costela passa doze horas na brasa. As caipirinhas usam o limão-cravo que nasce no pé da varanda.</p>
      <div class="numeros">
        ${C.numeros.map(([v, t]) => `<p><b data-conta="${v}">${v}</b><span>${esc(t)}</span></p>`).join('\n        ')}
      </div>
    </div>
    <figure class="casa-foto rev">${foto('varanda')}<figcaption>A varanda da horta, aberta de terça a domingo</figcaption></figure>
  </div>
</section>`;

// ---------- banner do cardápio com celular ----------
const vitrinePratos = ['batata', 'mandioca', 'caipirinha', 'tropeiro', 'picanha', 'arroz', 'farofa'].map((id) => C.pratos.find((p) => p.id === id));
const cardFlut = (p, cls) => `<div class="flut ${cls}" aria-hidden="true"><span><b>${esc(p.nome)}</b><small>${esc(p.peso)}</small><em>${reais(p.preco)}</em></span>${foto(p.foto, { alt: '' })}</div>`;
const bannerCardapio = `<section class="banner-cardapio" aria-labelledby="banner-t">
  <div class="largo">
    <div class="bc-moldura rev">
      <div class="bc-in">
        <div class="bc-celular" aria-hidden="true">
          <div class="cel">
            <div class="cel-topo"><span class="cel-logo">${I.folha('var(--verde)', '#fff')}</span><b>Taioba</b><small>Cardápio</small></div>
            <div class="cel-abas"><span>Carnes</span><span class="on">Porções</span><span>Drinks</span></div>
            ${vitrinePratos.slice(3).map((p) => `<div class="cel-item"><span><b>${esc(p.nome)}</b><small>${esc(p.peso)}</small><em>${reais(p.preco)}</em></span>${p.foto ? foto(p.foto, { alt: '' }) : '<i></i>'}</div>`).join('')}
          </div>
          ${cardFlut(vitrinePratos[0], 'f1')}${cardFlut(vitrinePratos[1], 'f2')}${cardFlut(vitrinePratos[2], 'f3')}
        </div>
        <div class="bc-txt">
          <h2 id="banner-t">Nosso cardápio</h2>
          <p>Carnes servidas à parte e porções de arroz, feijão, farofa, mandioca e batata para a mesa montar do seu jeito. Para beber, caipirinhas de limão-cravo e drinks com cachaça de alambique.</p>
          <a class="btn btn-verde" href="#cardapio-completo"><span>Ver cardápio completo</span>${I.diag}</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

// ---------- cardápio completo por segmento ----------
const tags = (t = []) => (t.length ? `<p class="pr-tags">${t.map((x) => `<span class="tag tag-${x}">${x === 'veg' || x === 'vegano' ? I.broto : ''}${C.tagsNome[x]}</span>`).join('')}</p>` : '');
const prato = (p) => `<article class="pr${p.foto ? ' pr-foto' : ''}${p.destaque ? ' pr-destaque' : ''}" id="p-${p.id}">
          ${p.foto ? `<figure>${foto(p.foto)}</figure>` : ''}
          <div class="pr-txt">
            <p class="pr-peso">${esc(p.peso)}${p.destaque ? '<b>da casa</b>' : ''}</p>
            <h4>${esc(p.nome)}</h4>
            <p>${esc(p.inclui)}</p>
            ${tags(p.tags)}
            <div class="pr-pe">
              <span class="pr-meta"><span>${I.pessoas}Serve ${esc(p.serve)}</span><span>${I.relogio}${minutos(p.min)}</span></span>
              <b class="pr-preco">${p.de ? '<small>a partir de</small>' : ''}${reais(p.preco)}</b>
            </div>
          </div>
        </article>`;
const cardapio = `<section class="cardapio" id="cardapio-completo">
  <span id="cardapio" class="ancora" aria-hidden="true"></span>
  <div class="largo">
    <div class="sec-cab rev">
      <div><p class="apoio">Cardápio completo</p><h2>Monte a sua mesa</h2></div>
      <p>Escolha a carne, que vem à parte, e as porções para acompanhar. Cada panelinha serve duas pessoas com folga. O tempo é o de preparo depois do pedido.</p>
    </div>
    <div class="abas" role="tablist" aria-label="Segmentos do cardápio" data-abas>
      ${C.segmentos.map((g, k) => `<button type="button" role="tab" id="aba-${g.id}" aria-controls="seg-${g.id}" aria-selected="${k === 0}" data-aba="${g.id}">${esc(g.nome)}</button>`).join('\n      ')}
    </div>
    ${C.segmentos.map((g, k) => { const lista = C.pratos.filter((p) => p.seg === g.id); return `<div class="seg" role="tabpanel" id="seg-${g.id}" aria-labelledby="aba-${g.id}" tabindex="0"${k ? ' hidden' : ''}>
      <header class="seg-cab">
        <figure>${foto(g.foto)}</figure>
        <div><h3>${esc(g.nome)}</h3><p>${esc(g.texto)}</p><span>${lista.length} opções</span></div>
      </header>
      <div class="pr-grade">
        ${lista.map(prato).join('\n        ')}
      </div>
    </div>`; }).join('\n    ')}
    <p class="cardapio-pe">Prato kids, sobremesas da semana e a carta completa de cachaças estão no cardápio impresso. <a href="${wa('Olá! Vim pelo site e queria receber o cardápio completo do Taioba.')}" target="_blank" rel="noopener">Pedir o cardápio completo no WhatsApp</a></p>
  </div>
</section>`;

// ---------- experiências ----------
const expCard = (e) => `<article class="exp${e.destaque ? ' exp-destaque' : ''} rev" id="e-${e.id}">
        <figure class="exp-foto">${foto(e.foto)}</figure>
        <div class="exp-txt">
          <h3>${esc(e.nome)}</h3>
          <p>${esc(e.inclui)}</p>
          <dl class="exp-dados">
            <div><dt>Duração</dt><dd>${minutos(e.min)}</dd></div>
            <div><dt>Com</dt><dd>${e.anf.map((id) => esc(primeiro(anf(id).nome))).join(' e ')}</dd></div>
            <div><dt>Onde</dt><dd>${e.ambientes.map((a) => esc(C.ambientes[a])).join(' ou ')}</dd></div>
          </dl>
          ${e.sensivel ? '<p class="exp-aviso">Restrições alimentares com 48 horas de antecedência</p>' : ''}
          <div class="exp-pe">
            <b class="exp-preco">${e.preco ? `${e.de ? '<small>a partir de</small>' : ''}${reais(e.preco)}<small>por pessoa</small>` : 'Sem custo<small>para reservar</small>'}</b>
            <a class="btn btn-verde btn-p" href="#reservar" data-reservar="${e.id}"><span>Reservar</span>${I.diag}</a>
          </div>
          ${e.sinal ? '<p class="exp-sinal">Sinal de 30% por Pix para confirmar</p>' : ''}
        </div>
      </article>`;
const experiencias = `<section class="experiencias" id="experiencias">
  <div class="largo">
    <div class="sec-cab rev">
      <div><p class="apoio">Para reservar</p><h2>Mesas, happy hour e festas</h2></div>
      <p>Cada formato tem duração, preço por pessoa e quem recebe você. As condições de pagamento e cancelamento estão logo abaixo.</p>
    </div>
    <div class="exp-grade">
      ${C.experiencias.map(expCard).join('\n      ')}
    </div>
    <dl class="condicoes rev">
      <div><dt>Pagamento</dt><dd>${esc(C.pagamento)}</dd></div>
      <div><dt>Valores "a partir de"</dt><dd>${esc(C.aPartir)}</dd></div>
      <div><dt>Cancelamento e remarcação</dt><dd>Sem custo até 2 horas antes; eventos privativos, até 7 dias antes. <a href="#politicas">Ver todas as políticas</a></dd></div>
    </dl>
  </div>
</section>`;

// ---------- equipe (início) ----------
const equipeInicio = `<section class="equipe-ini" id="equipe">
  <div class="largo">
    <div class="sec-cab rev">
      <div><p class="apoio">Quem faz o Taioba</p><h2>Da brasa ao balcão do bar</h2></div>
      <a class="btn btn-vidro" href="equipe.html"><span>Conhecer a equipe</span>${I.diag}</a>
    </div>
    <div class="eq-grade">
      ${C.equipe.map((m) => `<a class="eq rev" href="equipe.html#p-${m.id}">
        <figure>${foto(m.foto)}</figure>
        <div class="eq-txt"><h3>${esc(m.nome)}</h3><p class="eq-cargo">${esc(m.cargo)}</p><p class="eq-esp">${esc(m.esp)}</p></div>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- galeria (início) ----------
const galeriaInicio = `<section class="gal-ini" id="galeria">
  <div class="largo">
    <div class="sec-cab rev">
      <div><h2>Um olhar pelo Taioba</h2></div>
      <a class="btn btn-vidro" href="galeria.html"><span>Ver a galeria</span>${I.diag}</a>
    </div>
    <div class="mosaico" data-galeria>
      ${['porcoes-mesa', 'capa-salao-noite', 'drink-coando', 'costela-corte', 'mandioca-fogo'].map((n) => { const g = C.galeria.find((x) => x.foto === n); return `<button type="button" class="mos rev" data-foto="${src(n)}" data-leg="${esc(g.leg)}">${foto(n)}<span class="mos-leg">${esc(g.leg)}</span></button>`; }).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- Instagram ----------
const G = C.instagram;
const instagram = `<section class="insta" id="instagram">
  ${folhas([[6, 12, 90, 60, 5, 0.25], [90, 78, 120, -20, 7, 0.35]])}
  <div class="largo insta-in">
    <div class="insta-perfil rev">
      <div class="ip-cab">
        <span class="ip-avatar">${I.folha('var(--verde)', '#fff')}</span>
        <div><b>@${G.usuario}</b><span>${G.publicacoes} publicações</span><span>${G.seguidores} seguidores</span></div>
      </div>
      <p class="ip-bio">Bar e cozinha mineira. Carne à parte, porção na mesa e caipirinha de limão-cravo. ${M.bairro}, BH.</p>
      <ul class="insta-grade" aria-label="Últimas publicações do Instagram">
        ${G.posts.map((p) => `<li><a href="${instaUrl}" target="_blank" rel="noopener" aria-label="Publicação: ${esc(p.texto)}">${foto(p.foto)}<span class="insta-sobre"><span>${esc(p.texto)}</span><b>${I.coracao}${p.curtidas.toLocaleString('pt-BR')}</b></span></a></li>`).join('\n        ')}
      </ul>
    </div>
    <div class="insta-txt rev">
      <span class="sec-ic" aria-hidden="true">${I.insta}</span>
      <h2>A casa em tempo real</h2>
      <p>Siga o Taioba para ver a porção do dia, os drinks novos da Jéssica e a programação da semana.</p>
      <a class="btn btn-verde" href="${instaUrl}" target="_blank" rel="noopener"><span>Abrir o Instagram</span>${I.diag}</a>
    </div>
  </div>
</section>`;

// ---------- avaliações ----------
const avaliacoes = `<section class="avaliacoes" id="avaliacoes">
  <div class="largo av-in">
    <div class="av-cab rev">
      <h2>O que dizem nossos clientes</h2>
      <p class="av-nota">${estrelas}<b>${nota}</b><span>de média em ${M.avaliacoes.toLocaleString('pt-BR')} avaliações no Google</span></p>
      <div class="setas"><button type="button" class="seta" data-trilho-ir="-1" aria-controls="av-trilho" aria-label="Avaliação anterior">${I.esquerda}</button><button type="button" class="seta" data-trilho-ir="1" aria-controls="av-trilho" aria-label="Próxima avaliação">${I.direita}</button></div>
    </div>
    <div class="av-trilho" id="av-trilho" data-trilho-car tabindex="0" aria-label="Avaliações de clientes">
      ${C.depoimentos.map((d) => `<figure class="av">
        <figcaption><span class="av-ini" aria-hidden="true">${esc(iniciais(d.nome))}</span><span><b>${esc(d.nome)}</b><small>${esc(d.quando)}</small></span><span class="av-g" aria-label="Avaliação do Google">G</span></figcaption>
        ${estrelas}
        <blockquote><p>${esc(d.texto)}</p></blockquote>
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- delivery pelos apps, com o prato no meio e a comanda do pedido direto ----------
const apps = `<section class="apps" id="delivery" aria-labelledby="t-apps">
  ${folhas([[2, 18, 90, -30, 5, 0.25], [94, 70, 110, 40, 3, 0.3]])}
  <div class="largo">
    <div class="apps-cab rev">
      <p class="apoio">Delivery</p>
      <h2 id="t-apps">Peça pelo app que <i>você já usa</i></h2>
      <p>A mesma cozinha e a mesma brasa. Escolha o seu app, ou peça direto com a gente pelo WhatsApp e não pague taxa de app.</p>
    </div>
    <div class="duelo rev" data-duelo>
      <a class="lado lado-ifood" href="${M.ifood}" target="_blank" rel="noopener" aria-label="Pedir no iFood">
        <img class="lado-logo" src="assets/img/logos/ifood.svg" alt="iFood" width="170" height="90" loading="lazy">
        <p class="lado-frase">Acompanhe a entrega no mapa e pague pelo app.</p>
        <div class="lado-info"><span><small>entrega</small><b>40 a 60 min</b></span><span><small>taxa a partir de</small><b>R$ 5,99</b></span></div>
        <span class="lado-cta">Pedir no iFood${I.seta}</span>
      </a>
      <div class="duelo-meio" aria-hidden="true">
        <span class="duelo-prato">${foto('tropeiro', { alt: '' })}</span>
        <span class="duelo-ou">ou</span>
      </div>
      <a class="lado lado-99" href="${M.food99}" target="_blank" rel="noopener" aria-label="Pedir no 99Food">
        <span class="logo-99"><img src="assets/img/logos/99.svg" alt="" width="64" height="64" loading="lazy"><b>Food</b></span>
        <p class="lado-frase">Cupons da semana no app. Busque por Taioba.</p>
        <div class="lado-info"><span><small>entrega</small><b>40 a 65 min</b></span><span><small>taxa a partir de</small><b>R$ 4,99</b></span></div>
        <span class="lado-cta">Pedir no 99Food${I.seta}</span>
      </a>
    </div>
    <div class="comanda rev">
      <div class="comanda-papel">
        <p class="comanda-topo"><b>Pedido direto</b><span>pelo WhatsApp, sai da nossa cozinha</span></p>
        <div class="comanda-linha"><span>Taxa de app</span><b>R$ 0,00</b></div>
        <div class="comanda-linha"><span>Retirada no bar</span><b>sem taxa</b></div>
        <div class="comanda-linha"><span>Entrega nos bairros perto</span><b>R$ 12</b></div>
        <a class="btn btn-verde" href="${wa('Olá! Vim pelo site e quero fazer um pedido para entrega.')}" target="_blank" rel="noopener">${I.whats}<span>Pedir no WhatsApp</span></a>
      </div>
    </div>
  </div>
</section>`;

// ---------- encomendas ----------
const encomendas =`<section class="encom" id="encomendas">
  <div class="largo encom-in rev">
    <figure>${foto('mandioca-fogo', { alt: 'Mandioca frita e farofa da casa' })}</figure>
    <div>
      <p class="apoio">Para levar</p>
      <h2>O Taioba na sua casa</h2>
      <p>Tropeiro congelado, linguiça artesanal crua, farofa da casa e o kit caipirinha. Peça com 24 horas e retire no bar ou receba nos bairros perto.</p>
      <ul class="encom-lista">${C.encomendas.slice(0, 4).map((e) => `<li><span>${esc(e.nome)}<small>${esc(e.det)}</small></span><b>${reais(e.preco)}</b></li>`).join('')}</ul>
      <div class="encom-btns" data-iguais><a class="btn btn-verde" href="cliente.html#encomendas">${I.sacola}<span>Encomendar pela Área do cliente</span></a><a class="btn btn-vidro" href="${wa('Olá! Vim pelo site e quero fazer uma encomenda para levar.')}" target="_blank" rel="noopener">${I.whats}<span>Encomendar no WhatsApp</span></a></div>
    </div>
  </div>
</section>`;

// ---------- reservar ----------
const reservar = `<section class="reservar" id="reservar">
  ${folhas([[95, 10, 100, 30, 6, 0.3], [1, 60, 80, -50, 4, 0.2]])}
  <div class="largo reservar-in">
    <div class="res-cab rev">
      <p class="apoio">Reservar online</p>
      <h2>Escolha o formato, quem recebe você, o dia e o horário</h2>
      <p>Mesas de até 10 pessoas confirmam na hora. Grupos maiores e eventos recebem a confirmação pelo WhatsApp em até 2 horas. Segunda a casa fecha.</p>
    </div>
    <form class="res-form rev" data-reserva novalidate>
      <fieldset class="res-exp">
        <legend>Formato</legend>
        <div class="res-opcoes">
          ${C.experiencias.map((e, k) => `<label><input type="radio" name="exp" value="${e.id}"${k === 0 ? ' checked' : ''}><span><b>${esc(e.nome)}</b><small>${e.preco ? `${e.de ? 'a partir de ' : ''}${reais(e.preco)} por pessoa` : 'sem custo'}, ${minutos(e.min)}</small></span></label>`).join('\n          ')}
        </div>
      </fieldset>
      <div class="res-linha">
        <label class="campo"><span>Quem recebe você</span><select name="anf" data-anf></select></label>
        <label class="campo"><span>Ambiente</span><select name="amb" data-amb></select></label>
        <label class="campo"><span>Pessoas</span><input type="number" name="pessoas" min="1" max="80" value="2" inputmode="numeric" required></label>
      </div>
      <div class="res-linha">
        <label class="campo"><span>Data</span><input type="date" name="data" required data-data></label>
        <div class="campo res-horas-campo"><span id="hora-t">Horário</span><div class="res-horas" role="radiogroup" aria-labelledby="hora-t" data-horas><p class="res-vazio">Escolha uma data para ver os horários.</p></div></div>
      </div>
      <div class="res-linha">
        <label class="campo"><span>Nome</span><input name="nome" autocomplete="name" required></label>
        <label class="campo"><span>WhatsApp</span><input name="tel" type="tel" autocomplete="tel" inputmode="tel" placeholder="(31) 90000-0000" required></label>
        <label class="campo"><span>E-mail</span><input name="email" type="email" autocomplete="email"></label>
      </div>
      <label class="campo"><span>Ocasião, alergias ou restrições</span><textarea name="obs" rows="2" placeholder="Aniversário, sem lactose, cadeirão para criança..."></textarea></label>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Concordo com o uso dos meus dados para a reserva, conforme a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</span></label>
      <p class="form-erro" data-erro role="alert"></p>
      <button class="btn btn-verde btn-g" type="submit"><span>Confirmar reserva</span>${I.diag}</button>
    </form>
    <aside class="res-resumo rev" aria-live="polite" data-resumo>
      <h3>Sua reserva</h3>
      <dl>
        <div><dt>Formato</dt><dd data-r="exp">Mesa no salão ou na varanda</dd></div>
        <div><dt>Com</dt><dd data-r="anf">Sem preferência</dd></div>
        <div><dt>Onde</dt><dd data-r="amb">Salão interno</dd></div>
        <div><dt>Quando</dt><dd data-r="quando">Escolha a data</dd></div>
        <div><dt>Pessoas</dt><dd data-r="pessoas">2</dd></div>
        <div class="res-total"><dt>Estimativa</dt><dd data-r="total">Sem custo</dd></div>
      </dl>
      <p class="res-sinal" data-r="sinal" hidden></p>
      <p class="res-conta" data-r="conta">Com a <a href="cliente.html">Área do cliente</a>, a reserva fica guardada e as suas restrições já vêm preenchidas.</p>
    </aside>
    <div class="res-ok" data-ok hidden tabindex="-1">
      <h3>Reserva registrada</h3>
      <p data-ok-txt></p>
      <div class="res-ok-btns" data-iguais><a class="btn btn-whats" data-ok-wa href="#" target="_blank" rel="noopener">${I.whats}<span>Enviar no WhatsApp</span></a><a class="btn btn-vidro" href="conta.html#reservas" data-ok-conta>${I.pessoa}<span>Ver na Área do cliente</span></a><button type="button" class="btn btn-vidro" data-ok-nova><span>Fazer outra reserva</span></button></div>
    </div>
  </div>
</section>`;

// ---------- políticas ----------
const politicas = `<section class="politicas" id="politicas">
  <div class="largo">
    <div class="sec-cab rev">
      <div><p class="apoio">Políticas da casa</p><h2>Reserva, atraso, cancelamento e garantia</h2></div>
      <p>Regras curtas, para que todo mundo tenha a mesa que reservou e a porção que pediu.</p>
    </div>
    <div class="pol-in">
      <dl class="pol-lista">
        ${C.politicas.map((p) => `<div class="rev"><dt>${esc(p.titulo)}</dt><dd>${esc(p.texto)}</dd></div>`).join('\n        ')}
      </dl>
      <aside class="pol-sensivel rev" id="alergias">
        <h3>${esc(C.sensivel.titulo)}</h3>
        <p>${esc(C.sensivel.texto)}</p>
        <ul>${C.sensivel.itens.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </aside>
      <aside class="pol-entrega rev" id="entrega">
        <h3>Entrega e retirada</h3>
        <p>À mesa, só no endereço de ${M.bairro}. Para levar, retire no bar sem taxa ou receba por <b>R$ 12</b> nestes bairros. Fora deles, peça pelo <a href="#delivery">iFood ou 99Food</a>.</p>
        <ul class="bairros">${C.bairros.map((x) => `<li>${x}</li>`).join('')}</ul>
      </aside>
    </div>
  </div>
</section>`;

// ---------- dúvidas ----------
const duvidas = `<section class="duvidas" id="duvidas">
  <div class="largo duv-in">
    <div class="sec-cab sec-cab-col rev"><div><p class="apoio">Dúvidas</p><h2>Perguntas frequentes</h2></div><p>Não achou o que procurava? Mande uma mensagem pelo formulário abaixo ou pelo WhatsApp.</p></div>
    <div class="faq">
      ${C.duvidas.map(([p, r]) => `<details class="rev"><summary><span>${esc(p)}</span><i aria-hidden="true"></i></summary><p>${esc(r)}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- contato ----------
const contato = `<section class="contato" id="contato">
  <div class="largo contato-in">
    <div class="rev">
      <p class="apoio">Contato</p>
      <h2>Fale com a casa</h2>
      <p>Orçamento de evento, encomenda grande, parceria ou só uma pergunta. A equipe responde no horário de funcionamento, em até um dia útil.</p>
      <ul class="canais">
        <li><span>WhatsApp</span><a href="${wa('Olá! Vim pelo site do Taioba.')}" target="_blank" rel="noopener">${M.whatsapp}</a></li>
        <li><span>Telefone</span><a href="tel:+55${M.telefone.replace(/\D/g, '')}">${M.telefone}</a></li>
        <li><span>E-mail</span><a href="mailto:${M.email}">${M.email}</a></li>
        <li><span>Endereço</span><span>${esc(endereco)}</span></li>
      </ul>
    </div>
    <form class="contato-form rev" data-contato novalidate>
      <div class="res-linha">
        <label class="campo"><span>Nome</span><input name="nome" autocomplete="name" required></label>
        <label class="campo"><span>WhatsApp ou telefone</span><input name="tel" type="tel" autocomplete="tel" required></label>
      </div>
      <label class="campo"><span>E-mail</span><input name="email" type="email" autocomplete="email"></label>
      <label class="campo"><span>Assunto</span><select name="assunto"><option>Evento ou confraternização</option><option>Encomenda</option><option>Dúvida sobre reserva</option><option>Parceria ou fornecedor</option><option>Outro assunto</option></select></label>
      <label class="campo"><span>Mensagem</span><textarea name="msg" rows="4" required></textarea></label>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Concordo com o uso dos meus dados para responder ao contato, conforme a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</span></label>
      <p class="form-erro" data-erro role="alert"></p>
      <button class="btn btn-verde" type="submit"><span>Enviar mensagem</span>${I.diag}</button>
      <p class="form-ok" data-ok hidden>Recebemos sua mensagem. Para agilizar, abrimos também a conversa no WhatsApp.</p>
    </form>
  </div>
</section>`;

// ---------- rodapé com mapa ----------
const creditos = JSON.parse(fs.readFileSync(path.join(IMG, 'creditos.json'), 'utf8'));
const rodape = (pg) => {
  const b = pg === 'inicio' ? '' : 'index.html';
  return `<footer class="rodape">
  <div class="largo">
    <div class="rod-mapa">
      <div class="map-box">
        <img src="${src('mapa_santa-tereza')}" alt="Mapa de ${M.bairro}, ${M.cidade}, com a localização do ${M.completo} na Rua Mármore" width="1240" height="760" loading="lazy">
        <span class="pin" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${esc(endereco)}, CEP ${M.cep}</span><span>${esc(M.referencia)}</span><span>${esc(horarioCurto())}</span>
          <div class="mbtns" data-iguais><a href="${mapaUrl}" target="_blank" rel="noopener">${I.pino}Abrir no mapa</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <table class="horas"><caption>Horário de funcionamento</caption><tbody>${[1, 2, 3, 4, 5, 6, 0].map((i) => `<tr data-dia="${i}"><th scope="row">${DIAS[i]}</th><td>${textoDia(C.horario[i])}</td></tr>`).join('')}</tbody></table>
      </div>
    </div>
    <div class="rod-cols">
      <div class="rod-marca">${I.logo}<a class="btn btn-vidro btn-p" href="${b}#reservar"><span>Fazer reserva</span>${I.diag}</a>
        <div class="redes"><a href="${instaUrl}" target="_blank" rel="noopener" aria-label="Instagram do Taioba">${I.insta}</a><a href="${wa('Olá! Vim pelo site do Taioba.')}" target="_blank" rel="noopener" aria-label="WhatsApp do Taioba">${I.whats}</a></div>
      </div>
      <div><h3>Links</h3><ul>${[['index.html', 'Início'], [`${b}#semana`, 'Semana no Taioba'], [`${b}#cardapio-completo`, 'Cardápio'], [`${b}#eventos`, 'Eventos'], ['equipe.html', 'Equipe'], ['galeria.html', 'Galeria'], ['cliente.html', 'Área do cliente']].map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
      <div><h3>A casa</h3><ul><li><a href="${b}#politicas">Políticas</a></li><li><a href="${b}#alergias">Alergias e restrições</a></li><li><a href="${b}#encomendas">Para levar</a></li><li><a href="${b}#duvidas">Dúvidas</a></li><li><a href="${b}#contato">Contato</a></li></ul></div>
      <div><h3>Contato</h3><ul><li><a href="tel:+55${M.telefone.replace(/\D/g, '')}">${M.telefone}</a></li><li><a href="${wa('Olá! Vim pelo site do Taioba.')}" target="_blank" rel="noopener">WhatsApp ${M.whatsapp}</a></li><li><a href="mailto:${M.email}">${M.email}</a></li><li>${esc(endereco)}</li></ul></div>
    </div>
    <div class="legal">
      <p><b>${M.razao}</b>, CNPJ ${M.cnpj}. ${esc(endereco)}, CEP ${M.cep}. Venda de bebida alcoólica proibida para menores de 18 anos.</p>
      <div class="legal-links"><button type="button" class="link" data-doc="uso">Termos de uso</button><button type="button" class="link" data-doc="privacidade">Política de privacidade</button><button type="button" class="link" data-cookies>Preferências de cookies</button></div>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditos.filter((c) => usadas.has(c.arq)).map((c) => `<li>${esc(c.arq)}: <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.autor)}, ${esc(c.fonte)}</a></li>`).join('')}<li>Mapa: dados do OpenStreetMap</li></ul></details>
    </div>
  </div>
  <div class="rod-fim"><div class="largo"><p>© ${new Date().getFullYear()} ${M.completo}. Todos os direitos reservados.</p><p>Modelo de site com marca, pessoas, preços e avaliações fictícios.</p></div></div>
</footer>
<a class="whats-flutua" href="${wa('Olá! Vim pelo site do Taioba e quero falar com a casa.')}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">${I.whats}<span>WhatsApp</span></a>`;
};

// ---------- janelas legais e cookies ----------
const legal = {
  uso: ['Termos de uso', `
    <p>Estes termos valem para o site do ${M.completo} e para a Área do cliente.</p>
    <h3>Reservas e pedidos</h3><p>Reservas e encomendas feitas pelo site são pedidos que a equipe confirma pelo WhatsApp, telefone ou e-mail. Valem as políticas de reserva, atraso, cancelamento e garantia publicadas na página inicial.</p>
    <h3>Preços</h3><p>Os valores do site são de referência e podem mudar. O preço que vale é o do cardápio do dia ou o da proposta enviada.</p>
    <h3>Bebidas alcoólicas</h3><p>A venda é proibida para menores de 18 anos. A equipe pode pedir documento e encerrar o serviço de bebida a qualquer momento.</p>
    <h3>Área do cliente</h3><p>A conta é pessoal. Você responde pelas informações que cadastra e pelo sigilo da senha. Contas usadas para reservas falsas podem ser suspensas.</p>
    <h3>Conteúdo</h3><p>Textos, marca e fotos pertencem ao ${M.nome} ou aos autores indicados nos créditos. Não é permitido copiar para uso comercial.</p>
    <h3>Contato</h3><p>Dúvidas sobre estes termos: ${M.email}.</p>`],
  privacidade: ['Política de privacidade', `
    <p>O ${M.completo} (${M.razao}, CNPJ ${M.cnpj}) trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
    <h3>O que coletamos</h3><p>Nome, telefone, e-mail, data e detalhes da reserva, restrições alimentares que você informar, data de aniversário (opcional) e o histórico de reservas e encomendas da Área do cliente.</p>
    <h3>Para que usamos</h3><p>Para confirmar e organizar reservas, preparar porções seguras para quem tem alergia, responder contatos, registrar as visitas do Caderno de visitas e, só se você autorizar, avisar sobre a programação da semana.</p>
    <h3>Dados de saúde</h3><p>Alergias e restrições são dados sensíveis. Só são usados para preparar sua refeição e ficam visíveis apenas para a cozinha e o salão no dia da reserva.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins de publicidade. Os dados passam apenas pelos serviços de mensagem (WhatsApp) e pelo provedor do site.</p>
    <h3>Cookies e armazenamento</h3><p>O site guarda no seu navegador a escolha sobre cookies, o tema claro ou escuro, a sessão da Área do cliente e, nesta demonstração, as reservas, encomendas e preferências da conta. A medição de visitas só liga com "Aceitar todos". Não usamos cookies de publicidade.</p>
    <h3>Seus direitos</h3><p>Você pode ver, corrigir, baixar ou apagar seus dados a qualquer momento na Área do cliente, em Meus dados, ou pedir por ${M.email}.</p>
    <h3>Por quanto tempo</h3><p>Dados de reserva ficam por 12 meses depois da última visita. Contas sem uso por 2 anos são apagadas.</p>`],
};
const dialogs = `${Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-in">
    <header><h2 id="doc-${id}-t">${t}</h2><button type="button" class="doc-x" data-fecha aria-label="Fechar">${I.fechar}</button></header>
    <div class="doc-corpo">${corpo}</div>
    <p class="doc-pe">Atualizado em novembro de 2026.</p>
  </div>
</dialog>`).join('\n')}
<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Usamos armazenamento do navegador para lembrar o tema, a sessão e suas escolhas. A medição de visitas só liga se você aceitar. <button type="button" class="link" data-doc="privacidade">Saiba mais</button></p>
  <div class="ck-btns" data-iguais><button type="button" class="btn btn-verde btn-p" data-ck="todos">Aceitar todos</button><button type="button" class="btn btn-vidro btn-p" data-ck="essenciais">Só os essenciais</button></div>
</div>
<div class="visor" data-visor hidden role="dialog" aria-modal="true" aria-label="Foto ampliada">
  <button type="button" class="visor-x" data-visor-fecha aria-label="Fechar">${I.fechar}</button>
  <button type="button" class="visor-seta" data-visor-ir="-1" aria-label="Foto anterior">${I.esquerda}</button>
  <figure><img alt="" data-visor-img><figcaption data-visor-leg></figcaption></figure>
  <button type="button" class="visor-seta" data-visor-ir="1" aria-label="Próxima foto">${I.direita}</button>
</div>
<p class="toast" data-toast role="status" aria-live="polite"></p>`;

// ---------- página da equipe ----------
const pgEquipe = `<section class="pg-cab">
  ${folhas([[88, 20, 120, 30, 6, 0.3], [4, 70, 80, -40, 4, 0.2]])}
  <div class="largo">
    <p class="apoio">Equipe</p>
    <h1>Quem acende a brasa, frita a mandioca e bate a caipirinha</h1>
    <p>Cinco pessoas à frente da cozinha, do bar e do salão. Veja a escala da semana e reserve com quem você prefere.</p>
  </div>
</section>
<section class="membros">
  <div class="largo">
    ${C.equipe.map((m, k) => `<article class="membro${k % 2 ? ' inverte' : ''}" id="p-${m.id}">
      <figure class="membro-foto rev">${foto(m.foto, { lazy: k > 0 })}</figure>
      <div class="membro-txt rev">
        <p class="apoio">${esc(m.cargo)}</p>
        <h2>${esc(m.nome)}</h2>
        <p class="membro-bio">${esc(m.bio)}</p>
        <dl class="membro-dados">
          <div><dt>Especialidade</dt><dd>${esc(m.esp)}</dd></div>
          <div><dt>Na profissão</dt><dd>${m.anos} anos</dd></div>
          <div><dt>Formação</dt><dd>${esc(m.formacao)}</dd></div>
          <div><dt>Recebe em</dt><dd>${m.faz.map((id) => esc(C.experiencias.find((e) => e.id === id).nome)).join(', ')}</dd></div>
        </dl>
        <table class="escala"><caption>Escala da semana</caption><tr>${[2, 3, 4, 5, 6, 0].map((d) => `<th scope="col">${DIAS_C[d]}</th>`).join('')}</tr><tr>${[2, 3, 4, 5, 6, 0].map((d) => (m.dias[d] ? `<td>${esc(m.dias[d])}</td>` : '<td class="folga">folga</td>')).join('')}</tr></table>
        <a class="btn btn-verde" href="index.html?exp=${m.faz[0]}&anf=${m.id}#reservar"><span>Reservar com ${esc(primeiro(m.nome))}</span>${I.diag}</a>
      </div>
    </article>`).join('\n    ')}
  </div>
</section>
<section class="eq-junte">
  <div class="largo eq-junte-in rev">
    <figure>${foto('bartender')}</figure>
    <div><h2>Quer trabalhar com a gente?</h2><p>Abrimos vagas para cozinha, bar e salão duas vezes por ano. Mande uma mensagem contando onde já trabalhou.</p><a class="btn btn-vidro" href="${wa('Olá! Vim pelo site e quero enviar meu currículo para o Taioba.')}" target="_blank" rel="noopener">${I.whats}<span>Enviar currículo</span></a></div>
  </div>
</section>`;

// ---------- página da galeria ----------
const pgGaleria = `<section class="pg-cab">
  ${folhas([[88, 20, 120, 30, 6, 0.3], [4, 70, 80, -40, 4, 0.2]])}
  <div class="largo">
    <p class="apoio">Galeria</p>
    <h1>Um olhar pelo Taioba</h1>
    <p>Porções na panelinha, carnes saindo da brasa, drinks do balcão, a varanda e as festas. Toque numa foto para ampliar.</p>
  </div>
</section>
<section class="galeria">
  <div class="largo">
    <div class="filtros" role="group" aria-label="Filtrar por categoria" data-filtros>
      <button type="button" aria-pressed="true" data-filtro="todas">Todas</button>
      ${C.categorias.map(([id, n]) => `<button type="button" aria-pressed="false" data-filtro="${id}">${n}</button>`).join('\n      ')}
    </div>
    <div class="gal-grade" data-galeria>
      ${C.galeria.map((g, k) => `<button type="button" class="gal-item${k % 5 === 0 ? ' alto' : ''}" data-cat="${g.cat}" data-foto="${src(g.foto)}" data-leg="${esc(g.leg)}">${foto(g.foto, { alt: g.leg })}<span class="gal-leg">${esc(g.leg)}<small>${C.categorias.find((c) => c[0] === g.cat)[1]}</small></span></button>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- Área do cliente ----------
const acessoTopo = `<header class="acesso-topo"><a class="logo" href="index.html" aria-label="${M.completo}, início">${I.logo}</a><div class="acesso-topo-dir">${T.pilula('deitada', 'escuro')}<a class="btn btn-vidro btn-p" href="index.html">${I.esquerda}<span>Voltar ao site</span></a></div></header>`;
const pgCliente = `${acessoTopo}
<main class="acesso" id="conteudo">
  <div class="acesso-arte">${foto('amigos-brinde', { lazy: false })}<div class="acesso-arte-txt"><p class="apoio">Área do cliente</p><p class="acesso-frase">Suas reservas, o Caderno de visitas, as encomendas e as restrições guardadas num lugar só.</p></div></div>
  <div class="acesso-form">
    <form data-entrar novalidate>
      <h1>Entrar</h1>
      <p>Use o e-mail e a senha da sua conta.</p>
      <label class="campo"><span>E-mail</span><input type="email" name="email" autocomplete="email" required></label>
      <label class="campo"><span>Senha</span><input type="password" name="senha" autocomplete="current-password" required minlength="6"></label>
      <label class="aceite lembrar"><input type="checkbox" name="lembrar" checked><span>Manter conectado neste aparelho</span></label>
      <p class="form-erro" data-erro role="alert"></p>
      <button class="btn btn-verde btn-g" type="submit">${I.pessoa}<span>Entrar</span></button>
      <div class="acesso-demo"><p><b>Demonstração:</b> ${C.demo.email} e senha ${C.demo.senha}</p><button type="button" class="btn btn-vidro btn-p" data-demo>Preencher a conta de exemplo</button></div>
      <p class="acesso-links">Ainda não tem conta? <a href="cadastro.html">Criar conta</a></p>
      <p class="acesso-links"><button type="button" class="link" data-esqueci>Esqueci a senha</button></p>
    </form>
  </div>
</main>`;
const pgCadastro = `${acessoTopo}
<main class="acesso" id="conteudo">
  <div class="acesso-arte">${foto('porcoes-mesa', { lazy: false })}<div class="acesso-arte-txt"><p class="apoio">Criar conta</p><p class="acesso-frase">Na décima visita registrada no Caderno, a porção de mandioca é por conta da casa.</p></div></div>
  <div class="acesso-form">
    <form data-cadastro novalidate>
      <h1>Criar conta</h1>
      <p>Leva um minuto. As restrições alimentares você pode informar depois, em Preferências.</p>
      <label class="campo"><span>Nome completo</span><input name="nome" autocomplete="name" required></label>
      <div class="res-linha">
        <label class="campo"><span>WhatsApp</span><input name="telefone" type="tel" autocomplete="tel" required></label>
        <label class="campo"><span>Aniversário (opcional)</span><input name="nascimento" type="date"></label>
      </div>
      <label class="campo"><span>E-mail</span><input name="email" type="email" autocomplete="email" required></label>
      <label class="campo"><span>Senha (mínimo 6 caracteres)</span><input name="senha" type="password" autocomplete="new-password" minlength="6" required></label>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Li e aceito os <button type="button" class="link" data-doc="uso">Termos de uso</button> e a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</span></label>
      <label class="aceite"><input type="checkbox" name="avisos"><span>Quero receber a programação da semana pelo WhatsApp (opcional).</span></label>
      <p class="form-erro" data-erro role="alert"></p>
      <button class="btn btn-verde btn-g" type="submit">${I.pessoa}<span>Criar minha conta</span></button>
      <p class="acesso-links">Já tem conta? <a href="cliente.html">Entrar</a></p>
    </form>
  </div>
</main>`;
const abas = [['inicio', 'Início', I.folha()], ['reservas', 'Reservas', I.calendario], ['encomendas', 'Para levar', I.sacola], ['preferencias', 'Preferências', I.broto], ['dados', 'Meus dados', I.pessoa]];
const pgConta = `<div class="conta" id="conteudo">
  <aside class="conta-lado">
    <a class="logo" href="index.html" aria-label="${M.completo}, início">${I.logo}</a>
    <p class="conta-ola" data-ola>Olá</p>
    <nav class="conta-nav" role="tablist" aria-label="Seções da conta">
      ${abas.map(([id, t, ic], k) => `<button type="button" role="tab" id="ab-${id}" aria-controls="cx-${id}" aria-selected="${k === 0}" data-conta-aba="${id}">${ic}<span>${t}</span></button>`).join('\n      ')}
    </nav>
    <div class="conta-lado-pe">
      ${T.pilula('deitada', 'escuro')}
      <a class="conta-link" href="index.html">${I.esquerda}<span>Voltar ao site</span></a>
      <button type="button" class="conta-link" data-sair>${I.sair}<span>Sair</span></button>
    </div>
  </aside>
  <main class="conta-corpo">
    <p class="conta-aviso">Demonstração: o que você faz aqui fica salvo só neste navegador. No site publicado, a conta grava num servidor e a equipe vê as reservas no sistema da casa.</p>
    ${abas.map(([id], k) => `<section class="conta-aba" role="tabpanel" id="cx-${id}" aria-labelledby="ab-${id}" data-cx="${id}"${k ? ' hidden' : ''}></section>`).join('\n    ')}
  </main>
</div>`;

// ---------- dados para o navegador ----------
const dados = {
  marca: { nome: M.nome, completo: M.completo, whatsapp: M.whatsapp, email: M.email, coordenadas: M.coordenadas },
  horario: C.horario,
  experiencias: C.experiencias.map(({ id, nome, min, preco, de, anf: a, ambientes, sinal, sensivel, turnos }) => ({ id, nome, min, preco, de, anf: a, ambientes, sinal, sensivel, turnos })),
  equipe: C.equipe.map(({ id, nome, cargo }) => ({ id, nome, cargo })),
  ambientes: C.ambientes,
  encomendas: C.encomendas,
  restricoes: C.restricoes,
  demo: C.demo,
};

// ---------- montagem das páginas ----------
const ld = {
  '@context': 'https://schema.org', '@type': 'Restaurant', name: M.completo, servesCuisine: ['Mineira', 'Brasileira', 'Bar'], priceRange: 'R$ 30 a R$ 150',
  telephone: M.telefone, email: M.email, url: M.dominio, acceptsReservations: true,
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: M.coordenadas[0], longitude: M.coordenadas[1] },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: M.nota, reviewCount: M.avaliacoes },
};
const pagina = ({ arquivo, pg, titulo, descricao, corpo, tipo = 'site', noindex = false, comLd = false }) => {
  const html = `<!doctype html>
<html lang="pt-BR" data-tema="escuro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${M.dominio}/${arquivo === 'index.html' ? '' : arquivo}">`}
<meta name="theme-color" content="${COR_ESCURO}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:type" content="website">
<meta property="og:image" content="assets/img/capa-salao-noite.webp">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${T.head(CHAVE_TEMA)}
${fontes}
<link rel="stylesheet" href="assets/style.css">
${comLd ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ''}
</head>
<body data-pg="${pg}" class="tipo-${tipo}">
${tipo === 'site' ? topo(pg) : ''}
${tipo === 'site' ? `<main id="conteudo">\n${corpo}\n</main>\n${rodape(pg)}` : corpo}
${dialogs}
<script>window.TAIOBA=${JSON.stringify(dados)};</script>
<script src="assets/app.js" defer></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, arquivo), html);
};

const corpoInicio = [capa, semana, eventos, casa, bannerCardapio, cardapio, experiencias, equipeInicio, galeriaInicio, instagram, avaliacoes, apps, encomendas, reservar, politicas, duvidas, contato].join('\n');
pagina({ arquivo: 'index.html', pg: 'inicio', titulo: `${M.completo} | Porções, carnes e drinks em ${M.bairro}, BH`, descricao: `Bar e cozinha mineira em ${M.bairro}, Belo Horizonte: carnes à parte, porções de arroz, feijão, farofa, mandioca e batata, e drinks com cachaça. Reservas online.`, corpo: corpoInicio, comLd: true });
pagina({ arquivo: 'equipe.html', pg: 'equipe', titulo: `Equipe | ${M.completo}`, descricao: 'Conheça a chef, o mestre da brasa, a chef de porções, a chefe de bar e o maître do Taioba.', corpo: pgEquipe });
pagina({ arquivo: 'galeria.html', pg: 'galeria', titulo: `Galeria | ${M.completo}`, descricao: 'Fotos das porções, carnes, drinks, da varanda e dos eventos do Taioba.', corpo: pgGaleria });
pagina({ arquivo: 'cliente.html', pg: 'cliente', titulo: `Área do cliente | ${M.completo}`, descricao: 'Entre para ver reservas, encomendas, preferências e o Caderno de visitas.', corpo: pgCliente, tipo: 'acesso', noindex: true });
pagina({ arquivo: 'cadastro.html', pg: 'cadastro', titulo: `Criar conta | ${M.completo}`, descricao: 'Crie sua conta na Área do cliente do Taioba.', corpo: pgCadastro, tipo: 'acesso', noindex: true });
pagina({ arquivo: 'conta.html', pg: 'conta', titulo: `Minha conta | ${M.completo}`, descricao: 'Reservas, Caderno de visitas, encomendas, preferências e dados pessoais.', corpo: pgConta, tipo: 'conta', noindex: true });

// ---------- arquivos de apoio ----------
fs.mkdirSync(path.join(OUT, 'assets', 'img', 'logos'), { recursive: true });
for (const l of ['ifood.svg', '99.svg']) fs.copyFileSync(path.join(IMG, 'logos', l), path.join(OUT, 'assets', 'img', 'logos', l));
for (const n of usadas) fs.copyFileSync(path.join(IMG, `${n}.webp`), path.join(OUT, 'assets', 'img', `${n}.webp`));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#141312"/>${I.folha('#5FB585', '#141312').replace(/<svg[^>]*>|<\/svg>/g, '')}</svg>`);
fs.writeFileSync(path.join(OUT, 'assets', 'style.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
fs.writeFileSync(path.join(OUT, 'assets', 'app.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + T.js(CHAVE_TEMA, COR_CLARO, COR_ESCURO));
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /cliente.html\nDisallow: /cadastro.html\nDisallow: /conta.html\nSitemap: ${M.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['', 'equipe.html', 'galeria.html'].map((p) => `  <url><loc>${M.dominio}/${p}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`ok: ${path.relative(process.cwd(), OUT)} (${usadas.size} fotos)`);
