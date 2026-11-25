# Barbearia (marca de demonstração: Mecha Barbearia)

Nicho só de barbearia, separado de [salões de beleza](../saloes/). No Mecha Standard, a marca é o lado barbearia da Mecha (mesmo símbolo, endereço, CNPJ, telefone e redes, e-mail barbearia@mechasalao.com.br), descrita em [../Salões de Beleza/MARCA.md](../Sal%C3%B5es%20de%20Beleza/MARCA.md).

| Modelo | Pasta | Gerar |
|---|---|---|
| Mecha Standard: landing page de uma página no desenho da referência Salona, escura e areia, com tema claro/escuro | [standard/mecha-standard/](standard/mecha-standard/) | `node templates/barbearia/_build-mecha-standard/build.js` |
| Cobre Standard Barbearia: duas páginas (início e equipe), grafite e cobre da referência Barbor, seções animadas, agendamento com serviço, barbeiro, data e horário, tema claro/escuro (marca própria Cobre, não usa a Mecha) | [standard/cobre-standard/](standard/cobre-standard/) | `node templates/barbearia/_build-cobre-standard/build.js` |
| Pente Fino Premium: barbearia premium escura, cadeira 3D sob o foco, agendamento em quatro passos, Área do cliente (marca própria Pente Fino, não usa a Mecha) | [premium/pente-fino-premium/](premium/pente-fino-premium/) | em `_build-pente-fino-premium/`: `npm install` e depois `npm run catalogo` |

## Mecha Standard

- `_build-mecha-standard/content.js`: marca, contatos, horários, serviços com preço e tempo, barbeiros e agenda, depoimentos, políticas.
- `_build-mecha-standard/build.js`: gera `standard/mecha-standard/` (index.html, assets/site.css, assets/site.js, fotos usadas, mapa, robots e sitemap).
- `_build-mecha-standard/style.css`, `app.js`: desenho e interação. O botão de tema vem de `../_comum/tema-pilula.js` (chave `mecha-barbearia-tema`).
- `_build-mecha-standard/icons.js`: desenhos próprios da barbearia; `icons-mecha.js` é a cópia do símbolo e dos ícones da Mecha (vinda do Mecha Premium do nicho salões), para a pasta não depender do outro nicho.
- `_build-mecha-standard/img/`: todas as fotos, o mapa e `creditos.json`. As fotos dos barbeiros e a da barba com tesoura são imagens de referência enviadas: confirmar a licença antes de publicar.

Seções: capa escura com retrato, sobre com três fotos em paralaxe, serviços com foto presa, avaliações com colunas de fotos, cartão de agendamento, equipe com selo girando e agenda por barbeiro (Google Agenda e .ics), foto larga que cresce com frase corrida, políticas e higiene, rodapé claro com mapa. Textos de políticas a validar na revisão jurídica.

## Cobre Standard Barbearia

Referência de desenho: https://barbor.framer.website/ (Framer). Aproveitadas as cores (grafite #111111, superfície #181818, branco e cobre #F0AD73), o clima escuro e a ordem das seções (sobre, serviços, equipe, depoimentos, planos, galeria, dúvidas, chamada final). Nada do texto ou das imagens da referência foi copiado; a fonte dela (DM Sans) é proibida nas diretrizes, então o Cobre Standard usa **Antonio** nos títulos e **Rethink Sans** no texto. Marca fictícia **Cobre Barbearia**, Alameda Dom Pedro II, Batel, Curitiba.

- `_build-cobre-standard/content.js`: marca, horários, segmentos e serviços com preço e tempo, pacotes, equipe com agenda e serviços de cada barbeiro, depoimentos, galeria por categoria, posts do Instagram, dúvidas, bairros e o texto alternativo de cada foto. `[EXEMPLO]` = trocar pelo cliente, `[JURÍDICO]` = revisão jurídica.
- `_build-cobre-standard/build.js`: gera `standard/cobre-standard/index.html`, `standard/cobre-standard/equipe.html`, `assets/site.css`, `assets/site.js`, as fotos usadas, o mapa, robots e sitemap.
- `_build-cobre-standard/style.css`, `app.js`, `icons.js`: desenho, interação e ícones próprios (símbolo de losango com navalha em C). Tema pela `../_comum/tema-pilula.js` (chave `cobre-barbearia-tema`), com a pílula escura no modo noturno (ajuste só neste modelo, no fim do `style.css`); escuro é o padrão, `?tema=claro` abre no claro.
- `_build-cobre-standard/img/fotos/`: 45 fotos reais do Unsplash e do Pexels (fotógrafos, não geradas por IA, todas coloridas), nenhuma repetida do Mecha Standard. Créditos em `img/creditos.json` e no rodapé. Para cliente real, trocar pelas fotos do espaço e da equipe mantendo os nomes dos arquivos.
- `_build-cobre-standard/gerar-mapa.js`: mapa do OpenStreetMap em grafite e cobre (`NODE_PATH=<pasta com sharp> node gerar-mapa.js cobre img/mapa_batel.webp`, dentro de `_build-cobre-standard/`).

**Tela de carregando:** o símbolo da Cobre se desenha, o número sobe de 0 a 100 conforme as fotos da capa e as fontes carregam, uma navalha corre na linha cobre do meio ("Afiando a navalha", "Esquentando a toalha", "Ajeitando a cadeira") e no fim a tela se abre em duas metades a partir da linha, como um corte. Na primeira visita leva cerca de 2 s; nas páginas seguintes da mesma visita, menos de 1 s. Nunca passa de 8 s, e some sozinha se o script falhar.

