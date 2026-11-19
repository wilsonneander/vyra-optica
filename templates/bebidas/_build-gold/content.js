// Conteúdo do modelo Gold de bebidas e conveniência (Tampinha, loja fictícia que revende marcas reais).
// [EXEMPLO] = trocar pelos dados do cliente. Todos os preços são [EXEMPLO].
//
// Fotos: img/fotos/produtos/<foto>.webp (recortadas, fundo transparente) e img/fotos/ambiente/<foto>.webp (fotos inteiras).
// Geradas por imagens.js a partir de img/originais/. Produto com `amb: true` usa foto de ambiente (drinks preparados).
// cor = tom da embalagem, usado no halo atrás da foto e na cor do texto da marca.

const marca = {
  nome: 'Tampinha',
  completo: 'Tampinha Bebidas & Conveniência',
  frase: 'A conveniência do bairro, com bebida gelada na sua porta.',
  whatsapp: '5531999990000', // [EXEMPLO]
  whatsappTexto: '(31) 99999-0000', // [EXEMPLO]
  telefone: '(31) 3333-0000', // [EXEMPLO]
  email: 'pedidos@tampinhabebidas.com.br', // [EXEMPLO]
  endereco: 'Rua Pouso Alegre, 1200', // [EXEMPLO]
  bairro: 'Floresta',
  cidade: 'Belo Horizonte, MG',
  instagram: 'https://instagram.com/',
  instagramUser: '@tampinhabebidas',
  facebook: 'https://facebook.com/',
  ifood: 'https://www.ifood.com.br/', // [EXEMPLO] link da loja no iFood
  food99: 'https://99app.com/99food/', // [EXEMPLO] link da loja no 99Food
};

// entrega [EXEMPLO]
const entrega = { taxa: 6.9, gratisAcima: 99, tempo: '30 a 45 min' };

// horário de cada dia da semana (0 = domingo), em horas decimais; fecha depois da meia-noite = 25 (1h)
const abertura = [[10, 22], [10, 23], [10, 23], [10, 23], [10, 23], [10, 25], [10, 25]];
const horarios = [['Segunda a quinta', '10h às 23h'], ['Sexta e sábado', '10h à 1h'], ['Domingo e feriado', '10h às 22h']];

// fundo = foto de ambiente atrás do painel da categoria
const categorias = [
  { id: 'cerveja', nome: 'Cervejas', alc: true, vitrine: ['budweiser-ln', 'heineken-ln', 'sol-ln'], fundo: 'amb-brinde' },
  { id: 'energetico', nome: 'Energéticos', vitrine: ['monster-violet', 'monster', 'redbull'] },
  { id: 'destilado', nome: 'Destilados e vinhos', chip: 'Destilados', alc: true, vitrine: ['smirnoff', 'tanqueray', 'vinho-miolo'] },
  { id: 'cha', nome: 'Chás e sucos', vitrine: ['ades-laranja', 'matte', 'del-valle-uva'] },
  { id: 'drink', nome: 'Drinks', alc: true, vitrine: [], fundo: 'amb-drinks-gin' },
  { id: 'agua', nome: 'Água', vitrine: ['crystal-azul', 'galao-hydrate', 'crystal'] },
  { id: 'refri', nome: 'Refrigerantes', vitrine: ['guarana-lata', 'coca-vidro', 'fanta-lata'] },
];

const P = (id, cat, nome, vol, preco, marca, cor, extra = {}) => ({ id, cat, nome, vol, preco, marca, cor, foto: id, ...extra });

