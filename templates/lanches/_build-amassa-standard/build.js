// Gera o Amassa Standard (smash burger fictício na Cidade Baixa, Porto Alegre) em templates/lanches/standard/amassa-standard/.
// Desenho de lanchonete de papel: creme, vermelho ketchup e mostarda, títulos condensados enormes, adesivos que dá para
// arrastar, polaroides, comanda que sai impressa e a janela "Como você quer?" para pedir pelo app, WhatsApp ou balcão.
// Início: capa, faixas, manifesto que se prensa, feito pra dividir (polaroides + comanda), mais pedidos, cardápio por
// segmento, como a chapa funciona, festas e oficina, equipe, galeria, avaliações, Instagram, delivery, agendar,
// políticas, dúvidas e contato. Mais as páginas da equipe e da galeria e a 404.
// Uso: node templates/lanches/_build-amassa-standard/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const T = require('../../_comum/tema-pilula');

const CHAVE_TEMA = 'amassa-tema';
const COR_CLARO = '#F6EEDD', COR_ESCURO = '#140D0B';
const OUT = path.join(__dirname, '..', 'standard', 'amassa-standard');
const IMG = path.join(__dirname, 'img');
const M = C.marca;

// ---------- utilidades ----------
const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const reais = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
const minutos = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
const hora = (h) => (h % 24 === 0 && h >= 24 ? 'meia-noite' : `${Math.floor(h % 24)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`);
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
const prof = (id) => C.equipe.find((m) => m.id === id);
const primeiro = (n) => n.split(' ')[0];
const iniciais = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');
const pratoDe = (id) => C.pratos.find((p) => p.id === id);

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,500..900&family=Familjen+Grotesk:wght@400;500;600;700&family=Gochi+Hand&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet">';

// adesivos prontos da marca
const AD = {
  maisPedido: I.adesivo('estrela', '#FFC21A', '#14130F', ['o mais', 'pedido'], I.risco('#14130F')),
  novo: I.adesivo('oval', '#D3261A', '#FFF6E2', ['novo!']),
  ardido: I.adesivo('redondo', '#14130F', '#FFC21A', ['ardido'], I.risco('#FFC21A')),
  chapa: I.adesivo('oval', '#FFC21A', '#14130F', ['chapa', 'quente']),
  smash: I.adesivo('redondo', '#D3261A', '#FFF6E2', ['amassa!']),
  fritas: I.adesivo('oval', '#FFF6E2', '#D3261A', ['fritas']),
  shake: I.adesivo('estrela', '#D3261A', '#FFC21A', ['shake']),
  crosta: I.adesivo('oval', '#14130F', '#FFF6E2', ['crosta', 'renda']),
};

// setas de rolagem lateral: aparecem só quando o trilho passa da tela (abas e equipe no celular)
const setasRola = (rotulo) => `<button type="button" class="rola-seta rola-antes" data-rola-ir="-1" aria-label="Voltar ${rotulo}" hidden>${I.esquerda}</button><button type="button" class="rola-seta rola-depois" data-rola-ir="1" aria-label="Ver mais ${rotulo}" hidden>${I.direita}</button>`;

// ---------- topo ----------
const nav = (pg) => {
  const b = pg === 'inicio' ? '' : 'index.html';
  return [[`${b}#cardapio`, 'Cardápio', 'cardapio'], [`${b}#casa`, 'A casa', 'casa'], [`${b}#festas`, 'Festas', 'festas'], ['equipe.html', 'Equipe', 'equipe'], ['galeria.html', 'Galeria', 'galeria'], [`${b}#contato`, 'Contato', 'contato']];
};
const topo = (pg) => `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo" data-topo>
  <div class="topo-in">
    <nav class="menu" id="menu" aria-label="Principal">
      ${nav(pg).map(([h, t, id]) => `<a href="${h}"${id === pg ? ' aria-current="page"' : ''}>${t}</a>`).join('\n      ')}
      <div class="menu-tema"><span>Tema</span>${T.pilula('deitada', 'claro')}</div>
    </nav>
    <a class="logo" href="index.html" aria-label="${M.completo}, início">${I.logo}</a>
    <div class="topo-acoes">
      <a class="topo-agendar" href="${pg === 'inicio' ? '' : 'index.html'}#agendar">Agendar</a>
      <button type="button" class="btn btn-verm btn-p" data-pedir><span>Pedir agora</span>${I.seta}</button>
      <button class="menu-btn" type="button" aria-controls="menu" aria-expanded="false" aria-label="Abrir o menu">${I.menu}</button>
    </div>
  </div>
</header>
${T.pilula('tema-lado', 'claro')}`;

// ---------- capa ----------
const capa = `<section class="capa" id="inicio">
  <div class="capa-titulo">
    <h1 class="h-gigante"><span class="lin">Na chapa,</span> <span class="lin verm" data-prensa>sem dó.</span></h1>
  </div>
  <div class="capa-in">
    <div class="capa-txt">
      <p class="capa-status" data-status>${esc(horarioCurto())}</p>
      <p class="capa-lead">Smash burger da Cidade Baixa: bolinha de carne prensada com força na chapa quente, borda crocante de renda e queijo escorrendo no pão de batata.</p>
      <div class="capa-btns" data-iguais><button type="button" class="btn btn-verm" data-pedir><span>Pedir agora</span>${I.seta}</button><a class="btn btn-contorno" href="#cardapio"><span>Ver cardápio</span></a></div>
      <a class="capa-nota" href="#avaliacoes">${estrelas}<b>${nota}</b><span>${M.avaliacoes.toLocaleString('pt-BR')} avaliações no Google</span></a>
    </div>
    <div class="capa-bandeja">
      <figure class="bandeja">${foto('capa', { lazy: false, attrs: ' fetchpriority="high"' })}</figure>
      <span class="adesivo ad-1" data-arrasta tabindex="0" role="img" aria-label="Adesivo: o mais pedido">${AD.maisPedido}</span>
      <span class="adesivo ad-2" data-arrasta tabindex="0" role="img" aria-label="Adesivo: novo">${AD.novo}</span>
      <span class="adesivo ad-3" data-arrasta tabindex="0" role="img" aria-label="Adesivo: ardido">${AD.ardido}</span>
      <p class="dica-arrasta" aria-hidden="true">arraste os adesivos</p>
    </div>
  </div>
</section>`;

// ---------- faixas ----------
const faixaItens = ['Smash', 'Frango crocante', 'Fritas com cheddar', 'Shakes', 'Combos', 'Oficina de smash'];
const faixas = `<div class="faixas" aria-hidden="true">
  <div class="faixa faixa-verm"><div class="faixa-trilho">${[0, 1].map(() => `<span>${faixaItens.map((t) => `<b>${t}</b>${I.azulejo}`).join('')}</span>`).join('')}</div></div>
  <div class="faixa faixa-grande"><div class="faixa-trilho">${[0, 1].map(() => `<span>${['Crosta de renda', 'Queijo escorrendo', 'Pão de batata'].map((t) => `<b>${t}</b>${I.espatula}`).join('')}</span>`).join('')}</div></div>
</div>`;

