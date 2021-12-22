import { getImageData, imageDataToGrayBuffer } from './utils';
import { ImageScanner } from '../ImageScanner';
import { scanImageData, scanGrayBuffer, getDefaultScanner } from '../module';
import { ZBarSymbolType, ZBarConfigType, ZBarOrientation } from '../enum';
import { test, expect } from './utils';

test('scanImageData', async () => {
  let res;
  const img1 = await getImageData('/test1.png');
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

  res = await scanImageData(await getImageData('/test2.png'));
  expect(res).toHaveLength(1);
  expect(res[0].type).toEqual(ZBarSymbolType.ZBAR_QRCODE);
  expect(res[0].decode()).toEqual('中文測試');

  res = await scanImageData(await getImageData('/test3.png'));
  expect(res).toHaveLength(0);

  res = await scanImageData(await getImageData('/test4.png'));
  expect(res).toHaveLength(2);
  expect(res[0].type).toEqual(ZBarSymbolType.ZBAR_QRCODE);
  expect(res[0].decode()).toEqual('First');
  expect(res[1].type).toEqual(ZBarSymbolType.ZBAR_QRCODE);
  expect(res[1].decode()).toEqual('Second');
});

test('Barcode', async () => {
  let res;
  const img5 = await getImageData('/test5.png');
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

  scanner.destroy();
  await expect(scanImageData(img5, scanner)).rejects.toThrow(
    'Call after destroyed'
  );
});

test('orientations', async () => {
  const img6 = await getImageData('/test6.png');
  const orientations: Record<string, ZBarOrientation> = {
    'UP': ZBarOrientation.ZBAR_ORIENT_UP,
    'DOWN': ZBarOrientation.ZBAR_ORIENT_DOWN,
    'LEFT': ZBarOrientation.ZBAR_ORIENT_LEFT,
    'RIGHT': ZBarOrientation.ZBAR_ORIENT_RIGHT
  };

  expect(
    scanner.setConfig(
      ZBarSymbolType.ZBAR_CODE39,
      ZBarConfigType.ZBAR_CFG_ENABLE,
      1
    )
  ).toEqual(0);
  res = await scanImageData(img6, scanner);
  expect(res).toHaveLength(4);
  res.forEach(r => {
    const decoded = r.decode();
    const expectedOrientation = orientations[decoded];

    expect(r.type).toEqual(ZBarSymbolType.ZBAR_CODE39);
    expect(expectedOrientation).toBeDefined();
    expect(r.orientation).toEqual(expectedOrientation);
  })
});
