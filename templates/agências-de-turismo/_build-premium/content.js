// Conteúdo do modelo Premium de agência de turismo: Peakalika Turismo (Curitiba).
// Textos, destinos, preços, serviços, depoimentos e contatos reaproveitados de https://peakalikaturismo.com/ (nov/2026).
// [EXEMPLO] = não existe no site original; confirmar com a cliente antes de publicar.
module.exports = {
  marca: {
    nome: 'Peakalika',
    completo: 'Peakalika Turismo',
    frase: 'Na Peakalika, sua viagem é única, assim como as memórias que você leva para a vida toda.',
    whatsapp: '5541987856236',
    whatsappVistos: '5541925165995', // no site original o botão de vistos usa este número
    telefone: '(41) 98785-6236',
    instagram: 'https://www.instagram.com/peakalikaturismo/',
    facebook: 'https://www.facebook.com/peakalikaturismo',
    portalDisney: 'https://peakalika.suncoastusa.com.br/?chave=643FA7F5-DECF-457B-880E-0018D8284198',
    cidade: 'Curitiba, PR',
    endereco: 'Atendimento em Curitiba e online', // [EXEMPLO] o site original não informa endereço
    horario: 'Segunda a sexta, das 9h às 18h. Sábado, das 9h às 13h.', // [EXEMPLO]
    site: 'https://peakalikaturismo.com/',
  },

  // abertura comercial usada no aviso "estamos online agora" do chat ([EXEMPLO], igual ao horário acima)
  abertura: { 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [9, 13] },

  capa: {
    titulo: ['Era uma vez', 'a sua próxima', 'viagem.'],
    texto: 'Comece a planejar hoje com a Peakalika Turismo. Passagens, hotéis, parques e vistos com quem cuida de cada detalhe, do primeiro sonho ao último fogo de artifício.',
    // vídeos da capa (os mesmos temas do site original: fogos na Disney, família viajando, parques)
    videos: [
      { id: 'capa-fogos', alt: 'Fogos de artifício sobre o Castelo da Cinderela no Magic Kingdom' },
      { id: 'castelo-dia', alt: 'Castelo da Cinderela em um dia de sol, com visitantes na praça' },
      { id: 'balao-mickey', alt: 'Mickey e Minnie acenando de um balão no desfile do Magic Kingdom' },
      { id: 'toy-story', alt: 'Família no brinquedo do Slinky Dog em Toy Story Land' },
    ],
  },

  // buscador do site original: abas e campos (a busca vira mensagem pronta no WhatsApp)
  busca: {
    abas: ['Voos', 'Hotéis', 'Voo + Hotel', 'Carros', 'Exclusivos', 'Seguros'],
    trechos: ['Ida e volta', 'Só ida', 'Vários destinos'],
  },

  // galeria de fotos (destinos, serviços e cenas da Disney tiradas dos vídeos)
  galeria: {
    titulo: 'Para onde vai a sua próxima história?',
    texto: 'Europa, Oriente, Estados Unidos, Caribe e alto mar. A Peakalika monta o roteiro, você só escolhe o cenário.',
    faixas: [
      [['img/paris', 'Paris'], ['video/castelo-dia', 'Magic Kingdom'], ['img/roma', 'Roma'], ['img/cruzeiros', 'Cruzeiros'], ['img/dubai', 'Dubai'], ['video/balao-mickey', 'Desfile Disney'], ['img/veneza', 'Veneza'], ['img/xcaret', 'Xcaret'], ['img/toquio', 'Tóquio']].map(([src, nome]) => ({ src, nome })),
      [['img/londres', 'Londres'], ['video/parada', 'Main Street'], ['img/universal', 'Universal'], ['img/lisboa', 'Lisboa'], ['video/castelo-entardecer', 'Castelo ao entardecer'], ['img/nova-york', 'Nova York'], ['img/passeios', 'Passeios'], ['img/madrid', 'Madrid'], ['video/branca-de-neve', 'Personagens']].map(([src, nome]) => ({ src, nome })),
    ],
  },

  faixa: ['Passagens', 'Hotéis', 'Walt Disney World', 'Universal', 'Cruzeiros', 'Vistos', 'Xcaret', 'Seguro viagem', 'Transfers'],

  destinos: {
    titulo: 'Destinos internacionais',
    texto: 'Viva experiências únicas, conheça culturas fascinantes e crie memórias que vão durar para sempre. Na Peakalika Turismo, selecionamos os melhores destinos internacionais para transformar o seu sonho de viajar em realidade, com pacotes planejados para oferecer conforto e segurança.',
    // ponto de partida das rotas no mapa
    origem: { cidade: 'Curitiba', cod: 'CWB', lat: -25.43, lon: -49.27 },
    // lat/lon da cidade e código do aeroporto principal; a distância até Curitiba é calculada no build
    lista: [
      { foto: 'img/paris', ponto: 'Torre Eiffel', cidade: 'Paris', pais: 'França', cod: 'CDG', lat: 48.86, lon: 2.35, preco: 'A partir de R$460,86', link: 'https://www.civitatis.com/pt/paris/sessao-fotografica-privada-torre-eiffel/?ag_aid=80927' },
      { foto: 'img/roma', ponto: 'Coliseu', cidade: 'Roma', pais: 'Itália', cod: 'FCO', lat: 41.9, lon: 12.5, preco: 'A partir de R$467,64', link: 'https://www.civitatis.com/pt/roma/visita-guiada-coliseu/?ag_aid=80927' },
      { foto: 'img/veneza', ponto: 'Gôndola e Ponte dos Suspiros', cidade: 'Veneza', pais: 'Itália', cod: 'VCE', lat: 45.44, lon: 12.32, preco: 'A partir de R$243,98', link: 'https://www.civitatis.com/pt/veneza/passeio-gondola-ponte-suspiros/?ag_aid=80927' },
      { foto: 'img/madrid', ponto: 'Visita guiada', cidade: 'Madrid', pais: 'Espanha', cod: 'MAD', lat: 40.42, lon: -3.7, preco: 'Free tour', link: 'https://www.civitatis.com/pt/madrid/visita-guiada-madrid/?ag_aid=80927' },
      { foto: 'img/lisboa', ponto: 'Centro histórico', cidade: 'Lisboa', pais: 'Portugal', cod: 'LIS', lat: 38.72, lon: -9.14, preco: 'Free tour', link: 'https://www.civitatis.com/pt/lisboa/free-tour-lisboa/?ag_aid=80927' },
      { foto: 'img/londres', ponto: 'Centro de Londres', cidade: 'Londres', pais: 'Inglaterra', cod: 'LHR', lat: 51.51, lon: -0.13, preco: 'Free tour', link: 'https://www.civitatis.com/pt/londres/free-tour-londres/?ag_aid=80927' },
      { foto: 'img/dubai', ponto: 'Tour completo', cidade: 'Dubai', pais: 'Emirados Árabes', cod: 'DXB', lat: 25.2, lon: 55.27, preco: 'A partir de R$400,53', link: 'https://www.civitatis.com/pt/dubai/tour-completo-dubai/?ag_aid=80927' },
      { foto: 'img/toquio', ponto: 'Tour completo', cidade: 'Tóquio', pais: 'Japão', cod: 'HND', lat: 35.68, lon: 139.69, preco: 'A partir de R$744,11', link: 'https://www.civitatis.com/pt/toquio/tour-completo-toquio/?ag_aid=80927' },
      { foto: 'img/nova-york', ponto: 'Manhattan', cidade: 'Nova York', pais: 'Estados Unidos', cod: 'JFK', lat: 40.71, lon: -74.0, preco: 'Roteiro sob consulta', wa: 'Olá! Quero um roteiro para Nova York com a Peakalika Turismo.' },
      { foto: 'video/castelo-dia', ponto: 'Walt Disney World e Universal', cidade: 'Orlando', pais: 'Estados Unidos', cod: 'MCO', lat: 28.54, lon: -81.38, preco: 'Pacotes Disney', link: 'https://peakalika.suncoastusa.com.br/?chave=643FA7F5-DECF-457B-880E-0018D8284198' },
    ],
  },

  // transições 3D em primeira pessoa; o nome da próxima seção vem em direção à tela
  // modo aviao: voo entre nuvens com um avião vindo do horizonte; modo montanha: montanha-russa
  transicoes: {
    destinos: { modo: 'aviao', nome: 'Destinos', apoio: 'Próxima parada', semente: 5 },
    disney: { modo: 'montanha', nome: 'Orlando', apoio: 'Próxima parada', semente: 11 },
  },

  disney: {
    titulo: 'A magia da Disney começa aqui',
    texto: 'O seu sonho vai virar realidade! Na Walt Disney World®, cada momento é único e, com a Peakalika Turismo, você vive essa experiência com tudo planejado: hospedagem, ingressos para todos os parques e guiamento virtual exclusivo para aproveitar cada segundo sem filas e com os melhores roteiros.',
    citacao: 'Se você pode sonhar, você pode fazer.',
    autor: 'Walt Disney',
    // o que entra no planejamento (tirado do texto original)
    itens: [
      { t: 'Hospedagem', d: 'Hotéis dentro e perto dos parques, escolhidos pelo perfil da sua família.' },
      { t: 'Ingressos para todos os parques', d: 'Magic Kingdom, EPCOT, Hollywood Studios e Animal Kingdom no mesmo plano.' },
      { t: 'Guiamento virtual exclusivo', d: 'Roteiro dia a dia para aproveitar cada segundo sem filas.' },
    ],
  },

  // "Um dia perfeito na Disney": roteiro em vídeo com linha do tempo, avança com o scroll.
  // Horários ilustrativos de um roteiro do guiamento virtual (não são a programação oficial dos parques).
  dia: {
    titulo: 'Um dia perfeito na Disney',
    apoio: 'Roteiro de exemplo do nosso guiamento virtual',
    momentos: [
      { hora: '8h', video: 'castelo-dia', t: 'Portões abertos', d: 'Chegar cedo é o primeiro segredo do roteiro: castelo quase vazio para a foto perfeita.' },
      { hora: '10h', video: 'branca-de-neve', t: 'Encontro com personagens', d: 'Branca de Neve e os anões na rua. A gente diz onde e quando encontrar cada um.' },
      { hora: '12h', video: 'balao-mickey', t: 'Desfile', d: 'Mickey e Minnie no balão, com lugar marcado no ponto de melhor vista do desfile.' },
      { hora: '14h', video: 'toy-story', t: 'Toy Story Land', d: 'As atrações certas para a idade de cada um, no horário de fila menor.' },
      { hora: '16h', video: 'parada', t: 'Parada na Main Street', d: 'Carros alegóricos e música. Hora de guardar o celular e só viver.' },
      { hora: '18h', video: 'main-street', t: 'Lembranças', d: 'O fim de tarde pede compras sem pressa e a última volta pela Main Street.' },
      { hora: '19h', video: 'castelo-entardecer', t: 'As luzes acendem', d: 'O castelo muda de cor e a noite começa. Lugar garantido para o grande final.' },
      { hora: '21h', video: 'capa-fogos', t: 'Fogos sobre o castelo', d: 'O céu acende e todo mundo se arrepia. Final feliz de um dia planejado.' },
    ],
  },

  servicos: {
    titulo: 'Nossos serviços',
    texto: 'Na Peakalika Turismo, não vendemos apenas passagens, criamos experiências completas para que cada detalhe da sua viagem seja inesquecível. Por isso, oferecemos uma linha completa de serviços para facilitar sua jornada.',
    // mosaico: tam = g (2x2), alto (1x2), largo (2x1), p (1x1). Disney toca vídeo.
    lista: [
      { foto: 'disney', video: 'castelo-dia', nome: 'Disney', d: 'Viva a magia da Disney com pacotes e ingressos exclusivos.', tam: 'g' },
      { foto: 'hospedagem', nome: 'Hospedagem', d: 'Encontre os melhores hotéis e pousadas para sua viagem dos sonhos.', tam: 'alto' },
      { foto: 'passagens', nome: 'Passagens', d: 'Passagens aéreas com os melhores preços e condições de pagamento.', tam: 'p' },
      { foto: 'pacotes', nome: 'Pacotes', d: 'Pacotes completos com hospedagem, passagens e passeios inclusos.', tam: 'p' },
      { foto: 'passeios', nome: 'Passeios', d: 'Descubra os pontos turísticos mais incríveis com nossos guias especializados.', tam: 'alto' },
      { foto: 'universal', nome: 'Universal', d: 'Ingressos e pacotes para os parques da Universal Studios.', tam: 'largo' },
      { foto: 'cruzeiros', nome: 'Cruzeiros', d: 'Explore o mundo em alto mar com os melhores cruzeiros.', tam: 'alto' },
      { foto: 'xcaret', nome: 'Xcaret', d: 'Experiências únicas nos parques Xcaret no México.', tam: 'alto' },
      { foto: 'transfers', nome: 'Transfers', d: 'Transporte seguro e confortável do aeroporto até seu destino.', tam: 'p' },
      { foto: 'carros', nome: 'Aluguel de carros', d: 'Liberdade para explorar seu destino com carros de todas as categorias.', tam: 'p' },
      { foto: 'seguros', nome: 'Seguros', d: 'Viaje com tranquilidade com nossos seguros de viagem completos.', tam: 'largo' },
    ],
  },

  vistos: {
    apoio: 'Assessoria especializada em vistos',
    titulo: 'Seu visto americano sem preocupações',
    texto: 'Com atendimento personalizado, cuidamos de todo o processo do visto americano, do formulário à entrevista.',
    texto2: 'Você só pensa na melhor parte: embarcar para os EUA e viver sua viagem dos sonhos.',
    // caminho do processo (a ordem aparece no traçado, sem números)
    etapas: [
      { t: 'Formulário', d: 'Preenchemos o DS-160 com você, campo por campo.' },
      { t: 'Documentos', d: 'Lista certa para o seu perfil, sem papel sobrando.' },
      { t: 'Agendamento', d: 'Datas de CASV e consulado acompanhadas de perto.' },
      { t: 'Entrevista', d: 'Simulação e orientação para chegar tranquilo.' },
      { t: 'Embarque', d: 'Visto aprovado, mala pronta, rumo aos EUA.' },
    ],
  },

  consultora: {
    nome: '', // [EXEMPLO] nome da consultora da foto (não aparece no site original)
    titulo: 'Quem planeja com você',
    texto: 'Atendimento personalizado, atenção aos detalhes e suporte do início ao fim. Cada roteiro sai daqui pensado para quem vai viver a viagem, seja a primeira ida à Disney ou a volta ao mundo.',
  },

  clientes: {
    titulo: 'Recomendados por mais de 5.000 clientes!',
    numero: 5000,
    texto: 'Viajar é viver histórias, e ninguém entende mais disso do que quem já embarcou com a Peakalika Turismo. Com atendimento personalizado, atenção aos detalhes e suporte do início ao fim, conquistamos a confiança de milhares de viajantes pelo mundo.',
    parceiros: ['tripadvisor', 'expedia', 'booking', 'airbnb'],
    depoimentos: [
      { nome: 'Isadora Martins', cidade: 'Curitiba', foto: 'cliente-isadora', texto: 'Atendimento impecável! Todas as minhas próximas viagens serão com eles!', link: 'https://share.google/gYFsKAigdeIeKXaow' },
      { nome: 'Laodicéia Luersen', cidade: 'Curitiba', foto: 'cliente-laodiceia', texto: 'Excelente assessoria! Quero parabenizar pelo profissionalismo e todo suporte dado durante todo o processo! Super indico!' },
      { nome: 'Larissa Araújo', cidade: 'Curitiba', foto: 'cliente-larissa', texto: 'Pessoas super atenciosas, trabalho de qualidade, faz guiamento pelos parques da Disney e sempre tem promoção! Super recomendo' },
      { nome: 'Leo Witor', cidade: 'Curitiba', foto: 'cliente-leo', texto: 'Sensacional, sempre muito atenciosos e com uma capacidade de solucionar problemas que pareciam impossíveis. Recomendo demais.' },
    ],
  },

  // posts e reels do Instagram (posts do site original + vídeos verticais da Disney)
  instagram: [
    { foto: 'insta-2', alt: 'Post: Festival das Lanternas na Tailândia' },
    { video: 'r-castelo-noite', alt: 'Reel: castelo iluminado à noite' },
    { foto: 'insta-3', alt: 'Post: Universal Orlando Resort' },
    { video: 'r-parada', alt: 'Reel: carro alegórico do Mickey na parada' },
    { foto: 'insta-4', alt: 'Post: Turquia em uma viagem inesquecível' },
    { video: 'r-pai-filho', alt: 'Reel: pai e filho caminhando até o castelo' },
    { foto: 'insta-5', alt: 'Post: se eu fosse você eu faria um cruzeiro' },
    { video: 'r-walt-mickey', alt: 'Reel: estátua de Walt Disney e Mickey em frente ao castelo' },
    { foto: 'insta-6', alt: 'Post: comece a Itália por Veneza' },
  ],

  final: {
    titulo: ['E viveram felizes', 'para sempre.'],
    texto: 'O próximo capítulo começa com uma mensagem. Conta pra gente para onde você quer ir.',
  },

  // footer: bloco "Onde atendemos" ao lado do mapa ([EXEMPLO], o site original não lista cidades)
  atendemos: ['Curitiba', 'Região Metropolitana', 'Paraná', 'Todo o Brasil online'],
};
