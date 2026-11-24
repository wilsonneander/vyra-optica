// Conteúdo do Silver de odontologia (Raiz Odontologia), no desenho da referência Aveline.
// Marca, equipe, registros, endereço, telefones, números e valores são de DEMONSTRAÇÃO:
// para um cliente real, copiar para clientes/<cliente>/ e trocar tudo aqui (ver README do nicho).
module.exports = {
  marca: {
    nome: 'Raiz',
    sub: 'Odontologia',
    completo: 'Raiz Odontologia',
    razao: 'Raiz Odontologia Ltda.',
    cnpj: '00.000.000/0001-00',
    whatsapp: '5541998760000',
    whatsappTexto: '(41) 99876-0000',
    telefone: '(41) 3020-0000',
    telefoneLink: '+554130200000',
    email: 'contato@raizodonto.com.br',
    rua: 'Rua Francisco Rocha, 1200',
    bairro: 'Batel',
    cidade: 'Curitiba',
    uf: 'PR',
    cep: '80420-130',
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    responsavel: 'Dra. Helena Duarte, CRO-PR 23.481',
  },
  // horário usado no topo ("Aberto agora, até 19h") e no rodapé. dia: 0 = domingo
  horario: { 1: [8, 19], 2: [8, 19], 3: [8, 19], 4: [8, 19], 5: [8, 19], 6: [8, 13] },
  horarioTexto: ['Segunda a sexta, 8h às 19h', 'Sábado, 8h às 13h'],

  hero: {
    titulo: 'Odontologia moderna, com mão leve.',
    texto: 'Cuidado para sorrisos saudáveis em todas as idades. Com conforto, precisão e uma equipe que explica cada passo antes de ele acontecer.',
    prova: 'Do primeiro dente ao implante, a família inteira no mesmo lugar',
    // cada foto do carrossel apresenta um profissional
    slides: [
      { foto: 'hero-espelho', pos: '50% 28%', alt: 'Paciente sorrindo diante do espelho depois da consulta', prof: 'helena' },
      { foto: 'hero-conversa', pos: '60% 40%', alt: 'Dentista conversando com o paciente na cadeira do consultório', prof: 'rafael' },
      { foto: 'hero-cuidado', pos: '55% 40%', alt: 'Profissional sorrindo ao conversar com uma paciente idosa', prof: 'livia' },
      { foto: 'hero-consulta', pos: '50% 45%', alt: 'Dentista mostrando a placa à paciente durante a consulta', prof: 'caio' },
    ],
  },

  // a jornada em quatro paradas (a ordem aparece pela linha, sem números)
  jornada: [
    ['Avaliação do sorriso', 'Escaneamento 3D, radiografia de baixa dose e uma conversa de verdade sobre o que você quer.', 'escaner'],
    ['Plano por escrito', 'Prazos e valores no papel antes de qualquer tratamento começar.', 'plano'],
    ['Tratamento', 'Consultas calmas, sem pressa, sempre com o mesmo profissional.', 'cadeira'],
    ['Manutenção', 'Lembretes, limpezas e retornos que fazem o resultado durar.', 'calendario'],
  ],

  sobre: {
    frase: 'Fazemos uma odontologia pessoal, com tecnologia atual e mão leve, para que cada paciente saia com um sorriso saudável e um plano claro para mantê-lo assim.',
    numerosTitulo: 'Os números de quinze anos no Batel',
    // [valor, sufixo, rótulo]  (demonstração: trocar pelos números reais da clínica)
    numeros: [['98', '%', 'de pacientes satisfeitos'], ['12', ' mil', 'sorrisos atendidos'], ['4,9', '', 'nota no Google'], ['15', '', 'anos de clínica']],
    foto: 'retorno',
    legenda: 'Consultas sem pressa, explicadas passo a passo',
  },

  tratamentos: [
    { id: 'checkup', nome: 'Check-up e limpeza', foto: 'clinica-geral', tempo: '45 min', sessoes: '1 consulta',
      texto: 'Exame completo, limpeza profissional, polimento e orientação de escovação. É o ponto de partida de qualquer tratamento.',
      para: 'Todo mundo, a cada seis meses', inclui: ['Exame clínico e das gengivas', 'Remoção de tártaro e polimento', 'Flúor quando indicado'] },
    { id: 'clareamento', nome: 'Clareamento dental', foto: 'clareamento', tempo: '60 min', sessoes: '2 a 3 semanas',
      texto: 'Clareamento de consultório, caseiro com moldeira ou a combinação dos dois, com gel na concentração certa para os seus dentes.',
      para: 'Quem quer dentes mais claros sem mexer no formato', inclui: ['Avaliação de sensibilidade', 'Moldeiras feitas no escaneamento', 'Retorno para conferir a cor'] },
    { id: 'alinhadores', nome: 'Alinhadores invisíveis', foto: 'ortodontia', tempo: '6 a 18 meses', sessoes: 'Retorno a cada 6 semanas',
      texto: 'Placas transparentes trocadas em sequência, planejadas no computador. Você vê o movimento previsto antes de começar.',
      para: 'Adolescentes e adultos com dentes desalinhados', inclui: ['Simulação 3D do resultado', 'Todas as placas do plano', 'Contenção ao final'] },
    { id: 'implantes', nome: 'Implantes', foto: 'implantes', tempo: '2 a 3 etapas', sessoes: '3 a 6 meses',
      texto: 'Reposição do dente perdido com pino de titânio e coroa de cerâmica, com cirurgia guiada pelo planejamento digital.',
      para: 'Quem perdeu um ou mais dentes', inclui: ['Tomografia e guia cirúrgico', 'Provisório enquanto cicatriza', 'Coroa definitiva em cerâmica'] },
    { id: 'lentes', nome: 'Lentes de contato dental', foto: 'lentes', tempo: '2 consultas', sessoes: 'Cerca de 15 dias',
      texto: 'Lâminas finas de porcelana que corrigem cor, formato e pequenos espaços, com desgaste mínimo ou nenhum.',
      para: 'Quem quer mudar formato e cor do sorriso', inclui: ['Desenho digital do sorriso', 'Ensaio na boca antes de fazer', 'Ajuste fino na entrega'] },
    { id: 'criancas', nome: 'Odontopediatria', foto: 'kids', tempo: '30 min', sessoes: 'A cada 6 meses',
      texto: 'Consultas curtas, linguagem de criança e muita paciência. A primeira visita pode ser assim que nasce o primeiro dente.',
      para: 'Bebês, crianças e pré-adolescentes', inclui: ['Adaptação sem pressa', 'Selantes e flúor', 'Orientação para os pais'] },
    { id: 'diagnostico', nome: 'Diagnóstico digital', foto: 'radiografia', tempo: '20 min', sessoes: 'Incluso no check-up',
      texto: 'Radiografia digital de baixa dose e escaneamento 3D, com as imagens na tela para você entender o que está vendo.',
      para: 'Primeira consulta e acompanhamentos', inclui: ['Radiografias digitais', 'Escaneamento intraoral', 'Relatório com as imagens'] },
  ],

  // tipos de consulta do agendamento rápido [id, nome, duração, profissional]
  consultas: [
    ['checkup', 'Check-up e limpeza', '45 min', 'livia'],
    ['clareamento', 'Avaliação de clareamento', '30 min', 'helena'],
    ['alinhadores', 'Avaliação de alinhadores', '40 min', 'rafael'],
    ['implantes', 'Avaliação de implante', '40 min', 'caio'],
    ['urgencia', 'Urgência', '30 min', 'caio'],
  ],
  // exemplo de orçamento (demonstração)
  orcamento: { itens: [['Lentes de contato dental x4', 'R$ 7.200'], ['Desenho digital do sorriso', 'R$ 450'], ['Desconto à vista', '-R$ 765']], total: 'R$ 6.885', parcelas: 'ou 10x de R$ 768,50 sem juros' },

  equipe: [
    { id: 'helena', nome: 'Dra. Helena Duarte', area: 'Estética do sorriso', foto: 'equipe-helena', cro: 'CRO-PR 23.481',
      bio: 'Helena cuida da parte estética da clínica, do clareamento às lentes de contato. Ela desenha cada sorriso no computador antes, para você ver o resultado antes de qualquer dente ser tocado.',
      experiencia: '12 anos', formacao: 'Especialista em Dentística', dias: 'Seg, qua e sex' },
    { id: 'rafael', nome: 'Dr. Rafael Moura', area: 'Ortodontia', foto: 'equipe-rafael', cro: 'CRO-PR 25.907',
      bio: 'Rafael planeja aparelhos e alinhadores com simulação 3D. Gosta de mostrar no computador como cada dente vai andar e quanto tempo isso leva, sem promessa que a boca não cumpre.',
      experiencia: '10 anos', formacao: 'Mestre em Ortodontia', dias: 'Ter, qui e sáb' },
    { id: 'livia', nome: 'Dra. Lívia Andrade', area: 'Odontopediatria e prevenção', foto: 'equipe-livia', cro: 'CRO-PR 28.316',
      bio: 'Lívia atende das crianças pequenas aos avós. É quem mais conversa na clínica: explica o que vai fazer, deixa a criança pegar no espelhinho e só começa quando todo mundo está tranquilo.',
      experiencia: '8 anos', formacao: 'Especialista em Odontopediatria', dias: 'Seg a sex' },
    { id: 'caio', nome: 'Dr. Caio Ribeiro', area: 'Implantes e cirurgia', foto: 'equipe-caio', cro: 'CRO-PR 21.644',
      bio: 'Caio faz os implantes e as cirurgias da clínica com guia impresso a partir da tomografia. Atende também as urgências: dor, dente quebrado ou restauração que caiu.',
      experiencia: '15 anos', formacao: 'Especialista em Implantodontia', dias: 'Seg, ter e qui' },
  ],

  // antes e depois (o "antes" foi escurecido digitalmente: simulação ilustrativa, trocar por casos reais autorizados)
  casos: [
    { id: 'clareamento', nome: 'Clareamento', antes: 'ad-clareamento-antes', depois: 'ad-clareamento-depois', texto: 'Clareamento combinado, de consultório e caseiro, em três semanas. A cor sobe sem mudar o formato dos dentes.', tempo: '3 semanas' },
    { id: 'lentes', nome: 'Lentes de contato', antes: 'ad-lentes-antes', depois: 'ad-lentes-depois', texto: 'Lentes de porcelana nos dentes da frente para acertar cor e formato, com ensaio na boca antes da versão final.', tempo: '2 consultas' },
    { id: 'estetica', nome: 'Estética', antes: 'ad-estetica-antes', depois: 'ad-estetica-depois', texto: 'Restaurações estéticas em resina e polimento para devolver brilho e uniformidade ao sorriso.', tempo: '1 a 2 consultas' },
  ],

  clinica: {
    titulo: 'Estrutura atual para um sorriso mais saudável',
    texto: 'Quatro consultórios reservados, uma sala de espera silenciosa e equipamentos escolhidos tanto pelo conforto quanto pela precisão.',
    itens: [
      ['Radiografia digital de baixa dose', 'Muito menos radiação que o filme antigo, com a imagem na tela em segundos.', 'raio'],
      ['Coroas de cerâmica no mesmo dia', 'Desenhadas e fresadas aqui na clínica, colocadas numa única visita.', 'coroa'],
      ['Opções de conforto', 'Fones com cancelamento de ruído, manta pesada e sedação leve quando você pedir.', 'fone'],
    ],
    galeria: [['recepcao', 'Recepção'], ['lounge', 'Sala de espera'], ['instrumentos', 'Esterilização'], ['consultorio', 'Consultório']],
  },

  avaliacoes: [
    { nome: 'Juliana Prado', foto: 'av-1', tratamento: 'Alinhadores, 2025', texto: 'Fiquei anos fugindo de dentista e fui recebida com um sorriso logo na porta. Explicaram cada etapa do tratamento e em nenhum momento me senti apressada.' },
    { nome: 'Marcos Teixeira', foto: 'av-2', tratamento: 'Implante, 2025', texto: 'O Dr. Caio me mostrou a tomografia, o guia e o dente provisório antes da cirurgia. Fui para casa no mesmo dia, sem dor e sabendo exatamente o que vinha depois.' },
    { nome: 'Beatriz Lemos', foto: 'av-3', tratamento: 'Clareamento, 2026', texto: 'O orçamento veio por escrito, com tudo separado. Nada de surpresa no meio do caminho, e o resultado ficou natural, do jeito que eu pedi.' },
    { nome: 'Renata Alves', foto: 'av-4', tratamento: 'Odontopediatria, 2026', texto: 'Meu filho tinha pavor de dentista. A Dra. Lívia deixou ele segurar o espelhinho e contar os dentes. Agora ele pergunta quando é a próxima consulta.' },
  ],

  artigos: [
    { tag: 'Tecnologia', autor: 'Dr. Rafael Moura', data: '12 set 2026', leitura: '4 min', foto: 'escaner', titulo: 'Radiografia e tomografia digitais: o que você vê na tela',
      corpo: ['A radiografia digital usa um sensor no lugar do filme antigo. A dose de radiação é bem menor e a imagem aparece no monitor em segundos, sem revelação.', 'Na tomografia, o aparelho gira em volta da cabeça e monta uma imagem em 3D dos ossos e das raízes. É ela que mostra se há osso para um implante e onde passam os nervos.', 'Na consulta, a gente amplia as imagens na tela e mostra o que está vendo. Você sai entendendo o próprio tratamento, e pode pedir uma cópia dos exames.'] },
    { tag: 'Estética', autor: 'Dra. Helena Duarte', data: '28 ago 2026', leitura: '6 min', foto: 'clareamento', titulo: 'Clareamento de consultório ou fitas de farmácia: uma comparação honesta',
      corpo: ['As fitas vendidas em farmácia têm concentração baixa de gel e não se adaptam bem a todos os dentes. Funcionam pouco e de forma irregular, e podem irritar a gengiva.', 'No consultório, o gel é escolhido para o seu caso e a gengiva fica protegida. No clareamento caseiro supervisionado, a moldeira é feita sob medida a partir do escaneamento.', 'O mais importante vem antes: tratar cáries e sensibilidade. Clarear dente com problema só esconde o problema por um tempo.'] },
    { tag: 'Prevenção', autor: 'Dra. Lívia Andrade', data: '9 ago 2026', leitura: '3 min', foto: 'clinica-geral', titulo: 'Cinco sinais de que está na hora da limpeza',
      corpo: ['Gengiva que sangra ao escovar, mau hálito que não passa, sensibilidade ao gelado, manchas que a escova não tira e aquela sensação de dente áspero na língua.', 'Qualquer um deles já vale uma visita. O tártaro não sai com escova e, parado ali, inflama a gengiva aos poucos.', 'A limpeza profissional leva cerca de 45 minutos e, feita a cada seis meses, evita a maior parte dos tratamentos maiores.'] },
  ],

  faq: [
    ['Vocês atendem convênio?', 'Atendemos por reembolso dos principais planos odontológicos. Mande a carteirinha antes da consulta e a gente confere a cobertura e entrega o orçamento por escrito.'],
    ['Como é a primeira consulta?', 'Leva cerca de uma hora: escaneamento 3D, radiografias de baixa dose, exame completo e uma conversa sobre o que você quer. Você sai com um plano por escrito e os valores de tudo o que recomendarmos.'],
    ['Tem atendimento de urgência no mesmo dia?', 'Sim. Deixamos horários livres todos os dias úteis para urgência. Ligue ou chame no WhatsApp até as 11h que atendemos no mesmo dia em casos de dor, inchaço, dente quebrado ou restauração que caiu.'],
    ['Tenho medo de dentista. Como vocês ajudam?', 'Conte na hora de agendar. Marcamos uma consulta mais longa, explicamos cada passo antes e combinamos um sinal para parar quando você quiser. Temos fones, manta pesada e sedação leve.'],
    ['Dá para parcelar?', 'Tratamentos acima de R$ 500 podem ser parcelados em até 10 vezes sem juros no cartão. O orçamento já mostra o valor total e o valor de cada parcela.'],
    ['Com que idade levo meu filho pela primeira vez?', 'Assim que nascer o primeiro dente, ou até o primeiro aniversário. A primeira visita é curta, serve para a criança conhecer o lugar e para os pais tirarem dúvidas.'],
  ],

  contato: {
    titulo: 'Agende sua consulta hoje',
    texto: 'A equipe ajuda você a escolher o tratamento certo, e a primeira consulta já inclui o escaneamento 3D completo.',
  },
  bairros: ['Batel', 'Bigorrilho', 'Água Verde', 'Centro', 'Mercês', 'Seminário'],

  fotos: {
    escaner: 'Dentista apontando a tomografia dos dentes na tela',
    recepcao: 'Recepção da clínica com balcão de mármore e plantas',
    lounge: 'Sala de espera com sofás e luz suave',
    consultorio: 'Consultório claro com cadeira odontológica',
    instrumentos: 'Instrumentos esterilizados organizados na bandeja',
    'clinica-geral': 'Dentista examinando os dentes de um paciente',
    clareamento: 'Sorriso de dentes claros em close',
    ortodontia: 'Paciente colocando o alinhador transparente',
    implantes: 'Mão de luvas segurando um implante com coroa',
    lentes: 'Lentes de contato dental de porcelana',
    kids: 'Criança sorrindo na cadeira do dentista ao lado da mãe',
    radiografia: 'Radiografia digital dos dentes no monitor',
    retorno: 'Dentista mostrando o modelo de dente à paciente na cadeira',
  },
};
