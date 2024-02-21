import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { levelRulesUserWalletController } from '@/vservices/client/UserWalletController';
import Vue from 'vue';

const stateItemVRightLevelRule = createHttpAsyncStateItem(
  () => {
    return levelRulesUserWalletController();
  },
  null,
  'RightLevelRule'
);

//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;
/**
 *
 */
export const VRightLevelRuleMixin = Vue.extend({
  data() {
    return {
      stateItemVRightLevelRuleRef: stateItemVRightLevelRule.ref,
    };
  },
  computed: {
    RightLevelRule() {
      return this.stateItemVRightLevelRuleRef.current;
    },
  },
  methods: {
    refreshVRightLevelRule(timeout?: number) {
      return stateItemVRightLevelRule.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});
