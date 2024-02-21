<template>
  <div class="pb-20">
    <!-- title -->
    <section
      class="bg-contain bg-center bg-no-repeat w-full"
      :style="
        $ss.getters.normalizeCss(
          {
            height: 50,
          },
          imgTitle
        )
      "
    ></section>
    <!-- Turntable -->
    <div class="relative -mt-1">
      <!-- Beach -->
      <div
        class="absolute bg-contain bg-center bg-no-repeat left-1/2 -translate-x-1/2"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 348,
              height: 86,
              bottom: -60,
            },
            require('@/assets/turntable3/beach.png?webp'),
            true
          )
        "
      ></div>
      <!-- Turntable--bottom -->
      <div
        class="absolute bg-contain bg-center bg-no-repeat left-1/2 -translate-x-1/2"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 180,
              height: 59,
              bottom: type !== 'DIAMOND' ? -22 : -18,
            },
            type !== 'DIAMOND'
              ? require('@/assets/turntable3/bottom.png?webp')
              : require('@/assets/turntable3/bottom-diamond.png?webp'),
            true
          )
        "
      ></div>
      <!-- Turntable--bg -->
      <section
        ref="turnTable"
        class="bg-contain bg-center bg-no-repeat relative z-0 rotate animated infinite mx-auto"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 318,
              height: 318,
            },
            require('@/assets/turntable3/turntable.png'),
            false
          )
        "
      >
        <div
          v-for="item in spinCells"
          class="absolute left-1/2 -translate-x-1/2 origin-bottom flex flex-col items-center justify-start bg-contain bg-bottom bg-no-repeat"
          :class="{
            'animate-flash animate-repeat-3':
              isActiveCellBgShow && item.idx === curTurnCellIdx,
          }"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 116,
                height: 159,
                top: 0,
                paddingTop: 20,
                '--tw-rotate': 45 * item.idx + 'deg',
              },
              isActiveCellBgShow && item.idx === curTurnCellIdx
                ? type !== 'DIAMOND'
                  ? require('@/assets/turntable3/select.png?webp')
                  : require('@/assets/turntable3/select-diamond.png?webp')
                : null,
              true
            )
          "
          :key="item.idx"
        >
          <div
            class="bg-contain bg-center bg-no-repeat"
            :style="
              $ss.getters.normalizeCss(
                { width: 70, height: 66, marginBottom: 6 },
                item.icon,
                false
              )
            "
          ></div>
          <div
            class="font-rubik font-bold text-base leading-none tracking-tighter"
            :class="{
              'vgradient-text': type !== 'DIAMOND' && item.idx % 2 === 0,
            }"
            :style="
              type !== 'DIAMOND'
                ? item.idx % 2 === 0
                  ? {
                      color: 'white',
                      '--v-color-from': '#FFFFFF',
                      '--v-color-to': '#F5C02A',
                      textStroke: '1px #28574B',
                    }
                  : {
                      color: '#27663C',
                      textStroke: '1px #fff',
                    }
                : item.idx % 2 === 0
                ? {
                    color: '#FDED87',
                    textStroke: '1px #422183',
                  }
                : {
                    color: '#E034FF',
                    textStroke: '1px #fff',
                  }
            "
          >
            {{ item.amount }}
          </div>
        </div>
        <div
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div
            class="bg-contain bg-center bg-no-repeat animate-infinite animate-twSpin animate-fill-forwards animate-steps-start-8"
            :style="
              $ss.getters.normalizeCss(
                {
                  width: 312,
                  height: 312,
                  animationDuration: '8s',
                },
                require('@/assets/turntable3/bumbCircle.png?webp'),
                true
              )
            "
          ></div>
        </div>
      </section>
      <div
        v-if="type === 'DIAMOND'"
        class="absolute bg-contain bg-center bg-no-repeat left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 326,
              height: 326,
            },
            require('@/assets/turntable3/turntable-diamond-outter.png?webp'),
            true
          )
        "
      ></div>
      <!-- Beach-TreeDec -->
      <div
        class="absolute bg-contain bg-center bg-no-repeat"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 92,
              height: 104,
              bottom: -40,
              left: -8,
            },
            require('@/assets/turntable3/tree.png?webp'),
            true
          )
        "
      ></div>
      <slot name="before"></slot>
      <!-- activePointer -->
      <div
        class="z-20 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      >
        <div
          class="bg-contain bg-center bg-no-repeat"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 100,
                height: 100,
              },
              type !== 'DIAMOND'
                ? require('@/assets/turntable3/pointer.png?webp')
                : require('@/assets/turntable3/pointer-diamond.png?webp'),
              true
            )
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import type gsap from 'gsap';
import { wait } from '@/utils/wait';
import { getCoinConfig } from '@/modules/VAssetInfo/VCoin.config';
let curGsapIns: typeof gsap;
function getGsap() {
  if (curGsapIns) {
    return Promise.resolve(curGsapIns);
  }
  return import('gsap').then((gsapIns) => {
    curGsapIns = gsapIns.default;
    return curGsapIns;
  });
}

