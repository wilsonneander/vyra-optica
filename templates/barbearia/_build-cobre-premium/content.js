// Conteúdo do Cobre Premium. A empresa é a mesma do Cobre Standard (regra do catálogo: Standard e Premium da mesma marca),
// então marca, serviços, equipe, galeria, depoimentos, Instagram e dúvidas vêm de ../_build-cobre-standard/content.js.
// Aqui ficam só as cenas próprias do Premium. [EXEMPLO] = trocar pelo cliente; [JURÍDICO] = revisão jurídica.
// Trocar aqui e rodar: node templates/barbearia/_build-cobre-premium/build.js

const base = require('../_build-cobre-standard/content');

const marca = {
  ...base.marca,
  cnpj: '00.000.000/0001-00', // [EXEMPLO] fictício
};

// carrossel da capa (setas, arraste e pausa ao passar o mouse)
const capaSlides = [
  { foto: 'corte-degrade', rotulo: 'Degradê', pos: '50% 42%' },
  { foto: 'barba-toalha-escura', rotulo: 'Barba', pos: '50% 45%' },
  { foto: 'corte-tesoura', rotulo: 'Tesoura', pos: '55% 35%' },
];

// faixas corridas da capa: [palavra em caixa-alta, complemento em letra cursiva]
const faixa = [['Degradê', 'na navalha'], ['Toalha quente', 'sem pressa'], ['Tesoura', 'no pente'], ['Barboterapia', 'de sexta'], ['Infantil', 'com paciência'], ['Sem horário', 'se tiver cadeira']];

// "Um corte na Cobre": o relógio corre de 0 a 45 minutos enquanto a cena rola
const etapas = [
  { min: 0, nome: 'A conversa', texto: 'Foto de referência, como você penteia de manhã e quanto tempo até o próximo corte. Depois, um café coado.', foto: 'corte-pente' },
  { min: 6, nome: 'Lavagem', texto: 'Água morna, xampu da casa e massagem rápida no couro. O cabelo limpo mostra o caimento de verdade.', foto: 'corte-secador' },
  { min: 12, nome: 'Máquina', texto: 'O degradê começa de baixo, pente por pente, conferido nos dois lados do espelho.', foto: 'corte-maquina' },
  { min: 24, nome: 'Tesoura', texto: 'Em cima, tesoura no pente para tirar volume sem perder o movimento.', foto: 'corte-tesoura' },
  { min: 33, nome: 'Navalha', texto: 'Contorno, costeleta e pezinho com navalha descartável aberta na sua frente.', foto: 'acabamento-nuca' },
  { min: 38, nome: 'Toalha quente', texto: 'Toalha quente na nuca, tônico gelado e a pomada que combina com o seu cabelo.', foto: 'barba-toalha' },
  { min: 43, nome: 'O espelho de mão', texto: 'Você confere a nuca. Se algo não ficou como combinado, a gente acerta ali mesmo.', foto: 'corte-acabamento' },
];

// guia do degradê: "alto" = até onde o degradê sobe na lateral (0 a 1); "pele" = quanto da base fica na pele
const degrades = [
  { id: 'disfarcado', nome: 'Disfarçado', pede: 'Peça "disfarçado na costeleta e na nuca". Só limpa as pontas, o resto do corte não muda.', pente: 'Do pente 1 ao 3', freq: 'A cada 4 semanas', alto: 0.16, pele: 0 },
  { id: 'baixo', nome: 'Degradê baixo', pede: 'Começa logo acima da orelha. Discreto, aguenta bem o escritório e cresce sem marcar.', pente: 'Do pente 0 ao 2', freq: 'A cada 3 semanas', alto: 0.36, pele: 0.12 },
  { id: 'medio', nome: 'Degradê médio', pede: 'Sobe até a metade da lateral. O mais pedido da casa, combina com quase todo formato de rosto.', pente: 'Do pente 0 ao 3', freq: 'A cada 3 semanas', alto: 0.56, pele: 0.2 },
  { id: 'alto', nome: 'Degradê alto', pede: 'Sobe até a curva da cabeça e deixa o volume todo em cima. Contraste forte, linha bem marcada.', pente: 'Do pente 0 ao 4', freq: 'A cada 2 semanas', alto: 0.78, pele: 0.3 },
  { id: 'navalhado', nome: 'Navalhado', pede: 'Base na navalha até a pele, o acabamento mais limpo que a gente faz. Peça "navalhado" ou "zero na navalha".', pente: 'Navalha e pente 1', freq: 'A cada 2 semanas', alto: 0.6, pele: 0.5 },
];

// Clube Cobre: plano mensal [EXEMPLO]
const clube = {
  preco: 149,
  inclui: ['Dois cortes por mês, com o barbeiro que você escolher', 'Seu horário fixo a cada 15 dias, sem precisar agendar', 'Pezinho e sobrancelha sem custo entre um corte e outro', '10% de desconto em pomadas, óleos e balms da bancada'],
  regras: 'Sem fidelidade: cancela quando quiser, com aviso até o dia da renovação. Cobrança no cartão de crédito todo mês. [JURÍDICO]',
};

// combinados da casa: política de agendamento, atraso, cancelamento e garantia (o destaque é o serviço com químico)
const combinados = [
  { nome: 'Agendamento', texto: 'O horário fica garantido quando a recepção confirma pelo WhatsApp, em até uma hora no horário de funcionamento.' },
  { nome: 'Atraso', texto: 'Esperamos 15 minutos. Depois disso o serviço pode ser reduzido para caber no horário ou remarcado, sem custo.' },
  { nome: 'Cancelamento e remarcação', texto: 'Sem custo até 24 horas antes. Duas faltas sem aviso pedem sinal de 30% via Pix nos agendamentos seguintes, abatido no serviço. [JURÍDICO]' },
  { nome: 'Garantia', texto: 'Corte e barba têm ajuste sem custo em até 7 dias, com o mesmo barbeiro. Não cobre mudança de ideia sobre o combinado.' },
];
const combinadoDestaque = {
  nome: 'Pigmentação de barba',
  texto: 'É o único serviço com produto químico da casa. Para quem nunca fez aqui, o teste de sensibilidade é obrigatório 48 horas antes, atrás da orelha. Com pele irritada, ferida ou descamando, o barbeiro adia o serviço e explica o motivo. O valor é a partir de R$ 50 e fica fechado no espelho antes de começar.',
};

// formulário de contato: assuntos
const assuntos = ['Dúvida sobre um serviço', 'Clube Cobre', 'Vale-presente', 'Dia do noivo e eventos', 'Parcerias e imprensa'];

// textos curtos da tela de carregando
const carregando = ['Esquentando a toalha', 'Afiando a navalha', 'Ajeitando a cadeira'];

module.exports = { ...base, marca, capaSlides, faixa, etapas, degrades, clube, combinados, combinadoDestaque, assuntos, carregando };
