import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

export const getImageData = async (src: string) => {
  const img = await loadImage(src);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
};

export const imageDataToGrayBuffer = (img: ImageData) => {
  const len = img.width * img.height;
  const data = img.data;
  const buf = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    buf[i] = (r * 19595 + g * 38469 + b * 7472) >> 16;
  }
  return buf;
};
