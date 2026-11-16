// Conteúdo do modelo Silver de bebidas e conveniência (Tampinha, marca fictícia). Base: dados do modelo Bronze.
// [EXEMPLO] = trocar pelos dados do cliente. Todos os preços são [EXEMPLO].
//
// Formas de embalagem (desenhadas em arte.js):
//   lata (350ml), latao (473ml), slim (250/269ml), longneck, litrao (1L vidro), pet (2L), petm (1 a 1,5L),
//   agua (500ml), galao (5L), garrafa (destilado), quadrada (whisky/gin), caixinha (1L), saco (gelo/carvão)
// Cores: cor = corpo ou líquido, rot = fundo do rótulo, txt = cor do nome, tampa = tampa.

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
  ifood: 'https://www.ifood.com.br/',
  food99: 'https://99app.com/99food/',
};

// entrega [EXEMPLO]
const entrega = { taxa: 6.9, gratisAcima: 99, tempo: '30 a 45 min' };

// horário de cada dia da semana (0 = domingo), em horas decimais; fecha depois da meia-noite = 25 (1h)
const abertura = [[10, 22], [10, 23], [10, 23], [10, 23], [10, 23], [10, 25], [10, 25]];
const horarios = [['Segunda a quinta', '10h às 23h'], ['Sexta e sábado', '10h à 1h'], ['Domingo e feriado', '10h às 22h']];

const categorias = [
  { id: 'cerveja', nome: 'Cervejas', alc: true, vitrine: ['skol-lata', 'sol-ln', 'heineken-ln'] },
  { id: 'energetico', nome: 'Energéticos', vitrine: ['monster', 'redbull', 'tnt'] },
  { id: 'destilado', nome: 'Destilados', alc: true, vitrine: ['smirnoff', 'red-label', 'tanqueray'] },
  { id: 'cha', nome: 'Chás e sucos', vitrine: ['matte', 'del-valle-uva', 'ades-laranja'] },
  { id: 'drink', nome: 'Drinks', alc: true, vitrine: ['ice', 'beats-gt', 'xeque'] },
  { id: 'agua', nome: 'Água', vitrine: ['crystal', 'crystal-5l', 'crystal-gas'] },
  { id: 'refri', nome: 'Refrigerantes', vitrine: ['coca-2l', 'fanta-lata', 'sprite-lata'] },
];

const P = (id, cat, nome, vol, preco, forma, cor, rot, txt, rotulo, extra = {}) => ({ id, cat, nome, vol, preco, forma, cor, rot, txt, rotulo, ...extra });

