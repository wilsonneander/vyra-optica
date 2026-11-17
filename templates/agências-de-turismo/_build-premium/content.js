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

  faixa: ['Passagens', 'Hotéis', 'Walt Disney World', 'Universal', 'Cruzeiros', 'Vistos', 'Xcaret', 'Seguro viagem', 'Transfers'],

  destinos: {
    titulo: 'Destinos internacionais',
    texto: 'Viva experiências únicas, conheça culturas fascinantes e crie memórias que vão durar para sempre. Na Peakalika Turismo, selecionamos os melhores destinos internacionais para transformar o seu sonho de viajar em realidade, com pacotes planejados para oferecer conforto e segurança.',
    lista: [
      { foto: 'paris', ponto: 'Eiffel', cidade: 'Paris', pais: 'França', preco: 'A partir de R$460,86', link: 'https://www.civitatis.com/pt/paris/sessao-fotografica-privada-torre-eiffel/?ag_aid=80927' },
      { foto: 'roma', ponto: 'Coliseu', cidade: 'Roma', pais: 'Itália', preco: 'A partir de R$467,64', link: 'https://www.civitatis.com/pt/roma/visita-guiada-coliseu/?ag_aid=80927' },
      { foto: 'madrid', ponto: 'Madrid', cidade: 'Madrid', pais: 'Espanha', preco: 'Free tour', link: 'https://www.civitatis.com/pt/madrid/visita-guiada-madrid/?ag_aid=80927' },
      { foto: 'lisboa', ponto: 'Lisboa', cidade: 'Lisboa', pais: 'Portugal', preco: 'Free tour', link: 'https://www.civitatis.com/pt/lisboa/free-tour-lisboa/?ag_aid=80927' },
      { foto: 'londres', ponto: 'Londres', cidade: 'Londres', pais: 'Inglaterra', preco: 'Free tour', link: 'https://www.civitatis.com/pt/londres/free-tour-londres/?ag_aid=80927' },
      { foto: 'dubai', ponto: 'Dubai', cidade: 'Dubai', pais: 'Emirados', preco: 'A partir de R$400,53', link: 'https://www.civitatis.com/pt/dubai/tour-completo-dubai/?ag_aid=80927' },
      { foto: 'toquio', ponto: 'Tóquio', cidade: 'Tóquio', pais: 'Japão', preco: 'A partir de R$744,11', link: 'https://www.civitatis.com/pt/toquio/tour-completo-toquio/?ag_aid=80927' },
      { foto: 'veneza', ponto: 'Veneza', cidade: 'Veneza', pais: 'Itália', preco: 'A partir de R$243,98', link: 'https://www.civitatis.com/pt/veneza/passeio-gondola-ponte-suspiros/?ag_aid=80927' },
    ],
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
    // carrossel 3D de vídeos
    cenas: [
      { id: 'castelo-dia', nome: 'Magic Kingdom', fala: 'O castelo que abre todos os sonhos' },
      { id: 'balao-mickey', nome: 'Desfile do Mickey', fala: 'Acene de volta, ele está te vendo' },
      { id: 'branca-de-neve', nome: 'Branca de Neve e os anões', fala: 'Eu vou, eu vou, pra Disney agora eu vou' },
      { id: 'toy-story', nome: 'Toy Story Land', fala: 'Ao infinito e além' },
      { id: 'parada', nome: 'Parada dos personagens', fala: 'Todo mundo dança na Main Street' },
      { id: 'main-street', nome: 'Main Street, U.S.A.', fala: 'A rua onde a magia começa' },
      { id: 'castelo-entardecer', nome: 'Castelo ao entardecer', fala: 'Quando as luzes acendem' },
    ],
  },

  espetaculo: {
    titulo: 'Quando o céu acende, você já está no lugar certo.',
    texto: 'A gente monta o roteiro pensando nos momentos que ficam: o primeiro encontro com o Mickey, a foto em frente ao castelo, os fogos no fim do dia.',
  },

  servicos: {
    titulo: 'Nossos serviços',
    texto: 'Na Peakalika Turismo, não vendemos apenas passagens, criamos experiências completas para que cada detalhe da sua viagem seja inesquecível. Por isso, oferecemos uma linha completa de serviços para facilitar sua jornada.',
    lista: [
      { foto: 'disney', nome: 'Disney', d: 'Viva a magia da Disney com pacotes e ingressos exclusivos.' },
      { foto: 'hospedagem', nome: 'Hospedagem', d: 'Encontre os melhores hotéis e pousadas para sua viagem dos sonhos.' },
      { foto: 'passagens', nome: 'Passagens', d: 'Passagens aéreas com os melhores preços e condições de pagamento.' },
      { foto: 'pacotes', nome: 'Pacotes', d: 'Pacotes completos com hospedagem, passagens e passeios inclusos.' },
      { foto: 'passeios', nome: 'Passeios', d: 'Descubra os pontos turísticos mais incríveis com nossos guias especializados.' },
      { foto: 'universal', nome: 'Universal', d: 'Ingressos e pacotes para os parques da Universal Studios.' },
      { foto: 'cruzeiros', nome: 'Cruzeiros', d: 'Explore o mundo em alto mar com os melhores cruzeiros.' },
      { foto: 'xcaret', nome: 'Xcaret', d: 'Experiências únicas nos parques Xcaret no México.' },
      { foto: 'transfers', nome: 'Transfers', d: 'Transporte seguro e confortável do aeroporto até seu destino.' },
      { foto: 'carros', nome: 'Aluguel de carros', d: 'Liberdade para explorar seu destino com carros de todas as categorias.' },
      { foto: 'seguros', nome: 'Seguros', d: 'Viaje com tranquilidade com nossos seguros de viagem completos.' },
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
