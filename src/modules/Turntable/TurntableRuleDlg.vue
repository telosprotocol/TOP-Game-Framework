<template>
  <GameDlgUI
    :img-title="
      $ss.getters.translateImage({
        en: require('@/assets/gameCommon/dlgTitle/rule.png'),
        id: require('@/assets/gameCommon/dlgTitle/rule-id.png'),
      })
    "
    :value="value"
    @input="emitDlgVisible"
  >
    <section
      class="text-sm py-4 px-2.5 overflow-auto font-robot-medium font-medium"
    >
      <div class="mb-3" v-for="item in ruleList" :key="item">
        {{ $t(item, { x: fee || '-' }) }}
      </div>
    </section>
  </GameDlgUI>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import GameDlgUI from '../UI/GameDlgUI.vue';
@Component({
  components: { GameDlgUI },
})
export default class TurntableRuleDlg extends mixins(PopupMixin) {
  @Prop({
    type: String,
    required: true,
  })
  type: API.LuckyWheelVO['luckyWheelType'];

  dlgSound = true;
  @Prop({
    type: String,
    required: false,
  })
  fee: string;

  get ruleList() {
    if (this.type === 'GOLD') {
      return ['V_T.goldRule[0]', 'V_T.goldRule[1]']; //, 'V_T.goldRule[2]'
    }
    return ['V_T.dRule[0]', 'V_T.dRule[1]'];
  }
}
</script>
