// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** exchange POST /v1/redeem/activate */
export async function activateRedeemCodeActivateController(
  body: API.RedeemCodeActivateAO,
  options?: { [key: string]: any },
) {
  return request<API.ObjectVORedeemCodeActivateVO>('/v1/redeem/activate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
