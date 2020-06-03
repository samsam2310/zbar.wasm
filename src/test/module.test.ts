import { getImageData, imageDataToGrayBuffer } from './utils';
import { ImageScanner } from '../ImageScanner';
import { scanImageData, scanGrayBuffer, getDefaultScanner } from '../module';
import { ZBarSymbolType, ZBarConfigType } from '../enum';

test('scanImageData', async () => {
  const dir = __dirname + '/../../src/test';
  let res;
  const img1 = await getImageData(dir + '/test1.png');
  res = await scanImageData(img1);
  expect(res).toHaveLength(1);
  expect(res[0].type).toEqual(ZBarSymbolType.ZBAR_QRCODE);
  expect(res[0].decode()).toEqual('http://newgame-anime.com/');
  expect(res[0].points).toEqual([
    { x: 1464, y: 307 },
    { x: 1459, y: 506 },
    { x: 1669, y: 510 },
    { x: 1676, y: 313 }
  ]);

  const buf = imageDataToGrayBuffer(img1);
  res = await scanGrayBuffer(buf, img1.width, img1.height);
  expect(res).toHaveLength(1);
  expect(res[0].type).toEqual(ZBarSymbolType.ZBAR_QRCODE);
  expect(res[0].decode()).toEqual('http://newgame-anime.com/');
  expect(res[0].points).toEqual([
    { x: 1464, y: 307 },
    { x: 1459, y: 506 },
    { x: 1669, y: 510 },
    { x: 1676, y: 313 }
  ]);

  res = await scanImageData(await getImageData(dir + '/test2.png'));
  expect(res).toHaveLength(1);
  expect(res[0].type).toEqual(ZBarSymbolType.ZBAR_QRCODE);
  expect(res[0].decode()).toEqual('中文測試');

  res = await scanImageData(await getImageData(dir + '/test3.png'));
  expect(res).toHaveLength(0);

  res = await scanImageData(await getImageData(dir + '/test4.png'));
  expect(res).toHaveLength(2);
  expect(res[0].type).toEqual(ZBarSymbolType.ZBAR_QRCODE);
  expect(res[0].decode()).toEqual('First');
  expect(res[1].type).toEqual(ZBarSymbolType.ZBAR_QRCODE);
  expect(res[1].decode()).toEqual('Second');
});

test('Barcode', async () => {
  const dir = __dirname + '/../../src/test';
  let res;
  const img5 = await getImageData(dir + '/test5.png');
  res = await scanImageData(img5);
  expect(res).toHaveLength(1);
  expect(res[0].type).toEqual(ZBarSymbolType.ZBAR_EAN13);
  expect(res[0].decode()).toEqual('9781234567897');

  const defaultScanner = await getDefaultScanner();
  expect(
    defaultScanner.setConfig(
      ZBarSymbolType.ZBAR_EAN13,
      ZBarConfigType.ZBAR_CFG_ENABLE,
      0
    )
  ).toEqual(0);
  res = await scanImageData(img5);
  expect(res).toHaveLength(0);

  defaultScanner.destory();

  const scanner = await ImageScanner.create();
  res = await scanImageData(img5, scanner);
  expect(res).toHaveLength(1);
  expect(res[0].type).toEqual(ZBarSymbolType.ZBAR_EAN13);
  expect(res[0].decode()).toEqual('9781234567897');

  expect(
    scanner.setConfig(
      ZBarSymbolType.ZBAR_NONE,
      ZBarConfigType.ZBAR_CFG_ENABLE,
      0
    )
  ).toEqual(0);
  res = await scanImageData(img5, scanner);
  expect(res).toHaveLength(0);

  expect(
    scanner.setConfig(
      ZBarSymbolType.ZBAR_EAN13,
      ZBarConfigType.ZBAR_CFG_ENABLE,
      1
    )
  ).toEqual(0);
  res = await scanImageData(img5, scanner);
  expect(res).toHaveLength(1);
  expect(res[0].type).toEqual(ZBarSymbolType.ZBAR_EAN13);
  expect(res[0].decode()).toEqual('9781234567897');
});
