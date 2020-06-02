import { loadWasmInstance } from './load';
import ZBar from './ZBar';

let inst: ZBar | null = null;
let HEAPU8 = new Uint8Array();
let HEAP32 = new Int32Array();

// const memory = new WebAssembly.Memory({ initial: 256 });
// const table = new WebAssembly.Table({
//  "initial": 577,
//  "maximum": 577,
//  "element": "anyfunc"
// });

const UTF8Decoder =
  typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

const UTF8ArrayToString = (
  u8Array: Uint8Array | Array<number>,
  idx: number
): string => {
  var endPtr = idx;
  while (u8Array[endPtr]) ++endPtr;
  if (endPtr - idx > 16 && u8Array instanceof Uint8Array && UTF8Decoder) {
    return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
  } else {
    var str = '';
    while (idx < endPtr) {
      var u0 = u8Array[idx++];
      if (!(u0 & 128)) {
        str += String.fromCharCode(u0);
        continue;
      }
      var u1 = u8Array[idx++] & 63;
      if ((u0 & 224) == 192) {
        str += String.fromCharCode(((u0 & 31) << 6) | u1);
        continue;
      }
      var u2 = u8Array[idx++] & 63;
      if ((u0 & 240) == 224) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (u8Array[idx++] & 63);
      }
      if (u0 < 65536) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 65536;
        str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
      }
    }
  }
  return str;
};

export const UTF8ToString = (ptr: number): string => {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr) : '';
};

// const abort = (what: string): never => {
//   console.error('WebAssembly.RuntimeError: abort(' + what + ').');
//   throw new WebAssembly.RuntimeError();
// };

// function abortStackOverflow(allocSize: number) {
//   abort('Stack overflow! Attempted to allocate ' + allocSize + ' bytes on the stack, but stack has only ' +  '---skip---' + ' bytes available!');
// }

// function abortFnPtrError(ptr: number, sig: any) {
//   abort("Invalid function pointer " + ptr + " called with signature '" + sig + "'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this). Build with ASSERTIONS=2 for more info.");
// }

// function nullFunc_ii(x: number) { abortFnPtrError(x, 'ii'); }
// function nullFunc_iidiiii(x: number) { abortFnPtrError(x, 'iidiiii'); }
// function nullFunc_iii(x: number) { abortFnPtrError(x, 'iii'); }
// function nullFunc_iiii(x: number) { abortFnPtrError(x, 'iiii'); }
// function nullFunc_jiji(x: number) { abortFnPtrError(x, 'jiji'); }
// function nullFunc_v(x: number) { abortFnPtrError(x, 'v'); }
// function nullFunc_vi(x: number) { abortFnPtrError(x, 'vi'); }
// function nullFunc_vii(x: number) { abortFnPtrError(x, 'vii'); }
// function nullFunc_viiii(x: number) { abortFnPtrError(x, 'viiii'); }
// function nullFunc_viiiii(x: number) { abortFnPtrError(x, 'viiiii'); }
// function nullFunc_viiiiii(x: number) { abortFnPtrError(x, 'viiiiii'); }

// function ___lock() {}

// function ___unlock() {}
// const setTempRet0 = function(value:number) {
// tempRet0 = value;
// };

// const _abort = (): never => {
//   return abort('');
// };

const proc_exit = (x: number) => {
  console.error('Proc_exit', x);
};

// const ___assert_fail = (
//   condition: number,
//   filename: number,
//   line: number,
//   func: number
// ): never => {
//   return abort(
//     'Assertion failed: ' +
//       UTF8ToString(condition) +
//       ', at: ' +
//       [
//         filename ? UTF8ToString(filename) : 'unknown filename',
//         line,
//         func ? UTF8ToString(func) : 'unknown function'
//       ]
//   );
// };

// const ___cxa_throw = (ptr: number, type: any, destructor: any): never => {
//   console.log('GG');
//   throw ptr;
// };

// const ___cxa_allocate_exception = (size: number): number => {
//   console.log('GG');
//   return inst!._malloc(size);
// };

// const _emscripten_memcpy_big = (
//   dest: number,
//   src: number,
//   num: number
// ): void => {
//   console.log('GG');
//   HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
// };

// const _emscripten_get_heap_size = (): number => {
//   console.log('GG HEP', HEAPU8.byteLength);
//   return HEAPU8.byteLength;
// };

