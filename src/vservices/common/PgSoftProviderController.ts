// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** 1. Check and verify the player token generated when the player logs in to the game POST /v1/game/pg/VerifySession */
export async function verifySessionPgSoftProviderController(
  body: string,
  options?: { [key: string]: any },
) {
  return request<CAPI.PocketGameVerifySessionVO>('/v1/game/pg/VerifySession', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
