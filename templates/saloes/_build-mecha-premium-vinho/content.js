// Conteúdo do Mecha Premium Vinho: o lado salão da marca fictícia Mecha (a mesma empresa dos Standards do nicho),
// com a estrutura da referência pedida (Salonix, feita no Framer) e a camada cinematográfica dos modelos Premium.
// Trocar aqui textos, preços, equipe, horários e fotos e rodar o build.

const marca = {
  nome: 'Mecha',
  completo: 'Mecha Salão',
  casa: 'Mecha Salão & Barbearia',
  razao: 'Mecha Beleza e Barbearia Ltda.',
  cnpj: '00.000.000/0001-00', // [EXEMPLO] fictício
  endereco: 'Rua Harmonia, 512',
  bairro: 'Vila Madalena',
  cidade: 'São Paulo',
  uf: 'SP',
  cep: '05435-000',
  telefone: '(11) 3031-4826',
  whatsapp: '(11) 97315-2640',
  email: 'salao@mechasalao.com.br',
  facebook: 'https://facebook.com/mecha.salao',
  tiktok: 'https://tiktok.com/@mecha.salao',
  dominio: 'https://mechasalao.com.br/salao',
  referencia: 'A quatro quadras do metrô Vila Madalena',
  estacionamento: 'Estacionamento conveniado na Rua Fidalga, 1h grátis',
  nota: 4.9,
  avaliacoes: 860,
  desde: 2017,
};

// horário por dia da semana (0 = domingo)
const horario = [
  { aberto: false, abre: '09:00', fecha: '18:00' },
  { aberto: false, abre: '09:00', fecha: '18:00' },
  { aberto: true, abre: '09:00', fecha: '19:00' },
  { aberto: true, abre: '09:00', fecha: '19:00' },
  { aberto: true, abre: '09:00', fecha: '21:00' },
  { aberto: true, abre: '09:00', fecha: '21:00' },
  { aberto: true, abre: '09:00', fecha: '18:00' },
];

// segmentos: cada um vira um cartão da sanfona de serviços, uma aba em servicos.html e uma categoria da galeria
// etapas = o caminho do atendimento, mostrado em etiquetas no cartão aberto
const segmentos = [
  { id: 'corte', nome: 'Corte e escova', curto: 'Corte e escova', foto: 'corte-longo', apoio: 'Corte e finalização',
    texto: 'Corte desenhado para o formato do seu rosto, a textura do fio e o tempo que você tem para arrumar o cabelo de manhã.', etapas: ['Conversa', 'Corte', 'Escova'] },
  { id: 'cor', nome: 'Cor e mechas', curto: 'Cor', foto: 'ondas-loiras', apoio: 'Coloração',
    texto: 'Mechas à mão livre, balayage e cor de raiz com teste de mecha antes. O valor final sai antes de abrir o primeiro pote.', etapas: ['Diagnóstico', 'Clareamento', 'Tonalização'] },
  { id: 'cachos', nome: 'Cachos e tranças', curto: 'Cachos e tranças', foto: 'cachos-sorriso', apoio: 'Textura natural',
    texto: 'Corte a seco cacho por cacho, finalização que você repete em casa e tranças box braids feitas pela Júlia.', etapas: ['Leitura do cacho', 'Corte a seco', 'Difusor'] },
  { id: 'tratamentos', nome: 'Tratamentos', curto: 'Tratamentos', foto: 'lavatorio-espuma', apoio: 'Saúde do fio',
    texto: 'Hidratação, reconstrução e alinhamento sem formol, com produtos de registro na Anvisa e vapor no lavatório.', etapas: ['Lavagem', 'Máscara', 'Selagem'] },
  { id: 'penteados', nome: 'Penteados e noivas', curto: 'Penteados', foto: 'noiva-ondas', apoio: 'Dias especiais',
    texto: 'Prova do penteado antes do grande dia, preso, semipreso ou solto, e atendimento no salão ou no local da festa.', etapas: ['Prova', 'Penteado', 'Retoque'] },
  { id: 'unhas', nome: 'Unhas, sobrancelha e maquiagem', curto: 'Unhas e rosto', foto: 'sorriso-ondas', apoio: 'Acabamento',
    texto: 'Alicate esterilizado em autoclave, design de sobrancelha que respeita o seu desenho e maquiagem para festa.', etapas: ['Preparo', 'Aplicação', 'Acabamento'] },
];

