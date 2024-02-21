<template>
  <div
    class="rounded-[20px] bg-white border border-solid border-[#F1E1FF] bg-gradient-to-b from-[#F6EFFC] to-white px-3 py-4"
  >
    <section
      ref="article"
      v-for="(item, idx) in list"
      :key="idx"
      :class="{
        'border-b border-solid border-[rgba(229,167,255,0.3)] mb-3':
          !item.isLast,
      }"
    >
      <h3 class="text-[#9E6FFB] robot-bold text-[14px] mb-2.5">
        {{ idx + 1 + '.' }} {{ item.title }}
      </h3>
      <div v-for="(pItem, pidx) in item.list" :key="pidx">
        <div v-if="pItem.type === 'text'" class="mb-2.5">{{ pItem.text }}</div>
        <div
          v-else-if="pItem.type === 'img'"
          :style="pItem.img"
          class="bg-center bg-contain bg-no-repeat mx-auto mb-2.5"
        ></div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { traceElementExpose } from '@/utils/trace';
@Component({
  components: {},
})
export default class VPromoteIncomeArticleBlock extends mixins(
  BindEventMixinDefault
) {
  $refs!: {
    article: HTMLDivElement[];
  };
  useInited() {
    let offList: (() => void)[] = [];
    for (let i = 0; i < this.$refs.article.length; i++) {
      const el = this.$refs.article[i];
      const offCb = traceElementExpose(
        el,
        'dropdown_directpush_income_exposure',
        { content_type: `article_p_${i + 1}` }
      );
      offList.push(offCb);
    }
    return () => {
      offList.forEach((item) => {
        item();
      });
    };
  }

  get list() {
    return [
      {
        isLast: false,
        title: this.$t('VPIN.s1Title'),
        list: [
          {
            type: 'text',
            text: this.$t('VPIN.s1p1'),
          },
          {
            type: 'img',
            img: this.$ss.getters.convertBgImageStyle(
              '/online/playIncomeN/RLTree.png?webp',
              true,
              this.$ss.getters.designPxsObjToReal({
                width: 259,
                height: 198,
              })
            ),
          },
          {
            type: 'text',
            text: this.$t('VPIN.s1p2'),
          },
          {
            type: 'img',
            img: this.$ss.getters.convertBgImageStyle(
              '/online/playIncomeN/rlLevels.png?webp',
              true,
              this.$ss.getters.designPxsObjToReal({
                width: 266,
                height: 66,
              })
            ),
          },
        ],
      },
      {
        isLast: false,
        title: this.$t('VPIN.s2Title'),
        list: [
          {
            type: 'text',
            text: this.$t('VPIN.s2p1'),
          },
          {
            type: 'img',
            img: this.$ss.getters.convertBgImageStyle(
              '/online/playIncomeN/RTLTree.png?webp',
              true,
              this.$ss.getters.designPxsObjToReal({
                width: 283,
                height: 318,
              })
            ),
          },
          {
            type: 'text',
            text: this.$t('VPIN.s2p2'),
          },
          {
            type: 'img',
            img: this.$ss.getters.convertBgImageStyle(
              '/online/playIncomeN/rtlLevels.png?webp',
              true,
              this.$ss.getters.designPxsObjToReal({
                width: 266,
                height: 66,
              })
            ),
          },
        ],
      },
      {
        title: this.$t('VPIN.s3Title'),
        isLast: true,
        list: [
          {
            type: 'text',
            text: this.$t('VPIN.s3p1'),
          },
          {
            type: 'img',
            img: this.$ss.getters.convertBgImageStyle(
              '/online/playIncomeN/CashBackEqual.png?webp&v=1',
              true,
              this.$ss.getters.designPxsObjToReal({
                width: 309,
                height: 88,
              })
            ),
          },
        ],
      },
    ];
  }
}
</script>
