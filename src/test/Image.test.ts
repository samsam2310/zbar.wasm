import { Image } from '../Image';
import { Symbol } from '../Symbol';

test('Image', async () => {
  const data = new Uint8Array([128, 128, 128, 128]);
  let image: Image, syms: Array<Symbol>;
  image = await Image.createFromGrayBuffer(2, 2, data.buffer);
  syms = image.getSymbols();
  expect(syms).toHaveLength(0);
  image.destory();
  expect(() => {
    image.destory();
  }).toThrow('Call after destroyed');
  expect(() => {
    image.getSymbols();
  }).toThrow('Call after destroyed');

  image = await Image.createFromRGBABuffer(1, 1, data.buffer);
  syms = image.getSymbols();
  expect(syms).toHaveLength(0);
  image.destory();
  expect(() => {
    image.destory();
  }).toThrow('Call after destroyed');
  expect(() => {
    image.getSymbols();
  }).toThrow('Call after destroyed');
});
