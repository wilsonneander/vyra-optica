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

  diferenciais: [
    ['Planejamento digital do sorriso', 'Você vê a proposta na tela, com o seu rosto, antes de qualquer procedimento.'],
    ['Uma consulta sem pressa', 'A primeira conversa dura o tempo necessário. Sem encaixe, sem fila.'],
    ['Escaneamento sem massa', 'Moldagem digital em minutos, sem aquela massa desconfortável.'],
    ['Orçamento por escrito', 'Etapas, prazos e valores no papel antes de começar.'],
  ],

  tratamentos: [
    { id: 'implantes', nome: 'Implantes dentários', foto: 'implantes', frase: 'Raiz nova, firmeza de dente natural.', texto: 'Cirurgia guiada a partir da tomografia, com o implante posicionado no milímetro planejado. Coroas em cerâmica feitas para a sua cor de dente.', tempo: 'Planejamento em uma consulta' },
    { id: 'lentes', nome: 'Lentes de contato dental', foto: 'lentes', frase: 'Finas como uma lente, desenhadas para o seu rosto.', texto: 'Lâminas de porcelana que corrigem forma, cor e pequenos espaços com desgaste mínimo ou nenhum. O desenho é aprovado por você antes.', tempo: 'Ensaio do sorriso antes de decidir' },
    { id: 'clareamento', nome: 'Clareamento dental', foto: 'clareamento', frase: 'Mais claro, sem perder o natural.', texto: 'Técnica de consultório, caseira ou a combinação das duas, com controle de sensibilidade em cada etapa.', tempo: 'De duas a quatro semanas' },
    { id: 'ortodontia', nome: 'Ortodontia', foto: 'ortodontia', frase: 'Dentes no lugar, quase sem ninguém perceber.', texto: 'Alinhadores transparentes e aparelhos estéticos, com simulação digital do movimento do primeiro ao último dia.', tempo: 'Simulação na primeira visita' },
    { id: 'harmonizacao', nome: 'Harmonização orofacial', foto: 'harmonizacao', frase: 'Equilíbrio entre sorriso e rosto.', texto: 'Toxina botulínica, preenchimentos e bioestimuladores em doses moderadas, para quem quer parecer descansado e não diferente.', tempo: 'Avaliação facial completa' },
    { id: 'estetica', nome: 'Odontologia estética', foto: 'estetica', frase: 'Pequenos ajustes, grande diferença.', texto: 'Restaurações em resina, recontorno e gengivoplastia para alinhar proporções e deixar o sorriso inteiro em harmonia.', tempo: 'Muitas vezes em uma sessão' },
    { id: 'clinica', nome: 'Clínica geral', foto: 'clinica-geral', frase: 'O cuidado que mantém tudo de pé.', texto: 'Limpeza, prevenção, tratamento de canal e restaurações, com a mesma atenção dada aos casos mais complexos.', tempo: 'Retorno a cada seis meses' },
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
  },
};
