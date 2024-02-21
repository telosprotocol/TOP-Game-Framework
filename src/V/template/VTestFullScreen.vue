<template>
  <div>
    <div class="w-screen h-screen p-4 bg-white">
      <div>
        <button class="tz-btn tz-btn-primary" @click="onClose">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { closeWebviewDialog } from '@/js_bridge/js_call_app';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { noop } from 'lodash-es';

import Component, { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
// import { tryMergeLocalesForVPrjGameTaskPage } from '@/locales/Page/VPrj/VGT/init';
tryMergeLocalesForVPrjCommon();
// tryMergeLocalesForVPrjGameTaskPage();
@Component({
  components: {},
})
export default class VTestFullScreen extends mixins(BindEventMixinDefault) {
  useInited() {
    return noop;
  }
  onClose() {
    closeWebviewDialog(null);
  }
}
</script>
