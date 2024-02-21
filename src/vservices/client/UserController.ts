// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** User Account Information For App GET /v1/app/user/account */
export async function userAppAccountUserController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserAccountVO>('/v1/app/user/account', {
    method: 'GET',
    ...(options || {}),
  });
}

/** User Account Information GET /v1/user/account */
export async function userAccountUserController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserAccountVO>('/v1/user/account', {
    method: 'GET',
    ...(options || {}),
  });
}

/** User assets Information GET /v1/user/assets */
export async function assetsUserController(options?: { [key: string]: any }) {
  return request<API.ListVOUserCoinAssetsVO>('/v1/user/assets', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Get bound mobile GET /v1/user/bind/mobile */
export async function getMobileUserController(options?: { [key: string]: any }) {
  return request<API.ObjectVOString>('/v1/user/bind/mobile', {
    method: 'GET',
    ...(options || {}),
  });
}

/** User bound mobile POST /v1/user/bind/mobile */
export async function mobileBindingUserController(
  body: API.UserBindMobileAO,
  options?: { [key: string]: any },
) {
  return request<API.BaseVO>('/v1/user/bind/mobile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Get bound mobile information GET /v1/user/bind/mobileInfo */
export async function getMobileInfoUserController(options?: { [key: string]: any }) {
  return request<API.ObjectVOBindingMobileInfoVO>('/v1/user/bind/mobileInfo', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Human machine verification code POST /v1/user/captcha */
export async function getCaptchaUserController(options?: { [key: string]: any }) {
  return request<API.ObjectVOString>('/v1/user/captcha', {
    method: 'POST',
    ...(options || {}),
  });
}

/** APP User Account center Information GET /v1/user/center */
export async function userCenterUserController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserCenterVO>('/v1/user/center', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Update user nickname POST /v1/user/modify/nickname */
export async function modifyUserNicknameUserController(
  body: API.UpdateUserSelfNicknameAO,
  options?: { [key: string]: any },
) {
  return request<API.BaseVO>('/v1/user/modify/nickname', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Verify if the user nickname can be modified GET /v1/user/nickname/modify */
export async function modifyUserNickNameUserController(options?: { [key: string]: any }) {
  return request<API.ObjectVOBoolean>('/v1/user/nickname/modify', {
    method: 'GET',
    ...(options || {}),
  });
}

/** User sends mobile SMS POST /v1/user/sms/send */
export async function sendSmsUserController(
  body: API.SmsMobileSendAO,
  options?: { [key: string]: any },
) {
  return request<API.BaseVO>('/v1/user/sms/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Pagination query of user transaction records POST /v1/user/transaction/page */
export async function pageUserController(
  body: API.TransactionPageAO,
  options?: { [key: string]: any },
) {
  return request<API.PageVOTransactionVO>('/v1/user/transaction/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** User bound mobile V2 POST /v2/user/bind/mobile */
export async function mobileBindingV2UserController(
  body: API.UserBindMobileV2AO,
  options?: { [key: string]: any },
) {
  return request<API.BaseVO>('/v2/user/bind/mobile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
