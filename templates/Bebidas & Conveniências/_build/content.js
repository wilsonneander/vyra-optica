// Conteúdo do modelo Bronze de bebidas e conveniência (Tampinha, marca fictícia).
// [EXEMPLO] = trocar pelos dados do cliente. Todos os preços são [EXEMPLO].
// Fotos: Unsplash (licença Unsplash) e Wikimedia Commons (ver img/creditos.json). Logos: Wikimedia Commons.
// Cliente real: pedir as fotos de produto (packshots) ao distribuidor ou fabricante e trocar em img/fotos.

const marca = {
  nome: 'Tampinha',
  completo: 'Tampinha Bebidas & Conveniência',
  frase: 'Adega e conveniência de bairro, com bebida gelada na sua porta.',
  whatsapp: '5531999990000', // [EXEMPLO]
  whatsappTexto: '(31) 99999-0000', // [EXEMPLO]
  telefone: '(31) 3333-0000', // [EXEMPLO]
  email: 'pedidos@tampinhabebidas.com.br', // [EXEMPLO]
  endereco: 'Rua Pouso Alegre, 1200', // [EXEMPLO]
  bairro: 'Floresta',
  cidade: 'Belo Horizonte, MG',
  desde: 2014, // [EXEMPLO]
  atendente: 'Toninho', // [EXEMPLO] quem responde o WhatsApp
  instagram: 'https://instagram.com/',
  instagramUser: '@tampinhabebidas',
  facebook: 'https://facebook.com/',
  ifood: 'https://www.ifood.com.br/',
  food99: 'https://99app.com/99food/',
};

// entrega [EXEMPLO]
const entrega = { taxa: 6.9, gratisAcima: 99, tempo: '30 a 45 min' };

// horário de cada dia da semana (0 = domingo), em horas decimais; fecha depois da meia-noite = 25 (1h)
const abertura = [[10, 22], [10, 23], [10, 23], [10, 23], [10, 23], [10, 25], [10, 25]];
const horarios = [['Segunda a quinta', '10h às 23h'], ['Sexta e sábado', '10h à 1h'], ['Domingo e feriado', '10h às 22h']];

const categorias = [
  { id: 'cerveja', nome: 'Cervejas', alc: true, foto: 'chopp', alt: 'Amigos brindando com copos de cerveja' },
  { id: 'refri', nome: 'Refrigerantes', foto: 'latas-gelo', alt: 'Latas de Coca-Cola geladas no gelo' },
  { id: 'energetico', nome: 'Energéticos', foto: 'monster', alt: 'Latas de energético Monster em fila' },
  { id: 'destilado', nome: 'Destilados', alc: true, foto: 'red-label', alt: 'Garrafa de Johnnie Walker Red Label com uvas' },
  { id: 'drink', nome: 'Drinks', alc: true, foto: 'aperol', alt: 'Taça de Aperol Spritz com gelo e laranja' },
  { id: 'cha', nome: 'Chás e sucos', foto: 'matte-15', alt: 'Garrafas de Matte Leão' },
  { id: 'agua', nome: 'Água e gelo', foto: 'agua', alt: 'Garrafa de água mineral' },
];

// foto = arquivo em img/fotos; logo = arquivo em img/logos (quando não há foto livre do produto)
const P = (id, cat, marcaP, nome, vol, preco, img, extra = {}) => ({ id, cat, marca: marcaP, nome, vol, preco, ...img, ...extra });

