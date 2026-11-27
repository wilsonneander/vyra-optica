// Prumo Premium: conteúdo da Prumo Contabilidade (marca de demonstração, Curitiba).
// Marca, pessoas, registros no CRC, endereço, telefones, CNPJ, depoimentos e perfis são de demonstração: [EXEMPLO].
// Publicidade da contabilidade (Código de Ética Profissional do Contador, NBC PG 01, e normas do CFC): anúncio sóbrio,
// com o registro no CRC, sem aviltamento de honorários, sem concorrência desleal e sem promessa de resultado.
// Por isso o site não mostra valores de honorários nem "economia garantida". Textos a validar na revisão jurídica.

const marca = {
  nome: 'Prumo',
  completo: 'Prumo Contabilidade',
  razao: 'Prumo Serviços Contábeis Ltda.', // [EXEMPLO]
  cnpj: '00.000.000/0001-00', // [EXEMPLO] fictício
  registroEmpresa: 'Organização contábil registrada no CRC-PR sob o nº 000000/O-0', // [EXEMPLO]
  responsavel: 'Laura Tavares, contadora, CRC-PR 010101/O-1', // [EXEMPLO]
  desde: 2011,
  rua: 'Av. do Batel, 1550, conj. 804', // [EXEMPLO]
  bairro: 'Batel',
  cidade: 'Curitiba',
  uf: 'PR',
  cep: '80420-090', // [EXEMPLO]
  telefone: '(41) 3000-0000', // [EXEMPLO]
  telefoneLink: '+554130000000',
  whatsapp: '5541900000000', // [EXEMPLO]
  whatsappTexto: '(41) 90000-0000',
  email: 'ola@prumocontabilidade.com.br', // [EXEMPLO]
  dominio: 'https://prumocontabilidade.com.br', // [EXEMPLO]
  instagram: 'https://instagram.com/prumo.contabil', // [EXEMPLO]
  instagramUser: '@prumo.contabil',
  linkedin: 'https://www.linkedin.com/company/prumo-contabilidade', // [EXEMPLO]
  mapsUrl: 'https://www.openstreetmap.org/?mlat=-25.44270&mlon=-49.29010#map=17/-25.44270/-49.29010',
  rotaUrl: 'https://www.openstreetmap.org/directions?to=-25.44270%2C-49.29010',
};

// horário por dia da semana (0 = domingo); null = fechado
const horario = { 0: null, 1: ['08:30', '18:00'], 2: ['08:30', '18:00'], 3: ['08:30', '18:00'], 4: ['08:30', '18:00'], 5: ['08:30', '17:00'], 6: null };
const horarioTexto = ['Segunda a quinta, das 8h30 às 18h', 'Sexta, das 8h30 às 17h', 'Sábado, domingo e feriados: fechado', 'WhatsApp com resposta no mesmo dia útil'];

