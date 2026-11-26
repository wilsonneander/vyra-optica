// Peças de HTML do Silver usadas nos dois lados: o build (Node) gera o site com elas e o navegador
// as usa de novo para mostrar o que a Área do cliente salvou (serviços, equipe, produtos, horário e contatos).
// Uso: const P = MechaPartes({ I, fotoSrc, wa })  (I = ícones em texto SVG)
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.MechaPartes = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const DIAS_C = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const reais = (v) => `R$ ${Math.round(Number(v) || 0).toLocaleString('pt-BR')}`;
  const minutos = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`);
  const horas = (hhmm) => { const [h, m = 0] = String(hhmm).split(':').map(Number); return h + m / 60; };
  const rotuloHora = (h) => { const m = Math.round((h % 1) * 60); return `${Math.floor(h)}h${m ? String(m).padStart(2, '0') : ''}`; };
  const soNumeros = (t) => String(t || '').replace(/\D/g, '');

  // abertura por dia (0 = domingo): [abre, fecha] em horas, ou null quando fecha
  const abertura = (horario) => Object.fromEntries(horario.map((d, i) => [i, d.aberto ? [horas(d.abre), horas(d.fecha)] : null]));
  const textoDia = (d) => (d.aberto ? `${rotuloHora(horas(d.abre))} às ${rotuloHora(horas(d.fecha))}` : 'Fechado');
  // "Ter e qua, 9h às 19h. Qui e sex, 9h às 21h. Sáb, 9h às 18h": junta dias seguidos com o mesmo horário
  const horarioCurto = (horario) => {
    const grupos = [];
    for (let i = 1; i <= 7; i++) {
      const k = i % 7, d = horario[k];
      if (!d.aberto) continue;
      const t = textoDia(d), ult = grupos[grupos.length - 1];
      if (ult && ult.t === t && (ult.dias[ult.dias.length - 1] + 1) % 7 === k) ult.dias.push(k); else grupos.push({ t, dias: [k] });
    }
    return grupos.map((g) => {
      const n = g.dias.map((k) => DIAS_C[k].toLowerCase());
      const dias = n.length === 1 ? n[0] : n.length === 2 ? `${n[0]} e ${n[1]}` : `${n[0]} a ${n[n.length - 1]}`;
      return `${dias[0].toUpperCase()}${dias.slice(1)}, ${g.t}`;
    }).join('. ');
  };

  return function crie({ I, fotoSrc, wa }) {
    const img = (src, alt, { cls = '', lazy = true, attrs = '' } = {}) => `<img${cls ? ` class="${cls}"` : ''} src="${esc(fotoSrc(src))}" alt="${esc(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ''}${attrs}>`;
    const ativos = (lista) => lista.filter((x) => x.ativo !== false);
    const segsComServico = (L) => L.segmentos.filter((g) => ativos(L.servicos).some((s) => s.seg === g.id));

    const aviso = (s) => (s.quimica ? `<p class="sv-q">${s.seg === 'sobrancelha' ? 'Teste de sensibilidade 48h antes' : 'Teste de mecha 48h antes'}</p>` : '');
    const servCard = (s) => `<article class="sv${s.destaque ? ' sv-destaque' : ''}" id="s-${esc(s.id)}">
          <h4>${esc(s.nome)}${s.destaque ? '<small>o mais pedido</small>' : ''}</h4>
          <p>${esc(s.inclui)}</p>${aviso(s)}
          <div class="sv-pe"><span class="sv-tempo">${I.relogio}${minutos(s.min)}</span><b class="sv-preco">${s.de ? '<small>a partir de</small>' : ''}${reais(s.preco)}</b></div>
          <a class="sv-ag" href="#agendar" data-servico="${esc(s.id)}"><span>Agendar</span>${I.seta}</a>
        </article>`;

    const segBloco = (g, L) => {
      const lista = ativos(L.servicos).filter((s) => s.seg === g.id);
      return `<section class="seg" id="seg-${g.id}" data-seg="${g.id}" aria-labelledby="seg-${g.id}-t">
        <header class="seg-cab rev">
          <figure class="seg-foto">${img(g.foto, g.alt || '')}</figure>
          <div class="seg-txt"><h3 id="seg-${g.id}-t">${esc(g.nome)}</h3><p>${esc(g.texto)}</p><span class="seg-qtd">${lista.length} ${lista.length === 1 ? 'serviço' : 'serviços'}</span></div>
        </header>
        <div class="sv-grade">
        ${lista.map(servCard).join('\n        ')}
        </div>
      </section>`;
    };
    const segNav = (L) => segsComServico(L).map((g) => `<a href="#seg-${g.id}" data-nav-seg="${g.id}">${esc(g.nome)}</a>`).join('');
    const servicosHtml = (L) => segsComServico(L).map((g) => segBloco(g, L)).join('\n      ');

    // opções do formulário (agrupadas por segmento)
    const opcoes = (L) => segsComServico(L).map((g) => `<optgroup label="${esc(g.nome)}">${ativos(L.servicos).filter((s) => s.seg === g.id).map((s) => `<option value="${esc(s.id)}">${esc(s.nome)}</option>`).join('')}</optgroup>`).join('');

    const nomesSeg = (L, ids) => ids.map((id) => L.segmentos.find((g) => g.id === id)?.curto).filter(Boolean).join(', ');
    const primeiro = (nome) => String(nome).split(' ')[0];

    // cartão da equipe no carrossel da página inicial
    const proCard = (m) => `<article class="pro" id="pro-${esc(m.id)}">
          <figure class="pro-foto">${img(m.foto, m.alt || m.nome)}</figure>
          <div class="pro-txt">
            <h3>${esc(m.nome)}</h3>
            <p class="pro-cargo">${esc(m.cargo)}</p>
            <p class="pro-esp">${esc(m.esp)}</p>
            <p class="pro-anos">${m.anos} anos de profissão</p>
            <a class="pro-link" href="equipe.html#p-${esc(m.id)}"><span>Ver perfil</span>${I.seta}</a>
          </div>
        </article>`;

    // agenda da semana de uma profissional (só os dias em que o salão abre)
    const agenda = (m, L) => {
      const ab = abertura(L.horario);
      const dias = [1, 2, 3, 4, 5, 6, 0].filter((d) => ab[d]);
      return `<table class="agenda"><caption>Agenda da semana</caption><tr>${dias.map((d) => `<th scope="col">${DIAS_C[d]}</th>`).join('')}</tr><tr>${dias.map((d) => {
        const h = m.dias?.[d];
        return h ? `<td>${rotuloHora(h[0])}<span>às</span>${rotuloHora(h[1])}</td>` : '<td class="folga">folga</td>';
      }).join('')}</tr></table>`;
    };

    // perfil completo na página da equipe
    const membro = (m, L, k) => `<article class="membro${k % 2 ? ' inverte' : ''}" id="p-${esc(m.id)}">
        <figure class="membro-foto rev">${img(m.foto, m.alt || m.nome)}</figure>
        <div class="membro-txt rev">
          <p class="apoio">${esc(m.cargo)}</p>
          <h2>${esc(m.nome)}</h2>
          <p class="membro-bio">${esc(m.bio || '')}</p>
          <dl class="membro-dados">
            <div><dt>Especialidade</dt><dd>${esc(m.esp)}</dd></div>
            <div><dt>Na profissão</dt><dd>${m.anos} anos</dd></div>
            <div><dt>Atende</dt><dd>${esc(nomesSeg(L, m.faz || []))}</dd></div>
            ${m.formacao ? `<div><dt>Formação</dt><dd>${esc(m.formacao)}</dd></div>` : ''}
          </dl>
          ${agenda(m, L)}
          <a class="btn btn-telha" href="index.html?prof=${encodeURIComponent(m.id)}#agendar">${I.calendario}<span>Agendar com ${esc(primeiro(m.nome))}</span></a>
        </div>
      </article>`;

    const produto = (p, nome) => `<article class="prod rev">
          <figure class="prod-foto">${p.foto ? img(p.foto, p.alt || p.nome) : `<span class="prod-vazio" aria-hidden="true">${I.simbolo()}</span>`}</figure>
          <div class="prod-txt"><h3>${esc(p.nome)}</h3><p>${esc(p.det)}</p></div>
          <div class="prod-pe"><b>${reais(p.preco)}</b><a href="${esc(wa(`Olá, ${nome}! Quero reservar o produto ${p.nome} (${reais(p.preco)}) para retirar no salão.`))}" target="_blank" rel="noopener">${I.whats}<span>Reservar</span></a></div>
        </article>`;

    const horasLinhas = (horario) => horario.map((d, i) => [d, i]).sort((a, b) => ((a[1] + 6) % 7) - ((b[1] + 6) % 7)).map(([d, i]) => `<tr data-dia="${i}"><th scope="row">${DIAS[i]}</th><td>${textoDia(d)}</td></tr>`).join('');

    return { esc, reais, minutos, horas, rotuloHora, soNumeros, abertura, horarioCurto, textoDia, img, ativos, segsComServico, servCard, segBloco, segNav, servicosHtml, opcoes, proCard, membro, agenda, produto, horasLinhas, nomesSeg, primeiro, DIAS, DIAS_C };
  };
});
