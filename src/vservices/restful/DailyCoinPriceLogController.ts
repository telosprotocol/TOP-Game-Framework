// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Currency price/exchange rate information GET /v1/coin/price/info */
export async function priceInfoDailyCoinPriceLogController(options?: { [key: string]: any }) {
  return request<RAPI.ObjectVOCoinPriceInfoVO>('/v1/coin/price/info', {
    method: 'GET',
    ...(options || {}),
  });
}
