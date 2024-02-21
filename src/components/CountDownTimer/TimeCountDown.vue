<template>
  <div>{{ leftCountDownTxt }}</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import TimeCountDownMixin from './TimeCountDownMixin';
/**
 *    ，hour:minute  or   hour:minute:second
 */
@Component({
  components: {},
})
export default class TimeCountDown extends mixins(TimeCountDownMixin) {}
</script>
