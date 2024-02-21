<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-if="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <!-- DlgContent Include bg -->
        <div class="relative w-full flex mt-10">
          <div
            class="absolute z-0 -top-1 left-0 right-0 flex items-center justify-center -translate-y-1/2"
          >
            <header
              class="bg-contain bg-center bg-no-repeat flex items-center justify-center"
              :style="bgHeaderStyle"
            >
              <div
                class="font-rubik font-black text-xl text-white absolute top-14 vgradient-text vstroke"
                :style="
                  $ss.getters.designPxsObjToReal({
                    '--v-color-from': '#FFFFFF',
                    '--v-color-to': '#EAD1FF',
                    '--tw-stroke-width': 1.8,
                    '--tw-stroke-color': '#4E2A7A',
                  })
                "
              >
                {{ $t('VBG.myBackpack') }}
              </div>
            </header>
          </div>
          <div
            class="p-[3px] rounded-md bg-gradient-to-b from-[#C492E0] to-[#AF93C8] mx-auto"
          >
            <button
              @click="onCloseClicked"
              class="absolute right-4 -top-5 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
              v-webp="
                require('@/assets/vcommon/close/btnPurpleClose2.png?webp')
              "
            ></button>
            <main
              class="w-[316px] rounded-md bg-gradient-to-b from-[#FBF6FF] to-[#F3E6FF] pt-12"
            >
              <div
                class="overflow-auto"
                :style="
                  $ss.getters.designPxsObjToReal({
                    height: 364,
                  })
                "
              >
                <List
                  class="flex flex-wrap mx-1"
                  v-bind="listBinds"
                  v-on="listListeners"
                >
                  <BagItem
                    class="shrink-0 mt-2 mb-1 ml-2.5"
                    v-for="(item, idx) in propList"
                    :key="idx"
                    :info="item"
                    @click.native="showDetail(item)"
                  ></BagItem>
                </List>
                <AsyncStatus
                  color="#8B5DCA"
                  :status="asyncStatus"
                  :no-data-text="$t('VBG.yourBackpackIsEmpty')"
                >
                  <button
                    slot="retry-btn"
                    class="vbutton vbutton--green font-rubik w-full h-10 active:scale-95 mb-3 mt-4"
                    @click="onListLoad('error')"
                  >
                    {{ $t('Base.Refresh') }}
                  </button>
                </AsyncStatus>
              </div>
            </main>
          </div>
        </div>
      </div>
      <portal to="modal">
        <PropDetailDlg
          ref="detailDlg"
          v-model="isDetailShow"
          :info="detailInfo"
          @used="onPropUsed"
        ></PropDetailDlg>
      </portal>
    </div>
  </transition>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { List } from 'vant';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import { Watch } from 'vue-property-decorator';
import { tryMergeLocalesForVPrjMyBag } from '@/locales/Page/VPrj/VBG/init';
import BagItem from './BagItem.vue';
import AsyncStatus from '@/components/NoData/AsyncStatus.vue';
import type { IUserPropItem } from './controller/prop.model';
import PropDetailDlg from './PropDetailDlg.vue';
import { getUserPropPage } from './controller//prop.api';
import VListMixin from '@/mixins/VListMixin';
@Component({
  components: {
    BagItem,
    List,
    AsyncStatus,
    PropDetailDlg,
  },
})
export default class MyBagDlg extends mixins(
  BaseDlgMixin,
  VListMixin<IUserPropItem>
) {
  mounted() {
    tryMergeLocalesForVPrjMyBag();
  }
  declare $refs: {
    detailDlg: PropDetailDlg;
  };
  //#region Dlg Basic Setting
  dlgSound = true;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.resetListLoad();
      this.onListLoad();
      this.$tracev('gamehall_mybag_exposure');
    }
  }
  onPropUsed() {
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('[Prop] onPropUsed', this.value);
    }
    if (this.value) {
      this.resetListLoad();
      this.onListLoad();
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_gamehall_mybag', {
      loading_result:
        this.rawDataList.length > 0 ||
        (!this.listBinds.loading && !this.listBinds.error)
          ? 'success'
          : 'fail',
    });

    this.emitDlgVisible(false);
  }
  //#endregion

  get bgHeaderStyle() {
    return this.$ss.getters.convertBgImageStyle(
      '/online/common/ribbon/purpleHead.png?webp',
      true,
      this.$ss.getters.designPxsObjToReal({
        width: 360,
        height: 143,
      })
    );
  }

  // #region
  get propList() {
    return this.rawDataList;
  }

  onListLoad(_from?: 'error') {
    if (_from === 'error') {
      this.$tracev('click_gamehall_mybag_again');
    }
    const queryObj: API.UserPropPageAO = {
      ...this.listQueryObj,
      userId: '',
      backpack: true,
      expired: false,
    };
    this.onReqStart(_from);
    getUserPropPage(queryObj).then((res) => {
      this.onReqEnd(res, queryObj);
    });
  }
  //#endregion

  isDetailShow = false;
  detailInfo: IUserPropItem = null;

  showDetail(detailInfo: IUserPropItem) {
    if (!detailInfo.propProductVo) {
      return;
    }
    this.detailInfo = detailInfo;
    this.isDetailShow = true;
    this.$tracev('click_gamehall_mybag_prop', {
      prop_id: detailInfo.propId,
      prop_name: detailInfo.propProductVo?.nameText,
    });
  }

  closeAll() {
    this.isDetailShow = false;
    this.$refs.detailDlg?.closeAll();
  }
}
</script>
