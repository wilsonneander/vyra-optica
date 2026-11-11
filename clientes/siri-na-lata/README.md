# Siri na Lata Bar & Restaurante

Nicho **restaurante e lanchonete**. Primeiro cliente dos três modelos do nicho: **Bronze**, **Silver** e **Gold**.
Instagram do cliente: [@sirinalatafloripa](https://www.instagram.com/sirinalatafloripa/)

| Pasta | O que é |
|---|---|
| `marca/` | Logo redesenhado em vetor (`siri-na-lata.svg`), PNGs em alta, favicon e ícone do celular. `logo-original-outubro-rosa.png` é o arquivo enviado pelo cliente |
| `_build/` | Compartilhado pelos três modelos: `content.js` (todos os textos, cardápio, preços, condições e FAQ), `icons.js` (ilustrações em traço próprias), `img/` (fotos em WebP) |
| `_build-bronze/` | Gerador do modelo Bronze: `build.js`, `style.js`, `script.js` |
| `site-bronze/` | **Modelo Bronze pronto para subir** (abre direto no navegador pelo `index.html`) |
| `_build-silver/` | Gerador do modelo Silver: `build.js`, `style.js`, `script.js` |
| `site-silver/` | **Modelo Silver pronto para subir** |

## Gerar

```bash
node clientes/siri-na-lata/_build-bronze/build.js   # gera site-bronze/
node clientes/siri-na-lata/_build-silver/build.js   # gera site-silver/
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

## Modelo Silver

Mesma base e conteúdo do Bronze, com experiência de "cartão-postal do Estreito": mais movimento, carrosséis e ferramentas que poupam conversa no WhatsApp.

- **Abertura**: cortina terracota com o mascote que sobe com borda de onda (só na primeira visita da sessão; clique ou tecla pula; desligada para quem pede menos movimento)
- **Capa**: foto da praia com petisco e drink na mesa (`_build/img/capa-praia.webp`, versão de 1000 px para celular) sob um véu escuro para o texto ficar legível. Ao lado, pilha de cartões-postais com fotos reais de petisco na praia que gira sozinha (setas, clique, pausa ao passar o mouse) e carimbo postal
- **Faixa corrida** inclinada com os destaques da casa
- **A estrela da casa**: ilustrações em traço que se desenham ao aparecer; botão coloca o siri na lata direto no pedido
- **Um dia na casa**: seção fixa em que o sol percorre o céu conforme a rolagem e o céu passa de dia para fim de tarde e noite (lua e estrelas), trocando foto e texto de almoço, fim de tarde e noite
- **Cardápio**: carrossel dos mais pedidos (arrastar, setas, barra de progresso) e cardápio completo em abas acessíveis (setas do teclado)
- **Pedido pelo site**: botão + em cada item, contador, barra de pedido com total e lista; envia tudo pronto pelo WhatsApp para retirada
- **Reserva guiada**: escolhe o formato (mesa, aniversário, evento) e vê as condições; dia, horário (só horários em que a casa está aberta, avisa quando é segunda ou terça), pessoas e observação; manda a mensagem pronta no WhatsApp
- **A casa**: colagem de fotos com parallax leve e selo giratório do Comida di Buteco
- **Rodapé com mapa**: mesmo componente de mapa dos outros templates (OpenStreetMap estático recolorido, pino pulsante, cartão com "Abrir no Maps" e rota). Gerado por `_build/gerar-mapa.js` em `_build/img/mapa-siri.webp`
- Siri andando de lado na linha de progresso do topo
- Fontes: Newsreader (títulos) + Epilogue (texto). Dupla ainda não usada em outro projeto
- SEO do Bronze mais cardápio completo nos dados estruturados (`Menu` com preços) e coordenadas

## Logo

O arquivo do cliente tinha 150 x 150 px com fundo rosa do Outubro Rosa. O caranguejo e a lata foram **redesenhados em vetor** (mesma pose, cores e rótulo), sem o fundo.
O texto do rótulo foi convertido em curvas (Gloock + Archivo Black), então o SVG aparece igual em qualquer lugar.
Para regerar os PNGs: `marca/gerar-logo.js` (precisa de `sharp` e `opentype.js` instalados e das fontes numa pasta `fonts/`).

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
