const isDEV = process.env.VUE_APP_ENV_SERVER === 'development';
const SHARELINK_SERVER_PN = 'https://sharepn.xxx.xxx';
const SHARELINK_SERVER_DN = 'http://sharedn.xxx.xxx';

export const API_SHARELINK_SERVER = isDEV
  ? SHARELINK_SERVER_DN
  : SHARELINK_SERVER_PN;
