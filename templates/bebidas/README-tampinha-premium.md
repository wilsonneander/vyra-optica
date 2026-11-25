# Bebidas & Conveniências: modelo Tampinha Premium "Tampinha"

Nicho **bebidas e conveniência** (adega, depósito de bebidas, conveniência de bairro). Mesma loja fictícia do Tampinha Standard e do Tampinha Standard Palco (Tampinha Bebidas & Conveniência, Floresta, Belo Horizonte), agora na versão mais sofisticada: fundo preto, dourado envelhecido `#B08D57` nos detalhes e branco quente. Referência visual: estúdio escuro com garrafas sobre água e reflexo.

Uma página só, com catálogo, carrinho e pedido montado para o WhatsApp. O destaque é a **lata da casa em 3D** (Tampinha Reserva) que gira conforme a rolagem.

| Pasta | O que é |
|---|---|
| `_build-tampinha-premium/content.js` | Conteúdo (o mesmo do Tampinha Standard Palco) mais o que é só do Tampinha Premium: `vitrine` (garrafas da capa), `reserva` (lata da casa, capítulos e ficha), `momentos` (fotos de gente) e `creditos`. `[EXEMPLO]` = trocar pelo cliente |
| `_build-tampinha-premium/lata.js` | A lata 3D em Three.js: rótulo desenhado em canvas, metal com reflexo de estúdio, gotas de condensação, reflexo no chão, anéis na água e partículas douradas. Gira uma volta e meia com a rolagem e inclina no fim para mostrar o lacre |
| `_build-tampinha-premium/vendor/three.module.min.js` | Three.js r160 (MIT). O `build.js` converte para script comum (`assets/three.min.js`), então o site abre até direto pelo arquivo, sem servidor e sem CDN |
| `_build-tampinha-premium/img/pessoas/` | Fotos de pessoas (Unsplash): brindes à noite, varanda, terraço, bar. Créditos no rodapé |
| `_build-tampinha-premium/img/mapa_floresta_ouro.webp` | Mapa do OpenStreetMap no tema `ouro` (`gerar-mapa.js`) |
| `_build-tampinha-premium/icons.js` | Logo da tampinha em dourado, ícones e a lata desenhada em SVG (miniatura do carrinho e reserva sem WebGL) |
| `_build-tampinha-premium/build.js`, `style.css`, `app.js` | Gerador, design e interação do site |
| `_build-tampinha-premium/painel-html.js`, `painel.css`, `painel.js` | Área do Cliente (`painel.html`) |
| `_build-tampinha-premium/loja.js` | Dados compartilhados entre site e painel: catálogo, categorias e horário publicados |
| `_build-tampinha-premium/horario.js` | Horário de funcionamento: "aberto agora", próxima abertura e texto agrupado ("Segunda a quinta: 10h às 23h"). Usado no build, no site e no painel |
| `premium/tampinha-premium/` | **Site pronto** (abre direto pelo `index.html`) |

Fotos de produto, ambiente e logos vêm do Tampinha Standard Palco (`_build-tampinha-standard-palco/img/fotos/`), não são duplicadas.

## Gerar

```bash
node "templates/bebidas/_build-tampinha-premium/build.js"
```

Mapa (só se o endereço mudar; precisa do `sharp` fora do projeto, rodar dentro de `_build-tampinha-premium/`):

```bash
NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js ouro img/mapa_floresta_ouro.webp
```

## Como é

- **Preloader**: a tampinha dourada gira como moeda, o nome aparece e a tela sobe
- **Topo** transparente, ganha fundo com desfoque ao rolar; links em caixa alta espaçada, status do horário, carrinho e botão **Área do cliente** (no celular, dentro do menu)
- **Capa**: Heineken, Red Label e Tanqueray em pé sobre a água escura, com reflexo, anéis se abrindo na água, gotas suspensas e "TAMPINHA" vazado gigante ao fundo. As garrafas acompanham o mouse
- **Fita** com entrega, iFood, 99Food, site 100% seguro e WhatsApp
- **Tampinha Reserva (3D)**, logo depois da capa: seção presa na tela enquanto a lata gira com a rolagem. Três capítulos de texto trocam no caminho (marcadores em losango à direita) e no fim aparece a ficha (teor, amargor, temperatura, harmonização) com preço e botão de compra. A lata entra no catálogo e no carrinho como qualquer bebida
- **Catálogo** com busca, filtros do mesmo tamanho, ordenação e "Ver mais"
- **Categorias** em índice editorial: nome grande em Bodoni, contagem, e as garrafas da categoria aparecem seguindo o mouse. O clique volta ao catálogo já filtrado
- **Seleção da casa** (carrossel)
- **Momentos**: mosaico de fotos de gente brindando e se divertindo, com paralaxe
- **Faixa de foto** com frase e **marcas** em esteira (fotos em cinza que ganham cor)
- **Kits** em blocos alternados com foto, garrafas em leque e lista de itens
- **Como pedir**: linha dourada que desce com a rolagem acendendo os passos, foto e a mensagem do WhatsApp aparecendo linha a linha
- **Entrega**: dados, botões iFood e 99Food, selo "Site 100% seguro" girando, atendimento no WhatsApp
- **Dúvidas** em sanfona e **rodapé** com o mapa padrão `.map-box` do OpenStreetMap em preto e dourado
- **Carrinho**, confirmação de 18 anos, barra fixa no celular e pedido separado por categoria no WhatsApp (mesma lógica do Tampinha Standard Palco)
- Sem WebGL, a seção mostra a lata desenhada; com "reduzir movimento", as animações automáticas param

