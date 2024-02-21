<template>
  <div class="w-full h-full p-0 m-0 relative">
    <iframe
      class="w-full h-full p-0 m-0"
      ref="game"
      frameborder="0"
      allowfullscreen
      webkitallowfullscreen
      mozallowfullscreen
    ></iframe>
  </div>
</template>

<script lang="ts">
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { tryMergeLocalesForVPrjPPGame } from '@/locales/Page/VPrj/VP/init';
import Component from 'vue-class-component';
import { Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class PPGame extends Vue {
  $refs: {
    game: HTMLIFrameElement;
  };

  get queryObj() {
    const searchPairList = location.search.substr(1).split('&');
    const searchObj: Partial<{
      gameId: string;
      url: string;
    }> = {};
    for (let i = 0; i < searchPairList.length; i++) {
      const [searchKey, searchValue] = searchPairList[i].split('=');
      if (!searchKey || !searchValue) {
        continue;
      }
      (searchObj as any)[searchKey] = decodeURIComponent(searchValue);
    }
    return searchObj;
  }
  mounted() {
    tryMergeLocalesForVPrjCommon();
    tryMergeLocalesForVPrjPPGame();

    this.$refs.game.src = this.queryObj.url || '';
    window.addEventListener(
      'message',
      (event) => {
        const data = event.data;
        if (data) {
          if (window.Android) {
            window.Android.gameEvent(JSON.stringify(data));
          }
          if (process.env.VUE_APP_ENV_SERVER === 'development' && data.name) {
            console.log('[DEBUG] GameEvent', data.name, data);
          }
        }
      },
      false
    );
    window.GAME_CTL = {
      Destroy: () => {
        if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log('[GAME_CTL] Destroy');
        }
        const targetWindow = this.$refs.game.contentWindow;
        if (targetWindow) {
          targetWindow.postMessage('requestPause', '*');
        }
      },
      UpdateCoin: () => {
        if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log('[GAME_CTL] UpdateCoin');
        }
        const targetWindow = this.$refs.game.contentWindow;
        if (targetWindow) {
          targetWindow.postMessage('updateBalance', '*');
          targetWindow.postMessage({ type: 'RefreshBalance' }, '*');
        }
      },
    };
  }
}
</script>
