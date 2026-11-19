// Monta os vídeos do modelo Premium a partir dos clipes originais (Pexels e Pixabay, licença livre; os quatro primeiros
// são os mesmos do site peakalikaturismo.com). Corta o trecho, reduz, tira o som e gera o pôster WebP de cada um.
//
// Uso:
//   FFMPEG=<caminho do ffmpeg> CLIPES=<pasta dos clipes baixados> node videos.js
//
// Fontes (baixar para CLIPES com o nome da esquerda):
//   fireworks.mp4           https://videos.pexels.com/video-files/25863284/11916419_2560_1440_30fps.mp4
//   familia.mp4             https://cdn.pixabay.com/video/2021/11/10/95420-645704443_large.mp4
//   parques.mp4             https://videos.pexels.com/video-files/19550415/19550415-uhd_2560_1440_24fps.mp4
//   magia.mp4               https://videos.pexels.com/video-files/19554738/19554738-uhd_2560_1440_24fps.mp4
//   fogos-castelo.mp4       https://videos.pexels.com/video-files/29597030/12738865_1920_1080_30fps.mp4
//   parada-personagens.mp4  https://videos.pexels.com/video-files/36216217/15357936_1920_1080_25fps.mp4
//   passeio.mp4             https://videos.pexels.com/video-files/19542646/19542646-hd_1920_1080_24fps.mp4
//   castelo-entardecer.mp4  https://videos.pexels.com/video-files/37743430/16009108_1920_1080_30fps.mp4
//   branca-de-neve.mp4      https://videos.pexels.com/video-files/19550565/19550565-hd_1920_1080_24fps.mp4
//   v-parada.mp4            https://videos.pexels.com/video-files/39538649/16846640_720_1280_30fps.mp4
//   v-castelo-noite.mp4     https://videos.pexels.com/video-files/30034095/12885618_720_1280_60fps.mp4
//   v-pai-filho.mp4         https://videos.pexels.com/video-files/39494354/16824411_720_1280_30fps.mp4
//   v-walt-mickey.mp4       https://videos.pexels.com/video-files/31456688/13414128_720_1280_30fps.mp4
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FF = process.env.FFMPEG, CLIPES = process.env.CLIPES;
if (!FF || !CLIPES) { console.error('defina FFMPEG e CLIPES'); process.exit(1); }
const OUT = path.join(__dirname, 'img', 'video');
fs.mkdirSync(OUT, { recursive: true });

// [saída, clipe, início (s), duração (s), largura, crf, hdr]
const LISTA = [
  ['capa-fogos', 'fireworks.mp4', 0, 12, 1600, 30],
  ['castelo-dia', 'parques.mp4', 0, 9, 1280, 29],
  ['balao-mickey', 'magia.mp4', 0, 10, 1280, 29],
  ['parada', 'parada-personagens.mp4', 2, 8, 720, 30],
  ['branca-de-neve', 'branca-de-neve.mp4', 3, 8, 720, 30],
  ['toy-story', 'familia.mp4', 0, 9, 1280, 30],
  ['main-street', 'passeio.mp4', 2, 8, 720, 30],
  ['show-noturno', 'fogos-castelo.mp4', 0, 14, 1600, 30],
  ['castelo-entardecer', 'castelo-entardecer.mp4', 0, 7.5, 720, 30],
  ['r-parada', 'v-parada.mp4', 0, 12, 540, 30],
  ['r-castelo-noite', 'v-castelo-noite.mp4', 0, 4.3, 540, 30, true],
  ['r-pai-filho', 'v-pai-filho.mp4', 0, 8, 540, 30],
  ['r-walt-mickey', 'v-walt-mickey.mp4', 0, 10, 540, 30, true],
];

for (const [nome, clipe, ini, dur, larg, crf, hdr] of LISTA) {
  const src = path.join(CLIPES, clipe);
  if (!fs.existsSync(src)) { console.warn('faltando', clipe); continue; }
  // clipes HDR (bt2020) ficam lavados sem conversão: reduz o brilho e devolve a saturação em bt709
  const cor = hdr ? 'colorspace=all=bt709:iall=bt2020:fast=1,eq=saturation=1.15:contrast=1.05,' : '';
  const vf = `${cor}scale=${larg}:-2:flags=lanczos,fps=30,format=yuv420p`;
  const mp4 = path.join(OUT, `${nome}.mp4`);
  execFileSync(FF, ['-y', '-loglevel', 'error', '-ss', String(ini), '-t', String(dur), '-i', src, '-an', '-vf', vf,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-profile:v', 'high', '-movflags', '+faststart', mp4]);
  execFileSync(FF, ['-y', '-loglevel', 'error', '-ss', '0.4', '-i', mp4, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '72', path.join(OUT, `${nome}.webp`)]);
  console.log(nome, (fs.statSync(mp4).size / 1048576).toFixed(2) + ' MB');
}
