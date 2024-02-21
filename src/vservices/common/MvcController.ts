// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** health GET /health */
export async function healthMvcController(options?: { [key: string]: any }) {
  return request<CAPI.BaseVO>('/health', {
    method: 'GET',
    ...(options || {}),
  });
}
