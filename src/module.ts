import { Image } from './Image';
import { ImageScanner } from './ImageScanner';
import { Symbol } from './Symbol';

const defaultScannerPromise = ImageScanner.create();
export const getDefaultScanner = async () => {
  return await defaultScannerPromise;
};

const scanImage = async (
  image: Image,
  scanner?: ImageScanner
): Promise<Array<Symbol>> => {
  if (scanner === undefined) {
    scanner = await defaultScannerPromise;
  }
  const res = scanner.scan(image);
  if (res < 0) {
    throw Error('Scan Failed');
  }
  if (res === 0) return [];
  return image.getSymbols();
};

export const scanGrayBuffer = async (
  buffer: ArrayBuffer,
  width: number,
  height: number,
  scanner?: ImageScanner
): Promise<Array<Symbol>> => {
  const image = await Image.createFromGrayBuffer(width, height, buffer);
  const res = await scanImage(image, scanner);
  image.destroy();
  return res;
};

export const scanRGBABuffer = async (
  buffer: ArrayBuffer,
  width: number,
  height: number,
  scanner?: ImageScanner
): Promise<Array<Symbol>> => {
  const image = await Image.createFromRGBABuffer(width, height, buffer);
  const res = await scanImage(image, scanner);
  image.destroy();
  return res;
};

export const scanImageData = async (
  image: ImageData,
  scanner?: ImageScanner
): Promise<Array<Symbol>> => {
  return await scanRGBABuffer(
    image.data.buffer,
    image.width,
    image.height,
    scanner
  );
};
