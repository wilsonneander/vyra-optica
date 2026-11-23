// Os dados da loja que a Área do cliente edita e o site lê: informações e horário da casa, serviços, barbeiros e
// produtos. Demonstração: tudo fica no navegador (localStorage), sem servidor. Para valer, troque ler/salvar por
// chamadas a uma API e o login por uma autenticação de verdade.
//
// Regra: enquanto o painel não salvar nada, o site mostra o próprio HTML (estes padrões são a cópia dele).

const CHAVE_LOJA = 'pentefino:loja:v1';
const CHAVE_CONTA = 'pentefino:conta:v1';
const CHAVE_SESSAO = 'pentefino:sessao:v1';

// credenciais de demonstração (já vêm preenchidas no login)
export const DEMO = { email: 'dono@pentefino.com.br', senha: 'pentefino123', nome: 'Marcelo Andrade' };

export const FERRAMENTAS = [
  ['maquina', 'Máquina'], ['aparador', 'Aparador'], ['tesoura', 'Tesoura'],
  ['navalha', 'Navalha'], ['pente', 'Pente'], ['pincel', 'Pincel de barba'],
];
export const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const PADRAO = {
  loja: {
    nome: 'Pente Fino',
    razao: 'Pente Fino Barbearia',
    endereco: 'Rua São Clemente, 240',
    bairro: 'Botafogo',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    referencia: 'A duas quadras do metrô Botafogo',
    estacionamento: 'Estacionamento conveniado na esquina',
    whatsapp: '(00) 90000-0142',
    instagram: '@pentefino',
    semHora: 'Sem hora marcada até as 18h',
  },
  // por dia da semana (0 = domingo): aberto e o horário "HH:MM"
  horario: [
    { aberto: true, abre: '10:00', fecha: '16:00' },
    { aberto: true, abre: '09:00', fecha: '21:00' },
    { aberto: true, abre: '09:00', fecha: '21:00' },
    { aberto: true, abre: '09:00', fecha: '21:00' },
    { aberto: true, abre: '09:00', fecha: '21:00' },
    { aberto: true, abre: '09:00', fecha: '21:00' },
    { aberto: true, abre: '09:00', fecha: '20:00' },
  ],
  servicos: [
    { id: 's0', nome: 'Degradê', desc: 'zero embaixo, esfumado até a altura que você quiser em cima', min: 45, preco: 60, ferramenta: 'maquina', ativo: true },
    { id: 's1', nome: 'Disfarçado', desc: 'nuca e costeleta limpas, o comprimento fica dos lados', min: 40, preco: 55, ferramenta: 'aparador', ativo: true },
    { id: 's2', nome: 'Na tesoura', desc: 'só tesoura, para cabelo mais comprido que precisa de movimento', min: 50, preco: 70, ferramenta: 'tesoura', ativo: true },
    { id: 's3', nome: 'Pezinho e contorno', desc: 'nuca e contorno na navalha entre um corte e outro', min: 20, preco: 30, ferramenta: 'navalha', ativo: true },
    { id: 's4', nome: 'Barba desenhada', desc: 'desenho, linha e toalha quente no fim', min: 25, preco: 40, ferramenta: 'pente', ativo: true },
    { id: 's5', nome: 'Barba na toalha quente', desc: 'duas toalhas, espuma morna e uma navalha', min: 40, preco: 50, ferramenta: 'pincel', ativo: true },
    { id: 's6', nome: 'Corte e barba', desc: 'o degradê e a barba na mesma cadeira', min: 70, preco: 95, ferramenta: 'aparador', ativo: true },
  ],
  barbeiros: [
    { id: 'b0', nome: 'Caio', especialidade: 'Degradê e disfarçado', anos: 9, foto: 'img/espelho-1.webp', alt: 'Caio passando a máquina na nuca de um cliente', ativo: true },
    { id: 'b1', nome: 'Renan', especialidade: 'Desenho e contorno', anos: 6, foto: 'img/espelho-2.webp', alt: 'Renan acertando o degradê com o aparador', ativo: true },
    { id: 'b2', nome: 'Toninho', especialidade: 'Tesoura e navalha', anos: 31, foto: 'img/espelho-3.webp', alt: 'Seu Toninho aparando a barba na tesoura', ativo: true },
    { id: 'b3', nome: 'Davi', especialidade: 'Barba e toalha quente', anos: 11, foto: 'img/espelho-4.webp', alt: 'Davi fazendo a barba na navalha com toalha quente', ativo: true },
  ],
  produtos: [
    { id: 'p0', nome: 'Pomada matte', det: '100 g', preco: 59, foto: 'img/produtos/pomada.webp', alt: 'Pote de pomada matte', ativo: true },
    { id: 'p1', nome: 'Óleo para barba', det: '30 ml', preco: 49, foto: 'img/produtos/oleo.webp', alt: 'Frasco de óleo para barba com conta-gotas', ativo: true },
    { id: 'p2', nome: 'Shampoo de barbearia', det: '300 ml', preco: 45, foto: 'img/produtos/shampoo.webp', alt: 'Frasco de shampoo com válvula', ativo: true },
    { id: 'p3', nome: 'Shampoo e condicionador', det: 'kit', preco: 89, foto: 'img/produtos/kit.webp', alt: 'Kit de shampoo e condicionador', ativo: true },
  ],
};

