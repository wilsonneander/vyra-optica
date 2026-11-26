// Conteúdo do Amassa Standard: lanchonete de smash burger fictícia na Cidade Baixa, Porto Alegre.
// Bolinha de carne prensada na chapa, frango crocante, fritas, shakes e combos. Festas, oficina de smash e a chapa no seu evento.
// Tudo marcado com [EXEMPLO] é fictício e deve ser trocado pelos dados reais na cópia de cliente.

const marca = {
  nome: 'Amassa',
  completo: 'Amassa Smash Burger',
  apoio: 'smash burger',
  razao: 'Amassa Lanches Ltda.', // [EXEMPLO]
  cnpj: '00.000.000/0001-00', // [EXEMPLO] fictício
  desde: 2019,
  endereco: 'Rua da República, 377', // [EXEMPLO] número fictício
  bairro: 'Cidade Baixa',
  cidade: 'Porto Alegre',
  uf: 'RS',
  cep: '90050-321',
  referencia: 'Quase na esquina com a Sarmento Leite',
  telefone: '(51) 3333-0000', // [EXEMPLO]
  whatsapp: '(51) 99999-9999', // [EXEMPLO]
  email: 'oi@amassaburger.com.br', // [EXEMPLO]
  instagram: 'amassaburger', // [EXEMPLO]
  dominio: 'https://amassaburger.com.br', // [EXEMPLO]
  nota: 4.9, // [EXEMPLO]
  avaliacoes: 3180, // [EXEMPLO]
  ifood: 'https://www.ifood.com.br/', // [EXEMPLO] link da loja no iFood
  food99: 'https://food.99app.com/', // [EXEMPLO] link da loja no 99Food
  coordenadas: [-30.03878, -51.22359],
};

// 0 = domingo. Turnos [abre, fecha] em horas; passar de 24 quer dizer madrugada do dia seguinte (25 = 1h).
const horario = [
  { turnos: [[11.5, 22]] },
  { turnos: [] },
  { turnos: [[18, 23]] },
  { turnos: [[18, 23]] },
  { turnos: [[18, 23.5]] },
  { turnos: [[11.5, 15], [18, 25]] },
  { turnos: [[11.5, 25]] },
];

// ---------- cardápio por segmento ----------
const segmentos = [
  { id: 'smash', nome: 'Smash', foto: 'chapa-prensa', texto: 'Bolinha de 80 g de acém com peito, prensada na chapa a 260 graus até a borda ficar renda. Sempre no pão de batata selado na manteiga.' },
  { id: 'frango', nome: 'Frango crocante', foto: 'frango-mao', texto: 'Sobrecoxa marinada no leitelho por uma noite e empanada duas vezes. Crocante de ouvir do outro lado do balcão.' },
  { id: 'fritas', nome: 'Fritas e porções', foto: 'fritas-cheddar', texto: 'Batata cortada na casa e frita duas vezes, anéis de cebola na hora e os molhos da casa para afundar.' },
  { id: 'shakes', nome: 'Shakes', foto: 'shake-flocos', texto: 'Sorvete de creme feito aqui, batido grosso de canudo ficar em pé. Com calda e cobertura da casa.' },
  { id: 'combos', nome: 'Combos', foto: 'bandeja-combo', texto: 'Lanche, fritas e bebida por um preço só. Para um, para dois ou para a turma inteira.' },
];

