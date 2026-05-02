import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegStatic);

const inputPath = path.resolve('./public/anima.mp4');
const outputPath = path.resolve('./public/anima_optimized.mp4');

console.log('Iniciando otimização do vídeo com ffmpeg-static...');

ffmpeg(inputPath)
  .outputOptions([
    '-g 1',
    '-preset ultrafast',
    '-crf 23',
    '-an'
  ])
  .save(outputPath)
  .on('end', () => {
    console.log('Vídeo otimizado com sucesso! Arquivo gerado em:', outputPath);
  })
  .on('error', (err) => {
    console.error('Erro ao otimizar o vídeo:', err);
  });
