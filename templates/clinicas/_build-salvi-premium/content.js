// Conteúdo do Salvi Premium (nutrição): todos os textos e dados do site ficam aqui.
// Marca, pessoas, registros, endereço, preços, convênios e avaliações são de demonstração. Tudo o que é
// fato de cliente real (CRN, CNPJ, preços, convênios aceitos, avaliações) está marcado com [EXEMPLO] e é
// trocado na cópia do cliente em clientes/<cliente>/.

const marca = {
  nome: 'Salvi',
  completo: 'Salvi Nutrição',
  profissional: 'Bruna Salvi',
  razao: 'Salvi Nutrição Clínica Ltda.', // [EXEMPLO] fictício
  cnpj: '00.000.000/0001-00', // [EXEMPLO] fictício
  registroPJ: 'CRN-10 PJ 0000', // [EXEMPLO] fictício
  endereco: 'Rua Lauro Linhares, 1288, sala 4', // [EXEMPLO]
  bairro: 'Trindade',
  cidade: 'Florianópolis',
  uf: 'SC',
  cep: '88036-002',
  geo: { lat: -27.5896, lon: -48.5225 },
  telefone: '(48) 3200-0000', // [EXEMPLO]
  whatsapp: '(48) 99999-0000', // [EXEMPLO]
  email: 'contato@salvinutricao.com.br', // [EXEMPLO]
  dominio: 'https://salvinutricao.com.br', // [EXEMPLO]
  instagram: 'salvi.nutri', // [EXEMPLO]
  facebook: 'https://facebook.com/salvi.nutri',
  youtube: 'https://youtube.com/@salvi.nutri',
};

// horário de funcionamento da clínica (dia 0 = domingo)
const horario = [
  { dias: 'Segunda a sexta', horas: '8h às 19h' },
  { dias: 'Sábado', horas: '8h às 12h' },
  { dias: 'Domingo e feriados', horas: 'Fechado' },
];
const horarioLd = [
  { dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], abre: '08:00', fecha: '19:00' },
  { dias: ['Saturday'], abre: '08:00', fecha: '12:00' },
];

const bairros = ['Trindade', 'Santa Mônica', 'Córrego Grande', 'Pantanal', 'Itacorubi', 'Agronômica', 'Centro', 'Lagoa da Conceição', 'Online, todo o Brasil'];

// ---------- a equipe (a agenda de cada uma vem daqui) ----------
// agenda.dias: dias da semana com atendimento; ini/fim: horas cheias; online: dias em que também atende por vídeo.
const equipe = [
  {
    id: 'bruna',
    nome: 'Bruna Salvi',
    curto: 'Bruna',
    papel: 'Fundadora, nutrição clínica e comportamental',
    crn: 'CRN-10 0000', // [EXEMPLO] fictício
    foto: 'bruna-retrato',
    avatar: 'bruna-rosto',
    especialidades: ['Emagrecimento sem dieta restritiva', 'Comer emocional e compulsão', 'Reeducação para a rotina', 'Acompanhamento com uso de medicação'],
    formacao: [
      ['2012', 'Graduação em Nutrição'],
      ['2015', 'Especialização em Nutrição Clínica'],
      ['2018', 'Formação em Nutrição Comportamental'],
      ['2023', 'Mindful eating para profissionais de saúde'],
    ],
    abordagem: 'Plano bom é o que cabe na sua terça-feira comum, não o que funciona só na segunda.',
    bio: 'Atende há mais de dez anos pessoas que já tentaram de tudo e cansaram de recomeçar. O trabalho começa pela conversa: rotina, história com a comida, exames, sono e o que a pessoa gosta de comer. O plano vem depois, com substituições, e muda junto com a vida.',
    agenda: { dias: [1, 2, 4, 6], ini: 8, fim: 18, online: [2] },
  },
  {
    id: 'diego',
    nome: 'Diego Arruda',
    curto: 'Diego',
    papel: 'Nutrição esportiva e performance',
    crn: 'CRN-10 0001', // [EXEMPLO] fictício
    foto: 'diego',
    especialidades: ['Corrida de rua e triatlo', 'Ganho de massa muscular', 'Plano de prova e hidratação', 'Treino de força e musculação'],
    formacao: [
      ['2014', 'Graduação em Nutrição'],
      ['2017', 'Especialização em Nutrição Esportiva'],
      ['2021', 'Fisiologia do exercício aplicada à corrida'],
    ],
    abordagem: 'Treino bom pede comida pensada para o dia de treino e para o dia de descanso.',
    bio: 'Corredor amador e maratonista, acompanha desde quem começou a treinar este mês até atletas de prova longa. Monta o plano em ciclos, junto com a planilha do treinador, e testa a estratégia de prova nos treinos longos antes do grande dia.',
    agenda: { dias: [1, 3, 5], ini: 7, fim: 19, online: [3, 5] },
  },
  {
    id: 'taina',
    nome: 'Tainá Couto',
    curto: 'Tainá',
    papel: 'Gestação, amamentação e infância',
    crn: 'CRN-10 0002', // [EXEMPLO] fictício
    foto: 'taina',
    especialidades: ['Pré-natal nutricional', 'Introdução alimentar e BLW', 'Seletividade alimentar', 'Lancheira e alimentação escolar'],
    formacao: [
      ['2013', 'Graduação em Nutrição'],
      ['2016', 'Especialização em Nutrição Materno-Infantil'],
      ['2020', 'Curso de primeiros socorros pediátricos e engasgo'],
    ],
    abordagem: 'Criança aprende a comer à mesa, com a família, e cada uma no seu tempo.',
    bio: 'Acompanha a família desde a gestação até a escola. Ensina na prática a introdução alimentar e a prevenção de engasgo, e tem paciência de sobra para a criança que só come arroz branco.',
    agenda: { dias: [2, 3, 4], ini: 9, fim: 18, online: [3] },
  },
  {
    id: 'luana',
    nome: 'Luana Prates',
    curto: 'Luana',
    papel: 'Saúde intestinal e saúde da mulher',
    crn: 'CRN-10 0003', // [EXEMPLO] fictício
    foto: 'luana',
    especialidades: ['Intestino irritável e desconfortos', 'SOP e endometriose', 'Climatério e menopausa', 'Intolerâncias alimentares'],
    formacao: [
      ['2011', 'Graduação em Nutrição'],
      ['2014', 'Especialização em Nutrição Clínica Funcional'],
      ['2019', 'Mestrado em Ciência dos Alimentos'],
    ],
    abordagem: 'Sintoma é informação. A gente investiga antes de cortar qualquer alimento.',
    bio: 'Investiga com calma: diário de sintomas, exames e rotina. Quando um protocolo de exclusão é indicado, ele tem começo, meio e reintrodução, para ninguém ficar com uma lista de proibidos para sempre.',
    agenda: { dias: [1, 2, 3, 5], ini: 8, fim: 17, online: [1, 5] },
  },
];

