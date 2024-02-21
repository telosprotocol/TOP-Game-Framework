// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Query payment order GET /v1/pay/payInCheck */
export async function payInCheckPayController(
  //      Param   ( body  swagger        )
  params: API.payInCheckPayControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOPayInOrderVO>('/v1/pay/payInCheck', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Query payment order records by page POST /v1/pay/payInCheckPage */
export async function payInCheckPagePayController(
  body: API.PageAO,
  options?: { [key: string]: any }
) {
  return request<API.PageVOPayInOrderVO>('/v1/pay/payInCheckPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Query withdrawal order GET /v1/pay/payOutCheck */
export async function payOutCheckPayController(
  //      Param   ( body  swagger        )
  params: API.payOutCheckPayControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOPayOutOrderVO>('/v1/pay/payOutCheck', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Query withdrawal order records by page POST /v1/pay/payOutCheckPage */
export async function payOutCheckPagePayController(
  body: API.PageAO,
  options?: { [key: string]: any }
) {
  return request<API.PageVOPayOutOrderVO>('/v1/pay/payOutCheckPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
