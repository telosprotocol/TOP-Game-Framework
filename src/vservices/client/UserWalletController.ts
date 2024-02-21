// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Balance information on user wallet home page GET /v1/user/wallet/banalce */
export async function banalceInfoUserWalletController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserBalanceInfoVO>('/v1/user/wallet/banalce', {
    method: 'GET',
    ...(options || {}),
  });
}

/** User wallet basic information GET /v1/user/wallet/info */
export async function infoUserWalletController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserWalletInfoVO>('/v1/user/wallet/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** User Wallet level GET /v1/user/wallet/level */
export async function userLevelUserWalletController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserWalletLevelVO>('/v1/user/wallet/level', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Level rule data GET /v1/user/wallet/level/rules */
export async function levelRulesUserWalletController(options?: { [key: string]: any }) {
  return request<API.ListVOUserExpLevelRuleVO>('/v1/user/wallet/level/rules', {
    method: 'GET',
    ...(options || {}),
  });
}
