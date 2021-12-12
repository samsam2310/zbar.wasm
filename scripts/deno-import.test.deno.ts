import { assertEquals } from '../src/deps/asserts.deno.ts';
import { patchImport } from './deno-import.deno.ts';

const TEST_FILE = `
import ZBarInstance from './ZBarInstance';
import TEST, { CppObject } from './CppObject';
import {
  ZBarSymbolType,
  ZBarConfigType
} from './enum';
import TEST, {
  ZBarSymbolType,
  ZBarConfigType
} from './enum';
export * from './Image';
import ZBarInstance from '../ZBarInstance';

import ZBarInstance from './ZBarInstance.deno.ts';
`;

const EXPECT_TEST_FILE= `
import ZBarInstance from './ZBarInstance.deno.ts';
import TEST, { CppObject } from './CppObject.deno.ts';
import {
  ZBarSymbolType,
  ZBarConfigType
} from './enum.deno.ts';
import TEST, {
  ZBarSymbolType,
  ZBarConfigType
} from './enum.deno.ts';
export * from './Image.deno.ts';
import ZBarInstance from '../ZBarInstance.deno.ts';

import ZBarInstance from './ZBarInstance.deno.ts';
`;

Deno.test('patchImport', () => {
  const out = patchImport(TEST_FILE);
  assertEquals(out, EXPECT_TEST_FILE);
})
