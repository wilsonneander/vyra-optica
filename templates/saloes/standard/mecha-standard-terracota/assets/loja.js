// Os dados que a Área do cliente edita e o site lê: empresa, horário, serviços, equipe e produtos.
// Demonstração: tudo fica no navegador (localStorage), sem servidor. Para valer, troque ler/salvar por
// chamadas a uma API e o login por uma autenticação de verdade (senha com hash no servidor).
// Regra: enquanto o painel não salvar nada, o site mostra o próprio HTML gerado pelo build.
(function () {
  const CH = { loja: 'mecha-salao-silver:loja:v1', conta: 'mecha-salao-silver:conta:v1', sessao: 'mecha-salao-silver:sessao:v1' };
  let D = {};
  try { D = JSON.parse(document.getElementById('dados').textContent); } catch (e) { /* página sem dados */ }
  const copia = (o) => JSON.parse(JSON.stringify(o));
  const lerJSON = (k, st) => { try { return JSON.parse((st || localStorage).getItem(k)); } catch (e) { return null; } };
  const gravar = (k, v, st) => { try { (st || localStorage).setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const tira = (k, st) => { try { (st || localStorage).removeItem(k); } catch (e) { /* sem armazenamento */ } };

  /** Os dados salvos pelo painel, ou null se ele nunca salvou. */
  const lerSalvo = () => lerJSON(CH.loja);
  /** Os dados em uso: os salvos completados pelos padrões, ou uma cópia dos padrões. */
  const ler = () => {
    const p = copia(D.padrao || {});
    const s = lerSalvo();
    if (!s) return p;
    return {
      ...p, ...s,
      empresa: { ...p.empresa, ...(s.empresa || {}) },
      horario: Array.isArray(s.horario) && s.horario.length === 7 ? s.horario : p.horario,
      segmentos: p.segmentos, // os segmentos são fixos do modelo
    };
  };
  const salvar = (dados) => gravar(CH.loja, { ...dados, salvoEm: Date.now() });
  const restaurar = () => tira(CH.loja);
  const novoId = (pre) => `${pre}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  // conta do dono e sessão (sessionStorage: sai ao fechar o navegador)
  const DEMO = D.demo || {};
  const lerConta = () => lerJSON(CH.conta);
  const salvarConta = (c) => gravar(CH.conta, c);
  const entrar = (email, senha) => {
    const e = String(email || '').trim().toLowerCase();
    const conta = lerConta();
    const daConta = conta && conta.email.toLowerCase() === e && conta.senha === senha;
    const daDemo = e === DEMO.email && senha === DEMO.senha;
    if (!daConta && !daDemo) return false;
    gravar(CH.sessao, { email: e, nome: daConta ? conta.nome : DEMO.nome, desde: Date.now() }, sessionStorage);
    return true;
  };
  const sessao = () => lerJSON(CH.sessao, sessionStorage);
  const sair = () => tira(CH.sessao, sessionStorage);

  window.MechaLoja = { D, ler, lerSalvo, salvar, restaurar, novoId, DEMO, lerConta, salvarConta, entrar, sessao, sair, copia };
})();
