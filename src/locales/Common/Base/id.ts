import type { LangInfoBase } from './en';
const LANGINFO_BASE: Omit<LangInfoBase, 'xMin' | 'xSec'> = {
  OK: 'Baik',
  Cancel: 'Batalkan',
  Confirm: 'Konfirmasi',
  CONFIRM: 'KONFIRMASI',
  Warning: 'Peringatan',
  Tips: 'Tips',
  IKnown: 'Okay',

  YES: 'YA',
  NO: 'TIDAK',
  see: 'lihat',
  Rules: 'Aturan',
  rules: 'aturan',

  Today: 'Hari Ini',
  Coins: 'Koin',

  xCoins: '{n} Koin',
  xCheckIns: '{n} check-in',
  xReferrals: '{n} referral',
  xDays: '{n} hari',
  xMinutes: '{n} menit',
  // n
  xD: '{0}h',
  xH: '{0}j',
  xM: '{0}m',
  xS: '{0}d',
  xRp: 'Rp{n}',
  nsRp: 'Rp {n}',

  GotNCoins: `Anda mendapat {n}`,
  GotNAdCoins: 'Koin iklan +{n}',
  earn_coin_point: 'Mendapatkan {n}.',
  earn_coin_checkin: 'Mendapatkan {n} check-in.',

  free: 'Gratis',
  xNewUsers: 'check-in hari ke-{n}',

  Get: 'Dapatkan',
  Claim: 'Klaim',
  Pending: 'Tertunda',
  Done: 'Selesai',
  Watch: 'Tonton',
  PlayNow: 'Main Sekarang',

  Current: 'Saat ini',
  NotFound: 'Tidak ditemukan',
  SubmitSuccess: 'Sukses terkirim.',
  CopySucceeded: 'Berhasil menyalin!',
  CopyLink: 'Salin Tautan',
  CopyReferralLink: 'Salin Tautan Saya',
  Change: 'Tambahkan',
  dataUpdateTime: 'Terakhir diperbarui: {xxx}',

  NoMore: 'Tidak ada lagi',
  Loading: 'Memuat',
  FailLoad: 'Gagal memuat. Cobalah lagi nanti.',
  PullToRefresh: 'Tarik untuk menyegarkan',
  ReleaseToRefresh: 'Lepas untuk menyegarkan',
  RequestError: 'Maaf, sistem sedang sibuk. Coba lagi nanti.',
  UnknownError: 'Kesalahan yang tidak diketahui',
  dataErrorRetry: 'Kesalahan data, coba lagi',
  dataRefreshError: 'Penyegaran data gagal',
  NoData: 'Tidak ada data.',

  Refresh: 'Klick Refresh',
  EventOverTip: 'Acara parantos réngsé',

  notLoginedTip: 'Anda belum login',
  loginToView: 'Masuk untuk melihat',

  DataUpdating: 'Pembaruan data……',
  NETWORK_ERROR: 'Kesalahan Jaringan',
  REQUEST_ABORT: 'Permintaan dibatalkan',
  requestFailedWithStatus: 'Permintaan gagal dengan kode status {code}',
  Timeout: 'Waktu habis',

  //
  Description: 'Deskripsi',
  // net_weak: 'Jaringan lemah & Kesalahan jaringan',
  xMinutesAgo: '{time} menit yang lalu',
  userJustRmoney: '{user} baru saja menukar {money}',

  NotSupport: 'Versi saat ini tidak mendukung, harap perbarui versi',
  Paste: 'Salin',

  MonthName: [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ],
};

export default LANGINFO_BASE;
