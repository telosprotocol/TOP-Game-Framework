<template>
  <div class="absolute left-0 top-0 w-32 h-8 z-30" @click="showVersion">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { hideDelayLoading, showDelayLoading } from '@/utils/loadingTool';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class VersionButton extends Vue {
  @Prop({
    type: String,
    default: 'light',
  })
  skin: 'dark' | 'light';

  //#region DebugTool
  /**
   *
   */
  versionClickCnt = 0;
  lastVersionCodeTimer: ReturnType<typeof setTimeout> = null;

  showVersion() {
    this.versionClickCnt++;
    const versionEl = document.getElementById('version');
    const showCount = process.env.VUE_APP_ENV_SERVER !== 'production' ? 1 : 10;
    if (versionEl.style.display === 'block') {
      if (process.env.VUE_APP_ENV_SERVER !== 'production') {
        //
        showDelayLoading(false);
        import('@/components/Biz/DebugTool/index').then((debugTool) => {
          hideDelayLoading();
          debugTool.showDebugTool();
        });
      }
    }
    if (this.versionClickCnt >= showCount) {
      this.versionClickCnt = 0;
      versionEl.style.display = 'block';
      versionEl.style.color = this.skin === 'dark' ? 'white' : 'black';
      const GC = window.GC;
      let hv = this.$route.query.hv || '';
      if (hv) {
        hv = '-' + hv;
      }
      versionEl.innerHTML = `${GC.h5Version}-${GC.buildNum}-${GC.appName}${hv}`;
    }
    if (this.lastVersionCodeTimer) {
      clearTimeout(this.lastVersionCodeTimer);
    }
    this.lastVersionCodeTimer = setTimeout(() => {
      this.lastVersionCodeTimer = null;
      this.versionClickCnt = 0;
    }, 5000);
  }
  //#endregion
}
</script>
