// O horário da casa e a próxima cadeira livre (de 20 em 20 minutos, com 20 de folga). ?hora=14:20 simula a hora
// (para gravar a prévia sempre com a casa aberta).
// HORARIO[dia] = [abre, fecha] em horas (9.5 = 9h30) ou null quando a casa fecha no dia. A Área do cliente troca
// estes valores (src/loja/aplicar.js) antes das seções e da agenda lerem.
export const HORARIO = { 0: [10, 16], 1: [9, 21], 2: [9, 21], 3: [9, 21], 4: [9, 21], 5: [9, 21], 6: [9, 20] };
const NOMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const fmt = (m) => { m = Math.round(m); return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`; };

export function agora() {
  const d = new Date();
  const h = new URLSearchParams(location.search).get('hora');
  if (h && /^\d{1,2}:\d{2}$/.test(h)) { const [a, b] = h.split(':').map(Number); d.setHours(a, b, 0, 0); }
  return d;
}

export function proximaCadeira(quando = agora()) {
  const dia = quando.getDay();
  const min = quando.getHours() * 60 + quando.getMinutes();
  if (HORARIO[dia]) {
    const [abre, fecha] = HORARIO[dia];
    if (min < abre * 60) return { aberto: false, hora: fmt(abre * 60), quando: 'hoje' };
    const prox = Math.ceil((min + 20) / 20) * 20;
    if (prox <= fecha * 60 - 20) return { aberto: true, hora: fmt(prox), quando: 'hoje' };
  }
  // o próximo dia aberto
  for (let k = 1; k <= 7; k++) {
    const h = HORARIO[(dia + k) % 7];
    if (h) return { aberto: false, hora: fmt(h[0] * 60), quando: k === 1 ? 'amanhã' : NOMES[(dia + k) % 7] };
  }
  return { aberto: false, hora: '', quando: 'em breve' };
}
