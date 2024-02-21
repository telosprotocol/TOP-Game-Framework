import { TransTool } from '@/init/i18n';
import en from './en';
import id from './id';

const namespaceName = 'VTT';
/**
 *  V  -
 */
export function tryMergeLocalesForVPrjTopupTutorial() {
  TransTool.Instance.mergeMessages('en', namespaceName, en);
  TransTool.Instance.mergeMessages('id', namespaceName, id);
}
