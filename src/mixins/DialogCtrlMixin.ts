import Vue from 'vue';
import Component from 'vue-class-component';
import type { VueClass } from 'vue-class-component/lib/declarations';

// type StatusBarMixinType = typeof StatusBarMixin

type KeyOfT<T> = keyof T;
/**
 *      mixin
 * @example
 * class ExpApp1 extends mixins(DialogCtrlMixin as DialogCtrlMixinCtor<{
 *  dlg1:boolean,
 *  dlg2:boolean,
 *  dlg3:boolean
 * }>){}
 * class ExpApp2 extends mixins(DialogCtrlMixin as DialogCtrlMixinCtorByType<'dlg1'|'dlg2'|'dlg3'>){}
 */
@Component({})
export default class DialogCtrlMixin<T> extends Vue {
  dlgCtrlModels: Partial<T> = {};

  openDialog(dlgName: KeyOfT<T>) {
    this.setDialogVisible(dlgName, true);
  }

  closeDialog(dlgName: KeyOfT<T>) {
    this.setDialogVisible(dlgName, false);
  }

  setDialogVisible(dlgName: KeyOfT<T>, isVisible: boolean) {
    this.$set(this.dlgCtrlModels, dlgName as string, isVisible);
  }
}

// DialogCtrlMixinCtor<{dlg1:boolean,dlg2:boolean}>
export type DialogCtrlMixinCtor<T> = VueClass<DialogCtrlMixin<T>>;

export type DialogCtrlDataType<K extends string> = {
  [dlgName in K]: boolean | undefined;
};

// DialogCtrlMixinCtorByType<'dlg1'|'dlg2'> ==  DialogCtrlMixinCtor<{dlg1:boolean,dlg2:boolean}>
export type DialogCtrlMixinCtorByType<K extends string> = DialogCtrlMixinCtor<
  DialogCtrlDataType<K>
>;
