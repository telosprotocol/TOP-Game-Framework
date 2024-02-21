<template>
  <div
    v-if="status === 'ok'"
    @click="onRefreshCaptcha"
    class="bg-contain bg-center bg-no-repeat"
    :style="styleCaptcha"
  ></div>
  <div
    v-else
    :style="styleSize"
    class="bg-[#E4E4E4] rounded-sm flex items-center justify-center text-[#3D79F2] text-xs active:scale-95"
    @click="onRefreshCaptcha"
  >
    <ib class="iconfont icon-loading" v-if="status === 'loading'"></ib>
    <template v-if="status !== 'loading'">{{ $t('Base.Refresh') }}</template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { uniqueId } from 'lodash-es';
import { Toast } from 'vant';
import { getCaptchaUserController } from '@/vservices/client/UserController';
@Component({
  components: {},
})
export default class VCaptchaBlock extends Vue {
  get styleSize() {
    return this.$ss.getters.designPxsObjToReal({
      width: 78,
      height: 27,
    });
  }

  get styleCaptcha() {
    return {
      ...this.styleSize,
      backgroundImage: `url(${this.captchaBase64})`,
    };
  }
  captchaBase64 = '';

  status: 'loading' | 'error' | '' | 'ok' = '';

  initCaptcha() {
    this.captchaBase64 = '';
    this.status = '';
    this.onRefreshCaptcha('init');
  }

  /**
   *        
   */
  curCaptchaId: string;

  onRefreshCaptcha(_from?: 'init' | 'refresh') {
    if (this.status === 'loading') {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('captcha', 1)) {
      return;
    }
    this.status = 'loading';
    this.curCaptchaId = uniqueId();
    getCaptchaUserController().then((res) => {
      if (res.success) {
        this.$emit('refresh');
        this.status = 'ok';
        this.captchaBase64 = res.data;
      } else {
        Toast(res.message);
        this.status = 'error';
      }
    });
  }
}
</script>
