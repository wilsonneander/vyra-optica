// Gera o Gold de salão de beleza com barbearia (Mecha Salão & Barbearia, marca fictícia) em "templates/Salões de Beleza/gold/".
// Desenho baseado na referência pedida pelo cliente (capa em foto cheia, faixa corrida, colunas que abrem, cardápio em sanfona,
// cartões que se empilham, antes e depois, equipe, visita em rolagem lateral, lookbook em arco, dúvidas e agendamento).
// Os segmentos ligam e desligam em content.js. A página se monta conforme a rolagem e se desfaz ao voltar.
// Uso: node "templates/Salões de Beleza/_build-gold/build.js"
const fs = require('fs');
const path = require('path');
const C = require(process.env.CONTEUDO || './content');
const I = require('./icons');

const OUT = path.join(__dirname, '..', 'gold');
const FOTOS = path.join(__dirname, 'img', 'fotos');
const M = C.marca;

// ---------- segmentos ligados ----------
const ligados = C.segmentos.filter((s) => s.ativo).map((s) => s.id);
const ligado = (seg) => !seg || (Array.isArray(seg) ? seg.some((x) => ligados.includes(x)) : ligados.includes(seg));
const segPor = Object.fromEntries(C.segmentos.map((s) => [s.id, s]));
const SERV = C.servicos.filter((s) => ligado(s.seg));
const LADOS = [['salao', 'Salão'], ['barbearia', 'Barbearia']].filter(([l]) => C.segmentos.some((s) => s.lado === l && s.ativo && s.id !== 'planos'));
const temPlanos = ligado('planos') && C.planos.some((p) => ligado(p.seg));
const EQUIPE = C.equipe.map((p) => ({ ...p, faz: p.faz.filter(ligado) })).filter((p) => p.faz.length);
const temSalao = LADOS.some(([l]) => l === 'salao'), temBarba = LADOS.some(([l]) => l === 'barbearia');
const tipoCasa = temSalao && temBarba ? 'Salão e barbearia' : temSalao ? 'Salão de beleza' : 'Barbearia';

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${M.rua}, ${M.bairro}, ${M.cidade}`)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
const reais = (v) => `R$ ${v.toLocaleString('pt-BR')}`;
const minutos = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
const tit = (a, b) => `${esc(a)} <em>${esc(b)}</em>`;
const hora = (h) => `${Math.floor(h)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;
const DIAS_C = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const lista = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} e ${a.at(-1)}`);

// resumo da agenda de cada profissional: junta dias seguidos com o mesmo horário ("Ter a qua, 10h às 19h")
const resumoAgenda = (ag) => {
  const grupos = [];
  for (let d = 1; d <= 7; d++) {
    const dia = d % 7, h = ag[dia];
    if (!h) continue;
    const ult = grupos.at(-1);
    if (ult && ult.h.join() === h.join() && ult.fim === (d - 1)) { ult.fim = d; ult.dias.push(dia); } else grupos.push({ h, ini: d, fim: d, dias: [dia] });
  }
  return grupos.map((g) => {
    const ds = g.dias.length > 2 ? `${DIAS_C[g.dias[0]]} a ${DIAS_C[g.dias.at(-1)].toLowerCase()}` : g.dias.map((x, k) => (k ? DIAS_C[x].toLowerCase() : DIAS_C[x])).join(' e ');
    return [ds, `${hora(g.h[0])} às ${hora(g.h[1])}`];
  });
};

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
const usadas = new Set();
const faltando = [];
const foto = (nome, { cls = '', lazy = true, alt, attrs = '' } = {}) => {
  const desc = alt ?? C.fotos[nome] ?? '';
  if (!fs.existsSync(path.join(FOTOS, `${nome}.webp`))) faltando.push(nome);
  usadas.add(nome);
  return `<img class="${cls}" src="assets/img/${nome}.webp" alt="${esc(desc)}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}${attrs}>`;
};

const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400..700&family=Golos+Text:wght@400;500;600&display=swap" rel="stylesheet">';

// ---------- dados para o navegador ----------
const dados = {
  whatsapp: M.whatsapp, nome: M.completo, abertura: C.abertura,
  servicos: SERV.map(({ id, seg, nome, min, preco, de }) => ({ id, seg, nome, min, preco, de: !!de })),
  equipe: EQUIPE.map(({ id, nome, cargo, faz, agenda }) => ({ id, nome, cargo, faz, agenda })),
};

