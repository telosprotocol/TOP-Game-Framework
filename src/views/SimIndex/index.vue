<template>
  <div class="p-3">
    <label for="curLang" class="mr-0.5">
      I18n:
      <select v-model="curLang" id="curLang" class="w-12 p-1">
        <option v-for="item in supportedLangs" :key="item">{{ item }}</option>
      </select>
    </label>
    <label for="walletFilter">
      RouteFilter:
      <input
        class="border rounded-sm p-1 w-32"
        type="text"
        id="walletFilter"
        v-model="routeFilterValue"
      />
      <button
        @click="routeFilterValue = ''"
        class="btn iconfont icon-close"
      ></button>
    </label>
    <TzTab :tab-list="tabList" v-model="currentTabIdx" class="mb-2"></TzTab>
    <TzTabPanel :tab-list="tabList" v-model="currentTabIdx">
      <template slot="wallet">
        <div
          v-for="(groupItem, groupName) in routeGroupList"
          :key="groupName"
          class="mb-2"
        >
          <h3>{{ groupName }}</h3>
          <ul>
            <li v-for="item in groupItem" :key="item.name || item.path">
              <a @click="onRouteClicked(item, 'index')">{{
                getRouteShowName(item)
              }}</a>
            </li>
          </ul>
        </div>
      </template>
      <template slot="remote">
        <h3>RemoteRoute</h3>
        <ul>
          <li v-for="item in routeRemoteList" :key="item.name || item.path">
            <a @click="onRouteClicked(item, 'remote')">{{
              getRouteShowName(item)
            }}</a>
          </li>
        </ul>
      </template>
      <template slot="mix">
        <h3>MixRoute</h3>
        <ul>
          <li v-for="item in routeMixList" :key="item.name || item.path">
            <a @click="onRouteClicked(item, 'mix')">{{
              getRouteShowName(item)
            }}</a>
          </li>
        </ul>
      </template>
      <template slot="other">
        <h3>dialogs</h3>
        <ul>
          <li v-for="item in routeDialogList" :key="item.name || item.path">
            <a @click="onRouteClicked(item, 'dialog')">{{
              getRouteShowName(item)
            }}</a>
          </li>
        </ul>
        <h3>Debugger</h3>
        <div>
          <button class="btn" type="button" @click="clearLocalStorage">
            Clear LocalStorage
          </button>
        </div>
      </template>
    </TzTabPanel>
  </div>
</template>

<style scoped lang="less">
.btn {
  padding: 5px;
  border: 1px solid #ccc;
  &:active {
    transform: scale(0.8, 0.8);
  }
}
h3 {
  font-size: 16px;
}
a {
  color: blue;
  font-size: 14px;
}

li {
  padding: 4px 4px;
  border-bottom: 1px solid #ccc;
}
</style>

<script lang="ts">
import { DebugRoutes } from '@/entry/common/routes-sim';
import DIALOG_ROUTER from '@/entry/dialog/router';
import LANDING_ROUTER from '@/entry/landing/router';
import MIX_ROUTER from '@/entry/mix/router';
import WALLET_ROUTER from '@/entry/wallet/router';
import { setCurrentLang } from '@/init/i18n';

import TzTab from '@/components/Tab/index.vue';
import TzTabPanel from '@/components/Tab/TabPanels.vue';
import { normalizeUrlOrPath } from '@/utils/navigator/index';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

@Component({
  components: {
    TzTabPanel,
    TzTab,
  },
})
export default class SimIndex extends Vue {
  created() {
    this.curLang = this.$i18n.locale;
    this.initFilter();
  }
  mounted() {
    (window as any).simObj = this;
  }

  //#region lang
  curLang = '';
  supportedLangs = ['en', 'id', 'hi'];
  @Watch('curLang')
  onCurLangChange(val: string) {
    setCurrentLang(val);
  }
  //#endregion

  //#region tab

  currentTabIdx = 0;
  get tabList() {
    return [
      {
        title: 'Wallet',
        name: 'wallet',
      },
      {
        title: 'Mix',
        name: 'mix',
      },
      {
        title: 'Other',
        name: 'other',
      },
      // {
      //   title: 'Remote',
      //   name: 'remote',
      // },
    ] as any;
  }

  get curTabItem() {
    return this.tabList[this.currentTabIdx];
  }
  //#endregion

  //#region RouteList
  get routeGroupList() {
    const debugPathMap: Record<string, boolean> = {};
    const debugList = DebugRoutes.filter(this.filterRouteFunc);
    debugList.map((item) => {
      debugPathMap[item.path] = true;
    });
    const groupMap = {
      Debug: debugList,
      Wallet: WALLET_ROUTER.getRoutes()
        .filter(this.filterRouteFunc)
        .filter((item) => {
          return !debugPathMap[item.path];
        }),
    };
    return groupMap;
  }
  get routeRemoteList() {
    return LANDING_ROUTER.getRoutes().filter(this.filterRouteFunc);
  }
  get routeMixList() {
    return MIX_ROUTER.getRoutes().filter(this.filterRouteFunc);
  }
  get routeDialogList() {
    return DIALOG_ROUTER.getRoutes().filter(this.filterRouteFunc);
  }

  filterRouteFunc(item: { path?: string; name?: string }) {
    if (!(item.path !== '' && item.path !== '*')) {
      return false;
    }
    const vFilter = (this.routeFilterValue || '').toLowerCase();
    if (!vFilter) {
      return true;
    }
    return [item.name, item.path].some((str) => {
      if ((str || '').toLowerCase().indexOf(vFilter) !== -1) {
        return true;
      }
      return false;
    });
  }
  getRouteShowName(routeItem: any) {
    const nameStr = [routeItem.name || ''];
    if (routeItem.path && routeItem.path.indexOf(':') > -1) {
      nameStr.push(routeItem.path);
    } else if (routeItem.meta && routeItem.meta.title) {
      nameStr.push(routeItem.meta.title);
    }
    if (nameStr.length === 1 && !nameStr[0]) {
      nameStr.push(routeItem.path);
    }
    return nameStr.join('-');
  }
  onRouteClicked(item: { path: string; meta?: any }, entryName: string) {
    const url = normalizeUrlOrPath(
      item.path,
      entryName || item.meta?.entryName
    );
    location.href = url;
  }
  //#endregion

  //#region
  routeFilterValue = '';
  initFilter() {
    const lastFilterInfo = this.lastFilterInfo;
    this.routeFilterValue = lastFilterInfo?.[this.curTabItem?.name] || '';
  }

  get lastFilterInfo() {
    const lastFilterVal = localStorage.getItem('__debug_ROUTE_FILTER_VALUE');
    if (lastFilterVal) {
      const filterObj = JSON.parse(lastFilterVal) as Record<string, string>;
      return filterObj;
    }
    return null;
  }
  @Watch('routeFilterValue')
  onRouteFilterValueChange(val: string) {
    this.$forceUpdate();
    const lastFilterInfo = this.lastFilterInfo || {};
    lastFilterInfo[this.curTabItem?.name] = val;
    localStorage.setItem(
      '__debug_ROUTE_FILTER_VALUE',
      JSON.stringify(lastFilterInfo)
    );
  }

  //#endregion

  clearLocalStorage() {
    localStorage.clear();
  }
}
</script>
