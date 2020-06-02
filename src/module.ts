// import { loadWasmInstance } from './load';
import ImageScanner from './ImageScanner';
import Image from './Image';

const createDefaultScanner = async () => {
  return await ImageScanner.create();
};

export const scanArrayBuffer = async (buffer: ArrayBuffer, width: number, height: number, format: number | string, scanner: ImageScanner) => {
  if (scanner === undefined) {
    scanner = await createDefaultScanner();
  }
  const originImage = await Image.create(width, height, format, buffer);
  let image;
  if (Image.isScanableFormat(format)) {
    image = originImage;
  } else {
    image = originImage.convert(0x30303859 /* Y800 */);
    originImage.destory();
  }
  scanner.scan(image);
  const res = image.getSymbols();
  image.destory();
  return res;
};