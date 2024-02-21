// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** query activity detail information for visitor GET /v1/activity/smashEgg/visitorGetDetail */
export async function visitorGetInfoSmashEggController(options?: { [key: string]: any }) {
  return request<RAPI.ObjectVOSmashEggActivityVO>('/v1/activity/smashEgg/visitorGetDetail', {
    method: 'GET',
    ...(options || {}),
  });
}
