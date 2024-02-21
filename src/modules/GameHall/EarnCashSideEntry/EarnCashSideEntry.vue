<template>
  <div
    class="fixed bottom-0 bg-contain bg-center bg-no-repeat"
    @click="onClick"
    :style="
      $ss.getters.normalizeCss(
        {
          width: 50,
          height: 50,
          right: isHide ? -30 : -1,
        },
        require('@/assets/gameHall/earnCashEntry/earnCashEntry.png?webp'),
        true
      )
    "
  >
    <div
      class="absolute left-0 font-bold text-[#A14A00] text-[18px] rotate-90 origin-top scale-50 -translate-x-1/4 bottom-0 flex items-center justify-center"
    >
      <span
        v-for="(item, idx) in rewardWordList"
        :class="{
          wordscale6: rewardWordList.length === 6,
          wordscale7: rewardWordList.length === 7,
        }"
        :style="{
          animationDelay: idx + 's',
          animationDuration: rewardWordList.length + 's',
        }"
        class="animate-infinite block"
        :key="idx"
      >
        {{ item }}
      </span>
    </div>
    <div
      v-for="num in 2"
      :key="num"
      class="absolute right-0 bg-contain bg-center bg-no-repeat animateStar"
      :style="
        $ss.getters.normalizeCss(
          {
            top: num === 1 ? 2 : 31,
            right: num === 1 ? 2 : 16,
            width: num === 1 ? 17 : 10,
            height: num === 1 ? 17 : 10,
            animationDelay: 0.5 * num + 's',
          },
          require('@/assets/gameHall/earnCashEntry/star.png?webp'),
          true
        )
      "
    ></div>
  </div>
</template>
<style scoped>
.wordscale6 {
  animation-name: wordscale6;
}
.wordscale7 {
  animation-name: wordscale7;
}
@keyframes wordscale6 {
  0%,
  16.6%,
  100% {
    transform: scale(1);
  }
  8.3% {
    transform: scale(1.5);
  }
}
@keyframes wordscale7 {
  0%,
  14.28%,
  100% {
    transform: scale(1);
  }
  7.14% {
    transform: scale(1.5);
  }
}
@keyframes animateStar {
  0% {
    transform: rotate(0) scale(0, 0);
  }
  50% {
    transform: rotate(360deg) scale(1, 1);
  }
  100% {
    transform: rotate(720deg) scale(0, 0);
  }
}
.animateStar {
  animation: 1s both animateStar ease-in-out infinite;
}
</style>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import {
  ROUTENAME_INAPP_VGAME,
  ROUTEPATH_V_EARN_CASH,
} from '@/constants/localRoutePath';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { off, on } from '@/utils/dom/event';
import { isTargetInWrapEl } from '@/utils/dom/node';

@Component({
  components: {},
})
export default class EarnCashSideEntry extends mixins(
  BindEventMixinDefault
  // ClickOutsideMixin({
  //   event: 'touchstart',
  //   method: 'onClickOutside',
  // })
) {
  useInited() {
    const pg = document.getElementById('gamePage');
    on(pg, 'touchstart', this.onClickOutside);
    return () => {
      off(pg, 'touchstart', this.onClickOutside);
    };
  }
  isHide = false;

  get rewardWordList() {
    let str = this.$i18n.locale === 'id' ? 'HADIAH' : 'REWARDS';
    return str.split('');
  }

  onClick() {
    if (!ButtonLockController.Instance.tryGetLock('openentry', 0.5)) {
      return;
    }
    if (this.isHide) {
      this.isHide = false;
    } else {
      openAppH5LinkPreferLocal(
        ROUTEPATH_V_EARN_CASH +
          '?from=' +
          ROUTENAME_INAPP_VGAME +
          '_bottomentry', //activity
        {
          getNavLocker: true,
        }
      );
    }
  }

  onClickOutside(e: Event) {
    if (isTargetInWrapEl(e.target as HTMLElement, this.$el as HTMLElement)) {
      return;
    }
    this.isHide = true;
  }
}
</script>
