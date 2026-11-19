// Conteúdo comum aos três modelos da AURA Fresh.
// Fonte: site atual (useaurafresh.com), cartão CNPJ público e rótulo do pote.
// Tudo marcado com "a confirmar" ou "[preencher]" depende do cliente; tudo com revisar: true passa pela revisão jurídica.

const empresa = {
  marca: 'AURA Fresh',
  razao: 'AURA FRESH SOLUÇÕES EM BEM-ESTAR LTDA',
  cnpj: '65.144.553/0001-63',
  endereco: 'Rua Fortunato José Deltreggia, 791, Quadra 05, Lote 40',
  bairro: 'Park Comercial de Indaiatuba',
  cidade: 'Indaiatuba, SP',
  cep: '13347-441',
  enderecoLinha: 'Rua Fortunato José Deltreggia, 791, Park Comercial de Indaiatuba, Indaiatuba, SP, 13347-441',
  email: 'suporte@aurafresh.com.br',
  telefone: '(62) 3223-7010', // do cartão CNPJ: a confirmar com o cliente
  telefoneLink: '+556232237010',
  whatsapp: '5562000000000', // [preencher] número do WhatsApp Business
  whatsappTexto: '(62) [preencher]',
  horario: 'Segunda a sexta, das 9h às 18h',
  instagram: 'https://www.instagram.com/aurafreshbrasil/', // perfil visto no site atual: a confirmar
  facebook: 'https://www.facebook.com/aurafreshbrasil', // a confirmar
  linkedin: 'https://www.linkedin.com/company/aurafresh', // a confirmar
  anvisa: 'Suplemento alimentar. Informação de registro ou notificação na Anvisa: [preencher após a revisão jurídica].',
  site: 'https://useaurafresh.com',
};

const produto = {
  nome: 'AURA Fresh',
  linha: 'Inner Freshness Complex',
  sub: 'Daily Blend',
  tipo: 'Pó para o preparo de bebida',
  sabor: 'Abacaxi com hortelã',
  aroma: 'Aromatizado artificialmente',
  peso: '90 g',
  porcoes: 30,
  porcao: '3 g (1 dose medidora)',
  uso: 'Adicione 1 dose medidora a 240 ml ou mais de água fria ou suco e misture bem. Uma vez ao dia, no horário que for mais fácil de lembrar.',
  composicao: [
    { nome: 'Clorofilina cúprica', origem: 'clorofila', qtd: '100 mg' },
    { nome: 'Salsa (Petroselinum crispum)', origem: 'salsa', qtd: '200 mg' },
    { nome: 'Hortelã (Mentha piperita L.)', origem: 'hortelã', qtd: '50 mg' },
  ],
  ingredientes: 'Lista completa de ingredientes conforme o rótulo aprovado: [preencher].',
  advertencias: [
    'Este produto não é um medicamento. Não exceder a recomendação diária de consumo indicada na embalagem.',
    'Gestantes, lactantes, crianças, menores de 18 anos e pessoas com condição de saúde ou em uso de medicamentos devem consultar um profissional de saúde antes de usar.',
    'A clorofila pode deixar as fezes esverdeadas. É um efeito esperado do pigmento.',
    'Manter fora do alcance de crianças. Conservar em local seco e fresco, com a tampa bem fechada.',
  ],
  contraindicacoes: 'Não indicado para gestantes, lactantes e menores de 18 anos sem orientação profissional. Pessoas com alergia a qualquer componente da fórmula não devem consumir. Texto final a validar na revisão jurídica.',
};

// ofertas do checkout atual (B4You); links de compra são os do cliente
const kits = [
  { id: 'kit1', potes: 1, titulo: 'Kit 1 pote', dias: 30, total: 179.9, porPote: 179.9, parcelas: 12, parcela: 18.61, selo: null, url: 'https://seguro.useaurafresh.com/1bWwFr7I9V' },
  { id: 'kit2', potes: 2, titulo: 'Kit 2 potes', dias: 60, total: 295.8, porPote: 147.9, parcelas: 12, parcela: 30.59, selo: 'Mais escolhido', url: 'https://seguro.useaurafresh.com/5albgUtN5B' },
  { id: 'kit3', potes: 3, titulo: 'Kit 3 potes', dias: 90, total: 359.7, porPote: 119.9, parcelas: 12, parcela: 37.2, selo: 'Melhor custo por dose', url: 'https://seguro.useaurafresh.com/ZcXwHFB7Od' },
];
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
kits.forEach(k => { k.doses = k.potes * 30; k.porDia = brl(k.total / k.doses); k.totalTxt = brl(k.total); k.porPoteTxt = brl(k.porPote); k.parcelaTxt = brl(k.parcela); });

