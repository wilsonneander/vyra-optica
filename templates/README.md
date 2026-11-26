# Catálogo de templates

Todos os modelos de site ficam aqui, separados por nicho. Antes de criar ou editar qualquer um, leia [DIRETRIZES-SITES.md](../DIRETRIZES-SITES.md), principalmente a parte "Padrão do catálogo de templates".

Quando um cliente fecha um modelo, ele é copiado para [../clientes/](../clientes/) e ajustado lá. Os modelos deste catálogo não mudam por causa de um cliente.

## Níveis

Só existem dois: **Standard** (os antigos Bronze e Silver) e **Premium** (os antigos Gold, Plus e premium). Nenhum outro nome de nível aparece em pasta, arquivo, vitrine ou texto.

## Como cada nicho é organizado

```
templates/<nicho>/
  standard/<marca>-standard[-<título>]/   site pronto de cada modelo Standard (abre pelo index.html)
  premium/<marca>-premium[-<título>]/     site pronto de cada modelo Premium
  _build-<pasta do modelo>/               código-fonte e conteúdo do modelo (gera a pasta acima)
  _build/                                 peças comuns aos modelos do nicho, quando existem
  _vitrine/                               vitrine do Firebase, uma subpasta por modelo com o mesmo nome (fora do git)
  README*.md                              guia do nicho e de cada modelo
```

O nome segue a ordem **marca, nível, título**: `vyra-standard`, `vyra-standard-planos`, `vyra-premium`. O primeiro modelo de uma marca num nível fica só com marca e nível; os seguintes ganham um título curto. As pastas `standard/` e `premium/` são geradas: edite o `_build-<pasta do modelo>/` e rode o build.

## Nichos e modelos

| Nicho | Standard | Premium | Gerar |
|---|---|---|---|
| [provedor-internet/](provedor-internet/) | `vyra-standard`, `vyra-standard-planos`, `vyra-standard-roxo` | `vyra-premium` (+ Área do Cliente) | `node templates/provedor-internet/_build/build.js` (gera os três primeiros), `node templates/provedor-internet/_build-vyra-standard-roxo/build.js` |
| [assessoria-provedor/](assessoria-provedor/) | | `thd-premium-blocos`, `thd-premium-orbita`, `thd-premium-fibra` (+ Área do Cliente) | `node templates/assessoria-provedor/_build/build.js` (blocos), `_build-orbita/`, `_build-fibra/` |
| [restaurante/](restaurante/) | `siri-standard`, `siri-standard-postal`, `taioba-standard` (+ Área do Cliente) | `siri-premium` | `node templates/restaurante/_build-<pasta do modelo>/build.js` (comum do Siri em `_build/`; o Taioba é independente) |
| [lanches/](lanches/) | `braseiro-standard`, `amassa-standard` | `fornalha-premium`, `monta-premium` (+ Área do Cliente) | `node templates/lanches/_build-fornalha-premium/build.js` / `_build-monta-premium/build.js` / `_build-amassa-standard/build.js` (o Braseiro não tem gerador; `_build-braseiro-standard/` só prepara imagens, vídeos e mapa) |
| [autosservicos/](autosservicos/) | `pistao-standard`, `pistao-standard-oficina` | `pistao-premium` (+ Área do Cliente) | `node templates/autosservicos/_build-<pasta do modelo>/build.js` |
| [lava-car/](lava-car/) | `garoa-standard` | | `node templates/lava-car/_build-garoa-standard/build.js` |
| [bebidas/](bebidas/) | `tampinha-standard`, `tampinha-standard-palco` | `tampinha-premium` (+ Área do Cliente), `n3-premium` | `node templates/bebidas/_build-<pasta do modelo>/build.js`; o N3 não tem gerador (`node templates/bebidas/premium/n3-premium/tema-n3.js` aplica o tema) |
| [marcas-proprias/](marcas-proprias/) | | `aura-premium-produto`, `aura-premium-guia`, `aura-premium-clube` (+ Área do Cliente), `aura-premium-nascente`, `aura-premium-mare` | `node templates/marcas-proprias/premium/_build/build.js` (gera os cinco; o gerador e o `_kit/` ficam dentro de `premium/`) |
| [turismo/](turismo/) | | `peakalika-premium` | `node templates/turismo/_build-peakalika-premium/build.js` |
| [estetica/](estetica/) | `camelia-standard`, `camelia-standard-corporal` | `camelia-premium` (visita de drone em 3D), `iris-premium` | `node templates/estetica/_build-<pasta do modelo>/build.js` |
| [saloes/](saloes/) | `mecha-standard`, `mecha-standard-terracota` (+ Área do Cliente) | `mecha-premium` | `node "templates/saloes/_build-<pasta do modelo>/build.js"` |
| [barbearia/](barbearia/) | `mecha-standard`, `cobre-standard` | `pente-fino-premium` (+ Área do Cliente), `cobre-premium` | `node templates/barbearia/_build-<pasta do modelo>/build.js`; o Pente Fino é Vite: `npm install` e `npm run catalogo` em `_build-pente-fino-premium/` |
| [dentista/](dentista/) | `lume-standard`, `raiz-standard` | `sorrisus-premium` | `node templates/dentista/_build-<pasta do modelo>/build.js` |

