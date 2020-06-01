import wasmBinaryFile from './zbar.wasm';

export const loadWasmInstance = async () => {
  try {
    const output = await WebAssembly.instantiateStreaming(fetch(wasmBinaryFile));
    return output.instance;
  } catch (err) {
    // The most common failure cause to be a bad MIME type for the binary,
    // in which case falling back to ArrayBuffer instantiation should work.
    console.error('Wasm streaming compile failed: ' + err);
    console.error('Falling back to ArrayBuffer instantiation');
  }
  const res = await fetch(wasmBinaryFile);
  if (!res['ok']) {
    console.error('Failed to load wasm binary file at ' + wasmBinaryFile);
    return null;
  }
  const binary = await res.arrayBuffer();
  const output = await WebAssembly.instantiate(binary);
  return output.instance;
};
