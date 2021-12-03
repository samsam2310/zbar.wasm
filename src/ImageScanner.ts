import { CppObject } from './CppObject';
import { Image } from './Image';
import { getInstance } from './instance';
import { Symbol } from './Symbol';
import { ZBarSymbolType, ZBarConfigType } from './enum';

export class ImageScanner extends CppObject {
  static async create(): Promise<ImageScanner> {
    const inst = await getInstance();
    const ptr = inst._ImageScanner_create();
    return new this(ptr, inst);
  }

  destroy(): void {
    this.checkAlive();
    this.inst._ImageScanner_destory(this.ptr);
    this.ptr = 0;
  }

  setConfig(sym: ZBarSymbolType, conf: ZBarConfigType, value: number): number {
    this.checkAlive();
    return this.inst._ImageScanner_set_config(this.ptr, sym, conf, value);
  }

  enableCache(enable: boolean = true): void {
    this.checkAlive();
    this.inst._ImageScanner_enable_cache(this.ptr, enable);
  }

  recycleImage(image: Image): void {
    this.checkAlive();
    this.inst._ImageScanner_recycle_image(this.ptr, image.getPointer());
  }

  getResults(): Array<Symbol> {
    this.checkAlive();
    const res = this.inst._ImageScanner_get_results(this.ptr);
    return Symbol.createSymbolsFromPtr(res, this.inst.HEAPU8.buffer);
  }

  scan(image: Image): number {
    this.checkAlive();
    return this.inst._ImageScanner_scan(this.ptr, image.getPointer());
  }
}
