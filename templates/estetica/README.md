# Estética: modelos Bronze, Silver e Gold "Camélia"

Nicho **clínica de estética** (facial, corporal e depilação, cílios e sobrancelhas no Bronze e no Gold; o Silver é só estética corporal). O Gold tem dois modelos: `gold/` (visita de drone em 3D) e `gold-iris/` (só depilação, cílios e sobrancelhas). Bronze, Silver e o primeiro Gold são landing pages de uma página só, com marca fictícia: Camélia Estética, Cambuí, Campinas. Público majoritariamente feminino.
Referência de conteúdo: jessicaboza.com.br (avaliação antes do protocolo, ficha técnica do tratamento, tom acolhedor e sem promessa, FAQ). Nada foi copiado: textos, nomes, números e preços são próprios e fictícios.

| Pasta | O que é |
|---|---|
| `_build-bronze/content.js` | Todo o conteúdo: marca, responsável técnica, horários, segmentos e tratamentos com preço, pagamento, garantia, etapas, contraindicações, políticas, segurança, FAQ e bairros. `[EXEMPLO]` = trocar pelo cliente, `[JURÍDICO]` = passar pela revisão jurídica |
| `_build-bronze/icons.js` | Logo da camélia, favicon e ícones próprios (sem biblioteca) |
| `_build-bronze/style.css`, `_build-bronze/app.js` | Design e interação |
| `_build-bronze/build.js` | Gera `bronze/index.html` com CSS e JS embutidos (padrão Bronze), mais os textos legais |
| `_build-bronze/gerar-mapa.js` | Mapa estático do OpenStreetMap na paleta rosa e vinho |
| `_build-bronze/img/fotos/` | Fotos em WebP com o nome de `fotos` do `content.js`. Sem o arquivo, o site mostra um espaço reservado com a descrição da foto |
| `bronze/` | **Site pronto** (abrir o `index.html` no navegador) |

## Gerar

```bash
node templates/estetica/_build-bronze/build.js
```

O build lista as fotos que ainda faltam. O mapa só precisa ser gerado de novo se o endereço mudar (sharp instalado fora do projeto; apagar a pasta `tiles/` depois):

```bash
NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js rosa img/mapa_cambui.webp   # dentro de _build/
```

## Imagens

Fotos do Unsplash (licença Unsplash, uso livre), convertidas para WebP de até 1400px. O crédito de cada uma fica em `_build-bronze/img/creditos.json` e aparece no rodapé, em "Créditos das imagens". A capa e duas fotos da galeria mostram harmonização (preenchimento labial, queixo e toxina na testa). Ficaram de fora fotos com logo de outra clínica à vista. Para cliente real, trocar pelas fotos da clínica e da equipe, mantendo os nomes dos arquivos.

## Ligar e desligar segmentos

Cada segmento tem `ativo: true/false` em `segmentos` no `content.js`. Desligado, ele some do site inteiro: cartões da capa, preços, opções do formulário, rodapé e texto da capa. Para mostrar ao cliente sem gerar de novo, o link aceita `?seg=facial`, `?seg=facial,corporal` ou `?seg=depilacao`.

## O que o Bronze tem

- **Topo** com menu, status "Aberto agora, até as 20h" calculado pelo horário e botão do WhatsApp
- **Capa**: título, avaliação sem custo, responsável técnica com registro, foto em arco e os cartões dos segmentos ativos
- **Tratamentos e preços**: lista simples por segmento. Cada linha mostra duração, número de sessões e valor (sessão, "a partir de" ou pacote); ao tocar abre o que inclui, o preço do pacote e o botão para agendar aquele tratamento no WhatsApp. Facial tem protocolos por tipo de pele; depilação tem tabela por área com cera e laser
- **Pagamento, pacotes e garantia** do serviço (garantia de execução, nunca de resultado)
- **Como funciona**: linha do tempo da avaliação ao retorno, contraindicações e as políticas de avaliação prévia, agendamento, cancelamento, remarcação, atraso e desistência de pacote
- **A clínica**: responsável técnica e registro, segurança e higiene (descartáveis, autoclave, Anvisa, licença sanitária) e aviso de resultados sem promessa
- **Galeria fixa** com 6 fotos
- **Agendamento**: horário com o dia de hoje em destaque, endereço e formulário que abre o pedido pronto no WhatsApp. Consentimento LGPD obrigatório, consentimento separado para novidades e **ficha de saúde prévia** opcional, que só libera os campos depois do consentimento específico para dados sensíveis
- **Dúvidas** em sanfona
- **Rodapé** com o mapa padrão `.map-box` do OpenStreetMap, "Onde atendemos", canais, redes (Instagram, Facebook, LinkedIn, WhatsApp), razão social, CNPJ, endereço, telefone, e-mail, responsável técnica e os links para Termos de prestação de serviço, Termos de uso, Política de privacidade e Preferências de cookies (abrem em janela na própria página)
- **Botão flutuante do WhatsApp** e **aviso de cookies** (aceitar todos ou só os essenciais, escolha salva no navegador)

