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
- Títulos em Montserrat, texto em Lato

## Páginas e URLs (iguais às do site antigo)

`/` · `/quem-somos/` · `/servicos/` · `/contabilidade/` · `/contato/`

O `.htaccess` redireciona as URLs antigas do WordPress (`/home-bkp`, `/quem-somos-bkp`, `/author/...`), força HTTPS e configura o cache.

## Publicar no domínio

Envie **o conteúdo** de `site/` (incluindo o `.htaccess`, que é um arquivo oculto) para a raiz pública da hospedagem (`public_html/`).
Faça backup do WordPress antes de substituir.

## Formulário de contato

O site é estático. Ao enviar, o formulário monta a mensagem e abre no WhatsApp da THD (com nome, empresa, telefone, assunto e mensagem).
O Google Analytics (`G-DMZHV89B5P`, o mesmo do site antigo) registra os envios e os cliques no WhatsApp.