// ---------- manifesto: cada palavra é prensada ao entrar na tela ----------
const manifestoTxt = 'A gente faz um lanche só, e faz direito: bolinha de carne moída no dia, chapa bem quente, prensa sem dó e pão de batata selado na manteiga. Nada de firula, nada de pressa na cozinha. Só o burger que a gente comeria todo dia.';
const manifesto = `<section class="manifesto" id="casa">
  <span class="adesivo ad-m1" data-arrasta tabindex="0" role="img" aria-label="Adesivo: amassa">${AD.smash}</span>
  <span class="adesivo ad-m2" data-arrasta tabindex="0" role="img" aria-label="Adesivo: fritas">${AD.fritas}</span>
  <span class="adesivo ad-m3" data-arrasta tabindex="0" role="img" aria-label="Adesivo: chapa quente">${AD.chapa}</span>
  <span class="adesivo ad-m4" data-arrasta tabindex="0" role="img" aria-label="Adesivo: shake">${AD.shake}</span>
  <div class="largo">
    <p class="manifesto-txt" data-palavras>${manifestoTxt.split(' ').map((w) => `<span>${esc(w)}</span>`).join(' ')}</p>
    <div class="numeros">
      ${C.numeros.map(([v, t]) => `<p class="rev"><b data-conta="${v}">${v}</b><span>${esc(t)}</span></p>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- feito pra dividir: polaroides + comanda impressa ----------
const hojeTxt = 'hoje';
const dividir = `<section class="dividir" aria-labelledby="t-dividir">
  <div class="largo dividir-in">
    <div class="polas" data-polas aria-roledescription="carrossel" aria-label="Fotos da casa">
      <div class="polas-pilha">
        ${C.polaroides.map((p, k) => `<figure class="pola" data-k="${k}" aria-hidden="${k ? 'true' : 'false'}">${foto(p.foto, { lazy: k > 0 })}<figcaption>${esc(p.leg)}</figcaption></figure>`).join('\n        ')}
      </div>
      <div class="polas-ctrl">
        <button type="button" class="seta" data-pola-ir="-1" aria-label="Foto anterior">${I.esquerda}</button>
        <p class="polas-dica">toque para a próxima</p>
        <button type="button" class="seta" data-pola-ir="1" aria-label="Próxima foto">${I.direita}</button>
      </div>
    </div>
    <div class="dividir-txt">
      <h2 id="t-dividir" class="h-grande rev">Feito pra <span class="verm">dividir</span></h2>
      <div class="impressora rev" data-impressora>
        <span class="impressora-boca" aria-hidden="true"></span>
        <div class="comanda" data-comanda>
          <p class="cm-marca">AMASSA</p>
          <p class="cm-end">${esc(M.endereco.toUpperCase())}<br>${esc(M.bairro.toUpperCase())}, ${M.cidade.toUpperCase()}</p>
          <p class="cm-sep"></p>
          <p class="cm-linha"><span data-cm-data>${hojeTxt}</span><span>MESA 12</span></p>
          <p class="cm-linha"><span>ATENDENTE: RAFA</span><span>BALCÃO</span></p>
          <p class="cm-sep"></p>
          <p class="cm-item"><span>1x PÃO DE BATATA SELADO</span><b>OK</b></p>
          <p class="cm-item"><span>2x CARNE PRENSADA NA HORA</span><b>OK</b></p>
          <p class="cm-item"><span>1x QUEIJO ESCORRENDO</span><b>OK</b></p>
          <p class="cm-item"><span>1x TURMA EM VOLTA DA MESA</span><b>OK</b></p>
          <p class="cm-item cm-zero"><span>0x PRESSA NA COZINHA</span><b>NÃO</b></p>
          <p class="cm-sep"></p>
          <p class="cm-total"><span>TOTAL</span><span>UMA SEXTA BOA</span></p>
          <p class="cm-sep"></p>
          <p class="cm-fim">OBRIGADO E VOLTE COM FOME</p>
          <p class="cm-carimbo" aria-hidden="true">PAGO</p>
        </div>
      </div>
      <p class="dividir-p rev">Na Amassa a mesa é comprida, o combo vem para dois ou para a turma e o shake grande tem dois canudos. Burger bom é o que se come junto.</p>
      <div class="dividir-btns rev"><a class="btn btn-contorno" href="#festas"><span>Festas e oficina</span>${I.seta}</a><button type="button" class="link-forte" data-imprime>${I.imprimir}<span>Imprimir de novo</span></button></div>
    </div>
  </div>
</section>`;

// ---------- mais pedidos ----------
const maisPedidos = ['duplo', 'fritas-cheddar', 'shake-flocos', 'ardido'].map(pratoDe);
const selo = (p) => (p.tags || []).filter((t) => ['maisPedido', 'novo', 'picante'].includes(t)).slice(0, 1).map((t) => `<span class="selo selo-${t}">${C.tagsNome[t]}</span>`).join('');
const destaques = `<section class="destaques" aria-labelledby="t-dest">
  <div class="largo">
    <div class="sec-topo rev"><h2 id="t-dest" class="h-media">Os que mais saem</h2><a class="btn btn-contorno" href="#cardapio"><span>Cardápio completo</span>${I.seta}</a></div>
    <div class="dest-grade">
      ${maisPedidos.map((p) => `<article class="dest rev">
        ${selo(p)}
        <figure>${foto(p.foto)}</figure>
        <h3>${esc(p.nome)}</h3>
        <p class="dest-preco">${reais(p.preco)}</p>
        <button type="button" class="dest-pedir" data-pedir="${p.id}" aria-label="Pedir ${esc(p.nome)}">${I.sacola}<span>Pedir</span></button>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- cardápio completo por segmento ----------
const tagsHtml = (t = []) => (t.length ? `<p class="pr-tags">${t.map((x) => `<span class="tag tag-${x}">${x === 'veg' ? I.broto : x === 'picante' ? I.fogo : ''}${C.tagsNome[x]}</span>`).join('')}</p>` : '');
const prato = (p) => `<article class="pr${p.foto ? ' pr-foto' : ''}" id="p-${p.id}">
          ${p.foto ? `<figure>${foto(p.foto)}</figure>` : ''}
          <div class="pr-txt">
            <p class="pr-peso">${esc(p.peso)}</p>
            <h4>${esc(p.nome)}</h4>
            <p class="pr-inclui">${esc(p.inclui)}</p>
            ${tagsHtml(p.tags)}
            <div class="pr-pe">
              <span class="pr-tempo">${I.relogio}${minutos(p.min)} de preparo</span>
              <b class="pr-preco">${p.de ? '<small>a partir de</small>' : ''}${reais(p.preco)}</b>
            </div>
            <button type="button" class="pr-pedir" data-pedir="${p.id}">${I.sacola}<span>Pedir este</span></button>
          </div>
        </article>`;
