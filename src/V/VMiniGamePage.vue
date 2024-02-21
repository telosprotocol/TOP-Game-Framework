<template>
  <MiniGame></MiniGame>
</template>

<script lang="ts">
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component, { mixins } from 'vue-class-component';
import MiniGame from '../modules/MiniGame/MiniGame.vue';
@Component({
  components: {
    MiniGame,
  },
})
export default class VMiniGamePage extends mixins(StatusBarMixin) {
  statusBarColor = '#000000';
}
</script>
