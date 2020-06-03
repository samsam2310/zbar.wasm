const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

export const loadWasmInstance = async (
  importObj: any
): Promise<WebAssembly.Instance | null> => {
  const binary = await readFile(__dirname + '/zbar.wasm');
  const output = await WebAssembly.instantiate(binary, importObj);
  return output.instance;
};
