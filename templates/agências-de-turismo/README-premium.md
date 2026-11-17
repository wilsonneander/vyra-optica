# Agências de turismo: modelo Premium "Peakalika Turismo"

Versão premium do site https://peakalikaturismo.com/ (agência de Curitiba). Todo o conteúdo do site original foi reaproveitado: textos, destinos com preços e links da Civitatis, serviços, assessoria de vistos, depoimentos, posts do Instagram, logo, WhatsApp e o portal Disney da Suncoast. A cliente gosta de referências à Disney, então a página inteira conversa com esse universo ("Era uma vez...", castelo, fada, fogos, "E viveram felizes para sempre").

Uma página só, com as seções do menu original: Passagens, Destinos, Disney, Serviços, Vistos e Clientes.

## Identidade

- Cores: coral da marca `#FF674A` e o âmbar do degradê do logo `#FF8B19`, sobre azul-marinho noturno (`#0A1322`, derivado do `#0D1B2A` original), com champanhe `#E8C987` e marfim `#F6F0E6` para dar o tom premium.
- Fontes: Gloock (títulos) e Hanken Grotesk (texto). O site original usa Montserrat, que é proibida pelas diretrizes.
- Logo: a original (laranja chapada) vira branca com fundo transparente em `imagens.js`.
- Motivo visual: o arco de janela de castelo. Aparece na capa, nos cartões de destino, no carrossel, no contador, na foto da consultora e no vídeo dos fogos.

## Como é

- **Preloader**: castelo em linha dourada que se desenha, logo e porcentagem; abre em círculo.
- **Poeira mágica**: rastro dourado que segue o cursor e um cursor próprio com rótulo ("Ver passeio", "Saiba mais"). Só no computador.
- **Capa** (presa ao scroll): vídeos da Disney em tela cheia trocando sozinhos (fogos no castelo, castelo de dia, balão do Mickey, Toy Story Land). Ao rolar, o vídeo encolhe para dentro de uma janela em arco com moldura dourada, aparece o céu estrelado e as palavras "Sonhe." e "Embarque." chegam pelos lados.
- **Buscador** do site original (Voos, Hotéis, Voo + Hotel, Carros, Exclusivos, Seguros; trecho, viajantes, origem e destino com botão de troca, datas). "Buscar" abre o WhatsApp com a cotação pronta.
- **Faixa** coral inclinada com os serviços correndo e o avião da marca entre eles.
- **Destinos internacionais** (presa ao scroll): galeria horizontal de cartões em arco com inclinação 3D e brilho no hover, paralaxe da foto e um avião percorrendo a rota no rodapé da seção. No celular vira carrossel de arrastar.
- **Disney**: céu estrelado em canvas com estrelas cadentes, logo Walt Disney World, castelo que se desenha com o scroll, acende as janelas e solta fogos; uma fada atravessa o céu deixando poeira dourada. Tocar no castelo solta fogos de novo. Citação de Walt Disney e os três itens do planejamento.
- **Um passeio pelos parques** (presa ao scroll): carrossel 3D em anel com sete vídeos (Magic Kingdom, desfile do Mickey, Branca de Neve, Toy Story Land, parada, Main Street, castelo ao entardecer). Gira com o scroll e só o vídeo da frente toca.
- **Quanto falta para a magia?**: contador regressivo até a data da viagem (fica salvo no navegador) e fogos ao escolher a data.
- **Espetáculo** (presa ao scroll): vídeo do show noturno numa janela em arco que se abre até a tela cheia.
- **Serviços**: lista grande (Disney, Hospedagem, Passagens, Pacotes, Passeios, Universal, Cruzeiros, Xcaret, Transfers, Aluguel de carros, Seguros) com a foto que segue o cursor e inclina com a velocidade; cada linha abre o WhatsApp com o serviço.
- **Vistos**: Nova York em paralaxe ao fundo, passaporte em 3D que acompanha o mouse com reflexo, carimbo "Aprovado EUA" e o caminho Formulário, Documentos, Agendamento, Entrevista e Embarque desenhado pelo scroll com o avião.
- **Quem planeja com você**: foto da consultora em arco com paralaxe e a frase da marca.
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
