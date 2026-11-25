// Conteúdo do Gold de salão de beleza com barbearia (Mecha, marca fictícia).
// Para atender quem trabalha com só um ou dois serviços, basta trocar `ativo` dos segmentos abaixo e rodar o build:
// serviços, preços, fotos, equipe, planos, antes e depois, agenda e textos se ajustam sozinhos.

const segmentos = [
  // lado: 'salao' ou 'barbearia' (vira uma aba no cardápio; a aba some quando não há segmento ligado nela)
  { id: 'cortes', lado: 'salao', nome: 'Cortes femininos', curto: 'Cortes', ativo: true },
  { id: 'escova', lado: 'salao', nome: 'Escova e finalização', curto: 'Escova', ativo: true },
  { id: 'cor', lado: 'salao', nome: 'Coloração e mechas', curto: 'Cor', ativo: true },
  { id: 'quimica', lado: 'salao', nome: 'Tratamentos e químicas', curto: 'Química', ativo: true },
  { id: 'corte-m', lado: 'barbearia', nome: 'Corte masculino', curto: 'Corte', ativo: true },
  { id: 'barba', lado: 'barbearia', nome: 'Barba', curto: 'Barba', ativo: true },
  { id: 'sobrancelha', lado: 'barbearia', nome: 'Sobrancelha masculina', curto: 'Sobrancelha', ativo: true },
  { id: 'pigmentacao', lado: 'barbearia', nome: 'Pigmentação', curto: 'Pigmentação', ativo: true },
  { id: 'combos', lado: 'barbearia', nome: 'Combos', curto: 'Combos', ativo: true },
  { id: 'planos', lado: 'barbearia', nome: 'Planos mensais', curto: 'Planos', ativo: true },
];

const marca = {
  nome: 'Mecha',
  completo: 'Mecha Salão & Barbearia',
  frase: 'Salão e barbearia no mesmo endereço. Cabelo, barba e cor feitos com calma, preço combinado antes de começar.',
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
  email: 'ola@mechasalao.com.br',
  instagram: 'https://instagram.com/mecha.salao',
  instagramUser: '@mecha.salao',
  facebook: 'https://facebook.com/mecha.salao',
  linkedin: 'https://linkedin.com/company/mecha-salao',
  dominio: 'https://mechasalao.com.br',
  nota: 4.9,
  avaliacoes: 1240,
};

// [dia, horário]; o índice segue getDay() (0 = domingo)
const horarios = [
  ['Domingo', 'Fechado'],
  ['Segunda', '10h às 20h (só barbearia)'],
  ['Terça', '9h às 20h'],
  ['Quarta', '9h às 20h'],
  ['Quinta', '9h às 21h'],
  ['Sexta', '9h às 21h'],
  ['Sábado', '9h às 18h'],
];
const abertura = { 0: null, 1: [10, 20], 2: [9, 20], 3: [9, 20], 4: [9, 21], 5: [9, 21], 6: [9, 18] };

