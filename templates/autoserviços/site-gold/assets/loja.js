/* Pistão Auto Center: dados da loja (produtos, agendamentos e reservas) guardados no navegador.
   Usado pelo site (vitrine e formulários) e pelo painel do dono. Sem bibliotecas.
   Num site de verdade estas funções passam a chamar um servidor; o resto do código não muda. */
window.PistaoLoja = (() => {
  const S = {"categorias":["Óleos e fluidos","Pneus","Freios","Suspensão","Elétrica","Estética","Acessórios"],"produtos":[{"id":"p-oleo","nome":"Kit óleo sintético 5W30 com filtro","categoria":"Óleos e fluidos","descricao":"Quatro litros de óleo API SP e filtro de óleo original. Troca grátis se comprar aqui.","preco":219.9,"de":259.9,"estoque":18,"foto":"oleo","vitrine":true,"destaque":true},{"id":"p-pneu","nome":"Pneu 185/65 R15 linha premium","categoria":"Pneus","descricao":"Montagem, balanceamento e válvula nova inclusos. Garantia de 5 anos do fabricante.","preco":449.9,"de":499.9,"estoque":24,"foto":"pneus","vitrine":true,"destaque":true},{"id":"p-pastilha","nome":"Pastilha de freio dianteira cerâmica","categoria":"Freios","descricao":"Menos pó nas rodas e frenagem silenciosa. Medimos o disco na instalação.","preco":189.9,"de":null,"estoque":9,"foto":"freio","vitrine":true,"destaque":false},{"id":"p-amortecedor","nome":"Par de amortecedores dianteiros","categoria":"Suspensão","descricao":"Pressurizados, com kit de batente e coifa. Alinhamento 3D de cortesia na instalação.","preco":689.9,"de":790,"estoque":4,"foto":"suspensao","vitrine":true,"destaque":false},{"id":"p-bateria","nome":"Bateria 60Ah selada","categoria":"Elétrica","descricao":"Teste de alternador grátis na troca e descarte correto da bateria velha.","preco":529.9,"de":null,"estoque":2,"foto":"diagnostico","vitrine":true,"destaque":false},{"id":"p-led","nome":"Par de lâmpadas LED para farol H4","categoria":"Elétrica","descricao":"Luz branca de 6.000 K, foco regulado na instalação para não ofuscar quem vem.","preco":159.9,"de":199.9,"estoque":12,"foto":"lanterna","vitrine":true,"destaque":false},{"id":"p-vitrificador","nome":"Kit vitrificador de pintura","categoria":"Estética","descricao":"O mesmo produto que usamos na oficina, com aplicador e flanelas de microfibra.","preco":289.9,"de":null,"estoque":0,"foto":"estetica","vitrine":true,"destaque":false},{"id":"p-chaves","nome":"Jogo de chaves combinadas com 12 peças","categoria":"Acessórios","descricao":"Aço cromo vanádio, de 8 a 19 mm, com estojo. Bom para deixar no porta-malas.","preco":239.9,"de":null,"estoque":6,"foto":"ferramentas","vitrine":true,"destaque":false}],"agendamentosExemplo":[{"id":"a-ex1","tipo":"Agendamento","recebido":"2026-11-14T09:12:00","status":"novo","nome":"Larissa Mendes","fone":"(31) 9 8811-2233","carro":"Chevrolet Onix 2020","servico":"Pacote Revisão completa","data":"2026-11-18","periodo":"Manhã","msg":"Está chegando nos 40 mil km."},{"id":"a-ex2","tipo":"Reserva","recebido":"2026-11-13T16:40:00","status":"confirmado","nome":"Fernando Lima","fone":"(31) 9 9722-4410","produto":"Pneu 185/65 R15 linha premium","quantidade":4,"preco":449.9,"entrega":"Instalar na oficina"},{"id":"a-ex3","tipo":"Agendamento","recebido":"2026-11-12T11:05:00","status":"concluido","nome":"Patrícia Alves","fone":"(31) 9 9105-7788","carro":"Hyundai HB20 2021","servico":"Injeção e elétrica","data":"2026-11-12","periodo":"Tarde","msg":"Luz da injeção acesa de novo."}],"painel":{"dono":"Carlos","email":"dono@pistaoauto.com.br","senha":"pistao2026"},"whatsapp":"5531999990000"};
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
