// Conteúdo do Silver do salão (Mecha Salão, o lado salão da marca fictícia Mecha Salão & Barbearia).
// Site com três páginas (início, equipe, galeria) e Área do cliente. Estes são os dados padrão:
// o painel da Área do cliente parte deles e, quando salva, o site passa a mostrar o que foi salvo.
// Trocar aqui textos, preços, equipe e horários e rodar o build.

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
  whatsapp: '(11) 97315-2640',
  email: 'salao@mechasalao.com.br',
  instagram: '@mecha.salao',
  facebook: 'https://facebook.com/mecha.salao',
  linkedin: 'https://linkedin.com/company/mecha-salao',
  dominio: 'https://mechasalao.com.br/salao',
  referencia: 'A quatro quadras do metrô Vila Madalena',
  estacionamento: 'Estacionamento conveniado na Rua Fidalga, 1h grátis',
  nota: 4.9,
  avaliacoes: 860,
  desde: 2017,
};

// horário por dia da semana (0 = domingo); abre e fecha em "HH:MM"
const horario = [
  { aberto: false, abre: '09:00', fecha: '18:00' },
  { aberto: false, abre: '09:00', fecha: '18:00' },
  { aberto: true, abre: '09:00', fecha: '19:00' },
  { aberto: true, abre: '09:00', fecha: '19:00' },
  { aberto: true, abre: '09:00', fecha: '21:00' },
  { aberto: true, abre: '09:00', fecha: '21:00' },
  { aberto: true, abre: '09:00', fecha: '18:00' },
];

// segmentos: cada um vira um bloco de cartões em Serviços e uma categoria na galeria
const segmentos = [
  { id: 'cabelo', nome: 'Corte e escova', curto: 'Cabelo', foto: 'corte-tesoura', texto: 'Corte pensado para o jeito que você usa o cabelo no dia a dia, e escova com protetor térmico sempre.' },
  { id: 'cor', nome: 'Cor e mechas', curto: 'Cor', foto: 'papel-aluminio', texto: 'Toda química começa com teste de mecha e diagnóstico do fio. O valor final sai antes de abrir o primeiro pote.' },
  { id: 'cachos', nome: 'Cachos', curto: 'Cachos', foto: 'cachos-difusor', texto: 'Corte a seco, cacho por cacho, e finalização que você consegue repetir em casa.' },
  { id: 'tratamentos', nome: 'Tratamentos e alinhamento', curto: 'Tratamentos', foto: 'lavagem', texto: 'Hidratação, reconstrução e alinhamento sem formol, com produtos de registro na Anvisa.' },
  { id: 'unhas', nome: 'Unhas', curto: 'Unhas', foto: 'unhas', texto: 'Alicate esterilizado em autoclave, lixa e palito novos para cada cliente, abertos na sua frente.' },
  { id: 'sobrancelha', nome: 'Sobrancelha e maquiagem', curto: 'Sobrancelha', foto: 'maquiagem', texto: 'Design que respeita o seu desenho natural e maquiagem para festa, noiva ou formatura.' },
];

