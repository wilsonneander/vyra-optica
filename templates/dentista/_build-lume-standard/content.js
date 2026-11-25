// Conteúdo do Bronze de odontologia (Lume Odontologia), inspirado nas referências Elan Dental e Curevanta.
// Marca, equipe, registros, endereço, telefones e casos são de DEMONSTRAÇÃO:
// para um cliente real, copiar para clientes/<cliente>/ e trocar tudo aqui (ver README do nicho).
module.exports = {
  marca: {
    nome: 'Lume',
    sub: 'Odontologia',
    completo: 'Lume Odontologia',
    razao: 'Lume Odontologia Ltda.',
    cnpj: '00.000.000/0001-00',
    whatsapp: '5531998760000',
    whatsappTexto: '(31) 99876-0000',
    telefone: '(31) 3221-0000',
    telefoneLink: '+553132210000',
    email: 'contato@lumeodonto.com.br',
    rua: 'Rua Paraíba, 1000',
    bairro: 'Savassi',
    cidade: 'Belo Horizonte',
    uf: 'MG',
    cep: '30130-140',
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    responsavel: 'Dra. Beatriz Viana, CRO-MG 41.208',
  },
  // horário do topo ("Aberto agora") e do rodapé. dia: 0 = domingo
  horario: { 1: [8, 19], 2: [8, 19], 3: [8, 19], 4: [8, 19], 5: [8, 19], 6: [8, 12] },
  horarioTexto: ['Segunda a sexta, 8h às 19h', 'Sábado, 8h às 12h'],

  hero: {
    apoio: 'Clínica odontológica na Savassi',
    titulo: ['Odontologia com tempo', 'para ouvir você.'],
    texto: 'Do check-up ao implante, cada tratamento começa com uma conversa calma, fotos do seu sorriso e um plano por escrito antes de qualquer procedimento.',
    alt: 'Dentista sorrindo enquanto examina os dentes de um paciente na cadeira',
  },

  // o que a clínica garante (aparece no cartão do hero)
  garantias: ['Plano e valores por escrito', 'Urgência no mesmo dia', 'Parcelamento em até 10x'],

  tratamentos: [
    { id: 'clareamento', nome: 'Clareamento dental', foto: 'sorriso', pos: '64% 50%', tempo: '2 a 3 semanas',
      texto: 'Clareamento de consultório, caseiro com moldeira ou os dois juntos, com o gel certo para a sensibilidade dos seus dentes.' },
    { id: 'alinhadores', nome: 'Alinhadores invisíveis', foto: 'ortodontia', tempo: '6 a 18 meses',
      texto: 'Placas transparentes planejadas no computador. Você vê o movimento previsto antes de começar.' },
    { id: 'implantes', nome: 'Implantes', foto: 'implante', tempo: '3 a 6 meses',
      texto: 'Pino de titânio e coroa de cerâmica no lugar do dente perdido, com cirurgia guiada pela tomografia.' },
    { id: 'lentes', nome: 'Lentes de contato dental', foto: 'lentes-close', tempo: '2 consultas',
      texto: 'Lâminas finas de porcelana que acertam cor, formato e pequenos espaços, com ensaio na boca antes.' },
    { id: 'checkup', nome: 'Check-up e limpeza', foto: 'limpeza', tempo: '45 minutos',
      texto: 'Exame completo, limpeza, polimento e orientação de escovação. O ponto de partida de tudo.' },
    { id: 'proteses', nome: 'Próteses e coroas', foto: 'protese', tempo: '2 a 4 semanas',
      texto: 'Coroas, pontes e próteses que devolvem a mastigação e o sorriso com conforto, do jeito que o rosto pede.' },
    { id: 'criancas', nome: 'Odontopediatria', foto: 'kids', tempo: 'A cada 6 meses',
      texto: 'Consulta curta, linguagem de criança e muita paciência, desde o primeiro dentinho.' },
  ],

  // antes e depois (o "antes" foi escurecido digitalmente: simulação ilustrativa, trocar por casos reais autorizados)
  casos: [
    { id: 'clareamento', nome: 'Clareamento', antes: 'ad-clareamento-antes', depois: 'ad-clareamento-depois',
      titulo: 'Dentes mais claros, sem mudar o formato.', texto: 'Clareamento combinado, de consultório e caseiro, com controle de sensibilidade a cada semana.',
      dados: [['Tratamento', 'Clareamento combinado'], ['Prazo', '3 semanas'], ['Consultas', '3']] },
    { id: 'lentes', nome: 'Lentes de contato', antes: 'ad-lentes-antes', depois: 'ad-lentes-depois',
      titulo: 'Cor e formato acertados, com cara de dente.', texto: 'Lentes de porcelana nos dentes da frente, com ensaio na boca antes da versão final.',
      dados: [['Tratamento', 'Lentes de porcelana'], ['Prazo', '15 dias'], ['Consultas', '2']] },
    { id: 'estetica', nome: 'Restauração estética', antes: 'ad-estetica-antes', depois: 'ad-estetica-depois',
      titulo: 'Brilho e uniformidade de volta ao sorriso.', texto: 'Restaurações em resina e polimento para devolver a cor uniforme aos dentes.',
      dados: [['Tratamento', 'Resina e polimento'], ['Prazo', '1 semana'], ['Consultas', '2']] },
  ],

  // procedimentos do dia a dia: [id, nome, texto, duração, depois, foto]
  procedimentos: [
    ['restauracao', 'Restauração em resina', 'Remove a cárie e reconstrói o dente na cor exata dele.', '40 min', 'Come normalmente em 2 horas', 'restauracao'],
    ['canal', 'Tratamento de canal', 'Limpa o interior do dente com anestesia e salva o dente natural.', '1 a 2 sessões', 'Volta à rotina no mesmo dia', 'canal'],
    ['siso', 'Extração e siso', 'Cirurgia planejada pela radiografia, com orientação por escrito para casa.', '30 a 60 min', '2 a 3 dias de repouso leve', 'cirurgia'],
    ['gengiva', 'Raspagem e gengiva', 'Trata sangramento e inflamação da gengiva abaixo da linha dos dentes.', '1 a 4 sessões', 'Sensibilidade leve por 1 dia', 'gengiva'],
    ['protese', 'Moldagem digital', 'Escaneamento 3D no lugar da massinha para coroas, placas e próteses.', '15 min', 'Sem desconforto', 'protese-modelo'],
    ['radiografia', 'Radiografia digital', 'Imagem de baixa dose na tela em segundos, explicada na consulta.', '10 min', 'Cópia digital para você', 'radiografia'],
    ['urgencia', 'Urgência no mesmo dia', 'Dor, inchaço, dente quebrado ou restauração que caiu. Ligue até as 11h.', 'Mesmo dia', 'Plano de continuidade', 'urgencia'],
  ],

  equipe: [
    { id: 'beatriz', nome: 'Dra. Beatriz Viana', area: 'Estética e clínica geral', foto: 'equipe-beatriz', cro: 'CRO-MG 41.208',
      bio: 'Fundadora da Lume. Desenha cada sorriso no computador antes de tocar em qualquer dente.' },
    { id: 'tomas', nome: 'Dr. Tomás Rezende', area: 'Implantes e cirurgia', foto: 'equipe-tomas', cro: 'CRO-MG 38.715',
      bio: 'Faz implantes com guia impresso a partir da tomografia e atende as urgências cirúrgicas.' },
    { id: 'clara', nome: 'Dra. Clara Nogueira', area: 'Ortodontia e odontopediatria', foto: 'equipe-clara', cro: 'CRO-MG 47.330',
      bio: 'Cuida dos alinhadores e das crianças. Explica cada passo antes e só começa com todo mundo tranquilo.' },
    { id: 'andre', nome: 'Dr. André Lacerda', area: 'Endodontia', foto: 'equipe-andre', cro: 'CRO-MG 44.092',
      bio: 'Especialista em canal com microscópio. Prefere salvar o dente natural sempre que dá.' },
  ],

  clinica: {
    titulo: ['Uma clínica clara,', 'feita para você relaxar.'],
    texto: 'Três consultórios com luz natural, uma sala de espera silenciosa e esterilização à vista. Equipamento escolhido pelo conforto tanto quanto pela precisão.',
    itens: [
      ['Esterilização à vista', 'Instrumentos embalados e abertos na sua frente.'],
      ['Escaneamento 3D', 'Moldagem digital, sem a massinha que dá enjoo.'],
      ['Conforto na cadeira', 'Fones, manta e pausa combinada quando você precisar.'],
    ],
    // [foto, legenda]
    fotos: [['sala-laranja', 'Consultório'], ['espera', 'Sala de espera'], ['corredor', 'Recepção'], ['consultorio-claro', 'Consultório com luz natural'], ['instrumentos-mao', 'Instrumentos esterilizados'], ['sala-quadro', 'Consultório'], ['modelo', 'Planejamento de implante'], ['instrumento', 'Exame clínico']],
  },

  faq: [
    ['Vocês atendem convênio?', 'Atendemos por reembolso dos principais planos odontológicos. Mande a carteirinha antes da consulta e a recepção confere a cobertura e entrega o orçamento por escrito.'],
    ['Como é a primeira consulta?', 'Leva cerca de uma hora: fotos do sorriso, radiografia de baixa dose, exame completo e uma conversa sobre o que você quer. Você sai com o plano e os valores por escrito.'],
    ['Tem atendimento de urgência?', 'Sim. Reservamos horários todos os dias úteis. Chame no WhatsApp ou ligue até as 11h para ser atendido no mesmo dia em casos de dor, inchaço ou dente quebrado.'],
    ['Dá para parcelar o tratamento?', 'Tratamentos acima de R$ 500 podem ser parcelados em até 10 vezes sem juros no cartão. O orçamento já mostra o total e o valor de cada parcela.'],
    ['Tenho medo de dentista. Como vocês ajudam?', 'Conte na hora de agendar. Marcamos uma consulta mais longa, explicamos tudo antes e combinamos um sinal para parar quando você quiser.'],
    ['Com que idade levo meu filho?', 'Assim que nascer o primeiro dente, ou até o primeiro aniversário. A primeira visita é curta e serve para a criança conhecer o lugar.'],
  ],

  agendar: {
    titulo: ['Seu próximo sorriso', 'começa numa conversa.'],
    texto: 'Conte o que você precisa e escolha o período. A recepção confirma o horário pelo WhatsApp.',
  },
  bairros: ['Savassi', 'Funcionários', 'Lourdes', 'Santo Antônio', 'Serra', 'Cruzeiro'],

  fotos: {
    sorriso: 'Mulher sorrindo com dentes claros, em close',
    ortodontia: 'Paciente colocando o alinhador transparente',
    implante: 'Mão de luvas segurando um implante com coroa',
    'lentes-close': 'Sorriso de dentes alinhados e claros em close',
    limpeza: 'Exame dos dentes com espelho clínico',
    protese: 'Senhora de cabelos grisalhos sorrindo',
    kids: 'Criança sorrindo na cadeira do dentista ao lado da mãe',
    restauracao: 'Dentista atendendo uma paciente na cadeira',
    canal: 'Dentista examinando um paciente com cuidado',
    cirurgia: 'Dois dentistas paramentados durante um procedimento',
    gengiva: 'Dentista examinando a gengiva de uma paciente',
    'protese-modelo': 'Dentista mostrando uma prótese no modelo de arcada',
    radiografia: 'Radiografia digital dos dentes no monitor',
    urgencia: 'Dentista atendendo uma paciente com a luz do refletor acesa',
    'sala-laranja': 'Consultório com cadeira laranja e luz natural',
    espera: 'Sala de espera com cadeiras e planta',
    corredor: 'Recepção clara com paciente lendo na poltrona',
    'consultorio-claro': 'Consultório amplo com janelas e cadeira odontológica',
    'instrumentos-mao': 'Mão de luvas segurando instrumentos esterilizados',
    'sala-quadro': 'Consultório com cadeira azul e quadro na parede',
    modelo: 'Modelo de arcada com implante sobre a mesa',
    instrumento: 'Espelho clínico e sonda sobre a bancada',
    'retrato-sorriso': 'Mulher sorrindo de blusa vermelha',
    'cadeira-sorriso': 'Paciente sorrindo na cadeira do dentista',
  },
};
