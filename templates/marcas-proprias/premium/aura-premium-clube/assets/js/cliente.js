/* AURA Fresh, Área do cliente (modelo 3). Demonstração que roda só no navegador, com dados fictícios.
   Login: cliente@aurafresh.com.br / aura2026. A conta fica no localStorage (aura-clube-conta) e a sessão no sessionStorage.
   Na implantação real, cada ação chama a API da loja/checkout (pedidos, assinatura, NF-e e LGPD). */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const area = $('[data-area]'); if (!area) return;
  const KITS = window.AURA_KITS || [], EMP = window.AURA_EMPRESA || {};
  const CHAVE = 'aura-clube-conta', SESSAO = 'aura-clube-sessao';
  const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const data = s => new Date(s + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const dataCurta = s => new Date(s + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
  const somaDias = (s, n) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const hoje = () => new Date().toISOString().slice(0, 10);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const seta = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6.5 18.5 12 13 17.5"/></svg>';

  // ---------- conta de demonstração ----------
  function contaInicial() {
    const h = hoje();
    return {
      cliente: { nome: 'Camila Andrade', email: 'cliente@aurafresh.com.br', cpf: '123.456.789-09', nascimento: '1991-04-18', telefone: '(11) 98765-4321' },
      senha: 'aura2026',
      pedidos: [
        { id: 'AF-10482', data: somaDias(h, -5), kit: 'kit2', total: 295.8, status: 'transito', previsao: somaDias(h, 3), rastreio: 'AA123456789BR', nf: '000.004.812', etapas: [somaDias(h, -5), somaDias(h, -4), somaDias(h, -2)] },
        { id: 'AF-10211', data: somaDias(h, -38), kit: 'kit1', total: 179.9, status: 'entregue', previsao: somaDias(h, -32), entregue: somaDias(h, -32), rastreio: 'AA987654321BR', nf: '000.004.233', etapas: [somaDias(h, -38), somaDias(h, -37), somaDias(h, -35), somaDias(h, -32)] },
        { id: 'AF-09876', data: somaDias(h, -128), kit: 'kit3', total: 359.7, status: 'entregue', previsao: somaDias(h, -121), entregue: somaDias(h, -122), rastreio: 'AA555444333BR', nf: '000.003.904', etapas: [somaDias(h, -128), somaDias(h, -127), somaDias(h, -125), somaDias(h, -122)] },
      ],
      assinatura: { ativa: true, pausada: false, kit: 'kit2', intervalo: 60, proxima: somaDias(h, 52), cartao: 'Cartão de crédito final 4242' },
      enderecos: [
        { id: 'e1', nome: 'Casa', rua: 'Rua das Laranjeiras, 120, ap. 34', bairro: 'Pinheiros', cidade: 'São Paulo, SP', cep: '05422-000', principal: true },
        { id: 'e2', nome: 'Trabalho', rua: 'Avenida Paulista, 1000, 8º andar', bairro: 'Bela Vista', cidade: 'São Paulo, SP', cep: '01310-100', principal: false },
      ],
      consent: { email: true, whatsapp: false, estatistica: true, marketing: false },
      historico: [{ quando: somaDias(h, -128), o: 'Aceitou a Política de Privacidade (privacidade-v1) no cadastro' }, { quando: somaDias(h, -128), o: 'Ligou novidades por e-mail' }, { quando: somaDias(h, -38), o: 'Ligou cookies de estatística' }],
      chamados: [{ id: 'SAC-2281', data: somaDias(h, -36), assunto: 'Dúvida sobre o modo de uso', status: 'Respondido' }],
    };
  }
  const guarda = {
    ler() { try { return JSON.parse(localStorage.getItem(CHAVE)); } catch (e) { return null; } },
    salvar(c) { try { localStorage.setItem(CHAVE, JSON.stringify(c)); } catch (e) { /* privado */ } },
  };
  let conta = guarda.ler() || contaInicial();
  const salva = () => guarda.salvar(conta);
  const kit = id => KITS.find(k => k.id === id) || KITS[0] || { titulo: 'Kit', potes: 1, total: 0, doses: 30 };
  const principal = () => conta.enderecos.find(e => e.principal) || conta.enderecos[0];

  // ---------- avisos ----------
  const toast = $('[data-toast]'); let tt;
  function avisa(msg) { toast.textContent = msg; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 3600); }
  function confirma({ titulo, texto, sim = 'Confirmar', nao = 'Voltar', perigo = false }) {
    return new Promise(ok => {
      const d = document.createElement('div');
      d.className = 'modal on conf'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
      d.innerHTML = `<div class="modal-caixa conf-caixa"><h2>${titulo}</h2><div class="conf-txt">${texto}</div><div class="btns" data-iguais><button class="btn${perigo ? ' perigo' : ''}" data-s>${sim}</button><button class="btn btn-contorno" data-n>${nao}</button></div></div>`;
      document.body.appendChild(d);
      const fecha = v => { d.remove(); ok(v); };
      $('[data-s]', d).addEventListener('click', () => fecha(true));
      $('[data-n]', d).addEventListener('click', () => fecha(false));
      d.addEventListener('click', e => { if (e.target === d) fecha(false); });
      d.addEventListener('keydown', e => { if (e.key === 'Escape') fecha(false); });
      $('[data-s]', d).focus();
    });
  }

  // ---------- telas: entrar e recuperar ----------
  const telaEntrar = $('[data-tela="entrar"]'), telaPainel = $('[data-tela="painel"]');
  const fEntrar = $('[data-entrar]'), fRec = $('[data-recuperar]');
  function mostraLogin(qual) {
    telaEntrar.hidden = false; telaPainel.hidden = true;
    fEntrar.hidden = qual === 'recuperar'; fRec.hidden = qual !== 'recuperar';
    (qual === 'recuperar' ? $('#rc-email') : $('#en-email')).focus({ preventScroll: true });
  }
  $$('[data-vai]').forEach(b => b.addEventListener('click', () => { history.replaceState(null, '', b.dataset.vai === 'recuperar' ? '#recuperar' : location.pathname); mostraLogin(b.dataset.vai); }));
  fEntrar.addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#en-email').value.trim().toLowerCase(), se = $('#en-senha').value;
    const erro = $('[data-entrar-erro]');
    if (em === conta.cliente.email && se === conta.senha) {
      try { sessionStorage.setItem(SESSAO, '1'); } catch (x) { /* privado */ }
      erro.textContent = ''; abrePainel(location.hash.slice(1) || 'inicio');
    } else erro.textContent = 'E-mail ou senha não conferem. Na demonstração use cliente@aurafresh.com.br e aura2026.';
  });
  let recPasso = 1, codigo = '';
  fRec.addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('[data-rec-msg]');
    if (recPasso === 1) {
      const em = $('#rc-email').value.trim();
      if (!/.+@.+\..+/.test(em)) { msg.textContent = 'Confira o e-mail.'; return; }
      codigo = String(Math.floor(100000 + Math.random() * 900000));
      recPasso = 2; $$('[data-passo="2"]', fRec).forEach(c => { c.hidden = false; }); $('[data-passo="1"]', fRec).hidden = true;
      $('[data-rec-bt]').innerHTML = 'Salvar nova senha ' + seta;
      msg.textContent = `Se esse e-mail tiver cadastro, o código chega em instantes. Na demonstração, o código é ${codigo}.`;
      $('#rc-cod').focus();
      return;
    }
    const cod = $('#rc-cod').value.trim(), nova = $('#rc-nova').value;
    if (cod !== codigo) { msg.textContent = 'Código incorreto ou vencido.'; return; }
    if (nova.length < 8) { msg.textContent = 'A nova senha precisa de pelo menos 8 caracteres.'; return; }
    conta.senha = nova; salva();
    recPasso = 1; fRec.reset(); $$('[data-passo="2"]', fRec).forEach(c => { c.hidden = true; }); $('[data-passo="1"]', fRec).hidden = false;
    $('[data-rec-bt]').innerHTML = 'Enviar código ' + seta; msg.textContent = '';
    mostraLogin('entrar'); $('#en-email').value = conta.cliente.email; avisa('Senha alterada. Entre com a nova senha.');
  });

  // ---------- painel ----------
  const cont = $('[data-conteudo]');
  const status = { pago: 'Pagamento aprovado', separado: 'Em separação', transito: 'Em trânsito', entregue: 'Entregue' };
  const etapasNomes = ['Pagamento aprovado', 'Pedido separado', 'Em trânsito', 'Entregue'];
  function linhaTempo(p) {
    return `<ol class="rastro">${etapasNomes.map((n, i) => `<li class="${p.etapas[i] ? 'on' : ''}${!p.etapas[i] && p.etapas[i - 1] ? ' prox' : ''}"><b>${n}</b><span>${p.etapas[i] ? data(p.etapas[i]) : (i === 3 ? 'Previsão: ' + data(p.previsao) : 'Aguardando')}</span></li>`).join('')}</ol>`;
  }
  const views = {
    inicio() {
      const p = conta.pedidos.find(x => x.status !== 'entregue') || conta.pedidos[0];
      const a = conta.assinatura, k = kit(a.kit);
      return `<header class="vista-cab"><p class="apoio">Início</p><h1>Olá, ${esc(conta.cliente.nome.split(' ')[0])}.</h1></header>
      <div class="cards-inicio">
        <article class="bloco bloco-pedido"><p class="rot">Pedido ${p.id}</p><h2>${status[p.status]}</h2><p class="prev">${p.status === 'entregue' ? 'Entregue em ' + data(p.entregue) : 'Entrega estimada: ' + dataCurta(p.previsao)}</p>${linhaTempo(p)}<div class="btns" data-iguais><a class="btn btn-contorno" href="https://rastreamento.correios.com.br/app/index.php?objeto=${p.rastreio}" target="_blank" rel="noopener">Rastrear ${p.rastreio}</a><button class="btn btn-contorno" data-ir="pedidos">Ver pedidos</button></div></article>
        <article class="bloco bloco-recompra"><p class="rot">Recompra em 1 clique</p><h2>${k.titulo}</h2><p>${k.doses} doses, ${brl(k.total)}, frete grátis. Entrega em ${esc(principal().nome.toLowerCase())}, ${esc(conta.assinatura.cartao.toLowerCase())}.</p><button class="btn btn-lima" data-recompra="${k.id}">Comprar de novo ${seta}</button></article>
        <article class="bloco"><p class="rot">Assinatura</p><h2>${a.ativa ? (a.pausada ? 'Pausada' : 'Ativa') : 'Cancelada'}</h2><p>${a.ativa && !a.pausada ? `${k.titulo} a cada ${a.intervalo} dias. Próxima cobrança em ${data(a.proxima)}.` : 'Sem cobranças programadas.'}</p><button class="btn btn-contorno" data-ir="assinatura">Gerenciar</button></article>
        <article class="bloco"><p class="rot">Ritual</p><h2>${restante()} doses</h2><p>Estimativa do que resta no pote, contando uma dose por dia desde a última entrega.</p><div class="barra-dose"><i style="--k:${restante() / 60}"></i></div></article>
      </div>`;
    },
    pedidos() {
      return `<header class="vista-cab"><p class="apoio">Pedidos</p><h1>Histórico de pedidos</h1></header>
      <div class="lista-pedidos">${conta.pedidos.map(p => { const k = kit(p.kit); return `<details class="pedido"${p.status !== 'entregue' ? ' open' : ''}><summary><span class="ped-id">${p.id}</span><span>${data(p.data)}</span><span>${k.titulo}</span><span>${brl(p.total)}</span><span class="tag tag-${p.status}">${status[p.status]}</span></summary>
        <div class="pedido-corpo">${linhaTempo(p)}<p class="prev">${p.status === 'entregue' ? 'Entregue em ' + data(p.entregue) : 'Entrega estimada: ' + dataCurta(p.previsao)}. Código de rastreio ${p.rastreio || 'gerado após a separação'}.</p>
        <div class="btns" data-iguais><button class="btn" data-recompra="${p.kit}">Recomprar</button><button class="btn btn-contorno" data-nf="${p.id}">Segunda via da nota</button><button class="btn btn-contorno" data-ir="suporte" data-assunto="Problema com o pedido ${p.id}">Preciso de ajuda</button></div></div></details>`; }).join('')}</div>`;
    },
    assinatura() {
      const a = conta.assinatura;
      return `<header class="vista-cab"><p class="apoio">Assinatura</p><h1>Gestão da assinatura</h1><p class="sub">Modelo para quando a AURA Fresh oferecer recorrência. Condições finais a confirmar com o cliente.</p></header>
      ${a.ativa ? `<div class="bloco assin">
        <div class="assin-topo"><div><p class="rot">Situação</p><h2>${a.pausada ? 'Pausada' : 'Ativa'}</h2></div><div><p class="rot">Próxima cobrança</p><h2>${a.pausada ? 'Sem data' : data(a.proxima)}</h2></div><div><p class="rot">Pagamento</p><h2 class="h2-menor">${esc(a.cartao)}</h2></div></div>
        <form class="form assin-form" data-assin>
          <div class="campo"><label for="as-kit">Quantidade por envio</label><select id="as-kit" name="kit">${KITS.map(k => `<option value="${k.id}"${k.id === a.kit ? ' selected' : ''}>${k.titulo}, ${brl(k.total)}</option>`).join('')}</select></div>
          <div class="campo"><label for="as-int">Frequência</label><select id="as-int" name="intervalo">${[30, 60, 90].map(n => `<option value="${n}"${n === a.intervalo ? ' selected' : ''}>A cada ${n} dias</option>`).join('')}</select></div>
          <button class="btn" type="submit">Salvar alterações</button>
        </form>
        <div class="btns assin-acoes" data-iguais><button class="btn btn-contorno" data-assin-acao="pular">Pular o próximo envio</button><button class="btn btn-contorno" data-assin-acao="pausa">${a.pausada ? 'Retomar assinatura' : 'Pausar por 30 dias'}</button><button class="btn btn-contorno perigo-txt" data-assin-acao="cancela">Cancelar assinatura</button></div>
      </div>` : `<div class="bloco"><h2>Assinatura cancelada</h2><p>Você pode voltar quando quiser, sem taxa.</p><button class="btn" data-assin-acao="reativa">Assinar de novo</button></div>`}`;
    },
    notas() {
      return `<header class="vista-cab"><p class="apoio">Notas fiscais</p><h1>Segunda via de nota fiscal</h1><p class="sub">A nota oficial (NF-e) também chega por e-mail quando o pedido é faturado.</p></header>
      <table class="tabela"><thead><tr><th>Pedido</th><th>Nota</th><th>Emissão</th><th>Valor</th><th><span class="so-leitor">Ações</span></th></tr></thead><tbody>${conta.pedidos.filter(p => p.nf).map(p => `<tr><td>${p.id}</td><td>${p.nf}</td><td>${data(p.data)}</td><td>${brl(p.total)}</td><td><button class="btn btn-contorno btn-p" data-nf="${p.id}">Baixar</button></td></tr>`).join('')}</tbody></table>`;
    },
    dados() {
      const c = conta.cliente;
      return `<header class="vista-cab"><p class="apoio">Dados cadastrais</p><h1>Seus dados</h1></header>
      <form class="form bloco" data-dados novalidate>
        <div class="campo"><label for="d-nome">Nome completo</label><input id="d-nome" name="nome" value="${esc(c.nome)}" autocomplete="name" required></div>
        <div class="campo"><label for="d-cpf">CPF</label><input id="d-cpf" name="cpf" value="${esc(c.cpf)}" readonly aria-describedby="d-cpf-n"><span class="msg-erro" id="d-cpf-n" style="color:var(--suave)">Para alterar o CPF, fale com o suporte.</span></div>
        <div class="campo"><label for="d-email">E-mail</label><input id="d-email" name="email" type="email" value="${esc(c.email)}" autocomplete="email" required></div>
        <div class="campo"><label for="d-tel">Celular</label><input id="d-tel" name="telefone" value="${esc(c.telefone)}" autocomplete="tel" inputmode="tel"></div>
        <div class="campo"><label for="d-nasc">Data de nascimento</label><input id="d-nasc" name="nascimento" type="date" value="${esc(c.nascimento)}"></div>
        <button class="btn" type="submit">Salvar dados</button>
      </form>
      <form class="form bloco" data-senha novalidate>
        <h2 class="todo">Trocar senha</h2>
        <div class="campo"><label for="s-atual">Senha atual</label><input id="s-atual" type="password" autocomplete="current-password" required></div>
        <div class="campo"><label for="s-nova">Nova senha</label><input id="s-nova" type="password" autocomplete="new-password" minlength="8" required></div>
        <button class="btn btn-contorno" type="submit">Trocar senha</button>
      </form>`;
    },
    enderecos() {
      return `<header class="vista-cab"><p class="apoio">Endereços</p><h1>Onde entregar</h1></header>
      <div class="enderecos">${conta.enderecos.map(e => `<article class="bloco end${e.principal ? ' principal' : ''}"><p class="rot">${e.principal ? 'Principal' : 'Endereço'}</p><h2>${esc(e.nome)}</h2><p>${esc(e.rua)}<br>${esc(e.bairro)}, ${esc(e.cidade)}<br>CEP ${esc(e.cep)}</p><div class="btns" data-iguais>${e.principal ? '' : `<button class="btn btn-contorno btn-p" data-end-principal="${e.id}">Tornar principal</button>`}<button class="btn btn-contorno btn-p" data-end-edita="${e.id}">Editar</button>${e.principal ? '' : `<button class="btn btn-contorno btn-p perigo-txt" data-end-remove="${e.id}">Remover</button>`}</div></article>`).join('')}
      <button class="bloco end-novo" data-end-edita="novo"><b>Adicionar endereço</b><span>Casa, trabalho ou presente</span></button></div>
      <form class="form bloco" data-end-form hidden novalidate><h2 class="todo" data-end-tit>Novo endereço</h2><input type="hidden" name="id">
        <div class="campo"><label for="ed-nome">Apelido</label><input id="ed-nome" name="nome" required></div>
        <div class="campo"><label for="ed-cep">CEP</label><input id="ed-cep" name="cep" inputmode="numeric" required></div>
        <div class="campo todo"><label for="ed-rua">Rua, número e complemento</label><input id="ed-rua" name="rua" required></div>
        <div class="campo"><label for="ed-bairro">Bairro</label><input id="ed-bairro" name="bairro" required></div>
        <div class="campo"><label for="ed-cid">Cidade e estado</label><input id="ed-cid" name="cidade" required></div>
        <div class="btns todo" data-iguais><button class="btn" type="submit">Salvar endereço</button><button class="btn btn-contorno" type="button" data-end-cancela>Cancelar</button></div>
      </form>`;
    },
    privacidade() {
      const c = conta.consent;
      const op = (k, t, d) => `<label class="ck-op op-claro"><b>${t}</b><small>${d}</small><input class="chave" type="checkbox" data-consent="${k}"${c[k] ? ' checked' : ''}></label>`;
      return `<header class="vista-cab"><p class="apoio">Privacidade e LGPD</p><h1>Seus dados, suas escolhas</h1><p class="sub">Tudo o que você autoriza aparece aqui e pode ser mudado a qualquer momento. Cada mudança fica registrada com data.</p></header>
      <div class="priv">
        <div class="bloco"><h2>Consentimentos</h2><div class="ck-opcoes">${op('email', 'Novidades por e-mail', 'Lançamentos, conteúdo e ofertas.')}${op('whatsapp', 'Mensagens no WhatsApp', 'Lembrete de recompra e ofertas.')}${op('estatistica', 'Cookies de estatística', 'Contagem anônima de visitas.')}${op('marketing', 'Cookies de marketing', 'Anúncios da AURA Fresh em outras redes.')}</div>
          <p class="nota">Mensagens sobre seus pedidos (pagamento, envio e entrega) continuam chegando, porque fazem parte da compra.</p></div>
        <div class="bloco"><h2>Seus direitos</h2><p>Pela Lei 13.709/2018 você pode acessar, corrigir, levar e pedir a exclusão dos seus dados.</p>
          <div class="btns col" data-iguais><button class="btn btn-contorno" data-baixar>Baixar meus dados (JSON)</button><button class="btn btn-contorno" data-ir="dados">Corrigir meus dados</button><button class="btn btn-contorno perigo-txt" data-excluir>Pedir exclusão da conta</button></div>
          <p class="nota">Encarregado de dados: ${esc(EMP.email || '')}. Respondemos em até 15 dias.</p></div>
        <div class="bloco todo"><h2>Histórico de consentimento</h2><ul class="hist">${conta.historico.slice().reverse().map(h => `<li><span>${data(h.quando)}</span>${esc(h.o)}</li>`).join('')}</ul></div>
      </div>`;
    },
    suporte(assunto = '') {
      return `<header class="vista-cab"><p class="apoio">Suporte</p><h1>Como podemos ajudar?</h1></header>
      <div class="suporte">
        <div class="bloco canais"><h2>Fale agora</h2><div class="btns col" data-iguais><a class="btn" href="${EMP.zap || '#'}" target="_blank" rel="noopener">Chamar no WhatsApp</a><a class="btn btn-contorno" href="mailto:${EMP.email}">Escrever para ${EMP.email}</a></div><p class="nota">Segunda a sexta, das 9h às 18h. Resposta em até 1 dia útil.</p></div>
        <form class="form bloco" data-chamado novalidate><h2 class="todo">Abrir chamado</h2>
          <div class="campo todo"><label for="ch-ped">Pedido</label><select id="ch-ped" name="pedido"><option value="">Não é sobre um pedido</option>${conta.pedidos.map(p => `<option${assunto.includes(p.id) ? ' selected' : ''}>${p.id}</option>`).join('')}</select></div>
          <div class="campo todo"><label for="ch-ass">Assunto</label><input id="ch-ass" name="assunto" value="${esc(assunto)}" required></div>
          <div class="campo todo"><label for="ch-msg">Conte o que aconteceu</label><textarea id="ch-msg" name="mensagem" required></textarea></div>
          <button class="btn" type="submit">Enviar chamado</button></form>
        <div class="bloco todo"><h2>Seus chamados</h2><table class="tabela"><thead><tr><th>Protocolo</th><th>Data</th><th>Assunto</th><th>Situação</th></tr></thead><tbody>${conta.chamados.slice().reverse().map(c => `<tr><td>${c.id}</td><td>${data(c.data)}</td><td>${esc(c.assunto)}</td><td>${c.status}</td></tr>`).join('')}</tbody></table></div>
      </div>`;
    },
  };
  function restante() {
    const ult = conta.pedidos.find(p => p.status === 'entregue'); if (!ult) return 0;
    const dias = Math.round((new Date(hoje()) - new Date(ult.entregue)) / 864e5);
    return Math.max(0, kit(ult.kit).doses - dias);
  }

  let abaAtual = 'inicio';
  function abrePainel(aba, extra) {
    telaEntrar.hidden = true; telaPainel.hidden = false;
    $('[data-nome]').textContent = conta.cliente.nome; $('[data-email]').textContent = conta.cliente.email;
    $('[data-avatar]').textContent = conta.cliente.nome.split(' ').map(p => p[0]).slice(0, 2).join('');
    mostra(views[aba] ? aba : 'inicio', extra);
  }
  function mostra(aba, extra) {
    abaAtual = aba;
    $$('[data-aba]').forEach(b => { if (b.dataset.aba === aba) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    cont.innerHTML = views[aba](extra);
    history.replaceState(null, '', '#' + aba);
    cont.focus({ preventScroll: true });
    if (innerWidth < 900) cont.scrollIntoView({ block: 'start' });
  }
  $$('[data-aba]').forEach(b => b.addEventListener('click', () => mostra(b.dataset.aba)));
  $('[data-sair]').addEventListener('click', () => { try { sessionStorage.removeItem(SESSAO); } catch (e) { /* privado */ } history.replaceState(null, '', location.pathname); mostraLogin('entrar'); avisa('Você saiu da conta.'); });

  // ---------- ações dentro do painel (delegação) ----------
  cont.addEventListener('click', async e => {
    const b = e.target.closest('button, a'); if (!b) return;
    if (b.dataset.ir) { mostra(b.dataset.ir, b.dataset.assunto); return; }
    if (b.dataset.recompra) {
      const k = kit(b.dataset.recompra), end = principal();
      const ok = await confirma({ titulo: 'Recomprar em 1 clique', texto: `<p><b>${k.titulo}</b>, ${k.doses} doses: <b>${brl(k.total)}</b>, frete grátis.</p><p>Entrega: ${esc(end.rua)}, ${esc(end.bairro)}, ${esc(end.cidade)}.</p><p>Pagamento: ${esc(conta.assinatura.cartao)}.</p>`, sim: 'Confirmar pedido' });
      if (!ok) return;
      const id = 'AF-' + (10483 + conta.pedidos.length);
      conta.pedidos.unshift({ id, data: hoje(), kit: k.id, total: k.total, status: 'pago', previsao: somaDias(hoje(), 7), rastreio: '', nf: '', etapas: [hoje()] });
      salva(); mostra('pedidos'); avisa(`Pedido ${id} confirmado. Você recebe o rastreio por e-mail e WhatsApp.`);
      return;
    }
    if (b.dataset.nf) { segundaVia(conta.pedidos.find(p => p.id === b.dataset.nf)); return; }
    if (b.dataset.assinAcao) {
      const a = conta.assinatura, acao = b.dataset.assinAcao;
      if (acao === 'pular') { if (!(await confirma({ titulo: 'Pular o próximo envio?', texto: `<p>A cobrança de ${data(a.proxima)} passa para ${data(somaDias(a.proxima, a.intervalo))}.</p>`, sim: 'Pular envio' }))) return; a.proxima = somaDias(a.proxima, a.intervalo); avisa('Próximo envio pulado.'); }
      if (acao === 'pausa') { a.pausada = !a.pausada; if (!a.pausada) a.proxima = somaDias(hoje(), 30); avisa(a.pausada ? 'Assinatura pausada por 30 dias.' : 'Assinatura retomada.'); }
      if (acao === 'cancela') { if (!(await confirma({ titulo: 'Cancelar a assinatura?', texto: '<p>Os pedidos já pagos continuam a caminho. Não há multa nem taxa.</p>', sim: 'Cancelar assinatura', nao: 'Manter', perigo: true }))) return; a.ativa = false; avisa('Assinatura cancelada.'); }
      if (acao === 'reativa') { a.ativa = true; a.pausada = false; a.proxima = somaDias(hoje(), a.intervalo); avisa('Assinatura reativada.'); }
      salva(); mostra('assinatura'); return;
    }
    if (b.dataset.endPrincipal) { conta.enderecos.forEach(x => { x.principal = x.id === b.dataset.endPrincipal; }); salva(); mostra('enderecos'); avisa('Endereço principal atualizado.'); return; }
    if (b.dataset.endRemove) { if (!(await confirma({ titulo: 'Remover endereço?', texto: '<p>Pedidos já feitos não mudam.</p>', sim: 'Remover', perigo: true }))) return; conta.enderecos = conta.enderecos.filter(x => x.id !== b.dataset.endRemove); salva(); mostra('enderecos'); return; }
    if (b.dataset.endEdita) {
      const f = $('[data-end-form]', cont); f.hidden = false; f.reset();
      const en = conta.enderecos.find(x => x.id === b.dataset.endEdita);
      $('[data-end-tit]', f).textContent = en ? 'Editar endereço' : 'Novo endereço';
      if (en) ['id', 'nome', 'cep', 'rua', 'bairro', 'cidade'].forEach(k => { f.elements[k].value = en[k]; });
      f.scrollIntoView({ behavior: 'smooth', block: 'center' }); f.elements.nome.focus({ preventScroll: true });
      return;
    }
    if ('endCancela' in b.dataset) { $('[data-end-form]', cont).hidden = true; return; }
    if ('baixar' in b.dataset) {
      const copia = JSON.parse(JSON.stringify(conta)); delete copia.senha;
      const blob = new Blob([JSON.stringify({ controlador: EMP.razao, cnpj: EMP.cnpj, gerado: new Date().toISOString(), dados: copia }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'meus-dados-aura-fresh.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      conta.historico.push({ quando: hoje(), o: 'Baixou uma cópia dos dados (portabilidade)' }); salva();
      return;
    }
    if ('excluir' in b.dataset) {
      if (!(await confirma({ titulo: 'Pedir a exclusão da conta?', texto: '<p>Apagamos seus dados de cadastro e preferências em até 15 dias. Notas fiscais e registros de compra ficam guardados pelo prazo da lei fiscal.</p>', sim: 'Pedir exclusão', perigo: true }))) return;
      const prot = 'LGPD-' + Math.floor(1000 + Math.random() * 9000);
      conta.chamados.push({ id: prot, data: hoje(), assunto: 'Pedido de exclusão de dados', status: 'Em análise' });
      conta.historico.push({ quando: hoje(), o: `Pediu a exclusão da conta (protocolo ${prot})` }); salva(); mostra('privacidade'); avisa(`Pedido registrado. Protocolo ${prot}.`);
    }
  });
  cont.addEventListener('change', e => {
    const c = e.target.closest('[data-consent]'); if (!c) return;
    conta.consent[c.dataset.consent] = c.checked;
    const nomes = { email: 'novidades por e-mail', whatsapp: 'mensagens no WhatsApp', estatistica: 'cookies de estatística', marketing: 'cookies de marketing' };
    conta.historico.push({ quando: hoje(), o: `${c.checked ? 'Ligou' : 'Desligou'} ${nomes[c.dataset.consent]}` });
    salva(); avisa('Preferência salva.');
    const lista = $('.hist', cont); if (lista) lista.insertAdjacentHTML('afterbegin', `<li><span>${data(hoje())}</span>${c.checked ? 'Ligou' : 'Desligou'} ${nomes[c.dataset.consent]}</li>`);
  });
  cont.addEventListener('submit', e => {
    e.preventDefault(); const f = e.target;
    const faltando = $$('[required]', f).filter(c => !c.value.trim());
    $$('[required]', f).forEach(c => c.classList.toggle('erro', !c.value.trim()));
    if (faltando.length) { faltando[0].focus(); return; }
    if ('assin' in f.dataset) { conta.assinatura.kit = f.elements.kit.value; conta.assinatura.intervalo = +f.elements.intervalo.value; salva(); mostra('assinatura'); avisa('Assinatura atualizada.'); }
    if ('dados' in f.dataset) { ['nome', 'email', 'telefone', 'nascimento'].forEach(k => { conta.cliente[k] = f.elements[k].value.trim(); }); salva(); abrePainel('dados'); avisa('Dados salvos.'); }
    if ('senha' in f.dataset) { if ($('#s-atual').value !== conta.senha) { $('#s-atual').classList.add('erro'); avisa('A senha atual não confere.'); return; } if ($('#s-nova').value.length < 8) { avisa('A nova senha precisa de 8 caracteres.'); return; } conta.senha = $('#s-nova').value; salva(); f.reset(); avisa('Senha trocada.'); }
    if ('endForm' in f.dataset) {
      const v = Object.fromEntries(new FormData(f));
      if (v.id) Object.assign(conta.enderecos.find(x => x.id === v.id), v);
      else conta.enderecos.push({ ...v, id: 'e' + Date.now(), principal: !conta.enderecos.length });
      salva(); mostra('enderecos'); avisa('Endereço salvo.');
    }
    if ('chamado' in f.dataset) {
      const prot = 'SAC-' + Math.floor(2300 + Math.random() * 700);
      conta.chamados.push({ id: prot, data: hoje(), assunto: f.elements.assunto.value.trim(), status: 'Aberto' }); salva(); mostra('suporte'); avisa(`Chamado ${prot} aberto. Respondemos em até 1 dia útil.`);
    }
  });

  // segunda via: documento auxiliar para imprimir ou salvar em PDF
  function segundaVia(p) {
    if (!p || !p.nf) { avisa('A nota deste pedido ainda não foi emitida.'); return; }
    const k = kit(p.kit), end = principal(), c = conta.cliente;
    const w = window.open('', '_blank'); if (!w) { avisa('Permita pop-ups para baixar a nota.'); return; }
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Nota ${p.nf} | AURA Fresh</title><style>body{font:14px/1.5 "DM Sans",Arial,sans-serif;color:#1d2a1f;max-width:760px;margin:40px auto;padding:0 20px}h1{font-size:22px;margin:0 0 4px}table{width:100%;border-collapse:collapse;margin:20px 0}td,th{border:1px solid #c9cfc0;padding:8px;text-align:left}.aviso{background:#f0c6d7;padding:10px 14px;border-radius:8px}button{padding:10px 16px;border:0;border-radius:8px;background:#2b462b;color:#fff;font:inherit;cursor:pointer}@media print{button,.aviso{display:none}}</style></head><body>
      <p class="aviso">Documento auxiliar de demonstração. Na loja real, este botão baixa o PDF e o XML da NF-e emitida pelo sistema fiscal.</p>
      <h1>${esc(EMP.razao)}</h1><p>CNPJ ${esc(EMP.cnpj)}<br>${esc(EMP.endereco)}</p>
      <h2>Nota fiscal ${p.nf}, série 1</h2><p>Emissão: ${data(p.data)}. Pedido ${p.id}.</p>
      <p><b>Destinatário:</b> ${esc(c.nome)}, CPF ${esc(c.cpf)}<br>${esc(end.rua)}, ${esc(end.bairro)}, ${esc(end.cidade)}, CEP ${esc(end.cep)}</p>
      <table><thead><tr><th>Produto</th><th>Qtd.</th><th>Valor</th></tr></thead><tbody><tr><td>AURA Fresh, pó para preparo de bebida, 90 g</td><td>${k.potes}</td><td>${brl(p.total)}</td></tr><tr><td>Frete</td><td></td><td>${brl(0)}</td></tr></tbody><tfoot><tr><th colspan="2">Total</th><th>${brl(p.total)}</th></tr></tfoot></table>
      <button onclick="print()">Imprimir ou salvar em PDF</button></body></html>`);
    w.document.close();
  }

  // ---------- início ----------
  const logado = (() => { try { return sessionStorage.getItem(SESSAO) === '1'; } catch (e) { return false; } })();
  const hash = location.hash.slice(1);
  if (logado) abrePainel(hash || 'inicio');
  else mostraLogin(hash === 'recuperar' ? 'recuperar' : 'entrar');
})();
