/* Pistão Auto Center: dados da loja (produtos, agendamentos e reservas) guardados no navegador.
   Usado pelo site (vitrine e formulários) e pelo painel do dono. Sem bibliotecas.
   Num site de verdade estas funções passam a chamar um servidor; o resto do código não muda. */
window.PistaoLoja = (() => {
  const S = /*SEMENTE*/;
  const K = { produtos: 'pistao-produtos', agenda: 'pistao-agendamentos', senha: 'pistao-painel-senha' };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const ler = (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } };
  // devolve false quando o navegador recusa (sem espaço ou armazenamento bloqueado)
  const gravar = (k, v) => {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return false; }
    try { window.dispatchEvent(new CustomEvent('pistao-loja', { detail: k })); } catch (e) { /* navegador antigo */ }
    return true;
  };
  const apaga = (k) => { try { localStorage.removeItem(k); } catch (e) { /* nada a apagar */ } };
  const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

  const L = {
    chaves: K,
    categorias: S.categorias,
    painel: S.painel,
    whatsapp: S.whatsapp,

    produtos: () => (ler(K.produtos) || clone(S.produtos)).map((p) => ({ ...p, preco: num(p.preco), de: p.de ? num(p.de) : null, estoque: Math.max(0, Math.round(num(p.estoque))) })),
    salvaProdutos: (lista) => gravar(K.produtos, lista),
    restauraProdutos: () => { apaga(K.produtos); window.dispatchEvent(new CustomEvent('pistao-loja', { detail: K.produtos })); return clone(S.produtos); },
    // só o que está marcado para a vitrine, com os destaques primeiro
    vitrine: () => L.produtos().filter((p) => p.vitrine !== false).sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0)),

    agendamentos: () => ler(K.agenda) || clone(S.agendamentosExemplo),
    salvaAgendamentos: (lista) => gravar(K.agenda, lista),
    novoAgendamento: (dados) => {
      const lista = L.agendamentos();
      lista.unshift({ id: 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), recebido: new Date().toISOString(), status: 'novo', ...dados });
      return L.salvaAgendamentos(lista.slice(0, 300));
    },

    preco: (n) => num(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    // foto salva pelo painel (data:) ou nome de uma foto do modelo; base = caminho até a raiz do site
    foto: (f, base = '') => (!f ? '' : /^(data:|https?:|blob:)/.test(f) ? f : `${base}assets/img/${f}.webp`),
    situacao: (p) => (p.estoque <= 0 ? ['zero', 'Sob encomenda'] : p.estoque <= 3 ? ['baixo', 'Últimas unidades'] : ['ok', 'Em estoque']),
    desconto: (p) => (p.de && p.de > p.preco ? Math.round((1 - p.preco / p.de) * 100) : 0),
    esc: (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
  };
  return L;
})();
