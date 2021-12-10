import { loadWasmInstance } from './load';
import ZBar from './ZBar';

let inst: ZBar | null = null;

const importObj = {
  env: {
  }
};

let instPromise = (async () => {
  inst = await loadWasmInstance(importObj);
  if (!inst) {
    throw Error('WASM was not loaded');
  }
  return inst;
})();

export const getInstance = async (): Promise<ZBar> => {
  return await instPromise;
};
