import ZBarInstance from './ZBarInstance';
import instantiate from './zbar.deno.js';
import WASM_BASE64 from './zbar.wasm.base64.deno.ts';
import { base64Decode } from './deps/base64.deno.ts';

export const loadWasmInstance = async (
  importObj: any
): Promise<ZBarInstance | null> => {
  importObj['wasmBinary'] = base64Decode(WASM_BASE64);
  return await instantiate(importObj);
};
