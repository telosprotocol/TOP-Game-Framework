import { TransTool } from '@/init/i18n';
import en from './en';
import id from './id';

const namespaceName = 'V_BM';
/**
 *  V  -
 */
export function tryMergeLocalesForVPrjBindMobile() {
  TransTool.Instance.mergeMessages('en', namespaceName, en);
  TransTool.Instance.mergeMessages('id', namespaceName, id);
}
