// Gera o modelo Gold de estética (Camélia Estética, marca fictícia) em "templates/estetica/gold/".
// Gold: a página começa do lado de fora da clínica, em 3D. Na rolagem, um drone entra pela porta e passa sala por sala
// (consultório com o retrato da responsável, avaliação, procedimentos com a cadeira, corporal e olhar),
// até o telhado subir e mostrar a planta vista de cima. Depois vêm resultados, combinados, dúvidas e a agenda.
// Three.js r160 sem CDN (vira script comum para abrir até direto do arquivo). Texturas da cena vão como data URI.
// Uso: node templates/estetica/_build-gold/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');

const OUT = path.join(__dirname, '..', 'gold');
const FOTOS = path.join(__dirname, 'img', 'fotos');
const M = C.marca;
const R = C.responsavel;
const G = C.gold;
const SEG = C.segmentos.filter((s) => s.ativo);
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const waAval = wa(`Olá! Quero agendar uma avaliação na ${M.completo}.`);
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`Rua Coronel Quirino, ${M.bairro}, ${M.cidade}`)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
const reais = (v) => `R$ ${v.toLocaleString('pt-BR')}`;
const lista = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} e ${a.at(-1)}`);
const tit = ([a, b, c = '']) => `${esc(a)}<em>${esc(b)}</em>${esc(c)}`;

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets', 'js'), { recursive: true });
if (fs.existsSync(FOTOS)) for (const f of fs.readdirSync(FOTOS)) fs.copyFileSync(path.join(FOTOS, f), path.join(OUT, 'assets', 'img', f));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_cambui.webp'), path.join(OUT, 'assets', 'img', 'mapa_cambui.webp'));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

// Three.js vem como módulo ES; vira script comum (window.THREE) para o site abrir até direto do arquivo
const three = fs.readFileSync(path.join(__dirname, 'vendor', 'three.module.min.js'), 'utf8');
const iExp = three.lastIndexOf('export{');
const nomes = three.slice(iExp + 7, three.indexOf('}', iExp)).split(',').map((par) => { const [a, b] = par.split(' as '); return `${(b || a).trim()}:${a.trim()}`; });
fs.writeFileSync(path.join(OUT, 'assets', 'js', 'three.min.js'), `/* three.js r160, MIT */\n(function(){${three.slice(0, iExp)}\nwindow.THREE={${nomes.join(',')}};})();\n`);
// a cena 3D: os quatro arquivos de cena/ formam o corpo de CameliaCena.criar()
const partes = ['base', 'predio', 'salas', 'voo'].map((n) => `// ===== cena/${n}.js =====\n${fs.readFileSync(path.join(__dirname, 'cena', `${n}.js`), 'utf8')}`).join('\n');
fs.writeFileSync(path.join(OUT, 'assets', 'js', 'cena.js'), `/* Camélia Gold: clínica em 3D e voo de drone. Gerado por _build-gold/build.js */\nwindow.CameliaCena={criar(canvas,D,opc){\n'use strict';\n${partes}\n}};\n`);
const b64 = (n) => `data:image/webp;base64,${fs.readFileSync(path.join(__dirname, 'img', 'texturas', `${n}.webp`)).toString('base64')}`;
const dadosCena = { planta: G.planta, responsavel: R.nome, registro: R.registro, texturas: { retrato: b64('retrato'), gravuraProdutos: b64('gravura-produtos'), gravuraSerum: b64('gravura-serum') } };
fs.writeFileSync(path.join(OUT, 'assets', 'js', 'dados-cena.js'), `window.CAMELIA_CENA=${JSON.stringify(dadosCena)};\n`);
const js = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8')
  .replace('/*DADOS*/', JSON.stringify({ whatsapp: M.whatsapp, nome: M.completo, abertura: C.abertura, agenda: G.agenda, salas: G.planta.salas.map(({ id, nome }) => ({ id, nome })) }));
fs.writeFileSync(path.join(OUT, 'assets', 'js', 'app.js'), js);
const css = `${require('./texturas').css}\n${fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8')}`;

// Spectral (serifa de texto, leve, com itálico) nos títulos e Urbanist no texto. Dupla nova no projeto.
const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Urbanist:wght@300;400;500;600&display=swap" rel="stylesheet">';

