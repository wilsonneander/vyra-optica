// Conteúdo do Silver de barbearia: Cobre Barbearia, marca fictícia em Curitiba.
// Tudo marcado [EXEMPLO] troca pelo cliente; [JURÍDICO] passa pela revisão jurídica antes de publicar.
// Trocar aqui e rodar: node templates/barbearia/_build-silver/build.js

const marca = {
  nome: 'Cobre',
  completo: 'Cobre Barbearia',
  razao: 'Cobre Barbearia Ltda.', // [EXEMPLO]
  cnpj: '52.640.118/0001-37', // [EXEMPLO] fictício
  endereco: 'Alameda Dom Pedro II, 1048', // [EXEMPLO]
  bairro: 'Batel',
  cidade: 'Curitiba',
  uf: 'PR',
  cep: '80420-060',
  lat: -25.4413,
  lon: -49.2889,
  telefone: '(41) 3029-7714', // [EXEMPLO]
  whatsapp: '5541998127740', // [EXEMPLO]
  whatsappTexto: '(41) 99812-7740',
  email: 'contato@cobrebarbearia.com.br',
  instagram: 'https://instagram.com/cobre.barbearia',
  instagramUser: '@cobre.barbearia',
  facebook: 'https://facebook.com/cobre.barbearia',
  dominio: 'https://cobrebarbearia.com.br',
  nota: 4.9, // [EXEMPLO]
  avaliacoes: 1380, // [EXEMPLO]
  desde: 2016,
  atendimentos: 38, // mil atendimentos [EXEMPLO]
};

// [dia, horário]; índice = getDay() (0 = domingo)
const horarios = [
  ['Domingo', 'Fechado'],
  ['Segunda', '13h às 20h'],
  ['Terça', '9h às 20h'],
  ['Quarta', '9h às 20h'],
  ['Quinta', '9h às 21h'],
  ['Sexta', '9h às 21h'],
  ['Sábado', '8h às 17h'],
];
const abertura = { 0: null, 1: [13, 20], 2: [9, 20], 3: [9, 20], 4: [9, 21], 5: [9, 21], 6: [8, 17] };
const horarioCurto = 'Seg, 13h às 20h. Ter a sex, 9h às 20h (qui e sex até 21h). Sáb, 8h às 17h';

// segmentos dos serviços (abas). foto = capa do segmento
const segmentos = [
  { id: 'cabelo', nome: 'Cabelo', frase: 'Tesoura, máquina e navalha. O corte começa pela conversa no espelho.', foto: 'corte-acabamento' },
  { id: 'barba', nome: 'Barba', frase: 'Toalha quente, óleo, navalha nova e o desenho que combina com o seu rosto.', foto: 'barba-toalha-escura' },
  { id: 'sobrancelha', nome: 'Sobrancelha e acabamento', frase: 'Detalhes que fecham o visual: sobrancelha limpa, pezinho e nuca alinhados.', foto: 'insta-3' },
  { id: 'infantil', nome: 'Infantil', frase: 'Cadeira com assento alto, paciência e desenho animado na tela.', foto: 'infantil-maquina' },
];

