// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Revenue details POST /v1/game/invite/incomeDetailList */
export async function incomeDetailListGameInviteController(
  body: API.IncomeDetailPageAO,
  options?: { [key: string]: any },
) {
  return request<API.PageVOIncomeDetailListVO>('/v1/game/invite/incomeDetailList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Income detailed statistics POST /v1/game/invite/incomeDetailStat */
export async function incomeDetailSummaryGameInviteController(
  body: API.IncomeDetailPageAO,
  options?: { [key: string]: any },
) {
  return request<API.ObjectVOIncomeDetailStatVO>('/v1/game/invite/incomeDetailStat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Team management POST /v1/game/invite/memberList */
export async function memberListGameInviteController(
  body: API.PageAO,
  options?: { [key: string]: any },
) {
  return request<API.PageVOMemberListVO>('/v1/game/invite/memberList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Promotional income GET /v1/game/invite/promotionIncome */
export async function getPromotionIncomeGameInviteController(options?: { [key: string]: any }) {
  return request<API.ObjectVOPromotionIncomeVO>('/v1/game/invite/promotionIncome', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Is there any promotion record? GET /v1/game/invite/record */
export async function recordGameInviteController(options?: { [key: string]: any }) {
  return request<API.ObjectVOBoolean>('/v1/game/invite/record', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Promote and share GET /v1/game/invite/share */
export async function shareGameInviteController(options?: { [key: string]: any }) {
  return request<API.ObjectVOInviteShareVO>('/v1/game/invite/share', {
    method: 'GET',
    ...(options || {}),
  });
}
