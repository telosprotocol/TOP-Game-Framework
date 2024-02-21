import { BannerUtils } from './banner.utils';
import tryInitConfigBanner from './config/lazyConfigs/tryInitConfigBanner';

// function getBannerList(sectionName: string, groupName: string) {
//   const sections = bannerConfigUtils.getConfig().sections;
//   // bannerConfigUtils.tryGetConfig();
//   if (!sections) {
//     return null;
//   }

//   const walletSection = sections.find((item) => {
//     return item.sectionName === sectionName;
//   });
//   if (!walletSection) {
//     return null;
//   }
//   const bonusGroup = walletSection.groups.find((item) => {
//     return item.groupName === groupName;
//   });
//   if (!bonusGroup) {
//     return null;
//   }
//   return bonusGroup.banners;
// }

// export function canBannerShow(
//   bannerItem: { url?: string },
//   gaid: string | null
// ) {
//   if (!bannerItem || !bannerItem.url) {
//     return false;
//   }
//   if (!gaid) {
//     if (bannerItem.url && bannerItem.url.indexOf('{GAID}') >= 0) {
//       if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
//         console.log('Banner', bannerItem.url, 'banner to hide', 'no gaid');
//       }
//       return false;
//     }
//     return true;
//   }
//   return true;
// }

// export function filterBannerWithGaid(
//   bannerList: { url?: string }[] | null,
//   gaid: string | null
// ) {
//   if (!bannerList) {
//     return bannerList;
//   }
//   if (!gaid) {
//     return bannerList.filter((item) => {
//       if (item.url && item.url.indexOf('{GAID}') >= 0) {
//         if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
//           console.log('Banner', item.url, 'banner to hide', 'no gaid');
//         }
//         return false;
//       }
//       return true;
//     });
//   }
//   return bannerList;
// }

// export function getBannerListWithGaidFilter(
//   sectionName: string,
//   groupName: string,
//   gaid: string | null
// ) {
//   const bannerList = getBannerList(sectionName, groupName);
//   if (bannerList) {
//     return filterBannerWithGaid(bannerList, gaid);
//   }
//   return bannerList;
// }
export const bannerUtilsIns = new BannerUtils(tryInitConfigBanner());

export const canBannerShow = bannerUtilsIns.canBannerShow;

export const filterBannerWithGaid = bannerUtilsIns.filterBannerWithGaid;

export const getBannerListWithGaidFilter =
  bannerUtilsIns.getBannerListWithGaidFilter;
