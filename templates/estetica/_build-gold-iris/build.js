// Gera o Gold "Íris" de estética (Camélia Estética, marca fictícia) em "templates/estetica/gold-iris/".
// Depilação a laser e com cera, design de sobrancelhas, extensão de cílios e lash lifting.
// Site completo: provador do olhar, mapa do corpo com simulador de pacotes, preços, antes e depois arrastável,
// agenda por profissional, avaliação online, avaliações do Google, clube, vale-presente, loja, blog e SEO local.
// Uso: node templates/estetica/_build-gold-iris/build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');
const I = require('./icons');
const D = require('./desenho');

const OUT = path.join(__dirname, '..', 'gold-iris');
const FOTOS = path.join(__dirname, 'img', 'fotos');
const M = C.marca;
const R = C.responsavel;

// ---------- segmentos ligados ----------
const ligados = C.segmentos.filter((s) => s.ativo).map((s) => s.id);
const ligado = (seg) => !seg || (Array.isArray(seg) ? seg.some((x) => ligados.includes(x)) : ligados.includes(seg));
const SEG = C.segmentos.filter((s) => s.ativo);
const SERV = C.servicos.filter((s) => ligado(s.cat));
const temOlhar = ligado(['cilios', 'sobrancelhas']);
const temCorpo = ligado(['laser', 'cera']);
const dataSeg = (seg) => (seg ? ` data-seg="${Array.isArray(seg) ? seg.join(',') : seg}"` : '');

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${M.whatsapp}?text=${encodeURIComponent(msg)}`;
const endereco = `${M.endereco}, ${M.bairro}, ${M.cidade}, ${M.uf}`;
const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${M.rua}, ${M.bairro}, ${M.cidade}`)}`;
const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
const reais = (v) => `R$ ${v.toLocaleString('pt-BR')}`;
const lista = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} e ${a.at(-1)}`);
const minutos = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
const tit = ([a, b, c = '']) => `${esc(a)}<em>${esc(b)}</em>${esc(c)}`;

// ---------- arquivos ----------
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'blog'), { recursive: true });
for (const f of fs.readdirSync(FOTOS)) fs.copyFileSync(path.join(FOTOS, f), path.join(OUT, 'assets', 'img', f));
fs.copyFileSync(path.join(__dirname, 'img', 'mapa_cambui.webp'), path.join(OUT, 'assets', 'img', 'mapa_cambui.webp'));
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), I.favicon);
fs.writeFileSync(path.join(OUT, 'assets', 'site.css'), fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8'));
fs.writeFileSync(path.join(OUT, 'assets', 'site.js'), `${fs.readFileSync(path.join(__dirname, 'desenho.js'), 'utf8')}\n${fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8')}`);

const faltando = [];
const foto = (nome, { cls = '', lazy = true, alt, pre = '' } = {}) => {
  const desc = alt ?? C.fotos[nome] ?? nome;
  if (!fs.existsSync(path.join(FOTOS, `${nome}.webp`))) faltando.push(nome);
  return `<img class="foto ${cls}" src="${pre}assets/img/${nome}.webp" alt="${esc(desc)}"${lazy ? ' loading="lazy" decoding="async"' : ''}>`;
};
const creditos = JSON.parse(fs.readFileSync(path.join(__dirname, 'img', 'creditos.json'), 'utf8'));

// Bodoni Moda nos títulos (traço fino de alto contraste, como um fio) e Commissioner no texto. Dupla nova no projeto.
const fontes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400;1,6..96,500&family=Commissioner:wght@300;400;500;600&display=swap" rel="stylesheet">';

// ---------- dados para o navegador ----------
const dados = {
  whatsapp: M.whatsapp, nome: M.completo, endereco, abertura: C.abertura, ligados,
  equipe: C.equipe.map(({ id, nome, cargo, foto: f, faz, agenda }) => ({ id, nome, cargo, foto: f, faz: faz.filter(ligado), agenda })).filter((p) => p.faz.length),
  servicos: SERV.map(({ id, cat, nome, min, preco, de, gratis, manut, porArea }) => ({ id, cat, nome, min, preco, de, gratis, manut, porArea })),
  areas: C.areas.map(([id, nome, cera, laser, vista, x, y, sessoes]) => ({ id, nome, cera, laser, vista, x, y, sessoes })),
  pacotes: C.laserPacotes, combo: C.laserCombo, intervalo: C.laserIntervalo, parcelas: C.parcelas,
  provador: C.provador, clube: C.clube.planos.filter((p) => ligado(p.seg)).map(({ id, nome, mensal, anual }) => ({ id, nome, mensal, anual })),
  vale: { ...C.vale, servicos: C.vale.servicos.map((id) => C.servicos.find((s) => s.id === id)).filter((s) => ligado(s.cat)).map(({ id, nome, preco }) => ({ id, nome, preco })) },
  produtos: C.produtos.filter((p) => ligado(p.seg)).map(({ id, nome, tam, preco }) => ({ id, nome, tam, preco })),
  entrega: C.entrega,
  anamnese: C.anamnese.filter((q) => ligado(q.seg)).map((q) => ({ ...q, seg: q.seg.filter(ligado) })),
  segNomes: Object.fromEntries(C.segmentos.map((s) => [s.id, s.curto])),
};

// ---------- topo e rodapé (compartilhados com o blog; `pre` = caminho até a raiz) ----------
const nav = [
  ['servicos', 'Serviços'], temOlhar && ['provador', 'Provador'], temCorpo && ['corpo', 'Mapa do corpo'], ['precos', 'Preços'],
  ['clube', 'Clube'], ['loja', 'Loja'], ['blog', 'Blog'],
].filter(Boolean);
const topo = (pre = '', ancora = (id) => `${pre ? `${pre}index.html` : ''}#${id}`) => `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo" id="topo">
  <div class="topo-in">
    <a class="logo" href="${pre || './'}${pre ? 'index.html' : ''}#inicio" aria-label="${M.completo}, início">${I.logo}</a>
    <nav class="menu" id="menu" aria-label="Principal">
      ${nav.map(([id, t]) => `<a href="${ancora(id)}">${t}</a>`).join('\n      ')}
    </nav>
    <div class="topo-acoes">
      <span class="aberto" data-aberto hidden></span>
      <button type="button" class="sacola-btn" data-sacola aria-label="Abrir a sacola">${I.sacola}<b data-sacola-n>0</b></button>
      <a class="btn btn-tinta btn-agendar" href="${ancora('agenda')}">${I.agenda}<span>Agendar</span></a>
      <button type="button" class="menu-btn" aria-controls="menu" aria-expanded="false" aria-label="Abrir o menu"><span></span><span></span></button>
    </div>
  </div>
</header>`;

const dias = C.horarios.map(([d, h], i) => `<tr data-linha="${i}"><th scope="row">${d}</th><td>${h}</td></tr>`).join('');
const rodape = (pre = '') => `<footer class="rodape" id="contato">
  <div class="rodape-in">
    <div class="mapa-linha">
      <div class="map-box">
        <img src="${pre}assets/img/mapa_cambui.webp" alt="Mapa do ${M.bairro}, ${M.cidade}, com a localização da ${M.completo}" width="1240" height="760" loading="lazy">
        <span class="pin" style="left:68%" aria-hidden="true"><b>${M.nome}</b></span>
        <div class="map-info"><b>${M.completo}</b><span>${endereco}, CEP ${M.cep}</span><span>Seg a sex, 9h às 20h. Sábado, 8h às 15h</span>
          <div class="mbtns" data-iguais><a href="${mapsUrl}" target="_blank" rel="noopener">${I.pino}Abrir no Maps</a><a href="${rotaUrl}" target="_blank" rel="noopener">${I.seta}Como chegar</a></div>
        </div>
        <span class="attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a></span>
      </div>
      <div class="onde">
        <h2>Onde atendemos</h2>
        <p>Só na clínica, com hora marcada. Recebemos clientes destes bairros e cidades vizinhas.</p>
        <ul class="bairros" data-iguais>${C.bairros.map((b) => `<li>${b}</li>`).join('')}</ul>
        <table class="horas">${dias}</table>
      </div>
    </div>
    <div class="rodape-cols">
      <div class="rodape-marca"><a class="logo" href="${pre}index.html#inicio" aria-label="${M.completo}">${I.logo}</a><p>${esc(M.frase)}</p></div>
      <div><h3>Serviços</h3><ul>${SEG.map((s) => `<li><a href="${pre}index.html#precos" data-aba-ir="${s.id}">${s.nome}</a></li>`).join('')}<li><a href="${pre}index.html#atendimento">Políticas de atendimento</a></li></ul></div>
      <div><h3>Canais de atendimento</h3><ul><li><a href="${wa(`Olá, ${M.completo}!`)}" target="_blank" rel="noopener">WhatsApp ${M.whatsappTexto}</a></li><li><a href="tel:${M.telefone.replace(/\D/g, '')}">Telefone ${M.telefone}</a></li><li><a href="mailto:${M.email}">${M.email}</a></li><li><a href="${pre}index.html#agenda">Agenda online</a></li></ul></div>
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
      <p>Responsável técnica: ${R.nome}, ${R.cargo.split(',')[0].toLowerCase()}, ${R.registro}. Equipamentos e produtos com registro ou notificação na Anvisa. Licença sanitária municipal em dia.</p>
      <div class="legal-links"><button type="button" class="link" data-doc="servico">Termos de prestação de serviço</button><button type="button" class="link" data-doc="uso">Termos de uso</button><button type="button" class="link" data-doc="privacidade">Política de privacidade</button><button type="button" class="link" data-cookies>Preferências de cookies</button></div>
      <details class="creditos"><summary>Créditos das imagens</summary><ul>${creditos.map((c) => `<li>${esc(c.arq)}: <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.autor)}, ${esc(c.fonte)}</a></li>`).join('')}</ul></details>
      <p class="modelo">Modelo de site com marca, pessoas, preços e avaliações fictícios. © ${new Date().getFullYear()} ${M.completo}.</p>
    </div>
  </div>
</footer>
<a class="whats-flutua" href="${wa(`Olá! Vim pelo site da ${M.completo}.`)}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${I.whats}<span>WhatsApp</span></a>`;

