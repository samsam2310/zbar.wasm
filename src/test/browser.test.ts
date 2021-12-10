import { loadWasmInstance }  from '../load-browser';

test('WASM Instance', async () => {
    const inst = await loadWasmInstance({});
    expect(inst).not.toBeFalsy()
    expect(inst?.HEAP8.byteLength).toBeGreaterThan(0)
  });
  