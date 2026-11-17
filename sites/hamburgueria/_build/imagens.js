// Baixa as fotos de demonstração do Unsplash (licença livre) e gera os WebP do site.
// Uso (sharp instalado fora do projeto):
//   NODE_PATH=<pasta com node_modules/sharp> node sites/hamburgueria/_build/imagens.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'site', 'assets', 'img');
// arquivo: [id do Unsplash, largura, altura]
const FOTOS = {
  // burgers
  'smash': ['1607013251379-e6eecfffe234', 800, 800],
  'bacon': ['1553979459-d2229ba7433b', 800, 800],
  'classico': ['1568901346375-23c9450c58cd', 800, 800],
  'crispy': ['1606755962773-d324e0a13086', 800, 800],
  'veggie': ['1525059696034-4967a8e1dca2', 800, 800],
  'trufado': ['1572802419224-296b0aeee0d9', 800, 1000],
  'costela': ['1596662951482-0c4ba74a6df6', 800, 1000],
  // massas
  'carbonara': ['1612874742237-6526221588e3', 800, 800],
  'arrabbiata': ['1621996346565-e3dbc646d9a9', 800, 800],
  'lasanha': ['1574894709920-11b28e7367e3', 800, 800],
  'ragu': ['1579684947550-22e945225d9a', 800, 800],
  'mar': ['1563379926898-05f4575a45d8', 800, 800],
  // saladas
  'caesar': ['1550304943-4f24f54ddde9', 800, 800],
  'bowl': ['1512621776951-a57141f2eefd', 800, 800],
  'horta': ['1540420773420-3366772f4999', 800, 800],
  'frango-salada': ['1546793665-c74683f339c1', 800, 800],
  'fraldinha': ['1607532941433-304659e8198a', 800, 800],
  // sobremesas
  'brownie': ['1624353365286-3f8d62daad51', 800, 800],
  'cheesecake': ['1533134242443-d4fd215305ad', 800, 800],
  'tiramisu': ['1571877227200-a0d98ea607e9', 800, 800],
  'taca': ['1563805042-7684c019e1cb', 800, 800],
  'bolo': ['1606313564200-e75d5e30476c', 800, 800],
  // porções
  'fritas': ['1573080496219-bb080dd4f877', 800, 800],
  'onion': ['1639024471283-03518883512d', 800, 800],
  'wings': ['1608039755401-742074f0548d', 800, 800],
  'frango-frito': ['1626082927389-6cd097cdc6ec', 800, 800],
  // bebidas
  'shake-oreo': ['1572490122747-3968b75cc699', 800, 800],
  'shake-morango': ['1579954115545-a95591f28bfc', 800, 800],
  'limonada': ['1551538827-9c037cb4f32a', 800, 800],
  'chopp': ['1608270586620-248524c67de9', 800, 800],
  'drink': ['1514362545857-3bc16c4c7d1b', 800, 800],
  // capa, galerias e ambiente
  'capa': ['1586190848861-99aa4a171e90', 1800, 1100],
  'mesa': ['1466978913421-dad2ebd01d17', 700, 700],
  'combo': ['1594212699903-ec8a3eca50f5', 700, 700],
  'categoria-burger': ['1550547660-d9450f859349', 600, 460],
  'derretido': ['1565299507177-b0ac66763828', 700, 800],
  'cesta': ['1551782450-a2132b4ba21d', 700, 800],
  'tijolo': ['1513185158878-8d8c2a2a3da3', 700, 800],
  'escuro': ['1550317138-10000687a72b', 700, 800],
  'costelinha': ['1544025162-d76694265947', 700, 800],
  'espetos': ['1555939594-58d7cb561ad1', 700, 800],
  'fritas-escuro': ['1630384060421-cb20d0e0649d', 700, 800],
  'contato': ['1610440042657-612c34d95e9f', 1400, 900],
  'salao': ['1555396273-367ea4eb4db5', 900, 600],
  'balcao': ['1552566626-52f8b828add9', 900, 600],
  'rustico': ['1549611016-3a70d82b5040', 600, 800],
  'avocado': ['1520072959219-c595dc870360', 600, 800],
  // equipe
  'chef-kenji': ['1583394293214-28ded15ee548', 700, 820],
  'chef-renato': ['1581299894007-aaa50297cf16', 700, 820],
  'chef-lucas': ['1607631568010-a87245c0daf8', 700, 820],
  // depoimentos
  'cliente-ana': ['1494790108377-be9c29b29330', 120, 120],
  'cliente-davi': ['1507003211169-0a1dd7228f2d', 120, 120],
  'cliente-julia': ['1438761681033-6461ffad8d80', 120, 120],
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [nome, [id, w, h]] of Object.entries(FOTOS)) {
    const dest = path.join(OUT, `${nome}.webp`);
    if (fs.existsSync(dest)) continue;
    const res = await fetch(`https://images.unsplash.com/photo-${id}?w=${Math.round(Math.max(w, h) * 1.3)}&q=85&fm=jpg`);
    if (!res.ok) throw new Error(`${nome}: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize(w, h, { fit: 'cover', position: 'attention' }).webp({ quality: 74 }).toFile(dest);
    console.log('ok', nome);
  }
  await sharp(path.join(OUT, 'capa.webp')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toFile(path.join(OUT, 'og.jpg'));
})();