const copia = (o) => JSON.parse(JSON.stringify(o));
const lerJSON = (chave, store = localStorage) => { try { return JSON.parse(store.getItem(chave)); } catch { return null; } };
const gravar = (chave, valor, store = localStorage) => { try { store.setItem(chave, JSON.stringify(valor)); return true; } catch { return false; } };

/** Os dados salvos pelo painel, ou null se o painel nunca salvou (o site fica com o HTML). */
export function lerSalvo() { return lerJSON(CHAVE_LOJA); }
/** Os dados para editar: os salvos ou uma cópia dos padrões. */
export function ler() {
  const s = lerSalvo();
  if (!s) return copia(PADRAO);
  // completa campos que versões novas acrescentarem
  return { ...copia(PADRAO), ...s, loja: { ...PADRAO.loja, ...s.loja } };
}
/** Grava; devolve false quando o navegador recusa (cota cheia, por exemplo fotos grandes demais). */
export function salvar(dados) { return gravar(CHAVE_LOJA, dados); }
export function restaurar() { try { localStorage.removeItem(CHAVE_LOJA); } catch { /* sem armazenamento */ } }

export const novoId = (prefixo) => `${prefixo}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** "09:30" -> 9.5 (o horário.js e a agenda trabalham em horas). */
export const horas = (hhmm) => { const [h, m = 0] = String(hhmm).split(':').map(Number); return h + m / 60; };
/** 9.5 -> "9h30"; 21 -> "21h". */
export const rotuloHora = (h) => { const m = Math.round((h % 1) * 60); return `${Math.floor(h)}h${m ? String(m).padStart(2, '0') : ''}`; };

/** Resolve a foto: caminho do site (img/...) relativo à página, ou data: URL enviada pelo painel. */
export const foto = (src) => (!src || /^(data:|https?:|\/)/.test(src) ? src : `./${src}`);

/* ---------- conta do dono e sessão ---------- */
export function lerConta() { return lerJSON(CHAVE_CONTA); }
export function salvarConta(conta) { return gravar(CHAVE_CONTA, conta); }

export function entrar(email, senha) {
  const conta = lerConta();
  const e = String(email).trim().toLowerCase();
  const ok = (conta && conta.email.toLowerCase() === e && conta.senha === senha) || (e === DEMO.email && senha === DEMO.senha);
  if (!ok) return false;
  const nome = conta && conta.email.toLowerCase() === e ? conta.nome : DEMO.nome;
  gravar(CHAVE_SESSAO, { email: e, nome, desde: Date.now() }, sessionStorage);
  return true;
}
export function sessao() { return lerJSON(CHAVE_SESSAO, sessionStorage); }
export function sair() { try { sessionStorage.removeItem(CHAVE_SESSAO); } catch { /* nada */ } }
