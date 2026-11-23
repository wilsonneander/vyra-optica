# Guia do projeto — Pente Fino

Landing page da Pente Fino, uma barbearia fictícia ("Você escolhe o corte. A gente passa o pente fino"). Vite sem framework, Three.js (a cadeira do topo e as três peças do manifesto), GSAP com ScrollTrigger, Lenis (rolagem suave na roda e no trackpad), fontes Unbounded, Satoshi e JetBrains Mono. **Uma barbearia escura, de foco de luz e cromo, onde o nome da casa é o desenho do topo e tudo leva ao agendamento.** A régua é site de premiação: se algo parece "ok", ainda não está pronto.

No catálogo: esta pasta é a fonte; `npm run catalogo` gera `../gold-pente/`. `npm run dev` para editar. `arquivos/` guarda o pacote original (prints de conceito, receitas de imagem, scripts de fonte) e não entra no site.

## Arquitetura
- **Os textos e as listas estão no `index.html`**: cada seção é uma `<section>` com um comentário em cima dizendo o que ela faz. O agendamento não tem dados próprios: lê os serviços das linhas do cardápio (`.cardapio .linha`: número, nome, duração, preço e `data-ferramenta`) e os barbeiros dos espelhos (`.espelho`: nome, especialidade e foto). Mudou o cardápio ou a equipe no HTML, o agendamento muda junto.
- **O CSS é uma folha só**, `src/styles/site.css` (por `@import`, na ordem: `tokens.css`, `base.css`, `hero.css`, `secoes.css`, `agenda.css`), ligada por `<link>` no `<head>`, depois do estilo crítico da abertura (inline). Nunca importe CSS pelo JS: no dev do Vite ele chega depois dos módulos e a página pinta crua por um instante a cada recarregamento.
- **Módulos**:

  | arquivo | o que faz |
  |---|---|
  | `src/main.js` | liga tudo nesta ordem: rótulo duplo e seta dos botões, Lenis e freio, barra de rolagem, cadeira, luz nas letras, nav, hero preso, títulos, seções, agendamento e, por último, a abertura |
  | `src/motion/ease.js` | curvas da marca (`pf-out`, `pf-in`, `pf-io`), `REDUZIDO`, `TOQUE`, `CELULAR()`, a unidade de cena e a altura da tela (100svh, nunca `innerHeight`) |
  | `src/motion/smooth.js`, `guia.js`, `scrollbar.js` | Lenis no relógio do GSAP; o freio da roda (no máximo ~1,1 tela por segundo; o toque nunca é cancelado); a barra de rolagem própria |
  | `src/motion/abertura.js` | a abertura: espera as fontes e as imagens, o pente percorre a curva com os sete fios, o cabelo apaga, as metades do nome vão para os cantos (FLIP), o foco acende e a interface entra; "Pular", rolar ou teclar aceleram |
  | `src/motion/hero.js` | o hero preso (~1,35 tela): interface sai por marco, palavras se afastam, a cadeira gira e chega perto, o fundo e a névoa vão do preto ao osso; e o degradê do foco nas letras |
  | `src/motion/nav.js`, `titulos.js` | a nav (some ao descer, tinta escura nas seções claras, link da seção atual, âncoras pelo Lenis); os títulos que sobem palavra por palavra |
  | `src/gl/cadeira.js`, `estudio.js` | a cena da cadeira: o `.glb`, os materiais (couro, cromo, borracha), o canhão, a poça de luz e a sombra no chão, a poeira, a névoa e o olhar que segue o mouse; o estúdio que o cromo reflete |
  | `src/secoes/index.js` | as seções: horário de verdade, cardápio, espelhos, cortes, clube, bancada, vale-presente, avaliações, endereço, dúvidas e rodapé |
  | `src/secoes/manifesto.js` | o carrossel de três peças 3D feitas em código, nos dois canvas (atrás e na frente da frase) |
  | `src/secoes/horario.js`, `odometro.js` | o horário da casa e a próxima cadeira livre (`?hora=14:20` simula a hora); o hodômetro dos números |
  | `src/agenda.js` | a gaveta de agendamento: passos, horários, máscaras, confirmação e o `.ics` |
- **Parâmetros de URL**: `?tema=preto | vinho | conhaque` troca o couro da cadeira; `?hora=HH:MM` simula a hora (status do hero, fecho e grade de horários).

