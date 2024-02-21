<template>
  <div class="px-1 pt-2 pb-3">
    <div
      class="relative bg-contain bg-center bg-no-repeat shadow-md shadow-[#A57AFF]"
      :style="
        $ss.getters.convertBgImageStyle(
          imageUrl,
          false,
          $ss.getters.designPxsObjToReal({
            width: 255,
            height: 360,
          })
        )
      "
    >
      <div
        id="qrcode"
        class="rounded-md p-1.5 box-content bg-white absolute right-3 bottom-3"
        :style="wrapStyle"
        ref="qrcodeWrap"
      >
        <div
          v-for="item in arrowList"
          :key="item.name"
          :class="item.className"
          class="w-5 h-5 bg-center bg-contain bg-no-repeat absolute"
          :style="item.style"
        ></div>
        <canvas ref="qrCodeCanvas" class="scale-[20%] origin-top-left"></canvas>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { initQrCode } from '@/utils/dom/initQrCode';

const QRCODE_SIZE = 57;
@Component({
  components: {},
})
export default class PromoteSharePoster extends Vue {
  $refs: {
    qrcodeWrap: HTMLElement;
    qrCodeCanvas: HTMLCanvasElement;
  };
  @Prop({
    type: String,
    required: true,
  })
  imageUrl: string;

  @Prop({
    type: String,
    required: false,
  })
  inviteUrl: string;
  get arrowList() {
    const arrowImgStyle = this.$ss.getters.convertBgImageStyle(
      '/online/promoteShare/lt_arrow.png',
      false
    );
    return [
      {
        className: '-left-2.5 -top-2',
        style: this.$ss.getters.designPxsObjToReal({
          left: -10,
          top: -8,
        }),
        name: 'tl',
      },
      {
        className: ' rotate-90',
        style: this.$ss.getters.designPxsObjToReal({
          right: -8,
          top: -10,
        }),
        name: 'tr',
      },
      {
        className: 'rotate-180',
        name: 'br',
        style: this.$ss.getters.designPxsObjToReal({
          right: -10,
          bottom: -8,
        }),
      },
      {
        className: 'rotate-[270deg]',
        name: 'bl',
        style: this.$ss.getters.designPxsObjToReal({
          left: -8,
          bottom: -10,
        }),
      },
    ].map((item) => {
      return {
        ...item,
        style: {
          ...item.style,
          ...arrowImgStyle,
        },
      };
    });
  }

  get wrapStyle() {
    return this.$ss.getters.designPxsObjToReal({
      width: QRCODE_SIZE,
      height: QRCODE_SIZE,
    });
  }

  @Watch('inviteUrl', { immediate: true })
  initQrCode(inviteUrl: string) {
    if (inviteUrl) {
      this.$nextTick(async () => {
        await initQrCode(
          this.$refs.qrCodeCanvas,
          this.$ss.getters.designSizeZoom * QRCODE_SIZE * 5,
          inviteUrl
        );
      });
    }
  }
}
</script>
