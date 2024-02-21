<template>
  <div>
    <van-popup v-model="isVisible" position="bottom">
      <div>
        <div style="padding: 4px 16px 0 16px; font-size: 16px">DebugTool</div>
        <div style="max-height: calc(92vh - 30px); overflow: auto">
          <van-field
            :label-width="labelWidth"
            v-model="userId"
            center
            clearable
            label=" ID"
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                class="mr-2"
                @click="copyUserId"
                >Copy</van-button
              >
              <van-button size="small" type="primary" @click="copyUserToken"
                >Token</van-button
              >
            </template>
          </van-field>
          <van-field
            :label-width="labelWidth"
            v-model="navUrl"
            center
            clearable
            label=" "
          >
            <template #button>
              <van-button size="small" type="primary" @click="navigation">
                OpenUrl
              </van-button>
            </template>
          </van-field>
          <van-row>
            <van-col span="10">
              <van-cell title=" " @click="openQuickNav" is-link></van-cell>
            </van-col>
            <van-col span="10">
              <van-field
                readonly
                clickable
                name="lang"
                :value="lang"
                label=" "
                placeholder=" "
                @click="showLang = true"
              />
            </van-col>
          </van-row>

          <van-cell>
            <!-- <van-field
              readonly
              clickable
              name="adSource"
              :value="adSource"
              label="Source "
              placeholder=" Source"
              @click="showAdSource = true"
            /> -->

            <!-- <van-button
              size="small"
              class="mr-2"
              type="primary"
              @click="testHttpProxy()"
            >
               HttpProxy
            </van-button> -->
          </van-cell>
          <van-cell>
            <van-button
              size="mini"
              class="mr-1"
              type="primary"
              @click="reloadPage()"
            >
              Reload
            </van-button>
            <van-button
              size="mini"
              class="mr-1"
              type="primary"
              @click="openMonitMsgPush()"
            >
              MsgPush
            </van-button>
            <van-button
              size="mini"
              class="mr-1"
              type="primary"
              @click="clearLocalStorage()"
            >
              ClearStorage
            </van-button>
            <van-button
              size="mini"
              class="mr-1"
              type="primary"
              @click="toggleErudaTool(true)"
              >OpenEruda</van-button
            >
            <van-button
              size="mini"
              type="primary"
              @click="toggleErudaTool(false)"
              >CloseEruda</van-button
            >
          </van-cell>
          <van-cell center title=" " value-class="flex2" size="small">
            <template #right-icon>
              <van-switch size="24" v-model="closeLoginCheck" />
            </template>
          </van-cell>
          <van-row type="flex" justify="space-between">
            <van-col span="12">
              <van-cell center title=" Log" value-class="flex2" size="mini">
                <template #right-icon>
                  <van-switch size="18" v-model="perfOptimize" />
                </template>
              </van-cell>
            </van-col>
            <van-col span="12">
              <van-cell center title=" " value-class="flex2" size="mini">
                <template #right-icon>
                  <van-switch size="18" v-model="showSubCategory" />
                </template>
              </van-cell>
            </van-col>
          </van-row>
          <van-dropdown-menu size="mini" direction="up">
            <van-dropdown-item
              title="Debug "
              title-class=" text-sm"
              size="mini"
            >
              <van-cell
                v-for="item in debugConfigList"
                :key="item.name"
                :title="item.title || item.name"
                center
              >
                <template #right-icon>
                  <van-switch
                    :value="item.value"
                    @input="item.onInput"
                    size="18"
                  />
                </template>
              </van-cell>
            </van-dropdown-item>
          </van-dropdown-menu>

          <van-cell center title="bridge " value-class="flex2">
            <van-radio-group v-model="logPush" direction="horizontal">
              <van-radio name="0" icon-size="14"> </van-radio>
              <van-radio name="1" icon-size="14"> </van-radio>
              <van-radio name="2" icon-size="14"> </van-radio>
            </van-radio-group>
          </van-cell>
          <van-cell center title="bridge " value-class="flex2">
            <van-radio-group v-model="logPushEnd" direction="horizontal">
              <van-radio name="0" icon-size="14"> </van-radio>
              <van-radio name="1" icon-size="14"> </van-radio>
              <van-radio name="2" icon-size="14"> </van-radio>
            </van-radio-group>
          </van-cell>
          <van-dropdown-menu size="mini" direction="up">
            <van-dropdown-item
              title="app call js "
              title-class=" text-sm"
              size="mini"
            >
              <van-cell
                v-for="item in bAppPushIgnoreList"
                :key="item.name"
                :title="item.title || item.name"
                center
                size="mini"
              >
                <template #right-icon>
                  <van-checkbox-group
                    :value="item.value"
                    @input="item.onInput"
                    direction="horizontal"
                    size="mini"
                  >
                    <van-checkbox :name="1"> </van-checkbox>
                    <van-checkbox :name="2"> </van-checkbox>
                  </van-checkbox-group>
                </template>
              </van-cell>
            </van-dropdown-item>
          </van-dropdown-menu>
          <van-cell center title="bridge " value-class="flex2">
            <van-radio-group v-model="logPullStart" direction="horizontal">
              <van-radio name="0" icon-size="14"> </van-radio>
              <van-radio name="1" icon-size="14"> </van-radio>
              <van-radio name="2" icon-size="14"> </van-radio>
            </van-radio-group>
          </van-cell>
          <van-cell center title="bridge " value-class="flex2">
            <van-radio-group v-model="logPullEnd" direction="horizontal">
              <van-radio name="0" icon-size="14"> </van-radio>
              <van-radio name="1" icon-size="14"> </van-radio>
              <van-radio name="2" icon-size="14"> </van-radio>
            </van-radio-group>
          </van-cell>
          <van-dropdown-menu size="mini" direction="up">
            <van-dropdown-item
              title="js call app  "
              title-class=" text-sm"
              size="mini"
            >
              <van-cell
                v-for="item in bAppIgnoreList"
                :key="item.name"
                :title="item.title || item.name"
                center
                size="mini"
              >
                <template #right-icon>
                  <van-checkbox-group
                    :value="item.value"
                    @input="item.onInput"
                    direction="horizontal"
                    size="mini"
                  >
                    <van-checkbox :name="1"> </van-checkbox>
                    <van-checkbox :name="2"> </van-checkbox>
                  </van-checkbox-group>
                </template>
              </van-cell>
            </van-dropdown-item>
          </van-dropdown-menu>
          <!-- <van-field
            :label-width="labelWidth"
            v-model="address"
            center
            clearable
            type="textarea"
            autosize
            label=" "
            placeholder=" "
          >
          </van-field>
          <div>
            <van-button size="small" type="primary" @click="goToUrl"
              >ChangeToAddress</van-button
            >
          </div>
          <van-field
            :label-width="labelWidth"
            v-model="port"
            center
            clearable
            label=" "
            placeholder=" "
          >
            <template #button>
              <van-button size="small" type="primary" @click="goToPortUrl"
                >ChangeToPort</van-button
              >
            </template>
          </van-field> -->
        </div>
      </div>
    </van-popup>
    <MaskModal v-model="isMonitMsgPushOpen" class="modal">
      <div slot="title"></div>
      <div slot="default">
        （or ）:
        <van-field
          :label-width="labelWidth"
          v-model="monitMsgStr"
          center
          type="textarea"
          rows="12"
          clearable
          label="JSON"
          autosize
        >
        </van-field>
        <div style="margin: 16px">
          <van-button
            :loading="isMonitingSendMsg"
            round
            block
            type="primary"
            @click="monitSendMsg"
          >
          </van-button>
        </div>
      </div>
    </MaskModal>
    <van-action-sheet
      v-model="showQuickNav"
      :actions="navOptions"
      cancel-text=" "
      description=" "
      @select="onQuickNavSelect"
      close-on-click-action
    />
    <van-popup v-model="showLang" position="bottom">
      <van-picker
        show-toolbar
        :columns="langColumns"
        @confirm="onLangChange"
        @cancel="showLang = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import MaskModal from '@/components/Modal/MaskModal.vue';
