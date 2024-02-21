<template>
  <div
    class="h-screen flex flex-col bg-gradient-to-b from-[#F7E0FF] to-[#FFFFFF]"
  >
    <HeaderTop
      left-icon="icon-back"
      :bar-background="statusBarColor"
      :title="$t('VA.academyTitle')"
    >
    </HeaderTop>
    <!-- Header -->
    <nav class="px-4 flex items-center">
      <div
        class="flex-1 flex items-center text-base overflow-auto py-2"
        ref="tabWrap"
      >
        <div
          class="mr-4 shrink-0 relative pb-0.5"
          v-for="item in tabList"
          @click="onChangeTabItem(item)"
          :key="item.id"
          :class="{
            'text-[#9567D1] ': curTabIdx === item.idx,
            'text-[#333]': curTabIdx !== item.idx,
          }"
        >
          {{ item.name }}
          <div
            v-if="curTabIdx === item.idx"
            class="absolute left-1 right-1 bottom-0 h-0.5 rounded-full bg-[#9567D1]"
          ></div>
        </div>
      </div>
      <div
        class="iconfont icon-expand text-[#CCC] pl-2.5 active:scale-95"
        @click="onShowTabPicker"
      ></div>
      <van-popup v-model="isTabPickerShowed" round position="bottom">
        <van-picker
          show-toolbar
          ref="tabPicker"
          :columns="tabList"
          :default-index="curTabIdx"
          @cancel="isTabPickerShowed = false"
          @confirm="onTabSelect"
          :confirm-button-text="$t('Base.Confirm')"
          :cancel-button-text="$t('Base.Cancel')"
        />
      </van-popup>
    </nav>
    <main class="flex-1 px-4 overflow-auto">
      <AcademyBanner class="mb-4"></AcademyBanner>

      <NoDataIcon
        v-if="isNoData"
        class="text-[#999] text-[14px] mt-5"
      ></NoDataIcon>
      <List
        v-model="loading"
        :finished="finished"
        :error-text="errorText || $t('Base.FailLoad')"
        :error.sync="error"
        @load="onLoad"
      >
        <div
          v-for="item in articleList"
          :key="item.id"
          class="flex items-stretch justify-between mb-4 overflow-hidden"
          @click="onArticleClick(item)"
        >
          <div
            class="bg-cover rounded-md bg-no-repeat mr-3 shrink-0"
            :style="
              $ss.getters.convertBgImageStyle(
                item.imageUrl,
                false,
                $ss.getters.designPxsObjToReal({
                  width: 134,
                  height: 75,
                })
              )
            "
          ></div>
          <div
            class="flex-1 flex flex-col justify-between text-[#333] py-0.5 text-sm leading-4"
          >
            <div class="tz-ellipsis-break-2" :style="{ flex: '0 1 auto' }">
              {{ item.title }}
            </div>
            <div class="opacity-60">{{ item.dateStr }}</div>
          </div>
        </div>
      </List>
    </main>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { tryMergeLocalesForVPrjAcademyCenter } from '@/locales/Page/VPrj/VA/init';