// serviços: min = duração; de = preço "a partir de"; quimica = pede teste de mecha ou de sensibilidade antes
const servicos = [
  { id: 'corte', seg: 'corte', nome: 'Corte feminino', inclui: 'Conversa no espelho, lavagem, corte e finalização simples.', min: 60, preco: 120, de: true },
  { id: 'corte-escova', seg: 'corte', nome: 'Corte e escova longa', inclui: 'Para cabelo abaixo do ombro: corte em camadas e escova modelada.', min: 90, preco: 165, de: true },
  { id: 'escova', seg: 'corte', nome: 'Escova modelada', inclui: 'Lavagem, protetor térmico e ondas com escova redonda ou babyliss.', min: 60, preco: 95, de: true, destaque: true },
  { id: 'franja', seg: 'corte', nome: 'Franja e pontas', inclui: 'Acerto da franja ou só das pontas, sem lavagem.', min: 20, preco: 45 },
  { id: 'raiz', seg: 'cor', nome: 'Coloração de raiz', inclui: 'Teste de mecha, cor na raiz até 3 cm, lavagem e secagem.', min: 90, preco: 180, de: true, quimica: true },
  { id: 'mechas', seg: 'cor', nome: 'Mechas e balayage', inclui: 'Diagnóstico, clareamento à mão livre, tonalização e escova.', min: 240, preco: 480, de: true, quimica: true, destaque: true },
  { id: 'gloss', seg: 'cor', nome: 'Tonalização (gloss)', inclui: 'Corrige o tom e devolve o brilho entre uma mecha e outra.', min: 60, preco: 150, de: true, quimica: true },
  { id: 'cacho-corte', seg: 'cachos', nome: 'Corte a seco para cachos', inclui: 'Corte cacho por cacho com o cabelo seco, lavagem e finalização com difusor.', min: 90, preco: 170, de: true },
  { id: 'cacho-final', seg: 'cachos', nome: 'Finalização de cachos', inclui: 'Lavagem, creme e gel na medida do seu fio e secagem com difusor.', min: 60, preco: 90, de: true },
  { id: 'trancas', seg: 'cachos', nome: 'Box braids', inclui: 'Tranças soltas com fibra hipoalergênica, do comprimento que você escolher.', min: 300, preco: 420, de: true },
  { id: 'hidratacao', seg: 'tratamentos', nome: 'Hidratação e escova', inclui: 'Máscara de tratamento com vapor e escova no fim.', min: 75, preco: 140, de: true },
  { id: 'reconstrucao', seg: 'tratamentos', nome: 'Reconstrução', inclui: 'Para fio quebradiço depois de química ou descoloração.', min: 60, preco: 130 },
  { id: 'alinhamento', seg: 'tratamentos', nome: 'Alinhamento sem formol', inclui: 'Teste de mecha, produto com registro na Anvisa e escova de selagem.', min: 180, preco: 350, de: true, quimica: true },
  { id: 'penteado', seg: 'penteados', nome: 'Penteado para evento', inclui: 'Prova da ideia por foto antes do dia, preso ou semipreso.', min: 90, preco: 180, de: true },
  { id: 'noiva', seg: 'penteados', nome: 'Noiva: prova e dia', inclui: 'Prova completa uma semana antes, penteado no dia e kit de retoque.', min: 240, preco: 950, de: true },
  { id: 'manicure', seg: 'unhas', nome: 'Pé e mão', inclui: 'Manicure e pedicure na mesma visita, com escalda-pés.', min: 90, preco: 85 },
  { id: 'gel', seg: 'unhas', nome: 'Esmaltação em gel', inclui: 'Preparo da unha, gel em três camadas e cabine de secagem.', min: 60, preco: 110 },
  { id: 'design', seg: 'unhas', nome: 'Design de sobrancelha', inclui: 'Mapeamento do rosto e limpeza na pinça, sem afinar o desenho natural.', min: 30, preco: 55 },
  { id: 'maquiagem', seg: 'unhas', nome: 'Maquiagem social', inclui: 'Pele, olhos e boca para festa ou formatura. Cílios postiços inclusos.', min: 60, preco: 180, de: true },
];

