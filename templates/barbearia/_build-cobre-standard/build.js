// Gera o Silver de barbearia (Cobre Barbearia, marca fictícia) em "templates/barbearia/standard/cobre-standard/".
// Desenho inspirado na referência Barbor (Framer): fundo grafite, cobre como cor de destaque, títulos grandes em caixa-alta.
// Duas páginas: index.html (capa, sobre, serviços por segmento, pacotes, equipe, galeria por categoria, depoimentos,
// Instagram, agendamento com serviço + barbeiro + data + horário, dúvidas e chamada final) e equipe.html (perfil de cada barbeiro).
// Uso: node templates/barbearia/_build-cobre-standard/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const T = require('../../_comum/tema-pilula');
const CHAVE_TEMA = 'cobre-barbearia-tema';

const OUT = path.join(__dirname, '..', 'standard', 'cobre-standard');
const FOTOS = path.join(__dirname, 'img', 'fotos');
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

// fotos: confere se o arquivo existe e guarda as usadas para copiar e creditar
const dims = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'creditos.json'), 'utf8')).map((c) => [c.arq, [c.w, c.h]]));
const usadas = new Set();
const foto = (nome, { alt, lazy = true, cls = '', sizes } = {}) => {
  if (!fs.existsSync(path.join(FOTOS, `${nome}.webp`))) throw new Error(`foto faltando: ${nome}`);
  usadas.add(nome);
  const [w, h] = dims[nome] || [1400, 934];
  const a = alt ?? C.fotos[nome] ?? '';
  return `<img src="assets/img/${nome}.webp" alt="${esc(a)}" width="${w}" height="${h}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}${cls ? ` class="${cls}"` : ''}${sizes ? ` sizes="${sizes}"` : ''}>`;
};

// título com palavras que sobem uma a uma (o app.js anima .palavras > span)
const palavras = (t) => t.split(' ').map((p, i) => `<span style="--w:${i}"><span>${p}</span></span>`).join(' ');
const rotulo = (t) => `<p class="rotulo">${t}</p>`;

// resumo da agenda: junta dias seguidos com o mesmo horário
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

const servPorId = Object.fromEntries([...C.servicos, ...C.pacotes.map((p) => ({ ...p, seg: 'pacotes', inclui: p.inclui.join(', ') }))].map((s) => [s.id, s]));
const precoTxt = (s) => `${s.de ? 'a partir de ' : ''}${reais(s.preco)}`;

// ---------- topo (igual nas duas páginas; "base" é o prefixo das âncoras) ----------
const navItens = [['sobre', 'Sobre'], ['servicos', 'Serviços'], ['galeria', 'Galeria'], ['equipe.html', 'Equipe'], ['duvidas', 'Dúvidas']];
const href = (id, base) => (id.endsWith('.html') ? id : `${base}#${id}`);
const redes = (cls = '') => `<div class="redes ${cls}">
      <a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
      <a href="${M.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.face}</a>
      <a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whats}</a>
    </div>`;
