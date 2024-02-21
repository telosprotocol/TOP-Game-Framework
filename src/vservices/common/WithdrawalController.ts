// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** get small withdrawal information GET /v1/game/withdraw/getVisitorWithdrawalInfo/${param0} */
export async function getVisitorWithdrawalInfoWithdrawalController(
  //      Param   ( body  swagger        )
  params: CAPI.getVisitorWithdrawalInfoWithdrawalControllerParams,
  options?: { [key: string]: any }
) {
  const { userId: param0, ...queryParams } = params;
  return request<CAPI.ObjectVOWithdrawalInfoViewVO>(
    `/v1/game/withdraw/getVisitorWithdrawalInfo/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
