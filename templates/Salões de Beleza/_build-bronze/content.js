// Conteúdo do Bronze de barbearia (Mecha Barbearia, o lado barbearia da marca fictícia Mecha Salão & Barbearia).
// Landing page de uma página. Trocar aqui textos, preços, equipe e horários e rodar o build.

const marca = {
  nome: 'Mecha',
  completo: 'Mecha Barbearia',
  casa: 'Mecha Salão & Barbearia',
  frase: 'Barbearia com hora marcada na Vila Madalena. Corte, barba e acabamento na navalha, com preço combinado antes de começar.',
  razao: 'Mecha Beleza e Barbearia Ltda.',
  cnpj: '47.318.552/0001-09',
  rua: 'Rua Harmonia, 512',
  endereco: 'Rua Harmonia, 512',
  bairro: 'Vila Madalena',
  cidade: 'São Paulo',
  uf: 'SP',
  cep: '05435-000',
  telefone: '(11) 3031-4826',
  whatsapp: '5511973152640',
  whatsappTexto: '(11) 97315-2640',
  email: 'barbearia@mechasalao.com.br',
  instagram: 'https://instagram.com/mecha.salao',
  instagramUser: '@mecha.salao',
  facebook: 'https://facebook.com/mecha.salao',
  linkedin: 'https://linkedin.com/company/mecha-salao',
  dominio: 'https://mechasalao.com.br/barbearia',
  nota: 4.9,
  avaliacoes: 1240,
  desde: 2019,
};

// [dia, horário]; o índice segue getDay() (0 = domingo)
const horarios = [
  ['Domingo', 'Fechado'],
  ['Segunda', '10h às 20h'],
  ['Terça', '9h às 20h'],
  ['Quarta', '9h às 20h'],
  ['Quinta', '9h às 21h'],
  ['Sexta', '9h às 21h'],
  ['Sábado', '9h às 18h'],
];
const abertura = { 0: null, 1: [10, 20], 2: [9, 20], 3: [9, 20], 4: [9, 21], 5: [9, 21], 6: [9, 18] };
const horarioCurto = 'Seg, 10h às 20h. Ter a sex, 9h às 20h (qui e sex até 21h). Sáb, 9h às 18h';

// serviços: min = duração; de = preço "a partir de"; quimica = pede teste de sensibilidade antes
const servicos = [
  { id: 'corte', nome: 'Corte masculino', inclui: 'Tesoura ou máquina, lavagem e finalização com pomada.', min: 40, preco: 65 },
  { id: 'degrade', nome: 'Degradê na navalha', inclui: 'Fade do zero ao comprimento que você quiser, acabamento na navalha.', min: 45, preco: 75 },
  { id: 'barba', nome: 'Barba com toalha quente', inclui: 'Toalha quente, óleo pré-barba, navalha descartável e balm.', min: 30, preco: 50 },
  { id: 'desenho', nome: 'Desenho de barba', inclui: 'Contorno e linhas na navalha, sem aparar o volume.', min: 20, preco: 30 },
  { id: 'sobrancelha', nome: 'Sobrancelha masculina', inclui: 'Limpeza na pinça ou navalha, sem afinar o desenho natural.', min: 15, preco: 25 },
  { id: 'pigmentacao', nome: 'Pigmentação de barba', inclui: 'Preenche falhas e uniformiza a cor. Teste de sensibilidade antes.', min: 30, preco: 45, de: true, quimica: true },
  { id: 'infantil', nome: 'Corte infantil', inclui: 'Até 12 anos, com paciência e sem pressa.', min: 30, preco: 50 },
  { id: 'combo', nome: 'Corte e barba', inclui: 'Corte masculino e barba com toalha quente na mesma cadeira. Separados sairiam R$ 115.', min: 70, preco: 105, destaque: true },
];

// equipe: agenda por dia da semana (getDay) com [entrada, saída]; faz = ids de serviços que atende
const equipe = [
  { id: 'rafael', nome: 'Rafael Duarte', cargo: 'Barbeiro', esp: 'Degradê na navalha e barba', foto: 'barbeiro-rafael', faz: ['corte', 'degrade', 'barba', 'desenho', 'sobrancelha', 'combo'], agenda: { 1: [10, 20], 2: [10, 20], 3: [10, 20], 4: [10, 20], 5: [10, 20], 6: [9, 15] } },
  { id: 'thiago', nome: 'Thiago Sena', cargo: 'Barbeiro', esp: 'Pigmentação e corte infantil', foto: 'barbeiro-thiago', faz: ['corte', 'barba', 'sobrancelha', 'pigmentacao', 'infantil', 'combo'], agenda: { 1: [12, 20], 3: [11, 20], 4: [11, 21], 5: [11, 21], 6: [9, 18] } },
  { id: 'diego', nome: 'Diego Amaral', cargo: 'Barbeiro', esp: 'Cortes na tesoura e barba cheia', foto: 'barbeiro-diego', faz: ['corte', 'barba', 'desenho', 'combo'], agenda: { 2: [9, 18], 3: [9, 18], 4: [12, 21], 5: [12, 21], 6: [9, 18] } },
  { id: 'caio', nome: 'Caio Ribeiro', cargo: 'Barbeiro', esp: 'Degradê, risco e desenho de barba', foto: 'barbeiro-caio', faz: ['corte', 'degrade', 'desenho', 'sobrancelha', 'infantil', 'combo'], agenda: { 1: [10, 19], 2: [11, 20], 4: [9, 18], 5: [9, 18], 6: [10, 18] } },
];