// frentes de serviço (segmentos). Honorários nunca aparecem em valor: proposta por escrito após o diagnóstico.
const segmentos = [
  {
    id: 'abertura', nome: 'Abertura e regularização', curto: 'Abertura', foto: 'dupla-estudio',
    resumo: 'Para quem vai abrir, sair do MEI, trocar de contador ou colocar a casa em ordem.',
    servicos: [
      { nome: 'Abertura de empresa', para: 'Quem vai começar ou deixar o MEI', prazo: '10 a 30 dias úteis, conforme Junta Comercial e prefeitura',
        inclui: ['Escolha do tipo de empresa e das atividades (CNAE)', 'Contrato social e registro na Junta', 'CNPJ, inscrições e alvará', 'Regime tributário inicial simulado'] },
      { nome: 'Troca de contador', para: 'Empresas que querem mudar de escritório', prazo: 'Transição em até 30 dias',
        inclui: ['Levantamento de pendências e certidões', 'Pedido formal de documentos ao escritório anterior', 'Conferência dos saldos de abertura', 'Calendário de obrigações do primeiro mês'] },
      { nome: 'Regularização e baixa', para: 'CNPJ com pendências ou que vai encerrar', prazo: 'Cronograma na proposta, conforme as pendências',
        inclui: ['Diagnóstico de débitos e obrigações em atraso', 'Parcelamentos e certidões negativas', 'Entrega das declarações pendentes', 'Baixa do CNPJ e das inscrições'] },
    ],
  },
  {
    id: 'contabil', nome: 'Contabilidade consultiva', curto: 'Contábil', foto: 'graficos-papel',
    resumo: 'Escrituração em dia e relatórios que você consegue ler, com reunião para explicar.',
    servicos: [
      { nome: 'Escrituração e balanço', para: 'Empresas de qualquer regime', prazo: 'Mensal, com fechamento até o dia 20',
        inclui: ['Lançamentos e conciliação bancária', 'Balancete mensal', 'Balanço patrimonial e DRE anuais', 'ECD e ECF'] },
      { nome: 'Relatórios gerenciais', para: 'Quem quer decidir com números do mês', prazo: 'Mensal, com reunião trimestral de 60 min',
        inclui: ['DRE gerencial por centro de custo', 'Indicadores de margem e de caixa', 'Comparativo com o orçamento', 'Reunião trimestral com a contadora'] },
    ],
  },
  {
    id: 'fiscal', nome: 'Fiscal e tributário', curto: 'Tributário', foto: 'calculadora-oculos',
    resumo: 'Guias no prazo, regime revisto todo ano e a transição para o IBS e a CBS acompanhada.',
    servicos: [
      { nome: 'Apuração de tributos', para: 'Simples Nacional, Lucro Presumido ou Lucro Real', prazo: 'Mensal, guias enviadas até 5 dias antes do vencimento',
        inclui: ['Cálculo e emissão das guias', 'Obrigações acessórias (SPED, DCTFWeb, EFD-Reinf)', 'Calendário fiscal no portal', 'Conferência das notas emitidas e recebidas'] },
      { nome: 'Revisão de enquadramento', para: 'Quem quer saber se está no regime certo', prazo: '15 dias úteis, de outubro a janeiro',
        inclui: ['Simulação dos três regimes com os seus números', 'Análise do Fator R e das atividades', 'Relatório escrito com as premissas', 'Reunião para apresentar o estudo'] },
      { nome: 'Reforma tributária (IBS e CBS)', para: 'Empresas que querem se preparar para a transição', prazo: '20 dias úteis',
        inclui: ['Diagnóstico do impacto de 2026 a 2033', 'Ajuste de cadastros e notas fiscais', 'Revisão dos créditos aproveitáveis', 'Plano de acompanhamento ano a ano'] },
    ],
  },
  {
    id: 'pessoal', nome: 'Departamento pessoal', curto: 'Pessoal', foto: 'reuniao-quadro',
    resumo: 'Folha, eSocial e FGTS Digital sem atraso, e cada admissão ou desligamento conferido.',
    servicos: [
      { nome: 'Folha e eSocial', para: 'Empresas com funcionários ou só com pró-labore', prazo: 'Mensal, folha pronta até o 5º dia útil',
        inclui: ['Folha, pró-labore, férias e 13º', 'eSocial, DCTFWeb e FGTS Digital', 'Holerites no portal', 'Provisões para o fluxo de caixa'] },
      { nome: 'Admissões e desligamentos', para: 'Cada contratação ou saída', prazo: 'Admissão em 1 dia útil; rescisão em até 10 dias',
        inclui: ['Contrato e registro', 'Exames e documentos exigidos', 'Cálculo de rescisão conferido duas vezes', 'Orientação sobre aviso e acordo'] },
    ],
  },
  {
    id: 'bpo', nome: 'BPO financeiro', curto: 'Financeiro', foto: 'laptop-grafico',
    resumo: 'A rotina do financeiro feita por nós, com a sua aprovação em cada pagamento.',
    servicos: [
      { nome: 'Contas a pagar e a receber', para: 'Empresas sem financeiro próprio', prazo: 'Rotina diária ou semanal, combinada no contrato',
        inclui: ['Agendamento de pagamentos com sua aprovação', 'Emissão de boletos e cobrança', 'Conciliação bancária diária', 'Relatório semanal de caixa'] },
      { nome: 'Fluxo de caixa e orçamento', para: 'Quem quer prever o caixa', prazo: 'Projeção mensal, revisão a cada trimestre',
        inclui: ['Projeção de 13 semanas', 'Orçamento anual', 'Alertas de aperto de caixa', 'Reunião de acompanhamento'] },
    ],
  },
  {
    id: 'pf', nome: 'Pessoa física', curto: 'Pessoa física', foto: 'anotacoes',
    resumo: 'Imposto de renda, carnê-leão e ganho de capital para você e para a família.',
    servicos: [
      { nome: 'Declaração de imposto de renda', para: 'Assalariados, sócios, profissionais liberais e aposentados', prazo: 'Entrega em até 10 dias úteis após os documentos',
        inclui: ['Lista de documentos personalizada', 'Conferência com a pré-preenchida', 'Declaração e recibo', 'Acompanhamento da malha fina'] },
      { nome: 'Carnê-leão e ganho de capital', para: 'Aluguéis, autônomos e venda de bens', prazo: 'Mensal ou por evento',
        inclui: ['Carnê-leão mensal', 'Apuração de ganho de capital', 'Guias e prazos', 'Orientação antes de vender um imóvel'] },
    ],
  },
];

