import { Image } from '../Image';
import { Symbol } from '../Symbol';
import { test, expect } from './utils';

test('Image', async () => {
  const data = new Uint8Array([128, 128, 128, 128]);
  let image: Image, syms: Array<Symbol>;
  image = await Image.createFromGrayBuffer(2, 2, data.buffer);
  syms = image.getSymbols();
  expect(syms).toHaveLength(0);
  image.destroy();
  expect(() => {
    image.destroy();
  }).toThrow('Call after destroyed');
  expect(() => {
    image.getSymbols();
  }).toThrow('Call after destroyed');

  image = await Image.createFromRGBABuffer(1, 1, data.buffer);
  syms = image.getSymbols();
  expect(syms).toHaveLength(0);
  image.destroy();
  expect(() => {
    image.destroy();
  }).toThrow('Call after destroyed');
  expect(() => {
    image.getSymbols();
  }).toThrow('Call after destroyed');

  await expect(Image.createFromRGBABuffer(2, 2, data.buffer)).rejects.toThrow(
    'dataBuf does not match width and height'
  );
  await expect(Image.createFromGrayBuffer(1, 1, data.buffer)).rejects.toThrow(
    'dataBuf does not match width and height'
  );
});