import { DEBUG_LOG_KEY, logConfig } from '@/config/debug';
import {
  // ROUTEPATH_DIALOG_LOTTERY_RESULT,
  ROUTEPATH_MIX_PFINDEX,
  ROUTEPATH_MIX_PLAYFORM,
} from '@/constants/localRoutePath';
import type { IPushCommandMap } from '@/constants/push';
import { getCurrentLang, setCurrentLang } from '@/init/i18n';
import { dealPushEvent } from '@/js_bridge/appPush';
import { BIT_LOG_END, BIT_LOG_START } from '@/js_bridge/BIT_LOG_ENUMS';
import { pasteStr } from '@/js_bridge/js_call_app_base';
import store from '@/store/index';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import {
  ActionSheet,
  Button,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Col,
  Dialog,
  DropdownItem,
  DropdownMenu,
  Field,
  Picker,
  Popup,
  Radio,
  RadioGroup,
  Row,
  Switch,
} from 'vant';
import { Component, Vue } from 'vue-property-decorator';

export function updateLogConfig() {
  localStorage.setItem(DEBUG_LOG_KEY, JSON.stringify(logConfig));
  store.state.base.logConfig.showTaskId = logConfig.showTaskId;
}
// import { getPaidViewInfo } from '@/http/api/paidView';
import { Toast } from 'vant';
const VanCompObj = {
  Field,
  Cell,
  CellGroup,
  Button,
  Col,
  Row,
  Switch,
  Radio,
  RadioGroup,
  ActionSheet,
  Popup,
  Picker,
  DropdownMenu,
  DropdownItem,
  Dialog,
  CheckboxGroup,
  Checkbox,
};
const vanComMap: { [key: string]: any } = {};
for (const key in VanCompObj) {
  vanComMap['Van' + key] = (VanCompObj as any)[key];
}
const DebugToolProp = Vue.extend({
  components: {
    MaskModal,
    ...vanComMap,
  },
});

