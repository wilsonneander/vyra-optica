// Conteúdo do Gold de odontologia (Sorrisus Prime). A marca vem da fachada enviada pelo cliente;
// dentista, registro, endereço e telefones são de demonstração e devem ser trocados pelos dados reais.
// Depoimentos e resultados NUNCA são inventados: os espaços ficam reservados até a clínica enviar relatos autorizados.
module.exports = {
  marca: {
    nome: 'Sorrisus Prime',
    sub: 'Odontologia Avançada',
    completo: 'Sorrisus Prime Odontologia Avançada',
    razao: 'Sorrisus Prime Odontologia Ltda.',
    cnpj: '00.000.000/0001-00',
    whatsapp: '5511987650000',
    whatsappTexto: '(11) 98765-0000',
    telefone: '(11) 3080-0000',
    telefoneLink: '+551130800000',
    email: 'contato@sorrisusprime.com.br',
    rua: 'Alameda Lorena, 1500',
    endereco: 'Alameda Lorena, 1500',
    bairro: 'Jardim Paulista',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01424-002',
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    linkedin: 'https://linkedin.com/',
  },

  // abertura da fachada
  chamada: 'Um novo conceito em odontologia.',
  apoio: 'Planejamento digital, mãos experientes e uma casa pensada para você se sentir bem desde a porta.',
  bemvindo: ['Seja bem-vindo.', 'A recepção é o primeiro cuidado.'],

  dentista: {
    nome: 'Dra. Marina Albuquerque',
    titulo: 'Cirurgiã-dentista',
    especialidade: 'Implantodontia e reabilitação oral estética',
    cro: 'CRO-SP 98.765',
    foto: 'dentista',
    resumo: 'Há mais de quinze anos a Dra. Marina devolve função e confiança a sorrisos que pareciam sem saída. Cada caso começa com escuta, passa por um planejamento digital completo e só depois chega à cadeira.',
    formacao: [
      ['2008', 'Graduação em Odontologia'],
      ['2011', 'Especialização em Implantodontia'],
      ['2014', 'Mestrado em Prótese Dentária'],
      ['2019', 'Formação avançada em lentes de contato dental e fluxo digital'],
    ],
    experiencia: [
      ['Implantes e reabilitação', 'Casos unitários, protocolos fixos e enxertos, com cirurgia guiada por computador.'],
      ['Estética do sorriso', 'Lentes de contato dental, facetas e clareamento, desenhados junto com o paciente.'],
      ['Ensino', 'Professora convidada em cursos de atualização para dentistas.'],
    ],
    filosofia: 'Um bom tratamento não se nota. A pessoa só volta a sorrir sem pensar nisso.',
  },

  // seção "A diferença": foto da consulta, números e o que muda no atendimento
  diferenca: {
    foto: 'diferenca',
    titulo: 'Tecnologia de ponta, *cuidado de perto*',
    texto: 'Da restauração simples à reabilitação completa, todo tratamento começa entendendo o que incomoda você e o que os seus dentes precisam. A técnica vem depois.',
    numeros: [['15', 'anos', 'de prática clínica'], ['7', 'tratamentos', 'no mesmo endereço']],
  },
  // [título, texto, desenho do ícone]
  diferenciais: [
    ['Consulta sem pressa', 'A primeira conversa dura o tempo necessário. Sem encaixe, sem fila.', 'cafe'],
    ['Diagnóstico digital', 'Escaneamento sem massa e imagens com dose reduzida, lidas junto com você.', 'scanner'],
    ['Plano feito para você', 'Etapas, prazos e valores por escrito antes de começar.', 'plano'],
    ['Resultado com cara de natural', 'O sorriso é desenhado na tela com o seu rosto e aprovado por você.', 'sorriso'],
  ],

  // `ad`: par de fotos antes e depois (simulação ilustrativa do modelo); `alto`: mídia mais alta no cartão
  tratamentos: [
    { id: 'clareamento', nome: 'Clareamento dental', ad: 'ad-clareamento', alto: true, frase: 'Mais claro, sem perder o natural.', texto: 'Técnica de consultório, caseira ou a combinação das duas, com controle de sensibilidade em cada etapa.', tempo: 'De duas a quatro semanas' },
    { id: 'implantes', nome: 'Implantes dentários', foto: 'implantes', alto: true, frase: 'Raiz nova, firmeza de dente natural.', texto: 'Cirurgia guiada a partir da tomografia, com o implante posicionado no milímetro planejado. Coroas em cerâmica feitas para a sua cor de dente.', tempo: 'Planejamento em uma consulta' },
    { id: 'ortodontia', nome: 'Ortodontia', foto: 'ortodontia', frase: 'Dentes no lugar, quase sem ninguém perceber.', texto: 'Alinhadores transparentes e aparelhos estéticos, com simulação digital do movimento do primeiro ao último dia.', tempo: 'Simulação na primeira visita' },
    { id: 'lentes', nome: 'Lentes de contato dental', ad: 'ad-lentes', frase: 'Finas como uma lente, desenhadas para o seu rosto.', texto: 'Lâminas de porcelana que corrigem forma, cor e pequenos espaços com desgaste mínimo ou nenhum. O desenho é aprovado por você antes.', tempo: 'Ensaio do sorriso antes de decidir' },
    { id: 'estetica', nome: 'Odontologia estética', ad: 'ad-estetica', frase: 'Pequenos ajustes, grande diferença.', texto: 'Restaurações em resina, recontorno e gengivoplastia para alinhar proporções e deixar o sorriso inteiro em harmonia.', tempo: 'Muitas vezes em uma sessão' },
    { id: 'harmonizacao', nome: 'Harmonização orofacial', foto: 'harmonizacao', frase: 'Equilíbrio entre sorriso e rosto.', texto: 'Toxina botulínica, preenchimentos e bioestimuladores em doses moderadas, para quem quer parecer descansado e não diferente.', tempo: 'Avaliação facial completa' },
    { id: 'clinica', nome: 'Clínica geral', foto: 'clinica-geral', frase: 'O cuidado que mantém tudo de pé.', texto: 'Limpeza, prevenção, tratamento de canal e restaurações, com a mesma atenção dada aos casos mais complexos.', tempo: 'Retorno a cada seis meses' },
  ],

  // avaliações de EXEMPLO do modelo: trocar por depoimentos reais, com autorização por escrito
  avaliacoes: [
    { nome: 'Camila Ferraz', foto: 'av-1', trat: 'Lentes de contato dental', quando: 'há 3 semanas', texto: 'Eu tinha vergonha de sorrir em foto. A Dra. Marina me mostrou o desenho na tela antes de tudo, e o resultado ficou exatamente como combinamos. Ninguém percebe que são lentes.' },
    { nome: 'Rafael Monteiro', foto: 'av-2', trat: 'Implante dentário', quando: 'há 1 mês', texto: 'Adiei o implante por anos por medo da cirurgia. Foi muito mais tranquilo do que eu imaginava, e o acompanhamento depois fez toda a diferença.' },
    { nome: 'Patrícia Lemos', foto: 'av-3', trat: 'Clareamento dental', quando: 'há 2 meses', texto: 'Fiz o clareamento combinado, consultório e em casa. A sensibilidade foi mínima porque eles ajustaram o gel a cada etapa. Atendimento impecável do começo ao fim.' },
    { nome: 'Antônio Guerra', foto: 'av-4', trat: 'Reabilitação oral', quando: 'há 2 meses', texto: 'Aos 68 anos voltei a comer de tudo. Explicaram cada etapa com calma e entregaram o orçamento por escrito, sem surpresa no meio do caminho.' },
    { nome: 'Juliana Prado', foto: 'av-5', trat: 'Ortodontia com alinhadores', quando: 'há 4 meses', texto: 'Vi a simulação do meu sorriso antes de começar e acompanhei cada troca de alinhador. Terminei antes do previsto e sem ninguém no trabalho reparar.' },
    { nome: 'Lucas Andrade', foto: 'av-6', trat: 'Clínica geral', quando: 'há 5 meses', texto: 'Cheguei com dor num sábado de manhã e fui atendido no mesmo dia. Recepção atenciosa, consultório impecável e nenhuma pressão para fazer o que eu não precisava.' },
  ],

  faq: [
    ['A primeira consulta é cobrada?', 'A avaliação tem valor informado na hora do agendamento, sem surpresa no dia. Nela você sai com o diagnóstico e o plano de tratamento por escrito.'],
    ['Vocês atendem convênio?', 'O atendimento é particular. Emitimos nota fiscal e relatório para você pedir reembolso ao seu plano, quando ele prevê essa opção.'],
    ['Dá para parcelar o tratamento?', 'Sim. O orçamento por escrito traz as formas de pagamento, com parcelamento no cartão e condições para tratamentos longos.'],
    ['O tratamento dói?', 'A anestesia é feita com aplicador eletrônico, bem mais confortável. Para quem tem medo de dentista, avaliamos o uso de sedação consciente.'],
    ['Quanto tempo duram as lentes de contato dental?', 'Com higiene em dia e retornos periódicos, costumam durar muitos anos. Hábitos como ranger os dentes influenciam, e isso é avaliado antes de indicar.'],
    ['Em quanto tempo fico com o dente do implante?', 'Depende do osso e de cada caso. Em alguns, o dente provisório é colocado no mesmo dia; em outros, espera-se a cicatrização. O prazo vem no seu plano.'],
    ['O clareamento deixa os dentes sensíveis?', 'Pode haver sensibilidade passageira. Ajustamos a concentração do gel e usamos dessensibilizante para que ela fique leve ou nem apareça.'],
    ['Vocês atendem urgência?', 'Sim. Em caso de dor, chame no WhatsApp: encaixamos no mesmo dia sempre que a agenda permite, inclusive aos sábados de manhã.'],
  ],

  estrutura: [
    { foto: 'lounge', titulo: 'Sala de espera', texto: 'Poltronas largas, café coado e luz baixa. A espera é curta, mas é confortável.' },
    { foto: 'consultorio', titulo: 'Consultórios', texto: 'Cadeiras com apoio lombar, televisão no teto e ar filtrado em cada sala.' },
    { foto: 'escaner', titulo: 'Escaneamento intraoral', texto: 'O modelo da sua boca em 3D na tela, em poucos minutos e sem massa.' },
    { foto: 'radiografia', titulo: 'Imagem digital', texto: 'Radiografia e tomografia com dose reduzida, lidas junto com você.' },
    { foto: 'conversa', titulo: 'Sala de planejamento', texto: 'Onde o tratamento é explicado, desenhado e aprovado antes de começar.' },
    { foto: 'instrumentos', titulo: 'Esterilização', texto: 'Instrumentais embalados um a um, autoclave com registro de cada ciclo.' },
  ],

  experiencia: [
    ['Você chega', 'Recepção sem balcão de fila: alguém vem até você com o seu nome.'],
    ['Conversa e exame', 'Escuta, fotos, escaneamento e imagens. Sem pressa.'],
    ['Planejamento', 'O plano aparece na tela, com etapas, prazos e valores por escrito.'],
    ['Tratamento', 'Sessões marcadas no seu ritmo, com retorno combinado.'],
  ],

  horarios: [
    ['Segunda a sexta', '8h às 20h'],
    ['Sábado', '8h às 13h'],
    ['Domingo e feriados', 'Fechado'],
  ],
  bairros: ['Jardim Paulista', 'Jardins', 'Pinheiros', 'Itaim Bibi', 'Vila Mariana', 'Moema', 'Paraíso', 'Consolação'],

  fotos: {
    fachada: 'Fachada da Sorrisus Prime ao entardecer, com ripado de madeira iluminado, letreiro e a recepção visível pelo vidro',
    recepcao: 'Recepção com balcão de mármore, parede em ripado de madeira e luminárias quadradas acesas',
    dentista: 'Dra. Marina Albuquerque de jaleco branco, braços cruzados e sorriso tranquilo, na recepção da clínica',
    conversa: 'Dentista conversando com uma paciente sentada na cadeira do consultório',
    implantes: 'Mão de luva segurando um implante dentário com a coroa encaixada',
    lentes: 'Lentes de contato dental de porcelana sobre fundo escuro',
    clareamento: 'Sorriso de dentes claros e lábios rosados em close',
    ortodontia: 'Mulher encaixando um alinhador transparente nos dentes',
    harmonizacao: 'Paciente reclinada recebendo aplicação na região do queixo',
    estetica: 'Mulher de cabelo ondulado sorrindo de olhos fechados',
    'clinica-geral': 'Dentista examinando os dentes de um paciente sorridente',
    consultorio: 'Consultório claro com cadeira odontológica, piso de madeira e janela ampla',
    escaner: 'Mão de luva apontando para a imagem 3D dos dentes num tablet',
    lounge: 'Sala de espera com sofás claros, parede de madeira e luz quente',
    radiografia: 'Dentista analisando radiografias dentárias num painel iluminado',
    instrumentos: 'Espelho e sonda odontológicos sobre superfície branca',
    diferenca: 'Paciente sorrindo ao se ver no espelho de mão, ao lado da dentista, com a radiografia na tela ao fundo',
  },
};
