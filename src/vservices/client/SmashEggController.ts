// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** query activity detail information GET /v1/activity/smashEgg/getDetail */
export async function getInfoSmashEggController(options?: { [key: string]: any }) {
  return request<API.ObjectVOSmashEggActivityVO>('/v1/activity/smashEgg/getDetail', {
    method: 'GET',
    ...(options || {}),
  });
}

/** receive activity reward POST /v1/activity/smashEgg/receiveReward */
export async function receiveRewardSmashEggController(options?: { [key: string]: any }) {
  return request<API.ObjectVOPropBagItemUserVO>('/v1/activity/smashEgg/receiveReward', {
    method: 'POST',
    ...(options || {}),
  });
}
