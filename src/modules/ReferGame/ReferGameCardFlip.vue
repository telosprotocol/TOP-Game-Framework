<template>
  <div class="flex flex-wrap mx-auto" ref="wrap">
    <div
      v-for="item in cardList2"
      :key="item.no"
      :class="item.containerClass"
      :style="item.containerStyle"
      @click="onItemClick(item)"
    >
      <div
        class="cardItem relative w-full h-full shrink-0"
        :class="item.cardClass"
      >
        <div
          class="cardItem-face cardItem-front bg-contain bg-center bg-no-repeat flex items-center justify-center flex-col"
          :style="
            $ss.getters.convertBgImageStyle(
              require('@/assets/referGame/cardFront.png?webp'),
              true
            )
          "
        >
          <div class="w-full overflow-hidden px-2 mb-1">
            <div class="text-xs text-center tz-ellipsis-break-1 text-[#A76427]">
              {{
                item.info && item.info.propProduct
                  ? item.info.propProduct.nameText
                  : ' '
              }}
            </div>
          </div>
          <div
            class="mb-1 bg-contain bg-center bg-no-repeat"
            :style="
              $ss.getters.convertBgImageStyle(
                item.info && item.info.propProduct
                  ? item.info.propProduct.imageUrl
                  : null,
                false,
                $ss.getters.designPxsObjToReal({ width: 67, height: 40 })
              )
            "
          ></div>
          <div
            class="font-rubik font-black text-sm vgradient-text vstroke"
            :style="{
              '--tw-stroke-width': '1px',
              '--tw-stroke-color': '#AE5100',
              '--v-color-from': '#FFFFD0',
              '--v-color-to': '#F5BE36',
            }"
          >
            {{ item.textNum }}
          </div>
        </div>
        <div
          class="cardItem-face cardItem-back bg-contain bg-center bg-no-repeat"
          v-webp="require('@/assets/referGame/cardBg.png?webp')"
        ></div>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.cardItem {
  transform-style: preserve-3d;
  &-face {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    backface-visibility: hidden;
  }
  &-front {
    transform: rotateY(180deg);
    // rounded-md bg-slate-600 text-white text-xl flex items-center justify-center
  }
  /**
  * showFront
   */
  &--front {
    transform: rotateY(180deg);
  }
}

.flipAnimate {
  transition: transform 1s ease-in-out;
}
</style>
<script lang="ts">
import { wait } from '@/utils/wait';
import Vue from 'vue';
import Component from 'vue-class-component';
import { MS_SECOND } from '@/constants/time';
import { Prop, Watch } from 'vue-property-decorator';
import { formatNumberInAbbreviation } from '@/store/modules/universe/universe';
import { randomSort } from '@/utils/sort';
const FLIP_ANIMATION_MS = MS_SECOND;

type ICardFlipStatus = 'init' | 'flipUserSelect' | 'end';
@Component({
  components: {},
})
export default class ReferGameCardFlip extends Vue {
  $refs: {
    wrap: HTMLDivElement;
  };

  @Prop({
    type: Array,
    required: true,
  })
  cardList: API.InviteFlipCardItemClientVO[];
  animateCardList: API.InviteFlipCardItemClientVO[] = null;

  @Watch('cardList')
  onCardListChange(newCardList: API.InviteFlipCardItemClientVO[]) {
    if (this.stage !== 'init') {
      return; //
    }
    const animateCardList = this.animateCardList;
    if (animateCardList && newCardList) {
      // const newAnimateList: API.InviteFlipCardItemVO[] = [];

      // //
      // const newList = newCardList.filter((item) => {
      //   const idx = animateCardList.findIndex(
      //     (aItem) => item.idx === aItem.idx
      //   );
      //   if (idx !== -1) {
      //     newAnimateList[idx] = item;
      //     return false;
      //   } else {
      //     return true;
      //   }
      // });
      // for (let i = 0; i < newAnimateList.length; i++) {
      //   if (newAnimateList[i] == null) {
      //     if (newList.length === 0) {
      //       break;
      //     }
      //     newList[i] = newList.shift();
      //   }
      // }
      // newList.forEach((item) => {
      //   newAnimateList.push(item);
      // });
      // for (let i = newAnimateList.length - 1; i >= 0; i--) {
      //   if (newAnimateList[i] == null) {
      //     newAnimateList.splice(i, 1);
      //   }
      // }
      this.animateCardList = null;
    }
  }

