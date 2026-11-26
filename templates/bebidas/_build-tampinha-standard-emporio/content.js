// Conteúdo do Tampinha Standard Empório (loja fictícia de bebidas e conveniência que revende marcas reais).
// Mesma empresa e mesmos serviços do Tampinha Standard, com outro desenho: empório de bairro, gôndola e etiqueta de preço.
// [EXEMPLO] = trocar pelos dados do cliente. Todos os preços, pessoas, notas e depoimentos são fictícios.
//
// Imagens (ver build.js):
//   produto: recorte do Tampinha Standard Palco (_build-tampinha-standard-palco/img/fotos/produtos/<id>.webp)
//   drink:   foto do Palco (ambiente/<id>.webp)
//   ambiente com prefixo "ts:": foto do Tampinha Standard (_build-tampinha-standard/img/fotos/<nome>.webp)
//   sem prefixo: foto própria deste modelo (img/fotos/<nome>.webp, baixada por preparar-imagens.js)

const marca = {
  nome: 'Tampinha',
  completo: 'Tampinha Bebidas & Conveniência',
  razao: 'Tampinha Comércio de Bebidas Ltda.', // [EXEMPLO] fictícia
  cnpj: '00.000.000/0001-00', // [EXEMPLO] fictício
  frase: 'O empório de bebidas da Floresta: gelada no balcão, na sua porta ou na sua festa.',
  whatsapp: '5531999990000', // [EXEMPLO]
  whatsappTexto: '(31) 99999-0000', // [EXEMPLO]
  telefone: '(31) 3333-0000', // [EXEMPLO]
  email: 'pedidos@tampinhabebidas.com.br', // [EXEMPLO]
  endereco: 'Rua Pouso Alegre, 1200', // [EXEMPLO]
  bairro: 'Floresta',
  cidade: 'Belo Horizonte',
  uf: 'MG',
  cep: '31015-000', // [EXEMPLO]
  coordenadas: [-19.9138, -43.9301],
  desde: 2014, // [EXEMPLO]
  atendente: 'Toninho', // [EXEMPLO] quem responde o WhatsApp
  instagram: 'tampinhabebidas',
  facebook: 'https://facebook.com/',
  ifood: 'https://www.ifood.com.br/', // [EXEMPLO] link da loja no iFood
  food99: 'https://99app.com/99food/', // [EXEMPLO] link da loja no 99Food
  nota: 4.9, // [EXEMPLO]
  avaliacoes: 1284, // [EXEMPLO]
};

// entrega [EXEMPLO]
const entrega = { taxa: 6.9, gratisAcima: 99, tempo: '30 a 45 min' };

// horário de cada dia da semana (0 = domingo), em horas decimais; fecha depois da meia-noite = 25 (1h)
const abertura = [[10, 22], [10, 23], [10, 23], [10, 23], [10, 23], [10, 25], [10, 25]];
const horarios = [['Segunda a quinta', '10h às 23h'], ['Sexta e sábado', '10h à 1h'], ['Domingo e feriado', '10h às 22h']];

// corredores do empório (as mesmas categorias do Tampinha Standard)
const categorias = [
  { id: 'cerveja', nome: 'Cervejas', alc: true, vitrine: ['heineken-ln', 'budweiser-ln', 'sol-ln'] },
  { id: 'refri', nome: 'Refrigerantes', vitrine: ['guarana-lata', 'coca-vidro', 'fanta-lata'] },
  { id: 'energetico', nome: 'Energéticos', vitrine: ['monster-zero', 'monster', 'redbull'] },
  { id: 'destilado', nome: 'Destilados e vinhos', curto: 'Destilados', alc: true, vitrine: ['smirnoff', 'tanqueray', 'vinho-miolo'] },
  { id: 'drink', nome: 'Drinks', alc: true, foto: 'drink-gin-frutas' },
  { id: 'cha', nome: 'Chás e sucos', vitrine: ['ades-laranja', 'matte', 'del-valle-uva'] },
  { id: 'agua', nome: 'Água e gelo', vitrine: ['crystal', 'galao-hydrate', 'gelo'] },
];

// de = preço antigo (entra nas ofertas do dia); alc: false tira o +18 de um item de categoria alcoólica
const P = (id, cat, nome, vol, preco, marcaP, extra = {}) => ({ id, cat, nome, vol, preco, marca: marcaP, ...extra });

