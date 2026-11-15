// Conteúdo do modelo Silver de autosserviços (empresa fictícia Pistão Auto Center).
// [EXEMPLO] = trocar pelos dados do cliente.
module.exports = {
  marca: {
    nome: 'Pistão',
    completo: 'Pistão Auto Center',
    frase: 'Mecânica, revisão e estética automotiva com diagnóstico por scanner, orçamento aprovado antes do serviço e garantia por escrito.',
    whatsapp: '5531999990000', // [EXEMPLO]
    whatsappTexto: '(31) 99999-0000', // [EXEMPLO]
    telefone: '(31) 3333-0000', // [EXEMPLO]
    email: 'contato@pistaoauto.com.br', // [EXEMPLO]
    endereco: 'Rua Carlos Turner, 520', // [EXEMPLO]
    bairro: 'Silveira',
    cidade: 'Belo Horizonte, MG',
    instagram: 'https://www.instagram.com/',
    instagramUser: '@pistaoautocenter',
    facebook: 'https://www.facebook.com/',
    youtube: 'https://www.youtube.com/',
    desde: 2009,
  },
  horarios: [
    ['Segunda a sexta', '7h30 às 18h30'],
    ['Sábado', '8h às 14h'],
    ['Domingo e feriado', 'Fechado'],
  ],
  horarioTexto: 'Seg. a sex. 7h30 às 18h30, sáb. 8h às 14h',
  // abertura por dia da semana (0 = domingo), em minutos
  abertura: { 1: [450, 1110], 2: [450, 1110], 3: [450, 1110], 4: [450, 1110], 5: [450, 1110], 6: [480, 840] },

  // capa em slides: foto de fundo, título em duas linhas (a segunda em vermelho) e texto
  slides: [
    { foto: 'slide-garagem', alt: 'Carro esportivo prata com faróis acesos dentro de uma garagem escura', t1: 'Mecânica e', t2: 'revisão completa', texto: 'Equipe certificada, scanner multimarcas e peças com nota. Seu carro sai daqui rodando como saiu da concessionária.' },
    { foto: 'slide-estrada', alt: 'Carro preto rodando numa estrada ao entardecer', t1: 'Pronto para', t2: 'a próxima viagem', texto: 'Check-up de 40 itens antes de pegar a estrada: freio, pneus, suspensão, fluidos, luzes e bateria.' },
    { foto: 'slide-noite', alt: 'Frente de um carro preto com faróis de LED acesos à noite', t1: 'Estética que', t2: 'renova o carro', texto: 'Polimento técnico, vitrificação e higienização interna. O brilho de carro novo com proteção que dura.' },
  ],

  // faixa logo abaixo da capa: três etapas que todo carro passa
  etapas: [
    ['diagnostico', 'Diagnóstico', 'Scanner, teste de rodagem e checklist com fotos enviado no seu WhatsApp.'],
    ['reparo', 'Reparo', 'Só começamos depois que você aprova o orçamento, peça por peça.'],
    ['entrega', 'Entrega', 'Carro lavado, peça velha no porta-malas e garantia de 6 meses na nota.'],
  ],

  // números com ícone (contam ao aparecer)
  numeros: [
    ['horas', 65250, '+', 'horas de oficina'],
    ['clientes', 23160, '+', 'clientes atendidos'],
    ['equipe', 14, '', 'mecânicos certificados'],
    ['selo', 16, ' anos', 'de experiência'],
  ],

  // "Por que a Pistão": frases grandes em contorno que se preenchem ao rolar
  porque: ['Mecânicos certificados', 'Orçamento antes do serviço', 'Nota 4,9 no Google', 'Garantia de 6 meses'],

  servicos: [
    {
      id: 'mecanica', nome: 'Mecânica geral', foto: 'mecanica',
      alt: 'Mecânico trabalhando no motor de um carro com o capô aberto',
      texto: 'Motor, câmbio, embreagem, arrefecimento e correias. Diagnóstico por scanner e orçamento por foto antes de abrir qualquer peça.',
      itens: ['Correia dentada', 'Embreagem', 'Arrefecimento'],
    },
    {
      id: 'revisao', nome: 'Revisão e troca de óleo', foto: 'oleo',
      alt: 'Mecânico colocando óleo novo no motor de um carro',
      texto: 'Revisão por quilometragem seguindo o manual do fabricante, sem perder a garantia de fábrica. Óleo certo e todos os filtros.',
      itens: ['Óleo e filtros', 'Fluidos e níveis', 'Etiqueta da próxima troca'],
    },
    {
      id: 'freios', nome: 'Freios', foto: 'freio',
      alt: 'Disco de freio e pinça vermelha de um carro suspenso no elevador',
      texto: 'Medimos discos e pastilhas na sua frente e só trocamos o que precisa. Fluido DOT 4 e teste de frenagem no fim.',
      itens: ['Pastilhas e discos', 'Fluido de freio', 'ABS'],
    },
    {
      id: 'suspensao', nome: 'Suspensão', foto: 'suspensao',
      alt: 'Amortecedores com molas vermelhas lado a lado',
      texto: 'Amortecedores, molas, bandejas, pivôs e buchas. Teste de rodagem antes e depois para você sentir a diferença na lombada.',
      itens: ['Amortecedores', 'Bandejas e pivôs', 'Buchas e coxins'],
    },
    {
      id: 'pneus', nome: 'Pneus e alinhamento 3D', foto: 'pneus',
      alt: 'Mecânico montando um pneu na roda com a máquina desmontadora',
      texto: 'Pneus das principais marcas, montagem sem riscar a roda, balanceamento computadorizado e alinhamento por câmeras 3D.',
      itens: ['Alinhamento 3D', 'Balanceamento', 'Venda de pneus'],
    },
    {
      id: 'injecao', nome: 'Injeção e elétrica', foto: 'diagnostico',
      alt: 'Mãos de um mecânico ligando cabos no compartimento do motor',
      texto: 'Luz de injeção acesa, falha, consumo alto, bateria arriando. Leitura de códigos e teste de cada sensor até achar a causa.',
      itens: ['Scanner multimarcas', 'Bateria e alternador', 'Ar-condicionado'],
    },
    {
      id: 'estetica', nome: 'Estética automotiva', foto: 'estetica',
      alt: 'Homem lavando um carro esportivo preto com espuma',
      texto: 'Lavagem detalhada, polimento técnico, vitrificação de pintura e higienização de bancos e teto.',
      itens: ['Polimento', 'Vitrificação', 'Higienização interna'],
    },
  ],

  // montadoras atendidas (logos do Simple Icons, CC0, em img/marcas/)
  marcas: [
    ['volkswagen', 'Volkswagen'], ['fiat', 'Fiat'], ['chevrolet', 'Chevrolet'], ['peugeot', 'Peugeot'],
    ['renault', 'Renault'], ['honda', 'Honda'], ['hyundai', 'Hyundai'], ['toyota', 'Toyota'],
    ['ford', 'Ford'], ['nissan', 'Nissan'], ['jeep', 'Jeep'], ['citroen', 'Citroën'],
  ],

  avaliacoes: [
    ['Larissa Mendes', 'Onix 2020', 'Me mandaram foto e vídeo de cada peça antes de trocar. Paguei exatamente o que aprovei e o carro ficou perfeito.'],
    ['Ricardo Souza', 'Hilux 2018', 'Revisão de 60 mil feita no prazo, com o manual carimbado. Atendimento de concessionária com preço justo.'],
    ['Patrícia Alves', 'HB20 2021', 'A luz da injeção acendia toda semana. Acharam o sensor com defeito em uma manhã e não voltou mais.'],
    ['Fernando Lima', 'Corolla 2017', 'Fiz suspensão e alinhamento 3D. Recebi o relatório antes e depois e o carro parou de puxar na hora.'],
    ['Juliana Costa', 'Renegade 2019', 'Polimento e vitrificação deixaram o carro melhor que quando comprei. Equipe muito caprichosa.'],
  ],

  faq: [
    ['Preciso agendar ou posso chegar direto?', 'Pode chegar direto para avaliação, mas com agendamento o carro entra no elevador assim que você chega. Agende pelo formulário ou pelo WhatsApp.'],
    ['Fazer a revisão aqui tira a garantia de fábrica?', 'Não. Seguimos o plano de revisão do manual, usamos peças com a especificação da montadora e carimbamos o manual com nota fiscal. A lei garante que a revisão fora da concessionária mantém a garantia.'],
    ['Como funciona o orçamento?', 'Fazemos o diagnóstico, mandamos fotos e vídeo do problema no WhatsApp com o valor de cada peça e da mão de obra. Nada é feito sem a sua aprovação.'],
    ['Qual é a garantia dos serviços?', 'Seis meses de garantia em peças e mão de obra, escrita na nota fiscal. Se algo voltar a dar problema nesse período, o reparo é por nossa conta.'],
    ['Vocês atendem carro de qualquer marca?', 'Sim. Temos scanner multimarcas e atendemos nacionais e importados: Volkswagen, Fiat, Chevrolet, Renault, Peugeot, Honda, Hyundai, Toyota, Jeep e outras.'],
    ['Quais formas de pagamento vocês aceitam?', 'Pix, débito e crédito em até 6 vezes sem juros. Para frotas e empresas, faturamento mensal com nota.'],
  ],

  bairros: ['Silveira', 'Cidade Nova', 'Nova Floresta', 'Renascença', 'Cachoeirinha', 'União', 'Sagrada Família', 'Floresta'],

  instagram: ['insta-laranja', 'insta-bmw', 'insta-amarelo', 'insta-camaro', 'insta-fusca', 'insta-amg', 'insta-m5', 'insta-500'],
};
