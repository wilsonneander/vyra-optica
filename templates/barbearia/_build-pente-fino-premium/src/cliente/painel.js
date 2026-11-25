// O painel do dono: serviços, barbeiros e produtos (mostrar no site ou arquivar, editar, excluir, mudar a ordem),
// os dados e o horário da casa, e a conta. Cada mudança grava na hora (src/loja/dados.js) e o site lê ao abrir.
import { botoes, aviso, esc, ICONES, mascara, reduzirFoto } from './comum.js';
import { ler, salvar, restaurar, novoId, sessao, sair, lerConta, DEMO, FERRAMENTAS, DIAS, foto } from '../loja/dados.js';

const quem = sessao();
if (!quem) location.replace('./cliente.html');

let dados = ler();
const estado = { aba: 'servicos', filtro: { servicos: 'todos', barbeiros: 'todos', produtos: 'todos' } };
const real = (n) => `R$ ${Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: Number(n) % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

/* ---------- o que cada lista tem ---------- */
const TIPOS = {
  servicos: {
    titulo: ['Serviços', 'do cardápio.'], um: 'serviço', novo: 'Novo serviço', prefixo: 's', comFoto: false,
    texto: 'A ordem daqui é a do cardápio (#0, #1, #2…) e a do agendamento. Arquivar tira do site sem perder o cadastro.',
    resumo: (x) => ({ titulo: x.nome, sub: `${x.min} min · ${x.desc || 'sem descrição'}`, preco: real(x.preco) }),
    icone: (x) => foto(`img/ferramentas/${x.ferramenta}.webp`),
    vazio: () => ({ nome: '', desc: '', min: 30, preco: 50, ferramenta: 'maquina', ativo: true }),
    campos: [
      { nome: 'nome', rotulo: 'Nome do serviço', obrig: true, max: 40 },
      { nome: 'desc', rotulo: 'Descrição curta', tipo: 'textarea', max: 90, dica: 'Uma linha, como no cardápio: o que está incluso.' },
      { linha: [{ nome: 'min', rotulo: 'Duração (min)', tipo: 'number', min: 5, step: 5, obrig: true }, { nome: 'preco', rotulo: 'Preço (R$)', tipo: 'number', min: 0, step: 1, obrig: true }] },
      { nome: 'ferramenta', rotulo: 'Ferramenta do serviço', tipo: 'ferramenta', dica: 'É a peça que segue o mouse no cardápio.' },
    ],
  },
  barbeiros: {
    titulo: ['Barbeiros', 'da casa.'], um: 'barbeiro', novo: 'Novo barbeiro', prefixo: 'b', comFoto: true,
    texto: 'Cada barbeiro ativo ganha um espelho no site e aparece no agendamento. Arquivado, some do site e da agenda.',
    resumo: (x) => ({ titulo: x.nome, sub: [x.especialidade, x.anos ? `${x.anos} anos de cadeira` : ''].filter(Boolean).join(' · ') }),
    vazio: () => ({ nome: '', especialidade: '', anos: '', foto: '', alt: '', ativo: true }),
    campos: [
      { nome: 'foto', rotulo: 'Foto trabalhando', tipo: 'foto', dica: 'Paisagem (3:2), o barbeiro trabalhando. JPG ou PNG.' },
      { nome: 'nome', rotulo: 'Nome', obrig: true, max: 24 },
      { linha: [{ nome: 'especialidade', rotulo: 'Especialidade', max: 40 }, { nome: 'anos', rotulo: 'Anos de cadeira', tipo: 'number', min: 0, step: 1 }] },
      { nome: 'alt', rotulo: 'Descrição da foto', max: 120, dica: 'Para leitores de tela: o que a foto mostra.' },
    ],
  },
  produtos: {
    titulo: ['Produtos', 'da bancada.'], um: 'produto', novo: 'Novo produto', prefixo: 'p', comFoto: true,
    texto: 'Os produtos ativos aparecem na bancada do site, na ordem daqui. Sem nenhum ativo, a seção some.',
    resumo: (x) => ({ titulo: x.nome, sub: x.det || 'sem detalhe', preco: real(x.preco) }),
    vazio: () => ({ nome: '', det: '', preco: 0, foto: '', alt: '', ativo: true }),
    campos: [
      { nome: 'foto', rotulo: 'Foto do produto', tipo: 'foto', dica: 'Retrato (4:5), o produto sozinho. JPG ou PNG.' },
      { nome: 'nome', rotulo: 'Nome do produto', obrig: true, max: 40 },
      { linha: [{ nome: 'det', rotulo: 'Tamanho ou detalhe', max: 20, dica: '100 g, 30 ml, kit…' }, { nome: 'preco', rotulo: 'Preço (R$)', tipo: 'number', min: 0, step: 1, obrig: true }] },
      { nome: 'alt', rotulo: 'Descrição da foto', max: 120 },
    ],
  },
};

/* ---------- gravar ---------- */
function grava(msg) {
  if (!salvar(dados)) { aviso('O navegador não guardou: as fotos passaram do espaço. Use fotos menores.', 'erro'); dados = ler(); render(); return false; }
  if (msg) aviso(msg);
  contadores();
  return true;
}

/* ---------- menu ---------- */
const menu = document.querySelector('[data-menu]');
menu.addEventListener('click', (e) => { const b = e.target.closest('[data-aba]'); if (b) troca(b.dataset.aba); });
function troca(aba) {
  estado.aba = aba;
  for (const b of menu.querySelectorAll('[data-aba]')) { if (b.dataset.aba === aba) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); }
  for (const p of document.querySelectorAll('[data-painel]')) p.hidden = p.dataset.painel !== aba;
  history.replaceState(null, '', `#${aba}`);
  render();
  scrollTo({ top: 0 });
}
function contadores() {
  for (const tipo of Object.keys(TIPOS)) {
    const el = document.querySelector(`[data-conta-aba="${tipo}"]`);
    const l = dados[tipo];
    if (el) el.textContent = `${l.filter((x) => x.ativo).length}/${l.length}`;
  }
}

