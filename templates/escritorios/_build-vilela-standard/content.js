// Conteúdo do Vilela Standard (advocacia). Tudo que é texto ou dado do escritório fica aqui.
// Marca, pessoas, registros na OAB, endereço, telefones e CNPJ são de demonstração: [EXEMPLO].
// Regras de publicidade da advocacia (Código de Ética e Disciplina da OAB e Provimento 205/2021 do CFOAB):
// nada de promessa de resultado, de valores de honorários, de formas de pagamento ou de chamada para captar clientela.

const marca = {
  nome: 'Vilela Rocha',
  completo: 'Vilela Rocha Advocacia',
  razao: 'Vilela Rocha Sociedade de Advogados', // [EXEMPLO]
  cnpj: '00.000.000/0001-00', // [EXEMPLO] fictício
  registroSociedade: 'Registro da sociedade na OAB/BA nº 0.000', // [EXEMPLO]
  responsavel: 'Helena Vilela, OAB/BA 10.101', // [EXEMPLO]
  desde: 2011, // [EXEMPLO]
  rua: 'Av. Tancredo Neves, 1.632, sala 1.208', // [EXEMPLO]
  bairro: 'Caminho das Árvores',
  cidade: 'Salvador',
  uf: 'BA',
  cep: '41820-020',
  telefone: '(71) 3000-0000', // [EXEMPLO]
  telefoneLink: '+557130000000',
  whatsapp: '5571900000000', // [EXEMPLO]
  whatsappTexto: '(71) 90000-0000',
  email: 'contato@vilelarocha.adv.br', // [EXEMPLO]
  instagram: 'https://www.instagram.com/',
  instagramUser: '@vilelarocha.adv', // [EXEMPLO]
  linkedin: 'https://www.linkedin.com/',
  dominio: 'https://vilelarocha.adv.br', // [EXEMPLO]
  mapsUrl: 'https://www.openstreetmap.org/?mlat=-12.98040&mlon=-38.45590#map=17/-12.98040/-38.45590',
  rotaUrl: 'https://www.openstreetmap.org/directions?to=-12.98040%2C-38.45590',
};

// dia da semana (0 = domingo) e faixa de atendimento, usados no "Aberto agora" e no agendamento
const horario = { 1: ['08:30', '18:00'], 2: ['08:30', '18:00'], 3: ['08:30', '18:00'], 4: ['08:30', '18:00'], 5: ['08:30', '17:00'] };
const horarioTexto = ['Segunda a quinta, das 8h30 às 18h', 'Sexta, das 8h30 às 17h', 'Sábado, domingo e feriados: fechado'];

const cidades = ['Salvador', 'Lauro de Freitas', 'Camaçari', 'Simões Filho', 'Candeias', 'Todo o Brasil por vídeo'];