const topo = (base, atual) => `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo">
  <div class="largo topo-in">
    <a class="logo" href="${base || '#inicio'}" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="menu" aria-label="Principal">${navItens.map(([id, t]) => `<a href="${href(id, base)}"${atual === id ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
    <div class="topo-dir">
      <p class="aberto" data-aberto>${I.relogio}<span>Curitiba</span></p>
      <a class="btn btn-cobre topo-cta" href="${base}#agendar">Agendar</a>
      <button class="menu-btn" type="button" aria-controls="gaveta" aria-expanded="false" aria-label="Abrir o menu">${I.menu}</button>
    </div>
  </div>
</header>
<div class="gaveta" id="gaveta" hidden>
  <div class="gaveta-fundo" data-fecha-gaveta></div>
  <aside class="gaveta-caixa" aria-label="Menu">
    <div class="gaveta-cab"><span class="logo">${I.logo}</span><button type="button" class="fecha" data-fecha-gaveta aria-label="Fechar o menu">${I.fechar}</button></div>
    <nav class="gaveta-nav" aria-label="Menu do celular">${[['inicio', 'Início'], ...navItens, ['agendar', 'Agendar horário']].map(([id, t]) => `<a href="${href(id, base)}">${t}</a>`).join('')}</nav>
    <dl class="gaveta-info">
      <div><dt>Endereço</dt><dd>${M.endereco}, ${M.bairro}</dd></div>
      <div><dt>WhatsApp</dt><dd><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">${M.whatsappTexto}</a></dd></div>
    </dl>
    ${T.pilula('deitada', 'escuro')}
    ${redes()}
  </aside>
</div>`;

// ---------- capa ----------
const capa = `<section class="capa" id="inicio">
  <div class="capa-fotos" data-capa>
    ${C.capaSlides.map((sl, i) => `<figure class="capa-slide${i === 0 ? ' ativo' : ''}" style="--pos:${sl.pos}">${foto(sl.foto, { lazy: false })}</figure>`).join('\n    ')}
  </div>
  <div class="largo capa-in">
    <p class="capa-hora" data-relogio>${M.cidade}, ${M.bairro}</p>
    <h1 class="capa-tit palavras">${palavras('Afiado do jeito que você pede')}</h1>
    <div class="capa-base">
      <p>Barbearia com hora marcada no ${M.bairro}. Corte na tesoura, degradê, barba com toalha quente e sobrancelha na navalha, com quatro barbeiros e preço fechado antes de começar.</p>
      <div class="capa-btns"><a class="btn btn-cobre" href="#agendar">Agendar horário ${I.setaDir}</a><a class="btn btn-vidro" href="#servicos">Ver serviços</a></div>
    </div>
    <div class="capa-nav" role="group" aria-label="Fotos da capa: cabelo, barba e sobrancelha">
      ${C.capaSlides.map((sl, i) => `<button type="button" data-slide="${i}" aria-pressed="${i === 0}"><span>${sl.rotulo}</span><i aria-hidden="true"></i></button>`).join('')}
    </div>
    <a class="capa-nota" href="#depoimentos">${estrelas}<b>${nota}</b><span>${M.avaliacoes.toLocaleString('pt-BR')} avaliações no Google</span></a>
  </div>
</section>
<div class="faixa" aria-hidden="true"><div class="faixa-trilho">${[0, 1].map(() => `<span>${['Corte na tesoura', 'Degradê', 'Barba com toalha quente', 'Sobrancelha na navalha', 'Barboterapia', 'Corte infantil', 'Risco e desenho'].map((t) => `<b>${t}</b>${I.simbolo}`).join('')}</span>`).join('')}</div></div>`;

// ---------- sobre ----------
const sobre = `<section class="sobre" id="sobre">
  <div class="largo sobre-grade">
    <div class="sobre-txt">
      ${rotulo('Feita no capricho desde ' + M.desde)}
      <h2 class="palavras">${palavras('Mais que uma cadeira: um horário que é só seu.')}</h2>
      <p class="rev">A Cobre nasceu num sobrado do ${M.bairro} com duas cadeiras e uma regra: ninguém liga a máquina antes de entender o que o cliente quer. Hoje são quatro barbeiros, cada um com a sua especialidade, e a regra continua a mesma.</p>
      <p class="rev">Do corte clássico na tesoura ao degradê à mão livre, todo serviço termina com acabamento na navalha, toalha limpa e o espelho de mão para você conferir a nuca.</p>
      <a class="btn btn-linha rev" href="equipe.html">Conhecer a equipe ${I.setaDir}</a>
    </div>
    <div class="sobre-fotos">
      <figure class="sf sf-a revela" data-par="-0.08">${foto('sobre-navalha')}</figure>
      <figure class="sf sf-b revela" data-par="0.1">${foto('espaco-salao')}</figure>
      <div class="sf-selo" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="circ" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><text><textPath href="#circ">COBRE BARBEARIA  CURITIBA  DESDE ${M.desde}  </textPath></text></svg>${I.simbolo}</div>
    </div>
  </div>
  <dl class="largo numeros">
    <div class="rev"><dt>Na casa desde</dt><dd><span data-conta="${M.desde}" data-sem-milhar>${M.desde}</span></dd></div>
    <div class="rev"><dt>Barbeiros</dt><dd><span data-conta="${C.equipe.length}">${C.equipe.length}</span></dd></div>
    <div class="rev"><dt>Atendimentos</dt><dd><span data-conta="${M.atendimentos}">${M.atendimentos}</span> mil</dd></div>
    <div class="rev"><dt>Nota no Google</dt><dd><span data-conta="${M.nota}" data-dec="1">${nota}</span></dd></div>
  </dl>
</section>`;

// ---------- serviços por segmento ----------
const cartaoServ = (s, i) => `<article class="serv${i === 0 ? ' serv-grande' : ''}" style="--i:${i}">
          <figure class="serv-foto">${foto(s.foto)}</figure>
          <div class="serv-corpo">
            <h4>${esc(s.nome)}</h4>
            <p>${esc(s.inclui)}</p>
            <div class="serv-pe"><span class="serv-min">${I.relogio}${minutos(s.min)}</span><b class="serv-preco">${s.adicional ? '+ ' : ''}${precoTxt(s)}</b></div>
            <a class="serv-agendar" href="#agendar" data-agendar="${s.id}" aria-label="Agendar ${esc(s.nome)}">Agendar ${I.setaDir}</a>
          </div>
        </article>`;
const servicos = `<section class="servicos" id="servicos">
  <div class="largo">
    <div class="sec-cab">
      <div>${rotulo('Serviços e preços')}<h2 class="palavras">${palavras('Cuidado sob medida, do cabelo à sobrancelha')}</h2></div>
      <p class="rev">Escolha o segmento. Cada serviço mostra quanto tempo leva e quanto custa, e o botão já leva para o agendamento com ele selecionado.</p>
    </div>
    <div class="abas" role="tablist" aria-label="Segmentos" data-iguais>
      ${C.segmentos.map((g, i) => `<button type="button" role="tab" id="aba-${g.id}" aria-controls="seg-${g.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}>${g.nome}</button>`).join('\n      ')}
      <i class="abas-marca" aria-hidden="true"></i>
    </div>
    ${C.segmentos.map((g, i) => `<div class="seg" id="seg-${g.id}" role="tabpanel" aria-labelledby="aba-${g.id}"${i ? ' hidden' : ''}>
      <div class="seg-cab"><figure>${foto(g.foto)}</figure><div><h3>${g.nome}</h3><p>${esc(g.frase)}</p></div></div>
      <div class="serv-grade">
        ${C.servicos.filter((s) => s.seg === g.id).map(cartaoServ).join('\n        ')}
      </div>
    </div>`).join('\n    ')}
    <p class="serv-nota rev">Pix, débito e crédito. Pacotes em até 2 vezes sem juros. A pigmentação começa com teste de sensibilidade 48 horas antes.</p>
  </div>
</section>`;

// ---------- pacotes (planos) ----------
const pacotes = `<section class="pacotes" id="pacotes">
  <div class="largo">
    <div class="sec-cab sec-cab-centro">${rotulo('Pacotes da casa')}<h2 class="palavras">${palavras('Saia afiado sem fazer conta')}</h2></div>
    <div class="pac-grade">
      ${C.pacotes.map((p, i) => `<article class="pac rev${p.destaque ? ' pac-destaque' : ''}" style="--i:${i}">
        <div class="pac-topo"><h3>${p.nome}</h3>${p.destaque ? '<span class="pac-selo">Mais completo</span>' : ''}</div>
        <p class="pac-frase">${esc(p.frase)}</p>
        <p class="pac-preco"><b>${reais(p.preco)}</b><span>separados sairiam ${reais(p.avulso)}</span></p>
        <p class="pac-min">${I.relogio}${minutos(p.min)} de cadeira</p>
        <ul>${p.inclui.map((t) => `<li>${I.check}<span>${esc(t)}</span></li>`).join('')}</ul>
        <a class="btn ${p.destaque ? 'btn-cobre' : 'btn-linha'}" href="#agendar" data-agendar="${p.id}">Agendar o ${p.nome}</a>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- equipe (prévia na página inicial) ----------
const equipePrevia = `<section class="equipe" id="equipe">
  <div class="largo">
    <div class="sec-cab">
      <div>${rotulo('Quem corta')}<h2 class="palavras">${palavras('Quatro barbeiros, quatro especialidades')}</h2></div>
      <a class="btn btn-linha rev" href="equipe.html">Ver perfis completos ${I.setaDir}</a>
    </div>
    <div class="eq-grade">
      ${C.equipe.map((b, i) => `<a class="eq rev" style="--i:${i}" href="equipe.html#${b.id}">
        <figure>${foto(b.foto)}</figure>
        <div class="eq-info"><h3>${b.nome}</h3><p>${esc(b.esp)}</p><span class="eq-mais">Ver perfil ${I.setaDir}</span></div>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- galeria por categoria ----------
const galeria = `<section class="galeria" id="galeria">
  <div class="largo">
    <div class="sec-cab">
      <div>${rotulo('Galeria')}<h2 class="palavras">${palavras('Trabalhos da casa, por categoria')}</h2></div>
      <p class="rev">Toque numa foto para ver maior. Fotos de banco de imagens: no site do cliente entram as do próprio espaço.</p>
    </div>
    <div class="filtros" role="group" aria-label="Filtrar a galeria" data-iguais>
      <button type="button" data-filtro="todos" aria-pressed="true">Todas</button>
      ${C.galeriaCats.map((c) => `<button type="button" data-filtro="${c.id}" aria-pressed="false">${c.nome}</button>`).join('\n      ')}
    </div>
    <ul class="gal-grade">
      ${C.galeria.map(([f, cat], i) => `<li class="gal" data-cat="${cat}" style="--i:${i}"><button type="button" data-foto="${f}" aria-label="Ampliar: ${esc(C.fotos[f])}">${foto(f)}<span class="gal-cat">${C.galeriaCats.find((c) => c.id === cat).nome}</span><span class="gal-lupa" aria-hidden="true">${I.lupa}</span></button></li>`).join('\n      ')}
    </ul>
  </div>
</section>
<dialog class="caixa-foto" id="caixa-foto" aria-label="Foto ampliada">
  <figure><img src="" alt=""><figcaption></figcaption></figure>
  <button type="button" class="cf-btn cf-ant" data-cf="-1" aria-label="Foto anterior">${I.setaEsq}</button>
  <button type="button" class="cf-btn cf-prox" data-cf="1" aria-label="Próxima foto">${I.setaDir}</button>
  <button type="button" class="cf-btn cf-fecha" data-fecha aria-label="Fechar">${I.fechar}</button>
</dialog>`;

// ---------- depoimentos ----------
const depoimentos = `<section class="depo" id="depoimentos">
  <div class="largo depo-grade">
    <div class="depo-lado">
      ${rotulo('Quem já sentou na cadeira')}
      <h2 class="palavras">${palavras('O que os clientes dizem')}</h2>
      <div class="depo-nota rev"><b><span data-conta="${M.nota}" data-dec="1">${nota}</span></b><div>${estrelas}<p>${M.avaliacoes.toLocaleString('pt-BR')} avaliações no Google</p></div></div>
      <div class="depo-ctrl" data-iguais><button type="button" class="btn btn-linha" data-depo="-1" aria-label="Depoimento anterior">${I.setaEsq}</button><button type="button" class="btn btn-linha" data-depo="1" aria-label="Próximo depoimento">${I.setaDir}</button></div>
    </div>
    <div class="depo-trilho" tabindex="0" aria-label="Depoimentos, role para o lado">
      ${C.depoimentos.map((d) => `<figure class="depo-card">
        <span class="depo-aspas">${I.aspas}</span>
        ${estrelas}
        <blockquote>${esc(d.texto)}</blockquote>
        <figcaption><span class="depo-ini" aria-hidden="true">${d.nome[0]}</span><span><b>${esc(d.nome)}</b><small>${esc(d.serv)}</small></span></figcaption>
      </figure>`).join('\n      ')}
    </div>
  </div>
  <div class="largo"><div class="depo-prog" aria-hidden="true"><i></i></div></div>
</section>`;

// ---------- Instagram incorporado ----------
const instagram = `<section class="insta" id="instagram" aria-labelledby="insta-t">
  <div class="largo">
    <div class="insta-perfil rev">
      <span class="insta-avatar">${I.simbolo}</span>
      <div class="insta-quem"><h2 id="insta-t"><a href="${M.instagram}" target="_blank" rel="noopener">${M.instagramUser}</a></h2><p>${M.completo}. ${M.bairro}, ${M.cidade}. Agenda pelo link.</p></div>
      <a class="btn btn-cobre" href="${M.instagram}" target="_blank" rel="noopener">${I.insta}Seguir</a>
    </div>
    <ul class="insta-grade">
      ${C.instagram.map((p, i) => `<li class="rev" style="--i:${i}"><a href="${M.instagram}" target="_blank" rel="noopener" aria-label="Ver no Instagram: ${esc(p.legenda)}">${foto(p.foto)}
        <span class="insta-veu"><span class="insta-nums"><span>${I.coracao}${p.curt}</span><span>${I.balao}${p.com}</span></span><span class="insta-leg">${esc(p.legenda)}</span></span></a></li>`).join('\n      ')}
    </ul>
  </div>
</section>`;

// ---------- agendamento ----------
const optServ = [
  ...C.segmentos.map((g) => `<optgroup label="${g.nome}">${C.servicos.filter((s) => s.seg === g.id && !s.adicional).map((s) => `<option value="${s.id}">${esc(s.nome)}, ${precoTxt(s)}</option>`).join('')}</optgroup>`),
  `<optgroup label="Pacotes">${C.pacotes.map((p) => `<option value="${p.id}">${esc(p.nome)}, ${reais(p.preco)}</option>`).join('')}</optgroup>`,
].join('');
const agendar = `<section class="agendar" id="agendar">
  <div class="largo">
    <div class="sec-cab">
      <div>${rotulo('Agendamento')}<h2 class="palavras">${palavras('Escolha o serviço, o barbeiro e a hora')}</h2></div>
      <p class="rev">O pedido chega no nosso WhatsApp com tudo preenchido. Confirmamos em até uma hora no horário de funcionamento.</p>
    </div>
    <form class="ag" id="form-agenda" novalidate>
      <div class="ag-passos">
        <fieldset class="ag-passo">
          <legend><span class="ag-n">Serviço</span></legend>
          <label class="campo"><span class="vh">Serviço</span><select name="servico" id="ag-servico" required><option value="">Escolha o serviço</option>${optServ}</select></label>
          <label class="ag-extra"><input type="checkbox" name="risco" value="risco"><span>Adicionar risco e desenho (+ ${reais(C.servicos.find((s) => s.id === 'risco').preco)}, 15 min)</span></label>
        </fieldset>
        <fieldset class="ag-passo">
          <legend><span class="ag-n">Barbeiro</span></legend>
          <div class="ag-barbeiros">
            <label class="ag-b"><input type="radio" name="barbeiro" value="qualquer" checked><span class="ag-b-in"><span class="ag-b-foto ag-b-qualquer">${I.tesoura}</span><b>Sem preferência</b><small>Primeiro horário livre</small></span></label>
            ${C.equipe.map((b) => `<label class="ag-b" data-b="${b.id}"><input type="radio" name="barbeiro" value="${b.id}"><span class="ag-b-in"><span class="ag-b-foto">${foto(b.foto, { alt: '' })}</span><b>${b.nome.split(' ')[0]}</b><small>${esc(b.esp.split(',')[0])}</small></span></label>`).join('\n            ')}
          </div>
          <p class="ag-aviso" data-aviso-barbeiro hidden></p>
        </fieldset>
        <fieldset class="ag-passo">
          <legend><span class="ag-n">Data</span></legend>
          <div class="ag-dias" data-dias></div>
        </fieldset>
        <fieldset class="ag-passo">
          <legend><span class="ag-n">Horário</span></legend>
          <div class="ag-horas" data-horas><p class="ag-vazio">Escolha o serviço e a data para ver os horários livres.</p></div>
        </fieldset>
        <fieldset class="ag-passo ag-dados">
          <legend><span class="ag-n">Seus dados</span></legend>
          <label class="campo"><span>Nome</span><input name="nome" autocomplete="name" required></label>
          <label class="campo"><span>WhatsApp</span><input name="fone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(41) 90000-0000" required></label>
          <label class="campo campo-largo"><span>Observação (opcional)</span><textarea name="obs" rows="2" placeholder="Ex.: quero manter o comprimento em cima"></textarea></label>
          <label class="aceite campo-largo"><input type="checkbox" name="lgpd" required><span>Concordo com o uso dos meus dados para responder e confirmar este agendamento, conforme a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</span></label>
        </fieldset>
      </div>
      <aside class="ag-resumo" aria-live="polite">
        <h3>Resumo</h3>
        <dl>
          <div><dt>Serviço</dt><dd data-r="servico">Escolha o serviço</dd></div>
          <div><dt>Barbeiro</dt><dd data-r="barbeiro">Sem preferência</dd></div>
          <div><dt>Data</dt><dd data-r="data">Escolha a data</dd></div>
          <div><dt>Horário</dt><dd data-r="hora">Escolha o horário</dd></div>
          <div><dt>Duração</dt><dd data-r="min">0 min</dd></div>
        </dl>
        <p class="ag-total"><span>Total</span><b data-r="total">R$ 0</b></p>
        <button class="btn btn-cobre ag-enviar" type="submit">${I.whats}Pedir pelo WhatsApp</button>
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

// ---------- dúvidas ----------
const duvidas = `<section class="duvidas" id="duvidas">
  <div class="largo duv-grade">
    <div class="duv-lado">
      ${rotulo('Dúvidas')}
      <h2 class="palavras">${palavras('Tudo o que você precisa saber')}</h2>
      <p class="rev">Não achou a resposta? Chame no WhatsApp, quem responde é a recepção da casa.</p>
      <a class="btn btn-cobre rev" href="${wa(`Olá, ${M.completo}! Tenho uma dúvida.`)}" target="_blank" rel="noopener">${I.whats}Perguntar no WhatsApp</a>
    </div>
    <div class="duv-lista">
      ${C.faq.map(([p, r], i) => `<details class="duv rev" style="--i:${i}"${i === 0 ? ' open' : ''}><summary>${esc(p)}<span class="duv-mais" aria-hidden="true">${I.mais}</span></summary><div class="duv-r"><p>${esc(semMarca(r))}</p></div></details>`).join('\n      ')}
    </div>
  </div>
</section>`;

// ---------- chamada final ----------
const fecho = (base = '') => `<section class="fecho">
  <figure class="fecho-foto" data-par="0.12">${foto('barba-luvas')}</figure>
  <div class="largo fecho-in">
    <h2 class="palavras">${palavras('Pronto para sair afiado?')}</h2>
    <p class="rev">Sente na cadeira, conte o que quer e deixe o resto com a gente.</p>
    <div class="fecho-btns rev" data-iguais><a class="btn btn-cobre" href="${base}#agendar">Agendar horário</a><a class="btn btn-vidro" href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">${I.whats}WhatsApp</a></div>
  </div>
</section>`;

// ---------- rodapé ----------
const creditos = JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'creditos.json'), 'utf8'));
const diasTab = C.horarios.map(([d, h], i) => `<tr data-dia="${i}"><th scope="row">${d}</th><td>${h}</td></tr>`).join('');
const rodape = (base) => `<footer class="rodape" id="contato">
  <div class="largo">
    <div class="rod-topo">
      <a class="logo logo-grande" href="${base || '#inicio'}" aria-label="${M.completo}, início">${I.logo}</a>
      <p>Corte, barba e sobrancelha com hora marcada no ${M.bairro}, ${M.cidade}.</p>
      ${redes()}
    </div>
    <div class="rod-cols">
      <div><h3>Navegue</h3><ul>${[['inicio', 'Início'], ...navItens, ['agendar', 'Agendar horário']].map(([id, t]) => `<li><a href="${href(id, base)}">${t}</a></li>`).join('')}</ul></div>
      <div><h3>Serviços</h3><ul>${C.segmentos.map((g) => `<li><a href="${base}#servicos" data-ir-aba="${g.id}">${g.nome}</a></li>`).join('')}<li><a href="${base}#pacotes">Pacotes</a></li></ul></div>
      <div><h3>Atendimento</h3><ul><li><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li><li><a href="tel:${tel}">Telefone ${M.telefone}</a></li><li><a href="mailto:${M.email}">${M.email}</a></li></ul></div>
      <div><h3>Funcionamento</h3><table class="horas"><caption class="vh">Horário de funcionamento</caption>${diasTab}</table></div>
    </div>
    <div class="mapa-linha">
      <div class="map-box">
        <img src="assets/img/mapa_batel.webp" alt="Mapa do ${M.bairro}, ${M.cidade}, com a localização da ${M.completo}" width="1240" height="760" loading="lazy">
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
    <div class="rod-fim"><p>© ${new Date().getFullYear()} ${M.completo}. Todos os direitos reservados.</p><p>Modelo de site com marca, pessoas, preços e avaliações fictícios.</p></div>
  </div>
</footer>
<a class="whats-flutua" href="${wa(`Olá! Vim pelo site da ${M.completo}.`)}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${I.whats}</a>`;

// ---------- janelas legais e cookies [JURÍDICO] ----------
const legal = {
  servico: ['Termos de prestação de serviço', `
    <h3>Agendamento e confirmação</h3><p>O horário só está garantido depois da confirmação da ${M.completo} pelo WhatsApp, telefone ou e-mail. Sem hora marcada, o atendimento depende de cadeira livre.</p>
    <h3>Valores e pagamento</h3><p>Os preços do site são de referência. A pigmentação tem valor "a partir de", fechado antes do serviço conforme a área. Nenhum valor muda sem o seu aceite. Pix, débito e crédito; pacotes em até 2 vezes sem juros.</p>
    <h3>Atraso, cancelamento e remarcação</h3><p>Tolerância de 15 minutos. Cancelamento e remarcação sem custo até 24 horas antes. Duas faltas sem aviso pedem sinal de 30% via Pix nos agendamentos seguintes, abatido no valor do serviço.</p>
    <h3>Pigmentação e produtos químicos</h3><p>Teste de sensibilidade obrigatório 48 horas antes para quem nunca fez o serviço aqui. O barbeiro pode adiar o serviço quando a pele não estiver em condições, explicando o motivo.</p>
    <h3>Garantia</h3><p>Corte e barba: ajuste sem custo em até 7 dias com o mesmo barbeiro. A garantia não cobre mudança de ideia sobre o resultado combinado.</p>
    <h3>Crianças</h3><p>Menores de 12 anos são atendidos com um responsável presente durante todo o serviço.</p>`],
  uso: ['Termos de uso', `
    <p>Este site apresenta os serviços da ${M.completo} (${M.razao}, CNPJ ${M.cnpj}) e recebe pedidos de agendamento. Ao usar o site, você concorda com estes termos.</p>
    <h3>Conteúdo</h3><p>Textos e marca pertencem à ${M.completo}. As imagens pertencem a seus autores, conforme os créditos. Fotos de clientes só são publicadas com autorização por escrito.</p>
    <h3>Pedidos de agendamento</h3><p>O formulário monta o pedido e abre o WhatsApp. Os horários mostrados são uma previsão e só valem depois da nossa confirmação.</p>
    <h3>Links externos</h3><p>Mapas, agendas, Instagram e WhatsApp são serviços de terceiros, com políticas próprias.</p>`],
  privacidade: ['Política de privacidade', `
    <p>A ${M.razao} (CNPJ ${M.cnpj}) trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
    <h3>Dados que coletamos</h3><p>Nome, WhatsApp, serviço, barbeiro, data, horário e a observação que você escrever no agendamento.</p>
    <h3>Para que usamos</h3><p>Responder ao pedido, confirmar e lembrar o horário e registrar o serviço feito. Novidades só com o seu consentimento, que pode ser retirado a qualquer momento.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins de publicidade. O pedido trafega pelo WhatsApp (Meta) e os pagamentos pelo processador do cartão ou do Pix.</p>
    <h3>Por quanto tempo</h3><p>Pedidos sem atendimento são apagados em 6 meses. Fichas de cliente ficam enquanto houver relação com a barbearia e pelo prazo legal depois dela.</p>
    <h3>Seus direitos</h3><p>Confirmar, acessar, corrigir, apagar ou levar seus dados e revogar consentimentos pelo e-mail ${M.email}.</p>
    <h3>Cookies e armazenamento</h3><p>O site guarda no seu navegador a escolha de cookies e de tema claro ou escuro. Não usamos cookies de publicidade. Medição de visitas só com a sua permissão.</p>`],
};
const dialogs = `${Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-cab"><h2 id="doc-${id}-t">${t}</h2><button type="button" class="doc-fecha" data-fecha aria-label="Fechar">${I.fechar}</button></div>
  <div class="doc-corpo">${corpo}<p class="doc-data">Atualizado em novembro de 2026. Texto a validar na revisão jurídica.</p></div>
</dialog>`).join('\n')}
<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Usamos só o armazenamento necessário para o site funcionar. Medição de visitas, apenas se você permitir. <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>.</p>
  <div class="cookies-btns" data-iguais><button type="button" class="btn btn-cobre" data-ck="todos">Aceitar todos</button><button type="button" class="btn btn-linha" data-ck="essenciais">Só os essenciais</button></div>