// ---------- topo ----------
const nav = [['espaco', 'O espaço'], ['precos', 'Serviços'], ['equipe', 'Equipe'], temPlanos && ['planos', 'Planos'], ['duvidas', 'Dúvidas'], ['contato', 'Contato']].filter(Boolean);
const topo = `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo" id="topo">
  <div class="topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="menu" id="menu" aria-label="Principal">
      ${nav.map(([id, t], k) => `<a href="#${id}" style="--k:${k}">${t}</a>`).join('\n      ')}
      <a class="btn btn-claro menu-agendar" href="#agendar" style="--k:${nav.length}">Agendar horário ${I.seta}</a>
      <p class="menu-rodape" style="--k:${nav.length + 1}">${M.endereco}, ${M.bairro}<br>WhatsApp ${M.whatsappTexto}</p>
    </nav>
    <div class="topo-acoes">
      <a class="btn btn-claro btn-agendar" href="#agendar">Agendar horário ${I.seta}</a>
      <button type="button" class="menu-btn" aria-controls="menu" aria-expanded="false" aria-label="Abrir o menu"><span></span><span></span></button>
    </div>
  </div>
</header>`;

// ---------- capa ----------
const capaFotos = ['capa', temSalao && 'escova', 'espaco-equipe'].filter(Boolean);
const destaque = SERV.find((s) => s.id === 'combo-cb') || SERV.find((s) => s.id === 'degrade') || SERV.find((s) => s.id === 'escova-mod') || SERV[0];
const destaqueFoto = { 'combo-cb': 'corte-m3', degrade: 'corte-m3', 'escova-mod': 'escova3' }[destaque.id] || 'capa';
const capa = `<section class="capa" id="inicio" aria-label="Apresentação">
  <div class="capa-quadro">
    <div class="capa-fotos" data-capa>
      ${capaFotos.map((f, k) => foto(f, { cls: `capa-foto${k ? '' : ' ativa'}`, lazy: k > 0, alt: k ? '' : C.fotos[f] })).join('\n      ')}
    </div>
    <div class="capa-veu" aria-hidden="true"></div>
    <div class="capa-txt">
      <p class="sobre">${tipoCasa} na ${M.bairro}</p>
      <h1 class="capa-tit"><span class="ln"><span>A arte do</span></span><span class="ln"><span>cabelo bem feito.</span></span></h1>
      <p class="capa-lead">${temSalao && temBarba ? 'Cortes, escova, cor e barba para todo tipo de cabelo, no mesmo piso.' : temSalao ? 'Cortes, escova e cor para todo tipo de cabelo.' : 'Corte, barba e acabamento na navalha para todo tipo de cabelo.'} Do jeito que você usa no dia a dia e no tempo que o serviço pede.</p>
      <div class="capa-btns" data-iguais>
        <a class="btn btn-claro" href="#agendar">Agendar horário ${I.seta}</a>
        <a class="btn btn-vidro" href="#precos">Ver serviços ${I.seta}</a>
      </div>
      <a class="capa-cartao" href="#agendar" data-servico="${destaque.id}">
        ${foto(destaqueFoto, { alt: '' })}
        <span><small>O mais agendado da semana</small><b>${esc(destaque.nome)}</b><em>${minutos(destaque.min)}, ${destaque.de ? 'a partir de ' : ''}${reais(destaque.preco)}</em></span>
        ${I.diag}
      </a>
    </div>
    ${capaFotos.length > 1 ? `<div class="capa-pontos" role="tablist" aria-label="Fotos da capa">${capaFotos.map((f, k) => `<button type="button" role="tab" aria-selected="${!k}" aria-label="Foto ${k + 1} de ${capaFotos.length}" data-capa-ir="${k}"></button>`).join('')}</div>` : ''}
  </div>
</section>`;

// ---------- faixa corrida ----------
const faixaItens = C.faixa.filter(([s]) => ligado(s)).map(([, t]) => `<span>${esc(t)}</span>${I.sep}`).join('');
const faixa = `<div class="faixa" aria-hidden="true"><div class="faixa-trilho"><div>${faixaItens}</div><div>${faixaItens}</div></div></div>`;

// ---------- o espaço ----------
const espacoTxt = temSalao && temBarba
  ? ['Degradês', 'e', 'escovas,', 'barbas', 'e', 'balayage.', 'Um', 'endereço,', 'um', '*padrão,', 'e', 'cada', 'cabelo', 'tratado', 'com', 'o', 'mesmo', 'cuidado.']
  : temSalao ? ['Cortes', 'em', 'camadas,', 'escovas', 'e', 'balayage.', 'Um', 'endereço,', 'um', '*padrão,', 'e', 'cada', 'cabelo', 'tratado', 'com', 'o', 'mesmo', 'cuidado.']
    : ['Degradês,', 'barbas', 'e', 'pigmentação.', 'Uma', 'cadeira,', 'um', '*padrão,', 'e', 'cada', 'cliente', 'tratado', 'com', 'o', 'mesmo', 'cuidado.'];