Ainda não entraram em nenhum tier: páginas por tratamento e área da cliente. O Gold tem um pedido de horário com dias e horários (sem agenda conectada).

## O que o Silver tem

**Só estética corporal**: massagens modeladoras e relaxantes, drenagem linfática, tratamentos para celulite e gordura localizada e pacotes de sessões. Landing page no formato clássico (capa, dores, medos, diferenciais, tratamentos, resultados, como funciona, quem cuida, dúvidas e chamada final), com os movimentos da referência dragrazicardoso.com.br refeitos na marca Camélia. Nada da referência foi copiado além da ideia dos efeitos: textos, fotos, cores e desenhos são próprios.

| Pasta | O que é |
|---|---|
| `_build-silver/content.js` | Conteúdo corporal: responsável técnica fisioterapeuta dermatofuncional, os quatro segmentos com preços, pagamento, garantia, etapas, contraindicações, políticas, segurança, antes e depois, FAQ e o bloco `silver` (abertura, faixa, dores, medos, pilares, depoimentos e chamada final) |
| `_build-silver/build.js`, `style.css`, `app.js` | Gerador, design e animações. Mapa, logo e texturas são cópias das do Bronze, para o modelo andar sozinho |
| `_build-silver/img/fotos/` | Fotos corporais próprias do Silver (Unsplash, créditos em `img/creditos.json`) |
| `silver/` | **Site pronto** |

```bash
node templates/estetica/_build-silver/build.js
```

Segmentos (`segmentos` no `content.js`), cada um com `ativo: true/false`:

| id | Aba | O que tem |
|---|---|---|
| `massagens` | Massagens | modeladora, modeladora com instrumentos de madeira, relaxante e pedras quentes, mais o guia de pressão |
| `drenagem` | Drenagem | corporal, pernas e abdômen, pós-operatória e na gestação |
| `celulite` | Celulite e gordura | protocolos para celulite e gordura localizada, radiofrequência, endermoterapia e tabela de preço por área |
| `pacotes` | Pacotes | Leveza, Contorno, Pausa e Recuperação, com valor do pacote e quanto sairia avulso, mais as regras dos pacotes |

Desligar um segmento tira do site inteiro a aba, as opções do formulário, o link do rodapé e o que estiver marcado com `seg` (dores, cartões de antes e depois, depoimentos e dúvidas). Pacote com `requer` só aparece se os segmentos de que depende estiverem ligados (o Pacote Contorno precisa de massagens e drenagem). Com um segmento só, as abas somem e o nome dele vira o título da lista. Para mostrar ao cliente sem gerar de novo: `?seg=drenagem`, `?seg=massagens,drenagem` ou `?seg=celulite,pacotes`.

Antes e depois: simulações marcadas feitas no build. `celulite` desenha furinhos rasos de sombra e reflexo sobre a foto; `volume` mostra a mesma foto um pouco mais larga no "antes". Cliente real: fotos verdadeiras com autorização por escrito.

