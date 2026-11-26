// Conteúdo do Taioba Standard: bar e cozinha mineira fictícia em Santa Tereza, Belo Horizonte.
// Carnes servidas à parte, porções de arroz, feijão, farofa, mandioca e batata para a mesa dividir, e drinks com cachaça.
// Tudo marcado com [EXEMPLO] é fictício e deve ser trocado pelos dados reais na cópia de cliente.

const marca = {
  nome: 'Taioba',
  completo: 'Taioba Bar e Cozinha Mineira',
  apoio: 'bar e cozinha mineira',
  razao: 'Taioba Bar e Cozinha Mineira Ltda.', // [EXEMPLO]
  cnpj: '00.000.000/0001-00', // [EXEMPLO] fictício
  desde: 2014,
  endereco: 'Rua Mármore, 418', // [EXEMPLO] número fictício
  bairro: 'Santa Tereza',
  cidade: 'Belo Horizonte',
  uf: 'MG',
  cep: '31010-220',
  referencia: 'A duas quadras da Praça Duque de Caxias',
  estacionamento: 'Manobrista de quinta a domingo à noite (R$ 25) e vagas na rua',
  telefone: '(31) 3333-0000', // [EXEMPLO]
  whatsapp: '(31) 99999-9999', // [EXEMPLO]
  email: 'reservas@taiobabar.com.br', // [EXEMPLO]
  instagram: 'taiobabar', // [EXEMPLO]
  dominio: 'https://taiobabar.com.br', // [EXEMPLO]
  nota: 4.8, // [EXEMPLO]
  avaliacoes: 2340, // [EXEMPLO]
  ifood: 'https://www.ifood.com.br/', // [EXEMPLO] link da loja no iFood
  food99: 'https://food.99app.com/', // [EXEMPLO] link da loja no 99Food
  coordenadas: [-19.91575, -43.9164],
};

// 0 = domingo. Turnos [abre, fecha] em horas; passar de 24 quer dizer madrugada do dia seguinte (25 = 1h).
const horario = [
  { turnos: [[11.5, 18]] },
  { turnos: [] },
  { turnos: [[11.5, 15], [18, 24]] },
  { turnos: [[11.5, 15], [18, 24]] },
  { turnos: [[11.5, 15], [18, 24]] },
  { turnos: [[11.5, 15], [18, 25]] },
  { turnos: [[11.5, 25]] },
];

// ---------- semana no Taioba (carrossel de cartões altos) ----------
// titulo + destaque em itálico; exp: experiência que o botão abre na reserva
const semana = [
  { dia: 'Terça', titulo: 'Caipirinha', destaque: 'em dobro', texto: 'Das 18h às 20h, a segunda caipirinha de limão-cravo sai por conta da casa.', foto: 'caipirinha', exp: 'happy' },
  { dia: 'Quarta', titulo: 'Costela', destaque: 'de 12 horas', texto: 'A costela que passou a noite na brasa, servida à parte com mandioca frita.', foto: 'costela-corte', exp: 'mesa' },
  { dia: 'Quinta', titulo: 'Viola', destaque: 'ao vivo', texto: 'Moda de viola e MPB na varanda, das 20h às 23h. Couvert de R$ 15.', foto: 'amigos-brinde', exp: 'mesa' },
  { dia: 'Sexta', titulo: 'Porção', destaque: 'em dobro', texto: 'No happy hour até as 20h, pediu mandioca ou batata, vem em dobro.', foto: 'mandioca-fogo', exp: 'happy' },
  { dia: 'Sábado', titulo: 'Tropeiro', destaque: 'da casa', texto: 'Feijão tropeiro com torresmo, couve e ovo, em porção para dividir.', foto: 'tropeiro', exp: 'mesa-mineira' },
  { dia: 'Domingo', titulo: 'Almoço', destaque: 'em família', texto: 'Mesa mineira completa com carnes, porções e sobremesa. Criança até 10 anos paga metade.', foto: 'porcoes-mesa', exp: 'mesa-mineira' },
];

