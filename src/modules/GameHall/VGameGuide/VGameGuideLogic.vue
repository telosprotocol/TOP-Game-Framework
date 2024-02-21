<template>
  <portal to="modal">
    <VGameGuideOpenGame2
      v-model="isGameOpenGuideShow"
      ref="openGameGuide"
      :info="recomendGameInfo"
    ></VGameGuideOpenGame2>
  </portal>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Vue } from 'vue-property-decorator';
import type { IVGameIconInfoItem } from '../VGameList/GameList.state';
import VGameGuideOpenGame2 from './VGameGuideOpenGame2.vue';
import {
  hideBottomBarForGameTab,
  showBottomBarForGameTab,
} from '@/js_bridge/js_call_app_base';
@Component({
  components: { VGameGuideOpenGame2 },
})
export default class VGameGuideLogic extends Vue {
  $refs: {
    openGameGuide: VGameGuideOpenGame2;
  };
  @Prop({
    type: Function,
    required: true,
  })
  getRecomendGameInfo: () => Promise<{
    bounding: DOMRect;
    gameList: IVGameIconInfoItem[];
    // tabIdx: number;
    // listIdx: number;
  }>;

  get isInNewbieGuide() {
    return this.isGameOpenGuideShow;
  }
  async tryOpenNewbieGuideNext() {
    this.isGameOpenGuideShow = false;
    hideBottomBarForGameTab();
    this.$emit('gameGuide');
    const recomendGameInfo = (this.recomendGameInfo =
      await this.getRecomendGameInfo());
    if (recomendGameInfo.gameList && recomendGameInfo.gameList.length > 0) {
      hideBottomBarForGameTab();
      this.isGameOpenGuideShow = true;
      await this.$refs.openGameGuide.waitDlgClose();
      this.$emit('gameGuideClosed');
      showBottomBarForGameTab();
    } else {
      this.$tracev('gameguide_norecommend');
      showBottomBarForGameTab();
    }
  }
  //#region Step2
  isGameOpenGuideShow = false;
  recomendGameInfo: {
    bounding: DOMRect;
  } = null;
  //#endregion

  closeAll() {
    //
  }
}
</script>