// equipe: dias = agenda por dia da semana com [entrada, saída] em horas; faz = segmentos que atende
// Carla, Beatriz, Larissa e Renata são as mesmas pessoas dos outros modelos do salão.
const equipe = [
  { id: 'carla', nome: 'Carla Menezes', cargo: 'Colorista e responsável técnica', esp: 'Mechas, balayage e correção de cor', anos: 12, foto: 'carla', faz: ['cor', 'tratamentos'],
    bio: 'Começou lavando cabelo num salão da Pompeia e hoje cuida de toda a química da casa. Guarda a fórmula de cor de cada cliente e é quem decide quando um fio não aguenta mais um clareamento.',
    dias: { 2: [10, 19], 3: [10, 19], 4: [10, 21], 5: [10, 21], 6: [9, 17] } },
  { id: 'beatriz', nome: 'Beatriz Alves', cargo: 'Cabeleireira', esp: 'Cortes em camadas e escova', anos: 9, foto: 'beatriz', faz: ['corte', 'cachos', 'tratamentos'],
    bio: 'Corta pensando em como o cabelo vai ficar na terceira lavagem, não só na saída do salão. É a especialista da casa em corte a seco para cachos.',
    dias: { 2: [9, 18], 3: [9, 18], 4: [12, 21], 5: [12, 21], 6: [9, 18] } },
  { id: 'julia', nome: 'Júlia Prado', cargo: 'Trancista e especialista em cachos', esp: 'Box braids, tranças nagô e finalização', anos: 10, foto: 'trancista', faz: ['cachos'],
    bio: 'Aprendeu a trançar com a avó e transformou isso em ofício. Faz cada trança no tamanho combinado e ensina como lavar e cuidar até a retirada.',
    dias: { 3: [9, 19], 4: [9, 19], 5: [9, 21], 6: [9, 18] } },
  { id: 'paula', nome: 'Paula Nunes', cargo: 'Penteados e noivas', esp: 'Penteados presos, ondas e prova de noiva', anos: 11, foto: 'escova-janela', faz: ['penteados', 'corte'],
    bio: 'Atende noivas, madrinhas e formandas e não deixa ninguém sair sem testar o penteado antes. Leva o kit de retoque para a festa quando o atendimento é no local.',
    dias: { 2: [10, 19], 4: [10, 21], 5: [10, 21], 6: [8, 18] } },
  { id: 'larissa', nome: 'Larissa Ramos', cargo: 'Manicure e nail designer', esp: 'Esmaltação em gel e unhas curtas', anos: 7, foto: 'larissa', faz: ['unhas'],
    bio: 'Trabalha com alicate esterilizado e lixa nova para cada cliente, sem exceção. Gosta de unha curta, bem desenhada e que dura até a próxima visita.',
    dias: { 2: [9, 19], 3: [9, 19], 4: [9, 19], 6: [9, 18] } },
  { id: 'renata', nome: 'Renata Lopes', cargo: 'Sobrancelha e maquiagem', esp: 'Design natural e maquiagem de festa', anos: 8, foto: 'renata', faz: ['unhas', 'penteados'],
    bio: 'Mapeia o rosto antes de tirar o primeiro fio e prefere sobrancelha que parece sua. Nas sextas e sábados cuida da maquiagem das noivas e formandas.',
    dias: { 3: [10, 19], 4: [11, 21], 5: [11, 21], 6: [9, 18] } },
];

const pagamento = 'Pix, débito e crédito. Mechas, balayage, tranças e alinhamento em até 3 vezes sem juros no crédito.';
const aPartir = 'O valor "a partir de" muda com o comprimento e o volume do cabelo e é fechado no diagnóstico, antes de começar.';

// capa: fotos que se alternam (sempre de mulheres no salão)
const capaFotos = ['atendimento', 'espelho-redondo', 'lavagem-salao'];

// faixa de quatro fotos com uma palavra cada (o "manifesto")
const manifesto = [
  { foto: 'lavatorio-espuma', palavra: 'Cuidado' },
  { foto: 'loira-longa', palavra: 'Corte' },
  { foto: 'trancas-box', palavra: 'Textura' },
  { foto: 'coque-perolas', palavra: 'Acabamento' },
];

// problema e solução (cartas que viram)
const solucoes = [
  { foto: 'loira-vento', problema: 'Frizz o dia inteiro', antes: 'Cabelo que arma com qualquer umidade e não aceita escova.', solucao: 'Controle do frizz', depois: 'Hidratação com vapor, corte que tira peso das pontas e finalização com selagem térmica.', servico: 'hidratacao' },
  { foto: 'pontas-retas', problema: 'Fio quebradiço', antes: 'Pontas secas e elásticas depois de muita química ou chapinha.', solucao: 'Reconstrução do fio', depois: 'Reconstrução em duas sessões e um plano de química mais leve, combinado com a colorista.', servico: 'reconstrucao' },
  { foto: 'chanel-reto', problema: 'Cabelo sem volume', antes: 'Fios finos que caem colados na cabeça e sem movimento.', solucao: 'Volume e movimento', depois: 'Corte em camadas internas, raiz levantada na escova e produto leve para o dia a dia.', servico: 'corte' },
];