/* ---------- listas ---------- */
function render() {
  if (TIPOS[estado.aba]) lista(estado.aba);
  else if (estado.aba === 'loja') loja();
  else conta();
  botoes(document.getElementById('conteudo'));
  contadores();
}

function lista(tipo) {
  const T = TIPOS[tipo];
  const painel = document.querySelector(`[data-painel="${tipo}"]`);
  const todos = dados[tipo];
  const on = todos.filter((x) => x.ativo).length;
  const filtro = estado.filtro[tipo];
  const vis = todos.filter((x) => filtro === 'todos' || (filtro === 'on' ? x.ativo : !x.ativo));
  painel.innerHTML = `
    <div class="aba__cab">
      <div><h1><span>${T.titulo[0]}</span> <strong>${T.titulo[1]}</strong></h1><p>${T.texto}</p></div>
      <button class="botao botao--claro botao--seta" type="button" data-acao="novo">${T.novo}</button>
    </div>
    <div class="filtros-painel" role="group" aria-label="Filtrar">
      ${[['todos', 'Todos', todos.length], ['on', 'No site', on], ['off', 'Arquivados', todos.length - on]].map(([v, t, n]) => `<button type="button" data-filtro="${v}" aria-pressed="${filtro === v}">${t}<b>${n}</b></button>`).join('')}
    </div>
    ${vis.length ? `<ul class="lista">${vis.map((x) => item(tipo, x, todos)).join('')}</ul>` : `<div class="vazio"><strong>${filtro === 'off' ? 'Nada arquivado.' : filtro === 'on' ? 'Nada no site agora.' : `Nenhum ${T.um} ainda.`}</strong>${filtro === 'todos' ? `Use “${T.novo}” para cadastrar o primeiro.` : 'Troque o filtro para ver os outros.'}</div>`}`;
}

