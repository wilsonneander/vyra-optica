// Conteúdo do modelo Bronze de estética (Camélia Estética, marca fictícia).
// [EXEMPLO] = trocar pelos dados do cliente. Todos os preços, prazos e números de registro são [EXEMPLO].
// [JURÍDICO] = texto que precisa passar pela revisão jurídica antes de ir para um cliente real.
//
// Ligar ou desligar segmentos: mude `ativo` em `segmentos`. O que estiver desligado some do site inteiro
// (menu, capa, preços, formulário, rodapé). Na prévia também dá para testar pelo link: ?seg=facial,corporal

const marca = {
  nome: 'Camélia',
  completo: 'Camélia Estética',
  frase: 'Estética facial, corporal e de beleza no Cambuí, com avaliação antes de qualquer protocolo.',
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
  nome: 'Helena Prado',
  cargo: 'Biomédica esteta, responsável técnica',
  registro: 'CRBM-1 nº 00000', // [EXEMPLO] fictício
  foto: 'responsavel',
  texto: 'Formada em Biomedicina, com habilitação em estética. Cuida dos protocolos, da avaliação de pele e do treinamento da equipe. Cada plano passa por ela antes da primeira sessão.',
  equipe: 'Os atendimentos de depilação, cílios e sobrancelhas são feitos por esteticistas com curso técnico, sob a supervisão dela.',
};

// horário por dia da semana (0 = domingo), em horas decimais; null = fechado
const abertura = [null, [9, 20], [9, 20], [9, 20], [9, 20], [9, 20], [8, 14]];
const horarios = [['Segunda a sexta', '9h às 20h'], ['Sábado', '8h às 14h'], ['Domingo e feriado', 'Fechado']];

// fotos: arquivo em img/fotos/<nome>.webp. Sem o arquivo, o site mostra um espaço reservado com a descrição.
const fotos = {
  capa: 'Esteticista fazendo limpeza de pele em cliente deitada na maca, luz clara',
  facial: 'Aplicação de máscara facial com pincel',
  corporal: 'Mãos fazendo drenagem linfática nas costas da cliente',
  depilacao: 'Design de sobrancelha com pinça, cliente de olhos fechados',
  avaliacao: 'Profissional conversando com a cliente na avaliação, com ficha na mão',
  responsavel: 'Retrato da responsável técnica, de jaleco, sorrindo',
  'galeria-recepcao': 'Recepção clara com poltrona e plantas',
  'galeria-sala': 'Sala de atendimento com maca forrada de branco',
  'galeria-produtos': 'Frascos de sérum e cremes sobre bancada de mármore',
  'galeria-toalhas': 'Toalhas dobradas e ramo de eucalipto',
  'galeria-cilios': 'Detalhe de extensão de cílios sendo aplicada',
  'galeria-mao': 'Mãos com luva aplicando sérum no rosto',
};

