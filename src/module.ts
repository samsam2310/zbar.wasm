// import { loadWasmInstance } from './load';
import ImageScanner from './ImageScanner';
import Image from './Image';

const createDefaultScanner = async () => {
  return await ImageScanner.create();
};

export const scanArrayBuffer = async (
  buffer: ArrayBuffer,
  width: number,
  height: number,
  format: number | string,
  scanner?: ImageScanner
) => {
  if (scanner === undefined) {
    scanner = await createDefaultScanner();
  }
  const image = await Image.createFromRGBABuffer(width, height, buffer);
  console.log('scan: ', scanner.scan(image));
  const res = image.getSymbols();
  image.destory();
  return res;
};

export const scanImageData = async (
  image: ImageData,
  scanner?: ImageScanner
) => {
  return await scanArrayBuffer(
    image.data.buffer,
    image.width,
    image.height,
    0x41424752 /* RGBA */,
    scanner
  );
};