// ---------- equipe ----------
const equipe = [
  {
    id: 'helena', nome: 'Helena Vilela', cargo: 'Sócia fundadora', oab: 'OAB/BA 10.101', // [EXEMPLO]
    foto: 'equipe-helena', areas: ['familia', 'civel'],
    frase: 'Em família, a pressa costuma custar caro. Começamos pelo que a pessoa precisa entender.',
    bio: [
      'Advogada desde 2008, fundou o escritório em 2011. Conduz os casos de família e sucessões e coordena a área cível.',
      'Especialista em Direito de Família e Sucessões, com formação em mediação de conflitos. Atua de forma consultiva, em acordos e em processos.',
    ],
    formacao: ['Direito, Universidade Federal da Bahia', 'Especialização em Família e Sucessões', 'Formação em mediação e conciliação'],
    agenda: [1, 2, 3, 4],
  },
  {
    id: 'rodrigo', nome: 'Rodrigo Rocha', cargo: 'Sócio', oab: 'OAB/BA 20.202', // [EXEMPLO]
    foto: 'equipe-rodrigo', areas: ['empresarial', 'trabalhista'],
    frase: 'Empresa bem orientada evita boa parte das disputas. O trabalho começa antes do problema.',
    bio: [
      'Atende empresas de pequeno e médio porte em contratos, estrutura societária e rotinas trabalhistas.',
      'Mestre em Direito Empresarial. Acompanha a empresa de forma contínua, com reuniões periódicas e relatórios por escrito.',
    ],
    formacao: ['Direito, Universidade Católica do Salvador', 'Mestrado em Direito Empresarial', 'MBA em Gestão de Empresas'],
    agenda: [1, 2, 4, 5],
  },
  {
    id: 'camila', nome: 'Camila Andrade', cargo: 'Advogada associada', oab: 'OAB/BA 30.303', // [EXEMPLO]
    foto: 'equipe-camila', areas: ['previdenciario'],
    frase: 'Cada contribuição conta uma parte da história. A gente reúne todas antes de pedir qualquer coisa.',
    bio: [
      'Cuida da área previdenciária: planejamento de aposentadoria, pedidos ao INSS, benefícios por incapacidade e revisões.',
      'Especialista em Direito Previdenciário. Faz a contagem do tempo e a leitura do CNIS antes de qualquer pedido.',
    ],
    formacao: ['Direito, Universidade Salvador', 'Especialização em Direito Previdenciário', 'Curso de cálculos previdenciários'],
    agenda: [1, 3, 5],
  },
  {
    id: 'tiago', nome: 'Tiago Nunes', cargo: 'Advogado associado', oab: 'OAB/BA 40.404', // [EXEMPLO]
    foto: 'equipe-tiago', areas: ['trabalhista', 'civel'],
    frase: 'Explicar o processo em linguagem simples faz parte do trabalho, não é um favor.',
    bio: [
      'Orienta trabalhadores e consumidores e acompanha processos trabalhistas e cíveis, do pedido à fase final.',
      'Especialista em Direito e Processo do Trabalho. Atende presencialmente e por videochamada.',
    ],
    formacao: ['Direito, Universidade Federal da Bahia', 'Especialização em Direito e Processo do Trabalho', 'Especialização em Direito do Consumidor'],
    agenda: [2, 3, 4, 5],
  },
];