**Início:** capa com carrossel de três fotos (cabelo, barba e sobrancelha, em `capaSlides` no `content.js`) que trocam a cada 6 s num corte diagonal, com barras de progresso clicáveis; relógio de Curitiba ao vivo e "aberto agora" calculado pelo horário; faixa corrida em cobre; sobre com fotos que se revelam por máscara, selo girando e contadores; **serviços em cartões por segmento** (Cabelo, Barba, Sobrancelha e acabamento, Infantil) em abas, todos com foto com marcador que desliza; pacotes no formato de planos; prévia da equipe (foto que aproxima ao passar o mouse); **galeria por categoria** com filtro e ampliação com setas; **depoimentos** em carrossel com arraste e passagem automática; **Instagram incorporado** (cabeçalho do perfil e 6 posts com curtidas e legenda, todos levando ao perfil); **agendamento** e **dúvidas** em sanfona animada; chamada final; rodapé com o mapa padrão `.map-box`, "Onde atendemos", horário com o dia de hoje em destaque, textos legais e cookies.

**Equipe (`equipe.html`):** perfil de cada barbeiro com foto, frase, história, anos de profissão, dias e horários da semana, serviços que atende com preço, três trabalhos e botão "Agendar com" que abre o agendamento já com o barbeiro escolhido (`index.html?barbeiro=otavio#agendar`). Fecha com "Como a equipe trabalha".

**Agendamento:** escolhe o serviço (com risco opcional nos cortes), o barbeiro (só aparecem os que fazem aquele serviço; "Sem preferência" pega o primeiro livre), a data (14 dias, sem os dias de folga do barbeiro) e o horário livre conforme a duração. O resumo mostra duração e total na hora. O pedido abre no WhatsApp com tudo preenchido e depois oferece Google Agenda e `.ics`. A ocupação dos horários é simulada (fixa por data e hora) até ligar uma agenda de verdade. Os botões "Agendar" dos serviços e pacotes já selecionam o serviço; `?servico=degrade` também.

Tudo é demonstração: marca, CNPJ, endereço, barbeiros, preços, nota, depoimentos e números do Instagram.

## Pente Fino Premium (barbearia premium)

Modelo da biblioteca ProfitizeBuild (template "Pente Fino"), montado como a demo, sem mudanças no código. Marca fictícia **Pente Fino**: "Você escolhe o corte. A gente passa o pente fino." Preto e osso, sem cor de acento; a cor vem só do cromo e do couro da cadeira.

- **Stack:** Vite sem framework, Three.js, GSAP com ScrollTrigger e Lenis. Código em `_build-pente-fino-premium/src/`, textos em `_build-pente-fino-premium/index.html`, imagens, fonte e modelo 3D em `_build-pente-fino-premium/public/`.
- **Gerar:** em `_build-pente-fino-premium/`, `npm install` e depois `npm run catalogo` (grava em `premium/pente-fino-premium/`, com `base: './'`, e abre em qualquer subpasta). `npm run dev` para editar.
- **Guia completo:** `_build-pente-fino-premium/CLAUDE.md` (arquitetura, regras do 3D, do movimento e do celular, e como personalizar). Os prints de referência de cada cena estão em `_build-pente-fino-premium/arquivos/conceito/` e os prompts das imagens em `arquivos/receitas/`.
- **Cenas:** abertura com o pente atravessando o cabelo em macro; cadeira 3D que gira e some numa névoa clara; cardápio #0 a #6 com a ferramenta seguindo o mouse; manifesto com relógio, lata de pomada e borrifador em 3D; quatro espelhos (um por barbeiro); cortes que viram de costas; clube; bancada de produtos; vale-presente de metal; nota 4,9; mapa em SVG; dúvidas; fecho com o próximo horário livre; gaveta de agendamento em quatro passos com `.ics`.
- **Parâmetros:** `?tema=vinho` ou `?tema=conhaque` troca o couro da cadeira; `?hora=14:20` simula a hora.
- **Fotos coloridas** (Unsplash, as mesmas do Mecha Premium do nicho salões Mecha em `../saloes/_build-mecha-premium/img/fotos/`, recortadas por `_build-pente-fino-premium/preparar-fotos.mjs`), com créditos no rodapé. Os cortes mostram "Ver na cadeira" (o corte sendo feito) no lugar de "de costas". Duas fotos de produto (shampoo e kit) têm rótulos de marcas reais: trocar antes de usar com cliente.
- **Mapa** no padrão dos outros modelos: OpenStreetMap recolorido em escuro (`_build-pente-fino-premium/gerar-mapa.cjs`), pino, cartão com "Abrir no mapa" e "Como chegar". Ponto de exemplo em Botafogo, Rio de Janeiro.
- **Área do cliente:** `cliente.html` (login com as credenciais de demonstração já preenchidas: dono@pentefino.com.br / pentefino123), `cadastro.html` (cadastro do dono) e `painel.html` (serviços, barbeiros, produtos, loja e horário). Cada serviço, barbeiro e produto pode ficar visível ou arquivado, ser editado, excluído ou mudar de ordem, e o site segue na hora. Os dados ficam no navegador (demonstração); detalhes em `_build-pente-fino-premium/CLAUDE.md`.
- **Tudo é demonstração:** fotos dos barbeiros, cortes e produtos, preços, nota, depoimentos, endereço, o pagamento do sinal (não cobra nada) e o login da Área do cliente (sem servidor). A cadeira 3D é "Barber Chair", de sweedboy69 (CC BY 4.0), com crédito no rodapé.
