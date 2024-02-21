// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Activity List Query Interface POST /v1/activities/list */
export async function listActivitiesManagementController(
  body: API.UserActivitiesManagementListAO,
  options?: { [key: string]: any },
) {
  return request<API.ListVOActivitiesManagementVO>('/v1/activities/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