// profissionais: agenda = dias da semana em que atendem (0 = domingo)
const equipe = [
  {
    id: 'laura', nome: 'Laura Tavares', cargo: 'Sócia fundadora e responsável técnica', crc: 'CRC-PR 010101/O-1', // [EXEMPLO]
    foto: 'equipe-laura', segmentos: ['contabil', 'fiscal'], agenda: [1, 2, 4], desde: 2011,
    frase: 'Número bom é número que o dono da empresa entende.',
    bio: ['Fundou a Prumo em 2011 depois de dez anos em auditoria. Cuida da contabilidade consultiva e assina como responsável técnica pelo escritório.', 'Acompanha de perto os clientes com relatórios gerenciais e conduz as reuniões trimestrais de resultado.'],
    formacao: ['Bacharel em Ciências Contábeis', 'MBA em Controladoria', 'Perita contábil'],
  },
  {
    id: 'otavio', nome: 'Otávio Mendes', cargo: 'Sócio, área tributária', crc: 'CRC-PR 020202/O-2', // [EXEMPLO]
    foto: 'equipe-otavio', segmentos: ['fiscal', 'abertura'], agenda: [1, 3, 5], desde: 2014,
    frase: 'Antes de escolher o regime, a gente simula os três.',
    bio: ['Responde pela área fiscal e tributária: apuração, revisão de enquadramento e o projeto de transição para o IBS e a CBS.', 'Também acompanha as aberturas de empresa, para que o regime escolhido no primeiro dia faça sentido.'],
    formacao: ['Bacharel em Ciências Contábeis', 'Especialista em Direito Tributário', 'Curso de Reforma Tributária'],
  },
  {
    id: 'renata', nome: 'Renata Lins', cargo: 'Contadora, departamento pessoal', crc: 'CRC-PR 030303/O-3', // [EXEMPLO]
    foto: 'equipe-renata', segmentos: ['pessoal'], agenda: [2, 3, 4], desde: 2016,
    frase: 'Folha certa é folha conferida duas vezes.',
    bio: ['Coordena o departamento pessoal: folha, eSocial, FGTS Digital, admissões e desligamentos.', 'Orienta os clientes antes de cada contratação, para que custo e prazo fiquem claros desde o começo.'],
    formacao: ['Bacharel em Ciências Contábeis', 'Pós-graduação em Gestão de Pessoas', 'Especialização em eSocial'],
  },
  {
    id: 'caio', nome: 'Caio Nakamura', cargo: 'Contador, BPO financeiro e abertura', crc: 'CRC-PR 040404/O-4', // [EXEMPLO]
    foto: 'equipe-caio', segmentos: ['bpo', 'abertura'], agenda: [1, 2, 5], desde: 2019,
    frase: 'Caixa previsível tira o susto do fim do mês.',
    bio: ['Cuida do BPO financeiro: contas a pagar e a receber, conciliação e projeção de caixa.', 'Atende quem está abrindo a primeira empresa ou saindo do MEI, do contrato social ao primeiro mês de rotina.'],
    formacao: ['Bacharel em Ciências Contábeis', 'MBA em Finanças', 'Certificação em BPO financeiro'],
  },
  {
    id: 'julia', nome: 'Júlia Prado', cargo: 'Contadora, pessoa física', crc: 'CRC-PR 050505/O-5', // [EXEMPLO]
    foto: 'equipe-julia', segmentos: ['pf', 'contabil'], agenda: [3, 4, 5], desde: 2020,
    frase: 'Imposto de renda se resolve o ano todo, não só em abril.',
    bio: ['Atende pessoas físicas: declaração de imposto de renda, carnê-leão, ganho de capital e organização de documentos da família.', 'Apoia a contabilidade das empresas menores e dos profissionais liberais.'],
    formacao: ['Bacharel em Ciências Contábeis', 'Especialista em Planejamento Patrimonial', 'Curso de Tributação da Pessoa Física'],
  },
];