Movimentos:
- **Abertura**: três frases ("Cuidar do corpo / começa por uma / boa conversa") surgem com desfoque sobre a camélia em contorno e a cortina sobe. Aparece uma vez por sessão; um toque pula. `?intro` força a abertura e `?semintro` pula (útil em prints)
- **Flores no clique**: cada toque ou clique solta um punhado de camélias pequenas nas cores da marca, que giram e caem
- **Brilhos na capa**: lascas de ouro e camélias piscando em volta da foto, sempre fora da área livre definida em `silver.capa.livre` (mãos, óleo e rosto)
- **Camélias flutuando** devagar no fundo vinho de Tratamentos e da chamada final
- **Entrada na rolagem**: textos sobem, fotos saem de um zoom leve e os cartões entram entrelaçados, alternando o lado com um giro pequeno
- **Faixa rolante** vinho com a frase da marca e camélias como separador, e **galeria rolante** de fotos da clínica (para no hover)
- **Cartões de medo** que sobem no hover, lista de tratamentos em cascata ao trocar de aba, linha das etapas que se desenha
- **Antes e depois em grade**: até três cartões (celulite, pernas inchadas, gordura no abdômen), cada um com a própria cortina, que balança sozinha na primeira vez
- **WhatsApp flutuante** respirando e barra de rolagem nas cores da marca
- Tema claro e escuro com o mesmo botão de camélia do Bronze

Tudo respeita `prefers-reduced-motion`: sem abertura, flores, brilhos nem entradas.

Cores do Silver (próprias, diferentes do vinho do Bronze e do Gold): **preto quente** `#1F1B18` nos títulos e `#1C1916` nas seções escuras, **dourado champanhe** `#8C6B35` nos botões e `#A8844A` / `#D9B56E` nos destaques, **nude** `#EBE0D2` e `#F3EDE4` nos fundos claros, marfim `#FAF7F1` na base. A abertura mostra só as frases, sem a camélia desenhada atrás.

Tipografia do Silver: **Cormorant Garamond** nos títulos (itálico dourado nos destaques) e **Jost** no texto. O formulário do Silver não pede dados de saúde: a ficha é preenchida na avaliação. Os depoimentos são ilustrativos e marcados `[EXEMPLO] [JURÍDICO]`: cliente real só com depoimentos verdadeiros e autorizados.

## O que o Gold tem

A página começa do lado de fora da clínica, em 3D, com luz clara de fim de manhã. Na rolagem, um drone desce até a porta de vidro (que abre quando ele chega), atravessa a recepção e passa pela fileira de arcos que liga as salas. Em cada sala ele para, a placa da sala sobe com o conteúdo e alguma coisa acontece na cena. No fim o telhado sobe e some, e a clínica aparece vista de cima com o nome de cada sala.

| Parada | O que se vê | O que acontece na cena | Conteúdo da placa |
|---|---|---|---|
| Fachada | prédio térreo com janelas em arco, frontão com a camélia dourada, ciprestes e oliveiras | o drone paira e gira devagar em volta | título, chamada, agendar e começar a visita |
| Consultório | parede rosa com boiserie, retrato da responsável em moldura de arco, diploma e registro no conselho, mesa oval e poltronas de bouclé | a luz de quadro acende sobre o retrato | retrato da responsável no arco da placa, quem cuida, registro, citação, equipe |
| Sala de avaliação | aparelho de análise de pele (cúpula com anel de luz), monitor, espelho em arco, lupa | a lupa desce sobre a banqueta, o anel acende e o monitor faz a leitura da pele | como funciona, etapas da avaliação |
| Sala de procedimentos | **a cadeira de procedimentos** em 3D, carrinho com seringas e luvas, armário com pia, geladeira de toxina | a cadeira reclina, a perneira sobe, a lupa vem para cima do rosto e acende | carta de tratamentos faciais com preço, o que inclui e agendar cada um |
| Sala corporal | maca com apoio de rosto, toalhas, velas, pedras quentes, difusor com névoa, radiofrequência, cortina de linho | as velas tremulam, a névoa sobe e a cortina balança | carta corporal |
| Estúdio do olhar | maca de cílios, luz de anel, laser de diodo, camélia em néon | o néon se desenha e a luz de anel acende | carta de cílios, sobrancelhas e depilação, tabela por área |
| Vista de cima | a planta inteira, sem telhado | o telhado sobe e some, os nomes das salas aparecem | chamada para a agenda e horários |

Nas salas de avaliação, procedimentos, corporal e olhar, uma foto em arco fica ao lado da placa (fora dela), parada enquanto a placa rola, com legenda e, em procedimentos e olhar, uma foto menor sobreposta. Fotos e recorte em `gold.quadros`. No celular a foto sobe para cima da placa.

