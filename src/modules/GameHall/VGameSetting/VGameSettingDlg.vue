<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-if="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <!-- DlgContent Include bg -->
        <div
          class="relative w-80 rounded-xl bg-gradient-to-b from-[#AA76F1] to-[#8153DD] text-[#9D5C37] pt-12 pb-4"
        >
          <!-- Title   -->
          <div
            class="absolute left-0 right-0 bg-contain bg-center bg-no-repeat"
            :style="bgTitleStyle"
          ></div>
          <!-- CloseButton -->
          <button
            @click="onCloseClicked"
            class="absolute right-0 -top-3 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
            v-webp="require('@/assets/vcommon/close/btnPurpleClose.png?webp')"
          ></button>
          <main class="bg-[#FFF4DA] rounded-xl mx-2 p-4 mt-0.5">
            <div class="flex justify-between items-center">
              <!-- Thumbnail -->
              <div
                class="border-[3px] shrink-0 border-solid border-[#A773EF] bg-center bg-cover bg-no-repeat rounded-md mr-4"
                :style="bgThumbnailStyle"
              ></div>
              <div class="flex-1 text-sm overflow-hidden">
                <h3 class="robot-bold mb-1">
                  {{ $t('VG.gameName') }}
                </h3>
                <div class="mb-1.5 pr-5 relative">
                  <div
                    class="bg-white rounded-md h-8 pl-2 pr-5 py-1.5 text-[#333] robot-bold tz-ellipsis-break-1 whitespace-nowrap"
                  >
                    {{ info.userId }}
                  </div>
                  <button
                    v-webp="require('@/assets/gameHall/setting/edit.png?webp')"
                    class="-top-[1px] -bottom-[1px] absolute right-0 bg-center bg-contain bg-no-repeat w-10 px-[1px] active:scale-95"
                  ></button>
                </div>
                <div class="text-xs">Google account Logined</div>
              </div>
            </div>

            <div
              v-for="item in switchList"
              :key="item.name"
              class="flex items-center justify-between py-2"
            >
              <div class="robot-medium text-sm">{{ item.title }}</div>
              <VSwitchButton v-model="info[item.name]"></VSwitchButton>
            </div>
            <div
              class="flex justify-between items-center text-xs text-[#6E45C2] mt-2 mb-2 underline"
            >
              <div>{{ $t('VG.gameUserAgreement') }}</div>
              <div>{{ $t('VG.privacyProtectionGuide') }}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { convertBgImageStyle } from '@/utils/styles';
import VSwitchButton from './VSwitchButton.vue';
@Component({
  components: { VSwitchButton },
})
export default class VGameSettingDlg extends mixins(PopupMixin) {
  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
    }
  }

  onCloseClicked() {
    this.emitDlgVisible(false);
  }
  //#endregion

  get bgTitleStyle() {
    return convertBgImageStyle(
      require('@/assets/gameHall/setting/settingHeadBg.png?webp'),
      true,
      this.$ss.getters.designPxsObjToReal({
        // width: 313,
        height: 99,
        top: -46,
      })
    );
  }

  get bgThumbnailStyle() {
    return convertBgImageStyle(
      this.info.thumbnail,
      false,
      this.$ss.getters.designPxsObjToReal({
        width: 72,
        height: 72,
      })
    );
  }

  info = {
    userId: '324234234234',
    thumbnail:
      'https://androidmaster-dn1.s3-us-west-1.amazonaws.com/icon/bannerconfig/549c5f8c5b6e5633f94fed300269c209.jpg',
    music: false,
    effect: true,
    vibration: true,
    display: true,
  };

  get switchList() {
    return [
      {
        title: this.$t('VG.music'),
        name: 'music',
      },
      {
        title: this.$t('VG.soundEffect'),
        name: 'effect',
      },
      {
        title: this.$t('VG.vibration'),
        name: 'vibration',
      },
      {
        title: this.$t('VG.gamePerformanceDisplay'),
        name: 'display',
      },
    ];
  }
}
</script>
