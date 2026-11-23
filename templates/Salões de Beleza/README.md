# Salões de Beleza (marca de demonstração: Mecha Salão & Barbearia)

Nicho de salão de beleza (com barbearia no mesmo endereço). Barbearia sozinha tem nicho próprio em [../barbearia/](../barbearia/) (Bronze Mecha Barbearia e Gold Pente Fino). Os modelos do salão usam a mesma marca fictícia, descrita em [MARCA.md](MARCA.md) junto com os perfis de exemplo de Instagram, Facebook, LinkedIn e WhatsApp Business.

| Modelo | Pasta | Gerar |
|---|---|---|
| Gold: salão de beleza com barbearia masculina no mesmo endereço | [gold/](gold/) | `node "templates/Salões de Beleza/_build-gold/build.js"` |
| Silver: site do salão (Mecha Salão) com páginas de equipe e galeria e Área do cliente, paleta terracota | [silver/](silver/) | `node "templates/Salões de Beleza/_build-silver/build.js"` |
| Bronze: página única enxuta só do salão (Mecha Salão), paleta ameixa | [bronze/](bronze/) | `node "templates/Salões de Beleza/_build-bronze/build.js"` |

## Gold

Desenho baseado na referência pedida (Scissor, feito no Framer), adaptado para salão e barbearia no Brasil e para as diretrizes do projeto (sem etiquetas numeradas, sem selos em cápsula, sem as fontes da referência).

Seções, na ordem: capa com três fotos que se alternam e cartão do serviço mais agendado; faixa corrida de serviços; o espaço (parágrafo que se pinta com a rolagem, nota do Google) com colunas de fotos que abrem; cardápio de serviços e preços em sanfona, com abas Salão e Barbearia; quatro motivos em cartões que se empilham; antes e depois arrastável com abas; equipe com os horários de cada profissional; a visita em quatro momentos (trilho lateral preso durante a rolagem no computador, deslizar no celular); planos mensais da barbearia; avaliações; lookbook em arco que gira com a rolagem; políticas e higiene; dúvidas; agendamento; rodapé com mapa.

### Ligar e desligar segmentos

Em `_build-gold/content.js`, cada item de `segmentos` tem `ativo: true|false`:

- Salão: cortes femininos, escova e finalização, coloração e mechas, tratamentos e químicas.
- Barbearia: corte masculino, barba, sobrancelha masculina, pigmentação, combos, planos mensais.

Ao rodar o build, somem os serviços, categorias do cardápio, colunas de fotos, antes e depois, planos e profissionais que dependem de um segmento desligado. Com só um lado ligado, as abas Salão e Barbearia desaparecem, o título da página e o schema mudam (por exemplo, `BarberShop`) e os textos que falam dos dois lados se ajustam.

### Agendamento

O formulário pede nome, telefone, e-mail, serviço, profissional, data e horário. A lista de profissionais mostra só quem faz o serviço escolhido e os horários saem da agenda de cada um (`equipe[].agenda` em `content.js`, por dia da semana), dentro do horário de funcionamento (`abertura`). Serviços com química mostram o aviso do teste de mecha ou de sensibilidade. O envio monta a mensagem e abre o WhatsApp; o aceite da Política de Privacidade é obrigatório e o de novidades é opcional.

### Requisitos obrigatórios cobertos

Formulário com consentimento LGPD, WhatsApp flutuante, serviços com o que inclui, duração, valor ou "a partir de", pagamento, políticas de agendamento, atraso, cancelamento, remarcação e garantia (com destaque para coloração e química), higiene (autoclave, descartáveis, produtos com registro na Anvisa), horário, endereço e mapa OpenStreetMap, rodapé com razão social, CNPJ, endereço, telefone, e-mail, canais, termos de prestação de serviço, termos de uso, política de privacidade e aviso de cookies.

**Antes de publicar para um cliente:** os textos de políticas, higiene e termos são modelo e precisam passar pela revisão jurídica. Marca, pessoas, preços, CNPJ e avaliações são fictícios.

### Imagens

Fotos em `_build-gold/img/fotos/` (Unsplash, com autor e link em `img/creditos.json`, listados no rodapé), com leve tom quente para combinar com a paleta. As três fotos do salão com espelhos em arco (`capa`, `escova`, `espaco-equipe`) são as imagens de referência enviadas para o projeto. As fotos de antes e depois são ilustrativas, de pessoas diferentes; no site do cliente entram fotos reais com autorização de imagem. O mapa é gerado por `_build-gold/gerar-mapa.js` a partir do OpenStreetMap.

## Bronze

Página única, enxuta e de baixo custo, no desenho da referência pedida (Stylicle) e com a paleta ameixa enviada: #42293C, #785B77, #BC7895, #EBC3D6, #EFDCE5. Só o lado salão da marca, como **Mecha Salão** (e-mail salao@mechasalao.com.br); CNPJ, endereço e redes são os da casa. Títulos em Prata e texto em Albert Sans. Tema claro e escuro com a pílula lateral comum (chave `mecha-salao-bronze-tema`).

Seções, na ordem: capa ameixa com a foto da cabeleireira fazendo escova diante dos espelhos em arco e barra rápida (serviço e dia, abre o WhatsApp); galeria fixa em mosaico; serviços e preços em quatro grupos (o que inclui, duração, valor ou "a partir de", aviso de teste de mecha nas químicas) com pagamento, regra do "a partir de" e remarcação; avaliação em cartão ameixa com setas; políticas em sanfona (coloração e química em destaque) e higiene; cartão de agendamento com foto e formulário (nome, telefone, e-mail, serviço, dia, período, observações, aceite LGPD obrigatório e novidades opcional) que monta a mensagem do WhatsApp; rodapé com mapa OpenStreetMap, horário, dados legais, termos, privacidade e aviso de cookies.

