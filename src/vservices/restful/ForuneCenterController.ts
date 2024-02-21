// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Proxy Center - User Personal Recharge Ranking List GET /v1/forune/user/game/invite/recharge/ranking */
export async function userInviteRechargeRankingForuneCenterController(options?: {
  [key: string]: any;
}) {
  return request<RAPI.ListVOUserInviteRechargeRankingVO>(
    '/v1/forune/user/game/invite/recharge/ranking',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** Proxy Center - User's Team Recharge Ranking List GET /v1/forune/user/game/invite/recharge/teamRanking */
export async function userInviteRechargeTeamRankingForuneCenterController(options?: {
  [key: string]: any;
}) {
  return request<RAPI.ListVOUserInviteRechargeTeamRankingVO>(
    '/v1/forune/user/game/invite/recharge/teamRanking',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** Player Center - Weekly leaderboard GET /v1/forune/user/play/game/weekRanking */
export async function userPlayGameWeekRankingForuneCenterController(options?: {
  [key: string]: any;
}) {
  return request<RAPI.ListVOUserPlayGameWeekRankingVO>('/v1/forune/user/play/game/weekRanking', {
    method: 'GET',
    ...(options || {}),
  });
}