## Design system
- Cores (só em `tokens.css`): preto `#070707` (fundo), osso `#eae8e5` (seções claras), branco `#f2f1ee`, tinta `#0b0b0b`, cinzas `#b9b8b5`, `#8d8c89`, `#5f5e5c`, `#3a3938`, fios brancos e escuros a 10% e 22%. **Nenhuma cor de acento**: a cor é o cromo e o couro.
- Tipos: Unbounded variável (títulos: a parte leve em 300 e a pesada em 800 na mesma frase; o nome do hero em 200 e 800), Satoshi (corpo), JetBrains Mono em caixa alta (rótulos, preços pequenos, status). Rótulo nunca abaixo de 12 px (11 no celular).
- Escala: `--su` nas seções (1 px de design a partir de 1280 de largura; só encolhe abaixo disso), `--u` no hero (1 px numa tela de 1440 × 900, encolhe pelo lado que apertar). Título de seção 60 (38 no celular), corpo 17, botões de 52 de altura. Cada seção comum cabe numa tela de 1440 × 900.
- Botões em pílula: o claro com a seta num círculo preto que gira 45° no hover; o rótulo sobe e a cópia entra por baixo; todo clicável encolhe no aperto e tem anel de foco.

## Regras de movimento
- **Textos por tempo, imagens pela rolagem.** Título, pílula, interface do hero: entram e saem por marco, com duração fixa. O que é imagem (cadeira, palavras gigantes do hero, leque do clube, cartão de metal, carrossel) anda preso à rolagem.
- **A rolagem nunca é segurada**: o freio só limita a velocidade da roda. No toque, a rolagem é a nativa.
- **Toda troca que existe no hover também acontece rolando**: a linha do cardápio acende pela linha do meio da tela, a luz dos espelhos passa de um em um, o carrossel do manifesto anda, a foto do corte vira (no celular).
- **Carrossel do manifesto**: a posição é a soma da rolagem (dois passos com patamares) com o ajuste dos cliques (sempre um número inteiro de passos, pelo caminho mais curto). Nunca zere o ajuste ao rolar e nunca faça o clique rolar a página. A pílula só troca passando do meio entre duas peças.
- **Giro das peças**: arrastar gira com inércia limitada a 7 rad/s, desliza com atrito e assenta de frente numa mola sem passar do ponto; clique só dá um pulinho.
- **Primeira pintura**: o `<head>` traz o fundo preto, o cabelo e o nome escondido até a fonte chegar, e `html:not(.assentou) *` sem transição; o `main.js` marca `assentou` depois de dois quadros e `js-pronto` antes de prender o hero. A abertura sempre começa do topo (`history.scrollRestoration = 'manual'`).
- `prefers-reduced-motion`: sem abertura (hero já assentado), transições secas.

## O 3D: regras que não se quebram
1. **Cadeira** (`src/gl/cadeira.js`): canvas transparente entre as duas palavras ("pente" atrás, "fino" na frente). O modelo é normalizado para 1,95 de altura e os materiais são trocados pelo nome da malha: metal vira cromo, plástico vira borracha, o resto é couro (`COUROS` define as cores dos temas). Se aparecer `[cadeira] sem o modelo` no console, o arquivo não está em `public/modelos/`.
2. A **névoa** é exponencial e calibrada pela distância da câmera até a cadeira.
3. O feixe de luz é CSS (`.hero__foco`); a poça de luz, a sombra de contato e a poeira são do Three. O degradê das letras usa o mesmo x do feixe (`luzNasLetras`).
4. **Manifesto**: as três peças são geometria de código, dois renderers com as mesmas peças; cada peça aparece no canvas de cima na metade da frente da órbita e no de baixo na de trás. As sombras ficam só no canvas de trás.
5. Os renderers só desenham com a cena na tela (IntersectionObserver); DPR até 2 (1,6 no celular). Não acrescente pós-processamento.

## Celular: regras que não se quebram
- Hero em coluna: "pente" em cima, a cadeira no meio, "fino" sobre a base dela, o status e os botões no pé.
- No cardápio a ferramenta não segue nada: fica pequena embaixo do número da linha acesa.
- No manifesto, as peças de trás sobem mais e a órbita é mais fechada.
- Espelhos: os fechados mostram o nome na vertical. Cortes e produtos em duas colunas; clube empilhado com o plano do meio primeiro; a gaveta sobe de baixo.
- Alvos de toque de 40 px no mínimo; nada pode rolar para o lado em 390 px. Conferir também em 375 × 553 e 393 × 659.