// ---------- cardápio por segmento ----------
const segmentos = [
  { id: 'carnes', nome: 'Carnes à parte', curto: 'Carnes', foto: 'costela-corte', texto: 'As carnes vêm sozinhas na tábua, com vinagrete e molho da casa. Você escolhe as porções para acompanhar.' },
  { id: 'porcoes', nome: 'Porções', curto: 'Porções', foto: 'porcoes-mesa', texto: 'Arroz, feijão, farofa, mandioca e batata em panelinha de ferro, para a mesa dividir.' },
  { id: 'mesa', nome: 'Para a mesa', curto: 'Mesas', foto: 'porcoes-vista', texto: 'Combinações prontas de carne e porções, com preço fechado para dois ou quatro.' },
  { id: 'drinks', nome: 'Drinks', curto: 'Drinks', foto: 'drink-coando', texto: 'Caipirinhas de limão-cravo, clássicos com cachaça de alambique e criações do bar.' },
  { id: 'semalcool', nome: 'Sem álcool', curto: 'Sem álcool', foto: 'drink-limao', texto: 'Sucos da horta, sodas da casa e limonadas, para quem dirige ou prefere assim.' },
];

// serve: pessoas; min: tempo de preparo; tags: semgluten, veg, vegano, picante, alcool
const pratos = [
  { id: 'picanha', seg: 'carnes', nome: 'Picanha na brasa', peso: '500 g', inclui: 'Selada na grelha sobre a brasa e fatiada na tábua, com vinagrete e farofa de alho por cima.', serve: '2', min: 30, preco: 139, foto: 'picanha', destaque: true, tags: ['semgluten'] },
  { id: 'costela', seg: 'carnes', nome: 'Costela de 12 horas', peso: '600 g', inclui: 'Costela bovina defumada a noite toda na lenha de eucalipto, desmanchando no garfo.', serve: '2', min: 20, preco: 118, foto: 'costela-corte', tags: ['semgluten'] },
  { id: 'linguica', seg: 'carnes', nome: 'Linguiça artesanal da casa', peso: '400 g', inclui: 'Linguiça de pernil feita aqui, com pimenta-do-reino e cebolinha, grelhada na brasa.', serve: '2', min: 20, preco: 59, foto: 'linguica', tags: ['semgluten'] },
  { id: 'espetinho', seg: 'carnes', nome: 'Espetinhos de alcatra', peso: '4 unidades', inclui: 'Cubos de alcatra temperados com alho e sal grosso, assados na grelha.', serve: '2', min: 20, preco: 72, foto: 'espetinhos', tags: ['semgluten'] },
  { id: 'carne-sol', seg: 'carnes', nome: 'Carne de sol acebolada', peso: '400 g', inclui: 'Carne de sol dessalgada na casa, salteada com cebola roxa e manteiga de garrafa.', serve: '2', min: 25, preco: 84, foto: 'carne-acebolada', tags: ['semgluten'] },
  { id: 'torresmo', seg: 'carnes', nome: 'Torresmo de barriga', peso: '300 g', inclui: 'Barriga cozida devagar e pururucada, com limão-cravo para espremer.', serve: '2 a 3', min: 20, preco: 46, foto: 'torresmo-couve', tags: ['semgluten'] },

  { id: 'arroz', seg: 'porcoes', nome: 'Arroz branco soltinho', peso: 'panelinha', inclui: 'Arroz agulhinha refogado no alho, soltinho como o de casa.', serve: '2', min: 5, preco: 18, foto: 'arroz-panela', tags: ['vegano', 'semgluten'] },
  { id: 'feijao', seg: 'porcoes', nome: 'Feijão caldo com bacon', peso: 'panelinha', inclui: 'Feijão carioca cozido na panela de pressão, com bacon, louro e cheiro-verde.', serve: '2', min: 5, preco: 22, foto: 'feijao-caldo', tags: ['semgluten'] },
  { id: 'tropeiro', seg: 'porcoes', nome: 'Feijão tropeiro mineiro', peso: 'panelinha', inclui: 'Feijão com farinha de mandioca, torresmo, linguiça, couve e ovo mexido.', serve: '2 a 3', min: 15, preco: 34, foto: 'tropeiro', destaque: true },
  { id: 'farofa', seg: 'porcoes', nome: 'Farofa da casa', peso: 'cumbuca', inclui: 'Farinha de mandioca torrada na manteiga, de torresmo ou de banana-da-terra, à sua escolha.', serve: '2 a 4', min: 5, preco: 19, tags: ['semgluten'] },
  { id: 'mandioca', seg: 'porcoes', nome: 'Mandioca frita', peso: '500 g', inclui: 'Mandioca cozida e frita na hora, crocante por fora, regada com manteiga de garrafa.', serve: '2 a 3', min: 15, preco: 32, foto: 'mandioca-frita', destaque: true, tags: ['veg', 'semgluten'] },
  { id: 'batata', seg: 'porcoes', nome: 'Batata frita crocante', peso: '500 g', inclui: 'Batata cortada na casa, frita duas vezes e salpicada com sal e alecrim.', serve: '2 a 3', min: 15, preco: 29, foto: 'batata-frita', tags: ['vegano', 'semgluten'] },
  { id: 'batata-rustica', seg: 'porcoes', nome: 'Batata rústica com alho', peso: '500 g', inclui: 'Batata com casca assada e depois frita, com alho confitado e páprica.', serve: '2 a 3', min: 20, preco: 31, foto: 'batata-cesta', tags: ['vegano', 'semgluten'] },
  { id: 'couve', seg: 'porcoes', nome: 'Couve refogada no alho', peso: 'cumbuca', inclui: 'Couve cortada fininha na hora e passada rápido no alho.', serve: '2', min: 5, preco: 16, tags: ['vegano', 'semgluten'] },
  { id: 'vinagrete', seg: 'porcoes', nome: 'Vinagrete', peso: 'cumbuca', inclui: 'Tomate, cebola, pimentão e cheiro-verde no vinagre de maçã.', serve: '2 a 4', min: 5, preco: 12, tags: ['vegano', 'semgluten'] },

  { id: 'mesa-2', seg: 'mesa', nome: 'Mesa do Taioba para dois', peso: 'para 2', inclui: 'Uma carne (picanha ou costela) com arroz, feijão caldo, farofa da casa e mandioca frita.', serve: '2', min: 30, preco: 189, foto: 'porcoes-mesa', destaque: true },
  { id: 'mesa-4', seg: 'mesa', nome: 'Mesa do Taioba para quatro', peso: 'para 4', inclui: 'Duas carnes à escolha, arroz, tropeiro, feijão caldo, farofa, mandioca, batata e vinagrete.', serve: '4', min: 35, preco: 349, foto: 'porcoes-vista' },
  { id: 'tabua', seg: 'mesa', nome: 'Tábua de boteco', peso: 'para 3', inclui: 'Linguiça artesanal, torresmo, mandioca frita e batata rústica, com limão-cravo e pimenta da casa.', serve: '3', min: 25, preco: 98, foto: 'mandioca-fogo' },
  { id: 'mesa-veg', seg: 'mesa', nome: 'Mesa da horta', peso: 'para 2', inclui: 'Sem carne: arroz, feijão caldo sem bacon, farofa de banana, mandioca, couve e vinagrete.', serve: '2', min: 20, preco: 98, tags: ['veg', 'semgluten'] },

  { id: 'caipirinha', seg: 'drinks', nome: 'Caipirinha de limão-cravo', peso: '300 ml', inclui: 'Cachaça prata de Salinas, limão-cravo do pé da varanda e rapadura no lugar do açúcar.', serve: '1', min: 5, preco: 32, foto: 'caipirinha', destaque: true, tags: ['alcool'] },
  { id: 'rabo-galo', seg: 'drinks', nome: 'Rabo de galo da casa', peso: '150 ml', inclui: 'Cachaça envelhecida em amburana, vermute tinto e bitter de casca de laranja.', serve: '1', min: 5, preco: 36, foto: 'rabo-de-galo', tags: ['alcool'] },
  { id: 'taioba-tonica', seg: 'drinks', nome: 'Taioba tônica', peso: '400 ml', inclui: 'Gim mineiro, tônica, xarope de capim-santo e rodela de limão-siciliano.', serve: '1', min: 5, preco: 38, foto: 'drink-coupe', tags: ['alcool'] },
  { id: 'maracuja', seg: 'drinks', nome: 'Caipi de maracujá com mel', peso: '300 ml', inclui: 'Cachaça ouro, maracujá azedo e mel de engenho batidos com gelo.', serve: '1', min: 5, preco: 34, tags: ['alcool'] },
  { id: 'jabuticaba', seg: 'drinks', nome: 'Jabuticaba sour', peso: '200 ml', inclui: 'Cachaça, licor de jabuticaba da casa, limão e espuma de clara.', serve: '1', min: 5, preco: 36, tags: ['alcool'] },
  { id: 'cachacas', seg: 'drinks', nome: 'Cachaças de alambique', peso: 'dose de 50 ml', inclui: 'Vinte rótulos de Minas, em dose ou no trio para provar.', serve: '1', min: 2, preco: 14, de: true, tags: ['alcool'] },
  { id: 'chopp', seg: 'drinks', nome: 'Chopp e cervejas mineiras', peso: '300 ml', inclui: 'Chopp claro gelado e cervejas artesanais de Belo Horizonte e Nova Lima.', serve: '1', min: 2, preco: 14, de: true, tags: ['alcool'] },

  { id: 'suco', seg: 'semalcool', nome: 'Suco da horta', peso: '400 ml', inclui: 'Limão com hortelã, abacaxi com capim-santo ou laranja com couve.', serve: '1', min: 5, preco: 16, foto: 'drink-limao', tags: ['vegano'] },
  { id: 'soda', seg: 'semalcool', nome: 'Soda de jabuticaba', peso: '400 ml', inclui: 'Xarope de jabuticaba da casa, água com gás e limão.', serve: '1', min: 5, preco: 18, tags: ['vegano'] },
  { id: 'limonada', seg: 'semalcool', nome: 'Limonada suíça', peso: '400 ml', inclui: 'Limão batido com casca, leite condensado e gelo.', serve: '1', min: 5, preco: 15, tags: ['veg'] },
  { id: 'refri', seg: 'semalcool', nome: 'Água, refrigerante e chá gelado', peso: 'lata ou garrafa', inclui: 'Água com e sem gás, refrigerantes e chá-mate gelado da casa.', serve: '1', min: 2, preco: 7, de: true, tags: ['vegano'] },
];

