<template>
  <div class="flex flex-wrap mx-auto" ref="wrap">
    <div
      v-for="item in cardList2"
      :key="item.no"
      :class="item.containerClass"
      :style="item.containerStyle"
      @click="onItemClick(item)"
    >
      <div class="cardItem relative w-full h-full" :class="item.cardClass">
        <div
          class="cardItem-face cardItem-front bg-contain bg-center bg-no-repeat flex items-center justify-center flex-col text-white"
          :style="$ss.getters.convertBgImageStyle(item.info.materialImageUrl)"
        >
          <div
            class="mb-1 bg-contain bg-center bg-no-repeat"
            :style="
              $ss.getters.convertBgImageStyle(
                item.info ? item.info.imageUrl : null,
                false,
                $ss.getters.designPxsObjToReal({
                  width: 67,
                  height: 40,
                })
              )
            "
          ></div>
          <div class="text-xs">
            {{ item.text }}
          </div>
          <div class="font-rubik font-semibold text-sm">
            {{ item.textNum }}
          </div>
        </div>
        <div
          class="cardItem-face cardItem-back bg-contain bg-center bg-no-repeat"
          v-webp="require('@/assets/higgs/cardBgBack.png?webp')"
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
.moveAnimate {
  transition: transform 1s ease-in-out;
}
</style>
<script lang="ts">
import { wait } from '@/utils/wait';
import Vue from 'vue';
import Component from 'vue-class-component';
import { MS_SECOND } from '@/constants/time';
import { Prop, Watch } from 'vue-property-decorator';
import { formatVGold2 } from '@/modules/vFormatter';
import { randomSort } from '@/utils/sort';

import { formatNumberInAbbreviationWithoutId } from '@/store/modules/universe/universe';
const FLIP_ANIMATION_MS = MS_SECOND;
const MOVE_ANIMATION_MS = MS_SECOND;

type ICardFlipStatus =
  | 'init'
  | 'flipAllBack'
  | 'moveCenter'
  | 'moveBack'
  | 'waitUserClick'
  | 'flipUserSelect'
  | 'flipAllFront'
  | 'end';
@Component({
  components: {},
})
export default class CardFlip extends Vue {
  $refs: {
    wrap: HTMLDivElement;
  };
  // /**
  //  *
  //  */
  // get cardEmptyList() {
  //   return Array.from({ length: 9 }).map((_, idx) => {
  //     return {
  //       no: idx,
  //     };
  //   });
  // }

  @Prop({
    type: Array,
    required: true,
  })
  cardList: API.WvFlopInfoRewardVO[];