// min: tempo de preparo depois do pedido; tags: picante, veg, novo, maisPedido
const pratos = [
  { id: 'classico', seg: 'smash', nome: 'Clássico', peso: '1 carne de 80 g', inclui: 'Carne prensada, queijo prato derretido, picles da casa, cebola picada e molho Amassa no pão de batata.', min: 8, preco: 29, foto: 'smash-classico' },
  { id: 'duplo', seg: 'smash', nome: 'Duplo da casa', peso: '2 carnes de 80 g', inclui: 'Duas carnes com crosta, dois queijos, picles, cebola e molho Amassa. O que mais sai da chapa.', min: 9, preco: 38, foto: 'smash-duplo', tags: ['maisPedido'] },
  { id: 'sem-do', seg: 'smash', nome: 'Sem dó', peso: '3 carnes de 80 g', inclui: 'Três carnes, três queijos, bacon em tiras e cebola na chapa. Para quem chegou com fome de verdade.', min: 10, preco: 47, foto: 'smash-triplo' },
  { id: 'melado', seg: 'smash', nome: 'Bacon com melado', peso: '2 carnes de 80 g', inclui: 'Bacon caramelizado no melado de cana, queijo cheddar, cebola crispy e maionese de alho assado.', min: 10, preco: 42, foto: 'smash-bacon', tags: ['novo'] },
  { id: 'afogado', seg: 'smash', nome: 'Afogado', peso: '2 carnes de 80 g', inclui: 'Duplo coberto com cheddar cremoso da casa e farofa de bacon por cima. Venha de guardanapo.', min: 9, preco: 44, foto: 'smash-afogado' },
  { id: 'salada', seg: 'smash', nome: 'Duplo salada', peso: '2 carnes de 80 g', inclui: 'Duas carnes, queijo prato, alface americana, tomate, cebola roxa e maionese verde.', min: 9, preco: 39, foto: 'smash-salada' },
  { id: 'cebola', seg: 'smash', nome: 'Cebola prensada', peso: '2 carnes de 80 g', inclui: 'A cebola em lâmina vai prensada junto com a carne e caramela na gordura. Queijo prato e mostarda.', min: 10, preco: 39 },
  { id: 'grao', seg: 'smash', nome: 'Smash de grão', peso: '2 discos de 90 g', inclui: 'Disco de grão-de-bico e cogumelo prensado na chapa, queijo prato, picles e maionese verde.', min: 9, preco: 36, tags: ['veg'] },

  { id: 'crocante', seg: 'frango', nome: 'Crocante clássico', peso: '1 sobrecoxa', inclui: 'Sobrecoxa empanada, repolho na maionese, picles e molho de mel com mostarda.', min: 12, preco: 34, foto: 'frango-crocante' },
  { id: 'ardido', seg: 'frango', nome: 'Ardido', peso: '1 sobrecoxa', inclui: 'Frango crocante pincelado no óleo de pimenta da casa, cheddar e maionese de limão para apagar o fogo.', min: 12, preco: 36, foto: 'frango-ardido', tags: ['picante'] },
  { id: 'frango-cheddar', seg: 'frango', nome: 'Frango com queijo', peso: '1 sobrecoxa', inclui: 'Sobrecoxa crocante, queijo prato derretido, alface, tomate e maionese verde no pão de batata.', min: 12, preco: 35, foto: 'frango-mao' },
  { id: 'tiras', seg: 'frango', nome: 'Tiras crocantes', peso: '6 tiras', inclui: 'Tiras de peito empanadas na hora com dois molhos à escolha. Boas para dividir ou para a criançada.', min: 10, preco: 32 },

  { id: 'fritas', seg: 'fritas', nome: 'Fritas da casa', peso: '300 g', inclui: 'Batata com casca cortada aqui, frita duas vezes e salpicada com sal de páprica.', min: 8, preco: 19, foto: 'fritas-ketchup', tags: ['veg'] },
  { id: 'fritas-cheddar', seg: 'fritas', nome: 'Fritas com cheddar e bacon', peso: '400 g', inclui: 'As fritas da casa cobertas com cheddar cremoso e farofa de bacon.', min: 9, preco: 29, foto: 'fritas-cheddar', tags: ['maisPedido'] },
  { id: 'aneis', seg: 'fritas', nome: 'Anéis de cebola', peso: '12 anéis', inclui: 'Cebola em rodelas grossas empanada na cerveja, com maionese de mostarda.', min: 9, preco: 24, foto: 'aneis', tags: ['veg'] },
  { id: 'fritas-queijo', seg: 'fritas', nome: 'Fritas com parmesão', peso: '300 g', inclui: 'Fritas da casa com parmesão ralado na hora, alho frito e salsinha.', min: 8, preco: 25, foto: 'fritas-queijo', tags: ['veg'] },
  { id: 'molhos', seg: 'fritas', nome: 'Molhos da casa', peso: 'potinho de 40 ml', inclui: 'Molho Amassa, maionese de alho, maionese verde, mel com mostarda, barbecue de goiabada e pimenta da casa.', min: 1, preco: 4, de: true, tags: ['veg'] },

  { id: 'shake-flocos', seg: 'shakes', nome: 'Chocolate com flocos', peso: '400 ml', inclui: 'Sorvete de creme, chocolate meio amargo e flocos crocantes por cima e por dentro.', min: 5, preco: 24, foto: 'shake-flocos', tags: ['maisPedido'] },
  { id: 'shake-morango', seg: 'shakes', nome: 'Morango de verdade', peso: '400 ml', inclui: 'Morango fresco batido com sorvete de creme, calda de morango e chantili.', min: 5, preco: 25, foto: 'shake-morango' },
  { id: 'shake-doce', seg: 'shakes', nome: 'Baunilha com doce de leite', peso: '400 ml', inclui: 'Sorvete de baunilha com doce de leite de tacho e uma pitada de flor de sal.', min: 5, preco: 24, foto: 'shake-baunilha' },
  { id: 'shake-choco', seg: 'shakes', nome: 'Chocolatudo', peso: '500 ml', inclui: 'Chocolate ao leite, brownie picado no meio e chantili com raspas. Dá para dois.', min: 6, preco: 29, foto: 'shake-chocolate' },
  { id: 'bebidas', seg: 'shakes', nome: 'Refri, suco e água', peso: 'lata ou garrafa', inclui: 'Refrigerantes em lata, limonada da casa, chá gelado de hibisco e água com e sem gás.', min: 1, preco: 7, de: true },

  { id: 'combo-amassa', seg: 'combos', nome: 'Combo Amassa', peso: 'para 1', inclui: 'Duplo da casa, fritas da casa e um refri ou limonada.', min: 10, preco: 52, foto: 'combo-caixa', tags: ['maisPedido'] },
  { id: 'combo-dupla', seg: 'combos', nome: 'Combo dupla', peso: 'para 2', inclui: 'Dois duplos à escolha, fritas com cheddar e bacon e dois shakes de 400 ml.', min: 12, preco: 129, foto: 'combo-mesa' },
  { id: 'combo-turma', seg: 'combos', nome: 'Combo turma', peso: 'para 4', inclui: 'Quatro smash à escolha, duas fritas da casa, anéis de cebola e quatro bebidas.', min: 15, preco: 189, foto: 'bandeja-combo' },
  { id: 'combo-kids', seg: 'combos', nome: 'Combo pequeno', peso: 'até 10 anos', inclui: 'Clássico ou tiras crocantes, fritas pequenas, suco e um adesivo da casa.', min: 8, preco: 32 },
];