const cardapio = `<section class="cardapio" id="cardapio">
  <div class="largo">
    <div class="sec-cab rev">
      <h2 class="h-grande">O cardápio</h2>
      <p>Cinco frentes, uma chapa só. O tempo de cada lanche é o de preparo depois do pedido; no salão de sexta à noite, conte uns minutos de fila.</p>
    </div>
    <div class="rola rola-abas" data-rola>
    <div class="abas" role="tablist" aria-label="Segmentos do cardápio" data-abas data-rola-trilho>
      ${C.segmentos.map((g, k) => `<button type="button" role="tab" id="aba-${g.id}" aria-controls="seg-${g.id}" aria-selected="${k === 0}" data-aba="${g.id}">${esc(g.nome)}</button>`).join('\n      ')}
    </div>
    ${setasRola('segmentos')}
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
    <dl class="condicoes rev">
      <div><dt>Pagamento</dt><dd>${esc(C.pagamento)}</dd></div>
      <div><dt>Valores "a partir de"</dt><dd>${esc(C.aPartir)}</dd></div>
      <div><dt>Cancelamento e remarcação</dt><dd>Pedido de balcão ou app pode ser cancelado até a chapa começar. Agendamentos, sem custo até 2 horas antes; festas, até 7 dias. <a href="#politicas">Ver as políticas</a></dd></div>
    </dl>
  </div>
</section>`;

// ---------- como a chapa funciona ----------
const chapa = `<section class="chapa" aria-labelledby="t-chapa">
  <div class="largo chapa-in">
    <div class="chapa-cab rev">
      <h2 id="t-chapa" class="h-grande">Como a chapa <span class="mostarda">trabalha</span></h2>
      <p>Smash é técnica, não é pressa. Em menos de três minutos, a bolinha vira crosta.</p>
    </div>
    <figure class="chapa-foto rev">${foto('chapa-prensa')}</figure>
    <ol class="chapa-passos">
      ${C.chapa.map((p, k) => `<li class="rev"><span class="cp-disco cp-${k}" aria-hidden="true"></span><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></li>`).join('\n      ')}
    </ol>
  </div>
</section>`;

// ---------- festas, oficina e eventos (serviços agendáveis) ----------
const servCard = (e) => `<article class="serv${e.destaque ? ' serv-destaque' : ''} rev" id="s-${e.id}">
        <figure>${foto(e.foto)}${e.destaque ? `<span class="adesivo ad-serv" aria-hidden="true">${AD.crosta}</span>` : ''}</figure>
        <div class="serv-txt">
          <h3>${esc(e.nome)}</h3>
          <p>${esc(e.inclui)}</p>
          <dl class="serv-dados">
            <div><dt>Duração</dt><dd>${minutos(e.min)}</dd></div>
            <div><dt>Pessoas</dt><dd>${e.pessoas[0]} a ${e.pessoas[1]}</dd></div>
            <div><dt>Com</dt><dd>${e.prof.map((id) => esc(primeiro(prof(id).nome))).join(' ou ')}</dd></div>
          </dl>
          ${e.sensivel ? '<p class="serv-aviso">Restrições alimentares com 72 horas de antecedência</p>' : ''}
          <div class="serv-pe">
            <b class="serv-preco">${e.preco ? `${e.de ? '<small>a partir de</small>' : ''}${reais(e.preco)}<small>por pessoa</small>` : 'Sem custo<small>para agendar</small>'}</b>
            <a class="btn btn-verm btn-p" href="#agendar" data-agendar="${e.id}"><span>Agendar</span>${I.seta}</a>
          </div>
          ${e.sinal ? '<p class="serv-sinal">Sinal de 30% por Pix para confirmar</p>' : ''}
        </div>
      </article>`;
const festas = `<section class="festas" id="festas">
  <div class="largo">
    <div class="sec-cab rev">
      <h2 class="h-grande">Festas, oficina e <span class="verm">chapa no seu evento</span></h2>
      <p>Tudo com duração, preço e quem cuida de você. Agende pelo site e a confirmação chega no WhatsApp.</p>
    </div>
    <div class="serv-grade">
      ${C.servicos.map(servCard).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- equipe (início) ----------
const equipeInicio = `<section class="equipe-ini" id="equipe">
  <div class="largo">
    <div class="sec-topo rev"><h2 class="h-media">Quem prensa, frita e bate</h2><a class="btn btn-contorno" href="equipe.html"><span>Conhecer a equipe</span>${I.seta}</a></div>
    <div class="rola rola-eq" data-rola>
    <div class="eq-grade" data-rola-trilho>
      ${C.equipe.map((m, k) => `<a class="eq rev" href="equipe.html#p-${m.id}" style="--giro:${[-3, 2, -1.5, 3, -2][k]}deg">
        <figure>${foto(m.foto)}</figure>
        <div class="eq-txt"><h3>${esc(m.nome)}</h3><p class="eq-cargo">${esc(m.cargo)}</p></div>
      </a>`).join('\n      ')}
    </div>
    ${setasRola('pessoas da equipe')}
    </div>
  </div>
