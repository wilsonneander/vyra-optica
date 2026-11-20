// Gera o modelo Silver de estética (Camélia Estética, marca fictícia) em "templates/estetica/silver/".
// Silver: landing page de uma página só, com abertura animada, flores no clique, brilhos na capa,
// cartões que entram entrelaçados, faixa rolante, antes e depois em grade e depoimentos.
// CSS e JS embutidos no index.html, fotos em assets/img.
// Uso: node templates/estetica/_build-silver/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');

const OUT = path.join(__dirname, '..', 'silver');
const FOTOS = path.join(__dirname, 'img', 'fotos');
const M = C.marca;
const R = C.responsavel;
const S = C.silver;
// segmentos ligados; pacote com `requer` só entra se todos os segmentos de que depende estiverem ligados
const ligados = C.segmentos.filter((s) => s.ativo).map((s) => s.id);
const ligado = (seg) => !seg || ligados.includes(seg);
const requerOk = (t) => !t.requer || t.requer.every(ligado);
const SEG = C.segmentos.filter((s) => s.ativo).map((s) => ({ ...s, itens: s.itens.filter(requerOk) })).filter((s) => s.itens.length);
const dataSeg = (seg) => (seg ? ` data-seg="${seg}"` : '');
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const waAval = wa(`Olá! Quero agendar uma avaliação na ${M.completo}.`);
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`Rua Coronel Quirino, ${M.bairro}, ${M.cidade}`)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
const reais = (v) => `R$ ${v.toLocaleString('pt-BR')}`;
const lista = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} e ${a.at(-1)}`);
// título com o trecho do meio em itálico de destaque: [antes, destaque, depois]
const tit = ([a, b, c = '']) => `${esc(a)}<em>${esc(b)}</em>${esc(c)}`;

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
if (fs.existsSync(FOTOS)) for (const f of fs.readdirSync(FOTOS)) fs.copyFileSync(path.join(FOTOS, f), path.join(OUT, 'assets', 'img', f));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_cambui.webp'), path.join(OUT, 'assets', 'img', 'mapa_cambui.webp'));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

const css = `${require('./texturas').css}
${fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8')}`;
const js = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8')
  .replace('/*DADOS*/', JSON.stringify({ whatsapp: M.whatsapp, nome: M.completo, abertura: C.abertura, intro: S.abertura, livre: S.capa.livre }));

// Cormorant Garamond nos títulos (itálico de alto contraste para os destaques) e Jost no texto. Dupla nova no projeto.
const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">';

// ---------- fotos ----------
const faltando = [];
const foto = (nome, { cls = '', lazy = true, alt } = {}) => {
  const desc = alt ?? C.fotos[nome] ?? nome;
  if (fs.existsSync(path.join(FOTOS, `${nome}.webp`))) {
    return `<img class="foto ${cls}" src="assets/img/${nome}.webp" alt="${esc(desc)}"${lazy ? ' loading="lazy"' : ''}>`;
  }
  if (!faltando.includes(nome)) faltando.push(nome);
  return `<div class="foto foto-falta ${cls}" role="img" aria-label="${esc(desc)}">${I.flor('flor-falta')}<span>Foto: ${esc(desc)}</span></div>`;
};
const creditosArq = path.join(__dirname, 'img', 'creditos.json');
const creditos = fs.existsSync(creditosArq) ? JSON.parse(fs.readFileSync(creditosArq, 'utf8')) : [];
const listaCreditos = creditos.map((c) => `<li>${esc(c.arq)}: <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.autor)}, ${esc(c.fonte)}</a></li>`).join('');

// camélia pequena usada como separador da faixa e marcador (desenho da marca, não ícone de biblioteca)
const florzinha = `<svg class="florzinha" viewBox="0 0 24 24" aria-hidden="true">${[[12, 4.4], [19.2, 9.6], [16.5, 18.2], [7.5, 18.2], [4.8, 9.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.4"/>`).join('')}<circle class="fz-c" cx="12" cy="12" r="3.3"/></svg>`;

// ---------- tratamentos ----------
const precoDe = (t) => {
  if (t.gratis) return `<span class="tr-preco"><small>avaliação</small>${t.gratis}</span>`;
  if (t.total) return `<span class="tr-preco"><small>pacote</small>${reais(t.total)}</span>`;
  if (t.pacoteSo) return `<span class="tr-preco"><small>pacote a partir de</small>${reais(t.de)}</span>`;
  if (t.de) return `<span class="tr-preco"><small>a partir de</small>${reais(t.de)}</span>`;
  return `<span class="tr-preco"><small>sessão</small>${reais(t.preco)}</span>`;
};
const linhaTrat = (t, i) => `<li class="tr" style="--i:${i}"${t.requer ? ` data-requer="${t.requer.join(',')}"` : ''}><a href="${wa(`Olá! Quero agendar ${t.nome.toLowerCase()} na ${M.completo}.`)}" target="_blank" rel="noopener">
            <span class="tr-topo"><b>${esc(t.nome)}</b>${precoDe(t)}</span>
            <span class="tr-desc">${esc(t.resumo)}</span>
            <span class="tr-meta">${esc(t.duracao)}. ${esc(t.sessoes)}${t.avulso ? `. Em sessões avulsas, ${reais(t.avulso)}` : ''}<span class="tr-ir">Agendar ${I.seta}</span></span>
          </a></li>`;
const extraSeg = (s) => {
  const out = [];
  if (s.tabela) {
    const T = s.tabela;
    out.push(`<div class="areas-box">
          <h3>${esc(T.titulo)}</h3>
          <table class="areas"><thead><tr>${T.colunas.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
          <tbody>${T.linhas.map(([a, ...v]) => `<tr><th scope="row">${esc(a)}</th>${v.map((x) => `<td>${reais(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>
          <p>${esc(T.nota)}</p>
        </div>`);
  }
  if (s.extra) {
    out.push(`<div class="areas-box">
          <h3>${esc(s.extra.titulo)}</h3>
          <dl class="peles">${s.extra.lista.map(([p, d]) => `<div><dt>${esc(p)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>
        </div>`);
  }
  return out.join('\n        ');
};
const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
const abaSeg = (s, i) => `<button type="button" role="tab" class="aba" id="aba-${s.id}" data-seg="${s.id}" aria-controls="seg-${s.id}" aria-selected="${i ? 'false' : 'true'}"${i ? ' tabindex="-1"' : ''}><b class="aba-longo">${esc(s.nome)}</b><b class="aba-curto">${esc(s.curto)}</b><small>${s.id === 'pacotes' ? plural(s.itens.length, 'pacote', 'pacotes') : plural(s.itens.length, 'tratamento', 'tratamentos')}</small></button>`;
// com um segmento só não há abas: o bloco aparece direto, com o nome do segmento como título
const blocoSeg = (s, i) => `<div class="seg"${SEG.length > 1 ? ` role="tabpanel" aria-labelledby="aba-${s.id}"` : ''} id="seg-${s.id}" data-seg="${s.id}"${i ? ' hidden' : ''}>
        ${SEG.length > 1 ? '' : `<h3 class="seg-nome">${esc(s.nome)}</h3>`}
        <div class="seg-topo">${foto(s.foto, { cls: 'seg-foto' })}<p class="seg-chamada">${esc(s.chamada)}</p></div>
        <ul class="trat-lista">
          ${s.itens.map(linhaTrat).join('\n          ')}
        </ul>
        ${extraSeg(s)}
      </div>`;

// ---------- antes e depois (simulação gerada aqui, mesmo método do Bronze) ----------
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
  for (const [cx, cy, rx, ry, q] of s.regioes || []) {
    for (let j = 0; j < q; j++) {
      const ang = sorteia() * Math.PI * 2, dist = Math.sqrt(sorteia());
      const x = cx + Math.cos(ang) * rx * dist, y = cy + Math.sin(ang) * ry * dist;
      if (s.tipo === 'celulite') {
        // furinho: sombra rasa e alongada com um reflexo logo abaixo, como a pele "acolchoada" (casca de laranja)
        const r = 10 + sorteia() * 12, ry = r * (.5 + sorteia() * .25);
        marcas.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(r)}" ry="${r1(ry)}" fill="${s.cor}" fill-opacity="${r1(.05 + sorteia() * .06)}" filter="url(#ad-b${k})"/>`);
        marcas.push(`<ellipse cx="${r1(x)}" cy="${r1(y + ry * 1.4)}" rx="${r1(r * .9)}" ry="${r1(ry * .55)}" fill="#fff" fill-opacity="${r1(.05 + sorteia() * .05)}" filter="url(#ad-b${k})"/>`);
      } else if (s.tipo === 'acne') {
        const r = 3.5 + sorteia() * 5;
        if (j % 3 === 0) marcas.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(r * 4)}" ry="${r1(r * 3)}" fill="#C0584C" fill-opacity=".09" filter="url(#ad-m${k})"/>`);
        marcas.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="#B4453C" fill-opacity="${r1(.14 + sorteia() * .14)}" filter="url(#ad-b${k})"/>`);
        if (sorteia() > .7) marcas.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r * .3)}" fill="#E9C9A8" fill-opacity=".35" filter="url(#ad-f${k})"/>`);
      } else if (s.tipo === 'manchas') {
        const r = 16 + sorteia() * 30;
        marcas.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(r)}" ry="${r1(r * (.6 + sorteia() * .4))}" fill="#7E4A2C" fill-opacity="${r1(.18 + sorteia() * .16)}" filter="url(#ad-b${k})"/>`);
        for (let z = 0; z < 2; z++) marcas.push(`<circle cx="${r1(x + (sorteia() - .5) * r * 2)}" cy="${r1(y + (sorteia() - .5) * r * 2)}" r="${r1(1.6 + sorteia() * 2.4)}" fill="#6E4129" fill-opacity="${r1(.16 + sorteia() * .14)}" filter="url(#ad-b${k})"/>`);
      } else {
        const r = 2.5 + sorteia() * 4.5;
        marcas.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="#8E4A3A" fill-opacity="${r1(.12 + sorteia() * .14)}" filter="url(#ad-b${k})"/>`);
      }
    }
  }
  const blur = { manchas: 9, celulite: 6 }[s.tipo] ?? 1.8;
  // volume: a mesma foto um pouco mais larga, sem desenho por cima
  const estilo = s.tipo === 'volume' ? `filter:${s.filtro};transform:scaleX(${s.escala});transform-origin:${s.origem}` : `filter:${s.filtro}`;
  return `<div class="ad-antes" aria-hidden="true">
            <img src="assets/img/${c.foto}.webp" alt="" loading="lazy" style="${estilo}">
            <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice"><defs><filter id="ad-b${k}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter><filter id="ad-m${k}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter><filter id="ad-f${k}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1"/></filter></defs>${marcas.join('')}</svg>
          </div>`;
};
const AD = (C.antesDepois || []).filter((c) => ligado(c.seg));
const setas = '<svg viewBox="0 0 22 12" aria-hidden="true"><path d="M8 1.5 3.5 6 8 10.5M14 1.5 18.5 6 14 10.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const cartaoAD = (c, k) => `<figure class="ad-card" data-cartao${dataSeg(c.seg)}>
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
const opcoes = SEG.map((s) => `<optgroup label="${esc(s.nome)}" data-seg="${s.id}">${s.itens.map((t) => `<option${t.requer ? ` data-requer="${t.requer.join(',')}"` : ''}>${esc(t.nome)}</option>`).join('')}</optgroup>`).join('');
const dias = C.horarios.map(([d, h], i) => `<tr data-linha="${i}"><th scope="row">${d}</th><td>${h}</td></tr>`).join('');

// ---------- textos legais [JURÍDICO] (mesma base do Bronze; o Silver não coleta dados de saúde no site) ----------
const legal = {
  servico: ['Termos de prestação de serviço', `
    <p>Estes termos valem para todos os atendimentos da ${M.completo} (${M.razao}, CNPJ ${M.cnpj}).</p>
    <h3>Avaliação e plano</h3><p>Todo protocolo de celulite e gordura localizada, toda drenagem pós-operatória e todo primeiro pacote começam por uma avaliação sem custo. Nela a cliente preenche a ficha de saúde, tem as medidas registradas e recebe o plano por escrito, com tratamento, número de sessões, intervalo e valor. Informar alergias, medicamentos e condições de saúde é necessário para a segurança do procedimento.</p>
    <h3>Preços e pagamento</h3><p>Os preços desta página são de sessão avulsa ou de pacote e podem mudar sem aviso; vale o valor do plano assinado. Pagamento em Pix, débito ou crédito, com sessão avulsa em até 3x e pacotes em até 10x sem juros no cartão.</p>
    <h3>Pacotes</h3><p>Têm a validade escrita no plano (de 2 a 4 meses, contada da primeira sessão) e são pessoais. Na desistência, devolvemos o valor das sessões não feitas, calculado pelo preço do pacote, descontados 10% de custo administrativo.</p>
    <h3>Agendamento, cancelamento e remarcação</h3><p>Cancelamento e remarcação sem custo até 24h antes. Com menos de 24h, a sessão avulsa é cobrada em 50% e a de pacote conta como feita, exceto em caso de saúde com atestado. Tolerância de atraso de 15 minutos.</p>
    <h3>Garantia</h3><p>Garantimos o serviço bem executado: pressão ajustada durante a sessão sempre que a cliente pedir, remarcação sem custo de sessão perdida por falha nossa e medidas refeitas no meio do pacote sem custo. Não há garantia de resultado: cada organismo responde de um jeito.</p>
    <h3>Contraindicações</h3><p>A clínica pode recusar ou adiar um procedimento quando houver contraindicação ou risco à saúde, e pode pedir liberação médica. Drenagem pós-operatória só com pedido ou liberação do cirurgião.</p>
    <p>Dúvidas: ${M.email} ou WhatsApp ${M.whatsappTexto}.</p>`],
  uso: ['Termos de uso do site', `
    <p>Este site apresenta a ${M.completo}, seus tratamentos, preços e políticas. O conteúdo é informativo e não substitui a avaliação individual.</p>
    <h3>Informações e preços</h3><p>Fazemos o possível para manter tudo atualizado. Em caso de diferença, vale o que estiver no plano entregue na avaliação.</p>
    <h3>Imagens e textos</h3><p>Textos, marca e fotos pertencem à ${M.completo} ou são usados com licença. As imagens de antes e depois desta página são simulações ilustrativas. Não é permitido copiar para uso comercial.</p>
    <h3>Formulário</h3><p>O formulário monta uma mensagem e abre o WhatsApp no seu aparelho. Este site não guarda as respostas. O envio acontece só quando você toca em enviar dentro do WhatsApp.</p>
    <h3>Links externos</h3><p>WhatsApp, mapas e redes sociais seguem os termos de cada serviço.</p>`],
  privacidade: ['Política de privacidade', `
    <p>Controladora dos dados: ${M.razao}, CNPJ ${M.cnpj}, ${endereco}. Encarregado de dados: ${M.encarregado}.</p>
    <h3>Quais dados</h3><p>Nome, WhatsApp, e-mail, tratamento de interesse e período preferido, quando você envia o formulário. Este site não pede dados de saúde: a ficha de saúde é preenchida na avaliação, na clínica.</p>
    <h3>Para que usamos</h3><p>Responder o seu pedido, agendar e preparar a avaliação. Dados de saúde, medidas e fotos de acompanhamento feitos na avaliação são dados sensíveis pela LGPD (Lei 13.709/2018, art. 11) e são usados apenas para avaliar a indicação e a segurança do procedimento, com o seu consentimento específico. Novidades e horários livres só com a sua autorização separada.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins comerciais. A mensagem passa pelo WhatsApp, que tem a própria política. A ficha de saúde, as medidas e as fotos ficam no prontuário da clínica, com acesso restrito à equipe que atende você.</p>
    <h3>Por quanto tempo</h3><p>Pedidos sem atendimento são apagados em até 6 meses. Prontuário e ficha de saúde são guardados pelo prazo exigido pelas normas sanitárias e profissionais.</p>
    <h3>Seus direitos</h3><p>Você pode pedir acesso, correção, cópia ou exclusão dos seus dados, e retirar o consentimento a qualquer momento, pelo e-mail ${M.encarregado}.</p>
    <h3>Cookies</h3><p>O site usa armazenamento essencial do navegador para lembrar a sua escolha sobre cookies e o tema claro ou escuro. Não usamos cookies de publicidade. Medição de visitas só com a sua permissão no aviso de cookies.</p>`],
};
const dialogs = Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-topo"><h2 id="doc-${id}-t">${t}</h2><button type="button" class="doc-fecha" data-fecha aria-label="Fechar">${I.fechar}</button></div>
  <div class="doc-corpo">${corpo}<p class="doc-fim">Texto de modelo, a validar na revisão jurídica. Atualizado em novembro de 2026.</p></div>
</dialog>`).join('\n');

const DEP = S.depoimentos.filter((d) => ligado(d[2]));
const segNomes = lista(SEG.map((s) => s.nome.toLowerCase()));
const faixaTxt = Array.from({ length: 6 }, () => `<span>${esc(S.faixa)}</span>${florzinha}`).join('');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${M.completo} | Estética corporal no ${M.bairro}, ${M.cidade}</title>
<meta name="description" content="${M.completo}: ${segNomes} no ${M.bairro}, ${M.cidade}. Avaliação com medidas sem custo e plano por escrito. Agende pelo WhatsApp.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#1C1916">
<meta property="og:title" content="${M.completo}">
<meta property="og:description" content="Estética corporal com avaliação sem custo, medidas e plano por escrito.">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<script>(function(){var d=document.documentElement,t=null,v=null;d.classList.add("js");try{var q=new URLSearchParams(location.search);t=q.get("tema")||localStorage.getItem("camelia-tema");v=q.has("intro")?null:q.has("semintro")?"1":sessionStorage.getItem("camelia-intro")}catch(e){}if(t==="escuro")d.dataset.tema="escuro";if(!v&&!matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("intro")})()</script>
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
<div class="abertura" id="abertura" aria-hidden="true"><p class="abertura-frase"></p><span class="abertura-pular">Toque para pular</span></div>
<a class="pular" href="#tratamentos">Pular para os tratamentos</a>

<header class="topo" id="topo">
  <div class="wrap topo-in">
    <a class="logo" href="#inicio" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="menu" id="menu" aria-label="Seções">
      <a href="#tratamentos">Tratamentos</a>
      <a href="#resultados">Resultados</a>
      <a href="#sobre">Sobre</a>
      <a href="#duvidas">Dúvidas</a>
      <a href="#agendar">Agendar</a>
    </nav>
    <button class="tema-btn" type="button" aria-pressed="false" aria-label="Ativar tema escuro" title="Tema escuro">${I.temaFlor}</button>
    <a class="btn btn-vinho topo-cta" href="${waAval}" target="_blank" rel="noopener">${I.whats}<span>Agendar avaliação</span></a>
    <button class="menu-btn" type="button" aria-controls="menu" aria-expanded="false" aria-label="Abrir menu"><span></span><span></span><span></span></button>
  </div>
</header>

<main>
  <section class="capa" id="inicio">
    <div class="capa-foto">
      ${foto('capa', { lazy: false })}
      <div class="brilhos" data-brilhos aria-hidden="true"></div>
    </div>
    <div class="wrap capa-in">
      <div class="capa-txt">
        <p class="apoio">${esc(S.capa.apoio)}</p>
        <h1>${tit(S.capa.titulo)}</h1>
        <p class="capa-sub">${esc(S.capa.texto)}</p>
        <a class="btn btn-vinho btn-grande" href="${waAval}" target="_blank" rel="noopener">${I.whats}<span>Quero agendar minha avaliação</span></a>
        <ul class="capa-marcas">${S.capa.marcas.map((m) => `<li>${florzinha}<span>${esc(m)}</span></li>`).join('')}</ul>
      </div>
    </div>
  </section>

  <section class="sec" aria-labelledby="t-dores">
    <div class="wrap">
      <div class="sec-topo">
        <p class="apoio">${esc(S.dores.apoio)}</p>
        <h2 id="t-dores">${tit(S.dores.titulo)}</h2>
      </div>
      <div class="dores">
        ${S.dores.itens.filter((d) => ligado(d[2])).map(([t, d, seg]) => `<article class="dor" data-cartao${dataSeg(seg)}><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join('\n        ')}
      </div>
    </div>
  </section>

  <div class="faixa" aria-hidden="true"><div class="faixa-trilho"><div class="faixa-lote">${faixaTxt}</div><div class="faixa-lote">${faixaTxt}</div></div></div>

  <section class="sec sec-medos" aria-labelledby="t-medos">
    <div class="wrap">
      <div class="sec-topo">
        <p class="apoio">${esc(S.medos.apoio)}</p>
        <h2 id="t-medos">${tit(S.medos.titulo)}</h2>
        <p class="medos-sub">${esc(S.medos.sub)}</p>
      </div>
      <ul class="medos">
        ${S.medos.itens.map((m) => `<li class="medo" data-cartao>“${esc(m)}”</li>`).join('\n        ')}
      </ul>
      <p class="medos-fecho">${esc(S.medos.fecho[0])}<b>${esc(S.medos.fecho[1])}</b>${esc(S.medos.fecho[2])}</p>
    </div>
  </section>

  <section class="sec sec-areia" aria-labelledby="t-pilares">
    <div class="wrap">
      <div class="sec-topo">
        <p class="apoio">${esc(S.pilares.apoio)}</p>
        <h2 id="t-pilares">${tit(S.pilares.titulo)}</h2>
      </div>
      <div class="pilares">
        ${S.pilares.itens.map(([p, t, d]) => `<article class="pilar" data-cartao><span class="pilar-palavra">${esc(p)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="sec sec-noite" id="tratamentos" aria-labelledby="t-trat">
    <div class="flutuam" data-flutuam aria-hidden="true"></div>
    <div class="wrap">
      <div class="sec-topo">
        <p class="apoio">${esc(S.tratamentos.apoio)}</p>
        <h2 id="t-trat">${tit(S.tratamentos.titulo)}</h2>
      </div>
      ${SEG.length > 1 ? `<div class="abas" role="tablist" aria-label="Segmentos" style="--n:${SEG.length}">
        ${SEG.map(abaSeg).join('\n        ')}
      </div>` : ''}
      ${SEG.map(blocoSeg).join('\n      ')}
      <div class="pagar">
        ${C.pagamento.map(([t, d]) => `<div><h3>${t}</h3><p>${d}</p></div>`).join('')}
      </div>
      <div class="trat-fim">
        <p>${esc(S.tratamentos.fecho)}</p>
        <a class="btn btn-claro btn-grande" href="${waAval}" target="_blank" rel="noopener">${I.whats}<span>Agendar minha avaliação</span></a>
      </div>
    </div>
  </section>

  ${AD.length || DEP.length ? `<section class="sec" id="resultados" aria-labelledby="t-res">
    <div class="wrap">
      <div class="sec-topo">
        <p class="apoio">Resultados</p>
        <h2 id="t-res">${tit(S.resultados.titulo)}</h2>
        <p class="sec-sub">Arraste sobre a foto para comparar o antes e o depois.</p>
      </div>
      ${AD.length ? `<div class="ads">
      ${AD.map(cartaoAD).join('\n      ')}
      </div>` : ''}
      <p class="ad-aviso"${AD.length ? '' : ' hidden'}>As imagens desta demonstração são simulações feitas sobre fotos de banco de imagens. No site da clínica entram fotos reais, sempre com autorização por escrito da cliente. ${C.avisoResultado.split('. ').slice(0, 2).join('. ')}.</p>
      <div class="depos">
        ${DEP.map(([t, q, seg]) => `<blockquote class="depo" data-cartao${dataSeg(seg)}><p>${esc(t)}</p><footer>${esc(q)}</footer></blockquote>`).join('\n        ')}
      </div>
      <p class="miudo depos-nota">Depoimentos ilustrativos do modelo.</p>
    </div>
  </section>` : ''}

  <section class="sec sec-areia" id="atendimento" aria-labelledby="t-atend">
    <div class="wrap">
      <div class="sec-topo">
        <p class="apoio">Como funciona</p>
        <h2 id="t-atend">Do primeiro contato ao <em>retorno</em></h2>
      </div>
      <ol class="etapas" data-linha>
        ${C.etapas.map(([t, d]) => `<li><h3>${t}</h3><p>${d}</p></li>`).join('')}
      </ol>
      <div class="regras">
        <div class="regras-contra" data-cartao>
          <h3>Quando o tratamento não é indicado</h3>
          <ul>${C.contraindicacoes.map((c) => `<li>${I.fechar}<span>${esc(c)}</span></li>`).join('')}</ul>
          <p class="miudo">A lista completa é conferida na ficha de saúde da avaliação.</p>
        </div>
        <div class="regras-pol" data-cartao>
          <p class="regra-24"><b>24h</b><span>Até 24 horas antes, você cancela ou remarca sem pagar nada.</span></p>
          ${C.politicas.map(([t, d]) => `<details class="pol"><summary>${t}<span aria-hidden="true">${I.mais}</span></summary><p>${d}</p></details>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <section class="sec" id="sobre" aria-labelledby="t-sobre">
    <div class="wrap sobre">
      <div class="sobre-foto">${foto('responsavel')}</div>
      <div class="sobre-txt">
        <p class="apoio">${esc(S.sobre.apoio)}</p>
        <h2 id="t-sobre">Sou a <em>${esc(R.nome)}</em>.</h2>
        <p class="sobre-cargo">${esc(R.cargo)}. <b>${esc(R.registro)}</b></p>
        <p>${esc(R.texto)}</p>
        <p>${esc(R.equipe)}</p>
        <blockquote class="sobre-cit" data-cartao><p>“${esc(S.sobre.citacao)}”</p><footer>${esc(S.sobre.citacaoSub)}</footer></blockquote>
        <dl class="seguro">${C.seguranca.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
      </div>
    </div>
    <div class="galeria" aria-label="Fotos da clínica">
      <div class="galeria-trilho">${[0, 1].map((k) => `<div class="galeria-lote"${k ? ' aria-hidden="true"' : ''}>${S.galeria.map((g) => `<figure>${foto(g, k ? { alt: '' } : {})}</figure>`).join('')}</div>`).join('')}</div>
    </div>
  </section>

  <section class="sec sec-areia" id="duvidas" aria-labelledby="t-faq">
    <div class="wrap faq">
      <div class="sec-topo">
        <p class="apoio">Dúvidas frequentes</p>
        <h2 id="t-faq">Antes de você <em>decidir</em></h2>
      </div>
      <div class="faq-lista">${C.faq.filter((f) => ligado(f[2])).map(([q, a, seg]) => `<details class="pergunta" data-cartao${dataSeg(seg)}><summary><span>${q}</span><span class="pergunta-sinal" aria-hidden="true">${I.mais}</span></summary><p>${a}</p></details>`).join('')}</div>
    </div>
  </section>

  <section class="sec sec-noite" id="agendar" aria-labelledby="t-ag">
    <div class="flutuam" data-flutuam aria-hidden="true"></div>
    <div class="wrap ag">
      <div class="ag-lado">
        <p class="apoio">${esc(S.final.apoio)}</p>
        <h2 id="t-ag">${tit(S.final.titulo)}</h2>
        <p class="ag-txt">${esc(S.final.texto)}</p>
        <table class="horas"><caption>Horário de atendimento</caption><tbody>${dias}</tbody></table>
        <p class="ag-end">${I.pino}<span>${endereco}<br>CEP ${M.cep}</span></p>
        <p class="ag-status" data-status>Seg a sex, 9h às 20h</p>
      </div>
      <form class="form" id="form" novalidate>
        <h3>Peça seu horário</h3>
        <p class="form-sub">O pedido abre pronto no WhatsApp. Respondemos em horário de atendimento, normalmente em menos de uma hora.</p>
        <div class="campos">
          <label class="campo"><span>Nome</span><input name="nome" autocomplete="name" required></label>
          <label class="campo"><span>WhatsApp</span><input name="whats" type="tel" inputmode="tel" autocomplete="tel" placeholder="(19) 90000-0000" required></label>
        </div>
        <label class="campo"><span>Tratamento</span><select name="trat"><option>Ainda não sei, quero a avaliação</option>${opcoes}</select></label>
        <fieldset class="periodo"><legend>Melhor período</legend>
          <div class="opts">${['Manhã', 'Tarde', 'Noite', 'Sábado'].map((p, i) => `<label><input type="radio" name="periodo" value="${p}"${i ? '' : ' checked'}><span>${p}</span></label>`).join('')}</div>
        </fieldset>
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

<a class="whats-flutua" href="${waAval}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">${I.whats}</a>

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
if (faltando.length) console.log('fotos faltando em _build-silver/img/fotos/:', faltando.join(', '));