const produtos = [
  // cervejas
  P('heineken-ln', 'cerveja', 'Heineken', 'long neck 330ml', 6.49, 'Heineken', { de: 7.29 }),
  P('heineken-lata', 'cerveja', 'Heineken', 'lata 350ml', 5.49, 'Heineken'),
  P('heineken-zero', 'cerveja', 'Heineken 0.0 sem álcool', 'long neck 330ml', 6.49, 'Heineken', { alc: false }),
  P('budweiser-ln', 'cerveja', 'Budweiser', 'long neck 330ml', 5.99, 'Budweiser'),
  P('budweiser-lata', 'cerveja', 'Budweiser', 'lata 350ml', 4.49, 'Budweiser', { de: 4.99 }),
  P('sol-ln', 'cerveja', 'Sol Premium', 'long neck 330ml', 5.25, 'Sol'),
  P('skol-lata', 'cerveja', 'Skol Pilsen', 'lata 350ml', 3.29, 'Skol', { de: 3.79 }),
  P('brahma-lata', 'cerveja', 'Brahma Chopp', 'lata 350ml', 3.79, 'Brahma'),
  P('spaten-lata', 'cerveja', 'Spaten Munich', 'latão 473ml', 5.99, 'Spaten'),
  P('original-lata', 'cerveja', 'Antarctica Original', 'lata 350ml', 4.29, 'Original'),
  P('amstel-lata', 'cerveja', 'Amstel Lager', 'lata 269ml', 3.49, 'Amstel'),
  // refrigerantes
  P('coca-vidro', 'refri', 'Coca-Cola Original', 'garrafa de vidro 290ml', 3.99, 'Coca-Cola'),
  P('coca-2l', 'refri', 'Coca-Cola Original', 'garrafa 2L', 11.99, 'Coca-Cola', { de: 13.49 }),
  P('coca-zero-lata', 'refri', 'Coca-Cola Zero Açúcar', 'lata 350ml', 4.49, 'Coca-Cola'),
  P('guarana-lata', 'refri', 'Guaraná Antarctica', 'lata 350ml', 3.99, 'Guaraná Antarctica'),
  P('fanta-lata', 'refri', 'Fanta Laranja', 'lata 350ml', 3.99, 'Fanta'),
  P('sprite-2l', 'refri', 'Sprite', 'garrafa 2L', 9.49, 'Sprite'),
  P('schweppes-lata', 'refri', 'Água Tônica Schweppes', 'lata 350ml', 4.29, 'Schweppes'),
  // energéticos
  P('monster', 'energetico', 'Monster Energy', 'lata 473ml', 9.38, 'Monster', { de: 10.99 }),
  P('monster-zero', 'energetico', 'Monster Absolutely Zero', 'lata 473ml', 9.38, 'Monster'),
  P('monster-violet', 'energetico', 'Monster Ultra Violet', 'lata 473ml', 9.38, 'Monster'),
  P('redbull', 'energetico', 'Red Bull Energy Drink', 'lata 250ml', 8.99, 'Red Bull'),
  // destilados e vinhos
  P('smirnoff', 'destilado', 'Vodka Smirnoff', 'garrafa 998ml', 37.6, 'Smirnoff', { de: 42.9 }),
  P('absolut', 'destilado', 'Vodka Absolut', 'garrafa 1L', 89.9, 'Absolut'),
  P('red-label', 'destilado', 'Johnnie Walker Red Label', 'garrafa 1L', 109.0, 'Johnnie Walker'),
  P('tanqueray', 'destilado', 'Gin Tanqueray London Dry', 'garrafa 750ml', 114.9, 'Tanqueray', { de: 129.9 }),
  P('vinho-miolo', 'destilado', 'Miolo Seleção Cabernet e Merlot', 'garrafa 750ml', 59.9, 'Miolo'),
  P('vinho-pergola', 'destilado', 'Pérgola Tinto Suave', 'garrafa 750ml', 29.9, 'Pérgola'),
  // drinks da casa (foto inteira, não recorte)
  P('drink-gin-frutas', 'drink', 'Gin tônica de frutas vermelhas', 'copo 400ml', 26.9, 'Drink da casa', { amb: true }),
  P('drink-spritz-morango', 'drink', 'Spritz de morango', 'taça 350ml', 22.9, 'Drink da casa', { amb: true }),
  P('drink-maracuja', 'drink', 'Batida de maracujá', 'taça 350ml', 19.9, 'Drink da casa', { amb: true }),
  P('drink-soda-frutas', 'drink', 'Soda italiana de frutas vermelhas', 'copo 400ml', 14.9, 'Sem álcool', { amb: true, alc: false }),
  // chás e sucos
  P('matte', 'cha', 'Matte Leão Natural', 'garrafa 1,5L', 7.99, 'Leão'),
  P('del-valle-uva', 'cha', 'Del Valle Uva', 'caixa 1L', 9.99, 'Del Valle'),
  P('ades-laranja', 'cha', 'Ades Soja e Laranja', 'caixa 1L', 8.99, 'Ades'),
  // água e gelo
  P('crystal', 'agua', 'Água Crystal sem gás', 'garrafa 500ml', 2.49, 'Crystal'),
  P('galao-hydrate', 'agua', 'Água mineral Hydrate', 'galão 5L', 8.9, 'Hydrate'),
  P('gelo', 'agua', 'Gelo em cubos', 'saco 5kg', 12.9, 'Gelo'),
];

