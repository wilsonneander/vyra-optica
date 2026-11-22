// Conteúdo do Gold "Íris" de estética: DEPILAÇÃO, CÍLIOS E SOBRANCELHAS (Camélia Estética, marca fictícia).
// Depilação a laser e com cera com preço por área, design de sobrancelhas, extensão de cílios e lash lifting.
// [EXEMPLO] = trocar pelos dados do cliente. Todos os preços, prazos, avaliações e números de registro são [EXEMPLO].
// [JURÍDICO] = texto que precisa passar pela revisão jurídica antes de ir para um cliente real.
//
// LIGAR E DESLIGAR SEGMENTOS
// Cada segmento em `segmentos` tem `ativo: true/false`. Desligado, ele some do site inteiro: faixa de serviços,
// provador do olhar (cílios e sobrancelhas), mapa do corpo (laser e cera), preços, agenda, anamnese, clube, loja e blog
// ligados a ele (campo `seg`). Na prévia também dá para testar pelo link: ?seg=cilios,sobrancelhas  ?seg=laser,cera

const marca = {
  nome: 'Camélia',
  completo: 'Camélia Estética',
  linha: 'Olhar e pele', // nome desta casa da marca, usado no topo e nos títulos
  frase: 'Depilação a laser e com cera, sobrancelhas e cílios no Cambuí, com preço por área e agenda aberta por profissional.',
  razao: 'Camélia Estética Avançada Ltda.', // [EXEMPLO] razão social fictícia
  cnpj: '00.000.000/0001-00', // [EXEMPLO] fictício
  whatsapp: '5519999990000', // [EXEMPLO]
  whatsappTexto: '(19) 99999-0000', // [EXEMPLO]
  telefone: '(19) 3333-0000', // [EXEMPLO]
  email: 'contato@cameliaestetica.com.br', // [EXEMPLO]
  dominio: 'https://www.cameliaestetica.com.br', // [EXEMPLO] usado no canonical, no sitemap e nos dados estruturados
  endereco: 'Rua Coronel Quirino, 1450, sala 12', // [EXEMPLO]
  rua: 'Rua Coronel Quirino, 1450',
  bairro: 'Cambuí',
  cidade: 'Campinas',
  uf: 'SP',
  cep: '13025-000', // [EXEMPLO]
  geo: [-22.89540, -47.05390], // ponto do mapa (fictício, na Rua Coronel Quirino)
  desde: 2017, // [EXEMPLO]
  instagram: 'https://instagram.com/',
  instagramUser: '@cameliaestetica',
  facebook: 'https://facebook.com/',
  linkedin: 'https://linkedin.com/',
  encarregado: 'privacidade@cameliaestetica.com.br', // [EXEMPLO] canal do encarregado de dados (LGPD)
  estacionamento: 'Estacionamento conveniado na Rua Maria Monteiro, a 80 metros, com 1 hora grátis para clientes.', // [EXEMPLO]
};

// responsável técnica [EXEMPLO] pessoa e registro fictícios (a mesma dos outros modelos Camélia)
const responsavel = {
  nome: 'Helena Prado',
  cargo: 'Biomédica esteta, responsável técnica',
  registro: 'CRBM-1 nº 00000', // [EXEMPLO]
};

// horário da casa por dia da semana (0 = domingo), em horas decimais; null = fechado
const abertura = [null, [9, 20], [9, 20], [9, 20], [9, 20], [9, 20], [8, 15]];
const horarios = [['Segunda a sexta', '9h às 20h'], ['Sábado', '8h às 15h'], ['Domingo e feriado', 'Fechado']];

// Equipe. `agenda`: horário de cada profissional por dia da semana (0 = domingo). `faz`: categorias que ela atende.
// [EXEMPLO] pessoas, registros e fotos fictícios. Na agenda real, os horários livres vêm do sistema de agendamento.
const equipe = [
  {
    id: 'helena', nome: 'Helena Prado', cargo: 'Biomédica esteta e responsável técnica', registro: 'CRBM-1 nº 00000', foto: 'helena',
    faz: ['laser', 'cera'],
    texto: 'Faz a avaliação de pele e o teste de mecha antes de toda primeira sessão de laser, define os parâmetros do aparelho para cada fototipo e responde tecnicamente pela clínica.',
    agenda: [null, [9, 18], null, [9, 18], null, [9, 18], [8, 14]],
  },
  {
    id: 'livia', nome: 'Lívia Moraes', cargo: 'Lash designer', registro: 'Curso técnico em estética', foto: 'livia',
    faz: ['cilios', 'sobrancelhas'],
    texto: 'Escolhe curvatura, espessura e tamanho dos fios pelo formato do seu olho. Trabalha só com cola hipoalergênica e faz o teste de alergia 48 horas antes da primeira aplicação.',
    agenda: [null, null, [10, 20], [10, 20], [10, 20], [10, 20], [8, 15]],
  },
  {
    id: 'bruna', nome: 'Bruna Tavares', cargo: 'Designer de sobrancelhas e depiladora', registro: 'Curso técnico em estética', foto: 'bruna',
    faz: ['sobrancelhas', 'cera'],
    texto: 'Mede o rosto com régua e compasso antes de tirar o primeiro fio. Na depilação com cera, usa cera de uso único, aplicada com espátula descartável.',
    agenda: [null, [9, 20], [9, 20], [9, 20], [9, 20], null, [8, 15]],
  },
];