// serviços: min = duração; de = preço "a partir de"; foto opcional para o cartão grande
const servicos = [
  { id: 'tesoura', seg: 'cabelo', nome: 'Corte na tesoura', inclui: 'Lavagem, corte todo na tesoura e finalização com pomada ou pasta.', min: 45, preco: 70, foto: 'corte-tesoura' },
  { id: 'degrade', seg: 'cabelo', nome: 'Degradê', inclui: 'Fade do zero (ou do pente que você quiser) até o comprimento de cima, acabamento na navalha.', min: 45, preco: 75, foto: 'corte-degrade' },
  { id: 'maquina', seg: 'cabelo', nome: 'Corte na máquina', inclui: 'Um ou dois pentes, contorno e pezinho na navalha.', min: 30, preco: 55, foto: 'corte-maquina' },
  { id: 'risco', seg: 'cabelo', nome: 'Risco e desenho', inclui: 'Linha ou desenho na lateral feito na navalha. Só junto com um corte.', min: 15, preco: 20, adicional: true, foto: 'corte-risco' },
  { id: 'barba', seg: 'barba', nome: 'Barba com toalha quente', inclui: 'Toalha quente, óleo pré-barba, navalha descartável e balm no fim.', min: 35, preco: 55, foto: 'barba-navalha' },
  { id: 'barba-tesoura', seg: 'barba', nome: 'Barba na tesoura', inclui: 'Para quem quer manter o volume: tesoura, pente e contorno na navalha.', min: 30, preco: 45, foto: 'barba-tesoura' },
  { id: 'barboterapia', seg: 'barba', nome: 'Barboterapia', inclui: 'Vapor de ozônio, esfoliação, duas toalhas quentes, navalha e máscara calmante.', min: 50, preco: 85, foto: 'barba-toalha' },
  { id: 'pigmentacao', seg: 'barba', nome: 'Pigmentação de barba', inclui: 'Preenche falhas e uniformiza a cor. Teste de sensibilidade 48 horas antes.', min: 30, preco: 50, de: true, foto: 'barba-pincel' },
  { id: 'sobrancelha', seg: 'sobrancelha', nome: 'Sobrancelha na navalha', inclui: 'Limpeza dos fios soltos sem afinar o desenho natural.', min: 15, preco: 25, foto: 'sobrancelha-navalha' },
  { id: 'sobrancelha-pinca', seg: 'sobrancelha', nome: 'Sobrancelha na pinça', inclui: 'Fio a fio, para quem tem pele sensível à lâmina.', min: 20, preco: 30, foto: 'sobrancelha-contorno' },
  { id: 'pezinho', seg: 'sobrancelha', nome: 'Pezinho e nuca', inclui: 'Contorno entre um corte e outro, sem mexer no comprimento.', min: 15, preco: 20, foto: 'acabamento-nuca' },
  { id: 'cera', seg: 'sobrancelha', nome: 'Nariz e orelha na cera', inclui: 'Cera morna aplicada com espátula descartável.', min: 10, preco: 20, foto: 'barba-espuma' },
  { id: 'infantil', seg: 'infantil', nome: 'Corte infantil', inclui: 'Até 12 anos. Pode trazer o brinquedo, a gente espera o tempo da criança.', min: 35, preco: 50, foto: 'infantil-capa' },
  { id: 'primeiro', seg: 'infantil', nome: 'Primeiro corte', inclui: 'Mecha guardada num envelope e foto do momento para a família.', min: 30, preco: 60, foto: 'infantil-penteado' },
  { id: 'pai-filho', seg: 'infantil', nome: 'Pai e filho', inclui: 'Dois cortes lado a lado, nas cadeiras vizinhas e no mesmo horário.', min: 45, preco: 110, foto: 'pai-filho' },
];

// pacotes no formato de planos (a referência tem dois planos lado a lado)
const pacotes = [
  { id: 'corte-barba', nome: 'Corte e barba', frase: 'O par mais pedido da casa, na mesma cadeira.', preco: 115, avulso: 130, min: 75, inclui: ['Corte na tesoura ou degradê', 'Barba com toalha quente', 'Lavagem e finalização', 'Pezinho na navalha', 'Café ou água com gás'] },
  { id: 'ritual', nome: 'Ritual Cobre', frase: 'Uma hora e meia de cadeira para sair outro.', preco: 175, avulso: 210, min: 100, destaque: true, inclui: ['Corte na tesoura ou degradê', 'Barboterapia completa', 'Sobrancelha na navalha', 'Nariz e orelha na cera', 'Massagem de ombros e pescoço', 'Chope artesanal ou café coado'] },
];

