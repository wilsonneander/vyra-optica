/* Pistão Auto Center: painel do dono. Login, cadastro de produtos com foto, estoque, pedidos e ajustes.
   Os dados ficam no navegador (assets/loja.js). Sem bibliotecas. */
(() => {
  const D = {"icones":{"mais":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"square\" stroke-linejoin=\"miter\" aria-hidden=\"true\"><path d=\"M12 4v16M4 12h16\"/></svg>","menos":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"square\" stroke-linejoin=\"miter\" aria-hidden=\"true\"><path d=\"M4 12h16\"/></svg>","lixeira":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"square\" stroke-linejoin=\"miter\" aria-hidden=\"true\"><path d=\"M4 7h16M9.5 7V4h5v3M6 7l1 13h10l1-13M10 11v5M14 11v5\"/></svg>","whats":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 5-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2c0 1.2.8 2.3.9 2.5.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.3-.2Z\"/></svg>","foto":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"square\" stroke-linejoin=\"miter\" aria-hidden=\"true\"><path d=\"M3 6h4l2-2h6l2 2h4v13H3z\"/><path d=\"M12 9a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z\"/></svg>"}};
  const L = window.PistaoLoja;
  const I = D.icones;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const raiz = document.documentElement;
  const esc = L.esc;
  const BASE = '../';
  document.documentElement.classList.add('js');
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const corpo = document.body;
  const espera = (ms) => new Promise((ok) => setTimeout(ok, calmo ? 0 : ms));
  // painel aparecendo: topo, resumo e linhas sobem em sequência; a classe sai depois para não repetir a cada filtro
  const animaChegada = () => {
    const app = $('[data-tela-app]');
    app.classList.remove('chega'); void app.offsetWidth; app.classList.add('chega');
    clearTimeout(animaChegada.t);
    animaChegada.t = setTimeout(() => app.classList.remove('chega'), 1800);
  };
  // véu que veio do site some devagar
  requestAnimationFrame(() => requestAnimationFrame(() => corpo.classList.add('pronto')));
  window.addEventListener('pageshow', () => corpo.classList.remove('indo'));
  // voltar ao site: esmaece antes de trocar de página
  $$('a[href^="../index.html"]:not([target])').forEach((a) => a.addEventListener('click', (e) => {
    if (calmo || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;
    e.preventDefault();
    corpo.classList.add('indo');
    setTimeout(() => { location.href = a.href; }, 420);
  }));

  /* ---------- utilidades ---------- */
  const recado = (txt, erro = false) => {
    const r = $('[data-recado]');
    r.textContent = txt;
    r.classList.toggle('erro', erro);
    r.classList.add('mostra');
    clearTimeout(recado.t);
    recado.t = setTimeout(() => r.classList.remove('mostra'), 3200);
  };
  // "1.299,90", "219,9" ou "219.90" viram número
  const numero = (v) => {
    let s = String(v || '').replace(/[^\d,.-]/g, '');
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    const n = parseFloat(s);
    return Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN;
  };
  const paraCampo = (n) => (n || n === 0 ? n.toFixed(2).replace('.', ',') : '');
  const quando = (iso) => {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    return `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };
  const dataBR = (s) => (s ? s.split('-').reverse().join('/') : 'A combinar');
  const hash = async (txt) => {
    try {
      const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('pistao:' + txt));
      return 'sha:' + [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
    } catch (e) { return 'txt:' + txt; } // navegador sem crypto.subtle
  };
  const confere = async (txt) => {
    let salva = null;
    try { salva = localStorage.getItem(L.chaves.senha); } catch (e) { /* sem armazenamento */ }
    if (!salva) return txt === L.painel.senha;
    return salva === (await hash(txt)) || salva === 'txt:' + txt;
  };
  const igualar = () => $$('[data-iguais]').forEach((g) => {
    if (!g.offsetParent) return;
    g.classList.remove('medido');
    const maior = Math.max(...[...g.children].map((c) => c.offsetWidth));
    if (maior > 0) { g.style.setProperty('--larg', maior + 'px'); g.classList.add('medido'); }
  });
  window.addEventListener('resize', () => { clearTimeout(igualar.t); igualar.t = setTimeout(igualar, 120); });

  // letras que rolam no hover (igual ao site)
  $$('[data-rola]').forEach((el) => {
    const txt = el.textContent.trim();
    let n = 0;
    el.setAttribute('aria-label', txt);
    el.innerHTML = txt.split(' ').map((p) => `<span class="p" aria-hidden="true">${[...p].map((l) => `<span class="l" style="--n:${n++}">${l}</span>`).join('')}</span>`).join('');
  });

  /* ---------- tema ---------- */
  const botoesTema = $$('[data-tema-ir]');
  const marcaTema = () => botoesTema.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaIr === raiz.dataset.tema)));
  botoesTema.forEach((b) => b.addEventListener('click', () => {
    raiz.dataset.tema = b.dataset.temaIr;
    try { localStorage.setItem('pistao-tema', raiz.dataset.tema); } catch (e) { /* vale só nesta visita */ }
    marcaTema();
  }));
  marcaTema();

  /* ---------- login ---------- */
  const sessao = {
    ativa: () => { try { return !!(sessionStorage.getItem('pistao-sessao') || localStorage.getItem('pistao-sessao')); } catch (e) { return raiz.classList.contains('logado'); } },
    entra: (manter) => { try { (manter ? localStorage : sessionStorage).setItem('pistao-sessao', String(Date.now())); } catch (e) { /* fica só na memória */ } raiz.classList.add('logado'); },
    sai: () => { try { sessionStorage.removeItem('pistao-sessao'); localStorage.removeItem('pistao-sessao'); } catch (e) { /* nada */ } raiz.classList.remove('logado'); },
  };
  const login = $('[data-login]');
  const avisoLogin = $('[data-aviso]', login);
  let erros = 0, travadoAte = 0;
  $('[data-mostra-senha]').addEventListener('click', (e) => {
    const b = e.currentTarget, campo = login.elements.senha;
    const mostra = campo.type === 'password';
    campo.type = mostra ? 'text' : 'password';
    b.setAttribute('aria-pressed', String(mostra));
    b.setAttribute('aria-label', mostra ? 'Esconder senha' : 'Mostrar senha');
  });
  login.addEventListener('submit', async (e) => {
    e.preventDefault();
    const restam = Math.ceil((travadoAte - Date.now()) / 1000);
    if (restam > 0) { avisoLogin.textContent = `Muitas tentativas. Tente de novo em ${restam} s.`; return; }
    const email = login.elements.email.value.trim().toLowerCase();
    const senha = login.elements.senha.value;
    if (!email || !senha) { avisoLogin.textContent = 'Digite o e-mail e a senha.'; return; }
    if (email === L.painel.email.toLowerCase() && (await confere(senha))) {
      erros = 0;
      avisoLogin.textContent = '';
      const manter = login.elements.manter.checked;
      // login esmaece, depois o painel entra em sequência
      corpo.classList.add('saindo-login');
      await espera(460);
      sessao.entra(manter);
      corpo.classList.remove('saindo-login');
      login.reset();
      scrollTo(0, 0);
      abreApp();
      return;
    }
    erros++;
    if (erros >= 5) { travadoAte = Date.now() + 30000; erros = 0; }
    avisoLogin.textContent = 'E-mail ou senha não conferem.';
    login.classList.remove('treme'); void login.offsetWidth; login.classList.add('treme');
    login.elements.senha.select();
  });
  $('[data-sair]').addEventListener('click', async () => {
    corpo.classList.add('saindo-app');
    await espera(420);
    sessao.sai();
    corpo.classList.remove('saindo-app');
    scrollTo(0, 0);
    login.elements.senha.focus();
  });

  /* ---------- abas ---------- */
  const abas = $$('[data-aba]');
  const mostraAba = (nome, foco = false) => {
    abas.forEach((b) => {
      const sim = b.dataset.aba === nome;
      b.setAttribute('aria-selected', String(sim));
      b.tabIndex = sim ? 0 : -1;
      if (sim && foco) b.focus();
    });
    $$('[data-painel]').forEach((p) => { p.hidden = p.dataset.painel !== nome; });
    try { sessionStorage.setItem('pistao-aba', nome); } catch (e) { /* nada */ }
    igualar();
  };
  abas.forEach((b, i) => {
    b.addEventListener('click', () => mostraAba(b.dataset.aba));
    b.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) mostraAba(abas[(i + d + abas.length) % abas.length].dataset.aba, true);
    });
  });

  /* ---------- resumo ---------- */
  const resumo = () => {
    const ps = L.produtos();
    const novos = L.agendamentos().filter((a) => a.status === 'novo').length;
    const c = {
      vitrine: ps.filter((p) => p.vitrine !== false).length,
      baixo: ps.filter((p) => p.estoque > 0 && p.estoque <= 3).length,
      zero: ps.filter((p) => p.estoque <= 0).length,
      novos,
    };
    Object.entries(c).forEach(([k, v]) => { $(`[data-res="${k}"]`).textContent = v; });
    const cont = $('[data-cont-novos]');
    cont.hidden = !novos;
    cont.textContent = novos;
    const h = new Date().getHours();
    $('[data-ola]').textContent = `${h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'}, ${L.painel.dono}`;
    $('[data-ola-txt]').textContent = novos
      ? `Você tem ${novos} ${novos === 1 ? 'pedido novo esperando' : 'pedidos novos esperando'} resposta.`
      : 'Nenhum pedido novo por enquanto. Veja como está a loja.';
  };
  $$('[data-ir-filtro]').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.irFiltro;
    if (f === 'novos') { filtroStatus = 'novo'; marcaStatus(); desenhaPedidos(); mostraAba('agenda'); return; }
    $('[data-filtro-sit]').value = f;
    mostraAba('produtos');
    desenhaProdutos();
    $('[data-painel="produtos"]').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  /* ---------- produtos ---------- */
  let produtos = [];
  const lista = $('[data-lista]');
  const salva = (msg) => {
    if (!L.salvaProdutos(produtos)) { recado('Não deu para salvar: o navegador ficou sem espaço. Use fotos menores ou apague produtos antigos.', true); return false; }
    if (msg) recado(msg);
    resumo();
    return true;
  };
  const desenhaProdutos = () => {
    const busca = $('[data-busca]').value.trim().toLowerCase();
    const cat = $('[data-filtro-cat]').value;
    const sit = $('[data-filtro-sit]').value;
    const vis = produtos.filter((p) => {
      if (busca && !`${p.nome} ${p.categoria} ${p.descricao || ''}`.toLowerCase().includes(busca)) return false;
      if (cat && p.categoria !== cat) return false;
      if (sit === 'vitrine' && p.vitrine === false) return false;
      if (sit === 'oculto' && p.vitrine !== false) return false;
      if (sit === 'baixo' && !(p.estoque > 0 && p.estoque <= 3)) return false;
      if (sit === 'zero' && p.estoque > 0) return false;
      return true;
    });
    lista.innerHTML = vis.map((p, i) => {
      const [s, sTxt] = L.situacao(p);
      const off = L.desconto(p);
      return `<li class="linha${p.vitrine === false ? ' oculto' : ''}" data-id="${esc(p.id)}" style="--i:${Math.min(i, 12)}">
        <div class="linha-prod">${p.foto ? `<img src="${esc(L.foto(p.foto, BASE))}" alt="" width="76" height="58" loading="lazy">` : `<span class="linha-sem-foto">${I.foto}</span>`}<div><b title="${esc(p.nome)}">${esc(p.nome)}</b><span>${esc(p.categoria)}</span></div></div>
        <div class="linha-preco"><b>${L.preco(p.preco)}</b>${off ? `<s>${L.preco(p.de)}</s>` : ''}</div>
        <div class="linha-estoque"><div class="qtd"><button type="button" data-est="-1" aria-label="Tirar uma unidade de ${esc(p.nome)}">${I.menos}</button><input type="number" min="0" value="${p.estoque}" inputmode="numeric" aria-label="Estoque de ${esc(p.nome)}" data-est-campo><button type="button" data-est="1" aria-label="Somar uma unidade a ${esc(p.nome)}">${I.mais}</button></div><small class="s-${s}">${sTxt}</small></div>
        <label class="chave linha-vit"><input type="checkbox" data-vit${p.vitrine !== false ? ' checked' : ''} aria-label="${esc(p.nome)} na vitrine"><i></i><span class="rot-mob">Vitrine</span></label>
        <label class="chave linha-dest"><input type="checkbox" data-dest${p.destaque ? ' checked' : ''} aria-label="${esc(p.nome)} em destaque"><i></i><span class="rot-mob">Destaque</span></label>
        <div class="linha-acoes"><button type="button" class="caixa-btn" data-editar>Editar</button><button type="button" class="caixa-btn perigo" data-excluir aria-label="Excluir ${esc(p.nome)}">${I.lixeira}</button></div>
      </li>`;
    }).join('');
    $('[data-vazio]').hidden = vis.length > 0;
    $('[data-vazio]').textContent = produtos.length ? 'Nenhum produto encontrado com esses filtros.' : 'Nenhum produto cadastrado ainda. Clique em "Novo produto" para começar.';
  };
  ['[data-busca]', '[data-filtro-cat]', '[data-filtro-sit]'].forEach((s) => $(s).addEventListener('input', desenhaProdutos));

  const doId = (el) => produtos.find((p) => p.id === el.closest('[data-id]').dataset.id);
  const mudaEstoque = (p, valor) => {
    p.estoque = Math.max(0, Math.round(valor) || 0);
    if (salva()) {
      const li = lista.querySelector(`[data-id="${CSS.escape(p.id)}"]`);
      const [s, sTxt] = L.situacao(p);
      $('[data-est-campo]', li).value = p.estoque;
      const sm = $('small', li);
      sm.className = 's-' + s;
      sm.textContent = sTxt;
    }
  };
  lista.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const p = doId(b);
    if (!p) return;
    if (b.dataset.est) mudaEstoque(p, p.estoque + +b.dataset.est);
    else if (b.hasAttribute('data-editar')) abreGaveta(p);
    else if (b.hasAttribute('data-excluir')) confirma(`Excluir produto?`, `"${p.nome}" sai do painel e da vitrine do site. Não dá para desfazer.`).then((sim) => {
      if (!sim) return;
      produtos = produtos.filter((x) => x !== p);
      if (salva('Produto excluído.')) desenhaProdutos();
    });
  });
  lista.addEventListener('change', (e) => {
    const el = e.target;
    const p = doId(el);
    if (!p) return;
    if (el.matches('[data-est-campo]')) mudaEstoque(p, +el.value);
    else if (el.matches('[data-vit]')) { p.vitrine = el.checked; if (salva(el.checked ? 'Produto voltou para a vitrine.' : 'Produto tirado da vitrine.')) el.closest('.linha').classList.toggle('oculto', !el.checked); }
    else if (el.matches('[data-dest]')) { p.destaque = el.checked; salva(el.checked ? 'Produto em destaque na vitrine.' : 'Destaque removido.'); }
  });

  /* ---------- gaveta: novo produto e edição ---------- */
  const gaveta = $('[data-gaveta]');
  const fp = $('[data-form-produto]');
  const avisoP = $('[data-aviso]', fp);
  const prev = $('[data-foto-prev]');
  let editando = null, fotoAtual = '';
  const mostraFoto = (f) => {
    fotoAtual = f || '';
    prev.hidden = !fotoAtual;
    prev.src = fotoAtual ? L.foto(fotoAtual, BASE) : '';
    $('[data-foto-vazia]').hidden = !!fotoAtual;
    $('[data-foto-tira]').hidden = !fotoAtual;
    $('[data-foto-rotulo]').textContent = fotoAtual ? 'Trocar foto' : 'Escolher foto';
  };
  const abreGaveta = (p = null) => {
    editando = p;
    fp.reset();
    $$('.erro', fp).forEach((el) => el.classList.remove('erro'));
    avisoP.textContent = '';
    $('#gaveta-t').textContent = p ? 'Editar produto' : 'Novo produto';
    if (p) {
      fp.elements.nome.value = p.nome;
      fp.elements.categoria.value = p.categoria;
      if (fp.elements.categoria.value !== p.categoria) fp.elements.categoria.add(new Option(p.categoria, p.categoria, true, true));
      fp.elements.estoque.value = p.estoque;
      fp.elements.preco.value = paraCampo(p.preco);
      fp.elements.de.value = p.de ? paraCampo(p.de) : '';
      fp.elements.descricao.value = p.descricao || '';
      fp.elements.vitrine.checked = p.vitrine !== false;
      fp.elements.destaque.checked = !!p.destaque;
    }
    mostraFoto(p ? p.foto : '');
    gaveta.showModal();
    igualar();
    fp.elements.nome.focus();
  };
  $('[data-novo]').addEventListener('click', () => abreGaveta());
  $$('[data-fecha]', gaveta).forEach((b) => b.addEventListener('click', () => gaveta.close()));
  gaveta.addEventListener('click', (e) => { if (e.target === gaveta) gaveta.close(); });

  // foto: reduz para no máximo 900 px e grava em WebP (ou JPEG) para caber no navegador
  const reduz = (arquivo) => new Promise((ok, falha) => {
    if (!arquivo || !arquivo.type.startsWith('image/')) return falha(new Error('Escolha um arquivo de imagem (JPG, PNG ou WebP).'));
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 900 / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k);
      c.height = Math.round(img.naturalHeight * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      let d = c.toDataURL('image/webp', 0.8);
      if (!d.startsWith('data:image/webp')) d = c.toDataURL('image/jpeg', 0.82);
      ok(d);
    };
    img.onerror = () => { URL.revokeObjectURL(url); falha(new Error('Não deu para abrir essa imagem.')); };
    img.src = url;
  });
  const pegaFoto = (arquivo) => reduz(arquivo).then(mostraFoto).catch((err) => { avisoP.className = 'aviso'; avisoP.textContent = err.message; });
  $('[data-foto-input]').addEventListener('change', (e) => { pegaFoto(e.target.files[0]); e.target.value = ''; });
  $('[data-foto-tira]').addEventListener('click', () => mostraFoto(''));
  const zona = $('[data-foto-zona]');
  ['dragenter', 'dragover'].forEach((t) => zona.addEventListener(t, (e) => { e.preventDefault(); zona.classList.add('sobre'); }));
  ['dragleave', 'drop'].forEach((t) => zona.addEventListener(t, () => zona.classList.remove('sobre')));
  zona.addEventListener('drop', (e) => { e.preventDefault(); pegaFoto(e.dataTransfer.files[0]); });

  fp.addEventListener('submit', (e) => {
    e.preventDefault();
    $$('.erro', fp).forEach((el) => el.classList.remove('erro'));
    const el = fp.elements;
    const nome = el.nome.value.trim();
    const preco = numero(el.preco.value);
    const de = el.de.value.trim() ? numero(el.de.value) : null;
    const faltam = [];
    if (!nome) { faltam.push('o nome'); el.nome.classList.add('erro'); }
    if (!(preco > 0)) { faltam.push('um preço válido'); el.preco.classList.add('erro'); }
    if (de !== null && !(de > preco)) { faltam.push('um preço antigo maior que o preço atual (ou deixe em branco)'); el.de.classList.add('erro'); }
    if (faltam.length) { avisoP.className = 'aviso'; avisoP.textContent = `Falta ${faltam.join(', ').replace(/, ([^,]*)$/, ' e $1')}.`; fp.querySelector('.erro').focus(); return; }
    const dados = {
      nome, categoria: el.categoria.value, preco, de,
      estoque: Math.max(0, Math.round(+el.estoque.value) || 0),
      descricao: el.descricao.value.trim(), foto: fotoAtual,
      vitrine: el.vitrine.checked, destaque: el.destaque.checked,
    };
    const antes = produtos.map((p) => ({ ...p }));
    if (editando) Object.assign(editando, dados);
    else produtos.unshift({ id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), ...dados });
    if (!salva(editando ? 'Produto atualizado.' : 'Produto cadastrado e já está na vitrine.')) { produtos = antes; return; }
    if (!editando && !dados.vitrine) recado('Produto cadastrado fora da vitrine.');
    gaveta.close();
    desenhaProdutos();
  });

  /* ---------- confirmação ---------- */
  const caixaConfirma = $('[data-confirma]');
  const confirma = (titulo, texto, botao = 'Excluir') => new Promise((ok) => {
    $('[data-confirma-t]').textContent = titulo;
    $('[data-confirma-p]').textContent = texto;
    $('button[value="sim"]', caixaConfirma).textContent = botao;
    caixaConfirma.returnValue = '';
    caixaConfirma.showModal();
    caixaConfirma.addEventListener('close', () => ok(caixaConfirma.returnValue === 'sim'), { once: true });
  });

  /* ---------- pedidos (agendamentos e reservas) ---------- */
  let filtroStatus = '';
  const STATUS = [['novo', 'Novo'], ['confirmado', 'Confirmado'], ['concluido', 'Concluído'], ['cancelado', 'Cancelado']];
  const caixaPedidos = $('[data-pedidos]');
  const marcaStatus = () => $$('[data-st]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.st === filtroStatus)));
  const desenhaPedidos = () => {
    const tipo = $('[data-filtro-tipo]').value;
    const todos = L.agendamentos();
    const vis = todos.filter((a) => (!filtroStatus || a.status === filtroStatus) && (!tipo || a.tipo === tipo));
    caixaPedidos.innerHTML = vis.map((a) => {
      const fone = String(a.fone || '').replace(/\D/g, '');
      const msg = a.tipo === 'Reserva'
        ? `Olá, ${a.nome.split(' ')[0]}! Aqui é da Pistão Auto Center. Sua reserva de ${a.quantidade}x ${a.produto} está separada.`
        : `Olá, ${a.nome.split(' ')[0]}! Aqui é da Pistão Auto Center. Recebemos seu agendamento de ${a.servico}.`;
      const campos = a.tipo === 'Reserva'
        ? [['Produto', `${a.quantidade}x ${a.produto}`], ['Total', L.preco((a.preco || 0) * (a.quantidade || 1))], ['Como prefere', a.entrega], ['WhatsApp', a.fone]]
        : [['Carro', a.carro], ['Serviço', a.servico], ['Data preferida', `${dataBR(a.data)}${a.periodo ? `, ${String(a.periodo).toLowerCase()}` : ''}`], ['WhatsApp', a.fone]];
      return `<article class="pedido s-${esc(a.status)}" data-pid="${esc(a.id)}">
        <div class="pedido-topo"><span class="pedido-tipo">${esc(a.tipo)}</span><time datetime="${esc(a.recebido)}">Recebido em ${quando(a.recebido)}</time></div>
        <h3>${esc(a.nome)}</h3>
        <dl>${campos.map(([t, v]) => `<div><dt>${t}</dt><dd>${esc(v || 'Não informado')}</dd></div>`).join('')}</dl>
        ${a.msg ? `<p class="pedido-msg">"${esc(a.msg)}"</p>` : ''}
        <div class="pedido-acoes">
          <label class="campo"><span class="sr">Situação do pedido</span><select data-status>${STATUS.map(([v, t]) => `<option value="${v}"${a.status === v ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
          <a class="caixa-btn" href="https://wa.me/55${fone}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${I.whats}<span>Responder</span></a>
          <button type="button" class="caixa-btn perigo" data-apaga aria-label="Excluir pedido de ${esc(a.nome)}">${I.lixeira}</button>
        </div>
      </article>`;
    }).join('');
    const vazio = $('[data-vazio-pedidos]');
    vazio.hidden = vis.length > 0;
    vazio.textContent = todos.length ? 'Nenhum pedido com esse filtro.' : 'Nenhum pedido ainda. Os agendamentos e reservas feitos no site aparecem aqui.';
  };
  $('[data-filtro-status]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-st]');
    if (!b) return;
    filtroStatus = b.dataset.st;
    marcaStatus();
    desenhaPedidos();
  });
  $('[data-filtro-tipo]').addEventListener('input', desenhaPedidos);
  caixaPedidos.addEventListener('change', (e) => {
    if (!e.target.matches('[data-status]')) return;
    const id = e.target.closest('[data-pid]').dataset.pid;
    const todos = L.agendamentos();
    const a = todos.find((x) => x.id === id);
    if (!a) return;
    a.status = e.target.value;
    if (!L.salvaAgendamentos(todos)) return recado('Não deu para salvar a mudança.', true);
    recado(`Pedido de ${a.nome.split(' ')[0]} marcado como ${e.target.selectedOptions[0].text.toLowerCase()}.`);
    resumo();
    desenhaPedidos();
  });
  caixaPedidos.addEventListener('click', (e) => {
    const b = e.target.closest('[data-apaga]');
    if (!b) return;
    const id = b.closest('[data-pid]').dataset.pid;
    const todos = L.agendamentos();
    const a = todos.find((x) => x.id === id);
    confirma('Excluir pedido?', `O pedido de ${a ? a.nome : 'cliente'} sai da lista. Não dá para desfazer.`).then((sim) => {
      if (!sim) return;
      L.salvaAgendamentos(todos.filter((x) => x.id !== id));
      recado('Pedido excluído.');
      resumo();
      desenhaPedidos();
    });
  });

  /* ---------- ajustes ---------- */
  const fs = $('[data-troca-senha]');
  fs.addEventListener('submit', async (e) => {
    e.preventDefault();
    const av = $('[data-aviso]', fs);
    const { atual, nova, repete } = fs.elements;
    av.className = 'aviso';
    if (!(await confere(atual.value))) { av.textContent = 'A senha atual não confere.'; atual.focus(); return; }
    if (nova.value.length < 6) { av.textContent = 'A nova senha precisa ter pelo menos 6 caracteres.'; nova.focus(); return; }
    if (nova.value !== repete.value) { av.textContent = 'As duas senhas novas estão diferentes.'; repete.focus(); return; }
    try { localStorage.setItem(L.chaves.senha, await hash(nova.value)); } catch (err) { av.textContent = 'O navegador não deixou salvar.'; return; }
    fs.reset();
    av.className = 'aviso ok';
    av.textContent = 'Senha trocada. Use a nova senha no próximo acesso.';
  });
  const avisoBackup = $('[data-aviso-backup]');
  $('[data-exporta]').addEventListener('click', () => {
    const dados = { modelo: 'pistao-painel', versao: 1, gerado: new Date().toISOString(), produtos: L.produtos(), pedidos: L.agendamentos() };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(dados, null, 1)], { type: 'application/json' }));
    a.download = `pistao-copia-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    avisoBackup.className = 'aviso ok';
    avisoBackup.textContent = `Cópia baixada com ${dados.produtos.length} produtos e ${dados.pedidos.length} pedidos.`;
  });
  $('[data-importa]').addEventListener('change', async (e) => {
    const arq = e.target.files[0];
    e.target.value = '';
    if (!arq) return;
    avisoBackup.className = 'aviso';
    try {
      const dados = JSON.parse(await arq.text());
      if (dados.modelo !== 'pistao-painel' || !Array.isArray(dados.produtos)) throw new Error();
      const sim = await confirma('Carregar cópia?', `Os produtos e pedidos de agora serão trocados pelos da cópia (${dados.produtos.length} produtos).`, 'Carregar');
      if (!sim) return;
      if (!L.salvaProdutos(dados.produtos) || !L.salvaAgendamentos(Array.isArray(dados.pedidos) ? dados.pedidos : [])) throw new Error('espaco');
      carrega();
      avisoBackup.className = 'aviso ok';
      avisoBackup.textContent = 'Cópia carregada.';
    } catch (err) {
      avisoBackup.textContent = err.message === 'espaco' ? 'O navegador ficou sem espaço para essa cópia.' : 'Esse arquivo não é uma cópia do painel.';
    }
  });
  $('[data-restaura]').addEventListener('click', () => confirma('Restaurar exemplo?', 'Todos os produtos cadastrados serão apagados e a lista de demonstração volta.', 'Restaurar').then((sim) => {
    if (!sim) return;
    L.restauraProdutos();
    carrega();
    recado('Produtos de exemplo restaurados.');
  }));

  /* ---------- início ---------- */
  const carrega = () => { produtos = L.produtos(); desenhaProdutos(); desenhaPedidos(); resumo(); };
  function abreApp() {
    carrega();
    let aba = 'produtos';
    try { aba = sessionStorage.getItem('pistao-aba') || aba; } catch (e) { /* nada */ }
    mostraAba(abas.some((b) => b.dataset.aba === aba) ? aba : 'produtos');
    if (!calmo) animaChegada();
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(igualar);
  }
  // um pedido feito no site em outra aba aparece aqui sem recarregar
  window.addEventListener('storage', (e) => { if (sessao.ativa() && (e.key === L.chaves.agenda || e.key === L.chaves.produtos)) carrega(); });
  if (sessao.ativa()) abreApp();
  else { raiz.classList.remove('logado'); }
})();
