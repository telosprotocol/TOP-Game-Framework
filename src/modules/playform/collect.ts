import type { IGBusEventPayloadMap } from '@/utils/GBus-type';

import { gBusEmitAndPenetrate } from '@/js_bridge/jsCallApp/utilsPenetrate';
import { callPlayFormStoredChange } from '@/js_bridge/js_call_app_base';
import { tryTraceEvent } from '@/utils/trace';
import { MediaCategory } from '@/views-remote/Download/data';
import { Toast } from 'vant';
import { collectMedia } from './service';

/**
 *     （    collectLoading  ，    item collectStatus ）
 * @param item
 * @returns
 */
export function toggleCollectPlayform(
  item: {
    pfId: number | string;
    img2: string;
    title?: string;
    desc?: string;
    pfTitle?: string;
    pfDesc?: string;
    collectStatus: 1 | 0;
  },
  from: 'pfindex' | 'playform' | 'playform-dialog'
) {
  // const collectLoadingField = 'collectLoading';
  // if (item[collectLoadingField]) {
  //   return;
  // }
  const isCollect = !item.collectStatus;
  tryTraceEvent('watchlist_collect', {
    source_type: from,
    watchlist_name: item.title || item.pfTitle,
    collectStatus: isCollect ? 1 : 0,
    watchlist_id: item.pfId,
  });
  // Vue.set(item, collectLoadingField, true);
  return collectMedia(item.pfId + '', MediaCategory.Playform, isCollect).then(
    (res) => {
      // const collectLoadingField = 'collectLoading';
      // Vue.set(item, collectLoadingField, false);
      if (res.Result === 1) {
        const emitDetail = {
          playformId: item.pfId,
          isCancel: !isCollect,
          detail: {
            pfId: item.pfId,
            img2: item.img2,
            title: item.title || item.pfTitle,
            desc: item.desc || item.pfDesc,
          },
        } as IGBusEventPayloadMap['onPlayFormStoredChange'];
        //   app
        callPlayFormStoredChange(emitDetail);
        //  h5
        gBusEmitAndPenetrate('onPlayFormStoredChange', emitDetail);
        // Vue.set(item, 'collectStatus', isCollect ? 1 : 0);
      } else {
        Toast(res.Reason);
      }

      return {
        isCollect,
        isOk: res.Result === 1,
      };
    }
  );
}