// ---------- especialidades (segmentos) e serviços ----------
// pagina: página própria da especialidade (SEO local), com a cidade no endereço
const segmentos = [
  {
    id: 'comportamento', nome: 'Emagrecimento e comportamento', curto: 'Emagrecimento', foto: 'seg-comportamento',
    pagina: 'nutricionista-emagrecimento-florianopolis', termo: 'Nutricionista para emagrecimento em Florianópolis',
    chamada: 'Perder peso sem brigar com a comida.',
    texto: 'Para quem cansou de dieta que começa na segunda e termina na quarta. Trabalhamos fome, saciedade, rotina e as situações que levam a comer sem fome, com um plano que tem pão, festa e restaurante.',
    paraQuem: ['Quem já fez muitas dietas e voltou ao peso de antes', 'Quem come por ansiedade, tédio ou cansaço', 'Quem usa medicação para emagrecer e quer preservar músculo e saúde', 'Quem tem exames alterados (glicose, colesterol, gordura no fígado)'],
    faq: [
      ['Vou ter que cortar carboidrato?', 'Não. Carboidrato faz parte do plano. O que muda é quantidade, combinação e horário, de acordo com a sua rotina e os seus exames.'],
      ['Uso caneta para emagrecer. Posso fazer o acompanhamento?', 'Pode e deve. Com menos fome, é comum comer pouca proteína e perder músculo. Ajustamos o plano junto com o seu médico, que é quem prescreve e acompanha a medicação.'],
    ],
  },
  {
    id: 'esporte', nome: 'Esporte e performance', curto: 'Esporte', foto: 'seg-esporte',
    pagina: 'nutricionista-esportivo-florianopolis', termo: 'Nutricionista esportivo em Florianópolis',
    chamada: 'Comer para treinar, recuperar e chegar inteiro na prova.',
    texto: 'Do primeiro mês de academia à maratona. O plano muda entre dia de treino e de descanso, acompanha a planilha do treinador e testa a estratégia de prova antes da largada.',
    paraQuem: ['Corredores, ciclistas e triatletas', 'Quem treina força e quer ganhar massa muscular', 'Quem tem queda de rendimento ou cansaço nos treinos', 'Atletas com prova marcada'],
    faq: [
      ['Preciso de suplemento?', 'Nem sempre. Primeiro ajustamos a comida. Suplemento entra quando há motivo, com dose e marca indicadas, e sai quando deixa de ser necessário.'],
      ['Vocês fazem plano para o dia da prova?', 'Sim. O plano de prova é testado nos treinos longos: o que comer antes, durante e depois, e como se hidratar no calor de Florianópolis.'],
    ],
  },
  {
    id: 'materno', nome: 'Gestação e infância', curto: 'Gestação e infância', foto: 'seg-gestacao',
    pagina: 'nutricionista-gestante-infantil-florianopolis', termo: 'Nutricionista para gestante e criança em Florianópolis',
    chamada: 'Da barriga à lancheira, com a família inteira à mesa.',
    texto: 'Pré-natal nutricional, introdução alimentar com prática de prevenção de engasgo e acompanhamento da criança que come pouco ou come sempre a mesma coisa.',
    paraQuem: ['Gestantes, do primeiro trimestre ao pós-parto', 'Famílias começando a introdução alimentar', 'Crianças com seletividade ou pouca fome', 'Quem quer organizar a lancheira da escola'],
    faq: [
      ['A partir de que idade vocês atendem?', 'Desde a gestação. A introdução alimentar costuma começar aos 6 meses, e a consulta infantil vai até os 12 anos.'],
      ['A consulta com criança é diferente?', 'É. Tem conversa com os responsáveis, um momento com a criança, materiais lúdicos e um plano para a casa e para a escola.'],
    ],
  },
  {
    id: 'intestino', nome: 'Intestino e saúde da mulher', curto: 'Intestino e mulher', foto: 'seg-intestino',
    pagina: 'nutricionista-saude-intestinal-florianopolis', termo: 'Nutricionista para saúde intestinal e da mulher em Florianópolis',
    chamada: 'Investigar o sintoma antes de cortar o alimento.',
    texto: 'Estufamento, intestino preso ou solto, SOP, endometriose e menopausa. Investigamos com diário de sintomas e exames, e qualquer exclusão tem prazo e reintrodução.',
    paraQuem: ['Quem tem desconforto intestinal frequente', 'Mulheres com SOP ou endometriose', 'Mulheres no climatério e na menopausa', 'Quem suspeita de intolerância alimentar'],
    faq: [
      ['Vou ter que tirar glúten e lactose?', 'Só se houver motivo. Exclusão sem investigação empobrece a alimentação. Quando é indicada, tem prazo e reintrodução acompanhada.'],
      ['Preciso de exames antes da consulta?', 'Traga os que tiver dos últimos 6 meses. Se faltar algum, indicamos na consulta e conversamos com o seu médico quando for preciso.'],
    ],
  },
  {
    id: 'avaliacao', nome: 'Avaliação e oficinas', curto: 'Avaliação e oficinas', foto: 'aula-cozinha',
    chamada: 'Medir, cozinhar e aprender junto.',
    texto: 'Avaliação corporal avulsa, retornos e oficinas práticas na nossa cozinha-escola, em grupos pequenos.',
  },
];

