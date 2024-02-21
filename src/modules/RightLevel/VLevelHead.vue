<template>
  <header class="px-6 text-white pb-3 bg-cover bg-center bg-no-repeat">
    <div class="mb-2">
      <div class="flex justify-between items-center">
        <div class="inline-flex justify-between items-center">
          <div
            class="w-20 h-20 bg-contain bg-center bg-no-repeat"
            :style="levelConfig.iconStyle"
          ></div>
          <div class="-mt-4">
            <div class="text-xl font-rubik font-extrabold">
              {{ levelConfig.title }}
            </div>
            <div class="text-xs">{{ $t('VML.MyLevel') }}</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { VUserAccountMixin } from '@/modules/VAssetInfo/VUserAccount.state';
import { getVGameLevelConfigByGameLevel } from '@/modules/VAssetInfo/VLevels.config';
@Component({
  components: {},
})
export default class VLevelHead extends mixins(VUserAccountMixin) {
  get level() {
    const UserAccount = this.UserAccount;
    return UserAccount?.gameLevel ?? 0;
  }

  get levelConfig() {
    return getVGameLevelConfigByGameLevel(this.level);
  }
}
</script>