// ---------- textos legais [JURÍDICO] ----------
const legal = {
  servico: ['Termos de prestação de serviço', `
    <p>Estes termos valem para todos os atendimentos da ${M.completo} (${M.razao}, CNPJ ${M.cnpj}).</p>
    <h3>Avaliação e testes</h3><p>Toda primeira sessão de laser começa por uma avaliação presencial sem custo, com ficha de saúde, classificação do tom de pele e teste de mecha. Extensão de cílios, lash lifting, henna e brow lamination exigem teste de alergia 48 horas antes. Informar alergias, medicamentos e condições de saúde é necessário para a segurança do procedimento.</p>
    <h3>Preços e pagamento</h3><p>Os preços desta página podem mudar sem aviso; vale o valor confirmado no agendamento ou no plano assinado. Pagamento em Pix, débito ou crédito, com serviço avulso em até 3x e pacotes de laser em até ${C.parcelas}x sem juros no cartão.</p>
    <h3>Pacotes de laser</h3><p>Valem por 18 meses a partir da primeira sessão e são pessoais. Na desistência, devolvemos o valor das sessões não feitas, calculado pelo preço do pacote, descontados 10% de custo administrativo.</p>
    <h3>Clube de assinatura</h3><p>Cobrança mensal no cartão de crédito. O plano mensal pode ser cancelado a qualquer momento com aviso de 30 dias. O plano anual tem fidelidade de 12 meses e multa de 10% das mensalidades restantes na saída antecipada. Serviços do mês não acumulam.</p>
    <h3>Vale-presente</h3><p>Válido por 6 meses a partir da compra, em serviços e produtos. Não é trocado por dinheiro.</p>
    <h3>Loja</h3><p>Pedidos da loja são confirmados pelo WhatsApp, com pagamento por Pix ou cartão. Produto lacrado pode ser devolvido em até 7 dias depois do recebimento, nas compras feitas a distância.</p>
    <h3>Agendamento, cancelamento e remarcação</h3><p>O horário escolhido na agenda online fica reservado por 2 horas até a confirmação pela equipe. Cancelamento e remarcação sem custo até 24 horas antes. Com menos de 24 horas, cobramos 50% do serviço avulso, e a sessão de pacote conta como feita, exceto em caso de saúde com atestado.</p>
    <h3>Garantia</h3><p>Garantimos o serviço bem executado: retoque do design em até 7 dias, reposição de cílios caídos em até 72 horas e remarcação sem custo de sessão perdida por falha nossa. Não há garantia de resultado nem de depilação definitiva.</p>
    <p>Dúvidas: ${M.email} ou WhatsApp ${M.whatsappTexto}.</p>`],
  uso: ['Termos de uso do site', `
    <p>Este site apresenta a ${M.completo}, seus serviços, preços e políticas. O conteúdo é informativo e não substitui a avaliação individual.</p>
    <h3>Simuladores e provador</h3><p>O provador do olhar, o mapa do corpo e o simulador de pacotes mostram ilustrações e valores de referência. O valor final é o confirmado na avaliação.</p>
    <h3>Agenda online</h3><p>Os horários mostrados são os livres no momento da consulta. O pedido é confirmado pela equipe por mensagem.</p>
    <h3>Avaliação online</h3><p>É uma triagem, não um diagnóstico. As respostas ficam no seu navegador e só são enviadas à clínica se você tocar em enviar.</p>
    <h3>Imagens e textos</h3><p>Textos, marca, ilustrações e fotos pertencem à ${M.completo} ou são usados com licença. As imagens de antes e depois são ilustrações. Não é permitido copiar para uso comercial.</p>
    <h3>Links externos</h3><p>WhatsApp, Google, mapas e redes sociais seguem os termos de cada serviço.</p>`],
  privacidade: ['Política de privacidade', `
    <p>Controladora dos dados: ${M.razao}, CNPJ ${M.cnpj}, ${endereco}. Encarregado de dados: ${M.encarregado}.</p>
    <h3>Quais dados</h3><p>Nome, WhatsApp, e-mail, serviço, profissional, dia e horário escolhidos, quando você pede um agendamento, compra na loja, assina o clube ou compra um vale-presente.</p>
    <h3>Dados de saúde</h3><p>As respostas da avaliação online (gestação, medicamentos, alergias, tom de pele e condições da pele e dos olhos) são dados sensíveis pela LGPD (Lei 13.709/2018, art. 11). Só são tratados com o seu consentimento específico, marcado antes das perguntas, e servem apenas para avaliar a indicação e a segurança do procedimento. Ficam no seu navegador até você decidir enviar à clínica. Na clínica, entram no prontuário com acesso restrito à equipe que atende você.</p>
    <h3>Para que usamos</h3><p>Responder o seu pedido, agendar, preparar o atendimento e cumprir obrigações sanitárias. Novidades e horários livres só com a sua autorização separada.</p>
    <h3>Com quem compartilhamos</h3><p>Com ninguém para fins comerciais. As mensagens passam pelo WhatsApp, que tem a própria política. Pagamentos recorrentes do clube são processados pela operadora do cartão.</p>
    <h3>Por quanto tempo</h3><p>Pedidos sem atendimento são apagados em até 6 meses. Prontuário e ficha de saúde são guardados pelo prazo exigido pelas normas sanitárias e profissionais.</p>
    <h3>Seus direitos</h3><p>Você pode pedir acesso, correção, cópia ou exclusão dos seus dados e retirar o consentimento a qualquer momento, pelo e-mail ${M.encarregado}.</p>
    <h3>Cookies e armazenamento</h3><p>O site guarda no seu navegador a sua escolha sobre cookies, a sacola da loja e os horários que você pediu. Não usamos cookies de publicidade. Medição de visitas só com a sua permissão no aviso de cookies.</p>`],
};
const dialogs = (pre = '') => `${Object.entries(legal).map(([id, [t, corpo]]) => `<dialog class="doc" id="doc-${id}" aria-labelledby="doc-${id}-t">
  <div class="doc-topo"><h2 id="doc-${id}-t">${t}</h2><button type="button" class="doc-fecha" data-fecha aria-label="Fechar">${I.fechar}</button></div>
  <div class="doc-corpo">${corpo}<p class="doc-fim">Texto de modelo, a validar na revisão jurídica. Atualizado em novembro de 2026.</p></div>
