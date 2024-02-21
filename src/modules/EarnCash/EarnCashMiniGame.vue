<template>
  <div
    v-if="needShowModule"
    class="bg-[#FFCF7C] rounded-xl px-1.5 pt-6"
    :style="$ss.getters.normalizeCss({ height: isDataReady ? undefined : 271 })"
  >
    <slot></slot>
    <section v-if="hasEarnGame" class="-mx-[3px] relative z-10">
      <div
        v-for="item in earnCashGameList"
        :key="item.id"
        class="bg-cover bg-no-repeat bg-center float-left relative border-2 border-white rounded-xl mb-2 mx-[3px]"
        :style="
          $ss.getters.normalizeCss(
            item.isLeft
              ? { width: 188, height: 158 }
              : {
                  width: 128,
                  height: 75,
                },
            item.icon
          )
        "
        @click="onEarnGameClick(item)"
      >
        <div
          class="absolute w-6 h-6 bg-contain bg-center bg-no-repeat -right-1 top-0 -translate-y-1/2"
          v-webp="require('@/assets/earncash/HOT.png?webp')"
        ></div>
        <div
          class="absolute bottom-0 h-6 bg-black bg-opacity-40 text-white font-robot-bold font-black rounded-b-xl leading-none right-0 left-0 flex items-center justify-center"
          :class="{
            'text-base': item.isLeft,
            'text-xs': !item.isLeft,
          }"
        >
          <div
            class="absolute bg-contain bg-center bg-no-repeat"
            v-if="item.extraIcon"
            :style="item.extraIcon"
          ></div>
          <div class="truncate relative z-10">
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="clear-both"></div>
    </section>
    <section v-if="hasMiniGame" class="-mx-1">
      <div
        v-for="item in MiniGameListWithMore"
        :key="item.gameName || 'more'"
        class="bg-cover bg-no-repeat bg-center float-left mx-1 relative border-2 border-white rounded-xl mb-1.5"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 75,
              height: 75,
            },
            item.gameIcon
          )
        "
        @click="onGameClick(item)"
      >
        <div
          class="absolute bottom-0 h-5 bg-black bg-opacity-40 text-white font-robot-bold font-black text-xs truncate rounded-b-xl leading-none right-0 left-0 flex items-center justify-center"
        >
          {{
            ($i18n.locale === 'id' ? item.titleId : item.title) || item.title
          }}
        </div>
      </div>
      <div class="clear-both"></div>
    </section>
  </div>
</template>

<script lang="ts">
import {
  ROUTENAME_INAPP_V_EARN_CASH,
  ROUTENAME_INAPP_V_MINIGAME,
  ROUTEPATH_V_MINIGAME,
} from '@/constants/localRoutePath';
import ButtonLockController from '@/controller/ButtonLockController';
import { openAppH5LinkPreferLocal } from '@/utils/navigator';
import { Toast } from 'vant';
import Component, { mixins } from 'vue-class-component';
import { close_bridge, navigation } from '@/js_bridge/js_call_app';
import {
  IMiniGameModel,
  MiniGameListMixin,
} from '../MiniGame/MiniGameList.state';
import { APP_ROUTE_TAB_GAME } from '@/constants/APP_SCHEMA_URLS';
import { VEarnCashGameListMixin } from './EarnCashGame.state';
import { openVGame } from '../GameHall/VGameList/openGame';
import { convert2QueryStr } from '@/utils/url';
@Component({
  components: {},
})
export default class EarnCashMiniGame extends mixins(
  MiniGameListMixin,
  VEarnCashGameListMixin
) {
  mounted() {
    this.refreshMiniGameList();
    this.refreshVEarnCashGameList();
  }
  get hasEarnGame() {
    const earnCashGameList = this.earnCashGameList;
    return earnCashGameList && earnCashGameList.length > 0;
  }

  get hasMiniGame() {
    const MiniGameList = this.MiniGameList;
    return MiniGameList && MiniGameList.length > 0;
  }

  get needShowModule() {
    const hasGame = this.hasEarnGame || this.hasMiniGame;
    if (hasGame) {
      return true;
    }
    if (
      this.stateItemVEarnCashGameListRef.status === 'loading' ||
      this.stateItemMiniGameListRef.status === 'loading'
    ) {
      return true;
    }
    return false;
  }

  get isDataReady() {
    return (
      this.stateItemVEarnCashGameListRef.status !== 'loading' &&
      this.stateItemMiniGameListRef.status !== 'loading'
    );
  }
  get earnCashGameList() {
    const iconStyle = [
      this.$ss.getters.normalizeCss(
        { bottom: 6, right: -2, width: 72, height: 60 },
        require('@/assets/earncash/game/money.png?webp'),
        true
      ),

      this.$ss.getters.normalizeCss(
        { bottom: 4, right: -8, width: 48, height: 36 },
        require('@/assets/earncash/game/phone.png?webp'),
        true
      ),

      this.$ss.getters.normalizeCss(
        {
          bottom: 6,
          right: -2,
          width: 48,
          height: 36,
        },
        require('@/assets/earncash/game/moter.png?webp'),
        true
      ),
    ];
    return (this.EarnCashGameList || []).map((item, idx) => {
      return {
        ...item,
        name: idx < 3 ? (this.$t('VEC.game' + (idx + 1)) as string) : item.name,
        // style: idx % 3 === 0 ? STYLE1 : STYLE2,
        isLeft: idx % 3 === 0,
        extraIcon: iconStyle[idx],
      };
    });
  }

  get MiniGameListWithMore() {
    const MiniGameList = this.MiniGameList;
    if (MiniGameList) {
      return [
        ...MiniGameList,
        {
          title: this.$t('VEC.moreGame'),
          gameIcon: require('@/assets/earncash/MoreGame.png'),
        } as Partial<IMiniGameModel>,
      ];
    }
    return [];
  }
  onGameClick(item: Partial<IMiniGameModel>) {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    if (!item.gameName) {
      this.$trace('click_withdrawal_h5game_more', {});
      navigation({ url: APP_ROUTE_TAB_GAME });
      return;
    }
    this.$trace('click_withdrawal_h5game', {
      game_url: item.gameUrl,
      game_name: item.gameName,
    });
    if (item.gameUrl) {
      openAppH5LinkPreferLocal(
        `${ROUTEPATH_V_MINIGAME}?${convert2QueryStr({
          url: item.gameUrl,
          gameName: item.gameName,
          __OPEN_AFTER_CLOSE: APP_ROUTE_TAB_GAME,
        })}`,
        {
          navData: {
            DTPageName: ROUTENAME_INAPP_V_MINIGAME,
            DTArgs: {
              mini_game_name: item.gameName,
              game_url: item.gameUrl,
            },
          },
        }
      );
      setTimeout(() => {
        close_bridge();
      }, 300);
    } else {
      Toast(this.$t('V.pleaseLookForward'));
    }
  }

  async onEarnGameClick(gameItem: API.GameInfoVO) {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    const openSource = ROUTENAME_INAPP_V_EARN_CASH;
    this.$tracev('click_game_play', {
      game_name: gameItem.name,
      openSource,
      game_id: gameItem.id,
    });

    openVGame(
      gameItem.id,
      gameItem.orientation,
      openSource,
      APP_ROUTE_TAB_GAME
    );
    // setTimeout(() => {
    //   close_bridge();
    // }, 5000);
  }
}
</script>
@/constants/APP_SCHEMA_URLS