// avaliações (fictícias, no formato das do Google)
const depoimentos = [
  { texto: 'Foi o primeiro barbeiro que perguntou como eu penteio o cabelo antes de ligar a máquina.', nome: 'Lucas F.', serv: 'Degradê com o Rafael', foto: 'l12' },
  { texto: 'Tinha uma falha na barba que me incomodava há anos. Ficou natural, e ele fez o teste antes sem eu pedir.', nome: 'André L.', serv: 'Pigmentação com o Thiago', foto: 'l14' },
  { texto: 'Horário cumprido, toalha quente de verdade e preço igual ao do site. Virei cliente de quinze em quinze dias.', nome: 'Bruno T.', serv: 'Corte e barba com o Diego', foto: 'l9' },
];

// colunas de fotos que passam sobre a frase (avaliações)
const colunas = [
  ['corte-m', 'kids', 'sobrancelha'],
  ['navalha', 'corte-m2', 'depois-barba'],
  ['l10', 'l12', 'l9'],
];

// políticas (obrigatório em todos os níveis), no lugar do blog da referência
const politicas = [
  { tipo: 'Agendamento', titulo: 'Horário confirmado em até uma hora', texto: 'Peça pelo site, WhatsApp ou telefone. Confirmamos em até uma hora no horário de funcionamento e lembramos na véspera. Sem hora marcada, só se houver cadeira livre.', foto: 'corte-m4' },
  { tipo: 'Atraso e cancelamento', titulo: '15 minutos de tolerância, 24 horas para remarcar', texto: 'Depois de 15 minutos o serviço pode ser reduzido para caber no horário ou remarcado. Cancelar ou remarcar até 24 horas antes não custa nada. Duas faltas sem aviso pedem sinal de 30% via Pix nos próximos horários.', foto: 'corte-m3' },
  { tipo: 'Garantia', titulo: 'Ajuste sem custo em até 7 dias', texto: 'Se o corte ou a barba não ficaram como combinado no espelho, volte em até 7 dias que o mesmo barbeiro ajusta. A garantia não cobre mudança de ideia sobre o resultado combinado.', foto: 'barba' },
  { tipo: 'Pigmentação e química', titulo: 'Teste de sensibilidade antes, sempre', destaque: true, texto: 'Pigmentação e qualquer produto químico só depois do teste de sensibilidade, feito com 48 horas de antecedência para quem nunca fez aqui. Avise alergias e medicamentos. Retoque de cor sem custo em até 15 dias, seguindo os cuidados passados no dia.', foto: 'pigmentacao' },
];
const higiene = [
  'Tesouras, pentes e pentes de máquina lavados e esterilizados em autoclave entre um cliente e outro.',
  'Navalha e lâmina descartáveis, abertas na sua frente. Capa de papel no pescoço e toalha limpa para cada pessoa.',
  'Pigmentos e produtos com registro ou notificação na Anvisa, dentro da validade.',
  'Cadeiras e bancadas limpas a cada atendimento. Licença sanitária municipal em dia.',
];
const pagamento = 'Pix, débito e crédito à vista. Combos e pigmentação em até 2 vezes sem juros no crédito. O valor "a partir de" da pigmentação depende da área a preencher e é fechado no espelho, antes de começar.';

const bairros = ['Vila Madalena', 'Pinheiros', 'Sumarezinho', 'Alto de Pinheiros', 'Perdizes', 'Vila Beatriz'];

// descrição das fotos (alt)
const fotos = {
  l13: 'Homem de barba cheia e risco no cabelo, de perfil, sobre fundo escuro',
  'barba-tesoura': 'Barbeiro de luvas pretas aparando a barba de um cliente com tesoura e pente, cliente reclinado na cadeira',
  'corte-m4': 'Barbeiro passando a máquina na nuca de um cliente',
  'corte-m3': 'Barbeiro fazendo degradê com máquina em cliente de capa listrada',
  'corte-m2': 'Barbeiro fazendo o corte com máquina na nuca do cliente',
  'corte-m': 'Barbeiro fazendo o acabamento do degradê com máquina',
  barba: 'Barbeiro aparando a barba de um cliente com tesoura e pente',
  navalha: 'Barbeiro passando navalha na barba com toalha sobre os olhos do cliente',
  'barba-toalha': 'Cliente com toalha quente no rosto durante a barba',
  sobrancelha: 'Barbeiro de luvas acertando a sobrancelha de um cliente',
  pigmentacao: 'Profissional aplicando pigmento com pincel no cabelo de um cliente',
  'depois-barba': 'Cliente de barba desenhada no formato do maxilar e degradê baixo',
  l10: 'Cliente de corte social com risco lateral e barba feita',
  l12: 'Cliente de degradê com topete e barba curta',
  l9: 'Cliente de topete com laterais baixas e barba por fazer',
  kids: 'Barbeiro tatuado cortando o cabelo de um menino',
  'espaco-equipe': 'O espaço da Mecha, com cadeiras de barbeiro e espelhos em arco iluminados',
  'barbeiro-rafael': 'Rafael Duarte, barbeiro, apoiado na cadeira de couro segurando a tesoura dourada diante do espelho redondo iluminado',
  'barbeiro-thiago': 'Thiago Sena, barbeiro, mostrando a tesoura para a câmera',
  'barbeiro-diego': 'Diego Amaral, barbeiro de barba ruiva, apontando a tesoura para a câmera',
  'barbeiro-caio': 'Caio Ribeiro, barbeiro tatuado, de braços cruzados sobre fundo azul',
};

module.exports = { marca, horarios, abertura, horarioCurto, servicos, equipe, depoimentos, colunas, politicas, higiene, pagamento, bairros, fotos };
