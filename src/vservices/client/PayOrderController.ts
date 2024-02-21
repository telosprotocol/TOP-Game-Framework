// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** recharge top POST /v1/pay/rechargeScrollDisplay */
export async function getRechargeScrollDisplayPayOrderController(
  body: API.WidthdrawITopNAO,
  options?: { [key: string]: any },
) {
  return request<API.ListVOWithdrawalTopNVO>('/v1/pay/rechargeScrollDisplay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
