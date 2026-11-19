# Bebidas & Conveniências: modelo Plus "N3 Drinks" (marca própria)

Modelo **Plus** do nicho bebidas: site de **marca específica** (uma bebida própria, não uma loja que revende). Demonstração com a marca fictícia **N3 Drinks** (logo N3, slogan "Abre no estalo"), energético com gás em cinco sabores brasileiros (Pitanga, Limão-cravo, Maracujá, Açaí, Hortelã) e uma edição limitada (Breu).

Referência de design: template Framer "KLAXA" (https://physical-hyacinth-083721.framer.app/). Layout, paleta e animações 3D seguem a referência; marca, textos e lata foram refeitos, e as regras de [DIRETRIZES-SITES.md](../../DIRETRIZES-SITES.md) têm prioridade (sem numeração de tópicos, sem "·" e travessão, sem cápsulas, sem traço antes de títulos, mapa OpenStreetMap no rodapé).

Uma página só, HTML/CSS/JS puros, abre direto pelo `index.html` (sem build).

| Arquivo | O que é |
|---|---|
| `plus/index.html` | Página inteira e a lista de sabores (`window.N3_SABORES`: nome, cores do rótulo e os dados do modal: frase, descrição, notas, preço e ficha) |
| `plus/assets/js/n3-3d.js` | Motor 3D: lata, rótulo, hero, rótulo que desenrola e a cena do modal |
| `plus/assets/js/app.js` | Interações ligadas ao scroll (trilho, contadores, paralaxe, FAQ, topo), modal do sabor e cursor |
| `plus/assets/js/three.min.js` | three.js r149 (build UMD local, funciona em `file://`) |
| `plus/assets/css/style.css` | Design |
| `plus/assets/img/` | Mapa do OpenStreetMap (mesmo do Silver) e fotos de drinks |

Fontes: **Archivo** larga (wdth 125, peso 900) nos títulos, **Hanken Grotesk** no texto, **Martian Mono** nos detalhes técnicos. Paleta: creme `#F2F1EC`, tinta `#0C0D0B` e uma cor por sabor (laranja `#FF4B1F`, lima `#C3F53C`, amarelo `#FFD53A`, violeta `#6A34FF`, céu `#8CDCFF`).

## Como funciona o 3D

Nada é vídeo nem imagem pronta: a lata é montada em three.js na hora.

- **Lata**: corpo de alumínio torneado (`LatheGeometry`), tampa com lacre articulado e boca que se abre, reflexo de um estúdio com softboxes gerado no navegador (`PMREMGenerator`), gotas de condensação em relevo.
- **Rótulo**: "N3 DRINKS" na faixa da frente; desenhado num `<canvas>` por sabor (faixa da marca, tabela nutricional, código de barras, ícone do estalo) e aplicado numa malha própria que pode ir de cilindro a folha plana.
- **Latas dos cards** (linha de sabores, pela hora, quem bebe, chamada final): renderizadas uma vez num renderizador fora da tela e trocadas por `<img>`; leve e sem vários WebGL rodando.

## Comportamento no scroll

- **Hero**: a seção fica presa na tela e o scroll controla os 70 ms da lata abrindo em câmera lenta (de −20 ms a +50 ms): o lacre sobe, sai a névoa de gás e o spray de gotas. Voltar o scroll volta o tempo. Régua de tempo arrastável, leitura em ms, quadro da câmera, seletor de sabor (troca cor do fundo, rótulo, gotas e contraste do texto), lata inclina com o mouse, reflexo no chão.
- **Fita** preta com os destaques: anda sozinha e acelera com a velocidade do scroll.
- **Linha de sabores**: os cards ficam presos e a rolagem vertical os empurra para o lado, com barra de progresso.
- **Tira o rótulo**: a lata gira para a frente e o rótulo se desenrola até virar uma folha plana (contador "Rótulo fora 000%"). No fim, cinco pontos acendem sobre o rótulo com linhas até os textos. No tablet e no celular, um ponto por vez numa legenda embaixo.
- **Por que estala**: o "3,9" conta conforme a seção entra; medidores enchem.
- **Pela hora**: os cards ganham a cor cheia quando chegam ao meio da tela; latas com paralaxe.
- **Quem bebe, receitas, onde comprar**: paralaxe nas latas, zoom nas fotos e no mapa, etiquetas de loja flutuando.
- **Chamada final**: as palavras crescem e as cinco latas sobem e se abrem em leque.
- **Rodapé**: mapa padrão OpenStreetMap (`.map-box`), "Onde atendemos", e a marca gigante que se fecha com os lacres coloridos subindo.

## Modal do sabor e cursor

- Clicar em qualquer lata (cards da linha, pela hora, quem bebe, latas da chamada final) abre o modal do sabor: painel na cor do sabor com a lata 3D grande, que gira ao arrastar (com inércia), e uma lata menor inclinada mostrando o verso com a tabela nutricional; ao lado, etiqueta, nome, frase, descrição, notas, preço da lata e do fardo, botões, ficha (cafeína, calorias, açúcar, sódio) e navegação para o sabor anterior e o próximo. Fecha no X, clicando fora ou com Esc; setas do teclado trocam de sabor; o foco fica preso no modal.
- Cursor próprio (só com mouse): ponto laranja e um anel que vem atrás com atraso e estica na direção do movimento. Cresce e inverte as cores sobre links e botões, vira um círculo laranja com "Abrir" sobre as latas, "Arrastar" na régua do hero e "Girar" na lata do modal. No toque e com "reduzir movimento" fica o cursor normal.

Sem WebGL, o site continua legível (classe `sem-3d`). Com "reduzir movimento" ligado, as transições param e o scroll leva direto ao estado final.

## Trocar para outro cliente

1. Nome e textos no `index.html`; sabores e cores em `window.N3_SABORES`.
2. O desenho do rótulo fica em `desenhaRotulo()` no `n3-3d.js` (textos, tabela nutricional, posições dos pontos explicados).
3. Mapa do rodapé: gerar com `_build-silver/gerar-mapa.js` para o endereço do cliente.

## Aviso de cookies

Cartão escuro arredondado no canto inferior esquerdo (no celular ocupa a largura toda), com o lacre da logo dando um estalo, apoio em Martian Mono, título em Archivo larga e os botões da marca (creme com seta laranja e contorno): "Aceitar todos", "Só os necessários" e "Escolher quais cookies" (necessários sempre ligados; estatística e marketing com chave que fica laranja ao ligar). A escolha fica em `localStorage` (`n3-cookies`) e vira `window.n3Cookies`, com o evento `cookies` disparado no `document`: qualquer script de estatística ou anúncio deve esperar esse sinal. O link "Preferências de cookies" no rodapé reabre o cartão.

## Tema claro e escuro

Pílula com sol e lua na lateral direita (no celular, deitada dentro do menu). O marcador é uma tampinha coroa que rola de um ícone ao outro, dá um pulinho e solta bolhas de gás; a página troca de tema num círculo que se espalha a partir da tampinha (sem View Transitions, as cores passam suavemente). Peça comum em `templates/_comum/tema-tampinha.js`. A escolha fica salva no navegador e `?tema=claro` ou `?tema=escuro` no link também vale.

- N3 abre no **claro**; o escuro é grafite com as cores dos sabores acesas. O N3 não tem gerador: o CSS próprio do tema fica em `plus/tema-plus.css` e `node "templates/bebidas/plus/tema-plus.js"` põe ou atualiza as peças no `index.html`, `style.css` e `app.js` (entre as marcas `tema:inicio` e `tema:fim`). Chave `n3-tema`.
