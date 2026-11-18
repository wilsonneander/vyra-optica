# Estética: modelo Bronze "Camélia"

Nicho **clínica de estética** (facial, corporal e depilação, cílios e sobrancelhas). Landing page de uma página só, com marca fictícia: Camélia Estética, Cambuí, Campinas. Público majoritariamente feminino.
Referência de conteúdo: jessicaboza.com.br (avaliação antes do protocolo, ficha técnica do tratamento, tom acolhedor e sem promessa, FAQ). Nada foi copiado: textos, nomes, números e preços são próprios e fictícios.

| Pasta | O que é |
|---|---|
| `_build/content.js` | Todo o conteúdo: marca, responsável técnica, horários, segmentos e tratamentos com preço, pagamento, garantia, etapas, contraindicações, políticas, segurança, FAQ e bairros. `[EXEMPLO]` = trocar pelo cliente, `[JURÍDICO]` = passar pela revisão jurídica |
| `_build/icons.js` | Logo da camélia, favicon e ícones próprios (sem biblioteca) |
| `_build/style.css`, `_build/app.js` | Design e interação |
| `_build/build.js` | Gera `site-bronze/index.html` com CSS e JS embutidos (padrão Bronze), mais os textos legais |
| `_build/gerar-mapa.js` | Mapa estático do OpenStreetMap na paleta rosa e vinho |
| `_build/img/fotos/` | Fotos em WebP com o nome de `fotos` do `content.js`. Sem o arquivo, o site mostra um espaço reservado com a descrição da foto |
| `site-bronze/` | **Site pronto** (abrir o `index.html` no navegador) |

## Gerar

```bash
node templates/estetica/_build/build.js
```

O build lista as fotos que ainda faltam. O mapa só precisa ser gerado de novo se o endereço mudar (sharp instalado fora do projeto; apagar a pasta `tiles/` depois):

```bash
NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js rosa img/mapa_cambui.webp   # dentro de _build/
```

## Imagens

Fotos do Unsplash (licença Unsplash, uso livre), convertidas para WebP de até 1400px. O crédito de cada uma fica em `_build/img/creditos.json` e aparece no rodapé, em "Créditos das imagens". A capa e duas fotos da galeria mostram harmonização (preenchimento labial, queixo e toxina na testa). Ficaram de fora fotos com logo de outra clínica à vista. Para cliente real, trocar pelas fotos da clínica e da equipe, mantendo os nomes dos arquivos.

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

Fica para Silver e Gold: antes e depois com controle deslizante, depoimentos, páginas por tratamento, agenda online e área da cliente.

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
