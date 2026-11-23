// Mecha Salão & Barbearia, Gold: interações (topo, capa, colunas, cardápio, antes e depois, avaliações, agenda por profissional,
// janelas legais e cookies) e a história na rolagem (a página se monta descendo e se desfaz e se refaz subindo).
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const raiz = document.documentElement;
  const dadosEl = $('#dados');
  const D = dadosEl ? JSON.parse(dadosEl.textContent) : {};
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reais = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
  const wa = (msg) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`;
  const limita = (v) => Math.min(1, Math.max(0, v));
  const guarda = {
    ler(k, padrao) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento: segue sem lembrar */ } },
  };
  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (t) => { if (!toastEl) return; toastEl.textContent = t; toastEl.classList.add('ve'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('ve'), 2800); };
  const hora = (h) => `${Math.floor(h)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

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

  // ---------- topo: transparente sobre a capa, escuro depois ----------
  const topo = $('.topo');
  const menu = $('#menu'), menuBtn = $('.menu-btn');
  const fechaMenu = () => { menu.classList.remove('mostra'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Abrir o menu'); raiz.classList.remove('menu-on'); };
  menuBtn?.addEventListener('click', () => {
    const abre = !menu.classList.contains('mostra');
    menu.classList.toggle('mostra', abre); raiz.classList.toggle('menu-on', abre);
    menuBtn.setAttribute('aria-expanded', String(abre)); menuBtn.setAttribute('aria-label', abre ? 'Fechar o menu' : 'Abrir o menu');
  });
  $$('a', menu).forEach((a) => a.addEventListener('click', fechaMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('mostra')) { fechaMenu(); menuBtn.focus(); } });

  // ---------- capa: fotos que se alternam ----------
  const capaFotos = $$('.capa-foto'), capaPontos = $$('[data-capa-ir]');
  let capaAtual = 0, capaT;
  const capaVai = (n) => {
    capaFotos[capaAtual]?.classList.remove('ativa'); capaPontos[capaAtual]?.setAttribute('aria-selected', 'false');
    capaAtual = (n + capaFotos.length) % capaFotos.length;
    capaFotos[capaAtual].classList.add('ativa'); capaPontos[capaAtual]?.setAttribute('aria-selected', 'true');
    clearTimeout(capaT); if (!reduz && capaFotos.length > 1) capaT = setTimeout(() => capaVai(capaAtual + 1), 6500);
  };
  capaPontos.forEach((b) => b.addEventListener('click', () => capaVai(+b.dataset.capaIr)));
  if (capaFotos.length > 1 && !reduz) capaT = setTimeout(() => capaVai(1), 6500);
  requestAnimationFrame(() => setTimeout(() => raiz.classList.add('pronto'), 120));

  // ---------- colunas que abrem ----------
  const colunas = $$('.coluna');
  colunas.forEach((c) => {
    c.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { colunas.forEach((x) => x.classList.toggle('aberta', x === c)); } });
    c.addEventListener('click', (e) => { if (!c.classList.contains('aberta')) { e.preventDefault(); colunas.forEach((x) => x.classList.toggle('aberta', x === c)); } });
  });

  // ---------- cardápio: abas Salão e Barbearia ----------
  const lados = $$('[data-lado]');
  const mostraLado = (l) => {
    lados.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.lado === l)));
    $$('.lado').forEach((p) => { p.hidden = p.id !== `lado-${l}`; });
    igualaDepois();
  };
  lados.forEach((b) => {
    b.addEventListener('click', () => mostraLado(b.dataset.lado));
    b.addEventListener('keydown', (e) => { if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { const o = lados[(lados.indexOf(b) + 1) % lados.length]; o.focus(); mostraLado(o.dataset.lado); } });
  });
  $$('[data-aba-ir]').forEach((a) => a.addEventListener('click', () => { if (lados.length) mostraLado(a.dataset.abaIr); }));

  // sanfonas (cardápio e dúvidas): a altura anima ao abrir e fechar; no cardápio, abrir uma fecha as outras do mesmo lado
  $$('.cat, .faq details').forEach((d) => {
    const sum = $('summary', d);
    const anima = (abre) => {
      if (d._anim) { d._anim.cancel(); d._anim = null; }
      const borda = d.offsetHeight - d.clientHeight;
      const ini = d.offsetHeight;
      d.classList.remove('fechando');
      if (abre) d.open = true;
      const fim = abre ? d.scrollHeight + borda : sum.offsetHeight + borda;
      if (!abre) d.classList.add('fechando');
      d.style.overflow = 'hidden';
      d._anim = d.animate({ height: [`${ini}px`, `${fim}px`] }, { duration: abre ? 620 : 460, easing: 'cubic-bezier(.2,.7,.2,1)' });
      d._anim.onfinish = () => { d._anim = null; d.style.overflow = ''; if (!abre) { d.open = false; d.classList.remove('fechando'); } igualaDepois(); };
    };
    d._anima = anima;
    sum.addEventListener('click', (e) => {
      const abre = !d.open || d.classList.contains('fechando');
      if (reduz || !d.animate) { if (abre && d.classList.contains('cat')) $$('.cat[open]', d.parentElement).forEach((o) => { if (o !== d) o.open = false; }); return; }
      e.preventDefault();
      if (abre && d.classList.contains('cat')) $$('.cat[open]', d.parentElement).forEach((o) => { if (o !== d && !o.classList.contains('fechando')) o._anima(false); });
      anima(abre);
    });
  });

  // ---------- antes e depois ----------
  const transAbas = $$('[data-trans]');
  transAbas.forEach((b) => b.addEventListener('click', () => {
    transAbas.forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    $$('[data-trans-painel]').forEach((p) => { p.hidden = p.dataset.transPainel !== b.dataset.trans; });
  }));
  $$('.compara').forEach((c) => {
    const r = $('input', c);
    const poe = (v) => c.style.setProperty('--x', `${v}%`);
    r.addEventListener('input', () => poe(r.value));
    // dica de movimento quando aparece pela primeira vez
    if (!reduz && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; io.disconnect();
        const t0 = performance.now();
        const anda = (t) => { const k = Math.min(1, (t - t0) / 1600); const v = 50 + Math.sin(k * Math.PI * 2) * 16 * (1 - k); poe(v); if (k < 1) requestAnimationFrame(anda); else poe(r.value); };
        requestAnimationFrame(anda);
      }, { threshold: 0.6 });
      io.observe(c);
    }
  });

  // ---------- avaliações ----------
  const aval = $('[data-aval]');
  if (aval) {
    const itens = $$('[data-aval-item]', aval), rostos = $$('[data-aval-ir]', aval), fotos = $$('.aval-foto img', aval);
    let atual = 0, t;
    const vai = (n) => {
      atual = (n + itens.length) % itens.length;
      itens.forEach((x, k) => { x.hidden = k !== atual; x.classList.toggle('ativo', k === atual); });
      rostos.forEach((x, k) => x.setAttribute('aria-selected', String(k === atual)));
      fotos.forEach((x, k) => x.classList.toggle('ativa', k === atual));
      clearTimeout(t); if (!reduz) t = setTimeout(() => vai(atual + 1), 8000);
    };
    rostos.forEach((b, k) => b.addEventListener('click', () => vai(k)));
    if (!reduz) t = setTimeout(() => vai(1), 8000);
  }

  // ---------- horário de hoje no rodapé ----------
  const hoje = new Date().getDay();
  $(`.horas tr[data-dia="${hoje}"]`)?.classList.add('hoje');

  // ---------- agendamento: serviço, profissional, data e horário conforme a agenda de cada um ----------
  const form = $('#form-agenda');
  if (form) {
    const servPor = Object.fromEntries((D.servicos || []).map((s) => [s.id, s]));
    const quimicos = new Set(['raiz', 'mechas', 'gloss', 'progressiva', 'pig-barba', 'pig-cabelo']);
    const f = form.elements;
    const pad = (n) => String(n).padStart(2, '0');
    const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const amanha = new Date(); amanha.setDate(amanha.getDate() + 1);
    const limite = new Date(); limite.setDate(limite.getDate() + 60);
    f.data.min = iso(new Date()); f.data.max = iso(limite);
    const deIso = (s) => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
    const fazem = (sid) => { const s = servPor[sid]; return (D.equipe || []).filter((p) => !s || p.faz.includes(s.seg)); };
    const preencheProfs = () => {
      const atual = f.prof.value;
      const ps = fazem(f.servico.value);
      f.prof.innerHTML = `<option value="">Sem preferência</option>${ps.map((p) => `<option value="${p.id}">${p.nome}, ${p.cargo.toLowerCase()}</option>`).join('')}`;
      if (ps.some((p) => p.id === atual)) f.prof.value = atual;
    };
    // horários livres: de 30 em 30 minutos, dentro da agenda do profissional (ou de quem faz o serviço) e do funcionamento
    const horarios = () => {
      const s = servPor[f.servico.value];
      if (!s || !f.data.value) return null;
      const d = deIso(f.data.value), dia = d.getDay();
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
      return { lista: [...livres].sort((a, b) => a - b), ps };
    };
    const preencheHoras = () => {
      const r = horarios();
      if (!r) { f.hora.disabled = true; f.hora.innerHTML = '<option value="">Escolha serviço e data primeiro</option>'; return; }
      if (r.fechado) { f.hora.disabled = true; f.hora.innerHTML = '<option value="">Fechado neste dia. Escolha outra data</option>'; return; }
      if (!r.lista.length) {
        f.hora.disabled = true;
        const nome = f.prof.value ? f.prof.selectedOptions[0].textContent.split(',')[0] : 'a equipe deste serviço';
        f.hora.innerHTML = `<option value="">Sem horário com ${nome} nesta ${DIAS[deIso(f.data.value).getDay()]}</option>`;
        return;
      }
      const atual = f.hora.value;
      f.hora.disabled = false;
      f.hora.innerHTML = `<option value="">Escolha o horário</option>${r.lista.map((h) => `<option value="${h}">${hora(h)}</option>`).join('')}`;
      if (r.lista.map(String).includes(atual)) f.hora.value = atual;
    };
    const avisoQ = $('[data-aviso-quimica]', form);
    f.servico.addEventListener('change', () => { preencheProfs(); preencheHoras(); avisoQ.hidden = !quimicos.has(f.servico.value); });
    f.prof.addEventListener('change', preencheHoras);
    f.data.addEventListener('change', preencheHoras);
    preencheProfs();

    // atalhos da página que já escolhem serviço ou profissional
    $$('[data-servico]').forEach((a) => a.addEventListener('click', () => {
      if (!servPor[a.dataset.servico]) return;
      f.servico.value = a.dataset.servico; f.servico.dispatchEvent(new Event('change'));
    }));
    $$('[data-prof]').forEach((a) => a.addEventListener('click', () => {
      const p = (D.equipe || []).find((x) => x.id === a.dataset.prof);
      if (!p) return;
      const s = servPor[f.servico.value];
      if (s && !p.faz.includes(s.seg)) { f.servico.value = ''; }
      preencheProfs(); f.prof.value = p.id; preencheHoras();
      toast(`${p.nome.split(' ')[0]} selecionado. Escolha o serviço e a data.`);
    }));

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
      const prof = f.prof.value ? f.prof.selectedOptions[0].textContent.split(',')[0] : 'sem preferência';
      const quando = `${DIAS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}, às ${hora(+f.hora.value)}`;
      const msg = [
        `Olá! Quero pedir um horário na ${D.nome}.`,
        `Nome: ${f.nome.value.trim()}`, `Telefone: ${f.tel.value.trim()}`, f.email.value ? `E-mail: ${f.email.value.trim()}` : '',
        `Serviço: ${s.nome} (${s.de ? 'a partir de ' : ''}${reais(s.preco)})`, `Profissional: ${prof}`, `Quando: ${quando}`,
        f.obs.value.trim() ? `Observações: ${f.obs.value.trim()}` : '',
        `Aceito a Política de Privacidade. Novidades pelo WhatsApp: ${f.novidades.checked ? 'sim' : 'não'}.`,
      ].filter(Boolean).join('\n');
      window.open(wa(msg), '_blank', 'noopener');
      ok.hidden = false;
      ok.innerHTML = `<b>Pedido pronto para envio</b>${s.nome} com ${prof}, ${quando}. O WhatsApp abriu com a mensagem; é só enviar. Confirmamos em até uma hora no horário de funcionamento.`;
      toast('Pedido montado. Confira no WhatsApp.');
    });
  }

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

  // ===================== a história na rolagem =====================
  // títulos palavra a palavra
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
  const titulos = $$('.sec-cab h2, .sec-cab-col h2, [data-palavras], .cartao h3, .trans-txt h3, .higiene h3, .plano h3');
  const imagens = $$('.cat-foto, .pessoa-foto, .higiene-foto, .passo-foto, .aval-foto');
  if (!reduz) { titulos.forEach(quebra); imagens.forEach((el) => el.classList.add('revela-img')); }

  // quem entra e sai da tela (o laço da rolagem decide, nos dois sentidos)
  const alternam = [];
  const vaiVolta = (els, entra, sai, margem = 0.08) => {
    if (reduz) { els.forEach(entra); return; }
    els.forEach((el) => alternam.push({ el, entra, sai, dentro: false, margem }));
  };
  vaiVolta([...titulos, ...imagens], (el) => el.classList.add('visto'), (el) => el.classList.remove('visto'));

  // contadores: contam ao aparecer e de novo quando a pessoa volta
  const formata = (v, casas) => (casas ? v.toFixed(casas).replace('.', ',') : Math.round(v).toLocaleString('pt-BR'));
  const conta = (el) => {
    const alvo = +el.dataset.conta, casas = +(el.dataset.casas || 0);
    cancelAnimationFrame(el._raf);
    const t0 = performance.now();
    const passo = (t) => { const k = Math.min(1, (t - t0) / 1700), e = 1 - Math.pow(1 - k, 4); el.textContent = formata(alvo * e, casas); if (k < 1) el._raf = requestAnimationFrame(passo); };
    el._raf = requestAnimationFrame(passo);
  };
  const zera = (el) => { cancelAnimationFrame(el._raf); el.textContent = formata(0, +(el.dataset.casas || 0)); };
  const contadores = $$('[data-conta]');
  if (!reduz) contadores.forEach(zera);
  vaiVolta(contadores, conta, zera, 0.12);

  // blocos que seguem a posição da página
  const CENAS = [
    ['.espaco-lado > *', 'cena'], ['.coluna', 'cena'],
    ['.precos .sec-cab > p, .lados, .cat summary, .item, .pagamento > *', 'cena'],
    ['.motivos .sec-cab > div > *', 'cena'],
    ['.trans-abas, .trans-txt > *, .resultados .aviso', 'cena'], ['.compara', 'cena-zoom'],
    ['.sec-cab-col > p, .sec-cab-col > .btn, .pessoa > :not(.pessoa-foto)', 'cena'],
    ['.visita .sec-cab > div > *', 'cena'],
    ['.planos .sec-cab > p, .plano, .planos-regras li', 'cena'],
    ['.avaliacoes .nota-google, .aval-txt > :not(figure)', 'cena'], ['.faixa-aval', 'cena-lado'],
    ['.lookbook .sec-cab > div > *', 'cena'],
    ['.cuidados .sec-cab > p, .regra, .higiene li, .rt', 'cena'],
    ['.duvidas .sec-cab-col > :not(h2), .faq details', 'cena'],
    ['.agendar-info > :not(h2)', 'cena'], ['.form', 'cena-lado'],
    ['.rodape-cta .btn, .mapa-linha > *, .rodape-cols > div, .legal > *', 'cena'],
  ];
  const cenas = [];
  if (!reduz) {
    CENAS.forEach(([sel, cls]) => $$(sel).forEach((el) => {
      if (el.closest('.capa')) return;
      el.classList.add(cls);
      if (el.matches('.form')) el.style.setProperty('--lado', '110px');
      const irmaos = [...el.parentElement.children].filter((x) => x.classList.contains(cls));
      cenas.push({ el, atraso: Math.min(irmaos.indexOf(el), 6) * 0.045 });
    }));
  }
  // títulos grandes deslizam de lado conforme a rolagem
  const deslizam = reduz ? [] : $$('.sec-cab h2, .duvidas h2, .rodape-cta h2');
  deslizam.forEach((el, k) => { el.classList.add('desliza'); el.dataset.lado = k % 2 ? '-1' : '1'; });

  // o espaço: o parágrafo se pinta palavra a palavra conforme a rolagem
  const pinta = $('[data-pinta]');
  const pintaPal = pinta ? $$('span', pinta) : [];
  // quatro motivos: o cartão de baixo encolhe e escurece quando o seguinte chega
  const cartoes = $$('.cartao');
  // visita: trilho lateral preso enquanto a página desce
  const visita = $('.visita'), trilho = $('.trilho'), janela = $('.trilho-janela');
  const largo = matchMedia('(min-width: 981px)');
  const medeVisita = () => {
    if (!visita || !trilho) return;
    if (reduz || !largo.matches) { visita.classList.remove('trava'); visita.style.removeProperty('--altura'); trilho.style.removeProperty('--tx'); return; }
    visita.classList.add('trava');
    const extra = Math.max(0, trilho.scrollWidth - janela.clientWidth);
    visita.style.setProperty('--altura', `${innerHeight + extra}px`);
    visita._extra = extra;
  };
  const passos = $$('.passo');
  // lookbook: a roda gira com a rolagem
  const arco = $('[data-arco]');

  let pedido = false, ultimoY = scrollY;
  raiz.dataset.rolagem = 'desce';
  const rola = () => {
    pedido = false;
    const vh = innerHeight, y = scrollY;
    if (Math.abs(y - ultimoY) > 2) { raiz.dataset.rolagem = y > ultimoY ? 'desce' : 'sobe'; ultimoY = y; }
    topo?.classList.toggle('solido', y > 40);
    // primeiro lê, depois escreve
    const leituras = cenas.map(({ el, atraso }) => { const r = el.getBoundingClientRect(); return [el, r.top, r.bottom, atraso, r.width === 0 && r.height === 0]; });
    const estados = alternam.map((a) => [a, a.el.getBoundingClientRect()]);
    const tits = deslizam.map((el) => [el, el.getBoundingClientRect()]);
    const pr = pinta?.getBoundingClientRect();
    const cr = cartoes.map((c) => c.getBoundingClientRect());
    const vr = visita?.getBoundingClientRect();
    const ar = arco?.getBoundingClientRect();
    // perto do fim da página não há mais rolagem para trazer os últimos blocos até o meio da tela:
    // conforme a página chega ao fim, o que já está na tela termina de entrar
    const fim = limita(1 - (raiz.scrollHeight - vh - y) / (vh * 0.45));
    for (const [el, top, bottom, atraso, oculto] of leituras) {
      if (oculto) { el.style.setProperty('--p', 1); el.style.setProperty('--q', 1); continue; }
      let p = limita((vh * (1.02 - atraso) - top) / (vh * 0.3));
      if (fim > 0 && top < vh) p = Math.max(p, fim);
      const q = limita((bottom - vh * 0.02) / (vh * 0.3));
      el.style.setProperty('--p', (1 - Math.pow(1 - p, 3)).toFixed(3));
      el.style.setProperty('--q', (1 - Math.pow(1 - q, 3)).toFixed(3));
    }
    for (const [a, r] of estados) {
      const dentro = r.height > 0 && r.top < vh * (1 - a.margem) && r.bottom > vh * a.margem * 0.5;
      if (dentro !== a.dentro) { a.dentro = dentro; (dentro ? a.entra : a.sai)(a.el); }
    }
    for (const [el, r] of tits) {
      if (r.bottom < -100 || r.top > vh + 100) continue;
      el.style.setProperty('--dx', `${(((r.top + r.height / 2 - vh / 2) / vh) * (innerWidth < 700 ? 18 : 80) * +el.dataset.lado).toFixed(1)}px`);
    }
    const capaTxt = $('.capa-txt');
    if (capaTxt && !reduz) { const h = limita(y / (vh * 0.9)).toFixed(3); capaTxt.style.setProperty('--h', h); $('.capa-fotos')?.style.setProperty('--h', h); }
    if (pr && !reduz) {
      const k = limita((vh * 0.85 - pr.top) / (pr.height + vh * 0.35));
      const n = Math.round(k * pintaPal.length);
      pintaPal.forEach((s, i) => s.classList.toggle('on', i < n));
    } else if (pr) pintaPal.forEach((s) => s.classList.add('on'));
    if (!reduz) cartoes.forEach((c, i) => {
      const prox = cr[i + 1];
      if (!prox) { c.style.setProperty('--enc', 1); c.style.setProperty('--luz', 1); return; }
      const cob = limita((cr[i].bottom - prox.top) / cr[i].height);
      const fora = limita((cr[i].top + cr[i].height - prox.top) / cr[i].height);
      const k = cob * (fora > 0 ? 1 : 0);
      c.style.setProperty('--enc', (1 - k * 0.06).toFixed(4));
      c.style.setProperty('--luz', (1 - k * 0.28).toFixed(3));
    });
    if (vr && visita.classList.contains('trava') && visita._extra) {
      const k = limita(-vr.top / (vr.height - vh));
      trilho.style.setProperty('--tx', `${(-k * visita._extra).toFixed(1)}px`);
      passos.forEach((p, i) => p.style.setProperty('--marco', k * (passos.length - 1) + 0.6 >= i ? 1.25 : 0.8));
    }
    if (ar && !reduz && ar.bottom > -200 && ar.top < vh + 200) {
      const k = (vh - ar.top) / (vh + ar.height); // 0 quando entra por baixo, 1 quando sai por cima
      arco.style.setProperty('--giro', `${((0.5 - k) * 70).toFixed(2)}deg`);
    }
  };
  const pede = () => { if (!pedido) { pedido = true; requestAnimationFrame(rola); } };
  addEventListener('scroll', pede, { passive: true });
  addEventListener('resize', () => { medeVisita(); pede(); });
  addEventListener('click', () => requestAnimationFrame(() => requestAnimationFrame(rola)));
  addEventListener('toggle', () => requestAnimationFrame(rola), true);
  addEventListener('load', () => { medeVisita(); requestAnimationFrame(rola); }, true);
  if ('ResizeObserver' in window) { let ro = false; new ResizeObserver(() => { if (!ro) { ro = true; requestAnimationFrame(() => { ro = false; rola(); }); } }).observe(document.querySelector('main') || document.body); }
  if (document.fonts) document.fonts.ready.then(() => { medeVisita(); rola(); });
  medeVisita();
  rola();
})();
