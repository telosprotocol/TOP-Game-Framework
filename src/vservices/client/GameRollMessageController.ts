// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Query the messages in the game scroll cache queue POST /v1/roll/messageQueue */
export async function queryCacheQueueGameRollMessageController(
  body: API.RollMessageCacheAO,
  options?: { [key: string]: any },
) {
  return request<API.ListVOGameRollMessageQueueVO>('/v1/roll/messageQueue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
