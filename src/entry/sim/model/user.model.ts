const danaAcc = '{"payeeName":"test","payeeAccount":"0820210315021"}'; //;//
const createDays = 1;
export const mockUserInfo = {
  userId: '10770829864337849',
  nickName: 'SimNickName',
  avatar:
    'https://yt3.ggpht.com/-7ISvgbiwKQE/AAAAAAAAAAI/AAAAAAAAAAA/VG9UeM8Z8EQ/s108-c-k-c0x00ffffff-no-rj-mo/photo.jpg',
  userGrade: 1,
  userGradeName: 'Gold',
  point: 10500,

  //...
  canFreeRedeem: false,
  countryCode: 'ID',
  danaAcc,
  // paytmAcc: '1111111111',
  deviceId: 'And.54e72c0f6d52fbea0a0657ee3dd2e70e.APK001',

  realInviteCount: 3,
  // signInCount: 2.111,
  // whatsAppAcc: "8613112345679",
  canModifyPayAcc: true,

  //v1.6.1
  createTime: new Date().getTime() - createDays * 24 * 3600 * 1000,
  //signInStatus: 1,
  redeemTodayFree: true,
  redeemTomorrowFree: true,
  createDays,
  // day2SignMap: {
  //   1: 1,
  //   2: 1
  // }
};