Depois da visita vêm as seções comuns: antes e depois (cortina arrastável, simulação marcada como no Bronze e no Silver, agora com a foto em arco), depoimentos ilustrativos, pagamento e políticas (com o bloco de segurança e higiene: descartáveis, autoclave, Anvisa e licença sanitária), dúvidas, agenda e rodapé com o mapa padrão.

| Pasta | O que é |
|---|---|
| `_build-gold/content.js` | Mesma base do Bronze, mais o bloco `gold`: a **planta** (salas e medidas, fonte única da cena e da mini planta) e os textos de cada parada |
| `_build-gold/cena/` | A clínica em 3D, feita em código com Three.js r160 (nenhum modelo pronto): `base.js` (luz, materiais, texturas desenhadas, formas), `predio.js` (paredes, arcos, janelas, porta, telhado, jardim), `salas.js` (móveis de cada sala), `voo.js` (poses do drone, caminhos pelos arcos, o que anima em cada sala, tema noite) |
| `_build-gold/app.js` | Liga a rolagem ao drone, mini planta, rótulos da vista de cima, agenda de dias e horários, tema e formulário |
| `_build-gold/build.js`, `style.css` | Gerador e design. O build junta os quatro arquivos de `cena/` em `gold/assets/js/cena.js` e converte o Three.js em script comum |
| `_build-gold/preparar-texturas.js` | Recorta o retrato e as gravuras que viram quadros na cena (`img/texturas/`). Elas entram como data URI, então o site abre até direto do arquivo |
| `gold/` | **Site pronto** |

```bash
node templates/estetica/_build-gold/build.js
```

Detalhes:
- **Mini planta** no canto (embaixo à direita no computador, em cima no celular e no tablet): mostra a sala em que o drone está e leva a qualquer sala com um toque
- **Tema escuro** com o mesmo botão de camélia: a clínica anoitece, o sol vira lua, as janelas acendem por fora e os balizadores do caminho brilham
- **Agenda**: o formulário mostra os próximos dias abertos e os horários de cada dia (a cada 1h30, até 1h antes de fechar) e manda o pedido pronto no WhatsApp, avisando que é um pedido a confirmar. Intervalo e quantidade de dias em `gold.agenda`
- **Segmentos**: segmento desligado tira a parada da sala dele (o drone só atravessa a sala). Também vale `?seg=facial`
- `?parada=procedimentos` abre a página já dentro de uma sala, bom para mostrar ao cliente. `?tema=escuro` abre à noite
- **Movimento reduzido**: a câmera corta de sala em sala, sem voo. **Sem WebGL**: cada placa ganha uma foto recortada pelo arco e a página vira uma lista normal
- **Desempenho**: os objetos parados de cada sala são fundidos por material (cerca de 300 chamadas de desenho na fachada e menos de 80 dentro das salas), a sombra só é refeita quando algo se mexe e o drone para de desenhar quando a visita sai da tela
- Prints automáticos: `window.__camelia` expõe a cena para testes (`cena.simula(segundos)` avança o tempo sem desenhar)

Tipografia do Gold: **Spectral** leve nos títulos (itálico vinho nos destaques) e **Urbanist** no texto. A clínica em 3D é uma ilustração: o rodapé e os termos de uso avisam isso. Para cliente real, trocar o retrato e as gravuras (rodar `preparar-texturas.js` com as fotos novas), o nome e o registro (vão para o diploma desenhado na parede) e conferir se as salas da planta batem com a clínica.

## O que o Gold Íris tem

Segundo modelo Gold, **só depilação, cílios e sobrancelhas**: depilação a laser e com cera com preço por área, design de sobrancelhas (com henna e brow lamination), extensão de cílios (fio a fio, híbrida, volume russo) e lash lifting. Site completo e interativo, com paleta própria (diferente do Bronze e do Silver) e tudo desenhado em código, sem biblioteca.