function item(tipo, x, todos) {
  const T = TIPOS[tipo];
  const r = T.resumo(x);
  const i = todos.indexOf(x);
  const nome = esc(x.nome || 'sem nome');
  const imagem = T.comFoto
    ? `<div class="item__foto">${x.foto ? `<img src="${esc(foto(x.foto))}" alt="" loading="lazy">` : ''}</div>`
    : `<div class="item__icone"><img src="${esc(T.icone(x))}" alt="" loading="lazy"></div>`;
  return `
    <li class="item${T.comFoto ? '' : ' item--sem-foto'}${x.ativo ? '' : ' is-arquivado'}" data-id="${esc(x.id)}">
      <div class="item__ordem">
        <button type="button" data-acao="subir" aria-label="Subir ${nome}" ${i === 0 ? 'disabled' : ''}>${ICONES.cima}</button>
        <button type="button" data-acao="descer" aria-label="Descer ${nome}" ${i === todos.length - 1 ? 'disabled' : ''}>${ICONES.baixo}</button>
      </div>
      ${imagem}
      <div class="item__txt"><strong>${tipo === 'servicos' && x.ativo ? `#${todos.filter((y) => y.ativo).indexOf(x)} ` : ''}${nome}</strong><span>${esc(r.sub)}</span></div>
      <div class="item__meta">
        ${r.preco ? `<span class="item__preco">${r.preco}</span>` : ''}
        <span class="selo ${x.ativo ? 'selo--on' : 'selo--off'}">${x.ativo ? 'No site' : 'Arquivado'}</span>
      </div>
      <div class="item__acoes">
        <button class="chave" type="button" role="switch" aria-checked="${x.ativo}" data-acao="chave" aria-label="Mostrar ${nome} no site"><i></i><span>${x.ativo ? 'Visível' : 'Oculto'}</span></button>
        <button class="icone-btn" type="button" data-acao="editar" aria-label="Editar ${nome}" title="Editar">${ICONES.editar}</button>
        <button class="icone-btn icone-btn--perigo" type="button" data-acao="excluir" aria-label="Excluir ${nome}" title="Excluir">${ICONES.excluir}</button>
      </div>
    </li>`;
}

document.getElementById('conteudo').addEventListener('click', (e) => {
  const tipo = estado.aba;
  const f = e.target.closest('[data-filtro]');
  if (f && TIPOS[tipo]) { estado.filtro[tipo] = f.dataset.filtro; render(); return; }
  const b = e.target.closest('[data-acao]');
  if (!b || !TIPOS[tipo]) return;
  const T = TIPOS[tipo];
  const l = dados[tipo];
  const id = b.closest('[data-id]')?.dataset.id;
  const i = l.findIndex((x) => x.id === id);
  const x = l[i];
  switch (b.dataset.acao) {
    case 'novo': return editar(tipo, null);
    case 'editar': return editar(tipo, x);
    case 'chave':
      x.ativo = !x.ativo;
      if (grava(x.ativo ? `${x.nome} voltou para o site.` : `${x.nome} foi arquivado e saiu do site.`)) render();
      return;
    case 'subir': case 'descer': {
      const j = b.dataset.acao === 'subir' ? i - 1 : i + 1;
      if (j < 0 || j >= l.length) return;
      [l[i], l[j]] = [l[j], l[i]];
      if (grava()) { render(); document.querySelector(`[data-id="${CSS.escape(id)}"] [data-acao="${b.dataset.acao}"]`)?.focus(); }
      return;
    }
    case 'excluir':
      return confirmar({
        titulo: `Excluir ${x.nome}?`,
        texto: `${T.um === 'barbeiro' ? 'O espelho dele e os cortes ligados a ele saem do site.' : 'Sai do site e do painel.'} Não dá para desfazer. Para só tirar do site, use a chave de visível.`,
        sim: 'Excluir',
        aoSim: () => { l.splice(i, 1); if (grava(`${x.nome} foi excluído.`)) render(); },
      });
  }
});

/* ---------- gaveta de edição ---------- */
function editar(tipo, original) {
  const T = TIPOS[tipo];
  const x = original ? { ...original } : T.vazio();
  const g = document.createElement('div');
  g.className = 'gaveta';
  g.innerHTML = `
    <div class="gaveta__veu" data-fechar></div>
    <form class="gaveta__caixa" role="dialog" aria-modal="true" aria-labelledby="gaveta-titulo" novalidate>
      <header class="gaveta__topo"><h2 id="gaveta-titulo">${original ? `Editar ${esc(original.nome)}` : T.novo}</h2><button class="icone-btn" type="button" data-fechar aria-label="Fechar">${ICONES.fechar}</button></header>
      <div class="gaveta__corpo">${T.campos.map((c) => (c.linha ? `<div class="linha-2">${c.linha.map((cc) => campoHtml(cc, x)).join('')}</div>` : campoHtml(c, x))).join('')}
        <label class="aceite"><input type="checkbox" name="ativo" ${x.ativo ? 'checked' : ''}><span>Mostrar no site</span></label>
      </div>
      <footer class="gaveta__rodape"><button class="botao botao--linha botao--pequeno" type="button" data-fechar>Cancelar</button><button class="botao botao--claro botao--pequeno" type="submit">${original ? 'Salvar' : 'Cadastrar'}</button></footer>
    </form>`;
  document.body.append(g);
  botoes(g);
  const form = g.querySelector('form');
  const antes = document.activeElement;
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => form.querySelector('input:not([type=file]):not([type=checkbox]), textarea')?.focus(), 80);

  // ferramenta
  for (const bt of form.querySelectorAll('.ferramentas button')) {
    bt.addEventListener('click', () => {
      x.ferramenta = bt.dataset.ferramenta;
      form.querySelectorAll('.ferramentas button').forEach((o) => o.setAttribute('aria-pressed', String(o === bt)));
    });
  }
  // foto
  const arquivo = form.querySelector('input[type=file]');
  arquivo?.addEventListener('change', async () => {
    const f = arquivo.files[0];
    if (!f) return;
    try {
      x.foto = await reduzirFoto(f, tipo === 'barbeiros' ? 1400 : 1000);
      form.querySelector('.foto-campo__previa').innerHTML = `<img src="${x.foto}" alt="">`;
    } catch { aviso('Esse arquivo não é uma imagem.', 'erro'); }
  });

  const fecha = () => {
    g.classList.add('is-saindo');
    document.removeEventListener('keydown', tecla);
    setTimeout(() => { g.remove(); document.documentElement.style.overflow = ''; antes?.focus?.(); }, 380);
  };
  const tecla = (e) => {
    if (e.key === 'Escape') fecha();
    if (e.key === 'Tab') prende(e, form);
  };
  document.addEventListener('keydown', tecla);
  g.querySelectorAll('[data-fechar]').forEach((b) => b.addEventListener('click', fecha));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    for (const c of T.campos.flatMap((c) => c.linha || [c])) {
      if (c.tipo === 'ferramenta' || c.tipo === 'foto') continue;
      const input = form.elements[c.nome];
      const v = input.value.trim();
      const vazio = c.obrig && v === '';
      const ruim = c.tipo === 'number' && v !== '' && (Number(v) < (c.min ?? -Infinity) || Number.isNaN(Number(v)));
      const cx = input.closest('.campo');
      cx.classList.toggle('is-erro', vazio || ruim);
      cx.querySelector('.campo__erro').textContent = vazio ? 'Obrigatório.' : ruim ? `Mínimo ${c.min}.` : '';
      if (vazio || ruim) { if (ok) input.focus(); ok = false; continue; }
      x[c.nome] = c.tipo === 'number' ? (v === '' ? '' : Number(v)) : v;
    }
    if (!ok) return;
    x.ativo = form.elements.ativo.checked;
    if (T.comFoto && !x.foto) { aviso('Escolha uma foto.', 'erro'); return; }
    const l = dados[tipo];
    if (original) l[l.findIndex((y) => y.id === original.id)] = x;
    else { x.id = novoId(T.prefixo); l.push(x); estado.filtro[tipo] = 'todos'; }
    if (grava(original ? `${x.nome} foi atualizado.` : `${x.nome} foi cadastrado${x.ativo ? ' e já aparece no site' : ''}.`)) { fecha(); render(); }
  });
}

function campoHtml(c, x) {
  const v = x[c.nome] ?? '';
  const dica = c.dica ? `<small>${c.dica}</small>` : '';
  if (c.tipo === 'ferramenta') {
    return `<div class="campo"><span>${c.rotulo}</span><div class="ferramentas" role="group" aria-label="${c.rotulo}">${FERRAMENTAS.map(([id, nome]) => `<button type="button" data-ferramenta="${id}" aria-pressed="${x.ferramenta === id}"><img src="${foto(`img/ferramentas/${id}.webp`)}" alt="">${nome}</button>`).join('')}</div>${dica}</div>`;
  }
  if (c.tipo === 'foto') {
    return `<div class="campo"><span>${c.rotulo}</span><div class="foto-campo"><div class="foto-campo__previa">${v ? `<img src="${esc(foto(v))}" alt="">` : ICONES.foto}</div><div><label class="botao botao--linha botao--pequeno">${v ? 'Trocar foto' : 'Escolher foto'}<input type="file" accept="image/*"></label>${dica}</div></div></div>`;
  }
  const comum = `name="${c.nome}" ${c.obrig ? 'required' : ''} ${c.max ? `maxlength="${c.max}"` : ''}`;
  const input = c.tipo === 'textarea'
    ? `<textarea ${comum} rows="2">${esc(v)}</textarea>`
    : `<input ${comum} type="${c.tipo === 'number' ? 'number' : 'text'}" ${c.tipo === 'number' ? `inputmode="numeric" min="${c.min ?? 0}" step="${c.step ?? 1}"` : ''} value="${esc(v)}">`;
  return `<label class="campo"><span>${c.rotulo}</span>${input}${c.tipo !== 'foto' && c.dica && c.nome !== 'det' ? dica : ''}<em class="campo__erro" aria-live="polite"></em></label>`;
}

function prende(e, caixa) {
  const foco = [...caixa.querySelectorAll('button:not([disabled]), input, textarea, select, a[href]')].filter((el) => el.offsetParent !== null || el.type === 'file');
  if (!foco.length) return;
  const [p, u] = [foco[0], foco.at(-1)];
  if (e.shiftKey && document.activeElement === p) { e.preventDefault(); u.focus(); }
  else if (!e.shiftKey && document.activeElement === u) { e.preventDefault(); p.focus(); }
}

/* ---------- diálogo de confirmação ---------- */
function confirmar({ titulo, texto, sim, aoSim }) {
  const d = document.createElement('div');
  d.className = 'gaveta dialogo';
  d.innerHTML = `<div class="gaveta__veu" data-nao></div><div class="dialogo__caixa" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t" aria-describedby="dlg-p"><h2 id="dlg-t">${esc(titulo)}</h2><p id="dlg-p">${esc(texto)}</p><div class="dialogo__botoes"><button class="botao botao--linha botao--pequeno" type="button" data-nao>Cancelar</button><button class="botao botao--perigo botao--pequeno" type="button" data-sim>${esc(sim)}</button></div></div>`;
  document.body.append(d);
  botoes(d);
  const antes = document.activeElement;
  const fim = () => { d.remove(); document.removeEventListener('keydown', tecla); antes?.focus?.(); };
  const tecla = (e) => { if (e.key === 'Escape') fim(); if (e.key === 'Tab') prende(e, d); };
  document.addEventListener('keydown', tecla);
  d.querySelectorAll('[data-nao]').forEach((b) => b.addEventListener('click', fim));
  d.querySelector('[data-sim]').addEventListener('click', () => { fim(); aoSim(); });
  d.querySelector('[data-nao].botao').focus();
}

