<template>
  <div>
    <HeaderTop left-icon="icon-back"> </HeaderTop>
    <div class="needlogin">
      <div class="img" v-webp="imgUrl"></div>
      <div class="tip">
        {{ $t('Base.notLoginedTip') }}
      </div>
      <div class="tz-btn-pblock" @click="doLogin">
        {{ $t('Base.loginToView') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { getFirstString } from '@/utils/string';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { navigation_login_bridge } from '../js_bridge/js_call_app_base';

const TAG = '[RequireLogin]';
@Component({ components: { HeaderTop } })
export default class RequireLogin extends mixins(BindEventMixinDefault) {
  useInited() {
    return () => {};
  }
  @Watch('$ss.state.user.isLogined', { immediate: true })
  onIsLoginChanged() {
    if (this.$ss.state.user.isLogined) {
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log(
          TAG,
          'detected user has Logined ,start to go to ',
          this.fromPath
        );
      }
      this.goToFromPath();
    }
  }

  get imgUrl() {
    const url = require('@/assets/illustration/notlogined.png?webp');
    return url;
  }
  get fromPath() {
    return getFirstString(this.$route.query.from);
  }

  /**
   *
   */
  goToFromPath() {
    if (!this.fromPath) {
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log(
          TAG,
          'the from query is not defined!!!',
          this.$route.query.from
        );
      }
      if (process.env.VUE_APP_ENV_SIM) {
        return;
      }
      this.$router.back();
    } else {
      this.$router.replace({ path: this.fromPath });
    }
  }

  private isNavLoging = false;
  private _lastTimer: ReturnType<typeof setTimeout>;
  /**
   *
   */
  async doLogin() {
    if (this.isNavLoging) {
      return;
    }
    this.isNavLoging = true;
    if (this._lastTimer) {
      clearTimeout(this._lastTimer);
    }
    this._lastTimer = setTimeout(() => {
      this.isNavLoging = false;
    }, 3000);
    // from
    await navigation_login_bridge(this.fromPath as any);
    this.isNavLoging = true;
  }
}
</script>

<style type="less" scoped>
.needlogin {
  position: relative;
  padding: 12px 25px;
  color: #999;
  font-size: 1;
  line-height: 1.333;
  text-align: center;
}
.img {
  top: 0;
  width: 160px;
  height: 120px;
  margin: auto;
  margin-top: 48px;
  background-size: 100% auto;
}
.tip {
  margin: 45px auto;
}
</style>