| Pasta | O que é |
|---|---|
| `_build-gold-iris/content.js` | Todo o conteúdo: marca, equipe com a agenda de cada profissional, áreas do corpo com preço de cera e laser, pacotes, serviços, provador, políticas, contraindicações, anamnese, avaliações do Google, clube, vale-presente, loja, blog, FAQ e SEO local. `[EXEMPLO]` e `[JURÍDICO]` como nos outros |
| `_build-gold-iris/desenho.js` | Desenhos em SVG feitos em código: olho com cílios fio a fio (estilos, curvatura, tamanho, piscar), sobrancelha fio a fio (formas, henna, "antes" desarrumado), perna com e sem pelos e a silhueta do mapa do corpo. Roda no build e no navegador |
| `_build-gold-iris/build.js`, `style.css`, `app.js` | Gerador, design e interações. CSS e JS em arquivos próprios (`assets/site.css`, `assets/site.js`), porque o site tem várias páginas |
| `_build-gold-iris/img/` | 18 fotos do Unsplash (créditos em `creditos.json`) e o mapa na paleta Íris (`node gerar-mapa.js iris img/mapa_cambui.webp`) |
| `gold-iris/` | **Site pronto**: `index.html`, `blog/` (índice e 4 artigos), `sitemap.xml`, `robots.txt` |

```bash
node templates/estetica/_build-gold-iris/build.js
```

O que tem, de cima para baixo:

- **Capa** com um olho desenhado fio a fio que acompanha o cursor e pisca. Os botões Natural, Boneca, Gatinho e Volume russo trocam os cílios, que entram um a um
- **Serviços** em quatro painéis de foto que se abrem com o cursor
- **Provador do olhar**: estilo dos cílios, curvatura C, D ou L, tamanho de 8 a 14 mm, forma da sobrancelha e henna. O desenho muda na hora e mostra o serviço, o tempo, o preço e a manutenção. "Agendar este olhar" já leva para a agenda com o serviço escolhido
- **Mapa do corpo e simulador de pacotes**: silhueta de frente e de costas com pontos clicáveis (16 áreas), laser ou cera, pacote avulso, de 6, 8 ou 10 sessões. Mostra total, parcelas, economia, a previsão das sessões mês a mês e quanto a cera custaria em 2 anos. Três áreas ou mais ganham desconto extra
- **Preços** em abas por segmento: o que inclui, duração, sessões, valor ou "a partir de", manutenção e tabela por área de cera e laser. Pagamento, pacotes e garantia logo abaixo
- **Antes e depois arrastável** (cílios, sobrancelhas e laser), com ilustrações marcadas como ilustração e o aviso sem promessa
- **Equipe** com responsável técnica e registro; cada profissional tem o botão "Ver a agenda"
- **Agenda online** por profissional: serviço (e áreas, no laser e na cera), profissional com o próximo horário livre, dia (3 semanas, com "livres", "lotado" ou "fechado") e horário pela duração do serviço, dados com consentimento LGPD. No fim, pedido pronto no WhatsApp e arquivo `.ics` para a agenda do celular. Os horários ocupados são simulados; o horário pedido fica marcado como ocupado no navegador
- **Avaliação online (anamnese simplificada)**: consentimento específico para dados de saúde antes da primeira pergunta, escolha dos serviços, perguntas só dos serviços escolhidos (tom de pele em amostras, cor do pelo, gestação, isotretinoína, sol, remédios, varizes, ácidos, alergia à cola e à henna, olhos, micropigmentação). Resultado por serviço: pode agendar, agendar com avaliação presencial ou melhor esperar, com o motivo. As respostas ficam só no navegador e só vão para a clínica se a cliente tocar em enviar
- **Avaliações do Google**: nota, distribuição, filtro por serviço e cartões que rolam. No site real, ligar à API do Perfil da Empresa no Google
- **Clube Íris**: quatro planos, mensal sem fidelidade ou anual com valor menor, com o avulso equivalente e as regras
- **Vale-presente**: valor ou serviço, três estampas, para, de e mensagem, com o cartão ao vivo (inclina com o cursor), código e validade. Compra pelo WhatsApp
- **Loja** com 8 produtos (embalagens desenhadas, sem foto) e sacola lateral que guarda os itens no navegador, com entrega e pedido pelo WhatsApp
- **Blog**: destaque e lista na home, página de índice e 4 artigos com autora (responsável técnica), migalha e "Leia também"
- **Como funciona**: etapas em linha, contraindicações por segmento, políticas (avaliação prévia, agendamento, cancelamento com destaque 24h, remarcação, desistência) e segurança e higiene (descartáveis, autoclave, Anvisa, licença)
- **Dúvidas**, **SEO local** (texto do bairro, como chegar, estacionamento, endereço) e o **rodapé** padrão com mapa OpenStreetMap, bairros, horários com o dia de hoje, canais, redes, razão social, CNPJ, responsável técnica e os termos
- **SEO**: título e descrição por página, canonical, Open Graph, geo, dados estruturados (BeautySalon com endereço, coordenadas, horários, bairros atendidos, equipe com registro, catálogo de serviços com preço, nota; FAQPage; BlogPosting e BreadcrumbList nos artigos) e `sitemap.xml`. Como é modelo, sai com `noindex` e `robots.txt` fechado: no site real, liberar os dois

