# Diretrizes obrigatórias para criar sites

Leia este documento inteiro antes de criar ou alterar qualquer site deste projeto.
Estas regras valem para todos os modelos do catálogo (Standard e Premium) e para sites de clientes.
O objetivo é que nenhum site tenha cara de "feito por IA": nada de componentes, ícones ou fontes que o Claude usa por padrão.

## Como trabalhar: boas práticas e git
Vale para toda criação, edição ou alteração, por menor que seja (site, template, vitrine, script ou documento).

### Nunca trabalhar na main
- Antes de mexer em qualquer arquivo, criar uma branch nova a partir da `main` atualizada, com nome curto que diga o que vai ser feito (ex.: `lanches-standard`, `dentista-tema`, `fix-mapa-footer`).
- Se já estiver numa branch do mesmo assunto, continuar nela; se o assunto for outro, criar outra branch.
- Nada de commit, merge ou push direto na `main`. Ela só recebe trabalho pronto, vindo de uma branch.

### Procedimentos do git
1. `git switch main` e `git pull` para partir da versão mais recente.
2. `git switch -c <nome-da-branch>`.
3. Fazer a alteração e conferir (checklist do fim deste documento, páginas abertas no navegador, build rodado).
4. `git status` e `git diff` para revisar exatamente o que mudou; adicionar só os arquivos da tarefa (nada de `.env`, credenciais ou arquivos temporários).
5. Commits pequenos e com mensagem clara no padrão `tipo(escopo): descrição` (`feat`, `fix`, `docs`, `refactor`, `style`, `chore`), em português.
6. `git push -u origin <nome-da-branch>` e, quando for para a `main`, abrir pull request ou fazer o merge só depois de aprovado.

### Boas práticas de programação
- Código legível: nomes claros em variáveis, funções, classes CSS e arquivos; indentação consistente; sem código morto, comentado ou duplicado.
- Reaproveitar antes de criar: usar os componentes, scripts e estilos que já existem no projeto em vez de copiar e colar versões novas.
- Uma responsabilidade por arquivo e por função; separar HTML, CSS e JS; variáveis CSS (`:root`) para cores, fontes e espaçamentos em vez de valores soltos repetidos.
- HTML semântico e acessível: tags certas (`header`, `nav`, `main`, `section`, `footer`, `button`), `alt` em toda imagem, `label` em todo campo, contraste suficiente e navegação por teclado.
- Desempenho: imagens otimizadas e com tamanho definido, `loading="lazy"` fora da primeira dobra, scripts com `defer`, nada de biblioteca pesada para algo simples.
- Segurança: nunca colocar chave, senha ou token no código; validar e tratar entradas de formulário; links externos com `rel="noopener"`.
- Sem erros no console do navegador e sem avisos ignorados no build.
- Mudanças pequenas e focadas: alterar só o que a tarefa pede, sem refatorar o que não foi pedido no mesmo commit.
- Documentar o que não é óbvio (README do modelo, comentário curto explicando o porquê, não o quê).

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
- **Mapa no footer**, sempre o componente padrão do OpenStreetMap igual aos que já existem (detalhes em "Componente de mapa no footer").
- **Botão de WhatsApp** fixo na tela (detalhes em "Botão de WhatsApp", abaixo).
- **CNPJ fictício no footer** (detalhes em "CNPJ fictício no footer", abaixo).
- **Página 404** própria, em todo site de qualquer categoria (detalhes em "Página 404", abaixo).

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
- **Obrigatório em todo template, Standard e Premium.** Nenhum modelo sai sem o mapa no footer, nem quando a empresa atende só online (nesse caso o mapa mostra a cidade-sede).
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

## Botão de WhatsApp
- **Obrigatório em todo template, Standard e Premium.**
- Botão fixo no **canto inferior direito**, visível em todas as páginas e em toda a rolagem. O canto inferior esquerdo é do aviso de cookies e do controle de aparelhos.
- Abre `https://wa.me/<número>` em nova aba, com uma mensagem pronta que diz de onde a pessoa veio (ex.: "Olá! Vim pelo site e quero agendar um horário.").
- Verde do WhatsApp (família `#1F8A4C` / `#25D366`) com texto branco, igual nos dois temas. No computador mostra o ícone e um texto curto ("WhatsApp", "Fale conosco"); no celular vira só o ícone, num quadrado ou círculo de 56px.
- Ícone do WhatsApp em SVG próprio dentro do build (nada de biblioteca de ícones nem emoji). `aria-label` dizendo o que faz ("Conversar no WhatsApp").
- Não pode cobrir conteúdo importante nem a pílula de tema. Se o site tiver uma janelinha de atendimento (como o chat do Peakalika), ela fica no mesmo canto e termina no WhatsApp.
- Exemplo pronto: `.whats-flutua` em [templates/saloes/_build-mecha-premium/style.css](templates/saloes/_build-mecha-premium/style.css).

