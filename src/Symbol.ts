import { getInstance } from './instance';

export enum ZBarSymbolType {
  ZBAR_NONE = 0 /**< no symbol decoded */,
  ZBAR_PARTIAL = 1 /**< intermediate status */,
  ZBAR_EAN8 = 8 /**< EAN-8 */,
  ZBAR_UPCE = 9 /**< UPC-E */,
  ZBAR_ISBN10 = 10 /**< ISBN-10 (from EAN-13). @since 0.4 */,
  ZBAR_UPCA = 12 /**< UPC-A */,
  ZBAR_EAN13 = 13 /**< EAN-13 */,
  ZBAR_ISBN13 = 14 /**< ISBN-13 (from EAN-13). @since 0.4 */,
  ZBAR_I25 = 25 /**< Interleaved 2 of 5. @since 0.4 */,
  ZBAR_CODE39 = 39 /**< Code 39. @since 0.4 */,
  ZBAR_PDF417 = 57 /**< PDF417. @since 0.6 */,
  ZBAR_QRCODE = 64 /**< QR Code. @since 0.10 */,
  ZBAR_CODE128 = 128 /**< Code 128 */,
  ZBAR_SYMBOL = 0x00ff /**< mask for base symbol type */,
  ZBAR_ADDON2 = 0x0200 /**< 2-digit add-on flag */,
  ZBAR_ADDON5 = 0x0500 /**< 5-digit add-on flag */,
  ZBAR_ADDON = 0x0700 /**< add-on flag mask */
}

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
    const len = this.HEAPU32[this.ptr32 + 2];
    const ptr = this.HEAPU32[this.ptr32 + 3];
    return Int8Array.from(this.HEAP8.subarray(ptr, ptr + len));
  }

  get points(): Array<Point> {
    const len = this.HEAPU32[this.ptr32 + 5];
    const ptr = this.HEAPU32[this.ptr32 + 6];
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
    const ptr = this.HEAPU32[this.ptr32 + 8];
    if (!ptr) return null;
    return new SymbolPtr(ptr, this.buf);
  }

  get time(): number {
    return this.HEAPU32[this.ptr32 + 10];
  }

  get cacheCount(): number {
    return this.HEAP32[this.ptr32 + 11];
  }

  get quality(): number {
    return this.HEAP32[this.ptr32 + 12];
  }
}

class SymbolSetPtr extends TypePointer {
  get nsyms(): number {
    return this.HEAP32[this.ptr32 + 1];
  }

  get head(): SymbolPtr | null {
    const ptr = this.HEAPU32[this.ptr32 + 2];
    if (!ptr) return null;
    return new SymbolPtr(ptr, this.buf);
  }
}

export class Symbol {
  data: Int8Array;
  points: Array<Point>;
  time: number;
  cacheCount: number;
  quality: number;

  private constructor(ptr: SymbolPtr) {
    this.data = ptr.data;
    this.points = ptr.points;
    this.time = ptr.time;
    this.cacheCount = ptr.cacheCount;
    this.quality = ptr.quality;
  }

  static async getSymbolsFromPtr(ptr: number): Promise<Array<Symbol>> {
    const inst = await getInstance();
    const buf = inst.memory.buffer;
    console.log('Symbol ptr', ptr);
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
