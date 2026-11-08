// =============================================================
// CONTEÚDO DOS SITES VYRA — edite aqui e rode:  node sites/_build/build.js
// Itens marcados com [EXEMPLO] são provisórios: troque pelos dados reais.
// =============================================================
module.exports = {
  brand: {
    name: 'Vyra',
    slogan: 'Velocidade de capital, onde você está.',
    support: 'Fibra de verdade. Gente de perto.',
    description: 'Vyra é um provedor de internet 100% fibra óptica para casas e empresas do interior, com suporte técnico local.',
  },

  contact: {
    whatsapp: '(44) 90000-0000',                    // [EXEMPLO]
    whatsappLink: 'https://wa.me/5544900000000',    // [EXEMPLO]
    phone: '(44) 3000-0000',                        // [EXEMPLO]
    email: 'contato@vyrafibra.com.br',              // [EXEMPLO]
    address: 'Rua Exemplo, 000 · Centro',           // [EXEMPLO]
    city: 'Marialva · PR',
    hours: [
      ['Atendimento', 'Seg a sex, 8h às 18h · Sáb, 8h às 12h'], // [EXEMPLO]
      ['Suporte técnico', '24 horas, todos os dias'],           // [EXEMPLO]
    ],
    social: {
      instagram: 'https://instagram.com/vyrafibra',               // [EXEMPLO]
      facebook: 'https://facebook.com/vyrafibra',                 // [EXEMPLO]
      linkedin: 'https://linkedin.com/company/vyrafibra',         // [EXEMPLO]
      whatsapp: 'https://wa.me/5544900000000',                    // [EXEMPLO]
    },
  },

  nav: [
    { href: 'index.html', label: 'Início', id: 'index' },
    { href: 'sobre.html', label: 'Sobre nós', id: 'sobre' },
    { href: 'servicos.html', label: 'Serviços', id: 'servicos' },
    { href: 'faq.html', label: 'FAQ', id: 'faq' },
    { href: 'contato.html', label: 'Contato', id: 'contato' },
  ],
  cta: { href: 'assine.html', label: 'Assine já', id: 'assine' },

  // Preços são [EXEMPLO]
  plans: [
    {
      id: 'essencial', name: 'Essencial', speed: '300', unit: 'Mega', price: '99,90',
      tagline: 'Para navegar, estudar e assistir em até 3 telas.',
      features: ['300 Mega de download', 'Wi-Fi 5 incluso', 'Instalação agendada', 'Suporte técnico local'],
    },
    {
      id: 'conecta', name: 'Conecta', speed: '600', unit: 'Mega', price: '129,90', featured: true,
      tagline: 'Home office, streaming e aula online ao mesmo tempo.',
      features: ['600 Mega de download', 'Wi-Fi 6 incluso', 'Instalação em até 48h', 'Atendimento prioritário'],
    },
    {
      id: 'ultra', name: 'Ultra', speed: '1', unit: 'Giga', price: '179,90',
      tagline: 'Para casas cheias de telas e quem não aceita espera.',
      features: ['1 Giga de download', 'Wi-Fi 6 mesh (2 pontos)', 'Instalação em até 24h', 'IP fixo opcional'],
    },
  ],

  benefits: [
    { icon: 'fiber', title: '100% fibra óptica', text: 'Do poste até o seu roteador, sem trecho de cabo metálico. Menos interferência e mais estabilidade.' },
    { icon: 'headset', title: 'Suporte de quem está perto', text: 'Técnicos da sua região, que atendem pelo nome e vão até você quando precisa.' },
    { icon: 'calendar', title: 'Instalação agendada', text: 'Você escolhe o dia e o período. O técnico chega no horário combinado.' },
    { icon: 'shield', title: 'Sem letra miúda', text: 'A velocidade contratada é a entregue. Sem taxa escondida e sem pegadinha.' },
  ],

  steps: [
    { title: 'Consulte a cobertura', text: 'Informe seu CEP e veja se a fibra Vyra já chega na sua rua.' },
    { title: 'Escolha e agende', text: 'Escolha o plano e o melhor dia para a instalação.' },
    { title: 'Conecte-se', text: 'O técnico instala, testa a velocidade com você e deixa o Wi-Fi configurado.' },
  ],

  stats: [
    { value: '100', suffix: '%', label: 'fibra óptica' },
    { value: '24', suffix: 'h', label: 'de suporte técnico' },
    { value: '1', suffix: ' Giga', label: 'de velocidade máxima' },
    { value: '0', suffix: '', label: 'letras miúdas no contrato' },
  ],

  services: [
    { id: 'residencial', icon: 'home', title: 'Internet residencial', text: 'Planos de 300 Mega a 1 Giga para a sua casa, com Wi-Fi incluso e instalação agendada.', items: ['Wi-Fi 5 ou Wi-Fi 6', 'Sem fidelidade abusiva', 'Upgrade a qualquer momento'] },
    { id: 'empresas', icon: 'building', title: 'Vyra Empresas', text: 'Conexão para comércio, clínica, indústria e agro. Sua operação não para.', items: ['Link dedicado simétrico', 'IP fixo', 'SLA com tempo de reparo garantido', 'Gerente de conta'] },
    { id: 'rural', icon: 'tree', title: 'Chácaras e sítios', text: 'Levamos fibra para áreas afastadas do centro, onde as grandes operadoras não chegam.', items: ['Projeto de viabilidade', 'Instalação em área rural', 'Mesma velocidade da cidade'] },
    { id: 'wifi', icon: 'wifi', title: 'Wi-Fi mesh', text: 'Sinal forte em todos os cômodos, inclusive no quintal e no escritório dos fundos.', items: ['Roteadores mesh Wi-Fi 6', 'Configuração pelo técnico', 'Troca de senha pelo app'] },
    { id: 'suporte', icon: 'headset', title: 'Suporte técnico local', text: 'Atendimento por gente da região, por WhatsApp, telefone ou visita técnica.', items: ['Suporte 24 horas', 'Visita técnica no mesmo dia*', 'Acompanhamento do chamado'] },
  ],

  business: [
    { title: 'Link dedicado', text: 'Banda exclusiva e simétrica: a mesma velocidade de download e upload.' },
    { title: 'IP fixo', text: 'Para câmeras, servidores, VPN e sistemas que precisam de endereço fixo.' },
    { title: 'SLA garantido', text: 'Tempo máximo de reparo em contrato. Se cair, a prioridade é sua.' },
    { title: 'Gerente de conta', text: 'Um contato técnico direto, que conhece a sua operação.' },
  ],

  // [EXEMPLO] — substitua por depoimentos reais com autorização dos clientes
  testimonials: [
    { text: 'Trabalho em home office e nunca mais caí no meio de uma reunião. E quando precisei de suporte, o técnico veio no mesmo dia.', who: 'Cliente residencial', where: 'Marialva' },
    { text: 'A maquininha e o sistema da loja dependem da internet. Com o link da Vyra, a gente parou de perder venda.', who: 'Cliente empresarial', where: 'Marialva' },
    { text: 'Moramos numa chácara e nenhuma operadora atendia. A Vyra fez o projeto e hoje temos fibra em casa.', who: 'Cliente rural', where: 'Região de Marialva' },
  ],

  about: {
    intro: 'A Vyra nasceu em Marialva com uma ideia simples: quem mora ou trabalha no interior merece a mesma internet de quem está na capital.',
    story: [
      'Por muito tempo, o interior ficou com o que sobrava: internet instável, operadoras que não chegam e atendimento por robô. A gente cresceu vendo isso de perto.',
      'Por isso construímos uma rede 100% fibra óptica, planejada por técnicos que conhecem cada bairro, e um atendimento feito por gente da região.',
      'Hoje atendemos casas e empresas em Marialva e seguimos crescendo por cidades do interior que precisam de uma conexão de verdade.',
    ],
    purpose: 'Levar internet de verdade para onde as grandes operadoras não chegam.',
    values: [
      { title: 'Estabilidade', text: 'A conexão não cai. Se cair, resolvemos rápido.' },
      { title: 'Proximidade', text: 'Gente atendendo, não robô.' },
      { title: 'Precisão técnica', text: 'Rede bem projetada, sem promessa vazia.' },
      { title: 'Transparência', text: 'A velocidade contratada é a entregue.' },
      { title: 'Alcance', text: 'Ninguém fica de fora por morar longe.' },
    ],
  },

  cities: {
    now: ['Marialva'],
    soon: ['Mandaguari', 'Sarandi', 'Paiçandu', 'Mirador', 'Floresta'], // [EXEMPLO]
  },

  // ------------------------------------------------------------------
  // MODELO BÁSICO (versão com fotos e pacotes de streaming)
  // Streamings: dependem de parceria comercial com cada serviço. [EXEMPLO]
  // ------------------------------------------------------------------
  basicNav: [
    { href: 'index.html', label: 'Início', id: 'index' },
    { href: 'sobre.html', label: 'Sobre nós', id: 'sobre' },
    { href: 'residencial.html', label: 'Residencial', id: 'residencial' },
    { href: 'empresas.html', label: 'Empresas', id: 'empresas' },
    { href: 'faq.html', label: 'FAQ', id: 'faq' },
    { href: 'contato.html', label: 'Contato', id: 'contato' },
  ],

  slides: [
    { img: 'familia_celulares.jpg', alt: 'Família no sofá usando celulares e tablet', tag: 'Plano Família', title: 'A casa toda conectada, <em>sem disputa pelo Wi-Fi.</em>', text: '800 Mega de fibra + YouTube Premium + 1 streaming à sua escolha.', price: '129,90', cta: 'assine.html#familia' },
    { img: 'amigas_mesa.jpg', alt: 'Amigas rindo enquanto olham o celular juntas', tag: 'Incluso em todos os planos', title: 'YouTube Premium <em>de presente.</em>', text: 'Vídeos sem anúncio e música offline em qualquer plano Vyra.', price: '99,90', cta: 'residencial.html' },
    { img: 'mulher_celular_sofa.jpg', alt: 'Mulher sorrindo com o celular no sofá de casa', tag: 'Combo completo', title: '1 Giga com Netflix, Max e <em>Prime Video.</em>', text: 'Todos os streamings na conta da internet, com Wi-Fi mesh na casa inteira.', price: '179,90', cta: 'assine.html#ultra' },
  ],

  streamings: ['YouTube Premium', 'Netflix', 'Max', 'Prime Video'],

  combos: [ // planos residenciais [EXEMPLO]
    { id: 'start', name: 'Vyra Start', speed: '500', unit: 'Mega', price: '99,90', tag: 'Para começar',
      streams: ['YouTube Premium'],
      features: ['Wi-Fi 6 incluso', 'Instalação grátis', 'Suporte técnico local', 'Sem franquia de dados'] },
    { id: 'familia', name: 'Vyra Família', speed: '800', unit: 'Mega', price: '129,90', tag: 'Mais popular', featured: true,
      streams: ['YouTube Premium', 'Max ou Prime Video'],
      features: ['Wi-Fi 6 + 1 ponto mesh', 'Instalação em até 48h', 'Atendimento prioritário', 'Controle dos pais no app'] },
    { id: 'ultra', name: 'Vyra Ultra', speed: '1', unit: 'Giga', price: '179,90', tag: 'Combo completo',
      streams: ['YouTube Premium', 'Netflix', 'Max', 'Prime Video'],
      features: ['Wi-Fi 6 mesh (2 pontos)', 'Técnico em até 24h', 'IP fixo opcional', 'Ideal para games e 4K'] },
  ],

  addons: [ // adicionais [EXEMPLO]
    { name: 'Netflix Padrão', price: '+ R$ 44,90' },
    { name: 'Max', price: '+ R$ 29,90' },
    { name: 'Prime Video', price: '+ R$ 19,90' },
    { name: 'Ponto extra de Wi-Fi mesh', price: '+ R$ 19,90' },
  ],

  businessPlans: [ // planos empresariais [EXEMPLO]
    { id: 'empresa400', name: 'Empresa 400', speed: '400', unit: 'Mega', price: '199,90', tag: 'Comércio e escritório',
      features: ['IP fixo incluso', 'Wi-Fi corporativo', 'Suporte prioritário', 'Nota fiscal mensal'] },
    { id: 'empresa800', name: 'Empresa 800', speed: '800', unit: 'Mega', price: '299,90', tag: 'Mais contratado', featured: true,
      features: ['IP fixo incluso', 'SLA de reparo em 8h', 'Gerente de conta', 'Link de backup opcional'] },
    { id: 'dedicado', name: 'Link Dedicado', speed: 'até 10', unit: 'Giga', price: null, tag: 'Operação crítica',
      features: ['Banda simétrica garantida', 'SLA de reparo em 4h', 'Monitoramento 24h', 'Projeto sob medida'] },
  ],

  faq: [
    { q: 'Como sei se a Vyra atende o meu endereço?', a: 'Informe seu CEP na página Assine já ou fale com a gente pelo WhatsApp. Respondemos na hora se a fibra já chega na sua rua.' },
    { q: 'Quanto tempo leva a instalação?', a: 'Depende do plano e da região. Em geral, a instalação acontece entre 24 e 72 horas após a contratação, no dia e período que você escolher.' },
    { q: 'A instalação é cobrada?', a: 'Nos planos residenciais a instalação padrão é gratuita. Instalações em área rural passam por um projeto de viabilidade antes.' },
    { q: 'Tem fidelidade?', a: 'Oferecemos planos com e sem fidelidade. Tudo fica claro no contrato, sem letra miúda.' },
    { q: 'O Wi-Fi está incluso?', a: 'Sim. Todos os planos incluem roteador Wi-Fi em comodato. No plano Ultra, você recebe um kit mesh com dois pontos.' },
    { q: 'A velocidade é garantida?', a: 'Sim. Na fibra óptica, a velocidade chega ao seu roteador. Pelo Wi-Fi, ela pode variar conforme a distância e o aparelho. O técnico mede com você na instalação.' },
    { q: 'Como funciona o suporte técnico?', a: 'Você fala com técnicos da região por WhatsApp ou telefone, 24 horas. Se for preciso, agendamos uma visita, muitas vezes no mesmo dia.' },
    { q: 'Vocês atendem empresas?', a: 'Sim. A Vyra Empresas oferece link dedicado, IP fixo e SLA com tempo de reparo garantido em contrato.' },
    { q: 'Posso mudar de plano depois?', a: 'Pode. O upgrade é feito sem custo adicional e, na maioria dos casos, sem precisar de visita técnica.' },
  ],
};
