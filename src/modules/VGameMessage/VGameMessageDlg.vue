<template>
  <div>
    <transition name="tz-transwrap">
      <div
        ref="dlgWrap"
        class="tz-modal tz-transwrap-scale flex items-center justify-center"
        v-if="value"
        v-bind="$attrs"
      >
        <div class="tz-modal_mask"></div>
        <!-- Dlg Container: FullScreen -->
        <div class="relative max-h-screen tz-transel-scaleInOut mt-10">
          <!-- DlgContent Include bg -->
          <!-- CloseButton -->
          <button
            @click="onCloseClicked"
            :style="
              $ss.getters.normalizeCss(
                {
                  top: 50,
                  right: 2,
                },
                require('@/assets/gameMsg/bgMsgDlgClose.png?webp'),
                true
              )
            "
            class="absolute w-9 h-12 bg-contain bg-center bg-no-repeat active:scale-95 z-20"
          ></button>
          <main
            class="relative mx-auto text-[#9D5C37] bg-contain bg-no-repeat bg-center flex flex-col items-center"
            :style="
              $ss.getters.normalizeCss(
                {
                  width: 332,
                  height: 503,
                  paddingTop: 62,
                  paddingBottom: 26,
                },
                require('@/assets/gameMsg/bgMsgDlg.png?webp'),
                true
              )
            "
          >
            <div class="mx-8 px-1 mt-1 overflow-y-auto flex-1">
              <div
                v-if="asyncStatus === 'nodata'"
                class="h-full flex flex-col justify-center pb-8"
              >
                <div class="flex flex-col items-center">
                  <div
                    class="bg-center bg-no-repeat bg-contain"
                    :style="
                      $ss.getters.convertBgImageStyle(
                        require('@/assets/gameMsg/messageEmpty.png'),
                        false,
                        $ss.getters.designPxsObjToReal({
                          width: 90,
                          height: 90,
                          marginBottom: 18,
                        })
                      )
                    "
                  ></div>
                  <div class="font-rubik text-[#E5AF4F] text-base">
                    {{ $t('VG.NoMsg') }}
                  </div>
                </div>
              </div>
              <div class="w-full h-full" v-else>
                <List
                  class="pb-1.5 pt-1"
                  v-bind="listBinds"
                  v-on="listListeners"
                >
                  <VGameMessageItem
                    v-for="item in dataList"
                    class="mb-[5px]"
                    :key="item.id"
                    :info="item"
                    @click.native="onOpenDetail(item, 'messgae_list')"
                  ></VGameMessageItem>
                  <AsyncStatus
                    :status="asyncStatus"
                    @retry="onListLoad('error')"
                  ></AsyncStatus>
                </List>
              </div>
            </div>
            <section
              class="text-[#965A1D] h-6 pt-2 text-center font-rubik font-xs leading-4 scale-[0.8]"
              style="text-shadow: 0px 1px 0px #fbbf81"
            >
              {{ $t('VG.preserveMsgTip') }}
            </section>
          </main>
          <button
            :class="{
              invisible: rewardMessageIds.length === 0,
            }"
            @click="onRecevieAllClick"
            class="mx-auto block vbtn vbtn--primary px-2 -mt-4 active:scale-95"
          >
            {{ $t('VG.RevAll') }}
          </button>
        </div>
      </div>
    </transition>
    <portal to="modal">
      <VGameMessageDetailDlg
        @openRewards="onOpenRewardDlg"
        @deleted="onMsgDeleted"
        v-model="isDetailOpened"
        :info="detailInfo"
      ></VGameMessageDetailDlg>
      <VGettedRewardsDlg
        v-model="isRewardsDlgShow"
        :rewards="rewardsDlgList"
      ></VGettedRewardsDlg>
    </portal>
  </div>
</template>
<script lang="ts">
import AsyncStatus from '@/components/NoData/AsyncStatus.vue';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { List, Toast } from 'vant';
import VGameMessageItem from './VGameMessageItem.vue';
import ButtonLockController from '@/controller/ButtonLockController';
import {
  showLoading_bridge,
  dismissLoading_bridge,
} from '@/js_bridge/js_call_app_base';
import VGameMessageDetailDlg from './VGameMessageDetailDlg.vue';
import { VUserAccountMixin } from '@/modules/VAssetInfo/VUserAccount.state';
import VGettedRewardsDlg from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import type { IVGettedRewardDlgInfo } from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import VListMixin from '@/mixins/VListMixin';
import type { VCoinEnum } from '../VAssetInfo/VCoinEnum';
import {
  collectRewardMessageController,
  markReadMessageController,
  pageMessageController,
} from '@/vservices/client/MessageController';
import { updateRewardsByPropTypes } from '../VAssetInfo/VAsset.utils';

