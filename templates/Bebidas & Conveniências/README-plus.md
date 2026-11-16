# Bebidas & Conveniências: modelo Plus "ESTALO" (marca própria)

Modelo **Plus** do nicho bebidas: site de **marca específica** (uma bebida própria, não uma loja que revende). Demonstração com a marca fictícia **ESTALO**, energético com gás em cinco sabores brasileiros (Pitanga, Limão-cravo, Maracujá, Açaí, Hortelã) e uma edição limitada (Breu).

Referência de design: template Framer "KLAXA" (https://physical-hyacinth-083721.framer.app/). Layout, paleta e animações 3D seguem a referência; marca, textos e lata foram refeitos, e as regras de [DIRETRIZES-SITES.md](../../DIRETRIZES-SITES.md) têm prioridade (sem numeração de tópicos, sem "·" e travessão, sem cápsulas, sem traço antes de títulos, mapa OpenStreetMap no rodapé).

Uma página só, HTML/CSS/JS puros, abre direto pelo `index.html` (sem build).

| Arquivo | O que é |
|---|---|
| `site-plus/index.html` | Página inteira e a lista de sabores (`window.ESTALO_SABORES`: nome, cores do rótulo, nota) |
| `site-plus/assets/js/estalo-3d.js` | Motor 3D: lata, rótulo, hero e rótulo que desenrola |
| `site-plus/assets/js/app.js` | Interações ligadas ao scroll (trilho, contadores, paralaxe, FAQ, topo) |
| `site-plus/assets/js/three.min.js` | three.js r149 (build UMD local, funciona em `file://`) |
| `site-plus/assets/css/style.css` | Design |
| `site-plus/assets/img/` | Mapa do OpenStreetMap (mesmo do Silver) e fotos de drinks |

Fontes: **Archivo** larga (wdth 125, peso 900) nos títulos, **Hanken Grotesk** no texto, **Martian Mono** nos detalhes técnicos. Paleta: creme `#F2F1EC`, tinta `#0C0D0B` e uma cor por sabor (laranja `#FF4B1F`, lima `#C3F53C`, amarelo `#FFD53A`, violeta `#6A34FF`, céu `#8CDCFF`).

## Como funciona o 3D

Nada é vídeo nem imagem pronta: a lata é montada em three.js na hora.

- **Lata**: corpo de alumínio torneado (`LatheGeometry`), tampa com lacre articulado e boca que se abre, reflexo de um estúdio com softboxes gerado no navegador (`PMREMGenerator`), gotas de condensação em relevo.
- **Rótulo**: desenhado num `<canvas>` por sabor (faixa da marca, tabela nutricional, código de barras, ícone do estalo) e aplicado numa malha própria que pode ir de cilindro a folha plana.
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

Sem WebGL, o site continua legível (classe `sem-3d`). Com "reduzir movimento" ligado, as transições param e o scroll leva direto ao estado final.

## Trocar para outro cliente

1. Nome e textos no `index.html`; sabores e cores em `window.ESTALO_SABORES`.
2. O desenho do rótulo fica em `desenhaRotulo()` no `estalo-3d.js` (textos, tabela nutricional, posições dos pontos explicados).
3. Mapa do rodapé: gerar com `_build-silver/gerar-mapa.js` para o endereço do cliente.
