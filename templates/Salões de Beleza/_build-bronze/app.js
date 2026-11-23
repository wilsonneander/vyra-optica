// Mecha Barbearia, Bronze: painel lateral, revelação dos blocos, paralaxe das fotos, avaliações com colunas passando,
// foto do espaço que cresce, frase corrida, agenda por barbeiro com Google Agenda e .ics, desconto do rodapé, janelas legais e cookies.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const D = JSON.parse($('#dados')?.textContent || '{}');
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reais = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
  const wa = (msg) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`;
  const limita = (v) => Math.min(1, Math.max(0, v));
  const hora = (h) => `${Math.floor(h)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const guarda = {
    ler(k, padrao) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento: segue sem lembrar */ } },
  };
  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (t) => { if (!toastEl) return; toastEl.textContent = t; toastEl.classList.add('ve'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('ve'), 2800); };

  // ---------- grupos com o mesmo tamanho: mede o item mais largo e aplica em --larg ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    if (!g.offsetParent && getComputedStyle(g).position !== 'fixed') return;
    if (getComputedStyle(g).position === 'static') g.style.position = 'relative';
    let maior = 0;
    for (const f of [...g.children]) {
      if (f.hidden) continue;
      const c = f.cloneNode(true);
      c.style.cssText = 'position:absolute;visibility:hidden;width:max-content;left:0;top:0;pointer-events:none';
      c.removeAttribute('id');
      g.appendChild(c);
      maior = Math.max(maior, c.getBoundingClientRect().width);
      c.remove();
    }
    if (maior) g.style.setProperty('--larg', `${Math.ceil(maior) + 2}px`);
  });
  let igualaT;
  const igualaDepois = () => { clearTimeout(igualaT); igualaT = setTimeout(iguala, 60); };
  addEventListener('resize', igualaDepois);
  if (document.fonts) document.fonts.ready.then(iguala);
  iguala();

  // ---------- painel lateral (botão de pontos) ----------
  const painel = $('#painel'), painelBtn = $('.painel-btn');
  const abrePainel = () => {
    painel.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => painel.classList.add('abre')));
    painelBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    igualaDepois();
    setTimeout(() => $('.fecha', painel)?.focus(), 60);
  };
  const fechaPainel = () => {
    painel.classList.remove('abre');
    painelBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { painel.hidden = true; }, reduz ? 0 : 500);
  };
  painelBtn?.addEventListener('click', abrePainel);
  $$('[data-fecha-painel]', painel).forEach((b) => b.addEventListener('click', () => { fechaPainel(); painelBtn.focus(); }));
  $$('.painel-nav a', painel).forEach((a) => a.addEventListener('click', fechaPainel));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && painel.classList.contains('abre')) { fechaPainel(); painelBtn.focus(); } });

  // ---------- revelação dos blocos ----------
  const revs = $$('.rev');
  if (reduz || !('IntersectionObserver' in window)) revs.forEach((el) => el.classList.add('ve'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('ve'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    revs.forEach((el) => io.observe(el));
  }

  // ---------- rolagem: paralaxe, avaliações, espaço e frase corrida ----------
  const pars = $$('[data-par]');
  const aval = $('.avaliacoes'), cols = $$('.aval-col'), avals = $$('.aval'), quems = $$('.quem');
  const espacoFoto = $('.espaco-foto'), corrida = $('.corrida p');
  const largoPC = () => innerWidth > 900;
  let avalAtual = 0, pedido = false;
  const quadro = () => {
    pedido = false;
    const vh = innerHeight;
    // fotos do "sobre" andam em velocidades diferentes
    for (const el of pars) {
      const r = el.getBoundingClientRect();
      const meio = r.top + r.height / 2 - vh / 2;
      el.style.translate = `0 ${(meio * +el.dataset.par).toFixed(1)}px`;
    }
    // avaliações: a frase fica presa e as colunas de fotos passam por cima
    if (aval) {
      const r = aval.getBoundingClientRect();
      const p = limita(-r.top / (r.height - vh));
      if (largoPC()) {
        const vel = [1.25, 0.85, 1.4];
        cols.forEach((c, k) => {
          const total = c.scrollHeight + vh;
          c.style.translate = `0 ${(vh - p * total * vel[k] + (k === 1 ? vh * 0.35 : 0)).toFixed(1)}px`;
        });
      }
      const n = Math.min(avals.length - 1, Math.floor(p * avals.length));
      if (n !== avalAtual) {
        avalAtual = n;
        avals.forEach((a, k) => a.classList.toggle('on', k === n));
        quems.forEach((a, k) => a.classList.toggle('on', k === n));
      }
    }
    // foto do espaço cresce até a largura toda
    if (espacoFoto) {
      const r = espacoFoto.getBoundingClientRect();
      const p = limita((vh - r.top) / (vh * 0.9));
      espacoFoto.style.setProperty('--cresce', (0.86 + p * 0.14).toFixed(4));
    }
    // frase corrida anda para a esquerda com a rolagem
    if (corrida) {
      const r = corrida.parentElement.getBoundingClientRect();
      const p = limita((vh - r.top) / (vh + r.height));
      const fim = corrida.scrollWidth - innerWidth * 0.7;
      corrida.style.setProperty('--corre', `${(-p * fim).toFixed(1)}px`);
    }
  };
  const pede = () => { if (!pedido) { pedido = true; requestAnimationFrame(quadro); } };
  if (!reduz) { addEventListener('scroll', pede, { passive: true }); addEventListener('resize', pede); quadro(); }

  // ---------- horário de hoje em destaque ----------
  $(`.horas tr[data-dia="${new Date().getDay()}"]`)?.classList.add('hoje');

  // ---------- agendamento: barbeiros e horários livres ----------
  const form = $('#form-agenda');
  if (form) {
    const f = form.elements;
    const servPor = Object.fromEntries((D.servicos || []).map((s) => [s.id, s]));
    const fazem = (sid) => (D.equipe || []).filter((p) => !sid || p.faz.includes(sid));
    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const deIso = (s) => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
    const hoje = new Date();
    f.data.min = iso(hoje);
    const limite = new Date(hoje); limite.setDate(limite.getDate() + 60); f.data.max = iso(limite);

    const preencheProfs = () => {
      const atual = f.prof.value;
      const ps = fazem(f.servico.value);
      f.prof.innerHTML = `<option value="">Sem preferência</option>${ps.map((p) => `<option value="${p.id}">${p.nome}</option>`).join('')}`;
      if (ps.some((p) => p.id === atual)) f.prof.value = atual;
    };
    // horários livres de 30 em 30 minutos, dentro da agenda do barbeiro (ou de quem faz o serviço) e do funcionamento
    const horarios = () => {
      const s = servPor[f.servico.value];
      if (!s || !f.data.value) return null;
      const dia = deIso(f.data.value).getDay();
      const casa = D.abertura?.[dia];
      if (!casa) return { fechado: true };
      const ps = f.prof.value ? fazem(s.id).filter((p) => p.id === f.prof.value) : fazem(s.id);
      const dur = s.min / 60;
      const agora = new Date();
      const hojeSel = iso(agora) === f.data.value;
      const livres = new Set();
      for (const p of ps) {
        const ag = p.agenda[dia]; if (!ag) continue;
        const ini = Math.max(ag[0], casa[0]), fim = Math.min(ag[1], casa[1]);
        for (let h = ini; h + dur <= fim + 1e-9; h += 0.5) {
          if (hojeSel && h <= agora.getHours() + agora.getMinutes() / 60 + 1) continue;
          livres.add(h);
        }
      }
      return { lista: [...livres].sort((a, b) => a - b) };
    };
    const preencheHoras = () => {
      const r = horarios();
      if (!r) { f.hora.disabled = true; f.hora.innerHTML = '<option value="">Escolha serviço e data</option>'; return; }
      if (r.fechado) { f.hora.disabled = true; f.hora.innerHTML = '<option value="">Fechado neste dia</option>'; return; }
      if (!r.lista.length) {
        f.hora.disabled = true;
        const nome = f.prof.value ? f.prof.selectedOptions[0].textContent.split(' ')[0] : 'a equipe';
        f.hora.innerHTML = `<option value="">Sem horário com ${nome} nesta ${DIAS[deIso(f.data.value).getDay()]}</option>`;
        return;
      }
      const atual = f.hora.value;
      f.hora.disabled = false;
      f.hora.innerHTML = `<option value="">Escolha o horário</option>${r.lista.map((h) => `<option value="${h}">${hora(h)}</option>`).join('')}`;
      if (r.lista.map(String).includes(atual)) f.hora.value = atual;
    };
    const avisoQ = $('[data-aviso-quimica]', form);
    f.servico.addEventListener('change', () => { preencheProfs(); preencheHoras(); avisoQ.hidden = !servPor[f.servico.value]?.quimica; });
    f.prof.addEventListener('change', preencheHoras);
    f.data.addEventListener('change', preencheHoras);
    preencheProfs();

    // atalhos da página que já escolhem serviço ou barbeiro
    $$('[data-servico]').forEach((a) => a.addEventListener('click', () => {
      if (!servPor[a.dataset.servico]) return;
      f.servico.value = a.dataset.servico; f.servico.dispatchEvent(new Event('change'));
      toast(`${servPor[a.dataset.servico].nome} selecionado. Escolha a data.`);
    }));
    $$('[data-prof]').forEach((a) => a.addEventListener('click', () => {
      const p = (D.equipe || []).find((x) => x.id === a.dataset.prof);
      if (!p) return;
      if (f.servico.value && !p.faz.includes(f.servico.value)) f.servico.value = '';
      preencheProfs(); f.prof.value = p.id; preencheHoras();
      toast(`${p.nome.split(' ')[0]} selecionado. Escolha o serviço e a data.`);
    }));

    // links de agenda (Google Agenda e arquivo .ics para Apple e outras)
    const doisDig = (n) => String(n).padStart(2, '0');
    const carimbo = (d) => `${d.getFullYear()}${doisDig(d.getMonth() + 1)}${doisDig(d.getDate())}T${doisDig(d.getHours())}${doisDig(d.getMinutes())}00`;
    const agendaLinks = (s, ini, prof) => {
      const fim = new Date(ini.getTime() + s.min * 60000);
      const titulo = `${s.nome} na ${D.nome}`;
      const desc = `Com ${prof}. Tolerância de 15 minutos. Remarcação sem custo até 24 horas antes.`;
      const g = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&dates=${carimbo(ini)}/${carimbo(fim)}&ctz=America/Sao_Paulo&details=${encodeURIComponent(desc)}&location=${encodeURIComponent(D.endereco)}`;
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mecha Barbearia//Agendamento//PT', 'BEGIN:VEVENT', `UID:${Date.now()}@mecha`, `DTSTAMP:${carimbo(new Date())}`,
        `DTSTART;TZID=America/Sao_Paulo:${carimbo(ini)}`, `DTEND;TZID=America/Sao_Paulo:${carimbo(fim)}`, `SUMMARY:${titulo}`, `DESCRIPTION:${desc}`, `LOCATION:${D.endereco.replace(/,/g, '\\,')}`,
        'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:Seu horário na Mecha', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      return { g, url };
    };

    const erro = $('.form-erro', form), ok = $('.form-ok', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      $$('.erro', form).forEach((x) => x.classList.remove('erro'));
      const faltam = [];
      const marca = (campo, nome) => { campo.closest('label')?.classList.add('erro'); faltam.push(nome); };
      if (!f.nome.value.trim()) marca(f.nome, 'nome');
      if (f.tel.value.replace(/\D/g, '').length < 10) marca(f.tel, 'telefone com DDD');
      if (f.email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value)) marca(f.email, 'e-mail válido');
      if (!f.servico.value) marca(f.servico, 'serviço');
      if (!f.data.value) marca(f.data, 'data');
      if (!f.hora.value) marca(f.hora, 'horário');
      if (!f.lgpd.checked) faltam.push('o aceite da Política de Privacidade');
      if (faltam.length) { erro.hidden = false; erro.textContent = `Falta preencher: ${faltam.join(', ')}.`; return; }
      erro.hidden = true;
      const s = servPor[f.servico.value];
      const d = deIso(f.data.value);
      const h = +f.hora.value;
      const prof = f.prof.value ? f.prof.selectedOptions[0].textContent : 'sem preferência';
      const comQuem = f.prof.value ? prof : 'o primeiro barbeiro livre';
      const quando = `${DIAS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}, às ${hora(h)}`;
      const msg = [
        `Olá! Quero pedir um horário na ${D.nome}.`,
        `Nome: ${f.nome.value.trim()}`, `Telefone: ${f.tel.value.trim()}`, f.email.value ? `E-mail: ${f.email.value.trim()}` : '',
        `Serviço: ${s.nome} (${s.de ? 'a partir de ' : ''}${reais(s.preco)})`, `Barbeiro: ${prof}`, `Quando: ${quando}`,
        f.obs.value.trim() ? `Observações: ${f.obs.value.trim()}` : '',
        `Aceito a Política de Privacidade. Novidades pelo WhatsApp: ${f.novidades.checked ? 'sim' : 'não'}.`,
      ].filter(Boolean).join('\n');
      window.open(wa(msg), '_blank', 'noopener');
      const ini = new Date(d); ini.setHours(Math.floor(h), Math.round((h % 1) * 60), 0, 0);
      const { g, url } = agendaLinks(s, ini, comQuem);
      ok.hidden = false;
      ok.innerHTML = `<b>Pedido pronto para envio</b><span>${s.nome} com ${comQuem}, ${quando}. O WhatsApp abriu com a mensagem; é só enviar. Confirmamos em até uma hora no horário de funcionamento.</span>
        <span>Já quer salvar na agenda?</span>
        <div class="cal"><a href="${g}" target="_blank" rel="noopener">Google Agenda</a><a href="${url}" download="horario-mecha.ics">Apple Agenda (.ics)</a></div>`;
      toast('Pedido montado. Confira no WhatsApp.');
    });
  }

  // ---------- desconto do rodapé ----------
  const news = $('#form-news');
  news?.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = $('.news-msg', news);
    msg.hidden = false;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(news.email.value)) { msg.textContent = 'Confira o e-mail digitado.'; return; }
    if (!news.lgpd.checked) { msg.textContent = 'Marque o aceite para receber o desconto.'; return; }
    guarda.gravar('mecha-barbearia-news', { em: Date.now() });
    msg.textContent = 'Pronto! Use o código PRIMEIRA5 ao agendar. Ele vale para a primeira visita.';
    news.email.value = ''; news.lgpd.checked = false;
  });

  // ---------- janelas legais e cookies ----------
  $$('[data-doc]').forEach((b) => b.addEventListener('click', () => { const d = $(`#doc-${b.dataset.doc}`); if (d?.showModal) d.showModal(); }));
  $$('dialog.doc').forEach((d) => {
    $('[data-fecha]', d).addEventListener('click', () => d.close());
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });
  const ck = $('#cookies');
  if (ck) {
    if (!guarda.ler('mecha-cookies', null)) { ck.hidden = false; igualaDepois(); }
    $$('[data-ck]', ck).forEach((b) => b.addEventListener('click', () => { guarda.gravar('mecha-cookies', { escolha: b.dataset.ck, em: Date.now() }); ck.hidden = true; }));
    $$('[data-cookies]').forEach((b) => b.addEventListener('click', () => { ck.hidden = false; igualaDepois(); }));
  }
})();
