import { TransTool } from '@/init/i18n';
import en from './en';
import id from './id';

const namespaceName = 'VRT';
/**
 *  V  -
 */
export function tryMergeLocalesForVPrjRechargeTransition() {
  TransTool.Instance.mergeMessages('en', namespaceName, en);
  TransTool.Instance.mergeMessages('id', namespaceName, id);
}
