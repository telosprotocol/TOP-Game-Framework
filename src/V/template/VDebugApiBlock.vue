<template>
  <Collapse accordion v-model="activeName">
    <CollapseItem
      :title="item.title || item.name"
      v-for="(item, idx) in apiListC"
      :name="idx"
      class="p-4 mb-4"
      :key="item.name || item.title"
    >
      <div class="flex items-center">
        <div class="robot-bold flex-1">{{ item.title || item.name }}</div>
        {{ item.curInfo.status }}
        <button
          class="tz-btn tz-btn-primary m-1"
          @click="onRefresh(item)"
        ></button>
      </div>
      <div v-if="item.curInfo.lastError">
        <b> :</b>
        <code class="whitespace-pre-wrap break-words">{{
          item.curInfo.lastError
        }}</code>
      </div>
      <div>
        <b> json:</b>
        <code class="whitespace-pre-wrap break-words">
          {{ JSON.stringify(item.stateItem.ref.current) }}
        </code>
      </div>
    </CollapseItem>
  </Collapse>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Collapse, CollapseItem } from 'vant';
import type AsyncStateItem from '@/controller/AsyncStateItem';
import { Toast } from 'vant';
export type IDebugApiConfigItem = {
  name?: string;
  title?: string;
  stateItem: AsyncStateItem<any, any, any>;
};
@Component({
  components: { Collapse, CollapseItem },
})
export default class VDebugApiBlock extends Vue {
  @Prop({
    type: Array,
  })
  apiList: IDebugApiConfigItem[];
  activeName = 0;
  get apiListC() {
    return (this.apiList || []).map((item, idx) => {
      return {
        idx,
        ...item,
        current: item.stateItem.ref.current,
        status: item.stateItem.ref.status,

        curInfo: this.apiListData[idx] || { status: 'ToLoad', lastError: '' },
      };
    });
  }

  apiListData: { status: string; lastError: string }[] = [];

  onRefresh(item: typeof VDebugApiBlock.prototype.apiListC[0]) {
    if (!this.apiListData[item.idx]) {
      this.$set(this.apiListData, item.idx, {
        status: 'ToLoad',
        lastError: '',
      });
    }
    const curData = this.apiListData[item.idx];
    Toast('    ');
    curData.status = 'loading';
    item.stateItem.tryUpdate(0).then((res) => {
      if (res.ok) {
        curData.status = 'success';
        curData.lastError = '';
      } else {
        curData.status = 'error';
        curData.lastError = JSON.stringify(res.error);
      }
    });
  }
}
</script>