// ---------- áreas e serviços ----------
// Cada serviço: para quem, o que inclui, documentos para a primeira reunião. Sem valores, por regra da OAB.
const areas = [
  {
    id: 'civel', nome: 'Cível', foto: 'documentos',
    resumo: 'Contratos, consumo, imóveis e reparação de danos, na prevenção e nos processos.',
    servicos: [
      { nome: 'Contratos e revisão contratual', para: 'Pessoas e empresas', inclui: ['Leitura e parecer por escrito', 'Ajustes de cláusulas e riscos', 'Notificações extrajudiciais'], docs: 'O contrato e as mensagens trocadas' },
      { nome: 'Direito do consumidor', para: 'Pessoas', inclui: ['Análise da cobrança ou do produto', 'Reclamação e tentativa de acordo', 'Ação no Juizado ou na Justiça comum'], docs: 'Notas, faturas, protocolos e prints' },
      { nome: 'Imóveis: compra, venda e locação', para: 'Pessoas e empresas', inclui: ['Análise de matrícula e certidões', 'Minuta e revisão de contrato', 'Acompanhamento até o registro'], docs: 'Matrícula, contrato e documentos das partes' },
    ],
  },
  {
    id: 'trabalhista', nome: 'Trabalhista', foto: 'consulta',
    resumo: 'Orientação a trabalhadores e a empresas, com prevenção, acordos e processos.',
    servicos: [
      { nome: 'Orientação ao trabalhador', para: 'Pessoas', inclui: ['Conferência de verbas rescisórias', 'Jornada, horas extras e adicionais', 'Ação e audiências quando necessário'], docs: 'Carteira, holerites, TRCT e controle de ponto' },
      { nome: 'Assessoria trabalhista para empresas', para: 'Empresas', inclui: ['Rotinas de RH e departamento pessoal', 'Auditoria e conformidade', 'Defesa em reclamações trabalhistas'], docs: 'Contratos de trabalho e políticas internas' },
    ],
  },
  {
    id: 'empresarial', nome: 'Empresarial', foto: 'contrato',
    resumo: 'Estrutura, contratos e rotina jurídica da empresa, com acompanhamento contínuo.',
    servicos: [
      { nome: 'Abertura e estrutura societária', para: 'Empresas', inclui: ['Escolha do tipo societário', 'Contrato social e acordo de sócios', 'Alterações e entrada ou saída de sócios'], docs: 'Documentos dos sócios e o plano do negócio' },
      { nome: 'Contratos empresariais', para: 'Empresas', inclui: ['Fornecedores, clientes e parceiros', 'Termos de uso e políticas de privacidade', 'Negociação acompanhada'], docs: 'Minutas atuais e propostas recebidas' },
      { nome: 'Consultoria jurídica mensal', para: 'Empresas', inclui: ['Advogado de referência para a empresa', 'Reunião mensal e relatório por escrito', 'Prioridade nas dúvidas do dia a dia'], docs: 'Contrato social e principais contratos' },
    ],
  },
  {
    id: 'familia', nome: 'Família e sucessões', curto: 'Família', foto: 'familia',
    resumo: 'Divórcio, guarda, pensão, inventário e planejamento sucessório, com sigilo e cuidado.',
    servicos: [
      { nome: 'Divórcio e união estável', para: 'Pessoas', inclui: ['Consensual em cartório ou na Justiça', 'Partilha de bens', 'Mediação entre as partes'], docs: 'Certidão de casamento e lista de bens' },
      { nome: 'Guarda, convivência e pensão', para: 'Pessoas', inclui: ['Acordo de guarda e convivência', 'Fixação e revisão de pensão', 'Acompanhamento de audiências'], docs: 'Certidão dos filhos e comprovantes de gastos' },
      { nome: 'Inventário e planejamento sucessório', para: 'Pessoas e empresas familiares', inclui: ['Inventário em cartório ou judicial', 'Testamento e doação em vida', 'Holding familiar, com a área empresarial'], docs: 'Certidão de óbito e documentos dos bens' },
    ],
  },
  {
    id: 'previdenciario', nome: 'Previdenciário', foto: 'casal-documentos',
    resumo: 'Planejamento de aposentadoria, benefícios do INSS e revisões, com contagem do tempo antes do pedido.',
    servicos: [
      { nome: 'Planejamento de aposentadoria', para: 'Pessoas', inclui: ['Leitura do CNIS e contagem do tempo', 'Simulação das regras possíveis', 'Relatório com as datas de cada regra'], docs: 'CNIS, carteiras de trabalho e carnês' },
      { nome: 'Benefícios por incapacidade e BPC', para: 'Pessoas', inclui: ['Pedido administrativo ao INSS', 'Preparo para a perícia', 'Recurso ou ação quando cabível'], docs: 'Laudos, exames e documentos pessoais' },
      { nome: 'Revisão de benefício', para: 'Pessoas', inclui: ['Conferência do cálculo do INSS', 'Parecer sobre a revisão possível', 'Pedido ou ação de revisão'], docs: 'Carta de concessão e extrato do benefício' },
    ],
  },
];

// regras que valem para todos os serviços (ficam junto dos cards)
const condicoes = {
  reuniao: 'Primeira reunião de 50 minutos, no escritório ou por videochamada.',
  retorno: 'Retorno em até 1 dia útil depois do primeiro contato.',
  honorarios: 'Honorários em proposta por escrito depois da reunião, com base na tabela da OAB/BA, e só começamos depois do contrato assinado.',
  remarcar: 'Remarcação ou cancelamento da reunião sem custo, avisando com 24 horas de antecedência.',
};

// ---------- como funciona o atendimento ----------
const atendimento = [
  { titulo: 'Primeiro contato', texto: 'Você conta em poucas linhas qual é o assunto, pelo formulário, WhatsApp ou telefone. Não precisa mandar documentos nem detalhes sigilosos nessa hora. Em até 1 dia útil, a equipe responde e marca a reunião.', nota: 'Formulário, WhatsApp ou telefone' },
  { titulo: 'Reunião de análise', texto: 'O advogado responsável pela área ouve a situação, lê os documentos e explica o que a lei diz, quais caminhos existem e o que cada um envolve, inclusive os riscos.', nota: '50 minutos, presencial ou vídeo' },
  { titulo: 'Proposta por escrito', texto: 'Você recebe por escrito o que será feito, as etapas previstas e os honorários. Decide com calma. O trabalho só começa depois do contrato assinado.', nota: 'Sem compromisso até a assinatura' },
  { titulo: 'Acompanhamento', texto: 'Um advogado de referência acompanha o caso e avisa a cada movimentação relevante, com explicação do que ela significa e do que vem depois.', nota: 'Canal direto com o advogado' },
];