const tagsNome = { veg: 'Vegetariano', vegano: 'Vegano', semgluten: 'Sem glúten', picante: 'Picante', alcool: '+18' };

// ---------- experiências (o que se reserva) ----------
const experiencias = [
  { id: 'mesa', nome: 'Mesa no salão ou na varanda', inclui: 'Mesa garantida com o cardápio inteiro. Diga a ocasião e a equipe prepara um recado na mesa.', min: 120, preco: 0, anf: ['rafael'], ambientes: ['salao', 'varanda'], foto: 'capa-salao-noite', turnos: 'todos' },
  { id: 'mesa-mineira', nome: 'Mesa mineira completa', inclui: 'Três carnes e todas as porções servidas na mesa, repondo à vontade por duas horas: arroz, feijão, tropeiro, farofa, mandioca e batata. Sobremesa inclusa.', min: 120, preco: 109, anf: ['caio', 'iara'], ambientes: ['salao', 'varanda'], foto: 'porcoes-vista', destaque: true, sensivel: true, turnos: 'todos' },
  { id: 'happy', nome: 'Happy hour de caipirinha', inclui: 'Caipirinha de limão-cravo à vontade por duas horas, com uma porção de mandioca ou batata a cada quatro pessoas. Só para maiores de 18.', min: 120, preco: 79, anf: ['jessica'], ambientes: ['varanda', 'bar'], foto: 'drinks-servindo', turnos: 'happy' },
  { id: 'aniversario', nome: 'Aniversário na varanda', inclui: 'Mesa reservada para até 25 pessoas, bolo liberado sem taxa e um drink de cortesia para quem faz aniversário.', min: 180, preco: 0, anf: ['rafael', 'livia'], ambientes: ['varanda'], foto: 'evento-amigos', turnos: 'todos' },
  { id: 'evento', nome: 'Evento privativo', inclui: 'Salão ou varanda só para o seu grupo, de 25 a 80 pessoas, com cardápio de porções e drinks fechado com a equipe.', min: 240, preco: 129, de: true, anf: ['rafael', 'iara'], ambientes: ['salao', 'varanda'], foto: 'evento-mesa', sinal: true, sensivel: true, turnos: 'evento' },
];

