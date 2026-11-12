// Conteúdo do modelo Gold de pizzaria. Empresa fictícia "Fornalha Pizza Bar", usada só como demonstração.
// Tudo marcado com [EXEMPLO] é provisório e muda para cada cliente.

module.exports = {
  marca: {
    nome: 'Fornalha',
    completo: 'Fornalha Pizza Bar',
    frase: 'Pizza de fermentação lenta, massa fresca e drink de balcão, num forno a lenha que não apaga.',
    url: 'https://fornalha.exemplo.com.br/', // [EXEMPLO]
    whatsapp: '5511900000000', // [EXEMPLO]
    whatsappTexto: '(11) 90000-0000',
    telefone: '(11) 3000-0000', // [EXEMPLO]
    instagram: 'https://www.instagram.com/', // [EXEMPLO]
    instagramUser: '@fornalha.pizzabar',
    endereco: 'Rua Exemplo, 000, Pinheiros', // [EXEMPLO]
    cidade: 'São Paulo, SP',
    mapsQuery: 'Largo da Batata, Pinheiros, São Paulo',
    entregaMinima: 45,
    taxaEntrega: 8,
  },

  // dia da semana (0 = domingo) => [abre, fecha] em horas decimais; vários turnos por dia
  horarios: {
    0: [[12, 15.5], [18, 23]],
    1: [],
    2: [[18, 23.5]],
    3: [[18, 23.5]],
    4: [[18, 23.5]],
    5: [[18, 24]],
    6: [[12, 15.5], [18, 24]],
  },
  horariosTexto: [
    ['Segunda', 'Forno descansando'],
    ['Terça a quinta', '18h às 23h30'],
    ['Sexta', '18h à meia-noite'],
    ['Sábado', '12h às 15h30 e 18h à meia-noite'],
    ['Domingo', '12h às 15h30 e 18h às 23h'],
  ],

  bairros: [
    ['Pinheiros', true], ['Vila Madalena', true], ['Jardim Paulistano', true], ['Alto de Pinheiros', true],
    ['Butantã', false], ['Perdizes', false],
  ],

  categorias: [
    { id: 'pizza', nome: 'Pizzas', titulo: 'Pizzas de forno a lenha' },
    { id: 'massa', nome: 'Massas', titulo: 'Massas frescas da casa' },
    { id: 'salada', nome: 'Saladas', titulo: 'Saladas' },
    { id: 'drink', nome: 'Drinks', titulo: 'Drinks e bebidas' },
    { id: 'dividir', nome: 'Pra dividir', titulo: 'Pra dividir na mesa' },
  ],

  // tags: veg (vegetariano), picante, novo, zero (sem álcool)
  // pizzas têm dois tamanhos: broto (4 fatias) e grande (8 fatias)
  itens: [
    { id: 'margherita', cat: 'pizza', nome: 'Margherita da Nonna', preco: 62, broto: 39, tags: ['veg'], fav: true,
      desc: 'Molho de tomate San Marzano, fior di latte, manjericão fresco e azeite extravirgem. A pizza que abriu o forno.' },
    { id: 'pepperoni', cat: 'pizza', nome: 'Pepperoni na Brasa', preco: 69, broto: 44, tags: ['picante'], fav: true,
      desc: 'Pepperoni artesanal que enrola na brasa, mozzarella e um fio de mel com pimenta calabresa.' },
    { id: 'burrata', cat: 'pizza', nome: 'Burrata e Tomatinho', preco: 78, broto: 49, tags: ['veg', 'novo'], fav: true,
      desc: 'Burrata inteira que vai depois do forno, tomate confit, pesto de manjericão e flor de sal.' },
    { id: 'verde', cat: 'pizza', nome: 'Verde Fornalha', preco: 66, broto: 42, tags: ['veg'],
      desc: 'Espinafre salteado, ricota de búfala, alho confit e raspas de limão siciliano.' },
    { id: 'calabresa', cat: 'pizza', nome: 'Calabresa Caipira', preco: 59, broto: 37, tags: [],
      desc: 'Calabresa defumada fatiada fina, cebola roxa, azeitona preta e orégano.' },
    { id: 'portuguesa', cat: 'pizza', nome: 'Portuguesa da Casa', preco: 64, broto: 40, tags: [],
      desc: 'Presunto cozido, ovo caipira, cebola, ervilha fresca, azeitona e mozzarella.' },
    { id: 'frango', cat: 'pizza', nome: 'Frango com Catupiry', preco: 62, broto: 39, tags: [],
      desc: 'Frango desfiado na manteiga, catupiry original e milho tostado no forno.' },
    { id: 'horta', cat: 'pizza', nome: 'Horta Assada', preco: 58, broto: 36, tags: ['veg'],
      desc: 'Abobrinha, pimentão assado, tomate, azeitona e manjericão sobre molho da casa.' },

    { id: 'carbonara', cat: 'massa', nome: 'Spaghetti Carbonara', preco: 54, tags: [], fav: true,
      desc: 'Guanciale crocante, gema caipira, pecorino romano e pimenta-do-reino moída na hora.' },
    { id: 'arrabbiata', cat: 'massa', nome: "Penne all'Arrabbiata", preco: 46, tags: ['veg', 'picante'],
      desc: 'Molho de tomate com alho, pimenta seca e salsinha. Picância que chega devagar.' },
    { id: 'mar', cat: 'massa', nome: 'Spaghetti do Mar', preco: 72, tags: [],
      desc: 'Camarão, lula e tomate cereja salteados no vinho branco, com finalização de salsinha.' },
    { id: 'ragu', cat: 'massa', nome: 'Tagliatelle ao Ragu', preco: 58, tags: [],
      desc: 'Ragu de costela cozido por oito horas, tagliatelle feito aqui e parmesão curado.' },
    { id: 'lasanha', cat: 'massa', nome: 'Lasanha da Casa', preco: 56, tags: [],
      desc: 'Bolonhesa, bechamel e mozzarella, gratinada no forno a lenha até a borda estalar.' },
    { id: 'pomodoro', cat: 'massa', nome: 'Spaghetti Pomodoro', preco: 42, tags: ['veg'],
      desc: 'Tomate fresco, manjericão e azeite. Simples do jeito que tem que ser.' },

    { id: 'caesar', cat: 'salada', nome: 'Caesar da Fornalha', preco: 38, tags: [],
      desc: 'Alface romana, molho caesar da casa, parmesão e croutons feitos com a nossa massa.' },
    { id: 'bowl', cat: 'salada', nome: 'Bowl Colorido', preco: 42, tags: ['veg'],
      desc: 'Grão-de-bico assado, abacate, abóbora, rabanete, tomatinho e brotos.' },
    { id: 'frutas', cat: 'salada', nome: 'Verdes e Frutas Vermelhas', preco: 39, tags: ['veg', 'novo'],
      desc: 'Folhas, mirtilo, morango, queijo feta e sementes tostadas com vinagrete de framboesa.' },
    { id: 'horta-salada', cat: 'salada', nome: 'Salada da Horta', preco: 34, tags: ['veg'],
      desc: 'Folhas da estação, cenoura, beterraba, rabanete e molho de mostarda e mel.' },
    { id: 'farfalle', cat: 'salada', nome: 'Farfalle Fria ao Pesto', preco: 36, tags: ['veg'],
      desc: 'Farfalle, pesto de manjericão, tomate cereja e rúcula. Massa que virou salada.' },

    { id: 'sangria', cat: 'drink', nome: 'Sangria de Frutas Vermelhas', preco: 34, tags: [], fav: true,
      desc: 'Vinho tinto, frutas vermelhas, laranja desidratada e um toque de canela.' },
    { id: 'amaro', cat: 'drink', nome: 'Amaro Tônica', preco: 32, tags: ['novo'],
      desc: 'Amaro italiano, tônica, alecrim tostado e casca de laranja.' },
    { id: 'old-fashioned', cat: 'drink', nome: 'Old Fashioned da Brasa', preco: 38, tags: [],
      desc: 'Bourbon, açúcar mascavo defumado no forno, angostura e laranja.' },
    { id: 'cosmo', cat: 'drink', nome: 'Cosmopolitan', preco: 34, tags: [],
      desc: 'Vodca, licor de laranja, cranberry e limão espremido na hora.' },
    { id: 'limonada', cat: 'drink', nome: 'Limonada Siciliana', preco: 16, tags: ['zero'],
      desc: 'Limão siciliano, hortelã e água com gás. Sem álcool.' },
    { id: 'cha', cat: 'drink', nome: 'Chá Gelado da Casa', preco: 14, tags: ['zero'],
      desc: 'Chá preto gelado com limão e um fio de mel. Sem álcool.' },

    { id: 'tabua', cat: 'dividir', nome: 'Tábua da Fornalha', preco: 89, tags: [], fav: true,
      desc: 'Copa, salame, queijos da casa, azeitonas, uvas e pão de fermentação natural.' },
    { id: 'bruschetta', cat: 'dividir', nome: 'Bruschetta de Tomate', preco: 32, tags: ['veg'],
      desc: 'Pão da casa tostado na brasa, tomate, manjericão, alho e azeite.' },
    { id: 'polpettine', cat: 'dividir', nome: 'Polpettine na Rúcula', preco: 44, tags: [],
      desc: 'Almôndegas de carne assadas no forno sobre rúcula, com molho de tomate à parte.' },
    { id: 'fritas', cat: 'dividir', nome: 'Fritas com Parmesão', preco: 34, tags: ['veg'],
      desc: 'Batata frita fina, parmesão ralado, salsinha e maionese de alho assado.' },
    { id: 'rustica', cat: 'dividir', nome: 'Batata Rústica Picante', preco: 29, tags: ['veg', 'picante'],
      desc: 'Batata com casca, páprica defumada e pimenta, crocante por fora.' },
    { id: 'tiramisu', cat: 'dividir', nome: 'Tiramisù de Colher', preco: 28, tags: ['veg'],
      desc: 'Café, mascarpone e cacau. A sobremesa que todo mundo divide e ninguém admite.' },
  ],

  bordas: [
    ['Sem borda recheada', 0],
    ['Borda de catupiry', 12],
    ['Borda de cheddar', 12],
    ['Borda de chocolate', 14],
  ],

  ocasioes: ['Jantar', 'Aniversário', 'Encontro', 'Reunião de amigos', 'Família'],
};