// [EXEMPLO] preços de referência
const servicos = [
  { id: 'primeira-consulta', seg: 'comportamento', nome: 'Primeira consulta', inclui: ['Conversa sobre rotina, sono e história com a comida', 'Avaliação corporal com bioimpedância', 'Leitura dos exames', 'Plano alimentar com substituições', 'App com o plano e o diário por 45 dias'], dur: 75, preco: 390, profs: ['bruna', 'diego', 'taina', 'luana'], online: true, destaque: true },
  { id: 'comer-em-paz', seg: 'comportamento', nome: 'Programa Comer em Paz', nota: '3 meses', inclui: ['Primeira consulta e 3 retornos', 'Mensagens com a nutricionista em dias úteis', 'Diário alimentar comentado no app', 'Uma oficina na cozinha-escola'], dur: 75, preco: 1290, profs: ['bruna'], online: true },
  { id: 'consulta-esportiva', seg: 'esporte', nome: 'Consulta esportiva', inclui: ['Conversa sobre treino, metas e provas', 'Bioimpedância e circunferências', 'Cálculo do gasto nos dias de treino', 'Plano para treino e descanso', 'Estratégia de hidratação'], dur: 75, preco: 420, profs: ['diego'], online: true },
  { id: 'plano-prova', seg: 'esporte', nome: 'Plano de prova', nota: 'corrida, triatlo e ciclismo', inclui: ['Periodização em ciclos com a planilha do treinador', 'Teste da estratégia no treino longo', 'Plano do dia da prova', 'Retorno depois da prova'], dur: 60, preco: 690, aPartir: true, profs: ['diego'], online: true },
  { id: 'gestacao', seg: 'materno', nome: 'Acompanhamento na gestação', nota: '4 encontros', inclui: ['Um encontro por trimestre e um no pós-parto', 'Leitura dos exames do pré-natal', 'Plano para enjoo, azia e intestino', 'Preparo para a amamentação'], dur: 60, preco: 1390, profs: ['taina'], online: true },
  { id: 'introducao-alimentar', seg: 'materno', nome: 'Introdução alimentar', nota: 'para a família', inclui: ['Métodos tradicional, BLW e participativo', 'Prática de prevenção de engasgo', 'Cardápio das primeiras semanas', 'Material impresso para a casa'], dur: 90, preco: 450, profs: ['taina'], online: false },
  { id: 'infantil', seg: 'materno', nome: 'Consulta infantil', nota: 'seletividade e crescimento', inclui: ['Conversa com a criança e os responsáveis', 'Curva de crescimento', 'Estratégias para a hora da refeição', 'Plano para a casa e para a escola'], dur: 60, preco: 390, profs: ['taina'], online: false },
  { id: 'intestino', seg: 'intestino', nome: 'Saúde intestinal', inclui: ['Investigação dos sintomas com diário', 'Leitura de exames', 'Protocolo por etapas, quando indicado', 'Mensagens por 30 dias'], dur: 75, preco: 420, profs: ['luana'], online: true },
  { id: 'saude-mulher', seg: 'intestino', nome: 'SOP, endometriose e menopausa', inclui: ['Conversa sobre ciclo, sintomas e exames', 'Avaliação corporal', 'Plano anti-inflamatório possível de seguir', 'Conversa com o ginecologista quando preciso'], dur: 75, preco: 420, profs: ['luana'], online: true },
  { id: 'retorno', seg: 'avaliacao', nome: 'Retorno', nota: 'em até 60 dias', inclui: ['Revisão do plano e das dificuldades', 'Nova avaliação corporal', 'Metas para o próximo período'], dur: 45, preco: 220, profs: ['bruna', 'diego', 'taina', 'luana'], online: true },
  { id: 'bioimpedancia', seg: 'avaliacao', nome: 'Avaliação corporal avulsa', inclui: ['Bioimpedância', 'Circunferências', 'Relatório comparado com a anterior'], dur: 20, preco: 120, profs: ['diego', 'luana'], online: false, sensivel: true },
  { id: 'oficina', seg: 'avaliacao', nome: 'Oficina na cozinha-escola', nota: 'por pessoa', inclui: ['Aula prática em grupo de até 8 pessoas', 'Receitas para a semana inteira', 'Lista de compras', 'Degustação'], dur: 150, preco: 180, profs: ['bruna', 'taina'], online: false },
];

const pagamento = 'Pix, débito e crédito em até 3x sem juros. Programas e pacotes em até 6x. Recibo com CPF e CRN para pedir reembolso ao plano de saúde.';
const cancelamento = 'Remarcação ou cancelamento sem custo até 24 horas antes. Tolerância de 15 minutos de atraso. Falta sem aviso conta como consulta realizada nos pacotes.';

// ---------- o método, em quatro tempos (a cena do prato) ----------
const metodo = [
  { nome: 'Escuta', texto: 'Primeiro, a conversa: rotina, sono, trabalho, o que você gosta de comer e o que já tentou. Sem julgamento e sem balança logo na entrada.' },
  { nome: 'Avaliação', texto: 'Bioimpedância, circunferências e leitura dos exames. Os números entram para orientar o plano, não para dar nota a você.' },
  { nome: 'Plano', texto: 'Um plano com substituições, receitas e lista de compras, pensado para a sua semana real, com espaço para o restaurante e a festa.' },
  { nome: 'Acompanhamento', texto: 'Retornos, mensagens e diário no app. O plano muda quando a vida muda, e a gente ajusta junto.' },
];

// ---------- números da profissional ---------- [EXEMPLO]
const numeros = [
  { valor: 12, sufixo: '', rotulo: 'anos de consultório' },
  { valor: 3800, sufixo: '+', rotulo: 'pessoas atendidas' },
  { valor: 140, sufixo: '', rotulo: 'oficinas na cozinha-escola' },
];

