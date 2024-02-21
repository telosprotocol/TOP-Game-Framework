<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <HeaderTop
      left-icon="icon-back"
      :bar-background="statusBarColor"
      :title="$t('VPTM.memberList')"
      left-icon-event="return_team_management_details"
    >
      <Popover
        slot="right"
        theme="dark"
        v-model="showRightTip"
        placement="bottom-end"
        trigger="click"
      >
        <div class="p-4">
          <div class="flex items-center mb-1">
            <b class="mr-1">{{ $t('VPTM.rechargeAmount') }} :</b>
            {{ $t('VPTM.rechargeAmountTip') }}
          </div>
          <div class="flex items-center">
            <b class="mr-1"> {{ $t('VPTM.subordinateNumber') }} :</b>
            {{ $t('VPTM.subordinateNumberTip') }}
          </div>
        </div>
        <template #reference>
          <button
            class="w-[30px] h-[30px] flex items-center justify-center -mr-1 active:scale-95 iconfont icon-question text-[#CCC] text-2xl"
          ></button>
        </template>
      </Popover>
    </HeaderTop>
    <header
      class="shrink-0 border-b border-solid border-[rgba(241, 232, 255, 1)] flex items-center text-base py-4 leading-5 robot-medium"
      :style="{ background: statusBarColor }"
    >
      <div
        v-for="item in columnList"
        :key="item.name"
        class="flex-1 text-center shrink-0 px-1"
      >
        {{ item.text }}
      </div>
    </header>
    <main class="flex-1 bg-white overflow-y-auto px-3">
      <NoDataIcon v-if="isNoData" class="text-[14px] mt-12"></NoDataIcon>
      <List
        v-model="loading"
        :finished="finished"
        :error-text="errorText || $t('Base.FailLoad')"
        :error.sync="error"
        @load="onLoad"
      >
        <div
          v-for="item in dataList"
          :key="item.userId"
          class="flex items-center text-[#777] leading-[14px] text-xs text-center py-3 border-b border-solid border-[#D9D9D9]"
        >
          <div
            v-for="colItem in columnList"
            :key="colItem.name"
            class="flex-1 shrink-0 tz-ellipsis-break-2 break-all px-1"
          >
            {{ colItem.formatValue(item) }}
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
import { tryMergeLocalesForVPrjPromoteTeamMembers } from '@/locales/Page/VPrj/VPTM/init';
import { List, Popover } from 'vant';
import NoDataIcon from '@/components/NoData/NoDataIcon.vue';
import { formatVRp } from '@/modules/vFormatter';
import { formatFloatG } from '@/store/modules/universe/universe';
import { formatDate } from '@/utils/datetime';
import { memberListGameInviteController } from '@/vservices/client/GameInviteController';
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjPromoteTeamMembers();
/**
 *
 */
@Component({
  components: { HeaderTop, List, NoDataIcon, Popover },
})
export default class VPromoteTeamMembersPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#F6F2FC';
  showRightTip = false;
  useInited() {
    this.$trace('team_management_details_exposure');
    return () => {};
  }

  get columnList() {
    return [
      {
        text: this.$t('VPTM.userNickname'),
        name: 'nickname',
        formatValue(item: API.MemberListVO) {
          const uName = item.nickname || item.userId || '';
          if (uName.length <= 15) {
            return uName;
          } else {
            return uName.substring(0, 12) + '...';
          }
        },
      },
      {
        text: this.$t('VPTM.rechargeAmount'),
        name: 'rechargeAmount',
        formatValue(item: API.MemberListVO) {
          return 'Rp' + formatVRp(Number(item.rechargeAmount));
        },
      },
      {
        text: this.$t('VPTM.subordinateNumber'),
        name: 'childNo',
        formatValue(item: API.MemberListVO) {
          return formatFloatG(Number(item.childNo), { precision: 0 });
        },
      },
      {
        text: this.$t('VPTM.joinTime'),
        name: 'inviteTime',
        formatValue(item: API.MemberListVO) {
          return formatDate(Number(item.inviteTime));
        },
      },
    ];
  }
  get dataList() {
    return this.rawDataList;
  }

  //#region
  loading = false;
  finished = false;
  error = false;
  errorText = '';
  pageQueryObj = {
    pageIndex: 1,
    pageSize: 8,
  };
  rawDataList: API.MemberListVO[] = [];
  get isNoData() {
    return this.rawDataList.length === 0 && !this.loading && !this.error;
  }

  resetLoad() {
    this.pageQueryObj.pageIndex = 1;
    this.rawDataList = [];
    this.finished = false;
  }
  onLoad(from: 'init') {
    const queryObj = {
      ...this.pageQueryObj,
    };
    // console.log('[DEBUG] UpdateList', { ...queryObj }, from);
    this.$tracev('dst_detail_list_request', { ...queryObj, dataSource: from });
    this.loading = true;
    memberListGameInviteController(queryObj).then((res) => {
      if (res.success) {
        const hasNext =
          res.total > this.pageQueryObj.pageIndex * this.pageQueryObj.pageSize;
        this.finished = !hasNext;
        this.rawDataList = this.rawDataList.concat(res.data || []);
        this.pageQueryObj.pageIndex++;
        this.loading = false;
        this.error = false;
      } else {
        this.loading = false;
        this.error = true;
        this.errorText = res.message;
      }
    });
  }

  //#endregion
}
</script>