// "por que a Mecha" em blocos de tamanhos diferentes
const porque = {
  paixao: { foto: 'ondas-loiras', titulo: 'Feito com calma', texto: 'Agenda com folga entre um horário e outro, para ninguém ser atendida correndo.' },
  produtos: { foto: 'produtos2', titulo: 'Produtos de verdade', texto: 'Linhas profissionais com registro na Anvisa, escolhidas para cada tipo de fio.', etiquetas: ['Hidratação', 'Uso profissional', 'Sem formol'] },
  leque: ['coque-classico', 'ruiva', 'chanel-mechas'],
  atendimentos: 1200,
  marcaFoto: 'retrato-blazer',
  casa: { titulo: 'O cuidado continua em casa', texto: 'Você sai com a dica de finalização, os produtos certos e a data sugerida da volta.', etiquetas: ['Manter', 'Nutrir', 'Voltar'] },
  voltam: 94,
  rostos: ['cachos-alegria', 'retrato-sorriso', 'afro-oculos', 'ruiva', 'loira-cadeira'],
};

// faixa de cinema (foto inteira com frase)
const cinema = { fotos: ['espelho-conversa', 'escova-redonda'], frase: 'Toda visita começa por uma conversa no espelho.' };

// avaliações (fictícias, no formato das do Google): a primeira fica no centro, as outras em volta
const depoimentos = [
  { nome: 'Mariana Castro', serv: 'Mechas e balayage', foto: 'ondas-loiras', texto: 'Fizeram o teste de mecha uma semana antes e o tom ficou exatamente o da foto que eu levei. Três meses depois ninguém percebe a raiz.' },
  { nome: 'Camila Rocha', serv: 'Corte a seco para cachos', foto: 'cachos-alegria', texto: 'Primeiro salão que cortou meu cabelo seco, cacho por cacho. Saí sabendo finalizar em casa.' },
  { nome: 'Juliana Pires', serv: 'Escova modelada', foto: 'sorriso-ondas', texto: 'Cheguei no horário e fui atendida no horário. A escova durou até o terceiro dia.' },
  { nome: 'Aline Souza', serv: 'Box braids', foto: 'trancas-sorriso', texto: 'A Júlia trançou com calma e me ensinou a lavar sem desmanchar. Ficaram lindas por dois meses.' },
  { nome: 'Luiza Faria', serv: 'Noiva: prova e dia', foto: 'noiva-perfil', texto: 'A prova uma semana antes tirou todo o meu nervoso. No dia o penteado aguentou a festa inteira.' },
  { nome: 'Renata Vieira', serv: 'Alinhamento sem formol', foto: 'morena-longa', texto: 'Sem cheiro forte e sem ardência. Mostraram o registro do produto antes de começar.' },
  { nome: 'Patrícia Mello', serv: 'Hidratação e escova', foto: 'retrato-sorriso', texto: 'O frizz sumiu e o cabelo continua macio duas semanas depois.' },
];

// o atendimento em três momentos (foto muda com cada um)
const processo = [
  { titulo: 'Conversa e diagnóstico', texto: 'Você chega, toma um café e conta o que quer. A profissional olha o fio, faz o teste quando há química e fecha o valor antes de começar.', foto: 'espelho-conversa2' },
  { titulo: 'O serviço sob medida', texto: 'Corte, cor ou tratamento no tempo que o seu cabelo pede, com produtos escolhidos para o seu tipo de fio.', foto: 'papel-luvas' },
  { titulo: 'Finalização e cuidados', texto: 'Escova ou difusor, a dica de como repetir em casa e a data sugerida para a próxima visita.', foto: 'spray-finaliza' },
];

// tendências da estação (carrossel)
const looks = [
  { foto: 'ondas-escuras', nome: 'Ondas soltas', texto: 'Babyliss largo e raiz com volume.' },
  { foto: 'chanel-mechas', nome: 'Chanel com luzes', texto: 'Linha reta e mechas finas no contorno.' },
  { foto: 'cachos-secador', nome: 'Cacho definido', texto: 'Corte a seco e difusor sem frizz.' },
  { foto: 'ruiva-escuro', nome: 'Cobre acetinado', texto: 'Ruivo que desbota bonito.' },
  { foto: 'trancas-cobre', nome: 'Tranças cobre', texto: 'Box braids com fibra mesclada.' },
  { foto: 'coque-solto', nome: 'Coque despojado', texto: 'Preso baixo com fios soltos.' },
  { foto: 'castanho-longo', nome: 'Castanho longo', texto: 'Camadas longas e pontas leves.' },
  { foto: 'semipreso', nome: 'Semipreso com pedraria', texto: 'Para madrinhas e formandas.' },
  { foto: 'sardas', nome: 'Rabo baixo polido', texto: 'Acabamento liso e brilho.' },
  { foto: 'cacho-curto', nome: 'Cacho curto', texto: 'Volume nas laterais e franja de cachos.' },
];