// fotos: arquivo em img/fotos/<nome>.webp. Unsplash (licença Unsplash), créditos em img/creditos.json.
const fotos = {
  capa: 'Extensão de cílios sendo aplicada fio a fio com duas pinças',
  cilios: 'Lash designer aplicando extensão de cílios com a cliente deitada e protetor de gel embaixo do olho',
  lifting: 'Olho com cílios naturais curvados depois do lash lifting',
  'olho-cilios': 'Olho verde de perto com cílios longos e curvados',
  'olho-azul': 'Olho azul de perto com cílios e sobrancelha naturais',
  sobrancelha: 'Designer tirando fios da sobrancelha com pinça',
  'sobrancelha-feita': 'Sobrancelha desenhada e preenchida, vista de perto',
  'sobrancelha-escova': 'Sobrancelha sendo penteada com escovinha',
  laser: 'Depilação a laser na perna da cliente deitada sobre toalha branca',
  'laser-rosto': 'Depilação a laser no queixo, com profissional e cliente de óculos de proteção',
  'laser-braco': 'Ponteira do laser sobre o braço da cliente',
  cera: 'Cera de depilação escorrendo da espátula para o pote',
  'cera-buco': 'Aplicação de cera no buço com espátula',
  pernas: 'Pernas lisas cruzadas no ar sobre fundo branco',
  'pinca-fios': 'Pinça sobre bandeja de fios para extensão de cílios',
  helena: 'Helena Prado, biomédica esteta, de jaleco branco',
  livia: 'Lívia Moraes, lash designer, na sala de atendimento',
  bruna: 'Bruna Tavares, designer de sobrancelhas, sentada na recepção',
};

// segmentos (categorias). `cor` é a variação da paleta usada no cartão do segmento.
const segmentos = [
  { id: 'laser', ativo: true, nome: 'Depilação a laser', curto: 'Laser', foto: 'laser', frase: 'Laser de diodo com preço por área, teste de mecha e parâmetros para cada tom de pele.' },
  { id: 'cera', ativo: true, nome: 'Depilação com cera', curto: 'Cera', foto: 'cera-buco', frase: 'Cera de uso único, aplicada com espátula descartável, com preço por área.' },
  { id: 'sobrancelhas', ativo: true, nome: 'Design de sobrancelhas', curto: 'Sobrancelhas', foto: 'sobrancelha', frase: 'Desenho medido no seu rosto, com pinça e linha, henna ou brow lamination.' },
  { id: 'cilios', ativo: true, nome: 'Extensão de cílios e lash lifting', curto: 'Cílios', foto: 'cilios', frase: 'Fio a fio, híbrido ou volume russo, e lash lifting para curvar os seus próprios fios.' },
];

// Áreas do corpo: [id, nome, cera (R$ por sessão), laser (R$ por sessão), vista, x, y, sessões de laser indicadas]
// x e y são a posição do ponto na silhueta (viewBox 0 0 220 500). vista: 'frente' ou 'costas'. [EXEMPLO] preços
const areas = [
  ['buco', 'Buço', 20, 70, 'frente', 110, 58, 10],
  ['queixo', 'Queixo', 20, 70, 'frente', 110, 70, 10],
  ['rosto', 'Rosto completo', 55, 190, 'frente', 124, 40, 10],
  ['axilas', 'Axilas', 30, 90, 'frente', 140, 124, 8],
  ['bracos', 'Braços inteiros', 50, 180, 'frente', 164, 186, 8],
  ['maos', 'Mãos e dedos', 15, 60, 'frente', 174, 276, 6],
  ['abdomen', 'Linha do abdômen', 20, 80, 'frente', 110, 205, 8],
  ['virilha', 'Virilha completa', 70, 140, 'frente', 110, 262, 8],
  ['coxas', 'Coxas', 50, 200, 'frente', 128, 318, 8],
  ['meia-perna', 'Meia perna', 45, 180, 'frente', 124, 406, 8],
  ['pes', 'Pés e dedos', 15, 60, 'frente', 122, 478, 6],
  ['nuca', 'Nuca', 25, 80, 'costas', 110, 84, 8],
  ['costas', 'Costas', 70, 260, 'costas', 110, 168, 8],
  ['lombar', 'Lombar', 30, 110, 'costas', 110, 222, 8],
  ['gluteos', 'Glúteos', 40, 130, 'costas', 110, 258, 8],
  ['perna-inteira', 'Perna inteira', 75, 290, 'costas', 92, 380, 8],
];
// pacotes de laser: [sessões, desconto]. Três áreas ou mais no mesmo pacote ganham `combo` de desconto extra.
const laserPacotes = [[1, 0], [6, 0.1], [8, 0.15], [10, 0.2]];
const laserCombo = { minimo: 3, desconto: 0.1 };
const laserIntervalo = 45; // dias entre as sessões de corpo (rosto e axilas podem ser a cada 30)
const parcelas = 10; // pacotes em até 10x sem juros no cartão