// serviços: min = duração; de = preço "a partir de"; quimica = pede teste de mecha ou de sensibilidade antes
const servicos = [
  { id: 'corte', seg: 'cabelo', nome: 'Corte feminino', inclui: 'Conversa no espelho, lavagem, corte e finalização simples.', min: 60, preco: 120, de: true, ativo: true },
  { id: 'corte-escova', seg: 'cabelo', nome: 'Corte e escova longa', inclui: 'Para cabelo abaixo do ombro: corte em camadas e escova modelada.', min: 90, preco: 165, de: true, ativo: true },
  { id: 'franja', seg: 'cabelo', nome: 'Franja e pontas', inclui: 'Acerto da franja ou só das pontas, sem lavagem.', min: 20, preco: 45, ativo: true },
  { id: 'escova', seg: 'cabelo', nome: 'Escova modelada', inclui: 'Lavagem, protetor térmico e ondas com escova redonda ou babyliss.', min: 60, preco: 95, de: true, ativo: true },
  { id: 'penteado', seg: 'cabelo', nome: 'Penteado para evento', inclui: 'Prova da ideia por foto antes do dia, preso ou semipreso.', min: 90, preco: 180, de: true, ativo: true },
  { id: 'raiz', seg: 'cor', nome: 'Coloração de raiz', inclui: 'Teste de mecha, cor na raiz até 3 cm, lavagem e secagem.', min: 90, preco: 180, de: true, quimica: true, ativo: true },
  { id: 'mechas', seg: 'cor', nome: 'Mechas e balayage', inclui: 'Diagnóstico, teste de mecha, clareamento à mão livre, tonalização e escova.', min: 240, preco: 480, de: true, quimica: true, destaque: true, ativo: true },
  { id: 'gloss', seg: 'cor', nome: 'Tonalização (gloss)', inclui: 'Corrige o tom e devolve o brilho entre uma mecha e outra.', min: 60, preco: 150, de: true, quimica: true, ativo: true },
  { id: 'cacho-corte', seg: 'cachos', nome: 'Corte a seco para cachos', inclui: 'Corte cacho por cacho com o cabelo seco, lavagem e finalização com difusor.', min: 90, preco: 170, de: true, ativo: true },
  { id: 'cacho-final', seg: 'cachos', nome: 'Finalização de cachos', inclui: 'Lavagem, creme e gel na medida do seu fio e secagem com difusor.', min: 60, preco: 90, de: true, ativo: true },
  { id: 'hidratacao', seg: 'tratamentos', nome: 'Hidratação e escova', inclui: 'Máscara de tratamento com vapor e escova no fim.', min: 75, preco: 140, de: true, ativo: true },
  { id: 'reconstrucao', seg: 'tratamentos', nome: 'Reconstrução', inclui: 'Para fio quebradiço depois de química ou descoloração.', min: 60, preco: 130, ativo: true },
  { id: 'alinhamento', seg: 'tratamentos', nome: 'Alinhamento sem formol', inclui: 'Teste de mecha, produto com registro na Anvisa e escova de selagem.', min: 180, preco: 350, de: true, quimica: true, ativo: true },
  { id: 'manicure', seg: 'unhas', nome: 'Manicure', inclui: 'Cutícula, lixa, esmaltação comum e hidratação das mãos.', min: 40, preco: 45, ativo: true },
  { id: 'pe-mao', seg: 'unhas', nome: 'Pé e mão', inclui: 'Manicure e pedicure na mesma visita, com escalda-pés.', min: 90, preco: 85, ativo: true },
  { id: 'gel', seg: 'unhas', nome: 'Esmaltação em gel', inclui: 'Preparo da unha, gel em três camadas e cabine de secagem. Dura até 3 semanas.', min: 60, preco: 110, ativo: true },
  { id: 'design', seg: 'sobrancelha', nome: 'Design de sobrancelha', inclui: 'Mapeamento do rosto e limpeza na pinça, sem afinar o desenho natural.', min: 30, preco: 55, ativo: true },
  { id: 'henna', seg: 'sobrancelha', nome: 'Design com henna', inclui: 'Design e preenchimento com henna. Teste de sensibilidade antes.', min: 45, preco: 75, quimica: true, ativo: true },
  { id: 'maquiagem', seg: 'sobrancelha', nome: 'Maquiagem social', inclui: 'Pele, olhos e boca para festa ou formatura. Cílios postiços inclusos.', min: 60, preco: 180, de: true, ativo: true },
];