## CNPJ fictício no footer
- **Obrigatório em todo template, Standard e Premium.** O footer mostra a razão social e o CNPJ da empresa de demonstração, junto do copyright ou dos dados legais.
- O CNPJ é **fictício**: no formato `00.000.000/0001-00`, guardado no `content.js` com o comentário `// [EXEMPLO] fictício`. Proibido usar o CNPJ de uma empresa real, inclusive o da empresa que serviu de referência.
- Use sempre `00.000.000/0001-00`: é o único número que com certeza não pertence a nenhuma empresa. Número inventado com cara de real pode coincidir com uma empresa que existe.
- Na cópia de cliente em `clientes/`, o CNPJ fictício é o primeiro dado trocado pelo real.

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

## Modelos Standard: padrão obrigatório
Todo pedido de template **Standard** começa por esta seção: primeiro se monta tudo o que está aqui, depois se acrescenta o que o pedido trouxer a mais. Nada daqui sai do modelo, mesmo que o pedido não mencione.

### Empresa fictícia
- Cada nicho tem uma empresa fictícia criada para ele (nome, logo, cores, endereço, equipe, CNPJ fictício). Já existindo uma marca no nicho, pode-se escolher ela.
- O Standard e o Premium do nicho são **da mesma empresa**, para o cliente comparar os dois níveis com a mesma marca.

### Nível do modelo
- Site mediano, o que antes era o Silver: completo e bem acabado, sem os efeitos pesados do Premium (sem 3D, sem cena guiada pela rolagem).

### Seções e funções obrigatórias
- **Animações leves** nos botões (hover, foco, clique) e nas transições entre seções e páginas. Com `prefers-reduced-motion: reduce`, tudo parado.
- **Carrossel de imagens** (com setas, arraste no celular e pausa ao passar o mouse).
- **Serviços em cards por segmento** (filtro ou abas por segmento do nicho), cada card com: o que inclui, duração, valor ou "a partir de".
- **Condições de pagamento** e **política de cancelamento e remarcação** junto dos serviços e preços.
- **Página da equipe** (foto, nome, função e especialidades de cada profissional).
- **Galeria por categoria** (filtro por categoria, foto ampliada ao clicar).
- **Depoimentos** de clientes.
- **Instagram incorporado** (grade de posts do perfil fictício da marca, com link para o perfil).
- **FAQ** em acordeão.
- **Formulário de agendamento** com escolha de **serviço**, **profissional** e **data** (e horário), que fecha o pedido no WhatsApp ou mostra a confirmação.
- **Formulário de contato** para captar leads e pedidos de atendimento.
- Os dois formulários têm **consentimento conforme a LGPD**: caixa de aceite não marcada, com link para a Política de privacidade, obrigatória para enviar.
- **Botão flutuante de WhatsApp** visível em todas as páginas (regras em "Botão de WhatsApp").
- **Política de agendamento, atraso, cancelamento e garantia dos serviços**, com destaque para os serviços sensíveis do nicho (em salão, coloração e químicas; em outros nichos, o equivalente, como clareamento no dentista).
- **Termos de uso** e **Política de privacidade** (janelas ou páginas, com link no rodapé e no consentimento).
- Mais os itens de todo template: tema claro e escuro, aviso de cookies, mapa no footer, CNPJ fictício e prévia nos aparelhos.

### Design
- Design próprio de cada cliente e de cada nicho: paleta, fontes e composição escolhidas para aquela marca, seguindo as proibições deste documento. Dois Standards de nichos diferentes não podem parecer o mesmo site com outra cor.

## Modelos Premium: padrão obrigatório
Todo pedido de template **Premium** começa por esta seção: primeiro se monta tudo o que está aqui, depois se acrescenta o que o pedido trouxer a mais. Cada item é feito de acordo com o cliente e o nicho, nunca o mesmo efeito copiado de um modelo para outro.

### Base: tudo do Standard
- O Premium tem **todas as seções e funções de "Modelos Standard: padrão obrigatório"** (carrossel, serviços por segmento com preço e duração, pagamento e cancelamento, equipe, galeria por categoria, depoimentos, Instagram, FAQ, agendamento com serviço/profissional/data, contato com LGPD, WhatsApp flutuante, políticas, termos e privacidade) e é da **mesma empresa fictícia** do Standard do nicho.
- Em cima dessa base, entra a camada Premium abaixo.

### Cinematográfico
- O modelo Premium é **cinematográfico**: conta a marca como um filme, com abertura, ritmo de cenas, enquadramentos grandes, luz e movimento pensados para aquele cliente. Não é o Standard com mais animação.

