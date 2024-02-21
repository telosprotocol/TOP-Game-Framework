<template>
  <div
    @click="$emit('click', item)"
    class="bg-center bg-cover bg-no-repeat mb-2 mx-auto rounded-lg relative"
    :style="
      $ss.getters.normalizeCss(
        {
          width: 270,
          height: 77,
        },
        item.image
      )
    "
  >
    <div
      class="w-3 h-3 border border-solid border-white bg-gradient-to-b from-[#FFAEAE] via-[#F41D1D] to-[#DC0000] rounded-full -right-1 absolute -top-1"
      v-if="item.hasRedDot"
    ></div>
    <div
      class="absolute left-0 right-0 bottom-0 h-7 rounded-b-lg flex items-center pl-2 text-base font-rubik italic font-bold z-0"
      :style="{
        background:
          'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.25) 100%)',
      }"
    >
      <div
        class="vgradient-text-outline vstroke"
        :style="
          $ss.getters.designPxsObjToReal({
            '--v-color-from': '#FFFFD0',
            '--v-color-to': '#F5BE36',
            '--v-shadow-from': '#DA6813',
            '--v-shadow-to': '#DA6813',
            '--v-shadow-y': 2,
            '--v-shadow-x': '0',
            '--tw-stroke-width': 0.5,
            '--tw-stroke-color': '#922F1C',
          })
        "
        :data-text="item.description"
      >
        {{ item.description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class VWelfareItemUI extends Vue {
  @Prop({
    type: Object,
  })
  item: Pick<
    API.ActivitiesManagementVO,
    'name' | 'image' | 'hasRedDot' | 'description'
  >;
}
</script>