// Segmentos e tratamentos. Preço: `de` = "a partir de"; `preco` = valor fechado.
const segmentos = [
  {
    id: 'facial', ativo: true, nome: 'Estética facial', curto: 'Facial', foto: 'facial',
    chamada: 'Limpeza, peelings, hidratação e rejuvenescimento, com o protocolo escolhido pelo seu tipo de pele.',
    itens: [
      {
        nome: 'Avaliação facial', resumo: 'Análise da pele com lupa e conversa sobre rotina, histórico e o que te incomoda.',
        duracao: '40 min', sessoes: 'Visita única', preco: 0, gratis: 'Sem custo',
        inclui: ['Ficha de anamnese', 'Análise da pele com lupa de aumento', 'Plano por escrito com número de sessões e valores', 'Indicação de cuidados em casa'],
      },
      {
        nome: 'Limpeza de pele profunda', resumo: 'Tira cravos e impurezas e devolve o viço sem agredir a pele.',
        duracao: '1h30', sessoes: 'Sessão avulsa, repetir a cada 30 a 45 dias', preco: 180, pacote: [3, 480],
        inclui: ['Higienização e esfoliação', 'Emoliência e extração manual', 'Alta frequência', 'Máscara calmante', 'Protetor solar ao final'],
      },
      {
        nome: 'Hidratação facial profunda', resumo: 'Para pele seca, repuxando ou opaca depois do sol ou do frio.',
        duracao: '50 min', sessoes: 'Sessão avulsa', preco: 150,
        inclui: ['Limpeza e tonificação', 'Ativos hidratantes com ácido hialurônico tópico', 'Massagem facial', 'Máscara de tratamento'],
      },
      {
        nome: 'Peeling químico superficial', resumo: 'Renova a camada mais externa da pele para uniformizar o tom e a textura.',
        duracao: '40 min', sessoes: '4 sessões, a cada 15 dias', de: 220, pacote: [4, 760],
        inclui: ['Preparo da pele', 'Aplicação do ácido escolhido na avaliação', 'Neutralização e calmante', 'Kit de protetor solar para os dias seguintes'],
      },
      {
        nome: 'Microagulhamento', resumo: 'Estimula a produção de colágeno. Indicado para marcas de acne, poros e linhas finas.',
        duracao: '1h', sessoes: '3 a 4 sessões, a cada 30 dias', de: 350, pacote: [3, 960],
        inclui: ['Anestésico tópico', 'Caneta de microagulhamento com ponteira descartável', 'Ativos aplicados durante a sessão', 'Máscara de LED calmante'],
      },
      {
        nome: 'Rejuvenescimento com radiofrequência', resumo: 'Calor controlado para dar firmeza à pele do rosto e do pescoço, sem agulha.',
        duracao: '50 min', sessoes: '6 a 8 sessões, uma por semana', de: 200, pacote: [6, 1050],
        inclui: ['Limpeza', 'Radiofrequência no rosto e no pescoço', 'Massagem com ativo firmador', 'Protetor solar'],
      },
    ],
    // protocolos por tipo de pele (mostrados no bloco facial)
    peles: [
      ['Oleosa ou com acne', 'Limpeza profunda a cada 30 dias e peeling suave. Microagulhamento só depois que a acne ativa acalma.'],
      ['Seca ou desidratada', 'Hidratação profunda mensal e, no inverno, sessões a cada 15 dias.'],
      ['Sensível ou com rosácea', 'Protocolos sem calor e sem extração forte. Teste de ativo antes da primeira sessão.'],
      ['Madura', 'Radiofrequência e microagulhamento, intercalados com hidratação.'],
      ['Com manchas', 'Peeling em série e protetor solar todos os dias. O plano começa fora do verão.'],
    ],
  },
  {
    id: 'corporal', ativo: true, nome: 'Estética corporal', curto: 'Corporal', foto: 'corporal',
    chamada: 'Massagens, drenagem e protocolos para celulite e gordura localizada, avulsos ou em pacotes de sessões.',
    itens: [
      {
        nome: 'Drenagem linfática manual', resumo: 'Movimentos leves que ajudam a reduzir o inchaço e a sensação de peso nas pernas.',
        duracao: '1h', sessoes: 'Avulsa ou pacote de 10', preco: 140, pacote: [10, 1200],
        inclui: ['Corpo inteiro, do pescoço aos pés', 'Óleo neutro ou creme', 'Orientação de hidratação'],
      },
      {
        nome: 'Massagem modeladora', resumo: 'Manobras firmes e rápidas, focadas em abdômen, quadril e coxas.',
        duracao: '50 min', sessoes: 'Pacote de 10, duas vezes por semana', de: 130, pacote: [10, 1100],
        inclui: ['Áreas escolhidas na avaliação', 'Creme com ativos', 'Medidas no início e no fim do pacote'],
      },
      {
        nome: 'Massagem relaxante', resumo: 'Para soltar a musculatura e desacelerar. Pressão combinada com você.',
        duracao: '1h', sessoes: 'Sessão avulsa', preco: 150,
        inclui: ['Óleo aquecido', 'Aromaterapia', 'Toalha quente nos pés'],
      },
      {
        nome: 'Protocolo para celulite', resumo: 'Radiofrequência corporal, massagem e ativos, combinados conforme o grau da celulite.',
        duracao: '1h', sessoes: '10 sessões, duas por semana', de: 1400, pacoteSo: true,
        inclui: ['Avaliação com fotos de acompanhamento (com sua autorização)', 'Radiofrequência corporal', 'Massagem modeladora', 'Ativos de uso em casa'],
      },
      {
        nome: 'Protocolo para gordura localizada', resumo: 'Ultrassom e radiofrequência em abdômen, flancos ou culote.',
        duracao: '50 min', sessoes: '10 sessões, duas por semana', de: 1300, pacoteSo: true,
        inclui: ['Medidas e bioimpedância no início e no fim', 'Ultrassom focado', 'Radiofrequência', 'Drenagem ao final da sessão'],
      },
    ],
  },
  {
    id: 'depilacao', ativo: true, nome: 'Depilação, cílios e sobrancelhas', curto: 'Depilação e olhar', foto: 'depilacao',
    chamada: 'Laser e cera com preço por área, design de sobrancelhas, extensão de cílios e lash lifting.',
    itens: [
      {
        nome: 'Design de sobrancelhas', resumo: 'Desenho feito a partir das medidas do seu rosto, com pinça e linha.',
        duracao: '40 min', sessoes: 'Manutenção a cada 20 a 30 dias', preco: 60, extra: 'Com henna, R$ 80',
        inclui: ['Mapeamento do desenho', 'Retirada com pinça e linha', 'Retoque sem custo em até 7 dias'],
      },
      {
        nome: 'Brow lamination', resumo: 'Alinha e fixa os fios para a sobrancelha parecer mais cheia.',
        duracao: '1h', sessoes: 'Dura de 4 a 6 semanas', preco: 140,
        inclui: ['Design incluso', 'Nutrição dos fios ao final', 'Teste de alergia 48h antes'],
      },
      {
        nome: 'Extensão de cílios fio a fio', resumo: 'Um fio sintético colado em cada cílio natural, efeito discreto.',
        duracao: '2h', sessoes: 'Manutenção a cada 15 a 21 dias', preco: 220, extra: 'Manutenção, R$ 120. Volume russo, R$ 280',
        inclui: ['Escolha de curvatura e tamanho', 'Cola hipoalergênica', 'Reposição de fios caídos em até 72h', 'Teste de alergia 48h antes'],
      },
      {
        nome: 'Lash lifting', resumo: 'Curva os seus próprios cílios, sem extensão. Dura de 6 a 8 semanas.',
        duracao: '1h', sessoes: 'Sessão avulsa', preco: 150,
        inclui: ['Curvatura e fixação', 'Tintura dos fios', 'Nutrição ao final'],
      },
    ],
    // preço por área: [área, cera, laser por sessão]
    areas: [
      ['Buço', 20, 70], ['Axilas', 30, 90], ['Virilha completa', 70, 140], ['Meia perna', 45, 180],
      ['Perna inteira', 75, 290], ['Braços', 45, 160], ['Abdômen (linha)', 20, 80],
    ],
    laserNota: 'Laser de diodo com registro na Anvisa. Pacote de 10 sessões com 15% de desconto. Antes da primeira sessão fazemos o teste em uma pequena área.',
  },
];

