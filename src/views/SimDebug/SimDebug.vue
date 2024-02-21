<template>
  <div>
    <div
      class="absolute top-0 left-0 right-0 -z-10 overflow-hidden"
      :style="$ss.getters.designPxsObjToReal({ height: 170 })"
    >
      <VPurpleCircleBgUI></VPurpleCircleBgUI>
    </div>
    <HeaderTop
      skin="dark"
      left-icon="icon-left"
      title="TestHeader"
      bar-background="transparent"
    >
      <div
        slot="beforeInner"
        class="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <VPurpleCircleBgUI></VPurpleCircleBgUI>
      </div>
    </HeaderTop>
    <main class="bg-white pt-2">
      <button
        class="tz-btn tz-btn-primary m-1"
        @click="isTopupTaskDlgShow = true"
      >
        topupActivitys
        <portal to="modal">
          <VTopupTaskDlg v-model="isTopupTaskDlgShow"></VTopupTaskDlg>
        </portal>
      </button>
      <button class="tz-btn tz-btn-primary m-1" @click="isTurntableShow = true">
        Turntable
        <portal to="modal">
          <TurntableDlg
            init-tab-type="GOLD"
            v-model="isTurntableShow"
            ref="turntableDlg"
          ></TurntableDlg>
        </portal>
      </button>
      <button
        class="tz-btn tz-btn-primary m-1"
        @click="isGameSystemConfirmDlgShow = true"
      >
        ShowSystemConfirmDlg
        <portal to="modal">
          <VGameNickNameConfirm v-model="isGameSystemConfirmDlgShow">
            sdf ks jskd fskdjf ksdjf sdf ks jskd fskdjf ksdjfsdf ks jskd fskdjf
            ksdjf sdf ks jskd fskdjf ksdjf
          </VGameNickNameConfirm>
        </portal>
      </button>
      <button class="tz-btn tz-btn-primary m-1" @click="isGameUIDlgShow = true">
        WoodDlg
        <portal to="modal">
          <GameDlgTemplate v-model="isGameUIDlgShow"></GameDlgTemplate>
        </portal>
      </button>
      <button class="tz-btn tz-btn-primary m-1" @click="isToastShow = true">
        isToastShow

        <portal to="modal">
          <GameToast v-model="isToastShow" :second="3">
            sdf ks jskd fskdjf ksdjf sdf ks jskd fskdjf ksdjfsdf ks jskd fskdjf
            ksdjf sdf ks jskd fskdjf ksdjf
          </GameToast>
        </portal>
      </button>
      <button class="tz-btn tz-btn-primary m-1" @click="showGolbalGameToast">
        showGolbalGameToast
      </button>
      <button class="tz-btn tz-btn-primary m-1" @click="testToast()">
        TestToast
      </button>
      <hr />
      <section class="p-2">
        <portal to="modal">
          <VGettedRewardsDlg
            v-model="isRewardsShow"
            :rewards="rewardList.slice(0, rewardCount)"
          ></VGettedRewardsDlg>
          <VGetPropsDlg
            v-model="isPropRewawrdShow"
            :list="
              propRewardList.slice(
                propRewardStartIdx,
                propRewardStartIdx + rewardCount
              )
            "
          ></VGetPropsDlg>
        </portal>
        <div class="flex flex-wrap">
          <button
            class="tz-btn tz-btn-primary m-1"
            @click="(isRewardsShow = true), (rewardCount = 1)"
          >
            GetRewards1
          </button>
          <button
            class="tz-btn tz-btn-primary m-1"
            @click="(isRewardsShow = true), (rewardCount = 2)"
          >
            GetRewards2
          </button>
          <button
            class="tz-btn tz-btn-primary m-1"
            @click="(isRewardsShow = true), (rewardCount = 3)"
          >
            GetRewards3
          </button>
          <button
            class="tz-btn tz-btn-primary m-1"
            @click="(isRewardsShow = true), (rewardCount = 4)"
          >
            GetRewards4
          </button>
          <button
            class="tz-btn tz-btn-primary m-1"
            @click="(isRewardsShow = true), (rewardCount = 5)"
          >
            GetRewards5
          </button>
        </div>
        <div class="flex flex-wrap">
          <button
            class="tz-btn tz-btn-primary m-1"
            @click="
              (isPropRewawrdShow = true),
                (propRewardStartIdx = 0),
                (rewardCount = 1)
            "
          >
            GetPropReward1
          </button>
          <button
            class="tz-btn tz-btn-primary m-1"
            @click="
              (isPropRewawrdShow = true),
                (propRewardStartIdx = 1),
                (rewardCount = 1)
            "
          >
            GetPropReward1-Gold
          </button>
          <button
            class="tz-btn tz-btn-primary m-1"
            @click="
              (isPropRewawrdShow = true),
                (propRewardStartIdx = 0),
                (rewardCount = 2)
            "
          >
            GetPropReward2
          </button>
          <button
            class="tz-btn tz-btn-primary m-1"
            @click="
              (isPropRewawrdShow = true),
                (propRewardStartIdx = 0),
                (rewardCount = 3)
            "
          >
            GetPropReward3
          </button>
          <button
            class="tz-btn tz-btn-primary m-1"
            @click="
              (isPropRewawrdShow = true),
                (propRewardStartIdx = 0),
                (rewardCount = 4)
            "
          >
            GetPropReward4
          </button>
          <button
            class="tz-btn tz-btn-primary m-1"
            @click="
              (isPropRewawrdShow = true),
                (propRewardStartIdx = 0),
                (rewardCount = 5)
            "
          >
            GetPropReward5
          </button>
        </div>
      </section>
      <hr />
      <section class="p-2">
        <button
          class="tz-btn tz-btn-primary m-1"
          @click="isWeekCardShow = true"
        >
          Show WeekCard
        </button>
        <GameWeekCardDlg v-model="isWeekCardShow"></GameWeekCardDlg>
        <EarnCheckInOkDlg v-model="isDebugDlgShow"></EarnCheckInOkDlg>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import Component from 'vue-class-component';
