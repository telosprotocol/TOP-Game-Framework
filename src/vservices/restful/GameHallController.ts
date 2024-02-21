// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Query popular science about game lobby issues POST /v1/game/faq/list */
export async function listFagGameHallController(
  body: RAPI.GameFaqPageAO,
  options?: { [key: string]: any },
) {
  return request<RAPI.PageVOGameFaqVO>('/v1/game/faq/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Query popular science about game lobby issues POST /v1/game/faq/pageFaq */
export async function pageFagGameHallController(
  body: RAPI.GameFaqPageAO,
  options?: { [key: string]: any },
) {
  return request<RAPI.PageVOGameFaqVO>('/v1/game/faq/pageFaq', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Game hall GET /v1/game/gameHall */
export async function hallGameHallController(options?: { [key: string]: any }) {
  return request<RAPI.ListVOGameInfoVO>('/v1/game/gameHall', {
    method: 'GET',
    ...(options || {}),
  });
}

/** list Wangzhuan Page Games GET /v1/game/list/wangzhuan */
export async function listWangzhuanPageGamesGameHallController(options?: { [key: string]: any }) {
  return request<RAPI.ListVOGameInfoWangZhuanVO>('/v1/game/list/wangzhuan', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Query game hall notifications POST /v1/game/notice/pageNotice */
export async function pageNoticeGameHallController(
  body: RAPI.GameNoticePageAO,
  options?: { [key: string]: any },
) {
  return request<RAPI.ListVOGameNoticeVO>('/v1/game/notice/pageNotice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Game hall V2 GET /v2/game/gameHall */
export async function hallV2GameHallController(options?: { [key: string]: any }) {
  return request<RAPI.ListVOGameInfoVO>('/v2/game/gameHall', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Game hall V3 GET /v3/game/gameHall */
export async function hallV3GameHallController(options?: { [key: string]: any }) {
  return request<RAPI.ListVOGameMenuItemDetailVO>('/v3/game/gameHall', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Game hall V4 GET /v4/game/gameHall */
export async function hallV4GameHallController(options?: { [key: string]: any }) {
  return request<RAPI.ListVOGameMenuItemDetailV2VO>('/v4/game/gameHall', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Game hall V5 GET /v5/game/gameHall */
export async function hallV5GameHallController(options?: { [key: string]: any }) {
  return request<RAPI.ListVOGameMenuItemDetailV2VO>('/v5/game/gameHall', {
    method: 'GET',
    ...(options || {}),
  });
}
