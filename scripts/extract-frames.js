import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegStatic);

const videoPath = path.resolve(__dirname, '../public/anima_optimized.mp4');
const framesDir = path.resolve(__dirname, '../public/frames');

if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

console.log('Extraindo frames do vídeo...');

ffmpeg(videoPath)
  .output(path.join(framesDir, 'frame_%04d.jpg'))
  .outputOptions([
    '-q:v 2' // JPEG de alta qualidade
  ])
  .on('end', () => {
    console.log('Frames extraídos com sucesso.');
  })
  .on('error', (err) => {
    console.error('Erro ao extrair frames:', err);
  })
  .run();