const produtos = [
  // refrigerantes
  P('coca-lata', 'refri', 'Coca-Cola', 'lata 350ml', 4.49, 'lata', '#E41E2B', '#E41E2B', '#fff', 'Coca-Cola', { marca: 'Coca-Cola' }),
  P('coca-2l', 'refri', 'Coca-Cola', 'garrafa 2L', 11.99, 'pet', '#3B160A', '#E41E2B', '#fff', 'Coca-Cola', { marca: 'Coca-Cola', tampa: '#E41E2B' }),
  P('coca-zero', 'refri', 'Coca-Cola Sem Açúcar', 'lata 350ml', 4.49, 'lata', '#141414', '#E41E2B', '#fff', 'Coca-Cola', { marca: 'Coca-Cola', sub: 'zero' }),
  P('fanta-lata', 'refri', 'Fanta Laranja', 'lata 350ml', 3.99, 'lata', '#F7851E', '#1F5FAE', '#fff', 'Fanta', { marca: 'Fanta' }),
  P('fanta-uva', 'refri', 'Fanta Uva', 'garrafa 2L', 9.49, 'pet', '#5B1F6E', '#7B2D8E', '#fff', 'Fanta', { marca: 'Fanta', sub: 'uva', tampa: '#7B2D8E' }),
  P('sprite-lata', 'refri', 'Sprite', 'lata 350ml', 3.99, 'lata', '#0E9A48', '#F5D312', '#fff', 'Sprite', { marca: 'Sprite' }),
  P('sprite-2l', 'refri', 'Sprite', 'garrafa 2L', 9.49, 'pet', '#CFEFC8', '#0E9A48', '#fff', 'Sprite', { marca: 'Sprite', tampa: '#0E9A48' }),
  P('schweppes-tonica', 'refri', 'Schweppes Tônica', 'lata 350ml', 4.29, 'lata', '#F4D21F', '#F4D21F', '#2A1A12', 'Schweppes', { marca: 'Schweppes', sub: 'tônica' }),
  P('schweppes-citrus', 'refri', 'Schweppes Citrus', 'lata 350ml', 4.29, 'lata', '#8DC63F', '#F4D21F', '#fff', 'Schweppes', { marca: 'Schweppes', sub: 'citrus' }),
  P('guarana-2l', 'refri', 'Guaraná Antarctica', 'garrafa 2L', 8.99, 'pet', '#4A1A06', '#0B8B3C', '#fff', 'Guaraná', { marca: 'Antarctica', tampa: '#0B8B3C' }),

  // cervejas
  P('skol-lata', 'cerveja', 'Skol Pilsen', 'lata 350ml', 3.29, 'lata', '#FFD200', '#E30613', '#E30613', 'Skol', { marca: 'Skol' }),
  P('skol-latao', 'cerveja', 'Skol Pilsen', 'latão 473ml', 4.49, 'latao', '#FFD200', '#E30613', '#E30613', 'Skol', { marca: 'Skol' }),
  P('skol-litrao', 'cerveja', 'Skol Litrão', 'retornável 1L', 8.49, 'litrao', '#5A3010', '#FFD200', '#E30613', 'Skol', { marca: 'Skol', tampa: '#E30613' }),
  P('sol-ln', 'cerveja', 'Sol Premium', 'long neck 330ml', 5.25, 'longneck', '#E9C44C', '#FFFFFF', '#C8102E', 'Sol', { marca: 'Sol', tampa: '#F2B705', vidro: true }),
  P('sol-lata', 'cerveja', 'Sol Premium', 'lata 350ml', 4.2, 'lata', '#F7E9B5', '#F2B705', '#B5122B', 'Sol', { marca: 'Sol' }),
  P('heineken-ln', 'cerveja', 'Heineken', 'long neck 330ml', 6.49, 'longneck', '#1E6B34', '#FFFFFF', '#1E6B34', 'Heineken', { marca: 'Heineken', tampa: '#1E6B34' }),
  P('brahma-lata', 'cerveja', 'Brahma Duplo Malte', 'lata 350ml', 3.79, 'lata', '#B3121B', '#F2E6C9', '#fff', 'Brahma', { marca: 'Brahma' }),
  P('budweiser-lata', 'cerveja', 'Budweiser', 'lata 350ml', 4.19, 'lata', '#C8102E', '#FFFFFF', '#fff', 'Budweiser', { marca: 'Budweiser' }),
  P('stella-ln', 'cerveja', 'Stella Artois', 'long neck 330ml', 6.29, 'longneck', '#2F5A2A', '#FFFFFF', '#B5122B', 'Stella', { marca: 'Stella Artois', tampa: '#C9A646' }),

  // energéticos
  P('monster', 'energetico', 'Monster Energy', 'latão 473ml', 9.38, 'latao', '#121212', '#121212', '#8DC63F', 'Monster', { marca: 'Monster' }),
  P('monster-ultra', 'energetico', 'Monster Ultra', 'latão 473ml', 9.38, 'latao', '#E9ECEE', '#E9ECEE', '#222', 'Monster', { marca: 'Monster', sub: 'ultra' }),
  P('monster-mango', 'energetico', 'Monster Mango Loco', 'latão 473ml', 9.38, 'latao', '#25A6D9', '#F28C28', '#fff', 'Monster', { marca: 'Monster', sub: 'mango' }),
  P('redbull', 'energetico', 'Red Bull', 'lata 250ml', 8.99, 'slim', '#1B3A8C', '#C9CDD2', '#DB0A40', 'Red Bull', { marca: 'Red Bull' }),
  P('redbull-tropical', 'energetico', 'Red Bull Tropical', 'lata 250ml', 8.99, 'slim', '#F5C31C', '#1B3A8C', '#1B3A8C', 'Red Bull', { marca: 'Red Bull', sub: 'tropical' }),
  P('tnt', 'energetico', 'TNT Energy', 'latão 473ml', 6.99, 'latao', '#1C1C1B', '#F2A900', '#F2A900', 'TNT', { marca: 'TNT' }),

  // destilados
  P('smirnoff', 'destilado', 'Vodka Smirnoff', 'garrafa 998ml', 37.6, 'garrafa', '#E8EEF1', '#C8102E', '#fff', 'Smirnoff', { marca: 'Smirnoff', tampa: '#C8102E', vidro: true }),
  P('absolut', 'destilado', 'Vodka Absolut', 'garrafa 1L', 89.9, 'garrafa', '#E5EDF2', '#E5EDF2', '#1D3B8C', 'Absolut', { marca: 'Absolut', tampa: '#B9C2C9', vidro: true }),
  P('red-label', 'destilado', 'Johnnie Walker Red Label', 'garrafa 1L', 109.0, 'quadrada', '#A3480F', '#C8102E', '#F2E6C9', 'Red Label', { marca: 'Johnnie Walker', tampa: '#C8102E' }),
  P('tanqueray', 'destilado', 'Gin Tanqueray', 'garrafa 750ml', 114.9, 'quadrada', '#1F6B4A', '#C8102E', '#fff', 'Tanqueray', { marca: 'Tanqueray', tampa: '#C8102E' }),
  P('cuervo', 'destilado', 'Tequila José Cuervo', 'garrafa 750ml', 109.9, 'garrafa', '#D9A441', '#F2E6C9', '#2A1A12', 'Cuervo', { marca: 'José Cuervo', tampa: '#2A1A12' }),
  P('aperol', 'destilado', 'Aperol', 'garrafa 750ml', 52.5, 'garrafa', '#F26A1B', '#FFFFFF', '#E1251B', 'Aperol', { marca: 'Aperol', tampa: '#E1251B' }),
  P('campari', 'destilado', 'Campari', 'garrafa 900ml', 56.9, 'garrafa', '#C4121A', '#F2E6C9', '#C4121A', 'Campari', { marca: 'Campari', tampa: '#2A1A12' }),
  P('ypioca', 'destilado', 'Cachaça Ypióca Ouro', 'garrafa 965ml', 29.9, 'garrafa', '#C98A2B', '#F2E6C9', '#2A1A12', 'Ypióca', { marca: 'Ypióca', tampa: '#C9A646' }),

  // chás e sucos
  P('matte', 'cha', 'Matte Leão Natural', 'garrafa 1,5L', 7.99, 'petm', '#B5651D', '#FFD100', '#2A1A12', 'Leão', { marca: 'Leão', tampa: '#FFD100' }),
  P('matte-limao', 'cha', 'Matte Leão Limão', 'garrafa 1,5L', 7.99, 'petm', '#C9852A', '#8DC63F', '#fff', 'Leão', { marca: 'Leão', sub: 'limão', tampa: '#8DC63F' }),
  P('fuze', 'cha', 'Fuze Tea Pêssego', 'garrafa 1L', 7.49, 'petm', '#E39A3B', '#1A1A1A', '#F7A35C', 'Fuze', { marca: 'Fuze', tampa: '#1A1A1A' }),
  P('del-valle-uva', 'cha', 'Del Valle Uva', 'caixinha 1L', 9.99, 'caixinha', '#6A1E5A', '#F2E6C9', '#fff', 'Del Valle', { marca: 'Del Valle' }),
  P('del-valle-pessego', 'cha', 'Del Valle Pêssego', 'caixinha 1L', 9.99, 'caixinha', '#F28C28', '#F2E6C9', '#fff', 'Del Valle', { marca: 'Del Valle' }),
  P('ades-laranja', 'cha', 'Ades Laranja', 'caixinha 1L', 8.99, 'caixinha', '#F7941D', '#FFFFFF', '#fff', 'Ades', { marca: 'Ades' }),
  P('ades-original', 'cha', 'Ades Original', 'caixinha 1L', 8.99, 'caixinha', '#F4F1EA', '#1C64AE', '#1C64AE', 'Ades', { marca: 'Ades' }),

  // drinks prontos
  P('ice', 'drink', 'Smirnoff Ice', 'long neck 275ml', 7.49, 'longneck', '#DDE6EA', '#C8102E', '#fff', 'Ice', { marca: 'Smirnoff', tampa: '#B9C2C9', vidro: true }),
  P('beats-gt', 'drink', 'Beats GT', 'lata 269ml', 5.99, 'slim', '#0F6F3B', '#F2E6C9', '#fff', 'Beats', { marca: 'Skol', sub: 'gt' }),
  P('beats-senses', 'drink', 'Beats Senses', 'lata 269ml', 5.99, 'slim', '#6B2C91', '#F2E6C9', '#fff', 'Beats', { marca: 'Skol', sub: 'senses' }),
  P('xeque', 'drink', 'Xeque Mate', 'lata 355ml', 7.9, 'lata', '#C9D63A', '#2A1A12', '#2A1A12', 'Xeque Mate', { marca: 'Xeque Mate' }),
  P('gordons', 'drink', "Gordon's e Tônica", 'lata 269ml', 8.49, 'slim', '#E8EDE6', '#B4122C', '#B4122C', "Gordon's", { marca: "Gordon's" }),

  // água
  P('crystal', 'agua', 'Água Crystal sem gás', 'garrafa 500ml', 2.49, 'agua', '#D9EEF7', '#1C64AE', '#fff', 'Crystal', { marca: 'Crystal', tampa: '#1C64AE' }),
  P('crystal-gas', 'agua', 'Água Crystal com gás', 'garrafa 500ml', 2.99, 'agua', '#D9EEF7', '#0A8B5A', '#fff', 'Crystal', { marca: 'Crystal', sub: 'com gás', tampa: '#0A8B5A' }),
  P('crystal-15', 'agua', 'Água Crystal sem gás', 'garrafa 1,5L', 4.49, 'petm', '#D9EEF7', '#1C64AE', '#fff', 'Crystal', { marca: 'Crystal', tampa: '#1C64AE' }),
  P('crystal-5l', 'agua', 'Água Crystal', 'galão 5L', 8.9, 'galao', '#D9EEF7', '#1C64AE', '#fff', 'Crystal', { marca: 'Crystal', tampa: '#1C64AE' }),
  P('kero-coco', 'agua', 'Água de coco Kero Coco', 'caixinha 1L', 12.99, 'caixinha', '#FFFFFF', '#2E8B3D', '#2E8B3D', 'Kero Coco', { marca: 'Kero Coco' }),
];