</div>
<div class="toast" data-toast role="status" aria-live="polite"></div>`;

// ---------- página da equipe ----------
const equipePagina = `<section class="eqp-capa">
  <figure class="eqp-capa-foto" data-capa>${foto('barbeiro-acao', { lazy: false })}</figure>
  <div class="largo eqp-capa-in">
    ${rotulo('A equipe')}
    <h1 class="palavras">${palavras('Gente que vive de tesoura e navalha')}</h1>
    <p class="rev">Quatro barbeiros com mais de 40 anos de cadeira somados. Conheça cada um, veja os dias em que está na casa e agende direto com quem você quiser.</p>
    <nav class="eqp-atalhos rev" aria-label="Barbeiros" data-iguais>${C.equipe.map((b) => `<a href="#${b.id}">${b.nome.split(' ')[0]}</a>`).join('')}</nav>
  </div>
</section>
${C.equipe.map((b, i) => {
  const anos = 2026 - b.desde;
  const servs = b.faz.map((id) => servPorId[id]).filter(Boolean);
  return `<section class="perfil${i % 2 ? ' perfil-inv' : ''}" id="${b.id}" aria-labelledby="${b.id}-t">
  <div class="largo perfil-grade">
    <figure class="perfil-foto revela">${foto(b.foto)}<figcaption>${I.insta}${b.insta}</figcaption></figure>
    <div class="perfil-txt">
      <p class="rotulo">${esc(b.cargo)}</p>
      <h2 id="${b.id}-t" class="palavras">${palavras(b.nome)}</h2>
      <blockquote class="perfil-frase rev">${esc(b.frase)}</blockquote>
      <p class="rev">${esc(b.bio)}</p>
      <dl class="perfil-dados rev">
        <div><dt>Na profissão</dt><dd><span data-conta="${anos}">${anos}</span> anos</dd></div>
        <div><dt>Especialidade</dt><dd>${esc(b.esp)}</dd></div>
      </dl>
      <div class="perfil-semana rev" aria-label="Dias de atendimento de ${b.nome}">
        ${[1, 2, 3, 4, 5, 6].map((d) => `<span class="${b.agenda[d] ? 'on' : 'off'}"><b>${DIAS_C[d]}</b><small>${b.agenda[d] ? `${hora(b.agenda[d][0])} às ${hora(b.agenda[d][1])}` : 'folga'}</small></span>`).join('')}
      </div>
      <details class="perfil-servs rev"><summary>Serviços que ${b.nome.split(' ')[0]} atende (${servs.length})</summary><ul>${servs.map((s) => `<li><span>${esc(s.nome)}</span><b>${precoTxt(s)}</b></li>`).join('')}</ul></details>
      <div class="perfil-trab">${b.trabalhos.map((f) => `<figure class="rev">${foto(f)}</figure>`).join('')}</div>
      <a class="btn btn-cobre rev" href="index.html?barbeiro=${b.id}#agendar">Agendar com ${b.nome.split(' ')[0]} ${I.setaDir}</a>
    </div>
  </div>
</section>`;
}).join('\n')}
<section class="jeito">
  <div class="largo">
    <div class="sec-cab sec-cab-centro">${rotulo('Como a equipe trabalha')}<h2 class="palavras">${palavras('O mesmo cuidado em todas as cadeiras')}</h2></div>
    <ul class="jeito-lista">
      <li class="rev" style="--i:0"><h3>Conversa antes da máquina</h3><p>Todo atendimento começa no espelho: como você penteia, quanto tempo tem de manhã e o que não quer de jeito nenhum.</p></li>
      <li class="rev" style="--i:1"><h3>Material limpo na sua frente</h3><p>Tesouras e pentes saem da autoclave, navalha e lâmina são abertas na hora e a toalha é trocada a cada cliente.</p></li>
      <li class="rev" style="--i:2"><h3>Formação todo ano</h3><p>A casa paga um curso por ano para cada barbeiro. Visagismo, texturas e técnicas novas de degradê entram no cardápio depois de treinadas entre a gente.</p></li>
      <li class="rev" style="--i:3"><h3>Ajuste em até 7 dias</h3><p>Se algo não ficou como combinado, volte em até uma semana que o mesmo barbeiro acerta, sem custo.</p></li>
    </ul>
  </div>
