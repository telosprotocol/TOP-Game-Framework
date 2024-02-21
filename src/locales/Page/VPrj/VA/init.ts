import { TransTool } from '@/init/i18n';
import en from './en';
import id from './id';

const namespaceName = 'VA';
/**
 *  V  -
 */
export function tryMergeLocalesForVPrjAcademyCenter() {
  TransTool.Instance.mergeMessages('en', namespaceName, en);
  TransTool.Instance.mergeMessages('id', namespaceName, id);
}
