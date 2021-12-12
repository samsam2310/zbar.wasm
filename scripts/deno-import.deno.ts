#!/bin/env -S deno run --allow-read --allow-write

const IMPORT_RE =
  /(import(?:[\s]+[^']+)*(?:[^{']*{[^}]+})? from '\.[\.]?\/)([^\.']+)'/g;
const EXPORT_RE =
  /(export \* from '\.\/)([^\.']+)'/g;

const patchImport = (input: string): string => {
  input = input.replaceAll(IMPORT_RE, '$1$2.deno.ts\'');
  input = input.replaceAll(EXPORT_RE, '$1$2.deno.ts\'');
  return input;
}

const patchImportOfFile = async (file: string) => {
  const input = await Deno.readTextFile(file);
  await Deno.writeTextFile(file, patchImport(input));
};

const main = async () => {
  if (Deno.args.length != 1) {
    console.error(`\nNo file argument.\nUsage: deno-import.deno.ts FILE`);
    Deno.exit(1);
  }
  await patchImportOfFile(Deno.args[0]);
};

if (import.meta.main)
  main();

export { patchImport };
