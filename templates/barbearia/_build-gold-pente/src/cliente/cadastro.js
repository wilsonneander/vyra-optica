// Cadastro do dono: valida, guarda a conta no navegador, leva o nome e o WhatsApp para os dados da loja e entra.
import { botoes, olhoDaSenha, mascara } from './comum.js';
import { salvarConta, entrar, ler, salvar } from '../loja/dados.js';

const form = document.querySelector('[data-cadastro]');
const erroGeral = form.querySelector('[data-erro]');
const botao = form.querySelector('button[type="submit"]');
const campo = (n) => form.elements[n];
botoes();
olhoDaSenha(campo('senha'), form.querySelector('[data-olho]'));

campo('documento').addEventListener('input', (e) => { e.target.value = mascara.documento(e.target.value); });
campo('whatsapp').addEventListener('input', (e) => { e.target.value = mascara.fone(e.target.value); });

const REGRAS = {
  nome: (v) => (v.trim().split(/\s+/).length >= 2 ? '' : 'Escreva nome e sobrenome.'),
  barbearia: (v) => (v.trim().length >= 2 ? '' : 'Qual é o nome da barbearia?'),
  documento: (v) => ([11, 14].includes(v.replace(/\D/g, '').length) ? '' : 'CPF com 11 números ou CNPJ com 14.'),
  whatsapp: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'WhatsApp com DDD.'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'E-mail inválido.'),
  senha: (v) => (v.length >= 8 ? '' : 'Use 8 caracteres ou mais.'),
  senha2: (v) => (v === campo('senha').value ? '' : 'As senhas não são iguais.'),
};

function checa(nome) {
  const input = campo(nome);
  const msg = REGRAS[nome](input.value);
  const rotulo = input.closest('.campo');
  rotulo.classList.toggle('is-erro', !!msg);
  rotulo.querySelector('.campo__erro').textContent = msg;
  return !msg;
}
for (const nome of Object.keys(REGRAS)) {
  campo(nome).addEventListener('blur', () => { if (campo(nome).value) checa(nome); });
  campo(nome).addEventListener('input', () => { if (campo(nome).closest('.campo').classList.contains('is-erro')) checa(nome); });
}

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  erroGeral.hidden = true;
  const ok = Object.keys(REGRAS).map(checa).every(Boolean);
  if (!ok) { form.querySelector('.is-erro input')?.focus(); return; }
  if (!campo('aceite').checked) { erroGeral.textContent = 'Para criar a conta, aceite os termos.'; erroGeral.hidden = false; return; }
  botao.classList.add('is-carregando');
  const conta = {
    nome: campo('nome').value.trim(),
    barbearia: campo('barbearia').value.trim(),
    documento: campo('documento').value,
    whatsapp: campo('whatsapp').value,
    email: campo('email').value.trim().toLowerCase(),
    senha: campo('senha').value,
    criadaEm: new Date().toISOString(),
  };
  setTimeout(() => {
    salvarConta(conta);
    // o nome e o WhatsApp vão para os dados da loja (o painel edita o resto)
    const dados = ler();
    dados.loja.razao = conta.barbearia;
    dados.loja.whatsapp = conta.whatsapp;
    salvar(dados);
    entrar(conta.email, conta.senha);
    location.href = './painel.html?bemvindo';
  }, 700);
});