</section>`;

// ---------- dados para o app.js ----------
const dados = {
  whatsapp: M.whatsapp, nome: M.completo, endereco,
  abertura: C.abertura,
  servicos: Object.values(servPorId).map((s) => ({ id: s.id, nome: s.nome, min: s.min, preco: s.preco, de: !!s.de, seg: s.seg })),
  equipe: C.equipe.map((b) => ({ id: b.id, nome: b.nome, faz: b.faz, agenda: b.agenda })),
  fotos: Object.fromEntries(C.galeria.map(([f]) => [f, C.fotos[f]])),
};

// ---------- página ----------
const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Antonio:wght@400;600;700&family=Rethink+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">';
const ld = {
  '@context': 'https://schema.org', '@type': 'BarberShop', name: M.completo, url: M.dominio,
  image: `${M.dominio}/assets/img/capa.webp`, telephone: M.telefone, email: M.email, priceRange: 'R$ 20 a R$ 175',
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: M.lat, longitude: M.lon },
  openingHoursSpecification: Object.entries(C.abertura).filter(([, h]) => h).map(([d, h]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d], opens: `${String(h[0]).padStart(2, '0')}:00`, closes: `${String(h[1]).padStart(2, '0')}:00` })),
  aggregateRating: { '@type': 'AggregateRating', ratingValue: M.nota, reviewCount: M.avaliacoes },
  sameAs: [M.instagram, M.facebook],
};

const pagina = ({ titulo, descricao, canon, corpo, base, atual, classe }) => `<!doctype html>
<html lang="pt-BR" data-tema="escuro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${M.dominio}/${canon}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(titulo)}"><meta property="og:description" content="${esc(descricao)}"><meta property="og:image" content="${M.dominio}/assets/img/capa.webp"><meta property="og:locale" content="pt_BR">
<meta name="theme-color" content="#111111">
<script>document.documentElement.classList.add('js')</script>
${T.head(CHAVE_TEMA)}
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${fontes}
<link rel="stylesheet" href="assets/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body class="${classe}">
<div class="carrega" id="carrega" aria-hidden="true">
  <div class="carrega-metade carrega-cima"></div><div class="carrega-metade carrega-baixo"></div>
  <div class="carrega-in">
    <svg class="carrega-simbolo" viewBox="0 0 40 40"><path class="cs-losango" d="M20 2 38 20 20 38 2 20Z" pathLength="1"/><path class="cs-c" d="M26.5 14.2a8.6 8.6 0 1 0 0 11.6" pathLength="1"/><path class="cs-lamina" d="M25.6 20h7" pathLength="1"/></svg>
    <p class="carrega-num"><b data-pc>0</b><span>%</span></p>
    <p class="carrega-frase" data-frase>Afiando a navalha</p>
  </div>
  <div class="carrega-linha"><i></i><span class="carrega-navalha">${I.navalha}</span></div>
