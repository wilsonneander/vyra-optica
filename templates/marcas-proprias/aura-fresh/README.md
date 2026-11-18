# AURA Fresh: quatro modelos premium (Marcas Próprias)

Cliente da NexusAg. Suplemento alimentar em pó com clorofila, salsa e hortelã, uma dose por dia (https://useaurafresh.com).
Referência de animação 3D: modelo N3 Drinks (Bebidas & Conveniências), usada só para o comportamento do 3D. Marca, cores, fontes, textos e fotos são da AURA Fresh.

| Pasta | Modelo | Direção |
|---|---|---|
| `produto/` | Modelo 1 "Origem": marca e produto | Verde-noite. Hero com o pote 3D: a tampa sobe com a rolagem, sai o pó e as folhas giram. Seletor de kit (1, 2 ou 3 potes) que põe os potes na cena e troca o preço. Ativos com modal, "Tira o rótulo", rotina, o que esperar sem promessa, relatos, kits, FAQ e contato. |
| `guia/` | Modelo 2 "Diário": conteúdo e guia de uso | Editorial claro, sem WebGL. Guia de uso (HowTo), comparador de rotina lado a lado (hábitos, não resultado), rótulo aberto em 2D com pontos, relatos, blog com 4 artigos, SEO (Organization, Product com ofertas, FAQPage, Article, BreadcrumbList, sitemap.xml, robots.txt, canonical). |
| `clube/` | Modelo 3 "Ritual": tudo do modelo 1 + Área do cliente | Claro (papel, rosa e lima). Hero 3D do ritual: a água sobe no copo, a colher leva a dose, o pó cai e a água fica verde. Botões "ao acordar, depois do almoço, no fim do dia" trocam a luz da cena. Sanfona de ativos, rótulo claro, mês de 30 doses, kits e `cliente.html`. |
| `nascente/` | Modelo 4 "Nascente": segunda versão premium do produto | Preto-água (claro no papel). Hero da gota: a gota cai na lâmina d'água, espirra a coroa, o rebote sobe e vira uma fita de água em espiral que aperta até o tamanho do pote; a água preenche o molde de baixo para cima e o pote verde nasce atrás dela, sobe da água e gira, com gotas e folhas suspensas e o seletor de kit. Fórmula em três gotas (paralaxe, abre o modal), "Tira o rótulo", pote em 3D para girar e abrir, vídeo da marca, imagens da marca em trilho lateral, antes e depois arrastável, avaliações, kits, FAQ e contato. |

Os quatro abrem direto pelo `index.html` (sem servidor).

## Peças comuns de navegação

- **Tema claro e escuro**: botão no cabeçalho em que a tampa do pote (lima, com a borda serrilhada) gira de um lado ao outro entre sol e lua e solta pó verde; a página troca num círculo que nasce do botão (View Transitions, com transição de cores como alternativa). O produto nasce escuro e os outros dois claros. A escolha fica salva (`aura-origem-tema`, `aura-diario-tema`, `aura-ritual-tema`) e `?tema=claro` ou `?tema=escuro` no link também vale. Estilos em `_kit/css/tema-produto.css`, `tema-guia.css` e `tema-clube.css`.
- **Onde você está**: acima do WhatsApp, um pote que enche de pó (com onda) de 0 a 100% conforme a página desce. No hover mostra a seção atual e quanto falta; no fim a tampa se abre, e o clique volta ao topo girando a tampa.
- **Toque fluido**: botões apertam com mola e soltam uma onda a partir do ponto do clique (desligado com "reduzir movimento").
- **Barra de rolagem** nas cores da marca, acompanhando o tema.
- **Tela de carregamento**: a colher despeja o pó num copo que enche e esverdeia conforme as etapas reais terminam (fontes, página e o 3D, com limite de 7 a 8 s para nunca prender). Fases "abrindo o pote", "pegando a dose", "misturando na água" e "pronto, bom ritual". Sai num círculo que encolhe até o pote de progresso. Na segunda página da mesma visita fica mais curta; com "reduzir movimento" quase não aparece.
- **Informações do rótulo** (produto e clube): etiqueta impressa com borda picotada, números do pote, composição em barras proporcionais às doses, modo de uso em sequência, advertências em bloco de atenção, contraindicações e registro com código de barras, ao lado de um selo girando.

## Gerar

```
node templates/marcas-proprias/aura-fresh/_build/build.js            # os quatro
node templates/marcas-proprias/aura-fresh/_build/build.js clube      # só um
```

Nunca editar `produto/`, `guia/`, `clube/` ou `nascente/` à mão: tudo sai de `_build/` e `_kit/`.

| Arquivo | O que é |
|---|---|
| `_build/dados.js` | Empresa, produto, kits e preços, ativos, FAQ e depoimentos. **Primeiro lugar a mexer.** |
| `_build/partes.js` | Kit de componentes em HTML: head, formulário com consentimento, botão de WhatsApp, cookies, bloco de kits, FAQ, modal de ativos, modal do pote 3D, rodapé legal com mapa e as páginas de política |
| `_build/site-produto.js`, `site-guia.js`, `site-clube.js`, `site-nascente.js` | Páginas de cada modelo |
| `_kit/js/nascente.js` | Modelo 4: vídeo que só carrega o YouTube no clique, trilho de imagens lateral, antes e depois, paralaxe das gotas |
| `_kit/js/rotulo.js` | Desenho do rótulo do pote em canvas (frente, composição, modo de uso, advertências). Usado no 3D e no rótulo 2D do guia |
| `_kit/js/pote-3d.js` | Motor 3D (three.js r149): pote com tampa, manga do rótulo que vira folha, pó, folhas, copo, hero, gota da Nascente (`iniciaGota`, água com borda fresnel e recorte do pote por plano), ritual, rótulo e modal |
| `_kit/js/kit.js` | Cookies, formulário (LGPD), kits, modais, menu, revisão jurídica |
| `_kit/js/cliente.js` | Área do cliente (demonstração no navegador) |
| `_build/preparar-img.js` | Converte as imagens do site da marca (`_build/fonte/`) e recorta o logo do favicon |
| `_build/gerar-mapa.js` | Mapa OpenStreetMap recolorido (`floresta` escuro, `papel` claro) para o endereço do CNPJ |

`preparar-img.js` e `gerar-mapa.js` precisam do `sharp` fora do projeto: `NODE_PATH=<pasta com node_modules> node ...`.

## Identidade usada

Tirada do site atual: verde `#2b462b` e `#254a33`, lima `#c4d997`, rosa `#ca98ab` e `#f0c6d7`, texto `#414141`. Fontes da marca: **Inter Tight** (títulos) e **DM Sans** (texto), mais Gochi Hand nas anotações à mão (como no "O cuidado começa por dentro" do site). As duas fontes da marca estão na lista de fontes evitadas das diretrizes, mas a marca tem prioridade (regra das próprias diretrizes) e foi o que o pedido definiu.

## Área do cliente (só no clube)

`clube/cliente.html`. Login demo **cliente@aurafresh.com.br / aura2026** (dados fictícios, cliente "Camila Andrade").
Login e recuperação de acesso com código; início com pedido em trânsito e entrega estimada; histórico de pedidos com rastreio; recompra em 1 clique (cria o pedido); gestão de assinatura (quantidade, frequência, pular, pausar, cancelar); segunda via de nota (documento auxiliar para imprimir); dados cadastrais e senha; endereços; consentimentos com histórico, baixar dados em JSON e pedido de exclusão (LGPD); suporte com chamados e WhatsApp.
Tudo fica no `localStorage` (`aura-clube-conta`). Na implantação, cada ação chama a API da loja, do checkout (hoje B4You) e do emissor de NF-e.

## Revisão jurídica

Abra qualquer página com `?revisao=1` no fim do link: tudo marcado com `data-revisar` ganha contorno rosa e o selo "[revisão jurídica]".
Marcados: frases de benefício dos ativos, relato mais comum de hálito mais fresco, garantia de 14 dias, todos os depoimentos (precisam de autorização por escrito), textos de política e termos.
A frase "resultados em até 14 dias" do site atual **não foi usada** em nenhum modelo: precisa de comprovação antes.

## Pendências do cliente

- Número do WhatsApp Business (`empresa.whatsapp` em `dados.js`, hoje `[preencher]`).
- Telefone: o `(62) 3223-7010` veio do cartão CNPJ, confirmar se é de atendimento.
- Links do Facebook e LinkedIn (o Instagram `@aurafreshbrasil` aparece no site atual, confirmar).
- Registro ou notificação na Anvisa, lista completa de ingredientes, EAN do código de barras, tabela nutricional se houver.
- Nome e cidade de quem autorizou cada depoimento.
- Prazos de entrega por região, encarregado de dados (DPO) e se haverá assinatura recorrente.
- Domínio final do guia (`URL_BASE` em `site-guia.js`) para canonical e sitemap.
- Kit visual oficial (logo vetorial, manual) se existir: hoje o logo foi recortado do favicon do site.

## Modelo 4 "Nascente": peças próprias

- **Vídeo da marca**: https://youtu.be/lEygblIM29Y (`VIDEO_ID` em `site-nascente.js`). A capa é a foto do pote claro (`pote-claro.webp`); o player do YouTube (domínio nocookie) só carrega quando a pessoa toca.
- **Imagens da marca**: fotos da campanha já no kit (`galeria` em `site-nascente.js`). No computador o trilho anda de lado com a rolagem; no celular vira carrossel com encaixe.
- **Antes e depois**: a mesma cena da campanha (`_kit/img/ad-antes.webp` mulher com a mão na boca, espelhada para ficar no lado esquerdo; `ad-depois.webp` casal sorrindo), com aviso de cena ilustrativa e `data-revisar`. Fala de hábito, não de resultado.
- **Tela de carregamento**: no Nascente só a logo (menor), em branco, com um líquido verde-claro que sobe dentro das letras em duas ondas, balança e solta bolhas; sem fase nem porcentagem (`carregandoMarca` em `site-nascente.js`, mesmos ganchos do `kit.js`).
- **Pote em 3D** (`#pote-3d`, `iniciaPalco` em pote-3d.js): arrasta para girar com inércia, botão que desenrosca e abre a tampa soltando o pó, e atalhos para a frente e o verso do rótulo.
- **Avaliações**: uma fala por vez num cartão compacto; os rostos trocam a fala e o anel do rosto ativo enche em 7 s e passa para a próxima (pausa no hover). Relatos do site atual com nota 5 de exemplo. Pendente: nota e total reais da plataforma de avaliações (hoje "[preencher]") e autorização de cada pessoa.
