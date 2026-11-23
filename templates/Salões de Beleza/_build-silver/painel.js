
// Mecha Salão, Silver (Área do cliente): entrar, criar conta e o painel que cadastra serviços, produtos,
// funcionárias, horário e dados da empresa. Tudo fica no navegador nesta demonstração (veja loja.js).
(() => {
  const { $, $$, Loja, D, P, I, toast, iguala, janelas } = Comum;
  const pg = D.pagina;
  const esc = P.esc;
  const vaiPara = (url) => location.replace(url);

  // mostrar e esconder a senha
  $$('[data-olho]').forEach((b) => b.addEventListener('click', () => {
    const inp = b.parentElement.querySelector('input');
    const ver = inp.type === 'password';
    inp.type = ver ? 'text' : 'password';
    b.setAttribute('aria-pressed', String(ver));
    b.setAttribute('aria-label', ver ? 'Esconder a senha' : 'Mostrar a senha');
    b.innerHTML = ver ? I.olhoFechado : I.olho;
  }));
  const mostraErro = (form, t) => { const e = $('[data-erro]', form); e.hidden = !t; e.textContent = t || ''; };

  // ---------- entrar ----------
  if (pg === 'cliente') {
    if (Loja.sessao()) vaiPara('painel.html');
    const form = $('[data-entrar]');
    $('[data-demo-email]').textContent = Loja.DEMO.email;
    $('[data-demo-senha]').textContent = Loja.DEMO.senha;
    form.email.value = Loja.DEMO.email;
    form.senha.value = Loja.DEMO.senha;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.email.value.trim() || !form.senha.value) return mostraErro(form, 'Preencha o e-mail e a senha.');
      if (!Loja.entrar(form.email.value, form.senha.value)) return mostraErro(form, 'E-mail ou senha não conferem. Use o acesso de demonstração abaixo ou crie uma conta.');
      vaiPara('painel.html');
    });
  }

  // ---------- criar conta ----------
  if (pg === 'cadastro') {
    const form = $('[data-cadastro]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = form.nome.value.trim(), salao = form.salao.value.trim(), email = form.email.value.trim().toLowerCase(), senha = form.senha.value;
      if (!nome || !salao) return mostraErro(form, 'Preencha o seu nome e o nome do salão.');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return mostraErro(form, 'Digite um e-mail válido.');
      if (senha.length < 8) return mostraErro(form, 'A senha precisa de pelo menos 8 caracteres.');
      if (!form.lgpd.checked) return mostraErro(form, 'Aceite os termos de uso e a política de privacidade.');
      if (!Loja.salvarConta({ nome, salao, email, senha })) return mostraErro(form, 'O navegador não deixou guardar a conta. Confira se o armazenamento está liberado.');
      const L = Loja.ler(); L.empresa.nome = salao; Loja.salvar(L);
      Loja.entrar(email, senha);
      vaiPara('painel.html');
    });
  }

  // ---------- painel ----------
  if (pg === 'painel') {
    const sessao = Loja.sessao();
    if (!sessao) { vaiPara('cliente.html'); return; }
    let L = Loja.ler();
    $('[data-ola]').innerHTML = `Olá,<b>${esc(sessao.nome || 'equipe')}</b>`;

    const salva = (msg) => {
      if (!Loja.salvar(L)) { toast('O navegador não deixou salvar. Tente uma foto menor.'); return false; }
      toast(msg || 'Salvo. O site já mostra a mudança.');
      contas();
      return true;
    };
    const contas = () => {
      const n = { servicos: L.servicos.filter((s) => s.ativo !== false).length, produtos: L.produtos.filter((s) => s.ativo !== false).length, equipe: L.equipe.filter((s) => s.ativo !== false).length };
      $$('[data-conta-aba]').forEach((el) => { el.textContent = n[el.dataset.contaAba] ?? ''; el.hidden = !(el.dataset.contaAba in n); });
    };

    // abas
    const titulos = Object.fromEntries($$('[data-aba]').map((b) => [b.dataset.aba, b.textContent.trim()]));
    const abre = (id, foca) => {
      $$('[data-aba]').forEach((b) => { const s = b.dataset.aba === id; b.setAttribute('aria-selected', String(s)); b.tabIndex = s ? 0 : -1; if (s && foca) b.focus(); if (s && b.parentElement.scrollWidth > b.parentElement.clientWidth) b.parentElement.scrollTo({ left: b.offsetLeft - 20, behavior: 'smooth' }); });
      $$('[data-painel]').forEach((p) => { p.hidden = p.dataset.painel !== id; });
      $('[data-titulo-aba]').textContent = titulos[id].replace(/\d+$/, '').trim();
      desenha[id]();
      history.replaceState(null, '', `#${id}`);
    };
    $$('[data-aba]').forEach((b, k, todas) => {
      b.addEventListener('click', () => abre(b.dataset.aba));
      b.addEventListener('keydown', (e) => {
        const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (d) { e.preventDefault(); abre(todas[(k + d + todas.length) % todas.length].dataset.aba, true); }
      });
    });

    const campo = (nome, rot, valor, { tipo = 'text', cls = '', extra = '' } = {}) => `<label class="campo ${cls}"><span>${rot}</span><input name="${nome}" type="${tipo}" value="${esc(valor ?? '')}"${extra}></label>`;
    const area = (nome, rot, valor, cls = 'larga') => `<label class="campo ${cls}"><span>${rot}</span><textarea name="${nome}" rows="3">${esc(valor ?? '')}</textarea></label>`;
    const miniFoto = (src) => `<span class="pn-mini">${src ? P.img(src, '', {}) : I.simbolo()}</span>`;
    const acoes = (k, total, visivel) => `<div class="pn-acoes">
      <button type="button" data-acao="visivel" data-k="${k}" aria-label="${visivel ? 'Esconder do site' : 'Mostrar no site'}" title="${visivel ? 'Esconder do site' : 'Mostrar no site'}">${visivel ? I.olho : I.olhoFechado}</button>
      <button type="button" data-acao="sobe" data-k="${k}" aria-label="Subir" title="Subir"${k === 0 ? ' disabled' : ''}>${I.sobe}</button>
      <button type="button" data-acao="desce" data-k="${k}" aria-label="Descer" title="Descer"${k === total - 1 ? ' disabled' : ''}>${I.desce}</button>
      <button type="button" data-acao="edita" data-k="${k}" aria-label="Editar" title="Editar">${I.lapis}</button>
      <button type="button" class="perigo" data-acao="apaga" data-k="${k}" aria-label="Excluir" title="Excluir">${I.lixo}</button>
    </div>`;

    // ---------- dados da empresa ----------
    const desenhaEmpresa = () => {
      const E = L.empresa;
      $('[data-painel="empresa"]').innerHTML = `<form class="pn-caixa" data-form-empresa novalidate>
        <h2>Identificação</h2>
        <div class="pn-form">
          ${campo('nome', 'Nome do salão', E.nome)}${campo('razao', 'Razão social', E.razao)}
          ${campo('cnpj', 'CNPJ', E.cnpj, { extra: ' inputmode="numeric"' })}${campo('instagram', 'Instagram', E.instagram)}
        </div>
        <h2 style="margin-top:28px">Contato</h2>
        <div class="pn-form">
          ${campo('telefone', 'Telefone', E.telefone, { tipo: 'tel' })}${campo('whatsapp', 'WhatsApp (recebe os pedidos do site)', E.whatsapp, { tipo: 'tel' })}
          ${campo('email', 'E-mail', E.email, { tipo: 'email', cls: 'larga' })}
        </div>
        <h2 style="margin-top:28px">Endereço</h2>
        <div class="pn-form">
          ${campo('endereco', 'Rua e número', E.endereco, { cls: 'larga' })}${campo('bairro', 'Bairro', E.bairro)}${campo('cidade', 'Cidade', E.cidade)}
          ${campo('uf', 'UF', E.uf, { extra: ' maxlength="2"' })}${campo('cep', 'CEP', E.cep, { extra: ' inputmode="numeric"' })}
          ${campo('referencia', 'Ponto de referência', E.referencia, { cls: 'larga' })}${campo('estacionamento', 'Estacionamento', E.estacionamento, { cls: 'larga' })}
        </div>
        <div class="pn-pe"><p class="form-erro" role="alert" hidden data-erro-emp></p><button class="btn btn-telha" type="submit">Salvar dados da empresa</button></div>
      </form>`;
      const form = $('[data-form-empresa]');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = Object.fromEntries(new FormData(form));
        const err = $('[data-erro-emp]');
        const falta = [];
        if (!v.nome.trim()) falta.push('nome do salão');
        if (P.soNumeros(v.whatsapp).length < 10) falta.push('WhatsApp com DDD');
        if (v.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) falta.push('e-mail válido');
        if (falta.length) { err.hidden = false; err.textContent = `Confira: ${falta.join(', ')}.`; return; }
        err.hidden = true;
        L.empresa = { ...L.empresa, ...Object.fromEntries(Object.entries(v).map(([k, x]) => [k, String(x).trim()])) };
        L.empresa.uf = L.empresa.uf.toUpperCase();
        salva('Dados da empresa salvos. O rodapé e o WhatsApp do site já mudaram.');
      });
    };

    // ---------- horário ----------
    const ORDEM = [1, 2, 3, 4, 5, 6, 0];
    const linhaDia = (w, d, pre = 'h') => `<div class="pn-dia${d.aberto ? '' : ' fechado'}" data-dia="${w}">
        <b>${P.DIAS[w]}</b>
        <label class="chave"><input type="checkbox" name="${pre}-aberto-${w}"${d.aberto ? ' checked' : ''}><span>${pre === 'h' ? 'Aberto' : 'Atende'}</span></label>
        <label class="campo"><span class="vh">Entrada de ${P.DIAS[w]}</span><input type="time" name="${pre}-abre-${w}" value="${d.abre}" step="1800"></label>
        <label class="campo"><span class="vh">Saída de ${P.DIAS[w]}</span><input type="time" name="${pre}-fecha-${w}" value="${d.fecha}" step="1800"></label>
      </div>`;
    const ligaChaves = (raiz) => raiz.addEventListener('change', (e) => { const c = e.target.closest('.chave input'); if (c) c.closest('.pn-dia').classList.toggle('fechado', !c.checked); });
    const desenhaHorario = () => {
      $('[data-painel="horario"]').innerHTML = `<form class="pn-caixa" data-form-horario novalidate>
        <h2>Horário de funcionamento</h2>
        <p class="ed-dica" style="margin:-8px 0 16px">O calendário do agendamento só abre nos dias marcados como abertos, e os horários de cada profissional ficam dentro deste intervalo.</p>
        <div class="pn-horas">${ORDEM.map((w) => linhaDia(w, L.horario[w])).join('')}</div>
        <div class="pn-pe"><p class="form-erro" role="alert" hidden data-erro-h></p><button class="btn btn-telha" type="submit">Salvar horário</button></div>
      </form>`;
      const form = $('[data-form-horario]');
      ligaChaves(form);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const novo = [0, 1, 2, 3, 4, 5, 6].map((w) => ({ aberto: form[`h-aberto-${w}`].checked, abre: form[`h-abre-${w}`].value || '09:00', fecha: form[`h-fecha-${w}`].value || '18:00' }));
        const ruim = novo.map((d, w) => [d, w]).filter(([d]) => d.aberto && P.horas(d.abre) >= P.horas(d.fecha)).map(([, w]) => P.DIAS[w]);
        const err = $('[data-erro-h]');
        if (ruim.length) { err.hidden = false; err.textContent = `A saída precisa ser depois da entrada: ${ruim.join(', ')}.`; return; }
        if (!novo.some((d) => d.aberto)) { err.hidden = false; err.textContent = 'Deixe pelo menos um dia aberto.'; return; }
        err.hidden = true;
        L.horario = novo;
        salva('Horário salvo. O rodapé e o calendário do agendamento já mudaram.');
      });
    };

    // ---------- listas (serviços, produtos, equipe) ----------
    const listas = {
      servicos: {
        nome: 'serviço', novo: 'Novo serviço', pre: 's',
        linha: (s) => `<span class="pn-info"><b>${esc(s.nome)}</b><span>${P.minutos(+s.min || 0)}, <em>${s.de ? 'a partir de ' : ''}${P.reais(s.preco)}</em>${s.quimica ? ', teste antes' : ''}${s.ativo === false ? ', fora do site' : ''}</span></span>`,
        grupos: () => L.segmentos.map((g) => [g.nome, g.id]),
        doGrupo: (s, id) => s.seg === id,
      },
      produtos: {
        nome: 'produto', novo: 'Novo produto', pre: 'p',
        linha: (p) => `${miniFoto(p.foto)}<span class="pn-info"><b>${esc(p.nome)}</b><span>${esc(p.det)}, <em>${P.reais(p.preco)}</em>${p.ativo === false ? ', fora do site' : ''}</span></span>`,
      },
      equipe: {
        nome: 'funcionário', novo: 'Novo funcionário', pre: 'm',
        linha: (m) => `${miniFoto(m.foto)}<span class="pn-info"><b>${esc(m.nome)}</b><span>${esc(m.cargo)}, atende ${esc(P.nomesSeg(L, m.faz || []) || 'nenhum segmento')}${m.ativo === false ? ', fora do site' : ''}</span></span>`,
      },
    };
    const desenhaLista = (tipo) => {
      const cfg = listas[tipo], arr = L[tipo];
      const item = (x) => { const k = arr.indexOf(x); return `<div class="pn-item${x.ativo === false ? ' oculto' : ''}">${cfg.linha(x)}${acoes(k, arr.length, x.ativo !== false)}</div>`; };
      const corpo = cfg.grupos
        ? cfg.grupos().map(([titulo, id]) => { const xs = arr.filter((x) => cfg.doGrupo(x, id)); return xs.length ? `<div class="pn-grupo"><h3>${esc(titulo)}</h3><div class="pn-lista">${xs.map(item).join('')}</div></div>` : ''; }).join('')
        : `<div class="pn-lista">${arr.map(item).join('')}</div>`;
      const vis = arr.filter((x) => x.ativo !== false).length;
      $(`[data-painel="${tipo}"]`).innerHTML = `<div class="pn-barra"><p>${arr.length} cadastrados, ${vis} aparecendo no site.</p><button type="button" class="btn btn-telha btn-p" data-novo="${tipo}">${I.mais}<span>${cfg.novo}</span></button></div>${arr.length ? corpo : `<p class="pn-caixa">Nenhum ${cfg.nome} cadastrado ainda.</p>`}`;
    };
    const vizinho = (tipo, k, passo) => {
      const arr = L[tipo], cfg = listas[tipo];
      let j = k + passo;
      if (cfg.grupos) while (j >= 0 && j < arr.length && arr[j].seg !== arr[k].seg) j += passo;
      return j >= 0 && j < arr.length ? j : -1;
    };
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-acao]');
      const painel = b?.closest('[data-painel]');
      if (b && painel) {
        const tipo = painel.dataset.painel, k = +b.dataset.k, arr = L[tipo], x = arr[k];
        const nome = x.nome;
        if (b.dataset.acao === 'visivel') { x.ativo = x.ativo === false; salva(`${x.ativo ? 'De volta ao site' : 'Fora do site'}: ${nome}.`); }
        if (b.dataset.acao === 'sobe' || b.dataset.acao === 'desce') {
          const j = vizinho(tipo, k, b.dataset.acao === 'sobe' ? -1 : 1);
          if (j < 0) return;
          [arr[k], arr[j]] = [arr[j], arr[k]];
          salva('Ordem salva.');
        }
        if (b.dataset.acao === 'apaga') {
          if (!confirm(`Excluir "${nome}"? Isso não pode ser desfeito.`)) return;
          arr.splice(k, 1);
          salva(`Excluído: ${nome}.`);
        }
        if (b.dataset.acao === 'edita') return editor(tipo, k);
        desenhaLista(tipo);
        return;
      }
      const n = e.target.closest('[data-novo]');
      if (n) editor(n.dataset.novo, -1);
    });

    // ---------- editor (janela) ----------
    const dlg = $('#editor'), fEd = $('[data-editor]'), campos = $('[data-editor-campos]'), errEd = $('[data-editor-erro]');
    let edicao = null, fotoNova;
    const redimensiona = (arquivo) => new Promise((ok, falha) => {
      const fr = new FileReader();
      fr.onload = () => {
        const im = new Image();
        im.onload = () => {
          const lado = 900, esc2 = Math.min(1, lado / Math.max(im.width, im.height));
          const c = document.createElement('canvas'); c.width = Math.round(im.width * esc2); c.height = Math.round(im.height * esc2);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
          const url = c.toDataURL('image/webp', 0.82);
          ok(url.startsWith('data:image/webp') ? url : c.toDataURL('image/jpeg', 0.82));
        };
        im.onerror = falha; im.src = fr.result;
      };
      fr.onerror = falha; fr.readAsDataURL(arquivo);
    });
    const campoFoto = (src) => `<div class="campo larga"><span>Foto</span><div class="foto-campo"><span class="pn-mini" data-previa>${src ? P.img(src, '', {}) : I.simbolo()}</span>
      <div class="foto-btns"><label class="btn btn-linha">${I.foto}<span>Escolher foto</span><input type="file" accept="image/*" data-arquivo></label><button type="button" class="btn btn-linha" data-sem-foto>Tirar a foto</button></div></div>
      <p class="ed-dica">JPG, PNG ou WEBP. A foto é reduzida para 900 px antes de salvar.</p></div>`;
    const formularios = {
      servicos: (s) => `
        ${campo('nome', 'Nome do serviço *', s.nome, { cls: 'larga' })}
        <label class="campo"><span>Segmento *</span><select name="seg">${L.segmentos.map((g) => `<option value="${g.id}"${g.id === s.seg ? ' selected' : ''}>${esc(g.nome)}</option>`).join('')}</select></label>
        ${campo('min', 'Duração em minutos *', s.min ?? 60, { tipo: 'number', extra: ' min="10" step="5" inputmode="numeric"' })}
        ${campo('preco', 'Preço em reais *', s.preco ?? '', { tipo: 'number', extra: ' min="0" step="1" inputmode="numeric"' })}
        <div class="campo"><span>Opções</span><div class="marcas" style="grid-template-columns:1fr">
          <label><input type="checkbox" name="de"${s.de ? ' checked' : ''}>Preço "a partir de"</label>
          <label><input type="checkbox" name="quimica"${s.quimica ? ' checked' : ''}>Pede teste 48h antes</label>
          <label><input type="checkbox" name="destaque"${s.destaque ? ' checked' : ''}>Marcar como o mais pedido</label>
        </div></div>
        ${area('inclui', 'O que inclui *', s.inclui)}`,
      produtos: (p) => `
        ${campo('nome', 'Nome do produto *', p.nome, { cls: 'larga' })}
        ${campo('det', 'Tamanho ou detalhe', p.det)}
        ${campo('preco', 'Preço em reais *', p.preco ?? '', { tipo: 'number', extra: ' min="0" step="1" inputmode="numeric"' })}
        ${campoFoto(p.foto)}`,
      equipe: (m) => `
        ${campo('nome', 'Nome completo *', m.nome)}${campo('cargo', 'Cargo *', m.cargo)}
        ${campo('esp', 'Especialidade', m.esp)}${campo('anos', 'Anos de profissão', m.anos ?? '', { tipo: 'number', extra: ' min="0" max="60" inputmode="numeric"' })}
        ${area('bio', 'Apresentação (aparece na página da equipe)', m.bio)}
        ${campo('formacao', 'Formação', m.formacao, { cls: 'larga' })}
        <div class="campo larga"><span>Atende *</span><div class="marcas">${L.segmentos.map((g) => `<label><input type="checkbox" name="faz" value="${g.id}"${(m.faz || []).includes(g.id) ? ' checked' : ''}>${esc(g.curto)}</label>`).join('')}</div></div>
        <div class="campo larga"><p class="ed-legenda">Agenda da semana</p><div class="ed-agenda">${ORDEM.filter((w) => L.horario[w].aberto).map((w) => { const h = m.dias?.[w]; return linhaDia(w, { aberto: !!h, abre: h ? hhmm(h[0]) : L.horario[w].abre, fecha: h ? hhmm(h[1]) : L.horario[w].fecha }, 'a'); }).join('')}</div><p class="ed-dica">Só aparecem os dias em que o salão abre. Os horários livres do agendamento saem daqui.</p></div>
        ${campoFoto(m.foto)}`,
    };
    const hhmm = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
    const editor = (tipo, k) => {
      const cfg = listas[tipo];
      const x = k >= 0 ? L[tipo][k] : { ativo: true, faz: [], dias: {}, seg: L.segmentos[0].id };
      edicao = { tipo, k }; fotoNova = undefined;
      $('[data-editor-t]').textContent = k >= 0 ? `Editar ${cfg.nome}` : cfg.novo;
      campos.innerHTML = formularios[tipo](x);
      errEd.hidden = true;
      ligaChaves(campos);
      const arq = $('[data-arquivo]', campos);
      arq?.addEventListener('change', async () => {
        const f = arq.files[0]; if (!f) return;
        if (!/^image\//.test(f.type)) { toast('Escolha um arquivo de imagem.'); return; }
        try { fotoNova = await redimensiona(f); $('[data-previa]', campos).innerHTML = `<img src="${fotoNova}" alt="">`; } catch (err) { toast('Não deu para ler esta imagem.'); }
      });
      $('[data-sem-foto]', campos)?.addEventListener('click', () => { fotoNova = ''; $('[data-previa]', campos).innerHTML = I.simbolo(); });
      dlg.showModal();
      campos.querySelector('input, select, textarea')?.focus();
    };
    fEd.addEventListener('submit', (e) => {
      e.preventDefault();
      const { tipo, k } = edicao;
      const v = new FormData(fEd);
      const txt = (n) => String(v.get(n) ?? '').trim();
      const falta = [];
      if (!txt('nome')) falta.push('nome');
      let item;
      if (tipo === 'servicos') {
        if (!txt('inclui')) falta.push('o que inclui');
        if (!(+txt('min') > 0)) falta.push('duração');
        if (txt('preco') === '' || +txt('preco') < 0) falta.push('preço');
        item = { nome: txt('nome'), seg: txt('seg'), min: Math.round(+txt('min')), preco: Math.round(+txt('preco')), inclui: txt('inclui'), de: !!v.get('de'), quimica: !!v.get('quimica'), destaque: !!v.get('destaque') };
      } else if (tipo === 'produtos') {
        if (txt('preco') === '' || +txt('preco') < 0) falta.push('preço');
        item = { nome: txt('nome'), det: txt('det'), preco: Math.round(+txt('preco')) };
      } else {
        if (!txt('cargo')) falta.push('cargo');
        const faz = v.getAll('faz');
        if (!faz.length) falta.push('pelo menos um segmento em Atende');
        const dias = {};
        for (const w of ORDEM) {
          if (!v.get(`a-aberto-${w}`)) continue;
          const a = P.horas(txt(`a-abre-${w}`) || '09:00'), b = P.horas(txt(`a-fecha-${w}`) || '18:00');
          if (a >= b) { falta.push(`saída depois da entrada (${P.DIAS[w]})`); continue; }
          dias[w] = [a, b];
        }
        item = { nome: txt('nome'), cargo: txt('cargo'), esp: txt('esp'), anos: Math.max(0, Math.round(+txt('anos') || 0)), bio: txt('bio'), formacao: txt('formacao'), faz, dias };
      }
      if (falta.length) { errEd.hidden = false; errEd.textContent = `Confira: ${falta.join(', ')}.`; return; }
      if (fotoNova !== undefined) { item.foto = fotoNova; item.alt = item.nome; }
      if (k >= 0) {
        const antigo = L[tipo][k];
        L[tipo][k] = { ...antigo, ...item };
        if (tipo === 'equipe' && fotoNova === undefined) L[tipo][k].alt = antigo.alt;
      } else {
        L[tipo].push({ id: Loja.novoId(listas[tipo].pre), ativo: true, ...item });
      }
      if (salva(k >= 0 ? `Alterações salvas: ${item.nome}.` : `Cadastro salvo: ${item.nome}. Já aparece no site.`)) { dlg.close(); desenhaLista(tipo); }
    });
    $$('[data-fecha]', dlg).forEach((b) => b.addEventListener('click', () => dlg.close()));
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

    const desenha = { empresa: desenhaEmpresa, horario: desenhaHorario, servicos: () => desenhaLista('servicos'), produtos: () => desenhaLista('produtos'), equipe: () => desenhaLista('equipe') };

    $('[data-restaurar]').addEventListener('click', () => {
      if (!confirm('Voltar todos os dados para o padrão do modelo? Serviços, produtos, equipe, horário e dados da empresa salvos aqui serão apagados.')) return;
      Loja.restaurar(); L = Loja.ler(); contas();
      const atual = $('[aria-selected="true"][data-aba]').dataset.aba;
      desenha[atual]();
      toast('Tudo voltou ao padrão do modelo.');
    });
    $('[data-sair]').addEventListener('click', () => { Loja.sair(); vaiPara('cliente.html'); });

    contas();
    const inicial = location.hash.slice(1);
    abre(desenha[inicial] ? inicial : 'empresa');
  }

  janelas();
  iguala();
})();
