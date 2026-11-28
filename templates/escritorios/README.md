# Escritórios

Categoria dos escritórios de profissionais com conselho de classe: advocacia (OAB) e contabilidade (CRC). Aberta em 2026-11-27 com o primeiro modelo de advocacia; o primeiro de contabilidade veio no mesmo dia.

- **Ortiva Premium**: Ortiva Contabilidade (marca de demonstração), em Curitiba. Premium de 5 páginas: início, o escritório, profissionais, serviços (com simulador de regime e agendamento) e conteúdos. Referência enviada pelo cliente (site Nexo feito no Figma Make: tinta verde-petróleo, lima elétrica, títulos enormes, painel financeiro), refeita com marca, textos e composição próprios. Detalhes na seção da Ortiva, no fim.
- **Vilela Standard**: Vilela Rocha Advocacia (marca de demonstração), em Salvador. Standard de 4 páginas (o "Standard 2" do briefing): início, o escritório e a equipe, áreas de atuação e conteúdos. Desenho a partir de referências enviadas pelo cliente (site da ABS Advocacia: marinho, névoa e lima pálida, arcos, equipe em abas e blog filtrado), refeito com marca, textos e composição próprios.

| Pasta | O que é |
|---|---|
| `_build-vilela-standard/` | Código-fonte e conteúdo (`content.js`, `icons.js`, `style.css`, `app.js`, `build.js`, `gerar-mapa.js`, `preparar-imagens.js`, fotos e créditos) |
| `standard/vilela-standard/` | **Site pronto**, com `404.html`, `sitemap.xml` e `robots.txt` |
| `_build-ortiva-premium/` | Código-fonte e conteúdo da Ortiva (mesmos arquivos do Vilela) |
| `premium/ortiva-premium/` | **Site pronto** da Ortiva, com `404.html`, `sitemap.xml` e `robots.txt` |

## Gerar

```bash
node templates/escritorios/_build-vilela-standard/build.js
node templates/escritorios/_build-ortiva-premium/build.js
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

## Ortiva Premium: Ortiva Contabilidade

Verde-petróleo de tinta `#0B1C1F`, papel `#F4F5EF` e lima elétrica `#CBF24B`; fontes Host Grotesk (títulos enormes com espaçamento apertado e texto) e Azeret Mono (números e textos de apoio). O nome vem de orto, que quer dizer reto, e o desenho da marca é o prumo, o fio com um peso na ponta que mostra se uma parede está reta: aparece no emblema, no carregando, na cortina entre páginas, no seletor de tema, na linha do tempo, nos controles do simulador e na 404. Sem biblioteca: tudo em `app.js`.

### Páginas

- **Início** (`index.html`): capa escura com o título que sobe linha a linha e o botão redondo magnético; a foto se abre até a borda com a rolagem e traz a **agenda fiscal ao vivo** (os três próximos vencimentos gerais, contados a partir de hoje); faixa lima que corre no sentido da rolagem; **seis frentes numa faixa horizontal guiada pela rolagem** (no celular, faixa de lado com dedo, setas ou arraste do mouse); visão com números que contam de novo ao voltar; **painel com gráfico de barras em 3D** (CSS 3D, cresce e encolhe com a rolagem e gira com o mouse, dados fictícios); chamada do simulador; como funciona (o peso do prumo desce pela linha do tempo); **equipe em leque** que se abre com a rolagem; **depoimentos em pilha de cartas** (arrastar ou setas); conteúdos em colagem; chamada final; contato.
- **O escritório** (`escritorio.html`): frase que acende palavra por palavra, quem somos, valores em fichas inclinadas, **carrossel**, **galeria por categoria** com foto ampliada, faixa de Curitiba com paralaxe, **Instagram** e **políticas** em abas (atendimento, honorários, confidencialidade, agendamento e cancelamento, e prazos fiscais em destaque).
- **Profissionais** (`profissionais.html`): nomes grandes com a foto que segue o mouse e o perfil de cada contador (CRC, frentes, formação, desde quando, dias de atendimento, "Agendar com"), com índice que acompanha a leitura e foto que inclina com o mouse.
- **Serviços** (`servicos.html`): **serviços por frente** em fichas com filtro (para quem, o que inclui, prazo, responsável, honorários em proposta), condições que valem para todos, como funciona, **simulador de enquadramento tributário**, **agendamento** (frente, contador, formato, dia e **horários livres** de meia em meia hora), **FAQ** e contato. `servicos.html#fiscal` abre já filtrado; `servicos.html?prof=laura#agendar` abre com a contadora escolhida.
- **Conteúdos** (`conteudos.html`): filtro por frente, destaque, "Ver mais", artigo em janela com autor, CRC, data e aviso de conteúdo informativo, e a carta mensal por e-mail.
- **404**: o zero é o prumo balançando. "Esta página saiu do alinhamento."

