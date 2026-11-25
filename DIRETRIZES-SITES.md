# Diretrizes obrigatórias para criar sites

Leia este documento inteiro antes de criar ou alterar qualquer site deste projeto.
Estas regras valem para todos os modelos do catálogo (Standard e Premium) e para sites de clientes.
O objetivo é que nenhum site tenha cara de "feito por IA": nada de componentes, ícones ou fontes que o Claude usa por padrão.

## Padrão do catálogo de templates
Toda a linha de templates do catálogo segue a mesma estrutura mínima, as mesmas funções de visualização e a mesma nomenclatura de níveis, em todos os nichos.

### Níveis: só Standard e Premium
- Existem apenas dois níveis: **Standard** e **Premium**.
- **Standard** reúne o que antes era Bronze e Silver. **Premium** reúne o que antes era Gold, Plus e premium.
- Proibido usar outro nome de nível em qualquer lugar (pastas, arquivos, vitrines, cartões, textos de venda, READMEs): nada de Bronze, Silver, Gold, Plus, Básico, Intermediário, Iniciante, Avançado, Modelo 1/2/3.
- Para diferenciar dois modelos da mesma marca e do mesmo nível, use o título no fim do nome (`vyra-standard-planos`), nunca um subnível.

### Nome das pastas
```
templates/<nicho>/
  standard/<marca>-standard[-<título>]/   site pronto de cada modelo Standard (abre pelo index.html)
  premium/<marca>-premium[-<título>]/     site pronto de cada modelo Premium
  _build-<pasta do modelo>/               código-fonte e conteúdo de cada modelo (gera a pasta acima)
  _build/               peças comuns aos modelos do nicho, quando existem
  _vitrine/             vitrine publicada no Firebase (fora do git)
```
- O nome da pasta do modelo segue sempre a ordem **marca, nível, título**, em minúsculas, sem acento e com hífen: `vyra-standard`, `vyra-standard-planos`, `vyra-premium`, `thd-premium-fibra`. O primeiro modelo de uma marca num nível fica só com marca e nível; os seguintes da mesma marca e nível ganham um título curto que diz o que têm de diferente. A pasta do código é `_build-` mais o mesmo nome (`_build-raiz-standard`).
- Na vitrine, cada modelo fica numa subpasta com o mesmo nome (`_vitrine/lume-standard/`). Quando uma pasta publicada muda de nome, o `firebase.json` da vitrine ganha um redirecionamento 301 do endereço antigo para o novo.
- Pastas `standard/`, `premium/` e as cópias nas vitrines são geradas: edite o `_build-<modelo>/` e rode o build.

### Quantidade mínima: 4 templates por categoria
- Toda categoria (nicho) do catálogo tem **no mínimo 4 templates**, somando Standard e Premium.
- Nicho com menos de 4 está incompleto e não deve ser oferecido como categoria pronta. A lista do que falta fica em [templates/README.md](templates/README.md).

### Obrigatório em todo template, de qualquer nível
- **Tema claro e escuro**, com as duas versões bem acabadas: contraste legível, imagens, fotos com sobreposição, mapa, formulários e logo funcionando nos dois temas (detalhes em "Botão de tema claro e escuro", abaixo).
- **Visualização por aparelho**: o resultado pode ser visto no celular, no tablet e no computador (a Prévia nos aparelhos da vitrine), e o layout é responsivo nos três tamanhos (detalhes em "Adaptador de aparelhos" e "Proporção e responsividade").
- **Aviso de cookies** (detalhes abaixo).

### Cartão do modelo na vitrine
- Todo cartão mostra no topo o selo do nível: **Standard** ou **Premium**.
- Quando o template tem Área do Cliente (login, painel ou conta), o cartão ganha, no topo e ao lado do selo do nível, o selo **+ Área do Cliente**.
- O texto embaixo **não repete** a Área do Cliente: nada de item "Área do cliente" na lista de recursos, nem "com Área do cliente" no subtítulo ou na descrição. O link que abre a demonstração da Área do Cliente pode ficar nos atalhos.
- Os dois selos formam um grupo e têm a mesma largura e altura (regra dos componentes repetidos). O do nível é preenchido; o da Área do Cliente é só contorno, na cor do texto.
- O botão traz o nome do modelo ("Abrir o Raiz").

## O que é proibido