const tagsNome = { picante: 'Ardido', veg: 'Vegetariano', novo: 'Novo', maisPedido: 'Mais pedido' };

// ---------- o que se agenda (serviços) ----------
const servicos = [
  { id: 'aniversario', nome: 'Aniversário na Amassa', inclui: 'Mesa comprida para até 30 pessoas, um combo por convidado, shake com vela para quem faz aniversário e bolo liberado sem taxa.', min: 180, preco: 64, de: false, pessoas: [8, 30], prof: ['bia', 'lu'], foto: 'festa-aniversario', turnos: 'festa', sensivel: true },
  { id: 'oficina', nome: 'Oficina de smash', inclui: 'Uma hora e meia atrás do balcão com o chapeiro: você aprende a bolear, prensar e montar o seu burger e come o que fez. Avental de presente.', min: 90, preco: 89, pessoas: [2, 8], prof: ['tiago', 'carol'], foto: 'chapa-espatula', turnos: 'oficina', destaque: true },
  { id: 'evento', nome: 'Chapa no seu evento', inclui: 'A nossa chapa vai até você no carrinho da Amassa: smash, fritas e shakes à vontade por quatro horas, com equipe, montagem e limpeza.', min: 240, preco: 42, de: true, pessoas: [50, 300], prof: ['bia', 'tiago'], foto: 'evento-truck', turnos: 'evento', sinal: true, sensivel: true },
  { id: 'retirada', nome: 'Retirada agendada para grupo', inclui: 'Pedido a partir de dez lanches com hora marcada: tudo sai junto, embalado por nome e quentinho no balcão.', min: 30, preco: 0, pessoas: [10, 80], prof: ['rafa'], foto: 'combo-caixa', turnos: 'todos' },
  { id: 'mesa', nome: 'Mesa para a turma', inclui: 'Reserva de mesa para grupos de 6 a 16 pessoas, no salão ou no balcão. O resto do salão é por ordem de chegada.', min: 120, preco: 0, pessoas: [6, 16], prof: ['rafa', 'bia'], foto: 'amigos-mesa', turnos: 'todos' },
];

