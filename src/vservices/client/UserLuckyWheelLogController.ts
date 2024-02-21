// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Get Lucky Wheel Information GET /v1/lucky/wheel */
export async function luckWheelUserLuckyWheelLogController(
  //      Param   ( body  swagger        )
  params: API.luckWheelUserLuckyWheelLogControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOLuckyWheelVO>('/v1/lucky/wheel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get Lucky Wheel list GET /v1/lucky/wheel/list */
export async function luckWheelListUserLuckyWheelLogController(options?: {
  [key: string]: any;
}) {
  return request<API.ListVOLuckyWheelVO>('/v1/lucky/wheel/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Spin The Luck Wheel And Get rewards POST /v1/lucky/wheel/spin */
export async function luckyWheelSpinUserLuckyWheelLogController(
  body: API.LuckyWheelSpinAO,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOInteger>('/v1/lucky/wheel/spin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
