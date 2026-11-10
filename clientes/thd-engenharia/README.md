# THD Engenharia · novo site

Refatoração do site [thdengenharia.com](https://thdengenharia.com) (antes em WordPress/Elementor), mantendo cores, logo e conteúdo.

| Pasta | O que é |
|---|---|
| `_build/` | Gerador: `content.js` (textos), `style.js` (CSS), `script.js` (JS), `icons.js`, `img/` |
| `site/` | **Site pronto para subir na hospedagem** (é o que vai para o domínio) |
| `_preview/` | Cópia para abrir direto no navegador, sem servidor (não vai para o git) |

## Gerar

```bash
node clientes/thd-engenharia/_build/build.js            # gera site/
node clientes/thd-engenharia/_build/build.js --preview  # gera _preview/ (abra _preview/index.html)
```

Para trocar textos, edite `_build/content.js` e gere de novo. Itens marcados `[CONFIRMAR]` precisam de validação com o cliente.

## Identidade (tirada do site original)

- Laranja `#FE5710` · Azul `#1A3B87` · Azul do logo `#2B5AA8` · Marinho `#021430` · Verde WhatsApp `#23A455`
- Títulos em Archivo (larga, com cara de engenharia) e texto em Onest. Montserrat/Lato do site antigo saíram por estarem na lista proibida de DIRETRIZES-SITES.md
- Conceito visual (nível premium): "seu provedor montado peça por peça". Blocos geométricos nas cores da marca se montam em grade 3x3 e seguem trocando de lugar, ligados por trilhas de circuito como as letras do logo
- Interações: jornada presa na rolagem que monta a estrutura, diagnóstico interativo que gera a mensagem no WhatsApp, explorador de serviços em abas, painéis expansíveis, acordeão de serviços, cursor próprio, botões magnéticos e transição entre páginas

## Páginas e URLs (iguais às do site antigo)

`/` · `/quem-somos/` · `/servicos/` · `/contabilidade/` · `/contato/`

O `.htaccess` redireciona as URLs antigas do WordPress (`/home-bkp`, `/quem-somos-bkp`, `/author/...`), força HTTPS e configura o cache.

## Publicar no domínio

Envie **o conteúdo** de `site/` (incluindo o `.htaccess`, que é um arquivo oculto) para a raiz pública da hospedagem (`public_html/`).
Faça backup do WordPress antes de substituir.

## Formulário de contato

O site é estático. Ao enviar, o formulário monta a mensagem e abre no WhatsApp da THD (com nome, empresa, telefone, assunto e mensagem).
O Google Analytics (`G-DMZHV89B5P`, o mesmo do site antigo) registra os envios e os cliques no WhatsApp.

## Segundo modelo: "Órbita"

Mesmo conteúdo (lido de `_build/content.js`) e mesmas cores, design totalmente diferente, inspirado nos anéis orbitais do logo.

| Pasta | O que é |
|---|---|
| `_build-orbita/` | Gerador do modelo Órbita: `build.js`, `style.js`, `script.js` (usa `content.js`, `icons.js` e `img/` de `_build/`) |
| `site-orbita/` | Modelo Órbita pronto para subir na hospedagem |
| `_preview-orbita/` | Cópia para abrir direto no navegador (não vai para o git) |

```bash
node clientes/thd-engenharia/_build-orbita/build.js            # gera site-orbita/
node clientes/thd-engenharia/_build-orbita/build.js --preview  # gera _preview-orbita/ (abra _preview-orbita/index.html)
```

- Fontes: Unbounded (títulos) + Hanken Grotesk (texto), dupla diferente do primeiro modelo
- Fundo: céu de nós conectados em canvas (reage ao cursor) e órbitas girando atrás das seções
- Rolagem: cada seção sobe como uma lâmina de cantos arredondados que se abre; títulos sobem palavra por palavra em 3D
- 3D: giroscópio com planeta e anéis do logo (inclina com o mouse, gira com a rolagem), pilha de camadas dos serviços, barras isométricas da contabilidade, placas dos órgãos que giram, folha contábil que vira, fotos inclináveis com anel orbital
- Seções presas na rolagem: pilha de serviços (uma camada por frente), jornada em trilho horizontal, tambor 3D dos pilares e folha da gestão contábil
- Diagnóstico em baralho de cartas, com mapa em anel e envio pelo WhatsApp
- Transição entre páginas em círculo laranja a partir do clique, cursor em órbita e botão do WhatsApp com anel de leitura da página