const ambientes = {
  salao: 'Salão interno',
  varanda: 'Varanda da horta',
  bar: 'Balcão do bar',
};

const pagamento = 'Pix, cartões de débito e crédito e vale-refeição no almoço. Taxa de serviço de 10%, opcional e repassada à equipe. Couvert artístico só na quinta (R$ 15).';
const aPartir = 'Cachaças, chopp e bebidas variam com o rótulo; eventos variam com o cardápio e o número de pessoas. O valor final aparece no cardápio do dia ou na proposta.';

// ---------- equipe ----------
const equipe = [
  { id: 'iara', nome: 'Iara Mendes', cargo: 'Chef e sócia', esp: 'Cozinha mineira de panela e as porções da casa', anos: 18, foto: 'iara', formacao: 'Gastronomia pelo Senac Minas, estágio em cozinhas do Serro e de Tiradentes', bio: 'Cresceu entre o fogão da avó em Conceição do Mato Dentro e os botecos de Santa Tereza. Abriu o Taioba em 2014 para servir porção de verdade: farta, quente e feita na hora.', faz: ['mesa-mineira', 'evento'], dias: { 2: 'Almoço e noite', 3: 'Almoço e noite', 4: 'Noite', 5: 'Noite', 6: 'Almoço' } },
  { id: 'caio', nome: 'Caio Toledo', cargo: 'Mestre da brasa', esp: 'Carnes à parte, defumados e linguiça artesanal', anos: 12, foto: 'caio', formacao: 'Formado em gastronomia, cursos de charcutaria em Bento Gonçalves e em Buenos Aires', bio: 'Cuida da grelha, da defumadeira e da linguiça que sai da casa. É ele quem acende o fogo às seis da tarde para a costela do dia seguinte.', faz: ['mesa-mineira'], dias: { 3: 'Noite', 4: 'Noite', 5: 'Noite', 6: 'Almoço e noite', 0: 'Almoço' } },
  { id: 'livia', nome: 'Lívia Prado', cargo: 'Chef de porções', esp: 'Farofas, tropeiro, mandioca e os doces de tacho', anos: 9, foto: 'livia', formacao: 'Cozinha pelo Senac, curso de doces tradicionais em Santa Luzia', bio: 'Comanda a praça das porções: torra a farinha da farofa toda manhã e frita a mandioca só depois do pedido. Também cuida das encomendas para levar.', faz: ['aniversario'], dias: { 2: 'Almoço', 3: 'Almoço', 4: 'Almoço e noite', 6: 'Almoço e noite', 0: 'Almoço' } },
  { id: 'jessica', nome: 'Jéssica Amaral', cargo: 'Chefe de bar', esp: 'Caipirinhas, drinks com cachaça e a carta de alambiques', anos: 8, foto: 'jessica', formacao: 'Bartender pela ABB, certificada em cachaça pelo Instituto Brasileiro da Cachaça', bio: 'Montou a carta com vinte alambiques mineiros e criou os drinks da casa, do rabo de galo de amburana à Taioba tônica.', faz: ['happy'], dias: { 2: 'Noite', 4: 'Noite', 5: 'Noite', 6: 'Noite', 0: 'Almoço' } },
  { id: 'rafael', nome: 'Rafael Nunes', cargo: 'Maître e eventos', esp: 'Recepção, aniversários e eventos privativos', anos: 14, foto: 'rafael', formacao: 'Técnico em hotelaria, passagem por bares da Savassi e de Lisboa', bio: 'Recebe na porta, conhece os clientes pelo nome e organiza aniversários, confraternizações e casamentos pequenos na varanda.', faz: ['mesa', 'aniversario', 'evento'], dias: { 2: 'Noite', 3: 'Noite', 4: 'Noite', 5: 'Noite', 6: 'Almoço e noite', 0: 'Almoço' } },
];

