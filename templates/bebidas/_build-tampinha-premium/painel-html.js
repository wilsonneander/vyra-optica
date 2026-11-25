// HTML da Área do Cliente (painel.html) do modelo Gold da Tampinha.
// Login e cadastro do estabelecimento, produtos, categorias e horário de funcionamento, com publicação no site.
module.exports = ({ M, C, I, H, esc, imgDe, fontes, dadosJson, nProdutos }) => {
  const linhaDia = (dia) => `<div class="dia" data-dia="${dia}">
          <b class="dia-nome">${H.NOMES[dia]}</b>
          <label class="chave"><input type="checkbox" data-aberto><span class="chave-trilho" aria-hidden="true"><i></i></span><span class="chave-txt" data-chave-txt>Aberto</span></label>
          <label class="hora"><span>Abre</span><input type="time" step="900" data-abre></label>
          <label class="hora"><span>Fecha</span><input type="time" step="900" data-fecha></label>
          <small class="vira" data-vira></small>
        </div>`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Área do cliente | ${M.completo}</title>
<meta name="description" content="Painel da loja: cadastre bebidas e categorias, ajuste o horário de funcionamento e publique no site.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0B0A09">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
${fontes}
<link rel="stylesheet" href="assets/painel.css">
</head>
<body class="painel">

<section class="login" data-login>
  <div class="login-arte" aria-hidden="true">
    ${imgDe('pessoas/bar-noite', '', 'login-foto', false)}
    <div class="login-veu"></div>
    <a class="logo login-marca" href="index.html" tabindex="-1">${I.logo}</a>
    <div class="flutua">
      <span class="flutua-tampa">${I.tampaPura}</span>
      <div><b>Catálogo publicado</b><small>${nProdutos} bebidas no site agora</small></div>
    </div>
    <div class="login-frase">
      <h2>O catálogo e o horário da loja, <em>do seu jeito.</em></h2>
      <p>Aqui você cadastra bebidas, troca preços e fotos, organiza as categorias e define os dias e horários em que a Tampinha funciona. Quando terminar, é só publicar: o site atualiza na hora.</p>
      <ul class="login-pode">
        <li><b>Produtos</b>Foto, marca, embalagem e preço</li>
        <li><b>Categorias</b>Crie, renomeie e escolha a ordem</li>
        <li><b>Horários</b>Abertura e fechamento de cada dia</li>
        <li><b>Publicação</b>Revise o rascunho e mande para o site</li>
      </ul>
    </div>
  </div>

  <div class="login-lado">
    <form class="login-caixa" data-login-form>
      <a class="logo" href="index.html" aria-label="Voltar ao site">${I.logo}</a>
      <div class="login-titulo">
        <p class="apoio">Área do cliente</p>
        <h1><span data-saudacao>Olá</span>, ${esc(C.acesso.responsavel.split(' ')[0])}.</h1>
        <p>Entre para cadastrar bebidas, organizar as categorias e ajustar o horário da loja.</p>
      </div>
      <label class="campo"><span>E-mail</span><span class="entrada">${I.arroba}<input type="email" name="email" autocomplete="username" required value="${esc(C.acesso.email)}"></span></label>
      <label class="campo"><span>Senha</span><span class="entrada senha">${I.cadeado}<input type="password" name="senha" autocomplete="current-password" required value="${esc(C.acesso.senha)}"><button type="button" data-ver-senha aria-label="Mostrar senha">${I.olho}</button></span></label>
      <p class="erro" data-login-erro hidden>E-mail ou senha não conferem.</p>
      <button class="btn btn-ouro btn-cheio" type="submit">Entrar no painel${I.seta}</button>
      <p class="demo">Modo demonstração: e-mail e senha já estão preenchidos.</p>
      <p class="trocar">Ainda não tem acesso? <a class="link" href="#cadastro" data-ir="cadastro">Cadastre seu estabelecimento</a></p>
    </form>

    <form class="login-caixa" data-cadastro-form hidden novalidate>
      <a class="logo" href="index.html" aria-label="Voltar ao site">${I.logo}</a>
      <div class="login-titulo">
        <p class="apoio">Novo acesso</p>
        <h1>Cadastre seu estabelecimento.</h1>
        <p>Crie o acesso do dono ou responsável. Com ele você entra no painel, cadastra as bebidas, ajusta o horário e publica no site.</p>
      </div>
      <div class="dupla">
        <label class="campo"><span>Seu nome</span><span class="entrada">${I.pessoa}<input name="nome" autocomplete="name" required maxlength="40" placeholder="Nome completo"></span></label>
        <label class="campo"><span>Estabelecimento</span><span class="entrada">${I.loja}<input name="loja" autocomplete="organization" required maxlength="40" placeholder="Nome da loja"></span></label>
      </div>
      <label class="campo"><span>E-mail</span><span class="entrada">${I.arroba}<input type="email" name="email" autocomplete="email" required placeholder="voce@suaadega.com.br"></span></label>
      <label class="campo"><span>WhatsApp</span><span class="entrada">${I.whats}<input type="tel" name="whats" autocomplete="tel" inputmode="tel" required placeholder="(31) 99999-0000" data-mascara-tel></span></label>
      <div class="dupla">
        <label class="campo"><span>Senha <small>(mín. 6)</small></span><span class="entrada senha">${I.cadeado}<input type="password" name="senha" autocomplete="new-password" required minlength="6"><button type="button" data-ver-senha aria-label="Mostrar senha">${I.olho}</button></span></label>
        <label class="campo"><span>Confirmar senha</span><span class="entrada senha">${I.cadeado}<input type="password" name="senha2" autocomplete="new-password" required><button type="button" data-ver-senha aria-label="Mostrar senha">${I.olho}</button></span></label>
      </div>
      <label class="check"><input type="checkbox" name="dono" required><span>Sou o dono ou responsável por este estabelecimento.</span></label>
      <p class="erro" data-cad-erro hidden></p>
      <button class="btn btn-ouro btn-cheio" type="submit">Criar acesso e entrar${I.seta}</button>
      <p class="trocar">Já tem acesso? <a class="link" href="#entrar" data-ir="entrar">Entrar no painel</a></p>
    </form>
    <div class="login-rodape">
      <a href="index.html">${I.setaEsq}Voltar ao site</a>
      <a href="https://wa.me/${M.whatsapp}?text=${encodeURIComponent('Olá! Preciso de ajuda com o painel da loja.')}" target="_blank" rel="noopener">${I.whats}Preciso de ajuda</a>
    </div>
  </div>
</section>

<div class="app" data-app hidden>
  <aside class="lateral">
    <a class="logo" href="index.html" aria-label="Ver site">${I.logo}</a>
    <nav class="menu-lateral" aria-label="Painel">
      <button type="button" class="on" data-tela="produtos">${I.sacola}<span>Produtos</span></button>
      <button type="button" data-tela="categorias">${I.lista}<span>Categorias</span></button>
      <button type="button" data-tela="horarios">${I.relogio}<span>Horários</span></button>
      <a href="index.html" target="_blank" rel="noopener">${I.olho}<span>Ver o site</span></a>
    </nav>
    <div class="quem"><b data-quem></b><span data-quem-loja></span><button type="button" data-sair>${I.sair}Sair</button></div>
  </aside>

  <main class="area">
    <header class="area-topo">
      <div>
        <p class="apoio">Área do cliente</p>
        <h1 data-titulo>Produtos</h1>
        <p class="estado" data-estado>Tudo publicado</p>
      </div>
      <div class="area-acoes">
        <button class="btn btn-linha" type="button" data-descartar hidden>Descartar alterações</button>
        <button class="btn btn-ouro" type="button" data-publicar disabled>${I.enviar}Publicar no site</button>
      </div>
    </header>

    <section class="tela" data-tela-box="produtos">
      <div class="barra">
        <label class="campo-sel"><span>Categoria</span><select data-p-cat></select></label>
        <label class="busca">${I.busca}<input type="search" placeholder="Buscar bebida ou marca" data-p-busca aria-label="Buscar bebida ou marca"></label>
        <div class="vista" role="group" aria-label="Formato da lista">
          <button type="button" data-vista="lista" aria-pressed="true" title="Ver em lista">${I.lista}<span>Lista</span></button>
          <button type="button" data-vista="grade" aria-pressed="false" title="Ver em grade">${I.grade}<span>Grade</span></button>
        </div>
        <button class="btn btn-ouro" type="button" data-novo>${I.mais}Nova bebida</button>
      </div>
      <p class="conta" data-p-conta></p>
      <div class="lista" data-lista></div>
    </section>

    <section class="tela" data-tela-box="categorias" hidden>
      <form class="cat-nova" data-cat-form>
        <label class="campo"><span>Nova categoria</span><input name="nome" placeholder="Ex.: Vinhos espumantes" required maxlength="24"></label>
        <label class="check"><input type="checkbox" name="alc"><span>Só para maiores de 18</span></label>
        <button class="btn btn-ouro" type="submit">${I.mais}Adicionar</button>
      </form>
      <ul class="cats" data-cats></ul>
      <p class="nota">A ordem aqui é a ordem dos filtros do catálogo e da lista de categorias no site. Uma categoria só pode ser apagada quando estiver vazia.</p>
      <p class="nota">Demonstração: tudo fica salvo neste navegador. <button type="button" class="link" data-restaurar>Voltar ao catálogo e horário originais</button></p>
    </section>

    <section class="tela" data-tela-box="horarios" hidden>
      <div class="hor">
        <div class="hor-dias">
          <p class="hor-intro">Marque os dias em que a loja abre e o horário de cada um. Se fechar depois da meia-noite, é só pôr a hora (por exemplo 01:00) que o painel entende que é no dia seguinte.</p>
          ${H.SEMANA.map(linhaDia).join('\n          ')}
          <div class="hor-atalhos" data-iguais>
            <button type="button" class="btn btn-linha" data-copiar="uteis">Copiar segunda para os dias úteis</button>
            <button type="button" class="btn btn-linha" data-copiar="todos">Copiar segunda para todos os dias</button>
          </div>
        </div>
        <aside class="hor-previa">
          <p class="apoio">Como aparece no site</p>
          <p class="hor-status" data-hor-status></p>
          <ul class="hor-lista" data-hor-lista></ul>
          <p class="nota">Vale para o aviso do topo (aberto ou fechado), o horário do rodapé e o cartão do mapa. Publique para aplicar.</p>
        </aside>
      </div>
    </section>
  </main>
</div>

<div class="gaveta" data-gaveta hidden>
  <div class="gaveta-fundo" data-fechar></div>
  <form class="gaveta-caixa" data-form role="dialog" aria-modal="true" aria-labelledby="t-form" novalidate>
    <div class="gaveta-topo"><h2 id="t-form" data-form-titulo>Nova bebida</h2><button type="button" class="fechar" data-fechar aria-label="Fechar">${I.fechar}</button></div>
    <div class="foto-campo">
      <div class="foto-prev" data-foto-prev></div>
      <div class="foto-acoes">
        <label class="btn btn-linha">${I.foto}Enviar foto<input type="file" accept="image/*" data-foto-arquivo hidden></label>
        <p>Use foto com fundo transparente (PNG ou WebP) para a garrafa flutuar no card. Ou escolha uma da galeria:</p>
        <div class="galeria" data-galeria></div>
      </div>
    </div>
    <label class="campo"><span>Nome</span><input name="nome" required maxlength="48" placeholder="Ex.: Heineken"></label>
    <div class="dupla">
      <label class="campo"><span>Marca</span><input name="marca" maxlength="28" placeholder="Ex.: Heineken"></label>
      <label class="campo"><span>Embalagem</span><input name="vol" maxlength="32" placeholder="Ex.: long neck 330ml"></label>
    </div>
    <div class="dupla">
      <label class="campo"><span>Categoria</span><select name="cat" data-form-cat required></select></label>
      <label class="campo"><span>Preço (R$)</span><input name="preco" inputmode="decimal" required placeholder="6,49"></label>
    </div>
    <label class="check"><input type="checkbox" name="alc"><span>Bebida alcoólica (venda só para maiores de 18)</span></label>
    <label class="check"><input type="checkbox" name="destaque"><span>Mostrar na <b>Seleção da casa</b></span></label>
    <label class="check"><input type="checkbox" name="oculto"><span>Esconder do site por enquanto</span></label>
    <p class="erro" data-form-erro hidden></p>
    <div class="gaveta-btns" data-iguais>
      <button type="button" class="btn btn-linha" data-fechar>Cancelar</button>
      <button type="submit" class="btn btn-ouro">Salvar bebida</button>
    </div>
  </form>
</div>
<p class="aviso" data-aviso role="status" aria-live="polite"></p>

<script id="dados" type="application/json">${dadosJson}</script>
<script src="assets/horario.js"></script>
<script src="assets/loja.js"></script>
<script src="assets/painel.js"></script>
</body>
</html>
`;
};
