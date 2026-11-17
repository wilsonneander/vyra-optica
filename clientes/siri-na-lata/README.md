# Siri na Lata Bar & Restaurante

Nicho **restaurante e lanchonete**. Primeiro cliente dos três modelos do nicho: **Bronze**, **Silver** e **Gold**.
Instagram do cliente: [@sirinalatafloripa](https://www.instagram.com/sirinalatafloripa/)

| Pasta | O que é |
|---|---|
| `marca/` | Logo redesenhado em vetor (`siri-na-lata.svg`), PNGs em alta, favicon e ícone do celular. `logo-original-outubro-rosa.png` é o arquivo enviado pelo cliente |
| `_build/` | Compartilhado pelos três modelos: `content.js` (todos os textos, cardápio, preços, condições e FAQ), `icons.js` (ilustrações em traço próprias), `img/` (fotos em WebP) |
| `_build-bronze/` | Gerador do modelo Bronze: `build.js`, `style.js`, `script.js` |
| `site-bronze/` | **Modelo Bronze pronto para subir** (abre direto no navegador pelo `index.html`) |

## Gerar

```bash
node clientes/siri-na-lata/_build-bronze/build.js   # gera site-bronze/
```

Para trocar textos, preços ou horários, edite `_build/content.js` e gere de novo.
Tudo marcado com `[CONFIRMAR]` precisa ser validado com o cliente antes de publicar.

## Modelo Bronze

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

## Modelo Gold: "Maré"

O dia na praia do Siri na Lata, do almoço ao pôr do sol. Mesmo conteúdo (`_build/content.js`), mesma identidade e as mesmas fotos do Bronze.

| Pasta | O que é |
|---|---|
| `_build-gold/` | Gerador: `build.js` (HTML), `gold.css` e `gold.js` (copiados para `assets/`) |
| `site-gold/` | **Modelo Gold pronto para subir** (abre direto no navegador pelo `index.html`) |

```bash
node clientes/siri-na-lata/_build-gold/build.js   # gera site-gold/
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

## Logo

O arquivo do cliente tinha 150 x 150 px com fundo rosa do Outubro Rosa. O caranguejo e a lata foram **redesenhados em vetor** (mesma pose, cores e rótulo), sem o fundo.
O texto do rótulo foi convertido em curvas (Gloock + Archivo Black), então o SVG aparece igual em qualquer lugar.
Para regerar os PNGs: `marca/gerar-logo.js` (precisa de `sharp` e `opentype.js` instalados e das fontes numa pasta `fonts/`).

## Mapa (OpenStreetMap)

Mapa sempre pelo OpenStreetMap, nunca Google (regra de DIRETRIZES-SITES.md). O Gold usa o componente padrão do rodapé (`.map-box`): imagem estática `_build/img/mapa_estreito.webp`, pino, cartão com endereço e horário, botões "Abrir no mapa" e "Como chegar" (links do OpenStreetMap em `content.js`) e crédito © OpenStreetMap.

Para gerar de novo (por exemplo, se o cliente confirmar outra posição em `endereco.coordenadas`), ajuste as coordenadas em `_build/gerar-mapa.js` e rode com `sharp` instalado fora do projeto:

```bash
node clientes/siri-na-lata/_build/gerar-mapa.js mare clientes/siri-na-lata/_build/img/mapa_estreito.webp
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
- Domínio e hospedagem
