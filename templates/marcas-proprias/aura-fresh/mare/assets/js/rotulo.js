/* AURA Fresh, desenho do rótulo do pote num <canvas> (sem three.js).
   O mesmo desenho veste o pote 3D (produto e clube) e aparece aberto e plano no guia.
   A folha dá a volta inteira no pote: frente no meio, composição à esquerda, modo de uso e advertências à direita.
   Os textos de rótulo vêm de window.AURA_ROTULO (gerado no build a partir de _build/dados.js). */
(function () {
  'use strict';
  // medidas do pote (raio 1): a folha cobre do pé até perto da borda da tampa
  const Y0 = 0.05, Y1 = 2.07, H = Y1 - Y0;
  const RAIO = 1.006, C = Math.PI * 2 * RAIO;
  const LW = 3072, LH = Math.round(LW * H / C);
  const CORTE_Y = 1.275;                       // fenda entre corpo e tampa
  const CORTE = LH * (1 - (CORTE_Y - Y0) / H); // em px do canvas, medido de cima

  const VERDE = '#22392a', VERDE2 = '#1b2f22', LIMA = '#c4d997', ROSA = '#f0c6d7', BRANCO = '#eef1e6';
  const FT = '"Inter Tight"', FS = '"DM Sans"';
  const pontos = {};
  const imgs = {};

  function carrega(base) {
    const um = (k, src) => new Promise(ok => { const i = new Image(); i.onload = () => { imgs[k] = i; ok(); }; i.onerror = () => ok(); i.src = base + src; });
    const fontes = document.fonts ? Promise.all([
      document.fonts.load(`800 80px ${FT}`), document.fonts.load(`600 40px ${FT}`), document.fonts.load(`500 30px ${FS}`), document.fonts.load(`700 30px ${FS}`),
    ]).catch(() => {}) : Promise.resolve();
    return Promise.all([um('aura', 'logo-aura.png'), um('fresh', 'logo-fresh.png'), fontes]);
  }

  // pinta o logo branco numa cor (o PNG é branco com transparência)
  function logoCor(img, cor) {
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    g.globalCompositeOperation = 'source-in'; g.fillStyle = cor; g.fillRect(0, 0, c.width, c.height);
    return c;
  }
  function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function f(g, peso, px, fam) { g.font = `${peso} ${px}px ${fam}, sans-serif`; }
  function quebra(g, txt, larg) {
    const pal = txt.split(' '), linhas = []; let l = '';
    pal.forEach(p => { const t = l ? l + ' ' + p : p; if (g.measureText(t).width > larg && l) { linhas.push(l); l = p; } else l = t; });
    if (l) linhas.push(l); return linhas;
  }
  function pilula(g, x, y, w, h, cor) {
    const r = h / 2; g.fillStyle = cor; g.beginPath();
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2); g.lineTo(x + r, y + h); g.arc(x + r, y + r, r, Math.PI / 2, Math.PI * 1.5); g.fill();
  }

  function desenha() {
    const D = window.AURA_ROTULO;
    const c = document.createElement('canvas'); c.width = LW; c.height = LH;
    const g = c.getContext('2d');
    // fundo verde fosco com variação leve, como impressão em pote soft touch
    g.fillStyle = VERDE; g.fillRect(0, 0, LW, LH);
    const vg = g.createLinearGradient(0, 0, 0, LH);
    vg.addColorStop(0, 'rgba(255,255,255,.035)'); vg.addColorStop(0.5, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.07)');
    g.fillStyle = vg; g.fillRect(0, 0, LW, LH);
    const r = rng(5);
    for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${r() > 0.5 ? '255,255,255' : '0,0,0'},${0.012 + r() * 0.03})`; g.fillRect(r() * LW, r() * LH, 1.5, 1.5); }

    // fenda entre corpo e tampa
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, CORTE - 3, LW, 6);

    // ---------- frente (centro) ----------
    const cx = LW * 0.5, fx = cx - 380; // margem esquerda do bloco da frente
    // logo na tampa: "aura" grande em lima e "FRESH" ao lado, como no pote
    if (imgs.aura) {
      const a = logoCor(imgs.aura, LIMA), fr = logoCor(imgs.fresh, LIMA);
      const h = CORTE * 0.5, w = a.width * h / a.height;
      const hf = h * 0.36, wf = fr.width * hf / fr.height;
      const total = w + 14 + wf, x0 = cx - total / 2, y0 = CORTE * 0.27;
      g.drawImage(a, x0, y0, w, h);
      g.drawImage(fr, x0 + w + 14, y0 + h - hf - h * 0.04, wf, hf);
      pontos.marca = [x0 + w * 0.5, y0 + h * 0.5];
    }
    // bloco de informações do corpo
    let y = CORTE + 92;
    g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    g.fillStyle = BRANCO; f(g, 700, 50, FT); g.fillText(D.linha, fx, y);
    g.fillStyle = 'rgba(238,241,230,.72)'; f(g, 500, 36, FS); g.fillText(D.sub, fx, y + 46);
    // pílula rosa com os três ativos
    f(g, 700, 30, FS); const ptxt = 'CLOROFILA + MENTA + SALSA'; const pw = g.measureText(ptxt).width + 70;
    pilula(g, fx, y + 78, pw, 54, ROSA); g.fillStyle = '#3d2430'; g.fillText(ptxt, fx + 35, y + 116);
    g.fillStyle = LIMA; f(g, 800, 36, FT); g.fillText(D.tipo.toUpperCase(), fx, y + 190);
    g.fillStyle = 'rgba(238,241,230,.6)'; f(g, 500, 24, FS); g.fillText(D.aroma, fx, y + 224);
    g.fillStyle = 'rgba(238,241,230,.7)'; f(g, 500, 24, FS); g.fillText('Sabor', fx, y + 290);
    g.fillStyle = BRANCO; f(g, 700, 34, FS); g.fillText(D.sabor.toUpperCase(), fx, y + 328);

    // caixa "contém 30 porções", uso oral e peso
    const bx = cx + 250, by = y + 70, bw = 118, bh = 132;
    g.strokeStyle = LIMA; g.lineWidth = 4; g.strokeRect(bx, by, bw, bh);
    g.fillStyle = LIMA; g.textAlign = 'center';
    f(g, 600, 20, FS); g.fillText('Contém', bx + bw / 2, by + 30);
    f(g, 800, 60, FT); g.fillText(String(D.porcoes), bx + bw / 2, by + 88);
    f(g, 600, 18, FS); g.fillText('PORÇÕES', bx + bw / 2, by + 116);
    pontos.porcoes = [bx + bw / 2, by + bh / 2];
    g.textAlign = 'right'; f(g, 600, 22, FS); g.fillStyle = 'rgba(238,241,230,.75)'; g.fillText('USO ORAL', bx + bw, by + bh + 46);
    f(g, 500, 20, FS); g.fillText('PESO LÍQUIDO', bx + bw - 92, y + 328); f(g, 800, 46, FT); g.fillStyle = BRANCO; g.fillText(D.peso.replace(' ', ''), bx + bw, y + 328);

    // ---------- verso esquerdo: composição ----------
    const tx = LW * 0.115, ty = 120, tw = 560, th = LH - 220;
    g.fillStyle = '#f4f6ee'; g.fillRect(tx, ty, tw, th);
    g.fillStyle = '#1b2a1e'; g.textAlign = 'left';
    f(g, 800, 38, FT); g.fillText('Composição', tx + 30, ty + 62);
    f(g, 500, 23, FS); g.fillText('Porção de ' + D.porcao, tx + 30, ty + 98);
    g.fillRect(tx + 30, ty + 118, tw - 60, 10);
    const linhas = D.composicao.map(c => [c.nome, c.qtd]).concat([['Porções por embalagem', String(D.porcoes)]]);
    linhas.forEach((l, i) => {
      const ly = ty + 186 + i * 66;
      f(g, 600, 25, FS); g.textAlign = 'left'; g.fillText(l[0], tx + 30, ly);
      f(g, 800, 27, FT); g.textAlign = 'right'; g.fillText(l[1], tx + tw - 30, ly);
      g.fillRect(tx + 30, ly + 22, tw - 60, 2);
      const chave = ['clorofila', 'salsa', 'hortela', 'doses'][i];
      pontos[chave] = [tx + tw - 22, ly - 10];
    });
    f(g, 500, 18, FS); g.textAlign = 'left'; g.fillStyle = '#5a6658';
    g.fillText('CONFERIR COM O RÓTULO APROVADO.', tx + 30, ty + th - 58);
    g.fillText('DEMAIS INGREDIENTES NA EMBALAGEM.', tx + 30, ty + th - 30);

    // ---------- verso direito: modo de uso, advertências e código de barras ----------
    const rx = LW * 0.685, rw = 540;
    g.textAlign = 'left'; g.fillStyle = LIMA; f(g, 800, 34, FT); g.fillText('MODO DE USO', rx, 150);
    pontos.uso = [rx + 6, 140];
    g.fillStyle = BRANCO; f(g, 500, 25, FS);
    let yy = 196; quebra(g, D.uso, rw).forEach(l => { g.fillText(l, rx, yy); yy += 34; });
    yy += 34; g.fillStyle = ROSA; f(g, 800, 30, FT); g.fillText('ADVERTÊNCIAS', rx, yy);
    pontos.advertencias = [rx + 6, yy - 10];
    yy += 40; g.fillStyle = 'rgba(238,241,230,.82)'; f(g, 500, 21, FS);
    D.advertencias.slice(0, 3).forEach(a => { quebra(g, a, rw).forEach(l => { if (yy < LH - 40) { g.fillText(l, rx, yy); yy += 28; } }); yy += 8; });

    // código de barras e SAC
    const cbx = LW * 0.895, cby = 140, cbw = 130, cbh = 280;
    g.fillStyle = '#f4f6ee'; g.fillRect(cbx, cby, cbw, cbh);
    const rb = rng(17); g.fillStyle = '#111';
    for (let yb = cby + 20; yb < cby + cbh - 46;) { const h = 2 + Math.floor(rb() * 8); g.fillRect(cbx + 20, yb, cbw - 40, h); yb += h + 2 + Math.floor(rb() * 7); }
    f(g, 600, 12, FS); g.fillText('EAN [preencher]', cbx + 14, cby + cbh - 16);
    g.save(); g.translate(LW * 0.975, 110); g.rotate(Math.PI / 2);
    f(g, 600, 21, FS); g.fillStyle = 'rgba(238,241,230,.6)'; g.textAlign = 'left';
    g.fillText(D.razao + '   CNPJ ' + D.cnpj + '   SAC ' + D.email, 0, 0);
    g.restore();
    g.save(); g.translate(LW * 0.04, LH - 110); g.rotate(-Math.PI / 2);
    f(g, 700, 26, FT); g.fillStyle = 'rgba(196,217,151,.75)'; g.textAlign = 'left';
    g.fillText('O CUIDADO COMEÇA POR DENTRO', 0, 0);
    g.restore();
    return c;
  }

  // tampa vista de cima: lima com o logo em verde e o texto em volta
  function desenhaTampa() {
    const S = 1024, c = document.createElement('canvas'); c.width = c.height = S;
    const g = c.getContext('2d');
    g.fillStyle = LIMA; g.fillRect(0, 0, S, S);
    const rg = g.createRadialGradient(S / 2, S / 2, S * 0.1, S / 2, S / 2, S * 0.5);
    rg.addColorStop(0, 'rgba(255,255,255,.12)'); rg.addColorStop(1, 'rgba(0,0,0,.08)');
    g.fillStyle = rg; g.fillRect(0, 0, S, S);
    if (imgs.aura) {
      const a = logoCor(imgs.aura, VERDE2), w = S * 0.5, h = a.height * w / a.width;
      g.drawImage(a, S / 2 - w / 2, S / 2 - h * 0.7, w, h);
      const fr = logoCor(imgs.fresh, VERDE2), wf = w * 0.42, hf = fr.height * wf / fr.width;
      g.drawImage(fr, S / 2 - wf / 2, S / 2 + h * 0.45, wf, hf);
    }
    // texto circular
    const txt = 'INNER FRESHNESS COMPLEX     DAILY BLEND     CLOROFILA, MENTA E SALSA     ';
    g.fillStyle = VERDE2; f(g, 700, 30, FS); g.textAlign = 'center'; g.textBaseline = 'middle';
    const R = S * 0.37; let ang = -Math.PI / 2; const total = g.measureText(txt).width; const k = (Math.PI * 2 * R) / total;
    for (const ch of txt) {
      const w = g.measureText(ch).width * k; ang += w / 2 / R;
      g.save(); g.translate(S / 2 + Math.cos(ang) * R, S / 2 + Math.sin(ang) * R); g.rotate(ang + Math.PI / 2); g.fillText(ch, 0, 0); g.restore();
      ang += w / 2 / R;
    }
    g.strokeStyle = 'rgba(27,47,34,.25)'; g.lineWidth = 3; g.beginPath(); g.arc(S / 2, S / 2, S * 0.455, 0, Math.PI * 2); g.stroke();
    return c;
  }

  window.AuraRotulo = { LW, LH, Y0, Y1, H, RAIO, C, CORTE, CORTE_Y, pontos, carrega, desenha, desenhaTampa };
})();