// equipe: dias = agenda por dia da semana (getDay) com [entrada, saída] em horas; faz = segmentos que atende
const equipe = [
  { id: 'carla', nome: 'Carla Menezes', cargo: 'Colorista e responsável técnica', esp: 'Mechas, balayage e correção de cor', anos: 12, foto: 'carla', faz: ['cor', 'tratamentos'],
    bio: 'Começou lavando cabelo num salão da Pompeia e hoje cuida de toda a química da casa. Guarda a fórmula de cor de cada cliente e é quem decide quando um fio não aguenta mais um clareamento.',
    formacao: 'Técnica em química capilar, cursos de colorimetria e balayage', dias: { 2: [10, 19], 3: [10, 19], 4: [10, 21], 5: [10, 21], 6: [9, 17] }, ativo: true },
  { id: 'beatriz', nome: 'Beatriz Alves', cargo: 'Cabeleireira', esp: 'Cortes em camadas, escova e cachos', anos: 9, foto: 'beatriz', faz: ['cabelo', 'cachos', 'tratamentos'],
    bio: 'Corta pensando em como o cabelo vai ficar na terceira lavagem, não só na saída do salão. É a especialista da casa em corte a seco para cachos.',
    formacao: 'Cursos de visagismo, corte a seco e finalização de cachos', dias: { 2: [9, 18], 3: [9, 18], 4: [12, 21], 5: [12, 21], 6: [9, 18] }, ativo: true },
  { id: 'larissa', nome: 'Larissa Ramos', cargo: 'Manicure e nail designer', esp: 'Esmaltação em gel e unhas curtas bem feitas', anos: 7, foto: 'larissa', faz: ['unhas'],
    bio: 'Trabalha com alicate esterilizado e lixa nova para cada cliente, sem exceção. Gosta de unha curta, bem desenhada e que dura até a próxima visita.',
    formacao: 'Curso de manicure e pedicure, biossegurança e esmaltação em gel', dias: { 2: [9, 19], 3: [9, 19], 4: [9, 19], 6: [9, 18] }, ativo: true },
  { id: 'renata', nome: 'Renata Lopes', cargo: 'Designer de sobrancelha e maquiadora', esp: 'Design natural, henna e maquiagem de festa', anos: 8, foto: 'renata', faz: ['sobrancelha'],
    bio: 'Mapeia o rosto antes de tirar o primeiro fio e prefere sobrancelha que parece sua. Nas sextas e sábados cuida das noivas e formandas.',
    formacao: 'Cursos de design de sobrancelha, henna e maquiagem social', dias: { 3: [10, 19], 4: [11, 21], 5: [11, 21], 6: [9, 18] }, ativo: true },
];

// produtos à venda no balcão (cadastrados pela Área do cliente)
const produtos = [
  { id: 'oleo', nome: 'Óleo reparador de pontas', det: '30 ml', preco: 69, foto: 'oleo', ativo: true },
  { id: 'kit', nome: 'Kit lavagem e máscara', det: 'Xampu, condicionador e máscara, 250 ml cada', preco: 159, foto: 'texturas', ativo: true },
  { id: 'esmalte', nome: 'Esmalte da estação', det: '9 ml, cores da coleção de verão', preco: 24, foto: 'esmaltes', ativo: true },
  { id: 'creme', nome: 'Creme para cachos', det: '300 g, sem óleo mineral', preco: 58, foto: 'bisnaga', ativo: true },
];

const pagamento = 'Pix, débito e crédito. Mechas, balayage e alinhamento em até 3 vezes sem juros no crédito.';
const aPartir = 'O valor "a partir de" muda com o comprimento e o volume do cabelo e é fechado no diagnóstico, antes de começar.';

// tendências da estação (fotos de referência; no site do cliente entram trabalhos da casa com autorização)
const looks = [
  { foto: 'look-cachos', nome: 'Cachos com volume', texto: 'Corte a seco que abre o cacho sem perder o comprimento.' },
  { foto: 'look-bob', nome: 'Chanel polido', texto: 'Linha reta na altura do queixo e brilho de escova.' },
  { foto: 'look-loiro', nome: 'Loiro bege', texto: 'Mechas finas com tonalização fria para não amarelar.' },
  { foto: 'look-ruivo', nome: 'Cobre solto', texto: 'Ruivo acetinado que desbota bonito entre as visitas.' },
  { foto: 'look-sorriso', nome: 'Cachos curtos', texto: 'Volume nas laterais e franja de cachos.' },
  { foto: 'look-longo', nome: 'Ondas longas', texto: 'Camadas longas que deixam o cacho cair mais leve.' },
  { foto: 'look-ondas', nome: 'Dourado iluminado', texto: 'Luzes no contorno do rosto sobre cacho natural.' },
  { foto: 'l1', nome: 'Long bob castanho', texto: 'Comprimento no ombro com pontas desfiadas.' },
];

const motivos = [
  { titulo: 'Preço combinado antes', texto: 'Toda visita começa com uma conversa no espelho. O valor, o tempo e o resultado são combinados antes de começar, e nada muda sem você saber.' },
  { titulo: 'Cuidado com o fio', texto: 'Química só depois do teste de mecha. Se o fio não aguenta, a gente explica o motivo e propõe outro caminho.' },
  { titulo: 'Atenção só sua', texto: 'Agenda com folga entre horários, para ninguém ser atendida correndo. Café passado na hora e Wi-Fi.' },
  { titulo: 'Cuidados para casa', texto: 'Antes de sair, você leva a dica de finalização, os produtos certos para o seu fio e a data sugerida da volta.' },
];