// conveniência que aparece no carrinho ("Leve também"); gelo também está no corredor de água
const extras = [
  P('copo', 'extra', 'Copo descartável 300ml', 'pacote 50un', 7.9, 'Copobras'),
  P('carvao', 'extra', 'Carvão vegetal', 'saco 3kg', 19.9, 'Carvão'),
];
const leveTambem = ['gelo', 'copo', 'carvao'];

// a vitrine "Tudo" começa por estes, na ordem
const vitrineInicial = ['heineken-ln', 'coca-vidro', 'monster', 'skol-lata', 'guarana-lata', 'smirnoff', 'drink-gin-frutas', 'budweiser-ln', 'matte', 'redbull', 'tanqueray', 'gelo'];

// logos da faixa de marcas: [nome que filtra o catálogo, arquivo em _build-tampinha-standard/img/logos]
const marcas = [
  ['Coca-Cola', 'coca-cola.svg'], ['Heineken', 'heineken.svg'], ['Skol', 'skol.svg'], ['Fanta', 'fanta.svg'], ['Brahma', 'brahma.svg'],
  ['Schweppes', 'schweppes.svg'], ['Sprite', 'sprite.svg'], ['Guaraná', 'guarana.svg'], ['Red Bull', 'redbull.svg'], ['Monster', 'monster.png'],
  ['Budweiser', 'budweiser.svg'], ['Del Valle', 'del-valle.png'], ['Ades', 'ades.svg'], ['Absolut', 'absolut.png'], ['Johnnie Walker', 'johnnie-walker.svg'], ['Tanqueray', 'tanqueray.png'],
];

const kits = [
  { id: 'kit-churrasco', nome: 'Kit churrasco', foto: 'churrasco-amigos', alt: 'Amigos rindo e brindando com cerveja na churrasqueira', texto: 'Cerveja gelada, refri para quem não bebe, gelo para o isopor e o carvão. É só acender.', itens: [['skol-lata', 12], ['coca-2l', 2], ['gelo', 1], ['carvao', 1]] },
  { id: 'kit-esquenta', nome: 'Kit esquenta', foto: 'ts:turma', alt: 'Amigos rindo à mesa com bebidas', texto: 'Vodka, energético e gelo para começar a noite em casa com a turma.', itens: [['smirnoff', 1], ['redbull', 4], ['gelo', 1]] },
  { id: 'kit-gin', nome: 'Kit gin tônica', foto: 'gin-tonica', alt: 'Taça de gin tônica com pepino e limão no balcão', texto: 'Gin, tônica e gelo. O limão e a playlist ficam por sua conta.', itens: [['tanqueray', 1], ['schweppes-lata', 6], ['gelo', 1]] },
];

