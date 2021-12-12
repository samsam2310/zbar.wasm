import { loadWasmInstance } from './load';
import ZBarInstance from './ZBarInstance';

let inst: ZBarInstance | null = null;

let instPromise = (async () => {
  inst = await loadWasmInstance({});
  if (!inst) {
    throw Error('WASM was not loaded');
  }
  return inst;
})();

export const getInstance = async (): Promise<ZBarInstance> => {
  return await instPromise;
};
