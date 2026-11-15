// Conteúdo do modelo Bronze de autosserviços (empresa fictícia Tração Centro Automotivo).
// [EXEMPLO] = trocar pelos dados do cliente.
module.exports = {
  marca: {
    nome: 'Tração',
    completo: 'Tração Centro Automotivo',
    frase: 'Oficina de bairro com equipamento de concessionária. Orçamento antes de mexer, peça na sua mão e garantia por escrito.',
    whatsapp: '5531999990000', // [EXEMPLO]
    whatsappTexto: '(31) 99999-0000', // [EXEMPLO]
    telefone: '(31) 3333-0000', // [EXEMPLO]
    email: 'contato@tracaoauto.com.br', // [EXEMPLO]
    endereco: 'Av. Pedro II, 2150', // [EXEMPLO]
    bairro: 'Carlos Prates',
    cidade: 'Belo Horizonte, MG',
    instagram: 'https://www.instagram.com/',
    instagramUser: '@tracaoauto',
    facebook: 'https://www.facebook.com/',
    desde: 2013,
  },
  horarios: [
    ['Segunda a sexta', '7h30 às 18h'],
    ['Sábado', '8h às 13h'],
    ['Domingo e feriado', 'Fechado'],
  ],
  horarioTexto: 'Seg. a sex. 7h30 às 18h, sáb. 8h às 13h',
  // abertura por dia da semana (0 = domingo), em minutos
  abertura: { 1: [450, 1080], 2: [450, 1080], 3: [450, 1080], 4: [450, 1080], 5: [450, 1080], 6: [480, 780] },

  // nav: os links levam direto ao serviço na seção de serviços
  nav: [
    ['pneus', 'Pneus e rodas'],
    ['mecanica', 'Mecânica'],
    ['oleo', 'Troca de óleo'],
    ['freio', 'Sistema de freio'],
    ['suspensao', 'Suspensão'],
  ],

  servicos: [
    {
      id: 'pneus', nome: 'Pneus e rodas', curto: 'Pneus', foto: 'pneus',
      alt: 'Mecânico montando um pneu na roda com a máquina desmontadora',
      chamada: 'Pneu novo, montado e balanceado no mesmo dia.',
      texto: 'Trabalhamos com as principais marcas em todas as medidas de aro. Montagem com máquina sem alavanca, que não risca a roda, e balanceamento computadorizado.',
      itens: ['Venda de pneus nacionais e importados', 'Montagem sem riscar a roda', 'Balanceamento computadorizado', 'Rodízio e calibragem com nitrogênio', 'Reparo de roda amassada'],
      tempo: 'a partir de 40 min',
    },
    {
      id: 'mecanica', nome: 'Mecânica geral', curto: 'Mecânica', foto: 'mecanica',
      alt: 'Dois mecânicos trabalhando no motor de um carro com o capô aberto',
      chamada: 'Do barulho estranho à revisão completa.',
      texto: 'Diagnóstico com scanner, motor, câmbio, embreagem, arrefecimento e correias. Antes de qualquer serviço você recebe o orçamento por foto no WhatsApp.',
      itens: ['Diagnóstico por scanner', 'Revisão preventiva por quilometragem', 'Correia dentada e de acessórios', 'Embreagem e câmbio', 'Arrefecimento e radiador'],
      tempo: 'diagnóstico em até 1 h',
    },
    {
      id: 'oleo', nome: 'Troca de óleo', curto: 'Óleo', foto: 'oleo',
      alt: 'Mecânico colocando óleo novo no motor de um carro',
      chamada: 'O óleo certo para o seu motor, sem empurrar o mais caro.',
      texto: 'Seguimos a especificação do fabricante do seu carro. Trocamos filtro de óleo, ar, combustível e cabine e anotamos a próxima troca na etiqueta do para-brisa.',
      itens: ['Óleo sintético, semissintético e mineral', 'Filtros de óleo, ar, combustível e cabine', 'Conferência de níveis e fluidos', 'Etiqueta com a próxima troca'],
      tempo: 'cerca de 30 min',
    },
    {
      id: 'freio', nome: 'Sistema de freio', curto: 'Freio', foto: 'freio',
      alt: 'Disco de freio e pinça vermelha de um carro suspenso no elevador',
      chamada: 'Pedal firme e carro parando reto.',
      texto: 'Medimos a espessura dos discos e o desgaste das pastilhas na sua frente. Só trocamos o que precisa e a peça velha volta para você.',
      itens: ['Pastilhas e lonas', 'Discos e tambores', 'Fluido de freio DOT 4', 'Pinças e cilindros', 'Freio de mão e ABS'],
      tempo: 'a partir de 1 h',
    },
    {
      id: 'suspensao', nome: 'Suspensão', curto: 'Suspensão', foto: 'suspensao',
      alt: 'Quatro amortecedores com molas vermelhas lado a lado',
      chamada: 'Fim do barulho na lombada e do carro batendo seco.',
      texto: 'Amortecedores, molas, bandejas, pivôs, buchas e terminais. Teste de rodagem antes e depois para você sentir a diferença.',
      itens: ['Amortecedores e molas', 'Bandejas, pivôs e buchas', 'Terminais e barras axiais', 'Coxins e batentes', 'Teste de rodagem'],
      tempo: 'a partir de 2 h',
    },
    {
      id: 'alinhamento', nome: 'Alinhamento 3D', curto: 'Alinhamento', foto: 'alinhamento',
      alt: 'Mecânico com luvas segurando o pneu de um carro na oficina',
      chamada: 'Volante reto e pneu gastando por igual.',
      texto: 'Câmeras leem os alvos presos nas rodas e mostram cada ângulo na tela, antes e depois. Você leva o relatório impresso.',
      itens: ['Medição por câmeras 3D', 'Cambagem, caster e convergência', 'Relatório antes e depois', 'Balanceamento junto com desconto'],
      tempo: 'cerca de 40 min',
    },
  ],

  numeros: [
    [13, '', 'anos no Carlos Prates'],
    [18, ' mil', 'carros atendidos'],
    [4.9, '', 'de nota no Google'],
    [90, ' dias', 'de garantia por escrito'],
  ],

  diferenciais: [
    ['Orçamento por foto', 'Mostramos o problema no WhatsApp antes de mexer. Sem susto na hora de pagar.'],
    ['A peça velha é sua', 'Tudo o que sai do carro volta para você no porta-malas.'],
    ['Garantia de 90 dias', 'Peça e mão de obra, escrito na nota.'],
    ['Leva e traz', 'Buscamos e entregamos o carro em casa ou no trabalho na região.'],
  ],

  avaliacoes: [
    ['Larissa M.', 'Onix 2019', 'Fui trocar a pastilha e me mostraram pelo WhatsApp que o disco ainda estava bom. Economizei e confiei na hora.', 5],
    ['Ricardo S.', 'Hilux 2017', 'Alinhamento 3D de verdade, com relatório antes e depois. O volante voltou reto e o carro parou de puxar.', 5],
    ['Patrícia A.', 'HB20 2021', 'Troca de óleo rápida, me explicaram o óleo certo para o motor e não tentaram empurrar nada.', 5],
    ['Fernando L.', 'Corolla 2016', 'Barulho na suspensão que duas oficinas não acharam. Aqui resolveram em uma manhã.', 5],
    ['Juliana C.', 'Kicks 2020', 'Buscaram o carro no meu trabalho e devolveram no fim do dia. Atendimento muito educado.', 5],
    ['Marcos V.', 'Saveiro 2015', 'Comprei quatro pneus com montagem e balanceamento. Preço justo e roda sem nenhum risco.', 5],
    ['Aline R.', 'Fox 2014', 'Me entregaram a peça velha na mão e explicaram o que tinha acontecido. É raro achar oficina assim.', 5],
    ['Bruno T.', 'Renegade 2018', 'Revisão completa no prazo combinado. Voltei para o alinhamento e já virei cliente.', 4],
  ],

  bairros: ['Carlos Prates', 'Padre Eustáquio', 'Lagoinha', 'Bonfim', 'Caiçara', 'Coração Eucarístico', 'Centro', 'Prado'],
};