const COLS = C.colunas.filter((c) => ligado(c.seg)).slice(0, 5);
const espaco = `<section class="espaco" id="espaco">
  <div class="largo espaco-cab">
    <div>
      <p class="sobre">O espaço</p>
      <p class="pinta" data-pinta>${espacoTxt.map((p) => `<span${p[0] === '*' ? ' class="tom"' : ''}>${esc(p.replace('*', ''))}</span>`).join(' ')}</p>
    </div>
    <div class="espaco-lado">
      <p class="nota-google"><span class="estrelas" aria-hidden="true">${I.estrela.repeat(5)}</span><span><b data-conta="${M.nota}" data-casas="1">${String(M.nota).replace('.', ',')}</b> de <b data-conta="${M.avaliacoes}">${M.avaliacoes.toLocaleString('pt-BR')}</b> avaliações no Google</span></p>
      <p>${EQUIPE.length} profissionais e um piso aberto. Toda visita começa com uma conversa de verdade no espelho, para você saber o plano e o valor antes de começarmos.</p>
      <a class="btn btn-linha" href="#agendar">Marcar uma conversa ${I.seta}</a>
    </div>
  </div>
  ${COLS.length > 1 ? `<div class="largo colunas" style="--n:${COLS.length}">
    ${COLS.map((c, k) => `<a class="coluna${k === Math.floor(COLS.length / 2) ? ' aberta' : ''}" href="#precos" data-aba-ir="${segPor[c.seg].lado}">
      ${foto(c.foto, { alt: '' })}
      <span class="coluna-txt"><b>${esc(c.titulo)}</b><small>${esc(c.texto)}</small></span>
    </a>`).join('\n    ')}
  </div>` : ''}
</section>`;

// ---------- cardápio ----------
const CATS = C.categorias.filter((c) => ligado(c.seg));
const item = (s) => `<li class="item">
            <div><h4>${esc(s.nome)}</h4><p>${esc(s.inclui)}</p></div>
            <div class="item-valor"><b>${s.de ? '<small>a partir de</small> ' : ''}${reais(s.preco)}</b>${s.antes ? `<s>${reais(s.antes)}</s>` : ''}<span>${minutos(s.min)}</span></div>
          </li>`;
const cardapio = `<section class="precos" id="precos">
  <div class="largo">
    <div class="sec-cab">
      <div><p class="sobre">Serviços e preços</p><h2>${tit('Um cardápio para', 'todo tipo de cabelo.')}</h2></div>
      <p>O preço sai do tempo que o serviço leva e do comprimento do cabelo, nunca de quem senta na cadeira. O valor final é combinado na conversa, antes do primeiro corte.</p>
    </div>
    ${LADOS.length > 1 ? `<div class="lados" role="tablist" aria-label="Lado da casa" data-iguais>${LADOS.map(([l, t], k) => `<button type="button" role="tab" id="aba-${l}" aria-controls="lado-${l}" aria-selected="${!k}" data-lado="${l}">${t}</button>`).join('')}</div>` : ''}
    ${LADOS.map(([l], k) => `<div class="lado" id="lado-${l}" role="${LADOS.length > 1 ? 'tabpanel' : 'region'}" aria-labelledby="aba-${l}"${k ? ' hidden' : ''}>
      ${CATS.filter((c) => segPor[c.seg].lado === l).map((c, j) => `<details class="cat"${j ? '' : ' open'}>
        <summary><span class="cat-tit"><h3>${esc(c.titulo)}</h3><span class="tags" data-iguais>${c.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</span></span><span class="cat-btn" aria-hidden="true">${I.mais}${I.menos}</span></summary>
        <div class="cat-corpo">
          <div class="cat-foto">${foto(c.foto, { alt: C.fotos[c.foto] })}</div>
          <div class="cat-lista">
            <p class="cat-txt">${esc(c.texto)}</p>
            <ul>
          ${SERV.filter((s) => s.seg === c.seg).map(item).join('\n          ')}
            </ul>
            <a class="btn btn-escuro" href="#agendar" data-servico="${SERV.find((s) => s.seg === c.seg)?.id || ''}">Agendar este serviço ${I.seta}</a>
          </div>
        </div>
      </details>`).join('\n      ')}
    </div>`).join('\n    ')}
    <div class="pagamento">
      <div><h3>Formas de pagamento</h3><ul class="chips" data-iguais>${C.pagamento.filter((p) => p !== 'Plano mensal' || temPlanos).map((p) => `<li>${p}</li>`).join('')}</ul></div>
      <p>Crédito em até 3 vezes sem juros a partir de R$ 300. Cor e química acima de R$ 300 pedem sinal de 30% via Pix, abatido no valor final. Valores "a partir de" variam com o comprimento e o volume. <a href="#politicas">Ver as políticas de agendamento, cancelamento e garantia</a>.</p>
    </div>
  </div>
</section>`;

