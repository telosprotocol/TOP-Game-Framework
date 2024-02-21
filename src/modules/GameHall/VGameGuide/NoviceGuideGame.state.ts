import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { getConfigController } from '@/vservices/restful/ConfigController';
import Vue from 'vue';

function getVNoviceGuideGame() {
  return getConfigController({ code: 'noviceGuideGame' });
}
/**
 *       -
 */
const stateItemVNoviceGuideGame = createHttpAsyncStateItem(
  () => {
    return getVNoviceGuideGame();
  },
  null,
  'NoviceGuideGame'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 5;
/**
 *
 */
export const VNoviceGuideGameMixin = Vue.extend({
  data() {
    return {
      stateItemVNoviceGuideGameRef: stateItemVNoviceGuideGame.ref,
    };
  },
  computed: {
    VNoviceGuideGame() {
      return this.stateItemVNoviceGuideGameRef.current as any as string;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，       revalidation  ，   0
     */
    refreshVNoviceGuideGame(timeout?: number) {
      return stateItemVNoviceGuideGame.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVNoviceGuideGame;
