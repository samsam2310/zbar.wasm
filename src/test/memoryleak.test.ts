import { getImageData } from './utils';
import { getMemoryGrowTimestamp } from '../instance';
import { scanImageData } from '../module';

test('Multiple Scan Test', async () => {
  const dir = __dirname + '/../../src/test';
  let res;
  const img4 = await getImageData(dir + '/test4.png');
  res = await scanImageData(img4);
  expect(res).toHaveLength(2);
  const memoryGrowTimestamp = getMemoryGrowTimestamp();
  for (let i = 0; i < 100; ++i) {
    res = await scanImageData(img4);
    expect(res).toHaveLength(2);
    expect(getMemoryGrowTimestamp()).toEqual(memoryGrowTimestamp);
  }
});