const pagamento = [
  ['Formas de pagamento', 'Pix, débito e crédito. Sessão avulsa em até 3x e pacotes em até 10x sem juros no cartão.'],
  ['Pacotes de sessões', 'Valem por 6 meses a partir da primeira sessão. O plano sai por escrito na avaliação, com o número de sessões e o valor total.'],
  ['Garantia do serviço', 'Retoque do design em até 7 dias, reposição de cílios caídos em até 72h e remarcação sem custo de sessão perdida por falha nossa. Garantimos o serviço bem feito, não um resultado específico.'],
];

// etapas do atendimento (mostradas como linha do tempo, sem número)
const etapas = [
  ['Avaliação', 'Conversa, ficha de saúde e análise da pele ou da área. Sem custo e sem compromisso de fechar nada.'],
  ['Plano por escrito', 'Tratamento indicado, número de sessões, intervalo, valor e cuidados em casa.'],
  ['Sessões', 'Com hora marcada, material descartável ou esterilizado aberto na sua frente.'],
  ['Retorno', 'Revisamos como a pele respondeu e ajustamos o plano se for preciso.'],
];

// [JURÍDICO] lista geral; a avaliação verifica cada caso
const contraindicacoes = [
  'Gravidez e amamentação: sem peelings, laser, radiofrequência e alguns ativos.',
  'Uso de isotretinoína nos últimos 6 meses: sem peeling, microagulhamento, laser e cera.',
  'Pele com ferida, herpes ativo, acne inflamada ou queimadura de sol na área.',
  'Marca-passo, implante metálico ou prótese na área: sem radiofrequência e ultrassom.',
  'Distúrbios de coagulação, diabetes descompensado ou doença de pele em crise: só com liberação médica.',
  'Trombose, insuficiência cardíaca ou renal: drenagem e massagem só com liberação médica.',
];