// garantia de ajuste (prazo para voltar sem custo se algo não ficou como combinado)
const garantia = [
  ['Corte e escova', 'Até 7 dias'],
  ['Coloração, mechas e gloss', 'Até 15 dias'],
  ['Alinhamento e tratamentos químicos', 'Até 15 dias'],
  ['Esmaltação em gel', 'Até 5 dias'],
  ['Design de sobrancelha', 'Até 7 dias'],
  ['Maquiagem', 'Antes de você sair do salão'],
];

// antes e depois (fotos de representação até o cliente ter as próprias, com autorização de imagem)
const historias = [
  { antes: 'antes-mechas', depois: 'depois-mechas', servico: 'Mechas, tonalização e escova', titulo: 'Do castanho às mechas iluminadas', texto: 'Balayage feito à mão livre em duas etapas, com tonalização bege para não amarelar.', tempo: 'Cerca de 4h30', preco: 'A partir de R$ 480', prof: 'carla' },
  { antes: 'antes-escova', depois: 'depois-escova', servico: 'Hidratação e escova', titulo: 'Dos cachos ao liso de escova', texto: 'Escova lisa com protetor térmico, sem química. Na próxima lavagem os cachos voltam como eram.', tempo: 'Cerca de 1h15', preco: 'A partir de R$ 140', prof: 'beatriz' },
];

// avaliações (fictícias, no formato das do Google)
const depoimentos = [
  { nome: 'Mariana C.', serv: 'Balayage', texto: 'Fizeram o teste de mecha uma semana antes e o tom ficou exatamente o da foto que eu levei. Três meses depois ninguém percebe a raiz.' },
  { nome: 'Juliana P.', serv: 'Escova modelada', texto: 'Cheguei no horário e fui atendida no horário. A escova durou até o terceiro dia e o preço foi o mesmo do site.' },
  { nome: 'Camila R.', serv: 'Corte a seco para cachos', texto: 'Primeiro salão que cortou meu cabelo seco, cacho por cacho. Saí sabendo finalizar em casa.' },
  { nome: 'Fernanda L.', serv: 'Esmaltação em gel', texto: 'A Larissa abriu o kit esterilizado na minha frente. O gel durou três semanas sem descascar.' },
  { nome: 'Patrícia M.', serv: 'Design com henna', texto: 'A Renata explicou cada passo e não afinou nada. Parece que eu nasci com essa sobrancelha.' },
  { nome: 'Aline S.', serv: 'Maquiagem social', texto: 'Fiz a maquiagem da formatura e ela durou a festa toda. Ainda me ensinaram a retocar o batom.' },
  { nome: 'Renata V.', serv: 'Alinhamento sem formol', texto: 'Sem cheiro forte e sem ardência. Mostraram o registro do produto antes de começar.' },
  { nome: 'Luiza F.', serv: 'Corte e escova longa', texto: 'Disse que queria tirar pouco e tiraram pouco. Parece óbvio, mas não é em todo lugar.' },
];

// Instagram de exemplo (no site do cliente entra o feed oficial, veja o README)
const instagram = {
  usuario: 'mecha.salao',
  nome: 'Mecha Salão & Barbearia',
  bio: 'Salão e barbearia na Vila Madalena. Preço combinado antes de começar.',
  posts: 412, seguidores: '18,6 mil', seguindo: 210,
  fotos: [
    { foto: 'mechas4', legenda: 'Ondas no babyliss depois das mechas. 4h30 de cadeira com a Carla.', curtidas: 1284, comentarios: 46 },
    { foto: 'unhas2', legenda: 'Gel em três tons para o fim de semana.', curtidas: 932, comentarios: 31 },
    { foto: 'penteado', legenda: 'Coque baixo para madrinha, com prova por foto antes do dia.', curtidas: 1510, comentarios: 58 },
    { foto: 'sobrancelha2', legenda: 'Design natural, sem afinar. Antes de tirar o primeiro fio, a Renata mapeia o rosto.', curtidas: 845, comentarios: 22 },
    { foto: 'extensao', legenda: 'Bastidores de uma terça-feira: preparo para a escova.', curtidas: 702, comentarios: 17 },
    { foto: 'rolos', legenda: 'Rolos quentes para volume que dura a festa inteira.', curtidas: 1103, comentarios: 39 },
  ],
};