// ---------- fotos ----------
const faltando = [];
const foto = (nome, { cls = '', lazy = true, alt } = {}) => {
  const desc = alt ?? C.fotos[nome] ?? nome;
  if (fs.existsSync(path.join(FOTOS, `${nome}.webp`))) return `<img class="foto ${cls}" src="assets/img/${nome}.webp" alt="${esc(desc)}"${lazy ? ' loading="lazy"' : ''}>`;
  if (!faltando.includes(nome)) faltando.push(nome);
  return `<div class="foto foto-falta ${cls}" role="img" aria-label="${esc(desc)}">${I.flor('flor-falta')}<span>Foto: ${esc(desc)}</span></div>`;
};
const creditosArq = path.join(__dirname, 'img', 'creditos.json');
const creditos = fs.existsSync(creditosArq) ? JSON.parse(fs.readFileSync(creditosArq, 'utf8')) : [];
const listaCreditos = creditos.map((c) => `<li>${esc(c.arq)}: <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.autor)}, ${esc(c.fonte)}</a></li>`).join('');
const florzinha = `<svg class="florzinha" viewBox="0 0 24 24" aria-hidden="true">${[[12, 4.4], [19.2, 9.6], [16.5, 18.2], [7.5, 18.2], [4.8, 9.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.4"/>`).join('')}<circle class="fz-c" cx="12" cy="12" r="3.3"/></svg>`;
// drone pequeno da dica de rolagem (desenho próprio: corpo, braços e quatro hélices que giram)
const drone = `<svg class="drone" viewBox="0 0 64 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M22 20 10 12M42 20l12-8M22 22l-10 7M42 22l10 7"/><rect x="22" y="15" width="20" height="11" rx="5.5"/><path d="M29 26v4M35 26v4"/></g>${[[10, 11], [54, 11], [12, 29], [52, 29]].map(([x, y], i) => `<ellipse class="helice" style="--d:${i * 60}ms" cx="${x}" cy="${y}" rx="8" ry="1.6" fill="currentColor"/>`).join('')}<circle cx="32" cy="20.5" r="2.4" fill="currentColor"/></svg>`;

// ---------- mini planta (mesma planta da cena) ----------
const P = G.planta;
const PX0 = P.salas[0].x[0], PX1 = P.salas.at(-1).x[1];
const plantaSvg = (() => {
  const vb = [PX0 - 0.6, P.fundo - 0.6, PX1 - PX0 + 1.2, P.frente - P.fundo + 1.6];
  const salasSvg = P.salas.map((s) => `<rect class="pm-sala" data-sala="${s.id}" x="${s.x[0]}" y="${P.fundo}" width="${s.x[1] - s.x[0]}" height="${P.frente - P.fundo}"/>`).join('');
  // paredes internas com o vão do arco, e a fachada com o vão da porta
  const paredes = P.salas.slice(0, -1).map((s) => `<path d="M${s.x[1]} ${P.fundo}V-0.75M${s.x[1]} 0.75V${P.frente}"/>`).join('');
  const rec = P.salas[0], pc = (rec.x[0] + rec.x[1]) / 2;
  const contorno = `<path d="M${pc - 0.95} ${P.frente}H${PX0}V${P.fundo}H${PX1}V${P.frente}H${pc + 0.95}"/>`;
  return `<svg class="pm-svg" viewBox="${vb.join(' ')}" aria-hidden="true"><g class="pm-salas">${salasSvg}</g><g class="pm-paredes">${contorno}${paredes}</g><g class="pm-drone" transform="translate(${pc} ${P.frente + 1})"><g transform="scale(.06) translate(-12 -12)">${[[12, 4.4], [19.2, 9.6], [16.5, 18.2], [7.5, 18.2], [4.8, 9.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.4"/>`).join('')}<circle class="fz-c" cx="12" cy="12" r="3.3"/></g></g></svg>`;
})();

// ---------- tratamentos (carta compacta dentro da placa da sala) ----------
const precoDe = (t) => {
  if (t.gratis) return `<span class="item-preco"><small>avaliação</small>${t.gratis}</span>`;
  if (t.pacoteSo) return `<span class="item-preco"><small>pacote a partir de</small>${reais(t.de)}</span>`;
  if (t.de) return `<span class="item-preco"><small>a partir de</small>${reais(t.de)}</span>`;
  return `<span class="item-preco"><small>sessão</small>${reais(t.preco)}</span>`;
};
const itemCarta = (t) => `<li><details class="item">
              <summary><span class="item-nome">${esc(t.nome)}</span>${precoDe(t)}<span class="item-sinal" aria-hidden="true">${I.mais}</span></summary>
              <div class="item-corpo">
                <p>${esc(t.resumo)}</p>
                <p class="item-meta">${esc(t.duracao)}. ${esc(t.sessoes)}.</p>
                <p class="inclui"><b>Inclui:</b> ${esc(lista(t.inclui.map((x, i) => (i ? x.charAt(0).toLowerCase() + x.slice(1) : x))))}.</p>
                ${t.pacote ? `<p class="item-pacote">Pacote de ${t.pacote[0]} sessões: <b>${reais(t.pacote[1])}</b></p>` : ''}${t.extra ? `<p class="item-pacote">${esc(t.extra)}</p>` : ''}
                <a class="item-ir" href="${wa(`Olá! Quero agendar ${t.nome.toLowerCase()} na ${M.completo}.`)}" target="_blank" rel="noopener">Agendar este tratamento ${I.seta}</a>
              </div>
            </details></li>`;
const extraSeg = (s) => {
  if (s.areas) {
    return `<details class="extra"><summary>Depilação por área, cera e laser<span aria-hidden="true">${I.mais}</span></summary>
            <table class="areas"><thead><tr><th scope="col">Área</th><th scope="col">Cera</th><th scope="col">Laser</th></tr></thead>
            <tbody>${s.areas.map(([a, c, l]) => `<tr><th scope="row">${a}</th><td>${reais(c)}</td><td>${reais(l)}</td></tr>`).join('')}</tbody></table>
            <p class="miudo">${esc(s.laserNota)} Preço do laser por sessão.</p></details>`;
  }
  if (s.peles) {
    return `<details class="extra"><summary>Protocolo pelo tipo de pele<span aria-hidden="true">${I.mais}</span></summary>
            <dl class="peles">${s.peles.map(([p, d]) => `<div><dt>${p}</dt><dd>${d}</dd></div>`).join('')}</dl></details>`;
  }
  return '';
};

// ---------- paradas da visita ----------
const salaNome = Object.fromEntries(P.salas.map((s) => [s.id, s.nome]));
const fotoParada = { fachada: 'galeria-corredor', consultorio: 'responsavel', avaliacao: 'avaliacao', procedimentos: 'capa', corporal: 'corporal', olhar: 'depilacao', planta: 'galeria-harmonizacao' };
const fotoSem3d = (id) => `<figure class="parada-foto">${foto(fotoParada[id], { alt: '' })}</figure>`;
// foto da sala ao lado da placa (fora dela), em arco, com uma foto menor sobreposta quando houver
const quadroSala = (id) => {
  const q = G.quadros && G.quadros[id];
  if (!q) return '';
  return `<figure class="quadro-sala${q.mini ? ' com-mini' : ''}">
        <div class="qs-arco" style="--pos:${q.pos}">${foto(q.foto)}</div>
        ${q.mini ? `<div class="qs-mini">${foto(q.mini)}</div>` : ''}
        <figcaption>${esc(q.legenda)}</figcaption>
      </figure>`;
};
const rotuloSala = (nome) => `<p class="sala">${florzinha}<span>${esc(nome)}</span></p>`;
// retrato: a foto ocupa o arco do topo da placa (vale também sem WebGL, no lugar da foto da sala)
const parada = (id, secId, corpo, { seg, cls = '', retrato = '' } = {}) => `<section class="parada ${cls}" id="${secId}" data-parada="${id}"${seg ? ` data-seg="${seg}"` : ''} aria-labelledby="t-${id}">
    <div class="wrap">
      <article class="placa${retrato ? ' placa-retrato' : ''}" data-placa>
        ${retrato ? `<figure class="retrato">${foto(retrato, { alt: `${R.nome}, ${R.cargo.split(',')[0].toLowerCase()}` })}</figure>` : quadroSala(id) ? '' : fotoSem3d(id)}
        ${corpo}
      </article>
      ${quadroSala(id)}
    </div>
  </section>`;
const segPor = Object.fromEntries(SEG.map((s) => [s.id, s]));
const salaDoSeg = Object.fromEntries(P.salas.filter((s) => s.seg).map((s) => [s.seg, s.id]));
const paradaSeg = (segId) => {
  const s = segPor[segId];
  if (!s) return '';
  const id = salaDoSeg[segId];
  return parada(id, `seg-${segId}`, `${rotuloSala(salaNome[id])}
        <h2 id="t-${id}">${tit(G[id].titulo)}</h2>
        <p class="placa-txt">${esc(s.chamada)} ${esc(G[id].texto)}</p>
        <ul class="carta">
          ${s.itens.map(itemCarta).join('\n          ')}
        </ul>
        ${extraSeg(s)}`, { seg: segId });
};
const horasTabela = (cls = 'horas') => `<table class="${cls}"><caption>Horário de atendimento</caption><tbody>${C.horarios.map(([d, h], i) => `<tr data-linha="${i}"><th scope="row">${d}</th><td>${h}</td></tr>`).join('')}</tbody></table>`;
const paradas = [
  parada('fachada', 'inicio', `<p class="apoio">${esc(G.capa.apoio)}</p>
        <h1 id="t-fachada">${tit(G.capa.titulo)}</h1>
        <p class="placa-txt">${esc(G.capa.texto)}</p>
        <div class="capa-btns"><a class="btn btn-vinho" href="${waAval}" target="_blank" rel="noopener">${I.whats}<span>Agendar avaliação</span></a><a class="btn btn-linha" href="#sobre">Começar a visita</a></div>
        <p class="capa-status"><span data-status>Seg a sex, 9h às 20h</span>. ${esc(M.endereco.split(',')[0])}, ${esc(M.bairro)}.</p>
        <p class="dica" aria-hidden="true">${drone}<span>${esc(G.capa.dica)}</span></p>`, { cls: 'parada-capa' }),
  parada('consultorio', 'sobre', `${rotuloSala(salaNome.consultorio)}
        <h2 id="t-consultorio">${tit(G.consultorio.titulo)}</h2>
        <p class="placa-cargo">${esc(R.cargo)}. <b>${esc(R.registro)}</b></p>
        <p class="placa-txt">${esc(R.texto)}</p>
        <blockquote class="citacao"><p>${esc(G.consultorio.citacao)}</p></blockquote>
        <p class="placa-txt">${esc(R.equipe)}</p>
        <p class="miudo">${esc(G.consultorio.parede)}</p>`, { retrato: R.foto }),
  parada('avaliacao', 'como-funciona', `${rotuloSala(salaNome.avaliacao)}
        <h2 id="t-avaliacao">${tit(G.avaliacao.titulo)}</h2>
        <p class="placa-txt">${esc(G.avaliacao.texto)}</p>
        <ol class="etapas" data-linha>${C.etapas.map(([t, d]) => `<li><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
        <a class="btn btn-vinho" href="${waAval}" target="_blank" rel="noopener">${I.whats}<span>Agendar minha avaliação</span></a>`),
  ...['facial', 'corporal', 'depilacao'].map(paradaSeg),
  parada('planta', 'vista', `<p class="apoio">Vista de cima</p>
        <h2 id="t-planta">${tit(G.vista.titulo)}</h2>
        <p class="placa-txt">${esc(G.vista.texto)}</p>
        <div class="capa-btns"><a class="btn btn-vinho" href="#agendar">Escolher dia e horário</a><a class="btn btn-linha" href="${waAval}" target="_blank" rel="noopener">${I.whats}<span>WhatsApp</span></a></div>
        ${horasTabela('horas horas-placa')}`, { cls: 'parada-fim' }),
].filter(Boolean);

// ---------- antes e depois (simulação gerada aqui, mesmo método do Bronze e do Silver) ----------
const dimWebp = (arq) => {
  const d = fs.readFileSync(arq);
  const t = d.toString('ascii', 12, 16);
  if (t === 'VP8X') return [1 + d.readUIntLE(24, 3), 1 + d.readUIntLE(27, 3)];
  if (t === 'VP8 ') return [d.readUInt16LE(26) & 0x3fff, d.readUInt16LE(28) & 0x3fff];
  const v = d.readUInt32LE(21);
  return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1];
};
let sementeAD = 11;
const sorteia = () => { sementeAD = (sementeAD * 16807) % 2147483647; return (sementeAD - 1) / 2147483646; };
const r1 = (v) => Math.round(v * 10) / 10;
const camadaAntes = (c, k) => {
  const [w, h] = dimWebp(path.join(FOTOS, `${c.foto}.webp`));
  const s = c.simulacao;
  const marcas = [];
  for (const [cx, cy, rx, ry, q] of s.regioes) {
    for (let j = 0; j < q; j++) {
      const ang = sorteia() * Math.PI * 2, dist = Math.sqrt(sorteia());
      const x = cx + Math.cos(ang) * rx * dist, y = cy + Math.sin(ang) * ry * dist;
      if (s.tipo === 'acne') {
        const r = 3.5 + sorteia() * 5;
        if (j % 3 === 0) marcas.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(r * 4)}" ry="${r1(r * 3)}" fill="#C0584C" fill-opacity=".09" filter="url(#ad-m${k})"/>`);
        marcas.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="#B4453C" fill-opacity="${r1(0.14 + sorteia() * 0.14)}" filter="url(#ad-b${k})"/>`);
        if (sorteia() > 0.7) marcas.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r * 0.3)}" fill="#E9C9A8" fill-opacity=".35" filter="url(#ad-f${k})"/>`);
      } else if (s.tipo === 'manchas') {
        const r = 16 + sorteia() * 30;
        marcas.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(r)}" ry="${r1(r * (0.6 + sorteia() * 0.4))}" fill="#7E4A2C" fill-opacity="${r1(0.18 + sorteia() * 0.16)}" filter="url(#ad-b${k})"/>`);
        for (let z = 0; z < 2; z++) marcas.push(`<circle cx="${r1(x + (sorteia() - 0.5) * r * 2)}" cy="${r1(y + (sorteia() - 0.5) * r * 2)}" r="${r1(1.6 + sorteia() * 2.4)}" fill="#6E4129" fill-opacity="${r1(0.16 + sorteia() * 0.14)}" filter="url(#ad-b${k})"/>`);
      } else {
        const r = 2.5 + sorteia() * 4.5;
        marcas.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="#8E4A3A" fill-opacity="${r1(0.12 + sorteia() * 0.14)}" filter="url(#ad-b${k})"/>`);
      }
    }
  }
  const blur = s.tipo === 'manchas' ? 9 : 1.8;
  return `<div class="ad-antes" aria-hidden="true">
            <img src="assets/img/${c.foto}.webp" alt="" loading="lazy" style="filter:${s.filtro}">
            <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice"><defs><filter id="ad-b${k}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter><filter id="ad-m${k}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter><filter id="ad-f${k}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1"/></filter></defs>${marcas.join('')}</svg>
          </div>`;
};
const AD = C.antesDepois || [];
const setas = '<svg viewBox="0 0 22 12" aria-hidden="true"><path d="M8 1.5 3.5 6 8 10.5M14 1.5 18.5 6 14 10.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const cartaoAD = (c, k) => `<figure class="ad-card">
        <div class="ad-palco" style="--p:50%">
          <img class="ad-depois" src="assets/img/${c.foto}.webp" alt="Depois: ${esc(c.titulo.toLowerCase())}, ${esc(c.tratamento.toLowerCase())}" loading="lazy">
          ${camadaAntes(c, k)}
          <span class="ad-selo">Simulação ilustrativa</span>
          <span class="ad-rot ad-rot-a" aria-hidden="true">Antes</span><span class="ad-rot ad-rot-d" aria-hidden="true">Depois</span>
          <span class="ad-linha" aria-hidden="true"><span class="ad-alca">${setas}</span></span>
          <input class="ad-range" type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois de ${esc(c.titulo.toLowerCase())}: arraste para os lados">
        </div>
        <figcaption><b>${esc(c.titulo)}</b><span>${esc(c.tratamento)}. ${esc(c.sessoes)}, ${esc(c.intervalo)}.</span></figcaption>
      </figure>`;

// ---------- formulário ----------
const opcoes = SEG.map((s) => `<optgroup label="${esc(s.nome)}" data-seg="${s.id}">${s.itens.map((t) => `<option>${esc(t.nome)}</option>`).join('')}${s.areas ? '<option>Depilação com cera</option><option>Depilação a laser</option>' : ''}</optgroup>`).join('');

// ---------- textos legais [JURÍDICO] (mesma base do Silver; o Gold não coleta dados de saúde no site) ----------
const legal = {
  servico: ['Termos de prestação de serviço', `
    <p>Estes termos valem para todos os atendimentos da ${M.completo} (${M.razao}, CNPJ ${M.cnpj}).</p>
    <h3>Avaliação e plano</h3><p>Todo tratamento facial e corporal e toda primeira sessão de laser começam por uma avaliação sem custo. Nela a cliente preenche a ficha de saúde e recebe o plano por escrito, com tratamento, número de sessões, intervalo e valor. Informar alergias, medicamentos e condições de saúde é necessário para a segurança do procedimento.</p>
    <h3>Preços e pagamento</h3><p>Os preços desta página são de sessão avulsa ou de pacote e podem mudar sem aviso; vale o valor do plano assinado. Pagamento em Pix, débito ou crédito, com sessão avulsa em até 3x e pacotes em até 10x sem juros no cartão.</p>
    <h3>Pacotes</h3><p>Valem por 6 meses a partir da primeira sessão e são pessoais. Na desistência, devolvemos o valor das sessões não feitas, calculado pelo preço do pacote, descontados 10% de custo administrativo.</p>
    <h3>Agendamento, cancelamento e remarcação</h3><p>O horário escolhido no site é um pedido: ele só vale depois da confirmação pelo WhatsApp. Cancelamento e remarcação sem custo até 24h antes. Com menos de 24h, a sessão avulsa é cobrada em 50% e a de pacote conta como feita, exceto em caso de saúde com atestado. Tolerância de atraso de 15 minutos.</p>
    <h3>Garantia</h3><p>Garantimos o serviço bem executado: retoque do design de sobrancelhas em até 7 dias, reposição de fios de cílios caídos em até 72h e remarcação sem custo de sessão perdida por falha nossa. Não há garantia de resultado: cada organismo responde de um jeito.</p>
    <h3>Contraindicações</h3><p>A clínica pode recusar ou adiar um procedimento quando houver contraindicação ou risco à saúde, e pode pedir liberação médica.</p>
    <p>Dúvidas: ${M.email} ou WhatsApp ${M.whatsappTexto}.</p>`],
  uso: ['Termos de uso do site', `
    <p>Este site apresenta a ${M.completo}, seus tratamentos, preços e políticas. O conteúdo é informativo e não substitui a avaliação individual.</p>
    <h3>Visita em 3D</h3><p>A clínica em 3D desta página é uma ilustração feita para o site. Móveis, aparelhos e decoração podem ser diferentes dos que estão na clínica.</p>
    <h3>Informações e preços</h3><p>Fazemos o possível para manter tudo atualizado. Em caso de diferença, vale o que estiver no plano entregue na avaliação.</p>
    <h3>Imagens e textos</h3><p>Textos, marca e fotos pertencem à ${M.completo} ou são usados com licença. As imagens de antes e depois desta página são simulações ilustrativas. Não é permitido copiar para uso comercial.</p>
    <h3>Formulário e agenda</h3><p>O formulário monta uma mensagem e abre o WhatsApp no seu aparelho. Os dias e horários mostrados são sugestões: a confirmação vem pela equipe. Este site não guarda as respostas.</p>
    <h3>Links externos</h3><p>WhatsApp, mapas e redes sociais seguem os termos de cada serviço.</p>`],
  privacidade: ['Política de privacidade', `
    <p>Controladora dos dados: ${M.razao}, CNPJ ${M.cnpj}, ${endereco}. Encarregado de dados: ${M.encarregado}.</p>
    <h3>Quais dados</h3><p>Nome, WhatsApp, tratamento de interesse, dia e horário preferidos, quando você envia o formulário. Este site não pede dados de saúde: a ficha de saúde é preenchida na avaliação, na clínica.</p>
    <h3>Para que usamos</h3><p>Responder o seu pedido, agendar e preparar a avaliação. Dados de saúde informados na avaliação são dados sensíveis pela LGPD (Lei 13.709/2018, art. 11) e são usados apenas para avaliar a indicação e a segurança do procedimento, com o seu consentimento específico. Novidades e horários livres só com a sua autorização separada.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins comerciais. A mensagem passa pelo WhatsApp, que tem a própria política. A ficha de saúde fica no prontuário da clínica, com acesso restrito à equipe que atende você.</p>
    <h3>Por quanto tempo</h3><p>Pedidos sem atendimento são apagados em até 6 meses. Prontuário e ficha de saúde são guardados pelo prazo exigido pelas normas sanitárias e profissionais.</p>
    <h3>Seus direitos</h3><p>Você pode pedir acesso, correção, cópia ou exclusão dos seus dados, e retirar o consentimento a qualquer momento, pelo e-mail ${M.encarregado}.</p>
    <h3>Cookies</h3><p>O site usa armazenamento essencial do navegador para lembrar a sua escolha sobre cookies e o tema claro ou escuro. Não usamos cookies de publicidade. Medição de visitas só com a sua permissão no aviso de cookies.</p>`],
};
const dialogs = Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-topo"><h2 id="doc-${id}-t">${t}</h2><button type="button" class="doc-fecha" data-fecha aria-label="Fechar">${I.fechar}</button></div>
  <div class="doc-corpo">${corpo}<p class="doc-fim">Texto de modelo, a validar na revisão jurídica. Atualizado em novembro de 2026.</p></div>
</dialog>`).join('\n');