</dialog>`).join('\n')}
<div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies" hidden>
  <p>Usamos o essencial para o site funcionar e lembrar a sua sacola. Se você permitir, também medimos visitas de forma anônima. <button type="button" class="link" data-doc="privacidade">Saiba mais</button></p>
  <div class="cookies-btns" data-iguais><button type="button" class="btn btn-tinta" data-ck="todos">Aceitar todos</button><button type="button" class="btn btn-linha" data-ck="essenciais">Só os essenciais</button></div>
</div>
<aside class="sacola" id="sacola" aria-label="Sacola" hidden>
  <div class="sacola-topo"><h2>Sua sacola</h2><button type="button" class="doc-fecha" data-sacola-fecha aria-label="Fechar a sacola">${I.fechar}</button></div>
  <ul class="sacola-itens" data-sacola-itens></ul>
  <p class="sacola-vazia" data-sacola-vazia>A sacola está vazia. Os produtos ficam na <a href="${pre}index.html#loja" data-sacola-fecha>loja</a>.</p>
  <div class="sacola-pe" data-sacola-pe hidden>
    <fieldset class="entrega"><legend>Entrega</legend>${C.entrega.map(([id, t, v], i) => `<label><input type="radio" name="entrega" value="${id}"${i ? '' : ' checked'}><span>${t}</span><small>${v === 0 ? 'sem custo' : v ? reais(v) : 'a calcular'}</small></label>`).join('')}</fieldset>
    <p class="sacola-total"><span>Total</span><b data-sacola-total>R$ 0</b></p>
    <a class="btn btn-tinta btn-largo" data-sacola-enviar href="#" target="_blank" rel="noopener">${I.whats}Finalizar pelo WhatsApp</a>
    <p class="mini">Confirmamos estoque, frete e pagamento (Pix ou cartão) pela conversa. Assinante do clube tem desconto.</p>
  </div>
</aside>
<div class="aviso-toast" role="status" aria-live="polite" data-toast></div>`;

