/**
 * Webpack File-loader will break when the extension is .wasm.
 * Changing the extension is a workaround. And because of this
 * |instantiateStreaming| is always failed due to wrong MIME type.
 * see https://github.com/webpack/webpack/issues/6725
 */
// import wasmBinaryFile from './zbar.wasm';
import wasmBinaryFile from './zbar.wasm.bin';

export const loadWasmInstance = async (
  importObj: any
): Promise<WebAssembly.Instance | null> => {
  // try {
  //   const output = await WebAssembly.instantiateStreaming(
  //     fetch(wasmBinaryFile),
  //     importObj
  //   );
  //   return output.instance;
  // } catch (err) {
  //   console.error('Wasm streaming compile failed: ' + err);
  //   console.error('Falling back to ArrayBuffer instantiation');
  // }
  const res = await fetch(wasmBinaryFile);
  if (!res['ok']) {
    console.error('Failed to load wasm binary file at ' + wasmBinaryFile);
    return null;
  }
  const binary = await res.arrayBuffer();
  const output = await WebAssembly.instantiate(binary, importObj);
  return output.instance;
};
