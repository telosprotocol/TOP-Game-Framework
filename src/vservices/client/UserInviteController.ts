// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Invitation - Establishing an invitation relationship through an invitation code POST /v1/user/invite/create */
export async function createInviteRelationshipUserInviteController(
  body: API.UserInviteCreateAO,
  options?: { [key: string]: any },
) {
  return request<API.BaseVO>('/v1/user/invite/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Invitation - Game Home GET /v1/user/invite/game */
export async function inviteGameInfoUserInviteController(options?: { [key: string]: any }) {
  return request<API.ObjectVOGameInviteUserInfoVO>('/v1/user/invite/game', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Invitation - Gold Coin Revenue Record Information GET /v1/user/invite/game/incomeInfo */
export async function gameIncomeInfoUserInviteController(options?: { [key: string]: any }) {
  return request<API.ObjectVOIncomeInfoViewVO>('/v1/user/invite/game/incomeInfo', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Invitation - Gold Coin Revenue Record POST /v1/user/invite/game/incomeRecord */
export async function gameIncomeRecordUserInviteController(
  body: API.IncomeLogPageAO,
  options?: { [key: string]: any },
) {
  return request<API.PageVOIncomeLogVO>('/v1/user/invite/game/incomeRecord', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Invitation - Modify Invitee Notes POST /v1/user/invite/game/list */
export async function gameInviteDetailUserInviteController(
  body: API.GameUserInviteDetailPageAO,
  options?: { [key: string]: any },
) {
  return request<API.PageVOGameInviteRecordVO>('/v1/user/invite/game/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Invitation - Modify Invitee Notes POST /v1/user/invite/modifyRemark */
export async function modifyRemarkUserInviteController(
  body: API.UserInviteModifyRemarkAO,
  options?: { [key: string]: any },
) {
  return request<API.BaseVO>('/v1/user/invite/modifyRemark', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Invitation - recall friend POST /v1/user/invite/recall/friend */
export async function recallFriendUserInviteController(
  body: API.UserIdAO,
  options?: { [key: string]: any },
) {
  return request<API.BaseVO>('/v1/user/invite/recall/friend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
