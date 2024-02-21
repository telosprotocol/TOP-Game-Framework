// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Cancel queue PUT /v1/withdraw/queue/cancel */
export async function cancelWithdrawQueueController(options?: { [key: string]: any }) {
  return request<API.BaseVO>('/v1/withdraw/queue/cancel', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** Query user queue information POST /v1/withdraw/queue/user */
export async function queryUserQueueInfoWithdrawQueueController(options?: { [key: string]: any }) {
  return request<API.ObjectVOWithdrawQueueUserVO>('/v1/withdraw/queue/user', {
    method: 'POST',
    ...(options || {}),
  });
}
