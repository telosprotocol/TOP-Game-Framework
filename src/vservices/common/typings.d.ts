declare namespace CAPI {
  type BaseVO = {
    /**         (200-299)     */
    success: boolean;
    /**               '200:      ,204:       [  ](/static/doc/response_code.html) */
    code: number;
    /**      */
    message: string;
    /**               ,                 */
    logno?: string;
    /**      */
    name: string;
    /**       */
    servertime: number;
  };

  type BindingMobileInfoVO = {
    /**         */
    lastBindingTime?: string;
    /**          */
    lastBindingMobile?: string;
    /**            */
    upDataMobile?: boolean;
  };

  type getVisitorWithdrawalInfoWithdrawalControllerParams = {
    /** user ID,Long   (0~9223372036854775807) */
    userId: string;
  };

  type LastBankCardRecord = {
    /**    */
    type?: string;
    /**    */
    name?: string;
    /**    */
    email?: string;
    /**       */
    mobile?: string;
    /**      */
    bankNo?: string;
  };

  type ObjectVOString = {
    /**         (200-299)     */
    success: boolean;
    /**               '200:      ,204:       [  ](/static/doc/response_code.html) */
    code: number;
    /**      */
    message: string;
    /**               ,                 */
    logno?: string;
    /**      */
    name: string;
    /**       */
    servertime: number;
    /**          200    */
    data: string;
  };

  type ObjectVOWithdrawalInfoViewVO = {
    /**         (200-299)     */
    success: boolean;
    /**               '200:      ,204:       [  ](/static/doc/response_code.html) */
    code: number;
    /**      */
    message: string;
    /**               ,                 */
    logno?: string;
    /**      */
    name: string;
    /**       */
    servertime: number;
    data: WithdrawalInfoViewVO;
  };

  type PayAutoWithdrawInfoVO = {
    /**        */
    limitAmount?: BigDecimalString;
    /**       Enum (payTest:PAY_NONE,tarsPay:PAY_TARS,tarsPayMock:PAY_TARS_MOCK,kasiPay:PAY_KASI,payHere:PAY_HERE,payerMax:PAY_PAYERMAX) */
    payPlatform?:
      | 'PAY_NONE'
      | 'PAY_TARS'
      | 'PAY_TARS_MOCK'
      | 'PAY_KASI'
      | 'PAY_HERE'
      | 'PAY_PAYERMAX';
    /**      Enum (MOCK_CHANNEL:MOCK_CHANNEL,EWALLET_DANA:EWALLET_DANA,EWALLET_GOPAY:EWALLET_GOPAY,EWALLET_LINKAJA:EWALLET_LINKAJA,EWALLET_OVO:EWALLET_OVO,EWALLET_SHOPEEPAY:EWALLET_SHOPEEPAY,QRIS:QRIS,Bank Mandiri (Persero) Tbk:BANK_MANDIRI,PT Bank Permata Tbk:BANK_PERMATA,Bank Negara Indonesia:BANK_BNI,PT Bank CIMB Niaga Tbk:BANK_CIMB,Bank Central Asia Tbk:BANK_BCA,Bank Rakyat Indonesia:BANK_BRI,Bank Syariah Indonesia:BANK_BSI,Bank Danamon Indonesia Tbk :BANK_DANAMON) */
    payChannel?:
      | 'MOCK_CHANNEL'
      | 'EWALLET_DANA'
      | 'EWALLET_GOPAY'
      | 'EWALLET_LINKAJA'
      | 'EWALLET_OVO'
      | 'EWALLET_SHOPEEPAY'
      | 'QRIS'
      | 'BANK_MANDIRI'
      | 'BANK_PERMATA'
      | 'BANK_BNI'
      | 'BANK_CIMB'
      | 'BANK_BCA'
      | 'BANK_BRI'
      | 'BANK_BSI'
      | 'BANK_DANAMON';
    /** withdraw type and amount list */
    withdrawTypeAndAmountList?: WithdrawTypeAndAmount[];
  };

  type PayLimitWithdrwaInfoVO = {
    /**   Id */
    id?: string;
    /**      */
    createdDate?: number;
    /**      */
    modifiedDate?: number;
    /**          */
    limitAmount?: BigDecimalString;
    /**             */
    limitTimeStamp?: string;
  };

  type PgErrorVO = {
    code?: string;
    message?: string;
  };

  type PocketGameVerifySessionDateVO = {
    /** userId */
    player_name?: string;
    /** currency, such as CNY,IDR,USD */
    currency?: string;
  };

  type PocketGameVerifySessionVO = {
    data?: PocketGameVerifySessionDateVO;
    error?: PgErrorVO;
  };

  type WithdrawalFeeVO = {
    /**            (  ) */
    minAmountForRatio?: BigDecimalString;
    /**         (RP  ) */
    fixedFee?: BigDecimalString;
    /**      */
    ratio?: BigDecimalString;
    /**       (RP  ) */
    firstMaxDiscount?: BigDecimalString;
  };

  type WithdrawalForAccountViewVO = {
    /**    */
    name?: string;
    /**    */
    icon?: string;
    /**      */
    type?: string;
    /**    (  /   ) */
    channelNumber?: string;
    /**     */
    countryCode?: number;
    /**        */
    isBank: boolean;
  };

  type WithdrawalForLastBankCardViewVO = {
    /**            */
    lastBankCardRecord?: LastBankCardRecord[];
  };

  type WithdrawalInfoViewVO = {
    /**      Enum (  :NORMAL,    :INITIAL_BENEFIT,    :SMALL_WITHDRAW,    :LIMIT_WITHDRAW,    :QUEUE_WITHDRAW,activity withdraw:ACTIVITY) */
    withdrawType?:
      | 'NORMAL'
      | 'INITIAL_BENEFIT'
      | 'SMALL_WITHDRAW'
      | 'LIMIT_WITHDRAW'
      | 'QUEUE_WITHDRAW'
      | 'ACTIVITY';
    payAutoWithdrawInfo?: PayAutoWithdrawInfoVO;
    payLimitWithdrwaInfoVO?: PayLimitWithdrwaInfoVO;
    withdrawQueueUserVO?: WithdrawQueueUserVO;
    /**      */
    totalGold?: BigDecimalString;
    /** total cash gold */
    totalCashGold?: BigDecimalString;
    /** bonus gold */
    totalBonusGold?: BigDecimalString;
    /** withdrawalAble gold */
    withdrawalAbleGold?: BigDecimalString;
    /** withdrawalAble cash gold */
    withdrawalAbleCashGold?: BigDecimalString;
    /** withdrawalAble bonus gold */
    withdrawalAbleBonusGold?: BigDecimalString;
    /** cash gold game bet multiple */
    gameMultiple?: BigDecimalString;
    /** bonus gold game bet multiple */
    bonusGameMultiple?: BigDecimalString;
    /**        */
    minAmount?: BigDecimalString;
    /**           */
    multipleRadix?: BigDecimalString;
    fee?: WithdrawalFeeVO;
    binding?: BindingMobileInfoVO;
    /**      */
    account?: WithdrawalForAccountViewVO[];
    withdrawalForLastBankCard?: WithdrawalForLastBankCardViewVO;
    /**      ,true:   ,false:      */
    hasWithdrawal?: boolean;
  };

  type WithdrawQueueUserVO = {
    /**     ，       */
    showQueueNum?: number;
    /**    */
    amount?: BigDecimalString;
    /**      Enum (MOCK_CHANNEL:MOCK_CHANNEL,EWALLET_DANA:EWALLET_DANA,EWALLET_GOPAY:EWALLET_GOPAY,EWALLET_LINKAJA:EWALLET_LINKAJA,EWALLET_OVO:EWALLET_OVO,EWALLET_SHOPEEPAY:EWALLET_SHOPEEPAY,QRIS:QRIS,Bank Mandiri (Persero) Tbk:BANK_MANDIRI,PT Bank Permata Tbk:BANK_PERMATA,Bank Negara Indonesia:BANK_BNI,PT Bank CIMB Niaga Tbk:BANK_CIMB,Bank Central Asia Tbk:BANK_BCA,Bank Rakyat Indonesia:BANK_BRI,Bank Syariah Indonesia:BANK_BSI,Bank Danamon Indonesia Tbk :BANK_DANAMON) */
    channelType?:
      | 'MOCK_CHANNEL'
      | 'EWALLET_DANA'
      | 'EWALLET_GOPAY'
      | 'EWALLET_LINKAJA'
      | 'EWALLET_OVO'
      | 'EWALLET_SHOPEEPAY'
      | 'QRIS'
      | 'BANK_MANDIRI'
      | 'BANK_PERMATA'
      | 'BANK_BNI'
      | 'BANK_CIMB'
      | 'BANK_BCA'
      | 'BANK_BRI'
      | 'BANK_BSI'
      | 'BANK_DANAMON';
    /**      */
    inviteNum?: number;
    /**        */
    gameNum?: number;
    /**          */
    improveQueueNum?: BigDecimalString;
    /**               ，       */
    showInviteImproveQueueNum?: number;
    /**                ，       */
    showGameImproveQueueNum?: number;
    /** tomorrow queue num */
    tomorrowQueueNum?: number;
    /** more recharge can withdraw */
    moreRechargeCanWithdrawAmount?: BigDecimalString;
  };

  type WithdrawTypeAndAmount = {
    /** withdraw type Enum (  :NORMAL,    :INITIAL_BENEFIT,    :SMALL_WITHDRAW,    :LIMIT_WITHDRAW,    :QUEUE_WITHDRAW,activity withdraw:ACTIVITY) */
    withdrawType?:
      | 'NORMAL'
      | 'INITIAL_BENEFIT'
      | 'SMALL_WITHDRAW'
      | 'LIMIT_WITHDRAW'
      | 'QUEUE_WITHDRAW'
      | 'ACTIVITY';
    /** withdraw amount */
    amount?: BigDecimalString;
  };
}
