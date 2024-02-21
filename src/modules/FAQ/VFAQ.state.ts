import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { listFagGameHallController } from '@/vservices/restful/GameHallController';
import Vue from 'vue';

export interface IVFAQItem {
  id: string;
  // /**
  //  *  Id
  //  */
  // type: string;
  // /**
  //  *
  //  */
  // typeTitle: string;
  // title:string;

  faqType: {
    /**
     *     id
     */
    k: string;
    /**
     *
     */
    v: string;
  };

  /**
   *
   */
  title: string;
  /**
   *   -->
   */
  content: string;

  /**
   *   ，
   */
  icon: string;
}
/**
 * V  -  FAQ
 */
const stateItemVFAQ = createHttpAsyncStateItem(
  () => {
    return listFagGameHallController({
      pageIndex: 1,
      pageSize: 50,
    });
  },
  null,
  'GameFAQ'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 5;

type IVFAQGroupItem = {
  type: string;
  typeTitle: string;
  qList: IVFAQItem[];
};
/**
 *   FAQ         TODO:
 */
export const VFAQMixin = Vue.extend({
  data() {
    return {
      stateItemVFAQRef: stateItemVFAQ.ref,
    };
  },
  computed: {
    faqList() {
      const faqList = this.stateItemVFAQRef.current;
      if (faqList) {
        let curGroupItem: IVFAQGroupItem;
        const groupList: IVFAQGroupItem[] = [];
        faqList
          .sort((a, b) => {
            return Number(a.faqType.v) - Number(b.faqType.v);
          })
          .map((qItem) => {
            if (curGroupItem && curGroupItem.type == qItem.faqType.k) {
              curGroupItem.qList.push(qItem as IVFAQItem);
            } else {
              curGroupItem = {
                type: qItem.faqType.k,
                typeTitle: qItem.faqType.v,
                qList: [qItem as IVFAQItem],
              };

              groupList.push(curGroupItem);
            }
          });
        return groupList;
      }
      return null;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，       revalidation  ，   0
     */
    refreshVFAQ(timeout?: number) {
      stateItemVFAQ.tryUpdate(timeout == null ? REVALIDATION_MS : timeout);
    },
  },
});

export default stateItemVFAQ;
