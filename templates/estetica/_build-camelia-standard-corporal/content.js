// Conteúdo do modelo Silver de estética: ESTÉTICA CORPORAL (Camélia Estética, marca fictícia).
// Massagens modeladoras e relaxantes, drenagem linfática, tratamentos para celulite e gordura localizada e pacotes de sessões.
// [EXEMPLO] = trocar pelos dados do cliente. Todos os preços, prazos e números de registro são [EXEMPLO].
// [JURÍDICO] = texto que precisa passar pela revisão jurídica antes de ir para um cliente real.
//
// LIGAR E DESLIGAR SEGMENTOS
// Cada segmento tem `ativo: true/false`. Desligado, ele some do site inteiro: abas de tratamentos, capa, preços,
// opções do formulário, rodapé, dores, antes e depois, depoimentos e dúvidas ligados a ele (campo `seg`).
// Pacote com `requer: [...]` só aparece se todos os segmentos de que ele depende estiverem ligados.
// Com um segmento só, as abas somem e a lista aparece direto. Na prévia também dá para testar pelo link:
//   ?seg=drenagem   ?seg=massagens,drenagem   ?seg=celulite,pacotes

const marca = {
  nome: 'Camélia',
  completo: 'Camélia Estética',
  frase: 'Estética corporal no Cambuí, com avaliação e medidas antes de qualquer pacote.',
  razao: 'Camélia Estética Avançada Ltda.', // [EXEMPLO] razão social fictícia
  cnpj: '00.000.000/0001-00', // [EXEMPLO] fictício
  whatsapp: '5519999990000', // [EXEMPLO]
  whatsappTexto: '(19) 99999-0000', // [EXEMPLO]
  telefone: '(19) 3333-0000', // [EXEMPLO]
  email: 'contato@cameliaestetica.com.br', // [EXEMPLO]
  endereco: 'Rua Coronel Quirino, 1450, sala 12', // [EXEMPLO]
  bairro: 'Cambuí',
  cidade: 'Campinas',
  uf: 'SP',
  cep: '13025-000', // [EXEMPLO]
  desde: 2017, // [EXEMPLO]
  instagram: 'https://instagram.com/',
  instagramUser: '@cameliaestetica',
  facebook: 'https://facebook.com/',
  linkedin: 'https://linkedin.com/',
  encarregado: 'privacidade@cameliaestetica.com.br', // [EXEMPLO] canal do encarregado de dados (LGPD)
};

// responsável técnica [EXEMPLO] pessoa e registro fictícios
const responsavel = {
  nome: 'Marina Alencar',
  cargo: 'Fisioterapeuta dermatofuncional, responsável técnica',
  registro: 'CREFITO-3 nº 000000-F', // [EXEMPLO] fictício
  foto: 'responsavel',
  texto: 'Formada em Fisioterapia, com especialização em dermatofuncional. Faz as avaliações corporais, monta os protocolos de celulite e gordura localizada e acompanha as medidas de cada cliente do início ao fim do pacote.',
  equipe: 'As massagens e a drenagem são feitas por massoterapeutas e esteticistas com curso técnico, treinadas por ela e sob a supervisão dela.',
};

// horário por dia da semana (0 = domingo), em horas decimais; null = fechado
const abertura = [null, [9, 20], [9, 20], [9, 20], [9, 20], [9, 20], [8, 14]];
const horarios = [['Segunda a sexta', '9h às 20h'], ['Sábado', '8h às 14h'], ['Domingo e feriado', 'Fechado']];