// capa: carrossel de cartazes do empório
const capa = [
  { foto: 'ts:capa', alt: 'Amigos brindando com cerveja num bar', apoio: 'Empório de bebidas na Floresta, BH', titulo: 'Gelada de verdade, do nosso balcão para a sua porta.', texto: 'Cerveja, refri, energético, destilado e gelo com preço de empório. Monte o carrinho e o pedido chega pronto no nosso WhatsApp.', etiqueta: ['entrega grátis', `acima de R$ ${entrega.gratisAcima}`], btn: ['Montar meu pedido', '#catalogo'] },
  { foto: 'chopp-torneira', alt: 'Chopp sendo tirado na torneira da chopeira', apoio: 'Chopp na festa', titulo: 'A chopeira vai até você, gelada e instalada.', texto: 'Barril, chopeira, cilindro e um chopeiro para tirar o primeiro copo. A gente busca tudo no dia seguinte.', etiqueta: ['barril 30L', 'a partir de R$ 690'], btn: ['Ver os serviços', '#servicos'] },
  { foto: 'churrasco-brinde', alt: 'Dois amigos brindando com cerveja ao lado da churrasqueira', apoio: 'Kits prontos', titulo: 'O churrasco de domingo cabe num toque.', texto: 'Doze latas, refri, gelo e carvão no mesmo pedido. Muda as quantidades no carrinho se quiser.', etiqueta: ['kit churrasco', 'tudo junto'], btn: ['Ver os kits', '#kits'] },
];

const promessas = [
  ['moto', `Entrega em ${entrega.tempo}`, 'Da câmara fria para a sua porta, em bolsa térmica.'],
  ['sacola', 'No iFood e no 99Food', 'O mesmo estoque nos dois aplicativos.'],
  ['cadeado', 'Site 100% seguro', 'Você não digita cartão nem senha aqui.'],
  ['balao', 'Atendimento no WhatsApp', 'Gente de verdade, do pedido à entrega.'],
];

// números de "quem somos" [EXEMPLO]
const numeros = [['12', 'anos na Floresta'], ['4,9', 'de nota no Google'], ['38 min', 'de entrega, em média']];

// ---------- serviços (festa, entrega com hora marcada, empresas) ----------
const segmentos = [
  { id: 'festas', nome: 'Festas e eventos', texto: 'Chopp, bartender e bar de drinks para aniversário, casamento e confraternização.' },
  { id: 'entrega', nome: 'Entrega e retirada', texto: 'Pedido com dia e hora marcados, gelado e conferido.' },
  { id: 'empresas', nome: 'Empresas e degustação', texto: 'Geladeira do escritório sempre cheia e degustação guiada de cervejas.' },
];

// min = duração em minutos; unidade = como o preço é cobrado; prof = quem atende; sensivel = exige maioridade e documento
// pessoas = [mínimo, máximo] quando o preço é por pessoa; antecedencia = dias mínimos para agendar
const servicos = [
  { id: 'chopp', seg: 'festas', nome: 'Chopp na festa', foto: 'chopeira-festa', alt: 'Torneiras de chopeira numa festa ao ar livre', inclui: 'Barril de 30L ou 50L (Brahma ou Heineken), chopeira elétrica, cilindro de CO2, instalação, o primeiro copo tirado pelo chopeiro e o recolhimento no dia seguinte.', min: 480, preco: 690, de: true, unidade: 'por barril de 30L', prof: ['leo', 'toninho'], sensivel: true, sinal: true, antecedencia: 3, turnos: 'evento' },
  { id: 'open-bar', seg: 'festas', nome: 'Open bar com bartender', foto: 'open-bar', alt: 'Bartender preparando drinks para um grupo de amigas', inclui: 'Bartender, gin tônica, caipirinha, moscow mule e spritz, insumos, gelo, copos de acrílico e montagem do balcão.', min: 240, preco: 45, de: true, unidade: 'por pessoa', pessoas: [20, 200], prof: ['caio'], sensivel: true, sinal: true, antecedencia: 7, turnos: 'evento' },
  { id: 'drinks-zero', seg: 'festas', nome: 'Bar de drinks sem álcool', foto: 'ts:gin', alt: 'Drink sendo servido na taça com gelo', inclui: 'Soda italiana, limonada suíça, mocktails de frutas e chá gelado da casa. Ideal para festa infantil e chá de bebê.', min: 180, preco: 28, de: true, unidade: 'por pessoa', pessoas: [15, 150], prof: ['caio', 'bia'], sinal: true, antecedencia: 5, turnos: 'evento' },
  { id: 'entrega-agendada', seg: 'entrega', nome: 'Entrega com hora marcada', foto: 'ts:moto', alt: 'Entregador de moto com a caixa de entregas', inclui: 'Você escolhe o dia e uma janela de 30 minutos. A bebida sai da câmara fria na hora e chega em bolsa térmica, com gelo se quiser.', min: 30, preco: 6.9, unidade: 'taxa, grátis acima de R$ 99', prof: ['dudu'], antecedencia: 0, turnos: 'loja' },
  { id: 'retirada', seg: 'entrega', nome: 'Retirada no balcão', foto: 'balcao-avental', alt: 'Atendente de avental atrás do balcão', inclui: 'Separamos o pedido, deixamos na câmara fria e você só passa e leva. Sem fila e sem taxa.', min: 15, preco: 0, unidade: 'sem custo', prof: ['toninho', 'bia'], antecedencia: 0, turnos: 'loja' },
  { id: 'geladeira-empresa', seg: 'empresas', nome: 'Geladeira da empresa', foto: 'geladeira', alt: 'Geladeira cheia de latas e garrafas', inclui: 'Visita semanal para repor água, refri, chá e energético na geladeira do escritório. Nota fiscal mensal e lista que muda com o gosto da equipe.', min: 30, preco: 250, de: true, unidade: 'por semana', prof: ['marta', 'dudu'], antecedencia: 2, turnos: 'comercial' },
  { id: 'degustacao', seg: 'empresas', nome: 'Degustação de cervejas', foto: 'chopp-caneca', alt: 'Chopp sendo tirado na caneca de vidro', inclui: 'Seis rótulos de estilos diferentes, petiscos, ficha de prova e a conversa com quem entende. No empório ou na sua empresa.', min: 90, preco: 69, unidade: 'por pessoa', pessoas: [6, 30], prof: ['leo'], sensivel: true, antecedencia: 2, turnos: 'noite' },
];