// ---------- galeria por categoria ----------
const categorias = [['porcoes', 'Porções'], ['carnes', 'Carnes'], ['drinks', 'Drinks'], ['salao', 'Salão e varanda'], ['eventos', 'Eventos']];
const galeria = [
  { foto: 'porcoes-mesa', cat: 'porcoes', leg: 'Porções na panelinha de ferro' },
  { foto: 'capa-salao-noite', cat: 'salao', leg: 'A varanda numa sexta à noite' },
  { foto: 'drink-coando', cat: 'drinks', leg: 'Drink da casa sendo coado' },
  { foto: 'costela-corte', cat: 'carnes', leg: 'Costela de 12 horas saindo da brasa' },
  { foto: 'evento-mesa', cat: 'eventos', leg: 'Mesa posta para um aniversário de 40 pessoas' },
  { foto: 'mandioca-fogo', cat: 'porcoes', leg: 'Mandioca frita e farofa perto do fogo' },
  { foto: 'bartender', cat: 'drinks', leg: 'O balcão do bar' },
  { foto: 'linguica', cat: 'carnes', leg: 'Linguiça artesanal na grelha' },
  { foto: 'salao-vigas', cat: 'salao', leg: 'O salão com luz de fim de tarde' },
  { foto: 'evento-longa', cat: 'eventos', leg: 'A mesa comprida para confraternizações' },
  { foto: 'tropeiro', cat: 'porcoes', leg: 'Feijão tropeiro com torresmo' },
  { foto: 'rabo-de-galo', cat: 'drinks', leg: 'Rabo de galo de amburana' },
  { foto: 'espetinhos', cat: 'carnes', leg: 'Espetinhos de alcatra' },
  { foto: 'varanda', cat: 'salao', leg: 'Varanda da horta de dia' },
  { foto: 'evento-amigos', cat: 'eventos', leg: 'Aniversário na varanda' },
  { foto: 'batata-frita', cat: 'porcoes', leg: 'Batata frita crocante' },
  { foto: 'caipirinha', cat: 'drinks', leg: 'Caipirinha de limão-cravo' },
  { foto: 'churrasco', cat: 'carnes', leg: 'Carnes e linguiça na brasa' },
  { foto: 'mesa-velas', cat: 'salao', leg: 'Mesa à luz de vela' },
  { foto: 'arroz-feijao', cat: 'porcoes', leg: 'Arroz, feijão e vinagrete' },
];

