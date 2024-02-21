// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Pagination query of college content list POST /v1/college/center/page */
export async function pageCollegeCenterController(
  body: RAPI.CollegeCenterPageAO,
  options?: { [key: string]: any },
) {
  return request<RAPI.PageVOCollegeCenterPageVO>('/v1/college/center/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** College tab List GET /v1/college/center/tab/list */
export async function tabListCollegeCenterController(options?: { [key: string]: any }) {
  return request<RAPI.ListVOCollegeCenterTabListVO>('/v1/college/center/tab/list', {
    method: 'GET',
    ...(options || {}),
  });
}
