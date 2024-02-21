// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** enter game GET /v1/game/enter */
export async function enterGameGameHallController(
  //      Param   ( body  swagger        )
  params: API.enterGameGameHallControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOGameStartInfoVO>('/v1/game/enter', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** The game hall that the user accesses after logging in (including whether the user authorizes the game) GET /v1/game/gameHallByLogin */
export async function hallByLoginGameHallController(options?: {
  [key: string]: any;
}) {
  return request<API.ListVOGameInfoVO>('/v1/game/gameHallByLogin', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Get the games currently running for the current user GET /v1/game/getRunningGame */
export async function getRunningGameGameHallController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVORunningGameVO>('/v1/game/getRunningGame', {
    method: 'GET',
    ...(options || {}),
  });
}

/** WSP income distributed by the platform GET /v1/game/platformGrantedDstEarnings */
export async function getPlatformGrantedDstEarningsGameHallController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOBigDecimal>(
    '/v1/game/platformGrantedDstEarnings',
    {
      method: 'GET',
      ...(options || {}),
    }
  );
}

/** Get game game information and return accessToken and openId After obtaining it, open the link through url?code={accessToken}&openId={openId} and pass it to the third-party server for calling GET /v1/game/roundInfo */
export async function getGameRoundInfoGameHallController(
  //      Param   ( body  swagger        )
  params: API.getGameRoundInfoGameHallControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOGameRoundVO>('/v1/game/roundInfo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Player manually settles game Players need to settle the previously running game before proceeding to the next game POST /v1/game/settlement */
export async function settlementCoinGameHallController(options?: {
  [key: string]: any;
}) {
  return request<API.BaseVO>('/v1/game/settlement', {
    method: 'POST',
    ...(options || {}),
  });
}

/** Get the user's game settlement record POST /v1/game/settlement/page */
export async function pageSettlementGameHallController(
  body: API.SettlementPageAO,
  options?: { [key: string]: any }
) {
  return request<API.BaseVO>('/v1/game/settlement/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Get the player's latest settlement data GET /v1/game/settlementInfo */
export async function getSettlementInfoGameHallController(
  //      Param   ( body  swagger        )
  params: API.getSettlementInfoGameHallControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOUserSettlementBannerVO>(
    '/v1/game/settlementInfo',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get the player's game round info GET /v1/game/settlementRoundInfo */
export async function getGameSettlementRoundInfoGameHallController(
  //      Param   ( body  swagger        )
  params: API.getGameSettlementRoundInfoGameHallControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOUserGameRoundInfoVO>(
    '/v1/game/settlementRoundInfo',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** check to see whether settlement of a specified game finished or not GET /v1/game/settlementStatus */
export async function getSettlementStatusGameHallController(
  //      Param   ( body  swagger        )
  params: API.getSettlementStatusGameHallControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOGameSettlementStateEnum>(
    '/v1/game/settlementStatus',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get login information for the game GET /v1/game/startInfo */
export async function getGameStartInfoGameHallController(
  //      Param   ( body  swagger        )
  params: API.getGameStartInfoGameHallControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOGameStartInfoVO>('/v1/game/startInfo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Submit user ticket POST /v1/game/user/feedback */
export async function saveGameUserFeedbackGameHallController(
  body: API.GameFeedbackAO,
  options?: { [key: string]: any }
) {
  return request<API.BaseVO>('/v1/game/user/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** receive user login event POST /v1/user/login/event */
export async function receiveUserLoginEventGameHallController(options?: {
  [key: string]: any;
}) {
  return request<API.ObjectVOUserBusinessInfoVO>('/v1/user/login/event', {
    method: 'POST',
    ...(options || {}),
  });
}

/** Get the player's latest settlement data v2 POST /v2/game/settlementInfo */
export async function getSettlementInfoV2GameHallController(
  //      Param   ( body  swagger        )
  params: API.getSettlementInfoV2GameHallControllerParams,
  options?: { [key: string]: any }
) {
  return request<API.ObjectVOUserSettlementBannerVO>(
    '/v2/game/settlementInfo',
    {
      method: 'POST',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get the player's latest settlement data v3 GET /v3/game/settlementInfo/${param0} */
export async function getSettlementInfoV3GameHallController(
  //      Param   ( body  swagger        )
  params: API.getSettlementInfoV3GameHallControllerParams,
  options?: { [key: string]: any }
) {
  const { openId: param0, ...queryParams } = params;
  return request<API.ObjectVOUserSettlementBannerVO>(
    `/v3/game/settlementInfo/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
