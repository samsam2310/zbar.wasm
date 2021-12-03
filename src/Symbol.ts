import { getInstance } from './instance';
import { ZBarSymbolType } from './enum';

export interface Point {
  x: number;
  y: number;
}

class TypePointer {
  protected ptr: number;
  protected ptr32: number;
  protected buf: ArrayBuffer;
  protected HEAP8: Int8Array;
  protected HEAP32: Int32Array;
  protected HEAPU32: Uint32Array;

  constructor(ptr: number, buf: ArrayBuffer) {
    this.ptr = ptr;
    this.ptr32 = ptr >> 2;
    this.buf = buf;
    this.HEAP8 = new Int8Array(buf);
    this.HEAPU32 = new Uint32Array(buf);
    this.HEAP32 = new Int32Array(buf);
  }
}

class SymbolPtr extends TypePointer {
  get type(): ZBarSymbolType {
    return this.HEAPU32[this.ptr32] as ZBarSymbolType;
  }

  get data(): Int8Array {
    const len = this.HEAPU32[this.ptr32 + 4];
    const ptr = this.HEAPU32[this.ptr32 + 5];
    return Int8Array.from(this.HEAP8.subarray(ptr, ptr + len));
  }

  get points(): Array<Point> {
    const len = this.HEAPU32[this.ptr32 + 7];
    const ptr = this.HEAPU32[this.ptr32 + 8];
    const ptr32 = ptr >> 2;
    const res = [];
    for (let i = 0; i < len; ++i) {
      const x = this.HEAP32[ptr32 + i * 2];
      const y = this.HEAP32[ptr32 + i * 2 + 1];
      res.push({ x, y } as Point);
    }
    return res;
  }

  get next(): SymbolPtr | null {
    const ptr = this.HEAPU32[this.ptr32 + 11];
    if (!ptr) return null;
    return new SymbolPtr(ptr, this.buf);
  }

  get time(): number {
    return this.HEAPU32[this.ptr32 + 13];
  }

  get cacheCount(): number {
    return this.HEAP32[this.ptr32 + 14];
  }

  get quality(): number {
    return this.HEAP32[this.ptr32 + 15];
  }
}

class SymbolSetPtr extends TypePointer {
  get head(): SymbolPtr | null {
    const ptr = this.HEAPU32[this.ptr32 + 2];
    if (!ptr) return null;
    return new SymbolPtr(ptr, this.buf);
  }
}

export class Symbol {
  type: ZBarSymbolType;
  typeName: string;
  data: Int8Array;
  points: Array<Point>;
  time: number;
  cacheCount: number;
  quality: number;

  private constructor(ptr: SymbolPtr) {
    this.type = ptr.type;
    this.typeName = ZBarSymbolType[this.type];
    this.data = ptr.data;
    this.points = ptr.points;
    this.time = ptr.time;
    this.cacheCount = ptr.cacheCount;
    this.quality = ptr.quality;
  }

  static createSymbolsFromPtr(ptr: number, buf: ArrayBuffer): Array<Symbol> {
    if (ptr == 0) return [];

    const set = new SymbolSetPtr(ptr, buf);
    let symbol = set.head;
    const res = [];
    while (symbol !== null) {
      res.push(new Symbol(symbol));
      symbol = symbol.next;
    }
    return res;
  }

  decode(encoding?: string) {
    const decoder = new TextDecoder(encoding);
    return decoder.decode(this.data);
  }
}
