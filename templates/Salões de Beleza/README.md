# Salões de Beleza (marca de demonstração: Mecha Salão & Barbearia)

Nicho de salão de beleza e barbearia. Os três modelos (Bronze, Silver e Gold) usam a mesma marca fictícia, descrita em [MARCA.md](MARCA.md) junto com os perfis de exemplo de Instagram, Facebook, LinkedIn e WhatsApp Business.

| Modelo | Pasta | Gerar |
|---|---|---|
| Gold: salão de beleza com barbearia masculina no mesmo endereço | [gold/](gold/) | `node "templates/Salões de Beleza/_build-gold/build.js"` |
| Gold Pente Fino: barbearia premium escura, cadeira 3D sob o foco, agendamento em quatro passos (marca própria Pente Fino, não usa a Mecha) | [gold-pente/](gold-pente/) | em `_build-gold-pente/`: `npm install` e depois `npm run catalogo` |
| Silver | ainda não feito | |
| Bronze | ainda não feito | |

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

## Gold Pente Fino (barbearia premium)

Modelo da biblioteca ProfitizeBuild (template "Pente Fino"), montado como a demo, sem mudanças no código. Marca fictícia **Pente Fino**: "Você escolhe o corte. A gente passa o pente fino." Preto e osso, sem cor de acento; a cor vem só do cromo e do couro da cadeira.

- **Stack:** Vite sem framework, Three.js, GSAP com ScrollTrigger e Lenis. Código em `_build-gold-pente/src/`, textos em `_build-gold-pente/index.html`, imagens, fonte e modelo 3D em `_build-gold-pente/public/`.
- **Gerar:** em `_build-gold-pente/`, `npm install` e depois `npm run catalogo` (grava em `gold-pente/`, com `base: './'`, e abre em qualquer subpasta). `npm run dev` para editar.
- **Guia completo:** `_build-gold-pente/CLAUDE.md` (arquitetura, regras do 3D, do movimento e do celular, e como personalizar). Os prints de referência de cada cena estão em `_build-gold-pente/arquivos/conceito/` e os prompts das imagens em `arquivos/receitas/`.
- **Cenas:** abertura com o pente atravessando o cabelo em macro; cadeira 3D que gira e some numa névoa clara; cardápio #0 a #6 com a ferramenta seguindo o mouse; manifesto com relógio, lata de pomada e borrifador em 3D; quatro espelhos (um por barbeiro); cortes que viram de costas; clube; bancada de produtos; vale-presente de metal; nota 4,9; mapa em SVG; dúvidas; fecho com o próximo horário livre; gaveta de agendamento em quatro passos com `.ics`.
- **Parâmetros:** `?tema=vinho` ou `?tema=conhaque` troca o couro da cadeira; `?hora=14:20` simula a hora.
- **Fotos coloridas** (Unsplash, as mesmas do Gold Mecha, recortadas por `_build-gold-pente/preparar-fotos.mjs`), com créditos no rodapé. Os cortes mostram "Ver na cadeira" (o corte sendo feito) no lugar de "de costas". Duas fotos de produto (shampoo e kit) têm rótulos de marcas reais: trocar antes de usar com cliente.
- **Mapa** no padrão dos outros modelos: OpenStreetMap recolorido em escuro (`_build-gold-pente/gerar-mapa.cjs`), pino, cartão com "Abrir no mapa" e "Como chegar". Ponto de exemplo em Botafogo, Rio de Janeiro.
- **Área do cliente:** `cliente.html` (login com as credenciais de demonstração já preenchidas: dono@pentefino.com.br / pentefino123), `cadastro.html` (cadastro do dono) e `painel.html` (serviços, barbeiros, produtos, loja e horário). Cada serviço, barbeiro e produto pode ficar visível ou arquivado, ser editado, excluído ou mudar de ordem, e o site segue na hora. Os dados ficam no navegador (demonstração); detalhes em `_build-gold-pente/CLAUDE.md`.
- **Tudo é demonstração:** fotos dos barbeiros, cortes e produtos, preços, nota, depoimentos, endereço, o pagamento do sinal (não cobra nada) e o login da Área do cliente (sem servidor). A cadeira 3D é "Barber Chair", de sweedboy69 (CC BY 4.0), com crédito no rodapé.