const eventosFotos = ['evento-mesa', 'evento-amigos', 'evento-longa', 'mesa-velas'];

// ---------- depoimentos ----------
const depoimentos = [
  { nome: 'Patrícia Gontijo', quando: 'há 2 semanas', texto: 'A mandioca frita com manteiga de garrafa é a melhor de BH. Pedimos picanha à parte e montamos a mesa do nosso jeito. Atendimento do Rafael impecável.' },
  { nome: 'Marcelo Andrade', quando: 'há 1 mês', texto: 'Fui no happy hour de terça e a caipirinha de limão-cravo é outra coisa. Ambiente lindo na varanda, cheio de planta.' },
  { nome: 'Rodrigo Lacerda', quando: 'há 1 mês', texto: 'Tropeiro de sábado é obrigatório. Porção grande, bem servida, e a costela desmancha. Chegue cedo ou reserve.' },
  { nome: 'Fernanda Ruas', quando: 'há 2 meses', texto: 'Fiz meu aniversário na varanda com 22 pessoas. Liberaram o bolo, me deram um drink e a equipe cuidou de tudo.' },
  { nome: 'Luiz Otávio', quando: 'há 3 meses', texto: 'A Mesa mineira completa vale cada centavo. Repõe tudo quente e as farofas são de comer rezando.' },
  { nome: 'Camila Souto', quando: 'há 3 meses', texto: 'Confraternização da empresa com 50 pessoas. Porções chegando sem parar, drinks ótimos e preço justo.' },
];

// ---------- Instagram (perfil fictício) ----------
const instagram = {
  usuario: marca.instagram,
  seguidores: '52,1 mil', // [EXEMPLO]
  publicacoes: 412, // [EXEMPLO]
  posts: [
    { foto: 'porcoes-mesa', texto: 'Panelinha de ferro chegando na mesa.', curtidas: 2934 },
    { foto: 'drink-coando', texto: 'Jabuticaba sour, criação da Jéssica.', curtidas: 1880 },
    { foto: 'mandioca-fogo', texto: 'Sexta tem porção em dobro até as 20h.', curtidas: 3412 },
    { foto: 'costela-corte', texto: 'Doze horas de brasa para este corte.', curtidas: 2561 },
    { foto: 'capa-salao-noite', texto: 'A varanda numa sexta de casa cheia.', curtidas: 1476 },
    { foto: 'caipirinha', texto: 'Limão-cravo do pé da varanda.', curtidas: 2210 },
  ],
};

// ---------- números da casa ----------
const numeros = [
  [new Date().getFullYear() - marca.desde, 'anos servindo porção em Santa Tereza'],
  [16, 'porções e acompanhamentos no cardápio'],
  [20, 'cachaças de alambique na carta'],
  [7, 'carnes servidas à parte'],
];

// ---------- políticas ----------
const politicas = [
  { id: 'reserva', titulo: 'Reservas', texto: 'Reservas pelo site, WhatsApp ou telefone com até 60 dias de antecedência. Mesas de até 10 pessoas confirmam na hora; grupos maiores e eventos recebem a confirmação da equipe em até 2 horas no horário de funcionamento.' },
  { id: 'atraso', titulo: 'Atraso', texto: 'A mesa fica guardada por 15 minutos. Na Mesa mineira completa e no happy hour, as duas horas contam a partir do horário reservado.' },
  { id: 'cancelamento', titulo: 'Cancelamento e remarcação', texto: 'Mesas, aniversários e experiências: cancele ou remarque sem custo até 2 horas antes. Eventos privativos pedem sinal de 30% por Pix, devolvido até 7 dias antes; depois disso vira crédito por 60 dias.' },
  { id: 'falta', titulo: 'Não comparecimento', texto: 'Sem aviso, a reserva cai depois dos 15 minutos de tolerância. Duas faltas sem aviso suspendem as reservas online por 90 dias.' },
  { id: 'garantia', titulo: 'Garantia da porção', texto: 'Se a porção chegou fria, murcha ou diferente do cardápio, ou a carne fora do ponto pedido, a cozinha refaz na hora, sem custo. Basta avisar quem atende a mesa.' },
  { id: 'alcool', titulo: 'Bebida alcoólica', texto: 'Venda só para maiores de 18 anos, com documento. Happy hour e open de caipirinha são servidos com moderação e a equipe pode encerrar o serviço para quem passar do ponto.' },
];

