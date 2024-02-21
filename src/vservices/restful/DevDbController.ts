// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/**                       GET /devdoc/jdbc/table */
export async function tableDevDbController(options?: { [key: string]: any }) {
  return request<any>('/devdoc/jdbc/table', {
    method: 'GET',
    ...(options || {}),
  });
}

/**    GET /devdoc/listkeys */
export async function listkeysDevDbController(options?: {
  [key: string]: any;
}) {
  return request<RAPI.ListVOSecretKeyVO>('/devdoc/listkeys', {
    method: 'GET',
    ...(options || {}),
  });
}