// serviços: min = duração; de = preço "a partir de" (depende do comprimento ou volume); foto = arquivo em img/fotos
const servicos = [
  // salão
  { id: 'corte-fem', seg: 'cortes', nome: 'Corte feminino', inclui: 'Conversa no espelho, lavagem, corte e finalização simples.', min: 60, preco: 120, de: true },
  { id: 'corte-longo', seg: 'cortes', nome: 'Corte e escova longa', inclui: 'Para cabelo abaixo do ombro: corte em camadas e escova modelada.', min: 90, preco: 165, de: true },
  { id: 'franja', seg: 'cortes', nome: 'Franja e pontas', inclui: 'Acerto de franja ou só das pontas, sem lavagem.', min: 20, preco: 45 },
  { id: 'escova-lisa', seg: 'escova', nome: 'Escova lisa', inclui: 'Lavagem com xampu da linha da casa, protetor térmico e escova.', min: 45, preco: 70, de: true },
  { id: 'escova-mod', seg: 'escova', nome: 'Escova modelada', inclui: 'Ondas com escova redonda ou babyliss, finalização com brilho.', min: 60, preco: 95, de: true },
  { id: 'hidra-escova', seg: 'escova', nome: 'Hidratação e escova', inclui: 'Máscara de tratamento com vapor e escova no fim.', min: 75, preco: 140, de: true },
  { id: 'raiz', seg: 'cor', nome: 'Coloração de raiz', inclui: 'Teste de mecha, cor na raiz até 3 cm, lavagem e secagem.', min: 90, preco: 180, de: true, quimica: true },
  { id: 'mechas', seg: 'cor', nome: 'Mechas e balayage', inclui: 'Diagnóstico, teste de mecha, clareamento à mão livre, tonalização e escova.', min: 240, preco: 480, de: true, quimica: true },
  { id: 'gloss', seg: 'cor', nome: 'Tonalização (gloss)', inclui: 'Corrige o tom e devolve o brilho entre uma mecha e outra.', min: 60, preco: 150, de: true, quimica: true },
  { id: 'progressiva', seg: 'quimica', nome: 'Alinhamento sem formol', inclui: 'Teste de mecha, produto com registro na Anvisa e escova de selagem.', min: 180, preco: 350, de: true, quimica: true },
  { id: 'reconstrucao', seg: 'quimica', nome: 'Reconstrução', inclui: 'Tratamento para fio quebradiço depois de química ou descoloração.', min: 60, preco: 130 },
  // barbearia
  { id: 'corte-masc', seg: 'corte-m', nome: 'Corte masculino', inclui: 'Tesoura ou máquina, lavagem e finalização com pomada.', min: 40, preco: 65 },
  { id: 'degrade', seg: 'corte-m', nome: 'Degradê na navalha', inclui: 'Fade do zero ao comprimento que você quiser, acabamento na navalha.', min: 45, preco: 75 },
  { id: 'infantil', seg: 'corte-m', nome: 'Corte infantil', inclui: 'Até 12 anos, com paciência e sem pressa.', min: 30, preco: 50 },
  { id: 'barba', seg: 'barba', nome: 'Barba com toalha quente', inclui: 'Toalha quente, óleo pré-barba, navalha descartável e balm.', min: 30, preco: 50 },
  { id: 'barba-desenho', seg: 'barba', nome: 'Desenho de barba', inclui: 'Contorno e linhas na navalha, sem aparar o volume.', min: 20, preco: 30 },
  { id: 'sobrancelha', seg: 'sobrancelha', nome: 'Sobrancelha masculina', inclui: 'Limpeza na pinça ou navalha, sem afinar o desenho natural.', min: 15, preco: 25 },
  { id: 'pig-barba', seg: 'pigmentacao', nome: 'Pigmentação de barba', inclui: 'Preenche falhas e uniformiza a cor. Teste de sensibilidade antes.', min: 30, preco: 45, de: true, quimica: true },
  { id: 'pig-cabelo', seg: 'pigmentacao', nome: 'Pigmentação capilar', inclui: 'Disfarça entradas e falhas no degradê. Teste de sensibilidade antes.', min: 40, preco: 60, de: true, quimica: true },
  { id: 'combo-cb', seg: 'combos', nome: 'Corte e barba', inclui: 'Corte masculino e barba com toalha quente na mesma cadeira.', min: 70, preco: 105, antes: 115 },
  { id: 'combo-cbs', seg: 'combos', nome: 'Corte, barba e sobrancelha', inclui: 'O pacote completo, com o mesmo barbeiro do começo ao fim.', min: 80, preco: 125, antes: 140 },
  { id: 'combo-dp', seg: 'combos', nome: 'Degradê e pigmentação', inclui: 'Fade na navalha com pigmentação para fechar o desenho.', min: 75, preco: 125, antes: 135 },
];

