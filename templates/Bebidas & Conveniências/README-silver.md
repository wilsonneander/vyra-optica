# Bebidas & Conveniências: modelo Silver "Tampinha"

Nicho **bebidas e conveniência** (adega, depósito de bebidas, conveniência de bairro). Template de demonstração com loja fictícia (Tampinha Bebidas & Conveniência, Floresta, Belo Horizonte) que revende marcas reais: fotos reais dos produtos (Coca-Cola, Guaraná, Fanta, Sprite, Heineken, Budweiser, Skol, Brahma, Monster, Red Bull, Smirnoff, Tanqueray, vinhos etc.), fotos de ambiente (brinde, bar, drinks) e logos reais do iFood, 99Food e das marcas.

Uma página só, com catálogo, carrinho e pedido montado para o WhatsApp. Paleta preto, marrom café e creme com o vermelho da tampinha nos detalhes. Títulos em **Gloock**, texto em **Schibsted Grotesk** (dupla diferente do Bronze).

| Pasta | O que é |
|---|---|
| `_build-silver/content.js` | Todo o conteúdo: marca, contatos, entrega, horários, slides da capa, categorias, 46 bebidas, extras (gelo, copos, carvão), marcas, kits, passos do pedido, FAQ e bairros. `[EXEMPLO]` = trocar pelo cliente |
| `_build-silver/imagens.js` | Trata as fotos reais: recorta o fundo claro dos produtos (vira transparente), apara e gera WebP em `img/fotos/` (produtos, ambiente, logos) com as medidas em `medidas.json` |
| `_build-silver/img/originais/` | Fotos originais (enviadas pelo cliente e baixadas de lojas online). **Fora do git** por tamanho (30 MB); só os WebP tratados vão para o repositório |
| `_build-silver/build.js` | Gera o `index.html` e copia CSS, JS, favicon e mapa |
| `_build-silver/style.css`, `_build-silver/app.js` | Design e interação (copiados para `site-silver/assets/`) |
| `_build-silver/icons.js` | Logo da tampinha, favicon e ícones desenhados para a marca |
| `_build-silver/img/mapa_floresta_noite.webp` | Mapa do OpenStreetMap recolorido no tema `noite` (`gerar-mapa.js`) |
| `site-silver/` | **Site pronto** (abre direto pelo `index.html`) |

## Gerar

```bash
node "templates/Bebidas & Conveniências/_build-silver/build.js"
```

As fotos só precisam ser tratadas de novo se mudarem (precisa de `img/originais/` e do `sharp`):

```bash
NODE_PATH=<pasta com node_modules/sharp> node "templates/Bebidas & Conveniências/_build-silver/imagens.js"
```

O mapa só precisa ser gerado de novo se o endereço mudar (precisa do `sharp` instalado fora do projeto; rodar dentro de `_build-silver/`):

```bash
NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js noite img/mapa_floresta_noite.webp
```

## Como é

