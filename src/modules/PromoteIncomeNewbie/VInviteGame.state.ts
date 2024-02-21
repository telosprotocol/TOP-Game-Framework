import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { inviteGameInfoUserInviteController } from '@/vservices/client/UserInviteController';
import Vue from 'vue';

/**
 *
 */
const stateVInviteGame = createHttpAsyncStateItem(
  () => {
    return inviteGameInfoUserInviteController();
  },
  null,
  'VInivteGame'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 5;

/**
 *
 */
export const VInviteGameMixin = Vue.extend({
  data() {
    return {
      stateVInviteGameRef: stateVInviteGame.ref,
    };
  },
  computed: {
    InviteGameInfo() {
      return this.stateVInviteGameRef.current;
    },
    vInviteGame() {
      if (this.stateVInviteGameRef.current) {
        return this.stateVInviteGameRef.current;
      } else {
        return {
          inviteUserNumber: 0,
          inviterNickName: '',
          inviterUserId: '',
          totalReward: '0',
          // gameLevel: 'zero',
          // inviterGameLevel: 'zero',
          coin: 'GOLD',
        } as API.GameInviteUserInfoVO;
      }
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，       revalidation  ，   0
     */
    refreshVInviteGame(timeout?: number, cb?: () => void) {
      stateVInviteGame
        .tryUpdate(timeout == null ? REVALIDATION_MS : timeout)
        .then(() => {
          if (cb) {
            cb();
          }
        });
    },
  },
});

export default stateVInviteGame;