</div>
${topo(base, atual)}
<main id="conteudo">
${corpo}
</main>
${rodape(base)}
${T.pilula('tema-lado', 'escuro')}
${dialogs}
<script type="application/json" id="dados">${JSON.stringify(dados)}</script>
<script src="assets/site.js" defer></script>
</body>
</html>
`;

const index = pagina({
  titulo: `${M.completo} | Barbearia no ${M.bairro}, ${M.cidade}`,
  descricao: `Barbearia com hora marcada no ${M.bairro}, ${M.cidade}: corte na tesoura, degradê, barba com toalha quente, barboterapia, sobrancelha e corte infantil. Agende online escolhendo o barbeiro.`,
  canon: '', base: '', atual: '', classe: 'pg-inicio',
  corpo: [capa, sobre, servicos, pacotes, equipePrevia, galeria, depoimentos, instagram, agendar, duvidas, fecho()].join('\n'),
});
const equipeHtml = pagina({
  titulo: `Equipe | ${M.completo}, ${M.bairro}`,
  descricao: `Conheça os barbeiros da ${M.completo}: especialidades, dias de atendimento e serviços de cada um. Agende direto com quem você preferir.`,
  canon: 'equipe.html', base: 'index.html', atual: 'equipe.html', classe: 'pg-equipe',
  corpo: [equipePagina, fecho('index.html')].join('\n'),
});

// créditos só das fotos usadas (preenchido depois de montar as duas páginas)
const listaCred = creditos.filter((c) => usadas.has(c.arq)).map((c) => `<li>${esc(c.arq)}: <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.autor)}, ${esc(c.fonte)}</a></li>`).join('');
const fecha = (h) => h.replace('<ul data-creditos></ul>', `<ul data-creditos>${listaCred}</ul>`);

// ---------- grava ----------
// esvazia a pasta sem apagá-la (no Windows a pasta aberta num terminal não pode ser removida)
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
for (const nome of usadas) fs.copyFileSync(path.join(FOTOS, `${nome}.webp`), path.join(OUT, 'assets', 'img', `${nome}.webp`));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_batel.webp'), path.join(OUT, 'assets', 'img', 'mapa_batel.webp'));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'assets', 'site.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8') + T.css);
fs.writeFileSync(path.join(OUT, 'assets', 'site.js'), fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8') + T.js(CHAVE_TEMA, '#F6F1EB', '#111111'));
fs.writeFileSync(path.join(OUT, 'index.html'), fecha(index));
fs.writeFileSync(path.join(OUT, 'equipe.html'), fecha(equipeHtml));
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${M.dominio}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${M.dominio}/</loc></url><url><loc>${M.dominio}/equipe.html</loc></url></urlset>\n`);
const sobra = fs.readdirSync(FOTOS).map((f) => f.replace('.webp', '')).filter((f) => !usadas.has(f));
console.log(`ok: ${OUT} (${usadas.size} fotos${sobra.length ? `; sem uso: ${sobra.join(', ')}` : ''})`);
