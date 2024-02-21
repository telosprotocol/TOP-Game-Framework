<template>
  <div>
    <div>
      <BenefitEntryLogic ref="BENEFIT"></BenefitEntryLogic>
    </div>
    <button @click="open">sdfsdf</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import BenefitEntryLogic from './BenefitEntryLogic.vue';
@Component({
  components: { BenefitEntryLogic },
})
export default class BenefitTest extends Vue {
  $refs: {
    BENEFIT: BenefitEntryLogic;
  };

  open() {
    this.$refs.BENEFIT.onButtonClick('123')
  }
}
</script>