// ---------- bastidores (carrossel de imagens) ----------
const bastidores = [
  { foto: 'feira', titulo: 'Sábado de feira', texto: 'Uma vez por mês a equipe vai à feira com os pacientes do programa para escolher frutas e verduras da estação.' },
  { foto: 'aula-grupo', titulo: 'Cozinha-escola', texto: 'Oficinas de até oito pessoas: marmitas da semana, lancheira, pães sem segredo.' },
  { foto: 'bruna-consulta', titulo: 'Consulta sem pressa', texto: 'Setenta e cinco minutos na primeira consulta, porque a conversa é a parte mais importante.' },
  { foto: 'marmitas', titulo: 'Marmitas que aguentam', texto: 'Montagem, porção e conservação, para a comida chegar boa até a tarde.' },
  { foto: 'feira-caixas', titulo: 'O que tem na estação', texto: 'Comida da estação é mais barata, mais saborosa e varia sozinha ao longo do ano.' },
  { foto: 'bruna-anota', titulo: 'Plano feito à mão', texto: 'Nada de cardápio impresso igual para todo mundo. Cada plano nasce da sua rotina.' },
];

// ---------- tour virtual: ambientes da clínica ----------
// planta: retângulo do ambiente na planta baixa (viewBox 0 0 400 260); liga: portas para outros ambientes (yaw em graus)
const tour = [
  { id: 'recepcao', nome: 'Recepção', curto: 'Recepção', foto: 'tour-recepcao', texto: 'Chá de ervas, água saborizada e poltronas para esperar sem pressa.', planta: [20, 150, 130, 90], liga: [['espera', -42], ['consultorio', 38]] },
  { id: 'espera', nome: 'Sala de estar', curto: 'Estar', foto: 'tour-espera', texto: 'Onde as famílias esperam e as crianças brincam antes da consulta.', planta: [20, 20, 130, 120], liga: [['recepcao', 40], ['cozinha', -30]] },
  { id: 'consultorio', nome: 'Consultório', curto: 'Consultório', foto: 'tour-consultorio', texto: 'Mesa redonda, luz natural e nenhuma barreira entre você e a nutricionista.', planta: [160, 150, 110, 90], liga: [['recepcao', -40], ['avaliacao', 36]] },
  { id: 'avaliacao', nome: 'Sala de avaliação', curto: 'Avaliação', foto: 'tour-avaliacao', texto: 'Bioimpedância e medidas em uma sala reservada, com trocador.', planta: [280, 150, 100, 90], liga: [['consultorio', -36], ['varanda', 30]] },
  { id: 'cozinha', nome: 'Cozinha-escola', curto: 'Cozinha', foto: 'tour-cozinha', texto: 'Bancada comprida para oito pessoas cozinharem juntas nas oficinas.', planta: [160, 20, 150, 120], liga: [['espera', 30], ['varanda', -34]] },
  { id: 'varanda', nome: 'Jardim de inverno', curto: 'Jardim', foto: 'tour-varanda', texto: 'Ervas plantadas por nós e um canto para as conversas de grupo.', planta: [320, 20, 60, 120], liga: [['cozinha', 34], ['avaliacao', -30]] },
];

// ---------- convênios ---------- [EXEMPLO] lista ilustrativa; conferir com o cliente quais aceita e como
// tipo: 'direto' (atende pelo plano, sem pagar na hora) ou 'reembolso' (paga e pede o reembolso com o recibo)
const convenios = [
  { nome: 'Unimed', tipo: 'reembolso', obs: 'Reembolso conforme o seu contrato. Enviamos recibo e relatório no mesmo dia.' },
  { nome: 'SulAmérica', tipo: 'reembolso', obs: 'Pedido de reembolso pelo aplicativo do plano, com o recibo que enviamos.' },
  { nome: 'Bradesco Saúde', tipo: 'reembolso', obs: 'Reembolso pelo aplicativo do plano. Alguns contratos pedem encaminhamento médico.' },
  { nome: 'Amil', tipo: 'reembolso', obs: 'Reembolso conforme a tabela do seu plano.' },
  { nome: 'Porto Saúde', tipo: 'reembolso', obs: 'Reembolso pelo aplicativo, com recibo e relatório.' },
  { nome: 'Omint', tipo: 'reembolso', obs: 'Reembolso com recibo. Costuma cobrir boa parte da consulta.' },
  { nome: 'Care Plus', tipo: 'reembolso', obs: 'Reembolso com recibo e relatório nutricional.' },
  { nome: 'Allianz Saúde', tipo: 'reembolso', obs: 'Reembolso conforme o contrato.' },
  { nome: 'Cassi', tipo: 'direto', obs: 'Atendimento direto pelo plano para consulta e retorno. Traga a carteirinha e um documento.' },
  { nome: 'Geap', tipo: 'direto', obs: 'Atendimento direto pelo plano com guia liberada. Pedimos a guia por você.' },
  { nome: 'Saúde Caixa', tipo: 'direto', obs: 'Atendimento direto pelo plano para consulta e retorno.' },
  { nome: 'Agemed', tipo: 'direto', obs: 'Atendimento direto pelo plano. Oficinas e programas são particulares.' },
  { nome: 'SC Saúde', tipo: 'direto', obs: 'Atendimento direto para servidores estaduais com a carteirinha ativa.' },
  { nome: 'Plano do sindicato ou da empresa', tipo: 'reembolso', obs: 'Na maioria dos casos dá para pedir reembolso. Mande o nome do plano no WhatsApp que conferimos.' },
];
const reembolso = [
  ['Você agenda e faz a consulta', 'Paga no Pix ou no cartão, como uma consulta particular.'],
  ['Enviamos o recibo e o relatório', 'No mesmo dia, por e-mail e na Área do cliente, com CPF, CRN e código do procedimento.'],
  ['Você pede o reembolso no app do plano', 'O valor volta conforme o seu contrato, em geral de 7 a 30 dias.'],
];

