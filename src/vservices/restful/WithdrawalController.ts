// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Withdrawal top POST /v1/withdrawal/withdrawScrollDisplay */
export async function getWithdrawScrollDisplayWithdrawalController(
  body: RAPI.WidthdrawITopNAO,
  options?: { [key: string]: any }
) {
  return request<RAPI.ListVOWithdrawalTopNVO>(
    '/v1/withdrawal/withdrawScrollDisplay',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** get small withdrawal information GET /v2/game/withdraw/getVisitorWithdrawalInfo/${param0} */
export async function getVisitorWithdrawalInfoV2WithdrawalController(
  //      Param   ( body  swagger        )
  params: RAPI.getVisitorWithdrawalInfoV2WithdrawalControllerParams,
  options?: { [key: string]: any }
) {
  const { userId: param0, ...queryParams } = params;
  return request<RAPI.ObjectVOWithdrawVisitorInfoVO>(
    `/v2/game/withdraw/getVisitorWithdrawalInfo/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** Query orders with successful withdrawals by page POST /v2/withdrawal/manager/withdrawal/pageSuccess */
export async function withdrawalRecordUserInfoV2WithdrawalController(options?: {
  [key: string]: any;
}) {
  return request<RAPI.ListVOWidthdrawlUserInfoVO>(
    '/v2/withdrawal/manager/withdrawal/pageSuccess',
    {
      method: 'POST',
      ...(options || {}),
    }
  );
}