// números só sobre a estrutura do escritório, nunca sobre resultado
const numeros = [
  { valor: 2011, texto: 'ano de fundação, no Batel', ano: true },
  { valor: 5, texto: 'contadores com registro no CRC-PR' },
  { valor: 6, texto: 'frentes de serviço, uma pessoa responsável por frente' },
  { valor: 1, texto: 'dia útil para responder a qualquer pedido' },
];

// como funciona o atendimento (linha do tempo)
const atendimento = [
  { titulo: 'Conversa inicial', texto: 'Você conta o momento da empresa e o que precisa. Sem compromisso.', nota: '30 min, por vídeo ou no escritório' },
  { titulo: 'Diagnóstico', texto: 'Olhamos regime, obrigações, pendências e a rotina de documentos.', nota: 'Até 5 dias úteis' },
  { titulo: 'Proposta por escrito', texto: 'Escopo, prazos, responsáveis e honorários no papel, antes de qualquer assinatura.', nota: 'Contrato de prestação de serviços' },
  { titulo: 'Transição', texto: 'Pedimos os documentos ao escritório anterior e montamos o seu calendário.', nota: 'Até 30 dias' },
  { titulo: 'Rotina do mês', texto: 'Fechamento até o dia 20, guias com antecedência e reunião a cada trimestre.', nota: 'Tudo no portal do cliente' },
];

const compromissos = [
  { titulo: 'Sem promessa de economia', texto: 'Quanto você paga de imposto depende dos seus números e da lei. Mostramos premissas e cenários, não garantias.' },
  { titulo: 'Sigilo profissional', texto: 'Dados e documentos tratados como confidenciais, conforme o Código de Ética do Contador e a LGPD.' },
  { titulo: 'Honorários por escrito', texto: 'Proposta e contrato com escopo e reajuste definidos, como pedem as normas do Conselho Federal de Contabilidade.' },
];

const condicoes = {
  reuniao: 'Primeira conversa de 30 min, no Batel ou por videochamada.',
  retorno: 'Resposta em até 1 dia útil por WhatsApp, e-mail ou telefone.',
  honorarios: 'Honorários em proposta por escrito, depois do diagnóstico. O valor depende do regime, do volume de notas e do número de funcionários.',
  remarcar: 'Remarque ou cancele a reunião com 24 horas de antecedência, pelo WhatsApp.',
};

// políticas (abas na página do escritório); destaque = prazos fiscais, o ponto sensível do nicho
const politicas = [
  { id: 'atendimento', titulo: 'Atendimento', itens: [
    'Cada cliente tem um contador de referência por frente de serviço, com nome e registro no CRC informados no contrato.',
    'Canais: WhatsApp, e-mail, telefone, portal do cliente e reunião presencial ou por vídeo.',
    'Resposta em até 1 dia útil. Pedidos com prazo fiscal no mesmo dia recebem prioridade.',
    'Atendimento de segunda a quinta, das 8h30 às 18h, e sexta, das 8h30 às 17h.',
  ] },
  { id: 'honorarios', titulo: 'Honorários', itens: [
    'Os honorários são definidos em proposta por escrito, depois do diagnóstico, e formalizados em contrato de prestação de serviços.',
    'O valor considera regime tributário, volume de notas, número de funcionários e serviços contratados.',
    'Serviços fora do escopo (como abertura de filial ou revisão de anos anteriores) são orçados antes, por escrito.',
    'Reajuste anual previsto em contrato. O site não divulga valores, em respeito às normas do Conselho Federal de Contabilidade.',
  ] },
  { id: 'confidencialidade', titulo: 'Confidencialidade', itens: [
    'Tudo o que o escritório souber em razão do trabalho é sigiloso, conforme o Código de Ética Profissional do Contador (NBC PG 01).',
    'Documentos ficam no portal do cliente, com acesso por senha, e só a equipe da sua conta pode abri-los.',
    'Dados pessoais são tratados conforme a LGPD. Assinamos termo de confidencialidade adicional quando o cliente pede.',
    'Não envie documentos pelos formulários do site: use o portal ou a reunião.',
  ] },
  { id: 'agendamento', titulo: 'Agendamento e cancelamento', itens: [
    'Reuniões marcadas pelo site são confirmadas pela equipe em até 1 dia útil.',
    'Remarcação ou cancelamento com 24 horas de antecedência, sem custo.',
    'Tolerância de 15 minutos para atraso; depois disso a reunião é remarcada.',
    'Videochamadas recebem o link no WhatsApp ou no e-mail na véspera.',
  ] },
  { id: 'prazos', titulo: 'Prazos fiscais', destaque: true, itens: [
    'Prazos fiscais e trabalhistas são o ponto mais sensível da rotina: um documento atrasado atrasa a guia.',
    'Documentos do mês devem chegar até o dia 5. Depois disso, o escritório avisa por escrito quais entregas mudam de data.',
    'Guias são enviadas até 5 dias antes do vencimento. O pagamento é feito pelo cliente, salvo no BPO financeiro com aprovação.',
    'Multas por documento enviado fora do prazo combinado ficam com o cliente; por falha do escritório, com o escritório, como diz o contrato.',
  ] },
];

