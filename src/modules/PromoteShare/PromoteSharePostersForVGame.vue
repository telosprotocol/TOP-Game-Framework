<template>
  <div>
    <div
      class="flex justify-center overflow-hidden"
      style="transform: scale3d(1, 1, 1)"
    >
      <PromoteSharePoster
        ref="poster"
        :invite-url="curShareItem.inviteUrl"
        :image-url="curShareItem.imageUrl"
        class="transition-transform duration-500"
      ></PromoteSharePoster>
    </div>

    <section
      class="flex justify-between mx-6 text-[#444] text-[11px] text-center mb-6"
    >
      <div
        v-for="item in shareMethodList"
        :key="item.name"
        class="active:scale-95"
        @click="onMethodClick(item)"
      >
        <div
          class="bg-contain bg-center bg-no-repeat"
          :style="item.imageStyle"
        ></div>
        <div class="w-20 relative -top-2 px-4">
          {{ $t(item.title) }}
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import SwipeLoop from '@/components/Swipe/SwipeLoop.vue';
import SwipeLoopItem from '@/components/Swipe/SwipeLoopItem.vue';
import PromoteSharePoster from './PromoteSharePoster.vue';
import { VInviteMixin } from '@/modules/VInvite/VInviteMixin';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import {
  INODEJS_SHARE_NUMBER_TYPE,
  NODEJS_SHARE_NUMBER_VGAME_FORVGAME_PKG,
  SHARE_TYPES_VGAME,
} from '@/constants/invite';
import ButtonLockController from '@/controller/ButtonLockController';
import { saveShareImageBridge } from '@/js_bridge/AndroidBridge/index';
import {
  initCanvasUtils,
  saveHtml2CanvasImage,
} from '@/utils/dom/saveHtml2CanvasImage';
import { Toast } from 'vant';
import { share_bridge } from '@/js_bridge/js_call_app_base';
import { SHARE_PLATFORM } from '@/constants/invite';
import {
  showLoading_bridge,
  dismissLoading_bridge,
} from '@/js_bridge/js_call_app_base';
import { replaceInviteCode } from '@/controller/ReferUtils';
import { getFirstString } from '@/utils/string';
import { webpFilter } from '@/directives/webp';

const SHARE_METHOD_LIST = [
  {
    name: 'whatsapp',
    imageUrl: '/online/promoteShare/icon_whatsapp.png?webp',
    title: 'VPS.whatInvite',
    shareOption: {
      showShareDialog: false,
      sharePlatform: SHARE_PLATFORM.WHATSAPP,
      withApk: true,
    },
    eventName: 'click_invite_top',
    eventParam: {
      platform_entry: SHARE_PLATFORM.WHATSAPP + '',
    },
  },
  {
    name: 'facebook',
    imageUrl: '/online/promoteShare/iconFacebook.png?webp',
    title: 'VPS.fbInvite',
    shareOption: {
      showShareDialog: false,
      sharePlatform: SHARE_PLATFORM.FACEBOOK,
      withApk: true,
    },
    eventName: 'click_invite_top',
    eventParam: {
      platform_entry: SHARE_PLATFORM.FACEBOOK + '',
    },
  },
  {
    name: 'more',
    imageUrl: '/online/promoteShare/iconMore.png?webp',
    title: 'VPS.moreInvite',
    shareOption: {
      showShareDialog: true,
      withApk: true,
      platforms: [
        SHARE_PLATFORM.WHATSAPP,
        SHARE_PLATFORM.FACEBOOK,
        SHARE_PLATFORM.MESSAGER,
        SHARE_PLATFORM.TELEGRAM,
        SHARE_PLATFORM.TWITTER,
        SHARE_PLATFORM.INSTAGRAM,
        // SHARE_PLATFORM.SYSTEMSHARE,
      ],
    },
    eventName: 'click_invite_more',
    eventParam: {
      platform_entry: 'more',
    },
  },
];
const CUR_SHARE_NUMBER = NODEJS_SHARE_NUMBER_VGAME_FORVGAME_PKG;
@Component({
  components: { SwipeLoop, SwipeLoopItem, PromoteSharePoster },
})
export default class PromoteSharePostersForVGame extends mixins(
  VInviteMixin,
  BindEventMixinDefault
) {
  $refs: {
    poster: PromoteSharePoster;
  };
  useInited() {
    initCanvasUtils();
    return this.initInviteByTp([CUR_SHARE_NUMBER]);
  }
  get curShareItem() {
    return {
      name: 'CP_VGame',
      imageUrl: this.$ss.getters.translateImage({
        en: webpFilter(require('@/assets/promoteShare/vgame/game-en.png?webp')),
        id: webpFilter(require('@/assets/promoteShare/vgame/game-id.png?webp')),
      }),
      shareNumber: CUR_SHARE_NUMBER as INODEJS_SHARE_NUMBER_TYPE,
      inviteUrl: this._createTpInviteUrl(CUR_SHARE_NUMBER),
    };
  }

  get shareMethodList() {
    return SHARE_METHOD_LIST.map((item) => {
      return {
        ...item,
        imageStyle: this.$ss.getters.convertBgImageStyle(
          item.imageUrl,
          true,
          this.$ss.getters.designPxsObjToReal({
            width: 77,
            height: 77,
          })
        ),
      };
    });
  }

  get commonParam() {
    const curShareItem = this.curShareItem;
    return {
      share_type: 'income_share' as const,
      pkg_name: curShareItem.name,
      share_typefrom: getFirstString(this.$route.query.from) || '',
      share_initialfrom: getFirstString(this.$route.query.initialfrom),
    };
  }

  async onMethodClick(
    item: typeof PromoteSharePostersForVGame.prototype.shareMethodList[0]
  ) {
    if (!ButtonLockController.Instance.tryGetLock('share')) {
      return;
    }
    const curShareItem = this.curShareItem;
    const commonParam = {
      ...this.commonParam,
      ...item.eventParam,
      // is_support: isSupport ? '1' : '0',//2.8.3.0
    };
    this.$trace(item.eventName, commonParam);
    // if (!isSupport) {
    //   //
    //   this.onQuickShareClick({
    //     shareNumber: curShareItem.shareNumber,
    //     traceParams: this.commonParam,
    //   });
    //   return;
    // }
    showLoading_bridge();
    const poster = this.$refs.poster;
    const imageBytes = await saveHtml2CanvasImage(poster.$el as HTMLElement, {
      backgroundColor: 'transparent',
    });
    const resSaveImg = await saveShareImageBridge(
      imageBytes,
      `${SHARE_TYPES_VGAME}_${item.name}.jpg`
    );
    dismissLoading_bridge();
    if (resSaveImg.Result !== 1) {
      console.log('Error', resSaveImg);
      Toast('Error');
      return;
    }
    const inviteCode = this.InviteCode;
    const shareContent = replaceInviteCode(
      this.$t('VPS.rightShareContent') as string,
      inviteCode
    );
    const shareRes = await share_bridge({
      url: resSaveImg.data.picUrl,
      shareType: SHARE_TYPES_VGAME,
      inviteCode: inviteCode,
      shareLink: curShareItem.inviteUrl,
      content: shareContent as string,
      traceParams: JSON.stringify({
        fid: curShareItem.name,
        ...commonParam,
      }),
      ...item.shareOption,
    });
    if (shareRes.Result === 1) {
      this.$trace('click_invite_top_success', commonParam);
    }
  }
}
</script>
