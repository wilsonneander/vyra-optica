/* AURA Fresh, modelo 5 "Maré": comportamentos de página guiados pela rolagem.
   Frase que enche de água, ativos revelados por uma crista de onda, linha de água do ritual e faixas de avaliações. */
(function () {
  'use strict';
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  // progresso de uma seção alta com parte fixa (0 no topo, 1 quando a parte fixa sai)
  const progressoFixo = el => { const r = el.getBoundingClientRect(), total = r.height - innerHeight; return total > 0 ? clamp(-r.top / total) : 0; };
  // progresso de um bloco passando pela tela (0 entrando por baixo, 1 no meio de cima)
  const passagem = (el, ini = 1, fim = 0.35) => { const r = el.getBoundingClientRect(); return clamp((innerHeight * ini - r.top) / (innerHeight * (ini - fim))); };
  const crista = (larg, nivel, amp, fase, ondas = 2, alto = 1000) => {
    let d = `M0 ${nivel.toFixed(1)}`;
    const passos = 24;
    for (let i = 1; i <= passos; i++) { const x = larg * i / passos; d += ` L${x.toFixed(1)} ${(nivel + Math.sin(i / passos * Math.PI * 2 * ondas + fase) * amp + Math.sin(i / passos * Math.PI * 5 - fase * 1.4) * amp * 0.35).toFixed(1)}`; }
    return d + ` V${alto} H0Z`;
  };

  // ---------- frase que enche de água ----------
  const enche = document.querySelector('[data-enche]');
  const palavras = enche ? $$('.enche-frase span', enche) : [];
  const emA = enche && enche.querySelector('.em-a'), emB = enche && enche.querySelector('.em-b');

  // ---------- ativos revelados pela onda ----------
  const ams = $$('[data-am]').map(el => ({ el, path: el.querySelector('.am-crista path') }));

  // ---------- ritual ----------
  const ritual = document.querySelector('[data-ritual]');
  const rmAgua = ritual && ritual.querySelector('.rm-agua');
  const rmPassos = ritual ? $$('[data-rm]', ritual) : [];

  // ---------- faixas de avaliações ----------
  const faixas = $$('[data-faixa]').map(el => ({ el, dir: +el.dataset.faixa, trilho: el.querySelector('.av-trilho'), x: 0 }));
  let ultimoY = scrollY, vel = 0;

  const passo = agora => {
    const t = reduz ? 0 : agora / 1000;
    if (enche) {
      const p = progressoFixo(enche);
      const n = palavras.length, quantas = Math.round(clamp(p / 0.8) * n);
      palavras.forEach((w, i) => w.classList.toggle('on', i < quantas));
      const nivel = 1000 - clamp(p / 0.95) * 760;
      emA.setAttribute('d', crista(1440, nivel, 22, t * 1.2, 2));
      emB.setAttribute('d', crista(1440, nivel + 26, 16, -t * 0.9 + 1, 3));
    }
    ams.forEach(({ el, path }) => {
      const k = reduz ? 1 : passagem(el, 1.05, 0.4);
      el.style.setProperty('--k', k.toFixed(3));
      path.setAttribute('d', crista(400, 20, k < 1 ? 7 : 3, t * 2 + el.offsetLeft * 0.01, 1.5, 40));
    });
    if (ritual) {
      const k = reduz ? 1 : passagem(ritual, 0.9, 0.25);
      rmAgua.style.strokeDashoffset = (1 - k).toFixed(3);
      rmPassos.forEach((li, i) => li.classList.toggle('on', k >= i / rmPassos.length + 0.08));
    }
    if (faixas.length) {
      const dy = scrollY - ultimoY; ultimoY = scrollY;
      vel += (dy - vel) * 0.1;
      faixas.forEach(f => {
        const meio = f.trilho.scrollWidth / 2;
        if (!meio) return;
        f.x -= f.dir * ((reduz ? 0 : 0.35) + Math.abs(vel) * 0.25);
        f.x = ((f.x % meio) + meio) % meio;
        f.trilho.style.transform = `translate3d(${(-f.x).toFixed(1)}px,0,0)`;
      });
    }
    requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
})();
