import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// base relativa: o dist/ abre em qualquer pasta da hospedagem, não só na raiz do domínio.
// Quatro páginas: o site, o login e o cadastro da Área do cliente e o painel.
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        site: resolve(import.meta.dirname, 'index.html'),
        cliente: resolve(import.meta.dirname, 'cliente.html'),
        cadastro: resolve(import.meta.dirname, 'cadastro.html'),
        painel: resolve(import.meta.dirname, 'painel.html'),
      },
    },
  },
});
