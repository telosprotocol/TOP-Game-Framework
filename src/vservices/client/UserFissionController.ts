// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** User's online earning fission 7-day activity check-in POST /v1/user/fission/checkin */
export async function checkInUserFissionController(options?: { [key: string]: any }) {
  return request<API.BaseVO>('/v1/user/fission/checkin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** User's online earning fission 7-day check-in activity data GET /v1/user/fission/checkin/activity */
export async function checkinActivityUserFissionController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserFissionCheckInActivityVO>('/v1/user/fission/checkin/activity', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Manual claim invitation rewards GET /v1/user/fission/manual/reward */
export async function manualClaimInviteRewardUserFissionController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOTaskRewardVO>('/v1/user/fission/manual/reward', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Query invitation rewards info GET /v1/user/fission/query/invite/reward */
export async function queryInviteRewardUserFissionController(options?: { [key: string]: any }) {
  return request<API.ObjectVOFissionInviteVO>('/v1/user/fission/query/invite/reward', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Claim invitation rewards GET /v1/user/fission/reward */
export async function inviteRewardUserFissionController(options?: { [key: string]: any }) {
  return request<API.ObjectVOTaskRewardVO>('/v1/user/fission/reward', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Statistical data on users' online earnings fission GET /v1/user/fission/stat */
export async function statUserFissionController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserFissionAssetStatVO>('/v1/user/fission/stat', {
    method: 'GET',
    ...(options || {}),
  });
}

/** User Online Earnings Fission Task List - Novice/Daily Tasks GET /v1/user/fission/task/list */
export async function taskListUserFissionController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserFissionTaskVO>('/v1/user/fission/task/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** User earns fission tasks online and receives rewards in bulk GET /v1/user/fission/task/list/batch_reward */
export async function batchRewardUserFissionController(options?: { [key: string]: any }) {
  return request<API.ListVOTaskRewardVO>('/v1/user/fission/task/list/batch_reward', {
    method: 'GET',
    ...(options || {}),
  });
}

/** User Team Member List POST /v1/user/fission/team/list */
export async function teamListUserFissionController(
  body: API.UserFissionTeamMemberPageAO,
  options?: { [key: string]: any },
) {
  return request<API.PageVOUserFissionTeamMemberPageVO>('/v1/user/fission/team/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** User team data statistics GET /v1/user/fission/team/stat */
export async function teamStatUserFissionController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserFissionTeamStatVO>('/v1/user/fission/team/stat', {
    method: 'GET',
    ...(options || {}),
  });
}
