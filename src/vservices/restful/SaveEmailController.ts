// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** save email POST /v1/email/saveEmail */
export async function saveSaveEmailController(
  body: RAPI.SaveEmailAO,
  options?: { [key: string]: any },
) {
  return request<RAPI.ObjectVOLong>('/v1/email/saveEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
