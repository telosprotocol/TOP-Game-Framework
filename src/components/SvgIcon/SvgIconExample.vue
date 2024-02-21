<script>
// import { Tooltip } from 'element-ui'
import SvgIcon, { names } from '@/components/SvgIcon/index.vue';

export default {
  components: { SvgIcon: SvgIcon },
  data: () => ({ names }),
};
</script>

<template>
  <div :class="$style.box">
    <div v-for="name in names" :key="name" :class="$style.item">
      <svg-icon :class="$style.svg" :icon-name="name" />
      <div :class="$style.name">{{ name }}</div>
    </div>
    <div slot="content">{{ `&lt;svg-icon icon-name="${name}" /&gt;` }}</div>
  </div>
</template>

<style lang="less" module>
.box {
  display: flex;
  flex-flow: wrap;
  text-align: center;
}
.item {
  width: 110px;
  padding: 10px 5px;
}
.svg {
  font-size: 32px;
  color: #606266;
  transition: color 0.3s;
}
.item:hover .svg {
  color: #5cb6ff;
}
.name {
  margin-top: 10px;
}
</style>
