// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/**      GET /devdoc/config */
export async function configDevDocController(options?: { [key: string]: any }) {
  return request<RAPI.ObjectVOConfigVO>('/devdoc/config', {
    method: 'GET',
    ...(options || {}),
  });
}

/**      GET /devdoc/data/dictionary/${param0} */
export async function dictionaryDevDocController(
  //      Param   ( body  swagger        )
  params: RAPI.dictionaryDevDocControllerParams,
  options?: { [key: string]: any }
) {
  const { source: param0, ...queryParams } = params;
  return request<RAPI.ObjectVOMapStringJsonObject>(
    `/devdoc/data/dictionary/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/**      GET /devdoc/file/download */
export async function downloadDevDocController(
  //      Param   ( body  swagger        )
  params: RAPI.downloadDevDocControllerParams,
  options?: { [key: string]: any }
) {
  return request<any>('/devdoc/file/download', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**      GET /devdoc/file/list */
export async function listFileDevDocController(
  //      Param   ( body  swagger        )
  params: RAPI.listFileDevDocControllerParams,
  options?: { [key: string]: any }
) {
  return request<RAPI.ListVOString>('/devdoc/file/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**     GET /devdoc/resp/${param0} */
export async function respDevDocController(
  //      Param   ( body  swagger        )
  params: RAPI.respDevDocControllerParams,
  options?: { [key: string]: any }
) {
  const { language: param0, ...queryParams } = params;
  return request<RAPI.ObjectVOMapStringString>(`/devdoc/resp/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/**      POST /devdoc/sign */
export async function signDevDocController(
  body: RAPI.SignAO,
  options?: { [key: string]: any }
) {
  return request<RAPI.ObjectVOSignVO>('/devdoc/sign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
