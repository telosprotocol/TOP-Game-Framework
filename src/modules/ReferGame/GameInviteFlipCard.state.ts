import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { inviteFlipCardInviteGiftController } from '@/vservices/client/InviteGiftController';
import Vue from 'vue';
/**
 *
 */
const stateItemGameInviteFlipCard = createHttpAsyncStateItem(
  () => {
    return inviteFlipCardInviteGiftController();
  },
  null,
  'GameInviteFlipCard'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;

/**
 *
 */
export const GameInviteFlipCardMixin = Vue.extend({
  data() {
    return {
      stateItemGameInviteFlipCardRef: stateItemGameInviteFlipCard.ref,
    };
  },
  computed: {
    GameInviteFlipCard() {
      return this.stateItemGameInviteFlipCardRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，     revalidation  ，   0
     */
    refreshGameInviteFlipCard(timeout?: number) {
      return stateItemGameInviteFlipCard.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemGameInviteFlipCard;