const produtos = [
  // cervejas
  P('heineken-ln', 'cerveja', 'Heineken', 'Heineken Long Neck', '330ml', 6.49, { foto: 'heineken-ln' }),
  P('heineken-lata', 'cerveja', 'Heineken', 'Heineken Lata', '350ml', 4.99, { foto: 'heineken-lata' }),
  P('skol-lata', 'cerveja', 'Skol', 'Skol Pilsen Lata', '350ml', 3.29, { logo: 'skol.svg', fundo: '#FFD200' }),
  P('skol-latao', 'cerveja', 'Skol', 'Skol Pilsen Latão', '473ml', 4.49, { logo: 'skol.svg', fundo: '#FFD200' }),
  P('brahma-engradado', 'cerveja', 'Brahma', 'Brahma Duplo Malte, engradado', '24 garrafas de 600ml', 179.9, { foto: 'brahma-engradado' }, { nota: 'Retornável: troque os cascos na entrega' }),
  P('corona', 'cerveja', 'Corona', 'Corona Extra Long Neck', '330ml', 6.99, { foto: 'corona' }),
  P('budweiser-ln', 'cerveja', 'Budweiser', 'Budweiser Long Neck', '330ml', 5.79, { foto: 'budweiser-ln' }),
  P('budweiser-lata', 'cerveja', 'Budweiser', 'Budweiser Lata', '350ml', 4.19, { foto: 'budweiser-lata' }),
  P('stella', 'cerveja', 'Stella Artois', 'Stella Artois Long Neck', '330ml', 6.29, { foto: 'stella' }),

  // refrigerantes
  P('coca-lata', 'refri', 'Coca-Cola', 'Coca-Cola Lata', '350ml', 4.49, { foto: 'coca-lata' }),
  P('coca-garrafa', 'refri', 'Coca-Cola', 'Coca-Cola Garrafa de Vidro', '290ml', 3.99, { foto: 'coca-garrafa' }),
  P('guarana', 'refri', 'Guaraná Antarctica', 'Guaraná Antarctica Lata', '350ml', 3.79, { foto: 'guarana' }),
  P('fanta', 'refri', 'Fanta', 'Fanta Guaraná Lata', '350ml', 3.99, { foto: 'fanta' }),
  P('sprite', 'refri', 'Sprite', 'Sprite Limão Lata', '350ml', 3.99, { foto: 'sprite' }),
  P('schweppes', 'refri', 'Schweppes', 'Schweppes Tônica Lata', '350ml', 4.29, { foto: 'schweppes' }),

  // energéticos
  P('redbull', 'energetico', 'Red Bull', 'Red Bull Energy Drink', '250ml', 8.99, { foto: 'redbull' }),
  P('monster', 'energetico', 'Monster', 'Monster Ultra Sunrise', '473ml', 9.38, { foto: 'monster' }),
  P('monster-ultra', 'energetico', 'Monster', 'Monster Ultra Zero Açúcar', '473ml', 9.38, { foto: 'monster-ultra' }),

  // destilados
  P('smirnoff', 'destilado', 'Smirnoff', 'Vodka Smirnoff', '998ml', 37.6, { foto: 'smirnoff' }),
  P('absolut', 'destilado', 'Absolut', 'Vodka Absolut', '1L', 89.9, { foto: 'absolut' }),
  P('red-label', 'destilado', 'Johnnie Walker', 'Whisky Johnnie Walker Red Label', '1L', 109.0, { foto: 'red-label' }),
  P('tanqueray', 'destilado', 'Tanqueray', 'Gin Tanqueray London Dry', '750ml', 114.9, { foto: 'tanqueray' }),
  P('cuervo', 'destilado', 'José Cuervo', 'Tequila José Cuervo Especial', '750ml', 109.9, { foto: 'cuervo' }),

  // drinks e aperitivos
  P('aperol', 'drink', 'Aperol', 'Aperol, para o seu spritz', '750ml', 52.5, { foto: 'aperol' }),
  P('campari', 'drink', 'Campari', 'Campari Bitter', '900ml', 56.9, { foto: 'campari' }),

  // chás e sucos
  P('matte-15', 'cha', 'Leão', 'Matte Leão Natural', 'garrafa 1,5L', 7.99, { foto: 'matte-15' }),
  P('matte-copo', 'cha', 'Leão', 'Matte Leão Copo', '300ml', 3.49, { foto: 'matte-copo' }),
  P('del-valle', 'cha', 'Del Valle', 'Del Valle Laranja Caseira', 'caixinha 1L', 9.99, { foto: 'del-valle' }),
  P('ades', 'cha', 'Ades', 'Ades Laranja', 'caixinha 1L', 8.99, { logo: 'ades.svg', fundo: '#FFF4E2' }),

  // água e gelo
  P('agua', 'agua', 'Água mineral', 'Água Mineral sem Gás', '500ml', 2.49, { foto: 'agua' }),
  P('coco', 'agua', 'Coco verde', 'Coco Verde Gelado', 'unidade', 7.9, { foto: 'coco' }),
  P('gelo', 'agua', 'Gelo', 'Gelo em Cubos', 'saco 5kg', 12.9, { foto: 'gelo' }),
];

// sugestões no carrinho ("Leve também")
const extras = ['gelo', 'agua', 'coca-lata'];

