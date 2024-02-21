// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Get game activity products GET /v1/game/product/activity */
export async function activityProductProductController(
  //      Param   ( body  swagger        )
  params: API.activityProductProductControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOProductViewVO>('/v1/game/product/activity', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** get recharge product list of bankruptcy type GET /v1/game/product/bankruptcy */
export async function bankruptcyProductProductController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOProductViewVO>('/v1/game/product/bankruptcy', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Product payment POST /v1/game/product/createPayIn */
export async function payInProductController(
  body: API.GameCreatePayInAO,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOGameCreatePayInVO>(
    '/v1/game/product/createPayIn',
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

/** Recharge product details GET /v1/game/product/detail */
export async function detailProductController(
  //      Param   ( body  swagger        )
  params: API.detailProductControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOProductCarryPayViewVO>('/v1/game/product/detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Query game recharge products by page POST /v1/game/product/page */
export async function pageProductController(
  body: API.ProductPageAO,
  options?: { [key: string]: any }
) {
  return request<API.PageVOProductVO>('/v1/game/product/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Query payment order GET /v1/game/product/payInCheck */
export async function payInCheckProductController(
  //      Param   ( body  swagger        )
  params: API.payInCheckProductControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOGamePayInOrderVO>('/v1/game/product/payInCheck', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get game recharge products GET /v1/game/product/recharge */
export async function rechargeProductProductController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOProductViewVO>('/v1/game/product/recharge', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Get game activity products V2 GET /v2/game/product/activity/reharge */
export async function activityFristChargetProductController(
  //      Param   ( body  swagger        )
  params: API.activityFristChargetProductControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOProductViewVO>(
    '/v2/game/product/activity/reharge',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get game recharge products GET /v2/game/product/recharge */
export async function rechargeProductV2ProductController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOProductViewVO>('/v2/game/product/recharge', {
    method: 'GET',
    ...(options || {}),
  });
}
