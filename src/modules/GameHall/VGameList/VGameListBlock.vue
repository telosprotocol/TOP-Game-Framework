<template>
  <div
    v-if="gameMenuList"
    class="mx-auto"
    :style="
      $ss.getters.normalizeCss({
        width: 350,
      })
    "
  >
    <header
      class="bg-cover bg-bottom bg-no-repeat font-robot-medium font-medium overflow-x-auto relative z-[1]"
      :style="
        $ss.getters.normalizeCss(
          { height: 32 },
          require('@/assets/gameHall/gameList/bgGameTab.png?webp'),
          true
        )
      "
    >
      <div class="flex items-center h-full" ref="menuWrap">
        <div
          v-for="(item, idx) in menuList"
          :key="item.id"
          @click="changeMenu(idx)"
          class="whitespace-nowrap shrink-0 h-full flex items-center justify-center leading-tight px-2 pt-0.5"
          :class="{
            'text-[#FFB731] text-[17px] rounded-t-[10px] bg-gradient-to-b from-[#B05813] to-[rgba(145,71,25,0.7)]':
              safeMenuIdx === idx,
            'text-[#9B511B] text-[15px]': safeMenuIdx !== idx,
          }"
          :style="
            $ss.getters.normalizeCss({
              minWidth: 63,
              textShadow:
                safeMenuIdx === idx
                  ? '0px 0.5px 0px #7B4300'
                  : '0px 0.5px 0px #FFE68B',
              boxShadow:
                safeMenuIdx === idx
                  ? '0px 2px 0px 0px #7B4300 inset'
                  : undefined,
            })
          "
        >
          {{ item.nameText || ' ' }}
        </div>
      </div>
    </header>
    <div
      class="rounded-b-[10px] w-full pt-2 relative z-0"
      :style="
        $ss.getters.normalizeCss({
          height: 360,
          background: 'rgba(255, 223, 165, 0.5)',
          boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.5)',
          opacity: resumeFlag === -1 ? '0.999' : '1',
        })
      "
    >
      <slot></slot>
      <VGameLists
        @gameOpened="$emit('gameOpened', $event)"
        ref="gameList"
        :game-list="gameList"
        :is-from-collection="false"
        :show-new-guide="showNewGuide"
      ></VGameLists>
    </div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import VGameLists from './VGameLists.vue';
import VGameGroupDlg from './VGameGroupDlg.vue';
import { VUserAccountMixin } from '@/modules/VAssetInfo/VUserAccount.state';
import { MS_DAY } from '@/constants/time';
const ALL_ID = '1';
const NEW_ID = '2';

/**
 * GameBlock in GamePage include Collection Dlg
 */
@Component({
  components: { VGameLists, VGameGroupDlg },
})
export default class VGameListBlock extends mixins(VUserAccountMixin) {
  $refs: {
    gameList: VGameLists;
    menuWrap: HTMLElement;
  };
  @Prop({
    type: Array,
  })
  gameMenuList?: RAPI.GameMenuItemDetailVO[];

  @Prop({
    type: Boolean,
  })
  showNewGuide?: boolean;

  //#region       menuId
  get isOldUser() {
    const createTime = this.UserAccount?.userInfo?.createTime;
    if (!createTime) {
      return false;
    }

    const spanms =
      this.stateItemVUserAccountRef.lastServerDt - Number(createTime);
    return spanms > MS_DAY * 3;
  }

  resumeFlag = -1;
  _timer: ReturnType<typeof setTimeout>;
  @Watch('$ss.state.bridge.webviewResumeFlag')
  async onViewResume() {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.resumeFlag = this.resumeFlag * -1;
    }, 100);
  }

  autoSetCurMenuIdx() {
    const gameMenuList = this.gameMenuList;
    if (gameMenuList) {
      const isOldUser = this.isOldUser;
      let toIdx: number = null;
      const preferId = isOldUser ? ALL_ID : NEW_ID;
      /**
       *  （72 ）： New
       *  ：  All , New
       */
      gameMenuList.find((item, idx) => {
        if (String(item.id) === preferId) {
          toIdx = idx;
          return true;
        }
        if (String(item.id) === ALL_ID && toIdx == null) {
          //ALL
          toIdx = idx;
        }
        return false;
      });
      if (toIdx != null) {
        this.curMenuIdx = toIdx;
        this.refreshTabItemPos();
      }
    }
  }

  _isSettedThisTime?: boolean;
  get isLogined() {
    return this.$ss.getters['user/isRealLogined'];
  }

  @Watch('isLogined')
  onLoginded() {
    this._isSettedThisTime = false;
  }

  @Watch('isOldUser')
  onIsOldChanged() {
    this.autoSetCurMenuIdx();
  }
  @Watch('gameMenuList')
  onGameMenuListChange(gameMenuList?: RAPI.GameMenuItemDetailVO[]) {
    if (gameMenuList && !this._isSettedThisTime) {
      this._isSettedThisTime = true;
      this.autoSetCurMenuIdx();
    }
  }
  //#endregion

  curMenuIdx = 1;

  get safeMenuIdx() {
    const curMenuIdx = this.curMenuIdx;
    const curMenuItem = this.gameMenuList?.[curMenuIdx];
    if (curMenuItem) {
      return curMenuIdx;
    }
    return 0;
  }

  refreshTabItemPos() {
    this.$nextTick(() => {
      const el = this.$refs.menuWrap?.children?.[this.safeMenuIdx];
      if (!el) {
        return;
      }
      el.scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: 'smooth',
      });
    });
  }
  changeMenu(idx: number) {
    this.curMenuIdx = idx;
    this.refreshTabItemPos();
  }
  get menuList() {
    return this.gameMenuList || [];
  }

  get gameList() {
    return this.gameMenuList?.[this.safeMenuIdx]?.gameInfoList;
  }
  async getRecomendGameInfo() {
    // const recommendInfo = getRecomendPos(gameId, this.gameMenuList);
    // if (!recommendInfo) {
    //   return null;
    // }
    // this.curMenuIdx = recommendInfo.gameMenuIdx;
    this.refreshTabItemPos();
    return this.$nextTick().then(() => {
      const gameList = this.$refs.gameList;

      const scrollTop = document.documentElement.scrollTop || 0;
      const bounding = gameList.$el.getBoundingClientRect();
      const gameWrapBounding = {
        width: bounding.width,
        height: bounding.height,
        left: bounding.left,
        top: bounding.top + scrollTop,
      };
      return {
        bounding: gameWrapBounding,
        gameList: gameList.curVisibleGameList,
      };
    });
  }
}
</script>
