import type { IConfigBannerModel } from './config/lazyConfigs/tryInitConfigBanner';
import type { ConfigNumUtils } from './config/lazyConfigs/utils';

export function getBannerListByBannerModel(
  model: IConfigBannerModel,
  sectionName: string,
  groupName: string
) {
  const sections = model?.sections;
  // bannerConfigUtils.tryGetConfig();
  if (!sections) {
    return null;
  }

  const walletSection = sections.find((item) => {
    return item.sectionName === sectionName;
  });
  if (!walletSection) {
    return null;
  }
  const bonusGroup = walletSection.groups.find((item) => {
    return item.groupName === groupName;
  });
  if (!bonusGroup) {
    return null;
  }
  return bonusGroup.banners;
}
export class BannerUtils {
  utils: ConfigNumUtils<IConfigBannerModel>;
  constructor(utils: ConfigNumUtils<IConfigBannerModel>) {
    this.utils = utils;
  }

  getBannerList(sectionName: string, groupName: string) {
    const model = this.utils.getConfig();
    return getBannerListByBannerModel(model, sectionName, groupName);
  }
  canBannerShow(bannerItem: { url?: string }, gaid: string | null) {
    if (!bannerItem || !bannerItem.url) {
      return false;
    }
    if (!gaid) {
      if (bannerItem.url && bannerItem.url.indexOf('{GAID}') >= 0) {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('Banner', bannerItem.url, 'banner to hide', 'no gaid');
        }
        return false;
      }
      return true;
    }
    return true;
  }
  filterBannerWithGaid(
    bannerList: { url?: string }[] | null,
    gaid: string | null
  ) {
    if (!bannerList) {
      return bannerList;
    }
    if (!gaid) {
      return bannerList.filter((item) => {
        if (item.url && item.url.indexOf('{GAID}') >= 0) {
          if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
            console.log('Banner', item.url, 'banner to hide', 'no gaid');
          }
          return false;
        }
        return true;
      });
    }
    return bannerList;
  }
  getBannerListWithGaidFilter(
    sectionName: string,
    groupName: string,
    gaid: string | null
  ) {
    const bannerList = this.getBannerList(sectionName, groupName);
    if (bannerList) {
      return this.filterBannerWithGaid(bannerList, gaid);
    }
    return bannerList;
  }
}
