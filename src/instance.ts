import { loadWasmInstance } from './load';
import ZBar from './ZBar';

let inst: ZBar | null = null;
let HEAPU8 = new Uint8Array();
let HEAP32 = new Int32Array();

const UTF8Decoder = new TextDecoder('utf8');
const UTF8ArrayToString = (u8Array: Uint8Array, idx: number): string => {
  var endPtr = idx;
  while (u8Array[endPtr]) {
    ++endPtr;
  }
  return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
};

export const UTF8ToString = (ptr: number): string => {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr) : '';
};

const proc_exit = (x: number) => {
  console.error('Proc_exit', x);
  throw x;
};

const clock_gettime = (clk_id: number, tp: number): number => {
  let now;
  if (clk_id === 0) {
    now = Date.now();
  } else {
    /* may need to set errorno, but we just skip the implementation here */
    // ___setErrNo(22);
    return -1;
  }
  HEAP32[tp >> 2] = (now / 1e3) | 0;
  HEAP32[(tp + 4) >> 2] = ((now % 1e3) * 1e3 * 1e3) | 0;
  return 0;
};

const buffers = [null, [], []];
const printCharWithBuffer = (stream: number, curr: number) => {
  const buffer: Array<number> = buffers[stream] || [];
  if (curr === 0 || curr === 10) {
    (stream === 1 ? console.log : console.error)(
      UTF8ArrayToString(Uint8Array.from(buffer), 0)
    );
    buffer.length = 0;
  } else {
    buffer.push(curr);
  }
};

const ___wasi_fd_write = (
  fd: number,
  iov: number,
  iovcnt: number,
  pnum: number
): number => {
  var num = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = HEAP32[(iov + i * 8) >> 2];
    var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
    for (var j = 0; j < len; j++) {
      printCharWithBuffer(fd, HEAPU8[ptr + j]);
    }
    num += len;
  }
  HEAP32[pnum >> 2] = num;
  return 0;
};

const ___wasi_fd_close = () => {
  return 0;
};

const ___wasi_fd_seek = () => {
  return 0;
};

let lastGrowTimestamp = 0;
const emscripten_notify_memory_growth = (idx: number) => {
  if (lastGrowTimestamp) {
    console.info('zbar.wasm: Memory Grow: ', inst!.memory.buffer.byteLength);
  }
  lastGrowTimestamp = Date.now();
  HEAPU8 = new Uint8Array(inst!.memory.buffer);
  HEAP32 = new Int32Array(inst!.memory.buffer);
};

const importObj = {
  env: {
    clock_gettime,
    emscripten_notify_memory_growth
  },
  wasi_snapshot_preview1: {
    fd_write: ___wasi_fd_write,
    fd_close: ___wasi_fd_close,
    fd_seek: ___wasi_fd_seek,
    proc_exit
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