// Serviços (agenda, preços e provador). `cat` = segmento. Preço: `preco` = valor fechado, `de` = "a partir de".
// `min` = duração em minutos (a agenda usa para encaixar os horários). `manut` = manutenção.
const servicos = [
  // cílios
  { id: 'fio-a-fio', cat: 'cilios', nome: 'Extensão de cílios fio a fio', min: 120, preco: 220, manut: [120, 'a cada 15 a 21 dias'], sessoes: 'Aplicação completa e manutenções',
    resumo: 'Um fio sintético colado em cada cílio natural. Efeito de rímel, discreto e leve.',
    inclui: ['Escolha de curvatura, espessura e tamanho pelo formato do olho', 'Cola hipoalergênica com registro na Anvisa', 'Reposição de fios caídos em até 72 horas', 'Teste de alergia 48 horas antes da primeira aplicação'] },
  { id: 'hibrido', cat: 'cilios', nome: 'Extensão de cílios híbrida', min: 140, preco: 250, manut: [130, 'a cada 15 a 21 dias'], sessoes: 'Aplicação completa e manutenções',
    resumo: 'Mistura fios simples e leques leves. Mais volume que o fio a fio, sem pesar.',
    inclui: ['Mapeamento do desenho', 'Cola hipoalergênica', 'Reposição de fios caídos em até 72 horas', 'Escovinha de presente'] },
  { id: 'volume-russo', cat: 'cilios', nome: 'Volume russo', min: 150, preco: 290, manut: [150, 'a cada 15 a 21 dias'], sessoes: 'Aplicação completa e manutenções',
    resumo: 'Leques de três a seis fios ultrafinos em cada cílio natural. Olhar marcado, sem precisar de rímel.',
    inclui: ['Fios de 0,05 a 0,07 mm', 'Cola hipoalergênica', 'Reposição de fios caídos em até 72 horas', 'Espuma de limpeza para usar em casa'] },
  { id: 'lash-lifting', cat: 'cilios', nome: 'Lash lifting com tintura', min: 60, preco: 150, sessoes: 'Sessão avulsa, dura de 6 a 8 semanas',
    resumo: 'Curva e escurece os seus próprios cílios. Sem fio sintético e sem manutenção.',
    inclui: ['Curvatura e fixação', 'Tintura dos fios', 'Nutrição com queratina ao final'] },
  { id: 'manutencao-cilios', cat: 'cilios', nome: 'Manutenção de extensão', min: 75, de: 120, sessoes: 'Até 21 dias depois da aplicação',
    resumo: 'Repõe os fios que caíram com o ciclo natural dos cílios. Depois de 21 dias, vira aplicação nova.',
    inclui: ['Limpeza dos fios', 'Retirada dos fios crescidos', 'Reposição'] },
  { id: 'remocao', cat: 'cilios', nome: 'Remoção de extensão', min: 30, preco: 50, sessoes: 'Sessão avulsa',
    resumo: 'Remoção com removedor em creme, sem puxar os fios naturais. Sem custo para quem faz uma nova aplicação aqui.',
    inclui: ['Removedor em creme', 'Limpeza e hidratação dos fios'] },
  // sobrancelhas
  { id: 'design', cat: 'sobrancelhas', nome: 'Design de sobrancelhas', min: 40, preco: 60, sessoes: 'Manutenção a cada 20 a 30 dias',
    resumo: 'Desenho feito a partir das medidas do seu rosto, com pinça e linha.',
    inclui: ['Mapeamento com régua e compasso', 'Retirada com pinça e linha', 'Retoque sem custo em até 7 dias'] },
  { id: 'design-henna', cat: 'sobrancelhas', nome: 'Design com henna', min: 60, preco: 80, sessoes: 'A henna dura de 7 a 15 dias na pele',
    resumo: 'O mesmo design, com henna para preencher falhas e marcar o desenho.',
    inclui: ['Mapeamento', 'Henna na cor dos seus fios', 'Teste de alergia 48 horas antes da primeira aplicação'] },
  { id: 'brow-lamination', cat: 'sobrancelhas', nome: 'Brow lamination', min: 60, preco: 140, sessoes: 'Dura de 4 a 6 semanas',
    resumo: 'Alinha e fixa os fios para cima, para a sobrancelha parecer mais cheia e penteada.',
    inclui: ['Design incluso', 'Nutrição dos fios ao final', 'Teste de alergia 48 horas antes'] },
  // depilação
  { id: 'cera-areas', cat: 'cera', nome: 'Depilação com cera', min: 45, de: 15, porArea: 'cera', sessoes: 'A cada 25 a 35 dias',
    resumo: 'Preço por área. Cera de uso único, espátula descartável e calmante ao final.',
    inclui: ['Higienização da pele', 'Cera quente ou morna conforme a área', 'Pinça para os fios que restarem', 'Gel calmante'] },
  { id: 'laser-areas', cat: 'laser', nome: 'Depilação a laser', min: 50, de: 60, porArea: 'laser', sessoes: 'De 6 a 10 sessões, a cada 30 a 60 dias',
    resumo: 'Preço por área e por sessão, com desconto em pacote. Laser de diodo com registro na Anvisa.',
    inclui: ['Teste de mecha na primeira visita', 'Óculos de proteção para você e para a profissional', 'Resfriamento da pele durante o disparo', 'Protetor solar ao final'] },
  { id: 'avaliacao-laser', cat: 'laser', nome: 'Avaliação e teste de mecha', min: 30, preco: 0, gratis: 'Sem custo', sessoes: 'Visita única, antes da primeira sessão',
    resumo: 'Análise do tom de pele e do pelo, teste numa pequena área e plano por escrito com sessões e valores.',
    inclui: ['Ficha de saúde', 'Classificação do fototipo', 'Teste de mecha', 'Plano por escrito'] },
];

// Provador do olhar: estilos de cílios e formas de sobrancelha, ligados a um serviço da lista acima.
const provador = {
  cilios: [
    { id: 'natural', nome: 'Fio a fio natural', servico: 'fio-a-fio', texto: 'Efeito de rímel. Fios do mesmo tamanho dos seus, um pouco mais escuros.' },
    { id: 'boneca', nome: 'Boneca', servico: 'hibrido', texto: 'Fios mais longos no centro do olho. Abre e arredonda o olhar.' },
    { id: 'gatinho', nome: 'Gatinho', servico: 'fio-a-fio', texto: 'Os fios crescem em direção ao canto externo e puxam o olhar para fora.' },
    { id: 'volume', nome: 'Volume russo', servico: 'volume-russo', texto: 'Leques ultrafinos em cada cílio. Marcado, escuro e sem rímel.' },
    { id: 'lifting', nome: 'Lash lifting', servico: 'lash-lifting', texto: 'Os seus próprios fios, curvados e tingidos. Sem extensão.' },
  ],
  curvas: [['C', 'Curvatura C, a mais natural'], ['D', 'Curvatura D, mais curvada'], ['L', 'Curvatura L, para cílios retos ou olho encapotado']],
  sobrancelhas: [
    { id: 'arco', nome: 'Arco suave', servico: 'design' },
    { id: 'reta', nome: 'Reta', servico: 'design' },
    { id: 'ascendente', nome: 'Ascendente', servico: 'design-henna' },
    { id: 'lamination', nome: 'Laminada', servico: 'brow-lamination' },
  ],
};

