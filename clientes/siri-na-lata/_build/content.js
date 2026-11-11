// Conteúdo do Siri na Lata Bar & Restaurante.
// Compartilhado pelos três modelos do nicho restaurante e lanchonete (bronze, silver e gold).
//
// Marcações:
//   [CONFIRMAR]  dado que precisa ser validado com o cliente antes de publicar.
//   Os preços do cardápio são valores de referência para o template; trocar pela tabela real do cliente.
//
// Fontes dos dados reais: perfil @sirinalatafloripa no Instagram (endereço e horário de quarta a sábado).

module.exports = {
  nome: 'Siri na Lata Bar & Restaurante',
  curto: 'Siri na Lata',
  dominio: 'https://www.sirinalata.com.br', // [CONFIRMAR] domínio
  idioma: 'pt-BR',

  seo: {
    titulo: 'Siri na Lata Bar & Restaurante | Frutos do mar e petiscos no Estreito, Florianópolis',
    descricao: 'Bar e restaurante de frutos do mar no Balneário Estreito, Florianópolis. Siri na lata, camarão, lula, ostras, lagosta, kibe, pastel, batata frita e porções para dividir. Reservas pelo WhatsApp.',
  },

  contato: {
    // [CONFIRMAR] número do WhatsApp comercial. Formato: 55 + DDD + número, só dígitos.
    whatsapp: '5548999999999',
    whatsappExibicao: '(48) 99999-9999', // [CONFIRMAR]
    telefone: '', // [CONFIRMAR] fixo, se houver
    instagram: 'https://www.instagram.com/sirinalatafloripa/',
    instagramUser: '@sirinalatafloripa',
    facebook: '', // [CONFIRMAR] se houver
    ifood: '', // [CONFIRMAR] link do iFood ou outro app de entrega, se houver
    email: '', // [CONFIRMAR]
    mensagemPadrao: 'Olá! Vim pelo site do Siri na Lata e queria',
  },

  endereco: {
    rua: 'Rua São José, 610',
    bairro: 'Balneário Estreito',
    cidade: 'Florianópolis',
    uf: 'SC',
    cep: '', // [CONFIRMAR]
    referencia: 'No continente, a poucos minutos da Ponte Hercílio Luz.', // [CONFIRMAR] ponto de referência
    mapa: 'https://www.google.com/maps/search/?api=1&query=Rua+S%C3%A3o+Jos%C3%A9%2C+610%2C+Balne%C3%A1rio+Estreito%2C+Florian%C3%B3polis+SC',
  },

  // dia: 0 domingo ... 6 sábado. abre/fecha em "HH:MM". null = fechado.
  horarios: [
    { dias: 'Segunda e terça', abre: null, fecha: null, d: [1, 2] },
    { dias: 'Quarta a sábado', abre: '11:00', fecha: '22:00', d: [3, 4, 5, 6] },
    { dias: 'Domingo', abre: '11:00', fecha: '17:00', d: [0] }, // [CONFIRMAR] horário de domingo (cortado no Instagram)
  ],

  // ---------- apresentação ----------
  hero: {
    titulo: ['Siri', 'na Lata'],
    linha: 'Petisco de mar, cerveja gelada e mesa cheia no Estreito.',
    texto: 'Frutos do mar, porções e salgados feitos na hora para dividir com quem você gosta. De quarta a domingo, na Rua São José, 610.',
    ctaPrincipal: 'Ver o cardápio',
    ctaSecundario: 'Reservar pelo WhatsApp',
  },

  // dois destaques da casa (com ilustração em traço, como na referência)
  destaques: [
    {
      id: 'siri',
      titulo: 'Siri na lata',
      texto: 'O prato que dá nome à casa. Siri desfiado, refogado no tempero manezinho, gratinado e servido na própria latinha, com torradas para raspar até o fundo.', // [CONFIRMAR] descrição do prato
    },
    {
      id: 'porcao',
      titulo: 'Porções para dividir',
      texto: 'Camarão, lula, isca de peixe, kibe, pastel e batata frita em porções generosas. Chega à mesa quente, crocante e pensada para a turma toda.',
    },
  ],

  boasVindas: {
    titulo: 'Bem-vindo ao Siri na Lata',
    texto: 'Aqui a ideia é simples: frutos do mar bem feitos, porção que chega fumegando e cerveja na temperatura certa. Cozinhamos com o que o mar da Grande Florianópolis oferece de melhor e servimos do jeito que a gente gosta de comer, sem pressa, com a mesa cheia e conversa boa.',
    assinatura: 'Equipe Siri na Lata',
  },

  sobre: {
    titulo: 'A casa',
    subtitulo: 'Um boteco de frutos do mar com alma de Floripa',
    paragrafos: [
      'O Siri na Lata nasceu da vontade de juntar duas paixões da Ilha: frutos do mar fresquinhos e aquele bar de esquina onde todo mundo se sente em casa. Fica no Balneário Estreito, no continente, com mesas para o almoço de quarta a domingo e para o fim de tarde que vira noite.',
      'A cozinha trabalha com siri, camarão, lula, peixe e ostras da região, preparados na hora. Para quem não come frutos do mar, tem kibe, pastel, batata frita, arroz e salada no mesmo capricho.',
      'Nas paredes, quadros que contam um pouco da cultura local. Em alguns dias, música ao vivo para acompanhar o petisco.', // [CONFIRMAR] dias e estilo da música ao vivo
    ],
    // participação no Comida di Buteco (citada em matéria sobre a edição de Florianópolis)
    selo: {
      titulo: 'Comida di Buteco 2026',
      texto: 'Participamos do concurso com o torpedo de siri, servido com molho rosé de alho-poró e brócolis tostado na manteiga.', // [CONFIRMAR] nome e descrição do petisco
    },
  },

  // ---------- cardápio ----------
  // destaque: aparece na grade de fotos. foto: arquivo em _build/img/
  cardapioFotos: [
    { nome: 'Casquinha de siri', foto: 'casquinha-siri', alt: 'Siri desfiado gratinado servido na casquinha de barro com alface e limão' },
    { nome: 'Camarão à milanesa', foto: 'camarao-milanesa', alt: 'Camarão empanado com molho rosé e limão' },
    { nome: 'Isca de peixe', foto: 'isca-peixe', alt: 'Prato de iscas de peixe fritas e douradas com molho' },
    { nome: 'Peixe frito com pirão', foto: 'peixe-pirao', alt: 'Peixe frito com panela de barro de pirão, arroz e salada na mesa da praia' },
    { nome: 'Camarão completo', foto: 'camarao-completo', alt: 'Camarão frito com batata, arroz, pirão e salada servidos na mesa' },
    { nome: 'Camarão com fritas', foto: 'camarao-fritas', alt: 'Camarões empanados com batata frita e molho' },
  ],

  cardapio: [
    {
      id: 'mar',
      titulo: 'Petiscos do mar',
      nota: 'Porções para 2 a 3 pessoas',
      itens: [
        { nome: 'Siri na lata', desc: 'Siri desfiado gratinado na latinha, com torradas', preco: 49 },
        { nome: 'Casquinha de siri', desc: 'Duas unidades gratinadas com farofa da casa', preco: 36 },
        { nome: 'Bolinho de siri', desc: 'Oito unidades com molho rosé', preco: 44 },
        { nome: 'Camarão à milanesa', desc: 'Empanado na hora, com molho tártaro', preco: 79 },
        { nome: 'Camarão alho e óleo', desc: 'Salteado com alho dourado e salsinha', preco: 82 },
        { nome: 'Lula à dorê', desc: 'Anéis de lula crocantes com limão', preco: 68 },
        { nome: 'Isca de peixe', desc: 'Peixe do dia empanado, com molho tártaro', preco: 62, meia: 38 },
        { nome: 'Ostras in natura', desc: 'Dúzia de ostras da região, com limão', preco: 52 },
        { nome: 'Ostras gratinadas', desc: 'Dúzia gratinada com queijo e ervas', preco: 68 },
      ],
    },
    {
      id: 'pratos',
      titulo: 'Para dividir na mesa',
      nota: 'Acompanham arroz, pirão e salada',
      itens: [
        { nome: 'Sequência de frutos do mar', desc: 'Camarão, lula, isca de peixe, siri e ostras em rodadas', preco: 219, obs: 'serve 2' },
        { nome: 'Lagosta grelhada', desc: 'Na manteiga de ervas, com arroz e salada', preco: 249, obs: 'serve 2' },
        { nome: 'Moqueca de camarão', desc: 'No leite de coco e dendê, com arroz e pirão', preco: 159, obs: 'serve 2' },
        { nome: 'Caldo de frutos do mar', desc: 'Cremoso, com camarão e siri', preco: 39 },
      ],
    },
    {
      id: 'salgados',
      titulo: 'Salgados e porções da casa',
      nota: 'Para quem não abre mão de um boteco',
      itens: [
        { nome: 'Kibe frito', desc: 'Dez unidades com limão', preco: 34 },
        { nome: 'Kibe com catupiry', desc: 'Oito unidades recheadas', preco: 38 },
        { nome: 'Pastel', desc: 'Seis unidades: siri, camarão, carne ou queijo', preco: 42 },
        { nome: 'Coxinha de camarão', desc: 'Oito unidades', preco: 39 },
        { nome: 'Batata frita', desc: 'Porção grande e sequinha', preco: 32 },
        { nome: 'Batata com cheddar e bacon', desc: 'Porção grande gratinada', preco: 42 },
        { nome: 'Aipim frito', desc: 'Com manteiga de garrafa', preco: 30 },
      ],
    },
    {
      id: 'acomp',
      titulo: 'Acompanhamentos',
      nota: 'Para completar o pedido',
      itens: [
        { nome: 'Arroz branco', desc: 'Porção', preco: 14 },
        { nome: 'Arroz de frutos do mar', desc: 'Porção', preco: 36 },
        { nome: 'Pirão de peixe', desc: 'Porção', preco: 18 },
        { nome: 'Salada da casa', desc: 'Folhas, tomate, cebola roxa e palmito', preco: 24 },
        { nome: 'Farofa da casa', desc: 'Porção', preco: 12 },
      ],
    },
  ],
  bebidas: 'Cervejas long neck e de garrafa, chope, caipirinhas, drinks, sucos e refrigerantes. Pergunte ao garçom pelas cervejas da semana.',
  avisoPrecos: 'Preços em reais, sujeitos a alteração sem aviso. Itens conforme disponibilidade do dia.',

  // ---------- planos, valores e condições ----------
  // Para restaurante, "planos" são os formatos de atendimento: mesa, aniversário e evento fechado.
  planos: {
    titulo: 'Reservas e eventos',
    texto: 'Do almoço em família à confraternização da firma, a gente separa a mesa e prepara tudo para você só chegar.',
    opcoes: [
      {
        nome: 'Mesa reservada',
        para: 'Até 10 pessoas',
        valor: 'Sem custo',
        condicoes: [
          'Reserva pelo WhatsApp com pelo menos 1 dia de antecedência',
          'A mesa fica guardada por 15 minutos após o horário marcado',
          'Sexta e sábado à noite as reservas acabam rápido',
        ],
      },
      {
        nome: 'Aniversário',
        para: 'De 10 a 30 pessoas',
        valor: 'Sem custo de reserva',
        destaque: true,
        condicoes: [
          'Área reservada para o grupo',
          'Pode trazer o bolo, sem taxa de rolha para o bolo',
          'Aniversariante ganha uma porção de bolinho de siri',
          'Confirmar o número de pessoas até 2 dias antes',
        ],
      },
      {
        nome: 'Evento fechado',
        para: 'A partir de 30 pessoas',
        valor: 'Sob consulta',
        condicoes: [
          'Casa ou área exclusiva em dia e horário combinados',
          'Cardápio fechado por pessoa ou rodízio de petiscos',
          'Sinal de 30% para confirmar a data',
          'Ideal para confraternização de empresa e formatura',
        ],
      },
    ],
    // [CONFIRMAR] todas as condições acima com o cliente
    pagamento: ['Pix', 'Cartão de crédito', 'Cartão de débito', 'Vale-refeição', 'Dinheiro'], // [CONFIRMAR] bandeiras e VR aceitos
    taxaServico: 'Taxa de serviço de 10% opcional.', // [CONFIRMAR]
  },

  // ---------- perguntas frequentes ----------
  faq: [
    {
      p: 'Preciso reservar mesa?',
      r: 'Não é obrigatório, mas recomendamos para sexta, sábado e domingo e para grupos acima de 6 pessoas. A reserva é gratuita e feita pelo WhatsApp.',
    },
    {
      p: 'Qual o horário de funcionamento?',
      r: 'De quarta a sábado, das 11h às 22h. Aos domingos, das 11h às 17h. Segunda e terça a casa fica fechada.', // [CONFIRMAR] domingo
    },
    {
      p: 'Tem opção para quem não come frutos do mar?',
      r: 'Tem sim. Kibe, pastel de carne e de queijo, coxinha, batata frita, aipim, arroz e salada. Dá para montar uma mesa inteira sem frutos do mar.',
    },
    {
      p: 'As porções servem quantas pessoas?',
      r: 'Os petiscos do mar servem bem de 2 a 3 pessoas. Os pratos para dividir servem 2 pessoas e vêm com arroz, pirão e salada. A isca de peixe também tem meia porção.',
    },
    {
      p: 'Vocês fazem entrega ou retirada?',
      r: 'Fazemos retirada no balcão: é só pedir pelo WhatsApp e passar para buscar. Para entrega, consulte a disponibilidade na hora do pedido.', // [CONFIRMAR] delivery e apps
    },
    {
      p: 'Quais formas de pagamento vocês aceitam?',
      r: 'Pix, cartões de crédito e débito, vale-refeição e dinheiro.', // [CONFIRMAR]
    },
    {
      p: 'Posso comemorar meu aniversário aí?',
      r: 'Pode e deve. Para grupos de 10 a 30 pessoas separamos uma área, você pode trazer o bolo e o aniversariante ganha uma porção de bolinho de siri. Combine pelo WhatsApp com 2 dias de antecedência.',
    },
    {
      p: 'Tem música ao vivo?',
      r: 'Em alguns dias da semana, sim. A programação sai sempre no nosso Instagram.', // [CONFIRMAR] dias
    },
  ],
};
