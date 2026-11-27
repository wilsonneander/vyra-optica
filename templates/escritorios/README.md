# Escritórios

Categoria dos escritórios de profissionais com conselho de classe: advocacia (OAB) e, depois, contabilidade (CRC). Aberta em 2026-11-27 com o primeiro modelo de advocacia.

- **Vilela Standard**: Vilela Rocha Advocacia (marca de demonstração), em Salvador. Standard de 4 páginas (o "Standard 2" do briefing): início, o escritório e a equipe, áreas de atuação e conteúdos. Desenho a partir de referências enviadas pelo cliente (site da ABS Advocacia: marinho, névoa e lima pálida, arcos, equipe em abas e blog filtrado), refeito com marca, textos e composição próprios.

| Pasta | O que é |
|---|---|
| `_build-vilela-standard/` | Código-fonte e conteúdo (`content.js`, `icons.js`, `style.css`, `app.js`, `build.js`, `gerar-mapa.js`, `preparar-imagens.js`, fotos e créditos) |
| `standard/vilela-standard/` | **Site pronto**, com `404.html`, `sitemap.xml` e `robots.txt` |

## Gerar

```bash
node templates/escritorios/_build-vilela-standard/build.js
```

Fotos e mapa só precisam ser refeitos se mudarem (sharp instalado fora do projeto):

```bash
NODE_PATH=<pasta com node_modules> node preparar-imagens.js <pasta com os jpg do Unsplash>   # dentro de _build-vilela-standard/
NODE_PATH=<pasta com node_modules> node gerar-mapa.js ardosia img/mapa_caminho-das-arvores.webp   # apagar a pasta tiles/ depois
```

## Vilela Standard: Vilela Rocha Advocacia

Marinho de tinta `#13212C`, névoa `#EEF1F2` e lima pálida `#D6EBB6`; fontes Cormorant Garamond (títulos, com itálico no fim da frase) e Public Sans. Sem biblioteca: tudo em `app.js`. O emblema é uma balança dentro de um arco de portal, e o § aparece como separador e marcador ao longo do site.

### Páginas

- **Início** (`index.html`): capa marinho com o título que sobe linha a linha, foto que se abre em círculo, aro de texto que gira com as áreas separadas por §, três fotos pequenas que flutuam e seguem o mouse, e faixa corrida das áreas; lista das cinco áreas (no computador, a foto da área segue o mouse; no celular, miniatura); **como funciona o atendimento** em linha do tempo que se preenche com a rolagem, mais os três compromissos (sem promessa de resultado, sigilo, honorários por escrito); o escritório com números que contam e **carrossel** (setas, barras de progresso, arrastar, pausa com o mouse); equipe (foto em preto e branco que ganha cor e mostra a frase do advogado); depoimentos sobre o atendimento; três conteúdos; faixa "atendimento em todo o Brasil" por vídeo; contato.
- **O escritório** (`escritorio.html`): capa com arco que se desenha; quem somos com o nome em contorno; valores; frase que acende palavra por palavra; **equipe em abas** (foto, nome, OAB, áreas, bio, formação, dias de atendimento e "Agendar com" que abre o agendamento já com o advogado); **galeria por categoria** com foto ampliada; **Instagram**; **políticas** em abas.
- **Áreas de atuação** (`atuacao.html`): atalhos por área; **serviços em cards por área** com filtro (para quem, o que inclui, primeira reunião, o que levar, honorários) e as condições que valem para todos; como funciona o atendimento; **agendamento** com área, advogado (só quem atende aquela área), formato, dia (dias de agenda de cada um) e horário, com resumo ao lado e envio pelo WhatsApp; **FAQ**; contato. `atuacao.html#familia` abre já filtrado.
- **Conteúdos** (`conteudos.html`): filtro por área, destaque, "Ver mais" e artigo em janela com autor, OAB, data, tempo de leitura e aviso de conteúdo informativo.
- **404**: o zero é o emblema com a balança oscilando. "Esta página saiu da pauta."

### Extras

- **Carregando** (uma vez por visita, `sessionStorage` `vilela-cg`): a balança se desenha, oscila até ficar em equilíbrio, o nome sobe letra a letra e a tela sobe em arco. Mínimo de 2,3 s, máximo de 4,2 s. O título da capa só anima quando o carregando sai.
- **Transição entre páginas**: a cortina marinho com o emblema sobe ao clicar num link interno e sai em arco na página seguinte (`vilela-troca`), sem tela branca.
- **Tema claro e escuro**: botão novo em `templates/_comum/tema-balanca.js`, uma balança com o sol num prato e a lua no outro; o prato do tema escolhido desce com mola. Fica na lateral direita no computador e no topo do celular. Guarda em `localStorage` (`vilela-tema`); padrão claro.
- **Formulário de contato**: nome, e-mail, WhatsApp, assunto (área), canal de retorno, mensagem curta com contador e aviso de sigilo; consentimento LGPD obrigatório. Confirma na tela com protocolo e oferece seguir no WhatsApp **só com nome e assunto**, para que nada sigiloso saia pelo site.
- **Rodapé**: razão social, CNPJ, registro da sociedade, responsável técnica com OAB, endereço, telefone, e-mail, canais de atendimento (telefone, WhatsApp, e-mail, presencial, vídeo), horário com "Aberto agora", mapa padrão `.map-box` do OpenStreetMap (tema `ardosia`), "Onde atendemos" e os links de Termos de prestação de serviço, Termos de uso, Política de privacidade, políticas de atendimento e Preferências de cookies.

### Regras da OAB aplicadas (validar na revisão jurídica)

O Código de Ética e Disciplina e o **Provimento 205/2021** do CFOAB proíbem promessa de resultado, divulgação de valores, gratuidade ou formas de pagamento e captação de clientela. Por isso este modelo **foge de propósito** de dois itens do padrão Standard do DIRETRIZES-SITES.md:

- **Valor ou "a partir de" e condições de pagamento** nos cards: trocados por "Honorários: proposta por escrito após a reunião", com a explicação da regra nas condições e na política de honorários.
- **Depoimentos**: só sobre a forma de atendimento, nunca sobre casos ou resultados, com aviso na página. Muitos conselhos seccionais desaconselham; para tirar a seção, `depoimentos.mostrar: false` no `content.js`.

Também: nome da sociedade com sobrenome de sócios, como exige o Estatuto; nada de "ganhe sua causa", "especialista em vitórias" ou números de processos ganhos; números do escritório só sobre a estrutura (fundação, áreas, equipe, prazo de retorno); conteúdos sempre com aviso de que são informativos.

### Dados de demonstração

Marca, sócios e associados, números de OAB, registro da sociedade, endereço (Av. Tancredo Neves, Caminho das Árvores, Salvador), telefones, e-mail, domínio, perfil do Instagram, depoimentos e o CNPJ `00.000.000/0001-00` são fictícios e estão marcados com `[EXEMPLO]` no `content.js`. Para um cliente real, copiar para `clientes/<cliente>/`, trocar o `content.js` e as fotos da equipe (mesmos nomes de arquivo) e passar os textos pela revisão jurídica. Fotos do Unsplash, com crédito em `_build-vilela-standard/img/creditos.json` e no rodapé; os retratos da equipe são de banco de imagens e não são advogados reais.