## Como checar
- `npm run build` sem aviso de arquivo faltando (o de "chunk" acima de 500 kB é do Three e é esperado).
- `npx vite preview`: console limpo; a abertura roda; recarregar nunca mostra a página crua.
- Rolando devagar e depressa: a cadeira some na névoa e o cardápio sobe; o manifesto troca "−1 dia" → "R$ 10" → "60 s"; os espelhos acendem um por um; os números contam; o mapa desenha a rota.
- Agendamento: abrir por qualquer "Agendar", os quatro passos, a confirmação, "Adicionar à agenda" baixa o `.ics`.
- Celular (390 px) e o build numa subpasta, com um servidor estático estrito (não o `vite preview`, que devolve o `index.html` para qualquer caminho): sem 404.

## Personalizar

| o quê | onde | precisa de material novo? |
|---|---|---|
| Nome da casa | `index.html`: as duas palavras do hero (`.hero__p--1`, `.hero__p--2`, com o `data-t` igual ao texto), a frase do canto (`.hero__frase`), `<title>`, nav, rodapé (`.rodape__nome`), cartão-presente, cantos da abertura | não. Duas palavras curtas funcionam melhor; ajuste o `font-size` de `.hero__p--1` e `--2` em `hero.css` se ficarem mais largas |
| Logo | `<symbol id="marca">` no `index.html`, `public/marca.svg` e a tampa da lata em `manifesto.js` (`lata()`) | o SVG da pessoa |
| Serviços, preços e durações | as linhas `.linha` do cardápio (`data-ferramenta`: `maquina`, `aparador`, `tesoura`, `navalha`, `pente`, `pincel`) | não |
| Barbeiros | os `.espelho`, os chips `.filtro` dos cortes e o `data-barbeiro` / `data-com` dos cortes | fotos da equipe |
| Cortes da casa | os `.corte` (foto de frente e de costas, nome, preço, barbeiro) | fotos (frente e costas da mesma pessoa) |
| Horário | `HORARIO` em `src/secoes/horario.js` e a lista `.horario` no `index.html` | não |
| Endereço, telefone, mapa | seção `#endereco` (o mapa é SVG desenhado à mão) | não; nada de cidade real se for demo |
| Clube, produtos, vale-presente, depoimentos, nota, dúvidas | as seções no `index.html` (`data-conta` é a economia do plano; `data-valor` do vale) | fotos dos produtos |
| Fatos do manifesto | `FATOS` em `src/secoes/manifesto.js` | não |
| Cor do couro | `COUROS` em `src/gl/cadeira.js` e `?tema=` | não |
| Cores e fontes | `src/styles/tokens.css` | não |

### Material
- **Cadeira 3D**: manter, trocar a cor em `COUROS`, ou trocar por outra cadeira `.glb` de licença livre passando por `node arquivos/fonte/prepara_cadeira.mjs <zip|gltf|glb>` (precisa de `npm install -E -D @gltf-transform/core@4.5.1 @gltf-transform/functions@4.5.1 @gltf-transform/extensions@4.5.1 meshoptimizer@1.3.0 sharp@0.35.5`) e ajustar `pivo.rotation.y`. A licença da atual (CC BY 4.0, "Barber Chair", de sweedboy69) está em `arquivos/fonte/cadeira-licenca.txt`; o crédito fica no rodapé enquanto ela estiver no site.
- **Espelhos** (`public/img/espelho-1..4.webp`): 3:2, ~1400 px, preto e branco, o barbeiro trabalhando visto pelo espelho, luminária em cima.
- **Cortes** (`public/img/cortes/corte-N-frente.webp` e `-costas.webp`): 760 px, 6:7, fundo preto com luz em cima, mesma pessoa e mesmo corte. Díptico + `arquivos/fonte/imagens.mjs` mantém a mesma pessoa.
- **Produtos** (`public/img/produtos/`): 4:5, ~820 px, pedestal preto sob spot, sem rótulo de marca.
- **Ferramentas** (`public/img/ferramentas/`): objeto sozinho em WebP com alfa, ~760 px no lado maior, sem sombra.
- **Cabelo da abertura** (`public/img/cabelo.webp`): macro de cabelo escuro, 16:9, ~2000 px, preto e branco.
- Prompts para gerar tudo isso: `arquivos/receitas/LEIA.md`.

### Regras ao trocar
- Nada de dado inventado como se fosse da pessoa: preço, telefone, endereço, nota, avaliações e depoimentos que ela não mandou ficam `[preencher]` (nunca no título).
- Mantenha a estrutura que dá o efeito: as duas palavras do hero com a cadeira entre elas, o `data-ferramenta` de cada serviço, quatro espelhos, três peças no manifesto.
- O agendamento é demonstração: não cobra nem envia nada. Para valer, ligue o passo 4 a um sistema de agenda e pagamento de verdade.
- Cliente que fechar este modelo: copie para `clientes/` e ajuste lá (o catálogo não muda por cliente).
