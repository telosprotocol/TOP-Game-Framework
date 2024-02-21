// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Game Center User Task List GET /v1/game/task/list/ */
export async function selfTaskListGameTaskCenterController(options?: { [key: string]: any }) {
  return request<API.ListVOGameCenterTaskSeriesVO>('/v1/game/task/list/', {
    method: 'GET',
    ...(options || {}),
  });
}
