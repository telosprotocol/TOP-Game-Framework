// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Cliam reward  PUT /v1/task/complete/${param0} */
export async function completeTaskCenterController(
  //      Param   ( body  swagger        )
  params: API.completeTaskCenterControllerParams,
  options?: { [key: string]: any }
) {
  const { taskDict: param0, ...queryParams } = params;
  return request<API.BaseVO>(`/v1/task/complete/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Complete a game lobby mission PUT /v1/task/done/${param0} */
export async function doneTaskCenterController(
  //      Param   ( body  swagger        )
  params: API.doneTaskCenterControllerParams,
  options?: { [key: string]: any }
) {
  const { taskDict: param0, ...queryParams } = params;
  return request<API.BaseVO>(`/v1/task/done/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** View the list of invited friends task details POST /v1/task/invite/detail */
export async function inviteDetailTaskCenterController(
  body: API.PageAO,
  options?: { [key: string]: any }
) {
  return request<API.PageVOInviteFriendInfoItemVO>('/v1/task/invite/detail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** User task list GET /v1/task/self/list/ */
export async function selfTaskListTaskCenterController(options?: {
  [key: string]: any;
}) {
  return request<API.ListVOTaskSeriesVO>('/v1/task/self/list/', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Task data reporting V2 PUT /v2/task/report/data */
export async function reportDateV2TaskCenterController(
  body: API.TaskReportDataV2AO,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOTaskReportResultVO>('/v2/task/report/data', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** User task list V2 GET /v2/task/self/list/ */
export async function selfTaskListV2TaskCenterController(options?: {
  [key: string]: any;
}) {
  return request<API.ListVOTaskSeriesVO>('/v2/task/self/list/', {
    method: 'GET',
    ...(options || {}),
  });
}