// categorias do cardápio (sanfona), na ordem em que aparecem
const categorias = [
  { seg: 'cortes', titulo: 'Cortes', tags: ['Camadas', 'Chanel', 'Franja'], foto: 'corte-f', texto: 'Corte pensado para o jeito que você usa o cabelo no dia a dia, não só para a foto da saída.' },
  { seg: 'escova', titulo: 'Escova', tags: ['Lisa', 'Modelada', 'Ondas'], foto: 'escova', texto: 'Escova com protetor térmico sempre, do liso polido às ondas que duram até a próxima lavagem.' },
  { seg: 'cor', titulo: 'Cor e mechas', tags: ['Balayage', 'Raiz', 'Gloss'], foto: 'coloracao', texto: 'Toda química começa com teste de mecha e diagnóstico do fio. O valor final sai antes de abrir o primeiro pote.' },
  { seg: 'quimica', titulo: 'Tratamentos', tags: ['Alinhamento', 'Reconstrução'], foto: 'lavatorio', texto: 'Só produtos com registro na Anvisa e sem formol acima do permitido. A ficha de cada química fica guardada.' },
  { seg: 'corte-m', titulo: 'Corte masculino', tags: ['Degradê', 'Tesoura', 'Infantil'], foto: 'corte-m', texto: 'Do social ao degradê marcado, com o acabamento na navalha e a finalização que você consegue repetir em casa.' },
  { seg: 'barba', titulo: 'Barba', tags: ['Toalha quente', 'Navalha', 'Desenho'], foto: 'navalha', texto: 'Toalha quente, navalha descartável a cada cliente e o desenho que acompanha o formato do rosto.' },
  { seg: 'sobrancelha', titulo: 'Sobrancelha', tags: ['Pinça', 'Navalha'], foto: 'sobrancelha', texto: 'Limpeza discreta, sem afinar. A ideia é parecer que você nasceu assim.' },
  { seg: 'pigmentacao', titulo: 'Pigmentação', tags: ['Barba', 'Couro cabeludo'], foto: 'pigmentacao', texto: 'Disfarça falhas na barba e no degradê com pigmento próprio para pele, sempre depois do teste de sensibilidade.' },
  { seg: 'combos', titulo: 'Combos', tags: ['Corte e barba', 'Completo'], foto: 'barba-toalha', texto: 'Os serviços que mais saem juntos, com valor menor do que separados.' },
];

// galeria de colunas que abrem (logo depois do espaço)
const colunas = [
  { seg: 'corte-m', foto: 'corte-m3', titulo: 'Degradê', texto: 'Fade feito à mão, do zero à tesoura.' },
  { seg: 'escova', foto: 'escova3', titulo: 'Escova', texto: 'Liso polido ou ondas que duram a semana.' },
  { seg: 'cor', foto: 'mechas', titulo: 'Mechas', texto: 'Clareado à mão livre, cresce sem marcar.' },
  { seg: 'barba', foto: 'barba', titulo: 'Barba', texto: 'Toalha quente e navalha descartável.' },
  { seg: 'cortes', foto: 'corte-f2', titulo: 'Camadas', texto: 'Movimento para cabelo abaixo do ombro.' },
  { seg: 'pigmentacao', foto: 'pigmentacao', titulo: 'Pigmentação', texto: 'Fecha falhas na barba e no degradê.' },
];

// faixa corrida da capa
const faixa = [
  ['corte-m', 'Degradê na navalha'], ['escova', 'Escova modelada'], ['cor', 'Balayage'], ['barba', 'Barba com toalha quente'],
  ['cortes', 'Corte em camadas'], ['sobrancelha', 'Sobrancelha masculina'], ['pigmentacao', 'Pigmentação'], ['quimica', 'Alinhamento sem formol'], ['corte-m', 'Corte infantil'],
];

// quatro motivos (cartões que se empilham)
const motivos = [
  { titulo: 'Conversa antes da tesoura', texto: 'Toda visita começa com dez minutos no espelho. Combinamos o resultado, o tempo e o valor antes de começar, e nada muda sem você saber.', tags: ['Formato do rosto', 'Tipo de fio', 'Preço fechado'], foto: 'espaco-equipe' },
  { ambos: true, titulo: 'Salão e barbearia no mesmo piso', texto: 'Escova de um lado, degradê do outro, o mesmo café e a mesma recepção. Dá para marcar o casal, a família ou só você.', tags: ['Cabeleireiras', 'Barbeiros', 'Coloristas'], foto: 'capa' },
  { titulo: 'Material limpo de verdade', texto: 'Tesouras, pentes e alicates passam por limpeza e autoclave entre um cliente e outro. Navalha, lâmina e capa de papel são descartáveis.', tags: ['Autoclave', 'Lâmina descartável', 'Produtos com registro'], foto: 'produtos2' },
  { titulo: 'Sem pressa na cadeira', texto: 'Agenda com folga entre horários para ninguém ser atendido correndo. Wi-Fi, café passado na hora e música baixa.', tags: ['Horário marcado', 'Café', 'Wi-Fi'], foto: 'escova', fotoBarbearia: 'corte-m' },
];

