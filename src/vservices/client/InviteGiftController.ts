// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Inquire about invitations to flop activities GET /v1/game/invite/flipCard */
export async function inviteFlipCardInviteGiftController(options?: { [key: string]: any }) {
  return request<API.ObjectVOInviteFlipCardVO>('/v1/game/invite/flipCard', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Receive invitation flop activity rewards PUT /v1/game/invite/flipCard/play */
export async function playInviteFlipCardInviteGiftController(options?: { [key: string]: any }) {
  return request<API.ObjectVOInteger>('/v1/game/invite/flipCard/play', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** View the list of invited friends page POST /v1/game/invite/page */
export async function inviteDetailInviteGiftController(
  body: API.PageAO,
  options?: { [key: string]: any },
) {
  return request<API.PageVOInviteFriendInfoItemVO>('/v1/game/invite/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