let __RENDER_SIDE_EFFECT_COLLECT = 0;
@Component<DebugTool>({})
export default class DebugTool extends DebugToolProp {
  isVisible = false;

  labelWidth = '3em';
  get userId() {
    return store.state.user.userId;
  }

  private get userIdDeviceStr() {
    return ` ID:${this.userId}\r\n  ID:${store.state.app.deviceId}`;
  }

  copyUserId() {
    pasteStr({
      content: this.userIdDeviceStr,
    });
    Toast('copied ok');
  }
  copyUserToken() {
    pasteStr({
      content: `${this.userIdDeviceStr}\r\n token: ${store.state.user.auth}`,
    });
    Toast('copied ok');
  }
  //#region

  //#endregion

  //#region Eruda
  toggleErudaTool(isVisble: boolean) {
    if (isVisble) {
      localStorage.setItem('active-eruda', 'true');
      Toast('OpenErudaSuccess');
      if (!(window as any).eruda) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = !0;
        script.onload = function () {
          (window as any).eruda.init({
            defaults: {
              displaySize: 50,
              transparency: 0.9,
            },
          });
          (window as any).eruda.position({ x: 10, y: 50 });
        };
        script.src = './eruda.js';
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    } else {
      localStorage.removeItem('active-eruda');
      Toast('CloseErudaSuccess,please reload page');
    }
  }
  //#endregion
  reloadPage() {
    location.reload();
  }

  clearLocalStorage() {
    localStorage.clear();
    Toast('clear ok');
  }
  //#region logConfig

  get perfOptimize() {
    __RENDER_SIDE_EFFECT_COLLECT = this.renderState;
    return logConfig.perfOptimize !== 0;
  }
  set perfOptimize(isChecked: boolean) {
    logConfig.perfOptimize = isChecked ? 1 : 0;
    this.updateLogConfig();
  }

  updateLogConfig() {
    updateLogConfig();
    this.renderState++;
  }

  renderState = 0;

  get showSubCategory() {
    const isChecked = store.state.base.logConfig.showTaskId === 1;
    return isChecked;
  }

  set showSubCategory(isChecked: boolean) {
    logConfig.showTaskId = isChecked ? 1 : 0;
    this.updateLogConfig();
  }
  get logPush() {
    __RENDER_SIDE_EFFECT_COLLECT = this.renderState;
    return logConfig.bpush.start + '';
  }
  set logPush(v: string) {
    const vi = parseInt(v, 10);
    logConfig.bpush.start = vi;
    this.updateLogConfig();
  }
  get logPushEnd() {
    __RENDER_SIDE_EFFECT_COLLECT = this.renderState;
    return logConfig.bpush.end + '';
  }
  set logPushEnd(v: string) {
    const vi = parseInt(v, 10);
    logConfig.bpush.end = vi;
    this.updateLogConfig();
  }

