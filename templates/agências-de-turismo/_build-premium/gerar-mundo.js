// Gera o mapa-múndi pontilhado da seção Destinos a partir do contorno de terra do Natural Earth (domínio público).
// Projeção equiretangular em 1000 de largura, de 80° N a 58° S (sem a Antártida).
// Saída: img/mundo.json com o caminho dos pontos e a projeção, usada pelo build.js.
//
// Uso: node gerar-mundo.js
const fs = require('fs');
const path = require('path');

const URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson';
const W = 1000, LAT_MAX = 80, LAT_MIN = -58;
const H = Math.round(W * (LAT_MAX - LAT_MIN) / 360);
const PASSO = 1.6; // graus entre pontos

const dentro = (lon, lat, anel) => {
  let d = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const [xi, yi] = anel[i], [xj, yj] = anel[j];
    if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) d = !d;
  }
  return d;
};

(async () => {
  const geo = await (await fetch(URL)).json();
  const poligonos = geo.features.flatMap((f) => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates));
  const pontos = [];
  for (let lat = LAT_MAX - PASSO / 2; lat > LAT_MIN; lat -= PASSO) {
    for (let lon = -180 + PASSO / 2; lon < 180; lon += PASSO) {
      const terra = poligonos.some((p) => dentro(lon, lat, p[0]) && !p.slice(1).some((buraco) => dentro(lon, lat, buraco)));
      if (terra) pontos.push(`M${((lon + 180) / 360 * W).toFixed(1)} ${((LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * H).toFixed(1)}h0`);
    }
  }
  fs.writeFileSync(path.join(__dirname, 'img', 'mundo.json'), JSON.stringify({ w: W, h: H, latMax: LAT_MAX, latMin: LAT_MIN, d: pontos.join('') }));
  console.log('ok', pontos.length, 'pontos', W, 'x', H);
})();