const pagamento = [
  ['Formas de pagamento', 'Pix, débito e crédito. Serviço avulso em até 3x e pacotes de laser em até 10x sem juros no cartão.'],
  ['Pacotes de laser', 'Valem por 18 meses a partir da primeira sessão, com o número de sessões e o valor total escritos no plano. Três áreas ou mais no mesmo pacote têm 10% de desconto extra.'],
  ['Garantia do serviço', 'Retoque do design em até 7 dias, reposição de cílios caídos em até 72 horas, nova aplicação de cera sem custo nos pelos que ficarem e remarcação sem custo de sessão perdida por falha nossa. Garantimos o serviço bem feito, não um resultado específico.'],
];

// Como funciona: etapas mostradas em linha, sem número
const etapas = [
  ['Avaliação', 'Online, pelo formulário desta página, ou na clínica. Para laser, sempre presencial, sem custo.'],
  ['Teste', 'Teste de mecha para o laser e teste de alergia para cola, henna e lifting, 48 horas antes.'],
  ['Atendimento', 'Hora marcada, sem encaixe. Material descartável aberto na sua frente.'],
  ['Cuidados e retorno', 'Orientação por escrito para casa e retorno ou manutenção já agendado.'],
];

// [JURÍDICO] contraindicações por segmento
const contraindicacoes = {
  laser: ['Gestação', 'Uso de isotretinoína nos últimos 6 meses', 'Pele bronzeada ou exposta ao sol nos últimos 15 dias', 'Remédios que deixam a pele sensível à luz, sem liberação médica', 'Ferida, infecção, herpes ativa ou tatuagem na área'],
  cera: ['Varizes, flebite ou trombose na área', 'Uso de isotretinoína nos últimos 6 meses', 'Ácidos ou retinoides na área nos últimos 7 dias', 'Pele queimada de sol, ferida ou irritada', 'Diabetes sem controle (fazemos só com avaliação)'],
  cilios: ['Alergia a cianoacrilato (componente da cola)', 'Conjuntivite, blefarite ou olho irritado', 'Cirurgia nos olhos nos últimos 3 meses', 'Quimioterapia em andamento'],
  sobrancelhas: ['Alergia a henna ou a tintura (teste antes)', 'Micropigmentação feita há menos de 30 dias', 'Pele irritada, ferida ou com acne inflamada na área', 'Ácidos no rosto nos últimos 7 dias, para cera e linha'],
};

// [JURÍDICO]
const politicas = [
  ['Avaliação prévia', 'Toda primeira sessão de laser começa por uma avaliação sem custo, com ficha de saúde, classificação do tom de pele e teste de mecha. Para cílios, henna, lifting e lamination, o teste de alergia é feito 48 horas antes. A avaliação online desta página adianta essa conversa, mas não substitui a presencial.'],
  ['Agendamento', 'Pela agenda desta página, pelo WhatsApp ou na recepção. O horário escolhido fica reservado por 2 horas até a nossa confirmação por mensagem. Confirmamos de novo um dia antes.'],
  ['Cancelamento', 'Cancele sem custo até 24 horas antes. Com menos de 24 horas, cobramos 50% do serviço avulso, e a sessão de pacote conta como feita. Imprevisto de saúde com atestado não entra nessa regra.'],
  ['Remarcação e atraso', 'Remarque quantas vezes precisar, respeitando as 24 horas. Toleramos 10 minutos de atraso; depois disso o serviço é encurtado ou remarcado, para não atrasar a próxima cliente. Em extensão de cílios, a tolerância é de 15 minutos.'],
  ['Desistência de pacote', 'Você pode desistir a qualquer momento. Devolvemos o valor das sessões não feitas, calculado pelo preço do pacote, descontados 10% de custo administrativo.'],
];

// [JURÍDICO] conferir registros reais da clínica
const seguranca = [
  ['Descartável de verdade', 'Espátula, lençol, touca, luva, micropore, escovinha e protetor de gel dos olhos são de uso único e abertos na sua frente. A cera usada não volta para o pote.'],
  ['Esterilização', 'Pinças, tesouras e compasso passam por limpeza, embalagem e autoclave. O pacote é aberto na sua frente, com a data do ciclo na etiqueta.'],
  ['Registro na Anvisa', 'O laser de diodo, a cera, as colas, a henna, os produtos de lifting e os cosméticos da loja têm registro ou notificação na Anvisa, conforme exigido para cada item.'],
  ['Licença sanitária', 'Clínica com alvará e licença da Vigilância Sanitária de Campinas, renovados todo ano, e responsável técnica com registro no conselho.'],
];

// [JURÍDICO] aviso de resultados conforme regras de publicidade do setor
const avisoResultado = 'Cada pele, cada pelo e cada cílio respondem de um jeito. O laser reduz os pelos aos poucos e não há garantia de depilação definitiva; o número de sessões pode mudar depois da avaliação. As imagens de antes e depois desta página são ilustrações, não fotos de clientes. Fotos reais só com autorização por escrito.';

// Antes e depois arrastável. [EXEMPLO] Ilustrações desenhadas pelo site. Cliente real: trocar por fotos com autorização.
const antesDepois = [
  { id: 'cilios', seg: 'cilios', nome: 'Cílios', titulo: 'Extensão fio a fio, curvatura C', texto: 'Fios de 10 a 12 mm, mais longos no canto externo. Manutenção a cada 18 dias.' },
  { id: 'sobrancelhas', seg: 'sobrancelhas', nome: 'Sobrancelhas', titulo: 'Design com henna', texto: 'Desenho medido, fios do excesso retirados com pinça e henna nas falhas.' },
  { id: 'laser', seg: 'laser', nome: 'Laser', titulo: 'Meia perna, depois de 6 sessões', texto: 'Redução progressiva dos pelos, com sessões a cada 45 dias. Pode precisar de manutenção.' },
];