const compromissos = [
  { titulo: 'Sem promessa de resultado', texto: 'O resultado depende de provas, da lei e da decisão de terceiros. Explicamos chances e riscos, nunca garantias.' },
  { titulo: 'Sigilo desde o primeiro contato', texto: 'Tudo o que você conta é protegido pelo sigilo profissional do Estatuto da Advocacia, mesmo que você não nos contrate.' },
  { titulo: 'Honorários sempre por escrito', texto: 'Proposta e contrato antes do início, sem cobrança surpresa e sem valores divulgados fora da reunião.' },
];

// ---------- números do escritório (sobre a estrutura, nunca sobre resultados) ----------
const numeros = [
  { valor: 2011, texto: 'ano de fundação', ano: true }, // [EXEMPLO]
  { valor: 5, texto: 'áreas de atuação' },
  { valor: 4, texto: 'advogados na equipe' },
  { valor: 1, texto: 'dia útil para o retorno' },
];

const valores = [
  { titulo: 'Confiança', texto: 'Construída desde o primeiro contato, com responsabilidade técnica e atenção ao que é particular de cada caso.' },
  { titulo: 'Clareza', texto: 'Linguagem simples, por escrito quando importa, para que cada decisão seja tomada entendendo o que está em jogo.' },
  { titulo: 'Proximidade', texto: 'Um advogado de referência para cada cliente, que atende, retorna e acompanha do começo ao fim.' },
];

// ---------- carrossel e galeria ----------
const carrossel = [
  { foto: 'recepcao', legenda: 'Recepção, no 12º andar' },
  { foto: 'sala-cidade', legenda: 'Sala de reunião com vista para a cidade' },
  { foto: 'salas-madeira', legenda: 'Salas de atendimento individual' },
  { foto: 'biblioteca', legenda: 'Biblioteca e espaço de estudo' },
  { foto: 'sala-reuniao', legenda: 'Sala de reuniões para empresas' },
];

const galeria = [
  { foto: 'recepcao', cat: 'Escritório', legenda: 'Recepção' },
  { foto: 'sala-vidro', cat: 'Escritório', legenda: 'Salas com divisórias de vidro' },
  { foto: 'sala-mesa', cat: 'Escritório', legenda: 'Sala de reunião redonda' },
  { foto: 'sala-trabalho', cat: 'Escritório', legenda: 'Sala de trabalho' },
  { foto: 'reuniao', cat: 'Atendimento', legenda: 'Reunião de análise' },
  { foto: 'atendimento', cat: 'Atendimento', legenda: 'Atendimento individual' },
  { foto: 'assinatura', cat: 'Atendimento', legenda: 'Assinatura de contrato' },
  { foto: 'mesa-trabalho', cat: 'Atendimento', legenda: 'Preparação de documentos' },
  { foto: 'livros-estante', cat: 'Estudo', legenda: 'Acervo de doutrina' },
  { foto: 'livros-mesa', cat: 'Estudo', legenda: 'Pesquisa para pareceres' },
  { foto: 'livros-direito', cat: 'Estudo', legenda: 'Biblioteca jurídica' },
  { foto: 'escrita', cat: 'Estudo', legenda: 'Revisão de peças' },
];

// ---------- depoimentos ----------
// Só sobre a forma de atendimento, nunca sobre casos ou resultados. São exemplos: publicar apenas com
// autorização por escrito de quem escreveu, e validar com a revisão jurídica. mostrar: false tira a seção.
const depoimentos = {
  mostrar: true,
  aviso: 'Depoimentos de exemplo, sobre a forma de atendimento. No site do escritório, só entram com autorização por escrito e sem mencionar casos ou resultados.',
  itens: [
    { nome: 'Marta S.', sobre: 'Família e sucessões', texto: 'Saí da primeira reunião entendendo cada etapa do inventário e o que dependia de mim. Recebi tudo por escrito no mesmo dia.' },
    { nome: 'Carlos E.', sobre: 'Empresarial', texto: 'O relatório mensal ajudou a organizar os contratos da empresa. Quando tenho dúvida, sei com quem falar.' },
    { nome: 'Joana P.', sobre: 'Previdenciário', texto: 'A Camila explicou as regras de aposentadoria com paciência e me mostrou as datas de cada uma antes de qualquer pedido.' },
    { nome: 'Renato A.', sobre: 'Trabalhista', texto: 'Atendimento por vídeo, sem precisar sair do trabalho. Sempre me avisaram do que estava acontecendo no processo.' },
  ],
};

