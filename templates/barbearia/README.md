# Barbearia (marca de demonstração: Mecha Barbearia)

Nicho só de barbearia, separado de [Salões de Beleza](../Sal%C3%B5es%20de%20Beleza/). A marca é o lado barbearia da Mecha (mesmo símbolo, endereço, CNPJ, telefone e redes, e-mail barbearia@mechasalao.com.br), descrita em [../Salões de Beleza/MARCA.md](../Sal%C3%B5es%20de%20Beleza/MARCA.md).

| Modelo | Pasta | Gerar |
|---|---|---|
| Bronze: landing page de uma página no desenho da referência Salona, escura e areia, com tema claro/escuro | [bronze/](bronze/) | `node templates/barbearia/_build-bronze/build.js` |
| Silver | ainda não feito | |
| Gold | ainda não feito | |

## Bronze

- `_build-bronze/content.js`: marca, contatos, horários, serviços com preço e tempo, barbeiros e agenda, depoimentos, políticas.
- `_build-bronze/build.js`: gera `bronze/` (index.html, assets/site.css, assets/site.js, fotos usadas, mapa, robots e sitemap).
- `_build-bronze/style.css`, `app.js`: desenho e interação. O botão de tema vem de `../_comum/tema-pilula.js` (chave `mecha-barbearia-tema`).
- `_build-bronze/icons.js`: desenhos próprios da barbearia; `icons-mecha.js` é a cópia do símbolo e dos ícones da Mecha (vinda do Gold do salão), para a pasta não depender do outro nicho.
- `_build-bronze/img/`: todas as fotos, o mapa e `creditos.json`. As fotos dos barbeiros e a da barba com tesoura são imagens de referência enviadas: confirmar a licença antes de publicar.

Seções: capa escura com retrato, sobre com três fotos em paralaxe, serviços com foto presa, avaliações com colunas de fotos, cartão de agendamento, equipe com selo girando e agenda por barbeiro (Google Agenda e .ics), foto larga que cresce com frase corrida, políticas e higiene, rodapé claro com mapa. Textos de políticas a validar na revisão jurídica.
