| `_build-premium/gerar-mundo.js` | Mapa-múndi pontilhado da seção Destinos (gera `img/mundo.json` a partir do Natural Earth) |
# Agências de turismo: modelo Premium "Peakalika Turismo"

Versão premium do site https://peakalikaturismo.com/ (agência de Curitiba). Todo o conteúdo do site original foi reaproveitado: textos, destinos com preços e links da Civitatis, serviços, assessoria de vistos, depoimentos, posts do Instagram, logo, WhatsApp e o portal Disney da Suncoast. A cliente gosta de referências à Disney, então a página inteira conversa com esse universo ("Era uma vez...", castelo, fada, fogos, "E viveram felizes para sempre").

Uma página só, com as seções do menu original: Passagens, Destinos, Disney, Serviços, Vistos e Clientes.

## Identidade

- Cores: coral da marca `#FF674A` e o âmbar do degradê do logo `#FF8B19`, sobre azul-marinho noturno (`#0A1322`, derivado do `#0D1B2A` original), com champanhe `#E8C987` e marfim `#F6F0E6` para dar o tom premium.
- Fontes: Gloock (títulos) e Hanken Grotesk (texto). O site original usa Montserrat, que é proibida pelas diretrizes.
- Logo: a original (laranja chapada) vira branca com fundo transparente em `imagens.js`.
- Motivo visual: o arco de janela de castelo. Aparece na capa, nos cartões de destino, no carrossel, no contador, na foto da consultora e no vídeo dos fogos.

## Como é

- **Preloader**: logo, linha fina de progresso e porcentagem; a cortina sobe.
- **Cursor** próprio com rótulo ("Saiba mais"). Só no computador.
- **Capa** (presa ao scroll): vídeos da Disney em tela cheia trocando sozinhos (fogos no castelo, castelo de dia, balão do Mickey, Toy Story Land). Ao rolar, o vídeo recua para um quadro central com moldura fina dourada e as palavras "Sonhe." e "Embarque." chegam pelos lados.
- **Buscador** do site original (Voos, Hotéis, Voo + Hotel, Carros, Exclusivos, Seguros; trecho, viajantes, origem e destino com botão de troca, datas). "Buscar" abre o WhatsApp com a cotação pronta.
- **Faixa** coral inclinada com os serviços correndo e o avião da marca entre eles.
- **Transições em 3D** (presas ao scroll, antes de Destinos, Disney e Serviços): montanha-russa em primeira pessoa desenhada em canvas com projeção em perspectiva. O trilho vem da tela em direção ao usuário, a câmera sobe, desce e inclina nas curvas, com suportes, dormentes, luzes da cidade no horizonte e a frente do carrinho embaixo. No fim do percurso o nome da próxima seção ("Destinos", "Orlando", "Serviços") vem flutuando sobre o trilho até passar pela tela. Cada transição tem um trilho diferente (`semente` em `content.js`).
- **Transição do menu**: ao clicar em qualquer link do menu (ou nos botões da capa), um avião atravessa a tela num corte diagonal coral e marfim com "Próxima parada: Serviços", e a página troca por trás.
- **Destinos internacionais** (presa ao scroll): mapa-múndi pontilhado (Natural Earth, `gerar-mundo.js`) com as rotas saindo de Curitiba. A cada destino o avião voa a rota, a cidade acende e, à direita, a foto troca com o cartão de voo: CWB para o aeroporto do destino, distância calculada, cidade, passeio, preço e botão para o passeio na Civitatis (ou WhatsApp). Paris, Roma, Veneza, Madrid, Lisboa, Londres, Dubai, Tóquio, Nova York e Orlando.
- **Disney** (serviço da agência): abertura em vídeo do show noturno em tela cheia, logo Walt Disney World, texto original e botões para o portal Disney e o WhatsApp; citação de Walt Disney e os três itens do planejamento.
- **Um dia perfeito na Disney** (presa ao scroll): roteiro em vídeo de 8h a 21h. Cada horário troca o vídeo de fundo, o horário grande e o texto, com a linha do tempo lateral avançando. Horários ilustrativos de um roteiro do guiamento virtual.
- **Quanto falta para a viagem?**: contador regressivo até a data do embarque (salvo no navegador).
- **Serviços**: mosaico de fotos com tamanhos diferentes (Disney grande tocando vídeo, Hospedagem, Passagens, Pacotes, Passeios, Universal, Cruzeiros, Xcaret, Transfers, Aluguel de carros, Seguros). Os blocos se revelam em sequência, inclinam em 3D, a foto aproxima e a descrição aparece no hover; cada bloco abre o WhatsApp com o serviço.
- **Vistos**: Nova York em paralaxe ao fundo, passaporte em 3D que acompanha o mouse com reflexo, carimbo "Aprovado EUA" e o caminho Formulário, Documentos, Agendamento, Entrevista e Embarque desenhado pelo scroll com o avião.
- **Quem planeja com você**: foto da consultora com moldura deslocada e a frase da marca.
- **Clientes**: "+5.000" contando em contorno coral, logos TripAdvisor, Expedia, Booking e Airbnb, e baralho de depoimentos (arrastar, botões e troca automática).
- **Instagram**: esteira curva em 3D com os posts originais e reels da Disney que tocam sozinhos; acelera com o scroll.
- **Final**: "E viveram felizes para sempre." com fogos ao aparecer e no hover do botão.
- **Rodapé**: logo, links, contatos, mapa padrão do OpenStreetMap (`.map-box`) recolorido no azul noturno, "Onde atendemos" e créditos.
- **Chat** "Fale conosco!" com assuntos que abrem o WhatsApp.
- Vídeos carregam só quando aparecem, não tocam com economia de dados e tudo fica parado com "reduzir movimento".

