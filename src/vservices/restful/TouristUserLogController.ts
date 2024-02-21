// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Record information of novice guide for tourists visiting POST /v1/tourist/user */
export async function saveTouristUserLogController(
  body: RAPI.TouristUserLogAO,
  options?: { [key: string]: any }
) {
  return request<RAPI.ObjectVOLong>('/v1/tourist/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Have tourist users completed beginner guidance GET /v1/tourist/user/device */
export async function isCompletedNoviceGuideTouristUserLogController(
  //      Param   ( body  swagger        )
  params: RAPI.isCompletedNoviceGuideTouristUserLogControllerParams,
  options?: { [key: string]: any }
) {
  return request<RAPI.ObjectVOBoolean>('/v1/tourist/user/device', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
