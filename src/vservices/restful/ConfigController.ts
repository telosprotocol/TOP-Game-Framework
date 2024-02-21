// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Get the configuration GET /v1/config/${param0} */
export async function getConfigController(
  //      Param   ( body  swagger        )
  params: RAPI.getConfigControllerParams,
  options?: { [key: string]: any }
) {
  const { code: param0, ...queryParams } = params;
  return request<RAPI.ObjectVOObject>(`/v1/config/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Data dictionary GET /v1/config/data/dictionary/${param0} */
export async function dictionaryConfigController(
  //      Param   ( body  swagger        )
  params: RAPI.dictionaryConfigControllerParams,
  options?: { [key: string]: any }
) {
  const { key: param0, ...queryParams } = params;
  return request<RAPI.ObjectVOMapStringString>(
    `/v1/config/data/dictionary/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
