# Autosserviços: modelo Silver "Pistão Auto Center"

Nicho **autosserviços** (oficina mecânica, revisão e estética automotiva). Template de demonstração com empresa fictícia (Pistão Auto Center, Silveira, Belo Horizonte).
Referência visual enviada: tema "CRAS Car Repair & Auto Services" (fundo grafite, vermelho, Oxanium, formas inclinadas, texto vazado gigante atrás dos títulos), mais a faixa de números com ícones e a faixa de Instagram em cima do rodapé.

Uma página só, com as seções do menu: Início, Serviços, Sobre nós, FAQ e Contato (com formulário). Sem loja, galeria, blog ou páginas extras.

| Pasta | O que é |
|---|---|
| `_build-silver/content.js` | Todo o conteúdo: marca, contatos, horários, slides da capa, etapas, números, serviços, montadoras, depoimentos, FAQ, bairros e fotos do Instagram. `[EXEMPLO]` = trocar por cliente |
| `_build-silver/build.js` | Gera o `index.html` e copia CSS, JS e imagens |
| `_build-silver/style.css`, `_build-silver/app.js` | Design e interação (copiados para `site-silver/assets/`) |
| `_build-silver/icons.js` | Logo (pistão no paralelogramo), carro do preloader, roda do FAQ e ícones desenhados para a marca |
| `_build-silver/img/fotos/` | Fotos em WebP. `imagens.js` baixa as do Unsplash; freio, suspensão, pneus, alinhamento, capa e oficina vieram do modelo Bronze |
| `_build-silver/img/marcas/` | Logos das montadoras (Simple Icons, CC0), viram um sprite `<symbol>` no HTML |
| `_build-silver/img/mapa_silveira.webp` | Mapa do OpenStreetMap recolorido no tema `grafite` (`gerar-mapa.js`) |
| `site-silver/` | **Site pronto** (abre direto pelo `index.html`) |

## Gerar

```bash
node "templates/autoserviços/_build-silver/build.js"
```

Fotos e mapa só precisam ser gerados de novo se mudarem (precisam do `sharp` instalado fora do projeto):

```bash
NODE_PATH=<pasta com node_modules/sharp> node "templates/autoserviços/_build-silver/imagens.js"
NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js grafite img/mapa_silveira.webp   # rodar dentro de _build-silver/
```

## Como é

- **Preloader**: carro de lado chacoalhando com as rodas girando e riscos de velocidade passando (some em até 2,6 s)
- **Topo** transparente sobre a capa; ganha fundo com desfoque ao rolar, some ao descer e volta ao subir. Telefone com ícone pulsando e status "Aberto agora" ou "Fechado agora" pelo horário. No celular, menu em tela cheia com os links subindo um a um
- **Capa em slides**: três fotos de carros com zoom lento, troca com cortina da direita para a esquerda, título em duas linhas subindo, setas redondas, barrinhas de progresso na lateral, redes sociais na vertical e faixa com e-mail, endereço e horário. Arrasta no celular
- **Etapas** (Diagnóstico, Reparo, Entrega): barras vermelhas que se enchem em sequência, ícones com anel pulsando, fundo com listras diagonais correndo
- **Sobre nós**: texto vazado gigante que desliza com a rolagem, frases em contorno que se preenchem de branco conforme sobem na tela, foto inclinada sobre bloco vermelho com paralaxe e selo circular girando
- **Números** (como a referência enviada): ícones vermelhos, números que contam ao aparecer, fundo com foto de motor andando devagar e um brilho vermelho passando
- **Serviços**: título e índice fixos à esquerda; à direita, sete cartões com foto que se empilham ao rolar (o de baixo encolhe e escurece). O índice marca o serviço da vez. Cada cartão pede orçamento no WhatsApp. No celular viram uma lista normal
- **Faixa de chamada**: letreiro vermelho inclinado correndo com os serviços, foto com paralaxe e dois botões
- **Montadoras**: carrossel infinito com Volkswagen, Fiat, Chevrolet, Peugeot, Renault, Honda, Hyundai, Toyota, Ford, Nissan, Jeep e Citroën; segunda fileira em sentido contrário. Pausa no hover e a logo acende
- **Depoimentos**: carrossel de cinco cartões (dois por vez no computador), setas, arrastar, troca automática e barra de progresso. Fundo com foto respirando
- **FAQ**: seis perguntas, uma aberta por vez, abrindo suave; roda de liga leve girando no fundo
- **Contato**: canais, tabela de horário e formulário de agendamento (nome, WhatsApp com máscara, marca, modelo, serviço, data, período). Valida e abre o WhatsApp com a mensagem pronta
- **Instagram** em cima do rodapé: arroba grande e oito fotos de carros lado a lado (quatro por linha no celular), com zoom e véu vermelho no hover
- **Rodapé**: mapa padrão do OpenStreetMap (`.map-box`) no tema escuro, "Onde atendemos", navegação, serviços, contatos e redes
- Botão de voltar ao topo com anel de progresso da rolagem e WhatsApp flutuante
- Com "reduzir movimento" ligado no sistema, as animações param