// equipe: agenda por dia (getDay) com [entrada, saída]; faz = ids de serviços; trabalhos = fotos da galeria
const equipe = [
  {
    id: 'henrique', nome: 'Henrique Lacerda', cargo: 'Fundador e barbeiro', desde: 2009, foto: 'barbeiro-2', insta: '@henrique.navalha',
    esp: 'Tesoura clássica e pompadour',
    bio: 'Abriu a Cobre em 2016 depois de sete anos atrás da cadeira de outras casas. Gosta de corte social bem assentado, risca de lado e topete que aguenta o dia inteiro.',
    frase: 'Corte bom é o que você consegue arrumar sozinho no dia seguinte.',
    faz: ['tesoura', 'maquina', 'barba', 'barba-tesoura', 'sobrancelha', 'pezinho', 'corte-barba', 'ritual'],
    agenda: { 2: [9, 18], 3: [9, 18], 4: [11, 21], 5: [11, 21], 6: [8, 14] },
    trabalhos: ['corte-tesoura', 'corte-perfil', 'corte-secador'],
  },
  {
    id: 'otavio', nome: 'Otávio Brandt', cargo: 'Barbeiro', desde: 2015, foto: 'barbeiro-1', insta: '@otavio.barba',
    esp: 'Barba, barboterapia e pigmentação',
    bio: 'Fez curso de visagismo e passa mais tempo olhando o formato do rosto do que a barba em si. É quem atende a maioria das barboterapias e dos testes de pigmentação.',
    frase: 'A barba tem que acompanhar o maxilar, não brigar com ele.',
    faz: ['tesoura', 'barba', 'barba-tesoura', 'barboterapia', 'pigmentacao', 'sobrancelha', 'sobrancelha-pinca', 'cera', 'corte-barba', 'ritual'],
    agenda: { 1: [13, 20], 2: [10, 20], 3: [10, 20], 5: [9, 18], 6: [8, 17] },
    trabalhos: ['barba-navalha', 'barba-toalha', 'barba-pincel'],
  },
  {
    id: 'jefferson', nome: 'Jefferson Moura', cargo: 'Barbeiro', desde: 2014, foto: 'barbeiro-3', insta: '@jeff.fade',
    esp: 'Degradê, cabelo crespo e cacheado, risco',
    bio: 'Especialista em textura: crespo, cacheado e ondulado. Faz o degradê à mão livre e desenha risco na navalha. Atende muito pai e filho aos sábados.',
    frase: 'Cada cacho tem um caimento. O corte respeita isso.',
    faz: ['degrade', 'maquina', 'risco', 'barba', 'pezinho', 'infantil', 'pai-filho', 'corte-barba'],
    agenda: { 1: [13, 20], 3: [9, 18], 4: [9, 18], 5: [12, 21], 6: [8, 17] },
    trabalhos: ['corte-risco', 'corte-degrade', 'corte-acabamento'],
  },
  {
    id: 'rodrigo', nome: 'Rodrigo Kuster', cargo: 'Barbeiro', desde: 2018, foto: 'barbeiro-4', insta: '@rodrigo.kuster',
    esp: 'Máquina, fade e corte infantil',
    bio: 'Começou cortando o cabelo dos primos e virou o barbeiro preferido das crianças da casa. Rápido na máquina, caprichoso no acabamento da nuca.',
    frase: 'Criança sai daqui querendo voltar. Esse é o teste.',
    faz: ['degrade', 'maquina', 'risco', 'sobrancelha', 'pezinho', 'cera', 'infantil', 'primeiro', 'pai-filho'],
    agenda: { 1: [13, 20], 2: [9, 20], 3: [12, 20], 4: [9, 18], 6: [8, 17] },
    trabalhos: ['infantil-maquina', 'corte-maquina', 'acabamento-nuca'],
  },
];

// avaliações fictícias no formato das do Google [EXEMPLO]
const depoimentos = [
  { texto: 'Cheguei com foto de referência e o Jefferson explicou o que dava para fazer com o meu cacho antes de ligar a máquina. Ficou melhor que a foto.', nome: 'Caio M.', serv: 'Degradê com o Jefferson' },
  { texto: 'A barboterapia é o meu momento do mês. Toalha quente de verdade, navalha aberta na minha frente e silêncio quando eu quero.', nome: 'Fernando A.', serv: 'Barboterapia com o Otávio' },
  { texto: 'Levei meu filho para o primeiro corte. O Rodrigo teve uma paciência enorme e ainda guardou a mecha num envelope.', nome: 'Patrícia L.', serv: 'Primeiro corte com o Rodrigo' },
  { texto: 'Agendei pelo site em dois minutos, escolhi o barbeiro e o horário. Chegou a confirmação no WhatsApp logo depois.', nome: 'Rafael T.', serv: 'Corte e barba com o Henrique' },
  { texto: 'Sobrancelha sem exagero, do jeito que eu pedi. Ninguém percebeu que eu fiz, só que eu estava com a cara mais descansada.', nome: 'Gustavo P.', serv: 'Sobrancelha na navalha' },
  { texto: 'Preço igual ao do site, horário cumprido e um café coado bom na espera. Virei cliente de quinze em quinze dias.', nome: 'Diego R.', serv: 'Corte na tesoura com o Henrique' },
];

// galeria por categoria
const galeriaCats = [
  { id: 'cortes', nome: 'Cortes' },
  { id: 'barba', nome: 'Barba' },
  { id: 'sobrancelha', nome: 'Sobrancelha' },
  { id: 'infantil', nome: 'Infantil' },
  { id: 'espaco', nome: 'O espaço' },
];
const galeria = [
  ['corte-degrade', 'cortes'], ['barba-navalha', 'barba'], ['espaco-cadeira', 'espaco'], ['corte-pente', 'cortes'],
  ['sobrancelha-navalha', 'sobrancelha'], ['infantil-capa', 'infantil'], ['barba-luvas', 'barba'], ['corte-risco', 'cortes'],
  ['espaco-espelhos', 'espaco'], ['acabamento-nuca', 'sobrancelha'], ['barba-pb', 'barba'], ['corte-perfil', 'cortes'],
  ['infantil-maquina', 'infantil'], ['espaco-retro', 'espaco'], ['barba-espuma', 'barba'], ['sobrancelha-contorno', 'sobrancelha'],
  ['corte-acabamento', 'cortes'], ['espaco-maquinas', 'espaco'], ['barba-toalha-escura', 'barba'], ['infantil-penteado', 'infantil'],
  ['corte-secador', 'cortes'], ['espaco-janela', 'espaco'], ['barba-tesoura', 'barba'], ['espaco-navalha', 'espaco'],
  ['infantil-pb', 'infantil'], ['espaco-cadeiras', 'espaco'], ['pai-filho', 'infantil'],
];