// ---------- quatro motivos ----------
const motivos = `<section class="motivos escura" id="motivos">
  <div class="largo">
    <div class="sec-cab">
      <div><p class="sobre">Por que a ${M.nome}</p><h2>${tit('Quatro motivos para', 'voltar.')}</h2></div>
      <div><p>Muita gente chega para um corte e fica anos. É isso que faz uma cadeira na ${M.nome} ser diferente.</p><a class="btn btn-claro" href="#agendar">Agendar horário ${I.seta}</a></div>
    </div>
    <div class="pilha">
      ${C.motivos.filter((m) => !m.ambos || (temSalao && temBarba)).map((m) => (!temSalao && m.fotoBarbearia ? { ...m, foto: m.fotoBarbearia } : m)).map((m, k) => `<article class="cartao" style="--k:${k}">
        <div class="cartao-txt"><h3>${esc(m.titulo)}</h3><p>${esc(m.texto)}</p><ul class="chips" data-iguais>${m.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
        <div class="cartao-foto">${foto(m.foto, { alt: C.fotos[m.foto] })}</div>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- antes e depois ----------
const TRANS = C.transformacoes.filter((t) => ligado(t.seg));
const profNome = (id) => { const p = C.equipe.find((x) => x.id === id); return p ? `${p.nome.split(' ')[0]}, ${p.cargo.toLowerCase()}` : ''; };
const resultados = TRANS.length ? `<section class="resultados" id="resultados">
  <div class="largo">
    <div class="sec-cab">
      <div><p class="sobre">Antes e depois</p><h2>${tit('Resultados,', 'lado a lado.')}</h2></div>
      <p>Arraste a alça para comparar. No site da casa entram fotos das próprias cadeiras, feitas no dia e publicadas com autorização de quem foi atendido.</p>
    </div>
    ${TRANS.length > 1 ? `<div class="trans-abas" role="tablist" aria-label="Transformações">${TRANS.map((t, k) => `<button type="button" role="tab" aria-selected="${!k}" data-trans="${k}">${esc(t.aba)}</button>`).join('')}</div>` : ''}
    ${TRANS.map((t, k) => `<div class="trans" data-trans-painel="${k}"${k ? ' hidden' : ''}>
      <div class="compara" style="--x:50%">
        ${foto(t.depois, { cls: 'depois' })}
        <div class="antes-caixa">${foto(t.antes, { cls: 'antes' })}</div>
        <span class="rot rot-antes">Antes</span><span class="rot rot-depois">Depois</span>
        <span class="alca" aria-hidden="true">${I.arrasta}</span>
        <input type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois: ${esc(t.aba)}">
      </div>
      <div class="trans-txt">
        <h3>${esc(t.titulo)}</h3><p>${esc(t.texto)}</p>
        <dl><div><dt>Serviço</dt><dd>${esc(t.servico)}</dd></div><div><dt>Tempo na cadeira</dt><dd>${esc(t.tempo)}</dd></div>${ligado(C.equipe.find((p) => p.id === t.prof)?.faz) ? `<div><dt>Profissional</dt><dd>${esc(profNome(t.prof))}</dd></div>` : ''}</dl>
        <a class="btn btn-linha" href="#agendar">Quero esse resultado ${I.seta}</a>
      </div>
    </div>`).join('\n    ')}
    <p class="aviso">Imagens ilustrativas de bancos de imagem. O resultado varia com o tipo de fio, o histórico de química e os cuidados em casa.</p>
  </div>
</section>` : '';

// ---------- equipe ----------
const equipe = `<section class="equipe" id="equipe">
  <div class="largo equipe-in">
    <div class="sec-cab-col">
      <div><p class="sobre">Equipe</p><h2>${tit('As mãos por trás', 'de cada cadeira.')}</h2></div>
      <p>Cabeleireiras, coloristas e barbeiros que dividem o mesmo piso. Marque com a pessoa, não só com o serviço. Os horários abaixo são os de cada um.</p>
      <a class="btn btn-escuro" href="#agendar">Agendar com a equipe ${I.seta}</a>
    </div>
    <div class="pessoas">
      ${EQUIPE.map((p) => `<article class="pessoa">
        <div class="pessoa-foto">${foto(p.foto, { alt: C.fotos[p.foto] })}</div>
        <p class="cargo">${esc(p.cargo)}</p><h3>${esc(p.nome)}</h3><p class="esp">${esc(p.esp)}</p>
        <table class="agenda-p"><caption>Horários de ${esc(p.nome.split(' ')[0])}</caption>${resumoAgenda(p.agenda).map(([d, h]) => `<tr><th scope="row">${d}</th><td>${h}</td></tr>`).join('')}</table>
        <a class="link-seta" href="#agendar" data-prof="${p.id}">Agendar com ${esc(p.nome.split(' ')[0])} ${I.seta}</a>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- a visita ----------
const visita = `<section class="visita escura" id="visita">
  <div class="visita-fixa">
    <div class="largo">
      <div class="sec-cab">
        <div><p class="sobre">Sua visita</p><h2>${tit('Do primeiro oi', 'ao último espelho.')}</h2></div>
        <div><p>Quatro momentos, sem pressa e sem surpresa. É assim que funciona cada visita à ${M.nome}.</p><a class="btn btn-claro" href="#agendar">Agendar horário ${I.seta}</a></div>
      </div>
    </div>
    <div class="trilho-janela">
      <ol class="trilho">
        ${C.visita.map((v) => `<li class="passo">
          <div class="passo-foto">${foto(v.foto, { alt: '' })}</div>
          <span class="marco" aria-hidden="true"></span>
          <h3>${esc(v.titulo)}</h3><p>${esc(v.texto)}</p><span class="tempo">${I.relogio}${esc(v.tempo)}</span>
        </li>`).join('\n        ')}
      </ol>
    </div>
  </div>
</section>`;

// ---------- planos ----------
const planos = temPlanos ? `<section class="planos" id="planos">
  <div class="largo">
    <div class="sec-cab">
      <div><p class="sobre">Planos mensais da barbearia</p><h2>${tit('Cabelo e barba em dia', 'o mês inteiro.')}</h2></div>
      <p>Para quem corta a cada quinze dias e não quer pensar no valor toda vez. Assinatura pelo WhatsApp, cobrança no cartão e horário marcado como sempre.</p>
    </div>
    <div class="planos-grade">
      ${C.planos.filter((p) => ligado(p.seg)).map((p) => `<article class="plano${p.destaque ? ' destaque' : ''}">
        ${p.destaque ? '<p class="plano-selo">O mais escolhido</p>' : ''}
        <h3>${esc(p.nome)}</h3>
        <p class="plano-preco"><b>${reais(p.mensal)}</b><span>por mês</span></p>
        <ul>${p.inclui.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        <a class="btn ${p.destaque ? 'btn-claro' : 'btn-escuro'}" href="${wa(`Olá! Quero assinar o ${p.nome} (${reais(p.mensal)} por mês) da ${M.completo}.`)}" target="_blank" rel="noopener">Assinar pelo WhatsApp ${I.seta}</a>
      </article>`).join('\n      ')}
    </div>
    <ul class="planos-regras">${C.planosRegras.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
  </div>
</section>` : '';

// ---------- avaliações ----------
const avaliacoes = `<section class="avaliacoes" id="avaliacoes">
  <div class="largo">
    <p class="nota-google"><span class="estrelas" aria-hidden="true">${I.estrela.repeat(5)}</span><span><b>${String(M.nota).replace('.', ',')}</b> de ${M.avaliacoes.toLocaleString('pt-BR')} avaliações no Google</span></p>
    <div class="aval" data-aval>
      <div class="aval-txt">
        ${I.aspas}
        ${C.depoimentos.map((d, k) => `<figure class="aval-item${k ? '' : ' ativo'}" data-aval-item="${k}"${k ? ' hidden' : ''}><blockquote>${esc(d.texto)}</blockquote><figcaption><b>${esc(d.nome)}</b><span>${esc(d.serv)}</span></figcaption></figure>`).join('\n        ')}
        <div class="aval-rostos" role="tablist" aria-label="Escolher avaliação">${C.depoimentos.map((d, k) => `<button type="button" role="tab" aria-selected="${!k}" aria-label="${esc(d.nome)}" data-aval-ir="${k}">${foto(d.foto, { alt: '' })}</button>`).join('')}</div>
      </div>
      <div class="aval-foto">${C.depoimentos.map((d, k) => foto(d.foto, { cls: k ? '' : 'ativa', alt: k ? '' : `Retrato de ${d.nome}` })).join('')}</div>
    </div>
  </div>
  <div class="faixa-aval" aria-label="Avaliações curtas"><div class="faixa-trilho"><ul>${C.curtos.map(([t, n]) => `<li>${I.estrela}<b>${esc(t)}</b><span>${esc(n)}</span></li>`).join('')}</ul><ul aria-hidden="true">${C.curtos.map(([t, n]) => `<li>${I.estrela}<b>${esc(t)}</b><span>${esc(n)}</span></li>`).join('')}</ul></div></div>
  <p class="largo aviso">Avaliações e nomes fictícios deste modelo. No site da casa entram as avaliações públicas do Google.</p>
</section>`;

// ---------- lookbook ----------
const lookbook = `<section class="lookbook" id="lookbook">
  <div class="largo">
    <div class="sec-cab">
      <div><p class="sobre">Lookbook</p><h2>${tit('Recém-saídos', 'da cadeira.')}</h2></div>
      <div><p>Cortes, cor e barba que passaram pelo nosso piso. Role a página para girar a roda.</p><a class="btn btn-linha" href="#agendar">Quero um desses ${I.seta}</a></div>
    </div>
  </div>
  <div class="arco" data-arco aria-hidden="true">
    ${C.lookbook.map((f, k) => `<div class="arco-card" style="--i:${k}">${foto(f, { alt: '' })}</div>`).join('\n    ')}
  </div>
</section>`;

// ---------- políticas e higiene ----------
const politicas = `<section class="cuidados" id="politicas">
  <div class="largo">
    <div class="sec-cab">
      <div><p class="sobre">Políticas e higiene</p><h2>${tit('Tudo combinado', 'antes de começar.')}</h2></div>
      <p>Regras simples de agendamento, atraso, cancelamento e garantia. Para cor e química, o cuidado é dobrado.</p>
    </div>
    <div class="regras">
      ${C.politicas.map((p) => `<article class="regra${p.destaque ? ' forte' : ''}"><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></article>`).join('\n      ')}
    </div>
    <div class="higiene">
      <div class="higiene-foto">${foto('produtos', { alt: C.fotos.produtos })}</div>
      <div class="higiene-txt">
        <h3>Higiene e material</h3>
        <ul>${C.higiene.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
        <p class="rt">Responsável técnica pelos produtos químicos: ${esc(C.responsavel.nome)}, ${esc(C.responsavel.cargo.split(' e ')[0].toLowerCase())}.</p>
      </div>
    </div>
  </div>
</section>`;

// ---------- dúvidas ----------
const duvidas = `<section class="duvidas" id="duvidas">
  <div class="largo duvidas-in">
    <div class="sec-cab-col">
      <p class="sobre">Dúvidas</p><h2 data-palavras>${tit('Perguntas,', 'respondidas.')}</h2>
      <p>Não achou o que procura? Ligue para o salão que a gente explica.</p>
      <a class="btn btn-linha" href="tel:${M.telefone.replace(/\D/g, '')}">Ligar para o salão ${I.seta}</a>
    </div>
    <div class="faq">
      ${C.faq.map(([q, r], k) => `<details${k ? '' : ' open'}><summary>${esc(q)}<span class="cat-btn" aria-hidden="true">${I.mais}${I.menos}</span></summary><p>${esc(r)}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- agendamento ----------
const optServ = LADOS.map(([l, t]) => `<optgroup label="${t}">${CATS.filter((c) => segPor[c.seg].lado === l).map((c) => SERV.filter((s) => s.seg === c.seg).map((s) => `<option value="${s.id}">${esc(s.nome)}</option>`).join('')).join('')}</optgroup>`).join('');
const agendar = `<section class="agendar" id="agendar">
  <div class="largo agendar-in">
    <div class="agendar-info escura">
      <p class="sobre">Agendamento</p>
      <h2 data-palavras>${tit('Marque sua', 'cadeira.')}</h2>
      <p>Mande o pedido e confirmamos o horário em até uma hora, no horário de funcionamento. Prefere falar? Chame no WhatsApp.</p>
      <dl class="info-grade">
        <div><dt>Endereço</dt><dd>${M.endereco}, ${M.bairro}</dd></div>
        <div><dt>Funcionamento</dt><dd>Ter a sáb, a partir das 9h<br>Seg, barbearia das 10h às 20h</dd></div>
        <div><dt>Telefone</dt><dd><a href="tel:${M.telefone.replace(/\D/g, '')}">${M.telefone}</a></dd></div>
        <div><dt>E-mail</dt><dd><a href="mailto:${M.email}">${M.email}</a></dd></div>
      </dl>
      <a class="btn btn-claro" href="${wa(`Olá! Quero marcar um horário na ${M.completo}.`)}" target="_blank" rel="noopener">${I.whats}Chamar no WhatsApp</a>
    </div>
    <form class="form" id="form-agenda" novalidate>
      <h3>Pedir um horário</h3>
      <p class="form-nota">Campos com * são obrigatórios.</p>
      <div class="campos">
        <label><span>Nome *</span><input name="nome" autocomplete="name" required placeholder="Seu nome completo"></label>
        <label><span>Telefone ou WhatsApp *</span><input name="tel" type="tel" autocomplete="tel" inputmode="tel" required placeholder="(11) 90000-0000"></label>
        <label><span>E-mail</span><input name="email" type="email" autocomplete="email" placeholder="voce@email.com"></label>
        <label><span>Serviço *</span><select name="servico" required><option value="">Escolha um serviço</option>${optServ}</select></label>
        <label><span>Profissional</span><select name="prof"><option value="">Sem preferência</option></select></label>
        <label><span>Data *</span><input name="data" type="date" required></label>
        <label class="largura"><span>Horário *</span><select name="hora" required disabled><option value="">Escolha serviço e data primeiro</option></select></label>
        <label class="largura"><span>Algo que devemos saber?</span><textarea name="obs" rows="3" placeholder="Tipo de cabelo, o resultado que você quer, química recente, alergias"></textarea></label>
      </div>
      <p class="form-aviso" data-aviso-quimica hidden>Este serviço tem química: o teste de mecha ou de sensibilidade é feito antes, com 48 horas de antecedência para quem nunca fez química aqui.</p>
      <label class="aceite"><input type="checkbox" name="lgpd" required><span>Li a <button type="button" class="link" data-doc="privacidade">Política de Privacidade</button> e autorizo o uso do meu nome, telefone e e-mail só para responder a este pedido de agendamento. *</span></label>
      <label class="aceite"><input type="checkbox" name="novidades"><span>Quero receber lembretes de horário e novidades pelo WhatsApp. Posso cancelar quando quiser.</span></label>
      <p class="form-erro" role="alert" hidden></p>
      <button class="btn btn-escuro" type="submit">Enviar pedido pelo WhatsApp ${I.seta}</button>
      <div class="form-ok" role="status" hidden></div>
    </form>
  </div>
</section>`;

// ---------- rodapé ----------
const creditos = JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'creditos.json'), 'utf8'));
const dias = C.horarios.map(([d, h], i) => `<tr data-dia="${i}"><th scope="row">${d}</th><td>${h}</td></tr>`).join('');
const rodape = `<footer class="rodape escura" id="contato">
  <div class="largo">
    <div class="rodape-cta">
      <h2 data-palavras>${tit('Pronto para o', 'próximo corte?')}</h2>
      <a class="btn btn-claro" href="#agendar">Agendar horário ${I.seta}</a>
    </div>
    <div class="mapa-linha">
      <div class="map-box">
        <img src="assets/img/mapa_vila-madalena.webp" alt="Mapa da ${M.bairro}, ${M.cidade}, com a localização da ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${endereco}, CEP ${M.cep}</span><span>Ter a sex, 9h às 20h ou 21h. Sáb, 9h às 18h. Seg, barbearia das 10h às 20h</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Só no salão, com hora marcada (a barbearia também recebe quem chega, se houver cadeira livre). Clientes destes bairros chegam a pé ou em poucos minutos.</p>
        <ul class="bairros" data-iguais>${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
        <table class="horas"><caption>Horário de funcionamento</caption>${dias}</table>
      </div>
    </div>
    <div class="rodape-cols">
      <div class="rodape-marca"><a class="logo" href="#inicio" aria-label="${M.completo}">${I.logo}</a><p>${esc(M.frase)}</p></div>
      <div><h3>Navegue</h3><ul>${nav.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}<li><a href="#politicas">Políticas e higiene</a></li></ul></div>
      <div><h3>Canais de atendimento</h3><ul><li><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li><li><a href="tel:${M.telefone.replace(/\D/g, '')}">Telefone ${M.telefone}</a></li><li><a href="mailto:${M.email}">${M.email}</a></li><li><a href="#agendar">Agendamento online</a></li></ul></div>
      <div><h3>Redes</h3>
        <div class="redes" data-iguais>
          <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
          <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
          <a href="${M.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${I.linkedin}</a>
          <a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener" aria-label="WhatsApp Business">${I.whats}</a>
        </div>
        <p class="arroba">${M.instagramUser}</p>
      </div>
    </div>
    <div class="legal">
      <p><b>${M.razao}</b>, CNPJ ${M.cnpj}. ${endereco}, CEP ${M.cep}. Telefone ${M.telefone}. ${M.email}.</p>
      <p>Responsável técnica pelos produtos químicos: ${esc(C.responsavel.nome)}. Produtos de cor, química e pigmentação com registro ou notificação na Anvisa. Material esterilizado em autoclave ou descartável. Licença sanitária municipal em dia.</p>
      <div class="legal-links"><button type="button" class="link" data-doc="servico">Termos de prestação de serviço</button><button type="button" class="link" data-doc="uso">Termos de uso</button><button type="button" class="link" data-doc="privacidade">Política de privacidade</button><button type="button" class="link" data-cookies>Preferências de cookies</button></div>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditos.filter((c) => usadas.has(c.arq)).map((c) => `<li>${esc(c.arq)}: ${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.autor)}, ${esc(c.fonte)}</a>` : `${esc(c.autor)}`}</li>`).join('')}</ul></details>
      <p class="modelo">Modelo de site com marca, pessoas, preços e avaliações fictícios. © ${new Date().getFullYear()} ${M.completo}.</p>
    </div>
  </div>