## Arquivos

| Pasta | O que é |
|---|---|
| `_build-premium/content.js` | Todo o conteúdo. `[EXEMPLO]` = não existe no site original, confirmar com a cliente |
| `_build-premium/build.js` | Gera o `index.html` e copia CSS, JS, fotos e vídeos |
| `_build-premium/style.css`, `app.js` | Design e interações, sem bibliotecas |
| `_build-premium/icons.js` | Avião da marca, castelo em linha e ícones próprios |
| `_build-premium/imagens.js` | Converte as imagens do site original para WebP, gera a logo branca e os logos de parceiros |
| `_build-premium/videos.js` | Corta e comprime os vídeos (lista das fontes no topo do arquivo) |
| `_build-premium/gerar-mapa.js` | Mapa do OpenStreetMap recolorido no tema `noite` |
| `site-premium/` | **Site pronto** (abre direto pelo `index.html`, cerca de 21 MB com os vídeos) |

## Gerar

```bash
node "templates/agências-de-turismo/_build-premium/build.js"
```

Imagens, vídeos e mapa só precisam ser refeitos se mudarem (sharp e ffmpeg instalados fora do projeto):

```bash
ORIGEM=<pasta com as imagens de peakalikaturismo.com/images> node imagens.js
FFMPEG=<caminho do ffmpeg> CLIPES=<pasta dos clipes> node videos.js
node gerar-mapa.js noite img/mapa_curitiba.webp
```

## Confirmar com a cliente antes de publicar

- Endereço e coordenadas do mapa (hoje aponta para o centro de Curitiba) e horário de atendimento.
- Nome da consultora da foto (`consultora.nome`).
- Cidades do "Onde atendemos".
- Número do botão de vistos: o site original usa `5541925165995` nesse botão e `5541987856236` no resto.
- Licença das imagens da Disney: os vídeos vêm do Pexels e Pixabay (uso livre), mas mostram personagens e parques da Disney. Walt Disney World é marca registrada; o rodapé traz o aviso.
