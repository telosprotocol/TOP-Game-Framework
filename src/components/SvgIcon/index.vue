<!-- svg-sprite   ，          iconfont -->

<script>
const requireCtx = require.context(
  './icons/',
  false, //
  /\.svg$/
);
const fileNames = requireCtx.keys();
const names = Object.freeze(
  fileNames.map((fileName) =>
    fileName
      .split(/[/\\]+/)
      .pop()
      .replace(/\.\w+$/, '')
  )
);
fileNames.forEach((fileName) => requireCtx(fileName));

export { names };
export default {
  name: 'SvgIcon',
  props: {
    iconName: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <svg :class="['svg-icon', `svg-icon-${iconName}`]">
    <use :xlink:href="`#$svgSpriteIcon_${iconName}`" />
  </svg>
</template>

<style lang="less">
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  overflow: hidden;
  line-height: 1;
  vertical-align: -0.13em;
  fill: currentColor;
}
[id^='$svgSpriteIcon_'] {
  [fill] {
    fill: currentColor;
  }
  [stroke] {
    stroke: currentColor;
  }
}
</style>
