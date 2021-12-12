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

  let b1 = inst.HEAP8.buffer;
  let bfr = inst._malloc(1000);
  expect(inst.HEAP8.buffer).toBe(b1);
  inst._free(bfr);

  bfr = inst._malloc(100000000);
  let b2 = inst.HEAP8.buffer;
  expect(b2).not.toBe(b1);
  b1 = b2;

  for (let i = 0; i < 100; ++i) {
    res = await scanImageData(img4);
    expect(res).toHaveLength(2);

    inst._free(bfr);
    bfr = inst._malloc(100000000);
    b2 = inst.HEAP8.buffer;
  }

  // Note: memory buffer and views may not need to be updated on *every*
  // _malloc() call.
  expect(b2).not.toBe(b1);
  inst._free(bfr);
});