import { noop } from 'lodash-es';
import { tryMergeLocalesForVPrjGameTab } from '@/locales/Page/VPrj/VG/init';
import VPurpleCircleBgUI from '@/components/VPurpleCircleBgUI.vue';
import HeaderTop from '@/components/HeaderTop/index.vue';
import VGettedRewardsDlg from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import VGetPropsDlg from '@/modules/VRewardProps/VGetPropsDlg.vue';
import type { IUserPropRewardItem } from '@/modules/VRewardProps/controller/prop.model';
import VReferShareImageTool from '@/modules/ReferMoney/VReferShareImageTool.vue';
import GameDlgTemplate from '@/modules/UI/GameDlgTemplate.vue';
import TurntableDlg from '@/modules/Turntable/TurntableDlg.vue';
import GameToast from '@/modules/UI/GameToast.vue';
import { Toast } from 'vant';
import VGameNickNameConfirm from '@/modules/GameHall/VGameProfile/VGameNickNameConfirmDlg.vue';
import createGameToast from '@/modules/UI/createGameToast';
import VTopupTaskDlg from '@/modules/GameHall/GamePayActivity/VTopupTaskDlg.vue';
import GameWeekCardDlg from '@/modules/GameWeekCard/GameWeekCardDlg.vue';
const rawList: { text: string }[] = [];
// for (let i = 12; i < 14; i++) {
//   result.push({
//     text: `Day ${i + 1}`,
//   });
// }
for (let i = 0; i < 14; i++) {
  rawList.push({
    text: `Day ${i + 1}`,
  });
}
tryMergeLocalesForVPrjGameTab();
@Component({
  components: {
    GameWeekCardDlg,
    VPurpleCircleBgUI,
    HeaderTop,
    VGettedRewardsDlg,
    VGetPropsDlg,
    VReferShareImageTool,
    GameDlgTemplate,
    TurntableDlg,
    GameToast,
    VGameNickNameConfirm,
    VTopupTaskDlg,
  },
})
export default class SimDebug extends BindEventMixinDefault {
  $refs: {
    posterTool: VReferShareImageTool;
  };
  useInited() {
    return noop;
  }