const faq = [
  ['Vocês atendem empresas fora de Curitiba?', 'Sim. A rotina é digital, com portal, assinatura eletrônica e reuniões por vídeo. Atendemos empresas de todo o Brasil; o registro da organização contábil é no CRC-PR.'],
  ['É complicado trocar de contador?', 'Não precisa ser. Nós pedimos os documentos ao escritório anterior, conferimos os saldos e montamos o calendário do primeiro mês. A transição leva até 30 dias.'],
  ['Quanto custa a contabilidade?', 'Depende do regime, do volume de notas, do número de funcionários e dos serviços. Os honorários vêm em proposta por escrito depois do diagnóstico. O site não divulga valores, como pedem as normas do conselho.'],
  ['O simulador diz qual regime é o melhor para mim?', 'Não. Ele mostra uma estimativa simplificada para você entender a diferença entre os regimes. A escolha depende de detalhes que só aparecem no diagnóstico, como atividades, créditos e benefícios.'],
  ['O que muda com a reforma tributária?', 'De 2026 a 2033, PIS, Cofins, IPI, ICMS e ISS vão sendo trocados pela CBS e pelo IBS. Em 2026 as notas já trazem os novos campos em caráter de teste. Explicamos o efeito na sua empresa no diagnóstico.'],
  ['Como envio os documentos do mês?', 'Pelo portal do cliente, até o dia 5. Notas emitidas e extratos podem chegar direto por integração com o banco e o emissor de notas.'],
  ['Vocês fazem só o imposto de renda?', 'Sim. A frente de pessoa física atende declarações, carnê-leão e ganho de capital, mesmo para quem não tem empresa.'],
  ['A primeira conversa tem custo?', 'A conversa inicial de 30 minutos serve para entender o que você precisa e não gera cobrança. Diagnóstico e serviços entram na proposta por escrito.'],
];

// depoimentos: só sobre a forma de atendimento, nunca sobre economia ou resultado. A validar na revisão jurídica.
const depoimentos = {
  mostrar: true,
  aviso: 'Depoimentos de demonstração, sobre a forma de atendimento. Na versão do cliente, só com autorização por escrito de quem fala e depois da revisão jurídica.',
  itens: [
    { texto: 'Pela primeira vez eu entendo o relatório que recebo. A reunião do trimestre virou parte da minha agenda.', nome: 'Marina C.', sobre: 'Estúdio de arquitetura' }, // [EXEMPLO]
    { texto: 'A troca de contador foi organizada do começo ao fim. Recebi o calendário do mês antes mesmo da primeira guia.', nome: 'Rafael T.', sobre: 'Padaria, 14 funcionários' }, // [EXEMPLO]
    { texto: 'Quando tenho dúvida na folha, alguém responde no mesmo dia, com o nome de quem está cuidando.', nome: 'Luciana M.', sobre: 'Clínica de fisioterapia' }, // [EXEMPLO]
    { texto: 'Explicaram o Fator R com os meus números, sem pressa e sem termo técnico.', nome: 'André S.', sobre: 'Consultoria de software' }, // [EXEMPLO]
  ],
};