### Camada Premium

Carregando (uma vez por visita, `ortiva-cg`: o fio desce, o peso balança até assentar, o contador vai a 100 e a tela sobe com uma faixa lima); cortina lima com o prumo entre as páginas (`ortiva-troca`); cursor próprio só no computador (anel e peso; com uma janela aberta volta o cursor do sistema; com a palavra "Ver", "Agendar", "Arrastar", "Girar" ou "Ler" sobre o que dá para fazer); botões com barras de gráfico que sobem no hover e texto que rola, magnéticos (`data-magnetic`); títulos palavra por palavra e fotos por máscara, que se desfazem e se refazem nos dois sentidos; **rolagem com direção** (`--p` e `--q`, `data-rolagem` no `<html>`); topo que some descendo e volta subindo. Com `prefers-reduced-motion`, tudo parado e visível.

### Tema claro e escuro

Botão novo em `templates/_comum/tema-prumo.js`: um prumo entre o sol e a lua, que pende para o lado do tema escolhido e chega com mola. Reaproveita o script do `<head>` e os desenhos do sol e da lua do `tema-balanca.js`. No computador (acima de 1024px) fica na lateral direita; no celular e no tablet vira dois botões compactos, Claro e Escuro, dentro do menu (`T.compacto`). Guarda em `localStorage` (`ortiva-tema`); padrão claro. Capas, painel, rodapé e chamadas ficam escuros nos dois temas.

### Simulador de enquadramento

Atividade (comércio, indústria, serviços, serviços intelectuais), faturamento de 12 meses, folha com pró-labore e margem. Calcula o Simples pelas tabelas da LC 123/2006 (Anexos I, II, III e V, com Fator R), o Presumido (presunção de 8% e 12% ou 32%, PIS e Cofins cumulativos) e o Real (sobre a margem, PIS e Cofins com créditos estimados), mais ISS de 3% em serviços e contribuição patronal de 27,8% fora do Simples. ICMS fica fora da comparação. As premissas aparecem na página, o resultado diz "a menor estimativa neste cenário" e nunca fala em economia. Nada sai do navegador. Atualizar as tabelas quando a lei mudar e incluir IBS e CBS quando a transição pesar no cálculo (a partir de 2027).

### Regras do CFC aplicadas (validar na revisão jurídica)

O Código de Ética Profissional do Contador (NBC PG 01) e as normas do CFC pedem publicidade sóbria, com o registro no CRC, sem aviltamento de honorários, sem concorrência desleal e sem promessa de resultado. Por isso este modelo **foge de propósito** de dois itens do padrão:

- **Valor ou "a partir de" e condições de pagamento** nos cards: trocados por "Proposta por escrito após o diagnóstico", com a explicação nas condições e na política de honorários. Se a revisão jurídica liberar uma faixa de referência, ela entra no `content.js`.
- **Depoimentos**: só sobre a forma de atendimento, nunca sobre economia ou resultado, com aviso na página. Para tirar a seção, `depoimentos.mostrar: false` no `content.js`.

Também: registro da organização contábil e da responsável técnica no rodapé; CRC de cada profissional nos perfis, no agendamento e nos artigos; números do escritório só sobre a estrutura; nada de "economia média" nem "redução garantida"; conteúdos com data e aviso de que são informativos.

### Dados de demonstração

Marca, profissionais, números de CRC, registro da organização contábil, endereço (Av. do Batel, Curitiba), telefones, e-mail, domínio, perfis, depoimentos e o CNPJ `00.000.000/0001-00` são fictícios e estão marcados com `[EXEMPLO]` no `content.js`. Os artigos citam regras vigentes em novembro de 2026 (reforma tributária, limite do MEI, Lei 15.270/2025): revisar antes de usar com um cliente. Fotos do Unsplash, com crédito em `_build-ortiva-premium/img/creditos.json` e no rodapé; os retratos são de banco de imagens e não são contadores reais. Fotos e mapa se refazem como no Vilela (`preparar-imagens.js` e `gerar-mapa.js petroleo img/mapa_batel.webp`).
