// export const NETWORK_ERROR = 'NETWORK_ERROR'
// export const REQUEST_ABORT = 'REQUEST_ABORT'
const LANGINFO_EN = {
  OK: 'OK',
  Cancel: 'Cancel',
  Confirm: 'Confirm',
  CONFIRM: 'CONFIRM',
  Warning: 'Warning',
  YES: 'YES',
  NO: 'NO',
  see: 'see',
  Tips: 'Tips',
  Rules: 'Rules',
  rules: 'rules',
  Today: 'Today',
  Coins: 'Coins',
  IKnown: 'Okay',

  xCoins: '{n} Coin|{n} Coins',
  xCheckIns: '{n} check-in|{n} check-ins',
  xReferrals: '{n} referral|{n} referrals',
  xDays: '{n} day|{n} days',
  xMinutes: '{n} minute|{n} minutes',
  xMin: '{0}min',
  xSec: '{0}sec',
  // n
  xD: '{0}d',
  //
  xH: '{0}h',
  xM: '{0}m',
  xS: '{0}s',
  xRp: '{n}Rp',
  nsRp: '{n} Rp',

  GotNCoins: `You've got {n}`,
  GotNAdCoins: 'Ad reward {n}',

  earn_coin_point: 'Earned {n}.',
  earn_coin_checkin: '{n} check-ins earned.',

  free: 'free',
  xNewUsers: 'checkin on day {n}',

  Get: 'Get',
  Claim: 'Claim',
  Pending: 'Pending',
  Done: 'Done',
  Watch: 'Watch',
  PlayNow: 'Play Now',

  Current: 'Current',
  NotFound: 'Not Found',
  SubmitSuccess: 'Submit success.',
  CopySucceeded: 'Copy succeeded!',
  CopyLink: 'Copy Link',
  CopyReferralLink: 'Copy Referral Link',
  Change: 'Change',

  dataUpdateTime: 'Last updated: {xxx}',

  NoMore: 'No more',
  Loading: 'Loading',
  FailLoad: 'Failed to load, please try again later.',
  PullToRefresh: 'Pull to refresh',
  ReleaseToRefresh: 'Release to refresh',

  RequestError: 'The server is busy now. Try again later.',
  UnknownError: 'Unknown Error',
  dataErrorRetry: 'Data error, please try again',
  dataRefreshError: 'Data refresh failed',

  NoData: 'No data.',

  Refresh: 'Click Refresh',
  EventOverTip: 'The event is over',

  notLoginedTip: 'You are not logged in',
  loginToView: 'Login to view',

  DataUpdating: 'Data updating……',

  NETWORK_ERROR: 'Network Error',
  REQUEST_ABORT: 'Request aborted',
  requestFailedWithStatus: 'Request failed with status code {code}',
  Timeout: 'Timeout',

  //
  Description: 'Description',

  // net_weak: 'Weak network & Network error',

  xMinutesAgo: '{time} minutes ago',
  userJustRmoney: '{user} just redeemed {money}',

  NotSupport: 'The current version does not support, please update the version',

  Paste: 'Paste',

  MonthName: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November ',
    'December',
  ],
};
//
//

export type LangInfoBase = typeof LANGINFO_EN;
export default LANGINFO_EN;