  /**
   *
   * stage="init"
   * stage="flipAllBack"
   * stage="moveCenter"              ，          ，
   * stage="moveBack"              ，          ，
   * stage ="waitUserClick"
   * stage="flipUserSelect"
   * stage="flipAllFront"
   * stage="end"
   */
  stage = 'init' as ICardFlipStatus;

  cardCenterPosStyle: Partial<CSSStyleDeclaration>[] = [];

  get cardList2() {
    const stage = this.stage;
    const cardBaseStyle = this.$ss.getters.designPxsObjToReal({
      width: 76,
      height: 121,
      margin: 5,
      marginTop: 0,
    });
    function getCardContainer(
      _curIdx: number,
      stage: ICardFlipStatus,
      isSelected: boolean,
      isOpenCard: boolean
    ) {
      if (stage === 'init' || stage === 'end') {
        return {
          cardClassName: '',
        };
      }

      const isOpenCardClassName = isOpenCard ? ' cardItem--front' : '';

      if (stage === 'flipUserSelect') {
        return isSelected
          ? {
              cardClassName: 'cardItem--front flipAnimate',
            }
          : { cardClassName: isOpenCardClassName };
      }
      if (stage === 'flipAllFront') {
        return {
          cardClassName: 'cardItem--front flipAnimate',
        };
      }
      return {};
    }
    const toIdx = this.toIdx;

    return (this.animateCardList || this.cardList).map((item, idx) => {
      const { cardClassName } = getCardContainer(
        idx,
        stage,
        item.idx === toIdx, // isSelected
        false
      );
      return {
        info: item,
        no: idx, //
        textNum: item
          ? formatNumberInAbbreviation(Number(item.propNum), 6, 6)
          : '',
        // text:
        //   item.rewardEnum === 'COIN'
        //     ? this.$t('V.Coin')
        //     : this.$t('V_HG.HGCOIN'), //cardList[item.no].text,//'id:' + item.rewardId + (item.flop ? ' ' : ' ')
        containerClass: '',
        cardClass: cardClassName,
        containerStyle: {
          ...cardBaseStyle,
        },
      };
    });
  }

  /**
   *
   */
  toIdx: number = null;

  reset() {
    this.animateCardList = null;
    this.stage = 'init';
  }

  async startPlay(toRewardId: number, clickedIdx: number) {
    this.stage = 'init';
    this.toIdx = toRewardId;
    // console.log('[DEBUG] PLAY ,toIdx', toRewardId, [...this.cardList2]);
    // this.animateCardList = this.cardList; //TODO?
    await new Promise((resolve) => {
      this.$nextTick(() => {
        resolve(true);
      });
    });

    const staticList = [
      {
        rewardIdx: this.toIdx,
        no: clickedIdx,
      },
    ];
    //
    const newCardList = randomSort(this.cardList);
    //
    staticList.forEach((staticItem) => {
      const curIdx = newCardList.findIndex(
        (ni) => ni.idx === staticItem.rewardIdx
      );
      const toIdx = staticItem.no;
      //swap
      const curItem = newCardList[curIdx];
      newCardList[curIdx] = newCardList[toIdx];
      newCardList[toIdx] = curItem;
    });
    this.animateCardList = newCardList;
    await new Promise((resolve) => {
      this.$nextTick(() => {
        resolve(true);
      });
    });
    this.stage = 'flipUserSelect';
    await wait(FLIP_ANIMATION_MS);
    // this.stage = 'end';
  }

  waitUserClicked: () => void;
  onItemClick(item: typeof ReferGameCardFlip.prototype.cardList2[0]) {
    if (this.stage === 'init') {
      this.$emit('cardClick', item.no);
    }
  }
}
</script>