const bomSaber = [
  ['Acessível', 'Entrada no nível da calçada e lavatório adaptado.'],
  ['Estacionamento', 'Conveniado na Rua Fidalga, com a primeira hora grátis.'],
  ['Metrô perto', 'A quatro quadras da estação Vila Madalena, linha verde.'],
  ['Crianças bem-vindas', 'Corte infantil com hora marcada e cantinho com livros.'],
  ['Encaixe quando dá', 'Sem hora marcada só se houver cadeira livre. Ligue antes.'],
  ['Pix e cartão', 'Débito, crédito em até 3 vezes nos serviços de cor e Pix.'],
  ['Teste antes da química', 'Teste de mecha e de sensibilidade 48 horas antes.'],
  ['Café e Wi-Fi', 'Café passado na hora, chá e água com gás enquanto você espera.'],
];

const politicas = [
  { titulo: 'Agendamento', texto: 'Peça pelo formulário, WhatsApp ou telefone. Confirmamos em até uma hora no horário de funcionamento e lembramos na véspera. Serviços de cor e alinhamento acima de R$ 300 pedem sinal de 30% via Pix, abatido no valor final.' },
  { titulo: 'Atraso', texto: 'Tolerância de 15 minutos. Depois disso o serviço pode ser reduzido para caber no horário ou remarcado, conforme a agenda da profissional.' },
  { titulo: 'Cancelamento e remarcação', texto: 'Sem custo até 24 horas antes, pelo WhatsApp. Com menos de 24 horas, o sinal vira crédito para uma nova data em até 60 dias. Duas faltas sem aviso pedem sinal em todos os próximos horários.' },
  { titulo: 'Garantia dos serviços', texto: 'Ajuste sem custo dentro do prazo de cada serviço, com a mesma profissional, quando algo não ficou como combinado no espelho. A garantia não cobre mudança de ideia sobre o resultado combinado nem processos feitos fora do salão.' },
  { titulo: 'Coloração e química', destaque: true, texto: 'Coloração, mechas, tonalização, alinhamento e henna só depois do teste de mecha e de sensibilidade, feito 48 horas antes para quem nunca fez aqui. Avise alergias, gestação, medicamentos e química feita fora do salão nos últimos 6 meses. Retoque de tom sem custo em até 15 dias, seguindo os cuidados passados no dia. Se o fio não aguentar o processo, a profissional explica o motivo e propõe outro caminho.' },
  { titulo: 'Pagamento', texto: 'Pix, débito e crédito, com mechas, balayage e alinhamento em até 3 vezes sem juros. Os valores "a partir de" dependem do comprimento e do volume e são fechados na conversa, antes do serviço.' },
];
const higiene = [
  'Tesouras, pentes, alicates e pinças lavados e esterilizados em autoclave entre uma cliente e outra.',
  'Lixas, palitos, toucas, luvas, papel alumínio e capas de pescoço descartáveis, abertos na sua frente.',
  'Tintas, descolorantes, henna e produtos de alinhamento com registro ou notificação na Anvisa, dentro da validade e com rótulo à mostra.',
  'Lavatórios, cadeiras, cabines e bancadas higienizados a cada atendimento. Licença sanitária municipal em dia.',
];

const faq = [
  ['Como faço para marcar?', 'Pelo formulário no fim desta página, pelo WhatsApp ou por telefone. Você escolhe a profissional ou deixa sem preferência, e a gente encaixa no primeiro horário livre.'],
  ['Vocês atendem sem hora marcada?', 'Só se houver cadeira livre. Cor, escova e unhas em gel precisam de tempo reservado, então vale ligar antes.'],
  ['Quanto tempo leva uma coloração?', 'Raiz leva cerca de uma hora e meia. Mechas e balayage, de três horas e meia a quatro horas e meia, já com a escova. Combinamos o tempo na conversa.'],
  ['Preciso fazer teste antes da química?', 'Sim, sempre. Teste de mecha para cor e alinhamento e de sensibilidade para henna. Para quem nunca fez química aqui, ele é feito 48 horas antes.'],
  ['Posso marcar mais de um serviço no mesmo dia?', 'Pode. Escreva no campo de observações, por exemplo unhas durante a escova, e a gente monta a agenda com as duas profissionais.'],
  ['Quais produtos vocês usam?', 'Linhas profissionais com registro na Anvisa, escolhidas para cada tipo de fio. Os que vendemos no balcão estão na seção Para levar para casa.'],
  ['Qual é a política de cancelamento?', 'Sem custo até 24 horas antes. Com menos tempo, o sinal vira crédito para outra data em até 60 dias.'],
];

