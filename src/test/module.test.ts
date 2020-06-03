import { scanImageData } from '../module';
import { getImageData } from './utils';

test('scanImageData', async () => {
  const imgs = ['test1.png', 'test2.png', 'test3.png'];
  const dir = __dirname + '/../../src/test';
  await scanImageData(await getImageData(dir + '/test1.png'));
  await scanImageData(await getImageData(dir + '/test2.png'));
  await scanImageData(await getImageData(dir + '/test3.png'));
  return 0;
});