// Avaliações do Google. [EXEMPLO] Textos fictícios do modelo. No site real, entram pela API do Perfil da Empresa no Google
// (Places API) ou por um widget autorizado, com nome, nota e data reais.
const google = {
  nota: '4,9', total: 312, distribuicao: [92, 6, 1, 0, 1], // % de 5 a 1 estrelas
  link: 'https://www.google.com/maps/search/?api=1&query=Cam%C3%A9lia+Est%C3%A9tica+Cambu%C3%AD+Campinas',
  avaliacoes: [
    { nome: 'Mariana S.', seg: 'cilios', nota: 5, quando: 'há 1 semana', texto: 'Fiz volume russo com a Lívia e ela me mostrou antes como ficaria. Leve, não pesa e não coça. Já marquei a manutenção na saída.' },
    { nome: 'Patrícia L.', seg: 'laser', nota: 5, quando: 'há 2 semanas', texto: 'Tenho pele morena e sempre tive medo de laser. A Helena fez o teste de mecha, explicou o porquê de cada regulagem e não tive mancha nenhuma.' },
    { nome: 'Renata A.', seg: 'sobrancelhas', nota: 5, quando: 'há 3 semanas', texto: 'Primeira vez que alguém mediu meu rosto antes de tirar fio. A sobrancelha ficou com a minha cara, só que arrumada.' },
    { nome: 'Juliana M.', seg: 'cera', nota: 5, quando: 'há 1 mês', texto: 'Cera nova para cada cliente, espátula descartável e a Bruna é rápida. Virilha sem drama.' },
    { nome: 'Camila R.', seg: 'cilios', nota: 4, quando: 'há 1 mês', texto: 'Lash lifting ficou lindo. Só achei a espera de 48 horas do teste chata, mas entendi o motivo.' },
    { nome: 'Fernanda T.', seg: 'laser', nota: 5, quando: 'há 2 meses', texto: 'O simulador do site deu exatamente o valor que me passaram na avaliação. Parcelei axilas, buço e virilha em 10 vezes.' },
    { nome: 'Aline P.', seg: 'sobrancelhas', nota: 5, quando: 'há 2 meses', texto: 'Brow lamination com design. Durou quase 6 semanas e acordo penteada.' },
    { nome: 'Gabriela N.', seg: 'cera', nota: 5, quando: 'há 3 meses', texto: 'Assino o clube Pele lisa e não fico mais contando os dias para depilar. Agendo pelo site em dois minutos.' },
  ],
};

// Clube de assinatura. `mensal` = sem fidelidade; `anual` = valor por mês com fidelidade de 12 meses. [EXEMPLO] [JURÍDICO]
const clube = {
  nome: 'Clube Íris',
  planos: [
    { id: 'sobrancelha', seg: ['sobrancelhas'], nome: 'Sobrancelha em dia', mensal: 75, anual: 65, avulso: 100,
      inclui: ['1 design com henna por mês', 'Retoque sem custo em até 7 dias', '10% de desconto na loja'] },
    { id: 'cilios', seg: ['cilios'], nome: 'Cílios sempre', mensal: 210, anual: 189, avulso: 240, destaque: true,
      inclui: ['2 manutenções de extensão fio a fio por mês', 'Reposição de fios em até 72 horas', 'Espuma de limpeza a cada 3 meses', '10% de desconto na loja'] },
    { id: 'pele', seg: ['cera'], nome: 'Pele lisa', mensal: 139, anual: 119, avulso: 165,
      inclui: ['Cera em até 4 áreas por mês: buço, axilas, virilha e meia perna', 'Gel calmante pós-depilação a cada 2 meses', '10% de desconto no laser'] },
    { id: 'olhar', seg: ['cilios', 'sobrancelhas'], nome: 'Olhar completo', mensal: 269, anual: 239, avulso: 340,
      inclui: ['Tudo do Cílios sempre', 'Tudo do Sobrancelha em dia', 'Horário preferencial no sábado', '15% de desconto na loja'] },
  ],
  regras: [
    'Cobrança mensal no cartão de crédito, sem taxa de adesão.',
    'Plano mensal: cancela quando quiser, com aviso de 30 dias.',
    'Plano anual: valor menor com fidelidade de 12 meses. Na saída antes do prazo, multa de 10% das mensalidades que faltam.',
    'Serviços do mês não acumulam para o mês seguinte. O plano é pessoal.',
  ],
};

// Vale-presente [EXEMPLO]
const vale = {
  valores: [100, 150, 250, 400],
  servicos: ['design-henna', 'lash-lifting', 'fio-a-fio', 'brow-lamination'],
  estampas: [['iris', 'Íris'], ['perola', 'Pérola'], ['noite', 'Noite']],
  regras: 'Vale por 6 meses a partir da compra, em qualquer serviço ou produto. Não é trocado por dinheiro e pode ser usado em mais de uma visita.',
};