// conteúdos informativos (blog)
const artigos = [
  {
    id: 'reforma-2026', segmento: 'fiscal', autor: 'otavio', data: '2026-11-18', leitura: 6, foto: 'calculadora-mesa',
    titulo: 'IBS e CBS: o que a reforma tributária já mudou em 2026 e o que vem em 2027',
    resumo: 'O ano de teste está acabando. Veja o que muda nas notas, nos créditos e no caixa a partir de janeiro.',
    corpo: [
      'A reforma tributária do consumo começou de forma gradual. Em 2026, as notas fiscais passaram a trazer os campos da CBS (federal) e do IBS (estadual e municipal) com alíquotas de teste, que podem ser compensadas com o PIS e a Cofins.',
      'Em 2027, a CBS entra para valer e o PIS e a Cofins deixam de existir. O IBS segue em transição até 2033, enquanto o ICMS e o ISS diminuem aos poucos.',
      'Para a empresa, o ponto de atenção é o crédito: no novo modelo, quase tudo o que se compra para a atividade gera crédito, desde que o fornecedor tenha emitido a nota corretamente.',
      'Empresas do Simples Nacional podem continuar no regime, mas há uma escolha nova: recolher o IBS e a CBS por fora do Simples, para que clientes empresariais aproveitem mais crédito. Essa decisão pede simulação com os números de cada empresa.',
      'Revise os cadastros de produtos e serviços, confira se o emissor de notas já está atualizado e converse com o seu contador sobre o impacto nos preços de 2027.',
    ],
  },
  {
    id: 'fator-r', segmento: 'fiscal', autor: 'otavio', data: '2026-10-28', leitura: 4, foto: 'graficos-noite',
    titulo: 'Fator R: quando a empresa de serviços paga pelo Anexo III ou pelo Anexo V',
    resumo: 'A relação entre folha e faturamento muda a tabela do Simples para várias atividades intelectuais.',
    corpo: [
      'No Simples Nacional, algumas atividades de serviço, como consultoria, engenharia e desenvolvimento de software, podem ser tributadas pelo Anexo III ou pelo Anexo V. Quem decide é o Fator R.',
      'O Fator R é a divisão da folha de salários dos últimos 12 meses (incluindo pró-labore e encargos) pelo faturamento do mesmo período. Se o resultado for de 28% ou mais, a empresa usa o Anexo III, com alíquotas menores.',
      'Por isso, o valor do pró-labore dos sócios entra na conta. Mas aumentar o pró-labore também aumenta o INSS e o imposto de renda da pessoa física: a conta precisa ser feita inteira.',
      'O cálculo é mensal. Uma variação de faturamento pode mudar o anexo de um mês para o outro, e por isso vale acompanhar a relação todo mês, não só no fim do ano.',
    ],
  },
  {
    id: 'mei-limite', segmento: 'abertura', autor: 'caio', data: '2026-10-14', leitura: 4, foto: 'loja-cafe',
    titulo: 'Passei do limite do MEI. E agora?',
    resumo: 'O que acontece quando o faturamento passa de R$ 81 mil no ano e como fazer a mudança para microempresa.',
    corpo: [
      'O MEI pode faturar até R$ 81 mil por ano (ou o proporcional aos meses de atividade, no ano de abertura). Passar desse valor não é crime, mas exige mudar de categoria.',
      'Se o excesso for de até 20% (até R$ 97.200), o MEI paga um DAS complementar sobre a parte que passou e vira microempresa a partir de janeiro do ano seguinte.',
      'Se o excesso for maior que 20%, o desenquadramento vale desde o início do ano, e os tributos são recalculados como microempresa no Simples Nacional, com juros e multa se houver atraso.',
      'A mudança é também uma oportunidade: com contador, a empresa pode contratar mais de um funcionário, abrir atividades que o MEI não permite e organizar a contabilidade para crescer.',
    ],
  },
  {
    id: 'pro-labore', segmento: 'contabil', autor: 'laura', data: '2026-09-30', leitura: 5, foto: 'dupla-laptop',
    titulo: 'Pró-labore e lucros: como os sócios recebem em 2026',
    resumo: 'A diferença entre pró-labore e distribuição de lucros, e o que mudou com a nova regra de retenção.',
    corpo: [
      'O pró-labore é a remuneração do sócio que trabalha na empresa. Ele tem INSS e imposto de renda na fonte, como um salário.',
      'A distribuição de lucros é a parte do resultado que sobra depois dos impostos da empresa. Para ser distribuída com segurança, a empresa precisa de escrituração contábil que comprove o lucro.',
      'Desde janeiro de 2026, lucros acima de R$ 50 mil por mês pagos pela mesma empresa à mesma pessoa física têm retenção de 10% na fonte, e rendas altas passaram a ter uma tributação mínima anual.',
      'O desenho ideal entre pró-labore e lucros depende do regime, do Fator R e da renda dos sócios. É uma conta para fazer com o contador, e de novo a cada ano.',
    ],
  },
  {
    id: 'irpf-isencao', segmento: 'pf', autor: 'julia', data: '2026-09-16', leitura: 4, foto: 'assinatura',
    titulo: 'Isenção até R$ 5 mil: o que muda no seu imposto de renda',
    resumo: 'A nova faixa de isenção vale para os salários de 2026 e aparece na declaração de 2027.',
    corpo: [
      'A partir dos rendimentos de janeiro de 2026, quem ganha até R$ 5 mil por mês deixou de ter imposto de renda retido na fonte. Entre R$ 5 mil e cerca de R$ 7.350, há uma redução gradual.',
      'A mudança aparece no contracheque desde o começo do ano e será considerada na declaração de 2027, que trata dos rendimentos de 2026.',
      'Mesmo isento, você pode continuar obrigado a declarar, por exemplo se tiver bens acima do limite, rendimentos de aluguel ou operações na bolsa.',
      'Guarde os informes de rendimentos e os comprovantes de despesas médicas e de educação ao longo do ano. Eles continuam fazendo diferença na restituição.',
    ],
  },
  {
    id: 'folha-calendario', segmento: 'pessoal', autor: 'renata', data: '2026-09-02', leitura: 3, foto: 'reuniao-janela',
    titulo: 'Férias, 13º e o calendário da folha no fim do ano',
    resumo: 'Datas que pedem atenção entre novembro e janeiro, para não haver surpresa no caixa.',
    corpo: [
      'A primeira parcela do 13º salário deve ser paga até 30 de novembro, e a segunda até 20 de dezembro, já com os descontos de INSS e imposto de renda.',
      'Férias coletivas no fim do ano precisam de aviso ao sindicato e aos funcionários com 15 dias de antecedência, e o pagamento sai até dois dias antes do início.',
      'O FGTS Digital e a DCTFWeb seguem o calendário normal em dezembro, e os encargos do 13º entram junto. Vale reservar o valor no fluxo de caixa desde outubro.',
    ],
  },
  {
    id: 'caixa-13-semanas', segmento: 'bpo', autor: 'caio', data: '2026-08-19', leitura: 5, foto: 'graficos-papel',
    titulo: 'Fluxo de caixa de 13 semanas: um trimestre na palma da mão',
    resumo: 'Por que projetar o caixa semana a semana ajuda a evitar o aperto antes que ele aconteça.',
    corpo: [
      'O fluxo de caixa de 13 semanas é uma planilha simples: entradas e saídas previstas para cada semana dos próximos três meses.',
      'Ele mostra com antecedência as semanas em que o saldo fica apertado, por exemplo quando o 13º, os impostos e uma compra grande caem juntos.',
      'Com essa visão, dá tempo de negociar prazos com fornecedores, antecipar cobranças ou planejar uma linha de crédito sem pressa.',
      'O segredo é a disciplina: atualizar toda semana com o que de fato aconteceu e comparar com o previsto.',
    ],
  },
  {
    id: 'trocar-contador', segmento: 'abertura', autor: 'caio', data: '2026-08-05', leitura: 3, foto: 'sala-reuniao',
    titulo: 'Como trocar de contador sem dor de cabeça',
    resumo: 'O que pedir ao escritório anterior e quanto tempo leva uma transição bem feita.',
    corpo: [
      'Trocar de contador é um direito da empresa, e o escritório anterior deve entregar a documentação, como determina o Código de Ética do Contador.',
      'Os itens principais são: livros e balancetes, declarações entregues, senhas e certificados, folha e eSocial, e a lista de parcelamentos e pendências.',
      'O ideal é combinar a data de corte no começo de um mês, para que o novo escritório assuma o fechamento inteiro, sem dividir competências.',
    ],
  },
];