const produtos = [
  // refrigerantes
  P('coca-vidro', 'refri', 'Coca-Cola Original', 'garrafa de vidro 290ml', 3.99, 'Coca-Cola', '#E41E2B'),
  P('coca-2l', 'refri', 'Coca-Cola Original', 'garrafa 2L', 11.99, 'Coca-Cola', '#E41E2B'),
  P('coca-zero-lata', 'refri', 'Coca-Cola Zero Açúcar', 'lata 350ml', 4.49, 'Coca-Cola', '#E41E2B'),
  P('guarana-lata', 'refri', 'Guaraná Antarctica', 'lata 350ml', 3.99, 'Guaraná Antarctica', '#0B8B3C'),
  P('guarana-zero-lata', 'refri', 'Guaraná Antarctica Zero', 'lata 350ml', 3.99, 'Guaraná Antarctica', '#0B6B33'),
  P('guarana-zero-2l', 'refri', 'Guaraná Antarctica Zero', 'garrafa 2L', 9.49, 'Guaraná Antarctica', '#0B6B33'),
  P('fanta-lata', 'refri', 'Fanta Laranja', 'lata 350ml', 3.99, 'Fanta', '#F7851E'),
  P('sprite-2l', 'refri', 'Sprite', 'garrafa 2L', 9.49, 'Sprite', '#0E9A48'),
  P('sprite-zero-lata', 'refri', 'Sprite Sem Açúcar', 'lata 350ml', 3.99, 'Sprite', '#0E9A48'),
  P('schweppes-lata', 'refri', 'Água Tônica Schweppes', 'lata 350ml', 4.29, 'Schweppes', '#E7B416'),

  // cervejas
  P('heineken-ln', 'cerveja', 'Heineken', 'long neck 330ml', 6.49, 'Heineken', '#1E8A3C'),
  P('heineken-lata', 'cerveja', 'Heineken', 'lata 350ml', 5.49, 'Heineken', '#1E8A3C'),
  P('heineken-zero', 'cerveja', 'Heineken 0.0 sem álcool', 'long neck 330ml', 6.49, 'Heineken', '#1E8A3C', { alc: false }),
  P('budweiser-ln', 'cerveja', 'Budweiser', 'long neck 330ml', 5.99, 'Budweiser', '#C8102E'),
  P('budweiser-lata', 'cerveja', 'Budweiser', 'lata 350ml', 4.49, 'Budweiser', '#C8102E'),
  P('budweiser-aluminio', 'cerveja', 'Budweiser', 'garrafa de alumínio 355ml', 7.49, 'Budweiser', '#C8102E'),
  P('sol-ln', 'cerveja', 'Sol Premium', 'long neck 330ml', 5.25, 'Sol', '#E9B949'),
  P('skol-lata', 'cerveja', 'Skol Pilsen', 'lata 350ml', 3.29, 'Skol', '#F2C400'),
  P('brahma-lata', 'cerveja', 'Brahma Chopp', 'lata 350ml', 3.79, 'Brahma', '#C4161C'),
  P('amstel-lata', 'cerveja', 'Amstel Lager', 'lata 269ml', 3.49, 'Amstel', '#C9A646'),
  P('original-lata', 'cerveja', 'Antarctica Original', 'lata 350ml', 4.29, 'Original', '#1F4E9C'),
  P('spaten-lata', 'cerveja', 'Spaten Munich', 'latão 473ml', 5.99, 'Spaten', '#1F6B3A'),

  // energéticos
  P('monster', 'energetico', 'Monster Energy', 'lata 473ml', 9.38, 'Monster', '#6CC04A'),
  P('monster-zero', 'energetico', 'Monster Absolutely Zero', 'lata 473ml', 9.38, 'Monster', '#3FA9D9'),
  P('monster-violet', 'energetico', 'Monster Ultra Violet', 'lata 473ml', 9.38, 'Monster', '#7E4CC2'),
  P('monster-peachy', 'energetico', 'Monster Ultra Peachy Keen', 'lata 473ml', 9.38, 'Monster', '#F3907A'),
  P('redbull', 'energetico', 'Red Bull Energy Drink', 'lata 250ml', 8.99, 'Red Bull', '#1B3A8C'),

  // destilados e vinhos
  P('smirnoff', 'destilado', 'Vodka Smirnoff', 'garrafa 998ml', 37.6, 'Smirnoff', '#C8102E'),
  P('absolut', 'destilado', 'Vodka Absolut', 'garrafa 1L', 89.9, 'Absolut', '#2C5F86'),
  P('red-label', 'destilado', 'Johnnie Walker Red Label', 'garrafa 1L', 109.0, 'Johnnie Walker', '#B8551B'),
  P('tanqueray', 'destilado', 'Gin Tanqueray London Dry', 'garrafa 750ml', 114.9, 'Tanqueray', '#1F8A4A'),
  P('vinho-miolo', 'destilado', 'Miolo Seleção Cabernet e Merlot', 'garrafa 750ml', 59.9, 'Miolo', '#7A1E2B'),
  P('vinho-campo-largo', 'destilado', 'Campo Largo Tinto Suave', 'garrafa 750ml', 27.9, 'Campo Largo', '#9B1C22'),
  P('vinho-pergola', 'destilado', 'Pérgola Tinto Suave', 'garrafa 750ml', 29.9, 'Pérgola', '#5A1A1E'),
  P('vinho-vindima', 'destilado', 'Vindima Tinto Suave', 'garrafa 750ml', 24.9, 'Vindima', '#B3121B'),

  // chás e sucos
  P('matte', 'cha', 'Matte Leão Natural', 'garrafa 1,5L', 7.99, 'Leão', '#D9772B'),
  P('del-valle-uva', 'cha', 'Del Valle Uva', 'caixa 1L', 9.99, 'Del Valle', '#6A1E5A'),
  P('ades-laranja', 'cha', 'Ades Soja e Laranja', 'caixa 1L', 8.99, 'Ades', '#F7941D'),

  // drinks preparados (foto de ambiente)
  P('drink-gin-frutas', 'drink', 'Gin tônica de frutas vermelhas', 'copo 400ml', 26.9, 'Drink da casa', '#9B1C3A', { amb: true }),
  P('drink-rose', 'drink', 'Gin rosé com limão siciliano', 'taça 200ml', 24.9, 'Drink da casa', '#C2477A', { amb: true }),
  P('drink-spritz-morango', 'drink', 'Spritz de morango', 'taça 350ml', 22.9, 'Drink da casa', '#D7261E', { amb: true }),
  P('drink-maracuja', 'drink', 'Batida de maracujá', 'taça 350ml', 19.9, 'Drink da casa', '#E39A3B', { amb: true }),
  P('drink-soda-frutas', 'drink', 'Soda italiana de frutas vermelhas', 'copo 400ml', 14.9, 'Sem álcool', '#C4161C', { amb: true, alc: false }),

  // água
  P('crystal', 'agua', 'Água Crystal sem gás', 'garrafa 500ml', 2.49, 'Crystal', '#1C64AE'),
  P('crystal-azul', 'agua', 'Água Crystal sem gás gelada', 'garrafa 500ml', 2.79, 'Crystal', '#1C64AE'),
  P('galao-hydrate', 'agua', 'Água mineral Hydrate', 'galão 5L', 8.9, 'Hydrate', '#2C7FC0'),
];

