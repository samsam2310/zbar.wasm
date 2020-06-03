import { getInstance } from './instance';
import CppObject from './CppObject';
import Image from './Image';

export default class ImageScanner extends CppObject {
  static async create(): Promise<ImageScanner> {
    const inst = await getInstance();
    const ptr = inst.ImageScanner_create();
    return new this(ptr, inst);
  }

  destory(): void {
    this.checkAlive();
    this.inst.ImageScanner_destory(this.ptr);
    this.ptr = 0;
  }

  setConfig() {}

  enableCache() {}

  recycleImage() {}

  getResults() {}

  scan(image: Image): number {
    this.checkAlive();
    return this.inst.ImageScanner_scan(this.ptr, image.getPointer());
  }
}
