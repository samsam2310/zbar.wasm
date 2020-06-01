import { getInstance } from './instance';
import CppObject from './CppObject';

export default class ImageScanner extends CppObject {
  static async create(): Promise<ImageScanner> {
    const inst = await getInstance();
    const ptr = inst._ImageScanner_create.apply(null);
    return new this(ptr, inst);
  }

  destory(): void {
    this.checkAlive();
    this.inst._ImageScanner_destory.apply(null, this.ptr);
    this.ptr = 0;
  }

  setConfig() {
    ;
  }

  enableCache() {
    ;
  }

  recycleImage() {
    ;
  }

  getResults() {
    ;
  }

  scan() {
    ;
  }
}