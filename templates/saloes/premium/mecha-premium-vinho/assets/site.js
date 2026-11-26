// Mecha Premium Vinho (site): abertura, cortina entre páginas, cursor, botões magnéticos, a página que se monta e se
// desfaz com a rolagem, capa, sanfona de serviços, cartas que viram, avaliações, atendimento em três momentos,
// carrossel, galeria, agendamento com serviço, profissional, dia e horário, contato, cookies e janelas legais.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const raiz = document.documentElement;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(pointer: fine)').matches;
  const D = JSON.parse($('#dados').textContent);
  const guarda = {
    ler(k, padrao, t = localStorage) { try { const v = t.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } },
    gravar(k, v, t = localStorage) { try { t.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento: segue sem lembrar */ } },
  };
  const limita = (v) => Math.max(0, Math.min(1, v));
  const wa = (msg) => `https://wa.me/55${String(D.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
  const P = window.MechaPartes({ I: {}, fotoSrc: (n) => `assets/img/${n}.webp`, wa });

  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (t) => { toastEl.textContent = t; toastEl.classList.add('ve'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('ve'), 3200); };

  // ---------- grupos com o mesmo tamanho: mede o item mais largo e aplica em --larg ----------
  const iguala = () => $$('[data-iguais]').forEach((g) => {
    if (!g.offsetParent && getComputedStyle(g).position !== 'fixed') return;
    let maior = 0;
    for (const f of g.children) {
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

  // ---------- 1. abertura: a mecha se desenha, as palavras trocam e o contador chega a 100 ----------
  const abertura = $('#abertura');
  const pronto = () => raiz.classList.add('pronto');
  if (raiz.classList.contains('intro') && abertura) {
    const palavra = $('[data-ab-palavra]', abertura), conta = $('[data-ab-conta]', abertura);
    const dur = 2300, t0 = performance.now();
    let fim = false, k = 0;
    const termina = () => {
      if (fim) return;
      fim = true;
      guarda.gravar('mecha-vinho-intro', 1, sessionStorage);
      abertura.classList.add('sobe');
      raiz.style.setProperty('--atraso-capa', '.35s');
      $$('.letra').forEach((l) => { l.style.animationPlayState = 'running'; });
      setTimeout(() => { raiz.classList.remove('intro'); abertura.remove(); pronto(); }, 1000);
    };
    const passo = (t) => {
      if (fim) return;
      const p = limita((t - t0) / dur);
      conta.textContent = Math.round(100 * (1 - Math.pow(1 - p, 2)));
      const nova = Math.min(D.abertura.length - 1, Math.floor(p * D.abertura.length));
      if (nova !== k) { k = nova; palavra.textContent = D.abertura[k]; palavra.classList.remove('vai'); void palavra.offsetWidth; palavra.classList.add('vai'); }
      if (p < 1) requestAnimationFrame(passo); else setTimeout(termina, 250);
    };
    requestAnimationFrame(passo);
    abertura.addEventListener('click', termina);
    addEventListener('keydown', termina, { once: true });
  } else {
    abertura?.remove();
    pronto();
  }

  // ---------- 2. cortina entre páginas: cobre ao sair e se abre ao chegar ----------
  if (raiz.classList.contains('chegando')) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      raiz.classList.add('chegou'); raiz.classList.remove('chegando');
      setTimeout(() => raiz.classList.remove('chegou'), 1100);
    }));
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || reduz || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // mesma página: só rola até a âncora
    e.preventDefault();
    guarda.gravar('mecha-vinho-nav', 1, sessionStorage);
    raiz.classList.add('saindo');
    setTimeout(() => { location.href = url.href; }, 720);
  });
  // ao voltar pelo histórico (página guardada em cache), a cortina não pode ficar fechada
  addEventListener('pageshow', (e) => { if (e.persisted) raiz.classList.remove('saindo', 'chegando', 'chegou'); });

  // ---------- 3. topo: fundo ao rolar, some ao descer e volta ao subir; menu do celular ----------
  const menu = $('#menu'), menuBtn = $('.menu-btn');
  let ultimoY = scrollY;
  const aoRolarTopo = () => {
    const y = scrollY;
    raiz.classList.toggle('rolou', y > 40);
    const desce = y > ultimoY + 4, sobe = y < ultimoY - 4;
    if (desce && y > 400 && !raiz.classList.contains('menu-aberto')) raiz.classList.add('topo-some');
    else if (sobe || y < 140) raiz.classList.remove('topo-some');
    if (desce || sobe) ultimoY = y;
  };
  addEventListener('scroll', aoRolarTopo, { passive: true }); aoRolarTopo();
  const fechaMenu = () => { menu.classList.remove('abre'); raiz.classList.remove('menu-aberto'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Abrir o menu'); };
  menuBtn?.addEventListener('click', () => {
    const abre = !menu.classList.contains('abre');
    menu.classList.toggle('abre', abre);
    raiz.classList.toggle('menu-aberto', abre);
    menuBtn.setAttribute('aria-expanded', String(abre));
    menuBtn.setAttribute('aria-label', abre ? 'Fechar o menu' : 'Abrir o menu');
  });
  $$('a', menu).forEach((a) => a.addEventListener('click', fechaMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('abre')) { fechaMenu(); menuBtn.focus(); } });

  // ---------- 4. cursor próprio: ponto e anel; o anel cresce e mostra uma palavra sobre fotos e áreas de arrastar ----------
  const cursor = $('.cursor');
  if (cursor && fino && !reduz) {
    raiz.classList.add('tem-cursor');
    const ponto = $('.cursor-ponto', cursor), anel = $('.cursor-anel', cursor), txt = $('[data-cursor-txt]', cursor);
    let mx = -100, my = -100, ax = -100, ay = -100;
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      ponto.style.setProperty('--x', `${mx}px`); ponto.style.setProperty('--y', `${my}px`);
      cursor.classList.remove('fora');
      const alvo = e.target.closest('[data-cursor], a, button, summary, label, input, select, textarea');
      const palavra = alvo?.closest('[data-cursor]')?.dataset.cursor || '';
      const campo = alvo?.matches('input, select, textarea');
      cursor.classList.toggle('com-texto', !!palavra);
      cursor.classList.toggle('sobre', !!alvo && !palavra && !campo);
      if (palavra && txt.textContent !== palavra) txt.textContent = palavra;
    }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.add('fora'));
    // janela aberta (foto ampliada, termos) fica numa camada acima de toda a página: o cursor vai junto para dentro dela
    const acompanhaJanela = () => { const aberta = $$('dialog[open]').pop(); const casa = aberta || document.body; if (cursor.parentElement !== casa) casa.appendChild(cursor); };
    new MutationObserver(acompanhaJanela).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
    addEventListener('pointerdown', () => cursor.classList.add('clica'));
    addEventListener('pointerup', () => cursor.classList.remove('clica'));
    const segue = () => {
      ax += (mx - ax) * 0.18; ay += (my - ay) * 0.18;
      anel.style.setProperty('--ax', `${ax.toFixed(1)}px`); anel.style.setProperty('--ay', `${ay.toFixed(1)}px`);
      requestAnimationFrame(segue);
    };
    requestAnimationFrame(segue);
  }

  // ---------- 5. botões magnéticos e preenchimento que nasce do ponto do mouse ----------
  document.addEventListener('pointerover', (e) => {
    const b = e.target.closest('.btn');
    if (!b || b.contains(e.relatedTarget)) return;
    const r = b.getBoundingClientRect();
    b.style.setProperty('--mx', `${e.clientX - r.left}px`); b.style.setProperty('--my', `${e.clientY - r.top}px`);
    b.style.setProperty('--escala', String(Math.ceil(Math.hypot(r.width, r.height) / 4.5)));
  });
  if (fino && !reduz) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1)}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
    // blocos do "por que a Mecha" inclinam seguindo o mouse
    $$('[data-inclina]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-((e.clientY - r.top) / r.height - 0.5) * 6).toFixed(2)}deg`);
      });
      el.addEventListener('pointerleave', () => { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); });
    });
  }

  // ---------- 6. a história na rolagem: cada bloco segue a posição da página nos dois sentidos ----------
  // --p: entrada pela borda de baixo; --q: saída pela borda de cima (de 0 a 1, seguindo a rolagem)
  const CENAS = [
    ['.sec-cab .apoio, .sec-cab-pe > *, .nota, .manifesto-acao', 'cena'],
    ['.carta', 'cena'], ['.svc, .condicoes > div', 'cena'],
    ['.bt', 'cena-zoom'], ['.aval-centro', 'cena'],
    ['.proc', 'cena-zoom'], ['.tend-cab > *, .look, .tend-pe', 'cena'],
    ['.filtros, .insta-perfil, .insta-post', 'cena'], ['.duv, .pol, .higiene', 'cena'],
    ['.form', 'cena-lado'], ['.ag-lado', 'cena-zoom'],
    ['.rod-topo > *, .rod-cols > div, .mapa-linha > *, .legal', 'cena'],
    ['.pg-cab-txt, .pg-cab-btns, .pg-cab .apoio', 'cena'], ['.pg-cab-fotos span', 'cena-zoom'],
    ['.seg-txt > *, .hist-txt > p, .numeros p, .membro-txt > *, .equipe-pe > div', 'cena'],
    ['.ct, .form-contato', 'cena'],
  ];
  const cenas = [];
  if (!reduz) {
    CENAS.forEach(([sel, cls]) => $$(sel).forEach((el) => {
      if (el.closest('.capa') || el.closest('.svc-corpo') || el.closest('dialog')) return;
      el.classList.add(cls);
      if (cls === 'cena-lado') el.style.setProperty('--lado', '-90px');
      const irmaos = [...el.parentElement.children].filter((x) => x.classList.contains(cls));
      cenas.push({ el, atraso: Math.min(irmaos.indexOf(el), 6) * 0.045 });
    }));
  }
  // títulos, frases, fotos com máscara e o manifesto: ligam ao entrar e desligam ao sair por qualquer borda
  const anima = $$('.titulo-sec, .manifesto-frase, .cinema-frase, .mascara, .mf');
  if (!reduz && 'IntersectionObserver' in window) {
    anima.forEach((el) => el.classList.add('anima'));
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('ve', e.isIntersecting)), { rootMargin: '-6% 0px -6% 0px' });
    anima.forEach((el) => io.observe(el));
  }
  // títulos grandes deslizam de lado conforme a rolagem
  const deslizam = reduz ? [] : $$('.sec-cab .titulo-sec');
  deslizam.forEach((el, k) => { el.dataset.lado = k % 2 ? '-1' : '1'; });
  const capaFotos = $$('.capa-foto img'), cinema = $('.cinema'), cinemaFotos = $$('.cinema-fotos img'), gigante = $('.rod-gigante');
  const flutuam = $$('.ac');
  let pedido = false, ultimoRola = scrollY;
  raiz.dataset.rolagem = 'desce';
  const rola = () => {
    pedido = false;
    const vh = innerHeight;
    const y = scrollY;
    if (Math.abs(y - ultimoRola) > 2) { raiz.dataset.rolagem = y > ultimoRola ? 'desce' : 'sobe'; ultimoRola = y; }
    // primeiro lê tudo, depois escreve, para não forçar o layout a cada elemento
    const leituras = cenas.map(({ el, atraso }) => { const r = el.getBoundingClientRect(); return [el, r.top, r.bottom, atraso, r.width === 0 && r.height === 0]; });
    const titulos = deslizam.map((el) => [el, el.getBoundingClientRect()]);
    const rc = cinema?.getBoundingClientRect(), rg = gigante?.getBoundingClientRect();
    const voos = flutuam.map((el) => [el, el.getBoundingClientRect()]);
    for (const [el, top, bottom, atraso, oculto] of leituras) {
      if (oculto) { el.style.setProperty('--p', 1); el.style.setProperty('--q', 1); continue; }
      const p = limita((vh * (1.02 - atraso) - top) / (vh * 0.28));
      const q = limita((bottom - vh * 0.03) / (vh * 0.28));
      el.style.setProperty('--p', (1 - Math.pow(1 - p, 3)).toFixed(3));
      el.style.setProperty('--q', (1 - Math.pow(1 - q, 3)).toFixed(3));
    }
    for (const [el, r] of titulos) {
      if (r.bottom < -100 || r.top > vh + 100) continue;
      el.style.setProperty('--dx', `${(((r.top + r.height / 2 - vh / 2) / vh) * 70 * +el.dataset.lado).toFixed(1)}px`);
    }
    if (y < vh * 1.2) capaFotos.forEach((img) => img.style.setProperty('--cy', `${(y * 0.25).toFixed(1)}px`));
    // cinema: a segunda foto corta a primeira conforme a faixa atravessa a tela
    if (rc && rc.bottom > 0 && rc.top < vh) {
      const t = limita((vh - rc.top) / (vh + rc.height));
      cinemaFotos.forEach((img) => img.style.setProperty('--py', `${((t - 0.5) * -90).toFixed(1)}px`));
      cinemaFotos[1]?.style.setProperty('--corte', `${(100 - limita((t - 0.35) / 0.35) * 100).toFixed(1)}%`);
    }
    if (rg && rg.top < vh) gigante.style.setProperty('--gy', `${(limita((vh - rg.top) / vh) * -30 + 30).toFixed(1)}px`);
    for (const [el, r] of voos) {
      if (r.bottom < -200 || r.top > vh + 200) continue;
      el.style.setProperty('--py', `${((r.top + r.height / 2 - vh / 2) * (+el.style.getPropertyValue('--k') % 2 ? 0.12 : -0.08)).toFixed(1)}px`);
    }
  };
  addEventListener('scroll', () => { if (!pedido) { pedido = true; requestAnimationFrame(rola); } }, { passive: true });
  addEventListener('resize', rola);
  addEventListener('load', () => requestAnimationFrame(rola));
  addEventListener('toggle', () => requestAnimationFrame(rola), true);
  if ('ResizeObserver' in window) { let ro = false; new ResizeObserver(() => { if (!ro) { ro = true; requestAnimationFrame(() => { ro = false; rola(); }); } }).observe($('main')); }
  rola();

  // ---------- 7. capa: três fotos que se alternam ----------
  const capa = $('.capa');
  if (capa) {
    const fotos = $$('.capa-foto', capa), pontos = $$('[data-capa]', capa);
    const DUR = 6000;
    raiz.style.setProperty('--capa-dur', `${DUR}ms`);
    let atual = 0, timer;
    const vai = (k) => {
      atual = (k + fotos.length) % fotos.length;
      fotos.forEach((f, i) => f.classList.toggle('ativa', i === atual));
      pontos.forEach((b, i) => { b.setAttribute('aria-pressed', 'false'); if (i === atual) { void b.offsetWidth; b.setAttribute('aria-pressed', 'true'); } });
      clearTimeout(timer);
      if (!reduz) timer = setTimeout(() => vai(atual + 1), DUR);
    };
    pontos.forEach((b, i) => b.addEventListener('click', () => vai(i)));
    vai(0);
  }

  // ---------- 8. sanfonas (serviços, dúvidas, políticas): abrem e fecham deslizando ----------
  $$('details').forEach((d) => {
    const sum = $('summary', d);
    if (!sum) return;
    const corpo = document.createElement('div');
    corpo.className = 'det-corpo';
    while (sum.nextSibling) corpo.appendChild(sum.nextSibling);
    d.appendChild(corpo);
    sum.addEventListener('click', (e) => {
      if (reduz) return;
      e.preventDefault();
      if (d.open) {
        corpo.animate([{ height: `${corpo.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 450, easing: 'cubic-bezier(.22,.8,.2,1)' }).onfinish = () => { d.open = false; };
      } else {
        // abre este e fecha os irmãos do mesmo grupo (atributo name)
        if (d.getAttribute('name')) $$(`details[name="${d.getAttribute('name')}"][open]`).forEach((o) => { if (o !== d) o.open = false; });
        d.open = true;
        corpo.animate([{ height: '0px', opacity: 0 }, { height: `${corpo.offsetHeight}px`, opacity: 1 }], { duration: 650, easing: 'cubic-bezier(.22,.8,.2,1)' });
      }
    });
  });

  // ---------- 9. cartas que viram (clique ou teclado; no mouse viram ao passar) ----------
  $$('.carta-in').forEach((b) => b.addEventListener('click', () => b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'))));

  // ---------- 10. avaliações: o cartão escolhido vai para o centro ----------
  const avalDados = $('#avaliacoes-dados');
  if (avalDados) {
    const lista = JSON.parse(avalDados.textContent);
    const centro = $('.aval-centro');
    $$('[data-aval]').forEach((b) => b.addEventListener('click', () => {
      const k = +b.dataset.aval, d = lista[k];
      centro.classList.add('troca');
      setTimeout(() => {
        $('[data-aval-txt] p').textContent = d.texto;
        $('[data-aval-nome]').textContent = d.nome;
        $('[data-aval-serv]').textContent = d.serv;
        $$('.ac').forEach((li, i) => { li.hidden = i === k; });
        centro.classList.remove('troca');
      }, reduz ? 0 : 420);
    }));
  }

  // ---------- 11. o atendimento em três momentos (troca sozinho, pausa no mouse) ----------
  const proc = $('[data-proc]');
  if (proc) {
    const abas = $$('[data-proc-aba]', proc), fotos = $$('.proc-foto', proc), painel = $('#proc-p');
    const DUR = 7000;
    proc.style.setProperty('--proc-dur', `${DUR}ms`);
    let atual = 0, timer, restante = DUR, inicio = 0, visivel = false;
    const agenda = (t) => { clearTimeout(timer); if (reduz || !visivel) return; inicio = performance.now(); restante = t; timer = setTimeout(() => vai(atual + 1), t); };
    const vai = (k) => {
      const antes = atual;
      atual = (k + abas.length) % abas.length;
      fotos.forEach((f, i) => { f.classList.toggle('saindo', i === antes && i !== atual); f.classList.toggle('ativa', i === atual); });
      abas.forEach((b, i) => { b.setAttribute('aria-selected', 'false'); if (i === atual) { void b.offsetWidth; b.setAttribute('aria-selected', 'true'); } });
      painel.setAttribute('aria-labelledby', abas[atual].id);
      painel.textContent = $('span', abas[atual]).textContent;
      agenda(DUR);
    };
    abas.forEach((b, i) => {
      b.addEventListener('click', () => vai(i));
      b.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); vai(atual + (e.key === 'ArrowRight' ? 1 : -1)); abas[atual].focus(); } });
    });
    proc.addEventListener('pointerenter', () => { proc.classList.add('pausa'); clearTimeout(timer); restante -= performance.now() - inicio; });
    proc.addEventListener('pointerleave', () => { proc.classList.remove('pausa'); agenda(Math.max(400, restante)); });
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) vai(atual); else clearTimeout(timer); }, { threshold: 0.4 }).observe(proc);
  }

  // ---------- 12. carrossel de tendências: setas, arraste, andar sozinho e pausa no mouse ----------
  const car = $('[data-carrossel]');
  if (car) {
    const setas = $$('[data-car]'), prog = $('.car-progresso');
    const passo = () => ($('.look', car)?.getBoundingClientRect().width || 300) + 16;
    const estado = () => {
      const fim = car.scrollWidth - car.clientWidth;
      setas.forEach((b) => { b.disabled = +b.dataset.car < 0 ? car.scrollLeft <= 4 : car.scrollLeft >= fim - 4; });
      prog?.style.setProperty('--car', (0.1 + 0.9 * (fim > 0 ? car.scrollLeft / fim : 1)).toFixed(3));
    };
    setas.forEach((b) => b.addEventListener('click', () => car.scrollBy({ left: passo() * +b.dataset.car, behavior: reduz ? 'auto' : 'smooth' })));
    car.addEventListener('scroll', () => requestAnimationFrame(estado), { passive: true });
    addEventListener('resize', estado); estado();
    car.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); car.scrollBy({ left: passo() * (e.key === 'ArrowRight' ? 1 : -1), behavior: reduz ? 'auto' : 'smooth' }); } });
    // arrastar com o mouse (no toque, a rolagem nativa já arrasta)
    let x0 = null, s0 = 0, moveu = false;
    car.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; x0 = e.clientX; s0 = car.scrollLeft; moveu = false; car.classList.add('arrasta'); });
    addEventListener('pointermove', (e) => { if (x0 === null) return; const dx = e.clientX - x0; if (Math.abs(dx) > 4) moveu = true; car.scrollLeft = s0 - dx; });
    addEventListener('pointerup', () => {
      if (x0 === null) return;
      x0 = null; car.classList.remove('arrasta');
      const p = passo(); car.scrollTo({ left: Math.round(car.scrollLeft / p) * p, behavior: reduz ? 'auto' : 'smooth' });
    });
    car.addEventListener('click', (e) => { if (moveu) { e.preventDefault(); moveu = false; } }, true);
    // anda sozinho quando está na tela; para com o mouse em cima, com o foco dentro ou arrastando
    let parado = false, naTela = false;
    car.addEventListener('pointerenter', () => { parado = true; });
    car.addEventListener('pointerleave', () => { parado = false; });
    car.addEventListener('focusin', () => { parado = true; });
    car.addEventListener('focusout', () => { parado = false; });
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { naTela = e.isIntersecting; }, { threshold: 0.3 }).observe(car);
    if (!reduz) setInterval(() => {
      if (parado || !naTela || x0 !== null || document.hidden) return;
      const fim = car.scrollLeft >= car.scrollWidth - car.clientWidth - 4;
      car.scrollTo({ left: fim ? 0 : car.scrollLeft + passo(), behavior: 'smooth' });
    }, 3800);
  }

  // ---------- 13. galeria: filtros e foto ampliada ----------
  const gal = $('[data-galeria]');
  if (gal) {
    const itens = $$('.gal', gal), filtros = $$('[data-filtro]');
    const filtra = (cat) => {
      filtros.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtro === cat)));
      const sai = itens.filter((el) => !el.hidden);
      sai.forEach((el) => el.classList.add('saindo'));
      setTimeout(() => {
        gal.classList.toggle('filtrado', cat !== 'todos');
        itens.forEach((el) => { el.classList.remove('saindo', 'entrando'); el.hidden = !(cat === 'todos' || el.dataset.cat === cat); });
        let k = 0;
        itens.filter((el) => !el.hidden).forEach((el) => { el.style.setProperty('--k', k++ % 8); void el.offsetWidth; el.classList.add('entrando'); });
      }, reduz ? 0 : 300);
    };
    filtros.forEach((b) => b.addEventListener('click', () => filtra(b.dataset.filtro)));
    const cx = $('#caixa-foto'), img = $('img', cx);
    let atual = 0;
    const visiveis = () => itens.filter((el) => !el.hidden);
    const mostra = (k, anima) => {
      const vs = visiveis(); if (!vs.length) return;
      atual = (k + vs.length) % vs.length;
      const el = vs[atual], o = $('img', el);
      img.src = o.currentSrc || o.src; img.alt = o.alt;
      $('[data-cf-leg]', cx).textContent = $('figcaption', el).textContent;
      $('[data-cf-pos]', cx).textContent = `${atual + 1} de ${vs.length}`;
      if (anima) { img.classList.remove('troca'); void img.offsetWidth; img.classList.add('troca'); }
    };
    gal.addEventListener('click', (e) => { const b = e.target.closest('[data-abre]'); if (!b) return; mostra(visiveis().indexOf(b.closest('.gal')), false); cx.showModal(); });
    $$('[data-cf]', cx).forEach((b) => b.addEventListener('click', () => mostra(atual + +b.dataset.cf, true)));
    $('[data-fecha]', cx).addEventListener('click', () => cx.close());
    cx.addEventListener('click', (e) => { if (e.target === cx) cx.close(); });
    cx.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') mostra(atual + 1, true); else if (e.key === 'ArrowLeft') mostra(atual - 1, true); });
    let tx = null;
    cx.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
    cx.addEventListener('touchend', (e) => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(dx) > 40) mostra(atual + (dx < 0 ? 1 : -1), true); });
  }

  // ---------- 14. página de serviços: filtro por segmento ----------
  const filtrosSeg = $$('[data-seg-filtro]');
  if (filtrosSeg.length) {
    const blocos = $$('.seg-bloco');
    const filtra = (id) => {
      filtrosSeg.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.segFiltro === id)));
      blocos.forEach((s) => { s.hidden = !(id === 'todos' || s.dataset.seg === id); s.classList.remove('entrando'); if (!s.hidden) { void s.offsetWidth; s.classList.add('entrando'); } });
      requestAnimationFrame(rola);
    };
    filtrosSeg.forEach((b) => b.addEventListener('click', () => { filtra(b.dataset.segFiltro); $('#lista').scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' }); }));
    const h = location.hash.replace('#seg-', '');
    if (h && blocos.some((s) => s.dataset.seg === h)) filtra(h);
  }

  // ---------- 15. contadores (contam de novo sempre que voltam à tela) ----------
  const conta = (el) => {
    const alvo = +el.dataset.conta, t0 = performance.now(), dur = 1500;
    const passo = (t) => {
      const p = limita((t - t0) / dur);
      el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3))).toLocaleString('pt-BR');
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };
  const conts = $$('[data-conta]');
  if (conts.length && !reduz && 'IntersectionObserver' in window) {
    const oc = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) conta(e.target); else e.target.textContent = '0'; }), { threshold: 0.5 });
    conts.forEach((c) => oc.observe(c));
  }

  // ---------- 16. horário de hoje em destaque ----------
  const hoje = new Date();
  $$(`.horas tr[data-dia="${hoje.getDay()}"]`).forEach((tr) => tr.classList.add('hoje'));

  // ---------- 17. lista e calendário próprios do agendamento (mesma lógica do Standard Terracota) ----------
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const DIAS_C = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const deIso = (s) => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
  const SVG = (d) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICO = { baixo: SVG('<path d="M6.5 9.5 12 15l5.5-5.5"/>'), esq: SVG('<path d="M14.5 6 8.5 12l6 6"/>'), dir: SVG('<path d="M9.5 6l6 6-6 6"/>'), cal: SVG('<path d="M4 5.5h16v14.5H4zM4 10h16M8.5 3.5v4M15.5 3.5v4"/>') };
  const SP = Object.fromEntries(D.servicos.map((s) => [s.id, s]));
  let aberto = null, uid = 0;
  const fecha = (foca) => { if (!aberto) return; const a = aberto; aberto = null; a.caixa.classList.remove('abre'); a.btn.setAttribute('aria-expanded', 'false'); if (foca) a.btn.focus(); };
  const abre = (peca) => {
    if (aberto && aberto !== peca) fecha();
    aberto = peca;
    peca.btn.setAttribute('aria-expanded', 'true');
    const r = peca.btn.getBoundingClientRect();
    const baixo = innerHeight - r.bottom - 20, cima = r.top - 90;
    const ehCal = peca.caixa.classList.contains('cal');
    const acima = ehCal ? baixo < 400 && cima > baixo : baixo < 240 && cima > baixo;
    peca.caixa.classList.toggle('acima', acima);
    if (!ehCal) peca.caixa.style.maxHeight = `${Math.max(200, Math.min(380, acima ? cima : baixo))}px`;
    peca.caixa.classList.add('abre');
  };
  document.addEventListener('pointerdown', (e) => { if (aberto && !aberto.raiz.contains(e.target)) fecha(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && aberto) { e.stopPropagation(); fecha(true); } });

  const montaLista = (sel) => {
    const id = `lista-${++uid}`;
    const raizL = document.createElement('div'); raizL.className = 'escolha';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'escolha-btn';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
    const rot = sel.closest('label')?.querySelector('span');
    if (rot) { rot.id ||= `${id}-rot`; btn.setAttribute('aria-labelledby', `${rot.id} ${id}-txt`); }
    btn.innerHTML = `<span class="escolha-txt" id="${id}-txt"></span>${ICO.baixo}`;
    const caixa = document.createElement('div'); caixa.className = 'escolha-caixa'; caixa.id = id; caixa.setAttribute('role', 'listbox'); caixa.tabIndex = -1;
    const vazio = sel.querySelector('option[value=""]')?.textContent || 'Escolha';
    caixa.innerHTML = [...sel.querySelectorAll('optgroup')].map((g) => `<div role="group" aria-label="${g.label}"><p class="escolha-grupo">${g.label}</p>${[...g.querySelectorAll('option')].map((o) => {
      const s = SP[o.value];
      return `<div class="escolha-op" role="option" id="${id}-${o.value}" data-v="${o.value}" aria-selected="false"><span>${o.textContent}${s ? `<small>${P.minutos(s.min)}${s.quimica ? ', teste 48h antes' : ''}</small>` : ''}</span>${s ? `<em>${s.de ? '<small>a partir de</small>' : ''}${P.reais(s.preco)}</em>` : ''}</div>`;
    }).join('')}</div>`).join('');
    const ops = $$('.escolha-op', caixa);
    let at = -1;
    const marcaAt = (k) => {
      at = Math.max(0, Math.min(ops.length - 1, k));
      ops.forEach((o, i) => o.classList.toggle('foco', i === at));
      caixa.setAttribute('aria-activedescendant', ops[at].id);
      ops[at].scrollIntoView({ block: 'nearest' });
    };
    const mostra = () => {
      $('.escolha-txt', btn).textContent = sel.value ? sel.selectedOptions[0].textContent : vazio;
      btn.classList.toggle('vazio', !sel.value);
      ops.forEach((x) => x.setAttribute('aria-selected', String(x.dataset.v === sel.value)));
    };
    const escolhe = (v) => { sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true })); fecha(true); };
    const peca = { raiz: raizL, btn, caixa };
    btn.addEventListener('click', () => {
      if (aberto === peca) return fecha();
      abre(peca); caixa.focus({ preventScroll: true });
      marcaAt(Math.max(0, ops.findIndex((o) => o.dataset.v === sel.value)));
    });
    btn.addEventListener('keydown', (e) => { if (['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); btn.click(); } });
    caixa.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); marcaAt(at + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); marcaAt(at - 1); }
      else if (e.key === 'Home') { e.preventDefault(); marcaAt(0); }
      else if (e.key === 'End') { e.preventDefault(); marcaAt(ops.length - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (ops[at]) escolhe(ops[at].dataset.v); }
      else if (e.key === 'Tab') fecha();
    });
    ops.forEach((o, i) => { o.addEventListener('click', () => escolhe(o.dataset.v)); o.addEventListener('pointermove', () => { if (at !== i) marcaAt(i); }); });
    sel.addEventListener('change', mostra);
    sel.classList.add('nativo'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    raizL.append(btn, caixa); sel.after(raizL);
    mostra();
  };

  // pode(d) decide quais dias aceitam pedido; nota() diz por que há dias riscados
  const montaCalendario = (inp, pode, nota) => {
    const id = `cal-${++uid}`;
    const raizC = document.createElement('div'); raizC.className = 'escolha';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'escolha-btn';
    btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
    const rot = inp.closest('label')?.querySelector('span');
    if (rot) { rot.id ||= `${id}-rot`; btn.setAttribute('aria-labelledby', `${rot.id} ${id}-txt`); }
    btn.innerHTML = `<span class="escolha-txt" id="${id}-txt"></span>${ICO.cal}`;
    const caixa = document.createElement('div'); caixa.className = 'escolha-caixa cal'; caixa.id = id; caixa.setAttribute('role', 'dialog'); caixa.setAttribute('aria-label', 'Escolher o dia');
    const min = deIso(inp.min), max = deIso(inp.max);
    let mes = new Date(min.getFullYear(), min.getMonth(), 1), foco = null;
    const dentro = (d) => d >= min && d <= max;
    const ok = (d) => dentro(d) && pode(d);
    const desenha = () => {
      const ano = mes.getFullYear(), m = mes.getMonth();
      const primeiro = new Date(ano, m, 1).getDay(), total = new Date(ano, m + 1, 0).getDate();
      const cel = [];
      for (let k = 0; k < primeiro; k++) cel.push('<span></span>');
      for (let d = 1; d <= total; d++) {
        const dt = new Date(ano, m, d), v = iso(dt), livre = ok(dt), risco = dentro(dt) && !livre;
        cel.push(`<button type="button" class="dia${v === iso(hoje) ? ' hoje' : ''}${v === inp.value ? ' sel' : ''}${risco ? ' fechado' : ''}" data-v="${v}" ${livre ? '' : 'aria-disabled="true"'} tabindex="${v === foco ? 0 : -1}" aria-label="${d} de ${MESES[m]}, ${DIAS[dt.getDay()]}${risco ? ', sem horário' : ''}"${v === inp.value ? ' aria-pressed="true"' : ''}>${d}</button>`);
      }
      const antes = new Date(ano, m, 0) >= min, depois = new Date(ano, m + 1, 1) <= max;
      caixa.innerHTML = `<div class="cal-cab"><button type="button" class="cal-seta" data-mes="-1" aria-label="Mês anterior" ${antes ? '' : 'disabled'}>${ICO.esq}</button><p aria-live="polite">${MESES[m]} <span>${ano}</span></p><button type="button" class="cal-seta" data-mes="1" aria-label="Próximo mês" ${depois ? '' : 'disabled'}>${ICO.dir}</button></div>
        <div class="cal-sem" aria-hidden="true">${DIAS_C.map((d) => `<span>${d}</span>`).join('')}</div>
        <div class="cal-dias">${cel.join('')}</div>
        <p class="cal-nota">${nota()}</p>`;
    };
    const proximoLivre = (d) => { const x = new Date(d); for (let k = 0; k < 70; k++) { if (ok(x)) return x; x.setDate(x.getDate() + 1); } return null; };
    const focaDia = (v) => { foco = v; const d = deIso(v); if (d.getMonth() !== mes.getMonth() || d.getFullYear() !== mes.getFullYear()) mes = new Date(d.getFullYear(), d.getMonth(), 1); desenha(); $(`[data-v="${v}"]`, caixa)?.focus(); };
    const mostra = () => {
      $('.escolha-txt', btn).textContent = inp.value ? (() => { const d = deIso(inp.value); return `${DIAS_C[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`; })() : 'Escolha o dia';
      btn.classList.toggle('vazio', !inp.value);
    };
    const peca = { raiz: raizC, btn, caixa };
    btn.addEventListener('click', () => {
      if (aberto === peca) return fecha();
      const base = inp.value ? deIso(inp.value) : proximoLivre(min) || min;
      foco = iso(base); mes = new Date(base.getFullYear(), base.getMonth(), 1);
      desenha(); abre(peca);
      $(`[data-v="${foco}"]`, caixa)?.focus({ preventScroll: true });
    });
    caixa.addEventListener('click', (e) => {
      const s = e.target.closest('[data-mes]');
      if (s) { mes = new Date(mes.getFullYear(), mes.getMonth() + +s.dataset.mes, 1); desenha(); return; }
      const d = e.target.closest('.dia');
      if (d && !d.hasAttribute('aria-disabled')) { inp.value = d.dataset.v; inp.dispatchEvent(new Event('change', { bubbles: true })); fecha(true); }
    });
    caixa.addEventListener('keydown', (e) => {
      const d = e.target.closest('.dia'); if (!d) return;
      const passos = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      if (passos[e.key]) {
        e.preventDefault();
        const n = deIso(d.dataset.v); n.setDate(n.getDate() + passos[e.key]);
        focaDia(iso(n < min ? min : n > max ? max : n));
      }
    });
    inp.addEventListener('change', mostra);
    inp.type = 'hidden';
    raizC.append(btn, caixa); inp.after(raizC);
    mostra();
  };

  // ---------- 18. agendamento: serviço, profissional, dia e horário ----------
  const form = $('#form-agenda');
  if (form) {
    const f = form.elements;
    const equipe = D.equipe;
    const abertura2 = P.abertura(D.horario);
    const limite = new Date(); limite.setDate(limite.getDate() + 60);
    f.data.min = iso(hoje); f.data.max = iso(limite);
    const caixaPros = $('[data-pros-escolha]', form), caixaHoras = $('[data-horarios]', form), avisoQ = $('[data-aviso-quimica]', form);
    const resumo = (k, v) => { const el = $(`[data-r="${k}"]`); if (!el || el.innerHTML === v) return; el.innerHTML = v; el.classList.remove('muda'); void el.offsetWidth; el.classList.add('muda'); };
    const fazem = (s) => equipe.filter((m) => !s || m.faz.includes(s.seg));
    // horários livres num dia, em passos de 30 minutos dentro da agenda da profissional e do horário da casa
    const horariosDo = (d, s, proId) => {
      const w = d.getDay(), casa = abertura2[w];
      if (!casa) return [];
      const dur = (s?.min || 60) / 60;
      const quem = proId ? equipe.filter((m) => m.id === proId) : fazem(s);
      const agora = new Date(), ehHoje = iso(d) === iso(agora), corte = agora.getHours() + agora.getMinutes() / 60 + 1;
      const mapa = new Map();
      for (const m of quem) {
        const h = m.dias?.[w]; if (!h) continue;
        const ini = Math.max(h[0], casa[0]), fim = Math.min(h[1], casa[1]);
        for (let t = ini; t + dur <= fim + 1e-9; t += 0.5) {
          if (ehHoje && t < corte) continue;
          if (!mapa.has(t)) mapa.set(t, []);
          mapa.get(t).push(m.id);
        }
      }
      return [...mapa].sort((a, b) => a[0] - b[0]).map(([h, q]) => ({ h, quem: q }));
    };
    const servAtual = () => SP[f.servico.value];
    const proAtual = () => form.querySelector('input[name="pro"]:checked')?.value || '';
    const pode = (d) => horariosDo(d, servAtual(), proAtual()).length > 0;
    const notaCal = () => {
      const fechados = [0, 1, 2, 3, 4, 5, 6].filter((w) => !abertura2[w]).map((w) => DIAS[w]);
      const p = equipe.find((m) => m.id === proAtual());
      return `${fechados.length ? `Fechado ${fechados.join(' e ')}. ` : ''}${p ? `Dias riscados: ${P.primeiro(p.nome)} de folga ou sem horário.` : 'Dias riscados: sem horário livre.'}`;
    };
    const desenhaPros = () => {
      const s = servAtual(), atual = proAtual(), lista = fazem(s);
      caixaPros.innerHTML = `<label class="pe"><input type="radio" name="pro" value=""${!atual || !lista.some((m) => m.id === atual) ? ' checked' : ''}><span class="pe-foto">${D.simbolo}</span><span class="pe-txt"><b>Sem preferência</b><small>Primeira livre</small></span></label>${lista.map((m) => `<label class="pe"><input type="radio" name="pro" value="${m.id}"${m.id === atual ? ' checked' : ''}><span class="pe-foto"><img src="assets/img/${m.foto}.webp" alt=""${D.foco[m.foto] ? ` style="object-position:${D.foco[m.foto]}"` : ''}></span><span class="pe-txt"><b>${P.esc(m.nome)}</b><small>${P.esc(m.cargo)}</small></span></label>`).join('')}`;
    };
    const turno = (h) => (h < 12 ? 'Manhã' : h < 18 ? 'Tarde' : 'Noite');
    const desenhaHoras = () => {
      const s = servAtual(), d = f.data.value ? deIso(f.data.value) : null;
      if (!s || !d) { caixaHoras.innerHTML = `<p class="horarios-vazio">${!s ? 'Escolha o serviço' : 'Escolha o dia'} para ver os horários.</p>`; return; }
      const livres = horariosDo(d, s, proAtual());
      const antes = form.querySelector('input[name="hora"]:checked')?.value;
      if (!livres.length) { caixaHoras.innerHTML = '<p class="horarios-vazio">Sem horário livre neste dia. Escolha outro dia ou outra profissional.</p>'; return; }
      let t = '';
      caixaHoras.innerHTML = livres.map((x, k) => {
        const tt = turno(x.h), cab = tt !== t ? `<p class="horarios-turno">${tt}</p>` : ''; t = tt;
        const v = String(x.h);
        return `${cab}<label class="hr" style="--k:${k}"><input type="radio" name="hora" value="${v}"${v === antes ? ' checked' : ''}><span>${P.rotuloHora(x.h)}</span></label>`;
      }).join('');
    };
    const atualizaResumo = () => {
      const s = servAtual(), p = equipe.find((m) => m.id === proAtual());
      const hora = form.querySelector('input[name="hora"]:checked');
      const d = f.data.value ? deIso(f.data.value) : null;
      resumo('servico', s ? P.esc(s.nome) : 'Escolha o serviço');
      resumo('pro', p ? P.esc(p.nome) : 'Sem preferência');
      resumo('quando', d ? `${DIAS_C[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}${hora ? `, ${P.rotuloHora(+hora.value)}` : ''}` : 'Escolha o dia e o horário');
      resumo('tempo', s ? P.minutos(s.min) : '&nbsp;');
      resumo('valor', s ? `${s.de ? '<small>a partir de</small>' : ''}${P.reais(s.preco)}` : '&nbsp;');
    };
    const confereDia = () => {
      if (f.data.value && !pode(deIso(f.data.value))) {
        toast(`Sem horário livre em ${DIAS[deIso(f.data.value).getDay()]}, ${deIso(f.data.value).getDate()}. Escolha outro dia.`);
        f.data.value = ''; f.data.dispatchEvent(new Event('change'));
      }
    };
    const tudo = () => { desenhaHoras(); atualizaResumo(); };
    montaLista(f.servico);
    montaCalendario(f.data, pode, notaCal);
    f.servico.addEventListener('change', () => {
      const s = servAtual();
      avisoQ.hidden = !s?.quimica;
      if (s?.quimica) avisoQ.textContent = 'Este serviço pede teste de mecha e de sensibilidade 48 horas antes para quem nunca fez aqui. Combinamos o teste na confirmação.';
      desenhaPros(); confereDia(); tudo();
    });
    caixaPros.addEventListener('change', () => { confereDia(); tudo(); });
    caixaHoras.addEventListener('change', atualizaResumo);
    f.data.addEventListener('change', tudo);
    desenhaPros(); tudo();

    // links "Agendar" dos serviços na mesma página, e ?servico= / ?prof= vindos das outras páginas
    const escolheServico = (id, avisa) => {
      if (!SP[id]) return;
      f.servico.value = id; f.servico.dispatchEvent(new Event('change', { bubbles: true }));
      if (avisa) toast(`${SP[id].nome} selecionado. Agora escolha quem, o dia e o horário.`);
    };
    document.addEventListener('click', (e) => { const a = e.target.closest('[data-servico]'); if (a && SP[a.dataset.servico]) { e.preventDefault(); escolheServico(a.dataset.servico, true); $('#agendar').scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' }); } });
    const q = new URLSearchParams(location.search);
    if (q.get('servico')) escolheServico(q.get('servico'), true);
    const prof = q.get('prof');
    if (prof && equipe.some((m) => m.id === prof)) {
      const m = equipe.find((x) => x.id === prof);
      const s1 = D.servicos.find((s) => m.faz.includes(s.seg));
      if (s1 && !q.get('servico')) escolheServico(s1.id, false);
      const r = caixaPros.querySelector(`input[value="${prof}"]`);
      if (r) { r.checked = true; caixaPros.dispatchEvent(new Event('change')); toast(`Agendando com ${P.primeiro(m.nome)}. Escolha o dia e o horário.`); }
    }

    const erro = $('.form-erro', form), ok = $('.form-ok', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      $$('.erro', form).forEach((x) => x.classList.remove('erro'));
      const faltam = [];
      const marca = (el, nome) => { (el?.closest('fieldset') || el?.closest('.passo') || el?.closest('label'))?.classList.add('erro'); faltam.push(nome); };
      if (!f.servico.value) marca(f.servico, 'serviço');
      if (!f.data.value) marca(f.data, 'dia');
      const hora = form.querySelector('input[name="hora"]:checked');
      if (!hora) marca(caixaHoras, 'horário');
      if (!f.nome.value.trim()) marca(f.nome, 'nome');
      if (f.tel.value.replace(/\D/g, '').length < 10) marca(f.tel, 'telefone com DDD');
      if (f.email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value)) marca(f.email, 'e-mail válido');
      if (!f.lgpd.checked) faltam.push('o aceite da Política de Privacidade');
      if (faltam.length) { erro.hidden = false; erro.textContent = `Falta preencher: ${faltam.join(', ')}.`; ok.hidden = true; $('.erro', form)?.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'center' }); return; }
      erro.hidden = true;
      const s = servAtual(), d = deIso(f.data.value), p = equipe.find((m) => m.id === proAtual());
      const quando = `${DIAS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}, às ${P.rotuloHora(+hora.value)}`;
      const msg = [
        `Olá! Quero pedir um horário no ${D.nome}.`,
        `Nome: ${f.nome.value.trim()}`, `Telefone: ${f.tel.value.trim()}`, f.email.value ? `E-mail: ${f.email.value.trim()}` : '',
        `Serviço: ${s.nome} (${s.de ? 'a partir de ' : ''}${P.reais(s.preco)}, ${P.minutos(s.min)})`,
        `Profissional: ${p ? p.nome : 'sem preferência'}`, `Quando: ${quando}`,
        f.obs.value.trim() ? `Observações: ${f.obs.value.trim()}` : '',
        `Aceito a Política de Privacidade. Novidades pelo WhatsApp: ${f.novidades.checked ? 'sim' : 'não'}.`,
      ].filter(Boolean).join('\n');
      window.open(wa(msg), '_blank', 'noopener');
      ok.hidden = false;
      ok.innerHTML = `<b>Pedido pronto para envio</b><span>${P.esc(s.nome)}${p ? ` com ${P.esc(P.primeiro(p.nome))}` : ''}, ${quando}. O WhatsApp abriu com a mensagem; é só enviar. Confirmamos em até uma hora, no horário de funcionamento.</span>`;
      toast('Pedido montado. Confira no WhatsApp.');
    });
  }

  // ---------- 19. formulário de contato ----------
  const fc = $('.form-contato');
  if (fc) {
    const f = fc.elements, erro = $('.form-erro', fc), ok = $('.form-ok', fc);
    fc.addEventListener('submit', (e) => {
      e.preventDefault();
      $$('.erro', fc).forEach((x) => x.classList.remove('erro'));
      const faltam = [];
      const marca = (el, nome) => { el.closest('label')?.classList.add('erro'); faltam.push(nome); };
      if (!f.nome.value.trim()) marca(f.nome, 'nome');
      if (f.tel.value.replace(/\D/g, '').length < 10) marca(f.tel, 'telefone com DDD');
      if (f.email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value)) marca(f.email, 'e-mail válido');
      if (!f.assunto.value) marca(f.assunto, 'assunto');
      if (f.msg.value.trim().length < 5) marca(f.msg, 'mensagem');
      if (!f.lgpd.checked) faltam.push('o aceite da Política de Privacidade');
      if (faltam.length) { erro.hidden = false; erro.textContent = `Falta preencher: ${faltam.join(', ')}.`; ok.hidden = true; return; }
      erro.hidden = true;
      const msg = [`Olá, ${D.nome}! ${f.assunto.value}.`, f.msg.value.trim(), `Nome: ${f.nome.value.trim()}`, `Telefone: ${f.tel.value.trim()}`, f.email.value ? `E-mail: ${f.email.value.trim()}` : '', `Prefiro a resposta por: ${f.canal.value}.`].filter(Boolean).join('\n');
      window.open(wa(msg), '_blank', 'noopener');
      ok.hidden = false;
      ok.innerHTML = `<b>Mensagem pronta</b><span>O WhatsApp abriu com a sua mensagem; é só enviar. Respondemos por ${P.esc(f.canal.value.toLowerCase())} em até uma hora, no horário de funcionamento.</span>`;
      fc.reset();
    });
  }

  // ---------- 20. janelas legais e aviso de cookies ----------
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-doc]'); if (b) $(`#doc-${b.dataset.doc}`)?.showModal(); });
  $$('dialog.doc').forEach((d) => {
    $$('[data-fecha]', d).forEach((x) => x.addEventListener('click', () => d.close()));
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });
  const ck = $('#cookies');
  if (!guarda.ler('mecha-vinho-cookies', null)) { ck.hidden = false; igualaDepois(); }
  $$('[data-ck]', ck).forEach((b) => b.addEventListener('click', () => { guarda.gravar('mecha-vinho-cookies', { escolha: b.dataset.ck, em: new Date().toISOString() }); ck.hidden = true; }));
  $$('[data-cookies]').forEach((b) => b.addEventListener('click', () => { ck.hidden = false; igualaDepois(); }));

  iguala();
})();

/* ---------- tema claro ou escuro (pílula na lateral e no menu do celular) ---------- */
(() => {
  const raiz = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  let fim;
  const marca = () => {
    document.querySelectorAll('[data-tema-ir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaIr === raiz.dataset.tema)));
    if (meta) meta.content = raiz.dataset.tema === 'claro' ? '#4A1512' : '#120A08';
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tema-ir]');
    if (!b || b.dataset.temaIr === raiz.dataset.tema) return;
    // tema-anim liga a passagem suave das cores só durante a troca
    raiz.classList.add('tema-anim');
    raiz.dataset.tema = b.dataset.temaIr;
    try { localStorage.setItem('mecha-vinho-tema', raiz.dataset.tema); } catch (err) { /* sem armazenamento, vale só nesta visita */ }
    marca();
    clearTimeout(fim);
    fim = setTimeout(() => raiz.classList.remove('tema-anim'), 800);
  });
  marca();
})();