// ---------- conteúdos (blog) ----------
const artigos = [
  {
    id: 'acao-trabalhista', area: 'trabalhista', titulo: 'Como a empresa pode prevenir conflitos trabalhistas', foto: 'sala-reuniao', autor: 'rodrigo', data: '2026-11-18', leitura: 5, destaque: true,
    resumo: 'Boas práticas na gestão de contratos, jornada e relações de trabalho ajudam a reduzir conflitos e trazem mais segurança para a empresa.',
    corpo: ['Boa parte das reclamações trabalhistas nasce de pontos simples: jornada sem controle confiável, acordos verbais que ninguém registrou e verbas pagas sem conferência.', 'Três cuidados ajudam desde já: manter o controle de ponto fiel à rotina real, registrar por escrito qualquer mudança de função ou horário e revisar a folha antes de cada rescisão.', 'Uma auditoria periódica das rotinas de RH mostra onde estão os riscos antes que virem processo. Este conteúdo é informativo e não substitui a análise do caso concreto.'],
  },
  {
    id: 'contrato-verbal', area: 'civel', titulo: 'Contrato verbal tem validade jurídica?', foto: 'documentos', autor: 'helena', data: '2026-11-04', leitura: 4,
    resumo: 'Mesmo sem documento escrito, alguns acordos podem ter validade legal, desde que atendam aos requisitos previstos na lei.',
    corpo: ['Na maior parte dos casos, a lei não exige forma escrita para o contrato valer. Um acordo verbal entre pessoas capazes, sobre algo lícito, já cria obrigações.', 'O desafio é a prova. Mensagens, comprovantes de pagamento, e-mails e testemunhas ajudam a demonstrar o que foi combinado.', 'Alguns contratos, como a compra e venda de imóveis acima de certo valor, exigem escritura pública. Na dúvida, colocar no papel continua sendo o caminho mais seguro. Conteúdo informativo, sem análise de caso concreto.'],
  },
  {
    id: 'fiscalizacao-inss', area: 'previdenciario', titulo: 'Como funciona a revisão de benefícios pelo INSS', foto: 'casal-contas', autor: 'camila', data: '2026-10-22', leitura: 5,
    resumo: 'Procedimentos de análise e revisão podem ser feitos pelo INSS para confirmar a regularidade dos benefícios.',
    corpo: ['O INSS pode revisar benefícios já concedidos para conferir se os requisitos continuam presentes, principalmente nos benefícios por incapacidade.', 'Quem recebe uma convocação deve ficar atento ao prazo, reunir laudos e exames atualizados e comparecer à perícia marcada.', 'Se o benefício for suspenso, existe prazo para recorrer. Guardar a carta recebida e o protocolo é essencial. Conteúdo informativo, que não substitui a orientação para o caso concreto.'],
  },
  {
    id: 'rescisao-indireta', area: 'trabalhista', titulo: 'Quais situações podem gerar rescisão indireta do contrato?', foto: 'mesa-trabalho', autor: 'tiago', data: '2026-10-09', leitura: 4,
    resumo: 'A lei prevê casos em que o trabalhador pode pedir o fim do contrato por descumprimento das obrigações do empregador.',
    corpo: ['A rescisão indireta está no artigo 483 da CLT. Ela ocorre quando o empregador descumpre obrigações importantes, como atrasar salários com frequência ou deixar de recolher o FGTS.', 'Cada situação precisa ser comprovada. Por isso, reunir holerites, extratos do FGTS e mensagens antes de qualquer decisão é importante.', 'Decidir sair sem orientação pode trazer riscos. Este conteúdo é informativo e não substitui a análise do caso.'],
  },
  {
    id: 'inventario-cartorio', area: 'familia', titulo: 'Quando o inventário pode ser feito em cartório', foto: 'casal-sofa', autor: 'helena', data: '2026-09-25', leitura: 4,
    resumo: 'O inventário extrajudicial costuma ser mais rápido, mas depende de alguns requisitos entre os herdeiros.',
    corpo: ['O inventário pode ser feito em cartório quando todos os herdeiros estão de acordo com a partilha e são representados por advogado.', 'Regras recentes passaram a admitir o inventário em cartório mesmo com herdeiros menores ou com testamento, em situações específicas e com cuidados adicionais.', 'Reunir certidões, documentos dos bens e comprovantes de dívidas antes de começar evita atrasos. Conteúdo informativo, sem análise de caso concreto.'],
  },
  {
    id: 'cobranca-indevida', area: 'civel', titulo: 'Cobrança indevida: o que fazer antes de ir à Justiça', foto: 'contrato', autor: 'tiago', data: '2026-08-28', leitura: 4,
    resumo: 'Reunir provas e registrar a reclamação nos canais certos costuma resolver boa parte dos casos sem processo.',
    corpo: ['Quem recebe uma cobrança que não reconhece deve guardar a fatura, os comprovantes de pagamento e o histórico de contato com a empresa.', 'O primeiro passo é a reclamação formal no SAC, com número de protocolo. Se não houver solução, a plataforma consumidor.gov.br e o Procon são caminhos gratuitos.', 'O Código de Defesa do Consumidor prevê a devolução em dobro do que foi pago indevidamente, salvo engano justificável. Conteúdo informativo, que não substitui a análise do caso concreto.'],
  },
  {
    id: 'acordo-socios', area: 'empresarial', titulo: 'Por que o acordo de sócios evita disputas', foto: 'assinatura', autor: 'rodrigo', data: '2026-09-11', leitura: 5,
    resumo: 'Combinar por escrito como os sócios decidem, entram e saem do negócio protege a empresa nos momentos difíceis.',
    corpo: ['O contrato social trata do básico. O acordo de sócios vai além e define como as decisões são tomadas, o que acontece se alguém quiser sair e como a empresa é avaliada.', 'Cláusulas de preferência na venda de quotas, regras para retirada de lucros e solução de impasses evitam que uma divergência pare o negócio.', 'O melhor momento para assinar é no começo, quando todos estão de acordo. Conteúdo informativo, que não substitui a orientação para o caso concreto.'],
  },
];