const cabeca = ({ titulo, descricao, url, pre = '', imagem = 'capa', extra = '', ld }) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${M.dominio}/${url}">
<meta name="robots" content="noindex, nofollow"><!-- modelo de catálogo: no site real, trocar por "index, follow" e liberar o robots.txt -->
<meta name="geo.region" content="BR-${M.uf}"><meta name="geo.placename" content="${M.cidade}"><meta name="geo.position" content="${M.geo.join(';')}"><meta name="ICBM" content="${M.geo.join(', ')}">
<meta property="og:type" content="${url.startsWith('blog/') && url !== 'blog/' ? 'article' : 'website'}"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="${M.completo}">
<meta property="og:title" content="${esc(titulo)}"><meta property="og:description" content="${esc(descricao)}"><meta property="og:url" content="${M.dominio}/${url}"><meta property="og:image" content="${M.dominio}/assets/img/${imagem}.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1E2233">
<link rel="icon" href="${pre}assets/favicon.svg" type="image/svg+xml">
${fontes}
<link rel="stylesheet" href="${pre}assets/site.css">
${extra}<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>`;

// ---------- dados estruturados (SEO local) ----------
const DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const hhmm = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
const negocioId = `${M.dominio}/#clinica`;
const negocio = {
  '@type': ['BeautySalon', 'HealthAndBeautyBusiness'], '@id': negocioId, name: M.completo, legalName: M.razao, taxID: M.cnpj,
  description: M.frase, url: `${M.dominio}/`, telephone: `+${M.whatsapp}`, email: M.email, image: `${M.dominio}/assets/img/capa.webp`,
  logo: `${M.dominio}/assets/favicon.svg`, priceRange: 'R$ 15 a R$ 2.900', currenciesAccepted: 'BRL', paymentAccepted: 'Pix, cartão de débito, cartão de crédito',
  foundingDate: String(M.desde),
  address: { '@type': 'PostalAddress', streetAddress: M.endereco, addressLocality: M.cidade, addressRegion: M.uf, postalCode: M.cep, addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: M.geo[0], longitude: M.geo[1] },
  hasMap: rotaUrl,
  areaServed: C.bairros.map((b) => ({ '@type': 'Place', name: b === 'Valinhos' ? 'Valinhos, SP' : `${b}, ${M.cidade}, SP` })),
  openingHoursSpecification: C.abertura.map((h, d) => h && { '@type': 'OpeningHoursSpecification', dayOfWeek: DIAS[d], opens: hhmm(h[0]), closes: hhmm(h[1]) }).filter(Boolean),
  sameAs: [M.instagram, M.facebook, M.linkedin],
  employee: C.equipe.map((p) => ({ '@type': 'Person', name: p.nome, jobTitle: p.cargo, ...(p.registro.startsWith('CRBM') ? { hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: 'Registro profissional', name: p.registro } } : {}) })),
  // [EXEMPLO] nota fictícia do modelo: no site real, só publicar a nota se vier das avaliações reais
  aggregateRating: { '@type': 'AggregateRating', ratingValue: C.google.nota.replace(',', '.'), reviewCount: C.google.total, bestRating: 5 },
  hasOfferCatalog: {
    '@type': 'OfferCatalog', name: 'Serviços',
    itemListElement: SEG.map((s) => ({
      '@type': 'OfferCatalog', name: s.nome,
      itemListElement: SERV.filter((x) => x.cat === s.id).map((x) => ({
        '@type': 'Offer', itemOffered: { '@type': 'Service', name: x.nome, description: x.resumo },
        priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'BRL', ...(x.de ? { minPrice: x.de } : { price: x.preco }) },
      })),
    })),
  },
};
const ldIndex = {
  '@context': 'https://schema.org',
  '@graph': [
    negocio,
    { '@type': 'WebSite', '@id': `${M.dominio}/#site`, url: `${M.dominio}/`, name: M.completo, inLanguage: 'pt-BR', publisher: { '@id': negocioId } },
    { '@type': 'FAQPage', mainEntity: C.faq.filter((f) => ligado(f[2])).map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ],
};

// ================= index =================
const minPreco = (cat) => {
  const s = SERV.filter((x) => x.cat === cat && !x.gratis);
  const v = s.map((x) => x.preco ?? x.de);
  const a = cat === 'laser' || cat === 'cera' ? C.areas.map((x) => (cat === 'laser' ? x[3] : x[2])) : [];
  return Math.min(...v, ...a);
};

// capa
const olhoCapa = D.olho({ estilo: 'natural', curva: 'C', sobr: 'arco', id: 'oc', rotulo: 'Desenho de um olho com extensão de cílios fio a fio' });
const capa = `<section class="capa" id="inicio">
  <div class="capa-in">
    <div class="capa-txt">
      <p class="apoio">${esc(lista(SEG.map((s) => s.curto)))} no ${M.bairro}, ${M.cidade}</p>
      <h1>Cada fio<br><em>no seu lugar.</em></h1>
      <p class="capa-lead">${esc(SEG.length === 4 ? 'Depilação a laser e com cera, design de sobrancelhas, extensão de cílios e lash lifting.' : `${lista(SEG.map((s) => s.nome))}.`)} Preço por área, agenda aberta por profissional e avaliação online antes de marcar.</p>
      <div class="capa-btns" data-iguais>
        <a class="btn btn-tinta" href="#agenda">${I.agenda}Ver horários livres</a>
        <a class="btn btn-linha" href="#avaliacao">Fazer a avaliação online</a>
      </div>
      <dl class="capa-fatos">
        <div><dt>${C.google.nota}</dt><dd>no Google, ${C.google.total} avaliações</dd></div>
        <div><dt>${C.equipe.length}</dt><dd>profissionais com agenda própria</dd></div>
        <div><dt>${M.desde}</dt><dd>no ${M.bairro}, com responsável técnica</dd></div>
      </dl>
    </div>
    <figure class="capa-olho" aria-label="Olho desenhado fio a fio">
      <div class="olho-palco" data-olho-capa>${olhoCapa}</div>
      ${temOlhar && ligado('cilios') ? `<div class="capa-estilos" role="group" aria-label="Estilo dos cílios no desenho" data-iguais>
        ${C.provador.cilios.slice(0, 4).map((c, i) => `<button type="button" data-capa-estilo="${c.id}" aria-pressed="${i ? 'false' : 'true'}">${c.nome.replace('Fio a fio natural', 'Natural')}</button>`).join('')}
      </div>` : ''}
      <figcaption>Desenhado fio a fio. Mexa o cursor e o olho acompanha.</figcaption>
    </figure>
  </div>
</section>`;

// faixa de serviços (painéis que se abrem)
const servicosFaixa = `<section class="servicos" id="servicos" aria-labelledby="servicos-t">
  <div class="sec-cab"><h2 id="servicos-t">${tit([SEG.length > 1 ? `${['', '', 'Dois', 'Três', 'Quatro'][SEG.length]} cuidados, ` : 'Um cuidado, ', 'o mesmo capricho', ''])}</h2><p>Cada serviço tem profissional própria, preço aberto e tempo de atendimento sem pressa.</p></div>
  <div class="paineis">
    ${SEG.map((s, i) => `<a class="painel${i ? '' : ' aberto'}" href="#precos" data-aba-ir="${s.id}" data-seg="${s.id}">
      ${foto(s.foto, { cls: 'painel-foto' })}
      <span class="painel-txt"><b>${esc(s.nome)}</b><span>${esc(s.frase)}</span><small>a partir de ${reais(minPreco(s.id))}</small></span>
    </a>`).join('\n    ')}
  </div>
</section>`;

// provador do olhar
const P = C.provador;
const servPorId = Object.fromEntries(C.servicos.map((s) => [s.id, s]));
const provador = !temOlhar ? '' : `<section class="provador" id="provador" aria-labelledby="provador-t">
  <div class="provador-in">
    <div class="prov-palco">
      <div class="olho-palco" data-prov-olho>${D.olho({ estilo: ligado('cilios') ? 'natural' : 'antes', curva: 'C', sobr: ligado('sobrancelhas') ? 'arco' : 'antes', id: 'op', rotulo: 'Desenho do olhar escolhido no provador' })}</div>
      <p class="prov-legenda">Ilustração para escolher o estilo. A lash designer confirma o desenho olhando o seu olho.</p>
    </div>
    <div class="prov-ctrl">
      <h2 id="provador-t">${tit(['Provador ', 'do olhar', ''])}</h2>
      <p>Escolha os fios e a sobrancelha e veja o desenho mudar. No fim, o serviço, o tempo e o preço daquele olhar.</p>
      ${ligado('cilios') ? `<fieldset class="prov-grupo"><legend>Cílios</legend>
        <div class="opcoes" data-iguais>${P.cilios.map((c, i) => `<label><input type="radio" name="prov-cilios" value="${c.id}"${i ? '' : ' checked'}><span>${c.nome}</span></label>`).join('')}</div>
        <p class="prov-nota" data-prov-texto>${esc(P.cilios[0].texto)}</p>
      </fieldset>
      <div class="prov-duplo">
        <fieldset class="prov-grupo"><legend>Curvatura</legend>
          <div class="opcoes opcoes-curtas" data-iguais>${P.curvas.map(([c, t], i) => `<label title="${t}"><input type="radio" name="prov-curva" value="${c}"${i ? '' : ' checked'}><span>${c}</span></label>`).join('')}</div>
        </fieldset>
        <label class="prov-grupo prov-range"><span class="legenda">Tamanho <b data-prov-mm>10 mm</b></span><input type="range" min="8" max="14" step="1" value="10" name="prov-mm" aria-label="Tamanho dos fios em milímetros"></label>
      </div>` : ''}
      ${ligado('sobrancelhas') ? `<fieldset class="prov-grupo"><legend>Sobrancelha</legend>
        <div class="opcoes" data-iguais>${P.sobrancelhas.map((s, i) => `<label><input type="radio" name="prov-sobr" value="${s.id}"${i ? '' : ' checked'}><span>${s.nome}</span></label>`).join('')}</div>
        <label class="chave"><input type="checkbox" name="prov-henna"><span>Com henna</span></label>
      </fieldset>` : ''}
      <div class="prov-resultado" aria-live="polite">
        <div data-prov-res></div>
        <div class="prov-btns" data-iguais><a class="btn btn-claro" href="#agenda" data-prov-agendar>${I.agenda}Agendar este olhar</a><a class="btn btn-linha-clara" href="#resultados">Ver antes e depois</a></div>
      </div>
    </div>
  </div>
</section>`;

// mapa do corpo e simulador de pacotes
const vistas = ['frente', 'costas'];
const ponto = (a) => `<button type="button" class="ponto" data-area="${a[0]}" data-vista="${a[4]}" style="left:${(a[5] / 220 * 100).toFixed(2)}%;top:${(a[6] / 500 * 100).toFixed(2)}%" aria-pressed="false"${a[4] === 'frente' ? '' : ' hidden'}><span class="sr">${a[1]}</span></button>`;
const corpo = !temCorpo ? '' : `<section class="corpo" id="corpo" aria-labelledby="corpo-t">
  <div class="sec-cab"><h2 id="corpo-t">${tit(['Toque nas áreas. ', 'O valor sai na hora', '.'])}</h2><p>Escolha ${ligado('laser') && ligado('cera') ? 'laser ou cera, ' : ''}as áreas e ${ligado('laser') ? 'o número de sessões' : 'veja o total por visita'}. Os valores são os da tabela, com os descontos de pacote já aplicados.</p></div>
  <div class="corpo-in">
    <div class="silhueta-box">
      <div class="vistas" role="group" aria-label="Lado do corpo" data-iguais>${vistas.map((v, i) => `<button type="button" data-vista-btn="${v}" aria-pressed="${i ? 'false' : 'true'}">${v === 'frente' ? 'Frente' : 'Costas'}</button>`).join('')}</div>
      <div class="silhueta" data-silhueta>
        <svg viewBox="0 0 220 500" aria-hidden="true"><defs><linearGradient id="sil-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--nevoa)"/><stop offset="1" stop-color="var(--perola)"/></linearGradient></defs>
          <path class="sil" d="${D.silhueta()}"/><g class="sil">${D.cabeca}</g><path class="sil-costas" d="M110 96V250M96 130c6 6 22 6 28 0" hidden/></svg>
        ${C.areas.map(ponto).join('')}
      </div>
    </div>
    <div class="simulador">
      ${ligado('laser') && ligado('cera') ? `<div class="tecnica" role="group" aria-label="Técnica" data-iguais><button type="button" data-tecnica="laser" aria-pressed="true">Laser</button><button type="button" data-tecnica="cera" aria-pressed="false">Cera</button></div>` : ''}
      <fieldset class="areas-chips"><legend>Áreas</legend>
        <div class="chips" data-iguais>${C.areas.map((a) => `<label><input type="checkbox" name="area" value="${a[0]}"><span>${a[1]}</span><small data-area-preco="${a[0]}"></small></label>`).join('')}</div>
      </fieldset>
      ${ligado('laser') ? `<fieldset class="sessoes" data-so-laser><legend>Sessões de laser</legend>
        <div class="opcoes" data-iguais>${C.laserPacotes.map(([n, d], i) => `<label><input type="radio" name="sessoes" value="${n}"${i === 3 ? ' checked' : ''}><span>${n === 1 ? 'Avulsa' : `${n} sessões`}</span><small>${d ? `${Math.round(d * 100)}% off` : 'preço cheio'}</small></label>`).join('')}</div>
      </fieldset>` : ''}
      <div class="sim-res" aria-live="polite" data-sim-res><p class="sim-vazio">Toque numa área da silhueta ou da lista para começar.</p></div>
      <div class="sim-btns" data-iguais><a class="btn btn-tinta" href="#agenda" data-sim-agendar>${I.agenda}Agendar estas áreas</a><a class="btn btn-linha" href="#" target="_blank" rel="noopener" data-sim-whats>${I.whats}Pedir orçamento</a></div>
    </div>
  </div>
</section>`;

// preços
const precoTxt = (s) => {
  if (s.gratis) return `<span class="pr"><small>avaliação</small>${s.gratis}</span>`;
  if (s.de) return `<span class="pr"><small>a partir de</small>${reais(s.de)}</span>`;
  return `<span class="pr"><small>valor</small>${reais(s.preco)}</span>`;
};
const linhaServ = (s) => `<li class="serv" data-servico="${s.id}">
          <details>
            <summary><span class="serv-nome"><b>${esc(s.nome)}</b><span>${esc(s.resumo)}</span></span>${precoTxt(s)}</summary>
            <div class="serv-corpo">
              <dl class="serv-ficha"><div><dt>Duração</dt><dd>${minutos(s.min)}</dd></div><div><dt>Sessões</dt><dd>${esc(s.sessoes)}</dd></div>${s.manut ? `<div><dt>Manutenção</dt><dd>${reais(s.manut[0])}, ${s.manut[1]}</dd></div>` : ''}</dl>
              <div class="serv-inclui"><b>O que inclui</b><ul>${s.inclui.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
              <a class="btn btn-tinta" href="#agenda" data-agendar="${s.id}">${I.agenda}Agendar</a>
            </div>
          </details>
        </li>`;
const tabelaAreas = (cat) => `<div class="tab-areas">
          <h3>${cat === 'laser' ? 'Laser por área' : 'Cera por área'}</h3>
          <table><thead><tr><th scope="col">Área</th>${cat === 'laser' ? '<th scope="col">Sessão</th><th scope="col">Pacote de 10</th><th scope="col">Sessões indicadas</th>' : '<th scope="col">Por sessão</th>'}</tr></thead>
          <tbody>${C.areas.map((a) => `<tr><th scope="row">${a[1]}</th>${cat === 'laser' ? `<td>${reais(a[3])}</td><td>${reais(Math.round(a[3] * 10 * (1 - C.laserPacotes.at(-1)[1])))}</td><td>${a[7]} a ${a[7] + 2}</td>` : `<td>${reais(a[2])}</td>`}</tr>`).join('')}</tbody></table>
          <p>${cat === 'laser' ? `Pacote de 6 sessões com 10% de desconto, de 8 com 15% e de 10 com 20%. Três áreas ou mais no mesmo pacote: mais 10%. Em até ${C.parcelas}x sem juros.` : 'Cera de uso único. Duas áreas ou mais na mesma visita entram no tempo de um atendimento só.'}</p>
        </div>`;
const precos = `<section class="precos" id="precos" aria-labelledby="precos-t">
  <div class="sec-cab"><h2 id="precos-t">${tit(['Preços ', 'abertos', ', do jeito que você vai pagar'])}</h2><p>O que inclui, duração, número de sessões e valor. Toque num serviço para ver os detalhes.</p></div>
  ${SEG.length > 1 ? `<div class="abas" role="tablist" aria-label="Serviços" data-iguais>${SEG.map((s, i) => `<button type="button" role="tab" id="aba-${s.id}" aria-controls="painel-${s.id}" aria-selected="${i ? 'false' : 'true'}"${i ? ' tabindex="-1"' : ''} data-aba="${s.id}">${s.curto}</button>`).join('')}</div>` : ''}
  ${SEG.map((s, i) => `<div class="aba-painel" id="painel-${s.id}"${SEG.length > 1 ? ` role="tabpanel" aria-labelledby="aba-${s.id}"` : ''}${i ? ' hidden' : ''}>
      <div class="aba-grade">
        <ul class="serv-lista">
        ${SERV.filter((x) => x.cat === s.id).map(linhaServ).join('\n        ')}
        </ul>
        ${s.id === 'laser' || s.id === 'cera' ? tabelaAreas(s.id) : `<figure class="aba-foto">${foto(s.id === 'cilios' ? 'lifting' : 'sobrancelha-feita')}<figcaption>${s.id === 'cilios' ? 'Fios escolhidos pelo formato do olho, com cola hipoalergênica.' : 'Desenho medido antes de tirar o primeiro fio.'}</figcaption></figure>`}
      </div>
    </div>`).join('\n  ')}
  <div class="pagamento">${C.pagamento.map(([t, d]) => `<div><h3>${t}</h3><p>${esc(d)}</p></div>`).join('')}</div>
</section>`;

// antes e depois (ilustrações)
const AD = C.antesDepois.filter((a) => ligado(a.seg));
const adPar = (a) => {
  if (a.id === 'cilios') return [D.olho({ estilo: 'antes', sobr: ligado('sobrancelhas') ? 'arco' : 'antes', id: 'ad1a', rotulo: 'Antes: cílios naturais curtos' }), D.olho({ estilo: 'natural', curva: 'C', sobr: ligado('sobrancelhas') ? 'arco' : 'antes', id: 'ad1d', rotulo: 'Depois: extensão fio a fio' })];
  if (a.id === 'sobrancelhas') return [D.olho({ estilo: 'antes', sobr: 'antes', id: 'ad2a', semente: 11, rotulo: 'Antes: sobrancelha sem design' }), D.olho({ estilo: 'antes', sobr: 'arco', henna: true, id: 'ad2d', semente: 11, rotulo: 'Depois: design com henna' })];
  return [D.perna({ pelos: true, id: 'ad3a', rotulo: 'Antes: perna com pelos' }), D.perna({ id: 'ad3d', rotulo: 'Depois: perna lisa' })];
};
const resultados = !AD.length ? '' : `<section class="resultados" id="resultados" aria-labelledby="resultados-t">
  <div class="sec-cab"><h2 id="resultados-t">${tit(['Arraste e ', 'compare', ''])}</h2><p>Ilustrações de casos típicos, com o protocolo ao lado. Nada aqui é promessa: cada pele e cada fio respondem de um jeito.</p></div>
  ${AD.length > 1 ? `<div class="abas abas-claras" role="tablist" aria-label="Antes e depois" data-iguais>${AD.map((a, i) => `<button type="button" role="tab" aria-selected="${i ? 'false' : 'true'}"${i ? ' tabindex="-1"' : ''} data-ad="${a.id}">${a.nome}</button>`).join('')}</div>` : ''}
  ${AD.map((a, i) => {
    const [antes, depois] = adPar(a);
    return `<div class="ad" data-ad-painel="${a.id}"${i ? ' hidden' : ''}>
    <div class="ad-palco" style="--corte:50%">
      <div class="ad-camada ad-depois">${depois}</div>
      <div class="ad-camada ad-antes">${antes}</div>
      <span class="ad-rot ad-rot-a">Antes</span><span class="ad-rot ad-rot-d">Depois</span>
      <span class="ad-alca" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M15 13l-6 7 6 7M25 13l6 7-6 7"/></svg></span>
      <input class="ad-range" type="range" min="0" max="100" value="50" aria-label="Arraste para comparar antes e depois: ${esc(a.titulo)}">
      <span class="ad-selo">Ilustração</span>
    </div>
    <div class="ad-txt"><h3>${esc(a.titulo)}</h3><p>${esc(a.texto)}</p></div>
  </div>`;
  }).join('\n  ')}
  <p class="aviso">${esc(C.avisoResultado)}</p>
</section>`;

// equipe
const EQ = C.equipe.filter((p) => p.faz.some(ligado));
const equipe = `<section class="equipe" id="equipe" aria-labelledby="equipe-t">
  <div class="sec-cab"><h2 id="equipe-t">${tit(['Quem cuida ', 'de você', ''])}</h2><p>Cada profissional tem a própria agenda. Escolha com quem quer ser atendida.</p></div>
  <div class="equipe-grade">
    ${EQ.map((p) => `<article class="pessoa" data-pessoa="${p.id}">
      <div class="pessoa-foto">${foto(p.foto)}</div>
      <h3>${esc(p.nome)}</h3>
      <p class="pessoa-cargo">${esc(p.cargo)}<br><small>${esc(p.registro)}</small></p>
      <p>${esc(p.texto)}</p>
      <p class="pessoa-faz">${esc(lista(p.faz.filter(ligado).map((f) => C.segmentos.find((s) => s.id === f).nome)))}</p>
      <a class="btn btn-linha" href="#agenda" data-agenda-prof="${p.id}">${I.agenda}Ver a agenda da ${esc(p.nome.split(' ')[0])}</a>
    </article>`).join('\n    ')}
  </div>
  <p class="rt"><b>Responsável técnica:</b> ${R.nome}, ${R.cargo.split(',')[0].toLowerCase()}, ${R.registro}.</p>
</section>`;

// agenda
const agenda = `<section class="agenda" id="agenda" aria-labelledby="agenda-t">
  <div class="sec-cab"><h2 id="agenda-t">${tit(['Agenda ', 'aberta', ''])}</h2><p>Escolha o serviço, a profissional e um horário livre. O horário fica reservado por 2 horas até a nossa confirmação pelo WhatsApp.</p></div>
  <div class="agenda-in">
    <form class="ag" data-ag novalidate>
      <ol class="ag-passos" aria-label="Etapas do agendamento">
        <li data-passo-rot="servico" aria-current="step">Serviço</li><li data-passo-rot="prof">Profissional</li><li data-passo-rot="horario">Dia e horário</li><li data-passo-rot="dados">Seus dados</li>
      </ol>
      <div class="ag-passo" data-passo="servico">
        ${SEG.map((s) => `<fieldset class="ag-grupo"><legend>${s.nome}</legend><div class="ag-servicos">
          ${SERV.filter((x) => x.cat === s.id).map((x) => `<label class="ag-serv"><input type="radio" name="servico" value="${x.id}"><span><b>${esc(x.nome)}</b><small>${minutos(x.min)}, ${x.gratis ? x.gratis.toLowerCase() : x.porArea ? 'preço por área' : x.de ? `a partir de ${reais(x.de)}` : reais(x.preco)}</small></span></label>`).join('')}
        </div></fieldset>`).join('')}
        <fieldset class="ag-grupo ag-areas" data-ag-areas hidden><legend>Quais áreas?</legend>
          <div class="chips chips-mini" data-iguais>${C.areas.map((a) => `<label><input type="checkbox" name="ag-area" value="${a[0]}"><span>${a[1]}</span></label>`).join('')}</div>
        </fieldset>
      </div>
      <div class="ag-passo" data-passo="prof" hidden><div class="ag-profs" data-ag-profs></div></div>
      <div class="ag-passo" data-passo="horario" hidden>
        <div class="ag-dias-box"><button type="button" class="ag-rola" data-rola="-1" aria-label="Dias anteriores">${I.voltar}</button><div class="ag-dias" data-ag-dias role="listbox" aria-label="Dias"></div><button type="button" class="ag-rola" data-rola="1" aria-label="Próximos dias">${I.seta}</button></div>
        <div class="ag-horas" data-ag-horas></div>
      </div>
      <div class="ag-passo" data-passo="dados" hidden>
        <div class="campos">
          <label class="campo"><span>Nome</span><input name="nome" autocomplete="name" required></label>
          <label class="campo"><span>WhatsApp</span><input name="fone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(19) 90000-0000" required></label>
          <label class="campo"><span>E-mail <small>opcional</small></span><input name="email" type="email" autocomplete="email"></label>
          <label class="campo campo-largo"><span>Algo que a gente precise saber? <small>opcional, sem dados de saúde</small></span><textarea name="obs" rows="2" maxlength="300"></textarea></label>
        </div>
        <label class="check"><input type="checkbox" name="ok_lgpd" required><span>Li a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button> e autorizo o uso destes dados para responder e confirmar este agendamento.</span></label>
        <label class="check"><input type="checkbox" name="ok_novidades"><span>Quero receber horários livres e novidades pelo WhatsApp. Opcional, dá para cancelar quando quiser.</span></label>
      </div>
      <div class="ag-passo ag-fim" data-passo="fim" hidden>
        <h3>Horário reservado por 2 horas</h3>
        <p>Envie o pedido pelo WhatsApp para a equipe confirmar. Se preferir, salve na sua agenda.</p>
        <div class="ag-ticket" data-ag-ticket></div>
        <div class="ag-fim-btns" data-iguais><a class="btn btn-tinta" data-ag-whats href="#" target="_blank" rel="noopener">${I.whats}Enviar pelo WhatsApp</a><a class="btn btn-linha" data-ag-ics href="#" download="camelia-agendamento.ics">${I.agenda}Salvar na agenda</a></div>
        <button type="button" class="link" data-ag-novo>Fazer outro agendamento</button>
      </div>
      <p class="ag-erro" data-ag-erro role="alert"></p>
      <div class="ag-nav"><button type="button" class="btn btn-linha" data-ag-volta hidden>${I.voltar}Voltar</button><button type="button" class="btn btn-tinta" data-ag-segue>Continuar${I.seta}</button></div>
    </form>
    <aside class="ag-resumo" aria-label="Resumo do agendamento">
      <h3>Seu horário</h3>
      <dl data-ag-resumo><div><dt>Serviço</dt><dd>Escolha ao lado</dd></div></dl>
      <p class="mini">Primeira vez no laser? Comece pela avaliação e teste de mecha, sem custo. Cílios, henna e lifting pedem teste de alergia 48 horas antes.</p>
      <a class="link-seta" href="#avaliacao">Fazer a avaliação online antes ${I.seta}</a>
    </aside>
  </div>
</section>`;

// avaliação online (anamnese)
const avaliacao = `<section class="avaliacao" id="avaliacao" aria-labelledby="avaliacao-t">
  <div class="aval-in">
    <div class="aval-txt">
      <h2 id="avaliacao-t">${tit(['Avaliação online, ', 'em dois minutos', ''])}</h2>
      <p>Algumas respostas rápidas mostram se dá para agendar direto, se vale passar antes pela avaliação presencial ou se é melhor esperar alguns dias. É uma triagem, não um diagnóstico.</p>
      <ul class="aval-garantias">
        <li><b>Fica com você.</b> As respostas ficam só neste navegador. A clínica só recebe se você tocar em enviar.</li>
        <li><b>Dado de saúde é sensível.</b> Pedimos o seu consentimento específico antes da primeira pergunta, como manda a LGPD.</li>
        <li><b>Não substitui a presencial.</b> Para laser, o teste de mecha na clínica continua obrigatório.</li>
      </ul>
      ${foto('laser-rosto', { cls: 'aval-foto' })}
    </div>
    <div class="aval-cartao" data-aval>
      <div class="aval-tela" data-aval-tela="inicio">
        <h3>Antes de começar</h3>
        <p>As próximas perguntas tratam de gestação, medicamentos, alergias e condições da pele e dos olhos. São dados de saúde, considerados sensíveis pela LGPD.</p>
        <label class="check"><input type="checkbox" data-aval-ok><span>Autorizo a ${M.completo} a tratar estas informações de saúde só para avaliar a indicação e a segurança dos serviços que eu escolher, conforme a <button type="button" class="link" data-doc="privacidade">Política de privacidade</button>. Posso retirar esta autorização quando quiser.</span></label>
        <button type="button" class="btn btn-tinta" data-aval-comecar disabled>Começar${I.seta}</button>
      </div>
      <div class="aval-tela" data-aval-tela="servicos" hidden>
        <h3>O que você quer fazer?</h3>
        <div class="chips" data-iguais>${SEG.map((s) => `<label><input type="checkbox" name="aval-seg" value="${s.id}"><span>${s.nome}</span></label>`).join('')}</div>
        <div class="aval-nav"><button type="button" class="btn btn-tinta" data-aval-seg-ok disabled>Continuar${I.seta}</button></div>
      </div>
      <div class="aval-tela" data-aval-tela="pergunta" hidden>
        <div class="aval-barra"><span data-aval-barra></span></div>
        <div data-aval-pergunta></div>
        <div class="aval-nav"><button type="button" class="link" data-aval-volta>${I.voltar}Voltar</button></div>
      </div>
      <div class="aval-tela" data-aval-tela="resultado" hidden>
        <h3>O que as suas respostas indicam</h3>
        <div data-aval-res></div>
        <div class="aval-fim-btns" data-iguais><a class="btn btn-tinta" href="#agenda" data-aval-agendar>${I.agenda}Ir para a agenda</a><a class="btn btn-linha" href="#" target="_blank" rel="noopener" data-aval-enviar>${I.whats}Enviar para a clínica</a></div>
        <button type="button" class="link" data-aval-apagar>Apagar minhas respostas</button>
      </div>
    </div>
  </div>
</section>`;

// avaliações do Google
const G = C.google;
const AV = G.avaliacoes.filter((a) => ligado(a.seg));
const estrelas = (n) => `<span class="estrelas" aria-label="${n} de 5 estrelas">${Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? 'cheia' : ''}">${I.estrela}</i>`).join('')}</span>`;
const google = `<section class="google" id="avaliacoes" aria-labelledby="google-t">
  <div class="google-in">
    <div class="google-resumo">
      <h2 id="google-t">${tit(['O que dizem ', 'no Google', ''])}</h2>
      <p class="google-nota"><b>${G.nota}</b>${estrelas(5)}<span>${G.total} avaliações</span></p>
      <ul class="google-dist">${G.distribuicao.map((p, i) => `<li><span>${5 - i}</span><i style="--p:${p}%"></i></li>`).join('')}</ul>
      <div class="google-btns" data-iguais><a class="btn btn-linha" href="${G.link}" target="_blank" rel="noopener">Ver todas no Google</a><a class="btn btn-tinta" href="${G.link}" target="_blank" rel="noopener">Avaliar a clínica</a></div>
      <p class="mini">Modelo: no site real, as avaliações entram direto do Perfil da Empresa no Google.</p>
    </div>
    <div class="google-lista">
      <div class="filtros" role="group" aria-label="Filtrar avaliações" data-iguais><button type="button" data-filtro-av="todas" aria-pressed="true">Todas</button>${SEG.map((s) => `<button type="button" data-filtro-av="${s.id}" aria-pressed="false">${s.curto}</button>`).join('')}</div>
      <div class="cartoes-av" data-cartoes-av>
        ${AV.map((a) => `<figure class="av" data-seg-av="${a.seg}"><blockquote>${esc(a.texto)}</blockquote><figcaption><span class="av-ini" aria-hidden="true">${a.nome[0]}</span><b>${esc(a.nome)}</b>${estrelas(a.nota)}<small>${a.quando}, ${C.segmentos.find((s) => s.id === a.seg).curto.toLowerCase()}</small></figcaption></figure>`).join('\n        ')}
      </div>
      <div class="rola-btns"><button type="button" data-rola-av="-1" aria-label="Avaliações anteriores">${I.voltar}</button><button type="button" data-rola-av="1" aria-label="Próximas avaliações">${I.seta}</button></div>
    </div>
  </div>
