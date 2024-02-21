<template>
  <div>NotFound</div>
</template>

<script lang="ts">
import { close_bridge } from '@/js_bridge/js_call_app_base';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DialogNotFound extends Vue {
  created() {
    close_bridge();
  }
}
</script>

<style scoped></style>