// ---------- avaliações do Google ---------- [EXEMPLO] de demonstração: trocar pelas reais do perfil do cliente
const google = { nota: 4.9, total: 187 };
const avaliacoes = [
  { nome: 'Camila Ribeiro', quando: 'há 2 semanas', prof: 'bruna', texto: 'Primeira vez que saio de uma consulta sem me sentir culpada. O plano tem pão, tem pizza no sábado e mesmo assim os exames melhoraram em três meses.' },
  { nome: 'Rafael Menezes', quando: 'há 1 mês', prof: 'diego', texto: 'Fiz minha primeira maratona com o plano de prova do Diego. Testamos tudo nos longões e no dia não tive nenhum problema de estômago.' },
  { nome: 'Juliana Pacheco', quando: 'há 1 mês', prof: 'taina', texto: 'A oficina de introdução alimentar tirou todo o meu medo de engasgo. A Tainá explica com calma e responde todas as mensagens.' },
  { nome: 'Fernanda Lopes', quando: 'há 2 meses', prof: 'luana', texto: 'Anos com o intestino irritado e ninguém investigava. A Luana pediu um diário, ajustamos por etapas e hoje como de quase tudo.' },
  { nome: 'Marcos Vieira', quando: 'há 2 meses', prof: 'bruna', texto: 'Uso medicação para emagrecer e estava perdendo músculo. Com o acompanhamento, ajustamos a proteína e a força voltou nos treinos.' },
  { nome: 'Patrícia Nunes', quando: 'há 3 meses', prof: 'taina', texto: 'Meu filho de 5 anos comia cinco alimentos. Hoje experimenta coisas novas na mesa com a gente. Valeu cada consulta.' },
  { nome: 'Aline Martins', quando: 'há 4 meses', prof: 'luana', texto: 'Na menopausa achei que nada ia funcionar. Plano simples, comida de verdade e um cuidado enorme na conversa.' },
  { nome: 'Thiago Rocha', quando: 'há 5 meses', prof: 'diego', texto: 'Ganhei massa magra sem viver de frango com batata-doce. O Diego entende de treino e de rotina corrida.' },
];

// ---------- dúvidas frequentes ----------
const faq = [
  ['Como é a primeira consulta?', 'Dura 75 minutos. Conversamos sobre rotina, sono, trabalho, gostos e histórico, fazemos a avaliação corporal e lemos os exames. O plano chega no app em até 3 dias úteis, com substituições e receitas.'],
  ['Preciso levar exames?', 'Se tiver exames de sangue dos últimos 6 meses, traga ou envie pelo WhatsApp. Se não tiver, tudo bem: indicamos o que vale pedir ao seu médico.'],
  ['Vocês atendem online?', 'Sim, por vídeo, para todo o Brasil, com o mesmo tempo de consulta. A avaliação corporal é feita por medidas que você aprende a tirar em casa.'],
  ['Atendem convênio?', 'Alguns planos atendem direto e os outros por reembolso. Use a busca de convênios nesta página ou mande o nome do seu plano no WhatsApp.'],
  ['O plano alimentar é restritivo?', 'Não. Ele parte do que você já come e gosta, tem substituições e espaço para restaurante, festa e fim de semana.'],
  ['Uso medicação para emagrecer. Posso fazer o acompanhamento?', 'Pode. Com menos fome, é comum faltar proteína e perder músculo. Acompanhamos a alimentação junto com o seu médico, que prescreve e ajusta a medicação.'],
  ['Quanto tempo dura o acompanhamento?', 'Depende do objetivo. A maioria das pessoas fica de 3 a 6 meses, com retornos a cada 30 a 45 dias, e depois segue com retornos mais espaçados.'],
  ['Como me preparo para a bioimpedância?', 'Jejum de 3 horas, sem café e sem exercício intenso nas 12 horas anteriores, bexiga vazia e sem objetos de metal. Gestantes e pessoas com marca-passo não fazem bioimpedância; nesse caso usamos outras medidas.'],
];

// ---------- política da consulta ----------
const politicas = [
  ['Agendamento', 'O horário fica reservado assim que confirmamos pelo WhatsApp. Lembramos da consulta na véspera, com o preparo da avaliação corporal.'],
  ['Atraso', 'Tolerância de 15 minutos. Depois disso, a consulta acontece no tempo que resta ou é remarcada, para não atrasar quem vem depois.'],
  ['Cancelamento e remarcação', 'Sem custo até 24 horas antes, pelo WhatsApp ou pela Área do cliente. Nos pacotes, falta sem aviso conta como encontro realizado.'],
  ['Garantia do plano', 'Se o plano não couber na sua rotina, ajustamos sem custo em até 15 dias depois da consulta, por mensagem ou em um encontro rápido.'],
];
// equivalentes do nicho aos "serviços sensíveis" (química e coloração no salão, clareamento no dentista)
const sensiveis = [
  ['Bioimpedância', 'Pede preparo: jejum de 3 horas, sem café e sem exercício intenso nas 12 horas anteriores e bexiga vazia. Não é feita em gestantes nem em quem usa marca-passo.'],
  ['Gestantes, crianças e quem usa medicação', 'Gestantes e crianças são atendidas só pelas profissionais da área. Menores de 18 anos vêm com um responsável. Quem usa medicação para emagrecer ou controlar a glicose é acompanhado em conjunto com o médico, que prescreve e ajusta a dose.'],
];

