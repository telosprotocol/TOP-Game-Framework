// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Sign-in POST /v1/checkIn */
export async function checkInCheckInRewardController(options?: { [key: string]: any }) {
  return request<API.BaseVO>('/v1/checkIn', {
    method: 'POST',
    ...(options || {}),
  });
}

/** Sign-in list GET /v1/checkIn/days */
export async function getCheckInDaysCheckInRewardController(options?: { [key: string]: any }) {
  return request<API.ListVOCheckInDayVO>('/v1/checkIn/days', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Sign-in information GET /v1/checkIn/info */
export async function getCheckInfoCheckInRewardController(options?: { [key: string]: any }) {
  return request<API.ObjectVOCheckInInfoVO>('/v1/checkIn/info', {
    method: 'GET',
    ...(options || {}),
  });
}
