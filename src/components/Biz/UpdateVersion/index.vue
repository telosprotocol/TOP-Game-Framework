<template>
  <div class="updatev">
    <div class="updatev-imgwrap" v-webp="updateIcon"></div>
    <div class="updatev-desc">
      {{ $t('Base.NotSupport') }}
    </div>
    <div class="btn-wrap">
      <div class="tz-btn-pblock" @click="checkVersion" v-trace:h5_check_version>
        {{ $t('checkVersion') }}
      </div>
    </div>

    <div class="updatev-link">
      <span>{{ url }}</span>
      <button
        class="btn-copy"
        ref="refBtnCopy"
        :data-clipboard-text="url"
        v-trace:h5_check_version_link_copy
      >
        {{ $t('Base.CopyLink') }}
      </button>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "checkVersion": "Check Version"
  },
  "id": {
    "checkVersion": "Periksa Versi"
  }
}
</i18n>
<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import { checkVersion_bridge } from '@/js_bridge/js_call_app_base';
import { OFFICIAL_SITE_UPDATEVERSION } from '@/utils/navigator/index';
import Clipboard from 'clipboard';
import { Toast } from 'vant';
import { Watch, Vue, Component } from 'vue-property-decorator';
@Component({})
export default class UpdateVersion extends Vue {
  mounted() {
    const clb = new Clipboard(this.$refs.refBtnCopy as Element);
    clb.on('success', (e) => {
      e.clearSelection();
      Toast(this.$t('Base.CopySucceeded') as string);
    });
    clb.on('error', function () {});
  }

  @Watch('$ss.state.bridge.webviewResumeFlagThrottled')
  onWebviewResume() {
    if (ButtonLockController.Instance.tryGetLock('checkVersion', 2)) {
      checkVersion_bridge();
    }
  }

  checkVersion() {
    if (ButtonLockController.Instance.tryGetLock('checkVersion', 2)) {
      checkVersion_bridge();
    }
  }

  updateIcon = require('./img/update2.png?webp');

  url = OFFICIAL_SITE_UPDATEVERSION;
}
</script>
<style lang="less" scoped>
.updatev {
  margin-top: 80px;
  &-imgwrap {
    position: relative;
    width: 160px;
    height: 120px;
    margin: 40px auto 8px auto;
    background-repeat: no-repeat;
    background-size: 100% auto;
  }
  &-link {
    margin: 10px 0 5px 0;
    padding: 10px 0 5px 0;
    text-align: center;
    -webkit-user-select: auto;
    user-select: auto;
    -webkit-touch-callout: auto;
  }
  &-desc {
    width: 288px;
    margin: auto;
    margin-bottom: 32px;
    color: #999;
    font-size: 14px;
    text-align: center;
  }
}
.btn-copy {
  color: #74b0fd;
}
.btn-wrap {
  margin: 0 16px;
}
// .btn-update {
//   line-height: 44px;
//   display: block;
//   height: 44px;
//   border-radius: 44px;
//   width: 100%;
// }
</style>