const pagamento = 'Pix, cartão de crédito e débito na maquininha ou dinheiro com troco. Festas e eventos: sinal de 30% por Pix para reservar a data e o restante no dia. Empresas: boleto mensal com nota fiscal.';
const aPartir = '"A partir de" é o preço do menor pacote. O valor final depende do número de pessoas, do barril escolhido e da distância.';
const cancelamento = 'Entrega e retirada com hora marcada: cancele ou mude o horário sem custo até 1 hora antes. Festas e eventos: remarcação grátis até 7 dias antes; o sinal volta inteiro até 7 dias antes e vira crédito depois disso.';

// ---------- equipe [EXEMPLO] (fotos do Pexels, pessoas fictícias) ----------
// dias: 0 = domingo; turno de cada dia em que trabalha
const equipe = [
  { id: 'marta', nome: 'Marta Siqueira', cargo: 'Dona e gerente', foto: 'marta', esp: 'Vinhos, compras e atendimento a empresas', anos: 12, bio: 'Abriu a Tampinha numa portinha da Pouso Alegre em 2014. Escolhe tudo o que entra na câmara fria e cuida pessoalmente dos clientes que são empresas.', dias: { 1: '9h às 17h', 2: '9h às 17h', 3: '9h às 17h', 4: '9h às 17h', 5: '9h às 17h' } },
  { id: 'toninho', nome: 'Toninho Ribeiro', cargo: 'Balcão e WhatsApp', foto: 'toninho', esp: 'Montar pedido de festa e não esquecer o gelo', anos: 20, bio: 'É quem responde o WhatsApp. Confere cada pedido, separa da câmara fria e sabe de cabeça quanto de cerveja cabe num churrasco de 30 pessoas.', dias: { 2: '14h às 23h', 3: '14h às 23h', 4: '14h às 23h', 5: '16h à 1h', 6: '16h à 1h', 0: '10h às 18h' } },
  { id: 'bia', nome: 'Bia Carvalho', cargo: 'Caixa e retirada', foto: 'bia', esp: 'Retirada rápida e bar sem álcool', anos: 4, bio: 'Deixa o pedido de retirada separado e gelado antes de você chegar. Nos eventos, cuida do bar de drinks sem álcool.', dias: { 1: '10h às 18h', 2: '10h às 18h', 3: '10h às 18h', 6: '10h às 18h', 0: '10h às 18h' } },
  { id: 'leo', nome: 'Léo Martins', cargo: 'Chopeiro e cervejas', foto: 'leo', esp: 'Chopp, cervejas especiais e degustação', anos: 7, bio: 'Instala a chopeira, tira o primeiro copo com colarinho certo e conduz a degustação de cervejas. Também indica rótulo para presente.', dias: { 3: '16h às 23h', 4: '16h às 23h', 5: 'eventos', 6: 'eventos', 0: 'eventos' } },
  { id: 'caio', nome: 'Caio Andrade', cargo: 'Bartender de eventos', foto: 'caio', esp: 'Gin tônica, caipirinha e drinks autorais', anos: 9, bio: 'Monta o balcão do open bar, prepara os drinks da casa vendidos no site e cria a carta de cada evento junto com quem contrata.', dias: { 4: '18h às 23h', 5: 'eventos', 6: 'eventos', 0: 'eventos' } },
  { id: 'dudu', nome: 'Dudu Alves', cargo: 'Entregas', foto: 'dudu', esp: 'Entrega com hora marcada e reposição em empresas', anos: 5, bio: 'Conhece cada rua da Floresta e da Santa Tereza. Leva a bebida em bolsa térmica e repõe a geladeira das empresas toda semana.', dias: { 1: '10h às 19h', 2: '10h às 19h', 4: '16h às 23h', 5: '16h à 1h', 6: '16h à 1h' } },
];

