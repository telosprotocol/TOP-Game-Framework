// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** report JockPoint POST /v1/pp/game/reportJockPoint */
export async function reportJockPointPragmaticPlayProviderController(
  body: API.ReportJockPointAO,
  options?: { [key: string]: any },
) {
  return request<API.BaseVO>('/v1/pp/game/reportJockPoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** run game POST /v1/pp/game/run */
export async function runPragmaticPlayProviderController(
  body: API.GameRunAO,
  options?: { [key: string]: any },
) {
  return request<API.BaseVO>('/v1/pp/game/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
