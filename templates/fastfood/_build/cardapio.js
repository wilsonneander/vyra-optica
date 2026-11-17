/* Cardápio compartilhado entre o site e a Área do Cliente.
   Demonstração sem servidor: o padrão vem embutido na página (#dados) e o que a loja
   publica no painel fica salvo no navegador (localStorage). Num cliente de verdade,
   trocar ler/gravar por chamadas à API da loja. */
(function () {
  'use strict';
  const CHAVE_PUB = 'monta-cardapio-publicado';
  const CHAVE_RAS = 'monta-cardapio-rascunho';
  const base = JSON.parse(document.getElementById('dados').textContent);

  const ler = (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } };
  const gravar = (k, v) => {
    try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  };
  const copia = (o) => JSON.parse(JSON.stringify(o));
  const padrao = () => ({ categorias: copia(base.categorias), produtos: copia(base.produtos), publicadoEm: null });

  const Cardapio = {
    base,
    // o que o site mostra
    publicado() { return ler(CHAVE_PUB) || padrao(); },
    // o que o painel está editando (começa igual ao publicado)
    rascunho() { return ler(CHAVE_RAS) || Cardapio.publicado(); },
    salvarRascunho(d) { return gravar(CHAVE_RAS, d); },
    temRascunho() { return !!ler(CHAVE_RAS); },
    descartar() { gravar(CHAVE_RAS, null); },
    publicar() {
      const d = Cardapio.rascunho();
      d.publicadoEm = new Date().toISOString();
      const ok = gravar(CHAVE_PUB, d);
      if (ok) gravar(CHAVE_RAS, null);
      return ok;
    },
    restaurar() { gravar(CHAVE_PUB, null); gravar(CHAVE_RAS, null); },
    // produtos visíveis no site, agrupados na ordem das categorias
    visiveis(d) { return d.produtos.filter((p) => !p.oculto && d.categorias.some((c) => c.id === p.cat)); },
    foto(p) { return p.fotoData || (p.foto ? `assets/img/${p.foto}.webp` : ''); },
    real(v) { return 'R$ ' + Number(v || 0).toFixed(2).replace('.', ','); },
    numero(t) {
      if (t == null || t === '') return null;
      const n = parseFloat(String(t).replace(/[^\d,.]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.'));
      return isFinite(n) ? Math.round(n * 100) / 100 : NaN;
    },
    slug(t) {
      return String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
    },
    semAcento(t) { return String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); },
    esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); },
    // aberto agora? horário de Brasília
    agora() {
      const f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      const g = (t) => f.find((x) => x.type === t).value;
      const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday'));
      const h = (parseInt(g('hour'), 10) % 24) + parseInt(g('minute'), 10) / 60;
      return { dia, h };
    },
    status() {
      const H = base.horarios; const { dia, h } = Cardapio.agora();
      const fmt = (x) => { const hh = Math.floor(x) % 24, mm = Math.round((x % 1) * 60); return hh === 0 && x >= 24 ? 'meia-noite' : `${hh}h${mm ? String(mm).padStart(2, '0') : ''}`; };
      const hoje = H[dia];
      if (hoje && h >= hoje[0] && h < hoje[1]) return { aberto: true, txt: `Chapa ligada agora, até ${fmt(hoje[1])}` };
      const nomes = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
      if (hoje && h < hoje[0]) return { aberto: false, txt: `Chapa desligada. Liga hoje às ${fmt(hoje[0])}` };
      for (let i = 1; i <= 7; i++) {
        const d = (dia + i) % 7;
        if (H[d]) return { aberto: false, txt: `Chapa desligada. Liga ${i === 1 ? 'amanhã' : nomes[d]} às ${fmt(H[d][0])}` };
      }
      return { aberto: false, txt: 'Fechado' };
    },
  };
  window.Cardapio = Cardapio;
})();
