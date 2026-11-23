// Peças comuns da Área do cliente (login, cadastro e painel): botões com o rótulo duplo do site, aviso curto,
// ícones e máscaras. Sem GSAP nem Three: as páginas do painel são leves.

export const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** O mesmo botão do site: rótulo que sobe com a cópia por baixo, e o círculo da seta no .botao--seta. */
export function botoes(raiz = document) {
  for (const b of raiz.querySelectorAll('.botao:not([data-pronto])')) {
    const t = b.textContent.trim();
    b.dataset.pronto = '';
    b.innerHTML = `<span class="botao__txt" data-txt="${esc(t)}"><span>${esc(t)}</span></span>`;
    if (b.classList.contains('botao--seta')) b.insertAdjacentHTML('beforeend', '<span class="botao__seta" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M4.5 11.5l7-7M5.5 4.5h6v6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>');
  }
}
/** Troca o texto de um botão já montado. */
export function rotulo(b, t) {
  const txt = b.querySelector('.botao__txt');
  if (!txt) { b.textContent = t; return; }
  txt.dataset.txt = t;
  txt.firstElementChild.textContent = t;
}

let caixa, timer;
export function aviso(texto, tipo = 'ok') {
  if (!caixa) {
    caixa = document.createElement('div');
    caixa.className = 'toast';
    caixa.setAttribute('role', 'status');
    caixa.setAttribute('aria-live', 'polite');
    document.body.append(caixa);
  }
  caixa.textContent = texto;
  caixa.dataset.tipo = tipo;
  caixa.classList.remove('is-on');
  void caixa.offsetWidth;
  caixa.classList.add('is-on');
  clearTimeout(timer);
  timer = setTimeout(() => caixa.classList.remove('is-on'), 3200);
}

export const ICONES = {
  editar: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M13.6 3.6l2.8 2.8-9 9H4.6v-2.8l9-9z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  excluir: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6h12M8 6V4h4v2M6 6l.8 10h6.4L14 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arquivar: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14v3H3zM4.5 8v8h11V8M8 11h4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  olho: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M1.8 10S4.8 4.5 10 4.5 18.2 10 18.2 10 15.2 15.5 10 15.5 1.8 10 1.8 10z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="2.6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  olhoFechado: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 3l14 14M8.1 5c.6-.3 1.2-.5 1.9-.5 5.2 0 8.2 5.5 8.2 5.5s-.9 1.6-2.5 3.1M5.2 6.6C3 8.1 1.8 10 1.8 10s3 5.5 8.2 5.5c1.1 0 2.1-.2 3-.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  cima: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 12l5-5 5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  baixo: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  mais: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5v11M2.5 8h11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  fechar: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  foto: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="2.8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
};

/** Máscaras simples (só formatam o que é digitado). */
export const mascara = {
  fone(v) {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  },
  documento(v) {
    const d = v.replace(/\D/g, '').slice(0, 14);
    if (d.length <= 11) return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return d.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
  },
};

/** Mostrar e esconder a senha de um campo. */
export function olhoDaSenha(input, botao) {
  botao.innerHTML = ICONES.olho;
  botao.addEventListener('click', () => {
    const ver = input.type === 'password';
    input.type = ver ? 'text' : 'password';
    botao.innerHTML = ver ? ICONES.olhoFechado : ICONES.olho;
    botao.setAttribute('aria-label', ver ? 'Esconder a senha' : 'Mostrar a senha');
    botao.setAttribute('aria-pressed', String(ver));
  });
}

/** Reduz uma imagem enviada para caber no armazenamento do navegador (JPEG, lado maior até `max`). */
export function reduzirFoto(arquivo, max = 1000, qualidade = 0.82) {
  return new Promise((ok, erro) => {
    if (!arquivo || !arquivo.type.startsWith('image/')) { erro(new Error('não é imagem')); return; }
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      ok(c.toDataURL('image/jpeg', qualidade));
    };
    img.onerror = () => { URL.revokeObjectURL(url); erro(new Error('imagem inválida')); };
    img.src = url;
  });
}
