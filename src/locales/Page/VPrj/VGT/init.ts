import { TransTool } from '@/init/i18n';
import en from './en';
import id from './id';

const namespaceName = 'VGT';
/**
 *  V  -  -
 */
export function tryMergeLocalesForVPrjGameTaskPage() {
  TransTool.Instance.mergeMessages('en', namespaceName, en);
  TransTool.Instance.mergeMessages('id', namespaceName, id);
}

//https://lanhuapp.com/web/#/item/project/detailDetach?pid=7c5e677d-d346-41e2-a7fe-4e05ff595138&image_id=9ea23e39-2302-4a2e-b367-4a1f84b623d7&tid=955cc2ba-ae29-457c-9fad-49c5ff01e8f1&project_id=7c5e677d-d346-41e2-a7fe-4e05ff595138&fromEditor=true&type=image
