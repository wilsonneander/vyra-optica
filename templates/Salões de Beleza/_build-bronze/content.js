// Conteúdo do Bronze do salão (Mecha Salão, o lado salão da marca fictícia Mecha Salão & Barbearia).
// Página única, enxuta: serviços e preços, galeria fixa, avaliações, políticas, agendamento pelo WhatsApp, mapa e horário.
// Trocar aqui textos, preços e horários e rodar o build.

const marca = {
  nome: 'Mecha',
  completo: 'Mecha Salão',
  casa: 'Mecha Salão & Barbearia',
  razao: 'Mecha Beleza e Barbearia Ltda.',
  cnpj: '47.318.552/0001-09',
  endereco: 'Rua Harmonia, 512',
  bairro: 'Vila Madalena',
  cidade: 'São Paulo',
  uf: 'SP',
  cep: '05435-000',
  telefone: '(11) 3031-4826',
  whatsapp: '5511973152640',
  whatsappTexto: '(11) 97315-2640',
  email: 'salao@mechasalao.com.br',
  instagram: 'https://instagram.com/mecha.salao',
  facebook: 'https://facebook.com/mecha.salao',
  linkedin: 'https://linkedin.com/company/mecha-salao',
  dominio: 'https://mechasalao.com.br/salao',
  nota: 4.9,
  avaliacoes: 860,
};

// [dia, horário]; o índice segue getDay() (0 = domingo)
const horarios = [
  ['Domingo', 'Fechado'],
  ['Segunda', 'Fechado'],
  ['Terça', '9h às 19h'],
  ['Quarta', '9h às 19h'],
  ['Quinta', '9h às 21h'],
  ['Sexta', '9h às 21h'],
  ['Sábado', '9h às 18h'],
];
const abertura = { 0: null, 1: null, 2: [9, 19], 3: [9, 19], 4: [9, 21], 5: [9, 21], 6: [9, 18] };
const horarioCurto = 'Ter e qua, 9h às 19h. Qui e sex, 9h às 21h. Sáb, 9h às 18h';

// serviços: min = duração; de = preço "a partir de"; quimica = pede teste de mecha antes
const grupos = [
  { id: 'cortes', nome: 'Cortes', servicos: [
    { id: 'corte', nome: 'Corte feminino', inclui: 'Conversa no espelho, lavagem, corte e finalização simples.', min: 60, preco: 120, de: true },
    { id: 'corte-escova', nome: 'Corte e escova longa', inclui: 'Para cabelo abaixo do ombro: corte em camadas e escova modelada.', min: 90, preco: 165, de: true },
    { id: 'franja', nome: 'Franja e pontas', inclui: 'Acerto de franja ou só das pontas, sem lavagem.', min: 20, preco: 45 },
  ] },
  { id: 'escova', nome: 'Escova e finalização', servicos: [
    { id: 'escova-lisa', nome: 'Escova lisa', inclui: 'Lavagem com xampu da casa, protetor térmico e escova.', min: 45, preco: 70, de: true },
    { id: 'escova-mod', nome: 'Escova modelada', inclui: 'Ondas com escova redonda ou babyliss e finalização com brilho.', min: 60, preco: 95, de: true },
    { id: 'penteado', nome: 'Penteado para evento', inclui: 'Prova de ideia por foto antes do dia, preso ou semipreso.', min: 90, preco: 180, de: true },
  ] },
  { id: 'cor', nome: 'Cor e mechas', servicos: [
    { id: 'raiz', nome: 'Coloração de raiz', inclui: 'Teste de mecha, cor na raiz até 3 cm, lavagem e secagem.', min: 90, preco: 180, de: true, quimica: true },
    { id: 'mechas', nome: 'Mechas e balayage', inclui: 'Diagnóstico, teste de mecha, clareamento à mão livre, tonalização e escova.', min: 240, preco: 480, de: true, quimica: true, destaque: true },
    { id: 'gloss', nome: 'Tonalização (gloss)', inclui: 'Corrige o tom e devolve o brilho entre uma mecha e outra.', min: 60, preco: 150, de: true, quimica: true },
  ] },
  { id: 'tratamentos', nome: 'Tratamentos e alinhamento', servicos: [
    { id: 'hidratacao', nome: 'Hidratação e escova', inclui: 'Máscara de tratamento com vapor e escova no fim.', min: 75, preco: 140, de: true },
    { id: 'reconstrucao', nome: 'Reconstrução', inclui: 'Para fio quebradiço depois de química ou descoloração.', min: 60, preco: 130 },
    { id: 'alinhamento', nome: 'Alinhamento sem formol', inclui: 'Teste de mecha, produto com registro na Anvisa e escova de selagem.', min: 180, preco: 350, de: true, quimica: true },
  ] },
];

// faixa de atalhos da capa (cada um leva ao serviço na lista)
const atalhos = [
  { icone: 'tesoura', nome: 'Corte', alvo: 'corte' },
  { icone: 'secador', nome: 'Escova', alvo: 'escova-lisa' },
  { icone: 'pincel', nome: 'Coloração', alvo: 'raiz' },
  { icone: 'mecha', nome: 'Mechas', alvo: 'mechas' },
  { icone: 'pote', nome: 'Hidratação', alvo: 'hidratacao' },
  { icone: 'prancha', nome: 'Alinhamento', alvo: 'alinhamento' },
];