</section>`;

// clube
const CL = C.clube;
const PLANOS = CL.planos.filter((p) => ligado(p.seg));
const clube = !PLANOS.length ? '' : `<section class="clube" id="clube" aria-labelledby="clube-t">
  <div class="clube-in">
    <div class="sec-cab"><h2 id="clube-t">${tit([`${CL.nome}: `, 'o cuidado do mês', ' já marcado'])}</h2><p>Um valor por mês, os serviços de sempre e prioridade na agenda. Sem taxa de adesão.</p></div>
    <div class="periodo" role="group" aria-label="Período do plano" data-iguais><button type="button" data-periodo="mensal" aria-pressed="true">Mensal, sem fidelidade</button><button type="button" data-periodo="anual" aria-pressed="false">Anual, valor menor</button></div>
    <div class="planos">
      ${PLANOS.map((p) => `<article class="plano${p.destaque ? ' plano-destaque' : ''}" data-plano="${p.id}">
        ${p.destaque ? '<p class="plano-mais">O mais assinado</p>' : ''}
        <h3>${esc(p.nome)}</h3>
        <p class="plano-preco"><b data-plano-valor data-mensal="${p.mensal}" data-anual="${p.anual}">${reais(p.mensal)}</b><span>por mês</span></p>
        <p class="plano-comp">Avulso, sairia ${reais(p.avulso)} por mês</p>
        <ul>${p.inclui.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <a class="btn ${p.destaque ? 'btn-claro' : 'btn-linha-clara'}" href="#" target="_blank" rel="noopener" data-assinar="${p.id}">Assinar pelo WhatsApp</a>
      </article>`).join('\n      ')}
    </div>
    <ul class="clube-regras">${CL.regras.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
  </div>
</section>`;

// vale-presente
const V = dados.vale;
const vale = `<section class="vale" id="vale" aria-labelledby="vale-t">
  <div class="vale-in">
    <form class="vale-form" data-vale>
      <h2 id="vale-t">${tit(['Vale-presente ', 'com o nome dela', ''])}</h2>
      <p>Monte o vale, veja como ele fica e compre pelo WhatsApp. Chega como arte digital ou num envelope para retirar na clínica.</p>
      <fieldset><legend>Presentear com</legend>
        <div class="opcoes" data-iguais><label><input type="radio" name="vale-tipo" value="valor" checked><span>Um valor</span></label>${V.servicos.length ? '<label><input type="radio" name="vale-tipo" value="servico"><span>Um serviço</span></label>' : ''}</div>
      </fieldset>
      <fieldset data-vale-valores><legend>Valor</legend><div class="opcoes" data-iguais>${V.valores.map((v, i) => `<label><input type="radio" name="vale-valor" value="${v}"${i === 1 ? ' checked' : ''}><span>${reais(v)}</span></label>`).join('')}</div></fieldset>
      <label class="campo" data-vale-servicos hidden><span>Serviço</span><select name="vale-servico">${V.servicos.map((s) => `<option value="${s.id}">${esc(s.nome)}, ${reais(s.preco)}</option>`).join('')}</select></label>
      <fieldset><legend>Estampa</legend><div class="opcoes estampas" data-iguais>${V.estampas.map(([id, t], i) => `<label><input type="radio" name="vale-estampa" value="${id}"${i ? '' : ' checked'}><span><i class="amostra amostra-${id}"></i>${t}</span></label>`).join('')}</div></fieldset>
      <div class="campos">
        <label class="campo"><span>Para</span><input name="vale-para" maxlength="28" placeholder="Nome de quem vai ganhar"></label>
        <label class="campo"><span>De</span><input name="vale-de" maxlength="28" placeholder="Seu nome"></label>
        <label class="campo campo-largo"><span>Mensagem <small data-vale-cont>0 de 120</small></span><textarea name="vale-msg" rows="2" maxlength="120" placeholder="Um recado curto para o cartão"></textarea></label>
      </div>
      <fieldset><legend>Entrega</legend><div class="opcoes" data-iguais><label><input type="radio" name="vale-entrega" value="digital" checked><span>Arte digital</span></label><label><input type="radio" name="vale-entrega" value="envelope"><span>Envelope na clínica</span></label></div></fieldset>
      <a class="btn btn-tinta btn-largo" href="#" target="_blank" rel="noopener" data-vale-comprar>${I.presente}Comprar pelo WhatsApp</a>
      <p class="mini">${esc(C.vale.regras)}</p>
    </form>
    <div class="vale-vitrine">
      <div class="cartao-vale estampa-iris" data-cartao-vale>
        <div class="cv-face">
          <span class="cv-logo">${I.flor()}<span><b>Camélia</b><small>Vale-presente</small></span></span>
          <p class="cv-valor" data-cv-valor>${reais(V.valores[1])}</p>
          <p class="cv-para"><span>Para</span><b data-cv-para>Alguém especial</b></p>
          <p class="cv-msg" data-cv-msg>Um tempo só seu, no detalhe.</p>
          <p class="cv-de" data-cv-de></p>
          <p class="cv-rodape"><span data-cv-codigo>CML-0000</span><span data-cv-validade></span></p>
        </div>
      </div>
      <p class="mini">Prévia do cartão. O código é gerado na confirmação do pagamento.</p>
    </div>
  </div>
</section>`;

// loja
const PR = C.produtos.filter((p) => ligado(p.seg));
const loja = !PR.length ? '' : `<section class="loja" id="loja" aria-labelledby="loja-t">
  <div class="sec-cab"><h2 id="loja-t">${tit(['Para ', 'levar para casa', ''])}</h2><p>Os mesmos produtos que usamos e indicamos no pós. Retire na clínica ou receba em casa.</p></div>
  <div class="produtos">
    ${PR.map((p) => `<article class="produto" data-produto="${p.id}" data-seg="${p.seg}">
      <div class="produto-img" style="--cor:${p.cor}">${I.embalagem(p.forma, p.cor)}</div>
      <h3>${esc(p.nome)}</h3>
      <p class="produto-tam">${esc(p.tam)}</p>
      <p>${esc(p.texto)}</p>
      <div class="produto-pe"><b>${reais(p.preco)}</b><button type="button" class="btn btn-tinta" data-add="${p.id}">${I.mais}Adicionar</button></div>
    </article>`).join('\n    ')}
  </div>
  <p class="mini centro">Cosméticos com notificação na Anvisa. Preços de exemplo do modelo.</p>
</section>`;

// blog
const POSTS = C.posts.filter((p) => ligado(p.seg));
const dataBR = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
const blog = !POSTS.length ? '' : `<section class="blog" id="blog" aria-labelledby="blog-t">
  <div class="sec-cab"><h2 id="blog-t">${tit(['Dicas ', 'de quem faz', ''])}</h2><p>Cuidados antes e depois, escolhas e dúvidas que aparecem toda semana na clínica.</p></div>
  <div class="posts">
    ${POSTS.map((p, i) => `<article class="post${i ? '' : ' post-grande'}">
      <a href="blog/${p.slug}.html">${foto(p.foto, { cls: 'post-foto' })}
      <span class="post-meta">${dataBR(p.data)}, ${p.min} min de leitura</span>
      <h3>${esc(p.titulo)}</h3>
      <p>${esc(p.resumo)}</p></a>
    </article>`).join('\n    ')}
  </div>
  <p class="centro"><a class="link-seta" href="blog/index.html">Todos os artigos ${I.seta}</a></p>
</section>`;

// como funciona, políticas, contraindicações e segurança
const atendimento = `<section class="atendimento" id="atendimento" aria-labelledby="atend-t">
  <div class="sec-cab"><h2 id="atend-t">${tit(['Como funciona ', 'antes, durante e depois', ''])}</h2><p>Avaliação, testes, regras de agendamento e o que fazemos para cada atendimento ser seguro.</p></div>
  <ol class="etapas">${C.etapas.map(([t, d]) => `<li><h3>${t}</h3><p>${esc(d)}</p></li>`).join('')}</ol>
  <div class="contra">
    <h3>Quando não fazer, ou esperar</h3>
    <div class="contra-grade">${SEG.map((s) => `<div><h4>${s.curto}</h4><ul>${C.contraindicacoes[s.id].map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>`).join('')}</div>
  </div>
  <div class="politicas">${C.politicas.map(([t, d]) => `<div class="politica${t === 'Cancelamento' ? ' politica-24' : ''}"><h3>${t}</h3><p>${esc(d)}</p></div>`).join('')}</div>
  <div class="seguranca">
    <div class="seg-txt"><h3>Segurança e higiene</h3>${C.seguranca.map(([t, d]) => `<p><b>${t}.</b> ${esc(d)}</p>`).join('')}</div>
    ${foto('pinca-fios', { cls: 'seg-foto' })}
  </div>
</section>`;

// dúvidas
const duvidas = `<section class="duvidas" id="duvidas" aria-labelledby="duvidas-t">
  <div class="sec-cab"><h2 id="duvidas-t">${tit(['Dúvidas ', 'frequentes', ''])}</h2></div>
  <div class="faq">${C.faq.filter((f) => ligado(f[2])).map(([q, a]) => `<details><summary>${esc(q)}<span aria-hidden="true">${I.mais}</span></summary><p>${esc(a)}</p></details>`).join('')}</div>
</section>`;

// SEO local
const local = `<section class="local" id="local" aria-labelledby="local-t">
  <div class="local-in">
    <h2 id="local-t">${esc(C.seoLocal.titulo)}</h2>
    <div class="local-txt">${C.seoLocal.texto.map((t) => `<p>${esc(t)}</p>`).join('')}<p>${esc(M.estacionamento)}</p></div>
    <address><b>${M.completo}</b><br>${M.endereco}<br>${M.bairro}, ${M.cidade}, ${M.uf}, CEP ${M.cep}<br><a href="tel:${M.telefone.replace(/\D/g, '')}">${M.telefone}</a></address>
  </div>
</section>`;

const index = `${cabeca({
  titulo: `Depilação a laser, cílios e sobrancelhas no ${M.bairro}, ${M.cidade} | ${M.completo}`,
  descricao: `${M.frase} Agenda online, avaliação online, clube de assinatura e vale-presente.`,
  url: '', ld: ldIndex,
})}
<body>
${topo()}
<main id="conteudo">
${capa}
${servicosFaixa}
${provador}
${corpo}
${precos}
${resultados}
${equipe}
${agenda}
${avaliacao}
${google}
${clube}
${vale}
${loja}
${blog}
${atendimento}
${duvidas}
${local}
</main>
${rodape()}
${dialogs()}
<script type="application/json" id="dados">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>
<script src="assets/site.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'index.html'), index);

// ================= blog =================
const migalha = (itens) => ({ '@type': 'BreadcrumbList', itemListElement: itens.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: `${M.dominio}/${u}` })) });
const paginaBlog = (conteudo, opts) => `${cabeca({ pre: '../', ...opts })}
<body class="pag-blog">
${topo('../')}
<main id="conteudo">
${conteudo}
</main>
${rodape('../')}
${dialogs('../')}
<script type="application/json" id="dados">${JSON.stringify({ whatsapp: M.whatsapp, nome: M.completo, abertura: C.abertura, produtos: dados.produtos, entrega: C.entrega }).replace(/</g, '\\u003c')}</script>
<script src="../assets/site.js" defer></script>
</body>
</html>
`;
for (const p of POSTS) {
  const outros = POSTS.filter((x) => x !== p).slice(0, 3);
  const segP = C.segmentos.find((s) => s.id === p.seg);
  const corpo = `<article class="artigo">
  <nav class="migalha" aria-label="Você está em"><a href="../index.html">Início</a><span aria-hidden="true">/</span><a href="index.html">Blog</a><span aria-hidden="true">/</span><span>${esc(segP.curto)}</span></nav>
  <header class="artigo-cab">
    <p class="post-meta">${dataBR(p.data)}, ${p.min} min de leitura</p>
    <h1>${esc(p.titulo)}</h1>
    <p class="artigo-lead">${esc(p.resumo)}</p>
  </header>
  <figure class="artigo-foto">${foto(p.foto, { pre: '../', lazy: false })}</figure>
  <div class="artigo-corpo">
    ${p.corpo.map(([t, x]) => `<${t}>${esc(x)}</${t}>`).join('\n    ')}
    <aside class="artigo-autora">${foto('helena', { pre: '../', cls: 'autora-foto' })}<p><b>Revisado por ${R.nome}</b><br>${R.cargo}, ${R.registro}</p></aside>
    <div class="artigo-cta"><p>Quer conversar sobre o seu caso?</p><div data-iguais><a class="btn btn-tinta" href="../index.html#agenda">${I.agenda}Agendar</a><a class="btn btn-linha" href="../index.html#avaliacao">Avaliação online</a></div></div>
  </div>
  ${outros.length ? `<section class="relacionados" aria-labelledby="rel-t"><h2 id="rel-t">Leia também</h2><div class="posts posts-mini">${outros.map((o) => `<article class="post"><a href="${o.slug}.html">${foto(o.foto, { pre: '../', cls: 'post-foto' })}<span class="post-meta">${o.min} min de leitura</span><h3>${esc(o.titulo)}</h3></a></article>`).join('')}</div></section>` : ''}
</article>`;
  fs.writeFileSync(path.join(OUT, 'blog', `${p.slug}.html`), paginaBlog(corpo, {
    titulo: `${p.titulo} | Blog ${M.completo}`, descricao: p.resumo, url: `blog/${p.slug}.html`, imagem: p.foto,
    ld: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'BlogPosting', headline: p.titulo, description: p.resumo, datePublished: p.data, dateModified: p.data, inLanguage: 'pt-BR',
          image: `${M.dominio}/assets/img/${p.foto}.webp`, mainEntityOfPage: `${M.dominio}/blog/${p.slug}.html`,
          author: { '@type': 'Person', name: R.nome, jobTitle: R.cargo }, publisher: { '@id': negocioId } },
        migalha([['Início', ''], ['Blog', 'blog/'], [p.titulo, `blog/${p.slug}.html`]]),
        { '@type': ['BeautySalon'], '@id': negocioId, name: M.completo, address: negocio.address, telephone: negocio.telephone },
      ],
    },
  }));
}
const blogIndex = `<div class="blog-pag">
  <nav class="migalha" aria-label="Você está em"><a href="../index.html">Início</a><span aria-hidden="true">/</span><span>Blog</span></nav>
  <header class="artigo-cab"><h1>Dicas <em>de quem faz</em></h1><p class="artigo-lead">Depilação, cílios e sobrancelhas: cuidados, escolhas e dúvidas da clínica, revisados pela responsável técnica.</p></header>
  <div class="posts">${POSTS.map((p, i) => `<article class="post${i ? '' : ' post-grande'}"><a href="${p.slug}.html">${foto(p.foto, { pre: '../', cls: 'post-foto' })}<span class="post-meta">${dataBR(p.data)}, ${p.min} min de leitura</span><h2>${esc(p.titulo)}</h2><p>${esc(p.resumo)}</p></a></article>`).join('')}</div>
</div>`;
fs.writeFileSync(path.join(OUT, 'blog', 'index.html'), paginaBlog(blogIndex, {
  titulo: `Blog de depilação, cílios e sobrancelhas | ${M.completo}`, descricao: 'Dicas de cuidados antes e depois da depilação a laser e com cera, extensão de cílios e design de sobrancelhas.', url: 'blog/',
  ld: { '@context': 'https://schema.org', '@graph': [{ '@type': 'Blog', name: `Blog ${M.completo}`, url: `${M.dominio}/blog/`, publisher: { '@id': negocioId }, blogPost: POSTS.map((p) => ({ '@type': 'BlogPosting', headline: p.titulo, url: `${M.dominio}/blog/${p.slug}.html`, datePublished: p.data })) }, migalha([['Início', ''], ['Blog', 'blog/']])] },
}));

// sitemap e robots
const hoje = '2026-11-20';
const urls = [['', hoje, '1.0'], ['blog/', hoje, '0.6'], ...POSTS.map((p) => [`blog/${p.slug}.html`, p.data, '0.5'])];
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d, p]) => `  <url><loc>${M.dominio}/${u}</loc><lastmod>${d}</lastmod><priority>${p}</priority></url>`).join('\n')}
</urlset>
`);
// modelo de catálogo: bloqueado. No site real: "Allow: /" e a linha do Sitemap
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nDisallow: /\n# Site real: trocar por "Allow: /" e manter a linha abaixo\n# Sitemap: ${M.dominio}/sitemap.xml\n`);

console.log(`ok: ${path.relative(process.cwd(), OUT)} (index + ${POSTS.length + 1} páginas de blog)`);
if (faltando.length) console.log('fotos faltando:', [...new Set(faltando)].join(', '));
