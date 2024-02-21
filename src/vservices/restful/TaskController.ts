// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** No login online earning taskGroup data POST /v1/task/noLogin/group/status */
export async function noLoginTaskListStatusTaskController(
  body: RAPI.TaskGroupQueryAO,
  options?: { [key: string]: any },
) {
  return request<RAPI.ListVOTaskItemVO>('/v1/task/noLogin/group/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