const carrossel = [
  { foto: 'noite-laptop', legenda: 'Fim de tarde de fechamento, no Batel' },
  { foto: 'sala-reuniao', legenda: 'Sala de reuniões, onde acontecem as conversas iniciais' },
  { foto: 'reuniao-mesa', legenda: 'Reunião trimestral de resultado com um cliente' },
  { foto: 'salao-aberto', legenda: 'A equipe trabalha em mesas compartilhadas por frente' },
  { foto: 'sala-arquivo', legenda: 'Arquivo físico, para o que ainda chega em papel' },
];

const galeria = [
  { foto: 'noite-laptop', cat: 'Equipe', legenda: 'Fechamento do mês' },
  { foto: 'sala-reuniao', cat: 'Escritório', legenda: 'Sala de reuniões' },
  { foto: 'salao-aberto', cat: 'Escritório', legenda: 'Área de trabalho' },
  { foto: 'sala-arquivo', cat: 'Escritório', legenda: 'Arquivo' },
  { foto: 'equipe-risos', cat: 'Equipe', legenda: 'Equipe no dia a dia' },
  { foto: 'reuniao-quadro', cat: 'Equipe', legenda: 'Planejamento do mês' },
  { foto: 'dupla-laptop', cat: 'Equipe', legenda: 'Conferência da folha' },
  { foto: 'reuniao-janela', cat: 'Atendimento', legenda: 'Conversa inicial' },
  { foto: 'reuniao-mesa', cat: 'Atendimento', legenda: 'Reunião de resultado' },
  { foto: 'assinatura', cat: 'Atendimento', legenda: 'Assinatura do contrato' },
  { foto: 'jardim-botanico', cat: 'Curitiba', legenda: 'Jardim Botânico de Curitiba' },
  { foto: 'predio-curvo', cat: 'Curitiba', legenda: 'Arquitetura do Batel' },
];

