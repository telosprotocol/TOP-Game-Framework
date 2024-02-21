export const PAYMENT_PLATFORM_TYPES = {
  paytm: 1,
  dana: 3, //?
};

/**
 *
 */
export const VERSION_CONTRY_CODE = {
  IN: 'IN',
  ID: 'ID',
  US: 'US',
};

export type VERSION_CONTRY_MAP_TYPE = Partial<typeof VERSION_CONTRY_CODE>;

export type VERSION_CONTRY_CODE_KEY = keyof VERSION_CONTRY_MAP_TYPE;

export const SUPPORT_LANG_CODE = {
  /**
   *
   */
  en: 'en',
  /**
   *  ( )
   */
  hi: 'hi',

  /**
   *
   */
  id: 'id',
};

export type SUPPORT_LANG_MAP_TYPE = Partial<typeof SUPPORT_LANG_CODE>;

export type SUPPORT_LANG_CODE_KEY = keyof SUPPORT_LANG_MAP_TYPE;