// fotos: arquivo em img/fotos/<nome>.webp. Sem o arquivo, o site mostra um espaço reservado com a descrição.
// Fotos atuais: Unsplash (licença Unsplash), créditos em img/creditos.json. Cliente real: trocar por fotos da clínica e da equipe.
const fotos = {
  capa: 'Massoterapeuta derramando óleo morno na mão antes da massagem nas costas da cliente',
  massagens: 'Mãos da massoterapeuta fazendo massagem nas costas da cliente',
  relaxante: 'Massagem com pedras quentes nas costas, com flores brancas na maca',
  drenagem: 'Drenagem linfática na perna da cliente sobre toalha branca',
  celulite: 'Massagem com instrumento de madeira na coxa da cliente',
  gordura: 'Aparelho de radiofrequência deslizando sobre o abdômen com gel',
  avaliacao: 'Medida do quadril com fita métrica na avaliação',
  pacotes: 'Toalhas enroladas sobre a maca, prontas para a sessão',
  responsavel: 'Profissional de jaleco branco sorrindo',
  'galeria-ferramentas': 'Instrumentos de madeira usados na massagem modeladora',
  'galeria-vela': 'Vela acesa sobre toalhas na sala de massagem',
  'galeria-escova': 'Cremes corporais e escova de cerdas naturais sobre banco de madeira',
  'galeria-toalha': 'Toalha enrolada, frasco de creme e tulipas rosa',
  'galeria-costas': 'Massagem relaxante nos ombros da cliente',
  'galeria-abdomen': 'Profissional de luvas fazendo drenagem no abdômen',
  'galeria-oleo': 'Óleo de massagem e vela sobre mesa de madeira',
  'ad-quadril': 'Quadril e coxa de perfil, em preto e branco',
  'ad-perna': 'Perna da cliente com a mão na panturrilha',
};

