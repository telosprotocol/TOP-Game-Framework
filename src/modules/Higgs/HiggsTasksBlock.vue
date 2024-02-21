<template>
  <div>
    <div
      v-if="noTask"
      class="bg-contain bg-center bg-no-repeat mx-auto"
      :style="
        $ss.getters.convertBgImageStyle(
          $ss.getters.translateImage({
            en: '/online/higgs/noTaskBlock-en.png?webp',
            id: '/online/higgs/noTaskBlock-id.png?webp',
          }),
          true,
          $ss.getters.designPxsObjToReal({
            width: 312,
            height: 103,
          })
        )
      "
    ></div>
    <div v-else>
      <HiggsTask
        class="mb-2"
        v-for="item in taskList"
        :key="item.taskId"
        :is-disabled="isDisabled"
        :task-info="item"
      ></HiggsTask>
      <div class="text-xs text-white">
        {{ $t('V_HG.taskTip') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { VHiggsDetailMixin } from './higgs-detail.state';
import HiggsTask from './HiggsTask.vue';
@Component({
  components: { HiggsTask },
})
export default class HiggsTasksBlock extends mixins(VHiggsDetailMixin) {
  get taskList() {
    return this.VHiggsDetail?.tasks || [];
  }

  @Prop({
    type: Boolean,
  })
  isDisabled: boolean;
  get noTask() {
    const VHiggsDetail = this.VHiggsDetail;
    if (!VHiggsDetail) {
      return false;
    }
    const tasks = VHiggsDetail?.tasks;
    return !(tasks && tasks.length > 0);
  }
}
</script>
