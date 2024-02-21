// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Payment notification callback main entrance POST /v1/pay/notify/${param0}/${param1} */
export async function payInfoNotifyPayController(
  //      Param   ( body  swagger        )
  params: RAPI.payInfoNotifyPayControllerParams,
  options?: { [key: string]: any }
) {
  const { direction: param0, platformName: param1, ...queryParams } = params;
  return request<any>(`/v1/pay/notify/${param0}/${param1}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}