// Segmentos e tratamentos. Preço: `de` = "a partir de"; `preco` = valor fechado; `pacoteSo` = só em pacote.
// Pacotes: `total` = valor do pacote, `avulso` = quanto sairia em sessões avulsas, `requer` = segmentos de que depende.
const segmentos = [
  {
    id: 'massagens', ativo: true, nome: 'Massagens modeladoras e relaxantes', curto: 'Massagens', foto: 'massagens',
    chamada: 'Da manobra firme que trabalha abdômen, quadril e coxas à massagem lenta para soltar o corpo. A pressão é combinada com você antes de começar.',
    itens: [
      {
        nome: 'Massagem modeladora', resumo: 'Manobras firmes e ritmadas em abdômen, flancos, quadril e coxas. Costuma ser combinada com drenagem ou radiofrequência.',
        duracao: '50 min', sessoes: 'Pacote de 10, duas vezes por semana', preco: 140,
        inclui: ['Áreas escolhidas na avaliação', 'Creme com ativos', 'Medidas no início e no fim do pacote'],
      },
      {
        nome: 'Modeladora com instrumentos de madeira', resumo: 'Rolos e espátulas de madeira deslizam com creme e deixam a pressão mais uniforme nas áreas maiores.',
        duracao: '50 min', sessoes: 'Pacote de 10, duas vezes por semana', preco: 160,
        inclui: ['Instrumentos higienizados a cada cliente', 'Creme ou óleo neutro', 'Medidas no início e no fim do pacote'],
      },
      {
        nome: 'Massagem relaxante', resumo: 'Para soltar a musculatura e desacelerar. Costas, pernas, braços e couro cabeludo, com pressão combinada.',
        duracao: '1h', sessoes: 'Sessão avulsa', preco: 150,
        inclui: ['Óleo aquecido', 'Aromaterapia, se você quiser', 'Toalha quente nos pés'],
      },
      {
        nome: 'Relaxante com pedras quentes', resumo: 'Pedras de basalto aquecidas apoiadas e deslizadas pelo corpo. O calor ajuda a musculatura a ceder.',
        duracao: '1h15', sessoes: 'Sessão avulsa', preco: 190,
        inclui: ['Pedras higienizadas e aquecidas em aparelho próprio', 'Óleo aquecido', 'Teste de temperatura antes de apoiar no corpo'],
      },
    ],
    // guia de pressão mostrado no fim da aba
    extra: {
      titulo: 'Qual pressão combina com você',
      lista: [
        ['Suave', 'Movimentos lentos e leves. Para quem quer relaxar ou está começando.'],
        ['Média', 'Firme sem incomodar. A mais pedida na relaxante.'],
        ['Firme', 'A da modeladora. Pode avermelhar a pele por algumas horas; se incomodar, a gente ajusta na hora.'],
      ],
    },
  },
  {
    id: 'drenagem', ativo: true, nome: 'Drenagem linfática', curto: 'Drenagem', foto: 'drenagem',
    chamada: 'Movimentos leves e lentos, no sentido da circulação linfática, para aliviar o inchaço e a sensação de peso. Não é massagem forte e não emagrece.',
    itens: [
      {
        nome: 'Drenagem linfática corporal', resumo: 'Corpo inteiro, do pescoço aos pés. Para quem sente as pernas pesadas e o corpo inchado no fim do dia.',
        duracao: '1h', sessoes: 'Avulsa ou pacote de 10, uma ou duas por semana', preco: 140,
        inclui: ['Corpo inteiro', 'Creme ou óleo neutro', 'Orientação de hidratação e de movimento em casa'],
      },
      {
        nome: 'Drenagem de pernas e abdômen', resumo: 'Versão mais curta, focada onde o inchaço costuma aparecer.',
        duracao: '40 min', sessoes: 'Sessão avulsa', preco: 100,
        inclui: ['Pernas, abdômen e região lombar', 'Pernas elevadas no fim da sessão'],
      },
      {
        nome: 'Drenagem pós-operatória', resumo: 'Para depois de lipoaspiração, abdominoplastia e outras cirurgias plásticas, no prazo e na frequência que o seu cirurgião indicar.',
        duracao: '1h', sessoes: 'Pacote de 10, ritmo definido com o cirurgião', de: 160,
        inclui: ['Pedido ou liberação do cirurgião', 'Atenção a pontos, drenos e cinta', 'Registro de cada sessão para o seu médico'],
      },
      {
        nome: 'Drenagem na gestação', resumo: 'Para aliviar pés e pernas inchados a partir do segundo trimestre, com liberação do obstetra.',
        duracao: '50 min', sessoes: 'Sessão avulsa ou pacote de 4', preco: 150,
        inclui: ['Posição lateral com almofadas', 'Sem pressão no abdômen', 'Liberação do obstetra antes da primeira sessão'],
      },
    ],
  },
  {
    id: 'celulite', ativo: true, nome: 'Celulite e gordura localizada', curto: 'Celulite e gordura', foto: 'celulite',
    chamada: 'Protocolos em série que combinam aparelho, massagem e cuidados em casa. Antes de começar, medimos e fotografamos a área (com a sua autorização) para acompanhar o que muda.',
    itens: [
      {
        nome: 'Protocolo para celulite', resumo: 'Radiofrequência corporal, massagem modeladora e ativos, combinados conforme o grau da celulite na avaliação.',
        duracao: '1h', sessoes: '10 sessões, duas por semana', de: 1400, pacoteSo: true,
        inclui: ['Avaliação com fotos de acompanhamento (com sua autorização)', 'Radiofrequência corporal', 'Massagem modeladora', 'Ativos de uso em casa'],
      },
      {
        nome: 'Protocolo para gordura localizada', resumo: 'Ultrassom focado e radiofrequência em abdômen, flancos, culote ou braços, com drenagem no fim.',
        duracao: '50 min', sessoes: '10 sessões, duas por semana', de: 1300, pacoteSo: true,
        inclui: ['Medidas e bioimpedância no início, no meio e no fim', 'Ultrassom focado', 'Radiofrequência', 'Drenagem ao final da sessão'],
      },
      {
        nome: 'Radiofrequência corporal', resumo: 'Calor controlado para dar firmeza à pele de abdômen, glúteos, coxas ou braços.',
        duracao: '40 min', sessoes: '8 a 10 sessões, uma por semana', preco: 160,
        inclui: ['Uma área por sessão', 'Gel condutor', 'Controle de temperatura durante toda a sessão'],
      },
      {
        nome: 'Endermoterapia', resumo: 'Aparelho de sucção com roletes que mobiliza a pele e o tecido abaixo dela. Complementa os protocolos de celulite.',
        duracao: '40 min', sessoes: '10 sessões, duas por semana', preco: 130,
        inclui: ['Malha descartável', 'Pressão ajustada para cada área', 'Hidratação ao final'],
      },
    ],
    // tabela por área: [área, sessão avulsa de radiofrequência, protocolo de 10 sessões]
    tabela: {
      titulo: 'Preço por área',
      colunas: ['Área', 'Sessão avulsa', 'Protocolo de 10 sessões'],
      linhas: [['Abdômen', 160, 1300], ['Flancos', 140, 1150], ['Culote', 150, 1200], ['Glúteos', 160, 1300], ['Parte interna das coxas', 140, 1150], ['Braços', 120, 980]],
      nota: 'Equipamentos com registro na Anvisa. Duas áreas no mesmo protocolo têm 15% de desconto na segunda. O número de sessões é confirmado na avaliação.',
    },
  },
  {
    id: 'pacotes', ativo: true, nome: 'Pacotes de sessões', curto: 'Pacotes', foto: 'pacotes',
    chamada: 'Para quem já sabe o que quer fazer com frequência. O pacote sai por escrito, com as datas sugeridas, e você remarca dentro da validade.',
    itens: [
      {
        nome: 'Pacote Leveza', resumo: '10 drenagens corporais para manter as pernas leves ao longo do mês.', requer: ['drenagem'],
        duracao: '10 sessões de 1h', sessoes: 'Uma ou duas por semana, validade de 4 meses', total: 1200, avulso: 1400,
        inclui: ['10 drenagens linfáticas corporais', 'Orientação de hidratação e movimento em casa', 'Remarcação sem custo até 24h antes'],
      },
      {
        nome: 'Pacote Contorno', resumo: '10 sessões que alternam modeladora e drenagem, para quem quer trabalhar abdômen, quadril e coxas.', requer: ['massagens', 'drenagem'],
        duracao: '10 sessões de 50 min', sessoes: 'Duas por semana, validade de 3 meses', total: 1250, avulso: 1400,
        inclui: ['5 modeladoras e 5 drenagens', 'Medidas no início, no meio e no fim', 'Creme com ativos para usar em casa'],
      },
      {
        nome: 'Pacote Pausa', resumo: 'Uma massagem relaxante por semana durante um mês. Para quem quer marcar na agenda um tempo para si.', requer: ['massagens'],
        duracao: '4 sessões de 1h', sessoes: 'Uma por semana, validade de 2 meses', total: 520, avulso: 600,
        inclui: ['4 massagens relaxantes, com troca por pedras quentes em uma delas', 'Óleo e aromaterapia à escolha', 'Toalha quente nos pés'],
      },
      {
        nome: 'Pacote Recuperação', resumo: '10 drenagens pós-operatórias no ritmo que o seu cirurgião indicar.', requer: ['drenagem'],
        duracao: '10 sessões de 1h', sessoes: 'Validade de 3 meses a partir da liberação médica', total: 1450, avulso: 1600,
        inclui: ['Registro de cada sessão para o seu médico', 'Horários reservados nas primeiras semanas', 'WhatsApp direto com a fisioterapeuta'],
      },
    ],
    extra: {
      titulo: 'Como funcionam os pacotes',
      lista: [
        ['Por escrito', 'Tratamento, número de sessões, intervalo, validade e valor total, antes da primeira sessão.'],
        ['Pessoal', 'O pacote é seu. Para passar para outra pessoa, fale com a gente antes.'],
        ['Desistência', 'Devolvemos as sessões não feitas pelo preço do pacote, descontados 10% de custo administrativo.'],
      ],
    },
  },
];