// ---------- Instagram (perfil fictício, conteúdo informativo) ----------
const instagram = [
  { foto: 'livros-direito', texto: 'Glossário: o que é tutela de urgência' },
  { foto: 'casal-documentos', texto: 'Documentos para planejar a aposentadoria' },
  { foto: 'reuniao', texto: 'Como se preparar para a primeira reunião' },
  { foto: 'contrato', texto: 'Três cláusulas que todo contrato precisa ter' },
  { foto: 'familia', texto: 'Guarda compartilhada em linguagem simples' },
  { foto: 'sala-cidade', texto: 'Bastidores: nossa sala de reuniões' },
];

// ---------- FAQ ----------
const faq = [
  ['A primeira reunião é paga?', 'A forma da primeira reunião é informada no contato inicial, antes de marcar. Honorários de cada caso são combinados por escrito depois da reunião, com base na tabela da OAB/BA, e o site não divulga valores por regra da OAB.'],
  ['Vocês garantem que vou ganhar a causa?', 'Não. Nenhum advogado pode prometer resultado. Explicamos o que a lei diz, as provas que existem, os caminhos possíveis e os riscos de cada um, para você decidir.'],
  ['Posso ser atendido por videochamada?', 'Sim. Reuniões, assinatura de contrato e acompanhamento podem ser feitos a distância. Atendemos pessoas e empresas de todo o Brasil nas áreas em que a atuação não depende de presença em audiência local.'],
  ['O que devo levar na primeira reunião?', 'Documento com foto e o que tiver sobre o assunto: contratos, mensagens, comprovantes, cartas do INSS ou holerites. Cada card de serviço mostra a lista principal.'],
  ['O que eu conto fica em sigilo?', 'Sim. O sigilo profissional está no Estatuto da Advocacia e vale desde o primeiro contato, mesmo que você decida não contratar. Por isso pedimos que não mande detalhes sigilosos pelo formulário do site.'],
  ['Como acompanho o andamento do meu processo?', 'Você tem um advogado de referência e recebe uma mensagem a cada movimentação relevante, com a explicação do que ela significa. Também pode pedir um resumo por escrito a qualquer momento.'],
  ['Vocês atendem urgências, como prazos correndo?', 'Se houver prazo correndo, audiência marcada ou risco de perder um direito, ligue ou mande WhatsApp dizendo "prazo". O formulário do site não é o canal para urgências.'],
];

