# Catálogo de templates

Todos os modelos de site ficam aqui, separados por nicho. Antes de criar ou editar qualquer um, leia [DIRETRIZES-SITES.md](../DIRETRIZES-SITES.md).

Quando um cliente fecha um modelo, ele é copiado para [../clientes/](../clientes/) e ajustado lá. Os modelos deste catálogo não mudam por causa de um cliente.

## Como cada nicho é organizado

```
templates/<nicho>/
  bronze/          site pronto do modelo Bronze (abre pelo index.html)
  silver/          site pronto do modelo Silver
  gold/            site pronto do modelo Gold (com subpastas quando o nicho tem mais de um Gold)
  _build-bronze/   código-fonte e conteúdo do Bronze (idem _build-silver/, _build-gold/)
  _build/          peças comuns aos modelos do nicho, quando existem
  README*.md       guia do nicho e de cada modelo
```

As pastas `bronze/`, `silver/` e `gold/` são geradas: edite o `_build*` e rode o build.

## Nichos

| Pasta | Nicho (marca de demonstração) | Bronze | Silver | Gold | Gerar |
|---|---|---|---|---|---|
| [provedor-internet/](provedor-internet/) | Provedor de internet (Vyra) | sim | sim | sim, com Área do cliente | `node templates/provedor-internet/_build/build.js` (gera os três) |
| [assessoria-provedor/](assessoria-provedor/) | Assessoria para provedores (THD Engenharia) | | | `gold/blocos`, `gold/orbita`, `gold/fibra` | `node templates/assessoria-provedor/_build/build.js` (e `_build-orbita`, `_build-fibra`) |
| [restaurante/](restaurante/) | Restaurante (Siri na Lata) | sim | sim | sim | `node templates/restaurante/_build-<tier>/build.js` |
| [lanches/](lanches/) | Hamburgueria, pizzaria e fast food | | Braseiro | `gold/fornalha` (pizzaria), `gold/monta` (Monta Burger) | `node templates/lanches/_build-fornalha/build.js` / `_build-monta/build.js` (o Braseiro não tem gerador) |
| [autosservicos/](autosservicos/) | Centro automotivo (Pistão Auto Center) | sim | sim | sim, com loja e painel | `node templates/autosservicos/_build-<tier>/build.js` |
| [lava-car/](lava-car/) | Lava car (Garoa) | | sim | | `node templates/lava-car/_build-silver/build.js` |
| [bebidas/](bebidas/) | Distribuidora de bebidas (Tampinha) | sim | sim | sim | `node templates/bebidas/_build-<tier>/build.js` |
| | Bebidas, marca própria (N3 Drinks) | | | `plus/` (modelo Plus, sem gerador) | |
| [marcas-proprias/](marcas-proprias/) | Marca própria de produto (AURA Fresh) | | | `gold/`: cinco modelos (produto, guia, clube, nascente, mare) | `node templates/marcas-proprias/gold/_build/build.js` |
| [turismo/](turismo/) | Agência de turismo (Peakalika) | | | sim | `node templates/turismo/_build-gold/build.js` |
| [estetica/](estetica/) | Clínica de estética (Camélia) | sim | sim, landing page animada | sim, visita de drone em 3D pela clínica; Gold Íris (`gold-iris/`): depilação, cílios e sobrancelhas com provador do olhar, agenda por profissional, clube e loja | `node templates/estetica/_build-<tier>/build.js` |
| [Salões de Beleza/](Sal%C3%B5es%20de%20Beleza/) | Salão de beleza com barbearia (Mecha) | | | sim: salão e barbearia no mesmo endereço, segmentos que ligam e desligam, agenda por profissional; Gold Pente Fino (`gold-pente/`): barbearia escura com cadeira 3D sob o foco e agendamento em quatro passos | `node "templates/Salões de Beleza/_build-gold/build.js"`; o Pente Fino é Vite: `npm install` e `npm run catalogo` em `_build-gold-pente/` |
| [barbearia/](barbearia/) | Barbearia (Mecha Barbearia) | sim: landing page escura e areia no desenho da referência Salona, lista de serviços com preço e tempo, agenda por barbeiro com Google Agenda e .ics | | | `node templates/barbearia/_build-bronze/build.js` |

Quando um nicho ganhar um modelo novo, ele entra na pasta do tier (`bronze/`, `silver/` ou `gold/`) com o código em `_build-<tier>/`.

## Pastas auxiliares (começam com `_`)

- `_comum/`: código usado por vários nichos (botões de tema `tema-pilula.js`, `tema-tampinha.js`, `tema-lanches.js`).
- `_vitrine-auto/`, `_vitrine-bebidas/`, `_vitrine-food/`, `_vitrine-aura/`, `provedor-internet/_apresentacao/`, `restaurante/_modelos/`: vitrines publicadas no Firebase para mostrar os modelos. Ficam fora do git.
- `_preview*/`: prévias que abrem sem servidor (fora do git).
