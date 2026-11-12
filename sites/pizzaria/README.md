# Pizzaria: modelo Gold "Fornalha Pizza Bar"

Nicho **fast food e pizzaria**. Template de demonstração para mostrar a clientes, com empresa fictícia (Fornalha Pizza Bar, Pinheiros, São Paulo).
Vende pizzas, massas, saladas, drinks e porções pra dividir.

| Pasta | O que é |
|---|---|
| `_build/content.js` | Todo o conteúdo: marca, contatos, horários, bairros de entrega, cardápio com preços, bordas e ocasiões. `[EXEMPLO]` = trocar por cliente |
| `_build/build.js` | Gera o HTML |
| `_build/style.css`, `_build/app.js` | Design e interação (copiados para `site-gold/assets/`) |
| `_build/icons.js` | Logo (forno de cúpula) e ícones desenhados para a marca |
| `_build/img/` | Fotos em WebP, mapa e `capa-video.mp4`. Fotos: `imagens.js` (Unsplash). Vídeo: clipes Mixkit 42472, 42469, 42473, 42475, 42481 e 32415 (licença livre Mixkit), editados com ffmpeg |
| `site-gold/` | **Site pronto** (abre direto pelo `index.html`) |

## Gerar

```bash
node sites/pizzaria/_build/build.js
```

Fotos e mapa só precisam ser gerados de novo se mudarem (precisam do `sharp` instalado fora do projeto):

```bash
NODE_PATH=<pasta com node_modules/sharp> node sites/pizzaria/_build/imagens.js
NODE_PATH=<pasta com node_modules/sharp> node sites/pizzaria/_build/gerar-mapa.js forno img/mapa_pinheiros.webp   # rodar dentro de _build/
```

## Como é

Estrutura inspirada na referência enviada (cardápio Maison, Framer): painel fixo da marca à esquerda e conteúdo rolando à direita, com três telas (Início, Cardápio, Reserva) que trocam sem recarregar.

- **Painel da marca**: logo, navegação, frase, botões de pedido e reserva, status do forno calculado no horário de Brasília ("Forno aceso agora, até as 23h30" ou "Forno descansando. Acende terça às 18h"), carrossel "Os queridinhos" que abre o prato e o letreiro gigante FORNALHA. As letras do letreiro esticam e encolhem seguindo o mouse (fonte variável) e pulam em onda no clique
- **Início**: capa com **vídeo do pizzaiolo** (gira a massa, abre o disco, molho, queijo, pá no forno e fogo da lenha, 16s, sem som) que ao terminar dissolve para a foto, com barra de progresso mostarda e botão "Ver o forno de novo"; com movimento reduzido ou economia de dados vai direto para a foto. Depois, selo giratório "forno a lenha a 450 graus", fita que corre, **roleta "Gira a pizza"** (uma pizza de verdade com oito sabores; a pá do forno aponta o sorteado, solta confete de tomate e manjericão e oferece o sabor), a casa com fotos, tabela de horários com o dia de hoje destacado e bloco de delivery
- **Cardápio**: abas por categoria com contador e marcador que desliza, busca sem acento no cardápio inteiro, filtros Vegetariano e Picante, cards com foto (pizza gira no hover), selos de vegetariano, picante, novidade e sem álcool, botão + para pôr direto na sacola
- **Prato aberto**: tamanho broto ou grande, **meio a meio com a foto dividida ao vivo** (vale o preço do sabor mais caro), borda recheada, observação, quantidade e preço atualizado
- **Sacola**: a foto voa até a sacola, contador e total no botão, entrega ou retirada, pedido mínimo para entrega, pagamento, e o pedido completo vai formatado para o WhatsApp. Fica salva no navegador
- **Reserva**: dias como tickets (segunda aparece fechada), horários conforme o turno do dia, mesa redonda desenhada que ganha cadeiras conforme o número de pessoas, ocasião, nome e WhatsApp com máscara, e uma **comanda** de papel que se preenche ao vivo e manda a reserva pelo WhatsApp
- **Rodapé**: mapa padrão do OpenStreetMap (`.map-box`) recolorido na paleta, "Onde entregamos" com os bairros, contatos e redes
- Celular: barra vermelha fixa no topo com logo, navegação e sacola; prato abre de baixo para cima; cards em duas colunas
- Acessibilidade: foco preso no modal e na sacola, Esc fecha, `prefers-reduced-motion` desliga as animações

## Identidade

- Cores que dão fome: tomate `#C42E1A`, mostarda da borda tostada `#F4B41A`, massa crua `#F6E9D0`, farinha `#FFFAF0`, carvão do forno `#2A1710`, brasa `#E8641E`, manjericão `#2F6B3A`
- Fontes: **Anybody** (títulos, fonte variável de largura, usada no letreiro elástico) + **Chivo** (texto). Dupla ainda não usada em outro projeto
- Logo: forno de cúpula com a boca acesa dentro de um quadrado mostarda (`_build/icons.js`)

## Para virar site de cliente

Trocar `content.js` (nome, WhatsApp, endereço, horários, bairros, cardápio), as fotos em `_build/img/` com o mesmo nome do `id` de cada prato, o logo em `icons.js`, gerar o mapa do endereço real e tirar o `noindex` do `build.js`.