// ---------- blog ----------
// corpo: blocos ['p' | 'h2' | 'lista', texto ou lista]. Conteúdo informativo, revisado pela equipe do cliente antes de publicar.
const blog = [
  {
    slug: 'fome-fisica-ou-emocional', cat: 'Comportamento', autor: 'bruna', data: '2026-11-18', leitura: 5, foto: 'seg-comportamento',
    titulo: 'Fome física ou fome emocional: como perceber a diferença',
    resumo: 'Quatro perguntas simples para fazer antes de abrir a geladeira, e o que fazer quando a resposta é cansaço e não fome.',
    corpo: [
      ['p', 'Comer por emoção não é falta de força de vontade. Comida acalma, distrai e recompensa, e todo mundo usa a comida assim de vez em quando. O problema começa quando ela vira a única ferramenta para lidar com o cansaço, o tédio ou a ansiedade.'],
      ['h2', 'Como a fome física costuma aparecer'],
      ['p', 'A fome física chega aos poucos, algumas horas depois da última refeição, e aceita vários tipos de comida. Ela dá sinais no corpo: estômago roncando, menos concentração, leve irritação. E passa quando você come uma quantidade razoável.'],
      ['h2', 'E a emocional'],
      ['p', 'A fome emocional costuma chegar de repente, pede um alimento específico (quase sempre doce ou salgadinho) e não passa com a saciedade. Muitas vezes vem depois de uma situação: uma reunião difícil, uma discussão, a casa em silêncio à noite.'],
      ['h2', 'Quatro perguntas antes de comer'],
      ['lista', ['Quando foi a minha última refeição?', 'Eu comeria agora uma fruta ou um prato de comida, ou só aquele alimento?', 'O que aconteceu na última hora?', 'Do que eu preciso de verdade: comer, descansar, conversar ou sair um pouco?']],
      ['p', 'Às vezes a resposta vai ser comer, e tudo bem. A ideia não é proibir, é escolher. Comer sentado, sem tela e prestando atenção já muda muito a quantidade e a satisfação.'],
      ['p', 'Se você sente que perde o controle com frequência ou que a comida está atrapalhando a sua vida, procure ajuda. Nutricionista e psicólogo trabalham juntos nesses casos.'],
    ],
  },
  {
    slug: 'comer-antes-e-depois-do-treino', cat: 'Esporte', autor: 'diego', data: '2026-11-04', leitura: 4, foto: 'seg-esporte',
    titulo: 'O que comer antes e depois do treino da manhã',
    resumo: 'Treinar em jejum, comer uma banana ou tomar café completo? Depende do treino, e aqui vão opções práticas para cada caso.',
    corpo: [
      ['p', 'Quem treina cedo vive o mesmo dilema: acordar meia hora antes para comer ou treinar de barriga vazia. Não existe uma única resposta certa, mas existem bons pontos de partida.'],
      ['h2', 'Treino leve e curto'],
      ['p', 'Caminhada, yoga ou um treino de até 45 minutos em ritmo tranquilo costumam ir bem com pouca ou nenhuma comida antes, se você se sente bem assim. Água é indispensável.'],
      ['h2', 'Treino intenso ou longo'],
      ['p', 'Para intervalados, musculação pesada ou corridas acima de uma hora, um lanche leve de 30 a 60 minutos antes ajuda o rendimento. Prefira carboidratos de digestão fácil:'],
      ['lista', ['Banana com um fio de mel', 'Pão com geleia ou requeijão', 'Iogurte com aveia', 'Tapioca pequena com queijo']],
      ['h2', 'Depois do treino'],
      ['p', 'A refeição seguinte deve juntar proteína e carboidrato: ovos com pão e fruta, iogurte com granola, ou o próprio almoço se ele vier logo. Não é preciso correr para tomar um shake em 20 minutos, mas também não vale ficar horas sem comer.'],
      ['p', 'Tem prova marcada ou desconforto no estômago durante o treino? Aí vale um plano individual, testado nos treinos antes do grande dia.'],
    ],
  },
  {
    slug: 'introducao-alimentar-blw', cat: 'Infância', autor: 'taina', data: '2026-10-21', leitura: 6, foto: 'seg-infantil',
    titulo: 'Introdução alimentar: o que o BLW tem de bom e quando ter cautela',
    resumo: 'Pedaços, papinha ou os dois? Um guia sem dogma para escolher o caminho da sua família e reduzir o risco de engasgo.',
    corpo: [
      ['p', 'BLW é a sigla em inglês para desmame guiado pelo bebê: em vez de papinha na colher, o bebê recebe a comida em pedaços seguros e leva à boca sozinho. Muitas famílias misturam os dois métodos, e isso funciona bem.'],
      ['h2', 'O que o BLW tem de bom'],
      ['lista', ['O bebê explora cor, textura e cheiro de cada alimento', 'Participa das refeições da família desde cedo', 'Treina a coordenação da mão e da boca', 'Aprende a respeitar a própria saciedade']],
      ['h2', 'Quando ter cautela'],
      ['p', 'O bebê precisa sentar com apoio, ter interesse pela comida e ter perdido o reflexo de empurrar a comida com a língua, o que costuma acontecer por volta dos 6 meses. Prematuros, bebês com atraso no desenvolvimento ou dificuldade para engolir precisam de avaliação antes.'],
      ['h2', 'Segurança em primeiro lugar'],
      ['lista', ['Bebê sempre sentado e com um adulto olhando', 'Pedaços no formato de palito, do tamanho de um dedo de adulto', 'Alimentos macios que amassam entre os dedos', 'Nada de uva inteira, pipoca, castanha inteira ou salsicha em rodela']],
      ['p', 'Engasgo e reflexo de vômito são coisas diferentes, e saber distinguir os dois muda tudo. Por isso, na nossa oficina, os pais treinam a manobra de desengasgo antes de começar.'],
    ],
  },
  {
    slug: 'intestino-preso-o-que-olhar', cat: 'Intestino', autor: 'luana', data: '2026-10-07', leitura: 5, foto: 'seg-intestino',
    titulo: 'Intestino preso: fibras, água e o que mais olhar',
    resumo: 'Aumentar a fibra sem aumentar a água pode piorar. Veja por onde começar e quando procurar ajuda.',
    corpo: [
      ['p', 'Intestino preso é uma das queixas mais comuns no consultório, e a primeira reação costuma ser encher o prato de fibras. Elas ajudam, mas sozinhas podem até piorar o desconforto.'],
      ['h2', 'Fibra precisa de água'],
      ['p', 'As fibras absorvem água e dão volume ao bolo fecal. Sem água suficiente, o efeito é o contrário. Aumente as fibras aos poucos, ao longo de duas ou três semanas, e a água junto.'],
      ['h2', 'Onde estão as fibras'],
      ['lista', ['Feijão, lentilha e grão-de-bico', 'Frutas com casca e bagaço, como mamão, ameixa, laranja e kiwi', 'Verduras e legumes em todas as refeições', 'Aveia, chia e linhaça']],
      ['h2', 'Rotina também conta'],
      ['p', 'Movimento diário, horário regular para as refeições e não segurar a vontade de ir ao banheiro fazem tanta diferença quanto a comida. Um apoio para os pés no vaso sanitário ajuda a posição.'],
      ['h2', 'Quando procurar ajuda'],
      ['p', 'Sangue nas fezes, perda de peso sem explicação, dor forte ou mudança repentina no hábito intestinal pedem avaliação médica. E desconforto que dura meses merece uma investigação com calma, com diário de sintomas.'],
    ],
  },
  {
    slug: 'medicacao-para-emagrecer-e-alimentacao', cat: 'Comportamento', autor: 'bruna', data: '2026-09-23', leitura: 5, foto: 'bruna-frutas',
    titulo: 'Medicação para emagrecer: por que a alimentação continua importante',
    resumo: 'Com menos fome, o risco é comer pouco do que importa. Proteína, fibras e treino de força ajudam a preservar a saúde no processo.',
    corpo: [
      ['p', 'As medicações para obesidade prescritas pelo médico reduzem a fome e ajudam muita gente. Mas comer menos não é a mesma coisa que comer bem, e é aí que a nutrição entra.'],
      ['h2', 'O risco de perder músculo'],
      ['p', 'Com pouca fome, é comum pular refeições e comer quase só carboidrato. A perda de peso pode vir junto com perda de massa muscular, o que deixa o corpo mais fraco e facilita o reganho depois.'],
      ['h2', 'O que observar no prato'],
      ['lista', ['Proteína em todas as refeições, mesmo em porção pequena', 'Fibras e água para o intestino, que costuma ficar mais lento', 'Refeições menores e mais frequentes se houver enjoo', 'Treino de força orientado por um profissional de educação física']],
      ['h2', 'E quando parar a medicação'],
      ['p', 'O que você aprendeu sobre fome, saciedade e rotina é o que sustenta o resultado depois. Por isso o acompanhamento nutricional começa junto com a medicação, e não só no fim.'],
      ['p', 'A decisão de usar, ajustar ou parar a medicação é sempre do médico. A nutricionista acompanha a alimentação e conversa com ele quando é preciso.'],
    ],
  },
  {
    slug: 'frutas-da-estacao-florianopolis', cat: 'Na cozinha', autor: 'taina', data: '2026-09-09', leitura: 4, foto: 'feira-caixas',
    titulo: 'Frutas e verduras da estação em Florianópolis na primavera e no verão',
    resumo: 'O que está mais gostoso e mais barato nas feiras da Ilha nesta época, e três ideias para levar na lancheira.',
    corpo: [
      ['p', 'Comprar da estação é a forma mais simples de comer variado gastando menos. As feiras da Ilha e do continente mudam bastante entre a primavera e o verão.'],
      ['h2', 'Frutas que aparecem mais'],
      ['lista', ['Manga, abacaxi e melancia', 'Pêssego e ameixa a partir de novembro', 'Maracujá e acerola', 'Banana e mamão o ano todo']],
      ['h2', 'Verduras e legumes'],
      ['lista', ['Tomate, pepino e pimentão', 'Abobrinha e berinjela', 'Alface, rúcula e agrião', 'Milho verde no fim do ano']],
      ['h2', 'Três ideias para a lancheira'],
      ['lista', ['Palitos de manga com iogurte natural', 'Espetinho de melancia e queijo branco', 'Bolinho de banana com aveia, sem açúcar']],
      ['p', 'Leve as crianças à feira. Quem escolhe a fruta tem muito mais vontade de provar.'],
    ],
  },
];