const pagamento = 'Pix, cartões de débito e crédito, vale-refeição e vale-alimentação. Nas festas e na chapa no evento, sinal de 30% por Pix e o restante no dia.';
const aPartir = 'Na chapa no seu evento, o valor por pessoa cai conforme o número de convidados e o cardápio escolhido. Molhos e bebidas variam com o item.';

// ---------- equipe ----------
const equipe = [
  { id: 'carol', nome: 'Carolina Brum', cargo: 'Chef e sócia', esp: 'Receitas da casa, molhos e o pão de batata', anos: 14, foto: 'carol', formacao: 'Gastronomia pela UCS, estágio em hamburguerias de São Paulo e de Buenos Aires', bio: 'Abriu a Amassa em 2019 num corredor de 30 metros quadrados com uma chapa usada e uma ideia fixa: o burger bom é o que tem crosta. Testou o molho Amassa quarenta vezes até ele ficar igual ao da memória.', faz: ['oficina'], dias: { 2: 'Noite', 3: 'Noite', 5: 'Almoço e noite', 6: 'Almoço e noite' } },
  { id: 'tiago', nome: 'Tiago Kuhn', cargo: 'Chapeiro-chefe', esp: 'Ponto da crosta, prensa e as oficinas de smash', anos: 9, foto: 'tiago', formacao: 'Cozinheiro pelo Senac RS, passagem por food trucks de Porto Alegre e Florianópolis', bio: 'É quem decide quando a carne vira. Já passou de dez mil burgers prensados e ensina o movimento da espátula nas oficinas de sábado.', faz: ['oficina', 'evento'], dias: { 3: 'Noite', 4: 'Noite', 5: 'Noite', 6: 'Almoço e noite', 0: 'Almoço' } },
  { id: 'lu', nome: 'Luana Sá', cargo: 'Shakes e sobremesas', esp: 'Sorvete da casa, caldas e o shake com vela', anos: 7, foto: 'lu', formacao: 'Confeitaria pelo Senac RS, curso de sorvete artesanal em Gramado', bio: 'Faz o sorvete de creme toda manhã e inventa um shake novo por mês. O doce de leite de tacho vem da receita da avó dela, de Bagé.', faz: ['aniversario'], dias: { 2: 'Noite', 4: 'Noite', 5: 'Noite', 6: 'Almoço e noite', 0: 'Almoço' } },
  { id: 'rafa', nome: 'Rafael Pires', cargo: 'Balcão e delivery', esp: 'Pedidos grandes, retirada agendada e a fila andando', anos: 6, foto: 'rafa', formacao: 'Técnico em administração, cinco anos em atendimento de lanchonete', bio: 'Comanda o balcão e os aplicativos. Sabe o pedido de metade do bairro de cabeça e organiza as retiradas de grupo para tudo sair junto.', faz: ['retirada', 'mesa'], dias: { 2: 'Noite', 3: 'Noite', 4: 'Noite', 5: 'Almoço e noite', 6: 'Noite' } },
  { id: 'bia', nome: 'Beatriz Nascimento', cargo: 'Festas e eventos', esp: 'Aniversários, confraternizações e o carrinho da Amassa', anos: 11, foto: 'bia', formacao: 'Produção de eventos pela PUCRS', bio: 'Monta as festas no salão e leva o carrinho da Amassa para casamentos, formaturas e eventos de empresa. Cuida de tudo, da lista de convidados à limpeza.', faz: ['aniversario', 'evento', 'mesa'], dias: { 3: 'Noite', 4: 'Noite', 5: 'Almoço e noite', 6: 'Almoço e noite', 0: 'Almoço' } },
];

// ---------- carrossel de polaroides (feito pra dividir) ----------
const polaroides = [
  { foto: 'mordida', leg: 'primeira mordida' },
  { foto: 'amigos-mesa', leg: 'turma de sexta' },
  { foto: 'smash-afogado', leg: 'mais queijo, por favor' },
  { foto: 'mesa-cima', leg: 'cada um pega o seu' },
];

// ---------- como a chapa funciona ----------
const chapa = [
  { titulo: 'Bolinha', texto: 'Carne moída no dia, boleada sem apertar e sem tempero até chegar na chapa.' },
  { titulo: 'Prensa', texto: 'Chapa a 260 graus e a prensa desce com força nos primeiros dez segundos. Depois, ninguém mexe.' },
  { titulo: 'Crosta', texto: 'A borda frita na própria gordura e vira renda. O sal entra só agora.' },
  { titulo: 'Queijo e pão', texto: 'O queijo derrete com a tampa e o pão de batata sela na manteiga ao lado.' },
];

