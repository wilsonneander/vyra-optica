# Autosserviços: modelo Gold "Pistão Auto Center"

Nicho **autosserviços** (oficina mecânica, revisão e estética automotiva). Mesma empresa fictícia do Silver (Pistão Auto Center, Silveira, Belo Horizonte), em versão mais completa.
Referência visual: tema "CRAS Car Repair & Auto Services" (https://cras-three.vercel.app/cras-main/index.html), seguido seção por seção: capa em slides com paralaxe, etapas, "por que nos escolher", serviços com lado fixo, vídeo, números vazados, marcas, depoimentos, equipe, preços, rodapé com chamada, e o alternador de tema claro/escuro.

Uma página só, com as seções do menu: Início, Serviços, Sobre nós, FAQ e Contato (com formulário). Sem loja, galeria, blog ou páginas extras.

| Pasta | O que é |
|---|---|
| `_build-gold/content.js` | Todo o conteúdo: marca, contatos, horários, slides, etapas, equipe, serviços, números, pacotes com preço, montadoras, depoimentos, FAQ, bairros e Instagram. `[EXEMPLO]` = trocar por cliente |
| `_build-gold/build.js` | Gera o `index.html` e copia CSS, JS, fotos e vídeos |
| `_build-gold/style.css`, `_build-gold/app.js` | Design e interação, sem bibliotecas (copiados para `site-gold/assets/`) |
| `_build-gold/icons.js` | Logo, conta-giros do preloader e ícones desenhados para a marca |
| `_build-gold/img/fotos/` | Fotos em WebP (as mesmas do Silver, Unsplash; `imagens.js`) |
| `_build-gold/img/video/` | Vídeos MP4 sem som e pôsteres WebP, montados por `videos.js` com clipes do Mixkit (licença livre Mixkit) |
| `_build-gold/img/mapa_silveira.webp` | Mapa do OpenStreetMap recolorido no tema `grafite` (`gerar-mapa.js`) |
| `site-gold/` | **Site pronto** (abre direto pelo `index.html`, cerca de 8 MB com os vídeos) |

## Gerar

```bash
node "templates/autoserviços/_build-gold/build.js"
```

Vídeos só precisam ser refeitos se mudarem. Baixe os clipes do Mixkit (`https://assets.mixkit.co/videos/<id>/<id>-720.mp4`, ids listados em `videos.js`) para uma pasta fora do projeto e rode com o ffmpeg:

```bash
FFMPEG=<caminho do ffmpeg> CLIPES=<pasta dos clipes> node "templates/autoserviços/_build-gold/videos.js"
```

## Como é

- **Preloader**: conta-giros que enche de vermelho com o ponteiro subindo e a porcentagem, depois abre em duas cortinas
- **Topo**: links com letras que rolam no hover, sublinhado vermelho na seção atual, botão de tema claro/escuro (fica salvo), telefone pulsando com "Aberto agora" ou "Fechado agora". Some ao descer e volta ao subir. Barra de progresso de leitura no topo da tela e cursor personalizado (só com mouse)
- **Capa em slides**: o primeiro é **vídeo** (garagem, farol, painel, mecânico, motor, polimento e estrada, 17 s) e os outros dois são fotos. Troca em cortina com o fundo deslizando por trás, camadas de texto entrando deslocadas como o parallax do Swiper da referência, segunda linha do título vazada que se preenche de vermelho, texto acompanhando o mouse, setas, barras de progresso, redes na vertical e faixa com e-mail, endereço e horário
- **Etapas** (Diagnóstico, Reparo, Entrega): cartões com barra que enche em sequência e ícone pulsando
- **Sobre nós**: frases em contorno que se preenchem ao rolar e acendem em vermelho no hover, duas fotos que se revelam em cortina com paralaxe, bloco "16+ anos" contando e selo girando. Logo abaixo, **Nossa equipe**: três retratos em **vídeo** que tocam ao passar o mouse (no celular, quando aparecem) e ganham cor
- **Serviços**: lista à esquerda e lado fixo à direita com o índice que marca o serviço da vez (como a referência). Cinco cartões tocam um **vídeo** do serviço no hover; clicar no cartão já escolhe o serviço no formulário
- **Vídeo da oficina**: moldura com cantos arredondados que abre até a tela cheia conforme a rolagem, vídeo de fundo em loop e botão de play pulsando que abre o player em tela cheia
- **Números**: 16+, 23 mil e 98% em letra vazada gigante que se enche de vermelho de baixo para cima enquanto conta
- **Montadoras**: esteira contínua com logos que acendem no hover
- **Depoimentos**: slide grande com cartão do cliente e foto do carro, cortina vermelha revelando a foto, botões "Anterior / Próximo", barras de tempo, arrastar e troca automática
- **Pacotes de revisão**: carrossel de preços (Check-up viagem, Revisão essencial, Revisão completa em destaque, Estética premium) com setas, arrastar e barra; cada um agenda pelo WhatsApp
- **FAQ**: sete perguntas, uma aberta por vez, roda de liga leve girando no fundo
- **Contato**: canais, tabela de horário com o dia de hoje destacado e formulário de agendamento (serviço ou pacote) que valida e abre o WhatsApp com a mensagem pronta
- **Instagram** em cima do rodapé: esteira contínua misturando fotos e **reels** que tocam sozinhos quando aparecem; pausa no hover
- **Rodapé**: chamada "lembrete da próxima revisão" com campo de WhatsApp, mapa padrão do OpenStreetMap (`.map-box`), "Onde atendemos", navegação, serviços, contatos e redes
- Vídeos só carregam quando necessários (`preload="none"`), não tocam com economia de dados ligada e param com "reduzir movimento"
