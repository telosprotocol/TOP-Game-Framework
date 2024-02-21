import { createHttpResponse } from '@/http/createHttpResponse';
import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import Vue from 'vue';
import Component from 'vue-class-component';
import {
  gameWithdrawalGoldInfoV3WithdrawalController,
  saveWithdrawalController,
} from '@/vservices/client/WithdrawalController';
import { waitUserIsLoginedAuth } from '../../../store/modules/user.utils';
import {
  IGuestWithdrawAccountInfo,
  removeWithdrawAccountInfoForGuest,
  setWithdrawAccountInfoForGuest,
} from '@/controller/PersistentLocalStorage';
import { getWithdrawAccountInfoForGuest } from '../../../controller/PersistentLocalStorage';

import type { AxiosRequestConfig } from 'axios';
import { getVisitorWithdrawalInfoV2WithdrawalController } from '@/vservices/restful/WithdrawalController';

/**
 *       ："SMALL_WITHDRAW"
 *     ："LIMIT_WITHDRAW"
 *     ："NORMAL"
 */
export type IWithdrawType = API.WithdrawalInfoViewVO['withdrawType'];
type WithdrawalForAccountViewVOExtend = API.WithdrawalForAccountViewVO & {
  isCache?: boolean;
};
export type VGoldWithdrawInfoVO = Omit<
  API.WithdrawalInfoViewVO,
  'payLimitWithdrwaInfoVO' | 'account'
> & {
  /**
   * logined: the info is loaded by user logined
   * guest : the info is loaded by guest
   * guest-logined: the info is loaded by guest  & updated some info by logined info
   */
  infoStatus: 'logined' | 'guest' | 'guest-logined';
  payLimitWithdrwaInfoVO?: API.PayLimitWithdrwaInfoVO & { leftMS: number };

  /**      */
  account?: WithdrawalForAccountViewVOExtend[];
};
/**
 *
 * @returns
 */
async function getVGoldWithdrawInfo(extraConfig?: AxiosRequestConfig) {
  // const { vistorSmallContinue } = params;
  const isLogined = await waitUserIsLoginedAuth();
  if (!isLogined) {
    // user not logined
    return getVisitorWithdrawalInfoV2WithdrawalController(
      {
        userId: '0',
      },
      extraConfig
    ).then((rawRes) => {
      const res = rawRes as IHttpResponse<VGoldWithdrawInfoVO>;
      const rawData = rawRes.data;
      const { success, data } = res;
      if (success) {
        data.infoStatus = 'guest';
        if (data.withdrawType === 'SMALL_WITHDRAW') {
          const smallAmount = rawData.withdrawTypeAndAmountList?.[0]?.amount;
          const payChannel = rawData.payChannel;
          data.totalGold = smallAmount;
          data.withdrawalAbleGold = smallAmount;
          data.payAutoWithdrawInfo = {
            limitAmount: smallAmount,
            payChannel: rawData.payChannel,
            withdrawTypeAndAmountList: rawData.withdrawTypeAndAmountList,
          };

          const guestAccountCache = getWithdrawAccountInfoForGuest();
          if (
            guestAccountCache &&
            guestAccountCache.channelType === payChannel
          ) {
            res.data.account.map((item) => {
              if (item.type === payChannel && !item.channelNumber) {
                item.channelNumber = guestAccountCache.channelNumber;
                item.countryCode = guestAccountCache.countryCode;
              }
            });
          }
        }
      }
      return res as IHttpResponse<VGoldWithdrawInfoVO>;
    });
  }
  return gameWithdrawalGoldInfoV3WithdrawalController(extraConfig).then(
    async (rawRes) => {
      const res = rawRes as IHttpResponse<VGoldWithdrawInfoVO>;
      if (!res.success) {
        return res;
      }
      //#region return normalize
      const info = res.data;
      info.infoStatus = 'logined';
      //#endregion

      //#region try upload vistor account info to server
      const guestAccountCache = getWithdrawAccountInfoForGuest();
      if (guestAccountCache) {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('[Withdraw] has vistor accountInfo start upload');
        }
        const payChannel = guestAccountCache.channelType;
        const serverAccountInfo = info.account.find(
          (item) => item.type === payChannel
        );
        //
        if (serverAccountInfo) {
          if (serverAccountInfo.channelNumber) {
            removeWithdrawAccountInfoForGuest(); //     smallWithdraw
            if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
              console.log('[Withdraw] server channal has inited, remove cache');
            }
          } else {
            const saveRes = await saveWithdrawalController({
              countryCode: guestAccountCache.countryCode,
              channelType: guestAccountCache.channelType,
              channelNumber: guestAccountCache.channelNumber,
            });
            if (saveRes.success) {
              serverAccountInfo.countryCode = guestAccountCache.countryCode;
              serverAccountInfo.channelNumber = guestAccountCache.channelNumber;
              if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
                console.log('[Withdraw] submit vistor accountInfo success');
              }
              removeWithdrawAccountInfoForGuest();
            } else {
              //     ，
              console.error(
                '[Withdraw] fail to save channelNumber, deal next time?',
                saveRes
              );
            }
          }
        } else {
          // server    channel，  guest  ，         ，    -->    ，
          if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
            console.log('[Withdraw] account doest has visit account,ignore');
          }
        }
      }
      //#endregion

      return res;
    }
  );
}

export async function saveWithdrawalAccountInfoForGuest(
  body: IGuestWithdrawAccountInfo
) {
  setWithdrawAccountInfoForGuest(body);
  return createHttpResponse({
    success: true,
  });
}

/**
 *
 */
const stateItemVGoldWithdrawInfo = createHttpAsyncStateItem(
  () => {
    return getVGoldWithdrawInfo().then((res) => {
      if (res.success && res.data) {
        const { payLimitWithdrwaInfoVO, ...restInfo } = res.data;
        return {
          ...res,
          data: {
            ...restInfo,
            payLimitWithdrwaInfoVO: payLimitWithdrwaInfoVO
              ? {
                  ...payLimitWithdrwaInfoVO,
                  leftMS:
                    Number(payLimitWithdrwaInfoVO.limitTimeStamp) -
                    res.servertime,
                }
              : undefined,
          },
        };
      }
      return res;
    });
  },
  null,
  'VGoldWithdrawInfo'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;

@Component({})
export class VGoldWithdrawInfoMixin extends Vue {
  stateItemVGoldWithdrawInfoRef = stateItemVGoldWithdrawInfo.ref;
  get GoldWithdrawInfoNormal() {
    return this.stateItemVGoldWithdrawInfoRef.current;
  }
  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  refreshVGoldWithdrawInfo(timeout?: number) {
    return stateItemVGoldWithdrawInfo.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemVGoldWithdrawInfo;
