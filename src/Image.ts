import { CppObject } from './CppObject';
import { Symbol } from './Symbol';
import { getInstance } from './instance';

export class Image extends CppObject {
  static async createFromGrayBuffer(
    width: number,
    height: number,
    dataBuf: ArrayBuffer,
    sequence_num: number = 0
  ): Promise<Image> {
    const inst = await getInstance();
    const heap = new Uint8Array(inst.memory.buffer);
    const data = new Uint8Array(dataBuf);
    const len = width * height;
    if (len !== data.byteLength) {
      throw Error('dataBuf does not match width and height');
    }
    const buf = inst.malloc(len);
    heap.set(data, buf);
    const ptr = inst.Image_create(
      width,
      height,
      0x30303859 /* Y800 */,
      buf,
      len,
      sequence_num
    );
    return new this(ptr, inst);
  }

  static async createFromRGBABuffer(
    width: number,
    height: number,
    dataBuf: ArrayBuffer,
    sequence_num: number = 0
  ): Promise<Image> {
    const inst = await getInstance();
    const heap = new Uint8Array(inst.memory.buffer);
    const data = new Uint8Array(dataBuf);
    const len = width * height;
    if (len * 4 !== data.byteLength) {
      throw Error('dataBuf does not match width and height');
    }
    const buf = inst.malloc(len);
    for (let i = 0; i < len; ++i) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      heap[buf + i] = (r * 19595 + g * 38469 + b * 7472) >> 16;
    }
    const ptr = inst.Image_create(
      width,
      height,
      0x30303859 /* Y800 */,
      buf,
      len,
      sequence_num
    );
    return new this(ptr, inst);
  }

  destroy(): void {
    this.checkAlive();
    this.inst.Image_destory(this.ptr);
    this.ptr = 0;
  }

  getSymbols(): Array<Symbol> {
    this.checkAlive();
    const res = this.inst.Image_get_symbols(this.ptr);
    return Symbol.createSymbolsFromPtr(res, this.inst.memory.buffer);
  }
}