## O que falta para o padrão (situação em 2026-11-25)

O padrão obrigatório está em [DIRETRIZES-SITES.md](../DIRETRIZES-SITES.md): no mínimo 4 templates por categoria, tema claro e escuro e visualização por aparelho em todos.

**Mínimo de 4 templates por categoria.** Só provedor de internet (4), restaurante (4), lanches (4), bebidas (4), estética (4), barbearia (4) e marcas próprias (5) cumprem. Faltam:

| Nicho | Tem | Faltam |
|---|---|---|
| provedor-internet | 3 | 1 |
| assessoria-provedor | 3 | 1 |
| autosservicos | 3 | 1 |
| lava-car | 1 | 3 |
| turismo | 1 | 3 |
| saloes | 3 | 1 |
| dentista | 3 | 1 |

**Tema claro e escuro.** Todos os modelos têm os dois temas desde 2026-11-25.

**Aviso de cookies.** O `turismo/premium/peakalika-premium` ainda não tem.

**Visualização por aparelho.** Fora de vitrine (sem a Prévia nos aparelhos): `turismo/premium/peakalika-premium` e `aura-premium-produto` e `aura-premium-guia`.

## Pastas auxiliares (começam com `_`)

- `_comum/`: código usado por vários nichos (botões de tema `tema-pilula.js`, `tema-tampinha.js`, `tema-lanches.js`).
- `_comum/previa/`: **Prévia nos aparelhos**, o visualizador comum que mostra qualquer modelo no celular, no tablet e no computador. Depois de montar ou atualizar uma vitrine, e antes do deploy, rode `node templates/_comum/previa/instalar.js` (veja o [README](_comum/previa/README.md)).
- `_vitrine-auto/`, `_vitrine-bebidas/`, `_vitrine-food/`, `_vitrine-aura/`, `_vitrine-estetica/`, `<nicho>/_vitrine/`, `provedor-internet/_apresentacao/`, `assessoria-provedor/_apresentacao/`, `restaurante/_modelos/`: vitrines publicadas no Firebase para mostrar os modelos. Ficam fora do git. Cada modelo fica numa subpasta com o mesmo nome da pasta do catálogo, e o `firebase.json` redireciona os endereços antigos (`/bronze/`, `/silver/`, `/gold/`, `/lume/`...) para os novos. Cada uma recebe a pasta `previa/` e o botão "Ver nos aparelhos" pelo instalador.
- `_preview*/`: prévias que abrem sem servidor (fora do git).
