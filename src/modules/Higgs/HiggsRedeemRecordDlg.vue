<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-if="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <!-- DlgContent Include bg -->
        <div
          class="relative rounded-[20px] w-[312px] bg-gradient-to-b from-[#F7D34A] to-[#FEF9DC] p-1"
        >
          <main
            class="rounded-[20px] bg-gradient-to-b from-[#60286D] to-[#232358] pt-10 pb-2 min-h-full"
          >
            <HiggsHeaderSimpleUI
              :title="$t('V_HG.redeemRecord')"
              @close="onCloseClicked"
            ></HiggsHeaderSimpleUI>
            <div class="h-52 overflow-auto">
              <List v-bind="listBinds" v-on="listListeners" class="w-full px-4">
                <div
                  v-for="item in dataList"
                  class="flex items-center h-16 px-3 bg-[#724E99] rounded-xl mb-1.5 text-white"
                  :key="item.id"
                >
                  <div
                    class="w-10 h-10 bg-contain bg-center bg-no-repeat mr-2"
                    :style="
                      $ss.getters.convertBgImageStyle(
                        item.redemptionItemImageUrl,
                        false
                      )
                    "
                  ></div>
                  <div class="flex-1">
                    <div
                      class="mb-2 text-xs font-rubik font-semibold tz-ellipsis-break-2"
                    >
                      {{ item.redemptionItemName }} *
                      {{ item.txtRedemptionItemAmount }}
                    </div>
                    <div class="text-xs">{{ item.txtDate }}</div>
                  </div>
                  <div
                    class="rounded-full border font-robot py-1 px-1.5"
                    :class="item.statusClassName"
                  >
                    <ib
                      :class="item.statusIcon"
                      class="mr-0.5 -ml-0.5"
                      v-if="item.statusIcon"
                    ></ib>
                    {{ item.txtStatus }}
                  </div>
                </div>
              </List>
              <AsyncStatus
                :status="asyncStatus"
                @retry="onListLoad('error')"
              ></AsyncStatus>
            </div>
          </main>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch } from 'vue-property-decorator';
import AsyncStatus from '@/components/NoData/AsyncStatus.vue';
import { List } from 'vant';
import VListMixin from '@/mixins/VListMixin';
import HiggsHeaderSimpleUI from './HiggsHeaderSimpleUI.vue';
import { formatDateTime } from '@/utils/datetime';
import { formatNumberInAbbreviationWithoutId } from '@/store/modules/universe/universe';
import { recordPagePointController } from '@/vservices/client/PointController';

@Component({
  components: { AsyncStatus, List, HiggsHeaderSimpleUI },
})
export default class HiggsRedeemRecordDlg extends mixins(
  PopupMixin,
  VListMixin<API.PointsRedemptionLogVO>
) {
  //#region Dlg Basic Setting

  dlgSound = true;
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.resetListLoad();
      this.$tracev('higgs_coin_reedem_records_exposure');
    } else {
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_higgs_coin_reedem_records');

    this.emitDlgVisible(false);
  }
  //#endregion

  // #region
  onListLoad(_from?: 'error') {
    this.onReqStart();
    const queryObj = {
      ...this.listQueryObj,
    };
    recordPagePointController(queryObj).then((res) => {
      this.onReqEnd(res, queryObj);
    });
  }
  //#endregion

  get dataList() {
    const STATUS_CONFIG = {
      PENDING: {
        text: this.$t('V_HG.PENDING'),
        className: 'text-[#FFDA57] border-[#FFDA57]',
        icon: '',
      },
      PROCESSED: {
        text: this.$t('V_HG.PROCESSED'),
        className: 'text-[#70FF00] border-[#70FF00]',
        icon: 'iconfont icon-check-outlined',
      },
      REJECTED: {
        text: this.$t('V_HG.REJECTED'),
        className: 'text-[#FF9270] border-[#FF9270]',
        icon: 'iconfont icon-close-circle',
      },
    };
    return this.rawDataList.map((item) => {
      const status = item.status;
      const statusConfig = STATUS_CONFIG[status];
      return {
        ...item,
        txtDate: formatDateTime(Number(item.createdDate)),
        txtStatus: statusConfig?.text,
        statusClassName: statusConfig?.className,
        statusIcon: statusConfig?.icon,
        txtRedemptionItemAmount: formatNumberInAbbreviationWithoutId(
          Number(item.redemptionItemAmount),
          6,
          6
        ),
      };
    });
  }
}
</script>