### Numerais em tópicos
- Nada de "01", "02", "03" ou "1.", "2.", "3." marcando seções, etapas, cards ou benefícios.
- Nada de contadores decorativos grandes ao lado de títulos ("/01", "Nº 01", "Etapa 01").
- Se a ordem importa de verdade (um passo a passo), mostre a sequência pelo layout: linha do tempo, setas, posição na tela. Não pelo número.

### Travessão e bolinha separadora
- Proibido o travessão "—" e o meia-risca "–" no texto e nos títulos. Reescreva a frase com vírgula, ponto ou dois-pontos.
  - Errado: "Sem treinamento, o padrão muda de pessoa para pessoa — e o cliente sente."
  - Certo: "Sem treinamento, o padrão muda de pessoa para pessoa. E o cliente sente."
- Proibido o ponto médio "·" e o "•" como separador entre palavras ("AceleraISP · a consultoria do INB").
- Proibidas as bolinhas coloridas de status/destaque antes de um texto (o pontinho verde/azul piscando).
- Proibido o traço decorativo antes de títulos e subtítulos: aquela linha horizontal curta e colorida ao lado do texto de apoio.
  Exemplo do que não fazer: `———  Diagnóstico rápido`.
  Isso vale também quando o traço é feito em CSS (`::before` / `::after` com `width` pequeno e `height: 1px` ou `2px`, `border-top` curto, `<span class="line">`, `<hr>` inline) e não só quando é o caractere "—".
  O texto de apoio aparece sozinho, sem linha, traço ou marcador na frente nem atrás.

### Selo em cápsula (pill / badge / eyebrow)
- Proibido o selinho arredondado em formato de cápsula acima do título, com borda fina, texto em caixa-alta espaçada e bolinha na frente.
  Exemplo do que não fazer: `( • ACELERAISP · A CONSULTORIA DO INB )`.
- Evitar `border-radius: 999px` / `9999px` / `rounded-full` em qualquer etiqueta, tag ou chip de texto.
- Se precisar de um texto de apoio acima do título, use texto simples, sem caixa e sem borda, ou integre ao próprio título.

### Grade de cards com ícone em quadradinho
- Proibido o padrão "card escuro com borda fina + ícone pequeno dentro de um quadrado arredondado colorido + título em negrito + descrição cinza", repetido em grade 3x2.
- Proibido ícone de linha fina dentro de caixinha com fundo translúcido (`bg-primary/10`, `rgba(...,0.1)`) e cantos arredondados.
- Em vez disso: variar tamanhos e formatos dos blocos, usar foto, ilustração própria, tipografia grande, lista corrida, ou blocos sem ícone.

### Ícones padrão
- Proibidas as bibliotecas que o Claude usa por padrão: Lucide, Heroicons, Feather, Tabler, Phosphor, Font Awesome, Material Icons/Symbols, Bootstrap Icons, Ionicons.
- Proibidos também os mesmos desenhos copiados como SVG inline (chama, alvo, setas cruzadas, gráfico caindo, capelo, raio, escudo com check, foguete, estrela de brilho, check em círculo).
- Proibido emoji como ícone.
- Quando precisar de ícone: desenhar SVG próprio no estilo da marca (traço, preenchimento e cantos coerentes com a identidade), usar pictogramas da própria marca em [brand/](brand/), ou não usar ícone.

### Fontes padrão
Proibidas como fonte principal (título ou corpo):
- Inter, Manrope, Outfit, Plus Jakarta Sans, DM Sans, Space Grotesk, Satoshi, General Sans, Poppins, Montserrat, Roboto, Open Sans, Lato, Nunito, Raleway, Geist, IBM Plex Sans, Work Sans, Sora, Instrument Serif, Fraunces, Playfair Display.
- Proibido depender só de `system-ui`, `sans-serif` ou da pilha padrão do navegador.

Escolha da fonte:
- Cada projeto escolhe sua própria dupla de fontes a partir da personalidade da marca, e não repete a dupla do projeto anterior.
- Sugestões fora do padrão (Google Fonts): Familjen Grotesk, Schibsted Grotesk, Onest, Hanken Grotesk, Archivo / Archivo Narrow, Bricolage Grotesque, Unbounded, Syne, Chivo, Red Hat Display, Figtree, Epilogue, Big Shoulders Display, Anybody, Literata, Newsreader, Gloock.
- Se a marca tem fonte definida em [brand/](brand/), ela tem prioridade.