// ---------- galeria por categoria ----------
const galeriaCats = [['loja', 'Empório'], ['festas', 'Festas'], ['drinks', 'Drinks'], ['cervejas', 'Cervejas'], ['entregas', 'Entregas']];
const galeria = [
  { foto: 'prateleira', cat: 'loja', leg: 'A parede dos destilados' },
  { foto: 'chopeira-festa', cat: 'festas', leg: 'Chopeira montada num aniversário ao ar livre' },
  { foto: 'gin-tonica', cat: 'drinks', leg: 'Gin tônica com pepino, do bar de eventos' },
  { foto: 'chopp-copo', cat: 'cervejas', leg: 'Torneiras prontas para a degustação' },
  { foto: 'ts:moto', cat: 'entregas', leg: 'Saindo para a entrega da noite' },
  { foto: 'geladeira', cat: 'loja', leg: 'A geladeira das latas trincando' },
  { foto: 'open-bar', cat: 'festas', leg: 'Open bar num aniversário de 30 anos' },
  { foto: 'balde-gelo', cat: 'cervejas', leg: 'Balde gelado para o fim de semana' },
  { foto: 'gin-limao', cat: 'drinks', leg: 'O clássico com limão' },
  { foto: 'ts:entrega', cat: 'entregas', leg: 'Pedido entregue no balcão' },
  { foto: 'churrasco-brinde', cat: 'festas', leg: 'Kit churrasco chegando na hora certa' },
  { foto: 'balcao-avental', cat: 'loja', leg: 'O balcão pronto para abrir' },
  { foto: 'chopp-caneca', cat: 'cervejas', leg: 'Colarinho de dois dedos' },
  { foto: 'latas-engradado', cat: 'loja', leg: 'Latas recém-chegadas para a câmara fria' },
  { foto: 'ts:latas-gelo', cat: 'entregas', leg: 'Latas no gelo antes de sair' },
];

// ---------- depoimentos [EXEMPLO] ----------
const depoimentos = [
  { nome: 'Juliana Prado', quando: 'há 2 semanas', texto: 'Pedi às 21h de sábado e às 21h40 a cerveja estava aqui, trincando. O Toninho ainda lembrou do gelo que eu tinha esquecido.' },
  { nome: 'Marcos Vieira', quando: 'há 1 mês', texto: 'Contratei a chopeira para o aniversário do meu pai. Chegou instalada, o Léo tirou o primeiro copo e buscaram tudo no dia seguinte.' },
  { nome: 'Ana Luiza Rocha', quando: 'há 3 semanas', texto: 'O open bar do Caio salvou a festa. Gin tônica boa do começo ao fim e o balcão ficou lindo nas fotos.' },
  { nome: 'Rafael Costa', quando: 'há 2 meses', texto: 'A geladeira do escritório nunca mais ficou vazia. A Marta manda a nota no fim do mês e pronto.' },
  { nome: 'Patrícia Mendes', quando: 'há 5 dias', texto: 'Preço de empório mesmo. Comparei com o aplicativo e pelo WhatsApp saiu mais barato, com o mesmo produto.' },
  { nome: 'Gustavo Lima', quando: 'há 1 semana', texto: 'Uso a retirada com hora marcada quase todo dia. Chego, a Bia já está com a sacola gelada na mão.' },
];

