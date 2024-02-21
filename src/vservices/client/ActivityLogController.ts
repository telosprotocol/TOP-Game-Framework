// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Query activity information GET /v1/activity/activityDetail */
export async function activityDetailActivityLogController(
  //      Param   ( body  swagger        )
  params: API.activityDetailActivityLogControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOActivityDetailsVO>('/v1/activity/activityDetail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Query the first recharge activity GET /v1/activity/firstRecharge */
export async function firstRechargeActivityLogController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOFirstRechargeViewVO>(
    '/v1/activity/firstRecharge',
    {
      method: 'GET',
      ...(options || {}),
    }
  );
}

/** Query turnTable activities GET /v1/activity/turnTable */
export async function turnTableActivityLogController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOTurnTableVO>('/v1/activity/turnTable', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Get rewards from turnTable activities PUT /v1/activityLog/turnTable/play */
export async function turnTablePlayActivityLogController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOInteger>('/v1/activityLog/turnTable/play', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** Query the first bankruptcy activity GET /v2/activity/bankruptcyRecharge */
export async function bankruptcyRechargeActivityLogController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOFirstRechargeViewVO>(
    '/v2/activity/bankruptcyRecharge',
    {
      method: 'GET',
      ...(options || {}),
    }
  );
}

/** Query the first recharge activity GET /v2/activity/firstRecharge */
export async function firstRechargeV2ActivityLogController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOFirstRechargeViewVO>(
    '/v2/activity/firstRecharge',
    {
      method: 'GET',
      ...(options || {}),
    }
  );
}
