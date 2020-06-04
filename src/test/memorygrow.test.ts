import { getImageData } from './utils';
import { getInstance, getMemoryGrowTimestamp } from '../instance';
import { scanImageData } from '../module';

test('Multiple Scan Test', async () => {
  const inst = await getInstance();
  const dir = __dirname + '/../../src/test';
  let res;
  const img4 = await getImageData(dir + '/test4.png');
  res = await scanImageData(img4);
  expect(res).toHaveLength(2);

  let t1 = getMemoryGrowTimestamp();
  inst.malloc(100000000);
  let t2 = getMemoryGrowTimestamp();
  expect(t1).not.toEqual(t2);
  t1 = t2;

  for (let i = 0; i < 100; ++i) {
    res = await scanImageData(img4);
    expect(res).toHaveLength(2);

    inst.malloc(655360);
    t2 = getMemoryGrowTimestamp();
    expect(t1).not.toEqual(t2);
    t1 = t2;
  }
});
