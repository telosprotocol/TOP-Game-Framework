// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** No login online earning fission 7-day check-in activity data GET /v1/user/fission/noLogin/checkin/activity */
export async function noLoginCheckinActivityUserFissionController(options?: {
  [key: string]: any;
}) {
  return request<RAPI.ObjectVOUserFissionCheckInActivityVO>(
    '/v1/user/fission/noLogin/checkin/activity',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** Statistical data on users' online earnings fission GET /v1/user/fission/noLogin/stat */
export async function noLoginStatUserFissionController(options?: { [key: string]: any }) {
  return request<RAPI.ObjectVOUserFissionAssetStatVO>('/v1/user/fission/noLogin/stat', {
    method: 'GET',
    ...(options || {}),
  });
}

/** No login online Earnings Fission Task List - Novice/Daily Tasks GET /v1/user/fission/noLogin/task/list */
export async function noLoginTaskListUserFissionController(options?: { [key: string]: any }) {
  return request<RAPI.ObjectVOUserFissionTaskVO>('/v1/user/fission/noLogin/task/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Total distribution amount GET /v1/user/fission/total/delivered */
export async function totalDeliveredUserFissionController(options?: { [key: string]: any }) {
  return request<RAPI.ObjectVOBigDecimal>('/v1/user/fission/total/delivered', {
    method: 'GET',
    ...(options || {}),
  });
}