## Componente de mapa no footer
- Todo site tem o mapa no footer, e ele é sempre o mesmo componente padrão usado nos modelos (veja o footer de [templates/provedor-internet/standard/vyra-standard-planos/index.html](templates/provedor-internet/standard/vyra-standard-planos/index.html) e [templates/provedor-internet/premium/vyra-premium/index.html](templates/provedor-internet/premium/vyra-premium/index.html)).
- O mapa é do **OpenStreetMap**. Proibido usar o componente do Google Maps: nada de `<iframe>` do Google (`google.com/maps/embed`, `google.com/maps?q=...&output=embed`), nem API JavaScript do Google Maps.
- Estrutura padrão do componente (`.map-box`):
  - imagem do mapa gerada a partir do OpenStreetMap, salva em `assets/img/` (ex.: `mapa_<cidade>.jpg`), com `alt` descrevendo o local e `loading="lazy"`;
  - pino da marca (`.pin`) sobre o ponto do endereço;
  - cartão de informações (`.map-info`) com nome, endereço e horário de atendimento;
  - botões (`.mbtns`) "Abrir no Maps" e "Como chegar", que só abrem o link externo de rota em nova aba;
  - crédito obrigatório: `© OpenStreetMap` com link para `https://www.openstreetmap.org/copyright` (`.attr`).
- Ao lado do mapa fica o bloco "Onde atendemos" com as cidades atendidas.
- Muda só o conteúdo (imagem do mapa, endereço, horário, cidades) e as cores da marca. O formato do componente não muda de um site para outro.

## Componentes repetidos com fundo têm SEMPRE o mesmo tamanho
- Todo grupo de componentes com fundo preenchido (botões lado a lado, chips de bairro ou cidade, etiquetas, filtros, opções, botões de mapa etc.) usa **a mesma largura e a mesma altura em todos os itens do grupo**. Proibido cada item ter a largura do próprio texto e o grupo ficar desalinhado.
- A medida é a do item com mais caracteres: os outros seguem a largura dele, com o texto centralizado.
- Se o item mais largo não couber na tela (celular), todos passam a ocupar a largura disponível, continuando iguais entre si.
- Implementação recomendada: grupo marcado com `data-iguais`. Um script mede a largura natural de cada filho, aplica a maior em `--larg` no grupo e refaz a medida após `document.fonts.ready` e no `resize`. CSS: `[data-iguais] > * { width: var(--larg); max-width: 100%; justify-content: center; }`. Para dois ou três botões numa linha só, `display: inline-grid; grid-auto-flow: column; grid-auto-columns: 1fr;` resolve sem script.
- Vale também para itens de estados diferentes no mesmo grupo (ativo, "em breve", desativado): o estado muda a cor, nunca o tamanho.

## Proporção e responsividade
- Cards, componentes e grupos são sempre proporcionais ao espaço que ocupam: nada de bloco pequeno encostado num canto com uma sobra vazia ao lado.
- No celular, todo grupo de componentes (chips, botões, cards, etiquetas, bairros, opções) ocupa **100% da largura útil** da tela. Em vez de itens com largura fixa e espaço sobrando à direita, use colunas iguais que dividem a largura toda: `display: grid; grid-template-columns: repeat(2, 1fr);` (ou 1 coluna em telas muito estreitas). Os itens continuam todos do mesmo tamanho entre si.
- Grades de cards usam colunas que esticam (`repeat(auto-fill, minmax(..., 1fr))` no computador, `1fr 1fr` ou `1fr` no celular). Proibido grade com largura fixa que deixa uma faixa vazia na lateral.
- Imagens e fotos mantêm a proporção (`object-fit: contain` para produto recortado, `cover` para foto de ambiente) e nunca aparecem esticadas ou achatadas.
- Conferir o site em pelo menos três larguras antes de entregar: computador (1440px), tablet (768px) e celular (390px e 360px). Em nenhuma delas pode haver rolagem horizontal, texto cortado ou bloco desalinhado.