// conveniência que aparece no carrinho ("Leve também")
const extras = [
  P('gelo', 'extra', 'Gelo em cubos', 'saco 5kg', 12.9, '', '#1C64AE'),
  P('copo', 'extra', 'Copo descartável 300ml', 'pacote 50un', 7.9, 'Copobras', '#C9A646'),
  P('carvao', 'extra', 'Carvão vegetal', 'saco 3kg', 19.9, '', '#5A3A22'),
];

const destaques = ['heineken-ln', 'coca-vidro', 'monster', 'budweiser-ln', 'guarana-lata', 'skol-lata', 'smirnoff', 'redbull', 'sol-ln', 'fanta-lata', 'tanqueray', 'drink-gin-frutas'];

// esteiras de marcas: [nome, cor do nome, foto do produto, logo (opcional)]; o clique filtra o catálogo pela marca
const marcas = [
  ['Coca-Cola', '#E41E2B', 'coca-vidro', 'logo-coca'], ['Heineken', '#1E8A3C', 'heineken-ln'], ['Guaraná Antarctica', '#0B8B3C', 'guarana-lata', 'logo-guarana'],
  ['Budweiser', '#C8102E', 'budweiser-ln'], ['Fanta', '#F7851E', 'fanta-lata', 'logo-fanta'], ['Monster', '#3B8C2A', 'monster'],
  ['Sprite', '#0E9A48', 'sprite-2l', 'logo-sprite'], ['Skol', '#D9A400', 'skol-lata'], ['Red Bull', '#1B3A8C', 'redbull'],
  ['Brahma', '#C4161C', 'brahma-lata'], ['Sol', '#B5122B', 'sol-ln'], ['Smirnoff', '#C8102E', 'smirnoff'],
  ['Tanqueray', '#1F8A4A', 'tanqueray'], ['Schweppes', '#B8860B', 'schweppes-lata'], ['Spaten', '#1F6B3A', 'spaten-lata'],
  ['Amstel', '#A8822E', 'amstel-lata'], ['Del Valle', '#6A1E5A', 'del-valle-uva'], ['Crystal', '#1C64AE', 'crystal'],
];