// Loja [EXEMPLO] produtos fictícios. `forma` desenha a embalagem (sem foto): frasco, conta-gotas, bisnaga, pote, tubo, escovas.
const produtos = [
  { id: 'serum', seg: 'cilios', nome: 'Sérum fortalecedor de cílios e sobrancelhas', tam: '4 ml', preco: 129, forma: 'conta-gotas', cor: '#8E80B6', texto: 'Aplicação noturna na raiz dos fios. Pode ser usado com extensão.' },
  { id: 'espuma', seg: 'cilios', nome: 'Espuma de limpeza para extensão', tam: '50 ml', preco: 69, forma: 'frasco', cor: '#C9BFDF', texto: 'Limpa sem óleo, para não soltar a cola. Use com a escovinha.' },
  { id: 'escovas', seg: 'cilios', nome: 'Escovinhas descartáveis', tam: '10 unidades', preco: 19, forma: 'escovas', cor: '#3A3F5C', texto: 'Para pentear cílios e sobrancelhas todos os dias.' },
  { id: 'demaquilante', seg: 'cilios', nome: 'Demaquilante bifásico sem óleo', tam: '120 ml', preco: 59, forma: 'frasco', cor: '#DCD5E9', texto: 'Tira a maquiagem dos olhos sem soltar a extensão nem o lifting.' },
  { id: 'fixador', seg: 'sobrancelhas', nome: 'Gel fixador de sobrancelhas', tam: '5 g', preco: 49, forma: 'tubo', cor: '#B8735A', texto: 'Transparente. Mantém o efeito da lamination entre as sessões.' },
  { id: 'calmante', seg: 'cera', nome: 'Gel calmante pós-depilação', tam: '150 g', preco: 59, forma: 'bisnaga', cor: '#9FB5A8', texto: 'Com aloe e pantenol. Para usar logo depois da cera ou do laser.' },
  { id: 'esfoliante', seg: 'cera', nome: 'Esfoliante para pelos encravados', tam: '120 g', preco: 64, forma: 'pote', cor: '#E3C9B8', texto: 'Esfoliação suave duas vezes por semana, a partir do terceiro dia.' },
  { id: 'protetor', seg: 'laser', nome: 'Protetor solar FPS 50 toque seco', tam: '60 g', preco: 89, forma: 'bisnaga', cor: '#F2E7D8', texto: 'Obrigatório entre as sessões de laser nas áreas expostas ao sol.' },
];
const entrega = [['retirar', 'Retirar na clínica', 0], ['campinas', 'Entrega em Campinas', 12], ['correios', 'Correios, para outras cidades', null]];

// Blog. Cada post vira uma página em blog/<slug>.html com dados estruturados de artigo.
const posts = [
  {
    slug: 'depilacao-a-laser-no-verao', seg: 'laser', foto: 'laser', data: '2026-11-04', min: 4,
    titulo: 'Dá para fazer depilação a laser no verão?',
    resumo: 'Dá, com três cuidados. O problema não é a estação, é a pele bronzeada na hora do disparo.',
    corpo: [
      ['p', 'A pergunta aparece toda vez que o calor chega. A resposta curta é sim: a depilação a laser pode continuar no verão. O que muda é o cuidado com o sol nas áreas tratadas, porque o laser procura o pigmento do pelo, e uma pele bronzeada também tem mais pigmento.'],
      ['h2', 'Por que o bronzeado atrapalha'],
      ['p', 'O laser de diodo é calibrado para aquecer o folículo sem aquecer a pele em volta. Quando a pele escurece pelo sol, a diferença entre o tom do pelo e o tom da pele diminui, e o risco de mancha ou de queimadura aumenta. Por isso pedimos 15 dias sem sol direto na área antes da sessão.'],
      ['h2', 'Os três cuidados'],
      ['p', 'Protetor solar FPS 50 todos os dias nas áreas expostas, como rosto, axilas no biquíni e pernas. Nada de bronzeamento natural ou artificial durante o pacote. E sessões marcadas fora das semanas de praia: se a viagem é em janeiro, faça a sessão de dezembro logo no começo do mês.'],
      ['h2', 'Áreas que quase não pegam sol'],
      ['p', 'Virilha, glúteos e axilas costumam ficar cobertas e seguem normalmente no verão. Para rosto e pernas, a profissional confere o tom da pele no dia e pode ajustar a potência ou adiar a sessão. Adiar uma sessão não faz você perder o que já foi feito.'],
      ['p', 'Ficou com dúvida sobre a sua pele? A avaliação com teste de mecha é sem custo e já sai com o plano por escrito.'],
    ],
  },
  {
    slug: 'como-fazer-a-extensao-de-cilios-durar', seg: 'cilios', foto: 'olho-cilios', data: '2026-10-21', min: 3,
    titulo: 'Como fazer a extensão de cílios durar até a manutenção',
    resumo: 'Nas primeiras 24 horas, nada de água. Depois, limpeza todo dia, e não o contrário.',
    corpo: [
      ['p', 'Os fios de extensão caem junto com os seus cílios naturais, que se renovam o tempo todo. Por isso a manutenção existe. O que dá para evitar é a queda antes da hora, e ela quase sempre vem de três hábitos.'],
      ['h2', 'As primeiras 24 horas'],
      ['p', 'A cola termina de curar ao longo do primeiro dia. Evite água, vapor, sauna e academia nesse período. Depois disso, pode molhar normalmente.'],
      ['h2', 'Limpar não é inimigo'],
      ['p', 'Muita gente deixa de lavar os cílios com medo de perder fios, e o acúmulo de oleosidade e maquiagem é justamente o que solta a cola. Use espuma sem óleo, uma vez por dia, e seque com o ar frio do secador.'],
      ['h2', 'O travesseiro e o rímel'],
      ['p', 'Dormir de bruços amassa os fios contra o travesseiro. Fronha de cetim ajuda. E não use rímel nem curvex: a extensão já faz o papel dos dois.'],
      ['p', 'Com esses cuidados, a manutenção a cada 15 a 21 dias costuma repor entre 30% e 40% dos fios.'],
    ],
  },
  {
    slug: 'cera-ou-laser-como-escolher', seg: 'cera', foto: 'cera', data: '2026-10-08', min: 5,
    titulo: 'Cera ou laser: como escolher para cada área do corpo',
    resumo: 'Não precisa ser uma coisa ou outra. A escolha depende da área, do pelo e do seu calendário.',
    corpo: [
      ['p', 'Cera e laser não competem: muitas clientes fazem laser nas pernas e nas axilas e continuam com a cera no buço ou na virilha durante o pacote. O que decide é o tipo de pelo, a área e quanto tempo você quer gastar com depilação nos próximos anos.'],
      ['h2', 'Quando o laser faz mais sentido'],
      ['p', 'Pelo escuro e grosso, em áreas maiores, como pernas, axilas e virilha. É nessas áreas que o laser de diodo trabalha melhor e onde a soma das sessões de cera ao longo dos anos fica mais alta.'],
      ['h2', 'Quando a cera continua melhor'],
      ['p', 'Pelos muito claros, ruivos ou brancos, que o laser não enxerga bem. Quem está grávida, em uso de isotretinoína ou não pode evitar o sol por alguns meses. E quem quer resolver uma área pequena de vez em quando.'],
      ['h2', 'Durante o pacote de laser'],
      ['p', 'Entre as sessões, não arranque o pelo: nada de cera, pinça ou linha na área tratada. Pode usar lâmina. O laser precisa do pelo dentro do folículo para funcionar.'],
      ['p', 'No simulador desta página dá para comparar o custo das duas opções por área antes de decidir.'],
    ],
  },
  {
    slug: 'design-de-sobrancelhas-comeca-pela-regua', seg: 'sobrancelhas', foto: 'sobrancelha-feita', data: '2026-09-23', min: 3,
    titulo: 'Design de sobrancelhas começa pela régua, não pela pinça',
    resumo: 'Onde a sobrancelha começa, sobe e termina depende do seu rosto, não da moda do ano.',
    corpo: [
      ['p', 'Antes de tirar o primeiro fio, a designer marca três pontos no seu rosto: onde a sobrancelha começa, onde fica o ponto mais alto do arco e onde ela termina. As medidas saem da linha do nariz, do centro da pupila e do canto externo do olho.'],
      ['h2', 'Por que medir'],
      ['p', 'Duas sobrancelhas nunca são iguais, e o rosto também não. A medida evita o erro mais comum, que é afinar demais o começo ou subir demais o arco, o que muda a sua expressão e leva meses para crescer de volta.'],
      ['h2', 'Henna, lamination ou só o design'],
      ['p', 'O design sozinho limpa e define. A henna preenche falhas e marca o desenho por alguns dias. A lamination penteia os fios para cima e dá volume por até seis semanas. A designer indica a melhor opção depois de ver os seus fios.'],
      ['p', 'Entre uma visita e outra, não tire fio nenhum dentro do desenho. Os fios de fora podem sair com pinça, com calma, uma vez por semana.'],
    ],
  },
];