### Itens obrigatórios
- **Página de carregando estilizada**: tela de abertura com a identidade da marca (logo, objeto do nicho ou contador), que sai com uma transição para o primeiro quadro do site. Curta, e pulada com `prefers-reduced-motion`.
- **Cursor estilizado**: cursor próprio da marca (ponto e anel, forma ligada ao nicho), que muda sobre links, botões, fotos e áreas de arrastar, podendo mostrar uma palavra ("Ver", "Arrastar", "Agendar"). Só em aparelho com mouse (`pointer: fine`); no toque fica o padrão.
- **Transições sofisticadas e criativas** entre seções e estados (máscaras, cortinas, cortes, morph), nada de só aparecer e sumir.
- **Hover fluido e criativo nos botões** (preenchimento que escorre, texto que troca, borda que se desenha), diferente em cada marca.
- **Interação dos componentes com o mouse**: botões e elementos de destaque **magnéticos**, que se movem na direção do mouse quando ele chega perto e voltam com mola ao sair, igual ao Vyra Premium (`data-magnetic` em [templates/provedor-internet/_build/vyra-premium.js](templates/provedor-internet/_build/vyra-premium.js)). Cards e fotos podem inclinar ou ter brilho seguindo o mouse.
- **Modelo 3D do nicho** quando fizer sentido para o cliente (pote, cadeira, lata, fachada, objeto do serviço). Não é obrigatório em todos; decidir caso a caso e, quando entrar, ter versão leve no celular e imagem parada no lugar se o 3D não carregar.
- **Transição criativa entre páginas** quando o site tem mais de uma página: a página que sai e a que entra se ligam por uma animação (cortina, máscara, elemento que viaja de uma para a outra), sem tela branca no meio.
- **Cards criativos**: fugir da grade, do flex e da lista de sempre quando possível (pilha que se espalha, leque, cartas que viram, faixa horizontal guiada pela rolagem, colagem, órbita). Seguem valendo as regras de tamanho igual e de ocupar a largura no celular.
- **Rolagem com direção**, obrigatória (detalhes abaixo).
- Com `prefers-reduced-motion: reduce`, carregando, cursor, magnetismo, transições e 3D ficam parados ou simplificados, e o site continua completo.

### Animação de rolagem com direção (obrigatória)
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
Todo modelo novo do catálogo sai com os quatro itens abaixo. Não é opcional por faixa de preço.

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

### Página 404
- Todo site, de qualquer categoria e nível (Standard, Premium e cópias de cliente em `clientes/`), tem um `404.html` na raiz da pasta publicada. O Firebase Hosting serve esse arquivo sozinho quando o endereço não existe.
- A página é da marca, não a genérica: mesmas fontes, cores e logo do site, com um desenho ou ilustração ligado ao nicho (no Taioba, o zero é uma panelinha de barro com uma folha de taioba caindo dentro).
- Segue o tema claro ou escuro salvo pelo visitante (mesmo script no `<head>` antes de pintar) e funciona no celular, no tablet e no computador.
- Texto curto dizendo que a página não foi encontrada e botão para voltar ao início; pode ter atalhos para as páginas principais e o WhatsApp.
- Arquivo leve, com o CSS dentro, sem depender de nada que possa faltar. Links com caminho a partir da raiz (`/`), porque a 404 aparece em qualquer endereço.
- Gerada pelo `build.js` do modelo, junto das outras páginas.
- Exemplo pronto: [templates/restaurante/standard/taioba-standard/404.html](templates/restaurante/standard/taioba-standard/404.html), gerada em [templates/restaurante/_build-taioba-standard/build.js](templates/restaurante/_build-taioba-standard/build.js).

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
- Premium: todas as seções do Standard mais carregando estilizado, cursor próprio, botões magnéticos com hover criativo, transições entre seções e entre páginas, cards fora da grade comum e 3D quando couber; clima cinematográfico.
- Standard: todos os itens de "Modelos Standard: padrão obrigatório" presentes (carrossel, serviços por segmento com preço e duração, equipe, galeria por categoria, depoimentos, Instagram, FAQ, agendamento com serviço/profissional/data, contato com LGPD, políticas, termos e privacidade), e a mesma empresa do Premium do nicho.
- Nível só Standard ou Premium em pasta, arquivo, vitrine e texto; pasta em `standard/<marca>-standard[-<título>]/` ou `premium/<marca>-premium[-<título>]/` com fonte em `_build-<mesmo nome>/`.
- Cartão da vitrine com o selo do nível no topo e, se houver Área do Cliente, o selo "+ Área do Cliente" ao lado, sem repetir isso no texto de baixo.
- O nicho continua com pelo menos 4 templates.
- Botões, chips e etiquetas com fundo que aparecem em grupo têm todos a mesma largura e altura (a do item mais longo).
- No celular, grupos e grades ocupam 100% da largura útil, sem espaço vazio sobrando ao lado; cards e componentes proporcionais em 1440px, 768px, 390px e 360px.
- Botão de tema claro e escuro funcionando, com o tema salvo ao recarregar e as duas versões conferidas por inteiro.
- Aviso de cookies na primeira visita, os dois botões do mesmo tamanho, e "Preferências de cookies" no rodapé reabrindo.
- Mapa do OpenStreetMap no footer, botão de WhatsApp fixo no canto inferior direito (só ícone no celular) e CNPJ `00.000.000/0001-00` no footer.
- `404.html` da marca na raiz do site, nos dois temas, abrindo ao acessar um endereço que não existe.
- `instalar.js` rodado na vitrine: o controle de aparelhos aparece em todas as páginas do modelo e o "Ver nos aparelhos" ao lado do "Abrir".