const pagamento = [
  ['Formas de pagamento', 'Pix, débito e crédito. Sessão avulsa em até 3x e pacotes em até 10x sem juros no cartão.'],
  ['Pacotes de sessões', 'Têm validade a partir da primeira sessão (de 2 a 4 meses, conforme o pacote). O plano sai por escrito na avaliação, com o número de sessões e o valor total.'],
  ['Garantia do serviço', 'Pressão ajustada na hora se incomodar, remarcação sem custo de sessão perdida por falha nossa e medidas refeitas no meio do pacote sem custo. Garantimos o serviço bem feito, não um resultado específico.'],
];

// etapas do atendimento (mostradas como linha do tempo, sem número)
const etapas = [
  ['Avaliação', 'Conversa sobre a sua rotina, ficha de saúde, medidas e, se você autorizar, fotos da área. Sem custo e sem compromisso de fechar nada.'],
  ['Plano por escrito', 'Tratamento indicado, número de sessões, intervalo, valor total e cuidados em casa.'],
  ['Sessões', 'Com hora marcada, maca forrada com lençol descartável e pressão combinada com você.'],
  ['Reavaliação', 'No meio e no fim do pacote refazemos as medidas e ajustamos o plano se for preciso.'],
];

// [JURÍDICO] lista geral; a avaliação verifica cada caso
const contraindicacoes = [
  'Gravidez: sem radiofrequência, ultrassom, endermoterapia e modeladora. Drenagem e relaxante só com liberação do obstetra.',
  'Trombose atual ou recente, varizes inflamadas ou flebite: sem massagem e drenagem nas pernas.',
  'Insuficiência cardíaca ou renal e pressão alta descompensada: drenagem só com liberação médica.',
  'Marca-passo, implante metálico ou prótese na área: sem radiofrequência e ultrassom.',
  'Febre, infecção, ferida, queimadura de sol ou inflamação na pele da área.',
  'Câncer em tratamento e pós-operatório: só com liberação do médico responsável.',
];