// Avaliação inicial online (anamnese simplificada). [JURÍDICO] Dados de saúde = dados sensíveis (LGPD, art. 11):
// as respostas ficam só no navegador da cliente e só saem se ela tocar em enviar para a clínica.
// `seg`: a pergunta aparece se a cliente escolheu algum desses serviços. `regras`: resposta -> { segmento: [status, motivo] }
// status: 'atencao' (agendar com avaliação presencial ou teste) ou 'adiar' (esperar antes de fazer). Vale o mais restritivo.
const anamnese = [
  { id: 'fototipo', seg: ['laser'], pergunta: 'Como a sua pele reage ao sol?', ajuda: 'Escolha o tom mais parecido com a pele da parte de dentro do braço.',
    opcoes: [
      ['I', 'Sempre queima, nunca bronzeia', '#F6E3D6'], ['II', 'Queima fácil, bronzeia pouco', '#EDCFB8'], ['III', 'Às vezes queima, bronzeia aos poucos', '#D9AE8C'],
      ['IV', 'Quase não queima, bronzeia fácil', '#BC8A66'], ['V', 'Raramente queima, pele morena', '#8E5E40'], ['VI', 'Nunca queima, pele negra', '#5A3A28'],
    ],
    regras: { V: { laser: ['atencao', 'Pele mais escura: o laser de diodo funciona com parâmetros próprios, sempre depois do teste de mecha.'] }, VI: { laser: ['atencao', 'Pele mais escura: o laser de diodo funciona com parâmetros próprios, sempre depois do teste de mecha.'] } } },
  { id: 'pelo', seg: ['laser'], pergunta: 'De que cor são os pelos que você quer tirar com laser?',
    opcoes: [['escuro', 'Pretos ou castanho-escuros'], ['medio', 'Castanho-claros'], ['claro', 'Loiros, ruivos ou brancos']],
    regras: { claro: { laser: ['atencao', 'Pelos claros respondem pouco ao laser de diodo. Para essas áreas, a cera pode ser a melhor escolha.'] }, medio: { laser: ['atencao', 'Pelos castanho-claros podem precisar de mais sessões. A profissional confirma no teste de mecha.'] } } },
  { id: 'gestante', seg: ['laser', 'cera', 'cilios', 'sobrancelhas'], pergunta: 'Você está grávida ou amamentando?', sn: true,
    regras: { sim: { laser: ['adiar', 'Não fazemos laser na gestação nem na amamentação.'], cera: ['atencao', 'Na gestação a pele fica mais sensível. Fazemos com cera morna e sem passar por áreas com varizes.'] } } },
  { id: 'isotretinoina', seg: ['laser', 'cera', 'sobrancelhas'], pergunta: 'Usou isotretinoína (Roacutan e similares) nos últimos 6 meses?', sn: true,
    regras: { sim: { laser: ['adiar', 'Espere 6 meses depois da última dose.'], cera: ['adiar', 'Cera só 6 meses depois da última dose: a pele pode descolar junto.'], sobrancelhas: ['atencao', 'Design só com pinça, sem cera e sem linha.'] } } },
  { id: 'sol', seg: ['laser'], pergunta: 'Tomou sol ou fez bronzeamento nas áreas nos últimos 15 dias?', sn: true,
    regras: { sim: { laser: ['adiar', 'Espere 15 dias sem sol na área. Até lá, protetor solar FPS 50 todos os dias.'] } } },
  { id: 'remedios', seg: ['laser'], pergunta: 'Usa algum remédio que deixa a pele sensível à luz?', ajuda: 'Alguns antibióticos, anti-inflamatórios, diuréticos e remédios para acne. Se não souber, responda "Sim".', sn: true,
    regras: { sim: { laser: ['atencao', 'Leve o nome do remédio na avaliação. Pode ser preciso liberação médica.'] } } },
  { id: 'varizes', seg: ['cera'], pergunta: 'Tem varizes, flebite ou já teve trombose nas pernas?', sn: true,
    regras: { sim: { cera: ['atencao', 'Nas áreas com varizes não usamos cera quente. A profissional indica outra técnica na hora.'] } } },
  { id: 'acidos', seg: ['cera', 'sobrancelhas'], pergunta: 'Passou ácidos ou retinoides no rosto ou nas áreas nos últimos 7 dias?', sn: true,
    regras: { sim: { cera: ['adiar', 'Espere 7 dias sem ácidos na área.'], sobrancelhas: ['atencao', 'Design só com pinça até completar 7 dias sem ácidos.'] } } },
  { id: 'cola', seg: ['cilios'], pergunta: 'Já teve alergia a cola de cílios, esmalte em gel ou cola instantânea?', sn: true,
    regras: { sim: { cilios: ['adiar', 'Extensão com cola não é indicada. O lash lifting pode ser uma opção, depois do teste de alergia.'] } } },
  { id: 'olhos', seg: ['cilios'], pergunta: 'Está com o olho irritado, conjuntivite ou fez cirurgia nos olhos nos últimos 3 meses?', sn: true,
    regras: { sim: { cilios: ['adiar', 'Espere o olho ficar sem irritação ou traga a liberação do oftalmologista.'] } } },
  { id: 'henna', seg: ['sobrancelhas'], pergunta: 'Já teve alergia a henna, tintura de cabelo ou tatuagem de henna?', sn: true,
    regras: { sim: { sobrancelhas: ['atencao', 'Fazemos o design sem henna, ou com teste de alergia 48 horas antes.'] } } },
  { id: 'micro', seg: ['sobrancelhas'], pergunta: 'Fez micropigmentação nas sobrancelhas nos últimos 30 dias?', sn: true,
    regras: { sim: { sobrancelhas: ['adiar', 'Espere completar 30 dias da micropigmentação.'] } } },
];

