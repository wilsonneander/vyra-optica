# Siri na Lata Bar & Restaurante

Nicho **restaurante e lanchonete**. Primeiro cliente dos três modelos do nicho: **Siri Standard**, **Siri Standard Postal** e **Siri Premium**.
Instagram do cliente: [@sirinalatafloripa](https://www.instagram.com/sirinalatafloripa/)

| Pasta | O que é |
|---|---|
| `marca/` | Logo redesenhado em vetor (`siri-na-lata.svg`), PNGs em alta, favicon e ícone do celular. `logo-original-outubro-rosa.png` é o arquivo enviado pelo cliente |
| `_build/` | Compartilhado pelos três modelos: `content.js` (todos os textos, cardápio, preços, condições e FAQ), `icons.js` (ilustrações em traço próprias), `img/` (fotos em WebP) |
| `_build-siri-standard/` | Gerador do modelo Siri Standard: `build.js`, `style.js`, `script.js` |
| `standard/siri-standard/` | **Modelo Siri Standard pronto para subir** (abre direto no navegador pelo `index.html`) |
| `_build-siri-standard-postal/` | Gerador do modelo Siri Standard Postal: `build.js`, `style.js`, `script.js` |
| `standard/siri-standard-postal/` | **Modelo Siri Standard Postal pronto para subir** |

## Gerar

```bash
node templates/restaurante/_build-siri-standard/build.js   # gera standard/siri-standard/
node templates/restaurante/_build-siri-standard-postal/build.js   # gera standard/siri-standard-postal/
```

Para trocar textos, preços ou horários, edite `_build/content.js` e gere de novo.
Tudo marcado com `[CONFIRMAR]` precisa ser validado com o cliente antes de publicar.

## Modelo Siri Standard

Site enxuto de uma página, foco no essencial, baixo custo de manutenção.

- Estrutura inspirada na referência enviada (Sushi House): topo escuro com foto e título grande, destaques com ilustração em traço, boas-vindas, faixa "Cardápio" com foto, grade de pratos com legenda, história com mosaico de fotos, faixa de reservas com foto e rodapé em colunas
- Seções: topo, destaques da casa, boas-vindas, cardápio (grade de fotos + cardápio completo com preços), a casa, reservas e eventos (três formatos com condições), perguntas frequentes, como chegar e horários, rodapé
- WhatsApp: botão flutuante e todos os botões abrem a conversa com mensagem pronta (pedido, reserva, aniversário, evento, dúvida)
- Instagram e WhatsApp no rodapé com ícones próprios em traço fino dentro de círculo; Facebook aparece sozinho se for preenchido em `content.js`
- "Aberto agora / Fechado agora" calculado no horário de Brasília, e o dia de hoje destacado na tabela de horários
- SEO básico: título e descrição, canonical, Open Graph, dados estruturados `Restaurant` e `FAQPage`, `sitemap.xml`, `robots.txt`
- Desempenho: CSS e JS embutidos (sem pedidos extras), fotos em WebP com lazy-load, só a foto do topo carrega antes. `.htaccess` com cache e compressão para hospedagem Apache
- Fontes: Gloock (títulos, conversa com o rótulo da lata) + Figtree (texto). Dupla ainda não usada em outro projeto
- Cores (tons pastel, inspirados no siri e na lata): creme `#F4EFE1` e branco nos fundos, terracota `#CA603C` nos títulos e botões, pêssego `#E4A785` nos subtítulos (versão mais escura `#B8714F` em fundo claro), preto `#1B1714` no rodapé e textos, grafite `#3F3E3B` no topo

## Modelo Siri Premium: "Maré"

O dia na praia do Siri na Lata, do almoço ao pôr do sol. Mesmo conteúdo (`_build/content.js`), mesma identidade e as mesmas fotos do Siri Standard.

| Pasta | O que é |
|---|---|
| `_build-siri-premium/` | Gerador: `build.js` (HTML), `mare.css` e `mare.js` (copiados para `assets/`) |
| `premium/siri-premium/` | **Modelo Siri Premium pronto para subir** (abre direto no navegador pelo `index.html`) |

```bash
node templates/restaurante/_build-siri-premium/build.js   # gera premium/siri-premium/
```

- Seções empilhadas: cada seção fica presa na tela e a próxima sobe por cima com os cantos se fechando, enquanto a anterior recua e escurece
- Rolagem suave no mouse (a página desliza); no celular fica a rolagem nativa
- Topo com a foto da praia escurecida à esquerda para a leitura, título que sobe ("na Lata" em amarelo sol), ondas correndo e menu fixo no alto o tempo todo
- Manifesto: o texto de boas-vindas acende palavra por palavra com a rolagem, com fotos flutuando em profundidades diferentes
- Assinatura da casa (fundo terracota): siri na lata e porções, com as ilustrações em traço se desenhando conforme a rolagem
- **Cardápio em livro**: rolar para baixo vira a página, rolar para cima a página volta. Em tela larga abre em pares (fotos coladas com fita à esquerda, em grade que preenche a página; pratos e preços à direita, com a letra no maior tamanho que cabe em cada página); no celular, uma página por vez. Capítulos clicáveis levam à página certa e o livro inclina de leve seguindo o mouse
- A casa: galeria horizontal de polaroides com as fotos reais, movida pela rolagem vertical, com o sol descendo ao fundo
- Reservas em lista expansível (um formato aberto por vez), dúvidas em acordeão e "Como chegar" no pôr do sol, com "aberto agora" e o dia de hoje destacado
- Fontes: Gloock (títulos) e Figtree (texto), as da marca, com Newsreader itálico nas falas suaves
- Movimento reduzido no sistema: tudo fica parado e legível. Sem JS: livro vira grade de páginas e a galeria rola de lado

## Modelo Siri Standard Postal

Mesma base e conteúdo do Siri Standard, com experiência de "cartão-postal do Estreito": mais movimento, carrosséis e ferramentas que poupam conversa no WhatsApp.

- **Abertura**: cortina terracota com o mascote que sobe com borda de onda (só na primeira visita da sessão; clique ou tecla pula; desligada para quem pede menos movimento)
- **Capa**: foto da praia com petisco e drink na mesa (`_build/img/capa-postal.webp`, versão de 1000 px para celular) sob um véu escuro para o texto ficar legível. Ao lado, pilha de cartões-postais com fotos reais de petisco na praia que gira sozinha (setas, clique, pausa ao passar o mouse) e carimbo postal
- **Faixa corrida** inclinada com os destaques da casa
- **Cardápio em livro** (logo depois da capa, mesmo componente do Siri Premium com as cores do Siri Standard Postal): o livro folheia com a rolagem (desce vira, sobe volta), em pares na tela larga e uma página por vez no celular; capítulos clicáveis e + em cada item para montar o pedido
- **Um dia na casa**: seção fixa em que o sol percorre o céu conforme a rolagem e o céu passa de dia para fim de tarde e noite (lua e estrelas), trocando foto (inteira, sem corte) e texto de almoço, fim de tarde e noite, com o nome do prato de cada momento (campo `prato` em `momentos` no content.js)
- **Mais pedidos**: carrossel com fotos (arrastar, setas, barra de progresso) e + para o pedido
- **Pedido pelo site**: botão + em cada item, contador, barra de pedido com total e lista; envia tudo pronto pelo WhatsApp para retirada
- **Reserva guiada**: escolhe o formato (mesa, aniversário, evento) e vê as condições; dia, horário (só horários em que a casa está aberta, avisa quando é segunda ou terça), pessoas e observação; manda a mensagem pronta no WhatsApp
- **A casa**: colagem de fotos com parallax leve e selo giratório do Comida di Buteco
- **Rodapé com mapa**: mesmo componente de mapa dos outros templates (OpenStreetMap estático recolorido, pino pulsante, cartão com "Abrir no Maps" e rota). Gerado por `_build/gerar-mapa.js` em `_build/img/mapa-siri.webp`
- Siri andando de lado na linha de progresso do topo
- Fontes: Newsreader (títulos) + Epilogue (texto). Dupla ainda não usada em outro projeto
- Cores: a base do Siri Standard (creme, terracota, pêssego) mais azuis de mar para dar clima de praia e diferenciar do Siri Standard: azul `#1F6F94` (faixa, botões secundários, textos de apoio, abas, selo), azul-escuro `#134B66`, turquesa `#3FA7BD`, espuma `#9FD6E2`, céu `#DCEFF3` (céu de dia, fundo das fotos) e azul-noite `#0E2A3D` (capa, noite, reservas, rodapé, pedido). O mar do mapa também é azul-claro
- SEO do Siri Standard mais cardápio completo nos dados estruturados (`Menu` com preços) e coordenadas

## Tema claro e escuro (os três modelos)

Botão de sol/lua no topo, ao lado do botão de reserva (no celular, ao lado do menu). O site abre sempre no claro; o escuro só entra quando o visitante escolhe, e a escolha fica salva no navegador (`localStorage` `siri-tema`). `?tema=escuro` ou `?tema=claro` no link também vale, bom para mostrar ao cliente.

- Script, botão e estilo do botão: `_build/tema.js`, comum aos três. O tema é aplicado no `<head>` antes da primeira pintura (sem piscar claro)
- Cores do escuro em cada modelo: Siri Standard em `_build-siri-standard/style.js` (tokens `--bg`, `--card`, `--head`...), Siri Standard Postal no fim de `_build-siri-standard-postal/style.js` (noite no mar, azul-noite), Siri Premium no fim de `_build-siri-premium/gold.css` ("a maré de noite"; pôr do sol vira céu depois do sol se pôr)
- Seções que já são escuras não mudam. O papel do cardápio em livro, as polaroides, os postais e o mapa continuam claros de propósito

## Logo

O arquivo do cliente tinha 150 x 150 px com fundo rosa do Outubro Rosa. O caranguejo e a lata foram **redesenhados em vetor** (mesma pose, cores e rótulo), sem o fundo.
O texto do rótulo foi convertido em curvas (Gloock + Archivo Black), então o SVG aparece igual em qualquer lugar.
Para regerar os PNGs: `marca/gerar-logo.js` (precisa de `sharp` e `opentype.js` instalados e das fontes numa pasta `fonts/`).

## Mapa (OpenStreetMap)

Mapa sempre pelo OpenStreetMap, nunca Google (regra de DIRETRIZES-SITES.md). O Siri Premium usa o componente padrão do rodapé (`.map-box`): imagem estática `_build/img/mapa_estreito.webp`, pino, cartão com endereço e horário, botões "Abrir no mapa" e "Como chegar" (links do OpenStreetMap em `content.js`) e crédito © OpenStreetMap.

Para gerar de novo (por exemplo, se o cliente confirmar outra posição em `endereco.coordenadas`), ajuste as coordenadas em `_build/gerar-mapa.js` e rode com `sharp` instalado fora do projeto:

```bash
node templates/restaurante/_build/gerar-mapa.js mare templates/restaurante/_build/img/mapa_estreito.webp
```

## Fotos

Grade do cardápio e mosaico da seção "A casa" usam **fotos reais do cliente** (`casquinha-siri`, `camarao-milanesa`, `isca-peixe`, `peixe-pirao`, `camarao-completo`, `camarao-fritas`, `casa-praia`, `casa-drinks`, `casa-drink`, `casa-sequencia`).
Vieram em baixa resolução (cerca de 380 x 510 px): pedir os originais do celular para trocar mantendo os mesmos nomes.
Topo, faixa "Cardápio" e faixa de reservas ainda usam fotos do Unsplash (lista em `_build/img/CREDITOS.md`).

## Pendências com o cliente

- Número do WhatsApp comercial (hoje está `(48) 99999-9999` de exemplo)
- Horário de domingo (no Instagram aparece cortado; usamos 11h às 17h)
- Tabela de preços real e nomes dos pratos (os valores são de referência)
- Condições de reserva, aniversário e evento; formas de pagamento e taxa de serviço
- Delivery ou apps de entrega, dias de música ao vivo, petisco do Comida di Buteco 2026
- Posição exata do número 610 no mapa (o pino está na ponta da Rua São José, na areia)
- Domínio e hospedagem