// galeria por categoria; cat = id do segmento ou 'espaco'
const galeria = [
  { foto: 'escova-redonda', cat: 'corte', legenda: 'Escova com escova redonda' },
  { foto: 'noiva-buque', cat: 'penteados', legenda: 'Noiva pronta no salão' },
  { foto: 'cachos-ferro', cat: 'corte', legenda: 'Ondas no ferro' },
  { foto: 'salao-claro', cat: 'espaco', legenda: 'O salão numa manhã de sábado' },
  { foto: 'trancas-amarelo', cat: 'cachos', legenda: 'Box braids longas' },
  { foto: 'papel-luvas', cat: 'cor', legenda: 'Mechas no papel, à mão livre' },
  { foto: 'noiva-flores', cat: 'penteados', legenda: 'Trança lateral com flores' },
  { foto: 'difusor-sorriso', cat: 'cachos', legenda: 'Finalização com difusor' },
  { foto: 'babyliss-ondas', cat: 'corte', legenda: 'Ondas no babyliss' },
  { foto: 'cadeira-rosa', cat: 'espaco', legenda: 'A cadeira de maquiagem' },
  { foto: 'ondas-loiras', cat: 'cor', legenda: 'Balayage com tonalização bege' },
  { foto: 'coque-ruivo', cat: 'penteados', legenda: 'Coque texturizado ruivo' },
  { foto: 'trio-cachos', cat: 'cachos', legenda: 'Três texturas, três finalizações' },
  { foto: 'secando-liso', cat: 'corte', legenda: 'Escova lisa em cabelo comprido' },
  { foto: 'salao-rosa2', cat: 'espaco', legenda: 'Bancadas iluminadas' },
  { foto: 'cliente-pincel', cat: 'cor', legenda: 'Retoque de raiz no pincel' },
  { foto: 'noiva-veu', cat: 'penteados', legenda: 'Coque baixo com véu' },
  { foto: 'trancas-mar', cat: 'cachos', legenda: 'Tranças embutidas' },
  { foto: 'rolos-mao', cat: 'corte', legenda: 'Rolos para volume' },
  { foto: 'salao-rosa', cat: 'espaco', legenda: 'Atendimento de tranças' },
  { foto: 'retrato-laranja', cat: 'cor', legenda: 'Loiro mel iluminado' },
  { foto: 'trancado-loiro', cat: 'penteados', legenda: 'Trançado preso com pedraria' },
  { foto: 'tranca-costas', cat: 'cachos', legenda: 'Trança única nas costas' },
  { foto: 'salao-branco', cat: 'espaco', legenda: 'Cadeiras de corte e luz natural' },
];

// Instagram de exemplo (no site do cliente entra o feed oficial, veja o README)
const instagram = {
  usuario: 'mecha.salao',
  nome: 'Mecha Salão',
  bio: 'Salão de beleza na Vila Madalena. Preço combinado antes de começar.',
  posts: 412, seguidores: '18,6 mil', seguindo: 210,
  fotos: [
    { foto: 'noiva-tranca', legenda: 'Trança com grampos de pedraria para a noiva de sábado.', curtidas: 1510, comentarios: 58 },
    { foto: 'cachos-sorriso', legenda: 'Corte a seco, cacho por cacho, com a Beatriz.', curtidas: 1284, comentarios: 46 },
    { foto: 'espelho-escova', legenda: 'Bastidores de uma terça-feira: escova antes do evento.', curtidas: 932, comentarios: 31 },
    { foto: 'trancas-tijolo', legenda: 'Box braids médias, cinco horas de cadeira com a Júlia.', curtidas: 1103, comentarios: 39 },
    { foto: 'rabo-cavalo', legenda: 'Rabo alto polido para formatura.', curtidas: 845, comentarios: 22 },
    { foto: 'risada-cadeira', legenda: 'Sexta à tarde no salão.', curtidas: 702, comentarios: 17 },
  ],
};

