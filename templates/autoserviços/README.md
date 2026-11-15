# Autosserviços: modelo Bronze "Tração Centro Automotivo"

Nicho **autosserviços** (centro automotivo, oficina mecânica, pneus). Landing page de vitrine, objetiva, com empresa fictícia (Tração Centro Automotivo, Carlos Prates, Belo Horizonte).
Referências enviadas: automec-react.netlify.app/home-2 e pscarcentroautomotivo.com.br, mais o print da nav escura com botão vermelho "Orçamento grátis".

| Pasta | O que é |
|---|---|
| `_build/content.js` | Todo o conteúdo: marca, contatos, horários, nav, serviços, números, diferenciais, avaliações e bairros. `[EXEMPLO]` = trocar por cliente |
| `_build/build.js` | Gera `site-bronze/index.html` com CSS e JS embutidos (padrão Bronze) |
| `_build/style.css`, `_build/app.js` | Design e interação |
| `_build/icons.js` | Logo (porca sextavada com "T" de banda de rodagem), pneu da capa, marca de pneu, ferramentas do fundo e ícones próprios |
| `_build/gerar-mapa.js` | Mapa estático do OpenStreetMap na paleta asfalto |
| `_build/img/fotos/` | Fotos do Unsplash (licença livre) em WebP |
| `site-bronze/` | **Site pronto** (abre direto pelo `index.html`) |

## Gerar

```bash
node "templates/autoserviços/_build/build.js"
```

O mapa só precisa ser gerado de novo se o endereço mudar (precisa do `sharp` instalado fora do projeto):

```bash
NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js asfalto img/mapa_carlos-prates.webp   # rodar dentro de _build/
```

## Como é

- **Topo**: barrinha com Início, Serviços, Sobre nós, Contato, horário (vira "Aberto agora, até 18h" no horário de atendimento) e telefone. Abaixo, a nav escura do print: logo, **Pneus e rodas, Mecânica, Troca de óleo, Sistema de freio, Suspensão** e o botão vermelho "Orçamento grátis". Cada link da nav rola até os serviços, abre o serviço certo e pisca a aba. A barrinha some ao rolar
- **Capa**: título grande "Seu carro pisando firme de novo", foto do mecânico com recorte em diagonal que entra deslizando, **pneu desenhado que gira** atrás da foto (acelera com a rolagem), selo vermelho "90 dias" com texto circular girando e nota 4,9 do Google flutuando. **Orçamento rápido**: o cliente marca os serviços, digita o carro e o pedido sai pronto no WhatsApp
- **Faixa de marca de pneu** vermelha correndo no pé da capa
- **Números** que contam ao aparecer (13 anos, 18 mil carros, 4,9, 90 dias)
- **Serviços** em painel de oficina: lista à esquerda (Pneus e rodas, Mecânica geral, Troca de óleo, Sistema de freio, Suspensão, Alinhamento 3D) com tempo médio; à direita, foto que entra em cortina, legenda vermelha, o que está incluso e botão "Orçar" que já leva o serviço para o WhatsApp. No celular a lista vira abas deslizantes. Fundo com marca de pneu em diagonal
- **Alinhamento 3D**: tela do alinhador com o carro visto de cima; as rodas chegam tortas e voltam para 0,0° (vermelho para verde) com uma linha de leitura passando
- **Sobre nós**: duas fotos sobrepostas, selo "desde 2013", texto e quatro diferenciais em lista (orçamento por foto, peça velha é sua, garantia de 90 dias, leva e traz). Fundo com ferramentas desenhadas (chave combinada, soquete, chave de roda em cruz)
- **Avaliações**: nota geral do Google e duas esteiras de depoimentos correndo em sentidos opostos (param no hover)
- **Contato**: canais, tabela de horário com o dia de hoje em destaque e formulário que monta a mensagem no WhatsApp (máscara de telefone)
- **Rodapé**: mapa padrão `.map-box` do OpenStreetMap, "Onde atendemos" com bairros do leva e traz, colunas e redes. Botão flutuante do WhatsApp

## Identidade

- Nome fictício **Tração Centro Automotivo** (tração = pneu agarrando no chão)
- Cores: asfalto `#0F1012`, carvão `#17181B`, grafite `#24262B`, aço `#9AA0A8`, giz `#F3F2EE`, vermelho pinça de freio `#D42A1E`, amarelo sinalização `#FFC21A` (estrelas e foco)
- Fontes: **Anybody** (títulos, larga e itálica no destaque) + **Schibsted Grotesk** (texto). Dupla ainda não usada em outro projeto

## Para virar site de cliente

Copiar para `clientes/<cliente>/` (nunca editar aqui). Trocar `content.js`, fotos, logo em `icons.js`, gerar o mapa do endereço real e tirar o `noindex` do `build.js`.