const sensivel = {
  titulo: 'Alergias, intolerâncias e restrições',
  texto: 'A cozinha trabalha com leite, ovos, glúten, carne de porco, amendoim e castanhas. Avise na reserva e de novo ao chegar: cada porção tem ficha com os ingredientes.',
  itens: [
    'Mandioca, batata e torresmo passam pela mesma fritadeira. Para alergia grave, a equipe frita a sua porção em óleo separado.',
    'Farofa, tropeiro e feijão caldo podem levar bacon ou torresmo. Para vegetarianos, peça a Mesa da horta ou as versões sem carne.',
    'Manteiga de garrafa e leite condensado aparecem na mandioca e na limonada suíça. Para intolerância à lactose, a cozinha troca por azeite.',
    'Na Mesa mineira completa e nos eventos, restrições precisam ser informadas com 48 horas de antecedência.',
  ],
};

// ---------- dúvidas ----------
const duvidas = [
  ['As carnes já vêm com acompanhamento?', 'Não. As carnes vêm sozinhas na tábua, só com vinagrete e molho da casa. Você escolhe as porções (arroz, feijão, farofa, mandioca, batata) para a mesa dividir, ou pede uma das Mesas do Taioba, que já vêm montadas.'],
  ['Quanto rende cada porção?', 'As panelinhas servem duas pessoas com folga. Para quatro pessoas, a gente costuma sugerir duas carnes e quatro ou cinco porções.'],
  ['Preciso reservar?', 'No almoço de terça a sexta, não. À noite, no fim de semana, no happy hour e na Mesa mineira completa, a reserva garante o lugar.'],
  ['Tem opção vegetariana?', 'Tem a Mesa da horta e quase todas as porções em versão sem carne: arroz, mandioca, batata, couve, vinagrete e farofa de banana.'],
  ['Crianças podem ir?', 'Claro. Temos cadeirão, um prato kids de arroz, feijão e frango desfiado (R$ 32) e, na Mesa mineira de domingo, criança até 10 anos paga metade.'],
  ['Tem música ao vivo?', 'Toda quinta, das 20h às 23h, com moda de viola e MPB na varanda. Couvert artístico de R$ 15 por pessoa só nesse dia.'],
  ['Tem estacionamento?', `${marca.estacionamento}. O bairro tem bastante vaga na rua no almoço.`],
  ['Posso levar bolo de aniversário?', 'Pode, sem taxa. A equipe guarda e serve na hora combinada. Quem faz aniversário ganha um drink da casa.'],
];

// ---------- encomendas para levar (Área do cliente e site) ----------
const encomendas = [
  { id: 'tropeiro-kg', nome: 'Feijão tropeiro congelado', det: 'Pote de 1 kg, serve 4 pessoas', preco: 69 },
  { id: 'linguica-kg', nome: 'Linguiça artesanal crua', det: 'Pacote de 1 kg para a sua churrasqueira', preco: 64 },
  { id: 'farofa-pote', nome: 'Farofa da casa', det: 'Pote de 500 g, de torresmo ou de banana', preco: 28 },
  { id: 'mandioca-kg', nome: 'Mandioca pré-cozida', det: 'Pacote de 1 kg, pronta para fritar', preco: 32 },
  { id: 'kit-caipi', nome: 'Kit caipirinha', det: 'Cachaça de 700 ml, limões-cravo e rapadura para 10 doses', preco: 89 },
  { id: 'cachaca-casa', nome: 'Cachaça da casa em amburana', det: 'Garrafa de 700 ml', preco: 96 },
];

const bairros = ['Santa Tereza', 'Floresta', 'Sagrada Família', 'Horto', 'Santa Efigênia', 'Colégio Batista', 'Centro', 'Funcionários'];

