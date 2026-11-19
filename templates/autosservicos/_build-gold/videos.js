// Monta os vídeos do modelo Gold a partir de clipes do Mixkit (licença livre Mixkit, sem marca d'água).
// Os clipes originais (720p) ficam numa pasta fora do projeto; o resultado vai para img/video/.
// Uso:
//   FFMPEG=<caminho do ffmpeg> CLIPES=<pasta com os .mp4 do Mixkit> [SO=equipe] node videos.js
// Download dos clipes: https://assets.mixkit.co/videos/<id>/<id>-720.mp4
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FF = process.env.FFMPEG || 'ffmpeg';
const CLIPES = process.env.CLIPES;
if (!CLIPES) { console.error('defina CLIPES=<pasta com os clipes do Mixkit>'); process.exit(1); }
const OUT = path.join(__dirname, 'img', 'video');
fs.mkdirSync(OUT, { recursive: true });
const X = 0.45; // duração da fusão entre clipes

// [arquivo, largura, altura, crf, [[id, início, duração], ...]]
const VIDEOS = [
  // capa: carro na garagem, farol, painel, mecânico, motor, polimento e estrada
  ['capa', 1280, 720, 29, [[35577, 2.5, 3.2], [24822, 0.4, 2.6], [64, 4, 2.6], [13179, 3, 2.8], [65, 1, 2.6], [47830, 2, 2.6], [52427, 0.8, 3.4]]],
  // seção "veja a oficina por dentro": loop de fundo e vídeo do player
  ['oficina', 1280, 720, 29, [[13270, 0.5, 3.2], [23970, 6, 3.2], [4716, 2, 3], [23992, 5, 3.2], [47468, 1, 2.8], [47834, 0.5, 3], [47586, 2, 3.2], [63, 3, 3]]],
  // reels verticais do Instagram
  ['reel-polimento', 480, 852, 30, [[47830, 1, 5.5]]],
  ['reel-motor', 480, 852, 30, [[65, 0.5, 5.5]]],
  ['reel-lavagem', 480, 852, 30, [[47585, 1, 5.5]]],
  ['reel-mecanico', 480, 852, 30, [[13179, 4, 5.5]]],
  ['reel-pneus', 480, 852, 30, [[47468, 0.5, 5.5]]],
  ['reel-farol', 480, 852, 30, [[24822, 0.2, 5.5]]],
  // equipe: retrato 3:4 recortado do quadro 1280x720 (quarto item = x do recorte de 540px), toca no hover
  ['equipe-andre', 540, 720, 30, [[13180, 1, 5, 450]]],
  ['equipe-marcos', 540, 720, 30, [[23992, 0.3, 5, 150]]],
  ['equipe-tiago', 540, 720, 30, [[47834, 0.2, 5, 250]]],
];

for (const [nome, W, H, crf, segs] of VIDEOS.filter(([n]) => !process.env.SO || n.startsWith(process.env.SO))) {
  const args = ['-v', 'error', '-y'];
  let fil = '', prev = 'v0', off = 0;
  segs.forEach(([id, ini, dur, cx], n) => {
    args.push('-ss', String(ini), '-t', String(dur), '-i', path.join(CLIPES, `${id}.mp4`));
    const enq = cx === undefined ? `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}` : `scale=-2:${H},crop=${W}:${H}:${cx}:0`;
    fil += `[${n}:v]${enq},fps=30,format=yuv420p,setpts=PTS-STARTPTS[v${n}];`;
    if (n === 0) { off = dur - X; return; }
    fil += `[${prev}][v${n}]xfade=transition=fade:duration=${X}:offset=${off.toFixed(2)}[x${n}];`;
    prev = `x${n}`;
    off += dur - X;
  });
  const saida = path.join(OUT, `${nome}.mp4`);
  args.push('-filter_complex', fil.replace(/;$/, ''), '-map', `[${prev}]`, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-pix_fmt', 'yuv420p', '-profile:v', 'main', '-movflags', '+faststart', saida);
  execFileSync(FF, args, { stdio: 'inherit' });
  // pôster (primeiro quadro bom) em WebP pelo próprio ffmpeg
  execFileSync(FF, ['-v', 'error', '-y', '-ss', '0.6', '-i', saida, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '72', path.join(OUT, `${nome}.webp`)], { stdio: 'inherit' });
  console.log('ok', nome, Math.round(fs.statSync(saida).size / 1024) + 'k');
}
