import LocalStorage, { IStorageItemOperators } from './LocalStorage';
const LOCALSTORAGE_VERSION = 1;

const KEY_ABTYPE = 'abtype';
export default class RemoteLocalStorage {
  private static _Instance: RemoteLocalStorage;
  static get Instance() {
    if (!RemoteLocalStorage._Instance) {
      RemoteLocalStorage._Instance = new RemoteLocalStorage();
    }
    return RemoteLocalStorage._Instance;
  }
  private ls: LocalStorage;
  private constructor() {
    this.ls = new LocalStorage({
      prefix: 'vdr_',
      version: LOCALSTORAGE_VERSION,
      timeout: 0,
      async: true,
    });

    this._abTypeOp = this.ls.createStorageItemOperators<'a' | 'b'>(
      KEY_ABTYPE,
      {}
    );
  }

  private _abTypeOp: IStorageItemOperators<'a' | 'b'>;

  get abType() {
    return this._abTypeOp;
  }
}
