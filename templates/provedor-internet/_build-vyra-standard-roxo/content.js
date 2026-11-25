// =============================================================
// CONTEÚDO DO VYRA STANDARD ROXO. Edite aqui e rode:
//   node templates/provedor-internet/_build-vyra-standard-roxo/build.js
// Planos, FAQ, avaliações e dados de contato vêm do conteúdo comum da Vyra
// (../_build/content.js); o que é só deste modelo fica abaixo.
// Itens marcados com [EXEMPLO] são provisórios: troque pelos dados reais.
// =============================================================
const base = require('../_build/content');

module.exports = {
  ...base,

  contact: {
    ...base.contact,
    address: 'Rua Exemplo, 000, Centro',            // [EXEMPLO]
    city: 'Marialva, PR',
    hours: [
      ['Atendimento', 'Seg a sex, 8h às 18h. Sáb, 8h às 12h'], // [EXEMPLO]
      ['Suporte técnico', '24 horas, todos os dias'],           // [EXEMPLO]
    ],
  },

  empresa: {
    nome: 'Vyra Fibra',
    razao: 'Vyra Telecomunicações Ltda.',           // [EXEMPLO] fictício
    cnpj: '00.000.000/0001-00',                     // [EXEMPLO] fictício
    anatel: 'Autorização SCM da Anatel',            // [EXEMPLO]
    endereco: 'Rua Exemplo, 000, Centro',           // [EXEMPLO]
    cidade: 'Marialva, PR',
    cep: '86990-000',                               // [EXEMPLO]
    instagram: '@vyra.fibra',                       // [EXEMPLO] perfil fictício
    mapa: 'https://www.openstreetmap.org/?mlat=-23.4850&mlon=-51.7920#map=16/-23.4850/-51.7920',
    rota: 'https://www.openstreetmap.org/directions?to=-23.4850%2C-51.7920',
  },

  // Navegação igual à do Vyra Standard, com a página da equipe.
  menu: [
    { href: 'index.html', label: 'Início', id: 'index' },
    { href: 'sobre.html', label: 'Sobre nós', id: 'sobre' },
    { href: 'residencial.html', label: 'Residencial', id: 'residencial' },
    { href: 'empresas.html', label: 'Empresas', id: 'empresas' },
    { href: 'equipe.html', label: 'Equipe', id: 'equipe' },
    { href: 'faq.html', label: 'FAQ', id: 'faq' },
    { href: 'contato.html', label: 'Contato', id: 'contato' },
  ],

  // Carrossel de abertura: sempre gente usando a internet em casa e no trabalho.
  vitrine: [
    { img: 'familia_tv_sala.jpg', pos: '50% 30%', alt: 'Pai, mãe e filho assistindo TV juntos no sofá da sala', tag: 'Plano Família', title: 'Sessão de filme sem <em>aquela rodinha girando.</em>', text: '800 Mega de fibra, Wi-Fi 6 com ponto mesh e YouTube Premium incluso.', price: '129,90', cta: 'assine.html#familia' },
    { img: 'jovens_sofa_fones.jpg', pos: '50% 40%', alt: 'Dois jovens de fone no sofá, um no notebook e outra no celular', tag: 'Casa cheia de telas', title: 'Cada um na sua tela, <em>todo mundo rápido.</em>', text: 'Aula online, jogo e série ao mesmo tempo, sem disputa pelo Wi-Fi.', price: '99,90', cta: 'residencial.html' },
    { img: 'colegas_soquinho.jpg', pos: '50% 35%', alt: 'Colegas comemorando com um soquinho na frente do notebook no escritório', tag: 'Vyra Empresas', title: 'A equipe comemora. <em>A conexão aguenta.</em>', text: 'IP fixo, SLA em contrato e um consultor que conhece a sua operação.', price: '199,90', cta: 'empresas.html' },
    { img: 'senhora_tablet.jpg', pos: '50% 30%', alt: 'Senhora sorrindo enquanto usa o tablet no sofá', tag: 'Suporte de perto', title: 'Dúvida no Wi-Fi? <em>Gente da região atende.</em>', text: 'Suporte 24 horas por WhatsApp, telefone ou visita técnica agendada.', price: '99,90', cta: 'contato.html' },
  ],

  // Serviços por segmento: o que inclui, prazo e valor. [EXEMPLO]
  segmentos: [
    { id: 'casa', nome: 'Para casa' },
    { id: 'empresa', nome: 'Para empresas' },
    { id: 'rural', nome: 'Chácaras e sítios' },
    { id: 'extra', nome: 'Adicionais' },
  ],
  servicos: [
    { seg: 'casa', nome: 'Instalação residencial', img: 'casal_tv.jpg', inclui: ['Fibra até o roteador', 'Roteador Wi-Fi 6 em comodato', 'Teste de velocidade com você'], prazo: 'Agendada em até 48h, visita de cerca de 1h30', valor: 'Grátis nos planos residenciais' },
    { seg: 'casa', nome: 'Ponto extra Wi-Fi mesh', img: 'mulher_tablet_janela.jpg', inclui: ['Roteador mesh Wi-Fi 6', 'Configuração pelo técnico', 'Sinal no quarto, quintal ou escritório'], prazo: 'Visita de cerca de 40 min', valor: '+ R$ 19,90/mês' },
    { seg: 'casa', nome: 'Mudança de endereço', img: 'familia_cinco.jpg', inclui: ['Retirada e reinstalação', 'Mesmo plano e mesmo contrato', 'Análise de cobertura antes'], prazo: 'Agendada em até 72h', valor: 'a partir de R$ 0 com 7 dias de aviso' },
    { seg: 'empresa', nome: 'Empresa com IP fixo', img: 'dona_negocio.jpg', inclui: ['IP fixo incluso', 'Wi-Fi corporativo', 'Suporte prioritário'], prazo: 'Instalação em até 72h, visita de cerca de 2h', valor: 'a partir de R$ 199,90/mês' },
    { seg: 'empresa', nome: 'Link dedicado', img: 'equipe_joinha.jpg', inclui: ['Banda simétrica garantida', 'SLA de reparo em 4h', 'Monitoramento 24h'], prazo: 'Projeto em até 5 dias úteis', valor: 'Sob consulta' },
    { seg: 'empresa', nome: 'Rede interna do escritório', img: 'equipe_notebook_risos.jpg', inclui: ['Cabeamento e pontos de rede', 'Wi-Fi para clientes separado', 'Relatório da rede'], prazo: 'Visita técnica de 2h a 4h', valor: 'a partir de R$ 350 por projeto' },
    { seg: 'rural', nome: 'Fibra na chácara', img: 'familia_sofa.jpg', inclui: ['Estudo de viabilidade', 'Lançamento de cabo até a sede', 'Mesma velocidade da cidade'], prazo: 'Viabilidade em até 5 dias úteis', valor: 'a partir de R$ 129,90/mês + projeto' },
    { seg: 'rural', nome: 'Wi-Fi para área externa', img: 'amigos_celular.jpg', inclui: ['Ponto externo resistente à chuva', 'Sinal na varanda e na piscina', 'Instalação em poste ou parede'], prazo: 'Visita de cerca de 2h', valor: 'a partir de R$ 29,90/mês' },
    { seg: 'rural', nome: 'Conexão no barracão', img: 'empreendedor_mesa.jpg', inclui: ['Fibra até o escritório da propriedade', 'Wi-Fi para o barracão e a sede', 'Câmeras e sistemas do agro online'], prazo: 'Viabilidade em até 5 dias úteis', valor: 'a partir de R$ 199,90/mês + projeto' },
    { seg: 'extra', nome: 'IP fixo residencial', img: 'gamer_sofa.jpg', inclui: ['Endereço fixo para câmeras e servidor', 'Ideal para jogos e acesso remoto', 'Ativação sem visita'], prazo: 'Ativação em até 24h', valor: '+ R$ 29,90/mês' },
    { seg: 'extra', nome: 'Streaming na conta', img: 'tv_pai_filho.jpg', inclui: ['Netflix, Max ou Prime Video', 'Cobrança junto com a internet', 'Cancele o adicional quando quiser'], prazo: 'Ativação no mesmo dia', valor: 'a partir de + R$ 19,90/mês' },
    { seg: 'extra', nome: 'Visita técnica avulsa', img: 'tecnico_capacete.jpg', inclui: ['Revisão de cabos e roteador', 'Ajuste do Wi-Fi da casa', 'Orientação sobre os aparelhos'], prazo: 'Visita de cerca de 1h', valor: 'Grátis quando a falha é da rede Vyra' },
  ],

  pagamento: [
    ['Formas de pagamento', 'Pix, boleto, débito automático ou cartão de crédito recorrente.'],
    ['Vencimento', 'Você escolhe o dia: 5, 10, 15, 20 ou 25 de cada mês.'],
    ['Primeira fatura', 'Proporcional aos dias de uso a partir da instalação.'],
    ['Atraso', 'Multa de 2% e juros de 1% ao mês, proporcionais aos dias.'],
  ],
  cancelamento: [
    ['Remarcar a visita', 'Sem custo até 2 horas antes do horário, pelo WhatsApp ou telefone.'],
    ['Atraso do técnico', 'Se passar de 30 minutos, avisamos antes e você pode remarcar com prioridade.'],
    ['Ausência no horário', 'O técnico espera 15 minutos. Depois disso a visita é remarcada; a segunda ausência seguida tem taxa de R$ 30.'],
    ['Cancelar o plano', 'Sem fidelidade, sem multa. Com fidelidade, multa proporcional aos meses que faltam.'],
  ],

  // Equipe fictícia. Fotos de banco de imagens: troque por fotos reais da equipe. [EXEMPLO]
  equipe: [
    { nome: 'Camila Rocha', funcao: 'Atendimento ao cliente', foto: 'atendente_headset.jpg', pos: '70% 30%', esp: ['Assinaturas', 'Troca de plano', 'Faturas'], campo: false },
    { nome: 'Rogério Alves', funcao: 'Técnico de campo', foto: 'tecnico_capacete.jpg', pos: '50% 20%', esp: ['Instalação', 'Área rural', 'Fusão de fibra'], campo: true },
    { nome: 'Júlia Tanaka', funcao: 'Suporte técnico', foto: 'atendente_mesa.jpg', pos: '45% 30%', esp: ['Wi-Fi e mesh', 'Diagnóstico remoto', 'Atendimento 24h'], campo: false },
    { nome: 'Diego Martins', funcao: 'Engenheiro de rede', foto: 'homem_escritorio.jpg', pos: '50% 30%', esp: ['Monitoramento', 'Link dedicado', 'Projetos'], campo: true },
    { nome: 'Fernanda Lima', funcao: 'Consultora Vyra Empresas', foto: 'empresaria_notebook.jpg', pos: '30% 30%', esp: ['Planos empresariais', 'SLA', 'Propostas'], campo: false },
    { nome: 'André Souza', funcao: 'Técnico de campo', foto: 'jovem_notebook.jpg', pos: '55% 25%', esp: ['Instalação', 'Wi-Fi mesh', 'Mudança de endereço'], campo: true },
  ],

  // Galeria por categoria
  galeria: [
    { cat: 'casa', img: 'familia_tv_sala.jpg', alt: 'Família assistindo TV junta no sofá' },
    { cat: 'casa', img: 'mae_filha_tablet.jpg', alt: 'Mãe e filha no sofá com o tablet' },
    { cat: 'casa', img: 'senhora_tablet.jpg', alt: 'Senhora sorrindo com o tablet' },
    { cat: 'casa', img: 'mulher_celular_sofa.jpg', alt: 'Mulher usando o celular no sofá' },
    { cat: 'lazer', img: 'jovens_sofa_fones.jpg', alt: 'Dois jovens de fone usando notebook e celular' },
    { cat: 'lazer', img: 'jovem_cama_celular.jpg', alt: 'Jovem deitada na cama mexendo no celular' },
    { cat: 'lazer', img: 'amigos_game.jpg', alt: 'Amigos jogando videogame no sofá' },
    { cat: 'lazer', img: 'jovem_selfie.jpg', alt: 'Jovem de fone fazendo selfie com o celular' },
    { cat: 'trabalho', img: 'colegas_soquinho.jpg', alt: 'Colegas comemorando no escritório' },
    { cat: 'trabalho', img: 'equipe_vibra.jpg', alt: 'Equipe vibrando na frente do notebook' },
    { cat: 'trabalho', img: 'mulher_tablet_janela.jpg', alt: 'Mulher trabalhando no tablet perto da janela' },
    { cat: 'trabalho', img: 'empreendedora_caixas.jpg', alt: 'Empreendedora no notebook entre caixas de pedidos' },
    { cat: 'equipe', img: 'atendente_headset.jpg', alt: 'Atendente da Vyra com headset' },
    { cat: 'equipe', img: 'tecnico_capacete.jpg', alt: 'Técnico de campo de capacete e uniforme' },
    { cat: 'equipe', img: 'equipe_joinha.jpg', alt: 'Equipe fazendo joinha em volta do notebook' },
    { cat: 'equipe', img: 'equipe_reuniao.jpg', alt: 'Reunião animada da equipe' },
  ],
  galeriaCats: [['todas', 'Todas'], ['casa', 'Em casa'], ['lazer', 'Diversão'], ['trabalho', 'Trabalho'], ['equipe', 'Nossa equipe']],

  // Grade do Instagram (perfil fictício)
  insta: [
    { img: 'jovem_fone_joinha.jpg', alt: 'Jovem de fone fazendo joinha', txt: 'Aula online sem travar' },
    { img: 'familia_tv_sala.jpg', alt: 'Família vendo TV', txt: 'Sexta é dia de filme' },
    { img: 'equipe_vibra.jpg', alt: 'Equipe comemorando', txt: 'Bastidores da Vyra' },
    { img: 'mae_filha_tablet.jpg', alt: 'Mãe e filha com tablet', txt: 'Desenho no tablet' },
    { img: 'amigas_cafe.jpg', alt: 'Amigas no café olhando o celular', txt: 'Wi-Fi bom é assim' },
    { img: 'tecnico_capacete.jpg', alt: 'Técnico de campo', txt: 'Conheça o Rogério' },
  ],

  horarios: ['8h00', '10h00', '13h30', '15h30', '17h00'],
};
