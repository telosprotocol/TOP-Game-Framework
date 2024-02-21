// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** growth plan gift get GET /v1/pay/gift/growthPlan/get */
export async function growthPlanGetPayGiftController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOPayGiftGrowthPlanVO>(
    '/v1/pay/gift/growthPlan/get',
    {
      method: 'GET',
      ...(options || {}),
    }
  );
}

/** get gift list for hall GET /v1/pay/gift/hall/get */
export async function hallGetPayGiftController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOPayGiftHallVO>('/v1/pay/gift/hall/get', {
    method: 'GET',
    ...(options || {}),
  });
}

/** normal recharge product info get GET /v1/pay/gift/normalRecharge/get */
export async function normalRechargeGetPayGiftController(
  //      Param   ( body  swagger        )
  params: API.normalRechargeGetPayGiftControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOPayGiftNormalVO>(
    '/v1/pay/gift/normalRecharge/get',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Special recharge gift receive reward POST /v1/pay/gift/receiveReward */
export async function receiveRewardPayGiftController(
  body: API.PayGiftReceiveRewardAO,
  options?: { [key: string]: any }
) {
  return request<API.BaseVO>('/v1/pay/gift/receiveReward', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** reward recharge get GET /v1/pay/gift/rewardRecharge/get */
export async function rewardRechargeGetPayGiftController(
  //      Param   ( body  swagger        )
  params: API.rewardRechargeGetPayGiftControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOPayGiftRewardVO>(
    '/v1/pay/gift/rewardRecharge/get',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Special recharge gift get GET /v1/pay/gift/specialRecharge/get */
export async function specialRechargeGetPayGiftController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOPayGiftRewardVO>(
    '/v1/pay/gift/specialRecharge/get',
    {
      method: 'GET',
      ...(options || {}),
    }
  );
}

/** Pay gift trigger POST /v1/pay/gift/trigger */
export async function triggerPayGiftController(
  body: API.PayGiftTriggerAO,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOPayGiftTriggerVO>('/v1/pay/gift/trigger', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** get recharge product list of bankruptcy type GET /v2/activity/bankruptcyRecharge/activate */
export async function bankruptcyProductActivatePayGiftController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOBoolean>(
    '/v2/activity/bankruptcyRecharge/activate',
    {
      method: 'GET',
      ...(options || {}),
    }
  );
}