/* ---------- loja e horário ---------- */
const CAMPOS_LOJA = [
  ['nome', 'Nome curto (no pino do mapa)', 30], ['razao', 'Nome completo (cartão do mapa e rodapé)', 60],
  ['endereco', 'Rua e número', 80, 'largo'], ['bairro', 'Bairro', 40], ['cidade', 'Cidade', 40], ['uf', 'UF', 2],
  ['referencia', 'Ponto de referência', 80], ['estacionamento', 'Estacionamento', 80, 'largo'],
  ['whatsapp', 'WhatsApp', 16], ['instagram', 'Instagram', 40], ['semHora', 'Aviso de atendimento sem hora marcada', 60, 'largo'],
];
function loja() {
  const p = document.querySelector('[data-painel="loja"]');
  const l = dados.loja;
  p.innerHTML = `
    <div class="aba__cab"><div><h1><span>Loja</span> <strong>e horário.</strong></h1><p>Endereço, contato e o horário de cada dia. O status “Aberto agora”, o fecho e a grade do agendamento seguem este horário.</p></div></div>
    <form data-form-loja novalidate>
      <div class="cartao">
        <h2>Dados da casa</h2>
        <p>Aparecem na seção de endereço, no cartão do mapa e no rodapé. O nome desenhado no topo do site (pente / fino) faz parte do design e muda no código.</p>
        <div class="grade-campos">${CAMPOS_LOJA.map(([k, t, max, cls]) => `<label class="campo${cls ? ` ${cls}` : ''}"><span>${t}</span><input name="${k}" maxlength="${max}" value="${esc(l[k])}" ${k === 'whatsapp' ? 'type="tel" inputmode="tel"' : ''}></label>`).join('')}</div>
      </div>
      <div class="cartao">
        <h2>Horário de funcionamento</h2>
        <p>Desligue o dia em que a casa não abre. A agenda oferece horários de 20 em 20 minutos dentro deste intervalo.</p>
        <div class="semana">${[1, 2, 3, 4, 5, 6, 0].map((d) => { const h = dados.horario[d]; return `
          <div class="dia${h.aberto ? '' : ' is-fechado'}" data-dia="${d}">
            <span class="dia__nome">${DIAS[d]}</span>
            <button class="chave" type="button" role="switch" aria-checked="${h.aberto}" data-dia-chave aria-label="Abre na ${DIAS[d].toLowerCase()}"><i></i><span>${h.aberto ? 'Aberto' : 'Fechado'}</span></button>
            <div class="dia__horas"><input type="time" step="1200" value="${h.abre}" aria-label="${DIAS[d]}: abre às" data-abre> até <input type="time" step="1200" value="${h.fecha}" aria-label="${DIAS[d]}: fecha às" data-fecha></div>
          </div>`; }).join('')}</div>
      </div>
      <div class="salvar-barra"><span data-estado-loja>Tudo salvo.</span><button class="botao botao--claro botao--pequeno" type="submit">Salvar alterações</button></div>
    </form>`;
  const form = p.querySelector('[data-form-loja]');
  const est = p.querySelector('[data-estado-loja]');
  const sujo = () => { est.textContent = 'Alterações não salvas.'; };
  form.addEventListener('input', sujo);
  form.elements.whatsapp.addEventListener('input', (e) => { e.target.value = mascara.fone(e.target.value); });
  form.elements.uf.addEventListener('input', (e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); });
  for (const ch of form.querySelectorAll('[data-dia-chave]')) {
    ch.addEventListener('click', () => {
      const on = ch.getAttribute('aria-checked') !== 'true';
      ch.setAttribute('aria-checked', String(on));
      ch.querySelector('span').textContent = on ? 'Aberto' : 'Fechado';
      ch.closest('.dia').classList.toggle('is-fechado', !on);
      sujo();
    });
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    for (const [k] of CAMPOS_LOJA) dados.loja[k] = form.elements[k].value.trim();
    for (const linha of form.querySelectorAll('[data-dia]')) {
      const d = Number(linha.dataset.dia);
      const abre = linha.querySelector('[data-abre]').value || '09:00';
      const fecha = linha.querySelector('[data-fecha]').value || '18:00';
      const aberto = linha.querySelector('[data-dia-chave]').getAttribute('aria-checked') === 'true';
      if (aberto && fecha <= abre) { aviso(`${DIAS[d]}: o fechamento precisa ser depois da abertura.`, 'erro'); linha.querySelector('[data-fecha]').focus(); return; }
      dados.horario[d] = { aberto, abre, fecha };
    }
    if (grava('Loja e horário salvos. O site já mostra a mudança.')) est.textContent = 'Tudo salvo.';
  });
}