// ---------- galeria por categoria ----------
const categorias = [['burgers', 'Burgers'], ['chapa', 'Na chapa'], ['shakes', 'Shakes e fritas'], ['salao', 'O salão'], ['festas', 'Festas']];
const galeria = [
  { foto: 'smash-duplo', cat: 'burgers', leg: 'Duplo da casa saindo da chapa' },
  { foto: 'chapa-prensa', cat: 'chapa', leg: 'A prensa descendo nas bolinhas' },
  { foto: 'shake-flocos', cat: 'shakes', leg: 'Chocolate com flocos' },
  { foto: 'salao-xadrez', cat: 'salao', leg: 'O salão com o piso xadrez' },
  { foto: 'festa-aniversario', cat: 'festas', leg: 'Aniversário na mesa comprida' },
  { foto: 'smash-afogado', cat: 'burgers', leg: 'O Afogado no cheddar' },
  { foto: 'chapa-espatula', cat: 'chapa', leg: 'Espátula virando a crosta' },
  { foto: 'fritas-cheddar', cat: 'shakes', leg: 'Fritas com cheddar e bacon' },
  { foto: 'balcao', cat: 'salao', leg: 'O balcão de banquetas' },
  { foto: 'evento-truck', cat: 'festas', leg: 'O carrinho num evento de rua' },
  { foto: 'smash-triplo', cat: 'burgers', leg: 'O Sem dó, com três carnes' },
  { foto: 'chapeiro', cat: 'chapa', leg: 'Sexta à noite na chapa' },
  { foto: 'shake-morango', cat: 'shakes', leg: 'Morango de verdade' },
  { foto: 'atendimento', cat: 'salao', leg: 'Pedido chegando na mesa' },
  { foto: 'amigos-mesa', cat: 'festas', leg: 'Turma reunida no salão' },
  { foto: 'smash-bacon', cat: 'burgers', leg: 'Bacon com melado' },
  { foto: 'chapa-montagem', cat: 'chapa', leg: 'Montagem na bandeja' },
  { foto: 'aneis', cat: 'shakes', leg: 'Anéis de cebola com mostarda' },
  { foto: 'mesa-cima', cat: 'salao', leg: 'A mesa vista de cima' },
  { foto: 'frango-crocante', cat: 'burgers', leg: 'Crocante clássico' },
];

// ---------- depoimentos ----------
const depoimentos = [
  { nome: 'Júlia Becker', quando: 'há 1 semana', texto: 'A crosta do Duplo da casa é outra coisa. Fina, crocante, com o queijo escorrendo. Melhor smash de Porto Alegre e não é exagero.' },
  { nome: 'Diego Fontoura', quando: 'há 3 semanas', texto: 'Fiz a oficina de smash com meu filho e foi o sábado mais legal do ano. O Tiago tem uma paciência enorme e o burger que a gente fez ficou bom.' },
  { nome: 'Marina Kessler', quando: 'há 1 mês', texto: 'Aniversário de 30 pessoas no salão. Liberaram o bolo, o shake com vela fez sucesso e a Bia resolveu tudo pelo WhatsApp.' },
  { nome: 'Henrique Lopes', quando: 'há 1 mês', texto: 'Peço pelo app toda semana e chega quente, com a fritas crocante. O Ardido tem a pimenta na medida.' },
  { nome: 'Fernanda Rocha', quando: 'há 2 meses', texto: 'Levamos o carrinho da Amassa para a festa da empresa e virou o assunto da semana. 180 pessoas e ninguém ficou esperando.' },
  { nome: 'Lucas Martins', quando: 'há 3 meses', texto: 'O shake de baunilha com doce de leite é perigoso. Vou toda sexta e já sabem meu pedido.' },
];

// ---------- Instagram (perfil fictício) ----------
const instagram = {
  usuario: marca.instagram,
  seguidores: '38,4 mil', // [EXEMPLO]
  publicacoes: 527, // [EXEMPLO]
  posts: [
    { foto: 'chapa-prensa', texto: 'Dez segundos de prensa e ninguém mexe.', curtidas: 3421 },
    { foto: 'shake-flocos', texto: 'Shake do mês: chocolate com flocos.', curtidas: 2104 },
    { foto: 'smash-afogado', texto: 'O Afogado voltou e veio com mais cheddar.', curtidas: 4012 },
    { foto: 'mordida', texto: 'Primeira mordida de sexta.', curtidas: 2788 },
    { foto: 'salao-xadrez', texto: 'Piso novo, mesma chapa.', curtidas: 1650 },
    { foto: 'fritas-cheddar', texto: 'Fritas para afundar no cheddar.', curtidas: 2931 },
  ],
};

