/* Monta Burger: Área do Cliente. Cadastro de produtos e categorias com publicação no site.
   Demonstração: login e dados ficam no navegador (ver cardapio.js). */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const C = window.Cardapio;
  const esc = C.esc;
  const A = C.base.acesso;
  const CHAVE_LOGIN = 'monta-painel-login';
  const SVG = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICO = {
    lapis: SVG('<path d="M5 19l1-4L16 5l3 3L9 18z"/><path d="M14 7l3 3"/>'),
    lixo: SVG('<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>'),
    olho: SVG('<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.5"/>'),
    olhoF: SVG('<path d="M4 4l16 16M10 6.2A9 9 0 0 1 12 6c5.5 0 9 6 9 6a15 15 0 0 1-2.6 3.2M6.5 8A15 15 0 0 0 3 12s3.5 6 9 6a9 9 0 0 0 3-.5"/>'),
    sobe: SVG('<path d="M7 14l5-5 5 5"/>'),
    desce: SVG('<path d="M7 10l5 5 5-5"/>'),
    foto: SVG('<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><circle cx="9" cy="10.5" r="1.8"/><path d="M20 16l-5-4.5-8 7"/>'),
  };

  const igualar = () => {
    $$('[data-iguais]').forEach((g) => {
      if (!g.offsetParent) return;
      g.style.removeProperty('--larg');
      const maior = Math.max(...[...g.children].filter((c) => !c.classList.contains('filtro-marca')).map((c) => c.offsetWidth));
      if (maior > 0) g.style.setProperty('--larg', maior + 'px');
    });
  };
  window.addEventListener('resize', () => { clearTimeout(igualar.t); igualar.t = setTimeout(() => { igualar(); if (window.moverMarca) window.moverMarca(false); }, 120); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(igualar);

  const aviso = $('[data-aviso]');
  const avisar = (html, ms = 2800) => { aviso.innerHTML = html; aviso.classList.add('on'); clearTimeout(avisar.t); avisar.t = setTimeout(() => aviso.classList.remove('on'), ms); };

  /* ---------- login ---------- */
  const login = $('[data-login]');
  const app = $('[data-app]');
  const lf = $('[data-login-form]');
  const cf = $('[data-cadastro-form]');
  // contas: a de demonstração e as criadas no cadastro (demonstração: ficam neste navegador)
  const CHAVE_CONTAS = 'monta-painel-contas';
  const DEMO = { responsavel: A.responsavel, loja: 'Monta Burger, Savassi', email: A.email, senha: A.senha };
  const contasCriadas = () => { try { return JSON.parse(localStorage.getItem(CHAVE_CONTAS)) || []; } catch (e) { return []; } };
  const contas = () => [DEMO, ...contasCriadas()];
  const sessao = () => { try { return sessionStorage.getItem(CHAVE_LOGIN); } catch (e) { return null; } };
  const logado = () => !!sessao();
  const usuario = () => { const s = sessao(); return contas().find((c) => c.email === s) || DEMO; };
  const guardarSessao = (email) => { try { sessionStorage.setItem(CHAVE_LOGIN, email); } catch (er) { /* sem armazenamento */ } };
  const entrar = (animar) => {
    const mostra = () => {
      login.hidden = true; login.classList.remove('saindo'); app.hidden = false;
      const u = usuario();
      $('[data-quem]').textContent = u.responsavel;
      $('[data-quem-loja]').textContent = u.loja;
      iniciar();
    };
    if (animar) { login.classList.add('saindo'); setTimeout(mostra, 420); } else mostra();
  };
  lf.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = lf.email.value.trim().toLowerCase();
    const conta = contas().find((c) => c.email === email && c.senha === lf.senha.value);
    $('[data-login-erro]').hidden = !!conta;
    if (!conta) { lf.senha.select(); return; }
    guardarSessao(conta.email);
    entrar(true);
  });

  // alternar entre entrar e cadastrar
  const telaLogin = (qual, animar = true) => {
    const mostrar = qual === 'cadastro' ? cf : lf, esconder = qual === 'cadastro' ? lf : cf;
    if (!mostrar.hidden) return;
    const troca = () => {
      esconder.hidden = true; esconder.classList.remove('sai'); mostrar.hidden = false;
      const primeiro = mostrar.querySelector(qual === 'cadastro' ? 'input' : '.btn-entrar');
      if (animar && primeiro && matchMedia('(min-width: 801px)').matches) primeiro.focus({ preventScroll: true });
      if (animar) mostrar.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };
    if (animar) { esconder.classList.add('sai'); setTimeout(troca, 260); } else troca();
  };
  $$('[data-ir]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    history.replaceState(null, '', a.dataset.ir === 'cadastro' ? '#cadastro' : location.pathname + location.search);
    telaLogin(a.dataset.ir);
  }));
  if (location.hash === '#cadastro') telaLogin('cadastro', false);

  // máscara do WhatsApp: (31) 99999-0000
  $('[data-mascara-tel]').addEventListener('input', (e) => {
    const n = e.target.value.replace(/\D/g, '').slice(0, 11);
    e.target.value = n.length > 6 ? `(${n.slice(0, 2)}) ${n.slice(2, n.length - 4)}-${n.slice(-4)}` : n.length > 2 ? `(${n.slice(0, 2)}) ${n.slice(2)}` : n;
  });

  cf.addEventListener('submit', (e) => {
    e.preventDefault();
    const erro = $('[data-cad-erro]');
    const v = { responsavel: cf.nome.value.trim(), loja: cf.loja.value.trim(), email: cf.email.value.trim().toLowerCase(), whats: cf.whats.value.trim(), senha: cf.senha.value };
    const falha = (msg, campo) => { erro.textContent = msg; erro.hidden = false; campo.focus(); };
    if (v.responsavel.length < 3) return falha('Digite seu nome.', cf.nome);
    if (v.loja.length < 2) return falha('Digite o nome do estabelecimento.', cf.loja);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) return falha('Confira o e-mail.', cf.email);
    if (contas().some((c) => c.email === v.email)) return falha('Já existe um acesso com este e-mail. Entre com ele ou use outro.', cf.email);
    if (v.whats.replace(/\D/g, '').length < 10) return falha('Confira o WhatsApp com DDD.', cf.whats);
    if (v.senha.length < 6) return falha('A senha precisa ter pelo menos 6 caracteres.', cf.senha);
    if (v.senha !== cf.senha2.value) return falha('As senhas não conferem.', cf.senha2);
    if (!cf.dono.checked) return falha('Confirme que você é o dono ou responsável.', cf.dono);
    erro.hidden = true;
    try { localStorage.setItem(CHAVE_CONTAS, JSON.stringify([...contasCriadas(), v])); } catch (er) { /* sem armazenamento */ }
    guardarSessao(v.email);
    history.replaceState(null, '', location.pathname + location.search);
    entrar(true);
    setTimeout(() => avisar(`Acesso criado. Boas-vindas, ${esc(v.responsavel.split(' ')[0])}!`), 700);
  });
  const sd = $('[data-saudacao]');
  if (sd) { const h = new Date().getHours(); sd.textContent = h < 5 ? 'Boa noite' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; }
  $$('[data-ver-senha]').forEach((bt) => bt.addEventListener('click', (e) => {
    const campo = e.currentTarget.parentElement.querySelector('input');
    const mostrar = campo.type === 'password';
    campo.type = mostrar ? 'text' : 'password';
    e.currentTarget.innerHTML = mostrar ? ICO.olhoF : ICO.olho;
    e.currentTarget.setAttribute('aria-label', mostrar ? 'Esconder senha' : 'Mostrar senha');
  }));
  $('[data-sair]').addEventListener('click', () => { try { sessionStorage.removeItem(CHAVE_LOGIN); } catch (e) { /* nada */ } location.reload(); });

  /* ---------- estado ---------- */
  let d, pub, filtro = 'todas', iniciado = false;
  const salvar = () => { C.salvarRascunho(d); atualizarEstado(); };
  const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const mudancas = () => {
    let n = 0;
    const idsPub = new Map(pub.produtos.map((p) => [p.id, p]));
    d.produtos.forEach((p) => { if (!igual(p, idsPub.get(p.id))) n++; });
    pub.produtos.forEach((p) => { if (!d.produtos.some((x) => x.id === p.id)) n++; });
    if (!igual(d.categorias, pub.categorias)) n++;
    return n;
  };
  const atualizarEstado = () => {
    const n = mudancas();
    const est = $('[data-estado]');
    est.classList.toggle('pendente', n > 0);
    const quando = pub.publicadoEm ? new Date(pub.publicadoEm).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : null;
    est.textContent = n ? `${n} ${n === 1 ? 'alteração esperando' : 'alterações esperando'} publicação` : (quando ? `Tudo publicado em ${quando}` : 'Tudo publicado. Cardápio de demonstração no ar');
    $('[data-publicar]').disabled = !n;
    $('[data-descartar]').hidden = !n;
    if (!n && C.temRascunho()) C.descartar();
  };
  const nomeCat = (id) => (d.categorias.find((c) => c.id === id) || {}).nome || 'Sem categoria';

  /* ---------- telas ---------- */
  $$('[data-tela]').forEach((b) => b.addEventListener('click', () => {
    $$('[data-tela]').forEach((x) => x.classList.toggle('on', x === b));
    $$('[data-tela-box]').forEach((s) => { s.hidden = s.dataset.telaBox !== b.dataset.tela; });
    $('[data-titulo]').textContent = b.textContent.trim();
    igualar();
  }));

  /* ---------- produtos ---------- */
  const lista = $('[data-lista]');
  const pBusca = $('[data-p-busca]');
  const fBox = $('[data-filtros]');
  // dropdown de categorias (só aparece no celular)
  const fSel = $('[data-filtro-sel]'), fsBotao = $('[data-fs-botao]'), fsLista = $('[data-fs-lista]');
  const fsAbrir = (abrir) => {
    fSel.classList.toggle('aberto', abrir);
    fsBotao.setAttribute('aria-expanded', abrir);
    if (abrir) { const on = fsLista.querySelector('[aria-selected="true"]'); if (on) on.focus({ preventScroll: true }); }
  };
  fsBotao.addEventListener('click', () => fsAbrir(!fSel.classList.contains('aberto')));
  fsLista.addEventListener('click', (e) => {
    const op = e.target.closest('[data-fs-op]'); if (!op) return;
    fsAbrir(false); fsBotao.focus({ preventScroll: true });
    if (op.dataset.fsOp === filtro) return;
    filtro = op.dataset.fsOp; desenharFiltros(); trocar(desenharLista);
  });
  fsLista.addEventListener('keydown', (e) => {
    const ops = [...fsLista.querySelectorAll('[data-fs-op]')], i = ops.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); (ops[i + 1] || ops[0]).focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); (ops[i - 1] || ops[ops.length - 1]).focus(); }
  });
  document.addEventListener('click', (e) => { if (!fSel.contains(e.target)) fsAbrir(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && fSel.classList.contains('aberto')) { fsAbrir(false); fsBotao.focus(); } });
  // marcador escuro que desliza até o filtro escolhido
  const moverMarca = (animar = true) => {
    const m = fBox.querySelector('.filtro-marca'), on = fBox.querySelector('[aria-pressed="true"]');
    if (!m || !on || !fBox.offsetParent) return;
    if (!animar) m.style.transition = 'none';
    Object.assign(m.style, { width: on.offsetWidth + 'px', height: on.offsetHeight + 'px', transform: `translate(${on.offsetLeft}px, ${on.offsetTop}px)`, opacity: 1 });
    if (!animar) { void m.offsetWidth; m.style.transition = ''; }
  };
  window.moverMarca = moverMarca;
  const desenharFiltros = () => {
    const cont = (id) => d.produtos.filter((p) => id === 'todas' || p.cat === id).length;
    if (filtro !== 'todas' && !d.categorias.some((c) => c.id === filtro)) filtro = 'todas';
    const cats = [{ id: 'todas', nome: 'Todas' }, ...d.categorias];
    const chave = cats.map((c) => c.id + ':' + c.nome).join('|');
    let novo = false;
    if (fBox.dataset.chave !== chave) {
      novo = true;
      fBox.dataset.chave = chave;
      fBox.innerHTML = '<span class="filtro-marca" aria-hidden="true"></span>' + cats
        .map((c) => `<button type="button" data-filtro="${esc(c.id)}" aria-pressed="false">${esc(c.nome)}<small></small></button>`).join('');
    }
    cats.forEach((c) => {
      const bt = fBox.querySelector(`[data-filtro="${CSS.escape(c.id)}"]`);
      bt.setAttribute('aria-pressed', filtro === c.id);
      bt.querySelector('small').textContent = cont(c.id);
    });
    // no celular os filtros viram uma lista suspensa
    fsLista.innerHTML = cats.map((c) => `<li><button type="button" role="option" data-fs-op="${esc(c.id)}" aria-selected="${filtro === c.id}"><span>${esc(c.nome)}</span><small>${cont(c.id)}</small></button></li>`).join('');
    const atual = cats.find((c) => c.id === filtro) || cats[0];
    $('[data-fs-atual]').textContent = atual.nome;
    $('[data-fs-n]').textContent = cont(atual.id);
    if (novo) { igualar(); requestAnimationFrame(() => moverMarca(false)); } else moverMarca();
  };
  // lista ou grade (guardado neste navegador)
  const CHAVE_VISTA = 'monta-painel-vista';
  let vista = 'lista';
  try { if (localStorage.getItem(CHAVE_VISTA) === 'grade') vista = 'grade'; } catch (e) { /* sem armazenamento */ }
  const aplicarVista = () => {
    lista.classList.toggle('grade', vista === 'grade');
    $$('[data-vista]').forEach((bt) => bt.setAttribute('aria-pressed', bt.dataset.vista === vista));
  };
  aplicarVista();
  // troca suave: a lista some, redesenha e volta
  const trocar = (fn) => {
    clearTimeout(trocar.t);
    lista.classList.add('trocando');
    trocar.t = setTimeout(() => { fn(); lista.classList.remove('trocando'); }, 200);
  };
  $$('[data-vista]').forEach((bt) => bt.addEventListener('click', () => {
    if (bt.dataset.vista === vista) return;
    vista = bt.dataset.vista;
    try { localStorage.setItem(CHAVE_VISTA, vista); } catch (e) { /* nada */ }
    $$('[data-vista]').forEach((x) => x.setAttribute('aria-pressed', x === bt));
    trocar(() => { aplicarVista(); desenharLista(); });
  }));
  const desenharLista = () => {
    desenharFiltros();
    const termo = C.semAcento(pBusca.value.trim());
    const idsPub = new Map(pub.produtos.map((p) => [p.id, p]));
    const ordemCat = (id) => d.categorias.findIndex((c) => c.id === id);
    const itens = d.produtos
      .filter((p) => filtro === 'todas' || p.cat === filtro)
      .filter((p) => !termo || C.semAcento(p.nome + ' ' + (p.desc || '')).includes(termo))
      .sort((a, b) => ordemCat(a.cat) - ordemCat(b.cat));
    lista.innerHTML = itens.length ? itens.map((p, i) => {
      const antes = idsPub.get(p.id);
      const novo = !antes, mudou = !novo && !igual(p, antes);
      const foto = C.foto(p);
      const promo = p.promo && p.promo < p.preco;
      return `<article class="linha${novo || mudou ? ' mudou' : ''}${p.oculto ? ' oculto' : ''}" style="animation-delay:${i * 25}ms">
        ${foto ? `<img src="${esc(foto)}" alt="" width="72" height="72" loading="lazy">` : `<span class="sem-foto">${ICO.foto}</span>`}
        <div><b>${esc(p.nome)}</b><span class="desc">${esc(p.desc || 'Sem descrição')}</span>
          <div class="marcas">${novo ? '<span class="m-novo">Novo, não publicado</span>' : mudou ? '<span class="m-novo">Alterado, não publicado</span>' : ''}${p.oculto ? '<span class="m-oculto">Escondido do site</span>' : ''}${p.destaque ? '<span class="m-dest">Mais pedidos</span>' : ''}${promo ? '<span>Promoção</span>' : ''}</div>
        </div>
        <span class="cat">${esc(nomeCat(p.cat))}</span>
        <span class="preco">${promo ? `<s>${C.real(p.preco)}</s><b>${C.real(p.promo)}</b>` : `<b>${C.real(p.preco)}</b>`}</span>
        <div class="acoes">
          <button type="button" class="b-editar" data-editar="${esc(p.id)}" aria-label="Editar ${esc(p.nome)}" title="Editar">${ICO.lapis}</button>
          <button type="button" class="b-ver" data-ocultar="${esc(p.id)}" aria-label="${p.oculto ? 'Mostrar no site' : 'Esconder do site'}: ${esc(p.nome)}" title="${p.oculto ? 'Mostrar no site' : 'Esconder do site'}">${p.oculto ? ICO.olhoF : ICO.olho}</button>
          <button type="button" class="perigo" data-apagar="${esc(p.id)}" aria-label="Apagar ${esc(p.nome)}" title="Apagar">${ICO.lixo}</button>
        </div>
      </article>`;
    }).join('') : '<p class="lista-vazia">Nenhum produto aqui ainda. Toque em Novo produto para cadastrar.</p>';
    igualar();
  };
  $('[data-filtros]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-filtro]'); if (!b) return;
    if (b.dataset.filtro === filtro) return;
    filtro = b.dataset.filtro; desenharFiltros(); trocar(desenharLista);
  });
  pBusca.addEventListener('input', desenharLista);
  lista.addEventListener('click', (e) => {
    const ed = e.target.closest('[data-editar]'), oc = e.target.closest('[data-ocultar]'), ap = e.target.closest('[data-apagar]');
    if (ed) abrirForm(ed.dataset.editar);
    if (oc) {
      const p = d.produtos.find((x) => x.id === oc.dataset.ocultar);
      if (p.oculto) delete p.oculto; else p.oculto = true;
      salvar(); desenharLista();
    }
    if (ap) {
      const p = d.produtos.find((x) => x.id === ap.dataset.apagar);
      if (!confirm(`Apagar "${p.nome}"? Ele sai do site quando você publicar.`)) return;
      d.produtos = d.produtos.filter((x) => x !== p);
      salvar(); desenharLista(); desenharCats();
      avisar(`${esc(p.nome)} apagado`);
    }
  });

  /* ---------- formulário ---------- */
  const gaveta = $('[data-gaveta]');
  const form = $('[data-form]');
  const prev = $('[data-foto-prev]');
  const erro = $('[data-form-erro]');
  let editando = null, fotoEscolhida = null; // { foto } ou { fotoData }
  const fotosGaleria = () => [...new Set(C.base.produtos.map((p) => p.foto).concat(['derretido', 'cesta', 'combo', 'classico', 'balcao']))];
  const mostrarFoto = () => {
    const src = fotoEscolhida ? (fotoEscolhida.fotoData || `assets/img/${fotoEscolhida.foto}.webp`) : '';
    prev.innerHTML = src ? `<img src="${esc(src)}" alt="Foto do produto">` : `${ICO.foto}<span>Sem foto</span>`;
    $$('[data-galeria] button').forEach((b) => b.setAttribute('aria-pressed', String(!!fotoEscolhida && fotoEscolhida.foto === b.dataset.foto)));
  };
  $('[data-galeria]').innerHTML = fotosGaleria().map((f) => `<button type="button" data-foto="${esc(f)}" aria-pressed="false" aria-label="Usar a foto ${esc(f)}"><img src="assets/img/${esc(f)}.webp" alt="" loading="lazy" width="44" height="44"></button>`).join('');
  $('[data-galeria]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-foto]'); if (!b) return;
    fotoEscolhida = { foto: b.dataset.foto }; mostrarFoto();
  });
  // foto enviada: recorta quadrada e reduz para 640 px antes de guardar
  $('[data-foto-arquivo]').addEventListener('change', (e) => {
    const f = e.target.files[0]; if (!f) return;
    if (!f.type.startsWith('image/')) { avisar('Escolha um arquivo de imagem'); return; }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const lado = Math.min(img.naturalWidth, img.naturalHeight), T = Math.min(640, lado);
      const cv = document.createElement('canvas'); cv.width = cv.height = T;
      cv.getContext('2d').drawImage(img, (img.naturalWidth - lado) / 2, (img.naturalHeight - lado) / 2, lado, lado, 0, 0, T, T);
      let data = cv.toDataURL('image/webp', 0.8);
      if (!data.startsWith('data:image/webp')) data = cv.toDataURL('image/jpeg', 0.82);
      fotoEscolhida = { fotoData: data }; mostrarFoto(); URL.revokeObjectURL(url);
    };
    img.onerror = () => { avisar('Não deu para abrir essa imagem'); URL.revokeObjectURL(url); };
    img.src = url;
    e.target.value = '';
  });

  let focoAntes = null;
  const abrirForm = (id) => {
    focoAntes = document.activeElement;
    editando = id ? d.produtos.find((p) => p.id === id) : null;
    const p = editando || { cat: filtro !== 'todas' ? filtro : (d.categorias[0] || {}).id };
    $('[data-form-titulo]').textContent = editando ? 'Editar produto' : 'Novo produto';
    $('[data-form-cat]').innerHTML = d.categorias.map((c) => `<option value="${esc(c.id)}"${c.id === p.cat ? ' selected' : ''}>${esc(c.nome)}</option>`).join('');
    form.nome.value = p.nome || '';
    form.preco.value = p.preco ? String(p.preco.toFixed(2)).replace('.', ',') : '';
    form.promo.value = p.promo ? String(p.promo.toFixed(2)).replace('.', ',') : '';
    form.desc.value = p.desc || '';
    form.destaque.checked = !!p.destaque;
    form.oculto.checked = !!p.oculto;
    fotoEscolhida = p.fotoData ? { fotoData: p.fotoData } : p.foto ? { foto: p.foto } : null;
    erro.hidden = true;
    mostrarFoto();
    clearTimeout(gavetaT); gaveta.hidden = false; gaveta.classList.remove('fechando'); document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => gaveta.classList.add('aberta')));
    igualar();
    setTimeout(() => form.nome.focus(), 60);
  };
  let gavetaT = 0;
  const fecharForm = () => {
    if (gaveta.hidden) return;
    gaveta.classList.add('fechando'); gaveta.classList.remove('aberta'); document.body.style.overflow = '';
    gavetaT = setTimeout(() => { gaveta.hidden = true; gaveta.classList.remove('fechando'); }, 650);
    if (focoAntes) focoAntes.focus({ preventScroll: true });
  };
  $('[data-novo]').addEventListener('click', () => abrirForm(null));
  $$('[data-fechar]', gaveta).forEach((b) => b.addEventListener('click', fecharForm));
  document.addEventListener('keydown', (e) => {
    if (gaveta.hidden) return;
    if (e.key === 'Escape') fecharForm();
    if (e.key === 'Tab') {
      const f = $$('button, input, select, textarea, label.btn', gaveta).filter((x) => x.offsetParent && !(x.type === 'file'));
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const preco = C.numero(form.preco.value);
    const promo = C.numero(form.promo.value);
    const falha = (t, campo) => { erro.textContent = t; erro.hidden = false; campo.focus(); };
    if (!nome) return falha('Dê um nome ao produto.', form.nome);
    if (!preco || preco <= 0 || isNaN(preco)) return falha('Informe o preço, por exemplo 29,90.', form.preco);
    if (promo !== null && (isNaN(promo) || promo <= 0 || promo >= preco)) return falha('O preço de promoção precisa ser menor que o preço normal.', form.promo);
    if (!form.cat.value) return falha('Crie uma categoria antes de cadastrar produtos.', form.cat);
    const p = editando || { id: `${C.slug(nome)}-${Math.random().toString(36).slice(2, 6)}` };
    Object.assign(p, { nome, cat: form.cat.value, preco, desc: form.desc.value.trim() });
    if (promo) p.promo = promo; else delete p.promo;
    if (form.destaque.checked) p.destaque = true; else delete p.destaque;
    if (form.oculto.checked) p.oculto = true; else delete p.oculto;
    delete p.foto; delete p.fotoData;
    if (fotoEscolhida) Object.assign(p, fotoEscolhida);
    if (!editando) d.produtos.unshift(p);
    salvar();
    if (!editando) filtro = p.cat;
    desenharLista(); desenharCats();
    fecharForm();
    avisar(`${esc(nome)} salvo. Publique para aparecer no site.`);
  });

  /* ---------- categorias ---------- */
  const cats = $('[data-cats]');
  const desenharCats = () => {
    cats.innerHTML = d.categorias.map((c, i) => {
      const n = d.produtos.filter((p) => p.cat === c.id).length;
      return `<li style="animation-delay:${i * 30}ms">
        <label><span class="sr">Nome da categoria</span><input value="${esc(c.nome)}" data-renomear="${esc(c.id)}" maxlength="24"></label>
        <span class="n">${n} ${n === 1 ? 'produto' : 'produtos'}</span>
        <div class="acoes">
          <button type="button" data-mover="-1" data-id="${esc(c.id)}" aria-label="Subir ${esc(c.nome)}"${i ? '' : ' disabled'}>${ICO.sobe}</button>
          <button type="button" data-mover="1" data-id="${esc(c.id)}" aria-label="Descer ${esc(c.nome)}"${i < d.categorias.length - 1 ? '' : ' disabled'}>${ICO.desce}</button>
          <button type="button" class="perigo" data-apagar-cat="${esc(c.id)}" aria-label="Apagar ${esc(c.nome)}" title="${n ? 'Mova ou apague os produtos antes' : 'Apagar'}"${n ? ' disabled' : ''}>${ICO.lixo}</button>
        </div>
      </li>`;
    }).join('');
  };
  $('[data-cat-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = e.target.nome.value.trim(); if (!nome) return;
    if (d.categorias.some((c) => C.semAcento(c.nome) === C.semAcento(nome))) { avisar('Essa categoria já existe'); return; }
    let id = C.slug(nome); while (d.categorias.some((c) => c.id === id)) id += '-2';
    d.categorias.push({ id, nome });
    e.target.reset(); salvar(); desenharCats(); desenharFiltros();
    avisar(`Categoria ${esc(nome)} criada`);
  });
  cats.addEventListener('change', (e) => {
    const inp = e.target.closest('[data-renomear]'); if (!inp) return;
    const c = d.categorias.find((x) => x.id === inp.dataset.renomear);
    const nome = inp.value.trim();
    if (!nome) { inp.value = c.nome; return; }
    c.nome = nome; salvar(); desenharFiltros();
  });
  cats.addEventListener('click', (e) => {
    const mv = e.target.closest('[data-mover]'), ap = e.target.closest('[data-apagar-cat]');
    if (mv) {
      const i = d.categorias.findIndex((c) => c.id === mv.dataset.id), j = i + +mv.dataset.mover;
      if (j < 0 || j >= d.categorias.length) return;
      [d.categorias[i], d.categorias[j]] = [d.categorias[j], d.categorias[i]];
      salvar(); desenharCats();
      const alvo = $(`[data-mover="${mv.dataset.mover}"][data-id="${mv.dataset.id}"]`, cats);
      if (alvo && !alvo.disabled) alvo.focus();
    }
    if (ap) {
      const c = d.categorias.find((x) => x.id === ap.dataset.apagarCat);
      if (!confirm(`Apagar a categoria "${c.nome}"?`)) return;
      d.categorias = d.categorias.filter((x) => x !== c);
      salvar(); desenharCats(); desenharFiltros();
    }
  });

  /* ---------- publicar ---------- */
  $('[data-publicar]').addEventListener('click', () => {
    if (!C.publicar()) { avisar('Não foi possível salvar. O navegador está sem espaço ou bloqueando o armazenamento.'); return; }
    pub = C.publicado(); d = C.rascunho();
    desenharLista(); desenharCats(); atualizarEstado();
    avisar('Cardápio publicado no site. <a href="index.html#cardapio" target="_blank" rel="noopener">Ver agora</a>', 5000);
  });
  $('[data-descartar]').addEventListener('click', () => {
    if (!confirm('Descartar tudo o que ainda não foi publicado?')) return;
    C.descartar(); d = C.rascunho();
    desenharLista(); desenharCats(); atualizarEstado();
  });
  $('[data-restaurar]').addEventListener('click', () => {
    if (!confirm('Voltar ao cardápio original da demonstração? O site também volta ao original.')) return;
    C.restaurar(); pub = C.publicado(); d = C.rascunho();
    desenharLista(); desenharCats(); atualizarEstado();
    avisar('Cardápio original restaurado');
  });

  function iniciar() {
    if (iniciado) return; iniciado = true;
    pub = C.publicado(); d = C.rascunho();
    desenharLista(); desenharCats(); atualizarEstado();
  }
  if (logado()) entrar();
})();
