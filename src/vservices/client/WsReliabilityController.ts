// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** send websocket feedback PUT /v1/websocket/reliability/feedback */
export async function processWsFeedBackWsReliabilityController(
  body: API.WsFeedbackAO,
  options?: { [key: string]: any },
) {
  return request<API.BaseVO>('/v1/websocket/reliability/feedback', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
