// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Activity List Query Interface POST /v1/activities/base/list */
export async function baseListActivitiesManagementController(
  body: RAPI.UserActivitiesManagementListAO,
  options?: { [key: string]: any },
) {
  return request<RAPI.ListVOActivitiesManagementVO>('/v1/activities/base/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