  get logPullStart() {
    __RENDER_SIDE_EFFECT_COLLECT = this.renderState;
    return logConfig.bpull.start + '';
  }
  set logPullStart(v: string) {
    const vi = parseInt(v, 10);
    logConfig.bpull.start = vi;
    this.updateLogConfig();
  }

  get logPullEnd() {
    __RENDER_SIDE_EFFECT_COLLECT = this.renderState;
    return logConfig.bpull.end + '';
  }
  set logPullEnd(v: string) {
    const vi = parseInt(v, 10);
    logConfig.bpull.end = vi;
    this.updateLogConfig();
  }
  //#endregion

  //#region
  navUrl = '/Wallet/Lottery';

  navigation() {
    openAppH5LinkPreferLocal(this.navUrl, {});
    this.isVisible = false;
  }
  showQuickNav = false;
  get navOptions() {
    return [
      { name: 'PFIndex', value: ROUTEPATH_MIX_PFINDEX },
      { name: 'PlayForm', value: ROUTEPATH_MIX_PLAYFORM + '?pfid=1' },
      { name: 'Report', value: '/Report?videoId=Dfhko-U1I40&fromTab=funny' },
    ];
  }

  onQuickNavSelect(item: { value: string; name: string }) {
    // this.showQuickNav = false
    Toast(` ${item.value}`);
    openAppH5LinkPreferLocal(item.value, {});
  }
  openQuickNav() {
    this.showQuickNav = true;
  }
  //#endregion

  //#region

  showLang = false;

  get lang() {
    return getCurrentLang();
  }

  get langColumns() {
    return ['en', 'id', 'hi'];
  }
  onLangChange(v: string) {
    setCurrentLang(v);
    this.showLang = false;
    this.isVisible = false;
  }
  // :columns="langColumns"
  // @confirm="onLangChange"
  // @cancel="showLang = false"
  //#endregion

