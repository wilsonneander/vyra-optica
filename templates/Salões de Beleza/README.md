# Salões de Beleza (marca de demonstração: Mecha Salão & Barbearia)

Nicho de salão de beleza (com barbearia no mesmo endereço). Barbearia sozinha tem nicho próprio em [../barbearia/](../barbearia/) (Bronze Mecha Barbearia e Gold Pente Fino). Os modelos do salão usam a mesma marca fictícia, descrita em [MARCA.md](MARCA.md) junto com os perfis de exemplo de Instagram, Facebook, LinkedIn e WhatsApp Business.

| Modelo | Pasta | Gerar |
|---|---|---|
| Gold: salão de beleza com barbearia masculina no mesmo endereço | [gold/](gold/) | `node "templates/Salões de Beleza/_build-gold/build.js"` |
| Silver | ainda não feito | |
| Bronze | ainda não feito (o antigo Bronze, Mecha Barbearia, foi para [../barbearia/bronze/](../barbearia/bronze/)) | |

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