## Modelos Premium: animação de rolagem com direção (obrigatória)
Todo modelo **Premium** tem a **Scroll Direction-Based Reveal Animation** (também chamada de scroll reveal com direção, direction-aware scroll animation ou scroll-driven animation): a página se monta conforme a rolagem, como quem conta uma história, e se desfaz e se refaz nos dois sentidos.
- **Descendo**: cada bloco entra pela borda de baixo (sobe e aparece) e, ao passar da borda de cima, sobe e se apaga.
- **Subindo**: o mesmo bloco volta descendo pelo topo e, ao passar da borda de baixo, se desfaz. Nada fica "preso" já revelado.
- O efeito **segue a posição da rolagem** (não é só um gatilho de uma vez): parar no meio deixa o bloco no meio do caminho.
- Títulos sobem palavra por palavra e fotos se revelam por máscara; o lado de onde entram acompanha o sentido da rolagem. Contadores contam de novo ao voltar à tela.
- Blocos lado a lado entram em sequência (o atraso vira distância de rolagem), e cada seção pode variar o movimento: subir, entrar de lado ou crescer.
- Implementação recomendada (sem biblioteca): um laço em `requestAnimationFrame` no evento de rolagem que lê `getBoundingClientRect()` de todos os blocos e depois grava `--p` (entrada por baixo, de 0 a 1) e `--q` (saída por cima, de 0 a 1) em cada um. CSS: `opacity: min(var(--p), var(--q)); translate: 0 calc((1 - var(--p)) * 64px - (1 - var(--q)) * 52px);`. Usar `translate`/`scale` (propriedades separadas) para não brigar com o `transform` dos efeitos de hover. O sentido da rolagem vai em `data-rolagem="desce|sobe"` no `<html>`. Títulos, fotos e contadores usam `IntersectionObserver` que liga ao entrar e desliga ao sair por qualquer borda.
- Com `prefers-reduced-motion: reduce`, tudo aparece parado.
- Exemplo pronto: [templates/estetica/_build-iris-premium/app.js](templates/estetica/_build-iris-premium/app.js) (bloco "a história na rolagem") e o fim de [style.css](templates/estetica/_build-iris-premium/style.css).

## Itens padrão em todo modelo (Standard e Premium)
Todo modelo novo do catálogo sai com os três itens abaixo. Não é opcional por faixa de preço.

### Adaptador de aparelhos (Celular, Tablet, Computador)
- Todo modelo entra numa vitrine e recebe a **Prévia nos aparelhos**: o botão "Ver nos aparelhos" na vitrine e o controle só com ícones no canto inferior esquerdo de cada página do modelo.
- Não se escreve à mão: rodar `node templates/_comum/previa/instalar.js` depois de copiar o modelo para a vitrine e **antes de todo `firebase deploy`**. A fonte única é [templates/_comum/previa/](templates/_comum/previa/README.md); as cópias em `<vitrine>/previa/` são geradas.
- Vitrine nova ganha as cores do nicho em `TEMAS`, no `instalar.js` (sem entrada, fica no grafite e dourado padrão).
- O modelo original em `templates/<nicho>/` e as cópias de cliente em `clientes/` **não** levam o adaptador.
- Nada fixo do site pode ficar no canto inferior esquerdo além do aviso de cookies (o controle sobe sozinho acima dele).

### Botão de tema claro e escuro
- Todo modelo tem os dois temas completos (fundo, texto, cartões, fotos com sobreposição, mapa, formulários, menu do celular e `meta theme-color`), não só a troca do fundo.
- O tema padrão de cada modelo vem em `<html data-tema="claro|escuro">`. A escolha fica salva em `localStorage` e é aplicada por um script no `<head>` antes de pintar (sem piscar o tema errado). `?tema=claro` ou `?tema=escuro` no link também vale.
- Botão com sol e lua, `role="group"` e `aria-pressed`; no computador fica fixo na lateral e no celular vai para o menu ou para o topo. A troca é suave (as cores passam de um tema para o outro), e com `prefers-reduced-motion` troca sem animação.
- Reaproveitar as peças de `templates/_comum/` (`tema-pilula.js`, `tema-lanches.js`, `tema-tampinha.js`) ou criar uma nova lá com o mesmo formato (`pilula`/`head`/`js`/`css`), com o marcador ligado à identidade do nicho.

