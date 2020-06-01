import { loadWasmInstance } from './load';

let instPromise = loadWasmInstance();

export const getInstance = async () => {
  const inst = await instPromise;
  if (!inst) {
    throw Error('WASM was not loaded');
  }
  return inst.exports;
};