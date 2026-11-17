/* Tampinha Gold: Área do Cliente. Cadastro de bebidas e categorias e horário de funcionamento,
   com publicação no site. Demonstração: login e dados ficam no navegador (ver loja.js). */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const L = window.Loja;
  const HR = window.Horario;
  const esc = L.esc;
  const A = L.base.acesso;
  const CHAVE_LOGIN = 'tampinha-gold-login';
  const CHAVE_CONTAS = 'tampinha-gold-contas';
  const CHAVE_VISTA = 'tampinha-gold-vista';
  const SVG = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICO = {
    lapis: SVG('<path d="M5 19 L6 15 L16 5 L19 8 L9 18 Z"/><path d="M14 7 L17 10"/>'),
    lixo: SVG('<path d="M5 7 H19 M9.5 7 V4.5 H14.5 V7 M7 7 L8 20 H16 L17 7"/>'),
    olho: SVG('<path d="M2.5 12 C5 7.5 8.3 5.5 12 5.5 C15.7 5.5 19 7.5 21.5 12 C19 16.5 15.7 18.5 12 18.5 C8.3 18.5 5 16.5 2.5 12 Z"/><circle cx="12" cy="12" r="2.6"/>'),
    olhoF: SVG('<path d="M4 4 L20 20 M10 6.2 A9 9 0 0 1 12 6 C17.5 6 21 12 21 12 A15 15 0 0 1 18.4 15.2 M6.5 8 A15 15 0 0 0 3 12 C3 12 6.5 18 12 18 A9 9 0 0 0 15 17.5"/>'),
    sobe: SVG('<path d="M7 14 L12 9 L17 14"/>'),
    desce: SVG('<path d="M7 10 L12 15 L17 10"/>'),
    foto: SVG('<rect x="3.5" y="6" width="17" height="13" rx="2"/><path d="M9 6 L10.5 3.5 H13.5 L15 6"/><circle cx="12" cy="12.5" r="3.2"/>'),
  };

  // grupos com a mesma largura (regra das diretrizes)
  const igualar = () => $$('[data-iguais]').forEach((g) => {
    if (!g.offsetParent) return;
    g.style.removeProperty('--larg');
    const kids = [...g.children];
    kids.forEach((k) => { k.style.width = 'auto'; });
    const maior = Math.max(...kids.map((k) => k.getBoundingClientRect().width));
    kids.forEach((k) => { k.style.width = ''; });
    if (maior > 0) g.style.setProperty('--larg', Math.ceil(maior) + 'px');
  });
  addEventListener('resize', () => { clearTimeout(igualar.t); igualar.t = setTimeout(igualar, 120); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(igualar);

  const aviso = $('[data-aviso]');
  const avisar = (html, ms = 2800) => { aviso.innerHTML = html; aviso.classList.add('on'); clearTimeout(avisar.t); avisar.t = setTimeout(() => aviso.classList.remove('on'), ms); };

  /* ---------- login e cadastro ---------- */
  const login = $('[data-login]');
  const app = $('[data-app]');
  const lf = $('[data-login-form]');
  const cf = $('[data-cadastro-form]');
  const DEMO = { responsavel: A.responsavel, loja: 'Tampinha Bebidas, Floresta', email: A.email, senha: A.senha };
  const contasCriadas = () => { try { return JSON.parse(localStorage.getItem(CHAVE_CONTAS)) || []; } catch (e) { return []; } };
  const contas = () => [DEMO, ...contasCriadas()];
  const sessao = () => { try { return sessionStorage.getItem(CHAVE_LOGIN); } catch (e) { return null; } };
  const usuario = () => { const s = sessao(); return contas().find((c) => c.email === s) || DEMO; };
  const guardarSessao = (email) => { try { sessionStorage.setItem(CHAVE_LOGIN, email); } catch (e) { /* sem armazenamento */ } };
  const entrar = (animar) => {
    const mostra = () => {
      login.hidden = true; login.classList.remove('saindo'); app.hidden = false;
      const u = usuario();
      $('[data-quem]').textContent = u.responsavel;
      $('[data-quem-loja]').textContent = u.loja;
      iniciar();
    };
    if (animar) { login.classList.add('saindo'); setTimeout(mostra, 450); } else mostra();
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
  const telaLogin = (qual, animar = true) => {
    const mostrar = qual === 'cadastro' ? cf : lf, esconder = qual === 'cadastro' ? lf : cf;
    if (!mostrar.hidden) return;
    const troca = () => {
      esconder.hidden = true; esconder.classList.remove('sai'); mostrar.hidden = false;
      if (animar) mostrar.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      igualar();
    };
    if (animar) { esconder.classList.add('sai'); setTimeout(troca, 260); } else troca();
  };
  $$('[data-ir]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    history.replaceState(null, '', a.dataset.ir === 'cadastro' ? '#cadastro' : location.pathname + location.search);
    telaLogin(a.dataset.ir);
  }));
  if (location.hash === '#cadastro') telaLogin('cadastro', false);
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
  const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const salvar = () => { L.salvarRascunho(d); atualizarEstado(); };
  const mudancas = () => {
    let n = 0;
    const idsPub = new Map(pub.produtos.map((p) => [p.id, p]));
    d.produtos.forEach((p) => { if (!igual(p, idsPub.get(p.id))) n++; });
    pub.produtos.forEach((p) => { if (!d.produtos.some((x) => x.id === p.id)) n++; });
    if (!igual(d.categorias, pub.categorias)) n++;
    if (!igual(d.abertura, pub.abertura)) n++;
    return n;
  };
  const atualizarEstado = () => {
    const n = mudancas();
    const est = $('[data-estado]');
    est.classList.toggle('pendente', n > 0);
    const quando = pub.publicadoEm ? new Date(pub.publicadoEm).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : null;
    est.textContent = n ? `${n} ${n === 1 ? 'alteração esperando' : 'alterações esperando'} publicação` : (quando ? `Tudo publicado em ${quando}` : 'Tudo publicado. Catálogo de demonstração no ar');
    $('[data-publicar]').disabled = !n;
    $('[data-descartar]').hidden = !n;
    if (!n && L.temRascunho()) L.descartar();
    igualar();
  };
  const nomeCat = (id) => (d.categorias.find((c) => c.id === id) || {}).nome || 'Sem categoria';

  /* ---------- telas ---------- */
  const titulos = { produtos: 'Produtos', categorias: 'Categorias', horarios: 'Horário de funcionamento' };
  $$('[data-tela]').forEach((b) => b.addEventListener('click', () => {
    $$('[data-tela]').forEach((x) => x.classList.toggle('on', x === b));
    $$('[data-tela-box]').forEach((s) => { s.hidden = s.dataset.telaBox !== b.dataset.tela; });
    $('[data-titulo]').textContent = titulos[b.dataset.tela];
    igualar();
  }));

  /* ---------- produtos ---------- */
  const lista = $('[data-lista]');
  const pBusca = $('[data-p-busca]');
  const pCat = $('[data-p-cat]');
  let vista = 'lista';
  try { if (localStorage.getItem(CHAVE_VISTA) === 'grade') vista = 'grade'; } catch (e) { /* sem armazenamento */ }
  const aplicarVista = () => {
    lista.classList.toggle('grade', vista === 'grade');
    $$('[data-vista]').forEach((bt) => bt.setAttribute('aria-pressed', bt.dataset.vista === vista));
  };
  aplicarVista();
  const trocar = (fn) => { clearTimeout(trocar.t); lista.classList.add('trocando'); trocar.t = setTimeout(() => { fn(); lista.classList.remove('trocando'); }, 180); };
  $$('[data-vista]').forEach((bt) => bt.addEventListener('click', () => {
    if (bt.dataset.vista === vista) return;
    vista = bt.dataset.vista;
    try { localStorage.setItem(CHAVE_VISTA, vista); } catch (e) { /* nada */ }
    trocar(() => { aplicarVista(); desenharLista(); });
  }));
  const desenharFiltro = () => {
    if (filtro !== 'todas' && !d.categorias.some((c) => c.id === filtro)) filtro = 'todas';
    const cont = (id) => d.produtos.filter((p) => id === 'todas' || p.cat === id).length;
    pCat.innerHTML = [{ id: 'todas', nome: 'Todas' }, ...d.categorias].map((c) => `<option value="${esc(c.id)}"${c.id === filtro ? ' selected' : ''}>${esc(c.nome)} (${cont(c.id)})</option>`).join('');
  };
  pCat.addEventListener('change', () => { filtro = pCat.value; trocar(desenharLista); });
  const desenharLista = () => {
    desenharFiltro();
    const termo = L.semAcento(pBusca.value.trim());
    const idsPub = new Map(pub.produtos.map((p) => [p.id, p]));
    const ordemCat = (id) => d.categorias.findIndex((c) => c.id === id);
    const itens = d.produtos
      .filter((p) => filtro === 'todas' || p.cat === filtro)
      .filter((p) => !termo || L.semAcento(`${p.nome} ${p.marca || ''} ${p.vol || ''}`).includes(termo))
      .sort((a, b) => ordemCat(a.cat) - ordemCat(b.cat));
    $('[data-p-conta]').textContent = itens.length === 1 ? '1 bebida' : `${itens.length} bebidas`;
    lista.innerHTML = itens.length ? itens.map((p, i) => {
      const antes = idsPub.get(p.id);
      const novo = !antes, mudou = !novo && !igual(p, antes);
      const foto = L.foto(p);
      return `<article class="linha${novo || mudou ? ' mudou' : ''}${p.oculto ? ' oculto' : ''}${p.amb && !p.fotoData ? ' amb' : ''}" style="animation-delay:${Math.min(i, 20) * 22}ms">
        <span class="linha-foto">${foto ? `<img src="${esc(foto)}" alt="" loading="lazy">` : ICO.foto}</span>
        <div class="linha-txt"><small>${esc(p.marca || nomeCat(p.cat))}</small><b>${esc(p.nome)}</b><span>${esc(p.vol || '')}</span>
          <div class="marcas">${novo ? '<span class="m-novo">Nova, não publicada</span>' : mudou ? '<span class="m-novo">Alterada, não publicada</span>' : ''}${p.oculto ? '<span class="m-oculto">Escondida do site</span>' : ''}${p.destaque ? '<span>Seleção da casa</span>' : ''}${p.alc ? '<span>+18</span>' : ''}</div>
        </div>
        <span class="linha-cat">${esc(nomeCat(p.cat))}</span>
        <span class="linha-preco">${L.real(p.preco)}</span>
        <div class="acoes">
          <button type="button" class="b-editar" data-editar="${esc(p.id)}" aria-label="Editar ${esc(p.nome)}" title="Editar">${ICO.lapis}</button>
          <button type="button" class="b-ver" data-ocultar="${esc(p.id)}" aria-label="${p.oculto ? 'Mostrar no site' : 'Esconder do site'}: ${esc(p.nome)}" title="${p.oculto ? 'Mostrar no site' : 'Esconder do site'}">${p.oculto ? ICO.olhoF : ICO.olho}</button>
          <button type="button" class="perigo" data-apagar="${esc(p.id)}" aria-label="Apagar ${esc(p.nome)}" title="Apagar">${ICO.lixo}</button>
        </div>
      </article>`;
    }).join('') : '<p class="lista-vazia">Nenhuma bebida aqui ainda. Toque em Nova bebida para cadastrar.</p>';
  };
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
      if (!confirm(`Apagar "${p.nome}"? Ela sai do site quando você publicar.`)) return;
      d.produtos = d.produtos.filter((x) => x !== p);
      salvar(); desenharLista(); desenharCats();
      avisar(`${esc(p.nome)} apagada`);
    }
  });

  /* ---------- formulário da bebida ---------- */
  const gaveta = $('[data-gaveta]');
  const form = $('[data-form]');
  const prev = $('[data-foto-prev]');
  const erro = $('[data-form-erro]');
  let editando = null, fotoEscolhida = null; // { img } ou { fotoData }
  const mostrarFoto = () => {
    const src = fotoEscolhida ? (fotoEscolhida.fotoData || fotoEscolhida.img) : '';
    prev.innerHTML = src ? `<img src="${esc(src)}" alt="Foto da bebida">` : `${ICO.foto}<span>Sem foto</span>`;
    prev.classList.toggle('amb', !!(fotoEscolhida && fotoEscolhida.amb));
    $$('[data-galeria] button').forEach((b) => b.setAttribute('aria-pressed', String(!!fotoEscolhida && fotoEscolhida.img === b.dataset.img)));
  };
  $('[data-galeria]').innerHTML = L.base.galeria.map((f) => `<button type="button" data-img="${esc(f)}" aria-pressed="false" aria-label="Usar esta foto"><img src="${esc(f)}" alt="" loading="lazy"></button>`).join('');
  $('[data-galeria]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-img]'); if (!b) return;
    fotoEscolhida = { img: b.dataset.img, ...(b.dataset.img.includes('/ambiente/') ? { amb: true } : {}) };
    mostrarFoto();
  });
  // foto enviada: reduz para no máximo 640 px mantendo a proporção e o fundo transparente
  $('[data-foto-arquivo]').addEventListener('change', (e) => {
    const f = e.target.files[0]; if (!f) return;
    if (!f.type.startsWith('image/')) { avisar('Escolha um arquivo de imagem'); return; }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 640 / Math.max(img.naturalWidth, img.naturalHeight));
      const cv = document.createElement('canvas');
      cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      let data = cv.toDataURL('image/webp', 0.82);
      if (!data.startsWith('data:image/webp')) data = cv.toDataURL('image/png');
      fotoEscolhida = { fotoData: data }; mostrarFoto(); URL.revokeObjectURL(url);
    };
    img.onerror = () => { avisar('Não deu para abrir essa imagem'); URL.revokeObjectURL(url); };
    img.src = url;
    e.target.value = '';
  });
  const catAlc = (id) => !!(d.categorias.find((c) => c.id === id) || {}).alc;
  form.cat.addEventListener('change', () => { if (!editando) form.alc.checked = catAlc(form.cat.value); });

  let focoAntes = null, gavetaT = 0;
  const abrirForm = (id) => {
    focoAntes = document.activeElement;
    editando = id ? d.produtos.find((p) => p.id === id) : null;
    const p = editando || { cat: filtro !== 'todas' ? filtro : (d.categorias[0] || {}).id };
    $('[data-form-titulo]').textContent = editando ? 'Editar bebida' : 'Nova bebida';
    $('[data-form-cat]').innerHTML = d.categorias.map((c) => `<option value="${esc(c.id)}"${c.id === p.cat ? ' selected' : ''}>${esc(c.nome)}</option>`).join('');
    form.nome.value = p.nome || '';
    form.marca.value = p.marca || '';
    form.vol.value = p.vol || '';
    form.preco.value = p.preco ? p.preco.toFixed(2).replace('.', ',') : '';
    form.alc.checked = editando ? !!p.alc : catAlc(p.cat);
    form.destaque.checked = !!p.destaque;
    form.oculto.checked = !!p.oculto;
    fotoEscolhida = p.fotoData ? { fotoData: p.fotoData } : p.img ? { img: p.img, ...(p.amb ? { amb: true } : {}) } : null;
    erro.hidden = true;
    mostrarFoto();
    clearTimeout(gavetaT); gaveta.hidden = false; gaveta.classList.remove('fechando'); document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => gaveta.classList.add('aberta')));
    igualar();
    setTimeout(() => form.nome.focus({ preventScroll: true }), 80);
  };
  const fecharForm = () => {
    if (gaveta.hidden) return;
    gaveta.classList.add('fechando'); gaveta.classList.remove('aberta'); document.body.style.overflow = '';
    gavetaT = setTimeout(() => { gaveta.hidden = true; gaveta.classList.remove('fechando'); }, 600);
    if (focoAntes) focoAntes.focus({ preventScroll: true });
  };
  $('[data-novo]').addEventListener('click', () => abrirForm(null));
  $$('[data-fechar]', gaveta).forEach((b) => b.addEventListener('click', fecharForm));
  document.addEventListener('keydown', (e) => {
    if (gaveta.hidden) return;
    if (e.key === 'Escape') fecharForm();
    if (e.key === 'Tab') {
      const f = $$('button, input, select, textarea, label.btn', gaveta).filter((x) => x.offsetParent && x.type !== 'file');
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const preco = L.numero(form.preco.value);
    const falha = (t, campo) => { erro.textContent = t; erro.hidden = false; campo.focus(); };
    if (!nome) return falha('Dê um nome à bebida.', form.nome);
    if (!form.vol.value.trim()) return falha('Informe a embalagem, por exemplo lata 350ml.', form.vol);
    if (!preco || preco <= 0 || isNaN(preco)) return falha('Informe o preço, por exemplo 6,49.', form.preco);
    if (!form.cat.value) return falha('Crie uma categoria antes de cadastrar bebidas.', form.cat);
    const p = editando || { id: `${L.slug(nome)}-${Math.random().toString(36).slice(2, 6)}`, cor: '#B08D57' };
    Object.assign(p, { nome, marca: form.marca.value.trim(), vol: form.vol.value.trim(), cat: form.cat.value, preco, alc: form.alc.checked });
    if (form.destaque.checked) p.destaque = true; else delete p.destaque;
    if (form.oculto.checked) p.oculto = true; else delete p.oculto;
    delete p.img; delete p.fotoData; delete p.amb;
    if (fotoEscolhida) Object.assign(p, fotoEscolhida);
    if (!editando) d.produtos.unshift(p);
    salvar();
    if (!editando) filtro = p.cat;
    desenharLista(); desenharCats();
    fecharForm();
    avisar(`${esc(nome)} salva. Publique para aparecer no site.`);
  });

  /* ---------- categorias ---------- */
  const cats = $('[data-cats]');
  const desenharCats = () => {
    cats.innerHTML = d.categorias.map((c, i) => {
      const n = d.produtos.filter((p) => p.cat === c.id).length;
      return `<li style="animation-delay:${i * 30}ms">
        <label class="cat-nome"><span class="sr">Nome da categoria</span><input value="${esc(c.nome)}" data-renomear="${esc(c.id)}" maxlength="24"></label>
        <label class="check mini"><input type="checkbox" data-cat-alc="${esc(c.id)}"${c.alc ? ' checked' : ''}><span>+18</span></label>
        <span class="n">${n} ${n === 1 ? 'bebida' : 'bebidas'}</span>
        <div class="acoes">
          <button type="button" data-mover="-1" data-id="${esc(c.id)}" aria-label="Subir ${esc(c.nome)}"${i ? '' : ' disabled'}>${ICO.sobe}</button>
          <button type="button" data-mover="1" data-id="${esc(c.id)}" aria-label="Descer ${esc(c.nome)}"${i < d.categorias.length - 1 ? '' : ' disabled'}>${ICO.desce}</button>
          <button type="button" class="perigo" data-apagar-cat="${esc(c.id)}" aria-label="Apagar ${esc(c.nome)}" title="${n ? 'Mova ou apague as bebidas antes' : 'Apagar'}"${n ? ' disabled' : ''}>${ICO.lixo}</button>
        </div>
      </li>`;
    }).join('');
  };
  $('[data-cat-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target, nome = f.nome.value.trim(); if (!nome) return;
    if (d.categorias.some((c) => L.semAcento(c.nome) === L.semAcento(nome))) { avisar('Essa categoria já existe'); return; }
    let id = L.slug(nome); while (d.categorias.some((c) => c.id === id)) id += '-2';
    d.categorias.push({ id, nome, ...(f.alc.checked ? { alc: true } : {}) });
    f.reset(); salvar(); desenharCats(); desenharFiltro();
    avisar(`Categoria ${esc(nome)} criada`);
  });
  cats.addEventListener('change', (e) => {
    const inp = e.target.closest('[data-renomear]');
    if (inp) {
      const c = d.categorias.find((x) => x.id === inp.dataset.renomear);
      const nome = inp.value.trim();
      if (!nome) { inp.value = c.nome; return; }
      c.nome = nome; delete c.chip; salvar(); desenharFiltro();
    }
    const al = e.target.closest('[data-cat-alc]');
    if (al) {
      const c = d.categorias.find((x) => x.id === al.dataset.catAlc);
      if (al.checked) c.alc = true; else delete c.alc;
      salvar();
    }
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
      salvar(); desenharCats(); desenharFiltro();
    }
  });

  /* ---------- horário de funcionamento ---------- */
  const linhas = $$('[data-dia]');
  const desenharHorario = () => {
    linhas.forEach((ln) => {
      const v = d.abertura[+ln.dataset.dia];
      const ab = $('[data-aberto]', ln), a = $('[data-abre]', ln), f = $('[data-fecha]', ln);
      ab.checked = !!v;
      ln.classList.toggle('fechado', !v);
      $('[data-chave-txt]', ln).textContent = v ? 'Aberto' : 'Fechado';
      a.disabled = f.disabled = !v;
      if (v) { a.value = HR.paraCampo(v[0]); f.value = HR.paraCampo(v[1]); }
      const vira = $('[data-vira]', ln);
      vira.textContent = !v ? '' : v[1] - v[0] >= 24 ? 'aberto 24 horas' : v[1] > 24 ? 'fecha no dia seguinte' : '';
    });
    const st = HR.status(d.abertura);
    const s = $('[data-hor-status]');
    s.textContent = st.txt; s.classList.toggle('fechado', !st.aberto);
    $('[data-hor-lista]').innerHTML = HR.grupos(d.abertura).map(([dia, h]) => `<li><span>${esc(dia)}</span><b>${esc(h)}</b></li>`).join('');
  };
  // lê a linha do dia: fecha antes ou igual à abertura = vira o dia
  const lerDia = (ln) => {
    const dia = +ln.dataset.dia;
    if (!$('[data-aberto]', ln).checked) { d.abertura[dia] = null; return; }
    const a = $('[data-abre]', ln).value, f = $('[data-fecha]', ln).value;
    const ant = d.abertura[dia] || [10, 22];
    const abre = a ? HR.deCampo(a) : ant[0];
    let fecha = f ? HR.deCampo(f) : ant[1] % 24;
    if (fecha <= abre) fecha += 24;
    d.abertura[dia] = [abre, fecha];
  };
  linhas.forEach((ln) => ln.addEventListener('change', () => { lerDia(ln); salvar(); desenharHorario(); }));
  $$('[data-copiar]').forEach((b) => b.addEventListener('click', () => {
    const seg = d.abertura[1];
    const dias = b.dataset.copiar === 'uteis' ? [2, 3, 4, 5] : [0, 2, 3, 4, 5, 6];
    dias.forEach((i) => { d.abertura[i] = seg ? [...seg] : null; });
    salvar(); desenharHorario();
    avisar(b.dataset.copiar === 'uteis' ? 'Horário de segunda copiado para terça a sexta' : 'Horário de segunda copiado para a semana toda');
  }));

  /* ---------- publicar ---------- */
  const tudo = () => { desenharLista(); desenharCats(); desenharHorario(); atualizarEstado(); };
  $('[data-publicar]').addEventListener('click', () => {
    if (!L.publicar()) { avisar('Não foi possível salvar. O navegador está sem espaço ou bloqueando o armazenamento.'); return; }
    pub = L.publicado(); d = L.rascunho();
    tudo();
    avisar('Publicado no site. <a href="index.html" target="_blank" rel="noopener">Ver agora</a>', 5000);
  });
  $('[data-descartar]').addEventListener('click', () => {
    if (!confirm('Descartar tudo o que ainda não foi publicado?')) return;
    L.descartar(); d = L.rascunho();
    tudo();
  });
  $('[data-restaurar]').addEventListener('click', () => {
    if (!confirm('Voltar ao catálogo e ao horário originais da demonstração? O site também volta ao original.')) return;
    L.restaurar(); pub = L.publicado(); d = L.rascunho();
    tudo();
    avisar('Catálogo e horário originais restaurados');
  });

  function iniciar() {
    if (iniciado) return; iniciado = true;
    pub = L.publicado(); d = L.rascunho();
    tudo();
  }
  if (sessao()) entrar();
})();
