# Fast food: modelo Gold "Monta Burger"

Nicho **fast food** (hamburgueria com pizza, combos e bebidas). Template de demonstração para mostrar a clientes, com empresa fictícia (Monta Burger, Savassi, Belo Horizonte).
Referência visual enviada: landing page "FatFood" (vermelho e branco, círculo vermelho atrás do lanche, cartões flutuantes de desconto e depoimento, faixa de apps de entrega, rodapé vermelho arredondado).

| Pasta | O que é |
|---|---|
| `_build/content.js` | Todo o conteúdo: marca, contatos, horários, acesso do painel, categorias, produtos com preço e promoção, rótulos dos ingredientes, depoimentos e bairros. `[EXEMPLO]` = trocar por cliente |
| `_build/build.js` | Gera `index.html` (site) e `painel.html` (Área do Cliente) e copia os arquivos |
| `_build/style.css`, `_build/app.js` | Design e interação do site |
| `_build/painel.css`, `_build/painel.js` | Design e interação da Área do Cliente |
| `_build/cardapio.js` | Cardápio compartilhado: lê o padrão embutido e o que o painel publicou |
| `_build/icons.js` | Logo (burger empilhado) e ícones desenhados para a marca |
| `_build/camadas.js` | Recorta a foto do hambúrguer desmontado em camadas e tira o fundo da foto montada |
| `_build/img/fonte/` | As duas fotos enviadas pelo usuário (desmontado e montado) |
| `_build/img/camadas/` | Camadas recortadas (WebP com transparência) e `camadas.json` com a posição de cada uma |
| `_build/img/fotos/` | Fotos dos pratos (Unsplash, as mesmas do Braseiro e da Fornalha) |
| `_build/img/video/` | `chapa.mp4`: chapeiro prensando o smash na chapa (Pexels 37296040, licença livre) |
| `site-gold/` | **Site pronto** (abre direto pelo `index.html`) |

## Gerar

```bash
node templates/fastfood/_build/build.js
```

Camadas e mapa só precisam ser gerados de novo se as fotos ou o endereço mudarem (precisam do `sharp` instalado fora do projeto):

```bash
NODE_PATH=<pasta com node_modules/sharp> node templates/fastfood/_build/camadas.js
NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js ketchup img/mapa_savassi.webp   # rodar dentro de _build/
```

## Como é

- **Capa em vídeo**: o chapeiro prensando o smash ocupa a tela inteira, com zoom lento, véu escuro, título, botões e status do horário. O **cartão de 10% off** entra com mola, conta de 0 a 10, flutua, tem um brilho que passa e inclina seguindo o mouse. Botão de pausar o vídeo
- **Letreiro**: faixa vermelha inclinada que corre com as frases da casa e o símbolo do burger entre elas (pausa no hover)
- **Segunda seção: hambúrguer que se monta**: a foto do lanche desmontado foi cortada em oito camadas (pão, alface, tomate, cebola e pepino, queijo, carne, alface, pão). O corte segue a cor de cada ingrediente, então nada sai pela metade. Ao rolar, a capa fica parada e as camadas descem e sobem até se encaixarem (as de baixo chegam primeiro), com rótulos de cada ingrediente que somem conforme o lanche fecha. No fim, a pilha dá lugar à foto do lanche montado com um pulinho. A sombra sobe junto com o pão de baixo e o círculo vermelho cresce. Com movimento reduzido, mostra direto o lanche montado
- **Canais**: faixa com iFood, 99Food, WhatsApp e retirada (nomes em texto, sem logos de terceiros)
- **Vídeo do queijo**: cheddar no maçarico (segundo clipe do Pexels, o mesmo da capa do Braseiro), toca sem som quando aparece na tela e pausa quando sai; botão de pausar; não toca com economia de dados
- **Cardápio**: busca na mesma linha das abas; marcador vermelho que desliza até a aba escolhida e a grade some e volta suave na troca; abas por categoria (Hambúrguer, Bebidas, Pizza, Combos, Promoção) com contador, busca sem acento, selo de desconto, botão + que joga a foto voando até a sacola
- **Os mais pedidos (promoção)**: produtos marcados como destaque no painel; o primeiro ganha o cartão grande
- **Sobre**: história, fotos do salão e do chapeiro, números da casa que contam ao aparecer (2017, 160 g, 25 min, 40 mil)
- **Peça pelo app**: blocos do iFood e do 99Food com tempo e taxa, mais o pedido direto pelo site (10% off), status "Chapa ligada agora" pelo horário de Brasília
- **Detalhes**: botões com a cor entrando deslizando e leve atração do mouse nos principais, títulos que sobem ao aparecer, barra de rolagem ketchup e vinho, **cursor da marca** só nesta página (ponto ketchup e anel que segue com atraso; vira "pedir" com o símbolo do burger sobre os pratos, "assistir" no vídeo, "arrasta" no carrossel e fica mostarda nas seções escuras). Só aparece com mouse; a Área do Cliente usa o cursor normal
- **Sacola**: quantidade, entrega ou retirada, pagamento, 10% off e o pedido vai formatado para o WhatsApp
- **Depoimentos em carrossel**: seis cartões (um vinho a cada três), setas, arrastar com o mouse, barra de progresso e passagem automática que para no hover
- **Rodapé** em vinho de churrascaria: mapa padrão do OpenStreetMap (`.map-box`) na paleta ketchup, "Onde entregamos", contatos e redes (Instagram, Facebook, TikTok, WhatsApp)

## Área do Cliente (`painel.html`)

Só neste modelo Gold. Link "Área do cliente" no topo e no rodapé.

- Login de demonstração: `loja@montaburger.com.br` / `monta2026` (botão "preencher" na tela)
- **Produtos**: lista com foto, categoria, preço e promoção; filtro por categoria; busca; editar, esconder do site e apagar. Cada mudança fica marcada como "não publicada"
- **Novo produto**: nome, categoria, preço, preço de promoção, descrição, foto (envio do computador, recortada quadrada e reduzida no navegador, ou escolha da galeria), "Mostrar em Os mais pedidos" e "Esconder do site"
- **Categorias**: criar, renomear, mudar a ordem (é a ordem das abas no site) e apagar quando vazia
- **Publicar no site**: o rascunho vira o cardápio do site. Se o site estiver aberto em outra aba, ele atualiza na hora. "Descartar alterações" e "Voltar ao cardápio original"

Por ser demonstração sem servidor, o cardápio publicado fica no `localStorage` do navegador (chaves `monta-cardapio-publicado` e `monta-cardapio-rascunho`). Para um cliente de verdade, trocar as funções `ler`/`gravar` de `cardapio.js` por chamadas à API da loja e o login por autenticação real.

## Identidade

- Cores: vinho de churrascaria `#7A1118` (rodapé, preenchimento dos botões), ketchup `#E3262B`, ketchup escuro `#B8161B`, rosa `#FCE7E3`, creme `#FFF8F2`, chapa `#1C1311`, mostarda `#FFC23A`, alface `#3E9B47`
- Fontes: **Bricolage Grotesque** (títulos) + **Onest** (texto). Dupla ainda não usada em outro projeto
- Logo: burger empilhado (pão vermelho com gergelim, queijo mostarda escorrendo, carne e pão de baixo) ao lado de "monta / BURGER"

## Para virar site de cliente

Copiar para `clientes/<cliente>/` (nunca editar aqui). Trocar `content.js`, fotos em `_build/img/fotos/`, logo em `icons.js`, gerar o mapa do endereço real, ligar o painel a um back-end e tirar o `noindex` do `build.js`.
