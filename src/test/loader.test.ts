import instantiate from '../zbar';
import { test, expect } from './utils';

test('WASM Instance', async () => {
  const inst = await instantiate({
    locateFile: (file: string, scriptDir: string) => {
      expect(file).toBe('zbar.wasm');
      return scriptDir + 'zbar.wasm';
    }
  });
  expect(inst).not.toBeFalsy();
  expect(inst?.HEAP8.byteLength).toBeGreaterThan(0);
});
