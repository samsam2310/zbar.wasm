import ZBar from './ZBar';

export class CppObject {
  protected ptr: number;
  protected inst: ZBar;

  protected constructor(ptr: number, inst: ZBar) {
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
