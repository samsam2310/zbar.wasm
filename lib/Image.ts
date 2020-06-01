import { getInstance, writeBuffer } from './instance';
import CppObject from './CppObject';

export default class Image extends CppObject {
  public static getFourccFromString(input: string): number {
    let res = 0;
    if (input.length === 2 ) {
      input += '  ';
    }
    if (input.length !== 4) {
      throw Error('Wrong fourcc format');
    }

    for (let i = 3; i >= 0; --i) {
      res <<= 8;
      res |= input.charCodeAt(i);
    }
    return res;
  }

  public static isScanableFormat(format: string | number): boolean {
    if (typeof format === 'string') {
      format = this.getFourccFromString(format);
    }
    return format === 0x30303859 || format === 0x20203859 || format === 0x59455247;
  }

  static async create(width: number, height: number, format: string | number, data: ArrayBuffer, sequence_num: number = 0): Promise<Image> {
    const inst = await getInstance();
    if (typeof format === 'string') {
      format = this.getFourccFromString(format);
    }
    const ptr = inst._Image_create.apply(null, width, height, format, writeBuffer(data), data.byteLength, sequence_num);
    return new this(ptr, inst);
  }

  destory(): void {
    this.checkAlive();
    this.inst._Image_destory.apply(null, this.ptr);
    this.ptr = 0;
  }

  convert() {
    ;
  }

  getSymbols() {
    ;
  }
}