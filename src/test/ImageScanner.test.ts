import { Image } from '../Image';
import { ImageScanner } from '../ImageScanner';
import { Symbol } from '../Symbol';
import { ZBarSymbolType, ZBarConfigType } from '../enum';

test('ImageScanner', async () => {
  const data = new Uint8Array([128, 128, 128, 128]);
  let image: Image;
  image = await Image.createFromGrayBuffer(2, 2, data.buffer);

  const scanner = await ImageScanner.create();
  expect(scanner.getResults()).toHaveLength(0);
  expect(scanner.scan(image)).toEqual(0);
  expect(scanner.getResults()).toHaveLength(0);
  scanner.recycleImage(image);
  scanner.enableCache(true);
  scanner.enableCache(false);
  expect(
    scanner.setConfig(
      ZBarSymbolType.ZBAR_EAN13,
      ZBarConfigType.ZBAR_CFG_ENABLE,
      0
    )
  ).toEqual(0);
  expect(scanner.setConfig(87, ZBarConfigType.ZBAR_CFG_ENABLE, 0)).toEqual(1);

  image.destory();
  expect(() => {
    scanner.scan(image);
  }).toThrow('Call after destroyed');
  expect(() => {
    scanner.recycleImage(image);
  }).toThrow('Call after destroyed');

  image = await Image.createFromGrayBuffer(2, 2, data.buffer);
  scanner.destory();
  expect(() => {
    scanner.destory();
  }).toThrow('Call after destroyed');
  expect(() => {
    scanner.getResults();
  }).toThrow('Call after destroyed');
  expect(() => {
    scanner.scan(image);
  }).toThrow('Call after destroyed');
  expect(() => {
    scanner.recycleImage(image);
  }).toThrow('Call after destroyed');
  expect(() => {
    scanner.enableCache(true);
  }).toThrow('Call after destroyed');
  expect(() => {
    scanner.setConfig(1, 2, 3);
  }).toThrow('Call after destroyed');
});
