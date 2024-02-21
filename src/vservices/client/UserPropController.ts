// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Backpack props page query POST /v1/prop/page */
export async function queryPageUserPropController(
  body: API.UserPropPageAO,
  options?: { [key: string]: any },
) {
  return request<API.PageVOUserPropVO>('/v1/prop/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Use of backpack props PUT /v1/prop/use */
export async function propUseUserPropController(
  body: API.UserPropUseAO,
  options?: { [key: string]: any },
) {
  return request<API.BaseVO>('/v1/prop/use', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