// [JURÍDICO]
const politicas = [
  ['Avaliação prévia', 'Todo tratamento facial e corporal e toda primeira sessão de laser começam pela avaliação. Nela você preenche a ficha de saúde, tira dúvidas e recebe o plano por escrito. Para cílios, henna e brow lamination fazemos teste de alergia 48h antes.'],
  ['Agendamento', 'Pelo WhatsApp ou pelo formulário desta página. Confirmamos por mensagem um dia antes. A sessão é sua por hora marcada, sem encaixe de outra cliente no mesmo horário.'],
  ['Cancelamento', 'Cancele ou remarque sem custo até 24h antes. Com menos de 24h, a sessão avulsa é cobrada em 50% e a sessão de pacote conta como feita. Imprevisto de saúde com atestado não entra nessa regra.'],
  ['Remarcação e atraso', 'Remarque quantas vezes precisar dentro da validade do pacote, respeitando as 24h. Toleramos 15 minutos de atraso; depois disso a sessão é encurtada ou remarcada, para não atrasar a próxima cliente.'],
  ['Desistência de pacote', 'Você pode desistir a qualquer momento. Devolvemos o valor das sessões não feitas, calculado pelo preço do pacote, descontados 10% de custo administrativo.'],
];

// [JURÍDICO] conferir registros reais da clínica
const seguranca = [
  ['Material descartável', 'Agulhas, ponteiras, lençol, touca e espátulas são de uso único e abertos na sua frente.'],
  ['Esterilização em autoclave', 'Pinças e instrumentos metálicos passam por limpeza, embalagem e autoclave, com registro de cada ciclo.'],
  ['Registro na Anvisa', 'Equipamentos e produtos usados nos protocolos têm registro ou notificação na Anvisa, conforme exigido para cada item.'],
  ['Licença sanitária', 'Clínica com alvará e licença da Vigilância Sanitária de Campinas, renovados todo ano.'],
];

// [JURÍDICO] aviso de resultados conforme regras de publicidade do setor
const avisoResultado = 'Cada pele responde de um jeito. Os tratamentos não prometem cura nem resultado garantido, e o número de sessões pode mudar depois da avaliação. Fotos de antes e depois só são usadas com autorização por escrito da cliente.';

const faq = [
  ['A avaliação é paga?', 'Não. A primeira avaliação é sem custo e não obriga você a fechar pacote.'],
  ['Posso fazer só um tratamento avulso?', 'Pode. Os pacotes saem mais em conta, mas toda sessão também tem preço avulso, exceto os protocolos de celulite e gordura localizada, que só funcionam em série.'],
  ['Dói?', 'A maioria dos tratamentos é tranquila. Microagulhamento e laser incomodam um pouco; usamos anestésico tópico e resfriamento.'],
  ['Atendem homens?', 'Sim. Todos os tratamentos e a depilação a laser também são feitos em homens.'],
  ['Tem estacionamento?', 'O prédio tem estacionamento rotativo conveniado. Avise na recepção para validar o tíquete.'],
];

const bairros = ['Cambuí', 'Centro', 'Guanabara', 'Taquaral', 'Nova Campinas', 'Castelo', 'Barão Geraldo', 'Valinhos']; // [EXEMPLO]

module.exports = { marca, responsavel, abertura, horarios, fotos, segmentos, pagamento, etapas, contraindicacoes, politicas, seguranca, avisoResultado, faq, bairros };
