// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/**     Key GET /upload/applykey */
export async function applyUploadController(options?: { [key: string]: any }) {
  return request<RAPI.ObjectVOString>('/upload/applykey', {
    method: 'GET',
    ...(options || {}),
  });
}

/**   STS   GET /upload/sts */
export async function stsUploadController(options?: { [key: string]: any }) {
  return request<RAPI.ObjectVOUploadStsVO>('/upload/sts', {
    method: 'GET',
    ...(options || {}),
  });
}
