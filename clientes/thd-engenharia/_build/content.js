// Conteúdo do site THD Engenharia. Edite aqui e rode: node clientes/thd-engenharia/_build/build.js
// Textos vindos do site antigo (thdengenharia.com). Itens marcados [CONFIRMAR] precisam de validação com o cliente.

const WHATS = '5521998340142';
const wa = (msg) => `https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`;

module.exports = {
  dominio: 'https://thdengenharia.com',
  nome: 'THD Engenharia',
  slogan: 'Consultoria de provedores de internet',
  cnpj: '44.619.804/0001-49',
  ga4: 'G-DMZHV89B5P', // mesmo ID do site antigo, para manter o histórico do Analytics
  credito: { nome: 'Vyra', url: '' }, // [CONFIRMAR] crédito no rodapé

  contato: {
    whatsapp: WHATS,
    whatsappTexto: '(21) 9 9834-0142',
    telefoneSchema: '+55-21-99834-0142',
    email: 'contato@thdengenharia.com',
    endereco: 'R. Almirante Pestana, 6, Cacuia, Rio de Janeiro, RJ',
    mapsLink: 'https://www.google.com/maps/search/?api=1&query=R.%20Alm.%20Pestana%2C%206%20-%20Cacuia%2C%20Rio%20de%20Janeiro',
    rotaLink: 'https://www.google.com/maps/dir/?api=1&destination=R.%20Alm.%20Pestana%2C%206%20-%20Cacuia%2C%20Rio%20de%20Janeiro',
    horario: [
      ['Segunda a sexta', '9h às 18h'],
      ['Sábado e domingo', 'Apenas contato'],
    ],
    redes: [
      { rede: 'instagram', rotulo: 'Instagram', handle: '@thd.engenharia', url: 'https://www.instagram.com/thd.engenharia/' },
      { rede: 'facebook', rotulo: 'Facebook', handle: '/thdengenhariatelecom', url: 'https://www.facebook.com/thdengenhariatelecom' },
      { rede: 'telegram', rotulo: 'Telegram', handle: '@thd_engenharia', url: 'https://t.me/thd_engenharia' },
    ],
    assuntos: ['Orçamento', 'Suporte técnico', 'Financeiro', 'Parceria', 'Reclamação'],
  },

  wa,
  waOrcamento: wa('Olá, THD! Vim pelo site e quero fazer um orçamento.'),

  quemSomos: {
    intro: 'A THD propõe consultoria com as melhores soluções na área de provedor, tudo com excelência e garantia para que você possa se dedicar e focar em suas atividades principais.',
    historia: 'Já realizamos trabalhos com dezenas de empresas e estamos crescendo cada vez mais com esse número.',
    missao: 'Criar uma boa relação com nossos clientes ao oferecer praticidade e segurança para resolver questões técnicas para provedores de internet.',
    pilares: [
      { t: 'Excelência', d: 'Cada processo conduzido com cuidado técnico, do primeiro documento à entrega final.' },
      { t: 'Garantia', d: 'Acompanhamento até a conclusão, para você não ficar com pendências junto aos órgãos.' },
      { t: 'Praticidade', d: 'Nós cuidamos da burocracia enquanto você foca na operação do seu provedor.' },
      { t: 'Segurança', d: 'Seu provedor regular e em dia com Anatel, CREA, CFT e Registro.br.' },
    ],
  },

  // Serviços agrupados por etapa da vida do provedor. "id" vira a âncora em /servicos/#id
  grupos: [
    { id: 'regulatorio', titulo: 'Regulatório Anatel', resumo: 'Para começar a operar dentro da lei e continuar em dia.' },
    { id: 'rede', titulo: 'Rede e endereçamento', resumo: 'Autonomia de rede para o seu provedor crescer.' },
    { id: 'tecnico', titulo: 'Técnico e segurança', resumo: 'Responsabilidade técnica e proteção da sua equipe.' },
    { id: 'gestao', titulo: 'Gestão e marca', resumo: 'Números organizados e uma marca protegida e conhecida.' },
  ],

  servicos: [
    { id: 'outorga-scm', grupo: 'regulatorio', icone: 'outorga', titulo: 'Credenciamentos e Outorga SCM',
      curto: 'A licença que permite explorar comercialmente o serviço de internet.',
      texto: 'A outorga SCM (Serviço de Comunicação Multimídia) é necessária para explorar comercialmente a área de telecomunicações e provedor de internet (wireless), para que a empresa possa atuar no ramo prestando serviços de conexão à internet.' },
    { id: 'seac-stfc', grupo: 'regulatorio', icone: 'antena', titulo: 'Licença SEAC e STFC e compartilhamento de poste',
      curto: 'Outorgas para conteúdo audiovisual e transmissão de voz.',
      texto: 'A outorga de STFC e SEAC é necessária para explorar comercialmente as áreas de conteúdo audiovisual e de transmissão de voz de um ponto ao outro. Também orientamos o processo de compartilhamento de poste.' },
    { id: 'pos-outorga', grupo: 'regulatorio', icone: 'documento', titulo: 'Pós-outorga: DICI e apoio jurídico',
      curto: 'Declarações mensais e obrigações junto à Anatel.',
      texto: 'Acompanhamento de todos os processos e obrigações junto à Anatel após o credenciamento e a outorga, incluindo as declarações mensais (DICI) e apoio jurídico.' },
    { id: 'notificacoes', grupo: 'regulatorio', icone: 'alerta', titulo: 'Notificações Anatel, CREA e CFT',
      curto: 'Orientação para responder notificações dos órgãos.',
      texto: 'Orientação referente a notificações junto à Anatel, ao CREA e ao CFT, para responder dentro do prazo e evitar multas.' },
    { id: 'asn', grupo: 'rede', icone: 'rede', titulo: 'Solicitação do seu ASN',
      curto: 'Projeto de ASN junto ao Registro.br.',
      texto: 'Projeto de ASN junto ao Registro.br. O provedor precisa seguir um padrão para conseguir o seu próprio bloco de IP, e nós conduzimos esse processo.' },
    { id: 'ipv4', grupo: 'rede', icone: 'servidor', titulo: 'Aluguel de IPv4',
      curto: 'Blocos de IPv4 para atender seus clientes.',
      texto: 'Cada endereço de rede é definido com 32 bits. Isso permite a interconexão de inúmeras aplicações e aparelhos simultaneamente em uma rede. Fornecemos blocos de IPv4 para o seu provedor.' },
    { id: 'responsabilidade-tecnica', grupo: 'tecnico', icone: 'prancheta', titulo: 'Responsabilidade técnica',
      curto: 'Acompanhamento técnico de ART/TRT.',
      texto: 'Acompanhamento técnico de ART/TRT, com profissional habilitado assumindo a responsabilidade técnica do seu provedor.' },
    { id: 'seguranca-do-trabalho', grupo: 'tecnico', icone: 'capacete', titulo: 'Segurança do trabalho',
      curto: 'Prevenção de acidentes e saúde da sua equipe.',
      texto: 'Tem como objetivo a prevenção de acidentes. É um serviço especializado, realizado por um grupo multidisciplinar, cuja principal função é preservar a saúde física e mental dos colaboradores, diagnosticando e prevenindo problemas durante a execução das atividades.' },
    { id: 'gestao-contabil', grupo: 'gestao', icone: 'calculadora', titulo: 'Gestão contábil',
      curto: 'Contabilidade especializada em provedores.',
      texto: 'A gestão contábil é a área responsável pela administração das rotinas, das informações, dos registros e dos documentos que se referem à situação patrimonial e financeira de um negócio.',
      link: 'contabilidade' },
    { id: 'marketing', grupo: 'gestao', icone: 'megafone', titulo: 'Marketing e comunicação',
      curto: 'Identidade visual, redes sociais e tráfego.',
      texto: 'Do desenvolvimento de uma identidade visual à criação e estruturação de conteúdos para redes sociais, além de gestão de tráfego para elevar o alcance e gerar resultados mais expressivos.' },
    { id: 'registro-de-marca', grupo: 'gestao', icone: 'selo', titulo: 'Registro de marca',
      curto: 'Exclusividade no uso do seu nome e logo.',
      texto: 'Processo que certifica uma pessoa ou empresa como proprietária de um nome e/ou logo, de produto ou serviço, e dá o direito de utilizá-los com exclusividade no Brasil.' },
  ],

  // Jornada do provedor (home): organiza os serviços na ordem em que o provedor precisa deles
  jornada: [
    { t: 'Abrir e regularizar', d: 'Credenciamento e outorga SCM, SEAC e STFC junto à Anatel.', ids: ['outorga-scm', 'seac-stfc'] },
    { t: 'Ganhar autonomia de rede', d: 'Seu próprio ASN no Registro.br e blocos de IPv4.', ids: ['asn', 'ipv4'] },
    { t: 'Manter tudo em dia', d: 'DICI mensal, notificações, ART/TRT e apoio jurídico.', ids: ['pos-outorga', 'notificacoes', 'responsabilidade-tecnica'] },
    { t: 'Crescer com saúde', d: 'Contabilidade especializada, marketing e registro de marca.', ids: ['gestao-contabil', 'marketing', 'registro-de-marca'] },
  ],

  // Diagnóstico interativo (home): cada pergunta aponta para o serviço que resolve a pendência
  diagnostico: [
    { q: 'Seu provedor já tem a outorga SCM?', id: 'outorga-scm', pend: 'Outorga SCM' },
    { q: 'As declarações DICI saem todo mês, sem atraso?', id: 'pos-outorga', pend: 'DICI e pós-outorga' },
    { q: 'Existe responsável técnico com ART/TRT em dia?', id: 'responsabilidade-tecnica', pend: 'Responsabilidade técnica' },
    { q: 'A rede já opera com ASN próprio?', id: 'asn', pend: 'ASN próprio' },
    { q: 'Você tem IPv4 suficiente para crescer?', id: 'ipv4', pend: 'Blocos de IPv4' },
    { q: 'A sua contabilidade entende de provedor?', id: 'gestao-contabil', pend: 'Contabilidade especializada' },
    { q: 'A sua marca está registrada?', id: 'registro-de-marca', pend: 'Registro de marca' },
  ],

  // Carrossel de órgãos reguladores (imagens em _build/img/selo-*.png; h = altura do logo em px no carrossel)
  selos: [
    { img: 'selo-anatel.png', nome: 'Anatel', papel: 'Outorgas SCM, SEAC, STFC e DICI', h: 86 },
    { img: 'selo-crea.png', nome: 'CREA', papel: 'Responsabilidade técnica e ART', h: 70 },
    { img: 'selo-cft.png', nome: 'CFT', papel: 'Técnicos industriais e TRT', h: 68 },
    { img: 'selo-registrobr.png', nome: 'Registro.br', papel: 'ASN e blocos de IP', h: 54 },
    { img: 'selo-inpi.png', nome: 'INPI', papel: 'Registro de marca', h: 56 },
    { img: 'selo-mcti.png', nome: 'MCTI', papel: 'Ministério da Ciência, Tecnologia e Inovação', h: 64 },
  ],


  contabilidade: {
    pergunta: 'Você sabe a rentabilidade do seu negócio?',
    smart: 'Aqui utilizamos o Smart Accounting: nossos contadores fornecem extratos contábeis mensais e verificam as melhores oportunidades de redução de custos e impostos, aumentando assim a lucratividade.',
    time: 'Time liderado pela Daiane Ribeiro, contadora especialista, que utiliza tudo o que existe de mais eficiente em serviços contábeis, consultoria e planejamento estratégico.',
    segmentos: ['Provedores de internet', 'Comércio', 'Indústria', 'Serviços', 'Demais segmentos'],
    operacional: ['Formalização da empresa', 'Emissão de guias de pagamento', 'Organização de documentos e registros', 'Emissão de notas fiscais', 'Envio de demonstrações contábeis'],
    estrategico: 'Existe também uma parte estratégica essencial: fazer o planejamento da área alinhado aos objetivos da empresa e usar os dados coletados a favor do negócio.',
  },
};
