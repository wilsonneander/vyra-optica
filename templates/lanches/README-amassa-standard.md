# Lanches: Amassa Smash Burger (Standard)

Lanchonete de smash burger fictícia na Cidade Baixa, Porto Alegre. Marca própria deste modelo: o logo tem o "SS" prensado como a carne debaixo da espátula.
Referência de clima: gribble.framer.website (lanchonete de papel, títulos condensados, adesivos, polaroides e comanda), com marca, cores, textos e peças próprios.

| Pasta | O que é |
|---|---|
| `standard/amassa-standard/` | **Site pronto** (gerado): `index.html`, `equipe.html`, `galeria.html` e `404.html` |
| `_build-amassa-standard/build.js` | Gera o site: `node templates/lanches/_build-amassa-standard/build.js` |
| `_build-amassa-standard/content.js` | Marca, horário, cardápio, serviços agendáveis, equipe, galeria, políticas e dúvidas. `[EXEMPLO]` = dado fictício |
| `_build-amassa-standard/style.css`, `app.js`, `icons.js` | Desenho, comportamento e ícones e adesivos próprios (sem biblioteca) |
| `_build-amassa-standard/preparar-imagens.js` | Baixa as fotos do Pexels e grava `img/creditos.json` (precisa do `sharp` fora do projeto) |
| `_build-amassa-standard/gerar-mapa.js` | Mapa do OpenStreetMap recolorido em azul e creme: `node gerar-mapa.js azulejo img/mapa_cidade-baixa.webp` |

Identidade: creme `#F6EEDD`, azul de azulejo `#1D3BC9`, mostarda `#FFC21A`; tema escuro azul-noite `#0B0F2E`. Fontes Anybody (títulos, com eixo de largura), Familjen Grotesk (texto), Gochi Hand (escrita à mão) e Courier Prime (comanda).

## Seções do início
- **Capa**: "Na chapa, sem dó." com a palavra prensada ao abrir, foto numa bandeja de inox e adesivos que o visitante arrasta (posição salva no navegador; duplo clique volta ao lugar).
- **Faixas** correndo (azul inclinada e letreiro grande).
- **Manifesto**: cada palavra é prensada conforme a rolagem, com os números da casa.
- **Feito pra dividir**: carrossel de polaroides em pilha (setas, toque, arraste e avanço que pausa com o mouse) e a comanda que sai impressa, com carimbo "PAGO" e "Imprimir de novo".
- **Os que mais saem** e **Cardápio** em abas (Smash, Frango crocante, Fritas e porções, Shakes, Combos), com o que inclui, tempo de preparo, preço ou "a partir de", pagamento e cancelamento.
- **Como a chapa trabalha**: bolinha, prensa, crosta, queijo e pão, em sequência desenhada.
- **Festas, oficina e chapa no seu evento** (serviços com duração, pessoas, quem cuida e preço), equipe, galeria, avaliações, Instagram, delivery, **Agendar** (serviço, profissional, data e horário, com LGPD), políticas com alergias e ponto da carne, dúvidas e contato.
- Janela **"Como você quer?"** em todo botão de pedir: iFood, 99Food, WhatsApp, ligar ou como chegar.
- Mais os itens de todo modelo: tema claro e escuro (`amassa-tema`), aviso de cookies (`amassa-cookies`), mapa OSM no rodapé, WhatsApp fixo, CNPJ fictício e 404 (a espátula prensando a bolinha no lugar do zero).

Ainda não existe o Amassa Premium: a regra "Standard e Premium da mesma empresa" fica pendente até o nicho ganhar um Premium com esta marca.