// antes e depois (fotos de representação até o cliente ter as próprias, com autorização de imagem)
const transformacoes = [
  { seg: 'cor', aba: 'Morena para mechas', antes: 'antes-mechas', depois: 'depois-mechas', titulo: 'Do castanho às mechas iluminadas', texto: 'Balayage feito à mão livre em duas etapas, com tonalização bege para não amarelar.', servico: 'Mechas e balayage, tonalização', tempo: '4h30', prof: 'carla' },
  { seg: 'barba', aba: 'Barba desenhada', antes: 'antes-barba', depois: 'depois-barba', titulo: 'Do volume solto ao contorno marcado', texto: 'Barba aparada no formato do maxilar, linhas na navalha e degradê baixo para combinar.', servico: 'Degradê e barba com toalha quente', tempo: '70 min', prof: 'rafael' },
  { seg: 'escova', aba: 'Escova lisa', antes: 'antes-escova', depois: 'depois-escova', titulo: 'Dos cachos ao liso de escova', texto: 'Escova lisa com protetor térmico, sem química. Na próxima lavagem os cachos voltam como eram.', servico: 'Hidratação e escova', tempo: '75 min', prof: 'beatriz' },
];

// equipe: agenda por dia da semana (getDay) com [entrada, saída] ou null; faz = segmentos que atende
const equipe = [
  { id: 'carla', nome: 'Carla Menezes', cargo: 'Colorista', esp: 'Mechas, balayage e correção de cor', foto: 'carla', faz: ['cor', 'quimica', 'escova'], agenda: { 2: [10, 19], 3: [10, 19], 4: [10, 21], 5: [10, 21], 6: [9, 17] } },
  { id: 'beatriz', nome: 'Beatriz Alves', cargo: 'Cabeleireira', esp: 'Cortes em camadas, escova e ondas', foto: 'beatriz', faz: ['cortes', 'escova', 'quimica'], agenda: { 2: [9, 18], 3: [9, 18], 4: [12, 21], 5: [12, 21], 6: [9, 18] } },
  { id: 'rafael', nome: 'Rafael Duarte', cargo: 'Barbeiro', esp: 'Degradê na navalha e barba', foto: 'rafael', faz: ['corte-m', 'barba', 'sobrancelha', 'combos', 'planos'], agenda: { 1: [10, 20], 2: [10, 20], 3: [10, 20], 4: [10, 20], 5: [10, 20], 6: [9, 15] } },
  { id: 'thiago', nome: 'Thiago Sena', cargo: 'Barbeiro', esp: 'Pigmentação, sobrancelha e corte infantil', foto: 'thiago', faz: ['corte-m', 'barba', 'sobrancelha', 'pigmentacao', 'combos', 'planos'], agenda: { 1: [12, 20], 3: [11, 20], 4: [11, 21], 5: [11, 21], 6: [9, 18] } },
];

// a visita em quatro momentos (rolagem lateral)
const visita = [
  { titulo: 'Marque', texto: 'Escolha serviço, profissional e horário aqui no site ou pelo WhatsApp. Confirmamos em até uma hora.', tempo: '2 minutos', foto: 'recepcao' },
  { titulo: 'Converse', texto: 'Dez minutos no espelho para combinar o resultado, o tempo e o valor. Química só depois do teste de mecha.', tempo: '10 minutos', foto: 'espaco-equipe' },
  { titulo: 'Relaxe', texto: 'Seu profissional trabalha enquanto você toma um café. Nada de pressa, nada de surpresa no fim.', tempo: '20 min a 4h30', foto: 'capa' },
  { titulo: 'Leve para casa', texto: 'Dica de finalização, os produtos certos para o seu fio e a data sugerida da próxima visita.', tempo: '5 minutos', foto: 'produtos3' },
];

// planos mensais da barbearia
const planos = [
  { id: 'corte', nome: 'Plano Corte', mensal: 109, inclui: ['2 cortes por mês', 'Acabamento do pezinho quando quiser', '10% nos produtos'], seg: 'corte-m' },
  { id: 'corte-barba', nome: 'Plano Corte e Barba', mensal: 189, inclui: ['2 cortes e 4 barbas por mês', 'Sobrancelha inclusa', '10% nos produtos', 'Horário preferencial de seg a qui'], seg: 'barba', destaque: true },
  { id: 'livre', nome: 'Plano Livre', mensal: 249, inclui: ['Corte e barba toda semana', 'Sobrancelha e pigmentação de barba', '15% nos produtos e serviços do salão', 'Horário preferencial'], seg: 'barba' },
];
const planosRegras = [
  'Cobrança mensal no cartão de crédito, sem taxa de adesão.',
  'Sem fidelidade: cancele quando quiser com 30 dias de aviso.',
  'Plano pessoal e intransferível. Visitas não usadas não acumulam para o mês seguinte.',
  'O horário continua marcado pela agenda, com as mesmas regras de atraso e cancelamento.',
];

