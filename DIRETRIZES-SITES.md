# Diretrizes obrigatórias para criar sites

Leia este documento inteiro antes de criar ou alterar qualquer site deste projeto.
Estas regras valem para todos os modelos (básico, intermediário, premium) e para sites de clientes.
O objetivo é que nenhum site tenha cara de "feito por IA": nada de componentes, ícones ou fontes que o Claude usa por padrão.

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

## Outros vícios de IA a evitar
- Gradiente roxo/azul com brilho ("glow") atrás do título.
- Título com uma palavra em gradiente colorido.
- Todos os cards com o mesmo `border-radius` grande e a mesma borda de 1px translúcida.
- Seção "problemas" em grade de 6 cards iguais seguida de seção "solução" em grade de 6 cards iguais.
- Frases de efeito em três partes ("Rápido. Simples. Seguro.").

## Checklist antes de entregar
Rodar na pasta do site e confirmar que nada aparece (fora de comentários ou nomes de arquivo):

```bash
grep -rnE "—|–|·|•" sites/ --include=*.html
grep -rnE "lucide|heroicons|feather|tabler|phosphor|font-awesome|material-icons|material-symbols|bootstrap-icons|ionicons" sites/
grep -rnE "Inter|Manrope|Outfit|Plus Jakarta|DM Sans|Space Grotesk|Satoshi|General Sans|Poppins|Montserrat|Roboto|Open Sans|Geist" sites/ --include=*.css --include=*.html
grep -rnE "999px|9999px|rounded-full" sites/ --include=*.css --include=*.html
grep -rnE ">\s*0[1-9]\s*<|>\s*/0[1-9]" sites/ --include=*.html
grep -rnE "::?(before|after)" sites/ --include=*.css   # conferir se algum desenha traço antes/depois de título
```

E conferir visualmente:
- Nenhum selo em cápsula com bolinha acima de título.
- Nenhum traço ou linha decorativa antes ou depois de títulos e textos de apoio.
- Nenhuma grade de cards com ícone em quadradinho.
- Nenhum número marcando tópico.