</section>`;

// ---------- galeria (início) ----------
const galeriaInicio = `<section class="gal-ini" id="galeria">
  <div class="largo">
    <div class="sec-topo rev"><h2 class="h-media">Pela janela da chapa</h2><a class="btn btn-contorno" href="galeria.html"><span>Ver a galeria</span>${I.seta}</a></div>
    <div class="mosaico" data-galeria>
      ${['smash-duplo', 'salao-xadrez', 'chapa-espatula', 'shake-flocos', 'festa-aniversario'].map((n) => { const g = C.galeria.find((x) => x.foto === n); return `<button type="button" class="mos rev" data-foto="${src(n)}" data-leg="${esc(g.leg)}">${foto(n)}<span class="mos-leg">${esc(g.leg)}</span></button>`; }).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- avaliações ----------
const avaliacoes = `<section class="avaliacoes" id="avaliacoes">
  <div class="largo">
    <div class="av-cab rev">
      <h2 class="h-media">Quem comeu, falou</h2>
      <p class="av-nota">${estrelas}<b>${nota}</b><span>de média em ${M.avaliacoes.toLocaleString('pt-BR')} avaliações no Google</span></p>
      <div class="setas"><button type="button" class="seta" data-trilho-ir="-1" aria-controls="av-trilho" aria-label="Avaliação anterior">${I.esquerda}</button><button type="button" class="seta" data-trilho-ir="1" aria-controls="av-trilho" aria-label="Próxima avaliação">${I.direita}</button></div>
    </div>
  </div>
  <div class="av-trilho" id="av-trilho" data-trilho-car tabindex="0" aria-label="Avaliações de clientes">
    ${C.depoimentos.map((d, k) => `<figure class="av" style="--giro:${[-1.5, 1, -.5, 1.5, -1, .8][k]}deg">
      ${I.aspas}
      <blockquote><p>${esc(d.texto)}</p></blockquote>
      <figcaption><span class="av-ini" aria-hidden="true">${esc(iniciais(d.nome))}</span><span><b>${esc(d.nome)}</b><small>${esc(d.quando)} no Google</small></span>${estrelas}</figcaption>
    </figure>`).join('\n    ')}
  </div>
</section>`;

// ---------- Instagram ----------
const G = C.instagram;
const instagram = `<section class="insta" id="instagram">
  <div class="largo insta-in">
    <div class="insta-txt rev">
      <span class="insta-ic" aria-hidden="true">${I.insta}</span>
      <h2 class="h-media">@${G.usuario}</h2>
      <p>${G.publicacoes} publicações e ${G.seguidores} seguidores vendo a chapa ao vivo, o shake do mês e quando o Afogado volta.</p>
      <a class="btn btn-verm" href="${instaUrl}" target="_blank" rel="noopener"><span>Seguir no Instagram</span>${I.diag}</a>
    </div>
    <ul class="insta-grade" aria-label="Últimas publicações do Instagram">
      ${G.posts.map((p) => `<li class="rev"><a href="${instaUrl}" target="_blank" rel="noopener" aria-label="Publicação: ${esc(p.texto)}">${foto(p.foto)}<span class="insta-sobre"><span>${esc(p.texto)}</span><b>${I.coracao}${p.curtidas.toLocaleString('pt-BR')}</b></span></a></li>`).join('\n      ')}
    </ul>
  </div>
</section>`;

// ---------- delivery ----------
const delivery = `<section class="delivery" id="delivery" aria-labelledby="t-del">
  <div class="largo delivery-in">
    <div class="del-txt rev">
      <h2 id="t-del" class="h-grande">Chega <span class="mostarda">quente</span> na sua casa</h2>
      <p>Embalagem com respiro para a fritas não murchar e o pão separado da carne até a hora de fechar. Peça pelo app que você já usa ou direto com a gente.</p>
      <ul class="del-apps">
        <li><a class="app app-ifood" href="${M.ifood}" target="_blank" rel="noopener"><img src="assets/img/logos/ifood.svg" alt="iFood" width="120" height="64" loading="lazy"><span><small>entrega</small>30 a 45 min</span>${I.diag}</a></li>
        <li><a class="app app-99" href="${M.food99}" target="_blank" rel="noopener"><span class="logo-99"><img src="assets/img/logos/99.svg" alt="" width="40" height="40" loading="lazy"><b>Food</b></span><span><small>entrega</small>30 a 50 min</span>${I.diag}</a></li>
        <li><a class="app app-wa" href="${wa('Olá! Vim pelo site e quero fazer um pedido para entrega.')}" target="_blank" rel="noopener">${I.whats}<span><small>direto, sem taxa de app</small>R$ 8 nos bairros perto</span>${I.diag}</a></li>
      </ul>
    </div>
    <figure class="del-foto rev">${foto('combo-caixa')}<span class="adesivo ad-del" aria-hidden="true">${AD.chapa}</span></figure>
  </div>
</section>`;

// ---------- agendar ----------
const agendar = `<section class="agendar" id="agendar">
  <div class="largo agendar-in">
    <div class="ag-cab rev">
      <h2 class="h-grande">Agende a sua</h2>
      <p>Escolha o que quer agendar, quem cuida de você, o dia e o horário. Mesas e retiradas confirmam na hora; festas, oficina e eventos recebem a confirmação pelo WhatsApp em até 4 horas. Segunda a casa fecha.</p>
    </div>
    <form class="ag-form rev" data-agenda novalidate>
      <fieldset class="ag-servicos">
        <legend>O que você quer agendar</legend>
        <div class="ag-opcoes">
          ${C.servicos.map((e, k) => `<label><input type="radio" name="serv" value="${e.id}"${k === 0 ? ' checked' : ''}><span><b>${esc(e.nome)}</b><small>${e.preco ? `${e.de ? 'a partir de ' : ''}${reais(e.preco)} por pessoa` : 'sem custo'}, ${minutos(e.min)}</small></span></label>`).join('\n          ')}
        </div>
      </fieldset>
      <div class="ag-linha">
        <label class="campo"><span>Quem cuida de você</span><select name="prof" data-prof></select></label>
        <label class="campo"><span>Pessoas</span><input type="number" name="pessoas" min="1" max="300" value="10" inputmode="numeric" required></label>
      </div>
      <div class="ag-linha">
        <label class="campo"><span>Data</span><input type="date" name="data" required data-data></label>
        <div class="campo ag-horas-campo"><span id="hora-t">Horário</span><div class="ag-horas" role="radiogroup" aria-labelledby="hora-t" data-horas><p class="ag-vazio">Escolha uma data para ver os horários.</p></div></div>
      </div>
      <div class="ag-linha">
        <label class="campo"><span>Nome</span><input name="nome" autocomplete="name" required></label>
        <label class="campo"><span>WhatsApp</span><input name="tel" type="tel" autocomplete="tel" inputmode="tel" placeholder="(51) 90000-0000" required></label>
      </div>
      <label class="campo"><span>E-mail (opcional)</span><input name="email" type="email" autocomplete="email"></label>
      <label class="campo"><span>Ocasião, endereço do evento ou restrições</span><textarea name="obs" rows="2" placeholder="Aniversário de 9 anos, 3 vegetarianos, sem lactose..."></textarea></label>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Concordo com o uso dos meus dados para o agendamento, conforme a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</span></label>
      <p class="form-erro" data-erro role="alert"></p>
      <button class="btn btn-verm btn-g" type="submit"><span>Confirmar agendamento</span>${I.seta}</button>
    </form>
    <aside class="ag-resumo rev" aria-live="polite" data-resumo>
      <p class="ag-resumo-t">Seu pedido de agendamento</p>
      <dl>
        <div><dt>O quê</dt><dd data-r="serv">${esc(C.servicos[0].nome)}</dd></div>
        <div><dt>Com</dt><dd data-r="prof">Sem preferência</dd></div>
        <div><dt>Quando</dt><dd data-r="quando">Escolha a data</dd></div>
        <div><dt>Pessoas</dt><dd data-r="pessoas">10</dd></div>
        <div class="ag-total"><dt>Estimativa</dt><dd data-r="total">${reais(C.servicos[0].preco * 10)}</dd></div>
      </dl>
      <p class="ag-sinal" data-r="sinal" hidden></p>
      <p class="ag-obs">O valor final aparece na confirmação. Pagamento por Pix, cartão ou vale.</p>
    </aside>
    <div class="ag-ok" data-ok hidden tabindex="-1">
      <h3 class="h-media">Pedido registrado</h3>
      <p data-ok-txt></p>
      <div class="ag-ok-btns" data-iguais><a class="btn btn-whats" data-ok-wa href="#" target="_blank" rel="noopener">${I.whats}<span>Enviar no WhatsApp</span></a><button type="button" class="btn btn-contorno" data-ok-nova><span>Fazer outro agendamento</span></button></div>
    </div>
  </div>
</section>`;

// ---------- políticas ----------
const politicas = `<section class="politicas" id="politicas">
  <div class="largo">
    <div class="sec-cab rev">
      <h2 class="h-grande">Combinado <span class="verm">não sai caro</span></h2>
      <p>Agendamento, atraso, cancelamento e garantia, em regras curtas para todo mundo comer o que pediu, na hora que marcou.</p>
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
        <h3>Entrega direta</h3>
        <p>Pelo WhatsApp, entregamos por <b>R$ 8</b> nestes bairros. Fora deles, peça pelo <a href="#delivery">iFood ou 99Food</a>.</p>
        <ul class="bairros">${C.bairros.map((x) => `<li>${x}</li>`).join('')}</ul>
      </aside>
    </div>
  </div>
</section>`;

// ---------- dúvidas ----------
const duvidas = `<section class="duvidas" id="duvidas">
  <div class="largo duv-in">
    <div class="duv-cab rev"><h2 class="h-grande">Perguntou?</h2><p>Se a sua dúvida não está aqui, mande pelo formulário logo abaixo ou pelo WhatsApp.</p><span class="adesivo ad-duv" aria-hidden="true">${AD.smash}</span></div>
    <div class="faq">
      ${C.duvidas.map(([p, r]) => `<details class="rev"><summary><span>${esc(p)}</span><i aria-hidden="true"></i></summary><p>${esc(r)}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- contato ----------
const contato = `<section class="contato" id="contato">
  <div class="largo contato-in">
    <div class="rev">
      <h2 class="h-grande">Fala com a <span class="verm">chapa</span></h2>
      <p>Orçamento de festa, evento de empresa, pedido grande, parceria ou só uma pergunta. A gente responde em até um dia útil.</p>
      <ul class="canais">
        <li><span>WhatsApp</span><a href="${wa('Olá! Vim pelo site da Amassa.')}" target="_blank" rel="noopener">${M.whatsapp}</a></li>
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
      <label class="campo"><span>Assunto</span><select name="assunto"><option>Festa ou aniversário</option><option>Chapa no meu evento</option><option>Pedido grande</option><option>Oficina de smash</option><option>Parceria ou fornecedor</option><option>Outro assunto</option></select></label>
      <label class="campo"><span>Mensagem</span><textarea name="msg" rows="4" required></textarea></label>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Concordo com o uso dos meus dados para responder ao contato, conforme a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</span></label>
      <p class="form-erro" data-erro role="alert"></p>
      <button class="btn btn-verm" type="submit"><span>Enviar mensagem</span>${I.seta}</button>
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
        <img src="${src('mapa_cidade-baixa')}" alt="Mapa da ${M.bairro}, em ${M.cidade}, com a localização da ${M.completo} na Rua da República" width="1240" height="760" loading="lazy">
        <span class="pin" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${esc(endereco)}, CEP ${M.cep}</span><span>${esc(M.referencia)}</span><span>${esc(horarioCurto())}</span>
          <div class="mbtns" data-iguais><a href="${mapaUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h3>Onde atendemos</h3>
        <p>Salão e balcão na ${M.bairro}. Entrega direta nos bairros abaixo e pelos apps em boa parte de ${M.cidade}.</p>
        <ul class="bairros">${C.bairros.map((x) => `<li>${x}</li>`).join('')}</ul>
        <table class="horas"><caption>Horário</caption><tbody>${[1, 2, 3, 4, 5, 6, 0].map((i) => `<tr data-dia="${i}"><th scope="row">${DIAS[i]}</th><td>${textoDia(C.horario[i])}</td></tr>`).join('')}</tbody></table>
      </div>
    </div>
    <div class="rod-cols">
      <div><h3>Navegue</h3><ul>${[['index.html', 'Início'], [`${b}#cardapio`, 'Cardápio'], [`${b}#festas`, 'Festas e oficina'], ['equipe.html', 'Equipe'], ['galeria.html', 'Galeria'], [`${b}#agendar`, 'Agendar']].map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
      <div><h3>A casa</h3><ul><li><a href="${b}#politicas">Políticas</a></li><li><a href="${b}#alergias">Alergias e restrições</a></li><li><a href="${b}#delivery">Delivery</a></li><li><a href="${b}#duvidas">Dúvidas</a></li><li><a href="${b}#contato">Contato</a></li></ul></div>
      <div><h3>Redes</h3><ul><li><a href="${instaUrl}" target="_blank" rel="noopener">Instagram</a></li><li><a href="${wa('Olá! Vim pelo site da Amassa.')}" target="_blank" rel="noopener">WhatsApp</a></li><li><a href="${M.ifood}" target="_blank" rel="noopener">iFood</a></li><li><a href="${M.food99}" target="_blank" rel="noopener">99Food</a></li></ul></div>
      <div class="rod-contato"><h3>Contato</h3><ul><li><a href="tel:+55${M.telefone.replace(/\D/g, '')}">${M.telefone}</a></li><li><a href="mailto:${M.email}">${M.email}</a></li><li>${esc(endereco)}</li></ul></div>
    </div>
    <a class="rod-logo" href="index.html" aria-label="${M.completo}, início">${I.logoTxt}</a>
    <div class="legal">
      <p><b>${M.razao}</b>, CNPJ ${M.cnpj}. ${esc(endereco)}, CEP ${M.cep}.</p>
      <div class="legal-links"><button type="button" class="link" data-doc="uso">Termos de uso</button><button type="button" class="link" data-doc="privacidade">Política de privacidade</button><button type="button" class="link" data-cookies>Preferências de cookies</button></div>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditos.filter((c) => usadas.has(c.arq)).map((c) => `<li>${esc(c.arq)}: <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.fonte)}</a></li>`).join('')}<li>Mapa: dados do OpenStreetMap</li></ul></details>
      <p class="legal-fim">© ${new Date().getFullYear()} ${M.completo}. Modelo de site com marca, pessoas, preços e avaliações fictícios.</p>
    </div>
  </div>
