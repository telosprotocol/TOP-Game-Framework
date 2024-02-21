<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask" @click="onCloseClicked"></div>
      <header class="absolute top-0 left-0 right-0 z-20">
        <div
          v-if="isMultiReward"
          class="absolute pointer-events-none bg-contain bg-center bg-no-repeat"
          :style="
            $ss.getters.normalizeCss(
              { width: 360, height: 356 },
              require('@/assets/gameCommon/reward/lightOne.png.webp')
            )
          "
        ></div>

        <div
          class="absolute top-0 left-0 right-0 bg-contain bg-bottom bg-no-repeat z-0 flex flex-col items-center justify-center"
          ref="mubu"
          :class="{ 'animate-slideInDown': value }"
          :style="
            $ss.getters.normalizeCss(
              {
                height: 114,
                paddingLeft: 20,
                paddingRight: 20,
                animationDuration: '450ms',
              },
              require('@/assets/gameCommon/reward/top.png?webp'),
              true
            )
          "
        >
          <div
            class="text-center font-robot-bold font-bold text-[28px] leading-8 relative z-0 -mt-5"
          >
            <div
              v-html="title"
              class="absolute text-[#77350D] translate-y-0.5 w-full h-full z-0"
            ></div>
            <div
              v-html="title"
              class="vgradient-text z-[1] relative"
              :style="{
                '--v-color-from': '#ffffd0',
                '--v-color-to': '#f9d771',
              }"
            ></div>
          </div>
          <div
            class="absolute bg-contain bg-center bg-no-repeat animate-twPulse animate-infinite"
            :style="
              $ss.getters.normalizeCss(
                {
                  width: 110,
                  height: 89,
                  left: 91,
                  top: 2,
                },
                require('@/assets/gameCommon/reward/starLight.png?webp'),
                true
              )
            "
          ></div>
        </div>
      </header>
      <main class="relative z-10 tz-transel-scaleInOut w-[360px]">
        <section
          class="bg-contain bg-center bg-no-repeat w-[360px] mb-3"
          :style="
            isMultiReward
              ? $ss.getters.normalizeCss(
                  {
                    height: 164,
                  },
                  require('@/assets/gameCommon/reward/bgRewardContent.png?webp'),
                  true
                )
              : {}
          "
        >
          <div
            v-if="isMultiReward"
            class="flex items-center justify-center h-full"
          >
            <button
              v-if="hasScrollBtn"
              class="bg-contain bg-center shrink-0 bg-no-repeat mb-4 rotate-180 active:scale-95 relative"
              @click="onScroll(-1)"
              :style="
                $ss.getters.normalizeCss(
                  { width: 30, height: 31, left: 6 },
                  require('@/assets/gameCommon/reward/iconArrowRight.png?webp'),
                  true
                )
              "
            ></button>
            <div
              class="overflow-auto flex items-center"
              ref="scrollWrap"
              :style="
                $ss.getters.designPxsObjToReal({
                  width: 300,
                })
              "
            >
              <div class="flex items-center mx-auto" v-if="list">
                <div
                  class="shrink-0"
                  :style="
                    $ss.getters.designPxsObjToReal({
                      width: 100,
                    })
                  "
                  v-for="item in list"
                  ref="rewardList"
                  :key="item.id"
                >
                  <div
                    class="bg-[#340D0D] border-[2px] border-[#5E321B] p-[1px] rounded-md w-[72px] h-[72px] mx-auto mb-1 flex items-center justify-center relative"
                  >
                    <div
                      class="bg-contain bg-center bg-no-repeat"
                      :style="
                        $ss.getters.normalizeCss(
                          {
                            width: 54,
                            height: 54,
                          },
                          item.imageUrl,
                          false
                        )
                      "
                    ></div>
                    <div
                      class="absolute left-0 right-0 bottom-0.5 text-center vgradient-text text-[13px] font-robot-bold font-bold leading-none vstroke"
                      :style="
                        $ss.getters.normalizeCss({
                          '--v-color-from': '#fff',
                          '--v-color-to': '#f9d771',
                          '--tw-stroke-width': 1,
                          '--tx-stroke-color': '#742231',
                        })
                      "
                    >
                      x{{ item.num }}
                    </div>
                  </div>
                  <div
                    class="text-center tz-ellipsis-break-1 vgradient-text text-white text-[14px] font-robot-bold font-bold"
                    :style="
                      $ss.getters.normalizeCss({
                        '--v-color-from': '#fff',
                        '--v-color-to': '#f9d771',
                      })
                    "
                  >
                    {{ item.nameText }}
                  </div>
                </div>
              </div>
            </div>
            <button
              v-if="hasScrollBtn"
              class="bg-contain bg-center shrink-0 bg-no-repeat mb-4 active:scale-95 relative"
              @click="onScroll(1)"
              :style="
                $ss.getters.normalizeCss(
                  { width: 30, height: 31, left: -6 },
                  require('@/assets/gameCommon/reward/iconArrowRight.png?webp'),
                  true
                )
              "
            ></button>
          </div>
          <div v-else @click="onCloseClicked">
            <div
              class="w-full"
              :style="
                $ss.getters.normalizeCss({
                  height: 300,
                })
              "
            >
              <div
                class="absolute z-0 -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2"
                :style="
                  $ss.getters.normalizeCss({
                    height: 133,
                    width: 133,
                  })
                "
              >
                <div
                  class="bg-contain bg-center bg-no-repeat origin-center w-full h-full animate-zoomIn animate-duration-300"
                  :style="
                    $ss.getters.normalizeCss(
                      {},
                      require('@/assets/gameCommon/reward/circle.png?webp'),
                      true
                    )
                  "
                ></div>
              </div>

              <div
                class="absolute z-0 inset-0 w-full bg-contain bg-center bg-no-repeat animate-twSpin animate-infinite animate-duration-[3s]"
                :style="
                  $ss.getters.normalizeCss(
                    { height: 300 },
                    require('@/assets/vcommon/light/light2.png?webp'),
                    true
                  )
                "
              ></div>
              <div
                class="bg-contain absolute -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2 z-10 bg-center bg-no-repeat"
                :style="
                  $ss.getters.normalizeCss(
                    { width: 105, height: 105 },
                    firstItem.imageUrl
                  )
                "
              ></div>
            </div>
            <div class="flex flex-col items-center -mt-16">
              <div
                class="font-robot-bold font-bold text-[30px] vgradient-text animate-zoomIn animate-duration-300"
              >
                x{{ firstItem.num }}
              </div>
            </div>
          </div>
          <div
            class="absolute pointer-events-none left-0 right-0"
            :style="
              $ss.getters.normalizeCss({
                height: 300,
                top: -60,
              })
            "
          >
            <CelebrateBombAni :value="value"></CelebrateBombAni>
          </div>
        </section>
        <section
          class="absolute left-0 right-0"
          :style="
            $ss.getters.normalizeCss({
              top: isMultiReward ? 210 : 280,
            })
          "
          @click="onCloseClicked"
        >
          <div
            :style="
              $ss.getters.normalizeCss({
                paddingLeft: 60,
                paddingRight: 60,
                height: 64,
              })
            "
          >
            <slot name="btn"></slot>
          </div>
          <div
            class="mx-auto bg-[length:100%_100%] bg-center bg-no-repeat text-center"
            :style="
              $ss.getters.normalizeCss(
                {
                  height: 14,
                  width: 360,
                  color: '#FFEBEA',
                  fontSize: 13,
                  lineHeight: 14,
                },
                require('@/assets/gameCommon/reward/hrArrow.png?webp'),
                false
              )
            "
          >
            {{ $t('V.ClickToClaim') }}
          </div>
        </section>
      </main>
    </div>
  </transition>
