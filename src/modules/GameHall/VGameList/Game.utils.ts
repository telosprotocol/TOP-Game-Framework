import { getVHttpSafeInsForMainActivity } from '@/http/http';
import { checkMinVersionName } from '@/store/modules/app/checkMinVersionName';
export async function getGameSettlementInfo(openId: string) {
  const axiosIns = getVHttpSafeInsForMainActivity();

  if (checkMinVersionName('2.9.0.0')) {
    return axiosIns
      .request<API.ObjectVOUserSettlementBannerVO>({
        url: `/v3/game/settlementInfo/${openId}`,
        method: 'GET',
        params: {},
      })
      .then((res) => {
        return res.data;
      });
  }
  return axiosIns
    .request<API.ObjectVOUserSettlementBannerVO>({
      url: `/v2/game/settlementInfo`,
      method: 'POST',
      params: {},
    })
    .then((res) => {
      return res.data;
    });
}
