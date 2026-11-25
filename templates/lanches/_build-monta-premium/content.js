// Conteúdo do modelo Gold de fast food. Marca fictícia: Monta Burger.
// [EXEMPLO] = dado de demonstração, trocar pelo do cliente.
module.exports = {
  marca: {
    nome: 'Monta',
    completo: 'Monta Burger',
    frase: 'Burger prensado na chapa na hora em que você pede. Pão brioche, blend moído no dia e entrega rápida na Savassi.',
    whatsapp: '5531999990000', // [EXEMPLO]
    whatsappTexto: '(31) 99999-0000', // [EXEMPLO]
    telefone: '(31) 3333-0000', // [EXEMPLO]
    endereco: 'Av. Getúlio Vargas, 1300', // [EXEMPLO]
    bairro: 'Savassi',
    cidade: 'Belo Horizonte, MG',
    instagram: 'https://www.instagram.com/', // [EXEMPLO]
    instagramUser: '@montaburger', // [EXEMPLO]
    facebook: 'https://www.facebook.com/', // [EXEMPLO]
    tiktok: 'https://www.tiktok.com/', // [EXEMPLO]
    ifood: 'https://www.ifood.com.br/', // [EXEMPLO] link da loja no iFood
    food99: 'https://food.99app.com/', // [EXEMPLO] link da loja no 99Food
    site: 'https://montaburger.com.br/', // [EXEMPLO]
    desde: 2017,
  },

  // dia da semana (0 = domingo): [abre, fecha] em horas, null = fechado
  horarios: {
    0: [11, 23], 1: null, 2: [11, 23], 3: [11, 23], 4: [11, 23.5], 5: [11, 24], 6: [11, 24],
  },
  horarioTexto: 'Terça a domingo, das 11h à meia-noite',

  // painel da loja (Área do Cliente): acesso de demonstração
  acesso: { email: 'loja@montaburger.com.br', senha: 'monta2026', responsavel: 'Juliana Prado' },

  categorias: [
    { id: 'hamburguer', nome: 'Hambúrguer' },
    { id: 'bebidas', nome: 'Bebidas' },
    { id: 'pizza', nome: 'Pizza' },
    { id: 'combos', nome: 'Combos' },
    { id: 'promocao', nome: 'Promoção' },
  ],

  // foto = arquivo em assets/img/ (sem extensão). promo = preço promocional (opcional).
  // destaque = aparece em "Os mais pedidos".
  produtos: [
    { id: 'smash', cat: 'hamburguer', nome: 'Smash da Casa', foto: 'smash', preco: 29.9, desc: 'Dois smash de 80 g prensados na chapa, cheddar duplo, cebola na manteiga e molho Monta no brioche.' },
    { id: 'classico', cat: 'hamburguer', nome: 'Clássico Monta', foto: 'classico', preco: 27.9, desc: 'Blend de 160 g, queijo prato, alface, tomate, cebola roxa e maionese da casa.' },
    { id: 'bacon', cat: 'hamburguer', nome: 'Bacon Duplo', foto: 'bacon', preco: 36.9, promo: 31.9, destaque: true, desc: 'Dois blends de 120 g, bacon crocante, cheddar derretido e barbecue de rapadura.' },
    { id: 'melt', cat: 'hamburguer', nome: 'Cheddar Melt', foto: 'escuro', preco: 33.9, desc: 'Blend de 160 g afogado no cheddar cremoso, cebola caramelizada e picles.' },
    { id: 'crispy', cat: 'hamburguer', nome: 'Crispy Chicken', foto: 'crispy', preco: 28.9, desc: 'Sobrecoxa empanada no flocão, salada de repolho e maionese de alho.' },
    { id: 'costela', cat: 'hamburguer', nome: 'Costela BBQ', foto: 'costela', preco: 38.9, desc: 'Costela desfiada prensada na chapa, queijo coalho, barbecue e cebola crispy.' },
    { id: 'veggie', cat: 'hamburguer', nome: 'Veggie do Grão', foto: 'veggie', preco: 26.9, desc: 'Burger de grão-de-bico e beterraba, queijo, rúcula, tomate e maionese verde.' },
    { id: 'trufado', cat: 'hamburguer', nome: 'Triplo Trufado', foto: 'trufado', preco: 44.9, desc: 'Três blends de 100 g, três fatias de cheddar e maionese trufada. Pra quem chegou com fome.' },

    { id: 'cola', cat: 'bebidas', nome: 'Cola com gelo e limão', foto: 'cha', preco: 8.9, desc: 'Lata de 350 ml servida no copo com gelo e limão.' },
    { id: 'limonada', cat: 'bebidas', nome: 'Limonada suíça', foto: 'limonada', preco: 12.9, desc: 'Limão batido com casca, açúcar e gelo. 500 ml.' },
    { id: 'shake-oreo', cat: 'bebidas', nome: 'Shake de Oreo', foto: 'shake-oreo', preco: 19.9, desc: 'Sorvete de baunilha, biscoito Oreo e calda de chocolate. 400 ml.' },
    { id: 'shake-morango', cat: 'bebidas', nome: 'Shake de morango', foto: 'shake-morango', preco: 18.9, desc: 'Sorvete de creme com morango fresco batido. 400 ml.' },
    { id: 'chopp', cat: 'bebidas', nome: 'Chopp pilsen', foto: 'chopp', preco: 14.9, desc: 'Caneca de 500 ml, tirado na hora. Só no balcão e no delivery próprio.' },

    { id: 'margherita', cat: 'pizza', nome: 'Margherita', foto: 'margherita', preco: 49.9, desc: 'Molho de tomate, muçarela, manjericão fresco e azeite. 8 fatias.' },
    { id: 'pepperoni', cat: 'pizza', nome: 'Pepperoni', foto: 'pepperoni', preco: 56.9, promo: 49.9, destaque: true, desc: 'Muçarela e pepperoni fatiado fininho, que fica crocante na borda. 8 fatias.' },
    { id: 'calabresa', cat: 'pizza', nome: 'Calabresa', foto: 'calabresa', preco: 52.9, desc: 'Calabresa artesanal, cebola roxa, muçarela e orégano. 8 fatias.' },
    { id: 'portuguesa', cat: 'pizza', nome: 'Portuguesa', foto: 'portuguesa', preco: 54.9, desc: 'Presunto, ovo, cebola, azeitona, ervilha e muçarela. 8 fatias.' },

    { id: 'combo-monta', cat: 'combos', nome: 'Combo Monta', foto: 'combo', preco: 39.9, promo: 34.9, destaque: true, desc: 'Clássico Monta, fritas média e uma bebida de lata.' },
    { id: 'combo-casal', cat: 'combos', nome: 'Combo Casal', foto: 'cesta', preco: 79.9, desc: 'Dois burgers à escolha, fritas grande e duas bebidas de lata.' },
    { id: 'combo-duplo', cat: 'combos', nome: 'Combo Smash em dobro', foto: 'categoria-burger', preco: 54.9, desc: 'Dois Smash da Casa e uma porção de onion rings.' },
    { id: 'combo-galera', cat: 'combos', nome: 'Combo Galera', foto: 'mesa', preco: 149.9, desc: 'Quatro burgers, duas porções de fritas, onion rings e quatro bebidas.' },

    { id: 'fritas-cheddar', cat: 'promocao', nome: 'Fritas cheddar e bacon', foto: 'fritas', preco: 22.9, promo: 17.9, destaque: true, desc: 'Porção grande com cheddar cremoso e farofa de bacon por cima.' },
    { id: 'burger-dia', cat: 'promocao', nome: 'Burger do dia', foto: 'derretido', preco: 24.9, promo: 19.9, desc: 'Muda todo dia, sempre com queijo escorrendo. Pergunte no pedido qual é o de hoje.' },
    { id: 'asinhas', cat: 'promocao', nome: 'Asinhas BBQ', foto: 'wings', preco: 29.9, promo: 24.9, desc: 'Dez asinhas assadas e pinceladas no barbecue picante, com molho ranch.' },
    { id: 'onion', cat: 'promocao', nome: 'Onion rings', foto: 'onion', preco: 21.9, promo: 16.9, desc: 'Anéis de cebola empanados na cerveja, com maionese defumada.' },
  ],

  // camadas do hambúrguer que se monta na capa (rótulo de cada ingrediente)
  ingredientes: {
    'pao-cima': 'Brioche selado na manteiga',
    alface: 'Alface americana',
    tomate: 'Tomate fresco',
    cebola: 'Cebola roxa e picles',
    queijo: 'Cheddar derretido',
    carne: 'Blend de 160 g',
    'alface-baixo': 'Mais alface',
    'pao-baixo': 'Brioche de baixo',
  },

  depoimentos: [
    { nome: 'Ana Ribeiro', papel: 'Pede toda sexta pelo iFood', foto: 'cliente-ana', texto: 'O Bacon Duplo chega quente e o pão não fica molhado. Já virou o lanche oficial da sexta aqui em casa.' },
    { nome: 'Davi Santos', papel: 'Cliente do balcão desde 2019', foto: 'cliente-davi', texto: 'Dá pra ver o smash sendo prensado na chapa enquanto espera. O cheiro já resolve a fome.' },
    { nome: 'Júlia Moreira', papel: 'Pediu pelo 99Food', foto: 'cliente-julia', texto: 'Chegou em vinte e cinco minutos, bem embalado e com o molho à parte. O shake de Oreo é perigoso.' },
    { nome: 'Rafael Costa', papel: 'Combo Galera no aniversário', foto: null, texto: 'Pedi o Combo Galera pra oito pessoas e sobrou fritas. Todo mundo perguntou de onde era.' },
    { nome: 'Marina Lopes', papel: 'Vegetariana e cliente fiel', foto: null, texto: 'Finalmente um veggie que não parece castigo. O de grão-de-bico tem crosta de chapa de verdade.' },
    { nome: 'Thiago Alves', papel: 'Pede direto pelo site', foto: null, texto: 'Monto a sacola no site, mando no WhatsApp e ainda ganho 10%. Em meia hora tá na porta.' },
  ],

  // bairros de entrega: [nome, entrega ativa]
  bairros: [
    ['Savassi', true], ['Funcionários', true], ['Lourdes', true], ['Santo Antônio', true],
    ['Cruzeiro', true], ['Serra', true], ['São Pedro', true], ['Anchieta', false],
  ],
};
