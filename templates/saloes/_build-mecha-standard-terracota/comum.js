// Mecha Salão, Silver: o que o site e a Área do cliente têm em comum (atalhos, aviso, grupos do mesmo tamanho,
// janelas legais, cookies e as peças de HTML montadas com os dados em uso).
const Comum = (() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const Loja = window.MechaLoja;
  const D = Loja.D;
  const L = Loja.ler();
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const guarda = {
    ler(k, padrao) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento: segue sem lembrar */ } },
  };
  const numeroWa = () => `55${String(L.empresa.whatsapp || '').replace(/\D/g, '')}`;
  const wa = (msg) => `https://wa.me/${numeroWa()}?text=${encodeURIComponent(msg)}`;
  const fotoSrc = (n) => (!n ? '' : /^(data:|https?:)/.test(n) ? n : `assets/img/${n}.webp`);
  const I = { ...D.ic, simbolo: () => D.simbolo };
  const P = window.MechaPartes({ I, fotoSrc, wa });

  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (t) => { if (!toastEl) return; toastEl.textContent = t; toastEl.classList.add('ve'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('ve'), 3000); };

  // grupos com o mesmo tamanho: mede o item mais largo e aplica em --larg
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

  // entrada suave dos blocos (uma vez); o atraso dos vizinhos sai da posição no grupo
  let io;
  const revela = (raiz = document) => {
    const els = $$('.rev, .sv-grade', raiz).filter((el) => !el.classList.contains('ve'));
    if (reduz || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('ve')); return; }
    io ||= new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('ve'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => {
      if (el.classList.contains('sv-grade')) [...el.children].forEach((c, k) => c.style.setProperty('--d', `${(k % 4) * 0.08}s`));
      else if (!el.style.getPropertyValue('--d')) {
        const irmaos = [...el.parentElement.children].filter((x) => x.classList.contains('rev'));
        const k = irmaos.indexOf(el);
        if (irmaos.length > 1 && k > 0) el.style.setProperty('--d', `${Math.min(k, 5) * 0.08}s`);
      }
      io.observe(el);
    });
  };

  // janelas legais e aviso de cookies
  const janelas = () => {
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-doc]');
      if (b) { const d = $(`#doc-${b.dataset.doc}`); if (d?.showModal) d.showModal(); }
    });
    $$('dialog.doc').forEach((d) => {
      $$('[data-fecha]', d).forEach((x) => x.addEventListener('click', () => d.close()));
      d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
    });
    const ck = $('#cookies');
    if (ck) {
      if (!guarda.ler('mecha-salao-cookies', null)) { ck.hidden = false; igualaDepois(); }
      $$('[data-ck]', ck).forEach((b) => b.addEventListener('click', () => { guarda.gravar('mecha-salao-cookies', { escolha: b.dataset.ck, em: Date.now() }); ck.hidden = true; }));
      $$('[data-cookies]').forEach((b) => b.addEventListener('click', () => { ck.hidden = false; igualaDepois(); }));
    }
  };

  return { $, $$, Loja, D, L, reduz, guarda, wa, fotoSrc, I, P, toast, iguala, igualaDepois, revela, janelas };
})();
