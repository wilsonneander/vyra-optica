// Gold Íris, Camélia Estética: interações (olho da capa, provador, mapa do corpo e simulador, preços, antes e depois,
// agenda por profissional, avaliação online, avaliações, clube, vale-presente, loja e sacola, cookies e janelas).
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const dadosEl = $('#dados');
  const D = dadosEl ? JSON.parse(dadosEl.textContent) : {};
  const reais = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
  const reais2 = (v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const wa = (msg) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`;
  const ligado = (s) => !D.ligados || D.ligados.includes(s);
  const guarda = {
    ler(k, padrao) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento: segue sem lembrar */ } },
    apagar(k) { try { localStorage.removeItem(k); } catch { /* idem */ } },
  };
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (t) => { if (!toastEl) return; toastEl.textContent = t; toastEl.classList.add('ve'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('ve'), 2600); };
  const irPara = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' }); };
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const DIAS_C = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const hora = (h) => `${Math.floor(h)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;

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
      $$('[id]', c).forEach((x) => x.removeAttribute('id'));
      $$('input', c).forEach((x) => x.removeAttribute('name'));
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

  // ---------- topo ----------
  const topo = $('#topo');
  const menuBtn = $('.menu-btn');
  const menu = $('#menu');
  addEventListener('scroll', () => topo && topo.classList.toggle('rolou', scrollY > 10), { passive: true });
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const abre = menuBtn.getAttribute('aria-expanded') !== 'true';
      menuBtn.setAttribute('aria-expanded', String(abre));
      menu.classList.toggle('aberto', abre);
    });
    $$('a', menu).forEach((a) => a.addEventListener('click', () => { menuBtn.setAttribute('aria-expanded', 'false'); menu.classList.remove('aberto'); }));
  }
  // aberto agora / fechado, pelo horário da casa
  const agora = new Date();
  const abertoEl = $('[data-aberto]');
  if (abertoEl && D.abertura) {
    const h = agora.getHours() + agora.getMinutes() / 60;
    const hoje = D.abertura[agora.getDay()];
    if (hoje && h >= hoje[0] && h < hoje[1]) abertoEl.textContent = `Aberto agora, até as ${hora(hoje[1])}`;
    else {
      let d = 0, prox;
      do { d++; prox = D.abertura[(agora.getDay() + d) % 7]; } while (!prox && d < 7);
      if (hoje && h < hoje[0]) abertoEl.textContent = `Fechado. Abre hoje às ${hora(hoje[0])}`;
      else abertoEl.textContent = `Fechado. Abre ${d === 1 ? 'amanhã' : DIAS[(agora.getDay() + d) % 7]} às ${hora(prox[0])}`;
    }
    abertoEl.hidden = false;
  }
  $$('.horas tr').forEach((tr) => {
    const i = +tr.dataset.linha, d = agora.getDay();
    if ((i === 0 && d >= 1 && d <= 5) || (i === 1 && d === 6) || (i === 2 && d === 0)) tr.classList.add('hoje');
  });

  const etapas = $('.etapas');
  if (etapas && 'IntersectionObserver' in window) {
    new IntersectionObserver((es, ob) => es.forEach((e) => { if (e.isIntersecting) { etapas.style.setProperty('--linha-p', '100%'); ob.disconnect(); } }), { threshold: .6 }).observe(etapas);
  }

  // ---------- olho da capa: acompanha o cursor, pisca e troca o estilo fio a fio ----------
  const Dz = window.Desenho;
  const capaEl = $('[data-olho-capa]');
  if (capaEl && Dz) {
    const est = { estilo: 'natural', curva: 'C', sobr: ligado('sobrancelhas') ? 'arco' : 'antes', id: 'oc', rotulo: 'Desenho de um olho com extensão de cílios' };
    let olhar = [0, 0], alvo = [0, 0], piscando = false;
    const desenha = (abertura = 1, anima = false) => {
      capaEl.innerHTML = Dz.olho({ ...est, abertura, hibrido: est.estilo === 'boneca' });
      aplicaOlhar();
      if (anima && !reduz) {
        capaEl.classList.add('desenhando');
        const fios = $$('.cil path', capaEl);
        fios.forEach((p, i) => { p.style.animationDelay = `${i * 9}ms`; });
        setTimeout(() => { capaEl.classList.remove('desenhando'); fios.forEach((p) => { p.style.animationDelay = ''; }); }, fios.length * 9 + 600);
      }
    };
    const aplicaOlhar = () => { const g = $('.iris-g', capaEl); if (g) g.setAttribute('transform', `translate(${(olhar[0] * 34).toFixed(1)} ${(olhar[1] * 14).toFixed(1)})`); };
    desenha(1, true);
    addEventListener('pointermove', (e) => {
      const r = capaEl.getBoundingClientRect();
      const cx = r.left + r.width * 0.51, cy = r.top + r.height * 0.57;
      const dx = (e.clientX - cx) / (innerWidth * 0.5), dy = (e.clientY - cy) / (innerHeight * 0.5);
      alvo = [Math.max(-1, Math.min(1, dx)), Math.max(-1, Math.min(1, dy))];
    }, { passive: true });
    const segue = () => {
      olhar = [olhar[0] + (alvo[0] - olhar[0]) * 0.12, olhar[1] + (alvo[1] - olhar[1]) * 0.12];
      if (!piscando) aplicaOlhar();
      requestAnimationFrame(segue);
    };
    if (!reduz) requestAnimationFrame(segue);
    const pisca = () => {
      if (reduz || capaEl.classList.contains('desenhando') || document.hidden) return setTimeout(pisca, 3000);
      piscando = true;
      const quadros = [0.6, 0.2, 0, 0.25, 0.65, 1];
      quadros.forEach((a, i) => setTimeout(() => { desenha(a); if (i === quadros.length - 1) piscando = false; }, i * 38));
      setTimeout(pisca, 3200 + Math.random() * 3600);
    };
    setTimeout(pisca, 2600);
    $$('[data-capa-estilo]').forEach((b) => b.addEventListener('click', () => {
      $$('[data-capa-estilo]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      est.estilo = b.dataset.capaEstilo;
      est.curva = est.estilo === 'volume' || est.estilo === 'boneca' ? 'D' : 'C';
      desenha(1, true);
    }));
  }

  // ---------- provador do olhar ----------
  const provEl = $('[data-prov-olho]');
  const servPorId = Object.fromEntries((D.servicos || []).map((s) => [s.id, s]));
  let provEscolha = null;
  if (provEl && Dz) {
    const form = $('.provador');
    const P = D.provador;
    const ler = () => {
      const v = (n) => { const i = $(`[name="${n}"]:checked`, form); return i ? i.value : null; };
      const mm = $('[name="prov-mm"]', form);
      return {
        cilios: v('prov-cilios'), curva: v('prov-curva') || 'C', mm: mm ? +mm.value : 10,
        sobr: v('prov-sobr'), henna: !!$('[name="prov-henna"]', form)?.checked,
      };
    };
    const atualiza = () => {
      const e = ler();
      const mmEl = $('[data-prov-mm]');
      if (mmEl) mmEl.textContent = `${e.mm} mm`;
      provEl.innerHTML = Dz.olho({
        estilo: e.cilios || 'antes', curva: e.curva, comp: 0.62 + e.mm * 0.038, hibrido: e.cilios === 'boneca',
        sobr: e.sobr || 'antes', henna: e.henna && e.sobr !== 'lamination', id: 'op', rotulo: 'Desenho do olhar escolhido no provador',
      });
      const c = P.cilios.find((x) => x.id === e.cilios);
      const sb = P.sobrancelhas.find((x) => x.id === e.sobr);
      const txt = $('[data-prov-texto]');
      if (txt && c) txt.textContent = c.texto;
      const servs = [];
      if (c) servs.push(servPorId[c.servico]);
      if (sb) servs.push(servPorId[e.henna && sb.id !== 'lamination' ? 'design-henna' : sb.servico]);
      const lista = servs.filter(Boolean);
      provEscolha = { servicos: lista, curva: e.curva, mm: e.mm, estilo: c?.nome, sobr: sb?.nome };
      const total = lista.reduce((t, s) => t + (s.preco ?? s.de ?? 0), 0);
      const min = lista.reduce((t, s) => t + s.min, 0);
      const manut = lista.find((s) => s.manut);
      const extra = c && c.id !== 'lifting' ? `Curvatura ${e.curva}, fios de ${e.mm} mm. ` : '';
      $('[data-prov-res]').innerHTML = `<div class="prov-res-linha"><h3>${lista.map((s) => s.nome).join(' e ')}</h3><span class="valor">${reais(total)}</span></div>
        <p class="prov-res-meta">${extra}Cerca de ${min >= 60 ? `${Math.floor(min / 60)}h${min % 60 ? String(min % 60).padStart(2, '0') : ''}` : `${min} min`} de atendimento.${manut ? ` Manutenção ${reais(manut.manut[0])}, ${manut.manut[1]}.` : ''}</p>`;
    };
    form.addEventListener('input', atualiza);
    atualiza();
    $('[data-prov-agendar]')?.addEventListener('click', () => {
      if (!provEscolha?.servicos.length) return;
      const [primeiro, segundo] = provEscolha.servicos;
      const obs = [provEscolha.estilo && `Estilo: ${provEscolha.estilo}, curvatura ${provEscolha.curva}, ${provEscolha.mm} mm`, segundo && `Também quero: ${segundo.nome}`].filter(Boolean).join('. ');
      Agenda?.preseleciona({ servico: primeiro.id, obs });
    });
  }

  // ---------- mapa do corpo e simulador de pacotes ----------
  const corpo = $('#corpo');
  const Sim = {};
  if (corpo && D.areas) {
    const areaPorId = Object.fromEntries(D.areas.map((a) => [a.id, a]));
    const st = { tecnica: ligado('laser') ? 'laser' : 'cera', vista: 'frente', sel: new Set(), sessoes: 10 };
    const silh = $('[data-silhueta]');
    const rot = document.createElement('span');
    rot.className = 'ponto-rot';
    silh.appendChild(rot);
    const res = $('[data-sim-res]');
    const precoArea = (a) => (st.tecnica === 'laser' ? a.laser : a.cera);
    const desenhaChips = () => {
      $$('[data-area-preco]').forEach((s) => { const a = areaPorId[s.dataset.areaPreco]; s.textContent = `${reais(precoArea(a))}${st.tecnica === 'laser' ? ' a sessão' : ''}`; });
      $$('[data-so-laser]').forEach((el) => { el.hidden = st.tecnica !== 'laser'; });
    };
    const marca = () => {
      $$('.ponto', silh).forEach((p) => { p.setAttribute('aria-pressed', String(st.sel.has(p.dataset.area))); p.hidden = p.dataset.vista !== st.vista; });
      $$('[name="area"]', corpo).forEach((i) => { i.checked = st.sel.has(i.value); });
      $('.sil-costas', silh)?.toggleAttribute('hidden', st.vista !== 'costas');
    };
    const calc = () => {
      const areas = [...st.sel].map((id) => areaPorId[id]);
      if (!areas.length) { res.innerHTML = '<p class="sim-vazio">Toque numa área da silhueta ou da lista para começar.</p>'; return null; }
      const nomes = areas.map((a) => a.nome);
      if (st.tecnica === 'cera') {
        const total = areas.reduce((t, a) => t + a.cera, 0);
        const doClube = ['buco', 'axilas', 'virilha', 'meia-perna'];
        const clube = (D.clube || []).find((p) => p.id === 'pele');
        const cabe = clube && areas.every((a) => doClube.includes(a.id)) && total >= clube.mensal * 0.75;
        res.innerHTML = `<div class="sim-total"><span>Por visita, ${nomes.length} ${nomes.length > 1 ? 'áreas' : 'área'}</span><b>${reais(total)}</b></div>
          <dl class="sim-linhas"><div><dt>Tempo</dt><dd>cerca de ${Math.max(20, areas.length * 15)} min</dd></div><div><dt>Intervalo</dt><dd>a cada 25 a 35 dias</dd></div><div><dt>Pagamento</dt><dd>em até 3x</dd></div></dl>
          ${cabe ? `<p class="mini">No clube Pele lisa, buço, axilas, virilha e meia perna saem por ${reais(clube.mensal)} por mês. <a href="#clube">Ver o clube</a></p>` : ''}
          ${ligado('laser') ? `<div class="compara"><p>Em 2 anos, com cera a cada 30 dias, estas áreas somam cerca de <b>${reais(total * 24)}</b>. Com laser, o pacote de 10 sessões sairia ${reais(areas.reduce((t, a) => t + a.laser, 0) * 10 * 0.8 * (areas.length >= D.combo.minimo ? 1 - D.combo.desconto : 1))}.</p></div>` : ''}`;
        return { total, nomes };
      }
      const base = areas.reduce((t, a) => t + a.laser, 0);
      const n = st.sessoes;
      const pac = (D.pacotes.find((p) => p[0] === n) || [n, 0])[1];
      const combo = n > 1 && areas.length >= D.combo.minimo ? D.combo.desconto : 0;
      const total = base * n * (1 - pac) * (1 - combo);
      const cheio = base * n;
      const parc = n > 1 ? D.parcelas : 3;
      const cera2 = areas.reduce((t, a) => t + a.cera, 0) * 24;
      const datas = [];
      for (let i = 0; i < n; i++) { const d = new Date(); d.setDate(d.getDate() + 7 + i * D.intervalo); datas.push(`${MESES[d.getMonth()]}${d.getFullYear() !== agora.getFullYear() ? ` ${String(d.getFullYear()).slice(2)}` : ''}`); }
      const maxB = Math.max(cera2, total);
      res.innerHTML = `<div class="sim-total"><span>${n === 1 ? 'Sessão avulsa' : `Pacote de ${n} sessões`}, ${nomes.length} ${nomes.length > 1 ? 'áreas' : 'área'}</span><b>${reais(total)}</b></div>
        <dl class="sim-linhas"><div><dt>Parcelas</dt><dd>${parc}x de ${reais2(total / parc)}</dd></div><div><dt>Por sessão</dt><dd>${reais(total / n)}</dd></div><div><dt>Economia</dt><dd class="eco">${cheio - total > 0 ? reais(cheio - total) : 'sem desconto'}</dd></div></dl>
        ${n > 1 ? `<ol class="linha-tempo" aria-label="Previsão das sessões, uma a cada ${D.intervalo} dias">${datas.map((d) => `<li>${d}</li>`).join('')}</ol>` : ''}
        ${combo ? `<p class="mini">Com ${areas.length} áreas, o pacote ganha mais ${Math.round(combo * 100)}% de desconto.</p>` : ''}
        ${ligado('cera') ? `<div class="compara"><div class="barra"><span>Cera, 2 anos</span><i style="--p:${(cera2 / maxB * 100).toFixed(1)}%"></i><b>${reais(cera2)}</b></div><div class="barra b-laser"><span>Laser, pacote</span><i style="--p:${(total / maxB * 100).toFixed(1)}%"></i><b>${reais(total)}</b></div><p>Estimativa com cera a cada 30 dias. O laser pode precisar de manutenção depois do pacote.</p></div>` : ''}`;
      return { total, nomes, n };
    };
    const atualiza = () => { desenhaChips(); marca(); Sim.ultimo = calc(); atualizaBotoes(); };
    const atualizaBotoes = () => {
      const w = $('[data-sim-whats]');
      const u = Sim.ultimo;
      if (w) w.href = wa(u ? `Olá! Quero um orçamento de depilação ${st.tecnica === 'laser' ? `a laser (${u.n === 1 ? 'sessão avulsa' : `pacote de ${u.n} sessões`})` : 'com cera'}: ${u.nomes.join(', ')}. O simulador do site deu ${reais(u.total)}.` : `Olá! Quero um orçamento de depilação na ${D.nome}.`);
    };
    $$('.ponto', silh).forEach((p) => {
      p.addEventListener('click', () => { st.sel.has(p.dataset.area) ? st.sel.delete(p.dataset.area) : st.sel.add(p.dataset.area); atualiza(); });
      const mostra = () => { rot.textContent = areaPorId[p.dataset.area].nome; rot.style.left = p.style.left; rot.style.top = p.style.top; rot.classList.add('ve'); };
      p.addEventListener('pointerenter', mostra); p.addEventListener('focus', mostra);
      p.addEventListener('pointerleave', () => rot.classList.remove('ve')); p.addEventListener('blur', () => rot.classList.remove('ve'));
    });
    $$('[name="area"]', corpo).forEach((i) => i.addEventListener('change', () => {
      i.checked ? st.sel.add(i.value) : st.sel.delete(i.value);
      const a = areaPorId[i.value];
      if (i.checked && a.vista !== st.vista) { st.vista = a.vista; $$('[data-vista-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.vistaBtn === st.vista))); }
      atualiza();
    }));
    $$('[data-vista-btn]').forEach((b) => b.addEventListener('click', () => { st.vista = b.dataset.vistaBtn; $$('[data-vista-btn]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); marca(); }));
    $$('[data-tecnica]').forEach((b) => b.addEventListener('click', () => { st.tecnica = b.dataset.tecnica; $$('[data-tecnica]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); atualiza(); igualaDepois(); }));
    $$('[name="sessoes"]', corpo).forEach((i) => i.addEventListener('change', () => { st.sessoes = +i.value; atualiza(); }));
    $('[data-sim-agendar]')?.addEventListener('click', () => {
      const servico = st.tecnica === 'laser' ? 'laser-areas' : 'cera-areas';
      Agenda?.preseleciona({ servico, areas: [...st.sel], obs: st.tecnica === 'laser' && Sim.ultimo ? `Simulação: pacote de ${Sim.ultimo.n} sessões, ${reais(Sim.ultimo.total)}` : '' });
    });
    // começa com axilas e meia perna marcadas, para o simulador já mostrar um valor
    ['axilas', 'meia-perna'].forEach((a) => areaPorId[a] && st.sel.add(a));
    atualiza();
  }

  // ---------- abas (preços e antes e depois) ----------
  const ativaAba = (grupo, botao) => {
    const botoes = $$('[role="tab"]', grupo);
    botoes.forEach((b) => { const sim = b === botao; b.setAttribute('aria-selected', String(sim)); b.tabIndex = sim ? 0 : -1; });
    if (botao.dataset.aba) $$('.aba-painel').forEach((p) => { p.hidden = p.id !== `painel-${botao.dataset.aba}`; });
    if (botao.dataset.ad) $$('[data-ad-painel]').forEach((p) => { p.hidden = p.dataset.adPainel !== botao.dataset.ad; });
    igualaDepois();
  };
  $$('[role="tablist"]').forEach((g) => {
    g.addEventListener('click', (e) => { const b = e.target.closest('[role="tab"]'); if (b) ativaAba(g, b); });
    g.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      const bs = $$('[role="tab"]', g), i = bs.indexOf(document.activeElement);
      const j = e.key === 'Home' ? 0 : e.key === 'End' ? bs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length;
      bs[j].focus(); ativaAba(g, bs[j]); e.preventDefault();
    });
  });
  $$('[data-aba-ir]').forEach((a) => a.addEventListener('click', (e) => {
    const b = $(`[data-aba="${a.dataset.abaIr}"]`);
    if (!b) return;
    e.preventDefault();
    ativaAba(b.closest('[role="tablist"]'), b);
    irPara('precos');
  }));
  // painéis de serviço: abre o painel sob o cursor
  $$('.painel').forEach((p) => p.addEventListener('pointerenter', () => $$('.painel').forEach((x) => x.classList.toggle('aberto', x === p))));

  // ---------- antes e depois ----------
  $$('.ad-palco').forEach((palco) => {
    const r = $('.ad-range', palco);
    const poe = (v) => palco.style.setProperty('--corte', `${v}%`);
    r.addEventListener('input', () => poe(r.value));
    if ('IntersectionObserver' in window && !reduz) {
      new IntersectionObserver((es, ob) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        ob.disconnect();
        const t0 = performance.now();
        const passo = (t) => {
          const k = Math.min(1, (t - t0) / 1800);
          const v = 50 + Math.sin(k * Math.PI * 2) * 28 * (1 - k);
          poe(v.toFixed(1)); r.value = v;
          if (k < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      }), { threshold: .5 }).observe(palco);
    }
  });

  // ---------- agenda por profissional ----------
  const agForm = $('[data-ag]');
  const Agenda = agForm ? (() => {
    const PASSOS = ['servico', 'prof', 'horario', 'dados', 'fim'];
    const st = { passo: 'servico', servico: null, areas: [], prof: null, profFixa: null, dia: null, hora: null, profHora: null, obs: '', inicioDias: 0 };
    const equipe = D.equipe;
    const reservas = () => guarda.ler('camelia-reservas', []);
    const erro = $('[data-ag-erro]');
    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const deIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
    const servico = () => servPorId[st.servico];
    const duracao = () => {
      const s = servico();
      if (!s) return 30;
      if (s.porArea === 'cera') return Math.max(30, Math.ceil(st.areas.length * 15 / 30) * 30);
      if (s.porArea === 'laser') return Math.max(30, Math.ceil((20 + st.areas.length * 10) / 30) * 30);
      return Math.ceil(s.min / 30) * 30;
    };
    // horários livres: grade de 30 minutos no expediente da profissional, menos os ocupados (simulados) e as reservas
    // FNV-1a seguido de uma mistura final (mulberry32), para os ocupados se espalharem bem pelos dias
    const hash = (t) => {
      let h = 2166136261;
      for (const c of t) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
      h = Math.imul(h ^ (h >>> 15), h | 1); h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
      return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
    };
    const livres = (p, data) => {
      const exp = p.agenda[data.getDay()];
      if (!exp) return [];
      const dur = duracao() / 60, out = [];
      const ehHoje = iso(data) === iso(agora);
      const minimo = agora.getHours() + agora.getMinutes() / 60 + 1.5;
      const res = reservas().filter((r) => r.prof === p.id && r.dia === iso(data));
      for (let h = exp[0]; h + dur <= exp[1]; h += 0.5) {
        if (ehHoje && h < minimo) continue;
        let ocupado = false;
        for (let k = h; k < h + dur; k += 0.5) {
          if (hash(`${p.id}|${iso(data)}|${k}`) < 0.24) ocupado = true;
          if (res.some((r) => k >= r.hora && k < r.hora + r.dur)) ocupado = true;
        }
        out.push({ h, livre: !ocupado });
      }
      return out;
    };
    const candidatas = () => {
      const s = servico();
      const fazem = equipe.filter((p) => s && p.faz.includes(s.cat));
      return st.prof ? fazem.filter((p) => p.id === st.prof) : fazem;
    };
    const horasDoDia = (data) => {
      const mapa = new Map();
      for (const p of candidatas()) for (const x of livres(p, data)) {
        const atual = mapa.get(x.h);
        if (!atual || (!atual.livre && x.livre)) mapa.set(x.h, { h: x.h, livre: x.livre, prof: x.livre ? p.id : null });
      }
      return [...mapa.values()].sort((a, b) => a.h - b.h);
    };
    const proximo = (p) => {
      for (let i = 0; i < 21; i++) {
        const d = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + i);
        const l = livres(p, d).find((x) => x.livre);
        if (l) return `${i === 0 ? 'hoje' : i === 1 ? 'amanhã' : `${DIAS_C[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}`}, ${hora(l.h)}`;
      }
      return 'sem horário nas próximas 3 semanas';
    };

    // telas
    const mostra = (passo) => {
      st.passo = passo;
      $$('[data-passo]', agForm).forEach((el) => { el.hidden = el.dataset.passo !== passo; });
      const i = PASSOS.indexOf(passo);
      $$('[data-passo-rot]', agForm).forEach((li, k) => { li.classList.toggle('feito', k < i); if (k === i) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
      $('[data-ag-volta]').hidden = i === 0 || passo === 'fim';
      $('[data-ag-segue]').hidden = passo === 'fim';
      $('[data-ag-segue]').innerHTML = passo === 'dados' ? 'Reservar horário' : `Continuar<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6.5 18.5 12 13 17.5"/></svg>`;
      erro.textContent = '';
      if (passo === 'prof') desenhaProfs();
      if (passo === 'horario') desenhaDias();
      resumo();
      igualaDepois();
    };
    const desenhaProfs = () => {
      const s = servico();
      const fazem = equipe.filter((p) => p.faz.includes(s.cat));
      const box = $('[data-ag-profs]');
      box.innerHTML = fazem.map((p) => `<label class="ag-prof"><input type="radio" name="prof" value="${p.id}"${st.prof === p.id ? ' checked' : ''}><span><img src="assets/img/${p.foto}.webp" alt=""><b>${p.nome}</b><small>${p.cargo}</small><em>Próximo horário: ${proximo(p)}</em></span></label>`).join('')
        + (fazem.length > 1 ? `<label class="ag-prof"><input type="radio" name="prof" value=""${st.prof ? '' : ' checked'}><span><span class="sem-foto" aria-hidden="true">${$('.logo .flor')?.outerHTML || ''}</span><b>Sem preferência</b><small>Mostra os horários de todas</small></span></label>` : '');
      if (fazem.length === 1) st.prof = fazem[0].id;
      $$('[name="prof"]', box).forEach((i) => i.addEventListener('change', () => { st.prof = i.value || null; st.hora = null; resumo(); }));
    };
    const desenhaDias = () => {
      const box = $('[data-ag-dias]');
      const dias = [];
      for (let i = 0; i < 21; i++) {
        const d = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + i);
        const hs = horasDoDia(d);
        dias.push({ d, n: hs.filter((x) => x.livre).length, aberto: hs.length > 0, hoje: i === 0 && candidatas().some((p) => p.agenda[d.getDay()]) });
      }
      if (!st.dia || !dias.find((x) => iso(x.d) === st.dia && x.n)) st.dia = iso((dias.find((x) => x.n) || dias[0]).d);
      box.innerHTML = dias.map(({ d, n, aberto, hoje }) => `<button type="button" class="ag-dia" role="option" data-dia="${iso(d)}" aria-selected="${iso(d) === st.dia}"${n ? '' : ' disabled'} aria-label="${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}, ${n ? `${n} horários livres` : 'sem horários'}"><small>${iso(d) === iso(agora) ? 'hoje' : DIAS_C[d.getDay()]}</small><b>${d.getDate()}</b><i>${n ? `${n} ${n > 1 ? 'livres' : 'livre'}` : aberto ? 'lotado' : hoje ? 'encerrado' : 'fechado'}</i></button>`).join('');
      $$('.ag-dia', box).forEach((b) => b.addEventListener('click', () => { st.dia = b.dataset.dia; st.hora = null; $$('.ag-dia', box).forEach((x) => x.setAttribute('aria-selected', String(x === b))); desenhaHoras(); resumo(); }));
      $(`[data-dia="${st.dia}"]`, box)?.scrollIntoView({ block: 'nearest', inline: 'center' });
      desenhaHoras();
    };
    const desenhaHoras = () => {
      const box = $('[data-ag-horas]');
      const hs = horasDoDia(deIso(st.dia));
      if (!hs.some((x) => x.livre)) { box.innerHTML = '<p class="ag-vazio">Sem horários livres neste dia. Escolha outro dia acima.</p>'; return; }
      const grupos = [['Manhã', (h) => h < 12], ['Tarde', (h) => h >= 12 && h < 18], ['Noite', (h) => h >= 18]];
      box.innerHTML = grupos.map(([t, f]) => { const g = hs.filter((x) => f(x.h)); return g.length ? `<h4>${t}</h4><div class="horas-grade" data-iguais>${g.map((x) => `<button type="button" data-hora="${x.h}" data-prof-h="${x.prof || ''}"${x.livre ? '' : ' disabled'} aria-pressed="${st.hora === x.h}">${hora(x.h)}</button>`).join('')}</div>` : ''; }).join('');
      $$('[data-hora]', box).forEach((b) => b.addEventListener('click', () => {
        st.hora = +b.dataset.hora; st.profHora = b.dataset.profH;
        $$('[data-hora]', box).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        resumo(); erro.textContent = '';
      }));
      iguala();
    };
    const nomeProf = (id) => equipe.find((p) => p.id === id)?.nome;
    const areasNomes = () => st.areas.map((id) => D.areas.find((a) => a.id === id)?.nome).filter(Boolean);
    const valorTxt = () => {
      const s = servico();
      if (!s) return '';
      if (s.gratis) return s.gratis;
      if (s.porArea) {
        const t = st.areas.reduce((v, id) => v + (D.areas.find((a) => a.id === id)?.[s.porArea] || 0), 0);
        return t ? `${reais(t)}${s.porArea === 'laser' ? ' por sessão, sem desconto de pacote' : ''}` : 'conforme as áreas';
      }
      return s.de ? `a partir de ${reais(s.de)}` : reais(s.preco);
    };
    const dataTxt = () => { if (!st.dia) return ''; const d = deIso(st.dia); return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`; };
    const resumo = () => {
      const s = servico();
      const linhas = [['Serviço', s ? s.nome : 'Escolha ao lado']];
      if (s?.porArea && st.areas.length) linhas.push(['Áreas', areasNomes().join(', ')]);
      if (s) linhas.push(['Valor', valorTxt()]);
      if (st.prof || st.profFixa || st.profHora) linhas.push(['Profissional', nomeProf(st.prof || st.profHora || st.profFixa) || 'Sem preferência']);
      if (st.dia && st.hora != null) linhas.push(['Quando', `${dataTxt()}, ${hora(st.hora)}`]);
      if (s) linhas.push(['Duração', `cerca de ${duracao()} min`]);
      $('[data-ag-resumo]').innerHTML = linhas.map(([t, v]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join('');
    };
    // serviço e áreas
    const mostraAreas = () => {
      const s = servico();
      const box = $('[data-ag-areas]');
      box.hidden = !s?.porArea;
      $$('[name="ag-area"]', box).forEach((i) => { i.checked = st.areas.includes(i.value); });
      igualaDepois();
    };
    const filtraPorProf = () => {
      const p = equipe.find((x) => x.id === st.profFixa);
      $$('[name="servico"]', agForm).forEach((i) => {
        const s = servPorId[i.value];
        const ok = !p || p.faz.includes(s.cat);
        i.disabled = !ok;
        i.closest('.ag-serv').style.opacity = ok ? '' : '.4';
      });
    };
    $$('[name="servico"]', agForm).forEach((i) => i.addEventListener('change', () => {
      st.servico = i.value;
      if (st.prof && !equipe.find((p) => p.id === st.prof)?.faz.includes(servico().cat)) st.prof = null;
      st.hora = null; mostraAreas(); resumo();
    }));
    $$('[name="ag-area"]', agForm).forEach((i) => i.addEventListener('change', () => {
      st.areas = $$('[name="ag-area"]:checked', agForm).map((x) => x.value); resumo();
    }));
    // navegação
    const valida = () => {
      if (st.passo === 'servico') {
        if (!st.servico) return 'Escolha um serviço para continuar.';
        if (servico().porArea && !st.areas.length) return 'Marque pelo menos uma área.';
      }
      if (st.passo === 'horario' && st.hora == null) return 'Escolha um horário livre.';
      if (st.passo === 'dados') {
        const f = agForm;
        if (!f.nome.value.trim()) return 'Escreva o seu nome.';
        if (f.fone.value.replace(/\D/g, '').length < 10) return 'Confira o WhatsApp, com DDD.';
        if (f.email.value && !/^\S+@\S+\.\S+$/.test(f.email.value)) return 'Confira o e-mail.';
        if (!f.ok_lgpd.checked) return 'Para reservar, autorize o uso dos dados conforme a Política de privacidade.';
      }
      return '';
    };
    $('[data-ag-segue]').addEventListener('click', () => {
      const msg = valida();
      if (msg) { erro.textContent = msg; return; }
      const i = PASSOS.indexOf(st.passo);
      if (st.passo === 'dados') return conclui();
      mostra(PASSOS[i + 1]);
      agForm.scrollIntoView({ block: 'nearest', behavior: reduz ? 'auto' : 'smooth' });
    });
    $('[data-ag-volta]').addEventListener('click', () => mostra(PASSOS[Math.max(0, PASSOS.indexOf(st.passo) - 1)]));
    $$('[data-rola]', agForm).forEach((b) => b.addEventListener('click', () => $('[data-ag-dias]').scrollBy({ left: +b.dataset.rola * 260, behavior: 'smooth' })));
    const conclui = () => {
      const f = agForm;
      const prof = st.prof || st.profHora;
      const dur = duracao();
      const r = reservas();
      r.push({ prof, dia: st.dia, hora: st.hora, dur: dur / 60 });
      guarda.gravar('camelia-reservas', r.slice(-20));
      const s = servico();
      const linhas = [
        ['Serviço', s.nome], st.areas.length && s.porArea ? ['Áreas', areasNomes().join(', ')] : null, ['Profissional', nomeProf(prof)],
        ['Quando', `${dataTxt()}, ${hora(st.hora)}`], ['Valor', valorTxt()], ['Nome', f.nome.value.trim()],
      ].filter(Boolean);
      $('[data-ag-ticket]').innerHTML = linhas.map(([t, v]) => `<div><small>${t}</small><b>${v}</b></div>`).join('');
      const obs = [st.obs, f.obs.value.trim()].filter(Boolean).join('. ');
      $('[data-ag-whats]').href = wa(`Olá! Fiz uma reserva pela agenda do site da ${D.nome}.\n${linhas.map(([t, v]) => `${t}: ${v}`).join('\n')}\nWhatsApp: ${f.fone.value}${f.email.value ? `\nE-mail: ${f.email.value}` : ''}${obs ? `\nObservação: ${obs}` : ''}${f.ok_novidades.checked ? '\nAceito receber novidades.' : ''}`);
      const d = deIso(st.dia);
      const ini = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(st.hora), (st.hora % 1) * 60);
      const fim = new Date(ini.getTime() + dur * 60000);
      const ics = (x) => `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, '0')}${String(x.getDate()).padStart(2, '0')}T${String(x.getHours()).padStart(2, '0')}${String(x.getMinutes()).padStart(2, '0')}00`;
      $('[data-ag-ics]').href = `data:text/calendar;charset=utf-8,${encodeURIComponent(['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Camelia//Agenda//PT', 'BEGIN:VEVENT', `UID:${Date.now()}@camelia`, `DTSTAMP:${ics(new Date())}`, `DTSTART:${ics(ini)}`, `DTEND:${ics(fim)}`, `SUMMARY:${s.nome}, ${D.nome}`, `LOCATION:${D.endereco}`, 'DESCRIPTION:Pedido de horário. Aguarde a confirmação da clínica pelo WhatsApp.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n'))}`;
      mostra('fim');
    };
    $('[data-ag-novo]').addEventListener('click', () => {
      Object.assign(st, { servico: null, areas: [], prof: null, profFixa: null, dia: null, hora: null, profHora: null, obs: '' });
      agForm.reset(); filtraPorProf(); mostraAreas(); mostra('servico');
    });
    // atalhos de outras seções
    const preseleciona = ({ servico: sid, areas = [], prof = null, obs = '' }) => {
      if (sid && servPorId[sid]) {
        st.servico = sid;
        const i = $(`[name="servico"][value="${sid}"]`, agForm);
        if (i) { i.disabled = false; i.checked = true; }
      }
      if (areas.length) st.areas = areas;
      if (prof) { st.prof = prof; st.profFixa = prof; } else st.profFixa = null;
      st.obs = obs; st.hora = null;
      filtraPorProf(); mostraAreas();
      const pronto = st.servico && (!servico().porArea || st.areas.length);
      mostra(pronto ? (prof ? 'horario' : 'prof') : 'servico');
      irPara('agenda');
      if (pronto) toast(`${servico().nome}: escolha ${prof ? 'o horário' : 'a profissional'}`);
    };
    $$('[data-agendar]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); preseleciona({ servico: b.dataset.agendar }); }));
    $$('[data-agenda-prof]').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      const p = equipe.find((x) => x.id === b.dataset.agendaProf);
      st.profFixa = p.id; st.prof = p.id;
      if (st.servico && !p.faz.includes(servico().cat)) { st.servico = null; $$('[name="servico"]', agForm).forEach((i) => { i.checked = false; }); }
      filtraPorProf(); mostraAreas(); mostra('servico'); irPara('agenda');
      toast(`Mostrando os serviços da ${p.nome.split(' ')[0]}`);
    }));
    mostra('servico');
    return { preseleciona };
  })() : null;

  // ---------- avaliação online (anamnese) ----------
  const aval = $('[data-aval]');
  if (aval && D.anamnese) {
    const st = { segs: [], resp: {}, fila: [], i: 0 };
    const tela = (t) => $$('[data-aval-tela]', aval).forEach((el) => { el.hidden = el.dataset.avalTela !== t; });
    const ok = $('[data-aval-ok]');
    const comecar = $('[data-aval-comecar]');
    ok.addEventListener('change', () => { comecar.disabled = !ok.checked; });
    comecar.addEventListener('click', () => { if (ok.checked) { tela('servicos'); igualaDepois(); } });
    const segOk = $('[data-aval-seg-ok]');
    $$('[name="aval-seg"]', aval).forEach((i) => i.addEventListener('change', () => { segOk.disabled = !$$('[name="aval-seg"]:checked', aval).length; }));
    segOk.addEventListener('click', () => {
      st.segs = $$('[name="aval-seg"]:checked', aval).map((i) => i.value);
      st.fila = D.anamnese.filter((q) => q.seg.some((s) => st.segs.includes(s)));
      st.i = 0;
      st.fila.length ? pergunta() : resultado();
    });
    const pergunta = () => {
      tela('pergunta');
      const q = st.fila[st.i];
      $('[data-aval-barra]').style.width = `${(st.i / st.fila.length) * 100}%`;
      const opcoes = q.sn ? [['sim', 'Sim'], ['nao', 'Não']] : q.opcoes;
      const tons = !!q.opcoes?.[0]?.[2];
      $('[data-aval-pergunta]').innerHTML = `<div class="aval-q"><p class="mini">Pergunta ${st.i + 1} de ${st.fila.length}</p><h4>${q.pergunta}</h4>${q.ajuda ? `<p>${q.ajuda}</p>` : ''}
        <div class="aval-resps${tons ? ' aval-tons' : ''}" data-iguais>${opcoes.map(([v, t, cor]) => `<button type="button" data-v="${v}" aria-pressed="${st.resp[q.id] === v}">${cor ? `<i style="--tom:${cor}"></i>` : ''}<span>${t}</span></button>`).join('')}</div></div>`;
      $$('[data-v]', aval).forEach((b) => b.addEventListener('click', () => {
        st.resp[q.id] = b.dataset.v;
        $$('[data-v]', aval).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        setTimeout(() => { st.i++; st.i < st.fila.length ? pergunta() : resultado(); }, reduz ? 0 : 260);
      }));
      iguala();
      $('[data-v]', aval)?.focus({ preventScroll: true });
    };
    $('[data-aval-volta]').addEventListener('click', () => { if (st.i > 0) { st.i--; pergunta(); } else tela('servicos'); });
    const PESO = { ok: 0, atencao: 1, adiar: 2 };
    const ROT = { ok: 'Pode agendar', atencao: 'Agende com avaliação presencial', adiar: 'Melhor esperar' };
    let resumoTxt = '';
    const resultado = () => {
      tela('resultado');
      const porSeg = Object.fromEntries(st.segs.map((s) => [s, { status: 'ok', motivos: [] }]));
      for (const q of st.fila) {
        const r = q.regras?.[st.resp[q.id]];
        if (!r) continue;
        for (const [seg, [status, motivo]] of Object.entries(r)) {
          if (!porSeg[seg]) continue;
          if (PESO[status] > PESO[porSeg[seg].status]) porSeg[seg].status = status;
          porSeg[seg].motivos.push(motivo);
        }
      }
      const nomes = D.segNomes;
      $('[data-aval-res]').innerHTML = st.segs.map((s) => {
        const x = porSeg[s];
        const padrao = s === 'laser' ? 'Primeira sessão sempre com teste de mecha, sem custo.' : s === 'cilios' || s === 'sobrancelhas' ? 'Na primeira vez, fazemos o teste de alergia 48 horas antes.' : 'Nada nas suas respostas impede o atendimento.';
        return `<div class="aval-item ${x.status}"><i aria-hidden="true"></i><div><small>${nomes[s]}</small><b>${ROT[x.status]}</b><p>${x.motivos.length ? x.motivos.join(' ') : padrao}</p></div></div>`;
      }).join('');
      const fmt = (q) => { const v = st.resp[q.id]; return `${q.pergunta} ${q.sn ? (v === 'sim' ? 'Sim' : 'Não') : (q.opcoes.find((o) => o[0] === v) || [])[1] || ''}`; };
      resumoTxt = `Olá! Fiz a avaliação online da ${D.nome} e autorizei o uso destas informações de saúde para a avaliação.\nServiços: ${st.segs.map((s) => nomes[s]).join(', ')}\n${st.fila.map(fmt).join('\n')}\nResultado: ${st.segs.map((s) => `${nomes[s]}: ${ROT[porSeg[s].status].toLowerCase()}`).join('; ')}`;
      $('[data-aval-enviar]').href = wa(resumoTxt);
      $('[data-aval-barra]').style.width = '100%';
      igualaDepois();
      st.porSeg = porSeg;
    };
    $('[data-aval-agendar]').addEventListener('click', (e) => {
      if (!Agenda) return;
      e.preventDefault();
      const seg = st.segs.find((s) => st.porSeg?.[s]?.status !== 'adiar') || st.segs[0];
      const mapa = { laser: 'avaliacao-laser', cera: 'cera-areas', cilios: 'fio-a-fio', sobrancelhas: 'design' };
      Agenda.preseleciona({ servico: mapa[seg], obs: 'Fiz a avaliação online' });
    });
    $('[data-aval-apagar]').addEventListener('click', () => {
      st.resp = {}; st.segs = []; st.fila = []; resumoTxt = '';
      $$('[name="aval-seg"]', aval).forEach((i) => { i.checked = false; });
      ok.checked = false; comecar.disabled = true; segOk.disabled = true;
      $('[data-aval-enviar]').href = '#';
      tela('inicio');
      toast('Respostas apagadas deste navegador');
    });
  }

  // ---------- avaliações do Google ----------
  const cartoesAv = $('[data-cartoes-av]');
  if (cartoesAv) {
    $$('[data-filtro-av]').forEach((b) => b.addEventListener('click', () => {
      $$('[data-filtro-av]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      $$('.av', cartoesAv).forEach((c) => { c.hidden = b.dataset.filtroAv !== 'todas' && c.dataset.segAv !== b.dataset.filtroAv; });
      cartoesAv.scrollTo({ left: 0 });
    }));
    $$('[data-rola-av]').forEach((b) => b.addEventListener('click', () => cartoesAv.scrollBy({ left: +b.dataset.rolaAv * (cartoesAv.clientWidth * 0.8), behavior: reduz ? 'auto' : 'smooth' })));
  }

  // ---------- clube ----------
  let periodo = 'mensal';
  const assinar = () => $$('[data-assinar]').forEach((a) => {
    const p = (D.clube || []).find((x) => x.id === a.dataset.assinar);
    if (p) a.href = wa(`Olá! Quero assinar o plano ${p.nome} do Clube Íris (${periodo === 'mensal' ? `mensal, ${reais(p.mensal)} por mês` : `anual, ${reais(p.anual)} por mês com fidelidade de 12 meses`}).`);
  });
  $$('[data-periodo]').forEach((b) => b.addEventListener('click', () => {
    periodo = b.dataset.periodo;
    $$('[data-periodo]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$('[data-plano-valor]').forEach((v) => {
      v.style.opacity = 0;
      setTimeout(() => { v.textContent = reais(+v.dataset[periodo]); v.style.opacity = 1; }, 180);
    });
    assinar();
  }));
  assinar();

  // ---------- vale-presente ----------
  const vale = $('[data-vale]');
  if (vale) {
    const cartao = $('[data-cartao-vale]');
    const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const codigo = `CML-${Array.from({ length: 4 }, () => letras[Math.floor(Math.random() * letras.length)]).join('')}`;
    const validade = new Date(); validade.setMonth(validade.getMonth() + 6);
    $('[data-cv-codigo]').textContent = codigo;
    $('[data-cv-validade]').textContent = `Válido até ${String(validade.getDate()).padStart(2, '0')}/${String(validade.getMonth() + 1).padStart(2, '0')}/${validade.getFullYear()}`;
    const atualiza = () => {
      const f = vale;
      const tipo = $('[name="vale-tipo"]:checked', f).value;
      $('[data-vale-valores]').hidden = tipo !== 'valor';
      $('[data-vale-servicos]').hidden = tipo !== 'servico';
      const serv = D.vale.servicos.find((s) => s.id === f['vale-servico']?.value);
      const valor = tipo === 'valor' ? reais(+$('[name="vale-valor"]:checked', f).value) : serv?.nome;
      const cvValor = $('[data-cv-valor]');
      cvValor.textContent = valor;
      cvValor.style.fontSize = tipo === 'servico' ? 'clamp(26px, 3.4vw, 38px)' : '';
      const est = $('[name="vale-estampa"]:checked', f).value;
      cartao.className = `cartao-vale estampa-${est}`;
      $('[data-cv-para]').textContent = f['vale-para'].value.trim() || 'Alguém especial';
      $('[data-cv-msg]').textContent = f['vale-msg'].value.trim() || 'Um tempo só seu, no detalhe.';
      $('[data-cv-de]').textContent = f['vale-de'].value.trim() ? `Com carinho, ${f['vale-de'].value.trim()}` : '';
      $('[data-vale-cont]').textContent = `${f['vale-msg'].value.length} de 120`;
      const entrega = $('[name="vale-entrega"]:checked', f).value;
      $('[data-vale-comprar]').href = wa(`Olá! Quero comprar um vale-presente da ${D.nome}.\nPresente: ${valor}\nEstampa: ${est}\nPara: ${f['vale-para'].value.trim() || '(a definir)'}\nDe: ${f['vale-de'].value.trim() || '(a definir)'}\nMensagem: ${f['vale-msg'].value.trim() || '(sem mensagem)'}\nEntrega: ${entrega === 'digital' ? 'arte digital' : 'envelope para retirar na clínica'}`);
    };
    vale.addEventListener('input', atualiza);
    vale.addEventListener('change', () => { atualiza(); igualaDepois(); });
    atualiza();
    const vit = $('.vale-vitrine');
    if (!reduz && matchMedia('(pointer: fine)').matches) {
      vit.addEventListener('pointermove', (e) => {
        const r = cartao.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        cartao.style.transform = `rotateY(${(x * 14).toFixed(2)}deg) rotateX(${(-y * 12).toFixed(2)}deg)`;
        cartao.style.setProperty('--brilho', `${(x * 120).toFixed(0)}%`);
      });
      vit.addEventListener('pointerleave', () => { cartao.style.transform = ''; cartao.style.setProperty('--brilho', '-40%'); });
    }
  }

  // ---------- loja e sacola ----------
  const sacola = $('#sacola');
  if (sacola && D.produtos) {
    const prodPorId = Object.fromEntries(D.produtos.map((p) => [p.id, p]));
    let itens = guarda.ler('camelia-sacola', {});
    for (const id of Object.keys(itens)) if (!prodPorId[id]) delete itens[id];
    const fundo = document.createElement('div');
    fundo.className = 'sacola-fundo';
    document.body.appendChild(fundo);
    const btn = $('[data-sacola]');
    const abre = () => { sacola.hidden = false; requestAnimationFrame(() => { sacola.classList.add('aberta'); fundo.classList.add('ve'); }); $('.doc-fecha', sacola).focus(); };
    const fecha = () => { sacola.classList.remove('aberta'); fundo.classList.remove('ve'); setTimeout(() => { sacola.hidden = true; }, 450); };
    btn?.addEventListener('click', abre);
    fundo.addEventListener('click', fecha);
    $$('[data-sacola-fecha]', sacola).forEach((b) => b.addEventListener('click', fecha));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sacola.hidden) fecha(); });
    const desenha = () => {
      guarda.gravar('camelia-sacola', itens);
      const ids = Object.keys(itens).filter((id) => itens[id] > 0);
      const qtd = ids.reduce((t, id) => t + itens[id], 0);
      const n = $('[data-sacola-n]');
      if (n) n.textContent = qtd;
      btn?.classList.toggle('tem', qtd > 0);
      $('[data-sacola-vazia]').hidden = !!ids.length;
      $('[data-sacola-pe]').hidden = !ids.length;
      $('[data-sacola-itens]').innerHTML = ids.map((id) => {
        const p = prodPorId[id];
        const emb = $(`[data-produto="${id}"] .emb`)?.outerHTML || '';
        return `<li><span class="si-img">${emb}</span><span><b>${p.nome}</b><small>${p.tam}, ${reais(p.preco)}</small></span><span class="qtd"><button type="button" data-q="${id}" data-d="-1" aria-label="Tirar um">${'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>'}</button><span>${itens[id]}</span><button type="button" data-q="${id}" data-d="1" aria-label="Pôr mais um">${'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>'}</button></span></li>`;
      }).join('');
      $$('[data-q]', sacola).forEach((b) => b.addEventListener('click', () => { itens[b.dataset.q] = Math.max(0, (itens[b.dataset.q] || 0) + +b.dataset.d); if (!itens[b.dataset.q]) delete itens[b.dataset.q]; desenha(); }));
      const ent = $('[name="entrega"]:checked', sacola)?.value;
      const frete = (D.entrega.find((e) => e[0] === ent) || [])[2];
      const sub = ids.reduce((t, id) => t + prodPorId[id].preco * itens[id], 0);
      $('[data-sacola-total]').textContent = reais(sub + (frete || 0)) + (frete === null ? ' + frete' : '');
      $('[data-sacola-enviar]').href = wa(`Olá! Quero fazer este pedido na loja da ${D.nome}:\n${ids.map((id) => `${itens[id]}x ${prodPorId[id].nome} (${prodPorId[id].tam}), ${reais(prodPorId[id].preco * itens[id])}`).join('\n')}\nEntrega: ${(D.entrega.find((e) => e[0] === ent) || [])[1]}\nTotal: ${reais(sub + (frete || 0))}${frete === null ? ' + frete' : ''}`);
    };
    $$('[name="entrega"]', sacola).forEach((i) => i.addEventListener('change', desenha));
    $$('[data-add]').forEach((b) => b.addEventListener('click', () => {
      itens[b.dataset.add] = (itens[b.dataset.add] || 0) + 1;
      desenha();
      btn?.classList.remove('pulou'); void btn?.offsetWidth; btn?.classList.add('pulou');
      toast(`${prodPorId[b.dataset.add].nome} na sacola`);
    }));
    desenha();
  }

  // ---------- janelas legais e cookies ----------
  $$('[data-doc]').forEach((b) => b.addEventListener('click', () => { const d = $(`#doc-${b.dataset.doc}`); if (d?.showModal) d.showModal(); }));
  $$('dialog.doc').forEach((d) => {
    $('[data-fecha]', d).addEventListener('click', () => d.close());
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });
  const ck = $('#cookies');
  if (ck) {
    if (!guarda.ler('camelia-cookies', null)) { ck.hidden = false; igualaDepois(); }
    $$('[data-ck]', ck).forEach((b) => b.addEventListener('click', () => { guarda.gravar('camelia-cookies', { escolha: b.dataset.ck, em: Date.now() }); ck.hidden = true; }));
    $$('[data-cookies]').forEach((b) => b.addEventListener('click', () => { ck.hidden = false; igualaDepois(); }));
  }
})();

// ===================== camada premium: abertura, tema, história na rolagem, cursor, flores e fundos vivos =====================
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const raiz = document.documentElement;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(pointer: fine)').matches;
  const dadosEl = $('#dados');
  const D = dadosEl ? JSON.parse(dadosEl.textContent) : {};
  const guarda = (k, v, t = localStorage) => { try { t.setItem(k, v); } catch { /* sem armazenamento */ } };
  const sorte = (a, b) => a + Math.random() * (b - a);
  const limita = (v) => Math.max(0, Math.min(1, v));

  // ---------- abertura: o olho se desenha, três frases surgem com desfoque, depois a cortina sobe ----------
  const abertura = $('#abertura');
  const fimAbertura = () => { raiz.classList.add('pos-intro'); dispatchEvent(new Event('camelia:pronto')); };
  if (raiz.classList.contains('intro') && abertura && D.intro) {
    const frase = $('.abertura-frase', abertura);
    $$('.ab-cil path', abertura).forEach((p, k) => p.style.setProperty('--k', k));
    const cada = 1150, inicio = 900, timers = [];
    let fim = false;
    const termina = () => {
      if (fim) return;
      fim = true;
      timers.forEach(clearTimeout);
      guarda('camelia-iris-intro', '1', sessionStorage);
      abertura.classList.add('sobe');
      fimAbertura();
      setTimeout(() => { raiz.classList.remove('intro'); abertura.remove(); }, 900);
    };
    const mostra = (i) => {
      const [t, cor] = D.intro[i];
      frase.textContent = t;
      frase.dataset.cor = cor;
      frase.classList.remove('vai');
      void frase.offsetWidth;
      frase.classList.add('vai');
    };
    abertura.addEventListener('click', termina);
    addEventListener('keydown', termina, { once: true });
    D.intro.forEach((_, i) => timers.push(setTimeout(() => mostra(i), inicio + i * cada)));
    timers.push(setTimeout(termina, inicio + D.intro.length * cada));
  } else {
    abertura?.remove();
    raiz.classList.remove('intro');
    requestAnimationFrame(fimAbertura);
  }

  // ---------- tema claro e escuro: o olho fecha à noite e a troca abre em círculo a partir do botão ----------
  const temaBtns = $$('[data-tema-btn]');
  const metaCor = $('meta[name="theme-color"]');
  const marcaTema = () => {
    const escuro = raiz.dataset.tema === 'escuro';
    temaBtns.forEach((b) => { b.setAttribute('aria-pressed', String(escuro)); b.setAttribute('aria-label', escuro ? 'Ativar o tema claro' : 'Ativar o tema escuro'); });
    if (metaCor) metaCor.content = escuro ? '#101325' : '#1E2233';
  };
  const aplica = (t) => { if (t === 'escuro') raiz.dataset.tema = 'escuro'; else delete raiz.dataset.tema; marcaTema(); guarda('camelia-iris-tema', t); };
  marcaTema();
  temaBtns.forEach((btn) => btn.addEventListener('click', () => {
    const novo = raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro';
    if (!document.startViewTransition || reduz) return aplica(novo);
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => aplica(novo));
    vt.ready.then(() => raiz.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${raio}px at ${x}px ${y}px)`] }, { duration: 800, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
  }));

  // ---------- flores do clique: o gesto do Silver, nas cores Íris ----------
  if (!reduz) {
    const florSvg = (p, m) => `<svg viewBox="0 0 24 24" width="100%" height="100%">${[[12, 4.4], [19.2, 9.6], [16.5, 18.2], [7.5, 18.2], [4.8, 9.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.4" fill="${p}"/>`).join('')}<circle cx="12" cy="12" r="3.3" fill="${m}"/></svg>`;
    const cores = [['#B7ACD8', '#62558E'], ['#E7E3EE', '#62558E'], ['#D9A58C', '#1E2233'], ['#62558E', '#E7E3EE'], ['#A9654B', '#F6F3EF'], ['#1E2233', '#B7ACD8']];
    let camada = null;
    addEventListener('pointerdown', (e) => {
      if (e.button > 0 || raiz.classList.contains('intro') && !raiz.classList.contains('pos-intro')) return;
      if (e.target.closest?.('input:not([type="radio"]):not([type="checkbox"]), textarea, select, .ad-palco')) return;
      if (!camada || !camada.isConnected) { camada = document.createElement('div'); camada.className = 'flores-clique'; document.body.appendChild(camada); }
      const n = 12 + Math.floor(Math.random() * 6);
      for (let i = 0; i < n; i++) {
        const el = document.createElement('i');
        const ang = Math.random() * Math.PI * 2, dist = sorte(46, 130);
        const [p, m] = cores[Math.floor(Math.random() * cores.length)];
        const tam = sorte(7, 15);
        el.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${tam}px;height:${tam}px;--tx:${(Math.cos(ang) * dist).toFixed(1)}px;--ty:${(Math.sin(ang) * dist + sorte(36, 76)).toFixed(1)}px;--rot:${Math.round(sorte(-320, 320))}deg;--sc:${sorte(.7, 1.35).toFixed(2)};animation-duration:${Math.round(sorte(900, 1550))}ms`;
        el.innerHTML = florSvg(p, m);
        el.addEventListener('animationend', () => el.remove());
        camada.appendChild(el);
      }
    }, { passive: true });
  }

  // ---------- fundos vivos: manchas de luz que derivam atrás das seções ----------
  if (!reduz) {
    const VIVAS = '.capa, .provador, #precos, .resultados, .avaliacao, .google, .clube, .vale, .local';
    $$('main > section, .rodape').forEach((sec, k) => {
      const a = document.createElement('div');
      const viva = sec.matches(VIVAS);
      a.className = viva ? 'aura viva' : 'aura';
      a.setAttribute('aria-hidden', 'true');
      a.innerHTML = viva ? '<i></i><i></i><i></i><b></b><s></s>' : `<i></i>${k % 3 === 1 ? '<b></b>' : ''}<i></i>`;
      a.querySelectorAll('i').forEach((i) => { i.style.animationDelay = `${-sorte(0, 20).toFixed(1)}s`; });
      sec.prepend(a);
    });
  }

  // ---------- títulos palavra a palavra ----------
  const quebra = (el) => {
    let i = 0;
    const anda = (no) => {
      for (const filho of [...no.childNodes]) {
        if (filho.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const p of filho.textContent.split(/(\s+)/)) {
            if (!p) continue;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); continue; }
            const pal = document.createElement('span'), dentro = document.createElement('span');
            pal.className = 'pal'; dentro.textContent = p; dentro.style.setProperty('--i', i++);
            pal.appendChild(dentro); frag.appendChild(pal);
          }
          no.replaceChild(frag, filho);
        } else if (filho.nodeType === 1 && filho.tagName !== 'BR') anda(filho);
      }
    };
    anda(el);
    el.classList.add('palavras');
  };
  const titulos = $$('.sec-cab h2, [data-palavras], .ta-cab h3, .aval-txt h2, .vale-form h2, .google-resumo h2, .local h2, .seg-txt h3, .contra > h3, .prov-ctrl h2, .onde h2, .ad-txt h3, .pessoa h3, .plano h3');
  if (!reduz) titulos.forEach(quebra);
  const revelaImg = $$('.pessoa-foto, .aba-foto .foto-caixa, img.aval-foto, img.seg-foto, .produto-img');
  if (!reduz) revelaImg.forEach((el) => el.classList.add('revela-img'));

  // entra quando aparece e se desfaz quando a página volta (o elemento sai por baixo)
  // o laço da rolagem decide quem está na tela (mais confiável que esperar o observador do navegador)
  const alternam = [];
  const vaiVolta = (els, entra, sai, opts = {}) => {
    if (reduz) { els.forEach(entra); return; }
    els.forEach((el) => alternam.push({ el, entra, sai, dentro: false, margem: opts.margem ?? 0.08 }));
  };
  const h1 = $('.capa h1');
  vaiVolta([...titulos, ...revelaImg].filter((el) => el !== h1), (el) => el.classList.add('visto'), (el) => el.classList.remove('visto'), { margem: 0.08 });
  if (h1) addEventListener('camelia:pronto', () => setTimeout(() => h1.classList.add('visto'), 120), { once: true });

  // ---------- contadores: contam ao aparecer e de novo quando a pessoa volta ----------
  const formata = (v, casas) => (casas ? v.toFixed(casas).replace('.', ',') : String(Math.round(v)));
  const conta = (el) => {
    const alvo = +el.dataset.conta, de = +(el.dataset.de || 0), casas = +(el.dataset.casas || 0);
    cancelAnimationFrame(el._raf);
    if (reduz) { el.textContent = formata(alvo, casas); return; }
    const dur = 1800, t0 = performance.now();
    const passo = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = formata(de + (alvo - de) * e, casas);
      if (k < 1) el._raf = requestAnimationFrame(passo);
    };
    el._raf = requestAnimationFrame(passo);
  };
  const zera = (el) => { cancelAnimationFrame(el._raf); el.textContent = formata(+(el.dataset.de || 0), +(el.dataset.casas || 0)); };
  const contadores = $$('[data-conta]');
  if (!reduz) contadores.forEach(zera);
  const naCapa = (el) => !!el.closest('.capa');
  vaiVolta(contadores.filter((el) => !naCapa(el)), conta, zera, { margem: 0.12 });
  addEventListener('camelia:pronto', () => setTimeout(() => contadores.filter(naCapa).forEach(conta), 900), { once: true });

  // ---------- a história na rolagem: blocos seguem a posição da página ----------
  const paralaxe = [['.capa-olho .olho-palco', -0.08], ['img.aval-foto', 0.1], ['img.seg-foto', 0.12], ['.pessoa-foto img', 0.06], ['.cartao-vale', -0.04]];
  const moveis = [];
  if (!reduz) paralaxe.forEach(([s, v]) => $$(s).forEach((el) => { el.setAttribute('data-paralaxe', ''); moveis.push([el, v]); }));
  const CENAS = [
    ['.servicos .painel', 'cena'], ['.prov-palco', 'cena-zoom'], ['.prov-ctrl > *', 'cena'],
    ['.silhueta-box', 'cena-lado'], ['.simulador > *', 'cena'],
    ['#precos .abas, .serv-lista .serv, .ta-cab, .ta-tabelas tr, .pagamento > div', 'cena'], ['.aba-foto', 'cena-zoom'],
    ['.resultados .abas, .ad-txt, .faixa-fotos, .resultados .aviso', 'cena'], ['.ad-palco', 'cena-zoom'],
    ['.pessoa', 'cena'], ['.equipe .rt', 'cena'],
    ['.ag-passos, .ag-nav', 'cena'], ['.ag', 'cena-lado'], ['.ag-resumo', 'cena-lado'],
    ['.aval-txt > :not(img), .aval-garantias li', 'cena'], ['.aval-cartao', 'cena-zoom'],
    ['.google-resumo > *, .filtros, .av, .rola-btns', 'cena'],
    ['.clube .periodo, .plano, .clube-regras li', 'cena'],
    ['.vale-form > *', 'cena'], ['.vale-vitrine', 'cena-zoom'],
    ['.produto', 'cena'], ['.loja .mini', 'cena'],
    ['.etapas li, .contra > h3, .contra-grade > div, .politica, .seg-txt > *', 'cena'],
    ['.faq details', 'cena'], ['.local-in > *', 'cena'],
    ['.mapa-linha > *, .rodape-cols > div, .legal > *', 'cena'], ['.sec-cab > p', 'cena'],
  ];
  // títulos grandes deslizam de lado conforme a rolagem
  const deslizam = reduz ? [] : $$('.sec-cab h2, .prov-ctrl h2, .aval-txt h2, .vale-form h2, .google-resumo h2, .ta-cab h3, .local h2, .onde h2');
  deslizam.forEach((el, k) => { el.classList.add('desliza'); el.dataset.lado = k % 2 ? '-1' : '1'; });
  const capaTxt = $('.capa-txt'), capaOlho = $('.capa-olho');
  const cenas = [];
  if (!reduz) {
    CENAS.forEach(([sel, cls]) => $$(sel).forEach((el) => {
      if (el.hasAttribute('data-paralaxe') || el.closest('.capa')) return;
      el.classList.add(cls);
      if (cls === 'cena-lado' && el.matches('.ag-resumo, .simulador > *')) el.style.setProperty('--lado', '60px');
      // irmãos lado a lado entram em sequência: o atraso vira distância de rolagem
      const irmaos = [...el.parentElement.children].filter((x) => x.classList.contains(cls));
      cenas.push({ el, atraso: Math.min(irmaos.indexOf(el), 7) * (el.matches('tr') ? 0.022 : 0.04) });
    }));
  }
  const prog = $('.progresso');
  let pedido = false, ultimoY = scrollY;
  raiz.dataset.rolagem = 'desce';
  const rola = () => {
    pedido = false;
    const vh = innerHeight, alto = raiz.scrollHeight - vh;
    if (prog) prog.style.setProperty('--prog', alto > 0 ? (scrollY / alto).toFixed(4) : 0);
    // primeiro lê tudo, depois escreve, para não forçar o layout a cada elemento
    const leituras = cenas.map(({ el, atraso }) => { const r = el.getBoundingClientRect(); return [el, r.top, r.bottom, atraso, r.height === 0 && r.width === 0]; });
    const titulos2 = deslizam.map((el) => [el, el.getBoundingClientRect()]);
    const estados = alternam.map((a) => [a, a.el.getBoundingClientRect()]);
    const mov = moveis.map(([el, v]) => [el, el.getBoundingClientRect(), v]);
    // --p: entrada pela borda de baixo; --q: saída pela borda de cima. Descendo, o bloco sobe e some no topo;
    // subindo, ele volta descendo pelo topo e se desfaz quando passa da borda de baixo.
    for (const [el, top, bottom, atraso, oculto] of leituras) {
      if (oculto) { el.style.setProperty('--p', 1); el.style.setProperty('--q', 1); continue; }
      const p = limita((vh * (1.01 - atraso) - top) / (vh * 0.3));
      const q = limita((bottom - vh * 0.02) / (vh * 0.3));
      el.style.setProperty('--p', (1 - Math.pow(1 - p, 3)).toFixed(3));
      el.style.setProperty('--q', (1 - Math.pow(1 - q, 3)).toFixed(3));
    }
    for (const [a, r] of estados) {
      const dentro = r.height > 0 && r.top < vh * (1 - a.margem) && r.bottom > vh * a.margem * 0.5;
      if (dentro !== a.dentro) { a.dentro = dentro; (dentro ? a.entra : a.sai)(a.el); }
    }
    for (const [el, r] of titulos2) {
      if (r.bottom < -100 || r.top > vh + 100) continue;
      const c = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.setProperty('--dx', `${(c * 90 * +el.dataset.lado).toFixed(1)}px`);
    }
    // capa: o texto sobe mais rápido e some; o olho cresce e desce devagar
    const h = limita(scrollY / (vh * 0.95));
    if (capaTxt) { capaTxt.style.setProperty('--h', h.toFixed(3)); capaOlho?.style.setProperty('--h', h.toFixed(3)); }
    const y = scrollY;
    if (Math.abs(y - ultimoY) > 2) { raiz.dataset.rolagem = y > ultimoY ? 'desce' : 'sobe'; ultimoY = y; }
    for (const [el, r, v] of mov) {
      if (r.bottom < -200 || r.top > vh + 200) continue;
      el.style.setProperty('--py', `${((r.top + r.height / 2 - vh / 2) * v).toFixed(1)}px`);
    }
  };
  addEventListener('scroll', () => { if (!pedido) { pedido = true; requestAnimationFrame(rola); } }, { passive: true });
  addEventListener('resize', rola);
  addEventListener('click', () => requestAnimationFrame(() => requestAnimationFrame(rola)));
  addEventListener('toggle', () => requestAnimationFrame(rola), true);
  // fotos que carregam depois e qualquer mudança de altura também mexem nas posições
  addEventListener('load', () => requestAnimationFrame(rola), true);
  if ('ResizeObserver' in window) { let ro = false; new ResizeObserver(() => { if (!ro) { ro = true; requestAnimationFrame(() => { ro = false; rola(); }); } }).observe(document.querySelector('main') || document.body); }
  rola();

  // ---------- botões magnéticos ----------
  if (fino && !reduz) {
    $$('.capa-btns .btn, .btn-agendar, .tema-btn, .sacola-btn, .whats-flutua, .prov-btns .btn, .ta-cab .btn, .sim-btns .btn, .plano .btn').forEach((el) => {
      el.style.transition += ', translate .5s cubic-bezier(.2,.7,.2,1)';
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${(((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(1)}px ${(((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(1)}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
  }

  // ---------- cursor: o JS só move os invólucros (transform); o clique encolhe o desenho de dentro, sem tirar do lugar ----------
  if (fino && !reduz) {
    const cx = document.createElement('div');
    cx.className = 'cursor fora';
    cx.setAttribute('aria-hidden', 'true');
    cx.innerHTML = '<span class="cur-anel"><i><b></b></i></span><span class="cur-ponto"><i></i></span>';
    document.body.appendChild(cx);
    const anel = $('.cur-anel', cx), ponto = $('.cur-ponto', cx), rot = $('b', cx);
    raiz.classList.add('cursor-on');
    let mx = -100, my = -100, ax = -100, ay = -100, ativo = false;
    const ROTULOS = [['.ad-palco', 'Arraste'], ['.painel', 'Preços'], ['.cartao-vale', 'Gire'], ['[data-olho-capa]', 'Olhe']];
    const ESCURO = '.provador, .clube, .rodape, .politica-24, .sacola-fundo, .painel';
    const avalia = (alvo) => {
      if (!(alvo instanceof Element)) return;
      const campo = alvo.closest('input:not([type="range"]):not([type="radio"]):not([type="checkbox"]), textarea, select');
      const r = !campo && ROTULOS.find(([s]) => alvo.closest(s));
      const link = !campo && !r && alvo.closest('a, button, label, summary, [role="tab"], [role="option"], .ponto, input[type="range"]');
      cx.classList.toggle('rotulo', !!r);
      if (r) rot.textContent = r[1];
      cx.classList.toggle('link', !!link);
      cx.classList.toggle('campo', !!campo);
      cx.classList.toggle('escuro', !!alvo.closest(ESCURO));
    };
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      if (!ativo) { ax = mx; ay = my; ativo = true; }
      ponto.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      cx.classList.remove('fora');
      avalia(e.target);
    }, { passive: true });
    // ao rolar sem mexer o mouse, o que está sob o cursor muda
    addEventListener('scroll', () => { if (ativo) avalia(document.elementFromPoint(mx, my)); }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => cx.classList.add('fora'));
    addEventListener('pointerdown', () => cx.classList.add('aperta'));
    addEventListener('pointerup', () => cx.classList.remove('aperta'));
    addEventListener('blur', () => cx.classList.remove('aperta'));
    const segue = () => {
      ax += (mx - ax) * 0.2; ay += (my - ay) * 0.2;
      anel.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0)`;
      requestAnimationFrame(segue);
    };
    requestAnimationFrame(segue);
  }
})();