const kits = [
  { id: 'kit-churrasco', nome: 'Kit churrasco', texto: 'O básico do domingo: cerveja gelada, refri para quem não bebe, gelo para o isopor e carvão.', itens: [['skol-lata', 12], ['coca-2l', 2], ['gelo', 1], ['carvao', 1]], arte: ['skol-lata', 'coca-2l', 'brahma-lata'], fundo: 'amb-canecas' },
  { id: 'kit-esquenta', nome: 'Kit esquenta', texto: 'Vodka, energético e gelo para começar a noite em casa.', itens: [['smirnoff', 1], ['redbull', 4], ['gelo', 1]], arte: ['redbull', 'smirnoff', 'redbull'] },
  { id: 'kit-gin', nome: 'Kit gin tônica', texto: 'Gin, tônica e gelo. O limão fica por sua conta.', itens: [['tanqueray', 1], ['schweppes-lata', 6], ['gelo', 1]], arte: ['schweppes-lata', 'tanqueray', 'schweppes-lata'] },
];

// capa: cada slide põe uma bebida no palco; tom = fundo do palco (versão bem escura da cor da marca); fundo = foto de ambiente opcional
const capa = [
  { id: 'coca-vidro', tom: '#3B0A0D', luz: '#E41E2B', titulo: 'Coca trincando de gelada', texto: 'Garrafinha de vidro, lata ou 2 litros. Sai da câmara fria e chega suando na sua mão.', lado: ['coca-2l', 'coca-zero-lata'] },
  { id: 'heineken-ln', tom: '#062A14', luz: '#1E9A45', titulo: 'Heineken do jeito certo', texto: 'Long neck, lata e a 0.0 sem álcool, todas estupidamente geladas para o happy hour em casa.', lado: ['heineken-lata', 'heineken-zero'], fundo: 'amb-heineken-bar' },
  { id: 'monster', tom: '#0E1A08', luz: '#7AC943', titulo: 'Energia para a madrugada', texto: 'Monster em quatro sabores e Red Bull trincando, para virar a noite ou o plantão.', lado: ['monster-violet', 'monster-zero'] },
  { id: 'budweiser-ln', tom: '#3A0A0C', luz: '#C8102E', titulo: 'O balde do fim de semana', texto: 'Budweiser long neck, lata e alumínio. Monte o balde e a gente leva o gelo junto.', lado: ['budweiser-lata', 'budweiser-aluminio'], fundo: 'amb-balde-corona' },
  { id: 'guarana-lata', tom: '#06280F', luz: '#16A34A', titulo: 'Original do Brasil', texto: 'Guaraná Antarctica, Fanta e Sprite geladinhos para acompanhar o lanche da família.', lado: ['fanta-lata', 'sprite-zero-lata'] },
  { id: 'tanqueray', tom: '#06261A', luz: '#2FAE5A', titulo: 'A noite pede um gin', texto: 'Tanqueray, Smirnoff, Absolut e Red Label, com tônica Schweppes para o drink perfeito.', lado: ['smirnoff', 'absolut'] },
];

// faixas de foto entre as seções
const faixas = {
  brinde: { foto: 'amb-brinde', titulo: 'Gelada para o seu brinde', texto: 'Do happy hour ao churrasco de domingo, a cerveja certa chega na temperatura certa.' },
};

// como o pedido chega no WhatsApp (sem números: a ordem aparece no desenho da linha)
const passos = [
  ['copo', 'Escolha as bebidas', 'Navegue por categoria ou marca e toque na tampinha para pôr no carrinho.'],
  ['engradado', 'Confira o carrinho', 'Ajuste as quantidades, junte gelo e copos, escolha entrega ou retirada.'],
  ['whats', 'Envie no WhatsApp', 'O pedido já vai organizado por categoria, com total e forma de pagamento.'],
  ['moto', 'Receba gelado', 'Confirmamos na hora e a bebida sai da câmara fria para a sua porta.'],
];

const promessas = [];