// ---------- conta de demonstração da Área do cliente ----------
const demo = {
  email: 'helena@exemplo.com',
  senha: 'taioba2026',
  nome: 'Helena Duarte',
  telefone: '(31) 98888-0000',
  nascimento: '1990-03-14',
  visitas: 7,
  prefs: { restricoes: ['sem-lactose'], obs: 'Prefere mesa na varanda, perto das plantas.', ambiente: 'varanda', avisos: true },
  reservas: [
    { id: 'r-demo-1', exp: 'mesa-mineira', anf: 'caio', amb: 'varanda', pessoas: 4, dias: 9, hora: '20:00', status: 'confirmada', obs: 'Aniversário de namoro' },
    { id: 'r-demo-2', exp: 'happy', anf: 'jessica', amb: 'varanda', pessoas: 6, dias: -24, hora: '18:00', status: 'concluida' },
    { id: 'r-demo-3', exp: 'mesa', anf: 'rafael', amb: 'salao', pessoas: 2, dias: -52, hora: '12:30', status: 'concluida' },
  ],
  pedidos: [
    { id: 'p-demo-1', itens: [['tropeiro-kg', 1], ['farofa-pote', 2]], dias: -12, status: 'retirado' },
  ],
};

const restricoes = [['sem-lactose', 'Sem lactose'], ['sem-gluten', 'Sem glúten'], ['vegetariana', 'Vegetariana'], ['vegana', 'Vegana'], ['sem-porco', 'Sem carne de porco'], ['castanhas', 'Alergia a castanhas']];

const fotos = {
  'capa-salao-noite': 'Varanda do Taioba à noite, com mesas cheias entre plantas e luz baixa',
  'porcoes-mesa': 'Panelinhas de ferro com arroz, feijão, carne e vinagrete sobre a mesa de madeira',
  'porcoes-vista': 'Mesa vista de cima com feijão, arroz, couve, farofa e laranja em cumbucas',
  'arroz-feijao': 'Panelinhas de arroz, feijão e vinagrete',
  'arroz-panela': 'Panelinha de arroz branco com pimenta por cima e vinagrete ao lado',
  'mandioca-fogo': 'Mandioca frita e farofa ao lado do fogo a lenha',
  'mandioca-frita': 'Mandioca frita sobre tábua de madeira',
  'feijao-caldo': 'Feijão caldo em panelinha de alumínio com chá gelado ao lado',
  'torresmo-couve': 'Torresmo sobre couve e vinagrete numa travessa de madeira',
  'espetinhos': 'Espetinhos de alcatra grelhados na tábua',
  'tropeiro': 'Feijão tropeiro com arroz e torresmo em prato de ferro',
  'carne-acebolada': 'Carne acebolada com mandioca frita e alface',
  'batata-frita': 'Batata frita crocante numa tigela branca',
  'batata-cesta': 'Batata frita com tempero numa cesta forrada',
  'linguica': 'Linguiça enrolada assando na grelha',
  'churrasco': 'Carnes e linguiças na brasa',
  'costela-corte': 'Costela assada sendo cortada na tábua',
  'drink-coupe': 'Drink sendo servido na taça coupe no balcão do bar',
  'drinks-servindo': 'Bartender servindo drinks em copos baixos',
  'bartender': 'Bartender preparando um drink no balcão',
  'rabo-de-galo': 'Rabo de galo com gelo e casca de laranja',
  'drink-coando': 'Drink de cor âmbar sendo coado no copo',
  'mesa-velas': 'Mesa posta à luz de velas',
  'vinho-vela': 'Taças e vela acesa sobre a mesa',
  'caipirinha': 'Caipirinha com limões e gelo sobre mármore',
  'drink-limao': 'Suco de limão com canudo listrado',
  'picanha': 'Picanha na brasa sobre tábua com vinagrete e folhas',
  'salao-vigas': 'Salão com plantas penduradas e mesas de toalha amarela',
  'varanda': 'Varanda com mesas de madeira e plantas altas',
  'evento-mesa': 'Mesa comprida de evento com velas, pratos e taças',
  'evento-longa': 'Mesa comprida de madeira preparada para um evento',
  'evento-amigos': 'Amigos reunidos numa mesa colorida com girassóis',
  'amigos-brinde': 'Duas amigas brindando no salão',
  'atendimento': 'Atendente servindo um prato à cliente',
  'iara': 'Iara Mendes, chef, de avental verde na cozinha',
  'caio': 'Caio Toledo, mestre da brasa, de dólmã e touca branca',
  'livia': 'Lívia Prado, chef de porções, de avental caramelo',
  'jessica': 'Jéssica Amaral, chefe de bar, de avental listrado no salão',
  'rafael': 'Rafael Nunes, maître, de camisa branca e avental marrom',
};

module.exports = { marca, horario, semana, segmentos, pratos, tagsNome, experiencias, ambientes, pagamento, aPartir, equipe, categorias, galeria, eventosFotos, depoimentos, instagram, numeros, politicas, sensivel, duvidas, encomendas, bairros, demo, restricoes, fotos };
