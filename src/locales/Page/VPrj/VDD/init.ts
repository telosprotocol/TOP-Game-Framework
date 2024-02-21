import { TransTool } from '@/init/i18n';
import en from './en';
import id from './id';

const namespaceName = 'VDD';
/**
 *  V  -DST  -VDD
 */
export function tryMergeLocalesForVPrjDSTDetail() {
  TransTool.Instance.mergeMessages('en', namespaceName, en);
  TransTool.Instance.mergeMessages('id', namespaceName, id);
}
