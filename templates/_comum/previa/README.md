# Prévia nos aparelhos

Mostra qualquer modelo de qualquer vitrine dentro de um **celular**, um **tablet** ou um **computador**, para o time comercial apresentar a responsividade sem abrir ferramentas de desenvolvedor nem redimensionar o navegador.

O site que aparece é o modelo de verdade, rodando num iframe com a largura e a altura do aparelho. Os breakpoints, o `vh` e os scripts do modelo se comportam como no aparelho. Trocar de aparelho só muda o tamanho do iframe: o site não recarrega, não perde a rolagem e não tem nada alterado.

## Como o vendedor usa

Na vitrine do nicho, cada modelo ganha o botão **Ver nos aparelhos** ao lado do "Abrir". Ele abre `previa/?m=<pasta>&d=celular`.

| Controle | O que faz | Tecla |
|---|---|---|
| Celular, Tablet, Computador | troca o aparelho com transição suave | 1, 2, 3 |
| Girar | celular ou tablet deitado | G |
| Recarregar | recarrega só o site | R |
| Nova aba | abre a página atual do site sozinha | |
| Tela cheia | esconde o resto do navegador para apresentar | F |
| Seletor de modelo | troca de modelo sem voltar para a vitrine | |

O endereço guarda o modelo e o aparelho (`?m=sorrisus&d=tablet&o=deitado`), então dá para mandar o link já no aparelho certo.

Medidas: celular 390 × 844, tablet 768 × 1024 (1024 × 768 deitado), computador 1440 de largura com a altura do palco (em monitor maior que 1440, usa a largura toda). Quando o aparelho não cabe na tela, ele é reduzido por inteiro (o zoom aparece na barra), sem mudar o layout que o site recebe.

## Dentro de cada site do catálogo

As cópias dos sites que ficam nas vitrines também recebem o adaptador (`adaptador.js`): um controle discreto, só com ícones, no canto inferior esquerdo com Celular, Tablet e Computador. Ele **fica sempre no mesmo lugar**: com o aparelho aberto o seletor não se mexe, só ganha à direita o botão de girar e a medida.

- **Celular** ou **Tablet** abre o próprio site por cima, na mesma página, dentro do aparelho e com a medida real. Trocar entre os dois não recarrega, e o botão de girar deita o aparelho.
- **Computador** ou a tecla Esc voltam ao site normal.
- O controle desvia sozinho de elementos fixos pequenos no mesmo canto: sobe acima do aviso de cookies enquanto ele está aberto e vai para o lado de uma barra lateral estreita.
- Fica isolado num shadow DOM, então o CSS do site não muda o controle e o controle não muda o site. Some em telas com menos de 620 px, onde a pessoa já está num celular.
- Os modelos originais em `templates/<nicho>/` **não** recebem o adaptador: ele entra só nas cópias das vitrines, então um site copiado para cliente nunca o leva junto.

## Cores de cada nicho

O controle dentro dos sites e a tela "Ver nos aparelhos" usam as cores da vitrine. Elas ficam em `TEMAS`, no `instalar.js`, com a chave no caminho da vitrine (`templates/clinicas/_vitrine`). O instalador grava as cores dentro da cópia do `adaptador.js` e gera `previa/tema.css`. Vitrine nova sem entrada em `TEMAS` usa o padrão grafite e dourado, e o instalador avisa.

## Arquivos

```
templates/_comum/previa/
  index.html, previa.css, previa.js   o visualizador
  vitrine.js                          coloca o botão "Ver nos aparelhos" na vitrine
  adaptador.js                        controle de aparelhos dentro de cada site da vitrine
  instalar.js                         instala tudo nas vitrines
```

Esta pasta é a única fonte. As cópias em `<vitrine>/previa/` são geradas: não edite lá.

## Instalar ou atualizar

```bash
node templates/_comum/previa/instalar.js            # todas as vitrines de templates/
node templates/_comum/previa/instalar.js --listar   # só mostra o que acharia
node templates/_comum/previa/instalar.js templates/clinicas/_vitrine
```

Rode **depois de montar ou atualizar uma vitrine e antes do `firebase deploy`**. O instalador:

- acha sozinho toda pasta de `templates/` com `firebase.json` e `index.html` (vitrine nova entra sem mudar código; vitrine de cliente em `clientes/` só entra quando o caminho é passado);
- trata como modelo cada subpasta com `index.html` (fora `img/`, `assets/`, `previa/` e pastas com `_` ou `.`);
- tira o nome do modelo do `aria-label="Abrir o modelo X"`, de um texto "Modelo X" no bloco, do botão "Abrir o X" ou, por último, do nome da pasta;
- copia o visualizador para `<vitrine>/previa/` e gera `previa/modelos.js`;
- coloca no fim do `index.html` da vitrine um bloco marcado (`<!-- previa-nos-aparelhos -->`);
- coloca o adaptador em toda página `.html` das pastas dos modelos (bloco `<!-- previa-adaptador -->`).
Rodar de novo troca os blocos, nunca duplica. Como as cópias dos modelos são substituídas a cada atualização de vitrine, rode o instalador sempre depois de copiar.

## Botão na vitrine

`vitrine.js` procura o "Abrir" de cada modelo (link com texto para `<pasta>/` ou `<pasta>/index.html`) e põe ao lado uma cópia contornada dele: herda fonte, altura, cantos e cor de cada vitrine sem CSS por nicho. Os dois ficam com a mesma largura e empilham quando não cabem lado a lado ou no celular. Se a vitrine já tem um grupo de botões (AURA), o novo vai numa linha embaixo, com a largura do grupo.

## Limites

- No celular e no tablet, a barra de rolagem do site some dentro da prévia, como no aparelho. Isso é feito só na exibição; o arquivo do modelo não muda.
- A prévia muda o tamanho da tela, não o tipo de ponteiro: efeitos só de mouse (cursor personalizado, hover) continuam aparecendo dentro do celular quando a apresentação é num computador.
- Precisa de servidor (Firebase ou `npx serve`). Aberto direto pelo `file://`, alguns navegadores bloqueiam o acesso ao iframe e a barra de endereço da janela mostra só o caminho.