const politicas = [
  { titulo: 'Agendamento', texto: 'Peça pelo formulário, WhatsApp ou telefone. Confirmamos em até uma hora no horário de funcionamento e lembramos na véspera. Serviços acima de R$ 300 pedem sinal de 30% via Pix, abatido no valor final.' },
  { titulo: 'Atraso', texto: 'Tolerância de 15 minutos. Depois disso o serviço pode ser reduzido para caber no horário ou remarcado, conforme a agenda da profissional.' },
  { titulo: 'Cancelamento e remarcação', texto: 'Sem custo até 24 horas antes, pelo WhatsApp. Com menos de 24 horas, o sinal vira crédito para uma nova data em até 60 dias. Duas faltas sem aviso pedem sinal em todos os próximos horários.' },
  { titulo: 'Garantia dos serviços', texto: 'Ajuste sem custo com a mesma profissional quando algo não ficou como combinado no espelho: corte, escova e sobrancelha em até 7 dias; cor, mechas, gloss e alinhamento em até 15 dias; tranças em até 5 dias; esmaltação em gel em até 5 dias. Não cobre mudança de ideia sobre o resultado combinado.' },
  { titulo: 'Coloração e química', destaque: true, texto: 'Coloração, mechas, tonalização, alinhamento e henna só depois do teste de mecha e de sensibilidade, feito 48 horas antes para quem nunca fez aqui. Avise alergias, gestação, medicamentos e química feita fora do salão nos últimos 6 meses. Se o fio não aguentar o processo, a profissional explica o motivo e propõe outro caminho.' },
  { titulo: 'Pagamento', texto: 'Pix, débito e crédito, com mechas, balayage, tranças e alinhamento em até 3 vezes sem juros. Os valores "a partir de" dependem do comprimento e do volume e são fechados na conversa, antes do serviço.' },
];
const higiene = [
  'Tesouras, pentes, alicates e pinças lavados e esterilizados em autoclave entre uma cliente e outra.',
  'Lixas, palitos, toucas, luvas, papel alumínio e capas de pescoço descartáveis, abertos na sua frente.',
  'Tintas, descolorantes e produtos de alinhamento com registro ou notificação na Anvisa, dentro da validade.',
  'Lavatórios, cadeiras e bancadas higienizados a cada atendimento. Licença sanitária municipal em dia.',
];

const faq = [
  ['Como faço para marcar?', 'Pelo formulário no fim da página, pelo WhatsApp ou por telefone. Você escolhe a profissional ou deixa sem preferência, e a gente encaixa no primeiro horário livre.'],
  ['A conversa antes do serviço é paga?', 'Não. A conversa no espelho faz parte de todo atendimento, e para mudanças grandes de cor dá para marcar só a avaliação, sem custo.'],
  ['E se eu não gostar do resultado?', 'Volte dentro do prazo de garantia do serviço e a mesma profissional ajusta sem custo o que não ficou como combinado.'],
  ['Quanto tempo leva cada serviço?', 'Corte leva cerca de uma hora, escova de 45 minutos a uma hora, mechas de três horas e meia a quatro horas e meia e tranças de quatro a seis horas. O tempo aparece em cada serviço.'],
  ['Posso levar uma foto de referência?', 'Deve. A foto ajuda a conversa, e a profissional explica o que dá para fazer no seu fio e o que precisa de mais de uma sessão.'],
  ['Vocês atendem sem hora marcada?', 'Só se houver cadeira livre. Cor, tranças e penteados precisam de tempo reservado, então vale ligar antes.'],
  ['Quais produtos vocês usam?', 'Linhas profissionais com registro na Anvisa, escolhidas para cada tipo de fio. A profissional mostra o rótulo antes de qualquer química.'],
];

const bairros = ['Vila Madalena', 'Pinheiros', 'Sumarezinho', 'Alto de Pinheiros', 'Perdizes', 'Vila Beatriz'];

// números da página Sobre (contadores)
const numeros = [
  [new Date().getFullYear() - marca.desde, '', 'anos de bairro'],
  [14, ' mil', 'clientes atendidas'],
  [6, '', 'profissionais na casa'],
  [94, '%', 'voltam em até 3 meses'],
];

// textos para as janelas legais e o carregando
const abertura = ['Cabelo', 'Cor', 'Cachos', 'Mecha'];