const bairros = ['Vila Madalena', 'Pinheiros', 'Sumarezinho', 'Alto de Pinheiros', 'Perdizes', 'Vila Beatriz'];

// galeria por categoria (página galeria.html); cat = id do segmento ou 'espaco'
const galeria = [
  { foto: 'escova', cat: 'cabelo', legenda: 'Escova modelada diante dos espelhos em arco' },
  { foto: 'mechas', cat: 'cor', legenda: 'Balayage com tonalização bege' },
  { foto: 'unhas', cat: 'unhas', legenda: 'Manicure com kit esterilizado' },
  { foto: 'interior', cat: 'espaco', legenda: 'Bancadas com espelhos redondos' },
  { foto: 'corte-tesoura', cat: 'cabelo', legenda: 'Corte reto na tesoura' },
  { foto: 'sobrancelha-pinca', cat: 'sobrancelha', legenda: 'Design de sobrancelha na pinça' },
  { foto: 'cachos-difusor', cat: 'cachos', legenda: 'Finalização com difusor' },
  { foto: 'coloracao', cat: 'cor', legenda: 'Mechas no papel, à mão livre' },
  { foto: 'esmaltes', cat: 'unhas', legenda: 'A parede de esmaltes da estação' },
  { foto: 'babyliss', cat: 'cabelo', legenda: 'Ondas no babyliss' },
  { foto: 'maquiagem', cat: 'sobrancelha', legenda: 'Maquiagem de noiva no dia' },
  { foto: 'lavagem', cat: 'tratamentos', legenda: 'Lavagem com massagem no couro cabeludo' },
  { foto: 'espaco-equipe', cat: 'espaco', legenda: 'O salão numa tarde de quinta' },
  { foto: 'mechas4', cat: 'cor', legenda: 'Mechas finalizadas em ondas' },
  { foto: 'look-cachos', cat: 'cachos', legenda: 'Cacho aberto depois do corte a seco' },
  { foto: 'penteado', cat: 'cabelo', legenda: 'Coque baixo para madrinha' },
  { foto: 'unhas2', cat: 'unhas', legenda: 'Gel em três tons' },
  { foto: 'lavatorio2', cat: 'tratamentos', legenda: 'Hidratação com vapor' },
  { foto: 'sobrancelha2', cat: 'sobrancelha', legenda: 'Henna aplicada com pincel fino' },
  { foto: 'papel-aluminio', cat: 'cor', legenda: 'Clareamento em papel alumínio' },
  { foto: 'interior2', cat: 'espaco', legenda: 'Cadeiras de corte e a vitrine de produtos' },
  { foto: 'rolos', cat: 'cabelo', legenda: 'Rolos quentes para volume' },
  { foto: 'maquiagem2', cat: 'sobrancelha', legenda: 'Olho colorido para formatura' },
  { foto: 'recepcao', cat: 'espaco', legenda: 'Recepção e balcão de produtos' },
  { foto: 'escova5', cat: 'cabelo', legenda: 'Escova lisa em cabelo comprido' },
  { foto: 'equipe-trio', cat: 'espaco', legenda: 'Parte da equipe num sábado' },
  { foto: 'mechas2', cat: 'cor', legenda: 'Ondas em loiro acinzentado' },
  { foto: 'extensao', cat: 'cabelo', legenda: 'Preparo para a escova' },
];

