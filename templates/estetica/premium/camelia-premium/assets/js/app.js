(() => {
  const D = {"whatsapp":"5519999990000","nome":"Camélia Estética","abertura":[null,[9,20],[9,20],[9,20],[9,20],[9,20],[8,14]],"agenda":{"passo":90,"dias":12,"antesDoFim":60},"salas":[{"id":"recepcao","nome":"Recepção"},{"id":"consultorio","nome":"Consultório"},{"id":"avaliacao","nome":"Sala de avaliação"},{"id":"procedimentos","nome":"Sala de procedimentos"},{"id":"corporal","nome":"Sala corporal"},{"id":"olhar","nome":"Estúdio do olhar"}]};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const raiz = document.documentElement;
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const guarda = {
    ler(k, t = localStorage) { try { return t.getItem(k); } catch (e) { return null; } },
    por(k, v, t = localStorage) { try { t.setItem(k, v); } catch (e) { /* sem armazenamento */ } },
  };
  const limita = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const q = new URLSearchParams(location.search);

  // ---------- segmentos pelo link (?seg=facial,corporal) ----------
  const pedido = q.get('seg');
  if (pedido) {
    const ok = pedido.split(',').map((s) => s.trim()).filter(Boolean);
    const todos = [...new Set($$('[data-seg]').map((el) => el.dataset.seg))];
    if (ok.some((s) => todos.includes(s))) $$('[data-seg]').forEach((el) => { if (!ok.includes(el.dataset.seg)) el.remove(); });
  }

  // ---------- visita em 3D ----------
  const visita = $('#visita');
  const canvas = $('#cena');
  const carrega = $('#carrega');
  const paradas = $$('.parada', visita);
  const ids = paradas.map((p) => p.dataset.parada);
  const nomeSala = Object.fromEntries(D.salas.map((s) => [s.id, s.nome]));
  const tiraCarrega = () => { if (!carrega) return; carrega.classList.add('some'); setTimeout(() => carrega.remove(), 900); };
  let cena = null;
  const temGL = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } })();
  if (temGL && window.CameliaCena && window.THREE && window.CAMELIA_CENA) {
    try {
      cena = window.CameliaCena.criar(canvas, window.CAMELIA_CENA, { cel: matchMedia('(max-width: 760px)').matches, calmo, escuro: raiz.dataset.tema === 'escuro' });
      cena.paradas(ids);
    } catch (e) { cena = null; console.warn('Visita 3D indisponível:', e); }
  }
  if (!cena) { raiz.classList.add('sem3d'); tiraCarrega(); }

  // marcos de rolagem: onde o drone chega em cada sala e onde ele sai para a próxima
  let marcos = [];
  const mede = () => {
    const vh = innerHeight, n = paradas.length;
    marcos = paradas.map((sec, i) => {
      const r = $('[data-placa]', sec).getBoundingClientRect();
      const topo = r.top + scrollY, base = r.bottom + scrollY;
      const chega = i === 0 ? 0 : topo - vh * 0.86;
      let sai = i === 0 ? Math.max(vh * 0.05, base - vh * 0.8) : base - vh * 0.36;
      if (i === n - 1) sai = Math.max(sai, chega + vh * 0.4);
      return { chega, sai: Math.max(sai, chega + 1) };
    });
  };
  const posDaRolagem = (s) => {
    for (let i = 0; i < marcos.length; i++) {
      const m = marcos[i];
      if (i > 0 && s < m.chega) { const a = marcos[i - 1].sai; return { pos: i - 1 + limita((s - a) / (m.chega - a)), leitura: 1 }; }
      if (s <= m.sai || i === marcos.length - 1) return { pos: i, leitura: limita((s - m.chega) / (m.sai - m.chega)) };
    }
    return { pos: 0, leitura: 0 };
  };
  const irParaParada = (i, suave = true) => {
    const m = marcos[i]; if (!m) return;
    scrollTo({ top: i === 0 ? 0 : m.chega + (m.sai - m.chega) * 0.08 + 2, behavior: suave && !calmo ? 'smooth' : 'auto' });
  };

  if (cena) {
    let pendente = false;
    const atualiza = () => { pendente = false; const { pos, leitura } = posDaRolagem(scrollY); cena.definir(pos, leitura); };
    const pede = () => { if (!pendente) { pendente = true; requestAnimationFrame(atualiza); } };
    const remede = () => { mede(); pede(); };
    mede();
    addEventListener('scroll', pede, { passive: true });
    addEventListener('resize', () => { cena.ajusta(); remede(); });
    if (document.fonts) document.fonts.ready.then(() => { remede(); cena.redesenha(); });
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(remede); paradas.forEach((p) => ro.observe($('[data-placa]', p))); }
    // ?parada=consultorio abre direto na sala (bom para mostrar ao cliente)
    const pedida = ids.indexOf(q.get('parada'));
    if (pedida > 0) { irParaParada(pedida, false); }
    const { pos } = posDaRolagem(scrollY); cena.pular(pos);
    // o drone só trabalha enquanto a visita está na tela
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { const v = es[0].isIntersecting; cena.ativo(v); raiz.classList.toggle('na-visita', v); }, { rootMargin: '-100px 0px -30% 0px' }).observe(visita);
    else raiz.classList.add('na-visita');
    cena.aoPrimeiroQuadro(() => setTimeout(tiraCarrega, 250));
    setTimeout(tiraCarrega, 7000);
    cena.comecar();
  } else {
    raiz.classList.add('na-visita');
    mede();
  }

  // gancho para testes automáticos (prints de cada sala)
  window.__camelia = { cena, marcos: () => marcos, ir: (i) => irParaParada(i, false) };

  // ---------- mini planta: onde o drone está; um toque na sala leva até ela ----------
  const pm = $('#planta-mini');
  const pmDrone = $('.pm-drone', pm), pmTxt = $('[data-sala-atual]', pm);
  const pmSalas = $$('.pm-sala', pm);
  const salasCena = cena ? cena.salas : [];
  const idxDe = (id) => ids.indexOf(id);
  const vai = (id) => { const i = idxDe(id); if (i >= 0) irParaParada(i); };
  pmSalas.forEach((r) => { if (idxDe(r.dataset.sala) >= 0) { r.classList.add('pm-vai'); r.addEventListener('click', () => vai(r.dataset.sala)); } });
  $$('[data-ir]', pm).forEach((b) => b.addEventListener('click', () => vai(b.dataset.ir)));
  // rótulos das salas na vista de cima
  const rotulos = $('[data-rotulos]');
  const rot = salasCena.map((s) => { const el = document.createElement('span'); el.className = 'rotulo'; el.textContent = s.curto || s.nome; rotulos.appendChild(el); return [s, el]; });
  let ultimaSala = '';
  const acompanha = () => {
    requestAnimationFrame(acompanha);
    if (!cena || !raiz.classList.contains('na-visita')) return;
    const c = cena.camera(), n = ids.length;
    pmDrone.setAttribute('transform', `translate(${c.x.toFixed(2)} ${limita(c.z, -3.4, 3.9).toFixed(2)})`);
    let atual = '';
    const aqui = ids[Math.round(c.pos)];
    if (aqui === 'fachada' && c.z > 3.3) atual = 'Frente da clínica';
    else if (c.y > 4.5) atual = aqui === 'planta' ? 'Vista de cima' : 'Sobre a clínica';
    else if (c.z > 3.3) atual = 'Frente da clínica';
    else { const s = salasCena.find((x) => c.x >= x.x[0] && c.x < x.x[1]); atual = s ? s.nome : ''; }
    if (atual !== ultimaSala) {
      ultimaSala = atual; pmTxt.textContent = atual;
      pmSalas.forEach((r) => r.classList.toggle('pm-aqui', nomeSala[r.dataset.sala] === atual));
    }
    const vis = ids[n - 1] === 'planta' ? limita((c.pos - (n - 1.35)) / 0.3) * limita(1 - cena.telhado() * 1.5) : 0;
    rotulos.style.opacity = vis.toFixed(3);
    if (vis > 0.01) rot.forEach(([s, el], i) => { const p = cena.projeta(s.cx, 0.4, i % 2 ? 1.1 : -1.4); el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) translate(-50%, -50%)`; });
  };
  acompanha();

  // ---------- placas: o conteúdo entra quando a placa aparece ----------
  if ('IntersectionObserver' in window && !calmo) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    $$('[data-placa], .quadro-sala, .sec-topo, .ad-card, .depo, .pagar > div, .regras > div, .higiene, .pergunta, .form, .ag-lado, .rodape-mapa > *').forEach((el) => { el.classList.add('rv'); io.observe(el); });
  }

  // ---------- antes e depois: cada cartão tem a própria cortina ----------
  $$('.ad-palco').forEach((palco) => {
    const range = $('.ad-range', palco);
    let mexeu = false;
    const poe = (v) => palco.style.setProperty('--p', `${v}%`);
    range.addEventListener('input', () => { mexeu = true; poe(range.value); });
    range.addEventListener('pointerdown', () => { mexeu = true; });
    if (calmo || !('IntersectionObserver' in window)) return;
    const vaiAD = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      vaiAD.disconnect();
      const ini = performance.now() + 700 + Math.random() * 400, dur = 2000;
      const passo = (t) => {
        if (mexeu) return;
        const p = Math.max(0, Math.min((t - ini) / dur, 1));
        const v = 50 + Math.sin(p * Math.PI * 2) * 20 * (1 - p * 0.35);
        poe(Math.round(v * 10) / 10); range.value = v;
        if (p < 1) requestAnimationFrame(passo); else poe(50);
      };
      requestAnimationFrame(passo);
    }, { threshold: 0.6 });
    vaiAD.observe(palco);
  });

  // ---------- aberto agora ----------
  const nomes = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const curtos = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hm = (h) => `${Math.floor(h)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;
  const agora = new Date();
  const dia = agora.getDay();
  const hora = agora.getHours() + agora.getMinutes() / 60;
  const hoje = D.abertura[dia];
  let status;
  if (hoje && hora >= hoje[0] && hora < hoje[1]) status = `Aberto agora, até as ${hm(hoje[1])}`;
  else if (hoje && hora < hoje[0]) status = `Abre hoje às ${hm(hoje[0])}`;
  else {
    let d = dia, n = 0;
    do { d = (d + 1) % 7; n++; } while (!D.abertura[d] && n < 7);
    status = `Fechado agora. Abre ${n === 1 ? 'amanhã' : nomes[d]} às ${hm(D.abertura[d][0])}`;
  }
  $$('[data-status]').forEach((el) => { el.textContent = status; });
  $$(`.horas [data-linha="${dia === 0 ? 2 : dia === 6 ? 1 : 0}"]`).forEach((tr) => tr.classList.add('hoje'));
  $$('[data-ano]').forEach((el) => { el.textContent = agora.getFullYear(); });

  // ---------- agenda: próximos dias abertos e horários do dia escolhido ----------
  const caixaDias = $('[data-dias]'), caixaHoras = $('[data-horarios]'), semHora = $('[data-sem-horario]');
  const A = D.agenda;
  const horariosDe = (data) => {
    const ab = D.abertura[data.getDay()]; if (!ab) return [];
    const lista = [];
    for (let h = ab[0]; h <= ab[1] - A.antesDoFim / 60 + 1e-6; h += A.passo / 60) lista.push(h);
    const ehHoje = data.toDateString() === agora.toDateString();
    return ehHoje ? lista.filter((h) => h > hora + 1.5) : lista;
  };
  const diasLivres = [];
  for (let k = 0; k < 40 && diasLivres.length < A.dias; k++) {
    const d = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + k);
    if (horariosDe(d).length) diasLivres.push(d);
  }
  const dd = (n) => String(n).padStart(2, '0');
  caixaDias.innerHTML = diasLivres.map((d, i) => `<label><input type="radio" name="dia" value="${i}"${i ? '' : ' checked'}><span><b>${i === 0 && d.toDateString() === agora.toDateString() ? 'Hoje' : curtos[d.getDay()]}</b>${dd(d.getDate())}/${dd(d.getMonth() + 1)}</span></label>`).join('');
  const pintaHoras = () => {
    const i = +((caixaDias.querySelector('input:checked') || {}).value || 0);
    const hs = diasLivres[i] ? horariosDe(diasLivres[i]) : [];
    caixaHoras.innerHTML = hs.map((h, k) => `<label><input type="radio" name="hora" value="${hm(h)}"${k ? '' : ' checked'}><span>${hm(h)}</span></label>`).join('');
    semHora.hidden = hs.length > 0;
  };
  caixaDias.addEventListener('change', pintaHoras);
  pintaHoras();

  // ---------- tema claro e escuro (a clínica anoitece junto) ----------
  const btnTema = $('.tema-btn');
  const marcaTema = () => {
    const escuro = raiz.dataset.tema === 'escuro';
    btnTema.setAttribute('aria-pressed', String(escuro));
    btnTema.setAttribute('aria-label', escuro ? 'Ativar tema claro' : 'Ativar tema escuro');
    btnTema.title = escuro ? 'Tema claro' : 'Tema escuro';
  };
  const aplicaTema = (escuro) => {
    if (escuro) raiz.dataset.tema = 'escuro'; else delete raiz.dataset.tema;
    guarda.por('camelia-tema', escuro ? 'escuro' : 'claro');
    marcaTema();
    if (cena) cena.tema(escuro);
  };
  marcaTema();
  btnTema.addEventListener('click', () => {
    const escuro = raiz.dataset.tema !== 'escuro';
    if (document.startViewTransition && !calmo) {
      const r = btnTema.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = document.startViewTransition(() => aplicaTema(escuro));
      vt.ready.then(() => raiz.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${raio}px at ${x}px ${y}px)`] },
        { duration: 850, easing: 'cubic-bezier(.22, .7, .2, 1)', pseudoElement: '::view-transition-new(root)' },
      )).catch(() => {});
    } else {
      if (!calmo) raiz.classList.add('tema-anim');
      aplicaTema(escuro);
      setTimeout(() => raiz.classList.remove('tema-anim'), 700);
    }
  });

  // ---------- topo e menu ----------
  const topo = $('#topo');
  const rolou = () => topo.classList.toggle('rolou', scrollY > 10);
  addEventListener('scroll', rolou, { passive: true });
  rolou();
  const btnMenu = $('.menu-btn');
  const fechaMenu = () => { topo.classList.remove('aberto'); btnMenu.setAttribute('aria-expanded', 'false'); btnMenu.setAttribute('aria-label', 'Abrir menu'); };
  btnMenu.addEventListener('click', () => {
    const abre = !topo.classList.contains('aberto');
    topo.classList.toggle('aberto', abre);
    btnMenu.setAttribute('aria-expanded', String(abre));
    btnMenu.setAttribute('aria-label', abre ? 'Fechar menu' : 'Abrir menu');
  });
  // links para as paradas descem até o ponto em que o drone já chegou na sala
  $$('a[href^="#"]').forEach((a) => {
    const alvo = document.getElementById(a.getAttribute('href').slice(1));
    a.addEventListener('click', (e) => {
      fechaMenu();
      if (!alvo || !alvo.classList.contains('parada')) return;
      const i = paradas.indexOf(alvo); if (i < 0) return;
      e.preventDefault(); irParaParada(i);
    });
  });

  // ---------- grupos com a mesma largura ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    g.style.removeProperty('--larg');
    const m = Math.max(...[...g.children].map((c) => c.scrollWidth));
    if (m > 0) g.style.setProperty('--larg', `${Math.ceil(m) + 2}px`);
  });
  iguala();
  if (document.fonts) document.fonts.ready.then(iguala);
  addEventListener('resize', iguala);

  // ---------- janelas dos termos ----------
  $$('[data-doc]').forEach((b) => b.addEventListener('click', () => { const d = $(`#doc-${b.dataset.doc}`); if (d && d.showModal) d.showModal(); }));
  $$('dialog.doc').forEach((d) => {
    $('[data-fecha]', d).addEventListener('click', () => d.close());
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });

  // ---------- cookies ----------
  const ck = $('#cookies');
  const CK = 'camelia-cookies';
  const marcaCk = () => raiz.classList.toggle('ck', !ck.hidden);
  if (!guarda.ler(CK)) ck.hidden = false;
  marcaCk();
  $$('[data-ck]').forEach((b) => b.addEventListener('click', () => { guarda.por(CK, b.dataset.ck); ck.hidden = true; marcaCk(); }));
  $$('[data-cookies]').forEach((b) => b.addEventListener('click', () => { ck.hidden = false; marcaCk(); $('[data-ck]', ck).focus(); }));

  // ---------- formulário ----------
  const form = $('#form');
  const erro = $('#form-erro');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const nome = (f.get('nome') || '').trim();
    const whats = (f.get('whats') || '').replace(/\D/g, '');
    const falta = [];
    if (!nome) falta.push('seu nome');
    if (whats.length < 10) falta.push('um WhatsApp com DDD');
    if (!f.get('ok_lgpd')) falta.push('a autorização de contato');
    $$('.campo, .check', form).forEach((c) => c.classList.remove('erro'));
    if (falta.length) {
      if (!nome) form.nome.closest('.campo').classList.add('erro');
      if (whats.length < 10) form.whats.closest('.campo').classList.add('erro');
      if (!f.get('ok_lgpd')) form.ok_lgpd.closest('.check').classList.add('erro');
      erro.textContent = `Falta ${falta.join(', ').replace(/, ([^,]*)$/, ' e $1')}.`;
      erro.hidden = false;
      (form.querySelector('.erro input') || form.nome).focus();
      return;
    }
    erro.hidden = true;
    const d = diasLivres[+(f.get('dia') || 0)];
    const quando = d && f.get('hora') ? `${nomes[d.getDay()]}, ${dd(d.getDate())}/${dd(d.getMonth() + 1)}, às ${f.get('hora')}` : 'a combinar';
    const l = [
      `Olá! Quero agendar na ${D.nome}.`, '',
      `Nome: ${nome}`, `WhatsApp: ${f.get('whats')}`,
      `Tratamento: ${f.get('trat')}`, `Horário que eu gostaria: ${quando} (aguardo a confirmação)`, '',
      'Li a política de privacidade e autorizo o contato.',
    ];
    if (f.get('ok_news')) l.push('Aceito receber horários livres e novidades.');
    window.open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(l.join('\n'))}`, '_blank', 'noopener');
  });
})();