// ponto de interesse de cada foto ("x% y%", o rosto ou o penteado): todo recorte parte dele em vez do centro,
// para a pessoa não sair cortada quando a foto deitada vira cartão em pé (e vice-versa)
const foco = {
  'afro-oculos': '47% 35%', atendimento: '55% 30%', 'babyliss-ondas': '45% 40%', beatriz: '35% 30%', 'cacho-curto': '55% 35%',
  'cachos-alegria': '50% 30%', 'cachos-ferro': '50% 40%', 'cachos-secador': '45% 30%', 'cachos-sorriso': '52% 30%', 'cadeira-rosa': '50% 60%',
  carla: '58% 28%', 'castanho-longo': '50% 35%', 'chanel-mechas': '50% 40%', 'chanel-reto': '50% 35%', 'cliente-pincel': '45% 35%',
  'cliente-sorri': '40% 35%', 'coque-classico': '72% 50%', 'coque-perolas': '55% 45%', 'coque-ruivo': '48% 38%', 'coque-solto': '60% 35%',
  'corte-longo': '50% 40%', 'difusor-sorriso': '48% 28%', 'equipe-risos': '50% 35%', 'escova-janela': '72% 28%', 'escova-redonda': '55% 35%',
  'espelho-conversa': '65% 35%', 'espelho-conversa2': '70% 30%', 'espelho-escova': '30% 30%', 'espelho-mao': '55% 30%', 'espelho-redondo': '50% 50%',
  larissa: '50% 35%', 'lavagem-salao': '60% 45%', 'lavatorio-espuma': '50% 35%', 'loira-cadeira': '58% 32%', 'loira-longa': '45% 28%',
  'loira-vento': '28% 42%', 'morena-longa': '50% 30%', 'noiva-buque': '50% 30%', 'noiva-flores': '50% 50%', 'noiva-ondas': '50% 35%',
  'noiva-perfil': '50% 25%', 'noiva-tranca': '45% 30%', 'noiva-veu': '50% 30%', oleo: '50% 60%', 'ondas-escuras': '45% 40%',
  'ondas-loiras': '50% 30%', 'papel-luvas': '50% 40%', 'pontas-retas': '55% 40%', produtos2: '50% 60%', 'rabo-cavalo': '40% 40%',
  'recepcao-tablet': '50% 40%', renata: '50% 30%', 'retrato-blazer': '50% 25%', 'retrato-laranja': '50% 50%', 'retrato-sorriso': '50% 35%',
  'risada-cadeira': '40% 45%', 'rolos-mao': '55% 40%', 'ruiva-escuro': '50% 30%', ruiva: '50% 30%', 'salao-branco': '60% 50%',
  'salao-claro': '60% 45%', 'salao-rosa': '40% 50%', 'salao-rosa2': '50% 60%', sardas: '45% 35%', 'secando-liso': '40% 30%',
  semipreso: '50% 40%', 'sorriso-ondas': '51% 35%', 'spray-finaliza': '40% 40%', 'tranca-costas': '35% 45%', 'trancado-loiro': '50% 40%',
  'trancas-amarelo': '50% 30%', 'trancas-box': '50% 30%', 'trancas-cobre': '40% 30%', 'trancas-mar': '55% 40%', 'trancas-sorriso': '50% 25%',
  'trancas-tijolo': '50% 40%', trancista: '50% 25%', 'trio-cachos': '55% 35%',
};

