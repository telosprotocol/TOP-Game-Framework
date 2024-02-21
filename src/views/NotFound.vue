<template>
  <div>
    <HeaderTop left-icon="icon-back" title="404"> </HeaderTop>
    <div style="padding: 0.4rem">
      <NoDataIcon class="text-[#333]">
        <div>
          <h3>{{ message }}</h3>
          <p v-if="description">{{ description }}</p>
        </div>
      </NoDataIcon>
    </div>
  </div>
</template>
<script>
import { startsWith } from 'lodash-es';
import NoDataIcon from '@/components/NoData/NoDataIcon.vue';
import HeaderTop from '@/components/HeaderTop/index.vue';
const FROM_QUERY_TAG = '_from=404';
const MIXPREFIX = '/mix/';
const MIXPREFIX2 = '/mix2/';
export default {
  components: {
    NoDataIcon,
    HeaderTop,
  },
  data() {
    return {
      message: this.$t('Base.NotFound'),
      description: null,
    };
  },
  created() {
    const hash = location.hash || '';
    if (location.hash.indexOf(FROM_QUERY_TAG) > -1) {
      this.message = this.$t('Base.NotFound');
      this.description = hash.substr(
        1,
        hash.length - 1 - FROM_QUERY_TAG.length - 1
      );
      return;
    }
    const $route = this.$route;
    let toHtml = this.$route.meta.to;

    if (startsWith($route.path, MIXPREFIX)) {
      toHtml = 'mix.html';
    } else if (startsWith($route.path, MIXPREFIX2)) {
      toHtml = 'mix2.html';
    }
    if (!toHtml) {
      return;
    }
    const hasHashQuery = hash.indexOf('?') > -1;

    const toUrl = `${toHtml}${location.search}${hash}${
      hasHashQuery ? '&' : '?'
    }${FROM_QUERY_TAG}`;
    window.location.replace(toUrl);
  },
};
</script>