## Área do Cliente (`painel.html`)

Mesmo modelo do painel do fast food (Monta Burger), na paleta preta e dourada. Botão "Área do cliente" no topo, no menu do celular e no rodapé.

- **Login** com foto de bar à esquerda e formulário à direita. Demonstração: `loja@tampinhabebidas.com.br` / `tampinha2026`, já preenchidos (tirar o `value` dos inputs em `painel-html.js` para cliente real)
- **Cadastro do estabelecimento** (`painel.html#cadastro`): responsável, loja, e-mail, WhatsApp com máscara, senha e confirmação, declaração de dono. Contas ficam no navegador (`tampinha-gold-contas`)
- **Produtos**: lista ou grade, filtro por categoria, busca, editar, esconder do site e apagar. Cada mudança fica marcada como "não publicada"
- **Nova bebida**: foto (envio do computador, reduzida no navegador mantendo o fundo transparente, ou galeria com as fotos do catálogo), nome, marca, embalagem, categoria, preço, "+18", "Seleção da casa" e "Esconder do site"
- **Categorias**: criar, renomear, marcar como +18, mudar a ordem (ordem dos filtros e do índice no site) e apagar quando vazia
- **Horários**: cada dia da semana com chave Aberto/Fechado e horas de abrir e fechar. Fechar depois da meia-noite vira o dia sozinho ("fecha no dia seguinte"). Atalhos para copiar a segunda para os dias úteis ou para a semana toda. Prévia ao lado mostra o status de agora e o texto que vai para o site
- **Publicar no site**: catálogo, seleção da casa, filtros, índice de categorias, preço da lata da casa e horário (status do topo, rodapé e cartão do mapa) passam a vir do que foi publicado. Kits com alguma bebida apagada ou escondida somem. Com o site aberto em outra aba, ele recarrega na hora. "Descartar alterações" e "Voltar ao catálogo e horário originais"

Por ser demonstração sem servidor, tudo fica no `localStorage` (`tampinha-gold-publicado` e `tampinha-gold-rascunho`). Para cliente real, trocar `ler`/`gravar` de `loja.js` por chamadas à API da loja e o login por autenticação real.

## Identidade

- Cores: preto `#0B0A09`, carvão `#12110F`, dourado `#B08D57`, dourado claro `#D2B583`, branco quente `#F6F2EA`
- Fontes: **Bodoni Moda** (títulos, itálico nos destaques) + **Familjen Grotesk** (texto). Dupla nova no projeto
- Tampinha Reserva é uma marca fictícia da loja; para cliente real, trocar pelo produto próprio dele ou por uma bebida que ele queira destacar (o rótulo é desenhado em `lata.js`, função `desenhaRotulo`)

## Para virar site de cliente

Copiar para `clientes/<cliente>/` (nunca editar aqui). Trocar `content.js`, as fotos, o rótulo da lata, o logo em `icons.js`, gerar o mapa do endereço real, ajustar iFood e 99Food e tirar o `noindex` do `build.js`.

## Tema claro e escuro

Pílula com sol e lua na lateral direita (no celular, deitada dentro do menu). O marcador é uma tampinha coroa que rola de um ícone ao outro, dá um pulinho e solta bolhas de gás; a página troca de tema num círculo que se espalha a partir da tampinha (sem View Transitions, as cores passam suavemente). Peça comum em `templates/_comum/tema-tampinha.js`. A escolha fica salva no navegador e `?tema=claro` ou `?tema=escuro` no link também vale.

- Tampinha Premium abre no **escuro**; o claro é marfim com o mesmo dourado. Fotos com texto, balão do WhatsApp e rodapé continuam escuros. Chave `tampinha-gold-tema`. A Área do cliente (`painel.html`) segue como era.
