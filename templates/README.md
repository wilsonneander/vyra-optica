# Catálogo de templates

Todos os sites ficam aqui. Antes de criar ou editar qualquer um, leia [DIRETRIZES-SITES.md](../DIRETRIZES-SITES.md).

| Pasta | Nicho | Modelos | Gerar |
|---|---|---|---|
| [vyra-provedor/](vyra-provedor/) | Provedor de internet (Vyra) | Básico, Intermediário, Premium | `node templates/vyra-provedor/_build/build.js` |
| [thd-engenharia/](thd-engenharia/) | Provedor / assessoria (cliente THD) | site, site-orbita, site-fibra | `node templates/thd-engenharia/_build/build.js` (e `_build-orbita`, `_build-fibra`) |
| [siri-na-lata/](siri-na-lata/) | Restaurante (cliente Siri na Lata) | Bronze, Silver, Gold | `node templates/siri-na-lata/_build-bronze/build.js` / `_build-gold/build.js` |
| [pizzaria/](pizzaria/) | Pizzaria (Fornalha, fictícia) | Gold | `node templates/pizzaria/_build/build.js` |

Pastas auxiliares (começam com `_`, não são templates):

- `vyra-provedor/_apresentacao/`, `siri-na-lata/_modelos/`, `_vitrine-food/`: vitrines publicadas no Firebase para mostrar os modelos.
- `_build*/`: código-fonte e conteúdo de cada template. Edite ali e rode o build; as pastas `site*/` e `basico|intermediario|premium/` são geradas.
