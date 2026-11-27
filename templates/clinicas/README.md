# Clínicas

Categoria dos modelos de saúde com consultório: odontologia e nutrição. Os modelos de dentista vieram de `templates/dentista/` em 2026-11-27, sem mudar nada no conteúdo.

- **Salvi Premium** (nutrição): portfólio da nutricionista Bruna Salvi e da clínica Salvi Nutrição, em Florianópolis (marca de demonstração), com Área do Cliente. Referências do pedido: [Curitiba Nutrição](https://curitibanutricao.com.br/), [Juliana Pappi](https://julianapappinutricionista.com.br/), [Vittória Martineli](https://vittoriamartineli.com.br/) e [Zavia Clinic](https://zaviaclinic.com.br/). Detalhes em "Salvi Premium" abaixo.

- **Lume Standard**: Lume Odontologia (marca de demonstração), inspirado nas referências [Elan Dental](https://elandental.framer.website/) e [Curevanta](https://curevanta.framer.website/). Detalhes em "Lume Standard" abaixo.
- **Raiz Standard**: Raiz Odontologia (marca de demonstração), no desenho da referência [Aveline](https://aveline-visuvate.framer.website/). Detalhes em "Raiz Standard" abaixo.
- **Sorrisus Premium**: Sorrisus Prime (Odontologia Avançada), a partir da fachada enviada pelo cliente.

| Pasta | O que é |
|---|---|
| `_build-salvi-premium/` | Código-fonte e conteúdo do Salvi Premium (`content.js`, `icons.js`, `style.css`, `app.js`, `build.js`, `gerar-mapa.js`, fotos e créditos) |
| `premium/salvi-premium/` | **Salvi Premium pronto**, com `404.html`, `sitemap.xml` e `robots.txt` |
| `_build-sorrisus-premium/` | Código-fonte e conteúdo do Sorrisus Premium |
| `_build-sorrisus-premium/content.js` | Todos os textos e dados: marca, dentista, tratamentos, ambientes, horários e bairros |
| `_build-sorrisus-premium/img/fotos/` | Fotos em WebP. `fachada.webp` e `dentista.webp` são imagens do cliente; as outras são do Unsplash (licença livre), com crédito em `img/creditos.json`, que também aparece no rodapé |
| `_build-sorrisus-premium/vendor/` | GSAP 3.12.5 e ScrollTrigger, copiados para o site (abre sem internet e sem CDN) |
| `premium/sorrisus-premium/` | **Site pronto** (abrir o `index.html` no navegador) |
| `_build-raiz-standard/` | Código-fonte e conteúdo do Raiz Standard (`content.js`, `style.css`, `app.js`, `build.js`, `gerar-mapa.js`) |
| `standard/raiz-standard/` | **Raiz Standard pronto**, com `404.html` |
| `_build-lume-standard/` | Código-fonte e conteúdo do Lume Standard (`content.js`, `style.css`, `app.js`, `build.js`, `gerar-mapa.js`) |
| `standard/lume-standard/` | **Lume Standard pronto**, com `404.html` |

## Gerar

```bash
node templates/clinicas/_build-salvi-premium/build.js
node templates/clinicas/_build-sorrisus-premium/build.js
node templates/clinicas/_build-raiz-standard/build.js
node templates/clinicas/_build-lume-standard/build.js
```

O mapa só precisa ser gerado de novo se o endereço mudar (sharp instalado fora do projeto; apagar a pasta `tiles/` depois):

```bash
NODE_PATH=<pasta com node_modules/sharp> node gerar-mapa.js champanhe img/mapa_jardins.webp   # dentro de _build-sorrisus-premium/
```

## Sorrisus Premium: a entrada pela porta

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

## Extras

- **Carregando** (uma vez por visita, `sessionStorage` `sorrisus-cg`): o dente da marca se desenha, o nome surge e a barra acompanha o carregamento da fachada, da recepção e das fontes (mínimo de 2,2 s, máximo de 7 s). Depois, o texto some, uma fresta de luz acende bem no meio da tela e as duas folhas de vidro se abrem a partir dela, revelando a fachada; a animação do título só começa nessa hora.
- **Cursor** (só com mouse): anel dourado com ponto. Sobre links e botões, o anel vira o dente da marca; sobre o antes e depois e o carrossel aparece "Arraste"; sobre a fachada e a galeria, "Role". Fica champanhe nas áreas escuras. O carrossel também pode ser puxado com o mouse.
- **Tema claro e escuro**: o botão é o pendente cúbico da recepção pendurado no topo. Ao clicar, a cordinha é puxada, a luminária balança e a luz (ou a noite) se espalha a partir dela pela página (View Transitions). Guarda a escolha em `localStorage` (`sorrisus-tema`); sem escolha, segue o sistema. Cores do tema escuro no fim do `style.css`. Textos sobre foto e sobre seções escuras usam `--claro`, que não muda com o tema.
- **404** (`premium/sorrisus-premium/404.html`, gerada pelo build): página em um arquivo só (funciona em qualquer endereço, inclusive no Firebase). O zero do "404" é o dente da marca, que se desenha e balança dentro de um arco de porta: "Esta porta não abre." Botões para voltar à recepção e para o WhatsApp, e o mesmo tema escolhido no site.

A página se monta conforme a rolagem e se desfaz ao voltar (descendo e subindo), como pedem as diretrizes dos modelos Premium. Com `prefers-reduced-motion`, a fachada fica parada e tudo aparece sem movimento.

## Dados de demonstração

Dentista (Dra. Marina Albuquerque, CRO-SP 98.765; foto enviada pelo cliente), endereço (Alameda Lorena, Jardim Paulista, São Paulo), telefones, e-mail e CNPJ são fictícios. Para um cliente real, copiar para `clientes/<cliente>/` e trocar em `content.js`, junto com as fotos da equipe e dos ambientes (mesmos nomes de arquivo).

**Antes de publicar para um cliente, trocar obrigatoriamente:**
- **Antes e depois** (`ad-*-antes.webp` / `ad-*-depois.webp`): o "depois" é foto do Unsplash e o "antes" foi escurecido digitalmente só nos dentes. Cada um traz o selo "Simulação ilustrativa". Na clínica, entram só casos reais com termo de autorização assinado (Código de Ética Odontológica).
- **Avaliações** (`avaliacoes` e `av-*.webp`): nomes e textos são de exemplo; as fotos são retratos do Unsplash de pessoas que não são pacientes. Trocar por depoimentos reais com autorização por escrito e, se a pessoa não quiser foto, usar outra imagem.

## Raiz Standard: Raiz Odontologia

Desenho da referência Aveline (névoa de sálvia, azul-petróleo e menta), com fontes Geologica, Mona Sans e Azeret Mono. Sem biblioteca: tudo em `app.js`.

- **Hero emoldurado** com carrossel de quatro fotos (troca sozinha, setas, barras de progresso, arrastar no celular, pausa no mouse). Cada foto apresenta um profissional no cartão do canto, que leva à equipe já com ele escolhido. Chips dos tratamentos abrem a ficha de cada um.
- **Topo** com "Aberto agora, até 19h" calculado pelo horário do `content.js`, botão de tema e menu de celular.
- **Jornada** (avaliação, plano, tratamento, manutenção) numa linha que se preenche; **frase** que se escreve na rolagem; **números** que contam.
- **Tratamentos** em trilho (setas, arrastar com o mouse); cada cartão abre uma janela com descrição, indicação, o que inclui e WhatsApp.
- **Painel de cuidado**: agendamento rápido (consulta, próximos dias de atendimento e período, envia pelo WhatsApp), exemplo de plano de alinhadores, exemplo de orçamento por escrito e cartão "A cada 6 meses" com a arcada desenhada em SVG.
- **Equipe**: lista de quatro profissionais que troca foto, CRO, bio e dados (passar o mouse, clicar ou setas do teclado).
- **Antes e depois** arrastável com abas (clareamento, lentes, estética); a linha balança ao aparecer.
- **A clínica**: itens com ícones próprios, foto com cartão de dados e agenda do dia, e galeria com foto ampliada.
- **Avaliações** em carrossel, **blog** com artigos em janela, **FAQ** em sanfona.
- **Formulário** (nome, WhatsApp com máscara, e-mail, tratamento, período, mensagem, LGPD) com validação; ao enviar mostra a confirmação e abre o WhatsApp com tudo preenchido.
- **Rodapé** com novidades por e-mail (só confirma na tela), colunas, mapa padrão `.map-box` do OpenStreetMap (`mapa_batel.webp`, tema `petroleo` no `gerar-mapa.js`), "Onde atendemos" e a marca gigante.
- **Tema claro e escuro**: botão com o dente que brilha (claro) e ganha uma lua (escuro); o novo tema se abre em círculo a partir do botão (View Transitions). Guarda em `localStorage` (`raiz-tema`); sem escolha, segue o sistema.
- **404** (`standard/raiz-standard/404.html`, arquivo único): a arcada perdeu um dente, que flutua acima do vão. "Esta página foi extraída."

**Dados de demonstração do Raiz Standard** (trocar para cliente real): marca, equipe e CROs, endereço (Rua Francisco Rocha, Batel, Curitiba), telefones, CNPJ, números da seção "Sobre", nota 4,9 do Google, exemplo de alinhadores e de orçamento (valores marcados como exemplo), depoimentos (fotos e textos de exemplo, aviso na página) e o antes e depois (simulação ilustrativa, mesmas imagens do Sorrisus Premium). Fotos do Unsplash com crédito em `_build-raiz-standard/img/creditos.json`, também no rodapé.

## Lume Standard: Lume Odontologia

Leve, sofisticado e direto: uma página só, sem biblioteca (HTML de cerca de 44 KB; o site inteiro, com as fotos, 2,4 MB). Linho, argila e pêssego, com seções escuras em café; fontes Petrona (títulos, com itálico na segunda linha) e Libre Franklin. Desenho inspirado na Elan Dental (creme, serifa elegante, mosaico de tratamentos, antes e depois, dúvidas em cartões) e na Curevanta (muitas fotos em cartões, equipe com foto e especialidade, seção escura).

- **Topo flutuante** translúcido com o logo (o dente da marca com a luz acesa), menu, botão de tema e "Agendar"; vira menu de celular abaixo de 1100px.
- **Hero** com a foto da consulta à direita fundida no linho, título em duas linhas, botão do WhatsApp e cartão com "Aberto agora, até 19h" (calculado pelo horário do `content.js`), garantias e endereço.
- **Tratamentos** em mosaico: clareamento em destaque com o texto sobre a foto, cartões com foto, prazo e descrição, dois cartões largos (o último em pêssego). Cada um abre o WhatsApp com a mensagem do tratamento.
- **Resultados**: antes e depois arrastável (mouse, dedo ou teclado) com abas e ficha do caso. A linha balança uma vez ao aparecer.
- **Procedimentos**: lista com duração e como fica depois; a foto ao lado troca conforme o item (no celular, cada item tem a miniatura).
- **Equipe**: quatro profissionais com foto, especialidade, CRO e uma frase.
- **A clínica** (seção escura): texto, diferenciais, duas fotos e uma faixa de fotos que corre devagar (para com o mouse em cima).
- **Dúvidas** em sanfona com foto; **agendamento** com cartão escuro de contato e formulário (nome, WhatsApp com máscara, tratamento, período, mensagem, LGPD) que abre o WhatsApp com tudo preenchido.
- **Rodapé** escuro com o mapa padrão `.map-box` do OpenStreetMap (`mapa_savassi.webp`, tema `argila` no `gerar-mapa.js`), "Onde atendemos" e a marca gigante.
- **WhatsApp fixo** no canto, que aparece depois do hero.
- **Tema claro e escuro**: o dente do botão perde a luz e ganha uma lua; o novo tema se abre em círculo a partir do botão (View Transitions). Guarda em `localStorage` (`lume-tema`); sem escolha, segue o sistema.
- **Animações leves**: entrada do hero, blocos que sobem uma vez ao aparecer, zoom suave nas fotos e a faixa da clínica. Com `prefers-reduced-motion`, tudo fica parado.
- **404** (`standard/lume-standard/404.html`, arquivo único): o zero é o dente da marca com a luz piscando. "A luz não chegou até aqui."

**Dados de demonstração do Lume Standard** (trocar para cliente real): marca, equipe e CROs, endereço (Rua Paraíba, Savassi, Belo Horizonte), telefones, CNPJ e o antes e depois (simulação ilustrativa, mesmas imagens do Raiz Standard e do Sorrisus Premium, com aviso na página). Fotos do Unsplash com crédito em `_build-lume-standard/img/creditos.json`, também no rodapé.

## Salvi Premium: Salvi Nutrição

Pedido de 2026-11-27: Premium de nutrição como portfólio de profissional, com site dinâmico e seções animadas, agendamento online com horários livres por profissional, convênios com busca, tour virtual da clínica, blog de saúde, avaliações do Google integradas, SEO local avançado e Área do Cliente. Tem todo o padrão Standard e a camada Premium do DIRETRIZES-SITES.md.

Marca de demonstração **Salvi Nutrição** (folha de sálvia dentro de um prato), Rua Lauro Linhares, Trindade, Florianópolis. Paleta creme de aveia #F4EEE4, sálvia #6F8A65, papaia #C4582F, figo #4A2333; seções escuras em verde-mata #1D2A1F. Fontes Young Serif e Be Vietnam Pro. Sem biblioteca.

### Páginas

- **Início** (`index.html`): capa com o retrato da Bruna num prato com texto que gira e o próximo horário livre dela calculado pela agenda; portfólio (bio, frase, números que contam, formação em linha do tempo); **método** em cena presa na tela, em que o prato se colore em quatro tempos conforme a rolagem; especialidades em abas com cartões de receita (inclui, duração, valor, onde, quem atende) e pagamento, cancelamento e convênio; carrossel de bastidores; **tour virtual**; equipe em leque; **agendamento**; **convênios**; **avaliações do Google**; blog; galeria por categoria com foto ampliada; Instagram; dúvidas; combinados da consulta; contato.
- **Equipe** (`equipe.html`): as quatro nutricionistas com CRN, bio, especialidades, formação, dias de agenda, próximo horário e botão que abre a agenda já com a profissional (`index.html?prof=diego#agendar`).
- **Especialidades** (`especialidades/nutricionista-<área>-florianopolis.html`): uma página por área, com a cidade no endereço e no título, para quem é, consultas e valores, quem atende, dúvidas próprias e chamada para a agenda já com o serviço (`?serv=`).
- **Blog** (`blog/index.html` e um arquivo por artigo): filtro por assunto e busca; cada artigo tem autora com CRN, data, tempo de leitura, aviso de conteúdo informativo e chamada para agendar com a autora.
- **Área do cliente** (`area-cliente.html`, fora do sitemap e com noindex): login de demonstração (CPF 123.456.789-09, senha salvi2026, ou "Preencher para mim"), próxima consulta e pedidos feitos no site (com cancelamento), metas da semana, água do dia, plano alimentar com opções por refeição, gráfico da evolução (cintura, massa muscular, energia), diário alimentar, lista de compras e documentos para reembolso.
- **Área da equipe** (na mesma `area-cliente.html`, botão "Sou da equipe"): a nutricionista escolhe o nome e entra com a senha já preenchida (salvi2026). Vê só os próprios pacientes (a Bruna tem Wilson Neander, em Nutrição esportiva, Marina Teixeira, Paulo Mendes e Renata Alves), com busca e "Novo paciente". A ficha tem **Triagem** (objetivo, rotina, atividade, restrições, medicações, exames, sono, água, preferências, observações) e **Plano alimentar**: a profissional escolhe a categoria, aplica o modelo dela (`equipeArea.categorias` no `content.js`: esportiva, emagrecimento e comportamento, gestação, infantil, intestino, saúde da mulher) e ajusta refeições, horários, opções, orientações e metas para aquele paciente. **Baixar plano de <nome>** gera no navegador, sem biblioteca, um PDF A4 com a marca, os dados da consulta, o objetivo, os cuidados, as refeições, as orientações, as metas, a assinatura com CRN e o rodapé numerado (`plano-alimentar-<nome>.pdf`). O plano salvo para a Marina é o mesmo que ela vê no lado do paciente, que também baixa o PDF. Na demonstração tudo fica no navegador (`salvi-planos`, `salvi-triagens`, `salvi-pacientes-novos`); na versão do cliente, esses dados de saúde vão para o sistema da clínica, com login de verdade.
- **404** com o prato vazio e a folha caindo.

### Como funcionam as partes pedidas

- **Agendamento por profissional**: serviço, profissional (só as que fazem aquele serviço), presencial ou online (só nos dias de vídeo de cada uma), dia (21 dias, com a contagem de horários livres) e horário. A agenda de cada profissional fica em `equipe[].agenda` no `content.js`; a ocupação da demonstração é fixa por dia e hora (`sorteio` no `app.js`), e cada pedido feito ocupa o horário no aparelho. O pedido sai pronto no WhatsApp e aparece na Área do cliente. Na versão do cliente, trocar `horarios()` pela consulta à agenda real (Google Agenda, sistema da clínica).
- **Convênios com busca**: busca sem acento e com destaque, setas e Enter, chips de todos os planos, resultado dizendo se é atendimento direto ou reembolso, e plano fora da lista leva ao WhatsApp. A lista em `convenios` é ilustrativa e precisa ser conferida com o cliente.
- **Tour virtual**: cada ambiente é uma foto 2:1 montada num cilindro 3D de 40 fatias em CSS (`--P` é a distância da câmera). Arrastar com inércia, setas do teclado, passeio lento enquanto ninguém mexe, portas dentro da cena e planta baixa clicável com a marca de onde a pessoa está. Trocar ambiente: foto em `img/fotos/tour-<sala>.webp` (2:1) e a entrada em `tour`; `planta` é o retângulo na planta (viewBox 400x260), `liga` são as portas.
- **Avaliações do Google**: placar com nota e total, cartões espalhados na mesa (arrastar), botões "Ver no Google" e "Avaliar". São de demonstração, com aviso na página. Na versão do cliente, entram as avaliações reais do perfil (API do Google Places ou um widget), sem marcação de nota em JSON-LD, que o Google não aceita para a própria empresa.
- **SEO local**: JSON-LD com `MedicalClinic` (endereço, coordenadas, horário, área atendida por bairro, catálogo de consultas com preço), `Person` de cada nutricionista, `FAQPage`, `Service` nas especialidades, `Blog` e `BlogPosting` nos artigos e `BreadcrumbList` nas páginas internas; `canonical`, `hreflang`, Open Graph, `geo.region`, `geo.position` e `ICBM`; `sitemap.xml` com `lastmod` e `robots.txt` que tira a Área do cliente da busca. Trocar `marca.dominio` pelo domínio real.

### Camada Premium

Abertura com a folha que se desenha dentro do prato e uma íris que se abre (uma vez por visita); cursor de ponto e anel que vira folha nos links e mostra a palavra da ação; botões magnéticos com a onda que enche o botão no hover; cortina em forma de prato que cresce do clique entre as páginas; rolagem com direção em todos os blocos, títulos palavra por palavra e fotos por máscara; cartões fora da grade (receitas tortas, leque, mesa de avaliações).

### Cuidados de nutrição

Nada de antes e depois de pacientes (regra do Conselho Federal de Nutricionistas), nada de promessa de resultado, e a medicação é sempre do médico. A bioimpedância e o atendimento de gestantes, crianças e quem usa medicação são os "serviços sensíveis" destacados na política, como a química no salão e o clareamento no dentista.

### Dados de demonstração

CNPJ `00.000.000/0001-00`, CRN, endereço, telefones, preços, convênios, números da profissional e avaliações são fictícios e estão marcados com `[EXEMPLO]` no `content.js`. Fotos do Unsplash, com crédito em `img/creditos.json` e no rodapé; `bruna-rosto.webp` é um recorte de `bruna-retrato.webp` para os avatares. O mapa do rodapé é gerado por `gerar-mapa.js` (tema `salvia`).