// descrição das fotos (alt)
const fotos = {
  'capa-salao': 'Cabeleireira sorrindo enquanto faz escova com secador numa cliente, no salão iluminado pelas janelas',
  'equipe-trio': 'Três profissionais do salão sorrindo, com tesoura e escova nas mãos',
  carla: 'Carla Menezes, colorista, sentada na cadeira do salão',
  beatriz: 'Beatriz Alves, cabeleireira, sorrindo com o secador na mão',
  larissa: 'Larissa Ramos, manicure, sorrindo no salão',
  renata: 'Renata Lopes, designer de sobrancelha, apoiada numa bancada do salão',
  'corte-tesoura': 'Cabeleireira cortando as pontas de um cabelo escuro e liso com tesoura e pente',
  'papel-aluminio': 'Colorista aplicando produto com pincel numa mecha sobre papel alumínio',
  'cachos-difusor': 'Mulher de cabelo cacheado secando os cachos com difusor',
  lavagem: 'Cliente reclinada no lavatório recebendo lavagem',
  unhas: 'Manicure fazendo as unhas de uma cliente no salão',
  unhas2: 'Mão com unhas esmaltadas em lilás, branco e prata',
  esmaltes: 'Parede com prateleiras de esmaltes coloridos',
  maquiagem: 'Maquiadora aplicando blush numa cliente sentada diante do espelho',
  maquiagem2: 'Maquiadora aplicando sombra rosa nos olhos de uma cliente',
  'sobrancelha-pinca': 'Profissional modelando a sobrancelha de uma cliente com pinça',
  sobrancelha2: 'Profissional penteando a sobrancelha de uma cliente com escovinha',
  babyliss: 'Cabeleireira modelando ondas com babyliss em cabelo castanho',
  rolos: 'Cabeleireira prendendo rolos no cabelo de uma cliente',
  penteado: 'Cabeleireiro finalizando um coque ruivo com grampos',
  extensao: 'Duas cabeleireiras preparando o cabelo loiro de uma cliente',
  mechas4: 'Cabeleireira modelando ondas com babyliss em cabelo com mechas',
  interior: 'Salão com bancadas pretas e espelhos redondos iluminados',
  interior2: 'Salão com cadeiras de corte, espelhos redondos e vitrine de produtos',
  'look-cachos': 'Mulher de cabelo cacheado volumoso sorrindo de olhos fechados',
  'look-bob': 'Cabelo castanho em corte chanel reto visto de costas',
  'look-loiro': 'Mulher de cabelo loiro bege comprido e ondulado',
  'look-ruivo': 'Mulher de cabelo ruivo cacheado ao vento',
  'look-sorriso': 'Mulher de cachos curtos e escuros sorrindo',
  'look-longo': 'Mulher de cabelo escuro, longo e cacheado',
  'look-ondas': 'Mulher de cachos dourados sorrindo',
  l1: 'Mulher de cabelo castanho na altura do ombro',
  escova: 'Cabeleireira fazendo escova com secador e escova redonda numa cliente diante dos espelhos em arco',
  escova5: 'Cabeleireira fazendo escova em cliente de cabelo escuro e comprido',
  mechas: 'Duas mulheres de costas com mechas loiras e ondas',
  mechas2: 'Cabelo comprido com ondas em loiro acinzentado',
  coloracao: 'Colorista aplicando tinta com pincel sobre papel alumínio',
  lavatorio2: 'Cliente reclinada no lavatório recebendo massagem no couro cabeludo',
  'espaco-equipe': 'Salão com bancadas, espelhos em arco e profissionais atendendo',
  recepcao: 'Balcão da recepção do salão com prateleira de produtos',
  oleo: 'Frasco conta-gotas de vidro âmbar sobre uma pedra, com sombra de folhas na parede',
  texturas: 'Texturas de máscara, creme e óleo em placas de vidro com folhas verdes',
  bisnaga: 'Bisnaga branca de creme sobre uma prateleira de madeira',
  produtos2: 'Frascos âmbar de óleo e pote de máscara sobre a bancada',
  produtos3: 'Frasco de xampu e conta-gotas de óleo sobre uma prateleira branca',
  'antes-mechas': 'Antes: cabelo castanho escuro ondulado visto de costas',
  'depois-mechas': 'Depois: cabelo com mechas loiras e ondas visto de costas',
  'antes-escova': 'Antes: mulher de cabelo cacheado volumoso',
  'depois-escova': 'Depois: mulher de cabelo liso de escova',
};

module.exports = {
  marca, horario, segmentos, servicos, equipe, produtos, pagamento, aPartir, looks, motivos, garantia, historias,
  depoimentos, instagram, bomSaber, politicas, higiene, faq, bairros, galeria, fotos,
};
