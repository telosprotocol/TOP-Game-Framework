import type { TYPE_TP_SHARE_TYPES } from './../constants/invite';
import type { SHARE_PLATFORM } from '@/constants/invite';
import { share_bridge } from '@/js_bridge/js_call_app';
import ClipboardAction from './ClipboardAction';

//
export async function tryCommonShare(payload: {
  shareLink: string;
  shareTitle: string;
  shareText: string;
  shareImage: string;
  //  SHARE_TYPES
  // for app
  inviteCode?: string;
  platforms?: SHARE_PLATFORM[];
  shareType: number;
  traceParams?: string;
}) {
  const copyAction = new ClipboardAction();
  copyAction.startCopyText(
    `${payload.shareTitle}\r\n${payload.shareText}\r\n${payload.shareLink}`
  );
  if (window.GC.isInApp) {
    //
    share_bridge({
      url: payload.shareImage,
      content: `${payload.shareTitle}\r\n${payload.shareText}\r\nreplace_@url@_replace`,
      shareType: payload.shareType as TYPE_TP_SHARE_TYPES,
      showShareDialog: true,
      inviteCode: payload.inviteCode || '',
      traceParams: payload.traceParams,
      // traceParams: JSON.stringify({
      //   pfid: this.pfid,
      //   spanMS: payload.spanMS,
      // }),
      shareLink: payload.shareLink,
      platforms: payload.platforms,
    });
    return {
      type: 'native',
    };
  }
  const supportShare = !!navigator.share;
  if (supportShare) {
    navigator.share({
      title: payload.shareTitle,
      text: payload.shareText,
      url: payload.shareLink,
    });
    return {
      type: 'web',
    };
  } else {
    //Toast(this.$t('Base.CopySucceeded'))
    return {
      type: 'copy',
    };
  }
}