/* ---------- conta ---------- */
function conta() {
  const p = document.querySelector('[data-painel="conta"]');
  const c = lerConta();
  const minha = c && c.email === quem.email ? c : null;
  p.innerHTML = `
    <div class="aba__cab"><div><h1><span>Sua</span> <strong>conta.</strong></h1><p>${minha ? 'Os dados do cadastro do dono.' : 'Você entrou com o acesso de demonstração.'}</p></div></div>
    <div class="cartao">
      <h2>${esc(minha ? minha.nome : DEMO.nome)}</h2>
      <p>${esc(quem.email)}${minha ? ` · ${esc(minha.barbearia)} · ${esc(minha.documento)} · ${esc(minha.whatsapp)}` : ' · conta de demonstração'}</p>
      <button class="botao botao--linha botao--pequeno" type="button" data-sair>Sair do painel</button>
    </div>
    <div class="cartao perigo">
      <h2>Voltar aos dados de exemplo</h2>
      <p>Apaga o que foi cadastrado neste navegador (serviços, barbeiros, produtos, loja e horário) e o site volta a ser a demonstração original.</p>
      <button class="botao botao--linha botao--pequeno" type="button" data-restaurar>Restaurar exemplo</button>
    </div>`;
  p.querySelector('[data-restaurar]').addEventListener('click', () => confirmar({
    titulo: 'Restaurar os dados de exemplo?',
    texto: 'Tudo o que você cadastrou neste navegador volta ao exemplo da Pente Fino.',
    sim: 'Restaurar',
    aoSim: () => { restaurar(); dados = ler(); aviso('Pronto: o site voltou ao exemplo.'); render(); },
  }));
}

/* ---------- início ---------- */
document.querySelector('[data-dono]').textContent = (lerConta()?.email === quem?.email ? lerConta().nome : quem?.nome || DEMO.nome).split(' ')[0];
document.addEventListener('click', (e) => { if (e.target.closest('[data-sair]')) { sair(); location.href = './cliente.html'; } });
botoes();
const inicial = location.hash.slice(1);
troca(['servicos', 'barbeiros', 'produtos', 'loja', 'conta'].includes(inicial) ? inicial : 'servicos');
if (new URLSearchParams(location.search).has('bemvindo')) setTimeout(() => aviso('Conta criada. Bem-vindo ao painel.'), 300);