// descrição das fotos (alt)
const fotos = {
  atendimento: 'Cabeleireira de roupa preta atendendo uma cliente sentada na cadeira do salão',
  'espelho-redondo': 'Cabeleireira fazendo escova numa cliente, refletidas num grande espelho redondo iluminado',
  'lavagem-salao': 'Cabeleireira lavando o cabelo de uma cliente reclinada no lavatório do salão',
  'lavatorio-espuma': 'Cliente reclinada no lavatório recebendo lavagem com espuma',
  'loira-longa': 'Mulher sorrindo, de cabelo loiro muito longo e ondulado',
  'trancas-box': 'Mulher de tranças box braids longas olhando para a câmera',
  'coque-perolas': 'Coque baixo loiro com grampos de pérola, visto de costas',
  'loira-vento': 'Mulher sorrindo com o cabelo loiro e armado ao vento',
  'pontas-retas': 'Cabeleireira acertando as pontas de um cabelo ruivo e liso',
  'chanel-reto': 'Mulher de cabelo castanho liso na altura do queixo',
  'corte-longo': 'Tesoura cortando as pontas de um cabelo castanho, longo e liso',
  'ondas-loiras': 'Mulher sorrindo com mechas loiras em ondas largas',
  'cachos-sorriso': 'Mulher de cachos volumosos sorrindo',
  'noiva-ondas': 'Noiva de costas com ondas soltas e grampos de flores',
  'sorriso-ondas': 'Mulher sorrindo, de cabelo castanho com ondas e franja lateral',
  produtos2: 'Frascos âmbar de óleo e pote de máscara sobre a bancada',
  oleo: 'Frasco conta-gotas de vidro âmbar sobre uma pedra, com sombra de folhas na parede',
  'coque-classico': 'Coque clássico escuro com enfeite de pedraria, de perfil',
  ruiva: 'Mulher ruiva de cabelo ondulado sorrindo',
  'chanel-mechas': 'Cabelo castanho em corte chanel com mechas, visto de costas',
  'retrato-blazer': 'Mulher de blazer laranja sorrindo com a mão no cabelo castanho',
  'cachos-alegria': 'Mulher de cachos escuros rindo',
  'retrato-sorriso': 'Mulher de cabelo escuro e ondulado sorrindo, apoiada nos braços',
  'afro-oculos': 'Mulher de óculos com cabelo crespo e faixa, sorrindo no salão',
  'loira-cadeira': 'Mulher loira de cabelo longo sorrindo na cadeira do salão',
  'espelho-conversa': 'Cabeleireira conversando com uma cliente diante do espelho do salão',
  'espelho-conversa2': 'Cliente de cabelo longo conversando com a cabeleireira pelo espelho',
  'escova-redonda': 'Cabeleireira fazendo escova com secador e escova redonda em cabelo castanho',
  'trancas-sorriso': 'Mulher de tranças longas e blusa amarela sorrindo',
  'noiva-perfil': 'Noiva de perfil com coque baixo e grampo de flores',
  'morena-longa': 'Mulher de cabelo castanho escuro, longo e liso',
  'papel-luvas': 'Colorista de luvas pretas aplicando cor em mechas no papel alumínio',
  'spray-finaliza': 'Cabeleireira finalizando uma escova loira com spray e escova redonda',
  'ondas-escuras': 'Mulher de cabelo escuro com ondas soltas no salão',
  'cachos-secador': 'Mulher de cachos definidos secando o cabelo com difusor',
  'ruiva-escuro': 'Mulher de cabelo cobre longo passando a mão no cabelo, fundo escuro',
  'trancas-cobre': 'Mulher de tranças longas em tom cobre',
  'coque-solto': 'Mulher de costas arrumando um coque despojado',
  'castanho-longo': 'Mulher de cabelo castanho longo e liso de casaco bege',
  semipreso: 'Cabelo semipreso com ondas e grampos de pedraria, visto de costas',
  sardas: 'Mulher de sardas com o cabelo preso para trás',
  'cacho-curto': 'Mulher de cabelo curto cacheado sobre fundo mostarda',
  'noiva-buque': 'Noiva sorrindo com o buquê no salão',
  'cachos-ferro': 'Cabeleireira modelando cachos com ferro em cabelo castanho',
  'salao-claro': 'Salão claro com cliente sentada na cadeira e cabeleireira ao lado',
  'trancas-amarelo': 'Mulher de tranças longas e blusa amarela sobre fundo laranja',
  'noiva-flores': 'Trança lateral ruiva com flores brancas',
  'difusor-sorriso': 'Mulher de cachos sorrindo enquanto seca o cabelo com difusor',
  'babyliss-ondas': 'Cabeleireira modelando ondas com babyliss',
  'cadeira-rosa': 'Cadeira rosa de maquiagem diante de espelhos com luzes',
  'coque-ruivo': 'Coque ruivo texturizado visto de costas',
  'trio-cachos': 'Três mulheres de cabelo cacheado, uma delas com secador',
  'secando-liso': 'Mulher sorrindo enquanto seca o cabelo longo e liso',
  'salao-rosa2': 'Salão com bancadas rosadas e cliente na cadeira',
  'cliente-pincel': 'Cliente sorrindo enquanto a colorista retoca a raiz com pincel',
  'noiva-veu': 'Noiva de costas com coque baixo, tiara e véu',
  'trancas-mar': 'Mulher de tranças embutidas de costas, olhando o mar',
  'rolos-mao': 'Cabeleireira enrolando mechas de cabelo castanho para dar volume',
  'salao-rosa': 'Trancista atendendo uma cliente no salão',
  'retrato-laranja': 'Mulher de cabelo loiro mel sentada numa cadeira, fundo laranja',
  'trancado-loiro': 'Penteado trançado loiro com pedraria',
  'tranca-costas': 'Trança única loira descendo pelas costas',
  'salao-branco': 'Salão branco com cabeleireira cortando o cabelo de uma cliente',
  'noiva-tranca': 'Penteado de noiva trançado com grampos de flores',
  'espelho-escova': 'Cabeleireira fazendo escova refletida no espelho do salão',
  'trancas-tijolo': 'Mulher de tranças longas apoiada numa parede de tijolos',
  'rabo-cavalo': 'Cabeleireira arrumando o rabo de cavalo de uma cliente',
  'risada-cadeira': 'Cliente rindo sentada na cadeira do salão',
  carla: 'Carla Menezes, colorista, sentada na cadeira do salão',
  beatriz: 'Beatriz Alves, cabeleireira, sorrindo com o secador na mão',
  trancista: 'Júlia Prado, trancista, sorrindo enquanto trança o cabelo de uma cliente',
  'escova-janela': 'Paula Nunes, cabeleireira, sorrindo enquanto faz escova numa cliente',
  larissa: 'Larissa Ramos, manicure, sorrindo no salão',
  renata: 'Renata Lopes, designer de sobrancelha, apoiada numa bancada do salão',
  'equipe-risos': 'Três profissionais do salão rindo com tesoura e escova nas mãos',
  'recepcao-tablet': 'Recepcionista sorrindo no balcão do salão com um tablet',
  'cliente-sorri': 'Cliente sorrindo enquanto a cabeleireira penteia o cabelo',
  'espelho-mao': 'Cliente de cabelo cacheado olhando o resultado num espelho de mão',
};

module.exports = {
  marca, horario, segmentos, servicos, equipe, pagamento, aPartir, capaFotos, manifesto, solucoes, porque, cinema,
  depoimentos, processo, looks, galeria, instagram, politicas, higiene, faq, bairros, numeros, abertura, foco, fotos,
};