// ---------- números da casa ----------
const numeros = [
  [new Date().getFullYear() - marca.desde, 'anos prensando na Cidade Baixa'],
  [80, 'gramas em cada bolinha de carne'],
  [260, 'graus na chapa quando a carne cai'],
  [6, 'molhos feitos aqui todo dia'],
];

// ---------- políticas ----------
const politicas = [
  { id: 'agendamento', titulo: 'Agendamento', texto: 'Festas, oficinas, mesas para grupo e retiradas agendadas pelo site ou WhatsApp. Mesas e retiradas confirmam na hora; festas, oficinas e a chapa no evento recebem a confirmação da Bia em até 4 horas, no horário de funcionamento.' },
  { id: 'atraso', titulo: 'Atraso', texto: 'A mesa da turma fica guardada por 15 minutos. Na oficina, a chapa espera 10 minutos e depois a aula começa. Na retirada agendada, o pedido fica no balcão por 20 minutos dentro da caixa térmica.' },
  { id: 'cancelamento', titulo: 'Cancelamento e remarcação', texto: 'Mesas e retiradas: cancele ou remarque sem custo até 2 horas antes. Oficina: até 24 horas antes. Festas e chapa no evento: o sinal de 30% volta até 7 dias antes; depois disso vira crédito por 90 dias para remarcar.' },
  { id: 'falta', titulo: 'Não comparecimento', texto: 'Sem aviso, a reserva cai depois da tolerância e a retirada agendada é cobrada. Duas faltas sem aviso suspendem os agendamentos online por 90 dias.' },
  { id: 'garantia', titulo: 'Garantia do lanche', texto: 'Se o lanche chegou frio, montado errado ou diferente do cardápio, a chapa refaz na hora, sem custo. No delivery, mande uma foto pelo WhatsApp em até 1 hora e a gente reenvia ou devolve o valor.' },
  { id: 'menores', titulo: 'Crianças e oficina', texto: 'A oficina de smash aceita crianças a partir de 8 anos, sempre com um adulto inscrito junto. Na chapa, quem prensa usa luva térmica e avental, e o chapeiro fica do lado o tempo todo.' },
];

const sensivel = {
  titulo: 'Alergias, ponto da carne e eventos',
  texto: 'A cozinha trabalha com glúten, leite, ovos, soja, gergelim e amendoim, e a chapa é a mesma para todos os lanches. Avise no pedido e de novo no balcão.',
  itens: [
    'O smash sai sempre bem passado: carne moída e prensada fina não tem ponto, por segurança.',
    'Fritas, anéis e frango passam pela mesma fritadeira. Para alergia grave, a gente avisa antes que não dá para garantir separação.',
    'O pão de batata leva leite e ovo. Para intolerância à lactose, troque por pão sem lactose e peça sem queijo.',
    'Festas e a chapa no evento: restrições alimentares e quantidade de lanches vegetarianos precisam ser informadas com 72 horas de antecedência.',
  ],
};

// ---------- dúvidas ----------
const duvidas = [
  ['O que é smash burger?', 'É o burger feito de bolinha de carne prensada com força na chapa bem quente. A carne fica fina, a borda frita na própria gordura e vira uma crosta crocante. Por isso a gente usa duas carnes de 80 g em vez de uma grossa.'],
  ['Dá para pedir a carne mal passada?', 'Não. No smash a carne é moída e prensada fina, então sai sempre bem passada, por segurança. O suco fica dentro da crosta.'],
  ['Precisa reservar mesa?', 'Para até 5 pessoas, não: o salão é por ordem de chegada. Para turmas de 6 a 16, reserve a Mesa para a turma e a gente separa o espaço.'],
  ['Tem opção vegetariana?', 'Tem o Smash de grão, de grão-de-bico com cogumelo, e quase todas as fritas e porções. Peça também o frango trocado pelo disco de grão em qualquer lanche.'],
  ['Como funciona a oficina de smash?', 'Sábado às 15h, antes de abrir o salão, para 2 a 8 pessoas. O Tiago ensina a bolear, prensar e montar, cada um faz e come o seu burger, com fritas e um shake. Crianças a partir de 8 anos, com um adulto.'],
  ['Vocês entregam?', 'Pelo iFood e pelo 99Food em boa parte de Porto Alegre, e direto pelo WhatsApp nos bairros perto, por R$ 8. Retirada no balcão sem taxa.'],
  ['Posso levar bolo no aniversário?', 'Pode, sem taxa. A gente guarda, serve na hora combinada e o aniversariante ganha o shake com vela.'],
  ['Aceitam vale-refeição?', 'Sim, os principais vales-refeição e vales-alimentação, além de Pix e cartões.'],
];