// ---------- Instagram (perfil fictício) ----------
const instagram = [
  { foto: 'prato-graos', legenda: 'Bowl de grãos da oficina de marmitas' },
  { foto: 'cafe-manha', legenda: 'Café da manhã de domingo, sem regra' },
  { foto: 'aula-chef', legenda: 'Oficina de sábado na cozinha-escola' },
  { foto: 'citricos', legenda: 'Cítricos da estação' },
  { foto: 'potes', legenda: 'Potes da semana: monta em 40 minutos' },
  { foto: 'feira-cenouras', legenda: 'Feira do mês com o grupo do programa' },
];

// ---------- galeria por categoria ----------
const galeria = [
  { foto: 'tour-recepcao', cat: 'Clínica', legenda: 'Recepção' },
  { foto: 'bruna-sala', cat: 'Clínica', legenda: 'Consultório da Bruna' },
  { foto: 'tour-cozinha', cat: 'Clínica', legenda: 'Cozinha-escola' },
  { foto: 'aula-cozinha', cat: 'Oficinas', legenda: 'Oficina de marmitas' },
  { foto: 'corte', cat: 'Oficinas', legenda: 'Corte de legumes' },
  { foto: 'aula-grupo', cat: 'Oficinas', legenda: 'Cozinhando em grupo' },
  { foto: 'prato-rustico', cat: 'Pratos', legenda: 'Prato colorido de almoço' },
  { foto: 'prato-salmao', cat: 'Pratos', legenda: 'Bowl com salmão' },
  { foto: 'ovos', cat: 'Pratos', legenda: 'Ovos com abacate' },
  { foto: 'aveia', cat: 'Pratos', legenda: 'Aveia com frutas' },
  { foto: 'feira', cat: 'Feira', legenda: 'Banca de verduras' },
  { foto: 'cesta', cat: 'Feira', legenda: 'Cesta da semana' },
  { foto: 'feira-mesa', cat: 'Feira', legenda: 'Compras do mês na mesa' },
];

