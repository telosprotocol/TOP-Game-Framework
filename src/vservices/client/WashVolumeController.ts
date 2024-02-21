// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** User Flop POST /v1/washVolume/flop */
export async function flopWashVolumeController(
  body: API.WvFlopPropAO,
  options?: { [key: string]: any },
) {
  return request<API.ObjectVOInteger>('/v1/washVolume/flop', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Flop Information GET /v1/washVolume/flop/detail */
export async function flopDetailWashVolumeController(options?: { [key: string]: any }) {
  return request<API.ObjectVOWvFlopInfoVO>('/v1/washVolume/flop/detail', {
    method: 'GET',
    ...(options || {}),
  });
}
