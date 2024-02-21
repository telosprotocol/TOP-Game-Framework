<template>
  <div class="absolute inset-0 z-[1000]" v-if="value">
    <div class="absolute rounded-full" :style="holeStyle" @click="onClickHole">
      <VHandGuide
        class="scale-75"
        :img="handImage"
        :design-style="{
          width: 56,
          height: 72,
          right: 0,
          bottom: 0,
          transform: 'translate(50%,50%)',
        }"
        circle-class-name="-top-3 -left-3"
      ></VHandGuide>
      <div
        class="absolute -translate-y-full left-1/2 -translate-x-1/2 bg-black font-robot-bold font-bold text-white rounded-md text-xs leading-tight border border-white"
        :style="
          $ss.getters.designPxsObjToReal({
            padding: 16,
            width: 156,
            top: -24,
            right: 0,
          })
        "
      >
        {{ step === 1 ? $t('VP.clickSpin') : $t('VP.completeTasks') }}
        <div class="absolute left-1/2 -translate-x-1/2 bottom-0">
          <div
            class="translate-y-full border-x-[10px] border-y-[10px] border-transparent border-t-white"
          ></div>
          <div
            class="absolute z-[1] -translate-y-[1px] border-x-[10px] border-y-[10px] border-transparent border-t-black"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import PopupMixin from '@/components/Modal/PopupMixin';
import ButtonLockController from '@/controller/ButtonLockController';
import VHandGuide from '@/components/VHandGuide.vue';
import { webpFilter } from '@/directives/webp';

@Component({
  components: { VHandGuide },
})
export default class PPGameGuide extends mixins(PopupMixin) {
  @Prop({
    type: Object,
  })
  taskIconBoudingRect: DOMRect | null;
  @Prop({
    type: String,
  })
  gameId: string;

  get handImage() {
    return webpFilter(require('@/assets/ppgame/hand.png?webp'));
  }

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.step = 1;
      this.$tracev('gamenovice_guidance_play_exposure');
    }
  }
  step = 1;
  /**
   *        
   */
  get extraBlackSpace() {
    const gameWidth = this.$ss.getters.designPxToReal(640); //1920/3:1080/3
    const extraWidth = Math.max(window.screen.width - gameWidth, 0);
    return extraWidth / 2;
  }

  get holeStyle() {
    const padding = this.step === 1 ? 2 : 10;
    const designPxToReal = this.$ss.getters.designPxToReal;
    const bound =
      this.step === 1
        ? {
            top: designPxToReal(182),
            left: designPxToReal(516) + this.extraBlackSpace,
            width: designPxToReal(120),
            height: designPxToReal(120),
          }
        : this.taskIconBoudingRect;
    return {
      top: bound.top - padding + 'px',
      left: bound.left - padding + 'px',
      width: bound.width + padding * 2 + 'px',
      height: bound.height + padding * 2 + 'px',
      boxShadow: '0 0 0 5000px rgba(0, 0, 0, 0.7)',
      background: 'transparent',
    };
  }

  async onClickHole() {
    if (!ButtonLockController.Instance.tryGetLock('guide', 0.5)) {
      return;
    }
    if (this.step === 1 && this.taskIconBoudingRect) {
      this.$tracev('vgame_click_gamenovice_guidance_play_spin', {
        game_id: this.gameId,
      });
      // taskIcon 
      this.step = 2;
    } else {
      this.emitDlgVisible(false);
      if (this.step === 2) {
        this.$tracev('vgame_click_gamenovice_guidance_play_task', {
          game_id: this.gameId,
        });
        this.$emit('openTaskDlg');
      }
    }
    // console.log('[DEBUG] hole clicked');
  }
}
</script>