// const ___setErrNo = (value: number): void => {
//   console.log('GG');
//   HEAP32[inst!.___errno_location() >> 2] = value;
// };

const clock_gettime = (clk_id: number, tp: number): number => {
  console.log('GG');
  let now;
  if (clk_id === 0) {
    now = Date.now();
  } else {
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
    (stream === 1 ? console.log : console.error)(UTF8ArrayToString(buffer, 0));
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
  console.log('GG');
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

// const emscripten_realloc_buffer = (size: number): boolean => {
//   console.log('GG');
//   try {
//     memory.grow((size - memory.buffer.byteLength + 65535) >> 16);
//     HEAPU8 = new Uint8Array(memory.buffer);
//     HEAP32 = new Int32Array(memory.buffer);
//     return true;
//   } catch (e) {
//     console.error(e);
//     return false;
//   }
// };

// const alignUp = (x: number, multiple: number): number => {
//   x += multiple - 1;
//   x -= x % multiple;
//   return x;
// };

// const _emscripten_resize_heap = (requestedSize: number) => {
//   console.log('Resize heap!!!!!');
//   const oldSize = _emscripten_get_heap_size();
//   const PAGE_MULTIPLE = 65536;
//   const LIMIT = 2147483648 - PAGE_MULTIPLE;
//   if (requestedSize > LIMIT) {
//     return false;
//   }
//   const MIN_TOTAL_MEMORY = 16777216;
//   let newSize = Math.max(oldSize, MIN_TOTAL_MEMORY);
//   while (newSize < requestedSize) {
//     if (newSize <= 536870912) {
//       newSize = alignUp(2 * newSize, PAGE_MULTIPLE);
//     } else {
//       newSize = Math.min(
//         alignUp((3 * newSize + 2147483648) / 4, PAGE_MULTIPLE),
//         LIMIT
//       );
//     }
//   }
//   return emscripten_realloc_buffer(newSize);
// };

// const _llvm_trap = () => {
//  abort("trap!");
// };

const emscripten_notify_memory_growth = (idx: number) => {
  HEAPU8 = new Uint8Array(inst!.memory.buffer);
  HEAP32 = new Int32Array(inst!.memory.buffer);
};

const importObj = {
  env: {
    // ___assert_fail,
    // abort,
    // ___cxa_throw,
    // ___cxa_allocate_exception,
    // _abort,
    // _emscripten_memcpy_big,
    // _emscripten_get_heap_size,
    // _clock_gettime,
    // ___wasi_fd_seek,
    // ___wasi_fd_close,
    // ___wasi_fd_write,
    // _emscripten_resize_heap,
    // _llvm_trap,
    // __table_base: 0,
    // table,
    // memory,

    // abortStackOverflow,
    // nullFunc_ii,
    // nullFunc_iidiiii,
    // nullFunc_iii,
    // nullFunc_iiii,
    // nullFunc_jiji,
    // nullFunc_v,
    // nullFunc_vi,
    // nullFunc_vii,
    // nullFunc_viiii,
    // nullFunc_viiiii,
    // nullFunc_viiiiii,
    // ___lock,
    // ___unlock,
    // setTempRet0,
    // __memory_base: 1024,
    // tempDoublePtr: 3936,

    clock_gettime,
    emscripten_notify_memory_growth
  },
  wasi_snapshot_preview1: {
    fd_write: ___wasi_fd_write,
    fd_close: ___wasi_fd_close,
    fd_seek: ___wasi_fd_seek,
    proc_exit
  }
  // global: {
  //   "NaN": NaN,
  //   Infinity: Infinity,
  // },
};

let instPromise = loadWasmInstance(importObj);

export const getInstance = async (): Promise<ZBar> => {
  const res = await instPromise;
  if (!res) {
    throw Error('WASM was not loaded');
  }
  inst = res.exports as ZBar;
  emscripten_notify_memory_growth(0);
  return inst;
};

// const assertInst = () => {
//   if (inst !== null) return;
//   throw Error('Null wasm instance');
// };

// export const writeBuffer = (buffer: ArrayBuffer): number => {
//   assertInst();
//   const data = new Uint8Array(buffer);
//   // console.log(inst);
//   const ptr = inst!.malloc(data.byteLength);
//   // console.log('Write ', ptr);
//   const heap = new Uint8Array(inst!.memory.buffer);
//   heap.set(data, ptr);
//   // HEAPU8.set(data, ptr);
//   return ptr;
// };
