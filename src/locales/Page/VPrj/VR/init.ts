import { TransTool } from '@/init/i18n';
import en from './en';
import id from './id';

const namespaceName = 'VR';
/**
 *  V  -  Tab
 */
export function tryMergeLocalesForVPrjRightTab() {
  TransTool.Instance.mergeMessages('en', namespaceName, en);
  TransTool.Instance.mergeMessages('id', namespaceName, id);
}
