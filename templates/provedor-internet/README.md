# Sites Vyra

Quatro modelos de site da Vyra, com a mesma navegação (Início, Sobre nós, Residencial, Empresas, FAQ, Contato e Assine já):

| Pasta | Modelo | Destaques |
|---|---|---|
| `standard/vyra-standard/` | Vyra Standard | Simples, objetivo, formulários, redes sociais, sem animação |
| `standard/vyra-standard-planos/` | Vyra Standard Planos | Hover com elevação, entrada ao rolar, contadores, abas, acordeão |
| `standard/vyra-standard-roxo/` | Vyra Standard Roxo | Roxo e magenta, carrossel, serviços por segmento com prazo e preço, página da equipe, galeria por categoria, Instagram, agendamento com técnico, data e horário, políticas, cookies e tema claro/escuro |
| `premium/vyra-premium/` | Vyra Premium | Cursor próprio, rede de fibra animada, transições entre páginas, botões magnéticos, simulador, assinatura em etapas |

Abra `index.html` de qualquer pasta no navegador. Não precisa de servidor.

## Trocar textos, preços e contatos

Todo o conteúdo fica em **`_build/content.js`**. Itens marcados com `[EXEMPLO]` são provisórios.
Depois de editar, gere os sites de novo:

```bash
node templates/provedor-internet/_build/build.js
```

O design de cada modelo está em `_build/vyra-standard.js`, `_build/vyra-standard-planos.js` e `_build/vyra-premium.js`.

## Formulários

Os formulários validam os campos e mostram a confirmação, mas ainda não enviam dados.
Para ligar a um backend, e-mail ou WhatsApp, procure o comentário "Integre aqui" em `assets/main.js`
(ou no módulo do modelo em `_build/`).

## Vyra Standard Roxo

Fonte própria em `_build-vyra-standard-roxo/` (`content.js`, `style.css`, `app.js`, `build.js`). Planos, FAQ e avaliações vêm do `_build/content.js` comum.
Fotos novas em `_build-vyra-standard-roxo/img/` (créditos no CREDITOS.md da pasta); as demais vêm de `_build/img/`, e o build copia só as usadas.

```bash
node templates/provedor-internet/_build-vyra-standard-roxo/build.js
```
