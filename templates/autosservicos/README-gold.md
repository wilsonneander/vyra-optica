# Autosserviços: modelo Gold "Pistão Auto Center"

Nicho **autosserviços** (oficina mecânica, revisão e estética automotiva). Mesma empresa fictícia do Silver (Pistão Auto Center, Silveira, Belo Horizonte), em versão mais completa.
Referência visual: template "CRAS Car Repair & Auto Services" (https://cras-three.vercel.app/cras-main/index.html), copiado no visual e na ordem das seções: topo com telefone em destaque, faixa de contatos no alto da capa, cartões pretos chapados, palavra gigante em degradê metálico atrás dos títulos, foto inclinada sobre bloco vinho, serviços em cartões largos, vídeo em largura total, números vazados em vermelho, depoimento com foto inclinada, equipe com nome em caixa sobreposta, preços em colunas coladas sobre fundo vinho, newsletter centralizada no rodapé e seletor de tema na lateral.

Uma página só, com as seções do menu: Início, Serviços, Produtos, Sobre nós, FAQ e Contato (com formulário), mais a **Área do dono** (`painel/index.html`) para cadastrar produtos e acompanhar os pedidos. Sem galeria, blog ou outras páginas.

## Loja e Área do dono

- **Vitrine "Peças e acessórios"** (`#produtos`): cartões com foto, categoria, preço, preço antigo riscado com "% off", situação do estoque (em estoque, últimas unidades, sob encomenda) e filtro por categoria. Destaques aparecem primeiro. "Reservar" abre uma janela com nome, WhatsApp, quantidade e "retirar ou instalar"; a reserva fica salva para o painel e abre o WhatsApp com a mensagem pronta.
- **Área do dono** (`painel/index.html`, link no rodapé): login com e-mail e senha (trava 30 s depois de 5 erros, opção "manter conectado").
  - **Produtos**: cadastrar, editar e excluir; foto por arrastar ou escolher (reduzida para 900 px em WebP); estoque com + e -; liga/desliga vitrine e destaque; busca e filtros por categoria e situação.
  - **Pedidos**: agendamentos do formulário de contato e reservas da vitrine, com situação (novo, confirmado, concluído, cancelado), botão "Responder" no WhatsApp do cliente e contador de novos.
  - **Ajustes**: trocar senha, baixar e carregar cópia de segurança (JSON) e restaurar os produtos de exemplo.
- Acesso de demonstração: `dono@pistaoauto.com.br` / `pistao2026` (`painel` em `content.js`).
- **Importante:** neste modelo os dados ficam no navegador (`localStorage`, código em `_build-gold/loja.js`). Serve para demonstrar e para uma oficina que usa um computador só. Para o dono cadastrar de um aparelho e os clientes verem no deles, `loja.js` precisa ser ligado a um banco de dados com login de verdade (ex.: Supabase ou Firebase); `app.js` e `painel.js` não mudam, porque só falam com `PistaoLoja`.

| Pasta | O que é |
|---|---|
| `_build-gold/content.js` | Todo o conteúdo: marca, contatos, horários, slides, etapas, equipe, serviços, números, pacotes com preço, montadoras, depoimentos, FAQ, bairros e Instagram. `[EXEMPLO]` = trocar por cliente |
| `_build-gold/build.js` | Gera o `index.html` e copia CSS, JS, fotos e vídeos |
| `_build-gold/style.css`, `_build-gold/app.js` | Design e interação, sem bibliotecas (copiados para `gold/assets/`) |
| `_build-gold/loja.js` | Dados da loja (produtos, pedidos, senha) guardados no navegador, usados pelo site e pelo painel |
| `_build-gold/painel.js`, `_build-gold/painel.css` | Área do dono: login, produtos, pedidos e ajustes |
| `_build-gold/icons.js` | Logo, conta-giros do preloader e ícones desenhados para a marca |
| `_build-gold/img/fotos/` | Fotos em WebP (as mesmas do Silver, Unsplash; `imagens.js`) |
| `_build-gold/img/video/` | Vídeos MP4 sem som e pôsteres WebP, montados por `videos.js` com clipes do Mixkit (licença livre Mixkit) |
| `_build-gold/img/mapa_silveira.webp` | Mapa do OpenStreetMap recolorido no tema `grafite` (`gerar-mapa.js`) |
| `gold/` | **Site pronto** (abre direto pelo `index.html`, cerca de 8 MB com os vídeos) |

## Gerar

```bash
node "templates/autosservicos/_build-gold/build.js"
```

Vídeos só precisam ser refeitos se mudarem. Baixe os clipes do Mixkit (`https://assets.mixkit.co/videos/<id>/<id>-720.mp4`, ids listados em `videos.js`) para uma pasta fora do projeto e rode com o ffmpeg:

```bash
FFMPEG=<caminho do ffmpeg> CLIPES=<pasta dos clipes> node "templates/autosservicos/_build-gold/videos.js"
```

## Como é

- **Preloader**: conta-giros que enche de vermelho com o ponteiro subindo e a porcentagem, depois abre em duas cortinas
- **Topo** (como o CRAS): logo, menu centralizado em caixa-alta com letras que rolam no hover, telefone grande com círculo vermelho e status "Aberto agora" ou "Fechado agora". Linha fina embaixo; ganha fundo ao rolar, some ao descer e volta ao subir
- **Seletor de tema** na lateral direita (pílula branca com claro e escuro), salvo no navegador
- **Capa**: faixa de e-mail, endereço e horário com ícones vermelhos no alto; slides com o primeiro em **vídeo** e os outros em foto, troca em cortina com o texto entrando em camadas (parallax do Swiper da referência), botão vermelho retangular, setas redondas translúcidas, barras de progresso e redes na vertical
- **Etapas**: seta e linha que se desenha acima de três cartões pretos centralizados com ícone vermelho
- **Sobre nós**: título com "SOBRE" metálico atrás, frases em contorno que acendem em vermelho no hover, foto inclinada encostada na borda da tela sobre bloco vinho com paralaxe e selo cinza girando
- **Serviços**: sete cartões largos, foto à esquerda (cinco tocam **vídeo** no hover) e texto à direita sobre degradê preto, com "Pedir orçamento" sublinhado de vermelho
- **Vídeo da oficina**: em largura total, com zoom ao rolar, vídeo de fundo em loop e botão de play vermelho pulsando que abre o player
- **Números**: 16+, 23 mil e 98% vazados em vermelho, contando ao aparecer
- **Montadoras**: esteira de logos vermelhas com o nome
- **Depoimentos**: botões "Anterior / Próximo" em caixa, cartão preto com nome, aspas em gota vermelhas e texto em itálico, foto inclinada com bloco vinho atrás; troca automática e arrastar
- **Nossa equipe**: texto à esquerda e três retratos em **vídeo** (tocam no hover) com o nome numa caixa preta sobreposta que fica vermelha
- **Pacotes de revisão**: fundo vinho, colunas coladas com preço, preço antigo riscado e lista; a Revisão completa em vermelho. Carrossel com setas e arrastar
- **FAQ**: perguntas em cartões pretos, uma aberta por vez, título fixo ao lado
- **Contato**: canais, horário com o dia de hoje destacado e formulário de agendamento (serviço ou pacote) que abre o WhatsApp com a mensagem pronta
- **Instagram** em cima do rodapé: esteira com fotos e **reels** que tocam sozinhos quando aparecem
- **Rodapé**: chamada "lembrete da próxima revisão" no lugar da newsletter, logo, telefone grande, colunas de links, mapa padrão do OpenStreetMap (`.map-box`) com "Onde atendemos", copyright e redes
- Vídeos só carregam quando necessários (`preload="none"`), não tocam com economia de dados ligada e param com "reduzir movimento"