</footer>
<a class="whats-flutua" href="${wa(`Olá! Vim pelo site da ${M.completo}.`)}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${I.whats}<span>WhatsApp</span></a>`;

// ---------- janelas legais e cookies ----------
const legal = {
  servico: ['Termos de prestação de serviço', `
    <h3>Agendamento e confirmação</h3><p>O horário só está garantido depois da confirmação da ${M.completo} pelo WhatsApp, telefone ou e-mail. Serviços de cor e química acima de R$ 300 pedem sinal de 30% via Pix, abatido no valor final.</p>
    <h3>Valores</h3><p>Os preços do site são de referência. Valores "a partir de" dependem do comprimento, do volume e do estado do fio e são fechados na conversa antes do serviço. Nenhum valor é alterado sem o seu aceite.</p>
    <h3>Atraso, cancelamento e remarcação</h3><p>Tolerância de 15 minutos. Cancelamento sem custo até 24 horas antes. Com menos de 24 horas, o sinal vira crédito para nova data em até 60 dias. Duas faltas sem aviso pedem sinal nos agendamentos seguintes.</p>
    <h3>Coloração, química e pigmentação</h3><p>Teste de mecha ou de sensibilidade obrigatório. O profissional pode recusar ou adiar o serviço quando o fio ou a pele não estiverem em condições, explicando o motivo. Informe alergias, gestação, medicamentos e químicas recentes.</p>
    <h3>Garantia</h3><p>Cortes e escovas: ajuste sem custo em até 7 dias. Coloração e mechas: retoque de tom sem custo em até 15 dias, desde que seguidos os cuidados indicados. A garantia não cobre mudança de ideia sobre o resultado combinado nem danos por produtos ou procedimentos feitos fora do salão.</p>
    <h3>Planos mensais</h3><p>Cobrança recorrente no cartão, sem fidelidade, com cancelamento mediante aviso de 30 dias. Uso pessoal e intransferível; visitas não usadas não acumulam.</p>
    <h3>Higiene</h3><p>Material esterilizado em autoclave ou descartável e produtos com registro ou notificação na Anvisa. Texto a validar na revisão jurídica antes da publicação.</p>`],
  uso: ['Termos de uso', `
    <p>Este site apresenta os serviços da ${M.completo} (${M.razao}, CNPJ ${M.cnpj}) e recebe pedidos de agendamento. Ao usar o site, você concorda com estes termos.</p>
    <h3>Conteúdo</h3><p>Textos, marcas e imagens pertencem à ${M.nome} ou a seus autores, conforme os créditos. Fotos de clientes só são publicadas com autorização por escrito.</p>
    <h3>Pedidos de agendamento</h3><p>O formulário envia o pedido pelo WhatsApp. O horário só vale depois da nossa confirmação.</p>
    <h3>Links externos</h3><p>Mapas, redes sociais e WhatsApp abrem serviços de terceiros, com políticas próprias.</p>`],
  privacidade: ['Política de privacidade', `
    <p>A ${M.razao} (CNPJ ${M.cnpj}) trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
    <h3>Dados que coletamos</h3><p>Nome, telefone, e-mail, serviço, profissional, data e observações que você escreve no formulário. Na ficha técnica de química, guardamos o histórico de cor, os testes e eventuais alergias informadas, que são dados sensíveis e só são usados para a sua segurança no atendimento.</p>
    <h3>Para que usamos</h3><p>Responder ao pedido, confirmar e lembrar o horário e registrar o serviço feito. Novidades e promoções só com o seu consentimento, que pode ser retirado a qualquer momento.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins de publicidade. O pedido trafega pelo WhatsApp (Meta) e os pagamentos pelo processador do cartão ou do Pix.</p>
    <h3>Por quanto tempo</h3><p>Pedidos sem atendimento são apagados em 6 meses. Fichas de cliente ficam enquanto houver relação com o salão e pelo prazo legal depois dela.</p>
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
  '@context': 'https://schema.org', '@type': temBarba && !temSalao ? 'BarberShop' : 'HairSalon', name: M.completo, url: M.dominio,
  image: `${M.dominio}/assets/img/capa.webp`, telephone: M.telefone, email: M.email, priceRange: 'R$ 25 a R$ 480',
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: -23.5564, longitude: -46.6893 },
  openingHoursSpecification: Object.entries(C.abertura).filter(([, h]) => h).map(([d, h]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d], opens: `${String(h[0]).padStart(2, '0')}:00`, closes: `${String(h[1]).padStart(2, '0')}:00` })),
  aggregateRating: { '@type': 'AggregateRating', ratingValue: M.nota, reviewCount: M.avaliacoes },
  sameAs: [M.instagram, M.facebook, M.linkedin],
};
const titulo = `${M.completo} | ${tipoCasa} na ${M.bairro}, ${M.cidade}`;
const descricao = `${tipoCasa} na ${M.bairro}: ${lista(C.segmentos.filter((s) => s.ativo && s.id !== 'planos' && s.id !== 'combos').map((s) => s.nome.toLowerCase()))}. Preços claros e agendamento online.`;

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${M.dominio}/">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(titulo)}"><meta property="og:description" content="${esc(descricao)}"><meta property="og:image" content="${M.dominio}/assets/img/capa.webp"><meta property="og:locale" content="pt_BR">
<meta name="theme-color" content="#1F1B18">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${fontes}
<link rel="stylesheet" href="assets/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
${topo}
<main id="conteudo">
${capa}
${faixa}
${espaco}
${cardapio}
${motivos}
${resultados}
${equipe}
${visita}
${planos}
${avaliacoes}
${lookbook}
${politicas}
${duvidas}
${agendar}
</main>
${rodape}
${dialogs}
<script type="application/json" id="dados">${JSON.stringify(dados)}</script>
<script src="assets/site.js" defer></script>
</body>
</html>
`;

// ---------- grava ----------
for (const f of usadas) fs.copyFileSync(path.join(FOTOS, `${f}.webp`), path.join(OUT, 'assets', 'img', `${f}.webp`));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_vila-madalena.webp'), path.join(OUT, 'assets', 'img', 'mapa_vila-madalena.webp'));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'assets', 'site.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8'));
fs.writeFileSync(path.join(OUT, 'assets', 'site.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8'));
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${M.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${M.dominio}/</loc></url></urlset>\n`);
if (faltando.length) console.warn('Fotos faltando:', [...new Set(faltando)].join(', '));
console.log(`ok: ${OUT} (${ligados.length} segmentos ligados, ${usadas.size} fotos)`);