// [JURÍDICO]
const politicas = [
  ['Avaliação prévia', 'Todo protocolo de celulite e gordura localizada, toda drenagem pós-operatória e todo primeiro pacote começam pela avaliação. Nela você preenche a ficha de saúde, tiramos as medidas e você recebe o plano por escrito. Massagem relaxante avulsa pode ser marcada direto, com a ficha de saúde preenchida na chegada.'],
  ['Agendamento', 'Pelo WhatsApp ou pelo formulário desta página. Confirmamos por mensagem um dia antes. A sessão é sua por hora marcada, sem encaixe de outra cliente no mesmo horário.'],
  ['Cancelamento', 'Cancele ou remarque sem custo até 24h antes. Com menos de 24h, a sessão avulsa é cobrada em 50% e a sessão de pacote conta como feita. Imprevisto de saúde com atestado não entra nessa regra.'],
  ['Remarcação e atraso', 'Remarque quantas vezes precisar dentro da validade do pacote, respeitando as 24h. Toleramos 15 minutos de atraso; depois disso a sessão é encurtada ou remarcada, para não atrasar a próxima cliente.'],
  ['Desistência de pacote', 'Você pode desistir a qualquer momento. Devolvemos o valor das sessões não feitas, calculado pelo preço do pacote, descontados 10% de custo administrativo.'],
];

// [JURÍDICO] conferir registros reais da clínica
const seguranca = [
  ['Material descartável', 'Lençol, touca, malha da endermoterapia e espátulas são de uso único e abertos na sua frente.'],
  ['Higiene a cada cliente', 'Maca, pedras, instrumentos de madeira e ponteiras dos aparelhos são higienizados com produto próprio entre um atendimento e outro.'],
  ['Registro na Anvisa', 'Aparelhos de radiofrequência, ultrassom e endermoterapia, cremes e géis têm registro ou notificação na Anvisa, conforme exigido para cada item.'],
  ['Licença sanitária', 'Clínica com alvará e licença da Vigilância Sanitária de Campinas, renovados todo ano.'],
];

// [JURÍDICO] aviso de resultados conforme regras de publicidade do setor
const avisoResultado = 'Cada corpo responde de um jeito. Os tratamentos não prometem cura, emagrecimento nem resultado garantido, e o número de sessões pode mudar depois da avaliação. Fotos de antes e depois só são usadas com autorização por escrito da cliente.';

// Antes e depois. [EXEMPLO] SIMULAÇÃO feita no build por cima da mesma foto. Cliente real: trocar por fotos da
// própria cliente, com autorização por escrito, e apagar `simulacao`. `seg` = segmento a que o cartão pertence.
//   tipo 'celulite': furinhos de sombra desenhados nas regiões [centro x, centro y, raio x, raio y, quantidade] (pixels da foto)
//   tipo 'volume': o "antes" é a mesma foto um pouco mais larga (`escala`), com ponto de apoio em `origem`
const antesDepois = [
  {
    seg: 'celulite', foto: 'ad-quadril', titulo: 'Celulite no culote e na coxa', tratamento: 'Protocolo para celulite',
    sessoes: '10 sessões', intervalo: '3 meses entre as fotos',
    texto: 'Radiofrequência e modeladora duas vezes por semana, com ativo em casa e caminhada três vezes por semana.',
    simulacao: { tipo: 'celulite', filtro: 'contrast(.97)', cor: '#000', regioes: [[700, 1320, 165, 280, 150], [740, 960, 120, 110, 40], [620, 1600, 90, 110, 40]] },
  },
  {
    seg: 'drenagem', foto: 'ad-perna', titulo: 'Pernas inchadas no fim do dia', tratamento: 'Drenagem linfática corporal',
    sessoes: '10 sessões', intervalo: '6 semanas entre as fotos',
    texto: 'Duas drenagens por semana, pernas elevadas à noite e mais água ao longo do dia.',
    simulacao: { tipo: 'volume', filtro: 'saturate(.92) brightness(.98)', escala: 1.1, origem: '52% 50%' },
  },
  {
    seg: 'celulite', foto: 'gordura', titulo: 'Gordura localizada no abdômen', tratamento: 'Protocolo para gordura localizada',
    sessoes: '10 sessões', intervalo: '10 semanas entre as fotos',
    texto: 'Ultrassom e radiofrequência duas vezes por semana, com drenagem ao final e acompanhamento das medidas.',
    simulacao: { tipo: 'volume', filtro: 'saturate(.95)', escala: 1.07, origem: '50% 60%' },
  },
];