</footer>
<a class="whats-flutua" href="${wa('Olá! Vim pelo site da Amassa e quero fazer um pedido.')}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">${I.whats}<span>WhatsApp</span></a>`;
};

// ---------- janela "Como você quer?" ----------
const pedir = `<dialog class="pedir" id="pedir" aria-labelledby="pedir-t">
  <div class="pedir-in">
    <button type="button" class="doc-x" data-fecha aria-label="Fechar">${I.fechar}</button>
    <p class="pedir-apoio">Pedir na Amassa</p>
    <h2 id="pedir-t">Como você quer?</h2>
    <p class="pedir-item" data-pedir-item hidden></p>
    <ul class="pedir-lista">
      <li><a href="${M.ifood}" target="_blank" rel="noopener" class="po po-ifood"><span class="po-ic"><img src="assets/img/logos/ifood.svg" alt="" width="60" height="32"></span><span><b>iFood</b><small>Entrega em 30 a 45 min</small></span>${I.diag}</a></li>
      <li><a href="${M.food99}" target="_blank" rel="noopener" class="po po-99"><span class="po-ic"><img src="assets/img/logos/99.svg" alt="" width="30" height="30"></span><span><b>99Food</b><small>Entrega em 30 a 50 min</small></span>${I.diag}</a></li>
      <li><a href="${wa('Olá! Vim pelo site e quero fazer um pedido para entrega.')}" target="_blank" rel="noopener" class="po po-wa" data-pedir-wa><span class="po-ic">${I.whats}</span><span><b>WhatsApp</b><small>Direto com a gente, R$ 8 nos bairros perto</small></span>${I.diag}</a></li>
    </ul>
    <p class="pedir-ou">ou retire no balcão</p>
    <div class="pedir-btns" data-iguais><a class="btn btn-contorno btn-p" href="tel:+55${M.telefone.replace(/\D/g, '')}">${I.balcao}<span>Ligar e pedir</span></a><a class="btn btn-contorno btn-p" href="${rotaUrl}" target="_blank" rel="noopener">${I.pino}<span>Como chegar</span></a></div>
    <p class="pedir-pe">Preço e tempo de entrega podem variar em cada app.</p>
  </div>