// conveniência que aparece no carrinho ("Leve também")
const extras = [
  P('gelo', 'extra', 'Gelo em cubos', 'saco 5kg', 12.9, 'saco', '#DCEFF8', '#1C64AE', '#fff', 'Gelo'),
  P('copo', 'extra', 'Copo descartável 300ml', 'pacote 50un', 7.9, 'saco', '#F4F1EA', '#2A1A12', '#fff', 'Copos'),
  P('carvao', 'extra', 'Carvão vegetal', 'saco 3kg', 19.9, 'saco', '#2A1A12', '#D7261E', '#fff', 'Carvão'),
];

const destaques = ['skol-lata', 'coca-2l', 'monster', 'sol-ln', 'smirnoff', 'heineken-ln', 'schweppes-tonica', 'matte', 'redbull', 'crystal', 'red-label', 'fanta-lata'];

// cada marca leva ao catálogo filtrado; cores só para o bloco da marca no carrossel
const marcas = [
  ['Coca-Cola', '#E41E2B', '#fff'], ['Skol', '#FFD200', '#E30613'], ['Fanta', '#F7851E', '#fff'], ['Sol', '#F7E9B5', '#B5122B'],
  ['Schweppes', '#F4D21F', '#2A1A12'], ['Sprite', '#0E9A48', '#fff'], ['Heineken', '#1E6B34', '#fff'], ['Del Valle', '#6A1E5A', '#fff'],
  ['Ades', '#F7941D', '#fff'], ['Monster', '#121212', '#8DC63F'], ['Red Bull', '#1B3A8C', '#fff'], ['Crystal', '#1C64AE', '#fff'],
  ['Smirnoff', '#C8102E', '#fff'], ['Leão', '#FFD100', '#2A1A12'], ['Brahma', '#B3121B', '#fff'], ['Tanqueray', '#1F6B4A', '#fff'],
];

