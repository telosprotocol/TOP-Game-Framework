<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      :style="{ zIndex: 100 }"
      v-bind="$attrs"
    >
      <div
        class="absolute inset-0"
        style="backdrop-filter: blur(5px); background: rgba(0, 0, 0, 0.5)"
        @click="onCloseClicked"
      ></div>

      <!-- DlgContent Include bg -->
      <main
        class="relative w-[332px] rounded-[30px] bg-[rgba(187,174,204,0.5)] text-white tz-transel-scaleInOut flex flex-col items-center justify-center pt-4 pb-2"
      >
        <header class="leading-9 mb-4 font-bold relative z-0">
          <div
            class="vgradient-text-outline text-[28px]"
            :style="
              $ss.getters.designPxsObjToReal({
                '--v-color-from': '#FFFFFF',
                '--v-color-to': '#DEA616',
                '--v-shadow-from': 'rgba(92,23,160,0.75)',
                '--v-shadow-to': 'rgba(92,23,160,0.75)',
                '--v-shadow-y': 2,
                '--v-shadow-x': '0',
              })
            "
            :data-text="groupTitle"
          >
            {{ groupTitle }}
          </div>
        </header>
        <div class="w-full overflow-hidden h-[314px]">
          <VGameLists
            :game-list="gameList"
            :is-from-collection="true"
            class="-ml-3"
          ></VGameLists>
        </div>
      </main>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop, Watch } from 'vue-property-decorator';
import VGameLists from './VGameLists.vue';
import type { IVGameIconInfoItem } from './GameList.state';
@Component({
  components: { VGameLists },
})
export default class VGameGroupDlg extends mixins(PopupMixin) {
  @Prop({
    type: Array,
  })
  gameList?: IVGameIconInfoItem[];

  @Prop({
    type: String,
  })
  title: string;

  get groupTitle() {
    return this.title || ' ';
  }

  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      // this.$trace('address_book_writeauth_exposure', {
      //   open_type: from,
      // });
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }

    this.emitDlgVisible(false);
  }
  //#endregion

  onOkClicked() {}
}
</script>