  @Watch('cardList')
  onCardListChange(newCardList: API.WvFlopInfoRewardVO[]) {
    if (this.stage !== 'init') {
      return; //
    }
    const animateCardList = this.animateCardList;
    if (animateCardList && newCardList) {
      const newAnimateList: API.WvFlopInfoRewardVO[] = [];

      //
      const newList = newCardList.filter((item) => {
        const idx = animateCardList.findIndex(
          (aItem) => item.rewardId === aItem.rewardId
        );
        if (idx !== -1) {
          newAnimateList[idx] = item;
          return false;
        } else {
          return true;
        }
      });
      for (let i = 0; i < newAnimateList.length; i++) {
        if (newAnimateList[i] == null) {
          if (newList.length === 0) {
            break;
          }
          newList[i] = newList.shift();
        }
      }
      newList.forEach((item) => {
        newAnimateList.push(item);
      });
      for (let i = newAnimateList.length - 1; i >= 0; i--) {
        if (newAnimateList[i] == null) {
          newAnimateList.splice(i, 1);
        }
      }
      this.animateCardList = newAnimateList;
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

  animateCardList: API.WvFlopInfoRewardVO[] = null;
  get cardList2() {
    const stage = this.stage;
    const cardBaseStyle = this.$ss.getters.designPxsObjToReal({
      width: 91,
      height: 102,
      margin: 8,
      marginTop: 0,
    });
    const cardCenterPosStyle = this.cardCenterPosStyle;
    function getCardContainer(
      curIdx: number,
      stage: ICardFlipStatus,
      isSelected: boolean,
      isOpenCard: boolean
    ) {
      if (stage === 'init' || stage === 'end') {
        return {
          cardClassName: 'cardItem--front',
        };
      }

      const isOpenCardClassName = isOpenCard ? ' cardItem--front' : '';
      if (stage === 'flipAllBack') {
        return {
          cardClassName: 'flipAnimate' + isOpenCardClassName,
        };
      }
      if (stage === 'moveCenter') {
        return {
          className: 'moveAnimate',
          cardClassName: isOpenCardClassName,
          styleExtra: cardCenterPosStyle[curIdx],
        };
      }
      if (stage === 'moveBack') {
        return {
          cardClassName: isOpenCardClassName,
          className: 'moveAnimate',
          styleExtra: { transform: 'translate(0,0)' },
        };
      }
      if (stage === 'waitUserClick') {
        return {
          cardClassName: isOpenCardClassName,
        };
      }
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
    const toId = this.toId;

    return (this.animateCardList || this.cardList).map((item, idx) => {
      const { styleExtra, className, cardClassName } = getCardContainer(
        idx,
        stage,
        item.rewardId === toId,
        item.flop
      );
      return {
        info: item,
        no: idx,
        textNum: item
          ? item.rewardEnum === 'HIGGS'
            ? formatNumberInAbbreviationWithoutId(
                Number(item.rewardAmount),
                6,
                0
              )
            : formatVGold2(Number(item.rewardAmount))
          : '',
        text:
          item.rewardEnum === 'COIN'
            ? this.$t('V.Coin')
            : this.$t('V_HG.HGCOIN'), //cardList[item.no].text,//'id:' + item.rewardId + (item.flop ? ' ' : ' ')
        containerClass: className || '',
        cardClass: cardClassName,
        containerStyle: {
          ...cardBaseStyle,
          ...styleExtra,
        },
      };
    });
  }

  /**
   *
   */
  toId: number = null;

  reset() {
    this.animateCardList = null;
    this.stage = 'init';
  }

  async startPlay(toRewardId: number) {
    this.stage = 'init';
    this.toId = toRewardId;
    // this.animateCardList = this.cardList; //TODO?
    await new Promise((resolve) => {
      this.$nextTick(() => {
        resolve(true);
      });
    });
    this.stage = 'flipAllBack';
    await wait(FLIP_ANIMATION_MS);
    this.stage = 'moveCenter';
    const childList = this.$refs.wrap.children;
    const midIdx = Math.ceil(childList.length / 2) - 1;
    const centerChild = childList[midIdx];
    const centerPos = centerChild.getBoundingClientRect();
    this.cardCenterPosStyle = this.cardList2.map((item) => {
      const curChildPos = childList[item.no].getBoundingClientRect();
      const x = centerPos.left - curChildPos.left;
      const y = centerPos.top - curChildPos.top;
      return {
        //translate(10px, 10px)
        transform: `translate(${x}px,${y}px)`,
      };
    });
    await wait(MOVE_ANIMATION_MS);
    //
    this.animateCardList = randomSort(this.cardList);
    this.stage = 'moveBack';
    await wait(MOVE_ANIMATION_MS);
    await new Promise<void>((resolve) => {
      this.waitUserClicked = resolve;
      this.stage = 'waitUserClick';
    });
    await new Promise((resolve) => {
      this.$nextTick(() => {
        resolve(true);
      });
    });
    this.stage = 'flipUserSelect';
    await wait(FLIP_ANIMATION_MS);
    this.stage = 'flipAllFront';
    await wait(FLIP_ANIMATION_MS);
    this.stage = 'end';
    await new Promise((resolve) => {
      this.$nextTick(() => {
        this.stage = 'init';
        resolve(true);
      });
    });
  }

  waitUserClicked: () => void;
  onItemClick(item: typeof CardFlip.prototype.cardList2[0]) {
    if (item.info.flop) {
      //
      return;
    }
    if (this.stage === 'waitUserClick') {
      //     cardList
      //
      const staticList = [
        {
          rewardId: this.toId,
          no: item.no,
        },
      ].concat(
        this.cardList2
          .filter((item) => item.info?.flop)
          .map((item) => {
            return {
              rewardId: item.info?.rewardId,
              no: item.no,
            };
          })
      );
      //
      const newCardList = randomSort(this.cardList);
      //
      staticList.forEach((staticItem) => {
        const curIdx = newCardList.findIndex(
          (ni) => ni.rewardId === staticItem.rewardId
        );
        const toIdx = staticItem.no;
        //swap
        const curItem = newCardList[curIdx];
        newCardList[curIdx] = newCardList[toIdx];
        newCardList[toIdx] = curItem;
      });
      this.animateCardList = newCardList;
      this.waitUserClicked?.();
    }
  }
}
</script>