@Component({
  components: {
    AsyncStatus,
    List,
    VGameMessageItem,
    VGameMessageDetailDlg,
    VGettedRewardsDlg,
  },
})
export default class VGameMessageDlg extends mixins(
  BaseDlgMixin,
  VUserAccountMixin,
  VListMixin<API.UserMessageVO>
) {
  //#region Dlg Basic Setting
  dlgSound = true;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('app_in_message_exposure');
      this.resetListLoad();
      this.onListLoad();
    }
  }

  onCloseClicked() {
    this.$tracev('close_app_in_message');

    this.emitDlgVisible(false);
    this.$emit('close', {
      needRefreshStatus: this.needRefreshStatus,
    });
  }
  //#endregion

  //#region
  onListLoad(_from?: string) {
    const queryObj = { ...this.listQueryObj };
    // console.log('[DEBUG] UpdateList', { ...queryObj }, from);
    this.onReqStart(_from);
    pageMessageController(queryObj).then((res) => {
      this.onReqEnd(res, queryObj);
    });
  }

  get dataList() {
    return this.rawDataList;
  }
  //#endregion

  //#region
  get rewardMessageIds() {
    const rawDataList = this.rawDataList || [];

    return rawDataList.filter((item) => item.hasReward).map((item) => item.id);
  }

  async onRecevieAllClick() {
    if (!ButtonLockController.Instance.tryGetLock('rev', 0.5)) {
      return;
    }
    this.$tracev('click_app_in_message_allreward');
    // const messageIds = this.rewardMessageIds;
    showLoading_bridge();
    const res = await collectRewardMessageController({ messageIds: [] });
    dismissLoading_bridge();
    if (res.success) {
      this.resetListLoad();
      this.onListLoad();
      this.onOpenRewardDlg(res.data);
    } else {
      Toast(res.message);
    }
  }

  isRewardsDlgShow = false;
  rewardsDlgList: IVGettedRewardDlgInfo[] = null;
  onOpenRewardDlg(rewardList: API.UserMessageCollectRewardVO[]) {
    this.needRefreshStatus = true;
    //
    const newMap: { [rewardType: string]: IVGettedRewardDlgInfo } = {};
    const rewardsDlgList: IVGettedRewardDlgInfo[] = [];
    rewardList.forEach((item) => {
      if (!newMap[item.rewardType]) {
        const curItem = {
          coin: item.rewardType as VCoinEnum,
          num: Number(item.amount),
        };
        newMap[item.rewardType as string] = curItem;
        rewardsDlgList.push(curItem);
      } else {
        newMap[item.rewardType].num += Number(item.amount);
      }
    });
    this.rewardsDlgList = rewardsDlgList;
    this.isRewardsDlgShow = true;
    updateRewardsByPropTypes('GOLD');
  }
  //#endregion

  needRefreshStatus = false;
  //#region
  onMsgDeleted() {
    this.needRefreshStatus = true;
    this.resetListLoad();
    this.onListLoad();
  }
  isDetailOpened = false;
  detailInfo: API.UserMessageVO = null;

  onOpenDetail(
    info: API.UserMessageVO,
    from?: 'messgae_list' | 'hall_init' | 'game_settled'
  ) {
    if (!ButtonLockController.Instance.tryGetLock('detail', 0.5)) {
      return;
    }
    this.$tracev('click_app_in_message_email', {
      email_name: info.title,
      email_id: info.id + '',
      open_source: from,
    });
    markReadMessageController({
      messageIds: [info.id],
    });
    if (!info.hasReward && !info.readStatus) {
      this.needRefreshStatus = true;
    }
    info.readStatus = true;
    this.detailInfo = info;
    this.isDetailOpened = true;
  }
  //#endregion
  closeAll() {
    this.isDetailOpened = false;
    this.isRewardsDlgShow = false;
  }
}
</script>
