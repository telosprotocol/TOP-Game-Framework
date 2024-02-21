import type BaseDlgMixin from './BaseDlgMixin';

export class GlobalDlgStack {
  _stack: BaseDlgMixin[] = [];
  private static _Ins: GlobalDlgStack;
  static get Instance() {
    if (!GlobalDlgStack._Ins) {
      GlobalDlgStack._Ins = new GlobalDlgStack();
    }
    return GlobalDlgStack._Ins;
  }
  private constructor() {}
  enableStack() {
    this.isEnabled = true;
  }
  private isEnabled = false;

  push(dlg: BaseDlgMixin) {
    if (!this.isEnabled) {
      return;
    }
    this.delete(dlg);
    this._stack.push(dlg);
  }
  delete(dlg: BaseDlgMixin) {
    if (!this.isEnabled) {
      return false;
    }
    const idx = this._stack.findIndex((item) => {
      return dlg === item;
    });
    if (idx >= 0) {
      this._stack.splice(idx, 1);
      return true;
    }
    return false;
  }

  getNextPopDlg() {
    if (this._stack.length === 0) {
      return null;
    }
    return this._stack[this._stack.length - 1];
  }

  pop() {
    if (!this.isEnabled) {
      return;
    }
    return this._stack.pop();
  }
}