// `seg`: a pergunta só aparece se o segmento estiver ligado
const faq = [
  ['A avaliação é paga?', 'Não. A primeira avaliação é sem custo e não obriga você a fechar pacote.'],
  ['Posso fazer só uma sessão avulsa?', 'Pode. Os pacotes saem mais em conta, mas massagens, drenagem e radiofrequência também têm preço avulso.'],
  ['Drenagem emagrece?', 'Não. A drenagem ajuda a reduzir o inchaço e a sensação de peso, o que pode mudar as medidas, mas não tira gordura.', 'drenagem'],
  ['A modeladora dói? Vou ficar roxa?', 'A pressão é firme e a pele pode ficar vermelha por algumas horas. Não deve doer nem deixar roxo: se incomodar, a gente ajusta na hora.', 'massagens'],
  ['Em quanto tempo vejo diferença na celulite?', 'Depende do grau, da área e da sua rotina. Por isso medimos e fotografamos no início, no meio e no fim do protocolo, para você acompanhar com dados e não com promessa. Os protocolos são vendidos só em série, porque uma sessão sozinha não basta.', 'celulite'],
  ['Posso passar meu pacote para outra pessoa?', 'O pacote é pessoal. Se precisar passar para alguém, fale com a gente antes: a outra pessoa também faz a avaliação.', 'pacotes'],
  ['Atendem homens?', 'Sim. Todos os tratamentos corporais também são feitos em homens.'],
  ['O que eu levo para a sessão?', 'Nada. Temos roupa descartável, toalha e chinelo. Venha sem creme no corpo e, na drenagem, com duas horas de intervalo da última refeição.'],
];

const bairros = ['Cambuí', 'Centro', 'Guanabara', 'Taquaral', 'Nova Campinas', 'Castelo', 'Barão Geraldo', 'Valinhos']; // [EXEMPLO]


