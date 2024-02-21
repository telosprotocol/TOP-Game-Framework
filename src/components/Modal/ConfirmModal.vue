<template>
  <MaskModal :value="value" v-bind="$attrs" @input="onVisibleChange">
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #toolbar>
      <slot name="toolbar">
        <div class="tz-modal_toolbar">
          <button
            v-if="hasNoButton"
            class="tz-btn btn-no robot-medium"
            @click="onNoClicked"
          >
            {{ noText || $t(noTextLang) }}
          </button>
          <button class="tz-btn btn-yes robot-medium" @click="onYesClicked">
            {{ yesText || $t(yesTextLang) }}
          </button>
        </div>
      </slot>
    </template>
  </MaskModal>
</template>
<!--

    <ConfirmModal
      v-model="isConfirmDialogOpen"
      @yes="onYesClicked"
      @no="onNoClicked"
    >
      <template #title>sfd</template>
    </ConfirmModal>
    -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MaskModal from './MaskModal.vue';
@Component<ConfirmModal>({
  components: {
    MaskModal,
  },
})
export default class ConfirmModal extends Vue {
  @Prop({
    type: Boolean,
    required: true,
  })
  value!: boolean;

  @Prop({
    type: String,
    default: null,
  })
  yesText: string;
  @Prop({
    type: String,
    default: null,
  })
  noText: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  hasNoButton: boolean;
  @Prop({
    type: String,
    default: 'Base.YES',
  })
  yesTextLang!: string;

  @Prop({
    type: String,
    default: 'Base.NO',
  })
  noTextLang!: string;

  /**
   *   Confirm       ，    true,
   */
  @Prop({
    type: Function,
    default: null,
  })
  onFinish?: () => Promise<boolean>;

  onVisibleChange(value: boolean) {
    this.$emit('input', value);
  }

  async onYesClicked() {
    this.$emit('yes');
    if (this.onFinish) {
      const res = await this.onFinish();
      if (res !== true) {
        return;
      }
    }
    //
    this.$emit('input', false);
    //   Yes
    this.$emit('finished', true);
  }
  onNoClicked() {
    this.$emit('no');
    //   No
    this.$emit('input', false);
    this.$emit('finished', false);
  }
}
</script>

<style scoped>
.btn-no,
.btn-yes {
  min-width: 66px;
  height: 44px;
}
.btn-no {
  margin-right: 8px;
  color: #999;
}
.btn-yes {
  color: #f7bf0a;
}
</style>