  //#region
  get debugConfigList() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    __RENDER_SIDE_EFFECT_COLLECT = this.renderState;
    return [
      {
        title: ' ',
        name: 'trace',
      },
      //  bridge
      {
        name: 'penetrateData',
      },
      {
        title: 'Bridge http ',
        name: 'httpProxy',
      },
      {
        title: ' http ',
        name: 'http',
      },
    ].map((item) => {
      return {
        ...item,
        value: !!(logConfig.debugMap as any)[item.name],
        onInput(isChecked: boolean) {
          (logConfig.debugMap as any)[item.name] = isChecked ? 1 : 0;
          that.updateLogConfig();
        },
      };
    });
  }

  get bAppIgnoreList() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    __RENDER_SIDE_EFFECT_COLLECT = this.renderState;
    return [
      {
        name: 'getInfo',
        title: 'http ',
      },
      {
        name: 'setLocalLog',
      },
      {
        name: 'penetrateData',
      },
      {
        name: 'updateTaskInfo',
      },
      {
        name: 'dotting',
      },
      {
        name: 'httpProxy',
      },
      {
        name: 'startTimer',
      },
      {
        name: 'clearTimer',
      },
      {
        name: 'addPushListener',
      },
      {
        name: 'getUserInfo',
      },
      {
        name: 'isLoginAsync',
      },
      {
        name: 'getConfig',
      },
      {
        name: 'getAppInfo',
      },
      {
        name: 'getAdvertisingInfo',
      },
      {
        name: 'getDeviceInfo',
      },
    ].map((item) => {
      const oldVal = logConfig.bCallIgnore[item.name] || 0;
      const vlist = [];
      if (oldVal & BIT_LOG_START) {
        vlist.push(BIT_LOG_START);
      }
      if (oldVal & BIT_LOG_END) {
        vlist.push(BIT_LOG_END);
      }
      return {
        ...item,
        value: vlist,
        onInput(checkVal: string[]) {
          const strList = (checkVal || []).join(',');
          let toVal = 0;
          if (strList.indexOf(BIT_LOG_START + '') !== -1) {
            toVal += BIT_LOG_START;
          }
          if (strList.indexOf(BIT_LOG_END + '') !== -1) {
            toVal += BIT_LOG_END;
          }
          logConfig.bCallIgnore[item.name] = toVal as any;
          that.updateLogConfig();
        },
      };
    });
  }

  get bAppPushIgnoreList() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    __RENDER_SIDE_EFFECT_COLLECT = this.renderState;
    return [
      {
        name: 'updateTaskInfo',
      },
      {
        name: 'penetrateData',
      },
      {
        name: 'onWalletTabChecked',
      },
      {
        name: 'netChanged',
      },
      {
        title: ' ',
        name: 'onPaidViewRewardsReceiveEnd',
      },
    ].map((item) => {
      const oldVal = logConfig.bPushIgnore[item.name] || 0;
      const vlist = [];
      if (oldVal & BIT_LOG_START) {
        vlist.push(BIT_LOG_START);
      }
      if (oldVal & BIT_LOG_END) {
        vlist.push(BIT_LOG_END);
      }
      return {
        ...item,
        value: vlist,
        onInput(checkVal: string[]) {
          const strList = (checkVal || []).join(',');
          let toVal = 0;
          if (strList.indexOf(BIT_LOG_START + '') !== -1) {
            toVal += BIT_LOG_START;
          }
          if (strList.indexOf(BIT_LOG_END + '') !== -1) {
            toVal += BIT_LOG_END;
          }
          logConfig.bPushIgnore[item.name] = toVal as any;
          that.updateLogConfig();
        },
      };
    });
  }
  //#endregion

  //#region  needLogin
  get closeLoginCheck() {
    __RENDER_SIDE_EFFECT_COLLECT = this.renderState;
    return localStorage.getItem('__DEBUG__CLOSE_LOGIN_CHECK') === 'true';
  }
  set closeLoginCheck(isChecked: boolean) {
    if (isChecked) {
      localStorage.setItem('__DEBUG__CLOSE_LOGIN_CHECK', 'true');
    } else {
      localStorage.removeItem('__DEBUG__CLOSE_LOGIN_CHECK');
    }
    Toast(' ， ');
    this.renderState++;
  }
  //#endregion

  //#region
  isMonitMsgPushOpen = false;
  openMonitMsgPush() {
    this.isVisible = false;
    this.isMonitingSendMsg = false;
    this.isMonitMsgPushOpen = true;
  }

  isMonitingSendMsg = false;

  // async testAdDialog() {
  //   const inputParams = {
  //     taskId: '0',
  //     taskName: 'Test' + this.adSource,
  //     source: this.adSource,
  //     hasReward: [{ currency: 'coin_point', amount: 100 }],
  //   };
  //   Toast(' :' + JSON.stringify(inputParams));
  //   const res = await showCommonAdDialog2(inputParams as any);
  //   Toast(' :' + JSON.stringify(res));
  // }
  // async testHttpProxy() {
  //   const res = await getPaidViewInfo();
  //   Toast('Response:' + JSON.stringify(res));
  // }
  monitSendMsg() {
    this.isMonitingSendMsg = true;
    try {
      const msgJson = JSON.parse(this.monitMsgStr);
      if (!msgJson || !msgJson.push_tag) {
        Toast(' ');
        this.isMonitingSendMsg = false;
        return;
      }
      const { notification: _notification, ...rest } = msgJson;
      Toast(' ');
      const payload = {
        type: msgJson.push_tag as string,
        content: '',
        maps: rest as IPushCommandMap,
      };
      dealPushEvent(payload);
      this.isMonitMsgPushOpen = false;
    } catch (ex) {
      Toast(' , JSON');
      this.isMonitingSendMsg = false;
    }
  }
  monitMsgStr = `{
  "taskTag": "test-20210526112849679-798",
  "notification": {
    "title": "test push reward",
    "body": "test push reward"
  },
  "push_tag": "push_nav_old",
  "reportSubCategory": "45",
  "gotoType": "1",
  "title": "test push reward"
}`;
  //#endregion
}
</script>

<style scoped lang="less">
.flex2 {
  flex: 2;
}
</style>
