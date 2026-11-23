// Login da Área do cliente: as credenciais de demonstração já vêm nos campos. Aceita também a conta criada em
// cadastro.html (guardada no navegador). Demonstração: sem servidor e sem senha de verdade protegida.
import { botoes, olhoDaSenha } from './comum.js';
import { DEMO, entrar, lerConta, sessao } from '../loja/dados.js';

if (sessao()) location.replace('./painel.html');

const form = document.querySelector('[data-entrar]');
const email = form.querySelector('[data-email]');
const senha = form.querySelector('[data-senha]');
const erro = form.querySelector('[data-erro]');
const botao = form.querySelector('button[type="submit"]');

// a conta que acabou de ser criada no cadastro tem prioridade; senão, a de demonstração
const conta = lerConta();
const veioDoCadastro = new URLSearchParams(location.search).has('novo');
email.value = veioDoCadastro && conta ? conta.email : DEMO.email;
senha.value = veioDoCadastro && conta ? conta.senha : DEMO.senha;
form.querySelector('[data-demo-email]').textContent = DEMO.email;
form.querySelector('[data-demo-senha]').textContent = DEMO.senha;

botoes();
olhoDaSenha(senha, form.querySelector('[data-olho]'));

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  erro.hidden = true;
  if (!email.value.trim() || !senha.value) {
    erro.textContent = 'Preencha o e-mail e a senha.';
    erro.hidden = false;
    return;
  }
  botao.classList.add('is-carregando');
  setTimeout(() => {
    if (entrar(email.value, senha.value)) { location.href = './painel.html'; return; }
    botao.classList.remove('is-carregando');
    erro.textContent = 'E-mail ou senha não conferem. Use o acesso de demonstração abaixo ou cadastre a barbearia.';
    erro.hidden = false;
    senha.focus();
  }, 550);
});
