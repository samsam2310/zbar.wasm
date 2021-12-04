/**
 * Webpack file-loader will not pack .wasm files correctly,
 * see https://github.com/webpack/webpack/issues/6725
 * Using extension .wasm.bin as a workaround. To facilitate
 * streaming compilation by the browser, .wasm.bin files
 * should be served as MIME type 'application/wasm'.
 */
 import ZBar from './ZBar';

 const instantiate = require('./zbar.bin')
 
 export const loadWasmInstance = async (
   importObj: any
 ): Promise<ZBar | null> => {
   return await instantiate(importObj);
 };
 