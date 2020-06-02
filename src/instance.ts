import { loadWasmInstance } from './load';
import ZBar from './ZBar';

const memory = new WebAssembly.Memory({ initial: 256 });
const heap = new Uint8Array(memory.buffer);

let instPromise = loadWasmInstance({ env: { memory } });
let inst: ZBar | null = null;

export const getInstance = async (): Promise<ZBar> => {
  const res = await instPromise;
  if (!res) {
    throw Error('WASM was not loaded');
  }
  inst = res.exports as ZBar;
  return inst;
};

const assertInst = () => {
  if (inst !== null) return;
  throw Error('Null wasm instance');
};

export const writeBuffer = (buffer: ArrayBuffer): number => {
  assertInst();
  const data = new Uint8Array(buffer);
  const ptr = inst!._malloc(data.byteLength);
  heap.set(data, ptr);
  return ptr;
};