// avaliações (fictícias, no formato das do Google)
const depoimentos = [
  { nome: 'Lucas Ferreira', serv: 'Degradê e barba com o Rafael', texto: 'Já passei por muita barbearia. O Rafael foi o primeiro que perguntou como eu penteio o cabelo antes de ligar a máquina.', foto: 'l12' },
  { nome: 'Mariana Costa', serv: 'Balayage com a Carla', texto: 'A Carla testou, explicou o porquê de cada etapa e acertou o tom. Três meses depois a raiz cresceu e ninguém percebe a marca.', foto: 'l4' },
  { nome: 'Juliana Prado', serv: 'Escova modelada com a Beatriz', texto: 'Marquei a escova e o corte do meu marido no mesmo horário. Saímos juntos, cada um do seu lado do salão.', foto: 'l6' },
  { nome: 'André Lopes', serv: 'Pigmentação com o Thiago', texto: 'Tinha uma falha na barba que me incomodava há anos. Ficou natural, e ele fez o teste antes sem eu pedir.', foto: 'l14' },
];
const curtos = [
  ['O melhor degradê da Vila', 'Lucas F.'], ['Minha cor nunca ficou tão bonita', 'Mariana C.'], ['Eles escutam de verdade', 'Paula R.'],
  ['Corte infantil sem choro', 'Renata M.'], ['Barba impecável', 'Diego A.'], ['Valeu cada minuto', 'Bruno T.'], ['Calmos, gentis e caprichosos', 'Ana L.'],
];

// lookbook em arco (as fotos dos clientes entram aqui com autorização de imagem)
const lookbook = ['l1', 'l9', 'l2', 'l10', 'l3', 'l13', 'l4', 'l11', 'l5', 'l14', 'l6', 'l12', 'l7', 'l15', 'l8', 'l20'];

// políticas (obrigatório em todos os níveis)
const politicas = [
  { titulo: 'Agendamento', texto: 'Horário marcado pelo site, WhatsApp ou telefone. Confirmamos em até uma hora no horário de funcionamento e lembramos na véspera. Serviços de cor e química acima de R$ 300 pedem sinal de 30% via Pix, abatido no valor final.' },
  { titulo: 'Atraso', texto: 'Tolerância de 15 minutos. Depois disso o serviço pode ser reduzido para caber no horário ou remarcado, conforme a agenda do profissional.' },
  { titulo: 'Cancelamento e remarcação', texto: 'Sem custo até 24 horas antes, pelo WhatsApp. Com menos de 24 horas, o sinal fica como crédito para uma nova data em até 60 dias. Duas faltas sem aviso pedem sinal nos próximos agendamentos.' },
  { titulo: 'Garantia dos serviços', texto: 'Cortes e escovas: ajuste sem custo em até 7 dias se algo não ficou como combinado. Coloração e mechas: retoque de tom sem custo em até 15 dias, seguindo os cuidados passados no dia.', destaque: true },
  { titulo: 'Coloração e químicas', texto: 'Teste de mecha e de sensibilidade obrigatórios, feitos com 48 horas de antecedência para quem nunca fez química aqui. Diagnóstico do fio por escrito. Podemos recusar o serviço se o fio não aguentar, e a decisão é explicada.', destaque: true },
  { titulo: 'Pagamento', texto: 'Pix, débito e crédito em até 3 vezes sem juros a partir de R$ 300. Os valores "a partir de" dependem do comprimento e do volume e são fechados na conversa antes do serviço.' },
];
const higiene = [
  'Tesouras, pentes, alicates e pentes de máquina lavados e esterilizados em autoclave entre um cliente e outro.',
  'Navalha e lâmina descartáveis, abertas na sua frente. Capa de papel no pescoço e toalha limpa para cada pessoa.',
  'Produtos de cor, química e pigmentação com registro ou notificação na Anvisa, dentro da validade.',
  'Bancadas e cadeiras limpas a cada atendimento. Licença sanitária municipal em dia.',
];

const pagamento = ['Pix', 'Débito', 'Crédito em até 3x', 'Plano mensal'];

