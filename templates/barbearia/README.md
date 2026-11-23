# Barbearia (marca de demonstração: Mecha Barbearia)

Nicho só de barbearia, separado de [Salões de Beleza](../Sal%C3%B5es%20de%20Beleza/). No Bronze, a marca é o lado barbearia da Mecha (mesmo símbolo, endereço, CNPJ, telefone e redes, e-mail barbearia@mechasalao.com.br), descrita em [../Salões de Beleza/MARCA.md](../Sal%C3%B5es%20de%20Beleza/MARCA.md).

| Modelo | Pasta | Gerar |
|---|---|---|
| Bronze: landing page de uma página no desenho da referência Salona, escura e areia, com tema claro/escuro | [bronze/](bronze/) | `node templates/barbearia/_build-bronze/build.js` |
| Silver | ainda não feito | |
| Gold Pente Fino: barbearia premium escura, cadeira 3D sob o foco, agendamento em quatro passos, Área do cliente (marca própria Pente Fino, não usa a Mecha) | [gold-pente/](gold-pente/) | em `_build-gold-pente/`: `npm install` e depois `npm run catalogo` |

## Bronze

- `_build-bronze/content.js`: marca, contatos, horários, serviços com preço e tempo, barbeiros e agenda, depoimentos, políticas.
- `_build-bronze/build.js`: gera `bronze/` (index.html, assets/site.css, assets/site.js, fotos usadas, mapa, robots e sitemap).
- `_build-bronze/style.css`, `app.js`: desenho e interação. O botão de tema vem de `../_comum/tema-pilula.js` (chave `mecha-barbearia-tema`).
- `_build-bronze/icons.js`: desenhos próprios da barbearia; `icons-mecha.js` é a cópia do símbolo e dos ícones da Mecha (vinda do Gold do salão), para a pasta não depender do outro nicho.
- `_build-bronze/img/`: todas as fotos, o mapa e `creditos.json`. As fotos dos barbeiros e a da barba com tesoura são imagens de referência enviadas: confirmar a licença antes de publicar.

Seções: capa escura com retrato, sobre com três fotos em paralaxe, serviços com foto presa, avaliações com colunas de fotos, cartão de agendamento, equipe com selo girando e agenda por barbeiro (Google Agenda e .ics), foto larga que cresce com frase corrida, políticas e higiene, rodapé claro com mapa. Textos de políticas a validar na revisão jurídica.

## Gold Pente Fino (barbearia premium)

Modelo da biblioteca ProfitizeBuild (template "Pente Fino"), montado como a demo, sem mudanças no código. Marca fictícia **Pente Fino**: "Você escolhe o corte. A gente passa o pente fino." Preto e osso, sem cor de acento; a cor vem só do cromo e do couro da cadeira.

- **Stack:** Vite sem framework, Three.js, GSAP com ScrollTrigger e Lenis. Código em `_build-gold-pente/src/`, textos em `_build-gold-pente/index.html`, imagens, fonte e modelo 3D em `_build-gold-pente/public/`.
- **Gerar:** em `_build-gold-pente/`, `npm install` e depois `npm run catalogo` (grava em `gold-pente/`, com `base: './'`, e abre em qualquer subpasta). `npm run dev` para editar.
- **Guia completo:** `_build-gold-pente/CLAUDE.md` (arquitetura, regras do 3D, do movimento e do celular, e como personalizar). Os prints de referência de cada cena estão em `_build-gold-pente/arquivos/conceito/` e os prompts das imagens em `arquivos/receitas/`.
- **Cenas:** abertura com o pente atravessando o cabelo em macro; cadeira 3D que gira e some numa névoa clara; cardápio #0 a #6 com a ferramenta seguindo o mouse; manifesto com relógio, lata de pomada e borrifador em 3D; quatro espelhos (um por barbeiro); cortes que viram de costas; clube; bancada de produtos; vale-presente de metal; nota 4,9; mapa em SVG; dúvidas; fecho com o próximo horário livre; gaveta de agendamento em quatro passos com `.ics`.
- **Parâmetros:** `?tema=vinho` ou `?tema=conhaque` troca o couro da cadeira; `?hora=14:20` simula a hora.
- **Fotos coloridas** (Unsplash, as mesmas do Gold do salão Mecha em `../Salões de Beleza/_build-gold/img/fotos/`, recortadas por `_build-gold-pente/preparar-fotos.mjs`), com créditos no rodapé. Os cortes mostram "Ver na cadeira" (o corte sendo feito) no lugar de "de costas". Duas fotos de produto (shampoo e kit) têm rótulos de marcas reais: trocar antes de usar com cliente.
- **Mapa** no padrão dos outros modelos: OpenStreetMap recolorido em escuro (`_build-gold-pente/gerar-mapa.cjs`), pino, cartão com "Abrir no mapa" e "Como chegar". Ponto de exemplo em Botafogo, Rio de Janeiro.
- **Área do cliente:** `cliente.html` (login com as credenciais de demonstração já preenchidas: dono@pentefino.com.br / pentefino123), `cadastro.html` (cadastro do dono) e `painel.html` (serviços, barbeiros, produtos, loja e horário). Cada serviço, barbeiro e produto pode ficar visível ou arquivado, ser editado, excluído ou mudar de ordem, e o site segue na hora. Os dados ficam no navegador (demonstração); detalhes em `_build-gold-pente/CLAUDE.md`.
- **Tudo é demonstração:** fotos dos barbeiros, cortes e produtos, preços, nota, depoimentos, endereço, o pagamento do sinal (não cobra nada) e o login da Área do cliente (sem servidor). A cadeira 3D é "Barber Chair", de sweedboy69 (CC BY 4.0), com crédito no rodapé.
