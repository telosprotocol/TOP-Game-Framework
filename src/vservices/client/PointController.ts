// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Redeem PUT /v1/point/redemption */
export async function redemptionPointController(
  body: API.PointsRedemptionAO,
  options?: { [key: string]: any },
) {
  return request<API.BaseVO>('/v1/point/redemption', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Exchange product list POST /v1/point/redemption/item/page */
export async function itemPagePointController(
  body: API.PointsRedemptionConfigPageAO,
  options?: { [key: string]: any },
) {
  return request<API.ListVOPointsRedemptionConfigVO>('/v1/point/redemption/item/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Exchange product records POST /v1/point/redemption/record/page */
export async function recordPagePointController(
  body: API.PointsRedemptionLogPageAO,
  options?: { [key: string]: any },
) {
  return request<API.PageVOPointsRedemptionLogVO>('/v1/point/redemption/record/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
