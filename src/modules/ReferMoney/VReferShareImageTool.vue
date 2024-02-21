<template>
  <div style="position: absolute; left: -3000px; top: -3000px; z-index: -100">
    <div
      ref="poster"
      class="left bg-contain bg-center bg-no-repeat relative"
      :style="
        $ss.getters.normalizeCss(
          { width: 336 * imgRatio, height: 336 * imgRatio },
          bgImg
        )
      "
    >
      <div
        class="absolute bg-white"
        :style="
          $ss.getters.normalizeCss({
            top: 244 * imgRatio,
            left: 139 * imgRatio,
            width: 58 * imgRatio,
            height: 58 * imgRatio,
            padding: 2 * imgRatio,
          })
        "
      >
        <canvas ref="qrCodeCanvas" class="scale-[20%] origin-top-left"></canvas>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SHARE_TYPES_VGAME } from '@/constants/invite';
import { webpFilter } from '@/directives/webp';
import { saveShareImageBridge } from '@/js_bridge/AndroidBridge';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { initQrCode } from '@/utils/dom/initQrCode';
import {
  initCanvasUtils,
  saveHtml2CanvasImage,
} from '@/utils/dom/saveHtml2CanvasImage';
import Component, { mixins } from 'vue-class-component';
import { noop } from 'lodash-es';

const qrCodeScale = 5;
@Component({
  components: {},
})
export default class VReferShareImageTool extends mixins(
  BindEventMixinDefault
) {
  useInited() {
    initCanvasUtils();
    return noop;
  }
  $refs: {
    poster: HTMLElement;
    qrCodeCanvas: HTMLCanvasElement;
  };

  get bgImg() {
    return webpFilter(
      this.$ss.getters.translateImage({
        en: require('@/assets/referMoney/vgame/share-en.png?webp'),
        id: require('@/assets/referMoney/vgame/share-id.png?webp'),
      })
    );
  }

  get imgRatio() {
    return 2;
  }

  async trySaveImage(url: string) {
    await initQrCode(
      this.$refs.qrCodeCanvas,
      this.$ss.getters.designSizeZoom * 54 * this.imgRatio * qrCodeScale,
      url
    );
    const imageBytes = await saveHtml2CanvasImage(this.$refs.poster, {
      backgroundColor: 'transparent',
    });
    const resSaveImg = await saveShareImageBridge(
      imageBytes,
      `${SHARE_TYPES_VGAME}_OnlineEarn.jpg`
    );
    return resSaveImg;
  }
}
</script>