### Aviso de cookies
- Faixa discreta (`<div class="cookies" role="region" aria-label="Aviso de cookies" hidden>`) que aparece na primeira visita, com texto curto do que o site guarda e "Saiba mais" abrindo a Política de privacidade.
- Dois botões do mesmo tamanho (`data-iguais`): **Aceitar todos** e **Só os essenciais**. A escolha fica salva em `localStorage` (`<marca>-cookies`, com a escolha e a data) e o aviso não volta.
- No rodapé, junto dos links legais, o botão **Preferências de cookies** (`data-cookies`) reabre o aviso.
- Medição de visitas só depois de "Aceitar todos". Nenhum cookie de publicidade.
- A Política de privacidade tem a parte "Cookies e armazenamento" dizendo o que o site guarda (escolha de cookies, tema, sacola, agendamentos etc.).
- Exemplo pronto: [templates/barbearia/_build-mecha-standard/build.js](templates/barbearia/_build-mecha-standard/build.js) (bloco "janelas legais e cookies") e o mesmo bloco no [app.js](templates/barbearia/_build-mecha-standard/app.js).

## Outros vícios de IA a evitar
- Gradiente roxo/azul com brilho ("glow") atrás do título.
- Título com uma palavra em gradiente colorido.
- Todos os cards com o mesmo `border-radius` grande e a mesma borda de 1px translúcida.
- Seção "problemas" em grade de 6 cards iguais seguida de seção "solução" em grade de 6 cards iguais.
- Frases de efeito em três partes ("Rápido. Simples. Seguro.").

## Checklist antes de entregar
Rodar na pasta do site e confirmar que nada aparece (fora de comentários ou nomes de arquivo):

```bash
grep -rnE "—|–|·|•" templates/ --include=*.html
grep -rnE "lucide|heroicons|feather|tabler|phosphor|font-awesome|material-icons|material-symbols|bootstrap-icons|ionicons" templates/
grep -rnE "Inter|Manrope|Outfit|Plus Jakarta|DM Sans|Space Grotesk|Satoshi|General Sans|Poppins|Montserrat|Roboto|Open Sans|Geist" templates/ --include=*.css --include=*.html
grep -rnE "999px|9999px|rounded-full" templates/ --include=*.css --include=*.html
grep -rnE ">\s*0[1-9]\s*<|>\s*/0[1-9]" templates/ --include=*.html
grep -rnE "::?(before|after)" templates/ --include=*.css   # conferir se algum desenha traço antes/depois de título
grep -rnE "<iframe|google\.com/maps/embed|output=embed|maps\.googleapis" templates/ --include=*.html   # mapa tem que ser OpenStreetMap
find templates -type d -regextype egrep -regex ".*/(_build-)?(bronze|silver|gold|plus|basico|intermediario)(-[a-z-]+)?" -not -path "*/node_modules/*"   # pasta com nível antigo
grep -rnwE "Bronze|Silver|Gold|Iniciante|Avançado|Intermediário" templates/*/_vitrine*/index.html templates/_vitrine-*/index.html templates/*/_apresentacao/index.html templates/*/_modelos/index.html   # nível antigo nos cartões
```

E conferir visualmente:
- Nenhum selo em cápsula com bolinha acima de título.
- Nenhum traço ou linha decorativa antes ou depois de títulos e textos de apoio.
- Nenhuma grade de cards com ícone em quadradinho.
- Nenhum número marcando tópico.
- Mapa do footer é o componente padrão com OpenStreetMap, igual aos modelos.
- Premium: a página se monta conforme a rolagem e se desfaz ao voltar (descendo e subindo).
- Nível só Standard ou Premium em pasta, arquivo, vitrine e texto; pasta em `standard/<marca>-standard[-<título>]/` ou `premium/<marca>-premium[-<título>]/` com fonte em `_build-<mesmo nome>/`.
- Cartão da vitrine com o selo do nível no topo e, se houver Área do Cliente, o selo "+ Área do Cliente" ao lado, sem repetir isso no texto de baixo.
- O nicho continua com pelo menos 4 templates.
- Botões, chips e etiquetas com fundo que aparecem em grupo têm todos a mesma largura e altura (a do item mais longo).
- No celular, grupos e grades ocupam 100% da largura útil, sem espaço vazio sobrando ao lado; cards e componentes proporcionais em 1440px, 768px, 390px e 360px.
- Botão de tema claro e escuro funcionando, com o tema salvo ao recarregar e as duas versões conferidas por inteiro.
- Aviso de cookies na primeira visita, os dois botões do mesmo tamanho, e "Preferências de cookies" no rodapé reabrindo.
- `instalar.js` rodado na vitrine: o controle de aparelhos aparece em todas as páginas do modelo e o "Ver nos aparelhos" ao lado do "Abrir".