// ---------- Área do cliente (dados fictícios de demonstração) ----------
const area = {
  login: { cpf: '123.456.789-09', senha: 'salvi2026' },
  paciente: { nome: 'Marina Teixeira', curto: 'Marina', prof: 'bruna', programa: 'Programa Comer em Paz', inicio: '2026-09-02' },
  metas: ['Proteína no café da manhã em 5 dias', 'Duas frutas por dia', 'Jantar sentada e sem tela', 'Caminhar 30 minutos três vezes'],
  plano: [
    { refeicao: 'Café da manhã', hora: '7h', opcoes: ['Pão integral com ovos mexidos e mamão', 'Iogurte natural com aveia e banana', 'Tapioca com queijo e uma fruta'] },
    { refeicao: 'Lanche', hora: '10h', opcoes: ['Uma fruta e um punhado de castanhas', 'Iogurte com chia'] },
    { refeicao: 'Almoço', hora: '12h30', opcoes: ['Metade do prato com salada e legumes, arroz e feijão, peixe ou frango', 'Marmita da semana (receita da oficina)'] },
    { refeicao: 'Lanche da tarde', hora: '16h', opcoes: ['Pão com requeijão e café com leite', 'Vitamina de fruta com aveia'] },
    { refeicao: 'Jantar', hora: '20h', opcoes: ['Omelete com legumes e salada', 'Sopa de legumes com frango desfiado', 'Livre no sábado'] },
  ],
  // evolução: medidas por consulta [EXEMPLO]
  evolucao: [
    { data: '2026-09-02', cintura: 94, musculo: 24.1, energia: 2 },
    { data: '2026-10-07', cintura: 91, musculo: 24.4, energia: 3 },
    { data: '2026-11-11', cintura: 88.5, musculo: 24.9, energia: 4 },
  ],
  proxima: { data: '2026-12-16', hora: '9h', servico: 'Retorno', modal: 'Presencial' },
  compras: ['Aveia em flocos', 'Iogurte natural', 'Ovos', 'Mamão e banana', 'Feijão', 'Peito de frango', 'Folhas e tomate', 'Castanha-do-pará'],
  documentos: [
    { nome: 'Recibo da primeira consulta', data: '2026-09-02' },
    { nome: 'Relatório para reembolso', data: '2026-09-02' },
    { nome: 'Plano alimentar, versão 3', data: '2026-11-11' },
    { nome: 'Pedido de exames de rotina', data: '2026-11-11' },
  ],
};

// textos alternativos das fotos
const fotos = {
  'bruna-rosto': 'Rosto de Bruna Salvi, nutricionista',
  'bruna-retrato': 'Bruna Salvi, nutricionista, de jaleco no consultório segurando um brócolis',
  'bruna-mesa': 'Bruna Salvi na mesa do consultório, com frutas ao lado do computador',
  'bruna-consulta': 'Bruna Salvi mostrando uma maçã a um paciente durante a consulta',
  'bruna-frutas': 'Bruna Salvi no consultório, com uma fruteira na mesa',
  'bruna-sala': 'Consultório claro, com a nutricionista na mesa e diplomas na parede',
  'bruna-anota': 'Nutricionista anotando o plano alimentar ao lado de uma fruteira',
  'bruna-escuta': 'Paciente conversando com a nutricionista na consulta',
  diego: 'Diego Arruda, nutricionista esportivo, de camiseta branca e braços cruzados',
  taina: 'Tainá Couto, nutricionista materno-infantil, sorrindo',
  luana: 'Luana Prates, nutricionista de saúde intestinal e da mulher, de óculos',
  'prato-metodo': 'Bowl visto de cima com arroz, legumes, edamame e gergelim',
  'prato-graos': 'Bowl de grãos com folhas, tomate, abacate e legumes',
  'prato-rustico': 'Prato com legumes, ovo cozido e folhas sobre mesa de madeira',
  'prato-saladas': 'Várias saladas coloridas vistas de cima',
  'prato-grao-bico': 'Bowl com grão-de-bico, folhas e legumes',
  'prato-salmao': 'Bowl com salmão grelhado, legumes e folhas',
  'feira-mesa': 'Mesa com compras de feira, peixe, frutas e pães',
  marmitas: 'Marmitas da semana montadas com legumes, ovos e proteína',
  potes: 'Potes de vidro com refeições em camadas',
  'cafe-manha': 'Café da manhã com frutas, iogurte e pães visto de cima',
  iogurte: 'Iogurte com granola e frutas vermelhas',
  aveia: 'Tigela de aveia com frutas e sementes',
  ovos: 'Ovos cozidos com abacate e pão',
  citricos: 'Fatias de laranja, limão e toranja em fila',
  feira: 'Banca de feira com verduras e legumes frescos',
  'feira-cenouras': 'Cenouras e beterrabas numa banca de feira',
  'feira-caixas': 'Caixas de madeira com tomates e pimentões na feira',
  cesta: 'Cesta com legumes, frutas e verduras frescas',
  'aula-cozinha': 'Duas pessoas cozinhando juntas numa cozinha clara',
  'aula-grupo': 'Grupo cozinhando numa oficina em cozinha com prateleiras',
  'aula-chef': 'Oficina de culinária com várias pessoas na bancada',
  corte: 'Mãos cortando ervas frescas numa tábua',
  tabua: 'Tábua com legumes, ovos e ervas para cozinhar',
  'tour-recepcao': 'Recepção com poltronas de couro e plantas',
  'tour-espera': 'Sala de estar clara com sofá cinza',
  'tour-consultorio': 'Consultório com mesa redonda branca, cadeiras e plantas',
  'tour-avaliacao': 'Sala de avaliação clara com relógio e planta',
  'tour-cozinha': 'Cozinha-escola comprida com bancada e luz natural',
  'tour-varanda': 'Jardim de inverno com plantas e poltrona amarela',
  'seg-esporte': 'Corredora ao nascer do sol',
  'seg-gestacao': 'Gestante de perfil com as mãos na barriga',
  'seg-infantil': 'Mãe e filha preparando salada juntas na cozinha',
  'seg-comportamento': 'Mulher comendo com tranquilidade',
  'seg-intestino': 'Tigela de iogurte com sementes e frutas',
  'seg-longevidade': 'Senhora preparando salada na cozinha',
};

// ponto de interesse de cada foto (object-position), quando o centro não serve
const foco = {
  'bruna-retrato': '50% 30%', 'bruna-mesa': '45% 35%', 'bruna-consulta': '40% 30%', 'bruna-escuta': '50% 35%',
  diego: '50% 25%', taina: '50% 25%', luana: '50% 35%', 'seg-gestacao': '50% 40%', 'seg-comportamento': '50% 30%',
};

module.exports = {
  marca, horario, horarioLd, bairros, equipe, segmentos, servicos, pagamento, cancelamento, metodo, numeros, bastidores,
  tour, convenios, reembolso, google, avaliacoes, faq, politicas, sensiveis, blog, instagram, galeria, area, fotos, foco,
};
