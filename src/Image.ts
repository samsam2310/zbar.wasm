import { getInstance } from './instance';
import CppObject from './CppObject';

export default class Image extends CppObject {
  // public static getFourccFromString(input: string): number {
  //   let res = 0;
  //   if (input.length === 2 ) {
  //     input += '  ';
  //   }
  //   if (input.length !== 4) {
  //     throw Error('Wrong fourcc format');
  //   }

  //   for (let i = 3; i >= 0; --i) {
  //     res <<= 8;
  //     res |= input.charCodeAt(i);
  //   }
  //   return res;
  // }

  // public static isScanableFormat(format: string | number): boolean {
  //   if (typeof format === 'string') {
  //     format = this.getFourccFromString(format);
  //   }
  //   return format === 0x30303859 || format === 0x20203859 || format === 0x59455247;
  // }

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

  destory(): void {
    this.checkAlive();
    this.inst.Image_destory(this.ptr);
    this.ptr = 0;
  }

  // convert(format: string | number, width?: number, height?: number): Image {
  //   this.checkAlive();
  //   if (typeof format === 'string') {
  //     format = Image.getFourccFromString(format);
  //   }
  //   if (width === undefined && height === undefined) {
  //     const res = this.inst.Image_convert(this.ptr, format);
  //     console.log('Convert: ', res);
  //     return new Image(res, this.inst);
  //   }
  //   if (width && height) {
  //     const res = this.inst.Image_convert_resize(this.ptr, format, width, height);
  //     return new Image(res, this.inst);
  //   }
  //   throw TypeError('invalid arguments');
  // }

  getSymbols(): any {
    // TODO
    return {};
  }
}