const segNomes = lista(SEG.map((s) => s.nome.toLowerCase()));
const primeiroSeg = SEG[0] ? `#seg-${SEG[0].id}` : '#sobre';

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${M.completo} | Conheça a clínica por dentro, no ${M.bairro}, ${M.cidade}</title>
<meta name="description" content="${M.completo}: ${segNomes} no ${M.bairro}, ${M.cidade}. Faça a visita em 3D pela clínica, veja preços e agende a avaliação sem custo pelo WhatsApp.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#F4EDE8">
<meta property="og:title" content="${M.completo}">
<meta property="og:description" content="Conheça a clínica por dentro antes de marcar. Avaliação sem custo e plano por escrito.">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<script>(function(){var d=document.documentElement,t=null;d.classList.add("js");try{t=new URLSearchParams(location.search).get("tema")||localStorage.getItem("camelia-tema")}catch(e){}if(t==="escuro")d.dataset.tema="escuro"})()</script>
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
<div class="carrega" id="carrega" aria-hidden="true"><div class="carrega-flor">${I.flor()}</div><p>Preparando a visita</p></div>
<a class="pular" href="#agendar">Pular para o agendamento</a>

<header class="topo" id="topo">
  <div class="wrap topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="menu" id="menu" aria-label="Seções">
      <a href="#sobre">A visita</a>
      <a href="${primeiroSeg}">Tratamentos</a>
      <a href="#resultados">Resultados</a>
      <a href="#duvidas">Dúvidas</a>
      <a href="#agendar">Agendar</a>
    </nav>
    <button class="tema-btn" type="button" aria-pressed="false" aria-label="Ativar tema escuro" title="Tema escuro">${I.temaFlor}</button>
    <a class="btn btn-vinho topo-cta" href="${waAval}" target="_blank" rel="noopener">${I.whats}<span>Agendar avaliação</span></a>
    <button class="menu-btn" type="button" aria-controls="menu" aria-expanded="false" aria-label="Abrir menu"><span></span><span></span><span></span></button>
  </div>
