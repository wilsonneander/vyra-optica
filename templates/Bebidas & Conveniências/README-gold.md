# Bebidas & Conveniências: modelo Gold "Tampinha"

Nicho **bebidas e conveniência** (adega, depósito de bebidas, conveniência de bairro). Mesma loja fictícia do Bronze e do Silver (Tampinha Bebidas & Conveniência, Floresta, Belo Horizonte), agora na versão mais sofisticada: fundo preto, dourado envelhecido `#B08D57` nos detalhes e branco quente. Referência visual: estúdio escuro com garrafas sobre água e reflexo.

Uma página só, com catálogo, carrinho e pedido montado para o WhatsApp. O destaque é a **lata da casa em 3D** (Tampinha Reserva) que gira conforme a rolagem.

| Pasta | O que é |
|---|---|
| `_build-gold/content.js` | Conteúdo (o mesmo do Silver) mais o que é só do Gold: `vitrine` (garrafas da capa), `reserva` (lata da casa, capítulos e ficha), `momentos` (fotos de gente) e `creditos`. `[EXEMPLO]` = trocar pelo cliente |
| `_build-gold/lata.js` | A lata 3D em Three.js: rótulo desenhado em canvas, metal com reflexo de estúdio, gotas de condensação, reflexo no chão, anéis na água e partículas douradas. Gira uma volta e meia com a rolagem e inclina no fim para mostrar o lacre |
| `_build-gold/vendor/three.module.min.js` | Three.js r160 (MIT). O `build.js` converte para script comum (`assets/three.min.js`), então o site abre até direto pelo arquivo, sem servidor e sem CDN |
| `_build-gold/img/pessoas/` | Fotos de pessoas (Unsplash): brindes à noite, varanda, terraço, bar. Créditos no rodapé |
| `_build-gold/img/mapa_floresta_ouro.webp` | Mapa do OpenStreetMap no tema `ouro` (`gerar-mapa.js`) |
| `_build-gold/icons.js` | Logo da tampinha em dourado, ícones e a lata desenhada em SVG (miniatura do carrinho e reserva sem WebGL) |
| `_build-gold/build.js`, `style.css`, `app.js` | Gerador, design e interação |
| `site-gold/` | **Site pronto** (abre direto pelo `index.html`) |

Fotos de produto, ambiente e logos vêm do Silver (`_build-silver/img/fotos/`), não são duplicadas.

## Gerar

```bash
node "templates/Bebidas & Conveniências/_build-gold/build.js"
```

Mapa (só se o endereço mudar; precisa do `sharp` fora do projeto, rodar dentro de `_build-gold/`):

```bash
NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js ouro img/mapa_floresta_ouro.webp
```

## Como é

- **Preloader**: a tampinha dourada gira como moeda, o nome aparece e a tela sobe
- **Topo** transparente, ganha fundo com desfoque ao rolar; links em caixa alta espaçada, botão "Comprar" e carrinho
- **Capa**: Heineken, Red Label e Tanqueray em pé sobre a água escura, com reflexo, anéis se abrindo na água, gotas suspensas e "TAMPINHA" vazado gigante ao fundo. As garrafas acompanham o mouse
- **Fita** com entrega, iFood, 99Food, site 100% seguro e WhatsApp
- **Tampinha Reserva (3D)**, logo depois da capa: seção presa na tela enquanto a lata gira com a rolagem. Três capítulos de texto trocam no caminho (marcadores em losango à direita) e no fim aparece a ficha (teor, amargor, temperatura, harmonização) com preço e botão de compra. A lata entra no catálogo e no carrinho como qualquer bebida
- **Catálogo** com busca, filtros do mesmo tamanho, ordenação e "Ver mais"
- **Categorias** em índice editorial: nome grande em Bodoni, contagem, e as garrafas da categoria aparecem seguindo o mouse. O clique volta ao catálogo já filtrado
- **Seleção da casa** (carrossel)
- **Momentos**: mosaico de fotos de gente brindando e se divertindo, com paralaxe
- **Faixa de foto** com frase e **marcas** em esteira (fotos em cinza que ganham cor)
- **Kits** em blocos alternados com foto, garrafas em leque e lista de itens
- **Como pedir**: linha dourada que desce com a rolagem acendendo os passos, foto e a mensagem do WhatsApp aparecendo linha a linha
- **Entrega**: dados, botões iFood e 99Food, selo "Site 100% seguro" girando, atendimento no WhatsApp
- **Dúvidas** em sanfona e **rodapé** com o mapa padrão `.map-box` do OpenStreetMap em preto e dourado
- **Carrinho**, confirmação de 18 anos, barra fixa no celular e pedido separado por categoria no WhatsApp (mesma lógica do Silver)
- Sem WebGL, a seção mostra a lata desenhada; com "reduzir movimento", as animações automáticas param

## Identidade

- Cores: preto `#0B0A09`, carvão `#12110F`, dourado `#B08D57`, dourado claro `#D2B583`, branco quente `#F6F2EA`
- Fontes: **Bodoni Moda** (títulos, itálico nos destaques) + **Familjen Grotesk** (texto). Dupla nova no projeto
- Tampinha Reserva é uma marca fictícia da loja; para cliente real, trocar pelo produto próprio dele ou por uma bebida que ele queira destacar (o rótulo é desenhado em `lata.js`, função `desenhaRotulo`)

## Para virar site de cliente

Copiar para `clientes/<cliente>/` (nunca editar aqui). Trocar `content.js`, as fotos, o rótulo da lata, o logo em `icons.js`, gerar o mapa do endereço real, ajustar iFood e 99Food e tirar o `noindex` do `build.js`.