// ---------- políticas ----------
const politicas = [
  {
    id: 'atendimento', titulo: 'Política de atendimento',
    itens: [
      'Atendemos com hora marcada, no escritório ou por videochamada, de segunda a sexta, no horário informado no rodapé.',
      'O primeiro contato serve para entender o assunto e marcar a reunião. Orientação jurídica sobre o caso só é dada na reunião, pelo advogado responsável.',
      'Cada cliente tem um advogado de referência, que responde em até 1 dia útil pelos canais combinados.',
      'Não enviamos mensagens oferecendo serviços a quem não nos procurou e não atuamos por indicação paga.',
    ],
  },
  {
    id: 'honorarios', titulo: 'Honorários',
    itens: [
      'Os honorários são definidos depois da reunião de análise, em proposta escrita, com base na tabela de honorários da OAB/BA e na complexidade do caso.',
      'Nada é cobrado antes de você receber a proposta e decidir. O trabalho começa com o contrato de honorários assinado pelas duas partes.',
      'O contrato diz o que está incluído, as etapas, as despesas que podem existir (custas, cópias, deslocamentos) e quem paga cada uma.',
      'Por regra do Provimento 205/2021 do Conselho Federal da OAB, o site não divulga valores, gratuidade ou formas de pagamento.',
    ],
  },
  {
    id: 'confidencialidade', titulo: 'Confidencialidade',
    itens: [
      'Tudo o que você conta ao escritório é protegido pelo sigilo profissional previsto no Estatuto da Advocacia (Lei 8.906/1994), mesmo sem contratação.',
      'Documentos recebidos ficam em pasta restrita à equipe do caso e são devolvidos ou apagados ao fim do trabalho, salvo guarda exigida por lei.',
      'Os dados enviados pelo site são tratados como confidenciais e usados só para responder ao seu pedido, conforme a Política de privacidade.',
      'Pedimos que o formulário traga só o assunto. Detalhes e documentos ficam para a reunião ou para o canal seguro que indicaremos.',
    ],
  },
  {
    id: 'agenda', titulo: 'Agendamento, atraso e cancelamento',
    itens: [
      'A reunião é confirmada por WhatsApp ou e-mail, com data, horário, formato e o advogado responsável.',
      'Atrasos de até 15 minutos são esperados. Depois disso, a reunião pode ser encurtada ou remarcada para não atrasar o próximo atendimento.',
      'Cancelamento ou remarcação sem custo com 24 horas de antecedência, pelos mesmos canais.',
      'Casos com prazo correndo ou audiência próxima têm prioridade na agenda. Avise "prazo" no primeiro contato.',
    ],
  },
  {
    id: 'sensiveis', titulo: 'Casos que pedem cuidado redobrado', destaque: true,
    itens: [
      'Família e sucessões: reuniões em sala reservada, sem a presença da outra parte, e informações sobre crianças nunca saem do processo.',
      'Prazos processuais e urgências: confirmamos por escrito a data-limite e quem é o responsável, assim que o caso chega.',
      'Saúde e benefícios por incapacidade: laudos e exames são dados sensíveis pela LGPD e ficam restritos ao advogado do caso.',
    ],
  },
];

module.exports = { marca, horario, horarioTexto, cidades, equipe, areas, condicoes, atendimento, compromissos, numeros, valores, carrossel, galeria, depoimentos, artigos, instagram, faq, politicas };