Segmentos: `ativo` em `segmentos` no `content.js` (`laser`, `cera`, `sobrancelhas`, `cilios`). Desligado, some da faixa, do provador ou do mapa do corpo, dos preços, da agenda, da anamnese, das avaliações, do clube, da loja e do blog.

**Paleta Íris** (só deste modelo)

| Nome | Hex | Uso |
|---|---|---|
| Tinta | `#1E2233` | texto, botões, seções escuras (provador, clube, rodapé) |
| Íris | `#62558E` | itálicos dos títulos, textos de apoio |
| Íris claro | `#B7ACD8` | destaques sobre o escuro |
| Névoa | `#E7E3EE` | fundo de antes e depois, avaliação online e SEO local |
| Pérola | `#F6F3EF` | fundo principal |
| Papel | `#FFFDFB` | cartões e seções claras |
| Cobre | `#A9654B` (`#D9A58C` no escuro) | áreas marcadas, preços no escuro, selo do plano |

Tipografia: **Bodoni Moda** nos títulos (traço de alto contraste, fino como um fio) e **Commissioner** no texto. Logo: a mesma camélia, em tinta e névoa com centro cobre, com "OLHAR E PELE" no lugar de "ESTÉTICA".

## Guia básico da marca

- **Nome**: Camélia Estética. Razão social fictícia Camélia Estética Avançada Ltda., CNPJ 00.000.000/0001-00
- **Logo**: camélia de cinco pétalas rosa com contorno vinho, miolo de cinco pétalas vinho e centro dourado. Ao lado, "Camélia" em Gilda Display e "ESTÉTICA" espaçado em dourado. No fundo vinho, as pétalas internas clareiam
- **Cores**

| Nome | Hex | Uso |
|---|---|---|
| Branco gelo | `#F8F5F2` | fundo principal |
| Rosa pó | `#EFD9D4` | formas da capa, destaques suaves |
| Rosa claro | `#F6E9E5` | fundo da seção de atendimento |
| Dourado areia | `#B99D70` | detalhes, linha do tempo, marcadores (texto dourado usa `#8A7149` para ter contraste) |
| Cinzas claros | `#ECE7E3`, `#DCD3CE` | divisórias e bordas |
| Vinho | `#6B2234` | botões, títulos de apoio, preços |
| Vinho escuro | `#4A1624` | títulos e rodapé |

- **Tipografia**: Gilda Display nos títulos (serifa de alto contraste, elegante) e Albert Sans no texto. Dupla ainda não usada em outro projeto
- **Tom de voz**: acolhedor, calmo e preciso. Fala com "você", explica o que inclui e quanto custa, nunca promete cura ou resultado. Frases que funcionam: "Cuidar da pele começa por uma boa conversa.", "Você sai com o plano por escrito e decide com calma."
- **Formas**: arcos nas fotos (lembram janela e espelho), cantos de 4 a 8 px nos blocos, nada de selo em cápsula

## Para virar site de cliente

Copiar para `clientes/<cliente>/` (nunca editar aqui). Trocar `content.js` (marca, responsável técnica e registro real, WhatsApp, endereço, horários, tratamentos e preços, segmentos ativos), as fotos por fotos da clínica e da equipe, o logo em `icons.js`, gerar o mapa do endereço real, revisar todos os trechos `[JURÍDICO]` e os textos legais do `build.js` com o jurídico, e tirar o `noindex` do `build.js`.
