# Sites Vyra

Três modelos de site com as mesmas 6 páginas (Início, Sobre nós, Serviços, FAQ, Contato, Assine já):

| Pasta | Modelo | Destaques |
|---|---|---|
| `basico/` | Básico | Simples, objetivo, formulários, redes sociais, sem animação |
| `intermediario/` | Intermediário | Hover com elevação, entrada ao rolar, contadores, abas, acordeão |
| `premium/` | Premium | Cursor próprio, rede de fibra animada, transições entre páginas, botões magnéticos, simulador, assinatura em etapas |

Abra `index.html` de qualquer pasta no navegador. Não precisa de servidor.

## Trocar textos, preços e contatos

Todo o conteúdo fica em **`_build/content.js`**. Itens marcados com `[EXEMPLO]` são provisórios.
Depois de editar, gere os sites de novo:

```bash
node sites/_build/build.js
```

O design de cada modelo está em `_build/basico.js`, `_build/intermediario.js` e `_build/premium.js`.

## Formulários

Os formulários validam os campos e mostram a confirmação, mas ainda não enviam dados.
Para ligar a um backend, e-mail ou WhatsApp, procure o comentário "Integre aqui" em `assets/main.js`
(ou no módulo do modelo em `_build/`).
