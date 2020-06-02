import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

export const getImageData = async (src: string) => {
  const img = await loadImage(src);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
};
