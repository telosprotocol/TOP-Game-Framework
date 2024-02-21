import { createHttpAsyncStateItemWithLSCache } from '@/controller/AsyncStateItemWithLsCache';
import { MS_MINUTES_30 } from '@/constants/time';
import { BannerOpType } from '@/constants/BannerOpType';
import { MS_MINUTE } from '@/constants/time';
import type { IAsyncStateRef } from '@/controller/AsyncStateItem';
import Vue from 'vue';
import type AsyncStateItem from '@/controller/AsyncStateItem';
import ButtonLockController from '@/controller/ButtonLockController';
import { bannerNavigation } from '@/utils/navigator';
import Component, { mixins } from 'vue-class-component';
import { bannerListBannerController } from '@/vservices/restful/BannerController';
const stateItemMap: Partial<
  Record<
    string,
    AsyncStateItem<
      RAPI.BannerListVO[],
      undefined,
      IHttpResponse<RAPI.BannerListVO[]>
    >
  >
> = {};
/**
 *     -    :string
 * Enum (    :GAME_HOME,     :PROMOTION,    :COLLEGE_CENTER,    :GAME_PLAYER_CENTER,      :FORTUNE_HOME)
 */
export type IVBANNER_SHOWSCENE_TYPE = RAPI.BannerListVO['showScene'];

//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;

function getOrCreateStateItemForVBannerList(
  showScene: IVBANNER_SHOWSCENE_TYPE,
  defaultValue?: RAPI.BannerListVO[]
) {
  if (!stateItemMap[showScene]) {
    /**
     *  V
     */
    const stateItemVBannerList = createHttpAsyncStateItemWithLSCache(
      ('VBannerList_' + showScene) as 'VBannerList_GAME_HOME',
      () => {
        return bannerListBannerController({ showScene });
      },
      defaultValue || null
    );
    stateItemMap[showScene] = stateItemVBannerList;
  }
  return stateItemMap[showScene];
}

@Component({})
class VBannerListBaseMixin extends Vue {
  stateItemVBannerList: AsyncStateItem<
    RAPI.BannerListVO[],
    undefined,
    IHttpResponse<RAPI.BannerListVO[]>
  >;
  stateItemVBannerListRef: IAsyncStateRef<
    RAPI.BannerListVO[],
    IHttpResponse<RAPI.BannerListVO[]>
  >;
  get BannerList() {
    return this.stateItemVBannerListRef.current;
  }
  /**
   *
   * @param timeout     ，     revalidation  ，   0
   */
  refreshVBannerList(timeout?: number) {
    return this.stateItemVBannerList.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
  __bannerExposeMap: Record<string, number>;
  getBannerUniqueKey(item: RAPI.BannerListVO) {
    return item.id;
  }
  /**
   * Banner    (5        )
   * @param bannerItem
   * @param eventName
   * @returns
   */
  tryTraceBannerExpose(
    bannerItem: RAPI.BannerListVO,
    eventName: string,
    /**
     *
     */
    vgame?: string
  ) {
    if (!bannerItem) {
      return false;
    }
    const bannerKey = bannerItem.id;

    const dtNow = new Date().getTime();
    if (!this.__bannerExposeMap) {
      this.__bannerExposeMap = {};
    }
    const lastTraceDt = this.__bannerExposeMap[bannerKey] || 0;

    if (dtNow - lastTraceDt > MS_MINUTES_30) {
      this.__bannerExposeMap[bannerKey] = dtNow;
      this.$trace(eventName, {
        banner_id: bannerItem.id,
        banner_title: bannerItem.title,
        banner_url: bannerItem.linkUrl,
        vgame,
      });
    }
  }
  async onBannerClick(
    item: RAPI.BannerListVO,
    eventName: string,
    vgame?: string
  ) {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return; //
    }
    //
    this.$trace(eventName, {
      // type: item.traceType,
      // tag: item.traceTag,
      banner_id: item.id,
      banner_title: item.title,
      banner_url: item.linkUrl,
      vgame,
    });
    if (!item.linkUrl) {
      return;
    }
    if (item.linkUrl) {
      //
      bannerNavigation({
        url: item.linkUrl,
        opType: BannerOpType.AppLink,
      });
    }
  }
}
const mixinMap: Record<string, typeof VBannerListBaseMixin> = {};
function createVBannerListMixin(
  showScene: IVBANNER_SHOWSCENE_TYPE,
  defaultValue?: RAPI.BannerListVO[]
) {
  const stateItemVBannerList = getOrCreateStateItemForVBannerList(
    showScene,
    defaultValue
  );
  @Component({})
  class VBannerListMixin extends mixins(VBannerListBaseMixin) {
    get VBANNER_SHOW_SCENE() {
      return showScene;
    }
    stateItemVBannerList = stateItemVBannerList;
    stateItemVBannerListRef = stateItemVBannerList.ref;
  }

  return VBannerListMixin;
}
export function createOrGetVBannerListMixin(
  showScene: IVBANNER_SHOWSCENE_TYPE,
  defaultValue?: RAPI.BannerListVO[]
) {
  if (!mixinMap[showScene]) {
    mixinMap[showScene] = createVBannerListMixin(
      showScene,
      defaultValue
    ) as typeof VBannerListBaseMixin;
  }
  return mixinMap[showScene];
}
