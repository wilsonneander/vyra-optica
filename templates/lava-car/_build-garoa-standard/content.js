// Conteúdo do modelo Silver de lava car (Garoa Lava Car, marca fictícia).
// Tudo que estiver marcado [EXEMPLO] deve ser trocado pelos dados do cliente.
module.exports = {
  marca: {
    nome: 'Garoa',
    completo: 'Garoa Lava Car',
    frase: 'Lavagem técnica e estética automotiva com hora marcada, no Buritis.',
    whatsapp: '5531998124470', // [EXEMPLO]
    telefone: '(31) 99812-4470', // [EXEMPLO]
    email: 'contato@garoalavacar.com.br', // [EXEMPLO]
    endereco: 'Av. Professor Mário Werneck, 1200', // [EXEMPLO]
    bairro: 'Buritis',
    cidade: 'Belo Horizonte, MG',
    instagram: 'https://instagram.com/garoalavacar',
    instagramUser: '@garoalavacar',
    facebook: 'https://facebook.com/garoalavacar',
    youtube: 'https://youtube.com/@garoalavacar',
  },

  // dia da semana (0 = domingo): [abre, fecha] em horas; null = fechado
  abertura: { 0: null, 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [8, 14] },
  horarioTexto: 'Seg a sex, 8h às 18h. Sáb, 8h às 14h',
  horarios: [['Segunda a sexta', '8h às 18h'], ['Sábado', '8h às 14h'], ['Domingo', 'Fechado']],

  numeros: [
    { n: 12, suf: ' mil', t: 'lavagens feitas desde a abertura' }, // [EXEMPLO]
    { n: 4.9, dec: 1, t: 'de nota média no Google' }, // [EXEMPLO]
    { n: 8, suf: ' anos', t: 'cuidando de carro no Buritis' }, // [EXEMPLO]
  ],

  compromissos: [
    ['Produto certo pra cada superfície', 'Shampoo de pH neutro, que limpa sem tirar a cera nem agredir o verniz.'],
    ['Hora marcada de verdade', 'Você agenda pelo WhatsApp e chega na hora. Sem fila, sem esperar o carro da frente.'],
    ['Conferência na entrega', 'Antes de liberar o carro, a gente passa com você por dentro e por fora.'],
  ],

  // Lavagem técnica: três níveis, cada um soma etapas ao anterior
  etapas: [
    ['Pré-lavagem com espuma ativa', 0],
    ['Lavagem da carroceria pelo método de dois baldes', 0],
    ['Aspiração completa e limpeza dos tapetes', 0],
    ['Painel, portas e vidros limpos por dentro', 0],
    ['Pretinho nos pneus', 0],
    ['Pincel de detalhamento em emblemas, frisos e grade', 1],
    ['Rodas e caixas de roda', 2],
    ['Limpeza do motor', 2],
    ['Vitrificação do para-brisa', 2],
    ['Revitalização dos plásticos externos', 2],
  ],
  niveis: [
    {
      id: 'platina', nome: 'Platina', foto: 'esponja', alt: 'Lavador passando a esponja com espuma na lateral do carro',
      texto: 'Limpeza completa por dentro e por fora. A lavagem do dia a dia, bem feita.',
      precos: { P: 60, M: 70, G: 85 }, // [EXEMPLO]
      tempo: 'cerca de 1h',
    },
    {
      id: 'diamante', nome: 'Diamante', foto: 'espuma-roda', alt: 'Carro esportivo coberto de espuma com o pincel de detalhamento na roda',
      texto: 'Lavagem completa com pincel de detalhamento nos cantos onde a esponja não chega.',
      precos: { P: 90, M: 105, G: 125 }, // [EXEMPLO]
      tempo: 'cerca de 1h30',
    },
    {
      id: 'rubi', nome: 'Rubi', foto: 'roda-escova', alt: 'Escova limpando a roda vermelha cheia de espuma',
      texto: 'Lavagem minuciosa com pincel, rodas e caixas de roda, motor, vitrificação do para-brisa e revitalização dos plásticos externos.',
      precos: { P: 180, M: 210, G: 250 }, // [EXEMPLO]
      tempo: 'cerca de 3h',
    },
  ],

  // Interior e acabamentos
  acabamentos: [
    { id: 'higienizacao', nome: 'Higienização interna', foto: 'painel-pincel', alt: 'Profissional de luvas limpando o painel com pincel',
      texto: 'Limpeza profunda de bancos, carpetes, plásticos e ar-condicionado. Elimina ácaros, fungos e odores. Os bancos saem do carro quando é preciso.' },
    { id: 'couro', nome: 'Tratamento dos couros', foto: 'couro', alt: 'Bancos de couro caramelo limpos e hidratados',
      texto: 'Limpeza e hidratação de bancos e revestimentos em couro, preservando o toque macio e a durabilidade.' },
    { id: 'plastico-interno', nome: 'Revitalização de plástico interno', foto: 'volante-pano', alt: 'Pano de microfibra amarelo limpando o volante',
      texto: 'Higieniza e hidrata os plásticos internos, melhorando o aspecto e a durabilidade.' },
    { id: 'plastico-externo', nome: 'Revitalização de plástico externo', foto: 'pneu-escova', alt: 'Mão de luva preta passando a escova no pneu',
      texto: 'Recupera a cor e o aspecto original dos plásticos externos. Feito sempre depois da lavagem do veículo.' },
    { id: 'adesivos', nome: 'Retirada de adesivos e cola', foto: 'polidora', alt: 'Politriz trabalhando no capô azul',
      texto: 'Remoção de adesivos e resíduos de cola, por dentro e por fora, sem danificar a pintura ou os vidros.' },
    { id: 'motor', nome: 'Lavagem de motor', foto: 'motor', alt: 'Motor limpo visto de cima',
      texto: 'Limpeza a vapor, sem pressão, com proteção prévia dos componentes sensíveis. Segura pra elétrica e peças frágeis.' },
  ],

  // Planos de assinatura (valores mensais [EXEMPLO])
  planos: [
    {
      id: 'uber-pro', nome: 'Uber Pro', para: 'Pra quem roda o dia inteiro com passageiro no banco de trás.',
      gotas: [['Platina', 4]], extra: null, desconto: null,
      itens: ['4 lavagens Platina por mês', 'Agenda prioritária no começo da manhã', 'Use quando quiser dentro do mês'],
      precos: { P: 199, M: 229, G: 259 },
    },
    {
      id: 'essencial', nome: 'Cuidado Essencial', para: 'Carro sempre apresentável, com um cuidado extra todo mês.', destaque: 'O mais assinado',
      gotas: [['Platina', 2]], extra: 'até R$200', desconto: 5,
      itens: ['2 lavagens Platina por mês', '1 serviço de até R$200 por mês', '5% de desconto nos demais serviços'],
      precos: { P: 279, M: 319, G: 359 },
    },
    {
      id: 'avancado', nome: 'Cuidado Avançado', para: 'Pra quem quer o carro no padrão de concessionária o ano todo.',
      gotas: [['Diamante', 2]], extra: 'até R$200', desconto: 10,
      itens: ['2 lavagens Diamante por mês', '1 serviço de até R$200 por mês', '10% de desconto nos demais serviços'],
      precos: { P: 349, M: 399, G: 449 },
    },
  ],
  portes: [
    ['P', 'Hatch e sedã compacto'],
    ['M', 'Sedã médio e SUV compacto'],
    ['G', 'SUV, picape e van'],
  ],

  videos: [
    { arq: '47585', t: 'Espuma e esponja', d: 'Lavagem da carroceria pelo método de dois baldes' },
    { arq: '47588', t: 'Jato de limpeza', d: 'Produto aplicado na pintura antes do enxágue' },
    { arq: '47832', t: 'Couro', d: 'Limpeza dos bancos com escova macia' },
    { arq: '36522', t: 'Aspiração', d: 'Carpete e cantos do assoalho' },
    { arq: '47834', t: 'Acabamento', d: 'Microfibra e brilho na dianteira' },
    { arq: '47586', t: 'Enxágue', d: 'Espuma saindo, brilho aparecendo' },
  ],

  antesDepois: [
    { id: 'pintura', nome: 'Pintura', foto: 'ad-pintura', alt: 'pintura vermelha do carro' },
    { id: 'couro', nome: 'Couro', foto: 'ad-couro', alt: 'bancos de couro e console' },
    { id: 'painel', nome: 'Painel', foto: 'ad-painel', alt: 'painel e console com detalhes vermelhos' },
  ],

  // [EXEMPLO] depoimentos fictícios de demonstração
  avaliacoes: [
    { nome: 'Juliana Prado', carro: 'Jeep Compass', servico: 'Higienização interna', texto: 'Meu cachorro anda no banco de trás e o carro tinha cheiro. Saiu de lá sem pelo nenhum e com cheiro de novo. Tiraram até os bancos.' },
    { nome: 'Rafael Menezes', carro: 'Toyota Corolla', servico: 'Plano Uber Pro', texto: 'Rodo de aplicativo e assinei o Uber Pro. Passo de manhã cedo, não pego fila e o carro fica impecável pros passageiros. Nota subiu.' },
    { nome: 'Camila Teixeira', carro: 'BMW 320i', servico: 'Tratamento dos couros', texto: 'O couro do banco do motorista estava ressecado. Hidrataram e voltou a ficar macio. Atendimento muito cuidadoso.' },
    { nome: 'Thiago Barcelos', carro: 'Hilux', servico: 'Lavagem Rubi', texto: 'Voltei de uma viagem de terra e a picape estava irreconhecível. Caixa de roda, motor, tudo limpo. Vale cada real.' },
    { nome: 'Patrícia Lacerda', carro: 'Honda HR-V', servico: 'Cuidado Essencial', texto: 'Assino o Essencial há um ano. Duas lavagens no mês e uso o serviço extra pra revitalizar os plásticos. Carro parece de loja.' },
    { nome: 'Eduardo Faria', carro: 'Golf GTI', servico: 'Lavagem Diamante', texto: 'Cuidam do carro como se fosse deles. O pincel nos emblemas e na grade faz diferença, coisa que lava jato comum não faz.' },
  ],
  notaGoogle: '4,9', totalAvaliacoes: 186, // [EXEMPLO]

  faq: [
    ['Preciso agendar ou posso chegar direto?', 'Trabalhamos com hora marcada pra não ter fila. Se chegar sem agendar, encaixamos quando houver horário livre no dia.'],
    ['Quanto tempo demora cada lavagem?', 'A Platina leva cerca de 1 hora, a Diamante 1h30 e a Rubi cerca de 3 horas. Higienização interna completa pode levar o dia todo por causa da secagem.'],
    ['Como sei se meu carro é P, M ou G?', 'P é hatch e sedã compacto, M é sedã médio e SUV compacto, G é SUV grande, picape e van. Na dúvida, manda o modelo no WhatsApp.'],
    ['Lavagem de motor pode estragar alguma peça?', 'Não fazemos com jato de pressão. É a vapor, com os componentes elétricos protegidos antes, o que deixa a limpeza segura.'],
    ['Como funciona o plano de assinatura?', 'Você escolhe o plano pelo porte do carro, paga por mês e agenda as lavagens quando quiser dentro do mês. Pode cancelar quando quiser.'],
    ['Vocês buscam o carro?', 'Sim, fazemos leva e traz sem custo nos bairros próximos. Fora da lista, combine pelo WhatsApp.'],
  ],

  bairros: ['Buritis', 'Estoril', 'Palmeiras', 'Havaí', 'Olhos d’Água', 'Nova Suíça', 'Gutierrez', 'Salgado Filho'],

  instagram: ['insta-bmw', 'insta-jato', 'insta-merc', 'insta-dupla', 'insta-vapor', 'insta-tunel', 'insta-sedan', 'insta-rolo'],
};
