import { tryTraceEventV } from '@/utils/trace';
import { getCurrentLang } from '@/init/i18n';
import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { getIsAPKListInstalledBatch } from '@/js_bridge/js_call_app_base';
import Vue from 'vue';
import { createHttpResponse } from '@/http/createHttpResponse';
import { getConfigBridgeWithRetry } from '@/js_bridge/js_call_app';
import { getIpRegionBridge } from '@/js_bridge/jsCallApp/getIpRegion';
import stateItemVUserAccount from '@/modules/VAssetInfo/VUserAccount.state';

const RES_NOT_OPEN = createHttpResponse({
  success: true,
  data: false,
});
const HIGGS_CHECK_EVENTNAME = 'higgs_coin_have_entry';
/**
 *  Higgs    ：
 * higgs        （1-6    ）：
1.              （ 'com.neptune.domino',   'com.higgs.domino'）
2.     
3.   IP (       )
4.     
5.    whatsapp
6.    >=2.8.4.0(           higgs)  
 */
const stateItemVHiggsIsOpen = createHttpAsyncStateItem(
  async () => {
    if (process.env.VUE_APP_ENV_NAME2 === 'sim') {
      return createHttpResponse({
        success: true,
        data: true,
      });
    }
    // installed app
    const apkListRes = await getIsAPKListInstalledBatch([
      'com.neptune.domino', //
      'com.higgs.domino', //
      'com.whatsapp', //
    ]);
    if (apkListRes.Result !== 1) {
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log('[HIGGS] get apkList Error', apkListRes);
      }
      tryTraceEventV(HIGGS_CHECK_EVENTNAME, {
        entry_reason: 1,
        have_entry: 'fail',
      });
      return createHttpResponse<boolean>({
        success: false,
        message: 'cant get app install list',
      });
    }

    // no whatsapp
    if (
      !(
        apkListRes.data?.length >= 1 && apkListRes.data.includes('com.whatsapp')
      )
    ) {
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log('[HIGGS] whatsapp notinstalled', apkListRes);
      }
      tryTraceEventV(HIGGS_CHECK_EVENTNAME, {
        entry_reason: 2,
        have_entry: 'fail',
      });
      return RES_NOT_OPEN;
    }
    // cur language
    await getConfigBridgeWithRetry();
    if (getCurrentLang() !== 'id') {
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log('[HIGGS] curLang not id', getCurrentLang());
      }
      tryTraceEventV(HIGGS_CHECK_EVENTNAME, {
        entry_reason: 3,
        have_entry: 'fail',
      });
      return RES_NOT_OPEN;
    }
    // has higgs app or has inviter
    const hasHiggsAppInstalled = apkListRes.data?.length > 1;
    if (!hasHiggsAppInstalled) {
      const accountInfo = await stateItemVUserAccount.getValue();
      if (!accountInfo?.hasInviter) {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('[HIGGS] not installed higgs and has no inviter');
        }
        tryTraceEventV(HIGGS_CHECK_EVENTNAME, {
          entry_reason: 5,
          have_entry: 'fail',
        });
        return RES_NOT_OPEN;
      }
    }
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      return createHttpResponse({
        success: true,
        data: true,
      });
    }
    // 2.8.4.0
    const res = await getIpRegionBridge();
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('[HIGGS] cur Region', res, res.data?.country);
    }
    if (res.Result === 1) {
      const isIDRegion =
        String(res.data?.countryCode || '')
          .toLocaleLowerCase()
          .substring(0, 2) === 'id';
      if (isIDRegion) {
        tryTraceEventV(HIGGS_CHECK_EVENTNAME, {
          entry_reason: 8,
          have_entry: 'success',
        });
      } else {
        tryTraceEventV(HIGGS_CHECK_EVENTNAME, {
          entry_reason: 6,
          have_entry: 'fail',
        });
      }
      return createHttpResponse({
        success: true,
        data: isIDRegion,
      });
    } else {
      tryTraceEventV(HIGGS_CHECK_EVENTNAME, {
        entry_reason: 7,
        have_entry: 'fail',
      });
    }
    return RES_NOT_OPEN;
  },
  null,
  'VHiggsIsOpen'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 5;
/**
 * V
 */
export const VHiggsIsOpenMixin = Vue.extend({
  data() {
    return {
      stateItemVHiggsIsOpenRef: stateItemVHiggsIsOpen.ref,
    };
  },
  computed: {
    VHiggsIsOpen() {
      return this.stateItemVHiggsIsOpenRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，     revalidation  ，   0
     */
    refreshVHiggsIsOpen(timeout?: number) {
      return stateItemVHiggsIsOpen.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVHiggsIsOpen;
