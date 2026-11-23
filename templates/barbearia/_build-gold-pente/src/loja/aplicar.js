// Aplica no site o que a Área do cliente salvou (serviços, barbeiros, produtos, horário e dados da casa).
// Roda no começo do main.js, antes das seções e do agendamento lerem o HTML. Sem nada salvo, não mexe em nada.
import { lerSalvo, horas, rotuloHora, foto, DIAS_CURTOS } from './dados.js';
import { HORARIO } from '../secoes/horario.js';

const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const NUMEROS = ['Nenhum', 'Um', 'Dois', 'Três', 'Quatro', 'Cinco', 'Seis', 'Sete', 'Oito', 'Nove', 'Dez'];

export function aplicarLoja() {
  const d = lerSalvo();
  if (!d) return;
  horario(d.horario);
  casa(d.loja);
  const servicos = (d.servicos || []).filter((s) => s.ativo);
  const barbeiros = (d.barbeiros || []).filter((b) => b.ativo);
  cardapio(servicos);
  espelhos(barbeiros);
  cortes(servicos, barbeiros);
  produtos((d.produtos || []).filter((p) => p.ativo));
}

/* ---------- horário: o que a agenda e o status usam, e a lista da seção de endereço ---------- */
function horario(lista) {
  if (!Array.isArray(lista) || lista.length !== 7) return;
  lista.forEach((h, i) => { HORARIO[i] = h.aberto ? [horas(h.abre), horas(h.fecha)] : null; });
  const dl = document.querySelector('.horario');
  if (!dl) return;
  // agrupa dias seguidos com o mesmo horário, na ordem da semana de quem trabalha (seg a dom)
  const ordem = [1, 2, 3, 4, 5, 6, 0];
  const igual = (a, b) => a.aberto === b.aberto && (!a.aberto || (a.abre === b.abre && a.fecha === b.fecha));
  const grupos = [];
  for (const dia of ordem) {
    const ultimo = grupos.at(-1);
    if (ultimo && igual(lista[ultimo.dias.at(-1)], lista[dia])) ultimo.dias.push(dia);
    else grupos.push({ dias: [dia] });
  }
  dl.innerHTML = grupos.map(({ dias }) => {
    const h = lista[dias[0]];
    const nome = dias.length === 1 ? DIAS_CURTOS[dias[0]] : `${DIAS_CURTOS[dias[0]]} – ${DIAS_CURTOS[dias.at(-1)].toLowerCase()}`;
    const valor = h.aberto ? `${rotuloHora(horas(h.abre))} – ${rotuloHora(horas(h.fecha))}` : 'Fechado';
    return `<div data-dias="${dias.join(',')}"><dt>${nome}</dt><dd>${valor}</dd></div>`;
  }).join('');
}

/* ---------- dados da casa: endereço, telefone, mapa e rodapé ---------- */
function casa(l) {
  if (!l) return;
  const lugar = document.querySelector('.endereco__lugar');
  const digitos = String(l.whatsapp || '').replace(/\D/g, '');
  const zap = digitos.length >= 10 ? `https://wa.me/55${digitos}` : '#endereco';
  if (lugar) {
    lugar.innerHTML = `${esc(l.endereco)} · ${esc(l.bairro)}${l.estacionamento ? `<br>${esc(l.estacionamento)}` : ''}${l.whatsapp ? `<br><a href="${zap}" class="endereco__fone"${digitos.length >= 10 ? ' target="_blank" rel="noopener"' : ''}>WhatsApp ${esc(l.whatsapp)}</a>` : ''}`;
  }
  const adesivo = document.querySelector('.endereco .adesivo');
  if (adesivo) { adesivo.textContent = l.semHora || ''; adesivo.hidden = !l.semHora; }
  const completo = `${l.endereco}, ${l.bairro}, ${l.cidade}${l.uf ? ` - ${l.uf}` : ''}`;
  for (const el of document.querySelectorAll('[data-loja="nome"]')) el.textContent = l.razao || l.nome;
  for (const el of document.querySelectorAll('[data-loja="curto"]')) el.textContent = l.nome;
  for (const el of document.querySelectorAll('[data-loja="endereco"]')) el.textContent = `${l.endereco} · ${l.bairro}, ${l.cidade}`;
  for (const el of document.querySelectorAll('[data-loja="referencia"]')) { el.textContent = l.referencia || ''; el.hidden = !l.referencia; }
  for (const el of document.querySelectorAll('[data-loja="mapa"]')) el.href = `https://www.openstreetmap.org/search?query=${encodeURIComponent(completo)}`;
  for (const el of document.querySelectorAll('[data-loja="rota"]')) el.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(completo)}`;
  for (const el of document.querySelectorAll('[data-loja="rodape"]')) el.textContent = `${l.razao || l.nome} · ${l.endereco} · ${l.bairro}, ${l.cidade}`;
  for (const el of document.querySelectorAll('[data-loja="instagram"]')) {
    const user = String(l.instagram || '').replace(/^@/, '').trim();
    el.hidden = !user;
    if (user) el.href = `https://www.instagram.com/${encodeURIComponent(user)}/`;
  }
}

/* ---------- #0 cardápio ---------- */
function cardapio(servicos) {
  const ol = document.querySelector('.cardapio__lista');
  if (!ol) return;
  if (!servicos.length) {
    ol.innerHTML = '<li class="linha linha--vazia"><span class="linha__nome"><strong>Cardápio em atualização</strong><small>chame no WhatsApp para saber os serviços de hoje</small></span></li>';
    return;
  }
  ol.innerHTML = servicos.map((s, i) => `
    <li class="linha" data-servico="${i}" data-ferramenta="${esc(s.ferramenta)}">
      <span class="linha__num">#${i}</span>
      <span class="linha__nome"><strong>${esc(s.nome)}</strong><small>${esc(s.desc)}</small></span>
      <span class="linha__tempo mono">${Number(s.min) || 0} min</span>
      <span class="linha__preco">R$ ${Number(s.preco) || 0}</span>
      <button class="pilula" type="button" data-agendar="${i}">Agendar</button>
    </li>`).join('');
}

/* ---------- #2 espelhos (um por barbeiro) e os chips de filtro dos cortes ---------- */
function espelhos(barbeiros) {
  const sec = document.querySelector('.espelhos');
  const fila = sec?.querySelector('.espelhos__fila');
  if (!fila) return;
  if (!barbeiros.length) { sec.hidden = true; return; }
  const n = barbeiros.length;
  const leve = sec.querySelector('.titulo .leve');
  if (leve) leve.textContent = `${NUMEROS[n] ?? n} ${n === 1 ? 'espelho' : 'espelhos'}.`;
  const forte = sec.querySelector('.titulo .forte');
  if (forte && n === 1) forte.textContent = 'Sente-se.';
  fila.innerHTML = barbeiros.map((b, i) => `
    <button class="espelho${i === 0 ? ' is-ativo' : ''}" type="button" role="tab" aria-selected="${i === 0}" data-barbeiro="${i}">
      <span class="espelho__luminaria" aria-hidden="true"><i></i></span>
      <span class="espelho__vidro"><img src="${esc(foto(b.foto))}" alt="${esc(b.alt || `${b.nome} trabalhando`)}" loading="lazy" decoding="async"></span>
      <span class="espelho__info"><span class="espelho__num">#${i + 1}</span><span class="espelho__nome">${esc(b.nome)}</span><span class="espelho__extra mono">${esc(extra(b))}</span></span>
    </button>`).join('');
  fila.style.setProperty('--n', n);
  const filtros = document.querySelector('.cortes .filtros');
  if (filtros) {
    filtros.innerHTML = `<button class="filtro is-ativo" type="button" data-filtro="todos" aria-pressed="true">Todos</button>${barbeiros.map((b, i) => `<button class="filtro" type="button" data-filtro="${i}" aria-pressed="false">${esc(b.nome)}</button>`).join('')}`;
    filtros.hidden = barbeiros.length < 2;
  }
}
const extra = (b) => [b.especialidade, b.anos ? `${b.anos} ${Number(b.anos) === 1 ? 'ano' : 'anos'} de cadeira` : ''].filter(Boolean).join(' · ');

/* ---------- cortes: cada corte aponta para um barbeiro e um serviço (pelos ids do padrão: b0..b3, s0..s6) ---------- */
function cortes(servicos, barbeiros) {
  const idxServ = (i) => servicos.findIndex((s) => s.id === `s${i}`);
  const idxBarb = (i) => barbeiros.findIndex((b) => b.id === `b${i}`);
  const cards = [...document.querySelectorAll('.cortes .corte')];
  for (const c of cards) {
    const nb = idxBarb(Number(c.dataset.barbeiro));
    if (nb < 0) { c.remove(); continue; }
    c.dataset.barbeiro = String(nb);
    const ag = c.querySelector('[data-agendar]');
    if (ag) {
      const ns = idxServ(Number(ag.dataset.agendar));
      ag.dataset.agendar = ns < 0 ? '' : String(ns);
      ag.dataset.com = String(nb);
    }
  }
  const sec = document.querySelector('.cortes');
  if (sec && !sec.querySelector('.corte')) sec.hidden = true;
}

/* ---------- #4 bancada ---------- */
function produtos(lista) {
  const sec = document.querySelector('.loja');
  const grade = sec?.querySelector('.loja__grade');
  if (!grade) return;
  if (!lista.length) {
    sec.hidden = true;
    document.querySelectorAll('a[href="#loja"]').forEach((a) => { a.hidden = true; });
    return;
  }
  grade.innerHTML = lista.map((p) => `
    <li class="produto"><div class="produto__foto"><img src="${esc(foto(p.foto))}" alt="${esc(p.alt || p.nome)}" loading="lazy" decoding="async"></div><div class="produto__pe"><h3>${esc(p.nome)}</h3><span class="produto__preco">R$ ${Number(p.preco) || 0}</span><span class="produto__det mono">${esc(p.det)}</span><button class="pilula pilula--escura" type="button" data-sacola>Adicionar</button></div></li>`).join('');
}