const destaques = ['heineken-ln', 'coca-lata', 'brahma-engradado', 'redbull', 'smirnoff', 'schweppes', 'corona', 'matte-15', 'aperol', 'guarana', 'monster', 'gelo'];

// logos da faixa de marcas: [nome, arquivo em img/logos, termo que filtra o catálogo]
const marcas = [
  ['Coca-Cola', 'coca-cola.svg'], ['Heineken', 'heineken.svg'], ['Skol', 'skol.svg'], ['Fanta', 'fanta.svg'], ['Brahma', 'brahma.svg'],
  ['Schweppes', 'schweppes.svg'], ['Sprite', 'sprite.svg'], ['Corona', 'corona.svg'], ['Guaraná Antarctica', 'guarana.svg'], ['Red Bull', 'redbull.svg'],
  ['Monster', 'monster.png'], ['Budweiser', 'budweiser.svg'], ['Stella Artois', 'stella.png'], ['Del Valle', 'del-valle.png'], ['Ades', 'ades.svg'],
  ['Absolut', 'absolut.png'], ['Johnnie Walker', 'johnnie-walker.svg'], ['Tanqueray', 'tanqueray.png'], ['Aperol', 'aperol.svg'], ['Campari', 'campari.svg'],
];

const kits = [
  { id: 'kit-churrasco', nome: 'Kit churrasco', foto: 'cooler', alt: 'Cooler cheio de cervejas no gelo', texto: 'Cerveja gelada, refri para quem não bebe e gelo para o isopor. É só acender a churrasqueira.', itens: [['budweiser-lata', 12], ['coca-lata', 6], ['gelo', 2]] },
  { id: 'kit-esquenta', nome: 'Kit esquenta', foto: 'turma', alt: 'Amigos rindo à mesa com bebidas', texto: 'Vodka, energético e gelo para começar a noite em casa com a turma.', itens: [['smirnoff', 1], ['redbull', 4], ['gelo', 1]] },
  { id: 'kit-gin', nome: 'Kit gin tônica', foto: 'gin', alt: 'Gin tônica sendo servido na taça', texto: 'Gin, tônica e gelo. O limão e a playlist ficam por sua conta.', itens: [['tanqueray', 1], ['schweppes', 6], ['gelo', 1]] },
];

const promessas = [
  ['moto', `Entrega em ${entrega.tempo}`, 'A bebida sai da câmara fria direto para a sua porta.'],
  ['sacola', 'No iFood e no 99Food', 'Prefere aplicativo? Estamos nos dois, com o mesmo estoque.'],
  ['cadeado', 'Site 100% seguro', 'Conexão protegida. Aqui você não digita cartão nem senha.'],
  ['balao', 'Atendimento no WhatsApp', 'Gente de verdade do outro lado, do pedido até a entrega.'],
];

// números da seção "quem somos" [EXEMPLO]
const numeros = [['12', 'anos na Floresta'], ['4,9', 'de nota no Google'], ['38 min', 'de entrega, em média']];

const faq = [
  ['Tem pedido mínimo?', 'Não. A entrega custa R$ 6,90 e sai grátis a partir de R$ 99 em compras. Também dá para retirar no balcão, sem taxa.'],
  ['A bebida chega gelada?', 'Sim. Cervejas, refrigerantes e energéticos saem da câmara fria e vão em bolsa térmica. Se quiser, adicione gelo no carrinho.'],
  ['Como eu pago?', 'Pix, cartão de crédito ou débito na maquininha do entregador, ou dinheiro com troco. Nada é cobrado pelo site.'],
  ['Vocês trocam cascos de cerveja?', 'Trocamos. No engradado retornável, o entregador leva os cascos vazios e você paga só o líquido.'],
  ['Vocês vendem bebida alcoólica para menores?', 'Não. A venda de bebida alcoólica é proibida para menores de 18 anos e o entregador pode pedir documento na entrega.'],
  ['Posso pedir pelo iFood ou pelo 99Food?', 'Pode. Os preços do site e do WhatsApp costumam ser menores que os dos aplicativos, mas o estoque é o mesmo.'],
];

const bairros = ['Floresta', 'Santa Tereza', 'Sagrada Família', 'Centro', 'Santa Efigênia', 'Funcionários', 'Colégio Batista', 'Horto', 'Pompeia', 'Lagoinha']; // [EXEMPLO]

module.exports = { marca, entrega, abertura, horarios, categorias, produtos, extras, destaques, marcas, kits, promessas, numeros, faq, bairros };