const bairros = ['Cidade Baixa', 'Menino Deus', 'Bom Fim', 'Centro Histórico', 'Farroupilha', 'Azenha', 'Santana', 'Rio Branco'];

const fotos = {
  'capa': 'Smash burger duplo com bacon e queijo escorrendo, visto de perto',
  'smash-classico': 'Smash burger com várias carnes e queijo no fundo escuro',
  'smash-duplo': 'Duplo com queijo derretido no pão de batata',
  'smash-triplo': 'Burger alto com três carnes, queijo e bacon',
  'smash-bacon': 'Smash com bacon caramelizado, queijo e cebola sobre papel xadrez',
  'smash-afogado': 'Burger coberto de cheddar cremoso com farofa de bacon',
  'smash-salada': 'Duplo salada com alface, tomate e cebola roxa',
  'frango-crocante': 'Sanduíche de frango crocante com fritas ao lado',
  'frango-ardido': 'Mão segurando um sanduíche de frango crocante com molho',
  'frango-mao': 'Sanduíche de frango crocante com queijo e repolho seguro na mão',
  'fritas-cheddar': 'Fritas cobertas de cheddar sendo regadas',
  'fritas-ketchup': 'Fritas com queijo ralado e potinho de ketchup',
  'fritas-queijo': 'Fritas crocantes com parmesão ralado',
  'aneis': 'Anéis de cebola empanados com potinho de mostarda',
  'shake-flocos': 'Shake de chocolate com flocos caindo, em copo com tampa',
  'shake-morango': 'Shake de morango com calda e morangos frescos',
  'shake-baunilha': 'Shake de baunilha em copo alto com chantili',
  'shake-chocolate': 'Shake de chocolate com chantili e bombons',
  'combo-caixa': 'Burgers e fritas em caixas de papel vistos de cima',
  'combo-mesa': 'Bandeja com burgers, fritas e nuggets sobre a mesa',
  'bandeja-combo': 'Mãos pegando burgers e fritas de uma bandeja',
  'chapa-prensa': 'Prensa de smash amassando bolinhas de carne na chapa',
  'chapa-espatula': 'Espátula virando a carne com crosta na chapa',
  'chapa-montagem': 'Burgers montados em bandejas de metal na cozinha',
  'chapeiro': 'Chapeiro de boné preparando burgers na chapa',
  'mordida': 'Mulher dando uma mordida grande num burger',
  'amigos-mesa': 'Amigas rindo e comendo burgers no salão',
  'mesa-cima': 'Mesa vista de cima com quatro pessoas segurando burgers',
  'atendimento': 'Atendente servindo burgers para clientes na mesa',
  'salao-xadrez': 'Salão retrô com piso xadrez e balcão colorido',
  'balcao': 'Balcão comprido de lanchonete com banquetas',
  'festa-aniversario': 'Amigos comemorando aniversário com bolo e balões na mesa',
  'evento-truck': 'Carrinho de comida verde-água numa praça com gente passando',
  'carol': 'Carolina Brum, chef, de avental de couro na cozinha',
  'tiago': 'Tiago Kuhn, chapeiro, de boné e avental laranja',
  'lu': 'Luana Sá, de avental marrom, sorrindo em frente à parede de tijolos brancos',
  'rafa': 'Rafael Pires, de camiseta azul e avental bege no balcão',
  'bia': 'Beatriz Nascimento, de camiseta branca e avental, sorrindo na porta do salão',
};

module.exports = { marca, horario, segmentos, pratos, tagsNome, servicos, pagamento, aPartir, equipe, polaroides, chapa, categorias, galeria, depoimentos, instagram, numeros, politicas, sensivel, duvidas, bairros, fotos };
