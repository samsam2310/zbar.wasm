#!/bin/env -S deno run --allow-read --allow-write

import { base64Encode } from '../src/deps/base64.deno.ts';

const buildWasmTs = async (in_file: string, out_file: string) => {
  const input = await Deno.readFile(in_file);
  await Deno.writeTextFile(
    out_file, `export default '${base64Encode(input)}';`);
};

const main = async () => {
  if (Deno.args.length != 2) {
    console.error(
      `\nNo file argument.\nUsage: build-wasm-ts.deno.ts IN_FILE OUT_FILE`);
    Deno.exit(1);
  }
  await buildWasmTs(Deno.args[0], Deno.args[1]);
};

if (import.meta.main)
  main();
