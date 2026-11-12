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

## Terceiro modelo: "Fibra"

Mesmo conteúdo (lido de `_build/content.js`) e mesmas cores, design totalmente diferente dos dois primeiros, inspirado na luz que corre pela fibra óptica.

| Pasta | O que é |
|---|---|
| `_build-fibra/` | Gerador do modelo Fibra: `build.js`, `style.js`, `script.js` (usa `content.js`, `icons.js` e `img/` de `_build/`) |
| `site-fibra/` | Modelo Fibra pronto para subir na hospedagem |
| `_preview-fibra/` | Cópia para abrir direto no navegador (não vai para o git) |

```bash
node clientes/thd-engenharia/_build-fibra/build.js            # gera site-fibra/
node clientes/thd-engenharia/_build-fibra/build.js --preview  # gera _preview-fibra/ (abra _preview-fibra/index.html)
```

- Fontes: Big Shoulders Display (títulos condensados em caixa-alta) + Schibsted Grotesk (texto), dupla diferente dos outros modelos
- Base clara e editorial, com seções marinho e laranja; menu em trilho vertical à esquerda (no celular vira barra no topo)
- Fundo: fios de luz em canvas que ondulam, desviam do cursor e levam pulsos laranja e azul-céu
- Títulos revelados por um bloco laranja que atravessa o texto; textos de apoio que se decodificam; fotos que abrem em venezianas
- Seções presas na rolagem: prisma 3D de quatro faces com os serviços e palavras gigantes dos pilares que se acendem
- Jornada em trilha de fibra que se desenha com a rolagem e acende cada etapa; diagnóstico com chaves de três posições e rack 3D onde os módulos entram ou saltam para fora
- Órgãos reguladores em linhas com o logo seguindo o cursor, foto em íris, missão digitada letra por letra, cabos das disciplinas, extrato que sai da impressora e comparador arrastável na gestão contábil
- Transição entre páginas em venezianas, cursor com rastro de luz e nome da THD no rodapé iluminado pelo cursor

### Área do Cliente (só no modelo Fibra)

Página `/area-do-cliente/`, com acesso pelo trilho do menu (cadeado), pelo botão no topo e pela barra do celular. É demonstrativa: o login aceita qualquer CPF e senha e guarda a sessão só na aba (sessionStorage).

- Plano contratado (nome, velocidade e valor), detalhamento (benefícios, vencimento, fidelidade e condições), botão do teste de velocidade e botões de agendamento e atendimento que abrem o WhatsApp com mensagem pronta
- Dados do assinante de exemplo, link do teste de velocidade e opções de agendamento ficam no topo da função `areaCliente()` em `_build-fibra/build.js`
- A página tem `noindex` e fica fora do `sitemap.xml`
