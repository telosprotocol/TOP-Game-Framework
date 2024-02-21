// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Query orders with successful withdrawals by page POST /v1/game/manager/withdrawal/pageSuccess */
export async function withdrawalRecordUserInfoWithdrawalController(
  body: API.WidthdrawIDateAO,
  options?: { [key: string]: any }
) {
  return request<API.PageVOWidthdrawlUserInfoVO>(
    '/v1/game/manager/withdrawal/pageSuccess',
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

/** Save and update withdrawal channels POST /v1/game/withdrawal/channelBind */
export async function saveWithdrawalController(
  body: API.WithdrawalChannelBindAO,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOLong>('/v1/game/withdrawal/channelBind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Gold coin withdrawal information GET /v1/game/withdrawal/info */
export async function gameWithdrawalGoldInfoWithdrawalController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOWithdrawalInfoViewVO>('/v1/game/withdrawal/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Gold coin withdrawal information GET /v1/game/withdrawal/info/activity */
export async function gameWithdrawalGoldInfoByTypeWithdrawalController(
  //      Param   ( body  swagger        )
  params: API.gameWithdrawalGoldInfoByTypeWithdrawalControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOWithdrawalInfoViewVO>(
    '/v1/game/withdrawal/info/activity',
    {
      method: 'GET',
      params: {
        ...params,
        ao: undefined,
        ...params['ao'],
      },
      ...(options || {}),
    }
  );
}

/** Gold coin withdrawal record POST /v1/game/withdrawal/page */
export async function gameWithdrawalGoldRecordWithdrawalController(
  body: API.WithdrawalLogPageAO,
  options?: { [key: string]: any }
) {
  return request<API.PageVOWithdrawalLogVO>('/v1/game/withdrawal/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Ordinary withdrawal POST /v2/game/withdrawal/create */
export async function createWithdrawalGoldV2WithdrawalController(
  body: API.CreateWithdrawalV2AO,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOBigDecimal>('/v2/game/withdrawal/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Gold coin withdrawal information GET /v2/game/withdrawal/info */
export async function gameWithdrawalGoldInfoV2WithdrawalController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOWithdrawalInfoViewVO>('/v2/game/withdrawal/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Withdrawal unified interface POST /v3/game/withdrawal/create */
export async function createWithdrawalDeprecatedWithdrawalController(
  body: API.CreateWithdrawalV3AO,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOBigDecimal>('/v3/game/withdrawal/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Gold coin withdrawal information GET /v3/game/withdrawal/info */
export async function gameWithdrawalGoldInfoV3WithdrawalController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOWithdrawalInfoViewVO>('/v3/game/withdrawal/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Withdrawal unified interface POST /v4/game/withdrawal/create */
export async function createWithdrawalGoldV3WithdrawalController(
  body: API.CreateWithdrawalV3AO,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOBigDecimal>('/v4/game/withdrawal/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
