import { CppObject } from './CppObject';
import { Image } from './Image';
import { getInstance } from './instance';
import { Symbol } from './Symbol';
import { ZBarSymbolType, ZBarConfigType } from './enum';

export class ImageScanner extends CppObject {
  static async create(): Promise<ImageScanner> {
    const inst = await getInstance();
    const ptr = inst.ImageScanner_create();
    return new this(ptr, inst);
  }

  destroy(): void {
    this.checkAlive();
    this.inst.ImageScanner_destory(this.ptr);
    this.ptr = 0;
  }

  setConfig(sym: ZBarSymbolType, conf: ZBarConfigType, value: number): number {
    this.checkAlive();
    return this.inst.ImageScanner_set_config(this.ptr, sym, conf, value);
  }

  enableCache(enable: boolean = true): void {
    this.checkAlive();
    this.inst.ImageScanner_enable_cache(this.ptr, enable);
  }

  recycleImage(image: Image): void {
    this.checkAlive();
    this.inst.ImageScanner_recycle_image(this.ptr, image.getPointer());
  }

  getResults(): Array<Symbol> {
    this.checkAlive();
    const res = this.inst.ImageScanner_get_results(this.ptr);
    return Symbol.createSymbolsFromPtr(res, this.inst.memory.buffer);
  }

  scan(image: Image): number {
    this.checkAlive();
    return this.inst.ImageScanner_scan(this.ptr, image.getPointer());
  }
}
