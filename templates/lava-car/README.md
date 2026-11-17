# Lava car: modelo Silver "Garoa Lava Car"

Nicho **lava car** (lavagem técnica e estética automotiva). Template de demonstração com empresa fictícia (Garoa Lava Car, Buritis, Belo Horizonte).
Identidade: marinho quase preto `#0A1322`, azul Garoa `#1F5EFF`, amarelo `#FFC93C`, espuma `#EEF3FA`. Fontes Red Hat Display (títulos) e Familjen Grotesk (texto). Logo: gota com um carro vazado dentro.

Uma página só: Início, Serviços (lavagem técnica e acabamentos), Planos, Antes e depois, Vídeos, Avaliações, FAQ e Contato.

| Pasta | O que é |
|---|---|
| `_build/content.js` | Todo o conteúdo: marca, contatos, horários, níveis de lavagem, acabamentos, planos, preços, vídeos, avaliações, FAQ, bairros, Instagram. `[EXEMPLO]` = trocar pelo cliente |
| `_build/build.js` | Gera o `index.html` e copia CSS, JS, fotos e vídeos |
| `_build/style.css`, `_build/app.js` | Design e interação (copiados para `site-silver/assets/`) |
| `_build/icons.js` | Logo e ícones desenhados para a marca (sem biblioteca de ícones) |
| `_build/imagens.js` | Baixa as fotos do Unsplash e gera as versões "antes" (sujeira aplicada sobre a foto limpa) |
| `_build/gerar-mapa.js` | Mapa do OpenStreetMap recolorido no tema `marinho` |
| `_build/video/` | Vídeos do Mixkit (licença livre), 720p |
| `site-silver/` | **Site pronto** (abre direto pelo `index.html`) |

## Gerar

```bash
node "templates/lava-car/_build/build.js"
```

Fotos e mapa só precisam ser gerados de novo se mudarem (precisam do `sharp` instalado fora do projeto):

```bash
NODE_PATH=<pasta com node_modules/sharp> MOTOR=<caminho de um motor.webp> node "templates/lava-car/_build/imagens.js"
NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js marinho img/mapa_buritis.webp   # dentro de _build/
```

Em um cliente real, as fotos de antes e depois devem ser trocadas por fotos reais do próprio lava car (mesmo nome de arquivo: `ad-<nome>.webp` e `ad-<nome>-antes.webp`).

## Como é

- **Abertura**: gota caindo e espalhando ondas; depois um **rodo** passa pela capa limpando o vidro embaçado com gotas
- **Capa** com vídeo de profissional lavando, bolhas subindo (e bolhas que seguem o mouse), título em três linhas, nota do Google
- **Letreiro** amarelo com os serviços correndo
- **Equipe**: fotos de profissionais com paralaxe, selo girando, compromissos e números que contam
- **Lavagem técnica**: abas Platina, Diamante e Rubi; foto troca com cortina, medidor de "nível de cuidado" enche com água, etapas acendem conforme o nível, porte P/M/G muda o preço e a mensagem do WhatsApp
- **Interior e acabamentos**: seis serviços em lista grande; no hover a foto ao lado troca com o rodo passando. No celular vira acordeão com foto
- **Vídeos**: palco grande + seis miniaturas que tocam no hover; clique troca o vídeo principal
- **Antes e depois**: comparador arrastável (teclado também), dica de movimento ao aparecer, abas Pintura, Couro e Painel
- **Planos de assinatura**: Uber Pro, Cuidado Essencial e Cuidado Avançado; escolha do porte muda os preços com contagem; "cartão fidelidade" com gotas carimbadas; faixa "Como funciona"; fundo de garoa caindo
- **Avaliações**: nota 4,9, carrossel com setas, arrastar e troca automática com barra de progresso
- **FAQ**, **Agendamento** (formulário que abre o WhatsApp com a mensagem pronta), **Instagram** com zoom e véu azul no hover
- **Rodapé** com onda, mapa padrão do OpenStreetMap (`.map-box`), "Onde atendemos", navegação, acabamentos, contatos e redes
- Botões com espuma subindo em onda no hover, WhatsApp flutuante e voltar ao topo com anel de progresso
- Com "reduzir movimento" ligado no sistema, as animações param
