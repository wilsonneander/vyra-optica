// Baixa os vídeos de demonstração do Pexels (licença livre, sem atribuição obrigatória)
// e gera a imagem de capa (poster) de cada um em WebP.
// Uso (sharp instalado fora do projeto):
//   NODE_PATH=<pasta com node_modules/sharp> node sites/hamburgueria/_build/videos.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'site', 'assets', 'video');
// arquivo: [id do vídeo no Pexels, arquivo da versão leve, nome da imagem de capa no Pexels]
const VIDEOS = {
  // capa: maçarico derretendo o queijo na chapa
  'capa': ['31741794', '13524226_1280_720_25fps', 'burguer-bussines-food-hamburger-31741794'],
  // seção grande: cozinheiro prensando o smash na chapa
  'chapa': ['37296040', '15798650_1280_720_24fps', 'regional-dishes-37296040'],
  // bastidores (formato reels)
  'reel-queijo': ['34697259', '14706304_540_960_30fps', 'pexels-photo-34697259'],
  'reel-montagem': ['29616671', '12745086_540_960_30fps', 'pexels-photo-29616671'],
  'reel-chama': ['39073904', '16626448_640_360_60fps', 'appetite-appetizer-burger-eating-39073904'],
  'reel-chef': ['32092904', '13681246_640_360_25fps', '4k-aerial-footage-american-cuisine-american-food-appetizing-food-32092904'],
  'reel-cheddar': ['34556296', '14641972_640_360_24fps', 'pexels-photo-34556296'],
  'reel-smash': ['37296038', '15798676_640_360_24fps', 'regional-dishes-37296038'],
};

const baixar = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [nome, [id, arq, capa]] of Object.entries(VIDEOS)) {
    const mp4 = path.join(OUT, `${nome}.mp4`);
    if (!fs.existsSync(mp4)) {
      fs.writeFileSync(mp4, await baixar(`https://videos.pexels.com/video-files/${id}/${arq}.mp4`));
      console.log('ok', nome, (fs.statSync(mp4).size / 1e6).toFixed(1), 'MB');
    }
    const poster = path.join(OUT, `${nome}.webp`);
    if (!fs.existsSync(poster)) {
      const buf = await baixar(`https://images.pexels.com/videos/${id}/${capa}.jpeg?auto=compress&w=1280`);
      await sharp(buf).resize(1280, 1280, { fit: 'inside' }).webp({ quality: 70 }).toFile(poster);
    }
  }
})();
