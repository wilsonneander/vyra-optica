/* Dados da loja compartilhados entre o site e a Área do Cliente: catálogo, categorias e horário.
   Demonstração sem servidor: o padrão vem embutido na página (#dados) e o que a loja publica
   no painel fica salvo no navegador (localStorage). Para um cliente de verdade, trocar ler/gravar
   por chamadas à API da loja. */
(function () {
  'use strict';
  const CHAVE_PUB = 'tampinha-gold-publicado';
  const CHAVE_RAS = 'tampinha-gold-rascunho';
  const el = document.getElementById('dados');
  const base = JSON.parse(el.textContent);

  const ler = (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } };
  const gravar = (k, v) => {
    try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  };
  const copia = (o) => JSON.parse(JSON.stringify(o));
  const padrao = () => ({ categorias: copia(base.categorias), produtos: copia(base.produtos), abertura: copia(base.abertura), publicadoEm: null });

  const Loja = {
    base,
    CHAVE_PUB,
    // o que o site mostra
    publicado() { return ler(CHAVE_PUB) || padrao(); },
    temPublicado() { return !!ler(CHAVE_PUB); },
    // o que o painel está editando (começa igual ao publicado)
    rascunho() { return ler(CHAVE_RAS) || Loja.publicado(); },
    salvarRascunho(d) { return gravar(CHAVE_RAS, d); },
    temRascunho() { return !!ler(CHAVE_RAS); },
    descartar() { gravar(CHAVE_RAS, null); },
    publicar() {
      const d = Loja.rascunho();
      d.publicadoEm = new Date().toISOString();
      const ok = gravar(CHAVE_PUB, d);
      if (ok) gravar(CHAVE_RAS, null);
      return ok;
    },
    restaurar() { gravar(CHAVE_PUB, null); gravar(CHAVE_RAS, null); },
    visiveis(d) { return d.produtos.filter((p) => !p.oculto && d.categorias.some((c) => c.id === p.cat)); },
    foto(p) { return p.fotoData || p.img || ''; },
    real(v) { return 'R$ ' + Number(v || 0).toFixed(2).replace('.', ','); },
    numero(t) {
      if (t == null || t === '') return null;
      const n = parseFloat(String(t).replace(/[^\d,.]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.'));
      return isFinite(n) ? Math.round(n * 100) / 100 : NaN;
    },
    slug(t) { return String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item'; },
    semAcento(t) { return String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); },
    esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); },
  };
  window.Loja = Loja;
})();
