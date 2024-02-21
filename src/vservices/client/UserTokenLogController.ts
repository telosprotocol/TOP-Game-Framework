// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** WSP coin exchange for gold POST /v1/user/token/exchange/gold */
export async function exchangeGoldUserTokenLogController(
  body: API.UserTokenExchangeGoldAO,
  options?: { [key: string]: any },
) {
  return request<API.ObjectVOBigDecimal>('/v1/user/token/exchange/gold', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Paging to query user WSP details records POST /v1/user/token/page */
export async function pageUserTokenLogController(
  body: API.UserTokenLogPageAO,
  options?: { [key: string]: any },
) {
  return request<API.PageVOUserTokenLogVO>('/v1/user/token/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** User WSP detailed record statistics data POST /v1/user/token/stat */
export async function tokenStatUserTokenLogController(
  body: API.UserTokenLogStatAO,
  options?: { [key: string]: any },
) {
  return request<API.ObjectVOUserTokenLogStatVO>('/v1/user/token/stat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Users can redeem WSP data GET /v1/user/token/usable */
export async function usableUserTokenLogController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserTokenUsableVO>('/v1/user/token/usable', {
    method: 'GET',
    ...(options || {}),
  });
}