</header>

<main>
  <div class="visita" id="visita">
    <div class="palco" aria-hidden="true"><canvas id="cena"></canvas><div class="palco-veu"></div><div class="rotulos" data-rotulos></div></div>
  ${paradas.join('\n  ')}
  </div>

  <nav class="planta-mini" id="planta-mini" aria-label="Salas da visita">
    ${plantaSvg}
    <div class="pm-txt"><small>Você está em</small><b data-sala-atual>Frente da clínica</b></div>
    <div class="pm-botoes">${P.salas.filter((s) => s.id !== 'recepcao').map((s) => `<button type="button" data-ir="${s.id}"${s.seg ? ` data-seg="${s.seg}"` : ''}>${esc(s.nome)}</button>`).join('')}</div>
  </nav>

  ${AD.length ? `<section class="sec" id="resultados" aria-labelledby="t-res">
    <div class="wrap">
      <div class="sec-topo">
        <p class="apoio">Resultados</p>
        <h2 id="t-res">Pele tratada com calma. <em>Sem exagero.</em></h2>
        <p class="sec-sub">Arraste sobre a foto para comparar o antes e o depois.</p>
      </div>
      <div class="ads">
      ${AD.map(cartaoAD).join('\n      ')}
      </div>
      <p class="ad-aviso">As imagens desta demonstração são simulações feitas sobre fotos de banco de imagens. No site da clínica entram fotos reais, sempre com autorização por escrito da cliente. ${C.avisoResultado.split('. ').slice(0, 2).join('. ')}.</p>
      <div class="depos">
        ${G.depoimentos.map(([t, q]) => `<blockquote class="depo"><p>${esc(t)}</p><footer>${esc(q)}</footer></blockquote>`).join('\n        ')}
      </div>
      <p class="miudo depos-nota">Depoimentos ilustrativos do modelo.</p>
    </div>
  </section>` : ''}

  <section class="sec sec-rosa" id="combinados" aria-labelledby="t-comb">
    <div class="wrap">
      <div class="sec-topo">
        <p class="apoio">Pagamento e políticas</p>
        <h2 id="t-comb">Tudo combinado <em>por escrito</em>.</h2>
      </div>
      <div class="pagar">
        ${C.pagamento.map(([t, d]) => `<div><h3>${t}</h3><p>${d}</p></div>`).join('\n        ')}
      </div>
      <div class="regras">
        <div class="regras-pol">
          <p class="regra-24"><b>24h</b><span>Até 24 horas antes, você cancela ou remarca sem pagar nada.</span></p>
          ${C.politicas.map(([t, d]) => `<details class="pol"><summary>${t}<span aria-hidden="true">${I.mais}</span></summary><p>${d}</p></details>`).join('')}
        </div>
        <div class="regras-contra">
          <h3>Quando o tratamento não é indicado</h3>
          <ul>${C.contraindicacoes.map((c) => `<li>${I.fechar}<span>${esc(c)}</span></li>`).join('')}</ul>
          <p class="miudo">A lista completa é conferida na ficha de saúde da avaliação.</p>
        </div>
      </div>
      <div class="higiene">
        <h3>Segurança e higiene</h3>
        <dl class="seguro">${C.seguranca.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
      </div>
    </div>
  </section>

  <section class="sec" id="duvidas" aria-labelledby="t-faq">
    <div class="wrap faq">
      <div class="sec-topo">
        <p class="apoio">Dúvidas frequentes</p>
        <h2 id="t-faq">Antes de você <em>decidir</em></h2>
      </div>
      <div class="faq-lista">${C.faq.map(([q, a]) => `<details class="pergunta"><summary><span>${q}</span><span class="pergunta-sinal" aria-hidden="true">${I.mais}</span></summary><p>${a}</p></details>`).join('')}</div>
    </div>
  </section>

  <section class="sec sec-agenda" id="agendar" aria-labelledby="t-ag">
    <div class="wrap ag">
      <div class="ag-lado">
        <p class="apoio">Agenda</p>
        <h2 id="t-ag">Escolha o dia. <em>A gente confirma.</em></h2>
        <p class="ag-txt">Os horários abaixo são um pedido: a equipe confere a agenda e responde pelo WhatsApp, normalmente em menos de uma hora no horário de atendimento.</p>
        ${horasTabela()}
        <p class="ag-end">${I.pino}<span>${endereco}<br>CEP ${M.cep}</span></p>
        <p class="ag-status" data-status>Seg a sex, 9h às 20h</p>
      </div>
      <form class="form" id="form" novalidate>
        <h3>Peça seu horário</h3>
        <div class="campos">
          <label class="campo"><span>Nome</span><input name="nome" autocomplete="name" required></label>
          <label class="campo"><span>WhatsApp</span><input name="whats" type="tel" inputmode="tel" autocomplete="tel" placeholder="(19) 90000-0000" required></label>
        </div>
        <label class="campo"><span>Tratamento</span><select name="trat"><option>Ainda não sei, quero a avaliação</option>${opcoes}</select></label>
        <fieldset class="agenda"><legend>Dia</legend><div class="dias" data-dias></div></fieldset>
        <fieldset class="agenda"><legend>Horário</legend><div class="horarios" data-horarios></div><p class="miudo" data-sem-horario hidden>Para hoje não há mais horário. Escolha outro dia.</p></fieldset>
        <div class="consent">
          <label class="check"><input type="checkbox" name="ok_lgpd" required><span>Li a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button> e autorizo o contato pelo WhatsApp ou telefone para responder este pedido.</span></label>
          <label class="check"><input type="checkbox" name="ok_news"><span>Quero receber horários livres e novidades. Posso cancelar quando quiser.</span></label>
        </div>
        <p class="form-erro" id="form-erro" role="alert" hidden></p>
        <button class="btn btn-vinho btn-enviar" type="submit">${I.whats}<span>Enviar pedido pelo WhatsApp</span></button>
        <p class="miudo">Não pedimos dados de saúde aqui. A ficha de saúde é preenchida na avaliação. Nada fica salvo neste site.</p>
      </form>
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
      <div><h3>Tratamentos</h3><ul>${SEG.map((s) => `<li data-seg="${s.id}"><a href="#seg-${s.id}">${s.nome}</a></li>`).join('')}<li><a href="#combinados">Pagamento e políticas</a></li></ul></div>
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
      <p class="miudo">${C.avisoResultado} A clínica em 3D é uma ilustração. O conteúdo deste site é informativo e não substitui a avaliação individual.</p>
      ${listaCreditos ? `<details class="creditos"><summary>Créditos das imagens</summary><ul>${listaCreditos}<li>Visita em 3D: modelada em código para este site, com Three.js (licença MIT).</li></ul></details>` : ''}
    </div>
    <div class="rodape-fim"><span>© <span data-ano>2026</span> ${M.completo}. Marca fictícia de demonstração.</span><span>Preços e dados ilustrativos.</span></div>
  </div>
</footer>

<a class="whats-flutua" href="${waAval}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">${I.whats}</a>

<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Usamos só o essencial para o site funcionar. Se você permitir, também medimos visitas de forma anônima para melhorar a página. <button type="button" class="link" data-doc="privacidade">Saiba mais</button></p>
  <div class="cookies-btns"><button type="button" class="btn btn-vinho" data-ck="todos">Aceitar todos</button><button type="button" class="btn btn-linha" data-ck="essenciais">Só os essenciais</button></div>
</div>

${dialogs}

<script src="assets/js/three.min.js" defer></script>
<script src="assets/js/dados-cena.js" defer></script>
<script src="assets/js/cena.js" defer></script>
<script src="assets/js/app.js" defer></script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, 'index.html'), html);
const kb = (f) => Math.round(fs.statSync(path.join(OUT, f)).size / 1024);
console.log('ok', path.relative(process.cwd(), path.join(OUT, 'index.html')), `${kb('index.html')} KB`, `cena ${kb('assets/js/cena.js')} KB`, `three ${kb('assets/js/three.min.js')} KB`);
if (faltando.length) console.log('fotos faltando em _build-gold/img/fotos/:', faltando.join(', '));
