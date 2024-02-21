import { TransTool } from '@/init/i18n';
import en from './en';
import id from './id';

const namespaceName = 'VFAQ';
/**
 *  V  -FAQ&Feedback
 */
export function tryMergeLocalesForVPrjFAQ() {
  TransTool.Instance.mergeMessages('en', namespaceName, en);
  TransTool.Instance.mergeMessages('id', namespaceName, id);
}