// ---------- Instagram [EXEMPLO] ----------
const instagram = {
  publicacoes: 412, seguidores: '18,6 mil',
  posts: [
    { foto: 'chopp-caneca', texto: 'Sexta de chopp gelado no balcão', curtidas: 284 },
    { foto: 'open-bar', texto: 'O open bar do fim de semana', curtidas: 512 },
    { foto: 'geladeira', texto: 'Reposição da câmara fria', curtidas: 198 },
    { foto: 'gin-tonica', texto: 'Gin tônica da casa, agora no site', curtidas: 347 },
    { foto: 'balde-cima', texto: 'Balde pronto para o jogo', curtidas: 226 },
    { foto: 'prateleira', texto: 'Chegaram rótulos novos', curtidas: 173 },
  ],
};

// ---------- políticas ----------
const politicas = [
  { titulo: 'Agendamento', texto: 'Entrega e retirada podem ser marcadas para o mesmo dia. Chopp pede 3 dias de antecedência, open bar 7 dias, degustação e empresas 2 dias. A confirmação chega pelo WhatsApp.' },
  { titulo: 'Atraso', texto: 'Se a entrega atrasar mais de 20 minutos da janela marcada, a taxa fica por nossa conta. Em eventos, esperamos até 30 minutos; depois disso o tempo de serviço começa a contar do horário marcado.' },
  { titulo: 'Cancelamento e remarcação', texto: cancelamento },
  { titulo: 'Garantia', texto: 'Bebida que chegar quente, amassada, vencida ou diferente do pedido é trocada na hora ou devolvida em dinheiro. Chopp com problema na chopeira: mandamos outra em até 1 hora ou devolvemos o valor do barril.' },
];
const sensivel = {
  titulo: 'Bebida alcoólica, chopeira e open bar',
  texto: 'Nos serviços com álcool, as regras são mais firmes, para a sua festa e para a lei.',
  itens: [
    'Venda e serviço de bebida alcoólica só para maiores de 18 anos. O entregador, o chopeiro e o bartender pedem documento com foto.',
    'No open bar, o bartender não serve quem já passou do ponto nem menores de idade, mesmo a pedido do contratante.',
    'A chopeira fica sob responsabilidade de quem contrata até o recolhimento. Dano por uso errado é cobrado à parte, conforme o contrato.',
    'Barril aberto não tem devolução do líquido, só troca em caso de defeito.',
  ],
};

const faq = [
  ['Tem pedido mínimo?', 'Não. A entrega custa R$ 6,90 e sai grátis a partir de R$ 99 em compras. Também dá para retirar no balcão, sem taxa.'],
  ['A bebida chega gelada?', 'Sim. Cervejas, refrigerantes e energéticos saem da câmara fria e vão em bolsa térmica. Se quiser, adicione gelo no carrinho.'],
  ['Como eu pago?', 'Pix, cartão de crédito ou débito na maquininha do entregador, ou dinheiro com troco. Nada é cobrado pelo site.'],
  ['Quanto chopp eu preciso para a minha festa?', 'Conte cerca de 1 litro por pessoa que bebe em festas de 4 horas. Um barril de 30L atende bem uns 25 convidados. Na dúvida, o Toninho calcula com você pelo WhatsApp.'],
  ['Vocês trocam cascos de cerveja?', 'Trocamos. No engradado retornável, o entregador leva os cascos vazios e você paga só o líquido.'],
  ['Vocês vendem bebida alcoólica para menores?', 'Não. A venda de bebida alcoólica é proibida para menores de 18 anos e pedimos documento na entrega e nos eventos.'],
  ['Posso pedir pelo iFood ou pelo 99Food?', 'Pode. Os preços do site e do WhatsApp costumam ser menores que os dos aplicativos, mas o estoque é o mesmo.'],
];

const bairros = ['Floresta', 'Santa Tereza', 'Sagrada Família', 'Centro', 'Santa Efigênia', 'Funcionários', 'Colégio Batista', 'Horto', 'Pompeia', 'Lagoinha']; // [EXEMPLO]

module.exports = {
  marca, entrega, abertura, horarios, categorias, produtos, extras, leveTambem, vitrineInicial, marcas, kits, capa, promessas, numeros,
  segmentos, servicos, pagamento, aPartir, cancelamento, equipe, galeriaCats, galeria, depoimentos, instagram, politicas, sensivel, faq, bairros,
};