// `seg`: a pergunta só aparece se o segmento estiver ligado
const faq = [
  ['A depilação a laser é definitiva?', 'Não prometemos depilação definitiva. O laser reduz os pelos aos poucos, sessão a sessão, e a maioria das clientes faz manutenção uma ou duas vezes por ano depois do pacote.', 'laser'],
  ['Tenho pele morena ou negra. Posso fazer laser?', 'Na maioria dos casos, sim. O laser de diodo permite ajustar a potência e o tempo do disparo para peles mais escuras. Por isso o teste de mecha na primeira visita é obrigatório.', 'laser'],
  ['O laser dói?', 'A sensação é de um estalo quente, que dura uma fração de segundo. O aparelho resfria a pele durante o disparo. Áreas com pelo mais grosso, como virilha e axilas, incomodam um pouco mais nas primeiras sessões.', 'laser'],
  ['A extensão estraga os meus cílios?', 'Bem aplicada, não. Cada fio sintético vai num cílio natural só, com peso adequado ao fio de baixo. O que estraga é arrancar a extensão em casa: para tirar, venha fazer a remoção.', 'cilios'],
  ['Posso molhar a extensão?', 'Depois das primeiras 24 horas, pode e deve. Lavar os cílios todo dia com espuma sem óleo ajuda a extensão a durar.', 'cilios'],
  ['De quanto em quanto tempo faço o design?', 'Em média a cada 20 a 30 dias. Se você quer deixar crescer para mudar o desenho, a designer monta um calendário com intervalos maiores.', 'sobrancelhas'],
  ['Cera dói menos se eu depilar sempre?', 'Sim. Com a depilação regular, o pelo volta mais fino e se solta com mais facilidade. Por isso o clube Pele lisa tem intervalo fixo.', 'cera'],
  ['Atendem homens?', 'Sim. Laser, cera e design de sobrancelhas também são feitos em homens, com a mesma tabela de áreas.'],
  ['A avaliação online substitui a presencial?', 'Não. Ela adianta a conversa e mostra se algo precisa de atenção antes de marcar. Para laser, a avaliação presencial com teste de mecha continua obrigatória.'],
];

// SEO local: bairros atendidos e o texto da seção "Perto de você" [EXEMPLO]
const bairros = ['Cambuí', 'Centro', 'Guanabara', 'Taquaral', 'Nova Campinas', 'Castelo', 'Barão Geraldo', 'Valinhos'];
const seoLocal = {
  titulo: 'Depilação a laser, cílios e sobrancelhas no Cambuí, em Campinas',
  texto: [
    'A Camélia Estética fica na Rua Coronel Quirino, no Cambuí, a duas quadras do Centro de Convivência. Atende clientes de todo o centro expandido de Campinas, de Barão Geraldo e de Valinhos, com hora marcada de segunda a sábado.',
    'Para quem vem de carro, há estacionamento conveniado a 80 metros. Os ônibus que passam pela Avenida Júlio de Mesquita param a cinco minutos a pé.',
  ],
};

module.exports = {
  marca, responsavel, abertura, horarios, equipe, fotos, segmentos, areas, laserPacotes, laserCombo, laserIntervalo, parcelas,
  servicos, provador, pagamento, etapas, contraindicacoes, politicas, seguranca, avisoResultado, antesDepois, google, clube, vale,
  produtos, entrega, posts, anamnese, faq, bairros, seoLocal,
};