const kits = [
  { id: 'kit-churrasco', nome: 'Kit churrasco', texto: 'O básico do domingo: cerveja gelada, refri para quem não bebe e gelo para o isopor.', itens: [['skol-lata', 12], ['coca-2l', 2], ['gelo', 1], ['carvao', 1]], arte: ['skol-lata', 'coca-2l', 'skol-lata'] },
  { id: 'kit-esquenta', nome: 'Kit esquenta', texto: 'Vodka, energético e gelo para começar a noite em casa.', itens: [['smirnoff', 1], ['redbull', 4], ['gelo', 1]], arte: ['redbull', 'smirnoff', 'redbull'] },
  { id: 'kit-gin', nome: 'Kit gin tônica', texto: 'Gin, tônica e gelo. O limão fica por sua conta.', itens: [['tanqueray', 1], ['schweppes-tonica', 6], ['gelo', 1]], arte: ['schweppes-tonica', 'tanqueray', 'schweppes-tonica'] },
];

const promessas = [
  ['moto', 'Entrega em ' + '30 a 45 min', 'Bebida saindo da câmara fria direto para a sua porta.'],
  ['sacola', 'No iFood e no 99Food', 'Prefere aplicativo? Estamos nos dois, com o mesmo estoque.'],
  ['cadeado', 'Site 100% seguro', 'Conexão protegida. Aqui você não digita cartão nem senha.'],
  ['balao', 'Atendimento no WhatsApp', 'Gente de verdade do outro lado, do pedido até a entrega.'],
];

