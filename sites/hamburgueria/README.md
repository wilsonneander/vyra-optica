# Hamburgueria: landing page "Braseiro Burger & Cozinha"

Nicho **hamburgueria com cozinha completa**: burgers, porções, massas, saladas, sobremesas e bebidas.
Template de demonstração com empresa fictícia (Braseiro, Vila Madalena, São Paulo). Uma página só, sem blog e sem troca de idioma.

Referência visual: dinevo.framer.website (mesma linha: capa escura com vídeo, faixa laranja correndo, seções alternando preto, branco e creme, títulos condensados em caixa-alta).

| Pasta | O que é |
|---|---|
| `site/` | **Site pronto**. Abra `site/index.html` no navegador (funciona sem servidor) |
| `site/assets/css/style.css` | Design |
| `site/assets/js/app.js` | Interações e animações |
| `site/assets/img/` | Fotos em WebP e mapa |
| `site/assets/video/` | Vídeos MP4 e as capas (poster) em WebP |
| `_build/imagens.js` | Baixa as fotos do Unsplash (licença livre) e gera os WebP |
| `_build/videos.js` | Baixa os vídeos do Pexels (licença livre) e gera as capas |
| `_build/gerar-mapa.js` | Mapa estático do OpenStreetMap recolorido na paleta (nunca Google Maps) |

Fotos, vídeos e mapa só precisam ser gerados de novo se mudarem (precisam do `sharp` instalado fora do projeto):

```bash
NODE_PATH=<pasta com node_modules/sharp> node sites/hamburgueria/_build/imagens.js
NODE_PATH=<pasta com node_modules/sharp> node sites/hamburgueria/_build/videos.js
cd sites/hamburgueria/_build && NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js
```

Os scripts pulam arquivos que já existem. Para trocar uma foto, apague o `.webp` e troque o id no script.

## Seções (na ordem)

- **Entrada**: um burger se monta camada por camada antes da página abrir
- **Capa**: vídeo do maçarico derretendo o queijo na chapa, título que sobe linha a linha, prova social com avatares e cartão flutuante com fotos que se alternam (smash, carbonara, brownie, caesar)
- **Faixa laranja** que corre e acelera e inclina conforme a velocidade da rolagem
- **A casa**: texto grande que acende palavra por palavra ao rolar, com duas fotos em parallax
- **Os queridinhos**: lista de pratos; ao passar o mouse, a pilha de fotos embaralha e traz o prato para a frente
- **Cardápio**: abas (Burgers, Porções, Massas, Saladas, Sobremesas, Bebidas) com marcador que desliza, cards com foto, preço, avaliação e selos (mais pedido, picante, vegetariano). O botão "Pedir" abre o WhatsApp com o nome do prato
- **Vídeo da chapa**: cozinheiro prensando o smash; o quadro abre as bordas ao rolar, contador de 0 a 260 graus e borda rasgada no estilo da referência
- **Da nossa cozinha**: quatro cards em degrau (burgers, massas, saladas, sobremesas) que abrem a aba certa do cardápio
- **Assinatura**: título fixo no centro que troca de frase enquanto oito fotos passam pelos lados em velocidades diferentes
- **Bastidores**: seis vídeos em formato reels; tocam ao passar o mouse, dá para arrastar para o lado e abrem em tela cheia no clique
- **Contato**: painel creme sobre foto em parallax, com endereço e horários (o dia de hoje fica destacado, no horário de Brasília)
- **Depoimentos**: três colunas que sobem sem parar (pausam no hover)
- **Equipe**: retratos em preto e branco que ganham cor no hover
- **Onde estamos**: cards de eventos e retirada, e mapa OpenStreetMap com pino da marca e botão "Como chegar"
- **Rodapé**: galeria, newsletter com validação, letreiro BRASEIRO e links

Extras: cursor próprio com texto (desktop), rolagem suave (Lenis), barra "Pedir agora" fixa no celular, menu em tela cheia no celular.
Acessibilidade: `prefers-reduced-motion` desliga as animações, Esc fecha menu e vídeo, foco preso no vídeo aberto, abas navegáveis pelas setas.
Se o GSAP ou o Lenis não carregarem (CDN fora do ar), a página aparece inteira, só sem as animações de rolagem.

## Identidade

- Cores: carvão `#0A0908`, brasa `#E94222`, creme de pão `#FEF6DF`, grafite `#3C3B3B`, verde de horta `#4F7A3A` (só nos selos)
- Fontes: **Anton** (títulos) + **Host Grotesk** (texto) + **Yellowtail** (acentos manuscritos em vermelho, como "feito na brasa")
- Logo e ícones desenhados para a marca (burger com chama, separador da faixa, pino do mapa) no topo do `index.html`

## Para virar site de cliente

Trocar nome, WhatsApp (`5511900000000` no HTML e no `app.js`), endereço, horários, pratos e preços no `index.html`; trocar fotos e vídeos mantendo os nomes de arquivo; gerar o mapa do endereço real; ligar a newsletter (comentário "Integre aqui" no `app.js`) e tirar o `noindex`.