import { List, Picker, Popup, Toast } from 'vant';
import AcademyBanner from '@/modules/Academy/AcademyBanner.vue';
import ButtonLockController from '@/controller/ButtonLockController';
import { paddingLeft } from '@/utils/string';
import NoDataIcon from '@/components/NoData/NoDataIcon.vue';
import { bannerNavigation } from '@/utils/navigator';
import { BannerOpType } from '@/constants/BannerOpType';
import {
  pageCollegeCenterController,
  tabListCollegeCenterController,
} from '@/vservices/restful/CollegeCenterController';
import { ROUTENAME_INAPP_V_ACADEMY_CENTER } from '@/constants/localRoutePath';
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjAcademyCenter();
@Component({
  components: {
    HeaderTop,
    'van-popup': Popup,
    'van-picker': Picker,
    AcademyBanner,
    List,
    NoDataIcon,
  },
})
export default class VAcademyPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  $refs!: {
    tabPicker?: Picker;
    tabWrap: HTMLDivElement;
  };
  /**
   *   statusBar
   */
  statusBarColor = '#F7E0FF';
  useInited() {
    this.$trace('school_center_exposure', {});
    tabListCollegeCenterController().then((res) => {
      if (res.success) {
        this.rawTabList = res.data;
      } else {
        Toast(res.message);
      }
    });
    return () => {
      //    destroy
    };
  }

  //#region TabList
  curTabIdx = 0;
  rawTabList: RAPI.CollegeCenterTabListVO[] = null;
  get tabList() {
    const list = this.rawTabList || [];
    list.splice(0, 0, {
      id: '',
      name: this.$t('VA.all') as string,
    });
    return list.map((item, idx) => {
      return {
        ...item,
        text: item.name,
        idx,
      };
    });
  }

  onChangeTabItem(tabItem: typeof VAcademyPage.prototype.tabList[0]) {
    let lastTabIdx = this.curTabIdx;
    this.curTabIdx = tabItem.idx;
    this.refreshTabItemPos();
    this.$trace('click_school_center_tabname', {
      tabname: tabItem.name,
      tab_id: tabItem.id,
    });
    if (tabItem.idx !== lastTabIdx) {
      this.resetLoad();
      this.onLoad();
    }
  }

  refreshTabItemPos() {
    this.$nextTick(() => {
      const el = this.$refs.tabWrap.children[this.curTabIdx];
      if (!el) {
        return;
      }
      el.scrollIntoView({
        inline: 'center',
        behavior: 'smooth',
      });
    });
  }
  onTabSelect(tabItem: typeof VAcademyPage.prototype.tabList[0], _idx: number) {
    let lastTabIdx = this.curTabIdx;
    this.curTabIdx = tabItem.idx;
    this.refreshTabItemPos();
    this.isTabPickerShowed = false;

    this.$trace('click_school_center_tabname', {
      tabname: tabItem.name,
      tab_id: tabItem.id,
    });
    if (tabItem.idx !== lastTabIdx) {
      this.resetLoad();
      this.onLoad();
    }
  }
  isTabPickerShowed = false;
  onShowTabPicker() {
    this.isTabPickerShowed = true;
  }
  //#endregion

  loading = false;
  finished = false;
  error = false;
  errorText = '';
  pageQueryObj = {
    pageIndex: 1,
    pageSize: 8,
  };

  rawDataList: RAPI.CollegeCenterPageVO[] = [];
  get isNoData() {
    return this.rawDataList.length === 0 && !this.loading && !this.error;
  }

  get articleList() {
    return (this.rawDataList || []).map((res) => {
      const dt = new Date(Number(res.modifiedDate));
      return {
        ...res,
        dateStr: `${paddingLeft(dt.getDate() + '', 2, '0')}-${paddingLeft(
          dt.getMonth() + 1 + '',
          2,
          '0'
        )}`,
      };
    });
  }

  resetLoad() {
    this.pageQueryObj.pageIndex = 1;
    this.rawDataList = [];
    this.finished = false;
  }
  onLoad() {
    const curTabItem = this.tabList[this.curTabIdx];
    const queryObj = {
      collegeTabId: curTabItem.id ? curTabItem.id : undefined,
      ...this.pageQueryObj,
    };
    // console.log('[DEBUG] UpdateList', { ...queryObj }, from);

    this.loading = true;
    pageCollegeCenterController(queryObj).then((res) => {
      if (res.success) {
        const hasNext =
          res.total > this.pageQueryObj.pageIndex * this.pageQueryObj.pageSize;
        this.finished = !hasNext;
        this.rawDataList = this.rawDataList.concat(res.data || []);
        this.pageQueryObj.pageIndex++;

        (res.data || []).map((item) => {
          this.$trace('school_center_article_exposure', {
            article_id: item.id,
            article_name: item.title,
          });
        });
        this.error = false;
        this.loading = false;
      } else {
        this.loading = false;
        this.error = true;
        this.errorText = res.message;
      }
    });
  }

  onArticleClick(item: typeof VAcademyPage.prototype.articleList[0]) {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$trace('click_school_center_article', {
      article_id: item.id,
      article_name: item.title,
      article_url: item.linkUrl,
    });
    if (!item.linkUrl) {
      return;
    }
    bannerNavigation({
      url: item.linkUrl,
      from: ROUTENAME_INAPP_V_ACADEMY_CENTER,
      opType: BannerOpType.AppLink,
    });
  }
}
</script>