const CELL_DEG = 45;
@Component({
  components: {},
})
export default class Turntable extends Vue {
  $refs!: {
    turnTable: HTMLDivElement;
  };
  mounted() {
    getGsap();
  }
  @Prop({
    type: String,
    required: true,
  })
  imgTitle: string;

  @Prop({
    type: String,
    required: true,
  })
  type: API.LuckyWheelVO['luckyWheelType'];

  @Prop({
    type: Object,
    required: false,
  })
  info?: API.LuckyWheelVO;

  get turntableSize() {
    return this.$ss.getters.designPxsObjToReal({
      width: 335,
      height: 335,
    });
  }

  get spinCells() {
    const list: {
      idx: number;
      text: string;
      icon: string;
      amount: string;
    }[] = [];
    const turntableList = this.info?.items || [];
    for (let i = 0; i < 8; i++) {
      const item = turntableList[i] || {};
      const config = getCoinConfig(item.coin);

      list.push({
        idx: i,
        text: config.format(Number(item.amount)),
        amount: config.format(Number(item.amount), {
          separator: '',
        }),
        icon: item.icon || config.icon,
      });
    }
    return list;
  }

  isActiveCellBgShow = false;
  async prepareTurn() {
    const gsapIns = await getGsap();
    return gsapIns;
  }

  resetTurn() {
    this.isActiveCellBgShow = false;
    const spinEl = this.$refs.turnTable;
    // spinEl.style.transform = 'rotate(0)';
    this.curTurnCellIdx = 0;
    // console.log('[DEBUG] start reset', this.lastTl);
    if (this.lastTl) {
      this.lastTl.set(spinEl, { rotation: 0 });
    }
  }

  lastTl: gsap.core.Timeline;
  curTurnCellIdx = 0;

  async startTurn(toCellIdx: number) {
    this.isActiveCellBgShow = false;
    const gsapIns = await getGsap();
    const lastIndex = this.curTurnCellIdx;
    const spinEl = this.$refs.turnTable;
    return new Promise<gsap.core.Timeline | null>((resolve) => {
      let toAngle = 360 * 6 - CELL_DEG * toCellIdx; //+ lastIndex * CELL_DEG
      // if (this.lastTl) {
      //   this.lastTl.set(spinEl, { rotation: lastIndex * CELL_DEG });
      // }
      const tl = this.lastTl || gsapIns.timeline({ paused: true });
      this.lastTl = tl;
      this.curTurnCellIdx = toCellIdx;
      //
      tl.set(spinEl, { rotation: -lastIndex * CELL_DEG })
        .to(spinEl, {
          duration: 3,
          rotation: toAngle + 'deg',
          ease: 'power4.inOut',
        })
        .then(async () => {
          this.isActiveCellBgShow = true;
          // tl.to(this.$refs.activeCell, {
          //   duration: 0.5,
          //   opacity: '1',
          //   yoyo: true,
          //   repeat: 2,
          // });
          return await wait(2000);
        })
        .then(() => {
          // console.log('[DEBUG]doAnimation=>end.');
          // spinEls.style.transform = ``;

          // for (let i = 0; i < spinEls.length; i++) {
          //   (spinEls[i] as HTMLDivElement).style.transform = `rotate(${
          //     -CELL_DEG * toCellIdx
          //   }deg)`;
          // }
          tl.clear(true);
          tl.seek(0);
          resolve(null);
        })
        .catch(() => {
          // console.log('dddddddddddddoAnimation catch:')
          resolve(null);
        });
      tl.play(); //

      // console.log('[VLuckWheelDlg] start');
    });
  }
}
</script>