// ---------- só do Silver: landing page com abertura, dores, medos, pilares e depoimentos ----------
const silver = {
  // abertura: três frases que surgem e somem antes da página (cor = token do CSS)
  abertura: [['Cuidar do corpo', 'preto'], ['começa por uma', 'rosa'], ['boa conversa', 'ouro']],
  faixa: 'Cuidar do corpo começa por uma boa conversa',
  capa: {
    apoio: 'Estética corporal no Cambuí', // o build completa com os segmentos ligados
    titulo: ['Um cuidado com o seu corpo ', 'no seu ritmo', '.'],
    texto: 'Antes de qualquer pacote, uma avaliação sem custo, com medidas e conversa sobre a sua rotina. Você sai sabendo quantas sessões fazem sentido e quanto vai pagar no total.',
    marcas: ['Avaliação sem custo', 'Plano por escrito', 'Fisioterapeuta com registro'],
    // área da foto onde não entram brilhos (mãos, óleo e rosto da cliente), em % da área da foto
    livre: { pc: { x0: 18, x1: 76, y0: 0, y1: 70 }, cel: { x0: 10, x1: 84, y0: 0, y1: 72 } },
  },
  dores: {
    apoio: 'Talvez você já tenha sentido isso',
    titulo: ['Você se ', 'reconhece', ' aqui?'],
    // [título, texto, segmento]
    itens: [
      ['As pernas pesam e incham no fim do dia.', 'O sapato aperta, a meia marca e a sensação de peso não passa nem com o pé para cima. Movimento leve e constância ajudam muito.', 'drenagem'],
      ['A roupa aperta sempre no mesmo lugar.', 'Abdômen, culote ou a celulite que aparece no espelho com luz de cima. Às vezes mesmo com treino e alimentação em dia.', 'celulite'],
      ['O corpo trava e a cabeça não desliga.', 'Ombro duro, lombar cansada e aquela semana que parece não acabar. Uma hora na maca muda o resto do dia.', 'massagens'],
      ['Você já comprou pacote e desistiu no meio.', 'Sem medida, sem retorno e sem saber se estava funcionando. Aqui o pacote vem com plano por escrito e reavaliação no meio.', 'pacotes'],
    ],
  },
  medos: {
    apoio: 'Antes de começar',
    titulo: ['Se você já pensou em cuidar do corpo e travou por ', 'medo', ','],
    sub: 'você não está sozinha.',
    itens: [
      'E se eu ficar com vergonha de tirar a roupa?',
      'E se me empurrarem um pacote enorme que eu não preciso?',
      'E se a massagem doer e eu sair cheia de roxo?',
      'E se eu fizer todas as sessões e nada mudar?',
      'E se o valor final for outro na hora de pagar?',
    ],
    fecho: ['Esses medos são justos. Por isso o atendimento começa ', 'antes', ': na avaliação, com calma e com a porta fechada.'],
  },
  pilares: {
    apoio: 'Por que aqui é diferente',
    titulo: ['O plano é feito para o ', 'seu corpo', '. Não para o pacote de todo mundo.'],
    // a palavra grande faz o papel de marcador, sem número
    itens: [
      ['Antes', 'Avaliação com medidas', 'Conversa, ficha de saúde e medidas da área. Se não precisar de pacote, vai ouvir isso aqui.'],
      ['Por escrito', 'Sem surpresa no valor', 'Tratamento, número de sessões, intervalo, validade e valor total, tudo no papel antes da primeira sessão.'],
      ['Na medida', 'Pressão combinada', 'A modeladora é firme, a drenagem é leve e a relaxante é do jeito que você pedir. Se incomodar, ajustamos na hora.'],
      ['Durante', 'Medidas no meio do caminho', 'Refazemos as medidas na metade do pacote e no fim, para você acompanhar com dados e não com promessa.'],
    ],
  },
  tratamentos: {
    apoio: 'Tratamentos e preços',
    titulo: ['O que podemos fazer ', 'por você'],
    fecho: 'Não sabe por onde começar? A avaliação existe exatamente para isso.',
  },
  resultados: {
    titulo: ['Corpo cuidado com constância. ', 'Sem milagre', '.'],
  },
  // [EXEMPLO] [JURÍDICO] depoimentos ilustrativos do modelo. Cliente real: só depoimentos verdadeiros, com autorização por escrito.
  // [texto, quem, segmento]
  depoimentos: [
    ['Saí da primeira drenagem com as pernas leves. Agora faço toda semana, já virou parte da rotina.', 'Cliente de drenagem linfática', 'drenagem'],
    ['Ela foi honesta sobre o que dava para melhorar. Fiz o protocolo sabendo o que esperar e acompanhei as medidas.', 'Cliente do protocolo para celulite', 'celulite'],
    ['Fui para relaxar e ela percebeu o ombro travado antes de eu falar. Ajustou a pressão e saí outra pessoa.', 'Cliente de massagem relaxante', 'massagens'],
    ['O pacote veio por escrito com todas as datas. Remarquei duas vezes sem problema nenhum.', 'Cliente do Pacote Contorno', 'pacotes'],
  ],
  sobre: {
    apoio: 'Quem vai cuidar de você',
    citacao: 'Seu corpo não precisa caber num padrão. Precisa de cuidado.',
    citacaoSub: 'Avaliação honesta, pressão combinada e medidas no papel. Esse é o compromisso em cada atendimento.',
  },
  final: {
    apoio: 'O primeiro passo',
    titulo: ['Você não precisa decidir agora. Só precisa de uma ', 'conversa', '.'],
    texto: 'Na avaliação a gente mede, conversa sobre a sua rotina e explica o que faz sentido para você. Você sai entendendo tudo e decide no seu tempo, sem ninguém te empurrando nada.',
  },
  galeria: ['galeria-ferramentas', 'relaxante', 'galeria-vela', 'avaliacao', 'galeria-escova', 'galeria-costas', 'galeria-toalha', 'galeria-abdomen', 'galeria-oleo'],
};

module.exports = { marca, responsavel, abertura, horarios, fotos, segmentos, pagamento, etapas, contraindicacoes, politicas, seguranca, avisoResultado, antesDepois, faq, bairros, silver };