  isDebugDlgShow = true;
  isToastShow = false;
  isTurntableShow = false;
  isGameUIDlgShow = false;
  isGameSystemConfirmDlgShow = false;
  isWeekCardShow = false;
  isTopupTaskDlgShow = false;
  activeIdx = 12;
  get list() {
    const centerActive = (this.activeIdx + 2) % 14;
    console.log('centerActive', centerActive);
    return rawList.map((item, idx) => {
      const isCenter = centerActive === idx;
      const pace = (centerActive - idx) % 14;
      return {
        ...item,
        isCenter,
        isCenter2r: pace === -13 || pace === 1,
        isCenter2l: pace === -1,
      };
    });
  }
  testToast() {
    Toast('T1');
    setTimeout(() => {
      Toast('T2');
    }, 2000);
  }
  onActiveChange(active: number) {
    this.activeIdx = active;
    console.log('onActiveChange', active, 'Day' + (active + 1));
  }

  showGolbalGameToast() {
    createGameToast('Test');
    setTimeout(() => {
      createGameToast('Tes222t');
    }, 1000);
  }

  isRewardsShow = false;
  rewardCount = 1;
  rewardList = [
    {
      coin: 'GOLD',
      num: 150001,
    },
    {
      coin: 'VTOKEN',
      num: 0.34,
    },
    {
      coin: 'VTOKEN',
      num: 0.34,
    },
    {
      coin: 'VTOKEN',
      num: 0.34,
    },
    {
      coin: 'VTOKEN',
      num: 0.34,
    },
  ];

  isPropRewawrdShow = false;
  propRewardStartIdx = 0;
  propRewardList: IUserPropRewardItem[] = [
    {
      // id: 'test_1',
      propId: 'propId_1',
      propNum: 1,
      nameText: 'Phone Charge Ticket',
      imageUrl: 'https://dummyimage.com/100x100/000/fff&text=PHONE',
      type: 'PHONE_CHARGE_TICKET',
      num: 1000 + '',
      autoUse: false,
      usable: true,
      propBagId: 'propBag_1',
    },
    {
      // id: 'test_1',
      propId: 'propId_2',
      propNum: 1000,
      nameText: 'GOLD',
      imageUrl: 'https://dummyimage.com/100x100/000/fff&text=GOLD',
      type: 'GOLD',
      num: 1000 + '',
      autoUse: false,
      usable: false,
      propBagId: 'propBag_2',
    },
    {
      // id: 'test_1',
      propId: 'propId_3',
      propNum: 1,
      nameText: 'VTOKEN',
      imageUrl: 'https://dummyimage.com/100x100/000/fff&text=TOKEN',
      type: 'VTOKEN',
      num: 1000 + '',
      autoUse: true,
      usable: true,
      propBagId: 'propBag_3',
    },
    {
      // id: 'test_1',
      propId: 'propId_4',
      propNum: 10000,
      nameText: 'GOLD',
      imageUrl: 'https://dummyimage.com/100x100/000/fff&text=GOLD',
      type: 'GOLD',
      num: 10000 + '',
      autoUse: true,
      usable: true,
      propBagId: 'propBag_4',
    },
    {
      // id: 'test_1',
      propId: 'propId_5',
      propNum: 10000,
      nameText: 'GOLD',
      imageUrl: 'https://dummyimage.com/100x100/000/fff&text=GOLD',
      type: 'GOLD',
      num: 10000 + '',
      autoUse: true,
      usable: true,
      propBagId: 'propBag_5',
    },
  ];
}
</script>

<style lang="less" scoped>
@import '~@/styles/utils.less';

.swipe-outer {
  width: 340px;
  margin: 20px auto;
  // outline: 1px solid blue;

  overflow-x: hidden;
}
.swipe {
  width: 400px;
  height: 100px;
  margin-left: -20px;
}
.swipeInner {
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  color: #333;
  font-size: 28px;
  text-align: center;
  border: 1px solid red;
  transform: scale(0.9);
  transition: all 500ms;
}

.isCenter2r {
  border: 1px solid green;
  transform: scale(0.9) translateX(-4px);
}
.isCenter2l {
  border: 1px solid green;
  transform: scale(0.9) translateX(4px);
}
.isCenter {
  border: 1px solid blue;
  transform: scale(1.04);
}
</style>
