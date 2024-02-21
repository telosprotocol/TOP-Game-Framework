import { BannerOpType } from '@/constants/BannerOpType';
import { IBridgePushEvent, PUSH_TYPE_NAV } from '@/constants/push';
import { MS_DAY } from '@/constants/time';
import {
  getStorageItemOperators,
  KeyNavigationCmdWaitForLogin,
} from '@/controller/CommonLocalStorage';
import { storeCommit, storeDispatch } from '@/store/util';
import { bannerNavigation } from '@/utils/navigator';
import { Base64 } from 'js-base64';
import { trim } from 'lodash-es';
import {
  IPushCommandBase,
  IPushCommandNavigation,
  IPushCommondBeforeCheck,
  PUSH_TYPE_ALL,
} from './../constants/push';

/**
 *        cmd
 */
export const navigationCmdWaitForLoginOp = getStorageItemOperators<
  Omit<IPushCommandNavigation, 'command'>
>(KeyNavigationCmdWaitForLogin, {
  timeout: MS_DAY * 10,
});
/**
 *   push
 * @param pushEvent
 * @returns
 */
export function dealPushEvent(pushEvent: IBridgePushEvent) {
  const { type, maps: pushCommand } = pushEvent;
  //     （  PUSH_TYPE_NAV)
  // if (pushCommand.reportSubCategory) {
  //   const iSubCategory = parseInt(pushCommand.reportSubCategory, 10);
  //   if (!isNaN(iSubCategory)) {
  //     // //
  //     // reportTaskBehavior({
  //     //   subCategory: iSubCategory,
  //     //   count: 1,
  //     //   from: 'Push',
  //     //   needReport: true,
  //     // });
  //     if (type === PUSH_TYPE_OLD) {
  //       //
  //       return;
  //     }
  //   } else {
  //     console.log('[CMD] task reportSubCategory is invalid');
  //   }
  // }
  //      PUSH_TYPE_NAV
  if (type !== PUSH_TYPE_NAV && type !== PUSH_TYPE_ALL) {
    console.log('[CMD] not support type', type);
    return;
  }
  if (!pushCommand) {
    console.log('[CMD] no maps data ignored', type);
    return;
  }
  pushCommand._name =
    pushCommand._name ||
    createPushCommandName(pushCommand.command || 'unkown_push');
  switch (pushCommand.command) {
    case 'navigation':
      dealNavigation(pushCommand);
      break;
    // case 'refresh':
    //   logCmd(pushCommand, 'before location.reload()');
    //   location.reload();
    //   break;
    // case 'store-commit':
    // case 'store-dispatch':
    //   dealStore(pushCommand);
    //   break;
    default:
      logCmd(
        pushCommand,
        'not supported command',
        (pushCommand as any).command
      );
      break;
  }
}

let curNo = 0;
export function createPushCommandName(prefix: string) {
  return `${prefix}_${++curNo}`;
}

const CMD_TAG = '[CMD]';

//#region  base methods

function logCmd(pushCommand: IPushCommandBase, ...data: any[]) {
  console.log(`${CMD_TAG}-${pushCommand._name}`, ...data);
}

function parseBaseJson(strBase64?: string) {
  if (!strBase64) {
    return null;
  }
  const str2 = Base64.decode(strBase64);
  return JSON.parse(str2);
}

/**
 *
 * @param pushCommand
 * @returns
 */
async function doCmdBeforeCheck(pushCommand: IPushCommondBeforeCheck) {
  const { beforeCheckPayload, beforeCheckType } = pushCommand;
  if (!beforeCheckType) {
    return true;
  }
  let payload = null;
  if (beforeCheckPayload) {
    try {
      payload = parseBaseJson(beforeCheckPayload);
    } catch (ex) {
      logCmd(
        pushCommand,
        'beforeCheck:Error [interrupt]',
        'jsonParseError',
        ex,
        beforeCheckPayload
      );
      return false;
    }
  }
  try {
    const checkRes = await storeDispatch<any>(beforeCheckType, payload);
    if (checkRes.Result !== 1 || checkRes.checkDataError) {
      logCmd(pushCommand, 'beforeCheck:Fail [interrupt]', checkRes);
      return false;
    } else {
      logCmd(pushCommand, 'beforeCheck:OK', checkRes);
      return true;
    }
  } catch (ex) {
    logCmd(
      pushCommand,
      'beforeCheck:Error [interrupt]',
      'dispatchError',
      ex,
      beforeCheckType,
      beforeCheckPayload
    );
    return false;
  }
}
//#endregion

//#region navigation

export async function dealNavigation(
  pushCommand: Omit<IPushCommandNavigation, 'command'>
) {
  const isBeforeCheckOk = await doCmdBeforeCheck(pushCommand);
  if (!isBeforeCheckOk) {
    return;
  }
  let { url = '' } = pushCommand;
  url = trim(url);
  if (!url) {
    return false;
  }
  logCmd(pushCommand, ' before call navigation', url);
  await bannerNavigation({
    url,
    opType: BannerOpType.AppLink,
    from: 'command_nav',
  });
  await _afterDealNavigation(pushCommand);
}

async function _afterDealNavigation(
  pushCommand: Omit<IPushCommandNavigation, 'command'>
) {
  const { afterType, afterStoreType, afterStorePayload } = pushCommand;
  if (!afterStoreType || !afterType) {
    return; //   after
  }
  let actualPayload;
  try {
    actualPayload = parseBaseJson(afterStorePayload);
  } catch (ex) {
    logCmd(pushCommand, 'afterStorePayload parseError', afterStorePayload);
    return;
  }
  if (pushCommand.afterType === 'store-commit') {
    storeCommit(afterStoreType, actualPayload);
    logCmd(pushCommand, `store commit end`, afterStoreType, actualPayload);
  } else {
    try {
      const res = await storeDispatch(afterStoreType, actualPayload);
      logCmd(
        pushCommand,
        `store dispatch end:`,
        afterStoreType,
        res,
        actualPayload
      );
    } catch (ex) {
      logCmd(
        pushCommand,
        `store dispatch end error:`,
        afterStoreType,
        ex,
        actualPayload
      );
    }
  }
}

//#endregion
