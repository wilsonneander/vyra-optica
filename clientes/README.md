# Clientes

Sites de clientes reais. Cada pasta começa como cópia de um template do catálogo ([../templates/](../templates/)) e recebe os ajustes que o cliente pedir.

Regra: **os templates do catálogo não mudam por causa de um cliente.** Todo ajuste é feito aqui, na cópia.

| Pasta | Partiu de | Gerar |
|---|---|---|
| [thd-engenharia/](thd-engenharia/) | `templates/assessoria-provedor/_build/` (modelo Blocos) | `node clientes/thd-engenharia/_build/build.js` (e `--preview`) |

## THD Engenharia: o que mudou em relação ao template

- Segurança do trabalho é o serviço principal: frente própria em primeiro lugar (junto com Responsabilidade técnica, que antes ficava em "Técnico e segurança"), primeira pergunta do diagnóstico, texto do topo e jornada. Texto do serviço tirado de thdengenharia.com/servicos/.
- Tema claro em todas as páginas menos Contato: o que era marinho virou branco ou cinza claro, alternando por seção. Fica em `_build/claro.js`, aplicado por cima do CSS do modelo.
- Menu com faixa marinho translúcida em todas as páginas.
- Rodapé das páginas claras usa o logo positivo (`img/logo-positivo.png`).
