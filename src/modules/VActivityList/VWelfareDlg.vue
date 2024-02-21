<template>
  <GameActivityDlgUI
    :value="value"
    @input="emitDlgVisible"
    v-bind="$attrs"
    :img-title="
      $ss.getters.translateImage({
        en: require('@/assets/gameActivity/welfare-en.png'),
        id: require('@/assets/gameActivity/welfare-id.png'),
      })
    "
  >
    <section
      class="overflow-auto box-content -mx-1"
      :style="
        $ss.getters.designPxsObjToReal({
          height: 287,
          paddingTop: 4,
        })
      "
    >
      <AsyncStatus
        v-if="!activeList.length"
        :status="stateItemVActivityListRef.status"
        @retry="onRetry"
      ></AsyncStatus>
      <VWelfareItemUI
        v-for="item in activeList"
        :item="item"
        @click="onButtonClick(item)"
        :key="item.type"
      >
      </VWelfareItemUI>
    </section>
  </GameActivityDlgUI>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch } from 'vue-property-decorator';
import { VActivityPageListMixin } from '@/modules/VActivityList/activity-page.state';
import { VHiggsIsOpenMixin } from '@/modules/Higgs/higgs-isopen.state';
import AsyncStatus from '@/components/NoData/AsyncStatus.vue';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import VWelfareItemUI from './VWelfareItemUI.vue';
import GameActivityDlgUI from '../UI/GameActivityDlgUI.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { onGBus } from '@/utils/GBus';
@Component({
  components: { AsyncStatus, VWelfareItemUI, GameActivityDlgUI },
})
export default class VWelfareDlg extends mixins(
  BaseDlgMixin,
  BindEventMixinDefault,
  VActivityPageListMixin,
  VHiggsIsOpenMixin
) {
  useInited() {
    return onGBus('onActivityToUpdate', (_payload) => {
      if (this.value) {
        this.refreshVActivityList(200);
      }
    });
  }
  //#region Dlg Basic Setting

  needUpdate: boolean;

  dlgSound = true;
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.needUpdate = false;
      this.refreshVActivityList(200);
      this.refreshVHiggsIsOpen(200);
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }

    this.emitDlgVisible(false);
    this.$emit('close', this.needUpdate);
  }
  @Watch('$ss.state.bridge.webviewResumeFlag')
  async onViewResume() {
    if (this.value) {
      this.refreshVActivityList(200);
    }
  }
  //#endregion

  onRetry() {
    this.refreshVActivityList();
    this.refreshVHiggsIsOpen();
  }
  get isHiggsClientOpen() {
    return this.VHiggsIsOpen === true;
  }
  get activeList() {
    return (this.VActivityList || []).filter((item) => {
      if (item.type === 'HIGGS') {
        return this.isHiggsClientOpen === true;
      }
      return true;
    });
  }
  async onButtonClick(item: API.ActivitiesManagementVO) {
    this.$emit('activityClick', item.type, 'activity');
  }
}
</script>
