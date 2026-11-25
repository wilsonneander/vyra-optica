/* Horário de funcionamento da Tampinha (usado pelo build no Node, pelo site e pela Área do Cliente).
   Formato: abertura[dia] com dia 0 = domingo. Cada dia é null (fechado) ou [abre, fecha] em horas decimais.
   Quando fecha depois da meia-noite, fecha passa de 24 (1h da manhã = 25). */
(function (raiz) {
  'use strict';
  const NOMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const SEMANA = [1, 2, 3, 4, 5, 6, 0]; // ordem de exibição: segunda a domingo

  // 10 -> "10h", 10.5 -> "10h30"
  const hora = (x) => {
    const v = ((x % 24) + 24) % 24, h = Math.floor(v), m = Math.round((v - h) * 60);
    return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
  };
  // "10h às 23h", "10h à 1h", "18h à meia-noite"
  const faixa = (d) => {
    if (!d) return 'fechado';
    const f = d[1] % 24;
    const fim = f === 0 ? 'à meia-noite' : Math.floor(f) === 1 ? `à ${hora(d[1])}` : `às ${hora(d[1])}`;
    return `${hora(d[0])} ${fim}`;
  };
  // agrupa dias seguidos com o mesmo horário: [["Segunda a quinta", "10h às 23h"], ["Domingo", "fechado"]]
  const grupos = (ab) => {
    const out = [];
    SEMANA.forEach((dia) => {
      const chave = JSON.stringify(ab[dia] || null);
      const ult = out[out.length - 1];
      if (ult && ult.chave === chave) ult.dias.push(dia); else out.push({ chave, dias: [dia] });
    });
    return out.map((g) => {
      const n = g.dias.map((d) => NOMES[d]);
      const rot = n.length === 1 ? n[0] : n.length === 2 ? `${n[0]} e ${n[1].toLowerCase()}` : `${n[0]} a ${n[n.length - 1].toLowerCase()}`;
      return [rot, faixa(ab[g.dias[0]])];
    });
  };
  const texto = (ab) => grupos(ab).map(([d, h]) => `${d}: ${h}`).join('. ');

  const decimal = (d) => d.getHours() + d.getMinutes() / 60;
  const aberto = (ab, agora = new Date()) => {
    const h = decimal(agora), hoje = ab[agora.getDay()], ontem = ab[(agora.getDay() + 6) % 7];
    return Boolean((hoje && h >= hoje[0] && h < hoje[1]) || (ontem && ontem[1] > 24 && h < ontem[1] - 24));
  };
  // "Aberto agora", "Abre hoje às 10h", "Abre amanhã às 10h", "Abre segunda às 10h"
  const status = (ab, agora = new Date()) => {
    if (aberto(ab, agora)) return { aberto: true, txt: 'Aberto agora' };
    const dia = agora.getDay(), h = decimal(agora);
    if (ab[dia] && h < ab[dia][0]) return { aberto: false, txt: `Abre hoje às ${hora(ab[dia][0])}` };
    for (let i = 1; i <= 7; i++) {
      const d = (dia + i) % 7;
      if (ab[d]) return { aberto: false, txt: `Abre ${i === 1 ? 'amanhã' : NOMES[d].toLowerCase()} às ${hora(ab[d][0])}` };
    }
    return { aberto: false, txt: 'Fechado agora' };
  };
  // "22:30" <-> 22.5
  const deCampo = (t) => { const [h, m] = String(t).split(':').map(Number); return h + (m || 0) / 60; };
  const paraCampo = (x) => { const v = ((x % 24) + 24) % 24, h = Math.floor(v), m = Math.round((v - h) * 60); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; };

  const H = { NOMES, SEMANA, hora, faixa, grupos, texto, aberto, status, deCampo, paraCampo };
  if (typeof module !== 'undefined' && module.exports) module.exports = H; else raiz.Horario = H;
})(typeof window !== 'undefined' ? window : this);
