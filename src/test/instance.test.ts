import { getInstance } from '../instance';

test('WASM Instance', async () => {
  const decoder = new TextDecoder();
  const inst = await getInstance();
  for (let i = 0; i < 100; ++i) {
    const ptr = inst._malloc(1000);
    const HEAP8 = inst.HEAP8;
    for (let j = 0; j < 1000; ++j) {
      HEAP8[ptr + j] = 127;
    }
  }
});
