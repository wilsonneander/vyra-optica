# Dentista (Sorrisus Prime)

Nicho de clínicas odontológicas. Por enquanto só o **Gold**, a partir da fachada enviada pelo cliente (marca Sorrisus Prime, Odontologia Avançada).

| Pasta | O que é |
|---|---|
| `_build-gold/` | Código-fonte e conteúdo do Gold |
| `_build-gold/content.js` | Todos os textos e dados: marca, dentista, tratamentos, ambientes, horários e bairros |
| `_build-gold/img/fotos/` | Fotos em WebP. `fachada.webp` e `dentista.webp` são imagens do cliente; as outras são do Unsplash (licença livre), com crédito em `img/creditos.json`, que também aparece no rodapé |
| `_build-gold/vendor/` | GSAP 3.12.5 e ScrollTrigger, copiados para o site (abre sem internet e sem CDN) |
| `gold/` | **Site pronto** (abrir o `index.html` no navegador) |

## Gerar

```bash
node templates/dentista/_build-gold/build.js
```

O mapa só precisa ser gerado de novo se o endereço mudar (sharp instalado fora do projeto; apagar a pasta `tiles/` depois):

```bash
NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js champanhe img/mapa_jardins.webp   # dentro de _build-gold/
```

## Gold: a entrada pela porta

A página abre na fachada inteira, em tela cheia. A rolagem controla uma câmera que mira a **vidraça da recepção** (não o centro da foto), aproxima, atravessa o vidro e entra na clínica. Subindo, a câmera recua pelo mesmo caminho.

- A seção é fixada pelo ScrollTrigger por 3,2 telas de rolagem, com `scrub` suave.
- A câmera é calculada a cada quadro (`desenha(p)` em `app.js`): escala exponencial de `s0` (fachada cobrindo a tela) até `zFim` (vidraça maior que a tela), com o centro saindo do meio da fachada e indo para a vidraça. A fachada nunca deixa borda vazia.
- A recepção (`recepcao.webp`) aparece só dentro da vidraça (`clip-path` que acompanha o vidro na tela) e cresce mais devagar que a fachada, como algo que está atrás do vidro. Um reflexo passa pelo vidro e some quando a câmera atravessa. Não há corte nem flash: quando o vidro passa das bordas, a recepção já ocupa a tela toda.
- Do lado de dentro, o letreiro da marca brilha no ripado de madeira e entra o "Seja bem-vindo". A seção do dentista sobe como um arco de porta.
- Em pé (celular), a fachada aparece inteira na largura sobre uma cópia desfocada dela mesma, e a recepção se enquadra no balcão e no letreiro.
- **Trocar a fachada**: substituir `fachada.webp` e medir de novo a vidraça em pixels da foto (`VID` no topo do bloco ENTRADA em `app.js`, com `IMG` do tamanho da foto). A recepção usa `REC` com o tamanho de `recepcao.webp`; a posição do letreiro interno fica em `.placa` no `style.css`.

## Seções

- **Fachada e entrada** com a chamada "Um novo conceito em odontologia." e o indicador de rolagem em arco de porta
- **A dentista**: retrato, nome, especialidade, registro no CRO, formação em linha do tempo, experiência e filosofia
- **A diferença** (fundo escuro): foto da consulta com o cartão de números que contam de novo a cada volta (`diferenca.numeros`), título, texto e os diferenciais com ícones desenhados para a marca
- **Tratamentos**: cartões em duas colunas desencontradas. Clareamento, lentes de contato e odontologia estética têm **antes e depois arrastável** (mouse, dedo ou setas do teclado; a linha balança ao entrar na tela até a pessoa mexer). Os outros têm foto. Cada cartão leva ao agendamento no WhatsApp
- **Estrutura e experiência**: galeria que corre de lado enquanto a página desce (fixada pelo ScrollTrigger), e a primeira visita em linha do tempo
- **Avaliações**: carrossel com foto, nome, tratamento e nota, setas, barra de progresso e passagem automática que para quando a pessoa interage; abaixo, nota do Google e regra para casos clínicos
- **Dúvidas frequentes** em sanfona (`faq` no `content.js`)
- **Contato e agendamento**: endereço, WhatsApp, telefone, horários e formulário que abre o pedido pronto no WhatsApp, com consentimento da LGPD
- **Rodapé** com o mapa padrão `.map-box` do OpenStreetMap, "Onde atendemos", contatos, redes, responsável técnico, razão social e créditos das imagens

A página se monta conforme a rolagem e se desfaz ao voltar (descendo e subindo), como pedem as diretrizes dos modelos Gold. Com `prefers-reduced-motion`, a fachada fica parada e tudo aparece sem movimento.

## Dados de demonstração

Dentista (Dra. Marina Albuquerque, CRO-SP 98.765; foto enviada pelo cliente), endereço (Alameda Lorena, Jardim Paulista, São Paulo), telefones, e-mail e CNPJ são fictícios. Para um cliente real, copiar para `clientes/<cliente>/` e trocar em `content.js`, junto com as fotos da equipe e dos ambientes (mesmos nomes de arquivo).

**Antes de publicar para um cliente, trocar obrigatoriamente:**
- **Antes e depois** (`ad-*-antes.webp` / `ad-*-depois.webp`): o "depois" é foto do Unsplash e o "antes" foi escurecido digitalmente só nos dentes. Cada um traz o selo "Simulação ilustrativa". Na clínica, entram só casos reais com termo de autorização assinado (Código de Ética Odontológica).
- **Avaliações** (`avaliacoes` e `av-*.webp`): nomes e textos são de exemplo; as fotos são retratos do Unsplash de pessoas que não são pacientes. Trocar por depoimentos reais com autorização por escrito e, se a pessoa não quiser foto, usar outra imagem.