// Instagram: posts recentes (foto, legenda, curtidas e comentários) [EXEMPLO]
const instagram = [
  { foto: 'insta-1', legenda: 'Nuca limpa e degradê baixo para começar a semana.', curt: 214, com: 9 },
  { foto: 'insta-2', legenda: 'Pompadour com pincel de talco no fim. Clássico que não sai de moda.', curt: 388, com: 21 },
  { foto: 'insta-3', legenda: 'Contorno na navalha, linha reta de orelha a orelha.', curt: 176, com: 6 },
  { foto: 'insta-4', legenda: 'Máscara de argila na barboterapia de sexta.', curt: 251, com: 14 },
  { foto: 'insta-5', legenda: 'Pezinho entre um corte e outro: 15 minutos e você volta pro trabalho.', curt: 142, com: 4 },
  { foto: 'insta-6', legenda: 'Pente e tesoura para tirar só o volume de cima.', curt: 297, com: 11 },
];

const faq = [
  ['Preciso agendar ou posso chegar sem horário?', 'Agendar garante a cadeira e o barbeiro que você quer. Sem horário, atendemos se houver cadeira livre; sábado à tarde costuma ter espera.'],
  ['Quanto tempo leva um corte?', 'De 30 a 45 minutos, conforme o serviço. Corte e barba leva cerca de 1h15 e o Ritual Cobre, 1h40. A duração aparece em cada serviço e no resumo do agendamento.'],
  ['Posso escolher o barbeiro?', 'Pode. No agendamento, depois do serviço, aparecem só os barbeiros que fazem aquele serviço e os dias em que cada um está na casa. Se não tiver preferência, mostramos o primeiro horário livre.'],
  ['Vocês fazem barba com toalha quente?', 'Fazemos em toda barba com navalha, e a barboterapia tem duas toalhas quentes, vapor e máscara. A navalha é descartável e aberta na sua frente.'],
  ['Atendem crianças?', 'Sim, até 12 anos no corte infantil, com assento alto e desenho na tela. O primeiro corte tem mecha guardada e foto para a família. O pai pode cortar ao lado no pacote Pai e filho.'],
  ['E se eu me atrasar ou precisar cancelar?', 'Toleramos 15 minutos. Depois disso o serviço pode ser reduzido para caber no horário ou remarcado. Cancelar ou remarcar até 24 horas antes não custa nada. [JURÍDICO]'],
  ['Quais formas de pagamento vocês aceitam?', 'Pix, débito e crédito. Pacotes em até 2 vezes sem juros no crédito. A pigmentação tem valor a partir de R$ 50 e é fechada no espelho, antes de começar.'],
  ['Tem estacionamento?', 'Não temos estacionamento próprio. Há vagas de Estar na Alameda Dom Pedro II e um estacionamento conveniado na esquina, com 1 hora grátis para clientes. [EXEMPLO]'],
];

// carrossel da capa (troca sozinho): uma foto por serviço principal
const capaSlides = [
  { foto: 'corte-degrade', rotulo: 'Cabelo', pos: '50% 45%' },
  { foto: 'capa', rotulo: 'Barba', pos: '50% 40%' },
  { foto: 'sobrancelha-navalha', rotulo: 'Sobrancelha', pos: '68% 30%' },
];

const bairros = ['Batel', 'Bigorrilho', 'Centro', 'Água Verde', 'Mercês', 'Seminário'];