- **Preloader**: tampa coroa de long neck (metal vermelho, 21 dentes, "t" da marca) cai girando como moeda, quica, balança até assentar, solta respingos no impacto e ganha um brilho metálico; o nome aparece embaixo e a tela abre num círculo que se fecha
- **Topo** transparente sobre a capa, ganha fundo com desfoque ao rolar, some ao descer e volta ao subir. Status "Aberto agora" ou "Fechado agora" pelo horário, WhatsApp e carrinho com contador que pula a cada item. No celular, menu em tela cheia abrindo em círculo
- **Capa com palco interativo**: seis bebidas em destaque (Coca-Cola, Sol, Schweppes, Skol, Sprite, Del Valle). A garrafa principal cai no palco com mola, flutua, tem gotas escorrendo e inclina em 3D seguindo o mouse; duas bebidas da mesma linha ao lado, cubos de gelo boiando com paralaxe e bolhas subindo no fundo. A cada troca, o fundo muda para o tom da marca e o nome dela passa gigante vazado atrás. Miniaturas com barra de progresso (troca automática, pausa no hover), setas e arrastar no celular. Ficha com preço e botão de pôr no carrinho
- **Fita vermelha inclinada** correndo com entrega, iFood, 99Food, site seguro, WhatsApp e frete grátis
- **Categorias em prateleira**: sete painéis (Cervejas, Energéticos, Destilados, Chás e sucos, Drinks, Água, Refrigerantes). O painel em foco abre e três bebidas sobem do fundo; o clique leva ao catálogo já filtrado. No celular viram uma sanfona
- **Mais pedidos da semana**: carrossel arrastável com setas e barra de progresso
- **Marcas**: duas esteiras em sentidos opostos (Coca-Cola, Skol, Fanta, Sol, Schweppes, Sprite, Heineken, Del Valle, Ades, Monster, Red Bull, Crystal, Smirnoff, Leão, Brahma, Tanqueray). Clique filtra o catálogo pela marca
- **Catálogo**: busca sem acento, filtros por categoria (todos do mesmo tamanho), ordenação por preço ou nome, 15 por vez com "Ver mais". Cards com halo na cor da bebida, garrafa que sobe e inclina em 3D, gotas no hover. A tampinha com "+" gira e vira seletor de quantidade
- **Garrafa voando até o carrinho** em arco a cada item adicionado
- **Confirmação de 18 anos** antes da primeira bebida alcoólica (fica guardada no navegador)
- **Kits prontos** (churrasco, esquenta, gin tônica): as garrafas abrem em leque no hover e o kit entra no carrinho item por item
- **Como pedir**: linha ondulada que se desenha com a rolagem e uma tampinha rolando por ela; os passos acendem conforme ela passa. Exemplo da mensagem que chega no WhatsApp aparecendo linha a linha
- **Entrega e parceiros**: taxa, frete grátis, retirada e pagamento; botões iFood e 99Food; selo "Site 100% seguro" com texto girando; atendimento no WhatsApp; bairros com entrega
- **FAQ**: abre suave, uma por vez, com cubo de gelo boiando
- **Rodapé**: mapa padrão do OpenStreetMap (`.map-box`) no tema escuro, "Onde atendemos", navegação, contato, horário, selo de segurança e aviso de venda proibida para menores
- **Carrinho** (gaveta lateral): barra de frete grátis, quantidades, "Leve também" (gelo, copos, carvão), etapa de entrega ou retirada, endereço e bairro, pagamento (Pix, cartão, dinheiro com troco validado) e observação. O botão final abre o WhatsApp com o pedido **separado por categoria** (a triagem), subtotal, entrega, total, pagamento e confirmação de 18 anos quando houver álcool. O carrinho fica salvo no navegador
- No celular, barra fixa "Ver carrinho" com o total quando há itens
- Botão de voltar ao topo com anel de progresso e WhatsApp flutuante
- Com "reduzir movimento" ligado no sistema, as animações param

## Aviso de cookies

Cartão creme no canto inferior esquerdo (no celular ocupa a largura toda), com a tampinha girando no canto, título em Gloock e os botões quadrados da marca: "Aceitar todos", "Só os necessários" e "Escolher quais cookies" (necessários sempre ligados; estatística e marketing com chave liga/desliga). Entra depois do preloader. A escolha fica em `localStorage` (`tampinha-cookies`) e vira `window.tampinhaCookies`, com o evento `cookies` disparado no `document`: qualquer script de estatística ou anúncio deve esperar esse sinal. O link "Preferências de cookies" no rodapé reabre o cartão. HTML em `build.js`, estilo em `style.css` (bloco "cookies"), lógica em `app.js`.

## Tema claro e escuro

Pílula com sol e lua na lateral direita (no celular, deitada dentro do menu). O marcador é uma tampinha coroa que rola de um ícone ao outro, dá um pulinho e solta bolhas de gás; a página troca de tema num círculo que se espalha a partir da tampinha (sem View Transitions, as cores passam suavemente). Peça comum em `templates/_comum/tema-tampinha.js`. A escolha fica salva no navegador e `?tema=claro` ou `?tema=escuro` no link também vale.

- Silver abre no **escuro**; o claro é o balcão de dia (creme e papel). As categorias e a faixa com foto continuam escuras, como vitrines. Chave `tampinha-silver-tema`. Cores em `_build-silver/style.css`, bloco "tema claro".