// ativos (modal de ingredientes). "revisar" marca frase de benefício que precisa da revisão jurídica
const ativos = [
  {
    id: 'clorofila', nome: 'Clorofila', tecnico: 'Clorofilina cúprica', qtd: '100 mg', cor: '#2f6b3a', img: 'clorofila.webp',
    frase: 'O verde que dá nome à fórmula.',
    texto: 'Forma da clorofila que se dissolve em água. É o pigmento verde das plantas, usado há décadas em fórmulas de frescor. É a base do AURA Fresh e chega como matéria-prima importada.',
    notas: ['Solúvel em água', 'Matéria-prima importada', 'Dá a cor verde à bebida'],
    revisar: 'Contribui para a sensação de frescor de dentro para fora.',
  },
  {
    id: 'salsa', nome: 'Salsa', tecnico: 'Petroselinum crispum', qtd: '200 mg', cor: '#5f8f2f', img: 'salsa.webp',
    frase: 'A erva da cozinha, em dose diária.',
    texto: 'A mesma salsa que vai na comida, aqui em extrato e na maior quantidade da fórmula. Rica em compostos naturais da planta e tradicionalmente ligada à sensação de hálito limpo.',
    notas: ['Maior dose da fórmula', 'Extrato da folha', 'Uso tradicional na culinária'],
    revisar: 'Apoia o equilíbrio natural do organismo.',
  },
  {
    id: 'hortela', nome: 'Hortelã', tecnico: 'Mentha piperita L.', qtd: '50 mg', cor: '#3f9d6a', img: 'hortela.webp',
    frase: 'O frescor que você sente no primeiro gole.',
    texto: 'Hortelã-pimenta, a planta do mentol. Deixa a bebida refrescante e acompanha o sabor de abacaxi. Muita gente conhece pelo chá depois do almoço.',
    notas: ['Refresca o sabor', 'Combina com o abacaxi', 'Clássica depois das refeições'],
    revisar: 'Auxilia a digestão e traz uma sensação agradável de frescor.',
  },
];

// FAQ comum
const faq = [
  { q: 'O AURA Fresh é um medicamento?', a: 'Não. É um suplemento alimentar em pó para o preparo de bebida, de uso diário. Não se destina a diagnosticar, tratar, curar ou prevenir doenças.' },
  { q: 'Como eu tomo?', a: 'Uma dose medidora por dia, em 240 ml ou mais de água fria ou suco. Misture bem e beba. O pote tem 30 doses, uma para cada dia do mês.' },
  { q: 'Em quanto tempo eu percebo alguma diferença?', a: 'Cada organismo responde no seu tempo e não existe resultado garantido. O que mais aparece nos relatos de clientes é a sensação de hálito mais fresco nas primeiras semanas de uso contínuo. Fale com um profissional de saúde se o odor for persistente.', revisar: true },
  { q: 'Tem contraindicação?', a: 'Gestantes, lactantes, menores de 18 anos e pessoas com condição de saúde ou em uso de medicamentos devem conversar com um profissional de saúde antes. Quem tem alergia a algum componente não deve consumir.' },
  { q: 'É normal as fezes ficarem verdes?', a: 'Sim. A clorofila é um pigmento verde e pode mudar a cor das fezes. É esperado e passa quando você para de tomar.' },
  { q: 'O produto segue as regras da Anvisa?', a: 'O AURA Fresh é fabricado seguindo as normas da Anvisa para suplementos alimentares. Os dados de registro ou notificação e o laudo do lote podem ser pedidos pelo e-mail suporte@aurafresh.com.br.' },
  { q: 'Qual o prazo de entrega e quanto custa o frete?', a: 'O frete é grátis para todo o Brasil. O prazo aparece no checkout depois do CEP e o código de rastreio chega por e-mail e WhatsApp assim que o pedido sai.' },
  { q: 'E se eu não gostar?', a: 'Você tem 7 dias depois de receber para desistir da compra, pelo Código de Defesa do Consumidor, e a AURA Fresh estende a garantia de satisfação para 14 dias. É só escrever para suporte@aurafresh.com.br.' },
  { q: 'Por que o preço é esse?', a: 'A clorofilina, ativo principal, é importada e comprada em dólar. A marca escolheu não trocar a matéria-prima por uma mais barata. Nos kits de 2 e 3 potes a dose sai mais em conta.' },
];

// depoimentos do site atual: só publicar com autorização assinada (revisão jurídica)
const depoimentos = [
  { img: 'depo-1.webp', tag: 'Rotina com AURA Fresh', texto: 'Nenhuma pastilha resolvia, no meio do dia o hálito já tinha voltado. Esse produto me deixa com a sensação de boca fresca por muito mais tempo.', quem: '[nome autorizado]', cidade: '[cidade]' },
  { img: 'depo-2.webp', tag: 'Depois do almoço', texto: 'Estou tomando há 10 dias. Meu marido comentou que meu hálito tem melhorado muito, principalmente de manhã.', quem: '[nome autorizado]', cidade: '[cidade]' },
  { img: 'depo-4.webp', tag: 'Unboxing', texto: 'Eu usava enxaguante bucal umas três vezes por dia. Comecei a tomar esse pozinho com gosto de abacaxi e gostei de ter virado parte da rotina.', quem: '[nome autorizado]', cidade: '[cidade]' },
  { img: 'depo-5.webp', tag: 'No dia a dia', texto: 'Eu evitava dar risada perto de gente. Hoje me sinto muito mais à vontade.', quem: '[nome autorizado]', cidade: '[cidade]' },
];

module.exports = { empresa, produto, kits, ativos, faq, depoimentos, brl };