Serviço e dia (na capa e no formulário) usam lista e calendário próprios no lugar dos do navegador: a lista mostra os grupos com preço e o aviso de teste de mecha; o calendário bloqueia dias passados e os dias em que o salão fecha, e funciona pelo teclado. O campo original continua guardando o valor, então sem JavaScript volta o campo nativo.

Animações leves: botões sobem um pouco com sombra tingida e um brilho que atravessa, links com sublinhado que cresce, lista e calendário que abrem deslizando, fotos da galeria com zoom e legenda que sobe, entrada suave dos blocos. Tudo parado com `prefers-reduced-motion`.

Fotos e mapa vêm de `_build-gold/img/` (créditos no rodapé). Textos de políticas, higiene e termos a validar na revisão jurídica; marca, preços, CNPJ e avaliações fictícios.

## Silver

Site mais completo que o Bronze, no desenho da referência pedida (Elysia, feita no Framer) e com a paleta dela: creme #FFF9F2, café #211B18, terracota #E58A68, telha #B4532F, tijolo #7D3827 e oliva #66705A. As fontes da referência (Fraunces e DM Sans) estão na lista proibida das diretrizes, então os títulos usam Newsreader e o texto usa Hanken Grotesk. Só o lado salão da marca, como **Mecha Salão** (salao@mechasalao.com.br). Tema claro e escuro com a pílula lateral comum (chave `mecha-salao-silver-tema`).

Páginas:

- `index.html`: topo escuro que some ao descer e volta ao subir; capa com foto inteira e título que sobe palavra por palavra; faixa corrida de serviços; serviços em cartões por segmento (corte e escova, cor e mechas, cachos, tratamentos, unhas, sobrancelha e maquiagem), com menu de segmentos preso ao lado que acompanha a rolagem, fotos levemente tortas que se endireitam e o que inclui, duração, valor ou "a partir de" e aviso de teste de mecha; condições de pagamento e remarcação; tendências da estação em grade desencontrada com paralaxe; seção escura de motivos, contadores e garantia de ajuste por serviço; quem somos e equipe em carrossel; antes e depois arrastável com tempo e preço; avaliações em duas faixas que correm (pausam no mouse e no botão); Instagram incorporado; produtos para levar para casa (reserva pelo WhatsApp); bom saber antes da visita; políticas (coloração e química em destaque) e higiene; dúvidas; agendamento; rodapé com mapa OpenStreetMap, horário, dados legais, termos, privacidade e aviso de cookies.
- `equipe.html`: perfil de cada profissional com apresentação, especialidade, formação, segmentos que atende, agenda da semana e botão "Agendar com" (abre o formulário da página inicial com a profissional escolhida).
- `galeria.html`: fotos por categoria com filtros animados e foto ampliada (setas, teclado e deslizar no celular).
- `cliente.html`, `cadastro.html` e `painel.html`: Área do cliente (veja abaixo).

### Agendamento

Serviço (lista própria agrupada por segmento, com preço e duração), profissional (só aparece quem faz o serviço, ou "sem preferência"), dia (calendário próprio que risca os dias em que o salão fecha ou a profissional está de folga) e horário (passos de 30 minutos dentro da agenda da profissional e do horário da casa, já descontando a duração do serviço). Um resumo ao lado acompanha cada escolha. O envio monta a mensagem e abre o WhatsApp; aceite da Política de Privacidade obrigatório e novidades opcional. Os horários mostrados não consultam uma agenda real: o pedido é confirmado pela recepção.

### Área do cliente

Login de demonstração já preenchido: `dono@mechasalao.com.br` / `mecha2026` (ou crie uma conta em `cadastro.html`). O painel tem cinco abas: dados da empresa (nome, razão social, CNPJ, contatos, WhatsApp que recebe os pedidos, endereço), horário de funcionamento, serviços, produtos e funcionários (com foto, cargo, especialidade, apresentação, segmentos que atende e agenda por dia). Cada item pode ser criado, editado, escondido do site, reordenado e excluído; "Restaurar o padrão" volta aos dados do modelo.

O site lê o que o painel salvou e remonta serviços, formulário, equipe (carrossel e página), produtos, rodapé, horário e links de WhatsApp. As peças de HTML vêm de `_build-silver/partes.js`, o mesmo arquivo que o build usa, então o resultado é igual ao gerado. **Nesta demonstração tudo fica no navegador (localStorage) e a conta não tem segurança de verdade.** Para um cliente, `loja.js` passa a ler e gravar numa API e o login vira autenticação no servidor.

### Instagram

O bloco do Instagram é um feed de exemplo montado com fotos do site (perfil @mecha.salao, números e legendas fictícios). No site do cliente entra o feed real: o código de incorporação do próprio Instagram ou um widget como Behold ou LightWidget no lugar de `.insta-grade`.

### Fontes do build

`_build-silver/`: `content.js` (textos, preços, equipe, produtos, galeria), `partes.js` (peças de HTML usadas no build e no navegador), `build.js`, `style.css`, `comum.js`, `app.js` (site), `painel.js` (Área do cliente), `loja.js` (dados e sessão), `icons.js`. Fotos novas em `_build-silver/img/fotos/` (Unsplash, créditos em `img/creditos.json` e no rodapé); as demais e o mapa vêm de `_build-gold/img/`. Políticas, higiene e termos a validar na revisão jurídica; marca, pessoas, preços, CNPJ e avaliações fictícios.