const faq = [
  ['Tem pedido mínimo?', 'Não. A entrega custa R$ 6,90 e sai grátis a partir de R$ 99 em compras. Também dá para retirar no balcão, sem taxa.'],
  ['A bebida chega gelada?', 'Sim. Cervejas, refrigerantes e energéticos saem da câmara fria e vão em bolsa térmica. Se quiser, adicione gelo no carrinho.'],
  ['Os drinks vão prontos?', 'Vão. Preparamos na hora e mandamos em copo lacrado, com gelo separado para não aguar no caminho.'],
  ['Como eu pago?', 'Pix, cartão de crédito ou débito na maquininha do entregador, ou dinheiro com troco. Nada é cobrado pelo site.'],
  ['Vocês vendem bebida alcoólica para menores?', 'Não. A venda de bebida alcoólica é proibida para menores de 18 anos e o entregador pode pedir documento na entrega.'],
  ['Posso pedir pelo iFood ou pelo 99Food?', 'Pode. Os preços do site e do WhatsApp costumam ser menores que os dos aplicativos, mas o estoque é o mesmo.'],
];

const bairros = ['Floresta', 'Santa Tereza', 'Sagrada Família', 'Centro', 'Santa Efigênia', 'Funcionários', 'Colégio Batista', 'Horto', 'Pompeia', 'Lagoinha']; // [EXEMPLO]

// ---------- só do Gold ----------

// capa: três garrafas em pé sobre a água escura, com reflexo
const vitrine = ['heineken-ln', 'red-label', 'tanqueray'];

// a lata da casa que gira em 3D com a rolagem. Rótulo desenhado no próprio site (marca fictícia da loja).
const reserva = {
  nome: 'Tampinha Reserva',
  estilo: 'Lager dourada',
  vol: 'lata 473ml',
  preco: 12.9, // [EXEMPLO]
  capitulos: [
    { titulo: 'Feita para a casa', texto: 'Uma lager encorpada, de cor dourada e espuma firme, produzida em pequenos lotes por uma cervejaria mineira só para a Tampinha.' },
    { titulo: 'Malte, mel e um amargor curto', texto: 'Nariz de pão fresco e mel de laranjeira. Termina seca, pedindo o próximo gole e o tira-gosto do lado.' },
    { titulo: 'Servida a 2 graus', texto: 'Sai da câmara fria na hora do pedido e viaja em bolsa térmica até a sua porta, suando como tem que ser.' },
  ],
  ficha: [['Teor', '4,9%'], ['Amargor', '18 IBU'], ['Temperatura', '2 a 4 °C'], ['Harmoniza', 'torresmo, pastel, queijo']],
};

// fotos de gente (img/pessoas/). lugar = como a foto entra no mosaico
const momentos = [
  { foto: 'brinde-noite', alt: 'Amigos brindando com copos de drink à noite', legenda: 'Sexta à noite' },
  { foto: 'varanda', alt: 'Turma brindando numa varanda com luzinhas', legenda: 'A varanda da turma' },
  { foto: 'martini', alt: 'Mulher segurando uma taça de martini num bar à meia-luz', legenda: 'Um drink sem pressa' },
  { foto: 'rooftop', alt: 'Casal sorrindo com drinks num terraço com a cidade ao fundo', legenda: 'Terraço com vista' },
  { foto: 'turma', alt: 'Amigos rindo à mesa de um bar', legenda: 'Rir até doer' },
];

// créditos das fotos de pessoas (Unsplash, licença Unsplash)
const creditos = [
  ['brinde-noite', '1640766322140-ab90a7bc71e5'], ['varanda', '1674889143237-14899c01c87b'], ['martini', '1767358536907-f46dffc92492'],
  ['rooftop', '1789758385755-0c422e20cab9'], ['bar-noite', '1761335633357-04fab36b333f'], ['turma', '1681641095463-b4d3693a0ee3'],
  ['brinde', '1575037614876-c38a4d44f5b8'], ['capa', '1513309914637-65c20a5962e1'], ['chopp', '1748864469370-0d7b79f1c55c'],
  ['gin', '1656442954583-cc07a4d11ccf'], ['moto', '1572195577046-2f25894c06fc'],
];

// acesso de demonstração da Área do Cliente (painel.html). Trocar por login real com servidor no cliente.
const acesso = { responsavel: 'Toninho Ribeiro', email: 'loja@tampinhabebidas.com.br', senha: 'tampinha2026' }; // [EXEMPLO]

module.exports = { acesso, vitrine, reserva, momentos, creditos, capa, passos, faixas, marca, entrega, abertura, horarios, categorias, produtos, extras, destaques, marcas, kits, promessas, faq, bairros };