const faq = [
  ['Tem pedido mínimo?', 'Não. A entrega custa R$ 6,90 e sai grátis a partir de R$ 99 em compras. Também dá para retirar no balcão, sem taxa.'],
  ['A bebida chega gelada?', 'Sim. Cervejas, refrigerantes e energéticos saem da câmara fria e vão em bolsa térmica. Se quiser, adicione gelo no carrinho.'],
  ['Como eu pago?', 'Pix, cartão de crédito ou débito na maquininha do entregador, ou dinheiro com troco. Nada é cobrado pelo site.'],
  ['Vocês vendem bebida alcoólica para menores?', 'Não. A venda de bebida alcoólica é proibida para menores de 18 anos e o entregador pode pedir documento na entrega.'],
  ['Posso pedir pelo iFood ou pelo 99Food?', 'Pode. Os preços do site e do WhatsApp costumam ser menores que os dos aplicativos, mas o estoque é o mesmo.'],
];

const bairros = ['Floresta', 'Santa Tereza', 'Sagrada Família', 'Centro', 'Santa Efigênia', 'Funcionários', 'Colégio Batista', 'Horto', 'Pompeia', 'Lagoinha']; // [EXEMPLO]

// capa: cada slide põe uma bebida no palco; tom = fundo do palco (versão bem escura da cor da marca)
const capa = [
  { id: 'coca-lata', tom: '#3B0A0D', luz: '#E41E2B', titulo: 'Coca trincando de gelada', texto: 'Lata, garrafa de 2 litros ou sem açúcar. Sai da câmara fria e chega suando na sua mão.', lado: ['coca-2l', 'coca-zero'] },
  { id: 'sol-ln', tom: '#3A2A08', luz: '#F2B705', titulo: 'Sol de fim de tarde', texto: 'Long neck estupidamente gelada para o happy hour em casa. Põe o limão e pronto.', lado: ['heineken-ln', 'stella-ln'] },
  { id: 'schweppes-tonica', tom: '#2F2A07', luz: '#F4D21F', titulo: 'A tônica do seu gin', texto: 'Schweppes Tônica e Citrus para o drink da noite, com gelo em cubo direto do freezer.', lado: ['schweppes-citrus', 'tanqueray'] },
  { id: 'skol-latao', tom: '#3A0809', luz: '#FFD200', titulo: 'Latão redondo pro churrasco', texto: 'Skol em lata, latão e litrão. Monte o engradado e a gente leva o gelo junto.', lado: ['skol-lata', 'skol-litrao'] },
  { id: 'sprite-lata', tom: '#06301A', luz: '#0E9A48', titulo: 'Refresco de limão na hora', texto: 'Sprite, Fanta e Guaraná geladinhos para acompanhar o lanche da família.', lado: ['fanta-lata', 'guarana-2l'] },
  { id: 'del-valle-uva', tom: '#2A0B25', luz: '#9B3A86', titulo: 'Suco e chá para o dia', texto: 'Del Valle, Ades e Matte Leão para a lancheira, o almoço e a tarde toda.', lado: ['ades-laranja', 'matte'] },
];

// como o pedido chega no WhatsApp (sem números: a ordem aparece no desenho da linha)
const passos = [
  ['copo', 'Escolha as bebidas', 'Navegue por categoria ou marca e toque na tampinha para pôr no carrinho.'],
  ['engradado', 'Confira o carrinho', 'Ajuste as quantidades, junte gelo e copos, escolha entrega ou retirada.'],
  ['whats', 'Envie no WhatsApp', 'O pedido já vai organizado por categoria, com total e forma de pagamento.'],
  ['moto', 'Receba gelado', 'Confirmamos na hora e a bebida sai da câmara fria para a sua porta.'],
];

module.exports = { capa, passos, marca, entrega, abertura, horarios, categorias, produtos, extras, destaques, marcas, kits, promessas, faq, bairros };
