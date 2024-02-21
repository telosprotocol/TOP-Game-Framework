// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Claim reward for app PUT /v1/task/claim/reward */
export async function rewardTaskController(
  body: API.TaskClaimRewardAO,
  options?: { [key: string]: any }
) {
  return request<API.ListVOTaskRewardVO>('/v1/task/claim/reward', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Get task status of task group PUT /v1/task/group/status */
export async function taskListStatusTaskController(
  body: API.TaskGroupQueryAO,
  options?: { [key: string]: any }
) {
  return request<API.ListVOTaskItemVO>('/v1/task/group/status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Get task status of growth plan group GET /v1/task/growthPlan */
export async function growthPlanTaskController(options?: {
  [key: string]: any;
}) {
  return request<API.ListVOTaskItemVO>('/v1/task/growthPlan', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Task data reporting PUT /v1/task/report/progress */
export async function progressReportTaskController(
  body: API.TaskProgressReportAO,
  options?: { [key: string]: any }
) {
  return request<API.ListVOTaskRewardVO>('/v1/task/report/progress', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Simple task progress reporting PUT /v1/task/report/simple */
export async function simpleProgressReportTaskController(
  body: API.TaskSimpleProgressReportAO,
  options?: { [key: string]: any }
) {
  return request<API.ListVOTaskRewardVO>('/v1/task/report/simple', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Claim reward PUT /v1/task/reward/${param0} */
export async function completeTaskController(
  //      Param   ( body  swagger        )
  params: API.completeTaskControllerParams,
  options?: { [key: string]: any }
) {
  const { taskId: param0, ...queryParams } = params;
  return request<API.ListVOTaskRewardVO>(`/v1/task/reward/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Claim task reward and exchange to game coin PUT /v1/task/reward/game/coin */
export async function claimRewardToGameCoinTaskController(
  body: API.TaskRewardGameCoinAO,
  options?: { [key: string]: any }
) {
  return request<API.ListVOTaskRewardVO>('/v1/task/reward/game/coin', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Claim vgame novice welcome task reward PUT /v1/task/vgame/claim/novice/${param0} */
export async function vGameClaimNoviceTaskController(
  //      Param   ( body  swagger        )
  params: API.vGameClaimNoviceTaskControllerParams,
  options?: { [key: string]: any }
) {
  const { taskId: param0, ...queryParams } = params;
  return request<API.ListVOTaskRewardVO>(
    `/v1/task/vgame/claim/novice/${param0}`,
    {
      method: 'PUT',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** Claim vgame tomorrow gift task reward PUT /v1/task/vgame/claim/tomorrow/gift/${param0} */
export async function vGameClaimTomorrowGiftTaskController(
  //      Param   ( body  swagger        )
  params: API.vGameClaimTomorrowGiftTaskControllerParams,
  options?: { [key: string]: any }
) {
  const { taskId: param0, ...queryParams } = params;
  return request<API.ListVOTaskRewardVO>(
    `/v1/task/vgame/claim/tomorrow/gift/${param0}`,
    {
      method: 'PUT',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** Get task status of vgame novice group GET /v1/task/vgame/novice */
export async function vGameNoviceTaskController(options?: {
  [key: string]: any;
}) {
  return request<API.ListVOTaskItemVO>('/v1/task/vgame/novice', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Get task status of vgame novice five days tasks group GET /v1/task/vgame/novice/fiveDays */
export async function vGameNoviceFiveDaysTaskController(options?: {
  [key: string]: any;
}) {
  return request<API.ListVOTaskGroupStatusVO>(
    '/v1/task/vgame/novice/fiveDays',
    {
      method: 'GET',
      ...(options || {}),
    }
  );
}

/** Get task status of vgame tomorrow gift group GET /v1/task/vgame/tomorrow/gift */
export async function vGameTomorrowGiftTaskController(options?: {
  [key: string]: any;
}) {
  return request<API.ListVOTaskItemVO>('/v1/task/vgame/tomorrow/gift', {
    method: 'GET',
    ...(options || {}),
  });
}
