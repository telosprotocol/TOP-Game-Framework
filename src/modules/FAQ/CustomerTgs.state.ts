import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { getConfigController } from '@/vservices/restful/ConfigController';
import Vue from 'vue';
import Component from 'vue-class-component';
export type ICustomerTgsModel = {
  name: string;
  telegram: string;
};
const stateItemCustomerTgsList = createHttpAsyncStateItem(
  () => {
    return getConfigController({ code: 'customerTelegrams' }).then((res) => {
      return {
        ...res,
        data: res.data as any as ICustomerTgsModel[],
      };
    });
  },
  null,
  'CustomerTgs'
);
const REVALIDATION_MS = MS_MINUTE * 30;

@Component({})
export class CustomerTgsListMixin extends Vue {
  stateItemCustomerTgsListRef = stateItemCustomerTgsList.ref;
  get CustomerTgsList() {
    return this.stateItemCustomerTgsListRef.current;
  }
  /**
   *
   * @param timeout     ，     revalidation  ，   0
   */
  refreshCustomerTgsList(timeout?: number) {
    return stateItemCustomerTgsList.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemCustomerTgsList;
