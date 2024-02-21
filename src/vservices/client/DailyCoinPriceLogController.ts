// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Daily Currency Price Paging Query POST /v1/coin/daily/price/list */
export async function dailyPriceListDailyCoinPriceLogController(
  body: API.PageAO,
  options?: { [key: string]: any },
) {
  return request<API.PageVODailyCoinPriceLogVO>('/v1/coin/daily/price/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
