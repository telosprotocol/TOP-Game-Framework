import { TransTool } from '@/init/i18n';
import en from './en';
import id from './id';

const namespaceName = 'VI';
/**
 *  V  -
 */
export function tryMergeLocalesForVPrjInvite() {
  TransTool.Instance.mergeMessages('en', namespaceName, en);
  TransTool.Instance.mergeMessages('id', namespaceName, id);
}
