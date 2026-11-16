# Bebidas & Conveniências: modelo Bronze "Tampinha"

Nicho **distribuidora de bebidas, adega e conveniência**. Landing page de uma página só, com empresa fictícia (Tampinha Bebidas & Conveniência, Floresta, Belo Horizonte). O cliente monta o carrinho no site e o pedido sai pronto no WhatsApp.
Referência de conteúdo: bebidastissot.com.br (categorias, marcas, faixa de avisos, "Comprar pelo Whats", modal +18). Sem referência de design. Estilo pedido: real e humano, com fotos e logos das marcas.

| Pasta | O que é |
|---|---|
| `_build/content.js` | Todo o conteúdo: marca, atendente, contatos, entrega, horários, categorias, produtos com preço e foto, kits, logos, números, FAQ e bairros. `[EXEMPLO]` = trocar por cliente |
| `_build/img/fotos/` | Fotos em WebP: produtos (quadradas 640px) e fotos de pessoas e ambiente |
| `_build/img/logos/` | Logos oficiais das marcas (Wikimedia Commons) |
| `_build/img/creditos.json` | Origem, autor e licença de cada imagem; vira a lista "Créditos das imagens" do rodapé |
| `_build/icons.js` | Logo da Tampinha (tampinha coroa com "t"), favicon e ícones próprios |
| `_build/style.css`, `_build/app.js` | Design e interação |
| `_build/build.js` | Gera `site-bronze/index.html` com CSS e JS embutidos (padrão Bronze) |
| `_build/gerar-mapa.js` | Mapa estático do OpenStreetMap na paleta café |
| `site-bronze/` | **Site pronto** (abrir o `index.html` no navegador) |

## Gerar

```bash
node "templates/Bebidas & Conveniências/_build/build.js"
```

O mapa só precisa ser gerado de novo se o endereço mudar (precisa do `sharp` instalado fora do projeto):

```bash
NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js cafe img/mapa_floresta.webp   # rodar dentro de _build/
```

## Imagens e licenças

- **Fotos**: Unsplash (licença Unsplash, uso livre) e Wikimedia Commons (CC BY / CC BY-SA, com crédito no rodapé). Produtos com foto: Heineken, Corona, Budweiser, Stella, Brahma (engradado), Coca-Cola, Guaraná Antarctica, Fanta, Sprite, Schweppes, Red Bull, Monster, Smirnoff, Absolut, Red Label, Tanqueray, José Cuervo, Aperol, Campari, Matte Leão, Del Valle, água, coco e gelo
- **Skol e Ades** não têm foto de produto com licença livre: o card mostra o logo oficial na cor da marca com "Foto ilustrativa"
- **Sol** ficou fora: não há foto nem logo com licença livre
- **Logos**: Wikimedia Commons (domínio público ou CC), usados só para identificar o que a loja vende
- **Para cliente real**: pedir os packshots (fotos oficiais dos produtos) ao distribuidor ou fabricante e trocar em `img/fotos/`, mantendo o nome do arquivo

## Como é

- **Confirmação de idade (+18)** com foto de amigos brindando. "Ainda não tenho" esconde cervejas, destilados, drinks e kits com álcool, e tira itens alcoólicos do carrinho. Dá para rever no rodapé
- **Topo**: barra café com entrega grátis e status "Aberto agora, entregas até 23h" (calculado pelo horário). Nav com Categorias, Bebidas, Kits, Quem somos, Entrega, WhatsApp e o carrinho com contador e total
- **Capa**: foto grande de amigos brindando com zoom lento ao abrir, título "A cerveja gelada chega antes da turma.", botões, selos (site 100% seguro, logo do iFood e 99Food, entrega em 30 a 45 min) e o cartão do atendente ("Toninho, do balcão") com foto e o status do WhatsApp
- **Marcas**: esteira com os logos oficiais em cinza que ganham cor no hover; o toque filtra o catálogo pela marca
- **Promessas**: entrega, iFood e 99Food, site seguro, atendimento no WhatsApp
- **Categorias**: mosaico de fotos (Cervejas em destaque), com zoom e cor no hover
- **Os que mais saem do freezer**: carrossel com setas e barra de progresso
- **Catálogo**: chips com largura igual, busca, 32 produtos intercalados; no "Tudo" mostra 10 e "Ver as outras". Card com foto, marca, nome, volume, preço e botão "Adicionar" que vira seletor de quantidade. A foto do produto voa até o carrinho
- **Kits prontos** em fotos (churrasco, esquenta, gin tônica); um toque põe tudo no carrinho
- **Quem somos**: duas fotos sobrepostas (geladeira e entrega no balcão), história da adega e números
- **Como pedir**: foto do celular e os três passos ligados por uma linha, mais o bloco "Site 100% seguro"
- **Entrega**: texto, tabela de horário com o dia de hoje em destaque, foto do entregador e cartão com iFood (logo) e 99Food
- **Dúvidas** em sanfona, **rodapé** com mapa padrão `.map-box` do OpenStreetMap, bairros, aviso "Beba com moderação" e créditos das imagens
- **Carrinho**: gaveta com miniaturas, quantidades, barra de "faltam R$ X para a entrega grátis", "Leve também" (gelo, água, Coca), entrega ou retirada, pagamento, troco e observação. "Enviar pedido no WhatsApp" abre a conversa com o pedido formatado. No celular aparece a barra fixa "N itens, total, Ver pedido"

## Identidade

- Nome fictício **Tampinha** (a tampinha de garrafa é o logo)
- Cores: branco quente `#FFFDF9`, papel `#F6F0E8`, café `#2A1A12`, breu `#1A100B`, vermelho `#D7261E`
- Fontes: **Bricolage Grotesque** (títulos) + **Epilogue** (texto). Dupla ainda não usada em outro projeto

## Para virar site de cliente

Copiar para `clientes/<cliente>/` (nunca editar aqui). Trocar `content.js` (marca, atendente, WhatsApp, endereço, taxa, horários, produtos e preços), as fotos de produto pelos packshots do cliente, a foto do atendente por uma da equipe real, o logo em `icons.js`, gerar o mapa do endereço real, ajustar os links do iFood e do 99Food e tirar o `noindex` do `build.js`.
