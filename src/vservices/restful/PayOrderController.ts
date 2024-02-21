// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** recharge withdraw top POST /v1/pay/withdrawRechargeScrollDisplay */
export async function getWithdrawRechargeScrollDisplayPayOrderController(
  body: RAPI.WidthdrawITopNAO,
  options?: { [key: string]: any },
) {
  return request<RAPI.ListVOWithdrawalRechargeTopNVO>('/v1/pay/withdrawRechargeScrollDisplay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