</template>

<script lang="ts">
import CelebrateBombAni from '@/components/CelebrateAni/CelebrateBombAni.vue';
import ButtonLockController from '@/controller/ButtonLockController';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import BaseDlgMixin from '../../components/Modal/BaseDlgMixin';
const AWARD_WIDTH = 100;
@Component({
  components: { CelebrateBombAni },
})
export default class RewardDlgUI extends mixins(BaseDlgMixin) {
  declare $refs: {
    scrollWrap: HTMLDivElement;
    mubu: HTMLDivElement;
  } & typeof BaseDlgMixin.prototype.$refs;
  @Prop({
    type: Array,
  })
  list: {
    nameText: string;
    id: string;
    imageUrl: string;
    num: string | number;
    type: API.PropRewardDetailVO['type'];
  }[];

  get title() {
    return this.$t('V.getRewardsSuccess');
  }

  get isMultiReward() {
    const list = this.list;
    return list && list.length > 1;
  }

  get firstItem() {
    return this.list[0];
  }

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$nextTick(() => {
        const scrollWrap = this.$refs.scrollWrap;
        if (scrollWrap) {
          scrollWrap.scrollLeft = 0;
        }
      });
    } else {
      this.$refs.mubu.className =
        this.$refs.mubu.className.replace('animate-slideInDown', '') +
        ' animate-slideOutUp';
    }
    //'animate-slideInDown': !!value,'animate-slideOutUp': !value,
  }
  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$emit('close');
    this.emitDlgVisible(false);
  }
  get hasScrollBtn() {
    return this.list && this.list.length > 3;
  }
  /**
   *   
   * @param dir
   */
  onScroll(dir: -1 | 1) {
    const scrollWrap = this.$refs.scrollWrap;
    if (!scrollWrap) {
      return;
    }
    const curScrollLeft = scrollWrap.scrollLeft; //0
    const size = this.$ss.getters.designPxToReal(AWARD_WIDTH);
    const length = this.list?.length || 0;
    const curLeftIdx = curScrollLeft / size;
    let toIdx: number;
    if (dir === -1) {
      toIdx = Math.max(Math.ceil(curLeftIdx - 1), 0);
    } else {
      toIdx = Math.min(Math.round(curLeftIdx + 3), length - 1);
    }
    const childEl = scrollWrap.children[0].children[toIdx];
    if (!childEl) {
      return;
    }
    childEl.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>
