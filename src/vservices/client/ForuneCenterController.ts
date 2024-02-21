// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Proxy Center - Home Page Invitation Reward Broadcast Data List GET /v1/forune/user/game/invite/reward/list */
export async function userGameInviteRewardListForuneCenterController(options?: {
  [key: string]: any;
}) {
  return request<API.ListVOUserGameInviteRewardListVO>('/v1/forune/user/game/invite/reward/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Proxy Center - Homepage Statistics GET /v1/forune/user/game/invite/stat */
export async function userGameInviteStatForuneCenterController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserGameInviteStatVO>('/v1/forune/user/game/invite/stat', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Player Center - Home Page GET /v1/forune/user/play/game/stat */
export async function userPlayGameStatForuneCenterController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserPlayGameStatVO>('/v1/forune/user/play/game/stat', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Home page - Statistical data interface GET /v1/forune/user/stat */
export async function userStatForuneCenterController(options?: { [key: string]: any }) {
  return request<API.ObjectVOUserStatVO>('/v1/forune/user/stat', {
    method: 'GET',
    ...(options || {}),
  });
}
