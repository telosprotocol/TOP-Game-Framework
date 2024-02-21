import { PERMANENT_TIMESTAMP } from '@/utils/datetime';
import { queryPageUserPropController } from '@/vservices/client/UserPropController';
import type { IUserPropItem } from './prop.model';

/**          POST /v1/prop/page */
export async function getUserPropPage(body: API.UserPropPageAO) {
  return queryPageUserPropController(body).then((res) => {
    const { data, ...rest } = res as IHttpResponse<IUserPropItem[]>;
    return {
      ...rest,
      data: data
        ? data.map((item) => {
            const endTime = Number(item.endTime);
            return {
              ...item,
              _leftMs:
                endTime < PERMANENT_TIMESTAMP ? endTime - res.servertime : 0,
            };
          })
        : data,
    };
  });
}
