<template>
  <div>
    <HeaderTop skin="dark" :bar-background="statusBarColor" :design-height="50">
      <template v-slot:leftIcon="{ goBack }">
        <button
          class="w-[34px] h-[34px] flex items-center justify-center text-white bg-[rgba(0,0,0,0.3)] rounded-[40%] iconfont icon-back text-xl active:scale-95"
          @click="goBack"
        ></button
      ></template>
      <div slot="right" class="text-[13px]">
        {{ extraData.vaName || '' }}
      </div>
    </HeaderTop>
    <div
      class="robot-medium text-[13px] h-8 py-[1px] flex items-center justify-center"
      :class="statusInfo.className"
    >
      <ib v-if="statusInfo.iconClass" :class="statusInfo.iconClass"></ib>
      {{ statusInfo.text }}
    </div>
    <main class="px-3 pb-3">
      <div class="py-2">
        <div
          class="w-full h-[34px] bg-left bg-contain bg-no-repeat"
          :style="iconBackStyle"
        ></div>
      </div>
      <section class="py-4 border-b border-solid border-[#EBEBEB]">
        <h3 class="pb-2.5 robot-medium text-[#666666]">
          {{ $t('VRT.accountNumber') }}
        </h3>
        <div class="flex items-center justify-start">
          <div class="text-[#333333] robot-bold text-2xl leading-none">
            {{ orderID || '-' }}
          </div>
          <div
            v-if="orderID"
            class="iconfont icon-copy text-[#3280D5] px-1 active:scale-95"
            @click="onCopy"
          ></div>
        </div>
      </section>
      <section class="py-4">
        <h3 class="mb-2 robot-medium text-[#666666]">
          {{ $t('VRT.amount') }}
        </h3>
        <div class="flex items-center justify-start robot-bold text-[32px]">
          Rp {{ txtPrice || '-' }}
        </div>
      </section>
      <button
        class="mt-8 text-[#143780] bg-white robot-bold text-base border border-solid rounded-sm border-[#24458B] py-3 px-2 w-full mb-5"
        :class="{ 'active:scale-95': !!orderID }"
        :style="{ filter: orderID ? '' : 'grayscale(0.7)' }"
        @click="onQueryStatus"
      >
        {{ $t('VRT.checkStatus') }}
      </button>
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

import { convertBgImageStyle } from '@/utils/styles';
import { tryMergeLocalesForVPrjRechargeTransition } from '@/locales/Page/VPrj/VRT/init';
import { Toast } from 'vant';
import { pasteStr } from '@/js_bridge/js_call_app_base';
import ButtonLockController from '@/controller/ButtonLockController';
import { payInCheckPayController } from '@/vservices/client/PayController';
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjRechargeTransition();
//{"vaNumber":"8889990326182580","vaIcon":"xxx","vaName":"BANK_MANDIRI","product":{"itemHeight":63,"num":"50,000","recommend":false,"type":"GENERAL","createdDate":1687178983000,"price":"50000","modifiedDate":1687178983000,"name":"50000","id":"1120455392028000256"},"orderId":"VIN1124010098016911360"}

type IPayInCreateVO = {
  /**
   *
   * @type {string}
   */
  orderId: string;

  // /**
  //  *
  //  * @type {string}
  //  */
  // requestPayUrl: string;

  /**
   * VA
   * @type {string}
   */
  vaNumber: string;

  /**
   *
   * @type {string}
   */
  vaName: string;

  /**
   *
   * @type {string}
   */
  vaIcon: string;

  product: {
    price: string;
  };
};

@Component({
  components: { HeaderTop },
})
export default class VGameRechargeOKPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#24458B';
  useInited() {
    return () => {
      //    destroy
    };
  }

  get iconBackStyle() {
    const extraData = this.extraData;
    if (extraData.vaIcon) {
      return convertBgImageStyle(extraData.vaIcon, false);
    }
    return {};
  }

  get txtPrice() {
    const extraData = this.extraData;
    const price = extraData.product?.price;
    if (price != null) {
      return price;
    }
    return '-';
  }
  get extraData() {
    try {
      const defaultExtraData = this.$route.query.extraData as string;
      let extraData = defaultExtraData;
      try {
        return JSON.parse(extraData) as IPayInCreateVO;
      } catch (ex) {}
      extraData = decodeURIComponent(defaultExtraData); //TODO: del
      return JSON.parse(extraData) as IPayInCreateVO;
    } catch (ex) {
      return {} as Partial<IPayInCreateVO>;
    }
  }

  get queryStr() {
    return JSON.stringify(this.$route.query.extraData);
  }

  get orderID() {
    return this.extraData.vaNumber;
  }

  async onCopy() {
    //
    this.$tracev('pay_clipboard_text', {
      text: this.orderID,
    });
    pasteStr({ content: this.orderID });
    Toast(this.$t('Base.CopySucceeded'));
  }

  /**
   *   | 'PAYE_CREATE'
  | 'PAY_ING'
  | 'PAY_SUCCESS'
  | 'PAY_FAILED'
  | 'PAY_CANCEL'
   */
  status: API.PayInOrderVO['status'] = 'PAY_ING';

  get statusInfo() {
    const status = this.status;
    switch (status) {
      case 'PAY_CREATE':
      case 'PAY_ING':
        return {
          text: this.$t('VRT.pay_ing'),
          className: 'bg-[#E8EFFF] text-[#3280D5]',
        };
      case 'PAY_SUCCESS':
        return {
          text: this.$t('VRT.pay_success'),
          className: 'bg-[#DDf7DC] text-[#4EB74B]',
          iconClass: 'iconfont icon-check-outlined mr-1',
        };
      case 'PAY_CANCEL':
      case 'PAY_FAILED':
      default:
        return {
          text: this.$t('VRT.pay_closed'),
          className: 'bg-[#E1E1E1] text-[#666666]',
        };
    }
  }

  async onQueryStatus() {
    const realOrderId = this.extraData?.orderId;
    if (!realOrderId) {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('query', 1)) {
      return;
    }
    const res = await payInCheckPayController({ orderId: realOrderId });
    if (res.success) {
      this.status = res.data.status;
    } else {
      Toast(res.message);
      //24002
    }
  }
}
</script>
