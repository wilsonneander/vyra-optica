# Bebidas & Conveniências: modelo Tampinha Standard Empório

Terceiro Standard do nicho **bebidas e conveniência**. Mesma loja fictícia (Tampinha Bebidas & Conveniência, Floresta, Belo Horizonte) e **todos os serviços do Tampinha Standard**, com outro desenho: um **empório de bairro**, com gôndola, etiqueta de preço amarela, placas de corredor e ofertas do dia. A referência de clima foi a home 6 do Liquory (loja de bebidas com cartazes, categorias com contagem, ofertas com contagem regressiva). Não é um catálogo gigante: são 38 bebidas, 12 aparecem de início.

| Pasta | O que é |
|---|---|
| `_build-tampinha-standard-emporio/content.js` | Todo o conteúdo: marca, entrega, horários, corredores, produtos e ofertas, kits, cartazes da capa, serviços por segmento, equipe, galeria, depoimentos, Instagram, políticas, FAQ e bairros. `[EXEMPLO]` = trocar pelo cliente |
| `_build-tampinha-standard-emporio/build.js` | Gera `index.html`, `equipe.html`, `galeria.html` e `404.html` e copia só as imagens usadas |
| `_build-tampinha-standard-emporio/style.css`, `app.js` | Desenho e comportamento (copiados para `assets/`) |
| `_build-tampinha-standard-emporio/icons.js` | Usa o logo e os ícones do Tampinha Standard e acrescenta os novos (estrela, aspas, calendário, aviso...) |
| `_build-tampinha-standard-emporio/preparar-imagens.js` | Baixa as fotos de pessoas, festas e loja do Pexels e grava `img/creditos.json` |
| `_build-tampinha-standard-emporio/gerar-mapa.js` | Mapa do OpenStreetMap na paleta verde-garrafa (`img/mapa_floresta_garrafa.webp`) |
| `standard/tampinha-standard-emporio/` | **Site pronto** |

**Imagens reaproveitadas** (sem cópia no repositório): recortes de produto e drinks de `_build-tampinha-standard-palco/img/fotos/`, fotos de ambiente (prefixo `ts:` no `content.js`) e logos de `_build-tampinha-standard/img/`. Se uma delas mudar de nome, o build avisa com erro.

## Gerar

```bash
node "templates/bebidas/_build-tampinha-standard-emporio/build.js"
```

Fotos novas ou mapa (precisam do `sharp` instalado fora do projeto):

```bash
NODE_PATH=<pasta com node_modules/sharp> node "templates/bebidas/_build-tampinha-standard-emporio/preparar-imagens.js"
NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js garrafa img/mapa_floresta_garrafa.webp   # dentro de _build-tampinha-standard-emporio/
```

## O que veio do Tampinha Standard

Confirmação de 18 anos (esconde e tira do carrinho o que tem álcool), barra de entrega grátis e "Aberto agora" pelo horário, atendente Toninho no WhatsApp, selos (entrega, iFood e 99Food, site 100% seguro, atendimento), esteira de marcas que filtra a gôndola, categorias, carrossel de mais pedidos (aqui, as ofertas do dia), catálogo com corredores, busca e "Ver mais", foto que voa até o carrinho, kits prontos, quem somos com números, como pedir em três passos, entrega com horário do dia em destaque e apps, FAQ, mapa no rodapé com bairros, aviso "Beba com moderação", créditos das imagens e o carrinho completo (frete grátis, Leve também, entrega ou retirada, Pix, cartão ou dinheiro com troco, observação) que fecha o pedido no WhatsApp.

## O que é novo neste modelo

- **Desenho de empório**: verde-garrafa `#17533F`, papel `#F3EFE4`, etiqueta amarela `#F5C518`; o vermelho da tampinha só nas ofertas. Títulos e preços em **Barlow Condensed**, texto em **Rethink Sans** (dupla nova no catálogo)
- **Busca no topo** em todas as páginas (nas outras páginas leva à gôndola já filtrada)
- **Capa em cartazes**: carrossel com setas, arraste, barras de tempo e pausa no mouse, etiqueta pendurada, mais o banner das ofertas com contagem até a meia-noite e o cartão do Toninho
- **Placas de corredor** penduradas sobre uma gôndola com três produtos, que balançam no hover
- **Cartão de produto em gôndola**: prateleira embaixo da foto, etiqueta de preço com furo, bandeirola vermelha de desconto e marca +18
- **Kits como cupom fiscal** com borda serrilhada
- **Serviços por segmento** (Festas e eventos, Entrega e retirada, Empresas e degustação): chopp na festa, open bar, bar sem álcool, entrega com hora marcada, retirada no balcão, geladeira da empresa e degustação, com o que inclui, duração, pessoas, quem atende e preço; pagamento, "a partir de" e cancelamento logo abaixo
- **Agendamento** com serviço, quem atende, data (antecedência por serviço) e horário, resumo com estimativa e sinal, e envio pelo WhatsApp
- **Equipe** (página própria com escala da semana e "Agendar com..."), **galeria** por categoria com foto ampliada, **depoimentos**, **Instagram**, **políticas** com destaque para bebida alcoólica, chopeira e open bar, **contato** com LGPD, **termos**, **privacidade**, **cookies**, **CNPJ fictício** e **404** (a tampinha rola no lugar do zero)

## Tema claro e escuro

Abre no **claro**; o escuro é a adega à noite em verde-garrafa. Pílula com a tampinha que rola (`templates/_comum/tema-tampinha.js`), chave `tampinha-emporio-tema`.

## Chaves no navegador

`tampinha-emporio-idade`, `-carrinho`, `-cookies`, `-tema`, `-agendamentos`, `-contatos`.

## Para virar site de cliente

Copiar para `clientes/<cliente>/`. Trocar `content.js` (marca, WhatsApp, endereço, CNPJ, preços, serviços, equipe), as fotos da equipe pelas reais, gerar o mapa do endereço, ajustar iFood e 99Food e tirar o `noindex` do `build.js`.