const faq = [
  ['O preço muda se for homem ou mulher?', 'Não. O valor depende do serviço, do comprimento e do volume do cabelo e do tempo que leva. Nunca do gênero de quem senta na cadeira.'],
  ['Como faço para marcar?', 'Pelo formulário no fim desta página, pelo WhatsApp ou por telefone. Você escolhe o profissional ou deixa sem preferência e a gente encaixa no primeiro horário livre.'],
  ['Vocês atendem sem hora marcada?', 'Na barbearia sim, quando há cadeira livre. No salão só com horário, porque cor e escova precisam de tempo reservado.'],
  ['Quanto tempo leva uma coloração?', 'Raiz leva cerca de uma hora e meia. Mechas e balayage, de três horas e meia a quatro horas e meia, já com a escova. Combinamos o tempo na conversa.'],
  ['Preciso fazer teste antes da química?', 'Sim, sempre. Teste de mecha para cor e alinhamento, e de sensibilidade para pigmentação. Para quem nunca fez química aqui, ele é feito com 48 horas de antecedência.'],
  ['Quais produtos vocês usam?', 'Linhas profissionais com registro na Anvisa, escolhidas para cada tipo de fio. Se quiser levar para casa, o profissional explica como usar.'],
  ['Qual é a política de cancelamento?', 'Sem custo até 24 horas antes. Com menos tempo, o sinal vira crédito para outra data em até 60 dias.'],
];

const bairros = ['Vila Madalena', 'Pinheiros', 'Sumarezinho', 'Alto de Pinheiros', 'Perdizes', 'Vila Beatriz'];

// descrição das fotos (alt)
const fotos = {
  capa: 'Barbeiro cortando o cabelo de um cliente no salão da Mecha, com espelhos em arco iluminados',
  'espaco-equipe': 'Salão com cabeleireira aplicando papel alumínio em uma cliente e barbeiro aparando a barba de outro cliente',
  escova: 'Cabeleireira fazendo escova com secador e escova redonda em uma cliente diante do espelho em arco',
  'corte-f': 'Cabeleireira separando mechas de uma cliente para o corte',
  'corte-f2': 'Mulher de perfil com cabelo longo em camadas e ondas',
  'corte-m': 'Barbeiro fazendo o acabamento do degradê com máquina',
  'corte-m3': 'Barbeiro fazendo degradê com máquina em cliente de capa listrada',
  barba: 'Barbeiro aparando a barba de um cliente com tesoura e pente',
  navalha: 'Barbeiro passando navalha na barba com toalha sobre os olhos do cliente',
  'barba-toalha': 'Cliente com toalha quente no rosto durante a barba',
  sobrancelha: 'Barbeiro de luvas acertando a sobrancelha de um cliente',
  pigmentacao: 'Profissional aplicando pigmento com pincel no cabelo de um cliente',
  coloracao: 'Colorista aplicando tinta com pincel sobre papel alumínio',
  mechas: 'Duas mulheres de costas com mechas loiras e ondas',
  escova3: 'Cabeleireira fazendo escova com secador e escova de cerdas',
  lavatorio: 'Cliente no lavatório recebendo lavagem com xampu',
  produtos: 'Frascos âmbar de xampu e condicionador sobre a bancada',
  produtos3: 'Frasco de xampu e conta-gotas de óleo sobre uma prateleira branca',
  recepcao: 'Balcão da recepção do salão com prateleira de produtos',
  'antes-mechas': 'Antes: cabelo castanho escuro ondulado visto de costas',
  'depois-mechas': 'Depois: cabelo com mechas loiras e ondas visto de costas',
  'antes-barba': 'Antes: cliente de barba cheia e volume solto',
  'depois-barba': 'Depois: barba desenhada no formato do maxilar e degradê baixo',
  'antes-escova': 'Antes: mulher de cabelo cacheado volumoso',
  'depois-escova': 'Depois: mulher de cabelo liso de escova',
  carla: 'Carla Menezes, colorista, sentada na cadeira do salão',
  beatriz: 'Beatriz Alves, cabeleireira, segurando o secador',
  rafael: 'Rafael Duarte, barbeiro, de braços cruzados na barbearia',
  thiago: 'Thiago Sena, barbeiro, cortando o cabelo de um cliente',
};

const responsavel = { nome: 'Carla Menezes', cargo: 'Colorista e responsável técnica pelos produtos químicos' };

module.exports = {
  segmentos, marca, horarios, abertura, servicos, categorias, colunas, faixa, motivos, transformacoes, equipe, visita,
  planos, planosRegras, depoimentos, curtos, lookbook, politicas, higiene, pagamento, faq, bairros, fotos, responsavel,
};