</dialog>`;

// ---------- janelas legais e cookies ----------
const legal = {
  uso: ['Termos de uso', `
    <p>Estes termos valem para o site da ${M.completo}.</p>
    <h3>Pedidos e agendamentos</h3><p>Pedidos e agendamentos feitos pelo site são solicitações que a equipe confirma pelo WhatsApp, telefone ou e-mail. Valem as políticas de agendamento, atraso, cancelamento e garantia publicadas na página inicial. Pedidos pelo iFood e pelo 99Food seguem também as regras de cada aplicativo.</p>
    <h3>Preços</h3><p>Os valores do site são de referência e podem mudar. Vale o preço do cardápio do dia no balcão, o do aplicativo ou o da proposta enviada.</p>
    <h3>Oficina de smash</h3><p>A oficina usa chapa quente. Quem participa segue as orientações do chapeiro e usa os equipamentos de proteção entregues. Crianças a partir de 8 anos, sempre com um adulto inscrito.</p>
    <h3>Conteúdo</h3><p>Textos, marca e fotos pertencem à ${M.nome} ou aos autores indicados nos créditos. Não é permitido copiar para uso comercial.</p>
    <h3>Contato</h3><p>Dúvidas sobre estes termos: ${M.email}.</p>`],
  privacidade: ['Política de privacidade', `
    <p>A ${M.completo} (${M.razao}, CNPJ ${M.cnpj}) trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
    <h3>O que coletamos</h3><p>Nome, telefone, e-mail, detalhes do agendamento ou do pedido e as restrições alimentares que você informar.</p>
    <h3>Para que usamos</h3><p>Para confirmar e organizar agendamentos, preparar lanches seguros para quem tem alergia, responder contatos e, só se você pedir, avisar sobre novidades da casa.</p>
    <h3>Dados de saúde</h3><p>Alergias e restrições são dados sensíveis. Só são usados para preparar o seu pedido ou o seu evento e ficam visíveis apenas para a cozinha e a equipe de eventos.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins de publicidade. Os dados passam apenas pelos serviços de mensagem (WhatsApp), pelo provedor do site e, nos pedidos por aplicativo, pelo próprio aplicativo.</p>
    <h3>Cookies e armazenamento</h3><p>O site guarda no seu navegador a escolha sobre cookies, o tema claro ou escuro, a posição dos adesivos e, nesta demonstração, os agendamentos e contatos enviados. A medição de visitas só liga com "Aceitar todos". Não usamos cookies de publicidade.</p>
    <h3>Seus direitos</h3><p>Você pode pedir para ver, corrigir ou apagar seus dados a qualquer momento por ${M.email}.</p>
    <h3>Por quanto tempo</h3><p>Dados de agendamento ficam por 12 meses depois do evento. Contatos sem resposta são apagados em 6 meses.</p>`],
};
const dialogs = `${Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-in">
    <header><h2 id="doc-${id}-t">${t}</h2><button type="button" class="doc-x" data-fecha aria-label="Fechar">${I.fechar}</button></header>
    <div class="doc-corpo">${corpo}</div>
    <p class="doc-pe">Atualizado em novembro de 2026.</p>
  </div>
</dialog>`).join('\n')}
${pedir}
<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Guardamos no navegador o tema, os adesivos e suas escolhas. A medição de visitas só liga se você aceitar. <button type="button" class="link" data-doc="privacidade">Saiba mais</button></p>
  <div class="ck-btns" data-iguais><button type="button" class="btn btn-verm btn-p" data-ck="todos">Aceitar todos</button><button type="button" class="btn btn-contorno btn-p" data-ck="essenciais">Só os essenciais</button></div>
</div>
<div class="visor" data-visor hidden role="dialog" aria-modal="true" aria-label="Foto ampliada">
  <button type="button" class="visor-x" data-visor-fecha aria-label="Fechar">${I.fechar}</button>
  <button type="button" class="visor-seta" data-visor-ir="-1" aria-label="Foto anterior">${I.esquerda}</button>
  <figure><img alt="" data-visor-img><figcaption data-visor-leg></figcaption></figure>
  <button type="button" class="visor-seta" data-visor-ir="1" aria-label="Próxima foto">${I.direita}</button>
</div>
<p class="toast" data-toast role="status" aria-live="polite"></p>`;

// ---------- página da equipe ----------
const pgCab = (titulo, texto) => `<section class="pg-cab">
  <div class="largo">
    <h1 class="h-gigante">${titulo}</h1>
    <p>${texto}</p>
  </div>
</section>`;
const pgEquipe = `${pgCab('A <span class="verm">equipe</span>', 'Cinco pessoas na chapa, na fritadeira, no balcão e nas festas. Veja a escala da semana e agende com quem você prefere.')}
<section class="membros">
  <div class="largo">
    ${C.equipe.map((m, k) => `<article class="membro${k % 2 ? ' inverte' : ''}" id="p-${m.id}">
      <figure class="membro-foto rev" style="--giro:${k % 2 ? 2.5 : -2.5}deg">${foto(m.foto, { lazy: k > 0 })}<figcaption>${esc(primeiro(m.nome).toLowerCase())}, ${esc(m.cargo.toLowerCase())}</figcaption></figure>
      <div class="membro-txt rev">
        <p class="membro-cargo">${esc(m.cargo)}</p>
        <h2 class="h-media">${esc(m.nome)}</h2>
        <p class="membro-bio">${esc(m.bio)}</p>
        <dl class="membro-dados">
          <div><dt>Especialidade</dt><dd>${esc(m.esp)}</dd></div>
          <div><dt>Na profissão</dt><dd>${m.anos} anos</dd></div>
          <div><dt>Formação</dt><dd>${esc(m.formacao)}</dd></div>
          <div><dt>Cuida de</dt><dd>${m.faz.map((id) => esc(C.servicos.find((e) => e.id === id).nome)).join(', ')}</dd></div>
        </dl>
        <table class="escala"><caption>Escala da semana</caption><tr>${[2, 3, 4, 5, 6, 0].map((d) => `<th scope="col">${DIAS_C[d]}</th>`).join('')}</tr><tr>${[2, 3, 4, 5, 6, 0].map((d) => (m.dias[d] ? `<td>${esc(m.dias[d])}</td>` : '<td class="folga">folga</td>')).join('')}</tr></table>
        <a class="btn btn-verm" href="index.html?serv=${m.faz[0]}&prof=${m.id}#agendar"><span>Agendar com ${esc(primeiro(m.nome))}</span>${I.seta}</a>
      </div>
    </article>`).join('\n    ')}
  </div>
</section>
<section class="eq-junte">
  <div class="largo eq-junte-in rev">
    <figure>${foto('chapeiro')}</figure>
    <div><h2 class="h-media">Quer prensar com a gente?</h2><p>Abrimos vagas para chapa, balcão e delivery duas vezes por ano. Mande uma mensagem contando onde já trabalhou.</p><a class="btn btn-contorno" href="${wa('Olá! Vim pelo site e quero enviar meu currículo para a Amassa.')}" target="_blank" rel="noopener">${I.whats}<span>Enviar currículo</span></a></div>
  </div>
</section>`;

// ---------- página da galeria ----------
const pgGaleria = `${pgCab('A <span class="verm">galeria</span>', 'Burgers saindo da chapa, a prensa trabalhando, shakes, o salão xadrez e as festas. Toque numa foto para ampliar.')}
<section class="galeria">
  <div class="largo">
    <div class="filtros" role="group" aria-label="Filtrar por categoria" data-filtros data-iguais>
      <button type="button" aria-pressed="true" data-filtro="todas">Todas</button>
      ${C.categorias.map(([id, n]) => `<button type="button" aria-pressed="false" data-filtro="${id}">${n}</button>`).join('\n      ')}
    </div>
    <div class="gal-grade" data-galeria>
      ${C.galeria.map((g, k) => `<button type="button" class="gal-item${k % 5 === 0 ? ' alto' : ''}" data-cat="${g.cat}" data-foto="${src(g.foto)}" data-leg="${esc(g.leg)}">${foto(g.foto, { alt: g.leg })}<span class="gal-leg">${esc(g.leg)}<small>${C.categorias.find((c) => c[0] === g.cat)[1]}</small></span></button>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- dados para o navegador ----------
const dados = {
  marca: { nome: M.nome, completo: M.completo, whatsapp: M.whatsapp },
  horario: C.horario,
  servicos: C.servicos.map(({ id, nome, min, preco, de, pessoas, prof: p, sinal, turnos }) => ({ id, nome, min, preco, de, pessoas, prof: p, sinal, turnos })),
  equipe: C.equipe.map(({ id, nome, cargo }) => ({ id, nome, cargo })),
  pratos: C.pratos.map(({ id, nome, preco, de }) => ({ id, nome, preco, de })),
};

// ---------- montagem das páginas ----------
const ld = {
  '@context': 'https://schema.org', '@type': 'Restaurant', name: M.completo, servesCuisine: ['Hambúrguer', 'Lanches'], priceRange: 'R$ 20 a R$ 60',
  telephone: M.telefone, email: M.email, url: M.dominio, acceptsReservations: true,
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: M.coordenadas[0], longitude: M.coordenadas[1] },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: M.nota, reviewCount: M.avaliacoes },
};
const pagina = ({ arquivo, pg, titulo, descricao, corpo, comLd = false }) => {
  const html = `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${M.dominio}/${arquivo === 'index.html' ? '' : arquivo}">
<meta name="theme-color" content="${COR_CLARO}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:type" content="website">
<meta property="og:image" content="assets/img/capa.webp">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${T.head(CHAVE_TEMA)}
${fontes}
<link rel="stylesheet" href="assets/style.css">
${comLd ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ''}
</head>
<body data-pg="${pg}">
${topo(pg)}
<main id="conteudo">
${corpo}
</main>
${rodape(pg)}
${dialogs}
<script>window.AMASSA=${JSON.stringify(dados)};</script>
<script src="assets/app.js" defer></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, arquivo), html);
};

const corpoInicio = [capa, faixas, manifesto, dividir, destaques, cardapio, chapa, festas, equipeInicio, galeriaInicio, avaliacoes, instagram, delivery, agendar, politicas, duvidas, contato].join('\n');
pagina({ arquivo: 'index.html', pg: 'inicio', titulo: `${M.completo} | Smash burger na ${M.bairro}, Porto Alegre`, descricao: `Smash burger na ${M.bairro}, Porto Alegre: carne prensada na chapa, frango crocante, fritas, shakes e combos. Delivery, festas, oficina de smash e chapa no seu evento.`, corpo: corpoInicio, comLd: true });
pagina({ arquivo: 'equipe.html', pg: 'equipe', titulo: `Equipe | ${M.completo}`, descricao: 'Conheça a chef, o chapeiro, a responsável pelos shakes, o balcão e a equipe de festas da Amassa.', corpo: pgEquipe });
pagina({ arquivo: 'galeria.html', pg: 'galeria', titulo: `Galeria | ${M.completo}`, descricao: 'Fotos dos burgers, da chapa, dos shakes, do salão e das festas da Amassa.', corpo: pgGaleria });

// ---------- 404: arquivo único com o CSS dentro, funciona em qualquer endereço ----------
// O zero do "404" é uma bolinha de carne que a espátula desce e prensa até virar disco, sem parar.
const zero = `<svg class="z" viewBox="0 0 200 200" aria-hidden="true">
  <rect x="10" y="150" width="180" height="16" rx="4" fill="var(--chapa)"/>
  <g class="z-carne"><ellipse cx="100" cy="112" rx="44" ry="40" fill="#6B3A22"/><ellipse cx="88" cy="98" rx="14" ry="9" fill="#8E5232" opacity=".8"/><circle cx="114" cy="120" r="4" fill="#4A2616"/><circle cx="82" cy="126" r="3" fill="#4A2616"/></g>
  <g class="z-esp"><path d="M46 30h84l6 14H40Z" fill="var(--verm)"/><path d="M128 32 162 -20" stroke="var(--tinta)" stroke-width="10" stroke-linecap="round"/></g>
</svg>`;
const css404 = `:root{--papel:#F6EEDD;--tinta:#16130F;--texto:#4A4237;--verm:#D3261A;--verm-txt:#D3261A;--mostarda:#FFC21A;--chapa:#3B3B40;--borda:rgba(22,19,15,.2);color-scheme:light}
:root[data-tema="escuro"]{--papel:#140D0B;--tinta:#F6EEDD;--texto:#C7C2B6;--verm:#E8392B;--verm-txt:#FF8F7E;--chapa:#555863;--borda:rgba(246,238,221,.2);color-scheme:dark}
*{box-sizing:border-box;margin:0}
body{min-height:100vh;min-height:100svh;display:grid;place-items:center;padding:32px 16px;background:var(--papel);color:var(--texto);font:400 17px/1.6 'Familjen Grotesk','Helvetica Neue',Arial,sans-serif;overflow-x:hidden}
.c404{width:min(720px,100%);display:grid;justify-items:center;gap:16px;text-align:center}
.logo{color:var(--tinta);text-decoration:none;font:900 34px/1 'Anybody',Impact,sans-serif;font-stretch:130%;letter-spacing:-.01em}
.logo i{font-style:normal;display:inline-block}.logo .lp{transform:scaleY(.72) scaleX(1.12);transform-origin:bottom}
.num{display:flex;align-items:flex-end;gap:clamp(4px,1.5vw,12px);margin-top:20px;font:900 clamp(110px,26vw,220px)/.82 'Anybody',Impact,sans-serif;font-stretch:60%;color:var(--tinta)}
.z{width:.9em;height:.9em;overflow:visible}
.z-carne{transform-origin:100px 150px;animation:prensa 2.6s cubic-bezier(.6,0,.2,1) infinite}
.z-esp{animation:desce 2.6s cubic-bezier(.6,0,.2,1) infinite}
@keyframes prensa{0%,25%{transform:scale(1,1)}40%,85%{transform:scale(1.7,.28)}100%{transform:scale(1,1)}}
@keyframes desce{0%,15%{transform:translateY(-10px)}40%,80%{transform:translateY(98px)}100%{transform:translateY(-10px)}}
h1{font:900 clamp(2rem,6vw,3.4rem)/.95 'Anybody',Impact,sans-serif;font-stretch:70%;text-transform:uppercase;color:var(--tinta);text-wrap:balance}
h1 span{color:var(--verm-txt)}
.mao{font:400 1.3rem/1.2 'Gochi Hand',cursive;color:var(--verm-txt);rotate:-3deg}
.txt{max-width:44ch;text-wrap:pretty}
.btns{display:inline-grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:10px;margin-top:8px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;height:54px;padding:0 26px;border-radius:14px;font:800 15px/1 'Anybody',Impact,sans-serif;font-stretch:80%;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;white-space:nowrap;transition:transform .25s,box-shadow .25s}
.b1{color:#fff;background:var(--verm);box-shadow:0 4px 0 var(--tinta)}
.b2{color:var(--tinta);border:2px solid var(--tinta)}
.btn:hover{transform:translateY(-2px)}.b1:hover{box-shadow:0 6px 0 var(--tinta)}
.rodape{margin-top:14px;font-size:.92rem}
.rodape a{color:var(--verm-txt);font-weight:600;text-underline-offset:3px}
:focus-visible{outline:3px solid var(--mostarda);outline-offset:3px}
@media (max-width:520px){.btns{grid-auto-flow:row;width:100%}}
@media (prefers-reduced-motion:reduce){.z-carne,.z-esp{animation:none}.z-carne{transform:scale(1.7,.28)}.z-esp{transform:translateY(98px)}}`;
const html404 = `<!doctype html>
<html lang="pt-BR" data-tema="claro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página não encontrada | ${M.completo}</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="${COR_CLARO}">
${T.head(CHAVE_TEMA)}
${fontes}
<style>${css404}</style>
</head>
<body>
<main class="c404">
  <a class="logo" href="/" aria-label="${M.completo}, início">${I.logoTxt}</a>
  <p class="num" aria-label="404"><span>4</span>${zero}<span>4</span></p>
  <p class="mao">erro 404</p>
  <h1>Essa página foi <span>amassada demais</span></h1>
  <p class="txt">O endereço que você procurou saiu do cardápio ou mudou de lugar. A chapa continua quente: volte ao início ou veja o que está saindo hoje.</p>
  <div class="btns"><a class="btn b1" href="/">Voltar ao início</a><a class="btn b2" href="/#cardapio">Ver o cardápio</a></div>
  <p class="rodape">Com fome agora? <a href="https://wa.me/55${M.whatsapp.replace(/\D/g, '')}" target="_blank" rel="noopener">Peça pelo WhatsApp</a>.</p>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, '404.html'), html404);

// ---------- arquivos de apoio ----------
fs.mkdirSync(path.join(OUT, 'assets', 'img', 'logos'), { recursive: true });
for (const l of ['ifood.svg', '99.svg']) fs.copyFileSync(path.join(IMG, 'logos', l), path.join(OUT, 'assets', 'img', 'logos', l));
for (const n of usadas) fs.copyFileSync(path.join(IMG, `${n}.webp`), path.join(OUT, 'assets', 'img', `${n}.webp`));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#D3261A"/><ellipse cx="24" cy="30" rx="15" ry="6" fill="#FFC21A"/><path d="M10 14h22l2 5H8Z" fill="#F6EEDD"/><path d="M31 15l7-10" stroke="#F6EEDD" stroke-width="4" stroke-linecap="round"/></svg>');
fs.writeFileSync(path.join(OUT, 'assets', 'style.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
fs.writeFileSync(path.join(OUT, 'assets', 'app.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + T.js(CHAVE_TEMA, COR_CLARO, COR_ESCURO));
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${M.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['', 'equipe.html', 'galeria.html'].map((p) => `  <url><loc>${M.dominio}/${p}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`ok: ${path.relative(process.cwd(), OUT)} (${usadas.size} fotos)`);
