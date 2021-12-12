import ZBarInstance from './ZBarInstance';

export class CppObject {
  protected ptr: number;
  protected inst: ZBarInstance;

  protected constructor(ptr: number, inst: ZBarInstance) {
    this.ptr = ptr;
    this.inst = inst;
  }

  protected checkAlive(): void {
    if (this.ptr) return;
    throw Error('Call after destroyed');
  }

  getPointer(): number {
    this.checkAlive();
    return this.ptr;
  }
}
