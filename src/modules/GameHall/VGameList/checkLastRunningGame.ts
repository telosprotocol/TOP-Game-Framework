import { MS_SECOND } from '@/constants/time';
import { getCurTopPageName, getIsInGame } from '@/js_bridge/js_call_app_base';
import { wait } from '@/utils/wait';
import { getRunningGameGameHallController } from '@/vservices/client/GameHallController';
import { openVGame } from './openGame';

let isLastRunningGameChecked = false;

let isLastAutoOpenedGame = false;

async function getIsGameTabActive() {
  const res = await getCurTopPageName();
  return res.data === 'bounds';
}
/**
 *
 * @from init:tab  ，click,
 * @return boolean  {IsContinue} boolean
 */
export async function checkLastRunningGame(from: 'init' | 'click') {
  if (isLastRunningGameChecked) {
    return true;
  }
  //1.
  const resRunningGame = await getRunningGameGameHallController();
  isLastRunningGameChecked = true;
  const runningGameData = resRunningGame.data;
  if (!resRunningGame.success || !runningGameData) {
    isLastRunningGameChecked = true;
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log(
        '[GAME] checkLastRunningGame, noRunningGame continue',
        resRunningGame.success,
        runningGameData
      );
    }
    return true;
  }
  // only for init
  if (from !== 'click' && !getIsGameTabActive()) {
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log(
        '[GAME] checkLastRunningGame, currentTab not active,exit',
        resRunningGame
      );
    }
    return false;
  }
  const resIsInGame = await getIsInGame();
  if (resIsInGame.Result === 1 && resIsInGame.data) {
    //          ，
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log(
        '[GAME] checkLastRunningGame,is aready in game ,ignored',
        runningGameData?.gameId
      );
    }
    return false;
  }
  if (isLastAutoOpenedGame) {
    // init click       ，
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log(
        '[GAME] checkLastRunningGame, current has opened,ignore',
        runningGameData?.gameId
      );
    }
    return false;
  }
  if (process.env.VUE_APP_ENV_SERVER === 'development') {
    console.log(
      '[GAME] checkLastRunningGame, start openGame',
      runningGameData?.gameId
    );
  }
  isLastAutoOpenedGame = true;
  if (
    await openVGame(
      runningGameData.gameId,
      runningGameData.orientation,
      'gamehall_err_exit'
    )
  ) {
    await wait(MS_SECOND * 2);
    return false;
  }
  return false;
}