const pagamento = 'Pix, débito e crédito. Mechas, balayage e alinhamento em até 3 vezes sem juros no crédito.';
const aPartir = 'O valor "a partir de" muda com o comprimento e o volume do cabelo e é fechado no diagnóstico, antes de começar. Nada é cobrado além do combinado.';

// galeria fixa (foto alta à esquerda e quatro à direita, como na referência)
const galeria = [
  { foto: 'escova5', legenda: 'Escova lisa com finalização' },
  { foto: 'mechas', legenda: 'Balayage com tonalização bege' },
  { foto: 'coloracao', legenda: 'Mechas no papel, à mão livre' },
  { foto: 'lavatorio2', legenda: 'Lavagem com massagem no couro cabeludo' },
  { foto: 'corte-f2', legenda: 'Ondas modeladas no babyliss' },
];

// avaliações (fictícias, no formato das do Google)
const depoimentos = [
  { nome: 'Mariana Costa', bairro: 'Pinheiros, São Paulo', serv: 'Balayage', titulo: 'Explicou cada etapa e acertou o tom', texto: 'Fizeram o teste de mecha uma semana antes, explicaram o porquê de cada etapa e o tom ficou exatamente o da foto que eu levei. Três meses depois a raiz cresceu e ninguém percebe a marca.', foto: 'l4' },
  { nome: 'Juliana Prado', bairro: 'Vila Madalena, São Paulo', serv: 'Escova modelada', titulo: 'Horário cumprido do começo ao fim', texto: 'Cheguei no horário e fui atendida no horário. A escova durou até o terceiro dia, e o preço foi o mesmo do site, sem surpresa no caixa.', foto: 'l6' },
  { nome: 'Camila Rocha', bairro: 'Perdizes, São Paulo', serv: 'Corte e hidratação', titulo: 'Corte pensado para o meu cacho', texto: 'Primeiro salão que cortou meu cabelo seco, cacho por cacho, antes de molhar. Saí sabendo como finalizar em casa e voltei no mês seguinte.', foto: 'l2' },
];

// políticas (obrigatório em todos os níveis)
const politicas = [
  { titulo: 'Agendamento', texto: 'Peça pelo formulário, WhatsApp ou telefone. Confirmamos em até uma hora no horário de funcionamento e lembramos na véspera. Sem hora marcada, só se houver cadeira livre.' },
  { titulo: 'Atraso', texto: 'Tolerância de 15 minutos. Depois disso o serviço pode ser reduzido para caber no horário ou remarcado, conforme a agenda do dia.' },
  { titulo: 'Cancelamento e remarcação', texto: 'Sem custo até 24 horas antes, pelo WhatsApp. Serviços de cor e alinhamento pedem sinal de 30% via Pix, que vira crédito para uma nova data em até 60 dias quando o aviso vem com menos de 24 horas. Duas faltas sem aviso pedem sinal em todos os próximos horários.' },
  { titulo: 'Garantia', texto: 'Corte e escova: ajuste sem custo em até 7 dias, com a mesma profissional. A garantia não cobre mudança de ideia sobre o resultado combinado no espelho.' },
  { titulo: 'Coloração e química', destaque: true, texto: 'Coloração, mechas, tonalização e alinhamento só depois do teste de mecha e de sensibilidade, feito com 48 horas de antecedência para quem nunca fez aqui. Avise alergias, gestação, medicamentos e química feita fora do salão nos últimos 6 meses. Retoque de tom sem custo em até 15 dias, seguindo os cuidados passados no dia. Se o fio não aguentar o processo, a profissional explica o motivo e propõe outro caminho.' },
];
const higiene = [
  'Tesouras, pentes, pinças e escovas lavados e esterilizados em autoclave entre uma cliente e outra.',
  'Lixas, toucas, luvas, papel alumínio e capas de pescoço descartáveis, abertos na sua frente.',
  'Tintas, descolorantes e produtos de alinhamento com registro ou notificação na Anvisa, dentro da validade e com rótulo à mostra.',
  'Lavatórios, cadeiras e bancadas higienizados a cada atendimento. Licença sanitária municipal em dia.',
];

const bairros = ['Vila Madalena', 'Pinheiros', 'Sumarezinho', 'Alto de Pinheiros', 'Perdizes', 'Vila Beatriz'];

// descrição das fotos (alt)
const fotos = {
  'depois-escova': 'Mulher sorrindo com o cabelo liso e brilhante, segurando um secador',
  escova5: 'Cabeleireira fazendo escova em cliente de cabelo escuro e comprido',
  mechas: 'Cabelo loiro com balayage e ondas largas, visto de costas',
  coloracao: 'Cabeleireira aplicando mechas com pincel sobre papel alumínio',
  lavatorio2: 'Cliente reclinada no lavatório recebendo massagem no couro cabeludo',
  'corte-f2': 'Cliente de costas com ondas modeladas em tom castanho iluminado',
  escova: 'Salão com espelhos em arco, cabeleireira finalizando o cabelo de uma cliente',
  l4: 'Mariana, cliente do salão, de cabelo castanho comprido',
  l6: 'Juliana, cliente do salão, de cabelo escuro ondulado',
  l2: 'Camila, cliente do salão, de cabelo cacheado',
};

module.exports = { marca, horarios, abertura, horarioCurto, grupos, atalhos, pagamento, aPartir, galeria, depoimentos, politicas, higiene, bairros, fotos };