// descrição das fotos (alt). Fotos reais do Unsplash, créditos em img/creditos.json
const fotos = {
  capa: 'Barbeiro de luvas pretas aparando com máquina a barba de um cliente reclinado na cadeira',
  'sobre-navalha': 'Barbeiro de camisa branca passando navalha na barba de um cliente mais velho, numa barbearia de madeira escura',
  'espaco-salao': 'Salão da barbearia com fileira de cadeiras de couro, espelhos e estantes iluminadas',
  'corte-tesoura': 'Barbeiro cortando com tesoura e pente a lateral do cabelo de um cliente',
  'corte-maquina': 'Barbeiro passando a máquina na nuca de um cliente loiro',
  'corte-degrade': 'Barbeiro tatuado fazendo degradê com máquina na nuca de um cliente',
  'corte-pente': 'Barbeiro usando pente e tesoura na lateral do cabelo de um cliente de barba',
  'corte-secador': 'Barbeiro de luvas secando o cabelo de um cliente de barba ruiva num salão com espelhos iluminados',
  'corte-acabamento': 'Barbeiro de boné acertando o contorno da testa de um cliente de corte curto',
  'corte-risco': 'Cliente de costas com degradê e riscos desenhados na lateral',
  'corte-perfil': 'Barbeiro passando a máquina na lateral do cabelo de um cliente de barba cheia',
  'barba-navalha': 'Barbeiro passando navalha no pescoço de um cliente reclinado, em luz baixa',
  'barba-tesoura': 'Barbeiro tatuado aparando com tesoura a barba de um cliente de capa listrada',
  'barba-espuma': 'Cliente sorrindo com espuma de barbear no rosto enquanto o barbeiro prepara a navalha',
  'barba-toalha': 'Barbeiro pressionando a toalha quente no rosto de um cliente',
  'barba-toalha-escura': 'Barbeiro ajeitando a toalha escura sobre os olhos de um cliente reclinado',
  'barba-pincel': 'Barbeiro espalhando espuma com pincel na barba de um cliente reclinado',
  'barba-luvas': 'Barbeiro de luvas finalizando a barba de um cliente deitado na cadeira',
  'barba-pb': 'Barbeiro aparando a barba de um cliente reclinado, com toalha quente sobre os olhos',
  'sobrancelha-navalha': 'Barbeiro de luvas acertando com navalha a sobrancelha de um cliente reclinado na cadeira',
  'sobrancelha-contorno': 'Barbeiro de luvas azuis acertando com navalha o contorno do rosto de um cliente',
  'acabamento-nuca': 'Barbeiro tatuado fazendo o acabamento na navalha atrás da orelha de um cliente',
  'infantil-capa': 'Menino de cabelo cacheado na cadeira do barbeiro, de capa vermelha',
  'infantil-pb': 'Barbeiro cortando o cabelo de um menino na cadeira da barbearia',
  'infantil-penteado': 'Menino sorrindo na cadeira do barbeiro no primeiro corte',
  'infantil-maquina': 'Barbeiro de camisa branca aparando o cabelo de um menino com máquina',
  'pai-filho': 'Pai sentado na cadeira do barbeiro brincando com o filho antes do corte',
  'espaco-cadeira': 'Cadeira de barbeiro vermelha num ambiente de madeira com quadros antigos',
  'espaco-cadeiras': 'Cadeiras de barbeiro de couro vermelho enfileiradas',
  'espaco-espelhos': 'Salão claro com cadeiras de barbeiro e espelhos de moldura de madeira',
  'espaco-retro': 'Cadeira de barbeiro antiga num cantinho com quadros e piso de ladrilho',
  'espaco-maquinas': 'Máquinas de cortar cabelo penduradas em ganchos na parede',
  'espaco-janela': 'Barbearia antiga com luz de janela sobre a cadeira',
  'espaco-navalha': 'Navalha e pincel de barbear sobre a bancada',
  'barbeiro-1': 'Otávio Brandt, barbeiro de touca e barba, concentrado no corte',
  'barbeiro-2': 'Henrique Lacerda, barbeiro de chapéu e suspensório, cortando o cabelo de um cliente',
  'barbeiro-3': 'Jefferson Moura, barbeiro de luvas, cortando o cabelo cacheado de um cliente',
  'barbeiro-4': 'Rodrigo Kuster, barbeiro de boné, passando a máquina no cabelo de um cliente',
  'barbeiro-acao': 'Dois barbeiros atendendo clientes lado a lado no salão',
  'insta-1': 'Barbeiro de luvas laranja passando máquina na nuca de um cliente tatuado',
  'insta-2': 'Barbeiro tatuado finalizando o topete de um cliente com pincel',
  'insta-3': 'Barbeiro fazendo o contorno do cabelo com navalha',
  'insta-4': 'Cliente com máscara escura no rosto durante a barboterapia',
  'insta-5': 'Barbeiro passando máquina atrás da orelha de um cliente',
  'insta-6': 'Barbeiro cortando com pente e tesoura o cabelo de um cliente',
};

module.exports = { capaSlides, marca, horarios, abertura, horarioCurto, segmentos, servicos, pacotes, equipe, depoimentos, galeriaCats, galeria, instagram, faq, bairros, fotos };
