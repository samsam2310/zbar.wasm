import { getImageData } from './utils';
import { getInstance } from '../instance';
import { scanImageData } from '../module';
import { test, expect } from './utils';

test('Multiple Scan Test', async () => {
  const inst = await getInstance();
  let res;
  const img4 = await getImageData('/test4.png');
  res = await scanImageData(img4);
  expect(res).toHaveLength(2);
  const b = inst.HEAP8.buffer;

  for (let i = 0; i < 100; ++i) {
    res = await scanImageData(img4);
    expect(res).toHaveLength(2);
    expect(inst.HEAP8.buffer).toBe(b);
  }
});
