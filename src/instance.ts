import { loadWasmInstance } from './load';
import ZBar from './ZBar';

let inst: ZBar | null = null;
let HEAP32 = new Int32Array();

const clock_gettime = (clk_id: number, tp: number): number => {
  const now = Date.now();
  HEAP32[tp >> 2] = (now / 1e3) | 0;
  HEAP32[(tp + 4) >> 2] = ((now % 1e3) * 1e3 * 1e3) | 0;
  return 0;
};

let lastGrowTimestamp = 0;
const emscripten_notify_memory_growth = (idx: number) => {
  if (lastGrowTimestamp) {
    console.info('zbar.wasm: Memory Grow: ', inst!.memory.buffer.byteLength);
  }
  lastGrowTimestamp = Date.now();
  HEAP32 = new Int32Array(inst!.memory.buffer);
};

const importObj = {
  env: {
    clock_gettime,
    emscripten_notify_memory_growth
  }
};

let instPromise = (async () => {
  const res = await loadWasmInstance(importObj);
  if (!res) {
    throw Error('WASM was not loaded');
  }
  inst = res.exports as ZBar;
  emscripten_notify_memory_growth(0);
  return inst;
})();

export const getInstance = async (): Promise<ZBar> => {
  return await instPromise;
};

export const getMemoryGrowTimestamp = (): number => {
  return lastGrowTimestamp;
};
