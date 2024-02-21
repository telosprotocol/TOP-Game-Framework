import { TransTool } from '@/init/i18n';
import en from './en';
import id from './id';

const namespaceName = 'VTR';
/**
 *  V  -    2023-07-05
 */
export function tryMergeLocalesForVPrjTopupRanking() {
  TransTool.Instance.mergeMessages('en', namespaceName, en);
  TransTool.Instance.mergeMessages('id', namespaceName, id);
}