const instagram = [
  { foto: 'calculadora-oculos', texto: 'Glossário: o que é Fator R?' },
  { foto: 'equipe-risos', texto: 'Bastidores do fechamento' },
  { foto: 'loja-cafe', texto: 'MEI passou do limite? Carrossel' },
  { foto: 'graficos-noite', texto: 'Reforma tributária em 5 datas' },
  { foto: 'jardim-botanico', texto: 'Curitiba, 8h30 de segunda' },
  { foto: 'anotacoes', texto: 'Checklist do imposto de renda' },
];

// segmentos de clientes atendidos (faixa e "para quem")
const clientes = ['Comércio', 'Serviços', 'Indústria leve', 'Clínicas e saúde', 'Tecnologia', 'Profissionais liberais', 'Restaurantes', 'Pessoa física'];

const cidades = ['Curitiba', 'São José dos Pinhais', 'Pinhais', 'Colombo', 'Araucária', 'Campo Largo', 'Fazenda Rio Grande', 'Todo o Brasil por vídeo'];

// agenda fiscal geral de referência (cartão "ao vivo" da capa); dia do mês de vencimento
const agendaFiscal = [
  { dia: 7, nome: 'Salários', quem: 'Pagamento até o 5º dia útil' },
  { dia: 15, nome: 'EFD-Reinf e eSocial', quem: 'Envio das informações do mês anterior' },
  { dia: 20, nome: 'DAS do Simples Nacional', quem: 'Empresas do Simples' },
  { dia: 20, nome: 'FGTS Digital', quem: 'Empresas com funcionários' },
  { dia: 20, nome: 'DCTFWeb e INSS', quem: 'Contribuições sobre a folha' },
  { dia: 25, nome: 'PIS e Cofins', quem: 'Lucro Presumido e Lucro Real' },
  { dia: 30, nome: 'IRPJ e CSLL', quem: 'Trimestral ou estimativa mensal' },
];

module.exports = { marca, horario, horarioTexto, segmentos, equipe, numeros, atendimento, compromissos, condicoes, politicas, faq, depoimentos, artigos, carrossel, galeria, instagram, clientes, cidades, agendaFiscal };
